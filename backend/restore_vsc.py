import os, json, shutil, time

history_path = r'C:\Users\harry sevilla\AppData\Roaming\Code\User\History'
files_to_recover = {
    'authmodal.jsx': r'c:\xampp\htdocs\WandereLocal\src\components\AuthModal.jsx',
    'dashboardlayout.jsx': r'c:\xampp\htdocs\WandereLocal\src\layouts\DashboardLayout.jsx',
    'travelerdashboard.jsx': r'c:\xampp\htdocs\WandereLocal\src\pages\TravelerDashboard.jsx',
    'directory.jsx': r'c:\xampp\htdocs\WandereLocal\src\pages\Directory.jsx',
    'navbar.jsx': r'c:\xampp\htdocs\WandereLocal\src\layouts\Navbar.jsx',
    'main.jsx': r'c:\xampp\htdocs\WandereLocal\src\main.jsx'
}

now_ms = time.time() * 1000
cutoff_ms = now_ms - (9 * 60 * 1000) # 9 mins ago (roughly 17:27 UTC)
print(f"Cutoff MS: {cutoff_ms}")

for d in os.listdir(history_path):
    d_path = os.path.join(history_path, d)
    if not os.path.isdir(d_path): continue
    entries_path = os.path.join(d_path, 'entries.json')
    if not os.path.exists(entries_path): continue
    try:
        with open(entries_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        r = data.get('resource', '').lower()
        if 'wanderelocal' not in r: continue
        for key, target_path in files_to_recover.items():
            if key in r:
                entries = data.get('entries', [])
                valid_entries = [e for e in entries if e['timestamp'] < cutoff_ms]
                valid_entries.sort(key=lambda x: x['timestamp'])
                if valid_entries:
                    best_entry = os.path.join(d_path, valid_entries[-1]['id'])
                    if os.path.exists(best_entry):
                        shutil.copyfile(best_entry, target_path)
                        print(f"Restored {key} from {best_entry} ({valid_entries[-1]['timestamp']})")
    except Exception as e:
        pass
