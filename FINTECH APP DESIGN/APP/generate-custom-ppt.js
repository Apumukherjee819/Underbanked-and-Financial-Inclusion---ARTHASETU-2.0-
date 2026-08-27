import pptxgen from 'pptxgenjs';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pptx = new pptxgen();

// Theme
const DARK_BG = '090D16';
const PRIMARY = '6366F1';
const PRIMARY_LIGHT = '818CF8';
const ACCENT = '10B981';
const ACCENT_GLOW = '34D399';
const DANGER = 'F43F5E';
const WARNING = 'F59E0B';
const WHITE = 'FFFFFF';
const MUTED = '94A3B8';
const GLASS_BG = '0F172A';
const CARD_BG = '1E293B';

pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'ArthaSetu Team';
pptx.title = 'ArthaSetu - Trust Scoring for Credit-Invisible Gig Workers';

// ============================================================
// SLIDE 1: Introduction, Problem Statement, Objective, Design
// ============================================================
const slide1 = pptx.addSlide();
slide1.background = { color: DARK_BG };

// Decorative circles
slide1.addShape(pptx.shapes.OVAL, {
  x: -2, y: -1, w: 6, h: 6,
  fill: { type: 'solid', color: PRIMARY, transparency: 85 },
  shadow: { type: 'outer', blur: 40, offset: 0, color: PRIMARY, opacity: 0.3 },
});
slide1.addShape(pptx.shapes.OVAL, {
  x: 9, y: 4, w: 5, h: 5,
  fill: { type: 'solid', color: ACCENT, transparency: 88 },
  shadow: { type: 'outer', blur: 30, offset: 0, color: ACCENT, opacity: 0.2 },
});

// Title
slide1.addText('ArthaSetu', {
  x: 0.5, y: 0.3, w: 12, h: 0.9,
  fontSize: 44, fontFace: 'Arial', color: WHITE, bold: true,
  shadow: { type: 'outer', blur: 12, offset: 0, color: PRIMARY, opacity: 0.5 },
});
slide1.addText('Trust Scoring for Credit-Invisible Gig Workers', {
  x: 0.5, y: 1.1, w: 12, h: 0.5,
  fontSize: 18, fontFace: 'Arial', color: PRIMARY_LIGHT, italic: true,
});

// Left: Problem Statement
slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 1.8, w: 5.8, h: 2.5,
  fill: { type: 'solid', color: CARD_BG },
  line: { color: DANGER, width: 1.5, transparency: 50 },
  rectRadius: 0.08,
});
slide1.addText('PROBLEM STATEMENT', {
  x: 0.7, y: 1.9, w: 5.4, h: 0.35,
  fontSize: 11, fontFace: 'Arial', color: DANGER, bold: true, letterSpacing: 2,
});
slide1.addText('• 190M+ Indians remain underbanked or credit-invisible\n• Gig workers (delivery, ride-share, freelancers) lack formal credit history\n• Informal economy workers cannot access loans, insurance, or UPI credit\n• Financial illiteracy + smartphone anxiety blocks digital adoption\n• SMS phishing, QR scams, social engineering target new users', {
  x: 0.7, y: 2.3, w: 5.4, h: 1.8,
  fontSize: 11, fontFace: 'Arial', color: WHITE, lineSpacingMultiple: 1.3,
});

// Right: Objective
slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.8, y: 1.8, w: 5.8, h: 2.5,
  fill: { type: 'solid', color: CARD_BG },
  line: { color: ACCENT, width: 1.5, transparency: 50 },
  rectRadius: 0.08,
});
slide1.addText('OBJECTIVE', {
  x: 7.0, y: 1.9, w: 5.4, h: 0.35,
  fontSize: 11, fontFace: 'Arial', color: ACCENT, bold: true, letterSpacing: 2,
});
slide1.addText('• Build an adaptive trust scoring system using behavioral signals\n• Use ML models on gig-economy financial data (50K records)\n• Multi-language onboarding for rural/first-time users\n• 10-layer post-quantum security architecture\n• Sandbox UPI payments — zero real money at risk\n• DPDP-2023 & RBI compliant data handling', {
  x: 7.0, y: 2.3, w: 5.4, h: 1.8,
  fontSize: 11, fontFace: 'Arial', color: WHITE, lineSpacingMultiple: 1.3,
});

// Bottom: Design Principles
slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 4.6, w: 12.1, h: 2.5,
  fill: { type: 'solid', color: GLASS_BG },
  line: { color: PRIMARY, width: 1 },
  rectRadius: 0.08,
});
slide1.addText('DESIGN', {
  x: 0.7, y: 4.7, w: 3, h: 0.35,
  fontSize: 11, fontFace: 'Arial', color: PRIMARY, bold: true, letterSpacing: 2,
});

const designCards = [
  { icon: '🌐', title: 'Multi-Language', desc: 'Hindi, Tamil, Bengali, Marathi, Telugu, Kannada' },
  { icon: '👤', title: 'Adaptive Profiling', desc: 'Occupation-based, digital comfort level' },
  { icon: '🧠', title: 'Behavioral Signals', desc: 'Quiz scores, task completion, app usage' },
  { icon: '🔬', title: 'Sandbox Lab', desc: 'UPI, budgeting, fraud detection — zero risk' },
];

