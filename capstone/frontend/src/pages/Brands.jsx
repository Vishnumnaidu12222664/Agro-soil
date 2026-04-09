import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { 
  ShieldCheck, 
  FlaskConical, 
  Tractor, 
  ExternalLink, 
  Star, 
  Award,
  Zap,
  TrendingUp,
  Tag
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const Brands = () => {
    const { category } = useParams();

    const brandData = {
        pesticides: {
            title: "Premium Protective Solutions",
            subtitle: "Global Leaders in Crop Protection & Bio-Defenders",
            items: [
                { name: "Bayer CropScience", desc: "Advanced fungal and insect control for high-yield grains.", rating: 4.9, image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=2670&auto=format&fit=crop" },
                { name: "Syngenta", desc: "Holistic pest management with sustainable bio-catalysts.", rating: 4.8, image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2670&auto=format&fit=crop" },
                { name: "UPL Limited", desc: "Strategic crop protection for diverse tropical soil types.", rating: 4.7, image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=2670&auto=format&fit=crop" }
            ]
        },
        fertilizers: {
            title: "Nutritional Excellence",
            subtitle: "Elite Soil Enrichment & Micronutrient Precision",
            items: [
                { name: "Yara International", desc: "Digital farming solutions for nitrogen optimization.", rating: 5.0, image: "https://images.unsplash.com/photo-1624814233195-0231ea74d4b2?q=80&w=2670&auto=format&fit=crop" },
                { name: "IFFCO", desc: "India's premier cooperative nitrogen-rich urea and DAP.", rating: 4.9, image: "https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?q=80&w=2670&auto=format&fit=crop" },
                { name: "Nutrien", desc: "Comprehensive potash and phosphate nutritional suites.", rating: 4.7, image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=2670&auto=format&fit=crop" }
            ]
        },
        equipment: {
            title: "Precision Machinery",
            subtitle: "Autonomous Operations & Heavy Agrarian Logistics",
            items: [
                { name: "John Deere", desc: "The Gold Standard in autonomous tractors and digital harvester units.", rating: 5.0, image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop" },
                { name: "Mahindra & Mahindra", desc: "Global OJA series engineered for the ultimate Indian subcontinent terrains.", rating: 4.8, image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2670&auto=format&fit=crop" },
                { name: "Kubota", desc: "Elite compact precision machinery for intensive orchard and horticulture.", rating: 4.6, image: "https://images.unsplash.com/photo-1594495894542-a46cc73e081a?q=80&w=2670&auto=format&fit=crop" }
            ]
        }
    };

    const current = brandData[category] || brandData.pesticides;

    return (
        <div className="space-y-20 pb-20">
            {/* 🚀 Partner Hero */}
            <section className="relative h-[40vh] min-h-[350px] overflow-hidden rounded-[3rem] shadow-premium group">
                <div className="absolute inset-0 bg-[#003D1E]" />
                <div className="absolute inset-0 bg-mesh opacity-20" />
                
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-accent text-[10px] font-black uppercase tracking-[0.3em]">
                           Official Strategic Partnerships
                        </span>
                        <h1 className="text-6xl font-extrabold text-white tracking-tighter uppercase italic">{current.title}</h1>
                        <p className="text-white/60 font-medium max-w-xl mx-auto uppercase tracking-widest text-xs">{current.subtitle}</p>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#003D1E] to-transparent" />
            </section>

            {/* 🏷️ Partner Grid */}
            <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {current.items.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="group"
                    >
                        <div className="card-premium p-10 bg-white h-full flex flex-col justify-between hover:border-[#009B4D] hover:shadow-2xl transition-all duration-500">
                            <div className="space-y-8">
                                <div className="h-48 w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 group-hover:scale-105 transition-transform duration-700">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-[#009B4D] text-[10px] font-black uppercase tracking-widest bg-[#009B4D]/5 px-3 py-1 rounded-full border border-[#009B4D]/10">
                                        <Award size={12} /> Certified Partner
                                    </div>
                                    <div className="flex gap-1">
                                        {[1,2,3,4,5].map(star => <Star key={star} size={10} className={star <= Math.floor(item.rating) ? "fill-accent text-accent" : "text-slate-200"} />)}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none group-hover:text-[#009B4D] transition-colors uppercase italic">{item.name}</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed text-sm">{item.desc}</p>
                                </div>
                            </div>

                            <div className="pt-10 flex flex-col gap-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <TrendingUp size={14} /> Efficiency Rating
                                    </div>
                                    <span className="font-black text-slate-900">{item.rating}/5.0</span>
                                </div>
                                <button
                                    onClick={() => window.open("https://google.com/search?q=" + encodeURIComponent(item.name), "_blank")}
                                    className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 group-hover:bg-[#009B4D] transition-all shadow-xl"
                                >
                                    Access Partner Portal <ExternalLink size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 🏛️ Promotion Banner */}
            <div className="mx-6 p-12 bg-[#FFCC00] rounded-[3rem] overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-[600px] h-full bg-white/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-900 text-[10px] font-black uppercase tracking-[0.3em]">
                            <Tag size={16} /> Exclusive Seasonal Subsidy
                        </div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Institutional <span className="text-white drop-shadow-lg">Discounts</span></h2>
                        <p className="text-slate-800 font-bold max-w-md text-sm">
                            Access bulk-purchase rebates and govt. backed seasonal grants through our centralized strategic partners.
                        </p>
                    </div>
                    <Button variant="secondary" className="px-12 h-16 rounded-2xl border-none shadow-2xl hover:scale-105 transition-transform text-slate-900 font-extrabold uppercase tracking-widest bg-white">
                        Inquire Now
                    </Button>
                </div>
                <Tractor size={300} className="absolute bottom-[-10%] right-[-5%] text-slate-900 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
            </div>
        </div>
    );
};

export default Brands;
