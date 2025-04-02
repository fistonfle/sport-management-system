import React, { useEffect, useState } from "react";
import axios from "axios";
import SidePanel from "../components/Dashboard/Sidebar";

const formatDate = (date) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(date).toLocaleDateString(undefined, options);
};

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClient, setSelectedClient] = useState(null); 
  const [editedClient, setEditedClient] = useState(null); 

  // Fetch all clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/clients");
        setClients(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("Failed to fetch clients.");
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Delete a client
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/clients/${id}`);
      setClients((prev) => prev.filter((client) => client.id !== id));
    } catch (err) {
      console.error("Error deleting client:", err);
      setError("Failed to delete client.");
    }
  };

  // Handle update client details
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/clients/${editedClient.id}`, editedClient);
      setClients((prev) =>
        prev.map((client) =>
          client.id === editedClient.id ? editedClient : client
        )
      );
      setEditedClient(null); // Close the edit modal
    } catch (err) {
      console.error("Error updating client:", err);
      setError("Failed to update client.");
    }
  };

  // Filter clients based on search query
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <p className="text-center mt-20 text-xl">Loading clients...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-20">{error}</p>;
  }

  return (
    <div className="flex space-x-4 min-h-screen"> {/* Adjusted flex direction to horizontal */}
      {/* Sidebar Panel */}
      <SidePanel />
      
      {/* Main Content */}
      <div className="flex-1 p-8 ml-72 bg-gray-100"> {/* Adjusted margin-left for sidebar width */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-gray-600">Manage Clients</p>
        </div>

        {/* Total Clients Count */}
        <div className="mb-4">
          <p className="text-lg text-gray-600">Total Clients: {clients.length}</p>
        </div>

        {/* Clients Table */}
        <input
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 px-4 py-2 border rounded-md w-full"
        />
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Membership Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Join Date</th> {/* Added Join Date */}
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 text-sm text-gray-700">{client.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{client.membershipType}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{client.status}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{formatDate(client.joinDate)}</td> {/* Formatted Join Date */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSelectedClient(client)} // Open view modal
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setEditedClient(client)} // Open edit modal
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View Client Modal */}
        {selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-2xl font-bold mb-4">{selectedClient.name}</h2>
              <p>
                <span className="font-semibold">Membership Type:</span>{" "}
                {selectedClient.membershipType}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {selectedClient.status}
              </p>
              <p>
                <span className="font-semibold">Join Date:</span> {formatDate(selectedClient.joinDate)} {/* Formatted Join Date */}
              </p>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedClient(null)} // Close modal
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Client Modal */}
        {editedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-2xl font-bold mb-4">Edit Client</h2>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    value={editedClient.name}
                    onChange={(e) =>
                      setEditedClient({
                        ...editedClient,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Membership Type</label>
                  <input
                    type="text"
                    value={editedClient.membershipType}
                    onChange={(e) =>
                      setEditedClient({
                        ...editedClient,
                        membershipType: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Status</label>
                  <input
                    type="text"
                    value={editedClient.status}
                    onChange={(e) =>
                      setEditedClient({
                        ...editedClient,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Join Date</label>
                  <input
                    type="date"
                    value={editedClient.joinDate}
                    onChange={(e) =>
                      setEditedClient({
                        ...editedClient,
                        joinDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditedClient(null)} // Close edit modal
                    className="px-4 py-2 ml-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientPage;
