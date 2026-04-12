# Backend v2.4.3 - Model Logic Optimized for 11MB Model
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import requests
from difflib import get_close_matches
import os
import tempfile

import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'ml-models'))

from soil_model import predict_soil
from crop_model import recommend_crop_from_soil, recommend_crop_from_values
from crop_disease.model import predict_disease
from config import Config
from auth.models import db
from auth.routes import auth_blueprint
from marketplace.routes import marketplace_blueprint

app = Flask(__name__)
app.config.from_object(Config)

# Serve static files from uploads
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)

CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
db.init_app(app)
jwt = JWTManager(app)

# Register Blueprints
app.register_blueprint(auth_blueprint, url_prefix='/api/auth')
app.register_blueprint(marketplace_blueprint, url_prefix='/api')

# Create tables
with app.app_context():
    db.create_all()

API_KEY = "579b464db66ec23bdd0000014dad24afd517478257ea9f177371dc68"
BASE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

#############################
# STATIC CROP LIST (SAFE)
#############################
CROP_LIST = [
    "Rice", "Wheat", "Maize", "Cotton", "Sugarcane",
    "Barley", "Bajra", "Soybean", "Groundnut",
    "Pulses", "Onion", "Potato"
]

print("Using static crop list:", CROP_LIST)

#############################
# OPTIONAL FALLBACK STATES
#############################
FALLBACK_STATES = [
    "Punjab","Gujarat","Maharashtra","Uttar Pradesh","Madhya Pradesh",
    "Andhra Pradesh","Telangana","Rajasthan","Karnataka","West Bengal"
]

import numpy as np
from PIL import Image

#############################
# MOCK DATA FOR DEMO FALLBACK
#############################
MOCK_DATA = {
    "Paddy(Dhan)(Common)": [
        {"state": "Punjab", "district": "Amritsar", "market": "Amritsar Grain", "commodity": "Rice", "variety": "Pusa 1121", "min_price": "2850", "max_price": "3100", "modal_price": "3000"},
        {"state": "Punjab", "district": "Ludhiana", "market": "Ludhiana Market", "commodity": "Rice", "variety": "Basmati", "min_price": "3200", "max_price": "3500", "modal_price": "3400"},
        {"state": "Telangana", "district": "Nizamabad", "market": "Nizamabad Mandi", "commodity": "Rice", "variety": "BPT", "min_price": "2400", "max_price": "2700", "modal_price": "2550"},
        {"state": "Telangana", "district": "Warangal", "market": "Warangal Market", "commodity": "Rice", "variety": "Sona Masuri", "min_price": "2600", "max_price": "2900", "modal_price": "2750"}
    ],
    "Wheat": [
        {"state": "Haryana", "district": "Karnal", "market": "Karnal Mandi", "commodity": "Wheat", "variety": "Dara", "min_price": "2125", "max_price": "2250", "modal_price": "2200"},
        {"state": "Rajasthan", "district": "Kota", "market": "Kota Grain", "commodity": "Wheat", "variety": "Lokwan", "min_price": "2300", "max_price": "2500", "modal_price": "2400"}
    ],
    "Cotton": [
        {"state": "Andhra Pradesh", "district": "Guntur", "market": "Guntur Market", "commodity": "Cotton", "variety": "LRA", "min_price": "6500", "max_price": "7200", "modal_price": "6800"},
        {"state": "Gujarat", "district": "Rajkot", "market": "Rajkot Mandi", "commodity": "Cotton", "variety": "Shankar-6", "min_price": "6800", "max_price": "7500", "modal_price": "7100"}
    ],
    "Maize": [
        {"state": "Rajasthan", "district": "Jaipur", "market": "Jaipur Mandi", "commodity": "Maize", "variety": "Yellow", "min_price": "1900", "max_price": "2100", "modal_price": "2000"},
        {"state": "Karnataka", "district": "Davangere", "market": "Davangere Market", "commodity": "Maize", "variety": "Hybrid", "min_price": "1800", "max_price": "2050", "modal_price": "1950"}
    ],
    "Sugarcane": [
        {"state": "Uttar Pradesh", "district": "Meerut", "market": "Meerut Mandi", "commodity": "Sugarcane", "variety": "Common", "min_price": "340", "max_price": "360", "modal_price": "350"},
        {"state": "Maharashtra", "district": "Pune", "market": "Pune Market", "commodity": "Sugarcane", "variety": "Common", "min_price": "3100", "max_price": "3300", "modal_price": "3200"}
    ]
}

