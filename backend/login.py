"""
login.py – Login endpoint Blueprint
Mirrors: api/login.php
"""

from flask import Blueprint, request, jsonify
import bcrypt
from db import get_db
import pymysql

login_bp = Blueprint("login", __name__)


@login_bp.route("/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True)
    if not data or "email" not in data or "password" not in data:
        return jsonify({"status": "error", "message": "Missing email or password."}), 400

    email          = data["email"]
    password_plain = data["password"]

    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT id, name, email, password, role FROM users WHERE email = %s",
                (email,)
            )
            user = cursor.fetchone()
        conn.close()

        if user:
            stored = user["password"]

            # Check if the stored password is a bcrypt hash ($2a$, $2b$, $2y$)
            if stored.startswith(("$2a$", "$2b$", "$2y$")):
                # PHP uses $2y$; Python bcrypt needs $2b$ — same algorithm, different prefix
                stored_hash = stored.replace("$2y$", "$2b$", 1).encode("utf-8")
                password_ok = bcrypt.checkpw(password_plain.encode("utf-8"), stored_hash)
            else:
                # Plain-text fallback (dev/seed data not yet hashed)
                password_ok = (stored == password_plain)

            if password_ok:
                return jsonify({
                    "status":  "success",
                    "message": "Login successful",
                    "user": {
                        "name":  user["name"],
                        "email": user["email"],
                        "role":  user["role"],
                    }
                })

        return jsonify({"status": "error", "message": "Invalid email or password."})

    except pymysql.Error as e:
        return jsonify({"status": "error", "message": f"Login error: {str(e)}"}), 500
