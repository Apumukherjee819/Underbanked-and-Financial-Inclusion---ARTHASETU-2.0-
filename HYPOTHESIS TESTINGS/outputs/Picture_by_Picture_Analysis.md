# Hypothesis Testing: Picture-by-Picture Analysis

## Figure 1: Index Correlation Heatmaps (Pearson and Spearman)

The first figure presents side-by-side Pearson and Spearman correlation heatmaps for the five indices, enabling comparison of linear and monotonic relationships. The Pearson heatmap on the left captures linear associations, while the Spearman heatmap on the right captures monotonic (rank-based) associations that may be nonlinear.

The most prominent feature in both heatmaps is the strong positive correlation between FLI and DCI, appearing as a deep orange-red cell with r = 0.615 (Pearson) and r = 0.578 (Spearman). This is the strongest positive correlation among all index pairs, confirming that financial literacy and digital confidence develop in tandem. The slight reduction from Pearson to Spearman (0.615 to 0.578) suggests that the relationship has a mildly nonlinear component — the linear model slightly overestimates the association at extreme values.

The second strongest positive correlation exists between FLI and IVI (r = 0.390 Pearson, r = 0.364 Spearman), appearing as a light orange cell. This relationship indicates that workers with higher financial literacy also tend to experience higher income volatility. The mechanism likely operates through the savings rate channel — financially literate workers are more aware of their income fluctuations and may report them more accurately, while also maintaining savings buffers that reveal expense-to-income volatility patterns.

The critical finding for function design is the negative correlation between DCI and ODI, shown as a light blue cell with r = -0.379 (Pearson) and r = -0.350 (Spearman). This is the strongest negative correlation in the entire matrix, establishing DCI as the primary index-level predictor of reduced onboarding difficulty. The consistency between Pearson and Spearman confirms that this relationship is both linear and monotonic.

The TI row and column show relatively weak correlations with all other indices. The strongest TI correlation is with FLI (r = 0.332 Pearson, r = 0.303 Spearman), followed by DCI (r = 0.290 Pearson, r = 0.316 Spearman). The near-zero correlations between TI and ODI (r = -0.051) and TI and IVI (r = -0.002) confirm that institutional trust operates largely independently of onboarding difficulty and income volatility.

The IVI column shows near-zero correlations with DCI (r = 0.004), TI (r = -0.002), and ODI (r = -0.010), all appearing as white cells. The only meaningful IVI correlation is with FLI (r = 0.390), suggesting that income volatility awareness is linked specifically to financial literacy rather than to digital confidence or institutional trust. The near-identical patterns across both heatmaps confirm that the observed relationships are robust to the choice of correlation method.

---

## Figure 2: Index Distributions by Platform Type

The second figure displays overlapping histograms of all five indices, segmented by the seven platform types (ride_hailing, food_delivery, logistics, quick_commerce, home_services, bike_taxi, hyperlocal). Each subplot shows the distribution of one index with colored overlays for each platform, enabling visual comparison of within-index variation across platforms.

The FLI subplot (top-left) reveals that food_delivery workers (the largest segment, shown in salmon) dominate the frequency scale, with their distribution centered near 0.45. The other platforms show similar distributional shapes but with varying peak heights proportional to their sample sizes. The overlapping patterns suggest that while mean FLI varies across platforms (as confirmed by ANOVA), the distributional shapes are broadly similar, indicating that the underlying financial literacy process operates consistently across platform types.

The DCI subplot (top-center) shows a pronounced left-skewed distribution for all platforms, with the highest concentration near 0.85-0.90. The food_delivery and ride_hailing segments show the tallest peaks, reflecting their larger sample sizes. The near-complete overlap of the distribution tails across platforms confirms that digital confidence is a universally high characteristic regardless of platform type, with minimal between-platform variation in the upper tail.

The TI subplot (top-right) displays the multi-modal pattern identified in the index construction phase, with distinct clusters near 0.55, 0.65, and 0.85. The food_delivery segment shows the most pronounced multi-modality, while ride_hailing shows a smoother distribution. This suggests that trust formation processes may differ across platforms, with some platforms producing more polarized trust profiles than others.

