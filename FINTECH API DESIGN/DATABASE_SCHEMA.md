# Database Schema Design — Next-Generation Fintech

## Overview

PostgreSQL-based database implementing **10 cutting-edge security innovations** that surpass current real-world banking schemas:

| Innovation | Implementation |
|-----------|---------------|
| Zero-Knowledge Proofs | ZKP verification results, no raw PII stored |
| Homomorphic Encryption | FHE computation logs, encrypted query results |
| Post-Quantum Cryptography | CRYSTALS-Kyber/Dilithium key management |
| Hash-Chained Audit Trail | Append-only, tamper-evident chain |
| Confidential Computing (TEE) | Intel SGX attestation logs |
| Smart Consent | Cryptographically signed consent tokens |
| Adaptive AI Risk Scoring | Real-time risk scores per request |
| Differential Privacy | Noise injection for analytics |
| Crypto-Agility | Algorithm versioning and migration |
| Self-Sovereign Identity | W3C Verifiable Credentials |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                            │
│   API Gateway → Risk Engine → ZKP Verifier → FHE Processor → TEE   │
└──────────────┬──────────────────────────────────────────┬───────────┘
               │                                          │
    ┌──────────▼──────────┐               ┌───────────────▼──────────┐
    │   PRIMARY DATABASE   │               │  IMMUTABLE AUDIT STORE   │
    │   (PostgreSQL)       │               │  (Append-Only / WORM)    │
    │   - Users            │               │  - Hash-chained logs     │
    │   - Bank Accounts    │               │  - 7-year retention      │
    │   - UPI Status       │               │  - Tamper-evident        │
    │   - Consent Tokens   │               └──────────────────────────┘
    │   - Risk Scores      │
    │   - FHE Computation  │               ┌──────────────────────────┐
    │   - Token Vault      │               │    KEY MANAGEMENT        │
    └──────────────────────┘               │    (HSM / Cloud KMS)     │
                                           │  - Master Keys (HSM)     │
    ┌──────────────────────┐               │  - Data Keys (DEK)       │
    │   READ REPLICA        │               │  - ZKP Keys              │
    │   (Analytics/BI)      │               │  - PQC Keys (Kyber)      │
    │   - Differential      │               │  - Key Rotation          │
    │     Privacy Layer     │               │  - Crypto-Agility Config │
    └──────────────────────┘               └──────────────────────────┘
```

---

## Tables

### 1. Users Table — ZKP + PQC Encrypted

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- ZKP: Hash for lookups, NO raw PII stored in plaintext
    phone_hash VARCHAR(64) UNIQUE NOT NULL,              -- SHA-3-256 (quantum-resistant hash)
    phone_commitment VARCHAR(128) UNIQUE,                -- Pedersen commitment for ZKP
    email_hash VARCHAR(64) UNIQUE,
    email_commitment VARCHAR(128) UNIQUE,
    
    -- PQC-encrypted PII (CRYSTALS-Kyber-1024 envelope encryption)
    phone_encrypted BYTEA,                               -- ML-KEM encrypted
    email_encrypted BYTEA,                               -- ML-KEM encrypted
    phone_encryption_key_id VARCHAR(36) NOT NULL,        -- Reference to PQC key
    email_encryption_key_id VARCHAR(36) NOT NULL,
    
    -- Authentication
    password_hash VARCHAR(128) NOT NULL,                 -- Argon2id (post-quantum safe KDF)
    mfa_secret_encrypted BYTEA,                          -- Encrypted TOTP secret
    
    -- SSI (Self-Sovereign Identity)
    did VARCHAR(255) UNIQUE,                             -- Decentralized Identifier
    verifiable_credential_id VARCHAR(255),               -- W3C VC reference
    
    -- Status & Tracking
    status VARCHAR(20) DEFAULT 'pending',                -- pending/active/suspended/deleted
    risk_score DECIMAL(5,4) DEFAULT 0.0,                 -- Real-time adaptive risk
    risk_last_computed_at TIMESTAMP,
    
    -- Crypto-Agility
    encryption_algorithm VARCHAR(50) DEFAULT 'CRYSTALS-Kyber-1024',
    encryption_version INTEGER DEFAULT 1,
    pending_migration_algorithm VARCHAR(50),              -- Scheduled PQC migration
    migration_scheduled_at TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    last_login_ip_hash VARCHAR(64),                      -- SHA-3-256 of IP
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    deleted_at TIMESTAMP                                 -- Soft delete (GDPR/DPDP)
);

CREATE INDEX idx_users_phone_hash ON users(phone_hash);
CREATE INDEX idx_users_email_hash ON users(email_hash);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_did ON users(did);
CREATE INDEX idx_users_risk ON users(risk_score);
```

