import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Send a POST request to the backend API
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
      });

      // Handle successful response
      console.log("User registered successfully:", response.data);
      navigate("/login");
    } catch (err) {
      console.error("Error during registration:", err);
      setError(err.response?.data?.error || "Failed to register. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a40] text-white">
      {/* Form Header */}
      <h2 className="text-3xl font-bold mb-8">Sign Up</h2>

      {/* Form */}
      <form
        className="flex flex-col bg-[#2a2a54] p-8 rounded-lg shadow-md space-y-6"
        onSubmit={handleSignup}
      >
        {/* Name Input */}
        <input
          id="name"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-72 px-4 py-2 rounded-lg bg-[#f0f0f0] text-black focus:outline-none focus:ring-2 focus:ring-[#a1a6ff]"
        />

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
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-72 px-4 py-2 rounded-lg bg-[#f0f0f0] text-black focus:outline-none focus:ring-2 focus:ring-[#a1a6ff]"
        />

        {/* Confirm Password Input */}
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-72 px-4 py-2 rounded-lg bg-[#f0f0f0] text-black focus:outline-none focus:ring-2 focus:ring-[#a1a6ff]"
        />

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-72 px-6 py-2 bg-[#c8cbff] text-[#1a1a40] font-medium rounded-lg hover:bg-[#a1a6ff] hover:scale-105 transition-transform"
        >
          Sign Up
        </button>
      </form>

      {/* Redirect to Login */}
      <p className="mt-4 text-sm text-gray-300">
        Already have an account?{" "}
        <button
          className="text-[#a1a6ff] hover:underline"
          onClick={() => navigate("/login")} // Redirect to the Login page
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default SignupForm;