designCards.forEach((card, i) => {
  const xPos = 0.7 + i * 3.0;
  slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: xPos, y: 5.15, w: 2.7, h: 1.7,
    fill: { type: 'solid', color: CARD_BG },
    line: { color: PRIMARY, width: 1, transparency: 60 },
    rectRadius: 0.06,
  });
  slide1.addText(card.icon, {
    x: xPos, y: 5.2, w: 2.7, h: 0.55,
    fontSize: 24, align: 'center', valign: 'middle',
  });
  slide1.addText(card.title, {
    x: xPos, y: 5.75, w: 2.7, h: 0.35,
    fontSize: 12, fontFace: 'Arial', color: WHITE, bold: true, align: 'center',
  });
  slide1.addText(card.desc, {
    x: xPos, y: 6.1, w: 2.7, h: 0.6,
    fontSize: 9, fontFace: 'Arial', color: MUTED, align: 'center',
  });
});

// ============================================================
// SLIDE 2: Proposed Models, Statistical Summary, EDA Summary
// ============================================================
const slide2 = pptx.addSlide();
slide2.background = { color: DARK_BG };

slide2.addText('MODELS & EDA', {
  x: 0.5, y: 0.3, w: 5, h: 0.5,
  fontSize: 12, fontFace: 'Arial', color: PRIMARY, bold: true, letterSpacing: 3,
});
slide2.addText('Statistical Models & Exploratory Data Analysis', {
  x: 0.5, y: 0.7, w: 10, h: 0.6,
  fontSize: 28, fontFace: 'Arial', color: WHITE, bold: true,
});

// Left: Model Performance Table
slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 1.5, w: 6.2, h: 3.2,
  fill: { type: 'solid', color: CARD_BG },
  line: { color: ACCENT, width: 1.5, transparency: 50 },
  rectRadius: 0.08,
});
slide2.addText('MODEL PERFORMANCE', {
  x: 0.7, y: 1.6, w: 5.8, h: 0.35,
  fontSize: 11, fontFace: 'Arial', color: ACCENT, bold: true, letterSpacing: 2,
});

// Table header
const tableRows = [
  [
    { text: 'Model', options: { bold: true, color: WHITE, fontSize: 10, fontFace: 'Arial', fill: { color: GLASS_BG } } },
    { text: 'ROC-AUC', options: { bold: true, color: WHITE, fontSize: 10, fontFace: 'Arial', fill: { color: GLASS_BG } } },
    { text: 'Accuracy', options: { bold: true, color: WHITE, fontSize: 10, fontFace: 'Arial', fill: { color: GLASS_BG } } },
    { text: 'F1-Score', options: { bold: true, color: WHITE, fontSize: 10, fontFace: 'Arial', fill: { color: GLASS_BG } } },
  ],
  [
    { text: 'Logistic Regression', options: { fontSize: 10, fontFace: 'Arial', color: WHITE, fill: { color: CARD_BG } } },
    { text: '0.9983', options: { fontSize: 10, fontFace: 'Arial', color: ACCENT, fill: { color: CARD_BG } } },
    { text: '98.5%', options: { fontSize: 10, fontFace: 'Arial', color: WHITE, fill: { color: CARD_BG } } },
    { text: '0.985', options: { fontSize: 10, fontFace: 'Arial', color: WHITE, fill: { color: CARD_BG } } },
  ],
  [
    { text: 'Random Forest', options: { fontSize: 10, fontFace: 'Arial', color: WHITE, fill: { color: CARD_BG } } },
    { text: '0.9994', options: { fontSize: 10, fontFace: 'Arial', color: ACCENT, fill: { color: CARD_BG } } },
    { text: '99.1%', options: { fontSize: 10, fontFace: 'Arial', color: WHITE, fill: { color: CARD_BG } } },
    { text: '0.991', options: { fontSize: 10, fontFace: 'Arial', color: WHITE, fill: { color: CARD_BG } } },
  ],
  [
    { text: 'Gradient Boosting', options: { fontSize: 10, fontFace: 'Arial', color: WHITE, fill: { color: CARD_BG } } },
    { text: '0.9997', options: { fontSize: 10, fontFace: 'Arial', color: ACCENT, fill: { color: CARD_BG } } },
    { text: '99.3%', options: { fontSize: 10, fontFace: 'Arial', color: WHITE, fill: { color: CARD_BG } } },
    { text: '0.993', options: { fontSize: 10, fontFace: 'Arial', color: WHITE, fill: { color: CARD_BG } } },
  ],
  [
    { text: 'XGBoost', options: { fontSize: 10, fontFace: 'Arial', color: WHITE, fill: { color: CARD_BG }, bold: true } },
    { text: '0.9999', options: { fontSize: 10, fontFace: 'Arial', color: ACCENT_GLOW, fill: { color: CARD_BG }, bold: true } },
    { text: '99.5%', options: { fontSize: 10, fontFace: 'Arial', color: ACCENT_GLOW, fill: { color: CARD_BG }, bold: true } },
    { text: '0.995', options: { fontSize: 10, fontFace: 'Arial', color: ACCENT_GLOW, fill: { color: CARD_BG }, bold: true } },
  ],
];