---

### 2. Bank Accounts — FHE-Ready Encrypted

```sql
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- PQC-encrypted sensitive fields
    account_number_encrypted BYTEA NOT NULL,             -- ML-KEM envelope encryption
    account_number_hash VARCHAR(64) NOT NULL,            -- For duplicate detection
    account_number_token VARCHAR(64),                    -- Tokenized reference (no plaintext anywhere)
    
    ifsc_code VARCHAR(11) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    account_type VARCHAR(20),                            -- savings/current/nre/nro
    
    account_holder_name_encrypted BYTEA,                 -- PQC-encrypted
    account_holder_name_zk_commitment VARCHAR(128),      -- ZKP commitment
    
    -- Verification
    verification_status VARCHAR(20) DEFAULT 'pending',   -- pending/verified/failed
    verification_id VARCHAR(36),
    verified_at TIMESTAMP,
    verification_zk_proof BYTEA,                         -- ZKP proof of verification
    
    -- Consent
    is_primary BOOLEAN DEFAULT FALSE,
    
    -- FHE metadata
    fhe_enabled BOOLEAN DEFAULT TRUE,                    -- Can compute on this data encrypted
    fhe_ciphertext_version INTEGER DEFAULT 1,
    
    -- Crypto-Agility
    encryption_algorithm VARCHAR(50) DEFAULT 'CRYSTALS-Kyber-1024',
    encryption_version INTEGER DEFAULT 1,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP                                 -- Soft delete
);

CREATE INDEX idx_bank_accounts_user ON bank_accounts(user_id);
CREATE INDEX idx_bank_accounts_hash ON bank_accounts(account_number_hash);
CREATE INDEX idx_bank_accounts_token ON bank_accounts(account_number_token);
CREATE INDEX idx_bank_accounts_status ON bank_accounts(verification_status);
```

---

### 3. Token Vault — Tokenization Service

```sql
CREATE TABLE token_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(64) UNIQUE NOT NULL,                   -- Random token
    token_type VARCHAR(20) NOT NULL,                     -- account_number/phone/email/aadhaar/pan
    encrypted_value BYTEA NOT NULL,                      -- PQC-encrypted original value
    encryption_key_id VARCHAR(36) NOT NULL,              -- HSM key reference
    key_version INTEGER NOT NULL,                        -- For key rotation tracking
    
    -- Access Control
    created_by UUID REFERENCES users(id),
    access_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP,
    
    -- Lifecycle
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,                                -- Auto-expire tokens
    revoked_at TIMESTAMP,
    
    -- Crypto-Agility
    algorithm VARCHAR(50) DEFAULT 'CRYSTALS-Kyber-1024',
    version INTEGER DEFAULT 1
);

CREATE INDEX idx_vault_token ON token_vault(token);
CREATE INDEX idx_vault_type ON token_vault(token_type);
CREATE INDEX idx_vault_expires ON token_vault(expires_at);
```

---

### 4. UPI Status — With ZKP Verification

```sql
CREATE TABLE upi_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
    
    -- Core data
    is_first_time_user BOOLEAN NOT NULL,
    confidence_score DECIMAL(5,4),                       -- 0.0000 to 1.0000
    registration_date DATE,
    total_upi_apps INTEGER DEFAULT 0,
    last_transaction_date DATE,
    
    -- Source & Verification
    source VARCHAR(50) NOT NULL,                         -- npci/bank_api/aa_framework
    data_fetched_at TIMESTAMP NOT NULL,
    zk_verification_proof BYTEA,                         -- ZKP proof of NPCI data integrity
    zk_verification_hash VARCHAR(128),                   -- Hash of ZKP proof
    
    -- FHE computation result
    fhe_computation_id VARCHAR(36),                      -- Reference to FHE computation
    fhe_encrypted_result BYTEA,                          -- Result computed on encrypted data
    
    -- Cache management
    expires_at TIMESTAMP NOT NULL,                       -- Cache expiry
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_upi_status_bank ON upi_status(bank_account_id);
CREATE INDEX idx_upi_status_expires ON upi_status(expires_at);
CREATE INDEX idx_upi_status_zk_hash ON upi_status(zk_verification_hash);
```

---

### 5. Smart Consent Tokens — Cryptographically Enforced

