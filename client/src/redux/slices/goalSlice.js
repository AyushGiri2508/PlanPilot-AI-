import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as goalAPI from "../../services/goalAPI";

export const fetchGoals = createAsyncThunk(
  "goals/fetchGoals",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await goalAPI.getGoals();
      return data.goals;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch goals");
    }
  }
);

export const fetchGoalById = createAsyncThunk(
  "goals/fetchGoalById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await goalAPI.getGoalById(id);
      return data.goal;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch goal");
    }
  }
);

export const addGoal = createAsyncThunk(
  "goals/addGoal",
  async (goalData, { rejectWithValue }) => {
    try {
      const { data } = await goalAPI.createGoal(goalData);
      return data.goal;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create goal");
    }
  }
);

export const editGoal = createAsyncThunk(
  "goals/editGoal",
  async ({ id, goalData }, { rejectWithValue }) => {
    try {
      const { data } = await goalAPI.updateGoal(id, goalData);
      return data.goal;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update goal");
    }
  }
);

export const removeGoal = createAsyncThunk(
  "goals/removeGoal",
  async (id, { rejectWithValue }) => {
    try {
      await goalAPI.deleteGoal(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete goal");
    }
  }
);

export const fetchGoalStats = createAsyncThunk(
  "goals/fetchGoalStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await goalAPI.getGoalStats();
      return data.stats;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
    }
  }
);

const goalSlice = createSlice({
  name: "goals",
  initialState: {
    goals: [],
    currentGoal: null,
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearGoalError: (state) => {
      state.error = null;
    },
    clearCurrentGoal: (state) => {
      state.currentGoal = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchGoalById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGoalById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGoal = action.payload;
      })
      .addCase(fetchGoalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(addGoal.fulfilled, (state, action) => {
        state.goals.unshift(action.payload);
      });

    builder
      .addCase(editGoal.fulfilled, (state, action) => {
        const idx = state.goals.findIndex((g) => g._id === action.payload._id);
        if (idx !== -1) state.goals[idx] = action.payload;
        if (state.currentGoal?._id === action.payload._id) {
          state.currentGoal = action.payload;
        }
      });

    builder
      .addCase(removeGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter((g) => g._id !== action.payload);
      });

    builder
      .addCase(fetchGoalStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearGoalError, clearCurrentGoal } = goalSlice.actions;
export default goalSlice.reducer;
