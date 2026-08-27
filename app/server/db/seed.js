/**
 * Database Seed Script
 * Populates test data for ArthaSetu Security API
 */

import db from './connection.js';
import { sha3_256, generateKeyPair, generateSignKeyPair } from '../crypto/pqc.js';
import { generateKey, getRootKey, KEY_LEVELS } from '../crypto/keyManager.js';
import { createAuditEntry } from '../crypto/hash.js';
import bcrypt from 'bcryptjs';

async function seed() {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // 1. Create test users
    const passwordHash = await bcrypt.hash('Test@1234', 12);
    const rootKey = getRootKey();
    const masterKey = generateKey({ level: KEY_LEVELS.MASTER, parentKeyId: rootKey.id });

    const users = [
      { phone: '+919876543210', email: 'test@example.com' },
      { phone: '+919876543211', email: 'demo@example.com' },
    ];

    for (const user of users) {
      const phoneHash = sha3_256(user.phone);
      const emailHash = sha3_256(user.email);
      const pqcKeys = generateKeyPair();
      const signKeys = generateSignKeyPair();

      await client.query(
        `INSERT INTO users (phone_hash, phone_commitment, phone_encrypted, email_hash, email_commitment, email_encrypted, password_hash, phone_encryption_key_id, email_encryption_key_id, status, did, encryption_algorithm)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'active', $10, 'CRYSTALS-Kyber-1024')
         ON CONFLICT (phone_hash) DO NOTHING`,
        [phoneHash, `commit_${phoneHash}`, Buffer.from(user.phone), emailHash, `commit_${emailHash}`, Buffer.from(user.email), passwordHash, pqcKeys.keyId, pqcKeys.keyId, `did:arthasetu:${phoneHash.substring(0, 16)}`]
      );
    }

    // 2. Create crypto agility configs
    const algorithms = [
      { name: 'CRYSTALS-Kyber-1024', type: 'kem', purpose: 'encryption', status: 'active', nist: 'FIPS-203', quantum: true },
      { name: 'CRYSTALS-Dilithium-87', type: 'signature', purpose: 'authentication', status: 'active', nist: 'FIPS-204', quantum: true },
      { name: 'AES-256-GCM', type: 'symmetric', purpose: 'data_encryption', status: 'active', nist: 'SP-800-38D', quantum: false },
      { name: 'SHA3-256', type: 'hash', purpose: 'integrity', status: 'active', nist: 'FIPS-202', quantum: true },
      { name: 'RSA-4096', type: 'asymmetric', purpose: 'legacy_encryption', status: 'deprecated', nist: 'SP-800-56B', quantum: false },
    ];

    for (const algo of algorithms) {
      await client.query(
        `INSERT INTO crypto_agility_config (algorithm_name, algorithm_type, algorithm_purpose, status, is_quantum_resistant, nist_standard, key_size_bits, security_level)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT DO NOTHING`,
        [algo.name, algo.type, algo.purpose, algo.status, algo.quantum, algo.nist, algo.type === 'symmetric' ? 256 : 1024, algo.quantum ? 'post-quantum' : 'classical']
      );
    }

    // 3. Create differential privacy configs
    const dpConfigs = [
      { query: 'user_profile_analytics', table: 'users', epsilon: 0.1, delta: 1e-5, sensitivity: 10000, mechanism: 'laplace' },
      { query: 'transaction_analytics', table: 'transaction_history', epsilon: 0.1, delta: 1e-5, sensitivity: 1000, mechanism: 'laplace' },
      { query: 'risk_score_analytics', table: 'risk_assessments', epsilon: 0.05, delta: 1e-6, sensitivity: 1, mechanism: 'gaussian' },
    ];

    for (const dp of dpConfigs) {
      await client.query(
        `INSERT INTO differential_privacy_config (query_type, table_name, epsilon, delta, sensitivity, noise_mechanism, total_epsilon_budget)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT DO NOTHING`,
        [dp.query, dp.table, dp.epsilon, dp.delta, dp.sensitivity, dp.mechanism, 1.0]
      );
    }

    // 4. Create key hierarchy
    await client.query(
      `INSERT INTO encryption_key_hierarchy (id, key_level, key_type, algorithm, is_active, max_age_days)
       VALUES ($1, 'root', 'symmetric', 'AES-256-GCM', true, 365)
       ON CONFLICT (id) DO NOTHING`,
      [rootKey.id]
    );

    await client.query(
      `INSERT INTO encryption_key_hierarchy (id, parent_key_id, key_level, key_type, algorithm, is_active, max_age_days)
       VALUES ($1, $2, 'master', 'symmetric', 'AES-256-GCM', true, 90)
       ON CONFLICT (id) DO NOTHING`,
      [masterKey.id, rootKey.id]
    );

    await client.query('COMMIT');
    console.log('Seed data inserted successfully!');
    console.log('\nTest credentials:');
    console.log('  Phone: +919876543210, Password: Test@1234');
    console.log('  Phone: +919876543211, Password: Test@1234');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err);
  } finally {
    client.release();
    await db.pool.end();
  }
}

seed();