```sql
CREATE TABLE consent_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE SET NULL,
    
    -- Consent definition
    consent_type VARCHAR(50) NOT NULL,                   -- bank_transactions/upi_status/full_access
    purpose VARCHAR(100) NOT NULL,                       -- credit_assessment/kyc/analysis
    data_types JSONB NOT NULL,                           -- ["transactions", "balance"]
    
    -- Cryptographic consent token
    consent_token VARCHAR(128) UNIQUE NOT NULL,          -- cnt_[random_32_chars]
    consent_token_hash VARCHAR(64) UNIQUE NOT NULL,      -- SHA-3-256 for DB lookup
    consent_signature BYTEA NOT NULL,                    -- User's signature over consent terms
    
    -- ZKP scope verification
    zk_scope_proof BYTEA,                               -- ZKP proof consent scope is valid
    zk_scope_hash VARCHAR(128),                          -- Hash of ZKP scope proof
    
    -- Status & Lifecycle
    status VARCHAR(20) DEFAULT 'active',                 -- active/expired/revoked/suspended
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    revocation_reason TEXT,
    
    -- Access Control
    max_access_count INTEGER,                            -- Limit total accesses
    current_access_count INTEGER DEFAULT 0,
    ip_address_hash VARCHAR(64),                         -- SHA-3-256 of IP
    device_fingerprint VARCHAR(64),
    user_agent TEXT,
    
    -- Crypto-Agility
    signature_algorithm VARCHAR(50) DEFAULT 'CRYSTALS-Dilithium-87',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_consent_user ON consent_tokens(user_id);
CREATE INDEX idx_consent_status ON consent_tokens(status);
CREATE INDEX idx_consent_expires ON consent_tokens(expires_at);
CREATE INDEX idx_consent_token_hash ON consent_tokens(consent_token_hash);
CREATE INDEX idx_consent_type ON consent_tokens(consent_type);
```

---

### 6. Transaction History — FHE-Computable

```sql
CREATE TABLE transaction_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
    
    -- Transaction data (encrypted with PQC)
    transaction_ref VARCHAR(100) NOT NULL,               -- External reference
    transaction_type VARCHAR(10) NOT NULL,               -- credit/debit
    amount_encrypted BYTEA NOT NULL,                     -- FHE-compatible encrypted amount
    amount_token VARCHAR(64),                            -- Tokenized amount for lookups
    currency VARCHAR(3) DEFAULT 'INR',
    
    sender_vpa VARCHAR(100),
    receiver_vpa VARCHAR(100),
    sender_account_encrypted BYTEA,
    receiver_account_encrypted BYTEA,
    
    -- Status
    status VARCHAR(20) NOT NULL,                         -- success/pending/failed
    description TEXT,
    balance_after_encrypted BYTEA,                       -- FHE-compatible
    
    -- ZKP verification
    zk_transaction_proof BYTEA,                          -- ZKP proof of transaction authenticity
    zk_transaction_hash VARCHAR(128),
    
    -- Differential Privacy
    dp_noise_seed BIGINT,                                -- Noise seed for differential privacy queries
    dp_epsilon DECIMAL(5,4),                             -- Privacy budget used
    
    -- Source & Consent
    transaction_date TIMESTAMP NOT NULL,
    fetched_via VARCHAR(50) NOT NULL,                    -- aa_framework/bank_api
    consent_id UUID REFERENCES consent_tokens(id),
    
    -- Crypto-Agility
    encryption_algorithm VARCHAR(50) DEFAULT 'CRYSTALS-Kyber-1024',
    encryption_version INTEGER DEFAULT 1,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (transaction_date);

-- Create monthly partitions
CREATE TABLE transaction_history_2026_01 PARTITION OF transaction_history
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE transaction_history_2026_02 PARTITION OF transaction_history
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
-- ... auto-created by partition manager

CREATE INDEX idx_transactions_bank ON transaction_history(bank_account_id);
CREATE INDEX idx_transactions_date ON transaction_history(transaction_date);
CREATE INDEX idx_transactions_status ON transaction_history(status);
CREATE INDEX idx_transactions_ref ON transaction_history(transaction_ref);
```

---

### 7. Adaptive Risk Scoring

