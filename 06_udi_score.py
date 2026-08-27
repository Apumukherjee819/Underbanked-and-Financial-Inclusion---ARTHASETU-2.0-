"""
STEP 6: User Vulnerability / Onboarding Difficulty (UDI) Score
Trust Scoring for Credit-Invisible Gig Workers

UDI = w1*L + w2*D + w3*T + w4*E
L = Financial Literacy Score (positive)
D = Digital Literacy Score (positive)
T = Trust Score (positive)
E = Financial Experience Score (positive)

Classification:
  Low UDI    -> Independent onboarding
  Medium UDI -> Assisted onboarding
  High UDI   -> Guided onboarding
"""
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, classification_report
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

OUTPUT_DIR = r"C:\Users\arpam\OneDrive\Desktop\SMART INDIA HACKATHON\appPrototype\gig_trust_score_analysis\outputs"
plt.rcParams['figure.figsize'] = (12, 8)
plt.rcParams['font.size'] = 10
sns.set_style("whitegrid")

print("=" * 70)
print("STEP 6: USER VULNERABILITY / ONBOARDING DIFFICULTY (UDI) SCORE")
print("=" * 70)

# Load final data
df = pd.read_csv(f"{OUTPUT_DIR}/final_trust_scored_data.csv")
print(f"Loaded data: {df.shape}")

# ============================================================
# STEP 1: CONSTRUCT POSITIVE SCORES (L, D, T, E)
# Higher = Better (more capable, less vulnerable)
# ============================================================
print("\n" + "=" * 70)
print("STEP 1: CONSTRUCTING L, D, T, E POSITIVE SCORES")
print("=" * 70)

# --- L: Financial Literacy Score ---
# Components: education level, bank account ownership, UPI usage, social security
print("\n--- L: Financial Literacy Score ---")

# Normalize education (0-1)
edu_min = df['education_encoded'].min()
edu_max = df['education_encoded'].max()
df['L_education'] = (df['education_encoded'] - edu_min) / (edu_max - edu_min)

# Financial inclusion index already 0-1 range
df['L_financial_inclusion'] = df['financial_inclusion_index']

# Bank account + UPI combined (0-1)
df['L_bank_upi'] = (df['has_bank_account'] + df['has_upi']) / 2

# Composite L score (average of components)
df['L_score'] = (df['L_education'] + df['L_financial_inclusion'] + df['L_bank_upi']) / 3

print(f"  L_score - Mean: {df['L_score'].mean():.4f}, Std: {df['L_score'].std():.4f}")
print(f"  Range: [{df['L_score'].min():.4f}, {df['L_score'].max():.4f}]")

# --- D: Digital Literacy Score ---
# Components: digital literacy score, UPI usage, smartphone tier, digital readiness
print("\n--- D: Digital Literacy Score ---")

# Digital literacy (1-5) normalized to 0-1
df['D_literacy'] = (df['digital_literacy_score_1_5'] - 1) / 4

# UPI usage (binary)
df['D_upi'] = df['has_upi']

# Smartphone tier - map to numeric
# Budget < Mid-range < Premium
smartphone_map = {
    'Budget (<₹8,000)': 0,
    'Mid-range (₹8,000–20,000)': 0.5,
    'Premium (>₹20,000)': 1
}
df['D_smartphone'] = df['smartphone_tier'].map(smartphone_map).fillna(0.5)

# Digital readiness already 0-1 range
df['D_readiness'] = df['digital_readiness']

# Composite D score
df['D_score'] = (df['D_literacy'] + df['D_upi'] + df['D_smartphone'] + df['D_readiness']) / 4

print(f"  D_score - Mean: {df['D_score'].mean():.4f}, Std: {df['D_score'].std():.4f}")
print(f"  Range: [{df['D_score'].min():.4f}, {df['D_score'].max():.4f}]")

# --- T: Trust Score ---
# Components: platform rating, commitment score, cancellation rate (inverted)
print("\n--- T: Trust Score ---")

# Platform rating (1-5) normalized to 0-1
df['T_rating'] = (df['platform_rating_out_of_5'] - 1) / 4

# Commitment score (already derived, normalize)
commit_min = df['commitment_score'].min()
commit_max = df['commitment_score'].max()
df['T_commitment'] = (df['commitment_score'] - commit_min) / (commit_max - commit_min)

