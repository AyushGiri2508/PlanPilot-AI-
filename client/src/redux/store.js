import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import goalReducer from "./slices/goalSlice";
import taskReducer from "./slices/taskSlice";
import calendarReducer from "./slices/calendarSlice";
import aiReducer from "./slices/aiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    goals: goalReducer,
    tasks: taskReducer,
    calendar: calendarReducer,
    ai: aiReducer,
  },
});

export default store;
