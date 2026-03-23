// src/api/cropModelApi.js

const API_BASE_URL = "http://127.0.0.1:5000";

// ----------------------------
// 1) Predict from Soil Image
// ----------------------------
export async function predictCropFromSoil(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await fetch(`${API_BASE_URL}/predict-crop-from-soil`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to predict crop from soil image");
  }

  return data.recommended_crop;
}

// ----------------------------
// 2) Predict from Values
// ----------------------------
export async function predictCropFromValues(values) {
  const res = await fetch(`${API_BASE_URL}/predict-crop-from-values`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to predict crop from values");
  }

  return data.recommended_crop;
}

// ----------------------------
// 3) Get States For Crop
//    👉 NEW endpoint used to populate dropdown dynamically
// ----------------------------
export async function getStatesForCrop(crop) {
  const res = await fetch(`${API_BASE_URL}/get-states-for-crop`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ crop }),
  });

  const data = await res.json();
  return data.states || [];  // Always return an array
}

// ----------------------------
// 4) Get Crop Price
// ----------------------------
export async function getCropPrice(crop, state) {
  const res = await fetch(`${API_BASE_URL}/get-crop-price`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      crop: crop.trim(),  // Do NOT lowercase → backend handles this
      state: state.trim(),
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch crop price");
  }

  return data.prices || [];
}
