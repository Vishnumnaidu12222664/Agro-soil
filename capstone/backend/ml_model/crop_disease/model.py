import os
import cv2
import numpy as np
import tensorflow as tf
from googlesearch import search
import requests
from bs4 import BeautifulSoup

# Use tf_keras for better compatibility with older Keras 2 models
try:
    import tf_keras as keras
    from tf_keras.models import load_model
except ImportError:
    from tensorflow import keras
    from tensorflow.keras.models import load_model

# Get base path for model file
base_dir = os.path.dirname(__file__)
model_path = os.path.join(base_dir, "model.h5")

# --- COMPATIBILITY BRIDGE ---
class CustomSequential(keras.models.Sequential):
    def __init__(self, *args, **kwargs):
        for key in ['quantization_config', 'batch_shape', 'optional', 'ragged', 'sparse']:
            kwargs.pop(key, None)
        super().__init__(*args, **kwargs)

class CustomInputLayer(keras.layers.InputLayer):
    def __init__(self, *args, **kwargs):
        kwargs.pop('optional', None)
        if 'batch_shape' in kwargs and 'input_shape' not in kwargs:
            kwargs['input_shape'] = kwargs['batch_shape'][1:]
        kwargs.pop('batch_shape', None)
        super().__init__(*args, **kwargs)

# --- ADVANCED TREATMENT DATABASE ---
# High-quality manual treatments for all 29 classes to ensure reliability
disease_treatments = {
    "Apple Scab": "Apply copper-based fungicides in early spring. Remove fallen leaves to prevent soil-borne reinfection.",
    "Apple Black Rot": "Prune out dead wood and remove mummified fruit. Apply fungicides during the dormant season.",
    "Apple Cedar Rust": "Remove nearby cedar trees if possible. Apply fungicides at 'bud break' stage.",
    "Apple Healthy": "Maintain regular pruning and fertilization. Monitor for pests.",
    "Cherry Powdery Mildew": "Prune for better air circulation. Apply sulfur-based fungicides if humidity is high.",
    "Cherry Healthy": "Ensure proper watering and mulch. Monitor for leaf spot.",
    "Corn Gray Leaf Spot": "Practice crop rotation with non-host crops like soybeans. Till crop residue into soil.",
    "Corn Common Rust": "Use resistant maize hybrids. Apply fungicides like Pyraclostrobin if infestation is early.",
    "Corn Northern Leaf Blight": "Increase plant spacing for better airflow. Use resistant varieties.",
    "Corn Healthy": "Monitor for nutrient deficiencies. Maintain soil pH (6.0-6.8).",
    "Grape Black Rot": "Remove all 'mummies' (dried grapes). Apply mancozeb or captan during early bloom.",
    "Grape Black Measles (Esca)": "Protect pruning wounds with seals. Remove dead vines to reduce spore load.",
    "Grape Leaf Blight": "Minimize overhead irrigation. Burn infected leaf litter in autumn.",
    "Grape Healthy": "Regular weeding and balanced N-P-K fertilization.",
    "Peach Bacterial Spot": "Avoid high-nitrogen fertilizers. Apply copper sprays during dormancy.",
    "Peach Healthy": "Practice winter pruning for sunlight penetration.",
    "Pepper Bell Bacterial Spot": "Use path-certified seeds. Practice 3-year crop rotation. Avoid overhead watering.",
    "Pepper Bell Healthy": "Monitor for aphids and keep soil moist but not soggy.",
    "Potato Early Blight": "Ensure balanced soil nutrition (especially Potassium). Destroy volunteer potato plants.",
    "Potato Late Blight": "Critical: Apply fungicides like Chlorothalonil immediately. Destroy infected plants to prevent spread.",
    "Potato Healthy": "Use certified seed tubers. Monitor soil moisture.",
    "Squash Powdery Mildew": "Choose resistant squash varieties. Apply milk-water spray (1:9 ratio) as a organic remedy.",
    "Strawberry Leaf Scorch": "Avoid planting in poorly drained soils. Renounce beds after harvest.",
    "Strawberry Healthy": "Keep mulch dry. Monitor for spider mites.",
    "Tomato Bacterial Spot": "Treat seeds with hot water (50°C for 25 mins). Avoid working in fields when wet.",
    "Tomato Early Blight": "Prune lower leaves to prevent splash-up. Maintain 2-3 feet spacing.",
    "Tomato Late Blight": "High Priority: Use fungicides containing copper. Remove all blight-infected debris.",
    "Tomato Leaf Mold": "Reduce greenhouse humidity below 85%. Use resistant tomato cultivars.",
    "Tomato Septoria Leaf Spot": "Avoid overhead irrigation. Apply fungicides at first sign of spots on lower leaves."
}