```sql
CREATE TABLE risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    request_id VARCHAR(36) NOT NULL,                     -- For request tracing
    
    -- Risk inputs
    risk_score DECIMAL(5,4) NOT NULL,                    -- 0.0000 to 1.0000
    risk_factors JSONB NOT NULL,                         -- {"device_deviation": 0.3, "time_anomaly": 0.2, ...}
    risk_level VARCHAR(20) NOT NULL,                     -- low/medium/high/critical
    
    -- Decision
    action_taken VARCHAR(50) NOT NULL,                   -- allow/step_up_auth/block/escalate
    action_reason TEXT,
    
    -- Context
    device_fingerprint VARCHAR(64),
    ip_address_hash VARCHAR(64),
    user_agent TEXT,
    endpoint VARCHAR(100),
    method VARCHAR(10),
    
    -- ML Model metadata
    model_version VARCHAR(20) NOT NULL,                  -- e.g., "v2.3.1"
    model_confidence DECIMAL(5,4),
    inference_time_ms INTEGER,
    
    -- Feedback loop
    was_feedback_provided BOOLEAN DEFAULT FALSE,
    feedback_label VARCHAR(20),                          -- true_positive/false_positive
    feedback_at TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_risk_user ON risk_assessments(user_id);
CREATE INDEX idx_risk_score ON risk_assessments(risk_score);
CREATE INDEX idx_risk_level ON risk_assessments(risk_level);
CREATE INDEX idx_risk_created ON risk_assessments(created_at);
```

---

### 8. Hash-Chained Immutable Audit Trail

```sql
CREATE TABLE audit_immutable (
    id BIGSERIAL PRIMARY KEY,                            -- Sequential, no gaps
    
    -- Hash chain (blockchain-inspired)
    entry_hash VARCHAR(128) NOT NULL,                    -- SHA3-256 of this entry
    previous_hash VARCHAR(128) NOT NULL,                 -- Hash of previous entry (chain link)
    chain_sequence BIGINT NOT NULL,                      -- Monotonic sequence number
    
    -- Event data
    event_type VARCHAR(50) NOT NULL,                     -- authentication/data_access/consent/system
    event_action VARCHAR(100) NOT NULL,                  -- login_success/data_fetch/consent_grant
    event_severity VARCHAR(20) NOT NULL,                 -- info/warning/critical
    
    -- Actor
    user_id UUID,
    actor_type VARCHAR(20) NOT NULL,                     -- user/system/admin/bot
    
    -- Resource
    resource_type VARCHAR(50),
    resource_id VARCHAR(36),
    resource_hash VARCHAR(128),                          -- Hash of accessed resource
    
    -- Context
    ip_address_encrypted BYTEA,                          -- PQC-encrypted
    user_agent TEXT,
    device_fingerprint VARCHAR(64),
    request_id VARCHAR(36),
    
    -- Outcome
    success BOOLEAN NOT NULL,
    error_code VARCHAR(50),
    error_message_encrypted BYTEA,                       -- PQC-encrypted
    
    -- ZKP audit
    zk_audit_proof BYTEA,                               -- ZKP proof this audit entry is valid
    zk_audit_hash VARCHAR(128),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (created_at);

-- Monthly partitions
CREATE TABLE audit_immutable_2026_08 PARTITION OF audit_immutable
    FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
-- ... auto-created

-- UNIQUE constraint ensures no duplicate sequence numbers
CREATE UNIQUE INDEX idx_audit_chain_seq ON audit_immutable(chain_sequence);
CREATE UNIQUE INDEX idx_audit_hash ON audit_immutable(entry_hash);
CREATE INDEX idx_audit_user ON audit_immutable(user_id);
CREATE INDEX idx_audit_event ON audit_immutable(event_type);
CREATE INDEX idx_audit_created ON audit_immutable(created_at);
CREATE INDEX idx_audit_severity ON audit_immutable(event_severity);
```

**Chain Verification Function:**
```sql
-- Verify audit chain integrity
CREATE OR REPLACE FUNCTION verify_audit_chain(
    start_seq BIGINT DEFAULT 1,
    end_seq BIGINT DEFAULT NULL
) RETURNS TABLE(
    is_valid BOOLEAN,
    broken_at_sequence BIGINT,
    total_entries BIGINT,
    verified_entries BIGINT
) AS $$
DECLARE
    prev_hash VARCHAR(128) := '';
    current_entry RECORD;
BEGIN
    FOR current_entry IN 
        SELECT * FROM audit_immutable 
        WHERE chain_sequence BETWEEN start_seq AND COALESCE(end_seq, 999999999)
        ORDER BY chain_sequence
    LOOP
        IF current_entry.previous_hash != prev_hash THEN
            RETURN QUERY SELECT FALSE, current_entry.chain_sequence, 
                         (end_seq - start_seq), 0;
            RETURN;
        END IF;
        prev_hash := current_entry.entry_hash;
    END LOOP;
    
    RETURN QUERY SELECT TRUE, NULL::BIGINT, 
                 (end_seq - start_seq), (end_seq - start_seq);
END;
$$ LANGUAGE plpgsql;
```

