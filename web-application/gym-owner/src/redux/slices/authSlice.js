import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: true, // Default to logged in as demo owner for immediate access, or false if logged out
  user: {
    name: 'Vikram Sethi',
    email: 'owner@fitzone.com',
    role: 'GYM_OWNER',
    gymId: 'GYM-FZ-01',
    gymName: 'FitZone Gym',
    branch: 'Anna Nagar, Chennai',
  },
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { loginSuccess, logout, setError } = authSlice.actions;
export default authSlice.reducer;
