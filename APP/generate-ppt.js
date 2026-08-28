/**
 * ArthaSetu Presentation Generator
 * Creates a 6-slide advanced PPT with animations
 */

import pptxgen from 'pptxgenjs';

const pptx = new pptxgen();

// Theme colors
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

// Presentation settings
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'ArthaSetu Team';
pptx.title = 'ArthaSetu - Adaptive Financial Inclusion Platform';
pptx.subject = 'Smart India Hackathon 2026';

// ============================================================
// SLIDE 1: Title Slide
// ============================================================
const slide1 = pptx.addSlide();
slide1.background = { color: DARK_BG };

// Animated gradient overlay
slide1.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: '100%', h: '100%',
  fill: { type: 'solid', color: DARK_BG },
});

// Decorative circles (background elements)
slide1.addShape(pptx.shapes.OVAL, {
  x: -2, y: -1, w: 6, h: 6,
  fill: { type: 'solid', color: PRIMARY, transparency: 85 },
  shadow: { type: 'outer', blur: 40, offset: 0, color: PRIMARY, opacity: 0.3 },
  animate: { type: 'fade', delay: 0.2 },
});

slide1.addShape(pptx.shapes.OVAL, {
  x: 8, y: 3, w: 5, h: 5,
  fill: { type: 'solid', color: ACCENT, transparency: 88 },
  shadow: { type: 'outer', blur: 30, offset: 0, color: ACCENT, opacity: 0.2 },
  animate: { type: 'fade', delay: 0.4 },
});

// Coin icon
slide1.addShape(pptx.shapes.OVAL, {
  x: 5.8, y: 0.8, w: 1.5, h: 1.5,
  fill: { type: 'solid', color: WARNING },
  shadow: { type: 'outer', blur: 20, offset: 0, color: WARNING, opacity: 0.4 },
  animate: { type: 'fly', delay: 0.3 },
});
slide1.addText('🪙', {
  x: 5.8, y: 0.8, w: 1.5, h: 1.5,
  fontSize: 36, align: 'center', valign: 'middle',
  animate: { type: 'fly', delay: 0.3 },
});

// Main title
slide1.addText('ArthaSetu', {
  x: 1, y: 2.5, w: 11, h: 1.2,
  fontSize: 54, fontFace: 'Arial', color: WHITE, bold: true,
  align: 'center',
  shadow: { type: 'outer', blur: 12, offset: 0, color: PRIMARY, opacity: 0.5 },
  animate: { type: 'fly', delay: 0.1 },
});

// Gradient accent line
slide1.addShape(pptx.shapes.RECTANGLE, {
  x: 4, y: 3.7, w: 5, h: 0.06,
  fill: { type: 'solid', color: PRIMARY },
  shadow: { type: 'outer', blur: 8, offset: 0, color: PRIMARY, opacity: 0.6 },
  animate: { type: 'appear', delay: 0.5 },
});

// Tagline
slide1.addText('Adaptive Financial Inclusion Platform', {
  x: 1, y: 3.9, w: 11, h: 0.6,
  fontSize: 22, fontFace: 'Arial', color: PRIMARY_LIGHT,
  align: 'center', italic: true,
  animate: { type: 'fade', delay: 0.6 },
});

// Subtitle
slide1.addText('Smart India Hackathon 2026  |  10 Next-Gen Security Innovations', {
  x: 1, y: 4.6, w: 11, h: 0.5,
  fontSize: 14, fontFace: 'Arial', color: MUTED,
  align: 'center',
  animate: { type: 'fade', delay: 0.8 },
});

