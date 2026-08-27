# Onboarding Difficulty Score: Picture-by-Picture Analysis

## Figure 1: Score Distributions — Three Candidate Functions

The first figure presents side-by-side histograms of the three candidate Onboarding Difficulty Score (ODS) functions, each showing the distribution of predicted scores across 50,000 workers with mean (red dashed line) and median (green dashed line) indicators.

The Linear Weighted Sum (leftmost, blue) shows a roughly symmetric distribution centered at a mean of 0.5638 with a median of 0.5566. The distribution spans from approximately 0.31 to 0.81, with the highest frequency bin near 0.52 containing over 4,000 workers. The slight leftward displacement of the mean relative to the median indicates a mild left skew, suggesting that more workers cluster at the higher difficulty end. The standard deviation of 0.0949 is the largest among the three functions, indicating the widest spread of predicted difficulty scores. This wider spread reflects the linear model's tendency to produce more extreme predictions when index values deviate from their means.

The Interaction Model (center, orange) shows a distribution shifted to the right with a higher mean of 0.6284 and a median of 0.6224. The distribution spans from approximately 0.40 to 0.87, with the highest frequency bin near 0.62 containing nearly 5,000 workers. The rightward shift relative to the linear model (0.564 to 0.628) is attributable to the interaction terms, which add additional complexity to the prediction. The standard deviation of 0.0863 is the smallest among the three functions, indicating the tightest clustering of scores around the mean. This tighter distribution suggests that the interaction model produces more conservative predictions with less extreme values.

The Segment-Specific function (rightmost, green) shows a distribution between the other two, with a mean of 0.5926 and a median of 0.5881. The distribution spans from approximately 0.33 to 0.84, with the highest frequency bin near 0.58 containing over 4,000 workers. The standard deviation of 0.0885 falls between the linear (0.095) and interaction (0.086) models. The between-segment coefficient variation produces a distribution that captures platform-specific dynamics while maintaining a central tendency between the simpler linear and more complex interaction models.

The comparison reveals that the interaction model produces the highest average difficulty scores, suggesting that accounting for subadditive effects between indices shifts the predicted difficulty upward. The linear model produces the widest spread, while the interaction model produces the tightest. All three distributions are unimodal and roughly symmetric, confirming that the predicted difficulty scores are well-behaved without problematic bimodality or extreme skewness.

---

## Figure 2: Box Plots by Platform Type

The second figure displays box plots for each of the three ODS functions segmented by the seven platform types, enabling comparison of median difficulty, interquartile ranges, and outlier patterns across both functions and platforms.

The Linear Weighted Sum box plots (leftmost panel) show medians ranging from approximately 0.54 (ride_hailing) to 0.58 (bike_taxi). The interquartile ranges are relatively compact, spanning approximately 0.10 units for most platforms. The ride_hailing box is positioned lowest, confirming this segment faces the least predicted difficulty, while bike_taxi is positioned highest. The presence of outlier dots both above and below the whiskers for most platforms indicates that the linear model produces some extreme predictions at both ends of the difficulty spectrum.

The Interaction Model box plots (center panel) show medians shifted upward, ranging from approximately 0.60 (ride_hailing) to 0.64 (bike_taxi). The upward shift of approximately 0.06 units across all platforms confirms the systematic increase in predicted difficulty from the interaction terms. The interquartile ranges are slightly wider than the linear model for most platforms, reflecting the additional variance introduced by the interaction terms. The outlier patterns are similar to the linear model, with extreme predictions at both ends.

The Segment-Specific box plots (rightmost panel) show the most distinct between-platform separation. The bike_taxi box is positioned noticeably higher than the others (median approximately 0.65), while the ride_hailing box is positioned lowest (median approximately 0.55). This enhanced separation reflects the platform-specific coefficient calibration, which amplifies the between-platform differences that the linear and interaction models average across segments. The home_services and hyperlocal boxes show notably different patterns from the other platforms, with wider interquartile ranges that reflect the distinct coefficient structures for these segments.

