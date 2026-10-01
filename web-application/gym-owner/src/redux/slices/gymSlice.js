import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from './authSlice';

const getInitialGymProfile = () => {
  try {
    const raw = localStorage.getItem('gymezy_user');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.gym) {
        const gym = parsed.gym;
        return {
          id: gym.id || gym._id,
          partnerId: gym.partnerId || 'GYM1',
          name: gym.name || 'My Gym',
          logo: gym.logo?.fileData || (typeof gym.logo === 'string' ? gym.logo : '') || gym.coverPhoto?.fileData || (typeof gym.coverPhoto === 'string' ? gym.coverPhoto : '') || gym.image || '',
          coverPhoto: gym.coverPhoto?.fileData || (typeof gym.coverPhoto === 'string' ? gym.coverPhoto : '') || gym.logo?.fileData || (typeof gym.logo === 'string' ? gym.logo : '') || gym.image || '',
          branch: gym.city ? `${gym.area || gym.city}, ${gym.city}` : gym.fullAddress || '',
          city: gym.city || '',
          fullAddress: gym.fullAddress || gym.address || '',
          ownerName: parsed.fullName || parsed.name || 'Gym Owner',
          email: gym.email || parsed.email || '',
          phone: gym.phone || parsed.phone || '',
          openingHours: gym.openingHours
            ? `${gym.openingHours.weekdayOpen || '05:30 AM'} - ${gym.openingHours.weekdayClose || '10:30 PM'}`
            : '05:30 AM - 10:30 PM',
          floorCapacity: gym.maxFloorCapacity || 50,
          currentOccupancy: 0,
          rating: gym.rating || 5.0,
          totalReviews: gym.reviewsCount || 0,
          singleSessionPrice: gym.singleSessionPrice || 199,
          subscriptionType: gym.subscriptionType || 'Hybrid Plan',
          subscriptionStatus: gym.approvalStatus || gym.status || 'Active',
          facilities: gym.facilities || [],
          amenities: gym.amenities || [],
          workouts: gym.workouts || [],
          trainers: gym.trainers || [],
          monthlyRevenue: gym.monthlyRevenue || 0,
          membersCount: gym.membersCount || 0,
        };
      }
    }
  } catch {
    // fallback
  }
  return null;
};

const initialGym = getInitialGymProfile();

const initialState = {
  gymProfile: initialGym,
  members: [],
  checkIns: [],
  bookings: [],
  plans: [],
  trainers: initialGym?.trainers || [],
  liveOccupancy: 0,
  capacity: initialGym?.floorCapacity || 50,
};

export const gymSlice = createSlice({
  name: 'gym',
  initialState,
  reducers: {
    setGymProfile: (state, action) => {
      state.gymProfile = { ...(state.gymProfile || {}), ...action.payload };
      if (action.payload.floorCapacity) {
        state.capacity = action.payload.floorCapacity;
      }
    },
    addMember: (state, action) => {
      state.members.unshift(action.payload);
    },
    updateMember: (state, action) => {
      const idx = state.members.findIndex((m) => m.id === action.payload.id);
      if (idx !== -1) {
        state.members[idx] = { ...state.members[idx], ...action.payload };
      }
    },
    deleteMember: (state, action) => {
      state.members = state.members.filter((m) => m.id !== action.payload);
    },
    recordCheckIn: (state, action) => {
      state.checkIns.unshift(action.payload);
      state.liveOccupancy = Math.min(state.capacity, state.liveOccupancy + 1);
    },
    recordCheckOut: (state) => {
      state.liveOccupancy = Math.max(0, state.liveOccupancy - 1);
    },
    addPlan: (state, action) => {
      state.plans.push(action.payload);
    },
    updatePlan: (state, action) => {
      const idx = state.plans.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) {
        state.plans[idx] = { ...state.plans[idx], ...action.payload };
      }
    },
    deletePlan: (state, action) => {
      state.plans = state.plans.filter((p) => p.id !== action.payload);
    },
    addTrainer: (state, action) => {
      state.trainers.push(action.payload);
    },
    updateGymProfile: (state, action) => {
      state.gymProfile = { ...state.gymProfile, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      const user = action.payload.user;
      if (user?.gym) {
        const gym = user.gym;
        state.gymProfile = {
          id: gym.id || gym._id,
          partnerId: gym.partnerId || 'GYM1',
          name: gym.name || 'My Gym',
          logo: gym.logo?.fileData || (typeof gym.logo === 'string' ? gym.logo : '') || gym.coverPhoto?.fileData || (typeof gym.coverPhoto === 'string' ? gym.coverPhoto : '') || gym.image || '',
          coverPhoto: gym.coverPhoto?.fileData || (typeof gym.coverPhoto === 'string' ? gym.coverPhoto : '') || gym.logo?.fileData || (typeof gym.logo === 'string' ? gym.logo : '') || gym.image || '',
          branch: gym.city ? `${gym.area || gym.city}, ${gym.city}` : gym.fullAddress || '',
          city: gym.city || '',
          fullAddress: gym.fullAddress || gym.address || '',
          ownerName: user.fullName || user.name || 'Gym Owner',
          email: gym.email || user.email || '',
          phone: gym.phone || user.phone || '',
          openingHours: gym.openingHours
            ? `${gym.openingHours.weekdayOpen || '05:30 AM'} - ${gym.openingHours.weekdayClose || '10:30 PM'}`
            : '05:30 AM - 10:30 PM',
          floorCapacity: gym.maxFloorCapacity || 50,
          currentOccupancy: 0,
          rating: gym.rating || 5.0,
          totalReviews: gym.reviewsCount || 0,
          singleSessionPrice: gym.singleSessionPrice || 199,
          subscriptionType: gym.subscriptionType || 'Hybrid Plan',
          subscriptionStatus: gym.approvalStatus || gym.status || 'Active',
          facilities: gym.facilities || [],
          amenities: gym.amenities || [],
          workouts: gym.workouts || [],
          trainers: gym.trainers || [],
          monthlyRevenue: gym.monthlyRevenue || 0,
          membersCount: gym.membersCount || 0,
        };
        state.capacity = gym.maxFloorCapacity || 50;
        state.trainers = gym.trainers || [];
      }
    });
  },
});

export const {
  setGymProfile,
  addMember,
  updateMember,
  deleteMember,
  recordCheckIn,
  recordCheckOut,
  addPlan,
  updatePlan,
  deletePlan,
  addTrainer,
  updateGymProfile,
} = gymSlice.actions;

export default gymSlice.reducer;
