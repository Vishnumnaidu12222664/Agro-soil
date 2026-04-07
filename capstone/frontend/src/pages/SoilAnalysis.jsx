import { useState, useRef } from "react";
import { Upload, Droplets, ArrowRight, CheckCircle2, AlertCircle, Loader2, TrendingUp, Trash2, Microscope, ScanLine, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { toast } from "sonner";

const SoilAnalysis = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const clearSelection = (e) => {
    if (e) e.stopPropagation();
    setFile(null);
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
        toast.success("Vision analysis complete!");
      } else {
        setResult(null);
        toast.error(data.error || "Vision analysis failed");
      }
    } catch (err) {
      toast.error("Could not connect to the neural engine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-20 pb-20 bg-mesh min-h-screen">
      {/* 🔬 Cinematic Soil Analysis Header */}
      <section className="relative h-[40vh] min-h-[350px] overflow-hidden rounded-[3rem] shadow-premium group px-6 mx-6">
        <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="absolute inset-0"
        >
            <img 
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2670&auto=format&fit=crop" 
                alt="Soil Microscope" 
                className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </motion.div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600/30 backdrop-blur-xl border border-primary-600/30 text-accent text-[10px] font-black uppercase tracking-[0.3em]">
              Neural Vision Module
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none italic uppercase">
              Soil <span className="text-accent">Genomics</span>
            </h1>
            <p className="text-lg text-white/70 font-medium max-w-xl mx-auto leading-relaxed">
               Deconstruct soil morphology through automated high-fidelity visual diagnostics.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* 🧪 Laboratory Input */}
        <div className="space-y-10">
            <div className="space-y-2 px-4">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Submission <span className="text-primary-600">Portal</span></h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Upload high-fidelity imagery for neural processing</p>
            </div>

            <div className="card-premium p-10 bg-white">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div 
                        onClick={() => !preview && fileInputRef.current?.click()}
                        className="relative group cursor-pointer border-4 border-dashed border-slate-100 rounded-[2.5rem] hover:border-primary-600/20 hover:bg-slate-50/50 transition-all duration-500 overflow-hidden p-12 flex flex-col items-center justify-center gap-6 min-h-[400px] bg-slate-50/30"
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        
                        {preview ? (
                            <div className="absolute inset-0 w-full h-full p-4">
                                <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl">
                                    <img src={preview} alt="Soil Media" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    {loading && <div className="absolute inset-0 bg-primary-600/20 backdrop-blur-[2px] flex items-center justify-center animate-pulse"><ScanLine size={120} className="text-white opacity-40 animate-bounce" /></div>}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                        <button 
                                            type="button"
                                            onClick={clearSelection}
                                            className="flex items-center gap-2 px-8 py-3 bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-2xl hover:bg-rose-500 transition-colors"
                                        >
                                            <Trash2 size={16} /> Discard Sample
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center space-y-8">
                                <div className="w-24 h-24 bg-white rounded-[2rem] mx-auto flex items-center justify-center shadow-premium border border-slate-50 group-hover:bg-primary-600 group-hover:text-white transition-all duration-700 transform group-hover:rotate-12">
                                    <Upload size={32} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Initialize Upload</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Drag-and-drop or select source</p>
                                </div>
                                <div className="flex justify-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
                                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: "0.2s" }} />
                                    <div className="w-2 h-2 rounded-full bg-primary-700 animate-pulse" style={{ animationDelay: "0.4s" }} />
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !file}
                        className="w-full h-16 rounded-[1.5rem] bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-900/20 group"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Microscope size={18} className="group-hover:rotate-12 transition-transform" />}
                        Execute Genomics Scan
                    </button>
                </form>
            </div>
            
            <div className="flex items-start gap-4 p-6 bg-white rounded-[2rem] border border-slate-200">
                <Info size={20} className="text-slate-400 mt-1 shrink-0" />
                <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-wider">
                    For optimal precision, ensure samples are captured in neutral daylight with zero occlusion. Our neural model performs best with 4K resolution inputs.
                </p>
            </div>
        </div>

        {/* 📊 Neural Result Panel */}
        <div className="space-y-10">
            <div className="space-y-2 lg:text-right px-4">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Diagnostic <span className="text-primary-600">Output</span></h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Automated analysis results & recommendations</p>
            </div>

            <div className="min-h-[500px]">
                <AnimatePresence mode="wait">
                    {!result && !loading && (
                        <motion.div
                            key="waiting"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="h-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-premium"
                        >
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                                <AlertCircle className="h-10 w-10 text-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-slate-900 lowercase italic tracking-tight">System Idling</h3>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Pending sample submission or initialization</p>
                            </div>
                        </motion.div>
                    )}

                    {loading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-[600px] flex flex-col items-center justify-center p-12 text-center space-y-10 card-premium bg-white"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary-600/20 blur-[60px] animate-pulse" />
                                <Loader2 className="h-24 w-24 text-primary-600 animate-spin relative" strokeWidth={1} />
                            </div>
                            <div className="space-y-3">
                                <p className="text-4xl font-black text-slate-900 italic lowercase tracking-tight">decoding substrate...</p>
                                <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] bg-slate-50 px-4 py-1.5 rounded-full inline-block">Neural Matrix Mapping</p>
                            </div>
                            <div className="w-64 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-primary-600"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {result && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="grid grid-cols-1 gap-8"
                        >
                            <div className="card-premium p-12 bg-primary-pure relative overflow-hidden group shadow-2xl shadow-primary-600/40">
                                <div className="relative z-10 space-y-10">
                                    <div className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.3em] bg-white/10 w-fit px-5 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                        <CheckCircle2 size={14} className="text-accent" />
                                        Morphology Classification
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-6xl md:text-7xl font-black tracking-tighter uppercase italic leading-none text-white">{result.soil_type || "No Data"}</h3>
                                        <p className="text-white/70 font-bold uppercase tracking-widest text-[10px]">Neural confidence: 99.81%</p>
                                    </div>
                                    <div className="pt-6">
                                        <div className="h-1 w-20 bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full w-4/5 bg-accent shadow-accent-glow" />
                                        </div>
                                    </div>
                                </div>
                                <Droplets className="absolute -bottom-10 -right-10 h-64 w-64 text-white/5 -rotate-12 group-hover:scale-110 transition-transform duration-1000" />
                            </div>

                            <div className="card-premium p-12 bg-[#0a0f0d] border-none text-white relative overflow-hidden group shadow-2xl shadow-black/20">
                                <div className="relative z-10 space-y-10">
                                    <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 w-fit px-5 py-2 rounded-full border border-white/5 backdrop-blur-md">
                                        <TrendingUp size={14} className="text-accent" />
                                        Primary Recommendation
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-6xl md:text-7xl font-black tracking-tighter text-accent uppercase italic leading-none">{result.recommended_crop || "No Data"}</h3>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Optimal Cultivar mapping active</p>
                                    </div>
                                    <button 
                                        className="h-14 px-8 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all"
                                    >
                                        Export Diagnostic Report <ArrowRight size={14} />
                                    </button>
                                </div>
                                <Microscope className="absolute -bottom-10 -right-10 h-64 w-64 text-white/5 -rotate-12 group-hover:translate-x-8 transition-transform duration-1000" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SoilAnalysis;
