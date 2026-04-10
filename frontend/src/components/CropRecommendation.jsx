import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import {
  predictCropFromSoil,
  predictCropFromValues,
  getCropPrice,
  getStatesForCrop,
} from "../api/cropModelApi";

function CropRecommendation() {
  const [activeTab, setActiveTab] = useState("upload");
  const [file, setFile] = useState(null);
  const [predictedCrop, setPredictedCrop] = useState(null);

  const [form, setForm] = useState({
    N: "",
    P: "",
    K: "",
    ph: "",
    temperature: "",
    humidity: "",
    rainfall: "",
  });

  const [stateName, setStateName] = useState("");
  const [stateOptions, setStateOptions] = useState([]);
  const [priceData, setPriceData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const [error, setError] = useState("");

  // NEW
  const [showPriceModal, setShowPriceModal] = useState(false);

  // --------------------------
  const resetResults = () => {
    setError("");
    setPredictedCrop(null);
    setStateOptions([]);
    setStateName("");
    setPriceData([]);
    setShowPriceModal(false);
  };

  // --------------------------
  // Predict from Soil Image
  // --------------------------
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    resetResults();

    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      const crop = await predictCropFromSoil(file);
      await handlePredictedCrop(crop);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong while predicting.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // Predict from Values
  // --------------------------
  const handleValueSubmit = async (e) => {
    e.preventDefault();
    resetResults();

    for (const key of Object.keys(form)) {
      if (!form[key]) {
        setError(`Please fill the "${key}" value.`);
        return;
      }
    }

    const body = {
      N: parseFloat(form.N),
      P: parseFloat(form.P),
      K: parseFloat(form.K),
      ph: parseFloat(form.ph),
      temperature: parseFloat(form.temperature),
      humidity: parseFloat(form.humidity),
      rainfall: parseFloat(form.rainfall),
    };

    try {
      setLoading(true);
      const crop = await predictCropFromValues(body);
      await handlePredictedCrop(crop);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong while predicting.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // Handle crop + load states
  // --------------------------
  async function handlePredictedCrop(crop) {
    setPredictedCrop(crop);
    setPriceData([]);
    setStateName("");
    setShowPriceModal(false);

    const states = await getStatesForCrop(crop);
    if (states.length > 0) {
      setStateOptions(states);
      setStateName(states[0]);
    } else {
      setStateOptions([]);
      setError(`⚠ No price data available for ${crop}.`);
    }
  }

  // --------------------------
  // Fetch price -> open PRICE MODAL
  // --------------------------
  const handleGetPrice = async () => {
    setError("");
    setPriceData([]);
    setShowPriceModal(false);

    if (!predictedCrop) return setError("Please predict a crop first.");
    if (!stateName.trim()) return setError("Please select a state.");

    try {
      setPriceLoading(true);
      const prices = await getCropPrice(predictedCrop, stateName);

      if (!prices || prices.length === 0) {
        setError(`No price data found for ${predictedCrop} in ${stateName}.`);
      } else {
        setPriceData(prices);
        setShowPriceModal(true); // 💥 OPEN MODAL
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong while fetching prices.");
    } finally {
      setPriceLoading(false);
    }
  };

  const renderInput = (name, label) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-[#3a2b16]">{label}</label>
      <input
        type="number"
        step="any"
        placeholder={label}
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        className="bg-[#EFE5D0]/70 p-3 rounded-xl border border-[#C7B89A] text-black focus:outline-none"
      />
    </div>
  );

  const cropImageSrc = predictedCrop
    ? `/src/crops/${predictedCrop.toLowerCase()}.jpg`
    : "/src/crops/default.jpg";

  return (
    <>
      {/* 🌱 LEFT PANEL UI */}
      <div className="bg-white/20 p-6 rounded-3xl w-[32rem] backdrop-blur-xl border border-[#cdbb9f] shadow-xl custom-scroll overflow-y-auto max-h-[85vh] animate-slideUp">

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => { setActiveTab("upload"); resetResults(); }}
            className={`flex-1 py-3 rounded-xl font-semibold text-lg transition-all duration-300 ${
              activeTab === "upload"
                ? "bg-gradient-to-r from-green-600 to-green-700 text- shadow-xl scale-[1.03]"
                : "bg-[#EFE5D0]/80 text-[#4B3A22] hover:bg-[#E8DCC2] hover:scale-[1.01]"
            }`}
          >
            📸 Upload Soil Image
          </button>

          <button
            onClick={() => { setActiveTab("values"); resetResults(); }}
            className={`flex-1 py-3 rounded-xl font-semibold text-lg transition-all duration-300 ${
              activeTab === "values"
                ? "bg-gradient-to-r from-green-600 to-green-700 text- shadow-xl scale-[1.03]"
                : "bg-[#EFE5D0]/80 text-[#4B3A22] hover:bg-[#E8DCC2] hover:scale-[1.01]"
            }`}
          >
            🌱 Enter Soil Values
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-500/80 text- text-sm p-3 rounded-xl animate-fadeIn">
            ⚠ {error}
          </div>
        )}

        {/* Upload UI */}
        {activeTab === "upload" && (
          <form onSubmit={handleImageSubmit} className="flex flex-col gap-4 animate-fadeIn">
            <label className="text-sm font-semibold text-[#3a2b16]">Upload a clear soil image</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] || null)} />
            <button className="bg-green-700 text- py-3 rounded-xl">{loading ? "Predicting..." : "Predict Crop"}</button>
          </form>
        )}

        {/* Value UI */}
        {activeTab === "values" && (
          <form onSubmit={handleValueSubmit} className="flex flex-col gap-3 animate-fadeIn">
            {renderInput("N", "Nitrogen (N)")}
            {renderInput("P", "Phosphorus (P)")}
            {renderInput("K", "Potassium (K)")}
            {renderInput("ph", "pH")}
            {renderInput("temperature", "Temperature (°C)")}
            {renderInput("humidity", "Humidity (%)")}
            {renderInput("rainfall", "Rainfall (mm)")}

            <button className="bg-green-700 text- py-3 rounded-xl mt-2">
              {loading ? "Predicting..." : "Predict Crop"}
            </button>
          </form>
        )}
      </div>

      {/* 🌾 FLOATING CROP RESULT MODAL */}
      {predictedCrop && (
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                        z-50 w-[26rem] bg-white/20 backdrop-blur-xl border border-white/20
                        shadow-2xl rounded-3xl p-6 animate-scaleIn">

          <img
            src={cropImageSrc}
            onError={(e) => (e.currentTarget.src = "/src/crops/default.jpg")}
            alt={predictedCrop}
            className="w-40 h-40 mx-auto rounded-2xl object-cover shadow-md mb-4"
          />

          <h2 className="text-xl font-bold text-green-700 text-center">🌾 Predicted Crop:</h2>
          <p className="text-3xl font-extrabold text-green-900 text-center">{predictedCrop}</p>

          {/* State Dropdown */}
          {stateOptions.length > 0 && (
            <div className="mt-5">
              <label className="font-semibold text-sm">Select State:</label>

              <select
                className="w-full p-3 bg-white/80 border rounded-xl text-black mt-2"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
              >
                {stateOptions.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          )}

          {/* Show price button */}
          <button
            onClick={handleGetPrice}
            disabled={priceLoading || !stateName}
            className="mt-5 bg-green-700 text- py-3 w-full rounded-xl hover:scale-[1.05] transition-all disabled:opacity-60"
          >
            {priceLoading ? "Fetching Market Prices..." : "Show Market Prices"}
          </button>

          {/* Close */}
          <button className="mt-4 text-sm text-red-600 underline"
            onClick={() => resetResults()}>
            Close
          </button>
        </div>
      )}

      {/* 📊 PRICE MODAL POPUP */}
      {showPriceModal && (
        <div
          className="fixed inset-0 z-[999] flex justify-center items-center backdrop-blur-md bg-black/40"
          onClick={() => setShowPriceModal(false)}
        >
          <div
            className="bg-white/20 backdrop-blur-xl p-6 rounded-3xl border border-white/25 shadow-2xl w-[35rem] max-h-[85vh] overflow-y-auto animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-green-700 mb-3 text-center">
              📊 Market Price For {predictedCrop} in {stateName}
            </h2>

            <div className="w-full h-60 mb-4 rounded-xl bg-white/20 shadow-md p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="modal_price" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {priceData.map((p, i) => (
              <div
                key={i}
                className="bg-white/25 p-4 rounded-xl border border-white/10 mb-2"
              >
                <p className="font-bold">{p.market} ({p.district}, {p.state})</p>
                <p className="text-sm">📅 {p.date}</p>
                <p className="text-green-900">💰 Modal Price: ₹{p.modal_price}</p>
                <p className="text-xs">Min: ₹{p.min_price} | Max: ₹{p.max_price}</p>
              </div>
            ))}

            <button
              onClick={() => setShowPriceModal(false)}
              className="mt-4 w-full bg-red-600 text- py-3 rounded-xl text-lg font-semibold hover:scale-[1.05] transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CropRecommendation;



