"""
Analyze usability results for HCI Lab-1.
Reads usability_raw.csv and outputs:
- summary_by_interface.csv
- bar charts: avg_time.png, avg_errors.png, avg_satisfaction.png

Usage:
    python analyze_results.py --csv usability_raw.csv
"""
import argparse
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path

def analyze(csv_path: Path, out_dir: Path):
    out_dir.mkdir(parents=True, exist_ok=True)
    df = pd.read_csv(csv_path)

    needed = {"participant","interface","duration_sec","errors","satisfaction"}
    if not needed.issubset(df.columns):
        raise SystemExit(f"CSV must contain columns: {sorted(needed)}")

    summary = df.groupby("interface", as_index=False).agg(
        avg_time=("duration_sec", "mean"),
        avg_errors=("errors", "mean"),
        avg_satisfaction=("satisfaction", "mean"),
        n=("participant", "count")
    )
    summary.to_csv(out_dir / "summary_by_interface.csv", index=False)

    # Avg Time
    plt.figure()
    plt.bar(summary["interface"], summary["avg_time"])
    plt.title("Average Completion Time by Interface (s)")
    plt.xlabel("Interface")
    plt.ylabel("Seconds")
    plt.savefig(out_dir / "avg_time.png", bbox_inches="tight")
    plt.close()

    # Avg Errors
    plt.figure()
    plt.bar(summary["interface"], summary["avg_errors"])
    plt.title("Average Errors by Interface")
    plt.xlabel("Interface")
    plt.ylabel("Errors")
    plt.savefig(out_dir / "avg_errors.png", bbox_inches="tight")
    plt.close()

    # Avg Satisfaction
    plt.figure()
    plt.bar(summary["interface"], summary["avg_satisfaction"])
    plt.title("Average Satisfaction by Interface (1–5)")
    plt.xlabel("Interface")
    plt.ylabel("Satisfaction")
    plt.ylim(0, 5)
    plt.savefig(out_dir / "avg_satisfaction.png", bbox_inches="tight")
    plt.close()

    print("Analysis complete.")
    print(f"Summary CSV: {out_dir / 'summary_by_interface.csv'}")

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv", default="./results/usability_raw.csv")
    ap.add_argument("--out", default="./results/analysis_outputs")
    args = ap.parse_args()
    analyze(Path(args.csv), Path(args.out))