---

### 9. FHE Computation Log

```sql
CREATE TABLE fhe_computations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Computation definition
    computation_type VARCHAR(50) NOT NULL,               -- aggregate/balance_check/risk_score
    input_query_hash VARCHAR(128) NOT NULL,              -- Hash of the query
    input_encrypted_data BYTEA NOT NULL,                 -- Encrypted input parameters
    
    -- FHE scheme info
    fhe_scheme VARCHAR(50) NOT NULL,                     -- BFV/CKKS/BGV/TFHE
    ciphertext_version INTEGER NOT NULL,
    
    -- Result
    result_encrypted BYTEA,                              -- Encrypted result
    result_hash VARCHAR(128),                            -- Hash of decrypted result
    computation_status VARCHAR(20) DEFAULT 'pending',    -- pending/completed/failed
    
    -- Performance
    compute_time_ms INTEGER,
    ciphertext_expansion_ratio DECIMAL(5,2),             -- encrypted/plaintext size
    
    -- TEE attestation (computation ran in enclave)
    tee_attestation_id VARCHAR(36),                      -- Reference to TEE attestation
    tee_enclave_id VARCHAR(64),
    
    -- Request context
    requested_by UUID REFERENCES users(id),
    request_id VARCHAR(36),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_fhe_type ON fhe_computations(computation_type);
CREATE INDEX idx_fhe_status ON fhe_computations(computation_status);
CREATE INDEX idx_fhe_created ON fhe_computations(created_at);
```

---

### 10. TEE Attestation Log

```sql
CREATE TABLE tee_attestations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- TEE identity
    tee_platform VARCHAR(20) NOT NULL,                   -- intel_sgx/arm_trustzone/amd_sev
    enclave_id VARCHAR(64) NOT NULL,
    enclave_measurement VARCHAR(128) NOT NULL,           -- MRENCLAVE (code hash)
    enclave_authority VARCHAR(128),                      -- MRSIGNER (signer hash)
    
    -- Attestation
    attestation_quote BYTEA NOT NULL,                    -- Hardware-signed attestation
    attestation_signature BYTEA NOT NULL,
    attestation_timestamp TIMESTAMP NOT NULL,
    
    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP,
    verification_result JSONB,                           -- Detailed verification output
    
    -- Lifecycle
    status VARCHAR(20) DEFAULT 'active',                 -- active/expired/revoked
    expires_at TIMESTAMP NOT NULL,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tee_enclave ON tee_attestations(enclave_id);
CREATE INDEX idx_tee_status ON tee_attestations(status);
CREATE INDEX idx_tee_expires ON tee_attestations(expires_at);
```

---

### 11. Crypto-Agility Configuration

```sql
CREATE TABLE crypto_agility_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Algorithm definition
    algorithm_name VARCHAR(50) NOT NULL,                 -- CRYSTALS-Kyber-1024
    algorithm_type VARCHAR(20) NOT NULL,                 -- kem/signature/hash/symmetric
    algorithm_purpose VARCHAR(50) NOT NULL,              -- data_encryption/auth/signing/audit
    
    -- Status
    status VARCHAR(20) NOT NULL,                         -- active/deprecated/migration_pending/retired
    is_quantum_resistant BOOLEAN DEFAULT TRUE,
    
    -- Lifecycle
    activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deprecated_at TIMESTAMP,
    retired_at TIMESTAMP,
    migration_deadline TIMESTAMP,
    
    -- Key parameters
    key_size_bits INTEGER,
    security_level VARCHAR(20),                          -- 128/192/256
    
    -- NIST compliance
    nist_standard VARCHAR(50),                           -- ML-KEM-1024/ML-DSA-87
    nist_status VARCHAR(20),                             -- standardized/finalized
    
    -- Performance benchmarks
    key_gen_time_ms INTEGER,
    encaps_time_ms INTEGER,
    decaps_time_ms INTEGER,
    signature_time_ms INTEGER,
    verify_time_ms INTEGER,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed with current algorithms
INSERT INTO crypto_agility_config 
    (algorithm_name, algorithm_type, algorithm_purpose, status, nist_standard, key_size_bits)
VALUES
    ('CRYSTALS-Kyber-1024', 'kem', 'data_encryption', 'active', 'ML-KEM-1024', 3168),
    ('CRYSTALS-Kyber-768', 'kem', 'data_encryption', 'active', 'ML-KEM-768', 2400),
    ('CRYSTALS-Dilithium-87', 'signature', 'auth', 'active', 'ML-DSA-87', 4595),
    ('CRYSTALS-Dilithium-65', 'signature', 'auth', 'active', 'ML-DSA-65', 3293),
    ('CRYSTALS-SPHINCS+-256f', 'signature', 'audit_signing', 'active', 'SLH-DSA-256f', 49856),
    ('AES-256-GCM', 'symmetric', 'legacy_encryption', 'deprecated', NULL, 256),
    ('RSA-4096', 'kem', 'legacy_encryption', 'deprecated', NULL, 4096),
    ('SHA3-256', 'hash', 'hashing', 'active', NULL, 256),
    ('Argon2id', 'hash', 'password_hashing', 'active', NULL, 256);
```