// import { useState } from "react";
// import {
//   predictCropFromSoil,
//   predictCropFromValues,
//   getCropPrice,
//   getStatesForCrop,
// } from "../api/cropModelApi";

// function CropRecommendation() {
//   const [activeTab, setActiveTab] = useState("upload");
//   const [file, setFile] = useState(null);
//   const [predictedCrop, setPredictedCrop] = useState(null);

//   const [form, setForm] = useState({
//     N: "",
//     P: "",
//     K: "",
//     ph: "",
//     temperature: "",
//     humidity: "",
//     rainfall: "",
//   });

//   const [stateName, setStateName] = useState("");
//   const [stateOptions, setStateOptions] = useState([]);
//   const [priceData, setPriceData] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [priceLoading, setPriceLoading] = useState(false);
//   const [error, setError] = useState("");

//   // --------------------------
//   // Predict from Soil Image
//   // --------------------------
//   const handleImageSubmit = async (e) => {
//     e.preventDefault();
//     resetResults();

//     if (!file) return setError("Please upload an image first.");

//     try {
//       setLoading(true);
//       const crop = await predictCropFromSoil(file);
//       await handlePredictedCrop(crop);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Something went wrong while predicting.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------
//   // Predict from Values
//   // --------------------------
//   const handleValueSubmit = async (e) => {
//     e.preventDefault();
//     resetResults();

