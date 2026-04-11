import { motion } from "framer-motion";
import { ArrowLeft, Construction, Zap, Globe, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

const FarmToUPortal = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center font-sans bg-slate-950">
      {/* 🎬 Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/farmtou-bg.png" 
          alt="Future of Agriculture" 
          className="w-full h-full object-cover opacity-40 scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950" />
        <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay" />
      </div>

      {/* 🛰️ Floating UI Elements (Ambient) */}
      <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />

      {/* 🏛️ Main Content Container */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-12">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-8"
        >
            <div className="p-4 bg-emerald-500/20 backdrop-blur-xl rounded-[2rem] border border-emerald-500/30 shadow-glow">
                <Globe className="text-emerald-400 h-10 w-10 animate-spin-slow" />
            </div>

            <div className="space-y-4">
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] backdrop-blur-md">
                   <Zap size={14} className="fill-emerald-400" /> System Initialization in Progress
                </span>
                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] italic uppercase">
                  Something <br />
                  <span className="text-emerald-500">Incredible</span> <br />
                  is Building
                </h1>
            </div>

            <p className="text-slate-400 font-medium text-lg md:text-xl max-w-2xl leading-relaxed">
                The <span className="text-white font-bold italic">FarmToU Retail Ecosystem</span> is undergoing state-of-the-art synchronization. We're building the future of decentralized agrarian trade.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
                <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                    <Construction className="text-amber-400 h-5 w-5" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Enhanced UI/UX</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                    <ShieldCheck className="text-blue-400 h-5 w-5" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Neural Security</span>
                </div>
            </div>

            <div className="pt-10">
                <Button 
                    onClick={() => navigate(-1)}
                    className="h-16 px-10 rounded-2xl bg-white text-slate-900 font-black uppercase tracking-widest text-xs hover:bg-emerald-500 hover:text-white transition-all duration-500 shadow-premium flex items-center gap-4 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" />
                    Back to Control Center
                </Button>
            </div>
        </motion.div>
      </main>

      {/* 🏁 Footer Watermark */}
      <footer className="absolute bottom-10 left-0 right-0 text-center opacity-30">
        <p className="text-[9px] font-black text-white uppercase tracking-[0.5em]">
          Secure Gateway Protocol v. 4.9.2 // FARMTOU.IO
        </p>
      </footer>

      <style jsx>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 30s infinite ease-in-out;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default FarmToUPortal;
