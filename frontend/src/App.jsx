import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import SoilAnalysis from "./pages/SoilAnalysis";
import CropRecommendation from "./pages/CropRecommendation";
import MarketPrices from "./pages/MarketPrices";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Marketplace from "./pages/Marketplace";
import AddProduct from "./pages/AddProduct";
import MyProducts from "./pages/MyProducts";
import CropDiseaseDetection from "./pages/CropDiseaseDetection";
import Brands from "./pages/Brands";
import FarmerProfile from "./pages/FarmerProfile";
import FarmToUPortal from "./pages/FarmToUPortal";

import Welcome from "./pages/Welcome";

// Simple Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/soil" element={<ProtectedRoute><SoilAnalysis /></ProtectedRoute>} />
      <Route path="/recommend" element={<ProtectedRoute><CropRecommendation /></ProtectedRoute>} />
      <Route path="/prices" element={<ProtectedRoute><MarketPrices /></ProtectedRoute>} />
      <Route path="/crop-disease" element={<ProtectedRoute><CropDiseaseDetection /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><FarmerProfile /></ProtectedRoute>} />
      
      {/* Marketplace & Partners */}
      <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
      <Route path="/marketplace/add" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
      <Route path="/marketplace/my" element={<ProtectedRoute><MyProducts /></ProtectedRoute>} />
      <Route path="/farmto-u" element={<ProtectedRoute><FarmToUPortal /></ProtectedRoute>} />
      <Route path="/brands/:category" element={<ProtectedRoute><Brands /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}



export default App;
