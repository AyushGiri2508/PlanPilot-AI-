import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as calendarAPI from "../../services/calendarAPI";

export const fetchSchedule = createAsyncThunk(
  "calendar/fetchSchedule",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const { data } = await calendarAPI.getSchedule(startDate, endDate);
      return data.schedule;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch schedule");
    }
  }
);

export const fetchScheduleByGoal = createAsyncThunk(
  "calendar/fetchScheduleByGoal",
  async (goalId, { rejectWithValue }) => {
    try {
      const { data } = await calendarAPI.getScheduleByGoal(goalId);
      return data.schedule;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch schedule");
    }
  }
);

export const updateEntry = createAsyncThunk(
  "calendar/updateEntry",
  async ({ id, entryData }, { rejectWithValue }) => {
    try {
      const { data } = await calendarAPI.updateScheduleEntry(id, entryData);
      return data.schedule;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update entry");
    }
  }
);

const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    schedule: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSchedule: (state) => {
      state.schedule = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.schedule = action.payload;
      })
      .addCase(fetchSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchScheduleByGoal.fulfilled, (state, action) => {
        state.schedule = action.payload;
      });

    builder
      .addCase(updateEntry.fulfilled, (state, action) => {
        const idx = state.schedule.findIndex(
          (s) => s._id === action.payload._id
        );
        if (idx !== -1) state.schedule[idx] = action.payload;
      });
  },
});

export const { clearSchedule } = calendarSlice.actions;
export default calendarSlice.reducer;