// Stats bar at bottom
const statsBar = [
  { label: 'Languages', value: '6+' },
  { label: 'Security Layers', value: '10' },
  { label: 'Screens', value: '14' },
  { label: 'API Endpoints', value: '40+' },
];
statsBar.forEach((stat, i) => {
  const xPos = 1.5 + i * 2.8;
  slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: xPos, y: 5.6, w: 2.2, h: 1,
    fill: { type: 'solid', color: GLASS_BG },
    line: { color: PRIMARY, width: 1, transparency: 60 },
    rectRadius: 0.1,
    shadow: { type: 'outer', blur: 10, offset: 0, color: '000000', opacity: 0.3 },
    animate: { type: 'fly', delay: 1.0 + i * 0.15 },
  });
  slide1.addText(stat.value, {
    x: xPos, y: 5.55, w: 2.2, h: 0.55,
    fontSize: 24, fontFace: 'Arial', color: ACCENT, bold: true,
    align: 'center', valign: 'bottom',
    animate: { type: 'fade', delay: 1.0 + i * 0.15 },
  });
  slide1.addText(stat.label, {
    x: xPos, y: 6.1, w: 2.2, h: 0.4,
    fontSize: 11, fontFace: 'Arial', color: MUTED,
    align: 'center', valign: 'top',
    animate: { type: 'fade', delay: 1.1 + i * 0.15 },
  });
});

// ============================================================
// SLIDE 2: Objective & Problem
// ============================================================
const slide2 = pptx.addSlide();
slide2.background = { color: DARK_BG };

// Section header
slide2.addText('THE PROBLEM', {
  x: 0.5, y: 0.3, w: 4, h: 0.5,
  fontSize: 12, fontFace: 'Arial', color: DANGER, bold: true,
  letterSpacing: 3,
  animate: { type: 'fly', delay: 0.1 },
});

slide2.addText('Why ArthaSetu Exists', {
  x: 0.5, y: 0.7, w: 8, h: 0.7,
  fontSize: 32, fontFace: 'Arial', color: WHITE, bold: true,
  animate: { type: 'fly', delay: 0.2 },
});

// Problem cards
const problems = [
  { icon: '🏦', title: '190M Underbanked', desc: 'Indians lack access to formal banking and digital payment systems', color: DANGER },
  { icon: '📖', title: 'Financial Illiteracy', desc: 'Most first-time users don\'t understand interest, UPI, or fraud risks', color: WARNING },
  { icon: '📱', title: 'Digital Fear', desc: 'Smartphone anxiety prevents adoption of UPI and online banking', color: PRIMARY },
  { icon: '🛡️', title: 'Fraud Vulnerability', desc: 'SMS phishing, QR scams, and social engineering target new users', color: ACCENT },
];

problems.forEach((p, i) => {
  const yPos = 1.6 + i * 1.15;
  slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: yPos, w: 5.8, h: 1,
    fill: { type: 'solid', color: CARD_BG },
    line: { color: p.color, width: 1.5, transparency: 50 },
    rectRadius: 0.08,
    shadow: { type: 'outer', blur: 8, offset: 0, color: '000000', opacity: 0.2 },
    animate: { type: 'fly', delay: 0.3 + i * 0.15 },
  });
  slide2.addText(p.icon, {
    x: 0.7, y: yPos + 0.1, w: 0.8, h: 0.8,
    fontSize: 28, align: 'center', valign: 'middle',
    animate: { type: 'fade', delay: 0.4 + i * 0.15 },
  });
  slide2.addText(p.title, {
    x: 1.6, y: yPos + 0.05, w: 4.5, h: 0.4,
    fontSize: 16, fontFace: 'Arial', color: WHITE, bold: true,
    animate: { type: 'fade', delay: 0.4 + i * 0.15 },
  });
  slide2.addText(p.desc, {
    x: 1.6, y: yPos + 0.45, w: 4.5, h: 0.45,
    fontSize: 11, fontFace: 'Arial', color: MUTED,
    animate: { type: 'fade', delay: 0.5 + i * 0.15 },
  });
});

// Solution panel (right side)
slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.8, y: 1.6, w: 5.8, h: 4.8,
  fill: { type: 'solid', color: GLASS_BG },
  line: { color: ACCENT, width: 1.5, transparency: 50 },
  rectRadius: 0.1,
  shadow: { type: 'outer', blur: 15, offset: 0, color: ACCENT, opacity: 0.15 },
  animate: { type: 'fly', delay: 0.6 },
});

slide2.addText('THE SOLUTION', {
  x: 7.1, y: 1.8, w: 5, h: 0.4,
  fontSize: 12, fontFace: 'Arial', color: ACCENT, bold: true,
  letterSpacing: 3,
  animate: { type: 'fade', delay: 0.7 },
});

