// src/components/Packages/PackagesTable.jsx
import React from "react";
import "./Package.css";

const PackagesTable = ({ packages, onDelete }) => {
  return (
    <table className="packages-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {packages.map((pkg) => (
          <tr key={pkg.id}>
            <td>{pkg.name}</td>
            <td>{pkg.price}</td>
            <td>
              <button onClick={() => onDelete(pkg.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PackagesTable;
