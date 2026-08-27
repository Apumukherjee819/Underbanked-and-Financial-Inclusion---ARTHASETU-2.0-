# Security Architecture — Next-Generation Fintech

## Overview

Multi-layered security architecture implementing **10 cutting-edge innovations** that surpass current real-world banking security. This architecture achieves:

- **Mathematical privacy guarantees** (ZKP, FHE, Differential Privacy)
- **Quantum-resistant cryptography** (CRYSTALS-Kyber/Dilithium)
- **Tamper-evident audit trails** (Hash-chained WORM)
- **Hardware-level data protection** (Confidential Computing TEE)
- **Adaptive threat response** (AI Risk Scoring)
- **Future-proof flexibility** (Crypto-Agility)

---

## Security Layers — Defense in Depth

```
┌─────────────────────────────────────────────────────────────────────┐
│  Layer 10: Zero-Knowledge Identity     → ZKP + Self-Sovereign ID   │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 9:  Adaptive AI Risk            → Real-time threat scoring  │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 8:  Confidential Computing      → TEE (Intel SGX enclaves)  │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 7:  Encrypted Computation       → FHE (compute on cipher)   │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 6:  Post-Quantum Cryptography   → CRYSTALS-Kyber/Dilithium  │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 5:  Smart Consent               → Cryptographic tokens      │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 4:  Immutable Audit             → Hash-chained WORM         │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 3:  Differential Privacy        → Noise-injected analytics  │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 2:  Crypto-Agility              → Algorithm migration       │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 1:  Infrastructure              → HSM, VPC, TLS 1.3        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. Zero-Knowledge Proofs (ZKP)

### Concept
Prove a statement is true **without revealing any underlying data**. The verifier learns nothing beyond the validity of the statement.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ZKP IDENTITY VERIFICATION                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   User (Prover)              Server (Verifier)                   │
│       │                          │                               │
│       │  1. Has credential:      │                               │
│       │     {dob: 1995-03-15,    │                               │
│       │      kyc: verified,      │                               │
│       │      income: 800000}     │                               │
│       │                          │                               │
│       │  2. Generates ZK proof:  │                               │
│       │     π = Prove(dob >= 18  │                               │
│       │          AND kyc == true │                               │
│       │          AND income>5L)  │                               │
│       │                          │                               │
│       │  3. Sends π to server ──▶│                               │
│       │                          │                               │
│       │                          │  4. Verifies: Verify(π)       │
│       │                          │     → true/false              │
│       │                          │                               │
│       │  5. Response ◀──────────│  Server NEVER sees:           │
│       │     (approved/denied)    │  - Actual date of birth       │
│       │                          │  - Actual income              │
│       │                          │  - KYC document details       │
└─────────────────────────────────────────────────────────────────┘
```

### ZKP Circuits Implemented

| Circuit ID | Proves | Public Inputs | Private Inputs |
|-----------|--------|---------------|----------------|
| `age_ge_18` | Age >= 18 | current_date, min_age | date_of_birth |
| `income_ge` | Income >= threshold | threshold | actual_income |
| `kyc_verified` | KYC status is verified | verifier_id | kyc_document |
| `account_owns` | User owns bank account | account_id | account_secret |
| `upi_first_time` | Is first-time UPI user | bank_id | npcic_data |
| `consent_valid` | Consent is valid & active | consent_id | consent_secret |

### Implementation Stack
- **Proof System**: Halo2 (no trusted setup, recursive proofs)
- **Alternative**: Risc Zero (VM-based, complex circuits)
- **Library**: `circom` for circuit compilation
- **Verification**: On-chain or server-side (fast)

### Privacy Guarantees
- **Zero-knowledge**: Verifier learns nothing beyond validity
- **Soundness**: Cannot fake a valid proof
- **Completeness**: Honest prover always succeeds
- **Non-interactivity**: Single round-trip communication

---

## 2. Homomorphic Encryption (FHE)

