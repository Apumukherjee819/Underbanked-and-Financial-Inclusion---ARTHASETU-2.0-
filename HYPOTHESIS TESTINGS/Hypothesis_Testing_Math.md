# Hypothesis Testing — Mathematical Calculations

## Table of Contents
1. [Pearson Correlation Coefficient](#1-pearson-correlation-coefficient)
2. [Spearman Rank Correlation](#2-spearman-rank-correlation)
3. [One-Way ANOVA (F-test)](#3-one-way-anova-f-test)
4. [Kruskal-Wallis Test](#4-kruskal-wallis-test)
5. [OLS Regression](#5-ols-regression)
6. [Variance Inflation Factor (VIF)](#6-variance-inflation-factor-vif)
7. [Interaction Effects in Regression](#7-interaction-effects-in-regression)

---

## 1. Pearson Correlation Coefficient

### What It Measures
Quantifies the **linear** strength and direction of association between two continuous variables X and Y.

### Formula

$$
r = \frac{\sum_{i=1}^{n}(x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum_{i=1}^{n}(x_i - \bar{x})^2 \cdot \sum_{i=1}^{n}(y_i - \bar{y})^2}}
$$

### Step-by-Step Calculation

**Given:** Two variables X = [x₁, x₂, ..., xₙ] and Y = [y₁, y₂, ..., yₙ]

**Step 1:** Compute the means

$$
\bar{x} = \frac{1}{n}\sum_{i=1}^{n}x_i, \quad \bar{y} = \frac{1}{n}\sum_{i=1}^{n}y_i
$$

**Step 2:** Compute deviations from mean for each observation

$$
dx_i = x_i - \bar{x}, \quad dy_i = y_i - \bar{y}
$$

**Step 3:** Compute the numerator (covariance × n)

$$
\text{Numerator} = \sum_{i=1}^{n} dx_i \cdot dy_i
$$

**Step 4:** Compute the denominator (product of standard deviations × n)

$$
\text{Denominator} = \sqrt{\sum_{i=1}^{n} dx_i^2 \cdot \sum_{i=1}^{n} dy_i^2}
$$

**Step 5:** Compute r

$$
r = \frac{\text{Numerator}}{\text{Denominator}}
$$

**Range:** r ∈ [-1, +1]
- r > 0 → positive correlation
- r < 0 → negative correlation
- r = 0 → no linear correlation

### Worked Example

**Data:** X = [1, 2, 3, 4, 5], Y = [2, 4, 5, 4, 5]

| i | xᵢ | yᵢ | dxᵢ | dyᵢ | dxᵢ·dyᵢ | dxᵢ² | dyᵢ² |
|---|----|----|------|------|----------|-------|-------|
| 1 | 1 | 2 | -2 | -2 | 4 | 4 | 4 |
| 2 | 2 | 4 | -1 | 0 | 0 | 1 | 0 |
| 3 | 3 | 5 | 0 | 1 | 0 | 0 | 1 |
| 4 | 4 | 4 | 1 | 0 | 0 | 1 | 0 |
| 5 | 5 | 5 | 2 | 1 | 2 | 4 | 1 |
| **Sum** | | | | | **6** | **10** | **6** |

- x̄ = 3, ȳ = 4
- Numerator = 6
- Denominator = √(10 × 6) = √60 = 7.746
- **r = 6 / 7.746 = 0.775**

### Hypothesis Test

**Hypothesis:**
- H₀: ρ = 0 (population correlation is zero)
- H₁: ρ ≠ 0 (population correlation is not zero)

**Test Statistic:**

$$
t = \frac{r\sqrt{n-2}}{\sqrt{1-r^2}}
$$

**Degrees of freedom:** df = n - 2

**For our example:**
- t = 0.775 × √3 / √(1 - 0.601) = 1.342 / 0.632 = **2.124**
- df = 3
- From t-table: p-value ≈ 0.123 (not significant at α=0.05)

**Decision Rule:**
- If p-value < α → Reject H₀ (correlation is significant)
- If p-value ≥ α → Fail to reject H₀

---

## 2. Spearman Rank Correlation

### What It Measures
Measures the **monotonic** relationship between two variables using ranks. Non-parametric alternative to Pearson.

### Formula

**For data without tied ranks:**

$$
\rho = 1 - \frac{6 \sum_{i=1}^{n} d_i^2}{n(n^2 - 1)}
$$

Where dᵢ = rank(xᵢ) - rank(yᵢ)

**For data with tied ranks:**

$$
\rho = \frac{\sum_{i=1}^{n}(R_i - \bar{R})(S_i - \bar{S})}{\sqrt{\sum_{i=1}^{n}(R_i - \bar{R})^2 \cdot \sum_{i=1}^{n}(S_i - \bar{S})^2}}
$$

Where Rᵢ = rank of xᵢ, Sᵢ = rank of yᵢ

### Step-by-Step Calculation

**Step 1:** Rank X values (assign average rank for ties)

| xᵢ | Rank of xᵢ |
|----|------------|
| 1  | 1          |
| 2  | 2          |
| 3  | 3          |
| 4  | 4          |
| 5  | 5          |

**Step 2:** Rank Y values (assign average rank for ties)

| yᵢ | Rank of yᵢ |
|----|------------|
| 2  | 1          |
| 4  | 2.5 (tie)  |
| 5  | 4.5 (tie)  |
| 4  | 2.5 (tie)  |
| 5  | 4.5 (tie)  |

**Step 3:** Compute dᵢ = rank(xᵢ) - rank(yᵢ)

| i | rank(xᵢ) | rank(yᵢ) | dᵢ | dᵢ² |
|---|----------|----------|-----|------|
| 1 | 1 | 1 | 0 | 0 |
| 2 | 2 | 2.5 | -0.5 | 0.25 |
| 3 | 3 | 4.5 | -1.5 | 2.25 |
| 4 | 4 | 2.5 | 1.5 | 2.25 |
| 5 | 5 | 4.5 | 0.5 | 0.25 |
| **Sum** | | | | **5.0** |

**Step 4:** Apply formula

$$
\rho = 1 - \frac{6 \times 5.0}{5(25-1)} = 1 - \frac{30}{120} = 1 - 0.25 = 0.75
$$

### Hypothesis Test

**Hypothesis:**
- H₀: ρ = 0 (no monotonic association)
- H₁: ρ ≠ 0

**Test Statistic (for n > 10):**

$$
t = \frac{\rho\sqrt{n-2}}{\sqrt{1-\rho^2}}
$$

Follows t-distribution with **df = n - 2**.

---

## 3. One-Way ANOVA (F-test)

### What It Measures
Tests whether the **means** of a continuous variable are equal across **k** groups.

### Concept

Compares **between-group variance** to **within-group variance**:

$$
F = \frac{\text{Between-group variability}}{\text{Within-group variability}}
$$

### Formulas

**Grand Mean:**

$$
\bar{x}_{grand} = \frac{\sum_{j=1}^{k}\sum_{i=1}^{n_j} x_{ij}}{N}
$$

Where N = total observations = n₁ + n₂ + ... + nₖ

**Group Means:**

$$
\bar{x}_j = \frac{1}{n_j}\sum_{i=1}^{n_j} x_{ij}
$$

### Step-by-Step Calculation

**Step 1:** Compute SS_total (Total Sum of Squares)

$$
SS_{total} = \sum_{j=1}^{k}\sum_{i=1}^{n_j}(x_{ij} - \bar{x}_{grand})^2
$$

**Step 2:** Compute SS_between (Between-Group Sum of Squares)

$$
SS_{between} = \sum_{j=1}^{k} n_j(\bar{x}_j - \bar{x}_{grand})^2
$$

**Step 3:** Compute SS_within (Within-Group Sum of Squares)

$$
SS_{within} = \sum_{j=1}^{k}\sum_{i=1}^{n_j}(x_{ij} - \bar{x}_j)^2
$$

**Step 4:** Verify decomposition

$$
SS_{total} = SS_{between} + SS_{within}
$$

**Step 5:** Compute Mean Squares

$$
MS_{between} = \frac{SS_{between}}{k-1}, \quad MS_{within} = \frac{SS_{within}}{N-k}
$$

**Step 6:** Compute F-statistic

$$
F = \frac{MS_{between}}{MS_{within}}
$$

### Worked Example

**Data:** Three platform types with index scores

| Platform A | Platform B | Platform C |
|-----------|-----------|-----------|
| 0.5       | 0.7       | 0.3       |
| 0.6       | 0.8       | 0.4       |
| 0.4       | 0.6       | 0.2       |

**Step 1:** Compute means
- x̄_A = 0.5, x̄_B = 0.7, x̄_C = 0.3
- x̄_grand = (0.5+0.6+0.4+0.7+0.8+0.6+0.3+0.4+0.2)/9 = 4.5/9 = 0.5

**Step 2:** Compute SS_between
- SS_between = 3(0.5-0.5)² + 3(0.7-0.5)² + 3(0.3-0.5)²
- SS_between = 3(0) + 3(0.04) + 3(0.04) = 0.24

**Step 3:** Compute SS_within
- Group A: (0.5-0.5)² + (0.6-0.5)² + (0.4-0.5)² = 0.02
- Group B: (0.7-0.7)² + (0.8-0.7)² + (0.6-0.7)² = 0.02
- Group C: (0.3-0.3)² + (0.4-0.3)² + (0.2-0.3)² = 0.02
- SS_within = 0.06

**Step 4:** Compute F
- MS_between = 0.24 / (3-1) = 0.12
- MS_within = 0.06 / (9-3) = 0.01
- **F = 0.12 / 0.01 = 12.0**

**Step 5:** Decision
- df₁ = k-1 = 2, df₂ = N-k = 6
- Critical F(2,6) at α=0.05 = 5.14
- Since 12.0 > 5.14 → **Reject H₀** (significant difference)

### Hypothesis

- H₀: μ₁ = μ₂ = ... = μₖ (all group means are equal)
- H₁: At least one group mean differs

---

## 4. Kruskal-Wallis Test

### What It Measures
Non-parametric alternative to ANOVA. Tests whether groups have the **same median** (identical distributions).

### Formula

$$
H = \frac{12}{N(N+1)} \sum_{j=1}^{k} \frac{R_j^2}{n_j} - 3(N+1)
$$

Where:
- Rⱼ = sum of ranks in group j
- nⱼ = sample size of group j
- N = total sample size

### Step-by-Step Calculation

**Step 1:** Combine all data and rank from smallest to largest (assign average for ties)

**Step 2:** Sum the ranks within each group

**Step 3:** Apply the formula

### Worked Example

**Data:**

| Group A | Group B | Group C |
|---------|---------|---------|
| 5       | 8       | 3       |
| 6       | 9       | 2       |
| 7       | 10      | 4       |

**Step 1:** Rank all 9 values

| Value | Group | Rank |
|-------|-------|------|
| 2     | C     | 1    |
| 3     | C     | 2    |
| 4     | C     | 3    |
| 5     | A     | 4    |
| 6     | A     | 5    |
| 7     | A     | 6    |
| 8     | B     | 7    |
| 9     | B     | 8    |
| 10    | B     | 9    |

**Step 2:** Sum of ranks
- R_A = 4 + 5 + 6 = 15
- R_B = 7 + 8 + 9 = 24
- R_C = 1 + 2 + 3 = 6

**Step 3:** Apply formula

$$
H = \frac{12}{9(10)} \left[\frac{15^2}{3} + \frac{24^2}{3} + \frac{6^2}{3}\right] - 3(10)
$$

$$
H = \frac{12}{90} \left[\frac{225}{3} + \frac{576}{3} + \frac{36}{3}\right] - 30
$$

$$
H = 0.1333 \times [75 + 192 + 12] - 30
$$

$$
H = 0.1333 \times 279 - 30 = 37.2 - 30 = 7.2
$$

**Step 4:** Decision
- H follows χ² distribution with df = k-1 = 2
- Critical χ²(2) at α=0.05 = 5.99
- Since 7.2 > 5.99 → **Reject H₀**

### Hypothesis

- H₀: All groups have the same median
- H₁: At least one group has a different median

---

## 5. OLS Regression

### What It Models

$$
Y = \beta_0 + \beta_1 X_1 + \beta_2 X_2 + \cdots + \beta_p X_p + \varepsilon
$$

Where:
- Y = dependent variable
- X₁, X₂, ..., Xₚ = predictor variables
- β₀ = intercept
- β₁, ..., βₚ = regression coefficients
- ε ~ N(0, σ²) = error term

### Normal Equation (Coefficient Estimation)

$$
\hat{\beta} = (X^T X)^{-1} X^T Y
$$

Where X is the design matrix (with column of 1s for intercept).

### Step-by-Step Derivation

**For simple linear regression (Y = β₀ + β₁X + ε):**

**Step 1:** Define the loss function (Sum of Squared Residuals)

$$
SS_{res} = \sum_{i=1}^{n}(y_i - \hat{y}_i)^2 = \sum_{i=1}^{n}(y_i - \beta_0 - \beta_1 x_i)^2
$$

**Step 2:** Minimize by taking partial derivatives and setting to 0

$$
\frac{\partial SS_{res}}{\partial \beta_0} = -2\sum_{i=1}^{n}(y_i - \beta_0 - \beta_1 x_i) = 0
$$

$$
\frac{\partial SS_{res}}{\partial \beta_1} = -2\sum_{i=1}^{n} x_i(y_i - \beta_0 - \beta_1 x_i) = 0
$$

**Step 3:** Solve for β₁

$$
\hat{\beta}_1 = \frac{\sum_{i=1}^{n}(x_i - \bar{x})(y_i - \bar{y})}{\sum_{i=1}^{n}(x_i - \bar{x})^2} = \frac{S_{xy}}{S_{xx}}
$$

**Step 4:** Solve for β₀

$$
\hat{\beta}_0 = \bar{y} - \hat{\beta}_1 \bar{x}
$$

### Worked Example

**Data:** X = [1, 2, 3, 4, 5], Y = [2, 4, 5, 4, 5]

**Step 1:** Compute means
- x̄ = 3, ȳ = 4

**Step 2:** Compute S_xy and S_xx

| i | xᵢ | yᵢ | xᵢ-x̄ | yᵢ-ȳ | (xᵢ-x̄)(yᵢ-ȳ) | (xᵢ-x̄)² |
|---|----|----|-------|-------|----------------|----------|
| 1 | 1 | 2 | -2 | -2 | 4 | 4 |
| 2 | 2 | 4 | -1 | 0 | 0 | 1 |
| 3 | 3 | 5 | 0 | 1 | 0 | 0 |
| 4 | 4 | 4 | 1 | 0 | 0 | 1 |
| 5 | 5 | 5 | 2 | 1 | 2 | 4 |
| **Sum** | | | | | **6** | **10** |

**Step 3:** Compute coefficients
- β̂₁ = 6 / 10 = 0.6
- β̂₀ = 4 - 0.6(3) = 4 - 1.8 = 2.2

**Regression equation:** ŷ = 2.2 + 0.6x

### R² (Coefficient of Determination)

$$
R^2 = 1 - \frac{SS_{residual}}{SS_{total}} = 1 - \frac{\sum(y_i - \hat{y}_i)^2}{\sum(y_i - \bar{y})^2}
$$

**Computed values:**
- SS_total = (2-4)² + (4-4)² + (5-4)² + (4-4)² + (5-4)² = 6
- SS_residual = (2-2.8)² + (4-3.4)² + (5-4.0)² + (4-4.6)² + (5-5.2)² = 0.64+0.36+1.0+0.36+0.04 = 2.4
- **R² = 1 - 2.4/6 = 0.6** (model explains 60% of variance)

### Adjusted R²

$$
R^2_{adj} = 1 - \frac{(1-R^2)(n-1)}{n-p-1}
$$

Where p = number of predictors, n = sample size.

### Hypothesis Testing for Coefficients

**Hypothesis for each βⱼ:**
- H₀: βⱼ = 0 (variable Xⱼ has no effect on Y)
- H₁: βⱼ ≠ 0

**Standard Error of β̂ⱼ:**

$$
SE(\hat{\beta}_j) = \sqrt{\hat{\sigma}^2 \cdot (X^T X)^{-1}_{jj}}
$$

Where $\hat{\sigma}^2 = \frac{SS_{residual}}{n-p-1}$

**t-statistic:**

$$
t = \frac{\hat{\beta}_j}{SE(\hat{\beta}_j)}
$$

Follows t-distribution with **df = n - p - 1**.

### Confidence Interval for βⱼ

$$
\hat{\beta}_j \pm t_{\alpha/2, n-p-1} \times SE(\hat{\beta}_j)
$$

### Overall Model F-test

**Hypothesis:**
- H₀: β₁ = β₂ = ... = βₚ = 0 (model has no predictive power)
- H₁: At least one βⱼ ≠ 0

**F-statistic:**

$$
F = \frac{R^2/p}{(1-R^2)/(n-p-1)}
$$

Follows F-distribution with **df₁ = p**, **df₂ = n-p-1**.

---

## 6. Variance Inflation Factor (VIF)

### What It Measures
Detects **multicollinearity** — how much the variance of a coefficient is inflated due to correlation with other predictors.

### Formula

For each predictor Xⱼ:

$$
VIF_j = \frac{1}{1 - R_j^2}
$$

Where R²ⱼ is the R² from regressing Xⱼ on all other predictors:

$$
X_j = \gamma_0 + \gamma_1 X_1 + \cdots + \gamma_{j-1} X_{j-1} + \gamma_{j+1} X_{j+1} + \cdots + \gamma_p X_p + \epsilon
$$

### Interpretation

| VIF Value | Severity | Action |
|-----------|----------|--------|
| 1 | No correlation | Ideal |
| 1–5 | Moderate | Usually acceptable |
| 5–10 | High | Consider removing variable |
| >10 | Severe | Remove or combine variables |

### Mathematical Derivation

The variance of β̂ⱼ in multiple regression is:

$$
Var(\hat{\beta}_j) = \frac{\sigma^2}{(n-1)S_j^2(1-R_j^2)}
$$

Where:
- σ² = error variance
- S²ⱼ = variance of Xⱼ
- R²ⱼ = R² from auxiliary regression

The VIF is the **inflation factor** (1-R²ⱼ) in the denominator. Without collinearity (R²ⱼ = 0), VIF = 1 and variance is minimal. With perfect collinearity (R²ⱼ = 1), VIF → ∞.

### Worked Example

Suppose we have 3 predictors: FLI, DCI, TI

**Auxiliary regression for FLI:**
- FLI ~ DCI + TI
- R² = 0.38 (from Pearson heatmap, r(FLI,DCI)=0.615 → R² ≈ 0.38)
- **VIF_FLI = 1/(1-0.38) = 1.61**

**Similarly:**
- VIF_DCI = 1/(1-R²_DCI) = depends on regressing DCI on others
- VIF_TI = 1/(1-R²_TI) = depends on regressing TI on others

---

## 7. Interaction Effects in Regression

### What It Models

Tests whether the **effect of one variable depends on another variable**.

### Model

$$
Y = \beta_0 + \beta_1 X_1 + \beta_2 X_2 + \beta_3 (X_1 \times X_2) + \varepsilon
$$

Where:
- β₃ = interaction coefficient
- X₁ × X₂ = interaction term (product of predictors)

### Interpretation

- β₁ = effect of X₁ when X₂ = 0
- β₂ = effect of X₂ when X₁ = 0
- β₃ = how the effect of X₁ changes per unit increase in X₂

### Worked Example

**Model:** ODI = β₀ + β₁(FLI) + β₂(DCI) + β₃(FLI × DCI) + ε

If β₃ is significant (p < 0.05):
- The relationship between FLI and ODI **changes** depending on the level of DCI
- When DCI is high, FLI's effect on ODI may be stronger/weaker than when DCI is low

**Partial derivative:**

$$
\frac{\partial ODI}{\partial FLI} = \beta_1 + \beta_3 \cdot DCI
$$

This shows that the marginal effect of FLI on ODI **depends on DCI's value**.

### Full Model with All Interactions

From the script:

$$
ODI = \beta_0 + \beta_1 FLI + \beta_2 DCI + \beta_3 TI + \beta_4 IVI + \beta_5(FLI \times DCI) + \beta_6(FLI \times TI) + \beta_7(DCI \times TI) + \beta_8(IVI \times FLI) + \varepsilon
$$

---

## Summary Table

| Test | Purpose | Null Hypothesis (H₀) | Test Statistic | Distribution | Formula |
|------|---------|----------------------|----------------|--------------|---------|
| **Pearson r** | Linear correlation | ρ = 0 | t = r√(n-2)/√(1-r²) | t(df=n-2) | r = S_xy / √(S_xx · S_yy) |
| **Spearman ρ** | Monotonic correlation | ρₛ = 0 | t = ρ√(n-2)/√(1-ρ²) | t(df=n-2) | ρ = 1 - 6Σdᵢ²/n(n²-1) |
| **ANOVA F** | Compare means across groups | μ₁=μ₂=...=μₖ | F = MS_between/MS_within | F(k-1, N-k) | SS_between/SS_within |
| **Kruskal-Wallis** | Compare medians (non-parametric) | Same distribution | H = [12/N(N+1)]Σ(Rⱼ²/nⱼ) - 3(N+1) | χ²(df=k-1) | Rank-based |
| **OLS Regression** | Linear prediction | βⱼ = 0 | t = β̂ⱼ/SE(β̂ⱼ) | t(df=n-p-1) | β̂ = (X'X)⁻¹X'Y |
| **Model F-test** | Overall model significance | β₁=...=βₚ=0 | F = (R²/p)/((1-R²)/(n-p-1)) | F(p, n-p-1) | Based on R² |
| **VIF** | Multicollinearity | No collinearity | VIF = 1/(1-R²ⱼ) | N/A | Auxiliary regression R² |
| **Interaction** | Moderation effects | β₃ = 0 | t = β̂₃/SE(β̂₃) | t(df=n-p-1) | Product term X₁×X₂ |

---

## Significance Levels

| Notation | p-value Range | Interpretation |
|----------|---------------|----------------|
| *** | p < 0.001 | Highly significant |
| ** | p < 0.01 | Very significant |
| * | p < 0.05 | Significant |
| ns | p ≥ 0.05 | Not significant |

**Decision Rule:**
- If p-value < α (typically 0.05): **Reject H₀** → effect is statistically significant
- If p-value ≥ α: **Fail to reject H₀** → insufficient evidence of an effect
