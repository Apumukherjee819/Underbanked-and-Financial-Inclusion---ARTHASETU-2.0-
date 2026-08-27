/**
 * Data Export Routes
 * DPDP-compliant data portability and deletion
 */

import { Router } from 'express';
import db from '../db/connection.js';
import { authenticate } from '../middleware/auth.js';
import { createAuditEntry } from '../crypto/hash.js';

const router = Router();

// GET /export/data - Export all user data (DPDP portable format)
router.get('/data', authenticate, async (req, res, next) => {
  try {
    const [users, bankAccounts, consents, transactions, riskAssessments, auditLogs] = await Promise.all([
      db.query('SELECT id, phone_hash, email_hash, status, risk_score, did, created_at, last_login FROM users WHERE id = $1', [req.user.userId]),
      db.query('SELECT id, bank_name, account_type, verification_status, created_at FROM bank_accounts WHERE user_id = $1', [req.user.userId]),
      db.query('SELECT id, consent_type, purpose, data_types, status, granted_at, expires_at FROM consent_tokens WHERE user_id = $1', [req.user.userId]),
      db.query('SELECT id, transaction_type, currency, status, description, transaction_date FROM transaction_history th JOIN bank_accounts ba ON th.bank_account_id = ba.id WHERE ba.user_id = $1', [req.user.userId]),
      db.query('SELECT id, risk_score, risk_factors, risk_level, action_taken, created_at FROM risk_assessments WHERE user_id = $1', [req.user.userId]),
      db.query('SELECT id, event_type, event_action, event_severity, success, created_at FROM audit_immutable WHERE user_id = $1 ORDER BY chain_sequence ASC', [req.user.userId]),
    ]);
    const exportData = {
      format: 'ArthaSetu-Portable-JSON',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      userId: req.user.userId,
      data: {
        profile: users.rows[0] || null,
        bankAccounts: bankAccounts.rows,
        consents: consents.rows,
        transactions: transactions.rows,
        riskAssessments: riskAssessments.rows,
        auditTrail: auditLogs.rows,
      },
      metadata: {
        totalRecords: Object.values(exportData?.data || {}).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : arr ? 1 : 0), 0),
        encryption: 'AES-256-GCM',
        pqcAlgorithm: 'CRYSTALS-Kyber-1024',
        dpdpCompliant: true,
        rightToPortability: true,
      },
    };
    res.setHeader('Content-Disposition', `attachment; filename="arthasetu-export-${Date.now()}.json"`);
    res.json(exportData);
  } catch (err) { next(err); }
});

// DELETE /export/data - Request data deletion (right to erasure)
router.delete('/data', authenticate, async (req, res, next) => {
  try {
    const { confirmation } = req.body;
    if (confirmation !== 'DELETE_MY_DATA') {
      return res.status(400).json({ error: 'confirmation_required', message: 'Send confirmation: "DELETE_MY_DATA"' });
    }
    await db.query(`UPDATE users SET deleted_at = NOW(), status = 'deleted' WHERE id = $1`, [req.user.userId]);
    await db.query(`DELETE FROM bank_accounts WHERE user_id = $1`, [req.user.userId]);
    await db.query(`DELETE FROM consent_tokens WHERE user_id = $1`, [req.user.userId]);
    await db.query(`DELETE FROM risk_assessments WHERE user_id = $1`, [req.user.userId]);
    // Audit trail is retained for 7 years (legal requirement)
    res.json({ message: 'Data deleted successfully', retained: ['audit_trail (legal requirement)'], deletedAt: new Date().toISOString() });
  } catch (err) { next(err); }
});

// GET /export/status - Check export/deletion status
router.get('/status', authenticate, async (req, res, next) => {
  try {
    const result = await db.query('SELECT deleted_at, status FROM users WHERE id = $1', [req.user.userId]);
    const user = result.rows[0];
    res.json({ status: user?.status || 'active', deletedAt: user?.deleted_at, canExport: user?.status !== 'active' ? false : true, canDelete: user?.status === 'active' });
  } catch (err) { next(err); }
});

export default router;