//     for (const key of Object.keys(form)) {
//       if (!form[key]) {
//         return setError(`Please fill the "${key}" value.`);
//       }
//     }

//     const body = {
//       N: parseFloat(form.N),
//       P: parseFloat(form.P),
//       K: parseFloat(form.K),
//       ph: parseFloat(form.ph),
//       temperature: parseFloat(form.temperature),
//       humidity: parseFloat(form.humidity),
//       rainfall: parseFloat(form.rainfall),
//     };

//     try {
//       setLoading(true);
//       const crop = await predictCropFromValues(body);
//       await handlePredictedCrop(crop);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Prediction failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------
//   // Handle crop result + load states
//   // --------------------------
//   async function handlePredictedCrop(crop) {
//     setPredictedCrop(crop);

//     const states = await getStatesForCrop(crop);
//     if (states.length > 0) {
//       setStateOptions(states);
//     } else {
//       setStateOptions([]);
//       setError(`⚠ No price data available for ${crop}.`);
//     }
//   }

//   // --------------------------
//   // Fetch price for crop & state
//   // --------------------------
//   const handleGetPrice = async () => {
//     setError("");
//     setPriceData([]);

//     if (!predictedCrop) return setError("Please predict a crop first.");
//     if (!stateName.trim()) return setError("Please select a state first.");

//     try {
//       setPriceLoading(true);
//       const prices = await getCropPrice(predictedCrop, stateName);

//       if (!prices || prices.length === 0) {
//         setError(`No price data found for ${predictedCrop} in ${stateName}.`);
//       } else {
//         setPriceData(prices);
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Error fetching prices.");
//     } finally {
//       setPriceLoading(false);
//     }
//   };

//   const resetResults = () => {
//     setError("");
//     setPredictedCrop(null);
//     setStateOptions([]);
//     setStateName("");
//     setPriceData([]);
//   };

//   const renderInput = (name, label) => (
//     <div className="flex flex-col gap-1">
//       <label className="text-sm font-semibold text-[#3a2b16]">{label}</label>
//       <input
//         type="number"
//         step="any"
//         value={form[name]}
//         placeholder={label}
//         onChange={(e) => setForm({ ...form, [name]: e.target.value })}
//         className="bg-[#EFE5D0]/70 p-3 rounded-xl border border-[#C7B89A] text-black focus:outline-none"
//       />
//     </div>
//   );

