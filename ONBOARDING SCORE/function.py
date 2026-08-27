import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
from scipy.stats import pearsonr, spearmanr, f_oneway, kruskal
import statsmodels.api as sm
import sys, io, os
warnings.filterwarnings('ignore')
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
plt.rcParams['figure.dpi'] = 150
plt.rcParams['savefig.dpi'] = 150
plt.rcParams['font.size'] = 10
sns.set_style("whitegrid")

DATA_PATH = r"C:\Users\arpam\OneDrive\Desktop\SMART INDIA HACKATHON\appPrototype\index_construction\outputs\data_with_indices.csv"
OUTPUT_DIR = r"C:\Users\arpam\OneDrive\Desktop\SMART INDIA HACKATHON\appPrototype\onboarding_score\outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

df = pd.read_csv(DATA_PATH)
print(f"Data loaded: {df.shape[0]} rows")
indices = ['FLI', 'DCI', 'TI', 'ODI', 'IVI']

# ============================================================================
# FUNCTION 1: Linear Weighted Sum
# ============================================================================
abs_coefs = {'FLI': 0.2828, 'DCI': 0.3841, 'TI': 0.0275, 'IVI': 0.2130}
total = sum(abs_coefs.values())
w = {k: v/total for k, v in abs_coefs.items()}

def onboarding_difficulty_linear(row):
    score = (0.8191 
             + w['FLI'] * row['FLI'] 
             - w['DCI'] * row['DCI'] 
             + w['TI'] * row['TI'] 
             - w['IVI'] * row['IVI'])
    return np.clip(score, 0, 1)

df['ODS_linear'] = df.apply(onboarding_difficulty_linear, axis=1)
print("Function 1 (Linear) computed")

# ============================================================================
# FUNCTION 2: Interaction Model
# ============================================================================
def onboarding_difficulty_interaction(row):
    score = (0.8191
             + 0.3409 * row['FLI'] 
             - 0.3012 * row['DCI'] 
             + 0.0246 * row['TI'] 
             - 0.2068 * row['IVI']
             - 0.1389 * row['FLI'] * row['DCI']
             + 0.0876 * row['FLI'] * row['TI']
             - 0.0425 * row['DCI'] * row['TI'])
    return np.clip(score, 0, 1)

df['ODS_interaction'] = df.apply(onboarding_difficulty_interaction, axis=1)
print("Function 2 (Interaction) computed")

# ============================================================================
# FUNCTION 3: Segment-Specific
# ============================================================================
segment_coefs = {
    'ride_hailing':    {'FLI': 0.3001, 'DCI': -0.4079, 'TI': 0.0307, 'IVI': -0.2518},
    'food_delivery':   {'FLI': 0.2666, 'DCI': -0.3691, 'TI': 0.0228, 'IVI': -0.1960},
    'logistics':       {'FLI': 0.2721, 'DCI': -0.3491, 'TI': 0.0098, 'IVI': -0.1829},
    'quick_commerce':  {'FLI': 0.2889, 'DCI': -0.3721, 'TI': 0.0170, 'IVI': -0.1971},
    'home_services':   {'FLI': 0.2914, 'DCI': -0.3804, 'TI': 0.0552, 'IVI': -0.1946},
    'bike_taxi':       {'FLI': 0.2973, 'DCI': -0.3680, 'TI': 0.0472, 'IVI': -0.1592},
    'hyperlocal':      {'FLI': 0.2500, 'DCI': -0.3737, 'TI': -0.0061, 'IVI': -0.2267},
}

def onboarding_difficulty_segment(row):
    coefs = segment_coefs.get(row['platform_type'], segment_coefs['food_delivery'])
    score = (0.8191
             + coefs['FLI'] * row['FLI'] 
             + coefs['DCI'] * row['DCI'] 
             + coefs['TI'] * row['TI'] 
             + coefs['IVI'] * row['IVI'])
    return np.clip(score, 0, 1)

df['ODS_segment'] = df.apply(onboarding_difficulty_segment, axis=1)
print("Function 3 (Segment) computed")

