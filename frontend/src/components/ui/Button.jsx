import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-black transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:!bg-gray-200 disabled:!text-gray-400 disabled:shadow-none disabled:active:scale-100 uppercase tracking-widest";
  
  const variants = {
    primary: "!bg-emerald-600 !text-white hover:!bg-emerald-700 shadow-xl shadow-emerald-500/20 border-none",
    secondary: "!bg-slate-900 !text-white hover:!bg-slate-800 shadow-md",
    outline: "!bg-white border-4 border-slate-900 !text-slate-900 hover:!bg-slate-50 shadow-md",
    ghost: "!bg-transparent !text-slate-600 hover:!bg-slate-100",
    danger: "!bg-white border-2 border-red-500 !text-red-600 hover:!bg-red-50 shadow-lg shadow-red-500/10",
  };

  const sizes = {
    sm: "px-5 py-2.5 text-xs",
    md: "px-8 py-4 text-base",
    lg: "px-10 py-5 text-xl w-full",
  };

  return (
    <button
      className={twMerge(baseStyles, variants[variant], sizes[size], className)}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-current" />}
      {children}
    </button>
  );
};

export default Button;