The comparison across all three panels reveals that the segment-specific model produces the most differentiated platform-level predictions, while the linear and interaction models produce more uniform predictions across platforms. This differentiation is both an advantage (it captures platform-specific dynamics) and a limitation (it requires platform-type information for scoring). The consistency of the ride_hailing-lowest and bike_taxi-highest pattern across all three models confirms that these platform-level differences are robust to the choice of function specification.

---

## Figure 3: Score vs Financial Inclusion Index

The third figure presents scatter plots comparing each ODS function against the Financial Inclusion Index, with fitted regression lines and correlation coefficients. The horizontal banding pattern in all three plots reflects the discrete nature of the Financial Inclusion Index values.

The Linear Weighted Sum plot (leftmost, blue) shows a negative correlation of r = -0.285, with the fitted regression line sloping downward from left to right. The scatter reveals four distinct horizontal bands corresponding to discrete Financial Inclusion Index values (approximately 0.0, 0.35, 0.65, and 1.0). Within each band, the spread of ODS scores is relatively uniform, but the density of points shifts leftward (lower ODS) as the Financial Inclusion Index increases. This pattern confirms that higher financial inclusion is associated with lower predicted onboarding difficulty, validating the construct direction of the ODS function.

The Interaction Model plot (center, orange) shows a nearly identical correlation of r = -0.282, with a similar downward-sloping regression line. The tighter clustering of points along the regression line compared to the linear model reflects the interaction model's reduced variance (std = 0.086 vs 0.095). The horizontal banding pattern is preserved, confirming that the interaction terms do not fundamentally alter the relationship between ODS and financial inclusion. The near-equivalent correlation coefficients (r = -0.285 vs -0.282) indicate that the two models capture essentially the same dimension of financial inclusion despite their different functional forms.

The Segment-Specific plot (rightmost, green) shows a slightly weaker correlation of r = -0.273, with the regression line showing a marginally flatter slope. The scatter is more dispersed than the other two models, reflecting the between-platform coefficient variation that introduces additional noise into the aggregate relationship. The horizontal banding pattern is still visible but less distinct, confirming that the segment-specific calibration introduces platform-level heterogeneity that slightly weakens the overall ODS-FI relationship when pooled across all platforms.

The comparison reveals that all three models achieve statistically significant negative correlations with financial inclusion (all p < 0.001), confirming construct validity. The linear model achieves the strongest correlation (r = -0.285), followed by the interaction model (r = -0.282) and the segment model (r = -0.273). The differences are small (range of 0.012), suggesting that the choice of function specification has minimal impact on the aggregate relationship with financial inclusion. The horizontal banding, while visually prominent, does not invalidate the correlation analysis — the within-band variation provides sufficient statistical power for significance testing.

---

## Figure 4: Score by Trust Category

The fourth figure displays grouped bar charts comparing the mean ODS scores across three trust categories (Low Trust, Medium Trust, High Trust) for each of the three functions.

The Linear Weighted Sum plot (leftmost, blue) reveals an inverted U-shaped pattern. Low Trust workers have a mean score of 0.5740, Medium Trust workers have the highest at 0.6250, and High Trust workers have the lowest at 0.5465. This non-monotonic pattern is counterintuitive — one might expect difficulty to decrease monotonically with trust. The explanation lies in the regression coefficient structure: TI has a small positive coefficient (0.028) in the ODI model, meaning that controlling for other indices, higher trust is associated with slightly higher predicted difficulty. The Medium Trust group likely represents workers with moderate financial literacy and digital confidence who have developed institutional trust but still face structural barriers, while the High Trust group combines high literacy with high trust, producing the lowest difficulty scores.

The Interaction Model plot (center, orange) shows the same inverted U-shaped pattern with higher absolute values. Low Trust: 0.6385, Medium Trust: 0.6833, High Trust: 0.6129. The upward shift of approximately 0.06 units across all categories confirms the systematic increase from interaction terms. The relative ordering is preserved (Medium > Low > High), confirming that the interaction model does not alter the trust-difficulty relationship structure. The gap between Medium and High Trust (0.070) is slightly larger than in the linear model (0.079), suggesting that the interaction terms amplify the trust-category differences.

