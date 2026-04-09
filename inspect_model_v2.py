import tensorflow as tf
import os
try:
    import tf_keras as keras
    from tf_keras.models import load_model
except ImportError:
    from tensorflow import keras
    from tensorflow.keras.models import load_model

model_path = r"c:\Users\vishn\Desktop\capstone\capstone\backend\ml_model\crop_disease\crop_disease_model.h5"

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

try:
    model = load_model(model_path, custom_objects={'Sequential': CustomSequential, 'InputLayer': CustomInputLayer}, compile=False)
    print("Model loaded.")
    print("Layer types:")
    for layer in model.layers:
        print(f" - {layer.name}: {type(layer)}")
    
    # Check for metadata
    if hasattr(model, 'class_names'):
        print(f"Class names found: {model.class_names}")
    
    # Check output layer
    last_layer = model.layers[-1]
    print(f"Last layer: {last_layer.name}, Units: {getattr(last_layer, 'units', 'None')}")
except Exception as e:
    print(f"Error: {e}")
