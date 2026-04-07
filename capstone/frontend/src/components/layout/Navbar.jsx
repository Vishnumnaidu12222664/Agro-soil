import { Bell, Search, Globe, ChevronDown, User, Activity } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  const navLinks = [
    { name: "Operations", path: "/" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Profile", path: "/profile" },
    { name: "Pesticides", path: "/brands/pesticides" },
    { name: "Fertilizers", path: "/brands/fertilizers" },
    { name: "Equipment", path: "/brands/equipment" }
  ];

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

      {/* 👤 Operator Access Profile */}
      <div className="flex items-center gap-12">
        <Link to="/profile" className="flex items-center gap-4 group cursor-pointer">
          <div className="flex flex-col items-end text-right">
            <p className="text-[13px] font-extrabold text-slate-900 tracking-tight leading-none mb-1.5 group-hover:text-[#009B4D] transition-colors">
              {user ? user.name : "Guest Session"}
            </p>
            <p className={twMerge(
                "text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full border",
                user?.is_verified ? "text-[#FFD700] border-[#FFD700]/30 bg-[#FFD700]/5" : "text-[#009B4D] border-[#009B4D]/20 bg-[#009B4D]/5"
            )}>
               {user?.is_verified ? "Verified Farmer" : "Authorized Personnel"}
            </p>
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
        </Link>

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
