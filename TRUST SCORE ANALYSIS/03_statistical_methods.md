# Statistical Methods - Detailed Explanation

## Why Each Method Was Chosen

---

## 1. Descriptive Statistics

### What It Does
Calculates mean, median, standard deviation, min, max, and quartiles for numeric variables.

### Why We Used It
- **Foundation of all analysis** — you must understand your data before modeling
- Reveals the **central tendency** and **spread** of income, work hours, ratings
- Identifies **skewness** — income data is right-skewed (most earn low, few earn high)
- Helps detect **outliers** — workers earning ₹50,000+ or working 15+ hours

### What It Told Us
- Average net income: ₹10,235/month
- Average daily hours: 8.8 hours
- Average platform rating: 4.1/5
- 76.4% of workers are "High Trust"

---

## 2. Histograms

### What It Does
Shows frequency distribution of a single numeric variable.

### Why We Used It
- Visualize **income distribution** — is it normal, skewed, bimodal?
- Identify **natural breakpoints** — where do most workers cluster?
- Detect **data quality issues** — unexpected peaks or gaps

### What It Told Us
- Income is **right-skewed** — most workers earn ₹5,000-₹15,000
- Ratings cluster between 3.5-4.5 — very few low ratings
- Daily hours peak at 8-10 hours — full-time work pattern

---

## 3. Box Plots

### What It Does
Shows median, quartiles, and outliers for numeric variables grouped by categories.

### Why We Used It
- **Compare distributions** across groups (platform types, education levels)
- Identify **statistical outliers** (dots beyond whiskers)
- See **spread differences** — do some groups have more variable income?

### What It Told Us
- Ride-hailing has higher median income than food delivery
- Graduate workers earn more on average, but with high variance
- Car owners earn significantly more than bicycle riders

---

## 4. ANOVA (Analysis of Variance)

### What It Does
Tests if the **means of 3+ groups are significantly different**.

### Why We Used It
- Test if income differs significantly across **platform types** (7 groups)
- Test if income differs across **education levels** (7 groups)
- Provides **p-value** to determine if differences are statistically significant

### How It Works
- **Null hypothesis:** All group means are equal
- **If p < 0.05:** At least one group differs significantly
- **F-statistic:** Ratio of between-group variance to within-group variance

### What It Told Us
- **Income ~ Platform Type:** F=864.16, p<0.001 → Significant difference
- **Income ~ Education:** F=48.83, p<0.001 → Significant difference
- **Interpretation:** Platform type and education genuinely affect income, not just random variation

---

## 5. Independent T-Test

### What It Does
Tests if the **means of two groups are significantly different**.

### Why We Used It
- Compare income between **migrants vs non-migrants** (2 groups)
- Simple, well-understood test for binary comparisons

### How It Works
- **Null hypothesis:** Both groups have same mean income
- **t-statistic:** Difference between means relative to variability
- **p-value:** Probability of observing this difference by chance

### What It Told Us
- t=-2.06, p=0.04 → **Marginally significant** difference
- Migrants earn slightly less on average
- **Interpretation:** Migration status has a small but real effect on income

---

## 6. Chi-Square Test

### What It Does
Tests if two **categorical variables are associated** (not independent).

### Why We Used It
- Test if **bank account type** is associated with **trust category**
- Test if **UPI adoption** is associated with **trust category**
- Test if **social security coverage** is associated with **trust category**

### How It Works
- Creates a **contingency table** (counts for each combination)
- Compares observed counts to expected counts (if independent)
- **Cramér's V:** Measures strength of association (0 = none, 1 = perfect)

### What It Told Us
- Bank Account ~ Trust: chi2=22,061, p<0.001, Cramér's V=0.47 → **Strong association**
- UPI ~ Trust: chi2=24,068, p<0.001, Cramér's V=0.49 → **Strong association**
- Migrant ~ Trust: chi2=1.84, p=0.40 → **No significant association**
- **Interpretation:** Financial inclusion (bank, UPI) is strongly linked to trust; migration status is not

---

## 7. Spearman Rank Correlation

### What It Does
Measures **monotonic relationship** between two variables using ranks.

### Why We Used It
- Better than Pearson for **ordinal variables** (education, ratings, trust categories)
- **Robust to outliers** — doesn't assume normal distribution
- Captures **non-linear but consistent** relationships

### How It Works
- Ranks both variables separately
- Correlates the ranks (not raw values)
- **r = +1:** Perfect positive monotonic relationship
- **r = -1:** Perfect negative monotonic relationship
- **r = 0:** No monotonic relationship

