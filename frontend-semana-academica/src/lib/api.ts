import axios from "axios";

function trimTrailingSlash(url?: string) {
  if (!url) return "";
  return url.replace(/\/+$/, "");
}

const api = axios.create({
  baseURL: trimTrailingSlash(import.meta.env.VITE_API_BASE_URL),
  // withCredentials: true, // se usar sessão/cookies no futuro
});

// LOGA TUDO NO CONSOLE (para debug)
api.interceptors.request.use((config) => {
  const full = `${config.baseURL || ""}${config.url || ""}`;
  console.log("[API→] ", config.method?.toUpperCase(), full, { data: config.data });
  return config;
});
api.interceptors.response.use(
  (res) => {
    const full = `${res.config.baseURL || ""}${res.config.url || ""}`;
    console.log("[API✓] ", res.status, full, res.data);
    return res;
  },
  (err) => {
    const cfg = err?.config || {};
    const full = `${cfg.baseURL || ""}${cfg.url || ""}`;
    console.error("[API✗] ", cfg.method?.toUpperCase(), full, err?.response?.status, err?.response?.data || err?.message);
    throw err;
  }
);

// expõe para teste no console (F12 → digite: window.api.get("/api/participants"))
// @ts-ignore
if (typeof window !== "undefined") (window as any).api = api;

export default api;
