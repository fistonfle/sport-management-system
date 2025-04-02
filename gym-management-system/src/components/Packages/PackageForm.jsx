// src/components/Packages/PackageForm.jsx
import React, { useState } from "react";
import "./Package.css";

const PackageForm = ({ onSave }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, price });
  };

  return (
    <form className="package-form" onSubmit={handleSubmit}>
      <h2>Add Package</h2>
      <input
        type="text"
        placeholder="Package Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <button type="submit">Save</button>
    </form>
  );
};

export default PackageForm;