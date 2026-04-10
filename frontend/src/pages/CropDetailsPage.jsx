import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getCropPrice, getStatesForCrop } from "../api/cropModelApi";

// Fallback if no states exist
const DEFAULT_FALLBACK_STATES = [
  "Punjab","Gujarat","Maharashtra","Uttar Pradesh","Madhya Pradesh",
  "Andhra Pradesh","Telangana","Rajasthan","Karnataka","West Bengal"
];

function CropDetailsPage() {
  const { cropName } = useParams();  // e.g. "rice"
  const navigate = useNavigate();

  const crop = (cropName || "").trim();
  const [stateOptions, setStateOptions] = useState([]);
  const [state, setState] = useState("");
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);

  // -------------------------------
  // Load valid states automatically
  // -------------------------------
  useEffect(() => {
    async function loadStates() {
      const states = await getStatesForCrop(crop);

      if (states.length > 0) {
        setStateOptions(states);
        setState(states[0]);
      } else {
        setStateOptions(DEFAULT_FALLBACK_STATES);
        setState(DEFAULT_FALLBACK_STATES[0]);
      }
    }

    loadStates();
  }, [crop]);

  // -------------------------------
  //  Fetch price data
  // -------------------------------
  const getPrices = async () => {
    if (!state) {
      alert("Please select a state");
      return;
    }

    setLoading(true);
    try {
      const priceList = await getCropPrice(crop, state);

      if (priceList.length > 0) {
        setPrices(priceList);
      } else {
        setPrices([]);
        alert("❌ No records found. Try a different state.");
      }
    } catch (err) {
      console.error("Error fetching prices:", err);
      alert(err.message || "Something went wrong while fetching prices.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white flex flex-col items-center px-4 py-10">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-white bg-white/20 px-4 py-2 rounded-xl hover:bg-white/40"
      >
        ⬅ Back
      </button>

      {/* Header */}
      <div className="text-center animate-fadeIn mt-6">
        <img
          src={`/src/crops/${crop}.jpg`}
          onError={(e) => (e.currentTarget.src = "/src/crops/default.jpg")}
          alt={crop}
          className="w-48 h-48 mx-auto rounded-3xl object-cover shadow-2xl animate-bounceSlow"
        />

        <h1 className="text-5xl font-extrabold text-green-300 mt-4 animate-scaleIn">
          🌾 {crop}
        </h1>
      </div>

      {/* State Dropdown */}
      <div className="mt-8 bg-white/15 backdrop-blur-xl p-6 rounded-3xl border border-white/20 w-full max-w-xl animate-fadeIn">
        <label className="font-semibold block mb-2">Select State:</label>

        <select
          className="w-full p-3 rounded-xl bg-white/80 text-black"
          value={state}
          onChange={(e) => setState(e.target.value)}
        >
          {stateOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          onClick={getPrices}
          className="mt-4 bg-green-700 w-full py-3 font-semibold rounded-xl hover:scale-[1.02] transition-all disabled:opacity-60"
          disabled={loading || !state}
        >
          {loading ? "Loading market data..." : "Check Market Price"}
        </button>
      </div>

      {/* Prices */}
      {prices.length > 0 && (
        <div className="w-full max-w-3xl mt-8 mb-10">
          <h2 className="text-3xl font-bold text-green-400 mb-3">
            📊 Market Prices in {state}
          </h2>

          {/* Graph */}
          <div className="bg-white/15 border border-white/20 rounded-xl p-4 mb-6 shadow-lg">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={prices}>
                <XAxis dataKey="date" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip />
                <Line type="monotone" dataKey="modal_price" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Records */}
          {prices.map((p, i) => (
            <div
              key={i}
              className="bg-white/10 p-4 rounded-xl mb-2 border border-white/20 hover:bg-white/20 transition-all"
            >
              <p className="text-lg font-bold text-green-300">
                {p.market} ({p.district}, {p.state})
              </p>
              <p className="text-sm text-gray-200">📅 {p.date}</p>
              <p className="text-sm">💰 Modal: ₹{p.modal_price}</p>
              <p className="text-xs opacity-80">Min: ₹{p.min_price} | Max: ₹{p.max_price}</p>
            </div>
          ))}
        </div>
      )}

      {/* Loading state */}
      {loading && prices.length === 0 && (
        <p className="mt-6 text-yellow-300 animate-pulse">Loading market data...</p>
      )}
    </div>
  );
}

export default CropDetailsPage;
