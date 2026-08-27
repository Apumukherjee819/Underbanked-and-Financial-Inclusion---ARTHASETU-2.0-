# Quick Reference Card — Next-Generation Fintech

## API Endpoints Summary

| Method | Endpoint | Description | Auth | ZKP | FHE |
|--------|----------|-------------|------|-----|-----|
| POST | /auth/register | Register (PQC-encrypted) | No | - | - |
| POST | /auth/verify-otp | Verify OTP | No | - | - |
| POST | /auth/login | Login with adaptive risk | No | - | - |
| POST | /auth/refresh | Refresh token (PQC-signed) | Yes | - | - |
| DELETE | /auth/logout | Logout | Yes | - | - |
| POST | /zk/verify | ZKP identity verification | No | ✓ | - |
| GET | /zk/status/{id} | Check ZKP verification | Yes | ✓ | - |
| POST | /bank/verify | Verify bank account | Yes | - | - |
| GET | /bank/verify/{id} | Check verification status | Yes | - | - |
| GET | /bank/accounts | List linked accounts | Yes | - | - |
| POST | /upi/check-status | Check first-time UPI | Yes | ✓ | - |
| GET | /upi/history/{id} | Get UPI history | Yes | - | - |
| POST | /fhe/query | Submit FHE computation | Yes | - | ✓ |
| GET | /fhe/result/{id} | Get FHE result | Yes | - | ✓ |
| POST | /consent/grant | Grant consent (signed) | Yes | - | - |
| GET | /consent/status | Check consent status | Yes | - | - |
| DELETE | /consent/revoke/{id} | Revoke consent | Yes | - | - |
| GET | /consent/list | List all consents | Yes | - | - |
| POST | /transactions/fetch | Fetch transactions (FHE) | Yes | - | ✓ |
| GET | /transactions/fetch/{id} | Check fetch status | Yes | - | ✓ |
| GET | /audit/logs | Get audit logs | Yes | - | - |
| GET | /audit/verify | Verify audit chain integrity | Admin | - | - |
| POST | /security/report | Report suspicious activity | Yes | - | - |
| POST | /data/export | Request data export | Yes | - | - |
| GET | /data/export/{id} | Download export | Yes | - | - |

**Total: 25 Endpoints**

---

## Authentication Headers

```
Authorization: Bearer <jwt_token>
X-API-Key: <api_key>
X-Request-ID: <uuid>
X-Timestamp: <unix_timestamp>
X-Tee-Attestation: <tee_attestation_id>
```

---

## PQC Algorithms Quick Reference

| Algorithm | Type | Use Case | NIST Standard |
|-----------|------|----------|---------------|
| CRYSTALS-Kyber-1024 | KEM | Data encryption | ML-KEM-1024 |
| CRYSTALS-Kyber-768 | KEM | Key encryption | ML-KEM-768 |
| CRYSTALS-Dilithium-87 | Signature | Auth/signing | ML-DSA-87 |
| CRYSTALS-Dilithium-65 | Signature | Auth/signing | ML-DSA-65 |
| CRYSTALS-SPHINCS+-256f | Signature | Audit signing | SLH-DSA-256f |
| SHA3-256 | Hash | Hashing/HMAC | FIPS 202 |
| Argon2id | KDF | Password hashing | RFC 9106 |
| AES-256-GCM | Symmetric | Legacy encryption | Deprecated |

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| VALIDATION_ERROR | 400 | Invalid input parameters |
| AUTHENTICATION_FAILED | 401 | Invalid credentials |
| TOKEN_EXPIRED | 401 | JWT token expired |
| INSUFFICIENT_PERMISSIONS | 403 | Missing required permissions |
| CONSENT_REQUIRED | 403 | User consent required |
| CONSENT_EXPIRED | 403 | Consent token has expired |
| ZKP_VERIFICATION_FAILED | 400 | ZKP proof invalid |
| FHE_COMPUTATION_FAILED | 500 | FHE computation error |
| RESOURCE_NOT_FOUND | 404 | Requested resource not found |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| RISK_SCORE_HIGH | 403 | High risk detected, step-up auth required |
| RISK_SCORE_CRITICAL | 403 | Critical risk, account frozen |
| AUDIT_CHAIN_BROKEN | 500 | Audit trail integrity compromised |
| QUANTUM_MIGRATION_PENDING | 503 | Algorithm migration in progress |
| INTERNAL_ERROR | 500 | Server error |

---

## Rate Limits (Risk-Adjusted)

