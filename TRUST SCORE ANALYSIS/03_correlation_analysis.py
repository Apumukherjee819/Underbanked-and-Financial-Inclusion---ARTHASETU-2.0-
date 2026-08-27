"""
STEP 3: Correlation Analysis & Heatmaps
Trust Scoring for Credit-Invisible Gig Workers
"""
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

OUTPUT_DIR = r"C:\Users\arpam\gig_trust_score_analysis\outputs"
plt.rcParams['figure.figsize'] = (14, 10)
plt.rcParams['font.size'] = 10
sns.set_style("whitegrid")

print("=" * 70)
print("STEP 3: CORRELATION ANALYSIS")
print("=" * 70)

df = pd.read_csv(f"{OUTPUT_DIR}/cleaned_data_with_features.csv")

# ─── 3.1 SELECT NUMERIC COLUMNS FOR CORRELATION ─────────────────
numeric_cols = [
    'age_years', 'years_on_platform', 'daily_hours_worked',
    'orders_or_rides_per_day', 'monthly_gross_income_inr',
    'monthly_net_income_inr', 'monthly_fuel_cost_inr',
    'monthly_emi_burden_inr', 'platform_rating_out_of_5',
    'order_cancellation_rate_pct', 'digital_literacy_score_1_5',
    'dependents_count', 'education_encoded', 'city_tier_encoded',
    'has_bank_account', 'has_upi', 'has_social_security',
    'is_migrant', 'has_secondary_income', 'vehicle_owned',
    'housing_stability', 'social_security_score', 'union_score',
    'income_to_fuel_ratio', 'net_income_per_order', 'emi_burden_ratio',
    'savings_rate', 'expense_ratio', 'work_intensity_score',
    'productivity_per_hour', 'commitment_score',
    'financial_inclusion_index', 'digital_readiness', 'trust_raw'
]

# ─── 3.2 PEARSON CORRELATION HEATMAP ────────────────────────────
print("\n--- 3.1 Pearson Correlation Heatmap ---")
corr_matrix = df[numeric_cols].corr(method='pearson')

fig, ax = plt.subplots(figsize=(20, 16))
mask = np.triu(np.ones_like(corr_matrix, dtype=bool), k=1)
cmap = sns.diverging_palette(250, 15, s=75, l=40, n=9, center="light", as_cmap=True)
sns.heatmap(corr_matrix, mask=mask, cmap=cmap, center=0, annot=False,
            square=True, linewidths=0.5, cbar_kws={"shrink": 0.8},
            vmin=-1, vmax=1, ax=ax)
ax.set_title('Pearson Correlation Heatmap - All Numeric Features', fontsize=16, pad=20)
plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/08_pearson_correlation_heatmap.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 08_pearson_correlation_heatmap.png")

# ─── 3.3 SPEARMAN CORRELATION HEATMAP ───────────────────────────
print("\n--- 3.2 Spearman Correlation Heatmap ---")
spearman_corr = df[numeric_cols].corr(method='spearman')

fig, ax = plt.subplots(figsize=(20, 16))
sns.heatmap(spearman_corr, mask=mask, cmap=cmap, center=0, annot=False,
            square=True, linewidths=0.5, cbar_kws={"shrink": 0.8},
            vmin=-1, vmax=1, ax=ax)
ax.set_title('Spearman Correlation Heatmap - All Numeric Features', fontsize=16, pad=20)
plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/09_spearman_correlation_heatmap.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 09_spearman_correlation_heatmap.png")

# ─── 3.4 TRUST SIGNAL CORRELATION (FOCUSED) ─────────────────────
print("\n--- 3.3 Trust Signal Correlation Matrix ---")
trust_cols = [
    'platform_rating_out_of_5', 'order_cancellation_rate_pct',
    'years_on_platform', 'monthly_net_income_inr', 'daily_hours_worked',
    'orders_or_rides_per_day', 'digital_literacy_score_1_5',
    'has_bank_account', 'has_upi', 'has_social_security',
    'education_encoded', 'commitment_score', 'financial_inclusion_index',
    'trust_raw', 'is_high_trust'
]

trust_corr = df[trust_cols].corr(method='spearman')

fig, ax = plt.subplots(figsize=(16, 14))
sns.heatmap(trust_corr, annot=True, fmt='.3f', cmap='RdYlGn', center=0,
            square=True, linewidths=0.5, cbar_kws={"shrink": 0.8},
            vmin=-1, vmax=1, ax=ax)
ax.set_title('Trust Signal Correlation Matrix (Spearman)', fontsize=16, pad=20)
plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/10_trust_signal_correlation.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 10_trust_signal_correlation.png")

# ─── 3.5 TOP CORRELATIONS WITH TRUST SCORE ──────────────────────
print("\n--- 3.4 Top Correlations with Trust Score ---")
trust_correlations = trust_corr['trust_raw'].drop('trust_raw').sort_values(ascending=False)
print("\n  Correlations with Trust Score (Spearman):")
for feat, corr_val in trust_correlations.items():
    print(f"    {feat:40s}: {corr_val:+.4f}")

