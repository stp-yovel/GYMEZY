import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../models/gym.dart';
import '../models/booking_item.dart';
import '../theme/app_theme.dart';
import '../data/booking_repository.dart';
import 'booking_details_screen.dart';

class PaymentSummaryScreen extends StatefulWidget {
  final Gym gym;
  final String bookingTitle;
  final String datesSummary;
  final String? timeSlot;
  final int sessionsCount;
  final double subtotal;
  final double discount;

  const PaymentSummaryScreen({
    super.key,
    required this.gym,
    required this.bookingTitle,
    required this.datesSummary,
    this.timeSlot,
    required this.sessionsCount,
    required this.subtotal,
    this.discount = 0.0,
  });

  @override
  State<PaymentSummaryScreen> createState() => _PaymentSummaryScreenState();
}

class _PaymentSummaryScreenState extends State<PaymentSummaryScreen> {
  String _selectedPaymentMethod = 'UPI';

  double get _totalAmount => (widget.subtotal - widget.discount).clamp(0.0, double.infinity);

  void _processPayment() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        final cardColor = isDark ? const Color(0xFF1E1E1E) : Colors.white;
        final textColor = AppTheme.getTextColor(context);
        final subtitleColor = AppTheme.getSubtitleColor(context);

        return Dialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          backgroundColor: cardColor,
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.secondaryColor.withOpacity(0.12),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check_circle_rounded,
                    color: AppTheme.secondaryColor,
                    size: 48,
                  ),
                ).animate().scale(duration: 400.ms, curve: Curves.elasticOut),
                const SizedBox(height: 18),
                Text(
                  "Booking Confirmed!",
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  "Your pass for ${widget.gym.name} has been booked successfully.",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 13,
                    color: subtitleColor,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF262626) : const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: isDark ? Colors.white10 : const Color(0xFFE2E8F0),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "Booking ID:",
                        style: TextStyle(fontSize: 12, color: subtitleColor),
                      ),
                      Builder(builder: (context) {
                        final displayId = "GZ-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}";
                        return Text(
                          displayId,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: textColor,
                          ),
                        );
                      }),
                    ],
                  ),
                ),
                const SizedBox(height: 22),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context); // Close dialog
                      final bookingId = "GZ-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}";
                      final newBooking = BookingItem(
                        id: bookingId,
                        customerId: 'CUST789012',
                        gymName: widget.gym.name,
                        gymLocation: widget.gym.location,
                        gymImageUrl: widget.gym.imageUrl,
                        type: 'Gym Access',
                        sessionSubtitle: widget.bookingTitle,
                        date: widget.datesSummary,
                        time: widget.timeSlot ?? '6:00 AM - 7:00 AM',
                        daysBooked: "${widget.sessionsCount} ${widget.sessionsCount > 1 ? 'Sessions' : 'Session'}",
                        amountPaid: _totalAmount,
                        paymentMode: _selectedPaymentMethod,
                        otp: (100000 + DateTime.now().millisecond * 899).toInt().toString().padLeft(6, '7'),
                        status: 'Upcoming',
                        icon: Icons.fitness_center_rounded,
                        accentColor: AppTheme.primaryColor,
                      );

                      // Real-time synchronization across the entire app
                      BookingRepository.instance.addBooking(newBooking);

                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) => BookingDetailsScreen(booking: newBooking),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.secondaryColor,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    child: const Text(
                      "View Pass & OTP",
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                TextButton(
                  onPressed: () {
                    Navigator.of(context).popUntil((route) => route.isFirst);
                  },
                  child: Text(
                    "Back to Home",
                    style: TextStyle(fontSize: 13, color: subtitleColor),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final backgroundColor = AppTheme.getBackgroundColor(context);
    final cardColor = isDark ? const Color(0xFF1E1E1E) : Colors.white;
    final textColor = AppTheme.getTextColor(context);
    final subtitleColor = AppTheme.getSubtitleColor(context);
    final borderColor = isDark ? Colors.white10 : const Color(0xFFE2E8F0);

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: backgroundColor,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_rounded, color: textColor),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          "Payment Summary",
          style: TextStyle(
            color: textColor,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: false,
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 120),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // 1. Booking Details Card
            _buildBookingDetailsCard(cardColor, textColor, subtitleColor, borderColor)
                .animate()
                .fadeIn(duration: 350.ms)
                .slideY(begin: 0.05),

            const SizedBox(height: 18),

            // 2. Price Details Card
            _buildPriceDetailsCard(cardColor, textColor, subtitleColor, borderColor)
                .animate()
                .fadeIn(delay: 100.ms, duration: 350.ms),

            const SizedBox(height: 18),

            // 3. Payment Method Selection
            _buildPaymentMethodSection(cardColor, textColor, subtitleColor, borderColor, isDark)
                .animate()
                .fadeIn(delay: 200.ms, duration: 350.ms),
          ],
        ),
      ),
      bottomSheet: Container(
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 24),
        decoration: BoxDecoration(
          color: cardColor,
          border: Border(
            top: BorderSide(color: borderColor, width: 1),
          ),
        ),
        child: SizedBox(
          height: 52,
          child: ElevatedButton(
            onPressed: _processPayment,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryColor,
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.lock_outline_rounded, size: 18, color: Colors.white),
                const SizedBox(width: 8),
                Text(
                  "Pay ₹${_totalAmount.toInt()}",
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBookingDetailsCard(Color cardColor, Color textColor, Color subtitleColor, Color borderColor) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "Booking Details",
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppTheme.secondaryColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  "${widget.sessionsCount} ${widget.sessionsCount > 1 ? 'Sessions' : 'Session'}",
                  style: const TextStyle(
                    color: AppTheme.secondaryColor,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            widget.gym.name,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: textColor,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            widget.bookingTitle,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: subtitleColor,
            ),
          ),
          const SizedBox(height: 10),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(Icons.calendar_today_outlined, size: 14, color: AppTheme.secondaryColor),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  widget.datesSummary,
                  style: TextStyle(fontSize: 12, color: textColor, height: 1.3),
                ),
              ),
            ],
          ),
          if (widget.timeSlot != null) ...[
            const SizedBox(height: 6),
            Row(
              children: [
                const Icon(Icons.access_time_rounded, size: 14, color: AppTheme.secondaryColor),
                const SizedBox(width: 6),
                Text(
                  widget.timeSlot!,
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: textColor),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildPriceDetailsCard(Color cardColor, Color textColor, Color subtitleColor, Color borderColor) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Price Details",
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.bold,
              color: textColor,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("Subtotal", style: TextStyle(fontSize: 13, color: subtitleColor)),
              Text("₹${widget.subtotal.toInt()}", style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: textColor)),
            ],
          ),
          if (widget.discount > 0) ...[
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text("GYMEZY Discount", style: TextStyle(fontSize: 13, color: AppTheme.secondaryColor)),
                Text("-₹${widget.discount.toInt()}", style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.secondaryColor)),
              ],
            ),
          ],
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 12.0),
            child: Divider(height: 1, color: borderColor),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "Total Amount",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
              Text(
                "₹${_totalAmount.toInt()}",
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentMethodSection(
      Color cardColor, Color textColor, Color subtitleColor, Color borderColor, bool isDark) {
    final methods = [
      {
        'id': 'UPI',
        'title': 'UPI',
        'subtitle': 'Google Pay, PhonePe, Paytm',
        'icon': Icons.account_balance_wallet_outlined,
      },
      {
        'id': 'Card',
        'title': 'Card',
        'subtitle': 'Debit / Credit Card',
        'icon': Icons.credit_card_outlined,
      },
      {
        'id': 'NetBanking',
        'title': 'Net Banking',
        'subtitle': 'All major banks supported',
        'icon': Icons.account_balance_outlined,
      },
    ];

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Select Payment Method",
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.bold,
              color: textColor,
            ),
          ),
          const SizedBox(height: 12),
          Column(
            children: methods.map((m) {
              final isSelected = _selectedPaymentMethod == m['id'];
              return GestureDetector(
                onTap: () {
                  setState(() {
                    _selectedPaymentMethod = m['id'] as String;
                  });
                },
                child: Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? (isDark ? const Color(0xFF262626) : const Color(0xFFF1F5F9))
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: isSelected ? AppTheme.primaryColor : borderColor,
                      width: isSelected ? 1.5 : 1,
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        m['icon'] as IconData,
                        color: isSelected ? AppTheme.primaryColor : subtitleColor,
                        size: 22,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              m['title'] as String,
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: textColor,
                              ),
                            ),
                            Text(
                              m['subtitle'] as String,
                              style: TextStyle(
                                fontSize: 11,
                                color: subtitleColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Icon(
                        isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
                        color: isSelected ? AppTheme.primaryColor : subtitleColor,
                        size: 20,
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}
