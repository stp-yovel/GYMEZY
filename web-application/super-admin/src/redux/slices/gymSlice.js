import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../services/apiClient';

export const fetchGyms = createAsyncThunk(
  'gyms/fetchGyms',
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/gyms', { params });
      return response.data?.data?.gyms || response.data?.data || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch gyms fleet'
      );
    }
  }
);

export const updateGymStatusApi = createAsyncThunk(
  'gyms/updateGymStatusApi',
  async ({ id, status, approvalStatus, remark, notes, rejectionReason }, { rejectWithValue, dispatch }) => {
    try {
      const payload = {};
      if (status) payload.status = status;
      if (approvalStatus) payload.approvalStatus = approvalStatus;
      const finalRemark = remark !== undefined ? remark : (notes !== undefined ? notes : rejectionReason);
      if (finalRemark !== undefined) {
        payload.remark = finalRemark;
        payload.notes = finalRemark;
        payload.rejectionReason = finalRemark;
      }
      const response = await apiClient.patch(`/gyms/${id}/status`, payload);
      dispatch(fetchGyms());
      return response.data?.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to update gym status'
      );
    }
  }
);

// Clean up any legacy mock data from localStorage
try {
  localStorage.removeItem('gymezy_gyms_fleet');
} catch {
  // Ignore in non-browser environments
}

const initialState = {
  gyms: [],
  selectedGym: null,
  filterStatus: 'All',
  filterSubscription: 'All',
  searchQuery: '',
  loading: false,
  error: null,
};

export const gymSlice = createSlice({
  name: 'gyms',
  initialState,
  reducers: {
    setGyms: (state, action) => {
      state.gyms = action.payload || [];
    },

    addGym: (state, action) => {
      const newGym = {
        rating: 0,
        reviewsCount: 0,
        membersCount: 0,
        monthlyRevenue: 0,
        changesCount: 0,
        status: action.payload.status || 'Active',
        approvalStatus: action.payload.approvalStatus || 'Approved',
        subscriptionStatus: 'Active',
        createdAt: new Date().toISOString(),
        ...action.payload,
      };
      state.gyms.unshift(newGym);
    },

    updateGym: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.gyms.findIndex((g) => g.id === id || g._id === id);
      if (index !== -1) {
        state.gyms[index] = {
          ...state.gyms[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    deleteGym: (state, action) => {
      state.gyms = state.gyms.filter((g) => (g.id || g._id) !== action.payload);
    },

    approveGym: (state, action) => {
      const index = state.gyms.findIndex((g) => (g.id || g._id) === action.payload);
      if (index !== -1) {
        state.gyms[index].approvalStatus = 'Approved';
        state.gyms[index].status = 'Active';
        state.gyms[index].changesCount = 0;
      }
    },

    rejectGym: (state, action) => {
      const { id, reason } = action.payload;
      const index = state.gyms.findIndex((g) => (g.id || g._id) === id);
      if (index !== -1) {
        state.gyms[index].approvalStatus = 'Rejected';
        state.gyms[index].rejectionReason = reason;
      }
    },

    setGymStatus: (state, action) => {
      const { id, status, approvalStatus } = action.payload;
      const index = state.gyms.findIndex((g) => (g.id || g._id) === id);
      if (index !== -1) {
        if (status) state.gyms[index].status = status;
        if (approvalStatus) state.gyms[index].approvalStatus = approvalStatus;
      }
    },

    setSelectedGym: (state, action) => {
      state.selectedGym = action.payload;
    },

    resetGymsFleet: (state) => {
      state.gyms = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGyms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGyms.fulfilled, (state, action) => {
        state.loading = false;
        state.gyms = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchGyms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setGyms,
  addGym,
  updateGym,
  deleteGym,
  approveGym,
  rejectGym,
  setGymStatus,
  setSelectedGym,
  resetGymsFleet,
} = gymSlice.actions;

export default gymSlice.reducer;