| Endpoint | Base Limit | Window | Risk Adjustment |
|----------|-----------|--------|-----------------|
| /auth/* | 5 req | 1 min | -50% if risk > 0.6 |
| /bank/* | 20 req | 1 min | -50% if risk > 0.6 |
| /upi/* | 10 req | 1 hour | -50% if risk > 0.6 |
| /consent/* | 30 req | 1 min | -50% if risk > 0.6 |
| /transactions/* | 10 req | 1 hour | -50% if risk > 0.6 |
| /fhe/* | 5 req | 1 hour | -50% if risk > 0.6 |
| /zk/* | 20 req | 1 min | -50% if risk > 0.6 |

---

## Risk Score Actions

| Score Range | Level | Action |
|------------|-------|--------|
| 0.0 - 0.3 | LOW | Allow (no extra auth) |
| 0.3 - 0.6 | MEDIUM | Step-up 2FA |
| 0.6 - 0.85 | HIGH | Block + alert user |
| 0.85 - 1.0 | CRITICAL | Block + alert security + freeze account |

---

## Data Encryption

| Field | Algorithm | Storage |
|-------|-----------|---------|
| phone | SHA3-256 (hash) + CRYSTALS-Kyber (encrypted) | VARCHAR + BYTEA |
| email | SHA3-256 (hash) + CRYSTALS-Kyber (encrypted) | VARCHAR + BYTEA |
| account_number | CRYSTALS-Kyber + Tokenization | BYTEA + VARCHAR |
| ip_address | CRYSTALS-Kyber (encrypted) | BYTEA |
| audit_logs | Hash-chained + WORM | Append-only DB |

---

## Consent Types

| Type | Description | Max Duration |
|------|-------------|--------------|
| bank_transactions | Access transaction history | 90 days |
| upi_status | Check UPI registration status | 30 days |
| full_access | Complete account access | 90 days |
| credit_assessment | Credit scoring data | 60 days |
| kyc_verification | KYC status proof | 30 days |

---

## Privacy Budget (Differential Privacy)

| Query Type | Epsilon Cost | Daily Budget |
|-----------|-------------|--------------|
| COUNT(*) | 0.01 | 1.0 |
| AVG(amount) | 0.1 | 1.0 |
| SUM(amount) | 0.1 | 1.0 |
| PERCENTILE | 0.05 | 1.0 |
| HISTOGRAM | 0.02 | 1.0 |

---

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname
AUDIT_DATABASE_URL=postgresql://user:pass@host:5432/audit_db
DATABASE_ENCRYPTION_KEY=key-id-from-vault

# Redis
REDIS_URL=redis://host:6379

# PQC Keys
PQC_KYBER_KEY_ID=kyber-1024-key-id
PQC_DILITHIUM_KEY_ID=dilithium-87-key-id
HSM_SLOT=0
HSM_PIN=your-hsm-pin

# JWT (PQC-signed)
JWT_ALGORITHM=CRYSTALS-Dilithium-87
JWT_EXPIRY=900
JWT_REFRESH_EXPIRY=604800

# FHE
FHE_SCHEME=BFV
FHE_KEY_SIZE=1024
FHE_NOISE_BIT_SIZE=60

# TEE (Intel SGX)
SGX_ENCLAVE_PATH=/path/to/enclave.signed.so
SGX_ATTESTATION_URL=https:// attestation.service

# ZKP
ZKP_CIRCUIT_DIR=/path/to/circuits/
ZKP_PROVER_URL=http://localhost:8080

# Risk Engine
RISK_MODEL_VERSION=v2.3.1
RISK_TEE_ENCLAVE_ID=sgx-risk-engine

# External APIs
NPCI_API_URL=https://api.npci.org.in
AA_GATEWAY_URL=https://aa.sahamati.org.in
SMS_PROVIDER=twilio
SMS_API_KEY=your-api-key

# Security
RATE_LIMIT_WINDOW=60
RATE_LIMIT_MAX=100
CORS_ORIGINS=https://yourapp.com

# Differential Privacy
DP_DEFAULT_EPSILON=0.1
DP_DAILY_BUDGET=1.0

# Crypto-Agility
CRYPTO_MIGRATION_ENABLED=true
CRYPTO_LEGACY_GRACE_PERIOD_DAYS=180

# Blockchain Anchor
BLOCKCHAIN_ANCHOR_URL=https://anchor.service
BLOCKCHAIN_ANCHOR_INTERVAL=100
```

---

## Database Connection

```bash
# Connect to database
psql $DATABASE_URL

# Connect to audit database (append-only)
psql $AUDIT_DATABASE_URL

# Run migrations
npm run migrate

# Verify audit chain integrity
npm run audit:verify

# Run crypto migration
npm run crypto:migrate --from=RSA-4096 --to=CRYSTALS-Kyber-1024
```

---

## Testing

```bash
# Run all tests
npm test

# Run PQC tests
npm run test:pqc

# Run ZKP tests
npm run test:zkp

# Run FHE tests
npm run test:fhe

# Run TEE tests
npm run test:tee

# Run security tests
npm run test:security

# Run audit chain verification
npm run test:audit-chain

# Run differential privacy tests
npm run test:dp

# Generate coverage report
npm run test:coverage
```

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied (16 tables)
- [ ] PQC keys generated (Kyber + Dilithium)
- [ ] HSM initialized and configured
- [ ] TEE enclaves deployed (Intel SGX)
- [ ] ZKP circuits compiled and deployed
- [ ] FHE engine initialized
- [ ] Audit chain genesis block created
- [ ] Differential privacy budgets configured
- [ ] Risk scoring model loaded in TEE
- [ ] SSL certificates installed (PQC-compatible)
- [ ] Firewall rules configured
- [ ] Rate limiting enabled (risk-adjusted)
- [ ] Monitoring alerts set up
- [ ] Backup schedule configured
- [ ] Security audit completed
- [ ] Quantum attack simulation passed
- [ ] RBI compliance checklist verified
- [ ] DPDP compliance verified
- [ ] Incident response plan documented