### What It Told Us
- financial_inclusion_index ~ trust: r=0.892 → **Very strong positive**
- years_on_platform ~ trust: r=0.345 → **Moderate positive**
- order_cancellation_rate ~ trust: r=-0.057 → **Very weak negative**
- **Interpretation:** Financial inclusion is the dominant trust predictor

---

## 8. Pearson Correlation

### What It Does
Measures **linear relationship** between two continuous variables.

### Why We Used It
- Standard measure for **linear associations**
- Works well for normally distributed variables
- Easy to interpret (r = correlation coefficient)

### How It Works
- Measures how much variables move together relative to their individual spreads
- Assumes **linear relationship** and **normal distribution**
- **r = 0.7 to 1.0:** Strong positive
- **r = -0.7 to -1.0:** Strong negative
- **r = -0.3 to 0.3:** Weak

### What It Told Us
- gross_income ~ net_income: r=0.95 → **Very strong** (expected)
- has_bank_account ~ has_upi: r=0.45 → **Moderate** (financial inclusion cluster)
- emi_burden_ratio ~ net_income: r=-0.31 → **Moderate negative** (EMI reduces net income)

---

## 9. Mutual Information

### What It Does
Measures **how much knowing one variable reduces uncertainty about another**.

### Why We Used It
- Captures **non-linear relationships** that correlation misses
- Works for **both continuous and categorical** variables
- Excellent for **feature selection** in machine learning

### How It Works
- Based on information theory (entropy)
- **MI = 0:** Variables are independent
- **MI > 0:** Variables are dependent (higher = more dependent)
- Unlike correlation, MI is always **non-negative**

