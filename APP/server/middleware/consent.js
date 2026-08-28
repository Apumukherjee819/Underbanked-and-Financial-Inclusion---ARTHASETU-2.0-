/**
 * Consent Middleware
 * Verifies cryptographic consent tokens before data access
 */

import db from '../db/connection.js';
import { sha3_256 } from '../crypto/pqc.js';

export async function requireConsent(consentType) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'unauthenticated', message: 'Login required' });
    }
    const consentToken = req.headers['x-consent-token'];
    if (!consentToken) {
      return res.status(403).json({
        error: 'consent_required',
        message: `Consent required for: ${consentType}`,
        consentType,
      });
    }
    const tokenHash = sha3_256(consentToken);
    const result = await db.query(
      `SELECT * FROM consent_tokens 
       WHERE consent_token_hash = $1 AND status = 'active' AND user_id = $2`,
      [tokenHash, req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'invalid_consent', message: 'Consent token is invalid or revoked' });
    }
    const consent = result.rows[0];
    if (new Date(consent.expires_at) < new Date()) {
      await db.query(`UPDATE consent_tokens SET status = 'expired' WHERE id = $1`, [consent.id]);
      return res.status(403).json({ error: 'consent_expired', message: 'Consent has expired' });
    }
    if (consent.max_access_count && consent.current_access_count >= consent.max_access_count) {
      return res.status(403).json({ error: 'consent_limit_reached', message: 'Maximum access count reached' });
    }
    if (consent.consent_type !== consentType) {
      return res.status(403).json({ error: 'wrong_consent_type', message: `Expected consent type: ${consentType}` });
    }
    await db.query(
      `UPDATE consent_tokens SET current_access_count = current_access_count + 1 WHERE id = $1`,
      [consent.id]
    );
    req.consent = consent;
    next();
  };
}

export function verifyConsentToken(tokenHash, userId) {
  return db.query(
    `SELECT * FROM consent_tokens WHERE consent_token_hash = $1 AND user_id = $2 AND status = 'active'`,
    [tokenHash, userId]
  );
}
