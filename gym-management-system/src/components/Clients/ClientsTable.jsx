// src/components/Clients/ClientsTable.jsx
import React from "react";
import "./Client.css";

const ClientsTable = ({ clients }) => {
  return (
    <table className="clients-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client) => (
          <tr key={client.id}>
            <td>{client.id}</td>
            <td>{client.name}</td>
            <td>{client.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ClientsTable;