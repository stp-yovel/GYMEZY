import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: true,
  user: {
    name: 'Super Administrator',
    email: 'admin@gymezy.com',
    role: 'SUPER_ADMIN',
    permissions: ['ALL'],
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
