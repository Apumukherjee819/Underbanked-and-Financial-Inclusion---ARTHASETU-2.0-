"""
MASTER SCRIPT: Trust Scoring for Credit-Invisible Gig Workers
Run all steps sequentially
"""
import subprocess
import sys
import time

scripts = [
    r"C:\Users\arpam\gig_trust_score_analysis\01_data_loading_and_features.py",
    r"C:\Users\arpam\gig_trust_score_analysis\02_eda_statistics.py",
    r"C:\Users\arpam\gig_trust_score_analysis\03_correlation_analysis.py",
    r"C:\Users\arpam\gig_trust_score_analysis\04_clustering_pca.py",
    r"C:\Users\arpam\gig_trust_score_analysis\05_classification_models.py",
]

print("=" * 70)
print("  TRUST SCORING FOR CREDIT-INVISIBLE GIG WORKERS")
print("  Smart India Hackathon - Research Project")
print("=" * 70)

for i, script in enumerate(scripts, 1):
    print(f"\n{'='*70}")
    print(f"  RUNNING STEP {i}: {script.split(chr(92))[-1]}")
    print(f"{'='*70}")
    
    start = time.time()
    result = subprocess.run(
        [sys.executable, script],
        capture_output=False,
        text=True
    )
    elapsed = time.time() - start
    
    if result.returncode != 0:
        print(f"\n  ERROR in Step {i}!")
        sys.exit(1)
    
    print(f"\n  Step {i} completed in {elapsed:.1f} seconds")

print("\n" + "=" * 70)
print("  ALL STEPS COMPLETED SUCCESSFULLY!")
print("=" * 70)
print(f"\n  All outputs saved to: C:\\Users\\arpam\\gig_trust_score_analysis\\outputs")