slide2.addText('ArthaSetu Platform', {
  x: 7.1, y: 2.2, w: 5, h: 0.5,
  fontSize: 22, fontFace: 'Arial', color: WHITE, bold: true,
  animate: { type: 'fade', delay: 0.8 },
});

const solutions = [
  'Multi-language onboarding (Hindi, Tamil, Bengali, etc.)',
  'Adaptive profiling based on occupation & digital comfort',
  'Interactive financial literacy quizzes with FHE scoring',
  'Sandbox UPI payments, fraud detection, budget planning',
  'ZKP identity verification — no data exposure',
  '10-layer post-quantum security architecture',
  '7-year immutable audit trail with hash chaining',
  'DPDP-compliant data export & deletion',
];

solutions.forEach((sol, i) => {
  slide2.addText(`✓  ${sol}`, {
    x: 7.3, y: 2.85 + i * 0.42, w: 5, h: 0.4,
    fontSize: 11, fontFace: 'Arial', color: WHITE,
    animate: { type: 'fade', delay: 0.9 + i * 0.1 },
  });
});

// ============================================================
// SLIDE 3: How It Works — User Journey
// ============================================================
const slide3 = pptx.addSlide();
slide3.background = { color: DARK_BG };

slide3.addText('USER JOURNEY', {
  x: 0.5, y: 0.3, w: 4, h: 0.5,
  fontSize: 12, fontFace: 'Arial', color: PRIMARY, bold: true,
  letterSpacing: 3,
  animate: { type: 'fly', delay: 0.1 },
});

slide3.addText('How ArthaSetu Works', {
  x: 0.5, y: 0.7, w: 8, h: 0.7,
  fontSize: 32, fontFace: 'Arial', color: WHITE, bold: true,
  animate: { type: 'fly', delay: 0.2 },
});

// Flow diagram — 4 phases
const phases = [
  { 
    title: 'Registration', color: PRIMARY, screens: [
      { num: '01', name: 'Language & Voice', icon: '🌐' },
      { num: '02', name: 'Know Me Profile', icon: '👤' },
    ]
  },
  { 
    title: 'Assessments', color: ACCENT, screens: [
      { num: '03', name: 'Financial Literacy', icon: '📊' },
      { num: '04', name: 'Digital Confidence', icon: '📱' },
      { num: '05', name: 'Trust & Safety', icon: '🛡️' },
      { num: '06', name: 'Reliability', icon: '✅' },
    ]
  },
  { 
    title: 'Lab & Learning', color: WARNING, screens: [
      { num: '07', name: 'Adaptive Engine', icon: '🧠' },
      { num: '08', name: 'Safe Finance Lab', icon: '🔬' },
    ]
  },
  { 
    title: 'Output', color: DANGER, screens: [
      { num: '09', name: 'Guidance', icon: '📋' },
      { num: '10', name: 'Certificate', icon: '🎓' },
      { num: '11', name: 'Feedback', icon: '⭐' },
    ]
  },
];

