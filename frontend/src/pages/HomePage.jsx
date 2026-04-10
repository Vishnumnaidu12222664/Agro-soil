import React from "react";
import CropRecommendation from "./CropRecommendation";

function HomePage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/video1.mp4" type="video/mp4" />
      </video>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full bg-black bg-opacity-40 p-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-10">
          Soil & Crop Prediction
        </h1>

        <div className="w-full max-w-3xl">
          <CropRecommendation />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
