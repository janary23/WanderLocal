"""
itineraries.py – Itineraries API
GET    /itineraries?user_id=<id>          – User's itineraries
POST   /itineraries                       – Create itinerary
GET    /itineraries/<id>                  – Full itinerary with days+stops
PUT    /itineraries/<id>                  – Update itinerary meta
DELETE /itineraries/<id>                  – Delete itinerary
POST   /itineraries/<id>/days             – Add a day
POST   /itineraries/<id>/days/<did>/stops – Add a stop to a day
DELETE /itineraries/<id>/stops/<sid>      – Remove a stop
"""

from flask import Blueprint, request, jsonify
from db import get_db
import pymysql

itineraries_bp = Blueprint("itineraries", __name__)


def _build_itinerary(row, days):
    return {
        "id":          row["id"],
        "user_id":     row["user_id"],
        "title":       row["title"],
        "destination": row.get("destination"),
        "visibility":  row["visibility"],
        "status":      row["status"],
        "cloned_by":   row["cloned_by"],
        "created_at":  str(row["created_at"]),
        "updated_at":  str(row["updated_at"]),
        "days":        days,
    }


# ── GET /itineraries ─────────────────────────────────────────────
@itineraries_bp.route("/itineraries", methods=["GET"])
def get_itineraries():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"status": "error", "message": "user_id required"}), 400

    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM itineraries WHERE user_id=%s ORDER BY updated_at DESC",
                (user_id,)
            )
            rows = cursor.fetchall()
        conn.close()
        result = []
        for r in rows:
            result.append({
                "id":          r["id"],
                "title":       r["title"],
                "destination": r.get("destination"),
                "visibility":  r["visibility"],
                "status":      r["status"],
                "cloned_by":   r["cloned_by"],
                "updated_at":  str(r["updated_at"]),
            })
        return jsonify({"status": "success", "itineraries": result})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── POST /itineraries ────────────────────────────────────────────
@itineraries_bp.route("/itineraries", methods=["POST", "OPTIONS"])
def create_itinerary():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True) or {}
    user_id = data.get("user_id")
    title   = data.get("title", "My Trip")
    if not user_id:
        return jsonify({"status": "error", "message": "user_id required"}), 400

    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO itineraries (user_id, title, destination, visibility, status) VALUES (%s,%s,%s,%s,%s)",
                (user_id, title, data.get("destination"), data.get("visibility", "private"), data.get("status", "draft"))
            )
            it_id = cursor.lastrowid
            # Add a default Day 1
            cursor.execute(
                "INSERT INTO itinerary_days (itinerary_id, day_label, day_index) VALUES (%s,'Day 1',1)",
                (it_id,)
            )
            conn.commit()
        conn.close()
        return jsonify({"status": "success", "itinerary_id": it_id}), 201
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── GET /itineraries/<id> ────────────────────────────────────────
@itineraries_bp.route("/itineraries/<int:iid>", methods=["GET"])
def get_itinerary(iid):
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM itineraries WHERE id=%s", (iid,))
            row = cursor.fetchone()
            if not row:
                conn.close()
                return jsonify({"status": "error", "message": "Not found"}), 404

            cursor.execute(
                "SELECT * FROM itinerary_days WHERE itinerary_id=%s ORDER BY day_index ASC",
                (iid,)
            )
            days_rows = cursor.fetchall()

            days = []
            for d in days_rows:
                cursor.execute(
                    """SELECT s.*, l.name AS listing_name, l.cover_img, l.type AS listing_type
                       FROM itinerary_stops s
                       LEFT JOIN listings l ON s.listing_id=l.id
                       WHERE s.day_id=%s ORDER BY s.sort_order ASC""",
                    (d["id"],)
                )
                stops_rows = cursor.fetchall()
                stops = [
                    {
                        "id":        s["id"],
                        "name":      s["custom_name"] or s.get("listing_name") or "Stop",
                        "time":      s.get("stop_time"),
                        "duration":  s.get("duration"),
                        "type":      s.get("stop_type") or s.get("listing_type"),
                        "img":       s.get("cover_img"),
                        "listing_id":s.get("listing_id"),
                    }
                    for s in stops_rows
                ]
                days.append({
                    "id":    d["id"],
                    "label": d["day_label"],
                    "index": d["day_index"],
                    "stops": stops,
                })
        conn.close()
        return jsonify({"status": "success", "itinerary": _build_itinerary(row, days)})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── PUT /itineraries/<id> ────────────────────────────────────────
