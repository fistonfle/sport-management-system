import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { getFirestore, collection, addDoc, query, where, getDocs, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import SidePanel from "../components/Dashboard/Sidebar";


const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalMembers: 0,
    totalTrainers: 0,
    activeClasses: 0,
    lastMonthIncome: 0, 
  });

  const [activeTab, setActiveTab] = useState("home");
  const [formData, setFormData] = useState({
    plan: "",
    class: "",
    member: "",
    trainer: "",
    name: "",
    price: "",
    duration: "",
    description: "",
    className: "",
    classTrainer: "",
    startTime: "",
    endTime: "",
    classType: "",
    trainerName: "",
    specialty: "",
    assignedClasses: "",
    contactInfo: "",
    membershipType: "",
    status: "",
    joinDate: "",
  });

  const [trainers, setTrainers] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); 

  const db = getFirestore(); // Initialize Firestore instance

  useEffect(() => {
    // Fetch dashboard data including counts
    fetchDashboardData();
    fetchTrainersData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch counts directly from Firestore
      const totalMembers = await fetchCollectionCount("clients");
      const totalTrainers = await fetchCollectionCount("trainers");
      const activeClasses = await fetchCollectionCount("classes");

      // Set the counts in the dashboardData state
      setDashboardData({
        totalMembers,
        totalTrainers,
        activeClasses,
        lastMonthIncome: 0, 
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const fetchCollectionCount = async (collectionName) => {
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      return snapshot.size; 
    } catch (error) {
      console.error(`Error fetching count for ${collectionName}:`, error);
      return 0;
    }
  };

  const fetchTrainersData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/trainers");
      setTrainers(response.data);
    } catch (error) {
      console.error("Error fetching trainers:", error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setFormData({
      plan: "",
      class: "",
      member: "",
      trainer: "",
      name: "",
      price: "",
      duration: "",
      description: "",
      className: "",
      classTrainer: "",
      startTime: "",
      endTime: "",
      classType: "",
      trainerName: "",
      specialty: "",
      assignedClasses: "",
      contactInfo: "",
      membershipType: "",
      status: "",
      joinDate: "",
    });
    setSuccessMessage(""); 
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let apiEndpoint = "";
    const baseUrl = "http://localhost:5000/api"; // Common base URL for all API endpoints

    if (activeTab === "plans") {
      apiEndpoint = `${baseUrl}/packages`;
    } else if (activeTab === "trainers") {
      apiEndpoint = `${baseUrl}/trainers`;
    } else if (activeTab === "members") {
      apiEndpoint = `${baseUrl}/clients`;
    } else if (activeTab === "classes") {
      apiEndpoint = `${baseUrl}/classes`; 
    }

    const newClassData = {
      name: formData.className, 
      description: formData.description, 
      trainer: formData.classTrainer, 
      schedule: `Monday ${formData.startTime} AM`, 
    };

    // Check if class already exists in Firestore
    if (activeTab === "classes") {
      const q = query(collection(db, "classes"), where("name", "==", formData.className));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        alert("This class already exists!");
        return; 
      }
    }

    try {
      if (apiEndpoint) {
        // Post the form data to the backend
        const response = await axios.post(apiEndpoint, activeTab === "classes" ? newClassData : formData);
        console.log("Form data submitted successfully to backend:", response);

        // Now, save data to Firestore if necessary
        if (activeTab === "classes") {
          const docRef = await addDoc(collection(db, "classes"), {
            name: formData.className,
            description: formData.description,
            trainer: formData.classTrainer,
            schedule: `Monday ${formData.startTime} AM`,
          });
          console.log("Document written to Firestore with ID:", docRef.id);
        }

        // Calculate last month's income after adding the member
        if (activeTab === "clients") {
          await calculateLastMonthIncome();
        }

        // Set success message
        setSuccessMessage("Data successfully submitted and saved!");

        // Reset form data after successful submission
        setFormData({
          plan: "",
          class: "",
          member: "",
          trainer: "",
          name: "",
          price: "",
          duration: "",
          description: "",
          className: "",
          classTrainer: "",
          startTime: "",
          endTime: "",
          classType: "",
          trainerName: "",
          specialty: "",
          assignedClasses: "",
          contactInfo: "",
          membershipType: "",
          status: "",
          joinDate: "",
        });
      } else {
        console.error("Invalid API endpoint:", apiEndpoint);
      }
    } catch (error) {
      console.error("Error submitting form data:", error.response ? error.response.data : error.message);
    }
  };

 

  const calculateLastMonthIncome = async () => {
    
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1); // Get the last month

    const q = query(collection(db, "clients"), where("joinDate", ">=", lastMonth));
    const querySnapshot = await getDocs(q);
    
    let totalIncome = 0;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalIncome += parseFloat(data.price) || 0; 
    });

    // Set last month income
    setDashboardData((prevData) => ({
      ...prevData,
      lastMonthIncome: totalIncome,
    }));
  };
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar Panel */}
      <SidePanel />
      
      {/* Main Content */}
      <div className="flex-1 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500">{formatDate(new Date())}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last Month</p>
          <p className="text-lg text-green-500 font-bold">{dashboardData.lastMonthIncome} RWF</p>
        </div>
      </header>

      {/* Success message */}
      {successMessage && <div className="text-green-500 mt-4">{successMessage}</div>}

        {/* Stats */}
       {/* Stats */}
       <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">TOTAL MEMBERS</p>
            <h2 className="text-2xl font-bold">{dashboardData.totalMembers}</h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">TOTAL TRAINERS</p>
            <h2 className="text-2xl font-bold">{dashboardData.totalTrainers}</h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">ACTIVE CLASSES</p>
            <h2 className="text-2xl font-bold">{dashboardData.activeClasses}</h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            className="bg-white text-[#1a1a40] font-semibold py-3 rounded-lg shadow hover:bg-gray-100"
            onClick={() => handleTabClick("plans")}
          >
            Add Plans
          </button>
          <button
            className="bg-white text-[#1a1a40] font-semibold py-3 rounded-lg shadow hover:bg-gray-100"
            onClick={() => handleTabClick("classes")}
          >
            Add Classes
          </button>
          <button
            className="bg-white text-[#1a1a40] font-semibold py-3 rounded-lg shadow hover:bg-gray-100"
            onClick={() => handleTabClick("trainers")}
          >
            Add Trainers
          </button>
          <button
            className="bg-white text-[#1a1a40] font-semibold py-3 rounded-lg shadow hover:bg-gray-100"
            onClick={() => handleTabClick("members")}
          >
            Add Members
          </button>
        </div>

        {/* Dynamic Content Based on Active Tab */}
        <div className="mt-8 justify-center">
          {activeTab === "home" && (
            <div className="bg-gray-100 p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 font-poppins">
              Welcome to the Dashboard
            </h2>
            <img
              src="/icons/dashboard.png"
              alt="Dashboard"
              className="w-64 h-auto rounded-md border border-gray-300 shadow-lg mx-auto"
            />
          </div>
           
          
          )}

          {/* Plans Form */}
          {activeTab === "plans" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Add a New Plan</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Plan Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Enter Plan Name"
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="Enter Plan Price"
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleFormChange}
                    placeholder="Enter Duration in Days"
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Enter Plan Description"
                    className="p-2 border rounded w-full"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                  Submit
                </button>
              </form>
            </div>
          )}
          {activeTab === "members" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Add a New Member</h2>
              <form onSubmit={handleSubmit}>
              <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="membershipType" className="block text-sm font-medium text-gray-700">Membership Type</label>
                  <select
                    id="membershipType"
                    name="membershipType"
                    value={formData.membershipType}
                    onChange={handleFormChange}
                    className="p-2 border rounded w-full"
                    required
                  >
                    <option value="">Select Membership Type</option>
                    <option value="regular">Regular</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="p-2 border rounded w-full"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">Join Date</label>
                  <input
                    type="date"
                    id="joinDate"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleFormChange}
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>
                
                <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                  Submit
                </button>
              </form>
            </div>
          )}
          {activeTab === "classes" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Add a New Class</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="className" className="block text-sm font-medium text-gray-700">Class Name</label>
                  <input
                    type="text"
                    id="className"
                    name="className"
                    value={formData.className}
                    onChange={handleFormChange}
                    placeholder="Enter Class Name"
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="classTrainer" className="block text-sm font-medium text-gray-700">Select Trainer</label>
                  <select
                    id="classTrainer"
                    name="classTrainer"
                    value={formData.classTrainer}
                    onChange={handleFormChange}
                    className="p-2 border rounded w-full"
                    required
                  >
                    <option value="">Select Trainer</option>
                    {trainers.map((trainer) => (
                      <option key={trainer.id} value={trainer.name}>{trainer.name}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleFormChange}
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Class Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Enter Class Description"
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>

                <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                  Submit
                </button>
              </form>
            </div>
          )}




{activeTab === "trainers" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Add a New Trainer</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Trainer Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Enter Trainer Name"
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">Specialty</label>
                  <input
                    type="text"
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleFormChange}
                    placeholder="Enter Trainer Specialty"
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">Contact Information</label>
                  <input
                    type="text"
                    id="contactInfo"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleFormChange}
                    placeholder="Enter Contact Info"
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>

                <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
