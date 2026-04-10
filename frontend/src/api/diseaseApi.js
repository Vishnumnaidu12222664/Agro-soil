const BASE_URL = "http://127.0.0.1:5000/api";

export const predictDisease = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch(`${BASE_URL}/disease/predict`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Disease detection failed");
    }
    return data;
  } catch (error) {
    console.error("Error in disease prediction API:", error);
    throw error;
  }
};
