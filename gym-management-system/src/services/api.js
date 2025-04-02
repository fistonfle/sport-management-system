import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:5000/api", // Backend server URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptors for request and response
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens or modify headers here if needed
    const token = localStorage.getItem("authToken"); // Example for JWT token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle global errors (e.g., redirect to login if 401)
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized access - redirecting to login...");
      // Redirect to login page or show a modal
    } else {
      console.error("API error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