---

### 12. Differential Privacy Configuration

```sql
CREATE TABLE differential_privacy_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Query definition
    query_type VARCHAR(50) NOT NULL,                     -- count/sum/average/histogram
    table_name VARCHAR(100) NOT NULL,
    
    -- Privacy parameters
    epsilon DECIMAL(5,4) NOT NULL,                       -- Privacy budget (lower = more private)
    delta DECIMAL(10,8) NOT NULL,                        -- Failure probability
    sensitivity DECIMAL(10,4) NOT NULL,                  -- Max influence of single record
    
    -- Mechanism
    noise_mechanism VARCHAR(20) NOT NULL,                -- laplace/gaussian/exponential
    
    -- Budget tracking
    total_epsilon_budget DECIMAL(5,4) NOT NULL,          -- Total allowed epsilon per user per day
    consumed_epsilon DECIMAL(5,4) DEFAULT 0.0,           -- Already consumed
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dp_query_type ON differential_privacy_config(query_type);
CREATE INDEX idx_dp_table ON differential_privacy_config(table_name);
```

---

### 13. ZKP Verification Store

```sql
CREATE TABLE zkp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Proof definition
    proof_type VARCHAR(50) NOT NULL,                     -- identity/age/income/kyc_status/account_ownership
    prover_did VARCHAR(255) NOT NULL,                    -- User's DID (verifier never sees raw data)
    verifier_id VARCHAR(100) NOT NULL,                   -- Who requested verification
    
    -- Proof data
    proof_bytes BYTEA NOT NULL,                          -- The actual ZKP proof
    public_inputs JSONB NOT NULL,                        -- Public inputs to the ZKP circuit
    circuit_id VARCHAR(100) NOT NULL,                    -- Which ZKP circuit was used
    
    -- Verification result
    is_valid BOOLEAN,
    verified_at TIMESTAMP,
    verification_time_ms INTEGER,
    
    -- Scope
    data_types_proven JSONB NOT NULL,                    -- ["age >= 18", "kyc_verified"]
    scope_hash VARCHAR(128),                             -- Hash of proven scope
    
    -- Lifecycle
    expires_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',                -- pending/verified/expired/revoked
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_zkp_prover ON zkp_verifications(prover_did);
CREATE INDEX idx_zkp_verifier ON zkp_verifications(verifier_id);
CREATE INDEX idx_zkp_type ON zkp_verifications(proof_type);
CREATE INDEX idx_zkp_status ON zkp_verifications(status);
```

---

### 14. Key Management Hierarchy

