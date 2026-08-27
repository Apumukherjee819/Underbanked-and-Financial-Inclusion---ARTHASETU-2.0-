import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
from scipy import stats
from scipy.stats import f_oneway, kruskal, mannwhitneyu, spearmanr, pearsonr
import statsmodels.api as sm
from statsmodels.formula.api import ols
import sys, io, os
warnings.filterwarnings('ignore')
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
plt.rcParams['figure.dpi'] = 150
plt.rcParams['savefig.dpi'] = 150
plt.rcParams['font.size'] = 10
sns.set_style("whitegrid")
DATA_PATH = r"C:\Users\arpam\OneDrive\Desktop\SMART INDIA HACKATHON\appPrototype\index_construction\outputs\data_with_indices.csv"
OUTPUT_DIR = r"C:\Users\arpam\OneDrive\Desktop\SMART INDIA HACKATHON\appPrototype\hypothesis_testing\outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)
df = pd.read_csv(DATA_PATH)
print(f"Data loaded: {df.shape[0]} rows, {df.shape[1]} columns")
indices = ['FLI', 'DCI', 'TI', 'ODI', 'IVI']

# ============================================================================
# PART 1: CORRELATION ANALYSIS
# ============================================================================
print("\n" + "="*70)
print("PART 1: CORRELATION ANALYSIS")
print("="*70)

# 1a. Pearson correlation matrix
pearson_corr = df[indices].corr(method='pearson')
print("\n1a. Pearson Correlation Matrix:")
print(pearson_corr.round(4).to_string())

# 1b. Spearman correlation matrix
spearman_corr = df[indices].corr(method='spearman')
print("\n1b. Spearman Correlation Matrix:")
print(spearman_corr.round(4).to_string())

# 1c. Correlation p-values
print("\n1c. Correlation P-values (Pearson):")
for i in range(len(indices)):
    for j in range(i+1, len(indices)):
        r, p = pearsonr(df[indices[i]], df[indices[j]])
        sig = "***" if p < 0.001 else "**" if p < 0.01 else "*" if p < 0.05 else "ns"
        print(f"  {indices[i]} vs {indices[j]}: r={r:.4f}, p={p:.2e} {sig}")

# 1d. Correlation with proxy variables
proxy_vars = ['onboarding_document_issue', 'financial_inclusion_index',
              'has_bank_account', 'has_upi', 'has_social_security',
              'savings_rate', 'expense_ratio', 'emi_burden_ratio']
print("\n1d. Index Correlations with Onboarding Proxy Variables:")
df['doc_issue_binary'] = df['onboarding_document_issue'].notna().astype(int)
for proxy in proxy_vars:
    if proxy in df.columns:
        print(f"\n  {proxy}:")
        for idx in indices:
            if proxy == 'onboarding_document_issue':
                r, p = spearmanr(df[idx], df['doc_issue_binary'])
            elif df[proxy].dtype in ['float64', 'int64']:
                r, p = pearsonr(df[idx], df[proxy].fillna(0))
            else:
                r, p = spearmanr(df[idx], df[proxy].fillna(0).astype(int))
            sig = "***" if p < 0.001 else "**" if p < 0.01 else "*" if p < 0.05 else "ns"
            print(f"    {idx}: r={r:.4f}, p={p:.2e} {sig}")

# ============================================================================
# PART 2: SEGMENT-WISE ANALYSIS (Platform Types)
# ============================================================================
print("\n" + "="*70)
print("PART 2: SEGMENT-WISE ANALYSIS (Platform Types)")
print("="*70)

platforms = df['platform_type'].unique()
print(f"\nPlatform segments: {list(platforms)}")

# 2a. Segment-wise descriptive statistics
print("\n2a. Segment-wise Index Statistics:")
for idx in indices:
    print(f"\n  {idx} by Platform Type:")
    grp = df.groupby('platform_type')[idx].agg(['mean', 'std', 'median', 'count'])
    print(grp.round(4).to_string())

