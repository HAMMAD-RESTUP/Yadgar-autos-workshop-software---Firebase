import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Wrench, FileText } from "lucide-react";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-[#eef2f7] via-[#e7ecf3] to-[#dfe6ef] 
                    overflow-hidden text-gray-900">

      {/* 🔥 Animated Background Circles */}
      <div className="absolute inset-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-200 opacity-25 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-purple-200 opacity-25 blur-3xl rounded-full animate-pulse delay-500"></div>
      </div>

      {/* 🌟 Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative text-center p-10 rounded-3xl shadow-[0_0_35px_rgba(88,28,135,0.1)] 
                   backdrop-blur-2xl bg-white/80 border border-gray-200 max-w-xl mx-auto"
      >
        {/* Header Glow Line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute top-0 left-0 h-1 rounded-t-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
        ></motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-5xl font-extrabold mb-3 
                     bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 
                     bg-clip-text text-transparent"
        >
          🚗 Yadgar Autos
        </motion.h1>

        <p className="text-gray-700 mb-8 text-base md:text-lg">
          Workshop & Insurance Management System
        </p>

        {/* Animated Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1 }}
          className="mx-auto mb-10 w-24 h-[2px] bg-gradient-to-r from-blue-400 to-purple-400"
        ></motion.div>

        {/* Buttons Section */}
        <div className="flex flex-col md:flex-row gap-5 justify-center">
          {/* Mechanical Button */}
          <motion.button
            whileHover={{
              scale: 1.08,
              boxShadow: "0px 0px 25px rgba(34,197,94,0.3)",
            }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/Mechanicalwork")}
            className="px-7 py-3 text-lg font-semibold rounded-xl border border-green-300 
                       bg-gradient-to-r from-green-400 to-emerald-500 text-white
                       hover:from-emerald-500 hover:to-green-400 transition-all 
                       flex items-center justify-center gap-2"
          >
            <Wrench size={22} />
            Mechanical Work
          </motion.button>

          {/* Insurance Button */}
          <motion.button
            whileHover={{
              scale: 1.08,
              boxShadow: "0px 0px 25px rgba(147,51,234,0.3)",
            }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/insurancehome")}
            className="px-7 py-3 text-lg font-semibold rounded-xl border border-purple-300 
                       bg-gradient-to-r from-indigo-400 to-purple-500  text-white
                       hover:from-purple-500 hover:to-indigo-400 transition-all 
                       flex items-center justify-center gap-2"
          >
            <FileText size={22} />
            Insurance Work
          </motion.button>
        </div>

        {/* Footer */}
        <p className="text-gray-500 mt-10 text-sm tracking-wide">
          © 2025 <span className="text-blue-500 font-medium">Yadgar Autos</span> | All Rights Reserved
        </p>
      </motion.div>

      {/* 🔥 Keyframes for Glow Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
        .animate-pulse {
          animation: pulse 6s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default Home;
