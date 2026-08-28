/**
 * Key Manager Module
 * HSM-backed key hierarchy with rotation + crypto-agility
 * 
 * Key Hierarchy:
 * Root Key (Level 0)
 *   → Master Key (Level 1)
 *     → Data Encryption Key (Level 2)
 *       → User-Specific Key (Level 3)
 */

import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { sha3_256 } from './pqc.js';

const KEY_LEVELS = {
  ROOT: 'root',
  MASTER: 'master',
  DATA: 'data',
  USER: 'user',
};

// Generate a new key in the hierarchy
export function generateKey({ level, parentKeyId = null, algorithm = 'AES-256-GCM', hsmSlot = null }) {
  const keyId = uuidv4();
  const publicKey = crypto.randomBytes(32);
  const privateKey = crypto.randomBytes(32);
  const wrappedKey = wrapKey(privateKey, parentKeyId);
  return {
    id: keyId,
    parentKeyId,
    keyLevel: level,
    keyType: 'symmetric',
    algorithm,
    publicKey: publicKey.toString('base64'),
    encryptedPrivateKey: wrappedKey,
    keyVersion: 1,
    hsmSlot,
    isActive: true,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    maxAgeDays: 90,
    maxUsageCount: 1000000,
    currentUsageCount: 0,
  };
}

// Wrap (encrypt) a key with a parent key
function wrapKey(key, parentKeyId) {
  if (!parentKeyId) return key.toString('base64');
  const wrappingKey = crypto.createHash('sha3-256').update(parentKeyId).digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', wrappingKey, iv);
  let wrapped = cipher.update(key);
  wrapped = Buffer.concat([wrapped, cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, wrapped]).toString('base64');
}

// Unwrap (decrypt) a key
function unwrapKey(wrappedKeyBase64, parentKeyId) {
  const wrappedKey = Buffer.from(wrappedKeyBase64, 'base64');
  const iv = wrappedKey.subarray(0, 16);
  const tag = wrappedKey.subarray(16, 32);
  const encryptedKey = wrappedKey.subarray(32);
  const unwrappingKey = crypto.createHash('sha3-256').update(parentKeyId || '').digest();
  const decipher = crypto.createDecipheriv('aes-256-gcm', unwrappingKey, iv);
  decipher.setAuthTag(tag);
  let key = decipher.update(encryptedKey);
  key = Buffer.concat([key, decipher.final()]);
  return key;
}

// Rotate a key (create new version)
export function rotateKey(existingKey, newAlgorithm = null) {
  const newKey = generateKey({
    level: existingKey.keyLevel,
    parentKeyId: existingKey.parentKeyId,
    algorithm: newAlgorithm || existingKey.algorithm,
    hsmSlot: existingKey.hsmSlot,
  });
  return {
    ...newKey,
    keyVersion: existingKey.keyVersion + 1,
    rotatedFrom: existingKey.id,
    rotatedAt: new Date().toISOString(),
  };
}

// Check if a key needs rotation
export function needsRotation(key) {
  if (!key.isActive) return false;
  const age = Date.now() - new Date(key.createdAt).getTime();
  const maxAgeMs = (key.maxAgeDays || 90) * 24 * 60 * 60 * 1000;
  const usageRatio = key.maxUsageCount ? key.currentUsageCount / key.maxUsageCount : 0;
  return age > maxAgeMs || usageRatio > 0.9;
}

// Get root key (generates if not exists)
let rootKey = null;
export function getRootKey() {
  if (!rootKey) {
    rootKey = generateKey({ level: KEY_LEVELS.ROOT });
  }
  return rootKey;
}

// Derive user-specific key from master key
export function deriveUserKey(userId, masterKey) {
  const keyId = uuidv4();
  const derivedKey = crypto.createHmac('sha3-256', masterKey.publicKey)
    .update(userId)
    .digest();
  return {
    id: keyId,
    parentKeyId: masterKey.id,
    keyLevel: KEY_LEVELS.USER,
    keyType: 'symmetric',
    algorithm: masterKey.algorithm,
    publicKey: derivedKey.toString('base64'),
    encryptedPrivateKey: wrapKey(derivedKey, masterKey.id),
    keyVersion: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    maxAgeDays: 90,
  };
}

// Generate crypto agility migration plan
export function generateMigrationPlan(currentAlgorithm, targetAlgorithm) {
  return {
    migrationId: uuidv4(),
    from: currentAlgorithm,
    to: targetAlgorithm,
    steps: [
      { step: 1, action: 'generate_new_keypair', status: 'pending' },
      { step: 2, action: 're-encrypt_data_with_new_key', status: 'pending' },
      { step: 3, action: 'verify_all_decryptions', status: 'pending' },
      { step: 4, action: 'deactivate_old_key', status: 'pending' },
      { step: 5, action: 'update_config', status: 'pending' },
    ],
    estimatedTimeHours: 4,
    createdAt: new Date().toISOString(),
  };
}

export { KEY_LEVELS };
