from db import get_db
conn = get_db()
with conn.cursor() as cursor:
    cursor.execute("SELECT email, password FROM users LIMIT 3")
    users = cursor.fetchall()
    for user in users:
        print(user["email"], "=>", user["password"][:20])
conn.close()