# Cancellation rate inverted (low cancellation = high trust)
df['T_cancellation'] = 1 - (df['order_cancellation_rate_pct'] / 100)
df['T_cancellation'] = df['T_cancellation'].clip(0, 1)

# Composite T score
df['T_score'] = (df['T_rating'] + df['T_commitment'] + df['T_cancellation']) / 3

print(f"  T_score - Mean: {df['T_score'].mean():.4f}, Std: {df['T_score'].std():.4f}")
print(f"  Range: [{df['T_score'].min():.4f}, {df['T_score'].max():.4f}]")

# --- E: Financial Experience Score ---
# Components: years on platform, bank account, social security, prior occupation
print("\n--- E: Financial Experience Score ---")

# Years on platform (normalize, assume max 10 years)
df['E_tenure'] = (df['years_on_platform'] / 10).clip(0, 1)

# Bank account (binary)
df['E_bank'] = df['has_bank_account']

# Social security (already encoded 0-5, normalize)
df['E_social_security'] = df['social_security_score'] / 5

# Prior occupation - map to experience level
# Unemployed = 0, Daily wage = 0.25, Private/Government = 0.5-0.75, Delivery = 1
occupation_map = {
    'Unemployed (fresh entrant)': 0,
    'Daily wage construction labor': 0.25,
    'Migrant returnee (COVID)': 0.25,
    'Private vehicle driver': 0.5,
    'Government contract worker': 0.75,
    'Delivery (other company)': 1,
    'Small shop owner / vendor': 0.5,
    'Factory / warehouse worker': 0.5
}
df['E_prior_occupation'] = df['prior_occupation'].map(occupation_map).fillna(0.25)

# Composite E score
df['E_score'] = (df['E_tenure'] + df['E_bank'] + df['E_social_security'] + df['E_prior_occupation']) / 4

print(f"  E_score - Mean: {df['E_score'].mean():.4f}, Std: {df['E_score'].std():.4f}")
print(f"  Range: [{df['E_score'].min():.4f}, {df['E_score'].max():.4f}]")

# Summary of component scores
print("\n--- Component Score Summary ---")
component_cols = ['L_score', 'D_score', 'T_score', 'E_score']
print(df[component_cols].describe().round(4))

# ============================================================
# STEP 2: EQUAL-WEIGHT BASELINE
# ============================================================
print("\n" + "=" * 70)
print("STEP 2: EQUAL-WEIGHT BASELINE UDI")
print("=" * 70)

# UDI = w1*L + w2*D + w3*T + w4*E (equal weights)
w_equal = {'L': 0.25, 'D': 0.25, 'T': 0.25, 'E': 0.25}

df['UDI_equal'] = (
    w_equal['L'] * df['L_score'] +
    w_equal['D'] * df['D_score'] +
    w_equal['T'] * df['T_score'] +
    w_equal['E'] * df['E_score']
)

print(f"  Weights: L={w_equal['L']}, D={w_equal['D']}, T={w_equal['T']}, E={w_equal['E']}")
print(f"  UDI_equal - Mean: {df['UDI_equal'].mean():.4f}, Std: {df['UDI_equal'].std():.4f}")
print(f"  Range: [{df['UDI_equal'].min():.4f}, {df['UDI_equal'].max():.4f}]")

# ============================================================
# STEP 3: DATA-DRIVEN WEIGHTING
# ============================================================
print("\n" + "=" * 70)
print("STEP 3: DATA-DRIVEN WEIGHTING METHODS")
print("=" * 70)

# Prepare feature matrix for weighting analysis
X_components = df[['L_score', 'D_score', 'T_score', 'E_score']].copy()
y_trust = df['is_high_trust']

# --- Method A: PCA Factor Analysis ---
print("\n--- Method A: PCA Factor Analysis ---")

pca = PCA(n_components=1, random_state=42)
udi_pca_raw = pca.fit_transform(X_components)
df['UDI_pca'] = MinMaxScaler().fit_transform(udi_pca_raw)

