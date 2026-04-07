import os
from PIL import Image
import joblib
import numpy as np

# Load trained soil classifier
model_file = os.path.join(os.path.dirname(__file__), "soil_classifier.joblib")
model_data = joblib.load(model_file)
soil_model = model_data["model"]
soil_classes = model_data["classes"]

# Function to predict soil type from image
def predict_soil(img_path):
    # Process image
    img = Image.open(img_path).convert("L").resize((64, 64))
    x = np.array(img).flatten().reshape(1, -1)
    
    # Get prediction and confidence
    try:
        # Check if model supports probability estimates
        if hasattr(soil_model, "predict_proba"):
            probs = soil_model.predict_proba(x)[0]
            pred_index = np.argmax(probs)
            confidence = probs[pred_index]
        else:
            # Fallback for models without predict_proba
            pred_index = soil_model.predict(x)[0]
            confidence = 1.0  # Placeholder confidence
            
        return soil_classes[pred_index], confidence
    except Exception as e:
        print(f"Error in model prediction: {e}")
        return None, 0.0
