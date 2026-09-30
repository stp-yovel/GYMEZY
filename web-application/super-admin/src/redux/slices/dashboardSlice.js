import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../services/apiClient';

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin/dashboard-stats', { params: filters });
      return response.data?.data || {};
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch dashboard statistics'
      );
    }
  }
);

const initialState = {
  stats: {
    totalGmv: 0,
    activeGyms: 0,
    totalGyms: 0,
    activeGymsPct: 0,
    completedWorkouts: 0,
    completionRate: 0,
    pendingApprovalsCount: 0,
    registeredGyms: {
      total: 0,
      active: 0,
      inactive: 0,
      new30d: 0,
    },
    bookings: {
      total: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      noShow: 0,
    },
    subscriptionShare: {
      hybrid: 0,
      appOnly: 0,
      gms: 0,
      listing: 0,
    },
    registeredUsers: 0,
    totalAppOpens: 0,
    completedSessions: 0,
    revenueMonthly: [],
    topGyms: [],
    pendingApprovals: [],
    recentActivities: [],
    systemHealth: {
      apiUptime: 100,
      paymentGateway: 100,
      notificationEngine: 100,
      backendStatus: 'Online',
      databaseStatus: 'Connected',
    },
  },
  loading: false,
  error: null,
  lastUpdated: null,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = {
          ...state.stats,
          ...action.payload,
          registeredGyms: {
            ...state.stats.registeredGyms,
            ...(action.payload.registeredGyms || {}),
          },
          bookings: {
            ...state.stats.bookings,
            ...(action.payload.bookings || {}),
          },
          subscriptionShare: {
            ...state.stats.subscriptionShare,
            ...(action.payload.subscriptionShare || {}),
          },
          systemHealth: {
            ...state.stats.systemHealth,
            ...(action.payload.systemHealth || {}),
          },
        };
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
