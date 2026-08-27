# Image Descriptions - All 23 Plots

## Table of Contents

- [Univariate Analysis (01-03)](#univariate-analysis)
- [Bivariate Analysis (04-07)](#bivariate-analysis)
- [Correlation Analysis (08-12)](#correlation-analysis)
- [Clustering & PCA (13-18)](#clustering--pca)
- [Classification Models (19-23)](#classification-models)

---

## Univariate Analysis

### 01_univariate_income_work.png

**What it shows:** Four histograms displaying distributions of key numeric variables.

**Panel 1 - Monthly Gross Income Distribution:**
- X-axis: Gross Income in INR
- Y-axis: Frequency (count of workers)
- Shows a **right-skewed distribution** — most workers earn between ₹5,000-₹15,000 gross
- Red dashed line = Mean income
- Green dashed line = Median income
- **Interpretation:** Income is not normally distributed; median is lower than mean due to high earners pulling the average up

**Panel 2 - Monthly Net Income Distribution:**
- Similar right-skewed pattern but shifted left (lower values)
- Net income is after fuel and EMI deductions
- **Interpretation:** Significant gap between gross and net income due to operational costs

**Panel 3 - Daily Hours Worked Distribution:**
- Shows how many hours workers work per day
- Peak around 8-10 hours
- **Interpretation:** Most gig workers work full-time equivalent hours

**Panel 4 - Platform Rating Distribution:**
- Ratings cluster between 3.5-4.5 out of 5
- Very few workers below 3.0
- **Interpretation:** Platform ratings are generally high; low ratings may indicate poor performance or unfair rating systems

---

### 02_univariate_platform.png

**What it shows:** Distribution of workers across platforms.

**Left Panel - Workers by Platform (Bar Chart):**
- X-axis: Platform names (Ola, Uber, Zomato, Swiggy, Rapido, etc.)
- Y-axis: Number of workers
- Shows which platforms have the most workers in the dataset
- **Interpretation:** Data covers all major Indian gig platforms; no single platform dominates excessively

**Right Panel - Workers by Platform Type (Bar Chart):**
- X-axis: Platform types (ride_hailing, food_delivery, bike_taxi, logistics, quick_commerce, home_services, hyperlocal)
- Y-axis: Number of workers
- **Interpretation:** Food delivery and ride-hailing are the largest gig sectors

---

### 03_univariate_demographics.png

**What it shows:** Four panels showing demographic distributions.

**Panel 1 - Education Level (Horizontal Bar Chart):**
- Shows count of workers at each education level
- Class 10 pass and Class 12 pass are most common
- **Interpretation:** Most gig workers have basic education; few are graduates

**Panel 2 - City Tier (Pie Chart):**
- T1 (metro): ~40%, T2 (mid-size): ~35%, T3 (smaller): ~25%
- **Interpretation:** Gig work is present across all city types, slightly concentrated in metros

**Panel 3 - Gender (Pie Chart):**
- Male: ~90%, Female: ~10%
- **Interpretation:** Gig economy is heavily male-dominated

**Panel 4 - Trust Category (Bar Chart):**
- High Trust: ~76%, Medium Trust: ~21%, Low Trust: ~3%
- **Interpretation:** Majority of workers in dataset fall into high trust category (based on our composite scoring)

---

## Bivariate Analysis

### 04_bivariate_income_platform.png

**What it shows:** How income varies across platform types and city tiers.

**Left Panel - Net Income by Platform Type (Box Plot):**
- X-axis: Platform types
- Y-axis: Monthly Net Income (INR)
- Box shows IQR (25th-75th percentile), line = median, whiskers = range, dots = outliers
- **Interpretation:** ride_hailing and home_services tend to have higher median income; food_delivery is more variable

**Right Panel - Net Income by City Tier (Box Plot):**
- X-axis: City tiers (T1, T2, T3)
- Y-axis: Monthly Net Income (INR)
- **Interpretation:** T1 cities have slightly higher income but also higher variance; T3 cities have lower but more consistent income

---

### 05_bivariate_income_education.png

**What it shows:** Relationship between education and income/trust.

**Left Panel - Net Income by Education Level (Box Plot):**
- X-axis: Education levels (ordered from no formal to post-graduate)
- Y-axis: Monthly Net Income (INR)
- **Interpretation:** Higher education correlates with higher income, but the relationship is not linear; ITI/Diploma holders earn well due to technical skills

**Right Panel - Trust Score by Education Level (Box Plot):**
- X-axis: Education levels
- Y-axis: Trust Score (0-1)
- **Interpretation:** More educated workers tend to have higher trust scores, but the spread is large

---

### 06_bivariate_rating_trust.png

**What it shows:** Platform rating vs cancellation rate, and income by trust category.

**Left Panel - Platform Rating vs Cancellation Rate (Scatter Plot):**
- X-axis: Order cancellation rate (%)
- Y-axis: Platform rating (out of 5)
- Each dot = one worker, alpha=0.1 for transparency
- Spearman correlation coefficient displayed
- **Interpretation:** Very weak negative correlation (r=-0.003) — rating and cancellation rate are nearly independent, suggesting they capture different aspects of behavior

**Right Panel - Net Income by Trust Category (Box Plot):**
- X-axis: Trust categories (Low, Medium, High)
- Y-axis: Monthly Net Income (INR)
- **Interpretation:** High trust workers tend to have slightly higher income, but the overlap is significant — trust is not just about income

---

### 07_bivariate_vehicle_income.png

**What it shows:** Net income by vehicle type.

**Box Plot:**
- X-axis: Vehicle types (Car own, Car EMI, Motorcycle own, Motorcycle EMI, Scooter, E-bike, Bicycle, Auto-rickshaw, Mini truck, Van, Public transport)
- Y-axis: Monthly Net Income (INR)
- Ordered by median income (highest to lowest)
- **Interpretation:** Vehicle ownership (especially cars) correlates with higher income; bicycle riders earn least (typically food delivery in dense areas); EMI burden reduces net income

---

## Correlation Analysis

### 08_pearson_correlation_heatmap.png

**What it shows:** Pearson correlation matrix for all 34 numeric features.

**Heatmap:**
- Color scale: Red (positive correlation) to Blue (negative correlation)
- White = no correlation
- Upper triangle masked (redundant with lower triangle)
- **Key observations:**
  - `monthly_gross_income` and `monthly_net_income` are highly correlated (expected)
  - `has_bank_account`, `has_upi`, `has_social_security` correlate with each other (financial inclusion cluster)
  - `digital_literacy_score` correlates with education
  - `emi_burden_ratio` negatively correlates with income (high EMI = lower net income)

---

### 09_spearman_correlation_heatmap.png

**What it shows:** Spearman rank correlation matrix.

**Why Spearman instead of Pearson:**
- Spearman measures **monotonic** relationships (not just linear)
- Better for ordinal variables (education, ratings, trust categories)
- Robust to outliers

**Key observations:**
- Stronger correlations visible for ordinal variables
- `years_on_platform` shows clearer relationship with trust-related features
- `financial_inclusion_index` shows strong correlation with multiple trust signals

---

### 10_trust_signal_correlation.png

**What it shows:** Focused correlation matrix for 15 key trust-related features.

**Features included:**
- Platform rating, cancellation rate
- Years on platform, income, work hours
- Digital literacy, bank/UPI/social security flags
- Education, commitment score, financial inclusion index
- Trust raw score, is_high_trust binary

**Key findings:**
- `financial_inclusion_index` has the **strongest correlation with trust_raw** (r=0.892)
- `has_upi` is second strongest (r=0.662)
- `years_on_platform` correlates positively (r=0.345)
- `order_cancellation_rate` has weak negative correlation (r=-0.057)

---

### 11_mutual_information_scores.png

**What it shows:** Mutual Information scores for predicting High Trust status.

**Bar Chart:**
- X-axis: MI Score (0 to 0.4)
- Y-axis: Features (sorted by importance)
- **What MI measures:** How much knowing one variable reduces uncertainty about another
- Unlike correlation, MI captures **non-linear** relationships

**Key findings:**
1. `financial_inclusion_index`: MI = 0.3846 (dominant predictor)
2. `has_upi`: MI = 0.2523
3. `has_bank_account`: MI = 0.1481
4. `digital_readiness`: MI = 0.1152
5. `digital_literacy_score`: MI = 0.0477

**Interpretation:** Financial inclusion signals are far more predictive of trust than income or work behavior alone

---

### 12_scatter_pairs_top_features.png

**What it shows:** Six scatter plots of key feature pairs.

**Panel 1 - commitment_score vs trust_raw:**
- Positive correlation visible
- Workers with higher commitment (rating × low cancellation) have higher trust

**Panel 2 - monthly_net_income_inr vs trust_raw:**
- Weak positive relationship
- Income alone is not a strong trust predictor

**Panel 3 - years_on_platform vs trust_raw:**
- Clear positive trend
- Longer tenure = higher trust

**Panel 4 - financial_inclusion_index vs trust_raw:**
- Very strong positive relationship
- Nearly deterministic — financial inclusion is the strongest signal

**Panel 5 - daily_hours_worked vs trust_raw:**
- Very weak relationship
- Working more hours doesn't directly increase trust

**Panel 6 - orders_or_rides_per_day vs monthly_net_income_inr:**
- Weak positive relationship
- More orders = more income, but with high variance

---

## Clustering & PCA

### 13_elbow_method.png

**What it shows:** Optimal number of clusters for K-Means.

**Left Panel - Elbow Method:**
- X-axis: Number of clusters (K = 2 to 10)
- Y-axis: Inertia (within-cluster sum of squares)
- "Elbow" point where inertia decrease slows = optimal K
- **Interpretation:** Elbow is not very sharp, suggesting gradual improvement; K=4 is reasonable

**Right Panel - Silhouette Score:**
- X-axis: Number of clusters (K)
- Y-axis: Silhouette score (how similar points are to their cluster vs others)
- Higher = better defined clusters
- **Interpretation:** K=2 has highest silhouette but may be too few; K=4 is a good balance

---

### 14_kmeans_pca_clusters.png

**What it shows:** Worker clusters projected onto 2D PCA space.

**Left Panel - K-Means Clusters:**
- X-axis: PC1 (10.7% variance)
- Y-axis: PC2 (8.6% variance)
- Colors = 4 K-Means clusters
- **Interpretation:** Clusters overlap significantly in 2D PCA space, suggesting the differences are in higher dimensions

**Right Panel - Trust Categories:**
- Same PCA projection, colored by trust level
- Green = High Trust, Yellow = Medium, Red = Low
- **Interpretation:** Trust categories separate better than K-Means clusters in PCA space

---

### 15_cluster_profiles.png

**What it shows:** Normalized feature values for each cluster.

**Grouped Bar Chart:**
- X-axis: Features (normalized 0-1)
- Y-axis: Normalized value
- 4 bars per feature (one per cluster)
- **Interpretation:** Shows which features differentiate each cluster
  - Cluster 0: Lower financial inclusion, higher cancellation rates
  - Cluster 1: High digital literacy, good financial inclusion
  - Cluster 2: Medium across all features
  - Cluster 3: Highest financial inclusion, best ratings

---

### 16_dendrogram.png

**What it shows:** Hierarchical clustering dendrogram.

**Dendrogram:**
- X-axis: Sample indices / cluster sizes
- Y-axis: Distance (Ward linkage)
- Truncated to show last 30 merges
- **Interpretation:** Shows natural groupings; the vertical distance between merges indicates how distinct clusters are; supports K=3 or K=4

---

### 17_pca_scree_loadings.png

**What it shows:** PCA variance explained and feature loadings.

**Left Panel - Scree Plot:**
- X-axis: Principal Component number
- Y-axis: Variance explained (%)
- Bar = individual variance, Line = cumulative variance
- Green dashed line = 90% threshold
- **Interpretation:** 15 components needed to explain 90% of variance; data has many independent dimensions

**Right Panel - Feature Loadings (PC1 & PC2):**
- Horizontal bar chart showing feature contributions to PC1 (blue) and PC2 (red)
- **PC1 interpretation:** Education + Digital literacy + Financial inclusion (positive) vs Orders per day (negative)
- **PC2 interpretation:** EMI burden + Fuel cost (positive) vs Vehicle ownership + Net income (negative)

---

### 18_trust_by_cluster.png

**What it shows:** Trust category distribution within each K-Means cluster.

**Stacked Bar Chart:**
- X-axis: K-Means clusters (0-3)
- Y-axis: Percentage
- Colors: Green = High Trust, Yellow = Medium, Red = Low
- **Key findings:**
  - Cluster 0: Only 55% High Trust (includes most Low Trust workers)
  - Cluster 1: 92% High Trust
  - Cluster 2: 45% High Trust
  - Cluster 3: 94% High Trust (best performing)

---

## Classification Models

### 19_roc_precision_curves.png

**What it shows:** Model performance curves.

**Left Panel - ROC Curves:**
- X-axis: False Positive Rate
- Y-axis: True Positive Rate
- Each line = one model
- Diagonal dashed line = random classifier
- AUC values displayed in legend
- **Interpretation:** All models hug the top-left corner (near-perfect); XGBoost and Gradient Boosting are best

**Right Panel - Precision-Recall Curves:**
- X-axis: Recall (sensitivity)
- Y-axis: Precision (positive predictive value)
- Average Precision (AP) displayed
- **Interpretation:** All models maintain high precision across recall levels

---

### 20_confusion_matrices.png

**What it shows:** Confusion matrices for all 4 models.

**Layout:** 4 heatmaps side by side (one per model)

**Each matrix:**
- Rows: Actual (Low/Med Trust, High Trust)
- Columns: Predicted (Low/Med Trust, High Trust)
- Numbers = count of workers
- **Interpretation:**
  - Logistic Regression: Very few misclassifications
  - Random Forest: Slightly more errors (96% precision for Low/Med)
  - Gradient Boosting: Near-perfect
  - XGBoost: Near-perfect

---

### 21_feature_importance.png

**What it shows:** Feature importance from tree-based models.

**Left Panel - Random Forest:**
- Top 15 features by importance
- `financial_inclusion_index` dominates (0.336)
- `has_upi` second (0.216)
- `has_bank_account` third (0.108)

**Right Panel - XGBoost:**
- Top 15 features by importance
- `financial_inclusion_index` overwhelmingly dominant (0.819)
- Other features have much smaller importance
- **Interpretation:** XGBoost finds financial inclusion so predictive it concentrates most weight there

---

### 22_logistic_coefficients.png

**What it shows:** Logistic regression coefficients.

**Horizontal Bar Chart:**
- Green bars = positive coefficients (increase trust probability)
- Red bars = negative coefficients (decrease trust probability)
- **Top positive (increase trust):**
  1. financial_inclusion_index: +13.74
  2. years_on_platform: +10.29
  3. has_bank_account: +10.27
  4. has_social_security: +9.03
  5. has_upi: +8.23
- **Top negative (decrease trust):**
  1. digital_literacy_score: -1.48
  2. order_cancellation_rate: -1.00
  3. emi_burden_ratio: -0.12
- **Interpretation:** Financial inclusion features have the largest impact on trust prediction

---

### 23_trust_score_distribution.png

**What it shows:** Distribution of ensemble trust scores.

**Left Panel - Histogram:**
- X-axis: Trust Score (0 to 1)
- Y-axis: Frequency
- Red dashed line = Mean score
- **Interpretation:** Bimodal distribution — workers cluster at very low (~0.1) or very high (~1.0) trust scores; few in between

**Right Panel - Box Plot by Trust Category:**
- X-axis: Trust categories
- Y-axis: Trust Score
- **Interpretation:** Clear separation between categories validates our trust scoring approach

---

## Summary of Why Each Plot Was Created

| Plot | Purpose | Research Question Answered |
|------|---------|---------------------------|
| 01 | Distribution understanding | What does the income/work landscape look like? |
| 02 | Platform coverage | Are all gig sectors represented? |
| 03 | Demographics | Who are these workers? |
| 04-07 | Group comparisons | How do income/trust differ across groups? |
| 08-10 | Correlations | Which features relate to each other and to trust? |
| 11 | Non-linear relationships | What features predict trust beyond linear correlations? |
| 12 | Visual validation | Do scatter plots confirm correlation findings? |
| 13 | Optimal clusters | How many natural worker segments exist? |
| 14-15 | Cluster interpretation | What defines each worker segment? |
| 16 | Hierarchy | Are clusters well-separated? |
| 17-18 | Dimensionality | What are the main underlying factors? |
| 19-20 | Model performance | How accurate are trust predictions? |
| 21-22 | Feature importance | Which signals matter most for trust? |
| 23 | Score validation | Does the trust score work as expected? |

---
