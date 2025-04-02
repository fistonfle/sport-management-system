import React from "react";
import LoginForm from "../components/Auth/LoginForm";

const LoginPage = () => {
  const handleLogin = (credentials) => {
    console.log("Login submitted:", credentials);
    
  };

  return (
    <div className="login-page">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;