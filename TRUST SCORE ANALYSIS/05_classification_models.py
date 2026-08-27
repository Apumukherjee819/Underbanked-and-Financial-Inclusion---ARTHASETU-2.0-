"""
STEP 5: Classification Models for Trust Scoring
Trust Scoring for Credit-Invisible Gig Workers
"""
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (classification_report, confusion_matrix, roc_curve,
                             auc, precision_recall_curve, average_precision_score)
from xgboost import XGBClassifier
import warnings
warnings.filterwarnings('ignore')

OUTPUT_DIR = r"C:\Users\arpam\gig_trust_score_analysis\outputs"
plt.rcParams['figure.figsize'] = (10, 8)
plt.rcParams['font.size'] = 10
sns.set_style("whitegrid")

print("=" * 70)
print("STEP 5: CLASSIFICATION MODELS FOR TRUST SCORING")
print("=" * 70)

df = pd.read_csv(f"{OUTPUT_DIR}/clustered_data.csv")

# ─── 5.1 PREPARE FEATURES ───────────────────────────────────────
print("\n--- 5.1 Feature Preparation ---")

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
    'income_to_fuel_ratio', 'emi_burden_ratio', 'savings_rate',
    'expense_ratio', 'work_intensity_score', 'productivity_per_hour',
    'commitment_score', 'financial_inclusion_index', 'digital_readiness'
]

X = df[feature_cols].fillna(0)
y = df['is_high_trust']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print(f"  Training set: {X_train.shape[0]} samples")
print(f"  Test set: {X_test.shape[0]} samples")
print(f"  Features: {X_train.shape[1]}")
print(f"  High Trust (train): {y_train.sum()} ({y_train.mean()*100:.1f}%)")
print(f"  High Trust (test): {y_test.sum()} ({y_test.mean()*100:.1f}%)")

# ─── 5.2 MODEL TRAINING ─────────────────────────────────────────
print("\n--- 5.2 Model Training ---")

models = {
    'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42, class_weight='balanced'),
    'Random Forest': RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42,
                                            class_weight='balanced', n_jobs=-1),
    'Gradient Boosting': GradientBoostingClassifier(n_estimators=200, max_depth=5, random_state=42,
                                                    learning_rate=0.1),
    'XGBoost': XGBClassifier(n_estimators=200, max_depth=6, learning_rate=0.1,
                             random_state=42, use_label_encoder=False, eval_metric='logloss',
                             scale_pos_weight=(len(y_train) - y_train.sum()) / y_train.sum())
}

results = {}
for name, model in models.items():
    print(f"\n  Training {name}...")
    if name in ['Logistic Regression']:
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
        y_prob = model.predict_proba(X_test_scaled)[:, 1]
    else:
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:, 1]

    # Cross-validation
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    if name in ['Logistic Regression']:
        cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=cv, scoring='roc_auc')
    else:
        cv_scores = cross_val_score(model, X_train, y_train, cv=cv, scoring='roc_auc')

    # Metrics
    fpr, tpr, _ = roc_curve(y_test, y_prob)
    roc_auc_val = auc(fpr, tpr)
    precision, recall, _ = precision_recall_curve(y_test, y_prob)
    avg_precision = average_precision_score(y_test, y_prob)

    results[name] = {
        'model': model,
        'y_pred': y_pred,
        'y_prob': y_prob,
        'roc_auc': roc_auc_val,
        'avg_precision': avg_precision,
        'cv_mean': cv_scores.mean(),
        'cv_std': cv_scores.std(),
        'fpr': fpr,
        'tpr': tpr,
        'precision_curve': precision,
        'recall_curve': recall
    }

    print(f"    CV ROC-AUC: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
    print(f"    Test ROC-AUC: {roc_auc_val:.4f}")
    print(f"    Avg Precision: {avg_precision:.4f}")

# ─── 5.3 MODEL COMPARISON ───────────────────────────────────────
print("\n--- 5.3 Model Comparison ---")
comparison_df = pd.DataFrame({
    'Model': list(results.keys()),
    'CV ROC-AUC (mean)': [results[m]['cv_mean'] for m in results],
    'CV ROC-AUC (std)': [results[m]['cv_std'] for m in results],
    'Test ROC-AUC': [results[m]['roc_auc'] for m in results],
    'Avg Precision': [results[m]['avg_precision'] for m in results]
})
print(comparison_df.to_string(index=False))

# ─── 5.4 ROC CURVES ─────────────────────────────────────────────
print("\n--- 5.4 ROC Curves ---")
fig, axes = plt.subplots(1, 2, figsize=(16, 6))

colors = ['#2196F3', '#4CAF50', '#FF9800', '#E91E63']
for i, (name, res) in enumerate(results.items()):
    axes[0].plot(res['fpr'], res['tpr'], color=colors[i], linewidth=2,
                 label=f"{name} (AUC={res['roc_auc']:.3f})")

axes[0].plot([0, 1], [0, 1], 'k--', linewidth=1, label='Random')
axes[0].set_xlabel('False Positive Rate')
axes[0].set_ylabel('True Positive Rate')
axes[0].set_title('ROC Curves - Trust Classification Models')
axes[0].legend(loc='lower right')
axes[0].grid(True)

# Precision-Recall curves
for i, (name, res) in enumerate(results.items()):
    axes[1].plot(res['recall_curve'], res['precision_curve'], color=colors[i], linewidth=2,
                 label=f"{name} (AP={res['avg_precision']:.3f})")

axes[1].set_xlabel('Recall')
axes[1].set_ylabel('Precision')
axes[1].set_title('Precision-Recall Curves')
axes[1].legend(loc='lower left')
axes[1].grid(True)

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/19_roc_precision_curves.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 19_roc_precision_curves.png")

# ─── 5.5 CONFUSION MATRICES ─────────────────────────────────────
print("\n--- 5.5 Confusion Matrices ---")
fig, axes = plt.subplots(1, 4, figsize=(20, 5))

for i, (name, res) in enumerate(results.items()):
    cm = confusion_matrix(y_test, res['y_pred'])
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=axes[i],
                xticklabels=['Low/Med', 'High'], yticklabels=['Low/Med', 'High'])
    axes[i].set_title(f'{name}')
    axes[i].set_xlabel('Predicted')
    axes[i].set_ylabel('Actual')

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/20_confusion_matrices.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 20_confusion_matrices.png")

