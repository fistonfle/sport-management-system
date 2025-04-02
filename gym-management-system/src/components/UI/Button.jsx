
// src/components/UI/Button.jsx
import React from "react";
import "./UI.css";

const Button = ({ label, onClick, type = "button" }) => {
  return (
    <button className="ui-button" onClick={onClick} type={type}>
      {label}
    </button>
  );
};

export default Button;