### Concept
Compute directly on encrypted data. The server processes ciphertext and returns encrypted results. **Server never sees plaintext.**

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FHE COMPUTATION PIPELINE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Client                    FHE Engine                   TEE     │
│     │                          │                          │      │
│     │  1. Encrypted query:     │                          │      │
│     │     ct_balance =         │                          │      │
│     │     Enc(balance, pk)     │                          │      │
│     │                          │                          │      │
│     │  2. Send ct_balance ────▶│                          │      │
│     │                          │  3. FHE compute:         │      │
│     │                          │  ct_avg = FHE_Avg(       │      │
│     │                          │    ct_balance1,          │      │
│     │                          │    ct_balance2, ...)     │      │
│     │                          │                          │      │
│     │                          │  4. Attest computation ─▶│      │
│     │                          │     (verify in TEE)      │      │
│     │                          │◀── 5. TEE attestation ──│      │
│     │                          │                          │      │
│     │  6. Encrypted result ◀───│                          │      │
│     │     ct_avg               │                          │      │
│     │                          │                          │      │
│     │  7. Decrypt locally:     │                          │      │
│     │     avg = Dec(ct_avg, sk)│                          │      │
│     │     → ₹45,230           │                          │      │
│     │                          │                          │      │
│     │  Server sees: CIPHERTEXT ONLY                         │      │
│     │  Server knows: NOTHING about actual balances          │      │
└─────────────────────────────────────────────────────────────────┘
```

### FHE Schemes Used

| Scheme | Use Case | Operations | Overhead |
|--------|----------|------------|----------|
| **BFV** | Exact integer arithmetic | ADD, MUL | ~10-15x |
| **CKKS** | Approximate real numbers | ADD, MUL, AVG | ~10-15x |
| **TFHE** | Boolean circuits, ML inference | ANY gate | ~15-20x |

### FHE Operations in Our System

| Operation | What It Computes | On What Data |
|-----------|-----------------|--------------|
| `fhe_balance_avg` | Average balance | Encrypted transaction amounts |
| `fhe_risk_score` | Risk assessment | Encrypted user behavior features |
| `fhe_credit_check` | Credit eligibility | Encrypted income + expenses |
| `fhe_fraud_detect` | Anomaly detection | Encrypted transaction patterns |
| `fhe_total_debits` | Sum of debits | Encrypted debit amounts |

### Implementation
- **Library**: Microsoft SEAL + EVA compiler
- **Hardware**: Intel HERACLES FHE accelerator (optional)
- **Cloud**: Azure Confidential Computing with FHE VMs
- **Compiler**: EVA auto-compiles Python → FHE circuits

---

## 3. Post-Quantum Cryptography (PQC)

### Concept
Current encryption (RSA, ECC, AES) breaks when quantum computers reach ~4000 qubits (est. 2028-2030). PQC uses math problems quantum computers **cannot solve efficiently**.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PQC KEY MANAGEMENT                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐   │
│   │   Root Key    │────▶│  Key Encrypt │────▶│  Data Keys   │   │
│   │   (CRYSTALS-  │     │  Key (KEK)   │     │  (DEK)       │   │
│   │    Kyber-1024)│     │  CRYSTALS-   │     │  AES-256-GCM │   │
│   │   in HSM      │     │  Kyber-768   │     │  (symmetric) │   │
│   └──────────────┘     └──────────────┘     └──────────────┘   │
│          │                    │                    │             │
│          ▼                    ▼                    ▼             │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐   │
│   │  Stored in   │     │  Stored in   │     │  Used for    │   │
│   │  HSM FIPS    │     │  Cloud KMS   │     │  column      │   │
│   │  140-2 L3    │     │  (encrypted) │     │  encryption  │   │
│   └──────────────┘     └──────────────┘     └──────────────┘   │
│                                                                  │
│   Signature Layer:                                              │
│   ┌──────────────┐     ┌──────────────┐                         │
│   │ CRYSTALS-    │     │ CRYSTALS-    │                         │
│   │ Dilithium-87 │     │ SPHINCS+-256f│                         │
│   │ (fast sigs)  │     │ (hash-based) │                         │
│   └──────────────┘     └──────────────┘                         │
│                                                                  │
│   Hashing: SHA3-256 (quantum-resistant)                         │
│   KDF: Argon2id (quantum-resistant)                             │
└─────────────────────────────────────────────────────────────────┘
```

