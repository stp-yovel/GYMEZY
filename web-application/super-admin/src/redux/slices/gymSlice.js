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

const loadInitialGyms = () => {
  try {
    const saved = localStorage.getItem('gymezy_gyms_fleet');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Fallback to empty list
  }
  return [];
};

const initialState = {
  gyms: loadInitialGyms(),
  selectedGym: null,
  filterStatus: 'All',
  filterSubscription: 'All',
  searchQuery: '',
  loading: false,
  error: null,
};

const saveToLocalStorage = (gyms) => {
  try {
    localStorage.setItem('gymezy_gyms_fleet', JSON.stringify(gyms));
  } catch {
    // Ignore storage quota errors
  }
};

export const gymSlice = createSlice({
  name: 'gyms',
  initialState,
  reducers: {
    setGyms: (state, action) => {
      state.gyms = action.payload || [];
      saveToLocalStorage(state.gyms);
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
      saveToLocalStorage(state.gyms);
    },

    updateGym: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.gyms.findIndex((g) => g.id === id);
      if (index !== -1) {
        state.gyms[index] = {
          ...state.gyms[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        saveToLocalStorage(state.gyms);
      }
    },

    deleteGym: (state, action) => {
      state.gyms = state.gyms.filter((g) => g.id !== action.payload);
      saveToLocalStorage(state.gyms);
    },

    approveGym: (state, action) => {
      const index = state.gyms.findIndex((g) => g.id === action.payload);
      if (index !== -1) {
        state.gyms[index].approvalStatus = 'Approved';
        state.gyms[index].status = 'Active';
        state.gyms[index].changesCount = 0;
        saveToLocalStorage(state.gyms);
      }
    },

    rejectGym: (state, action) => {
      const { id, reason } = action.payload;
      const index = state.gyms.findIndex((g) => g.id === id);
      if (index !== -1) {
        state.gyms[index].approvalStatus = 'Rejected';
        state.gyms[index].rejectionReason = reason;
        saveToLocalStorage(state.gyms);
      }
    },

    setGymStatus: (state, action) => {
      const { id, status, approvalStatus } = action.payload;
      const index = state.gyms.findIndex((g) => g.id === id);
      if (index !== -1) {
        if (status) state.gyms[index].status = status;
        if (approvalStatus) state.gyms[index].approvalStatus = approvalStatus;
        saveToLocalStorage(state.gyms);
      }
    },

    setSelectedGym: (state, action) => {
      state.selectedGym = action.payload;
    },

    resetGymsFleet: (state) => {
      state.gyms = [];
      saveToLocalStorage([]);
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
        saveToLocalStorage(state.gyms);
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