# PCA loadings as weights
pca_loadings = pca.components_[0]
pca_weights = {
    'L': abs(pca_loadings[0]),
    'D': abs(pca_loadings[1]),
    'T': abs(pca_loadings[2]),
    'E': abs(pca_loadings[3])
}
# Normalize to sum to 1
total = sum(pca_weights.values())
pca_weights = {k: v/total for k, v in pca_weights.items()}

print(f"  PCA Loadings: L={pca_loadings[0]:.4f}, D={pca_loadings[1]:.4f}, T={pca_loadings[2]:.4f}, E={pca_loadings[3]:.4f}")
print(f"  PCA Weights (normalized): L={pca_weights['L']:.4f}, D={pca_weights['D']:.4f}, T={pca_weights['T']:.4f}, E={pca_weights['E']:.4f}")
print(f"  Variance Explained: {pca.explained_variance_ratio_[0]*100:.2f}%")
print(f"  UDI_pca - Mean: {df['UDI_pca'].mean():.4f}, Std: {df['UDI_pca'].std():.4f}")

# --- Method B: Logistic Regression Coefficients ---
print("\n--- Method B: Logistic Regression Coefficients ---")

X_train, X_test, y_train, y_test = train_test_split(
    X_components, y_trust, test_size=0.2, random_state=42, stratify=y_trust
)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

lr = LogisticRegression(max_iter=1000, random_state=42)
lr.fit(X_train_scaled, y_train)

# Coefficients as weights (higher coefficient = more predictive)
lr_coefs = lr.coef_[0]
lr_weights = {
    'L': abs(lr_coefs[0]),
    'D': abs(lr_coefs[1]),
    'T': abs(lr_coefs[2]),
    'E': abs(lr_coefs[3])
}
total = sum(lr_weights.values())
lr_weights = {k: v/total for k, v in lr_weights.items()}

# UDI using LR weights (invert: higher component score = lower vulnerability)
df['UDI_lr'] = (
    lr_weights['L'] * df['L_score'] +
    lr_weights['D'] * df['D_score'] +
    lr_weights['T'] * df['T_score'] +
    lr_weights['E'] * df['E_score']
)

# Evaluate LR model
y_prob_lr = lr.predict_proba(X_test)[:, 1]
lr_auc = roc_auc_score(y_test, y_prob_lr)

print(f"  LR Coefficients: L={lr_coefs[0]:.4f}, D={lr_coefs[1]:.4f}, T={lr_coefs[2]:.4f}, E={lr_coefs[3]:.4f}")
print(f"  LR Weights (normalized): L={lr_weights['L']:.4f}, D={lr_weights['D']:.4f}, T={lr_weights['T']:.4f}, E={lr_weights['E']:.4f}")
print(f"  LR Model AUC: {lr_auc:.4f}")
print(f"  UDI_lr - Mean: {df['UDI_lr'].mean():.4f}, Std: {df['UDI_lr'].std():.4f}")

# --- Method C: Random Forest Feature Importance ---
print("\n--- Method C: Random Forest Feature Importance ---")

rf = RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42, n_jobs=-1)
rf.fit(X_train, y_train)

rf_importance = rf.feature_importances_
rf_weights = {
    'L': rf_importance[0],
    'D': rf_importance[1],
    'T': rf_importance[2],
    'E': rf_importance[3]
}
total = sum(rf_weights.values())
rf_weights = {k: v/total for k, v in rf_weights.items()}

# UDI using RF weights
df['UDI_rf'] = (
    rf_weights['L'] * df['L_score'] +
    rf_weights['D'] * df['D_score'] +
    rf_weights['T'] * df['T_score'] +
    rf_weights['E'] * df['E_score']
)

# Evaluate RF model
y_prob_rf = rf.predict_proba(X_test)[:, 1]
rf_auc = roc_auc_score(y_test, y_prob_rf)

print(f"  RF Importances: L={rf_importance[0]:.4f}, D={rf_importance[1]:.4f}, T={rf_importance[2]:.4f}, E={rf_importance[3]:.4f}")
print(f"  RF Weights (normalized): L={rf_weights['L']:.4f}, D={rf_weights['D']:.4f}, T={rf_weights['T']:.4f}, E={rf_weights['E']:.4f}")
print(f"  RF Model AUC: {rf_auc:.4f}")
print(f"  UDI_rf - Mean: {df['UDI_rf'].mean():.4f}, Std: {df['UDI_rf'].std():.4f}")