### NIST PQC Standards Implemented

| Algorithm | Type | Use Case | NIST Standard | Security Level |
|-----------|------|----------|---------------|----------------|
| CRYSTALS-Kyber-1024 | KEM | Key encapsulation | ML-KEM-1024 | Level 5 (256-bit) |
| CRYSTALS-Kyber-768 | KEM | Key encapsulation | ML-KEM-768 | Level 3 (192-bit) |
| CRYSTALS-Dilithium-87 | Signature | Auth, signing | ML-DSA-87 | Level 5 (256-bit) |
| CRYSTALS-Dilithium-65 | Signature | Auth, signing | ML-DSA-65 | Level 3 (192-bit) |
| CRYSTALS-SPHINCS+-256f | Signature | Audit signing | SLH-DSA-256f | Level 5 (256-bit) |
| SHA3-256 | Hash | Hashing, HMAC | FIPS 202 | Level 5 |
| Argon2id | KDF | Password hashing | RFC 9106 | N/A |

### Migration Timeline

```
2026 Q3: Deploy PQC for new data (dual-stack)
2026 Q4: Migrate active encryption keys
2027 Q1: Migrate audit signing keys
2027 Q2: Deprecate RSA/ECC
2027 Q3: Remove legacy algorithms
2028 Q1: Full PQC-only operation
```

---

## 4. Hash-Chained Immutable Audit Trail

### Concept
Every audit log entry contains the **hash of the previous entry**, creating a tamper-evident chain. Stored in append-only WORM storage. Any modification is immediately detectable.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                 HASH-CHAINED AUDIT TRAIL                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Entry 1          Entry 2          Entry 3          Entry N      │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │ data     │    │ data     │    │ data     │    │ data     │  │
│  │ ts       │    │ ts       │    │ ts       │    │ ts       │  │
│  │ prev=    │    │ prev=    │    │ prev=    │    │ prev=    │  │
│  │ "genesis"│───▶│ hash(E1) │───▶│ hash(E2) │───▶│ hash(EN) │  │
│  │ hash=E1  │    │ hash=E2  │    │ hash=E3  │    │ hash=EN  │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│                                                                  │
│  Tamper Detection:                                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ If ANY entry is modified:                                   │ │
│  │   → Its hash changes                                        │ │
│  │   → Next entry's prev_hash no longer matches                │ │
│  │   → Chain is BROKEN → Tampering detected                   │ │
│  │                                                              │ │
│  │ Verification: O(n) scan, ~1ms per 1000 entries             │ │
│  │ Storage: WORM (Write Once Read Many) — no overwrite         │ │
│  │ Retention: 7 years (RBI mandate)                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Storage: Separate append-only database (NOT in primary DB)    │
│  Integrity: Every 100th hash anchored to public blockchain     │
│  Backup: Encrypted cross-region replication                    │
└─────────────────────────────────────────────────────────────────┘
```

### Log Structure
```javascript
{
  chain_sequence: 12345,           // Monotonic, no gaps
  entry_hash: "sha3-256(data+prev)",  // This entry's hash
  previous_hash: "sha3-256(prev)",    // Chain link
  event_type: "data_access",
  event_action: "fetch_transactions",
  event_severity: "info",
  user_id: "uuid",
  resource_type: "transaction",
  resource_id: "txn-uuid",
  ip_address_encrypted: "pqc-encrypted",
  success: true,
  zk_audit_proof: "zkp-proof-bytes",  // ZKP proof entry is valid
  created_at: "2026-08-25T10:30:00Z"
}
```

### Verification Process
1. Scan all entries sequentially
2. For each entry, verify: `hash(entry_data + previous_hash) == entry_hash`
3. Verify: `entry[i].previous_hash == entry[i-1].entry_hash`
4. If any mismatch → chain is broken → alert security team
5. Every 100th entry's hash is anchored to a public blockchain for external verification

---

## 5. Confidential Computing (TEE)

### Concept
Process sensitive data inside **hardware-encrypted CPU enclaves**. Even the OS, hypervisor, and cloud provider **cannot read the data** while it's being processed.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│              CONFIDENTIAL COMPUTING (Intel SGX)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    UNTRUSTED ZONE                          │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │  │
│  │  │     OS      │  │  Hypervisor  │  │   Cloud     │      │  │
│  │  │   (Linux)   │  │   (KVM)     │  │  Provider   │      │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │  │
│  │        ✗ CANNOT read enclave memory                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           │                                      │
│  ┌────────────────────────▼───────────────────────────────────┐ │
│  │                    TRUSTED ZONE (SGX Enclave)               │ │
│  │  ┌─────────────────────────────────────────────────────┐   │ │
│  │  │  Encrypted Memory (MEE - Memory Encryption Engine)   │   │ │
│  │  │                                                       │   │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │   │ │
│  │  │  │ FHE Engine  │  │ ZKP Verifier│  │ Risk Engine │ │   │ │
│  │  │  │ (decrypt →  │  │ (verify     │  │ (compute    │ │   │ │
│  │  │  │  compute →  │  │  proofs     │  │  risk       │ │   │ │
│  │  │  │  encrypt)   │  │  without    │  │  scores)    │ │   │ │
│  │  │  │             │  │  seeing     │  │             │ │   │ │
│  │  │  │             │  │  data)      │  │             │ │   │ │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘ │   │ │
│  │  │                                                       │   │ │
│  │  │  Data enters enclave → Encrypted during processing   │   │ │
│  │  │  → Encrypted result exits → decrypted by client      │   │ │
│  │  └─────────────────────────────────────────────────────┘   │ │
│  │                                                              │ │
│  │  Attestation: Hardware-signed proof enclave is genuine      │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Gartner 2026: Top 10 Strategic Technology                      │
│  Market: $8.7B (2026) → $126B (2035)                          │
└─────────────────────────────────────────────────────────────────┘
```

