"""
app.py – Flask application entry point
Mirrors the role of XAMPP's Apache router:
  registers all Blueprints (login, register, translate, language)
  and starts the dev server.

Run with:  py app.py
Listens on: http://localhost:5000
"""

from flask import Flask
from flask_cors import CORS

from login     import login_bp
from register  import register_bp
from translate import translate_bp
from language  import language_bp

app = Flask(__name__)
CORS(app)   # Allow all origins (mirrors PHP's Access-Control-Allow-Origin: *)

# Register each Blueprint – one file per endpoint, just like the PHP api/ folder
app.register_blueprint(login_bp)
app.register_blueprint(register_bp)
app.register_blueprint(translate_bp)
app.register_blueprint(language_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
