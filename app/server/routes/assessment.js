/**
 * Assessment Routes
 * Financial literacy quiz + digital confidence tasks with FHE scoring
 */

import { Router } from 'express';
import db from '../db/connection.js';
import { authenticate } from '../middleware/auth.js';
import { encrypt, computeEncryptedSum, computeEncryptedAverage, createComputationRecord } from '../crypto/fhe.js';
import { proveConfidenceScore } from '../crypto/zkp.js';
import { addNoise, checkBudget, recordBudgetUsage } from '../utils/dpPrivacy.js';
import { sha3_256 } from '../crypto/pqc.js';

const router = Router();

const quizzes = {
  financial_literacy: {
    title: 'Financial Literacy Assessment',
    questions: [
      { id: 1, question: 'What is compound interest?', options: ['Interest on principal only', 'Interest on principal + accumulated interest', 'A type of fee', 'Bank commission'], correct: 1, explanation: 'Compound interest is calculated on the initial principal and also on the accumulated interest.' },
      { id: 2, question: 'What is an emergency fund?', options: ['Money for investments', '3-6 months of expenses saved', 'Money borrowed from bank', 'Insurance premium'], correct: 1, explanation: 'An emergency fund covers 3-6 months of essential expenses for unexpected situations.' },
      { id: 3, question: 'What does UPI stand for?', options: ['Unified Payments Interface', 'Universal Payment Integration', 'United Process for Income', 'Unified Processing Index'], correct: 0, explanation: 'UPI stands for Unified Payments Interface, developed by NPCI.' },
      { id: 4, question: 'What is KYC?', options: ['Keep Your Cash', 'Know Your Customer', 'Key Yield Certificate', 'Known Yield Calculation'], correct: 1, explanation: 'KYC (Know Your Customer) is a verification process required by banks.' },
      { id: 5, question: 'What is the minimum age to open a bank account?', options: ['10 years', '12 years', '18 years', '21 years'], correct: 1, explanation: 'Minors aged 10-18 can open accounts with guardian supervision.' },
    ],
  },
  digital_safety: {
    title: 'Digital Safety Assessment',
    questions: [
      { id: 1, question: 'Should you share your UPI PIN with family?', options: ['Yes, if they need money', 'Never, not even with bank', 'Only with spouse', 'Yes, for emergencies'], correct: 1, explanation: 'Never share your UPI PIN with anyone, including bank officials.' },
      { id: 2, question: 'What should you do if you receive a suspicious SMS?', options: ['Click the link to check', 'Forward it to friends', 'Delete or report it', 'Reply asking them to stop'], correct: 2, explanation: 'Delete suspicious messages or report them. Never click unknown links.' },
      { id: 3, question: 'Is it safe to scan any QR code?', options: ['Yes, QR codes are always safe', 'Only if someone you know sent it', 'No, only scan QR codes from trusted sources', 'Only at shops'], correct: 2, explanation: 'Only scan QR codes from trusted, verified sources.' },
      { id: 4, question: 'What is two-factor authentication?', options: ['Using two phones', 'Password + OTP/code', 'Two passwords', 'Two bank accounts'], correct: 1, explanation: '2FA requires two different forms of verification.' },
      { id: 5, question: 'What should you do if you suspect fraud?', options: ['Wait and see', 'Block card/account immediately', 'Call friend for advice', 'Visit branch next week'], correct: 1, explanation: 'Immediately block your card/account and report to bank.' },
    ],
  },
};

router.get('/quiz/:type', authenticate, (req, res) => {
  const quiz = quizzes[req.params.type];
  if (!quiz) return res.status(404).json({ error: 'not_found', message: 'Quiz not found' });
  const safeQuestions = quiz.questions.map(({ correct, ...rest }) => rest);
  res.json({ type: req.params.type, title: quiz.title, questions: safeQuestions, totalQuestions: safeQuestions.length });
});

router.post('/quiz/:type/submit', authenticate, async (req, res, next) => {
  try {
    const quiz = quizzes[req.params.type];
    if (!quiz) return res.status(404).json({ error: 'not_found' });
    const { answers } = req.body;
    let correctCount = 0;
    const results = quiz.questions.map((q, i) => {
      const userAnswer = answers?.[q.id] ?? -1;
      const isCorrect = userAnswer === q.correct;
      if (isCorrect) correctCount++;
      return { questionId: q.id, userAnswer, correctAnswer: q.correct, isCorrect, explanation: q.explanation };
    });
    const rawScore = Math.round((correctCount / quiz.questions.length) * 100);

    // FHE: encrypt score for private computation
    const encryptedScore = encrypt(rawScore, 'public-key');
    const fheRecord = createComputationRecord('quiz_score', sha3_256(JSON.stringify(answers)), encryptedScore.ciphertext, null, null);

    // DP: add noise for analytics
    const dpResult = addNoise(rawScore, { epsilon: 0.1, sensitivity: 1 });

    const proof = proveConfidenceScore(rawScore, 0, 100);

    res.json({
      score: rawScore,
      correctCount,
      totalQuestions: quiz.questions.length,
      results,
      fhe: { ciphertextId: fheRecord.id, scheme: 'BFV' },
      dp: { noisyScore: dpResult.noisyValue, epsilon: 0.1, mechanism: 'laplace' },
      zkp: proof,
      passed: rawScore >= 60,
    });
  } catch (err) { next(err); }
});

router.get('/tasks/digital-confidence', authenticate, (req, res) => {
  res.json({
    tasks: [
      { id: 'upi_sim', title: 'UPI Payment Simulation', description: 'Practice sending money via UPI', points: 20, icon: '📱' },
      { id: 'sms_phish', title: 'SMS Phishing Detection', description: 'Identify fake SMS messages', points: 15, icon: '🛡️' },
      { id: 'qr_scam', title: 'QR Code Safety Check', description: 'Spot malicious QR codes', points: 15, icon: '📷' },
      { id: 'budget_plan', title: 'Budget Planning', description: 'Create a monthly budget', points: 15, icon: '📊' },
      { id: 'loan_compare', title: 'Loan Comparison', description: 'Compare loan options wisely', points: 15, icon: '🏦' },
      { id: 'savings_goal', title: 'Set Savings Goal', description: 'Define and track savings', points: 20, icon: '🎯' },
    ],
    totalPossiblePoints: 100,
  });
});

router.post('/tasks/digital-confidence/submit', authenticate, async (req, res, next) => {
  try {
    const { taskId, result } = req.body;
    const score = result?.score || 0;
    const encryptedScore = encrypt(score, 'public-key');
    const proof = proveConfidenceScore(score, 0, 100);
    res.json({ taskId, score, fhe: { scheme: 'BFV' }, zkp: proof, pointsEarned: score });
  } catch (err) { next(err); }
});

export default router;
