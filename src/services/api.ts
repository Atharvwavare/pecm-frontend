import axios from "axios";

const API = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8080/api",
});

// Attach token automatically to every outgoing request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token might be expired, invalid, or missing
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Avoid redirect loops if the failure came from the login/register call itself
      const isAuthRequest = error.config?.url?.includes("/auth/");
      if (!isAuthRequest) {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default API;