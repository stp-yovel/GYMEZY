import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class MembershipItem {
  final String id;
  final String customerId;
  final String gymName;
  final String gymLocation;
  final String gymImageUrl;
  final String planName; // 'Monthly', 'Quarterly', 'Half Yearly', 'Annual'
  final String durationDays; // '30 Days', '90 Days', '180 Days', '365 Days'
  final double amountPaid;
  final String startDate;
  final String endDate;
  final String paymentMode;
  final String otp;
  String status; // 'Active', 'Expiring Soon', 'Expired'
  final bool hasPersonalTrainer;
  final String? trainerName;
  final String? trainerSpecialty;
  final String? trainerSchedule;
  final double? trainerFee;

  MembershipItem({
    required this.id,
    required this.customerId,
    required this.gymName,
    required this.gymLocation,
    required this.gymImageUrl,
    required this.planName,
    required this.durationDays,
    required this.amountPaid,
    required this.startDate,
    required this.endDate,
    required this.paymentMode,
    required this.otp,
    this.status = 'Active',
    this.hasPersonalTrainer = false,
    this.trainerName,
    this.trainerSpecialty,
    this.trainerSchedule,
    this.trainerFee,
  });

  MembershipItem copyWith({
    String? status,
    String? startDate,
    String? endDate,
  }) {
    return MembershipItem(
      id: id,
      customerId: customerId,
      gymName: gymName,
      gymLocation: gymLocation,
      gymImageUrl: gymImageUrl,
      planName: planName,
      durationDays: durationDays,
      amountPaid: amountPaid,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      paymentMode: paymentMode,
      otp: otp,
      status: status ?? this.status,
      hasPersonalTrainer: hasPersonalTrainer,
      trainerName: trainerName,
      trainerSpecialty: trainerSpecialty,
      trainerSchedule: trainerSchedule,
      trainerFee: trainerFee,
    );
  }
}
