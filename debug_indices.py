import os
import cv2
import numpy as np
import tensorflow as tf
try:
    import tf_keras as keras
    from tf_keras.models import load_model
except ImportError:
    from tensorflow import keras
    from tensorflow.keras.models import load_model

# Compatibility bridge
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

model_path = r"c:\Users\vishn\Desktop\capstone\capstone\backend\ml_model\crop_disease\crop_disease_model.h5"
model = load_model(model_path, custom_objects={'Sequential': CustomSequential, 'InputLayer': CustomInputLayer}, compile=False)

uploads_dir = r"c:\Users\vishn\Desktop\capstone\capstone\backend\uploads"
for filename in os.listdir(uploads_dir):
    if filename.endswith(('.webp', '.avif', '.jpg', '.png', '.jpeg')):
        img_path = os.path.join(uploads_dir, filename)
        img = cv2.imread(img_path)
        if img is None: continue
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (128, 128))
        img = np.expand_dims(img.astype(np.float32), axis=0)
        img = (img / 127.5) - 1.0 
        
        preds = model.predict(img)[0]
        top_idx = np.argmax(preds)
        print(f"File: {filename} -> Top Index: {top_idx} (Score: {preds[top_idx]:.4f})")
