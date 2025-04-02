import React, { useEffect, useState } from "react";
import axios from "axios";
import SidePanel from "../components/Dashboard/Sidebar"; 

const PlansAndClasses = () => {
  const [plansData, setPlansData] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPlan, setEditingPlan] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
    trainer: "",
    schedule: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch plans
        const plansResponse = await axios.get("http://localhost:5000/api/packages");
        // Fetch classes
        const classesResponse = await axios.get("http://localhost:5000/api/classes");
        // Fetch trainers
        const trainersResponse = await axios.get("http://localhost:5000/api/trainers");

        setPlansData(plansResponse.data);
        setClassesData(classesResponse.data);
        setTrainers(trainersResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data from the API.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeletePlan = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/packages/${id}`);
      setPlansData(plansData.filter((plan) => plan.id !== id));
      setShowDeleteConfirm(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting plan:", err);
      setError("Failed to delete the plan.");
    }
  };

  const handleDeleteClass = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/classes/${id}`);
      setClassesData(classesData.filter((classItem) => classItem.id !== id));
      setShowDeleteConfirm(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting class:", err);
      setError("Failed to delete the class.");
    }
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      description: plan.description,
    });
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      price: classItem.price,
      duration: classItem.duration,
      description: classItem.description,
      trainer: classItem.trainer,
      schedule: classItem.schedule,
    });
  };

  const handleSubmitPlan = async (e) => {
    e.preventDefault();

    try {
      if (editingPlan) {
        // Edit existing plan
        await axios.put(`http://localhost:5000/api/packages/${editingPlan.id}`, formData);
        setPlansData(plansData.map((plan) => (plan.id === editingPlan.id ? formData : plan)));
      } else {
        // Create new plan
        await axios.post("http://localhost:5000/api/packages", formData);
        setPlansData([...plansData, formData]);
      }
      setEditingPlan(null);
      setFormData({
        name: "",
        price: "",
        duration: "",
        description: "",
      });
    } catch (err) {
      console.error("Error submitting plan:", err);
      setError("Failed to submit plan.");
    }
  };

  const handleSubmitClass = async (e) => {
    e.preventDefault();

    try {
      if (editingClass) {
        // Edit existing class
        await axios.put(`http://localhost:5000/api/classes/${editingClass.id}`, formData);
        setClassesData(classesData.map((classItem) => (classItem.id === editingClass.id ? formData : classItem)));
      } else {
        // Create new class
        await axios.post("http://localhost:5000/api/classes", formData);
        setClassesData([...classesData, formData]);
      }
      setEditingClass(null);
      setFormData({
        name: "",
        price: "",
        duration: "",
        description: "",
        trainer: "",
        schedule: "",
      });
    } catch (err) {
      console.error("Error submitting class:", err);
      setError("Failed to submit class.");
    }
  };

  const handleDeleteClick = (id, type) => {
    setDeleteId({ id, type });
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
    setEditingClass(null);
    setFormData({
      name: "",
      price: "",
      duration: "",
      description: "",
      trainer: "",
      schedule: "",
    });
  };

  if (loading) {
    return <p className="text-center mt-20 text-xl">Loading plans and classes...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-20">{error}</p>;
  }

  return (
    <div className="flex space-x-4 min-h-screen">
      {/* Sidebar Panel */}
      <SidePanel />

      {/* Main Content */}
      <div className="flex-1 p-8 ml-72 bg-gray-100">
        <h1 className="text-3xl font-bold text-center mb-8">Plans & Classes</h1>

        {/* Plans Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Plans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {plansData.map((plan) => (
              <div
                key={plan.id}
                className="bg-purple-200 rounded-lg shadow-lg p-6 text-center flex flex-col items-center"
              >
                <div className="w-12 h-12 mb-4 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 0L0 20h20L10 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-2xl font-bold text-purple-700">{plan.price} RWF</p>
                <button
                  className="mt-2 bg-blue-500 text-white py-1 px-3 rounded text-sm"
                  onClick={() => handleEditPlan(plan)}
                >
                  Edit
                </button>
                <button
                  className="mt-2 bg-red-500 text-white py-1 px-3 rounded text-sm"
                  onClick={() => handleDeleteClick(plan.id, "plan")}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Classes Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Classes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classesData.map((classItem) => (
              <div
                key={classItem.id}
                className="bg-white border rounded-lg shadow-md p-4 text-center"
              >
                <h3 className="text-lg font-semibold mb-2">{classItem.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{classItem.description}</p>
                <p className="text-sm text-gray-600 mb-1">Trainer: {classItem.trainer}</p>
                <p className="text-sm text-gray-600 mb-2">
                  Schedule: {classItem.schedule}
                </p>
                <button
                  className="mt-2 bg-blue-500 text-white py-1 px-3 rounded text-sm"
                  onClick={() => handleEditClass(classItem)}
                >
                  Edit
                </button>
                <button
                  className="mt-2 bg-red-500 text-white py-1 px-3 rounded text-sm"
                  onClick={() => handleDeleteClick(classItem.id, "class")}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Form (Popup) for Classes */}
        {editingClass && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
              <h2 className="text-2xl font-semibold mb-4">
                Edit Class
              </h2>
              <form onSubmit={handleSubmitClass}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>

                {/* Trainer Selection */}
                <div className="mb-4">
                  <label htmlFor="trainer" className="block text-sm font-medium text-gray-700">
                    Trainer
                  </label>
                  <select
                    id="trainer"
                    name="trainer"
                    value={formData.trainer}
                    onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                    className="p-2 border rounded w-full"
                    required
                  >
                    <option value="">Select a Trainer</option>
                    {trainers.map((trainer) => (
                      <option key={trainer.id} value={trainer.name}>
                        {trainer.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Schedule Date Picker */}
                <div className="mb-4">
                  <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">
                    Schedule
                  </label>
                  <input
                    type="date"
                    id="schedule"
                    name="schedule"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                  {editingClass ? "Update Class" : "Create Class"}
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white py-2 px-4 rounded ml-2"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansAndClasses;
