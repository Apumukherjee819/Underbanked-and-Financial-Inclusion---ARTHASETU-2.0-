/**
 * Consent Routes
 * Smart Consent Management with cryptographic consent tokens
 */

import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/connection.js';
import { authenticate } from '../middleware/auth.js';
import { sha3_256, pqcSign } from '../crypto/pqc.js';
import { proveWithScope } from '../crypto/zkp.js';

const router = Router();

// POST /consent/grant
router.post('/grant', authenticate, async (req, res, next) => {
  try {
    const { bankAccountId, consentType, purpose, dataTypes, expiresInDays = 30, maxAccessCount } = req.body;
    if (!consentType || !purpose || !dataTypes) {
      return res.status(400).json({ error: 'missing_fields', message: 'consentType, purpose, and dataTypes required' });
    }
    const consentId = uuidv4();
    const consentToken = `cnt_${crypto.randomBytes(32).toString('hex')}`;
    const consentTokenHash = sha3_256(consentToken);
    const consentSignature = pqcSign(consentToken, 'user-private-key');
    const zkProof = proveWithScope(dataTypes.reduce((acc, dt) => ({ ...acc, [dt]: true }), {}), purpose);
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

    const result = await db.query(
      `INSERT INTO consent_tokens (id, user_id, bank_account_id, consent_type, purpose, data_types, consent_token, consent_token_hash, consent_signature, zk_scope_proof, zk_scope_hash, expires_at, max_access_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id, consent_type, purpose, status, expires_at`,
      [consentId, req.user.userId, bankAccountId || null, consentType, purpose, JSON.stringify(dataTypes), consentToken, consentTokenHash, Buffer.from(JSON.stringify(consentSignature)), zkProof.proofBytes, zkProof.scopeHash, expiresAt, maxAccessCount || null]
    );

    res.status(201).json({
      consent: result.rows[0],
      consentToken,
      zkProof: { proofType: zkProof.proofType, circuitId: zkProof.circuitId, scopeHash: zkProof.scopeHash },
      message: 'Store consentToken securely. Include as X-Consent-Token header for API access.',
    });
  } catch (err) { next(err); }
});

// GET /consent/list
router.get('/list', authenticate, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT id, consent_type, purpose, data_types, status, granted_at, expires_at, current_access_count, max_access_count
       FROM consent_tokens WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.userId]
    );
    res.json({ consents: result.rows, total: result.rows.length });
  } catch (err) { next(err); }
});

// POST /consent/revoke
router.post('/revoke', authenticate, async (req, res, next) => {
  try {
    const { consentId, reason } = req.body;
    const result = await db.query(
      `UPDATE consent_tokens SET status = 'revoked', revoked_at = NOW(), revocation_reason = $1
       WHERE id = $2 AND user_id = $3 AND status = 'active' RETURNING id, consent_type, status`,
      [reason || 'user_revoked', consentId, req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'not_found', message: 'Consent not found or already revoked' });
    }
    res.json({ consent: result.rows[0], message: 'Consent revoked successfully' });
  } catch (err) { next(err); }
});

// POST /consent/verify
router.post('/verify', authenticate, async (req, res, next) => {
  try {
    const { consentToken, requiredType } = req.body;
    const tokenHash = sha3_256(consentToken);
    const result = await db.query(
      `SELECT * FROM consent_tokens WHERE consent_token_hash = $1 AND status = 'active'`,
      [tokenHash]
    );
    if (result.rows.length === 0) {
      return res.json({ isValid: false, reason: 'token_not_found' });
    }
    const consent = result.rows[0];
    const isExpired = new Date(consent.expires_at) < new Date();
    const isWrongType = requiredType && consent.consent_type !== requiredType;
    const isLimitReached = consent.max_access_count && consent.current_access_count >= consent.max_access_count;
    res.json({
      isValid: !isExpired && !isWrongType && !isLimitReached,
      consentType: consent.consent_type,
      purpose: consent.purpose,
      dataTypes: consent.data_types,
      expiresAt: consent.expires_at,
      accessCount: consent.current_access_count,
      maxAccessCount: consent.max_access_count,
      isExpired, isWrongType, isLimitReached,
    });
  } catch (err) { next(err); }
});

export default router;
