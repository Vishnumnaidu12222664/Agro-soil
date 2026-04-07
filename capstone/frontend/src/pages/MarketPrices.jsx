import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  Info,
  Loader2,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from 'recharts';
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { toast } from "sonner";
import { getCropPrice, getStatesForCrop, getCrops } from "../api/cropModelApi";

const MarketPrices = () => {
  const [crop, setCrop] = useState("");
  const [crops, setCrops] = useState([]);
  const [state, setState] = useState("");
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingStates, setFetchingStates] = useState(false);
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const cropList = await getCrops();
        setCrops(cropList);
        if (cropList.length > 0) {
          setCrop(cropList[0]);
          fetchStatesForCrop(cropList[0]);
        }
      } catch (err) {
        console.error("Error fetching crops:", err);
        toast.error("Failed to load crops list");
      }
    };
    fetchCrops();
  }, []);

  const fetchStatesForCrop = async (selectedCrop) => {
    if (!selectedCrop) return;
    setFetchingStates(true);
    try {
      const foundStates = await getStatesForCrop(selectedCrop);
      setStates(foundStates);
      if (foundStates.length > 0) {
        setState(foundStates[0]);
      } else {
        setState("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch available states");
    } finally {
      setFetchingStates(false);
    }
  };

  const handleCropChange = (e) => {
    const value = e.target.value;
    setCrop(value);
    fetchStatesForCrop(value);
  };

  const handleFetchPrices = async () => {
    if (!crop || !state) return toast.error("Please enter a crop and select a state");

    setLoading(true);
    try {
      const data = await getCropPrice(crop, state);
      if (data && data.length > 0) {
        setPrices(data);
        toast.success(`Found ${data.length} market records!`);
      } else {
        setPrices([]);
        toast.error("No market data found for this selection");
      }
    } catch (err) {
      toast.error("Error fetching market data");
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-10">
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">
            Market <span className="text-emerald-600">Analytics</span>
          </h1>
          <p className="text-gray-600 font-semibold max-w-xl">
            Real-time pricing data from government mandates across India. Track district-level minimum and modal prices.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 sticky top-28 border-gray-100">
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-6 border-b border-gray-50 pb-2">Market Filter</h4>
            <div className="space-y-6">
              <div className="group">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Crop Name</label>
                <div className="relative">
                  <select
                    className="w-full h-12 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-gray-800 px-4 focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200"
                    value={crop}
                    onChange={handleCropChange}
                  >
                    <option value="">Select crop...</option>
                    {crops.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {fetchingStates && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 animate-spin" />
                  )}
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Available State</label>
                <select
                  disabled={states.length === 0}
                  className="w-full h-12 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-gray-800 px-4 focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  {states.length === 0 ? (
                    <option>Type crop first...</option>
                  ) : (
                    states.map(s => <option key={s} value={s}>{s}</option>)
                  )}
                </select>
              </div>

              <Button
                onClick={handleFetchPrices}
                loading={loading}
                disabled={!crop || !state}
                size="lg"
              >
                Fetch Analytics
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-gray-900 text-white border-none shadow-lg shadow-gray-900/20">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <Info className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Market Tip</span>
            </div>
            <p className="text-xs font-semibold leading-relaxed text-gray-400">
              Prices updated daily via OGD Platform. Ensure you check local district prices for actual logistics planning.
            </p>
          </Card>
        </div>

        {/* Results Main Area */}
        <div className="lg:col-span-3 space-y-8">
          <AnimatePresence mode="wait">
            {prices.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[600px] flex flex-col items-center justify-center p-10 text-center text-gray-300 space-y-4 rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50/30"
              >
                <TrendingUp className="h-16 w-16 opacity-20" />
                <h3 className="text-xl font-bold uppercase tracking-widest opacity-40">No Data Selected</h3>
                <p className="max-w-xs font-semibold text-gray-400">Select a crop and state to view live market price dynamics.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[600px] flex flex-col items-center justify-center space-y-6"
              >
                <Loader2 className="h-12 w-12 text-emerald-600 animate-spin" />
                <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Consulting OGD Servers...</p>
              </motion.div>
            )}

            {prices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* Visual Analytics */}
                <Card className="p-8 h-[400px] border-gray-100">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest border-b-2 border-emerald-500 pb-1 w-fit">Price Distribution (₹)</h3>
                    <div className="flex gap-4">
                       <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-[10px] font-bold uppercase text-gray-400">Market Price</span>
                       </div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={prices.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                      <XAxis dataKey="market" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dx={-10} />
                      <Tooltip 
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                      />
                      <Bar dataKey="modal_price" radius={[8, 8, 0, 0]}>
                        {prices.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* Table Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prices.map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="hover:border-emerald-500 group transition-all duration-200 border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                            <h4 className="text-base font-bold text-gray-800 leading-none group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{p.market}</h4>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                               <MapPin size={10} /> {p.district}, {p.state}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 group-hover:bg-emerald-50 transition-colors duration-200">
                            <Calendar className="h-4 w-4 text-gray-400 group-hover:text-emerald-500" />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                             <p className="text-[9px] font-bold uppercase text-gray-400 mb-1">Min</p>
                             <p className="text-sm font-bold text-gray-800 leading-none">₹{p.min_price}</p>
                          </div>
                          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                             <p className="text-[9px] font-bold uppercase text-emerald-600 mb-1">Modal</p>
                             <p className="text-sm font-bold text-emerald-700 leading-none">₹{p.modal_price}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                             <p className="text-[9px] font-bold uppercase text-gray-400 mb-1">Max</p>
                             <p className="text-sm font-bold text-gray-800 leading-none">₹{p.max_price}</p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MarketPrices;
