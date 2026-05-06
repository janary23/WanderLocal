"""
db.py – Database connection pool
Uses DBUtils PooledDB so connections are pre-warmed and reused across
requests without the overhead of opening a new TCP socket each time.

Install:  pip install dbutils
"""

import pymysql
from dbutils.pooled_db import PooledDB

DB_CONFIG = {
    "host":        "localhost",   # Using localhost as requested
    "user":        "root",
    "password":    "",            # Replace with your DB password if set
    "database":    "wanderelocal_db",
    "cursorclass": pymysql.cursors.DictCursor,
    "autocommit":  False,
    "charset":     "utf8mb4",
}

# Pre-warm 3 connections at startup; grow up to 10 as needed.
_pool = PooledDB(
    creator=pymysql,
    mincached=0,       # connections opened immediately at startup
    maxcached=10,      # max idle connections kept in pool
    maxconnections=20, # hard cap
    blocking=True,     # wait rather than raise if pool is exhausted
    ping=7,            # ping MySQL server before using the connection
    **DB_CONFIG
)

def get_db():
    """Return a connection from the pool (auto-returned when closed)."""
    return _pool.connection()