# ─── 5.6 CLASSIFICATION REPORTS ─────────────────────────────────
print("\n--- 5.6 Classification Reports ---")
for name, res in results.items():
    print(f"\n  {name}:")
    print(classification_report(y_test, res['y_pred'], target_names=['Low/Med Trust', 'High Trust']))

# ─── 5.7 FEATURE IMPORTANCE (RANDOM FOREST & XGBOOST) ──────────
print("\n--- 5.7 Feature Importance ---")

fig, axes = plt.subplots(1, 2, figsize=(16, 10))

# Random Forest
rf_importance = pd.Series(
    results['Random Forest']['model'].feature_importances_,
    index=feature_cols
).sort_values(ascending=True)
rf_importance.tail(15).plot(kind='barh', ax=axes[0], color='steelblue', edgecolor='black')
axes[0].set_title('Random Forest - Top 15 Feature Importance')
axes[0].set_xlabel('Importance')

# XGBoost
xgb_importance = pd.Series(
    results['XGBoost']['model'].feature_importances_,
    index=feature_cols
).sort_values(ascending=True)
xgb_importance.tail(15).plot(kind='barh', ax=axes[1], color='coral', edgecolor='black')
axes[1].set_title('XGBoost - Top 15 Feature Importance')
axes[1].set_xlabel('Importance')

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/21_feature_importance.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 21_feature_importance.png")

# Print top 10 features
print("\n  Top 10 Features (Random Forest):")
for feat, imp in rf_importance.nlargest(10).items():
    print(f"    {feat:40s}: {imp:.4f}")

print("\n  Top 10 Features (XGBoost):")
for feat, imp in xgb_importance.nlargest(10).items():
    print(f"    {feat:40s}: {imp:.4f}")

# ─── 5.8 LOGISTIC REGRESSION COEFFICIENTS ───────────────────────
print("\n--- 5.8 Logistic Regression Coefficients ---")
lr_model = results['Logistic Regression']['model']
lr_coefs = pd.Series(lr_model.coef_[0], index=feature_cols).sort_values(ascending=False)

fig, ax = plt.subplots(figsize=(12, 8))
colors = ['green' if c > 0 else 'red' for c in lr_coefs.values]
lr_coefs.plot(kind='barh', ax=ax, color=colors, edgecolor='black')
ax.set_title('Logistic Regression Coefficients (Trust Prediction)', fontsize=14)
ax.set_xlabel('Coefficient Value')
ax.axvline(x=0, color='black', linewidth=0.5)
plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/22_logistic_coefficients.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 22_logistic_coefficients.png")