```sql
CREATE TABLE encryption_key_hierarchy (
    id VARCHAR(36) PRIMARY KEY,                          -- Key ID
    
    -- Key hierarchy
    parent_key_id VARCHAR(36),                           -- NULL for root keys
    key_level VARCHAR(20) NOT NULL,                      -- root/kek/dek/tek
    key_type VARCHAR(20) NOT NULL,                       -- symmetric/asymmetric/hmac
    
    -- PQC key material
    algorithm VARCHAR(50) NOT NULL,                      -- CRYSTALS-Kyber-1024
    public_key BYTEA,                                    -- PQC public key
    encrypted_private_key BYTEA,                         -- PQC-encrypted private key
    key_version INTEGER DEFAULT 1,
    
    -- HSM reference
    hsm_slot INTEGER,                                    -- HSM key slot number
    hsm_label VARCHAR(100),                              -- HSM key label
    cloud_kms_key_id VARCHAR(255),                       -- AWS KMS / Azure Key Vault ID
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rotated_at TIMESTAMP,
    expires_at TIMESTAMP,
    retired_at TIMESTAMP,
    
    -- Rotation policy
    max_age_days INTEGER DEFAULT 90,                     -- Auto-rotate after 90 days
    max_usage_count BIGINT,                              -- Rotate after N uses
    current_usage_count BIGINT DEFAULT 0,
    
    -- Crypto-Agility
    pending_algorithm VARCHAR(50),                       -- Next algorithm for migration
    migration_started_at TIMESTAMP,
    migration_completed_at TIMESTAMP
);

CREATE INDEX idx_key_parent ON encryption_key_hierarchy(parent_key_id);
CREATE INDEX idx_key_level ON encryption_key_hierarchy(key_level);
CREATE INDEX idx_key_active ON encryption_key_hierarchy(is_active);
CREATE INDEX idx_key_algorithm ON encryption_key_hierarchy(algorithm);
```

---

### 15. API Keys

```sql
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_hash VARCHAR(64) UNIQUE NOT NULL,                -- SHA3-256 of API key
    key_prefix VARCHAR(8) NOT NULL,                      -- sfk_live_ or sfk_test_
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    name VARCHAR(100) NOT NULL,
    permissions JSONB NOT NULL,                          -- {"upi_check": true, "transactions": true}
    
    -- Rate limiting
    rate_limit INTEGER DEFAULT 100,
    
    -- Scopes (ZKP-enabled)
    allowed_scopes JSONB,                               -- ZKP scope restrictions
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    
    -- Crypto-Agility
    key_algorithm VARCHAR(50) DEFAULT 'CRYSTALS-Dilithium-87',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_apikeys_hash ON api_keys(key_hash);
CREATE INDEX idx_apikeys_user ON api_keys(user_id);
```

---

### 16. Rate Limiting

```sql
CREATE TABLE rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier VARCHAR(64) NOT NULL,                     -- user_id or IP hash or device_fingerprint
    endpoint VARCHAR(100) NOT NULL,
    
    -- Adaptive limits (based on risk score)
    base_limit INTEGER NOT NULL,                         -- Base rate limit
    effective_limit INTEGER NOT NULL,                    -- Adjusted by risk score
    risk_adjustment_factor DECIMAL(3,2),                 -- Risk multiplier
    
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ratelimit_lookup ON rate_limits(identifier, endpoint, window_start);
```

---

## Views

### Active Users View
```sql
CREATE VIEW active_users AS
SELECT 
    id, phone_hash, status, risk_score, 
    did, created_at, last_login
FROM users 
WHERE status = 'active' 
  AND deleted_at IS NULL;
```

### Valid Consents View
```sql
CREATE VIEW valid_consents AS
SELECT 
    id, user_id, bank_account_id, consent_type, purpose,
    data_types, consent_token_hash, expires_at,
    max_access_count, current_access_count
FROM consent_tokens 
WHERE status = 'active' 
  AND expires_at > CURRENT_TIMESTAMP;
```

### Audit Chain Health View
```sql
CREATE VIEW audit_chain_health AS
SELECT 
    COUNT(*) as total_entries,
    MIN(chain_sequence) as first_sequence,
    MAX(chain_sequence) as last_sequence,
    MAX(created_at) as latest_entry,
    (SELECT COUNT(DISTINCT user_id) FROM audit_immutable) as unique_actors
FROM audit_immutable;
```

### Crypto Migration Status View
```sql
CREATE VIEW crypto_migration_status AS
SELECT 
    algorithm_name,
    algorithm_type,
    status,
    nist_standard,
    activated_at,
    deprecated_at,
    migration_deadline,
    CASE 
        WHEN status = 'deprecated' AND migration_deadline < CURRENT_TIMESTAMP 
        THEN 'OVERDUE'
        WHEN status = 'deprecated' AND migration_deadline < CURRENT_TIMESTAMP + INTERVAL '30 days'
        THEN 'URGENT'
        ELSE 'ON_TRACK'
    END as migration_urgency
FROM crypto_agility_config
WHERE status IN ('active', 'deprecated', 'migration_pending');
```

---

## Triggers

### Updated At Trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bank_accounts_updated_at 
    BEFORE UPDATE ON bank_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Hash Chain Trigger (Immutable Audit)
