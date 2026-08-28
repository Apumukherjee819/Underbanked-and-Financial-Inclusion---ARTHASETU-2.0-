/**
 * Hash-Chained Audit Trail
 * Immutable, append-only, tamper-evident logging
 * 
 * Uses SHA3-256 hash chain (similar to blockchain)
 * Each entry includes previous hash → chain integrity
 */

import crypto from 'crypto';
import { sha3_256 } from './pqc.js';

// Compute hash for an audit entry
export function computeEntryHash(entry) {
  const data = [
    entry.eventType,
    entry.eventAction,
    entry.eventSeverity,
    entry.userId || '',
    entry.actorType,
    entry.resourceType || '',
    entry.resourceId || '',
    entry.success ? '1' : '0',
    entry.requestId || '',
    entry.previousHash,
    entry.chainSequence,
    entry.createdAt,
  ].join('|');
  return sha3_256(data);
}

// Create a new audit entry with hash chain
export function createAuditEntry({
  eventType,
  eventAction,
  eventSeverity = 'INFO',
  userId = null,
  actorType = 'system',
  resourceType = null,
  resourceId = null,
  success = true,
  errorCode = null,
  errorMessage = null,
  ipAddress = null,
  userAgent = null,
  deviceFingerprint = null,
  requestId = null,
  previousHash = 'genesis_0000000000000000000000000000000000000000000000000000000000000000',
  chainSequence = 0,
}) {
  const entry = {
    eventType,
    eventAction,
    eventSeverity,
    userId,
    actorType,
    resourceType,
    resourceId,
    success,
    errorCode,
    ipAddressEncrypted: ipAddress,
    userAgent,
    deviceFingerprint,
    requestId,
    previousHash,
    chainSequence,
    createdAt: new Date().toISOString(),
  };
  entry.entryHash = computeEntryHash(entry);
  return entry;
}

// Verify chain integrity
export function verifyChain(entries) {
  for (let i = 1; i < entries.length; i++) {
    if (entries[i].previousHash !== entries[i - 1].entryHash) {
      return {
        isValid: false,
        brokenAt: i,
        expectedHash: entries[i - 1].entryHash,
        actualHash: entries[i].previousHash,
      };
    }
    const computedHash = computeEntryHash(entries[i]);
    if (computedHash !== entries[i].entryHash) {
      return {
        isValid: false,
        brokenAt: i,
        reason: 'hash_mismatch',
        expectedHash: computedHash,
        actualHash: entries[i].entryHash,
      };
    }
  }
  return { isValid: true, verifiedCount: entries.length };
}

// Compute Merkle root of a set of entries
export function computeMerkleRoot(entries) {
  if (entries.length === 0) return sha3_256('empty');
  let hashes = entries.map(e => e.entryHash || computeEntryHash(e));
  while (hashes.length > 1) {
    const next = [];
    for (let i = 0; i < hashes.length; i += 2) {
      if (i + 1 < hashes.length) {
        next.push(sha3_256(hashes[i] + hashes[i + 1]));
      } else {
        next.push(hashes[i]);
      }
    }
    hashes = next;
  }
  return hashes[0];
}

// Generate audit summary for user
export function generateAuditSummary(entries) {
  const summary = {
    totalEntries: entries.length,
    byType: {},
    bySeverity: { INFO: 0, WARN: 0, ERROR: 0, CRITICAL: 0 },
    successRate: 0,
    firstEntry: entries.length > 0 ? entries[0].createdAt : null,
    lastEntry: entries.length > 0 ? entries[entries.length - 1].createdAt : null,
    chainIntegrity: verifyChain(entries),
  };
  for (const entry of entries) {
    summary.byType[entry.eventType] = (summary.byType[entry.eventType] || 0) + 1;
    summary.bySeverity[entry.eventSeverity] = (summary.bySeverity[entry.eventSeverity] || 0) + 1;
    if (entry.success) summary.successRate++;
  }
  summary.successRate = entries.length > 0 ? summary.successRate / entries.length : 0;
  return summary;
}
