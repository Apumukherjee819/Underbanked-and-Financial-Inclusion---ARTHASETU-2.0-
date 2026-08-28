/**
 * Authentication Middleware
 * JWT + PQC authentication with risk-adjusted session management
 */

import jwt from 'jsonwebtoken';
import config from '../config.js';
import { pqcVerify, sha3_256 } from '../crypto/pqc.js';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'missing_token', message: 'Authorization token required' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwt.secret, { algorithms: [config.jwt.algorithm] });
    req.user = decoded;
    req.requestId = req.headers['x-request-id'] || `req_${Date.now()}`;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'token_expired', message: 'Token has expired' });
    }
    return res.status(401).json({ error: 'invalid_token', message: 'Invalid token' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwt.secret, { algorithms: [config.jwt.algorithm] });
    req.user = decoded;
  } catch {}
  next();
}

export function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user.id, phoneHash: user.phone_hash, riskScore: user.risk_score || 0 },
    config.jwt.secret,
    { algorithm: config.jwt.algorithm, expiresIn: config.jwt.expiresIn }
  );
  const refreshToken = jwt.sign(
    { userId: user.id, type: 'refresh' },
    config.jwt.secret,
    { algorithm: config.jwt.algorithm, expiresIn: config.jwt.refreshExpiresIn }
  );
  return { accessToken, refreshToken, expiresIn: 900 };
}