The ODI subplot (bottom-left) shows roughly symmetric distributions centered near 0.60 for all platforms. The food_delivery segment again dominates the frequency scale, but the distributional overlap is substantial. The similarity of the ODI distributions across platforms, despite the ANOVA-documented mean differences, suggests that the between-platform differences are driven by shifts in the central tendency rather than changes in distributional shape.

The IVI subplot (bottom-right) reveals the most distinct between-platform separation. The home_services segment (shown in purple) has a distribution shifted markedly to the left (lower volatility), while bike_taxi (shown in brown) shows a distribution shifted to the right (higher volatility). This visual separation confirms the ANOVA result that IVI shows the second-largest F-statistic (150.68) among the indices, indicating substantial between-platform heterogeneity in income volatility patterns.

---

## Figure 3: Box Plots by Platform Type

The third figure presents box plots for each index segmented by the seven platform types, enabling direct comparison of medians, interquartile ranges, and outlier patterns across platforms.

The FLI box plots (leftmost panel) show relatively compact boxes with medians ranging from approximately 0.38 (home_services) to 0.49 (ride_hailing). The home_services box is positioned noticeably lower than the others, confirming this segment's lower financial literacy. The ride_hailing box is positioned highest, consistent with its leading mean FLI (0.4827). All platforms show similar box widths (IQR), suggesting comparable within-platform heterogeneity in financial literacy.

The DCI box plots (second panel) show boxes shifted substantially upward compared to FLI, with medians ranging from approximately 0.83 (bike_taxi) to 0.93 (ride_hailing). The ride_hailing box extends the highest, with its upper quartile reaching approximately 1.1, while the bike_taxi box is the most compact. The presence of outlier dots below the lower whiskers for several platforms (particularly ride_hailing and bike_taxi) indicates that a small minority of workers in these segments have substantially lower digital confidence than their peers.

The TI box plots (center panel) show the widest interquartile ranges among all indices, reflecting the multi-modal distribution pattern. Medians range from approximately 0.63 (food_delivery) to 0.68 (home_services). The relatively wide boxes and whiskers confirm that institutional trust varies substantially within each platform, with the home_services segment showing the highest median trust despite having the lowest median FLI. This suggests that trust formation is partially independent of financial literacy.

The ODI box plots (fourth panel) show medians ranging from approximately 0.55 (ride_hailing) to 0.60 (bike_taxi). The ride_hailing box is positioned lowest, confirming that this segment faces the least onboarding difficulty. The bike_taxi box is positioned highest, consistent with its higher mean ODI. The boxes are relatively narrow compared to TI, indicating more homogeneous onboarding difficulty within each platform.

The IVI box plots (rightmost panel) show the most distinct between-platform separation. The home_services box is positioned lowest (median approximately 0.17), while the bike_taxi box is positioned highest (median approximately 0.21). The dense cluster of outlier dots above the upper whiskers for ride_hailing and bike_taxi confirms the presence of high-volatility workers in these segments. The narrowness of the boxes relative to the outlier spread indicates that most workers have similar volatility levels, with a distinct high-volatility minority driving the between-platform differences.

---

## Figure 4: Segment-wise Regression Coefficients

The fourth figure displays a grouped bar chart comparing the regression coefficients of FLI, DCI, TI, and IVI across the seven platform types, derived from running the ODI regression model separately for each segment. The horizontal dashed line at y = 0 serves as the reference for coefficient direction.

The FLI cluster (leftmost group) shows all seven platforms with positive coefficients ranging from approximately 0.25 (hyperlocal) to 0.30 (ride_hailing). The consistency of positive signs across all platforms confirms that financial literacy is universally associated with higher predicted ODI values when DCI is controlled for. The relatively tight clustering of coefficients (range of 0.05) indicates that the FLI-ODI relationship is stable across platform types, with ride_hailing showing the strongest effect and hyperlocal the weakest.