# ============================================================================
# SUMMARY STATISTICS
# ============================================================================
print("\n" + "="*70)
print("SUMMARY STATISTICS")
print("="*70)
for func_name in ['ODS_linear', 'ODS_interaction', 'ODS_segment']:
    print(f"\n{func_name}:")
    print(f"  Mean:   {df[func_name].mean():.4f}")
    print(f"  Std:    {df[func_name].std():.4f}")
    print(f"  Median: {df[func_name].median():.4f}")
    print(f"  Min:    {df[func_name].min():.4f}")
    print(f"  Max:    {df[func_name].max():.4f}")

# ============================================================================
# VALIDATION: CORRELATION WITH PROXY VARIABLES
# ============================================================================
print("\n" + "="*70)
print("VALIDATION: CORRELATION WITH PROXY VARIABLES")
print("="*70)

df['doc_issue_binary'] = df['onboarding_document_issue'].notna().astype(int)
proxy_vars = ['doc_issue_binary', 'financial_inclusion_index', 'has_bank_account', 'has_upi', 'savings_rate']

for func_name in ['ODS_linear', 'ODS_interaction', 'ODS_segment']:
    print(f"\n{func_name}:")
    for proxy in proxy_vars:
        if proxy in df.columns:
            r, p = pearsonr(df[func_name], df[proxy])
            sig = "***" if p < 0.001 else "**" if p < 0.01 else "*" if p < 0.05 else "ns"
            print(f"  vs {proxy}: r={r:.4f}, p={p:.2e} {sig}")

# ============================================================================
# VALIDATION: PREDICTIVE POWER (how well does each score predict FI index?)
# ============================================================================
print("\n" + "="*70)
print("VALIDATION: PREDICTIVE POWER (R-squared)")
print("="*70)

for func_name in ['ODS_linear', 'ODS_interaction', 'ODS_segment']:
    X_val = sm.add_constant(df[[func_name]])
    y_val = df['financial_inclusion_index']
    model_val = sm.OLS(y_val, X_val).fit()
    print(f"  {func_name} -> FI Index: R-squared = {model_val.rsquared:.4f}")

# ============================================================================
# SEGMENT-WISE MEANS
# ============================================================================
print("\n" + "="*70)
print("SEGMENT-WISE MEANS OF ALL THREE SCORES")
print("="*70)

for func_name in ['ODS_linear', 'ODS_interaction', 'ODS_segment']:
    print(f"\n{func_name} by Platform:")
    grp = df.groupby('platform_type')[func_name].agg(['mean', 'std', 'median']).round(4)
    print(grp.to_string())

# ============================================================================
# CATEGORY ANALYSIS (Trust and Income categories)
# ============================================================================
print("\n" + "="*70)
print("SCORE BY TRUST CATEGORY")
print("="*70)
for func_name in ['ODS_linear', 'ODS_interaction', 'ODS_segment']:
    print(f"\n{func_name}:")
    grp = df.groupby('trust_category')[func_name].agg(['mean', 'std', 'count']).round(4)
    print(grp.to_string())

print("\n" + "="*70)
print("SCORE BY INCOME CATEGORY")
print("="*70)
for func_name in ['ODS_linear', 'ODS_interaction', 'ODS_segment']:
    print(f"\n{func_name}:")
    income_order = ['Very Low', 'Low', 'Medium', 'High', 'Very High']
    grp = df.groupby('income_category')[func_name].agg(['mean', 'std', 'count']).reindex(income_order).round(4)
    print(grp.to_string())

# ============================================================================
# VISUALIZATIONS
# ============================================================================
print("\n" + "="*70)
print("GENERATING VISUALIZATIONS")
print("="*70)

# VIZ 1: Distribution comparison of all three functions
fig, axes = plt.subplots(1, 3, figsize=(18, 5))
fig.suptitle('Onboarding Difficulty Score: Three Candidate Functions', fontsize=14, fontweight='bold')
func_names = ['ODS_linear', 'ODS_interaction', 'ODS_segment']
func_labels = ['Linear Weighted Sum', 'Interaction Model', 'Segment-Specific']
func_colors = ['steelblue', 'darkorange', 'seagreen']
for i, (fn, fl, fc) in enumerate(zip(func_names, func_labels, func_colors)):
    axes[i].hist(df[fn], bins=30, color=fc, edgecolor='black', linewidth=0.5, alpha=0.7)
    axes[i].axvline(df[fn].mean(), color='red', linestyle='--', linewidth=2, label=f'Mean: {df[fn].mean():.4f}')
    axes[i].axvline(df[fn].median(), color='green', linestyle='--', linewidth=2, label=f'Median: {df[fn].median():.4f}')
    axes[i].set_xlabel('Score'); axes[i].set_ylabel('Frequency')
    axes[i].set_title(f'{fl}\nMean={df[fn].mean():.4f}, Std={df[fn].std():.4f}')
    axes[i].legend(fontsize=8)
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/01_score_distributions.png', bbox_inches='tight', dpi=150)
plt.close()
print("Saved: 01_score_distributions.png")