phases.forEach((phase, pi) => {
  const xPos = 0.5 + pi * 3.1;
  
  // Phase header
  slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: xPos, y: 1.5, w: 2.8, h: 0.5,
    fill: { type: 'solid', color: phase.color },
    rectRadius: 0.05,
    shadow: { type: 'outer', blur: 8, offset: 0, color: phase.color, opacity: 0.4 },
    animate: { type: 'fly', delay: 0.3 + pi * 0.15 },
  });
  slide3.addText(phase.title, {
    x: xPos, y: 1.5, w: 2.8, h: 0.5,
    fontSize: 13, fontFace: 'Arial', color: WHITE, bold: true,
    align: 'center', valign: 'middle',
    animate: { type: 'fade', delay: 0.35 + pi * 0.15 },
  });

  // Screen cards
  phase.screens.forEach((screen, si) => {
    const cardY = 2.2 + si * 0.9;
    slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: xPos, y: cardY, w: 2.8, h: 0.75,
      fill: { type: 'solid', color: CARD_BG },
      line: { color: phase.color, width: 1, transparency: 60 },
      rectRadius: 0.06,
      shadow: { type: 'outer', blur: 5, offset: 0, color: '000000', opacity: 0.15 },
      animate: { type: 'fly', delay: 0.5 + pi * 0.15 + si * 0.1 },
    });
    slide3.addText(screen.icon, {
      x: xPos + 0.1, y: cardY + 0.08, w: 0.5, h: 0.55,
      fontSize: 20, align: 'center', valign: 'middle',
      animate: { type: 'fade', delay: 0.6 + pi * 0.15 + si * 0.1 },
    });
    slide3.addText(screen.num, {
      x: xPos + 0.6, y: cardY + 0.05, w: 0.4, h: 0.3,
      fontSize: 10, fontFace: 'Arial', color: phase.color, bold: true,
      animate: { type: 'fade', delay: 0.6 + pi * 0.15 + si * 0.1 },
    });
    slide3.addText(screen.name, {
      x: xPos + 0.6, y: cardY + 0.32, w: 2, h: 0.35,
      fontSize: 11, fontFace: 'Arial', color: WHITE,
      animate: { type: 'fade', delay: 0.65 + pi * 0.15 + si * 0.1 },
    });
  });
});

// Security screens callout (bottom)
slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 6.1, w: 12.2, h: 1.1,
  fill: { type: 'solid', color: GLASS_BG },
  line: { color: PRIMARY, width: 1.5, transparency: 50 },
  rectRadius: 0.08,
  shadow: { type: 'outer', blur: 10, offset: 0, color: PRIMARY, opacity: 0.15 },
  animate: { type: 'fly', delay: 1.2 },
});

slide3.addText('🛡️  NEXT-GEN SECURITY LAYER', {
  x: 0.8, y: 6.15, w: 4, h: 0.35,
  fontSize: 11, fontFace: 'Arial', color: PRIMARY, bold: true,
  letterSpacing: 2,
  animate: { type: 'fade', delay: 1.3 },
});

const secScreens = ['12. Security Dashboard', '13. Consent Manager', '14. ZKP Verifier'];
secScreens.forEach((s, i) => {
  slide3.addText(s, {
    x: 1 + i * 4, y: 6.5, w: 3.5, h: 0.4,
    fontSize: 13, fontFace: 'Arial', color: WHITE, bold: true,
    animate: { type: 'fade', delay: 1.4 + i * 0.1 },
  });
  slide3.addText('ZKP + FHE + PQC + Hash-Chain', {
    x: 1 + i * 4, y: 6.85, w: 3.5, h: 0.3,
    fontSize: 9, fontFace: 'Arial', color: MUTED,
    animate: { type: 'fade', delay: 1.5 + i * 0.1 },
  });
});

// ============================================================
// SLIDE 4: Security Architecture (10 Innovations)
// ============================================================
const slide4 = pptx.addSlide();
slide4.background = { color: DARK_BG };

slide4.addText('SECURITY ARCHITECTURE', {
  x: 0.5, y: 0.3, w: 5, h: 0.5,
  fontSize: 12, fontFace: 'Arial', color: ACCENT, bold: true,
  letterSpacing: 3,
  animate: { type: 'fly', delay: 0.1 },
});

slide4.addText('10 Next-Gen Security Innovations', {
  x: 0.5, y: 0.7, w: 10, h: 0.7,
  fontSize: 30, fontFace: 'Arial', color: WHITE, bold: true,
  animate: { type: 'fly', delay: 0.2 },
});

