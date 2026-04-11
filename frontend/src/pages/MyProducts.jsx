import { useState, useEffect } from "react";
import { 
  Plus, 
  MapPin, 
  IndianRupee, 
  Scale, 
  Package,
  Store,
  ChevronRight,
  TrendingUp,
  Loader2,
  AlertCircle,
  BarChart3,
  ShoppingCart,
  Wallet,
  ArrowRight,
  Zap,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { getMyProducts, deleteProduct } from "../api/marketplaceApi";
import { toast } from "sonner";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({ earnings: 0, orders: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const data = await getMyProducts();
      setProducts(data);
      const earnings = data.reduce((acc, p) => acc + (p.earnings || 0), 0);
      const orders = data.reduce((acc, p) => acc + (p.orders_count || 0), 0);
      setTotalStats({ earnings, orders });
    } catch (err) {
      toast.error("Cloud synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you certain you want to decommission this asset? This action is irreversible.")) return;
    
    try {
      await deleteProduct(productId);
      toast.success("Asset decommissioned successfully");
      fetchMyProducts(); // Refresh list
    } catch (err) {
      toast.error(err.message || "Failed to remove asset");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-20 font-sans">
      {/* 🏙️ Strategic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-gray-100 pb-12 mx-6">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#009B4D]/10 text-[#009B4D] px-5 py-2 rounded-full font-black uppercase tracking-[0.2em] text-[10px] border border-[#009B4D]/20">
             <Zap size={14} className="animate-pulse" />
             OPERATOR PORTFOLIO
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tighter leading-none italic uppercase">
            My <span className="text-[#009B4D]">Inventory</span>
          </h1>
          <p className="text-slate-500 font-bold max-w-xl text-lg uppercase tracking-widest text-[11px] leading-relaxed">
            Proprietary analytics and logistics management for listed agrarian assets.
          </p>
        </div>

        <div className="flex flex-wrap gap-5">
            <Link to="/marketplace">
              <Button variant="outline" className="h-14 gap-3 font-black border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all rounded-2xl px-8">
                <Store size={18} />
                Public Exchange
              </Button>
            </Link>
            <Link to="/marketplace/add">
              <Button className="h-14 gap-3 bg-[#009B4D] text-white hover:bg-[#007d3e] rounded-2xl border-none font-black uppercase tracking-widest text-xs px-8 shadow-xl">
                <Plus size={18} />
                Add New Asset
              </Button>
            </Link>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[500px] flex flex-col items-center justify-center space-y-6">
            <Loader2 className="h-12 w-12 text-[#009B4D] animate-spin" />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] leading-none">Consulting Global Ledger...</p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-20 px-6"
          >
            {/* 📊 Intelligence Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <Card className="p-10 border-none bg-[#009B4D] text-white relative overflow-hidden group shadow-premium hover:-translate-y-2 transition-all duration-500 rounded-[3rem]">
                  <div className="relative z-10 space-y-6">
                     <div className="p-4 bg-white/20 rounded-2xl w-fit backdrop-blur-md border border-white/20">
                        <Package size={28} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-2">Total Assets Listed</p>
                        <h3 className="text-6xl font-extrabold tracking-tighter italic">{products.length}</h3>
                     </div>
                  </div>
                  <BarChart3 className="absolute -bottom-10 -right-10 h-64 w-64 text-white/5 group-hover:scale-110 transition-transform duration-700" />
               </Card>

               <Card className="p-10 border-none bg-slate-950 text-white relative overflow-hidden group shadow-premium hover:-translate-y-2 transition-all duration-500 rounded-[3rem]">
                  <div className="relative z-10 space-y-6">
                     <div className="p-4 bg-[#FFCC00]/20 rounded-2xl w-fit border border-[#FFCC00]/20">
                        <ShoppingCart size={28} className="text-[#FFCC00]" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Exchange Volume</p>
                        <h3 className="text-6xl font-extrabold tracking-tighter italic">{totalStats.orders}</h3>
                     </div>
                  </div>
                  <TrendingUp className="absolute -bottom-10 -right-10 h-64 w-64 text-white/5 group-hover:scale-110 transition-transform duration-700" />
               </Card>

               <Card className="p-10 border-none bg-[#FFCC00] text-slate-900 relative overflow-hidden group shadow-premium hover:-translate-y-2 transition-all duration-500 rounded-[3rem]">
                  <div className="relative z-10 space-y-6">
                     <div className="p-4 bg-white/40 rounded-2xl w-fit backdrop-blur-md border border-white/40">
                        <Wallet size={28} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900/60 mb-2">Net Valuation</p>
                        <h3 className="text-6xl font-extrabold tracking-tighter italic">₹{(totalStats.earnings / 1000).toFixed(1)}K</h3>
                     </div>
                  </div>
                  <IndianRupee className="absolute -bottom-10 -right-10 h-64 w-64 text-slate-900/5 group-hover:translate-x-8 transition-transform duration-700" />
               </Card>
            </div>

            {/* 📋 Registry Feed */}
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                  <div className="h-px bg-slate-200 flex-1" />
                  <h3 className="text-xl font-extrabold text-slate-900 uppercase tracking-tighter italic group flex items-center gap-3">
                      Asset Registry <ChevronRight size={20} className="text-[#009B4D]" />
                  </h3>
                  <div className="h-px bg-slate-200 flex-1" />
              </div>

              {products.length === 0 ? (
                <div className="h-[400px] flex flex-col items-center justify-center p-12 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-premium">
                  <AlertCircle size={64} className="text-slate-100 mb-8" />
                  <div className="space-y-4 mb-8">
                    <p className="text-3xl font-extrabold text-slate-900 tracking-tighter uppercase italic leading-none">zero listings detected</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Initialize your first agrarian node to begin tracking volume</p>
                  </div>
                  <Link to="/marketplace/add">
                    <Button className="bg-slate-900 text-white font-black h-14 rounded-2xl px-10 gap-3 group shadow-xl">
                       New Registration <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {products.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group"
                    >
                      <Card className="card-premium h-full relative overflow-hidden flex flex-col bg-white">
                        <div className="h-64 w-full bg-slate-50 overflow-hidden relative">
                           {p.image_url ? (
                              <img src={p.image_url} alt={p.product_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center border-b border-gray-50">
                                 <Package size={60} className="text-slate-100" />
                              </div>
                           )}
                           <div className="absolute top-6 left-6 glass-dark px-4 py-2 rounded-xl text-[9px] font-black text-[#009B4D] uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md border border-white/10">
                              Logged: {new Date(p.created_at).toLocaleDateString()}
                           </div>
                        </div>

                        <div className="p-10 space-y-10 flex-1 flex flex-col justify-between">
                           <div className="space-y-4">
                              <h4 className="text-3xl font-extrabold text-slate-900 tracking-tighter italic uppercase truncate leading-none mb-1 group-hover:text-[#009B4D] transition-colors">{p.product_name}</h4>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                 <MapPin size={12} className="text-[#009B4D]" /> {p.location || "Global Node"}
                              </p>
                           </div>

                           <div className="grid grid-cols-2 gap-6 pt-10 border-t border-slate-50">
                              <div className="space-y-1">
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Mass/Price</p>
                                 <p className="text-lg font-extrabold text-slate-900 tracking-tighter leading-none">₹{p.price_per_kg}</p>
                                 <p className="text-[10px] font-black text-[#009B4D] uppercase tracking-widest leading-none mt-2">{p.quantity} KG</p>
                              </div>
                              <div className="text-right space-y-1 border-l border-slate-100 pl-6">
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Intelligence</p>
                                 <p className="text-lg font-extrabold text-slate-900 tracking-tighter leading-none">{p.orders_count} ORD</p>
                                 <p className="text-[10px] font-black text-[#FFCC00] uppercase tracking-widest leading-none mt-2">Earned ₹{p.earnings}</p>
                              </div>
                           </div>
                           
                           <div className="flex gap-4">
                             <button 
                               onClick={() => navigate(`/marketplace`)} 
                               className="flex-1 h-14 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-500 hover:bg-slate-800 shadow-xl"
                             >
                                Inspect <ArrowRight size={14} />
                             </button>
                             <button 
                               onClick={() => handleDelete(p.id)} 
                               className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all duration-300 border border-red-100"
                               title="Remove Asset"
                             >
                                <Trash2 size={20} />
                             </button>
                           </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyProducts;