The Segment-Specific plot (rightmost, green) shows the same pattern with slightly different magnitudes. Low Trust: 0.6024, Medium Trust: 0.6474, High Trust: 0.5771. The segment-specific calibration produces scores between the linear and interaction models for each trust category. The consistent inverted U-shape across all three functions confirms that this pattern is robust to the choice of function specification and reflects a genuine structural relationship in the data.

The inverted U-shaped trust pattern has important implications for the onboarding difficulty construct. It suggests that trust alone does not reduce difficulty — rather, trust must be combined with high literacy and digital confidence to produce the lowest difficulty scores. Workers with medium trust but moderate literacy face a different set of barriers than workers with low trust and low literacy. This finding supports the use of a multivariate function rather than a simple trust-based scoring approach.

---

## Figure 5: Score by Income Category

The fifth figure displays grouped bar charts comparing the mean ODS scores across five income categories (Very Low, Low, Medium, High, Very High) for each of the three functions.

The Linear Weighted Sum plot (leftmost, blue) shows a clear monotonic gradient. Very Low income workers have the highest mean score (0.5812), and scores decrease through Low (0.5636), Medium (0.5542), High (0.5509), to Very High (0.5392). The total decrease from Very Low to Very High is 0.042 units, representing a 7.2% reduction. The steepest drop occurs between Very Low and Low income categories (0.018), with progressively smaller decreases at higher income levels. This gradient confirms that income level is a consistent predictor of onboarding difficulty, operating through the IVI and FLI channels.

The Interaction Model plot (center, orange) shows the same monotonic gradient with higher absolute values. Very Low: 0.6442, Low: 0.6283, Medium: 0.6196, High: 0.6167, Very High: 0.6062. The total decrease from Very Low to Very High is 0.038 units, slightly smaller than the linear model's 0.042. The interaction terms compress the income gradient somewhat, as the subadditive FLI-DCI interaction dampens the extreme predictions that the linear model produces at low income levels. The steepest drop still occurs between Very Low and Low categories (0.016).

The Segment-Specific plot (rightmost, green) shows the same gradient with intermediate values. Very Low: 0.6091, Low: 0.5933, Medium: 0.5841, High: 0.5810, Very High: 0.5661. The total decrease from Very Low to Very High is 0.043 units, the largest among the three models. The segment-specific calibration amplifies the income gradient by applying platform-specific coefficients that may weight the IVI component more heavily for certain platforms where income volatility is more pronounced.

The consistent monotonic gradient across all three functions confirms that income level is a robust predictor of onboarding difficulty. The gradient operates primarily through two channels: the IVI component (higher volatility at lower incomes) and the FLI component (lower financial literacy at lower incomes). The practical implication is that financial inclusion interventions targeting Very Low and Low income workers would have the greatest marginal impact on reducing population-level onboarding difficulty. The diminishing gradient at higher income levels suggests that interventions targeting Medium and High income workers would yield smaller returns.

---

## Figure 6: Function Comparison

The sixth figure presents two scatter plots comparing the pairwise relationships among the three ODS functions, with the red dashed line representing the identity line (y = x).

The Linear vs Interaction plot (leftmost, purple) shows an extremely strong positive correlation of r = 0.998, with points clustered tightly along a line that runs parallel to but slightly above the identity line. The tight clustering confirms that the linear and interaction models produce nearly identical rankings of workers. The systematic upward displacement from the identity line (interaction scores are consistently higher than linear scores) confirms the rightward shift observed in the distribution comparison. The narrow band of scatter around the fitted line indicates that the interaction terms add complexity without fundamentally altering the predictive structure. The near-perfect correlation (r = 0.998) suggests that for most practical purposes, the simpler linear model would produce equivalent results to the interaction model.