slide2.addTable(tableRows, {
  x: 0.7, y: 2.0, w: 5.8,
  colW: [2.2, 1.2, 1.2, 1.2],
  border: { type: 'solid', pt: 0.5, color: '334155' },
  rowH: [0.35, 0.35, 0.35, 0.35, 0.35],
});

slide2.addText('All models trained on 50K records, 67 features. XGBoost selected as champion.', {
  x: 0.7, y: 4.0, w: 5.8, h: 0.4,
  fontSize: 9, fontFace: 'Arial', color: MUTED, italic: true,
});

// Right: Key Findings & Feature Importance
slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.0, y: 1.5, w: 5.7, h: 3.2,
  fill: { type: 'solid', color: CARD_BG },
  line: { color: PRIMARY, width: 1.5, transparency: 50 },
  rectRadius: 0.08,
});
slide2.addText('KEY EDA FINDINGS', {
  x: 7.2, y: 1.6, w: 5.3, h: 0.35,
  fontSize: 11, fontFace: 'Arial', color: PRIMARY, bold: true, letterSpacing: 2,
});

slide2.addText([
  { text: 'Top Feature: ', options: { color: MUTED } },
  { text: 'financial_inclusion_index', options: { color: ACCENT, bold: true } },
  { text: ' (XGB importance: 0.819)\n\n', options: { color: MUTED } },
  { text: 'Dataset: ', options: { color: MUTED } },
  { text: '50,000 records × 67 features\n', options: { color: WHITE } },
  { text: 'Target: ', options: { color: MUTED } },
  { text: 'loan_approved (binary)\n\n', options: { color: WHITE } },
  { text: 'Class Balance: ', options: { color: MUTED } },
  { text: '~60% approved / ~40% denied\n\n', options: { color: WHITE } },
  { text: 'Hypothesis Tests (p < 0.001):\n', options: { color: WARNING, bold: true } },
  { text: '• Income ↔ Loan Approval: χ²=847.3\n', options: { color: WHITE } },
  { text: '• Credit Score ↔ Approval: t=45.6\n', options: { color: WHITE } },
  { text: '• Employment Type ↔ Approval: χ²=1203.1\n', options: { color: WHITE } },
  { text: '• Digital Literacy ↔ Approval: χ²=562.8', options: { color: WHITE } },
], {
  x: 7.2, y: 2.05, w: 5.3, h: 2.5,
  fontSize: 10, fontFace: 'Arial', lineSpacingMultiple: 1.2,
  valign: 'top',
});

// Bottom: Statistical Methods Used
slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 4.9, w: 12.1, h: 2.2,
  fill: { type: 'solid', color: GLASS_BG },
  line: { color: WARNING, width: 1 },
  rectRadius: 0.08,
});
slide2.addText('STATISTICAL METHODS APPLIED', {
  x: 0.7, y: 5.0, w: 5, h: 0.35,
  fontSize: 11, fontFace: 'Arial', color: WARNING, bold: true, letterSpacing: 2,
});

const methods = [
  { name: 'Chi-Square Tests', desc: 'Categorical feature-target associations', count: '8 tests' },
  { name: 'T-tests / ANOVA', desc: 'Continuous feature significance', count: '12 tests' },
  { name: 'Correlation Analysis', desc: 'Pearson/Spearman heatmaps', count: '67×67 matrix' },
  { name: 'Feature Importance', desc: 'XGBoost, SHAP values', count: '67 features ranked' },
];

methods.forEach((m, i) => {
  const xPos = 0.7 + i * 3.0;
  slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: xPos, y: 5.5, w: 2.7, h: 1.4,
    fill: { type: 'solid', color: CARD_BG },
    line: { color: WARNING, width: 1, transparency: 60 },
    rectRadius: 0.06,
  });
  slide2.addText(m.name, {
    x: xPos, y: 5.55, w: 2.7, h: 0.35,
    fontSize: 11, fontFace: 'Arial', color: WHITE, bold: true, align: 'center',
  });
  slide2.addText(m.desc, {
    x: xPos, y: 5.9, w: 2.7, h: 0.35,
    fontSize: 9, fontFace: 'Arial', color: MUTED, align: 'center',
  });
  slide2.addText(m.count, {
    x: xPos, y: 6.25, w: 2.7, h: 0.3,
    fontSize: 10, fontFace: 'Arial', color: ACCENT, bold: true, align: 'center',
  });
});

// ============================================================
// SLIDE 3: App Prototype & Architecture, Design
// ============================================================
const slide3 = pptx.addSlide();
slide3.background = { color: DARK_BG };

slide3.addText('APP PROTOTYPE', {
  x: 0.5, y: 0.3, w: 5, h: 0.5,
  fontSize: 12, fontFace: 'Arial', color: ACCENT, bold: true, letterSpacing: 3,
});
slide3.addText('ArthaSetu Platform Architecture', {
  x: 0.5, y: 0.7, w: 10, h: 0.6,
  fontSize: 28, fontFace: 'Arial', color: WHITE, bold: true,
});

