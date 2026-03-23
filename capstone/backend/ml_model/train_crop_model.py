import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# ✅ Path to your downloaded dataset
dataset_path = r"C:\Users\vishn\Downloads\archive2\Crop_recommendation.csv"

# Step 1: Load dataset
df = pd.read_csv(dataset_path)
print("✅ Dataset loaded successfully!")
print(df.head())

# Step 2: Split features and labels
X = df.drop("label", axis=1)
y = df["label"]

# Step 3: Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 4: Train Random Forest model
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Step 5: Evaluate model
y_pred = clf.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"✅ Model trained successfully! Accuracy: {accuracy * 100:.2f}%")

# Step 6: Save model in ml_model folder
os.makedirs("ml_model", exist_ok=True)
joblib.dump({"model": clf, "columns": X.columns.tolist(), "classes": clf.classes_}, 
            "ml_model/crop_recommender.joblib")

print("✅ Model saved successfully at: ml_model/crop_recommender.joblib")
