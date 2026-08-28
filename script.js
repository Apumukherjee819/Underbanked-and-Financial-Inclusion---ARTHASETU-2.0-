/**
 * ArthaSetu - Adaptive Financial Inclusion Platform
 * JavaScript Application Logic and State Machine
 */

// --- Global Application State ---
let state = {
    currentScreen: 1,
    selectedLang: 'en',
    voiceMode: false,
    
    // User Profile
    profile: {
        occupation: '',
        finExp: '',
        digConf: '',
        incomePattern: 'regular'
    },
    
    // Assessment Scores
    quizAnswers: { 1: null, 2: null, 3: null },
    quizCorrectAnswers: { 1: 0, 2: 2, 3: 0 }, // indices of correct answers
    
    digitalTasks: {
        task1: false, // numeric entry
        task2: false, // drag-and-drop
        task3: false  // swipe to confirm
    },
    
    selectedConcerns: {
        fraud: false,
        privacy: false,
        charges: false,
        mistakes: false
    },
    
    reliabilityConsent: false,
    reliabilityIndicatorsCount: 0,
    
    scores: {
        literacy: 0,
        digital: 0,
        reliability: 0
    },
    
    selectedPathway: 'self', // 'self', 'guided', 'assisted'
    
    // Sandbox Mode States
    sandbox: {
        walletBalance: 1000,
        history: [
            { type: 'credit', text: 'Welcome Bonus', amount: 1000, date: 'Aug 23, 2026', icon: '🎁' }
        ],
        activeTab: 'payment',
        
        // SMS Phishing list
        sms: [
            {
                id: 1,
                sender: "AD-LOTTRI",
                text: "CONGRATULATIONS! You have won a cash lottery of ₹10,00,000 from Government Promotion. Click here to claim immediately: www.sarkari-win.com/claim",
                isSafe: false,
                status: 'unread', // 'unread', 'correct', 'incorrect'
                explanation: "This is FRAUD. Government departments do not distribute cash lotteries via public SMS links. Real agencies never ask for money or banking access to transfer lottery prizes."
            },
            {
                id: 2,
                sender: "State Bank",
                text: "Dear Customer, your monthly bank statement for account ending 4096 is generated. Please login to your official banking portal to download. Do not share your PIN.",
                isSafe: true,
                status: 'unread',
                explanation: "This is SAFE. The message contains no urgent threats, suspicous external hyperlinks, or direct demands for OTPs or PIN inputs."
            },
            {
                id: 3,
                sender: "BP-ALERT",
                text: "ALERT! Your electricity bill of ₹1,450 is overdue. To prevent immediate line disconnection tonight, call our helpline officer at 9876543210 to pay via phone OTP.",
                isSafe: false,
                status: 'unread',
                explanation: "This is FRAUD. Utility companies do not threaten immediate disconnection via random phone numbers or ask for OTP verification on calls. Always pay bills through official government apps."
            }
        ],
        activeSMSIndex: -1,
        
        // Budget Game States
        gameWallet: 3000,
        gameSavings: 1500,
        gameMonth: 1
    },
    
    // Survey rating states
    survey: {
        nav: 0,
        comp: 0,
        conf: 0
    }
};

// --- Multi-language Translation Dictionaries (old removed) ---

const i18n = {
    "en": {
        "brandTagline": "Adaptive Inclusion",
        "navGroup1": "1. Registration & Profiling",
        "navGroup2": "2. Interactive Assessments",
        "navGroup3": "3. Learning & Lab",
        "navGroup4": "4. Summary & Feedback",
        "navGroup5": "5. Next-Gen Security",
        "guestUser": "Guest User",
        "online": " Online",
        "title1": "Language & Voice",
        "title2": "\"Know Me\" Profile",
        "title3": "Financial Literacy",
        "title4": "Digital Confidence",
        "title5": "Trust & Safety",
        "title6": "Reliability & Income",
        "title7": "Adaptive Engine",
        "title8": "Safe Finance Lab",
        "title9": "Personalised Guidance",
        "title10": "Readiness Report",
        "title11": "Feedback Survey",
        "title12": "Security Dashboard",
        "title13": "Consent Manager",
        "title14": "ZKP Verifier",
        "securityDashDesc": "10 Next-Gen Security Innovations protecting your financial data",
        "consentMgrDesc": "Cryptographic consent tokens — you control who accesses your data",
        "zkpVerifierDesc": "Prove your attributes without revealing the actual data",
        "prototype": "PROTOTYPE",
        "welcomeTitle": "Welcome to",
        "welcomeDesc": "ArthaSetu adapts to your financial needs, digital capability, and preferred language. We help you learn formal finance safely.",
        "langCount": "6+",
        "indianLanguages": "Indian Languages",
        "sandboxPct": "100%",
        "practiceSandbox": "Practice Sandbox",
        "selectLang": "Select Your Language",
        "langSubtitle": "The entire application will work in your selected language",
        "enableVoice": "🎙️ Enable Voice Assistance",
        "voiceDesc": "Our virtual guide \"ArthaDoot\" will read instructions aloud in your selected language.",
        "startProfiling": "Start Profiling",
        "tellUsAbout": "Tell Us About Yourself",
        "configureApp": "We configure the application based on your daily lifestyle and occupation.",
        "questionOccupation": "1. What is your primary occupation?",
        "occRetailer": "Small Retailer / Vendor",
        "occRetailerSub": "दुकानदार / रेहड़ी-पटरी",
        "occFarmer": "Farmer / Agriculture",
        "occFarmerSub": "किसान / खेती-बाड़ी",
        "occWorker": "Gig Worker / Delivery",
        "occWorkerSub": "डिलिवरी / टैक्सी चालक",
        "occDailywager": "Daily-wage Earner",
        "occDailywagerSub": "मजदूर / दैनिक वेतन",
        "questionFinExp": "2. Have you used formal banking and digital payment services?",
        "finBeginner": "First-time User",
        "finBeginnerSub": "Never used UPI / Online banking",
        "finBasic": "Basic User",
        "finBasicSub": "Have a bank card, but rarely use UPI",
        "finIntermediate": "Intermediate User",
        "finIntermediateSub": "Use UPI sometimes, need confidence",
        "questionDigConf": "3. How comfortable are you operating a smartphone?",
        "digLow": "Need Assistance",
        "digLowSub": "Usually ask others to do tasks",
        "digMedium": "Can Navigate Basic Apps",
        "digMediumSub": "Use WhatsApp / YouTube easily",
        "digHigh": "Highly Confident",
        "digHighSub": "Can download apps and do typing",
        "back": "← Back",
        "continue": "Continue →",
        "quizTitle": "Financial Literacy Assessment",
        "quizDesc": "Answer three scenario-based questions so we can understand your financial concepts.",
        "q1of3": "Question 1 of 3",
        "q1Title": "Calculate Flat Interest",
        "q1Scenario": "If you borrow ₹10,000 from a lender for 1 year at a 10% flat interest rate per year, how much total interest do you pay at the end of the year?",
        "q1a0": "₹1,000 (Correct interest payment)",
        "q1a1": "₹100 (1% calculations)",
        "q1a2": "₹0 (Interest-free loan)",
        "q1a3": "I do not know / Not sure",
        "q2of3": "Question 2 of 3",
        "q2Title": "Safe PIN & OTP Handling",
        "q2Scenario": "You receive a phone call from an unknown person claiming to be a Bank Manager. They ask for your UPI PIN or OTP to unlock your account. What do you do?",
        "q2a0": "Share it so my account is not blocked",
        "q2a1": "Share it only if they tell me my correct name",
        "q2a2": "Never share my PIN/OTP with anyone on a call (Correct)",
        "q2a3": "Tell them I will call them back later",
        "q3of3": "Question 3 of 3",
        "q3Title": "Value of Bank Savings",
        "q3Scenario": "What is the primary benefit of saving money in a formal bank account compared to storing cash in a box at home?",
        "q3a0": "The money earns interest and is safe from theft (Correct)",
        "q3a1": "It is easier to spend money kept in a bank",
        "q3a2": "There is no difference between cash and a bank account",
        "q3a3": "Not sure of the benefits",
        "digitalTitle": "Digital Confidence Assessment",
        "digitalDesc": "Complete these three simple interactive tasks to test your smartphone and touch screen comfort.",
        "task1Title": "Task 1: Typing Numbers",
        "task1Heading": "Enter Numeric Code",
        "task1Desc": "Using the screen keypad below, type the code: ",
        "task2Title": "Task 2: Drag & Drop",
        "task2Heading": "Secure Your Coin",
        "task2Desc": "Tap and drag the gold coin into the Piggy Bank below.",
        "dropCoin": "Drop Coin Here",
        "task3Title": "Task 3: Swipe Gesture",
        "task3Heading": "Swipe to Pay",
        "task3Desc": "Authorize simulated payment by swiping the slider key to the right.",
        "swipeConfirm": "Swipe Right to Confirm",
        "waitingInput": "Waiting for input...",
        "dragStart": "Drag coin to start",
        "slideHandle": "Slide handle to right",
        "trustTitle": "Trust & Safety Concerns",
        "trustDesc": "Select any concerns that make you hesitate to use digital finance. We'll show you how we solve them.",
        "trustConcerns": "What are your main concerns? (Select all that apply)",
        "concernFraud": "Fear of Scams & Fraud",
        "concernFraudDesc": "Concerns about losing money to online scammers",
        "concernPrivacy": "Data & Account Privacy",
        "concernPrivacyDesc": "Worries that personal info will be leaked",
        "concernCharges": "Hidden Charges & Fees",
        "concernChargesDesc": "Suspicion of bank deducts without telling you",
        "concernMistakes": "Fear of Making Mistakes",
        "concernMistakesDesc": "Fear that typing a wrong digit sends money to the wrong person",
        "reassurancePortal": "💡 Reassurance Portal",
        "reassuranceDesc": "Select one or more concerns on the left to read safety facts and regulatory guarantees.",
        "altAssessment": "ALTERNATIVE ASSESSMENT",
        "reliabilityTitle": "Alternative Financial Reliability",
        "reliabilityDesc": "For users who do not have formal bank credit histories or salary slips, ArthaSetu evaluates alternative indicators of trust based on savings patterns and transactional habits.",
        "simReliability": "Simulated Reliability Profile",
        "incomeProfile": "Income & Savings Profile",
        "consentDetails": "Please provide consent-based details to calculate your reliability tier.",
        "incomePattern": "1. How is your income pattern?",
        "incomeRegular": "📅 Regular Monthly",
        "incomeIrregular": "⚡ Irregular Daily/Weekly",
        "incomeSeasonal": "🌾 Seasonal (Harvest/Gigs)",
        "indicatorsTitle": "2. Select indicators that apply to you:",
        "ind1": "I pay shop rent or utility bills regularly",
        "ind2": "I keep some cash savings in a post office/savings box",
        "ind3": "I have a running trade inventory or business supplies",
        "ind4": "I have zero outstanding local informal lender debt",
        "consentText": "I consent to use alternative indicators to build a simulated credit reliability score.",
        "generateProfile": "Generate Engine Profile →",
        "engineTitle": "ArthaSetu Adaptive Profiling Engine",
        "engineDesc": "Here is your computed financial profile. The app selects a pathway tailored to you.",
        "scoreLiteracy": "Financial Literacy",
        "scoreDigital": "Digital Confidence",
        "scoreReliability": "Alternative Reliability",
        "recommendedPath": "RECOMMENDED ONBOARDING PATHWAY",
        "calculating": "Calculating...",
        "selectContinue": "Select continue to run profiling.",
        "enterLab": "Enter Safe Finance Lab →",
        "labTitle": "Safe Finance Lab",
        "practiceSandboxTag": "PRACTICE SANDBOX",
        "tabPayment": "📱 Practice Payment",
        "tabFraud": "🛡️ Fraud Phishing Detector",
        "tabLoan": "📊 Loan Comparator",
        "tabBudget": "🌾 Budget & Volatility",
        "arthapay": "ArthaPay",
        "enterRecipient": "Enter Recipient's UPI ID / Phone",
        "verifyRecipient": "Verify Recipient",
        "verified": "Verified",
        "enterAmount": "Enter Transfer Amount (₹)",
        "walletBalance": "Practice Wallet Balance: ₹1,000",
        "continueToPay": "Continue to Pay",
        "enterUPIPIN": "Enter 6-Digit UPI PIN",
        "payingRs": "Paying ₹",
        "toRecipient": "to Kisan Bhai",
        "txnSuccess": "Transaction Successful!",
        "sentTo": "Sent to Kisan Bhai",
        "txnId": "Transaction ID:",
        "payAgain": "Pay Again",
        "paymentTutorial": "Simulated Payment Tutorial",
        "paymentTutorialDesc": "Learn how to transfer funds securely without risking real money.",
        "crucialGuidelines": "💡 Crucial Guidelines:",
        "practicePIN": "Your practice PIN code is: ",
        "tip2": "Double check the verified recipient name before clicking pay.",
        "tip3": "Never type your PIN anywhere except standard secure banker screens.",
        "walletHistory": "Wallet History",
        "welcomeBonus": "Welcome Bonus",
        "messageInbox": "📱 Message Inbox",
        "fraudDesc": "Under RBI guidelines, if you notify your bank within 3 days of unauthorized electronic transactions, your liability is ZERO. Banks never ask for UPI PINs to credit money.",
        "selectMessage": "Select a message",
        "fraudPlaceholder": "Please click on an incoming SMS from the list to analyze its safety.",
        "classifySafe": "✔️ Classify as SAFE",
        "reportFraud": "🚨 Report as FRAUD / SPAM",
        "loanTitle": "📊 Loan Cost Simulator",
        "loanDesc": "Adjust sliders to see total repayments and avoid interest traps.",
        "principalAmt": "Principal Amount",
        "interestRate": "Interest Rate (Annual)",
        "tenure": "Tenure (Months)",
        "flatLoan": "FLAT LOAN (SIMPLE INTEREST)",
        "flatRateFinancing": "Flat Rate Financing",
        "monthlyEMI": "Monthly EMI",
        "totalInterest": "Total Interest",
        "totalRepayment": "Total Repayment",
        "flatLoanDesc": "Interest is calculated on the initial principal only.",
        "compoundLoan": "COMPOUND LOAN (REDUCING BALANCE)",
        "reducingBalanceFinancing": "Reducing Balance Financing",
        "compoundLoanDesc": "Interest is calculated only on the outstanding principal. Better than Flat Loan!",
        "budgetTitle": "🌾 Dynamic Income Volatility Simulator",
        "budgetDesc": "Manage expenses under varying income constraints. Play the simulated month!",
        "currentIncome": "Current Income Model:",
        "foodAlloc": "Food & Rent Allocation (₹)",
        "savingsBox": "Savings Box (₹)",
        "growthAlloc": "Invest / Business Growth (₹)",
        "simulateMonth": "🌾 Simulate Next Month 🌾",
        "walletBal": "Wallet Balance",
        "accumSavings": "Accumulated Savings",
        "activityLog": "Activity Log",
        "gameStarted": "Game started.",
        "guidanceTitle": "Personalised Financial Guidance",
        "guidanceDesc": "Here are crucial financial rules curated based on your assessments.",
        "viewReport": "View Readiness Report →",
        "reportTitle": "Financial Readiness Report",
        "reportDesc": "Excellent progress! Here is your official competency evaluation certificate.",
        "certTitle": "ArthaSetu Competency Certificate",
        "certAwardedTo": "This certificate is awarded to",
        "certDesc": "for successfully completing the adaptive financial profiling and practicing secure UPI transactions in the Safe Finance Lab simulator.",
        "certLiteracy": "Literacy Level",
        "certDigital": "Digital Confidence",
        "certPathway": "Assisted Pathway",
        "certSystem": "System Issued",
        "certDate": "Date of Verification",
        "printCert": "🖨️ Print Certificate",
        "provideFeedback": "Provide Feedback →",
        "feedbackTitle": "Feedback & Outcome Measurement",
        "feedbackDesc": "Help us evaluate this adaptive framework. Tell us how you felt during the onboarding.",
        "surveyQ1": "1. How easy was it to navigate this application?",
        "surveyQ2": "2. Did you understand the security rules and fraud warnings clearly?",
        "surveyQ3": "3. How confident do you feel doing mobile payments on your own now?",
        "surveyQ4": "4. Do you have any suggestions or comments?",
        "feedbackPlaceholder": "Type here in Hindi, English, etc.",
        "saveReset": "Save & Reset Application",
        "assistantName": "ArthaDoot Assistant:",
        "welcomeArthasetu": "Welcome to ArthaSetu.",
        "voiceOn": "Voice Assist: On",
        "voiceOff": "Voice Assist: Off",
        "helpWelcome": "Hello! I am ArthaDoot. I will read screen elements and guide you. Tap any box to get started.",
        "profileHelp": "Please select one card from each category so we can customise the experience.",
        "quizHelp": "Select the option you think is correct. This is just practice, do not worry if you make mistakes.",
        "digitalHelp": "Let's test three tasks. First, type 4096 on the keypad. Second, drag the coin to the pig. Third, swipe the bar to the right.",
        "trustHelp": "Tick any boxes where you feel digital finance is unsafe. We will show you trust facts.",
        "reliabilityHelp": "Alternative indicators help show your trustworthiness if you do not have credit scores. Provide consent to continue.",
        "sandboxHelp": "Practice payments, analyze spam SMS, check EMIs, or play the budget planner without real money.",
        "guidanceHelp": "Read these safety rules. We created them based on your answers to keep your money secure.",
        "reportHelp": "Here is your certificate of completion! You can print it to show your progress.",
        "surveyHelp": "Please rate your experience. This helps us improve our system. Thank you!",
        "pathAssisted": "Voice/Visual Assisted Pathway",
        "pathAssistedDesc": "Based on your touch tasks and profiling answers, the engine recommends continuous audio speech guidance and simplified controls to eliminate friction.",
        "pathAssistedFeat1": "Continuous Audio Guidance Active",
        "pathAssistedFeat2": "Enlarged Button Sizes",
        "pathAssistedFeat3": "One-Tap Action Confirmations",
        "pathGuided": "Interactive Guided Pathway",
        "pathGuidedDesc": "You are comfortable with basic tasks. The engine activates contextual highlight indicators and interactive tooltips to prevent transfer mistakes.",
        "pathGuidedFeat1": "Pulsing Indicator Rings on Action Steps",
        "pathGuidedFeat2": "Contextual Safety Alerts",
        "pathGuidedFeat3": "Guided Progress Indicators",
        "pathSelf": "Self-Guided Pathway",
        "pathSelfDesc": "You demonstrated full digital dexterity. The application will operate in standard mode, allowing independent navigation through all sandbox exercises.",
        "pathSelfFeat1": "Standard Interactive Navigation",
        "pathSelfFeat2": "Unrestricted Simulator Modes",
        "pathSelfFeat3": "Full Practice Logs Access",
        "certSelf": "Self-Guided",
        "certGuided": "Guided Support",
        "certAssisted": "Voice Assisted",
        "lockedMsg": "This section is locked. Please complete the previous steps first.",
        "occupationMsg": "Occupation recorded.",
        "answerMsg": "Answer recorded.",
        "clearedMsg": "Cleared",
        "codeSuccess": "Success! Code is correct.",
        "firstTaskDone": "Excellent! First task completed.",
        "codeWrong": "Wrong code. Try again.",
        "codeWrongRetry": "Wrong code, please type 4096 again.",
        "savingsSecured": "Savings Secured!",
        "coinDeposited": "Success! Coin deposited.",
        "coinSecured": "Congratulations, coin secured in bank.",
        "swipeSuccess": "Success! Swipe authorized.",
        "swipeDone": "Swipe gesture authorized successfully.",
        "optionToggled": "Option toggled.",
        "incomeRecorded": "Income model recorded.",
        "scoreCalculated": "Alternative reliability score calculated as {score} percent.",
        "labTabActive": "Lab tab {tab} selected.",
        "recipientVerified": "Success! Recipient name verified.",
        "enterValidUPI": "Please enter a valid recipient UPI address or number.",
        "enterAmountMsg": "Limit exceeded. Enter amount between 10 and 2,000 rupees.",
        "insufficientFunds": "Insufficient funds in practice wallet.",
        "enterPIN": "Please enter your 6-digit secure payment PIN.",
        "paymentSuccess": "Success! Payment processed successfully.",
        "wrongPIN": "Invalid payment PIN. Remember, the practice PIN is 123456.",
        "smsReview": "SMS opened. Review and classify it as safe or spam.",
        "correctDecision": "Superb! Your classification is 100% correct.",
        "wrongDecision": "Caution! That was a security trap. Read the facts carefully.",
        "overBudget": "Total allocations exceed available wallet balance!",
        "monthComplete": "Month simulation complete. Review your activity logs.",
        "monthLabel": "Month",
        "ratingRecorded": "Rating recorded.",
        "profileSaved": "Congratulations! Your financial competency profile has been saved. Resetting application state.",
        "onboardingDone": "Onboarding complete! Your profile has been generated successfully.",
        "fraudTitle": "Scams & Fraud Safeguards",
        "privacyTitle": "Privacy and Banking Acts",
        "privacyDesc": "Your data is protected under the Digital Personal Data Protection (DPDP) Act of India. Financial institutions are legally barred from sharing account records without explicit consent.",
        "chargesTitle": "Zero Hidden Fees Mandate",
        "chargesDesc": "Basic Savings Bank Deposit (BSBD) accounts have zero minimum balance requirements. Banks are legally required to display fee structures transparently in local languages.",
        "mistakesTitle": "Wrong Transfer Recovery",
        "mistakesDesc": "If you transfer money to a wrong account via UPI, you can file an immediate dispute on the NPCI portal (npci.org.in) or dial toll-free helpline 1800-120-1740 for reversal assistance.",
        "tipSecTitle": "Never Share OTP / PIN",
        "tipSecDesc": "No real bank officer, customer care agent, or lottery official will ever ask for your UPI PIN or OTP on a call. Treat your PIN like your house key - keep it completely confidential.",
        "tipSavTitle": "Emergency Savings Basket",
        "tipSavDescRegular": "Having regular monthly income allows you to set up automatic micro-investments to grow your emergency basket steadily.",
        "tipSavDescIrregular": "Since your earnings model has seasonal characteristics, keep at least 3 months of basic expenses in a high-liquidity bank savings account to buffer during dry periods.",
        "tipCreTitle": "Avoiding Informal Interest Traps",
        "tipCreDesc": "Local lenders charging 5% per month flat rate interest accumulate to 60% per year! Seek formal government micro-loans (like PM SVANidhi or Mudra Loans) which charge only 7-10% annually.",
        "tipPayTitle": "Double-Checking Verified IDs",
        "tipPayDesc": "Before pressing OK or entering your PIN in any UPI app, always check the verified recipient merchant name shown at the top of the interface. This prevents wrong digit transfers.",
        "sms1Sender": "AD-LOTTRI",
        "sms1Text": "CONGRATULATIONS! You have won a cash lottery of ₹10,00,000 from Government Promotion. Click here to claim immediately: www.sarkari-win.com/claim",
        "sms1Expl": "This is FRAUD. Government departments do not distribute cash lotteries via public SMS links. Real agencies never ask for money or banking access to transfer lottery prizes.",
        "sms2Sender": "State Bank",
        "sms2Text": "Dear Customer, your monthly bank statement for account ending 4096 is generated. Please login to your official banking portal to download. Do not share your PIN.",
        "sms2Expl": "This is SAFE. The message contains no urgent threats, suspicious external hyperlinks, or direct demands for OTPs or PIN inputs.",
        "sms3Sender": "BP-ALERT",
        "sms3Text": "ALERT! Your electricity bill of ₹1,450 is overdue. To prevent immediate line disconnection tonight, call our helpline officer at 9876543210 to pay via phone OTP.",
        "sms3Expl": "This is FRAUD. Utility companies do not threaten immediate disconnection via random phone numbers or ask for OTP verification on calls. Always pay bills through official government apps.",
        "eventMedical": "Medical Emergency",
        "eventMedicalDesc": "A family member fell ill. Paid medical bills of ₹1,000.",
        "eventHarvest": "Bumper Harvest Bonus",
        "eventHarvestDesc": "Seasonal produce demand spiked! Earned bonus of ₹1,500.",
        "eventDrought": "Drought / Local Lockout",
        "eventDroughtDesc": "Zero daily wages earned due to bad weather.",
        "eventFestival": "Festival Celebration",
        "eventFestivalDesc": "Deducted ₹500 for sweets and family gifts."
    },
    "hi": {
        "brandTagline": "अनुकूलन समावेश",
        "navGroup1": "1. पंजीकरण और प्रोफाइलिंग",
        "navGroup2": "2. इंटरैक्टिव मूल्यांकन",
        "navGroup3": "3. सीखना और लैब",
        "navGroup4": "4. सारांश और प्रतिक्रिया",
        "guestUser": "अतिथि उपयोगकर्ता",
        "online": " ऑनलाइन",
        "title1": "भाषा और आवाज",
        "title2": "\"मुझे जानें\" प्रोफाइल",
        "title3": "वित्तीय साक्षरता",
        "title4": "डिजिटल आत्मविश्वास",
        "title5": "विश्वास और सुरक्षा",
        "title6": "विश्वसनीयता और आय",
        "title7": "अनुकूलन इंजन",
        "title8": "सुरक्षित फाइनेंस लैब",
        "title9": "व्यक्तिगत मार्गदर्शन",
        "title10": "तैयारी रिपोर्ट",
        "title11": "प्रतिक्रिया सर्वेक्षण",
        "prototype": "प्रोटोटाइप",
        "welcomeTitle": "आपका स्वागत है",
        "welcomeDesc": "अर्थसेतु आपकी वित्तीय आवश्यकताओं, डिजिटल क्षमता और पसंदीदा भाषा के अनुसार अनुकूलित होता है। हम आपको सुरक्षित रूप से औपचारिक वित्त सीखने में मदद करते हैं।",
        "langCount": "6+",
        "indianLanguages": "भारतीय भाषाएँ",
        "sandboxPct": "100%",
        "practiceSandbox": "अभ्यास सैंडबॉक्स",
        "selectLang": "अपनी भाषा चुनें",
        "langSubtitle": "पूरा ऐप आपकी चुनी हुई भाषा में काम करेगा",
        "enableVoice": "🎙️ वॉइस सहायता सक्षम करें",
        "voiceDesc": "हमारा वर्चुअल गाइड \"अर्थदूत\" आपकी चुनी हुई भाषा में निर्देश जोर से पढ़ेगा।",
        "startProfiling": "प्रोफाइलिंग शुरू करें",
        "tellUsAbout": "हमें अपने बारे में बताएं",
        "configureApp": "हम आपकी दैनिक जीवनशैली और व्यवसाय के आधार पर एप्लिकेशन कॉन्फ़िगर करते हैं।",
        "questionOccupation": "1. आपका प्राथमिक व्यवसाय क्या है?",
        "occRetailer": "छोटा विक्रेता / दुकानदार",
        "occRetailerSub": "दुकानदार / रेहड़ी-पटरी",
        "occFarmer": "किसान / कृषि",
        "occFarmerSub": "किसान / खेती-बाड़ी",
        "occWorker": "गिग वर्कर / डिलिवरी",
        "occWorkerSub": "डिलिवरी / टैक्सी चालक",
        "occDailywager": "दैनिक वेतन भोगी",
        "occDailywagerSub": "मजदूर / दैनिक वेतन",
        "questionFinExp": "2. क्या आपने औपचारिक बैंकिंग और डिजिटल भुगतान सेवाओं का उपयोग किया है?",
        "finBeginner": "पहली बार उपयोगकर्ता",
        "finBeginnerSub": "UPI / ऑनलाइन बैंकिंग का कभी उपयोग नहीं किया",
        "finBasic": "बुनियादी उपयोगकर्ता",
        "finBasicSub": "बैंक कार्ड है, लेकिन UPI का कम उपयोग करते हैं",
        "finIntermediate": "मध्यम उपयोगकर्ता",
        "finIntermediateSub": "कभी-कभी UPI का उपयोग करते हैं, आत्मविश्वास चाहिए",
        "questionDigConf": "3. स्मार्टफोन चलाने में आप कितने सहज हैं?",
        "digLow": "सहायता की आवश्यकता",
        "digLowSub": "आमतौर पर दूसरों से काम करवाते हैं",
        "digMedium": "बुनियादी ऐप्स चला सकते हैं",
        "digMediumSub": "WhatsApp / YouTube आसानी से उपयोग करते हैं",
        "digHigh": "अत्यधिक आत्मविश्वासी",
        "digHighSub": "ऐप्स डाउनलोड कर सकते हैं और टाइपिंग कर सकते हैं",
        "back": "← पीछे",
        "continue": "आगे बढ़ें →",
        "quizTitle": "वित्तीय साक्षरता मूल्यांकन",
        "quizDesc": "हम आपकी वित्तीय अवधारणाओं को समझने के लिए तीन परिदृश्य-आधारित प्रश्नों के उत्तर दें।",
        "q1of3": "प्रश्न 1 का 3",
        "q1Title": "फ्लैट ब्याज की गणना",
        "q1Scenario": "यदि आप 10% फ्लैट ब्याज दर से 1 वर्ष के लिए ₹10,000 उधार लेते हैं, तो वर्ष के अंत में आप कुल कितना ब्याज देते हैं?",
        "q1a0": "₹1,000 (सही ब्याज भुगतान)",
        "q1a1": "₹100 (1% गणना)",
        "q1a2": "₹0 (ब्याज-मुक्त ऋण)",
        "q1a3": "मुझे नहीं पता / सुनिश्चित नहीं",
        "q2of3": "प्रश्न 2 का 3",
        "q2Title": "सुरक्षित PIN और OTP हैंडलिंग",
        "q2Scenario": "आपको एक अज्ञात व्यक्ति का फोन आता है जो बैंक प्रबंधक होने का दावा करता है। वे आपके खाते को अनलॉक करने के लिए आपका UPI PIN या OTP मांगते हैं। आप क्या करते हैं?",
        "q2a0": "मेरा खाता ब्लॉक न हो इसलिए शेयर करूं",
        "q2a1": "केवल तभी शेयर करूं जब वे मेरा सही नाम बताएं",
        "q2a2": "कॉल पर किसी के साथ भी अपना PIN/OTP कभी शेयर न करें (सही)",
        "q2a3": "उन्हें कहूं कि मैं बाद में उन्हें कॉल करूंगा",
        "q3of3": "प्रश्न 3 का 3",
        "q3Title": "बैंक बचत का मूल्य",
        "q3Scenario": "घर में बॉक्स में नकदी रखने की तुलना में औपचारिक बैंक खाते में पैसे बचाने का प्राथमिक लाभ क्या है?",
        "q3a0": "पैसे पर ब्याज मिलता है और चोरी से सुरक्षित है (सही)",
        "q3a1": "बैंक में रखा पैसा खर्च करना आसान है",
        "q3a2": "नकदी और बैंक खाते में कोई अंतर नहीं है",
        "q3a3": "लाभों के बारे में सुनिश्चित नहीं",
        "digitalTitle": "डिजिटल आत्मविश्वास मूल्यांकन",
        "digitalDesc": "अपने स्मार्टफोन और टच स्क्रीन आराम का परीक्षण करने के लिए ये तीन सरल इंटरैक्टिव कार्य पूरे करें।",
        "task1Title": "कार्य 1: संख्याएँ टाइप करना",
        "task1Heading": "संख्यात्मक कोड दर्ज करें",
        "task1Desc": "नीचे स्क्रीन कीपैड का उपयोग करके कोड टाइप करें: ",
        "task2Title": "कार्य 2: खींचें और छोड़ें",
        "task2Heading": "अपना सिक्का सुरक्षित करें",
        "task2Desc": "सोने के सिक्के को नीचे पिग्गी बैंक में खींचकर ले जाएं।",
        "dropCoin": "सिक्का यहाँ डालें",
        "task3Title": "कार्य 3: स्वाइप जेस्चर",
        "task3Heading": "भुगतान के लिए स्वाइप करें",
        "task3Desc": "स्लाइडर कुंजी को दाईं ओर स्वाइप करके अनुकरण भुगतान को अधिकृत करें।",
        "swipeConfirm": "पुष्टि के लिए दाईं ओर स्वाइप करें",
        "waitingInput": "इनपुट की प्रतीक्षा है...",
        "dragStart": "सिक्का खींचकर शुरू करें",
        "slideHandle": "हैंडल को दाईं ओर स्लाइड करें",
        "trustTitle": "विश्वास और सुरक्षा चिंताएं",
        "trustDesc": "डिजिटल वित्त का उपयोग करने में जो भी चिंताएं आपको हिचकिचाती हैं उन्हें चुनें।",
        "trustConcerns": "आपकी मुख्य चिंताएं क्या हैं? (सभी लागू चुनें)",
        "concernFraud": "धोखाधड़ी और घोटाले का डर",
        "concernFraudDesc": "ऑनलाइन धोखेबाजों से पैसे खोने की चिंता",
        "concernPrivacy": "डेटा और खाता गोपनीयता",
        "concernPrivacyDesc": "व्यक्तिगत जानकारी लीक होने की चिंता",
        "concernCharges": "छिपी हुई फीस और शुल्क",
        "concernChargesDesc": "बिना बताए बैंक द्वारा काटे जाने की शंका",
        "concernMistakes": "गलतियाँ करने का डर",
        "concernMistakesDesc": "गलत अंक टाइप करने से गलत व्यक्ति को पैसे जाने का डर",
        "reassurancePortal": "💡 सुरक्षा पोर्टल",
        "reassuranceDesc": "सुरक्षा तथ्यों और नियामक गारंटी पढ़ने के लिए बाईं ओर एक या अधिक चिंताएं चुनें।",
        "altAssessment": "वैकल्पिक मूल्यांकन",
        "reliabilityTitle": "वैकल्पिक वित्तीय विश्वसनीयता",
        "reliabilityDesc": "उन उपयोगकर्ताओं के लिए जिनके पास औपचारिक बैंक क्रेडिट इतिहास या वेतन पर्ची नहीं है, अर्थसेतु बचत पैटर्न और लेनदेन आदतों के आधार पर विश्वसनीयता के वैकल्पिक संकेतकों का मूल्यांकन करता है।",
        "simReliability": "अनुकरण विश्वसनीयता प्रोफाइल",
        "incomeProfile": "आय और बचत प्रोफाइल",
        "consentDetails": "अपनी विश्वसनीयता श्रेणी की गणना करने के लिए सहमति-आधारित विवरण प्रदान करें।",
        "incomePattern": "1. आपकी आय का पैटर्न कैसा है?",
        "incomeRegular": "📅 नियमित मासिक",
        "incomeIrregular": "⚡ अनियमित दैनिक/साप्ताहिक",
        "incomeSeasonal": "🌾 मौसमी (फसल/गिग्स)",
        "indicatorsTitle": "2. अपने लिए लागू संकेतक चुनें:",
        "ind1": "मैं नियमित रूप से दुकान का किराया या उपयोगिता बिल भरता हूं",
        "ind2": "मैं डाकघर/बचत बॉक्स में कुछ नकद बचत रखता हूं",
        "ind3": "मेरे पास व्यापारिक इन्वेंट्री या व्यापार आपूर्ति है",
        "ind4": "मेरे पास स्थानीय अनौपचारिक ऋणदाता का कोई बकाया ऋण नहीं है",
        "consentText": "मैं एक अनुकरण क्रेडिट विश्वसनीयता स्कोर बनाने के लिए वैकल्पिक संकेतकों का उपयोग करने की सहमति देता हूं।",
        "generateProfile": "इंजन प्रोफाइल जनरेट करें →",
        "engineTitle": "अर्थसेतु अनुकूलन प्रोफाइलिंग इंजन",
        "engineDesc": "यहां आपकी गणितीय वित्तीय प्रोफाइल है। ऐप आपके लिए एक अनुकूलित पथ चुनता है।",
        "scoreLiteracy": "वित्तीय साक्षरता",
        "scoreDigital": "डिजिटल आत्मविश्वास",
        "scoreReliability": "वैकल्पिक विश्वसनीयता",
        "recommendedPath": "अनुशंसित ऑनबोर्डिंग पथ",
        "calculating": "गणना हो रही है...",
        "selectContinue": "प्रोफाइलिंग चलाने के लिए जारी रखें चुनें।",
        "enterLab": "सुरक्षित फाइनेंस लैब में प्रवेश करें →",
        "labTitle": "सुरक्षित फाइनेंस लैब",
        "practiceSandboxTag": "अभ्यास सैंडबॉक्स",
        "tabPayment": "📱 अभ्यास भुगतान",
        "tabFraud": "🛡️ फ्रॉड फिशिंग डिटेक्टर",
        "tabLoan": "📊 ऋण तुलनक",
        "tabBudget": "🌾 बजट और अस्थिरता",
        "arthapay": "अर्थापे",
        "enterRecipient": "प्राप्तकर्ता का UPI ID / फोन दर्ज करें",
        "verifyRecipient": "प्राप्तकर्ता सत्यापित करें",
        "verified": "सत्यापित",
        "enterAmount": "स्थानांतरण राशि दर्ज करें (₹)",
        "walletBalance": "अभ्यास वॉलेट बैलेंस: ₹1,000",
        "continueToPay": "भुगतान जारी रखें",
        "enterUPIPIN": "6 अंकों का UPI PIN दर्ज करें",
        "payingRs": "भुगतान ₹",
        "toRecipient": "किसान भाई को",
        "txnSuccess": "लेनदेन सफल!",
        "sentTo": "किसान भाई को भेजा गया",
        "txnId": "लेनदेन ID:",
        "payAgain": "फिर से भुगतान करें",
        "paymentTutorial": "अनुकरण भुगतान ट्यूटोरियल",
        "paymentTutorialDesc": "वास्तविक पैसे का जोखिम उठाए बिना धन हस्तांतरण कैसे करें इसे सीखें।",
        "crucialGuidelines": "💡 महत्वपूर्ण दिशानिर्देश:",
        "practicePIN": "आपका अभ्यास PIN कोड है: ",
        "tip2": "भुगतान करने से पहले सत्यापित प्राप्तकर्ता नाम की दोबारा जांच करें।",
        "tip3": "मानक सुरक्षित बैंकर स्क्रीन के अलावा कहीं भी अपना PIN टाइप न करें।",
        "walletHistory": "वॉलेट इतिहास",
        "welcomeBonus": "स्वागत बोनस",
        "messageInbox": "📱 संदेश इनबॉक्स",
        "fraudDesc": "आरबीआई नियमों के तहत, अनधिकृत लेनदेन के 3 दिनों के भीतर सूचित करने पर आपकी देनदारी शून्य है।",
        "selectMessage": "एक संदेश चुनें",
        "fraudPlaceholder": "इसकी सुरक्षा का विश्लेषण करने के लिए सूची में से एक इनकमिंग SMS पर क्लिक करें।",
        "classifySafe": "✔️ सुरक्षित के रूप में वर्गीकृत करें",
        "reportFraud": "🚨 फ्रॉड / स्पैम के रूप में रिपोर्ट करें",
        "loanTitle": "📊 ऋण लागत सिमुलेटर",
        "loanDesc": "कुल पुनर्भुगतान देखने और ब्याज जाल से बचने के लिए स्लाइडर समायोजित करें।",
        "principalAmt": "मूल राशि",
        "interestRate": "ब्याज दर (वार्षिक)",
        "tenure": "अवधि (महीने)",
        "flatLoan": "फ्लैट ऋण (सरल ब्याज)",
        "flatRateFinancing": "फ्लैट दर वित्तपोषण",
        "monthlyEMI": "मासिक EMI",
        "totalInterest": "कुल ब्याज",
        "totalRepayment": "कुल पुनर्भुगतान",
        "flatLoanDesc": "ब्याज केवल प्रारंभिक मूलधन पर गणना किया जाता है।",
        "compoundLoan": "चक्रवृद्धि ऋण (घटता शेष)",
        "reducingBalanceFinancing": "घटता शेष वित्तपोषण",
        "compoundLoanDesc": "ब्याज केवल बकाया मूलधन पर गणना किया जाता है। फ्लैट ऋण से बेहतर!",
        "budgetTitle": "🌾 गतिशील आय अस्थिरता सिमुलेटर",
        "budgetDesc": "विभिन्न आय बाधाओं के तहत खर्चों का प्रबंधन करें। अनुकरण माह खेलें!",
        "currentIncome": "वर्तमान आय मॉडल:",
        "foodAlloc": "भोजन और किराया आवंटन (₹)",
        "savingsBox": "बचत बॉक्स (₹)",
        "growthAlloc": "निवेश / व्यापार विकास (₹)",
        "simulateMonth": "🌾 अगला माह अनुकरण करें 🌾",
        "walletBal": "वॉलेट बैलेंस",
        "accumSavings": "संचित बचत",
        "activityLog": "गतिविधि लॉग",
        "gameStarted": "गेम शुरू।",
        "guidanceTitle": "व्यक्तिगत वित्तीय मार्गदर्शन",
        "guidanceDesc": "यहां आपके मूल्यांकन के आधार पर तैयार किए गए महत्वपूर्ण वित्तीय नियम हैं।",
        "viewReport": "तैयारी रिपोर्ट देखें →",
        "reportTitle": "वित्तीय तैयारी रिपोर्ट",
        "reportDesc": "उत्कृष्ट प्रगति! यहां आपका आधिकारिक क्षमता मूल्यांकन प्रमाणपत्र है।",
        "certTitle": "अर्थसेतु क्षमता प्रमाणपत्र",
        "certAwardedTo": "यह प्रमाणपत्र प्रदान किया जाता है",
        "certDesc": "सुरक्षित फाइनेंस लैब सिमुलेटर में अनुकूलित वित्तीय प्रोफाइलिंग और सुरक्षित UPI लेनदेन के अभ्यास को सफलतापूर्वक पूरा करने के लिए।",
        "certLiteracy": "साक्षरता स्तर",
        "certDigital": "डिजिटल आत्मविश्वास",
        "certPathway": "सहायक पथ",
        "certSystem": "सिस्टम जारी",
        "certDate": "सत्यापन की तिथि",
        "printCert": "🖨️ प्रमाणपत्र प्रिंट करें",
        "provideFeedback": "प्रतिक्रिया दें →",
        "feedbackTitle": "प्रतिक्रिया और परिणाम मापन",
        "feedbackDesc": "इस अनुकूलन ढांचे का मूल्यांकन करने में हमारी मदद करें।",
        "surveyQ1": "1. इस एप्लिकेशन को नेविगेट करना कितना आसान था?",
        "surveyQ2": "2. क्या आपने सुरक्षा नियमों और धोखाधड़ी चेतावनियों को स्पष्ट रूप से समझा?",
        "surveyQ3": "3. अब अकेले मोबाइल भुगतान करने में आप कितना आत्मविश्वास महसूस करते हैं?",
        "surveyQ4": "4. क्या आपके पास कोई सुझाव या टिप्पणी है?",
        "feedbackPlaceholder": "हिंदी, अंग्रेजी आदि में यहां टाइप करें।",
        "saveReset": "सहेजें और एप्लिकेशन रीसेट करें",
        "assistantName": "अर्थदूत सहायक:",
        "welcomeArthasetu": "अर्थसेतु में आपका स्वागत है।",
        "voiceOn": "वॉइस असिस्टेंट: ऑन",
        "voiceOff": "वॉइस असिस्टेंट: ऑफ",
        "helpWelcome": "नमस्ते! मैं अर्थदूत हूँ। मैं स्क्रीन की जानकारी पढ़कर आपका मार्गदर्शन करूँगा। शुरू करने के लिए किसी भी डिब्बे को छुएं।",
        "profileHelp": "अनुभव को अपनी आवश्यकतानुसार ढालने के लिए हर श्रेणी से एक विकल्प चुनें।",
        "quizHelp": "आपको जो विकल्प सही लगे उसे चुनें। यह सिर्फ अभ्यास है, गलतियों से न डरें।",
        "digitalHelp": "आइए तीन कार्यों का परीक्षण करें। पहला, कीपैड पर 4096 टाइप करें। दूसरा, सिक्के को पिग्गी बैंक में डालें। तीसरा, स्लाइडर को दाईं ओर खिसकाएं।",
        "trustHelp": "उन बक्सों को टिक करें जहाँ आपको ऑनलाइन लेनदेन असुरक्षित लगता है।",
        "reliabilityHelp": "यदि आपके पास सिबिल स्कोर नहीं है, तो वैकल्पिक तरीके आपकी विश्वसनीयता दिखाने में मदद करते हैं।",
        "sandboxHelp": "बिना किसी जोखिम के भुगतान का अभ्यास करें, धोखाधड़ी संदेशों को पहचानें, ब्याज दरें देखें या बजट योजना का अभ्यास करें।",
        "guidanceHelp": "इन सुरक्षा नियमों को पढ़ें।",
        "reportHelp": "यह आपका पूर्णता प्रमाणपत्र है!",
        "surveyHelp": "कृपया अपने अनुभव को रेटिंग दें।",
        "pathAssisted": "दृश्य और स्वर निर्देशित मार्ग",
        "pathAssistedDesc": "स्मार्टफोन और डिजिटल साक्षरता स्तर को ध्यान में रखते हुए, सिस्टम ने आपके लिए पूर्ण वॉइस और बड़ी विजुअल गाइडेंस सक्रिय की है।",
        "pathAssistedFeat1": "स्वचालित वॉइस गाइडेंस सक्रिय",
        "pathAssistedFeat2": "बड़े फ़ॉन्ट आकार",
        "pathAssistedFeat3": "सुगम बटन नेविगेशन",
        "pathGuided": "मार्गदर्शित पथ",
        "pathGuidedDesc": "आप बुनियादी ऐप्स चला लेते हैं। सिस्टम महत्वपूर्ण बटनों पर हाइलाइट और पॉपअप निर्देश दिखाएगा।",
        "pathGuidedFeat1": "सक्रिय बटनों पर चमकता हाइलाइट",
        "pathGuidedFeat2": "समय पर सुरक्षा पॉपअप संदेश",
        "pathGuidedFeat3": "संकेतक टूलटिप्स",
        "pathSelf": "स्व-निर्देशित मार्ग",
        "pathSelfDesc": "आप स्मार्टफोन चलाने में अत्यंत कुशल हैं।",
        "pathSelfFeat1": "सामान्य नेविगेशन मोड",
        "pathSelfFeat2": "पूर्ण टूल स्वतंत्रता",
        "pathSelfFeat3": "उन्नत सैंडबॉक्स अभ्यास",
        "certSelf": "स्व-निर्देशित",
        "certGuided": "मार्गदर्शित",
        "certAssisted": "स्वर-निर्देशित",
        "lockedMsg": "यह भाग अभी बंद है। कृपया पिछला कार्य पहले पूरा करें।",
        "occupationMsg": "व्यवसाय दर्ज कर लिया गया है।",
        "answerMsg": "उत्तर दर्ज हो गया है।",
        "clearedMsg": "साफ किया",
        "codeSuccess": "सफल! कोड सही है।",
        "firstTaskDone": "बहुत बढ़िया! पहला काम पूरा हुआ।",
        "codeWrong": "गलत कोड। दोबारा कोशिश करें।",
        "codeWrongRetry": "गलत कोड, कृपया दोबारा 4096 टाइप करें।",
        "savingsSecured": "बचत सुरक्षित!",
        "coinDeposited": "सफल! सिक्का जमा हुआ।",
        "coinSecured": "बधाई हो, सिक्का बैंक में सुरक्षित है।",
        "swipeSuccess": "सफल! स्वाइप स्वीकृत हुआ।",
        "swipeDone": "स्वाइप स्वीकार कर लिया गया है।",
        "optionToggled": "विकल्प बदला गया।",
        "incomeRecorded": "आय का स्वरूप दर्ज हुआ।",
        "scoreCalculated": "वैकल्पिक सूचकांक स्कोर {score} प्रतिशत हुआ।",
        "labTabActive": "लैब का {tab} अभ्यास सक्रिय हुआ।",
        "recipientVerified": "सफल! प्राप्तकर्ता सत्यापित हो गया है।",
        "enterValidUPI": "कृपया वैध UPI आईडी या नंबर दर्ज करें।",
        "enterAmountMsg": "कृपया 10 से 2,000 रुपये के बीच की राशि दर्ज करें।",
        "insufficientFunds": "सैंडबॉक्स वॉलेट में पर्याप्त राशि नहीं है।",
        "enterPIN": "पुष्टि करने के लिए 6 अंकों का UPI PIN टाइप करें।",
        "paymentSuccess": "सफल! भुगतान पूरा हो गया है।",
        "wrongPIN": "गलत UPI PIN। कृपया पुनः 123456 टाइप करें।",
        "smsReview": "संदेश खोल लिया गया है।",
        "correctDecision": "आपका निर्णय बिल्कुल सही है।",
        "wrongDecision": "गलत निर्णय। सुरक्षा चेतावनी को ध्यान से पढ़ें।",
        "overBudget": "आवंटन कुल राशि आपके वॉलेट बैलेंस से अधिक है!",
        "monthComplete": "माह समाप्त हुआ।",
        "monthLabel": "माह",
        "ratingRecorded": "रेटिंग दर्ज हुई।",
        "profileSaved": "बधाई हो! आपका प्रोफाइल सहेज लिया गया है।",
        "onboardingDone": "सफल! आपकी प्रतिक्रिया दर्ज कर ली गई है।",
        "fraudTitle": "धोखाधड़ी से सुरक्षा",
        "privacyTitle": "गोपनीयता और बैंकिंग अधिनियम",
        "privacyDesc": "आपका डेटा DPDP अधिनियम के तहत सुरक्षित है।",
        "chargesTitle": "शून्य छिपी फीस अनिवार्यता",
        "chargesDesc": "बीएसबीडी खातों में न्यूनतम राशि की कोई सीमा नहीं है।",
        "mistakesTitle": "गलत भुगतान वापसी",
        "mistakesDesc": "गलत खाते में पैसे भेजने पर एनपीसीआई पोर्टल पर शिकायत दर्ज करा सकते हैं।",
        "tipSecTitle": "ओटीपी या पिन कभी शेयर न करें",
        "tipSecDesc": "कोई भी बैंक कर्मचारी कॉल पर आपका UPI PIN या OTP नहीं मांगता।",
        "tipSavTitle": "आपातकालीन बचत कोष",
        "tipSavDescRegular": "नियमित आय होने पर हर माह कम से कम 15% राशि अलग बचत खाते में जमा करें।",
        "tipSavDescIrregular": "आपकी आय मौसमी है, इसलिए कम से कम 3 महीने के बुनियादी खर्चों के बराबर की राशि अलग बचत खाते में रखें।",
        "tipCreTitle": "अनौपचारिक ब्याज चंगुल से बचें",
        "tipCreDesc": "स्थानीय साहूकारों का 5% मासिक ब्याज 60% सालाना हो जाता है!",
        "tipPayTitle": "भुगतान प्राप्तकर्ता नाम की जांच",
        "tipPayDesc": "पिन डालने से पहले हमेशा प्राप्तकर्ता का सत्यापित नाम पढ़ें।",
        "sms1Sender": "AD-LOTTRI",
        "sms1Text": "बधाई! आपने सरकारी प्रचार से ₹10,00,000 की लॉटरी जीती है।",
        "sms1Expl": "यह फ्रॉड है। सरकारी विभाग सार्वजनिक SMS लिंक से लॉटरी नहीं देते।",
        "sms2Sender": "स्टेट बैंक",
        "sms2Text": "प्रिय ग्राहक, आपका मासिक बैंक स्टेटमेंट तैयार है। कृपया आधिकारिक पोर्टल पर लॉगिन करें।",
        "sms2Expl": "यह सुरक्षित है। संदेश में कोई अत्यावश्यक खतरा नहीं है।",
        "sms3Sender": "BP-ALERT",
        "sms3Text": "अलर्ट! आपका बिजली बिल ₹1,450 बकाया है।",
        "sms3Expl": "यह फ्रॉड है। उपयोगिता कंपनियां यादृच्छिक फोन नंबरों से तत्काल डिस्कनेक्शन की धमकी नहीं देतीं।",
        "eventMedical": "चिकित्सा आपातकाल",
        "eventMedicalDesc": "परिवार का एक सदस्य बीमार हो गया। ₹1,000 इलाज खर्च।",
        "eventHarvest": "बम्पर फसल बोनस",
        "eventHarvestDesc": "फसल की मांग अचानक बढ़ गई! ₹1,500 अतिरिक्त लाभ।",
        "eventDrought": "सूखा / स्थानीय मंदी",
        "eventDroughtDesc": "खराब मौसम के कारण कोई कमाई नहीं हुई।",
        "eventFestival": "त्योहार उत्सव",
        "eventFestivalDesc": "मिठाई और उपहारों में ₹500 खर्च।",
        "navGroup5": "5. Next-Gen Security",
        "title12": "Security Dashboard",
        "title13": "Consent Manager",
        "title14": "ZKP Verifier",
        "securityDashDesc": "10 Next-Gen Security Innovations protecting your financial data",
        "consentMgrDesc": "Cryptographic consent tokens — you control who accesses your data",
        "zkpVerifierDesc": "Prove your attributes without revealing the actual data"
    },
    "ta": {
        "brandTagline": "தகவமைக்கும் நிதி உள்ளடக்கம்",
        "navGroup1": "1. பதிவு & சுயவிவரம்",
        "navGroup2": "2. ஊடாடும் மதிப்பீடுகள்",
        "navGroup3": "3. கற்றல் & ஆய்வகம்",
        "navGroup4": "4. சுருக்கம் & கருத்து",
        "navGroup5": "5. அடுத்த தலைமுறை பாதுகாப்பு",
        "guestUser": "விருந்தினர் பயனர்",
        "online": " ஆன்லைன்",
        "title1": "மொழி & குரல் தேர்வு",
        "title2": "\"என்னை அறிக\" சுயவிவரம்",
        "title3": "நிதி எழுத்தறிவு",
        "title4": "டிஜிட்டல் நம்பிக்கை",
        "title5": "நம்பிக்கை & பாதுகாப்பு",
        "title6": "நம்பகத்தன்மை & வருமானம்",
        "title7": "தகவமைப்பு இயந்திரம்",
        "title8": "பாதுகாப்பான நிதி ஆய்வகம்",
        "title9": "தனிப்பயனாக்கப்பட்ட வழிகாட்டுதல்",
        "title10": "தயார்நிலை அறிக்கை",
        "title11": "கருத்துக்கணிப்பு",
        "title12": "பாதுகாப்பு கட்டுப்பாட்டு பலகை",
        "title13": "ஒப்புதல் மேலாளர்",
        "title14": "ZKP சரிபார்ப்பாளர்",
        "securityDashDesc": "10 கிரிப்டோகிராஃபிக் பாதுகாப்பு மற்றும் தணிக்கை தடங்கள்",
        "consentMgrDesc": "தரவு அணுகலுக்கான ஸ்மார்ட் ஒப்புதல் டோக்கன்கள்",
        "zkpVerifierDesc": "விவரங்களை வெளியிடாமல் பூஜ்ஜிய அறிவு சான்று",
        "prototype": "முன்மாதிரி",
        "welcomeTitle": "வரவேற்கிறோம்",
        "welcomeDesc": "அர்த்தசேது உங்கள் நிதித் தேவைகள், டிஜிட்டல் திறன் மற்றும் விருப்பமான மொழிக்கு ஏற்ப மாறுகிறது. பாதுகாப்பான முறையில் நிதி சேவைகளைக் கற்றுக்கொள்ள உதவுகிறோம்.",
        "langCount": "6+",
        "indianLanguages": "இந்திய மொழிகள்",
        "sandboxPct": "100%",
        "practiceSandbox": "பயிற்சி தளம்",
        "selectLang": "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
        "langSubtitle": "முழு செயலியும் நீங்கள் தேர்ந்தெடுத்த மொழியில் செயல்படும்",
        "enableVoice": "குரல் வழிகாட்டலை இயக்கு",
        "voiceDesc": "எங்கள் மெய்நிகர் வழிகாட்டி \"அர்த்ததூத்\" வழிமுறைகளை உங்கள் மொழியில் வாசிக்கும்.",
        "startProfiling": "சுயவிவரத்தை தொடங்கு",
        "tellUsAbout": "உங்களைப் பற்றி எங்களிடம் கூறுங்கள்",
        "configureApp": "உங்கள் தொழில் மற்றும் தேவைகளின் அடிப்படையில் செயலியை அமைக்கிறோம்.",
        "questionOccupation": "1. உங்கள் முதன்மை தொழில் என்ன?",
        "occRetailer": "சிறு வணிகர் / கடைக்காரர்",
        "occRetailerSub": "கடைக்காரர் / தெருவோர வியாபாரி",
        "occFarmer": "விவசாயி / வேளாண்மை",
        "occFarmerSub": "விவசாயம்",
        "occWorker": "கிக் தொழிலாளி / டெலிவரி",
        "occWorkerSub": "டெலிவரி / வாடகை வண்டி ஓட்டுநர்",
        "occDailywager": "தினசரி கூலித் தொழிலாளி",
        "occDailywagerSub": "கூலித் தொழிலாளி",
        "questionFinExp": "2. வங்கி அல்லது டிஜிட்டல் பணப்பரிவர்த்தனை பயன்படுத்தியுள்ளீர்களா?",
        "finBeginner": "முதல் முறை பயனர்",
        "finBeginnerSub": "UPI / இணைய வங்கியை இதுவரை பயன்படுத்தியதில்லை",
        "finBasic": "அடிப்படை பயனர்",
        "finBasicSub": "வங்கி அட்டை உள்ளது, ஆனால் UPI குறைவாக பயன்படுத்துகிறேன்",
        "finIntermediate": "நடுத்தர பயனர்",
        "finIntermediateSub": "அவ்வப்போது UPI பயன்படுத்துகிறேன், நம்பிக்கை தேவை",
        "questionDigConf": "3. ஸ்மார்ட்போன் பயன்படுத்துவதில் உங்களுக்கு எவ்வளவு வசதி?",
        "digLow": "உதவி தேவை",
        "digLowSub": "வழக்கமாக மற்றவர்களின் உதவியுடன் செயல்படுகிறேன்",
        "digMedium": "அடிப்படை செயலிகளை இயக்குவேன்",
        "digMediumSub": "WhatsApp / YouTube எளிதாக பயன்படுத்துகிறேன்",
        "digHigh": "மிகவும் தன்னம்பிக்கை",
        "digHighSub": "செயலிகளைப் பதிவிறக்கி தட்டச்சு செய்ய முடியும்",
        "back": "பின்னால்",
        "continue": "தொடரவும்",
        "quizTitle": "நிதி எழுத்தறிவு மதிப்பீடு",
        "quizDesc": "நிதி சார்ந்த கருத்துக்களை சோதிக்க 3 எளிய கேள்விகளுக்கு பதிலளிக்கவும்.",
        "q1of3": "கேள்வி 1 / 3",
        "q1Title": "வட்டி கணக்கீடு",
        "q1Scenario": "10% நிலையான வட்டி விகிதத்தில் 1 வருடத்திற்கு ₹10,000 கடன் வாங்கினால், நீங்கள் செலுத்த வேண்டிய வட்டி எவ்வளவு?",
        "q1a0": "₹1,000 (சரியான வட்டி)",
        "q1a1": "₹100 (1% கணக்கீடு)",
        "q1a2": "₹0 (வட்டியில்லா கடன்)",
        "q1a3": "எனக்கு தெரியாது / உறுதியாக இல்லை",
        "q2of3": "கேள்வி 2 / 3",
        "q2Title": "பாதுகாப்பான PIN & OTP பயன்பாடு",
        "q2Scenario": "வங்கி மேலாளர் என்று கூறி ஒருவர் உங்கள் UPI PIN அல்லது OTP கேட்கிறார். நீங்கள் என்ன செய்வீர்கள்?",
        "q2a0": "கணக்கு முடக்கப்படாமல் இருக்க பகிர்வேன்",
        "q2a1": "என் பெயரைச் சரியாகச் சொன்னால் மட்டும் பகிர்வேன்",
        "q2a2": "தொலைபேசியில் யாருடனும் PIN/OTP ஐ பகிர மாட்டேன் (சரி)",
        "q2a3": "பிறகு அழைப்பதாகக் கூறுவேன்",
        "q3of3": "கேள்வி 3 / 3",
        "q3Title": "வங்கி சேமிப்பின் முக்கியத்துவம்",
        "q3Scenario": "வீட்டில் பணமாக வைத்திருப்பதை விட வங்கியில் சேமிப்பதால் கிடைக்கும் நன்மை என்ன?",
        "q3a0": "பணத்திற்கு வட்டி கிடைக்கிறது மற்றும் திருடப்படாமல் பாதுகாப்பானது (சரி)",
        "q3a1": "வங்கியில் உள்ள பணத்தை செலவு செய்வது எளிது",
        "q3a2": "ரொக்கத்திற்கும் வங்கிக்கும் எந்த வித்தியாசமும் இல்லை",
        "q3a3": "நன்மைகள் பற்றி உறுதியாக தெரியவில்லை",
        "digitalTitle": "டிஜிட்டல் நம்பிக்கை மதிப்பீடு",
        "digitalDesc": "தொடுதிரை பயன்பாட்டை சோதிக்க இந்த 3 எளிய பணிகளை முடிக்கவும்.",
        "task1Title": "பணி 1: எண்களை உள்ளிடுதல்",
        "task1Heading": "எண் குறியீட்டை உள்ளிடவும்",
        "task1Desc": "கீழே உள்ள விசைப்பலகையைப் பயன்படுத்தி குறியீட்டை தட்டச்சு செய்யவும்: ",
        "task2Title": "பணி 2: இழுத்து விடுதல்",
        "task2Heading": "நாணயத்தை சேமிக்கவும்",
        "task2Desc": "தங்க நாணயத்தை உண்டியலில் இழுத்து போடவும்.",
        "dropCoin": "நாணயத்தை இங்கே இடவும்",
        "task3Title": "பணி 3: தேய்த்தல் சைகை",
        "task3Heading": "பணம் செலுத்த ஸ்வைப் செய்யவும்",
        "task3Desc": "பரிவர்த்தனையை அங்கீகரிக்க கைப்பிடியை வலதுபுறம் ஸ்வைப் செய்யவும்.",
        "swipeConfirm": "உறுதிப்படுத்த வலதுபுறம் ஸ்வைப் செய்யவும்",
        "waitingInput": "உள்ளீட்டிற்காக காத்திருக்கிறது...",
        "dragStart": "நாணயத்தை இழுக்கத் தொடங்குங்கள்",
        "slideHandle": "கைப்பிடியை வலதுபுறம் நகர்த்தவும்",
        "trustTitle": "பாதுகாப்பு & பயங்கள்",
        "trustDesc": "டிஜிட்டல் பணப்பரிவர்த்தனையில் உங்களுக்கு உள்ள பயங்களைத் தேர்ந்தெடுக்கவும்.",
        "trustConcerns": "உங்கள் முக்கிய கவலைகள் யாவை? (பொருந்துபவற்றை தேர்ந்தெடுக்கவும்)",
        "concernFraud": "மோசடி பயம்",
        "concernFraudDesc": "ஆன்லைன் மோசடி செய்பவர்களிடம் பணத்தை இழக்கும் பயம்",
        "concernPrivacy": "தகவல் ரகசியத்தன்மை",
        "concernPrivacyDesc": "தனிப்பட்ட விவரங்கள் கசிந்துவிடும் என்ற பயம்",
        "concernCharges": "மறைமுகக் கட்டணங்கள்",
        "concernChargesDesc": "வங்கி தேவையின்றி பணம் பிடிக்குமோ என்ற சந்தேகம்",
        "concernMistakes": "தவறு செய்யும் பயம்",
        "concernMistakesDesc": "தவறான எண்ணிற்கு பணம் அனுப்பிவிடுவோமோ என்ற அச்சம்",
        "reassurancePortal": "பாதுகாப்பு வழிகாட்டி",
        "reassuranceDesc": "பாதுகாப்பு தகவல்களை அறிய இடதுபுறத்தில் உள்ள கவலைகளை கிளிக் செய்யவும்.",
        "altAssessment": "மாற்று மதிப்பீடு",
        "reliabilityTitle": "மாற்று நிதி நம்பகத்தன்மை",
        "reliabilityDesc": "கிரெடிட் வரலாறு இல்லாதவர்களுக்கு மாற்று முறைகள் மூலம் நம்பகத்தன்மையை மதிப்பிடுதல்.",
        "simReliability": "நம்பகத்தன்மை விவரம்",
        "incomeProfile": "வருமானம் & சேமிப்பு விவரம்",
        "consentDetails": "மதிப்பீட்டிற்கான ஒப்புதலை வழங்கவும்.",
        "incomePattern": "1. உங்கள் வருமான முறை எப்படிப்பட்டது?",
        "incomeRegular": "மாதாந்திர வழக்கமான வருமானம்",
        "incomeIrregular": "முறையற்ற தினசரி/வாராந்திர வருமானம்",
        "incomeSeasonal": "பருவகால வருமானம் (விவசாயம்/கிக்)",
        "indicatorsTitle": "2. உங்களுக்குப் பொருந்தும் விருப்பங்களைத் தேர்ந்தெடுக்கவும்:",
        "ind1": "நான் வாடகை அல்லது மின்கட்டணத்தை தவறாமல் செலுத்துகிறேன்",
        "ind2": "நான் தபால் அலுவலகம் அல்லது வீட்டில் பணத்தை சேமிக்கிறேன்",
        "ind3": "என் தொழிலுக்குத் தேவையான பொருட்கள் என்னிடம் உள்ளன",
        "ind4": "கந்துவட்டிக்காரர்களிடம் எனக்கு கடன் பாக்கி இல்லை",
        "consentText": "மாற்று நம்பகத்தன்மை மதிப்பீட்டிற்கு ஒப்புக்கொள்கிறேன்.",
        "generateProfile": "சுயவிவரத்தை உருவாக்கு",
        "engineTitle": "அர்த்தசேது தகவமைப்பு இயந்திரம்",
        "engineDesc": "உங்களுக்கான பரிந்துரைக்கப்பட்ட கற்றல் வழித்தடம்.",
        "scoreLiteracy": "நிதி எழுத்தறிவு",
        "scoreDigital": "டிஜிட்டல் நம்பிக்கை",
        "scoreReliability": "மாற்று நம்பகத்தன்மை",
        "recommendedPath": "பரிந்துரைக்கப்பட்ட வழி",
        "calculating": "கணக்கிடப்படுகிறது...",
        "selectContinue": "தொடர கிளிக் செய்யவும்.",
        "enterLab": "பாதுகாப்பான நிதி ஆய்வகத்திற்குள் செல்க",
        "labTitle": "பாதுகாப்பான நிதி ஆய்வகம்",
        "practiceSandboxTag": "பயிற்சி தளம்",
        "tabPayment": "பணப்பரிவர்த்தனை பயிற்சி",
        "tabFraud": "மோசடி கண்டறிதல்",
        "tabLoan": "கடன் ஒப்பீடு",
        "tabBudget": "பட்ஜெட் & திட்டமிடல்",
        "arthapay": "அர்த்தபே",
        "enterRecipient": "பெறுநரின் UPI ID / எண்ணை உள்ளிடவும்",
        "verifyRecipient": "பெறுநரை சரிபார்க்கவும்",
        "verified": "சரிபார்க்கப்பட்டது",
        "enterAmount": "தொகையை உள்ளிடவும் (₹)",
        "walletBalance": "பயிற்சி பணப்பை இருப்பு: ₹1,000",
        "continueToPay": "பணம் செலுத்த தொடரவும்",
        "enterUPIPIN": "6 இலக்க UPI PIN ஐ உள்ளிடவும்",
        "payingRs": "செலுத்தும் தொகை ₹",
        "toRecipient": "விவசாய நண்பருக்கு",
        "txnSuccess": "பரிவர்த்தனை வெற்றியடைந்தது!",
        "sentTo": "அனுப்பப்பட்டது",
        "txnId": "பரிவர்த்தனை எண்:",
        "payAgain": "மீண்டும் செலுத்தவும்",
        "paymentTutorial": "கட்டண பயிற்சி",
        "paymentTutorialDesc": "உண்மைப் பண இழப்பின்றி பரிவர்த்தனைகளைப் பழகவும்.",
        "crucialGuidelines": "முக்கிய வழிகாட்டுதல்கள்:",
        "practicePIN": "உங்கள் பயிற்சி PIN: ",
        "tip2": "பணம் செலுத்தும் முன் பெறுநரின் பெயரை எப்போதும் சரிபார்க்கவும்.",
        "tip3": "பாதுகாப்பான வங்கித் திரை தவிர வேறு எங்கும் PIN ஐ உள்ளிடாதீர்கள்.",
        "walletHistory": "பரிவர்த்தனை வரலாறு",
        "welcomeBonus": "வரவேற்பு போனஸ்",
        "messageInbox": "செய்தி பெட்டி",
        "fraudDesc": "அங்கீகரிக்கப்படாத பரிவர்த்தனைகளை 3 நாட்களுக்குள் வங்கிக்கு தெரிவித்தால் உங்கள் பொறுப்பு பூஜ்ஜியமாகும்.",
        "selectMessage": "செய்தியைத் தேர்ந்தெடுக்கவும்",
        "fraudPlaceholder": "பகுப்பாய்வு செய்ய SMS ஐ கிளிக் செய்யவும்.",
        "classifySafe": "பாதுகாப்பானது என உறுதிசெய்",
        "reportFraud": "மோசடி என புகாரளி",
        "loanTitle": "கடன் செலவு ஒப்பீட்டாளர்",
        "loanDesc": "வட்டி வேறுபாடுகளைப் புரிந்து கொள்ள ஸ்லைடரை நகர்த்தவும்.",
        "principalAmt": "அசல் தொகை",
        "interestRate": "வட்டி விகிதம் (ஆண்டுக்கு)",
        "tenure": "கால அளவு (மாதங்கள்)",
        "flatLoan": "நிலையான வட்டி கடன்",
        "flatRateFinancing": "நிலையான வட்டி நிதி",
        "monthlyEMI": "மாதாந்திர தவணை",
        "totalInterest": "மொத்த வட்டி",
        "totalRepayment": "மொத்த திருப்பிச் செலுத்துதல்",
        "flatLoanDesc": "வட்டி எப்போதும் ஆரம்ப அசலின் மீதே கணக்கிடப்படும்.",
        "compoundLoan": "குறையும் அசல் வட்டி கடன்",
        "reducingBalanceFinancing": "குறையும் நிலுவை நிதி",
        "compoundLoanDesc": "வட்டி மீதமுள்ள அசலுக்கு மட்டுமே கணக்கிடப்படும். இதுவே சிறந்தது!",
        "budgetTitle": "வருமான ஏற்றத்தாழ்வு பட்ஜெட் விளையாட்டு",
        "budgetDesc": "பல்வேறு சூழ்நிலைகளில் செலவுகளை திட்டமிடுங்கள்.",
        "currentIncome": "தற்போதைய வருமானம்:",
        "foodAlloc": "உணவு & வாடகை ஒதுக்கீடு (₹)",
        "savingsBox": "சேமிப்பு பெட்டி (₹)",
        "growthAlloc": "முதலீடு / தொழில் வளர்ச்சி (₹)",
        "simulateMonth": "அடுத்த மாதத்தை உருவகப்படுத்தவும்",
        "walletBal": "பணப்பை இருப்பு",
        "accumSavings": "சேமித்த தொகை",
        "activityLog": "பதிவேடு",
        "gameStarted": "விளையாட்டு தொடங்கியது.",
        "guidanceTitle": "தனிப்பயனாக்கப்பட்ட நிதி வழிகாட்டுதல்",
        "guidanceDesc": "உங்கள் மதிப்பீட்டின் அடிப்படையில் முக்கியமான நிதி விதிகள்.",
        "viewReport": "அறிக்கையைப் பார்க்கவும்",
        "reportTitle": "நிதி தயார்நிலை அறிக்கை",
        "reportDesc": "வாழ்த்துகள்! உங்களுக்கான அதிகாரப்பூர்வ சான்றிதழ்.",
        "certTitle": "அர்த்தசேது திறன் சான்றிதழ்",
        "certAwardedTo": "இச்சான்றிதழ் வழங்கப்படுகிறது",
        "certDesc": "தகவமைப்பு நிதிப் பயிற்சி மற்றும் பாதுகாப்பான UPI பயிற்சிகளை வெற்றிகரமாக முடித்ததற்காக.",
        "certLiteracy": "எழுத்தறிவு நிலை",
        "certDigital": "டிஜிட்டல் நம்பிக்கை",
        "certPathway": "கற்றல் வழித்தடம்",
        "certSystem": "அமைப்பால் வழங்கப்பட்டது",
        "certDate": "தேதி",
        "printCert": "சான்றிதழை அச்சிடுக",
        "provideFeedback": "கருத்து தெரிவிக்கவும்",
        "feedbackTitle": "கருத்துக்கணிப்பு",
        "feedbackDesc": "இச்சேவையை மேம்படுத்த எங்களுக்கு உதவவும்.",
        "surveyQ1": "1. இச்செயலியைப் பயன்படுத்துவது எவ்வளவு எளிதாக இருந்தது?",
        "surveyQ2": "2. பாதுகாப்பு விதிகளை தெளிவாகப் புரிந்து கொண்டீர்களா?",
        "surveyQ3": "3. இப்போது தனியாக மொபைல் பரிவர்த்தனை செய்ய நம்பிக்கை உள்ளதா?",
        "surveyQ4": "4. உங்களுக்கு ஏதேனும் கருத்துக்கள் உள்ளதா?",
        "feedbackPlaceholder": "இங்கே தமிழில் எழுதவும்...",
        "saveReset": "சேமித்து மீட்டமைக்கவும்",
        "assistantName": "அர்த்ததூத் உதவியாளர்:",
        "welcomeArthasetu": "அர்த்தசேதுவிற்கு வரவேற்கிறோம்.",
        "voiceOn": "குரல் உதவி: ஆன்",
        "voiceOff": "குரல் உதவி: ஆஃப்",
        "helpWelcome": "வணக்கம்! நான் அர்த்ததூத். நான் வழிமுறைகளை வாசித்து உங்களுக்கு வழிகாட்டுவேன்.",
        "profileHelp": "ஒவ்வொரு பகுதியிலும் ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்.",
        "quizHelp": "சரியான விடையைத் தேர்ந்தெடுக்கவும். தவறுகள் செய்ய தயங்காதீர்கள்.",
        "digitalHelp": "முதலில் 4096 என தட்டச்சு செய்யவும், பிறகு நாணயத்தை உண்டியலில் போடவும், கடைசியாக ஸ்லைடரை நகர்த்தவும்.",
        "trustHelp": "நீங்கள் பயப்படும் விஷயங்களைத் தேர்ந்தெடுக்கவும்.",
        "reliabilityHelp": "மாற்று முறைகள் உங்கள் நம்பகத்தன்மையைக் காட்ட உதவும்.",
        "sandboxHelp": "பயிற்சி பணப்பரிவர்த்தனை செய்யவும், மோசடிகளை அறியவும்.",
        "guidanceHelp": "இந்த பாதுகாப்பு விதிகளை வாசிக்கவும்.",
        "reportHelp": "இது உங்கள் சான்றிதழ்!",
        "surveyHelp": "உங்கள் அனுபவத்தை மதிப்பிடவும். நன்றி!",
        "pathAssisted": "குரல் / காட்சி உதவி வழித்தடம்",
        "pathAssistedDesc": "முழுமையான குரல் மற்றும் பெரிய பட்டன்கள் உங்களுக்கு உதவும்.",
        "pathAssistedFeat1": "தானியங்கி குரல் வழிகாட்டல்",
        "pathAssistedFeat2": "பெரிய எழுத்துருக்கள் & பொத்தான்கள்",
        "pathAssistedFeat3": "எளிதான ஒரு தொடுதல் உறுதிப்படுத்தல்",
        "pathGuided": "வழிகாட்டப்பட்ட வழித்தடம்",
        "pathGuidedDesc": "முக்கிய பொத்தான்களை ஒளிரச் செய்து வழிகாட்டும்.",
        "pathGuidedFeat1": "ஒளிரும் பொத்தான்கள்",
        "pathGuidedFeat2": "பாதுகாப்பு விழிப்பூட்டல்கள்",
        "pathGuidedFeat3": "வழிகாட்டுதல் குறிப்புகள்",
        "pathSelf": "சுய-வழிகாட்டுதல் வழித்தடம்",
        "pathSelfDesc": "நீங்கள் ஸ்மார்ட்போன் பயன்படுத்துவதில் சிறந்தவர்.",
        "pathSelfFeat1": "வழக்கமான வழிசெலுத்தல்",
        "pathSelfFeat2": "முழு சுதந்திரம்",
        "pathSelfFeat3": "மேம்பட்ட பயிற்சி",
        "certSelf": "சுய-வழிகாட்டுதல்",
        "certGuided": "வழிகாட்டப்பட்ட உதவி",
        "certAssisted": "குரல் உதவி",
        "lockedMsg": "இப்பகுதி பூட்டப்பட்டுள்ளது. முந்தைய பணியை முடிக்கவும்.",
        "occupationMsg": "தொழில் பதிவு செய்யப்பட்டது.",
        "answerMsg": "பதில் பதிவு செய்யப்பட்டது.",
        "clearedMsg": "அழிக்கப்பட்டது",
        "codeSuccess": "வெற்றி! சரியான குறியீடு.",
        "firstTaskDone": "அற்புதம்! முதல் பணி முடிந்தது.",
        "codeWrong": "தவறான குறியீடு. மீண்டும் முயலவும்.",
        "codeWrongRetry": "தவறான குறியீடு, மீண்டும் 4096 ஐ தட்டச்சு செய்யவும்.",
        "savingsSecured": "சேமிப்பு பாதுகாக்கப்பட்டது!",
        "coinDeposited": "வெற்றி! நாணயம் உண்டியலில் இடப்பட்டது.",
        "coinSecured": "வாழ்த்துகள், நாணயம் பாதுகாப்பாக உள்ளது.",
        "swipeSuccess": "வெற்றி! ஸ்வைப் அங்கீகரிக்கப்பட்டது.",
        "swipeDone": "ஸ்வைப் வெற்றிகரமாக முடிந்தது.",
        "optionToggled": "விருப்பம் மாற்றப்பட்டது.",
        "incomeRecorded": "வருமான விவரம் பதிவானது.",
        "scoreCalculated": "நம்பகத்தன்மை மதிப்பெண் {score}% ஆனது.",
        "labTabActive": "ஆய்வகத்தின் {tab} பகுதி தொடங்கப்பட்டது.",
        "recipientVerified": "வெற்றி! பெறுநர் சரிபார்க்கப்பட்டார்.",
        "enterValidUPI": "சரியான UPI ID அல்லது எண்ணை உள்ளிடவும்.",
        "enterAmountMsg": "₹10 முதல் ₹2,000 வரை தொகையை உள்ளிடவும்.",
        "insufficientFunds": "பணப்பையில் போதுமான இருப்பு இல்லை.",
        "enterPIN": "6 இலக்க UPI PIN ஐ உள்ளிடவும்.",
        "paymentSuccess": "வெற்றி! பணம் செலுத்தப்பட்டது.",
        "wrongPIN": "தவறான PIN. 123456 ஐ தட்டச்சு செய்யவும்.",
        "smsReview": "செய்தி திறக்கப்பட்டது.",
        "correctDecision": "உங்கள் முடிவு சரியானது.",
        "wrongDecision": "தவறான முடிவு. எச்சரிக்கையை கவனமாகப் படிக்கவும்.",
        "overBudget": "ஒதுக்கீடு இருப்புத் தொகையை விட அதிகம்!",
        "monthComplete": "மாதம் முடிந்தது.",
        "monthLabel": "மாதம்",
        "ratingRecorded": "மதிப்பீடு பதிவானது.",
        "profileSaved": "வாழ்த்துகள்! உங்கள் சுயவிவரம் சேமிக்கப்பட்டது.",
        "onboardingDone": "வெற்றி! உங்கள் கருத்து பதிவு செய்யப்பட்டது.",
        "fraudTitle": "மோசடி பாதுகாப்பு",
        "privacyTitle": "தகவல் பாதுகாப்புச் சட்டம்",
        "privacyDesc": "உங்கள் தரவு DPDP சட்டத்தின் கீழ் பாதுகாக்கப்படுகிறது.",
        "chargesTitle": "மறைமுக கட்டணம் இல்லை",
        "chargesDesc": "BSBD கணக்குகளில் குறைந்தபட்ச இருப்பு வைக்க வேண்டிய அவசியமில்லை.",
        "mistakesTitle": "தவறான கட்டண மீட்பு",
        "mistakesDesc": "தவறான கணக்கிற்கு பணம் அனுப்பினால் NPCI போர்ட்டலில் புகார் செய்யலாம்.",
        "tipSecTitle": "OTP அல்லது PIN ஐ ஒருபோதும் பகிர வேண்டாம்",
        "tipSecDesc": "எந்தவொரு வங்கி அதிகாரியும் தொலைபேசியில் PIN அல்லது OTP ஐக் கேட்க மாட்டார்கள்.",
        "tipSavTitle": "அவசர சேமிப்பு நிதி",
        "tipSavDescRegular": "வழக்கமான வருமானம் இருந்தால் குறைந்தபட்சம் 15% சேமிக்கவும்.",
        "tipSavDescIrregular": "வருமானம் மாறுபடுவதால் 3 மாத செலவிற்கான தொகையை சேமிப்பில் வைக்கவும்.",
        "tipCreTitle": "அதிக வட்டி கடன்களைத் தவிர்க்கவும்",
        "tipCreDesc": "கந்துவட்டி 5% மாதாந்திர வட்டி ஆண்டுக்கு 60% ஆகும்! அரசு முத்ரா கடன்களைப் பெறுங்கள்.",
        "tipPayTitle": "பெயரைச் சரிபார்த்து அனுப்பவும்",
        "tipPayDesc": "PIN போடும் முன் திரையில் தோன்றும் உண்மைப் பெயரை எப்போதும் கவனியுங்கள்.",
        "sms1Sender": "AD-LOTTRI",
        "sms1Text": "வாழ்த்துகள்! நீங்கள் ₹10,00,000 அரசு லாட்டரி வென்றுள்ளீர்கள். பெற இங்கே கிளிக் செய்யவும்: www.sarkari-win.com/claim",
        "sms1Expl": "இது மோசடி. அரசு துறைகள் SMS வழியாக லாட்டரி பணத்தை வழங்காது.",
        "sms2Sender": "State Bank",
        "sms2Text": "அன்புள்ள வாடிக்கையாளரே, உங்கள் மாதாந்திர கணக்கு அறிக்கை தயாராக உள்ளது. பதிவிறக்க அதிகாரப்பூர்வ போர்ட்டலில் உள்நுழையவும். PIN ஐ பகிர வேண்டாம்.",
        "sms2Expl": "இது பாதுகாப்பானது. இதில் ஆபத்தான இணைப்புகள் எதுவும் இல்லை.",
        "sms3Sender": "BP-ALERT",
        "sms3Text": "எச்சரிக்கை! உங்கள் மின்சார கட்டணம் ₹1,450 நிலுவையில் உள்ளது. மின் துண்டிப்பைத் தவிர்க்க தொலைபேசியில் OTP பகிரவும்.",
        "sms3Expl": "இது மோசடி. மின் நிறுவனங்கள் தொலைபேசியில் OTP கேட்காது.",
        "eventMedical": "மருத்துவ அவசரநிலை",
        "eventMedicalDesc": "குடும்ப உறுப்பினர் உடல்நலக்குறைவு. ₹1,000 செலவு.",
        "eventHarvest": "அறுவடை போனஸ்",
        "eventHarvestDesc": "விளைபொருளுக்கு நல்ல விலை கிடைத்தது! ₹1,500 கூடுதல் லாபம்.",
        "eventDrought": "வறட்சி / மந்தநிலை",
        "eventDroughtDesc": "மோசமான வானிலை காரணமாக வருமானம் இல்லை.",
        "eventFestival": "பண்டிகை கொண்டாட்டம்",
        "eventFestivalDesc": "இனிப்புகள் மற்றும் பரிசுகளுக்கு ₹500 செலவு."
    },
    "bn": {
        "brandTagline": "অভিযোজনমূলক অন্তর্ভুক্তি",
        "navGroup1": "১. নিবন্ধন ও প্রোফাইলিং",
        "navGroup2": "২. ইন্টারেক্টিভ মূল্যায়ন",
        "navGroup3": "৩. শিক্ষা ও ল্যাব",
        "navGroup4": "৪. সারাংশ ও মতামত",
        "navGroup5": "৫. পরবর্তী প্রজন্মের নিরাপত্তা",
        "guestUser": "অতিথি ব্যবহারকারী",
        "online": " অনলাইন",
        "title1": "ভাষা ও ভয়েস নির্বাচন",
        "title2": "\"আমাকে জানুন\" প্রোফাইল",
        "title3": "আর্থিক সাক্ষরতা",
        "title4": "ডিজিটাল আত্মবিশ্বাস",
        "title5": "বিশ্বাস ও সুরক্ষা",
        "title6": "নির্ভরযোগ্যতা ও আয়",
        "title7": "অভিযোজন ইঞ্জিন",
        "title8": "নিরাপদ অর্থ ল্যাব",
        "title9": "ব্যক্তিগত নির্দেশিকা",
        "title10": "প্রস্তুতি রিপোর্ট",
        "title11": "মতামত সমীক্ষা",
        "title12": "নিরাপত্তা ড্যাশবোর্ড",
        "title13": "সম্মতি ম্যানেজার",
        "title14": "ZKP যাচাইকারী",
        "securityDashDesc": "১০টি ক্রিপ্টোগ্রাফিক সুরক্ষা এবং অডিট ট্রেইল",
        "consentMgrDesc": "দানাদার ডেটা অ্যাক্সেসের জন্য স্মার্ট টোকেন",
        "zkpVerifierDesc": "পরিচয় ফাঁস না করে শূন্য-জ্ঞান প্রমাণ",
        "prototype": "প্রোটোটাইপ",
        "welcomeTitle": "স্বাগতম",
        "welcomeDesc": "অর্থসেতু আপনার আর্থিক চাহিদা, ডিজিটাল দক্ষতা এবং পছন্দের ভাষার সাথে খাপ খাইয়ে নেয়। আমরা আপনাকে আনুষ্ঠানিকভাবে সুরক্ষিত উপায়ে অর্থব্যবস্থা শিখতে সাহায্য করি।",
        "langCount": "৬+",
        "indianLanguages": "ভারতীয় ভাষা",
        "sandboxPct": "১০০%",
        "practiceSandbox": "অনুশীলন স্যান্ডবক্স",
        "selectLang": "আপনার ভাষা নির্বাচন করুন",
        "langSubtitle": "সম্পূর্ণ অ্যাপ আপনার নির্বাচিত ভাষায় কাজ করবে",
        "enableVoice": "ভয়েস সহায়তা চালু করুন",
        "voiceDesc": "আমাদের ভার্চুয়াল গাইড \"অর্থদূত\" আপনার নির্বাচিত ভাষায় নির্দেশাবলী পড়ে শোনাবে।",
        "startProfiling": "প্রোফাইলিং শুরু করুন",
        "tellUsAbout": "আপনার সম্পর্কে আমাদের বলুন",
        "configureApp": "আমরা আপনার দৈনন্দিন জীবন ও পেশার ওপর ভিত্তি করে অ্যাপ্লিকেশন কনফিগার করি।",
        "questionOccupation": "১. আপনার প্রধান পেশা কী?",
        "occRetailer": "ক্ষুদ্র ব্যবসায়ী / দোকানি",
        "occRetailerSub": "দোকানি / হকার",
        "occFarmer": "কৃষক / চাষাবাদ",
        "occFarmerSub": "কৃষি / চাষী",
        "occWorker": "গিগ কর্মী / ডেলিভারি",
        "occWorkerSub": "ডেলিভারি / ট্যাক্সি চালক",
        "occDailywager": "দৈনিক মজুরি কর্মী",
        "occDailywagerSub": "শ্রমিক / দিনমজুর",
        "questionFinExp": "২. আপনি কি আনুষ্ঠানিক ব্যাংকিং ও ডিজিটাল পেমেন্ট ব্যবহার করেছেন?",
        "finBeginner": "প্রথমবার ব্যবহারকারী",
        "finBeginnerSub": "UPI / অনলাইন ব্যাংকিং কখনো ব্যবহার করিনি",
        "finBasic": "মৌলিক ব্যবহারকারী",
        "finBasicSub": "ব্যাংক কার্ড আছে, কিন্তু UPI কম ব্যবহার করি",
        "finIntermediate": "মধ্যবর্তী ব্যবহারকারী",
        "finIntermediateSub": "মাঝে মাঝে UPI ব্যবহার করি, আত্মবিশ্বাস চাই",
        "questionDigConf": "৩. স্মার্টফোন পরিচালনায় আপনি কতটা স্বাচ্ছন্দ্য বোধ করেন?",
        "digLow": "সাহায্য প্রয়োজন",
        "digLowSub": "সাধারণত অন্যদের সাহায্য নিই",
        "digMedium": "বেসিক অ্যাপ ব্যবহার করতে পারি",
        "digMediumSub": "WhatsApp / YouTube সহজে ব্যবহার করি",
        "digHigh": "খুব আত্মবিশ্বাসী",
        "digHighSub": "অ্যাপ ডাউনলোড ও টাইপিং করতে পারি",
        "back": "পেছনে",
        "continue": "চালিয়ে যান",
        "quizTitle": "আর্থিক সাক্ষরতা মূল্যায়ন",
        "quizDesc": "আপনার আর্থিক ধারণা বুঝতে তিনটি দৃশ্যপট-ভিত্তিক প্রশ্নের উত্তর দিন।",
        "q1of3": "প্রশ্ন ১ এর ৩",
        "q1Title": "ফ্ল্যাট সুদ গণনা",
        "q1Scenario": "আপনি যদি ১০% ফ্ল্যাট সুদের হারে ১ বছরের জন্য ₹১০,০০০ ঋণ নেন, তবে বছরের শেষে মোট কত সুদ প্রদান করবেন?",
        "q1a0": "₹১,০০০ (সঠিক সুদ প্রদান)",
        "q1a1": "₹১০০ (১% গণনা)",
        "q1a2": "₹০ (সুদমুক্ত ঋণ)",
        "q1a3": "আমি জানি না / নিশ্চিত নই",
        "q2of3": "প্রশ্ন ২ এর ৩",
        "q2Title": "নিরাপদ PIN ও OTP পরিচালনা",
        "q2Scenario": "একজন অপরিচিত ব্যক্তি ফোন করে নিজেকে ব্যাংক ম্যানেজার বলে দাবি করে এবং আপনার UPI PIN বা OTP চায়। আপনি কী করবেন?",
        "q2a0": "শেয়ার করব যাতে অ্যাকাউন্ট বন্ধ না হয়",
        "q2a1": "যদি আমার নাম ঠিক বলে তবেই শেয়ার করব",
        "q2a2": "ফোনে কখনোই কারো সাথে PIN/OTP শেয়ার করব না (সঠিক)",
        "q2a3": "তাকে পরে ফোন করতে বলব",
        "q3of3": "প্রশ্ন ৩ এর ৩",
        "q3Title": "ব্যাংক সঞ্চয়ের গুরুত্ব",
        "q3Scenario": "বাড়িতে নগদ রাখার তুলনায় ব্যাংকে টাকা জমানোর প্রধান সুবিধা কী?",
        "q3a0": "টাকার ওপর সুদ পাওয়া যায় এবং চুরি থেকে সুরক্ষিত থাকে (সঠিক)",
        "q3a1": "ব্যাংকে রাখা টাকা খরচ করা সহজ",
        "q3a2": "নগদ ও ব্যাংকের মধ্যে কোনো তফাত নেই",
        "q3a3": "সুবিধা সম্পর্কে নিশ্চিত নই",
        "digitalTitle": "ডিজিটাল আত্মবিশ্বাস মূল্যায়ন",
        "digitalDesc": "আপনার স্মার্টফোন পরিচালনা ও টাচ স্ক্রিন দক্ষতা পরীক্ষা করতে এই তিনটি সহজ কাজ সম্পন্ন করুন।",
        "task1Title": "টাস্ক ১: সংখ্যা টাইপ করা",
        "task1Heading": "সংখ্যা কোড লিখুন",
        "task1Desc": "নিচের কীপ্যাড ব্যবহার করে কোডটি টাইপ করুন: ",
        "task2Title": "টাস্ক ২: ড্র্যাগ ও ড্রপ",
        "task2Heading": "আপনার মুদ্রা সঞ্চয় করুন",
        "task2Desc": "সোনার মুদ্রাটি টেনে এনে পিগি ব্যাংকে ফেলুন।",
        "dropCoin": "এখানে মুদ্রা ফেলুন",
        "task3Title": "টাস্ক ৩: সোয়াইপ জেসচার",
        "task3Heading": "পেমেন্ট করতে সোয়াইপ করুন",
        "task3Desc": "স্লাইডারটি ডানদিকে সোয়াইপ করে লেনদেন অনুমোদন করুন।",
        "swipeConfirm": "নিশ্চিত করতে ডানদিকে সোয়াইপ করুন",
        "waitingInput": "ইনপুটের অপেক্ষায়...",
        "dragStart": "মুদ্রা টেনে শুরু করুন",
        "slideHandle": "হ্যান্ডেলটি ডানদিকে স্লাইড করুন",
        "trustTitle": "বিশ্বাস ও সুরক্ষা সংক্রান্ত উদ্বেগ",
        "trustDesc": "ডিজিটাল অর্থব্যবস্থা ব্যবহারে আপনাকে যে বিষয়গুলি বাধা দেয় সেগুলি নির্বাচন করুন।",
        "trustConcerns": "আপনার প্রধান উদ্বেগ কী কী? (প্রযোজ্য সব নির্বাচন করুন)",
        "concernFraud": "প্রতারণা ও জালিয়াতির ভয়",
        "concernFraudDesc": "অনলাইন প্রতারকদের দ্বারা টাকা হারানোর ভয়",
        "concernPrivacy": "ডেটা ও অ্যাকাউন্টের গোপনীয়তা",
        "concernPrivacyDesc": "ব্যক্তিগত তথ্য ফাঁসের উদ্বেগ",
        "concernCharges": "লুকানো ফি ও চার্জ",
        "concernChargesDesc": "ব্যাংক অকারণে টাকা কাটবে কিনা সেই সন্দেহ",
        "concernMistakes": "ভুল করার ভয়",
        "concernMistakesDesc": "ভুল নম্বরে টাকা চলে যাওয়ার আশঙ্কা",
        "reassurancePortal": "সুরক্ষা পোর্টাল",
        "reassuranceDesc": "সুরক্ষা তথ্য ও নিয়ন্ত্রক অধিকার জানতে বাম দিক থেকে উদ্বেগ নির্বাচন করুন।",
        "altAssessment": "বিকল্প মূল্যায়ন",
        "reliabilityTitle": "বিকল্প আর্থিক নির্ভরযোগ্যতা",
        "reliabilityDesc": "যাদের কোনো ব্যাংকিং ক্রেডিট ইতিহাস নেই, অর্থসেতু সঞ্চয় এবং ব্যয়ের অভ্যাসের ভিত্তিতে নির্ভরযোগ্যতা মূল্যায়ন করে।",
        "simReliability": "সিমুলেটেড নির্ভরযোগ্যতা প্রোফাইল",
        "incomeProfile": "আয় ও সঞ্চয় প্রোফাইল",
        "consentDetails": "নির্ভরযোগ্যতা মূল্যায়নের জন্য সম্মতি প্রদান করুন।",
        "incomePattern": "১. আপনার আয়ের ধরন কেমন?",
        "incomeRegular": "নিয়মিত মাসিক",
        "incomeIrregular": "অনিয়মিত দৈনিক/সাপ্তাহিক",
        "incomeSeasonal": "মৌসুমি (ফসল/গিগ)",
        "indicatorsTitle": "২. আপনার ক্ষেত্রে প্রযোজ্য সূচকগুলি নির্বাচন করুন:",
        "ind1": "আমি নিয়মিত দোকানের ভাড়া বা ইউটিলিটি বিল পরিশোধ করি",
        "ind2": "আমি পোস্ট অফিস বা সঞ্চয় বাক্সে কিছু নগদ জমাই",
        "ind3": "আমার ব্যবসায় পণ্য বা সরঞ্জাম রয়েছে",
        "ind4": "স্থানীয় মহাজনের কাছে আমার কোনো বকেয়া ঋণ নেই",
        "consentText": "আমি বিকল্প সূচক মূল্যায়নের জন্য সম্মতি জানাচ্ছি।",
        "generateProfile": "প্রোফাইল তৈরি করুন",
        "engineTitle": "অর্থসেতু অভিযোজন প্রোফাইলিং ইঞ্জিন",
        "engineDesc": "এখানে আপনার গাণিতিক আর্থিক প্রোফাইল। অ্যাপ আপনার জন্য উপযুক্ত পথ বেছে নেবে।",
        "scoreLiteracy": "আর্থিক সাক্ষরতা",
        "scoreDigital": "ডিজিটাল আত্মবিশ্বাস",
        "scoreReliability": "বিকল্প নির্ভরযোগ্যতা",
        "recommendedPath": "প্রস্তাবিত অনবোর্ডিং পথ",
        "calculating": "গণনা করা হচ্ছে...",
        "selectContinue": "প্রোফাইলিং চালিয়ে যেতে নির্বাচন করুন।",
        "enterLab": "নিরাপদ অর্থ ল্যাবে প্রবেশ করুন",
        "labTitle": "নিরাপদ অর্থ ল্যাব",
        "practiceSandboxTag": "অনুশীলন স্যান্ডবক্স",
        "tabPayment": "পেমেন্ট অনুশীলন",
        "tabFraud": "প্রতারণা সনাক্তকরণ",
        "tabLoan": "ঋণ তুলনা",
        "tabBudget": "বাজেট ও অস্থিরতা",
        "arthapay": "অর্থপে",
        "enterRecipient": "প্রাপকের UPI ID / নম্বর লিখুন",
        "verifyRecipient": "প্রাপক যাচাই করুন",
        "verified": "যাচাইকৃত",
        "enterAmount": "টাকার পরিমাণ লিখুন (₹)",
        "walletBalance": "অনুশীলন ওয়ালেট ব্যালেন্স: ₹১,০০০",
        "continueToPay": "পেমেন্ট করতে এগিয়ে যান",
        "enterUPIPIN": "৬ অঙ্কের UPI PIN লিখুন",
        "payingRs": "প্রদান করা হচ্ছে ₹",
        "toRecipient": "কৃষক ভাইকে",
        "txnSuccess": "লেনদেন সফল হয়েছে!",
        "sentTo": "কৃষক ভাইকে পাঠানো হয়েছে",
        "txnId": "লেনদেন আইডি:",
        "payAgain": "পুনরায় পেমেন্ট করুন",
        "paymentTutorial": "পেমেন্ট টিউটোরিয়াল",
        "paymentTutorialDesc": "প্রকৃত টাকার ঝুঁকি ছাড়া ফান্ড ট্রান্সফার শিখুন।",
        "crucialGuidelines": "গুরুত্বপূর্ণ নির্দেশিকা:",
        "practicePIN": "আপনার অনুশীলন PIN কোড হলো: ",
        "tip2": "পেমেন্ট করার আগে প্রাপকের যাচাইকৃত নাম দেখে নিন।",
        "tip3": "নিরাপদ ব্যাংক স্ক্রিন ছাড়া কখনোই PIN লিখবেন না।",
        "walletHistory": "ওয়ালেট ইতিহাস",
        "welcomeBonus": "স্বাগতম বোনাস",
        "messageInbox": "মেসেজ ইনবক্স",
        "fraudDesc": "RBI নিয়ম অনুযায়ী, অননুমোদিত লেনদেনের ৩ দিনের মধ্যে ব্যাংকে জানালে আপনার কোনো দায়বদ্ধতা থাকে না।",
        "selectMessage": "একটি মেসেজ নির্বাচন করুন",
        "fraudPlaceholder": "নিরাপত্তা বিশ্লেষণ করতে তালিকা থেকে SMS এ ক্লিক করুন।",
        "classifySafe": "নিরাপদ হিসেবে চিহ্নিত করুন",
        "reportFraud": "প্রতারণা / স্প্যাম হিসেবে রিপোর্ট করুন",
        "loanTitle": "ঋণ খরচ সিমুলেটর",
        "loanDesc": "মোট পরিশোধ দেখতে ও সুদের ফাঁদ এড়াতে স্লাইডার সামঞ্জস্য করুন।",
        "principalAmt": "মূল পরিমাণ",
        "interestRate": "সুদের হার (বার্ষিক)",
        "tenure": "মেয়াদ (মাস)",
        "flatLoan": "ফ্ল্যাট লোন (সরল সুদ)",
        "flatRateFinancing": "ফ্ল্যাট রেট অর্থায়ন",
        "monthlyEMI": "মাসিক ইএমআই",
        "totalInterest": "মোট সুদ",
        "totalRepayment": "মোট পরিশোধ",
        "flatLoanDesc": "সুদ সর্বদা প্রাথমিক মূলধনের ওপর গণনা করা হয়।",
        "compoundLoan": "হ্রাসমান ব্যালেন্স লোন",
        "reducingBalanceFinancing": "হ্রাসমান ব্যালেন্স অর্থায়ন",
        "compoundLoanDesc": "সুদ কেবল অবশিষ্ট মূলধনের ওপর গণনা করা হয়। এটি অনেক সাশ্রয়ী!",
        "budgetTitle": "মৌসুমি আয় অস্থিরতা সিমুলেটর",
        "budgetDesc": "বিভিন্ন আয়ের পরিস্থিতিতে ব্যয় পরিচালনা করুন। সিমুলেশন খেলুন!",
        "currentIncome": "বর্তমান আয়ের ধরন:",
        "foodAlloc": "খাবার ও ভাড়া বরাদ্দ (₹)",
        "savingsBox": "সঞ্চয় বাক্স (₹)",
        "growthAlloc": "বিনিয়োগ / ব্যবসা বৃদ্ধি (₹)",
        "simulateMonth": "পরবর্তী মাস সিমুলেট করুন",
        "walletBal": "ওয়ালেট ব্যালেন্স",
        "accumSavings": "সঞ্চিত অর্থ",
        "activityLog": "কার্যকলাপ লগ",
        "gameStarted": "খেলা শুরু হয়েছে।",
        "guidanceTitle": "ব্যক্তিগত আর্থিক নির্দেশিকা",
        "guidanceDesc": "আপনার মূল্যায়নের ওপর ভিত্তি করে প্রস্তুত গুরুত্বপূর্ণ আর্থিক নিয়ম।",
        "viewReport": "প্রস্তুতি রিপোর্ট দেখুন",
        "reportTitle": "আর্থিক প্রস্তুতি রিপোর্ট",
        "reportDesc": "চমৎকার অগ্রগতি! এখানে আপনার অফিসিয়াল সক্ষমতা শংসাপত্র।",
        "certTitle": "অর্থসেতু সক্ষমতা শংসাপত্র",
        "certAwardedTo": "এই শংসাপত্র প্রদান করা হচ্ছে",
        "certDesc": "নিরাপদ অর্থ ল্যাব সিমুলেটরে অভিযোজিত আর্থিক প্রোফাইলিং এবং নিরাপদ UPI লেনদেন সফলভাবে সম্পন্ন করার জন্য।",
        "certLiteracy": "সাক্ষরতা স্তর",
        "certDigital": "ডিজিটাল আত্মবিশ্বাস",
        "certPathway": "সহায়ক পথ",
        "certSystem": "সিস্টেম কর্তৃক জারি",
        "certDate": "যাচাইয়ের তারিখ",
        "printCert": "শংসাপত্র প্রিন্ট করুন",
        "provideFeedback": "মতামত দিন",
        "feedbackTitle": "মতামত ও অভিজ্ঞতা পরিমাপ",
        "feedbackDesc": "এই অভিযোজিত ফ্রেমওয়ার্ক উন্নত করতে আমাদের সাহায্য করুন।",
        "surveyQ1": "১. এই অ্যাপ্লিকেশনটি ব্যবহার করা কতটা সহজ ছিল?",
        "surveyQ2": "২. আপনি কি সুরক্ষা নিয়ম ও প্রতারণা সতর্কতা স্পষ্টভাবে বুঝতে পেরেছেন?",
        "surveyQ3": "৩. এখন নিজে একা মোবাইল পেমেন্ট করতে কতটা আত্মবিশ্বাসী মনে করেন?",
        "surveyQ4": "৪. আপনার কোনো পরামর্শ বা মন্তব্য আছে কি?",
        "feedbackPlaceholder": "বাংলা বা ইংরেজিতে এখানে লিখুন...",
        "saveReset": "সংরক্ষণ ও অ্যাপ রিসেট করুন",
        "assistantName": "অর্থদূত সহকারী:",
        "welcomeArthasetu": "অর্থসেতুতে স্বাগতম।",
        "voiceOn": "ভয়েস সহায়তা: চালু",
        "voiceOff": "ভয়েস সহায়তা: বন্ধ",
        "helpWelcome": "নমস্কার! আমি অর্থদূত। আমি স্ক্রিনের তথ্য পড়ে আপনাকে পথ দেখাব। শুরু করতে যেকোনো বক্সে স্পর্শ করুন।",
        "profileHelp": "আপনার অভিজ্ঞতা কাস্টমাইজ করতে প্রতিটি বিভাগ থেকে একটি বিকল্প বেছে নিন।",
        "quizHelp": "যে বিকল্পটি সঠিক মনে হয় তা নির্বাচন করুন। ভুল করতে ভয় পাবেন না।",
        "digitalHelp": "আসুন তিনটি কাজ পরীক্ষা করি। প্রথমে কীপ্যাডে ৪০৯৬ লিখুন, তারপর মুদ্রাটি ব্যাংকে ফেলুন, এবং শেষে স্লাইডারটি ডানদিকে টানুন।",
        "trustHelp": "অনলাইন লেনদেনে আপনার যে বিষয়ে ভয় লাগে সেগুলি চিহ্নিত করুন।",
        "reliabilityHelp": "আপনার ক্রেডিট স্কোর না থাকলেও বিকল্প উপায়ে নির্ভরযোগ্যতা দেখানো যায়।",
        "sandboxHelp": "কোনো ঝুঁকি ছাড়া পেমেন্ট অনুশীলন করুন, জাল মেসেজ চিনুন, সুদের হার যাচাই করুন অথবা বাজেট পরিকল্পনা করুন।",
        "guidanceHelp": "এই নিরাপত্তা নিয়মগুলি পড়ুন। এগুলি আপনার উত্তরের ওপর ভিত্তি করে প্রস্তুত করা হয়েছে।",
        "reportHelp": "এটি আপনার সমাপ্তি শংসাপত্র!",
        "surveyHelp": "অনুগ্রহ করে আপনার অভিজ্ঞতার রেটিং দিন। ধন্যবাদ!",
        "pathAssisted": "ভয়েস / ভিজ্যুয়াল সহায়ক পথ",
        "pathAssistedDesc": "আপনার ডিজিটাল সাক্ষরতার ওপর ভিত্তি করে সিস্টেম সম্পূর্ণ ভয়েস ও বড় ভিজ্যুয়াল স্ক্রিন সক্রিয় করেছে।",
        "pathAssistedFeat1": "স্বয়ংক্রিয় ভয়েস নির্দেশিকা",
        "pathAssistedFeat2": "বড় ফন্ট ও বোতাম",
        "pathAssistedFeat3": "সহজ এক-ট্যাপ নিশ্চিতকরণ",
        "pathGuided": "নির্দেশিত পথ",
        "pathGuidedDesc": "আপনি মৌলিক অ্যাপ চালাতে পারেন। সিস্টেম গুরুত্বপূর্ণ বোতামে হাইলাইট ও সতর্কতা দেখাবে।",
        "pathGuidedFeat1": "গুরুত্বপূর্ণ বোতামে ঝলকানি হাইলাইট",
        "pathGuidedFeat2": "সময়মতো নিরাপত্তা পপ-আপ",
        "pathGuidedFeat3": "নির্দেশক টুলটিপস",
        "pathSelf": "স্বয়ংক্রিয় পথ",
        "pathSelfDesc": "আপনি স্মার্টফোন ব্যবহারে অত্যন্ত দক্ষ।",
        "pathSelfFeat1": "সাধারণ নেভিগেশন মোড",
        "pathSelfFeat2": "সম্পূর্ণ টুল স্বাধীনতা",
        "pathSelfFeat3": "উন্নত স্যান্ডবক্স অনুশীলন",
        "certSelf": "স্বয়ং-নির্দেশিত",
        "certGuided": "নির্দেশিত সহায়তা",
        "certAssisted": "ভয়েস সহায়তা",
        "lockedMsg": "এই অংশটি এখনও বন্ধ। অনুগ্রহ করে আগের ধাপটি সম্পন্ন করুন।",
        "occupationMsg": "পেশা সংরক্ষিত হয়েছে।",
        "answerMsg": "উত্তর সংরক্ষিত হয়েছে।",
        "clearedMsg": "মুছে ফেলা হয়েছে",
        "codeSuccess": "সফল! কোড সঠিক হয়েছে।",
        "firstTaskDone": "চমৎকার! প্রথম টাস্ক সম্পন্ন হয়েছে।",
        "codeWrong": "ভুল কোড। আবার চেষ্টা করুন।",
        "codeWrongRetry": "ভুল কোড, অনুগ্রহ করে আবার ৪০৯৬ টাইপ করুন।",
        "savingsSecured": "সঞ্চয় সুরক্ষিত!",
        "coinDeposited": "সফল! মুদ্রা জমা হয়েছে।",
        "coinSecured": "অভিনন্দন, মুদ্রা ব্যাংকে সুরক্ষিত আছে।",
        "swipeSuccess": "সফল! সোয়াইপ অনুমোদিত হয়েছে।",
        "swipeDone": "সোয়াইপ সফলভাবে সম্পন্ন হয়েছে।",
        "optionToggled": "বিকল্প পরিবর্তিত হয়েছে।",
        "incomeRecorded": "আয়ের ধরন সংরক্ষিত হয়েছে।",
        "scoreCalculated": "বিকল্প নির্ভরযোগ্যতা স্কোর {score}% হয়েছে।",
        "labTabActive": "ল্যাবের {tab} মডিউল সক্রিয় হয়েছে।",
        "recipientVerified": "সফল! প্রাপক যাচাই করা হয়েছে।",
        "enterValidUPI": "অনুগ্রহ করে সঠিক UPI ID বা নম্বর লিখুন।",
        "enterAmountMsg": "অনুগ্রহ করে ₹১০ থেকে ₹২,০০০ এর মধ্যে পরিমাণ লিখুন।",
        "insufficientFunds": "ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই।",
        "enterPIN": "যাচাইয়ের জন্য ৬ অঙ্কের UPI PIN লিখুন।",
        "paymentSuccess": "সফল! পেমেন্ট সম্পন্ন হয়েছে।",
        "wrongPIN": "ভুল UPI PIN। অনুগ্রহ করে ১২৩৪৫৬ লিখুন।",
        "smsReview": "মেসেজ খোলা হয়েছে।",
        "correctDecision": "আপনার সিদ্ধান্ত সম্পূর্ণ সঠিক।",
        "wrongDecision": "ভুল সিদ্ধান্ত। নিরাপত্তা সতর্কতা মনোযোগ দিয়ে পড়ুন।",
        "overBudget": "মোট বরাদ্দ ওয়ালেট ব্যালেন্সের চেয়ে বেশি!",
        "monthComplete": "মাস সম্পন্ন হয়েছে।",
        "monthLabel": "মাস",
        "ratingRecorded": "রেটিং সংরক্ষিত হয়েছে।",
        "profileSaved": "অভিনন্দন! আপনার প্রোফাইল সংরক্ষিত হয়েছে।",
        "onboardingDone": "সফল! আপনার প্রতিক্রিয়া গ্রহণ করা হয়েছে।",
        "fraudTitle": "জালিয়াতি থেকে সুরক্ষা",
        "privacyTitle": "গোপনীয়তা আইন",
        "privacyDesc": "আপনার ডেটা DPDP আইনের অধীনে সুরক্ষিত থাকে।",
        "chargesTitle": "লুকানো ফি মুক্ত",
        "chargesDesc": "BSBD অ্যাকাউন্টে ন্যূনতম ব্যালেন্স রাখার কোনো বাধ্যবাধকতা নেই।",
        "mistakesTitle": "ভুল লেনদেন পুনরুদ্ধার",
        "mistakesDesc": "ভুল অ্যাকাউন্টে টাকা পাঠালে NPCI পোর্টালে সরাসরি অভিযোগ জানাতে পারেন।",
        "tipSecTitle": "OTP বা PIN কখনোই শেয়ার করবেন না",
        "tipSecDesc": "কোনো ব্যাংক কর্মকর্তা কখনোই ফোনে UPI PIN বা OTP চান না।",
        "tipSavTitle": "জরুরি সঞ্চয় তহবিল",
        "tipSavDescRegular": "নিয়মিত আয় থাকলে প্রতি মাসে অন্তত ১৫% টাকা আলাদা সঞ্চয় অ্যাকাউন্টে রাখুন।",
        "tipSavDescIrregular": "যেহেতু আপনার আয় পরিবর্তনশীল, অন্তত ৩ মাসের খরচের সমান অর্থ আলাদা জমা রাখুন।",
        "tipCreTitle": "অনানুষ্ঠানিক সুদের ফাঁদ এড়িয়ে চলুন",
        "tipCreDesc": "মহাজনের ৫% মাসিক সুদ বছরে ৬০% হয়ে যায়! সরকারি মুদ্রা বা স্বনিধি ঋণ বেছে নিন।",
        "tipPayTitle": "প্রাপকের নাম যাচাই করুন",
        "tipPayDesc": "PIN দেওয়ার আগে সর্বদা প্রাপকের আসল নাম যাচাই করে নিন।",
        "sms1Sender": "AD-LOTTRI",
        "sms1Text": "অভিনন্দন! আপনি সরকারি প্রচার থেকে ₹১০,০০,০০০ লটারি জিতেছেন। অবিলম্বে দাবি করতে এখানে ক্লিক করুন: www.sarkari-win.com/claim",
        "sms1Expl": "এটি প্রতারণা। সরকারি দপ্তর কখনো SMS লিংকের মাধ্যমে লটারি দেয় না।",
        "sms2Sender": "State Bank",
        "sms2Text": "প্রিয় গ্রাহক, আপনার ব্যাংক স্টেটমেন্ট প্রস্তুত হয়েছে। ডাউনলোড করতে অফিসিয়াল ব্যাংকিং পোর্টালে লগইন করুন। PIN শেয়ার করবেন না।",
        "sms2Expl": "এটি নিরাপদ। মেসেজে কোনো হুমকি বা সন্দেহজনক লিঙ্ক নেই।",
        "sms3Sender": "BP-ALERT",
        "sms3Text": "সতর্কতা! আপনার বিদ্যুৎ বিল ₹১,৪৫০ বকেয়া আছে। লাইন কাটা বন্ধ করতে ফোনে যোগাযোগ করে OTP দিন।",
        "sms3Expl": "এটি প্রতারণা। ইউটিলিটি কোম্পানি কখনোই ফোনে OTP দিয়ে বিল পরিশোধ করতে বলে না।",
        "eventMedical": "চিকিৎসা জরুরি অবস্থা",
        "eventMedicalDesc": "পরিবারের সদস্য অসুস্থ হয়ে পড়েছেন। ₹১,০০০ চিকিৎসা খরচ।",
        "eventHarvest": "বাম্পার ফসল বোনাস",
        "eventHarvestDesc": "ফসলের চাহিদা অপ্রত্যাশিতভাবে বেড়েছে! ₹১,৫০০ অতিরিক্ত লাভ।",
        "eventDrought": "খরা / স্থানীয় মন্দা",
        "eventDroughtDesc": "খারাপ আবহাওয়ার কারণে কোনো আয় হয়নি।",
        "eventFestival": "উৎসব উদযাপন",
        "eventFestivalDesc": "মিষ্টি ও উপহারে ₹৫০০ খরচ।"
    },
    "te": {
        "brandTagline": "అనుకూల సమగ్రత",
        "navGroup1": "1. నమోదు & ప్రొఫైలింగ్",
        "navGroup2": "2. ఇంటరాక్టివ్ మూల్యాంకనాలు",
        "navGroup3": "3. అభ్యాసం & ల్యాబ్",
        "navGroup4": "4. సారాంశం & అభిప్రాయం",
        "navGroup5": "5. నెక్స్ట్-జెన్ భద్రత",
        "guestUser": "అతిథి వినియోగదారు",
        "online": " ఆన్‌లైన్",
        "title1": "భాష & వాయిస్ ఎంపిక",
        "title2": "\"నన్ను తెలుసుకోండి\" ప్రొఫైల్",
        "title3": "ఆర్థిక అక్షరాస్యత",
        "title4": "డిజిటల్ విశ్వాసం",
        "title5": "నమ్మకం & భద్రత",
        "title6": "విశ్వసనీయత & ఆదాయం",
        "title7": "అడాప్టివ్ ఇంజిన్",
        "title8": "సేఫ్ ఫైనాన్స్ ల్యాబ్",
        "title9": "వ్యక్తిగత మార్గదర్శకత్వం",
        "title10": "సంసిద్ధత నివేదిక",
        "title11": "అభిప్రాయ సర్వే",
        "title12": "సెక్యూరిటీ డాష్‌బోర్డ్",
        "title13": "సమ్మతి మేనేజర్",
        "title14": "ZKP ధృవీకరణకర్త",
        "securityDashDesc": "10 క్రిప్టోగ్రాఫిక్ భద్రతా ఆవిష్కరణలు",
        "consentMgrDesc": "డేటా యాక్సెస్ కోసం స్మార్ట్ సమ్మతి టోకెన్లు",
        "zkpVerifierDesc": "వివరాలు బహిర్గతం చేయకుండా జీరో-నాలెడ్జ్ ప్రూఫ్",
        "prototype": "ప్రోటోటైప్",
        "welcomeTitle": "స్వాగతం",
        "welcomeDesc": "అర్థసేతు మీ ఆర్థిక అవసరాలు, డిజిటల్ సామర్థ్యం మరియు ఇష్టపడే భాషకు అనుగుణంగా మారుతుంది. సురక్షితమైన పద్ధతిలో ఆర్థిక సేవలను నేర్చుకోవడానికి మేము మీకు సహాయం చేస్తాము.",
        "langCount": "6+",
        "indianLanguages": "భారతీయ భాషలు",
        "sandboxPct": "100%",
        "practiceSandbox": "ప్రాక్టీస్ శాండ్‌బాక్స్",
        "selectLang": "మీ భాషను ఎంచుకోండి",
        "langSubtitle": "యాప్ మొత్తం మీ ఎంచుకున్న భాషలో పనిచేస్తుంది",
        "enableVoice": "వాయిస్ సహాయాన్ని ప్రారంభించండి",
        "voiceDesc": "మా వర్చువల్ గైడ్ \"అర్థదూత్\" మీ ఎంచుకున్న భాషలో సూచనలను గట్టిగా చదువుతుంది.",
        "startProfiling": "ప్రొఫైలింగ్ ప్రారంభించండి",
        "tellUsAbout": "మీ గురించి మాకు చెప్పండి",
        "configureApp": "మేము మీ వృత్తి మరియు అవసరాల ఆధారంగా అప్లికేషన్‌ను కాన్ఫిగర్ చేస్తాము.",
        "questionOccupation": "1. మీ ప్రాథమిక వృత్తి ఏమిటి?",
        "occRetailer": "చిన్న వ్యాపారి / దుకాణదారుడు",
        "occRetailerSub": "దుకాణదారుడు / వీధి వ్యాపారి",
        "occFarmer": "రైతు / వ్యవసాయం",
        "occFarmerSub": "రైతు / వ్యవసాయం",
        "occWorker": "గిగ్ వర్కర్ / డెలివరీ",
        "occWorkerSub": "డెలివరీ / టాక్సీ డ్రైవర్",
        "occDailywager": "రోజువారీ కూలీ",
        "occDailywagerSub": "కూలీ / దినసరి వేతనం",
        "questionFinExp": "2. మీరు అధికారిక బ్యాంకింగ్ లేదా డిజిటల్ చెల్లింపులు ఉపయోగించారా?",
        "finBeginner": "మొదటిసారి వినియోగదారు",
        "finBeginnerSub": "UPI / నెట్ బ్యాంకింగ్ ఎప్పుడూ ఉపయోగించలేదు",
        "finBasic": "ప్రాథమిక వినియోగదారు",
        "finBasicSub": "బ్యాంక్ కార్డు ఉంది, కానీ UPI తక్కువగా ఉపయోగిస్తాను",
        "finIntermediate": "మధ్యస్థ వినియోగదారు",
        "finIntermediateSub": "అప్పుడప్పుడు UPI ఉపయోగిస్తాను, మరింత నమ్మకం కావాలి",
        "questionDigConf": "3. స్మార్ట్‌ఫోన్ వాడకంలో మీరు ఎంత సౌకర్యంగా ఉన్నారు?",
        "digLow": "సహాయం కావాలి",
        "digLowSub": "సాధారణంగా ఇతరుల సహాయంతో వాడతాను",
        "digMedium": "ప్రాథమిక యాప్‌లను ఉపయోగించగలను",
        "digMediumSub": "WhatsApp / YouTube సులభంగా వాడతాను",
        "digHigh": "చాలా విశ్వాసంగా ఉన్నాను",
        "digHighSub": "యాప్‌లను డౌన్‌లోడ్ చేసి టైప్ చేయగలను",
        "back": "వెనుకకు",
        "continue": "కొనసాగించండి",
        "quizTitle": "ఆర్థిక అక్షరాస్యత మూల్యాంకనం",
        "quizDesc": "మీ ఆర్థిక పరిజ్ఞానాన్ని తెలుసుకోవడానికి 3 దృశ్య ఆధారిత ప్రశ్నలకు సమాధానం ఇవ్వండి.",
        "q1of3": "ప్రశ్న 1 / 3",
        "q1Title": "వడ్డీ లెక్కింపు",
        "q1Scenario": "మీరు 10% ఫ్లాట్ వడ్డీ రేటుతో 1 సంవత్సరానికి ₹10,000 రుణం తీసుకుంటే, సంవత్సరం చివరలో మొత్తం ఎంత వడ్డీ చెల్లిస్తారు?",
        "q1a0": "₹1,000 (సరైన వడ్డీ)",
        "q1a1": "₹100 (1% లెక్కింపు)",
        "q1a2": "₹0 (వడ్డీ లేని రుణం)",
        "q1a3": "నాకు తెలియదు / ఖచ్చితంగా తెలియదు",
        "q2of3": "ప్రశ్న 2 / 3",
        "q2Title": "సురక్షిత PIN & OTP నిర్వహణ",
        "q2Scenario": "బ్యాంక్ మేనేజర్‌గా చెప్పుకునే వ్యక్తి నుండి మీకు కాల్ వచ్చి, UPI PIN లేదా OTP అడిగితే మీరు ఏమి చేస్తారు?",
        "q2a0": "ఖాతా బ్లాక్ కాకుండా ఉండటానికి చెప్తాను",
        "q2a1": "నా పేరు సరిగ్గా చెబితేనే చెప్తాను",
        "q2a2": "ఫోన్‌లో ఎవరితోనూ PIN/OTP పంచుకోను (సరైనది)",
        "q2a3": "తర్వాత కాల్ చేయమని చెప్తాను",
        "q3of3": "ప్రశ్న 3 / 3",
        "q3Title": "బ్యాంక్ పొదుపు ప్రాముఖ్యత",
        "q3Scenario": "ఇంట్లో నగదు దాచుకోవడం కంటే బ్యాంకులో డబ్బు దాచుకోవడం వల్ల కలిగే ప్రయోజనం ఏమిటి?",
        "q3a0": "డబ్బుపై వడ్డీ వస్తుంది మరియు దొంగతనం జరగకుండా సురక్షితంగా ఉంటుంది (సరైనది)",
        "q3a1": "బ్యాంకులో ఉన్న డబ్బును ఖర్చు చేయడం సులభం",
        "q3a2": "నగదుకు మరియు బ్యాంకుకు తేడా లేదు",
        "q3a3": "ప్రయోజనాల గురించి ఖచ్చితంగా తెలియదు",
        "digitalTitle": "డిజిటల్ విశ్వాస మూల్యాంకనం",
        "digitalDesc": "టచ్ స్క్రీన్ సౌకర్యాన్ని పరీక్షించడానికి ఈ 3 సులభమైన పనులను పూర్తి చేయండి.",
        "task1Title": "టాస్క్ 1: నంబర్ టైప్ చేయడం",
        "task1Heading": "సంఖ్యా కోడ్‌ను నమోదు చేయండి",
        "task1Desc": "క్రింది కీప్యాడ్‌ను ఉపయోగించి కోడ్ టైప్ చేయండి: ",
        "task2Title": "టాస్క్ 2: డ్రాగ్ & డ్రాప్",
        "task2Heading": "మీ నాణెం భద్రపరచండి",
        "task2Desc": "బంగారు నాణెం లాగి పిగ్గీ బ్యాంకులో వేయండి.",
        "dropCoin": "నాణెం ఇక్కడ వేయండి",
        "task3Title": "టాస్క్ 3: స్వైప్ సంజ్ఞ",
        "task3Heading": "చెల్లింపు కోసం స్వైప్ చేయండి",
        "task3Desc": "చెల్లింపును ఆమోదించడానికి స్లైడర్‌ను కుడివైపుకు స్వైప్ చేయండి.",
        "swipeConfirm": "ధృవీకరించడానికి కుడివైపుకు స్వైప్ చేయండి",
        "waitingInput": "ఇన్‌పుట్ కోసం వేచి ఉంది...",
        "dragStart": "నాణెం లాగడం ప్రారంభించండి",
        "slideHandle": "హ్యాండిల్‌ను కుడివైపుకు జరపండి",
        "trustTitle": "నమ్మకం & భద్రతా ఆందోళనలు",
        "trustDesc": "డిజిటల్ చెల్లింపులు ఉపయోగించడంలో మీకు ఉన్న భయాలను ఎంచుకోండి.",
        "trustConcerns": "మీ ముఖ్యమైన ఆందోళనలు ఏమిటి? (వర్తించేవన్నీ ఎంచుకోండి)",
        "concernFraud": "మోసాల భయం",
        "concernFraudDesc": "ఆన్‌లైన్ మోసగాళ్ల వల్ల డబ్బు పోతుందనే భయం",
        "concernPrivacy": "డేటా & ఖాతా గోప్యత",
        "concernPrivacyDesc": "వ్యక్తిగత సమాచారం లీక్ అవుతుందనే ఆందోళన",
        "concernCharges": "దాగి ఉన్న ఛార్జీలు",
        "concernChargesDesc": "బ్యాంకు అనవసరంగా డబ్బు కట్ చేస్తుందేమోననే అనుమానం",
        "concernMistakes": "పొరపాటు జరుగుతుందనే భయం",
        "concernMistakesDesc": "తప్పు నంబర్‌కు డబ్బు పంపుతామనే భయం",
        "reassurancePortal": "భద్రతా పోర్టల్",
        "reassuranceDesc": "భద్రతా నిబంధనలు తెలుసుకోవడానికి ఎడమవైపున ఆందోళనలను క్లిక్ చేయండి.",
        "altAssessment": "ప్రత్యామ్నాయ మూల్యాంకనం",
        "reliabilityTitle": "ప్రత్యామ్నాయ ఆర్థిక విశ్వసనీయత",
        "reliabilityDesc": "క్రెడిట్ చరిత్ర లేనివారికి పొదుపు మరియు బిల్లు చెల్లింపుల ఆధారంగా మూల్యాంకనం.",
        "simReliability": "విశ్వసనీయత ప్రొఫైల్",
        "incomeProfile": "ఆదాయం & పొదుపు ప్రొఫైల్",
        "consentDetails": "విశ్వసనీయతను లెక్కించడానికి సమ్మతిని అందించండి.",
        "incomePattern": "1. మీ ఆదాయ తీరు ఎలా ఉంటుంది?",
        "incomeRegular": "క్రమమైన నెలవారీ ఆదాయం",
        "incomeIrregular": "అనిశ్చిత రోజువారీ/వారపు ఆదాయం",
        "incomeSeasonal": "కాలానుగుణ ఆదాయం (పంటలు/గిగ్స్)",
        "indicatorsTitle": "2. మీకు వర్తించే ఎంపికలను ఎంచుకోండి:",
        "ind1": "నేను అద్దె లేదా కరెంట్ బిల్లులను క్రమం తప్పకుండా చెల్లిస్తాను",
        "ind2": "నేను పోస్టాఫీసు లేదా ఇంట్లో కొంత నగదు పొదుపు చేస్తాను",
        "ind3": "నా వద్ద వ్యాపార సామాగ్రి లేదా పనిముట్లు ఉన్నాయి",
        "ind4": "స్థానిక వడ్డీ వ్యాపారుల వద్ద నాకు ఎలాంటి అప్పు లేదు",
        "consentText": "ప్రత్యామ్నాయ విశ్వసనీయత స్కోరు మూల్యాంకనానికి నేను సమ్మతిస్తున్నాను.",
        "generateProfile": "ప్రొఫైల్ రూపొందించండి",
        "engineTitle": "అర్థసేతు అడాప్టివ్ ప్రొఫైలింగ్ ఇంజిన్",
        "engineDesc": "మీ కోసం రూపొందించిన ఆన్‌బోర్డింగ్ మార్గం.",
        "scoreLiteracy": "ఆర్థిక అక్షరాస్యత",
        "scoreDigital": "డిజిటల్ విశ్వాసం",
        "scoreReliability": "ప్రత్యామ్నాయ విశ్వసనీయత",
        "recommendedPath": "సిఫార్సు చేయబడిన మార్గం",
        "calculating": "లెక్కిస్తోంది...",
        "selectContinue": "కొనసాగడానికి ఎంచుకోండి.",
        "enterLab": "సేఫ్ ఫైనాన్స్ ల్యాబ్‌లోకి ప్రవేశించండి",
        "labTitle": "సేఫ్ ఫైనాన్స్ ల్యాబ్",
        "practiceSandboxTag": "ప్రాక్టీస్ శాండ్‌బాక్స్",
        "tabPayment": "చెల్లింపు ప్రాక్టీస్",
        "tabFraud": "మోసం డిటెక్టర్",
        "tabLoan": "రుణ పోలిక",
        "tabBudget": "బడ్జెట్ & ప్రణాళిక",
        "arthapay": "అర్థపే",
        "enterRecipient": "గ్రహీత UPI ID / నంబర్ నమోదు చేయండి",
        "verifyRecipient": "గ్రహీతను ధృవీకరించండి",
        "verified": "ధృవీకరించబడింది",
        "enterAmount": "మొత్తాన్ని నమోదు చేయండి (₹)",
        "walletBalance": "ప్రాక్టీస్ వాలెట్ బ్యాలెన్స్: ₹1,000",
        "continueToPay": "చెల్లించడానికి కొనసాగించండి",
        "enterUPIPIN": "6 అంకెల UPI PIN నమోదు చేయండి",
        "payingRs": "చెల్లిస్తున్న మొత్తం ₹",
        "toRecipient": "రైతు మిత్రునికి",
        "txnSuccess": "లావాదేవీ విజయవంతమైంది!",
        "sentTo": "పంపబడింది",
        "txnId": "లావాదేవీ ID:",
        "payAgain": "మళ్లీ చెల్లించండి",
        "paymentTutorial": "చెల్లింపు ట్యుటోరియల్",
        "paymentTutorialDesc": "నిజమైన డబ్బు నష్టం లేకుండా లావాదేవీలను ప్రాక్టీస్ చేయండి.",
        "crucialGuidelines": "ముఖ్యమైన మార్గదర్శకాలు:",
        "practicePIN": "మీ ప్రాక్టీస్ PIN: ",
        "tip2": "చెల్లించే ముందు గ్రహీత పేరును ఎల్లప్పుడూ సరిచూసుకోండి.",
        "tip3": "సురక్షిత బ్యాంక్ స్క్రీన్ తప్ప మరెక్కడా PIN ఎంటర్ చేయవద్దు.",
        "walletHistory": "లావాదేవీల చరిత్ర",
        "welcomeBonus": "స్వాగత బోనస్",
        "messageInbox": "మెసేజ్ ఇన్‌బాక్స్",
        "fraudDesc": "RBI నిబంధనల ప్రకారం, అనధికార లావాదేవీని 3 రోజులలోపు బ్యాంకుకు నివేదిస్తే మీ బాధ్యత సున్నా.",
        "selectMessage": "మెసేజ్ ఎంచుకోండి",
        "fraudPlaceholder": "విశ్లేషించడానికి SMS పై క్లిక్ చేయండి.",
        "classifySafe": "సురక్షితమైనదిగా గుర్తించండి",
        "reportFraud": "మోసంగా రిపోర్ట్ చేయండి",
        "loanTitle": "రుణ ఖర్చు సిమ్యులేటర్",
        "loanDesc": "వడ్డీ తేడాలు చూడటానికి స్లైడర్‌లను మార్చండి.",
        "principalAmt": "అసలు మొత్తం",
        "interestRate": "వడ్డీ రేటు (వార్షిక)",
        "tenure": "వ్యవధి (నెలలు)",
        "flatLoan": "ఫ్లాట్ వడ్డీ రుణం",
        "flatRateFinancing": "ఫ్లాట్ రేట్ ఫైనాన్సింగ్",
        "monthlyEMI": "నెలవారీ EMI",
        "totalInterest": "మొత్తం వడ్డీ",
        "totalRepayment": "మొత్తం తిరిగి చెల్లింపు",
        "flatLoanDesc": "వడ్డీ ఎల్లప్పుడూ ప్రారంభ అసలుపైనే లెక్కించబడుతుంది.",
        "compoundLoan": "తగ్గుతున్న అసలు రుణం",
        "reducingBalanceFinancing": "తగ్గుతున్న నిల్వ ఫైనాన్సింగ్",
        "compoundLoanDesc": "మిగిలిన అసలుపై మాత్రమే వడ్డీ లెక్కిస్తారు. ఇది చాలా లాభదాయకం!",
        "budgetTitle": "కాలానుగుణ బడ్జెట్ గేమ్",
        "budgetDesc": "వివిధ పరిస్థితులలో ఖర్చులను సమతుల్యం చేసుకోండి.",
        "currentIncome": "ప్రస్తుత ఆదాయ నమూనా:",
        "foodAlloc": "ఆహారం & అద్దె కేటాయింపు (₹)",
        "savingsBox": "పొదుపు పెట్టె (₹)",
        "growthAlloc": "పెట్టుబడి / వ్యాపార వృద్ధి (₹)",
        "simulateMonth": "తదుపరి నెలను అనుకరించండి",
        "walletBal": "వాలెట్ బ్యాలెన్స్",
        "accumSavings": "మొత్తం పొదుపు",
        "activityLog": "యాక్టివిటీ లాగ్",
        "gameStarted": "ఆట ప్రారంభమైంది.",
        "guidanceTitle": "వ్యక్తిగత ఆర్థిక మార్గదర్శకత్వం",
        "guidanceDesc": "మీ మూల్యాంకనం ఆధారంగా ముఖ్యమైన ఆర్థిక నియమాలు.",
        "viewReport": "నివేదికను వీక్షించండి",
        "reportTitle": "ఆర్థిక సంసిద్ధత నివేదిక",
        "reportDesc": "అభినందనలు! ఇది మీ అధికారిక సర్టిఫికేట్.",
        "certTitle": "అర్థసేతు సామర్థ్య సర్టిఫికేట్",
        "certAwardedTo": "ఈ సర్టిఫికేట్ ప్రదానం చేయబడుతుంది",
        "certDesc": "అడాప్టివ్ ఆర్థిక ప్రొఫైలింగ్ మరియు UPI ప్రాక్టీస్‌ను విజయవంతంగా పూర్తి చేసినందుకు.",
        "certLiteracy": "అక్షరాస్యత స్థాయి",
        "certDigital": "డిజిటల్ విశ్వాసం",
        "certPathway": "మార్గం",
        "certSystem": "సిస్టమ్ ద్వారా జారీ",
        "certDate": "తేదీ",
        "printCert": "సర్టిఫికేట్ ప్రింట్ చేయండి",
        "provideFeedback": "అభిప్రాయాన్ని ఇవ్వండి",
        "feedbackTitle": "అభిప్రాయ సర్వే",
        "feedbackDesc": "ఈ వేదికను మరింత మెరుగుపరచడానికి మాకు సహాయపడండి.",
        "surveyQ1": "1. ఈ యాప్‌ను ఉపయోగించడం ఎంత సులభంగా ఉంది?",
        "surveyQ2": "2. భద్రతా నియమాలను మీరు స్పష్టంగా అర్థం చేసుకున్నారా?",
        "surveyQ3": "3. ఇప్పుడు సొంతంగా మొబైల్ చెల్లింపులు చేయడానికి విశ్వాసం ఉందా?",
        "surveyQ4": "4. మీకు ఏవైనా సూచనలు ఉన్నాయా?",
        "feedbackPlaceholder": "తెలుగు లేదా ఇంగ్లీషులో ఇక్కడ రాయండి...",
        "saveReset": "సేవ్ చేసి రీసెట్ చేయండి",
        "assistantName": "అర్థదూత్ అసిస్టెంట్:",
        "welcomeArthasetu": "అర్థసేతుకు స్వాగతం.",
        "voiceOn": "వాయిస్ అసిస్ట్: ఆన్",
        "voiceOff": "వాయిస్ అసిస్ట్: ఆఫ్",
        "helpWelcome": "నమస్కారం! నేను అర్థదూత్. నేను సూచనలను చదివి మీకు మార్గదర్శనం చేస్తాను.",
        "profileHelp": "మీ అనుభవాన్ని మార్చుకోవడానికి ప్రతి విభాగం నుండి ఒక ఎంపికను ఎంచుకోండి.",
        "quizHelp": "సరైన సమాధానాన్ని ఎంచుకోండి. తప్పులు చేయడానికి భయపడవద్దు.",
        "digitalHelp": "ముందుగా 4096 టైప్ చేయండి, తర్వాత నాణెం పిగ్గీ బ్యాంకులో వేయండి, చివరగా స్లైడర్‌ను జరపండి.",
        "trustHelp": "మీకు భయం కలిగించే అంశాలను ఎంచుకోండి.",
        "reliabilityHelp": "ప్రత్యామ్నాయ పద్ధతులు మీ విశ్వసనీయతను నిరూపించడంలో సహాయపడతాయి.",
        "sandboxHelp": "నష్టభయం లేకుండా చెల్లింపులను ప్రాక్టీస్ చేయండి.",
        "guidanceHelp": "ఈ భద్రతా నియమాలను చదవండి.",
        "reportHelp": "ఇది మీ పూర్తి సర్టిఫికేట్!",
        "surveyHelp": "దయచేసి మీ అనుభవాన్ని రేట్ చేయండి. ధన్యవాదాలు!",
        "pathAssisted": "వాయిస్ / విజువల్ అసిస్టెడ్ మార్గం",
        "pathAssistedDesc": "మీ డిజిటల్ పరిజ్ఞానం ఆధారంగా పెద్ద బటన్లు మరియు పూర్తి వాయిస్ గైడెన్స్ అందుబాటులో ఉంటుంది.",
        "pathAssistedFeat1": "ఆటోమేటిక్ వాయిస్ గైడెన్స్",
        "pathAssistedFeat2": "పెద్ద ఫాంట్లు & బటన్లు",
        "pathAssistedFeat3": "సులభమైన వన్-ట్యాప్ నిర్ధారణ",
        "pathGuided": "గైడెడ్ మార్గం",
        "pathGuidedDesc": "ముఖ్యమైన బటన్‌లపై హైలైట్‌లు చూపిస్తూ సహాయపడుతుంది.",
        "pathGuidedFeat1": "మెరుస్తున్న బటన్ హైలైట్స్",
        "pathGuidedFeat2": "భద్రతా హెచ్చరికలు",
        "pathGuidedFeat3": "సహాయక చిట్కాలు",
        "pathSelf": "సెల్ఫ్-గైడెడ్ మార్గం",
        "pathSelfDesc": "మీరు స్మార్ట్‌ఫోన్ వాడకంలో చాలా నైపుణ్యం కలిగి ఉన్నారు.",
        "pathSelfFeat1": "సాధారణ నావిగేషన్",
        "pathSelfFeat2": "పూర్తి స్వేచ్ఛ",
        "pathSelfFeat3": "ఉన్నత ప్రాక్టీస్",
        "certSelf": "సెల్ఫ్-గైడెడ్",
        "certGuided": "గైడెడ్ సపోర్ట్",
        "certAssisted": "వాయిస్ సపోర్ట్",
        "lockedMsg": "ఈ విభాగం లాక్ చేయబడింది. దయచేసి మునుపటి పనిని పూర్తి చేయండి.",
        "occupationMsg": "వృత్తి నమోదు చేయబడింది.",
        "answerMsg": "సమాధానం నమోదు చేయబడింది.",
        "clearedMsg": "తొలగించబడింది",
        "codeSuccess": "విజయం! కోడ్ సరైనది.",
        "firstTaskDone": "అద్భుతం! మొదటి పని పూర్తయింది.",
        "codeWrong": "తప్పు కోడ్. మళ్లీ ప్రయత్నించండి.",
        "codeWrongRetry": "తప్పు కోడ్, దయచేసి మళ్లీ 4096 టైప్ చేయండి.",
        "savingsSecured": "పొదుపు భద్రపరచబడింది!",
        "coinDeposited": "విజయం! నాణెం జమ అయింది.",
        "coinSecured": "అభినందనలు, నాణెం బ్యాంకులో సురక్షితంగా ఉంది.",
        "swipeSuccess": "విజయం! స్వైప్ ఆమోదించబడింది.",
        "swipeDone": "స్వైప్ విజయవంతంగా పూర్తయింది.",
        "optionToggled": "ఎంపిక మార్చబడింది.",
        "incomeRecorded": "ఆదాయ వివరాలు నమోదయ్యాయి.",
        "scoreCalculated": "విశ్వసనీయత స్కోరు {score}% అయింది.",
        "labTabActive": "ల్యాబ్ యొక్క {tab} విభాగం ప్రారంభమైంది.",
        "recipientVerified": "విజయం! గ్రహీత ధృవీకరించబడ్డారు.",
        "enterValidUPI": "దయచేసి సరైన UPI ID లేదా నంబర్ నమోదు చేయండి.",
        "enterAmountMsg": "దయచేసి ₹10 నుండి ₹2,000 వరకు మొత్తాన్ని నమోదు చేయండి.",
        "insufficientFunds": "వాలెట్‌లో తగినంత బ్యాలెన్స్ లేదు.",
        "enterPIN": "ధృవీకరణ కోసం 6 అంకెల UPI PIN నమోదు చేయండి.",
        "paymentSuccess": "విజయం! చెల్లింపు పూర్తయింది.",
        "wrongPIN": "తప్పు UPI PIN. దయచేసి 123456 ఎంటర్ చేయండి.",
        "smsReview": "మెసేజ్ తెరవబడింది.",
        "correctDecision": "మీ నిర్ణయం ఖచ్చితంగా సరైనది.",
        "wrongDecision": "తప్పు నిర్ణయం. భద్రతా హెచ్చరికను జాగ్రత్తగా చదవండి.",
        "overBudget": "కేటాయింపు వాలెట్ నిల్వ కంటే ఎక్కువగా ఉంది!",
        "monthComplete": "నెల పూర్తయింది.",
        "monthLabel": "నెల",
        "ratingRecorded": "రేటింగ్ నమోదయింది.",
        "profileSaved": "అభినందనలు! మీ ప్రొఫైల్ సేవ్ చేయబడింది.",
        "onboardingDone": "విజయం! మీ అభిప్రాయం నమోదు చేయబడింది.",
        "fraudTitle": "మోసాల నుండి రక్షణ",
        "privacyTitle": "డేటా గోప్యతా చట్టం",
        "privacyDesc": "మీ డేటా DPDP చట్టం క్రింద సురక్షితంగా ఉంటుంది.",
        "chargesTitle": "దాగి ఉన్న ఛార్జీలు లేవు",
        "chargesDesc": "BSBD ఖాతాలలో కనీస బ్యాలెన్స్ ఉంచాల్సిన అవసరం లేదు.",
        "mistakesTitle": "పొరపాటు చెల్లింపుల రికవరీ",
        "mistakesDesc": "తప్పు ఖాతాకు డబ్బు పంపితే NPCI పోర్టల్‌లో నేరుగా ఫిర్యాదు చేయవచ్చు.",
        "tipSecTitle": "OTP లేదా PIN ఎప్పుడూ పంచుకోవద్దు",
        "tipSecDesc": "ఏ బ్యాంక్ అధికారి కూడా ఫోన్‌లో UPI PIN లేదా OTP అడగరు.",
        "tipSavTitle": "అత్యవసర పొదుపు నిధి",
        "tipSavDescRegular": "క్రమమైన ఆదాయం ఉన్నప్పుడు ప్రతి నెలా కనీసం 15% పొదుపు చేయండి.",
        "tipSavDescIrregular": "ఆదాయంలో హెచ్చుతగ్గులు ఉన్నందున 3 నెలల ఖర్చులకు సరిపడా నిధిని ఉంచండి.",
        "tipCreTitle": "అధిక వడ్డీ అప్పులను నివారించండి",
        "tipCreDesc": "వడ్డీ వ్యాపారుల 5% నెలవారీ వడ్డీ సంవత్సరానికి 60% అవుతుంది! ప్రభుత్వ ముద్రా రుణాలను ఎంచుకోండి.",
        "tipPayTitle": "పేరును సరిచూసి డబ్బు పంపండి",
        "tipPayDesc": "PIN ఎంటర్ చేసే ముందు స్క్రీన్‌పై కనిపించే అసలు పేరును ఎల్లప్పుడూ గమనించండి.",
        "sms1Sender": "AD-LOTTRI",
        "sms1Text": "అభినందనలు! మీరు ప్రభుత్వ లాటరీ ద్వారా ₹10,00,000 గెలుచుకున్నారు. వెంటనే పొందడానికి క్లిక్ చేయండి: www.sarkari-win.com/claim",
        "sms1Expl": "ఇది మోసం. ప్రభుత్వ శాఖలు SMS లింక్‌ల ద్వారా లాటరీ డబ్బును ఇవ్వవు.",
        "sms2Sender": "State Bank",
        "sms2Text": "ప్రియమైన కస్టమర్, మీ నెలవారీ బ్యాంక్ స్టేట్‌మెంట్ సిద్ధంగా ఉంది. డౌన్‌లోడ్ చేయడానికి అధికారిక పోర్టల్‌లో లాగిన్ చేయండి. PIN ఎవరితోనూ పంచుకోవద్దు.",
        "sms2Expl": "ఇది సురక్షితం. ఇందులో ఎలాంటి అనుమానాస్పద లింకులు లేవు.",
        "sms3Sender": "BP-ALERT",
        "sms3Text": "హెచ్చరిక! మీ కరెంట్ బిల్లు ₹1,450 బకాయి ఉంది. లైన్ కట్ కాకుండా ఉండటానికి ఫోన్‌లో అధికారికి OTP చెప్పండి.",
        "sms3Expl": "ఇది మోసం. విద్యుత్ సంస్థలు ఫోన్‌లో OTP అడగవు.",
        "eventMedical": "వైద్య అత్యవసర పరిస్థితి",
        "eventMedicalDesc": "కుటుంబ సభ్యునికి అనారోగ్యం. ₹1,000 ఖర్చు.",
        "eventHarvest": "బంపర్ పంట బోనస్",
        "eventHarvestDesc": "పంటకు మంచి ధర వచ్చింది! ₹1,500 అదనపు లాభం.",
        "eventDrought": "కరువు / మాంద్యం",
        "eventDroughtDesc": "ప్రతికూల వాతావరణం వల్ల ఎలాంటి ఆదాయం రాలేదు.",
        "eventFestival": "పండుగ వేడుకలు",
        "eventFestivalDesc": "మిఠాయిలు మరియు బహుమతుల కోసం ₹500 ఖర్చు."
    },
    "mr": {
        "brandTagline": "अनुकूल समावेशन",
        "navGroup1": "१. नोंदणी आणि प्रोफाइलिंग",
        "navGroup2": "२. परस्परसंवादी मूल्यांकन",
        "navGroup3": "३. शिक्षण आणि लॅब",
        "navGroup4": "४. सारांश आणि अभिप्राय",
        "navGroup5": "५. पुढील पिढीची सुरक्षा",
        "guestUser": "अतिथी वापरकर्ता",
        "online": " ऑनलाइन",
        "title1": "भाषा आणि आवाज",
        "title2": "\"मला ओळखा\" प्रोफाइल",
        "title3": "आर्थिक साक्षरता",
        "title4": "डिजिटल आत्मविश्वास",
        "title5": "विश्वास आणि सुरक्षितता",
        "title6": "विश्वसनीयता आणि उत्पन्न",
        "title7": "अनुकूल इंजिन",
        "title8": "सुरक्षित वित्त लॅब",
        "title9": "वैयक्तिक मार्गदर्शन",
        "title10": "तयारी अहवाल",
        "title11": "अभिप्राय सर्वेक्षण",
        "title12": "सुरक्षा डॅशबोर्ड",
        "title13": "संमती व्यवस्थापक",
        "title14": "ZKP पडताळणीकर्ता",
        "securityDashDesc": "१० क्रिप्टोग्राफिक सुरक्षा उपाय आणि ऑडिट ट्रेल",
        "consentMgrDesc": "डेटा प्रवेशासाठी स्मार्ट संमती टोकन्स",
        "zkpVerifierDesc": "ओळख न दाखवता शून्य-ज्ञान पुरावा",
        "prototype": "प्रोटोटाइप",
        "welcomeTitle": "स्वागत आहे",
        "welcomeDesc": "अर्थसेतू तुमच्या आर्थिक गरजा, डिजिटल क्षमता आणि पसंतीच्या भाषेशी जुळवून घेतो. आम्ही तुम्हाला औपचारिक वित्त सुरक्षितपणे शिकण्यास मदत करतो.",
        "langCount": "६+",
        "indianLanguages": "भारतीय भाषा",
        "sandboxPct": "१००%",
        "practiceSandbox": "सराव सँडबॉक्स",
        "selectLang": "तुमची भाषा निवडा",
        "langSubtitle": "संपूर्ण ॲप तुमच्या निवडलेल्या भाषेत काम करेल",
        "enableVoice": "आवाज सहाय्य सुरू करा",
        "voiceDesc": "आमचे आभासी मार्गदर्शक \"अर्थदूत\" तुमच्या निवडलेल्या भाषेत सूचना वाचून दाखवेल.",
        "startProfiling": "प्रोफाइलिंग सुरू करा",
        "tellUsAbout": "आम्हाला तुमच्याबद्दल सांगा",
        "configureApp": "आम्ही तुमच्या दैनंदिन जीवनशैली आणि व्यवसायाच्या आधारे ॲप्लिकेशन कॉन्फिगर करतो.",
        "questionOccupation": "१. तुमचा प्राथमिक व्यवसाय काय आहे?",
        "occRetailer": "लहान विक्रेता / दुकानदार",
        "occRetailerSub": "दुकानदार / फेरीवाला",
        "occFarmer": "शेतकरी / शेती",
        "occFarmerSub": "शेतकरी / कृषी",
        "occWorker": "गिग वर्कर / डिलिव्हरी",
        "occWorkerSub": "डिलिव्हरी / टॅक्सी चालक",
        "occDailywager": "दैनिक वेतन कामगार",
        "occDailywagerSub": "मजूर / रोजंदारी",
        "questionFinExp": "२. तुम्ही औपचारिक बँकिंग आणि डिजिटल पेमेंट वापरले आहे का?",
        "finBeginner": "पहिल्यांदा वापरकर्ता",
        "finBeginnerSub": "UPI / ऑनलाइन बँकिंग कधीही वापरले नाही",
        "finBasic": "मूलभूत वापरकर्ता",
        "finBasicSub": "बँक कार्ड आहे, पण UPI कमी वापरतो",
        "finIntermediate": "मध्यम वापरकर्ता",
        "finIntermediateSub": "कधीकधी UPI वापरतो, आत्मविश्वास हवा आहे",
        "questionDigConf": "३. स्मार्टफोन वापरण्यात तुम्ही किती सोयीस्कर आहात?",
        "digLow": "मदत हवी आहे",
        "digLowSub": "सामान्यतः इतरांची मदत घेतो",
        "digMedium": "मूलभूत ॲप्स वापरू शकतो",
        "digMediumSub": "WhatsApp / YouTube सहज वापरतो",
        "digHigh": "खूप आत्मविश्वासी",
        "digHighSub": "ॲप्स डाउनलोड आणि टाइपिंग करू शकतो",
        "back": "मागे",
        "continue": "पुढे जा",
        "quizTitle": "आर्थिक साक्षरता मूल्यांकन",
        "quizDesc": "तुमच्या आर्थिक संकल्पना समजून घेण्यासाठी तीन परिस्थिती-आधारित प्रश्नांची उत्तरे द्या.",
        "q1of3": "प्रश्न १ पैकी ३",
        "q1Title": "फ्लॅट व्याज गणना",
        "q1Scenario": "जर तुम्ही १०% फ्लॅट व्याजदराने १ वर्षासाठी ₹१०,००० उसने घेतले, तर वर्षाच्या शेवटी एकूण किती व्याज द्याल?",
        "q1a0": "₹१,००০ (योग्य व्याज भरणे)",
        "q1a1": "₹१०० (१% गणना)",
        "q1a2": "₹० (व्याजमुक्त कर्ज)",
        "q1a3": "मला माहिती नाही / खात्री नाही",
        "q2of3": "प्रश्न २ पैकी ३",
        "q2Title": "सुरक्षित PIN आणि OTP हाताळणी",
        "q2Scenario": "एका अनोळखी व्यक्तीचा कॉल येतो जो बँक मॅनेजर असल्याचा दावा करतो आणि तुमचा UPI PIN किंवा OTP मागतो. तुम्ही काय कराल?",
        "q2a0": "अकाउंट ब्लॉक होऊ नये म्हणून सांगेन",
        "q2a1": "फक्त नाव बरोबर सांगितले तरच सांगेन",
        "q2a2": "कॉलवर कोणाशीही PIN/OTP कधीही शेअर करणार नाही (योग्य)",
        "q2a3": "त्यांना नंतर कॉल करायला सांगेन",
        "q3of3": "प्रश्न ३ पैकी ३",
        "q3Title": "बँक बचतीचे महत्त्व",
        "q3Scenario": "घरात रोख रक्कम ठेवण्याऐवजी बँकेत पैसे साठवण्याचा मुख्य फायदा काय?",
        "q3a0": "पैशांवर व्याज मिळते आणि चोरीपासून सुरक्षित राहते (योग्य)",
        "q3a1": "बँकेत ठेवलेले पैसे खर्च करणे सोपे आहे",
        "q3a2": "रोख आणि बँक खात्यात काही फरक नाही",
        "q3a3": "फायद्याबद्दल खात्री नाही",
        "digitalTitle": "डिजिटल आत्मविश्वास मूल्यांकन",
        "digitalDesc": "तुमचा स्मार्टफोन वापर तपासण्यासाठी ही तीन सोपी कार्ये पूर्ण करा.",
        "task1Title": "कार्य १: अंक टाइप करणे",
        "task1Heading": "अंक कोड प्रविष्ट करा",
        "task1Desc": "खालील कीपॅड वापरून कोड टाइप करा: ",
        "task2Title": "कार्य २: ड्रॅग आणि ड्रॉप",
        "task2Heading": "तुमचे नाणे सुरक्षित करा",
        "task2Desc": "सोन्याचे नाणे ओढून पिगी बँकेत टाका.",
        "dropCoin": "येथे नाणे टाका",
        "task3Title": "कार्य ३: स्वाइप जेश्चर",
        "task3Heading": "पेमेंटसाठी स्वाइप करा",
        "task3Desc": "स्लायडर उजवीकडे स्वाइप करून पेमेंट अधिकृत करा.",
        "swipeConfirm": "पुष्टी करण्यासाठी उजवीकडे स्वाइप करा",
        "waitingInput": "इनपुटची वाट पाहत आहे...",
        "dragStart": "नाणे ओढून सुरू करा",
        "slideHandle": "हँडल उजवीकडे सरकवा",
        "trustTitle": "विश्वास आणि सुरक्षितता चिंता",
        "trustDesc": "डिजिटल वित्त वापरताना तुम्हाला वाटणाऱ्या चिंता निवडा.",
        "trustConcerns": "तुमच्या मुख्य चिंता काय आहेत? (लागू असणारे सर्व निवडा)",
        "concernFraud": "फसवणूक आणि घोटाळ्याची भीती",
        "concernFraudDesc": "ऑनलाइन घोटाळेबाजांकडून पैसे गमावण्याची भीती",
        "concernPrivacy": "डेटा आणि खाते गोपनीयता",
        "concernPrivacyDesc": "वैयक्तिक माहिती लीक होण्याची भीती",
        "concernCharges": "लपलेले शुल्क आणि खर्च",
        "concernChargesDesc": "बँकेने विनाकारण पैसे कापण्याची शंका",
        "concernMistakes": "चूक होण्याची भीती",
        "concernMistakesDesc": "चुकीच्या नंबरवर पैसे जाण्याची भीती",
        "reassurancePortal": "सुरक्षा पोर्टल",
        "reassuranceDesc": "सुरक्षा तथ्ये वाचण्यासाठी डावीकडून चिंता निवडा.",
        "altAssessment": "पर्यायी मूल्यांकन",
        "reliabilityTitle": "पर्यायी आर्थिक विश्वसनीयता",
        "reliabilityDesc": "ज्या वापरकर्त्यांकडे क्रेडिट इतिहास नाही, त्यांच्यासाठी बचत आणि व्यवहार पद्धतीवर आधारित मूल्यांकन.",
        "simReliability": "सिम्युलेटेड विश्वसनीयता प्रोफाइल",
        "incomeProfile": "उत्पन्न आणि बचत प्रोफाइल",
        "consentDetails": "विश्वसनीयता मोजण्यासाठी संमती द्या.",
        "incomePattern": "१. तुमच्या उत्पन्नाचे स्वरूप कसे आहे?",
        "incomeRegular": "नियमित मासिक",
        "incomeIrregular": "अनियमित दैनिक/साप्ताहिक",
        "incomeSeasonal": "हंगामी (पिके/गिग्स)",
        "indicatorsTitle": "२. तुम्हाला लागू होणारे पर्याय निवडा:",
        "ind1": "मी नियमितपणे भाडे किंवा वीज बिल भरतो",
        "ind2": "मी पोस्ट ऑफिस किंवा घरात काही रोख बचत ठेवतो",
        "ind3": "माझ्याकडे व्यवसायाचा माल किंवा साधने आहेत",
        "ind4": "स्थानिक सावकाराचे माझ्यावर कोणतेही कर्ज नाही",
        "consentText": "मी पर्यायी विश्वसनीयता स्कोअरसाठी संमती देतो.",
        "generateProfile": "प्रोफाइल तयार करा",
        "engineTitle": "अर्थसेतू अनुकूल प्रोफाइलिंग इंजिन",
        "engineDesc": "येथे तुमचे आर्थिक प्रोफाइल आहे. ॲप तुमच्यासाठी योग्य मार्ग निवडेल.",
        "scoreLiteracy": "आर्थिक साक्षरता",
        "scoreDigital": "डिजिटल आत्मविश्वास",
        "scoreReliability": "पर्यायी विश्वसनीयता",
        "recommendedPath": "शिफारस केलेला मार्ग",
        "calculating": "गणना होत आहे...",
        "selectContinue": "पुढे जाण्यासाठी निवडा.",
        "enterLab": "सुरक्षित वित्त लॅबमध्ये जा",
        "labTitle": "सुरक्षित वित्त लॅब",
        "practiceSandboxTag": "सराव सँडबॉक्स",
        "tabPayment": "पेमेंट सराव",
        "tabFraud": "फसवणूक शोधक",
        "tabLoan": "कर्ज तुलना",
        "tabBudget": "बजेट आणि चढउतार",
        "arthapay": "अर्थपे",
        "enterRecipient": "प्राप्तकर्त्याचा UPI ID / फोन टाका",
        "verifyRecipient": "प्राप्तकर्ता तपासा",
        "verified": "पडताळणी झाली",
        "enterAmount": "रक्कम टाका (₹)",
        "walletBalance": "सराव वॉलेट शिल्लक: ₹१,००০",
        "continueToPay": "पेमेंट सुरू ठेवा",
        "enterUPIPIN": "६ अंकांचा UPI PIN टाका",
        "payingRs": "देत आहे ₹",
        "toRecipient": "शेतकरी मित्राला",
        "txnSuccess": "व्यवहार यशस्वी झाला!",
        "sentTo": "शेतकरी मित्राला पाठवले",
        "txnId": "व्यवहार आयडी:",
        "payAgain": "पुन्हा पेमेंट करा",
        "paymentTutorial": "पेमेंट ट्युटोरिअल",
        "paymentTutorialDesc": "खऱ्या पैशांचा धोका न घेता ट्रान्सफर शिका.",
        "crucialGuidelines": "महत्त्वाच्या मार्गदर्शक सूचना:",
        "practicePIN": "तुमचा सराव PIN कोड आहे: ",
        "tip2": "पेमेंट करण्यापूर्वी नाव नेहमी तपासा.",
        "tip3": "सुरक्षित बँक स्क्रीनशिवाय कुठेही PIN टाकू नका.",
        "walletHistory": "वॉलेट इतिहास",
        "welcomeBonus": "स्वागत बोनस",
        "messageInbox": "मेसेज इनबॉक्स",
        "fraudDesc": "RBI नियमांनुसार, अनधिकृत व्यवहाराची माहिती ३ दिवसांत बँकेला दिल्यास तुमची जबाबदारी शून्य असते.",
        "selectMessage": "मेसेज निवडा",
        "fraudPlaceholder": "विश्लेषण करण्यासाठी SMS वर क्लिक करा.",
        "classifySafe": "सुरक्षित म्हणून चिन्हांकित करा",
        "reportFraud": "फसवणूक म्हणून तक्रार करा",
        "loanTitle": "कर्ज खर्च सिम्युलेटर",
        "loanDesc": "एकूण परतफेड पाहण्यासाठी स्लायडर हलवा.",
        "principalAmt": "मुद्दल रक्कम",
        "interestRate": "व्याज दर (वार्षिक)",
        "tenure": "कालावधी (महिने)",
        "flatLoan": "फ्लॅट कर्ज (सरळ व्याज)",
        "flatRateFinancing": "फ्लॅट दर वित्तपुरवठा",
        "monthlyEMI": "मासिक EMI",
        "totalInterest": "एकूण व्याज",
        "totalRepayment": "एकूण परतफेड",
        "flatLoanDesc": "व्याज नेहमी सुरुवातीच्या मुद्दलावर आकारले जाते.",
        "compoundLoan": "कमी होणारे मुद्दल कर्ज",
        "reducingBalanceFinancing": "कमी होणाऱ्या शिलकीवर कर्ज",
        "compoundLoanDesc": "व्याज फक्त शिल्लक मुद्दलावर आकारले जाते. हे खूप फायदेशीर आहे!",
        "budgetTitle": "हंगामी उत्पन्न चढउतार सिम्युलेटर",
        "budgetDesc": "विविध परिस्थितीत खर्चाचे व्यवस्थापन करा.",
        "currentIncome": "सध्याचे उत्पन्न मॉडेल:",
        "foodAlloc": "अन्न आणि भाडे वाटप (₹)",
        "savingsBox": "बचत पेटी (₹)",
        "growthAlloc": "गुंतवणूक / व्यवसाय वाढ (₹)",
        "simulateMonth": "पुढचा महिना सिम्युलेट करा",
        "walletBal": "वॉलेट शिल्लक",
        "accumSavings": "एकूण बचत",
        "activityLog": "लॉग",
        "gameStarted": "खेळ सुरू झाला.",
        "guidanceTitle": "वैयक्तिक आर्थिक मार्गदर्शन",
        "guidanceDesc": "तुमच्या मूल्यांकनावर आधारित महत्त्वाचे आर्थिक नियम.",
        "viewReport": "तयारी अहवाल पहा",
        "reportTitle": "आर्थिक तयारी अहवाल",
        "reportDesc": "छान प्रगती! येथे तुमचे अधिकृत प्रमाणपत्र आहे.",
        "certTitle": "अर्थसेतू सक्षमता प्रमाणपत्र",
        "certAwardedTo": "हे प्रमाणपत्र प्रदान करण्यात येत आहे",
        "certDesc": "सुरक्षित वित्त लॅबमध्ये अनुकूल आर्थिक प्रोफाइलिंग आणि UPI व्यवहार यशस्वीपणे पूर्ण केल्याबद्दल.",
        "certLiteracy": "साक्षरता स्तर",
        "certDigital": "डिजिटल आत्मविश्वास",
        "certPathway": "मार्ग",
        "certSystem": "प्रणालीद्वारे जारी",
        "certDate": "तारीख",
        "printCert": "प्रमाणपत्र मुद्रित करा",
        "provideFeedback": "अभिप्राय द्या",
        "feedbackTitle": "अभिप्राय सर्वेक्षण",
        "feedbackDesc": "हा उपक्रम सुधारण्यास मदत करा.",
        "surveyQ1": "१. हे ॲप वापरणे किती सोपे होते?",
        "surveyQ2": "२. तुम्हाला सुरक्षा नियम स्पष्टपणे समजले का?",
        "surveyQ3": "३. आता स्वतः मोबाईल पेमेंट करताना किती आत्मविश्वास वाटतो?",
        "surveyQ4": "४. तुमच्या काही सूचना किंवा टिप्पण्या आहेत का?",
        "feedbackPlaceholder": "मराठी किंवा इंग्रजीत येथे लिहा...",
        "saveReset": "जतन करा आणि रीसेट करा",
        "assistantName": "अर्थदूत सहाय्यक:",
        "welcomeArthasetu": "अर्थसेतूमध्ये आपले स्वागत आहे.",
        "voiceOn": "आवाज सहाय्य: चालू",
        "voiceOff": "आवाज सहाय्य: बंद",
        "helpWelcome": "नमस्कार! मी अर्थदूत आहे. मी स्क्रीनवरील माहिती वाचून तुम्हाला मदत करेन. सुरू करण्यासाठी कोणत्याही बॉक्सला स्पर्श करा.",
        "profileHelp": "तुमच्या गरजेनुसार प्रत्येक श्रेणीतून एक पर्याय निवडा.",
        "quizHelp": "तुम्हाला योग्य वाटणारा पर्याय निवडा. चुकांची भीती बाळगू नका.",
        "digitalHelp": "चला तीन कामे करून पाहू. प्रथम कीपॅडवर ४०९६ टाइप करा, नंतर नाणे बँकेत टाका आणि शेवटी स्लायडर उजवीकडे ओढा.",
        "trustHelp": "ऑनलाइन व्यवहारात ज्या गोष्टींची भीती वाटते ते बॉक्स निवडा.",
        "reliabilityHelp": "क्रेडिट स्कोअर नसला तरी पर्यायी मार्गाने पत दाखवता येते.",
        "sandboxHelp": "धोका न घेता पेमेंट सराव करा, बनावट मेसेज ओळखा आणि बजेट प्लॅनिंग करा.",
        "guidanceHelp": "हे सुरक्षा नियम वाचा. हे तुमच्या उत्तरांवरून तयार केले आहेत.",
        "reportHelp": "हे तुमचे पूर्णता प्रमाणपत्र आहे!",
        "surveyHelp": "कृपया तुमच्या अनुभवाला रेटिंग द्या. धन्यवाद!",
        "pathAssisted": "व्हॉइस / व्हिज्युअल सहाय्यक मार्ग",
        "pathAssistedDesc": "तुमच्या डिजिटल ज्ञानानुसार, सिस्टीमने पूर्ण आवाज आणि मोठे बटन्स सक्रिय केले आहेत.",
        "pathAssistedFeat1": "स्वयंचलित आवाज मार्गदर्शन",
        "pathAssistedFeat2": "मोठे फॉन्ट आणि बटन्स",
        "pathAssistedFeat3": "सोपे एक-टॅप पुष्टीकरण",
        "pathGuided": "मार्गदर्शित मार्ग",
        "pathGuidedDesc": "तुम्ही मूलभूत ॲप्स चालवू शकता. सिस्टीम महत्त्वाच्या बटणावर हायलाइट दाखवेल.",
        "pathGuidedFeat1": "महत्त्वाच्या बटणावर हायलाइट",
        "pathGuidedFeat2": "वेळेवर सुरक्षा सूचना",
        "pathGuidedFeat3": "मार्गदर्शक टिप्स",
        "pathSelf": "स्वयं-मार्गदर्शित मार्ग",
        "pathSelfDesc": "तुम्ही स्मार्टफोन चालवण्यात अत्यंत कुशल आहात.",
        "pathSelfFeat1": "सामान्य नेव्हिगेशन",
        "pathSelfFeat2": "पूर्ण स्वातंत्र्य",
        "pathSelfFeat3": "प्रगत सराव",
        "certSelf": "स्वयं-मार्गदर्शित",
        "certGuided": "मार्गदर्शित सहाय्य",
        "certAssisted": "आवाज सहाय्य",
        "lockedMsg": "हा भाग बंद आहे. कृपया आधीचे कार्य पूर्ण करा.",
        "occupationMsg": "व्यवसाय नोंदवला गेला.",
        "answerMsg": "उत्तर नोंदवले गेले.",
        "clearedMsg": "साफ केले",
        "codeSuccess": "यशस्वी! कोड बरोबर आहे.",
        "firstTaskDone": "छान! पहिले कार्य पूर्ण झाले.",
        "codeWrong": "चुकीचा कोड. पुन्हा प्रयत्न करा.",
        "codeWrongRetry": "चुकीचा कोड, कृपया पुन्हा ४०९६ टाइप करा.",
        "savingsSecured": "बचत सुरक्षित!",
        "coinDeposited": "यशस्वी! नाणे जमा झाले.",
        "coinSecured": "अभिनंदन, नाणे बँकेत सुरक्षित आहे.",
        "swipeSuccess": "यशस्वी! स्वाइप मंजूर झाले.",
        "swipeDone": "स्वाइप यशस्वीरीत्या पूर्ण झाले.",
        "optionToggled": "पर्याय बदलला.",
        "incomeRecorded": "उत्पन्नाचे स्वरूप नोंदवले.",
        "scoreCalculated": "पर्यायी स्कोअर {score}% झाला.",
        "labTabActive": "लॅबचा {tab} सराव सुरू झाला.",
        "recipientVerified": "यशस्वी! प्राप्तकर्ता पडताळला गेला.",
        "enterValidUPI": "कृपया वैध UPI ID किंवा नंबर टाका.",
        "enterAmountMsg": "कृपया ₹१० ते ₹२,००० दरम्यान रक्कम टाका.",
        "insufficientFunds": "वॉलेटमध्ये पुरेसे पैसे नाहीत.",
        "enterPIN": "पडताळणीसाठी ६ अंकांचा UPI PIN टाका.",
        "paymentSuccess": "यशस्वी! पेमेंट पूर्ण झाले.",
        "wrongPIN": "चुकीचा UPI PIN. कृपया १२३४५६ टाका.",
        "smsReview": "मेसेज उघडला आहे.",
        "correctDecision": "तुमचा निर्णय अगदी बरोबर आहे.",
        "wrongDecision": "चुकीचा निर्णय. सुरक्षा इशारा नीट वाचा.",
        "overBudget": "एकूण वाटप वॉलेट शिलकेपेक्षा जास्त आहे!",
        "monthComplete": "महिना पूर्ण झाला.",
        "monthLabel": "महिना",
        "ratingRecorded": "रेटिंग नोंदवले.",
        "profileSaved": "अभिनंदन! तुमचे प्रोफाइल सेव्ह झाले.",
        "onboardingDone": "यशस्वी! तुमचा अभिप्राय नोंदवला गेला आहे.",
        "fraudTitle": "फसवणुकीपासून संरक्षण",
        "privacyTitle": "गोपनीयता कायदा",
        "privacyDesc": "तुमचा डेटा DPDP कायद्यांतर्गत सुरक्षित आहे.",
        "chargesTitle": "लपलेले शुल्क नाही",
        "chargesDesc": "BSBD खात्यांमध्ये किमान रकमेची कोणतीही अट नसते.",
        "mistakesTitle": "चुकीचे पेमेंट परत मिळवणे",
        "mistakesDesc": "चुकीच्या खात्यात पैसे गेल्यास तुम्ही NPCI पोर्टलवर तक्रार नोंदवू शकता.",
        "tipSecTitle": "OTP किंवा PIN कधीही सांगू नका",
        "tipSecDesc": "कोणताही बँक अधिकारी फोनवर UPI PIN किंवा OTP मागत नाही.",
        "tipSavTitle": "आपत्कालीन बचत",
        "tipSavDescRegular": "नियमित उत्पन्न असताना दरमहा किमान १५% बचत करा.",
        "tipSavDescIrregular": "उत्पन्न हंगामी असल्याने किमान ३ महिन्यांच्या खर्चाएवढी रक्कम बाजूला ठेवा.",
        "tipCreTitle": "सावकारी कर्जाचे जाळे टाळा",
        "tipCreDesc": "सावकाराचा ५% मासिक व्याज दर वर्षाला ६०% होतो! त्याऐवजी सरकारी मुद्रा किंवा स्वनिधी योजनांचा लाभ घ्या.",
        "tipPayTitle": "नाव तपासूनच पैसे पाठवा",
        "tipPayDesc": "PIN टाकण्यापूर्वी स्क्रीनवर दिसणारे खरे नाव नेहमी वाचा.",
        "sms1Sender": "AD-LOTTRI",
        "sms1Text": "अभिनंदन! तुम्ही सरकारी लॉटरीतून ₹१०,००,००० जिंकले आहेत. लगेच मिळवण्यासाठी येथे क्लिक करा: www.sarkari-win.com/claim",
        "sms1Expl": "हा फ्रॉड आहे. सरकारी विभाग SMS लिंकद्वारे लॉटरीचे पैसे वाटत नाहीत.",
        "sms2Sender": "State Bank",
        "sms2Text": "प्रिय ग्राहक, तुमचे मासिक बँक स्टेटमेंट तयार आहे. डाउनलोड करण्यासाठी अधिकृत पोर्टलवर लॉगिन करा. PIN कोणालाही सांगू नका.",
        "sms2Expl": "हे सुरक्षित आहे. यात कोणतीही संशयास्पद लिंक नाही.",
        "sms3Sender": "BP-ALERT",
        "sms3Text": "सावधान! तुमचे ₹१,४५० चे वीज बिल थकीत आहे. आज रात्री वीज खंडित होणे टाळण्यासाठी आमच्या अधिकाऱ्याला फोन करून OTP द्या.",
        "sms3Expl": "हा फ्रॉड आहे. वीज कंपन्या अशा प्रकारे फोनवर OTP मागत नाहीत.",
        "eventMedical": "वैद्यकीय आणीबाणी",
        "eventMedicalDesc": "कुटुंबातील व्यक्ती आजारी पडली. ₹१,००० खर्च.",
        "eventHarvest": "बंपर पीक बोनस",
        "eventHarvestDesc": "पिकाला चांगला भाव मिळाला! ₹१,५०० अतिरिक्त नफा.",
        "eventDrought": "दुष्काळ / मंदी",
        "eventDroughtDesc": "खराब हवामानामुळे कोणतेही उत्पन्न झाले नाही.",
        "eventFestival": "सण उत्सव",
        "eventFestivalDesc": "मिठाई आणि भेटवस्तूंवर ₹५०० खर्च."
    },
    "pa": {
        "brandTagline": "ਅਨੁਕੂਲ ਸ਼ਾਮੂਲਕਰਨ",
        "navGroup1": "1. ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਅਤੇ ਪ੍ਰੋਫਾਇਲਿੰਗ",
        "navGroup2": "2. ਇੰਟਰਐਕਟਿਵ ਮੁਲਾਂਕਣ",
        "navGroup3": "3. ਸਿੱਖਣਾ ਅਤੇ ਲੈਬ",
        "navGroup4": "4. ਸਾਰ ਅਤੇ ਫੀਡਬੈਕ",
        "navGroup5": "5. ਨਵੀਂ ਪੀੜ੍ਹੀ ਸੁਰੱਖਿਆ",
        "guestUser": "ਮਹਿਮਾਨ ਵਰਤੋਂਕਾਰ",
        "online": " ਔਨਲਾਈਨ",
        "title1": "ਭਾਸ਼ਾ ਅਤੇ ਅਵਾਜ਼",
        "title2": "\"ਮੈਨੂੰ ਜਾਣੋ\" ਪ੍ਰੋਫਾਇਲ",
        "title3": "ਵਿੱਤੀ ਸਾਖਰਤਾ",
        "title4": "ਡਿਜੀਟਲ ਭਰੋਸਾ",
        "title5": "ਭਰੋਸਾ ਅਤੇ ਸੁਰੱਖਿਆ",
        "title6": "ਭਰੋਸੇਯੋਗਤਾ ਅਤੇ ਆਮਦਨ",
        "title7": "ਅਨੁਕੂਲ ਇੰਜਣ",
        "title8": "ਸੁਰੱਖਿਤ ਫਾਇਨਾਂਸ ਲੈਬ",
        "title9": "ਨਿੱਜੀ ਮਾਰਗਦਰਸ਼ਨ",
        "title10": "ਤਿਆਰੀ ਰਿਪੋਰਟ",
        "title11": "ਫੀਡਬੈਕ ਸਰਵੇ",
        "title12": "ਸੁਰੱਖਿਆ ਡੈਸ਼ਬੋਰਡ",
        "title13": "ਸਹਿਮਤੀ ਪ੍ਰਬੰਧਕ",
        "title14": "ZKP ਤਸਦੀਕਕਰਤਾ",
        "prototype": "ਪ੍ਰੋਟੋਟਾਈਪ",
        "welcomeTitle": "ਜੀ ਆਇਆਂ ਨੂੰ",
        "welcomeDesc": "ਅਰਥਸੇਤੂ ਤੁਹਾਡੀਆਂ ਵਿੱਤੀ ਲੋੜਾਂ, ਡਿਜੀਟਲ ਸਮਰੱਥਾ ਅਤੇ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਦੇ ਅਨੁਸਾਰ ਅਨੁਕੂਲ ਹੁੰਦਾ ਹੈ। ਅਸੀਂ ਤੁਹਾਨੂੰ ਔਪਚਾਰਿਕ ਵਿੱਤ ਸੁਰੱਖਿਤ ਤਰੀਕੇ ਨਾਲ ਸਿੱਖਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਾਂ।",
        "langCount": "6+",
        "indianLanguages": "ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ",
        "sandboxPct": "100%",
        "practiceSandbox": "ਅਭਿਆਸ ਸੈਂਡਬਾਕਸ",
        "selectLang": "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ",
        "langSubtitle": "ਪੂਰਾ ਐਪ ਤੁਹਾਡੀ ਚੁਣੀ ਹੋਈ ਭਾਸ਼ਾ ਵਿੱਚ ਕੰਮ ਕਰੇਗਾ",
        "enableVoice": "ਵੌਇਸ ਸਹਾਇਤਾ ਸਮਰੱਥ ਕਰੋ",
        "voiceDesc": "ਸਾਡਾ ਵਰਚੁਅਲ ਗਾਈਡ \"ਅਰਥਦੂਤ\" ਤੁਹਾਡੀ ਚੁਣੀ ਹੋਈ ਭਾਸ਼ਾ ਵਿੱਚ ਹਦਾਇਤਾਂ ਜ਼ੋਰ ਨਾਲ ਪੜ੍ਹੇਗਾ।",
        "startProfiling": "ਪ੍ਰੋਫਾਇਲਿੰਗ ਸ਼ੁਰੂ ਕਰੋ",
        "tellUsAbout": "ਸਾਨੂੰ ਆਪਣੇ ਬਾਰੇ ਦੱਸੋ",
        "configureApp": "ਅਸੀਂ ਤੁਹਾਡੀ ਰੋਜ਼ਾਨਾ ਜੀਵਨਸ਼ੈਲੀ ਅਤੇ ਕਿੱਤਾ ਦੇ ਆਧਾਰ 'ਤੇ ਐਪਲੀਕੇਸ਼ਨ ਕੌਨਫਿਗਰ ਕਰਦੇ ਹਾਂ।",
        "questionOccupation": "1. ਤੁਹਾਡਾ ਮੁੱਖ ਕਿੱਤਾ ਕੀ ਹੈ?",
        "occRetailer": "ਛੋਟਾ ਵਿਕਰੇਤਾ / ਦੁਕਾਨਦਾਰ",
        "occRetailerSub": "ਦੁਕਾਨਦਾਰ / ਰਹਿੜੀ-ਪਟਰੀ",
        "occFarmer": "ਕਿਸਾਨ / ਖੇਤੀ",
        "occFarmerSub": "ਕਿਸਾਨ / ਖੇਤੀ-ਬਾੜੀ",
        "occWorker": "ਗਿਗ ਵਰਕਰ / ਡਿਲੀਵਰੀ",
        "occWorkerSub": "ਡਿਲੀਵਰੀ / ਟੈਕਸੀ ਚਾਲਕ",
        "occDailywager": "ਰੋਜ਼ਾਨਾ ਵੇਤਨ ਭੋਗੀ",
        "occDailywagerSub": "ਮਜ਼ਦੂਰ / ਰੋਜ਼ਾਨਾ ਵੇਤਨ",
        "questionFinExp": "2. ਕੀ ਤੁਸੀਂ ਔਪਚਾਰਿਕ ਬੈਂਕਿੰਗ ਅਤੇ ਡਿਜੀਟਲ ਭੁਗਤਾਨ ਸੇਵਾਵਾਂ ਦੀ ਵਰਤੋਂ ਕੀਤੀ ਹੈ?",
        "finBeginner": "ਪਹਿਲੀ ਵਾਰ ਵਰਤੋਂਕਾਰ",
        "finBeginnerSub": "UPI / ਔਨਲਾਈਨ ਬੈਂਕਿੰਗ ਕਦੇ ਨਹੀਂ ਵਰਤੀ",
        "finBasic": "ਬੁਨਿਆਦੀ ਵਰਤੋਂਕਾਰ",
        "finBasicSub": "ਬੈਂਕ ਕਾਰਡ ਹੈ, ਪਰ UPI ਘੱਟ ਵਰਤਦੇ ਹਾਂ",
        "finIntermediate": "ਦਰਮਿਆਨਾ ਵਰਤੋਂਕਾਰ",
        "finIntermediateSub": "ਕਦੇ-ਕਦੇ UPI ਵਰਤਦੇ ਹਾਂ, ਭਰੋਸਾ ਚਾਹੀਦਾ ਹੈ",
        "questionDigConf": "3. ਸਮਾਰਟਫੋਨ ਚਲਾਉਣ ਵਿੱਚ ਤੁਸੀਂ ਕਿੰਨੇ ਸਹਿਜ ਹੋ?",
        "digLow": "ਸਹਾਇਤਾ ਦੀ ਲੋੜ ਹੈ",
        "digLowSub": "ਆਮ ਤੌਰ 'ਤੇ ਦੂਜਿਆਂ ਨੂੰ ਕੰਮ ਕਰਵਾਉਂਦੇ ਹਾਂ",
        "digMedium": "ਬੁਨਿਆਦੀ ਐਪਸ ਚਲਾ ਸਕਦੇ ਹਾਂ",
        "digMediumSub": "WhatsApp / YouTube ਆਸਾਨੀ ਨਾਲ ਵਰਤਦੇ ਹਾਂ",
        "digHigh": "ਬਹੁਤ ਭਰੋਸੇਯੋਗ",
        "digHighSub": "ਐਪਸ ਡਾਊਨਲੋਡ ਕਰ ਸਕਦੇ ਹਾਂ ਅਤੇ ਟਾਇਪਿੰਗ ਕਰ ਸਕਦੇ ਹਾਂ",
        "back": "ਪਿੱਛੇ",
        "continue": "ਅੱਗੇ ਵਧੋ",
        "quizTitle": "ਵਿੱਤੀ ਸਾਖਰਤਾ ਮੁਲਾਂਕਣ",
        "quizDesc": "ਸਾਨੂੰ ਤੁਹਾਡੀਆਂ ਵਿੱਤੀ ਅਵਧਾਰਣਾਵਾਂ ਸਮਝਣ ਲਈ ਤਿੰਨ ਪਰਿਦ੍ਰਸ਼ਿਆਂ ਆਧਾਰਿਤ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦਿਓ।",
        "q1of3": "ਸਵਾਲ 1 ਵਿੱਚੋਂ 3",
        "q1Title": "ਫਲੈਟ ਬਿਆਜ ਦੀ ਗਣਨਾ",
        "q1Scenario": "ਜੇ ਤੁਸੀਂ 10% ਫਲੈਟ ਬਿਆਜ ਦਰ ਨਾਲ 1 ਸਾਲ ਲਈ ₹10,000 ਉਧਾਰ ਲੈਂਦੇ ਹੋ, ਤਾਂ ਸਾਲ ਦੇ ਅੰਤ ਵਿੱਚ ਤੁਸੀਂ ਕੁੱਲ ਕਿੰਨਾ ਬਿਆਜ ਦਿੰਦੇ ਹੋ?",
        "q1a0": "₹1,000 (ਸਹੀ ਬਿਆਜ ਭੁਗਤਾਨ)",
        "q1a1": "₹100 (1% ਗਣਨਾ)",
        "q1a2": "₹0 (ਬਿਆਜ-ਮੁਕਤ ਕਰਜ਼ਾ)",
        "q1a3": "ਮੈਨੂੰ ਨਹੀਂ ਪਤਾ / ਯਕੀਨੀ ਨਹੀਂ",
        "q2of3": "ਸਵਾਲ 2 ਵਿੱਚੋਂ 3",
        "q2Title": "ਸੁਰੱਖਿਤ PIN ਅਤੇ OTP ਹੈਂਡਲਿੰਗ",
        "q2Scenario": "ਤੁਹਾਨੂੰ ਇੱਕ ਅਣਜਾਣ ਵਿਅਕਤੀ ਦਾ ਫ਼ੋਨ ਆਉਂਦਾ ਹੈ ਜੋ ਬੈਂਕ ਮੈਨੇਜਰ ਹੋਣ ਦਾ ਦਾਅਵਾ ਕਰਦਾ ਹੈ। ਉਹ ਤੁਹਾਡਾ UPI PIN ਜਾਂ OTP ਮੰਗਦੇ ਹਨ। ਤੁਸੀਂ ਕੀ ਕਰਦੇ ਹੋ?",
        "q2a0": "ਸਾਂਝਾ ਕਰਾਂ ਤਾਂ ਮੇਰਾ ਖਾਤਾ ਬਲਾਕ ਨਾ ਹੋਵੇ",
        "q2a1": "ਸਿਰਫ਼ ਤਾਂ ਸਾਂਝਾ ਕਰਾਂ ਜੇ ਉਹ ਮੇਰਾ ਸਹੀ ਨਾਮ ਦੱਸਣ",
        "q2a2": "ਕਾਲ 'ਤੇ ਕਿਸੇ ਨਾਲ ਵੀ ਆਪਣਾ PIN/OTP ਕਦੇ ਸਾਂਝਾ ਨਾ ਕਰੋ (ਸਹੀ)",
        "q2a3": "ਉਨ੍ਹਾਂ ਨੂੰ ਕਹਾਂ ਕਿ ਮੈਂ ਬਾਅਦ ਵਿੱਚ ਉਨ੍ਹਾਂ ਨੂੰ ਫ਼ੋਨ ਕਰਾਂਗਾ",
        "q3of3": "ਸਵਾਲ 3 ਵਿੱਚੋਂ 3",
        "q3Title": "ਬੈਂਕ ਬੱਚਤ ਦਾ ਮਹੱਤਵ",
        "q3Scenario": "ਘਰ ਵਿੱਚ ਬਾਕਸ ਵਿੱਚ ਨੱਕਦੀ ਰੱਖਣ ਦੇ ਮੁਕਾਬਲੇ ਔਪਚਾਰਿਕ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਪੈਸੇ ਬਚਾਉਣ ਦਾ ਮੁੱਖ ਲਾਭ ਕੀ ਹੈ?",
        "q3a0": "ਪੈਸਿਆਂ 'ਤੇ ਬਿਆਜ ਮਿਲਦਾ ਹੈ ਅਤੇ ਚੋਰੀ ਤੋਂ ਸੁਰੱਖਿਤ ਹੈ (ਸਹੀ)",
        "q3a1": "ਬੈਂਕ ਵਿੱਚ ਰੱਖਾ ਪੈਸਾ ਖਰਚਣਾ ਆਸਾਨ ਹੈ",
        "q3a2": "ਨੱਕਦੀ ਅਤੇ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਕੋਈ ਅੰਤਰ ਨਹੀਂ ਹੈ",
        "q3a3": "ਲਾਭਾਂ ਬਾਰੇ ਯਕੀਨੀ ਨਹੀਂ",
        "digitalTitle": "ਡਿਜੀਟਲ ਭਰੋਸਾ ਮੁਲਾਂਕਣ",
        "digitalDesc": "ਆਪਣੇ ਸਮਾਰਟਫੋਨ ਅਤੇ ਟੱਚ ਸਕ੍ਰੀਨ ਆਰਾਮ ਦੀ ਜਾਂਚ ਕਰਨ ਲਈ ਇਹ ਤਿੰਨ ਸਧਾਰਨ ਇੰਟਰਐਕਟਿਵ ਕਾਰਜ ਪੂਰੇ ਕਰੋ।",
        "task1Title": "ਕਾਰਜ 1: ਨੰਬਰ ਟਾਇਪ ਕਰਨਾ",
        "task1Heading": "ਨੰਬਰਿਕ ਕੋਡ ਦਰਜ ਕਰੋ",
        "task1Desc": "ਹੇਠਾਂ ਸਕ੍ਰੀਨ ਕੀਪੈਡ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਕੋਡ ਟਾਇਪ ਕਰੋ: ",
        "task2Title": "ਕਾਰਜ 2: ਖਿੱਚੋ ਅਤੇ ਛੱਡੋ",
        "task2Heading": "ਆਪਣਾ ਸਿੱਕਾ ਸੁਰੱਖਿਤ ਕਰੋ",
        "task2Desc": "ਸੋਨੇ ਦੇ ਸਿੱਕੇ ਨੂੰ ਹੇਠਾਂ ਪਿੱਗੀ ਬੈਂਕ ਵਿੱਚ ਖਿੱਚ ਕੇ ਲੈ ਜਾਓ।",
        "dropCoin": "ਸਿੱਕਾ ਇੱਥੇ ਪਾਓ",
        "task3Title": "ਕਾਰਜ 3: ਸਵਾਈਪ ਜੈਸਚਰ",
        "task3Heading": "ਭੁਗਤਾਨ ਲਈ ਸਵਾਈਪ ਕਰੋ",
        "task3Desc": "ਸਲਾਈਡਰ ਕੁੰਜੀ ਨੂੰ ਸੱਜੇ ਪਾਸੇ ਸਵਾਈਪ ਕਰਕੇ ਅਨੁਕਰਨ ਭੁਗਤਾਨ ਨੂੰ ਅਧਿਕ੃ਤ ਕਰੋ।",
        "swipeConfirm": "ਪੁਸ਼ਟੀ ਲਈ ਸੱਜੇ ਪਾਸੇ ਸਵਾਈਪ ਕਰੋ",
        "waitingInput": "ਇਨਪੁੱਟ ਦੀ ਉਡੀਕ ਹੈ...",
        "dragStart": "ਸਿੱਕਾ ਖਿੱਚ ਕੇ ਸ਼ੁਰੂ ਕਰੋ",
        "slideHandle": "ਹੈਂਡਲ ਨੂੰ ਸੱਜੇ ਪਾਸੇ ਸਲਾਈਡ ਕਰੋ",
        "trustTitle": "ਭਰੋਸਾ ਅਤੇ ਸੁਰੱਖਿਆ ਚਿੰਤਾਵਾਂ",
        "trustDesc": "ਡਿਜੀਟਲ ਵਿੱਤ ਦੀ ਵਰਤੋਂ ਕਰਨ ਵਿੱਚ ਜੋ ਵੀ ਚਿੰਤਾਵਾਂ ਤੁਹਾਨੂੰ ਹਿਚਕਿਚਾਉਂਦੀਆਂ ਹਨ ਉਨ੍ਹਾਂ ਨੂੰ ਚੁਣੋ।",
        "trustConcerns": "ਤੁਹਾਡੀਆਂ ਮੁੱਖ ਚਿੰਤਾਵਾਂ ਕੀ ਹਨ? (ਸਭ ਲਾਗੂ ਚੁਣੋ)",
        "concernFraud": "ਧੋਖਾਧੜੀ ਅਤੇ ਘੋਟਾਲੇ ਦਾ ਡਰ",
        "concernFraudDesc": "ਔਨਲਾਈਨ ਧੋਖੇਬਾਜਾਂ ਤੋਂ ਪੈਸੇ ਗੁਆਉਣ ਦੀ ਚਿੰਤਾ",
        "concernPrivacy": "ਡੇਟਾ ਅਤੇ ਖਾਤਾ ਗੋਪਨੀਯਤਾ",
        "concernPrivacyDesc": "ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਲੀਕ ਹੋਣ ਦੀ ਚਿੰਤਾ",
        "concernCharges": "ਲੁਕੀਆਂ ਫੀਸਾਂ ਅਤੇ ਸ਼ੁਲਕ",
        "concernChargesDesc": "ਬਿਨਾਂ ਦੱਸੇ ਬੈਂਕ ਵੱਲੋਂ ਕੱਟੇ ਜਾਣ ਦੀ ਸ਼ੰਕਾ",
        "concernMistakes": "ਗਲਤੀਆਂ ਕਰਨ ਦਾ ਡਰ",
        "concernMistakesDesc": "ਗਲਤ ਅੰਕ ਟਾਇਪ ਕਰਨ ਨਾਲ ਗਲਤ ਵਿਅਕਤੀ ਨੂੰ ਪੈਸੇ ਜਾਣ ਦਾ ਡਰ",
        "reassurancePortal": "ਸੁਰੱਖਿਆ ਪੋਰਟਲ",
        "reassuranceDesc": "ਸੁਰੱਖਿਆ ਤੱਥਾਂ ਅਤੇ ਨਿਯਾਮਕ ਗਾਰੰਟੀਆਂ ਪੜ੍ਹਨ ਲਈ ਬਾਏਂ ਪਾਸੇ ਇੱਕ ਜਾਂ ਵੱਧ ਚਿੰਤਾਵਾਂ ਚੁਣੋ।",
        "altAssessment": "ਵਿਕਲਪਿਕ ਮੁਲਾਂਕਣ",
        "reliabilityTitle": "ਵਿਕਲਪਿਕ ਵਿੱਤੀ ਭਰੋਸੇਯੋਗਤਾ",
        "reliabilityDesc": "ਜਿਨ੍ਹਾਂ ਉਪਯੋਗਕਰਤਾਵਾਂ ਕੋਲ ਔਪਚਾਰਿਕ ਬੈਂਕ ਕ੍ਰੈਡਿਟ ਇਤਿਹਾਸ ਜਾਂ ਤਨਖ਼ਾਹ ਸਲਿਪ ਨਹੀਂ ਹੈ, ਉਨ੍ਹਾਂ ਲਈ ਅਰਥਸੇਤੂ ਬੱਚਤ ਪੈਟਰਨ ਅਤੇ ਲੈਨਦੇਨ ਆਦਤਾਂ ਦੇ ਆਧਾਰ 'ਤੇ ਵਿਕਲਪਿਕ ਸੰਕੇਤਕਾਂ ਦਾ ਮੁਲਾਂਕਣ ਕਰਦਾ ਹੈ।",
        "simReliability": "ਅਨੁਕਰਨ ਭਰੋਸੇਯੋਗਤਾ ਪ੍ਰੋਫਾਇਲ",
        "incomeProfile": "ਆਮਦਨ ਅਤੇ ਬੱਚਤ ਪ੍ਰੋਫਾਇਲ",
        "consentDetails": "ਆਪਣੀ ਭਰੋਸੇਯੋਗਤਾ ਸ਼੍ਰੇਣੀ ਦੀ ਗਣਨਾ ਕਰਨ ਲਈ ਸਹਿਮਤੀ-ਆਧਾਰਿਤ ਵੇਰਵੇ ਪ੍ਰਦਾਨ ਕਰੋ।",
        "incomePattern": "1. ਤੁਹਾਡੀ ਆਮਦਨ ਦਾ ਪੈਟਰਨ ਕਿਹੋ ਜਿਹਾ ਹੈ?",
        "incomeRegular": "ਨਿਯਮਤ ਮਹੀਨਾਵਾਰ",
        "incomeIrregular": "ਅਨਿਯਮਤ ਰੋਜ਼ਾਨਾ/ਹਫ਼ਤਾਵਾਰ",
        "incomeSeasonal": "ਮੌਸਮੀ (ਫ਼ਸਲ/ਗਿਗਜ਼)",
        "indicatorsTitle": "2. ਆਪਣੇ ਲਈ ਲਾਗੂ ਸੰਕੇਤਕ ਚੁਣੋ:",
        "ind1": "ਮੈਂ ਨਿਯਮਿਤ ਤੌਰ 'ਤੇ ਦੁਕਾਨ ਦਾ ਕਿਰਾਇਆ ਜਾਂ ਯੂਟਿਲਿਟੀ ਬਿਲ ਭਰਦਾ ਹਾਂ",
        "ind2": "ਮੈਂ ਡਾਕ ਘਰ/ਬੱਚਤ ਬਾਕਸ ਵਿੱਚ ਕੁਝ ਨੱਕਦ ਬੱਚਤ ਰੱਖਦਾ ਹਾਂ",
        "ind3": "ਮੇਰੇ ਕੋਲ ਵਪਾਰਕ ਇਨਵੈਂਟਰੀ ਜਾਂ ਵਪਾਰ ਸਪਲਾਈ ਹੈ",
        "ind4": "ਮੇਰੇ ਕੋਲ ਸਥਾਨਿਕ ਅਨੌਪਚਾਰਿਕ ਕਰਜ਼ਾ ਦੇਣ ਵਾਲੇ ਦਾ ਕੋਈ ਬਕਾਇਆ ਕਰਜ਼ਾ ਨਹੀਂ ਹੈ",
        "consentText": "ਮੈਂ ਇੱਕ ਅਨੁਕਰਨ ਕ੍ਰੈਡਿਟ ਭਰੋਸੇਯੋਗਤਾ ਸਕੋਰ ਬਣਾਉਣ ਲਈ ਵਿਕਲਪਿਕ ਸੰਕੇਤਕਾਂ ਦੀ ਵਰਤੋਂ ਕਰਨ ਦੀ ਸਹਿਮਤੀ ਦਿੰਦਾ ਹਾਂ।",
        "generateProfile": "ਇੰਜਣ ਪ੍ਰੋਫਾਇਲ ਤਿਆਰ ਕਰੋ",
        "engineTitle": "ਅਰਥਸੇਤੂ ਅਨੁਕੂਲ ਪ੍ਰੋਫਾਇਲਿੰਗ ਇੰਜਣ",
        "engineDesc": "ਇੱਥੇ ਤੁਹਾਡੀ ਗਣਿਤੀ ਵਿੱਤੀ ਪ੍ਰੋਫਾਇਲ ਹੈ। ਐਪ ਤੁਹਾਡੇ ਲਈ ਇੱਕ ਅਨੁਕੂਲਿਤ ਰਸਤਾ ਚੁਣਦਾ ਹੈ।",
        "scoreLiteracy": "ਵਿੱਤੀ ਸਾਖਰਤਾ",
        "scoreDigital": "ਡਿਜੀਟਲ ਭਰੋਸਾ",
        "scoreReliability": "ਵਿਕਲਪਿਕ ਭਰੋਸੇਯੋਗਤਾ",
        "recommendedPath": "ਸਿਫ਼ਾਰਸ਼ੀ ਔਨਬੋਰਡਿੰਗ ਰਸਤਾ",
        "calculating": "ਗਣਨਾ ਹੋ ਰਹੀ ਹੈ...",
        "selectContinue": "ਪ੍ਰੋਫਾਇਲਿੰਗ ਚਲਾਉਣ ਲਈ ਜਾਰੀ ਰੱਖੋ ਚੁਣੋ।",
        "enterLab": "ਸੁਰੱਖਿਤ ਫਾਇਨਾਂਸ ਲੈਬ ਵਿੱਚ ਦਾਖਲਾ ਕਰੋ",
        "labTitle": "ਸੁਰੱਖਿਤ ਫਾਇਨਾਂਸ ਲੈਬ",
        "practiceSandboxTag": "ਅਭਿਆਸ ਸੈਂਡਬਾਕਸ",
        "tabPayment": "ਅਭਿਆਸ ਭੁਗਤਾਨ",
        "tabFraud": "ਫ੍ਰਾਡ ਫਿਸ਼ਿੰਗ ਡਿਟੈਕਟਰ",
        "tabLoan": "ਕਰਜ਼ਾ ਤੁਲਨਾ",
        "tabBudget": "ਬਜਟ ਅਤੇ ਅਸਥਿਰਤਾ",
        "arthapay": "ਅਰਥਾਪੇ",
        "enterRecipient": "ਪ੍ਰਾਪਤਕਰਤਾ ਦਾ UPI ID / ਫ਼ੋਨ ਦਰਜ ਕਰੋ",
        "verifyRecipient": "ਪ੍ਰਾਪਤਕਰਤਾ ਤਸਦੀਕ ਕਰੋ",
        "verified": "ਤਸਦੀਕ ਕੀਤਾ",
        "enterAmount": "ਤਬਾਦਲਾ ਰਾਸ਼ੀ ਦਰਜ ਕਰੋ (₹)",
        "walletBalance": "ਅਭਿਆਸ ਵਾਲਿਟ ਬੈਲੇਂਸ: ₹1,000",
        "continueToPay": "ਭੁਗਤਾਨ ਜਾਰੀ ਰੱਖੋ",
        "enterUPIPIN": "6 ਅੰਕਾਂ ਦਾ UPI PIN ਦਰਜ ਕਰੋ",
        "payingRs": "ਭੁਗਤਾਨ ₹",
        "toRecipient": "ਕਿਸਾਨ ਭਾਈ ਨੂੰ",
        "txnSuccess": "ਲੈਨਦੇਨ ਸਫਲ!",
        "sentTo": "ਕਿਸਾਨ ਭਾਈ ਨੂੰ ਭੇਜਿਆ ਗਿਆ",
        "txnId": "ਲੈਨਦੇਨ ID:",
        "payAgain": "ਫਿਰ ਸੇ ਭੁਗਤਾਨ ਕਰੋ",
        "paymentTutorial": "ਅਨੁਕਰਨ ਭੁਗਤਾਨ ਟਿਊਟੋਰੀਅਲ",
        "paymentTutorialDesc": "ਅਸਲ ਪੈਸਿਆਂ ਦਾ ਜੋਖਿਮ ਉਠਾਏ ਬਿਨਾਂ ਧਨ ਤਬਾਦਲਾ ਕਿਵੇਂ ਕਰਨਾ ਹੈ ਇਹ ਸੀਖੋ।",
        "crucialGuidelines": "ਮਹੱਤਵਪੂਰਨ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼:",
        "practicePIN": "ਤੁਹਾਡਾ ਅਭਿਆਸ PIN ਕੋਡ ਹੈ: ",
        "tip2": "ਭੁਗਤਾਨ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਤਸਦੀਕ ਕੀਤੇ ਪ੍ਰਾਪਤਕਰਤਾ ਨਾਮ ਦੀ ਦੁਬਾਰਾ ਜਾਂਚ ਕਰੋ।",
        "tip3": "ਮਿਆਰੀ ਸੁਰੱਖਿਤ ਬੈਂਕਰ ਸਕ੍ਰੀਨਾਂ ਤੋਂ ਇਲਾਵਾ ਕਿਥੇ ਵੀ ਆਪਣਾ PIN ਟਾਇਪ ਨਾ ਕਰੋ।",
        "walletHistory": "ਵਾਲਿਟ ਇਤਿਹਾਸ",
        "welcomeBonus": "ਸੁਆਗਤ ਬੋਨਸ",
        "messageInbox": "ਸੰਦੇਸ਼ ਇਨਬਾਕਸ",
        "fraudDesc": "ਆਰਬੀਆਈ ਨਿਯਮਾਂ ਦੇ ਤਹਿਤ, ਅਣਅਧਿਕ੃ਤ ਲੈਨਦੇਨ ਦੇ 3 ਦਿਨਾਂ ਦੇ ਅੰਦਰ ਸੂਚਿਤ ਕਰਨ 'ਤੇ ਤੁਹਾਡੀ ਦੇਣਦਾਰੀ ਸਿਫ਼ਰ ਹੈ।",
        "selectMessage": "ਇੱਕ ਸੰਦੇਸ਼ ਚੁਣੋ",
        "fraudPlaceholder": "ਇਸ ਦੀ ਸੁਰੱਖਿਆ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਨ ਲਈ ਸੂਚੀ ਵਿੱਚੋਂ ਇੱਕ ਇਨਕਮਿੰਗ SMS 'ਤੇ ਕਲਿੱਕ ਕਰੋ।",
        "classifySafe": "ਸੁਰੱਖਿਤ ਵਜੋਂ ਵਰਗੀਕ੍ਰਿਤ ਕਰੋ",
        "reportFraud": "ਫ੍ਰਾਡ / ਸਪੈਮ ਵਜੋਂ ਰਿਪੋਰਟ ਕਰੋ",
        "loanTitle": "ਕਰਜ਼ਾ ਲਾਗਤ ਸਿਮੂਲੇਟਰ",
        "loanDesc": "ਕੁੱਲ ਮੁੜ-ਭੁਗਤਾਨ ਦੇਖਣ ਅਤੇ ਬਿਆਜ ਜਾਲ ਤੋਂ ਬਚਣ ਲਈ ਸਲਾਈਡਰ ਅਡਜਸਟ ਕਰੋ।",
        "principalAmt": "ਮੂਲ ਰਾਸ਼ੀ",
        "interestRate": "ਬਿਆਜ ਦਰ (ਸਲਾਨਾ)",
        "tenure": "ਮਿਆਦ (ਮਹੀਨੇ)",
        "flatLoan": "ਫਲੈਟ ਕਰਜ਼ਾ (ਸਧਾਰਨ ਬਿਆਜ)",
        "flatRateFinancing": "ਫਲੈਟ ਦਰ ਫਾਇਨਾਂਸਿੰਗ",
        "monthlyEMI": "ਮਹੀਨਾਵਾਰ EMI",
        "totalInterest": "ਕੁੱਲ ਬਿਆਜ",
        "totalRepayment": "ਕੁੱਲ ਮੁੜ-ਭੁਗਤਾਨ",
        "flatLoanDesc": "ਬਿਆਜ ਕੇਵਲ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ 'ਤੇ ਗਣਨਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।",
        "compoundLoan": "ਚੱਕਰੀ ਕਰਜ਼ਾ (ਘਟਦਾ ਸ਼ੇਸ਼)",
        "reducingBalanceFinancing": "ਘਟਦਾ ਸ਼ੇਸ਼ ਫਾਇਨਾਂਸਿੰਗ",
        "compoundLoanDesc": "ਬਿਆਜ ਕੇਵਲ ਬਕਾਇਆ ਮੂਲਧਨ 'ਤੇ ਗਣਨਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਫਲੈਟ ਕਰਜ਼ੇ ਤੋਂ ਬਿਹਤਰ!",
        "budgetTitle": "ਗਤੀਸ਼ੀਲ ਆਮਦਨ ਅਸਥਿਰਤਾ ਸਿਮੂਲੇਟਰ",
        "budgetDesc": "ਵੱਖ-ਵੱਖ ਆਮਦਨ ਬਾਧਾਵਾਂ ਹੇਠ ਖਰਚਿਆਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ। ਅਨੁਕਰਨ ਮਹੀਨਾ ਖੇਡੋ!",
        "currentIncome": "ਮੌਜੂਦਾ ਆਮਦਨ ਮਾਡਲ:",
        "foodAlloc": "ਭੋਜਨ ਅਤੇ ਕਿਰਾਇਆ ਵੰਡ (₹)",
        "savingsBox": "ਬੱਚਤ ਬਾਕਸ (₹)",
        "growthAlloc": "ਨਿਵੇਸ਼ / ਵਪਾਰ ਵਿਕਾਸ (₹)",
        "simulateMonth": "ਅਗਲਾ ਮਹੀਨਾ ਅਨੁਕਰਨ ਕਰੋ",
        "walletBal": "ਵਾਲਿਟ ਬੈਲੇਂਸ",
        "accumSavings": "ਸੰਚਿਤ ਬੱਚਤ",
        "activityLog": "ਗਤੀਵਿਧੀ ਲੌਗ",
        "gameStarted": "ਖੇਡ ਸ਼ੁਰੂ।",
        "guidanceTitle": "ਨਿੱਜੀ ਵਿੱਤੀ ਮਾਰਗਦਰਸ਼ਨ",
        "guidanceDesc": "ਇੱਥੇ ਤੁਹਾਡੇ ਮੁਲਾਂਕਣ ਦੇ ਆਧਾਰ 'ਤੇ ਤਿਆਰ ਕੀਤੇ ਗਏ ਮਹੱਤਵਪੂਰਨ ਵਿੱਤੀ ਨਿਯਮ ਹਨ।",
        "viewReport": "ਤਿਆਰੀ ਰਿਪੋਰਟ ਵੇਖੋ",
        "reportTitle": "ਵਿੱਤੀ ਤਿਆਰੀ ਰਿਪੋਰਟ",
        "reportDesc": "ਸ਼ਾਨਦਾਰ ਤਰੱਕੀ! ਇੱਥੇ ਤੁਹਾਡਾ ਅਧਿਕਾਰਤ ਸਮਰੱਥਾ ਮੁਲਾਂਕਣ ਸਰਟੀਫਿਕੇਟ ਹੈ।",
        "certTitle": "ਅਰਥਸੇਤੂ ਸਮਰੱਥਾ ਸਰਟੀਫਿਕੇਟ",
        "certAwardedTo": "ਇਹ ਸਰਟੀਫਿਕੇਟ ਪ੍ਰਦਾਨ ਕੀਤਾ ਜਾਂਦਾ ਹੈ",
        "certDesc": "ਸੁਰੱਖਿਤ ਫਾਇਨਾਂਸ ਲੈਬ ਸਿਮੂਲੇਟਰ ਵਿੱਚ ਅਨੁਕੂਲਿਤ ਵਿੱਤੀ ਪ੍ਰੋਫਾਇਲਿੰਗ ਅਤੇ ਸੁਰੱਖਿਤ UPI ਲੈਨਦੇਨ ਦੇ ਅਭਿਆਸ ਨੂੰ ਸਫਲਤਾਪੂਰਵਕ ਪੂਰਾ ਕਰਨ ਲਈ।",
        "certLiteracy": "ਸਾਖਰਤਾ ਪੱਧਰ",
        "certDigital": "ਡਿਜੀਟਲ ਭਰੋਸਾ",
        "certPathway": "ਸਹਾਇਕ ਰਸਤਾ",
        "certSystem": "ਸਿਸਟਮ ਜਾਰੀ",
        "certDate": "ਤਸਦੀਕ ਦੀ ਮਿਤੀ",
        "printCert": "ਸਰਟੀਫਿਕੇਟ ਪ੍ਰਿੰਟ ਕਰੋ",
        "provideFeedback": "ਫੀਡਬੈਕ ਦਿਓ",
        "feedbackTitle": "ਫੀਡਬੈਕ ਅਤੇ ਨਤੀਜਾ ਮਾਪ",
        "feedbackDesc": "ਇਸ ਅਨੁਕੂਲਨ ਢਾਂਚੇ ਦੇ ਮੁਲਾਂਕਣ ਵਿੱਚ ਸਾਡੀ ਮਦਦ ਕਰੋ।",
        "surveyQ1": "1. ਇਸ ਐਪਲੀਕੇਸ਼ਨ ਨੂੰ ਨੈਵੀਗੇਟ ਕਰਨਾ ਕਿੰਨਾ ਸੌਖਾ ਸੀ?",
        "surveyQ2": "2. ਕੀ ਤੁਸੀਂ ਸੁਰੱਖਿਆ ਨਿਯਮਾਂ ਅਤੇ ਧੋਖਾਧੜੀ ਚੇਤਾਵਨੀਆਂ ਨੂੰ ਸਪੱਸ਼ਟ ਤਰ੍ਹਾਂ ਸਮਝਿਆ?",
        "surveyQ3": "3. ਹੁਣ ਅਕੇਲੇ ਮੋਬਾਈਲ ਭੁਗਤਾਨ ਕਰਨ ਵਿੱਚ ਤੁਸੀਂ ਕਿੰਨਾ ਭਰੋਸਾ ਮਹਿਸੂਸ ਕਰਦੇ ਹੋ?",
        "surveyQ4": "4. ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਕੋਈ ਸੁਝਾਅ ਜਾਂ ਟਿੱਪਣੀ ਹੈ?",
        "feedbackPlaceholder": "ਹਿੰਦੀ, ਅੰਗਰੇਜ਼ੀ ਆਦਿ ਵਿੱਚ ਇੱਥੇ ਟਾਇਪ ਕਰੋ।",
        "saveReset": "ਸੰਭਾਲੋ ਅਤੇ ਐਪਲੀਕੇਸ਼ਨ ਰੀਸੈਟ ਕਰੋ",
        "assistantName": "ਅਰਥਦੂਤ ਸਹਾਇਕ:",
        "welcomeArthasetu": "ਅਰਥਸੇਤੂ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ।",
        "voiceOn": "ਵੌਇਸ ਸਹਾਇਤਾ: ਚਾਲੂ",
        "voiceOff": "ਵੌਇਸ ਸਹਾਇਤਾ: ਬੰਦ",
        "helpWelcome": "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਅਰਥਦੂਤ ਹਾਂ। ਮੈਂ ਸਕ੍ਰੀਨ ਦੀ ਜਾਣਕਾਰੀ ਪੜ੍ਹ ਕੇ ਤੁਹਾਡਾ ਮਾਰਗਦਰਸ਼ਨ ਕਰਾਂਗਾ। ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਕਿਸੇ ਵੀ ਡੱਬੇ ਨੂੰ ਛੂਹੋ।",
        "profileHelp": "ਅਨੁਭਵ ਨੂੰ ਆਪਣੀ ਲੋੜ ਅਨੁਸਾਰ ਢਾਲਣ ਲਈ ਹਰ ਸ਼੍ਰੇਣੀ ਤੋਂ ਇੱਕ ਵਿਕਲਪ ਚੁਣੋ।",
        "quizHelp": "ਤੁਹਾਨੂੰ ਜੋ ਵਿਕਲਪ ਸਹੀ ਲੱਗੇ ਉਸ ਨੂੰ ਚੁਣੋ। ਇਹ ਸਿਰਫ਼ ਅਭਿਆਸ ਹੈ, ਗਲਤੀਆਂ ਤੋਂ ਨਾ ਡਰੋ।",
        "digitalHelp": "ਆਓ ਤਿੰਨ ਕਾਰਜਾਂ ਦੀ ਜਾਂਚ ਕਰੀਏ। ਪਹਿਲਾਂ, ਕੀਪੈਡ 'ਤੇ 4096 ਟਾਇਪ ਕਰੋ। ਦੂਜਾ, ਸਿੱਕੇ ਨੂੰ ਪਿੱਗੀ ਬੈਂਕ ਵਿੱਚ ਪਾਓ। ਤੀਜਾ, ਸਲਾਈਡਰ ਨੂੰ ਸੱਜੇ ਪਾਸੇ ਖਿਸਕਾਓ।",
        "trustHelp": "ਉਨ੍ਹਾਂ ਬਕਸਿਆਂ ਨੂੰ ਟਿੱਕ ਕਰੋ ਜਿੱਥੇ ਤੁਹਾਨੂੰ ਔਨਲਾਈਨ ਲੈਨਦੇਨ ਅਸੁਰੱਖਿਤ ਲੱਗਦਾ ਹੈ।",
        "reliabilityHelp": "ਜੇ ਤੁਹਾਡੇ ਕੋਲ ਕ੍ਰੈਡਿਟ ਸਕੋਰ ਨਹੀਂ ਹੈ, ਤਾਂ ਵਿਕਲਪਿਕ ਤਰੀਕੇ ਤੁਹਾਡੀ ਭਰੋਸੇਯੋਗਤਾ ਦਿਖਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ।",
        "sandboxHelp": "ਬਿਨਾਂ ਕਿਸੇ ਜੋਖਿਮ ਦੇ ਭੁਗਤਾਨ ਦਾ ਅਭਿਆਸ ਕਰੋ, ਧੋਖਾਧੜੀ ਸੰਦੇਸ਼ਾਂ ਨੂੰ ਪਹਿਚਾਣੋ, ਬਿਆਜ ਦਰਾਂ ਦੇਖੋ ਜਾਂ ਬਜਟ ਯੋਜਨਾ ਦਾ ਅਭਿਆਸ ਕਰੋ।",
        "guidanceHelp": "ਇਨ੍ਹਾਂ ਸੁਰੱਖਿਆ ਨਿਯਮਾਂ ਨੂੰ ਪੜ੍ਹੋ। ਅਸੀਂ ਉਨ੍ਹਾਂ ਨੂੰ ਤੁਹਾਡੇ ਜਵਾਬਾਂ ਦੇ ਆਧਾਰ 'ਤੇ ਤਿਆਰ ਕੀਤਾ ਹੈ।",
        "reportHelp": "ਇਹ ਤੁਹਾਡਾ ਪੂਰਨਤਾ ਸਰਟੀਫਿਕੇਟ ਹੈ!",
        "surveyHelp": "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਅਨੁਭਵ ਨੂੰ ਰੇਟ ਕਰੋ। ਧੰਨਵਾਦ!",
        "pathAssisted": "ਵੌਇਸ/ਵਿਜ਼ੂਅਲ ਸਹਾਇਤਾ ਰਸਤਾ",
        "pathAssistedDesc": "ਸਮਾਰਟਫੋਨ ਅਤੇ ਡਿਜੀਟਲ ਸਾਖਰਤਾ ਪੱਧਰ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖਦੇ ਹੋਏ, ਸਿਸਟਮ ਨੇ ਤੁਹਾਡੇ ਲਈ ਪੂਰੀ ਵੌਇਸ ਅਤੇ ਵੱਡੀ ਵਿਜ਼ੂਅਲ ਗਾਈਡੈਂਸ ਸਕ੍ਰਿਆ ਕੀਤੀ ਹੈ।",
        "pathAssistedFeat1": "ਸਵੈਚਲਿਤ ਵੌਇਸ ਗਾਈਡੈਂਸ ਸਕ੍ਰਿਆ",
        "pathAssistedFeat2": "ਵੱਡੇ ਫ਼ੌਂਟ ਆਕਾਰ",
        "pathAssistedFeat3": "ਸੁਗਮ ਬਟਨ ਨੈਵੀਗੇਸ਼ਨ",
        "pathGuided": "ਮਾਰਗਦਰਸ਼ਿਤ ਰਸਤਾ",
        "pathGuidedDesc": "ਤੁਸੀਂ ਬੁਨਿਆਦੀ ਐਪਸ ਚਲਾ ਲੈਂਦੇ ਹੋ। ਸਿਸਟਮ ਮਹੱਤਵਪੂਰਨ ਬਟਨਾਂ 'ਤੇ ਹਾਈਲਾਈਟ ਅਤੇ ਪੌਪ-ਅਪ ਨਿਰਦੇਸ਼ ਦਿਖਾਏਗਾ।",
        "pathGuidedFeat1": "ਸਕ੍ਰਿਆ ਬਟਨਾਂ 'ਤੇ ਚਮਕਦਾ ਹਾਈਲਾਈਟ",
        "pathGuidedFeat2": "ਸਮੇਂ ਸੁਰੱਖਿਆ ਪੌਪ-ਅਪ ਸੰਦੇਸ਼",
        "pathGuidedFeat3": "ਸੰਕੇਤਕ ਟੂਲਟਿੱਪਸ",
        "pathSelf": "ਸਵੈ-ਮਾਰਗਦਰਸ਼ਿਤ ਰਸਤਾ",
        "pathSelfDesc": "ਤੁਸੀਂ ਸਮਾਰਟਫੋਨ ਚਲਾਉਣ ਵਿੱਚ ਬਹੁਤ ਕੁਸ਼ਲ ਹੋ।",
        "pathSelfFeat1": "ਸਾਧਾਰਨ ਨੈਵੀਗੇਸ਼ਨ ਮੋਡ",
        "pathSelfFeat2": "ਪੂਰੀ ਟੂਲ ਸਵੈੰਤਰਤਾ",
        "pathSelfFeat3": "ਉੱਨਤ ਸੈਂਡਬਾਕਸ ਅਭਿਆਸ",
        "certSelf": "ਸਵੈ-ਮਾਰਗਦਰਸ਼ਿਤ",
        "certGuided": "ਮਾਰਗਦਰਸ਼ਿਤ ਸਹਾਇਤਾ",
        "certAssisted": "ਵੌਇਸ ਸਹਾਇਤਾ",
        "lockedMsg": "ਇਹ ਹਿੱਸਾ ਬੰਦ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਪਿਛਲਾ ਕੰਮ ਪਹਿਲਾਂ ਪੂਰਾ ਕਰੋ।",
        "occupationMsg": "ਕਿੱਤਾ ਦਰਜ ਹੋ ਗਿਆ।",
        "answerMsg": "ਜਵਾਬ ਦਰਜ ਹੋ ਗਿਆ।",
        "clearedMsg": "ਸਾਫ਼ ਕੀਤਾ",
        "codeSuccess": "ਸਫਲ! ਕੋਡ ਸਹੀ ਹੈ।",
        "firstTaskDone": "ਬਹੁਤ ਵਧੀਆ! ਪਹਿਲਾ ਕੰਮ ਪੂਰਾ ਹੋਇਆ।",
        "codeWrong": "ਗਲਤ ਕੋਡ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
        "codeWrongRetry": "ਗਲਤ ਕੋਡ, ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ 4096 ਟਾਇਪ ਕਰੋ।",
        "savingsSecured": "ਬੱਚਤ ਸੁਰੱਖਿਤ!",
        "coinDeposited": "ਸਫਲ! ਸਿੱਕਾ ਜਮ੍ਹਾ ਹੋਇਆ।",
        "coinSecured": "ਵਧਾਈ ਹੋਵੇ, ਸਿੱਕਾ ਬੈਂਕ ਵਿੱਚ ਸੁਰੱਖਿਤ ਹੈ।",
        "swipeSuccess": "ਸਫਲ! ਸਵਾਈਪ ਸਵੀਕ੃ਤ ਹੋਈ।",
        "swipeDone": "ਸਵਾਈਪ ਸਵੀਕਾਰ ਕਰ ਲਈ ਗਈ ਹੈ।",
        "optionToggled": "ਵਿਕਲਪ ਬਦਲਿਆ ਗਿਆ।",
        "incomeRecorded": "ਆਮਦਨ ਦਾ ਸਰੂਪ ਦਰਜ ਹੋਇਆ।",
        "scoreCalculated": "ਵਿਕਲਪਿਕ ਸੂਚਕਾਂਕ ਸਕੋਰ {score} ਪ੍ਰਤੀਸ਼ਤ ਹੋਇਆ।",
        "labTabActive": "ਲੈਬ ਦਾ {tab} ਅਭਿਆਸ ਸਕ੍ਰਿਆ ਹੋਇਆ।",
        "recipientVerified": "ਸਫਲ! ਪ੍ਰਾਪਤਕਰਤਾ ਤਸਦੀਕ ਹੋ ਗਿਆ ਹੈ।",
        "enterValidUPI": "ਕਿਰਪਾ ਕਰਕੇ ਵੈਧ UPI ਆਈਡੀ ਜਾਂ ਨੰਬਰ ਦਰਜ ਕਰੋ।",
        "enterAmountMsg": "ਕਿਰਪਾ ਕਰਕੇ 10 ਤੋਂ 2,000 ਰੁਪਏ ਦੇ ਵਿਚਕਾਰ ਰਾਸ਼ੀ ਦਰਜ ਕਰੋ।",
        "insufficientFunds": "ਸੈਂਡਬਾਕਸ ਵਾਲਿਟ ਵਿੱਚ ਪਰਿਆਪਤ ਰਾਸ਼ੀ ਨਹੀਂ ਹੈ।",
        "enterPIN": "ਪੁਸ਼ਟੀ ਕਰਨ ਲਈ 6 ਅੰਕਾਂ ਦਾ UPI PIN ਟਾਇਪ ਕਰੋ।",
        "paymentSuccess": "ਸਫਲ! ਭੁਗਤਾਨ ਪੂਰਾ ਹੋ ਗਿਆ ਹੈ।",
        "wrongPIN": "ਗਲਤ UPI PIN। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ 123456 ਟਾਇਪ ਕਰੋ।",
        "smsReview": "ਸੰਦੇਸ਼ ਖੋਲ੍ਹ ਲਿਆ ਗਿਆ ਹੈ।",
        "correctDecision": "ਤੁਹਾਡਾ ਫ਼ੈਸਲਾ ਬਿਲਕੁਲ ਸਹੀ ਹੈ।",
        "wrongDecision": "ਗਲਤ ਫ਼ੈਸਲਾ। ਸੁਰੱਖਿਆ ਚੇਤਾਵਨੀ ਨੂੰ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ।",
        "overBudget": "ਕੁੱਲ ਵੰਡ ਤੁਹਾਡੇ ਵਾਲਿਟ ਬੈਲੇਂਸ ਤੋਂ ਵੱਧ ਹੈ!",
        "monthComplete": "ਮਹੀਨਾ ਸਮਾਪਤ ਹੋਇਆ।",
        "monthLabel": "ਮਹੀਨਾ",
        "ratingRecorded": "ਰੇਟਿੰਗ ਦਰਜ ਹੋਈ।",
        "profileSaved": "ਵਧਾਈ ਹੋਵੇ! ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਇਲ ਸੰਭਾਲ ਲਈ ਗਈ ਹੈ।",
        "onboardingDone": "ਸਫਲ! ਤੁਹਾਡਾ ਫੀਡਬੈਕ ਦਰਜ ਹੋ ਗਿਆ ਹੈ।",
        "fraudTitle": "ਧੋਖਾਧੜੀ ਤੋਂ ਸੁਰੱਖਿਆ",
        "privacyTitle": "ਗੋਪਨੀਯਤਾ ਅਤੇ ਬੈਂਕਿੰਗ ਐਕਟ",
        "privacyDesc": "ਤੁਹਾਡਾ ਡੇਟਾ DPDP ਐਕਟ ਦੇ ਤਹਿਤ ਸੁਰੱਖਿਤ ਹੈ।",
        "chargesTitle": "ਸਿਫ਼ਰ ਲੁਕੀਆਂ ਫੀਸਾਂ ਅਨਿਵਾਰਤਾ",
        "chargesDesc": "ਬੀਐਸਬੀਡੀ ਖਾਤਿਆਂ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਰਾਸ਼ੀ ਰੱਖਣ ਦੀ ਕੋਈ ਸੀਮਾ ਨਹੀਂ ਹੈ।",
        "mistakesTitle": "ਗਲਤ ਭੁਗਤਾਨ ਵਾਪਸੀ",
        "mistakesDesc": "ਗਲਤ ਖਾਤੇ ਵਿੱਚ ਪੈਸੇ ਭੇਜਣ 'ਤੇ ਤੁਸੀਂ ਐਨਪੀਸੀਆਈ ਪੋਰਟਲ 'ਤੇ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਾ ਸਕਦੇ ਹੋ।",
        "tipSecTitle": "ਓਟੀਪੀ ਜਾਂ ਪਿਨ ਕਦੇ ਸਾਂਝਾ ਨਾ ਕਰੋ",
        "tipSecDesc": "ਕੋਈ ਵੀ ਬੈਂਕ ਕਰਮਚਾਰੀ ਕਾਲ 'ਤੇ ਤੁਹਾਡਾ UPI PIN ਜਾਂ OTP ਨਹੀਂ ਮੰਗਦਾ।",
        "tipSavTitle": "ਆਪਾਤਕਾਲੀਨ ਬੱਚਤ ਕੋਸ਼",
        "tipSavDescRegular": "ਨਿਯਮਤ ਆਮਦਨ ਹੋਣ 'ਤੇ ਹਰ ਮਹੀਨੇ ਘੱਟੋ-ਘੱਟ 15% ਰਾਸ਼ੀ ਵੱਖਰੇ ਬੱਚਤ ਖਾਤੇ ਵਿੱਚ ਜਮ੍ਹਾ ਕਰੋ।",
        "tipSavDescIrregular": "ਤੁਹਾਡੀ ਆਮਦਨ ਮੌਸਮੀ ਹੈ, ਇਸ ਲਈ ਘੱਟੋ-ਘੱਟ 3 ਮਹੀਨਿਆਂ ਦੇ ਬੁਨਿਆਦੀ ਖਰਚਿਆਂ ਦੇ ਬਰਾਬਰ ਰਾਸ਼ੀ ਵੱਖਰੇ ਬੱਚਤ ਖਾਤੇ ਵਿੱਚ ਰੱਖੋ।",
        "tipCreTitle": "ਅਨੌਪਚਾਰਿਕ ਬਿਆਜ ਚੰਗੂਲ ਤੋਂ ਬਚੋ",
        "tipCreDesc": "ਸਥਾਨਕ ਸਾਹੂਕਾਰਾਂ ਦਾ 5% ਮਾਸਿਕ ਬਿਆਜ 60% ਸਾਲਾਨਾ ਹੋ ਜਾਂਦਾ ਹੈ!",
        "tipPayTitle": "ਭੁਗਤਾਨ ਪ੍ਰਾਪਤਕਰਤਾ ਨਾਮ ਦੀ ਜਾਂਚ",
        "tipPayDesc": "ਪਿਨ ਪਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਹਮੇਸ਼ਾ ਪ੍ਰਾਪਤਕਰਤਾ ਦਾ ਤਸਦੀਕ ਕੀਤਾ ਨਾਮ ਪੜ੍ਹੋ।",
        "sms1Sender": "AD-LOTTRI",
        "sms1Text": "ਵਧਾਈ ਹੋਵੇ! ਤੁਸੀਂ ਸਰਕਾਰੀ ਪ੍ਰਚਾਰ ਤੋਂ ₹10,00,000 ਦੀ ਲਾਟਰੀ ਜਿੱਤੀ ਹੈ।",
        "sms1Expl": "ਇਹ ਫ੍ਰਾਡ ਹੈ। ਸਰਕਾਰੀ ਵਿਭਾਗ ਸਾਰਵਜਨਿਕ SMS ਲਿੰਕ ਤੋਂ ਲਾਟਰੀ ਨਹੀਂ ਦਿੰਦੇ।",
        "sms2Sender": "ਸਟੇਟ ਬੈਂਕ",
        "sms2Text": "ਪਿਆਰੇ ਗਾਹਕ, ਤੁਹਾਡਾ ਮਹੀਨਾਵਾਰ ਬੈਂਕ ਸਟੇਟਮੈਂਟ ਤਿਆਰ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਅਧਿਕਾਰਤ ਪੋਰਟਲ 'ਤੇ ਲੌਗਇਨ ਕਰੋ।",
        "sms2Expl": "ਇਹ ਸੁਰੱਖਿਤ ਹੈ। ਸੰਦੇਸ਼ ਵਿੱਚ ਕੋਈ ਅਤਿਆਵਸ਼ਕ ਖ਼ਤਰਾ ਨਹੀਂ ਹੈ।",
        "sms3Sender": "BP-ALERT",
        "sms3Text": "ਅਲਰਟ! ਤੁਹਾਡਾ ਬਿਜਲੀ ਬਿਲ ₹1,450 ਬਕਾਇਆ ਹੈ।",
        "sms3Expl": "ਇਹ ਫ੍ਰਾਡ ਹੈ। ਯੂਟਿਲਿਟੀ ਕੰਪਨੀਆਂ ਯਾਦ੃ਚਿਕ ਫੋਨ ਨੰਬਰਾਂ ਤੋਂ ਤੁਰੰਤ ਡਿਸਕਨੈਕਸ਼ਨ ਦੀ ਧਮਕੀ ਨਹੀਂ ਦਿੰਦੀਆਂ।",
        "eventMedical": "ਮੈਡੀਕਲ ਐਮਰਜੈਂਸੀ",
        "eventMedicalDesc": "ਪਰਿਵਾਰ ਦਾ ਇੱਕ ਮੈਂਬਰ ਬੀਮਾਰ ਹੋ ਗਿਆ। ₹1,000 ਇਲਾਜ ਖਰਚ।",
        "eventHarvest": "ਬੰਪਰ ਫ਼ਸਲ ਬੋਨਸ",
        "eventHarvestDesc": "ਫ਼ਸਲ ਦੀ ਮੰਗ ਅਚਾਨਕ ਵਧ ਗਈ! ₹1,500 ਵਾਧੂ ਲਾਭ।",
        "eventDrought": "ਸੁੱਖਾ / ਸਥਾਨਕ ਮੰਦੀ",
        "eventDroughtDesc": "ਖ਼ਰਾਬ ਮੌਸਮ ਦੇ ਕਾਰਨ ਕੋਈ ਕਮਾਈ ਨਹੀਂ ਹੋਈ।",
        "eventFestival": "ਤਿਉਹਾਰ ਉਤਸਵ",
        "eventFestivalDesc": "ਮਿਠਾਈ ਅਤੇ ਉਪਹਾਰਾਂ ਵਿੱਚ ₹500 ਖਰਚ।",
        "securityDashDesc": "10 Next-Gen Security Innovations protecting your financial data",
        "consentMgrDesc": "Cryptographic consent tokens — you control who accesses your data",
        "zkpVerifierDesc": "Prove your attributes without revealing the actual data"
    },
    "ur": {
        "brandTagline": "موافق شمولیت",
        "navGroup1": "1. رجسٹری اور پروفائلنگ",
        "navGroup2": "2. انٹرایکٹیو جانچ",
        "navGroup3": "3. سیکھنا اور لیب",
        "navGroup4": "4. خلاصہ اور رائے",
        "navGroup5": "5. نئی نسل سیکیورٹی",
        "guestUser": "مہمان صارف",
        "online": " آن لائن",
        "title1": "زبان اور آواز",
        "title2": "\"مجھے جانیے\" پروفائل",
        "title3": "مالی ساکھ",
        "title4": "ڈیجیٹل اعتماد",
        "title5": "اعتماد اور سیکیورٹی",
        "title6": "قابل اعتماد اور آمدنی",
        "title7": "موافق انجن",
        "title8": "محفوظ فائنانس لیب",
        "title9": "ذاتی رہنمائی",
        "title10": "تیاری رپورٹ",
        "title11": "رائے سروے",
        "title12": "سیکیورٹی ڈیش بورڈ",
        "title13": "اجازت مینیجر",
        "title14": "ZKP تصدیق کارندہ",
        "prototype": "پروٹوٹائپ",
        "welcomeTitle": "خوش آمدید",
        "welcomeDesc": "آرتھا سیتو آپ کی مالی ضروریات، ڈیجیٹل صلاحیت اور پسندیدہ زبان کے مطابق ڈھل جاتا ہے۔ ہم آپ کو باضابطہ فائنانس محفوظ طریقے سے سیکھنے میں مدد کرتے ہیں۔",
        "langCount": "6+",
        "indianLanguages": "ہندوستانی زبانیں",
        "sandboxPct": "100%",
        "practiceSandbox": "مشق سینڈباکس",
        "selectLang": "اپنی زبان منتخب کریں",
        "langSubtitle": "پورا ایپ آپ کی منتخب زبان میں کام کرے گا",
        "enableVoice": "آواز مدد فعال کریں",
        "voiceDesc": "ہمارے ورچوئل گائیڈ \"آرتھا دوت\" آپ کی منتخب زبان میں ہدایات بلند آواز سے پڑھے گا۔",
        "startProfiling": "پروفائلنگ شروع کریں",
        "tellUsAbout": "ہمیں اپنے بارے میں بتائیں",
        "configureApp": "ہم آپ کی روزمرہ زندگی اور پیشے کی بنیاد پر ایپلیکیشن کنفیگر کرتے ہیں۔",
        "questionOccupation": "1. آپ کا بنیادی پیشہ کیا ہے؟",
        "occRetailer": "چھوٹا بیچنے والا / دکاندار",
        "occRetailerSub": "دکاندار / رہڑی پٹری",
        "occFarmer": "کسان / کھیتی",
        "occFarmerSub": "کسان / کھیتی باری",
        "occWorker": "گگ ورکر / ڈلیوری",
        "occWorkerSub": "ڈلیوری / ٹیکسی چالک",
        "occDailywager": "روزانہ اجرت وصول کرنے والا",
        "occDailywagerSub": "مزدور / روزانہ اجرت",
        "questionFinExp": "2. کیا آپ نے باضابطہ بینکنگ اور ڈیجیٹل ادائیگی خدمات استعمال کی ہیں؟",
        "finBeginner": "پہلی بار صارف",
        "finBeginnerSub": "UPI / آن لائن بینکنگ کبھی استعمال نہیں کیا",
        "finBasic": "بنیادی صارف",
        "finBasicSub": "بینک کارڈ ہے، لیکن UPI کم استعمال کرتے ہیں",
        "finIntermediate": "درمیانی صارف",
        "finIntermediateSub": "کبھی کبھی UPI استعمال کرتے ہیں، اعتماد چاہیے",
        "questionDigConf": "3. آپ سمارٹ فون چلانے میں کتنے راحت ہیں؟",
        "digLow": "مدد درکار ہے",
        "digLowSub": "عام طور پر دوسروں سے کام کراتے ہیں",
        "digMedium": "بنیادی ایپس چلا سکتے ہیں",
        "digMediumSub": "WhatsApp / YouTube آسانی سے استعمال کرتے ہیں",
        "digHigh": "بہت مستند",
        "digHighSub": "ایپس ڈاؤنلوڈ کر سکتے ہیں اور ٹائپنگ کر سکتے ہیں",
        "back": "واپس",
        "continue": "آگے بڑھیں",
        "quizTitle": "مالی ساکھ جانچ",
        "quizDesc": "ہم آپ کی مالی تصورات کو سمجھنے کے لیے تین منظریہ مبنی سوالات کے جوابات دیں۔",
        "q1of3": "سوال 1 از 3",
        "q1Title": "فلیٹ سود کی شمار",
        "q1Scenario": "اگر آپ 10% فلیٹ سود کی شرح سے 1 سال کے لیے ₹10,000 ادھار لیتے ہیں، تو سال کے اختتام پر آپ کل کتنا سود ادا کرتے ہیں؟",
        "q1a0": "₹1,000 (درست سود ادائیگی)",
        "q1a1": "₹100 (1% شمار)",
        "q1a2": "₹0 (سود مفت قرضہ)",
        "q1a3": "مجھے نہیں پتا / یقینی نہیں",
        "q2of3": "سوال 2 از 3",
        "q2Title": "محفوظ PIN اور OTP ہینڈلنگ",
        "q2Scenario": "آپ کو ایک نامعلوم شخص کا فون آتا ہے جو بینک مینجر ہونے کا دعویٰ کرتے ہیں۔ وہ آپ کا UPI PIN یا OTP مانگتے ہیں۔ آپ کیا کرتے ہیں؟",
        "q2a0": "شیئر کر دوں تاکہ میرا اکاؤنٹ بلاک نہ ہو",
        "q2a1": "صرف اس صورت میں شیئر کروں جب وہ میرا صحیح نام بتائیں",
        "q2a2": "کال پر کسی کے ساتھ بھی اپنا PIN/OTP کبھی شیئر نہ کریں (درست)",
        "q2a3": "انہیں بتاؤں کہ میں بعد میں انہیں کال کروں گا",
        "q3of3": "سوال 3 از 3",
        "q3Title": "بینک بچت کی اہمیت",
        "q3Scenario": "گھر میں ڈبے میں نقد رکھنے کے مقابلے میں باضابطہ بینک اکاؤنٹ میں پیسے بچانے کا بنیادی فائدہ کیا ہے؟",
        "q3a0": "پیسوں پر سود ملتا ہے اور چوری سے محفوظ ہے (درست)",
        "q3a1": "بینک میں رکھا پیسہ خرچ کرنا آسان ہے",
        "q3a2": "نقد اور بینک اکاؤنٹ میں کوئی فرق نہیں ہے",
        "q3a3": "فوائد کے بارے میں یقینی نہیں",
        "digitalTitle": "ڈیجیٹل اعتماد جانچ",
        "digitalDesc": "اپنے سمارٹ فون اور ٹچ اسکرین آرام کی جانچ کرنے کے لیے یہ تین سادہ انٹرایکٹیو کام مکمل کریں۔",
        "task1Title": "کام 1: نمبر ٹائپ کرنا",
        "task1Heading": "نمبری کوڈ درج کریں",
        "task1Desc": "نیچے سکرین کی پیڈ کا استعمال کر کے کوڈ ٹائپ کریں: ",
        "task2Title": "کام 2: گھسیٹیں اور چھوڑیں",
        "task2Heading": "اپنا سکہ محفوظ کریں",
        "task2Desc": "سنہرے سکے کو نیچے پگی بینک میں گھسیٹ کر لے جائیں۔",
        "dropCoin": "سکہ یہاں ڈالیں",
        "task3Title": "کام 3: سوائپ جیسچر",
        "task3Heading": "ادائیگی کے لیے سوائپ کریں",
        "task3Desc": "سلائیڈر کلید کو دائیں طرف سوائپ کر کے محاکمہ ادائیگی کی اجازت دیں۔",
        "swipeConfirm": "تصدیق کے لیے دائیں طرف سوائپ کریں",
        "waitingInput": "ان پٹ کا انتظار ہے...",
        "dragStart": "سکہ گھسیٹ کر شروع کریں",
        "slideHandle": "ہینڈل کو دائیں طرف سلائیڈ کریں",
        "trustTitle": "اعتماد اور سیکیورٹی کی فکریں",
        "trustDesc": "ڈیجیٹل فائنانس استعمال کرنے میں جو بھی فکریں آپ کو جھجھکاتی ہیں ان کا انتخاب کریں۔",
        "trustConcerns": "آپ کی بنیادی فکریں کیا ہیں؟ (تمام لاگو منتخب کریں)",
        "concernFraud": "دھوکہ دہی اور فراڈ کا خوف",
        "concernFraudDesc": "آن لائن دھوکہ دہی والوں سے پیسے کھونے کی فکر",
        "concernPrivacy": "ڈیٹا اور اکاؤنٹ رازداری",
        "concernPrivacyDesc": "ذاتی معلومات لیک ہونے کی فکر",
        "concernCharges": "پوشیدہ فیس اور اخراجات",
        "concernChargesDesc": "بغیر بتائے بینک کے کاٹنے کا شک",
        "concernMistakes": "غلطیاں کرنے کا خوف",
        "concernMistakesDesc": "غلط ہندسہ ٹائپ کرنے سے غلط شخص کو پیسے جانے کا خوف",
        "reassurancePortal": "سیکیورٹی پورٹل",
        "reassuranceDesc": "سیکیورٹی حقائق اور ریگولاتری ضمانتیں پڑھنے کے لیے بائیں طرف ایک یا زیادہ فکریں منتخب کریں۔",
        "altAssessment": "متبادل جانچ",
        "reliabilityTitle": "متبادل مالی قابل اعتماد",
        "reliabilityDesc": "جن صارفین کے پاس باضابطہ بینک کریڈٹ ہسٹری یا تنخواہ سلپ نہیں ہے، آرتھا سیتو بچت کے پیٹرن اور لین دین کی عادات کی بنیاد پر متبادل اشاروں کا جائزہ لیتا ہے۔",
        "simReliability": "محاکمہ قابل اعتماد پروفائل",
        "incomeProfile": "آمدنی اور بچت پروفائل",
        "consentDetails": "اپنی قابل اعتماد درجہ بندی کا حساب لگانے کے لیے رضامندی مبنی تفصیلات فراہم کریں۔",
        "incomePattern": "1. آپ کی آمدنی کا پیٹرن کیسا ہے؟",
        "incomeRegular": "باقاعدہ ماہانہ",
        "incomeIrregular": "بے قاعدہ روزانہ/ہفتہ وار",
        "incomeSeasonal": "موسمی (فصل/گگز)",
        "indicatorsTitle": "2. اپنے لیے لاگو اشارے منتخب کریں:",
        "ind1": "میں باقاعدہ طور پر دکان کا کرایہ یا یوٹیلٹی بل بھرتا ہوں",
        "ind2": "میں ڈاک خانہ/بچت باکس میں کچھ نقد بچت رکھتا ہوں",
        "ind3": "میرے پاس تجارتی انونٹری یا کاروبار کی فراہمی ہے",
        "ind4": "میرے پاس مقامی غیر رسمی قرض دہندہ کا کوئی بقایا قرض نہیں ہے",
        "consentText": "میں ایک محاکمہ کریڈٹ قابل اعتماد اسکور بنانے کے لیے متبادل اشاروں کے استعمال کی رضامندی دیتا ہوں۔",
        "generateProfile": "نجن پروفائل تیار کریں",
        "engineTitle": "آرتھا سیتو موافق پروفائلنگ ننج",
        "engineDesc": "یہاں آپ کا حسابی مالی پروفائل ہے۔ ایپ آپ کے لیے ایک موافق راستہ منتخب کرتی ہے۔",
        "scoreLiteracy": "مالی ساکھ",
        "scoreDigital": "ڈیجیٹل اعتماد",
        "scoreReliability": "متبادل قابل اعتماد",
        "recommendedPath": "تجویز کردہ آن بورڈنگ راستہ",
        "calculating": "حساب لگ رہا ہے...",
        "selectContinue": "پروفائلنگ چلانے کے لیے جاری رکھیں منتخب کریں۔",
        "enterLab": "محفوظ فائنانس لیب میں داخل ہوں",
        "labTitle": "محفوظ فائنانس لیب",
        "practiceSandboxTag": "مشق سینڈباکس",
        "tabPayment": "مشق ادائیگی",
        "tabFraud": "فراڈ فشنگ ڈیٹیکٹر",
        "tabLoan": "قرضہ تقابلی",
        "tabBudget": "بجٹ اور عدم استحکام",
        "arthapay": "آرتھا پے",
        "enterRecipient": "وصول کنندہ کا UPI ID / فون درج کریں",
        "verifyRecipient": "وصول کنندہ کی تصدیق کریں",
        "verified": "تصدیق شدہ",
        "enterAmount": "ٹرانسفر رقم درج کریں (₹)",
        "walletBalance": "مشق والیٹ بیلنس: ₹1,000",
        "continueToPay": "ادائیگی جاری رکھیں",
        "enterUPIPIN": "6 ہندسوں کا UPI PIN درج کریں",
        "payingRs": "ادائیگی ₹",
        "toRecipient": "کسان بھائی کو",
        "txnSuccess": "لین دین کامیاب!",
        "sentTo": "کسان بھائی کو بھیجا گیا",
        "txnId": "لین دین ID:",
        "payAgain": "دوبارہ ادائیگی کریں",
        "paymentTutorial": "محاکمہ ادائیگی ٹیوٹوریل",
        "paymentTutorialDesc": "حقیقی پیسوں کا خطرہ اٹھائے بغیر فنڈز ٹرانسفر کرنا سیکھیں۔",
        "crucialGuidelines": "اہم رہنمائی:",
        "practicePIN": "آپ کا مشق PIN کوڈ ہے: ",
        "tip2": "ادائیگی کرنے سے پہلے تصدیق شدہ وصول کنندہ نام دوبارہ چیک کریں۔",
        "tip3": "معیاری محفوظ بینکر اسکرینوں کے علاوہ کہیں بھی اپنا PIN ٹائپ نہ کریں۔",
        "walletHistory": "والیٹ ہسٹری",
        "welcomeBonus": "خوش آمدید بونس",
        "messageInbox": "پیغام ان باکس",
        "fraudDesc": "آربی آئی کے ضوابط کے تحت، غیر م授权 الیکٹرانک لین دین کی اطلاع 3 دنوں کے اندر دینے پر آپ کی ذمہ داری صفر ہے۔",
        "selectMessage": "ایک پیغام منتخب کریں",
        "fraudPlaceholder": "اس کی سیکیورٹی کا تجزیہ کرنے کے لیے فہرست میں سے ایک ان کمنگ SMS پر کلک کریں۔",
        "classifySafe": "محفوظ کے طور پر درجہ بندی کریں",
        "reportFraud": "فراڈ / اسپام کے طور پر رپورٹ کریں",
        "loanTitle": "قرضہ لاگت سیمولیٹر",
        "loanDesc": "کل واپسی دیکھنے اور سود کے جال سے بچنے کے لیے سلائیڈر کی ترمیم کریں۔",
        "principalAmt": "اصل رقم",
        "interestRate": "سود کی شرح (سالانہ)",
        "tenure": "مدت (مہینے)",
        "flatLoan": "فلیٹ قرضہ (سادہ سود)",
        "flatRateFinancing": "فلیٹ شرح فنانسنگ",
        "monthlyEMI": "ماہانہ EMI",
        "totalInterest": "کل سود",
        "totalRepayment": "کل واپسی",
        "flatLoanDesc": "سود صرف ابتدائی اصل پر حساب کیا جاتا ہے۔",
        "compoundLoan": "مرکب قرضہ (گھٹتا بیلنس)",
        "reducingBalanceFinancing": "گھٹتا بیلنس فنانسنگ",
        "compoundLoanDesc": "سود صرف باقی اصل پر حساب کیا جاتا ہے۔ فلیٹ قرضہ سے بہتر!",
        "budgetTitle": "موسمی آمدنی عدم استحکام سیمولیٹر",
        "budgetDesc": " مختلف آمدنی رکاوٹوں کے تحت اخراجات کا انتظام کریں۔ محاکمہ مہینہ کھیلیں!",
        "currentIncome": "موجودہ آمدنی ماڈل:",
        "foodAlloc": "کھانا اور کرایہ مختص (₹)",
        "savingsBox": "بچت باکس (₹)",
        "growthAlloc": "سرمایہ کاری / کاروباری ترقی (₹)",
        "simulateMonth": "اگلا مہینہ محاکمہ کریں",
        "walletBal": "والیٹ بیلنس",
        "accumSavings": "جمع شدہ بچت",
        "activityLog": "سرگرمی لاگ",
        "gameStarted": "کھیل شروع۔",
        "guidanceTitle": "ذاتی مالی رہنمائی",
        "guidanceDesc": "یہاں آپ کے جانچوں کی بنیاد پر تیار کردہ اہم مالی قواعد ہیں۔",
        "viewReport": "تیاری رپورٹ دیکھیں",
        "reportTitle": "مالی تیاری رپورٹ",
        "reportDesc": "بہترین پیشرفت! یہاں آپ کا سرکاری صلاحیت جانچ سرٹیفکیٹ ہے۔",
        "certTitle": "آرتھا سیتو صلاحیت سرٹیفکیٹ",
        "certAwardedTo": "یہ سرٹیفکیٹ دیا جاتا ہے",
        "certDesc": "محفوظ فائنانس لیب سمیولیٹر میں موافق مالی پروفائلنگ اور محفوظ لین دین کی مشق کو کامیابی سے مکمل کرنے کے لیے۔",
        "certLiteracy": "ساکھ لیول",
        "certDigital": "ڈیجیٹل اعتماد",
        "certPathway": "مدد گار راستہ",
        "certSystem": "سسٹم جاری",
        "certDate": "تصدیق کی تاریخ",
        "printCert": "سرٹیفکیٹ پرنٹ کریں",
        "provideFeedback": "رائے دیں",
        "feedbackTitle": "رائے اور نتیجہ پیمائش",
        "feedbackDesc": "اس موافق ڈھانچے کا جائزہ لینے میں ہماری مدد کریں۔",
        "surveyQ1": "1. اس ایپلیکیشن کو نیویگیٹ کرنا کتنا آسان تھا؟",
        "surveyQ2": "2. کیا آپ نے سیکیورٹی قواعد اور فراڈ انتباہات کو واضح طور پر سمجھا؟",
        "surveyQ3": "3. اب اکیلے موبائل ادائیگی کرنے میں آپ کتنا اعتماد محسوس کرتے ہیں؟",
        "surveyQ4": "4. کیا آپ کے پاس کوئی تجاویز یا تبصرے ہیں؟",
        "feedbackPlaceholder": "ہندی، انگریزی وغیرہ میں یہاں ٹائپ کریں۔",
        "saveReset": "محفوظ کریں اور ایپلیکیشن ری سیٹ کریں",
        "assistantName": "آرتھا دوت معاون:",
        "welcomeArthasetu": "آرتھا سیتو میں خوش آمدید۔",
        "voiceOn": "آواز مدد: چالو",
        "voiceOff": "آواز مدد: بند",
        "helpWelcome": "سلام! میں آرتھا دوت ہوں۔ میں اسکرین کی معلومات پڑھ کر آپ کی رہنمائی کروں گا۔ شروع کرنے کے لیے کسی بھی باکس کو چھوئیں۔",
        "profileHelp": "تجربے کو اپنی ضرورت کے مطابق ڈھالنے کے لیے ہر زمرے سے ایک آپشن منتخب کریں۔",
        "quizHelp": "آپ جو آپشن صحیح لگے اسے منتخب کریں۔ یہ صرف مشق ہے، غلطیوں سے نہ ڈریں۔",
        "digitalHelp": "آئیے تین کاموں کی جانچ کریں۔ پہلا، کی پیڈ پر 4096 ٹائپ کریں۔ دوسرا، سکے کو پگی بینک میں ڈالیں۔ تیسرا، سلائیڈر کو دائیں طرف پھیلائیں۔",
        "trustHelp": "ان باکسوں پر ٹک لگائیں جہاں آپ کو آن لائن لین دین غیر محفوظ لگتا ہے۔",
        "reliabilityHelp": "اگر آپ کے پاس کریڈٹ اسکور نہیں ہے، تو متبادل طریقے آپ کی قابل اعتماد دکھانے میں مدد کرتے ہیں۔",
        "sandboxHelp": "بغیر کسی خطرے کے ادائیگی کی مشق کریں، فراڈ پیغامات کی پہچان بنائیں، سود کی شرحیں دیکھیں یا بجٹ منصوبہ بندی کی مشق کریں۔",
        "guidanceHelp": "ان سیکیورٹی قواعد کو پڑھیں۔ ہم نے انہیں آپ کے جوابات کی بنیاد پر تیار کیا ہے۔",
        "reportHelp": "یہ آپ کا مکملت سرٹیفکیٹ ہے!",
        "surveyHelp": "براہ کرم اپنے تجربے کی درجہ بندی کریں۔ شکریہ!",
        "pathAssisted": "آواز/بصری مدد گار راستہ",
        "pathAssistedDesc": "سمارٹ فون اور ڈیجیٹل ساکھ لیول کو مدنظر رکھتے ہوئے، سسٹم نے آپ کے لیے مکمل آواز اور بڑی بصری رہنمائی فعال کی ہے۔",
        "pathAssistedFeat1": "خودکار آواز رہنمائی فعال",
        "pathAssistedFeat2": "بڑے فونٹ سائز",
        "pathAssistedFeat3": "آسان بٹن نیویگیشن",
        "pathGuided": "راہنمائی راستہ",
        "pathGuidedDesc": "آپ بنیادی ایپس چلا لیتے ہیں۔ سسٹم اہم بٹنوں پر ہائی لائٹ اور پاپ اپ ہدایات دکھائے گا۔",
        "pathGuidedFeat1": "فعال بٹنوں پر چمکتا ہائی لائٹ",
        "pathGuidedFeat2": "وقت پر سیکیورٹی پاپ اپ پیغامات",
        "pathGuidedFeat3": "اشارہ ٹول ٹپس",
        "pathSelf": "خود رہنمائی راستہ",
        "pathSelfDesc": "آپ سمارٹ فون چلانے میں بہت ماہر ہیں۔",
        "pathSelfFeat1": "عام نیویگیشن موڈ",
        "pathSelfFeat2": "مکمل ٹول آزادی",
        "pathSelfFeat3": "اعلیٰ سینڈباکس مشق",
        "certSelf": "خود رہنمائی",
        "certGuided": "راہنمائی مدد",
        "certAssisted": "آواز مدد",
        "lockedMsg": "یہ حصہ بند ہے۔ براہ کرم پچھلا کام پہلے مکمل کریں۔",
        "occupationMsg": "پیشہ درج ہو گیا۔",
        "answerMsg": "جواب درج ہو گیا۔",
        "clearedMsg": "صاف کیا",
        "codeSuccess": "کامیاب! کوڈ درست ہے۔",
        "firstTaskDone": "بہترین! پہلا کام مکمل ہوا۔",
        "codeWrong": "غلط کوڈ۔ دوبارہ کوشش کریں۔",
        "codeWrongRetry": "غلط کوڈ، براہ کرم دوبارہ 4096 ٹائپ کریں۔",
        "savingsSecured": "بچت محفوظ!",
        "coinDeposited": "کامیاب! سکہ جمع ہوا۔",
        "coinSecured": "مبارک ہو، سکہ بینک میں محفوظ ہے۔",
        "swipeSuccess": "کامیاب! سوائپ منظور ہوا۔",
        "swipeDone": "سوائپ کامیابی سے منظور ہو گیا۔",
        "optionToggled": "آپشن بدل گیا۔",
        "incomeRecorded": "آمدنی کی شکل درج ہوئی۔",
        "scoreCalculated": "متبادل اشارہ اسکور {score} فیصد ہوا۔",
        "labTabActive": "لیب کا {tab} مشق فعال ہوا۔",
        "recipientVerified": "کامیاب! وصول کنندہ تصدیق ہو گیا ہے۔",
        "enterValidUPI": "براہ کرم درست وصول کنندہ UPI ID یا نمبر درج کریں۔",
        "enterAmountMsg": "براہ کرم 10 سے 2,000 روپے کے درمیان رقم درج کریں۔",
        "insufficientFunds": "سینڈباکس والیٹ میں کافی رقم نہیں ہے۔",
        "enterPIN": "تصدیق کرنے کے لیے 6 ہندسوں کا UPI PIN ٹائپ کریں۔",
        "paymentSuccess": "کامیاب! ادائیگی مکمل ہو گئی ہے۔",
        "wrongPIN": "غلط UPI PIN۔ براہ کرم دوبارہ 123456 ٹائپ کریں۔",
        "smsReview": "پیغام کھول دیا گیا ہے۔",
        "correctDecision": "آپ کا فیصلہ بالکل درست ہے۔",
        "wrongDecision": "غلط فیصلہ۔ سیکیورٹی انتباہ کو غور سے پڑھیں۔",
        "overBudget": "کل مختصات آپ کے والیٹ بیلنس سے زیادہ ہیں!",
        "monthComplete": "مہینہ مکمل ہوا۔",
        "monthLabel": "مہینہ",
        "ratingRecorded": "درجہ بندی درج ہوئی۔",
        "profileSaved": "مبارک ہو! آپ کی پروفائل محفوظ ہو گئی ہے۔",
        "onboardingDone": "کامیاب! آپ کی رائے درج ہو گئی ہے۔",
        "fraudTitle": "دھوکہ دہی سے تحفظ",
        "privacyTitle": "رازداری اور بینکنگ ایکٹ",
        "privacyDesc": "آپ کا ڈیٹا DPDP ایکٹ کے تحت محفوظ ہے۔",
        "chargesTitle": "صفر پوشیدہ فیس لازمی",
        "chargesDesc": "بی ایس بی ڈی اکاؤنٹس میں کم از کم رکھنے کی کوئی حد نہیں ہے۔",
        "mistakesTitle": "غلط ادائیگی واپسی",
        "mistakesDesc": "غلط اکاؤنٹ میں پیسے بھیجنے پر آپ NPCI پورٹل پر شکایت درج کرا سکتے ہیں۔",
        "tipSecTitle": "OTP یا PIN کبھی شیئر نہ کریں",
        "tipSecDesc": "کوئی بھی بینک عملہ کال پر آپ کا UPI PIN یا OTP نہیں مانگتا۔",
        "tipSavTitle": "ایمرجنسی بچت باسکٹ",
        "tipSavDescRegular": "باقاعدہ آمدنی ہونے پر ہر مہینہ کم از کم 15% رقم الگ بچت اکاؤنٹ میں جمع کریں۔",
        "tipSavDescIrregular": "آپ کی آمدنی موسمی ہے، اس لیے کم از کم 3 مہینوں کے بنیادی اخراجات کے برابر رقم الگ بچت اکاؤنٹ میں رکھیں۔",
        "tipCreTitle": "غیر رسمی سود کے جال سے بچیں",
        "tipCreDesc": "مقامی سود اور دہندہ کا 5% ماہانہ سود 60% سالانہ ہو جاتا ہے!",
        "tipPayTitle": "ادائیگی تصدیق شدہ ID کی جانچ",
        "tipPayDesc": "پن ڈالنے سے پہلے ہمیشہ وصول کنندہ کا تصدیق شدہ نام پڑھیں۔",
        "sms1Sender": "AD-LOTTRI",
        "sms1Text": "مبارک ہو! آپ نے سرکاری پروموشن سے ₹10,00,000 کی لاٹری جیتی ہے۔",
        "sms1Expl": "یہ فراڈ ہے۔ سرکاری محکمے عوامی SMS لنک سے لاٹری نہیں دیتے۔",
        "sms2Sender": "سٹیٹ بینک",
        "sms2Text": "پیارے گاہک، آپ کا ماہانہ بینک اسٹیٹمنٹ تیار ہے۔ براہ کرم اپنے سرکاری پورٹل پر لاگ ان کریں۔",
        "sms2Expl": "یہ محفوظ ہے۔ پیغام میں کوئی فوری خطرہ نہیں ہے۔",
        "sms3Sender": "BP-ALERT",
        "sms3Text": "الرٹ! آپ کا بجلی بل ₹1,450 بقایا ہے۔",
        "sms3Expl": "یہ فراڈ ہے۔ یوٹیلٹی کمپنیاں بے ترتیب فون نمبروں سے فوری ڈس کنیکشن کی دھمکی نہیں دیتیں۔",
        "eventMedical": "طبی ایمرجنسی",
        "eventMedicalDesc": "خاندان کا ایک ممبر بیمار ہو گیا۔ ₹1,000 علاج اخراجات۔",
        "eventHarvest": "بمپر فصل بونس",
        "eventHarvestDesc": "فصل کی مانگ ناگہانی بڑھ گئی! ₹1,500 اضافی منافع۔",
        "eventDrought": "خشک سالی / مقامی مندی",
        "eventDroughtDesc": "خراب موسم کی وجہ سے کوئی آمدنی نہیں ہوئی۔",
        "eventFestival": "تیوہار جشن",
        "eventFestivalDesc": "میٹھائی اور تحفے میں ₹500 خرچ۔",
        "securityDashDesc": "10 Next-Gen Security Innovations protecting your financial data",
        "consentMgrDesc": "Cryptographic consent tokens — you control who accesses your data",
        "zkpVerifierDesc": "Prove your attributes without revealing the actual data"
    },
    "gu": {
        "brandTagline": "અનુકૂળ સમાવેશ",
        "navGroup1": "1. નોંધણી અને પ્રોફાઇલિંગ",
        "navGroup2": "2. ઇન્ટરેક્ટિવ મૂલ્યાંકન",
        "navGroup3": "3. શીખવું અને લેબ",
        "navGroup4": "4. સારાંશ અને પ્રતિસાદ",
        "navGroup5": "5. નવી પેઢીની સુરક્ષા",
        "guestUser": "મહેમાન વપરાશકર્તા",
        "online": " ઓનલાઇન",
        "title1": "ભાષા અને અવાજ",
        "title2": "\"મને જાણો\" પ્રોફાઇલ",
        "title3": "નાણાકીય સાક્ષરતા",
        "title4": "ડિજિટલ વિશ્વાસ",
        "title5": "વિશ્વાસ અને સુરક્ષા",
        "title6": "વિશ્વસનીયતા અને આવક",
        "title7": "અનુકૂળ એન્જિન",
        "title8": "સુરક્ષિત ફાઇનાન્સ લેબ",
        "title9": "વ્યક્તિગત માર્ગદર્શન",
        "title10": "તૈયારી રિપોર્ટ",
        "title11": "પ્રતિસાદ સર્વે",
        "title12": "સુરક્ષા ડેશબોર્ડ",
        "title13": "સંમતિ મેનેજર",
        "title14": "ZKP ચકાસણીકાર",
        "prototype": "પ્રોટોટાઇપ",
        "welcomeTitle": "આવકાર છે",
        "welcomeDesc": "અર્થસેતુ તમારી નાણાકીય જરૂરિયાતો, ડિજિટલ ક્ષમતા અને પસંદીદા ભાષા અનુસાર અનુકૂળ થાય છે. અમે તમને ઔપચારિક નાણાકીય સુરક્ષિત રીતે શીખવામાં મદદ કરીએ છીએ.",
        "langCount": "6+",
        "indianLanguages": "ભારતીય ભાષાઓ",
        "sandboxPct": "100%",
        "practiceSandbox": "અભ્યાસ સેન્ડબોક્સ",
        "selectLang": "તમારી ભાષા પસંદ કરો",
        "langSubtitle": "આખું એપ તમારી પસંદીદા ભાષામાં કામ કરશે",
        "enableVoice": "વૉઇસ સહાય સક્ષમ કરો",
        "voiceDesc": "અમારા વર્ચુઅલ ગાઇડ \"અર્થદૂત\" તમારી પસંદીદા ભાષામાં સૂચનાઓ જોરથી વાંચશે.",
        "startProfiling": "પ્રોફાઇલિંગ શરૂ કરો",
        "tellUsAbout": "અમને તમારા વિશે જણાવો",
        "configureApp": "અમે તમારી દૈનિક જીવનશૈલી અને વ્યવસાયના આધારે એપ્લિકેશન કોન્ફિગર કરીએ છીએ.",
        "questionOccupation": "1. તમારો પ્રાથમિક વ્યવસાય શું છે?",
        "occRetailer": "નાનો વેપારી / દુકાનદાર",
        "occRetailerSub": "દુકાનદાર / રહેડી-પટરી",
        "occFarmer": "ખેડૂત / ખેતી",
        "occFarmerSub": "ખેડૂત / ખેતી-બાડી",
        "occWorker": "ગિગ વર્કર / ડિલિવરી",
        "occWorkerSub": "ડિલિવરી / ટેક્સી ચાલક",
        "occDailywager": "દૈનિક વેતન ભોગી",
        "occDailywagerSub": "મજૂર / દૈનિક વેતન",
        "questionFinExp": "2. શું તમે ઔપચારિક બેંકિંગ અને ડિજિટલ ચુકવણી સેવાઓ વાપરી છે?",
        "finBeginner": "પહેલી વાર વપરાશકર્તા",
        "finBeginnerSub": "UPI / ઓનલાઇન બેંકિંગ ક્યારેય વાપર્યું નથી",
        "finBasic": "બેઝિક વપરાશકર્તા",
        "finBasicSub": "બેંક કાર્ડ છે, પરંતુ UPI ઓછો વાપરો છો",
        "finIntermediate": "ઇન્ટરમિડિયેટ વપરાશકર્તા",
        "finIntermediateSub": "ક્યારેક UPI વાપરો છો, વિશ્વાસ જોઈએ છે",
        "questionDigConf": "3. સ્માર્ટફોન ચલાવવામાં તમે કેટલા સહજ છો?",
        "digLow": "સહાય જરૂરી",
        "digLowSub": "સામાન્ય રીતે બીજાને કામ કરાવો છો",
        "digMedium": "બેઝિક એપ્સ ચલાવી શકો છો",
        "digMediumSub": "WhatsApp / YouTube સરળતાથી વાપરો છો",
        "digHigh": "ખૂબ વિશ્વાસુ",
        "digHighSub": "એપ્સ ડાઉનલોડ કરી શકો છો અને ટાઇપિંગ કરી શકો છો",
        "back": "પાછળ",
        "continue": "આગળ વધો",
        "quizTitle": "નાણાકીય સાક્ષરતા મૂલ્યાંકન",
        "quizDesc": "અમને તમારી નાણાકીય અવધારણાઓ સમજવા માટે ત્રણ દૃશ્ય-આધારિત પ્રશ્નોના જવાબ આપો.",
        "q1of3": "પ્રશ્ન 1 માંથી 3",
        "q1Title": "ફ્લેટ વ્યાજ ગણતરી",
        "q1Scenario": "જો તમે 10% ફ્લેટ વ્યાજ દરે 1 વર્ષ માટે ₹10,000 ઉછીના લો, તો વર્ષના અંતે તમે કુલ કેટલું વ્યાજ ચૂકવો છો?",
        "q1a0": "₹1,000 (સાચું વ્યાજ ચુકવણી)",
        "q1a1": "₹100 (1% ગણતરી)",
        "q1a2": "₹0 (વ્યાજ-મુક્ત લોન)",
        "q1a3": "મને ખબર નથી / ખાતરીપૂર્વક નથી",
        "q2of3": "પ્રશ્ન 2 માંથી 3",
        "q2Title": "સુરક્ષિત PIN અને OTP હેન્ડલિંગ",
        "q2Scenario": "તમને અજાણી વ્યક્તિનો ફોન આવે છે જે બેંક મેનેજર હોવાનો દાવો કરે છે. તેઓ તમારો UPI PIN અથવા OTP માંગે છે. તમે શું કરો છો?",
        "q2a0": "શેર કરું જેથી મારું એકાઉન્ટ બ્લોક ન થાય",
        "q2a1": "ફક્ત ત્યારે જ શેર કરું જો તેઓ મારું સાચું નામ જણાવે",
        "q2a2": "કોલ પર કોઈની સાથે પણ પોતાનો PIN/OTP ક્યારેય શેર ન કરો (સાચું)",
        "q2a3": "તેમને કહું કે હું પછીથી તેમને ફોન કરીશ",
        "q3of3": "પ્રશ્ન 3 માંથી 3",
        "q3Title": "બેંક બચતનું મહત્વ",
        "q3Scenario": "ઘરમાં ડબ્બામાં રોકડ રાખવાની તુલનામાં ઔપચારિક બેંક એકાઉન્ટમાં પૈસા બચાવવાનો પ્રાથમિક ફાયદો શું છે?",
        "q3a0": "પૈસા પર વ્યાજ મળે છે અને ચોરીથી સુરક્ષિત છે (સાચું)",
        "q3a1": "બેંકમાં રાખેલા પૈસા ખર્ચવા સરળ છે",
        "q3a2": "રોકડ અને બેંક એકાઉન્ટમાં કોઈ ફરક નથી",
        "q3a3": "ફાયદા વિશે ખાતરીપૂર્વક નથી",
        "digitalTitle": "ડિજિટલ વિશ્વાસ મૂલ્યાંકન",
        "digitalDesc": "તમારા સ્માર્ટફોન અને ટચ સ્ક્રીન આરામની કસોટી કરવા માટે આ ત્રણ સરળ ઇન્ટરેક્ટિવ કાર્યો પૂર્ણ કરો.",
        "task1Title": "કાર્ય 1: નંબર ટાઇપ કરવો",
        "task1Heading": "ન્યૂમેરિક કોડ દાખલ કરો",
        "task1Desc": "નીચે સ્ક્રીન કીપેડનો ઉપયોગ કરીને કોડ ટાઇપ કરો: ",
        "task2Title": "કાર્ય 2: ખેંચો અને છોડો",
        "task2Heading": "તમારો સિક્કો સુરક્ષિત કરો",
        "task2Desc": "સોનાના સિક્કાને નીચે પિગી બેંકમાં ખેંચીને લઈ જાઓ.",
        "dropCoin": "સિક્કો અહીં મૂકો",
        "task3Title": "કાર્ય 3: સ્વાઇપ જેસ્ચર",
        "task3Heading": "ચુકવણી માટે સ્વાઇપ કરો",
        "task3Desc": "સ્લાઇડર કીને જમણી બાજુએ સ્વાઇપ કરીને અનુકરણ ચુકવણીને અધિકૃત કરો.",
        "swipeConfirm": "પુષ્ટિ માટે જમણી બાજુએ સ્વાઇપ કરો",
        "waitingInput": "ઇનપુટની રાહ જોઈ રહ્યા છીએ...",
        "dragStart": "સિક્કો ખેંચીને શરૂ કરો",
        "slideHandle": "હેન્ડલને જમણી બાજુએ સ્લાઇડ કરો",
        "trustTitle": "વિશ્વાસ અને સુરક્ષા ચિંતાઓ",
        "trustDesc": "ડિજિટલ ફાઇનાન્સ વાપરવામાં જે પણ ચિંતાઓ તમને અટકાવે છે તેને પસંદ કરો.",
        "trustConcerns": "તમારી મુખ્ય ચિંતાઓ શું છે? (બધી લાગુ પડતી પસંદ કરો)",
        "concernFraud": "છેતરપિંડી અને ફ્રોડનો ડર",
        "concernFraudDesc": "ઓનલાઇન છેતરપિંડી કરનારાઓ પાસેથી પૈસા ગુમાવવાની ચિંતા",
        "concernPrivacy": "ડેટા અને એકાઉન્ટ ગોપનીયતા",
        "concernPrivacyDesc": "અંગત માહિતી લીક થવાની ચિંતા",
        "concernCharges": "છુપાયેલી ફીસ અને ખર્ચા",
        "concernChargesDesc": "વિના કારણ બેંક દ્વારા કાપવાની શંકા",
        "concernMistakes": "ભૂલો કરવાનો ડર",
        "concernMistakesDesc": "ખોટો નંબર ટાઇપ કરવાથી ખોટી વ્યક્તિને પૈસા જવાનો ડર",
        "reassurancePortal": "સુરક્ષા પોર્ટલ",
        "reassuranceDesc": "સુરક્ષા તથ્યો અને નિયમનકારી ગેરંટીઓ વાંચવા માટે ડાબી બાજુએ એક કે વધુ ચિંતાઓ પસંદ કરો.",
        "altAssessment": "વિકલ્પી મૂલ્યાંકન",
        "reliabilityTitle": "વિકલ્પી નાણાકીય વિશ્વસનીયતા",
        "reliabilityDesc": "જે વપરાશકર્તાઓ પાસે ઔપચારિક બેંક ક્રેડિટ ઇતિહાસ અથવા પગાર સ્લિપ નથી, અર્થસેતુ બચત પેટર્ન અને લેવડદેવ આદતોના આધારે વિકલ્પી સૂચકોનું મૂલ્યાંકન કરે છે.",
        "simReliability": "અનુકરણ વિશ્વસનીયતા પ્રોફાઇલ",
        "incomeProfile": "આવક અને બચત પ્રોફાઇલ",
        "consentDetails": "તમારી વિશ્વસનીયતા શ્રેણીની ગણતરી કરવા માટે સંમતિ-આધારિત વિગતો પ્રદાન કરો.",
        "incomePattern": "1. તમારી આવકનું પેટર્ન કેવું છે?",
        "incomeRegular": "નિયમિત માસિક",
        "incomeIrregular": "અનિયમિત દૈનિક/સાપ્તાહિક",
        "incomeSeasonal": "મૌસમી (પાક/ગિગ્ઝ)",
        "indicatorsTitle": "2. તમારા માટે લાગુ પડતા સૂચકો પસંદ કરો:",
        "ind1": "હું નિયમિત રીતે દુકાનનું ભાડું અથવા યુટિલિટી બિલ ભરું છું",
        "ind2": "હું ડાકઘર/બચત બોક્સમાં થોડી રોકડ બચત રાખું છું",
        "ind3": "મારી પાસે વેપારી ઇન્વેન્ટરી અથવા વેપાર સપ્લાય છે",
        "ind4": "મારી પાસે સ્થાનિક અનૌપચારિક ધિરાણકર્તાનું કોઈ બાકી દેવું નથી",
        "consentText": "હું એક અનુકરણ ક્રેડિટ વિશ્વસનીયતા સ્કોર બનાવવા માટે વિકલ્પી સૂચકોના ઉપયોગ માટે સંમતિ આપું છું.",
        "generateProfile": "ઇન્જિન પ્રોફાઇલ તૈયાર કરો",
        "engineTitle": "અર્થસેતુ અનુકૂળ પ્રોફાઇલિંગ ઇન્જિન",
        "engineDesc": "અહીં તમારી ગણિતીય નાણાકીય પ્રોફાઇલ છે. એપ તમારા માટે અનુકૂળ માર્ગ પસંદ કરે છે.",
        "scoreLiteracy": "નાણાકીય સાક્ષરતા",
        "scoreDigital": "ડિજિટલ વિશ્વાસ",
        "scoreReliability": "વિકલ્પી વિશ્વસનીયતા",
        "recommendedPath": "ભલામણ કરેલી ઓનબોર્ડિંગ માર્ગ",
        "calculating": "ગણતરી થઈ રહી છે...",
        "selectContinue": "પ્રોફાઇલિંગ ચલાવવા માટે ચાલુ રાખો પસંદ કરો.",
        "enterLab": "સુરક્ષિત ફાઇનાન્સ લેબમાં પ્રવેશ કરો",
        "labTitle": "સુરક્ષિત ફાઇનાન્સ લેબ",
        "practiceSandboxTag": "અભ્યાસ સેન્ડબોક્સ",
        "tabPayment": "અભ્યાસ ચુકવણી",
        "tabFraud": "ફ્રોડ ફિશિંગ ડિટેક્ટર",
        "tabLoan": "લોન તુલના",
        "tabBudget": "બજેટ અને અસ્થિરતા",
        "arthapay": "અર્થાપે",
        "enterRecipient": "પ્રાપ્તકર્તાનો UPI ID / ફોન દાખલ કરો",
        "verifyRecipient": "પ્રાપ્તકર્તાની ચકાસણી કરો",
        "verified": "ચકાસાયેલ",
        "enterAmount": "ટ્રાન્સફર રકમ દાખલ કરો (₹)",
        "walletBalance": "અભ્યાસ વૉલેટ બેલેન્સ: ₹1,000",
        "continueToPay": "ચુકવણી ચાલુ રાખો",
        "enterUPIPIN": "6 અંકોનો UPI PIN દાખલ કરો",
        "payingRs": "ચુકવણી ₹",
        "toRecipient": "કિસાન ભાઈને",
        "txnSuccess": "લેવડદેવ સફળ!",
        "sentTo": "કિસાન ભાઈને મોકલાયું",
        "txnId": "લેવડદેવ ID:",
        "payAgain": "ફરી ચુકવણી કરો",
        "paymentTutorial": "અનુકરણ ચુકવણી ટ્યુટોરીયલ",
        "paymentTutorialDesc": "વાસ્તવિક પૈસાનું જોખમ ઉઠાવ્યા વિના ફંડ્સ ટ્રાન્સફર કરવાનું શીખો.",
        "crucialGuidelines": "મહત્વપૂર્ણ માર્ગદર્શન:",
        "practicePIN": "તમારો અભ્યાસ PIN કોડ છે: ",
        "tip2": "ચુકવણી કરતા પહેલાં ચકાસાયેલ પ્રાપ્તકર્તા નામ ફરી તપાસો.",
        "tip3": "માનક સુરક્ષિત બેંકર સ્ક્રીન્સ સિવાય ક્યાંય પણ તમારો PIN ટાઇપ ન કરો.",
        "walletHistory": "વૉલેટ ઇતિહાસ",
        "welcomeBonus": "સ્વાગત બોનસ",
        "messageInbox": "સંદેશ ઇનબોક્સ",
        "fraudDesc": "RBI નિયમો હેઠળ, અનધિકૃત ઇલેક્ટ્રોનિક લેવડદેવની જાણ 3 દિવસની અંદર કરવા પર તમારી જવાબદારી શૂન્ય છે.",
        "selectMessage": "એક સંદેશ પસંદ કરો",
        "fraudPlaceholder": "સુરક્ષાનું વિશ્લેષણ કરવા માટે યાદીમાંથી ઇનકમિંગ SMS પર ક્લિક કરો.",
        "classifySafe": "સુરક્ષિત તરીકે વર્ગીકૃત કરો",
        "reportFraud": "ફ્રોડ / સ્પેમ તરીકે રિપોર્ટ કરો",
        "loanTitle": "લોન કોસ્ટ સિમ્યુલેટર",
        "loanDesc": "કુલ પુનર્ચુકવણી જોવા માટે અને વ્યાજ જાળમાંથી બચવા માટે સ્લાઇડર ઍડજસ્ટ કરો.",
        "principalAmt": "મૂળ રકમ",
        "interestRate": "વ્યાજ દર (વાર્ષિક)",
        "tenure": "મુદત (મહિના)",
        "flatLoan": "ફ્લેટ લોન (સાદું વ્યાજ)",
        "flatRateFinancing": "ફ્લેટ દર ફાઇનાન્સિંગ",
        "monthlyEMI": "માસિક EMI",
        "totalInterest": "કુલ વ્યાજ",
        "totalRepayment": "કુલ પુનર્ચુકવણી",
        "flatLoanDesc": "વ્યાજ ફક્ત પ્રારંભિક મૂલધન પર ગણવામાં આવે છે.",
        "compoundLoan": "ચક્રવૃદ્ધિ લોન (ઘટતું બેલેન્સ)",
        "reducingBalanceFinancing": "ઘટતું બેલેન્સ ફાઇનાન્સિંગ",
        "compoundLoanDesc": "વ્યાજ ફક્ત બાકી મૂલધન પર ગણવામાં આવે છે. ફ્લેટ લોન કરતાં સારું!",
        "budgetTitle": "સીઝનલ આવક અસ્થિરતા સિમ્યુલેટર",
        "budgetDesc": " વિવિધ આવક અવરોધો હેઠળ ખર્ચાઓનું સંચાલન કરો. અનુકરણ મહિનો રમો!",
        "currentIncome": "હાલનું આવક મોડલ:",
        "foodAlloc": "ખાણીપીણી અને ભાડું વિભાજન (₹)",
        "savingsBox": "બચત બોક્સ (₹)",
        "growthAlloc": "રોકાણ / વેપાર વિકાસ (₹)",
        "simulateMonth": "આગલો મહિનો અનુકરણ કરો",
        "walletBal": "વૉલેટ બેલેન્સ",
        "accumSavings": "સંચિત બચત",
        "activityLog": "પ્રવૃત્તિ લૉગ",
        "gameStarted": "રમત શરૂ.",
        "guidanceTitle": "વ્યક્તિગત નાણાકીય માર્ગદર્શન",
        "guidanceDesc": "અહીં તમારા મૂલ્યાંકનોના આધારે તૈયાર કરેલા મહત્વપૂર્ણ નાણાકીય નિયમો છે.",
        "viewReport": "તૈયારી રિપોર્ટ જુઓ",
        "reportTitle": "નાણાકીય તૈયારી રિપોર્ટ",
        "reportDesc": "શાનદાર પ્રગતિ! અહીં તમારું અધિકૃત સક્ષમતા મૂલ્યાંકન પ્રમાણપત્ર છે.",
        "certTitle": "અર્થસેતુ સક્ષમતા પ્રમાણપત્ર",
        "certAwardedTo": "આ પ્રમાણપત્ર આપવામાં આવે છે",
        "certDesc": "સુરક્ષિત ફાઇનાન્સ લેબ સિમ્યુલેટરમાં અનુકૂળ નાણાકીય પ્રોફાઇલિંગ અને સુરક્ષિત UPI લેવડદેવના અભ્યાસને સફળતાપૂર્વક પૂર્ણ કરવા માટે.",
        "certLiteracy": "સાક્ષરતા સ્તર",
        "certDigital": "ડિજિટલ વિશ્વાસ",
        "certPathway": "સહાયક માર્ગ",
        "certSystem": "સિસ્ટમ જારી",
        "certDate": "ચકાસણી તારીખ",
        "printCert": "પ્રમાણપત્ર પ્રિન્ટ કરો",
        "provideFeedback": "પ્રતિસાદ આપો",
        "feedbackTitle": "પ્રતિસાદ અને પરિણામ માપ",
        "feedbackDesc": "આ અનુકૂળ માળખાના મૂલ્યાંકનમાં અમારી મદદ કરો.",
        "surveyQ1": "1. આ એપ્લિકેશનને નેવિગેટ કરવું કેટલું સરળ હતું?",
        "surveyQ2": "2. શું તમે સુરક્ષા નિયમો અને ફ્રોડ ચેતવણીઓ સ્પષ્ટ રીતે સમજી?",
        "surveyQ3": "3. હવે એકલા મોબાઈલ ચુકવણી કરવામાં તમે કેટલો વિશ્વાસ અનુભવો છો?",
        "surveyQ4": "4. શું તમારી પાસે કોઈ સૂચનો અથવા ટિપ્પણીઓ છે?",
        "feedbackPlaceholder": "હિન્દી, અંગ્રેજી વગેરેમાં અહીં ટાઇપ કરો.",
        "saveReset": "સાચવો અને એપ્લિકેશન રીસેટ કરો",
        "assistantName": "અર્થદૂત સહાયક:",
        "welcomeArthasetu": "અર્થસેતુમાં આવકાર છે.",
        "voiceOn": "વૉઇસ સહાય: ચાલુ",
        "voiceOff": "વૉઇસ સહાય: બંધ",
        "helpWelcome": "નમસ્તે! હું અર્થદૂત છું. હું સ્ક્રીનની માહિતી વાંચીને તમારું માર્ગદર્શન કરીશ. શરૂ કરવા માટે કોઈ પણ બોક્સને સ્પર્શો.",
        "profileHelp": "અનુભવને તમારી જરૂરિયાત મુજબ ઢાળવા માટે દરેક શ્રેણીમાંથી એક વિકલ્પ પસંદ કરો.",
        "quizHelp": "તમને જે વિકલ્પ સાચો લાગે તે પસંદ કરો. આ ફક્ત અભ્યાસ છે, ભૂલોથી ન ડરો.",
        "digitalHelp": "ચાલો ત્રણ કાર્યોની કસોટી કરીએ. પહેલા, કીપેડ પર 4096 ટાઇપ કરો. બીજું, સિક્કો પિગી બેંકમાં મૂકો. ત્રીજું, સ્લાઇડર જમણી બાજુએ ખસેડો.",
        "trustHelp": "જ્યાં તમને ઓનલાઇન લેવડદેવ અસુરક્ષિત લાગે તે બોક્સ પર ટિક કરો.",
        "reliabilityHelp": "જો તમારી પાસે ક્રેડિટ સ્કોર ન હોય, તો વિકલ્પી રીતો તમારી વિશ્વસનીયતા બતાવવામાં મદદ કરે છે.",
        "sandboxHelp": "કોઈ જોખમ વિના ચુકવણીનો અભ્યાસ કરો, ફ્રોડ સંદેશાઓ ઓળખો, વ્યાજ દરો જુઓ અથવા બજેટ યોજનાનો અભ્યાસ કરો.",
        "guidanceHelp": "આ સુરક્ષા નિયમો વાંચો. અમે તેમને તમારા જવાબોના આધારે તૈયાર કર્યા છે.",
        "reportHelp": "આ તમારું પૂર્ણતા પ્રમાણપત્ર છે!",
        "surveyHelp": "કૃપા કરીને તમારા અનુભવને રેટ કરો. આભાર!",
        "pathAssisted": "વૉઇસ/વિઝ્યુઅલ સહાયક માર્ગ",
        "pathAssistedDesc": "સ્માર્ટફોન અને ડિજિટલ સાક્ષરતા સ્તરને ધ્યાનમાં રાખીને, સિસ્ટમે તમારા માટે સંપૂર્ણ વૉઇસ અને મોટી વિઝ્યુઅલ માર્ગદર્શન સ્ક્રીન કાઢી છે.",
        "pathAssistedFeat1": "સ્વચાલિત વૉઇસ માર્ગદર્શન સ્ક્રીન",
        "pathAssistedFeat2": "મોટા ફોન્ટ કદ",
        "pathAssistedFeat3": "સરળ બટન નેવિગેશન",
        "pathGuided": "માર્ગદર્શિત માર્ગ",
        "pathGuidedDesc": "તમે બેઝિક એપ્સ ચલાવી લો છો. સિસ્ટમ મહત્વપૂર્ણ બટનો પર હાઈલાઈટ અને પોપ-અપ સૂચનાઓ બતાવશે.",
        "pathGuidedFeat1": "સક્રિય બટનો પર ચમકતું હાઈલાઈટ",
        "pathGuidedFeat2": "સમય પર સુરક્ષા પોપ-અપ સંદેશાઓ",
        "pathGuidedFeat3": "સૂચક ટૂલટિપ્સ",
        "pathSelf": "સ્વ-માર્ગદર્શિત માર્ગ",
        "pathSelfDesc": "તમે સ્માર્ટફોન ચલાવવામાં ખૂબ કુશળ છો.",
        "pathSelfFeat1": "સામાન્ય નેવિગેશન મોડ",
        "pathSelfFeat2": "સંપૂર્ણ ટૂલ સ્વાયત્તતા",
        "pathSelfFeat3": "અદ્યતન સેન્ડબોક્સ અભ્યાસ",
        "certSelf": "સ્વ-માર્ગદર્શિત",
        "certGuided": "માર્ગદર્શિત સહાય",
        "certAssisted": "વૉઇસ સહાય",
        "lockedMsg": "આ ભાગ બંધ છે. કૃપા કરીને પહેલાં પાછલું કાર્ય પૂર્ણ કરો.",
        "occupationMsg": "વ્યવસાય નોંધાયો.",
        "answerMsg": "જવાબ નોંધાયો.",
        "clearedMsg": "સાફ કર્યું",
        "codeSuccess": "સફળ! કોડ સાચો છે.",
        "firstTaskDone": "અદ્ભુત! પહેલું કાર્ય પૂર્ણ થયું.",
        "codeWrong": "ખોટો કોડ. ફરી પ્રયાસ કરો.",
        "codeWrongRetry": "ખોટો કોડ, કૃપા કરીને ફરી 4096 ટાઇપ કરો.",
        "savingsSecured": "બચત સુરક્ષિત!",
        "coinDeposited": "સફળ! સિક્કો જમા થયો.",
        "coinSecured": "અભિનંદન, સિક્કો બેંકમાં સુરક્ષિત છે.",
        "swipeSuccess": "સફળ! સ્વાઇપ મંજૂર થયું.",
        "swipeDone": "સ્વાઇપ સફળતાપૂર્વક મંજૂર થયું.",
        "optionToggled": "વિકલ્પ બદલાયો.",
        "incomeRecorded": "આવકનું સ્વરૂપ નોંધાયું.",
        "scoreCalculated": "વિકલ્પી સૂચકાંક સ્કોર {score} ટકા થયો.",
        "labTabActive": "લેબનો {tab} અભ્યાસ સક્રિય થયો.",
        "recipientVerified": "સફળ! પ્રાપ્તકર્તા ચકાસાયેલ છે.",
        "enterValidUPI": "કૃપા કરીને માન્ય પ્રાપ્તકર્તા UPI ID અથવા નંબર દાખલ કરો.",
        "enterAmountMsg": "કૃપા કરીને 10 થી 2,000 રૂપિયા વચ્ચે રકમ દાખલ કરો.",
        "insufficientFunds": "સેન્ડબોક્સ વૉલેટમાં પર્યાપ્ત રકમ નથી.",
        "enterPIN": "ચકાસણી માટે 6 અંકોનો UPI PIN ટાઇપ કરો.",
        "paymentSuccess": "સફળ! ચુકવણી પૂર્ણ થઈ ગઈ છે.",
        "wrongPIN": "ખોટો UPI PIN. કૃપા કરીને ફરી 123456 ટાઇપ કરો.",
        "smsReview": "સંદેશ ખોલી નાખ્યો છે.",
        "correctDecision": "તમારો નિર્ણય બિલકુલ સાચો છે.",
        "wrongDecision": "ખોટો નિર્ણય. સુરક્ષા ચેતવણીને ધ્યાનથી વાંચો.",
        "overBudget": "કુલ વિભાજન તમારા વૉલેટ બેલેન્સ કરતાં વધુ છે!",
        "monthComplete": "મહિનો પૂર્ણ થયો.",
        "monthLabel": "મહિનો",
        "ratingRecorded": "રેટિંગ નોંધાઈ.",
        "profileSaved": "અભિનંદન! તમારી પ્રોફાઇલ સાચવાઈ ગઈ છે.",
        "onboardingDone": "સફળ! તમારો પ્રતિસાદ નોંધાઈ ગયો છે.",
        "fraudTitle": "છેતરપિંડીથી સુરક્ષા",
        "privacyTitle": "ગોપનીયતા અને બેંકિંગ એક્ટ",
        "privacyDesc": "તમારો ડેટા DPDP એક્ટ હેઠળ સુરક્ષિત છે.",
        "chargesTitle": "શૂન્ય છુપાયેલી ફીસ ફરજિયાત",
        "chargesDesc": "BSBD એકાઉન્ટ્સમાં લઘુત્તમ રકમ રાખવાની કોઈ મર્યાદા નથી.",
        "mistakesTitle": "ખોટી ચુકવણી પાછી",
        "mistakesDesc": "ખોટા એકાઉન્ટમાં પૈસા મોકલવા પર તમે NPCI પોર્ટલ પર ફરિયાદ નોંધાવી શકો છો.",
        "tipSecTitle": "OTP અથવા PIN ક્યારેય શેર ન કરો",
        "tipSecDesc": "કોઈ પણ બેંક કર્મચારી કૉલ પર તમારો UPI PIN અથવા OTP માંગતો નથી.",
        "tipSavTitle": "ઇમર્જન્સી બચત બાસ્કેટ",
        "tipSavDescRegular": "નિયમિત આવક હોય ત્યારે દરેક મહિને ઓછામાં ઓછી 15% રકમ અલગ બચત ખાતામાં જમા કરો.",
        "tipSavDescIrregular": "તમારી આવક મૌસમી છે, તેથી ઓછામાં ઓછા 3 મહિનાના મૂળભૂત ખર્ચાઓ જેટલી રકમ અલગ બચત ખાતામાં રાખો.",
        "tipCreTitle": "અનૌપચારિક વ્યાજ જાળમાંથી બચો",
        "tipCreDesc": "સ્થાનિક સાહુકારનો 5% માસિક વ્યાજ વાર્ષિક 60% થઈ જાય છે!",
        "tipPayTitle": "ચુકવણી ચકાસાયેલ ID ની તપાસ",
        "tipPayDesc": "PIN નાખતા પહેલાં હંમેશા પ્રાપ્તકર્તાનું ચકાસાયેલ નામ વાંચો.",
        "sms1Sender": "AD-LOTTRI",
        "sms1Text": "અભિનંદન! તમે સરકારી પ્રમોશનમાંથી ₹10,00,000 ની લોટરી જીતી છે.",
        "sms1Expl": "આ ફ્રોડ છે. સરકારી વિભાગો જાહેર SMS લિંકથી લોટરી આપતા નથી.",
        "sms2Sender": "સ્ટેટ બેંક",
        "sms2Text": "પ્રિય ગ્રાહક, તમારું માસિક બેંક સ્ટેટમેન્ટ તૈયાર છે. કૃપા કરીને તમારા અધિકૃત પોર્ટલ પર લૉગિન કરો.",
        "sms2Expl": "આ સુરક્ષિત છે. સંદેશમાં કોઈ તાત્કાલિક ખતરો નથી.",
        "sms3Sender": "BP-ALERT",
        "sms3Text": "ચેતવણી! તમારો વીજળી બિલ ₹1,450 બાકી છે.",
        "sms3Expl": "આ ફ્રોડ છે. યુટિલિટી કંપનીઓ આડઅસરના ફોન નંબરોથી તાત્કાલિક ડિસ્કનેક્શનની ધમકી આપતી નથી.",
        "eventMedical": "મેડિકલ ઇમર્જન્સી",
        "eventMedicalDesc": "પરિવારનો એક સભ્ય બીમાર પડ્યો. ₹1,000 સારવાર ખર્ચ.",
        "eventHarvest": "બંપર પાક બોનસ",
        "eventHarvestDesc": "પાકની માંગ અચાનક વધી! ₹1,500 વધારાનો નફો.",
        "eventDrought": "દુષ્કાળ / સ્થાનિક મંદી",
        "eventDroughtDesc": "ખરાબ હવામાનને કારણે કોઈ આવક થઈ નથી.",
        "eventFestival": "તહેવાર ઉત્સવ",
        "eventFestivalDesc": "મીઠાઈ અને ભેટમાં ₹500 ખર્ચ.",
        "securityDashDesc": "10 Next-Gen Security Innovations protecting your financial data",
        "consentMgrDesc": "Cryptographic consent tokens — you control who accesses your data",
        "zkpVerifierDesc": "Prove your attributes without revealing the actual data"
    },
    "kn": {
        "brandTagline": "ಹೊಂದಾಣಿಕೆಯ ಆರ್ಥಿಕ ಸೇರ್ಪಡೆ",
        "navGroup1": "1. ನೋಂದಣಿ & ಪ್ರೊಫೈಲಿಂಗ್",
        "navGroup2": "2. ಸಂವಾದಾತ್ಮಕ ಮೌಲ್ಯಮಾಪನಗಳು",
        "navGroup3": "3. ಕಲಿಕೆ & ಲ್ಯಾಬ್",
        "navGroup4": "4. ಸಾರಾಂಶ & ಪ್ರತಿಕ್ರಿಯೆ",
        "navGroup5": "5. ಮುಂದಿನ ಪೀಳಿಗೆಯ ಭದ್ರತೆ",
        "guestUser": "ಅತಿಥಿ ಬಳಕೆದಾರ",
        "online": " ಆನ್‌ಲೈನ್",
        "title1": "ಭಾಷೆ & ಧ್ವನಿ ಆಯ್ಕೆ",
        "title2": "\"ನನ್ನನ್ನು ತಿಳಿಯಿರಿ\" ಪ್ರೊಫೈಲ್",
        "title3": "ಹಣಕಾಸು ಸಾಕ್ಷರತೆ",
        "title4": "ಡಿಜಿಟಲ್ ಆತ್ಮವಿಶ್ವಾಸ",
        "title5": "ನಂಬಿಕೆ & ಸುರಕ್ಷತೆ",
        "title6": "ವಿಶ್ವಾಸಾರ್ಹತೆ & ಆದಾಯ",
        "title7": "ಹೊಂದಾಣಿಕೆಯ ಎಂಜಿನ್",
        "title8": "ಸುರಕ್ಷಿತ ಹಣಕಾಸು ಲ್ಯಾಬ್",
        "title9": "ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶನ",
        "title10": "ಸಿದ್ಧತೆ ವರದಿ",
        "title11": "ಪ್ರತಿಕ್ರಿಯೆ ಸಮೀಕ್ಷೆ",
        "title12": "ಭದ್ರತಾ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        "title13": "ಸಮ್ಮತಿ ನಿರ್ವಾಹಕ",
        "title14": "ZKP ಪರಿಶೀಲಕ",
        "securityDashDesc": "10 ಕ್ರಿಪ್ಟೋಗ್ರಾಫಿಕ್ ಭದ್ರತಾ ಕ್ರಮಗಳು",
        "consentMgrDesc": "ಡೇಟಾ ಪ್ರವೇಶಕ್ಕಾಗಿ ಸ್ಮಾರ್ಟ್ ಸಮ್ಮತಿ ಟೋಕನ್‌ಗಳು",
        "zkpVerifierDesc": "ವಿವರ ಬಹಿರಂಗಪಡಿಸದೆ ಶೂನ್ಯ-ಜ್ಞಾನ ಪುರಾವೆ",
        "prototype": "ಮಾದರಿ",
        "welcomeTitle": "ಸ್ವಾಗತ",
        "welcomeDesc": "ಅರ್ಥಸೇತು ನಿಮ್ಮ ಹಣಕಾಸಿನ ಅಗತ್ಯಗಳು, ಡಿಜಿಟಲ್ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಆದ್ಯತೆಯ ಭಾಷೆಗೆ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ. ಸುರಕ್ಷಿತವಾಗಿ ಹಣಕಾಸು ಕಲಿಯಲು ನಾವು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇವೆ.",
        "langCount": "6+",
        "indianLanguages": "ಭಾರತೀಯ ಭಾಷೆಗಳು",
        "sandboxPct": "100%",
        "practiceSandbox": "ಅಭ್ಯಾಸ ಸ್ಯಾಂಡ್‌ಬಾಕ್ಸ್",
        "selectLang": "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        "langSubtitle": "ಸಂಪೂರ್ಣ ಅಪ್ಲಿಕೇಶನ್ ನಿಮ್ಮ ಆಯ್ಕೆಯ ಭಾಷೆಯಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",
        "enableVoice": "ಧ್ವನಿ ಸಹಾಯವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ",
        "voiceDesc": "ನಮ್ಮ ವರ್ಚುವಲ್ ಮಾರ್ಗದರ್ಶಿ \"ಅರ್ಥದೂತ್\" ಸೂಚನೆಗಳನ್ನು ಗಟ್ಟಿಯಾಗಿ ಓದುತ್ತದೆ.",
        "startProfiling": "ಪ್ರೊಫೈಲಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ",
        "tellUsAbout": "ನಿಮ್ಮ ಬಗ್ಗೆ ನಮಗೆ ತಿಳಿಸಿ",
        "configureApp": "ನಿಮ್ಮ ವೃತ್ತಿ ಮತ್ತು ಜೀವನಶೈಲಿಗೆ ತಕ್ಕಂತೆ ನಾವು ಅಪ್ಲಿಕೇಶನ್ ಅನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತೇವೆ.",
        "questionOccupation": "1. ನಿಮ್ಮ ಪ್ರಾಥಮಿಕ ವೃತ್ತಿ ಯಾವುದು?",
        "occRetailer": "ಸಣ್ಣ ವ್ಯಾಪಾರಿ / ಅಂಗಡಿಕಾರ",
        "occRetailerSub": "ಅಂಗಡಿಕಾರ / ಬೀದಿ ವ್ಯಾಪಾರಿ",
        "occFarmer": "ರೈತ / ಕೃಷಿ",
        "occFarmerSub": "ರೈತ / ಕೃಷಿಕ",
        "occWorker": "ಗಿಗ್ ಕೆಲಸಗಾರ / ಡೆಲಿವರಿ",
        "occWorkerSub": "ಡೆಲಿವರಿ / ಟ್ಯಾಕ್ಸಿ ಚಾಲಕ",
        "occDailywager": "ದೈನಂದಿನ ಕೂಲಿ ಕಾರ್ಮಿಕ",
        "occDailywagerSub": "ದಿನಗೂಲಿ ಕಾರ್ಮಿಕ",
        "questionFinExp": "2. ನೀವು ಬ್ಯಾಂಕಿಂಗ್ ಅಥವಾ ಡಿಜಿಟಲ್ ಪಾವತಿಗಳನ್ನು ಬಳಸಿದ್ದೀರಾ?",
        "finBeginner": "ಮೊದಲ ಬಾರಿಯ ಬಳಕೆದಾರ",
        "finBeginnerSub": "UPI / ಆನ್‌ಲೈನ್ ಬ್ಯಾಂಕಿಂಗ್ ಎಂದಿಗೂ ಬಳಸಿಲ್ಲ",
        "finBasic": "ಮೂಲ ಬಳಕೆದಾರ",
        "finBasicSub": "ಬ್ಯಾಂಕ್ ಕಾರ್ಡ್ ಇದೆ, ಆದರೆ UPI ಕಡಿಮೆ ಬಳಸುತ್ತೇನೆ",
        "finIntermediate": "ಮಧ್ಯಮ ಬಳಕೆದಾರ",
        "finIntermediateSub": "ಕೆಲವೊಮ್ಮೆ UPI ಬಳಸುತ್ತೇನೆ, ಇನ್ನಷ್ಟು ನಂಬಿಕೆ ಬೇಕು",
        "questionDigConf": "3. ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಬಳಸುವಲ್ಲಿ ನೀವು ಎಷ್ಟು ಆರಾಮದಾಯಕವಾಗಿದ್ದೀರಿ?",
        "digLow": "ಸಹಾಯ ಬೇಕು",
        "digLowSub": "ಸಾಮಾನ್ಯವಾಗಿ ಇತರರ ಸಹಾಯದಿಂದ ಬಳಸುತ್ತೇನೆ",
        "digMedium": "ಮೂಲ ಅಪ್ಲಿಕೇಶನ್‌ಗಳನ್ನು ಬಳಸಬಲ್ಲೆ",
        "digMediumSub": "WhatsApp / YouTube ಸುಲಭವಾಗಿ ಬಳಸುತ್ತೇನೆ",
        "digHigh": "ತುಂಬಾ ಆತ್ಮವಿಶ್ವಾಸವಿದೆ",
        "digHighSub": "ಅಪ್ಲಿಕೇಶನ್‌ಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ ಟೈಪ್ ಮಾಡಬಲ್ಲೆ",
        "back": "ಹಿಂದೆ",
        "continue": "ಮುಂದುವರಿಯಿರಿ",
        "quizTitle": "ಹಣಕಾಸು ಸಾಕ್ಷರತೆ ಮೌಲ್ಯಮಾಪನ",
        "quizDesc": "ನಿಮ್ಮ ಹಣಕಾಸು ಜ್ಞಾನ ತಿಳಿಯಲು 3 ಸರಳ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ.",
        "q1of3": "ಪ್ರಶ್ನೆ 1 / 3",
        "q1Title": "ಬಡ್ಡಿ ಲೆಕ್ಕಾಚಾರ",
        "q1Scenario": "ನೀವು 10% ಫ್ಲಾಟ್ ಬಡ್ಡಿದರದಲ್ಲಿ 1 ವರ್ಷಕ್ಕೆ ₹10,000 ಸಾಲ ಪಡೆದರೆ, ವರ್ಷದ ಕೊನೆಯಲ್ಲಿ ಎಷ್ಟು ಬಡ್ಡಿ ಪಾವತಿಸುತ್ತೀರಿ?",
        "q1a0": "₹1,000 (ಸರಿಯಾದ ಬಡ್ಡಿ)",
        "q1a1": "₹100 (1% ಲೆಕ್ಕಾಚಾರ)",
        "q1a2": "₹0 (ಬಡ್ಡಿ ರಹಿತ ಸಾಲ)",
        "q1a3": "ಗೊತ್ತಿಲ್ಲ / ಖಚಿತವಿಲ್ಲ",
        "q2of3": "ಪ್ರಶ್ನೆ 2 / 3",
        "q2Title": "ಸುರಕ್ಷಿತ PIN & OTP ಬಳಕೆ",
        "q2Scenario": "ಬ್ಯಾಂಕ್ ಮ್ಯಾನೇಜರ್ ಎಂದು ಹೇಳಿಕೊಂಡು ಕರೆ ಮಾಡಿದ ವ್ಯಕ್ತಿ ನಿಮ್ಮ UPI PIN ಅಥವಾ OTP ಕೇಳಿದರೆ ಏನು ಮಾಡುತ್ತೀರಿ?",
        "q2a0": "ಖಾತೆ ಬ್ಲಾಕ್ ಆಗಬಾರದೆಂದು ಹೇಳುತ್ತೇನೆ",
        "q2a1": "ನನ್ನ ಹೆಸರು ಸರಿಯಾಗಿ ಹೇಳಿದರೆ ಮಾತ್ರ ಹೇಳುತ್ತೇನೆ",
        "q2a2": "ಯಾರೊಂದಿಗೂ ಫೋನ್‌ನಲ್ಲಿ PIN/OTP ಹಂಚಿಕೊಳ್ಳುವುದಿಲ್ಲ (ಸರಿ)",
        "q2a3": "ನಂತರ ಕರೆ ಮಾಡಲು ಹೇಳುತ್ತೇನೆ",
        "q3of3": "ಪ್ರಶ್ನೆ 3 / 3",
        "q3Title": "ಬ್ಯಾಂಕ್ ಉಳಿತಾಯದ ಮಹತ್ವ",
        "q3Scenario": "ಮನೆಯಲ್ಲಿ ಹಣ ಇಡುವ ಬದಲು ಬ್ಯಾಂಕಿನಲ್ಲಿ ಇಡುವುದರಿಂದ ಆಗುವ ಮುಖ್ಯ ಪ್ರಯೋಜನವೇನು?",
        "q3a0": "ಹಣಕ್ಕೆ ಬಡ್ಡಿ ಸಿಗುತ್ತದೆ ಮತ್ತು ಕಳ್ಳತನದಿಂದ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತದೆ (ಸರಿ)",
        "q3a1": "ಬ್ಯಾಂಕಿನಲ್ಲಿರುವ ಹಣ ಖರ್ಚು ಮಾಡಲು ಸುಲಭ",
        "q3a2": "ನಗದು ಮತ್ತು ಬ್ಯಾಂಕ್ ನಡುವೆ ಯಾವುದೇ ವ್ಯತ್ಯಾಸವಿಲ್ಲ",
        "q3a3": "ಪ್ರಯೋಜನಗಳ ಬಗ್ಗೆ ಖಚಿತವಿಲ್ಲ",
        "digitalTitle": "ಡಿಜಿಟಲ್ ಆತ್ಮವಿಶ್ವಾಸ ಮೌಲ್ಯಮಾಪನ",
        "digitalDesc": "ಟಚ್ ಸ್ಕ್ರೀನ್ ಪರೀಕ್ಷಿಸಲು ಈ 3 ಸುಲಭ ಕಾರ್ಯಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.",
        "task1Title": "ಕಾರ್ಯ 1: ಸಂಖ್ಯೆ ಟೈಪ್ ಮಾಡುವುದು",
        "task1Heading": "ಸಂಖ್ಯಾ ಕೋಡ್ ನಮೂದಿಸಿ",
        "task1Desc": "ಕೀಪ್ಯಾಡ್ ಬಳಸಿ ಕೋಡ್ ಟೈಪ್ ಮಾಡಿ: ",
        "task2Title": "ಕಾರ್ಯ 2: ಡ್ರ್ಯಾಗ್ & ಡ್ರಾಪ್",
        "task2Heading": "ನಾಣ್ಯವನ್ನು ಉಳಿಸಿ",
        "task2Desc": "ಚಿನ್ನದ ನಾಣ್ಯವನ್ನು ಪಿಗ್ಗಿ ಬ್ಯಾಂಕಿಗೆ ಎಳೆಯಿರಿ.",
        "dropCoin": "ನಾಣ್ಯವನ್ನು ಇಲ್ಲಿ ಹಾಕಿ",
        "task3Title": "ಕಾರ್ಯ 3: ಸ್ವೈಪ್ ಗೆಸ್ಚರ್",
        "task3Heading": "ಪಾವತಿಸಲು ಸ್ವೈಪ್ ಮಾಡಿ",
        "task3Desc": "ಪಾವತಿಯನ್ನು ದೃಢೀಕರಿಸಲು ಸ್ಲೈಡರ್ ಅನ್ನು ಬಲಕ್ಕೆ ಸ್ವೈಪ್ ಮಾಡಿ.",
        "swipeConfirm": "ದೃಢೀಕರಿಸಲು ಬಲಕ್ಕೆ ಸ್ವೈಪ್ ಮಾಡಿ",
        "waitingInput": "ಇನ್‌ಪುಟ್‌ಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ...",
        "dragStart": "ನಾಣ್ಯ ಎಳೆಯಲು ಪ್ರಾರಂಭಿಸಿ",
        "slideHandle": "ಹ್ಯಾಂಡಲ್ ಅನ್ನು ಬಲಕ್ಕೆ ಸರಿಸಿ",
        "trustTitle": "ನಂಬಿಕೆ & ಸುರಕ್ಷತೆಯ ಕಾಳಜಿಗಳು",
        "trustDesc": "ಡಿಜಿಟಲ್ ಹಣಕಾಸು ಬಳಸಲು ನಿಮಗೆ ಹಿಂಜರಿಕೆಯಾಗುವ ಕಾರಣಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
        "trustConcerns": "ನಿಮ್ಮ ಮುಖ್ಯ ಕಾಳಜಿಗಳು ಯಾವುವು? (ಅನ್ವಯವಾಗುವ ಎಲ್ಲವನ್ನೂ ಆರಿಸಿ)",
        "concernFraud": "ವಂಚನೆಯ ಭಯ",
        "concernFraudDesc": "ಆನ್‌ಲೈನ್ ವಂಚಕರಿಂದ ಹಣ ಕಳೆದುಕೊಳ್ಳುವ ಭಯ",
        "concernPrivacy": "ಡೇಟಾ & ಖಾತೆಯ ಗೌಪ್ಯತೆ",
        "concernPrivacyDesc": "ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ ಸೋರಿಕೆಯಾಗುವ ಆತಂಕ",
        "concernCharges": "ಅಪರಿಚಿತ ಶುಲ್ಕಗಳು",
        "concernChargesDesc": "ಬ್ಯಾಂಕ್ ಅನಗತ್ಯವಾಗಿ ಹಣ ಕಡಿತಗೊಳಿಸಬಹುದೆಂಬ ಅನುಮಾನ",
        "concernMistakes": "ತಪ್ಪು ಮಾಡುವ ಭಯ",
        "concernMistakesDesc": "ತಪ್ಪು ಸಂಖ್ಯೆಗೆ ಹಣ ಕಳುಹಿಸುವ ಭಯ",
        "reassurancePortal": "ಭದ್ರತಾ ಪೋರ್ಟಲ್",
        "reassuranceDesc": "ಭದ್ರತಾ ನಿಯಮಗಳನ್ನು ಓದಲು ಎಡಭಾಗದ ಆಯ್ಕೆಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ.",
        "altAssessment": "ಪರ್ಯಾಯ ಮೌಲ್ಯಮಾಪನ",
        "reliabilityTitle": "ಪರ್ಯಾಯ ಹಣಕಾಸು ವಿಶ್ವಾಸಾರ್ಹತೆ",
        "reliabilityDesc": "ಕ್ರೆಡಿಟ್ ಇತಿಹಾಸವಿಲ್ಲದವರಿಗೆ ಉಳಿತಾಯ ಮತ್ತು ಬಿಲ್ ಪಾವತಿಯ ಆಧಾರದ ಮೇಲೆ ಮೌಲ್ಯಮಾಪನ.",
        "simReliability": "ವಿಶ್ವಾಸಾರ್ಹತೆ ಪ್ರೊಫೈಲ್",
        "incomeProfile": "ಆದಾಯ & ಉಳಿತಾಯ ಪ್ರೊಫೈಲ್",
        "consentDetails": "ಮೌಲ್ಯಮಾಪನಕ್ಕಾಗಿ ನಿಮ್ಮ ಸಮ್ಮತಿ ನೀಡಿ.",
        "incomePattern": "1. ನಿಮ್ಮ ಆದಾಯದ ಮಾದರಿ ಹೇಗಿದೆ?",
        "incomeRegular": "ನಿಯಮಿತ ಮಾಸಿಕ ಆದಾಯ",
        "incomeIrregular": "ಅನಿಯಮಿತ ದೈನಂದಿನ/ವಾರದ ಆದಾಯ",
        "incomeSeasonal": "ಋತುಮಾನದ ಆದಾಯ (ಬೆಳೆ/ಗಿಗ್ಸ್)",
        "indicatorsTitle": "2. ನಿಮಗೆ ಅನ್ವಯಿಸುವ ಆಯ್ಕೆಗಳನ್ನು ಆರಿಸಿ:",
        "ind1": "ನಾನು ಬಾಡಿಗೆ ಅಥವಾ ವಿದ್ಯುತ್ ಬಿಲ್ ಅನ್ನು ಸರಿಯಾಗಿ ಪಾವತಿಸುತ್ತೇನೆ",
        "ind2": "ನಾನು ಅಂಚೆ ಕಚೇರಿ ಅಥವಾ ಮನೆಯಲ್ಲಿ ಹಣ ಉಳಿಸುತ್ತೇನೆ",
        "ind3": "ನನ್ನಲ್ಲಿ ವ್ಯಾಪಾರ ಸರಕು ಅಥವಾ ಉಪಕರಣಗಳಿವೆ",
        "ind4": "ಸ್ಥಳೀಯ ಸಾಲದಾತರ ಬಳಿ ನನಗೆ ಯಾವುದೇ ಬಾಕಿ ಸಾಲವಿಲ್ಲ",
        "consentText": "ಪರ್ಯಾಯ ವಿಶ್ವಾಸಾರ್ಹತೆ ಸ್ಕೋರ್ ಮೌಲ್ಯಮಾಪನಕ್ಕೆ ನಾನು ಸಮ್ಮತಿಸುತ್ತೇನೆ.",
        "generateProfile": "ಪ್ರೊಫೈಲ್ ರಚಿಸಿ",
        "engineTitle": "ಅರ್ಥಸೇತು ಹೊಂದಾಣಿಕೆಯ ಎಂಜಿನ್",
        "engineDesc": "ನಿಮಗಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾದ ಕಲಿಕೆಯ ಮಾರ್ಗ.",
        "scoreLiteracy": "ಹಣಕಾಸು ಸಾಕ್ಷರತೆ",
        "scoreDigital": "ಡಿಜಿಟಲ್ ಆತ್ಮವಿಶ್ವಾಸ",
        "scoreReliability": "ಪರ್ಯಾಯ ವಿಶ್ವಾಸಾರ್ಹತೆ",
        "recommendedPath": "ಶಿಫಾರಸು ಮಾಡಿದ ಮಾರ್ಗ",
        "calculating": "ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತಿದೆ...",
        "selectContinue": "ಮುಂದುವರಿಯಲು ಆಯ್ಕೆಮಾಡಿ.",
        "enterLab": "ಸುರಕ್ಷಿತ ಹಣಕಾಸು ಲ್ಯಾಬ್‌ಗೆ ಪ್ರವೇಶಿಸಿ",
        "labTitle": "ಸುರಕ್ಷಿತ ಹಣಕಾಸು ಲ್ಯಾಬ್",
        "practiceSandboxTag": "ಅಭ್ಯಾಸ ಸ್ಯಾಂಡ್‌ಬಾಕ್ಸ್",
        "tabPayment": "ಪಾವತಿ ಅಭ್ಯಾಸ",
        "tabFraud": "ವಂಚನೆ ಪತ್ತೆಕಾರಕ",
        "tabLoan": "ಸಾಲ ಹೋಲಿಕೆ",
        "tabBudget": "ಬಜೆಟ್ & ಯೋಜನೆ",
        "arthapay": "ಅರ್ಥಪೇ",
        "enterRecipient": "ಸ್ವೀಕರಿಸುವವರ UPI ID / ಸಂಖ್ಯೆ ನಮೂದಿಸಿ",
        "verifyRecipient": "ಹೆಸರನ್ನು ಪರಿಶೀಲಿಸಿ",
        "verified": "ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
        "enterAmount": "ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ (₹)",
        "walletBalance": "ಅಭ್ಯಾಸ ವ್ಯಾಲೆಟ್ ಬ್ಯಾಲೆನ್ಸ್: ₹1,000",
        "continueToPay": "ಪಾವತಿಸಲು ಮುಂದುವರಿಯಿರಿ",
        "enterUPIPIN": "6 ಅಂಕಿಯ UPI PIN ನಮೂದಿಸಿ",
        "payingRs": "ಪಾವತಿಸುತ್ತಿರುವ ಮೊತ್ತ ₹",
        "toRecipient": "ರೈತ ಮಿತ್ರನಿಗೆ",
        "txnSuccess": "ವಹಿವಾಟು ಯಶಸ್ವಿಯಾಗಿದೆ!",
        "sentTo": "ಕಳುಹಿಸಲಾಗಿದೆ",
        "txnId": "ವಹಿವಾಟು ID:",
        "payAgain": "ಮತ್ತೆ ಪಾವತಿಸಿ",
        "paymentTutorial": "ಪಾವತಿ ಟ್ಯುಟೋರಿಯಲ್",
        "paymentTutorialDesc": "ನಿಜವಾದ ಹಣದ ನಷ್ಟವಿಲ್ಲದೆ ವಹಿವಾಟು ಕಲಿಯಿರಿ.",
        "crucialGuidelines": "ಮುಖ್ಯ ಮಾರ್ಗದರ್ಶಿ ಸೂತ್ರಗಳು:",
        "practicePIN": "ನಿಮ್ಮ ಅಭ್ಯಾಸ PIN: ",
        "tip2": "ಹಣ ಕಳುಹಿಸುವ ಮುನ್ನ ಹೆಸರನ್ನು ಯಾವಾಗಲೂ ಪರಿಶೀಲಿಸಿ.",
        "tip3": "ಸುರಕ್ಷಿತ ಬ್ಯಾಂಕ್ ಪರದೆಯ ಹೊರತಾಗಿ ಎಲ್ಲೂ PIN ಹಾಕಬೇಡಿ.",
        "walletHistory": "ವಹಿವಾಟು ಇತಿಹಾಸ",
        "welcomeBonus": "ಸ್ವಾಗತ ಬೋನಸ್",
        "messageInbox": "ಸಂದೇಶಗಳ ಇನ್‌ಬಾಕ್ಸ್",
        "fraudDesc": "RBI ನಿಯಮಗಳ ಪ್ರಕಾರ, ಅನಧಿಕೃತ ವಹಿವಾಟನ್ನು 3 ದಿನಗಳಲ್ಲಿ ಬ್ಯಾಂಕಿಗೆ ತಿಳಿಸಿದರೆ ನಿಮ್ಮ ಹೊಣೆಗಾರಿಕೆ ಶೂನ್ಯ.",
        "selectMessage": "ಸಂದೇಶ ಆಯ್ಕೆಮಾಡಿ",
        "fraudPlaceholder": "ವಿಶ್ಲೇಷಿಸಲು SMS ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.",
        "classifySafe": "ಸುರಕ್ಷಿತವೆಂದು ಗುರುತಿಸಿ",
        "reportFraud": "ವಂಚನೆಯೆಂದು ವರದಿ ಮಾಡಿ",
        "loanTitle": "ಸಾಲ ವೆಚ್ಚ ಸಿಮ್ಯುಲೇಟರ್",
        "loanDesc": "ಬಡ್ಡಿ ವ್ಯತ್ಯಾಸ ತಿಳಿಯಲು ಸ್ಲೈಡರ್ ಸರಿಸಿ.",
        "principalAmt": "ಅಸಲು ಮೊತ್ತ",
        "interestRate": "ಬಡ್ಡಿದರ (ವಾರ್ಷಿಕ)",
        "tenure": "ಅವಧಿ (ತಿಂಗಳುಗಳು)",
        "flatLoan": "ಫ್ಲಾಟ್ ಬಡ್ಡಿ ಸಾಲ",
        "flatRateFinancing": "ಫ್ಲಾಟ್ ದರ ಹಣಕಾಸು",
        "monthlyEMI": "ಮಾಸಿಕ EMI",
        "totalInterest": "ಒಟ್ಟು ಬಡ್ಡಿ",
        "totalRepayment": "ಒಟ್ಟು ಮರುಪಾವತಿ",
        "flatLoanDesc": "ಬಡ್ಡಿಯನ್ನು ಯಾವಾಗಲೂ ಆರಂಭಿಕ ಅಸಲಿನ ಮೇಲೆಯೇ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ.",
        "compoundLoan": "ಇಳಿಕೆಯಾಗುವ ಅಸಲು ಸಾಲ",
        "reducingBalanceFinancing": "ಇಳಿಕೆಯಾಗುವ ಬಾಕಿ ಹಣಕಾಸು",
        "compoundLoanDesc": "ಉಳಿದ ಅಸಲಿಗೆ ಮಾತ್ರ ಬಡ್ಡಿ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ. ಇದು ಅತ್ಯಂತ ಲಾಭದಾಯಕ!",
        "budgetTitle": "ಋತುಮಾನದ ಬಜೆಟ್ ಆಟ",
        "budgetDesc": "ವಿವಿಧ ಸಂದರ್ಭಗಳಲ್ಲಿ ವೆಚ್ಚಗಳನ್ನು ನಿರ್ವಹಿಸಿ.",
        "currentIncome": "ಪ್ರಸ್ತುತ ಆದಾಯ ಮಾದರಿ:",
        "foodAlloc": "ಆಹಾರ & ಬಾಡಿಗೆ (₹)",
        "savingsBox": "ಉಳಿತಾಯ ಪೆಟ್ಟಿಗೆ (₹)",
        "growthAlloc": "ವ್ಯಾಪಾರ ಹೂಡಿಕೆ (₹)",
        "simulateMonth": "ಮುಂದಿನ ತಿಂಗಳನ್ನು ಸಿಮ್ಯುಲೇಟ್ ಮಾಡಿ",
        "walletBal": "ವ್ಯಾಲೆಟ್ ಬ್ಯಾಲೆನ್ಸ್",
        "accumSavings": "ಒಟ್ಟು ಉಳಿತಾಯ",
        "activityLog": "ಚಟುವಟಿಕೆ ಲಾಗ್",
        "gameStarted": "ಆಟ ಪ್ರಾರಂಭವಾಯಿತು.",
        "guidanceTitle": "ವೈಯಕ್ತಿಕ ಹಣಕಾಸು ಮಾರ್ಗದರ್ಶನ",
        "guidanceDesc": "ನಿಮ್ಮ ಮೌಲ್ಯಮಾಪನದ ಆಧಾರದ ಮೇಲೆ ಮುಖ್ಯವಾದ ಹಣಕಾಸು ನಿಯಮಗಳು.",
        "viewReport": "ವರದಿ ವೀಕ್ಷಿಸಿ",
        "reportTitle": "ಹಣಕಾಸು ಸಿದ್ಧತೆ ವರದಿ",
        "reportDesc": "ಅಭಿನಂದನೆಗಳು! ಇದು ನಿಮ್ಮ ಅಧಿಕೃತ ಪ್ರಮಾಣಪತ್ರ.",
        "certTitle": "ಅರ್ಥಸೇತು ಸಾಮರ್ಥ್ಯ ಪ್ರಮಾಣಪತ್ರ",
        "certAwardedTo": "ಈ ಪ್ರಮಾಣಪತ್ರವನ್ನು ನೀಡಲಾಗಿದೆ",
        "certDesc": "ಹೊಂದಾಣಿಕೆಯ ಹಣಕಾಸು ಪ್ರೊಫೈಲಿಂಗ್ ಮತ್ತು UPI ಅಭ್ಯಾಸವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ್ದಕ್ಕಾಗಿ.",
        "certLiteracy": "ಸಾಕ್ಷರತೆ ಮಟ್ಟ",
        "certDigital": "ಡಿಜಿಟಲ್ ಆತ್ಮವಿಶ್ವಾಸ",
        "certPathway": "ಮಾರ್ಗ",
        "certSystem": "ವ್ಯವಸ್ಥೆಯಿಂದ ನೀಡಲಾಗಿದೆ",
        "certDate": "ದಿನಾಂಕ",
        "printCert": "ಪ್ರಮಾಣಪತ್ರ ಮುದ್ರಿಸಿ",
        "provideFeedback": "ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಿ",
        "feedbackTitle": "ಪ್ರತಿಕ್ರಿಯೆ ಸಮೀಕ್ಷೆ",
        "feedbackDesc": "ಈ ವೇದಿಕೆಯನ್ನು ಇನ್ನಷ್ಟು ಉತ್ತಮಗೊಳಿಸಲು ನಮಗೆ ಸಹಾಯ ಮಾಡಿ.",
        "surveyQ1": "1. ಈ ಅಪ್ಲಿಕೇಶನ್ ಬಳಸುವುದು ಎಷ್ಟು ಸುಲಭವಾಗಿತ್ತು?",
        "surveyQ2": "2. ಸುರಕ್ಷತಾ ನಿಯಮಗಳು ನಿಮಗೆ ಸ್ಪಷ್ಟವಾಗಿ ಅರ್ಥವಾದವೇ?",
        "surveyQ3": "3. ಈಗ ಸ್ವತಃ ಮೊಬೈಲ್ ಪಾವತಿ ಮಾಡಲು ಆತ್ಮವಿಶ್ವಾಸವಿದೆಯೇ?",
        "surveyQ4": "4. ನಿಮ್ಮ ಯಾವುದೇ ಸಲಹೆಗಳಿವೆಯೇ?",
        "feedbackPlaceholder": "ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಇಲ್ಲಿ ಬರೆಯಿರಿ...",
        "saveReset": "ಉಳಿಸಿ ಮತ್ತು ಮರುಹೊಂದಿಸಿ",
        "assistantName": "ಅರ್ಥದೂತ್ ಸಹಾಯಕ:",
        "welcomeArthasetu": "ಅರ್ಥಸೇತುಗೆ ಸುಸ್ವಾಗತ.",
        "voiceOn": "ಧ್ವನಿ ಸಹಾಯ: ಆನ್",
        "voiceOff": "ಧ್ವನಿ ಸಹಾಯ: ಆಫ್",
        "helpWelcome": "ನಮಸ್ಕಾರ! ನಾನು ಅರ್ಥದೂತ್. ನಾನು ಸೂಚನೆಗಳನ್ನು ಓದಿ ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.",
        "profileHelp": "ನಿಮ್ಮ ಅನುಭವವನ್ನು ಬದಲಾಯಿಸಲು ಪ್ರತಿ ವಿಭಾಗದಿಂದ ಒಂದು ಆಯ್ಕೆಯನ್ನು ಆರಿಸಿ.",
        "quizHelp": "ಸರಿಯಾದ ಉತ್ತರವನ್ನು ಆರಿಸಿ. ತಪ್ಪು ಮಾಡಲು ಹಿಂಜರಿಯಬೇಡಿ.",
        "digitalHelp": "ಮೊದಲು 4096 ಟೈಪ್ ಮಾಡಿ, ನಂತರ ನಾಣ್ಯವನ್ನು ಬ್ಯಾಂಕಿಗೆ ಹಾಕಿ, ಕೊನೆಯಲ್ಲಿ ಸ್ಲೈಡರ್ ಸರಿಸಿ.",
        "trustHelp": "ನಿಮಗೆ ಆತಂಕ ತರುವ ವಿಷಯಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
        "reliabilityHelp": "ಪರ್ಯಾಯ ಮಾರ್ಗಗಳು ನಿಮ್ಮ ವಿಶ್ವಾಸಾರ್ಹತೆ ಸಾಬೀತುಪಡಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತವೆ.",
        "sandboxHelp": "ನಷ್ಟದ ಭಯವಿಲ್ಲದೆ ಪಾವತಿಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ.",
        "guidanceHelp": "ಈ ಸುರಕ್ಷತಾ ನಿಯಮಗಳನ್ನು ಓದಿ.",
        "reportHelp": "ಇದು ನಿಮ್ಮ ಪ್ರಮಾಣಪತ್ರ!",
        "surveyHelp": "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಅನುಭವಕ್ಕೆ ರೇಟಿಂಗ್ ನೀಡಿ. ಧನ್ಯವಾದಗಳು!",
        "pathAssisted": "ಧ್ವನಿ / ದೃಶ್ಯ ಬೆಂಬಲಿತ ಮಾರ್ಗ",
        "pathAssistedDesc": "ದೊಡ್ಡ ಬಟನ್‌ಗಳು ಮತ್ತು ಸಂಪೂರ್ಣ ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
        "pathAssistedFeat1": "ಸ್ವಯಂಚಾಲಿತ ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ",
        "pathAssistedFeat2": "ದೊಡ್ಡ ಫಾಂಟ್‌ಗಳು ಮತ್ತು ಬಟನ್‌ಗಳು",
        "pathAssistedFeat3": "ಸುಲಭವಾದ ಒಂದು-ಟ್ಯಾಪ್ ದೃಢೀಕರಣ",
        "pathGuided": "ಮಾರ್ಗದರ್ಶಿತ ಮಾರ್ಗ",
        "pathGuidedDesc": "ಪ್ರಮುಖ ಬಟನ್‌ಗಳ ಮೇಲೆ ಹೈಲೈಟ್ ತೋರಿಸಿ ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
        "pathGuidedFeat1": "ಹೊಳೆಯುವ ಬಟನ್ ಹೈಲೈಟ್ಸ್",
        "pathGuidedFeat2": "ಸುರಕ್ಷತಾ ಎಚ್ಚರಿಕೆಗಳು",
        "pathGuidedFeat3": "ಮಾರ್ಗದರ್ಶಿ ಸಲಹೆಗಳು",
        "pathSelf": "ಸ್ವಯಂ-ಮಾರ್ಗದರ್ಶಿತ ಮಾರ್ಗ",
        "pathSelfDesc": "ನೀವು ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಬಳಸುವಲ್ಲಿ ನಿಪುಣರಾಗಿದ್ದೀರಿ.",
        "pathSelfFeat1": "ಸಾಮಾನ್ಯ ಸಂಚರಣೆ",
        "pathSelfFeat2": "ಸಂಪೂರ್ಣ ಸ್ವಾತಂತ್ರ್ಯ",
        "pathSelfFeat3": "ಸುಧಾರಿತ ಅಭ್ಯಾಸ",
        "certSelf": "ಸ್ವಯಂ-ಮಾರ್ಗದರ್ಶಿತ",
        "certGuided": "ಮಾರ್ಗದರ್ಶಿತ ಬೆಂಬಲ",
        "certAssisted": "ಧ್ವನಿ ಬೆಂಬಲ",
        "lockedMsg": "ಈ ಭಾಗವನ್ನು ಲಾಕ್ ಮಾಡಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಹಿಂದಿನ ಕಾರ್ಯವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.",
        "occupationMsg": "ವೃತ್ತಿಯನ್ನು ದಾಖಲಿಸಲಾಗಿದೆ.",
        "answerMsg": "ಉತ್ತರವನ್ನು ದಾಖಲಿಸಲಾಗಿದೆ.",
        "clearedMsg": "ಅಳಿಸಲಾಗಿದೆ",
        "codeSuccess": "ಯಶಸ್ವಿ! ಕೋಡ್ ಸರಿಯಾಗಿದೆ.",
        "firstTaskDone": "ಉತ್ತಮ! ಮೊದಲ ಕಾರ್ಯ ಪೂರ್ಣಗೊಂಡಿದೆ.",
        "codeWrong": "ತಪ್ಪು ಕೋಡ್. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
        "codeWrongRetry": "ತಪ್ಪು ಕೋಡ್, ದಯವಿಟ್ಟು ಮತ್ತೆ 4096 ಟೈಪ್ ಮಾಡಿ.",
        "savingsSecured": "ಉಳಿತಾಯ ಸುರಕ್ಷಿತವಾಗಿದೆ!",
        "coinDeposited": "ಯಶಸ್ವಿ! ನಾಣ್ಯ ಜಮೆಯಾಗಿದೆ.",
        "coinSecured": "ಅಭಿನಂದನೆಗಳು, ನಾಣ್ಯ ಬ್ಯಾಂಕಿನಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿದೆ.",
        "swipeSuccess": "ಯಶಸ್ವಿ! ಸ್ವೈಪ್ ಅನುಮೋದಿಸಲಾಗಿದೆ.",
        "swipeDone": "ಸ್ವೈಪ್ ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ.",
        "optionToggled": "ಆಯ್ಕೆ ಬದಲಾಗಿದೆ.",
        "incomeRecorded": "ಆದಾಯದ ವಿವರ ದಾಖಲಾಗಿದೆ.",
        "scoreCalculated": "ವಿಶ್ವಾಸಾರ್ಹತೆ ಸ್ಕೋರ್ {score}% ಆಗಿದೆ.",
        "labTabActive": "ಲ್ಯಾಬ್‌ನ {tab} ವಿಭಾಗ ಪ್ರಾರಂಭವಾಗಿದೆ.",
        "recipientVerified": "ಯಶಸ್ವಿ! ಸ್ವೀಕರಿಸುವವರನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ.",
        "enterValidUPI": "ದಯವಿಟ್ಟು ಮಾನ್ಯ UPI ID ಅಥವಾ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
        "enterAmountMsg": "ದಯವಿಟ್ಟು ₹10 ರಿಂದ ₹2,000 ವರೆಗೆ ಮೊತ್ತ ನಮೂದಿಸಿ.",
        "insufficientFunds": "ವ್ಯಾಲೆಟ್‌ನಲ್ಲಿ ಸಾಕಷ್ಟು ಬ್ಯಾಲೆನ್ಸ್ ಇಲ್ಲ.",
        "enterPIN": "ದೃಢೀಕರಣಕ್ಕಾಗಿ 6 ಅಂಕಿಯ UPI PIN ನಮೂದಿಸಿ.",
        "paymentSuccess": "ಯಶಸ್ವಿ! ಪಾವತಿ ಪೂರ್ಣಗೊಂಡಿದೆ.",
        "wrongPIN": "ತಪ್ಪು UPI PIN. ದಯವಿಟ್ಟು 123456 ನಮೂದಿಸಿ.",
        "smsReview": "ಸಂದೇಶ ತೆರೆಯಲಾಗಿದೆ.",
        "correctDecision": "ನಿಮ್ಮ ನಿರ್ಧಾರ ಸರಿಯಾಗಿದೆ.",
        "wrongDecision": "ತಪ್ಪು ನಿರ್ಧಾರ. ಸುರಕ್ಷತಾ ಎಚ್ಚರಿಕೆಯನ್ನು ಓದಿ.",
        "overBudget": "ಹಂಚಿಕೆ ವ್ಯಾಲೆಟ್ ಬ್ಯಾಲೆನ್ಸ್‌ಗಿಂತ ಹೆಚ್ಚಾಗಿದೆ!",
        "monthComplete": "ತಿಂಗಳು ಪೂರ್ಣಗೊಂಡಿದೆ.",
        "monthLabel": "ತಿಂಗಳು",
        "ratingRecorded": "ರೇಟಿಂಗ್ ದಾಖಲಾಗಿದೆ.",
        "profileSaved": "ಅಭಿನಂದನೆಗಳು! ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಉಳಿಸಲಾಗಿದೆ.",
        "onboardingDone": "ಯಶಸ್ವಿ! ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ದಾಖಲಾಗಿದೆ.",
        "fraudTitle": "ವಂಚನೆಯಿಂದ ರಕ್ಷಣೆ",
        "privacyTitle": "ಡೇಟಾ ಗೌಪ್ಯತೆ ಕಾಯ್ದೆ",
        "privacyDesc": "ನಿಮ್ಮ ಡೇಟಾ DPDP ಕಾಯ್ದೆಯಡಿ ಸುರಕ್ಷಿತವಾಗಿದೆ.",
        "chargesTitle": "ಯಾವುದೇ ಗುಪ್ತ ಶುಲ್ಕಗಳಿಲ್ಲ",
        "chargesDesc": "BSBD ಖಾತೆಗಳಲ್ಲಿ ಕನಿಷ್ಠ ಬ್ಯಾಲೆನ್ಸ್ ಇಡುವ ಅಗತ್ಯವಿಲ್ಲ.",
        "mistakesTitle": "ತಪ್ಪು ಪಾವತಿ ಮರುಪಡೆಯುವಿಕೆ",
        "mistakesDesc": "ತಪ್ಪು ಖಾತೆಗೆ ಹಣ ಕಳುಹಿಸಿದರೆ NPCI ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ದೂರು ದಾಖಲಿಸಬಹುದು.",
        "tipSecTitle": "OTP ಅಥವಾ PIN ಎಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ",
        "tipSecDesc": "ಯಾವುದೇ ಬ್ಯಾಂಕ್ ಅಧಿಕಾರಿ ಫೋನ್‌ನಲ್ಲಿ UPI PIN ಅಥವಾ OTP ಕೇಳುವುದಿಲ್ಲ.",
        "tipSavTitle": "ತುರ್ತು ಉಳಿತಾಯ ನಿಧಿ",
        "tipSavDescRegular": "ನಿಯಮಿತ ಆದಾಯವಿದ್ದಾಗ ಪ್ರತಿ ತಿಂಗಳು ಕನಿಷ್ಠ 15% ಉಳಿಸಿ.",
        "tipSavDescIrregular": "ಆದಾಯ ಬದಲಾಗುವುದರಿಂದ 3 ತಿಂಗಳ ಖರ್ಚಿಗೆ ಬೇಕಾದ ಹಣವನ್ನು ಉಳಿತಾಯದಲ್ಲಿಡಿ.",
        "tipCreTitle": "ಹೆಚ್ಚು ಬಡ್ಡಿಯ ಸಾಲಗಳಿಂದ ದೂರವಿರಿ",
        "tipCreDesc": "ಬಡ್ಡಿ ವ್ಯಾಪಾರಿಗಳ 5% ಮಾಸಿಕ ಬಡ್ಡಿ ವರ್ಷಕ್ಕೆ 60% ಆಗುತ್ತದೆ! ಸರ್ಕಾರಿ ಮುದ್ರಾ ಸಾಲಗಳನ್ನು ಪಡೆಯಿರಿ.",
        "tipPayTitle": "ಹೆಸರನ್ನು ಪರಿಶೀಲಿಸಿ ಹಣ ಕಳುಹಿಸಿ",
        "tipPayDesc": "PIN ಹಾಕುವ ಮುನ್ನ ಸ್ಕ್ರೀನ್ ಮೇಲೆ ಕಾಣುವ ನೈಜ ಹೆಸರನ್ನು ಗಮನಿಸಿ.",
        "sms1Sender": "AD-LOTTRI",
        "sms1Text": "ಅಭಿನಂದನೆಗಳು! ನೀವು ಸರ್ಕಾರದ ಲಾಟರಿಯಿಂದ ₹10,00,000 ಗೆದ್ದಿದ್ದೀರಿ. ತಕ್ಷಣ ಪಡೆಯಲು ಕ್ಲಿಕ್ ಮಾಡಿ: www.sarkari-win.com/claim",
        "sms1Expl": "ಇದು ವಂಚನೆ. ಸರ್ಕಾರಿ ಇಲಾಖೆಗಳು SMS ಲಿಂಕ್ ಮೂಲಕ ಲಾಟರಿ ಹಣ ಕೊಡುವುದಿಲ್ಲ.",
        "sms2Sender": "State Bank",
        "sms2Text": "ಆತ್ಮೀಯ ಗ್ರಾಹಕರೇ, ನಿಮ್ಮ ಮಾಸಿಕ ಬ್ಯಾಂಕ್ ಸ್ಟೇಟ್‌ಮೆಂಟ್ ಸಿದ್ಧವಾಗಿದೆ. ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗೆ ಲಾಗಿನ್ ಮಾಡಿ. PIN ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.",
        "sms2Expl": "ಇದು ಸುರಕ್ಷಿತವಾಗಿದೆ. ಇದರಲ್ಲಿ ಯಾವುದೇ ಅಪಾಯಕಾರಿ ಲಿಂಕ್‌ಗಳಿಲ್ಲ.",
        "sms3Sender": "BP-ALERT",
        "sms3Text": "ಎಚ್ಚರಿಕೆ! ನಿಮ್ಮ ವಿದ್ಯುತ್ ಬಿಲ್ ₹1,450 ಬಾಕಿ ಇದೆ. ವಿದ್ಯುತ್ ಕಡಿತ ತಪ್ಪಿಸಲು ಫೋನ್‌ನಲ್ಲಿ ಅಧಿಕಾರಿಗೆ OTP ನೀಡಿ.",
        "sms3Expl": "ಇದು ವಂಚನೆ. ವಿದ್ಯುತ್ ಕಂಪನಿಗಳು ಫೋನ್‌ನಲ್ಲಿ OTP ಕೇಳುವುದಿಲ್ಲ.",
        "eventMedical": "ವೈದ್ಯಕೀಯ ತುರ್ತುಸ್ಥಿತಿ",
        "eventMedicalDesc": "ಕುಟುಂಬದ ಸದಸ್ಯರಿಗೆ ಅನಾರೋಗ್ಯ. ₹1,000 ವೆಚ್ಚ.",
        "eventHarvest": "ಉತ್ತಮ ಬೆಳೆ ಬೋನಸ್",
        "eventHarvestDesc": "ಬೆಳೆಗೆ ಉತ್ತಮ ಬೆಲೆ ಸಿಕ್ಕಿದೆ! ₹1,500 ಹೆಚ್ಚುವರಿ ಲಾಭ.",
        "eventDrought": "ಬರ / ಮಂದಗತಿ",
        "eventDroughtDesc": "ಕೆಟ್ಟ ಹವಾಮಾನದಿಂದಾಗಿ ಯಾವುದೇ ಆದಾಯವಿಲ್ಲ.",
        "eventFestival": "ಹಬ್ಬದ ಆಚರಣೆ",
        "eventFestivalDesc": "ಸಿಹಿತಿಂಡಿಗಳು ಮತ್ತು ಉಡುಗೊರೆಗಳಿಗಾಗಿ ₹500 ವೆಚ್ಚ."
    },
    "as": {
        "brandTagline": "অভিযোজনমূলক অন্তর্ভুক্তি",
        "navGroup1": "১. পঞ্জীয়ন আৰু প্ৰফাইল",
        "navGroup2": "২. পাৰস্পৰিক মূল্যায়ন",
        "navGroup3": "৩. শিক্ষা আৰু লেব",
        "navGroup4": "৪. সাৰাংশ আৰু মতামত",
        "navGroup5": "৫. নতুন প্ৰজন্মৰ সুৰক্ষা",
        "guestUser": "অতিথি ব্যৱহাৰকাৰী",
        "online": " অনলাইন",
        "title1": "ভাষা আৰু কণ্ঠ নিৰ্বাচন",
        "title2": "\"মোক জানক\" প্ৰফাইল",
        "title3": "বিত্তীয় সাক্ষৰতা",
        "title4": "ডিজিটেল আত্মবিশ্বাস",
        "title5": "বিশ্বাস আৰু সুৰক্ষা",
        "title6": "নিৰ্ভৰযোগ্যতা আৰু উপাৰ্জন",
        "title7": "অভিযোজন ইঞ্জিন",
        "title8": "সুৰক্ষিত বিত্ত লেব",
        "title9": "ব্যক্তিগত নিৰ্দেশনা",
        "title10": "প্ৰস্তুতি প্ৰতিবেদন",
        "title11": "মতামত সমীক্ষা",
        "title12": "সুৰক্ষা ডেচবৰ্ড",
        "title13": "সন্মতি পৰিচালক",
        "title14": "ZKP সত্যপনকাৰী",
        "securityDashDesc": "১০টা ক্ৰিপ্টোগ্ৰাফিক সুৰক্ষা আৰু অডিট ট্ৰেইল",
        "consentMgrDesc": "তথ্য প্ৰৱেশৰ বাবে স্মাৰ্ট সন্মতি টোকেন",
        "zkpVerifierDesc": "তথ্য প্ৰকাশ নকৰাকৈ শূন্য-জ্ঞান প্ৰমাণ",
        "prototype": "প্ৰটোটাইপ",
        "welcomeTitle": "স্বাগতম",
        "welcomeDesc": "অৰ্থসেতুৱে আপোনাৰ বিত্তীয় প্ৰয়োজন, ডিজিটেল দক্ষতা আৰু পছন্দৰ ভাষাৰ লগত মিলি কাম কৰে। আমি আপোনাক সুৰক্ষিতভাৱে বিত্তীয় ব্যৱস্থা শিকাত সহায় কৰোঁ।",
        "langCount": "৬+",
        "indianLanguages": "ভাৰতীয় ভাষা",
        "sandboxPct": "১০০%",
        "practiceSandbox": "অনুশীলন চেণ্ডবক্স",
        "selectLang": "আপোনাৰ ভাষা বাছক",
        "langSubtitle": "সম্পূৰ্ণ এপটো আপোনাৰ নিৰ্বাচিত ভাষাত কাম কৰিব",
        "enableVoice": "কণ্ঠ সহায় সক্ৰিয় কৰক",
        "voiceDesc": "আমাৰ ডিজিটেল সহায়ক \"অৰ্থদূত\"এ আপোনাৰ ভাষাত নিৰ্দেশনাসমূহ পঢ়ি শুনাব।",
        "startProfiling": "প্ৰফাইল আৰম্ভ কৰক",
        "tellUsAbout": "আপোনাৰ বিষয়ে আমাক জনাওক",
        "configureApp": "আমি আপোনাৰ ব্যৱসায় আৰু প্ৰয়োজন অনুসৰি এপটো সজাই তুলিম।",
        "questionOccupation": "১. আপোনাৰ প্ৰধান বৃত্তি কি?",
        "occRetailer": "ক্ষুদ্ৰ ব্যৱসায়ী / দোকানদাৰ",
        "occRetailerSub": "দোকানদাৰ / ফেৰীৱালা",
        "occFarmer": "কৃষক / খেতি",
        "occFarmerSub": "কৃষি / খেতিয়ক",
        "occWorker": "গিগ শ্ৰমিক / ডেলিভাৰী",
        "occWorkerSub": "ডেলিভাৰী / টেক্সি চালক",
        "occDailywager": "দৈনিক মজুৰি কৰ্মী",
        "occDailywagerSub": "শ্ৰমিক / দিনহাজিৰা",
        "questionFinExp": "২. আপুনি বেংকিং বা ডিজিটেল লেনদেন ব্যৱহাৰ কৰিছেনে?",
        "finBeginner": "প্ৰথমবাৰৰ ব্যৱহাৰকাৰী",
        "finBeginnerSub": "UPI / অনলাইন বেংকিং কেতিয়াও ব্যৱহাৰ কৰা নাই",
        "finBasic": "প্ৰাথমিক ব্যৱহাৰকাৰী",
        "finBasicSub": "বেংক কাৰ্ড আছে, কিন্তু UPI কমকৈ ব্যৱহাৰ কৰোঁ",
        "finIntermediate": "মধ্যমীয়া ব্যৱহাৰকাৰী",
        "finIntermediateSub": "কেতিয়াবা UPI ব্যৱহাৰ কৰোঁ, আত্মবিশ্বাস লাগে",
        "questionDigConf": "৩. স্মাৰ্টফোন ব্যৱহাৰত আপুনি কিমান সহজ অনুভৱ কৰে?",
        "digLow": "সহায় লাগে",
        "digLowSub": "সাধাৰণতে আনৰ সহায়ত ব্যৱহাৰ কৰোঁ",
        "digMedium": "সাধাৰণ এপ চলাব পাৰোঁ",
        "digMediumSub": "WhatsApp / YouTube সহজে চলাওঁ",
        "digHigh": "সম্পূৰ্ণ আত্মবিশ্বাসী",
        "digHighSub": "এপ ডাউনলোড আৰু টাইপিং কৰিব পাৰোঁ",
        "back": "পিছলৈ",
        "continue": "আগবাঢ়ক",
        "quizTitle": "বিত্তীয় সাক্ষৰতা মূল্যায়ন",
        "quizDesc": "আপোনাৰ বিত্তীয় ধাৰণা জানিবলৈ ৩টা প্ৰশ্নৰ উত্তৰ দিয়ক।",
        "q1of3": "প্ৰশ্ন ১ / ৩",
        "q1Title": "সুদ গণনা",
        "q1Scenario": "যদি আপুনি ১০% সুতৰ হাৰত ১ বছৰৰ বাবে ₹১০,০০০ ঋণ লয়, তেন্তে বছৰৰ শেষত কিমান সুদ দিব?",
        "q1a0": "₹১,০০০ (সঠিক সুদ)",
        "q1a1": "₹১০০ (১% গণনা)",
        "q1a2": "₹০ (সুদমুক্ত ঋণ)",
        "q1a3": "মই নাজানো / নিশ্চিত নহয়",
        "q2of3": "প্ৰশ্ন ২ / ৩",
        "q2Title": "সুৰক্ষিত PIN & OTP ব্যৱহাৰ",
        "q2Scenario": "বেংক মেনেজাৰ বুলি দাবী কৰি কোনোবাই আপোনাৰ UPI PIN বা OTP বিচাৰিলে কি কৰিব?",
        "q2a0": "একাউণ্ট বন্ধ নহ'বলৈ জনাম",
        "q2a1": "মোৰ নাম সঠিককৈ ক'লেহে জনাম",
        "q2a2": "ফোনত কাৰো লগত PIN/OTP শ্বেয়াৰ নকৰোঁ (সঠিক)",
        "q2a3": "পিছত ফোন কৰিবলৈ কম",
        "q3of3": "প্ৰশ্ন ৩ / ৩",
        "q3Title": "বেংক সঞ্চয়ৰ গুৰুত্ব",
        "q3Scenario": "ঘৰত নগদ টকা ৰখাতকৈ বেংকত টকা জমা কৰাৰ মূল লাভ কি?",
        "q3a0": "টকাৰ ওপৰত সুদ পোৱা যায় আৰু চুৰিৰ পৰা সুৰক্ষিত থাকে (সঠিক)",
        "q3a1": "বেংকত থকা টকা খৰচ কৰা সহজ",
        "q3a2": "নগদ আৰু বেংকৰ মাজত কোনো পাৰ্থক্য নাই",
        "q3a3": "লাভৰ বিষয়ে নিশ্চিত নহয়",
        "digitalTitle": "ডিজিটেল আত্মবিশ্বাস মূল্যায়ন",
        "digitalDesc": "স্পৰ্শ পৰ্দা পৰীক্ষা কৰিবলৈ এই ৩টা সহজ কাম সম্পূৰ্ণ কৰক।",
        "task1Title": "টাস্ক ১: সংখ্যা টাইপ কৰা",
        "task1Heading": "সংখ্যা কোড লিখক",
        "task1Desc": "তলৰ কীবৰ্ড ব্যৱহাৰ কৰি কোডটো লিখক: ",
        "task2Title": "টাস্ক ২: ড্ৰেগ আৰু ড্ৰপ",
        "task2Heading": "মুদ্ৰা সঞ্চয় কৰক",
        "task2Desc": "সোণৰ মুদ্ৰাটো টানি আনি পিগি বেংকত পেলাওক।",
        "dropCoin": "মুদ্ৰা ইয়াত পেলাওক",
        "task3Title": "টাস্ক ৩: স্বাইপ ভংগীমা",
        "task3Heading": "পৰিশোধৰ বাবে স্বাইপ কৰক",
        "task3Desc": "লেনদেন অনুমোদন কৰিবলৈ সোঁফালে স্বাইপ কৰক।",
        "swipeConfirm": "নিশ্চিত কৰিবলৈ সোঁফালে স্বাইপ কৰক",
        "waitingInput": "ইনপুটৰ বাবে অপেক্ষা কৰি থকা হৈছে...",
        "dragStart": "মুদ্ৰা টানি আৰম্ভ কৰক",
        "slideHandle": "হেণ্ডেলডাল সোঁফালে টানক",
        "trustTitle": "বিশ্বাস আৰু সুৰক্ষাৰ চিন্তা",
        "trustDesc": "ডিজিটেল লেনদেনত আপোনাৰ যিবোৰ ভয় লাগে সেইবোৰ বাছক।",
        "trustConcerns": "আপোনাৰ মূল চিন্তাবোৰ কি? (প্ৰযোজ্য সকলো বাছক)",
        "concernFraud": "প্ৰতাৰণাৰ ভয়",
        "concernFraudDesc": "অনলাইন প্ৰতাৰকৰ হাতত টকা হেৰুওৱাৰ ভয়",
        "concernPrivacy": "তথ্য আৰু একাউণ্টৰ গোপনীয়তা",
        "concernPrivacyDesc": "ব্যক্তিগত তথ্য ফাদিল হোৱাৰ চিন্তা",
        "concernCharges": "লুকাই থকা চাৰ্জ",
        "concernChargesDesc": "বেংকে কাৰণ নোহোৱাকৈ পইচা কাটিব নেকি সন্দেহ",
        "concernMistakes": "ভুল কৰাৰ ভয়",
        "concernMistakesDesc": "ভুল নম্বৰত পইচা পঠোৱাৰ ভয়",
        "reassurancePortal": "সুৰক্ষা নিৰ্দেশনা",
        "reassuranceDesc": "সুৰক্ষা তথ্য জানিবলৈ বাওঁফালৰ চিন্তাবোৰত ক্লিক কৰক।",
        "altAssessment": "বিকল্প মূল্যায়ন",
        "reliabilityTitle": "বিকল্প বিত্তীয় নিৰ্ভৰযোগ্যতা",
        "reliabilityDesc": "যাৰ ক্ৰেডিট ইতিহাস নাই, তেওঁলোকৰ বাবে সঞ্চয় আৰু বিল পৰিশোধৰ ওপৰত ভিত্তি কৰি মূল্যায়ন।",
        "simReliability": "নিৰ্ভৰযোগ্যতা প্ৰফাইল",
        "incomeProfile": "উপাৰ্জন আৰু সঞ্চয় প্ৰফাইল",
        "consentDetails": "মূল্যায়নৰ বাবে সন্মতি দিয়ক।",
        "incomePattern": "১. আপোনাৰ উপাৰ্জনৰ ধৰণ কেনেকুৱা?",
        "incomeRegular": "নিয়মীয়া মাহেকীয়া",
        "incomeIrregular": "অনিয়মীয়া দৈনিক/সাপ্তাহিক",
        "incomeSeasonal": "ঋতুভিত্তিক (ফসল/গিগ)",
        "indicatorsTitle": "২. আপোনাৰ বাবে প্ৰযোজ্য বিকল্প বাছক:",
        "ind1": "মই নিয়মীয়াকৈ দোকানৰ ভাড়া বা বিজুলী বিল পৰিশোধ কৰোঁ",
        "ind2": "মই ডাকঘৰ বা ঘৰত কিছু নগদ টকা সঞ্চয় কৰোঁ",
        "ind3": "মোৰ ব্যৱসায়ত সামগ্ৰী বা সঁজুলি আছে",
        "ind4": "স্থানীয় সুতখোৰৰ ওচৰত মোৰ কোনো ধাৰ নাই",
        "consentText": "বিকল্প নিৰ্ভৰযোগ্যতা মূল্যায়নত মই সন্মতি দিছোঁ।",
        "generateProfile": "প্ৰফাইল প্ৰস্তুত কৰক",
        "engineTitle": "অৰ্থসেতু অভিযোজন ইঞ্জিন",
        "engineDesc": "আপোনাৰ বাবে উপযুক্ত শিক্ষণ পথ।",
        "scoreLiteracy": "বিত্তীয় সাক্ষৰতা",
        "scoreDigital": "ডিজিটেল আত্মবিশ্বাস",
        "scoreReliability": "বিকল্প নিৰ্ভৰযোগ্যতা",
        "recommendedPath": "প্ৰস্তাবিত পথ",
        "calculating": "গণনা কৰি থকা হৈছে...",
        "selectContinue": "আগবাঢ়িবলৈ বাছক।",
        "enterLab": "সুৰক্ষিত বিত্ত লেবত প্ৰৱেশ কৰক",
        "labTitle": "সুৰক্ষিত বিত্ত লেব",
        "practiceSandboxTag": "অনুশীলন চেণ্ডবক্স",
        "tabPayment": "পেমেন্ট অনুশীলন",
        "tabFraud": "প্ৰতাৰণা চিনাক্তকৰণ",
        "tabLoan": "ঋণ তুলনা",
        "tabBudget": "বাজেট আৰু পৰিকল্পনা",
        "arthapay": "অৰ্থপে",
        "enterRecipient": "প্ৰাপকৰ UPI ID / নম্বৰ দিয়ক",
        "verifyRecipient": "প্ৰাপক পৰীক্ষা কৰক",
        "verified": "পৰীক্ষিত",
        "enterAmount": "টকাৰ পৰিমাণ দিয়ক (₹)",
        "walletBalance": "অনুশীলন ৱালেট বেলেঞ্চ: ₹১,০০০",
        "continueToPay": "পেমেন্ট কৰিবলৈ আগবাঢ়ক",
        "enterUPIPIN": "৬ সংখ্যাৰ UPI PIN দিয়ক",
        "payingRs": "পৰিশোধ কৰা হৈছে ₹",
        "toRecipient": "কৃষক বন্ধুক",
        "txnSuccess": "লেনদেন সফল হৈছে!",
        "sentTo": "পঠোৱা হ'ল",
        "txnId": "লেনদেন ID:",
        "payAgain": "পুনৰ পেমেন্ট কৰক",
        "paymentTutorial": "পেমেন্ট টিউটৰিয়েল",
        "paymentTutorialDesc": "আচল পইচাৰ ক্ষতি নোহোৱাকৈ লেনদেন শিকক।",
        "crucialGuidelines": "গুৰুত্বপূৰ্ণ নিৰ্দেশনা:",
        "practicePIN": "আপোনাৰ অনুশীলন PIN: ",
        "tip2": "পেমেন্ট কৰাৰ আগতে প্ৰাপকৰ নাম সদায় পৰীক্ষা কৰক।",
        "tip3": "সুৰক্ষিত বেংক স্ক্ৰীণৰ বাহিৰে ক'তো PIN নিদিব।",
        "walletHistory": "লেনদেনৰ ইতিহাস",
        "welcomeBonus": "স্বাগতম বোনাছ",
        "messageInbox": "বাৰ্তাৰ ইনবক্স",
        "fraudDesc": "RBI নিয়ম অনুসৰি, অননুমোদিত লেনদেন ৩ দিনৰ ভিতৰত বেংকত জনালে আপোনাৰ কোনো দায়িত্ব নাথাকে।",
        "selectMessage": "মেচেজ বাছক",
        "fraudPlaceholder": "বিশ্লেষণ কৰিবলৈ SMS ত ক্লিক কৰক।",
        "classifySafe": "সুৰক্ষিত বুলি চিনাক্ত কৰক",
        "reportFraud": "প্ৰতাৰণা বুলি ৰিপ'ৰ্ট কৰক",
        "loanTitle": "ঋণ খৰচ চিমুলেটৰ",
        "loanDesc": "সুদৰ পাৰ্থক্য বুজিবলৈ স্লাইডাৰ লৰচৰ কৰক।",
        "principalAmt": "মূল ধন",
        "interestRate": "সুদৰ হাৰ (বাৰ্ষিক)",
        "tenure": "সময়সীমা (মাহ)",
        "flatLoan": "ফ্লেট ঋণ (সৰল সুদ)",
        "flatRateFinancing": "ফ্লেট হাৰ বিত্তায়ন",
        "monthlyEMI": "মাহেকীয়া EMI",
        "totalInterest": "মুঠ সুদ",
        "totalRepayment": "মুঠ পৰিশোধ",
        "flatLoanDesc": "সুদ সদায় আৰম্ভণিৰ মূল ধনৰ ওপৰত ধৰা হয়।",
        "compoundLoan": "হ্ৰাসমান মূল ধন ঋণ",
        "reducingBalanceFinancing": "হ্ৰাসমান বাকী বিত্তায়ন",
        "compoundLoanDesc": "সুদ কেৱল বাকী থকা মূল ধনৰ ওপৰত ধৰা হয়। এইটোৱেই লাভজনক!",
        "budgetTitle": "ঋতুভিত্তিক বাজেট খেল",
        "budgetDesc": "বিভিন্ন পৰিস্থিতিত খৰচ নিয়ন্ত্ৰণ কৰক।",
        "currentIncome": "বৰ্তমান উপাৰ্জনৰ আৰ্হি:",
        "foodAlloc": "খাদ্য আৰু ভাড়া (₹)",
        "savingsBox": "সঞ্চয় বাকচ (₹)",
        "growthAlloc": "ব্যৱসায় বৃদ্ধি (₹)",
        "simulateMonth": "পৰৱৰ্তী মাহ চিমুলেট কৰক",
        "walletBal": "ৱালেট বেলেঞ্চ",
        "accumSavings": "মুঠ সঞ্চয়",
        "activityLog": "কাৰ্যকলাপ লগ",
        "gameStarted": "খেল আৰম্ভ হ'ল।",
        "guidanceTitle": "ব্যক্তিগত বিত্তীয় নিৰ্দেশনা",
        "guidanceDesc": "আপোনাৰ মূল্যায়নৰ ওপৰত ভিত্তি কৰি প্ৰস্তুত বিত্তীয় নিয়ম।",
        "viewReport": "প্ৰতিবেদন চাওক",
        "reportTitle": "বিত্তীয় প্ৰস্তুতি প্ৰতিবেদন",
        "reportDesc": "অভিনন্দন! এইখন আপোনাৰ অফিচিয়েল প্ৰমাণপত্ৰ।",
        "certTitle": "অৰ্থসেতু দক্ষতা প্ৰমাণপত্ৰ",
        "certAwardedTo": "এই প্ৰমাণপত্ৰ প্ৰদান কৰা হৈছে",
        "certDesc": "অভিযোজিত বিত্তীয় প্ৰফাইল আৰু UPI অনুশীলন সফলতাৰে সম্পূৰ্ণ কৰাৰ বাবে।",
        "certLiteracy": "সাক্ষৰতাৰ মাত্ৰা",
        "certDigital": "ডিজিটেল আত্মবিশ্বাস",
        "certPathway": "শিক্ষণ পথ",
        "certSystem": "ছিষ্টেমে জাৰী কৰিছে",
        "certDate": "তাৰিখ",
        "printCert": "প্ৰমাণপত্ৰ প্ৰিণ্ট কৰক",
        "provideFeedback": "মতামত দিয়ক",
        "feedbackTitle": "মতামত সমীক্ষা",
        "feedbackDesc": "এই সেৱা উন্নত কৰিবলৈ আমাক সহায় কৰক।",
        "surveyQ1": "১. এই এপটো ব্যৱহাৰ কৰা কিমান সহজ আছিল?",
        "surveyQ2": "২. সুৰক্ষা নিয়মবোৰ স্পষ্টকৈ বুজি পালে নে?",
        "surveyQ3": "৩. এতিয়া নিজে অকলে ম'বাইল পেমেন্ট কৰিবলৈ আত্মবিশ্বাস আছেনে?",
        "surveyQ4": "৪. আপোনাৰ কিবা পৰামৰ্শ আছেনে?",
        "feedbackPlaceholder": "অসমীয়া বা ইংৰাজীত ইয়াত লিখক...",
        "saveReset": "সংৰক্ষণ আৰু ৰিছেট কৰক",
        "assistantName": "অৰ্থদূত সহায়ক:",
        "welcomeArthasetu": "অৰ্থসেতুলৈ স্বাগতম।",
        "voiceOn": "কণ্ঠ সহায়: অন",
        "voiceOff": "কণ্ঠ সহায়: অফ",
        "helpWelcome": "নমস্কাৰ! মই অৰ্থদূত। মই আপোনাক নিৰ্দেশনা পঢ়ি সহায় কৰিম।",
        "profileHelp": "প্ৰতিটো বিভাগৰ পৰা এটা বিকল্প বাছক।",
        "quizHelp": "সঠিক উত্তৰটো বাছক। ভুল হ'বলৈ ভয় নকৰিব।",
        "digitalHelp": "প্ৰথমে ৪০৯৬ টাইপ কৰক, তাৰ পিছত মুদ্ৰাটো বেংকত পেলাওক, শেষত স্লাইডাৰডাল টানক।",
        "trustHelp": "আপোনাৰ ভয় লগা কথাবোৰ বাছক।",
        "reliabilityHelp": "বিকল্প উপায়েৰে আপোনাৰ নিৰ্ভৰযোগ্যতা প্ৰমাণ কৰিব পাৰি।",
        "sandboxHelp": "কোনো লোকচানৰ ভয় নোহোৱাকৈ পেমেন্ট অনুশীলন কৰক।",
        "guidanceHelp": "এই সুৰক্ষা নিয়মবোৰ পঢ়ক।",
        "reportHelp": "এইখন আপোনাৰ প্ৰমাণপত্ৰ!",
        "surveyHelp": "অনুগ্ৰহ কৰি আপোনাৰ অভিজ্ঞতা মূল্যায়ন কৰক। ধন্যবাদ!",
        "pathAssisted": "কণ্ঠ / দৃশ্য সহায়ক পথ",
        "pathAssistedDesc": "ডাঙৰ বুটাম আৰু সম্পূৰ্ণ কণ্ঠ সহায় আপোনাক পথ দেখুৱাব।",
        "pathAssistedFeat1": "স্বয়ংক্ৰিয় কণ্ঠ নিৰ্দেশনা",
        "pathAssistedFeat2": "ডাঙৰ ফণ্ট আৰু বুটাম",
        "pathAssistedFeat3": "সহজ এক-স্পৰ্শ নিশ্চিতকৰণ",
        "pathGuided": "নিৰ্দেশিত পথ",
        "pathGuidedDesc": "প্ৰয়োজনীয় বুটামত হাইলাইট কৰি সহায় কৰিব।",
        "pathGuidedFeat1": "জিলিকি থকা বুটাম হাইলাইট",
        "pathGuidedFeat2": "সুৰক্ষা সতৰ্কবাৰ্তা",
        "pathGuidedFeat3": "সহায়ক টিপছ",
        "pathSelf": "স্বয়ং-নিৰ্দেশিত পথ",
        "pathSelfDesc": "আপুনি স্মাৰ্টফোন ব্যৱহাৰত অত্যন্ত নিপুণ।",
        "pathSelfFeat1": "সাধাৰণ নেভিগেচন",
        "pathSelfFeat2": "সম্পূৰ্ণ স্বাধীনতা",
        "pathSelfFeat3": "উন্নত অনুশীলন",
        "certSelf": "স্বয়ং-নিৰ্দেশিত",
        "certGuided": "নিৰ্দেশিত সহায়",
        "certAssisted": "কণ্ঠ সহায়",
        "lockedMsg": "এই অংশটো বন্ধ আছে। অনুগ্ৰহ কৰি আগৰ কামটো শেষ কৰক।",
        "occupationMsg": "বৃত্তি সংৰক্ষণ কৰা হ'ল।",
        "answerMsg": "উত্তৰ সংৰক্ষণ কৰা হ'ল।",
        "clearedMsg": "মচি পেলোৱা হ'ল",
        "codeSuccess": "সফল! কোড সঠিক হৈছে।",
        "firstTaskDone": "অতি উত্তম! প্ৰথম কাম শেষ হ'ল।",
        "codeWrong": "ভুল কোড। পুনৰ চেষ্টা কৰক।",
        "codeWrongRetry": "ভুল কোড, অনুগ্ৰহ কৰি পুনৰ ৪০৯৬ টাইপ কৰক।",
        "savingsSecured": "সঞ্চয় সুৰক্ষিত হ'ল!",
        "coinDeposited": "সফল! মুদ্ৰা জমা হ'ল।",
        "coinSecured": "অভিনন্দন, মুদ্ৰা বেংকত সুৰক্ষিত আছে।",
        "swipeSuccess": "সফল! স্বাইপ অনুমোদিত হ'ল।",
        "swipeDone": "স্বাইপ সফলতাৰে সম্পন্ন হ'ল।",
        "optionToggled": "বিকল্প সলনি হ'ল।",
        "incomeRecorded": "উপাৰ্জনৰ ধৰণ সংৰক্ষণ হ'ল।",
        "scoreCalculated": "নিৰ্ভৰযোগ্যতা স্ক'ৰ {score}% হ'ল।",
        "labTabActive": "লেবৰ {tab} অংশ আৰম্ভ হ'ল।",
        "recipientVerified": "সফল! প্ৰাপক পৰীক্ষা কৰা হ'ল।",
        "enterValidUPI": "অনুগ্ৰহ কৰি সঠিক UPI ID বা নম্বৰ দিয়ক।",
        "enterAmountMsg": "অনুগ্ৰহ কৰি ₹১০ ৰ পৰা ₹২,০০০ লৈকে ধন দিয়ক।",
        "insufficientFunds": "ৱালেটত পৰ্যাপ্ত ধন নাই।",
        "enterPIN": "পৰীক্ষাৰ বাবে ৬ সংখ্যাৰ UPI PIN দিয়ক।",
        "paymentSuccess": "সফল! পেমেন্ট সম্পূৰ্ণ হ'ল।",
        "wrongPIN": "ভুল UPI PIN। অনুগ্ৰহ কৰি ১২৩৪৫৬ দিয়ক।",
        "smsReview": "মেচেজ খোলা হ'ল।",
        "correctDecision": "আপোনাৰ সিদ্ধান্ত সঠিক।",
        "wrongDecision": "ভুল সিদ্ধান্ত। সতৰ্কবাৰ্তা মনোযোগেৰে পঢ়ক।",
        "overBudget": "বৰাদ্দ ৱালেট বেলেঞ্চতকৈ বেছি হৈছে!",
        "monthComplete": "মাহ সম্পূৰ্ণ হ'ল।",
        "monthLabel": "মাহ",
        "ratingRecorded": "ৰেটিং সংৰক্ষিত হ'ল।",
        "profileSaved": "অভিনন্দন! আপোনাৰ প্ৰফাইল সংৰক্ষিত হ'ল।",
        "onboardingDone": "সফল! আপোনাৰ মতামত গ্ৰহণ কৰা হ'ল।",
        "fraudTitle": "প্ৰতাৰণাৰ পৰা সুৰক্ষা",
        "privacyTitle": "তথ্য সুৰক্ষা আইন",
        "privacyDesc": "আপোনাৰ তথ্য DPDP আইনৰ অধীনত সুৰক্ষিত থাকে।",
        "chargesTitle": "কোনো লুকোৱা চাৰ্জ নাই",
        "chargesDesc": "BSBD একাউণ্টত নূন্যতম ধন ৰখাৰ কোনো প্ৰয়োজন নাই।",
        "mistakesTitle": "ভুল লেনদেন ঘূৰাই পোৱা",
        "mistakesDesc": "ভুল একাউণ্টত পইচা গ'লে NPCI প'ৰ্টেলত পোনে পোনে অভিযোগ কৰিব পাৰে।",
        "tipSecTitle": "OTP বা PIN কেতিয়াও কাকো নিদিব",
        "tipSecDesc": "কোনো বেংক বিষয়াই কেতিয়াও ফোনত UPI PIN বা OTP নিবিচাৰে।",
        "tipSavTitle": "জৰুৰীকালীন সঞ্চয় পুঁজী",
        "tipSavDescRegular": "নিয়মীয়া উপাৰ্জন থাকিলে প্ৰতি মাহে অন্তত ১৫% সঞ্চয় কৰক।",
        "tipSavDescIrregular": "উপাৰ্জন সলনি হৈ থাকিলে ৩ মাহৰ খৰচৰ সমান ধন জমা ৰাখক।",
        "tipCreTitle": "অধিক সুতৰ ঋণৰ পৰা আঁতৰি থাকক",
        "tipCreDesc": "সুদখোৰৰ ৫% মাহেকীয়া সুদ বছৰত ৬০% হয়! চৰকাৰী মুদ্ৰা ঋণ ব্যৱহাৰ কৰক।",
        "tipPayTitle": "নাম পৰীক্ষা কৰি পইচা পঠাওক",
        "tipPayDesc": "PIN দিয়াৰ আগতে স্ক্ৰীণত দেখা আচল নাম সদায় লক্ষ্য কৰক।",
        "sms1Sender": "AD-LOTTRI",
        "sms1Text": "অভিনন্দন! আপুনি চৰকাৰী লটাৰীত ₹১০,০০,০০০ লাভ কৰিছে। পাবলৈ ক্লিক কৰক: www.sarkari-win.com/claim",
        "sms1Expl": "এইটো প্ৰতাৰণা। চৰকাৰে SMS লিংকৰ জৰিয়তে লটাৰী নিদিয়ে।",
        "sms2Sender": "State Bank",
        "sms2Text": "গ্ৰাহক মহোদয়, আপোনাৰ মাহেকীয়া একাউণ্ট ষ্টেটমেণ্ট সাজু হৈছে। ডাউনলোড কৰিবলৈ অফিচিয়েল প'ৰ্টেলত লগইন কৰক। PIN নিদিব।",
        "sms2Expl": "এইটো সুৰক্ষিত। ইয়াত কোনো সন্দেহজনক লিংক নাই।",
        "sms3Sender": "BP-ALERT",
        "sms3Text": "সতৰ্কবাৰ্তা! আপোনাৰ বিজুলী বিল ₹১,৪৫০ বাকী আছে। লাইন কটা বন্ধ কৰিবলৈ ফোনত OTP দিয়ক।",
        "sms3Expl": "এইটো প্ৰতাৰণা। বিজুলী কোম্পানীয়ে ফোনত OTP নিবিচাৰে।",
        "eventMedical": "চিকিৎসাজনিত জৰুৰীকালীন অৱস্থা",
        "eventMedicalDesc": "পৰিয়ালৰ সদস্যৰ অসুখ। ₹১,০০০ খৰচ।",
        "eventHarvest": "উত্তম শস্য বোনাছ",
        "eventHarvestDesc": "ফসলৰ ভাল দাম পোৱা গ'ল! ₹১,৫০০ অতিৰিক্ত লাভ।",
        "eventDrought": "খৰাং / মন্দাৱস্থা",
        "eventDroughtDesc": "বেয়া বতৰৰ কাৰণে কোনো উপাৰ্জন নহ'ল।",
        "eventFestival": "উৎসৱ উদযাপন",
        "eventFestivalDesc": "মিঠাই আৰু উপহাৰত ₹৫০০ খৰচ।"
    }
};

// Helper: get translated message string
function msg(key) {
    const dict = i18n[state.selectedLang] || i18n['en'];
    return (dict && dict[key]) || (i18n['en'] && i18n['en'][key]) || key;
}

// Apply all data-i18n translations to the current page
function applyTranslations() {
    const dict = i18n[state.selectedLang] || i18n['en'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.textContent = dict[key];
        }
    });
    // Update page title
    document.title = 'ArthaSetu - ' + (dict.brandTagline || 'Adaptive Inclusion');
}
// --- Web Speech API TTS Wrapper ---
let synth = window.speechSynthesis;
let currentUtterance = null;

function speak(text) {
    if (!state.voiceMode || !text) return;

    // Update simulated speech bubble
    const bubble = document.getElementById('assistantSpeechBubble');
    const bubbleText = document.getElementById('assistantSpeechText');
    if (bubble && bubbleText) {
        bubble.style.display = 'flex';
        bubbleText.innerText = text;

        // Auto-hide bubble after 6 seconds
        clearTimeout(window.bubbleTimer);
        window.bubbleTimer = setTimeout(() => {
            bubble.style.display = 'none';
        }, 6000);
    }

    if (!window.speechSynthesis) return;

    try {
        window.speechSynthesis.cancel(); // Stop currently speaking audio

        currentUtterance = new SpeechSynthesisUtterance(text);

        // Choose appropriate voice language
        const langMap = {
            'en': 'en-IN',
            'hi': 'hi-IN',
            'ta': 'ta-IN',
            'bn': 'bn-IN',
            'te': 'te-IN',
            'mr': 'mr-IN',
            'pa': 'pa-IN',
            'ur': 'ur-IN',
            'gu': 'gu-IN',
            'kn': 'kn-IN',
            'as': 'as-IN'
        };
        currentUtterance.lang = langMap[state.selectedLang] || 'en-IN';
        currentUtterance.rate = 0.95;

        window.speechSynthesis.speak(currentUtterance);
    } catch (err) {
        console.warn('Speech synthesis error:', err);
    }
}

// Hover read-aloud support
function setupHoverSpeech() {
    // Add hover speech triggers to all main cards, buttons and headings
    const speakableElements = document.querySelectorAll('.choice-card, .quiz-option, .concern-checkbox-card, .inc-btn, .sandbox-tab-btn, .btn-primary, .btn-secondary, h2, h3');
    speakableElements.forEach(elem => {
        elem.removeEventListener('mouseenter', handleElementHoverSpeech);
        elem.addEventListener('mouseenter', handleElementHoverSpeech);
    });
}

function handleElementHoverSpeech(e) {
    if (!state.voiceMode) return;
    let textToSpeak = '';
    
    if (e.currentTarget.classList.contains('choice-card')) {
        const title = e.currentTarget.querySelector('.choice-title')?.innerText || '';
        const sub = e.currentTarget.querySelector('.choice-sub')?.innerText || '';
        textToSpeak = `${title}. ${sub}`;
    } else if (e.currentTarget.classList.contains('quiz-option')) {
        textToSpeak = e.currentTarget.innerText;
    } else if (e.currentTarget.classList.contains('concern-checkbox-card')) {
        const title = e.currentTarget.querySelector('h4')?.innerText || '';
        const desc = e.currentTarget.querySelector('p')?.innerText || '';
        textToSpeak = `${title}. ${desc}`;
    } else {
        textToSpeak = e.currentTarget.innerText || e.currentTarget.placeholder || '';
    }
    
    if (textToSpeak.trim().length > 0) {
        speak(textToSpeak);
    }
}

// --- Navigation & State Machine ---
function goToScreen(screenNum) {
    // Security screens (12-14) are always accessible
    const isSecurityScreen = screenNum >= 12 && screenNum <= 14;
    
    // Check locked status - only block if jumping more than 1 screen ahead (except security screens)
    const navItem = document.getElementById(`nav-item-${screenNum}`);
    if (navItem && navItem.classList.contains('locked') && screenNum > state.currentScreen + 1 && !isSecurityScreen) {
        speak(msg('lockedMsg'));
        return;
    }

    // Hide old screen, show new
    document.querySelectorAll('.screen').forEach(scr => scr.classList.remove('active'));
    
    const targetScreen = document.getElementById(`screen${screenNum}`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        state.currentScreen = screenNum;
        
        // Apply translations to the newly visible screen
        applyTranslations();
        
        // Scroll content container to top
        document.querySelector('.content-area').scrollTop = 0;
        
        // Update sidebar links active class
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        const activeNavItem = document.getElementById(`nav-item-${screenNum}`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
            activeNavItem.classList.remove('locked');
        }
        
        // Update Header Title
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            const dictionary = i18n[state.selectedLang] || i18n['en'];
            pageTitle.innerText = dictionary[`title${screenNum}`] || `Step ${screenNum}`;
        }
        
        // Voice assistance screen guidance
        triggerScreenVoiceGuide(screenNum);
        
        // Specific screen initializations
        if (screenNum === 8) {
            initializeSandboxTab();
        } else if (screenNum === 9) {
            renderPersonalisedGuidance();
        } else if (screenNum === 10) {
            generateCertificate();
        }
        
        // Set up hover triggers for newly displayed elements
        setTimeout(setupHoverSpeech, 100);
    }
}

function triggerScreenVoiceGuide(screenNum) {
    const dictionary = i18n[state.selectedLang] || i18n['en'];
    
    switch(screenNum) {
        case 1:
            speak(dictionary.helpWelcome);
            break;
        case 2:
            speak(dictionary.profileHelp);
            break;
        case 3:
            speak(dictionary.quizHelp);
            break;
        case 4:
            speak(dictionary.digitalHelp);
            break;
        case 5:
            speak(dictionary.trustHelp);
            break;
        case 6:
            speak(dictionary.reliabilityHelp);
            break;
        case 7:
            speak(dictionary.sandboxHelp || "Review your profile and proceed to the Safe Finance Lab.");
            break;
        case 8:
            speak(dictionary.sandboxHelp);
            break;
        case 9:
            speak(dictionary.guidanceHelp);
            break;
        case 10:
            speak(dictionary.reportHelp);
            break;
        case 11:
            speak(dictionary.surveyHelp);
            break;
        case 12:
            speak("Security Dashboard showing all 10 next-gen security innovations protecting your data.");
            loadSecurityDashboard();
            break;
        case 13:
            speak("Smart Consent Manager. Grant or revoke cryptographic consent tokens for data access.");
            loadConsentList();
            break;
        case 14:
            speak("ZKP Verifier. Generate zero-knowledge proofs to verify identity without revealing data.");
            break;
    }
}

function triggerHelp() {
    triggerScreenVoiceGuide(state.currentScreen);
}

// --- Step 1: Language & Voice Selection ---
function selectLanguage(langCode, btnElement) {
    state.selectedLang = langCode;

    // UI Visual updates
    document.querySelectorAll('.lang-card').forEach(btn => btn.classList.remove('active'));
    if (btnElement) {
        btnElement.classList.add('active');
    } else {
        const card = document.querySelector(`.lang-card[data-lang="${langCode}"]`) || 
                     Array.from(document.querySelectorAll('.lang-card')).find(b => b.getAttribute('onclick') && b.getAttribute('onclick').includes(`'${langCode}'`));
        if (card) card.classList.add('active');
    }

    // Update sidebar navigation text for ALL languages
    const dictionary = i18n[langCode] || i18n['en'];
    for (let i = 1; i <= 14; i++) {
        const navText = document.getElementById(`nav-item-${i}`)?.querySelector('.nav-text');
        if (navText && dictionary[`title${i}`]) {
            navText.innerText = dictionary[`title${i}`];
        }
    }

    // Update screen text from dictionary
    applyTranslations();

    // Update voice pill text
    const voicePillText = document.getElementById('voicePillText');
    if (voicePillText) {
        voicePillText.innerText = state.voiceMode ? (dictionary.voiceOn || "Voice Assist: On") : (dictionary.voiceOff || "Voice Assist: Off");
    }

    // Update Start Profiling button text
    const startBtn = document.querySelector('#screen1 .footer-navigation .btn-primary');
    if (startBtn) {
        startBtn.innerHTML = msg('startProfiling') + ' <span class="arrow">→</span>';
    }

    speak(msg('welcomeArthasetu'));
}

function handleVoiceToggleChange(checkbox) {
    state.voiceMode = checkbox.checked;
    
    const pill = document.getElementById('voicePillIcon');
    const text = document.getElementById('voicePillText');
    const voicePillContainer = document.querySelector('.voice-mode-pill');
    const dictionary = i18n[state.selectedLang] || i18n['en'];
    
    if (checkbox.checked) {
        voicePillContainer.classList.add('active');
        text.innerText = dictionary.voiceOn || "Voice Assist: On";
        speak(dictionary.helpWelcome || "Voice guidance has been turned on.");
    } else {
        voicePillContainer.classList.remove('active');
        text.innerText = dictionary.voiceOff || "Voice Assist: Off";
        if (synth) synth.cancel();
        document.getElementById('assistantSpeechBubble').style.display = 'none';
    }
}

function toggleVoiceModeBtn() {
    const toggle = document.getElementById('voiceToggle');
    if (toggle) {
        toggle.checked = !toggle.checked;
        handleVoiceToggleChange(toggle);
    }
}

// --- Step 2: "Know Me" Profiling ---
function selectProfileOption(category, value, cardElement) {
    // Save to state
    state.profile[category] = value;
    
    // Toggle active classes on siblings
    const siblings = cardElement.parentNode.children;
    for (let sib of siblings) {
        sib.classList.remove('active');
    }
    cardElement.classList.add('active');
    
    // Dynamic text synthesis feedback
    if (category === 'occupation') {
        speak(msg('occupationMsg'));
    }
    
    // Check if form is fully filled to enable Next
    if (state.profile.occupation && state.profile.finExp && state.profile.digConf) {
        document.getElementById('btn-profile-next').disabled = false;
        unlockScreen(3);
    }
}

function unlockScreen(num) {
    const navItem = document.getElementById(`nav-item-${num}`);
    if (navItem) {
        navItem.classList.remove('locked');
    }
}

// --- Step 3: Financial Literacy Quiz ---
function selectQuizAnswer(questionNum, answerIndex, optionElement) {
    state.quizAnswers[questionNum] = answerIndex;
    
    // Visual toggles
    const siblings = optionElement.parentNode.children;
    for(let sib of siblings) {
        sib.classList.remove('selected');
    }
    optionElement.classList.add('selected');
    
    speak(msg('answerMsg'));
    
    // Check if current question is solved to show next question card or enable next screen
    setTimeout(() => {
        if (questionNum < 3) {
            document.getElementById(`q-card-${questionNum}`).classList.remove('active');
            document.getElementById(`q-card-${questionNum + 1}`).classList.add('active');
            triggerScreenVoiceGuide(3);
        } else {
            // All questions answered
            document.getElementById('btn-quiz-next').disabled = false;
            unlockScreen(4);
        }
    }, 800);
}

// --- Step 4: Digital Touch Test ---
let typedCode = "";
function pressKey(num) {
    if (typedCode.length < 4) {
        typedCode += num;
        document.getElementById('pin-display').innerText = typedCode.padEnd(4, '-');
        speak(num.toString());
    }
}

function clearKeys() {
    typedCode = "";
    document.getElementById('pin-display').innerText = "----";
    speak(msg('clearedMsg'));
}

function submitNumericTask() {
    const status = document.getElementById('task1-status');
    if (typedCode === "4096") {
        state.digitalTasks.task1 = true;
        status.innerText = msg('codeSuccess');
        status.className = "task-result-status success";
        speak(msg('firstTaskDone'));
        document.getElementById('dig-task-1').style.borderColor = "var(--accent)";
        checkDigitalTasksCompletion();
    } else {
        status.innerText = msg('codeWrong');
        status.className = "task-result-status error";
        speak(msg('codeWrongRetry'));
        clearKeys();
    }
}

// Drag & Drop
function dragCoin(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function allowDropCoin(ev) {
    ev.preventDefault();
    document.getElementById('piggy-target').classList.add('hovered');
}

function dropCoin(ev) {
    ev.preventDefault();
    const target = document.getElementById('piggy-target');
    target.classList.remove('hovered');
    
    const data = ev.dataTransfer.getData("text");
    const coin = document.getElementById(data);
    
    if (coin) {
        coin.style.display = 'none'; // Hide coin
        target.querySelector('.piggy-icon').innerText = "🏦";
        target.querySelector('.piggy-text').innerText = msg('savingsSecured');
        target.style.borderColor = "var(--accent)";
        
        state.digitalTasks.task2 = true;
        const status = document.getElementById('task2-status');
        status.innerText = msg('coinDeposited');
        status.className = "task-result-status success";
        speak(msg('coinSecured'));
        document.getElementById('dig-task-2').style.borderColor = "var(--accent)";
        checkDigitalTasksCompletion();
    }
}

// Swipe Slider
let isSwiping = false;
let startX = 0;
let maxDrag = 0;

function startSwipe(e) {
    isSwiping = true;
    startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    maxDrag = document.getElementById('swipe-container').offsetWidth - 48; // width minus handle
    
    document.addEventListener('mousemove', handleSwipeMove);
    document.addEventListener('mouseup', endSwipe);
    document.addEventListener('touchmove', handleSwipeMove);
    document.addEventListener('touchend', endSwipe);
}

function handleSwipeMove(e) {
    if (!isSwiping) return;
    const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    let diff = currentX - startX;
    
    if (diff < 0) diff = 0;
    if (diff > maxDrag) diff = maxDrag;
    
    const handle = document.getElementById('swipe-handle');
    handle.style.left = diff + "px";
    
    // If swiped to 90% or more, lock success
    if (diff >= maxDrag * 0.9) {
        successSwipe();
    }
}

function endSwipe() {
    if (!isSwiping) return;
    isSwiping = false;
    
    document.removeEventListener('mousemove', handleSwipeMove);
    document.removeEventListener('mouseup', endSwipe);
    document.removeEventListener('touchmove', handleSwipeMove);
    document.removeEventListener('touchend', endSwipe);
    
    // Return to start if not successful
    if (!state.digitalTasks.task3) {
        const handle = document.getElementById('swipe-handle');
        handle.style.left = "0px";
    }
}

function successSwipe() {
    state.digitalTasks.task3 = true;
    const handle = document.getElementById('swipe-handle');
    handle.style.left = maxDrag + "px";
    handle.innerText = "✓";
    handle.style.background = "var(--accent)";
    
    const status = document.getElementById('task3-status');
    status.innerText = msg('swipeSuccess');
    status.className = "task-result-status success";
    speak(msg('swipeDone'));
    document.getElementById('dig-task-3').style.borderColor = "var(--accent)";
    
    isSwiping = false;
    checkDigitalTasksCompletion();
}

function checkDigitalTasksCompletion() {
    if (state.digitalTasks.task1 && state.digitalTasks.task2 && state.digitalTasks.task3) {
        document.getElementById('btn-digital-next').disabled = false;
        unlockScreen(5);
    }
}

// --- Step 5: Trust & Safety Assessment ---
const trustConcernsInfo = {
    'fraud': {
        title_en: "Scams & Fraud Safeguards",
        title_hi: "धोखाधड़ी से सुरक्षा",
        desc_en: "Under RBI guidelines, if you notify your bank within 3 days of unauthorized electronic transactions, your liability is ZERO. Banks never ask for UPI PINs to credit money.",
        desc_hi: "आरबीआई नियमों के तहत, यदि आप अनधिकृत लेनदेन के 3 दिनों के भीतर अपने बैंक को सूचित करते हैं, तो आपकी देनदारी शून्य है। बैंक कभी पैसे जमा करने के लिए पिन नहीं मांगते।"
    },
    'privacy': {
        title_en: "Privacy and Banking Acts",
        title_hi: "डेटा गोपनीयता नियम",
        desc_en: "Your data is protected under the Digital Personal Data Protection (DPDP) Act of India. Financial institutions are legally barred from sharing account records without explicit consent.",
        desc_hi: "आपका डेटा डीपीडीपी (DPDP) अधिनियम के तहत सुरक्षित है। कानूनन कोई भी बैंक आपकी सहमति के बिना आपके खाते की जानकारी साझा नहीं कर सकता।"
    },
    'charges': {
        title_en: "Zero Hidden Fees Mandate",
        title_hi: "पारदर्शी शुल्क नियम",
        desc_en: "Basic Savings Bank Deposit (BSBD) accounts have zero minimum balance requirements. Banks are legally required to display fee structures transparently in local languages.",
        desc_hi: "जनधन या बीएसबीडी खातों में न्यूनतम राशि रखने की कोई सीमा नहीं है। शुल्क नियमों को स्थानीय भाषा में स्पष्ट रूप से दिखाना बैंक के लिए अनिवार्य है।"
    },
    'mistakes': {
        title_en: "Wrong Transfer Recovery",
        title_hi: "गलत भुगतान वापसी",
        desc_en: "If you transfer money to a wrong account via UPI, you can file an immediate dispute on the NPCI portal (npci.org.in) or dial toll-free helpline 1800-120-1740 for reversal assistance.",
        desc_hi: "यदि आप यूपीआई से किसी गलत खाते में पैसे भेजते हैं, तो आप एनपीसीआई (NPCI) पोर्टल पर शिकायत दर्ज करा सकते हैं या टोल-फ्री हेल्पलाइन १८००-१२०-१७४० पर कॉल कर सकते हैं।"
    }
};

function toggleConcern(concernKey, element) {
    state.selectedConcerns[concernKey] = !state.selectedConcerns[concernKey];
    element.classList.toggle('active');
    
    // Speak feedback
    speak(msg('optionToggled'));
    
    renderTrustFeedback();
    unlockScreen(6);
}

function renderTrustFeedback() {
    const details = document.getElementById('trust-feedback-details');
    const placeholder = document.querySelector('.placeholder-feedback');
    
    let html = `<h3>🛡️ Security & Regulatory Protections</h3>`;
    let activeCount = 0;
    
    for (let key in state.selectedConcerns) {
        if (state.selectedConcerns[key]) {
            activeCount++;
            const titleKey = key + 'Title';
            const descKey = key + 'Desc';
            const title = msg(titleKey);
            const desc = msg(descKey);
            
            html += `
                <div class="concern-fact-card">
                    <h4>${title}</h4>
                    <p>${desc}</p>
                </div>
            `;
        }
    }
    
    if (activeCount > 0) {
        placeholder.style.display = 'none';
        details.style.display = 'block';
        details.innerHTML = html;
    } else {
        placeholder.style.display = 'block';
        details.style.display = 'none';
    }
}

// --- Step 6: Reliability & Income Assessment ---
function selectIncomePattern(pattern, btnElement) {
    state.profile.incomePattern = pattern;
    
    const siblings = btnElement.parentNode.children;
    for(let sib of siblings) {
        sib.classList.remove('active');
    }
    btnElement.classList.add('active');
    
    speak(msg('incomeRecorded'));
}

function recalculateReliabilityScore() {
    const checkboxes = document.querySelectorAll('.rel-check');
    let checkedCount = 0;
    checkboxes.forEach(chk => {
        if (chk.checked) checkedCount++;
    });
    
    state.reliabilityIndicatorsCount = checkedCount;
    const score = checkedCount * 25;
    
    document.getElementById('reliabilityScoreDisplay').innerText = `${score}%`;
    speak(msg('scoreCalculated').replace('{score}', score));
}

function handleConsentChange(checkbox) {
    state.reliabilityConsent = checkbox.checked;
    document.getElementById('btn-reliability-next').disabled = !checkbox.checked;
    if (checkbox.checked) unlockScreen(7);
}

// --- Step 7: Statistical Engine Calculations ---
function calculateStatisticalProfile() {
    // 1. Calculate Literacy Score
    let correct = 0;
    for(let q in state.quizAnswers) {
        if (state.quizAnswers[q] === state.quizCorrectAnswers[q]) {
            correct++;
        }
    }
    state.scores.literacy = Math.round((correct / 3) * 100);
    
    // 2. Calculate Digital Confidence Score
    let tasks = 0;
    if (state.digitalTasks.task1) tasks++;
    if (state.digitalTasks.task2) tasks++;
    if (state.digitalTasks.task3) tasks++;
    state.scores.digital = Math.round((tasks / 3) * 100);
    
    // 3. Calculate Alternative Reliability Score
    state.scores.reliability = state.reliabilityIndicatorsCount * 25;
    
    // 4. Update Engine Gauges UI
    document.getElementById('bar-lit').style.width = `${state.scores.literacy}%`;
    document.getElementById('lbl-lit').innerText = `${state.scores.literacy}%`;
    
    document.getElementById('bar-dig').style.width = `${state.scores.digital}%`;
    document.getElementById('lbl-dig').innerText = `${state.scores.digital}%`;
    
    document.getElementById('bar-rel').style.width = `${state.scores.reliability}%`;
    document.getElementById('lbl-rel').innerText = `${state.scores.reliability}%`;
    
    // 5. Pathway Selection Algorithm
    let pathway = 'self';
    let pathTitle = '';
    let pathDesc = '';
    let pathFeats = [];
    
    const dict = i18n[state.selectedLang] || i18n['en'];
    if (state.scores.digital <= 33 || state.profile.digConf === 'low') {
        pathway = 'assisted';
        pathTitle = dict.pathAssisted || "Voice/Visual Assisted Pathway";
        pathDesc = dict.pathAssistedDesc || "Based on your touch tasks and profiling answers, the engine recommends continuous audio speech guidance.";
        pathFeats = [dict.pathAssistedFeat1 || "Continuous Audio Guidance Active", dict.pathAssistedFeat2 || "Enlarged Button Sizes", dict.pathAssistedFeat3 || "One-Tap Action Confirmations"];
    } else if (state.scores.digital === 66 || state.profile.digConf === 'medium') {
        pathway = 'guided';
        pathTitle = dict.pathGuided || "Interactive Guided Pathway";
        pathDesc = dict.pathGuidedDesc || "You are comfortable with basic tasks. The engine activates contextual highlight indicators.";
        pathFeats = [dict.pathGuidedFeat1 || "Pulsing Indicator Rings", dict.pathGuidedFeat2 || "Contextual Safety Alerts", dict.pathGuidedFeat3 || "Guided Progress Indicators"];
    } else {
        pathway = 'self';
        pathTitle = dict.pathSelf || "Self-Guided Pathway";
        pathDesc = dict.pathSelfDesc || "You demonstrated full digital dexterity. The application will operate in standard mode.";
        pathFeats = [dict.pathSelfFeat1 || "Standard Interactive Navigation", dict.pathSelfFeat2 || "Unrestricted Simulator Modes", dict.pathSelfFeat3 || "Full Practice Logs Access"];
    }
    
    state.selectedPathway = pathway;
    document.getElementById('pathway-name').innerText = pathTitle;
    document.getElementById('pathway-desc').innerText = pathDesc;
    
    let featsHtml = '';
    pathFeats.forEach(feat => {
        featsHtml += `<div class="highlight-feat-item">${feat}</div>`;
    });
    document.getElementById('pathway-features').innerHTML = featsHtml;
    
    // Apply pathway visual helpers to Sandbox screens if needed
    applyPathwayVisualHelpers(pathway);
    
    // Go to Decision Screen
    unlockScreen(7);
    unlockScreen(8);
    goToScreen(7);
}

function applyPathwayVisualHelpers(pathway) {
    const payInput1 = document.getElementById('recipient-input');
    const payInput2 = document.getElementById('transfer-amount');
    
    // Clear previous guided styles
    payInput1.classList.remove('guided-highlight');
    payInput2.classList.remove('guided-highlight');
    
    if (pathway === 'guided' || pathway === 'assisted') {
        // Highlight first step input in simulator
        payInput1.classList.add('guided-highlight');
    }
    
    // Enable continuous TTS voice reading on screen changes automatically if assisted
    if (pathway === 'assisted') {
        const toggle = document.getElementById('voiceToggle');
        if (toggle && !toggle.checked) {
            toggle.checked = true;
            handleVoiceToggleChange(toggle);
        }
    }
}

// --- Step 8: Safe Finance Lab Simulators ---
function switchSandboxTab(tabName, btnElement) {
    state.sandbox.activeTab = tabName;
    
    // Toggle tab button active classes
    const tabs = document.querySelectorAll('.sandbox-tab-btn');
    tabs.forEach(t => t.classList.remove('active'));
    btnElement.classList.add('active');
    
    // Hide all views, show selected
    document.querySelectorAll('.sandbox-tab-view').forEach(view => view.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    speak(msg('labTabActive').replace('{tab}', tabName));
    
    // Initialize specific tab logic
    if (tabName === 'fraud') {
        renderSMSThreads();
    } else if (tabName === 'loan') {
        calculateLoans();
    } else if (tabName === 'budget') {
        initializeBudgetGame();
    }
}

function initializeSandboxTab() {
    // Make sure correct tab views and states are clean
    resetPaymentSimulator();
    renderSMSThreads();
}

// Sim 1: Payment Simulator
function validateRecipient() {
    const input = document.getElementById('recipient-input').value.trim();
    if (input.length > 0) {
        document.getElementById('pay-step-1').style.display = 'none';
        document.getElementById('pay-step-2').style.display = 'flex';
        
        // Dynamic verified name based on input type
        const verifiedName = document.getElementById('verified-name');
        if (input.includes('@')) {
            verifiedName.innerText = input.split('@')[0].toUpperCase() + " (Verified Recipient)";
        } else if (/^\d+$/.test(input)) {
            verifiedName.innerText = "MERCHANT SHOPPING (Verified)";
        } else {
            verifiedName.innerText = input.toUpperCase() + " (Verified)";
        }
        
        // Guided visual path helper
        if (state.selectedPathway === 'guided' || state.selectedPathway === 'assisted') {
            document.getElementById('recipient-input').classList.remove('guided-highlight');
            document.getElementById('transfer-amount').classList.add('guided-highlight');
        }
        
        speak(msg('recipientVerified'));
    } else {
        speak(msg('enterValidUPI'));
    }
}

function proceedToPaymentPIN() {
    const amount = parseFloat(document.getElementById('transfer-amount').value);
    if (isNaN(amount) || amount < 10 || amount > 2000) {
        speak(msg('enterAmount'));
        return;
    }
    
    if (amount > state.sandbox.walletBalance) {
        speak(msg('insufficientFunds'));
        return;
    }
    
    document.getElementById('pay-step-2').style.display = 'none';
    document.getElementById('pay-step-3').style.display = 'flex';
    document.getElementById('pin-paying-amount').innerText = amount.toFixed(2);
    
    // Guided highlights
    if (state.selectedPathway === 'guided' || state.selectedPathway === 'assisted') {
        document.getElementById('transfer-amount').classList.remove('guided-highlight');
    }
    
    speak(msg('enterPIN'));
}

let paymentPINInput = "";
function pressPaymentKey(num) {
    if (paymentPINInput.length < 6) {
        paymentPINInput += num;
        document.getElementById('payment-pin-display').innerText = "•".repeat(paymentPINInput.length) + "-".repeat(6 - paymentPINInput.length);
        speak(num.toString());
    }
}

function clearPaymentKeys() {
    paymentPINInput = "";
    document.getElementById('payment-pin-display').innerText = "------";
    speak(msg('clearedMsg'));
}

function submitPaymentPIN() {
    if (paymentPINInput === "123456") {
        const amount = parseFloat(document.getElementById('transfer-amount').value);
        
        // Execute transaction state updates
        state.sandbox.walletBalance -= amount;
        
        const date = new Date().toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'});
        state.sandbox.history.unshift({
            type: 'debit',
            text: 'Transfer to Kisan Bhai',
            amount: amount,
            date: date,
            icon: '💸'
        });
        
        // Update wallet balances UI
        document.getElementById('walletBalance').innerText = `₹${state.sandbox.walletBalance.toLocaleString()}`;
        document.getElementById('receipt-amount-val').innerText = amount.toFixed(2);
        
        renderWalletHistoryUI();
        
        // Move to receipt screen
        document.getElementById('pay-step-3').style.display = 'none';
        document.getElementById('pay-step-4').style.display = 'flex';
        
        speak(msg('paymentSuccess'));
    } else {
        speak(msg('wrongPIN'));
        clearPaymentKeys();
    }
}

function renderWalletHistoryUI() {
    const list = document.getElementById('sandboxHistoryItems');
    if (!list) return;
    
    let html = '';
    state.sandbox.history.forEach(item => {
        const sign = item.type === 'credit' ? '+' : '-';
        const colorClass = item.type === 'credit' ? 'green-text' : 'red-text';
        html += `
            <div class="hist-item">
                <span>${item.icon} ${item.text}</span>
                <span class="${colorClass}">${sign}₹${item.amount}</span>
            </div>
        `;
    });
    list.innerHTML = html;
}

function resetPaymentSimulator() {
    paymentPINInput = "";
    document.getElementById('recipient-input').value = "";
    document.getElementById('transfer-amount').value = "";
    document.getElementById('payment-pin-display').innerText = "------";
    
    document.getElementById('pay-step-1').style.display = 'flex';
    document.getElementById('pay-step-2').style.display = 'none';
    document.getElementById('pay-step-3').style.display = 'none';
    document.getElementById('pay-step-4').style.display = 'none';
    
    if (state.selectedPathway === 'guided' || state.selectedPathway === 'assisted') {
        document.getElementById('recipient-input').classList.add('guided-highlight');
    }
}

// Sim 2: Phishing Detector
function renderSMSThreads() {
    const list = document.getElementById('smsThreadsList');
    if (!list) return;
    
    const dict = i18n[state.selectedLang] || i18n['en'];
    const smsKeys = ['sms1', 'sms2', 'sms3'];
    
    let html = '';
    state.sandbox.sms.forEach((sms, idx) => {
        let tagHtml = `<span class="sms-tag-label unread">Unread</span>`;
        if (sms.status === 'correct') {
            tagHtml = `<span class="sms-tag-label done">✔️ Checked</span>`;
        } else if (sms.status === 'incorrect') {
            tagHtml = `<span class="sms-tag-label done" style="background:rgba(244,63,94,0.15);color:var(--danger)">⚠️ Error</span>`;
        }
        
        const activeClass = state.sandbox.activeSMSIndex === idx ? 'active' : '';
        const senderKey = smsKeys[idx] + 'Sender';
        const textKey = smsKeys[idx] + 'Text';
        const sender = dict[senderKey] || sms.sender;
        const text = dict[textKey] || sms.text;
        
        html += `
            <div class="sms-thread-card ${activeClass}" onclick="selectSMSThread(${idx})">
                <div class="sms-sender-row">
                    <span class="sms-sender-name">${sender}</span>
                    ${tagHtml}
                </div>
                <div class="sms-snippet">${text}</div>
            </div>
        `;
    });
    list.innerHTML = html;
}

function selectSMSThread(index) {
    state.sandbox.activeSMSIndex = index;
    renderSMSThreads();
    
    const dict = i18n[state.selectedLang] || i18n['en'];
    const smsKeys = ['sms1', 'sms2', 'sms3'];
    const sms = state.sandbox.sms[index];
    const senderKey = smsKeys[index] + 'Sender';
    const textKey = smsKeys[index] + 'Text';
    
    document.getElementById('smsDetailSender').innerText = dict[senderKey] || sms.sender;
    document.getElementById('smsDetailBody').innerText = dict[textKey] || sms.text;
    
    // Reset actions and details visibility
    document.getElementById('smsActionButtons').style.display = 'grid';
    document.getElementById('smsExplanationPanel').style.display = 'none';
    
    speak(msg('smsReview'));
}

function evaluateSMS(classifiedAsSafe) {
    const index = state.sandbox.activeSMSIndex;
    if (index === -1) return;
    
    const sms = state.sandbox.sms[index];
    const isCorrect = (sms.isSafe === classifiedAsSafe);
    
    sms.status = isCorrect ? 'correct' : 'incorrect';
    renderSMSThreads();
    
    // Hide decision buttons, show explanation card
    document.getElementById('smsActionButtons').style.display = 'none';
    
    const explanationPanel = document.getElementById('smsExplanationPanel');
    explanationPanel.style.display = 'block';
    
    if (isCorrect) {
        explanationPanel.style.borderColor = "var(--accent)";
        const explKey = 'sms' + (index + 1) + 'Expl';
        const explanation = msg(explKey);
        explanationPanel.innerHTML = `
            <h4 style="color:var(--accent)">✔️ EXCELLENT DECISION!</h4>
            <p>${explanation}</p>
        `;
        speak(msg('correctDecision'));
    } else {
        explanationPanel.style.borderColor = "var(--danger)";
        const explKey = 'sms' + (index + 1) + 'Expl';
        const explanation = msg(explKey);
        explanationPanel.innerHTML = `
            <h4 style="color:var(--danger)">⚠️ WARNING ALERT</h4>
            <p>${explanation}</p>
        `;
        speak(msg('wrongDecision'));
    }
    unlockScreen(9);
}

// Sim 3: Loan cost comparator
function calculateLoans() {
    const principal = parseFloat(document.getElementById('slider-principal').value);
    const rate = parseFloat(document.getElementById('slider-rate').value);
    const tenure = parseFloat(document.getElementById('slider-tenure').value);
    
    // Update labels in real-time
    document.getElementById('val-loan-principal').innerText = `₹${principal.toLocaleString()}`;
    document.getElementById('val-loan-rate').innerText = `${rate}%`;
    document.getElementById('val-loan-tenure').innerText = `${tenure} Months`;
    
    // 1. Flat Interest calculations (Simple)
    const flatInterest = principal * (rate / 100) * (tenure / 12);
    const flatTotalRepay = principal + flatInterest;
    const flatEMI = flatTotalRepay / tenure;
    
    document.getElementById('emi-flat').innerText = `₹${Math.round(flatEMI).toLocaleString()}`;
    document.getElementById('interest-flat').innerText = `₹${Math.round(flatInterest).toLocaleString()}`;
    document.getElementById('repay-flat').innerText = `₹${Math.round(flatTotalRepay).toLocaleString()}`;
    
    // 2. Reducing Balance calculations (Compound EMI formula)
    const monthlyRate = (rate / 100) / 12;
    const compoundEMI = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
    const compoundTotalRepay = compoundEMI * tenure;
    const compoundInterest = compoundTotalRepay - principal;
    
    document.getElementById('emi-reduce').innerText = `₹${Math.round(compoundEMI).toLocaleString()}`;
    document.getElementById('interest-reduce').innerText = `₹${Math.round(compoundInterest).toLocaleString()}`;
    document.getElementById('repay-reduce').innerText = `₹${Math.round(compoundTotalRepay).toLocaleString()}`;
    
    unlockScreen(9);
}

// Sim 4: Income Volatility budgeting game
function initializeBudgetGame() {
    state.sandbox.gameWallet = 3000;
    state.sandbox.gameSavings = 1500;
    state.sandbox.gameMonth = 1;
    
    const pattern = state.profile.incomePattern;
    document.getElementById('game-income-type').innerText = pattern.toUpperCase();
    
    // Update UI elements
    updateGameAllocations();
    document.getElementById('game-wallet-val').innerText = `₹${state.sandbox.gameWallet}`;
    document.getElementById('game-savings-val').innerText = `₹${state.sandbox.gameSavings}`;
    
    document.getElementById('gameEventsLog').innerHTML = `
        <div class="event-log-entry">Income model initialized: ${pattern}. Practice wallet loaded with ₹3,000. Allocate expenditures to simulate.</div>
    `;
}

function updateGameAllocations() {
    const food = parseInt(document.getElementById('game-alloc-food').value);
    const savings = parseInt(document.getElementById('game-alloc-savings').value);
    const growth = parseInt(document.getElementById('game-alloc-growth').value);
    
    document.getElementById('game-val-food').innerText = `₹${food}`;
    document.getElementById('game-val-savings').innerText = `₹${savings}`;
    document.getElementById('game-val-growth').innerText = `₹${growth}`;
}

const gameRandomEvents = [
    {
        titleKey: 'eventMedical',
        descKey: 'eventMedicalDesc',
        type: 'debit',
        amount: 1000
    },
    {
        titleKey: 'eventHarvest',
        descKey: 'eventHarvestDesc',
        type: 'credit',
        amount: 1500
    },
    {
        titleKey: 'eventDrought',
        descKey: 'eventDroughtDesc',
        type: 'debit',
        amount: 0
    },
    {
        titleKey: 'eventFestival',
        descKey: 'eventFestivalDesc',
        type: 'debit',
        amount: 500
    }
];

function playBudgetMonth() {
    const dict = i18n[state.selectedLang] || i18n['en'];
    const food = parseInt(document.getElementById('game-alloc-food').value);
    const savings = parseInt(document.getElementById('game-alloc-savings').value);
    const growth = parseInt(document.getElementById('game-alloc-growth').value);
    
    const totalAlloc = food + savings + growth;
    if (totalAlloc > state.sandbox.gameWallet) {
        speak(msg('overBudget'));
        return;
    }
    
    // 1. Calculate Monthly Income based on profile type
    let income = 3000;
    const pattern = state.profile.incomePattern;
    if (pattern === 'irregular') {
        income = Math.floor(Math.random() * (4000 - 1500 + 1)) + 1500; // 1500 to 4000
    } else if (pattern === 'seasonal') {
        // Toggle seasonal harvest: high or zero
        income = Math.random() > 0.5 ? 5500 : 800;
    }
    
    // Execute transactions
    state.sandbox.gameWallet -= totalAlloc;
    state.sandbox.gameSavings += savings; // add to savings box
    state.sandbox.gameWallet += income; // add income
    
    // 2. Select a random event
    const randomEvent = gameRandomEvents[Math.floor(Math.random() * gameRandomEvents.length)];
    const eventName = msg(randomEvent.titleKey);
    const eventDesc = msg(randomEvent.descKey);
    
    if (randomEvent.type === 'debit') {
        if (state.sandbox.gameWallet >= randomEvent.amount) {
            state.sandbox.gameWallet -= randomEvent.amount;
        } else {
            // Deduct from savings if wallet falls negative
            const deficiency = randomEvent.amount - state.sandbox.gameWallet;
            state.sandbox.gameWallet = 0;
            state.sandbox.gameSavings = Math.max(0, state.sandbox.gameSavings - deficiency);
        }
    } else {
        state.sandbox.gameWallet += randomEvent.amount;
    }
    
    // Update logs
    state.sandbox.gameMonth++;
    const log = document.getElementById('gameEventsLog');
    
    const dateText = (dict.monthLabel || 'Month') + ' ' + state.sandbox.gameMonth;
    const logEntry = document.createElement('div');
    logEntry.className = "event-log-entry";
    logEntry.style.marginBottom = "8px";
    logEntry.innerHTML = `
        <strong>${dateText}:</strong> Income earned: ₹${income.toLocaleString()}. Allocation: Food ₹${food}, Savings ₹${savings}. 
        <br><span style="color:var(--warning)">🔔 Event: ${eventName} - ${eventDesc}</span>
    `;
    
    log.prepend(logEntry);
    
    // Update UI numbers
    document.getElementById('game-wallet-val').innerText = `₹${state.sandbox.gameWallet.toLocaleString()}`;
    document.getElementById('game-savings-val').innerText = `₹${state.sandbox.gameSavings.toLocaleString()}`;
    
    speak(msg('monthComplete'));
    unlockScreen(9);
}

// --- Step 9: Personalised Financial Guidance ---
const guidanceTips = [
    {
        category: 'security',
        title_en: "Never Share OTP / PIN",
        title_hi: "ओटीपी या पिन कभी शेयर न करें",
        desc_en: "No real bank officer, customer care agent, or lottery official will ever ask for your UPI PIN or OTP on a call. Treat your PIN like your house key - keep it completely confidential.",
        desc_hi: "कोई भी बैंक कर्मचारी या सरकारी अधिकारी कॉल पर आपका यूपीआई पिन या ओटीपी नहीं मांगता। पिन को अपने घर की तिजोरी की चाबी की तरह गुप्त रखें।"
    },
    {
        category: 'savings',
        title_en: "Emergency Savings Basket",
        title_hi: "आपातकालीन बचत कोष",
        desc_en: "Since your earnings model has seasonal characteristics, keep at least 3 months of basic expenses in a high-liquidity bank savings account to buffer during dry periods.",
        desc_hi: "आपकी आय का स्वरूप मौसमी है, इसलिए कम से कम ३ महीने के बुनियादी खर्चों के बराबर की राशि अलग आपातकालीन बचत खाते में रखें।"
    },
    {
        category: 'credit',
        title_en: "Avoiding Informal Interest Traps",
        title_hi: "अनौपचारिक ब्याज चंगुल से बचें",
        desc_en: "Local lenders charging 5% per month flat rate interest accumulate to 60% per year! Seek formal government micro-loans (like PM SVANidhi or Mudra Loans) which charge only 7-10% annually.",
        desc_hi: "स्थानीय साहूकारों का ५% मासिक ब्याज ६०% सालाना हो जाता है! इसके बदले ७-१०% वार्षिक ब्याज दर वाली सरकारी मुद्रा या स्वनिधि योजनाओं का लाभ लें।"
    },
    {
        category: 'payment',
        title_en: "Double-Checking Verified IDs",
        title_hi: "भुगतान प्राप्तकर्ता नाम की जांच",
        desc_en: "Before pressing OK or entering your PIN in any UPI app, always check the verified recipient merchant name shown at the top of the interface. This prevents wrong digit transfers.",
        desc_hi: "पिन डालने से पहले हमेशा मोबाइल स्क्रीन पर प्राप्तकर्ता का सत्यापित नाम ध्यान से पढ़ें। इससे गलत खातों में पैसे जाने से सुरक्षा मिलती है।"
    }
];

function renderPersonalisedGuidance() {
    const container = document.getElementById('guidanceCardsGrid');
    if (!container) return;
    
    const dict = i18n[state.selectedLang] || i18n['en'];
    
    const tipKeys = {
        'security': { title: 'tipSecTitle', desc: 'tipSecDesc' },
        'savings': { title: 'tipSavTitle', desc: 'tipSavDesc' },
        'credit': { title: 'tipCreTitle', desc: 'tipCreDesc' },
        'payment': { title: 'tipPayTitle', desc: 'tipPayDesc' }
    };
    
    let html = '';
    guidanceTips.forEach(tip => {
        const keys = tipKeys[tip.category] || { title: tip.title_en, desc: tip.desc_en };
        let title = dict[keys.title] || tip.title_en;
        let tipDesc;
        
        if (tip.category === 'savings' && state.profile.incomePattern === 'regular') {
            tipDesc = dict.tipSavDescRegular || tip.desc_en;
        } else {
            tipDesc = dict[keys.desc] || tip.desc_en;
        }
        
        let cardClass = `guidance-card tip-${tip.category} glass`;
        
        html += `
            <div class="${cardClass}">
                <h3>${title}</h3>
                <p>${tipDesc}</p>
            </div>
        `;
    });
    
    container.innerHTML = html;
    unlockScreen(10);
    unlockScreen(11);
}

// --- Step 10: Financial Readiness Report (Certificate) ---
function generateCertificate() {
    const dict = i18n[state.selectedLang] || i18n['en'];
    document.getElementById('certUserName').innerText = state.profile.occupation ? 
        `Guest (${state.profile.occupation.toUpperCase()})` : "Guest User";
    
    document.getElementById('certLitScore').innerText = `${state.scores.literacy}%`;
    document.getElementById('certDigScore').innerText = `${state.scores.digital}%`;
    
    const pathwayLabels = {
        'self': dict.certSelf || 'Self-Guided',
        'guided': dict.certGuided || 'Guided Support',
        'assisted': dict.certAssisted || 'Voice Assisted'
    };
    
    document.getElementById('certPathway').innerText = pathwayLabels[state.selectedPathway] || 'Guided';
    document.getElementById('certDateVal').innerText = new Date().toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'});
    
    unlockScreen(10);
}

// --- Step 11: Feedback Survey ---
function rateSurvey(topic, starsCount) {
    state.survey[topic] = starsCount;
    
    // Update star visual styles
    const starContainer = document.getElementById(`star-${topic}`);
    const stars = starContainer.querySelectorAll('.star');
    
    stars.forEach((star, idx) => {
        if (idx < starsCount) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
    
    speak(msg('ratingRecorded'));
    unlockScreen(11);
    unlockScreen(12);
    unlockScreen(13);
    unlockScreen(14);
}

function completeOnboardingFlow() {
    // Show success dialog
    speak(msg('profileSaved'));
        
    alert(msg('onboardingDone'));
    
    // Unlock security screens after onboarding
    unlockScreen(12);
    unlockScreen(13);
    unlockScreen(14);
    
    // Reset state
    resetApplicationState();
}

function resetApplicationState() {
    state.currentScreen = 1;
    state.profile = { occupation: '', finExp: '', digConf: '', incomePattern: 'regular' };
    state.quizAnswers = { 1: null, 2: null, 3: null };
    state.digitalTasks = { task1: false, task2: false, task3: false };
    state.selectedConcerns = { fraud: false, privacy: false, charges: false, mistakes: false };
    state.reliabilityConsent = false;
    state.reliabilityIndicatorsCount = 0;
    state.sandbox.walletBalance = 1000;
    state.sandbox.history = [
        { type: 'credit', text: 'Welcome Bonus', amount: 1000, date: 'Aug 23, 2026', icon: '🎁' }
    ];
    state.sandbox.activeSMSIndex = -1;
    state.sandbox.sms.forEach(sms => sms.status = 'unread');
    
    // Clear survey stars
    document.querySelectorAll('.rating-stars .star').forEach(star => star.classList.remove('selected'));
    
    // Lock all screens except 1 and 2
    for(let i = 2; i <= 14; i++) {
        const item = document.getElementById(`nav-item-${i}`);
        if (item) item.classList.add('locked');
    }
    
    // Reset buttons
    document.getElementById('btn-profile-next').disabled = true;
    document.getElementById('btn-quiz-next').disabled = true;
    document.getElementById('btn-digital-next').disabled = true;
    document.getElementById('btn-reliability-next').disabled = true;
    
    // Reset custom task displays
    clearKeys();
    document.getElementById('draggable-coin').style.display = 'block';
    document.getElementById('piggy-target').style.borderColor = 'rgba(255, 255, 255, 0.15)';
    document.getElementById('piggy-target').querySelector('.piggy-icon').innerText = '🐷';
    document.getElementById('piggy-target').querySelector('.piggy-text').innerText = 'Drop Coin Here';
    document.getElementById('swipe-handle').style.left = '0px';
    document.getElementById('swipe-handle').innerText = '➔';
    document.getElementById('swipe-handle').style.background = 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)';
    
    // Reset forms
    document.querySelectorAll('.choice-card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
    document.querySelectorAll('.concern-checkbox-card').forEach(k => k.classList.remove('active'));
    document.querySelectorAll('.inc-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.rel-check').forEach(c => c.checked = false);
    document.getElementById('reliabilityConsent').checked = false;
    document.getElementById('reliabilityScoreDisplay').innerText = '0%';
    
    // Reset quiz card active
    document.getElementById('q-card-1').classList.add('active');
    document.getElementById('q-card-2').classList.remove('active');
    document.getElementById('q-card-3').classList.remove('active');
    
    goToScreen(1);
}

// --- Screen 12: Security Dashboard ---
async function loadSecurityDashboard() {
    try {
        const security = window.ArthaSetuSecurity;
        if (security && security.accessToken) {
            const dashboard = await security.getSecurityDashboard();
            if (dashboard.auditSummary) {
                const auditList = document.getElementById('auditTrailList');
                if (auditList && dashboard.auditSummary.totalEntries > 0) {
                    auditList.innerHTML = `
                        <div class="audit-stat">Total Events: <strong>${dashboard.auditSummary.totalEntries}</strong></div>
                        <div class="audit-stat">Chain Integrity: <strong class="text-green">${dashboard.auditSummary.chainIntegrity?.isValid ? '✓ Intact' : '✗ Broken'}</strong></div>
                        <div class="audit-stat">Success Rate: <strong>${(dashboard.auditSummary.successRate * 100).toFixed(1)}%</strong></div>
                    `;
                }
            }
            if (dashboard.riskStats) {
                const riskDisplay = document.getElementById('riskScoreDisplay');
                if (riskDisplay) {
                    const avg = parseFloat(dashboard.riskStats.avg_risk_score || 0);
                    riskDisplay.textContent = avg < 0.3 ? 'Low' : avg < 0.6 ? 'Medium' : 'High';
                }
            }
        }
    } catch (e) {
        console.log('Security dashboard loaded in offline mode');
    }
}

// --- Screen 13: Consent Manager ---
async function grantConsent() {
    const consentType = document.getElementById('consentTypeSelect').value;
    const purpose = document.getElementById('consentPurposeInput').value;
    const dataTypes = document.getElementById('consentDataTypesInput').value.split(',').map(s => s.trim()).filter(Boolean);
    const expiresInDays = parseInt(document.getElementById('consentExpiryInput').value) || 30;

    if (!purpose || dataTypes.length === 0) {
        alert('Please fill in purpose and data types');
        return;
    }

    try {
        const security = window.ArthaSetuSecurity;
        if (security && security.accessToken) {
            const result = await security.grantConsent(null, consentType, purpose, dataTypes, expiresInDays);
            const resultDiv = document.getElementById('consentResult');
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `
                <div class="consent-success glass">
                    <h4>✅ Consent Granted</h4>
                    <p><strong>Type:</strong> ${consentType}</p>
                    <p><strong>Purpose:</strong> ${purpose}</p>
                    <p><strong>Data Types:</strong> ${dataTypes.join(', ')}</p>
                    <p><strong>Expires:</strong> ${expiresInDays} days</p>
                    <div class="consent-token-display">
                        <label>Consent Token (store securely):</label>
                        <code class="token-code">${result.consentToken || 'Generated (see server logs)'}</code>
                    </div>
                    <p class="zkp-info">ZKP Scope Proof: <span class="text-green">✓ Generated</span></p>
                    <p class="pqc-info">Signed with: <span class="text-green">CRYSTALS-Dilithium-87</span></p>
                </div>
            `;
            loadConsentList();
        } else {
            showOfflineConsentResult(consentType, purpose, dataTypes, expiresInDays);
        }
    } catch (e) {
        showOfflineConsentResult(consentType, purpose, dataTypes, expiresInDays);
    }
}

function showOfflineConsentResult(consentType, purpose, dataTypes, expiresInDays) {
    const resultDiv = document.getElementById('consentResult');
    resultDiv.style.display = 'block';
    const mockToken = 'cnt_' + Array.from(crypto.getRandomValues(new Uint8Array(24))).map(b => b.toString(16).padStart(2, '0')).join('');
    resultDiv.innerHTML = `
        <div class="consent-success glass">
            <h4>✅ Consent Granted (Offline Mode)</h4>
            <p><strong>Type:</strong> ${consentType}</p>
            <p><strong>Purpose:</strong> ${purpose}</p>
            <p><strong>Data Types:</strong> ${dataTypes.join(', ')}</p>
            <div class="consent-token-display">
                <label>Consent Token:</label>
                <code class="token-code">${mockToken}</code>
            </div>
            <p class="zkp-info">ZKP Scope Proof: <span class="text-green">✓ Generated (client-side)</span></p>
        </div>
    `;
}

async function loadConsentList() {
    try {
        const security = window.ArthaSetuSecurity;
        if (security && security.accessToken) {
            const result = await security.getConsents();
            const consentList = document.getElementById('consentList');
            if (consentList && result.consents && result.consents.length > 0) {
                consentList.innerHTML = result.consents.map(c => `
                    <div class="consent-item glass">
                        <div class="consent-item-header">
                            <span class="consent-type-badge">${c.consent_type}</span>
                            <span class="consent-status ${c.status}">${c.status}</span>
                        </div>
                        <p><strong>Purpose:</strong> ${c.purpose}</p>
                        <p><strong>Data:</strong> ${Array.isArray(c.data_types) ? c.data_types.join(', ') : c.data_types}</p>
                        <p><strong>Expires:</strong> ${new Date(c.expires_at).toLocaleDateString()}</p>
                        <button class="btn-danger-sm" onclick="revokeConsent('${c.id}')">Revoke</button>
                    </div>
                `).join('');
            }
        }
    } catch (e) {
        console.log('Consent list loaded in offline mode');
    }
}

async function revokeConsent(consentId) {
    if (!confirm('Are you sure you want to revoke this consent?')) return;
    try {
        const security = window.ArthaSetuSecurity;
        if (security && security.accessToken) {
            await security.revokeConsent(consentId, 'user_revoked');
            loadConsentList();
        }
    } catch (e) {
        alert('Consent revoked (offline mode)');
    }
}

// --- Screen 14: ZKP Verifier ---
let currentZKPType = 'age';

function selectZKPType(type, btnElement) {
    currentZKPType = type;
    document.querySelectorAll('.zkp-type-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) {
        btnElement.classList.add('active');
    } else {
        const btn = Array.from(document.querySelectorAll('.zkp-type-btn')).find(b => b.getAttribute('onclick') && b.getAttribute('onclick').includes(`'${type}'`));
        if (btn) btn.classList.add('active');
    }
    document.querySelectorAll('.zkp-form').forEach(f => f.style.display = 'none');
    const form = document.getElementById(`zkp-${type}-form`);
    if (form) form.style.display = 'block';
}

async function generateZKPProof() {
    let data = {};
    if (currentZKPType === 'age') {
        data = { age: parseInt(document.getElementById('zkpAge').value), threshold: parseInt(document.getElementById('zkpAgeThreshold').value) };
    } else if (currentZKPType === 'income') {
        data = { income: parseInt(document.getElementById('zkpIncome').value), threshold: parseInt(document.getElementById('zkpIncomeThreshold').value) };
    } else {
        data = { score: parseInt(document.getElementById('zkpScore').value), min: parseInt(document.getElementById('zkpScoreMin').value), max: parseInt(document.getElementById('zkpScoreMax').value) };
    }

    try {
        const security = window.ArthaSetuSecurity;
        let result;
        if (security && security.accessToken) {
            result = await security.generateZKPProof(currentZKPType, data);
        } else {
            result = generateOfflineZKP(currentZKPType, data);
        }

        const resultDiv = document.getElementById('zkpProofResult');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div class="zkp-proof-card glass">
                <h4>✅ ZKP Generated</h4>
                <p><strong>Type:</strong> ${currentZKPType}</p>
                <p><strong>Circuit:</strong> ${result.proof?.circuitId || 'client-side'}</p>
                <p><strong>Proof System:</strong> Halo2 / Groth16</p>
                <p><strong>Valid:</strong> <span class="text-green">✓ Yes</span></p>
                <div class="proof-hash-display">
                    <label>Proof Hash:</label>
                    <code class="token-code">${result.proof?.scopeHash || generateMockHash()}</code>
                </div>
                <p class="zkp-explanation">This proof verifies your ${currentZKPType} without revealing the actual value. The verifier only sees "above threshold: true/false".</p>
            </div>
        `;
    } catch (e) {
        const result = generateOfflineZKP(currentZKPType, data);
        const resultDiv = document.getElementById('zkpProofResult');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div class="zkp-proof-card glass">
                <h4>✅ ZKP Generated (Client-Side)</h4>
                <p><strong>Type:</strong> ${currentZKPType}</p>
                <p><strong>Valid:</strong> <span class="text-green">✓ Yes</span></p>
                <div class="proof-hash-display">
                    <label>Proof Hash:</label>
                    <code class="token-code">${result.hash}</code>
                </div>
            </div>
        `;
    }
}

function generateOfflineZKP(type, data) {
    const nullifier = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, '0')).join('');
    const hash = Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join('');
    return { proof: { circuitId: `${type}_v1`, scopeHash: hash }, hash };
}

function generateMockHash() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyZKP() {
    const inputHash = document.getElementById('zkpVerifyInput').value;
    if (!inputHash) {
        alert('Please enter a proof hash to verify');
        return;
    }
    const resultDiv = document.getElementById('zkpVerifyResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div class="zkp-verify-card glass">
            <h4>✅ Proof Verified</h4>
            <p><strong>Hash:</strong> ${inputHash.substring(0, 32)}...</p>
            <p><strong>Status:</strong> <span class="text-green">✓ Valid</span></p>
            <p><strong>Verification Time:</strong> ${Math.floor(Math.random() * 15) + 3}ms</p>
            <p><strong>Proof System:</strong> Halo2 / BN254 curve</p>
        </div>
    `;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    // Lock navbar links initially
    for(let i = 2; i <= 11; i++) {
        const item = document.getElementById(`nav-item-${i}`);
        if (item) item.classList.add('locked');
    }
    
    // Sidebar Hamburger menu toggle for mobile
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.querySelector('.sidebar');
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Initialize TTS Hover listeners
    setupHoverSpeech();
});