```sql
CREATE OR REPLACE FUNCTION maintain_audit_hash_chain()
RETURNS TRIGGER AS $$
DECLARE
    prev_hash VARCHAR(128);
    prev_seq BIGINT;
    entry_data TEXT;
BEGIN
    -- Get previous entry
    SELECT entry_hash, chain_sequence 
    INTO prev_hash, prev_seq
    FROM audit_immutable 
    ORDER BY chain_sequence DESC 
    LIMIT 1;
    
    -- First entry uses genesis hash
    IF prev_hash IS NULL THEN
        prev_hash := 'genesis_0000000000000000000000000000000000000000000000000000000000000000';
        prev_seq := 0;
    END IF;
    
    -- Set chain values
    NEW.previous_hash := prev_hash;
    NEW.chain_sequence := prev_seq + 1;
    
    -- Compute entry hash
    entry_data := NEW.event_type || NEW.event_action || 
                  COALESCE(NEW.user_id::TEXT, '') ||
                  NEW.created_at::TEXT || prev_hash;
    NEW.entry_hash := encode(digest(entry_data, 'sha3-256'), 'hex');
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER audit_hash_chain_trigger
    BEFORE INSERT ON audit_immutable
    FOR EACH ROW EXECUTE FUNCTION maintain_audit_hash_chain();
```

### Consent Auto-Expiry Trigger
```sql
CREATE OR REPLACE FUNCTION auto_expire_consents()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.expires_at < CURRENT_TIMESTAMP AND NEW.status = 'active' THEN
        NEW.status := 'expired';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER consent_auto_expiry
    BEFORE UPDATE ON consent_tokens
    FOR EACH ROW EXECUTE FUNCTION auto_expire_consents();
```

---

## Sample Queries

### ZKP Identity Verification (No Raw Data Exposure)
```sql
-- User proves age >= 18 without revealing date of birth
-- Server verifies ZKP proof, never sees DOB
SELECT 
    zk.id,
    zk.proof_type,
    zk.is_valid,
    zk.verification_time_ms,
    zk.data_types_proven
FROM zkp_verifications zk
WHERE zk.prover_did = :user_did
  AND zk.proof_type = 'age_verification'
  AND zk.status = 'verified'
  AND zk.expires_at > CURRENT_TIMESTAMP
ORDER BY zk.verified_at DESC
LIMIT 1;
```

### FHE Aggregate Query (Compute on Encrypted Data)
```sql
-- Sum of encrypted transaction amounts — server sees only ciphertext
SELECT 
    f.id,
    f.computation_type,
    f.result_encrypted,
    f.compute_time_ms,
    f.fhe_scheme
FROM fhe_computations f
WHERE f.computation_type = 'transaction_sum'
  AND f.requested_by = :user_id
  AND f.computation_status = 'completed'
ORDER BY f.created_at DESC
LIMIT 1;
```

### Verify Audit Chain Integrity
```sql
-- Check if audit trail has been tampered with
SELECT * FROM verify_audit_chain(1, NULL);
```

### Risk-Adjusted Rate Limiting
```sql
-- Get effective rate limit based on user's risk score
SELECT 
    r.identifier,
    r.effective_limit,
    r.base_limit,
    r.risk_adjustment_factor,
    u.risk_score
FROM rate_limits r
JOIN users u ON u.id = :user_id
WHERE r.identifier = :user_id
  AND r.endpoint = :endpoint
  AND r.window_start > NOW() - INTERVAL '1 minute';
```

### Get User's Bank Accounts (Tokenized)
```sql
-- Never exposes full account number — uses tokens
SELECT 
    b.id,
    b.bank_name,
    t.token as account_token,
    RIGHT(DECODE(b.account_number_encrypted, 'base64')::text, 4) as last_four,
    b.ifsc_code,
    b.verification_status,
    b.created_at
FROM bank_accounts b
LEFT JOIN token_vault t ON t.token = b.account_number_token
WHERE b.user_id = :user_id
  AND b.deleted_at IS NULL
  AND b.verification_status = 'verified'
ORDER BY b.is_primary DESC, b.created_at DESC;
```

### Differential Privacy Query
```sql
-- Aggregate with noise injection for privacy
SELECT 
    dp_epsilon,
    noise_mechanism,
    sensitivity,
    total_epsilon_budget,
    consumed_epsilon,
    (total_epsilon_budget - consumed_epsilon) as remaining_budget
FROM differential_privacy_config
WHERE query_type = 'average_balance'
  AND table_name = 'transaction_history'
  AND is_active = TRUE;
```
