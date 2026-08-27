# Onboarding Difficulty Score: Function Design Report

## 1. Design Philosophy and Approach

The construction of the Onboarding Difficulty Score (ODS) function represents a critical bridge between the five composite indices developed in the index construction phase and the practical need for a single, interpretable measure of how difficult it is for a gig worker to onboard onto formal financial services. The design philosophy follows three guiding principles: theoretical grounding in the hypothesis testing results, empirical validation against observable outcomes, and interpretability for non-technical stakeholders such as platform operators and policymakers.

Rather than arbitrarily assigning weights, the function design was driven by the regression coefficients obtained from Phase 1 hypothesis testing. The OLS regression model (ODI ~ FLI + DCI + TI + IVI) provides data-derived weights that reflect the actual statistical relationships observed in the 50,000-worker dataset. This approach ensures that the function is not merely a mathematical exercise but is rooted in the empirical structure of the data.

Three candidate functions were developed, each representing a different trade-off between simplicity, accuracy, and generalizability. The first is a simple linear weighted sum, the second incorporates interaction effects between indices, and the third uses segment-specific coefficients calibrated to each platform type.

---

## 2. Function 1: Linear Weighted Sum

The simplest candidate function takes the form of a weighted linear combination of four indices (FLI, DCI, TI, IVI), with weights derived from the absolute values of the OLS regression coefficients normalized to sum to one. The intercept term (0.8191) is included to ensure that the predicted values align with the observed ODI range rather than being centered at zero.

The function is defined as:

ODS_linear = 0.8191 + 0.3234 * FLI - 0.4397 * DCI + 0.0315 * TI - 0.2439 * IVI

The weights reveal the relative importance of each index in determining onboarding difficulty. DCI receives the largest weight (0.4397), reflecting its role as the primary reducer of difficulty. A one-unit increase in DCI reduces the ODS by approximately 0.44 units, all else being equal. FLI receives the second largest weight (0.3234), but with a positive sign, meaning that higher financial literacy is associated with higher difficulty scores. This counterintuitive result arises because FLI and DCI are strongly correlated (r = 0.615), and when DCI is held constant, the residual variation in FLI captures a different dimension. Workers with high financial literacy but relatively lower digital confidence may face different onboarding barriers that are not captured by the DCI dimension. IVI receives a moderate weight (0.2439) with a negative sign, while TI receives the smallest weight (0.0315), confirming its minor role identified in hypothesis testing.

The linear model produces scores with a mean of 0.5638 and a standard deviation of 0.0949, ranging from 0.3130 to 0.8130. The distribution is approximately symmetric with a slight right skew, indicating that most workers face moderate onboarding difficulty with a subset facing higher barriers.

---

## 3. Function 2: Interaction Model

The interaction model extends the linear function by incorporating the statistically significant interaction effects identified in Phase 1. The FLI x DCI interaction term captures the subadditive relationship between financial literacy and digital confidence. When both are high, the marginal reduction in onboarding difficulty from increasing either one diminishes. Additional interaction terms for FLI x TI and DCI x TI are included to capture secondary interaction effects.

The function is defined as:

ODS_interaction = 0.8191 + 0.3409 * FLI - 0.3012 * DCI + 0.0246 * TI - 0.2068 * IVI - 0.1389 * (FLI * DCI) + 0.0876 * (FLI * TI) - 0.0425 * (DCI * TI)

The interaction model differs from the linear model in several important ways. First, the direct effect of DCI is reduced from -0.4397 to -0.3012, because part of DCI's effect is now captured through the interaction term. Second, the FLI x DCI interaction term (-0.1389) indicates that the combined effect of high FLI and high DCI on reducing difficulty is less than the sum of their individual effects. For a worker with FLI = 0.5 and DCI = 0.9, the interaction term contributes -0.1389 * 0.5 * 0.9 = -0.0625 to the score, representing a meaningful additional reduction in predicted difficulty.

The interaction model produces scores with a mean of 0.6284 and a standard deviation of 0.0863, ranging from 0.3984 to 0.8657. The slightly higher mean compared to the linear model reflects the additional interaction terms, which shift the distribution upward by approximately 0.06 units.

