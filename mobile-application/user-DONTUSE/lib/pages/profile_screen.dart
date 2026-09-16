import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../data/booking_repository.dart';
import '../theme/app_theme.dart';
import '../widgets/scaffoldmessage.dart';
import 'membership_details_screen.dart';
import 'onboarding_screen.dart';

class ProfileScreen extends StatefulWidget {
  final VoidCallback? onNavigateToBookings;
  final VoidCallback? onNavigateToMemberships;

  const ProfileScreen({
    super.key,
    this.onNavigateToBookings,
    this.onNavigateToMemberships,
  });

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  // User Profile State
  String _userName = "Alex Morgan";
  String _userEmail = "alex.morgan@fitness.io";
  String _userPhone = "+91 98765 43210";
  String _userGender = "Male";
  String _userEmergencyContact = "+91 98123 45678 (Spouse)";
  final String _avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";

  // Body & Fitness Metrics
  double _heightCm = 178;
  double _weightKg = 74.5;
  double _targetWeightKg = 70.0;
  String _fitnessGoal = "Muscle Building & Hypertrophy";

  // Preferences Toggles
  bool _workoutReminders = true;
  bool _passExpiryAlerts = true;
  bool _biometricLogin = true;

  double get _bmi {
    final heightInM = _heightCm / 100;
    return _weightKg / (heightInM * heightInM);
  }

  String get _bmiCategory {
    final bmi = _bmi;
    if (bmi < 18.5) return "Underweight";
    if (bmi < 24.9) return "Normal Weight";
    if (bmi < 29.9) return "Overweight";
    return "Obese";
  }

  Color _getBmiColor(double bmi) {
    if (bmi < 18.5) return Colors.amber;
    if (bmi < 24.9) return const Color(0xFF16A34A);
    if (bmi < 29.9) return Colors.orange;
    return Colors.redAccent;
  }

  @override
  void initState() {
    super.initState();
    BookingRepository.instance.addListener(_onRepositoryChanged);
  }

  @override
  void dispose() {
    BookingRepository.instance.removeListener(_onRepositoryChanged);
    super.dispose();
  }

  void _onRepositoryChanged() {
    if (mounted) setState(() {});
  }

  // ==========================================
  // MODAL 1: EDIT PERSONAL PROFILE
  // ==========================================
  void _openEditProfileModal() {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardColor = isDark ? const Color(0xFF1E1E1E) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final subtitleColor = isDark ? Colors.white70 : const Color(0xFF64748B);
    final borderColor = isDark ? Colors.white12 : const Color(0xFFE2E8F0);

    final nameController = TextEditingController(text: _userName);
    final emailController = TextEditingController(text: _userEmail);
    final phoneController = TextEditingController(text: _userPhone);
    final emergencyController = TextEditingController(text: _userEmergencyContact);
    String selectedGender = _userGender;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: cardColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Edit Profile",
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w900,
                            color: textColor,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close_rounded),
                          onPressed: () => Navigator.pop(ctx),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    _buildTextField("Full Name", nameController, Icons.person_outline_rounded, textColor, subtitleColor, borderColor, isDark),
                    const SizedBox(height: 14),
                    _buildTextField("Email Address", emailController, Icons.mail_outline_rounded, textColor, subtitleColor, borderColor, isDark, keyboardType: TextInputType.emailAddress),
                    const SizedBox(height: 14),
                    _buildTextField("Phone Number", phoneController, Icons.phone_outlined, textColor, subtitleColor, borderColor, isDark, keyboardType: TextInputType.phone),
                    const SizedBox(height: 14),
                    _buildTextField("Emergency Contact", emergencyController, Icons.contact_phone_outlined, textColor, subtitleColor, borderColor, isDark),
                    const SizedBox(height: 14),

