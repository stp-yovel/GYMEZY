import 'package:flutter/material.dart';

class BookingItem {
  final String id;
  final String customerId;
  final String gymName;
  final String gymLocation;
  final String gymImageUrl;
  final String type; // 'Gym Access', 'Yoga Class', 'Zumba Class', etc.
  final String sessionSubtitle; // 'Gym Access • Per Session', 'Group Class'
  String date;
  String time;
  final String daysBooked;
  final double amountPaid;
  final String paymentMode;
  final String otp;
  String status; // 'Upcoming', 'Completed', 'Cancelled'
  final IconData icon;
  final Color accentColor;
  String? cancellationReason;

  BookingItem({
    required this.id,
    required this.customerId,
    required this.gymName,
    required this.gymLocation,
    required this.gymImageUrl,
    required this.type,
    required this.sessionSubtitle,
    required this.date,
    required this.time,
    required this.daysBooked,
    required this.amountPaid,
    required this.paymentMode,
    required this.otp,
    this.status = 'Upcoming',
    required this.icon,
    required this.accentColor,
    this.cancellationReason,
  });

  BookingItem copyWith({
    String? date,
    String? time,
    String? status,
    String? cancellationReason,
  }) {
    return BookingItem(
      id: id,
      customerId: customerId,
      gymName: gymName,
      gymLocation: gymLocation,
      gymImageUrl: gymImageUrl,
      type: type,
      sessionSubtitle: sessionSubtitle,
      date: date ?? this.date,
      time: time ?? this.time,
      daysBooked: daysBooked,
      amountPaid: amountPaid,
      paymentMode: paymentMode,
      otp: otp,
      status: status ?? this.status,
      icon: icon,
      accentColor: accentColor,
      cancellationReason: cancellationReason ?? this.cancellationReason,
    );
  }
}
