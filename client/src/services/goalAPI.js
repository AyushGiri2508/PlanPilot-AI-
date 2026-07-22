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

export const getGoals = () => API.get("/goals");
export const getGoalById = (id) => API.get(`/goals/${id}`);
export const createGoal = (data) => API.post("/goals", data);
export const updateGoal = (id, data) => API.put(`/goals/${id}`, data);
export const deleteGoal = (id) => API.delete(`/goals/${id}`);
export const getGoalStats = () => API.get("/goals/stats");