# 2b. ANOVA test for each index across platform types
print("\n2b. One-way ANOVA Tests (Index ~ Platform Type):")
for idx in indices:
    groups = [df[df['platform_type'] == p][idx].dropna() for p in platforms]
    f_stat, p_val = f_oneway(*groups)
    sig = "***" if p_val < 0.001 else "**" if p_val < 0.01 else "*" if p_val < 0.05 else "ns"
    print(f"  {idx}: F={f_stat:.4f}, p={p_val:.2e} {sig}")

# 2c. Kruskal-Wallis test (non-parametric)
print("\n2c. Kruskal-Wallis Tests (non-parametric):")
for idx in indices:
    groups = [df[df['platform_type'] == p][idx].dropna() for p in platforms]
    h_stat, p_val = kruskal(*groups)
    sig = "***" if p_val < 0.001 else "**" if p_val < 0.01 else "*" if p_val < 0.05 else "ns"
    print(f"  {idx}: H={h_stat:.4f}, p={p_val:.2e} {sig}")

# ============================================================================
# PART 3: OLS REGRESSION ANALYSIS
# ============================================================================
print("\n" + "="*70)
print("PART 3: OLS REGRESSION ANALYSIS")
print("="*70)

# 3a. ODI predicted by other indices
print("\n3a. Regression: ODI ~ FLI + DCI + TI + IVI")
X1 = df[['FLI', 'DCI', 'TI', 'IVI']].dropna()
y1 = df.loc[X1.index, 'ODI']
X1_const = sm.add_constant(X1)
model1 = sm.OLS(y1, X1_const).fit()
print(model1.summary())

# 3b. Financial Inclusion Index ~ all 5
print("\n3b. Regression: Financial_Inclusion ~ FLI + DCI + TI + ODI + IVI")
X2 = df[indices].dropna()
y2 = df.loc[X2.index, 'financial_inclusion_index']
X2_const = sm.add_constant(X2)
model2 = sm.OLS(y2, X2_const).fit()
print(model2.summary())

# 3c. Savings Rate ~ all 5
print("\n3c. Regression: Savings_Rate ~ FLI + DCI + TI + ODI + IVI")
X3 = df[indices].dropna()
y3 = df.loc[X3.index, 'savings_rate']
X3_const = sm.add_constant(X3)
model3 = sm.OLS(y3, X3_const).fit()
print(model3.summary())

# 3d. Document Issue ~ all 5
print("\n3d. Regression: Doc_Issue ~ FLI + DCI + TI + ODI + IVI")
df['doc_issue_numeric'] = df['onboarding_document_issue'].notna().astype(int)
X5 = df[indices].dropna()
y5 = df.loc[X5.index, 'doc_issue_numeric']
X5_const = sm.add_constant(X5)
model5 = sm.OLS(y5, X5_const).fit()
print(model5.summary())

# ============================================================================
# PART 4: SEGMENT-WISE REGRESSIONS
# ============================================================================
print("\n" + "="*70)
print("PART 4: SEGMENT-WISE REGRESSIONS (by Platform Type)")
print("="*70)

print("\n4a. Regression: ODI ~ FLI + DCI + TI + IVI (by Platform Type)")
segment_models = {}
for plat in platforms:
    sub = df[df['platform_type'] == plat].dropna(subset=indices + ['ODI'])
    if len(sub) > 30:
        X_seg = sm.add_constant(sub[['FLI', 'DCI', 'TI', 'IVI']])
        y_seg = sub['ODI']
        model_seg = sm.OLS(y_seg, X_seg).fit()
        segment_models[plat] = model_seg
        print(f"\n  {plat} (n={len(sub)}):")
        print(f"    R-squared: {model_seg.rsquared:.4f}")
        print(f"    Adj R-squared: {model_seg.rsquared_adj:.4f}")
        for var in ['FLI', 'DCI', 'TI', 'IVI']:
            coef = model_seg.params[var]
            pval = model_seg.pvalues[var]
            sig = "***" if pval < 0.001 else "**" if pval < 0.01 else "*" if pval < 0.05 else "ns"
            print(f"    {var}: coef={coef:.4f}, p={pval:.4f} {sig}")

# ============================================================================
# PART 5: INTERACTION EFFECTS
# ============================================================================
print("\n" + "="*70)
print("PART 5: INTERACTION EFFECTS")
print("="*70)

