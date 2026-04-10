import { motion } from "framer-motion";
import { Sprout, ArrowRight, UserPlus, LogIn, Shield, Zap, Globe, Heart, MapPin } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import Button from "../components/ui/Button";

const Welcome = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden font-sans">
      {/* 🌟 Animated Background & Watermark */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center">
            <img src="/assets/india-map-bg.png" alt="India Map Watermark" className="w-[80%] h-[80%] object-contain" />
        </div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* 🚀 Navigation Bar */}
      <nav className="relative z-50 flex items-center justify-between px-8 md:px-12 py-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">
            <Sprout className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
            Agro<span className="text-emerald-500">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <button className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">
              Sign In
            </button>
          </Link>
          <Link to="/register">
            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-950/10">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* 🎬 Hero Section */}
      <main className="relative z-10 flex items-center justify-center px-8 md:px-16 pt-4 pb-12 min-h-[calc(100vh-120px)] max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase tracking-[0.2em]">
              <MapPin size={12} className="fill-emerald-600" /> Empowering the Heart of India
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.95] italic uppercase">
              Agro<span className="text-emerald-500">AI</span> – <span className="text-emerald-500">Kisan Pragati</span>, Bharat Ki Shakti
            </h1>
            
            <p className="text-base md:text-lg text-slate-500 font-medium max-w-lg leading-relaxed">
              Leading the revolution in precision agriculture. Harnessing neural intelligence to strengthen the backbone of our nation.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link to="/register" className="w-full sm:w-auto">
                <button className="w-full h-14 sm:px-8 rounded-xl bg-emerald-500 text-white font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all duration-500 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 group">
                  Get Started <UserPlus size={16} className="group-hover:scale-110 transition-transform" />
                </button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <button className="w-full h-14 sm:px-8 rounded-xl bg-white border-2 border-slate-100 text-slate-900 font-black text-[11px] uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 transition-all duration-500 shadow-md flex items-center justify-center gap-2">
                  Sign In <LogIn size={16} />
                </button>
              </Link>
            </div>
            
            {/* Stats row inside hero */}
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-100 max-w-md">
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white shadow-sm border border-slate-50 flex items-center justify-center text-emerald-500">
                     <Heart size={16} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-lg font-black text-slate-900 leading-none">50K+</span>
                     <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Active Farmers</span>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white shadow-sm border border-slate-50 flex items-center justify-center text-emerald-500">
                     <Shield size={16} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-lg font-black text-slate-900 leading-none">99.2%</span>
                     <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Accuracy</span>
                  </div>
               </div>
            </div>
          </motion.div>

          {/* Right Image Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl group border-4 border-white aspect-[4/3] lg:aspect-auto">
               <img 
                 src="/assets/india-hero.png" 
                 alt="India Agriculture 4.0" 
                 className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent" />
            </div>
            
            {/* Floating UI Elements */}
            <div className="absolute -top-6 -right-6 p-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 animate-bounce-slow hidden md:block">
               <Globe className="text-emerald-500 h-6 w-6" />
            </div>
            <div className="absolute -bottom-4 -left-4 p-4 bg-white shadow-xl rounded-2xl border border-slate-50 hidden md:block">
               <div className="flex items-center gap-2">
                  <Zap className="text-amber-400 fill-amber-400 h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Live Optimization</span>
               </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      {/* 📜 Footer Mini */}
      <footer className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
          AgroAI Digital Sovereignty &copy; 2026
        </p>
      </footer>
    </div>
  );
};

export default Welcome;
