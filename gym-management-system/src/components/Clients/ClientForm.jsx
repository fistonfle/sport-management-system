// src/components/Clients/ClientForm.jsx
import React, { useState } from "react";
import "./Client.css";

const ClientForm = ({ onAddClient }) => {
  const [client, setClient] = useState({ name: "", email: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (client.name && client.email) {
      onAddClient(client);
      setClient({ name: "", email: "" });
    }
  };

  return (
    <form className="client-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Client Name"
        value={client.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Client Email"
        value={client.email}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Client</button>
    </form>
  );
};

export default ClientForm;
