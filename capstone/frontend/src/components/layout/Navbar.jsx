import { Bell, Search, Settings, HelpCircle, User } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="sticky top-0 right-0 left-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 py-5 z-40 flex items-center justify-between shadow-sm shadow-slate-100">
      {/* Search Bar */}
      <div className="relative group flex items-center max-w-lg w-full">
        <div className="absolute left-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
          <Search className="h-4 w-4" />
        </div>
        <input 
          type="text" 
          placeholder="Search analysis, trends, or market prices..." 
          className="w-full pl-12 pr-4 py-2.5 bg-slate-100/50 border-2 border-slate-100 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-500"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
        </Button>
        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl">
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        {/* Profile Dropdown Trigger */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="flex flex-col items-end overflow-hidden max-w-[120px]">
            <p className="text-sm font-bold truncate text-slate-900">{user ? user.name : "Guest"}</p>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-tighter">Premium Plan</p>
          </div>
          <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
