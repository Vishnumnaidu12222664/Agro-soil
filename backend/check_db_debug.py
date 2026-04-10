import pymysql

def check_db():
    try:
        conn = pymysql.connect(
            host="127.0.0.1",
            user="root",
            password="Vishnu@2004",
            db="agro_ai_db"
        )
        with conn.cursor() as cursor:
            cursor.execute("DESCRIBE products")
            columns = cursor.fetchall()
            print("Columns in 'products' table:")
            for col in columns:
                print(f"  - {col[0]}: {col[1]}")
            
            cursor.execute("SELECT * FROM products LIMIT 1")
            row = cursor.fetchone()
            if row:
                print("\nOne product found in DB.")
            else:
                print("\nNo products found in DB.")
        conn.close()
    except Exception as e:
        print(f"Error checking DB: {e}")

if __name__ == "__main__":
    check_db()
