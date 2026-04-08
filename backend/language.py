"""
language.py – Static language JSON endpoint Blueprint
Mirrors: api/language.php
"""

import os
from flask import Blueprint, request, jsonify, current_app

language_bp = Blueprint("language", __name__)

LANG_DIR = os.path.join(os.path.dirname(__file__), "lang")


@language_bp.route("/language", methods=["GET"])
def language():
    lang      = request.args.get("lang", "en")
    lang      = os.path.basename(lang)           # Prevent path traversal (mirrors PHP basename())
    lang_file = os.path.join(LANG_DIR, f"{lang}.json")
    default   = os.path.join(LANG_DIR, "en.json")

    if os.path.isfile(lang_file):
        with open(lang_file, encoding="utf-8") as f:
            return current_app.response_class(f.read(), mimetype="application/json")
    elif os.path.isfile(default):
        with open(default, encoding="utf-8") as f:
            return current_app.response_class(f.read(), mimetype="application/json")
    else:
        return jsonify({"error": "No translation found."}), 404
