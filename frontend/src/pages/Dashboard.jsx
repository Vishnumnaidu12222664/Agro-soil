import { motion } from "framer-motion";
import { 
  BarChart3, 
  Sprout, 
  Droplets, 
  ShoppingBag, 
  Bug, 
  LayoutDashboard, 
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Info,
  Shield,
  Zap,
  Quote,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const Dashboard = () => {
  const features = [
    { 
      title: "Soil Vision", 
      description: "Proprietary neural mapping for deep substrate analysis and morphological classification.", 
      icon: Droplets, 
      path: "/soil",
      color: "bg-primary-pure"
    },
    { 
      title: "Crop Oracle", 
      description: "Predictive engine utilizing global datasets to recommend optimal high-yield cultivars.", 
      icon: Sprout, 
      path: "/recommend",
      color: "bg-slate-900"
    },
    { 
      title: "Market Flux", 
      description: "Real-time nationwide trade indices with 99.8% data fidelity for precision harvesting.", 
      icon: BarChart3, 
      path: "/prices",
      color: "bg-primary-pure"
    },
    { 
      title: "Biopath AI", 
      description: "Automated phytopathology diagnostics to identify and neutralize crop threats instantly.", 
      icon: Bug, 
      path: "/crop-disease",
      color: "bg-slate-900"
    },
    { 
      title: "Decentralized Trade", 
      description: "Peer-to-peer logistic network connecting independent operators with global markets.", 
      icon: ShoppingBag, 
      path: "/marketplace",
      color: "bg-primary-pure"
    }
  ];

  const testimonials = [
    {
        name: "Vikram R.",
        location: "Punjab Sector",
        quote: "The neural vision diagnostics saved my harvest from a silent pathogen. AgroAI is the gold standard.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop"
    },
    {
        name: "Anita S.",
        location: "Kamataka District",
        quote: "Real-time market flux data allows me to arbitrage prices across districts with absolute precision.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop"
    },
    {
        name: "Samuel L.",
        location: "Global Operator",
        quote: "A seamless synchronization of AI and tradition. The interface feels like a glimpse into the future.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2570&auto=format&fit=crop"
    }
  ];

  const indianSchemes = [
    { name: "PM-Kisan System", url: "https://pmkisan.gov.in/" },
    { name: "e-NAM Portal", url: "https://www.enam.gov.in/" },
    { name: "KCC Integration", url: "https://www.myscheme.gov.in/schemes/kcc" },
    { name: "Crop Insurance", url: "https://pmfby.gov.in/" }
  ];

  return (
    <div className="space-y-32 pb-32 bg-mesh min-h-screen">
      {/* 🎬 Cinematic Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden rounded-[4rem] mx-6 mt-6 shadow-premium group">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop" 
            alt="Premium Farm" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-8"
          >
            <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.4em] shadow-glow">
              Future of Agrarian Intelligence
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase">
              <span className="text-[#FF9933]">AgroAI</span> – <span className="text-white">Kisan Pragati</span>, <span className="text-[#138808]">Bharat Ki Shakti</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 font-medium max-w-3xl mx-auto leading-relaxed">
              Empowering global farmers with high-fidelity neural diagnostics and real-time market orchestration.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-10">
              <Link to="/soil">
                <button className="h-16 px-10 rounded-2xl bg-white text-slate-950 font-black text-[12px] uppercase tracking-widest hover:bg-accent hover:text-white transition-all duration-500 shadow-2xl flex items-center gap-3 group">
                   Initialize Analysis <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
              <Link to="/marketplace">
                <button className="h-16 px-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-black text-[12px] uppercase tracking-widest hover:bg-white/20 transition-all duration-500 flex items-center gap-3">
                   Explore Exchange <ShoppingBag size={18} />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🚀 Feature Grid Section */}
      <section className="px-6 space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
           <div className="space-y-4">
              <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em]">Operational Matrix</p>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">The Vision <span className="text-primary-600">Pipeline</span></h2>
           </div>
           <p className="text-slate-400 font-bold max-w-md text-[13px] uppercase tracking-widest leading-loose">
              Unified systems designed for precision scalability and resource optimization.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <Link 
              key={index}
              to={feature.path}
              className="group block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-premium p-10 group relative overflow-hidden flex flex-col justify-between h-[450px] cursor-pointer hover:-translate-y-4 transition-all duration-500"
              >
                <div className="relative z-10">
                  <div className={twMerge(
                    "w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-10 transition-all duration-700 transform group-hover:rotate-[360deg] shadow-premium",
                    feature.color === "bg-primary-pure" ? "bg-primary-pure text-white shadow-glow" : "bg-slate-900 text-white"
                  )}>
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter italic leading-none group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 font-medium text-[15px] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                <div className="relative z-10 w-fit">
                    <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-primary-600 transition-colors">
                        Access Module <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="absolute top-0 right-0 p-8 transform translate-x-1/4 -translate-y-1/4 opacity-0 group-hover:opacity-10 transition-opacity">
                  <feature.icon size={180} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* 📜 Testimonials Section */}
      <section className="px-6 py-20 bg-slate-950 rounded-[4rem] text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 max-w-6xl mx-auto space-y-20">
          <div className="text-center space-y-6">
            <Quote className="h-16 w-16 text-accent/40 mx-auto transform -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
            <h2 className="text-5xl font-black tracking-tighter italic uppercase text-white">Trusted by the <span className="text-accent underline decoration-white/10 underline-offset-8 decoration-8">Frontline</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl relative group hover:bg-white/10 transition-all duration-500"
              >
                <div className="flex items-center gap-4 mb-8">
                    <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full border-2 border-accent p-1 object-cover" />
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-white">{t.name}</p>
                        <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">{t.location}</p>
                    </div>
                </div>
                <p className="text-sm font-medium text-white/70 italic leading-relaxed">"{t.quote}"</p>
                <div className="mt-8 flex gap-1">
                    {[1,2,3,4,5].map(star => <Star key={star} size={12} className="fill-accent text-accent" />)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏛️ Indian Portals Section */}
      <section className="px-6">
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                 <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Global <span className="text-primary-600">Integrations</span></h2>
                 <div className="h-px bg-slate-200 flex-1 hidden md:block mx-10" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Strategic Partnerships</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                 {indianSchemes.map((s, i) => (
                     <a 
                        key={i} 
                        href={s.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-8 rounded-[2rem] bg-white border border-slate-100 flex flex-col items-center justify-center text-center gap-4 hover:bg-white hover:shadow-premium hover:border-accent group transition-all duration-500"
                     >
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shadow-sm group-hover:bg-accent group-hover:text-white transition-colors">
                            <Info size={20} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 leading-tight">{s.name}</p>
                     </a>
                 ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
