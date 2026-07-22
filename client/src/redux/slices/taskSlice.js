import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as taskAPI from "../../services/taskAPI";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (goalId, { rejectWithValue }) => {
    try {
      const { data } = await taskAPI.getTasksByGoal(goalId);
      return data.tasks;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch tasks");
    }
  }
);

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async ({ goalId, taskData }, { rejectWithValue }) => {
    try {
      const { data } = await taskAPI.createTask(goalId, taskData);
      return data.task;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create task");
    }
  }
);

export const editTask = createAsyncThunk(
  "tasks/editTask",
  async ({ goalId, taskId, taskData }, { rejectWithValue }) => {
    try {
      const { data } = await taskAPI.updateTask(goalId, taskId, taskData);
      return data.task;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update task");
    }
  }
);

export const removeTask = createAsyncThunk(
  "tasks/removeTask",
  async ({ goalId, taskId }, { rejectWithValue }) => {
    try {
      await taskAPI.deleteTask(goalId, taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete task");
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTasks: (state) => {
      state.tasks = [];
    },
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      });

    builder
      .addCase(editTask.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.tasks[idx] = action.payload;
      });

    builder
      .addCase(removeTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      });
  },
});

export const { clearTasks, clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
