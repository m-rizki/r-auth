import axios from "axios";
import { serverUrl } from "utils/server-util";

/**
 * Flexible API client with support for cookie-based and token-based authentication
 * Features: automatic token refresh, concurrent request handling, configurable storage
 */

// ========================
// Configuration
// ========================

interface ApiConfig {
  useCredentials?: boolean; // Enable cookies (withCredentials)
  useAuthHeader?: boolean;  // Enable JWT tokens in Authorization header
  tokenStorageKey?: string; // Storage key for tokens
}

const defaultConfig: ApiConfig = {
  useCredentials: true,
  useAuthHeader: false,
  tokenStorageKey: "accessToken",
};

// ========================
// Token Management
// ========================

// Get token from localStorage or sessionStorage
const getToken = (storageKey: string = "accessToken"): string | null => {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey)
    );
  }
  return null;
};

// Store token in localStorage
const setToken = (token: string, storageKey: string = "accessToken"): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(storageKey, token);
  }
};

// Remove token from both localStorage and sessionStorage
const removeToken = (storageKey: string = "accessToken"): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(storageKey);
    sessionStorage.removeItem(storageKey);
  }
};

// ========================
// API Instance Factory
// ========================

function createApiInstance(config: ApiConfig = defaultConfig) {
  const apiConfig: any = {};

  // Enable cookies if configured
  if (config.useCredentials) {
    apiConfig.withCredentials = true;
  }

  const api = axios.create(apiConfig);

  // ========================
  // Request Interceptor
  // ========================

  // Add Authorization header if token-based auth is enabled
  api.interceptors.request.use(
    (requestConfig) => {
      if (config.useAuthHeader) {
        const token = getToken(config.tokenStorageKey);
        if (token) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }
      }
      return requestConfig;
    },
    (error) => Promise.reject(error),
  );

  // ========================
  // Response Interceptor
  // ========================

  // Token refresh state - prevents multiple simultaneous refresh attempts
  let isRefreshing = false;
  let failedQueue: any[] = []; // Queue for requests waiting on token refresh

  // Process all queued requests after token refresh completes
  function processQueue(error: any, token?: string) {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  }

  api.interceptors.response.use(
    (response) => {
      // Store new token from response if using token auth
      if (config.useAuthHeader && response.data?.token) {
        setToken(response.data.token, config.tokenStorageKey);
      }
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 errors with automatic token refresh
      // Skip login/refresh endpoints to prevent infinite loops
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.endsWith("/login") &&
        !originalRequest.url.endsWith("/refresh-token")
      ) {
        
        // Queue concurrent requests during token refresh
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            if (config.useAuthHeader && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Attempt token refresh
          const refreshResponse = await api.post(serverUrl + "/refresh-token");

          let newToken = null;

          // Extract and store new token
          if (config.useAuthHeader) {
            newToken =
              refreshResponse.data?.token || refreshResponse.data?.access_token;
            if (newToken) {
              setToken(newToken, config.tokenStorageKey);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
          }

          // Retry all queued requests with new token
          processQueue(null, newToken);
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed - clear token and reject all queued requests
          processQueue(refreshError);

          if (config.useAuthHeader) {
            removeToken(config.tokenStorageKey);
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );

  return api;
}

// ========================
// Pre-configured Instances
// ========================

// Cookie-based authentication (original/legacy)
export const apiWithCredentials = createApiInstance({
  useCredentials: true,
  useAuthHeader: false,
});

// JWT token-based authentication
export const apiWithAuthHeader = createApiInstance({
  useCredentials: false,
  useAuthHeader: true,
  tokenStorageKey: "accessToken",
});

// Both cookies and JWT tokens
export const apiWithBoth = createApiInstance({
  useCredentials: true,
  useAuthHeader: true,
  tokenStorageKey: "accessToken",
});

// Custom configuration factory
export const createCustomApi = (config: ApiConfig) => createApiInstance(config);

// Default export (backward compatibility)
export default apiWithCredentials;

// ========================
// Helper Functions
// ========================

export const authHelpers = {
  getToken: (key?: string) => getToken(key),
  setToken: (token: string, key?: string) => setToken(token, key),
  removeToken: (key?: string) => removeToken(key),
};