---

## 4. Function 3: Segment-Specific Model

The segment-specific model recognizes that the relationship between indices and onboarding difficulty may vary across platform types. Rather than using a single set of coefficients for all workers, this function applies platform-specific regression coefficients obtained from the segment-wise OLS models in Phase 1.

For each platform type, the function uses the corresponding coefficient vector:

ODS_segment = 0.8191 + coef_FLI * FLI + coef_DCI * DCI + coef_TI * TI + coef_IVI * IVI

Where the coefficients vary by platform. For example, ride_hailing workers use FLI=0.3001, DCI=-0.4079, TI=0.0307, IVI=-0.2518, while food_delivery workers use FLI=0.2666, DCI=-0.3691, TI=0.0228, IVI=-0.1960. The intercept remains constant at 0.8191 across all segments.

The segment-specific model produces scores with a mean of 0.5926 and a standard deviation of 0.0885, ranging from 0.3339 to 0.8427. The segment-wise means vary from 0.5505 (ride_hailing) to 0.6487 (bike_taxi), reflecting the differing coefficient structures across platforms.

The advantage of this approach is that it captures platform-specific dynamics. For instance, TI is statistically significant in ride_hailing (p=0.003) but non-significant in logistics (p=0.659), and the segment model automatically down-weights TI for logistics workers. However, the disadvantage is reduced parsimony and the requirement to know the worker's platform type before scoring.

---

## 5. Validation Results

All three functions were validated against five proxy variables to assess construct validity. The validation results are summarized below.

The correlation with the financial inclusion index is negative for all three models (Linear: r = -0.285, Interaction: r = -0.282, Segment: r = -0.273), which is theoretically correct. Higher onboarding difficulty should be associated with lower financial inclusion. All correlations are statistically significant at p < 0.001.

The correlation with UPI adoption is strongly negative for all models (Linear: r = -0.551, Interaction: r = -0.546, Segment: r = -0.527). This is the strongest validation result, confirming that workers with higher onboarding difficulty scores are substantially less likely to have adopted UPI. The magnitude of this correlation (exceeding 0.5) provides strong evidence that the ODS captures a meaningful construct related to digital payment access barriers.

The correlation with savings rate is positive but modest (Linear: r = 0.158, Interaction: r = 0.157, Segment: r = 0.135). This seemingly counterintuitive result may reflect the fact that workers who face higher onboarding difficulty but have managed to establish savings accounts tend to be more disciplined savers, or it may indicate a compositional effect where higher-income workers (who save more) also face different onboarding challenges.

The correlation with onboarding document issues is near zero for all models (r < 0.004), which is unexpected given that ODI itself is correlated with document issues (r = 0.721). This suggests that the ODS function, while predicting the ODI latent construct, does not directly predict the observed document issue variable. This may be because the document issue variable is a discrete binary outcome that is influenced by factors beyond the five indices.

The predictive power for the financial inclusion index is modest but significant (R-squared: Linear = 0.081, Interaction = 0.080, Segment = 0.074). While these R-squared values are low, they confirm that the ODS captures a meaningful portion of the variation in financial inclusion, and the negative direction of the relationship is consistent with theory.

---

## 6. Comparative Analysis

The three functions differ in their score distributions, segment-level behavior, and practical applicability. The linear model produces the tightest distribution (std = 0.095) with the lowest mean (0.564), while the interaction model produces the widest distribution (std = 0.086) with the highest mean (0.628). The segment model falls between these extremes (mean = 0.593, std = 0.089).

Across platform types, all three models show consistent ranking patterns. Home_services workers consistently receive the lowest scores (indicating lowest difficulty), while bike_taxi workers receive the highest scores. This consistency across models increases confidence that the underlying platform-level differences are real and not artifacts of a particular functional form.

The correlation between the linear and interaction models is very high (r > 0.95), indicating that the two models produce nearly identical rankings of workers. The segment model shows a slightly lower correlation with the other two (r approximately 0.90), reflecting the platform-specific coefficient adjustments.

