from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from auth.models import Product, User, db
from werkzeug.utils import secure_filename
import os
import uuid

marketplace_blueprint = Blueprint('marketplace', __name__)

# Helper to save images
def save_image(file):
    if not file: return None
    ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else 'png'
    filename = f"{uuid.uuid4().hex}.{ext}"
    upload_path = os.path.join(os.getcwd(), 'uploads', filename)
    file.save(upload_path)
    return f"http://127.0.0.1:5000/uploads/{filename}"

@marketplace_blueprint.route('/products/add', methods=['POST'])
@jwt_required()
def add_product():
    user_id = int(get_jwt_identity())
    
    # Handle both JSON and Form Data
    if request.is_json:
        data = request.get_json()
        image_url = data.get('image_url')
    else:
        # Form data (with optional file upload)
        data = request.form
        image_file = request.files.get('image')
        image_url = save_image(image_file) if image_file else data.get('image_url')

    # Get user details for name
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Authenticated user not found in database. Please log in again."}), 404

    # Priority: DB name -> Form data name -> Default
    farmer_name = user.name or data.get('farmer_name') or "Independent Farmer"

    # Safe float and int conversion
    def safe_float(val):
        try:
            return float(val) if val and str(val).strip() else 0.0
        except ValueError:
            return 0.0
            
    def safe_int(val):
        try:
            return int(val) if val and str(val).strip() else 0
        except ValueError:
            return 0

    try:
        new_product = Product(
            user_id=user_id,
            farmer_name=farmer_name,
            product_name=data.get('product_name'),
            price_per_kg=safe_float(data.get('price_per_kg', 0)),
            quantity=safe_float(data.get('quantity', 0)),
            location=data.get('location'),
            delivery_radius=safe_int(data.get('delivery_radius', 0)),
            image_url=image_url
        )

        db.session.add(new_product)
        db.session.commit()
        return jsonify({"msg": "Product listed successfully", "product": new_product.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error adding product: {str(e)}")
        return jsonify({"msg": "Failed to add product to database", "error": str(e)}), 500

# --- ADDITIONAL: SEEDING DUPLICATE DATA ---
@marketplace_blueprint.route('/debug/seed', methods=['POST'])
@jwt_required()
def seed_user_data():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user: return jsonify({"error": "User not found"}), 404

    # Add dummy products
    p1 = Product(user_id=user.id, farmer_name=user.name, product_name="Organic Basmati Rice", 
                 price_per_kg=85.0, quantity=500.0, location="Ludhiana, Punjab", delivery_radius=100,
                 earnings=12750.0, orders_count=15)
    p2 = Product(user_id=user.id, farmer_name=user.name, product_name="Premium Wheat", 
                 price_per_kg=35.0, quantity=1200.0, location="Kanpur, UP", delivery_radius=50,
                 earnings=8400.0, orders_count=24)
    p3 = Product(user_id=user.id, farmer_name=user.name, product_name="Yellow Onions", 
                 price_per_kg=22.0, quantity=300.0, location="Nasik, Maharashtra", delivery_radius=80,
                 earnings=4400.0, orders_count=10)

    db.session.add_all([p1, p2, p3])
    db.session.commit()
    return jsonify({"msg": "Successfully added 3 sample products and revenue to your account!"})

@marketplace_blueprint.route('/products', methods=['GET'])
def get_all_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products]), 200

@marketplace_blueprint.route('/products/my', methods=['GET'])
@jwt_required()
def get_my_products():
    user_id = int(get_jwt_identity())
    products = Product.query.filter_by(user_id=user_id).all()
    return jsonify([p.to_dict() for p in products]), 200

@marketplace_blueprint.route('/products/order/<int:product_id>', methods=['POST'])
def order_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Product not found"}), 404

    # Simple Simulation
    product.orders_count += 1
    product.earnings += product.price_per_kg

    db.session.commit()

    return jsonify({
        "msg": "Order placed successfully!", 
        "orders_count": product.orders_count,
        "earnings": product.earnings
    }), 200
