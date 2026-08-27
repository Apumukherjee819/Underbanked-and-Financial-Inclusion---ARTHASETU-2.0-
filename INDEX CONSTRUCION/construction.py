"""
Index Construction for Gig Worker Trust Score Analysis
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
OUTPUT_DIR = r"C:\Users\arpam\OneDrive\Desktop\SMART INDIA HACKATHON\appPrototype\index_construction\outputs"

import os
os.makedirs(OUTPUT_DIR, exist_ok=True)

df = pd.read_csv(DATA_PATH)
print(f"Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")

# Store calculation details for report
calc_log = []

def log_calc(step, description, formula, result):
    calc_log.append({
        'Step': step,
        'Description': description,
        'Formula': formula,
        'Result': result
    })

# ============================================================
# HELPER: Min-Max Normalization
# ============================================================
def min_max_normalize(series):
    min_val = series.min()
    max_val = series.max()
    if max_val == min_val:
        return pd.Series(0.5, index=series.index)
    return (series - min_val) / (max_val - min_val)

# ============================================================
# INDEX 1: Financial Literacy Index (FLI)
# ============================================================
print("\n" + "="*60)
print("INDEX 1: Financial Literacy Index (FLI)")
print("="*60)

log_calc("1.1", "Identify FLI components",
         "savings_rate, emi_burden_ratio, has_upi, has_bank_account, expense_ratio",
         "5 components selected")

# Step 1: Normalize each component
df['savings_rate_norm'] = min_max_normalize(df['savings_rate'])
df['emi_burden_norm'] = min_max_normalize(df['emi_burden_ratio'])
df['expense_ratio_norm'] = min_max_normalize(df['expense_ratio'])

log_calc("1.2", "Normalize continuous variables using Min-Max",
         "X_norm = (X - X_min) / (X_max - X_min)",
         f"savings_rate: [{df['savings_rate'].min():.4f}, {df['savings_rate'].max():.4f}] -> [0, 1]")

# Step 2: Calculate FLI with weights
w_savings = 0.25
w_emi = 0.20
w_upi = 0.25
w_bank = 0.15
w_expense = 0.15

df['FLI'] = (
    df['savings_rate_norm'] * w_savings +
    df['emi_burden_norm'] * w_emi +
    df['has_upi'].astype(float) * w_upi +
    df['has_bank_account'].astype(float) * w_bank +
    df['expense_ratio_norm'] * w_expense
)

log_calc("1.3", "Calculate FLI with component weights",
         f"FLI = {w_savings}*savings_norm + {w_emi}*emi_norm + {w_upi}*has_upi + {w_bank}*has_bank + {w_expense}*expense_norm",
         f"FLI range: [{df['FLI'].min():.4f}, {df['FLI'].max():.4f}], Mean: {df['FLI'].mean():.4f}")

# Step 3: FLI Statistics
log_calc("1.4", "FLI Descriptive Statistics",
         "Mean, Std, Min, Max, Quartiles",
         f"Mean={df['FLI'].mean():.4f}, Std={df['FLI'].std():.4f}, Median={df['FLI'].median():.4f}")

print(f"FLI constructed: Mean={df['FLI'].mean():.4f}, Std={df['FLI'].std():.4f}")
print(f"FLI range: [{df['FLI'].min():.4f}, {df['FLI'].max():.4f}]")

# ============================================================
# INDEX 2: Digital Confidence Index (DCI)
# ============================================================
print("\n" + "="*60)
print("INDEX 2: Digital Confidence Index (DCI)")
print("="*60)

log_calc("2.1", "Identify DCI components",
         "digital_literacy_score_1_5, has_upi, platform_rating_out_of_5, digital_readiness",
         "4 components selected")

# Step 1: Normalize components
df['dl_score_norm'] = df['digital_literacy_score_1_5'] / 5.0
df['platform_rating_norm'] = df['platform_rating_out_of_5'] / 5.0

log_calc("2.2", "Normalize DL score and platform rating to 0-1 scale",
         "X_norm = X / 5.0 (max possible score)",
         f"DL score: [{df['digital_literacy_score_1_5'].min()}, {df['digital_literacy_score_1_5'].max()}] -> [0, 1]")

# Step 2: Calculate DCI with weights
w_dl = 0.35
w_upi_dci = 0.25
w_rating = 0.20
w_digital_readiness = 0.20

df['DCI'] = (
    df['dl_score_norm'] * w_dl +
    df['has_upi'].astype(float) * w_upi_dci +
    df['platform_rating_norm'] * w_rating +
    df['digital_readiness'] * w_digital_readiness
)

log_calc("2.3", "Calculate DCI with component weights",
         f"DCI = {w_dl}*dl_norm + {w_upi_dci}*has_upi + {w_rating}*rating_norm + {w_digital_readiness}*digital_readiness",
         f"DCI range: [{df['DCI'].min():.4f}, {df['DCI'].max():.4f}], Mean: {df['DCI'].mean():.4f}")

# Step 3: DCI Statistics
log_calc("2.4", "DCI Descriptive Statistics",
         "Mean, Std, Min, Max, Quartiles",
         f"Mean={df['DCI'].mean():.4f}, Std={df['DCI'].std():.4f}, Median={df['DCI'].median():.4f}")

print(f"DCI constructed: Mean={df['DCI'].mean():.4f}, Std={df['DCI'].std():.4f}")
print(f"DCI range: [{df['DCI'].min():.4f}, {df['DCI'].max():.4f}]")

# ============================================================
# INDEX 3: Trust Index (TI)
# ============================================================
print("\n" + "="*60)
print("INDEX 3: Trust Index (TI)")
print("="*60)

log_calc("3.1", "Identify TI components",
         "financial_inclusion_index, platform_rating_out_of_5, has_social_security, injury_flag (reverse), is_migrant (reverse)",
         "5 components selected")

# Step 1: Reverse code negative items
# injury_flag: 1 = had injury (negative), so reverse = 1 - injury_flag
# is_migrant: 1 = migrant (potentially lower trust), so reverse = 1 - is_migrant
df['injury_reverse'] = 1 - df['injury_flag']
df['migrant_reverse'] = 1 - df['is_migrant']

log_calc("3.2", "Reverse code negatively worded items",
         "injury_reverse = 1 - injury_flag; migrant_reverse = 1 - is_migrant",
         f"injury_reverse mean: {df['injury_reverse'].mean():.4f}; migrant_reverse mean: {df['migrant_reverse'].mean():.4f}")

# Step 2: Normalize financial inclusion index
df['fii_norm'] = min_max_normalize(df['financial_inclusion_index'])

log_calc("3.3", "Normalize financial inclusion index",
         "fii_norm = (FII - FII_min) / (FII_max - FII_min)",
         f"FII range: [{df['financial_inclusion_index'].min():.4f}, {df['financial_inclusion_index'].max():.4f}] -> [0, 1]")

# Step 3: Calculate TI with weights
w_fii = 0.35
w_rating_ti = 0.25
w_social = 0.20
w_injury = 0.10
w_migrant = 0.10

df['TI'] = (
    df['fii_norm'] * w_fii +
    df['platform_rating_norm'] * w_rating_ti +
    df['has_social_security'].astype(float) * w_social +
    df['injury_reverse'] * w_injury +
    df['migrant_reverse'] * w_migrant
)

log_calc("3.4", "Calculate TI with component weights",
         f"TI = {w_fii}*fii_norm + {w_rating_ti}*rating_norm + {w_social}*has_social + {w_injury}*injury_rev + {w_migrant}*migrant_rev",
         f"TI range: [{df['TI'].min():.4f}, {df['TI'].max():.4f}], Mean: {df['TI'].mean():.4f}")

# Step 4: TI Statistics
log_calc("3.5", "TI Descriptive Statistics",
         "Mean, Std, Min, Max, Quartiles",
         f"Mean={df['TI'].mean():.4f}, Std={df['TI'].std():.4f}, Median={df['TI'].median():.4f}")

print(f"TI constructed: Mean={df['TI'].mean():.4f}, Std={df['TI'].std():.4f}")
print(f"TI range: [{df['TI'].min():.4f}, {df['TI'].max():.4f}]")

# ============================================================
# INDEX 4: Onboarding Difficulty Index (ODI)
# ============================================================
print("\n" + "="*60)
print("INDEX 4: Onboarding Difficulty Index (ODI)")
print("="*60)

log_calc("4.1", "Identify ODI components",
         "onboarding_document_issue (flag), digital_literacy_score_1_5 (reverse), education_encoded (reverse), preferred_app_language (encode)",
         "4 components selected")

# Step 1: Create document issue flag
df['doc_issue_flag'] = df['onboarding_document_issue'].notna().astype(int)

log_calc("4.2", "Create binary document issue flag",
         "doc_issue_flag = 1 if onboarding_document_issue is not NaN, else 0",
         f"doc_issue_flag mean: {df['doc_issue_flag'].mean():.4f} ({df['doc_issue_flag'].sum()} workers with issues)")

# Step 2: Reverse code digital literacy (lower DL = higher difficulty)
df['dl_reverse'] = (6 - df['digital_literacy_score_1_5']) / 5.0

log_calc("4.3", "Reverse code digital literacy score",
         "dl_reverse = (6 - dl_score) / 5.0 (normalized to 0-1)",
         f"dl_reverse mean: {df['dl_reverse'].mean():.4f}")

# Step 3: Reverse code education (lower education = higher difficulty)
df['edu_reverse'] = (6 - df['education_encoded']) / 5.0

log_calc("4.4", "Reverse code education level",
         "edu_reverse = (6 - education_encoded) / 5.0 (normalized to 0-1)",
         f"edu_reverse mean: {df['edu_reverse'].mean():.4f}")

# Step 4: Encode language barrier (non-Hindi/English = 1, Hindi/English = 0)
df['language_barrier'] = (~df['preferred_app_language'].isin(['Hindi', 'English'])).astype(int)

log_calc("4.5", "Encode language barrier flag",
         "language_barrier = 1 if preferred_app_language NOT IN ('Hindi', 'English'), else 0",
         f"language_barrier mean: {df['language_barrier'].mean():.4f} ({df['language_barrier'].sum()} workers with language barriers)")

# Step 5: Calculate ODI with weights
w_doc = 0.30
w_dl_od = 0.25
w_edu = 0.25
w_lang = 0.20

df['ODI'] = (
    df['doc_issue_flag'] * w_doc +
    df['dl_reverse'] * w_dl_od +
    df['edu_reverse'] * w_edu +
    df['language_barrier'] * w_lang
)

log_calc("4.6", "Calculate ODI with component weights",
         f"ODI = {w_doc}*doc_flag + {w_dl_od}*dl_reverse + {w_edu}*edu_reverse + {w_lang}*lang_barrier",
         f"ODI range: [{df['ODI'].min():.4f}, {df['ODI'].max():.4f}], Mean: {df['ODI'].mean():.4f}")

# Step 6: ODI Statistics
log_calc("4.7", "ODI Descriptive Statistics",
         "Mean, Std, Min, Max, Quartiles",
         f"Mean={df['ODI'].mean():.4f}, Std={df['ODI'].std():.4f}, Median={df['ODI'].median():.4f}")

print(f"ODI constructed: Mean={df['ODI'].mean():.4f}, Std={df['ODI'].std():.4f}")
print(f"ODI range: [{df['ODI'].min():.4f}, {df['ODI'].max():.4f}]")

# ============================================================
# INDEX 5: Income Volatility Index (IVI)
# ============================================================
print("\n" + "="*60)
print("INDEX 5: Income Volatility Index (IVI)")
print("="*60)

log_calc("5.1", "Identify IVI components",
         "festive_peak_income_spike_pct, expense_ratio, emi_burden_ratio",
         "3 components selected (single-period data, CV not possible)")

# Step 2: Normalize components
df['spike_norm'] = min_max_normalize(df['festive_peak_income_spike_pct'])

log_calc("5.2", "Normalize festive peak income spike",
         "spike_norm = (spike - spike_min) / (spike_max - spike_min)",
         f"spike range: [{df['festive_peak_income_spike_pct'].min():.1f}%, {df['festive_peak_income_spike_pct'].max():.1f}%] -> [0, 1]")

# Step 3: Calculate IVI with weights
w_spike = 0.40
w_expense_iv = 0.30
w_emi_iv = 0.30

df['IVI'] = (
    df['spike_norm'] * w_spike +
    df['expense_ratio_norm'] * w_expense_iv +
    df['emi_burden_norm'] * w_emi_iv
)

log_calc("5.3", "Calculate IVI with component weights",
         f"IVI = {w_spike}*spike_norm + {w_expense_iv}*expense_norm + {w_emi_iv}*emi_norm",
         f"IVI range: [{df['IVI'].min():.4f}, {df['IVI'].max():.4f}], Mean: {df['IVI'].mean():.4f}")

# Step 4: IVI Statistics
log_calc("5.4", "IVI Descriptive Statistics",
         "Mean, Std, Min, Max, Quartiles",
         f"Mean={df['IVI'].mean():.4f}, Std={df['IVI'].std():.4f}, Median={df['IVI'].median():.4f}")

# Step 5: Alternative CV-based IVI (if we can approximate from income categories)
# Using income_category as a proxy for volatility
income_vol_map = {'Very Low': 0.8, 'Low': 0.6, 'Medium': 0.4, 'High': 0.3, 'Very High': 0.2}
df['IVI_categorical'] = df['income_category'].map(income_vol_map).fillna(0.5)

log_calc("5.5", "Alternative IVI using income category as volatility proxy",
         "IVI_cat = income_vol_map[income_category]",
         f"IVI_categorical mean: {df['IVI_categorical'].mean():.4f}")

print(f"IVI constructed: Mean={df['IVI'].mean():.4f}, Std={df['IVI'].std():.4f}")
print(f"IVI range: [{df['IVI'].min():.4f}, {df['IVI'].max():.4f}]")

# ============================================================
# SAVE CALCULATION LOG
# ============================================================
print("\n" + "="*60)
print("Saving Calculation Log")
print("="*60)

calc_df = pd.DataFrame(calc_log)
calc_df.to_csv(f'{OUTPUT_DIR}/calculation_log.csv', index=False)
print("Saved: calculation_log.csv")

# ============================================================
# SAVE DATAFRAME WITH INDICES
# ============================================================
# Select key columns for output
output_cols = ['worker_id', 'survey_year', 'platform', 'platform_type', 'gender', 'age_years',
               'education_level', 'city', 'state', 'city_tier', 'digital_literacy_score_1_5',
               'has_bank_account', 'has_upi', 'has_social_security', 'onboarding_document_issue',
               'monthly_gross_income_inr', 'monthly_net_income_inr', 'savings_rate', 'expense_ratio',
               'emi_burden_ratio', 'financial_inclusion_index', 'digital_readiness', 'trust_raw',
               'trust_category', 'income_category', 'FLI', 'DCI', 'TI', 'ODI', 'IVI']

df[output_cols].to_csv(f'{OUTPUT_DIR}/data_with_indices.csv', index=False)
print("Saved: data_with_indices.csv")

# ============================================================
# GENERATE INDEX SUMMARY STATISTICS
# ============================================================
print("\n" + "="*60)
print("Index Summary Statistics")
print("="*60)

indices = ['FLI', 'DCI', 'TI', 'ODI', 'IVI']
summary_data = []
for idx in indices:
    summary_data.append({
        'Index': idx,
        'Mean': df[idx].mean(),
        'Std': df[idx].std(),
        'Min': df[idx].min(),
        'Q1': df[idx].quantile(0.25),
        'Median': df[idx].median(),
        'Q3': df[idx].quantile(0.75),
        'Max': df[idx].max(),
        'Skewness': df[idx].skew(),
        'Kurtosis': df[idx].kurtosis()
    })
    print(f"\n{idx}:")
    print(f"  Mean: {df[idx].mean():.4f}")
    print(f"  Std:  {df[idx].std():.4f}")
    print(f"  Min:  {df[idx].min():.4f}")
    print(f"  Max:  {df[idx].max():.4f}")

summary_df = pd.DataFrame(summary_data)
summary_df.to_csv(f'{OUTPUT_DIR}/index_summary_statistics.csv', index=False)
print("\nSaved: index_summary_statistics.csv")

print("\n" + "="*60)
print("INDEX CONSTRUCTION COMPLETE")
print("="*60)
# ============================================================
# VISUALIZATION 1: FLI Distribution and Components
# ============================================================
print("\n--- Generating Visualizations ---")

fig, axes = plt.subplots(2, 3, figsize=(18, 12))
fig.suptitle('Index 1: Financial Literacy Index (FLI)', fontsize=16, fontweight='bold', y=1.02)

# 1a. FLI Distribution
ax = axes[0, 0]
ax.hist(df['FLI'], bins=30, color='steelblue', edgecolor='black', linewidth=0.5, alpha=0.7)
ax.axvline(df['FLI'].mean(), color='red', linestyle='--', linewidth=2, label=f'Mean: {df["FLI"].mean():.4f}')
ax.axvline(df['FLI'].median(), color='green', linestyle='--', linewidth=2, label=f'Median: {df["FLI"].median():.4f}')
ax.set_xlabel('FLI Score')
ax.set_ylabel('Frequency')
ax.set_title('FLI Distribution')
ax.legend()

# 1b. FLI Box Plot
ax = axes[0, 1]
ax.boxplot(df['FLI'].dropna(), patch_artist=True, boxprops=dict(facecolor='lightblue'))
ax.set_ylabel('FLI Score')
ax.set_title('FLI Box Plot')
ax.set_xticklabels(['FLI'])

# 1c. FLI by Education Level
ax = axes[0, 2]
edu_order = ['No formal education', 'Class 8-10 dropout', 'Class 10 pass', 'Class 12 pass',
             'ITI/Diploma', 'Graduate', 'Post-Graduate']
fli_by_edu = df.groupby('education_level')['FLI'].mean().reindex(edu_order)
colors_edu = sns.color_palette("RdYlGn", len(fli_by_edu))
ax.barh(range(len(fli_by_edu)), fli_by_edu.values, color=colors_edu, edgecolor='black', linewidth=0.5)
ax.set_yticks(range(len(fli_by_edu)))
ax.set_yticklabels(fli_by_edu.index, fontsize=8)
ax.set_xlabel('Mean FLI Score')
ax.set_title('FLI by Education Level')
for i, v in enumerate(fli_by_edu.values):
    ax.text(v + 0.005, i, f'{v:.4f}', va='center', fontsize=9, fontweight='bold')

# 1d. FLI Components Correlation
ax = axes[1, 0]
fli_components = ['savings_rate_norm', 'emi_burden_norm', 'has_upi', 'has_bank_account', 'expense_ratio_norm']
fli_corr = df[fli_components + ['FLI']].corr()['FLI'].drop('FLI')
ax.barh(range(len(fli_corr)), fli_corr.values, color=sns.color_palette("viridis", len(fli_corr)), edgecolor='black', linewidth=0.5)
ax.set_yticks(range(len(fli_corr)))
ax.set_yticklabels(['Savings Rate', 'EMI Burden', 'Has UPI', 'Has Bank', 'Expense Ratio'], fontsize=8)
ax.set_xlabel('Correlation with FLI')
ax.set_title('FLI Component Correlations')
for i, v in enumerate(fli_corr.values):
    ax.text(v + 0.01, i, f'{v:.3f}', va='center', fontsize=9, fontweight='bold')

# 1e. FLI by Bank Account Status
ax = axes[1, 1]
fli_bank = df.groupby('has_bank_account')['FLI'].agg(['mean', 'std'])
bank_counts = df.groupby('has_bank_account').size()
ax.bar(['No Bank Account', 'Has Bank Account'], fli_bank['mean'],
       yerr=fli_bank['std']/np.sqrt(bank_counts),
       color=['#e74c3c', '#2ecc71'], edgecolor='black', linewidth=0.5, capsize=5)
for i, (idx, row) in enumerate(fli_bank.iterrows()):
    ax.text(i, row['mean'] + 0.01, f'{row["mean"]:.4f}', ha='center', fontsize=10, fontweight='bold')
ax.set_ylabel('Mean FLI Score')
ax.set_title('FLI by Bank Account Status')

# 1f. FLI by Platform Type
ax = axes[1, 2]
fli_platform = df.groupby('platform_type')['FLI'].mean().sort_values(ascending=True)
ax.barh(range(len(fli_platform)), fli_platform.values, color=sns.color_palette("viridis", len(fli_platform)), edgecolor='black', linewidth=0.5)
ax.set_yticks(range(len(fli_platform)))
ax.set_yticklabels(fli_platform.index)
ax.set_xlabel('Mean FLI Score')
ax.set_title('FLI by Platform Type')
for i, v in enumerate(fli_platform.values):
    ax.text(v + 0.005, i, f'{v:.4f}', va='center', fontsize=9, fontweight='bold')

plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}/01_fli_distribution.png', bbox_inches='tight', dpi=150)
plt.close()
print("Saved: 01_fli_distribution.png")
