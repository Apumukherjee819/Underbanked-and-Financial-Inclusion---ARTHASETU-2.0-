/**
 * Audit Routes
 * Hash-chain audit trail with blockchain anchoring
 */

import { Router } from 'express';
import db from '../db/connection.js';
import { authenticate } from '../middleware/auth.js';
import { verifyChain, computeMerkleRoot, generateAuditSummary } from '../crypto/hash.js';
import { anchorToBlockchain, verifyAnchor, getAnchorStatus } from '../utils/blockchainAnchor.js';

const router = Router();

// GET /audit/trail - Get user's audit trail
router.get('/trail', authenticate, async (req, res, next) => {
  try {
    const { limit = 50, offset = 0, eventType, startDate, endDate } = req.query;
    let query = 'SELECT * FROM audit_immutable WHERE user_id = $1';
    const params = [req.user.userId];
    let paramIdx = 2;
    if (eventType) { query += ` AND event_type = $${paramIdx++}`; params.push(eventType); }
    if (startDate) { query += ` AND created_at >= $${paramIdx++}`; params.push(startDate); }
    if (endDate) { query += ` AND created_at <= $${paramIdx++}`; params.push(endDate); }
    query += ` ORDER BY chain_sequence DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
    params.push(parseInt(limit), parseInt(offset));
    const result = await db.query(query, params);
    const countResult = await db.query('SELECT COUNT(*) FROM audit_immutable WHERE user_id = $1', [req.user.userId]);
    res.json({ entries: result.rows, total: parseInt(countResult.rows[0].count), limit: parseInt(limit), offset: parseInt(offset) });
  } catch (err) { next(err); }
});

// GET /audit/verify-chain - Verify hash chain integrity
router.get('/verify-chain', authenticate, async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM audit_immutable ORDER BY chain_sequence ASC LIMIT 1000');
    const verification = verifyChain(result.rows);
    res.json({ verification, entriesChecked: result.rows.length });
  } catch (err) { next(err); }
});

// GET /audit/summary - Get audit summary
router.get('/summary', authenticate, async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM audit_immutable WHERE user_id = $1 ORDER BY chain_sequence ASC', [req.user.userId]);
    const summary = generateAuditSummary(result.rows);
    res.json(summary);
  } catch (err) { next(err); }
});

// POST /audit/anchor - Anchor audit root to blockchain
router.post('/anchor', authenticate, async (req, res, next) => {
  try {
    const result = await db.query('SELECT entry_hash FROM audit_immutable ORDER BY chain_sequence DESC LIMIT 1');
    if (result.rows.length === 0) return res.status(400).json({ error: 'no_entries' });
    const merkleRoot = result.rows[0].entry_hash;
    const anchor = anchorToBlockchain(merkleRoot);
    const verification = verifyAnchor(anchor);
    res.json({ anchor, verification, merkleRoot });
  } catch (err) { next(err); }
});

// GET /audit/merkle-root - Compute current Merkle root
router.get('/merkle-root', authenticate, async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM audit_immutable ORDER BY chain_sequence ASC');
    const merkleRoot = computeMerkleRoot(result.rows);
    res.json({ merkleRoot, totalEntries: result.rows.length });
  } catch (err) { next(err); }
});

// GET /audit/export - Export audit trail
router.get('/export', authenticate, async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM audit_immutable WHERE user_id = $1 ORDER BY chain_sequence ASC', [req.user.userId]);
    const summary = generateAuditSummary(result.rows);
    res.json({ format: 'JSON', retentionDays: 2555, chainIntegrity: summary.chainIntegrity, totalEntries: result.rows.length, entries: result.rows.map(e => ({ id: e.id, eventType: e.event_type, eventAction: e.event_action, severity: e.event_severity, success: e.success, createdAt: e.created_at })) });
  } catch (err) { next(err); }
});

export default router;
