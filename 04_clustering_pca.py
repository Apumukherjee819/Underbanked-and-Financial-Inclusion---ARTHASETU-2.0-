"""
STEP 4: Clustering & PCA (Dimensionality Reduction)
Trust Scoring for Credit-Invisible Gig Workers
"""
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans, DBSCAN
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score
from scipy.cluster.hierarchy import dendrogram, linkage, fcluster
import warnings
warnings.filterwarnings('ignore')

OUTPUT_DIR = r"C:\Users\arpam\gig_trust_score_analysis\outputs"
plt.rcParams['figure.figsize'] = (12, 8)
plt.rcParams['font.size'] = 10
sns.set_style("whitegrid")

print("=" * 70)
print("STEP 4: CLUSTERING & PCA")
print("=" * 70)

df = pd.read_csv(f"{OUTPUT_DIR}/cleaned_data_with_features.csv")

# ─── 4.1 PREPARE FEATURES FOR CLUSTERING ────────────────────────
print("\n--- 4.1 Feature Preparation ---")

cluster_features = [
    'monthly_net_income_inr', 'daily_hours_worked', 'orders_or_rides_per_day',
    'platform_rating_out_of_5', 'order_cancellation_rate_pct',
    'years_on_platform', 'digital_literacy_score_1_5',
    'education_encoded', 'age_years', 'dependents_count',
    'monthly_fuel_cost_inr', 'monthly_emi_burden_inr',
    'has_bank_account', 'has_upi', 'has_social_security',
    'housing_stability', 'vehicle_owned', 'is_migrant'
]

X = df[cluster_features].fillna(0)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
print(f"  Features used for clustering: {len(cluster_features)}")
print(f"  Samples: {X_scaled.shape[0]}")

# ─── 4.2 K-MEANS: ELBOW METHOD ──────────────────────────────────
print("\n--- 4.2 K-Means Elbow Method ---")
inertias = []
silhouette_scores = []
K_range = range(2, 11)

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10, max_iter=300)
    labels = kmeans.fit_predict(X_scaled)
    inertias.append(kmeans.inertia_)
    sil = silhouette_score(X_scaled, labels, sample_size=10000, random_state=42)
    silhouette_scores.append(sil)
    print(f"  K={k}: Inertia={kmeans.inertia_:,.0f}, Silhouette={sil:.4f}")

fig, axes = plt.subplots(1, 2, figsize=(14, 5))
axes[0].plot(K_range, inertias, 'bo-', linewidth=2, markersize=8)
axes[0].set_xlabel('Number of Clusters (K)')
axes[0].set_ylabel('Inertia')
axes[0].set_title('Elbow Method for Optimal K')
axes[0].grid(True)

axes[1].plot(K_range, silhouette_scores, 'ro-', linewidth=2, markersize=8)
axes[1].set_xlabel('Number of Clusters (K)')
axes[1].set_ylabel('Silhouette Score')
axes[1].set_title('Silhouette Score for Optimal K')
axes[1].grid(True)

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/13_elbow_method.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 13_elbow_method.png")

# ─── 4.3 K-MEANS CLUSTERING (K=4) ──────────────────────────────
print("\n--- 4.3 K-Means Clustering (K=4) ---")
optimal_k = 4
kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
df['kmeans_cluster'] = kmeans.fit_predict(X_scaled)

print(f"\n  Cluster Distribution:")
print(df['kmeans_cluster'].value_counts().sort_index())

# Cluster Profiles
print("\n  Cluster Profiles (Mean Values):")
cluster_profiles = df.groupby('kmeans_cluster')[cluster_features].mean()
print(cluster_profiles.round(2))

# ─── 4.4 CLUSTER VISUALIZATION ──────────────────────────────────
print("\n--- 4.4 Cluster Visualization ---")