# ============================================================
# STEP 3.5: COMPARE ALL 3 METHODS AND PICK THE BEST
# ============================================================
print("\n" + "=" * 70)
print("STEP 3.5: COMPARING ALL 3 WEIGHTING METHODS")
print("=" * 70)

# Compare correlation with trust score
methods = ['UDI_equal', 'UDI_pca', 'UDI_lr', 'UDI_rf']
correlations = {}
for method in methods:
    corr, pval = stats.spearmanr(df[method], df['trust_raw'])
    correlations[method] = {'spearman_r': corr, 'p_value': pval}
    print(f"  {method:15s} vs trust_raw: Spearman r={corr:+.4f}, p={pval:.2e}")

# Compare ability to separate trust categories
print("\n--- Trust Category Separation (ANOVA F-statistic) ---")
for method in methods:
    groups = [group[method].values for name, group in df.groupby('trust_category')]
    f_stat, p_val = stats.f_oneway(*groups)
    print(f"  {method:15s} ~ trust_category: F={f_stat:.4f}, p={p_val:.2e}")

# Pick best method (highest absolute correlation with trust)
best_method = max(correlations.keys(), key=lambda x: abs(correlations[x]['spearman_r']))
print(f"\n  >>> BEST METHOD: {best_method} (Spearman r={correlations[best_method]['spearman_r']:+.4f})")

# Create the final UDI score column
df['UDI_score'] = df[best_method]

# Print best weights
if best_method == 'UDI_equal':
    best_weights = w_equal
elif best_method == 'UDI_pca':
    best_weights = pca_weights
elif best_method == 'UDI_lr':
    best_weights = lr_weights
else:
    best_weights = rf_weights

print(f"\n  Best Weights: L={best_weights['L']:.4f}, D={best_weights['D']:.4f}, T={best_weights['T']:.4f}, E={best_weights['E']:.4f}")

# ============================================================
# STEP 4: CLASSIFY USERS INTO ONBOARDING CATEGORIES
# ============================================================
print("\n" + "=" * 70)
print("STEP 4: ONBOARDING CLASSIFICATION")
print("=" * 70)

# Classification based on UDI score percentiles
# Low UDI (0-0.3) -> Independent onboarding
# Medium UDI (0.3-0.6) -> Assisted onboarding
# High UDI (0.6-1.0) -> Guided onboarding

# Use data-driven thresholds based on distribution
q33 = df['UDI_score'].quantile(0.33)
q66 = df['UDI_score'].quantile(0.66)

print(f"  Thresholds: q33={q33:.4f}, q66={q66:.4f}")

def classify_onboarding(udi_score):
    if udi_score <= q33:
        return 'Independent'
    elif udi_score <= q66:
        return 'Assisted'
    else:
        return 'Guided'

df['onboarding_category'] = df['UDI_score'].apply(classify_onboarding)

print(f"\n  Onboarding Category Distribution:")
onboarding_dist = df['onboarding_category'].value_counts()
for cat, count in onboarding_dist.items():
    pct = count / len(df) * 100
    print(f"    {cat:15s}: {count:6d} ({pct:.1f}%)")

# ============================================================
# STEP 5: VISUALIZATIONS
# ============================================================
print("\n" + "=" * 70)
print("STEP 5: VISUALIZATIONS")
print("=" * 70)

# --- Plot 1: UDI Score Distribution ---
fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# Histogram
axes[0].hist(df['UDI_score'], bins=50, color='steelblue', edgecolor='black', alpha=0.7)
axes[0].set_title('UDI Score Distribution (Best Method)')
axes[0].set_xlabel('UDI Score (Higher = More Capable)')
axes[0].set_ylabel('Frequency')
axes[0].axvline(df['UDI_score'].mean(), color='red', linestyle='--',
                label=f'Mean: {df["UDI_score"].mean():.3f}')
axes[0].axvline(q33, color='orange', linestyle='--', label=f'q33: {q33:.3f}')
axes[0].axvline(q66, color='green', linestyle='--', label=f'q66: {q66:.3f}')
axes[0].legend()

