// src/store/authSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userApi } from "../Backend"; // <-- adjust path if your api file is elsewhere

type User = {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Dashboard state
  dashboard: Record<string, any[]> | null;
  dashboardLoading: boolean;
  dashboardError: string | null;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  dashboard: null,
  dashboardLoading: false,
  dashboardError: null,
};

/**
 * loginUser
 * - Calls login endpoint
 * - Tries to extract user from login response
 * - Fallbacks to GET /me if user not present
 */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const loginRes = await userApi.login(payload);

      // Try to find a user object in login response
      const body = loginRes.data ?? {};
      const possibleUser =
        body.user ?? body.data?.user ?? body.data ?? body;

      if (possibleUser && (possibleUser.email || possibleUser._id || possibleUser.name)) {
        return possibleUser as User;
      }

      // Fallback: call /me (useful for cookie/session flows)
      const meRes = await userApi.getMe();
      const meBody = meRes.data ?? {};
      const meUser = meBody.data ?? meBody.user ?? meBody;
      if (meUser && (meUser.email || meUser._id || meUser.name)) {
        return meUser as User;
      }

      return rejectWithValue("Login successful but user profile not returned");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err.message ?? "Login failed";
      return rejectWithValue(msg);
    }
  }
);

/**
 * logoutUser
 */
export const logoutUser = createAsyncThunk("auth/logout", async (_arg, { rejectWithValue }) => {
  try {
    await userApi.logout();
    return true;
  } catch (err: any) {
    const msg = err?.response?.data?.message ?? err.message ?? "Logout failed";
    return rejectWithValue(msg);
  }
});

/**
 * fetchMe - restore session/profile
 */
export const fetchMe = createAsyncThunk("auth/fetchMe", async (_arg, { rejectWithValue }) => {
  try {
    const res = await userApi.getMe();
    const payload = res.data?.data ?? res.data ?? res.data?.user ?? res.data;
    return payload;
  } catch (err: any) {
    const msg = err?.response?.data?.message ?? err.message ?? "Fetch profile failed";
    return rejectWithValue(msg);
  }
});

/**
 * fetchDashboard - fetch admin dashboard data
 */
export const fetchDashboard = createAsyncThunk("auth/fetchDashboard", async (_arg: void, { rejectWithValue }) => {
  try {
    const res = await userApi.dashboard();
    const payload = res.data?.data ?? res.data ?? {};
    return payload as Record<string, any[]>;
  } catch (err: any) {
    const msg = err?.response?.data?.message ?? err.message ?? "Failed to fetch dashboard";
    return rejectWithValue(msg);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    clearDashboardError(state) {
      state.dashboardError = null;
    },
    clearDashboard(state) {
      state.dashboard = null;
      state.dashboardLoading = false;
      state.dashboardError = null;
    },
  },
  extraReducers: (builder) => {
    // login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.user = action.payload ?? null;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload ?? action.error?.message ?? "Login failed";
      state.isAuthenticated = false;
      state.user = null;
    });

    // logout
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;

      // clear dashboard on logout
      state.dashboard = null;
      state.dashboardLoading = false;
      state.dashboardError = null;
    });
    builder.addCase(logoutUser.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload ?? action.error?.message ?? "Logout failed";
    });

    // fetchMe
    builder.addCase(fetchMe.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMe.fulfilled, (state, action: PayloadAction<any>) => {
      state.user = action.payload ?? null;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(fetchMe.rejected, (state /*, action */) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null; // avoid showing error if not logged in during app start
    });

    // fetchDashboard
    builder.addCase(fetchDashboard.pending, (state) => {
      state.dashboardLoading = true;
      state.dashboardError = null;
    });
    builder.addCase(fetchDashboard.fulfilled, (state, action: PayloadAction<Record<string, any[]>>) => {
      state.dashboardLoading = false;
      state.dashboard = action.payload;
      state.dashboardError = null;
    });
    builder.addCase(fetchDashboard.rejected, (state, action: any) => {
      state.dashboardLoading = false;
      state.dashboardError = action.payload ?? action.error?.message ?? "Failed to load dashboard";
    });
  },
});

export const { clearAuthError, clearDashboardError, clearDashboard } = authSlice.actions;
export default authSlice.reducer;