print("\n  Top Positive Coefficients (increase trust):")
for feat, coef in lr_coefs.nlargest(5).items():
    print(f"    {feat:40s}: {coef:+.4f}")

print("\n  Top Negative Coefficients (decrease trust):")
for feat, coef in lr_coefs.nsmallest(5).items():
    print(f"    {feat:40s}: {coef:+.4f}")

# ─── 5.9 TRUST SCORE GENERATION ─────────────────────────────────
print("\n--- 5.9 Trust Score Generation ---")

# Use best model (XGBoost) to generate trust scores for all workers
best_model = results['XGBoost']['model']
X_all = df[feature_cols].fillna(0)
df['trust_score_xgb'] = best_model.predict_proba(X_all)[:, 1]

# Also use Logistic Regression for interpretability
lr_full = results['Logistic Regression']['model']
X_all_scaled = scaler.fit_transform(X)
df['trust_score_lr'] = lr_full.predict_proba(X_all_scaled)[:, 1]

# Combined trust score (ensemble)
df['trust_score_ensemble'] = (df['trust_score_xgb'] + df['trust_score_lr']) / 2

print(f"  Trust Score Statistics:")
print(f"    Mean: {df['trust_score_ensemble'].mean():.4f}")
print(f"    Median: {df['trust_score_ensemble'].median():.4f}")
print(f"    Std: {df['trust_score_ensemble'].std():.4f}")
print(f"    Min: {df['trust_score_ensemble'].min():.4f}")
print(f"    Max: {df['trust_score_ensemble'].max():.4f}")

# Trust score distribution
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

axes[0].hist(df['trust_score_ensemble'], bins=50, color='steelblue', edgecolor='black', alpha=0.7)
axes[0].set_title('Trust Score Distribution (Ensemble)')
axes[0].set_xlabel('Trust Score')
axes[0].set_ylabel('Frequency')
axes[0].axvline(df['trust_score_ensemble'].mean(), color='red', linestyle='--',
                label=f'Mean: {df["trust_score_ensemble"].mean():.3f}')
axes[0].legend()

sns.boxplot(data=df, x='trust_category', y='trust_score_ensemble',
            order=['Low Trust', 'Medium Trust', 'High Trust'], ax=axes[1],
            palette=['#ff6b6b', '#ffd93d', '#6bcb77'])
axes[1].set_title('Trust Score by Trust Category')
axes[1].set_xlabel('Trust Category')
axes[1].set_ylabel('Trust Score')

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/23_trust_score_distribution.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 23_trust_score_distribution.png")

# ─── 5.10 TRUST SEGMENTS ────────────────────────────────────────
print("\n--- 5.10 Trust Segments ---")
df['trust_segment'] = pd.cut(
    df['trust_score_ensemble'],
    bins=[0, 0.3, 0.5, 0.7, 1.0],
    labels=['Very Low', 'Low', 'Medium', 'High']
)

print(f"\n  Trust Segment Distribution:")
print(df['trust_segment'].value_counts().sort_index())

# Segment profiles
print("\n  Segment Profiles (Mean Values):")
segment_profiles = df.groupby('trust_segment')[
    ['monthly_net_income_inr', 'platform_rating_out_of_5', 'years_on_platform',
     'daily_hours_worked', 'digital_literacy_score_1_5', 'order_cancellation_rate_pct']
].mean()
print(segment_profiles.round(2))

# ─── 5.11 SAVE FINAL RESULTS ────────────────────────────────────
print("\n--- 5.11 Saving Final Results ---")

# Save with trust scores
df.to_csv(f"{OUTPUT_DIR}/final_trust_scored_data.csv", index=False)
print(f"  Saved: final_trust_scored_data.csv")

# Save model comparison
comparison_df.to_csv(f"{OUTPUT_DIR}/model_comparison.csv", index=False)
print(f"  Saved: model_comparison.csv")

# Save feature importances
importance_df = pd.DataFrame({
    'Feature': feature_cols,
    'RF_Importance': results['Random Forest']['model'].feature_importances_,
    'XGB_Importance': results['XGBoost']['model'].feature_importances_,
    'LR_Coefficient': lr_model.coef_[0]
})
importance_df = importance_df.sort_values('XGB_Importance', ascending=False)
importance_df.to_csv(f"{OUTPUT_DIR}/feature_importances.csv", index=False)
print(f"  Saved: feature_importances.csv")

print("\n" + "=" * 70)
print("STEP 5 COMPLETE: Classification models and trust scores generated")
print("=" * 70)
