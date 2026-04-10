import { Bell, Search, Globe, ChevronDown, User, Activity, LogOut, Settings, CreditCard } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navLinks = [
    { name: "Operations", path: "/dashboard" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Pesticides", path: "/brands/pesticides" },
    { name: "Fertilizers", path: "/brands/fertilizers" },
    { name: "Equipment", path: "/brands/equipment" }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    
    // Simulate cloud sync error
    toast.error("Cloud synchronization failed", {
      description: "Unable to sync profile data with the central server.",
      duration: 4000,
    });

    // Still navigate to profile after a short delay to simulate effort
    setTimeout(() => {
      navigate("/profile");
    }, 500);
  };

  return (
    <header className="sticky top-0 right-0 left-0 glass-effect border-b border-gray-100 px-12 py-7 z-40 flex items-center justify-between">
      {/* 🌍 Infrastructure Context */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 px-5 py-2.5 bg-white text-[#009B4D] rounded-xl text-[11px] font-extrabold uppercase tracking-widest border border-gray-100 shadow-sm transition-all hover:border-[#009B4D]/20 group">
          <Activity size={14} className="animate-pulse text-[#009B4D]" />
          Infrastructure <span className="text-slate-400 group-hover:text-[#009B4D] font-normal lowercase ml-1">v.2.4.1</span>
        </div>
        
        <div className="hidden lg:flex gap-10 text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] leading-none">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={twMerge(
                  "relative pb-1 cursor-pointer transition-all duration-300 hover:text-[#009B4D]",
                  isActive ? "text-slate-900" : "text-slate-400"
                )}
              >
                {link.name}
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-[#009B4D] rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 👤 Operator Access Profile & Dropdown */}
      <div className="flex items-center gap-12">
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div className="flex flex-col items-end text-right">
              <p className="text-[13px] font-extrabold text-slate-900 tracking-tight leading-none mb-1.5 group-hover:text-[#009B4D] transition-colors">
                {user ? user.name : "Guest Session"}
              </p>
              <div className="flex items-center gap-2">
                <p className={twMerge(
                    "text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border",
                    user?.is_verified ? "text-[#FFD700] border-[#FFD700]/30 bg-[#FFD700]/5" : "text-[#009B4D] border-[#009B4D]/20 bg-[#009B4D]/5"
                )}>
                  {user?.is_verified ? "Verified Farmer" : "Authorized Personnel"}
                </p>
                <ChevronDown size={12} className={twMerge("text-slate-400 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-xl group-hover:border-[#009B4D] transition-all p-0.5">
                {(user?.profile_image || user?.image_url) ? (
                  <img src={user.profile_image || user.image_url} alt="Profile" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full bg-[#009B4D] rounded-full flex items-center justify-center text-white font-bold italic">
                    {user?.name?.[0] || <User size={18} />}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Premium Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 py-2"
              >
                <div className="px-5 py-3 border-b border-gray-50 bg-slate-50/50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                  <p className="text-[13px] font-bold text-slate-900 truncate">{user?.email || "guest@agroai.com"}</p>
                </div>

                <div className="p-2">
                  <button 
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#009B4D]/5 text-slate-600 hover:text-[#009B4D] transition-colors group text-left"
                  >
                    <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-[#009B4D]/10 text-slate-500 group-hover:text-[#009B4D] transition-colors">
                      <User size={16} />
                    </div>
                    <span className="text-[12px] font-bold">My Profile</span>
                  </button>

                  <Link 
                    to="/marketplace/my" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#009B4D]/5 text-slate-600 hover:text-[#009B4D] transition-colors group"
                  >
                    <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-[#009B4D]/10 text-slate-500 group-hover:text-[#009B4D] transition-colors">
                      <CreditCard size={16} />
                    </div>
                    <span className="text-[12px] font-bold">My Marketplace</span>
                  </Link>

                  <div className="h-px bg-gray-50 my-1 mx-2" />

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors group"
                  >
                    <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-red-100 text-slate-500 group-hover:text-red-600 transition-colors">
                      <LogOut size={16} />
                    </div>
                    <span className="text-[12px] font-bold">Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        <div className="relative group cursor-pointer p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
            <Bell size={20} className="text-slate-400 group-hover:text-[#009B4D]" />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FFCC00] rounded-full border-2 border-[#FAF5E9] shadow-accent-glow" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
