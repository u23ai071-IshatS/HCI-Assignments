"""
GUI Login Interface (Tkinter) for HCI Lab-1
- Measures completion time, error count, and user satisfaction (1–5).
- Appends each run to usability_raw.csv

Usage:
    python gui_login.py --participant U001
"""
import time
import argparse
import csv
from pathlib import Path
from datetime import datetime
import tkinter as tk
from tkinter import messagebox, simpledialog

VALID_USERNAME = "student"
VALID_PASSWORD = "password123"

class LoginApp:
    def __init__(self, root, participant, csv_path: Path):
        self.root = root
        self.participant = participant
        self.csv_path = csv_path
        self.errors = 0
        self.start_time = time.time()

        root.title("GUI Login - HCI Lab-1")
        root.geometry("360x220")

        self.frame = tk.Frame(root, padx=16, pady=16)
        self.frame.pack(expand=True, fill="both")

        tk.Label(self.frame, text="Username").grid(row=0, column=0, sticky="e", pady=5)
        tk.Label(self.frame, text="Password").grid(row=1, column=0, sticky="e", pady=5)

        self.username = tk.Entry(self.frame)
        self.password = tk.Entry(self.frame, show="*")
        self.username.grid(row=0, column=1, pady=5)
        self.password.grid(row=1, column=1, pady=5)

        self.feedback = tk.Label(self.frame, text="", fg="red")
        self.feedback.grid(row=2, column=0, columnspan=2, pady=6)

        self.login_btn = tk.Button(self.frame, text="Login", command=self.attempt_login)
        self.login_btn.grid(row=3, column=0, columnspan=2, pady=10)

        self.username.focus_set()

    def attempt_login(self):
        u = self.username.get().strip()
        p = self.password.get().strip()
        if u == VALID_USERNAME and p == VALID_PASSWORD:
            duration = time.time() - self.start_time
            # Ask satisfaction
            sat = None
            while sat is None:
                try:
                    s = simpledialog.askstring("Satisfaction", "Rate satisfaction 1–5 (integer):", parent=self.root)
                    if s is None:
                        continue
                    s_int = int(s)
                    if 1 <= s_int <= 5:
                        sat = s_int
                except Exception:
                    pass
            self.append_csv(duration, sat)
            messagebox.showinfo("Success", f"Login successful in {duration:.2f}s with {self.errors} error(s).")
            self.root.destroy()
        else:
            self.errors += 1
            self.feedback.config(text="Invalid credentials. Try again.")

    def append_csv(self, duration, sat):
        self.csv_path.parent.mkdir(parents=True, exist_ok=True)
        header = ["timestamp","participant","interface","duration_sec","errors","satisfaction"]
        row = [datetime.now().isoformat(timespec="seconds"), self.participant, "GUI", round(duration,2), self.errors, sat]
        write_header = not self.csv_path.exists()
        with self.csv_path.open("a", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            if write_header:
                w.writerow(header)
            w.writerow(row)

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--participant", default="U001", help="Participant ID")
    ap.add_argument("--csv", default="./results/usability_raw.csv", help="CSV output path (relative or absolute)")
    args = ap.parse_args()

    root = tk.Tk()
    app = LoginApp(root, args.participant, Path(args.csv))
    root.mainloop()