# PCA for 2D visualization
pca_2d = PCA(n_components=2, random_state=42)
X_pca_2d = pca_2d.fit_transform(X_scaled)
df['pca_1'] = X_pca_2d[:, 0]
df['pca_2'] = X_pca_2d[:, 1]

fig, axes = plt.subplots(1, 2, figsize=(16, 6))

# By K-Means cluster
scatter = axes[0].scatter(df['pca_1'], df['pca_2'], c=df['kmeans_cluster'],
                          cmap='Set1', alpha=0.3, s=5)
axes[0].set_title(f'K-Means Clustering (K={optimal_k}) - PCA Projection')
axes[0].set_xlabel(f'PC1 ({pca_2d.explained_variance_ratio_[0]*100:.1f}% variance)')
axes[0].set_ylabel(f'PC2 ({pca_2d.explained_variance_ratio_[1]*100:.1f}% variance)')
plt.colorbar(scatter, ax=axes[0], label='Cluster')

# By Trust Category
trust_map = {'Low Trust': 0, 'Medium Trust': 1, 'High Trust': 2}
df['trust_numeric'] = df['trust_category'].map(trust_map)
scatter2 = axes[1].scatter(df['pca_1'], df['pca_2'], c=df['trust_numeric'],
                           cmap='RdYlGn', alpha=0.3, s=5)
axes[1].set_title('Trust Category - PCA Projection')
axes[1].set_xlabel(f'PC1 ({pca_2d.explained_variance_ratio_[0]*100:.1f}% variance)')
axes[1].set_ylabel(f'PC2 ({pca_2d.explained_variance_ratio_[1]*100:.1f}% variance)')
plt.colorbar(scatter2, ax=axes[1], label='Trust Level')

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/14_kmeans_pca_clusters.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 14_kmeans_pca_clusters.png")

# ─── 4.5 CLUSTER PROFILES BAR CHART ─────────────────────────────
print("\n--- 4.5 Cluster Profiles Visualization ---")

# Normalize for comparison
cluster_means_norm = (cluster_profiles - cluster_profiles.min()) / (cluster_profiles.max() - cluster_profiles.min())

fig, ax = plt.subplots(figsize=(16, 8))
cluster_means_norm.T.plot(kind='bar', ax=ax, width=0.8, edgecolor='black')
ax.set_title('Normalized Cluster Profiles (Feature Importance by Cluster)', fontsize=14)
ax.set_xlabel('Feature')
ax.set_ylabel('Normalized Value')
ax.legend(title='Cluster', labels=[f'Cluster {i}' for i in range(optimal_k)])
ax.tick_params(axis='x', rotation=45)
plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/15_cluster_profiles.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 15_cluster_profiles.png")

# ─── 4.6 HIERARCHICAL CLUSTERING (DENDROGRAM) ────────────────────
print("\n--- 4.6 Hierarchical Clustering (Dendrogram) ---")

# Sample for dendrogram (too many points)
sample_idx = np.random.choice(len(X_scaled), size=5000, replace=False)
X_sample = X_scaled[sample_idx]

linked = linkage(X_sample, method='ward')

fig, ax = plt.subplots(figsize=(16, 8))
dendrogram(linked, truncate_mode='lastp', p=30, leaf_rotation=90,
           leaf_font_size=10, show_contracted=True, ax=ax)
ax.set_title('Hierarchical Clustering Dendrogram (Ward Linkage, n=5000 sample)', fontsize=14)
ax.set_xlabel('Sample Index / Cluster Size')
ax.set_ylabel('Distance')
plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/16_dendrogram.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 16_dendrogram.png")

# ─── 4.7 PCA - FULL ANALYSIS ────────────────────────────────────
print("\n--- 4.7 PCA Full Analysis ---")

pca_full = PCA(random_state=42)
pca_full.fit(X_scaled)