The DCI cluster (second group) shows all seven platforms with negative coefficients ranging from approximately -0.35 (logistics) to -0.41 (ride_hailing). The consistent negative direction across all platforms confirms that digital confidence is universally the strongest reducer of onboarding difficulty. The magnitude of DCI coefficients is roughly 1.3 to 1.6 times larger than the FLI coefficients, establishing DCI as the dominant predictor in every segment. The ride_hailing segment shows the strongest DCI effect, while logistics shows the weakest.

The TI cluster (third group) shows the most variable pattern. Four platforms (ride_hailing, food_delivery, home_services, bike_taxi) show small positive coefficients, while three platforms (logistics, quick_commerce, hyperlocal) show coefficients near zero or slightly negative. This variability confirms the Phase 1 finding that TI is statistically significant in only four of seven segments. The home_services segment shows the largest TI coefficient (approximately 0.055), while hyperlocal shows a coefficient near zero. This platform-dependent TI effect suggests that the role of institutional trust in determining onboarding difficulty varies by the nature of the worker-platform financial relationship.

The IVI cluster (rightmost group) shows all seven platforms with negative coefficients ranging from approximately -0.16 (bike_taxi) to -0.25 (ride_hailing). The consistent negative direction confirms that income volatility is universally associated with reduced predicted ODI. The ride_hailing segment shows the strongest IVI effect, while bike_taxi shows the weakest. The magnitude of IVI coefficients is roughly half that of DCI, establishing IVI as the second-strongest reducer of onboarding difficulty across all segments.

---

## Figure 5: Interaction Effects on ODI

The fifth figure presents three scatter plots examining pairwise interaction effects between indices, with point colors representing the ODI score (yellow = low difficulty, red = high difficulty). Each plot tests whether the effect of one index on ODI depends on the level of another.

The leftmost plot (FLI x DCI colored by ODI) reveals a striking horizontal banding pattern. The DCI values cluster at discrete horizontal levels (approximately 0.35, 0.5, 0.65, 0.85, 1.0, 1.2), reflecting the discrete nature of the digital literacy score component. Within each DCI band, the color gradient from left (low FLI) to right (high FLI) shows a transition from red (high ODI) to yellow (low ODI), confirming that higher FLI reduces ODI. However, the color gradient is steeper in the lower DCI bands (0.35-0.65) than in the upper bands (1.0-1.2), visually demonstrating the subadditive interaction — the marginal effect of FLI on ODI diminishes as DCI increases. At DCI = 1.2, the color is uniformly yellow regardless of FLI, confirming that high digital confidence overwhelms the FLI effect.

The center plot (FLI x TI colored by ODI) shows a more diffuse pattern with less distinct banding. The color gradient from bottom-left (low FLI, low TI) to top-right (high FLI, high TI) shows a general transition from red to yellow, but with substantial color mixing throughout. The scatter is wider and more dispersed than the FLI-DCI plot, reflecting the weaker correlation between FLI and TI (r = 0.332). The interaction effect is less visually apparent here, consistent with the weaker statistical significance of the FLI x TI interaction term (p = 0.008).

The rightmost plot (DCI x TI colored by ODI) shows a diagonal banding pattern, with points clustering along lines of constant DCI-TI ratio. The color gradient from bottom-left (low DCI, low TI) to top-right (high DCI, high TI) shows a transition from red to yellow, but with notable red clusters persisting even at moderate DCI levels when TI is low. This pattern suggests that the DCI effect on ODI is partially dependent on TI — workers with high DCI but low TI still face somewhat elevated ODI. The interaction term in the regression model (DCI x TI coefficient = -0.043, p = 0.037) confirms this visual pattern with a small but statistically significant negative interaction.

---

## Figure 6: Forest Plot of Regression Coefficients

The sixth figure presents a forest plot displaying the OLS regression coefficients with 95% confidence intervals for the model ODI ~ FLI + DCI + TI + IVI. The vertical red dashed line at x = 0 represents the null hypothesis of no effect. Coefficients to the right of the line indicate positive association with ODI (increasing difficulty), while coefficients to the left indicate negative association (reducing difficulty).

