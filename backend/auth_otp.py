from flask import Blueprint, request, jsonify
from db import get_db
import pymysql
import random
import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import threading

auth_otp_bp = Blueprint("auth_otp", __name__)

def send_otp_email(to_email, code):
    sender_email = "jrbtruckingservices.2014@gmail.com"
    sender_password = "orfx wkgt vuae yfds"

    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #ffffff; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 12px; border: 1px solid #e0e0e0;">
          <div style="margin-bottom: 24px;">
            <h2 style="color: #4A90C2; margin: 0; font-size: 28px;">WanderLocal</h2>
          </div>
          <h1 style="font-size: 24px; color: #222222; margin-top: 0; margin-bottom: 16px;">Here's your WanderLocal code</h1>
          <p style="color: #222222; font-size: 16px; margin-top: 0; margin-bottom: 24px;">
            Never share your confirmation code with anyone—WanderLocal employees will never ask for it.
          </p>
          <div style="font-size: 32px; font-weight: bold; color: #222222; margin-bottom: 32px;">
            {code}
          </div>
          <h3 style="font-size: 16px; font-weight: bold; color: #222222; margin-top: 0; margin-bottom: 8px;">Don't recognize this?</h3>
          <p style="color: #222222; font-size: 14px; margin-top: 0; margin-bottom: 32px;">
            Let us know—we'll help secure and <a href="#" style="color: #222222; font-weight: bold; text-decoration: underline;">review your account</a>.
            Otherwise, no action is required.
          </p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin-bottom: 24px;" />
          <div style="color: #717171; font-size: 12px; line-height: 1.5;">
            <div style="margin-bottom: 12px;">
              <h2 style="color: #4A90C2; margin: 0; font-size: 18px;">WanderLocal</h2>
            </div>
            WanderLocal Inc.<br>
            Philippines
          </div>
        </div>
      </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg['Subject'] = f"Your confirmation code is {code}"
    msg['From'] = f"WanderLocal <{sender_email}>"
    msg['To'] = to_email

    part = MIMEText(html, 'html')
    msg.attach(part)

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, msg.as_string())
        server.quit()
        print(f"OTP Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")


@auth_otp_bp.route("/auth/request-otp", methods=["POST", "OPTIONS"])
def request_otp():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True)
    email = data.get("email")
    if not email:
        return jsonify({"status": "error", "message": "Email is required."}), 400

    code = f"{random.randint(0, 999999):06d}"
    expires_at = datetime.datetime.now() + datetime.timedelta(minutes=10)

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM otps WHERE email = %s", (email,))
            cur.execute(
                "INSERT INTO otps (email, code, expires_at) VALUES (%s, %s, %s)",
                (email, code, expires_at)
            )
            conn.commit()
        
        # Send email in background thread to avoid blocking response
        threading.Thread(target=send_otp_email, args=(email, code)).start()

        # Print to console for local testing
        print(f"\n\n=== [WanderLocal] OTP FOR {email}: {code} ===\n\n")

        return jsonify({"status": "success", "message": "OTP sent.", "demo_code": code})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if conn: conn.close()

@auth_otp_bp.route("/auth/verify-otp", methods=["POST", "OPTIONS"])
def verify_otp():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True)
    email = data.get("email")
    code = data.get("code")

    if not email or not code:
        return jsonify({"status": "error", "message": "Email and code required."}), 400

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM otps WHERE email = %s AND code = %s AND expires_at > NOW()", (email, code))
            otp_record = cur.fetchone()

            if not otp_record:
                return jsonify({"status": "error", "message": "Invalid or expired code."}), 400

            cur.execute("DELETE FROM otps WHERE email = %s", (email,))
            conn.commit()

            cur.execute("SELECT id, name, email, role, is_host FROM users WHERE email = %s LIMIT 1", (email,))
            user = cur.fetchone()

            if user:
                return jsonify({
                    "status": "success", 
                    "action": "login",
                    "user": {
                        "id": user["id"],
                        "name": user["name"],
                        "email": user["email"],
                        "role": user["role"],
                        "is_host": bool(user["is_host"])
                    }
                })
            else:
                return jsonify({
                    "status": "success",
                    "action": "signup_needed"
                })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if conn: conn.close()

@auth_otp_bp.route("/auth/complete-otp-signup", methods=["POST", "OPTIONS"])
def complete_otp_signup():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True)
    email = data.get("email")
    name = data.get("name")
    password = data.get("password")

    if not email or not name or not password:
        return jsonify({"status": "error", "message": "Email, Name, and Password are required."}), 400

    import bcrypt
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    conn = None
    try:
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO users (name, email, password, role, is_host) VALUES (%s, %s, %s, 'user', FALSE)",
                (name, email, hashed_pw)
            )
            conn.commit()
            uid = cur.lastrowid

            return jsonify({
                "status": "success",
                "action": "login",
                "user": {
                    "id": uid,
                    "name": name,
                    "email": email,
                    "role": "user",
                    "is_host": False
                }
            })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if conn: conn.close()
