
import os
import sqlite3
import pymysql

def check_mysql():
    user = os.getenv('DB_USER', "root")
    pwd = "Vishnu@2004"
    host = os.getenv('DB_HOST', "127.0.0.1")
    db_name = os.getenv('DB_NAME', "agro_ai_db")
    
    print(f"--- Detailed MySQL Check ---")
    try:
        conn = pymysql.connect(host=host, user=user, password=pwd, database=db_name)
        cursor = conn.cursor()
        
        print("\nUSERS:")
        cursor.execute("SELECT id, name, email FROM users")
        for u in cursor.fetchall():
            print(u)
            
        print("\nPRODUCTS:")
        cursor.execute("SELECT id, product_name, user_id FROM products")
        for p in cursor.fetchall():
            print(p)
            
        print("\nORDERS:")
        cursor.execute("SELECT id, product_id FROM orders LIMIT 5")
        for o in cursor.fetchall():
            print(o)
            
        conn.close()
    except Exception as e:
        print(f"MySQL Error: {e}")

if __name__ == "__main__":
    check_mysql()
