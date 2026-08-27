# Hypothesis Testing Report: Onboarding Difficulty Score Construction

## Overview

This report presents the results of comprehensive hypothesis testing conducted to understand the statistical relationships among the five composite indices (FLI, DCI, TI, ODI, IVI) and their associations with onboarding difficulty proxy variables. The analysis was performed on 50,000 gig worker survey responses and is structured into six parts: correlation analysis, segment-wise comparison, OLS regression, segment-wise regression, interaction effects, and multicollinearity diagnostics. These findings serve as the empirical foundation for designing the function f(FLI, DCI, TI, ODI, IVI) that will compute the Onboarding Difficulty Score.

---

## Part 1: Correlation Analysis

The first objective was to understand how the five indices co-vary with one another and with observable onboarding outcomes. The Pearson correlation matrix reveals that FLI and DCI share the strongest positive correlation among all index pairs (r = 0.6153, p < 0.001), indicating that workers with higher financial literacy also tend to exhibit higher digital confidence. This relationship is intuitive, as financial literacy and digital proficiency reinforce each other in the context of app-based gig work. The second strongest positive correlation exists between FLI and IVI (r = 0.3903, p < 0.001), suggesting that workers with higher financial literacy also tend to experience higher income volatility, possibly because more financially literate workers are better at tracking and reporting their income fluctuations.

The critical finding for onboarding difficulty score design is the negative correlation between DCI and ODI (r = -0.3787, p < 0.001), which is the strongest negative relationship observed among the five indices. This means that higher digital confidence is strongly associated with lower onboarding difficulty. The second strongest negative correlation is between FLI and ODI (r = -0.1222, p < 0.001), indicating that financial literacy also reduces onboarding difficulty, though to a lesser extent than digital confidence. The correlation between TI and ODI is negative but weak (r = -0.0508, p < 0.001), suggesting that institutional trust plays a minor role in determining onboarding difficulty compared to digital and financial literacy. IVI shows essentially no correlation with ODI (r = -0.0096, p = 0.031), indicating that income volatility does not directly predict onboarding difficulty.

When examining correlations with proxy variables, the results confirm construct validity. ODI shows a very strong positive correlation with onboarding_document_issue (r = 0.7205, p < 0.001), which is expected since document issues are a core component of the ODI calculation. The financial inclusion index correlates most strongly with TI (r = 0.8337), followed by FLI (r = 0.6525) and DCI (r = 0.5491), confirming that trust and literacy are the primary drivers of financial inclusion. UPI adoption shows near-identical strong correlations with FLI (r = 0.7971) and DCI (r = 0.8003), reinforcing that digital literacy and financial literacy are jointly necessary for digital payment adoption.

---

## Part 2: Segment-wise Analysis Across Platform Types

The seven platform segments in the dataset (ride_hailing, food_delivery, quick_commerce, bike_taxi, home_services, logistics, hyperlocal) serve as natural groupings for testing whether index distributions and relationships differ across worker types. The one-way ANOVA results show that all five indices differ significantly across platform types (all p < 0.001). FLI shows the largest F-statistic (F = 182.32), indicating the greatest between-group variation, followed by IVI (F = 150.68) and DCI (F = 138.77). The Kruskal-Wallis non-parametric tests confirm these findings (all p < 0.001), ruling out the possibility that the ANOVA results are driven by distributional assumptions.

Examination of segment-wise means reveals meaningful patterns. Ride_hailing workers exhibit the highest FLI (mean = 0.4827) and DCI (mean = 0.9270), suggesting that this segment has the strongest financial and digital literacy foundations. Home_services workers show the highest DCI (mean = 0.9020) but the lowest FLI (mean = 0.3802), indicating a profile of high digital proficiency coupled with lower financial literacy. Bike_taxi workers show the highest IVI (mean = 0.2249), reflecting the income volatility inherent in this work pattern. These segment differences are important because they suggest that the onboarding difficulty function may need segment-specific calibration rather than a one-size-fits-all approach.

---

## Part 3: OLS Regression Analysis

