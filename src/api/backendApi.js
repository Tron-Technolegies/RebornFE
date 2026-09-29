import axios from "axios";

export const getServerUrl = (path = "") => {
  if (path.startsWith("http")) return path;
  
  const base = import.meta.env.VITE_API_DOMAIN || "";
  return `${base}${path}`;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