# Box plot by onboarding category
sns.boxplot(data=df, x='onboarding_category', y='UDI_score',
            order=['Independent', 'Assisted', 'Guided'],
            palette=['#6bcb77', '#ffd93d', '#ff6b6b'], ax=axes[1])
axes[1].set_title('UDI Score by Onboarding Category')
axes[1].set_xlabel('Onboarding Category')
axes[1].set_ylabel('UDI Score')

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/24_udi_score_distribution.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 24_udi_score_distribution.png")

# --- Plot 2: L, D, T, E Component Radar Chart ---
fig, axes = plt.subplots(2, 4, figsize=(22, 12), subplot_kw=dict(polar=True))
axes = axes.flatten()

categories = ['Financial\nLiteracy (L)', 'Digital\nLiteracy (D)', 'Trust\n(T)', 'Financial\nExperience (E)']
N = len(categories)
angles = [n / float(N) * 2 * np.pi for n in range(N)]
angles += angles[:1]

# Overall average
overall_means = [df['L_score'].mean(), df['D_score'].mean(),
                 df['T_score'].mean(), df['E_score'].mean()]
overall_means += overall_means[:1]
axes[0].plot(angles, overall_means, 'o-', linewidth=2, color='steelblue')
axes[0].fill(angles, overall_means, alpha=0.25, color='steelblue')
axes[0].set_xticks(angles[:-1])
axes[0].set_xticklabels(categories)
axes[0].set_title('Overall Average', fontsize=12, fontweight='bold')
axes[0].set_ylim(0, 1)

# By onboarding category
onboarding_cats = ['Independent', 'Assisted', 'Guided']
colors = ['#6bcb77', '#ffd93d', '#ff6b6b']

for i, (cat, color) in enumerate(zip(onboarding_cats, colors)):
    subset = df[df['onboarding_category'] == cat]
    means = [subset['L_score'].mean(), subset['D_score'].mean(),
             subset['T_score'].mean(), subset['E_score'].mean()]
    means += means[:1]
    axes[i+1].plot(angles, means, 'o-', linewidth=2, color=color)
    axes[i+1].fill(angles, means, alpha=0.25, color=color)
    axes[i+1].set_xticks(angles[:-1])
    axes[i+1].set_xticklabels(categories)
    axes[i+1].set_title(f'{cat} Onboarding', fontsize=12, fontweight='bold', color=color)
    axes[i+1].set_ylim(0, 1)

# By trust category
trust_cats = ['Low Trust', 'Medium Trust', 'High Trust']
trust_colors = ['#ff6b6b', '#ffd93d', '#6bcb77']

for i, (cat, color) in enumerate(zip(trust_cats, trust_colors)):
    subset = df[df['trust_category'] == cat]
    means = [subset['L_score'].mean(), subset['D_score'].mean(),
             subset['T_score'].mean(), subset['E_score'].mean()]
    means += means[:1]
    axes[4+i].plot(angles, means, 'o-', linewidth=2, color=color)
    axes[4+i].fill(angles, means, alpha=0.25, color=color)
    axes[4+i].set_xticks(angles[:-1])
    axes[4+i].set_xticklabels(categories)
    axes[4+i].set_title(f'{cat}', fontsize=12, fontweight='bold', color=color)
    axes[4+i].set_ylim(0, 1)

# Hide unused subplot
axes[7].set_visible(False)

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/25_udi_radar_components.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 25_udi_radar_components.png")

# --- Plot 3: UDI Score vs Trust Score Scatter ---
fig, axes = plt.subplots(1, 2, figsize=(16, 6))

# Scatter with trust category colors
trust_map = {'Low Trust': 0, 'Medium Trust': 1, 'High Trust': 2}
df['trust_numeric'] = df['trust_category'].map(trust_map)

scatter = axes[0].scatter(df['UDI_score'], df['trust_score_ensemble'],
                          c=df['trust_numeric'], cmap='RdYlGn', alpha=0.3, s=5)
axes[0].set_title('UDI Score vs Trust Score')
axes[0].set_xlabel('UDI Score (Higher = More Capable)')
axes[0].set_ylabel('Trust Score')
plt.colorbar(scatter, ax=axes[0], label='Trust Level')

# Correlation annotation
r, p = stats.spearmanr(df['UDI_score'], df['trust_score_ensemble'])
axes[0].text(0.05, 0.95, f'Spearman r = {r:.3f}\np = {p:.2e}',
             transform=axes[0].transAxes, verticalalignment='top',
             bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))