# Agricultural Help Lines (Hardcoded for user request)
agri_helplines = [
    {"service": "Kisan Call Center", "number": "1800-180-1551"},
    {"service": "Agri Clinic Support", "number": "1551"},
    {"service": "Plant Crisis Line", "number": "Contact local KVK advisor"}
]

# --- IMPROVED DYNAMIC GOOGLE FETCH ---
def fetch_treatment_from_google(disease_name):
    """Fetches a search link and attempts to gather snippets from Google search results."""
    search_url = f"https://www.google.com/search?q={disease_name}+crop+treatment+guide"
    
    # We prioritize our manual high-quality database first
    base_advice = disease_treatments.get(disease_name, "Consult an agricultural expert locally.")
    
    try:
        query = f"{disease_name} agricultural treatment recommendation"
        search_results = list(search(query, num_results=1))
        source_link = search_results[0] if search_results else search_url
        return {
            "summary": base_advice,
            "source": source_link,
            "helplines": agri_helplines
        }
    except Exception:
        return {
            "summary": base_advice,
            "source": search_url,
            "helplines": agri_helplines
        }

# --- LABELS LIST (29 Classes) ---
labels = [
    "Apple Scab", "Apple Black Rot", "Apple Cedar Rust", "Apple Healthy",
    "Cherry Powdery Mildew", "Cherry Healthy",
    "Corn Gray Leaf Spot", "Corn Common Rust", "Corn Northern Leaf Blight", "Corn Healthy",
    "Grape Black Rot", "Grape Black Measles (Esca)", "Grape Leaf Blight", "Grape Healthy",
    "Peach Bacterial Spot", "Peach Healthy",
    "Pepper Bell Bacterial Spot", "Pepper Bell Healthy",
    "Potato Early Blight", "Potato Late Blight", "Potato Healthy",
    "Squash Powdery Mildew", "Strawberry Leaf Scorch", "Strawberry Healthy",
    "Tomato Bacterial Spot", "Tomato Early Blight", "Tomato Late Blight", "Tomato Leaf Mold",
    "Tomato Septoria Leaf Spot"
]

# Model loading
model = None
try:
    if os.path.exists(model_path):
        model = load_model(
            model_path, 
            custom_objects={'Sequential': CustomSequential, 'InputLayer': CustomInputLayer}, 
            compile=False
        )
        print(f"Crop Disease model loaded successfully with bridge.")
    else:
        print(f"model.h5 not found at {model_path}.")
except Exception as e:
    print(f"Error loading: {e}")

def predict_disease(image_path):
    if model is None:
        return {"error": "Model not loaded. Please ensure model.h5 exists and is valid."}

    try:
        img_size = (128, 128) 
        img = cv2.imread(image_path)
        if img is None: return {"error": "Could not read image."}
        
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, img_size)
        img = np.expand_dims(img, axis=0) / 255.0 

        predictions = model.predict(img)
        pred_index = np.argmax(predictions[0])
        confidence = float(predictions[0][pred_index]) * 100
        disease_name = labels[pred_index] if pred_index < len(labels) else "Unknown Disease"
        
        # High quality treatment results with helplines
        treatment_data = fetch_treatment_from_google(disease_name)

        return {
            "disease": disease_name,
            "confidence": round(confidence, 2),
            "treatment": treatment_data["summary"],
            "source": treatment_data["source"],
            "helplines": treatment_data["helplines"]
        }
    except Exception as e:
        print(f"Error in disease prediction logic: {e}")
        return {"error": "Failed to process image and predict disease."}
