import sys
import os
# Ensure we are in the backend directory
# Ensure we are in the ml-models directory environment
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from crop_disease.model import model

if model is not None:
    print("FINAL_SUCCESS: Model loaded")
else:
    print("FINAL_FAILURE: Model not loaded")
