import os, json

history_path = r'C:\Users\harry sevilla\AppData\Roaming\Code\User\History'
files_to_recover = ['authmodal.jsx', 'dashboardlayout.jsx', 'travelerdashboard.jsx', 'directory.jsx', 'navbar.jsx', 'main.jsx']
results = {}

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
        for ftr in files_to_recover:
            if ftr in r:
                entries = data.get('entries', [])
                entries.sort(key=lambda x: x['timestamp'])
                results[ftr] = [{'id': e['id'], 'time': e['timestamp'], 'p': os.path.join(d_path, e['id'])} for e in entries[-5:]]
    except Exception as e:
        pass

for k, v in results.items():
    print(k)
    for e in v:
        size = os.path.getsize(e['p']) if os.path.exists(e['p']) else 0
        print(f"  Time: {e['time']}, Size: {size}, Path: {e['p']}")