# VIZ 2: Box plots by platform type for all three functions
fig, axes = plt.subplots(1, 3, figsize=(20, 6))
fig.suptitle('Score Distribution by Platform Type', fontsize=14, fontweight='bold')
for i, (fn, fl) in enumerate(zip(func_names, func_labels)):
    df.boxplot(column=fn, by='platform_type', ax=axes[i], rot=45, fontsize=7)
    axes[i].set_title(f'{fl}')
    axes[i].set_xlabel('')
    axes[i].set_ylabel('Score')
plt.suptitle('')
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/02_boxplots_by_platform.png', bbox_inches='tight', dpi=150)
plt.close()
print("Saved: 02_boxplots_by_platform.png")

# VIZ 3: Correlation with financial inclusion index
fig, axes = plt.subplots(1, 3, figsize=(18, 5))
fig.suptitle('Score vs Financial Inclusion Index', fontsize=14, fontweight='bold')
sample_idx = np.random.RandomState(42).choice(len(df), 2000, replace=False)
for i, (fn, fl, fc) in enumerate(zip(func_names, func_labels, func_colors)):
    r, p = pearsonr(df[fn], df['financial_inclusion_index'])
    axes[i].scatter(df[fn].iloc[sample_idx], df['financial_inclusion_index'].iloc[sample_idx], alpha=0.3, s=15, c=fc)
    z = np.polyfit(df[fn], df['financial_inclusion_index'], 1)
    p_line = np.poly1d(z)
    xl = np.linspace(df[fn].min(), df[fn].max(), 100)
    axes[i].plot(xl, p_line(xl), 'r--', linewidth=2, label=f'r = {r:.3f}')
    axes[i].set_xlabel(f'{fl} Score'); axes[i].set_ylabel('Financial Inclusion Index')
    axes[i].set_title(f'{fl}\nr = {r:.3f}'); axes[i].legend()
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/03_correlation_with_fi.png', bbox_inches='tight', dpi=150)
plt.close()
print("Saved: 03_correlation_with_fi.png")

# VIZ 4: Score by trust category
fig, axes = plt.subplots(1, 3, figsize=(18, 5))
fig.suptitle('Score by Trust Category', fontsize=14, fontweight='bold')
trust_order = ['Low Trust', 'Medium Trust', 'High Trust']
for i, (fn, fl, fc) in enumerate(zip(func_names, func_labels, func_colors)):
    grp = df.groupby('trust_category')[fn].mean().reindex(trust_order)
    bars = axes[i].bar(range(len(grp)), grp.values, color=[fc]*len(grp), edgecolor='black', linewidth=0.5, alpha=0.7)
    axes[i].set_xticks(range(len(grp))); axes[i].set_xticklabels(grp.index, rotation=15)
    axes[i].set_ylabel('Mean Score'); axes[i].set_title(fl)
    for bar, val in zip(bars, grp.values):
        axes[i].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.003, f'{val:.4f}', ha='center', fontsize=9, fontweight='bold')
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/04_score_by_trust.png', bbox_inches='tight', dpi=150)
plt.close()
print("Saved: 04_score_by_trust.png")

# VIZ 5: Score by income category
fig, axes = plt.subplots(1, 3, figsize=(18, 5))
fig.suptitle('Score by Income Category', fontsize=14, fontweight='bold')
income_order = ['Very Low', 'Low', 'Medium', 'High', 'Very High']
for i, (fn, fl, fc) in enumerate(zip(func_names, func_labels, func_colors)):
    grp = df.groupby('income_category')[fn].mean().reindex(income_order)
    bars = axes[i].bar(range(len(grp)), grp.values, color=[fc]*len(grp), edgecolor='black', linewidth=0.5, alpha=0.7)
    axes[i].set_xticks(range(len(grp))); axes[i].set_xticklabels(grp.index, rotation=45)
    axes[i].set_ylabel('Mean Score'); axes[i].set_title(fl)
    for bar, val in zip(bars, grp.values):
        axes[i].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.003, f'{val:.4f}', ha='center', fontsize=9, fontweight='bold')
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/05_score_by_income.png', bbox_inches='tight', dpi=150)
plt.close()
print("Saved: 05_score_by_income.png")

