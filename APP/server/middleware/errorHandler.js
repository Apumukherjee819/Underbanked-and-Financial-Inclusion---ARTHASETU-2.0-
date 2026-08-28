/**
 * Secure Error Handler
 * Never exposes internal details to client
 */

const ERROR_MAP = {
  '23505': { status: 409, code: 'duplicate_entry', message: 'Resource already exists' },
  '23503': { status: 400, code: 'referenced_not_found', message: 'Referenced resource not found' },
  '23502': { status: 400, code: 'not_null_violation', message: 'Required field missing' },
  '42P01': { status: 500, code: 'internal_error', message: 'Database error' },
};

export function errorHandler(err, req, res, _next) {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}:`, err.message);

  // Database errors
  if (err.code && ERROR_MAP[err.code]) {
    const mapped = ERROR_MAP[err.code];
    return res.status(mapped.status).json({
      error: mapped.code,
      message: mapped.message,
      requestId: req.requestId,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid_token', message: 'Invalid token', requestId: req.requestId });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token_expired', message: 'Token expired', requestId: req.requestId });
  }

  // Validation errors
  if (err.isValidationError) {
    return res.status(400).json({
      error: 'validation_error',
      message: 'Invalid input',
      fields: err.fields,
      requestId: req.requestId,
    });
  }

  // Default: internal error (never expose details)
  res.status(500).json({
    error: 'internal_error',
    message: 'An unexpected error occurred',
    requestId: req.requestId,
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'not_found',
    message: `Route ${req.method} ${req.path} not found`,
    requestId: req.requestId,
  });
}