const innovations = [
  { icon: '🔮', name: 'Zero-Knowledge Proofs', desc: 'Prove age/income without revealing data', tech: 'Halo2 / Groth16', color: '8B5CF6' },
  { icon: '🧮', name: 'FHE', desc: 'Compute on encrypted data', tech: 'BFV Scheme', color: '3B82F6' },
  { icon: '🔐', name: 'Post-Quantum Crypto', desc: 'Quantum-resistant encryption', tech: 'Kyber-1024 / Dilithium-87', color: '06B6D4' },
  { icon: '⛓️', name: 'Hash-Chain Audit', desc: 'Immutable, tamper-evident logging', tech: 'SHA-256 chain + Merkle tree', color: '10B981' },
  { icon: '🏰', name: 'TEE', desc: 'Secure enclaves for computation', tech: 'Intel SGX / AMD SEV', color: 'F59E0B' },
  { icon: '✍️', name: 'Smart Consent', desc: 'Cryptographic consent tokens', tech: 'Dilithium signatures + ZKP scope', color: 'EF4444' },
  { icon: '🧠', name: 'Adaptive Risk', desc: 'ML-based real-time scoring', tech: '8 risk factors, dynamic thresholds', color: 'EC4899' },
  { icon: '🌫️', name: 'Diff. Privacy', desc: 'Calibrated noise for analytics', tech: 'Laplace / Gaussian mechanism', color: '14B8A6' },
  { icon: '🔄', name: 'Crypto-Agility', desc: 'Algorithm migration without downtime', tech: 'Key rotation + migration plans', color: 'F97316' },
  { icon: '🆔', name: 'Self-Sovereign ID', desc: 'Decentralized identity ownership', tech: 'DID + Verifiable Credentials', color: 'A855F7' },
];

innovations.forEach((inn, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const xPos = 0.5 + col * 6.3;
  const yPos = 1.6 + row * 1.05;

  slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: xPos, y: yPos, w: 6, h: 0.9,
    fill: { type: 'solid', color: CARD_BG },
    line: { color: inn.color, width: 1.5, transparency: 55 },
    rectRadius: 0.06,
    shadow: { type: 'outer', blur: 6, offset: 0, color: '000000', opacity: 0.15 },
    animate: { type: 'fly', delay: 0.3 + i * 0.08 },
  });
  
  slide4.addText(inn.icon, {
    x: xPos + 0.15, y: yPos + 0.1, w: 0.6, h: 0.65,
    fontSize: 22, align: 'center', valign: 'middle',
    animate: { type: 'fade', delay: 0.4 + i * 0.08 },
  });
  
  slide4.addText(inn.name, {
    x: xPos + 0.8, y: yPos + 0.05, w: 3, h: 0.35,
    fontSize: 13, fontFace: 'Arial', color: WHITE, bold: true,
    animate: { type: 'fade', delay: 0.4 + i * 0.08 },
  });
  
  slide4.addText(inn.desc, {
    x: xPos + 0.8, y: yPos + 0.38, w: 3, h: 0.3,
    fontSize: 10, fontFace: 'Arial', color: MUTED,
    animate: { type: 'fade', delay: 0.45 + i * 0.08 },
  });
  
  slide4.addText(inn.tech, {
    x: xPos + 3.8, y: yPos + 0.15, w: 2, h: 0.55,
    fontSize: 9, fontFace: 'Arial', color: inn.color, align: 'right', valign: 'middle',
    animate: { type: 'fade', delay: 0.5 + i * 0.08 },
  });
});

// ============================================================
// SLIDE 5: Technical Deep Dive
// ============================================================
const slide5 = pptx.addSlide();
slide5.background = { color: DARK_BG };

slide5.addText('TECHNICAL ARCHITECTURE', {
  x: 0.5, y: 0.3, w: 5, h: 0.5,
  fontSize: 12, fontFace: 'Arial', color: WARNING, bold: true,
  letterSpacing: 3,
  animate: { type: 'fly', delay: 0.1 },
});

slide5.addText('Under the Hood', {
  x: 0.5, y: 0.7, w: 8, h: 0.7,
  fontSize: 32, fontFace: 'Arial', color: WHITE, bold: true,
  animate: { type: 'fly', delay: 0.2 },
});

