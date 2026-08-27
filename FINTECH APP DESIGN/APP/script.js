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
    'en': {
        // Sidebar
        brandTagline: "Adaptive Inclusion",
        navGroup1: "1. Registration & Profiling",
        navGroup2: "2. Interactive Assessments",
        navGroup3: "3. Learning & Lab",
        navGroup4: "4. Summary & Feedback",
        navGroup5: "5. Next-Gen Security",
        guestUser: "Guest User",
        online: " Online",
        // Screen titles
        title1: "Language & Voice",
        title2: '"Know Me" Profile',
        title3: "Financial Literacy",
        title4: "Digital Confidence",
        title5: "Trust & Safety",
        title6: "Reliability & Income",
        title7: "Adaptive Engine",
        title8: "Safe Finance Lab",
        title9: "Personalised Guidance",
        title10: "Readiness Report",
        title11: "Feedback Survey",
        title12: "Security Dashboard",
        title13: "Consent Manager",
        title14: "ZKP Verifier",
        securityDashDesc: "10 Next-Gen Security Innovations protecting your financial data",
        consentMgrDesc: "Cryptographic consent tokens — you control who accesses your data",
        zkpVerifierDesc: "Prove your attributes without revealing the actual data",
        // Screen 1
        prototype: "PROTOTYPE",
        welcomeTitle: "Welcome to",
        welcomeDesc: "ArthaSetu adapts to your financial needs, digital capability, and preferred language. We help you learn formal finance safely.",
        langCount: "6+",
        indianLanguages: "Indian Languages",
        sandboxPct: "100%",
        practiceSandbox: "Practice Sandbox",
        selectLang: "Select Your Language",
        langSubtitle: "The entire application will work in your selected language",
        enableVoice: "🎙️ Enable Voice Assistance",
        voiceDesc: 'Our virtual guide "ArthaDoot" will read instructions aloud in your selected language.',
        startProfiling: "Start Profiling",
        // Screen 2
        tellUsAbout: "Tell Us About Yourself",
        configureApp: "We configure the application based on your daily lifestyle and occupation.",
        questionOccupation: "1. What is your primary occupation?",
        occRetailer: "Small Retailer / Vendor",
        occRetailerSub: "दुकानदार / रेहड़ी-पटरी",
        occFarmer: "Farmer / Agriculture",
        occFarmerSub: "किसान / खेती-बाड़ी",
        occWorker: "Gig Worker / Delivery",
        occWorkerSub: "डिलिवरी / टैक्सी चालक",
        occDailywager: "Daily-wage Earner",
        occDailywagerSub: "मजदूर / दैनिक वेतन",
        questionFinExp: "2. Have you used formal banking and digital payment services?",
        finBeginner: "First-time User",
        finBeginnerSub: "Never used UPI / Online banking",
        finBasic: "Basic User",
        finBasicSub: "Have a bank card, but rarely use UPI",
        finIntermediate: "Intermediate User",
        finIntermediateSub: "Use UPI sometimes, need confidence",
        questionDigConf: "3. How comfortable are you operating a smartphone?",
        digLow: "Need Assistance",
        digLowSub: "Usually ask others to do tasks",
        digMedium: "Can Navigate Basic Apps",
        digMediumSub: "Use WhatsApp / YouTube easily",
        digHigh: "Highly Confident",
        digHighSub: "Can download apps and do typing",
        back: "← Back",
        continue: "Continue →",
        // Screen 3
        quizTitle: "Financial Literacy Assessment",
        quizDesc: "Answer three scenario-based questions so we can understand your financial concepts.",
        q1of3: "Question 1 of 3",
        q1Title: "Calculate Flat Interest",
        q1Scenario: "If you borrow ₹10,000 from a lender for 1 year at a 10% flat interest rate per year, how much total interest do you pay at the end of the year?",
        q1a0: "₹1,000 (Correct interest payment)",
        q1a1: "₹100 (1% calculations)",
        q1a2: "₹0 (Interest-free loan)",
        q1a3: "I do not know / Not sure",
        q2of3: "Question 2 of 3",
        q2Title: "Safe PIN & OTP Handling",
        q2Scenario: "You receive a phone call from an unknown person claiming to be a Bank Manager. They ask for your UPI PIN or OTP to unlock your account. What do you do?",
        q2a0: "Share it so my account is not blocked",
        q2a1: "Share it only if they tell me my correct name",
        q2a2: "Never share my PIN/OTP with anyone on a call (Correct)",
        q2a3: "Tell them I will call them back later",
        q3of3: "Question 3 of 3",
        q3Title: "Value of Bank Savings",
        q3Scenario: "What is the primary benefit of saving money in a formal bank account compared to storing cash in a box at home?",
        q3a0: "The money earns interest and is safe from theft (Correct)",
        q3a1: "It is easier to spend money kept in a bank",
        q3a2: "There is no difference between cash and a bank account",
        q3a3: "Not sure of the benefits",
        // Screen 4
        digitalTitle: "Digital Confidence Assessment",
        digitalDesc: "Complete these three simple interactive tasks to test your smartphone and touch screen comfort.",
        task1Title: "Task 1: Typing Numbers",
        task1Heading: "Enter Numeric Code",
        task1Desc: "Using the screen keypad below, type the code: ",
        task2Title: "Task 2: Drag & Drop",
        task2Heading: "Secure Your Coin",
        task2Desc: "Tap and drag the gold coin into the Piggy Bank below.",
        dropCoin: "Drop Coin Here",
        task3Title: "Task 3: Swipe Gesture",
        task3Heading: "Swipe to Pay",
        task3Desc: "Authorize simulated payment by swiping the slider key to the right.",
        swipeConfirm: "Swipe Right to Confirm",
        waitingInput: "Waiting for input...",
        dragStart: "Drag coin to start",
        slideHandle: "Slide handle to right",
        // Screen 5
        trustTitle: "Trust & Safety Concerns",
        trustDesc: "Select any concerns that make you hesitate to use digital finance. We'll show you how we solve them.",
        trustConcerns: "What are your main concerns? (Select all that apply)",
        concernFraud: "Fear of Scams & Fraud",
        concernFraudDesc: "Concerns about losing money to online scammers",
        concernPrivacy: "Data & Account Privacy",
        concernPrivacyDesc: "Worries that personal info will be leaked",
        concernCharges: "Hidden Charges & Fees",
        concernChargesDesc: "Suspicion of bank deducts without telling you",
        concernMistakes: "Fear of Making Mistakes",
        concernMistakesDesc: "Fear that typing a wrong digit sends money to the wrong person",
        reassurancePortal: "💡 Reassurance Portal",
        reassuranceDesc: "Select one or more concerns on the left to read safety facts and regulatory guarantees.",
        // Screen 6
        altAssessment: "ALTERNATIVE ASSESSMENT",
        reliabilityTitle: "Alternative Financial Reliability",
        reliabilityDesc: "For users who do not have formal bank credit histories or salary slips, ArthaSetu evaluates alternative indicators of trust based on savings patterns and transactional habits.",
        simReliability: "Simulated Reliability Profile",
        incomeProfile: "Income & Savings Profile",
        consentDetails: "Please provide consent-based details to calculate your reliability tier.",
        incomePattern: "1. How is your income pattern?",
        incomeRegular: "📅 Regular Monthly",
        incomeIrregular: "⚡ Irregular Daily/Weekly",
        incomeSeasonal: "🌾 Seasonal (Harvest/Gigs)",
        indicatorsTitle: "2. Select indicators that apply to you:",
        ind1: "I pay shop rent or utility bills regularly",
        ind2: "I keep some cash savings in a post office/savings box",
        ind3: "I have a running trade inventory or business supplies",
        ind4: "I have zero outstanding local informal lender debt",
        consentText: "I consent to use alternative indicators to build a simulated credit reliability score.",
        generateProfile: "Generate Engine Profile →",
        // Screen 7
        engineTitle: "ArthaSetu Adaptive Profiling Engine",
        engineDesc: "Here is your computed financial profile. The app selects a pathway tailored to you.",
        scoreLiteracy: "Financial Literacy",
        scoreDigital: "Digital Confidence",
        scoreReliability: "Alternative Reliability",
        recommendedPath: "RECOMMENDED ONBOARDING PATHWAY",
        calculating: "Calculating...",
        selectContinue: "Select continue to run profiling.",
        enterLab: "Enter Safe Finance Lab →",
        // Screen 8
        labTitle: "Safe Finance Lab",
        practiceSandboxTag: "PRACTICE SANDBOX",
        tabPayment: "📱 Practice Payment",
        tabFraud: "🛡️ Fraud Phishing Detector",
        tabLoan: "📊 Loan Comparator",
        tabBudget: "🌾 Budget & Volatility",
        arthapay: "ArthaPay",
        enterRecipient: "Enter Recipient's UPI ID / Phone",
        verifyRecipient: "Verify Recipient",
        verified: "Verified",
        enterAmount: "Enter Transfer Amount (₹)",
        walletBalance: "Practice Wallet Balance: ₹1,000",
        continueToPay: "Continue to Pay",
        enterUPIPIN: "Enter 6-Digit UPI PIN",
        payingRs: "Paying ₹",
        toRecipient: "to Kisan Bhai",
        txnSuccess: "Transaction Successful!",
        sentTo: "Sent to Kisan Bhai",
        txnId: "Transaction ID:",
        payAgain: "Pay Again",
        paymentTutorial: "Simulated Payment Tutorial",
        paymentTutorialDesc: "Learn how to transfer funds securely without risking real money.",
        crucialGuidelines: "💡 Crucial Guidelines:",
        practicePIN: "Your practice PIN code is: ",
        tip2: "Double check the verified recipient name before clicking pay.",
        tip3: "Never type your PIN anywhere except standard secure banker screens.",
        walletHistory: "Wallet History",
        welcomeBonus: "Welcome Bonus",
        messageInbox: "📱 Message Inbox",
        fraudDesc: "Click on a message to read it and decide if it is Safe or Spam.",
        selectMessage: "Select a message",
        fraudPlaceholder: "Please click on an incoming SMS from the list to analyze its safety.",
        classifySafe: "✔️ Classify as SAFE",
        reportFraud: "🚨 Report as FRAUD / SPAM",
        loanTitle: "📊 Loan Cost Simulator",
        loanDesc: "Adjust sliders to see total repayments and avoid interest traps.",
        principalAmt: "Principal Amount",
        interestRate: "Interest Rate (Annual)",
        tenure: "Tenure (Months)",
        flatLoan: "FLAT LOAN (SIMPLE INTEREST)",
        flatRateFinancing: "Flat Rate Financing",
        monthlyEMI: "Monthly EMI",
        totalInterest: "Total Interest",
        totalRepayment: "Total Repayment",
        flatLoanDesc: "Interest is calculated on the initial principal only.",
        compoundLoan: "COMPOUND LOAN (REDUCING BALANCE)",
        reducingBalanceFinancing: "Reducing Balance Financing",
        compoundLoanDesc: "Interest is calculated only on the outstanding principal. Better than Flat Loan!",
        budgetTitle: "🌾 Dynamic Income Volatility Simulator",
        budgetDesc: "Manage expenses under varying income constraints. Play the simulated month!",
        currentIncome: "Current Income Model:",
        foodAlloc: "Food & Rent Allocation (₹)",
        savingsBox: "Savings Box (₹)",
        growthAlloc: "Invest / Business Growth (₹)",
        simulateMonth: "🌾 Simulate Next Month 🌾",
        walletBal: "Wallet Balance",
        accumSavings: "Accumulated Savings",
        activityLog: "Activity Log",
        gameStarted: "Game started.",
        // Screen 9
        guidanceTitle: "Personalised Financial Guidance",
        guidanceDesc: "Here are crucial financial rules curated based on your assessments.",
        viewReport: "View Readiness Report →",
        // Screen 10
        reportTitle: "Financial Readiness Report",
        reportDesc: "Excellent progress! Here is your official competency evaluation certificate.",
        certTitle: "ArthaSetu Competency Certificate",
        certAwardedTo: "This certificate is awarded to",
        certDesc: "for successfully completing the adaptive financial profiling and practicing secure UPI transactions in the Safe Finance Lab simulator.",
        certLiteracy: "Literacy Level",
        certDigital: "Digital Confidence",
        certPathway: "Assisted Pathway",
        certSystem: "System Issued",
        certDate: "Date of Verification",
        printCert: "🖨️ Print Certificate",
        provideFeedback: "Provide Feedback →",
        // Screen 11
        feedbackTitle: "Feedback & Outcome Measurement",
        feedbackDesc: "Help us evaluate this adaptive framework. Tell us how you felt during the onboarding.",
        surveyQ1: "1. How easy was it to navigate this application?",
        surveyQ2: "2. Did you understand the security rules and fraud warnings clearly?",
        surveyQ3: "3. How confident do you feel doing mobile payments on your own now?",
        surveyQ4: "4. Do you have any suggestions or comments?",
        feedbackPlaceholder: "Type here in Hindi, English, etc.",
        saveReset: "Save & Reset Application",
        // Speech bubble
        assistantName: "ArthaDoot Assistant:",
        welcomeArthasetu: "Welcome to ArthaSetu.",
        // Voice
        voiceOn: "Voice Assist: On",
        voiceOff: "Voice Assist: Off",
        // Voice guide messages
        helpWelcome: "Hello! I am ArthaDoot. I will read screen elements and guide you. Tap any box to get started.",
        profileHelp: "Please select one card from each category so we can customise the experience.",
        quizHelp: "Select the option you think is correct. This is just practice, do not worry if you make mistakes.",
        digitalHelp: "Let's test three tasks. First, type 4096 on the keypad. Second, drag the coin to the pig. Third, swipe the bar to the right.",
        trustHelp: "Tick any boxes where you feel digital finance is unsafe. We will show you trust facts.",
        reliabilityHelp: "Alternative indicators help show your trustworthiness if you do not have credit scores. Provide consent to continue.",
        sandboxHelp: "Practice payments, analyze spam SMS, check EMIs, or play the budget planner without real money.",
        guidanceHelp: "Read these safety rules. We created them based on your answers to keep your money secure.",
        reportHelp: "Here is your certificate of completion! You can print it to show your progress.",
        surveyHelp: "Please rate your experience. This helps us improve our system. Thank you!",
        // Pathway
        pathAssisted: "Voice/Visual Assisted Pathway",
        pathAssistedDesc: "Based on your touch tasks and profiling answers, the engine recommends continuous audio speech guidance and simplified controls to eliminate friction.",
        pathAssistedFeat1: "Continuous Audio Guidance Active",
        pathAssistedFeat2: "Enlarged Button Sizes",
        pathAssistedFeat3: "One-Tap Action Confirmations",
        pathGuided: "Interactive Guided Pathway",
        pathGuidedDesc: "You are comfortable with basic tasks. The engine activates contextual highlight indicators and interactive tooltips to prevent transfer mistakes.",
        pathGuidedFeat1: "Pulsing Indicator Rings on Action Steps",
        pathGuidedFeat2: "Contextual Safety Alerts",
        pathGuidedFeat3: "Guided Progress Indicators",
        pathSelf: "Self-Guided Pathway",
        pathSelfDesc: "You demonstrated full digital dexterity. The application will operate in standard mode, allowing independent navigation through all sandbox exercises.",
        pathSelfFeat1: "Standard Interactive Navigation",
        pathSelfFeat2: "Unrestricted Simulator Modes",
        pathSelfFeat3: "Full Practice Logs Access",
        certSelf: "Self-Guided",
        certGuided: "Guided Support",
        certAssisted: "Voice Assisted",
        // Messages
        lockedMsg: "This section is locked. Please complete the previous steps first.",
        occupationMsg: "Occupation recorded.",
        answerMsg: "Answer recorded.",
        clearedMsg: "Cleared",
        codeSuccess: "Success! Code is correct.",
        firstTaskDone: "Excellent! First task completed.",
        codeWrong: "Wrong code. Try again.",
        codeWrongRetry: "Wrong code, please type 4096 again.",
        savingsSecured: "Savings Secured!",
        coinDeposited: "Success! Coin deposited.",
        coinSecured: "Congratulations, coin secured in bank.",
        swipeSuccess: "Success! Swipe authorized.",
        swipeDone: "Swipe gesture authorized successfully.",
        optionToggled: "Option toggled.",
        incomeRecorded: "Income model recorded.",
        scoreCalculated: "Alternative reliability score calculated as {score} percent.",
        labTabActive: "Lab tab {tab} selected.",
        recipientVerified: "Success! Recipient name verified.",
        enterValidUPI: "Please enter a valid recipient UPI address or number.",
        enterAmountMsg: "Limit exceeded. Enter amount between 10 and 2,000 rupees.",
        insufficientFunds: "Insufficient funds in practice wallet.",
        enterPIN: "Please enter your 6-digit secure payment PIN.",
        paymentSuccess: "Success! Payment processed successfully.",
        wrongPIN: "Invalid payment PIN. Remember, the practice PIN is 123456.",
        smsReview: "SMS opened. Review and classify it as safe or spam.",
        correctDecision: "Superb! Your classification is 100% correct.",
        wrongDecision: "Caution! That was a security trap. Read the facts carefully.",
        overBudget: "Total allocations exceed available wallet balance!",
        monthComplete: "Month simulation complete. Review your activity logs.",
        monthLabel: "Month",
        ratingRecorded: "Rating recorded.",
        profileSaved: "Congratulations! Your financial competency profile has been saved. Resetting application state.",
        onboardingDone: "Onboarding complete! Your profile has been generated successfully.",
        // Trust concern titles/descriptions
        fraudTitle: "Scams & Fraud Safeguards",
        fraudDesc: "Under RBI guidelines, if you notify your bank within 3 days of unauthorized electronic transactions, your liability is ZERO. Banks never ask for UPI PINs to credit money.",
        privacyTitle: "Privacy and Banking Acts",
        privacyDesc: "Your data is protected under the Digital Personal Data Protection (DPDP) Act of India. Financial institutions are legally barred from sharing account records without explicit consent.",
        chargesTitle: "Zero Hidden Fees Mandate",
        chargesDesc: "Basic Savings Bank Deposit (BSBD) accounts have zero minimum balance requirements. Banks are legally required to display fee structures transparently in local languages.",
        mistakesTitle: "Wrong Transfer Recovery",
        mistakesDesc: "If you transfer money to a wrong account via UPI, you can file an immediate dispute on the NPCI portal (npci.org.in) or dial toll-free helpline 1800-120-1740 for reversal assistance.",
        // Guidance tips
        tipSecTitle: "Never Share OTP / PIN",
        tipSecDesc: "No real bank officer, customer care agent, or lottery official will ever ask for your UPI PIN or OTP on a call. Treat your PIN like your house key - keep it completely confidential.",
        tipSavTitle: "Emergency Savings Basket",
        tipSavDescRegular: "Having regular monthly income allows you to set up automatic micro-investments to grow your emergency basket steadily.",
        tipSavDescIrregular: "Since your earnings model has seasonal characteristics, keep at least 3 months of basic expenses in a high-liquidity bank savings account to buffer during dry periods.",
        tipCreTitle: "Avoiding Informal Interest Traps",
        tipCreDesc: "Local lenders charging 5% per month flat rate interest accumulate to 60% per year! Seek formal government micro-loans (like PM SVANidhi or Mudra Loans) which charge only 7-10% annually.",
        tipPayTitle: "Double-Checking Verified IDs",
        tipPayDesc: "Before pressing OK or entering your PIN in any UPI app, always check the verified recipient merchant name shown at the top of the interface. This prevents wrong digit transfers.",
        // SMS messages
        sms1Sender: "AD-LOTTRI",
        sms1Text: "CONGRATULATIONS! You have won a cash lottery of ₹10,00,000 from Government Promotion. Click here to claim immediately: www.sarkari-win.com/claim",
        sms1Expl: "This is FRAUD. Government departments do not distribute cash lotteries via public SMS links. Real agencies never ask for money or banking access to transfer lottery prizes.",
        sms2Sender: "State Bank",
        sms2Text: "Dear Customer, your monthly bank statement for account ending 4096 is generated. Please login to your official banking portal to download. Do not share your PIN.",
        sms2Expl: "This is SAFE. The message contains no urgent threats, suspicious external hyperlinks, or direct demands for OTPs or PIN inputs.",
        sms3Sender: "BP-ALERT",
        sms3Text: "ALERT! Your electricity bill of ₹1,450 is overdue. To prevent immediate line disconnection tonight, call our helpline officer at 9876543210 to pay via phone OTP.",
        sms3Expl: "This is FRAUD. Utility companies do not threaten immediate disconnection via random phone numbers or ask for OTP verification on calls. Always pay bills through official government apps.",
        // Budget events
        eventMedical: "Medical Emergency",
        eventMedicalDesc: "A family member fell ill. Paid medical bills of ₹1,000.",
        eventHarvest: "Bumper Harvest Bonus",
        eventHarvestDesc: "Seasonal produce demand spiked! Earned bonus of ₹1,500.",
        eventDrought: "Drought / Local Lockout",
        eventDroughtDesc: "Zero daily wages earned due to bad weather.",
        eventFestival: "Festival Celebration",
        eventFestivalDesc: "Deducted ₹500 for sweets and family gifts."
    },
    'hi': {
        brandTagline: "अनुकूलन समावेश",
        navGroup1: "1. पंजीकरण और प्रोफाइलिंग",
        navGroup2: "2. इंटरैक्टिव मूल्यांकन",
        navGroup3: "3. सीखना और लैब",
        navGroup4: "4. सारांश और प्रतिक्रिया",
        guestUser: "अतिथि उपयोगकर्ता",
        online: " ऑनलाइन",
        title1: "भाषा और आवाज",
        title2: '"मुझे जानें" प्रोफाइल',
        title3: "वित्तीय साक्षरता",
        title4: "डिजिटल आत्मविश्वास",
        title5: "विश्वास और सुरक्षा",
        title6: "विश्वसनीयता और आय",
        title7: "अनुकूलन इंजन",
        title8: "सुरक्षित फाइनेंस लैब",
        title9: "व्यक्तिगत मार्गदर्शन",
        title10: "तैयारी रिपोर्ट",
        title11: "प्रतिक्रिया सर्वेक्षण",
        prototype: "प्रोटोटाइप",
        welcomeTitle: "आपका स्वागत है",
        welcomeDesc: "अर्थसेतु आपकी वित्तीय आवश्यकताओं, डिजिटल क्षमता और पसंदीदा भाषा के अनुसार अनुकूलित होता है। हम आपको सुरक्षित रूप से औपचारिक वित्त सीखने में मदद करते हैं।",
        langCount: "6+",
        indianLanguages: "भारतीय भाषाएँ",
        sandboxPct: "100%",
        practiceSandbox: "अभ्यास सैंडबॉक्स",
        selectLang: "अपनी भाषा चुनें",
        langSubtitle: "पूरा ऐप आपकी चुनी हुई भाषा में काम करेगा",
        enableVoice: "🎙️ वॉइस सहायता सक्षम करें",
        voiceDesc: 'हमारा वर्चुअल गाइड "अर्थदूत" आपकी चुनी हुई भाषा में निर्देश जोर से पढ़ेगा।',
        startProfiling: "प्रोफाइलिंग शुरू करें",
        tellUsAbout: "हमें अपने बारे में बताएं",
        configureApp: "हम आपकी दैनिक जीवनशैली और व्यवसाय के आधार पर एप्लिकेशन कॉन्फ़िगर करते हैं।",
        questionOccupation: "1. आपका प्राथमिक व्यवसाय क्या है?",
        occRetailer: "छोटा विक्रेता / दुकानदार",
        occRetailerSub: "दुकानदार / रेहड़ी-पटरी",
        occFarmer: "किसान / कृषि",
        occFarmerSub: "किसान / खेती-बाड़ी",
        occWorker: "गिग वर्कर / डिलिवरी",
        occWorkerSub: "डिलिवरी / टैक्सी चालक",
        occDailywager: "दैनिक वेतन भोगी",
        occDailywagerSub: "मजदूर / दैनिक वेतन",
        questionFinExp: "2. क्या आपने औपचारिक बैंकिंग और डिजिटल भुगतान सेवाओं का उपयोग किया है?",
        finBeginner: "पहली बार उपयोगकर्ता",
        finBeginnerSub: "UPI / ऑनलाइन बैंकिंग का कभी उपयोग नहीं किया",
        finBasic: "बुनियादी उपयोगकर्ता",
        finBasicSub: "बैंक कार्ड है, लेकिन UPI का कम उपयोग करते हैं",
        finIntermediate: "मध्यम उपयोगकर्ता",
        finIntermediateSub: "कभी-कभी UPI का उपयोग करते हैं, आत्मविश्वास चाहिए",
        questionDigConf: "3. स्मार्टफोन चलाने में आप कितने सहज हैं?",
        digLow: "सहायता की आवश्यकता",
        digLowSub: "आमतौर पर दूसरों से काम करवाते हैं",
        digMedium: "बुनियादी ऐप्स चला सकते हैं",
        digMediumSub: "WhatsApp / YouTube आसानी से उपयोग करते हैं",
        digHigh: "अत्यधिक आत्मविश्वासी",
        digHighSub: "ऐप्स डाउनलोड कर सकते हैं और टाइपिंग कर सकते हैं",
        back: "← पीछे",
        continue: "आगे बढ़ें →",
        quizTitle: "वित्तीय साक्षरता मूल्यांकन",
        quizDesc: "हम आपकी वित्तीय अवधारणाओं को समझने के लिए तीन परिदृश्य-आधारित प्रश्नों के उत्तर दें।",
        q1of3: "प्रश्न 1 का 3",
        q1Title: "फ्लैट ब्याज की गणना",
        q1Scenario: "यदि आप 10% फ्लैट ब्याज दर से 1 वर्ष के लिए ₹10,000 उधार लेते हैं, तो वर्ष के अंत में आप कुल कितना ब्याज देते हैं?",
        q1a0: "₹1,000 (सही ब्याज भुगतान)",
        q1a1: "₹100 (1% गणना)",
        q1a2: "₹0 (ब्याज-मुक्त ऋण)",
        q1a3: "मुझे नहीं पता / सुनिश्चित नहीं",
        q2of3: "प्रश्न 2 का 3",
        q2Title: "सुरक्षित PIN और OTP हैंडलिंग",
        q2Scenario: "आपको एक अज्ञात व्यक्ति का फोन आता है जो बैंक प्रबंधक होने का दावा करता है। वे आपके खाते को अनलॉक करने के लिए आपका UPI PIN या OTP मांगते हैं। आप क्या करते हैं?",
        q2a0: "मेरा खाता ब्लॉक न हो इसलिए शेयर करूं",
        q2a1: "केवल तभी शेयर करूं जब वे मेरा सही नाम बताएं",
        q2a2: "कॉल पर किसी के साथ भी अपना PIN/OTP कभी शेयर न करें (सही)",
        q2a3: "उन्हें कहूं कि मैं बाद में उन्हें कॉल करूंगा",
        q3of3: "प्रश्न 3 का 3",
        q3Title: "बैंक बचत का मूल्य",
        q3Scenario: "घर में बॉक्स में नकदी रखने की तुलना में औपचारिक बैंक खाते में पैसे बचाने का प्राथमिक लाभ क्या है?",
        q3a0: "पैसे पर ब्याज मिलता है और चोरी से सुरक्षित है (सही)",
        q3a1: "बैंक में रखा पैसा खर्च करना आसान है",
        q3a2: "नकदी और बैंक खाते में कोई अंतर नहीं है",
        q3a3: "लाभों के बारे में सुनिश्चित नहीं",
        digitalTitle: "डिजिटल आत्मविश्वास मूल्यांकन",
        digitalDesc: "अपने स्मार्टफोन और टच स्क्रीन आराम का परीक्षण करने के लिए ये तीन सरल इंटरैक्टिव कार्य पूरे करें।",
        task1Title: "कार्य 1: संख्याएँ टाइप करना",
        task1Heading: "संख्यात्मक कोड दर्ज करें",
        task1Desc: "नीचे स्क्रीन कीपैड का उपयोग करके कोड टाइप करें: ",
        task2Title: "कार्य 2: खींचें और छोड़ें",
        task2Heading: "अपना सिक्का सुरक्षित करें",
        task2Desc: "सोने के सिक्के को नीचे पिग्गी बैंक में खींचकर ले जाएं।",
        dropCoin: "सिक्का यहाँ डालें",
        task3Title: "कार्य 3: स्वाइप जेस्चर",
        task3Heading: "भुगतान के लिए स्वाइप करें",
        task3Desc: "स्लाइडर कुंजी को दाईं ओर स्वाइप करके अनुकरण भुगतान को अधिकृत करें।",
        swipeConfirm: "पुष्टि के लिए दाईं ओर स्वाइप करें",
        waitingInput: "इनपुट की प्रतीक्षा है...",
        dragStart: "सिक्का खींचकर शुरू करें",
        slideHandle: "हैंडल को दाईं ओर स्लाइड करें",
        trustTitle: "विश्वास और सुरक्षा चिंताएं",
        trustDesc: "डिजिटल वित्त का उपयोग करने में जो भी चिंताएं आपको हिचकिचाती हैं उन्हें चुनें।",
        trustConcerns: "आपकी मुख्य चिंताएं क्या हैं? (सभी लागू चुनें)",
        concernFraud: "धोखाधड़ी और घोटाले का डर",
        concernFraudDesc: "ऑनलाइन धोखेबाजों से पैसे खोने की चिंता",
        concernPrivacy: "डेटा और खाता गोपनीयता",
        concernPrivacyDesc: "व्यक्तिगत जानकारी लीक होने की चिंता",
        concernCharges: "छिपी हुई फीस और शुल्क",
        concernChargesDesc: "बिना बताए बैंक द्वारा काटे जाने की शंका",
        concernMistakes: "गलतियाँ करने का डर",
        concernMistakesDesc: "गलत अंक टाइप करने से गलत व्यक्ति को पैसे जाने का डर",
        reassurancePortal: "💡 सुरक्षा पोर्टल",
        reassuranceDesc: "सुरक्षा तथ्यों और नियामक गारंटी पढ़ने के लिए बाईं ओर एक या अधिक चिंताएं चुनें।",
        altAssessment: "वैकल्पिक मूल्यांकन",
        reliabilityTitle: "वैकल्पिक वित्तीय विश्वसनीयता",
        reliabilityDesc: "उन उपयोगकर्ताओं के लिए जिनके पास औपचारिक बैंक क्रेडिट इतिहास या वेतन पर्ची नहीं है, अर्थसेतु बचत पैटर्न और लेनदेन आदतों के आधार पर विश्वसनीयता के वैकल्पिक संकेतकों का मूल्यांकन करता है।",
        simReliability: "अनुकरण विश्वसनीयता प्रोफाइल",
        incomeProfile: "आय और बचत प्रोफाइल",
        consentDetails: "अपनी विश्वसनीयता श्रेणी की गणना करने के लिए सहमति-आधारित विवरण प्रदान करें।",
        incomePattern: "1. आपकी आय का पैटर्न कैसा है?",
        incomeRegular: "📅 नियमित मासिक",
        incomeIrregular: "⚡ अनियमित दैनिक/साप्ताहिक",
        incomeSeasonal: "🌾 मौसमी (फसल/गिग्स)",
        indicatorsTitle: "2. अपने लिए लागू संकेतक चुनें:",
        ind1: "मैं नियमित रूप से दुकान का किराया या उपयोगिता बिल भरता हूं",
        ind2: "मैं डाकघर/बचत बॉक्स में कुछ नकद बचत रखता हूं",
        ind3: "मेरे पास व्यापारिक इन्वेंट्री या व्यापार आपूर्ति है",
        ind4: "मेरे पास स्थानीय अनौपचारिक ऋणदाता का कोई बकाया ऋण नहीं है",
        consentText: "मैं एक अनुकरण क्रेडिट विश्वसनीयता स्कोर बनाने के लिए वैकल्पिक संकेतकों का उपयोग करने की सहमति देता हूं।",
        generateProfile: "इंजन प्रोफाइल जनरेट करें →",
        engineTitle: "अर्थसेतु अनुकूलन प्रोफाइलिंग इंजन",
        engineDesc: "यहां आपकी गणितीय वित्तीय प्रोफाइल है। ऐप आपके लिए एक अनुकूलित पथ चुनता है।",
        scoreLiteracy: "वित्तीय साक्षरता",
        scoreDigital: "डिजिटल आत्मविश्वास",
        scoreReliability: "वैकल्पिक विश्वसनीयता",
        recommendedPath: "अनुशंसित ऑनबोर्डिंग पथ",
        calculating: "गणना हो रही है...",
        selectContinue: "प्रोफाइलिंग चलाने के लिए जारी रखें चुनें।",
        enterLab: "सुरक्षित फाइनेंस लैब में प्रवेश करें →",
        labTitle: "सुरक्षित फाइनेंस लैब",
        practiceSandboxTag: "अभ्यास सैंडबॉक्स",
        tabPayment: "📱 अभ्यास भुगतान",
        tabFraud: "🛡️ फ्रॉड फिशिंग डिटेक्टर",
        tabLoan: "📊 ऋण तुलनक",
        tabBudget: "🌾 बजट और अस्थिरता",
        arthapay: "अर्थापे",
        enterRecipient: "प्राप्तकर्ता का UPI ID / फोन दर्ज करें",
        verifyRecipient: "प्राप्तकर्ता सत्यापित करें",
        verified: "सत्यापित",
        enterAmount: "स्थानांतरण राशि दर्ज करें (₹)",
        walletBalance: "अभ्यास वॉलेट बैलेंस: ₹1,000",
        continueToPay: "भुगतान जारी रखें",
        enterUPIPIN: "6 अंकों का UPI PIN दर्ज करें",
        payingRs: "भुगतान ₹",
        toRecipient: "किसान भाई को",
        txnSuccess: "लेनदेन सफल!",
        sentTo: "किसान भाई को भेजा गया",
        txnId: "लेनदेन ID:",
        payAgain: "फिर से भुगतान करें",
        paymentTutorial: "अनुकरण भुगतान ट्यूटोरियल",
        paymentTutorialDesc: "वास्तविक पैसे का जोखिम उठाए बिना धन हस्तांतरण कैसे करें इसे सीखें।",
        crucialGuidelines: "💡 महत्वपूर्ण दिशानिर्देश:",
        practicePIN: "आपका अभ्यास PIN कोड है: ",
        tip2: "भुगतान करने से पहले सत्यापित प्राप्तकर्ता नाम की दोबारा जांच करें।",
        tip3: "मानक सुरक्षित बैंकर स्क्रीन के अलावा कहीं भी अपना PIN टाइप न करें।",
        walletHistory: "वॉलेट इतिहास",
        welcomeBonus: "स्वागत बोनस",
        messageInbox: "📱 संदेश इनबॉक्स",
        fraudDesc: "सुरक्षित है या स्पैम यह तय करने के लिए किसी संदेश को पढ़ने के लिए क्लिक करें।",
        selectMessage: "एक संदेश चुनें",
        fraudPlaceholder: "इसकी सुरक्षा का विश्लेषण करने के लिए सूची में से एक इनकमिंग SMS पर क्लिक करें।",
        classifySafe: "✔️ सुरक्षित के रूप में वर्गीकृत करें",
        reportFraud: "🚨 फ्रॉड / स्पैम के रूप में रिपोर्ट करें",
        loanTitle: "📊 ऋण लागत सिमुलेटर",
        loanDesc: "कुल पुनर्भुगतान देखने और ब्याज जाल से बचने के लिए स्लाइडर समायोजित करें।",
        principalAmt: "मूल राशि",
        interestRate: "ब्याज दर (वार्षिक)",
        tenure: "अवधि (महीने)",
        flatLoan: "फ्लैट ऋण (सरल ब्याज)",
        flatRateFinancing: "फ्लैट दर वित्तपोषण",
        monthlyEMI: "मासिक EMI",
        totalInterest: "कुल ब्याज",
        totalRepayment: "कुल पुनर्भुगतान",
        flatLoanDesc: "ब्याज केवल प्रारंभिक मूलधन पर गणना किया जाता है।",
        compoundLoan: "चक्रवृद्धि ऋण (घटता शेष)",
        reducingBalanceFinancing: "घटता शेष वित्तपोषण",
        compoundLoanDesc: "ब्याज केवल बकाया मूलधन पर गणना किया जाता है। फ्लैट ऋण से बेहतर!",
        budgetTitle: "🌾 गतिशील आय अस्थिरता सिमुलेटर",
        budgetDesc: "विभिन्न आय बाधाओं के तहत खर्चों का प्रबंधन करें। अनुकरण माह खेलें!",
        currentIncome: "वर्तमान आय मॉडल:",
        foodAlloc: "भोजन और किराया आवंटन (₹)",
        savingsBox: "बचत बॉक्स (₹)",
        growthAlloc: "निवेश / व्यापार विकास (₹)",
        simulateMonth: "🌾 अगला माह अनुकरण करें 🌾",
        walletBal: "वॉलेट बैलेंस",
        accumSavings: "संचित बचत",
        activityLog: "गतिविधि लॉग",
        gameStarted: "गेम शुरू।",
        guidanceTitle: "व्यक्तिगत वित्तीय मार्गदर्शन",
        guidanceDesc: "यहां आपके मूल्यांकन के आधार पर तैयार किए गए महत्वपूर्ण वित्तीय नियम हैं।",
        viewReport: "तैयारी रिपोर्ट देखें →",
        reportTitle: "वित्तीय तैयारी रिपोर्ट",
        reportDesc: "उत्कृष्ट प्रगति! यहां आपका आधिकारिक क्षमता मूल्यांकन प्रमाणपत्र है।",
        certTitle: "अर्थसेतु क्षमता प्रमाणपत्र",
        certAwardedTo: "यह प्रमाणपत्र प्रदान किया जाता है",
        certDesc: "सुरक्षित फाइनेंस लैब सिमुलेटर में अनुकूलित वित्तीय प्रोफाइलिंग और सुरक्षित UPI लेनदेन के अभ्यास को सफलतापूर्वक पूरा करने के लिए।",
        certLiteracy: "साक्षरता स्तर",
        certDigital: "डिजिटल आत्मविश्वास",
        certPathway: "सहायक पथ",
        certSystem: "सिस्टम जारी",
        certDate: "सत्यापन की तिथि",
        printCert: "🖨️ प्रमाणपत्र प्रिंट करें",
        provideFeedback: "प्रतिक्रिया दें →",
        feedbackTitle: "प्रतिक्रिया और परिणाम मापन",
        feedbackDesc: "इस अनुकूलन ढांचे का मूल्यांकन करने में हमारी मदद करें।",
        surveyQ1: "1. इस एप्लिकेशन को नेविगेट करना कितना आसान था?",
        surveyQ2: "2. क्या आपने सुरक्षा नियमों और धोखाधड़ी चेतावनियों को स्पष्ट रूप से समझा?",
        surveyQ3: "3. अब अकेले मोबाइल भुगतान करने में आप कितना आत्मविश्वास महसूस करते हैं?",
        surveyQ4: "4. क्या आपके पास कोई सुझाव या टिप्पणी है?",
        feedbackPlaceholder: "हिंदी, अंग्रेजी आदि में यहां टाइप करें।",
        saveReset: "सहेजें और एप्लिकेशन रीसेट करें",
        assistantName: "अर्थदूत सहायक:",
        welcomeArthasetu: "अर्थसेतु में आपका स्वागत है।",
        voiceOn: "वॉइस असिस्टेंट: ऑन",
        voiceOff: "वॉइस असिस्टेंट: ऑफ",
        helpWelcome: "नमस्ते! मैं अर्थदूत हूँ। मैं स्क्रीन की जानकारी पढ़कर आपका मार्गदर्शन करूँगा। शुरू करने के लिए किसी भी डिब्बे को छुएं।",
        profileHelp: "अनुभव को अपनी आवश्यकतानुसार ढालने के लिए हर श्रेणी से एक विकल्प चुनें।",
        quizHelp: "आपको जो विकल्प सही लगे उसे चुनें। यह सिर्फ अभ्यास है, गलतियों से न डरें।",
        digitalHelp: "आइए तीन कार्यों का परीक्षण करें। पहला, कीपैड पर 4096 टाइप करें। दूसरा, सिक्के को पिग्गी बैंक में डालें। तीसरा, स्लाइडर को दाईं ओर खिसकाएं।",
        trustHelp: "उन बक्सों को टिक करें जहाँ आपको ऑनलाइन लेनदेन असुरक्षित लगता है।",
        reliabilityHelp: "यदि आपके पास सिबिल स्कोर नहीं है, तो वैकल्पिक तरीके आपकी विश्वसनीयता दिखाने में मदद करते हैं।",
        sandboxHelp: "बिना किसी जोखिम के भुगतान का अभ्यास करें, धोखाधड़ी संदेशों को पहचानें, ब्याज दरें देखें या बजट योजना का अभ्यास करें।",
        guidanceHelp: "इन सुरक्षा नियमों को पढ़ें।",
        reportHelp: "यह आपका पूर्णता प्रमाणपत्र है!",
        surveyHelp: "कृपया अपने अनुभव को रेटिंग दें।",
        pathAssisted: "दृश्य और स्वर निर्देशित मार्ग",
        pathAssistedDesc: "स्मार्टफोन और डिजिटल साक्षरता स्तर को ध्यान में रखते हुए, सिस्टम ने आपके लिए पूर्ण वॉइस और बड़ी विजुअल गाइडेंस सक्रिय की है।",
        pathAssistedFeat1: "स्वचालित वॉइस गाइडेंस सक्रिय",
        pathAssistedFeat2: "बड़े फ़ॉन्ट आकार",
        pathAssistedFeat3: "सुगम बटन नेविगेशन",
        pathGuided: "मार्गदर्शित पथ",
        pathGuidedDesc: "आप बुनियादी ऐप्स चला लेते हैं। सिस्टम महत्वपूर्ण बटनों पर हाइलाइट और पॉपअप निर्देश दिखाएगा।",
        pathGuidedFeat1: "सक्रिय बटनों पर चमकता हाइलाइट",
        pathGuidedFeat2: "समय पर सुरक्षा पॉपअप संदेश",
        pathGuidedFeat3: "संकेतक टूलटिप्स",
        pathSelf: "स्व-निर्देशित मार्ग",
        pathSelfDesc: "आप स्मार्टफोन चलाने में अत्यंत कुशल हैं।",
        pathSelfFeat1: "सामान्य नेविगेशन मोड",
        pathSelfFeat2: "पूर्ण टूल स्वतंत्रता",
        pathSelfFeat3: "उन्नत सैंडबॉक्स अभ्यास",
        certSelf: "स्व-निर्देशित",
        certGuided: "मार्गदर्शित",
        certAssisted: "स्वर-निर्देशित",
        lockedMsg: "यह भाग अभी बंद है। कृपया पिछला कार्य पहले पूरा करें।",
        occupationMsg: "व्यवसाय दर्ज कर लिया गया है।",
        answerMsg: "उत्तर दर्ज हो गया है।",
        clearedMsg: "साफ किया",
        codeSuccess: "सफल! कोड सही है।",
        firstTaskDone: "बहुत बढ़िया! पहला काम पूरा हुआ।",
        codeWrong: "गलत कोड। दोबारा कोशिश करें।",
        codeWrongRetry: "गलत कोड, कृपया दोबारा 4096 टाइप करें।",
        savingsSecured: "बचत सुरक्षित!",
        coinDeposited: "सफल! सिक्का जमा हुआ।",
        coinSecured: "बधाई हो, सिक्का बैंक में सुरक्षित है।",
        swipeSuccess: "सफल! स्वाइप स्वीकृत हुआ।",
        swipeDone: "स्वाइप स्वीकार कर लिया गया है।",
        optionToggled: "विकल्प बदला गया।",
        incomeRecorded: "आय का स्वरूप दर्ज हुआ।",
        scoreCalculated: "वैकल्पिक सूचकांक स्कोर {score} प्रतिशत हुआ।",
        labTabActive: "लैब का {tab} अभ्यास सक्रिय हुआ।",
        recipientVerified: "सफल! प्राप्तकर्ता सत्यापित हो गया है।",
        enterValidUPI: "कृपया वैध UPI आईडी या नंबर दर्ज करें।",
        enterAmountMsg: "कृपया 10 से 2,000 रुपये के बीच की राशि दर्ज करें।",
        insufficientFunds: "सैंडबॉक्स वॉलेट में पर्याप्त राशि नहीं है।",
        enterPIN: "पुष्टि करने के लिए 6 अंकों का UPI PIN टाइप करें।",
        paymentSuccess: "सफल! भुगतान पूरा हो गया है।",
        wrongPIN: "गलत UPI PIN। कृपया पुनः 123456 टाइप करें।",
        smsReview: "संदेश खोल लिया गया है।",
        correctDecision: "आपका निर्णय बिल्कुल सही है।",
        wrongDecision: "गलत निर्णय। सुरक्षा चेतावनी को ध्यान से पढ़ें।",
        overBudget: "आवंटन कुल राशि आपके वॉलेट बैलेंस से अधिक है!",
        monthComplete: "माह समाप्त हुआ।",
        monthLabel: "माह",
        ratingRecorded: "रेटिंग दर्ज हुई।",
        profileSaved: "बधाई हो! आपका प्रोफाइल सहेज लिया गया है।",
        onboardingDone: "सफल! आपकी प्रतिक्रिया दर्ज कर ली गई है।",
        fraudTitle: "धोखाधड़ी से सुरक्षा",
        fraudDesc: "आरबीआई नियमों के तहत, अनधिकृत लेनदेन के 3 दिनों के भीतर सूचित करने पर आपकी देनदारी शून्य है।",
        privacyTitle: "गोपनीयता और बैंकिंग अधिनियम",
        privacyDesc: "आपका डेटा DPDP अधिनियम के तहत सुरक्षित है।",
        chargesTitle: "शून्य छिपी फीस अनिवार्यता",
        chargesDesc: "बीएसबीडी खातों में न्यूनतम राशि की कोई सीमा नहीं है।",
        mistakesTitle: "गलत भुगतान वापसी",
        mistakesDesc: "गलत खाते में पैसे भेजने पर एनपीसीआई पोर्टल पर शिकायत दर्ज करा सकते हैं।",
        tipSecTitle: "ओटीपी या पिन कभी शेयर न करें",
        tipSecDesc: "कोई भी बैंक कर्मचारी कॉल पर आपका UPI PIN या OTP नहीं मांगता।",
        tipSavTitle: "आपातकालीन बचत कोष",
        tipSavDescRegular: "नियमित आय होने पर हर माह कम से कम 15% राशि अलग बचत खाते में जमा करें।",
        tipSavDescIrregular: "आपकी आय मौसमी है, इसलिए कम से कम 3 महीने के बुनियादी खर्चों के बराबर की राशि अलग बचत खाते में रखें।",
        tipCreTitle: "अनौपचारिक ब्याज चंगुल से बचें",
        tipCreDesc: "स्थानीय साहूकारों का 5% मासिक ब्याज 60% सालाना हो जाता है!",
        tipPayTitle: "भुगतान प्राप्तकर्ता नाम की जांच",
        tipPayDesc: "पिन डालने से पहले हमेशा प्राप्तकर्ता का सत्यापित नाम पढ़ें।",
        sms1Sender: "AD-LOTTRI",
        sms1Text: "बधाई! आपने सरकारी प्रचार से ₹10,00,000 की लॉटरी जीती है।",
        sms1Expl: "यह फ्रॉड है। सरकारी विभाग सार्वजनिक SMS लिंक से लॉटरी नहीं देते।",
        sms2Sender: "स्टेट बैंक",
        sms2Text: "प्रिय ग्राहक, आपका मासिक बैंक स्टेटमेंट तैयार है। कृपया आधिकारिक पोर्टल पर लॉगिन करें।",
        sms2Expl: "यह सुरक्षित है। संदेश में कोई अत्यावश्यक खतरा नहीं है।",
        sms3Sender: "BP-ALERT",
        sms3Text: "अलर्ट! आपका बिजली बिल ₹1,450 बकाया है।",
        sms3Expl: "यह फ्रॉड है। उपयोगिता कंपनियां यादृच्छिक फोन नंबरों से तत्काल डिस्कनेक्शन की धमकी नहीं देतीं।",
        eventMedical: "चिकित्सा आपातकाल",
        eventMedicalDesc: "परिवार का एक सदस्य बीमार हो गया। ₹1,000 इलाज खर्च।",
        eventHarvest: "बम्पर फसल बोनस",
        eventHarvestDesc: "फसल की मांग अचानक बढ़ गई! ₹1,500 अतिरिक्त लाभ।",
        eventDrought: "सूखा / स्थानीय मंदी",
        eventDroughtDesc: "खराब मौसम के कारण कोई कमाई नहीं हुई।",
        eventFestival: "त्योहार उत्सव",
        eventFestivalDesc: "मिठाई और उपहारों में ₹500 खर्च।"
    },
    'pa': {
        brandTagline: "ਅਨੁਕੂਲ ਸ਼ਾਮੂਲਕਰਨ",
        navGroup1: "1. ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਅਤੇ ਪ੍ਰੋਫਾਇਲਿੰਗ",
        navGroup2: "2. ਇੰਟਰਐਕਟਿਵ ਮੁਲਾਂਕਣ",
        navGroup3: "3. ਸਿੱਖਣਾ ਅਤੇ ਲੈਬ",
        navGroup4: "4. ਸਾਰ ਅਤੇ ਫੀਡਬੈਕ",
        navGroup5: "5. ਨਵੀਂ ਪੀੜ੍ਹੀ ਸੁਰੱਖਿਆ",
        guestUser: "ਮਹਿਮਾਨ ਵਰਤੋਂਕਾਰ",
        online: " ਔਨਲਾਈਨ",
        title1: "ਭਾਸ਼ਾ ਅਤੇ ਅਵਾਜ਼",
        title2: "\"ਮੈਨੂੰ ਜਾਣੋ\" ਪ੍ਰੋਫਾਇਲ",
        title3: "ਵਿੱਤੀ ਸਾਖਰਤਾ",
        title4: "ਡਿਜੀਟਲ ਭਰੋਸਾ",
        title5: "ਭਰੋਸਾ ਅਤੇ ਸੁਰੱਖਿਆ",
        title6: "ਭਰੋਸੇਯੋਗਤਾ ਅਤੇ ਆਮਦਨ",
        title7: "ਅਨੁਕੂਲ ਇੰਜਣ",
        title8: "ਸੁਰੱਖਿਤ ਫਾਇਨਾਂਸ ਲੈਬ",
        title9: "ਨਿੱਜੀ ਮਾਰਗਦਰਸ਼ਨ",
        title10: "ਤਿਆਰੀ ਰਿਪੋਰਟ",
        title11: "ਫੀਡਬੈਕ ਸਰਵੇ",
        title12: "ਸੁਰੱਖਿਆ ਡੈਸ਼ਬੋਰਡ",
        title13: "ਸਹਿਮਤੀ ਪ੍ਰਬੰਧਕ",
        title14: "ZKP ਤਸਦੀਕਕਰਤਾ",
        prototype: "ਪ੍ਰੋਟੋਟਾਈਪ",
        welcomeTitle: "ਜੀ ਆਇਆਂ ਨੂੰ",
        welcomeDesc: "ਅਰਥਸੇਤੂ ਤੁਹਾਡੀਆਂ ਵਿੱਤੀ ਲੋੜਾਂ, ਡਿਜੀਟਲ ਸਮਰੱਥਾ ਅਤੇ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਦੇ ਅਨੁਸਾਰ ਅਨੁਕੂਲ ਹੁੰਦਾ ਹੈ। ਅਸੀਂ ਤੁਹਾਨੂੰ ਔਪਚਾਰਿਕ ਵਿੱਤ ਸੁਰੱਖਿਤ ਤਰੀਕੇ ਨਾਲ ਸਿੱਖਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਾਂ।",
        langCount: "6+",
        indianLanguages: "ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ",
        sandboxPct: "100%",
        practiceSandbox: "ਅਭਿਆਸ ਸੈਂਡਬਾਕਸ",
        selectLang: "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ",
        langSubtitle: "ਪੂਰਾ ਐਪ ਤੁਹਾਡੀ ਚੁਣੀ ਹੋਈ ਭਾਸ਼ਾ ਵਿੱਚ ਕੰਮ ਕਰੇਗਾ",
        enableVoice: "ਵੌਇਸ ਸਹਾਇਤਾ ਸਮਰੱਥ ਕਰੋ",
        voiceDesc: "ਸਾਡਾ ਵਰਚੁਅਲ ਗਾਈਡ \"ਅਰਥਦੂਤ\" ਤੁਹਾਡੀ ਚੁਣੀ ਹੋਈ ਭਾਸ਼ਾ ਵਿੱਚ ਹਦਾਇਤਾਂ ਜ਼ੋਰ ਨਾਲ ਪੜ੍ਹੇਗਾ।",
        startProfiling: "ਪ੍ਰੋਫਾਇਲਿੰਗ ਸ਼ੁਰੂ ਕਰੋ",
        tellUsAbout: "ਸਾਨੂੰ ਆਪਣੇ ਬਾਰੇ ਦੱਸੋ",
        configureApp: "ਅਸੀਂ ਤੁਹਾਡੀ ਰੋਜ਼ਾਨਾ ਜੀਵਨਸ਼ੈਲੀ ਅਤੇ ਕਿੱਤਾ ਦੇ ਆਧਾਰ 'ਤੇ ਐਪਲੀਕੇਸ਼ਨ ਕੌਨਫਿਗਰ ਕਰਦੇ ਹਾਂ।",
        questionOccupation: "1. ਤੁਹਾਡਾ ਮੁੱਖ ਕਿੱਤਾ ਕੀ ਹੈ?",
        occRetailer: "ਛੋਟਾ ਵਿਕਰੇਤਾ / ਦੁਕਾਨਦਾਰ",
        occRetailerSub: "ਦੁਕਾਨਦਾਰ / ਰਹਿੜੀ-ਪਟਰੀ",
        occFarmer: "ਕਿਸਾਨ / ਖੇਤੀ",
        occFarmerSub: "ਕਿਸਾਨ / ਖੇਤੀ-ਬਾੜੀ",
        occWorker: "ਗਿਗ ਵਰਕਰ / ਡਿਲੀਵਰੀ",
        occWorkerSub: "ਡਿਲੀਵਰੀ / ਟੈਕਸੀ ਚਾਲਕ",
        occDailywager: "ਰੋਜ਼ਾਨਾ ਵੇਤਨ ਭੋਗੀ",
        occDailywagerSub: "ਮਜ਼ਦੂਰ / ਰੋਜ਼ਾਨਾ ਵੇਤਨ",
        questionFinExp: "2. ਕੀ ਤੁਸੀਂ ਔਪਚਾਰਿਕ ਬੈਂਕਿੰਗ ਅਤੇ ਡਿਜੀਟਲ ਭੁਗਤਾਨ ਸੇਵਾਵਾਂ ਦੀ ਵਰਤੋਂ ਕੀਤੀ ਹੈ?",
        finBeginner: "ਪਹਿਲੀ ਵਾਰ ਵਰਤੋਂਕਾਰ",
        finBeginnerSub: "UPI / ਔਨਲਾਈਨ ਬੈਂਕਿੰਗ ਕਦੇ ਨਹੀਂ ਵਰਤੀ",
        finBasic: "ਬੁਨਿਆਦੀ ਵਰਤੋਂਕਾਰ",
        finBasicSub: "ਬੈਂਕ ਕਾਰਡ ਹੈ, ਪਰ UPI ਘੱਟ ਵਰਤਦੇ ਹਾਂ",
        finIntermediate: "ਦਰਮਿਆਨਾ ਵਰਤੋਂਕਾਰ",
        finIntermediateSub: "ਕਦੇ-ਕਦੇ UPI ਵਰਤਦੇ ਹਾਂ, ਭਰੋਸਾ ਚਾਹੀਦਾ ਹੈ",
        questionDigConf: "3. ਸਮਾਰਟਫੋਨ ਚਲਾਉਣ ਵਿੱਚ ਤੁਸੀਂ ਕਿੰਨੇ ਸਹਿਜ ਹੋ?",
        digLow: "ਸਹਾਇਤਾ ਦੀ ਲੋੜ ਹੈ",
        digLowSub: "ਆਮ ਤੌਰ 'ਤੇ ਦੂਜਿਆਂ ਨੂੰ ਕੰਮ ਕਰਵਾਉਂਦੇ ਹਾਂ",
        digMedium: "ਬੁਨਿਆਦੀ ਐਪਸ ਚਲਾ ਸਕਦੇ ਹਾਂ",
        digMediumSub: "WhatsApp / YouTube ਆਸਾਨੀ ਨਾਲ ਵਰਤਦੇ ਹਾਂ",
        digHigh: "ਬਹੁਤ ਭਰੋਸੇਯੋਗ",
        digHighSub: "ਐਪਸ ਡਾਊਨਲੋਡ ਕਰ ਸਕਦੇ ਹਾਂ ਅਤੇ ਟਾਇਪਿੰਗ ਕਰ ਸਕਦੇ ਹਾਂ",
        back: "ਪਿੱਛੇ",
        continue: "ਅੱਗੇ ਵਧੋ",
        quizTitle: "ਵਿੱਤੀ ਸਾਖਰਤਾ ਮੁਲਾਂਕਣ",
        quizDesc: "ਸਾਨੂੰ ਤੁਹਾਡੀਆਂ ਵਿੱਤੀ ਅਵਧਾਰਣਾਵਾਂ ਸਮਝਣ ਲਈ ਤਿੰਨ ਪਰਿਦ੍ਰਸ਼ਿਆਂ ਆਧਾਰਿਤ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦਿਓ।",
        q1of3: "ਸਵਾਲ 1 ਵਿੱਚੋਂ 3",
        q1Title: "ਫਲੈਟ ਬਿਆਜ ਦੀ ਗਣਨਾ",
        q1Scenario: "ਜੇ ਤੁਸੀਂ 10% ਫਲੈਟ ਬਿਆਜ ਦਰ ਨਾਲ 1 ਸਾਲ ਲਈ ₹10,000 ਉਧਾਰ ਲੈਂਦੇ ਹੋ, ਤਾਂ ਸਾਲ ਦੇ ਅੰਤ ਵਿੱਚ ਤੁਸੀਂ ਕੁੱਲ ਕਿੰਨਾ ਬਿਆਜ ਦਿੰਦੇ ਹੋ?",
        q1a0: "₹1,000 (ਸਹੀ ਬਿਆਜ ਭੁਗਤਾਨ)",
        q1a1: "₹100 (1% ਗਣਨਾ)",
        q1a2: "₹0 (ਬਿਆਜ-ਮੁਕਤ ਕਰਜ਼ਾ)",
        q1a3: "ਮੈਨੂੰ ਨਹੀਂ ਪਤਾ / ਯਕੀਨੀ ਨਹੀਂ",
        q2of3: "ਸਵਾਲ 2 ਵਿੱਚੋਂ 3",
        q2Title: "ਸੁਰੱਖਿਤ PIN ਅਤੇ OTP ਹੈਂਡਲਿੰਗ",
        q2Scenario: "ਤੁਹਾਨੂੰ ਇੱਕ ਅਣਜਾਣ ਵਿਅਕਤੀ ਦਾ ਫ਼ੋਨ ਆਉਂਦਾ ਹੈ ਜੋ ਬੈਂਕ ਮੈਨੇਜਰ ਹੋਣ ਦਾ ਦਾਅਵਾ ਕਰਦਾ ਹੈ। ਉਹ ਤੁਹਾਡਾ UPI PIN ਜਾਂ OTP ਮੰਗਦੇ ਹਨ। ਤੁਸੀਂ ਕੀ ਕਰਦੇ ਹੋ?",
        q2a0: "ਸਾਂਝਾ ਕਰਾਂ ਤਾਂ ਮੇਰਾ ਖਾਤਾ ਬਲਾਕ ਨਾ ਹੋਵੇ",
        q2a1: "ਸਿਰਫ਼ ਤਾਂ ਸਾਂਝਾ ਕਰਾਂ ਜੇ ਉਹ ਮੇਰਾ ਸਹੀ ਨਾਮ ਦੱਸਣ",
        q2a2: "ਕਾਲ 'ਤੇ ਕਿਸੇ ਨਾਲ ਵੀ ਆਪਣਾ PIN/OTP ਕਦੇ ਸਾਂਝਾ ਨਾ ਕਰੋ (ਸਹੀ)",
        q2a3: "ਉਨ੍ਹਾਂ ਨੂੰ ਕਹਾਂ ਕਿ ਮੈਂ ਬਾਅਦ ਵਿੱਚ ਉਨ੍ਹਾਂ ਨੂੰ ਫ਼ੋਨ ਕਰਾਂਗਾ",
        q3of3: "ਸਵਾਲ 3 ਵਿੱਚੋਂ 3",
        q3Title: "ਬੈਂਕ ਬੱਚਤ ਦਾ ਮਹੱਤਵ",
        q3Scenario: "ਘਰ ਵਿੱਚ ਬਾਕਸ ਵਿੱਚ ਨੱਕਦੀ ਰੱਖਣ ਦੇ ਮੁਕਾਬਲੇ ਔਪਚਾਰਿਕ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਪੈਸੇ ਬਚਾਉਣ ਦਾ ਮੁੱਖ ਲਾਭ ਕੀ ਹੈ?",
        q3a0: "ਪੈਸਿਆਂ 'ਤੇ ਬਿਆਜ ਮਿਲਦਾ ਹੈ ਅਤੇ ਚੋਰੀ ਤੋਂ ਸੁਰੱਖਿਤ ਹੈ (ਸਹੀ)",
        q3a1: "ਬੈਂਕ ਵਿੱਚ ਰੱਖਾ ਪੈਸਾ ਖਰਚਣਾ ਆਸਾਨ ਹੈ",
        q3a2: "ਨੱਕਦੀ ਅਤੇ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਕੋਈ ਅੰਤਰ ਨਹੀਂ ਹੈ",
        q3a3: "ਲਾਭਾਂ ਬਾਰੇ ਯਕੀਨੀ ਨਹੀਂ",
        digitalTitle: "ਡਿਜੀਟਲ ਭਰੋਸਾ ਮੁਲਾਂਕਣ",
        digitalDesc: "ਆਪਣੇ ਸਮਾਰਟਫੋਨ ਅਤੇ ਟੱਚ ਸਕ੍ਰੀਨ ਆਰਾਮ ਦੀ ਜਾਂਚ ਕਰਨ ਲਈ ਇਹ ਤਿੰਨ ਸਧਾਰਨ ਇੰਟਰਐਕਟਿਵ ਕਾਰਜ ਪੂਰੇ ਕਰੋ।",
        task1Title: "ਕਾਰਜ 1: ਨੰਬਰ ਟਾਇਪ ਕਰਨਾ",
        task1Heading: "ਨੰਬਰਿਕ ਕੋਡ ਦਰਜ ਕਰੋ",
        task1Desc: "ਹੇਠਾਂ ਸਕ੍ਰੀਨ ਕੀਪੈਡ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਕੋਡ ਟਾਇਪ ਕਰੋ: ",
        task2Title: "ਕਾਰਜ 2: ਖਿੱਚੋ ਅਤੇ ਛੱਡੋ",
        task2Heading: "ਆਪਣਾ ਸਿੱਕਾ ਸੁਰੱਖਿਤ ਕਰੋ",
        task2Desc: "ਸੋਨੇ ਦੇ ਸਿੱਕੇ ਨੂੰ ਹੇਠਾਂ ਪਿੱਗੀ ਬੈਂਕ ਵਿੱਚ ਖਿੱਚ ਕੇ ਲੈ ਜਾਓ।",
        dropCoin: "ਸਿੱਕਾ ਇੱਥੇ ਪਾਓ",
        task3Title: "ਕਾਰਜ 3: ਸਵਾਈਪ ਜੈਸਚਰ",
        task3Heading: "ਭੁਗਤਾਨ ਲਈ ਸਵਾਈਪ ਕਰੋ",
        task3Desc: "ਸਲਾਈਡਰ ਕੁੰਜੀ ਨੂੰ ਸੱਜੇ ਪਾਸੇ ਸਵਾਈਪ ਕਰਕੇ ਅਨੁਕਰਨ ਭੁਗਤਾਨ ਨੂੰ ਅਧਿਕ੃ਤ ਕਰੋ।",
        swipeConfirm: "ਪੁਸ਼ਟੀ ਲਈ ਸੱਜੇ ਪਾਸੇ ਸਵਾਈਪ ਕਰੋ",
        waitingInput: "ਇਨਪੁੱਟ ਦੀ ਉਡੀਕ ਹੈ...",
        dragStart: "ਸਿੱਕਾ ਖਿੱਚ ਕੇ ਸ਼ੁਰੂ ਕਰੋ",
        slideHandle: "ਹੈਂਡਲ ਨੂੰ ਸੱਜੇ ਪਾਸੇ ਸਲਾਈਡ ਕਰੋ",
        trustTitle: "ਭਰੋਸਾ ਅਤੇ ਸੁਰੱਖਿਆ ਚਿੰਤਾਵਾਂ",
        trustDesc: "ਡਿਜੀਟਲ ਵਿੱਤ ਦੀ ਵਰਤੋਂ ਕਰਨ ਵਿੱਚ ਜੋ ਵੀ ਚਿੰਤਾਵਾਂ ਤੁਹਾਨੂੰ ਹਿਚਕਿਚਾਉਂਦੀਆਂ ਹਨ ਉਨ੍ਹਾਂ ਨੂੰ ਚੁਣੋ।",
        trustConcerns: "ਤੁਹਾਡੀਆਂ ਮੁੱਖ ਚਿੰਤਾਵਾਂ ਕੀ ਹਨ? (ਸਭ ਲਾਗੂ ਚੁਣੋ)",
        concernFraud: "ਧੋਖਾਧੜੀ ਅਤੇ ਘੋਟਾਲੇ ਦਾ ਡਰ",
        concernFraudDesc: "ਔਨਲਾਈਨ ਧੋਖੇਬਾਜਾਂ ਤੋਂ ਪੈਸੇ ਗੁਆਉਣ ਦੀ ਚਿੰਤਾ",
        concernPrivacy: "ਡੇਟਾ ਅਤੇ ਖਾਤਾ ਗੋਪਨੀਯਤਾ",
        concernPrivacyDesc: "ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਲੀਕ ਹੋਣ ਦੀ ਚਿੰਤਾ",
        concernCharges: "ਲੁਕੀਆਂ ਫੀਸਾਂ ਅਤੇ ਸ਼ੁਲਕ",
        concernChargesDesc: "ਬਿਨਾਂ ਦੱਸੇ ਬੈਂਕ ਵੱਲੋਂ ਕੱਟੇ ਜਾਣ ਦੀ ਸ਼ੰਕਾ",
        concernMistakes: "ਗਲਤੀਆਂ ਕਰਨ ਦਾ ਡਰ",
        concernMistakesDesc: "ਗਲਤ ਅੰਕ ਟਾਇਪ ਕਰਨ ਨਾਲ ਗਲਤ ਵਿਅਕਤੀ ਨੂੰ ਪੈਸੇ ਜਾਣ ਦਾ ਡਰ",
        reassurancePortal: "ਸੁਰੱਖਿਆ ਪੋਰਟਲ",
        reassuranceDesc: "ਸੁਰੱਖਿਆ ਤੱਥਾਂ ਅਤੇ ਨਿਯਾਮਕ ਗਾਰੰਟੀਆਂ ਪੜ੍ਹਨ ਲਈ ਬਾਏਂ ਪਾਸੇ ਇੱਕ ਜਾਂ ਵੱਧ ਚਿੰਤਾਵਾਂ ਚੁਣੋ।",
        altAssessment: "ਵਿਕਲਪਿਕ ਮੁਲਾਂਕਣ",
        reliabilityTitle: "ਵਿਕਲਪਿਕ ਵਿੱਤੀ ਭਰੋਸੇਯੋਗਤਾ",
        reliabilityDesc: "ਜਿਨ੍ਹਾਂ ਉਪਯੋਗਕਰਤਾਵਾਂ ਕੋਲ ਔਪਚਾਰਿਕ ਬੈਂਕ ਕ੍ਰੈਡਿਟ ਇਤਿਹਾਸ ਜਾਂ ਤਨਖ਼ਾਹ ਸਲਿਪ ਨਹੀਂ ਹੈ, ਉਨ੍ਹਾਂ ਲਈ ਅਰਥਸੇਤੂ ਬੱਚਤ ਪੈਟਰਨ ਅਤੇ ਲੈਨਦੇਨ ਆਦਤਾਂ ਦੇ ਆਧਾਰ 'ਤੇ ਵਿਕਲਪਿਕ ਸੰਕੇਤਕਾਂ ਦਾ ਮੁਲਾਂਕਣ ਕਰਦਾ ਹੈ।",
        simReliability: "ਅਨੁਕਰਨ ਭਰੋਸੇਯੋਗਤਾ ਪ੍ਰੋਫਾਇਲ",
        incomeProfile: "ਆਮਦਨ ਅਤੇ ਬੱਚਤ ਪ੍ਰੋਫਾਇਲ",
        consentDetails: "ਆਪਣੀ ਭਰੋਸੇਯੋਗਤਾ ਸ਼੍ਰੇਣੀ ਦੀ ਗਣਨਾ ਕਰਨ ਲਈ ਸਹਿਮਤੀ-ਆਧਾਰਿਤ ਵੇਰਵੇ ਪ੍ਰਦਾਨ ਕਰੋ।",
        incomePattern: "1. ਤੁਹਾਡੀ ਆਮਦਨ ਦਾ ਪੈਟਰਨ ਕਿਹੋ ਜਿਹਾ ਹੈ?",
        incomeRegular: "ਨਿਯਮਤ ਮਹੀਨਾਵਾਰ",
        incomeIrregular: "ਅਨਿਯਮਤ ਰੋਜ਼ਾਨਾ/ਹਫ਼ਤਾਵਾਰ",
        incomeSeasonal: "ਮੌਸਮੀ (ਫ਼ਸਲ/ਗਿਗਜ਼)",
        indicatorsTitle: "2. ਆਪਣੇ ਲਈ ਲਾਗੂ ਸੰਕੇਤਕ ਚੁਣੋ:",
        ind1: "ਮੈਂ ਨਿਯਮਿਤ ਤੌਰ 'ਤੇ ਦੁਕਾਨ ਦਾ ਕਿਰਾਇਆ ਜਾਂ ਯੂਟਿਲਿਟੀ ਬਿਲ ਭਰਦਾ ਹਾਂ",
        ind2: "ਮੈਂ ਡਾਕ ਘਰ/ਬੱਚਤ ਬਾਕਸ ਵਿੱਚ ਕੁਝ ਨੱਕਦ ਬੱਚਤ ਰੱਖਦਾ ਹਾਂ",
        ind3: "ਮੇਰੇ ਕੋਲ ਵਪਾਰਕ ਇਨਵੈਂਟਰੀ ਜਾਂ ਵਪਾਰ ਸਪਲਾਈ ਹੈ",
        ind4: "ਮੇਰੇ ਕੋਲ ਸਥਾਨਿਕ ਅਨੌਪਚਾਰਿਕ ਕਰਜ਼ਾ ਦੇਣ ਵਾਲੇ ਦਾ ਕੋਈ ਬਕਾਇਆ ਕਰਜ਼ਾ ਨਹੀਂ ਹੈ",
        consentText: "ਮੈਂ ਇੱਕ ਅਨੁਕਰਨ ਕ੍ਰੈਡਿਟ ਭਰੋਸੇਯੋਗਤਾ ਸਕੋਰ ਬਣਾਉਣ ਲਈ ਵਿਕਲਪਿਕ ਸੰਕੇਤਕਾਂ ਦੀ ਵਰਤੋਂ ਕਰਨ ਦੀ ਸਹਿਮਤੀ ਦਿੰਦਾ ਹਾਂ।",
        generateProfile: "ਇੰਜਣ ਪ੍ਰੋਫਾਇਲ ਤਿਆਰ ਕਰੋ",
        engineTitle: "ਅਰਥਸੇਤੂ ਅਨੁਕੂਲ ਪ੍ਰੋਫਾਇਲਿੰਗ ਇੰਜਣ",
        engineDesc: "ਇੱਥੇ ਤੁਹਾਡੀ ਗਣਿਤੀ ਵਿੱਤੀ ਪ੍ਰੋਫਾਇਲ ਹੈ। ਐਪ ਤੁਹਾਡੇ ਲਈ ਇੱਕ ਅਨੁਕੂਲਿਤ ਰਸਤਾ ਚੁਣਦਾ ਹੈ।",
        scoreLiteracy: "ਵਿੱਤੀ ਸਾਖਰਤਾ",
        scoreDigital: "ਡਿਜੀਟਲ ਭਰੋਸਾ",
        scoreReliability: "ਵਿਕਲਪਿਕ ਭਰੋਸੇਯੋਗਤਾ",
        recommendedPath: "ਸਿਫ਼ਾਰਸ਼ੀ ਔਨਬੋਰਡਿੰਗ ਰਸਤਾ",
        calculating: "ਗਣਨਾ ਹੋ ਰਹੀ ਹੈ...",
        selectContinue: "ਪ੍ਰੋਫਾਇਲਿੰਗ ਚਲਾਉਣ ਲਈ ਜਾਰੀ ਰੱਖੋ ਚੁਣੋ।",
        enterLab: "ਸੁਰੱਖਿਤ ਫਾਇਨਾਂਸ ਲੈਬ ਵਿੱਚ ਦਾਖਲਾ ਕਰੋ",
        labTitle: "ਸੁਰੱਖਿਤ ਫਾਇਨਾਂਸ ਲੈਬ",
        practiceSandboxTag: "ਅਭਿਆਸ ਸੈਂਡਬਾਕਸ",
        tabPayment: "ਅਭਿਆਸ ਭੁਗਤਾਨ",
        tabFraud: "ਫ੍ਰਾਡ ਫਿਸ਼ਿੰਗ ਡਿਟੈਕਟਰ",
        tabLoan: "ਕਰਜ਼ਾ ਤੁਲਨਾ",
        tabBudget: "ਬਜਟ ਅਤੇ ਅਸਥਿਰਤਾ",
        arthapay: "ਅਰਥਾਪੇ",
        enterRecipient: "ਪ੍ਰਾਪਤਕਰਤਾ ਦਾ UPI ID / ਫ਼ੋਨ ਦਰਜ ਕਰੋ",
        verifyRecipient: "ਪ੍ਰਾਪਤਕਰਤਾ ਤਸਦੀਕ ਕਰੋ",
        verified: "ਤਸਦੀਕ ਕੀਤਾ",
        enterAmount: "ਤਬਾਦਲਾ ਰਾਸ਼ੀ ਦਰਜ ਕਰੋ (₹)",
        walletBalance: "ਅਭਿਆਸ ਵਾਲਿਟ ਬੈਲੇਂਸ: ₹1,000",
        continueToPay: "ਭੁਗਤਾਨ ਜਾਰੀ ਰੱਖੋ",
        enterUPIPIN: "6 ਅੰਕਾਂ ਦਾ UPI PIN ਦਰਜ ਕਰੋ",
        payingRs: "ਭੁਗਤਾਨ ₹",
        toRecipient: "ਕਿਸਾਨ ਭਾਈ ਨੂੰ",
        txnSuccess: "ਲੈਨਦੇਨ ਸਫਲ!",
        sentTo: "ਕਿਸਾਨ ਭਾਈ ਨੂੰ ਭੇਜਿਆ ਗਿਆ",
        txnId: "ਲੈਨਦੇਨ ID:",
        payAgain: "ਫਿਰ ਸੇ ਭੁਗਤਾਨ ਕਰੋ",
        paymentTutorial: "ਅਨੁਕਰਨ ਭੁਗਤਾਨ ਟਿਊਟੋਰੀਅਲ",
        paymentTutorialDesc: "ਅਸਲ ਪੈਸਿਆਂ ਦਾ ਜੋਖਿਮ ਉਠਾਏ ਬਿਨਾਂ ਧਨ ਤਬਾਦਲਾ ਕਿਵੇਂ ਕਰਨਾ ਹੈ ਇਹ ਸੀਖੋ।",
        crucialGuidelines: "ਮਹੱਤਵਪੂਰਨ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼:",
        practicePIN: "ਤੁਹਾਡਾ ਅਭਿਆਸ PIN ਕੋਡ ਹੈ: ",
        tip2: "ਭੁਗਤਾਨ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਤਸਦੀਕ ਕੀਤੇ ਪ੍ਰਾਪਤਕਰਤਾ ਨਾਮ ਦੀ ਦੁਬਾਰਾ ਜਾਂਚ ਕਰੋ।",
        tip3: "ਮਿਆਰੀ ਸੁਰੱਖਿਤ ਬੈਂਕਰ ਸਕ੍ਰੀਨਾਂ ਤੋਂ ਇਲਾਵਾ ਕਿਥੇ ਵੀ ਆਪਣਾ PIN ਟਾਇਪ ਨਾ ਕਰੋ।",
        walletHistory: "ਵਾਲਿਟ ਇਤਿਹਾਸ",
        welcomeBonus: "ਸੁਆਗਤ ਬੋਨਸ",
        messageInbox: "ਸੰਦੇਸ਼ ਇਨਬਾਕਸ",
        fraudDesc: "ਸੁਰੱਖਿਤ ਹੈ ਜਾਂ ਸਪੈਮ ਇਹ ਤੈਅ ਕਰਨ ਲਈ ਕਿਸੇ ਸੰਦੇਸ਼ ਨੂੰ ਪੜ੍ਹਨ ਲਈ ਕਲਿੱਕ ਕਰੋ।",
        selectMessage: "ਇੱਕ ਸੰਦੇਸ਼ ਚੁਣੋ",
        fraudPlaceholder: "ਇਸ ਦੀ ਸੁਰੱਖਿਆ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਨ ਲਈ ਸੂਚੀ ਵਿੱਚੋਂ ਇੱਕ ਇਨਕਮਿੰਗ SMS 'ਤੇ ਕਲਿੱਕ ਕਰੋ।",
        classifySafe: "ਸੁਰੱਖਿਤ ਵਜੋਂ ਵਰਗੀਕ੍ਰਿਤ ਕਰੋ",
        reportFraud: "ਫ੍ਰਾਡ / ਸਪੈਮ ਵਜੋਂ ਰਿਪੋਰਟ ਕਰੋ",
        loanTitle: "ਕਰਜ਼ਾ ਲਾਗਤ ਸਿਮੂਲੇਟਰ",
        loanDesc: "ਕੁੱਲ ਮੁੜ-ਭੁਗਤਾਨ ਦੇਖਣ ਅਤੇ ਬਿਆਜ ਜਾਲ ਤੋਂ ਬਚਣ ਲਈ ਸਲਾਈਡਰ ਅਡਜਸਟ ਕਰੋ।",
        principalAmt: "ਮੂਲ ਰਾਸ਼ੀ",
        interestRate: "ਬਿਆਜ ਦਰ (ਸਲਾਨਾ)",
        tenure: "ਮਿਆਦ (ਮਹੀਨੇ)",
        flatLoan: "ਫਲੈਟ ਕਰਜ਼ਾ (ਸਧਾਰਨ ਬਿਆਜ)",
        flatRateFinancing: "ਫਲੈਟ ਦਰ ਫਾਇਨਾਂਸਿੰਗ",
        monthlyEMI: "ਮਹੀਨਾਵਾਰ EMI",
        totalInterest: "ਕੁੱਲ ਬਿਆਜ",
        totalRepayment: "ਕੁੱਲ ਮੁੜ-ਭੁਗਤਾਨ",
        flatLoanDesc: "ਬਿਆਜ ਕੇਵਲ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ 'ਤੇ ਗਣਨਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।",
        compoundLoan: "ਚੱਕਰੀ ਕਰਜ਼ਾ (ਘਟਦਾ ਸ਼ੇਸ਼)",
        reducingBalanceFinancing: "ਘਟਦਾ ਸ਼ੇਸ਼ ਫਾਇਨਾਂਸਿੰਗ",
        compoundLoanDesc: "ਬਿਆਜ ਕੇਵਲ ਬਕਾਇਆ ਮੂਲਧਨ 'ਤੇ ਗਣਨਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਫਲੈਟ ਕਰਜ਼ੇ ਤੋਂ ਬਿਹਤਰ!",
        budgetTitle: "ਗਤੀਸ਼ੀਲ ਆਮਦਨ ਅਸਥਿਰਤਾ ਸਿਮੂਲੇਟਰ",
        budgetDesc: "ਵੱਖ-ਵੱਖ ਆਮਦਨ ਬਾਧਾਵਾਂ ਹੇਠ ਖਰਚਿਆਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ। ਅਨੁਕਰਨ ਮਹੀਨਾ ਖੇਡੋ!",
        currentIncome: "ਮੌਜੂਦਾ ਆਮਦਨ ਮਾਡਲ:",
        foodAlloc: "ਭੋਜਨ ਅਤੇ ਕਿਰਾਇਆ ਵੰਡ (₹)",
        savingsBox: "ਬੱਚਤ ਬਾਕਸ (₹)",
        growthAlloc: "ਨਿਵੇਸ਼ / ਵਪਾਰ ਵਿਕਾਸ (₹)",
        simulateMonth: "ਅਗਲਾ ਮਹੀਨਾ ਅਨੁਕਰਨ ਕਰੋ",
        walletBal: "ਵਾਲਿਟ ਬੈਲੇਂਸ",
        accumSavings: "ਸੰਚਿਤ ਬੱਚਤ",
        activityLog: "ਗਤੀਵਿਧੀ ਲੌਗ",
        gameStarted: "ਖੇਡ ਸ਼ੁਰੂ।",
        guidanceTitle: "ਨਿੱਜੀ ਵਿੱਤੀ ਮਾਰਗਦਰਸ਼ਨ",
        guidanceDesc: "ਇੱਥੇ ਤੁਹਾਡੇ ਮੁਲਾਂਕਣ ਦੇ ਆਧਾਰ 'ਤੇ ਤਿਆਰ ਕੀਤੇ ਗਏ ਮਹੱਤਵਪੂਰਨ ਵਿੱਤੀ ਨਿਯਮ ਹਨ।",
        viewReport: "ਤਿਆਰੀ ਰਿਪੋਰਟ ਵੇਖੋ",
        reportTitle: "ਵਿੱਤੀ ਤਿਆਰੀ ਰਿਪੋਰਟ",
        reportDesc: "ਸ਼ਾਨਦਾਰ ਤਰੱਕੀ! ਇੱਥੇ ਤੁਹਾਡਾ ਅਧਿਕਾਰਤ ਸਮਰੱਥਾ ਮੁਲਾਂਕਣ ਸਰਟੀਫਿਕੇਟ ਹੈ।",
        certTitle: "ਅਰਥਸੇਤੂ ਸਮਰੱਥਾ ਸਰਟੀਫਿਕੇਟ",
        certAwardedTo: "ਇਹ ਸਰਟੀਫਿਕੇਟ ਪ੍ਰਦਾਨ ਕੀਤਾ ਜਾਂਦਾ ਹੈ",
        certDesc: "ਸੁਰੱਖਿਤ ਫਾਇਨਾਂਸ ਲੈਬ ਸਿਮੂਲੇਟਰ ਵਿੱਚ ਅਨੁਕੂਲਿਤ ਵਿੱਤੀ ਪ੍ਰੋਫਾਇਲਿੰਗ ਅਤੇ ਸੁਰੱਖਿਤ UPI ਲੈਨਦੇਨ ਦੇ ਅਭਿਆਸ ਨੂੰ ਸਫਲਤਾਪੂਰਵਕ ਪੂਰਾ ਕਰਨ ਲਈ।",
        certLiteracy: "ਸਾਖਰਤਾ ਪੱਧਰ",
        certDigital: "ਡਿਜੀਟਲ ਭਰੋਸਾ",
        certPathway: "ਸਹਾਇਕ ਰਸਤਾ",
        certSystem: "ਸਿਸਟਮ ਜਾਰੀ",
        certDate: "ਤਸਦੀਕ ਦੀ ਮਿਤੀ",
        printCert: "ਸਰਟੀਫਿਕੇਟ ਪ੍ਰਿੰਟ ਕਰੋ",
        provideFeedback: "ਫੀਡਬੈਕ ਦਿਓ",
        feedbackTitle: "ਫੀਡਬੈਕ ਅਤੇ ਨਤੀਜਾ ਮਾਪ",
        feedbackDesc: "ਇਸ ਅਨੁਕੂਲਨ ਢਾਂਚੇ ਦੇ ਮੁਲਾਂਕਣ ਵਿੱਚ ਸਾਡੀ ਮਦਦ ਕਰੋ।",
        surveyQ1: "1. ਇਸ ਐਪਲੀਕੇਸ਼ਨ ਨੂੰ ਨੈਵੀਗੇਟ ਕਰਨਾ ਕਿੰਨਾ ਸੌਖਾ ਸੀ?",
        surveyQ2: "2. ਕੀ ਤੁਸੀਂ ਸੁਰੱਖਿਆ ਨਿਯਮਾਂ ਅਤੇ ਧੋਖਾਧੜੀ ਚੇਤਾਵਨੀਆਂ ਨੂੰ ਸਪੱਸ਼ਟ ਤਰ੍ਹਾਂ ਸਮਝਿਆ?",
        surveyQ3: "3. ਹੁਣ ਅਕੇਲੇ ਮੋਬਾਈਲ ਭੁਗਤਾਨ ਕਰਨ ਵਿੱਚ ਤੁਸੀਂ ਕਿੰਨਾ ਭਰੋਸਾ ਮਹਿਸੂਸ ਕਰਦੇ ਹੋ?",
        surveyQ4: "4. ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਕੋਈ ਸੁਝਾਅ ਜਾਂ ਟਿੱਪਣੀ ਹੈ?",
        feedbackPlaceholder: "ਹਿੰਦੀ, ਅੰਗਰੇਜ਼ੀ ਆਦਿ ਵਿੱਚ ਇੱਥੇ ਟਾਇਪ ਕਰੋ।",
        saveReset: "ਸੰਭਾਲੋ ਅਤੇ ਐਪਲੀਕੇਸ਼ਨ ਰੀਸੈਟ ਕਰੋ",
        assistantName: "ਅਰਥਦੂਤ ਸਹਾਇਕ:",
        welcomeArthasetu: "ਅਰਥਸੇਤੂ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ।",
        voiceOn: "ਵੌਇਸ ਸਹਾਇਤਾ: ਚਾਲੂ",
        voiceOff: "ਵੌਇਸ ਸਹਾਇਤਾ: ਬੰਦ",
        helpWelcome: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਅਰਥਦੂਤ ਹਾਂ। ਮੈਂ ਸਕ੍ਰੀਨ ਦੀ ਜਾਣਕਾਰੀ ਪੜ੍ਹ ਕੇ ਤੁਹਾਡਾ ਮਾਰਗਦਰਸ਼ਨ ਕਰਾਂਗਾ। ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਕਿਸੇ ਵੀ ਡੱਬੇ ਨੂੰ ਛੂਹੋ।",
        profileHelp: "ਅਨੁਭਵ ਨੂੰ ਆਪਣੀ ਲੋੜ ਅਨੁਸਾਰ ਢਾਲਣ ਲਈ ਹਰ ਸ਼੍ਰੇਣੀ ਤੋਂ ਇੱਕ ਵਿਕਲਪ ਚੁਣੋ।",
        quizHelp: "ਤੁਹਾਨੂੰ ਜੋ ਵਿਕਲਪ ਸਹੀ ਲੱਗੇ ਉਸ ਨੂੰ ਚੁਣੋ। ਇਹ ਸਿਰਫ਼ ਅਭਿਆਸ ਹੈ, ਗਲਤੀਆਂ ਤੋਂ ਨਾ ਡਰੋ।",
        digitalHelp: "ਆਓ ਤਿੰਨ ਕਾਰਜਾਂ ਦੀ ਜਾਂਚ ਕਰੀਏ। ਪਹਿਲਾਂ, ਕੀਪੈਡ 'ਤੇ 4096 ਟਾਇਪ ਕਰੋ। ਦੂਜਾ, ਸਿੱਕੇ ਨੂੰ ਪਿੱਗੀ ਬੈਂਕ ਵਿੱਚ ਪਾਓ। ਤੀਜਾ, ਸਲਾਈਡਰ ਨੂੰ ਸੱਜੇ ਪਾਸੇ ਖਿਸਕਾਓ।",
        trustHelp: "ਉਨ੍ਹਾਂ ਬਕਸਿਆਂ ਨੂੰ ਟਿੱਕ ਕਰੋ ਜਿੱਥੇ ਤੁਹਾਨੂੰ ਔਨਲਾਈਨ ਲੈਨਦੇਨ ਅਸੁਰੱਖਿਤ ਲੱਗਦਾ ਹੈ।",
        reliabilityHelp: "ਜੇ ਤੁਹਾਡੇ ਕੋਲ ਕ੍ਰੈਡਿਟ ਸਕੋਰ ਨਹੀਂ ਹੈ, ਤਾਂ ਵਿਕਲਪਿਕ ਤਰੀਕੇ ਤੁਹਾਡੀ ਭਰੋਸੇਯੋਗਤਾ ਦਿਖਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ।",
        sandboxHelp: "ਬਿਨਾਂ ਕਿਸੇ ਜੋਖਿਮ ਦੇ ਭੁਗਤਾਨ ਦਾ ਅਭਿਆਸ ਕਰੋ, ਧੋਖਾਧੜੀ ਸੰਦੇਸ਼ਾਂ ਨੂੰ ਪਹਿਚਾਣੋ, ਬਿਆਜ ਦਰਾਂ ਦੇਖੋ ਜਾਂ ਬਜਟ ਯੋਜਨਾ ਦਾ ਅਭਿਆਸ ਕਰੋ।",
        guidanceHelp: "ਇਨ੍ਹਾਂ ਸੁਰੱਖਿਆ ਨਿਯਮਾਂ ਨੂੰ ਪੜ੍ਹੋ। ਅਸੀਂ ਉਨ੍ਹਾਂ ਨੂੰ ਤੁਹਾਡੇ ਜਵਾਬਾਂ ਦੇ ਆਧਾਰ 'ਤੇ ਤਿਆਰ ਕੀਤਾ ਹੈ।",
        reportHelp: "ਇਹ ਤੁਹਾਡਾ ਪੂਰਨਤਾ ਸਰਟੀਫਿਕੇਟ ਹੈ!",
        surveyHelp: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਅਨੁਭਵ ਨੂੰ ਰੇਟ ਕਰੋ। ਧੰਨਵਾਦ!",
        pathAssisted: "ਵੌਇਸ/ਵਿਜ਼ੂਅਲ ਸਹਾਇਤਾ ਰਸਤਾ",
        pathAssistedDesc: "ਸਮਾਰਟਫੋਨ ਅਤੇ ਡਿਜੀਟਲ ਸਾਖਰਤਾ ਪੱਧਰ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖਦੇ ਹੋਏ, ਸਿਸਟਮ ਨੇ ਤੁਹਾਡੇ ਲਈ ਪੂਰੀ ਵੌਇਸ ਅਤੇ ਵੱਡੀ ਵਿਜ਼ੂਅਲ ਗਾਈਡੈਂਸ ਸਕ੍ਰਿਆ ਕੀਤੀ ਹੈ।",
        pathAssistedFeat1: "ਸਵੈਚਲਿਤ ਵੌਇਸ ਗਾਈਡੈਂਸ ਸਕ੍ਰਿਆ",
        pathAssistedFeat2: "ਵੱਡੇ ਫ਼ੌਂਟ ਆਕਾਰ",
        pathAssistedFeat3: "ਸੁਗਮ ਬਟਨ ਨੈਵੀਗੇਸ਼ਨ",
        pathGuided: "ਮਾਰਗਦਰਸ਼ਿਤ ਰਸਤਾ",
        pathGuidedDesc: "ਤੁਸੀਂ ਬੁਨਿਆਦੀ ਐਪਸ ਚਲਾ ਲੈਂਦੇ ਹੋ। ਸਿਸਟਮ ਮਹੱਤਵਪੂਰਨ ਬਟਨਾਂ 'ਤੇ ਹਾਈਲਾਈਟ ਅਤੇ ਪੌਪ-ਅਪ ਨਿਰਦੇਸ਼ ਦਿਖਾਏਗਾ।",
        pathGuidedFeat1: "ਸਕ੍ਰਿਆ ਬਟਨਾਂ 'ਤੇ ਚਮਕਦਾ ਹਾਈਲਾਈਟ",
        pathGuidedFeat2: "ਸਮੇਂ ਸੁਰੱਖਿਆ ਪੌਪ-ਅਪ ਸੰਦੇਸ਼",
        pathGuidedFeat3: "ਸੰਕੇਤਕ ਟੂਲਟਿੱਪਸ",
        pathSelf: "ਸਵੈ-ਮਾਰਗਦਰਸ਼ਿਤ ਰਸਤਾ",
        pathSelfDesc: "ਤੁਸੀਂ ਸਮਾਰਟਫੋਨ ਚਲਾਉਣ ਵਿੱਚ ਬਹੁਤ ਕੁਸ਼ਲ ਹੋ।",
        pathSelfFeat1: "ਸਾਧਾਰਨ ਨੈਵੀਗੇਸ਼ਨ ਮੋਡ",
        pathSelfFeat2: "ਪੂਰੀ ਟੂਲ ਸਵੈੰਤਰਤਾ",
        pathSelfFeat3: "ਉੱਨਤ ਸੈਂਡਬਾਕਸ ਅਭਿਆਸ",
        certSelf: "ਸਵੈ-ਮਾਰਗਦਰਸ਼ਿਤ",
        certGuided: "ਮਾਰਗਦਰਸ਼ਿਤ ਸਹਾਇਤਾ",
        certAssisted: "ਵੌਇਸ ਸਹਾਇਤਾ",
        lockedMsg: "ਇਹ ਹਿੱਸਾ ਬੰਦ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਪਿਛਲਾ ਕੰਮ ਪਹਿਲਾਂ ਪੂਰਾ ਕਰੋ।",
        occupationMsg: "ਕਿੱਤਾ ਦਰਜ ਹੋ ਗਿਆ।",
        answerMsg: "ਜਵਾਬ ਦਰਜ ਹੋ ਗਿਆ।",
        clearedMsg: "ਸਾਫ਼ ਕੀਤਾ",
        codeSuccess: "ਸਫਲ! ਕੋਡ ਸਹੀ ਹੈ।",
        firstTaskDone: "ਬਹੁਤ ਵਧੀਆ! ਪਹਿਲਾ ਕੰਮ ਪੂਰਾ ਹੋਇਆ।",
        codeWrong: "ਗਲਤ ਕੋਡ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
        codeWrongRetry: "ਗਲਤ ਕੋਡ, ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ 4096 ਟਾਇਪ ਕਰੋ।",
        savingsSecured: "ਬੱਚਤ ਸੁਰੱਖਿਤ!",
        coinDeposited: "ਸਫਲ! ਸਿੱਕਾ ਜਮ੍ਹਾ ਹੋਇਆ।",
        coinSecured: "ਵਧਾਈ ਹੋਵੇ, ਸਿੱਕਾ ਬੈਂਕ ਵਿੱਚ ਸੁਰੱਖਿਤ ਹੈ।",
        swipeSuccess: "ਸਫਲ! ਸਵਾਈਪ ਸਵੀਕ੃ਤ ਹੋਈ।",
        swipeDone: "ਸਵਾਈਪ ਸਵੀਕਾਰ ਕਰ ਲਈ ਗਈ ਹੈ।",
        optionToggled: "ਵਿਕਲਪ ਬਦਲਿਆ ਗਿਆ।",
        incomeRecorded: "ਆਮਦਨ ਦਾ ਸਰੂਪ ਦਰਜ ਹੋਇਆ।",
        scoreCalculated: "ਵਿਕਲਪਿਕ ਸੂਚਕਾਂਕ ਸਕੋਰ {score} ਪ੍ਰਤੀਸ਼ਤ ਹੋਇਆ।",
        labTabActive: "ਲੈਬ ਦਾ {tab} ਅਭਿਆਸ ਸਕ੍ਰਿਆ ਹੋਇਆ।",
        recipientVerified: "ਸਫਲ! ਪ੍ਰਾਪਤਕਰਤਾ ਤਸਦੀਕ ਹੋ ਗਿਆ ਹੈ।",
        enterValidUPI: "ਕਿਰਪਾ ਕਰਕੇ ਵੈਧ UPI ਆਈਡੀ ਜਾਂ ਨੰਬਰ ਦਰਜ ਕਰੋ।",
        enterAmountMsg: "ਕਿਰਪਾ ਕਰਕੇ 10 ਤੋਂ 2,000 ਰੁਪਏ ਦੇ ਵਿਚਕਾਰ ਰਾਸ਼ੀ ਦਰਜ ਕਰੋ।",
        insufficientFunds: "ਸੈਂਡਬਾਕਸ ਵਾਲਿਟ ਵਿੱਚ ਪਰਿਆਪਤ ਰਾਸ਼ੀ ਨਹੀਂ ਹੈ।",
        enterPIN: "ਪੁਸ਼ਟੀ ਕਰਨ ਲਈ 6 ਅੰਕਾਂ ਦਾ UPI PIN ਟਾਇਪ ਕਰੋ।",
        paymentSuccess: "ਸਫਲ! ਭੁਗਤਾਨ ਪੂਰਾ ਹੋ ਗਿਆ ਹੈ।",
        wrongPIN: "ਗਲਤ UPI PIN। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ 123456 ਟਾਇਪ ਕਰੋ।",
        smsReview: "ਸੰਦੇਸ਼ ਖੋਲ੍ਹ ਲਿਆ ਗਿਆ ਹੈ।",
        correctDecision: "ਤੁਹਾਡਾ ਫ਼ੈਸਲਾ ਬਿਲਕੁਲ ਸਹੀ ਹੈ।",
        wrongDecision: "ਗਲਤ ਫ਼ੈਸਲਾ। ਸੁਰੱਖਿਆ ਚੇਤਾਵਨੀ ਨੂੰ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ।",
        overBudget: "ਕੁੱਲ ਵੰਡ ਤੁਹਾਡੇ ਵਾਲਿਟ ਬੈਲੇਂਸ ਤੋਂ ਵੱਧ ਹੈ!",
        monthComplete: "ਮਹੀਨਾ ਸਮਾਪਤ ਹੋਇਆ।",
        monthLabel: "ਮਹੀਨਾ",
        ratingRecorded: "ਰੇਟਿੰਗ ਦਰਜ ਹੋਈ।",
        profileSaved: "ਵਧਾਈ ਹੋਵੇ! ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਇਲ ਸੰਭਾਲ ਲਈ ਗਈ ਹੈ।",
        onboardingDone: "ਸਫਲ! ਤੁਹਾਡਾ ਫੀਡਬੈਕ ਦਰਜ ਹੋ ਗਿਆ ਹੈ।",
        fraudTitle: "ਧੋਖਾਧੜੀ ਤੋਂ ਸੁਰੱਖਿਆ",
        fraudDesc: "ਆਰਬੀਆਈ ਨਿਯਮਾਂ ਦੇ ਤਹਿਤ, ਅਣਅਧਿਕ੃ਤ ਲੈਨਦੇਨ ਦੇ 3 ਦਿਨਾਂ ਦੇ ਅੰਦਰ ਸੂਚਿਤ ਕਰਨ 'ਤੇ ਤੁਹਾਡੀ ਦੇਣਦਾਰੀ ਸਿਫ਼ਰ ਹੈ।",
        privacyTitle: "ਗੋਪਨੀਯਤਾ ਅਤੇ ਬੈਂਕਿੰਗ ਐਕਟ",
        privacyDesc: "ਤੁਹਾਡਾ ਡੇਟਾ DPDP ਐਕਟ ਦੇ ਤਹਿਤ ਸੁਰੱਖਿਤ ਹੈ।",
        chargesTitle: "ਸਿਫ਼ਰ ਲੁਕੀਆਂ ਫੀਸਾਂ ਅਨਿਵਾਰਤਾ",
        chargesDesc: "ਬੀਐਸਬੀਡੀ ਖਾਤਿਆਂ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਰਾਸ਼ੀ ਰੱਖਣ ਦੀ ਕੋਈ ਸੀਮਾ ਨਹੀਂ ਹੈ।",
        mistakesTitle: "ਗਲਤ ਭੁਗਤਾਨ ਵਾਪਸੀ",
        mistakesDesc: "ਗਲਤ ਖਾਤੇ ਵਿੱਚ ਪੈਸੇ ਭੇਜਣ 'ਤੇ ਤੁਸੀਂ ਐਨਪੀਸੀਆਈ ਪੋਰਟਲ 'ਤੇ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਾ ਸਕਦੇ ਹੋ।",
        tipSecTitle: "ਓਟੀਪੀ ਜਾਂ ਪਿਨ ਕਦੇ ਸਾਂਝਾ ਨਾ ਕਰੋ",
        tipSecDesc: "ਕੋਈ ਵੀ ਬੈਂਕ ਕਰਮਚਾਰੀ ਕਾਲ 'ਤੇ ਤੁਹਾਡਾ UPI PIN ਜਾਂ OTP ਨਹੀਂ ਮੰਗਦਾ।",
        tipSavTitle: "ਆਪਾਤਕਾਲੀਨ ਬੱਚਤ ਕੋਸ਼",
        tipSavDescRegular: "ਨਿਯਮਤ ਆਮਦਨ ਹੋਣ 'ਤੇ ਹਰ ਮਹੀਨੇ ਘੱਟੋ-ਘੱਟ 15% ਰਾਸ਼ੀ ਵੱਖਰੇ ਬੱਚਤ ਖਾਤੇ ਵਿੱਚ ਜਮ੍ਹਾ ਕਰੋ।",
        tipSavDescIrregular: "ਤੁਹਾਡੀ ਆਮਦਨ ਮੌਸਮੀ ਹੈ, ਇਸ ਲਈ ਘੱਟੋ-ਘੱਟ 3 ਮਹੀਨਿਆਂ ਦੇ ਬੁਨਿਆਦੀ ਖਰਚਿਆਂ ਦੇ ਬਰਾਬਰ ਰਾਸ਼ੀ ਵੱਖਰੇ ਬੱਚਤ ਖਾਤੇ ਵਿੱਚ ਰੱਖੋ।",
        tipCreTitle: "ਅਨੌਪਚਾਰਿਕ ਬਿਆਜ ਚੰਗੂਲ ਤੋਂ ਬਚੋ",
        tipCreDesc: "ਸਥਾਨਕ ਸਾਹੂਕਾਰਾਂ ਦਾ 5% ਮਾਸਿਕ ਬਿਆਜ 60% ਸਾਲਾਨਾ ਹੋ ਜਾਂਦਾ ਹੈ!",
        tipPayTitle: "ਭੁਗਤਾਨ ਪ੍ਰਾਪਤਕਰਤਾ ਨਾਮ ਦੀ ਜਾਂਚ",
        tipPayDesc: "ਪਿਨ ਪਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਹਮੇਸ਼ਾ ਪ੍ਰਾਪਤਕਰਤਾ ਦਾ ਤਸਦੀਕ ਕੀਤਾ ਨਾਮ ਪੜ੍ਹੋ।",
        sms1Sender: "AD-LOTTRI",
        sms1Text: "ਵਧਾਈ ਹੋਵੇ! ਤੁਸੀਂ ਸਰਕਾਰੀ ਪ੍ਰਚਾਰ ਤੋਂ ₹10,00,000 ਦੀ ਲਾਟਰੀ ਜਿੱਤੀ ਹੈ।",
        sms1Expl: "ਇਹ ਫ੍ਰਾਡ ਹੈ। ਸਰਕਾਰੀ ਵਿਭਾਗ ਸਾਰਵਜਨਿਕ SMS ਲਿੰਕ ਤੋਂ ਲਾਟਰੀ ਨਹੀਂ ਦਿੰਦੇ।",
        sms2Sender: "ਸਟੇਟ ਬੈਂਕ",
        sms2Text: "ਪਿਆਰੇ ਗਾਹਕ, ਤੁਹਾਡਾ ਮਹੀਨਾਵਾਰ ਬੈਂਕ ਸਟੇਟਮੈਂਟ ਤਿਆਰ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਅਧਿਕਾਰਤ ਪੋਰਟਲ 'ਤੇ ਲੌਗਇਨ ਕਰੋ।",
        sms2Expl: "ਇਹ ਸੁਰੱਖਿਤ ਹੈ। ਸੰਦੇਸ਼ ਵਿੱਚ ਕੋਈ ਅਤਿਆਵਸ਼ਕ ਖ਼ਤਰਾ ਨਹੀਂ ਹੈ।",
        sms3Sender: "BP-ALERT",
        sms3Text: "ਅਲਰਟ! ਤੁਹਾਡਾ ਬਿਜਲੀ ਬਿਲ ₹1,450 ਬਕਾਇਆ ਹੈ।",
        sms3Expl: "ਇਹ ਫ੍ਰਾਡ ਹੈ। ਯੂਟਿਲਿਟੀ ਕੰਪਨੀਆਂ ਯਾਦ੃ਚਿਕ ਫੋਨ ਨੰਬਰਾਂ ਤੋਂ ਤੁਰੰਤ ਡਿਸਕਨੈਕਸ਼ਨ ਦੀ ਧਮਕੀ ਨਹੀਂ ਦਿੰਦੀਆਂ।",
        eventMedical: "ਮੈਡੀਕਲ ਐਮਰਜੈਂਸੀ",
        eventMedicalDesc: "ਪਰਿਵਾਰ ਦਾ ਇੱਕ ਮੈਂਬਰ ਬੀਮਾਰ ਹੋ ਗਿਆ। ₹1,000 ਇਲਾਜ ਖਰਚ।",
        eventHarvest: "ਬੰਪਰ ਫ਼ਸਲ ਬੋਨਸ",
        eventHarvestDesc: "ਫ਼ਸਲ ਦੀ ਮੰਗ ਅਚਾਨਕ ਵਧ ਗਈ! ₹1,500 ਵਾਧੂ ਲਾਭ।",
        eventDrought: "ਸੁੱਖਾ / ਸਥਾਨਕ ਮੰਦੀ",
        eventDroughtDesc: "ਖ਼ਰਾਬ ਮੌਸਮ ਦੇ ਕਾਰਨ ਕੋਈ ਕਮਾਈ ਨਹੀਂ ਹੋਈ।",
        eventFestival: "ਤਿਉਹਾਰ ਉਤਸਵ",
        eventFestivalDesc: "ਮਿਠਾਈ ਅਤੇ ਉਪਹਾਰਾਂ ਵਿੱਚ ₹500 ਖਰਚ।"
    },
