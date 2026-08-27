"""
STEP 1: Data Loading, Cleaning & Feature Engineering
Trust Scoring for Credit-Invisible Gig Workers
"""
import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings('ignore')

OUTPUT_DIR = r"C:\Users\arpam\gig_trust_score_analysis\outputs"

# ─── 1. LOAD DATA ───────────────────────────────────────────────
print("=" * 70)
print("STEP 1: DATA LOADING & CLEANING")
print("=" * 70)

df = pd.read_csv(r"C:\Users\arpam\Downloads\india_gig_economy_platform_workers_v2.csv")
print(f"\nRaw data shape: {df.shape}")
print(f"Columns: {df.shape[1]}")
print(f"Rows: {df.shape[0]}")

# ─── 2. BASIC DATA INFO ─────────────────────────────────────────
print("\n--- Column Data Types ---")
print(df.dtypes)

print("\n--- Missing Values (column-wise) ---")
missing = df.isnull().sum()
missing_pct = (missing / len(df)) * 100
missing_df = pd.DataFrame({'Missing Count': missing, 'Missing %': missing_pct})
print(missing_df[missing_df['Missing Count'] > 0])

print("\n--- Unique Values per Column ---")
for col in df.columns:
    print(f"  {col}: {df[col].nunique()} unique")

# ─── 3. CLEAN DATA ──────────────────────────────────────────────
print("\n--- Cleaning Steps ---")

# Remove worker_id from analysis (identifier only)
id_col = df['worker_id'].copy()

# Encode categorical variables
education_map = {
    'No formal education': 0,
    'Class 8-10 dropout': 1,
    'Class 10 pass': 2,
    'Class 12 pass': 3,
    'ITI/Diploma': 4,
    'Graduate': 5,
    'Post-Graduate': 6
}
df['education_encoded'] = df['education_level'].map(education_map)

city_tier_map = {'T3': 1, 'T2': 2, 'T1': 3}
df['city_tier_encoded'] = df['city_tier'].map(city_tier_map)

# Binary encodings
df['has_bank_account'] = (df['bank_account_type'] != 'No bank account').astype(int)
df['has_upi'] = (df['upi_app_primary'] != 'No UPI').astype(int)
df['has_social_security'] = (df['social_security_coverage'] != 'No social security coverage').astype(int)
df['is_migrant'] = (df['migrant_worker'] == 'Yes').astype(int)
df['injury_flag'] = (df['injury_last_12_months'] == 'Yes').astype(int)
df['has_secondary_income'] = (df['secondary_income_source'] != 'None').astype(int)

# Vehicle ownership encoding
vehicle_own_keywords = ['own', 'Tata Ace', 'Mini truck', 'Van']
df['vehicle_owned'] = df['vehicle_type'].apply(
    lambda x: 1 if any(k in str(x).lower() for k in vehicle_own_keywords) else 0
)

# Housing stability encoding (higher = more stable)
housing_map = {
    'On-street/informal': 0,
    'Hostel/PG': 1,
    'Single room shared (2-4 people)': 2,
    'Single room (alone)': 3,
    'Employer-provided accommodation': 3,
    '1BHK rented': 4,
    '2BHK+ rented': 5,
    'Family home (own)': 6
}
df['housing_stability'] = df['housing_type'].map(housing_map).fillna(1)

# Social security encoding (higher = more coverage)
ss_map = {
    'No social security coverage': 0,
    'Unsure/don\'t know': 1,
    'State government welfare scheme only': 2,
    'Only ESI': 3,
    'Only PF (platform-registered)': 4,
    'Both PF and ESI': 5
}
df['social_security_score'] = df['social_security_coverage'].map(ss_map).fillna(0)

# Union membership encoding
union_map = {
    'Not aware unions exist': 0,
    'No': 1,
    'None': 1,
    'Informal worker collective': 2,
    'NITES': 3,
    'Local transport union': 4,
    'IFAT affiliated': 5
}
df['union_score'] = df['union_or_collective_member'].map(union_map).fillna(0)

print("  Encoding complete.")

# ─── 4. FEATURE ENGINEERING ─────────────────────────────────────
print("\n--- Feature Engineering ---")

# Avoid division by zero
df['monthly_fuel_cost_inr'] = df['monthly_fuel_cost_inr'].replace(0, 1)
df['orders_or_rides_per_day'] = df['orders_or_rides_per_day'].replace(0, 1)

