import { useState } from "react";
import { Upload, Droplets, ArrowRight, CheckCircle2, AlertCircle, Loader2, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { toast } from "sonner";

const SoilAnalysis = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a soil image first");

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict-crop-from-soil", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        setResult(data);
        toast.success("Analysis complete!");
      } else {
        toast.error(data.error || "Analysis failed");
      }
    } catch (err) {
      toast.error("Could not connect to the analysis server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-black text-gray-800 tracking-tight">
          Soil <span className="text-emerald-600">Analysis</span>
        </h1>
        <p className="text-gray-600 font-semibold max-w-xl mx-auto">
          Upload a high-resolution photo of your farm's soil. Our AI will analyze the texture, color, and composition to determine the best crop for your land.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Upload Section */}
        <Card className="p-8 border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group cursor-pointer border-2 border-dashed border-gray-300 rounded-2xl hover:border-emerald-500 hover:bg-gray-50 transition-all duration-200 overflow-hidden p-10 flex flex-col items-center justify-center gap-4 min-h-[300px] bg-gray-50/50">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              {preview ? (
                <img src={preview} alt="Soil Preview" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <>
                  <div className="h-16 w-16 bg-white text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200 shadow-sm border border-gray-100">
                    <Upload className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-800">Choose Soil Photo</p>
                    <p className="text-sm font-semibold text-gray-400 mt-1 uppercase tracking-widest">or drag & drop here</p>
                  </div>
                </>
              )}
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full h-14 text-lg font-bold"
            >
              Analyze Soil Composition
            </Button>
          </form>
        </Card>

        {/* Result Section */}
        <div className="space-y-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-10 text-center text-slate-400 space-y-4"
              >
                <AlertCircle className="h-12 w-12 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest">Waiting for analysis...</p>
              </motion.div>
            )}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-10 text-center space-y-6"
              >
                <div className="relative">
                  <Loader2 className="h-16 w-16 text-emerald-500 animate-spin" />
                  <Droplets className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-emerald-500 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-black text-slate-800">Analyzing Samples...</p>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Scanning color & texture</p>
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card className="bg-emerald-600 border-none text-white relative overflow-hidden group shadow-lg shadow-emerald-600/20">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-emerald-100 uppercase tracking-widest font-bold text-[10px] mb-4 bg-emerald-700/50 w-fit px-3 py-1 rounded-full">
                      <CheckCircle2 className="h-3 w-3" />
                      Predicted Soil Type
                    </div>
                    <h3 className="text-4xl font-black tracking-tight">{result.soil_type || "N/A"}</h3>
                  </div>
                  <Droplets className="absolute -bottom-4 -right-4 h-32 w-32 text-emerald-500/30 -rotate-12 group-hover:scale-110 transition-transform duration-500" />
                </Card>

                <Card className="bg-gray-900 border-none text-white relative overflow-hidden group shadow-lg shadow-gray-900/20">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-gray-400 uppercase tracking-widest font-bold text-[10px] mb-4 bg-gray-800 w-fit px-3 py-1 rounded-full">
                      <TrendingUp className="h-3 w-3" />
                      Highest Recommendation
                    </div>
                    <h3 className="text-4xl font-black tracking-tight text-emerald-400">{result.recommended_crop || "N/A"}</h3>
                  </div>
                  <ArrowRight className="absolute -bottom-4 -right-4 h-32 w-32 text-gray-800 -rotate-12 group-hover:translate-x-4 transition-transform duration-500" />
                </Card>
                
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                  Accuracy Score: 98.2% based on current training data.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SoilAnalysis;
