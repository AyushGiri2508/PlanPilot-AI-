import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as aiAPI from "../../services/aiAPI";

export const generateAIPlan = createAsyncThunk(
  "ai/generatePlan",
  async (goalId, { rejectWithValue }) => {
    try {
      const { data } = await aiAPI.generatePlan(goalId);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to generate plan");
    }
  }
);

export const regenerateAIPlan = createAsyncThunk(
  "ai/regeneratePlan",
  async (goalId, { rejectWithValue }) => {
    try {
      const { data } = await aiAPI.regeneratePlan(goalId);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to regenerate plan");
    }
  }
);

export const recoverAIPlan = createAsyncThunk(
  "ai/recoverPlan",
  async (goalId, { rejectWithValue }) => {
    try {
      const { data } = await aiAPI.recoverPlan(goalId);
      return data.schedule;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to recover plan");
    }
  }
);

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    result: null,
    loading: false,
    error: null,
    currentStep: null, // tracks which agent is running
  },
  reducers: {
    clearAIResult: (state) => {
      state.result = null;
      state.error = null;
      state.currentStep = null;
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Generate
    builder
      .addCase(generateAIPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentStep = "Analyzing Goal...";
      })
      .addCase(generateAIPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
        state.currentStep = "Complete!";
      })
      .addCase(generateAIPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentStep = null;
      });

    // Regenerate
    builder
      .addCase(regenerateAIPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentStep = "Regenerating...";
      })
      .addCase(regenerateAIPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
        state.currentStep = "Complete!";
      })
      .addCase(regenerateAIPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentStep = null;
      });

    // Recover
    builder
      .addCase(recoverAIPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentStep = "Recovering schedule...";
      })
      .addCase(recoverAIPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
        state.currentStep = "Recovery complete!";
      })
      .addCase(recoverAIPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentStep = null;
      });
  },
});

export const { clearAIResult, setCurrentStep } = aiSlice.actions;
export default aiSlice.reducer;
