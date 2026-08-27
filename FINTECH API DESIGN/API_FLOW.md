# API Flow Diagrams — Next-Generation Fintech

## Overview

Detailed flow diagrams for all major API operations, incorporating **10 cutting-edge security innovations**:

- ZKP (Zero-Knowledge Proofs)
- FHE (Homomorphic Encryption)
- PQC (Post-Quantum Cryptography)
- Hash-Chained Audit Trail
- TEE (Confidential Computing)
- Smart Consent
- Adaptive AI Risk Scoring
- Differential Privacy
- Crypto-Agility
- Self-Sovereign Identity

---

## 1. ZKP Identity Verification Flow

```
┌─────────────────────────────────────────────────────────────────┐
│               ZKP IDENTITY VERIFICATION FLOW                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Client                  Server (Verifier)          TEE Enclave  │
│    │                         │                         │        │
│    │  1. POST /zk/verify     │                         │        │
│    │  {                      │                         │        │
│    │    proof_type: "age",   │                         │        │
│    │    proof_bytes: <ZKP>,  │                         │        │
│    │    public_inputs: {     │                         │        │
│    │      min_age: 18,       │                         │        │
│    │      current_date: "..."│                         │        │
│    │    },                   │                         │        │
│    │    circuit_id: "age_ge_18"                       │        │
│    │  }                      │                         │        │
│    │───────────────────────▶│                         │        │
│    │                         │                         │        │
│    │                         │  2. Extract features ──▶│        │
│    │                         │     (in TEE)            │        │
│    │                         │                         │        │
│    │                         │  3. Verify ZKP          │        │
│    │                         │     is_valid = Verify(  │        │
│    │                         │       proof, public,    │        │
│    │                         │       circuit)          │        │
│    │                         │                         │        │
│    │                         │  4. Attest result ─────▶│        │
│    │                         │                         │        │
│    │                         │  5. Log audit ──────────▶│        │
│    │                         │     (hash-chained)      │        │
│    │                         │                         │        │
│    │  6. 200 {               │                         │        │
│    │    is_valid: true,      │                         │        │
│    │    verified_at: "...",  │                         │        │
│    │    verification_id: "..."                        │        │
│    │  }                      │                         │        │
│    │◀───────────────────────│                         │        │
│    │                         │                         │        │
│  Server NEVER sees: date of birth, raw identity data         │
│  Only learns: "age >= 18 is TRUE"                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. FHE Transaction Query Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              FHE TRANSACTION QUERY FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Client               FHE Engine (TEE)              Database     │
│    │                       │                         │          │
│    │  1. POST /fhe/query   │                         │          │
│    │  {                    │                         │          │
│    │    query_type: "avg", │                         │          │
│    │    encrypted_params:  │                         │          │
│    │      <FHE ciphertext> │                         │          │
│    │    fhe_scheme: "BFV", │                         │          │
│    │    consent_token: "..."                         │          │
│    │  }                    │                         │          │
│    │─────────────────────▶│                         │          │
│    │                       │                         │          │
│    │                       │  2. Verify consent      │          │
│    │                       │     (cryptographic)     │          │
│    │                       │                         │          │
│    │                       │  3. Enter TEE enclave   │          │
│    │                       │     ┌───────────────┐   │          │
│    │                       │     │ ENCRYPTED     │   │          │
│    │                       │     │ MEMORY        │   │          │
│    │                       │     │               │   │          │
│    │                       │     │ 4. Fetch ─────┼──▶│          │
│    │                       │     │ encrypted     │   │          │
│    │                       │     │ data          │   │          │
│    │                       │     │               │   │          │
│    │                       │     │ 5. FHE compute│   │          │
│    │                       │     │ ct_result =   │   │          │
│    │                       │     │ FHE_Avg(      │   │          │
│    │                       │     │  ct_balances) │   │          │
│    │                       │     │               │   │          │
│    │                       │     │ 6. Add DP     │   │          │
│    │                       │     │ noise         │   │          │
│    │                       │     │               │   │          │
│    │                       │     │ 7. Attest ────┼──▶│ (TEE)    │
│    │                       │     └───────────────┘   │          │
│    │                       │                         │          │
│    │                       │  8. Log FHE computation │          │
│    │                       │     (hash-chained)      │          │
│    │                       │                         │          │
│    │  9. 200 {             │                         │          │
│    │    result_encrypted:  │                         │          │
│    │      <FHE ciphertext>,│                         │          │
│    │    fhe_scheme: "BFV", │                         │          │
│    │    dp_noise_added: true,                       │          │
│    │    tee_attestation: "..."                      │          │
│    │  }                    │                         │          │
│    │◀─────────────────────│                         │          │
│    │                       │                         │          │
│    │  10. Decrypt locally: │                         │          │
│    │    avg = Dec(ct_result)│                        │          │
│    │    → ₹45,230          │                         │          │
│                                                                  │
│  Server processes: CIPHERTEXT ONLY                               │
│  Server learns: NOTHING about actual balances                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. PQC-Secured User Registration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              PQC USER REGISTRATION FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Client                    Server                    SMS Provider│
│    │                         │                         │        │
│    │  1. POST /auth/register │                         │        │
│    │  {phone, email,         │                         │        │
│    │   device_fingerprint,   │                         │        │
│    │   did (optional)}       │                         │        │
│    │───────────────────────▶│                         │        │
│    │                         │                         │        │
│    │                         │  2. PQC Key Generation  │        │
│    │                         │     keypair =           │        │
│    │                         │     CRYSTALS-Kyber-     │        │
│    │                         │     1024.KeyGen()       │        │
│    │                         │                         │        │
│    │                         │  3. Encrypt PII with PQC│        │
│    │                         │     phone_ct = ML-KEM   │        │
│    │                         │     .Encaps(phone, pk)  │        │
│    │                         │                         │        │
│    │                         │  4. Compute ZKP         │        │
│    │                         │     commitment =        │        │
│    │                         │     Pedersen(phone)     │        │
│    │                         │                         │        │
│    │                         │  5. Store in DB         │        │
│    │                         │     (phone_hash,        │        │
│    │                         │      phone_encrypted,   │        │
│    │                         │      phone_commitment)  │        │
│    │                         │                         │        │
│    │                         │  6. Generate OTP        │        │
│    │                         │────────────────────────▶│        │
│    │                         │                         │        │
│    │  7. 201 {otp_sent,      │                         │        │
│    │    expires_in: 300,     │                         │        │
│    │    pqc_key_id: "..."}   │                         │        │
│    │◀───────────────────────│                         │        │
│    │                         │                         │        │
│    │  8. POST /auth/verify-otp                         │        │
│    │  {phone, otp, device_fingerprint}                 │        │
│    │───────────────────────▶│                         │        │
│    │                         │  9. Verify OTP         │        │
│    │                         │  10. Create User       │        │
│    │                         │  11. Generate JWT      │        │
│    │                         │      (PQC-signed)      │        │
│    │                         │  12. Hash-chained audit│        │
│    │                         │                         │        │
│    │  13. 200 {access_token, │                         │        │
│    │    refresh_token,       │                         │        │
│    │    did: "did:user:..."} │                         │        │
│    │◀───────────────────────│                         │        │
│                                                                  │
│  PII encrypted with: CRYSTALS-Kyber-1024 (quantum-resistant)   │
│  JWT signed with: CRYSTALS-Dilithium-87 (quantum-resistant)    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Smart Consent Grant Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                SMART CONSENT GRANT FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Client                    Server                   User Wallet  │
│    │                         │                         │        │
│    │  1. POST /consent/grant │                         │        │
│    │  {                      │                         │        │
│    │    consent_type:        │                         │        │
│    │      "bank_transactions",                         │        │
│    │    purpose:             │                         │        │
│    │      "credit_assessment",                         │        │
│    │    bank_account_id: "...",                        │        │
│    │    data_types:          │                         │        │
│    │      ["transactions"],  │                         │        │
│    │    duration_days: 90    │                         │        │
│    │  }                      │                         │        │
│    │───────────────────────▶│                         │        │
│    │                         │                         │        │
│    │                         │  2. Validate request    │        │
│    │                         │  3. Generate consent    │        │
│    │                         │     token               │        │
│    │                         │                         │        │
│    │                         │  4. Request user ──────▶│        │
│    │                         │     signature           │        │
│    │                         │                         │        │
│    │                         │     5. User signs       │        │
│    │                         │     consent with        │        │
│    │                         │     Dilithium-87        │        │
│    │                         │◀──────────────────────│        │
│    │                         │                         │        │
│    │                         │  6. Verify signature    │        │
│    │                         │     using user's        │        │
│    │                         │     public key          │        │
│    │                         │                         │        │
│    │                         │  7. Store consent       │        │
│    │                         │     (SHA3-256 of token) │        │
│    │                         │  8. Hash-chained audit  │        │
│    │                         │                         │        │
│    │  9. 201 {               │                         │        │
│    │    consent_id: "...",   │                         │        │
│    │    consent_token:       │                         │        │
│    │      "cnt_[32chars]",  │                         │        │
│    │    status: "active",    │                         │        │
│    │    expires_at: "...",   │                         │        │
│    │    scope: ["txns"],     │                         │        │
│    │    signature_algo:      │                         │        │
│    │      "Dilithium-87"     │                         │        │
│    │  }                      │                         │        │
│    │◀───────────────────────│                         │        │
│                                                                  │
│  Consent is: Cryptographically signed by user                   │
│  Verification: Server verifies signature, not just DB record    │
│  Revocation: Instant, cryptographic (CRL)                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Adaptive Risk-Authenticated Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              ADAPTIVE RISK AUTHENTICATION FLOW                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Client          Risk Engine (TEE)      Auth Service     Audit  │
│    │                   │                    │              │     │
│    │  1. POST          │                    │              │     │
│    │  /auth/login      │                    │              │     │
│    │  {phone, password,│                    │              │     │
│    │   device_fp}      │                    │              │     │
│    │─────────────────▶│                    │              │     │
│    │                   │                    │              │     │
│    │                   │  2. Extract features              │     │
│    │                   │     (in TEE enclave)              │     │
│    │                   │                    │              │     │
│    │                   │  3. ML inference   │              │     │
│    │                   │     risk_score =   │              │     │
│    │                   │     model.predict()│              │     │
│    │                   │                    │              │     │
│    │                   │  4. Determine action              │     │
│    │                   │                    │              │     │
│    │                   │  ┌─────────────────┤              │     │
│    │                   │  │ risk < 0.3:     │              │     │
│    │                   │  │  → ALLOW        │              │     │
│    │                   │  │                 │              │     │
│    │                   │  │ 0.3-0.6:        │              │     │
│    │                   │  │  → STEP_UP_2FA  │              │     │
│    │                   │  │                 │              │     │
│    │                   │  │ 0.6-0.85:       │              │     │
│    │                   │  │  → BLOCK        │              │     │
│    │                   │  │                 │              │     │
│    │                   │  │ >= 0.85:        │              │     │
│    │                   │  │  → BLOCK +      │              │     │
│    │                   │  │    ALERT +      │              │     │
│    │                   │  │    FREEZE       │              │     │
│    │                   │  └─────────────────┤              │     │
│    │                   │                    │              │     │
│    │                   │  5. Risk score ───▶│              │     │
│    │                   │     action         │              │     │
│    │                   │                    │              │     │
│    │                   │                    │  6. Hash-    │     │
│    │                   │                    │  chained     │     │
│    │                   │                    │  audit ─────▶│     │
│    │                   │                    │              │     │
│    │  7a. ALLOW:       │                    │              │     │
│    │  200 {token}      │                    │              │     │
│    │                   │                    │              │     │
│    │  7b. STEP_UP:     │                    │              │     │
│    │  202 {requires_2fa,│                   │              │     │
│    │    otp_sent: true}│                    │              │     │
│    │                   │                    │              │     │
│    │  7c. BLOCK:       │                    │              │     │
│    │  403 {blocked,    │                    │              │     │
│    │    reason: "...", │                    │              │     │
│    │    retry_after:   │                    │              │     │
│    │      3600}        │                    │              │     │
│    │◀─────────────────│                    │              │     │
│                                                                  │
│  Risk factors considered:                                        │
│  • Device fingerprint deviation from known devices              │
│  • Login time anomaly                                           │
│  • Geographic impossibility                                     │
│  • Transaction pattern deviation                                │
│  • VPN/Tor/Proxy detection                                      │
│  • Account age                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Hash-Chained Audit Verification Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              AUDIT CHAIN VERIFICATION FLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Admin              Audit Service         Blockchain Anchor     │
│    │                     │                        │             │
│    │  1. GET             │                        │             │
│    │  /audit/verify      │                        │             │
│    │  {start_seq: 1,     │                        │             │
│    │   end_seq: null}    │                        │             │
│    │───────────────────▶│                        │             │
│    │                     │                        │             │
│    │                     │  2. Scan all entries   │             │
│    │                     │     from start_seq     │             │
│    │                     │                        │             │
│    │                     │  3. For each entry:    │             │
│    │                     │     verify hash chain  │             │
│    │                     │     entry[i].prev_hash │             │
│    │                     │     == entry[i-1].hash │             │
│    │                     │                        │             │
│    │                     │  4. Check blockchain   │             │
│    │                     │     anchor every 100th │             │
│    │                     │──────────────────────▶│             │
│    │                     │                        │             │
│    │                     │  5. Anchor verified    │             │
│    │                     │◀──────────────────────│             │
│    │                     │                        │             │
│    │  6. 200 {           │                        │             │
│    │    is_valid: true,  │                        │             │
│    │    total_entries:   │                        │             │
│    │      123456,        │                        │             │
│    │    first_seq: 1,    │                        │             │
│    │    last_seq: 123456,│                        │             │
│    │    chain_integrity: │                        │             │
│    │      "INTACT",      │                        │             │
│    │    blockchain_anchors:                      │             │
│    │      1234,           │                        │             │
│    │    latest_entry:    │                        │             │
│    │      "2026-08-25T.." │                        │             │
│    │  }                  │                        │             │
│    │◀───────────────────│                        │             │
│                                                                  │
│  Tamper Detection:                                               │
│  If ANY entry modified → hash changes → chain breaks → ALERT   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. SSI Credential Issuance Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              SSI CREDENTIAL ISSUANCE FLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User (Wallet)              Bank (Issuer)           DID Registry │
│    │                           │                         │      │
│    │  1. Request KYC           │                         │      │
│    │  credential               │                         │      │
│    │  {did: "did:user:abc"}   │                         │      │
│    │─────────────────────────▶│                         │      │
│    │                           │                         │      │
│    │  2. User presents         │                         │      │
│    │     existing documents    │                         │      │
│    │─────────────────────────▶│                         │      │
│    │                           │                         │      │
│    │                           │  3. Bank verifies       │      │
│    │                           │     KYC documents       │      │
│    │                           │                         │      │
│    │                           │  4. Issue VC:           │      │
│    │                           │  {                      │      │
│    │                           │    "@context": "w3.org/vc"     │
│    │                           │    "type": "KYC_Credential"    │
│    │                           │    "issuer": "did:bank:sbi"    │
│    │                           │    "credentialSubject": {      │
│    │                           │      "did": "did:user:abc",    │
│    │                           │      "kycStatus": "verified"   │
│    │                           │    },                          │
│    │                           │    "proof": {                  │
│    │                           │      "type": "Dilithium-87",   │
│    │                           │      "proofValue": "..."       │
│    │                           │    }                           │
│    │                           │  }                             │
│    │                           │                         │      │
│    │                           │  5. Register DID ──────▶│      │
│    │                           │     (optional)          │      │
│    │                           │                         │      │
│    │  6. Receive VC            │                         │      │
│    │     in wallet ◀──────────│                         │      │
│    │                           │                         │      │
│    │  7. Later: Generate ZKP   │                         │      │
│    │     π = Prove(            │                         │      │
│    │       kycStatus == "verified"                      │      │
│    │     ) WITHOUT revealing:  │                         │      │
│    │     - KYC documents       │                         │      │
│    │     - Personal info       │                         │      │
│    │     - Bank details        │                         │      │
│    │                           │                         │      │
│    │  8. Present π to          │                         │      │
│    │     any verifier          │                         │      │
│                                                                  │
│  User owns their data. No central honeypot.                    │
│  Revocable at any time. W3C standard.                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Crypto-Agility Migration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              CRYPTO-AGILITY MIGRATION FLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Admin         Migration Engine         Database     Key Vault  │
│    │                  │                    │             │       │
│    │  1. Initiate     │                    │             │       │
│    │  migration       │                    │             │       │
│    │  {from: "RSA-    │                    │             │       │
│    │   4096",         │                    │             │       │
│    │   to: "CRYSTALS- │                    │             │       │
│    │   Kyber-1024"}   │                    │             │       │
│    │────────────────▶│                    │             │       │
│    │                  │                    │             │       │
│    │                  │  2. Phase 1: Dual-write          │       │
│    │                  │     New data encrypted           │       │
│    │                  │     with BOTH algorithms         │       │
│    │                  │──────────────────▶│             │       │
│    │                  │                    │             │       │
│    │                  │  3. Phase 2: Background re-encrypt│       │
│    │                  │     Old data re-encrypted        │       │
│    │                  │     with new algorithm           │       │
│    │                  │──────────────────▶│             │       │
│    │                  │                    │             │       │
│    │                  │  4. Phase 3: Verify              │       │
│    │                  │     All data re-encrypted        │       │
│    │                  │     0 records with old algo      │       │
│    │                  │──────────────────▶│             │       │
│    │                  │                    │             │       │
│    │                  │  5. Phase 4: Cutover             │       │
│    │                  │     Switch read path             │       │
│    │                  │     to new algorithm             │       │
│    │                  │──────────────────▶│             │       │
│    │                  │                    │             │       │
│    │                  │  6. Phase 5: Cleanup             │       │
│    │                  │     Remove old algo              │       │
│    │                  │     references from              │       │
│    │                  │     crypto_agility_config        │       │
│    │                  │──────────────────▶│             │       │
│    │                  │                    │             │       │
│    │                  │  7. Retire old keys │             │       │
│    │                  │────────────────────────────────▶│       │
│    │                  │                    │             │       │
│    │  8. Migration    │                    │             │       │
│    │  complete ✓     │                    │             │       │
│    │◀────────────────│                    │             │       │
│                                                                  │
│  Zero downtime. Zero data exposure.                            │
│  Rollback possible at any phase.                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Differential Privacy Analytics Flow

```
┌─────────────────────────────────────────────────────────────────┐
│           DIFFERENTIAL PRIVACY ANALYTICS FLOW                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Analyst          DP Engine            Database       Budget    │
│    │                  │                    │             │       │
│    │  1. Query:       │                    │             │       │
│    │  SELECT AVG(balance)                  │             │       │
│    │  FROM accounts WHERE age > 25         │             │       │
│    │────────────────▶│                    │             │       │
│    │                  │                    │             │       │
│    │                  │  2. Check budget   │             │       │
│    │                  │     user_epsilon:  │             │       │
│    │                  │     consumed: 0.3  │             │       │
│    │                  │     total: 1.0     │             │       │
│    │                  │     query_cost: 0.1│             │       │
│    │                  │     remaining: 0.6 │             │       │
│    │                  │     → ALLOWED      │             │       │
│    │                  │                    │             │       │
│    │                  │  3. Fetch true     │             │       │
│    │                  │     result         │             │       │
│    │                  │──────────────────▶│             │       │
│    │                  │                    │             │       │
│    │                  │  4. true_avg =     │             │       │
│    │                  │     ₹45,230.00    │             │       │
│    │                  │                    │             │       │
│    │                  │  5. Add Laplace    │             │       │
│    │                  │     noise          │             │       │
│    │                  │     sensitivity =  │             │       │
│    │                  │     ₹10,000        │             │       │
│    │                  │     epsilon = 0.1  │             │       │
│    │                  │     scale = 100000 │             │       │
│    │                  │     noise =        │             │       │
│    │                  │     Laplace(0,     │             │       │
│    │                  │       100000)      │             │       │
│    │                  │     noisy_avg =    │             │       │
│    │                  │     ₹43,891.42     │             │       │
│    │                  │                    │             │       │
│    │                  │  6. Update budget  │             │       │
│    │                  │────────────────────────────────▶│       │
│    │                  │     consumed: 0.4  │             │       │
│    │                  │                    │             │       │
│    │  7. Response:    │                    │             │       │
│    │  {               │                    │             │       │
│    │    avg_balance:  │                    │             │       │
│    │      43891.42,   │                    │             │       │
│    │    dp_epsilon:   │                    │             │       │
│    │      0.1,        │                    │             │       │
│    │    privacy_      │                    │             │       │
│    │      guarantee:  │                    │             │       │
│    │      "differential_privacy",          │             │       │
│    │    remaining_    │                    │             │       │
│    │      budget: 0.6 │                    │             │       │
│    │  }               │                    │             │       │
│    │◀────────────────│                    │             │       │
│                                                                  │
│  Privacy Guarantee:                                             │
│  "Whether or not User X is in the database,                    │
│   the result is equally likely"                                 │
│  → Mathematically proven (ε = 0.1)                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. End-to-End Secure Transaction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│           END-TO-END SECURE TRANSACTION FLOW                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Client    Risk    ZKP    Consent   FHE     TEE     Audit       │
│    │        │       │        │       │       │        │         │
│    │  1. POST /transactions/fetch           │        │         │
│    │  {bank_account_id,                     │        │         │
│    │   consent_token: "cnt_xxx",            │        │         │
│    │   from_date, to_date}                  │        │         │
│    │───────▶│       │        │       │      │        │         │
│    │        │       │        │       │      │        │         │
│    │        │  2. Risk Score (in TEE)│      │        │         │
│    │        │  risk = 0.15 (LOW)    │      │        │         │
│    │        │──────▶│        │       │      │        │         │
│    │        │        │       │       │      │        │         │
│    │        │        │  3. Verify Consent  │      │        │
│    │        │        │  cryptographically  │      │        │
│    │        │        │  signature valid ✓  │      │        │
│    │        │        │  scope includes     │      │        │
│    │        │        │  "transactions" ✓   │      │        │
│    │        │        │  not expired ✓      │      │        │
│    │        │        │──────▶│       │      │        │         │
│    │        │        │        │       │      │        │         │
│    │        │        │        │  4. FHE Query│      │        │
│    │        │        │        │  (encrypted)│      │        │
│    │        │        │        │──────▶│      │        │         │
│    │        │        │        │       │      │        │         │
│    │        │        │        │       │  5. Process in TEE│    │
│    │        │        │        │       │  decrypt→query    │    │
│    │        │        │        │       │  →encrypt result  │    │
│    │        │        │        │       │──────▶│        │         │
│    │        │        │        │       │      │        │         │
│    │        │        │        │       │      │  6. Hash-chained│
│    │        │        │        │       │      │  audit entry   │
│    │        │        │        │       │      │──────▶│         │
│    │        │        │        │       │      │        │         │
│    │  7. Response:                              │        │         │
│    │  {transactions_encrypted: <FHE>,           │        │
│    │   fhe_scheme: "BFV",                       │        │
│    │   tee_attestation: "<attestation>",        │        │
│    │   consent_verified: true,                  │        │
│    │   risk_score: 0.15,                        │        │
│    │   audit_chain_id: 12345}                   │        │
│    │◀───────│       │        │       │      │        │         │
│                                                                  │
│  8. Client decrypts FHE result locally:                         │
│     transactions = FHE_Decrypt(ct_result)                       │
│                                                                  │
│  Security guarantees:                                           │
│  ✓ Risk-scored (adaptive auth)                                  │
│  ✓ ZKP-verified identity                                        │
│  ✓ Cryptographically verified consent                           │
│  ✓ FHE-processed (server saw ciphertext only)                   │
│  ✓ TEE-attested (hardware-verified computation)                 │
│  ✓ Hash-chained audit trail                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   ERROR HANDLING FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Client                    Server                   Error Log   │
│    │                         │                         │        │
│    │  1. API Request         │                         │        │
│    │───────────────────────▶│                         │        │
│    │                         │                         │        │
│    │                         │  2. Process Request     │        │
│    │                         │  3. Error Occurs        │        │
│    │                         │                         │        │
│    │                         │  4. Classify Error      │        │
│    │                         │  5. Generate Error ID   │        │
│    │                         │  6. Sanitize Response   │        │
│    │                         │  7. Hash-chained audit  │        │
│    │                         │────────────────────────▶│        │
│    │                         │                         │        │
│    │  8. Error Response      │                         │        │
│    │  {status: error,        │                         │        │
│    │   error: {code, msg,    │                         │        │
│    │   reference_id}}        │                         │        │
│    │◀───────────────────────│                         │        │
│                                                                  │
│  Error response NEVER includes:                                 │
│  • Stack traces                                                 │
│  • Internal paths                                               │
│  • Database queries                                             │
│  • Encryption keys                                              │
│  • Raw PII                                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. Data Export Flow (GDPR/DPDP)

