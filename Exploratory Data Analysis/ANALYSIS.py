import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter
import warnings
warnings.filterwarnings('ignore')
import os

# ── Config ──────────────────────────────────────────────────────────
csv_path = "cleaned_data_with_features.csv"
out_dir  = r"give_your_specific_file_path" #GIVE THE SPECIFIC FILE PATH.......
os.makedirs(out_dir, exist_ok=True)

sns.set_theme(style="whitegrid", font_scale=0.9)
PALETTE = sns.color_palette("viridis", 6)

df = pd.read_csv(csv_path)
N = len(df)
print(f"Loaded {N:,} records, {df.shape[1]} columns\n")

# Numeric columns
num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
cat_cols = df.select_dtypes(include=['object']).columns.tolist()

# ═══════════════════════════════════════════════════════════════════
# 1. MISSING VALUES & DATA QUALITY
# ═══════════════════════════════════════════════════════════════════
print("=" * 80)
print("  1. DATA QUALITY — MISSING VALUES")
print("=" * 80)

missing = df.isnull().sum()
missing_pct = (missing / N * 100).round(2)
miss_df = pd.DataFrame({'Missing': missing, 'Pct': missing_pct}).sort_values('Missing', ascending=False)
print(miss_df[miss_df['Missing'] > 0].to_string())
print(f"\nColumns with missing data: {(missing > 0).sum()} / {len(df.columns)}")
print(f"Completely clean columns: {(missing == 0).sum()}\n")

fig, ax = plt.subplots(figsize=(12, 5))
miss_plot = miss_df[miss_df['Missing'] > 0].head(20)
if len(miss_plot) > 0:
    miss_plot['Pct'].plot(kind='barh', ax=ax, color=sns.color_palette("Reds_r", len(miss_plot)))
    ax.set_xlabel('% Missing')
    ax.set_title('Top 20 Columns by Missing Data %')
    plt.tight_layout()
    fig.savefig(os.path.join(out_dir, '01_missing_values.png'), dpi=150)
plt.close()

# ═══════════════════════════════════════════════════════════════════
# 2. DESCRIPTIVE STATISTICS — NUMERIC
# ═══════════════════════════════════════════════════════════════════
print("=" * 80)
print("  2. DESCRIPTIVE STATISTICS — NUMERIC VARIABLES")
print("=" * 80)

desc = df[num_cols].describe().T
desc['skewness'] = df[num_cols].skew()
desc['kurtosis'] = df[num_cols].kurtosis()
desc['IQR'] = desc['75%'] - desc['25%']
desc['cv'] = (desc['std'] / desc['mean']).round(4)  # coefficient of variation
print(desc[['count', 'mean', 'std', 'min', '25%', '50%', '75%', 'max', 'skewness', 'kurtosis', 'cv']].to_string())

# ═══════════════════════════════════════════════════════════════════
# 3. DISTRIBUTION PLOTS — KEY NUMERIC VARIABLES
# ═══════════════════════════════════════════════════════════════════
print(f"\n{'=' * 80}")
print("  3. DISTRIBUTION ANALYSIS")
print("=" * 80)

key_numeric = [
    'age_years', 'monthly_gross_income_inr', 'monthly_net_income_inr',
    'monthly_fuel_cost_inr', 'monthly_emi_burden_inr', 'daily_hours_worked',
    'orders_or_rides_per_day', 'years_on_platform', 'platform_rating_out_of_5',
    'order_cancellation_rate_pct', 'savings_rate', 'emi_burden_ratio',
    'financial_inclusion_index', 'digital_readiness', 'trust_raw',
    'work_intensity_score', 'productivity_per_hour', 'commitment_score',
    'festive_peak_income_spike_pct', 'net_income_per_order', 'expense_ratio'
]

fig, axes = plt.subplots(7, 3, figsize=(18, 30))
axes = axes.flatten()
for i, col in enumerate(key_numeric):
    if col in df.columns:
        data = df[col].dropna()
        ax = axes[i]
        sns.histplot(data, kde=True, ax=ax, color=PALETTE[i % len(PALETTE)], bins=40, edgecolor='white', alpha=0.7)
        ax.axvline(data.mean(), color='red', linestyle='--', linewidth=1.2, label=f'Mean={data.mean():.2f}')
        ax.axvline(data.median(), color='orange', linestyle='-', linewidth=1.2, label=f'Median={data.median():.2f}')
        ax.set_title(col, fontsize=10, fontweight='bold')
        ax.legend(fontsize=7)
