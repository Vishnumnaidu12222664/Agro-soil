import { useState, useRef } from "react";
import { 
  Plus, 
  MapPin, 
  IndianRupee, 
  Scale, 
  Image as ImageIcon,
  Loader2,
  Package,
  Store,
  ChevronRight,
  TrendingUp,
  ArrowLeft,
  Upload,
  Zap,
  Coffee,
  Database,
  Truck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { addProduct, seedMyData } from "../api/marketplaceApi";
import { toast } from "sonner";

const AddProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [formData, setFormData] = useState({
    product_name: "",
    price_per_kg: "",
    quantity: "",
    location: "",
    delivery_radius: "10",
    image_url: ""
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, image_url: "" })); // Clear URL if file selected
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
        await seedMyData();
        toast.success("Accounts Synchronized!", {
            description: "3 sample products and revenue history added to your portal."
        });
        navigate("/marketplace/my");
    } catch (err) {
        toast.error("Sync Error: " + err.message);
    } finally {
        setSeeding(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : {};
    
    // Safety check: require numeric inputs
    if (isNaN(parseFloat(formData.price_per_kg)) || isNaN(parseFloat(formData.quantity))) {
         setLoading(false);
         return toast.error("Price and Quantity must be valid numeric values");
    }

    const data = new FormData();
    data.append("product_name", formData.product_name);
    data.append("price_per_kg", formData.price_per_kg);
    data.append("quantity", formData.quantity);
    data.append("location", formData.location);
    data.append("delivery_radius", formData.delivery_radius);
    
    if (user.name) {
        data.append("farmer_name", user.name);
    }
    
    if (selectedFile) {
        data.append("image", selectedFile);
    } else {
        data.append("image_url", formData.image_url);
    }

    try {
      await addProduct(data);
      toast.success("Harvest Registered!", {
        description: "Your product is now listed on the global marketplace.",
      });
      navigate("/marketplace/my");
    } catch (err) {
      toast.error(err.message || "Failed to register harvest");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-12 pb-20 font-sans"
    >
      {/* 🏙️ Branding Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-gray-100 pb-12 mx-6">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#009B4D]/10 text-[#009B4D] px-5 py-2 rounded-full font-black uppercase tracking-[0.2em] text-[10px] border border-[#009B4D]/20">
             <Zap size={14} className="animate-pulse" />
             Strategic Inventory Entry
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tighter leading-none italic uppercase">
            Product <span className="text-[#009B4D]">Registration</span>
          </h1>
          <p className="text-slate-500 font-bold max-w-xl text-lg uppercase tracking-widest text-[11px] leading-relaxed">
            Centralized registry for peer-to-peer agrarian trade and global distribution logistics.
          </p>
        </div>

        <div className="flex flex-wrap gap-5">
            <Button 
                onClick={handleSeed}
                loading={seeding}
                variant="outline" 
                className="h-14 gap-3 font-black border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all rounded-2xl"
            >
                <Database size={18} />
                Sync Meta-Data
            </Button>
            <Link to="/marketplace">
              <Button variant="secondary" className="h-14 gap-3 shadow-xl bg-[#009B4D] text-white hover:bg-[#007d3e] rounded-2xl border-none font-black uppercase tracking-widest text-xs">
                <Store size={18} />
                Return to Exchange
              </Button>
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start px-6">
        {/* 📝 Core Registry Hub */}
        <Card className="lg:col-span-12 xl:col-span-8 p-0 border-none bg-white rounded-[3rem] shadow-premium overflow-hidden">
          <div className="bg-[#003D1E] p-10 flex items-center justify-between text-white">
            <div className="flex items-center gap-6">
              <div className="bg-[#009B4D] p-4 rounded-2xl shadow-glow">
                <Package className="text-white h-7 w-7" />
              </div>
              <div>
                <h3 className="font-extrabold text-2xl tracking-tight uppercase italic">Harvest Dossier</h3>
                <p className="text-[#009B4D] text-[10px] font-black tracking-[0.3em] uppercase mt-1">Registry Serial No. {Math.floor(Math.random()*10000)}</p>
              </div>
            </div>
            <div className="h-14 w-14 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <Coffee className="text-white/20 h-6 w-6" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-12 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Image Matrix Section */}
              <div className="md:col-span-2 space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">Visual Hash (Upload Photo)</label>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative cursor-pointer border-4 border-dashed border-slate-100 bg-[#FAF5E9]/30 hover:bg-[#FAF5E9]/50 hover:border-[#009B4D]/20 rounded-[2.5rem] p-12 transition-all duration-500 overflow-hidden min-h-[300px] flex flex-col items-center justify-center text-center"
                >
                  {previewUrl ? (
                    <div className="space-y-6">
                      <div className="relative">
                        <img src={previewUrl} alt="Preview" className="max-h-56 w-auto rounded-[2rem] shadow-2xl border-4 border-white mx-auto transform group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-[#009B4D]/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] flex items-center justify-center">
                            <Upload className="text-white h-10 w-10 animate-bounce" />
                        </div>
                      </div>
                      <p className="text-[#009B4D] font-black text-[10px] uppercase tracking-[0.4em] bg-white px-4 py-2 rounded-full shadow-sm">Replace Media Source</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="w-24 h-24 bg-white rounded-[2rem] mx-auto flex items-center justify-center shadow-premium group-hover:bg-[#009B4D] group-hover:text-white transition-all duration-700 transform group-hover:rotate-12">
                        <Upload size={32} className="text-slate-300 group-hover:text-white" />
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-slate-800 font-extrabold text-2xl tracking-tighter uppercase italic">Proprietary Scan</h4>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Upload high-fidelity crop imagery for neural matching</p>
                      </div>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>
              </div>

              <div className="group md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 block">Product Taxonomy (Common Name)</label>
                <div className="relative">
                  <Package className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#009B4D] transition-colors" />
                  <input
                    type="text"
                    name="product_name"
                    required
                    placeholder="e.g. ORGANIC ALPHONSO MANGOES"
                    className="w-full pl-16 h-16 bg-white border-2 border-gray-100 rounded-2xl font-extrabold text-slate-800 text-lg focus:border-[#009B4D] focus:outline-none focus:ring-8 focus:ring-[#009B4D]/5 transition-all text-transform uppercase"
                    value={formData.product_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 block">Valuation (Price/KG in ₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#009B4D] transition-colors" />
                  <input
                    type="number"
                    name="price_per_kg"
                    required
                    placeholder="00.00"
                    className="w-full pl-16 h-16 bg-white border-2 border-gray-100 rounded-2xl font-extrabold text-slate-800 text-lg focus:border-[#009B4D] focus:outline-none focus:ring-8 focus:ring-[#009B4D]/5 transition-all"
                    value={formData.price_per_kg}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 block">Mass Coefficient (Quantity in KG)</label>
                <div className="relative">
                  <Scale className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#009B4D] transition-colors" />
                  <input
                    type="number"
                    name="quantity"
                    required
                    placeholder="00.0"
                    className="w-full pl-16 h-16 bg-white border-2 border-gray-100 rounded-2xl font-extrabold text-slate-800 text-lg focus:border-[#009B4D] focus:outline-none focus:ring-8 focus:ring-[#009B4D]/5 transition-all"
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="group md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 block">Logistic Coordinates (Location Hub)</label>
                <div className="relative">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#009B4D] transition-colors" />
                  <input
                    type="text"
                    name="location"
                    required
                    placeholder="e.g. NASHIK LOGISTIC HUB"
                    className="w-full pl-16 h-16 bg-white border-2 border-gray-100 rounded-2xl font-extrabold text-slate-800 text-lg focus:border-[#009B4D] focus:outline-none focus:ring-8 focus:ring-[#009B4D]/5 transition-all uppercase"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="group md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 block">Service Parameters (Delivery Radius in KM)</label>
                <div className="relative">
                  <Truck className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#009B4D] transition-colors" />
                  <input
                    type="number"
                    name="delivery_radius"
                    required
                    placeholder="e.g. 100"
                    className="w-full pl-16 h-16 bg-white border-2 border-gray-100 rounded-2xl font-extrabold text-slate-800 text-lg focus:border-[#009B4D] focus:outline-none focus:ring-8 focus:ring-[#009B4D]/5 transition-all"
                    value={formData.delivery_radius}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-slate-50">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-20 text-xl font-black rounded-3xl shadow-2xl bg-slate-950 text-white hover:bg-[#009B4D] transition-all duration-500 flex items-center justify-center gap-4 group uppercase tracking-[0.2em] relative overflow-hidden"
              >
                {loading ? <Loader2 className="animate-spin h-8 w-8" /> : (
                    <>
                        <Zap size={20} className="text-[#FFCC00] group-hover:scale-125 transition-transform" />
                        Execute Deployment
                        <ChevronRight className="h-6 w-6 group-hover:translate-x-3 transition-transform" />
                    </>
                )}
              </button>
            </div>
          </form>
        </Card>

        {/* 📊 Intelligence Hub */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-10">
            <Card className="p-10 bg-[#009B4D] text-white border-none rounded-[3rem] shadow-premium relative overflow-hidden group">
                <div className="relative z-10 space-y-8">
                    <TrendingUp size={60} className="text-white/20" />
                    <div className="space-y-4">
                        <h4 className="text-3xl font-extrabold tracking-tighter uppercase italic leading-none">Market Velocity</h4>
                        <p className="text-white/80 font-medium text-sm leading-relaxed">
                            Certified organic produce currently benchmarks at <span className="text-[#FFCC00] font-black italic">+22.4%</span> above standard market indices.
                        </p>
                    </div>
                </div>
                <Zap size={220} className="absolute bottom-[-10%] right-[-10%] text-white/5 group-hover:scale-110 transition-transform duration-1000" />
            </Card>

            <div className="bg-[#003D1E] p-10 rounded-[3rem] border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                    <h4 className="font-extrabold text-white uppercase italic tracking-tight text-xl">Global Data Sync</h4>
                    <p className="text-white/40 font-bold text-xs uppercase tracking-[0.2em] leading-relaxed">
                        Authorize automated synchronization to list high-fidelity sample datasets across active exchange nodes.
                    </p>
                    <button 
                        onClick={handleSeed}
                        disabled={seeding}
                        className="w-full p-4 bg-white/5 hover:bg-[#FFCC00]/20 rounded-2xl border border-white/10 text-[#FFCC00] text-[10px] font-black uppercase tracking-[0.4em] transition-all"
                    >
                        {seeding ? "Syncing..." : "Initialize Data Stream"}
                    </button>
                </div>
                <Database size={150} className="absolute bottom-[-5%] left-[-5%] text-white/5" />
            </div>

            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-6 bg-[#009B4D] rounded-full" />
                    <h5 className="font-extrabold text-slate-900 uppercase tracking-tight text-sm italic">Operator Guidelines</h5>
                </div>
                <ul className="space-y-5">
                    {[
                        "Ensure 4K visual fidelity for neural matching",
                        "Verify unit valuations against local indices",
                        "Define precise delivery vector radius",
                        "Synchronize coordinates via GPS hub"
                    ].map((step, i) => (
                        <li key={i} className="flex gap-4 items-start group">
                            <span className="h-6 w-6 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100 group-hover:bg-[#009B4D] group-hover:text-white transition-colors">{i+1}</span>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed pt-1 group-hover:text-slate-900 transition-colors">{step}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddProduct;
