import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase"; 
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    try {
      await signInWithEmailAndPassword(auth, email, password); 
      navigate("/dashboard"); 
    } catch (err) {
      console.error("Login error:", err); 
      setError("Invalid email or password."); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a40] text-white">
      {/* Form Header */}
      <h2 className="text-3xl font-bold mb-8">Login</h2>

      {/* Form */}
      <form
        className="flex flex-col bg-[#2a2a54] p-8 rounded-lg shadow-md space-y-6"
        onSubmit={handleLogin}
      >
        {/* Email Input */}
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-72 px-4 py-2 rounded-lg bg-[#f0f0f0] text-black focus:outline-none focus:ring-2 focus:ring-[#a1a6ff]"
        />

        {/* Password Input */}
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-72 px-4 py-2 rounded-lg bg-[#f0f0f0] text-black focus:outline-none focus:ring-2 focus:ring-[#a1a6ff]"
          />
          {/* Show/Hide Password Toggle */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-2 right-4 text-sm text-[#a1a6ff]"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-72 px-6 py-2 bg-[#c8cbff] text-[#1a1a40] font-medium rounded-lg hover:bg-[#a1a6ff] hover:scale-105 transition-transform"
        >
          Login
        </button>
      </form>

      {/* Redirect to Sign Up */}
      <p className="mt-4 text-sm text-gray-300">
        Don't have an account?{" "}
        <button
          className="text-[#a1a6ff] hover:underline"
          onClick={() => navigate("/signup")} // Redirect to the Sign Up page
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
