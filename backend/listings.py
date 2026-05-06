"""
listings.py – Directory Listings API
GET  /listings          – All published listings (with optional filters)
GET  /listings/<id>     – Single listing detail
POST /listings          – Create a new listing (business owner)
PUT  /listings/<id>     – Update a listing (owner only)
POST /listings/<id>/save   – Save/un-save to wishlist
GET  /wishlist          – Get logged-in user's saved listings
"""

from flask import Blueprint, request, jsonify
from db import get_db
import pymysql

listings_bp = Blueprint("listings", __name__)


def _listing_row(row, tags=None, photos=None):
    """Serialize a listing DB row to a dict."""
    return {
        "id":           row["id"],
        "name":         row["name"],
        "type":         row["type"],
        "tier":         row["tier"],
        "category":     row.get("category"),
        "city":         row.get("city"),
        "description":  row.get("description"),
        "hours":        row.get("hours"),
        "cover_img":    row.get("cover_img"),
        "address":      row.get("address"),
        "latitude":     float(row["latitude"]) if row.get("latitude") else None,
        "longitude":    float(row["longitude"]) if row.get("longitude") else None,
        "booking_type": row.get("booking_type"),
        "weekday_price":float(row["weekday_price"]) if row.get("weekday_price") is not None else 0,
        "weekend_price":float(row["weekend_price"]) if row.get("weekend_price") is not None else 0,
        "status":       row.get("status"),
        "owner_id":     row.get("owner_id"),
        "tags":         tags or [],
        "photos":       photos or [],
    }


# ── GET /listings ───────────────────────────────────────────────
@listings_bp.route("/listings", methods=["GET"])
def get_listings():
    category = request.args.get("category")
    tier      = request.args.get("tier")
    q         = request.args.get("q", "").strip()

    try:
        conn = get_db()
        with conn.cursor() as cursor:
            sql = "SELECT * FROM listings WHERE status='active'"
            params = []
            if category and category != "All":
                sql += " AND category = %s"
                params.append(category)
            if tier and tier not in ("All", "all"):
                sql += " AND tier = %s"
                params.append(tier)
            if q:
                sql += " AND (name LIKE %s OR city LIKE %s)"
                params.extend([f"%{q}%", f"%{q}%"])
            sql += " ORDER BY tier='verified' DESC, id ASC"
            cursor.execute(sql, params)
            rows = cursor.fetchall()

            # Fetch tags
            ids = [r["id"] for r in rows]
            tags_map = {}
            if ids:
                fmt = ",".join(["%s"] * len(ids))
                cursor.execute(f"SELECT listing_id, tag FROM listing_tags WHERE listing_id IN ({fmt})", ids)
                for t in cursor.fetchall():
                    tags_map.setdefault(t["listing_id"], []).append(t["tag"])

        conn.close()
        result = [_listing_row(r, tags_map.get(r["id"], [])) for r in rows]
        return jsonify({"status": "success", "listings": result})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── GET /listings/<id> ──────────────────────────────────────────
@listings_bp.route("/listings/<int:lid>", methods=["GET"])
def get_listing(lid):
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM listings WHERE id=%s", (lid,))
            row = cursor.fetchone()
            if not row:
                conn.close()
                return jsonify({"status": "error", "message": "Not found"}), 404

            cursor.execute("SELECT tag FROM listing_tags WHERE listing_id=%s", (lid,))
            tags = [t["tag"] for t in cursor.fetchall()]

            cursor.execute("SELECT url, is_cover FROM listing_photos WHERE listing_id=%s ORDER BY sort_order ASC", (lid,))
            photos = [{"url": p["url"], "is_cover": bool(p["is_cover"])} for p in cursor.fetchall()]

            cursor.execute(
                "SELECT r.rating, r.body, r.created_at, u.name FROM reviews r "
                "LEFT JOIN users u ON r.user_id=u.id WHERE r.listing_id=%s ORDER BY r.created_at DESC",
                (lid,)
            )
            reviews = [
                {"rating": rv["rating"], "body": rv["body"],
                 "author": rv["name"] or "Anonymous", "date": str(rv["created_at"])}
                for rv in cursor.fetchall()
            ]

            # Avg rating
            cursor.execute("SELECT AVG(rating) AS avg_r, COUNT(*) AS cnt FROM reviews WHERE listing_id=%s", (lid,))
            stats = cursor.fetchone()

        conn.close()
        data = _listing_row(row, tags, photos)
        data["reviews"]    = reviews
        data["avg_rating"] = round(float(stats["avg_r"]), 1) if stats["avg_r"] else None
        data["review_count"] = stats["cnt"]
        return jsonify({"status": "success", "listing": data})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── POST /listings (create) ─────────────────────────────────────
