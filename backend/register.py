"""
register.py – Register endpoint Blueprint
Mirrors: api/register.php
"""

from flask import Blueprint, request, jsonify
import bcrypt
from db import get_db
import pymysql

register_bp = Blueprint("register", __name__)


@register_bp.route("/register", methods=["POST", "OPTIONS"])
def register():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True)
    required = {"name", "email", "password", "role"}
    if not data or not required.issubset(data):
        return jsonify({"status": "error", "message": "Missing fields."}), 400

    name           = data["name"]
    email          = data["email"]
    password_plain = data["password"]
    role           = data["role"]

    try:
        conn = get_db()
        with conn.cursor() as cursor:
            # Check if email already exists
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cursor.fetchone():
                conn.close()
                return jsonify({"status": "error", "message": "Email already registered."})

            # Hash password with bcrypt (compatible with PHP password_hash)
            hashed = bcrypt.hashpw(password_plain.encode("utf-8"), bcrypt.gensalt())

            cursor.execute(
                "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
                (name, email, hashed.decode("utf-8"), role)
            )
            conn.commit()
        conn.close()

        return jsonify({
            "status":  "success",
            "message": "Registration successful",
            "user":    {"name": name, "email": email, "role": role}
        })

    except pymysql.Error as e:
        return jsonify({"status": "error", "message": f"Registration error: {str(e)}"}), 500
