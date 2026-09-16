import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../models/gym.dart';
import '../models/membership_item.dart';
import '../data/booking_repository.dart';
import '../theme/app_theme.dart';
import '../widgets/scaffoldmessage.dart';
import '../widgets/custom_calendar.dart';
import 'membership_details_screen.dart';

class BuyMembershipScreen extends StatefulWidget {
  final Gym gym;
  final bool initialWithTrainer;

  const BuyMembershipScreen({
    super.key,
    required this.gym,
    this.initialWithTrainer = false,
  });

  @override
  State<BuyMembershipScreen> createState() => _BuyMembershipScreenState();
}

class _BuyMembershipScreenState extends State<BuyMembershipScreen> {
  int _currentStep = 1;
  late bool _withTrainer;

  // Selected Plan
  String _selectedPlan = 'Annual';
  final Map<String, Map<String, dynamic>> _plans = {
    'Monthly': {
      'price': 1299.0,
      'duration': '30 Days',
      'label': '₹1,299 / month',
      'sublabel': 'Valid for 30 days',
      'savings': null,
      'badge': null,
    },
    'Quarterly': {
      'price': 3299.0,
      'duration': '90 Days',
      'label': '₹3,299 / 3 months',
      'sublabel': 'Valid for 90 days',
      'savings': 'Save ₹598',
      'badge': null,
    },
    'Half Yearly': {
      'price': 5999.0,
      'duration': '180 Days',
      'label': '₹5,999 / 6 months',
      'sublabel': 'Valid for 180 days',
      'savings': 'Save ₹2,394',
      'badge': null,
    },
    'Annual': {
      'price': 11999.0,
      'duration': '365 Days',
      'label': '₹11,999 / year',
      'sublabel': 'Valid for 365 days',
      'savings': 'Save ₹7,788',
      'badge': 'Best Value',
    },
  };

  // Trainer Selection
  String _trainerGoal = 'Weight Loss';
  String? _selectedTrainer = 'Rohit Sharma';
  double _trainerFee = 999.0;
  String _selectedSlot = '5:00 PM - 6:00 PM';
  final String _trainerSchedule = 'Mon, Wed, Fri • 5:00 PM - 6:00 PM';

  final List<Map<String, dynamic>> _trainers = [
    {
      'name': 'Rohit Sharma',
      'exp': '8 Yrs Exp',
      'specialty': 'Strength Training • Weight Loss',
      'rating': 4.8,
      'reviews': 124,
      'price': 999.0,
      'image': 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=300&auto=format&fit=crop',
    },
    {
      'name': 'Sneha Iyer',
      'exp': '6 Yrs Exp',
      'specialty': 'Weight Loss • HIIT',
      'rating': 4.6,
      'reviews': 98,
      'price': 899.0,
      'image': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
    },
    {
      'name': 'Anjali Mehta',
      'exp': '5 Yrs Exp',
      'specialty': 'HIIT & Strength',
      'rating': 4.7,
      'reviews': 76,
      'price': 899.0,
      'image': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    },
    {
      'name': 'No Personal Trainer',
      'exp': '',
      'specialty': 'I will train on my own',
      'rating': 0.0,
      'reviews': 0,
      'price': 0.0,
      'image': null,
    },
  ];

  // Dates
  late DateTime _startDate;
  late DateTime _endDate;

  // Payment
  String _selectedPaymentMethod = 'UPI';
  bool _isProcessing = false;
  MembershipItem? _confirmedMembership;

  @override
  void initState() {
    super.initState();
    _withTrainer = widget.initialWithTrainer;
    _startDate = DateTime.now().add(const Duration(days: 1));
    _calculateEndDate();
  }

  void _calculateEndDate() {
    final days = _selectedPlan == 'Monthly'
        ? 30
        : _selectedPlan == 'Quarterly'
            ? 90
            : _selectedPlan == 'Half Yearly'
                ? 180
                : 365;
    _endDate = _startDate.add(Duration(days: days));
  }

  int get _totalSteps => _withTrainer ? 6 : 4;

  double get _planPrice => (_plans[_selectedPlan]?['price'] as double?) ?? 11999.0;
  double get _actualTrainerFee => (_withTrainer && _selectedTrainer != 'No Personal Trainer') ? _trainerFee : 0.0;
  double get _totalAmount => _planPrice + _actualTrainerFee;

  String _formatDate(DateTime dt) {
    final months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return "${dt.day} ${months[dt.month - 1]} ${dt.year}";
  }

  void _nextStep() {
    if (_currentStep < _totalSteps) {
      setState(() => _currentStep++);
    } else {
      _processMembershipPayment();
    }
  }

  void _prevStep() {
    if (_currentStep > 1) {
      setState(() => _currentStep--);
    } else {
      Navigator.pop(context);
    }
  }

