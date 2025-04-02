import React from "react";
import SignupForm from "../components/Auth/SignupForm";

const SignupPage = () => {
  const handleSignup = (data) => {
    console.log("Signup submitted:", data);
    // Implement signup logic here
  };

  return (
    <div className="signup-page">
      <SignupForm onSignup={handleSignup} />
    </div>
  );
};

export default SignupPage;