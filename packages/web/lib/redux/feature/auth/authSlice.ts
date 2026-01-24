import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthResponse } from 'shared/types/Auth';

type AuthSession = {
  token: string;
  expiresAt: number;
};

type AuthState = {
  user: AuthResponse | null;
  session: AuthSession | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: AuthResponse; session: AuthSession }>,
    ) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // Logout actions
    logoutStart: (state) => {
      state.isLoading = true;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    logoutFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Get session actions
    getSessionStart: (state) => {
      state.isLoading = true;
    },
    getSessionSuccess: (
      state,
      action: PayloadAction<{ user: AuthResponse; session: AuthSession }>,
    ) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    getSessionFailure: (state, action: PayloadAction<string>) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    updateUserProfile: (state, action: PayloadAction<AuthResponse>) => {
      state.user = {
        ...(state.user ?? {}),
        ...action.payload,
      } as AuthResponse;
    },

    // Reset auth state
    resetAuth: (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
  getSessionStart,
  getSessionSuccess,
  getSessionFailure,
  clearError,
  resetAuth,
  updateUserProfile,
} = authSlice.actions;

export default authSlice.reducer;