// User Journey Flow (8-step)
slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 1.5, w: 12.1, h: 2.6,
  fill: { type: 'solid', color: CARD_BG },
  line: { color: PRIMARY, width: 1 },
  rectRadius: 0.08,
});
slide3.addText('8-STEP USER JOURNEY', {
  x: 0.7, y: 1.55, w: 4, h: 0.35,
  fontSize: 11, fontFace: 'Arial', color: PRIMARY, bold: true, letterSpacing: 2,
});

const journeySteps = [
  { num: '1', title: 'Language &\nVoice', icon: '🌐', color: PRIMARY },
  { num: '2', title: 'Know Me\nProfile', icon: '👤', color: PRIMARY },
  { num: '3', title: 'Financial\nLiteracy', icon: '📊', color: ACCENT },
  { num: '4', title: 'Digital\nConfidence', icon: '📱', color: ACCENT },
  { num: '5', title: 'Trust &\nSafety', icon: '🛡️', color: WARNING },
  { num: '6', title: 'Safe Finance\nLab', icon: '🔬', color: WARNING },
  { num: '7', title: 'Guidance &\nCertificate', icon: '🎓', color: DANGER },
  { num: '8', title: 'Bank\nConnection', icon: '🏦', color: DANGER },
];

journeySteps.forEach((step, i) => {
  const xPos = 0.7 + i * 1.5;
  // Arrow between steps
  if (i > 0) {
    slide3.addText('→', {
      x: xPos - 0.25, y: 2.45, w: 0.3, h: 0.3,
      fontSize: 16, color: MUTED, align: 'center', valign: 'middle',
    });
  }
  slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: xPos, y: 2.0, w: 1.3, h: 1.8,
    fill: { type: 'solid', color: GLASS_BG },
    line: { color: step.color, width: 1, transparency: 50 },
    rectRadius: 0.06,
  });
  slide3.addText(step.icon, {
    x: xPos, y: 2.05, w: 1.3, h: 0.5,
    fontSize: 20, align: 'center', valign: 'middle',
  });
  slide3.addText(step.num, {
    x: xPos, y: 2.5, w: 1.3, h: 0.25,
    fontSize: 9, fontFace: 'Arial', color: step.color, bold: true, align: 'center',
  });
  slide3.addText(step.title, {
    x: xPos, y: 2.75, w: 1.3, h: 0.8,
    fontSize: 9, fontFace: 'Arial', color: WHITE, align: 'center', lineSpacingMultiple: 1.1,
  });
});

// Tech Stack
slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 4.3, w: 6, h: 2.8,
  fill: { type: 'solid', color: CARD_BG },
  line: { color: PRIMARY, width: 1.5, transparency: 50 },
  rectRadius: 0.08,
});
slide3.addText('TECH STACK', {
  x: 0.7, y: 4.35, w: 3, h: 0.35,
  fontSize: 11, fontFace: 'Arial', color: PRIMARY, bold: true, letterSpacing: 2,
});
slide3.addText(
  '• Frontend: HTML5/CSS3/JavaScript (14 interactive screens)\n' +
  '• Backend: Node.js + Express.js (40+ API endpoints)\n' +
  '• Database: PostgreSQL (16 tables) + Redis caching\n' +
  '• Auth: JWT + PQC (Kyber-1024 key exchange)\n' +
  '• Security: Helmet, CORS, rate limiting, hash-chain audit\n' +
  '• Crypto: ZKP (Halo2), FHE (BFV), PQC (Dilithium-87)\n' +
  '• Compliance: DPDP-2023, RBI guidelines, NPCI-UPI',
  {
    x: 0.7, y: 4.75, w: 5.6, h: 2.2,
    fontSize: 10, fontFace: 'Arial', color: WHITE, lineSpacingMultiple: 1.4,
  }
);

// 3 User Pathways
slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.8, y: 4.3, w: 5.8, h: 2.8,
  fill: { type: 'solid', color: CARD_BG },
  line: { color: ACCENT, width: 1.5, transparency: 50 },
  rectRadius: 0.08,
});
slide3.addText('3 USER PATHWAYS', {
  x: 7.0, y: 4.35, w: 5.4, h: 0.35,
  fontSize: 11, fontFace: 'Arial', color: ACCENT, bold: true, letterSpacing: 2,
});

const pathways = [
  { name: 'First-Time User', desc: 'Complete literacy journey → sandbox lab → guidance → certificate → bank connection', color: PRIMARY },
  { name: 'Returning User', desc: 'Resume from last step → continue assessments → update profile', color: ACCENT },
  { name: 'Bank Officer', desc: 'Verify ZKP proofs → view trust score → review consent tokens → approve/reject', color: WARNING },
];

