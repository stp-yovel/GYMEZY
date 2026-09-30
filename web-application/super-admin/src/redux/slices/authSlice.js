import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiClient';

/**
 * Async thunk for authenticating Super Admin credentials
 */
export const loginSuperAdmin = createAsyncThunk(
  'auth/loginSuperAdmin',
  async ({ identifier, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/login', {
        identifier,
        password,
      });

      if (response?.success && response?.data) {
        return response.data;
      }
      return rejectWithValue(response?.message || 'Authentication failed.');
    } catch (error) {
      return rejectWithValue(
        error.message || 'Unable to connect to server. Please check your network.'
      );
    }
  }
);

/**
 * Async thunk to verify current session and retrieve profile
 */
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/auth/me');
      if (response?.success && response?.data) {
        return response.data;
      }
      return rejectWithValue(response?.message || 'Session expired.');
    } catch (error) {
      return rejectWithValue(error.message || 'Session invalid.');
    }
  }
);

/**
 * Async thunk to log out and clear server cookie
 */
export const logoutSuperAdmin = createAsyncThunk(
  'auth/logoutSuperAdmin',
  async (_, { dispatch }) => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.warn('Logout warning:', err.message);
    } finally {
      dispatch(authSlice.actions.logout());
    }
  }
);

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  initialized: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
      state.loading = false;
      state.initialized = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.loading = false;
      state.initialized = true;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Thunk Cases
      .addCase(loginSuperAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginSuperAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
        state.initialized = true;
      })
      .addCase(loginSuperAdmin.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.initialized = true;
      })

      // Fetch Current User Cases
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.initialized = true;
      });
  },
});

export const { loginSuccess, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