# Variance explained
cumulative_var = np.cumsum(pca_full.explained_variance_ratio_) * 100
print("\n  PCA Variance Explained:")
for i, (var, cum_var) in enumerate(zip(pca_full.explained_variance_ratio_ * 100, cumulative_var)):
    print(f"    PC{i+1:2d}: {var:6.2f}% (Cumulative: {cum_var:6.2f}%)")
    if cum_var >= 90:
        print(f"    --> 90% variance explained at PC{i+1}")
        break

fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Scree plot
axes[0].bar(range(1, len(pca_full.explained_variance_ratio_) + 1),
            pca_full.explained_variance_ratio_ * 100, alpha=0.7, color='steelblue')
axes[0].plot(range(1, len(cumulative_var) + 1), cumulative_var, 'ro-', linewidth=2)
axes[0].axhline(y=90, color='green', linestyle='--', label='90% threshold')
axes[0].set_xlabel('Principal Component')
axes[0].set_ylabel('Variance Explained (%)')
axes[0].set_title('Scree Plot - PCA')
axes[0].legend()

# Feature loadings for PC1 and PC2
loadings = pd.DataFrame(
    pca_full.components_[:2].T,
    columns=['PC1', 'PC2'],
    index=cluster_features
)
loadings['abs_sum'] = loadings['PC1'].abs() + loadings['PC2'].abs()
loadings = loadings.sort_values('abs_sum', ascending=True)

axes[1].barh(range(len(loadings)), loadings['PC1'], alpha=0.7, label='PC1', color='steelblue')
axes[1].barh(range(len(loadings)), loadings['PC2'], alpha=0.7, label='PC2', color='coral')
axes[1].set_yticks(range(len(loadings)))
axes[1].set_yticklabels(loadings.index)
axes[1].set_xlabel('Loading')
axes[1].set_title('PCA Feature Loadings (PC1 & PC2)')
axes[1].legend()
axes[1].axvline(x=0, color='black', linewidth=0.5)

plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/17_pca_scree_loadings.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 17_pca_scree_loadings.png")

# ─── 4.8 PCA COMPONENT INTERPRETATION ───────────────────────────
print("\n--- 4.8 PCA Component Interpretation ---")
for i in range(min(4, len(pca_full.components_))):
    loading = pd.Series(pca_full.components_[i], index=cluster_features)
    top_pos = loading.nlargest(3)
    top_neg = loading.nsmallest(3)
    print(f"\n  PC{i+1} ({pca_full.explained_variance_ratio_[i]*100:.1f}% variance):")
    print(f"    Top positive: {', '.join([f'{f}({v:.3f})' for f, v in top_pos.items()])}")
    print(f"    Top negative: {', '.join([f'{f}({v:.3f})' for f, v in top_neg.items()])}")

# ─── 4.9 SAVE CLUSTERED DATA ────────────────────────────────────
print("\n--- 4.9 Saving Clustered Data ---")
df.to_csv(f"{OUTPUT_DIR}/clustered_data.csv", index=False)
print(f"  Saved to: {OUTPUT_DIR}/clustered_data.csv")

# ─── 4.10 TRUST CATEGORY BY CLUSTER ─────────────────────────────
print("\n--- 4.10 Trust Category Distribution by Cluster ---")
cross_tab = pd.crosstab(df['kmeans_cluster'], df['trust_category'], normalize='index') * 100
print(cross_tab.round(2))

fig, ax = plt.subplots(figsize=(10, 6))
cross_tab.plot(kind='bar', stacked=True, ax=ax, colormap='RdYlGn', edgecolor='black')
ax.set_title('Trust Category Distribution by K-Means Cluster', fontsize=14)
ax.set_xlabel('Cluster')
ax.set_ylabel('Percentage (%)')
ax.legend(title='Trust Category')
ax.tick_params(axis='x', rotation=0)
plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/18_trust_by_cluster.png", dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: 18_trust_by_cluster.png")

print("\n" + "=" * 70)
print("STEP 4 COMPLETE: Clustering and PCA analysis saved")
print("=" * 70)
