/**
 * Differential Privacy Module
 * Adds calibrated noise to protect individual privacy
 * 
 * Supports: Laplace mechanism, Gaussian mechanism
 * Enforces epsilon budget per user per day
 */

import crypto from 'crypto';

// Laplace mechanism for differential privacy
export function laplaceMechanism(value, sensitivity, epsilon) {
  const u = (Math.random() - 0.5) * 2;
  const noise = -sensitivity / epsilon * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
  return value + noise;
}

// Gaussian mechanism for differential privacy
export function gaussianMechanism(value, sensitivity, epsilon, delta = 1e-5) {
  const sigma = sensitivity * Math.sqrt(2 * Math.log(1.25 / delta)) / epsilon;
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return value + sigma * z;
}

// Add DP noise to a query result
export function addNoise(value, config = {}) {
  const {
    mechanism = 'laplace',
    sensitivity = 1,
    epsilon = 0.1,
    delta = 1e-5,
  } = config;
  const seed = crypto.randomBytes(8).readBigUInt64BE();
  let noisyValue;
  if (mechanism === 'gaussian') {
    noisyValue = gaussianMechanism(value, sensitivity, epsilon, delta);
  } else {
    noisyValue = laplaceMechanism(value, sensitivity, epsilon);
  }
  return {
    originalValue: value,
    noisyValue: Math.round(noisyValue * 100) / 100,
    noiseAdded: Math.round((noisyValue - value) * 100) / 100,
    mechanism,
    sensitivity,
    epsilon,
    seed: seed.toString(),
  };
}

// Check if user has budget remaining
export function checkBudget(userId, epsilonRequested, dailyBudget = 1.0) {
  const today = new Date().toISOString().split('T')[0];
  const consumed = getConsumedBudget(userId, today);
  const remaining = dailyBudget - consumed;
  return {
    hasBudget: remaining >= epsilonRequested,
    consumed,
    remaining,
    dailyBudget,
    requested: epsilonRequested,
    date: today,
  };
}

// Track consumed epsilon (in production, use Redis)
const budgetStore = new Map();
function getConsumedBudget(userId, date) {
  const key = `${userId}:${date}`;
  return budgetStore.get(key) || 0;
}
export function recordBudgetUsage(userId, epsilon, date = new Date().toISOString().split('T')[0]) {
  const key = `${userId}:${date}`;
  const current = budgetStore.get(key) || 0;
  budgetStore.set(key, current + epsilon);
}

// Apply DP to user profile query
export function privatizeProfile(profile, epsilon = 0.1) {
  return {
    ...profile,
    annual_income: addNoise(profile.annual_income || 0, { epsilon, sensitivity: 10000 }).noisyValue,
    transaction_count: addNoise(profile.transaction_count || 0, { epsilon, sensitivity: 1 }).noisyValue,
    average_balance: addNoise(profile.average_balance || 0, { epsilon, sensitivity: 5000 }).noisyValue,
    _dp_metadata: { epsilon, mechanism: 'laplace', timestamp: new Date().toISOString() },
  };
}

// Apply DP to transaction analytics
export function privatizeAnalytics(analytics, epsilon = 0.1) {
  return {
    ...analytics,
    total_spent: addNoise(analytics.total_spent || 0, { epsilon, sensitivity: 1000 }).noisyValue,
    avg_transaction: addNoise(analytics.avg_transaction || 0, { epsilon, sensitivity: 500 }).noisyValue,
    transaction_count: addNoise(analytics.transaction_count || 0, { epsilon, sensitivity: 1 }).noisyValue,
    _dp_metadata: { epsilon, mechanism: 'laplace', timestamp: new Date().toISOString() },
  };
}
