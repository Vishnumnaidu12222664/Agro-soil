import pymysql
import os

try:
    conn = pymysql.connect(host='127.0.0.1', user='root', password='Vishnu@2004')
    print('MySQL connection established.')
    with conn.cursor() as cursor:
        cursor.execute("SHOW DATABASES")
        databases = [db[0] for db in cursor.fetchall()]
        print(f'Databases: {databases}')
        if 'agro_ai_db' in databases:
            print('agro_ai_db exists.')
            cursor.execute("USE agro_ai_db")
            cursor.execute("SHOW TABLES")
            tables = [t[0] for t in cursor.fetchall()]
            print(f'Tables: {tables}')
        else:
            print('agro_ai_db DOES NOT EXIST.')
except Exception as e:
    print(f'Error: {e}')
finally:
    if 'conn' in locals():
        conn.close()