The OLS regression models provide the most directly actionable information for constructing the onboarding difficulty function. The primary model regresses ODI on the other four indices (FLI, DCI, TI, IVI), yielding an R-squared of 0.172. While this R-squared is modest, it captures the linear relationships among the indices with high statistical significance (F = 2589, p < 0.001). The coefficient signs are theoretically consistent: FLI has a positive coefficient (0.2828, p < 0.001), meaning that higher financial literacy is associated with higher ODI values when other indices are held constant. This seemingly counterintuitive result reflects the fact that FLI and DCI are highly correlated (r = 0.615), and when DCI is controlled for, the residual variation in FLI captures a different dimension. DCI has a strong negative coefficient (-0.3841, p < 0.001), confirming that digital confidence is the primary reducer of onboarding difficulty. TI has a small positive coefficient (0.0275, p < 0.001), and IVI has a negative coefficient (-0.2130, p < 0.001).

The second regression model predicts the financial inclusion index using all five indices as predictors, achieving an R-squared of 0.889. This high explanatory power confirms that the five indices collectively capture the vast majority of variation in financial inclusion. TI dominates with the largest coefficient (0.9605), followed by FLI (0.7031), IVI (-0.4722), DCI (0.0939), and ODI (0.0399). This model validates the index construction framework by demonstrating that the indices are not arbitrary but have strong predictive relationships with a theoretically relevant outcome variable.

The third model predicts savings rate using all five indices (R-squared = 0.535). FLI is the strongest positive predictor (0.8725), followed by IVI (0.5567). DCI (-0.3202), TI (-0.1380), and ODI (-0.1091) all show negative coefficients. This suggests that while financial literacy and income volatility awareness drive savings behavior, the other indices capture different dimensions of the financial inclusion construct.

The fourth model predicts the binary onboarding document issue variable using all five indices (R-squared = 0.620). ODI has by far the largest coefficient (2.0718), confirming its construct validity as a measure of onboarding difficulty. DCI shows a positive coefficient (0.7919), which, combined with the negative coefficient in the ODI model, suggests a suppression effect where DCI reduces the latent difficulty captured by ODI while simultaneously being associated with higher document issue rates in the observed data. FLI (-0.5809) and TI (-0.0522) both reduce the likelihood of document issues, while IVI (0.4484) increases it.

---

## Part 4: Segment-wise Regression Analysis

Running the ODI regression model separately for each platform type reveals consistent coefficient directions but varying magnitudes. Across all seven segments, DCI maintains the strongest negative coefficient, ranging from -0.3491 (logistics) to -0.4079 (ride_hailing). FLI maintains a positive coefficient in all segments, ranging from 0.2500 (hyperlocal) to 0.3001 (ride_hailing). The R-squared values range from 0.1397 (logistics) to 0.1899 (ride_hailing), indicating that the model explains between 14% and 19% of ODI variation within segments.

A notable finding is that TI is statistically significant in only four of seven segments (ride_hailing, food_delivery, home_services, bike_taxi) and non-significant in logistics, quick_commerce, and hyperlocal. This suggests that the role of institutional trust in determining onboarding difficulty varies by platform type, being relevant for segments with more direct worker-platform financial interactions (ride_hailing, food_delivery) but less relevant for segments with more arm's-length financial arrangements.

IVI is significant and negative in all seven segments, with coefficients ranging from -0.1592 (bike_taxi) to -0.2518 (ride_hailing). The consistency of IVI's significance across all segments suggests that income volatility plays a robust role in reducing onboarding difficulty, possibly because workers with higher income volatility develop coping mechanisms that inadvertently reduce onboarding barriers.

---

## Part 5: Interaction Effects

The interaction analysis tests whether the effect of one index on ODI depends on the level of another index. The FLI x DCI interaction model achieves an R-squared of 0.1645, slightly lower than the main effects model (0.172). However, the interaction term itself is statistically significant and negative (coefficient = -0.1940, p < 0.001), indicating that the combined effect of FLI and DCI on ODI is less than the sum of their individual effects. In practical terms, this means that the onboarding difficulty reduction from having both high financial literacy and high digital confidence is partially redundant — the marginal benefit of one decreases when the other is already high.

The FLI x TI interaction model shows a much lower R-squared (0.0153), confirming that TI alone is a weak predictor of ODI. The interaction term is negative and significant (coefficient = -0.0956, p < 0.001), suggesting that the combined effect of financial literacy and institutional trust on reducing onboarding difficulty is subadditive.

