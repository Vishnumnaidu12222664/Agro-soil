// import { useState } from "react";
// import { motion } from "framer-motion";

// export default function FarmerLogin() {
//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     otp: "",
//     land: "",
//     place: "",
//   });

//   const [otpSent, setOtpSent] = useState(false);
//   const [verified, setVerified] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (field, value) => {
//     setForm({ ...form, [field]: value });
//   };

//   const sendOTP = () => {
//     if (!form.phone || form.phone.length !== 10) {
//       return setError("Enter a valid 10-digit phone number");
//     }

//     setOtpSent(true);
//     setError("");
//     console.log("📩 OTP sent to:", form.phone);
//   };

//   const verifyOTP = () => {
//     if (!form.otp.trim()) return setError("Enter OTP");

//     // TEMP (replace with backend API later)
//     if (form.otp === "1234") {
//       setVerified(true);
//       setError("");
//     } else {
//       setError("❌ Invalid OTP");
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!verified) return setError("Verify OTP before continuing");

//     console.log("🌾 Farmer logged in:", form);
//     alert("Login Successful (replace with navigation)");
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-cover bg-center"
//       style={{ backgroundImage: "url('/bg.jpg')" }}
//     >
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-8 w-[28rem] shadow-2xl"
//       >
//         <h1 className="text-3xl font-extrabold text-center text-green-800 mb-6">
//           👨‍🌾 Farmer Login
//         </h1>

//         {error && (
//           <p className="bg-red-500/80 text-white text-sm p-2 mb-3 rounded-xl">
//             ⚠ {error}
//           </p>
//         )}

//         <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
//           {/* Name */}
//           <input
//             placeholder="Full Name"
//             className="p-3 bg-white/70 rounded-xl outline-none"
//             value={form.name}
//             onChange={(e) => handleChange("name", e.target.value)}
//           />

//           {/* Phone */}
//           <div className="flex gap-2">
//             <input
//               placeholder="Phone Number"
//               className="flex-1 p-3 bg-white/70 rounded-xl outline-none"
//               value={form.phone}
//               onChange={(e) => handleChange("phone", e.target.value)}
//               maxLength="10"
//             />
//             {!otpSent && (
//               <button
//                 type="button"
//                 onClick={sendOTP}
//                 className="bg-green-600 text-white px-4 rounded-xl"
//               >
//                 Send OTP
//               </button>
//             )}
//           </div>

//           {/* OTP */}
//           {otpSent && !verified && (
//             <div className="flex gap-2">
//               <input
//                 placeholder="Enter OTP"
//                 className="flex-1 p-3 bg-white/70 rounded-xl outline-none"
//                 value={form.otp}
//                 onChange={(e) => handleChange("otp", e.target.value)}
//               />
//               <button
//                 type="button"
//                 onClick={verifyOTP}
//                 className="bg-blue-600 text-white px-4 rounded-xl"
//               >
//                 Verify
//               </button>
//             </div>
//           )}

//           {/* OTP VERIFIED */}
//           {verified && (
//             <p className="text-green-900 font-semibold">✔ OTP Verified</p>
//           )}

//           {/* Land */}
//           <input
//             placeholder="Land Area (in acres)"
//             className="p-3 bg-white/70 rounded-xl outline-none"
//             value={form.land}
//             onChange={(e) => handleChange("land", e.target.value)}
//           />

//           {/* Place */}
//           <input
//             placeholder="Village / City / District"
//             className="p-3 bg-white/70 rounded-xl outline-none"
//             value={form.place}
//             onChange={(e) => handleChange("place", e.target.value)}
//           />

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={!verified}
//             className="mt-4 bg-green-700 text-white py-3 rounded-xl hover:scale-[1.03] transition-all disabled:opacity-50"
//           >
//             Login / Continue
//           </button>
//         </form>
//       </motion.div>
//     </div>
//   );
// }