@listings_bp.route("/listings", methods=["POST"])
def create_listing():
    data = request.get_json(silent=True) or {}
    required = {"name", "type", "category", "user_id"}
    if not required.issubset(data):
        return jsonify({"status": "error", "message": "Missing required fields."}), 400

    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute(
                """INSERT INTO listings
                   (owner_id, name, type, tier, category, city, description,
                    hours, cover_img, address, booking_type, weekday_price, weekend_price, status)
                   VALUES (%s,%s,%s,'pending',%s,%s,%s,%s,%s,%s,%s,%s,%s,'pending')""",
                (
                    data.get("user_id"), data["name"], data["type"],
                    data.get("category"), data.get("city"), data.get("description"),
                    data.get("hours"), data.get("cover_img"), data.get("address"),
                    data.get("booking_type", "manual"),
                    data.get("weekday_price", 0), data.get("weekend_price", 0),
                )
            )
            lid = cursor.lastrowid

            # Insert tags
            for tag in data.get("tags", []):
                cursor.execute("INSERT INTO listing_tags (listing_id, tag) VALUES (%s,%s)", (lid, tag))

            conn.commit()
        conn.close()
        return jsonify({"status": "success", "listing_id": lid}), 201
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── POST /listings/<id>/save ────────────────────────────────────
@listings_bp.route("/listings/<int:lid>/save", methods=["POST"])
def toggle_save(lid):
    data = request.get_json(silent=True) or {}
    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"status": "error", "message": "user_id required"}), 400

    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT id FROM wishlists WHERE user_id=%s AND listing_id=%s",
                (user_id, lid)
            )
            existing = cursor.fetchone()
            if existing:
                cursor.execute("DELETE FROM wishlists WHERE user_id=%s AND listing_id=%s", (user_id, lid))
                saved = False
            else:
                cursor.execute("INSERT INTO wishlists (user_id, listing_id) VALUES (%s,%s)", (user_id, lid))
                saved = True
            conn.commit()
        conn.close()
        return jsonify({"status": "success", "saved": saved})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── GET /wishlist?user_id=<id> ──────────────────────────────────
@listings_bp.route("/wishlist", methods=["GET"])
def get_wishlist():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"status": "error", "message": "user_id required"}), 400

    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute(
                """SELECT l.* FROM listings l
                   JOIN wishlists w ON l.id=w.listing_id
                   WHERE w.user_id=%s""",
                (user_id,)
            )
            rows = cursor.fetchall()
        conn.close()
        return jsonify({"status": "success", "listings": [_listing_row(r) for r in rows]})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── POST /listings/<id>/review ──────────────────────────────────
@listings_bp.route("/listings/<int:lid>/review", methods=["POST"])
def post_review(lid):
    data = request.get_json(silent=True) or {}
    user_id = data.get("user_id")
    rating  = data.get("rating", 5)
    body    = data.get("body", "")

    if not user_id:
        return jsonify({"status": "error", "message": "user_id required"}), 400

    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO reviews (user_id, listing_id, rating, body) VALUES (%s,%s,%s,%s)",
                (user_id, lid, rating, body)
            )
            conn.commit()
        conn.close()
        return jsonify({"status": "success"})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500
