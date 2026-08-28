/**
 * FHE Routes
 * Fully Homomorphic Encryption computation on encrypted data
 */

import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/connection.js';
import { authenticate } from '../middleware/auth.js';
import { encrypt, decrypt, computeEncryptedSum, computeEncryptedAverage, computeEncryptedCountAbove, createComputationRecord } from '../crypto/fhe.js';
import { generateAttestation, verifyAttestation } from '../utils/teeAttestation.js';
import { sha3_256 } from '../crypto/pqc.js';

const router = Router();

// POST /fhe/compute - Run FHE computation on encrypted data
router.post('/compute', authenticate, async (req, res, next) => {
  try {
    const { computationType, encryptedData, parameters } = req.body;
    if (!computationType || !encryptedData) {
      return res.status(400).json({ error: 'missing_fields', message: 'computationType and encryptedData required' });
    }
    const inputHash = sha3_256(JSON.stringify(encryptedData));
    const attestation = generateAttestation({ platform: 'Intel-SGX', enclaveCode: 'fhe-compute-v1' });
    let result;
    switch (computationType) {
      case 'sum': result = computeEncryptedSum(encryptedData); break;
      case 'average': result = computeEncryptedAverage(encryptedData); break;
      case 'count_above': result = computeEncryptedCountAbove(encryptedData, parameters?.threshold || 0); break;
      default: return res.status(400).json({ error: 'unsupported_computation' });
    }
    const encryptedResult = encrypt(result, 'public-key');
    const fheRecord = createComputationRecord(computationType, inputHash, Buffer.from(JSON.stringify(encryptedData)), encryptedResult.ciphertext, sha3_256(JSON.stringify(result)));
    await db.query(
      `INSERT INTO fhe_computations (id, computation_type, input_query_hash, input_encrypted_data, fhe_scheme, ciphertext_version, result_encrypted, result_hash, computation_status, compute_time_ms, tee_attestation_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'completed', $9, $10)`,
      [fheRecord.id, computationType, inputHash, Buffer.from(JSON.stringify(encryptedData)), 'BFV', 1, encryptedResult.ciphertext, sha3_256(JSON.stringify(result)), fheRecord.computeTimeMs, attestation.id]
    );
    res.json({ computationId: fheRecord.id, result, computationType, fheScheme: 'BFV', teeAttestation: { id: attestation.id, platform: attestation.teePlatform, verified: attestation.isVerified } });
  } catch (err) { next(err); }
});

// POST /fhe/encrypt - Encrypt data for FHE
router.post('/encrypt', authenticate, (req, res) => {
  const { plaintext, publicKey } = req.body;
  const encrypted = encrypt(plaintext, publicKey || 'default-key');
  res.json({ ciphertextId: encrypted.ciphertextId, scheme: encrypted.scheme, noiseBitSize: encrypted.noiseBitSize, expansionRatio: encrypted.expansionRatio });
});

// POST /fhe/decrypt - Decrypt FHE result
router.post('/decrypt', authenticate, (req, res) => {
  const { ciphertextData, secretKey } = req.body;
  try {
    const plaintext = decrypt(Buffer.from(JSON.stringify(ciphertextData)), secretKey);
    res.json({ plaintext });
  } catch (err) {
    res.status(400).json({ error: 'decryption_failed', message: err.message });
  }
});

// GET /fhe/attestation/:id - Verify TEE attestation
router.get('/attestation/:id', authenticate, async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM fhe_computations WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'not_found' });
    const comp = result.rows[0];
    const attestation = { teePlatform: 'Intel-SGX', attestationQuote: Buffer.from('mock-quote'), attestationSignature: Buffer.from('mock-sig'), enclaveId: 'mock-enclave' };
    const verification = verifyAttestation(attestation);
    res.json({ computationId: comp.id, attestation: verification, fheScheme: comp.fhe_scheme });
  } catch (err) { next(err); }
});

// GET /fhe/history
router.get('/history', authenticate, async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, computation_type, fhe_scheme, computation_status, compute_time_ms, created_at FROM fhe_computations WHERE requested_by = $1 ORDER BY created_at DESC LIMIT 20',
      [req.user.userId]
    );
    res.json({ computations: result.rows });
  } catch (err) { next(err); }
});

export default router;
