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
    setMemberships((prev) =>
      prev.map((m) =>
        (updated._id && m._id && String(m._id) === String(updated._id)) ||
        (m.id && updated.id && String(m.id) === String(updated.id))
          ? updated
          : m
      )
    );
  };

  const cancelMembership = (membershipId, reason) => {
    setMemberships((prev) =>
      prev.map((m) =>
        m.id === membershipId ||
        (m._id && String(m._id) === String(membershipId)) ||
        m.membershipId === membershipId
          ? {
              ...m,
              status: 'Cancelled',
              cancellationReason: reason,
            }
          : m
      )
    );
  };

  const setAllMemberships = (items) => {
    setMemberships(Array.isArray(items) ? items : []);
  };

  const contextValue = useMemo(
    () => ({
      bookings,
      memberships,
      addBooking,
      updateBooking,
      cancelBooking,
      addMembership,
      setAllMemberships,
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