# 5a. FLI x DCI interaction
print("\n5a. ODI ~ FLI + DCI + FLI:DCI")
df['FLI_x_DCI'] = df['FLI'] * df['DCI']
X_int1 = sm.add_constant(df[['FLI', 'DCI', 'FLI_x_DCI']].dropna())
y_int1 = df.loc[X_int1.index, 'ODI']
model_int1 = sm.OLS(y_int1, X_int1).fit()
print(f"  R-squared: {model_int1.rsquared:.4f}")
print(f"  FLI: {model_int1.params['FLI']:.4f} (p={model_int1.pvalues['FLI']:.4f})")
print(f"  DCI: {model_int1.params['DCI']:.4f} (p={model_int1.pvalues['DCI']:.4f})")
print(f"  FLI:DCI: {model_int1.params['FLI_x_DCI']:.4f} (p={model_int1.pvalues['FLI_x_DCI']:.4f})")

# 5b. FLI x TI interaction
print("\n5b. ODI ~ FLI + TI + FLI:TI")
df['FLI_x_TI'] = df['FLI'] * df['TI']
X_int2 = sm.add_constant(df[['FLI', 'TI', 'FLI_x_TI']].dropna())
y_int2 = df.loc[X_int2.index, 'ODI']
model_int2 = sm.OLS(y_int2, X_int2).fit()
print(f"  R-squared: {model_int2.rsquared:.4f}")
print(f"  FLI: {model_int2.params['FLI']:.4f} (p={model_int2.pvalues['FLI']:.4f})")
print(f"  TI: {model_int2.params['TI']:.4f} (p={model_int2.pvalues['TI']:.4f})")
print(f"  FLI:TI: {model_int2.params['FLI_x_TI']:.4f} (p={model_int2.pvalues['FLI_x_TI']:.4f})")

# 5c. DCI x TI interaction
print("\n5c. ODI ~ DCI + TI + DCI:TI")
df['DCI_x_TI'] = df['DCI'] * df['TI']
X_int3 = sm.add_constant(df[['DCI', 'TI', 'DCI_x_TI']].dropna())
y_int3 = df.loc[X_int3.index, 'ODI']
model_int3 = sm.OLS(y_int3, X_int3).fit()
print(f"  R-squared: {model_int3.rsquared:.4f}")
print(f"  DCI: {model_int3.params['DCI']:.4f} (p={model_int3.pvalues['DCI']:.4f})")
print(f"  TI: {model_int3.params['TI']:.4f} (p={model_int3.pvalues['TI']:.4f})")
print(f"  DCI:TI: {model_int3.params['DCI_x_TI']:.4f} (p={model_int3.pvalues['DCI_x_TI']:.4f})")

# 5d. Full model with interactions
print("\n5d. Full Model: ODI ~ FLI + DCI + TI + IVI + interactions")
df['IVI_x_FLI'] = df['IVI'] * df['FLI']
X_full = sm.add_constant(df[['FLI', 'DCI', 'TI', 'IVI', 'FLI_x_DCI', 'FLI_x_TI', 'DCI_x_TI', 'IVI_x_FLI']].dropna())
y_full = df.loc[X_full.index, 'ODI']
model_full = sm.OLS(y_full, X_full).fit()
print(f"  R-squared: {model_full.rsquared:.4f}")
print(f"  Adj R-squared: {model_full.rsquared_adj:.4f}")
for var in X_full.columns:
    if var != 'const':
        coef = model_full.params[var]
        pval = model_full.pvalues[var]
        sig = "***" if pval < 0.001 else "**" if pval < 0.01 else "*" if pval < 0.05 else "ns"
        print(f"  {var}: coef={coef:.4f}, p={pval:.4f} {sig}")

# ============================================================================
# PART 6: VIF (Multicollinearity Check)
# ============================================================================
print("\n" + "="*70)
print("PART 6: VARIANCE INFLATION FACTOR (VIF)")
print("="*70)

