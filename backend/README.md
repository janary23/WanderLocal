# WandereLocal – Python Backend

Replaces the old PHP `api/` folder. Built with **Flask**.

## Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/login` | Authenticate user (email + password) |
| POST | `/register` | Create a new user account |
| POST | `/translate` | Proxy to Langbly translation API |
| GET  | `/language?lang=en` | Return static lang JSON file |

## Setup

```bash
cd backend
py -m pip install -r requirements.txt
py app.py          # Starts on http://localhost:5000
```

## Database
Connects to MySQL `wanderelocal_db` on localhost (same DB as before).
Edit `DB_CONFIG` in `app.py` if your credentials differ.

## Password Compatibility
Passwords are hashed with **bcrypt** — compatible with PHP's `password_hash()` / `password_verify()`.
Existing users in the database will continue to work without any data migration.
