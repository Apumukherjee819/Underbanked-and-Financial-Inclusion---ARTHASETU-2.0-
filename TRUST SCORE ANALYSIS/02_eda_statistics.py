"""
STEP 2: Exploratory Data Analysis (EDA) & Descriptive Statistics
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
plt.rcParams['figure.figsize'] = (12, 6)
plt.rcParams['font.size'] = 10
sns.set_style("whitegrid")

# ─── LOAD CLEANED DATA ──────────────────────────────────────────
print("=" * 70)
print("STEP 2: EXPLORATORY DATA ANALYSIS (EDA)")
print("=" * 70)

df = pd.read_csv(f"{OUTPUT_DIR}/cleaned_data_with_features.csv")
print(f"Loaded cleaned data: {df.shape}")

# ─── 2.1 UNIVARIATE ANALYSIS ────────────────────────────────────
print("\n--- 2.1 Univariate Analysis ---")

# Income Distribution
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

axes[0, 0].hist(df['monthly_gross_income_inr'], bins=50, color='steelblue', edgecolor='black', alpha=0.7)
axes[0, 0].set_title('Monthly Gross Income Distribution')
axes[0, 0].set_xlabel('Gross Income (INR)')
axes[0, 0].set_ylabel('Frequency')
axes[0, 0].axvline(df['monthly_gross_income_inr'].mean(), color='red', linestyle='--', label=f'Mean: {df["monthly_gross_income_inr"].mean():.0f}')
axes[0, 0].axvline(df['monthly_gross_income_inr'].median(), color='green', linestyle='--', label=f'Median: {df["monthly_gross_income_inr"].median():.0f}')
axes[0, 0].legend()

axes[0, 1].hist(df['monthly_net_income_inr'], bins=50, color='coral', edgecolor='black', alpha=0.7)
axes[0, 1].set_title('Monthly Net Income Distribution')
axes[0, 1].set_xlabel('Net Income (INR)')
axes[0, 1].set_ylabel('Frequency')
axes[0, 1].axvline(df['monthly_net_income_inr'].mean(), color='red', linestyle='--', label=f'Mean: {df["monthly_net_income_inr"].mean():.0f}')
axes[0, 1].axvline(df['monthly_net_income_inr'].median(), color='green', linestyle='--', label=f'Median: {df["monthly_net_income_inr"].median():.0f}')
axes[0, 1].legend()

axes[1, 0].hist(df['daily_hours_worked'], bins=30, color='mediumseagreen', edgecolor='black', alpha=0.7)
axes[1, 0].set_title('Daily Hours Worked Distribution')
axes[1, 0].set_xlabel('Hours')
axes[1, 0].set_ylabel('Frequency')

axes[1, 1].hist(df['platform_rating_out_of_5'], bins=20, color='mediumpurple', edgecolor='black', alpha=0.7)
axes[1, 1].set_title('Platform Rating Distribution')
axes[1, 1].set_xlabel('Rating (out of 5)')
axes[1, 1].set_ylabel('Frequency')

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/01_univariate_income_work.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 01_univariate_income_work.png")

# Platform Distribution
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

df['platform'].value_counts().plot(kind='bar', ax=axes[0], color='steelblue', edgecolor='black')
axes[0].set_title('Workers by Platform')
axes[0].set_xlabel('Platform')
axes[0].set_ylabel('Count')
axes[0].tick_params(axis='x', rotation=45)

df['platform_type'].value_counts().plot(kind='bar', ax=axes[1], color='coral', edgecolor='black')
axes[1].set_title('Workers by Platform Type')
axes[1].set_xlabel('Platform Type')
axes[1].set_ylabel('Count')
axes[1].tick_params(axis='x', rotation=45)

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/02_univariate_platform.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 02_univariate_platform.png")

# Demographics
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

df['education_level'].value_counts().plot(kind='barh', ax=axes[0, 0], color='steelblue', edgecolor='black')
axes[0, 0].set_title('Education Level Distribution')

df['city_tier'].value_counts().plot(kind='pie', ax=axes[0, 1], autopct='%1.1f%%', colors=['#ff9999','#66b3ff','#99ff99'])
axes[0, 1].set_title('City Tier Distribution')
axes[0, 1].set_ylabel('')

df['gender'].value_counts().plot(kind='pie', ax=axes[1, 0], autopct='%1.1f%%', colors=['#66b3ff','#ff9999'])
axes[1, 0].set_title('Gender Distribution')
axes[1, 0].set_ylabel('')

df['trust_category'].value_counts().plot(kind='bar', ax=axes[1, 1], color=['#ff6b6b','#ffd93d','#6bcb77'], edgecolor='black')
axes[1, 1].set_title('Trust Category Distribution')
axes[1, 1].set_ylabel('Count')
axes[1, 1].tick_params(axis='x', rotation=0)

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/03_univariate_demographics.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 03_univariate_demographics.png")

# ─── 2.2 BIVARIATE ANALYSIS ────────────────────────────────────
print("\n--- 2.2 Bivariate Analysis ---")

# Income by Platform Type
fig, axes = plt.subplots(1, 2, figsize=(14, 6))

sns.boxplot(data=df, x='platform_type', y='monthly_net_income_inr', ax=axes[0], palette='Set2')
axes[0].set_title('Net Income by Platform Type')
axes[0].set_xlabel('Platform Type')
axes[0].set_ylabel('Net Income (INR)')
axes[0].tick_params(axis='x', rotation=45)

sns.boxplot(data=df, x='city_tier', y='monthly_net_income_inr', ax=axes[1], palette='Set3')
axes[1].set_title('Net Income by City Tier')
axes[1].set_xlabel('City Tier')
axes[1].set_ylabel('Net Income (INR)')

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/04_bivariate_income_platform.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 04_bivariate_income_platform.png")

# Income by Education
fig, axes = plt.subplots(1, 2, figsize=(14, 6))

edu_order = ['No formal education', 'Class 8-10 dropout', 'Class 10 pass', 'Class 12 pass', 'ITI/Diploma', 'Graduate', 'Post-Graduate']
sns.boxplot(data=df, x='education_level', y='monthly_net_income_inr', order=edu_order, ax=axes[0], palette='coolwarm')
axes[0].set_title('Net Income by Education Level')
axes[0].set_xlabel('Education Level')
axes[0].set_ylabel('Net Income (INR)')
axes[0].tick_params(axis='x', rotation=45)

# Trust Score by Education
sns.boxplot(data=df, x='education_level', y='trust_raw', order=edu_order, ax=axes[1], palette='coolwarm')
axes[1].set_title('Trust Score by Education Level')
axes[1].set_xlabel('Education Level')
axes[1].set_ylabel('Trust Score')
axes[1].tick_params(axis='x', rotation=45)

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/05_bivariate_income_education.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 05_bivariate_income_education.png")

# Rating vs Cancellation Rate
fig, axes = plt.subplots(1, 2, figsize=(14, 6))

axes[0].scatter(df['order_cancellation_rate_pct'], df['platform_rating_out_of_5'],
                alpha=0.1, s=10, c='steelblue')
axes[0].set_title('Platform Rating vs Cancellation Rate')
axes[0].set_xlabel('Cancellation Rate (%)')
axes[0].set_ylabel('Platform Rating')

# Add correlation coefficient
corr, pval = stats.spearmanr(df['order_cancellation_rate_pct'], df['platform_rating_out_of_5'])
axes[0].text(0.05, 0.95, f'Spearman r = {corr:.3f}\np = {pval:.2e}',
             transform=axes[0].transAxes, verticalalignment='top',
             bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))

# Income by Trust Category
sns.boxplot(data=df, x='trust_category', y='monthly_net_income_inr', 
            order=['Low Trust', 'Medium Trust', 'High Trust'], ax=axes[1],
            palette=['#ff6b6b', '#ffd93d', '#6bcb77'])
axes[1].set_title('Net Income by Trust Category')
axes[1].set_xlabel('Trust Category')
axes[1].set_ylabel('Net Income (INR)')

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/06_bivariate_rating_trust.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 06_bivariate_rating_trust.png")

# Vehicle Type vs Income
fig, ax = plt.subplots(figsize=(14, 6))
vehicle_order = df.groupby('vehicle_type')['monthly_net_income_inr'].median().sort_values(ascending=False).index
sns.boxplot(data=df, x='vehicle_type', y='monthly_net_income_inr', order=vehicle_order, ax=ax, palette='Set2')
ax.set_title('Net Income by Vehicle Type')
ax.set_xlabel('Vehicle Type')
ax.set_ylabel('Net Income (INR)')
ax.tick_params(axis='x', rotation=45)
plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/07_bivariate_vehicle_income.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 07_bivariate_vehicle_income.png")

# ─── 2.3 STATISTICAL TESTS ──────────────────────────────────────
print("\n--- 2.3 Statistical Tests ---")

# ANOVA: Income across platform types
groups = [group['monthly_net_income_inr'].values for name, group in df.groupby('platform_type')]
f_stat, p_val = stats.f_oneway(*groups)
print(f"\n  ANOVA (Income ~ Platform Type): F={f_stat:.4f}, p={p_val:.2e}")
print(f"  Result: {'Significant' if p_val < 0.05 else 'Not Significant'} difference across platforms")

# ANOVA: Income across education levels
edu_groups = [group['monthly_net_income_inr'].values for name, group in df.groupby('education_level') if len(group) > 1]
f_stat2, p_val2 = stats.f_oneway(*edu_groups)
print(f"  ANOVA (Income ~ Education): F={f_stat2:.4f}, p={p_val2:.2e}")
print(f"  Result: {'Significant' if p_val2 < 0.05 else 'Not Significant'} difference across education levels")

# T-test: Income by migrant status
migrant_income = df[df['is_migrant'] == 1]['monthly_net_income_inr']
non_migrant_income = df[df['is_migrant'] == 0]['monthly_net_income_inr']
t_stat, p_val3 = stats.ttest_ind(migrant_income, non_migrant_income)
print(f"  T-test (Income ~ Migrant): t={t_stat:.4f}, p={p_val3:.2e}")
print(f"  Result: {'Significant' if p_val3 < 0.05 else 'Not Significant'} difference between migrants and non-migrants")

# Chi-Square: Bank account vs Trust category
contingency = pd.crosstab(df['bank_account_type'], df['trust_category'])
chi2, p_val4, dof, expected = stats.chi2_contingency(contingency)
print(f"  Chi-Square (Bank Account ~ Trust): chi2={chi2:.4f}, p={p_val4:.2e}, dof={dof}")
print(f"  Result: {'Significant' if p_val4 < 0.05 else 'Not Significant'} association")

# Spearman correlations
corr_pairs = [
    ('platform_rating_out_of_5', 'order_cancellation_rate_pct'),
    ('monthly_net_income_inr', 'platform_rating_out_of_5'),
    ('years_on_platform', 'trust_raw'),
    ('digital_literacy_score_1_5', 'financial_inclusion_index'),
    ('daily_hours_worked', 'monthly_net_income_inr'),
    ('emi_burden_ratio', 'monthly_net_income_inr'),
]
print("\n  Spearman Correlations:")
for c1, c2 in corr_pairs:
    r, p = stats.spearmanr(df[c1], df[c2])
    print(f"    {c1} ~ {c2}: r={r:.4f}, p={p:.2e}")

print("\n" + "=" * 70)
print("STEP 2 COMPLETE: EDA plots and statistical tests saved")
print("=" * 70)
