# ArthaSetu - Prototype Documentation

## Project Overview

**Application Name:** ArthaSetu - Adaptive Financial Inclusion Platform

**Context:** Smart India Hackathon Project

**Purpose:** A digital financial literacy, assessment, and training platform designed for first-time financial users, informal-sector workers, and underbanked individuals. ArthaSetu adapts its interface, guidance, and pacing dynamically using a statistical user-profiling engine.

---

## Key Features

1. **Language & Voice Selection (Step 1)**
   - Supports 6+ Indian languages (English, Hindi, Tamil, Bengali, Telugu, Marathi).
   - Integrates the browser's native **Web Speech API** for Text-to-Speech (TTS) voice guidance.
   
2. **"Know Me" Profiling (Step 2)**
   - Customises the platform based on occupation, digital familiarity, and financial experience.
   
3. **Multi-Dimension Assessment (Steps 3 - 6)**
   - **Financial Literacy**: Scenario-based flat interest, PIN-sharing, and savings benefits questions.
   - **Digital Confidence**: Hands-on interactive touch-tasks (Numeric Keypad entry, Drag & Drop coin to piggy bank, Swipe-to-pay slider).
   - **Trust & Safety Concerns**: Highlights regulatory fact cards (e.g. RBI liability, DPDP Act, Wrong UPI Reversals) matching user-selected fears.
   - **Reliability & Income Assessment**: Evaluates alternative trust indicators (e.g. bill payment histories) with user consent.

4. **Adaptive Pathway Selection Engine (Step 7)**
   - Calculates statistical scores for Financial Literacy, Digital Confidence, and Reliability.
   - Matches the user into one of three dynamic pathways:
     - **Self-Guided Pathway**: Normal autonomous operation for highly confident users.
     - **Guided Pathway**: Focuses attention with pulsing indicator highlights on next steps.
     - **Voice/Visual Assisted Pathway**: Activates auto-read TTS, increases button targets, and simplifies labels.

5. **Safe Finance Lab (Step 8)**
   - **Practice Payment**: Simulated secure UPI transfer with recipient verification and PIN entry (practice PIN: `123456`).
   - **Fraud Detector**: Message inbox game where users flag SMS threads as SAFE or SPAM, followed by detailed educational explanations.
   - **Loan Comparator**: Live sliders showing flat vs reducing compound interest rates to demonstrate financial traps.
   - **Budget Volatility Planner**: Budgeting mini-game under regular, irregular, or seasonal income patterns with random micro-events.

6. **Outcome Measurement (Steps 9 - 11)**
   - Generates a printable **ArthaSetu Competency Certificate**.
   - Collects UX feedback and resets state for the next user.

---

## File Structure

```
arthasetu/
├── index.html               # Semantic HTML structure & 11-step screens
├── style.css                # Premium glassmorphism design tokens & styles
├── script.js                # State machine, TTS helper, profiling calculations, & game loops
└── PROTOTYPE_DOCUMENTATION.md # This documentation
```

---

## How to Run

1. Open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Safari, or Mozilla Firefox).
2. The application loads locally.
3. Enable **Voice Assistant Mode** to hear ArthaDoot read headings and elements aloud.
4. Follow the step-by-step onboarding process to generate your certificate!
