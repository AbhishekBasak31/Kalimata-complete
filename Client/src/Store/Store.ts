// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // middleware etc. default is fine
});

// types for hooks/selectors
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
