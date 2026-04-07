import os
import tensorflow as tf

class CustomSequential(tf.keras.models.Sequential):
    def __init__(self, *args, **kwargs):
        kwargs.pop('quantization_config', None)
        kwargs.pop('batch_shape', None)
        super().__init__(*args, **kwargs)

class CustomInputLayer(tf.keras.layers.InputLayer):
    def __init__(self, *args, **kwargs):
        kwargs.pop('optional', None)
        super().__init__(*args, **kwargs)

model_path = r"c:\Users\vishn\Desktop\capstone\capstone\backend\ml_model\crop_disease\model.h5"
model = tf.keras.models.load_model(model_path, custom_objects={'Sequential': CustomSequential, 'InputLayer': CustomInputLayer}, compile=False)
model.summary()