The DCI x TI interaction model achieves an R-squared of 0.1477 with a significant negative interaction term (-0.0908, p < 0.001). This indicates that the onboarding difficulty reduction from digital confidence diminishes when institutional trust is also high, and vice versa.

The full model incorporating all four main effects plus four interaction terms (FLI x DCI, FLI x TI, DCI x TI, IVI x FLI) achieves an R-squared of 0.1724, marginally higher than the main effects model (0.172). The FLI x DCI interaction remains the most significant interaction term (-0.1389, p < 0.001), while IVI x FLI is non-significant (p = 0.920). This confirms that the interaction structure is dominated by the FLI-DCI relationship, and adding more interaction terms provides diminishing returns.

---

## Part 6: Multicollinearity Diagnostics

The Variance Inflation Factor (VIF) analysis reveals substantial multicollinearity among the indices. FLI has the highest VIF (16.98), followed by DCI (14.76), TI (12.75), IVI (6.40), and ODI (6.00). The conventional threshold of VIF > 10 indicates severe multicollinearity for FLI, DCI, and TI. This is expected given the strong correlations observed in Part 1 (FLI-DCI r = 0.615, FLI-TI r = 0.332, DCI-TI r = 0.290). While multicollinearity does not bias regression coefficients, it inflates standard errors and makes individual coefficient interpretation less reliable. For the purpose of constructing the onboarding difficulty function, this means that the individual regression coefficients should not be interpreted as isolated effects but rather as joint contributions within the correlated system of indices.

---

## Summary of Key Findings

The hypothesis testing yields several critical insights for designing the onboarding difficulty function:

**1. DCI is the strongest predictor of onboarding difficulty reduction.** Across all analyses — correlation, regression, segment-wise models — DCI consistently shows the strongest negative relationship with ODI. Any function f(FLI, DCI, TI, ODI, IVI) should assign DCI the largest weight among the reducing factors.

**2. FLI has a complex relationship with ODI.** The simple correlation is negative (r = -0.122), but the regression coefficient is positive (0.283) when DCI is controlled for. This reflects the strong FLI-DCI collinearity. The function should account for the joint FLI-DCI contribution rather than treating them independently.

**3. TI plays a minor role.** TI's correlation with ODI is weak (r = -0.051), and it is non-significant in three of seven platform segments. The function should assign TI a small weight or consider making it segment-dependent.

**4. IVI is statistically significant but practically modest.** IVI's correlation with ODI is near zero (r = -0.010), but it is significant in all segment-wise regressions. The function should include IVI with a small weight.

**5. Interaction effects are present but modest.** The FLI x DCI interaction is the most important, suggesting that the function should incorporate a multiplicative term for FLI and DCI rather than treating them as purely additive.

**6. Segment differences matter.** The regression coefficients vary across platform types, suggesting that the function may benefit from segment-specific parameterization. Ride_hailing and food_delivery workers show the strongest model fit, while logistics and hyperlocal show the weakest.

**7. Multicollinearity is high.** FLI, DCI, and TI are highly correlated, which means the function should be designed with awareness that these indices share overlapping information. Principal component analysis or dimensionality reduction could be explored as alternatives to raw index weighting.

---

## Implications for Function Design

Based on these findings, the recommended approach for the onboarding difficulty function is:

1. **Primary weights:** DCI should receive the largest negative weight (reducing difficulty), followed by FLI with a smaller weight.
2. **Interaction term:** Include a FLI x DCI interaction term to capture the subadditive relationship.
3. **Minor contributors:** TI and IVI should receive small weights, with TI potentially being made platform-dependent.
4. **Segment calibration:** Consider separate functions for high-fit segments (ride_hailing, food_delivery) vs. low-fit segments (logistics, hyperlocal).
5. **Validation:** The function should be validated against the onboarding_document_issue binary variable and the financial_inclusion_index as outcome measures.

---

*Report generated from analysis of 50,000 gig worker survey responses.*
*Statistical significance: * p < 0.05, ** p < 0.01, *** p < 0.001*
*Outputs located in: hypothesis_testing/outputs/*