from statsmodels.stats.outliers_influence import variance_inflation_factor
X_vif = df[indices].dropna()
vif_data = pd.DataFrame()
vif_data['Index'] = indices
vif_data['VIF'] = [variance_inflation_factor(X_vif.values, i) for i in range(len(indices))]
print(vif_data.to_string(index=False))

# ============================================================================
# PART 7: VISUALIZATIONS
# ============================================================================
print("\n" + "="*70)
print("PART 7: GENERATING VISUALIZATIONS")
print("="*70)

# VIZ 1: Inter-index correlation heatmap
fig, axes = plt.subplots(1, 2, figsize=(16, 7))
sns.heatmap(pearson_corr, annot=True, fmt='.3f', cmap='RdBu_r', center=0, ax=axes[0], square=True, linewidths=1, vmin=-1, vmax=1)
axes[0].set_title('Pearson Correlation Heatmap', fontsize=13, fontweight='bold')
sns.heatmap(spearman_corr, annot=True, fmt='.3f', cmap='RdBu_r', center=0, ax=axes[1], square=True, linewidths=1, vmin=-1, vmax=1)
axes[1].set_title('Spearman Correlation Heatmap', fontsize=13, fontweight='bold')
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/01_index_correlation_heatmaps.png', bbox_inches='tight', dpi=150)
plt.close()
print("Saved: 01_index_correlation_heatmaps.png")

