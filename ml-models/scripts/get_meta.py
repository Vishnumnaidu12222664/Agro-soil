import os
import tensorflow as tf
model_path = os.path.join(os.path.dirname(__file__), "..", "crop_disease", "model.h5")

class CustomSequential(tf.keras.models.Sequential):
    def __init__(self, *args, **kwargs):
        kwargs.pop('quantization_config', None)
        kwargs.pop('batch_shape', None)
        super().__init__(*args, **kwargs)

class CustomInputLayer(tf.keras.layers.InputLayer):
    def __init__(self, *args, **kwargs):
        kwargs.pop('optional', None)
        super().__init__(*args, **kwargs)

model = tf.keras.models.load_model(model_path, custom_objects={'Sequential': CustomSequential, 'InputLayer': CustomInputLayer}, compile=False)
print(f"NUM_CLASSES: {model.layers[-1].output_shape[-1]}")
