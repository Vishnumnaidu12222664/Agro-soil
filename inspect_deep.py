import tensorflow as tf
import os
import json

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

try:
    import h5py
    with h5py.File(model_path, 'r') as f:
        print("Keys in H5:", list(f.keys()))
        if 'model_config' in f.attrs:
            print("Model config found in attrs.")
            # Sometimes labels are in the training config
except Exception as e:
    print(f"H5 Error: {e}")

try:
    model = load_model(model_path, custom_objects={'Sequential': CustomSequential, 'InputLayer': CustomInputLayer}, compile=False)
    print("Model loaded.")
    # Check for any layer that might have labels (e.g. StringLookup)
    for layer in model.layers:
        if hasattr(layer, 'get_config'):
            cfg = layer.get_config()
            if 'vocabulary' in cfg:
                print(f"Vocabulary found in layer {layer.name}: {cfg['vocabulary']}")
except Exception as e:
    print(f"Load Error: {e}")
