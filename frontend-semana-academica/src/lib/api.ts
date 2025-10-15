import axios from "axios";

function trimTrailingSlash(url?: string) {
  if (!url) return "";
  return url.replace(/\/+$/, "");
}

const api = axios.create({
  baseURL: trimTrailingSlash(import.meta.env.VITE_API_URL), // <-- use VITE_API_URL
  // withCredentials: true,
});

// DEBUG opcional
api.interceptors.request.use((config) => {
  const full = `${config.baseURL || ""}${config.url || ""}`;
  console.log("[API→]", config.method?.toUpperCase(), full);
  return config;
});
api.interceptors.response.use(
  (res) => {
    const full = `${res.config.baseURL || ""}${res.config.url || ""}`;
    console.log("[API✓]", res.status, full);
    return res;
  },
  (err) => {
    const full = `${err.config?.baseURL || ""}${err.config?.url || ""}`;
    console.log("[API✗]", err.response?.status, full, err.response?.data);
    return Promise.reject(err);
  }
);

export default api;