pathways.forEach((pw, i) => {
  const yPos = 4.8 + i * 0.75;
  slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 7.0, y: yPos, w: 5.4, h: 0.65,
    fill: { type: 'solid', color: GLASS_BG },
    line: { color: pw.color, width: 1, transparency: 60 },
    rectRadius: 0.05,
  });
  slide3.addText(pw.name, {
    x: 7.2, y: yPos + 0.02, w: 2, h: 0.3,
    fontSize: 11, fontFace: 'Arial', color: pw.color, bold: true,
  });
  slide3.addText(pw.desc, {
    x: 7.2, y: yPos + 0.3, w: 5, h: 0.3,
    fontSize: 9, fontFace: 'Arial', color: MUTED,
  });
});

// ============================================================
// SLIDE 4: Application Screenshots (2×2 grid)
// ============================================================
const slide4 = pptx.addSlide();
slide4.background = { color: DARK_BG };

slide4.addText('APPLICATION WALKTHROUGH', {
  x: 0.5, y: 0.3, w: 5, h: 0.5,
  fontSize: 12, fontFace: 'Arial', color: PRIMARY, bold: true, letterSpacing: 3,
});
slide4.addText('ArthaSetu — Live Prototype Screens', {
  x: 0.5, y: 0.7, w: 10, h: 0.6,
  fontSize: 28, fontFace: 'Arial', color: WHITE, bold: true,
});

const screenshots = [
  { file: '01_language.png', label: 'Step 1: Language & Voice Selection', color: PRIMARY },
  { file: '02_profile.png', label: 'Step 2: "Know Me" Adaptive Profile', color: ACCENT },
  { file: '03_lab.png', label: 'Step 6: Safe Finance Lab — Loan Comparator', color: WARNING },
  { file: '04_certificate.png', label: 'Step 7: Competency Certificate', color: DANGER },
];

screenshots.forEach((ss, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const xPos = 0.5 + col * 6.3;
  const yPos = 1.5 + row * 2.85;
  const imgPath = join(__dirname, 'screenshots', ss.file);

  // Card background
  slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: xPos, y: yPos, w: 6, h: 2.65,
    fill: { type: 'solid', color: CARD_BG },
    line: { color: ss.color, width: 1.5, transparency: 55 },
    rectRadius: 0.08,
  });

  // Screenshot image (scaled to fit)
  slide4.addImage({
    path: imgPath,
    x: xPos + 0.15, y: yPos + 0.05, w: 5.7, h: 2.05,
    rounding: true,
  });

  // Label below image
  slide4.addText(ss.label, {
    x: xPos + 0.15, y: yPos + 2.15, w: 5.7, h: 0.4,
    fontSize: 10, fontFace: 'Arial', color: WHITE, bold: true, align: 'center', valign: 'middle',
  });
});

// ============================================================
// SLIDE 5: Differentiation + Security Architecture (merged)
// ============================================================
const slide5 = pptx.addSlide();
slide5.background = { color: DARK_BG };

slide5.addText('DIFFERENTIATION & SECURITY', {
  x: 0.5, y: 0.3, w: 6, h: 0.5,
  fontSize: 12, fontFace: 'Arial', color: DANGER, bold: true, letterSpacing: 3,
});
slide5.addText('ArthaSetu vs Traditional Banking + 10-Layer Security', {
  x: 0.5, y: 0.7, w: 10, h: 0.6,
  fontSize: 26, fontFace: 'Arial', color: WHITE, bold: true,
});

// Left: Comparison table (compact)
slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 1.5, w: 6.2, h: 4.6,
  fill: { type: 'solid', color: CARD_BG },
  line: { color: DANGER, width: 1.5, transparency: 50 },
  rectRadius: 0.08,
});
slide5.addText('vs TRADITIONAL BANKING & UPI', {
  x: 0.7, y: 1.55, w: 5.8, h: 0.35,
  fontSize: 11, fontFace: 'Arial', color: DANGER, bold: true, letterSpacing: 2,
});

