import { createSlice } from '@reduxjs/toolkit';
import {
  initialGymData,
  initialMembers,
  initialCheckIns,
  initialPlans,
  initialTrainers,
} from '../../utils/mockOwnerData';

const initialState = {
  gymProfile: initialGymData,
  members: initialMembers,
  checkIns: initialCheckIns,
  plans: initialPlans,
  trainers: initialTrainers,
  liveOccupancy: initialGymData.currentOccupancy,
  capacity: initialGymData.floorCapacity,
};

export const gymSlice = createSlice({
  name: 'gym',
  initialState,
  reducers: {
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
});

export const {
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
