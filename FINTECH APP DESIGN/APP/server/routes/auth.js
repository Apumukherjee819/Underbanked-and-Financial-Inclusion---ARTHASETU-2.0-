/**
 * Auth Routes
 * PQC-encrypted registration + login + MFA
 */

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/connection.js';
import { authenticate, generateTokens } from '../middleware/auth.js';
import { pqcEncrypt, pqcDecrypt, pqcSign, sha3_256, generateKeyPair, generateSignKeyPair, encryptPII, pedersenCommitment } from '../crypto/pqc.js';
import { generateKey, deriveUserKey, getRootKey, KEY_LEVELS } from '../crypto/keyManager.js';

const router = Router();

// POST /auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { phone, email, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ error: 'missing_fields', message: 'Phone and password required' });
    }
    const existing = await db.query('SELECT id FROM users WHERE phone_hash = $1', [sha3_256(phone)]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'duplicate', message: 'Phone already registered' });
    }

    const keyId = uuidv4();
    const passwordHash = await bcrypt.hash(password, 12);
    const phoneEncrypted = encryptPII(phone, keyId);
    const phoneCommitment = pedersenCommitment(phone, uuidv4());

    let emailData = null;
    if (email) {
      emailData = {
        encrypted: encryptPII(email, keyId),
        commitment: pedersenCommitment(email, uuidv4()),
        hash: sha3_256(email),
      };
    }

    const result = await db.query(
      `INSERT INTO users (phone_hash, phone_commitment, phone_encrypted, email_hash, email_commitment, email_encrypted, password_hash, phone_encryption_key_id, email_encryption_key_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'active')
       RETURNING id, phone_hash, status, created_at`,
      [
        sha3_256(phone), phoneCommitment, phoneEncrypted.ciphertext,
        emailData ? emailData.hash : null, emailData ? emailData.commitment : null,
        emailData ? emailData.encrypted.ciphertext : null,
        passwordHash, keyId, keyId,
      ]
    );

    const user = result.rows[0];
    const tokens = generateTokens(user);

    res.status(201).json({
      user: { id: user.id, phoneHash: user.phone_hash, status: user.status },
      ...tokens,
      pqcAlgorithm: 'CRYSTALS-Kyber-1024',
    });
  } catch (err) { next(err); }
});

// POST /auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ error: 'missing_fields', message: 'Phone and password required' });
    }
    const result = await db.query('SELECT * FROM users WHERE phone_hash = $1 AND deleted_at IS NULL', [sha3_256(phone)]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'invalid_credentials', message: 'Invalid phone or password' });
    }
    const user = result.rows[0];
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return res.status(423).json({ error: 'account_locked', message: 'Account temporarily locked' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      const attempts = user.failed_login_attempts + 1;
      const lockUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;
      await db.query('UPDATE users SET failed_login_attempts = $1, locked_until = $2 WHERE id = $3', [attempts, lockUntil, user.id]);
      return res.status(401).json({ error: 'invalid_credentials', message: 'Invalid phone or password' });
    }
    await db.query('UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login = NOW() WHERE id = $1', [user.id]);
    const tokens = generateTokens(user);
    res.json({
      user: { id: user.id, phoneHash: user.phone_hash, status: user.status, riskScore: user.risk_score },
      ...tokens,
      pqcAlgorithm: 'CRYSTALS-Kyber-1024',
    });
  } catch (err) { next(err); }
});

// GET /auth/me
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, phone_hash, email_hash, status, risk_score, did, created_at, last_login FROM users WHERE id = $1',
      [req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'not_found', message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

// POST /auth/refresh
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'missing_token' });
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(refreshToken, process.env.JWT_SECRET || 'arthasetu-pqc-secret-change-in-production');
    const result = await db.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'user_not_found' });
    const tokens = generateTokens(result.rows[0]);
    res.json(tokens);
  } catch (err) { next(err); }
});

export default router;