// Architecture diagram (simplified)
// Frontend box
slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 1.6, w: 3.8, h: 2.2,
  fill: { type: 'solid', color: CARD_BG },
  line: { color: PRIMARY, width: 1.5 },
  rectRadius: 0.08,
  shadow: { type: 'outer', blur: 8, offset: 0, color: PRIMARY, opacity: 0.15 },
  animate: { type: 'fly', delay: 0.3 },
});
slide5.addText('FRONTEND', {
  x: 0.7, y: 1.7, w: 3.4, h: 0.35,
  fontSize: 11, fontFace: 'Arial', color: PRIMARY, bold: true,
  letterSpacing: 2,
  animate: { type: 'fade', delay: 0.35 },
});
const feItems = ['HTML/CSS/JS (14 screens)', 'security-client.js (API SDK)', 'PQC key gen (client-side)', 'ZKP proof generation', 'Consent token management'];
feItems.forEach((item, i) => {
  slide5.addText(`•  ${item}`, {
    x: 0.9, y: 2.1 + i * 0.32, w: 3.2, h: 0.3,
    fontSize: 10, fontFace: 'Arial', color: WHITE,
    animate: { type: 'fade', delay: 0.4 + i * 0.08 },
  });
});

// API Server box
slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 4.8, y: 1.6, w: 3.8, h: 2.2,
  fill: { type: 'solid', color: CARD_BG },
  line: { color: ACCENT, width: 1.5 },
  rectRadius: 0.08,
  shadow: { type: 'outer', blur: 8, offset: 0, color: ACCENT, opacity: 0.15 },
  animate: { type: 'fly', delay: 0.5 },
});
slide5.addText('API SERVER (Node.js)', {
  x: 5.0, y: 1.7, w: 3.4, h: 0.35,
  fontSize: 11, fontFace: 'Arial', color: ACCENT, bold: true,
  letterSpacing: 2,
  animate: { type: 'fade', delay: 0.55 },
});
const apiItems = ['Express.js + Helmet + CORS', '9 route modules (40+ endpoints)', 'JWT + PQC authentication', 'Risk middleware (per-request)', 'Audit middleware (hash-chain)'];
apiItems.forEach((item, i) => {
  slide5.addText(`•  ${item}`, {
    x: 5.2, y: 2.1 + i * 0.32, w: 3.2, h: 0.3,
    fontSize: 10, fontFace: 'Arial', color: WHITE,
    animate: { type: 'fade', delay: 0.6 + i * 0.08 },
  });
});

// Security Layer box
slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 9.1, y: 1.6, w: 3.8, h: 2.2,
  fill: { type: 'solid', color: CARD_BG },
  line: { color: DANGER, width: 1.5 },
  rectRadius: 0.08,
  shadow: { type: 'outer', blur: 8, offset: 0, color: DANGER, opacity: 0.15 },
  animate: { type: 'fly', delay: 0.7 },
});
slide5.addText('CRYPTO MODULES', {
  x: 9.3, y: 1.7, w: 3.4, h: 0.35,
  fontSize: 11, fontFace: 'Arial', color: DANGER, bold: true,
  letterSpacing: 2,
  animate: { type: 'fade', delay: 0.75 },
});
const cryptoItems = ['pqc.js (Kyber + Dilithium)', 'zkp.js (Halo2 circuits)', 'fhe.js (BFV homomorphic)', 'hash.js (SHA-256 chain)', 'keyManager.js (HSM hierarchy)'];
cryptoItems.forEach((item, i) => {
  slide5.addText(`•  ${item}`, {
    x: 9.5, y: 2.1 + i * 0.32, w: 3.2, h: 0.3,
    fontSize: 10, fontFace: 'Arial', color: WHITE,
    animate: { type: 'fade', delay: 0.8 + i * 0.08 },
  });
});

// Database section
slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 4.2, w: 12.4, h: 2.8,
  fill: { type: 'solid', color: CARD_BG },
  line: { color: WARNING, width: 1 },
  rectRadius: 0.08,
  shadow: { type: 'outer', blur: 8, offset: 0, color: WARNING, opacity: 0.1 },
  animate: { type: 'fly', delay: 0.9 },
});

slide5.addText('DATABASE LAYER — 16 Tables', {
  x: 0.7, y: 4.3, w: 5, h: 0.35,
  fontSize: 11, fontFace: 'Arial', color: WARNING, bold: true,
  letterSpacing: 2,
  animate: { type: 'fade', delay: 0.95 },
});

