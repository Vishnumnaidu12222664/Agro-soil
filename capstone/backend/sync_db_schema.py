from flask_sqlalchemy import SQLAlchemy
from auth.models import db, Product, User
from app_new import app
from sqlalchemy import text

def sync_db():
    with app.app_context():
        print("Dropping 'products' table to sync with current model...")
        try:
            # We only drop 'products' because 'users' seems important if they are logged in
            db.session.execute(text("DROP TABLE IF EXISTS products"))
            db.session.commit()
            print("'products' table dropped.")
        except Exception as e:
            print(f"Warning during DROP: {e}")
            db.session.rollback()
        
        print("Creating all tables from current models...")
        db.create_all()
        print("Success! Tables created.")

if __name__ == "__main__":
    sync_db()
