import os
import tensorflow as tf

class CS(tf.keras.models.Sequential):
    def __init__(self, *args, **kwargs):
        kwargs.pop('quantization_config', None)
        kwargs.pop('batch_shape', None)
        super().__init__(*args, **kwargs)

class CI(tf.keras.layers.InputLayer):
    def __init__(self, *args, **kwargs):
        kwargs.pop('optional', None)
        super().__init__(*args, **kwargs)

model_path = r"c:\Users\vishn\Desktop\capstone\capstone\backend\ml_model\crop_disease\model.h5"
model = tf.keras.models.load_model(model_path, custom_objects={'Sequential': CS, 'InputLayer': CI}, compile=False)
print("CLASS_COUNT_START")
last_layer = model.layers[-1]
# If it's a Sequential, it might be nested
if hasattr(last_layer, 'layers'):
    last_layer = last_layer.layers[-1]
units = getattr(last_layer, 'units', 'None')
print(f"CLASS_COUNT: {units}")
print("CLASS_COUNT_END")