const tables = [
  ['users (PQC-encrypted PII)', 'bank_accounts (FHE-ready)', 'token_vault', 'upi_status'],
  ['consent_tokens (crypto-signed)', 'transaction_history (FHE)', 'risk_assessments', 'audit_immutable (hash-chain)'],
  ['fhe_computations', 'tee_attestations', 'crypto_agility_config', 'differential_privacy_config'],
  ['zkp_verifications', 'encryption_key_hierarchy', 'api_keys', 'rate_limits'],
];

tables.forEach((row, ri) => {
  row.forEach((tbl, ci) => {
    slide5.addText(tbl, {
      x: 0.8 + ci * 3.1, y: 4.75 + ri * 0.45, w: 2.9, h: 0.4,
      fontSize: 9.5, fontFace: 'Arial', color: WHITE,
      fill: { type: 'solid', color: GLASS_BG },
      line: { color: WARNING, width: 0.5, transparency: 70 },
      rectRadius: 0.04,
      animate: { type: 'fade', delay: 1.0 + ri * 0.1 + ci * 0.05 },
    });
  });
});

// ============================================================
// SLIDE 6: Impact & Roadmap
// ============================================================
const slide6 = pptx.addSlide();
slide6.background = { color: DARK_BG };

slide6.addText('IMPACT & FUTURE', {
  x: 0.5, y: 0.3, w: 4, h: 0.5,
  fontSize: 12, fontFace: 'Arial', color: ACCENT, bold: true,
  letterSpacing: 3,
  animate: { type: 'fly', delay: 0.1 },
});

slide6.addText('Building the Future of Financial Inclusion', {
  x: 0.5, y: 0.7, w: 10, h: 0.7,
  fontSize: 28, fontFace: 'Arial', color: WHITE, bold: true,
  animate: { type: 'fly', delay: 0.2 },
});

// Impact stats (left panel)
slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 1.6, w: 6, h: 5.4,
  fill: { type: 'solid', color: CARD_BG },
  line: { color: PRIMARY, width: 1 },
  rectRadius: 0.1,
  shadow: { type: 'outer', blur: 10, offset: 0, color: PRIMARY, opacity: 0.1 },
  animate: { type: 'fly', delay: 0.3 },
});

slide6.addText('CURRENT IMPACT', {
  x: 0.8, y: 1.75, w: 5, h: 0.4,
  fontSize: 12, fontFace: 'Arial', color: PRIMARY, bold: true,
  letterSpacing: 2,
  animate: { type: 'fade', delay: 0.4 },
});

const impactStats = [
  { value: '6+', label: 'Indian Languages Supported', icon: '🌐' },
  { value: '14', label: 'Interactive Screens', icon: '📱' },
  { value: '10', label: 'Security Innovations Active', icon: '🔐' },
  { value: '40+', label: 'API Endpoints', icon: '⚡' },
  { value: '16', label: 'Database Tables', icon: '🗄️' },
  { value: '7yr', label: 'Audit Trail Retention', icon: '⛓️' },
  { value: '100%', label: 'Sandbox Practice Mode', icon: '🔬' },
  { value: '0', label: 'Real Money at Risk', icon: '🚫' },
];

impactStats.forEach((stat, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const xPos = 0.8 + col * 2.8;
  const yPos = 2.3 + row * 1.15;

  slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: xPos, y: yPos, w: 2.5, h: 1,
    fill: { type: 'solid', color: GLASS_BG },
    line: { color: PRIMARY, width: 0.5, transparency: 70 },
    rectRadius: 0.06,
    animate: { type: 'fly', delay: 0.5 + i * 0.1 },
  });
  slide6.addText(stat.icon, {
    x: xPos + 0.1, y: yPos + 0.15, w: 0.5, h: 0.5,
    fontSize: 18, align: 'center',
    animate: { type: 'fade', delay: 0.55 + i * 0.1 },
  });
  slide6.addText(stat.value, {
    x: xPos + 0.6, y: yPos + 0.05, w: 1.7, h: 0.5,
    fontSize: 22, fontFace: 'Arial', color: ACCENT, bold: true,
    animate: { type: 'fade', delay: 0.55 + i * 0.1 },
  });
  slide6.addText(stat.label, {
    x: xPos + 0.6, y: yPos + 0.55, w: 1.7, h: 0.35,
    fontSize: 9, fontFace: 'Arial', color: MUTED,
    animate: { type: 'fade', delay: 0.6 + i * 0.1 },
  });
});

