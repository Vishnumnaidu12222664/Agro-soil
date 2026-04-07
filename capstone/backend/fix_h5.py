import h5py
import json

model_path = r"c:\Users\vishn\Desktop\capstone\capstone\backend\ml_model\crop_disease\model.h5"
with h5py.File(model_path, 'r') as f:
    model_config = f.attrs.get('model_config')
    if model_config:
        config = json.loads(model_config)
        print("Model Config found")
        # Recursively remove 'quantization_config'
        def remove_quant(obj):
            if isinstance(obj, dict):
                obj.pop('quantization_config', None)
                for v in obj.values():
                    remove_quant(v)
            elif isinstance(obj, list):
                for item in obj:
                    remove_quant(item)
        
        remove_quant(config)
        # Update model_config in h5 if possible? No, h5py attributes are usually immutable strings but we can re-save.
        print("Cleaned config")
    else:
        print("No model_config in attrs")
