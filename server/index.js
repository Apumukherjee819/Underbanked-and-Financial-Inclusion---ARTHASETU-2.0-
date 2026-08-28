/**
 * ArthaSetu Security API Server
 * 10 Next-Gen Security Innovations
 * 
 * Innovations:
 * 1. Zero-Knowledge Proofs (ZKP) - Identity verification without data exposure
 * 2. Fully Homomorphic Encryption (FHE) - Compute on encrypted data
 * 3. Post-Quantum Cryptography (PQC) - Future-proof encryption
 * 4. Hash-Chained Audit Trail - Immutable, tamper-evident logging
 * 5. Trusted Execution Environment (TEE) - Secure enclaves for computation
 * 6. Smart Consent Management - Cryptographic consent tokens
 * 7. Adaptive Risk Scoring - ML-based risk assessment
 * 8. Differential Privacy (DP) - Calibrated noise for analytics
 * 9. Crypto-Agility - Algorithm migration without downtime
 * 10. Self-Sovereign Identity (SSI) - Decentralized identity
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import config from './config.js';
import { authenticate, optionalAuth } from './middleware/auth.js';
import { riskMiddleware } from './middleware/risk.js';
import { auditMiddleware } from './middleware/audit.js';
import { riskAdjustedRateLimit } from './middleware/rateLimit.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import assessmentRoutes from './routes/assessment.js';
import consentRoutes from './routes/consent.js';
import zkproofRoutes from './routes/zkproof.js';
import fheRoutes from './routes/fhe.js';
import auditRoutes from './routes/audit.js';
import riskRoutes from './routes/risk.js';
import exportRoutes from './routes/export.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
}));

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-Device-ID', 'X-Consent-Token'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Global rate limiting
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { error: 'rate_limited', message: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false,
}));

// Request ID
app.use((req, res, next) => {
  req.requestId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader('X-Request-ID', req.requestId);
  next();
});

// Audit logging (all requests)
app.use(auditMiddleware);

// Risk assessment (all requests)
app.use(optionalAuth, riskMiddleware);

// Rate limiting (risk-adjusted)
app.use(riskAdjustedRateLimit);

// Serve static frontend files
app.use(express.static(join(__dirname, '..')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/consent', consentRoutes);
app.use('/api/zkp', zkproofRoutes);
app.use('/api/fhe', fheRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/export', exportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '2.0.0',
    security: {
      pqcAlgorithm: config.pqc.kemAlgorithm,
      signatureAlgorithm: config.pqc.signAlgorithm,
      fheScheme: config.fhe.scheme,
      zkpCircuit: 'Halo2',
      auditChain: 'SHA3-256 hash-chain',
      consentModel: 'cryptographic',
      riskModel: 'adaptive-ml',
      differentialPrivacy: `ε=${config.dp.defaultEpsilon}`,
      cryptoAgility: 'enabled',
      ssi: 'DID-based',
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Security info endpoint
app.get('/api/security/info', (req, res) => {
  res.json({
    innovations: [
      { id: 1, name: 'Zero-Knowledge Proofs', status: 'active', description: 'Prove facts without revealing data' },
      { id: 2, name: 'Fully Homomorphic Encryption', status: 'active', description: 'Compute on encrypted data' },
      { id: 3, name: 'Post-Quantum Cryptography', status: 'active', description: 'Quantum-resistant encryption' },
      { id: 4, name: 'Hash-Chained Audit Trail', status: 'active', description: 'Immutable audit logging' },
      { id: 5, name: 'Trusted Execution Environment', status: 'active', description: 'Secure enclaves for computation' },
      { id: 6, name: 'Smart Consent Management', status: 'active', description: 'Cryptographic consent tokens' },
      { id: 7, name: 'Adaptive Risk Scoring', status: 'active', description: 'ML-based risk assessment' },
      { id: 8, name: 'Differential Privacy', status: 'active', description: 'Calibrated noise for analytics' },
      { id: 9, name: 'Crypto-Agility', status: 'active', description: 'Algorithm migration support' },
      { id: 10, name: 'Self-Sovereign Identity', status: 'active', description: 'Decentralized identity' },
    ],
    compliance: ['DPDP-2023', 'RBI-Guidelines', 'NPCI-UPI', 'NIST-PQC'],
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                   ArthaSetu Security API                    ║
║              10 Next-Gen Security Innovations               ║
╠══════════════════════════════════════════════════════════════╣
║  Server:     http://localhost:${config.port}                     ║
║  Frontend:   http://localhost:${config.port}/index.html           ║
║  Health:     http://localhost:${config.port}/api/health            ║
║  Security:   http://localhost:${config.port}/api/security/info    ║
╠══════════════════════════════════════════════════════════════╣
║  Security Innovations:                                      ║
║    ✓ Zero-Knowledge Proofs (Halo2)                          ║
║    ✓ Fully Homomorphic Encryption (BFV)                     ║
║    ✓ Post-Quantum Cryptography (Kyber-1024/Dilithium-87)    ║
║    ✓ Hash-Chained Audit Trail (SHA3-256)                    ║
║    ✓ Trusted Execution Environment (Intel SGX mock)         ║
║    ✓ Smart Consent Management (Cryptographic tokens)        ║
║    ✓ Adaptive Risk Scoring (ML-based)                       ║
║    ✓ Differential Privacy (Laplace/Gaussian)                ║
║    ✓ Crypto-Agility (Algorithm migration)                   ║
║    ✓ Self-Sovereign Identity (DID-based)                    ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

export default app;