// Roadmap (right panel)
slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.8, y: 1.6, w: 5.8, h: 5.4,
  fill: { type: 'solid', color: CARD_BG },
  line: { color: ACCENT, width: 1 },
  rectRadius: 0.1,
  shadow: { type: 'outer', blur: 10, offset: 0, color: ACCENT, opacity: 0.1 },
  animate: { type: 'fly', delay: 0.6 },
});

slide6.addText('FUTURE ROADMAP', {
  x: 7.1, y: 1.75, w: 5, h: 0.4,
  fontSize: 12, fontFace: 'Arial', color: ACCENT, bold: true,
  letterSpacing: 2,
  animate: { type: 'fade', delay: 0.7 },
});

const roadmap = [
  { phase: 'Phase 1', title: 'Real UPI Integration', desc: 'Connect to NPCI sandbox for live UPI simulation', color: PRIMARY },
  { phase: 'Phase 2', title: 'Aadhaar eKYC', desc: 'UIDAI integration for real identity verification', color: ACCENT },
  { phase: 'Phase 3', title: 'RBI Sandbox', desc: 'Apply for RBI regulatory sandbox approval', color: WARNING },
  { phase: 'Phase 4', title: 'Blockchain Audit', desc: 'Anchor hash-chain to Ethereum for global verification', color: DANGER },
  { phase: 'Phase 5', title: 'Multi-Language AI', desc: 'Voice-first interface with multilingual LLM support', color: 'EC4899' },
];

roadmap.forEach((item, i) => {
  const yPos = 2.3 + i * 0.95;
  
  // Timeline dot
  slide6.addShape(pptx.shapes.OVAL, {
    x: 7.2, y: yPos + 0.15, w: 0.3, h: 0.3,
    fill: { type: 'solid', color: item.color },
    shadow: { type: 'outer', blur: 6, offset: 0, color: item.color, opacity: 0.4 },
    animate: { type: 'fly', delay: 0.8 + i * 0.12 },
  });
  
  // Timeline line (except last)
  if (i < roadmap.length - 1) {
    slide6.addShape(pptx.shapes.RECTANGLE, {
      x: 7.32, y: yPos + 0.45, w: 0.06, h: 0.5,
      fill: { type: 'solid', color: item.color, transparency: 50 },
      animate: { type: 'appear', delay: 0.9 + i * 0.12 },
    });
  }
  
  slide6.addText(item.phase, {
    x: 7.7, y: yPos + 0.02, w: 1.2, h: 0.3,
    fontSize: 9, fontFace: 'Arial', color: item.color, bold: true,
    animate: { type: 'fade', delay: 0.85 + i * 0.12 },
  });
  slide6.addText(item.title, {
    x: 7.7, y: yPos + 0.25, w: 4.5, h: 0.3,
    fontSize: 13, fontFace: 'Arial', color: WHITE, bold: true,
    animate: { type: 'fade', delay: 0.85 + i * 0.12 },
  });
  slide6.addText(item.desc, {
    x: 7.7, y: yPos + 0.55, w: 4.5, h: 0.3,
    fontSize: 10, fontFace: 'Arial', color: MUTED,
    animate: { type: 'fade', delay: 0.9 + i * 0.12 },
  });
});

// Footer on all slides
pptx.slides.forEach((slide, i) => {
  if (i > 0) {
    slide.addText('ArthaSetu  |  Adaptive Financial Inclusion  |  Smart India Hackathon 2026', {
      x: 0, y: 7.1, w: '100%', h: 0.4,
      fontSize: 9, fontFace: 'Arial', color: MUTED, align: 'center',
    });
  }
});

// Save
const outputPath = 'C:\\Users\\arpam\\OneDrive\\Desktop\\ICPC\\SMART INDIA HACKATHON\\appPrototype\\ArthaSetu_Presentation.pptx';
await pptx.writeFile({ fileName: outputPath });
console.log(`PPT saved to: ${outputPath}`);
