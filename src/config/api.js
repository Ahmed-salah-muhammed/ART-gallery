import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — inject JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("shopwave-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const apiError = new Error(
        error.response.data?.message || error.message || "API Error",
      );
      apiError.status = error.response.status;
      apiError.data = error.response.data;
      return Promise.reject(apiError);
    } else if (error.request) {
      // Request made but no response
      const apiError = new Error("No response from server");
      apiError.status = 0;
      return Promise.reject(apiError);
    } else {
      // Error in request setup
      return Promise.reject(error);
    }
  },
);

export default api;
