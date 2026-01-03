import axios from "axios";
export const api = axios.create({
  // baseURL: "http://localhost:3001/api/v1",
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://restaurant-searchdish-production-fa05.up.railway.app/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // console.log("Token ajouté aux en-têtes :", token);
  }
  return config;
});