# Scatter with onboarding category colors
onboarding_map = {'Independent': 0, 'Assisted': 1, 'Guided': 2}
df['onboarding_numeric'] = df['onboarding_category'].map(onboarding_map)

scatter2 = axes[1].scatter(df['UDI_score'], df['trust_score_ensemble'],
                           c=df['onboarding_numeric'], cmap='RdYlGn_r', alpha=0.3, s=5)
axes[1].set_title('UDI Score vs Trust Score (by Onboarding)')
axes[1].set_xlabel('UDI Score (Higher = More Capable)')
axes[1].set_ylabel('Trust Score')
plt.colorbar(scatter2, ax=axes[1], label='Onboarding Level')

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/26_udi_vs_trust_scatter.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 26_udi_vs_trust_scatter.png")

# --- Plot 4: Onboarding Category Pie Chart ---
fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# Pie chart
onboarding_counts = df['onboarding_category'].value_counts()
axes[0].pie(onboarding_counts.values, labels=onboarding_counts.index,
            autopct='%1.1f%%', colors=['#6bcb77', '#ffd93d', '#ff6b6b'],
            startangle=90)
axes[0].set_title('Onboarding Category Distribution')

# Trust category by onboarding (stacked bar)
ct = pd.crosstab(df['onboarding_category'], df['trust_category'], normalize='index') * 100
ct = ct.reindex(['Independent', 'Assisted', 'Guided'])
ct[['Low Trust', 'Medium Trust', 'High Trust']].plot(
    kind='bar', stacked=True, ax=axes[1], colormap='RdYlGn', edgecolor='black')
axes[1].set_title('Trust Category by Onboarding Category')
axes[1].set_xlabel('Onboarding Category')
axes[1].set_ylabel('Percentage (%)')
axes[1].tick_params(axis='x', rotation=0)
axes[1].legend(title='Trust Category')

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/27_udi_onboarding_pie.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 27_udi_onboarding_pie.png")

# --- Plot 5: Weighting Method Comparison ---
fig, axes = plt.subplots(1, 2, figsize=(16, 6))

# Bar chart of weights by method
methods_names = ['Equal', 'PCA', 'Logistic Reg', 'Random Forest']
weight_data = {
    'L': [w_equal['L'], pca_weights['L'], lr_weights['L'], rf_weights['L']],
    'D': [w_equal['D'], pca_weights['D'], lr_weights['D'], rf_weights['D']],
    'T': [w_equal['T'], pca_weights['T'], lr_weights['T'], rf_weights['T']],
    'E': [w_equal['E'], pca_weights['E'], lr_weights['E'], rf_weights['E']]
}

x = np.arange(len(methods_names))
width = 0.2

axes[0].bar(x - 1.5*width, weight_data['L'], width, label='L (Financial Literacy)', color='#2196F3')
axes[0].bar(x - 0.5*width, weight_data['D'], width, label='D (Digital Literacy)', color='#4CAF50')
axes[0].bar(x + 0.5*width, weight_data['T'], width, label='T (Trust)', color='#FF9800')
axes[0].bar(x + 1.5*width, weight_data['E'], width, label='E (Experience)', color='#E91E63')
axes[0].set_xlabel('Weighting Method')
axes[0].set_ylabel('Weight')
axes[0].set_title('UDI Weights by Method')
axes[0].set_xticks(x)
axes[0].set_xticklabels(methods_names)
axes[0].legend()

# Correlation with trust by method
method_labels = ['Equal', 'PCA', 'LR', 'RF']
corr_values = [abs(correlations[m]['spearman_r']) for m in methods]
colors = ['#6bcb77' if m == best_method else '#999' for m in methods]
axes[1].bar(method_labels, corr_values, color=colors, edgecolor='black')
axes[1].set_xlabel('Weighting Method')
axes[1].set_ylabel('|Spearman r| with Trust Score')
axes[1].set_title('Method Comparison (Higher = Better)')
axes[1].axhline(y=max(corr_values), color='red', linestyle='--', alpha=0.5)

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/28_udi_weight_comparison.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 28_udi_weight_comparison.png")

