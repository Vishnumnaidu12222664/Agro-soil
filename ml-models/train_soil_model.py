import os
from PIL import Image
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# Path to your dataset folder (where the 5 soil folders are)
dataset_path = r"C:\Users\vishn\Downloads\archive\Soil types"
  # <-- change this!

# Step 1: Load all images
def load_images_from_folders(base_path):
    X, y = [], []
    classes = sorted(os.listdir(base_path))
    for label, folder in enumerate(classes):
        folder_path = os.path.join(base_path, folder)
        if not os.path.isdir(folder_path):
            continue
        for file in os.listdir(folder_path):
            file_path = os.path.join(folder_path, file)
            try:
                img = Image.open(file_path).convert("L").resize((64, 64))
                X.append(np.array(img).flatten())
                y.append(label)
            except:
                pass
    return np.array(X), np.array(y), classes

X, y, classes = load_images_from_folders(dataset_path)
print(f"Loaded {len(X)} images across {len(classes)} soil types: {classes}")

# Step 2: Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 3: Train model
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Step 4: Evaluate accuracy
y_pred = clf.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))

# Step 5: Save model to ml_model folder
os.makedirs("ml_model", exist_ok=True)
joblib.dump({"model": clf, "classes": classes}, "ml_model/soil_classifier.joblib")

print("Model saved successfully at: ml_model/soil_classifier.joblib")
