import axios from "axios";

export const getServerUrl = (path = "") => {
  if (path.startsWith("http")) return path;
  
  const base = import.meta.env.VITE_API_DOMAIN || "";
  return `${base}${path}`;
};

export const getCsrfToken = () => {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

api.interceptors.request.use((config) => {
  const token = getCsrfToken();
  if (token && !config.headers["X-CSRFToken"]) {
    config.headers["X-CSRFToken"] = token;
  }
  return config;
});

export default api;

