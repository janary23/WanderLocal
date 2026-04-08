"""
translate.py – Translation proxy endpoint Blueprint
Mirrors: api/translate.php
"""

import time
import requests
from flask import Blueprint, request, jsonify

translate_bp = Blueprint("translate", __name__)

API_KEY    = "USF6oU4kqXmiprHMVwQFY9"
API_URL    = "https://api.langbly.com/language/translate/v2"
CHUNK_SIZE = 50


@translate_bp.route("/translate", methods=["POST", "OPTIONS"])
def translate():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    # Optional connectivity test: GET /translate?test=1
    if request.args.get("test"):
        try:
            r = requests.get("https://api.langbly.com", timeout=5, verify=False)
            body = f"Python Proxy Status: ONLINE\nConnectivity result (HTTP Code): {r.status_code}\n"
        except Exception as e:
            body = f"Python Proxy Status: ONLINE\nConnectivity result: FAILED – {e}\n"
        return body, 200, {"Content-Type": "text/plain"}

    data = request.get_json(silent=True)
    if not data or "q" not in data or "target" not in data:
        return jsonify({"status": "error", "message": "Invalid request. Need 'q' and 'target' fields."}), 400

    strings     = data["q"]
    target      = data["target"]
    target_lang = "tl" if target == "fil" else target

    # Split into chunks of 50 (Langbly limit)
    chunks = [strings[i : i + CHUNK_SIZE] for i in range(0, len(strings), CHUNK_SIZE)]
    all_translations = []

    for chunk in chunks:
        success    = False
        last_error = ""

        for _attempt in range(3):          # Up to 3 retries
            try:
                resp = requests.post(
                    API_URL,
                    json={"q": chunk, "target": target_lang},
                    headers={
                        "Content-Type": "application/json",
                        "X-API-Key":    API_KEY,
                        "User-Agent":   "WanderLocal/1.0",
                        "Accept":       "application/json",
                    },
                    timeout=30,
                    verify=False,
                )

                if resp.status_code in (429, 503):
                    last_error = f"Langbly Response {resp.status_code}"
                    time.sleep(1)
                    continue

                if resp.status_code >= 400:
                    return jsonify({
                        "status":  "error",
                        "message": f"Langbly Response {resp.status_code}",
                        "raw":     resp.text[:500],
                    }), resp.status_code

                res_data = resp.json()
                if "data" not in res_data or "translations" not in res_data["data"]:
                    return jsonify({
                        "status":  "error",
                        "message": "Invalid response structure",
                        "raw":     resp.text[:500],
                    }), 500

                all_translations.extend(res_data["data"]["translations"])
                success = True

                # Small courtesy delay between chunks
                if len(chunks) > 1:
                    time.sleep(0.1)
                break

            except requests.RequestException as e:
                last_error = f"Request failed: {str(e)}"
                time.sleep(0.5)   # Wait 0.5 s before retry

        if not success:
            return jsonify({
                "status":  "error",
                "message": f"Translation failed after retries: {last_error}",
            }), 503

    return jsonify({"data": {"translations": all_translations}})