### TEE Workloads

| Workload | What Runs in Enclave | Data Protection |
|----------|---------------------|-----------------|
| FHE Computation | FHE decrypt → compute → encrypt | Amounts/balances encrypted |
| ZKP Verification | Verify proofs without seeing data | Identity data encrypted |
| Risk Scoring | ML inference on encrypted features | User behavior encrypted |
| Consent Validation | Verify consent tokens | Consent details encrypted |
| Key Derivation | Derive per-user keys | Master key never exposed |

---

## 6. Smart Consent Architecture

### Concept
Consent is a **cryptographically signed, machine-readable token** with embedded rules. Every API call must present the consent token, and the server cryptographically verifies scope before responding.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SMART CONSENT FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Consent Creation:                                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ User signs consent terms with private key:                  │ │
│  │                                                              │ │
│  │ consent = {                                                 │ │
│  │   user_id, scope: ["transactions", "balance"],              │ │
│  │   purpose: "credit_assessment",                             │ │
│  │   valid_until: "2026-11-25",                                │ │
│  │   max_accesses: 100,                                        │ │
│  │   signature: sign(consent_data, user_private_key)           │ │
│  │ }                                                           │ │
│  │                                                              │ │
│  │ Server stores: SHA3-256(consent) as lookup key              │ │
│  │ Server NEVER stores the consent token itself                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  2. Consent Verification (Every API Call):                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ API Request includes: consent_token in header               │ │
│  │                                                              │ │
│  │ Server:                                                    │ │
│  │  a) Hash the token → lookup in DB                          │ │
│  │  b) Check: status == "active"                              │ │
│  │  c) Check: expires_at > NOW()                              │ │
│  │  d) Check: current_access_count < max_access_count         │ │
│  │  e) Check: requested_data_type IN consent.data_types       │ │
│  │  f) Verify: signature matches user's public key            │ │
│  │  g) ALL pass → Grant access                                │ │
│  │     ANY fail → Deny access + audit log                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  3. Consent Revocation:                                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ User sends revocation request                               │ │
│  │ → Consent status set to "revoked"                           │ │
│  │ → Revocation hash added to CRL (Certificate Revocation)    │ │
│  │ → All future API calls with this token → DENIED            │ │
│  │ → Audit log entry created                                   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Consent Token Format
```
cnt_[random_32_bytes_base64]

Embedded claims:
- user_id (UUID)
- scope (JSONB array)
- purpose (string)
- valid_from (timestamp)
- valid_until (timestamp)
- max_access_count (integer)
- signature_algorithm (CRYSTALS-Dilithium-87)
- revocation_hash (SHA3-256)
```

