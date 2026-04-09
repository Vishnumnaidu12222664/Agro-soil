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

labels = [
    "Apple Scab", "Apple Black Rot", "Apple Cedar Rust", "Apple Healthy",     # 0-3
    "Cherry Healthy", "Cherry Powdery Mildew",                               # 4-5
    "Corn Common Rust", "Corn Gray Leaf Spot", "Corn Healthy", "Corn Northern Leaf Blight", # 6-9
    "Grape Black Measles (Esca)", "Grape Black Rot", "Grape Healthy", "Grape Leaf Blight",  # 10-13
    "Peach Bacterial Spot", "Peach Healthy",                                 # 14-15
    "Pepper Bell Bacterial Spot", "Pepper Bell Healthy",                    # 16-17
    "Potato Early Blight", "Potato Healthy", "Potato Late Blight",           # 18-20
    "Squash Powdery Mildew",                                                 # 21
    "Strawberry Healthy", "Strawberry Leaf Scorch",                         # 22-23
    "Tomato Bacterial Spot", "Tomato Early Blight", "Tomato Late Blight", "Tomato Leaf Mold", "Tomato Septoria Leaf Spot" # 24-28
]

uploads_dir = r"c:\Users\vishn\Desktop\capstone\capstone\backend\uploads"
for filename in os.listdir(uploads_dir):
    if filename.endswith(('.webp', '.avif', '.jpg', '.png', '.jpeg')):
        img_path = os.path.join(uploads_dir, filename)
        img_orig = cv2.imread(img_path)
        if img_orig is None: continue
        img_orig = cv2.cvtColor(img_orig, cv2.COLOR_BGR2RGB)
        img_orig = cv2.resize(img_orig, (128, 128))
        
        print(f"File: {filename}")
        
        # Test -1 to 1
        img1 = np.expand_dims(img_orig.astype(np.float32), axis=0)
        img1 = (img1 / 127.5) - 1.0 
        preds1 = model.predict(img1)[0]
        top1 = np.argmax(preds1)
        print(f"  Norm -1 to 1: {labels[top1]} ({preds1[top1]:.4f})")
        
        # Test 0 to 1
        img2 = np.expand_dims(img_orig.astype(np.float32), axis=0)
        img2 = img2 / 255.0
        preds2 = model.predict(img2)[0]
        top2 = np.argmax(preds2)
        print(f"  Norm 0 to 1: {labels[top2]} ({preds2[top2]:.4f})")
        
        print("-" * 20)
