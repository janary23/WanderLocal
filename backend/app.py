"""
app.py – WandereLocal Flask API
  Registers all Blueprints and starts the dev server.

Run with:  py app.py   (from inside the backend/ folder)
Listens on: http://localhost:5000
"""

from flask import Flask
from flask_cors import CORS

from login          import login_bp
from register       import register_bp
from translate      import translate_bp
from language       import language_bp
from listings       import listings_bp
from nominations    import nominations_bp
from itineraries    import itineraries_bp
from user_profile   import profile_bp
from business       import business_bp
from admin_routes   import admin_bp
from ai_planner     import ai_planner_bp
from auth_google    import auth_google_bp
from auth_otp       import auth_otp_bp

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Register all Blueprints
app.register_blueprint(login_bp)
app.register_blueprint(register_bp)
app.register_blueprint(translate_bp)
app.register_blueprint(language_bp)
app.register_blueprint(listings_bp)
app.register_blueprint(nominations_bp)
app.register_blueprint(itineraries_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(business_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(ai_planner_bp)
app.register_blueprint(auth_google_bp)
app.register_blueprint(auth_otp_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
