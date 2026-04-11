from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    profile_image = db.Column(db.String(500))
    land_image = db.Column(db.String(500))
    location = db.Column(db.String(200))
    land_acres = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "is_verified": self.is_verified,
            "profile_image": self.profile_image,
            "land_image": self.land_image,
            "location": self.location,
            "land_acres": self.land_acres,
            "created_at": self.created_at.isoformat()
        }

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    farmer_name = db.Column(db.String(100)) # Duplicate allowed per request
    product_name = db.Column(db.String(100), nullable=False)
    price_per_kg = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    delivery_radius = db.Column(db.Integer)
    image_url = db.Column(db.String(500))
    orders_count = db.Column(db.Integer, default=0)
    earnings = db.Column(db.Float, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship to user
    owner = db.relationship('User', backref=db.backref('products_owned', lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "farmer_name": self.farmer_name or (self.owner.name if self.owner else "Unknown"),
            "product_name": self.product_name,
            "price_per_kg": self.price_per_kg,
            "quantity": self.quantity,
            "location": self.location,
            "delivery_radius": self.delivery_radius,
            "image_url": self.image_url,
            "orders_count": self.orders_count,
            "earnings": self.earnings,
            "created_at": self.created_at.isoformat(),
            "is_verified": self.owner.is_verified if self.owner else False
        }

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_phone = db.Column(db.String(20), nullable=False)
    delivery_address = db.Column(db.String(500), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship to product
    product = db.relationship('Product', backref=db.backref('orders_list', lazy=True, cascade="all, delete-orphan"))

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "product_name": self.product.product_name if self.product else "Deleted Product",
            "customer_name": self.customer_name,
            "customer_phone": self.customer_phone,
            "delivery_address": self.delivery_address,
            "quantity": self.quantity,
            "total_price": self.total_price,
            "created_at": self.created_at.isoformat()
        }


