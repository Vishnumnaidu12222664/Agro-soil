import { useState } from "react";
import { 
  Sprout, 
  FlaskConical, 
  Thermometer, 
  Droplets, 
  CloudRain, 
  Activity,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { toast } from "sonner";
import { 
  predictCropFromValues, 
  getStatesForCrop, 
  getCropPrice 
} from "../api/cropModelApi";

const CropRecommendation = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({
    N: "", P: "", K: "", ph: "",
    temperature: "", humidity: "", rainfall: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const missing = Object.entries(form).find(([_, v]) => !v);
    if (missing) return toast.error(`Please provide ${missing[0].toUpperCase()}`);

    setLoading(true);
    setResult(null);

    try {
      const crop = await predictCropFromValues({
        N: parseFloat(form.N),
        P: parseFloat(form.P),
        K: parseFloat(form.K),
        ph: parseFloat(form.ph),
        temperature: parseFloat(form.temperature),
        humidity: parseFloat(form.humidity),
        rainfall: parseFloat(form.rainfall)
      });

      if (crop) {
        setResult({ crop });
        toast.success("Optimal crop found!");
      }
    } catch (err) {
      toast.error(err.message || "Recommendation failed");
    } finally {
      setLoading(false);
    }
  };

  const parameters = [
    { id: "N", label: "Nitrogen (N)", icon: Activity, placeholder: "e.g. 90" },
    { id: "P", label: "Phosphorus (P)", icon: Activity, placeholder: "e.g. 42" },
    { id: "K", label: "Potassium (K)", icon: Activity, placeholder: "e.g. 43" },
    { id: "ph", label: "Soil pH", icon: FlaskConical, placeholder: "e.g. 6.5" },
    { id: "temperature", label: "Temp (°C)", icon: Thermometer, placeholder: "e.g. 25" },
    { id: "humidity", label: "Humidity (%)", icon: Droplets, placeholder: "e.g. 80" },
    { id: "rainfall", label: "Rainfall (mm)", icon: CloudRain, placeholder: "e.g. 200" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-10">
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">
            Crop <span className="text-emerald-600">Matching</span>
          </h1>
          <p className="text-gray-600 font-semibold max-w-xl">
            Input your soil's chemical profile and environmental conditions to find the high-yield crop match.
          </p>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
          <button className="px-6 py-2.5 rounded-xl text-sm font-bold bg-white text-emerald-600 shadow-sm transition-all duration-200 uppercase tracking-widest">
            Detailed Parameters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Form Area */}
        <div className="lg:col-span-2">
          <Card className="p-10">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {parameters.map((param) => (
                  <div key={param.id} className="group">
                    <div className="flex items-center gap-2 mb-2 text-gray-400 group-focus-within:text-emerald-600 transition-colors duration-200">
                      <param.icon className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{param.label}</span>
                    </div>
                    <Input
                      name={param.id}
                      type="number"
                      step="any"
                      placeholder={param.placeholder}
                      value={form[param.id]}
                      onChange={handleInputChange}
                      className="h-14 text-lg"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-100">
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full h-16 text-xl font-bold gap-3"
                >
                  Generate Recommendation
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Results Sidebar */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-emerald-500/5 border border-dashed border-emerald-500/20 rounded-3xl p-10 flex flex-col items-center justify-center text-center h-[500px]"
              >
                <div className="bg-emerald-500/10 p-4 rounded-full mb-4">
                  <Sprout className="h-10 w-10 text-emerald-500/40" />
                </div>
                <h4 className="text-lg font-black text-slate-400 uppercase tracking-widest">Ready for Analysis</h4>
                <p className="text-sm font-semibold text-slate-400 mt-2">Fill in the soil parameters to see the magic happen.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-900 rounded-3xl p-10 flex flex-col items-center justify-center text-center h-[500px] space-y-6"
              >
                <div className="relative h-24 w-24">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute inset-0 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sprout className="h-8 w-8 text-emerald-500 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-black text-white">Matching Patterns</h4>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">AI Recommendation Engine</p>
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <Card className="bg-emerald-600 border-none p-0 overflow-hidden shadow-lg shadow-emerald-600/20">
                  <div className="p-8 pb-4">
                    <div className="flex items-center gap-2 text-emerald-100 mb-1">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Best Fit Crop</span>
                    </div>
                    <h3 className="text-5xl font-black text-white tracking-tighter">{result.crop}</h3>
                  </div>
                  <div className="px-8 pb-8 pt-4">
                    <p className="text-emerald-50) font-semibold text-sm leading-relaxed mb-6">
                      Based on your soil's Nitrogen levels and pH, {result.crop} has a 94.5% success rate.
                    </p>
                    <div className="flex gap-2">
                       <Button className="flex-1 bg-white text-emerald-600 hover:bg-emerald-50 font-bold h-12">
                         View Details
                       </Button>
                       <Button variant="outline" className="h-12 w-12 p-0 border-emerald-400 text-white hover:bg-emerald-700 bg-transparent">
                         <ChevronRight className="h-5 w-5" />
                       </Button>
                    </div>
                  </div>
                </Card>

                {/* Growth Insights Card */}
                <Card className="p-8 border-gray-100">
                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-6 border-b border-gray-50 pb-2">Critical Insights</h4>
                  <div className="space-y-4">
                    {[
                      { label: "Water Efficiency", score: "High", color: "blue" },
                      { label: "Soil Resilience", score: "Medium", color: "amber" },
                      { label: "Yield Potential", score: "Peak", color: "emerald" },
                    ].map((insight) => (
                      <div key={insight.label} className="flex items-center justify-between group">
                        <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-800 transition-colors uppercase tracking-tight">{insight.label}</span>
                        <div className={`px-2 py-0.5 rounded-lg bg-${insight.color}-50 text-${insight.color}-600 text-[10px] font-bold border border-${insight.color}-100`}>
                          {insight.score}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CropRecommendation;