---

## 7. Adaptive AI Risk Scoring

### Concept
Every API request gets a **real-time risk score** from an ML model. The score determines the action: allow, step-up auth, block, or escalate.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                 ADAPTIVE RISK SCORING ENGINE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  API Request                                                     │
│     │                                                            │
│     ▼                                                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Feature Extraction (runs in TEE)                           │ │
│  │                                                              │ │
│  │ Device Features:     Behavioral Features:                  │ │
│  │  • device_fingerprint   • login_time_pattern                │ │
│  │  • device_age           • transaction_frequency             │ │
│  │  • os_version           • amount_distribution               │ │
│  │  • is_emulator          • geographic_movement               │ │
│  │                                                              │ │
│  │ Network Features:    Context Features:                      │ │
│  │  • ip_geolocation      • endpoint_sensitivity               │ │
│  │  • is_vpn               • time_of_day                       │ │
│  │  • is_tor               • day_of_week                       │ │
│  │  • is_proxy             • account_age                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│     │                                                            │
│     ▼                                                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ ML Model (runs in TEE enclave)                             │ │
│  │                                                              │ │
│  │ Model: XGBoost + Neural Network ensemble                   │ │
│  │ Version: v2.3.1                                            │ │
│  │ Latency: <10ms                                             │ │
│  │ Training: On encrypted features (FHE)                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│     │                                                            │
│     ▼                                                            │
│  Risk Score: 0.0 → 1.0                                        │
│     │                                                            │
│     ├─ score < 0.3  → LOW     → Allow (no extra auth)         │
│     ├─ score < 0.6  → MEDIUM  → Step-up 2FA                   │
│     ├─ score < 0.85 → HIGH    → Block + alert user            │
│     └─ score >= 0.85→ CRITICAL→ Block + alert security team   │
│                                   + freeze account              │
└─────────────────────────────────────────────────────────────────┘
```

### Risk Factors & Weights

| Factor | Weight | Detection Method |
|--------|--------|-----------------|
| Device deviation | 0.25 | Fingerprint mismatch from known devices |
| Time anomaly | 0.15 | Login at unusual hours |
| Geographic anomaly | 0.20 | Login from impossible location |
| Transaction pattern | 0.20 | Amount/frequency deviation |
| Network signals | 0.10 | VPN/Tor/proxy detection |
| Account age | 0.10 | New account risk factor |

---

## 8. Differential Privacy

### Concept
Add calibrated noise to query results so that **no individual's data can be reverse-engineered** from aggregate outputs. Mathematically proven privacy guarantee.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                 DIFFERENTIAL PRIVACY PIPELINE                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Query: SELECT AVG(balance) FROM accounts WHERE age > 25        │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 1. Check Privacy Budget                                   │ │
│  │    • User's consumed epsilon: 0.3                         │ │
│  │    • User's total budget: 1.0                             │ │
│  │    • This query epsilon: 0.1                              │ │
│  │    • Remaining: 0.6 → ALLOWED                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│     │                                                            │
│     ▼                                                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 2. Compute True Result                                    │ │
│  │    • True AVG(balance) = ₹45,230.00                      │ │
│  │    • Sensitivity: ₹10,000 (max single user influence)    │ │
│  └────────────────────────────────────────────────────────────┘ │
│     │                                                            │
│     ▼                                                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 3. Add Noise (Laplace mechanism)                          │ │
│  │    • noise = Laplace(0, sensitivity/epsilon)              │ │
│  │    • noise = Laplace(0, 10000/0.1) = Laplace(0, 100000) │ │
│  │    • noisy_result = 45230 + noise                         │ │
│  │    • Return: ₹43,891 (with noise)                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│     │                                                            │
│     ▼                                                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 4. Update Budget                                           │ │
│  │    • consumed_epsilon: 0.3 → 0.4                         │ │
│  │    • Budget exhausted → user must wait (daily reset)      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Privacy Guarantee:                                             │
│  "Whether or not User X is in the database,                    │
│   the query result is equally likely"                           │
│   → Mathematically proven (ε-differential privacy)             │
└─────────────────────────────────────────────────────────────────┘
```

