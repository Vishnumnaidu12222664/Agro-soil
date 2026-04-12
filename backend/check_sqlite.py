
import os
import sqlite3

def check_sqlite_detailed():
    possible_paths = [
        'backend/instance/agro_ai.db',
        'backend/agro_ai.db',
        'instance/agro_ai.db',
        'agro_ai.db'
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            print(f"--- Checking SQLite at {path} ---")
            conn = sqlite3.connect(path)
            cursor = conn.cursor()
            try:
                cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
                tables = cursor.fetchall()
                print("Tables:", tables)
                if ('users',) in tables:
                    cursor.execute("SELECT id, name, email FROM users")
                    print("Users:", cursor.fetchall())
                if ('products',) in tables:
                    cursor.execute("SELECT id, product_name, user_id FROM products")
                    print("Products:", cursor.fetchall())
                if ('orders',) in tables:
                    cursor.execute("SELECT id FROM orders")
                    print("Orders:", cursor.fetchall())
            except Exception as e:
                print(f"Error: {e}")
            finally:
                conn.close()
        else:
            print(f"File not found: {path}")

if __name__ == "__main__":
    check_sqlite_detailed()
