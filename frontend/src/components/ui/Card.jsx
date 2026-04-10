import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={twMerge(
        "bg-white border border-gray-100 rounded-2xl shadow-md p-6 transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