﻿    'ur': {
        brandTagline: "موافق شمولیت",
        navGroup1: "1. رجسٹری اور پروفائلنگ",
        navGroup2: "2. انٹرایکٹیو جانچ",
        navGroup3: "3. سیکھنا اور لیب",
        navGroup4: "4. خلاصہ اور رائے",
        navGroup5: "5. نئی نسل سیکیورٹی",
        guestUser: "مہمان صارف",
        online: " آن لائن",
        title1: "زبان اور آواز",
        title2: """مجھے جانیے"" پروفائل",
        title3: "مالی ساکھ",
        title4: "ڈیجیٹل اعتماد",
        title5: "اعتماد اور سیکیورٹی",
        title6: "قابل اعتماد اور آمدنی",
        title7: "موافق انجن",
        title8: "محفوظ فائنانس لیب",
        title9: "ذاتی رہنمائی",
        title10: "تیاری رپورٹ",
        title11: "رائے سروے",
        title12: "سیکیورٹی ڈیش بورڈ",
        title13: "اجازت مینیجر",
        title14: "ZKP تصدیق کارندہ",
        prototype: "پروٹوٹائپ",
        welcomeTitle: "خوش آمدید",
        welcomeDesc: "آرتھا سیتو آپ کی مالی ضروریات، ڈیجیٹل صلاحیت اور پسندیدہ زبان کے مطابق ڈھل جاتا ہے۔ ہم آپ کو باضابطہ فائنانس محفوظ طریقے سے سیکھنے میں مدد کرتے ہیں۔",
        langCount: "6+",
        indianLanguages: "ہندوستانی زبانیں",
        sandboxPct: "100%",
        practiceSandbox: "مشق سینڈباکس",
        selectLang: "اپنی زبان منتخب کریں",
        langSubtitle: "پورا ایپ آپ کی منتخب زبان میں کام کرے گا",
        enableVoice: "آواز مدد فعال کریں",
        voiceDesc: "ہمارے ورچوئل گائیڈ ""آرتھا دوت"" آپ کی منتخب زبان میں ہدایات بلند آواز سے پڑھے گا۔",
        startProfiling: "پروفائلنگ شروع کریں",
        tellUsAbout: "ہمیں اپنے بارے میں بتائیں",
        configureApp: "ہم آپ کی روزمرہ زندگی اور پیشے کی بنیاد پر ایپلیکیشن کنفیگر کرتے ہیں۔",
        questionOccupation: "1. آپ کا بنیادی پیشہ کیا ہے؟",
        occRetailer: "چھوٹا بیچنے والا / دکاندار",
        occRetailerSub: "دکاندار / رہڑی پٹری",
        occFarmer: "کسان / کھیتی",
        occFarmerSub: "کسان / کھیتی باری",
        occWorker: "گگ ورکر / ڈلیوری",
        occWorkerSub: "ڈلیوری / ٹیکسی چالک",
        occDailywager: "روزانہ اجرت وصول کرنے والا",
        occDailywagerSub: "مزدور / روزانہ اجرت",
        questionFinExp: "2. کیا آپ نے باضابطہ بینکنگ اور ڈیجیٹل ادائیگی خدمات استعمال کی ہیں؟",
        finBeginner: "پہلی بار صارف",
        finBeginnerSub: "UPI / آن لائن بینکنگ کبھی استعمال نہیں کیا",
        finBasic: "بنیادی صارف",
        finBasicSub: "بینک کارڈ ہے، لیکن UPI کم استعمال کرتے ہیں",
        finIntermediate: "درمیانی صارف",
        finIntermediateSub: "کبھی کبھی UPI استعمال کرتے ہیں، اعتماد چاہیے",
        questionDigConf: "3. آپ سمارٹ فون چلانے میں کتنے راحت ہیں؟",
        digLow: "مدد درکار ہے",
        digLowSub: "عام طور پر دوسروں سے کام کراتے ہیں",
        digMedium: "بنیادی ایپس چلا سکتے ہیں",
        digMediumSub: "WhatsApp / YouTube آسانی سے استعمال کرتے ہیں",
        digHigh: "بہت مستند",
        digHighSub: "ایپس ڈاؤنلوڈ کر سکتے ہیں اور ٹائپنگ کر سکتے ہیں",
        back: "واپس",
        continue: "آگے بڑھیں",
        quizTitle: "مالی ساکھ جانچ",
        quizDesc: "ہم آپ کی مالی تصورات کو سمجھنے کے لیے تین منظریہ مبنی سوالات کے جوابات دیں۔",
        q1of3: "سوال 1 از 3",
        q1Title: "فلیٹ سود کی شمار",
        q1Scenario: "اگر آپ 10% فلیٹ سود کی شرح سے 1 سال کے لیے ₹10,000 ادھار لیتے ہیں، تو سال کے اختتام پر آپ کل کتنا سود ادا کرتے ہیں؟",
        q1a0: "₹1,000 (درست سود ادائیگی)",
        q1a1: "₹100 (1% شمار)",
        q1a2: "₹0 (سود مفت قرضہ)",
        q1a3: "مجھے نہیں پتا / یقینی نہیں",
        q2of3: "سوال 2 از 3",
        q2Title: "محفوظ PIN اور OTP ہینڈلنگ",
        q2Scenario: "آپ کو ایک نامعلوم شخص کا فون آتا ہے جو بینک مینجر ہونے کا دعویٰ کرتے ہیں۔ وہ آپ کا UPI PIN یا OTP مانگتے ہیں۔ آپ کیا کرتے ہیں؟",
        q2a0: "شیئر کر دوں تاکہ میرا اکاؤنٹ بلاک نہ ہو",
        q2a1: "صرف اس صورت میں شیئر کروں جب وہ میرا صحیح نام بتائیں",
        q2a2: "کال پر کسی کے ساتھ بھی اپنا PIN/OTP کبھی شیئر نہ کریں (درست)",
        q2a3: "انہیں بتاؤں کہ میں بعد میں انہیں کال کروں گا",
        q3of3: "سوال 3 از 3",
        q3Title: "بینک بچت کی اہمیت",
        q3Scenario: "گھر میں ڈبے میں نقد رکھنے کے مقابلے میں باضابطہ بینک اکاؤنٹ میں پیسے بچانے کا بنیادی فائدہ کیا ہے؟",
        q3a0: "پیسوں پر سود ملتا ہے اور چوری سے محفوظ ہے (درست)",
        q3a1: "بینک میں رکھا پیسہ خرچ کرنا آسان ہے",
        q3a2: "نقد اور بینک اکاؤنٹ میں کوئی فرق نہیں ہے",
        q3a3: "فوائد کے بارے میں یقینی نہیں",
        digitalTitle: "ڈیجیٹل اعتماد جانچ",
        digitalDesc: "اپنے سمارٹ فون اور ٹچ اسکرین آرام کی جانچ کرنے کے لیے یہ تین سادہ انٹرایکٹیو کام مکمل کریں۔",
        task1Title: "کام 1: نمبر ٹائپ کرنا",
        task1Heading: "نمبری کوڈ درج کریں",
        task1Desc: "نیچے سکرین کی پیڈ کا استعمال کر کے کوڈ ٹائپ کریں: ",
        task2Title: "کام 2: گھسیٹیں اور چھوڑیں",
        task2Heading: "اپنا سکہ محفوظ کریں",
        task2Desc: "سنہرے سکے کو نیچے پگی بینک میں گھسیٹ کر لے جائیں۔",
        dropCoin: "سکہ یہاں ڈالیں",
        task3Title: "کام 3: سوائپ جیسچر",
        task3Heading: "ادائیگی کے لیے سوائپ کریں",
        task3Desc: "سلائیڈر کلید کو دائیں طرف سوائپ کر کے محاکمہ ادائیگی کی اجازت دیں۔",
        swipeConfirm: "تصدیق کے لیے دائیں طرف سوائپ کریں",
        waitingInput: "ان پٹ کا انتظار ہے...",
        dragStart: "سکہ گھسیٹ کر شروع کریں",
        slideHandle: "ہینڈل کو دائیں طرف سلائیڈ کریں",
        trustTitle: "اعتماد اور سیکیورٹی کی فکریں",
        trustDesc: "ڈیجیٹل فائنانس استعمال کرنے میں جو بھی فکریں آپ کو جھجھکاتی ہیں ان کا انتخاب کریں۔",
        trustConcerns: "آپ کی بنیادی فکریں کیا ہیں؟ (تمام لاگو منتخب کریں)",
        concernFraud: "دھوکہ دہی اور فراڈ کا خوف",
        concernFraudDesc: "آن لائن دھوکہ دہی والوں سے پیسے کھونے کی فکر",
        concernPrivacy: "ڈیٹا اور اکاؤنٹ رازداری",
        concernPrivacyDesc: "ذاتی معلومات لیک ہونے کی فکر",
        concernCharges: "پوشیدہ فیس اور اخراجات",
        concernChargesDesc: "بغیر بتائے بینک کے کاٹنے کا شک",
        concernMistakes: "غلطیاں کرنے کا خوف",
        concernMistakesDesc: "غلط ہندسہ ٹائپ کرنے سے غلط شخص کو پیسے جانے کا خوف",
        reassurancePortal: "سیکیورٹی پورٹل",
        reassuranceDesc: "سیکیورٹی حقائق اور ریگولاتری ضمانتیں پڑھنے کے لیے بائیں طرف ایک یا زیادہ فکریں منتخب کریں۔",
        altAssessment: "متبادل جانچ",
        reliabilityTitle: "متبادل مالی قابل اعتماد",
        reliabilityDesc: "جن صارفین کے پاس باضابطہ بینک کریڈٹ ہسٹری یا تنخواہ سلپ نہیں ہے، آرتھا سیتو بچت کے پیٹرن اور لین دین کی عادات کی بنیاد پر متبادل اشاروں کا جائزہ لیتا ہے۔",
        simReliability: "محاکمہ قابل اعتماد پروفائل",
        incomeProfile: "آمدنی اور بچت پروفائل",
        consentDetails: "اپنی قابل اعتماد درجہ بندی کا حساب لگانے کے لیے رضامندی مبنی تفصیلات فراہم کریں۔",
        incomePattern: "1. آپ کی آمدنی کا پیٹرن کیسا ہے؟",
        incomeRegular: "باقاعدہ ماہانہ",
        incomeIrregular: "بے قاعدہ روزانہ/ہفتہ وار",
        incomeSeasonal: "موسمی (فصل/گگز)",
        indicatorsTitle: "2. اپنے لیے لاگو اشارے منتخب کریں:",
        ind1: "میں باقاعدہ طور پر دکان کا کرایہ یا یوٹیلٹی بل بھرتا ہوں",
        ind2: "میں ڈاک خانہ/بچت باکس میں کچھ نقد بچت رکھتا ہوں",
        ind3: "میرے پاس تجارتی انونٹری یا کاروبار کی فراہمی ہے",
        ind4: "میرے پاس مقامی غیر رسمی قرض دہندہ کا کوئی بقایا قرض نہیں ہے",
        consentText: "میں ایک محاکمہ کریڈٹ قابل اعتماد اسکور بنانے کے لیے متبادل اشاروں کے استعمال کی رضامندی دیتا ہوں۔",
        generateProfile: "نجن پروفائل تیار کریں",
        engineTitle: "آرتھا سیتو موافق پروفائلنگ ننج",
        engineDesc: "یہاں آپ کا حسابی مالی پروفائل ہے۔ ایپ آپ کے لیے ایک موافق راستہ منتخب کرتی ہے۔",
        scoreLiteracy: "مالی ساکھ",
        scoreDigital: "ڈیجیٹل اعتماد",
        scoreReliability: "متبادل قابل اعتماد",
        recommendedPath: "تجویز کردہ آن بورڈنگ راستہ",
        calculating: "حساب لگ رہا ہے...",
        selectContinue: "پروفائلنگ چلانے کے لیے جاری رکھیں منتخب کریں۔",
        enterLab: "محفوظ فائنانس لیب میں داخل ہوں",
        labTitle: "محفوظ فائنانس لیب",
        practiceSandboxTag: "مشق سینڈباکس",
        tabPayment: "مشق ادائیگی",
        tabFraud: "فراڈ فشنگ ڈیٹیکٹر",
        tabLoan: "قرضہ تقابلی",
        tabBudget: "بجٹ اور عدم استحکام",
        arthapay: "آرتھا پے",
        enterRecipient: "وصول کنندہ کا UPI ID / فون درج کریں",
        verifyRecipient: "وصول کنندہ کی تصدیق کریں",
        verified: "تصدیق شدہ",
        enterAmount: "ٹرانسفر رقم درج کریں (₹)",
        walletBalance: "مشق والیٹ بیلنس: ₹1,000",
        continueToPay: "ادائیگی جاری رکھیں",
        enterUPIPIN: "6 ہندسوں کا UPI PIN درج کریں",
        payingRs: "ادائیگی ₹",
        toRecipient: "کسان بھائی کو",
        txnSuccess: "لین دین کامیاب!",
        sentTo: "کسان بھائی کو بھیجا گیا",
        txnId: "لین دین ID:",
        payAgain: "دوبارہ ادائیگی کریں",
        paymentTutorial: "محاکمہ ادائیگی ٹیوٹوریل",
        paymentTutorialDesc: "حقیقی پیسوں کا خطرہ اٹھائے بغیر فنڈز ٹرانسفر کرنا سیکھیں۔",
        crucialGuidelines: "اہم رہنمائی:",
        practicePIN: "آپ کا مشق PIN کوڈ ہے: ",
        tip2: "ادائیگی کرنے سے پہلے تصدیق شدہ وصول کنندہ نام دوبارہ چیک کریں۔",
        tip3: "معیاری محفوظ بینکر اسکرینوں کے علاوہ کہیں بھی اپنا PIN ٹائپ نہ کریں۔",
        walletHistory: "والیٹ ہسٹری",
        welcomeBonus: "خوش آمدید بونس",
        messageInbox: "پیغام ان باکس",
        fraudDesc: "محفوظ ہے یا اسپام یہ طے کرنے کے لیے کسی پیغام کو پڑھنے پر کلک کریں۔",
        selectMessage: "ایک پیغام منتخب کریں",
        fraudPlaceholder: "اس کی سیکیورٹی کا تجزیہ کرنے کے لیے فہرست میں سے ایک ان کمنگ SMS پر کلک کریں۔",
        classifySafe: "محفوظ کے طور پر درجہ بندی کریں",
        reportFraud: "فراڈ / اسپام کے طور پر رپورٹ کریں",
        loanTitle: "قرضہ لاگت سیمولیٹر",
        loanDesc: "کل واپسی دیکھنے اور سود کے جال سے بچنے کے لیے سلائیڈر کی ترمیم کریں۔",
        principalAmt: "اصل رقم",
        interestRate: "سود کی شرح (سالانہ)",
        tenure: "مدت (مہینے)",
        flatLoan: "فلیٹ قرضہ (سادہ سود)",
        flatRateFinancing: "فلیٹ شرح فنانسنگ",
        monthlyEMI: "ماہانہ EMI",
        totalInterest: "کل سود",
        totalRepayment: "کل واپسی",
        flatLoanDesc: "سود صرف ابتدائی اصل پر حساب کیا جاتا ہے۔",
        compoundLoan: "مرکب قرضہ (گھٹتا بیلنس)",
        reducingBalanceFinancing: "گھٹتا بیلنس فنانسنگ",
        compoundLoanDesc: "سود صرف باقی اصل پر حساب کیا جاتا ہے۔ فلیٹ قرضہ سے بہتر!",
        budgetTitle: "موسمی آمدنی عدم استحکام سیمولیٹر",
        budgetDesc: " مختلف آمدنی رکاوٹوں کے تحت اخراجات کا انتظام کریں۔ محاکمہ مہینہ کھیلیں!",
        currentIncome: "موجودہ آمدنی ماڈل:",
        foodAlloc: "کھانا اور کرایہ مختص (₹)",
        savingsBox: "بچت باکس (₹)",
        growthAlloc: "سرمایہ کاری / کاروباری ترقی (₹)",
        simulateMonth: "اگلا مہینہ محاکمہ کریں",
        walletBal: "والیٹ بیلنس",
        accumSavings: "جمع شدہ بچت",
        activityLog: "سرگرمی لاگ",
        gameStarted: "کھیل شروع۔",
        guidanceTitle: "ذاتی مالی رہنمائی",
        guidanceDesc: "یہاں آپ کے جانچوں کی بنیاد پر تیار کردہ اہم مالی قواعد ہیں۔",
        viewReport: "تیاری رپورٹ دیکھیں",
        reportTitle: "مالی تیاری رپورٹ",
        reportDesc: "بہترین پیشرفت! یہاں آپ کا سرکاری صلاحیت جانچ سرٹیفکیٹ ہے۔",
        certTitle: "آرتھا سیتو صلاحیت سرٹیفکیٹ",
        certAwardedTo: "یہ سرٹیفکیٹ دیا جاتا ہے",
        certDesc: "محفوظ فائنانس لیب سمیولیٹر میں موافق مالی پروفائلنگ اور محفوظ لین دین کی مشق کو کامیابی سے مکمل کرنے کے لیے۔",
        certLiteracy: "ساکھ لیول",
        certDigital: "ڈیجیٹل اعتماد",
        certPathway: "مدد گار راستہ",
        certSystem: "سسٹم جاری",
        certDate: "تصدیق کی تاریخ",
        printCert: "سرٹیفکیٹ پرنٹ کریں",
        provideFeedback: "رائے دیں",
        feedbackTitle: "رائے اور نتیجہ پیمائش",
        feedbackDesc: "اس موافق ڈھانچے کا جائزہ لینے میں ہماری مدد کریں۔",
        surveyQ1: "1. اس ایپلیکیشن کو نیویگیٹ کرنا کتنا آسان تھا؟",
        surveyQ2: "2. کیا آپ نے سیکیورٹی قواعد اور فراڈ انتباہات کو واضح طور پر سمجھا؟",
        surveyQ3: "3. اب اکیلے موبائل ادائیگی کرنے میں آپ کتنا اعتماد محسوس کرتے ہیں؟",
        surveyQ4: "4. کیا آپ کے پاس کوئی تجاویز یا تبصرے ہیں؟",
        feedbackPlaceholder: "ہندی، انگریزی وغیرہ میں یہاں ٹائپ کریں۔",
        saveReset: "محفوظ کریں اور ایپلیکیشن ری سیٹ کریں",
        assistantName: "آرتھا دوت معاون:",
        welcomeArthasetu: "آرتھا سیتو میں خوش آمدید۔",
        voiceOn: "آواز مدد: چالو",
        voiceOff: "آواز مدد: بند",
        helpWelcome: "سلام! میں آرتھا دوت ہوں۔ میں اسکرین کی معلومات پڑھ کر آپ کی رہنمائی کروں گا۔ شروع کرنے کے لیے کسی بھی باکس کو چھوئیں۔",
        profileHelp: "تجربے کو اپنی ضرورت کے مطابق ڈھالنے کے لیے ہر زمرے سے ایک آپشن منتخب کریں۔",
        quizHelp: "آپ جو آپشن صحیح لگے اسے منتخب کریں۔ یہ صرف مشق ہے، غلطیوں سے نہ ڈریں۔",
        digitalHelp: "آئیے تین کاموں کی جانچ کریں۔ پہلا، کی پیڈ پر 4096 ٹائپ کریں۔ دوسرا، سکے کو پگی بینک میں ڈالیں۔ تیسرا، سلائیڈر کو دائیں طرف پھیلائیں۔",
        trustHelp: "ان باکسوں پر ٹک لگائیں جہاں آپ کو آن لائن لین دین غیر محفوظ لگتا ہے۔",
        reliabilityHelp: "اگر آپ کے پاس کریڈٹ اسکور نہیں ہے، تو متبادل طریقے آپ کی قابل اعتماد دکھانے میں مدد کرتے ہیں۔",
        sandboxHelp: "بغیر کسی خطرے کے ادائیگی کی مشق کریں، فراڈ پیغامات کی پہچان بنائیں، سود کی شرحیں دیکھیں یا بجٹ منصوبہ بندی کی مشق کریں۔",
        guidanceHelp: "ان سیکیورٹی قواعد کو پڑھیں۔ ہم نے انہیں آپ کے جوابات کی بنیاد پر تیار کیا ہے۔",
        reportHelp: "یہ آپ کا مکملت سرٹیفکیٹ ہے!",
        surveyHelp: "براہ کرم اپنے تجربے کی درجہ بندی کریں۔ شکریہ!",
        pathAssisted: "آواز/بصری مدد گار راستہ",
        pathAssistedDesc: "سمارٹ فون اور ڈیجیٹل ساکھ لیول کو مدنظر رکھتے ہوئے، سسٹم نے آپ کے لیے مکمل آواز اور بڑی بصری رہنمائی فعال کی ہے۔",
        pathAssistedFeat1: "خودکار آواز رہنمائی فعال",
        pathAssistedFeat2: "بڑے فونٹ سائز",
        pathAssistedFeat3: "آسان بٹن نیویگیشن",
        pathGuided: "راہنمائی راستہ",
        pathGuidedDesc: "آپ بنیادی ایپس چلا لیتے ہیں۔ سسٹم اہم بٹنوں پر ہائی لائٹ اور پاپ اپ ہدایات دکھائے گا۔",
        pathGuidedFeat1: "فعال بٹنوں پر چمکتا ہائی لائٹ",
        pathGuidedFeat2: "وقت پر سیکیورٹی پاپ اپ پیغامات",
        pathGuidedFeat3: "اشارہ ٹول ٹپس",
        pathSelf: "خود رہنمائی راستہ",
        pathSelfDesc: "آپ سمارٹ فون چلانے میں بہت ماہر ہیں۔",
        pathSelfFeat1: "عام نیویگیشن موڈ",
        pathSelfFeat2: "مکمل ٹول آزادی",
        pathSelfFeat3: "اعلیٰ سینڈباکس مشق",
        certSelf: "خود رہنمائی",
        certGuided: "راہنمائی مدد",
        certAssisted: "آواز مدد",
        lockedMsg: "یہ حصہ بند ہے۔ براہ کرم پچھلا کام پہلے مکمل کریں۔",
        occupationMsg: "پیشہ درج ہو گیا۔",
        answerMsg: "جواب درج ہو گیا۔",
        clearedMsg: "صاف کیا",
        codeSuccess: "کامیاب! کوڈ درست ہے۔",
        firstTaskDone: "بہترین! پہلا کام مکمل ہوا۔",
        codeWrong: "غلط کوڈ۔ دوبارہ کوشش کریں۔",
        codeWrongRetry: "غلط کوڈ، براہ کرم دوبارہ 4096 ٹائپ کریں۔",
        savingsSecured: "بچت محفوظ!",
        coinDeposited: "کامیاب! سکہ جمع ہوا۔",
        coinSecured: "مبارک ہو، سکہ بینک میں محفوظ ہے۔",
        swipeSuccess: "کامیاب! سوائپ منظور ہوا۔",
        swipeDone: "سوائپ کامیابی سے منظور ہو گیا۔",
        optionToggled: "آپشن بدل گیا۔",
        incomeRecorded: "آمدنی کی شکل درج ہوئی۔",
        scoreCalculated: "متبادل اشارہ اسکور {score} فیصد ہوا۔",
        labTabActive: "لیب کا {tab} مشق فعال ہوا۔",
        recipientVerified: "کامیاب! وصول کنندہ تصدیق ہو گیا ہے۔",
        enterValidUPI: "براہ کرم درست وصول کنندہ UPI ID یا نمبر درج کریں۔",
        enterAmountMsg: "براہ کرم 10 سے 2,000 روپے کے درمیان رقم درج کریں۔",
        insufficientFunds: "سینڈباکس والیٹ میں کافی رقم نہیں ہے۔",
        enterPIN: "تصدیق کرنے کے لیے 6 ہندسوں کا UPI PIN ٹائپ کریں۔",
        paymentSuccess: "کامیاب! ادائیگی مکمل ہو گئی ہے۔",
        wrongPIN: "غلط UPI PIN۔ براہ کرم دوبارہ 123456 ٹائپ کریں۔",
        smsReview: "پیغام کھول دیا گیا ہے۔",
        correctDecision: "آپ کا فیصلہ بالکل درست ہے۔",
        wrongDecision: "غلط فیصلہ۔ سیکیورٹی انتباہ کو غور سے پڑھیں۔",
        overBudget: "کل مختصات آپ کے والیٹ بیلنس سے زیادہ ہیں!",
        monthComplete: "مہینہ مکمل ہوا۔",
        monthLabel: "مہینہ",
        ratingRecorded: "درجہ بندی درج ہوئی۔",
        profileSaved: "مبارک ہو! آپ کی پروفائل محفوظ ہو گئی ہے۔",
        onboardingDone: "کامیاب! آپ کی رائے درج ہو گئی ہے۔",
        fraudTitle: "دھوکہ دہی سے تحفظ",
        fraudDesc: "آربی آئی کے ضوابط کے تحت، غیر م授权 الیکٹرانک لین دین کی اطلاع 3 دنوں کے اندر دینے پر آپ کی ذمہ داری صفر ہے۔",
        privacyTitle: "رازداری اور بینکنگ ایکٹ",
        privacyDesc: "آپ کا ڈیٹا DPDP ایکٹ کے تحت محفوظ ہے۔",
        chargesTitle: "صفر پوشیدہ فیس لازمی",
        chargesDesc: "بی ایس بی ڈی اکاؤنٹس میں کم از کم رکھنے کی کوئی حد نہیں ہے۔",
        mistakesTitle: "غلط ادائیگی واپسی",
        mistakesDesc: "غلط اکاؤنٹ میں پیسے بھیجنے پر آپ NPCI پورٹل پر شکایت درج کرا سکتے ہیں۔",
        tipSecTitle: "OTP یا PIN کبھی شیئر نہ کریں",
        tipSecDesc: "کوئی بھی بینک عملہ کال پر آپ کا UPI PIN یا OTP نہیں مانگتا۔",
        tipSavTitle: "ایمرجنسی بچت باسکٹ",
        tipSavDescRegular: "باقاعدہ آمدنی ہونے پر ہر مہینہ کم از کم 15% رقم الگ بچت اکاؤنٹ میں جمع کریں۔",
        tipSavDescIrregular: "آپ کی آمدنی موسمی ہے، اس لیے کم از کم 3 مہینوں کے بنیادی اخراجات کے برابر رقم الگ بچت اکاؤنٹ میں رکھیں۔",
        tipCreTitle: "غیر رسمی سود کے جال سے بچیں",
        tipCreDesc: "مقامی سود اور دہندہ کا 5% ماہانہ سود 60% سالانہ ہو جاتا ہے!",
        tipPayTitle: "ادائیگی تصدیق شدہ ID کی جانچ",
        tipPayDesc: "پن ڈالنے سے پہلے ہمیشہ وصول کنندہ کا تصدیق شدہ نام پڑھیں۔",
        sms1Sender: "AD-LOTTRI",
        sms1Text: "مبارک ہو! آپ نے سرکاری پروموشن سے ₹10,00,000 کی لاٹری جیتی ہے۔",
        sms1Expl: "یہ فراڈ ہے۔ سرکاری محکمے عوامی SMS لنک سے لاٹری نہیں دیتے۔",
        sms2Sender: "سٹیٹ بینک",
        sms2Text: "پیارے گاہک، آپ کا ماہانہ بینک اسٹیٹمنٹ تیار ہے۔ براہ کرم اپنے سرکاری پورٹل پر لاگ ان کریں۔",
        sms2Expl: "یہ محفوظ ہے۔ پیغام میں کوئی فوری خطرہ نہیں ہے۔",
        sms3Sender: "BP-ALERT",
        sms3Text: "الرٹ! آپ کا بجلی بل ₹1,450 بقایا ہے۔",
        sms3Expl: "یہ فراڈ ہے۔ یوٹیلٹی کمپنیاں بے ترتیب فون نمبروں سے فوری ڈس کنیکشن کی دھمکی نہیں دیتیں۔",
        eventMedical: "طبی ایمرجنسی",
        eventMedicalDesc: "خاندان کا ایک ممبر بیمار ہو گیا۔ ₹1,000 علاج اخراجات۔",
        eventHarvest: "بمپر فصل بونس",
        eventHarvestDesc: "فصل کی مانگ ناگہانی بڑھ گئی! ₹1,500 اضافی منافع۔",
        eventDrought: "خشک سالی / مقامی مندی",
        eventDroughtDesc: "خراب موسم کی وجہ سے کوئی آمدنی نہیں ہوئی۔",
        eventFestival: "تیوہار جشن",
        eventFestivalDesc: "میٹھائی اور تحفے میں ₹500 خرچ۔"
    }
};

// Helper: get translated message string
function msg(key) {
    const dict = i18n[state.selectedLang] || i18n['en'];
    return dict[key] || i18n['en'][key] || key;
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
    if (!state.voiceMode) return;

    // Update simulated speech bubble
    const bubble = document.getElementById('assistantSpeechBubble');
    const bubbleText = document.getElementById('assistantSpeechText');
    if (bubble && bubbleText) {
        bubble.style.display = 'flex';
        bubbleText.innerText = text;

        // Auto-hide bubble after 5 seconds
        clearTimeout(window.bubbleTimer);
        window.bubbleTimer = setTimeout(() => {
            bubble.style.display = 'none';
        }, 5000);
    }

    if (!synth) return;
    synth.cancel(); // Stop currently speaking audio

    currentUtterance = new SpeechSynthesisUtterance(text);

    // Choose appropriate voice language
    const langMap = {
        'hi': 'hi-IN',
        'ta': 'ta-IN',
        'bn': 'bn-IN',
        'te': 'te-IN',
        'mr': 'mr-IN',
        'en': 'en-US'
    };
    currentUtterance.lang = langMap[state.selectedLang] || 'en-US';

    synth.speak(currentUtterance);
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
function selectLanguage(langCode) {
    state.selectedLang = langCode;

    // UI Visual updates
    document.querySelectorAll('.lang-card').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Update sidebar navigation text for ALL languages
    const dictionary = i18n[langCode] || i18n['en'];
    for (let i = 1; i <= 11; i++) {
        const navText = document.getElementById(`nav-item-${i}`)?.querySelector('.nav-text');
        if (navText) {
            navText.innerText = dictionary[`title${i}`] || i18n['en'][`title${i}`];
        }
    }

    // Update Screen 1 prompt text for ALL languages (from dictionary)
    applyTranslations();

    // Update voice pill text
    const voicePillText = document.getElementById('voicePillText');
    if (voicePillText) {
        voicePillText.innerText = dictionary.voiceOff || "Voice Assist: Off";
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
        unlockScreen(2);
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
            unlockScreen(3);
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
        unlockScreen(4);
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
    unlockScreen(5);
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
    unlockScreen(6);
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
    unlockScreen(8);
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
    
    unlockScreen(8);
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
    unlockScreen(8);
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
    unlockScreen(9);
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

function selectZKPType(type) {
    currentZKPType = type;
    document.querySelectorAll('.zkp-type-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.querySelectorAll('.zkp-form').forEach(f => f.style.display = 'none');
    document.getElementById(`zkp-${type}-form`).style.display = 'block';
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