  void _processMembershipPayment() async {
    setState(() => _isProcessing = true);
    await Future.delayed(const Duration(milliseconds: 900));
    if (!mounted) return;

    final membershipId = "MBR${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}";
    final newMembership = MembershipItem(
      id: membershipId,
      customerId: 'CUST789012',
      gymName: widget.gym.name,
      gymLocation: widget.gym.location,
      gymImageUrl: widget.gym.imageUrl,
      planName: "$_selectedPlan Membership",
      durationDays: "${_plans[_selectedPlan]?['duration']}",
      amountPaid: _totalAmount,
      startDate: _formatDate(_startDate),
      endDate: _formatDate(_endDate),
      paymentMode: _selectedPaymentMethod,
      otp: (100000 + DateTime.now().millisecond * 899).toInt().toString().padLeft(6, '8'),
      status: 'Active',
      hasPersonalTrainer: _withTrainer && _selectedTrainer != 'No Personal Trainer',
      trainerName: _withTrainer ? _selectedTrainer : null,
      trainerSchedule: _withTrainer ? _trainerSchedule : null,
      trainerFee: _actualTrainerFee,
    );

    // Sync into the centralized repository so every page sees it in real time!
    BookingRepository.instance.addMembership(newMembership);

    setState(() {
      _isProcessing = false;
      _confirmedMembership = newMembership;
    });
  }

  void _showTrainerModal(Map<String, dynamic> trainer) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _AboutTrainerModal(trainer: trainer),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = AppTheme.isDark(context);
    final backgroundColor = AppTheme.getBackgroundColor(context);
    final cardColor = AppTheme.getCardColor(context);
    final textColor = AppTheme.getTextColor(context);
    final subtitleColor = AppTheme.getSubtitleColor(context);
    final borderColor = AppTheme.getBorderColor(context);
    final primaryAccent = AppTheme.getAccentColor(context);
    final primaryButtonColor = isDark ? const Color(0xFF1D4ED8) : AppTheme.primaryColor;

