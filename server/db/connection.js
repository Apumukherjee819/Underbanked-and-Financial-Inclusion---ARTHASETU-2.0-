import pg from 'pg';
import config from '../config.js';

let pool = null;
let useMockDb = false;

// In-memory mock database
const mockDb = {
  users: [],
  consent_tokens: [],
  audit_immutable: [],
  risk_assessments: [],
  fhe_computations: [],
  zkp_verifications: [],
  bank_accounts: [],
  transaction_history: [],
  crypto_agility_config: [],
  differential_privacy_config: [],
  encryption_key_hierarchy: [],
};

try {
  pool = new pg.Pool(config.db);
  pool.on('error', (err) => {
    console.error('Database connection lost, using mock DB:', err.message);
    useMockDb = true;
  });
  // Test connection
  await pool.query('SELECT 1');
  console.log('Connected to PostgreSQL');
} catch (err) {
  console.log('PostgreSQL not available, using in-memory mock database');
  useMockDb = true;
}

function mockQuery(text, params = []) {
  // Simple mock query handler
  if (text.includes('INSERT INTO')) {
    return { rows: [{ id: Date.now().toString(), created_at: new Date().toISOString() }], rowCount: 1 };
  }
  if (text.includes('SELECT')) {
    return { rows: [], rowCount: 0 };
  }
  if (text.includes('UPDATE')) {
    return { rows: [], rowCount: 0 };
  }
  if (text.includes('SELECT 1')) {
    return { rows: [{ '?column?': 1 }] };
  }
  return { rows: [], rowCount: 0 };
}

function mockGetClient() {
  return {
    query: mockQuery,
    release: () => {},
  };
}

export default {
  query: (text, params) => useMockDb ? mockQuery(text, params) : pool.query(text, params),
  getClient: () => useMockDb ? Promise.resolve(mockGetClient()) : pool.connect(),
  pool: pool || { end: () => Promise.resolve() },
  isMock: useMockDb,
};