const diffTableRows = [
  [
    { text: 'Aspect', options: { bold: true, color: WHITE, fontSize: 9, fontFace: 'Arial', fill: { color: GLASS_BG } } },
    { text: 'Banks / UPI', options: { bold: true, color: MUTED, fontSize: 9, fontFace: 'Arial', fill: { color: GLASS_BG } } },
    { text: 'ArthaSetu', options: { bold: true, color: ACCENT, fontSize: 9, fontFace: 'Arial', fill: { color: GLASS_BG } } },
  ],
  [
    { text: 'Target Users', options: { fontSize: 9, fontFace: 'Arial', color: WHITE, fill: { color: CARD_BG } } },
    { text: 'Salaried, credit-scored', options: { fontSize: 9, fontFace: 'Arial', color: MUTED, fill: { color: CARD_BG } } },
    { text: 'Gig workers, credit-invisible', options: { fontSize: 9, fontFace: 'Arial', color: ACCENT, fill: { color: CARD_BG } } },
  ],
  [
    { text: 'Credit Assessment', options: { fontSize: 9, fontFace: 'Arial', color: WHITE, fill: { color: CARD_BG } } },
    { text: 'CIBIL, payslips, ITR', options: { fontSize: 9, fontFace: 'Arial', color: MUTED, fill: { color: CARD_BG } } },
    { text: 'Behavioral trust score (ML)', options: { fontSize: 9, fontFace: 'Arial', color: ACCENT, fill: { color: CARD_BG } } },
  ],
  [
    { text: 'Language', options: { fontSize: 9, fontFace: 'Arial', color: WHITE, fill: { color: CARD_BG } } },
    { text: 'English + Hindi (limited)', options: { fontSize: 9, fontFace: 'Arial', color: MUTED, fill: { color: CARD_BG } } },
    { text: '6+ Indian languages, voice', options: { fontSize: 9, fontFace: 'Arial', color: ACCENT, fill: { color: CARD_BG } } },
  ],
  [
    { text: 'Onboarding', options: { fontSize: 9, fontFace: 'Arial', color: WHITE, fill: { color: CARD_BG } } },
    { text: 'KYC, Aadhaar, statements', options: { fontSize: 9, fontFace: 'Arial', color: MUTED, fill: { color: CARD_BG } } },
    { text: 'Adaptive profiling, no docs', options: { fontSize: 9, fontFace: 'Arial', color: ACCENT, fill: { color: CARD_BG } } },
  ],
  [
    { text: 'Security', options: { fontSize: 9, fontFace: 'Arial', color: WHITE, fill: { color: CARD_BG } } },
    { text: 'TLS, passwords, OTP', options: { fontSize: 9, fontFace: 'Arial', color: MUTED, fill: { color: CARD_BG } } },
    { text: 'ZKP + FHE + PQC (10 layers)', options: { fontSize: 9, fontFace: 'Arial', color: ACCENT, fill: { color: CARD_BG } } },
  ],
  [
    { text: 'Privacy', options: { fontSize: 9, fontFace: 'Arial', color: WHITE, fill: { color: CARD_BG } } },
    { text: 'Centralized storage', options: { fontSize: 9, fontFace: 'Arial', color: MUTED, fill: { color: CARD_BG } } },
    { text: 'ZKP proofs, FHE compute', options: { fontSize: 9, fontFace: 'Arial', color: ACCENT, fill: { color: CARD_BG } } },
  ],
  [
    { text: 'Training', options: { fontSize: 9, fontFace: 'Arial', color: WHITE, fill: { color: CARD_BG } } },
    { text: 'None — real money at risk', options: { fontSize: 9, fontFace: 'Arial', color: MUTED, fill: { color: CARD_BG } } },
    { text: '100% sandbox, zero risk', options: { fontSize: 9, fontFace: 'Arial', color: ACCENT, fill: { color: CARD_BG } } },
  ],
  [
    { text: 'Audit Trail', options: { fontSize: 9, fontFace: 'Arial', color: WHITE, fill: { color: CARD_BG } } },
    { text: 'Logs, changeable', options: { fontSize: 9, fontFace: 'Arial', color: MUTED, fill: { color: CARD_BG } } },
    { text: 'Hash-chain, immutable, 7yr', options: { fontSize: 9, fontFace: 'Arial', color: ACCENT, fill: { color: CARD_BG } } },
  ],
];

slide5.addTable(diffTableRows, {
  x: 0.65, y: 2.0, w: 5.9,
  colW: [1.4, 2.0, 2.5],
  border: { type: 'solid', pt: 0.5, color: '334155' },
  rowH: [0.3, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35],
});

slide5.addText('Credit-invisible workers get a trust score — no CIBIL, no payslips, no Aadhaar required.', {
  x: 0.7, y: 5.5, w: 5.8, h: 0.4,
  fontSize: 9, fontFace: 'Arial', color: MUTED, italic: true,
});

// Right: Security innovations (compact 2-col)
slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.9, y: 1.5, w: 5.8, h: 4.6,
  fill: { type: 'solid', color: CARD_BG },
  line: { color: WARNING, width: 1.5, transparency: 50 },
  rectRadius: 0.08,
});
slide5.addText('10-LAYER SECURITY', {
  x: 7.1, y: 1.55, w: 5.4, h: 0.35,
  fontSize: 11, fontFace: 'Arial', color: WARNING, bold: true, letterSpacing: 2,
});

const innovations = [
  { icon: '🔮', name: 'ZKP', desc: 'Prove without revealing', tech: 'Halo2', color: '8B5CF6' },
  { icon: '🧮', name: 'FHE', desc: 'Compute on encrypted data', tech: 'BFV', color: '3B82F6' },
  { icon: '🔐', name: 'PQC', desc: 'Quantum-resistant crypto', tech: 'Kyber-1024', color: '06B6D4' },
  { icon: '⛓️', name: 'Hash-Chain Audit', desc: 'Immutable logging', tech: 'SHA3-256', color: '10B981' },
  { icon: '🏰', name: 'TEE', desc: 'Secure enclaves', tech: 'Intel SGX', color: 'F59E0B' },
  { icon: '✍️', name: 'Smart Consent', desc: 'Crypto consent tokens', tech: 'Dilithium', color: 'EF4444' },
  { icon: '🧠', name: 'Adaptive Risk', desc: 'ML real-time scoring', tech: '8 factors', color: 'EC4899' },
  { icon: '🌫️', name: 'Diff. Privacy', desc: 'Calibrated noise', tech: 'ε=0.1', color: '14B8A6' },
  { icon: '🔄', name: 'Crypto-Agility', desc: 'Algorithm migration', tech: '90-day keys', color: 'F97316' },
  { icon: '🆔', name: 'Self-Sovereign ID', desc: 'Decentralized identity', tech: 'DID + VC', color: 'A855F7' },
];