    // If membership confirmed, render confirmation view
    if (_confirmedMembership != null) {
      return _buildConfirmationScreen(context, _confirmedMembership!, cardColor, textColor, subtitleColor, borderColor, isDark);
    }

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: backgroundColor,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, size: 18, color: textColor),
          onPressed: _prevStep,
        ),
        title: Text(
          _getStepTitle(),
          style: TextStyle(
            color: textColor,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // Smooth Animated Step Progress Bar
          _AnimatedStepProgressBar(
            currentStep: _currentStep,
            totalSteps: _totalSteps,
            activeColor: primaryAccent,
            inactiveColor: isDark ? Colors.white12 : const Color(0xFFE2E8F0),
          ),

          // Scrollable Step Content
          Expanded(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(20, 10, 20, 100),
              child: _buildCurrentStepContent(cardColor, textColor, subtitleColor, borderColor, primaryAccent, isDark),
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: EdgeInsets.fromLTRB(20, 14, 20, MediaQuery.of(context).padding.bottom + 14),
        decoration: const BoxDecoration(
          color: Colors.transparent,
        ),
        child: SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton(
            onPressed: _isProcessing ? null : _nextStep,
            style: ElevatedButton.styleFrom(
              backgroundColor: primaryButtonColor,
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: _isProcessing
                ? const SizedBox(
                    height: 22,
                    width: 22,
                    child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white),
                  )
                : Text(
                    _currentStep == _totalSteps ? "Pay ₹${_totalAmount.toInt()}" : "Continue",
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                  ),
          ),
        ),
      ),
    );
  }

  String _getStepTitle() {
    if (!_withTrainer) {
      switch (_currentStep) {
        case 1:
          return "Buy Membership";
        case 2:
          return "Review & Confirm";
        case 3:
          return "Select Start Date";
        case 4:
          return "Payment";
        default:
          return "Buy Membership";
      }
    } else {
      switch (_currentStep) {
        case 1:
          return "Buy Membership";
        case 2:
          return "Select Personal Trainer";
        case 3:
          return "Trainer Availability";
        case 4:
          return "Select Start Date";
        case 5:
          return "Review & Confirm";
        case 6:
          return "Payment";
        default:
          return "Buy Membership";
      }
    }
  }

  Widget _buildCurrentStepContent(Color cardColor, Color textColor, Color subtitleColor, Color borderColor, Color primaryAccent, bool isDark) {
    if (!_withTrainer) {
      switch (_currentStep) {
        case 1:
          return _buildStep1Plans(cardColor, textColor, subtitleColor, borderColor, primaryAccent, isDark);
        case 2:
          return _buildStepReviewWithoutTrainer(cardColor, textColor, subtitleColor, borderColor, isDark);
        case 3:
          return _buildStepStartDate(cardColor, textColor, subtitleColor, borderColor, primaryAccent, isDark);
        case 4:
          return _buildStepPayment(cardColor, textColor, subtitleColor, borderColor, primaryAccent, isDark);
        default:
          return const SizedBox.shrink();
      }
    } else {
      switch (_currentStep) {
        case 1:
          return _buildStep1Plans(cardColor, textColor, subtitleColor, borderColor, primaryAccent, isDark);
        case 2:
          return _buildStep2TrainerSelection(cardColor, textColor, subtitleColor, borderColor, primaryAccent, isDark);
        case 3:
          return _buildStep3TrainerAvailability(cardColor, textColor, subtitleColor, borderColor, primaryAccent, isDark);
        case 4:
          return _buildStepStartDate(cardColor, textColor, subtitleColor, borderColor, primaryAccent, isDark);
        case 5:
          return _buildStep5ReviewWithTrainer(cardColor, textColor, subtitleColor, borderColor, isDark);
        case 6:
          return _buildStepPayment(cardColor, textColor, subtitleColor, borderColor, primaryAccent, isDark);
        default:
          return const SizedBox.shrink();
      }
    }
  }

  // ==========================================
  // STEP 1: CHOOSE YOUR PLAN
  // ==========================================
  Widget _buildStep1Plans(Color cardColor, Color textColor, Color subtitleColor, Color borderColor, Color primaryAccent, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Choose Your Plan",
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: textColor),
        ),
        const SizedBox(height: 4),
        Text(
          "Pick a plan that fits your fitness goals",
          style: TextStyle(fontSize: 13, color: subtitleColor),
        ),
        const SizedBox(height: 18),

        // Plans List
        ..._plans.entries.map((entry) {
          final planKey = entry.key;
          final planData = entry.value;
          final isSelected = _selectedPlan == planKey;

          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedPlan = planKey;
                _calculateEndDate();
              });
            },
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isSelected
                    ? (isDark ? const Color(0xFF1E293B) : const Color(0xFFF0F4FF))
                    : cardColor,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: isSelected ? primaryAccent : borderColor,
                  width: isSelected ? 1.8 : 1,
                ),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? (isDark ? const Color(0xFF3B82F6).withOpacity(0.25) : AppTheme.primaryColor.withOpacity(0.15))
                          : (isDark ? const Color(0xFF262626) : const Color(0xFFF1F5F9)),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Icon(
                      Icons.calendar_month_rounded,
                      color: isSelected ? (isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor) : subtitleColor,
                      size: 22,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              planKey,
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                                color: textColor,
                              ),
                            ),
                            if (planData['badge'] != null) ...[
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(
                                  color: isDark ? const Color(0xFF2563EB) : AppTheme.primaryColor,
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  planData['badge'] as String,
                                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
                                ),
                              ),
                            ],
                          ],
                        ),
                        const SizedBox(height: 3),
                        Text(
                          planData['label'] as String,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: isSelected ? (isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor) : textColor,
                          ),
                        ),
                        Text(
                          planData['sublabel'] as String,
                          style: TextStyle(fontSize: 11.5, color: subtitleColor),
                        ),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Icon(
                        isSelected ? Icons.check_circle_rounded : Icons.radio_button_off_rounded,
                        color: isSelected ? primaryAccent : subtitleColor,
                        size: 22,
                      ),
                      if (planData['savings'] != null) ...[
                        const SizedBox(height: 4),
                        Text(
                          planData['savings'] as String,
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.secondaryColor),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          );
        }),

        const SizedBox(height: 14),

        // Add Personal Trainer Switch
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: cardColor,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: borderColor),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Add Personal Trainer (Optional)",
                      style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: textColor),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      "Get expert guidance and achieve your goals faster",
                      style: TextStyle(fontSize: 11.5, color: subtitleColor),
                    ),
                  ],
                ),
              ),
              Switch(
                value: _withTrainer,
                activeColor: AppTheme.secondaryColor,
                onChanged: (val) => setState(() => _withTrainer = val),
              ),
            ],
          ),
        ),

        const SizedBox(height: 20),

        // Plan Benefits
        Text(
          "Plan Benefits ($_selectedPlan)",
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: textColor),
        ),
        const SizedBox(height: 10),
        _buildBenefitRow(Icons.all_inclusive_rounded, "Access to all gym facilities", textColor),
        _buildBenefitRow(Icons.group_rounded, "Free group workout classes", textColor),
        _buildBenefitRow(Icons.lock_outline_rounded, "Locker and shower facility", textColor),
        _buildBenefitRow(Icons.confirmation_num_outlined, "1 Guest pass per month", textColor),
        _buildBenefitRow(Icons.restaurant_menu_rounded, "Personalized nutrition guidance", textColor),
      ],
    );
  }

  Widget _buildBenefitRow(IconData icon, String text, Color textColor) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.5),
      child: Row(
        children: [
          Icon(icon, size: 16, color: AppTheme.secondaryColor),
          const SizedBox(width: 10),
          Text(text, style: TextStyle(fontSize: 12.5, color: textColor, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }

  // ==========================================
  // STEP 2: SELECT PERSONAL TRAINER (WITH TRAINER)
  // ==========================================
  Widget _buildStep2TrainerSelection(Color cardColor, Color textColor, Color subtitleColor, Color borderColor, Color primaryAccent, bool isDark) {
    final goals = ['Weight Loss', 'Weight Gain', 'HIIT', 'Strength Training'];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Select Personal Trainer",
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: textColor),
        ),
        const SizedBox(height: 4),
        Text(
          "Choose trainer based on your fitness goal",
          style: TextStyle(fontSize: 13, color: subtitleColor),
        ),
        const SizedBox(height: 14),

        // Goal Chips
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: goals.map((g) {
              final isSel = _trainerGoal == g;
              return GestureDetector(
                onTap: () => setState(() => _trainerGoal = g),
                child: Container(
                  margin: const EdgeInsets.only(right: 8),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: isSel ? (isDark ? const Color(0xFF2563EB) : AppTheme.primaryColor) : (isDark ? const Color(0xFF262626) : const Color(0xFFF1F5F9)),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: isSel ? primaryAccent : borderColor),
                  ),
                  child: Text(
                    g,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: isSel ? Colors.white : textColor,
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),

        const SizedBox(height: 18),
        Text("Top Trainers", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: textColor)),
        const SizedBox(height: 12),

        // Trainer Cards
        ..._trainers.map((t) {
          final isSelected = _selectedTrainer == t['name'];
          final isNone = t['name'] == 'No Personal Trainer';

          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedTrainer = t['name'] as String;
                _trainerFee = t['price'] as double;
              });
            },
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: isSelected
                    ? (isDark ? const Color(0xFF1E293B) : const Color(0xFFF0F4FF))
                    : cardColor,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: isSelected ? primaryAccent : borderColor, width: isSelected ? 1.8 : 1),
              ),
              child: Row(
                children: [
                  if (t['image'] != null)
                    ClipRRect(
                      borderRadius: BorderRadius.circular(14),
                      child: Image.network(
                        t['image'] as String,
                        width: 50,
                        height: 50,
                        fit: BoxFit.cover,
                      ),
                    )
                  else
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF262626) : const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: const Icon(Icons.person_off_rounded, size: 24, color: AppTheme.secondaryColor),
                    ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              t['name'] as String,
                              style: TextStyle(fontSize: 14.5, fontWeight: FontWeight.bold, color: textColor),
                            ),
                            if (!isNone)
                              GestureDetector(
                                onTap: () => _showTrainerModal(t),
                                child: Text(
                                  "About Me",
                                  style: TextStyle(
                                    fontSize: 11.5,
                                    fontWeight: FontWeight.bold,
                                    color: isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor,
                                    decoration: TextDecoration.underline,
                                  ),
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 2),
                        Text(
                          isNone ? t['specialty'] as String : "${t['exp']} • ${t['specialty']}",
                          style: TextStyle(fontSize: 11.5, color: subtitleColor),
                        ),
                        if (!isNone) ...[
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              const Icon(Icons.star_rounded, size: 14, color: Colors.amber),
                              const SizedBox(width: 3),
                              Text("${t['rating']} (${t['reviews']})", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: textColor)),
                              const Spacer(),
                              Text("₹${(t['price'] as double).toInt()} / Month", style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w800, color: AppTheme.secondaryColor)),
                            ],
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }

  // ==========================================
  // STEP 3: TRAINER AVAILABILITY & SLOTS
  // ==========================================
  Widget _buildStep3TrainerAvailability(Color cardColor, Color textColor, Color subtitleColor, Color borderColor, Color primaryAccent, bool isDark) {
    final slots = [
      "6:00 AM - 7:00 AM",
      "7:00 AM - 8:00 AM",
      "5:00 PM - 6:00 PM",
      "6:00 PM - 7:00 PM",
      "7:00 PM - 8:00 PM",
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Trainer Availability",
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: textColor),
        ),
        const SizedBox(height: 14),

        // Trainer Mini Card
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: cardColor,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: borderColor),
          ),
          child: Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.network(
                  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=300&auto=format&fit=crop',
                  width: 48,
                  height: 48,
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(_selectedTrainer ?? 'Rohit Sharma', style: TextStyle(fontSize: 14.5, fontWeight: FontWeight.bold, color: textColor)),
                    Text("Specializes in $_trainerGoal", style: TextStyle(fontSize: 12, color: subtitleColor)),
                  ],
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 20),
        Text("Weekly Schedule", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: textColor)),
        const SizedBox(height: 10),

        // Mon-Sun status pills
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) {
            final isAvailable = day == "Mon" || day == "Wed" || day == "Fri" || day == "Sat";
            return Column(
              children: [
                Text(day, style: TextStyle(fontSize: 11.5, color: subtitleColor)),
                const SizedBox(height: 4),
                Icon(
                  Icons.circle,
                  size: 10,
                  color: isAvailable ? AppTheme.secondaryColor : Colors.grey.shade600,
                ),
              ],
            );
          }).toList(),
        ),

        const SizedBox(height: 22),
        Text("Select Time Slot", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: textColor)),
        const SizedBox(height: 10),

        // Time Slot Chips
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: slots.map((s) {
            final isSel = _selectedSlot == s;
            return ChoiceChip(
              label: Text(s),
              selected: isSel,
              onSelected: (val) {
                if (val) setState(() => _selectedSlot = s);
              },
              selectedColor: isDark ? const Color(0xFF2563EB) : AppTheme.primaryColor,
              backgroundColor: isDark ? const Color(0xFF262626) : const Color(0xFFF1F5F9),
              labelStyle: TextStyle(
                color: isSel ? Colors.white : textColor,
                fontSize: 12,
                fontWeight: isSel ? FontWeight.bold : FontWeight.w500,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: BorderSide(color: isSel ? primaryAccent : borderColor),
              ),
              showCheckmark: false,
            );
          }).toList(),
        ),

        const SizedBox(height: 16),
        Text(
          "Trainer sessions are available on selected days and time slots.",
          style: TextStyle(fontSize: 11.5, color: subtitleColor),
        ),
      ],
    );
  }

  // ==========================================
  // STEP START DATE (CALENDAR)
  // ==========================================
  Widget _buildStepStartDate(Color cardColor, Color textColor, Color subtitleColor, Color borderColor, Color primaryAccent, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Select Start Date",
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: textColor),
        ),
        const SizedBox(height: 4),
        Text(
          "Choose when you want your membership to begin",
          style: TextStyle(fontSize: 13, color: subtitleColor),
        ),
        const SizedBox(height: 18),

        // Monthly Grid Calendar Picker (allows current month + 3 months)
        MonthlyGridCalendar(
          selectedDate: _startDate,
          minDate: DateTime.now().add(const Duration(days: 1)),
          maxMonthsAhead: 3,
          onDateSelected: (day) {
            setState(() {
              _startDate = day;
              _calculateEndDate();
            });
          },
        ),

        const SizedBox(height: 20),

        // Start & End Date summary banner
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppTheme.secondaryColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppTheme.secondaryColor.withOpacity(0.3)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Membership will start on ${_formatDate(_startDate)}",
                style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: AppTheme.secondaryColor),
              ),
              const SizedBox(height: 3),
              Text(
                "(Membership will end on ${_formatDate(_endDate)})",
                style: TextStyle(fontSize: 12, color: subtitleColor),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // ==========================================
  // REVIEW & CONFIRM (WITHOUT TRAINER)
  // ==========================================
  Widget _buildStepReviewWithoutTrainer(Color cardColor, Color textColor, Color subtitleColor, Color borderColor, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Membership Plan", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: subtitleColor)),
        const SizedBox(height: 6),
        Text("$_selectedPlan Plan", style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: textColor)),
        Text("₹${_planPrice.toInt()}", style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.secondaryColor)),
        Text("Valid for ${_plans[_selectedPlan]?['duration']}", style: TextStyle(fontSize: 12, color: subtitleColor)),

        const SizedBox(height: 24),
        Text("Membership Summary", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textColor)),
        const SizedBox(height: 10),

        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: cardColor,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: borderColor),
          ),
          child: Column(
            children: [
              _buildReviewRow("Plan", "$_selectedPlan Plan", textColor, subtitleColor),
              _buildDivider(borderColor),
              _buildReviewRow("Duration", "${_plans[_selectedPlan]?['duration']}", textColor, subtitleColor),
              _buildDivider(borderColor),
              _buildReviewRow("Start Date", _formatDate(_startDate), textColor, subtitleColor),
              _buildDivider(borderColor),
              _buildReviewRow("Total Amount", "₹${_totalAmount.toInt()}", AppTheme.secondaryColor, subtitleColor, isBold: true),
            ],
          ),
        ),
      ],
    );
  }

  // ==========================================
  // REVIEW & CONFIRM (WITH TRAINER)
  // ==========================================
  Widget _buildStep5ReviewWithTrainer(Color cardColor, Color textColor, Color subtitleColor, Color borderColor, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Review your membership details", style: TextStyle(fontSize: 13, color: subtitleColor)),
        const SizedBox(height: 14),

        // Plan Card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: cardColor,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: borderColor),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("$_selectedPlan Membership", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textColor)),
                  Text("${_plans[_selectedPlan]?['duration']}", style: TextStyle(fontSize: 12, color: subtitleColor)),
                ],
              ),
              Text("₹${_planPrice.toInt()}", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: textColor)),
            ],
          ),
        ),

        const SizedBox(height: 14),

        // Personal Trainer Card
        if (_selectedTrainer != 'No Personal Trainer')
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: cardColor,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text("Personal Trainer", style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: subtitleColor)),
                    Text("₹${_trainerFee.toInt()}", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textColor)),
                  ],
                ),
                const SizedBox(height: 8),
                Text(_selectedTrainer ?? 'Rohit Sharma', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textColor)),
                Text("Schedule: $_trainerSchedule", style: TextStyle(fontSize: 12, color: subtitleColor)),
              ],
            ),
          ),

        const SizedBox(height: 20),

        // Summary Card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: cardColor,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: borderColor),
          ),
          child: Column(
            children: [
              _buildReviewRow("Start Date", _formatDate(_startDate), textColor, subtitleColor),
              _buildDivider(borderColor),
              _buildReviewRow(
                "Total Amount",
                "₹${_totalAmount.toInt()}",
                AppTheme.secondaryColor,
                subtitleColor,
                isBold: true,
              ),
            ],
          ),
        ),
      ],
    );
  }

  // ==========================================
  // PAYMENT STEP
  // ==========================================
  Widget _buildStepPayment(Color cardColor, Color textColor, Color subtitleColor, Color borderColor, Color primaryAccent, bool isDark) {
    final methods = [
      {'id': 'UPI', 'title': 'UPI', 'subtitle': 'Pay using any UPI app', 'icon': Icons.account_balance_wallet_outlined},
      {'id': 'Card', 'title': 'Card', 'subtitle': 'Debit / Credit Card', 'icon': Icons.credit_card_outlined},
      {'id': 'NetBanking', 'title': 'Net Banking', 'subtitle': 'All major banks', 'icon': Icons.account_balance_outlined},
      {'id': 'Wallet', 'title': 'Wallet', 'subtitle': 'Pay using wallet', 'icon': Icons.wallet_outlined},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Select Payment Method", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: textColor)),
        const SizedBox(height: 12),

        ...methods.map((m) {
          final isSel = _selectedPaymentMethod == m['id'];
          return GestureDetector(
            onTap: () => setState(() => _selectedPaymentMethod = m['id'] as String),
            child: Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: isSel ? (isDark ? const Color(0xFF1E293B) : const Color(0xFFF0F4FF)) : cardColor,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: isSel ? primaryAccent : borderColor, width: isSel ? 1.5 : 1),
              ),
              child: Row(
                children: [
                  Icon(
                    m['icon'] as IconData,
                    color: isSel ? (isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor) : subtitleColor,
                    size: 22,
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(m['title'] as String, style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: textColor)),
                        Text(m['subtitle'] as String, style: TextStyle(fontSize: 11.5, color: subtitleColor)),
                      ],
                    ),
                  ),
                  Icon(
                    isSel ? Icons.radio_button_checked : Icons.radio_button_off,
                    color: isSel ? primaryAccent : subtitleColor,
                    size: 20,
                  ),
                ],
              ),
            ),
          );
        }),

        const SizedBox(height: 20),
        Text("Price Details", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textColor)),
        const SizedBox(height: 10),

        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: cardColor,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: borderColor),
          ),
          child: Column(
            children: [
              _buildReviewRow("Membership ($_selectedPlan)", "₹${_planPrice.toInt()}", textColor, subtitleColor),
              if (_actualTrainerFee > 0) ...[
                _buildDivider(borderColor),
                _buildReviewRow("Personal Trainer", "₹${_actualTrainerFee.toInt()}", textColor, subtitleColor),
              ],
              _buildDivider(borderColor),
              _buildReviewRow("Total Amount", "₹${_totalAmount.toInt()}", AppTheme.secondaryColor, subtitleColor, isBold: true),
            ],
          ),
        ),
      ],
    );
  }

  // ==========================================
  // CONFIRMATION SCREEN
  // ==========================================
  Widget _buildConfirmationScreen(
    BuildContext context,
    MembershipItem item,
    Color cardColor,
    Color textColor,
    Color subtitleColor,
    Color borderColor,
    bool isDark,
  ) {
    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF121212) : const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        title: Text("Membership Confirmed", style: TextStyle(color: textColor, fontSize: 18, fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            // Success Animated Badge
            Container(
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                color: AppTheme.secondaryColor,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check_rounded, color: Colors.white, size: 50),
            ).animate().scale(duration: 400.ms, curve: Curves.elasticOut),

            const SizedBox(height: 18),
            Text(
              "Your Membership is Confirmed!",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: textColor),
            ),
            const SizedBox(height: 4),
            Text(
              "Thank you for choosing ${widget.gym.name}",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, color: subtitleColor),
            ),

            const SizedBox(height: 24),

            // Receipt Table
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: cardColor,
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: borderColor),
              ),
              child: Column(
                children: [
                  _buildReviewRow("Membership ID", item.id, textColor, subtitleColor),
                  _buildDivider(borderColor),
                  _buildReviewRow("Membership Plan", item.planName, textColor, subtitleColor),
                  _buildDivider(borderColor),
                  _buildReviewRow("Start Date", item.startDate, textColor, subtitleColor),
                  _buildDivider(borderColor),
                  _buildReviewRow("End Date", item.endDate, textColor, subtitleColor),
                  _buildDivider(borderColor),
                  _buildReviewRow("Total Amount Paid", "₹${item.amountPaid.toInt()}", AppTheme.secondaryColor, subtitleColor, isBold: true),
                  _buildDivider(borderColor),
                  _buildReviewRow("Payment Method", item.paymentMode, textColor, subtitleColor),
                ],
              ),
            ),

            const SizedBox(height: 30),

            // View Membership CTA
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (context) => MembershipDetailsScreen(membership: item),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: isDark ? const Color(0xFF1D4ED8) : AppTheme.primaryColor,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: const Text("View Membership Pass", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
              ),
            ),

            const SizedBox(height: 10),

            TextButton(
              onPressed: () => Navigator.of(context).popUntil((route) => route.isFirst),
              child: Text("Back to Home", style: TextStyle(fontSize: 13.5, color: subtitleColor, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReviewRow(String label, String value, Color textColor, Color subtitleColor, {bool isBold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 13, color: subtitleColor)),
          Text(
            value,
            style: TextStyle(
              fontSize: isBold ? 15 : 13,
              fontWeight: isBold ? FontWeight.bold : FontWeight.w600,
              color: textColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDivider(Color borderColor) {
    return Divider(height: 6, thickness: 0.8, color: borderColor);
  }
}

// ==========================================
// ABOUT TRAINER PROFILE MODAL
// ==========================================
class _AboutTrainerModal extends StatelessWidget {
  final Map<String, dynamic> trainer;

  const _AboutTrainerModal({required this.trainer});

  Widget _buildSectionTitle(String title, Color textColor) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Text(title, style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: textColor)),
    );
  }

  Widget _buildServiceItem(IconData icon, String label, Color textColor, Color subtitleColor) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 16, color: subtitleColor),
        const SizedBox(width: 8),
        Expanded(child: Text(label, style: TextStyle(fontSize: 12, color: textColor))),
      ],
    );
  }

  Widget _buildReviewItem(String name, String date, String review, String imagePath, Color textColor, Color subtitleColor) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 16,
                backgroundImage: NetworkImage(imagePath),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(name, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: textColor)),
                    Row(
                      children: List.generate(5, (index) => const Icon(Icons.star, size: 12, color: Colors.amber)),
                    ),
                  ],
                ),
              ),
              Text(date, style: TextStyle(fontSize: 11, color: subtitleColor)),
            ],
          ),
          const SizedBox(height: 8),
          Text(review, style: TextStyle(fontSize: 12, color: textColor, height: 1.4)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardColor = isDark ? const Color(0xFF1E1E1E) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final subtitleColor = isDark ? Colors.white70 : const Color(0xFF64748B);
    final borderColor = isDark ? Colors.white12 : const Color(0xFFE2E8F0);

    return Container(
      height: MediaQuery.of(context).size.height * 0.9,
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 16, 12, 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text("About ${trainer['name']}", style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: textColor)),
                IconButton(icon: const Icon(Icons.close_rounded), onPressed: () => Navigator.pop(context)),
              ],
            ),
          ),
          Divider(height: 1, color: borderColor),

          // Scrollable profile
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(20),
              children: [
                // Top Info
                Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Image.network(
                        trainer['image'] as String,
                        width: 70,
                        height: 70,
                        fit: BoxFit.cover,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(trainer['name'] as String, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: textColor)),
                          const SizedBox(height: 4),
                          Text("${trainer['exp']} Experience", style: TextStyle(fontSize: 12, color: subtitleColor)),
                          const SizedBox(height: 4),
                          Text(trainer['specialty'] as String, style: TextStyle(fontSize: 12, color: subtitleColor)),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              const Icon(Icons.star_rounded, size: 14, color: Colors.amber),
                              const SizedBox(width: 4),
                              Text("${trainer['rating']} (${trainer['reviews']} Reviews)", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: textColor)),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 24),
                _buildSectionTitle("About Me", textColor),
                Text(
                  "Certified fitness trainer with 8+ years of experience helping clients achieve their fitness goals through personalized training and nutrition guidance.",
                  style: TextStyle(fontSize: 12, color: subtitleColor, height: 1.4),
                ),
                
                const SizedBox(height: 16),
                Divider(color: borderColor),
                const SizedBox(height: 16),

                _buildSectionTitle("Services Offered", textColor),
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  childAspectRatio: 5,
                  mainAxisSpacing: 8,
                  crossAxisSpacing: 8,
                  children: [
                    _buildServiceItem(Icons.shopping_bag_outlined, "Weight Loss Program", textColor, subtitleColor),
                    _buildServiceItem(Icons.fitness_center_outlined, "Muscle Gain", textColor, subtitleColor),
                    _buildServiceItem(Icons.monitor_weight_outlined, "Strength Training", textColor, subtitleColor),
                    _buildServiceItem(Icons.local_fire_department_outlined, "Fat Loss", textColor, subtitleColor),
                    _buildServiceItem(Icons.directions_run_outlined, "HIIT Workouts", textColor, subtitleColor),
                    _buildServiceItem(Icons.restaurant_menu_outlined, "Diet & Nutrition", textColor, subtitleColor),
                    _buildServiceItem(Icons.person_outline, "Body Transformation", textColor, subtitleColor),
                  ],
                ),

                const SizedBox(height: 16),
                Divider(color: borderColor),
                const SizedBox(height: 16),

                Row(
                  children: [
                    Expanded(child: Text("Experience", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: textColor))),
                    Text("8+ Years", style: TextStyle(fontSize: 12, color: subtitleColor)),
                    const Expanded(child: SizedBox()),
                  ],
                ),

                const SizedBox(height: 16),
                Divider(color: borderColor),
                const SizedBox(height: 16),

                _buildSectionTitle("Certifications", textColor),
                Text("• ACE Certified Personal Trainer\n• Certified Strength & Conditioning Specialist (CSCS)\n• Nutrition & Weight Management Certification", style: TextStyle(fontSize: 12, color: subtitleColor, height: 1.6)),

                const SizedBox(height: 16),
                Divider(color: borderColor),
                const SizedBox(height: 16),

                Row(
                  children: [
                    Expanded(child: Text("Languages", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: textColor))),
                    Text("English, Hindi", style: TextStyle(fontSize: 12, color: subtitleColor)),
                    const Expanded(child: SizedBox()),
                  ],
                ),

                const SizedBox(height: 16),
                Divider(color: borderColor),
                const SizedBox(height: 16),

                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text("Clients Trained", style: TextStyle(fontSize: 12, color: subtitleColor)),
                          const SizedBox(height: 4),
                          Text("150+", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: textColor)),
                        ],
                      ),
                    ),
                    Container(width: 1, height: 30, color: borderColor),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text("Sessions Conducted", style: TextStyle(fontSize: 12, color: subtitleColor)),
                          const SizedBox(height: 4),
                          Text("2500+", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: textColor)),
                        ],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),
                Divider(color: borderColor),
                const SizedBox(height: 16),

                _buildSectionTitle("Availability", textColor),
                Text("Mon, Tue, Wed, Thu, Fri, Sat", style: TextStyle(fontSize: 12, color: subtitleColor)),
                const SizedBox(height: 4),
                Text("6:00 AM - 8:00 AM", style: TextStyle(fontSize: 12, color: textColor, fontWeight: FontWeight.bold)),
                const SizedBox(height: 2),
                Text("5:00 PM - 8:00 PM", style: TextStyle(fontSize: 12, color: textColor, fontWeight: FontWeight.bold)),

                const SizedBox(height: 16),
                Divider(color: borderColor),
                const SizedBox(height: 16),

                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text("Customer Reviews (124)", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: textColor)),
                    Text("View All", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
                  ],
                ),
                const SizedBox(height: 16),

                _buildReviewItem(
                  "Priya Sharma",
                  "2 months ago",
                  "Rohit is very motivating and helped me lose 8 kg in three months. He explains every exercise clearly.",
                  "https://randomuser.me/api/portraits/women/44.jpg",
                  textColor,
                  subtitleColor,
                ),
                _buildReviewItem(
                  "Arun Kumar",
                  "1 month ago",
                  "Excellent trainer. He focuses on proper form and gradually increased my strength.",
                  "https://randomuser.me/api/portraits/men/32.jpg",
                  textColor,
                  subtitleColor,
                ),

                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: AppTheme.primaryColor),
                      foregroundColor: AppTheme.primaryColor,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    child: const Text("Close", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ==========================================
// SMOOTH ANIMATED STEP PROGRESS BAR
// ==========================================
class _AnimatedStepProgressBar extends StatelessWidget {
  final int currentStep;
  final int totalSteps; // 4 or 6
  final Color activeColor;
  final Color inactiveColor;

  const _AnimatedStepProgressBar({
    required this.currentStep,
    required this.totalSteps,
    required this.activeColor,
    required this.inactiveColor,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
      child: LayoutBuilder(
        builder: (context, constraints) {
          final totalWidth = constraints.maxWidth;
          const maxSteps = 6;
          const spacing = 5.0;

          return SizedBox(
            height: 4,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: List.generate(maxSteps, (index) {
                final isVisible = index < totalSteps;
                final isPassed = index < currentStep;

                final targetWidth = isVisible
                    ? (totalWidth - (totalSteps - 1) * spacing) / totalSteps
                    : 0.0;

                return TweenAnimationBuilder<double>(
                  tween: Tween<double>(end: targetWidth),
                  duration: const Duration(milliseconds: 380),
                  curve: Curves.easeInOutCubic,
                  builder: (context, width, child) {
                    final opacity = (width / 15.0).clamp(0.0, 1.0);
                    return SizedBox(
                      width: width,
                      child: Opacity(
                        opacity: opacity,
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.easeInOut,
                          decoration: BoxDecoration(
                            color: isPassed ? activeColor : inactiveColor,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                      ),
                    );
                  },
                );
              }),
            ),
          );
        },
      ),
    );
  }
}

