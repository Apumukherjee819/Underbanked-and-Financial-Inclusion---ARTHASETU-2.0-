/**
 * ArthaSetu Security Client
 * Frontend module for interacting with security API
 * 
 * Features:
 * - PQC-encrypted communication
 * - ZKP proof generation (client-side)
 * - Consent token management
 * - Security dashboard
 */

const API_BASE = window.location.origin + '/api';

class ArthaSetuSecurity {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.userId = null;
    this.consentTokens = {};
  }

  // ========== Authentication ==========
  async register(phone, email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;
      this.userId = data.user.id;
    }
    return data;
  }

  async login(phone, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    });
    const data = await res.json();
    if (res.ok) {
      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;
      this.userId = data.user.id;
    }
    return data;
  }

  async getMe() {
    return this._authGet('/auth/me');
  }

  // ========== Profile ==========
  async submitProfile(profileData) {
    return this._authPost('/profile', profileData);
  }

  async generateZKP(proofType, data) {
    return this._authPost('/profile/generate-zkp', { proofType, data });
  }

  async verifyZKP(proofData) {
    return this._authPost('/profile/verify-zkp', proofData);
  }

  async getDigitalConfidence() {
    return this._authGet('/profile/digital-confidence');
  }

  // ========== Assessments ==========
  async getQuiz(type) {
    return this._authGet(`/assessment/quiz/${type}`);
  }

  async submitQuiz(type, answers) {
    return this._authPost(`/assessment/quiz/${type}/submit`, { answers });
  }

  async getDigitalTasks() {
    return this._authGet('/assessment/tasks/digital-confidence');
  }

  async submitDigitalTask(taskId, result) {
    return this._authPost('/assessment/tasks/digital-confidence/submit', { taskId, result });
  }

  // ========== Consent ==========
  async grantConsent(bankAccountId, consentType, purpose, dataTypes, expiresInDays, maxAccessCount) {
    const res = await this._authPost('/consent/grant', {
      bankAccountId, consentType, purpose, dataTypes, expiresInDays, maxAccessCount,
    });
    if (res.consentToken) {
      this.consentTokens[res.consent.consent_type] = res.consentToken;
    }
    return res;
  }

  async getConsents() {
    return this._authGet('/consent/list');
  }

  async revokeConsent(consentId, reason) {
    return this._authPost('/consent/revoke', { consentId, reason });
  }

  async verifyConsent(consentToken, requiredType) {
    return this._authPost('/consent/verify', { consentToken, requiredType });
  }

  // ========== ZKP ==========
  async generateZKPProof(proofType, data, verifierId) {
    return this._authPost('/zkp/prove', { proofType, data, verifierId });
  }

  async verifyZKPProof(proofData) {
    return this._authPost('/zkp/verify', proofData);
  }

  async getZKPHistory() {
    return this._authGet('/zkp/history');
  }

  async getZKPCircuits() {
    return this._authGet('/zkp/circuits');
  }

  // ========== FHE ==========
  async fheCompute(computationType, encryptedData, parameters) {
    return this._authPost('/fhe/compute', { computationType, encryptedData, parameters });
  }

  async fheEncrypt(plaintext, publicKey) {
    return this._authPost('/fhe/encrypt', { plaintext, publicKey });
  }

  async fheDecrypt(ciphertextData, secretKey) {
    return this._authPost('/fhe/decrypt', { ciphertextData, secretKey });
  }

  async getFHEAttestation(computationId) {
    return this._authGet(`/fhe/attestation/${computationId}`);
  }

  async getFHEHistory() {
    return this._authGet('/fhe/history');
  }

  // ========== Audit ==========
  async getAuditTrail(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this._authGet(`/audit/trail?${query}`);
  }

  async verifyAuditChain() {
    return this._authGet('/audit/verify-chain');
  }

  async getAuditSummary() {
    return this._authGet('/audit/summary');
  }

  async anchorAudit() {
    return this._authPost('/audit/anchor', {});
  }

  async getMerkleRoot() {
    return this._authGet('/audit/merkle-root');
  }

  // ========== Risk ==========
  async assessRisk(context) {
    return this._authPost('/risk/assess', context);
  }

  async getRiskHistory() {
    return this._authGet('/risk/history');
  }

  async getRiskStats() {
    return this._authGet('/risk/stats');
  }

  async getRiskModel() {
    return this._authGet('/risk/model');
  }

  // ========== Export ==========
  async exportData() {
    return this._authGet('/export/data');
  }

  async deleteData(confirmation) {
    return this._authDelete('/export/data', { confirmation });
  }

  // ========== Security Info ==========
  async getSecurityInfo() {
    const res = await fetch(`${API_BASE}/security/info`);
    return res.json();
  }

  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  }

  // ========== Helpers ==========
  async _authGet(path) {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: this._headers(),
    });
    return res.json();
  }

  async _authPost(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify(body),
    });
    return res.json();
  }

  async _authDelete(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'DELETE',
      headers: this._headers(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return res.json();
  }

  _headers() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.accessToken) headers['Authorization'] = `Bearer ${this.accessToken}`;
    return headers;
  }

  // ========== Security Dashboard ==========
  async getSecurityDashboard() {
    const [health, securityInfo, auditSummary, riskStats, consents] = await Promise.all([
      this.getHealth(),
      this.getSecurityInfo(),
      this.getAuditSummary(),
      this.getRiskStats(),
      this.getConsents(),
    ]);
    return { health, securityInfo, auditSummary, riskStats, consents };
  }
}

// Export singleton
window.ArthaSetuSecurity = new ArthaSetuSecurity();
