import React, { useEffect, useState } from "react";
import axios from "axios";
import SidePanel from "../components/Dashboard/Sidebar";

const TrainerPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState(null); // For viewing trainer details
  const [editedTrainer, setEditedTrainer] = useState(null); // For editing trainer details

  // Fetch all trainers on component mount
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/trainers");
        setTrainers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching trainers:", err);
        setError("Failed to fetch trainers.");
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  // Delete a trainer
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/trainers/${id}`);
      setTrainers((prev) => prev.filter((trainer) => trainer.id !== id));
    } catch (err) {
      console.error("Error deleting trainer:", err);
      setError("Failed to delete trainer.");
    }
  };

  // Handle update trainer details
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/trainers/${editedTrainer.id}`,
        editedTrainer
      );
      setTrainers((prev) =>
        prev.map((trainer) =>
          trainer.id === editedTrainer.id ? editedTrainer : trainer
        )
      );
      setEditedTrainer(null); // Close the edit modal
    } catch (err) {
      console.error("Error updating trainer:", err);
      setError("Failed to update trainer.");
    }
  };

  // Filter trainers based on search query
  const filteredTrainers = trainers.filter((trainer) =>
    trainer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <p className="text-center mt-20 text-xl">Loading trainers...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-20">{error}</p>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Panel */}
      <SidePanel />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Trainers</h1>
          <p className="text-gray-600">Manage Trainers</p>
        </div>

        {/* Total Trainers Count */}
        <div className="mb-4">
          <p className="text-lg text-gray-600">
            Total Trainers: {trainers.length}
          </p>
        </div>

        {/* Trainers Table */}
        <input
          type="text"
          placeholder="Search trainers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 px-4 py-2 border rounded-md w-full"
        />
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Specialty
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTrainers.map((trainer) => (
                <tr key={trainer.id}>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {trainer.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {trainer.specialty}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {trainer.contactInfo}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSelectedTrainer(trainer)} // Open view modal
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setEditedTrainer(trainer)} // Open edit modal
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(trainer.id)}
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

        {/* Modals for viewing/editing trainers */}
        {/* View Trainer Modal */}
        {selectedTrainer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-2xl font-bold mb-4">
                {selectedTrainer.name}
              </h2>
              <p>
                <span className="font-semibold">Specialty:</span>{" "}
                {selectedTrainer.specialty}
              </p>
              <p>
                <span className="font-semibold">Contact Info:</span>{" "}
                {selectedTrainer.contactInfo}
              </p>
              <p>
                <span className="font-semibold">Assigned Classes:</span>{" "}
                {selectedTrainer.assignedClasses?.join(", ") || "None"}
              </p>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedTrainer(null)} // Close modal
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Trainer Modal */}
        {editedTrainer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-2xl font-bold mb-4">Edit Trainer</h2>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    value={editedTrainer.name}
                    onChange={(e) =>
                      setEditedTrainer({
                        ...editedTrainer,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">
                    Specialty
                  </label>
                  <input
                    type="text"
                    value={editedTrainer.specialty}
                    onChange={(e) =>
                      setEditedTrainer({
                        ...editedTrainer,
                        specialty: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">
                    Contact Info
                  </label>
                  <input
                    type="text"
                    value={editedTrainer.contactInfo}
                    onChange={(e) =>
                      setEditedTrainer({
                        ...editedTrainer,
                        contactInfo: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditedTrainer(null)} // Close modal
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 ml-2"
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

export default TrainerPage;
