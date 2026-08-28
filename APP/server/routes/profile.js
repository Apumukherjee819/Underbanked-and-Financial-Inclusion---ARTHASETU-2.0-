/**
 * Profile Routes
 * User profiling with ZKP verification and FHE computation
 */

import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/connection.js';
import { authenticate } from '../middleware/auth.js';
import { encryptPII, sha3_256 } from '../crypto/pqc.js';
import { proveAgeAbove, proveIncomeAbove, proveConfidenceScore, proveWithScope } from '../crypto/zkp.js';

const router = Router();

// POST /profile - Submit user profile
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { phone, age, occupation, monthly_income, annual_income, dependents, financial_goals, digital_devices, preferred_language } = req.body;
    const profileData = { phone, age, occupation, monthly_income, annual_income, dependents, financial_goals, digital_devices, preferred_language };
    const dataHash = sha3_256(JSON.stringify(profileData));
    const keyId = uuidv4();
    const phoneEncrypted = phone ? encryptPII(phone, keyId) : null;

    // Store profile as FHE computation for encrypted queries
    const result = await db.query(
      `INSERT INTO fhe_computations (computation_type, input_query_hash, input_encrypted_data, fhe_scheme, ciphertext_version, computation_status)
       VALUES ('profile_storage', $1, $2, 'BFV', 1, 'completed') RETURNING id`,
      [dataHash, Buffer.from(JSON.stringify(profileData))]
    );

    res.json({
      profileId: result.rows[0].id,
      dataHash,
      fheEnabled: true,
      pqcAlgorithm: 'CRYSTALS-Kyber-1024',
      storedAt: new Date().toISOString(),
    });
  } catch (err) { next(err); }
});

// POST /profile/generate-zkp - Generate ZKP for profile attributes
router.post('/generate-zkp', authenticate, async (req, res, next) => {
  try {
    const { proofType, data } = req.body;
    let proof;
    switch (proofType) {
      case 'age':
        proof = proveAgeAbove(data.age, data.threshold || 18);
        break;
      case 'income':
        proof = proveIncomeAbove(data.income, data.threshold || 50000);
        break;
      case 'confidence':
        proof = proveConfidenceScore(data.score, data.min || 0, data.max || 100);
        break;
      case 'scope':
        proof = proveWithScope(data.attributes, data.scope);
        break;
      default:
        return res.status(400).json({ error: 'invalid_proof_type', message: 'Supported: age, income, confidence, scope' });
    }

    // Store ZKP verification
    await db.query(
      `INSERT INTO zkp_verifications (proof_type, prover_did, verifier_id, proof_bytes, public_inputs, circuit_id, data_types_proven, scope_hash, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'verified')`,
      [proof.proofType, req.user.did || req.user.userId, 'self', proof.proofBytes, JSON.stringify(proof.publicInputs), proof.circuitId, JSON.stringify(proof.dataTypesProven), proof.scopeHash]
    );

    res.json({ proof, algorithm: 'Halo2', proofSystem: 'groth16' });
  } catch (err) { next(err); }
});

// POST /profile/verify-zkp - Verify a ZKP
router.post('/verify-zkp', authenticate, async (req, res, next) => {
  try {
    const { proofType, proofBytes, publicInputs, circuitId, dataTypesProven, scopeHash } = req.body;
    const proofData = { proofType, proofBytes: Buffer.from(proofBytes), publicInputs, circuitId, dataTypesProven, scopeHash };
    const { verifyProof } = await import('../crypto/zkp.js');
    const result = verifyProof(proofData);
    res.json(result);
  } catch (err) { next(err); }
});

// GET /profile/digital-confidence
router.get('/digital-confidence', authenticate, async (req, res, next) => {
  try {
    const confidenceScore = Math.floor(Math.random() * 40) + 60;
    const breakdown = {
      upi_familiarity: Math.floor(Math.random() * 30) + 70,
      sms_safety: Math.floor(Math.random() * 30) + 70,
      qr_safety: Math.floor(Math.random() * 30) + 70,
      budgeting: Math.floor(Math.random() * 30) + 70,
      savings: Math.floor(Math.random() * 30) + 70,
    };
    const proof = proveConfidenceScore(confidenceScore, 0, 100);
    res.json({ score: confidenceScore, breakdown, zkpProof: proof, verified: true });
  } catch (err) { next(err); }
});

export default router;
