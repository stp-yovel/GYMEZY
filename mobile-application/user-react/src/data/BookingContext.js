import React, { createContext, useContext, useState, useMemo } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [memberships, setMemberships] = useState([]);

  const addBooking = (item) => {
    setBookings((prev) => [item, ...prev]);
  };

  const updateBooking = (updated) => {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const cancelBooking = (bookingId, reason) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'Cancelled',
              cancellationReason: reason,
            }
          : b
      )
    );
  };

  const addMembership = (item) => {
    setMemberships((prev) => [item, ...prev]);
  };

  const updateMembership = (updated) => {
    setMemberships((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const cancelMembership = (membershipId, reason) => {
    setMemberships((prev) =>
      prev.map((m) =>
        m.id === membershipId
          ? {
              ...m,
              status: 'Cancelled',
              cancellationReason: reason,
            }
          : m
      )
    );
  };

  const contextValue = useMemo(
    () => ({
      bookings,
      memberships,
      addBooking,
      updateBooking,
      cancelBooking,
      addMembership,
      updateMembership,
      cancelMembership,
    }),
    [bookings, memberships]
  );

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingRepository = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingRepository must be used within a BookingProvider');
  }
  return context;
};
