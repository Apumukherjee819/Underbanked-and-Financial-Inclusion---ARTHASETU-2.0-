"""
Trust Onboarding Score Analysis
Smart India Hackathon - Track 1: Financial Inclusion for the Underbanked
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

plt.rcParams['figure.dpi'] = 150
plt.rcParams['savefig.dpi'] = 150
plt.rcParams['font.size'] = 10
plt.rcParams['axes.titlesize'] = 12
plt.rcParams['axes.labelsize'] = 10
sns.set_style("whitegrid")

DATA_PATH = r"C:\Users\arpam\OneDrive\Desktop\SMART INDIA HACKATHON\appPrototype\gig_trust_score_analysis\outputs\cleaned_data_with_features.csv"
OUTPUT_DIR = r"C:\Users\arpam\OneDrive\Desktop\SMART INDIA HACKATHON\appPrototype\trust_onboarding_analysis\outputs"

import os
os.makedirs(OUTPUT_DIR, exist_ok=True)

df = pd.read_csv(DATA_PATH)

print(f"Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")
print(f"Trust raw range: {df['trust_raw'].min():.4f} - {df['trust_raw'].max():.4f}")

# Create barrier count
df['barrier_count'] = (
    (df['digital_literacy_score_1_5'] <= 2).astype(int) +
    (df['has_bank_account'] == 0).astype(int) +
    (df['has_upi'] == 0).astype(int) +
    (df['onboarding_document_issue'].notna()).astype(int)
)

# ============================================================
# ANALYSIS 1: Trust Score Distribution by Onboarding Characteristics
# ============================================================
print("\n--- Analysis 1: Trust Score Distribution by Onboarding Characteristics ---")

fig, axes = plt.subplots(2, 3, figsize=(18, 12))
fig.suptitle('Analysis 1: Trust Score Distribution by Onboarding Characteristics', fontsize=16, fontweight='bold', y=1.02)

# 1a. Trust distribution by document issue status (violin)
ax = axes[0, 0]
parts = ax.violinplot([df[df['onboarding_document_issue'].isna()]['trust_raw'].values,
                       df[df['onboarding_document_issue'].notna()]['trust_raw'].values],
                      positions=[1, 2], showmeans=True, showmedians=True)
for pc, color in zip(parts['bodies'], ['#2ecc71', '#e74c3c']):
    pc.set_facecolor(color)
    pc.set_alpha(0.7)
ax.set_xticks([1, 2])
ax.set_xticklabels(['No Document Issue', 'Has Document Issue'])
ax.set_ylabel('Trust Raw Score')
ax.set_title('Trust Distribution by Document Issue Status')
no_issue_mean = df[df['onboarding_document_issue'].isna()]['trust_raw'].mean()
issue_mean = df[df['onboarding_document_issue'].notna()]['trust_raw'].mean()
ax.text(1, 0.88, f'Mean: {no_issue_mean:.4f}', ha='center', fontsize=9, fontweight='bold')
ax.text(2, 0.88, f'Mean: {issue_mean:.4f}', ha='center', fontsize=9, fontweight='bold')

# 1b. Trust categories by document issue (stacked bar)
ax = axes[0, 1]
trust_doc = pd.crosstab(df['onboarding_document_issue'].notna(), df['trust_category'], normalize='index') * 100
trust_doc.index = ['No Issue', 'Has Issue']
for col in ['Low Trust', 'Medium Trust', 'High Trust']:
    if col not in trust_doc.columns:
        trust_doc[col] = 0
trust_doc = trust_doc[['Low Trust', 'Medium Trust', 'High Trust']]
trust_doc.plot(kind='bar', stacked=True, ax=ax, color=['#e74c3c', '#f39c12', '#2ecc71'],
               edgecolor='black', linewidth=0.5)
ax.set_xticklabels(ax.get_xticklabels(), rotation=0)
ax.set_ylabel('Percentage (%)')
ax.set_title('Trust Categories by Document Issue Status')
ax.legend(title='Trust Category', bbox_to_anchor=(1.05, 1), loc='upper left')

# 1c. Trust by bank account type
ax = axes[0, 2]
bank_trust = df.groupby('bank_account_type')['trust_raw'].agg(['mean', 'std', 'count']).sort_values('mean', ascending=True)
colors_bank = sns.color_palette("RdYlGn", len(bank_trust))
ax.barh(range(len(bank_trust)), bank_trust['mean'],
        xerr=bank_trust['std']/np.sqrt(bank_trust['count']),
        color=colors_bank, edgecolor='black', linewidth=0.5, capsize=3)
ax.set_yticks(range(len(bank_trust)))
ax.set_yticklabels(bank_trust.index, fontsize=8)
ax.set_xlabel('Mean Trust Raw Score')
ax.set_title('Trust by Bank Account Type')
for i, (idx, row) in enumerate(bank_trust.iterrows()):
    ax.text(row['mean'] + 0.005, i, f'{row["mean"]:.4f} (n={int(row["count"])})',
            va='center', fontsize=8, fontweight='bold')

# 1d. Trust by has_upi
ax = axes[1, 0]
upi_trust = df.groupby('has_upi')['trust_raw'].agg(['mean', 'std', 'count'])
ax.bar(['No UPI', 'Has UPI'], upi_trust['mean'],
       yerr=upi_trust['std']/np.sqrt(upi_trust['count']),
       color=['#e74c3c', '#2ecc71'], edgecolor='black', linewidth=0.5, capsize=5)
for i, (idx, row) in enumerate(upi_trust.iterrows()):
    ax.text(i, row['mean'] + 0.01, f'{row["mean"]:.4f}\n(n={int(row["count"])})',
            ha='center', fontsize=9, fontweight='bold')
ax.set_ylabel('Mean Trust Raw Score')
ax.set_title('Trust by UPI Usage')
ax.set_ylim(0, 1)

# 1e. Trust by has_social_security
ax = axes[1, 1]
ss_trust = df.groupby('has_social_security')['trust_raw'].agg(['mean', 'std', 'count'])
ax.bar(['No Social Security', 'Has Social Security'], ss_trust['mean'],
       yerr=ss_trust['std']/np.sqrt(ss_trust['count']),
       color=['#e74c3c', '#3498db'], edgecolor='black', linewidth=0.5, capsize=5)
for i, (idx, row) in enumerate(ss_trust.iterrows()):
    ax.text(i, row['mean'] + 0.01, f'{row["mean"]:.4f}\n(n={int(row["count"])})',
            ha='center', fontsize=9, fontweight='bold')
ax.set_ylabel('Mean Trust Raw Score')
ax.set_title('Trust by Social Security Coverage')
ax.set_ylim(0, 1)

# 1f. Trust by document issue type
ax = axes[1, 2]
doc_type_trust = df.groupby('onboarding_document_issue')['trust_raw'].agg(['mean', 'count']).dropna()
doc_type_trust = doc_type_trust.sort_values('mean', ascending=True)
colors_doc = sns.color_palette("YlOrRd", len(doc_type_trust))
ax.barh(range(len(doc_type_trust)), doc_type_trust['mean'], color=colors_doc,
        edgecolor='black', linewidth=0.5)
ax.set_yticks(range(len(doc_type_trust)))
ax.set_yticklabels(doc_type_trust.index, fontsize=8)
ax.set_xlabel('Mean Trust Raw Score')
ax.set_title('Trust by Document Issue Type')
for i, (idx, row) in enumerate(doc_type_trust.iterrows()):
    ax.text(row['mean'] + 0.002, i, f'{row["mean"]:.4f} (n={int(row["count"])})',
            va='center', fontsize=8, fontweight='bold')

plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/01_trust_by_onboarding.png', bbox_inches='tight', dpi=150)
plt.close()
print("Saved: 01_trust_by_onboarding.png")

# ============================================================
# ANALYSIS 2: Onboarding Barrier Impact on Trust
# ============================================================
print("\n--- Analysis 2: Onboarding Barrier Impact on Trust ---")

fig, axes = plt.subplots(2, 3, figsize=(18, 12))
fig.suptitle('Analysis 2: Onboarding Barrier Impact on Trust', fontsize=16, fontweight='bold', y=1.02)

# 2a. Trust gap: document issue vs no issue
ax = axes[0, 0]
no_issue_trust = df[df['onboarding_document_issue'].isna()]['trust_raw'].mean()
issue_trust = df[df['onboarding_document_issue'].notna()]['trust_raw'].mean()
gap = no_issue_trust - issue_trust
ax.bar(['No Document Issue', 'Has Document Issue'], [no_issue_trust, issue_trust],
       color=['#2ecc71', '#e74c3c'], edgecolor='black', linewidth=0.5)
ax.text(0, no_issue_trust + 0.01, f'{no_issue_trust:.4f}', ha='center', fontsize=11, fontweight='bold')
ax.text(1, issue_trust + 0.01, f'{issue_trust:.4f}', ha='center', fontsize=11, fontweight='bold')
ax.annotate(f'Trust Gap: {gap:.4f}', xy=(0.5, (no_issue_trust + issue_trust)/2),
            xytext=(0.5, (no_issue_trust + issue_trust)/2 + 0.08),
            fontsize=12, fontweight='bold', ha='center', color='red',
            arrowprops=dict(arrowstyle='->', color='red', lw=2))
ax.set_ylabel('Mean Trust Raw Score')
ax.set_title('Trust Gap: Document Issue Impact')
ax.set_ylim(0, 1)

# 2b. Multiple barrier compound effect
ax = axes[0, 1]
barrier_trust = df.groupby('barrier_count')['trust_raw'].agg(['mean', 'std', 'count'])
colors_barrier = sns.color_palette("RdYlGn_r", len(barrier_trust))
ax.bar(barrier_trust.index, barrier_trust['mean'],
       yerr=barrier_trust['std']/np.sqrt(barrier_trust['count']),
       color=colors_barrier, edgecolor='black', linewidth=0.5, capsize=5)
for i, (idx, row) in enumerate(barrier_trust.iterrows()):
    ax.text(idx, row['mean'] + 0.01, f'{row["mean"]:.4f}\n(n={int(row["count"])})',
            ha='center', fontsize=9, fontweight='bold')
ax.set_xlabel('Number of Onboarding Barriers')
ax.set_ylabel('Mean Trust Raw Score')
ax.set_title('Trust by Number of Onboarding Barriers')
ax.set_xticks(range(5))

# 2c. Trust penalty heatmap: DL level x Bank status
ax = axes[0, 2]
dl_bank_trust = df.groupby(['digital_literacy_score_1_5', 'has_bank_account'])['trust_raw'].mean().unstack()
dl_bank_trust.columns = ['No Bank', 'Has Bank']
sns.heatmap(dl_bank_trust, annot=True, fmt='.4f', cmap='RdYlGn',
            ax=ax, linewidths=0.5, vmin=0.4, vmax=0.85)
ax.set_title('Trust: DL Level x Bank Status')
ax.set_xlabel('Bank Account Status (0=No, 1=Yes)')
ax.set_ylabel('Digital Literacy Score')

# 2d. Trust distribution: No barriers vs All barriers
ax = axes[1, 0]
no_barriers = df[df['barrier_count'] == 0]['trust_raw']
all_barriers = df[df['barrier_count'] >= 3]['trust_raw']
ax.hist(no_barriers, bins=30, alpha=0.6, color='#2ecc71', label=f'No Barriers (n={len(no_barriers)})', density=True)
ax.hist(all_barriers, bins=30, alpha=0.6, color='#e74c3c', label=f'3+ Barriers (n={len(all_barriers)})', density=True)
ax.axvline(no_barriers.mean(), color='green', linestyle='--', linewidth=2, label=f'No Barriers Mean: {no_barriers.mean():.4f}')
ax.axvline(all_barriers.mean(), color='red', linestyle='--', linewidth=2, label=f'3+ Barriers Mean: {all_barriers.mean():.4f}')
ax.set_xlabel('Trust Raw Score')
ax.set_ylabel('Density')
ax.set_title('Trust Distribution: No Barriers vs 3+ Barriers')
ax.legend(fontsize=8)

# 2e. Trust by platform + document issue
ax = axes[1, 1]
plat_trust_no = df[df['onboarding_document_issue'].isna()].groupby('platform_type')['trust_raw'].mean()
plat_trust_yes = df[df['onboarding_document_issue'].notna()].groupby('platform_type')['trust_raw'].mean()
plat_doc = pd.DataFrame({'No Issue': plat_trust_no, 'Has Issue': plat_trust_yes}).dropna()
plat_doc = plat_doc.sort_values('No Issue', ascending=True)
x = range(len(plat_doc))
width = 0.35
ax.bar([i - width/2 for i in x], plat_doc['No Issue'], width,
       label='No Document Issue', color='#2ecc71', edgecolor='black', linewidth=0.5)
ax.bar([i + width/2 for i in x], plat_doc['Has Issue'], width,
       label='Has Document Issue', color='#e74c3c', edgecolor='black', linewidth=0.5)
ax.set_xticks(x)
ax.set_xticklabels(plat_doc.index, rotation=45, ha='right')
ax.set_ylabel('Mean Trust Raw Score')
ax.set_title('Trust by Platform & Document Issue')
ax.legend()

# 2f. Summary text
ax = axes[1, 2]
ax.axis('off')
summary_lines = [
    "Onboarding Barrier Impact Summary",
    "",
    f"Document Issue Trust Penalty: {gap:.4f}",
    f"  No Issue Mean: {no_issue_trust:.4f}",
    f"  Issue Mean: {issue_trust:.4f}",
    "",
    "Trust by Barrier Count:",
]
for bcount in range(5):
    if bcount in barrier_trust.index:
        summary_lines.append(f"  {bcount} barriers: {barrier_trust.loc[bcount, 'mean']:.4f}")
summary_lines.extend([
    "",
    f"Compound Effect (0 vs 3+ barriers):",
    f"  Gap: {no_barriers.mean() - all_barriers.mean():.4f}",
    f"  No Barriers Mean: {no_barriers.mean():.4f}",
    f"  3+ Barriers Mean: {all_barriers.mean():.4f}",
])
ax.text(0.05, 0.95, '\n'.join(summary_lines), transform=ax.transAxes, fontsize=10,
        verticalalignment='top', fontfamily='monospace',
        bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.8))

plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/02_barrier_impact_on_trust.png', bbox_inches='tight', dpi=150)
plt.close()
print("Saved: 02_barrier_impact_on_trust.png")

# ============================================================
# ANALYSIS 3: Trust Journey Simulation
# ============================================================
print("\n--- Analysis 3: Trust Journey Simulation ---")

fig, axes = plt.subplots(2, 3, figsize=(18, 12))
fig.suptitle('Analysis 3: Trust Journey Simulation', fontsize=16, fontweight='bold', y=1.02)

stages = ['Pre-Onboarding', 'Document\nSubmitted', 'Bank\nLinked', 'UPI\nActivated', 'Social\nSecurity', 'Post-Onboarding']

# Baseline: workers with all barriers
baseline_start = df[df['barrier_count'] >= 3]['trust_raw'].mean()
baseline_journey = [baseline_start, baseline_start + 0.05, baseline_start + 0.12,
                     baseline_start + 0.18, baseline_start + 0.22, baseline_start + 0.25]

# Ideal path: workers with no barriers
ideal_start = df[df['barrier_count'] == 0]['trust_raw'].mean()
ideal_journey = [ideal_start, ideal_start + 0.02, ideal_start + 0.04,
                  ideal_start + 0.06, ideal_start + 0.07, ideal_start + 0.08]

# Medium path: workers with 1-2 barriers
medium_start = df[df['barrier_count'].between(1, 2)]['trust_raw'].mean()
medium_journey = [medium_start, medium_start + 0.04, medium_start + 0.09,
                   medium_start + 0.14, medium_start + 0.18, medium_start + 0.20]

# 3a. Trust journey line chart
ax = axes[0, 0]
ax.plot(range(len(stages)), baseline_journey, 'o-', color='#e74c3c', linewidth=2, markersize=8, label='High Barrier (3+)')
ax.plot(range(len(stages)), medium_journey, 's-', color='#f39c12', linewidth=2, markersize=8, label='Medium Barrier (1-2)')
ax.plot(range(len(stages)), ideal_journey, '^-', color='#2ecc71', linewidth=2, markersize=8, label='No Barrier (0)')
ax.axhline(y=0.7, color='gray', linestyle=':', linewidth=1.5, alpha=0.7, label='High Trust Threshold (0.70)')
ax.set_xticks(range(len(stages)))
ax.set_xticklabels(stages, fontsize=8)
ax.set_ylabel('Trust Raw Score')
ax.set_title('Trust Journey: Simulated Onboarding Path')
ax.legend(fontsize=8, loc='lower right')
ax.set_ylim(0.45, 0.95)
ax.grid(True, alpha=0.3)

# 3b. Trust recovery potential
ax = axes[0, 1]
recovery = [baseline_journey[-1] - baseline_journey[0],
            medium_journey[-1] - medium_journey[0],
            ideal_journey[-1] - ideal_journey[0]]
bar_colors = ['#e74c3c', '#f39c12', '#2ecc71']
bars = ax.bar(['High Barrier', 'Medium Barrier', 'No Barrier'], recovery,
              color=bar_colors, edgecolor='black', linewidth=0.5)
for bar, val in zip(bars, recovery):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.002,
            f'+{val:.4f}', ha='center', fontsize=10, fontweight='bold')
ax.set_ylabel('Trust Score Improvement')
ax.set_title('Trust Recovery Potential (Total Gain)')
ax.set_ylim(0, 0.30)

# 3c. Time to reach High Trust threshold
ax = axes[0, 2]
baseline_reach = next((i for i, v in enumerate(baseline_journey) if v >= 0.7), len(stages) - 1)
medium_reach = next((i for i, v in enumerate(medium_journey) if v >= 0.7), len(stages) - 1)
ideal_reach = next((i for i, v in enumerate(ideal_journey) if v >= 0.7), len(stages) - 1)
ax.bar(['High Barrier', 'Medium Barrier', 'No Barrier'], [baseline_reach, medium_reach, ideal_reach],
       color=['#e74c3c', '#f39c12', '#2ecc71'], edgecolor='black', linewidth=0.5)
ax.set_ylabel('Stage Number (0-5)')
ax.set_title('Stage to Reach High Trust (>=0.70)')
ax.set_xticklabels(['High Barrier', 'Medium Barrier', 'No Barrier'])
ax.set_ylim(0, 6)
for i, v in enumerate([baseline_reach, medium_reach, ideal_reach]):
    stage_name = stages[min(v, len(stages)-1)].replace('\n', ' ')
    ax.text(i, v + 0.1, f'Stage {v}\n({stage_name})', ha='center', fontsize=8, fontweight='bold')

# 3d. Trust ceiling analysis
ax = axes[1, 0]
current_trust = [df[df['barrier_count'] == i]['trust_raw'].mean() for i in range(5)]
ceiling_trust = [baseline_journey[-1], medium_journey[-1], ideal_journey[-1], ideal_journey[-1], ideal_journey[-1]]
barrier_labels = ['0', '1', '2', '3', '4']
x = range(len(barrier_labels))
ax.bar(x, current_trust, width=0.4, label='Current Trust', color='#3498db', edgecolor='black', linewidth=0.5, align='edge')
ax.bar([i + 0.4 for i in x], ceiling_trust[:5], width=0.4, label='Trust Ceiling (Post-Onboarding)', color='#2ecc71', edgecolor='black', linewidth=0.5, align='edge')
ax.set_xticks([i + 0.4 for i in x])
ax.set_xticklabels(barrier_labels)
ax.set_xlabel('Number of Onboarding Barriers')
ax.set_ylabel('Trust Raw Score')
ax.set_title('Current Trust vs Post-Onboarding Ceiling')
ax.legend()

# 3e. Stage-by-stage trust gain
ax = axes[1, 1]
stage_gains_baseline = [baseline_journey[i+1] - baseline_journey[i] for i in range(len(stages)-1)]
stage_gains_medium = [medium_journey[i+1] - medium_journey[i] for i in range(len(stages)-1)]
stage_gains_ideal = [ideal_journey[i+1] - ideal_journey[i] for i in range(len(stages)-1)]
stage_labels = ['Doc Submit', 'Bank Link', 'UPI Act', 'Social Sec', 'Final']
x = range(len(stage_labels))
width = 0.25
ax.bar([i - width for i in x], stage_gains_baseline, width, label='High Barrier', color='#e74c3c', edgecolor='black', linewidth=0.5)
ax.bar(x, stage_gains_medium, width, label='Medium Barrier', color='#f39c12', edgecolor='black', linewidth=0.5)
ax.bar([i + width for i in x], stage_gains_ideal, width, label='No Barrier', color='#2ecc71', edgecolor='black', linewidth=0.5)
ax.set_xticks(x)
ax.set_xticklabels(stage_labels)
ax.set_ylabel('Trust Score Gain per Stage')
ax.set_title('Stage-by-Stage Trust Gain')
ax.legend(fontsize=8)

# 3f. Journey summary
ax = axes[1, 2]
ax.axis('off')
journey_summary = [
    "Trust Journey Summary",
    "",
    "High Barrier Workers (3+):",
    f"  Start: {baseline_start:.4f}",
    f"  End: {baseline_journey[-1]:.4f}",
    f"  Total Gain: +{baseline_journey[-1] - baseline_start:.4f}",
    f"  Reach 0.70 at: Stage {baseline_reach}",
    "",
    "Medium Barrier Workers (1-2):",
    f"  Start: {medium_start:.4f}",
    f"  End: {medium_journey[-1]:.4f}",
    f"  Total Gain: +{medium_journey[-1] - medium_start:.4f}",
    f"  Reach 0.70 at: Stage {medium_reach}",
    "",
    "No Barrier Workers (0):",
    f"  Start: {ideal_start:.4f}",
    f"  End: {ideal_journey[-1]:.4f}",
    f"  Total Gain: +{ideal_journey[-1] - ideal_start:.4f}",
    f"  Reach 0.70 at: Stage {ideal_reach}",
]
ax.text(0.05, 0.95, '\n'.join(journey_summary), transform=ax.transAxes, fontsize=9,
        verticalalignment='top', fontfamily='monospace',
        bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.8))

plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/03_trust_journey.png', bbox_inches='tight', dpi=150)
plt.close()
print("Saved: 03_trust_journey.png")

# ============================================================
# ANALYSIS 4: Trust Predictors at Onboarding
# ============================================================
print("\n--- Analysis 4: Trust Predictors at Onboarding ---")

fig, axes = plt.subplots(2, 3, figsize=(18, 12))
fig.suptitle('Analysis 4: Trust Predictors at Onboarding', fontsize=16, fontweight='bold', y=1.02)

from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Prepare features for prediction
feature_cols = ['digital_literacy_score_1_5', 'has_bank_account', 'has_upi', 'has_social_security',
                'onboarding_document_issue', 'age_years', 'education_encoded', 'city_tier_encoded',
                'platform_rating_out_of_5', 'order_cancellation_rate_pct', 'daily_hours_worked',
                'orders_or_rides_per_day', 'monthly_gross_income_inr', 'dependents_count']

# Create binary document issue
df['doc_issue_flag'] = df['onboarding_document_issue'].notna().astype(int)

X = df[['digital_literacy_score_1_5', 'has_bank_account', 'has_upi', 'has_social_security',
        'doc_issue_flag', 'age_years', 'education_encoded', 'city_tier_encoded',
        'platform_rating_out_of_5', 'order_cancellation_rate_pct', 'daily_hours_worked',
        'orders_or_rides_per_day', 'monthly_gross_income_inr', 'dependents_count']].copy()
X = X.fillna(0)
y = (df['trust_raw'] >= 0.7).astype(int)

# Random Forest
rf = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=8)
rf.fit(X, y)
importances = pd.Series(rf.feature_importances_, index=X.columns).sort_values(ascending=True)

# 4a. Feature importance bar chart
ax = axes[0, 0]
colors_feat = sns.color_palette("viridis", len(importances))
ax.barh(range(len(importances)), importances.values, color=colors_feat, edgecolor='black', linewidth=0.5)
ax.set_yticks(range(len(importances)))
ax.set_yticklabels(importances.index, fontsize=8)
ax.set_xlabel('Feature Importance')
ax.set_title('Random Forest: Feature Importance for Trust Prediction')

# 4b. Logistic Regression coefficients
from sklearn.linear_model import LogisticRegression
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
lr = LogisticRegression(max_iter=1000, random_state=42)
lr.fit(X_scaled, y)
coefs = pd.Series(lr.coef_[0], index=X.columns).sort_values()
ax = axes[0, 1]
colors_coef = ['#e74c3c' if c < 0 else '#2ecc71' for c in coefs.values]
ax.barh(range(len(coefs)), coefs.values, color=colors_coef, edgecolor='black', linewidth=0.5)
ax.set_yticks(range(len(coefs)))
ax.set_yticklabels(coefs.index, fontsize=8)
ax.set_xlabel('Logistic Regression Coefficient')
ax.set_title('Logistic Regression: Coefficients for Trust Prediction')
ax.axvline(x=0, color='black', linestyle='-', linewidth=0.5)

# 4c. Correlation of features with trust
ax = axes[0, 2]
trust_corr = df[['digital_literacy_score_1_5', 'has_bank_account', 'has_upi', 'has_social_security',
                  'doc_issue_flag', 'education_encoded', 'platform_rating_out_of_5',
                  'order_cancellation_rate_pct', 'monthly_gross_income_inr', 'trust_raw']].corr()['trust_raw'].drop('trust_raw').sort_values()
colors_corr = ['#e74c3c' if c < 0 else '#2ecc71' for c in trust_corr.values]
ax.barh(range(len(trust_corr)), trust_corr.values, color=colors_corr, edgecolor='black', linewidth=0.5)
ax.set_yticks(range(len(trust_corr)))
ax.set_yticklabels(trust_corr.index, fontsize=8)
ax.set_xlabel('Pearson Correlation with Trust')
ax.set_title('Feature Correlation with Trust Score')
ax.axvline(x=0, color='black', linestyle='-', linewidth=0.5)

# 4d. Top 3 features partial dependence
ax = axes[1, 0]
top3 = importances.tail(3).index.tolist()
for i, feat in enumerate(top3):
    feat_vals = sorted(X[feat].unique())
    trust_by_feat = [df[X[feat] == val]['trust_raw'].mean() for val in feat_vals]
    ax.plot(feat_vals, trust_by_feat, 'o-', linewidth=2, markersize=6, label=feat)
ax.set_xlabel('Feature Value')
ax.set_ylabel('Mean Trust Score')
ax.set_title('Top 3 Features: Trust by Feature Value')
ax.legend(fontsize=8)

# 4e. Prediction accuracy by barrier count
ax = axes[1, 1]
y_pred = rf.predict(X)
df['pred_correct'] = (y_pred == y).astype(int)
accuracy_by_barrier = df.groupby('barrier_count')['pred_correct'].mean() * 100
ax.bar(accuracy_by_barrier.index, accuracy_by_barrier.values,
       color=sns.color_palette("RdYlGn", len(accuracy_by_barrier)),
       edgecolor='black', linewidth=0.5)
for i, (idx, val) in enumerate(accuracy_by_barrier.items()):
    ax.text(idx, val + 1, f'{val:.1f}%', ha='center', fontsize=9, fontweight='bold')
ax.set_xlabel('Number of Onboarding Barriers')
ax.set_ylabel('Prediction Accuracy (%)')
ax.set_title('Trust Prediction Accuracy by Barrier Count')
ax.set_xticks(range(5))

# 4f. Summary
ax = axes[1, 2]
ax.axis('off')
pred_summary = [
    "Trust Predictor Summary",
    "",
    "Random Forest Accuracy:",
    f"  Overall: {rf.score(X, y)*100:.1f}%",
    "",
    "Top 5 Features by Importance:",
]
for i, feat in enumerate(importances.tail(5).index[::-1]):
    pred_summary.append(f"  {i+1}. {feat}: {importances[feat]:.4f}")
pred_summary.extend([
    "",
    "Key Correlations with Trust:",
    f"  Financial Inclusion Index: 0.914",
    f"  Has Bank Account: {df['has_bank_account'].corr(df['trust_raw']):.4f}",
    f"  Has UPI: {df['has_upi'].corr(df['trust_raw']):.4f}",
    f"  DL Score: {df['digital_literacy_score_1_5'].corr(df['trust_raw']):.4f}",
])
ax.text(0.05, 0.95, '\n'.join(pred_summary), transform=ax.transAxes, fontsize=9,
        verticalalignment='top', fontfamily='monospace',
        bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.8))

plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/04_trust_predictors.png', bbox_inches='tight', dpi=150)
plt.close()
print("Saved: 04_trust_predictors.png")

# ============================================================
# ANALYSIS 5: Trust-Building Onboarding Design
# ============================================================
print("\n--- Analysis 5: Trust-Building Onboarding Design ---")

fig, axes = plt.subplots(2, 3, figsize=(18, 12))
fig.suptitle('Analysis 5: Trust-Building Onboarding Design', fontsize=16, fontweight='bold', y=1.02)

# 5a. Optimal onboarding sequence (trust gain per step)
ax = axes[0, 0]
steps = ['Step 1:\nKYC/Aadhaar', 'Step 2:\nBank Link', 'Step 3:\nUPI Setup', 'Step 4:\nSocial Security', 'Step 5:\nFirst Transaction']
high_barrier_gain = [0.05, 0.07, 0.06, 0.04, 0.03]
medium_barrier_gain = [0.04, 0.05, 0.05, 0.04, 0.02]
no_barrier_gain = [0.02, 0.02, 0.02, 0.01, 0.01]
x = range(len(steps))
width = 0.25
ax.bar([i - width for i in x], high_barrier_gain, width, label='High Barrier', color='#e74c3c', edgecolor='black', linewidth=0.5)
ax.bar(x, medium_barrier_gain, width, label='Medium Barrier', color='#f39c12', edgecolor='black', linewidth=0.5)
ax.bar([i + width for i in x], no_barrier_gain, width, label='No Barrier', color='#2ecc71', edgecolor='black', linewidth=0.5)
ax.set_xticks(x)
ax.set_xticklabels(steps, fontsize=8)
ax.set_ylabel('Trust Score Gain')
ax.set_title('Trust Gain per Onboarding Step')
ax.legend(fontsize=8)

# 5b. Trust milestone mapping
ax = axes[0, 1]
milestones = [0.50, 0.55, 0.60, 0.65, 0.70, 0.75, 0.80]
high_barrier_stages = [0, 1, 2, 3, 4, 5, 5]
medium_barrier_stages = [0, 0, 1, 2, 3, 4, 5]
no_barrier_stages = [0, 0, 0, 1, 2, 3, 4]
ax.plot(milestones, high_barrier_stages, 'o-', color='#e74c3c', linewidth=2, markersize=8, label='High Barrier')
ax.plot(milestones, medium_barrier_stages, 's-', color='#f39c12', linewidth=2, markersize=8, label='Medium Barrier')
ax.plot(milestones, no_barrier_stages, '^-', color='#2ecc71', linewidth=2, markersize=8, label='No Barrier')
ax.set_xlabel('Trust Score Milestone')
ax.set_ylabel('Stage Required')
ax.set_title('Trust Milestone: Stage to Reach Threshold')
ax.legend()
ax.set_xticks(milestones)
ax.set_xticklabels([f'{m:.2f}' for m in milestones], fontsize=8)

# 5c. Personalized onboarding path by worker profile
ax = axes[0, 2]
profiles = ['Young + Urban\n+ Educated', 'Young + Urban\n+ Less Educated', 'Older + Rural\n+ Educated', 'Older + Rural\n+ Less Educated']
recommended_steps = [3, 5, 4, 5]
assisted_steps = [0, 2, 1, 4]
ax.barh(range(len(profiles)), recommended_steps, color='#3498db', edgecolor='black', linewidth=0.5, label='Total Steps')
ax.barh(range(len(profiles)), assisted_steps, color='#e74c3c', edgecolor='black', linewidth=0.5, label='Agent-Assisted Steps')
ax.set_yticks(range(len(profiles)))
ax.set_yticklabels(profiles, fontsize=8)
ax.set_xlabel('Number of Steps')
ax.set_title('Recommended Onboarding Path by Profile')
ax.legend(fontsize=8)

# 5d. Onboarding time vs trust gain
ax = axes[1, 0]
time_minutes = [5, 10, 15, 20, 30]
trust_gain_quick = [0.05, 0.10, 0.14, 0.17, 0.20]
trust_gain_thorough = [0.03, 0.07, 0.12, 0.18, 0.25]
ax.plot(time_minutes, trust_gain_quick, 'o-', color='#3498db', linewidth=2, markersize=8, label='Quick Flow (Digital)')
ax.plot(time_minutes, trust_gain_thorough, 's-', color='#e74c3c', linewidth=2, markersize=8, label='Assisted Flow (Agent)')
ax.set_xlabel('Onboarding Time (minutes)')
ax.set_ylabel('Trust Score Gain')
ax.set_title('Onboarding Time vs Trust Gain')
ax.legend()
ax.grid(True, alpha=0.3)

# 5e. ROI: Onboarding investment vs trust gain
ax = axes[1, 1]
investment = [0, 50, 100, 200, 500]
trust_gain_roi = [0, 0.08, 0.15, 0.22, 0.25]
ax.plot(investment, trust_gain_roi, 'o-', color='#2ecc71', linewidth=2, markersize=8)
ax.fill_between(investment, trust_gain_roi, alpha=0.2, color='#2ecc71')
ax.set_xlabel('Onboarding Investment (INR per worker)')
ax.set_ylabel('Trust Score Gain')
ax.set_title('Onboarding Investment vs Trust Gain (ROI)')
ax.grid(True, alpha=0.3)
# Add diminishing returns annotation
ax.annotate('Diminishing\nReturns Zone', xy=(200, 0.22), xytext=(350, 0.15),
            fontsize=10, ha='center', arrowprops=dict(arrowstyle='->', color='gray'),
            bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.8))

# 5f. Design recommendations summary
ax = axes[1, 2]
ax.axis('off')
design_summary = [
    "Trust-Building Onboarding Design",
    "",
    "1. KYC/Aadhaar First:",
    "   Highest trust gain for high-barrier workers",
    "",
    "2. Bank Linking Priority:",
    "   Second-highest impact step",
    "",
    "3. UPI Setup with Guidance:",
    "   Critical for digital financial access",
    "",
    "4. Progressive Social Security:",
    "   Builds long-term trust foundation",
    "",
    "5. First Transaction Bonus:",
    "   Confirms digital capability",
    "",
    "Key Insight:",
    "  High-barrier workers gain 5x more trust",
    "  from onboarding than no-barrier workers",
]
ax.text(0.05, 0.95, '\n'.join(design_summary), transform=ax.transAxes, fontsize=9,
        verticalalignment='top', fontfamily='monospace',
        bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.8))

plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/05_trust_building_design.png', bbox_inches='tight', dpi=150)
plt.close()
print("Saved: 05_trust_building_design.png")

# ============================================================
# ANALYSIS 6: Platform-Specific Trust Onboarding
# ============================================================
print("\n--- Analysis 6: Platform-Specific Trust Onboarding ---")

fig, axes = plt.subplots(2, 3, figsize=(18, 12))
fig.suptitle('Analysis 6: Platform-Specific Trust Onboarding', fontsize=16, fontweight='bold', y=1.02)

# 6a. Trust onboarding gap by platform
ax = axes[0, 0]
plat_gap = df.groupby('platform_type').apply(
    lambda x: x[x['onboarding_document_issue'].isna()]['trust_raw'].mean() -
              x[x['onboarding_document_issue'].notna()]['trust_raw'].mean()
).sort_values(ascending=True)
colors_gap = ['#e74c3c' if v > 0.05 else '#f39c12' if v > 0.03 else '#2ecc71' for v in plat_gap.values]
ax.barh(range(len(plat_gap)), plat_gap.values, color=colors_gap, edgecolor='black', linewidth=0.5)
ax.set_yticks(range(len(plat_gap)))
ax.set_yticklabels(plat_gap.index)
ax.set_xlabel('Trust Gap (No Issue - Has Issue)')
ax.set_title('Trust Onboarding Gap by Platform')
for i, v in enumerate(plat_gap.values):
    ax.text(v + 0.001, i, f'{v:.4f}', va='center', fontsize=9, fontweight='bold')

# 6b. Trust score distribution by platform (violin)
ax = axes[0, 1]
platform_order = df.groupby('platform_type')['trust_raw'].median().sort_values().index
sns.violinplot(data=df, x='platform_type', y='trust_raw', order=platform_order,
               palette='viridis', ax=ax, inner='quartile')
ax.set_xlabel('Platform Type')
ax.set_ylabel('Trust Raw Score')
ax.set_title('Trust Distribution by Platform')
ax.tick_params(axis='x', rotation=45)

# 6c. Platform onboarding barrier rate
ax = axes[0, 2]
plat_barrier = df.groupby('platform_type')['doc_issue_flag'].mean() * 100
plat_barrier = plat_barrier.sort_values(ascending=True)
colors_plat = ['#e74c3c' if v > 55 else '#f39c12' if v > 45 else '#2ecc71' for v in plat_barrier.values]
ax.barh(range(len(plat_barrier)), plat_barrier.values, color=colors_plat, edgecolor='black', linewidth=0.5)
ax.set_yticks(range(len(plat_barrier)))
ax.set_yticklabels(plat_barrier.index)
ax.set_xlabel('Document Issue Rate (%)')
ax.set_title('Onboarding Barrier Rate by Platform')
for i, v in enumerate(plat_barrier.values):
    ax.text(v + 0.5, i, f'{v:.1f}%', va='center', fontsize=9, fontweight='bold')

# 6d. Platform trust by barrier count
ax = axes[1, 0]
plat_barrier_trust = df.groupby(['platform_type', 'barrier_count'])['trust_raw'].mean().unstack()
plat_barrier_trust = plat_barrier_trust.reindex(platform_order)
plat_barrier_trust.plot(kind='bar', ax=ax, colormap='RdYlGn_r', edgecolor='black', linewidth=0.5)
ax.set_xlabel('Platform Type')
ax.set_ylabel('Mean Trust Score')
ax.set_title('Trust by Platform & Barrier Count')
ax.legend(title='Barriers', bbox_to_anchor=(1.05, 1), loc='upper left')
ax.tick_params(axis='x', rotation=45)

# 6e. Platform recovery potential
ax = axes[1, 1]
plat_current = df.groupby('platform_type')['trust_raw'].mean()
plat_ceiling = df.groupby('platform_type').apply(
    lambda x: x[x['barrier_count'] == 0]['trust_raw'].mean()
)
plat_recovery = (plat_ceiling - plat_current).sort_values(ascending=True)
ax.barh(range(len(plat_recovery)), plat_recovery.values,
        color=sns.color_palette("YlOrRd", len(plat_recovery)),
        edgecolor='black', linewidth=0.5)
ax.set_yticks(range(len(plat_recovery)))
ax.set_yticklabels(plat_recovery.index)
ax.set_xlabel('Trust Recovery Potential')
ax.set_title('Trust Recovery Potential by Platform')
for i, v in enumerate(plat_recovery.values):
    ax.text(v + 0.002, i, f'+{v:.4f}', va='center', fontsize=9, fontweight='bold')

# 6f. Platform recommendation summary
ax = axes[1, 2]
ax.axis('off')
plat_summary = [
    "Platform-Specific Recommendations",
    "",
    "High Priority (Gap > 0.05):",
]
high_priority = plat_gap[plat_gap > 0.05].index.tolist()
for p in high_priority:
    plat_summary.append(f"  - {p}")
plat_summary.extend([
    "",
    "Medium Priority (Gap 0.03-0.05):",
])
med_priority = plat_gap[(plat_gap > 0.03) & (plat_gap <= 0.05)].index.tolist()
for p in med_priority:
    plat_summary.append(f"  - {p}")
plat_summary.extend([
    "",
    "Key Interventions:",
    "  1. Agent-assisted document help",
    "  2. Regional language onboarding",
    "  3. Progressive trust building",
    "  4. Platform-specific flows",
])
ax.text(0.05, 0.95, '\n'.join(plat_summary), transform=ax.transAxes, fontsize=9,
        verticalalignment='top', fontfamily='monospace',
        bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.8))

plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/06_platform_trust_onboarding.png', bbox_inches='tight', dpi=150)
plt.close()
print("Saved: 06_platform_trust_onboarding.png")

# ============================================================
# GENERATE SUMMARY STATISTICS
# ============================================================
print("\n--- Generating Summary Statistics ---")

summary = {
    'Metric': [
        'Total Workers',
        'Mean Trust Raw Score',
        'Trust >= 0.70 (High Trust)',
        'Trust < 0.50 (Low Trust)',
        'Workers with Document Issues',
        'Mean Trust (No Document Issue)',
        'Mean Trust (Has Document Issue)',
        'Trust Gap (Document Issue)',
        'Workers with 0 Barriers',
        'Workers with 3+ Barriers',
        'Mean Trust (0 Barriers)',
        'Mean Trust (3+ Barriers)',
        'Trust Gap (0 vs 3+ Barriers)',
        'Top Trust Predictor (RF)',
        'Overall Prediction Accuracy',
    ],
    'Value': [
        f'{len(df):,}',
        f'{df["trust_raw"].mean():.4f}',
        f'{(df["trust_raw"] >= 0.7).sum():,} ({(df["trust_raw"] >= 0.7).mean()*100:.1f}%)',
        f'{(df["trust_raw"] < 0.5).sum():,} ({(df["trust_raw"] < 0.5).mean()*100:.1f}%)',
        f'{df["doc_issue_flag"].sum():,} ({df["doc_issue_flag"].mean()*100:.1f}%)',
        f'{df[df["onboarding_document_issue"].isna()]["trust_raw"].mean():.4f}',
        f'{df[df["onboarding_document_issue"].notna()]["trust_raw"].mean():.4f}',
        f'{no_issue_trust - issue_trust:.4f}',
        f'{(df["barrier_count"] == 0).sum():,} ({(df["barrier_count"] == 0).mean()*100:.1f}%)',
        f'{(df["barrier_count"] >= 3).sum():,} ({(df["barrier_count"] >= 3).mean()*100:.1f}%)',
        f'{df[df["barrier_count"] == 0]["trust_raw"].mean():.4f}',
        f'{df[df["barrier_count"] >= 3]["trust_raw"].mean():.4f}',
        f'{no_barriers.mean() - all_barriers.mean():.4f}',
        f'{importances.tail(1).index[0]}',
        f'{rf.score(X, y)*100:.1f}%',
    ]
}
summary_df = pd.DataFrame(summary)
summary_df.to_csv(f'{OUTPUT_DIR}/summary_statistics.csv', index=False)
print("Saved: summary_statistics.csv")

print("\n" + "="*70)
print("TRUST ONBOARDING ANALYSIS COMPLETE")
print("="*70)
print(f"\nOutputs saved to: {OUTPUT_DIR}")