@itineraries_bp.route("/itineraries/<int:iid>", methods=["PUT", "OPTIONS"])
def update_itinerary(iid):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True) or {}
    fields = {}
    for key in ("title", "destination", "visibility", "status"):
        if key in data:
            fields[key] = data[key]
    if not fields:
        return jsonify({"status": "error", "message": "Nothing to update"}), 400

    try:
        conn = get_db()
        with conn.cursor() as cursor:
            set_clause = ", ".join(f"{k}=%s" for k in fields)
            cursor.execute(
                f"UPDATE itineraries SET {set_clause} WHERE id=%s",
                (*fields.values(), iid)
            )
            conn.commit()
        conn.close()
        return jsonify({"status": "success"})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── DELETE /itineraries/<id> ─────────────────────────────────────
@itineraries_bp.route("/itineraries/<int:iid>", methods=["DELETE", "OPTIONS"])
def delete_itinerary(iid):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM itineraries WHERE id=%s", (iid,))
            conn.commit()
        conn.close()
        return jsonify({"status": "success"})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── POST /itineraries/<id>/days ──────────────────────────────────
@itineraries_bp.route("/itineraries/<int:iid>/days", methods=["POST", "OPTIONS"])
def add_day(iid):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True) or {}
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute("SELECT MAX(day_index) AS mx FROM itinerary_days WHERE itinerary_id=%s", (iid,))
            mx = cursor.fetchone()["mx"] or 0
            new_index = mx + 1
            label = data.get("label", f"Day {new_index}")
            cursor.execute(
                "INSERT INTO itinerary_days (itinerary_id, day_label, day_index) VALUES (%s,%s,%s)",
                (iid, label, new_index)
            )
            did = cursor.lastrowid
            conn.commit()
        conn.close()
        return jsonify({"status": "success", "day_id": did, "label": label, "index": new_index}), 201
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── POST /itineraries/<id>/days/<did>/stops ──────────────────────
@itineraries_bp.route("/itineraries/<int:iid>/days/<int:did>/stops", methods=["POST", "OPTIONS"])
def add_stop(iid, did):
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True) or {}
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute("SELECT MAX(sort_order) AS mx FROM itinerary_stops WHERE day_id=%s", (did,))
            mx = cursor.fetchone()["mx"] or 0
            cursor.execute(
                """INSERT INTO itinerary_stops
                   (day_id, listing_id, custom_name, stop_time, duration, stop_type, sort_order)
                   VALUES (%s,%s,%s,%s,%s,%s,%s)""",
                (
                    did,
                    data.get("listing_id"),
                    data.get("name"),
                    data.get("time"),
                    data.get("duration"),
                    data.get("type"),
                    mx + 1,
                )
            )
            sid = cursor.lastrowid
            conn.commit()
        conn.close()
        return jsonify({"status": "success", "stop_id": sid}), 201
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ── DELETE /itineraries/<id>/stops/<sid> ─────────────────────────
@itineraries_bp.route("/itineraries/<int:iid>/stops/<int:sid>", methods=["DELETE", "OPTIONS"])
def delete_stop(iid, sid):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    try:
        conn = get_db()
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM itinerary_stops WHERE id=%s", (sid,))
            conn.commit()
        conn.close()
        return jsonify({"status": "success"})
    except pymysql.Error as e:
        return jsonify({"status": "error", "message": str(e)}), 500
