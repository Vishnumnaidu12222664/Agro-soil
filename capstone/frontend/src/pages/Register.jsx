import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Sprout, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { toast, Toaster } from "sonner";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration successful! Redirecting...");
        setTimeout(() => navigate('/login'), 1500);
      } else {
        toast.error(data.msg || "Registration failed");
      }
    } catch (err) {
      toast.error("Cloud server is currently unreachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 bg-slate-50 overflow-hidden font-sans">
      <Toaster position="top-right" richColors />
      
      {/* Background Shapes */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-emerald-500 rounded-2xl shadow-xl shadow-emerald-500/20 mb-6">
            <Sprout className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-3">
            Join the <span className="text-emerald-500 underline decoration-4 decoration-emerald-200 underline-offset-8">Community</span>
          </h1>
          <p className="text-slate-500 font-semibold mt-3">Start your journey towards high-yield precision farming.</p>
        </div>

        <Card className="p-10 shadow-2xl shadow-slate-200/50 border-slate-100">
          <form className="space-y-6" onSubmit={handleRegister}>
            <div className="group">
              <div className="flex items-center gap-2 mb-2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                 <User className="h-4 w-4" />
                 <span className="text-xs font-black uppercase tracking-widest leading-none">Full Name</span>
              </div>
              <Input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 font-bold text-lg"
              />
            </div>

            <div className="group">
              <div className="flex items-center gap-2 mb-2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                 <Mail className="h-4 w-4" />
                 <span className="text-xs font-black uppercase tracking-widest leading-none">Email Address</span>
              </div>
              <Input
                type="email"
                required
                placeholder="farmer@agroai.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 font-bold text-lg"
              />
            </div>
            
            <div className="group">
              <div className="flex items-center gap-2 mb-2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                 <Lock className="h-4 w-4" />
                 <span className="text-xs font-black uppercase tracking-widest leading-none">Password</span>
              </div>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 font-bold text-lg"
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full h-16 text-xl font-black tracking-widest gap-3"
            >
              Initialize Account
              <CheckCircle2 className="h-5 w-5" />
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm font-semibold text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-black decoration-2 hover:underline">
                Sign In Instead
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
