import axios from "axios";

export const getServerUrl = (path = "") => {
  if (path.startsWith("http")) return path;
  
  const base = import.meta.env.VITE_API_DOMAIN || "";
  return `${base}${path}`;
};

let inMemoryCsrfToken = "";

export const setCsrfToken = (token) => {
  if (token) inMemoryCsrfToken = token;
};

export const getCsrfToken = () => {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    if (match && match[1]) return decodeURIComponent(match[1]);
  }
  return inMemoryCsrfToken || "";
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