# VIZ 6: Comparison scatter (Linear vs Interaction)
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
fig.suptitle('Function Comparison', fontsize=14, fontweight='bold')
r_li, _ = pearsonr(df['ODS_linear'], df['ODS_interaction'])
axes[0].scatter(df['ODS_linear'].iloc[sample_idx], df['ODS_interaction'].iloc[sample_idx], alpha=0.3, s=15, c='purple')
axes[0].plot([0,1],[0,1], 'r--', linewidth=1)
axes[0].set_xlabel('Linear Score'); axes[0].set_ylabel('Interaction Score')
axes[0].set_title(f'Linear vs Interaction (r={r_li:.3f})')
r_ls, _ = pearsonr(df['ODS_linear'], df['ODS_segment'])
axes[1].scatter(df['ODS_linear'].iloc[sample_idx], df['ODS_segment'].iloc[sample_idx], alpha=0.3, s=15, c='brown')
axes[1].plot([0,1],[0,1], 'r--', linewidth=1)
axes[1].set_xlabel('Linear Score'); axes[1].set_ylabel('Segment Score')
axes[1].set_title(f'Linear vs Segment (r={r_ls:.3f})')
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/06_function_comparison.png', bbox_inches='tight', dpi=150)
plt.close()
print("Saved: 06_function_comparison.png")

# VIZ 7: Recommended function (Interaction) with category overlays
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('Recommended Function: Interaction Model (ODS_interaction)', fontsize=14, fontweight='bold')
ax = axes[0, 0]
ax.hist(df['ODS_interaction'], bins=30, color='darkorange', edgecolor='black', linewidth=0.5, alpha=0.7)
ax.axvline(df['ODS_interaction'].mean(), color='red', linestyle='--', linewidth=2, label=f'Mean: {df["ODS_interaction"].mean():.4f}')
ax.set_xlabel('ODS Score'); ax.set_ylabel('Frequency'); ax.set_title('Overall Distribution'); ax.legend()
ax = axes[0, 1]
for plat in df['platform_type'].unique():
    subset = df[df['platform_type'] == plat]['ODS_interaction']
    ax.hist(subset, bins=25, alpha=0.3, label=plat)
ax.set_xlabel('ODS Score'); ax.set_ylabel('Frequency'); ax.set_title('By Platform Type'); ax.legend(fontsize=7)
ax = axes[1, 0]
odi_corr, _ = pearsonr(df['ODS_interaction'], df['ODI'])
ax.scatter(df['ODS_interaction'].iloc[sample_idx], df['ODI'].iloc[sample_idx], alpha=0.3, s=15, c='darkorange')
z = np.polyfit(df['ODS_interaction'], df['ODI'], 1); p = np.poly1d(z)
xl = np.linspace(df['ODS_interaction'].min(), df['ODS_interaction'].max(), 100)
ax.plot(xl, p(xl), 'r--', linewidth=2, label=f'r = {odi_corr:.3f}')
ax.set_xlabel('ODS Score'); ax.set_ylabel('ODI'); ax.set_title('ODS vs ODI'); ax.legend()
ax = axes[1, 1]
fi_corr, _ = pearsonr(df['ODS_interaction'], df['financial_inclusion_index'])
ax.scatter(df['ODS_interaction'].iloc[sample_idx], df['financial_inclusion_index'].iloc[sample_idx], alpha=0.3, s=15, c='darkorange')
z = np.polyfit(df['ODS_interaction'], df['financial_inclusion_index'], 1); p = np.poly1d(z)
xl = np.linspace(df['ODS_interaction'].min(), df['ODS_interaction'].max(), 100)
ax.plot(xl, p(xl), 'r--', linewidth=2, label=f'r = {fi_corr:.3f}')
ax.set_xlabel('ODS Score'); ax.set_ylabel('Financial Inclusion Index'); ax.set_title('ODS vs FI Index'); ax.legend()
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/07_recommended_function.png', bbox_inches='tight', dpi=150)
plt.close()
print("Saved: 07_recommended_function.png")

print("\nAll visualizations complete!")
