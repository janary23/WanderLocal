"""
auth_google.py – Google OAuth endpoint
POST /auth/google  { credential: <Google ID token> }
  → verifies the token, upserts user, returns user info
"""

from flask import Blueprint, request, jsonify
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
from db import get_db
import pymysql

auth_google_bp = Blueprint("auth_google", __name__)

# ⚠️  Must match the Client ID used in the frontend Google button
GOOGLE_CLIENT_ID = "897367749062-e5hem7v8ucn6rbmdlvqnnkrgn9rmcq55.apps.googleusercontent.com"


@auth_google_bp.route("/auth/google", methods=["POST", "OPTIONS"])
def google_login():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True)
    if not data or "credential" not in data:
        return jsonify({"status": "error", "message": "Missing Google credential."}), 400

    credential = data["credential"]
    # No role_hint required anymore, everyone is a user


    # ── 1. Verify the Google ID token ───────────────────────────
    try:
        id_info = id_token.verify_oauth2_token(
            credential,
            grequests.Request(),
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=10,
        )
    except ValueError as e:
        return jsonify({"status": "error", "message": f"Invalid Google token: {str(e)}"}), 401

    google_id   = id_info["sub"]
    email       = id_info.get("email", "")
    name        = id_info.get("name", email.split("@")[0])
    avatar_url  = id_info.get("picture", None)

    # ── 2. Upsert user in DB ─────────────────────────────────────
    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cur:
            # Check if user already exists (by google_id OR email)
            cur.execute(
                "SELECT id, name, email, role, is_host, avatar_url FROM users WHERE google_id = %s OR email = %s LIMIT 1",
                (google_id, email),
            )
            user = cur.fetchone()

            if user:
                # Existing user — attach google_id if not already linked
                cur.execute(
                    "UPDATE users SET google_id = %s, avatar_url = COALESCE(avatar_url, %s) WHERE id = %s",
                    (google_id, avatar_url, user["id"]),
                )
                conn.commit()
                uid     = user["id"]
                name    = user["name"]
                role    = user["role"]
                is_host = bool(user["is_host"])
            else:
                # New user — create account (no password for Google users)
                cur.execute(
                    """INSERT INTO users (name, email, password, role, is_host, google_id, avatar_url)
                       VALUES (%s, %s, NULL, 'user', FALSE, %s, %s)""",
                    (name, email, google_id, avatar_url),
                )
                conn.commit()
                uid     = cur.lastrowid
                role    = 'user'
                is_host = False

    except pymysql.Error as e:
        return jsonify({"status": "error", "message": f"DB error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

    return jsonify({
        "status": "success",
        "message": "Google login successful",
        "user": {
            "id":      uid,
            "name":    name,
            "email":   email,
            "role":    role,
            "is_host": is_host,
        }
    })