# VIZ 2: Index distributions by platform type
fig, axes = plt.subplots(2, 3, figsize=(20, 12))
fig.suptitle('Index Distributions by Platform Type', fontsize=16, fontweight='bold', y=1.02)
palette = sns.color_palette("Set2", len(platforms))
for i, idx in enumerate(indices):
    ax = axes[i // 3, i % 3]
    for j, plat in enumerate(platforms):
        subset = df[df['platform_type'] == plat][idx].dropna()
        ax.hist(subset, bins=25, alpha=0.4, label=plat, color=palette[j], edgecolor='black', linewidth=0.3)
    ax.set_xlabel(f'{idx} Score')
    ax.set_ylabel('Frequency')
    ax.set_title(f'{idx} Distribution by Platform')
    ax.legend(fontsize=7)
axes[1, 2].axis('off')
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/02_index_distributions_by_platform.png', bbox_inches='tight', dpi=150)
plt.close()
print("Saved: 02_index_distributions_by_platform.png")

# VIZ 3: Box plots by platform type
fig, axes = plt.subplots(1, 5, figsize=(22, 5))
fig.suptitle('Index Box Plots by Platform Type', fontsize=14, fontweight='bold')
for i, idx in enumerate(indices):
    df.boxplot(column=idx, by='platform_type', ax=axes[i], rot=45, fontsize=7)
    axes[i].set_title(f'{idx}')
    axes[i].set_xlabel('')
plt.suptitle('')
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/03_boxplots_by_platform.png', bbox_inches='tight', dpi=150)
plt.close()
print("Saved: 03_boxplots_by_platform.png")

# VIZ 4: Regression coefficients comparison across segments
fig, ax = plt.subplots(figsize=(12, 6))
coefs_df = pd.DataFrame({plat: m.params.drop('const') for plat, m in segment_models.items()})
coefs_df.plot(kind='bar', ax=ax, edgecolor='black', linewidth=0.5)
ax.set_ylabel('Regression Coefficient')
ax.set_title('Segment-wise Regression Coefficients: ODI ~ FLI + DCI + TI + IVI', fontsize=12, fontweight='bold')
ax.legend(title='Platform', fontsize=8, bbox_to_anchor=(1.05, 1))
ax.axhline(y=0, color='black', linestyle='--', linewidth=0.8)
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/04_segment_coefficients.png', bbox_inches='tight', dpi=150)
plt.close()
print("Saved: 04_segment_coefficients.png")

# VIZ 5: Interaction effect scatter plots
fig, axes = plt.subplots(1, 3, figsize=(18, 5))
fig.suptitle('Interaction Effects on ODI', fontsize=14, fontweight='bold')
sample_idx = np.random.RandomState(42).choice(len(df), 2000, replace=False)
# FLI x DCI
ax = axes[0]
sc = ax.scatter(df['FLI'].iloc[sample_idx], df['DCI'].iloc[sample_idx],
                c=df['ODI'].iloc[sample_idx], cmap='YlOrRd', alpha=0.5, s=15)
plt.colorbar(sc, ax=ax, label='ODI Score')
ax.set_xlabel('FLI'); ax.set_ylabel('DCI')
ax.set_title('FLI x DCI colored by ODI')
# FLI x TI
ax = axes[1]
sc = ax.scatter(df['FLI'].iloc[sample_idx], df['TI'].iloc[sample_idx],
                c=df['ODI'].iloc[sample_idx], cmap='YlOrRd', alpha=0.5, s=15)
plt.colorbar(sc, ax=ax, label='ODI Score')
ax.set_xlabel('FLI'); ax.set_ylabel('TI')
ax.set_title('FLI x TI colored by ODI')
# DCI x TI
ax = axes[2]
sc = ax.scatter(df['DCI'].iloc[sample_idx], df['TI'].iloc[sample_idx],
                c=df['ODI'].iloc[sample_idx], cmap='YlOrRd', alpha=0.5, s=15)
plt.colorbar(sc, ax=ax, label='ODI Score')
ax.set_xlabel('DCI'); ax.set_ylabel('TI')
ax.set_title('DCI x TI colored by ODI')
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/05_interaction_scatter_plots.png', bbox_inches='tight', dpi=150)
plt.close()
print("Saved: 05_interaction_scatter_plots.png")

# VIZ 6: Coefficient significance forest plot
fig, ax = plt.subplots(figsize=(10, 7))
coef_names = ['FLI', 'DCI', 'TI', 'IVI']
coefs_main = [model1.params[v] for v in coef_names]
ci_low = [model1.conf_int().loc[v, 0] for v in coef_names]
ci_high = [model1.conf_int().loc[v, 1] for v in coef_names]
pvals_main = [model1.pvalues[v] for v in coef_names]
colors = ['green' if p < 0.05 else 'gray' for p in pvals_main]
ax.errorbar(coefs_main, range(len(coef_names)),
            xerr=[np.array(coefs_main) - np.array(ci_low), np.array(ci_high) - np.array(coefs_main)],
            fmt='o', color='black', ecolor='black', elinewidth=2, capsize=5, markersize=8)
ax.axvline(x=0, color='red', linestyle='--', linewidth=1)
ax.set_yticks(range(len(coef_names)))
ax.set_yticklabels(coef_names, fontsize=11)
ax.set_xlabel('Coefficient Value', fontsize=11)
ax.set_title('Regression Coefficients with 95% CI\nODI ~ FLI + DCI + TI + IVI', fontsize=12, fontweight='bold')
for i, (c, p) in enumerate(zip(coefs_main, pvals_main)):
    sig = "***" if p < 0.001 else "**" if p < 0.01 else "*" if p < 0.05 else "ns"
    ax.text(c + 0.01, i, f'{c:.3f} {sig}', va='center', fontsize=10)
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/06_forest_plot_coefficients.png', bbox_inches='tight', dpi=150)
plt.close()
print("Saved: 06_forest_plot_coefficients.png")

# VIZ 7: R-squared comparison across segments
fig, ax = plt.subplots(figsize=(10, 5))
r2_vals = {plat: m.rsquared for plat, m in segment_models.items()}
bars = ax.bar(range(len(r2_vals)), list(r2_vals.values()), color=sns.color_palette("Set2", len(r2_vals)), edgecolor='black', linewidth=0.5)
ax.set_xticks(range(len(r2_vals)))
ax.set_xticklabels(list(r2_vals.keys()), rotation=45, ha='right')
ax.set_ylabel('R-squared')
ax.set_title('Model Fit (R-squared) by Platform Segment', fontsize=12, fontweight='bold')
for bar, val in zip(bars, r2_vals.values()):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.005, f'{val:.4f}', ha='center', fontsize=10, fontweight='bold')
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/07_r_squared_by_segment.png', bbox_inches='tight', dpi=150)
plt.close()
print("Saved: 07_r_squared_by_segment.png")

print("\nAll hypothesis testing complete!")
