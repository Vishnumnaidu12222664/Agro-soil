
import sys
import os
# Add current directory to path so we can import app_new
sys.path.append(os.getcwd())
sys.path.append(os.path.join(os.getcwd(), 'backend'))

try:
    from backend.app_new import app
    print("SQLALCHEMY_DATABASE_URI:", app.config['SQLALCHEMY_DATABASE_URI'])
except Exception as e:
    print(f"Error importing app: {e}")
