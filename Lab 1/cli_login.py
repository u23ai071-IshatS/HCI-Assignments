"""
CLI Login Interface for HCI Lab-1
- Measures completion time, error count, and user satisfaction (1–5).
- Appends each run to usability_raw.csv

Usage:
    python cli_login.py --participant U001
"""
import time
import argparse
import getpass
import csv
from pathlib import Path
from datetime import datetime

VALID_USERNAME = "student"
VALID_PASSWORD = "password123"

def run(participant: str, csv_path: Path):
    start_time = time.time()
    errors = 0
    print("=== CLI Login ===")
    print("Hint (for testing): username=student, password=password123\n")

    while True:
        u = input("Username: ").strip()
        p = getpass.getpass("Password: ").strip()
        if u == VALID_USERNAME and p == VALID_PASSWORD:
            break
        else:
            errors += 1
            print("Invalid credentials. Try again.\n")

    duration = time.time() - start_time
    print(f"\nLogin successful in {duration:.2f} seconds with {errors} error(s).")

    # Satisfaction
    while True:
        try:
            sat = int(input("Satisfaction (1=very poor … 5=excellent): ").strip())
            if 1 <= sat <= 5:
                break
        except Exception:
            pass
        print("Please enter an integer 1–5.")

    # Append to CSV log
    csv_path.parent.mkdir(parents=True, exist_ok=True)
    header = ["timestamp","participant","interface","duration_sec","errors","satisfaction"]
    row = [datetime.now().isoformat(timespec="seconds"), participant, "CLI", round(duration,2), errors, sat]
    write_header = not csv_path.exists()
    with csv_path.open("a", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        if write_header:
            w.writerow(header)
        w.writerow(row)

    print(f"\nSaved result to {csv_path}")

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--participant", default="U001", help="Participant ID")
    ap.add_argument("--csv", default="./results/usability_raw.csv", help="CSV output path (relative or absolute)")
    args = ap.parse_args()
    run(args.participant, Path(args.csv))
