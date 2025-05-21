import axios from "axios";

// Create an axios instance for API calls
const api = axios.create({
  // Optionally set a baseURL if you want
  // baseURL: import.meta.env.VITE_CLIENT_SERVICE,
  withCredentials: true, // Always send cookies
});

// Request interceptor: attach Authorization header if accessToken exists in localStorage
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 errors globally (optional)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  }
);

export default api;
