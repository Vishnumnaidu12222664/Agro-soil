import pymysql
import sys

# Change these if you have a MySQL password
DB_USER = "root"
DB_PASSWORD = "Vishnu@2004"
DB_HOST = "localhost"
DB_NAME = "agro_ai_db"

def init_db():
    print(f"Connecting to MySQL at {DB_HOST}...")
    try:
        # Connect without specific DB
        conn = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD
        )
        with conn.cursor() as cursor:
            print(f"Checking if database '{DB_NAME}' exists...")
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
            print(f"✅ Successfully ensured '{DB_NAME}' exists!")
        conn.close()
        return True
    except Exception as e:
        print(f"❌ ERROR: Could not connect to MySQL.")
        print(f"Detail: {e}")
        print("\nFix solutions:")
        print(f"1. Check if MySQL is running (I see 'MySQL80' service is started).")
        print(f"2. If you have a root password, open 'setup_db.py' and 'config.py' and update DB_PASSWORD.")
        print(f"3. Ensure the 'pymysql' package is installed in your venv.")
        return False

if __name__ == "__main__":
    if init_db():
        print("\n🚀 Now you can restart the backend using: .\\venv\\Scripts\\python.exe app_new.py")
    else:
        sys.exit(1)