# Derived financial features
df['income_to_fuel_ratio'] = df['monthly_net_income_inr'] / df['monthly_fuel_cost_inr']
df['net_income_per_order'] = df['monthly_net_income_inr'] / (df['orders_or_rides_per_day'] * 30)
df['emi_burden_ratio'] = df['monthly_emi_burden_inr'] / df['monthly_gross_income_inr']
df['emi_burden_ratio'] = df['emi_burden_ratio'].fillna(0)
df['savings_rate'] = (df['monthly_gross_income_inr'] - df['monthly_net_income_inr']) / df['monthly_gross_income_inr']
df['expense_ratio'] = (df['monthly_fuel_cost_inr'] + df['monthly_emi_burden_inr']) / df['monthly_gross_income_inr']

# Derived work features
df['work_intensity_score'] = df['daily_hours_worked'] * df['orders_or_rides_per_day'] / 7
df['productivity_per_hour'] = df['orders_or_rides_per_day'] / df['daily_hours_worked']

# Derived trust signals
df['commitment_score'] = df['platform_rating_out_of_5'] * (1 - df['order_cancellation_rate_pct'] / 100)
df['financial_inclusion_index'] = (df['has_bank_account'] + df['has_upi'] + df['has_social_security']) / 3
df['digital_readiness'] = (df['digital_literacy_score_1_5'] + df['has_upi']) / 2

# Income category
df['income_category'] = pd.cut(
    df['monthly_net_income_inr'],
    bins=[0, 5000, 10000, 15000, 20000, 50000],
    labels=['Very Low', 'Low', 'Medium', 'High', 'Very High']
)

print("  Derived features created:")
print("    - income_to_fuel_ratio")
print("    - net_income_per_order")
print("    - emi_burden_ratio")
print("    - savings_rate")
print("    - expense_ratio")
print("    - work_intensity_score")
print("    - productivity_per_hour")
print("    - commitment_score")
print("    - financial_inclusion_index")
print("    - digital_readiness")
print("    - income_category")

# ─── 5. CREATE TRUST TARGET VARIABLE ────────────────────────────
print("\n--- Creating Trust Target Variable ---")

# Composite trust scoring based on multiple signals
df['trust_raw'] = (
    (df['platform_rating_out_of_5'] / 5) * 0.25 +           # Customer rating
    ((100 - df['order_cancellation_rate_pct']) / 100) * 0.20 +  # Low cancellation
    (df['years_on_platform'] / df['years_on_platform'].max()) * 0.15 +  # Tenure
    df['has_bank_account'] * 0.15 +                           # Banking
    df['has_upi'] * 0.10 +                                    # Digital payment
    df['has_social_security'] * 0.10 +                        # Social security
    (df['education_encoded'] / 6) * 0.05                      # Education
)

# Classify into trust categories
df['trust_category'] = pd.cut(
    df['trust_raw'],
    bins=[0, 0.45, 0.65, 1.0],
    labels=['Low Trust', 'Medium Trust', 'High Trust']
)

# Binary target for classification
df['is_high_trust'] = (df['trust_category'] == 'High Trust').astype(int)

print(f"\nTrust Category Distribution:")
print(df['trust_category'].value_counts())
print(f"\nHigh Trust (binary): {df['is_high_trust'].sum()} ({df['is_high_trust'].mean()*100:.1f}%)")

# ─── 6. SAVE CLEANED DATA ───────────────────────────────────────
print("\n--- Saving Cleaned Data ---")
df.to_csv(f"{OUTPUT_DIR}/cleaned_data_with_features.csv", index=False)
print(f"  Saved to: {OUTPUT_DIR}/cleaned_data_with_features.csv")

# ─── 7. SUMMARY STATS ───────────────────────────────────────────
print("\n--- Summary Statistics (Key Numeric Columns) ---")
key_cols = [
    'age_years', 'years_on_platform', 'daily_hours_worked',
    'orders_or_rides_per_day', 'monthly_gross_income_inr',
    'monthly_net_income_inr', 'monthly_fuel_cost_inr',
    'monthly_emi_burden_inr', 'platform_rating_out_of_5',
    'order_cancellation_rate_pct', 'digital_literacy_score_1_5',
    'commitment_score', 'financial_inclusion_index', 'trust_raw'
]
print(df[key_cols].describe().round(2))

print("\n" + "=" * 70)
print("STEP 1 COMPLETE: Data cleaned, features engineered, trust target created")
print("=" * 70)
