import React from "react";
import { useNavigate } from "react-router-dom";

const MinatorLanding = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a40] text-white">
      {/* Logo */}
      <div className="flex flex-col items-center mb-6 space-y-2">
        <div className="w-10 h-2 bg-white rounded-full"></div>
        <div className="w-6 h-2 bg-white rounded-full"></div>
        <div className="w-10 h-2 bg-white rounded-full"></div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold tracking-wider mb-8">MINATOR</h1>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/login")} // Navigate to Sign In
          className="px-6 py-2 text-lg font-medium text-[#1a1a40] bg-[#c8cbff] rounded-lg hover:bg-[#a1a6ff] hover:scale-105 transition-transform"
        >
          Sign In
        </button>
        <button
          onClick={() => navigate("/signup")} // Navigate to Sign Up
          className="px-6 py-2 text-lg font-medium text-[#1a1a40] bg-[#c8cbff] rounded-lg hover:bg-[#a1a6ff] hover:scale-105 transition-transform"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default MinatorLanding;
