// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../src/pages/LoginForm";
import SignupPage from "../src/pages/SignupPage";
import DashboardPage from "../src/pages/DashboardPage";
import PlansPage from "./pages/PlansPage";
import ClientsPage from "../src/pages/ClientsPage";
import TrainersPage from "../src/pages/TrainersPage";
import MinatorLanding from "../src/pages/MinatorLanding";
import "./App.css";


const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<MinatorLanding />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/trainers" element={<TrainersPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;