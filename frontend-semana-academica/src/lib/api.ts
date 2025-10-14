import axios from "axios";


// Remove barras finais da BASE_URL para evitar //api
function trimTrailingSlash(url?: string) {
if (!url) return "";
return url.replace(/\/+$/, "");
}


const api = axios.create({
baseURL: trimTrailingSlash(import.meta.env.VITE_API_BASE_URL),
// Se um dia usar cookies/sessão com back: habilite abaixo
// withCredentials: true,
});


export default api;