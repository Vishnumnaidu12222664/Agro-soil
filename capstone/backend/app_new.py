from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import requests
from difflib import get_close_matches
import os
import tempfile

from ml_model.soil_model import predict_soil
from ml_model.crop_model import recommend_crop_from_soil, recommend_crop_from_values
from config import Config
from auth.models import db
from auth.routes import auth_blueprint

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
db.init_app(app)
jwt = JWTManager(app)

# Register Blueprints
app.register_blueprint(auth_blueprint, url_prefix='/api/auth')

# Create tables
with app.app_context():
    db.create_all()

API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"
BASE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

#############################
# STATIC CROP LIST (SAFE)
#############################
CROP_LIST = [
    "Rice", "Wheat", "Maize", "Cotton", "Sugarcane",
    "Barley", "Bajra", "Soybean", "Groundnut",
    "Pulses", "Onion", "Potato"
]

print("✔ Using static crop list:", CROP_LIST)

#############################
# OPTIONAL FALLBACK STATES
#############################
FALLBACK_STATES = [
    "Punjab","Gujarat","Maharashtra","Uttar Pradesh","Madhya Pradesh",
    "Andhra Pradesh","Telangana","Rajasthan","Karnataka","West Bengal"
]

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

    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
        file.save(temp_file.name)
        temp_path = temp_file.name

    try:
        soil_type = predict_soil(temp_path)
        print(f"🟢 Predicted soil type: {soil_type}")

        recommended_crop = recommend_crop_from_soil(soil_type)
        print(f"🟢 Recommended crop: {recommended_crop}")

        return jsonify({
            "soil_type": soil_type,
            "recommended_crop": recommended_crop
        })


    except Exception as e:
        print(f"❌ Error in prediction: {e}")
        return jsonify({"error": "Prediction failed"}), 500

    finally:
        if os.path.exists(temp_path):
            os.unlink(temp_path)

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

        print(f"📩 Received features: {features}")

        recommended_crop = recommend_crop_from_values(features)
        print(f"🟢 Predicted crop: {recommended_crop}")

        return jsonify({"recommended_crop": recommended_crop})

    except Exception as e:
        print(f"❌ Error in prediction: {e}")
        return jsonify({"error": "Invalid input data"}), 400

#############################
# CROP NAME NORMALIZATION
#############################
def map_crop_name(crop):
    crop = crop.lower().strip()
    matches = get_close_matches(crop, [c.lower() for c in CROP_LIST], n=1, cutoff=0.6)

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

        if not data.get("records"):
            print(f"⚠ No states found for {normalized_crop}")
            return jsonify({"crop": normalized_crop, "states": []})

        states = sorted(set(r["state"] for r in data["records"]))

        print(f"🟢 Found {len(states)} states:", states)

        return jsonify({"crop": normalized_crop, "states": states})

    except Exception as e:
        print("❌ ERROR (get_states_for_crop):", e)
        return jsonify({"crop": crop, "states": []})

#############################
# MARKET PRICE API
#############################
@app.route("/get-crop-price", methods=["POST"])
def get_crop_price():
    data = request.get_json()
    crop = data.get("crop", "").strip()
    state = data.get("state", "").strip().title()

    print("📩 Received:", data)

    normalized_crop = map_crop_name(crop)
    if not normalized_crop:
        return jsonify({"error": f"Crop '{crop}' not found in available crops"}), 400

    print("🔍 Normalized:", normalized_crop, state)

    params = {
        "api-key": API_KEY,
        "format": "json",
        "limit": 50,
        "filters[state.keyword]": state,
        "filters[commodity]": normalized_crop
    }

    try:
        res = requests.get(BASE_URL, params=params)
        data = res.json()

        if not data.get("records"):
            return jsonify({"prices": []})

        formatted = [
            {
                "state": r["state"],
                "district": r["district"],
                "market": r["market"],
                "date": r["arrival_date"],
                "min_price": r["min_price"],
                "max_price": r["max_price"],
                "modal_price": r["modal_price"]
            }
            for r in data["records"]
        ]

        return jsonify({"prices": formatted})

    except Exception as e:
        print("❌ ERROR:", e)
        return jsonify({"error": "Server error"}), 500

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
    app.run(debug=True)