### What It Told Us
- financial_inclusion_index: MI=0.385 → **Strong predictor** of trust
- has_upi: MI=0.252 → **Good predictor**
- monthly_net_income: MI=0.000 → **Not predictive** (income alone doesn't predict trust)
- **Interpretation:** Non-linear relationships exist; financial inclusion matters more than raw income

---

## 10. K-Means Clustering

### What It Does
Groups data into **K clusters** based on feature similarity.

### Why We Used It
- **Unsupervised** — discovers natural groupings without labels
- Identifies **worker segments** with similar trust profiles
- Helps understand **heterogeneity** in the gig worker population

### How It Works
1. Initialize K random centroids
2. Assign each point to nearest centroid
3. Recalculate centroids as cluster means
4. Repeat until convergence

### What It Told Us
- **K=4 clusters identified:**
  - Cluster 0 (4,532): Mixed trust, lower financial inclusion
  - Cluster 1 (12,095): High trust, digital-savvy
  - Cluster 2 (9,120): Medium trust, partial inclusion
  - Cluster 3 (24,253): Highest trust, best financial inclusion
- **Interpretation:** Workers naturally segment into trust profiles based on financial behavior

---

## 11. Hierarchical Clustering

### What It Does
Builds a **tree of clusters** (dendrogram) showing nested groupings.

### Why We Used It
- Visualizes **natural groupings** without pre-specifying K
- Shows **distance between clusters** — how distinct they are
- Useful for **exploratory analysis** before K-Means

### How It Works
1. Start with each point as its own cluster
2. Merge closest pairs iteratively
3. Record merge distances
4. Plot as dendrogram

### What It Told Us
- Clear separation into 3-4 major groups
- Supports K=4 choice from K-Means
- Some clusters merge at similar distances, suggesting overlapping profiles

---

## 12. Principal Component Analysis (PCA)

### What It Does
Reduces **high-dimensional data** to fewer dimensions while preserving variance.

### Why We Used It
- 31 features are hard to visualize → reduce to 2-3 for plotting
- Identify **latent factors** (e.g., "financial literacy" underlying multiple features)
- Remove **multicollinearity** (correlated features)

### How It Works
1. Standardize all features
2. Compute covariance matrix
3. Find eigenvectors (principal components)
4. Project data onto top components

### What It Told Us
- **PC1 (10.7%):** Education + Digital literacy + Financial inclusion
- **PC2 (8.6%):** EMI burden + Fuel cost vs Vehicle ownership + Income
- **15 components needed** for 90% variance — data has many independent dimensions
- **Interpretation:** Financial inclusion is the strongest underlying factor

---

## 13. Logistic Regression

### What It Does
Predicts **binary outcome** (High Trust vs Low/Medium Trust) using linear combination of features.

### Why We Used It
- **Baseline model** — simple, interpretable
- Coefficients show **direction and magnitude** of feature effects
- Fast to train, easy to explain to non-technical audience

### How It Works
1. Model: P(High Trust) = sigmoid(β₀ + β₁x₁ + β₂x₂ + ...)
2. Train coefficients (β) using maximum likelihood
3. Predict probability using sigmoid function
4. Classify using threshold (typically 0.5)

### What It Told Us
- **Top positive coefficients:**
  - financial_inclusion_index: +13.74
  - years_on_platform: +10.29
  - has_bank_account: +10.27
- **Top negative coefficients:**
  - digital_literacy_score: -1.48
  - order_cancellation_rate: -1.00
- **Interpretation:** Financial inclusion has the largest impact on trust prediction

---

## 14. Random Forest

### What It Does
Ensemble of **decision trees** that votes on classification.

### Why We Used It
- **Feature importance** — ranks which features matter most
- Handles **non-linear relationships** automatically
- Robust to **overfitting** (averages many trees)

### How It Works
1. Train many decision trees on random subsets of data
2. Each tree votes on the class
3. Majority vote = final prediction
4. Feature importance = how much each feature reduces impurity

### What It Told Us
- **Top features:**
  1. financial_inclusion_index: 0.336
  2. has_upi: 0.216
  3. has_bank_account: 0.108
- **Interpretation:** Financial inclusion features dominate trust prediction

---

## 15. XGBoost

### What It Does
**Gradient boosting** ensemble that sequentially improves predictions.

### Why We Used It
- **Best predictive performance** among tested models
- Handles **class imbalance** (76% High Trust vs 24% Low/Medium)
- State-of-the-art for tabular data

### How It Works
1. Start with simple prediction (e.g., mean)
2. Calculate errors
3. Train tree to predict errors
4. Add tree to ensemble
5. Repeat, focusing on hard-to-predict cases

### What It Told Us
- **ROC-AUC: 0.9999** (near-perfect)
- **financial_inclusion_index: 0.819** importance (dominates)
- **Interpretation:** Financial inclusion is so predictive it overwhelms other features

---

## 16. ROC-AUC Curve

### What It Does
Measures **model discrimination ability** — how well it separates classes.

### Why We Used It
- **Threshold-independent** — evaluates all classification thresholds
- Standard metric for **binary classification**
- **AUC = 1.0:** Perfect classifier
- **AUC = 0.5:** Random classifier

### What It Told Us
- All models achieved AUC > 0.998
- XGBoost: AUC = 0.9999
- **Interpretation:** Models can almost perfectly distinguish trust categories

---

## 17. Confusion Matrix

### What It Does
Shows **actual vs predicted** classifications.

### Why We Used It
- Reveals **type of errors** (false positives vs false negatives)
- Shows **precision** (how many predicted positives are correct)
- Shows **recall** (how many actual positives are captured)

### What It Told Us
- XGBoost: 0 errors for Low/Med Trust, ~3 errors for High Trust
- Gradient Boosting: Similar near-perfect performance
- **Interpretation:** Models are highly accurate with minimal misclassification

---

## 18. Feature Importance (Tree-Based)

### What It Does
Ranks features by **how much they reduce prediction error**.

### Why We Used It
- Directly answers: **Which signals matter most for trust?**
- Tree-based importance is **model-specific** (different models may rank differently)
- Essential for **interpreting** black-box models

### What It Told Us
- **Random Forest:** financial_inclusion (33.6%), has_upi (21.6%), has_bank (10.8%)
- **XGBoost:** financial_inclusion (81.9%), commitment_score (4.2%), years_on_platform (3.3%)
- **Interpretation:** Financial inclusion is the single most important trust signal

---

## Summary: Why This Method Combination Works

| Analysis Stage | Methods | Purpose |
|----------------|---------|---------|
| **Understanding** | Descriptive stats, histograms, box plots | Know your data |
| **Testing** | ANOVA, T-test, Chi-Square | Validate hypotheses statistically |
| **Relationships** | Spearman, Pearson, Mutual Information | Find which features relate to trust |
| **Segmentation** | K-Means, Hierarchical, PCA | Discover natural worker groups |
| **Prediction** | Logistic, RF, GBM, XGBoost | Build trust scoring models |
| **Evaluation** | ROC-AUC, Confusion Matrix | Validate model performance |
| **Interpretation** | Feature importance, Coefficients | Explain what drives trust |

---

## Key Takeaway

> **Financial inclusion (bank account + UPI + social security) is the strongest non-traditional trust signal for credit-invisible gig workers.** It alone explains 81.9% of model decisions. Combined with platform tenure and commitment score, these signals can replace traditional credit scores for lending decisions.

---
