import os
import joblib
import numpy as np

# --- Soil type mapping ---
soil_crop_map = {
    "Black Soil": "Cotton",
    "Cinder Soil": "Maize",
    "Laterite Soil": "Rice",
    "Peat Soil": "Vegetables",
    "Yellow Soil": "Wheat"
}

def recommend_crop_from_soil(soil_type):
    """Return crop recommendation based on soil type."""
    return soil_crop_map.get(
        soil_type, "Sorry, I can't determine the best crop for this soil type."
    )

# --- Load models ---
base_dir = os.path.dirname(__file__)

# Old (4-feature) model
crop_model_path = os.path.join(base_dir, "crop_model.joblib")
crop_data = joblib.load(crop_model_path)
crop_model = crop_data["model"]

# New dataset model
new_crop_model_path = os.path.join(base_dir, "crop_recommender.joblib")
new_crop_data = joblib.load(new_crop_model_path)
new_crop_model = new_crop_data["model"]
new_crop_columns = new_crop_data["columns"]

def recommend_crop_from_values(features):
    """
    Auto-detect which model to use based on available input keys.
    - Try NEW dataset model first (more features)
    - Fallback to OLD 4-feature model
    """
    # Lowercase keys for flexibility + ensure numeric
    features = {k.lower(): float(v) for k, v in features.items()}

    # --- 1) Try NEW model first ---
    try:
        if all(col.lower() in features for col in new_crop_columns):
            x_input = np.array([[features[col.lower()] for col in new_crop_columns]])
            pred = new_crop_model.predict(x_input)[0]
            print("🟢 Using NEW crop model →", pred)
            return pred
    except Exception as e:
        print("❌ Error using NEW crop model:", e)

    # --- 2) Fallback to OLD model ---
    if all(k in features for k in ['n', 'p', 'k', 'ph']):
        x_input = np.array([[features['n'], features['p'], features['k'], features['ph']]])
        pred = crop_model.predict(x_input)[0]
        print("🟡 Using OLD crop model →", pred)
        return pred

    # --- 3) Invalid input ---
    print("❌ Invalid input features:", features)
    return "Invalid input features. Please check your field names and values."

