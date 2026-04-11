from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from auth.models import Product, User, Order, db
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

    try:
        # Clear existing to prevent duplicates if user clicks twice
        Product.query.filter_by(user_id=user_id).delete()
        db.session.commit()

        # 1. Define specific products required for the mock orders
        product_list = [
            {"name": "Potatoes", "price": 30, "qty": 1000, "loc": "Ludhiana, Punjab"},
            {"name": "Grapes", "price": 90, "qty": 500, "loc": "Patiala, Punjab"},
            {"name": "Wheat", "price": 32, "qty": 2000, "loc": "Amritsar, Punjab"},
            {"name": "Maize", "price": 30, "qty": 1500, "loc": "Chandigarh, Punjab"}
        ]

        inserted_products = {}
        for p in product_list:
            new_p = Product(
                user_id=user.id, 
                farmer_name=user.name, 
                product_name=p["name"], 
                price_per_kg=p["price"], 
                quantity=p["qty"], 
                location=p["loc"], 
                delivery_radius=100
            )
            db.session.add(new_p)
            inserted_products[p["name"]] = new_p
        
        db.session.flush() # Get IDs

        # 2. Add precisely the 20 mock orders requested
        mock_orders = [
            {"customer": "Ramesh Kumar", "phone": "9876543210", "p": "Potatoes", "address": "12 Model Town, Ludhiana, Punjab", "qty": 25, "total": 750},
            {"customer": "Priya Sharma", "phone": "9123456780", "p": "Grapes", "address": "45 Urban Estate, Patiala, Punjab", "qty": 10, "total": 900},
            {"customer": "Anil Verma", "phone": "9988776655", "p": "Wheat", "address": "78 Green Avenue, Amritsar, Punjab", "qty": 50, "total": 1600},
            {"customer": "Sneha Reddy", "phone": "9012345678", "p": "Maize", "address": "22 Sector 21, Chandigarh, Punjab", "qty": 40, "total": 1200},
            {"customer": "Vikram Singh", "phone": "9898989898", "p": "Potatoes", "address": "90 Civil Lines, Jalandhar, Punjab", "qty": 30, "total": 900},
            {"customer": "Kavya Patel", "phone": "9765432101", "p": "Grapes", "address": "14 Mall Road, Bathinda, Punjab", "qty": 15, "total": 1350},
            {"customer": "Rohit Mehta", "phone": "9345678901", "p": "Wheat", "address": "5 Ferozepur Road, Ludhiana, Punjab", "qty": 60, "total": 1920},
            {"customer": "Meena Joshi", "phone": "9456123789", "p": "Maize", "address": "33 Shastri Nagar, Hoshiarpur, Punjab", "qty": 35, "total": 1050},
            {"customer": "Suresh Yadav", "phone": "9871203456", "p": "Potatoes", "address": "67 GT Road, Amritsar, Punjab", "qty": 20, "total": 600},
            {"customer": "Pooja Nair", "phone": "9090909090", "p": "Grapes", "address": "18 Rose Garden, Jalandhar, Punjab", "qty": 12, "total": 1080},
            {"customer": "Harish Gupta", "phone": "9811122233", "p": "Wheat", "address": "101 Sector 15, Mohali, Punjab", "qty": 45, "total": 1440},
            {"customer": "Lakshmi Devi", "phone": "9700011122", "p": "Maize", "address": "56 Main Bazaar, Patiala, Punjab", "qty": 55, "total": 1650},
            {"customer": "Arjun Rao", "phone": "9632587410", "p": "Potatoes", "address": "88 Guru Nanak Nagar, Ludhiana, Punjab", "qty": 18, "total": 540},
            {"customer": "Divya Kapoor", "phone": "9874512360", "p": "Grapes", "address": "29 Residency Area, Amritsar, Punjab", "qty": 8, "total": 720},
            {"customer": "Naveen Choudhary", "phone": "9556677889", "p": "Wheat", "address": "11 Farmers Colony, Barnala, Punjab", "qty": 70, "total": 2240},
            {"customer": "Sunita Mishra", "phone": "9445566778", "p": "Maize", "address": "74 Ring Road, Mohali, Punjab", "qty": 25, "total": 750},
            {"customer": "Kiran Babu", "phone": "9988007766", "p": "Potatoes", "address": "42 Railway Colony, Pathankot, Punjab", "qty": 40, "total": 1200},
            {"customer": "Asha Jain", "phone": "9312345670", "p": "Grapes", "address": "65 Market Street, Moga, Punjab", "qty": 20, "total": 1800},
            {"customer": "Mohan Lal", "phone": "9822334455", "p": "Wheat", "address": "78 Old Bus Stand Road, Sangrur, Punjab", "qty": 35, "total": 1120},
            {"customer": "Rekha Soni", "phone": "9001122334", "p": "Maize", "address": "53 New Colony, Fazilka, Punjab", "qty": 30, "total": 900}
        ]

        for mo in mock_orders:
            prod = inserted_products[mo["p"]]
            order = Order(
                product_id=prod.id,
                customer_name=mo["customer"],
                customer_phone=mo["phone"],
                delivery_address=mo["address"],
                quantity=mo["qty"],
                total_price=mo["total"]
            )
            prod.orders_count += 1
            prod.earnings += mo["total"]
            db.session.add(order)

        db.session.commit()
        return jsonify({"msg": "Successfully initialized 20 custom order history records!"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Seeding failed", "error": str(e)}), 500

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

    # Simulated Customer Data (In a real app, this comes from the buyer)
    import random
    names = ["Aravind Sharma", "Priya Patel", "Vikram Singh", "Ananya Reddy", "Rahul Verma"]
    addresses = ["123, Green Park, Delhi", "Sector 45, Gurgaon", "MG Road, Bangalore", "Civil Lines, Jaipur", "Park Street, Kolkata"]
    
    customer_name = random.choice(names)
    customer_phone = f"+91 {random.randint(70000, 99999)} {random.randint(10000, 50000)}"
    delivery_address = random.choice(addresses)
    order_qty = 10.0 # Standard simulation
    total_price = product.price_per_kg * order_qty

    try:
        # Create detailed order
        new_order = Order(
            product_id=product_id,
            customer_name=customer_name,
            customer_phone=customer_phone,
            delivery_address=delivery_address,
            quantity=order_qty,
            total_price=total_price
        )
        
        # Update product stats
        product.orders_count += 1
        product.earnings += total_price

        db.session.add(new_order)
        db.session.commit()

        return jsonify({
            "msg": "Order placed successfully!", 
            "order": new_order.to_dict(),
            "new_stats": {
                "orders_count": product.orders_count,
                "earnings": product.earnings
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Failed to place order", "error": str(e)}), 500

@marketplace_blueprint.route('/products/orders/my', methods=['GET'])
@jwt_required()
def get_my_incoming_orders():
    user_id = int(get_jwt_identity())
    # Find all products belonging to this user
    user_products = Product.query.filter_by(user_id=user_id).all()
    product_ids = [p.id for p in user_products]
    
    # Find all orders for these products
    orders = Order.query.filter(Order.product_id.in_(product_ids)).order_by(Order.created_at.desc()).all()
    
    return jsonify([o.to_dict() for o in orders]), 200

@marketplace_blueprint.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    user_id = int(get_jwt_identity())
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({"msg": "Product not found"}), 404
        
    if product.user_id != user_id:
        return jsonify({"msg": "Unauthorized to delete this product"}), 403
        
    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({"msg": "Product removed successfully from registry"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Failed to delete product", "error": str(e)}), 500
