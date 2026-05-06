"""
user_profile.py – User Profile API
GET  /profile?user_id=<id>       – Get profile data
PUT  /profile/<id>               – Update personal info
GET  /notifications?user_id=<id> – User notifications
PUT  /notifications/<id>/read    – Mark notification read
GET  /profile/<id>/stats         – Traveler stats
"""

from flask import Blueprint, request, jsonify
from db import get_db
import pymysql

profile_bp = Blueprint("profile", __name__)


@profile_bp.route("/profile", methods=["GET"])
def get_profile():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"status": "error", "message": "user_id required"}), 400
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT id, name, email, role, avatar_url, bio, phone, address, created_at FROM users WHERE id=%s",
                (user_id,)
            )
            row = cursor.fetchone()
        conn.close()
        if not row:
            return jsonify({"status": "error", "message": "User not found"}), 404
        return jsonify({
            "status": "success",
            "user": {
                "id":         row["id"],
                "name":       row["name"],
                "email":      row["email"],
                "role":       row["role"],
                "avatar_url": row.get("avatar_url"),
                "bio":        row.get("bio"),
                "phone":      row.get("phone"),
                "address":    row.get("address"),
                "created_at": str(row["created_at"]),
            }
        })
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@profile_bp.route("/profile/<int:uid>", methods=["PUT", "OPTIONS"])
def update_profile(uid):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True) or {}
    allowed = {"name", "bio", "phone", "address", "avatar_url"}
    fields = {k: v for k, v in data.items() if k in allowed}
    if not fields:
        return jsonify({"status": "error", "message": "No valid fields to update"}), 400

    try:
        conn = get_db()
        with conn.cursor() as cursor:
            set_clause = ", ".join(f"{k}=%s" for k in fields)
            cursor.execute(
                f"UPDATE users SET {set_clause} WHERE id=%s",
                (*fields.values(), uid)
            )
            conn.commit()
        conn.close()
        return jsonify({"status": "success"})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@profile_bp.route("/notifications", methods=["GET"])
def get_notifications():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"status": "error", "message": "user_id required"}), 400
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM notifications WHERE user_id=%s ORDER BY created_at DESC LIMIT 50",
                (user_id,)
            )
            rows = cursor.fetchall()
        conn.close()
        result = [
            {
                "id":         r["id"],
                "title":      r["title"],
                "message":    r["message"],
                "type":       r["type"],
                "is_read":    bool(r["is_read"]),
                "created_at": str(r["created_at"]),
            }
            for r in rows
        ]
        return jsonify({"status": "success", "notifications": result})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@profile_bp.route("/notifications/<int:nid>/read", methods=["PUT", "OPTIONS"])
def mark_read(nid):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute("UPDATE notifications SET is_read=1 WHERE id=%s", (nid,))
            conn.commit()
        conn.close()
        return jsonify({"status": "success"})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@profile_bp.route("/profile/<int:uid>/stats", methods=["GET"])
def get_stats(uid):
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) AS cnt FROM itineraries WHERE user_id=%s", (uid,))
            trips = cursor.fetchone()["cnt"]
            cursor.execute("SELECT COUNT(*) AS cnt FROM wishlists WHERE user_id=%s", (uid,))
            saved = cursor.fetchone()["cnt"]
            cursor.execute("SELECT COUNT(*) AS cnt FROM nominations WHERE nominator_id=%s", (uid,))
            nominations = cursor.fetchone()["cnt"]
        conn.close()
        return jsonify({
            "status": "success",
            "stats": {"trips": trips, "saved": saved, "nominations": nominations}
        })
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500
