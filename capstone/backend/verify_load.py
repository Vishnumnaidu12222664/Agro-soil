import sys
import os
# Ensure we are in the backend directory
sys.path.append(os.getcwd())

from ml_model.crop_disease.model import model

if model is not None:
    print("FINAL_SUCCESS: Model loaded")
else:
    print("FINAL_FAILURE: Model not loaded")
