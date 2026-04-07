import os
import datetime
from urllib.parse import quote_plus

def _get_db_uri():
    try:
        from urllib.parse import quote_plus
        user = os.getenv('DB_USER', "root")
        # Ensure we quote the password properly
        raw_pwd = "Vishnu@2004"
        pwd = quote_plus(raw_pwd)
        host = os.getenv('DB_HOST', "127.0.0.1")
        db_name = os.getenv('DB_NAME', "agro_ai_db")
        uri = f'mysql+pymysql://{user}:{pwd}@{host}/{db_name}'
        print(f"DEBUG: Using DB URI: mysql+pymysql://{user}:*****@{host}/{db_name}")
        return uri
    except Exception as e:
        print(f"DEBUG: DB CONFIG ERROR: {str(e)}")
        return 'sqlite:///agro_ai.db'

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', _get_db_uri())
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'agro-ai-super-secret-key-123')
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(days=30)
