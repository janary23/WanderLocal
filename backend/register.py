"""
register.py – Register endpoint Blueprint
"""

from flask import Blueprint, request, jsonify
import hashlib, os
from db import get_db
import pymysql

register_bp = Blueprint("register", __name__)


@register_bp.route("/register", methods=["POST", "OPTIONS"])
def register():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True)
    required = {"name", "email", "password"}
    if not data or not required.issubset(data):
        return jsonify({"status": "error", "message": "Missing fields."}), 400

    name           = data["name"]
    email          = data["email"]
    password_plain = data["password"]

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            # Check if email already exists
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cursor.fetchone():
                return jsonify({"status": "error", "message": "Email already registered."})

            # Hash password with sha256 + random salt (fast, fine for academic/local use)
            salt = os.urandom(16).hex()
            hashed = hashlib.sha256((salt + password_plain).encode()).hexdigest()
            stored_value = f"sha256${salt}${hashed}"

            cursor.execute(
                "INSERT INTO users (name, email, password, role, is_host) VALUES (%s, %s, %s, 'user', FALSE)",
                (name, email, stored_value)
            )
            new_id = cursor.lastrowid
            conn.commit()

        return jsonify({
            "status":  "success",
            "message": "Registration successful",
            "user":    {"id": new_id, "name": name, "email": email, "role": "user", "is_host": False}
        })

    except pymysql.Error as e:
        return jsonify({"status": "error", "message": f"Registration error: {str(e)}"}), 500

    finally:
        if conn:
            conn.close()  # returns connection back to the pool
