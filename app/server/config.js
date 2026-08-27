import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'arthasetu',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    max: 20,
    idleTimeoutMillis: 30000,
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'arthasetu-pqc-secret-change-in-production',
    expiresIn: '15m',
    refreshExpiresIn: '7d',
    algorithm: 'HS256',
  },

  pqc: {
    kemAlgorithm: 'CRYSTALS-Kyber-1024',
    signAlgorithm: 'CRYSTALS-Dilithium-87',
    hashAlgorithm: 'SHA3-256',
    keyRotationDays: 90,
  },

  fhe: {
    scheme: 'BFV',
    keySize: 1024,
    noiseBitSize: 60,
  },

  zkp: {
    circuitDir: './circuits',
    proofSystem: 'halo2',
  },

  dp: {
    defaultEpsilon: 0.1,
    dailyBudget: 1.0,
    sensitivity: 10000,
  },

  rateLimit: {
    windowMs: 60 * 1000,
    max: 100,
  },

  audit: {
    retentionDays: 2555, // 7 years
    anchorInterval: 100,
  },

  consent: {
    maxDurationDays: 90,
    tokenPrefix: 'cnt_',
  },
};