The Linear vs Segment plot (rightmost, brown) shows a strong but slightly weaker correlation of r = 0.972, with points scattered more broadly around the identity line. The increased scatter reflects the platform-specific coefficient variation that introduces between-platform heterogeneity into the segment model's predictions. Points above the identity line represent workers for whom the segment model predicts higher difficulty than the linear model, while points below represent the opposite. The scatter is roughly symmetric around the identity line, confirming that the segment model does not systematically over- or under-predict relative to the linear model. The correlation of 0.972, while slightly lower than the linear-interaction correlation (0.998), still indicates very strong agreement between the two approaches.

The comparison reveals that the linear and interaction models are nearly interchangeable (r = 0.998), while the segment model introduces meaningful but not dramatic differences (r = 0.972). For the recommended interaction model, the near-equivalence with the linear model suggests that the interaction terms provide theoretical richness without substantially changing practical predictions. The segment model's additional differentiation is most pronounced for workers at the extremes of the difficulty distribution, where platform-specific coefficients have the largest impact.

---

## Figure 7: Recommended Function — Interaction Model (ODS_interaction)

The fourth and final figure provides a comprehensive four-panel view of the recommended Interaction Model, combining distribution analysis, platform segmentation, and validation against two key outcome variables.

The top-left panel (Overall Distribution) shows the histogram of ODS_interaction scores with a red dashed line at the mean of 0.6284. The distribution is roughly symmetric with a slight right skew, spanning from approximately 0.40 to 0.87. The highest frequency bin near 0.62 contains nearly 5,000 workers, confirming the concentration of predicted difficulty scores in the moderate-to-high range. The absence of extreme values near 0 or 1 confirms that the clipping function (np.clip to [0, 1]) has not been activated, and all predicted scores fall within the practical range.

The top-right panel (By Platform Type) shows overlapping histograms of ODS_interaction scores segmented by the seven platform types. The food_delivery segment (salmon) dominates the frequency scale, with its distribution centered near 0.63. The ride_hailing segment (blue) shows a distribution shifted slightly to the left (lower difficulty), while the bike_taxi segment (brown) shows a distribution shifted to the right (higher difficulty). The substantial overlap of the distributions across platforms confirms that while platform type influences the predicted difficulty, the within-platform variation is larger than the between-platform variation. This pattern supports the use of a single function specification for population-level analysis, with platform-specific calibration reserved for individual-level assessment.

The bottom-left panel (ODS vs ODI) presents a scatter plot of the predicted ODS_interaction scores against the original Onboarding Difficulty Index (ODI), with a fitted regression line showing r = 0.415. The positive correlation confirms that the ODS function successfully captures the same underlying construct as the ODI from which it was derived. The moderate magnitude (r = 0.415) indicates that while the ODS is related to ODI, it captures additional dimensions through the FLI, DCI, TI, and IVI channels that are not present in the ODI alone. The scatter shows a positive linear relationship with some heteroscedasticity — the spread of ODI values increases at higher ODS levels, suggesting that the ODS function is more precise for low-difficulty workers than for high-difficulty workers.

The bottom-right panel (ODS vs FI Index) presents a scatter plot of ODS_interaction scores against the Financial Inclusion Index, with a fitted regression line showing r = -0.282. The negative correlation confirms that higher predicted onboarding difficulty is associated with lower financial inclusion, validating the construct direction. The horizontal banding pattern reflects the discrete Financial Inclusion Index values, but the downward slope of the regression line is clearly visible. The correlation magnitude (r = -0.282) is moderate but highly significant (p < 0.001), confirming that the ODS function captures a meaningful portion of the variation in financial inclusion outcomes.

The four-panel view confirms that the recommended Interaction Model produces well-behaved, interpretable scores that are theoretically consistent, empirically validated, and practically useful for assessing onboarding difficulty across the gig worker population.

---

*Analysis based on 50,000 gig worker survey responses.*
*All figures located in: onboarding_score/outputs/*