#############################
# SOIL IMAGE PREDICTION
#############################
@app.route("/predict-crop-from-soil", methods=["POST"])
def predict_crop_from_soil():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No image selected"}), 400

    # Task 2, Step 1: Validate file type
    allowed_ext = {'jpg', 'jpeg', 'png'}
    ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else ''
    if ext not in allowed_ext:
        return jsonify({"error": "Invalid file type. Only JPG, JPEG, and PNG are allowed."}), 400

    with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{ext}') as temp_file:
        file.save(temp_file.name)
        temp_path = temp_file.name

    try:
        # Task 2, Step 3: Variance check to ensure it's not a blank/single-color image
        with Image.open(temp_path) as img:
            img_arr = np.array(img.convert("L"))
            variance = np.var(img_arr)
            if variance < 50:  # Threshold for single-color or blank image
                return jsonify({"error": "Invalid or unclear soil image. Please upload a proper soil image."}), 400

        # Task 2, Step 2: Prediction + Confidence check
        soil_type, confidence = predict_soil(temp_path)
        print(f"Predicted soil type: {soil_type} (Confidence: {confidence:.2f})")

        if confidence < 0.6:
            return jsonify({
                "error": "Invalid or unclear soil image. Please upload a proper soil image."
            }), 400

        recommended_crop = recommend_crop_from_soil(soil_type)
        print(f"Recommended crop: {recommended_crop}")

        return jsonify({
            "soil_type": soil_type,
            "recommended_crop": recommended_crop,
            "confidence": float(confidence)
        })

    except Exception as e:
        print(f"Error in prediction: {e}")
        return jsonify({"error": "Prediction failed"}), 500

    finally:
        if os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except:
                pass

#############################
# VALUE-BASED PREDICTION
#############################
@app.route("/predict-crop-from-values", methods=["POST"])
def predict_crop():
    data = request.json
    try:
        features = {
            'n': float(data.get('N', 0)),
            'p': float(data.get('P', 0)),
            'k': float(data.get('K', 0)),
            'ph': float(data.get('ph', 0)),
            'temperature': float(data.get('temperature', 0)),
            'humidity': float(data.get('humidity', 0)),
            'rainfall': float(data.get('rainfall', 0))
        }
        recommended_crop = recommend_crop_from_values(features)
        return jsonify({"recommended_crop": recommended_crop})
    except Exception as e:
        return jsonify({"error": "Invalid input data"}), 400

#############################
# CROP NAME NORMALIZATION
#############################
def map_crop_name(crop):
    crop_map = {
        "rice": "Paddy(Dhan)(Common)",
        "wheat": "Wheat",
        "cotton": "Cotton",
        "maize": "Maize",
        "pulses": "Gram(Raw)",
        "onion": "Onion",
        "potato": "Potato"
    }
    
    crop_lower = crop.lower().strip()
    if crop_lower in crop_map:
        return crop_map[crop_lower]

    matches = get_close_matches(crop_lower, [c.lower() for c in CROP_LIST], n=1, cutoff=0.6)
    if matches:
        index = [c.lower() for c in CROP_LIST].index(matches[0])
        return CROP_LIST[index]

    return None

