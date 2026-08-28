/**
 * Risk-Adjusted Rate Limiting
 * Limits adjust based on user's risk score
 */

const windows = new Map();

export function riskAdjustedRateLimit(req, res, next) {
  const userId = req.user?.userId || req.ip;
  const endpoint = req.path;
  const riskScore = req.user?.riskScore || 0;
  const baseLimit = 100;
  const riskFactor = Math.max(0.1, 1 - riskScore);
  const effectiveLimit = Math.floor(baseLimit * riskFactor);
  const windowMs = 60000;
  const now = Date.now();
  const key = `${userId}:${endpoint}`;
  const window = windows.get(key);
  if (!window || now - window.start > windowMs) {
    windows.set(key, { start: now, count: 1 });
    res.setHeader('X-RateLimit-Limit', effectiveLimit);
    res.setHeader('X-RateLimit-Remaining', effectiveLimit - 1);
    res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));
    return next();
  }
  window.count++;
  const remaining = Math.max(0, effectiveLimit - window.count);
  res.setHeader('X-RateLimit-Limit', effectiveLimit);
  res.setHeader('X-RateLimit-Remaining', remaining);
  res.setHeader('X-RateLimit-Reset', Math.ceil((window.start + windowMs) / 1000));
  if (window.count > effectiveLimit) {
    const retryAfter = Math.ceil((window.start + windowMs - now) / 1000);
    res.setHeader('Retry-After', retryAfter);
    return res.status(429).json({
      error: 'rate_limited',
      message: 'Too many requests',
      retryAfter,
      limit: effectiveLimit,
      riskAdjusted: riskScore > 0.5,
    });
  }
  next();
}

// Cleanup old windows periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, window] of windows.entries()) {
    if (now - window.start > 120000) windows.delete(key);
  }
}, 60000);
