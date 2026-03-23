import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />

      {/* Sidebar (Fixed width) */}
      <Sidebar />

      {/* Main Content (Responsive width) */}
      <div className="flex-1 flex flex-col ml-72">
        {/* Navigation Bar */}
        <Navbar />

        {/* Scalable Content Area */}
        <main className="p-10 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="px-10 py-6 border-t border-gray-100 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white">
          <p>© 2026 AgroAI Platform - Precision Agriculture Redefined</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-emerald-600 transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors duration-200">Terms of Service</a>
            <a href="#" className="hover:text-emerald-600 transition-colors duration-200">Help Documentation</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
