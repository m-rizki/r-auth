import axios from "axios";
import { serverUrl } from "utils/server-util";

// Create a custom Axios instance for all authenticated API requests
const api = axios.create({
  withCredentials: true, // Allows cookies (e.g., for refresh token via HttpOnly cookie)
});

// ========================
// Request Interceptor
// ========================

// This interceptor adds the accessToken from localStorage (if available)
// to every outgoing request's Authorization header.
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error), // Forward any request errors
);

// ========================
// Response Interceptor
// ========================

// These variables handle refresh logic and queuing
let isRefreshing = false; // Flag to prevent multiple simultaneous refresh requests
let failedQueue: any[] = []; // Queue to hold requests while refresh is in progress

/**
 * Process all queued requests:
 * - If refresh succeeded, retry them with the new token.
 * - If refresh failed, reject them with the error.
 */
function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

// Intercepts all responses to catch 401 (Unauthorized) errors and handle token refresh
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // Check if:
    // - The error is 401
    // - It's not already retried
    // - The request is not for login or token refresh (to prevent infinite loops)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.endsWith("/login") &&
      !originalRequest.url.endsWith("/refresh-token")
    ) {
      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            return api(originalRequest); // Retry original request with new token
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await api.post(serverUrl + "/refresh-token");

        const { accessToken } = refreshResponse.data;

        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }

        processQueue(null, accessToken);

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