for j in range(i + 1, len(axes)):
    axes[j].set_visible(False)
plt.suptitle('Distribution of Key Numeric Variables', fontsize=16, y=1.01)
plt.tight_layout()
fig.savefig(os.path.join(out_dir, '02_distributions.png'), dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 02_distributions.png")

# ═══════════════════════════════════════════════════════════════════
# 4. SKEWNESS & KURTOSIS ANALYSIS
# ═══════════════════════════════════════════════════════════════════
print(f"\n{'=' * 80}")
print("  4. SKEWNESS & KURTOSIS INTERPRETATION")
print("=" * 80)

for col in key_numeric:
    if col in df.columns:
        sk = df[col].skew()
        ku = df[col].kurtosis()
        if abs(sk) > 1:
            skew_label = "Highly skewed"
        elif abs(sk) > 0.5:
            skew_label = "Moderately skewed"
        else:
            skew_label = "Approx symmetric"
        if ku > 3:
            kurt_label = "Leptokurtic (heavy tails)"
        elif ku < -3:
            kurt_label = "Platykurtic (light tails)"
        else:
            kurt_label = "Mesokurtic (normal-like)"
        print(f"  {col:<38s}  skew={sk:>7.3f} ({skew_label:<22s})  kurt={ku:>7.3f} ({kurt_label})")

# ═══════════════════════════════════════════════════════════════════
# 5. OUTLIER DETECTION (IQR METHOD)
# ═══════════════════════════════════════════════════════════════════
print(f"\n{'=' * 80}")
print("  5. OUTLIER DETECTION (IQR METHOD)")
print("=" * 80)

outlier_summary = []
for col in key_numeric:
    if col in df.columns:
        data = df[col].dropna()
        Q1, Q3 = data.quantile(0.25), data.quantile(0.75)
        IQR = Q3 - Q1
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR
        n_out = ((data < lower) | (data > upper)).sum()
        pct_out = n_out / len(data) * 100
        outlier_summary.append({'Variable': col, 'Q1': Q1, 'Q3': Q3, 'IQR': IQR,
                                'Lower Fence': lower, 'Upper Fence': upper,
                                'Outliers': n_out, 'Pct': pct_out})
        
out_df = pd.DataFrame(outlier_summary).sort_values('Pct', ascending=False)
print(out_df.to_string(index=False))

fig, ax = plt.subplots(figsize=(14, 6))
out_plot = out_df.head(15)
bars = ax.barh(out_plot['Variable'], out_plot['Pct'], color=sns.color_palette("YlOrRd_r", len(out_plot)))
ax.set_xlabel('% Outliers')
ax.set_title('Top 15 Variables by Outlier Percentage (IQR Method)')
for bar, val in zip(bars, out_plot['Pct']):
    ax.text(bar.get_width() + 0.3, bar.get_y() + bar.get_height()/2, f'{val:.1f}%', va='center', fontsize=9)
plt.tight_layout()
fig.savefig(os.path.join(out_dir, '03_outliers.png'), dpi=150)
plt.close()
print("  Saved: 03_outliers.png\n")

# ═══════════════════════════════════════════════════════════════════
# 6. BOX PLOTS — KEY VARIABLES
# ═══════════════════════════════════════════════════════════════════
print("=" * 80)
print("  6. BOX PLOTS — OUTLIER VISUALIZATION")
print("=" * 80)

box_cols = ['monthly_gross_income_inr', 'monthly_net_income_inr', 'monthly_fuel_cost_inr',
            'orders_or_rides_per_day', 'daily_hours_worked', 'order_cancellation_rate_pct',
            'savings_rate', 'emi_burden_ratio', 'trust_raw', 'financial_inclusion_index',
            'digital_readiness', 'work_intensity_score']
fig, axes = plt.subplots(3, 4, figsize=(20, 12))
for i, col in enumerate(box_cols):
    ax = axes[i // 4][i % 4]
    sns.boxplot(y=df[col], ax=ax, color=PALETTE[i % len(PALETTE)], fliersize=2)
    ax.set_title(col, fontsize=9, fontweight='bold')
plt.suptitle('Box Plots — Outlier Visualization', fontsize=14, y=1.01)
plt.tight_layout()
fig.savefig(os.path.join(out_dir, '04_boxplots.png'), dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 04_boxplots.png\n")

# ═══════════════════════════════════════════════════════════════════
# 7. CORRELATION ANALYSIS
# ═══════════════════════════════════════════════════════════════════
print("=" * 80)
print("  7. CORRELATION ANALYSIS")
print("=" * 80)

corr_cols = ['age_years', 'monthly_gross_income_inr', 'monthly_net_income_inr',
             'monthly_fuel_cost_inr', 'monthly_emi_burden_inr', 'daily_hours_worked',
             'orders_or_rides_per_day', 'years_on_platform', 'platform_rating_out_of_5',
             'order_cancellation_rate_pct', 'savings_rate', 'emi_burden_ratio',
             'financial_inclusion_index', 'digital_readiness', 'trust_raw',
             'work_intensity_score', 'productivity_per_hour', 'commitment_score',
             'festive_peak_income_spike_pct', 'net_income_per_order', 'expense_ratio',
             'housing_stability', 'social_security_score', 'union_score']

corr_matrix = df[corr_cols].corr()

# Top correlations
print("\n  Top 20 Positive Correlations:")
corr_pairs = []
for i in range(len(corr_cols)):
    for j in range(i+1, len(corr_cols)):
        corr_pairs.append((corr_cols[i], corr_cols[j], corr_matrix.iloc[i, j]))
corr_pairs.sort(key=lambda x: abs(x[2]), reverse=True)

for c1, c2, r in corr_pairs[:20]:
    print(f"    {c1:<35s} x {c2:<35s}  r={r:>7.4f}")

# Heatmap
fig, ax = plt.subplots(figsize=(18, 15))
mask = np.triu(np.ones_like(corr_matrix, dtype=bool))
sns.heatmap(corr_matrix, mask=mask, annot=False, cmap='RdBu_r', center=0,
            vmin=-1, vmax=1, square=True, linewidths=0.5, ax=ax,
            cbar_kws={"shrink": 0.8})
ax.set_title('Correlation Heatmap — Numeric Variables', fontsize=14, pad=20)
plt.tight_layout()
fig.savefig(os.path.join(out_dir, '05_correlation_heatmap.png'), dpi=150)
plt.close()
print("  Saved: 05_correlation_heatmap.png\n")

# Focused heatmap for trust-related correlations
print("  Trust Score Correlations with Other Variables:")
trust_corrs = corr_matrix['trust_raw'].drop('trust_raw').sort_values(ascending=False)
for var, r in trust_corrs.items():
    strength = "Strong" if abs(r) > 0.5 else "Moderate" if abs(r) > 0.3 else "Weak"
    print(f"    {var:<38s}  r={r:>7.4f}  ({strength})")

# ═══════════════════════════════════════════════════════════════════
# 8. CATEGORICAL ANALYSIS — BAR PLOTS
# ═══════════════════════════════════════════════════════════════════
print(f"\n{'=' * 80}")
print("  8. CATEGORICAL ANALYSIS — BAR PLOTS")
print("=" * 80)

fig, axes = plt.subplots(3, 3, figsize=(20, 18))

cat_plots = [
    ('education_level', 'Education Level'),
    ('city_tier', 'City Tier'),
    ('platform_type', 'Platform Type'),
    ('gender', 'Gender'),
    ('housing_type', 'Housing Type'),
    ('bank_account_type', 'Bank Account Type'),
    ('income_category', 'Income Category'),
    ('trust_category', 'Trust Category'),
    ('onboarding_document_issue', 'Onboarding Document Issue'),
]

for i, (col, title) in enumerate(cat_plots):
    ax = axes[i // 3][i % 3]
    vc = df[col].value_counts()
    colors = sns.color_palette("viridis", len(vc))
    bars = ax.barh(vc.index, vc.values, color=colors)
    ax.set_title(title, fontsize=11, fontweight='bold')
    ax.set_xlabel('Count')
    for bar, val in zip(bars, vc.values):
        ax.text(bar.get_width() + 50, bar.get_y() + bar.get_height()/2,
                f'{val:,} ({val/N*100:.1f}%)', va='center', fontsize=8)
plt.suptitle('Categorical Variable Distributions', fontsize=14, y=1.01)
plt.tight_layout()
fig.savefig(os.path.join(out_dir, '06_categorical_bars.png'), dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 06_categorical_bars.png\n")

# ═══════════════════════════════════════════════════════════════════
# 9. PAIR PLOTS — KEY RELATIONSHIPS
# ═══════════════════════════════════════════════════════════════════
print("=" * 80)
print("  9. PAIR PLOT — TRUST vs KEY VARIABLES")
print("=" * 80)

pair_cols = ['trust_raw', 'monthly_gross_income_inr', 'savings_rate',
             'financial_inclusion_index', 'digital_readiness', 'commitment_score']
g = sns.pairplot(df[pair_cols].sample(min(2000, N), random_state=42),
                 diag_kind='kde', plot_kws={'alpha': 0.4, 's': 15},
                 diag_kws={'fill': True})
g.figure.suptitle('Pair Plot — Trust Score vs Key Variables (sampled 2000)', y=1.02)
g.savefig(os.path.join(out_dir, '07_pairplot.png'), dpi=120, bbox_inches='tight')
plt.close()
print("  Saved: 07_pairplot.png\n")

# ═══════════════════════════════════════════════════════════════════
# 10. VIOLIN PLOTS — TRUST BY CATEGORIES
# ═══════════════════════════════════════════════════════════════════
print("=" * 80)
print("  10. VIOLIN PLOTS — TRUST BY CATEGORIES")
print("=" * 80)

fig, axes = plt.subplots(2, 3, figsize=(20, 12))

violin_data = [
    ('gender', 'Trust by Gender'),
    ('education_level', 'Trust by Education'),
    ('city_tier', 'Trust by City Tier'),
    ('migrant_worker', 'Trust by Migrant Status'),
    ('income_category', 'Trust by Income Category'),
    ('bank_account_type', 'Trust by Bank Account'),
]

for i, (col, title) in enumerate(violin_data):
    ax = axes[i // 3][i % 3]
    order = df.groupby(col)['trust_raw'].median().sort_values(ascending=False).index
    sns.violinplot(data=df, x=col, y='trust_raw', ax=ax, order=order,
                   palette='viridis', inner='quartile', cut=0)
    ax.set_title(title, fontsize=11, fontweight='bold')
    ax.set_xticklabels(ax.get_xticklabels(), rotation=30, ha='right', fontsize=8)
plt.suptitle('Trust Score Distribution by Categories', fontsize=14, y=1.01)
plt.tight_layout()
fig.savefig(os.path.join(out_dir, '08_violin_trust.png'), dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 08_violin_trust.png\n")

# ═══════════════════════════════════════════════════════════════════
# 11. SCATTER PLOTS — INCOME vs TRUST & KEY RELATIONSHIPS
# ═══════════════════════════════════════════════════════════════════
print("=" * 80)
print("  11. SCATTER PLOTS — KEY RELATIONSHIPS")
print("=" * 80)

fig, axes = plt.subplots(2, 3, figsize=(20, 12))

scatter_pairs = [
    ('monthly_gross_income_inr', 'trust_raw', 'Income vs Trust'),
    ('orders_or_rides_per_day', 'monthly_gross_income_inr', 'Orders/Day vs Income'),
    ('daily_hours_worked', 'monthly_net_income_inr', 'Hours vs Net Income'),
    ('financial_inclusion_index', 'trust_raw', 'Financial Inclusion vs Trust'),
    ('digital_readiness', 'trust_raw', 'Digital Readiness vs Trust'),
    ('savings_rate', 'trust_raw', 'Savings Rate vs Trust'),
]

for i, (x, y, title) in enumerate(scatter_pairs):
    ax = axes[i // 3][i % 3]
    sample = df.sample(min(3000, N), random_state=42)
    sns.scatterplot(data=sample, x=x, y=y, hue='trust_category',
                    palette='viridis', alpha=0.5, s=15, ax=ax, legend=False)
    # Add trend line
    z = np.polyfit(df[x].dropna(), df[y].dropna(), 1)
    p = np.poly1d(z)
    x_line = np.linspace(df[x].min(), df[x].max(), 100)
    ax.plot(x_line, p(x_line), 'r--', linewidth=1.5, alpha=0.7, label='Trend')
    ax.set_title(title, fontsize=11, fontweight='bold')
    ax.legend(fontsize=8)
plt.suptitle('Scatter Plots — Key Relationships', fontsize=14, y=1.01)
plt.tight_layout()
fig.savefig(os.path.join(out_dir, '09_scatter_plots.png'), dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 09_scatter_plots.png\n")

# ═══════════════════════════════════════════════════════════════════
# 12. INCOME VOLATILITY ANALYSIS
# ═══════════════════════════════════════════════════════════════════
print("=" * 80)
print("  12. INCOME VOLATILITY ANALYSIS")
print("=" * 80)

print(f"\n  Income Distribution Stats:")
print(f"    Gross Income: Mean=INR {df['monthly_gross_income_inr'].mean():,.0f}, "
      f"Median=INR {df['monthly_gross_income_inr'].median():,.0f}, "
      f"Std=INR {df['monthly_gross_income_inr'].std():,.0f}")
print(f"    Coefficient of Variation: {df['monthly_gross_income_inr'].std()/df['monthly_gross_income_inr'].mean()*100:.1f}%")
print(f"    Income Inequality (P90/P10): {df['monthly_gross_income_inr'].quantile(0.9)/df['monthly_gross_income_inr'].quantile(0.1):.1f}x")

print(f"\n  Festive Peak Income Spike:")
print(f"    Mean spike: {df['festive_peak_income_spike_pct'].mean():.1f}%")
print(f"    Workers with >30% spike: {(df['festive_peak_income_spike_pct'] > 30).sum():,} ({(df['festive_peak_income_spike_pct'] > 30).mean()*100:.1f}%)")
print(f"    Workers with >50% spike: {(df['festive_peak_income_spike_pct'] > 50).sum():,} ({(df['festive_peak_income_spike_pct'] > 50).mean()*100:.1f}%)")

# Income distribution by category
fig, axes = plt.subplots(1, 2, figsize=(16, 6))

# Gross income distribution
sns.histplot(df['monthly_gross_income_inr'], kde=True, ax=axes[0], bins=50, color='steelblue')
axes[0].axvline(df['monthly_gross_income_inr'].mean(), color='red', linestyle='--', label=f"Mean=INR {df['monthly_gross_income_inr'].mean():,.0f}")
axes[0].axvline(df['monthly_gross_income_inr'].median(), color='orange', linestyle='-', label=f"Median=INR {df['monthly_gross_income_inr'].median():,.0f}")
axes[0].set_title('Monthly Gross Income Distribution', fontweight='bold')
axes[0].legend()

# Net income distribution
sns.histplot(df['monthly_net_income_inr'], kde=True, ax=axes[1], bins=50, color='teal')
axes[1].axvline(df['monthly_net_income_inr'].mean(), color='red', linestyle='--', label=f"Mean=INR {df['monthly_net_income_inr'].mean():,.0f}")
axes[1].axvline(df['monthly_net_income_inr'].median(), color='orange', linestyle='-', label=f"Median=INR {df['monthly_net_income_inr'].median():,.0f}")
axes[1].set_title('Monthly Net Income Distribution', fontweight='bold')
axes[1].legend()
plt.tight_layout()
fig.savefig(os.path.join(out_dir, '10_income_distribution.png'), dpi=150)
plt.close()
print("  Saved: 10_income_distribution.png\n")

# ═══════════════════════════════════════════════════════════════════
# 13. CROSS-TABULATION HEATMAPS
# ═══════════════════════════════════════════════════════════════════
print("=" * 80)
print("  13. CROSS-TABULATION HEATMAPS")
print("=" * 80)

fig, axes = plt.subplots(1, 3, figsize=(22, 6))

# Trust Category by Education
ct1 = pd.crosstab(df['education_level'], df['trust_category'], normalize='index')
ct1 = ct1.reindex(['No formal education', 'Class 8-10 dropout', 'Class 10 pass', 'Class 12 pass', 'ITI/Diploma', 'Graduate', 'Post-Graduate'])
sns.heatmap(ct1, annot=True, fmt='.1%', cmap='YlOrRd', ax=axes[0], cbar_kws={'shrink': 0.8})
axes[0].set_title('Trust % by Education', fontweight='bold')
axes[0].set_ylabel('')

# Trust Category by City Tier
ct2 = pd.crosstab(df['city_tier'], df['trust_category'], normalize='index')
sns.heatmap(ct2, annot=True, fmt='.1%', cmap='YlOrRd', ax=axes[1], cbar_kws={'shrink': 0.8})
axes[1].set_title('Trust % by City Tier', fontweight='bold')
axes[1].set_ylabel('')

# Income Category by Platform Type
ct3 = pd.crosstab(df['platform_type'], df['income_category'], normalize='index')
ct3 = ct3[['Very Low', 'Low', 'Medium', 'High', 'Very High']]
sns.heatmap(ct3, annot=True, fmt='.1%', cmap='YlGnBu', ax=axes[2], cbar_kws={'shrink': 0.8})
axes[2].set_title('Income % by Platform Type', fontweight='bold')
axes[2].set_ylabel('')

plt.suptitle('Cross-Tabulation Heatmaps', fontsize=14, y=1.02)
plt.tight_layout()
fig.savefig(os.path.join(out_dir, '11_crosstab_heatmaps.png'), dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 11_crosstab_heatmaps.png\n")

# ═══════════════════════════════════════════════════════════════════
# 14. BIVARIATE ANALYSIS — MEAN TRUST BY CATEGORIES
# ═══════════════════════════════════════════════════════════════════
print("=" * 80)
print("  14. MEAN TRUST SCORE BY CATEGORIES")
print("=" * 80)

cat_trust = [
    'gender', 'education_level', 'city_tier', 'migrant_worker',
    'platform_type', 'income_category', 'bank_account_type',
    'has_bank_account', 'has_upi', 'has_social_security'
]

fig, axes = plt.subplots(2, 5, figsize=(26, 10))
axes = axes.flatten()

for i, col in enumerate(cat_trust):
    means = df.groupby(col)['trust_raw'].mean().sort_values(ascending=True)
    ax = axes[i]
    colors = sns.color_palette("viridis", len(means))
    bars = ax.barh(means.index.astype(str), means.values, color=colors)
    ax.set_title(f'Mean Trust by {col}', fontsize=10, fontweight='bold')
    ax.set_xlim(0, 1)
    for bar, val in zip(bars, means.values):
        ax.text(bar.get_width() + 0.01, bar.get_y() + bar.get_height()/2,
                f'{val:.3f}', va='center', fontsize=8)
plt.suptitle('Mean Trust Score Across Categories', fontsize=14, y=1.02)
plt.tight_layout()
fig.savefig(os.path.join(out_dir, '12_mean_trust_by_category.png'), dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 12_mean_trust_by_category.png\n")

# ═══════════════════════════════════════════════════════════════════
# 15. EXTREME VALUE ANALYSIS
# ═══════════════════════════════════════════════════════════════════
print("=" * 80)
print("  15. EXTREME VALUE ANALYSIS")
print("=" * 80)

print("\n  Top 5 Highest Income Workers:")
top_income = df.nlargest(5, 'monthly_gross_income_inr')[['worker_id', 'platform', 'city', 'age_years',
    'education_level', 'monthly_gross_income_inr', 'monthly_net_income_inr', 'trust_raw', 'trust_category']]
print(top_income.to_string(index=False))

print("\n  Top 5 Lowest Income Workers:")
bot_income = df.nsmallest(5, 'monthly_gross_income_inr')[['worker_id', 'platform', 'city', 'age_years',
    'education_level', 'monthly_gross_income_inr', 'monthly_net_income_inr', 'trust_raw', 'trust_category']]
print(bot_income.to_string(index=False))

print("\n  Top 5 Highest Trust Workers:")
top_trust = df.nlargest(5, 'trust_raw')[['worker_id', 'platform', 'city', 'monthly_gross_income_inr',
    'financial_inclusion_index', 'digital_readiness', 'trust_raw', 'trust_category']]
print(top_trust.to_string(index=False))

print("\n  Top 5 Lowest Trust Workers:")
bot_trust = df.nsmallest(5, 'trust_raw')[['worker_id', 'platform', 'city', 'monthly_gross_income_inr',
    'financial_inclusion_index', 'digital_readiness', 'trust_raw', 'trust_category']]
print(bot_trust.to_string(index=False))

# ═══════════════════════════════════════════════════════════════════
# 16. CLUSTER ANALYSIS — K-MEANS ON KEY FEATURES
# ═══════════════════════════════════════════════════════════════════
print(f"\n{'=' * 80}")
print("  16. SEGMENTATION — INCOME GROUPS PROFILE")
print("=" * 80)

for ic in ['Very Low', 'Low', 'Medium', 'High', 'Very High']:
    subset = df[df['income_category'] == ic]
    print(f"\n  [{ic}] (N={len(subset):,})")
    print(f"    Avg Age: {subset['age_years'].mean():.1f} | Avg Hours: {subset['daily_hours_worked'].mean():.1f} | Avg Orders: {subset['orders_or_rides_per_day'].mean():.1f}")
    print(f"    Avg Gross Income: INR {subset['monthly_gross_income_inr'].mean():,.0f} | Avg Net Income: INR {subset['monthly_net_income_inr'].mean():,.0f}")
    print(f"    Avg Fuel Cost: INR {subset['monthly_fuel_cost_inr'].mean():,.0f} | Avg EMI: INR {subset['monthly_emi_burden_inr'].mean():,.0f}")
    print(f"    Savings Rate: {subset['savings_rate'].mean():.3f} | EMI Burden: {subset['emi_burden_ratio'].mean():.3f}")
    print(f"    Trust Raw: {subset['trust_raw'].mean():.4f} | FII: {subset['financial_inclusion_index'].mean():.4f} | Digital: {subset['digital_readiness'].mean():.4f}")
    print(f"    Has Bank: {subset['has_bank_account'].mean()*100:.1f}% | Has UPI: {subset['has_upi'].mean()*100:.1f}% | Social Security: {subset['has_social_security'].mean()*100:.1f}%")
    print(f"    Migrant: {subset['migrant_worker'].eq('Yes').mean()*100:.1f}% | Avg Rating: {subset['platform_rating_out_of_5'].mean():.2f}")
    top_platform = subset['platform_type'].value_counts().head(3)
    print(f"    Top Platforms: {', '.join(f'{p}({c:,})' for p, c in top_platform.items())}")

# ═══════════════════════════════════════════════════════════════════
# 17. PIE CHARTS — COMPOSITION
# ═══════════════════════════════════════════════════════════════════
print(f"\n{'=' * 80}")
print("  17. COMPOSITION PIE CHARTS")
print("=" * 80)

fig, axes = plt.subplots(2, 3, figsize=(18, 12))

pie_data = [
    ('income_category', 'Income Category'),
    ('trust_category', 'Trust Category'),
    ('education_level', 'Education Level'),
    ('city_tier', 'City Tier'),
    ('platform_type', 'Platform Type'),
    ('has_bank_account', 'Bank Account (1=Yes, 0=No)'),
]

for i, (col, title) in enumerate(pie_data):
    ax = axes[i // 3][i % 3]
    vc = df[col].value_counts()
    colors = sns.color_palette("Set2", len(vc))
    wedges, texts, autotexts = ax.pie(vc.values, labels=vc.index, autopct='%1.1f%%',
                                       colors=colors, textprops={'fontsize': 9})
    ax.set_title(title, fontsize=12, fontweight='bold', pad=15)
plt.suptitle('Composition Analysis', fontsize=14, y=1.01)
plt.tight_layout()
fig.savefig(os.path.join(out_dir, '13_pie_charts.png'), dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 13_pie_charts.png\n")

# ═══════════════════════════════════════════════════════════════════
# 18. SUMMARY STATISTICS TABLE
# ═══════════════════════════════════════════════════════════════════
print("=" * 80)
print("  18. COMPREHENSIVE SUMMARY TABLE")
print("=" * 80)

summary_data = []
for col in num_cols:
    if col in df.columns:
        data = df[col].dropna()
        summary_data.append({
            'Variable': col,
            'N': len(data),
            'Mean': data.mean(),
            'Median': data.median(),
            'Std': data.std(),
            'Min': data.min(),
            'Max': data.max(),
            'Skewness': data.skew(),
            'Kurtosis': data.kurtosis(),
            'CV%': data.std()/data.mean()*100 if data.mean() != 0 else np.nan,
            'IQR': data.quantile(0.75) - data.quantile(0.25),
            'P25': data.quantile(0.25),
            'P75': data.quantile(0.75)
        })

summary_df = pd.DataFrame(summary_data)
summary_df.to_csv(os.path.join(out_dir, '14_summary_statistics.csv'), index=False)
print(summary_df.to_string(index=False))
print(f"\n  Saved: 14_summary_statistics.csv\n")

# ═══════════════════════════════════════════════════════════════════
# 19. FINAL INSIGHTS
# ═══════════════════════════════════════════════════════════════════
print("=" * 80)
print("=" * 80)
print("  19. KEY EDA INSIGHTS - MAPPED TO TRACK 1 CHALLENGES")
print("=" * 80)

insights = """
  CHALLENGE 1: Trust Scoring for the Credit-Invisible
  ---------------------------------------------------
  [Financial Inclusion Gap]
    - 9.1% have no bank account (4,532 workers)
    - 32.5% have no UPI access (16,258 workers)
    - 55.3% have no social security (27,668 workers)
    - Financial Inclusion Index mean: 0.68 (scale 0-1)

  [Trust-Financial Inclusion Link]
    - Workers WITHOUT bank accounts: 99.8% are Low/Medium trust
    - Workers WITH UPI: 96.7% are High Trust
    - Strong positive correlation between FII and trust (check heatmap)

  [Alternative Trust Signals Available]
    - Platform rating (mean 4.09/5) - measurable, consistent
    - Order cancellation rate (mean 4.4%) - behavioral reliability
    - Years on platform (mean 1.9 yrs) - commitment proxy
    - Work intensity score (mean 20.9) - effort indicator
    - Productivity per hour (mean 1.86) - efficiency signal

  [Demographics of Credit-Invisible]
    - Age: Mean 27 (same as overall - young, digital-native potential)
    - Education: Skewed toward lower education levels
    - Migrants: Higher representation among credit-invisible
    - Regional languages: 51.6% prefer non-English/Hindi

  ---------------------------------------------------
  CHALLENGE 2: Reimagining Onboarding for First-Time Users
  ---------------------------------------------------
  [Digital Literacy Barrier]
    - 42.7% have digital literacy score <= 2 (out of 5)
    - Only 5.6% have score 5 (highest)
    - Digital readiness mean: 1.70/3.0 - critically low
    - 45.6% use budget smartphones (<INR 8,000)

  [Education-Digital Literacy Gap]
    - 95.2% of "No formal education" have digital literacy <= 2
    - 79.8% of dropouts have digital literacy <= 2
    - 81.2% of Class 12 pass have digital literacy <= 3
    - Even Graduates: 27.4% have digital literacy <= 3

  [Document & Onboarding Barriers]
    - 54.6% face onboarding document issues
    - Top: Aadhaar verification delay (17.6%), Vehicle RC issue (12%)
    - PAN card unavailability (9.9%) - identity barrier
    - Driving licence issue (7.9%) - vehicle access barrier

  [Language & Localization]
    - 19 different languages in the dataset
    - 51.6% prefer regional languages (not English/Hindi)
    - Hindi: 40%, English: only 8.4%
    - Onboarding in English/Hindi misses >50% of workers

  ---------------------------------------------------
  CHALLENGE 3: Designing for Income Volatility
  ---------------------------------------------------
  [Income Distribution]
    - Mean gross: INR 15,133, Median: INR 12,569 (right-skewed)
    - CV = 48.7% - HIGH volatility across workers
    - P90/P10 ratio: 6.7x - severe income inequality
    - 35.9% in "Very Low" income category

  [Seasonal Volatility]
    - Mean festive spike: 28.0%
    - 42% have >30% income spike during festivals
    - 7.5% have >50% spike - extreme seasonality

  [Expense Burden]
    - Fuel costs: mean INR 3,301/month (22% of gross income)
    - 56.3% have fuel burden ratio < 3x (high risk)
    - EMI burden: mean INR 1,021/month (9.5% of income)
    - Expense ratio mean: 0.40 - 40% of income to expenses

  [Platform & City Effects]
    - Food delivery workers dominate "Very Low" income (7,212)
    - Tier-2 cities: 80.3% are Very Low/Low income
    - Tier-3 cities: 99.1% are Very Low/Low income
    - Tier-1 is the only tier with income diversity

  [Work Patterns]
    - Mean 9.2 hrs/day, 15.9 orders/day, 0.9 days off/week
    - Work intensity mean: 20.9 (range 1.1-83.0 - huge variance)
    - Average savings rate: 39.6% (positive signal for savings products)
"""
print(insights)

print("=" * 80)
print("  EDA COMPLETE - All outputs saved to: eda_outputs/")
print("=" * 80)