#############################
# NEW: GET STATES FOR CROP
#############################
@app.route("/get-states-for-crop", methods=["POST"])
def get_states_for_crop():
    data = request.get_json()
    crop = data.get("crop", "").strip()

    print("📩 Requested states for crop:", crop)

    normalized_crop = map_crop_name(crop)
    if not normalized_crop:
        print("⚠ No matching crop found, returning empty list")
        return jsonify({"crop": crop, "states": []})

    print("🔍 Normalized crop:", normalized_crop)

    params = {
        "api-key": API_KEY,
        "format": "json",
        "limit": 500,
        "filters[commodity]": normalized_crop
    }

    try:
        res = requests.get(BASE_URL, params=params)
        data = res.json()

        # FALLBACK FOR DEMO IF API KEY IS INVALID
        if not data.get("records") or "error" in data:
            if normalized_crop in MOCK_DATA:
                states = sorted(list(set(r["state"] for r in MOCK_DATA[normalized_crop])))
                print(f"🔄 Using mock states for {normalized_crop}: {states}")
                return jsonify({"crop": normalized_crop, "states": states})
            
            print(f"⚠ API Error or Empty and no mock data for: {normalized_crop}")
            return jsonify({"crop": normalized_crop, "states": []})

        states = sorted(set(r["state"] for r in data["records"]))
        return jsonify({"crop": normalized_crop, "states": states})

    except Exception as e:
        print("❌ ERROR (get_states_for_crop):", e)
        return jsonify({"crop": crop, "states": FALLBACK_STATES})

#############################
# MARKET PRICE API (RESTORED)
#############################
@app.route("/get-crop-price", methods=["POST"])
def get_crop_price():
    data = request.get_json()
    crop = data.get("crop", "").strip()
    state = data.get("state", "").strip()

    print(f"📩 Requested prices for: {crop} in {state}")

    normalized_crop = map_crop_name(crop)
    if not normalized_crop:
        return jsonify({"error": f"Crop '{crop}' not found"}), 400

    params = {
        "api-key": API_KEY,
        "format": "json",
        "limit": 50,
        "filters[commodity]": normalized_crop
    }
    
    if state:
        params["filters[state]"] = state

    try:
        res = requests.get(BASE_URL, params=params)
        data = res.json()

        if not data.get("records"):
            # MOCK DATA FALLBACK FOR DEMO
            if normalized_crop in MOCK_DATA:
                filtered = [r for r in MOCK_DATA[normalized_crop] if not state or r["state"] == state]
                print(f"🔄 Using mock prices for {normalized_crop} (State: {state}) - Found {len(filtered)} records")
                return jsonify({"prices": filtered})
            return jsonify({"prices": []})

        formatted = [
            {
                "state": r.get("state"),
                "district": r.get("district"),
                "market": r.get("market"),
                "commodity": r.get("commodity"),
                "variety": r.get("variety"),
                "arrival_date": r.get("arrival_date"),
                "min_price": r.get("min_price"),
                "max_price": r.get("max_price"),
                "modal_price": r.get("modal_price")
            }
            for r in data["records"]
        ]

        return jsonify({"prices": formatted})

    except Exception as e:
        print(f"❌ ERROR (get_crop_price): {e}")
        return jsonify({"error": "Server error while fetching market data"}), 500


#############################
# CROP DISEASE PREDICTION
#############################
@app.route("/api/disease/predict", methods=["POST"])
def detect_disease():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No image selected"}), 400

    # Validate file type
    allowed_ext = {'jpg', 'jpeg', 'png'}
    ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else ''
    if ext not in allowed_ext:
        return jsonify({"error": "Invalid file type. Only JPG, JPEG, and PNG are allowed."}), 400

    # Save image temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{ext}') as temp_file:
        file.save(temp_file.name)
        temp_path = temp_file.name

    try:
        # Check image validity (optional but good)
        with Image.open(temp_path) as img:
            img_arr = np.array(img.convert("L"))
            if np.var(img_arr) < 50:
                return jsonify({"error": "Please upload a valid leaf image (not blank or single-color)."}), 400

        # Predict
        result = predict_disease(temp_path)
        if "error" in result:
            return jsonify({"error": result["error"]}), 500

        print(f"Disease Prediction: {result['disease']} ({result['confidence']:.2f}%)")
        return jsonify(result)

    except Exception as e:
        print(f"Error in disease prediction: {e}")
        return jsonify({"error": "Prediction processing failed."}), 500

    finally:
        if os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except:
                pass


#############################
# FRONTEND SUPPORT
#############################
@app.route("/get-crops", methods=["GET"])
def get_crops():
    return jsonify({"crops": CROP_LIST})

#############################
# RUN
#############################
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=False)