import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './general/Login';
import OwnerLayout from './owner/OwnerLayout';
import Dashboard from './owner/Dashboard';
import QrCheckIn from './owner/QrCheckIn';
import Members from './owner/Members';
import Bookings from './owner/Bookings';
import Plans from './owner/Plans';
import Trainers from './owner/Trainers';
import Analytics from './owner/Analytics';
import Settings from './owner/Settings';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Entry Points */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Gym Owner Portal Nested Routes */}
        <Route path="/owner" element={<OwnerLayout />}>
          <Route index element={<Navigate to="/owner/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="checkin" element={<QrCheckIn />} />
          <Route path="members" element={<Members />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="plans" element={<Plans />} />
          <Route path="trainers" element={<Trainers />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