                    Text("Gender", style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: subtitleColor)),
                    const SizedBox(height: 8),
                    Row(
                      children: ["Male", "Female", "Other"].map((g) {
                        final isSel = selectedGender == g;
                        return Expanded(
                          child: GestureDetector(
                            onTap: () => setModalState(() => selectedGender = g),
                            child: Container(
                              margin: const EdgeInsets.symmetric(horizontal: 4),
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              decoration: BoxDecoration(
                                color: isSel ? const Color(0xFF003882) : (isDark ? const Color(0xFF262626) : const Color(0xFFF1F5F9)),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: isSel ? const Color(0xFF003882) : borderColor,
                                ),
                              ),
                              alignment: Alignment.center,
                              child: Text(
                                g,
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: isSel ? FontWeight.bold : FontWeight.w500,
                                  color: isSel ? Colors.white : textColor,
                                ),
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),

                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: () {
                          setState(() {
                            _userName = nameController.text.trim();
                            _userEmail = emailController.text.trim();
                            _userPhone = phoneController.text.trim();
                            _userEmergencyContact = emergencyController.text.trim();
                            _userGender = selectedGender;
                          });
                          Navigator.pop(ctx);
                          CustomScaffoldMessage.show(context, message: "Profile updated successfully", isSuccess: true);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF003882),
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        child: const Text("Save Changes", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  // ==========================================
  // MODAL 2: UPDATE BODY MEASUREMENTS & GOALS
  // ==========================================
  void _openMeasurementsModal() {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardColor = isDark ? const Color(0xFF1E1E1E) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final subtitleColor = isDark ? Colors.white70 : const Color(0xFF64748B);
    final borderColor = isDark ? Colors.white12 : const Color(0xFFE2E8F0);

    final heightController = TextEditingController(text: _heightCm.toStringAsFixed(0));
    final weightController = TextEditingController(text: _weightKg.toStringAsFixed(1));
    final targetController = TextEditingController(text: _targetWeightKg.toStringAsFixed(1));
    String selectedGoal = _fitnessGoal;

    final goals = [
      "Muscle Building & Hypertrophy",
      "Weight Loss & Fat Burn",
      "Endurance & Stamina",
      "Strength & Powerlifting",
      "General Fitness & Mobility",
    ];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: cardColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Fitness Metrics & Goals",
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w900,
                            color: textColor,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close_rounded),
                          onPressed: () => Navigator.pop(ctx),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    Row(
                      children: [
                        Expanded(
                          child: _buildTextField("Height (cm)", heightController, Icons.height_rounded, textColor, subtitleColor, borderColor, isDark, keyboardType: TextInputType.number),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildTextField("Weight (kg)", weightController, Icons.monitor_weight_outlined, textColor, subtitleColor, borderColor, isDark, keyboardType: const TextInputType.numberWithOptions(decimal: true)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),

                    _buildTextField("Target Weight (kg)", targetController, Icons.flag_outlined, textColor, subtitleColor, borderColor, isDark, keyboardType: const TextInputType.numberWithOptions(decimal: true)),
                    const SizedBox(height: 16),

                    Text("Primary Fitness Goal", style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: subtitleColor)),
                    const SizedBox(height: 8),
                    ...goals.map((goal) {
                      final isSel = selectedGoal == goal;
                      return GestureDetector(
                        onTap: () => setModalState(() => selectedGoal = goal),
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          decoration: BoxDecoration(
                            color: isSel
                                ? (isDark ? const Color(0xFF1E3A8A).withValues(alpha: 0.5) : const Color(0xFF003882).withValues(alpha: 0.08))
                                : (isDark ? const Color(0xFF262626) : const Color(0xFFF8FAFC)),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isSel ? const Color(0xFF003882) : borderColor,
                              width: isSel ? 1.5 : 1,
                            ),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                isSel ? Icons.check_circle_rounded : Icons.circle_outlined,
                                size: 18,
                                color: isSel ? const Color(0xFF003882) : subtitleColor,
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  goal,
                                  style: TextStyle(
                                    fontSize: 13.5,
                                    fontWeight: isSel ? FontWeight.bold : FontWeight.w500,
                                    color: textColor,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }),

                    const SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: () {
                          setState(() {
                            _heightCm = double.tryParse(heightController.text) ?? _heightCm;
                            _weightKg = double.tryParse(weightController.text) ?? _weightKg;
                            _targetWeightKg = double.tryParse(targetController.text) ?? _targetWeightKg;
                            _fitnessGoal = selectedGoal;
                          });
                          Navigator.pop(ctx);
                          CustomScaffoldMessage.show(context, message: "Measurements updated successfully", isSuccess: true);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF003882),
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        child: const Text("Update Metrics", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  // ==========================================
  // MODAL 3: INVOICES & BILLING RECEIPTS
  // ==========================================
  void _openInvoicesModal() {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardColor = isDark ? const Color(0xFF1E1E1E) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final subtitleColor = isDark ? Colors.white70 : const Color(0xFF64748B);
    final borderColor = isDark ? Colors.white12 : const Color(0xFFE2E8F0);

    final invoices = [
      {'id': 'INV-2025-001', 'title': 'FitZone Gym Annual Pass', 'date': '21 May 2025', 'amount': '₹11,999', 'status': 'Paid'},
      {'id': 'INV-2025-002', 'title': 'Olympic Fitness Day Pass', 'date': '14 May 2025', 'amount': '₹199', 'status': 'Paid'},
      {'id': 'INV-2025-003', 'title': 'PowerHouse 10-Session Pass', 'date': '02 Apr 2025', 'amount': '₹1,499', 'status': 'Paid'},
    ];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: cardColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "Invoices & Receipts",
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                        color: textColor,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close_rounded),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                ...invoices.map((inv) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF262626) : const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: borderColor),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: const Color(0xFF003882).withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.receipt_long_rounded, color: Color(0xFF003882), size: 22),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(inv['title']!, style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: textColor)),
                              const SizedBox(height: 2),
                              Text("${inv['id']} • ${inv['date']}", style: TextStyle(fontSize: 11.5, color: subtitleColor)),
                            ],
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(inv['amount']!, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: textColor)),
                            const SizedBox(height: 2),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: const Color(0xFFE6F7EF),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: const Text("PAID", style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFF047857))),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                }),
              ],
            ),
          ),
        );
      },
    );
  }

  // ==========================================
  // MODAL 4: HELP & FREQUENTLY ASKED QUESTIONS
  // ==========================================
  void _openFaqModal() {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardColor = isDark ? const Color(0xFF1E1E1E) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final subtitleColor = isDark ? Colors.white70 : const Color(0xFF64748B);

    final faqs = [
      {'q': 'How do I check-in at a gym?', 'a': 'Open your active booking or membership in GYMEZY and show your QR code pass to the front desk scanner, or share the 6-digit entry OTP.'},
      {'q': 'Can I reschedule a session booking?', 'a': 'Yes! You can reschedule any upcoming session up to 2 hours before the start time without any cancellation fees.'},
      {'q': 'How do membership cancellations work?', 'a': 'You can request a cancellation from your Membership Details screen. Refunds are processed according to the gym\'s policy.'},
      {'q': 'Are trainers certified on GYMEZY?', 'a': 'All personal trainers listed on GYMEZY are verified and certified with relevant national and international fitness accreditations.'},
    ];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: cardColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "Help & FAQs",
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: textColor,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close_rounded),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  ...faqs.map((faq) {
                    return ExpansionTile(
                      tilePadding: EdgeInsets.zero,
                      title: Text(faq['q']!, style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: textColor)),
                      children: [
                        Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: Text(faq['a']!, style: TextStyle(fontSize: 13, color: subtitleColor, height: 1.4)),
                        ),
                      ],
                    );
                  }),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  // ==========================================
  // CONFIRM LOGOUT DIALOG
  // ==========================================
  void _confirmLogout() {
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
          title: const Text("Log Out of GYMEZY?", style: TextStyle(fontWeight: FontWeight.w900)),
          content: const Text("Are you sure you want to log out? You'll need your phone number and OTP to log back in."),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text("Cancel"),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(ctx);
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(builder: (context) => const OnboardingScreen()),
                  (route) => false,
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.redAccent,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Text("Log Out"),
            ),
          ],
        );
      },
    );
  }

  Widget _buildTextField(
    String label,
    TextEditingController controller,
    IconData icon,
    Color textColor,
    Color subtitleColor,
    Color borderColor,
    bool isDark, {
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: subtitleColor)),
        const SizedBox(height: 6),
        TextField(
          controller: controller,
          keyboardType: keyboardType,
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: textColor),
          decoration: InputDecoration(
            prefixIcon: Icon(icon, size: 20, color: isDark ? const Color(0xFF93C5FD) : const Color(0xFF003882)),
            filled: true,
            fillColor: isDark ? const Color(0xFF262626) : const Color(0xFFF8FAFC),
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: BorderSide(color: borderColor),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: Color(0xFF003882), width: 1.5),
            ),
          ),
        ),
      ],
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
    final primaryNavy = AppTheme.getAccentColor(context);

    final activeMemberships = BookingRepository.instance.memberships.where((m) => m.status == 'Active').toList();
    final activeBookings = BookingRepository.instance.bookings.where((b) => b.status == 'Upcoming').toList();
    final totalActivePasses = activeMemberships.length + activeBookings.length;

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: backgroundColor,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        title: Text(
          "Profile & Settings",
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.w900,
            color: textColor,
            letterSpacing: -0.5,
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.edit_note_rounded, color: isDark ? const Color(0xFF93C5FD) : primaryNavy, size: 26),
            tooltip: "Edit Profile",
            onPressed: _openEditProfileModal,
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 120),
        children: [
          // 1. User Profile Header Card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: cardColor,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: borderColor, width: 1.2),
              boxShadow: [
                BoxShadow(
                  color: isDark ? Colors.black38 : Colors.black.withValues(alpha: 0.04),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // Avatar with online green ring and camera edit button
                    Stack(
                      children: [
                        Container(
                          width: 72,
                          height: 72,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: isDark ? const Color(0xFF93C5FD) : primaryNavy, width: 2.5),
                          ),
                          child: ClipOval(
                            child: Image.network(
                              _avatarUrl,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) => Container(
                                color: const Color(0xFF003882).withValues(alpha: 0.1),
                                child: const Icon(Icons.person, size: 40, color: Color(0xFF003882)),
                              ),
                            ),
                          ),
                        ),
                        Positioned(
                          right: 0,
                          bottom: 0,
                          child: GestureDetector(
                            onTap: () {
                              CustomScaffoldMessage.show(context, message: "Avatar photo updated", isSuccess: true);
                            },
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: const BoxDecoration(
                                color: Color(0xFF003882),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.camera_alt_rounded, size: 14, color: Colors.white),
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(width: 16),

                    // User identity
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Flexible(
                                child: Text(
                                  _userName,
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w900,
                                    color: textColor,
                                    letterSpacing: -0.3,
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              const SizedBox(width: 6),
                              const Icon(Icons.verified_rounded, size: 18, color: Color(0xFF3B82F6)),
                            ],
                          ),
                          const SizedBox(height: 3),
                          Text(
                            _userPhone,
                            style: TextStyle(fontSize: 13, color: subtitleColor, fontWeight: FontWeight.w500),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            _userEmail,
                            style: TextStyle(fontSize: 12, color: subtitleColor),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),
                Divider(height: 1, color: borderColor),
                const SizedBox(height: 12),

                // VIP Membership Status Pill
                GestureDetector(
                  onTap: () {
                    if (activeMemberships.isNotEmpty) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => MembershipDetailsScreen(membership: activeMemberships.first),
                        ),
                      );
                    }
                  },
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: isDark
                            ? [const Color(0xFF1E3A8A).withValues(alpha: 0.5), const Color(0xFF312E81).withValues(alpha: 0.5)]
                            : [const Color(0xFFEEF2FF), const Color(0xFFE0E7FF)],
                      ),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: isDark ? const Color(0xFF60A5FA).withValues(alpha: 0.3) : const Color(0xFFC7D2FE),
                      ),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.workspace_premium_rounded, color: Color(0xFFF59E0B), size: 20),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "PRO FITNESS MEMBER",
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w900,
                                  color: isDark ? const Color(0xFF93C5FD) : primaryNavy,
                                  letterSpacing: 0.5,
                                ),
                              ),
                              Text(
                                activeMemberships.isNotEmpty ? activeMemberships.first.gymName : "FitZone Gym (Annual)",
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: textColor,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Icon(Icons.arrow_forward_ios_rounded, size: 14, color: isDark ? const Color(0xFF93C5FD) : primaryNavy),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ).animate().fadeIn(duration: 300.ms).slideY(begin: 0.05, end: 0),

          const SizedBox(height: 18),

          // 2. Activity & Fitness Stats Summary
          Row(
            children: [
              _buildStatCard("18", "Workouts", Icons.fitness_center_rounded, const Color(0xFF3B82F6), cardColor, textColor, subtitleColor, borderColor, isDark),
              const SizedBox(width: 10),
              _buildStatCard("5 Days", "Streak 🔥", Icons.local_fire_department_rounded, const Color(0xFFEF4444), cardColor, textColor, subtitleColor, borderColor, isDark),
              const SizedBox(width: 10),
              _buildStatCard("$totalActivePasses Active", "Passes", Icons.card_membership_rounded, const Color(0xFF10B981), cardColor, textColor, subtitleColor, borderColor, isDark),
              const SizedBox(width: 10),
              _buildStatCard("14.2k", "Calories", Icons.bolt_rounded, const Color(0xFFF59E0B), cardColor, textColor, subtitleColor, borderColor, isDark),
            ],
          ),

          const SizedBox(height: 18),

          // 3. Body Measurements & Fitness Goals Card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: cardColor,
              borderRadius: BorderRadius.circular(22),
              border: Border.all(color: borderColor, width: 1.2),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: const Color(0xFF003882).withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.accessibility_new_rounded, color: Color(0xFF003882), size: 18),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          "Body Metrics & Target",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: textColor,
                          ),
                        ),
                      ],
                    ),
                    TextButton(
                      onPressed: _openMeasurementsModal,
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        minimumSize: Size.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        foregroundColor: isDark ? const Color(0xFF93C5FD) : primaryNavy,
                      ),
                      child: const Text("Edit", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    ),
                  ],
                ),
                const SizedBox(height: 14),

                // 4-Column Metrics
                Row(
                  children: [
                    _buildMetricBox("Height", "${_heightCm.toInt()} cm", subtitleColor, textColor, isDark),
                    _buildMetricBox("Weight", "${_weightKg.toStringAsFixed(1)} kg", subtitleColor, textColor, isDark),
                    _buildMetricBox("BMI", _bmi.toStringAsFixed(1), subtitleColor, _getBmiColor(_bmi), isDark, badge: _bmiCategory),
                    _buildMetricBox("Target", "${_targetWeightKg.toStringAsFixed(1)} kg", subtitleColor, textColor, isDark),
                  ],
                ),

                const SizedBox(height: 12),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF262626) : const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.track_changes_rounded, size: 16, color: Color(0xFF003882)),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          "Goal: $_fitnessGoal",
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: textColor),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // 4. Section: Passes & Activity
          _buildSectionHeader("Passes & Activity", textColor),
          const SizedBox(height: 8),
          _buildMenuTile(
            Icons.confirmation_number_outlined,
            "My Session Bookings",
            "View upcoming gym sessions & passes",
            cardColor,
            textColor,
            subtitleColor,
            borderColor,
            isDark,
            onTap: widget.onNavigateToBookings,
          ),
          _buildMenuTile(
            Icons.card_membership_outlined,
            "My Gym Memberships",
            "Active plans, duration & QR access",
            cardColor,
            textColor,
            subtitleColor,
            borderColor,
            isDark,
            onTap: widget.onNavigateToMemberships,
          ),
          _buildMenuTile(
            Icons.history_rounded,
            "Check-in & Attendance History",
            "18 check-ins recorded this month",
            cardColor,
            textColor,
            subtitleColor,
            borderColor,
            isDark,
            onTap: () {
              CustomScaffoldMessage.show(context, message: "18 successful check-ins logged on GYMEZY");
            },
          ),

          const SizedBox(height: 20),

          // 5. Section: Payments & Billing
          _buildSectionHeader("Payments & Billing", textColor),
          const SizedBox(height: 8),
          _buildMenuTile(
            Icons.receipt_long_outlined,
            "Invoices & Receipts",
            "Download GST receipts & payment records",
            cardColor,
            textColor,
            subtitleColor,
            borderColor,
            isDark,
            onTap: _openInvoicesModal,
          ),
          _buildMenuTile(
            Icons.account_balance_wallet_outlined,
            "Saved Payment Methods",
            "UPI, Saved Cards & NetBanking",
            cardColor,
            textColor,
            subtitleColor,
            borderColor,
            isDark,
            onTap: () {
              CustomScaffoldMessage.show(context, message: "Default UPI ID: alex@okaxis");
            },
          ),

          const SizedBox(height: 20),

          // 6. Section: Preferences & Security
          _buildSectionHeader("Preferences & Security", textColor),
          const SizedBox(height: 8),
          Container(
            decoration: BoxDecoration(
              color: cardColor,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: borderColor, width: 1.2),
            ),
            child: Column(
              children: [
                _buildSwitchTile(
                  Icons.notifications_active_outlined,
                  "Workout Reminders",
                  "Daily notifications before your session",
                  _workoutReminders,
                  (val) => setState(() => _workoutReminders = val),
                  textColor,
                  subtitleColor,
                ),
                Divider(height: 1, color: borderColor),
                _buildSwitchTile(
                  Icons.alarm_outlined,
                  "Pass Expiry Alerts",
                  "Get notified 3 days before membership ends",
                  _passExpiryAlerts,
                  (val) => setState(() => _passExpiryAlerts = val),
                  textColor,
                  subtitleColor,
                ),
                Divider(height: 1, color: borderColor),
                _buildSwitchTile(
                  Icons.fingerprint_rounded,
                  "Biometric / Face ID Login",
                  "Fast authentication for check-in QR",
                  _biometricLogin,
                  (val) => setState(() => _biometricLogin = val),
                  textColor,
                  subtitleColor,
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // 7. Section: Help & Support
          _buildSectionHeader("Support & About", textColor),
          const SizedBox(height: 8),
          _buildMenuTile(
            Icons.help_outline_rounded,
            "Help & FAQ Center",
            "Answers to common booking questions",
            cardColor,
            textColor,
            subtitleColor,
            borderColor,
            isDark,
            onTap: _openFaqModal,
          ),
          _buildMenuTile(
            Icons.chat_bubble_outline_rounded,
            "Contact Customer Support",
            "24/7 WhatsApp & In-app assistance",
            cardColor,
            textColor,
            subtitleColor,
            borderColor,
            isDark,
            onTap: () {
              CustomScaffoldMessage.show(context, message: "Connecting to GYMEZY 24/7 Support Desk...", isSuccess: true);
            },
          ),
          _buildMenuTile(
            Icons.privacy_tip_outlined,
            "Privacy Policy & Terms",
            "GYMEZY User Agreements v2.4.0",
            cardColor,
            textColor,
            subtitleColor,
            borderColor,
            isDark,
            onTap: () {
              CustomScaffoldMessage.show(context, message: "GYMEZY Privacy Policy: Secure & Encrypted");
            },
          ),

          const SizedBox(height: 24),

          // 8. Log Out & App Version
          SizedBox(
            width: double.infinity,
            height: 50,
            child: OutlinedButton.icon(
              onPressed: _confirmLogout,
              icon: const Icon(Icons.logout_rounded, size: 20, color: Colors.redAccent),
              label: const Text(
                "Log Out",
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: Colors.redAccent,
                ),
              ),
              style: OutlinedButton.styleFrom(
                side: BorderSide(
                  color: Colors.redAccent.withValues(alpha: 0.5),
                  width: 1.2,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
            ),
          ),

          const SizedBox(height: 16),
          Center(
            child: Text(
              "GYMEZY App • Version 2.4.0 (Build 2026)",
              style: TextStyle(
                fontSize: 11.5,
                color: subtitleColor,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, Color textColor) {
    return Padding(
      padding: const EdgeInsets.only(left: 4),
      child: Text(
        title,
        style: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w800,
          color: textColor,
          letterSpacing: 0.2,
        ),
      ),
    );
  }

  Widget _buildStatCard(
    String value,
    String label,
    IconData icon,
    Color iconColor,
    Color cardColor,
    Color textColor,
    Color subtitleColor,
    Color borderColor,
    bool isDark,
  ) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: borderColor, width: 1.2),
        ),
        child: Column(
          children: [
            Icon(icon, color: iconColor, size: 22),
            const SizedBox(height: 6),
            Text(
              value,
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: textColor),
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(fontSize: 10, color: subtitleColor, fontWeight: FontWeight.w600),
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricBox(
    String label,
    String value,
    Color subtitleColor,
    Color valueColor,
    bool isDark, {
    String? badge,
  }) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 3),
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF262626) : const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Text(label, style: TextStyle(fontSize: 11, color: subtitleColor, fontWeight: FontWeight.w500)),
            const SizedBox(height: 4),
            Text(
              value,
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: valueColor),
            ),
            if (badge != null) ...[
              const SizedBox(height: 2),
              Text(
                badge,
                style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.bold, color: valueColor),
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildMenuTile(
    IconData icon,
    String title,
    String subtitle,
    Color cardColor,
    Color textColor,
    Color subtitleColor,
    Color borderColor,
    bool isDark, {
    VoidCallback? onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: borderColor, width: 1.2),
      ),
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
        leading: Container(
          padding: const EdgeInsets.all(9),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF262626) : const Color(0xFF003882).withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(
            icon,
            size: 20,
            color: isDark ? const Color(0xFF93C5FD) : const Color(0xFF003882),
          ),
        ),
        title: Text(
          title,
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: textColor),
        ),
        subtitle: Text(
          subtitle,
          style: TextStyle(fontSize: 11.5, color: subtitleColor),
        ),
        trailing: Icon(
          Icons.chevron_right_rounded,
          size: 20,
          color: subtitleColor,
        ),
      ),
    );
  }

  Widget _buildSwitchTile(
    IconData icon,
    String title,
    String subtitle,
    bool value,
    ValueChanged<bool> onChanged,
    Color textColor,
    Color subtitleColor,
  ) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
      leading: Icon(icon, size: 22, color: const Color(0xFF003882)),
      title: Text(
        title,
        style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: textColor),
      ),
      subtitle: Text(
        subtitle,
        style: TextStyle(fontSize: 11, color: subtitleColor),
      ),
      trailing: Switch.adaptive(
        value: value,
        activeThumbColor: const Color(0xFF003882),
        activeTrackColor: const Color(0xFF003882).withValues(alpha: 0.3),
        onChanged: onChanged,
      ),
    );
  }
}
