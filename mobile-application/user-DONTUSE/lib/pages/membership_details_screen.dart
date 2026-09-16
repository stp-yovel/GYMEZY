import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/membership_item.dart';
import '../data/booking_repository.dart';
import '../data/mock_data.dart';
import '../theme/app_theme.dart';
import '../widgets/scaffoldmessage.dart';
import '../widgets/digital_qr_pass_card.dart';
import 'buy_membership_screen.dart';

class MembershipDetailsScreen extends StatefulWidget {
  final MembershipItem membership;

  const MembershipDetailsScreen({
    super.key,
    required this.membership,
  });

  @override
  State<MembershipDetailsScreen> createState() => _MembershipDetailsScreenState();
}

class _MembershipDetailsScreenState extends State<MembershipDetailsScreen> {
  late MembershipItem _currentMembership;

  @override
  void initState() {
    super.initState();
    _currentMembership = widget.membership;
  }

  void _copyToClipboard(String text, String label) {
    Clipboard.setData(ClipboardData(text: text));
    CustomScaffoldMessage.show(context, message: "$label copied to clipboard", isSuccess: true);
  }

  void _openUpgradeFlow() {
    final defaultGym = MockData.gyms.first;
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => BuyMembershipScreen(gym: defaultGym),
      ),
    );
  }

  void _showCancelDialog() {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardColor = isDark ? const Color(0xFF1E1E1E) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final subtitleColor = isDark ? Colors.white70 : const Color(0xFF64748B);

    String selectedReason = 'Relocating / Moving away';
    final reasons = [
      'Relocating / Moving away',
      'Medical reasons / Injury',
      'Financial constraints',
      'Dissatisfied with facilities',
      'Other',
    ];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: cardColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setSheetState) {
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
                          "Cancel Membership",
                          style: TextStyle(
                            fontSize: 18,
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
                    const SizedBox(height: 8),
                    Text(
                      "Please select a reason for cancellation. Note that cancellation requests are subject to gym refund policies.",
                      style: TextStyle(fontSize: 13, color: subtitleColor),
                    ),
                    const SizedBox(height: 16),
                    ...reasons.map((reason) {
                      final isSelected = selectedReason == reason;
                      return ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: Text(
                          reason,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                            color: textColor,
                          ),
                        ),
                        leading: Radio<String>(
                          value: reason,
                          groupValue: selectedReason,
                          activeColor: Colors.redAccent,
                          onChanged: (val) {
                            if (val != null) {
                              setSheetState(() => selectedReason = val);
                            }
                          },
                        ),
                        onTap: () => setSheetState(() => selectedReason = reason),
                      );
                    }),
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () => Navigator.pop(ctx),
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14),
                              ),
                            ),
                            child: const Text("Keep Membership"),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () {
                              Navigator.pop(ctx);
                              setState(() {
                                _currentMembership = _currentMembership.copyWith(status: 'Cancelled');
                              });
                              // update in repo
                              BookingRepository.instance.cancelBooking(_currentMembership.id, selectedReason);
                              CustomScaffoldMessage.show(context, message: "Cancellation request submitted successfully", isSuccess: true);
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.redAccent,
                              foregroundColor: Colors.white,
                              elevation: 0,
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14),
                              ),
                            ),
                            child: const Text(
                              "Confirm Cancel",
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ],
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

  @override
  Widget build(BuildContext context) {
    final isDark = AppTheme.isDark(context);
    final backgroundColor = AppTheme.getBackgroundColor(context);
    final cardColor = AppTheme.getCardColor(context);
    final textColor = AppTheme.getTextColor(context);
    final subtitleColor = AppTheme.getSubtitleColor(context);
    final borderColor = AppTheme.getBorderColor(context);
    final primaryNavy = AppTheme.getAccentColor(context);

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: backgroundColor,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, size: 18, color: textColor),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          "Membership Details",
          style: TextStyle(
            color: textColor,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.more_vert_rounded, color: textColor),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. Gym Profile Card with Logo & Name
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: cardColor,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: borderColor, width: 1.2),
                boxShadow: [
                  BoxShadow(
                    color: isDark ? Colors.black26 : Colors.black.withValues(alpha: 0.03),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF262626) : const Color(0xFF003882).withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: borderColor),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: _currentMembership.gymImageUrl.isNotEmpty
                          ? Image.network(
                              _currentMembership.gymImageUrl,
                              fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => const Icon(
                                Icons.fitness_center_rounded,
                                color: Color(0xFF003882),
                                size: 28,
                              ),
                            )
                          : const Icon(
                              Icons.fitness_center_rounded,
                              color: Color(0xFF003882),
                              size: 28,
                            ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _currentMembership.gymName,
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: textColor,
                            letterSpacing: -0.3,
                          ),
                        ),
                        const SizedBox(height: 5),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: isDark
                                    ? const Color(0xFF1E3A8A).withValues(alpha: 0.6)
                                    : primaryNavy,
                                borderRadius: BorderRadius.circular(8),
                                border: isDark
                                    ? Border.all(color: const Color(0xFF3B82F6).withValues(alpha: 0.4))
                                    : null,
                              ),
                              child: Text(
                                _currentMembership.planName,
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  color: isDark ? const Color(0xFF93C5FD) : Colors.white,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: _currentMembership.status == 'Active'
                                    ? const Color(0xFFE6F7EF)
                                    : (isDark ? const Color(0xFF262626) : const Color(0xFFF1F5F9)),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                _currentMembership.status,
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  color: _currentMembership.status == 'Active'
                                      ? const Color(0xFF16A34A)
                                      : subtitleColor,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // 2. Membership Details Key-Value List Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: cardColor,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: borderColor, width: 1.2),
              ),
              child: Column(
                children: [
                  _buildDetailRow(
                    Icons.person_outline_rounded,
                    "Membership ID",
                    _currentMembership.id,
                    textColor,
                    subtitleColor,
                    isId: true,
                  ),
                  _buildDivider(borderColor),
                  _buildDetailRow(
                    Icons.calendar_today_outlined,
                    "Start Date",
                    _currentMembership.startDate,
                    textColor,
                    subtitleColor,
                  ),
                  _buildDivider(borderColor),
                  _buildDetailRow(
                    Icons.event_available_outlined,
                    "End Date",
                    _currentMembership.endDate,
                    textColor,
                    subtitleColor,
                  ),
                  _buildDivider(borderColor),
                  _buildDetailRow(
                    Icons.access_time_rounded,
                    "Days Remaining",
                    _currentMembership.durationDays,
                    const Color(0xFF16A34A),
                    subtitleColor,
                    isHighlight: true,
                  ),
                  _buildDivider(borderColor),
                  _buildDetailRow(
                    Icons.sports_rounded,
                    "Personal Trainer",
                    _currentMembership.hasPersonalTrainer
                        ? (_currentMembership.trainerName ?? "Assigned")
                        : "Not Selected",
                    _currentMembership.hasPersonalTrainer ? textColor : Colors.redAccent,
                    subtitleColor,
                  ),
                  _buildDivider(borderColor),
                  _buildDetailRow(
                    Icons.payments_outlined,
                    "Amount Paid",
                    "₹${_currentMembership.amountPaid.toInt()}",
                    textColor,
                    subtitleColor,
                    isBold: true,
                  ),
                  _buildDivider(borderColor),
                  _buildDetailRow(
                    Icons.account_balance_wallet_outlined,
                    "Payment Method",
                    _currentMembership.paymentMode,
                    textColor,
                    subtitleColor,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // 3. Info Notice Banner
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              decoration: BoxDecoration(
                color: const Color(0xFF003882).withValues(alpha: 0.07),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: const Color(0xFF003882).withValues(alpha: 0.2),
                ),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(
                    Icons.info_outline_rounded,
                    size: 20,
                    color: Color(0xFF003882),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      "Enjoy unlimited access to all gym facilities during your membership period.",
                      style: TextStyle(
                        fontSize: 13,
                        color: isDark ? Colors.white70 : const Color(0xFF003882),
                        fontWeight: FontWeight.w500,
                        height: 1.4,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // 4. Digital Entry Pass QR & OTP (Customer Generates, Gym Scans)
            DigitalQrPassCard(
              passId: _currentMembership.id,
              customerId: _currentMembership.customerId,
              otp: _currentMembership.otp,
              gymName: _currentMembership.gymName,
              subtitle: _currentMembership.planName,
              primaryDateLabel: "VALID FROM",
              primaryDateValue: _currentMembership.startDate,
              secondaryDateLabel: "EXPIRES ON",
              secondaryDateValue: _currentMembership.endDate,
              status: _currentMembership.status,
              icon: Icons.card_membership_rounded,
              accentColor: primaryNavy,
            ),

            const SizedBox(height: 24),

            // 5. Actions: Upgrade Membership & Cancel Membership
            if (_currentMembership.status == 'Active') ...[
              SizedBox(
                width: double.infinity,
                height: 50,
                child: OutlinedButton.icon(
                  onPressed: _openUpgradeFlow,
                  icon: Icon(
                    Icons.arrow_circle_up_rounded,
                    size: 20,
                    color: isDark ? const Color(0xFF93C5FD) : primaryNavy,
                  ),
                  label: Text(
                    "Upgrade Membership",
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                      color: isDark ? const Color(0xFF93C5FD) : primaryNavy,
                    ),
                  ),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: isDark ? const Color(0xFF93C5FD) : primaryNavy,
                    side: BorderSide(
                      color: isDark ? const Color(0xFF93C5FD) : primaryNavy,
                      width: 1.5,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: OutlinedButton.icon(
                  onPressed: _showCancelDialog,
                  icon: const Icon(Icons.cancel_outlined, size: 20, color: Color(0xFFF87171)),
                  label: const Text(
                    "Request to Cancel Membership",
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFFF87171),
                    ),
                  ),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFFF87171),
                    side: BorderSide(
                      color: const Color(0xFFF87171).withValues(alpha: 0.6),
                      width: 1.2,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(
    IconData icon,
    String label,
    String value,
    Color valueColor,
    Color subtitleColor, {
    bool isId = false,
    bool isHighlight = false,
    bool isBold = false,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(icon, size: 18, color: subtitleColor),
              const SizedBox(width: 10),
              Text(
                label,
                style: TextStyle(
                  fontSize: 13.5,
                  color: subtitleColor,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          if (isId)
            GestureDetector(
              onTap: () => _copyToClipboard(value, "Membership ID"),
              child: Row(
                children: [
                  Text(
                    value,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w900,
                      color: isDark ? const Color(0xFF93C5FD) : const Color(0xFF003882),
                    ),
                  ),
                  const SizedBox(width: 4),
                  Icon(
                    Icons.copy_rounded,
                    size: 14,
                    color: isDark ? const Color(0xFF93C5FD) : const Color(0xFF003882),
                  ),
                ],
              ),
            )
          else
            Text(
              value,
              style: TextStyle(
                fontSize: 14,
                fontWeight: (isHighlight || isBold) ? FontWeight.w900 : FontWeight.w700,
                color: valueColor,
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildDivider(Color borderColor) {
    return Divider(height: 1, thickness: 0.8, color: borderColor);
  }
}
