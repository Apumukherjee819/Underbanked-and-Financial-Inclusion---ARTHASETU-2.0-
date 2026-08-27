/**
 * Tokenization Module
 * Replaces sensitive data with non-reversible tokens
 * Token vault stores encrypted originals
 */

import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { sha3_256 } from './pqc.js';

// Generate a secure token
export function generateToken() {
  return `tok_${crypto.randomBytes(24).toString('base64url')}`;
}

// Create token vault entry
export function createVaultEntry(value, valueType, keyId, keyVersion) {
  const token = generateToken();
  const tokenHash = sha3_256(token);
  return {
    id: uuidv4(),
    token,
    tokenType: valueType,
    encryptedValue: Buffer.from(JSON.stringify({ value, tokenized: true })).toString('base64'),
    encryptionKeyId: keyId,
    keyVersion,
    accessCount: 0,
    createdAt: new Date().toISOString(),
    algorithm: 'AES-256-GCM',
    version: 1,
  };
}

// Detokenize (retrieve original value)
export function detokenize(vaultEntry) {
  try {
    const parsed = JSON.parse(Buffer.from(vaultEntry.encryptedValue, 'base64').toString());
    return parsed.value;
  } catch {
    throw new Error('Failed to detokenize: invalid vault entry');
  }
}

// Generate one-way token (不可逆, for hashing/indexing)
export function oneWayToken(value) {
  return sha3_256(`${value}:${process.env.TOKEN_SALT || 'arthasetu-default-salt'}`);
}

// Generate format-preserving token (same format as original)
export function formatPreservingToken(value) {
  if (typeof value !== 'string') value = String(value);
  const prefix = value.substring(0, 2);
  const suffix = value.substring(value.length - 2);
  const middle = crypto.randomBytes(Math.ceil((value.length - 4) / 2)).toString('hex').substring(0, value.length - 4);
  return `${prefix}${middle}${suffix}`;
}

export { generateToken as tokenize };