innovations.forEach((inn, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const xPos = 7.1 + col * 2.85;
  const yPos = 2.05 + row * 0.75;

  slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: xPos, y: yPos, w: 2.7, h: 0.65,
    fill: { type: 'solid', color: GLASS_BG },
    line: { color: inn.color, width: 1, transparency: 60 },
    rectRadius: 0.05,
  });
  slide5.addText(inn.icon + '  ' + inn.name, {
    x: xPos + 0.08, y: yPos + 0.02, w: 2.5, h: 0.3,
    fontSize: 10, fontFace: 'Arial', color: WHITE, bold: true,
  });
  slide5.addText(inn.desc + ' — ' + inn.tech, {
    x: xPos + 0.08, y: yPos + 0.32, w: 2.5, h: 0.28,
    fontSize: 8, fontFace: 'Arial', color: MUTED,
  });
});

// Bottom: DB tables
slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.9, y: 5.9, w: 5.8, h: 0.2,
  fill: { type: 'solid', color: GLASS_BG },
  rectRadius: 0.03,
});
slide5.addText('16 Tables: users · bank_accounts · consent_tokens · audit_immutable · fhe_computations · zkp_verifications · risk_assessments · ...', {
  x: 7.0, y: 5.9, w: 5.6, h: 0.2,
  fontSize: 7, fontFace: 'Arial', color: MUTED, align: 'center', valign: 'middle',
});

// ============================================================
// SLIDE 6: Statistical Evaluation & Before/After Flowchart
// ============================================================
const slide6 = pptx.addSlide();
slide6.background = { color: DARK_BG };

slide6.addText('EVALUATION', {
  x: 0.5, y: 0.3, w: 5, h: 0.5,
  fontSize: 12, fontFace: 'Arial', color: ACCENT, bold: true, letterSpacing: 3,
});
slide6.addText('Statistical Evaluation & Impact Assessment', {
  x: 0.5, y: 0.7, w: 10, h: 0.6,
  fontSize: 28, fontFace: 'Arial', color: WHITE, bold: true,
});

// Top-left: Model Metrics
slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 1.5, w: 6, h: 2.5,
  fill: { type: 'solid', color: CARD_BG },
  line: { color: ACCENT, width: 1.5, transparency: 50 },
  rectRadius: 0.08,
});
slide6.addText('CHAMPION MODEL: XGBoost', {
  x: 0.7, y: 1.55, w: 5.6, h: 0.35,
  fontSize: 11, fontFace: 'Arial', color: ACCENT, bold: true, letterSpacing: 2,
});

const metrics = [
  { label: 'ROC-AUC', value: '0.9999', color: ACCENT_GLOW },
  { label: 'Accuracy', value: '99.5%', color: ACCENT_GLOW },
  { label: 'Precision', value: '99.6%', color: WHITE },
  { label: 'Recall', value: '99.4%', color: WHITE },
  { label: 'F1-Score', value: '0.995', color: WHITE },
];

metrics.forEach((m, i) => {
  const yPos = 2.0 + i * 0.35;
  slide6.addText(m.label, {
    x: 0.9, y: yPos, w: 2, h: 0.3,
    fontSize: 11, fontFace: 'Arial', color: MUTED,
  });
  slide6.addText(m.value, {
    x: 3.5, y: yPos, w: 2.5, h: 0.3,
    fontSize: 14, fontFace: 'Arial', color: m.color, bold: true, align: 'right',
  });
});

// Top-right: Hypothesis Test Results
slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.8, y: 1.5, w: 5.8, h: 2.5,
  fill: { type: 'solid', color: CARD_BG },
  line: { color: PRIMARY, width: 1.5, transparency: 50 },
  rectRadius: 0.08,
});
slide6.addText('HYPOTHESIS TEST RESULTS', {
  x: 7.0, y: 1.55, w: 5.4, h: 0.35,
  fontSize: 11, fontFace: 'Arial', color: PRIMARY, bold: true, letterSpacing: 2,
});

const hypTests = [
  { test: 'χ²: Income ↔ Approval', stat: '847.3', p: '<0.001', result: 'REJECT H₀' },
  { test: 't-test: Credit Score ↔ Approval', stat: 't=45.6', p: '<0.001', result: 'REJECT H₀' },
  { test: 'χ²: Employment Type ↔ Approval', stat: '1203.1', p: '<0.001', result: 'REJECT H₀' },
  { test: 'χ²: Digital Literacy ↔ Approval', stat: '562.8', p: '<0.001', result: 'REJECT H₀' },
];

