from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models import User, db
from werkzeug.utils import secure_filename
import os
import uuid

auth_blueprint = Blueprint('auth', __name__)

def save_image(file):
    if not file: return None
    ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else 'png'
    filename = f"{uuid.uuid4().hex}.{ext}"
    upload_path = os.path.join(os.getcwd(), 'uploads', filename)
    os.makedirs(os.path.join(os.getcwd(), 'uploads'), exist_ok=True)
    file.save(upload_path)
    return f"http://127.0.0.1:5000/uploads/{filename}"

@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"msg": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already registered"}), 400

    new_user = User(name=name, email=email)
    new_user.set_password(password)
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully"}), 201

@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"msg": "Invalid email or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify(access_token=access_token, user=user.to_dict()), 200

@auth_blueprint.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
        
    return jsonify(user.to_dict()), 200

@auth_blueprint.route('/profile/update', methods=['POST'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user: return jsonify({"error": "User not found"}), 404

    # Handle form data for file uploads
    data = request.form
    profile_image = request.files.get('profile_image')
    land_image = request.files.get('land_image')

    if profile_image:
        user.profile_image = save_image(profile_image)
    if land_image:
        user.land_image = save_image(land_image)
    
    if 'name' in data: user.name = data.get('name')
    if 'location' in data: user.location = data.get('location')
    if 'land_acres' in data:
        try:
             user.land_acres = float(data.get('land_acres'))
        except: pass

    db.session.commit()
    return jsonify({"msg": "Profile updated successfully!", "user": user.to_dict()}), 200

@auth_blueprint.route('/profile/verify', methods=['POST'])
@jwt_required()
def verify_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user: return jsonify({"error": "User not found"}), 404

    # Mocking payment success as requested
    user.is_verified = True
    db.session.commit()
    return jsonify({"msg": "Congratulations! You are now a Verified Farmer.", "user": user.to_dict()}), 200
