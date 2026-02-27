import axios from "axios";

// Using Vite's environment variables or defaulting to local dev backend.
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://65.0.182.231:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Optionally, add a response interceptor here to handle global errors (like 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // We can handle global authentication state resets here later if needed
    return Promise.reject(error);
  },
);

export default axiosInstance;