# --- Plot 6: UDI Component Distribution by Onboarding ---
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

components = [('L_score', 'Financial Literacy (L)'), ('D_score', 'Digital Literacy (D)'),
              ('T_score', 'Trust (T)'), ('E_score', 'Financial Experience (E)')]

for ax, (col, title) in zip(axes.flatten(), components):
    sns.boxplot(data=df, x='onboarding_category', y=col,
                order=['Independent', 'Assisted', 'Guided'],
                palette=['#6bcb77', '#ffd93d', '#ff6b6b'], ax=ax)
    ax.set_title(f'{title} by Onboarding Category')
    ax.set_xlabel('Onboarding Category')
    ax.set_ylabel('Score')

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/29_udi_components_boxplot.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 29_udi_components_boxplot.png")

# ============================================================
# STEP 6: VALIDATION - UDI vs TRUST CORRELATION
# ============================================================
print("\n" + "=" * 70)
print("STEP 6: VALIDATION - UDI vs TRUST CORRELATION")
print("=" * 70)

# --- Correlation Tests ---
print("\n--- Spearman Correlation: UDI_score vs trust_raw ---")
r, p = stats.spearmanr(df['UDI_score'], df['trust_raw'])
print(f"  Spearman r = {r:+.4f}, p = {p:.2e}")
print(f"  Interpretation: {'Strong' if abs(r) > 0.7 else 'Moderate' if abs(r) > 0.4 else 'Weak'} {'positive' if r > 0 else 'negative'} correlation")

print("\n--- Spearman Correlation: UDI_score vs trust_score_ensemble ---")
r2, p2 = stats.spearmanr(df['UDI_score'], df['trust_score_ensemble'])
print(f"  Spearman r = {r2:+.4f}, p = {p2:.2e}")

# --- ANOVA: UDI by Trust Category ---
print("\n--- ANOVA: UDI_score by Trust Category ---")
groups = [group['UDI_score'].values for name, group in df.groupby('trust_category')]
f_stat, p_val = stats.f_oneway(*groups)
print(f"  F-statistic = {f_stat:.4f}, p = {p_val:.2e}")
print(f"  Result: {'Significant' if p_val < 0.05 else 'Not Significant'} difference across trust categories")

# --- Mean UDI by Trust Category ---
print("\n--- Mean UDI Score by Trust Category ---")
for cat in ['Low Trust', 'Medium Trust', 'High Trust']:
    subset = df[df['trust_category'] == cat]
    print(f"  {cat:15s}: Mean UDI = {subset['UDI_score'].mean():.4f} (+/- {subset['UDI_score'].std():.4f})")

# --- Mean UDI by Onboarding Category ---
print("\n--- Mean UDI Score by Onboarding Category ---")
for cat in ['Independent', 'Assisted', 'Guided']:
    subset = df[df['onboarding_category'] == cat]
    print(f"  {cat:15s}: Mean UDI = {subset['UDI_score'].mean():.4f} (+/- {subset['UDI_score'].std():.4f})")

# --- Cross-tabulation: Onboarding vs Trust ---
print("\n--- Cross-Tabulation: Onboarding Category vs Trust Category ---")
cross_tab = pd.crosstab(df['onboarding_category'], df['trust_category'], margins=True)
print(cross_tab)

print("\n--- Cross-Tabulation (Normalized by Row) ---")
cross_tab_norm = pd.crosstab(df['onboarding_category'], df['trust_category'], normalize='index') * 100
print(cross_tab_norm.round(2))

# --- Chi-Square Test ---
print("\n--- Chi-Square Test: Onboarding Category ~ Trust Category ---")
contingency = pd.crosstab(df['onboarding_category'], df['trust_category'])
chi2, p_chi, dof, expected = stats.chi2_contingency(contingency)
cramers_v = np.sqrt(chi2 / (len(df) * (min(contingency.shape) - 1)))
print(f"  chi2 = {chi2:.4f}, p = {p_chi:.2e}, dof = {dof}")
print(f"  Cramer's V = {cramers_v:.4f}")
print(f"  Interpretation: {'Strong' if cramers_v > 0.5 else 'Moderate' if cramers_v > 0.3 else 'Weak'} association")

