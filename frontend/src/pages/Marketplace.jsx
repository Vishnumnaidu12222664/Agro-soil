import { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  MapPin, 
  Search, 
  Plus,
  Store,
  Package,
  TrendingUp,
  Loader2,
  CheckCircle2,
  IndianRupee,
  ArrowRight,
  Filter,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { getProducts, orderProduct } from "../api/marketplaceApi";
import { toast } from "sonner";

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateOrder = async (productId) => {
    try {
      await orderProduct(productId);
      toast.success("Order request dispatched", {
        description: "Transaction initialized successfully.",
        icon: <CheckCircle2 className="h-5 w-5 text-primary-600" />
      });
      fetchProducts();
    } catch (err) {
      toast.error("Transaction failed");
    }
  };

  const filteredProducts = products.filter(p => 
    p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch (e) {
      return {};
    }
  })();

  return (
    <div className="space-y-20 pb-20 bg-mesh min-h-screen">
      {/* 🏙️ Marketplace Cinematic Header */}
      <section className="relative h-[45vh] min-h-[400px] overflow-hidden rounded-[3rem] shadow-premium group px-6">
        <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="absolute inset-0"
        >
            <img 
                src="/assets/marketplace-hero.png" 
                alt="Marketplace Hero" 
                className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </motion.div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/30 backdrop-blur-xl border border-accent/30 text-accent text-[10px] font-black uppercase tracking-[0.3em]">
              Agrarian Exchange 2.0
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none italic uppercase">
              The <span className="text-accent">Market</span> Floor
            </h1>
            <p className="text-lg text-white/70 font-medium max-w-xl mx-auto leading-relaxed">
              Premium farm-to-table logistics and decentralized trade portal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🔍 Premium Navigation & Search */}
      <section className="px-6 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white p-6 rounded-[2.5rem] shadow-premium border border-gray-100">
             <div className="relative group flex-1 w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Query harvest, location or cultivar..." 
                  className="w-full pl-16 pr-8 h-12 bg-slate-50 border-none rounded-2xl font-black text-slate-900 uppercase tracking-widest text-[10px] focus:outline-none focus:ring-4 focus:ring-primary-600/10 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>

             <div className="flex gap-4 items-center">
                <Link to="/marketplace/my">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-50 text-slate-900 font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors border border-slate-200 shadow-sm">
                        <Store size={14} /> My Inventory
                    </button>
                </Link>
                <Link to="/marketplace/add">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-primary-700 transition-all shadow-glow">
                        <Plus size={14} /> List Product
                    </button>
                </Link>
             </div>
        </div>

        <AnimatePresence mode="wait">
            {loading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[400px] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Querying Global Networks...</p>
            </motion.div>
            ) : filteredProducts.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-[500px] flex flex-col items-center justify-center text-center space-y-8 bg-white/50 rounded-[3rem] border-2 border-dashed border-gray-100 backdrop-blur-sm shadow-premium">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingBag size={48} className="text-gray-200" />
                </div>
                <div className="space-y-2">
                    <p className="text-2xl font-black text-slate-900 italic lowercase tracking-tight">no matches in this sector</p>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">expand your parameters or list new produce</p>
                </div>
                <Button onClick={() => setSearchTerm("")} variant="outline" className="rounded-full px-8 h-12 border-slate-200 text-slate-900 hover:bg-slate-50">Reset Search</Button>
            </motion.div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {filteredProducts.map((p, i) => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group"
                >
                    <div className="card-premium h-full relative overflow-hidden flex flex-col bg-white">
                        <div className="h-64 w-full overflow-hidden relative bg-slate-50">
                            {p.image_url ? (
                                <img src={p.image_url} alt={p.product_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center border-b border-gray-50">
                                    <Package size={48} className="text-slate-100" />
                                </div>
                            )}
                            <div className="absolute top-6 left-6 glass-dark text-white font-black px-4 py-2 rounded-xl text-xs backdrop-blur-md border border-white/10 shadow-2xl">
                                ₹{p.price_per_kg}/kg
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    
                        <div className="p-8 flex flex-col flex-1">
                            <div className="mb-8">
                                <span className="text-[9px] font-black text-primary-600 uppercase tracking-[0.2em] mb-2 block">Available Stock</span>
                                <h3 className="text-2xl font-black text-slate-900 transition-colors uppercase tracking-tight pr-4 leading-none group-hover:text-primary-600">{p.product_name}</h3>
                                <div className="flex items-center gap-2 text-slate-400 mt-4 h-5">
                                    <MapPin size={12} className="text-accent" />
                                    <span className="text-[9px] font-black uppercase tracking-widest truncate">{p.location || "Global Coordinates"}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50 mb-8">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Farmer Identity</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{p.farmer_name || "Merchant 01"}</p>
                                        {p.is_verified && (
                                            <div className="bg-[#FFD700] p-1 rounded-full text-slate-900 shadow-sm" title="Verified Professional">
                                                <ShieldCheck size={10} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Quantity</p>
                                    <p className="text-xs font-black text-primary-600 uppercase tracking-tight">{p.quantity} kg</p>
                                </div>
                            </div>

                            {currentUser.id !== p.user_id ? (
                                <button 
                                    onClick={() => handleSimulateOrder(p.id)}
                                    className="w-full h-14 rounded-2xl bg-slate-900 group-hover:bg-primary-600 text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl"
                                >
                                    <IndianRupee size={14} className="group-hover:rotate-[360deg] transition-transform duration-700" />
                                    Initialize Order
                                </button>
                            ) : (
                                <div className="w-full h-14 rounded-2xl bg-slate-100 text-slate-400 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center border-2 border-dashed border-slate-200">
                                    Your Asset
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
                ))}
            </div>
            )}
        </AnimatePresence>
      </section>

      {/* 🌐 External Bridge */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto p-12 rounded-[3.5rem] bg-gradient-to-br from-slate-900 to-slate-950 text-white relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="space-y-6 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-accent text-[10px] font-black uppercase tracking-[0.3em]">
                        Cross-Platform Synchronization
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none uppercase">
                        FarmToU <span className="text-accent">Portal</span>
                    </h2>
                    <p className="text-slate-400 font-medium max-w-md uppercase tracking-widest text-[11px] leading-relaxed">
                        This marketplace is for farmers to list and manage. Consumers access your products through our specialized retail gateway.
                    </p>
                </div>
                <a 
                    href="https://farmto-u.platform" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white text-slate-900 px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-accent hover:text-white transition-all shadow-glow flex items-center gap-4 group/btn"
                >
                    Visit Public Platform <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                </a>
            </div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-[100px] group-hover:bg-accent/20 transition-colors" />
        </div>
      </section>
    </div>
  );
};

export default Marketplace;
