"""
business.py – Business-owner specific API
GET  /business/listing?user_id=<id>     – Get the owner's primary listing
PUT  /business/listing/<id>             – Update listing details
POST /business/listing/<id>/announce    – Post an announcement
GET  /business/listing/<id>/announces   – Get all announcements
POST /business/claim                    – Submit a claim request
POST /business/onboard                  – Submit full onboarding form (creates listing)
GET  /business/<listing_id>/stats       – Profile stats (views, saves, adds)
"""

from flask import Blueprint, request, jsonify
from db import get_db
import pymysql

business_bp = Blueprint("business", __name__)


# ── GET /business/listing ────────────────────────────────────────
@business_bp.route("/business/listing", methods=["GET"])
def get_owner_listing():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"status": "error", "message": "user_id required"}), 400
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM listings WHERE owner_id=%s LIMIT 1", (user_id,))
            row = cursor.fetchone()
        conn.close()
        if not row:
            return jsonify({"status": "success", "listing": None})
        return jsonify({"status": "success", "listing": _serialize(row)})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


def _serialize(row):
    return {
        "id":            row["id"],
        "name":          row["name"],
        "type":          row["type"],
        "tier":          row["tier"],
        "category":      row.get("category"),
        "city":          row.get("city"),
        "description":   row.get("description"),
        "hours":         row.get("hours"),
        "cover_img":     row.get("cover_img"),
        "address":       row.get("address"),
        "booking_type":  row.get("booking_type"),
        "weekday_price": float(row["weekday_price"]) if row.get("weekday_price") is not None else 0,
        "weekend_price": float(row["weekend_price"]) if row.get("weekend_price") is not None else 0,
        "status":        row.get("status"),
    }


# ── PUT /business/listing/<id> ───────────────────────────────────
@business_bp.route("/business/listing/<int:lid>", methods=["PUT", "OPTIONS"])
def update_listing(lid):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True) or {}
    allowed = {
        "name", "type", "category", "city", "description",
        "hours", "cover_img", "address", "booking_type",
        "weekday_price", "weekend_price"
    }
    fields = {k: v for k, v in data.items() if k in allowed}
    if not fields:
        return jsonify({"status": "error", "message": "Nothing to update"}), 400

    try:
        conn = get_db()
        with conn.cursor() as cursor:
            set_clause = ", ".join(f"{k}=%s" for k in fields)
            cursor.execute(
                f"UPDATE listings SET {set_clause} WHERE id=%s",
                (*fields.values(), lid)
            )
            conn.commit()
        conn.close()
        return jsonify({"status": "success"})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── POST /business/listing/<id>/announce ─────────────────────────
@business_bp.route("/business/listing/<int:lid>/announce", methods=["POST", "OPTIONS"])
def post_announcement(lid):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True) or {}
    content = data.get("content", "").strip()
    if not content:
        return jsonify({"status": "error", "message": "Content is required"}), 400

    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO announcements (listing_id, content) VALUES (%s,%s)",
                (lid, content)
            )
            conn.commit()
        conn.close()
        return jsonify({"status": "success"})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── GET /business/listing/<id>/announces ────────────────────────
@business_bp.route("/business/listing/<int:lid>/announces", methods=["GET"])
def get_announcements(lid):
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM announcements WHERE listing_id=%s ORDER BY created_at DESC",
                (lid,)
            )
            rows = cursor.fetchall()
        conn.close()
        result = [{"id": r["id"], "content": r["content"], "created_at": str(r["created_at"])} for r in rows]
        return jsonify({"status": "success", "announcements": result})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── POST /business/claim ─────────────────────────────────────────
@business_bp.route("/business/claim", methods=["POST", "OPTIONS"])
def submit_claim():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True) or {}
    required = {"full_name", "email"}
    if not required.issubset(data):
        return jsonify({"status": "error", "message": "full_name and email are required"}), 400

    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute(
                """INSERT INTO claim_requests
                   (user_id, listing_id, full_name, email, role_at_biz, doc_url)
                   VALUES (%s,%s,%s,%s,%s,%s)""",
                (
                    data.get("user_id"),
                    data.get("listing_id"),
                    data["full_name"],
                    data["email"],
                    data.get("role_at_biz"),
                    data.get("doc_url"),
                )
            )
            conn.commit()
        conn.close()
        return jsonify({"status": "success"})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── POST /business/onboard ───────────────────────────────────────
@business_bp.route("/business/onboard", methods=["POST", "OPTIONS"])
def onboard_business():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True) or {}
    user_id = data.get("user_id")
    name    = data.get("businessName", "").strip()
    if not user_id or not name:
        return jsonify({"status": "error", "message": "user_id and businessName are required"}), 400

    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute(
                """INSERT INTO listings
                   (owner_id, name, type, tier, category, city, description,
                    address, booking_type, weekday_price, weekend_price, status)
                   VALUES (%s,%s,%s,'pending',%s,%s,%s,%s,%s,%s,%s,'pending')""",
                (
                    user_id, name,
                    data.get("businessType", "Other"),
                    data.get("businessType"),
                    data.get("addressDetails", {}).get("city", data.get("city", "")),
                    data.get("description", ""),
                    data.get("address", ""),
                    data.get("bookingSetting", "manual").lower(),
                    data.get("weekdayPrice", 0),
                    data.get("weekendPrice", 0),
                )
            )
            lid = cursor.lastrowid

            # Insert highlights as tags
            for hl in data.get("highlights", []):
                cursor.execute("INSERT INTO listing_tags (listing_id, tag) VALUES (%s,%s)", (lid, hl))
            for fav in data.get("servicesFavorites", []):
                cursor.execute("INSERT INTO listing_tags (listing_id, tag) VALUES (%s,%s)", (lid, fav))

            # Upgrade user to host instantly
            cursor.execute("UPDATE users SET is_host = TRUE WHERE id = %s", (user_id,))

            conn.commit()
        conn.close()
        return jsonify({"status": "success", "listing_id": lid}), 201
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── GET /business/<lid>/stats ────────────────────────────────────
@business_bp.route("/business/<int:lid>/stats", methods=["GET"])
def get_business_stats(lid):
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) AS cnt FROM wishlists WHERE listing_id=%s", (lid,))
            saves = cursor.fetchone()["cnt"]

            # Count times this listing appears in itinerary stops
            cursor.execute("SELECT COUNT(*) AS cnt FROM itinerary_stops WHERE listing_id=%s", (lid,))
            itinerary_adds = cursor.fetchone()["cnt"]

            cursor.execute("SELECT AVG(rating) AS avg_r, COUNT(*) AS cnt FROM reviews WHERE listing_id=%s", (lid,))
            rv = cursor.fetchone()
        conn.close()
        return jsonify({
            "status": "success",
            "stats": {
                "saves":          saves,
                "itinerary_adds": itinerary_adds,
                "avg_rating":     round(float(rv["avg_r"]), 1) if rv["avg_r"] else None,
                "review_count":   rv["cnt"],
            }
        })
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500
