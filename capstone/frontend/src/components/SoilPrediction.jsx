import { useState } from "react";

function SoilPrediction() {
  const [file, setFile] = useState(null);
  const [soilType, setSoilType] = useState("");
  const [recommendedCrop, setRecommendedCrop] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload an image");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict-crop-from-soil", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setSoilType(data.soil_type);

      setRecommendedCrop(data.recommended_crop);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>Soil Type Prediction 🌱</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Predict Soil Type & Crop</button>
      </form>
      {soilType && <p>Predicted Soil Type: {soilType}</p>}
      {recommendedCrop && <p>Recommended Crop: {recommendedCrop}</p>}
    </div>
  );
}

export default SoilPrediction;