### Privacy Budgets

| Query Type | Epsilon | Budget Per Day |
|-----------|---------|----------------|
| COUNT(*) | 0.01 | 1.0 |
| AVG(amount) | 0.1 | 1.0 |
| SUM(amount) | 0.1 | 1.0 |
| PERCENTILE | 0.05 | 1.0 |
| HISTOGRAM | 0.02 | 1.0 |
| INDIVIDUAL LOOKUP | 0.0 | ∞ (denied — not private) |

---

## 9. Crypto-Agility Framework

### Concept
Design the entire encryption system so algorithms can be **swapped without code changes**. When new standards emerge or threats materialize, migrate in weeks, not years.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                 CRYPTO-AGILITY ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Algorithm Abstraction Layer                                │ │
│  │                                                              │ │
│  │ Interface:                                                   │ │
│  │   encrypt(data, algorithm_id) → ciphertext                 │ │
│  │   decrypt(ciphertext, algorithm_id) → data                 │ │
│  │   sign(data, algorithm_id) → signature                     │ │
│  │   verify(data, signature, algorithm_id) → boolean          │ │
│  │   hash(data, algorithm_id) → hash                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│     │                                                            │
│     ▼                                                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Algorithm Registry (crypto_agility_config table)           │ │
│  │                                                              │ │
│  │ ACTIVE:                                                     │ │
│  │   CRYSTALS-Kyber-1024     (ML-KEM-1024)    → data enc    │ │
│  │   CRYSTALS-Dilithium-87   (ML-DSA-87)      → signatures  │ │
│  │   SHA3-256                (FIPS 202)        → hashing     │ │
│  │   Argon2id                (RFC 9106)        → passwords   │ │
│  │                                                              │ │
│  │ DEPRECATED (auto-migrate):                                  │ │
│  │   AES-256-GCM             → migration deadline: 2027-06   │ │
│  │   RSA-4096                → migration deadline: 2027-03   │ │
│  │                                                              │ │
│  │ PREVIEW (testing):                                          │ │
│  │   FutureAlgo-XYZ          → test environment only          │ │
│  └────────────────────────────────────────────────────────────┘ │
│     │                                                            │
│     ▼                                                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Migration Engine                                           │ │
│  │                                                              │ │
│  │ 1. Dual-write: New data encrypted with new algo           │ │
│  │ 2. Background re-encrypt: Old data with new algo          │ │
│  │ 3. Verify: Check all data re-encrypted                    │ │
│  │ 4. Cutover: Switch read path to new algo                  │ │
│  │ 5. Cleanup: Remove old algo references                    │ │
│  │                                                              │ │
│  │ Zero downtime migration                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Self-Sovereign Identity (SSI)