# ─── 3.6 CORRELATION WITH INCOME ────────────────────────────────
print("\n--- 3.5 Top Correlations with Monthly Net Income ---")
income_correlations = spearman_corr['monthly_net_income_inr'].drop(
    ['monthly_net_income_inr', 'monthly_gross_income_inr']
).sort_values(ascending=False)
print("\n  Correlations with Net Income (Spearman):")
for feat, corr_val in income_correlations.head(15).items():
    print(f"    {feat:40s}: {corr_val:+.4f}")

# ─── 3.7 CHI-SQUARE TESTS (CATEGORICAL) ─────────────────────────
print("\n--- 3.6 Chi-Square Tests (Categorical Associations) ---")
cat_tests = [
    ('bank_account_type', 'trust_category'),
    ('upi_app_primary', 'trust_category'),
    ('social_security_coverage', 'trust_category'),
    ('vehicle_type', 'trust_category'),
    ('housing_type', 'trust_category'),
    ('education_level', 'trust_category'),
    ('platform_type', 'trust_category'),
    ('migrant_worker', 'trust_category'),
]

for c1, c2 in cat_tests:
    contingency = pd.crosstab(df[c1], df[c2])
    chi2, p, dof, expected = stats.chi2_contingency(contingency)
    cramers_v = np.sqrt(chi2 / (len(df) * (min(contingency.shape) - 1)))
    print(f"  {c1:35s} ~ {c2:20s}: chi2={chi2:10.2f}, p={p:.2e}, Cramers_V={cramers_v:.4f}")

# ─── 3.8 MUTUAL INFORMATION ─────────────────────────────────────
print("\n--- 3.7 Mutual Information Scores ---")
from sklearn.feature_selection import mutual_info_classif, mutual_info_regression

feature_cols = [
    'age_years', 'years_on_platform', 'daily_hours_worked',
    'orders_or_rides_per_day', 'monthly_net_income_inr',
    'monthly_fuel_cost_inr', 'monthly_emi_burden_inr',
    'platform_rating_out_of_5', 'order_cancellation_rate_pct',
    'digital_literacy_score_1_5', 'dependents_count',
    'education_encoded', 'city_tier_encoded',
    'has_bank_account', 'has_upi', 'has_social_security',
    'is_migrant', 'has_secondary_income', 'vehicle_owned',
    'housing_stability', 'social_security_score', 'union_score',
    'commitment_score', 'financial_inclusion_index', 'digital_readiness'
]

X_mi = df[feature_cols].fillna(0)
y_mi = df['is_high_trust']

mi_scores = mutual_info_classif(X_mi, y_mi, random_state=42)
mi_df = pd.DataFrame({'Feature': feature_cols, 'MI Score': mi_scores})
mi_df = mi_df.sort_values('MI Score', ascending=False)

print("\n  Mutual Information Scores (for High Trust prediction):")
for _, row in mi_df.iterrows():
    bar = '#' * int(row['MI Score'] * 50)
    print(f"    {row['Feature']:40s}: {row['MI Score']:.4f} {bar}")

fig, ax = plt.subplots(figsize=(12, 8))
sns.barplot(data=mi_df, x='MI Score', y='Feature', palette='viridis', ax=ax)
ax.set_title('Mutual Information Scores for Trust Prediction', fontsize=14)
ax.set_xlabel('MI Score')
ax.set_ylabel('Feature')
plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/11_mutual_information_scores.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 11_mutual_information_scores.png")

# ─── 3.9 SCATTER PAIRS (TOP CORRELATED FEATURES) ────────────────
print("\n--- 3.8 Scatter Plot Pairs ---")
top_features = ['commitment_score', 'monthly_net_income_inr', 'years_on_platform',
                'financial_inclusion_index', 'daily_hours_worked']

fig, axes = plt.subplots(2, 3, figsize=(18, 12))
axes = axes.flatten()

pairs = [
    ('commitment_score', 'trust_raw'),
    ('monthly_net_income_inr', 'trust_raw'),
    ('years_on_platform', 'trust_raw'),
    ('financial_inclusion_index', 'trust_raw'),
    ('daily_hours_worked', 'trust_raw'),
    ('orders_or_rides_per_day', 'monthly_net_income_inr'),
]

for i, (x_col, y_col) in enumerate(pairs):
    ax = axes[i]
    ax.scatter(df[x_col], df[y_col], alpha=0.1, s=5, c='steelblue')
    r, p = stats.spearmanr(df[x_col], df[y_col])
    ax.set_xlabel(x_col)
    ax.set_ylabel(y_col)
    ax.set_title(f'{x_col} vs {y_col}\nSpearman r={r:.3f}, p={p:.2e}')

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/12_scatter_pairs_top_features.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 12_scatter_pairs_top_features.png")

print("\n" + "=" * 70)
print("STEP 3 COMPLETE: Correlation analysis and heatmaps saved")
print("=" * 70)