The DCI coefficient (second from bottom) is the most negative at -0.384, positioned far to the left of the null line with tight confidence intervals that do not approach zero. The three asterisks (***) confirm p < 0.001 significance. The tight confidence interval reflects the large sample size (n = 50,000) and the strong, consistent relationship between DCI and ODI. This coefficient's magnitude is the largest among all four predictors, establishing DCI as the single most powerful reducer of onboarding difficulty. For every one-unit increase in DCI, ODI decreases by 0.384 units, holding all other indices constant.

The IVI coefficient (top) is the second most negative at -0.213, also positioned well to the left of the null line with tight confidence intervals and *** significance. The magnitude is approximately 56% of the DCI coefficient, confirming IVI as the second-strongest predictor. The negative sign indicates that higher income volatility awareness is associated with lower onboarding difficulty, a finding that is theoretically consistent — workers who navigate volatile income streams develop coping mechanisms that reduce financial barriers.

The FLI coefficient (bottom) is positive at 0.283, positioned to the right of the null line with tight confidence intervals and *** significance. The positive sign, while seemingly counterintuitive, reflects the strong collinearity between FLI and DCI (r = 0.615). When DCI is held constant, the residual variation in FLI captures a different dimension — workers with high financial literacy but relatively lower digital confidence may face different onboarding barriers that are not captured by the DCI dimension. The magnitude (0.283) is roughly 74% of the DCI coefficient, confirming that FLI plays a substantial but secondary role.

The TI coefficient (second from top) is the smallest at 0.028, positioned just to the right of the null line. While statistically significant (***), the confidence interval is tight but the magnitude is modest — approximately 7% of the DCI coefficient. This confirms that institutional trust plays a minor role in determining onboarding difficulty compared to the literacy and volatility dimensions. The positive sign suggests that, controlling for other indices, higher trust is marginally associated with higher predicted ODI, possibly reflecting a suppressor effect in the multivariate context.

---

## Figure 7: Model Fit (R-squared) by Platform Segment

The seventh figure presents a bar chart comparing the R-squared values of the ODI regression model (ODI ~ FLI + DCI + TI + IVI) across the seven platform segments. The R-squared represents the proportion of ODI variance explained by the four predictor indices within each segment.

The ride_hailing segment achieves the highest R-squared at 0.1899, indicating that the four indices explain approximately 19% of onboarding difficulty variation for this group. This is the strongest model fit among all segments, suggesting that the linear relationship between indices and ODI is most pronounced for ride_hailing workers. The high fit may reflect the relatively standardized onboarding processes and financial tool usage patterns in the ride-hailing industry.

The hyperlocal segment achieves the second-highest R-squared at 0.1717, followed by home_services (0.1610), quick_commerce (0.1604), and food_delivery (0.1597). These four segments cluster tightly between 0.16 and 0.17, indicating broadly similar model performance. The consistency of fit across these diverse platform types suggests that the index-ODI relationship is not highly sensitive to the specific nature of the gig work.

The bike_taxi segment shows a lower R-squared of 0.1489, and the logistics segment shows the lowest at 0.1397. The reduced fit for these segments may reflect the influence of unmeasured variables that are more important for these platforms. For bike_taxi workers, factors such as vehicle ownership status, route familiarity, and local regulations may contribute additional ODI variation not captured by the five indices. For logistics workers, the more complex documentation requirements and regulatory environment may introduce ODI variation that operates through channels not measured by FLI, DCI, TI, or IVI.

The range of R-squared values across segments (0.14 to 0.19) is relatively narrow, confirming that the model performs consistently across platform types. The absence of extreme outliers (no segment below 0.13 or above 0.20) suggests that the index framework captures a common underlying structure of onboarding difficulty that operates across all platform types, even if the strength of individual relationships varies. This consistency supports the use of a single function specification for all segments, with the understanding that segment-specific calibration may provide marginal improvements in fit for ride_hailing and hyperlocal workers.

---

*Analysis based on 50,000 gig worker survey responses across 7 platform segments.*
*All figures located in: hypothesis_testing/outputs/*
