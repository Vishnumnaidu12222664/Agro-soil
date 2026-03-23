import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Sprout, 
  Map, 
  TrendingUp, 
  User, 
  LogOut,
  ChevronRight,
  Droplets
} from "lucide-react";
import { twMerge } from "tailwind-merge";

import Button from "../ui/Button";

const Sidebar = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/" },
    { title: "Soil Analysis", icon: Droplets, path: "/soil" },
    { title: "Crop Recommend", icon: Sprout, path: "/recommend" },
    { title: "Market Prices", icon: TrendingUp, path: "/prices" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-gray-950 text-white flex flex-col border-r border-gray-900 z-50">
      {/* App Logo */}
      <div className="p-8 pb-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-emerald-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-emerald-600/20">
            <Sprout className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            AgroAI
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        <div className="px-4 mb-4 text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">
          Main Menu
        </div>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={twMerge(
                "flex items-center justify-between px-4 py-3.5 rounded-xl text-gray-400 font-bold transition-all duration-200 group",
                isActive && "bg-emerald-600/10 text-emerald-400 border border-emerald-500/10",
                !isActive && "hover:bg-gray-900 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={twMerge("h-5 w-5 transition-colors duration-200", isActive ? "text-emerald-400" : "text-gray-500 group-hover:text-emerald-400")} />
                {item.title}
              </div>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-6 border-t border-gray-900 space-y-4">
        {user ? (
          <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-emerald-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-600/10">
                {user.name[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate text-gray-100">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
              className="w-full gap-2 border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        ) : (
          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all duration-200 shadow-lg shadow-emerald-600/20"
          >
            <User className="h-5 w-5" />
            Farmer Login
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
