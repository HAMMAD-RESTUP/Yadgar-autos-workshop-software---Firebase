import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginAdmin } from "../firebase/firebaseMethods";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim()) return toast.error("⚠️ Email required!");
    if (!password.trim()) return toast.error("⚠️ Password required!");

    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        toast.success("✅ Login successful!");
        setTimeout(() => navigate("/home"), 700);
      } else {
        toast.error(res.message || "❌ Invalid credentials!");
      }
    } catch {
      toast.error("⚠️ Something went wrong!");
    }
  };

  return (
    <div className="
      min-h-screen flex flex-col items-center justify-center px-4
      bg-gradient-to-br from-[#eef2f7] via-[#e7ecf3] to-[#dfe6ef]
      relative overflow-hidden
    ">

      <Toaster position="top-center" />

      {/* Floating Lights */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-300/30 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-cyan-300/30 blur-[150px] rounded-full"></div>
      </div>

      {/* Branding */}
      <div className="text-center mb-10 z-10">
        <h1
          className="
            text-5xl font-extrabold tracking-tight
            bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500
            bg-clip-text text-transparent
            drop-shadow-[0_5px_25px_rgba(0,150,255,0.35)]
          "
        >
          Yadgar Autos
        </h1>
        <p className="text-gray-600 mt-2 text-sm font-medium tracking-wide">
          Workshop Management Login
        </p>
      </div>

      {/* Ultra Modern Form */}
      <form
        onSubmit={handleLogin}
        className="
          w-full max-w-md p-10 rounded-3xl
          bg-white/50 backdrop-blur-2xl
          shadow-[0_20px_60px_rgba(0,0,0,0.10)]
          border border-white/40
          transition-all duration-300 hover:shadow-[0_25px_70px_rgba(0,0,0,0.15)]
          space-y-7 z-10
        "
      >
        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Email address"
            className="
              w-full pl-12 pr-4 py-3.5 rounded-xl
              bg-white/80 border border-gray-200
              shadow-sm
              placeholder-gray-400 text-gray-700
              focus:ring-2 focus:ring-blue-400 focus:border-blue-500
              outline-none transition-all
            "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />

          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            className="
              w-full pl-12 pr-12 py-3.5 rounded-xl
              bg-white/80 border border-gray-200
              shadow-sm
              placeholder-gray-400 text-gray-700
              focus:ring-2 focus:ring-blue-400 focus:border-blue-500
              outline-none transition-all
            "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-700 transition"
          >
            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="
            w-full py-3.5 rounded-xl flex items-center justify-center gap-2
            text-lg font-semibold text-white
            bg-gradient-to-r from-blue-600 to-indigo-600
            hover:from-blue-700 hover:to-indigo-700 
            shadow-lg hover:shadow-[0_12px_35px_rgba(40,110,255,0.45)]
            transition-all duration-300
          "
        >
          <LogIn size={20} />
          Login
        </button>
      </form>

      {/* Footer */}
      <p className="text-sm text-gray-600 mt-6 z-10">
        🚀 Powered by <span className="text-blue-600 font-semibold">Devlyst</span>
      </p>
    </div>
  );
};

export default Login;
