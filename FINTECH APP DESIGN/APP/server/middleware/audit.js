/**
 * Audit Middleware
 * Hash-chain audit logging for every request
 */

import { createAuditEntry } from '../crypto/hash.js';
import db from '../db/connection.js';

export function auditMiddleware(req, res, next) {
  const startTime = Date.now();
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    const duration = Date.now() - startTime;
    logAuditEntry({
      req,
      res,
      body,
      duration,
    }).catch(err => console.error('Audit log failed:', err));
    return originalJson(body);
  };
  next();
}

async function logAuditEntry({ req, res, body, duration }) {
  const eventType = classifyEvent(req);
  const eventAction = `${req.method} ${req.path}`;
  const severity = res.statusCode >= 500 ? 'ERROR' : res.statusCode >= 400 ? 'WARN' : 'INFO';
  const success = res.statusCode < 400;

  const entry = createAuditEntry({
    eventType,
    eventAction,
    eventSeverity: severity,
    userId: req.user?.userId || null,
    actorType: req.user ? 'user' : 'anonymous',
    resourceType: extractResourceType(req.path),
    resourceId: extractResourceId(req),
    success,
    errorCode: success ? null : `HTTP_${res.statusCode}`,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    deviceFingerprint: req.headers['x-device-id'],
    requestId: req.requestId,
  });

  try {
    await db.query(
      `INSERT INTO audit_immutable (
        event_type, event_action, event_severity, user_id, actor_type,
        resource_type, resource_id, ip_address_encrypted, user_agent,
        device_fingerprint, request_id, success, error_code
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        entry.eventType, entry.eventAction, entry.eventSeverity, entry.userId,
        entry.actorType, entry.resourceType, entry.resourceId, entry.ipAddressEncrypted,
        entry.userAgent, entry.deviceFingerprint, entry.requestId, entry.success,
        entry.errorCode,
      ]
    );
  } catch (err) {
    console.error('Failed to write audit entry:', err.message);
  }
}

function classifyEvent(req) {
  const path = req.path.toLowerCase();
  if (path.includes('/auth')) return 'AUTH';
  if (path.includes('/consent')) return 'CONSENT';
  if (path.includes('/transaction')) return 'TRANSACTION';
  if (path.includes('/zkp') || path.includes('/proof')) return 'ZKP';
  if (path.includes('/fhe')) return 'FHE';
  if (path.includes('/risk')) return 'RISK';
  if (path.includes('/export')) return 'EXPORT';
  if (path.includes('/audit')) return 'AUDIT';
  return 'API';
}

function extractResourceType(path) {
  const parts = path.split('/').filter(Boolean);
  return parts[parts.length - 1] || 'unknown';
}

function extractResourceId(req) {
  return req.params?.id || req.body?.id || null;
}
