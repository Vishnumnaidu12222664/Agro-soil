import os
import tensorflow as tf
from tensorflow.keras.models import load_model

model_path = r"c:\Users\vishn\Desktop\capstone\capstone\backend\ml_model\crop_disease\model.h5"
print(f"Checking path: {model_path}")
print(f"File exists: {os.path.exists(model_path)}")

try:
    model = load_model(model_path)
    print("SUCCESS: Model loaded")
except Exception as e:
    print(f"FAILURE: {e}")
