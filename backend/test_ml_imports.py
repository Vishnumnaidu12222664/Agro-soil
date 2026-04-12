
import sys
import os
import traceback

# Set up paths exactly like app_new.py
sys.path.append(os.path.join(os.getcwd(), 'ml-models'))

print("--- Testing ML Imports ---")
try:
    import numpy as np
    import PIL
    import joblib
    import tensorflow as tf
    print(f"Core libs imported successfully. TensorFlow version: {tf.__version__}")
except Exception as e:
    print(f"FAILED to import core libs: {e}")
    traceback.print_exc()
    sys.exit(1)

def test_import(name, func_name):
    try:
        mod = __import__(name)
        if hasattr(mod, func_name):
            print(f"OK: {name} import success and found {func_name}")
        else:
            print(f"ERROR: {name} import success but {func_name} NOT FOUND")
    except Exception as e:
        print(f"ERROR: {name} import FAILED")
        traceback.print_exc()

test_import("soil_model", "predict_soil")
test_import("crop_model", "recommend_crop_from_soil")

# For crop_disease, it's a subpackage
try:
    from crop_disease.model import predict_disease
    print("OK: crop_disease.model import success")
except Exception as e:
    print("ERROR: crop_disease.model import FAILED")
    traceback.print_exc()
