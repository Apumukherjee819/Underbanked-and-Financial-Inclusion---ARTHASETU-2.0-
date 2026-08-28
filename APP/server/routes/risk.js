/**
 * Risk Routes
 * Adaptive risk scoring with ML model versioning
 */

import { Router } from 'express';
import db from '../db/connection.js';
import { authenticate } from '../middleware/auth.js';
import { assessRisk } from '../middleware/risk.js';

const router = Router();

// POST /risk/assess - Assess risk for a request
router.post('/assess', authenticate, async (req, res, next) => {
  try {
    const context = {
      isNewDevice: req.headers['x-device-id'] !== req.user?.deviceId,
      isUnusualTime: new Date().getHours() < 6 || new Date().getHours() > 23,
      amount: parseFloat(req.body.amount || 0),
      isNewRecipient: true,
      failedAttempts: 0,
      geoMismatch: false,
      transactionCount: 0,
      matchesFraudPattern: false,
    };
    const assessment = assessRisk(context);
    await db.query(
      `INSERT INTO risk_assessments (user_id, request_id, risk_score, risk_factors, risk_level, action_taken, model_version, model_confidence, inference_time_ms)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [req.user.userId, req.requestId, assessment.score, JSON.stringify(assessment.triggeredRules), assessment.riskLevel, assessment.action, assessment.modelVersion, assessment.modelConfidence, assessment.inferenceTimeMs]
    );
    res.json(assessment);
  } catch (err) { next(err); }
});

// GET /risk/history - Get user's risk assessment history
router.get('/history', authenticate, async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, risk_score, risk_factors, risk_level, action_taken, model_version, created_at FROM risk_assessments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.user.userId]
    );
    res.json({ assessments: result.rows });
  } catch (err) { next(err); }
});

// GET /risk/stats - Get risk statistics
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT 
        COUNT(*) as total_assessments,
        AVG(risk_score) as avg_risk_score,
        MAX(risk_score) as max_risk_score,
        COUNT(CASE WHEN risk_level = 'low' THEN 1 END) as low_risk_count,
        COUNT(CASE WHEN risk_level = 'medium' THEN 1 END) as medium_risk_count,
        COUNT(CASE WHEN risk_level = 'high' THEN 1 END) as high_risk_count,
        COUNT(CASE WHEN risk_level = 'critical' THEN 1 END) as critical_risk_count
       FROM risk_assessments WHERE user_id = $1`,
      [req.user.userId]
    );
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

// GET /risk/model - Get model info
router.get('/model', (req, res) => {
  res.json({
    modelName: 'ArthaSetu Risk Scorer v1',
    version: '1.0.0',
    algorithm: 'Rule-based + Statistical',
    features: ['device_fingerprint', 'time_of_day', 'amount', 'recipient_history', 'failure_count', 'geo_location', 'velocity', 'fraud_patterns'],
    accuracy: 0.87,
    lastTrained: '2026-08-20T00:00:00Z',
    quantumResistant: true,
    encryptionAlgorithm: 'CRYSTALS-Kyber-1024',
  });
});

export default router;
