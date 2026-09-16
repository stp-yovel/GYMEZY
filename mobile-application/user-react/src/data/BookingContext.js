import React, { createContext, useContext, useState } from 'react';
import { BookingItem } from '../models/BookingItem';
import { MembershipItem } from '../models/MembershipItem';
import { AppColors } from '../theme/appTheme';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([
    new BookingItem({
      id: 'FSB123456',
      customerId: 'CUST789012',
      gymName: 'FitZone Gym',
      gymLocation: 'Indiranagar, Bangalore',
      gymImageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
      type: 'Gym Access',
      sessionSubtitle: 'Gym Access • Per Session',
      date: 'Tue, 21 May 2025',
      time: '6:00 AM - 7:00 AM',
      daysBooked: '1 Day (Single Session)',
      amountPaid: 199.0,
      paymentMode: 'UPI',
      otp: '642189',
      status: 'Upcoming',
      iconName: 'fitness-center',
      accentColor: AppColors.primaryColor,
    }),
    new BookingItem({
      id: 'YSB654321',
      customerId: 'CUST789012',
      gymName: 'Yoga Class',
      gymLocation: 'FitZone Yoga Studio',
      gymImageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop',
      type: 'Yoga Class',
      sessionSubtitle: 'Group Class',
      date: 'Mon, 26 May - Fri, 30 May 2025',
      time: 'Mon, Fri • 4:00 PM - 6:00 PM',
      daysBooked: '5 Days Batch',
      amountPaid: 2499.0,
      paymentMode: 'UPI',
      otp: '891423',
      status: 'Upcoming',
      iconName: 'self-improvement',
      accentColor: '#8B5CF6',
    }),
    new BookingItem({
      id: 'ZMB789012',
      customerId: 'CUST789012',
      gymName: 'Zumba Class',
      gymLocation: 'PowerHouse Studio',
      gymImageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop',
      type: 'Zumba Class',
      sessionSubtitle: 'Group Class',
      date: 'Sat, 24 May 2025',
      time: '7:00 AM - 8:00 AM',
      daysBooked: '1 Day (Single Session)',
      amountPaid: 249.0,
      paymentMode: 'Card',
      otp: '314958',
      status: 'Upcoming',
      iconName: 'music-note',
      accentColor: '#EC4899',
    }),
    new BookingItem({
      id: 'FSB998811',
      customerId: 'CUST789012',
      gymName: 'PowerHouse Gym',
      gymLocation: 'Koramangala, Bangalore',
      gymImageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=600&auto=format&fit=crop',
      type: 'Gym Access',
      sessionSubtitle: 'Gym Access • Weekly Plan',
      date: 'Wed, 14 May 2025',
      time: '7:00 AM - 8:30 AM',
      daysBooked: '7 Days Pass',
      amountPaid: 999.0,
      paymentMode: 'UPI',
      otp: '721094',
      status: 'Completed',
      iconName: 'fitness-center',
      accentColor: AppColors.secondaryColor,
    }),
  ]);

  const [memberships, setMemberships] = useState([
    new MembershipItem({
      id: 'MBR123456',
      customerId: 'CUST789012',
      gymName: 'FitZone Gym',
      gymLocation: 'Indiranagar, Bangalore',
      gymImageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
      planName: 'Annual Membership',
      durationDays: '365 Days',
      amountPaid: 11999.0,
      startDate: '21 May 2025',
      endDate: '20 May 2026',
      paymentMode: 'UPI',
      otp: '829410',
      status: 'Active',
    }),
    new MembershipItem({
      id: 'MBR654321',
      customerId: 'CUST789012',
      gymName: 'PowerHouse Gym',
      gymLocation: 'Koramangala, Bangalore',
      gymImageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=600&auto=format&fit=crop',
      planName: 'Quarterly Membership',
      durationDays: '86 Days',
      amountPaid: 3999.0,
      startDate: '15 May 2025',
      endDate: '15 Aug 2025',
      paymentMode: 'UPI',
      otp: '419823',
      status: 'Active',
    }),
    new MembershipItem({
      id: 'MBR778899',
      customerId: 'CUST789012',
      gymName: 'FitZone Gym',
      gymLocation: 'Indiranagar, Bangalore',
      gymImageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
      planName: 'Monthly Membership',
      durationDays: '0 Days',
      amountPaid: 1499.0,
      startDate: '10 Mar 2025',
      endDate: '10 Apr 2025',
      paymentMode: 'UPI',
      otp: '556677',
      status: 'Completed',
    }),
    new MembershipItem({
      id: 'MBR334455',
      customerId: 'CUST789012',
      gymName: 'Olympic Fitness',
      gymLocation: 'HSR Layout, Bangalore',
      gymImageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600&auto=format&fit=crop',
      planName: 'Half Yearly Membership',
      durationDays: '0 Days',
      amountPaid: 6999.0,
      startDate: '01 Sep 2024',
      endDate: '01 Mar 2025',
      paymentMode: 'Card',
      otp: '223344',
      status: 'Cancelled',
    }),
  ]);

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

  return (
    <BookingContext.Provider
      value={{
        bookings,
        memberships,
        addBooking,
        updateBooking,
        cancelBooking,
        addMembership,
      }}
    >
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
