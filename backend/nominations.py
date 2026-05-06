"""
nominations.py – Nominations endpoint
POST /nominations     – Submit a new nomination
GET  /nominations     – Get all nominations (admin)
PUT  /nominations/<id> – Update status (admin)
"""

from flask import Blueprint, request, jsonify
from db import get_db
import pymysql

nominations_bp = Blueprint("nominations", __name__)


@nominations_bp.route("/nominations", methods=["POST", "OPTIONS"])
def submit_nomination():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True) or {}
    if not data.get("business_name"):
        return jsonify({"status": "error", "message": "Business name is required."}), 400

    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute(
                """INSERT INTO nominations
                   (nominator_id, business_name, city, category, reason, photo_url)
                   VALUES (%s,%s,%s,%s,%s,%s)""",
                (
                    data.get("user_id"),
                    data["business_name"],
                    data.get("city"),
                    data.get("category"),
                    data.get("reason"),
                    data.get("photo_url"),
                )
            )
            conn.commit()
            nom_id = cursor.lastrowid
        conn.close()
        return jsonify({"status": "success", "nomination_id": nom_id}), 201
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@nominations_bp.route("/nominations", methods=["GET"])
def get_nominations():
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute(
                """SELECT n.*, u.name AS nominator_name FROM nominations n
                   LEFT JOIN users u ON n.nominator_id=u.id
                   ORDER BY n.created_at DESC"""
            )
            rows = cursor.fetchall()
        conn.close()
        result = [
            {
                "id":            r["id"],
                "business_name": r["business_name"],
                "city":          r["city"],
                "category":      r["category"],
                "reason":        r["reason"],
                "status":        r["status"],
                "nominator":     r.get("nominator_name", "Anonymous"),
                "created_at":    str(r["created_at"]),
            }
            for r in rows
        ]
        return jsonify({"status": "success", "nominations": result})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@nominations_bp.route("/nominations/<int:nid>", methods=["PUT", "OPTIONS"])
def update_nomination(nid):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True) or {}
    new_status = data.get("status")
    if new_status not in ("pending", "approved", "rejected"):
        return jsonify({"status": "error", "message": "Invalid status."}), 400

    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute("UPDATE nominations SET status=%s WHERE id=%s", (new_status, nid))
            conn.commit()
        conn.close()
        return jsonify({"status": "success"})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500
