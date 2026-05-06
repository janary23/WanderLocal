"""
admin_routes.py – Admin-only API
GET  /admin/stats          – Platform-wide stats (users, listings, nominations, pending)
GET  /admin/users          – All users
PUT  /admin/users/<id>     – Update user (role, etc.)
DELETE /admin/users/<id>   – Delete user
GET  /admin/queue          – Verification queue (pending listings)
PUT  /admin/queue/<id>     – Approve or reject a listing
GET  /admin/claims         – Claim requests
PUT  /admin/claims/<id>    – Approve/reject claim
"""

from flask import Blueprint, request, jsonify
from db import get_db
import pymysql

admin_bp = Blueprint("admin", __name__)


# ── GET /admin/stats ─────────────────────────────────────────────
@admin_bp.route("/admin/stats", methods=["GET"])
def admin_stats():
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) AS cnt FROM users")
            users = cursor.fetchone()["cnt"]

            cursor.execute("SELECT COUNT(*) AS cnt FROM listings WHERE status='active'")
            listings = cursor.fetchone()["cnt"]

            cursor.execute("SELECT COUNT(*) AS cnt FROM nominations WHERE status='pending'")
            nominations = cursor.fetchone()["cnt"]

            cursor.execute("SELECT COUNT(*) AS cnt FROM listings WHERE status='pending'")
            pending = cursor.fetchone()["cnt"]

            cursor.execute("SELECT COUNT(*) AS cnt FROM claim_requests WHERE status='pending'")
            claims = cursor.fetchone()["cnt"]

        conn.close()
        return jsonify({
            "status": "success",
            "stats": {
                "total_users":         users,
                "active_listings":     listings,
                "pending_nominations": nominations,
                "pending_verifications": pending,
                "pending_claims":      claims,
            }
        })
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── GET /admin/users ─────────────────────────────────────────────
@admin_bp.route("/admin/users", methods=["GET"])
def get_all_users():
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
            )
            rows = cursor.fetchall()
        conn.close()
        result = [
            {
                "id":         r["id"],
                "name":       r["name"],
                "email":      r["email"],
                "role":       r["role"],
                "created_at": str(r["created_at"]),
            }
            for r in rows
        ]
        return jsonify({"status": "success", "users": result})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── PUT /admin/users/<id> ────────────────────────────────────────
@admin_bp.route("/admin/users/<int:uid>", methods=["PUT", "OPTIONS"])
def update_user(uid):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True) or {}
    allowed = {"role", "name", "email"}
    fields = {k: v for k, v in data.items() if k in allowed}
    if not fields:
        return jsonify({"status": "error", "message": "Nothing to update"}), 400

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


# ── DELETE /admin/users/<id> ─────────────────────────────────────
@admin_bp.route("/admin/users/<int:uid>", methods=["DELETE", "OPTIONS"])
def delete_user(uid):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM users WHERE id=%s", (uid,))
            conn.commit()
        conn.close()
        return jsonify({"status": "success"})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── GET /admin/queue ─────────────────────────────────────────────
@admin_bp.route("/admin/queue", methods=["GET"])
def get_verification_queue():
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute(
                """SELECT l.*, u.name AS owner_name, u.email AS owner_email
                   FROM listings l
                   LEFT JOIN users u ON l.owner_id=u.id
                   WHERE l.status='pending'
                   ORDER BY l.created_at DESC"""
            )
            rows = cursor.fetchall()
        conn.close()
        result = [
            {
                "id":          r["id"],
                "name":        r["name"],
                "type":        r["type"],
                "city":        r.get("city"),
                "owner":       r.get("owner_name"),
                "owner_email": r.get("owner_email"),
                "submitted":   str(r["created_at"]),
                "status":      r["status"],
            }
            for r in rows
        ]
        return jsonify({"status": "success", "queue": result})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── PUT /admin/queue/<id> ────────────────────────────────────────
@admin_bp.route("/admin/queue/<int:lid>", methods=["PUT", "OPTIONS"])
def update_listing_status(lid):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True) or {}
    action = data.get("action")  # 'approve' | 'reject'

    if action == "approve":
        new_status = "active"
        new_tier   = data.get("tier", "verified")
    elif action == "reject":
        new_status = "rejected"
        new_tier   = None
    else:
        return jsonify({"status": "error", "message": "action must be 'approve' or 'reject'"}), 400

    try:
        conn = get_db()
        with conn.cursor() as cursor:
            if new_tier:
                cursor.execute(
                    "UPDATE listings SET status=%s, tier=%s WHERE id=%s",
                    (new_status, new_tier, lid)
                )
            else:
                cursor.execute(
                    "UPDATE listings SET status=%s WHERE id=%s",
                    (new_status, lid)
                )
            conn.commit()
        conn.close()
        return jsonify({"status": "success"})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── GET /admin/claims ────────────────────────────────────────────
@admin_bp.route("/admin/claims", methods=["GET"])
def get_claims():
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute(
                """SELECT c.*, l.name AS listing_name FROM claim_requests c
                   LEFT JOIN listings l ON c.listing_id=l.id
                   ORDER BY c.created_at DESC"""
            )
            rows = cursor.fetchall()
        conn.close()
        result = [
            {
                "id":           r["id"],
                "full_name":    r["full_name"],
                "email":        r["email"],
                "role_at_biz":  r.get("role_at_biz"),
                "listing_name": r.get("listing_name"),
                "status":       r["status"],
                "created_at":   str(r["created_at"]),
            }
            for r in rows
        ]
        return jsonify({"status": "success", "claims": result})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── PUT /admin/claims/<id> ───────────────────────────────────────
@admin_bp.route("/admin/claims/<int:cid>", methods=["PUT", "OPTIONS"])
def update_claim(cid):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True) or {}
    new_status = data.get("status")
    if new_status not in ("approved", "rejected", "pending"):
        return jsonify({"status": "error", "message": "Invalid status"}), 400

    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute("UPDATE claim_requests SET status=%s WHERE id=%s", (new_status, cid))
            conn.commit()
        conn.close()
        return jsonify({"status": "success"})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500