//   return (
//     <div className="bg-white/20 p-6 rounded-3xl w-[32rem] backdrop-blur-xl border border-[#cdbb9f] shadow-xl custom-scroll overflow-y-auto max-h-[85vh] animate-slideUp">

//       {/* Tabs */}
//       <div className="flex gap-3 mb-6">
//         <button
//           onClick={() => { setActiveTab("upload"); resetResults(); }}
//           className={`flex-1 py-3 rounded-xl font-semibold text-lg transition-all duration-300 ${
//             activeTab === "upload"
//               ? "bg-green-600 text-white shadow-xl"
//               : "bg-[#EFE5D0]/80 text-[#4B3A22]"
//           }`}
//         >
//           📸 Upload Soil Image
//         </button>

//         <button
//           onClick={() => { setActiveTab("values"); resetResults(); }}
//           className={`flex-1 py-3 rounded-xl font-semibold text-lg transition-all duration-300 ${
//             activeTab === "values"
//               ? "bg-green-600 text-white shadow-xl"
//               : "bg-[#EFE5D0]/80 text-[#4B3A22]"
//           }`}
//         >
//           🌱 Enter Soil Values
//         </button>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="mb-4 bg-red-500/80 text-white text-sm p-3 rounded-xl">
//           ⚠ {error}
//         </div>
//       )}

//       {/* Upload UI */}
//       {activeTab === "upload" && (
//         <form onSubmit={handleImageSubmit} className="flex flex-col gap-4">
//           <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] || null)} />
//           <button className="bg-green-700 text-white py-3 rounded-xl">
//             {loading ? "Predicting..." : "Predict Crop"}
//           </button>
//         </form>
//       )}

//       {/* Value UI */}
//       {activeTab === "values" && (
//         <form onSubmit={handleValueSubmit} className="flex flex-col gap-3">
//           {renderInput("N", "Nitrogen (N)")}
//           {renderInput("P", "Phosphorus (P)")}
//           {renderInput("K", "Potassium (K)")}
//           {renderInput("ph", "pH")}
//           {renderInput("temperature", "Temperature (°C)")}
//           {renderInput("humidity", "Humidity (%)")}
//           {renderInput("rainfall", "Rainfall (mm)")}
          
//           <button className="bg-green-700 text-white py-3 rounded-xl">
//             {loading ? "Predicting..." : "Predict Crop"}
//           </button>
//         </form>
//       )}

//       {/* Predicted result */}
//       {predictedCrop && (
//         <div className="mt-6 bg-white/20 p-4 rounded-2xl backdrop-blur-md border border-white/30 shadow-xl">
//           <h2 className="text-xl font-bold text-green-700">🌾 Predicted Crop:</h2>
//           <p className="text-2xl font-extrabold mt-1 text-green-900">{predictedCrop}</p>

//           {/* State Dropdown */}
//           <div className="mt-4">
//             <label className="font-semibold text-sm text-[#3a2b16]">
//               Select State:
//             </label>

//             <select
//               className="w-full p-3 bg-white/70 border rounded-xl text-black mt-2"
//               value={stateName}
//               onChange={(e) => setStateName(e.target.value)}
//             >
//               <option value="">-- Select State --</option>
//               {stateOptions.map((state) => (
//                 <option key={state} value={state}>{state}</option>
//               ))}
//             </select>
//           </div>

//           <button
//             onClick={handleGetPrice}
//             disabled={priceLoading || !stateName}
//             className="mt-4 bg-green-700 text-white py-3 w-full rounded-xl"
//           >
//             {priceLoading ? "Fetching market price..." : "Get Crop Price"}
//           </button>
//         </div>
//       )}

//       {/* Price List */}
//       {priceData.length > 0 && (
//         <div className="mt-6 bg-white/10 p-4 rounded-2xl border border-white/30">
//           <h3 className="text-lg font-bold mb-2 text-green-700">📊 Market Prices:</h3>

//           {priceData.map((p, idx) => (
//             <div key={idx} className="p-3 bg-white/20 rounded-xl mb-2 text-sm text-black">
//               <p className="font-semibold">{p.market} ({p.state})</p>
//               <p>Date: {p.date}</p>
//               <p>Modal Price: ₹{p.modal_price}</p>
//               <p className="text-xs">Min: ₹{p.min_price} | Max: ₹{p.max_price}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default CropRecommendation;
