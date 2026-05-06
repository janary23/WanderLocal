"""
login.py – Login endpoint Blueprint
Mirrors: api/login.php
"""

from flask import Blueprint, request, jsonify
import hashlib, bcrypt
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

    conn = None
    user = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT id, name, email, password, role, is_host FROM users WHERE email = %s",
                (email,)
            )
            user = cursor.fetchone()
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": f"Login error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()  # returns connection back to the pool

    if user:
        stored = user["password"]

        # Check if the stored password is a bcrypt hash ($2a$, $2b$, $2y$)
        if stored.startswith(("$2a$", "$2b$", "$2y$")):
            stored_hash = stored.replace("$2y$", "$2b$", 1).encode("utf-8")
            password_ok = bcrypt.checkpw(password_plain.encode("utf-8"), stored_hash)
        elif stored.startswith("sha256$"):
            # New format: sha256$<salt>$<hexdigest>
            _, salt, digest = stored.split("$", 2)
            password_ok = hashlib.sha256((salt + password_plain).encode()).hexdigest() == digest
        else:
            # Plain-text fallback (dev/seed data)
            password_ok = (stored == password_plain)

        if password_ok:
            return jsonify({
                "status":  "success",
                "message": "Login successful",
                "user": {
                    "id":      user["id"],
                    "name":    user["name"],
                    "email":   user["email"],
                    "role":    user["role"],
                    "is_host": bool(user["is_host"]),
                }
            })

    return jsonify({"status": "error", "message": "Invalid email or password."})

@login_bp.route("/check-email", methods=["POST", "OPTIONS"])
def check_email():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True)
    if not data or "email" not in data:
        return jsonify({"status": "error", "message": "Missing email."}), 400

    email = data["email"]
    
    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute("SELECT id, name FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
            
        if user:
            return jsonify({"status": "success", "exists": True, "name": user["name"]})
        else:
            return jsonify({"status": "success", "exists": False})
            
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()
