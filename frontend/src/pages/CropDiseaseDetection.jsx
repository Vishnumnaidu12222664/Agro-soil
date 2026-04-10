import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Search, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink, 
  Phone, 
  Leaf, 
  Zap, 
  Microscope,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { predictDisease as detectDisease } from '../api/diseaseApi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const CropDiseaseDetection = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedImage) return;
        setLoading(true);
        setError(null);
        try {
            const data = await detectDisease(selectedImage);
            if (data.error) {
                setError(data.error);
            } else {
                setResult(data);
            }
        } catch (err) {
            setError("Failed to connect to the analysis engine. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const clearSelection = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="min-h-screen bg-neutral-50/50 p-6 lg:p-10 font-sans">
            {/* Header Section */}
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-7xl mx-auto mb-12 text-center"
            >
                <div className="inline-flex items-center justify-center p-2 px-4 mb-4 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold tracking-wide uppercase">
                    <Zap size={14} className="mr-2" />
                    AI-Powered Diagnostics
                </div>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-neutral-900 mb-4 tracking-tight">
                    Plant Health <span className="text-emerald-600">Vision Engine</span>
                </h1>
                <p className="text-neutral-600 max-w-2xl mx-auto text-lg leading-relaxed">
                    Upload a high-resolution photo of your crop's leaf for microscopic analysis. 
                    Our neural network will identify patterns, pathogens, and suggest immediate treatments.
                </p>
            </motion.div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Upload Column */}
                <motion.div 
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="lg:col-span-5 space-y-6"
                >
                    <Card className="overflow-hidden border-2 border-dashed border-neutral-200 hover:border-emerald-400 transition-colors bg-white/80 backdrop-blur-sm group">
                        <div className="p-8 text-center">
                            {!previewUrl ? (
                                <div className="space-y-6 py-12">
                                    <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                        <Upload className="text-emerald-500" size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-neutral-800">Drop your image here</h3>
                                        <p className="text-sm text-neutral-500">Supports JPG, PNG up to 10MB</p>
                                    </div>
                                    <Button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 rounded-2xl shadow-lg shadow-emerald-200 transition-all font-bold text-base"
                                    >
                                        Choose File
                                    </Button>
                                </div>
                            ) : (
                                <div className="relative rounded-2xl overflow-hidden group">
                                    <img 
                                        src={previewUrl} 
                                        alt="Preview" 
                                        className="w-full h-auto aspect-square object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <Button 
                                            variant="danger" 
                                            size="sm" 
                                            onClick={clearSelection}
                                            className="bg-red-500/90 hover:bg-red-600 shadow-xl"
                                        >
                                            <Trash2 size={18} className="mr-2" /> Replace
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleImageSelect}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                    </Card>

                    <AnimatePresence>
                        {previewUrl && !result && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <Button 
                                    onClick={handleAnalyze}
                                    disabled={loading}
                                    className="w-full py-8 !bg-neutral-900 group relative overflow-hidden flex items-center justify-center gap-3 rounded-3xl"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            <span className="font-black text-lg">AI ANALYZING...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Microscope className="group-hover:rotate-12 transition-transform" />
                                            <span className="font-black text-lg">START SCANNING</span>
                                        </>
                                    )}
                                    <div className="absolute right-[-20%] top-0 bottom-0 w-1/2 bg-emerald-500/10 skew-x-12 transform group-hover:translate-x-full transition-transform duration-1000" />
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {error && (
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3"
                        >
                            <AlertCircle size={20} />
                            <span className="text-sm font-semibold">{error}</span>
                        </motion.div>
                    )}
                </motion.div>

                {/* Right Side: Analysis & Results Column */}
                <div className="lg:col-span-7 space-y-6">
                    <AnimatePresence mode="wait">
                        {!result && !loading && (
                            <motion.div 
                                key="waiting"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center bg-white/40 border-2 border-dashed border-neutral-200 rounded-[3rem]"
                            >
                                <Search size={64} className="text-neutral-200 mb-6" />
                                <h3 className="text-2xl font-bold text-neutral-400">Waiting for Data Pipeline</h3>
                                <p className="text-neutral-400 mt-2 max-w-xs">Upload an image to trigger the diagnostic engine</p>
                            </motion.div>
                        )}

                        {loading && (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 bg-emerald-950/5 border border-emerald-100 rounded-[3rem] overflow-hidden relative"
                            >
                                <motion.div 
                                    animate={{ 
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="relative z-10"
                                >
                                    <Microscope size={80} className="text-emerald-500/30" />
                                </motion.div>
                                <div className="mt-8 relative z-10">
                                    <div className="flex gap-2 mb-4">
                                        {[1,2,3].map(i => (
                                            <motion.div 
                                                key={i}
                                                animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1, 0.9] }}
                                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                                className="w-3 h-3 bg-emerald-500 rounded-full"
                                            />
                                        ))}
                                    </div>
                                    <h4 className="text-emerald-900 font-black text-xl tracking-wider text-center">PATHOGEN MATCHING...</h4>
                                </div>
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 to-transparent blur-3xl" />
                            </motion.div>
                        )}

                        {result && (
                            <motion.div 
                                key="result"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                {/* Primary Insight Card */}
                                <div className="bg-emerald-600 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">
                                                Diagnostic Result
                                            </span>
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                                                <CheckCircle2 size={24} className="text-white" />
                                            </div>
                                        </div>
                                        <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight">{result.disease}</h2>
                                        
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm font-black mb-1">
                                                <span>ENGINE CONFIDENCE</span>
                                                <span className="text-white/80">{result.confidence}%</span>
                                            </div>
                                            <div className="h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${result.confidence}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-[-20%] right-[-10%] opacity-20 group-hover:opacity-30 transition-opacity">
                                        <Leaf size={300} strokeWidth={1} />
                                    </div>
                                </div>

                                {/* Treatment Detail Card */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="p-8 border-none bg-white rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all h-full">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                                                <Zap size={20} />
                                            </div>
                                            <h3 className="text-xl font-bold text-neutral-800 tracking-tight">Cure Action Plan</h3>
                                        </div>
                                        <p className="text-neutral-600 leading-relaxed font-medium mb-8 italic">
                                            "{result.treatment}"
                                        </p>
                                        {result.source && (
                                            <a 
                                                href={result.source} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-black text-sm group"
                                            >
                                                RESEARCH RESOURCE <ExternalLink size={16} className="ml-2 transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                                            </a>
                                        )}
                                    </Card>

                                    <Card className="p-8 border-none bg-neutral-900 text-white rounded-[2.5rem] shadow-xl">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-white/10 text-emerald-400 rounded-xl flex items-center justify-center">
                                                <Phone size={20} />
                                            </div>
                                            <h3 className="text-xl font-bold tracking-tight text-white">Crisis Support</h3>
                                        </div>
                                        <div className="space-y-6">
                                            {result.helplines?.map((help, idx) => (
                                                <div key={idx} className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-3 rounded-2xl transition-colors">
                                                    <div>
                                                        <p className="text-xs text-neutral-400 uppercase font-black tracking-widest">{help.service}</p>
                                                        <p className="font-bold text-lg text-emerald-400 tracking-tight">{help.number}</p>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full border border-white/20 items-center justify-center hidden group-hover:flex">
                                                        <Phone size={14} className="text-white" />
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="pt-2 border-t border-white/10">
                                                <p className="text-[10px] text-neutral-500 font-bold leading-tight uppercase tracking-tighter">
                                                    Official agricultural help lines verified for season 2026.
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                {/* Pro Tip Card */}
                                <div className="bg-orange-50 border border-orange-100 p-6 rounded-[2rem] flex gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm">
                                        <Info className="text-orange-500" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-orange-900 mb-1 tracking-tight">AgroAI Prediction Disclaimer</h4>
                                        <p className="text-xs text-orange-700/80 font-medium">
                                            Always cross-verify with local environmental conditions before applying chemical treatments. Use protective gear when handling fungicides.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CropDiseaseDetection;