# ============================================================
# STEP 7: SAVE RESULTS
# ============================================================
print("\n" + "=" * 70)
print("STEP 7: SAVING RESULTS")
print("=" * 70)

# Save UDI scores to final_trust_scored_data.csv
# Keep only the final UDI columns
udi_columns = ['UDI_score', 'UDI_equal', 'UDI_pca', 'UDI_lr', 'UDI_rf',
                'L_score', 'D_score', 'T_score', 'E_score',
                'onboarding_category']

# Add to existing dataframe
for col in udi_columns:
    df[col] = df[col]

# Save
df.to_csv(f"{OUTPUT_DIR}/final_trust_scored_data.csv", index=False)
print(f"  Saved: final_trust_scored_data.csv (with UDI scores)")

# Also save a summary CSV
summary_data = {
    'Method': ['Equal Weight', 'PCA', 'Logistic Regression', 'Random Forest', f'Best: {best_method}'],
    'L_weight': [w_equal['L'], pca_weights['L'], lr_weights['L'], rf_weights['L'], best_weights['L']],
    'D_weight': [w_equal['D'], pca_weights['D'], lr_weights['D'], rf_weights['D'], best_weights['D']],
    'T_weight': [w_equal['T'], pca_weights['T'], lr_weights['T'], rf_weights['T'], best_weights['T']],
    'E_weight': [w_equal['E'], pca_weights['E'], lr_weights['E'], rf_weights['E'], best_weights['E']],
    'Spearman_r': [correlations[m]['spearman_r'] for m in methods] + [correlations[best_method]['spearman_r']],
    'Abs_Spearman_r': [abs(correlations[m]['spearman_r']) for m in methods] + [abs(correlations[best_method]['spearman_r'])]
}
summary_df = pd.DataFrame(summary_data)
summary_df.to_csv(f"{OUTPUT_DIR}/udi_weight_comparison.csv", index=False)
print(f"  Saved: udi_weight_comparison.csv")

# ============================================================
# FINAL SUMMARY
# ============================================================
print("\n" + "=" * 70)
print("UDI SCORE - FINAL SUMMARY")
print("=" * 70)

print(f"\n  Data: {df.shape[0]} workers")
print(f"  Components: L (Financial Literacy), D (Digital Literacy), T (Trust), E (Experience)")
print(f"  Best Weighting Method: {best_method}")
print(f"  Best Weights: L={best_weights['L']:.4f}, D={best_weights['D']:.4f}, T={best_weights['T']:.4f}, E={best_weights['E']:.4f}")

print(f"\n  UDI Score Statistics:")
print(f"    Mean: {df['UDI_score'].mean():.4f}")
print(f"    Std: {df['UDI_score'].std():.4f}")
print(f"    Min: {df['UDI_score'].min():.4f}")
print(f"    Max: {df['UDI_score'].max():.4f}")

print(f"\n  Onboarding Categories:")
for cat in ['Independent', 'Assisted', 'Guided']:
    count = (df['onboarding_category'] == cat).sum()
    pct = count / len(df) * 100
    mean_trust = df[df['onboarding_category'] == cat]['trust_score_ensemble'].mean()
    print(f"    {cat:15s}: {count:6d} ({pct:.1f}%) - Mean Trust: {mean_trust:.4f}")

print(f"\n  Validation:")
print(f"    UDI vs Trust Score: Spearman r = {r2:+.4f} (p = {p2:.2e})")
print(f"    UDI vs Trust Category: F = {f_stat:.4f} (p = {p_val:.2e})")
print(f"    Onboarding vs Trust: chi2 = {chi2:.4f}, Cramer's V = {cramers_v:.4f}")

print(f"\n  Plots Generated:")
print(f"    24_udi_score_distribution.png")
print(f"    25_udi_radar_components.png")
print(f"    26_udi_vs_trust_scatter.png")
print(f"    27_udi_onboarding_pie.png")
print(f"    28_udi_weight_comparison.png")
print(f"    29_udi_components_boxplot.png")

print(f"\n  Files Generated:")
print(f"    final_trust_scored_data.csv (with UDI scores)")
print(f"    udi_weight_comparison.csv")

print("\n" + "=" * 70)
print("STEP 6 COMPLETE: UDI Score computed, classified, validated, and saved")
print("=" * 70)
