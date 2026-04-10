import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Sprout, 
  Droplets, 
  ShoppingBag, 
  Bug,
  LayoutDashboard,
  LogOut,
  User,
  Settings,
  HelpCircle
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import Button from "../ui/Button";

const Sidebar = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const menuItems = [
    { title: "Terminal", subtitle: "Mission Control", icon: LayoutDashboard, path: "/dashboard" },
    { title: "Soil Analysis", subtitle: "Neural Diagnostics", icon: Droplets, path: "/soil" },
    { title: "Crop Oracle", subtitle: "Strategic Planning", icon: Sprout, path: "/recommend" },
    { title: "Markets", subtitle: "Economic Indices", icon: BarChart3, path: "/prices" },
    { title: "Biopath", subtitle: "Pathogen Mapping", icon: Bug, path: "/crop-disease" },
    { title: "Marketplace", subtitle: "Agrarian Exchange", icon: ShoppingBag, path: "/marketplace" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-80 glass-dark text-white flex flex-col z-50 overflow-hidden shadow-2xl">
      {/* 🌿 Identity Section */}
      <div className="p-12 pb-10 border-b border-white/5">
        <Link to="/" className="flex flex-col gap-3 group">
           <div className="flex items-center gap-4">
                <div className="bg-[#009B4D] w-14 h-14 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 shadow-[0_0_40px_rgba(0,155,77,0.3)]">
                    <Sprout className="text-white h-8 w-8" />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-extrabold tracking-tight leading-none">Agro<span className="text-[#FFCC00]">AI</span></span>
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.3em] mt-1 ml-0.5">Precision Hub</span>
                </div>
           </div>
        </Link>
      </div>

      {/* 🧭 Navigation Section */}
      <nav className="flex-1 px-8 py-10 space-y-3 overflow-y-auto custom-scroll">
        <p className="px-6 mb-8 text-[11px] font-extrabold text-white/30 uppercase tracking-[0.3em]">Operational Matrix</p>
        
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={twMerge(
                "group flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-300",
                isActive 
                  ? "bg-white/10 text-[#FFCC00] shadow-lg border border-white/10" 
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <div className={twMerge(
                "p-3 rounded-xl transition-all duration-300",
                isActive ? "bg-[#009B4D] text-white shadow-glow" : "bg-white/5 group-hover:bg-white/10"
              )}>
                <item.icon size={20} />
              </div>
              <div className="flex flex-col">
                <span className={twMerge("text-[13px] font-bold tracking-tight", isActive ? "text-white" : "group-hover:text-white")}>{item.title}</span>
                <span className="text-[10px] font-medium text-white/30 group-hover:text-white/50 transition-colors tracking-wide leading-none mt-1">{item.subtitle}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ⚙️ Footer Section */}
      <div className="p-10 bg-black/20 space-y-8">
        <div className="flex justify-between px-4">
            <button className="text-white/40 hover:text-[#FFCC00] transition-colors"><Settings size={20} /></button>
            <button className="text-white/40 hover:text-[#FFCC00] transition-colors"><HelpCircle size={20} /></button>
            <button onClick={handleLogout} className="text-white/40 hover:text-rose-500 transition-colors"><LogOut size={20} /></button>
        </div>

        {user && (
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 group hover:bg-white/10 transition-all duration-300 cursor-pointer">
                <div className="w-10 h-10 rounded-full border-2 border-[#FFCC00]/20 group-hover:border-[#FFCC00] transition-all p-0.5">
                    <div className="w-full h-full rounded-full bg-[#009B4D] flex items-center justify-center font-bold text-xs">
                        {user.name[0]}
                    </div>
                </div>
                <div className="overflow-hidden">
                    <p className="text-[12px] font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] font-medium text-white/30 truncate">{user.email}</p>
                </div>
            </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
