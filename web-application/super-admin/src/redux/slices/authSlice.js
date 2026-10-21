import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiClient';
import { setCookie, deleteCookie } from '../../utils/cookieUtils';

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
        portal: 'super-admin',
        expectedRole: 'SUPER_ADMIN',
      });

      const resPayload = response.data || response;
      if (resPayload?.success && resPayload?.data) {
        const user = resPayload.data;
        if (user.role !== 'SUPER_ADMIN') {
          deleteCookie('authToken');
          return rejectWithValue('Access denied: Only Super Administrators can log in to the Super Admin Portal.');
        }

        if (user.token) {
          setCookie('authToken', user.token, 7);
        }
        return user;
      }
      return rejectWithValue(resPayload?.message || 'Authentication failed.');
    } catch (error) {
      deleteCookie('authToken');
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Unable to connect to server. Please check your network.'
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
      const resPayload = response.data || response;
      if (resPayload?.success && resPayload?.data) {
        const user = resPayload.data;
        if (user.role !== 'SUPER_ADMIN') {
          deleteCookie('authToken');
          return rejectWithValue('Access denied: Super Admin authorization required.');
        }
        return user;
      }
      return rejectWithValue(resPayload?.message || 'Session expired.');
    } catch (error) {
      deleteCookie('authToken');
      return rejectWithValue(error.response?.data?.message || error.message || 'Session invalid.');
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
      deleteCookie('authToken');
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
