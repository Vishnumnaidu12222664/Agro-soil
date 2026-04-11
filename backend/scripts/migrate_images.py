import shutil
import os
import glob

source_dir = r"C:\Users\vishn\.gemini\antigravity\brain\457c6de9-4b3e-4336-b9c1-a1363dc483f0"
target_dir = r"c:\Users\vishn\Desktop\capstone\backend\uploads"

if not os.path.exists(target_dir):
    os.makedirs(target_dir)

files = {
    "potatoes_preview": "potatoes.png",
    "grapes_preview": "grapes.png",
    "wheat_preview": "wheat.png",
    "maize_preview": "maize.png"
}

for pattern, target_name in files.items():
    found_files = glob.glob(os.path.join(source_dir, f"{pattern}*.png"))
    if found_files:
        shutil.copy(found_files[0], os.path.join(target_dir, target_name))
        print(f"Copied {found_files[0]} to {target_name}")
    else:
        print(f"No file found for {pattern}")