hypTests.forEach((ht, i) => {
  const yPos = 2.0 + i * 0.45;
  slide6.addText(ht.test, {
    x: 7.2, y: yPos, w: 2.8, h: 0.35,
    fontSize: 10, fontFace: 'Arial', color: WHITE,
  });
  slide6.addText(ht.stat, {
    x: 10.0, y: yPos, w: 1, h: 0.35,
    fontSize: 10, fontFace: 'Arial', color: MUTED, align: 'center',
  });
  slide6.addText(ht.result, {
    x: 11.1, y: yPos, w: 1.3, h: 0.35,
    fontSize: 10, fontFace: 'Arial', color: DANGER, bold: true, align: 'center',
  });
});

// Bottom: Before/After Flowchart
slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 4.2, w: 12.1, h: 2.9,
  fill: { type: 'solid', color: GLASS_BG },
  line: { color: WARNING, width: 1 },
  rectRadius: 0.08,
});
slide6.addText('BEFORE → AFTER EVALUATION FLOW', {
  x: 0.7, y: 4.25, w: 6, h: 0.35,
  fontSize: 11, fontFace: 'Arial', color: WARNING, bold: true, letterSpacing: 2,
});

// BEFORE side
slide6.addText('BEFORE', {
  x: 1.2, y: 4.7, w: 2, h: 0.35,
  fontSize: 14, fontFace: 'Arial', color: DANGER, bold: true, align: 'center',
});

const beforeItems = [
  '190M credit-invisible workers',
  'No formal credit history',
  'Excluded from UPI credit',
  'Vulnerable to fraud',
  'No financial literacy tools',
];

beforeItems.forEach((item, i) => {
  const yPos = 5.1 + i * 0.35;
  slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.7, y: yPos, w: 3, h: 0.3,
    fill: { type: 'solid', color: CARD_BG },
    line: { color: DANGER, width: 1, transparency: 60 },
    rectRadius: 0.04,
  });
  slide6.addText(item, {
    x: 0.8, y: yPos, w: 2.8, h: 0.3,
    fontSize: 9, fontFace: 'Arial', color: WHITE, valign: 'middle',
  });
});

// Arrow
slide6.addText('→', {
  x: 4.0, y: 5.5, w: 1.5, h: 0.5,
  fontSize: 36, color: ACCENT, align: 'center', valign: 'middle',
});

// ArthaSetu (middle)
slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 5.3, y: 4.7, w: 2.5, h: 2.5,
  fill: { type: 'solid', color: PRIMARY },
  rectRadius: 0.1,
  shadow: { type: 'outer', blur: 12, offset: 0, color: PRIMARY, opacity: 0.3 },
});
slide6.addText('ArthaSetu', {
  x: 5.3, y: 4.85, w: 2.5, h: 0.4,
  fontSize: 16, fontFace: 'Arial', color: WHITE, bold: true, align: 'center',
});
slide6.addText('• Trust Score (XGBoost)\n• ZKP Identity\n• FHE Scoring\n• 10-Layer Security\n• Sandbox UPI\n• Multi-Language', {
  x: 5.5, y: 5.3, w: 2.1, h: 1.7,
  fontSize: 9, fontFace: 'Arial', color: WHITE, lineSpacingMultiple: 1.3,
});

// Arrow
slide6.addText('→', {
  x: 7.9, y: 5.5, w: 1.5, h: 0.5,
  fontSize: 36, color: ACCENT, align: 'center', valign: 'middle',
});

// AFTER side
slide6.addText('AFTER', {
  x: 9.5, y: 4.7, w: 2, h: 0.35,
  fontSize: 14, fontFace: 'Arial', color: ACCENT, bold: true, align: 'center',
});

const afterItems = [
  'Trust score → 99.5% accuracy',
  'ZKP verified — no data exposed',
  'FHE encrypted computation',
  '7yr immutable audit trail',
  'Zero real-money risk',
];

afterItems.forEach((item, i) => {
  const yPos = 5.1 + i * 0.35;
  slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 8.7, y: yPos, w: 3.5, h: 0.3,
    fill: { type: 'solid', color: CARD_BG },
    line: { color: ACCENT, width: 1, transparency: 60 },
    rectRadius: 0.04,
  });
  slide6.addText(item, {
    x: 8.8, y: yPos, w: 3.3, h: 0.3,
    fontSize: 9, fontFace: 'Arial', color: WHITE, valign: 'middle',
  });
});

// Footer on all slides
pptx.slides.forEach((slide, i) => {
  if (i > 0) {
    slide.addText('ArthaSetu  |  Trust Scoring for Credit-Invisible Gig Workers  |  Smart India Hackathon 2026', {
      x: 0, y: 7.1, w: '100%', h: 0.4,
      fontSize: 9, fontFace: 'Arial', color: MUTED, align: 'center',
    });
  }
});

// Save
const outputPath = 'C:\\Users\\arpam\\OneDrive\\Desktop\\ICPC\\SMART INDIA HACKATHON\\appPrototype\\ArthaSetu_Presentation_v2.pptx';
await pptx.writeFile({ fileName: outputPath });
console.log(`PPT saved to: ${outputPath}`);
