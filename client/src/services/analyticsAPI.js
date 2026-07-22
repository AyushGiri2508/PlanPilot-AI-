import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const API = axios.create({ baseURL: API_BASE_URL });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAnalytics = () => API.get("/analytics");
export const getDashboard = () => API.get("/dashboard");
