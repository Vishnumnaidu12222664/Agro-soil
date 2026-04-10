import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const Input = ({ label, error, className, ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-sm font-bold text-gray-800 ml-1">
          {label}
        </label>
      )}
      <input
        className={twMerge(
          "flex h-11 w-full rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-2 text-sm text-gray-900 font-semibold transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400",
          error && "border-rose-500 focus:ring-rose-200 focus:border-rose-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs font-medium text-rose-500 ml-1">{error}</p>}
    </div>
  );
};

export default Input;
