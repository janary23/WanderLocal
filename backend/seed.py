"""
seed.py – One-time script to fix plain-text passwords in the database.
Run ONCE with:  py seed.py

What it does:
  - Reads every user row from the `users` table
  - If the stored password is NOT already a bcrypt hash, it re-hashes it with bcrypt
  - Updates the row in-place — no data loss, no user changes needed
"""

import bcrypt
from db import get_db


def is_bcrypt_hash(value: str) -> bool:
    """Return True if the string looks like a bcrypt hash ($2a$, $2b$, $2y$)."""
    return value.startswith(("$2a$", "$2b$", "$2y$"))


def rehash_plain_passwords():
    conn = get_db()
    updated = 0
    skipped = 0

    with conn.cursor() as cursor:
        cursor.execute("SELECT id, email, password FROM users")
        users = cursor.fetchall()

        for user in users:
            uid   = user["id"]
            email = user["email"]
            pwd   = user["password"]

            if is_bcrypt_hash(pwd):
                print(f"  [SKIP]    {email} — already hashed")
                skipped += 1
                continue

            # Re-hash the plain-text password
            new_hash = bcrypt.hashpw(pwd.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
            cursor.execute(
                "UPDATE users SET password = %s WHERE id = %s",
                (new_hash, uid)
            )
            print(f"  [UPDATED] {email} — plain text → bcrypt hash")
            updated += 1

        conn.commit()

    conn.close()
    print(f"\nDone. {updated} password(s) hashed, {skipped} already OK.")


if __name__ == "__main__":
    print("Checking user passwords...\n")
    rehash_plain_passwords()
