import 'package:flutter/material.dart';
import '../models/booking_item.dart';
import '../models/membership_item.dart';
import '../theme/app_theme.dart';

class BookingRepository extends ChangeNotifier {
  static final BookingRepository _instance = BookingRepository._internal();
  static BookingRepository get instance => _instance;

  BookingRepository._internal() {
    _initDefaultData();
  }

  final List<BookingItem> _bookings = [];
  final List<MembershipItem> _memberships = [];

  List<BookingItem> get bookings => List.unmodifiable(_bookings);
  List<MembershipItem> get memberships => List.unmodifiable(_memberships);

  void _initDefaultData() {
    _bookings.addAll([
      BookingItem(
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
        icon: Icons.fitness_center_rounded,
        accentColor: AppTheme.primaryColor,
      ),
      BookingItem(
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
        icon: Icons.self_improvement_rounded,
        accentColor: const Color(0xFF8B5CF6),
      ),
      BookingItem(
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
        icon: Icons.music_note_rounded,
        accentColor: const Color(0xFFEC4899),
      ),
      BookingItem(
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
        icon: Icons.fitness_center_rounded,
        accentColor: AppTheme.secondaryColor,
      ),
    ]);

    _memberships.addAll([
      MembershipItem(
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
      ),
      MembershipItem(
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
      ),
      MembershipItem(
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
      ),
      MembershipItem(
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
      ),
    ]);
  }

  void addBooking(BookingItem item) {
    _bookings.insert(0, item);
    notifyListeners();
  }

  void updateBooking(BookingItem updated) {
    final index = _bookings.indexWhere((b) => b.id == updated.id);
    if (index != -1) {
      _bookings[index] = updated;
      notifyListeners();
    }
  }

  void cancelBooking(String bookingId, String reason) {
    final index = _bookings.indexWhere((b) => b.id == bookingId);
    if (index != -1) {
      _bookings[index] = _bookings[index].copyWith(
        status: 'Cancelled',
        cancellationReason: reason,
      );
      notifyListeners();
    }
  }

  void addMembership(MembershipItem item) {
    _memberships.insert(0, item);
    notifyListeners();
  }
}
