"""
db.py – Database connection
Mirrors: api/db.php
"""

import pymysql

DB_CONFIG = {
    "host":      "localhost",
    "user":      "root",
    "password":  "",          # Replace with your DB password if set
    "database":  "wanderelocal_db",
    "cursorclass": pymysql.cursors.DictCursor,
}

def get_db():
    """Open and return a new MySQL connection."""
    return pymysql.connect(**DB_CONFIG)
