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
    img = Image.open(img_path).convert("L").resize((64, 64))
    x = np.array(img).flatten().reshape(1, -1)
    pred_index = soil_model.predict(x)[0]
    return soil_classes[pred_index]
