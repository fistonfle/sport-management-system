// src/components/UI/InputField.jsx
import React from "react";
import "./UI.css";

const InputField = ({ label, value, onChange, type = "text", placeholder }) => {
  return (
    <div className="input-field">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;