### Concept
Users hold their own identity credentials in a wallet. Banks issue signed Verifiable Credentials. Users present credentials with ZK proofs. **No central KYC data store.**

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│              SELF-SOVEREIGN IDENTITY ARCHITECTURE                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │    User       │    │    Bank      │    │   Verifier   │     │
│  │  (Wallet)     │    │  (Issuer)    │    │  (RP)        │     │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘     │
│         │                    │                    │              │
│         │  1. Request KYC   │                    │              │
│         │───────────────────▶│                    │              │
│         │                    │                    │              │
│         │  2. Bank verifies  │                    │              │
│         │     identity       │                    │              │
│         │                    │                    │              │
│         │  3. Issues VC:     │                    │              │
│         │  {                 │                    │              │
│         │    "@context": "w3.org/vc",            │              │
│         │    "type": "KYC_Credential",           │              │
│         │    "issuer": "did:bank:sbi",           │              │
│         │    "credentialSubject": {             │              │
│         │      "did": "did:user:abc123",        │              │
│         │      "kycStatus": "verified",         │              │
│         │      "riskLevel": "low"               │              │
│         │    },                                  │              │
│         │    "proof": {                          │              │
│         │      "type": "CRYSTALS-Dilithium",    │              │
│         │      "created": "2026-08-25",         │              │
│         │      "verificationMethod": "...",     │              │
│         │      "proofValue": "base64..."        │              │
│         │    }                                   │              │
│         │  }                                     │              │
│         │◀───────────────────│                    │              │
│         │                    │                    │              │
│         │  4. User generates ZKP:               │              │
│         │     π = Prove(                       │              │
│         │       kycStatus == "verified"         │              │
│         │       AND riskLevel == "low"          │              │
│         │     ) WITHOUT revealing:              │              │
│         │     - Actual KYC documents            │              │
│         │     - Bank account details            │              │
│         │     - Personal information            │              │
│         │                    │                    │              │
│         │  5. Present π ──────────────────────▶│              │
│         │                    │                    │              │
│         │                    │  6. Verify π       │              │
│         │                    │     → true/false   │              │
│         │                    │                    │              │
│         │  7. Access granted ◀─────────────────│              │
│         │     (never saw raw data)              │              │
│                                                                  │
│  Key Benefits:                                                  │
│  • User controls their data                                      │
│  • No central honeypot to attack                                │
│  • Revocable at any time                                        │
│  • Compliant with DPDP Act                                      │
│  • Cross-platform (W3C standard)                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Compliance Mapping

| Requirement | Traditional Approach | Our Innovation |
|------------|---------------------|----------------|
| **RBI Data Localization** | Store in India | India-only nodes + geo-partitioning |
| **PCI-DSS Req 3** | Encrypt card data | FHE (compute without decrypt) + Tokenization |
| **PCI-DSS Req 7** | Access control | ZKP scope verification + Smart Consent |
| **PCI-DSS Req 10** | Audit logs | Hash-chained WORM + ZKP audit proofs |
| **DPDP Consent** | Database record | Cryptographic consent tokens |
| **DPDP Right to Erasure** | Delete record | Soft delete + key destruction |
| **ISO 27001** | Policy-based | Crypto-agility + algorithm migration |
| **Quantum Readiness** | N/A | CRYSTALS-Kyber/Dilithium (NIST PQC) |

---

## Incident Response

### Security Event Classification

| Level | Events | Response Time | Actions |
|-------|--------|---------------|---------|
| **CRITICAL** | Data breach, key compromise, audit chain break | Immediate | Block all access, notify RBI within 6 hours, activate incident response team |
| **HIGH** | Multiple failed ZKPs, anomalous FHE patterns | <5 minutes | Step-up auth, alert security team, investigate |
| **MEDIUM** | Rate limit exceeded, consent revocation anomalies | <1 hour | Log, monitor, investigate if pattern continues |
| **LOW** | Successful login, consent grant, data access | Daily digest | Aggregate review |

### Audit Chain Breach Response
1. Detect chain break via `verify_audit_chain()` function
2. Identify exact sequence number where break occurred
3. Determine if entries were added, modified, or deleted
4. Cross-reference with backup hashes (blockchain anchor)
5. Notify RBI and activate forensic investigation
6. Restore from immutable backup if needed

---

## Performance Benchmarks

| Operation | Latency | Throughput | Notes |
|-----------|---------|------------|-------|
| ZKP Generation | ~200ms | 50/sec | Halo2 circuit |
| ZKP Verification | ~5ms | 5000/sec | Server-side |
| FHE Encrypt | ~50ms | 200/sec | BFV scheme |
| FHE Compute | ~500ms | 20/sec | Simple aggregation |
| PQC Key Gen | ~10ms | 1000/sec | Kyber-1024 |
| PQC Encaps | ~1ms | 10000/sec | Kyber-1024 |
| Hash Chain Append | ~1ms | 10000/sec | SHA3-256 |
| Risk Score | ~8ms | 125/sec | XGBoost in TEE |
