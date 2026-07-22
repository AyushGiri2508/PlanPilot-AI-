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

export const getTasksByGoal = (goalId) =>
  API.get(`/goals/${goalId}/tasks`);

export const getTaskById = (goalId, taskId) =>
  API.get(`/goals/${goalId}/tasks/${taskId}`);

export const createTask = (goalId, data) =>
  API.post(`/goals/${goalId}/tasks`, data);

export const updateTask = (goalId, taskId, data) =>
  API.put(`/goals/${goalId}/tasks/${taskId}`, data);

export const deleteTask = (goalId, taskId) =>
  API.delete(`/goals/${goalId}/tasks/${taskId}`);