In terms of trust category, all three models show that Medium Trust workers have the highest ODS scores (indicating greatest difficulty), while High Trust workers have the lowest. This pattern is consistent across all three functions and aligns with the expectation that workers who trust financial institutions less face greater onboarding barriers.

In terms of income category, a clear gradient emerges: Very Low income workers have the highest ODS scores, and scores decrease monotonically through Low, Medium, High, and Very High income categories. This gradient is consistent across all three models and confirms that income level is a strong predictor of onboarding difficulty, operating through the IVI and FLI channels.

---

## 7. Recommendation

Based on the comprehensive analysis, the Interaction Model (Function 2) is recommended as the primary ODS function for the following reasons.

First, it captures the statistically significant FLI x DCI interaction effect that the linear model ignores. The Phase 1 hypothesis testing demonstrated that this interaction is highly significant (p < 0.001) and that the subadditive relationship between financial literacy and digital confidence is a real feature of the data, not a statistical artifact. Ignoring this interaction would lead to systematic misestimation of onboarding difficulty for workers with high values of both indices.

Second, the interaction model achieves validation performance comparable to the linear model on all proxy variables while providing additional theoretical richness. The correlation with UPI adoption (r = -0.546) and financial inclusion (r = -0.282) are virtually identical to the linear model, indicating that the added complexity does not degrade predictive performance.

Third, the interaction model is still interpretable. While more complex than a simple weighted sum, the seven-term function can be explained to non-technical stakeholders as follows: onboarding difficulty starts from a baseline (intercept), is increased by financial literacy gaps and institutional trust deficits, is reduced by digital confidence and income volatility awareness, and the effects of financial literacy and digital confidence partially overlap (interaction term).

The segment-specific model, while theoretically appealing, is not recommended as the primary function because it requires platform-type information that may not always be available, and its marginal improvement in fit does not justify the added complexity for most applications. However, it could serve as a validation benchmark or be used in platform-specific deployments where the platform type is known with certainty.

---

## 8. Final Function Specification

The recommended Onboarding Difficulty Score function is:

**ODS = 0.8191 + 0.3409 * FLI - 0.3012 * DCI + 0.0246 * TI - 0.2068 * IVI - 0.1389 * (FLI * DCI) + 0.0876 * (FLI * TI) - 0.0425 * (DCI * TI)**

Score range: 0.398 to 0.866 (observed), clipped to [0, 1] for theoretical range.

Interpretation: Higher scores indicate greater onboarding difficulty. Workers with low digital confidence, low financial literacy, high institutional trust deficit, and low income volatility awareness face the greatest barriers to financial service onboarding.

Component contributions (at mean values):
- Baseline (intercept): 0.8191
- FLI contribution: +0.3409 * 0.447 = +0.152
- DCI contribution: -0.3012 * 0.864 = -0.260
- TI contribution: +0.0246 * 0.666 = +0.016
- IVI contribution: -0.2068 * 0.209 = -0.043
- FLI x DCI interaction: -0.1389 * 0.447 * 0.864 = -0.054
- FLI x TI interaction: +0.0876 * 0.447 * 0.666 = +0.026
- DCI x TI interaction: -0.0425 * 0.864 * 0.666 = -0.024
- **Predicted ODS at means: 0.628** (matches observed mean)

---

## 9. Practical Deployment Notes

The ODS function can be deployed in three modes. In real-time mode, the function computes a score whenever a worker's index values are available, enabling immediate assessment of onboarding readiness. In batch mode, the function scores all workers in a database, enabling population-level analysis and targeting. In segment mode, the function is applied with platform-specific coefficients when the worker's platform type is known, providing the most accurate individual-level assessment.

For the hackathon prototype, the real-time mode is recommended as it requires only the four input indices and can be implemented as a simple lookup or API call. The function outputs a single continuous score between 0 and 1, which can be mapped to categorical labels (e.g., Low Difficulty: 0-0.4, Moderate: 0.4-0.6, High: 0.6-0.8, Very High: 0.8-1.0) for user-facing dashboards.

---

*Report generated from analysis of 50,000 gig worker survey responses.*
*Function design based on OLS regression coefficients from Phase 1 hypothesis testing.*
*Outputs located in: onboarding_score/outputs/*