```
┌─────────────────────────────────────────────────────────────────┐
│              DATA EXPORT FLOW (DPDP Compliant)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Client                    Server              Encryption Layer  │
│    │                         │                         │        │
│    │  1. POST /data/export   │                         │        │
│    │  {consent_token,        │                         │        │
│    │   data_types,           │                         │        │
│    │   export_format: "json"}│                         │        │
│    │───────────────────────▶│                         │        │
│    │                         │                         │        │
│    │                         │  2. Verify Consent      │        │
│    │                         │     (cryptographic)     │        │
│    │                         │                         │        │
│    │                         │  3. Compile Data        │        │
│    │                         │     (FHE-decrypted      │        │
│    │                         │      locally only)      │        │
│    │                         │                         │        │
│    │                         │  4. Encrypt Export      │        │
│    │                         │     with PQC            │        │
│    │                         │────────────────────────▶│        │
│    │                         │                         │        │
│    │                         │  5. Generate Secure URL │        │
│    │                         │  6. Set Expiry (24h)    │        │
│    │                         │  7. Hash-chained audit  │        │
│    │                         │                         │        │
│    │  8. 200 {export_url,    │                         │        │
│    │    expires_at: "...",   │                         │        │
│    │    encryption: "PQC",   │                         │        │
│    │    download_limit: 3}   │                         │        │
│    │◀───────────────────────│                         │        │
│                                                                  │
│  Export is:                                                     │
│  • PQC-encrypted (quantum-resistant)                            │
│  • Time-limited (24h expiry)                                    │
│  • Download-limited (3 attempts)                                │
│  • Consent-verified                                             │
│  • Audit-logged (hash-chained)                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 13. Account Deletion Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                 ACCOUNT DELETION FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Client                    Server                   Archive     │
│    │                         │                         │        │
│    │  1. DELETE /users/me    │                         │        │
│    │  {password, reason,     │                         │        │
│    │   delete_data: true}    │                         │        │
│    │───────────────────────▶│                         │        │
│    │                         │                         │        │
│    │                         │  2. Verify Password     │        │
│    │                         │  3. Verify Consent      │        │
│    │                         │  4. Check Dependencies  │        │
│    │                         │                         │        │
│    │                         │  5. Revoke ALL tokens   │        │
│    │                         │     (consent, API, JWT) │        │
│    │                         │                         │        │
│    │                         │  6. Destroy encryption  │        │
│    │                         │     keys (FHE/PQC)      │        │
│    │                         │     → Data unrecoverable│        │
│    │                         │                         │        │
│    │                         │  7. Soft Delete User    │        │
│    │                         │  8. Archive Data        │        │
│    │                         │────────────────────────▶│        │
│    │                         │                         │        │
│    │                         │  9. Schedule Purge      │        │
│    │                         │     (30 days)           │        │
│    │                         │  10. Hash-chained audit │        │
│    │                         │                         │        │
│    │  11. 200 {status:       │                         │        │
│    │    deletion_scheduled,  │                         │        │
│    │    purge_date: "...",   │                         │        │
│    │    data_destroyed: true,│                         │        │
│    │    keys_destroyed: true}│                         │        │
│    │◀───────────────────────│                         │        │
│                                                                  │
│  Deletion is:                                                   │
│  • Consent-verified                                             │
│  • Key destruction (data mathematically unrecoverable)          │
│  • Hash-chained audit logged                                    │
│  • DPDP-compliant (right to erasure)                           │
└─────────────────────────────────────────────────────────────────┘
```
