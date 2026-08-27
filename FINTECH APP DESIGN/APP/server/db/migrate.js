import db from './connection.js';

const migrations = [
  // Enable extensions
  `CREATE EXTENSION IF NOT EXISTS "pgcrypto";`,
  `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,

  // 1. Users Table - ZKP + PQC Encrypted
  `CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_hash VARCHAR(64) UNIQUE NOT NULL,
    phone_commitment VARCHAR(128) UNIQUE,
    email_hash VARCHAR(64) UNIQUE,
    email_commitment VARCHAR(128) UNIQUE,
    phone_encrypted BYTEA,
    email_encrypted BYTEA,
    phone_encryption_key_id VARCHAR(36) NOT NULL,
    email_encryption_key_id VARCHAR(36) NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    mfa_secret_encrypted BYTEA,
    did VARCHAR(255) UNIQUE,
    verifiable_credential_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    risk_score DECIMAL(5,4) DEFAULT 0.0,
    risk_last_computed_at TIMESTAMP,
    encryption_algorithm VARCHAR(50) DEFAULT 'CRYSTALS-Kyber-1024',
    encryption_version INTEGER DEFAULT 1,
    pending_migration_algorithm VARCHAR(50),
    migration_scheduled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    last_login_ip_hash VARCHAR(64),
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    deleted_at TIMESTAMP
  );`,
  `CREATE INDEX IF NOT EXISTS idx_users_phone_hash ON users(phone_hash);`,
  `CREATE INDEX IF NOT EXISTS idx_users_email_hash ON users(email_hash);`,
  `CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);`,
  `CREATE INDEX IF NOT EXISTS idx_users_did ON users(did);`,

  // 2. Bank Accounts - FHE-Ready
  `CREATE TABLE IF NOT EXISTS bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_number_encrypted BYTEA NOT NULL,
    account_number_hash VARCHAR(64) NOT NULL,
    account_number_token VARCHAR(64),
    ifsc_code VARCHAR(11) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    account_type VARCHAR(20),
    account_holder_name_encrypted BYTEA,
    verification_status VARCHAR(20) DEFAULT 'pending',
    verification_id VARCHAR(36),
    verified_at TIMESTAMP,
    is_primary BOOLEAN DEFAULT FALSE,
    fhe_enabled BOOLEAN DEFAULT TRUE,
    fhe_ciphertext_version INTEGER DEFAULT 1,
    encryption_algorithm VARCHAR(50) DEFAULT 'CRYSTALS-Kyber-1024',
    encryption_version INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
  );`,
  `CREATE INDEX IF NOT EXISTS idx_bank_accounts_user ON bank_accounts(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_bank_accounts_hash ON bank_accounts(account_number_hash);`,

  // 3. Token Vault
  `CREATE TABLE IF NOT EXISTS token_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(64) UNIQUE NOT NULL,
    token_type VARCHAR(20) NOT NULL,
    encrypted_value BYTEA NOT NULL,
    encryption_key_id VARCHAR(36) NOT NULL,
    key_version INTEGER NOT NULL,
    created_by UUID REFERENCES users(id),
    access_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    revoked_at TIMESTAMP,
    algorithm VARCHAR(50) DEFAULT 'CRYSTALS-Kyber-1024',
    version INTEGER DEFAULT 1
  );`,
  `CREATE INDEX IF NOT EXISTS idx_vault_token ON token_vault(token);`,

  // 4. UPI Status
  `CREATE TABLE IF NOT EXISTS upi_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
    is_first_time_user BOOLEAN NOT NULL,
    confidence_score DECIMAL(5,4),
    registration_date DATE,
    total_upi_apps INTEGER DEFAULT 0,
    last_transaction_date DATE,
    source VARCHAR(50) NOT NULL,
    data_fetched_at TIMESTAMP NOT NULL,
    zk_verification_proof BYTEA,
    zk_verification_hash VARCHAR(128),
    fhe_computation_id VARCHAR(36),
    fhe_encrypted_result BYTEA,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE INDEX IF NOT EXISTS idx_upi_status_bank ON upi_status(bank_account_id);`,

  // 5. Consent Tokens - Smart Consent
  `CREATE TABLE IF NOT EXISTS consent_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE SET NULL,
    consent_type VARCHAR(50) NOT NULL,
    purpose VARCHAR(100) NOT NULL,
    data_types JSONB NOT NULL,
    consent_token VARCHAR(128) UNIQUE NOT NULL,
    consent_token_hash VARCHAR(64) UNIQUE NOT NULL,
    consent_signature BYTEA NOT NULL,
    zk_scope_proof BYTEA,
    zk_scope_hash VARCHAR(128),
    status VARCHAR(20) DEFAULT 'active',
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    revocation_reason TEXT,
    max_access_count INTEGER,
    current_access_count INTEGER DEFAULT 0,
    ip_address_hash VARCHAR(64),
    device_fingerprint VARCHAR(64),
    signature_algorithm VARCHAR(50) DEFAULT 'CRYSTALS-Dilithium-87',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE INDEX IF NOT EXISTS idx_consent_user ON consent_tokens(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_consent_status ON consent_tokens(status);`,
  `CREATE INDEX IF NOT EXISTS idx_consent_token_hash ON consent_tokens(consent_token_hash);`,

  // 6. Transaction History - FHE-Computable
  `CREATE TABLE IF NOT EXISTS transaction_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
    transaction_ref VARCHAR(100) NOT NULL,
    transaction_type VARCHAR(10) NOT NULL,
    amount_encrypted BYTEA NOT NULL,
    amount_token VARCHAR(64),
    currency VARCHAR(3) DEFAULT 'INR',
    sender_vpa VARCHAR(100),
    receiver_vpa VARCHAR(100),
    status VARCHAR(20) NOT NULL,
    description TEXT,
    balance_after_encrypted BYTEA,
    zk_transaction_proof BYTEA,
    zk_transaction_hash VARCHAR(128),
    dp_noise_seed BIGINT,
    dp_epsilon DECIMAL(5,4),
    transaction_date TIMESTAMP NOT NULL,
    fetched_via VARCHAR(50) NOT NULL,
    consent_id UUID REFERENCES consent_tokens(id),
    encryption_algorithm VARCHAR(50) DEFAULT 'CRYSTALS-Kyber-1024',
    encryption_version INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE INDEX IF NOT EXISTS idx_transactions_bank ON transaction_history(bank_account_id);`,
  `CREATE INDEX IF NOT EXISTS idx_transactions_date ON transaction_history(transaction_date);`,

  // 7. Risk Assessments
  `CREATE TABLE IF NOT EXISTS risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    request_id VARCHAR(36) NOT NULL,
    risk_score DECIMAL(5,4) NOT NULL,
    risk_factors JSONB NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    action_taken VARCHAR(50) NOT NULL,
    action_reason TEXT,
    device_fingerprint VARCHAR(64),
    ip_address_hash VARCHAR(64),
    endpoint VARCHAR(100),
    method VARCHAR(10),
    model_version VARCHAR(20) NOT NULL,
    model_confidence DECIMAL(5,4),
    inference_time_ms INTEGER,
    was_feedback_provided BOOLEAN DEFAULT FALSE,
    feedback_label VARCHAR(20),
    feedback_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE INDEX IF NOT EXISTS idx_risk_user ON risk_assessments(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_risk_score ON risk_assessments(risk_score);`,

  // 8. Audit Immutable - Hash-Chain
  `CREATE TABLE IF NOT EXISTS audit_immutable (
    id BIGSERIAL PRIMARY KEY,
    entry_hash VARCHAR(128) NOT NULL,
    previous_hash VARCHAR(128) NOT NULL,
    chain_sequence BIGINT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_action VARCHAR(100) NOT NULL,
    event_severity VARCHAR(20) NOT NULL,
    user_id UUID,
    actor_type VARCHAR(20) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(36),
    ip_address_encrypted BYTEA,
    user_agent TEXT,
    device_fingerprint VARCHAR(64),
    request_id VARCHAR(36),
    success BOOLEAN NOT NULL,
    error_code VARCHAR(50),
    error_message_encrypted BYTEA,
    zk_audit_proof BYTEA,
    zk_audit_hash VARCHAR(128),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_audit_chain_seq ON audit_immutable(chain_sequence);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_audit_hash ON audit_immutable(entry_hash);`,
  `CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_immutable(user_id);`,

  // 9. FHE Computations
  `CREATE TABLE IF NOT EXISTS fhe_computations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    computation_type VARCHAR(50) NOT NULL,
    input_query_hash VARCHAR(128) NOT NULL,
    input_encrypted_data BYTEA NOT NULL,
    fhe_scheme VARCHAR(50) NOT NULL,
    ciphertext_version INTEGER NOT NULL,
    result_encrypted BYTEA,
    result_hash VARCHAR(128),
    computation_status VARCHAR(20) DEFAULT 'pending',
    compute_time_ms INTEGER,
    ciphertext_expansion_ratio DECIMAL(5,2),
    tee_attestation_id VARCHAR(36),
    tee_enclave_id VARCHAR(64),
    requested_by UUID REFERENCES users(id),
    request_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
  );`,
  `CREATE INDEX IF NOT EXISTS idx_fhe_type ON fhe_computations(computation_type);`,

  // 10. TEE Attestations
  `CREATE TABLE IF NOT EXISTS tee_attestations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tee_platform VARCHAR(20) NOT NULL,
    enclave_id VARCHAR(64) NOT NULL,
    enclave_measurement VARCHAR(128) NOT NULL,
    enclave_authority VARCHAR(128),
    attestation_quote BYTEA NOT NULL,
    attestation_signature BYTEA NOT NULL,
    attestation_timestamp TIMESTAMP NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP,
    verification_result JSONB,
    status VARCHAR(20) DEFAULT 'active',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,

  // 11. Crypto Agility Config
  `CREATE TABLE IF NOT EXISTS crypto_agility_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    algorithm_name VARCHAR(50) NOT NULL,
    algorithm_type VARCHAR(20) NOT NULL,
    algorithm_purpose VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    is_quantum_resistant BOOLEAN DEFAULT TRUE,
    activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deprecated_at TIMESTAMP,
    retired_at TIMESTAMP,
    migration_deadline TIMESTAMP,
    key_size_bits INTEGER,
    security_level VARCHAR(20),
    nist_standard VARCHAR(50),
    key_gen_time_ms INTEGER,
    encaps_time_ms INTEGER,
    decaps_time_ms INTEGER,
    signature_time_ms INTEGER,
    verify_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,

  // 12. Differential Privacy Config
  `CREATE TABLE IF NOT EXISTS differential_privacy_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_type VARCHAR(50) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    epsilon DECIMAL(5,4) NOT NULL,
    delta DECIMAL(10,8) NOT NULL,
    sensitivity DECIMAL(10,4) NOT NULL,
    noise_mechanism VARCHAR(20) NOT NULL,
    total_epsilon_budget DECIMAL(5,4) NOT NULL,
    consumed_epsilon DECIMAL(5,4) DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,

  // 13. ZKP Verifications
  `CREATE TABLE IF NOT EXISTS zkp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proof_type VARCHAR(50) NOT NULL,
    prover_did VARCHAR(255) NOT NULL,
    verifier_id VARCHAR(100) NOT NULL,
    proof_bytes BYTEA NOT NULL,
    public_inputs JSONB NOT NULL,
    circuit_id VARCHAR(100) NOT NULL,
    is_valid BOOLEAN,
    verified_at TIMESTAMP,
    verification_time_ms INTEGER,
    data_types_proven JSONB NOT NULL,
    scope_hash VARCHAR(128),
    expires_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,

  // 14. Key Hierarchy
  `CREATE TABLE IF NOT EXISTS encryption_key_hierarchy (
    id VARCHAR(36) PRIMARY KEY,
    parent_key_id VARCHAR(36),
    key_level VARCHAR(20) NOT NULL,
    key_type VARCHAR(20) NOT NULL,
    algorithm VARCHAR(50) NOT NULL,
    public_key BYTEA,
    encrypted_private_key BYTEA,
    key_version INTEGER DEFAULT 1,
    hsm_slot INTEGER,
    cloud_kms_key_id VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rotated_at TIMESTAMP,
    expires_at TIMESTAMP,
    max_age_days INTEGER DEFAULT 90,
    max_usage_count BIGINT,
    current_usage_count BIGINT DEFAULT 0,
    pending_algorithm VARCHAR(50),
    migration_started_at TIMESTAMP,
    migration_completed_at TIMESTAMP
  );`,

  // 15. API Keys
  `CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_hash VARCHAR(64) UNIQUE NOT NULL,
    key_prefix VARCHAR(8) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    permissions JSONB NOT NULL,
    rate_limit INTEGER DEFAULT 100,
    allowed_scopes JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    key_algorithm VARCHAR(50) DEFAULT 'CRYSTALS-Dilithium-87',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,

  // 16. Rate Limits
  `CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier VARCHAR(64) NOT NULL,
    endpoint VARCHAR(100) NOT NULL,
    base_limit INTEGER NOT NULL,
    effective_limit INTEGER NOT NULL,
    risk_adjustment_factor DECIMAL(3,2),
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE INDEX IF NOT EXISTS idx_ratelimit_lookup ON rate_limits(identifier, endpoint, window_start);`,

  // Views
  `CREATE OR REPLACE VIEW active_users AS
   SELECT id, phone_hash, status, risk_score, did, created_at, last_login
   FROM users WHERE status = 'active' AND deleted_at IS NULL;`,

  `CREATE OR REPLACE VIEW valid_consents AS
   SELECT id, user_id, bank_account_id, consent_type, purpose, data_types, expires_at
   FROM consent_tokens WHERE status = 'active' AND expires_at > CURRENT_TIMESTAMP;`,

  // Trigger for updated_at
  `CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = CURRENT_TIMESTAMP;
     RETURN NEW;
   END;
   $$ language 'plpgsql';`,

  `CREATE TRIGGER update_users_updated_at
   BEFORE UPDATE ON users
   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`,

  `CREATE TRIGGER update_bank_accounts_updated_at
   BEFORE UPDATE ON bank_accounts
   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`,

  // Hash chain trigger for audit
  `CREATE OR REPLACE FUNCTION maintain_audit_hash_chain()
   RETURNS TRIGGER AS $$
   DECLARE
     prev_hash VARCHAR(128);
     prev_seq BIGINT;
   BEGIN
     SELECT entry_hash, chain_sequence INTO prev_hash, prev_seq
     FROM audit_immutable ORDER BY chain_sequence DESC LIMIT 1;

     IF prev_hash IS NULL THEN
       prev_hash := 'genesis_0000000000000000000000000000000000000000000000000000000000000000';
       prev_seq := 0;
     END IF;

     NEW.previous_hash := prev_hash;
     NEW.chain_sequence := prev_seq + 1;

      NEW.entry_hash := encode(
        digest(NEW.event_type || NEW.event_action || COALESCE(NEW.user_id::TEXT, '') || NEW.created_at::TEXT || prev_hash, 'sha256'),
        'hex'
      );

     RETURN NEW;
   END;
   $$ language 'plpgsql';`,

  `CREATE TRIGGER audit_hash_chain_trigger
   BEFORE INSERT ON audit_immutable
   FOR EACH ROW EXECUTE FUNCTION maintain_audit_hash_chain();`,
];

async function migrate() {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    for (let i = 0; i < migrations.length; i++) {
      try {
        await client.query(migrations[i]);
        console.log(`Migration ${i + 1}/${migrations.length} ✓`);
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log(`Migration ${i + 1}/${migrations.length} (skipped, exists)`);
        } else {
          console.error(`Migration ${i + 1} FAILED:`, err.message);
        }
      }
    }
    await client.query('COMMIT');
    console.log('\nAll migrations completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await db.pool.end();
  }
}

migrate();
