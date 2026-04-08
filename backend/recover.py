import os, json, shutil

history_path = r'C:\Users\harry sevilla\AppData\Roaming\Code\User\History'
files_to_recover = [
    r'c:\xampp\htdocs\WandereLocal\src\components\AuthModal.jsx',
    r'c:\xampp\htdocs\WandereLocal\src\layouts\DashboardLayout.jsx',
    r'c:\xampp\htdocs\WandereLocal\src\pages\TravelerDashboard.jsx',
    r'c:\xampp\htdocs\WandereLocal\src\pages\Directory.jsx',
    r'c:\xampp\htdocs\WandereLocal\src\layouts\Navbar.jsx',
    r'c:\xampp\htdocs\WandereLocal\src\main.jsx'
]

cutoff_time = 1712420000000 # Just an arbitrary start boundary, we will find the latest before the rewrite
# Actually we can just find the second to last modification of each!
results = {}

for d in os.listdir(history_path):
    d_path = os.path.join(history_path, d)
    if not os.path.isdir(d_path): continue
        
    entries_path = os.path.join(d_path, 'entries.json')
    if not os.path.exists(entries_path): continue
        
    try:
        with open(entries_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        resource_lower = data.get('resource', '').lower().replace('/', '\\')
        for ftr in files_to_recover:
            if ftr.lower() in resource_lower:
                entries = data.get('entries', [])
                entries.sort(key=lambda x: x['timestamp'])
                # We need the most recent entry that is NOT the one I just injected.
                # Assuming the last few entries were from my write_to_file at around the same time.
                # Let's just output the sizes and timestamps of the last 5 entries to decide.
                entry_info = []
                for entry in entries[-5:]:
                    p = os.path.join(d_path, entry['id'])
                    size = os.path.getsize(p) if os.path.exists(p) else 0
                    entry_info.append({'id': entry['id'], 'time': entry['timestamp'], 'size': size, 'p': p})
                results[ftr] = entry_info
    except Exception as e:
        pass

for k, v in results.items():
    print(k)
    for e in v:
        print(f"  Timestamp: {e['time']}, Size: {e['size']}, Path: {e['p']}")
