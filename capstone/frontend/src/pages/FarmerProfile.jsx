import { useState, useEffect } from "react";
import { 
  User, 
  MapPin, 
  FileCheck, 
  ShieldCheck, 
  CreditCard,
  CheckCircle,
  Clock,
  PhoneCall,
  Sprout,
  Droplets,
  HardHat,
  Camera,
  Map as MapIcon,
  Zap,
  Star,
  Activity,
  ArrowRight,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { getProfile, updateProfile, verifyFarmer } from "../api/authApi";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";

const FarmerProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentStep, setPaymentStep] = useState(1);
    
    // Preview states
    const [profilePreview, setProfilePreview] = useState(null);
    const [landPreview, setLandPreview] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const data = await getProfile();
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
        } catch (err) {
            console.error(err);
            if (err.message.includes("User not found")) {
                toast.error("Your session has expired or your account was reset. Please login again.");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
            } else {
                toast.error("Cloud synchronization failed");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e, setPreview) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        const formData = new FormData(e.target);
        try {
            const data = await updateProfile(formData);
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success("Identity updated successfully!");
            // Reset previews after success
            setProfilePreview(null);
            setLandPreview(null);
        } catch (err) {
            if (err.message.includes("User not found")) {
                toast.error("Account identity lost. Redirecting to secure login...");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
            } else {
                toast.error(err.message || "Failed to update profile");
            }
        } finally {
            setUpdating(false);
        }
    };

    const handleVerify = async () => {
        setLoading(true);
        try {
            const data = await verifyFarmer();
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success("Welcome to the Elite Circle!", {
                description: "You are now a Verified Agrarian Professional.",
                icon: <CheckCircle className="text-[#FFD700]" />
            });
            setShowPayment(false);
            setPaymentStep(1);
        } catch (err) {
            toast.error("Digital verification protocol failed");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !user) {
        return (
            <div className="h-screen flex flex-col items-center justify-center space-y-6">
                <Loader2 className="h-12 w-12 text-[#009B4D] animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Synchronizing Genetic Data...</p>
            </div>
        );
    }

    const benefits = [
        { icon: <Droplets className="text-blue-500" />, title: "Fertilizer Priority", desc: "Precision recommendation engine access." },
        { icon: <HardHat className="text-orange-500" />, title: "Biocide Support", desc: "Advanced pesticide diagnosis & alerts." },
        { icon: <PhoneCall className="text-[#009B4D]" />, title: "24/7 HELPLINE", desc: "Direct uplink to agrarian agronomists." },
        { icon: <Activity className="text-purple-500" />, title: "Order Follow-up", desc: "White-glove logistic chain monitoring." }
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-20 space-y-24 font-sans">
            {/* 👑 Top Bio Header */}
            <div className="flex flex-col lg:flex-row items-center gap-16 border-b border-slate-100 pb-20">
                <div className="relative group">
                    <div className="h-56 w-56 rounded-[3rem] overflow-hidden border-8 border-white shadow-premium relative group-hover:rotate-3 transition-all duration-500">
                        <img 
                            src={profilePreview || user?.profile_image || "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop"} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="text-white" size={32} />
                        </div>
                    </div>
                    {user?.is_verified && (
                        <div className="absolute -bottom-4 -right-4 bg-[#FFD700] text-slate-900 p-4 rounded-3xl shadow-glow rotate-12 border-4 border-white animate-bounce-slow">
                            <ShieldCheck size={28} />
                        </div>
                    )}
                </div>

                <div className="space-y-6 text-center lg:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 uppercase tracking-[0.4em] text-[10px] font-black">
                        <span className="px-5 py-2 bg-slate-900 text-white rounded-full">Operator #{user?.id?.toString().padStart(4, "0")}</span>
                        {user?.is_verified ? (
                            <span className="px-5 py-2 bg-[#FFD700]/20 text-[#B8860B] rounded-full border border-[#FFD700]/30 animate-pulse">VERIFIED_BIO_ASSET</span>
                        ) : (
                            <span className="px-5 py-2 bg-slate-100 text-slate-400 rounded-full border border-slate-200">STANDARD_STATUS</span>
                        )}
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
                        {user?.name}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-slate-400 font-black text-[11px] uppercase tracking-widest">
                        <span className="flex items-center gap-2"><MapPin size={14} className="text-[#009B4D]" /> {user?.location || "No Geo-Coordinates"}</span>
                        <span className="flex items-center gap-2"><Sprout size={14} className="text-blue-500" /> {user?.land_acres || "0"} HECTARES</span>
                        <span className="flex items-center gap-2 uppercase">Joined: {new Date(user?.created_at).getFullYear()}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* 📝 Identity Terminal */}
                <div className="lg:col-span-2 space-y-16">
                   <section className="space-y-8">
                       <h3 className="text-xl font-extrabold text-slate-900 uppercase tracking-tighter italic flex items-center gap-3">
                           <User className="text-[#009B4D]" size={20} /> Identity Core
                       </h3>
                       <Card className="p-10 border-none shadow-premium bg-slate-50/50 rounded-[2.5rem]">
                           <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Legal Name</label>
                                   <Input name="name" defaultValue={user?.name} className="h-14 font-black uppercase tracking-widest text-xs border-none bg-white shadow-sm" required />
                               </div>
                               <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Geographical Sector</label>
                                   <Input name="location" defaultValue={user?.location} className="h-14 font-black uppercase tracking-widest text-xs border-none bg-white shadow-sm" placeholder="e.g. Maharashtra, India" />
                               </div>
                               <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Land Quantum (Acres)</label>
                                   <Input name="land_acres" type="number" step="0.1" defaultValue={user?.land_acres} className="h-14 font-black uppercase tracking-widest text-xs border-none bg-white shadow-sm" placeholder="0.0" />
                               </div>
                               <div className="space-y-2 md:col-span-2">
                                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Biometric Hash (Photo)</label>
                                   <div className="grid grid-cols-2 gap-4">
                                       <div className="space-y-2">
                                           <label className="text-[9px] text-slate-400 font-bold block">Operator Image</label>
                                           <input 
                                                type="file" 
                                                name="profile_image" 
                                                onChange={(e) => handleFileChange(e, setProfilePreview)}
                                                className="text-[10px] text-slate-500 font-black cursor-pointer bg-white p-2 rounded-xl border border-dashed border-slate-200" 
                                            />
                                       </div>
                                       <div className="space-y-2">
                                           <label className="text-[9px] text-slate-400 font-bold block">Land Mapping Image</label>
                                           <input 
                                                type="file" 
                                                name="land_image" 
                                                onChange={(e) => handleFileChange(e, setLandPreview)}
                                                className="text-[10px] text-slate-500 font-black cursor-pointer bg-white p-2 rounded-xl border border-dashed border-slate-200" 
                                            />
                                       </div>
                                   </div>
                               </div>
                               <div className="md:col-span-2 pt-6">
                                   <Button type="submit" disabled={updating} className="h-14 w-full md:w-fit px-12 bg-slate-900 border-none rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">
                                       {updating ? <Loader2 className="animate-spin" /> : "Commit Updates"}
                                   </Button>
                               </div>
                           </form>
                       </Card>
                   </section>

                   {/* 🗺️ Land Analytics Preview */}
                   <section className="space-y-8">
                       <h3 className="text-xl font-extrabold text-slate-900 uppercase tracking-tighter italic flex items-center gap-3">
                           <MapIcon className="text-blue-500" size={20} /> Managed Territory
                       </h3>
                       <div className="h-96 w-full rounded-[3rem] overflow-hidden shadow-premium bg-slate-100 relative group border-4 border-white">
                            {landPreview || user?.land_image ? (
                                <img src={landPreview || user.land_image} alt="Land" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                            ) : (
                                <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
                                    <MapIcon size={48} className="text-slate-300" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No territory mapping uploaded</p>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-10">
                                <span className="text-white font-black text-[10px] uppercase tracking-widest">Geo-Coordinates Segment Alpha-7</span>
                            </div>
                       </div>
                   </section>
                </div>

                {/* 🛡️ Verification Matrix */}
                <div className="space-y-8">
                    <h3 className="text-xl font-extrabold text-slate-900 uppercase tracking-tighter italic flex items-center gap-3">
                        <Zap className="text-[#FFCC00]" size={20} /> Nexus Tier
                    </h3>
                    
                    {user?.is_verified ? (
                        <Card className="p-10 border-none bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-premium relative overflow-hidden rounded-[3rem]">
                             <ShieldCheck size={80} className="absolute -top-10 -right-10 text-white/10" />
                             <div className="relative z-10 space-y-10">
                                <div className="space-y-4">
                                    <div className="h-14 w-14 bg-[#FFCC00] rounded-2xl flex items-center justify-center text-slate-950 shadow-glow">
                                        <Star size={32} />
                                    </div>
                                    <h4 className="text-4xl font-extrabold tracking-tighter italic uppercase underline decoration-[#FFCC00]">PRO OPERATOR</h4>
                                </div>
                                <div className="space-y-6">
                                    {benefits.map((b, i) => (
                                        <div key={i} className="flex gap-4 items-start pb-6 border-b border-white/10 last:border-0 last:pb-0">
                                            <div className="p-2 bg-white/10 rounded-lg">{b.icon}</div>
                                            <div>
                                                <p className="text-[11px] font-black uppercase tracking-widest">{b.title}</p>
                                                <p className="text-[10px] text-white/50">{b.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-6">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center gap-4">
                                        <CheckCircle className="text-[#009B4D]" size={20} />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">Subscription Active: Apr 2026</span>
                                    </div>
                                </div>
                             </div>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            <Card className="p-10 border-none bg-white shadow-premium border border-slate-100 rounded-[3rem] group">
                                <div className="space-y-10">
                                    <div className="space-y-4 text-center">
                                        <div className="mx-auto h-20 w-20 bg-[#009B4D]/10 rounded-full flex items-center justify-center text-[#009B4D] mb-6">
                                            <ShieldCheck size={40} className="group-hover:scale-110 transition-transform" />
                                        </div>
                                        <h4 className="text-3xl font-black tracking-tight uppercase italic leading-none">Upgrade to <span className="text-[#009B4D]">Elite</span></h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic pr-4">Access institutional-grade farming tools and priority logistics.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Service Fee</span>
                                            <span className="text-2xl font-black text-slate-900 italic">₹99/mo</span>
                                        </div>
                                        <Button 
                                            onClick={() => setShowPayment(true)}
                                            className="w-full h-16 bg-[#009B4D] hover:bg-[#007d3e] text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-3xl shadow-glow gap-3"
                                        >
                                            Initiate Verification <ArrowRight size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            <div className="grid grid-cols-2 gap-4">
                                {benefits.slice(0, 2).map((b, i) => (
                                    <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                         <div className="mb-4">{b.icon}</div>
                                         <p className="text-[9px] font-black uppercase tracking-widest text-slate-900">{b.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 💸 Payment Gateway Overlay */}
            <AnimatePresence>
                {showPayment && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl p-12 text-center"
                        >
                            {paymentStep === 1 && (
                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <div className="mx-auto w-16 h-16 bg-[#009B4D]/10 rounded-2xl flex items-center justify-center text-[#009B4D] mb-6">
                                            <CreditCard size={32} />
                                        </div>
                                        <h3 className="text-4xl font-black tracking-tight uppercase italic leading-none">Checkout Nexus</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select your preferred transactional protocol</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {["Unified Payments (UPI)", "Strategic Credit/Debit", "Crypto-Asset Node"].map((m, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => setPaymentStep(2)}
                                                className="h-16 w-full border-2 border-slate-100 hover:border-[#009B4D] rounded-2xl flex items-center justify-between px-8 text-left transition-all group"
                                            >
                                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">{m}</span>
                                                <ArrowRight size={18} className="text-slate-200 group-hover:text-[#009B4D] group-hover:translate-x-2 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => setShowPayment(false)} className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-red-500 transition-colors">Abondon Protocol</button>
                                </div>
                            )}

                            {paymentStep === 2 && (
                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                                            <div className="absolute inset-0 border-8 border-slate-100 rounded-full" />
                                            <div className="absolute inset-0 border-8 border-t-[#009B4D] rounded-full animate-spin" />
                                            <Zap size={32} className="text-[#009B4D] animate-pulse" />
                                        </div>
                                        <h3 className="text-4xl font-black tracking-tight uppercase italic leading-none">Validating Funds</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Consulting bank ledger for ₹99.00 transaction</p>
                                    </div>
                                    
                                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-slate-400">Merchant</span>
                                            <span className="text-slate-900">AGRO_SYSTEMS_INT</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest border-t border-slate-200 pt-4">
                                            <span className="text-slate-400">Amount</span>
                                            <span className="text-[#009B4D] font-black">₹99.00 / Month</span>
                                        </div>
                                    </div>

                                    <Button onClick={handleVerify} className="w-full h-16 bg-[#009B4D] text-white font-black uppercase tracking-widest rounded-3xl shadow-glow">
                                        Complete Payment
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FarmerProfile;
