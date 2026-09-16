import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../models/booking_item.dart';
import '../theme/app_theme.dart';
import '../widgets/scaffoldmessage.dart';
import '../widgets/custom_calendar.dart';
import '../widgets/digital_qr_pass_card.dart';

class BookingDetailsScreen extends StatefulWidget {
  final BookingItem booking;
  final Function(BookingItem updatedBooking)? onBookingUpdated;

  const BookingDetailsScreen({
    super.key,
    required this.booking,
    this.onBookingUpdated,
  });

  @override
  State<BookingDetailsScreen> createState() => _BookingDetailsScreenState();
}

class _BookingDetailsScreenState extends State<BookingDetailsScreen> {
  late BookingItem _currentBooking;

  @override
  void initState() {
    super.initState();
    _currentBooking = widget.booking;
  }

  void _copyToClipboard(String text, String label) {
    Clipboard.setData(ClipboardData(text: text));
    // System automatically notifies user on clipboard copy
  }

  void _openQrFullscreen() {
    showDialog(
      context: context,
      builder: (ctx) => _FullscreenQrDialog(booking: _currentBooking),
    );
  }

  void _showModifyBookingSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _ModifyBookingSheet(
        booking: _currentBooking,
        onModified: (newDate, newTime) {
          setState(() {
            _currentBooking = _currentBooking.copyWith(
              date: newDate,
              time: newTime,
            );
          });
          widget.onBookingUpdated?.call(_currentBooking);
          CustomScaffoldMessage.show(
            context,
            message: "Booking rescheduled to $newDate at $newTime",
          );
        },
      ),
    );
  }

  void _showCancelBookingSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _CancelBookingSheet(
        booking: _currentBooking,
        onCancelled: (reason) {
          setState(() {
            _currentBooking = _currentBooking.copyWith(
              status: 'Cancelled',
              cancellationReason: reason,
            );
          });
          widget.onBookingUpdated?.call(_currentBooking);
          CustomScaffoldMessage.show(
            context,
            message: "Booking cancelled. Refund of ₹${_currentBooking.amountPaid.toInt()} initiated to UPI.",
          );
        },
      ),
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
    final isUpcoming = _currentBooking.status == 'Upcoming';

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: backgroundColor,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, size: 18, color: textColor),
          onPressed: () => Navigator.pop(context, _currentBooking),
        ),
        title: Text(
          "Digital Entry Pass",
          style: TextStyle(
            color: textColor,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.fullscreen_rounded, color: isDark ? Colors.white70 : AppTheme.primaryColor),
            tooltip: "Enlarge QR Pass",
            onPressed: _openQrFullscreen,
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. Digital Boarding-Pass Style Entry Pass (Customer Shows, Front Desk Scans)
            if (isUpcoming) ...[
              DigitalQrPassCard(
                passId: _currentBooking.id,
                customerId: _currentBooking.customerId,
                otp: _currentBooking.otp,
                gymName: _currentBooking.gymName,
                subtitle: _currentBooking.sessionSubtitle,
                primaryDateLabel: "DATE",
                primaryDateValue: _currentBooking.date,
                secondaryDateLabel: "TIME SLOT",
                secondaryDateValue: _currentBooking.time,
                status: _currentBooking.status,
                icon: _currentBooking.icon,
                accentColor: isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor,
              ),
              const SizedBox(height: 18),
            ],

            // If cancelled, show cancellation banner
            if (_currentBooking.status == 'Cancelled') ...[
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.redAccent.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.redAccent.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.cancel_rounded, color: Colors.redAccent, size: 28),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "This Booking Has Been Cancelled",
                            style: TextStyle(
                              color: Colors.redAccent,
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            "Reason: ${_currentBooking.cancellationReason ?? 'User Requested'}",
                            style: TextStyle(color: subtitleColor, fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),
            ],

            // 2. Detailed Receipt Information Table
            Text(
              "Booking Summary",
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: textColor,
              ),
            ),
            const SizedBox(height: 10),

            Container(
              decoration: BoxDecoration(
                color: cardColor,
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: borderColor),
                boxShadow: [
                  BoxShadow(
                    color: isDark ? Colors.black26 : Colors.black.withOpacity(0.03),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              padding: const EdgeInsets.all(18),
              child: Column(
                children: [
                  _buildDetailRow("Booking ID", _currentBooking.id, textColor, subtitleColor, copyable: true),
                  _buildDivider(borderColor),
                  _buildDetailRow("Customer ID", _currentBooking.customerId, textColor, subtitleColor, copyable: true),
                  _buildDivider(borderColor),
                  _buildDetailRow("Gym / Class", _currentBooking.gymName, textColor, subtitleColor, isBold: true),
                  _buildDivider(borderColor),
                  _buildDetailRow("Session Type", _currentBooking.sessionSubtitle, textColor, subtitleColor),
                  _buildDivider(borderColor),
                  _buildDetailRow("Date", _currentBooking.date, textColor, subtitleColor),
                  _buildDivider(borderColor),
                  _buildDetailRow("Time", _currentBooking.time, textColor, subtitleColor),
                  _buildDivider(borderColor),
                  _buildDetailRow("Days Booked", _currentBooking.daysBooked, textColor, subtitleColor),
                  _buildDivider(borderColor),
                  _buildDetailRow("Amount Paid", "₹${_currentBooking.amountPaid.toInt()}", AppTheme.secondaryColor, subtitleColor, isBold: true, isPrice: true),
                  _buildDivider(borderColor),
                  _buildDetailRow("Payment Mode", _currentBooking.paymentMode, textColor, subtitleColor),
                  _buildDivider(borderColor),
                  _buildStatusRow("Booking Status", _currentBooking.status, subtitleColor),
                ],
              ),
            ),

            const SizedBox(height: 28),

            // 3. Action Buttons (Modify & Cancel)
            if (isUpcoming) ...[
              Row(
                children: [
                  // Modify Booking Button
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: _showModifyBookingSheet,
                      icon: Icon(Icons.edit_calendar_rounded, size: 16, color: isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor),
                      label: Text(
                        "Modify Booking",
                        style: TextStyle(
                          color: isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor,
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                        ),
                      ),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        side: BorderSide(color: isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor, width: 1.2),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),

                  // Cancel Booking Button
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: _showCancelBookingSheet,
                      icon: const Icon(Icons.delete_outline_rounded, size: 16, color: Colors.redAccent),
                      label: const Text(
                        "Cancel Booking",
                        style: TextStyle(
                          color: Colors.redAccent,
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                        ),
                      ),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        side: BorderSide(color: Colors.redAccent.withOpacity(0.6), width: 1.2),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
            ],
          ],
        ),
      ),
    );
  }



  Widget _buildDetailRow(
    String label,
    String value,
    Color textColor,
    Color subtitleColor, {
    bool isBold = false,
    bool isPrice = false,
    bool copyable = false,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 13,
              color: subtitleColor,
            ),
          ),
          const SizedBox(width: 10),
          Flexible(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Flexible(
                  child: Text(
                    value,
                    textAlign: TextAlign.right,
                    style: TextStyle(
                      fontSize: isPrice ? 15 : 13,
                      fontWeight: isBold ? FontWeight.bold : FontWeight.w600,
                      color: textColor,
                    ),
                  ),
                ),
                if (copyable) ...[
                  const SizedBox(width: 6),
                  GestureDetector(
                    onTap: () => _copyToClipboard(value, label),
                    child: const Icon(Icons.copy_rounded, size: 14, color: AppTheme.secondaryColor),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusRow(String label, String status, Color subtitleColor) {
    Color statusColor;
    Color statusBg;

    if (status == 'Confirmed' || status == 'Upcoming') {
      statusColor = AppTheme.secondaryColor;
      statusBg = AppTheme.secondaryColor.withOpacity(0.12);
    } else if (status == 'Completed') {
      statusColor = const Color(0xFF60A5FA);
      statusBg = const Color(0xFF60A5FA).withOpacity(0.12);
    } else {
      statusColor = Colors.redAccent;
      statusBg = Colors.redAccent.withOpacity(0.12);
    }

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 13, color: subtitleColor)),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: statusBg,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              status == 'Upcoming' ? 'Confirmed' : status,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: statusColor,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDivider(Color borderColor) {
    return Divider(height: 8, thickness: 0.8, color: borderColor);
  }
}

// ==========================================
// FULLSCREEN QR DIALOG WITH LOGO
// ==========================================
class _FullscreenQrDialog extends StatelessWidget {
  final BookingItem booking;

  const _FullscreenQrDialog({required this.booking});

  @override
  Widget build(BuildContext context) {
    final qrData = "gymezy://checkin?id=${booking.id}&cust=${booking.customerId}&otp=${booking.otp}";

    return Dialog(
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        booking.gymName,
                        style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      Text(
                        "Pass ID: ${booking.id}",
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.secondaryColor,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close_rounded, color: Color(0xFF64748B)),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 18),

            // Large Dot-Matrix QR Code Canvas
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.08),
                    blurRadius: 16,
                    offset: const Offset(0, 4),
                  ),
                ],
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  QrImageView(
                    data: qrData,
                    version: QrVersions.auto,
                    size: 240.0,
                    eyeStyle: const QrEyeStyle(
                      eyeShape: QrEyeShape.circle,
                      color: Color(0xFF012A6B),
                    ),
                    dataModuleStyle: const QrDataModuleStyle(
                      dataModuleShape: QrDataModuleShape.circle,
                      color: Color(0xFF0F172A),
                    ),
                    errorCorrectionLevel: QrErrorCorrectLevel.H,
                  ),
                  Container(
                    width: 54,
                    height: 54,
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.2),
                          blurRadius: 10,
                          offset: const Offset(0, 3),
                        ),
                      ],
                      border: Border.all(color: const Color(0xFF01327E), width: 2),
                    ),
                    child: Image.asset(
                      'assets/logo/gymezy.png',
                      color: const Color(0xFF01327E),
                      fit: BoxFit.contain,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 18),
            const Text(
              "Present this screen to the gym scanner",
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: Color(0xFF475569),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ==========================================
// MODIFY BOOKING MODAL SHEET
// ==========================================
class _ModifyBookingSheet extends StatefulWidget {
  final BookingItem booking;
  final Function(String newDate, String newTime) onModified;

  const _ModifyBookingSheet({
    required this.booking,
    required this.onModified,
  });

  @override
  State<_ModifyBookingSheet> createState() => _ModifyBookingSheetState();
}

class _ModifyBookingSheetState extends State<_ModifyBookingSheet> {
  late DateTime _selectedDate;
  late String _selectedTime;

  final List<String> _timeSlots = [
    "6:00 AM - 7:00 AM",
    "7:00 AM - 8:00 AM",
    "8:00 AM - 9:00 AM",
    "9:00 AM - 10:00 AM",
    "5:00 PM - 6:00 PM",
    "6:00 PM - 7:00 PM",
    "7:00 PM - 8:00 PM",
    "8:00 PM - 9:00 PM",
  ];

  @override
  void initState() {
    super.initState();
    _selectedDate = DateTime.now().add(const Duration(days: 1));
    _selectedTime = widget.booking.time;
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardColor = isDark ? const Color(0xFF1E1E1E) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final subtitleColor = isDark ? Colors.white70 : const Color(0xFF64748B);
    final borderColor = isDark ? Colors.white12 : const Color(0xFFE2E8F0);

    return Container(
      padding: EdgeInsets.fromLTRB(20, 16, 20, MediaQuery.of(context).padding.bottom + 20),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "Modify Booking",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
              IconButton(
                icon: Icon(Icons.close_rounded, color: subtitleColor),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Current Booking Card
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF262626) : const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: borderColor),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryColor.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(widget.booking.icon, color: AppTheme.secondaryColor, size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(widget.booking.gymName, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: textColor)),
                      Text(widget.booking.sessionSubtitle, style: TextStyle(fontSize: 11, color: subtitleColor)),
                      Text("${widget.booking.date} • ${widget.booking.time}", style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.secondaryColor)),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 18),

          // Horizontal 14-Day Date Picker
          HorizontalDayStripCalendar(
            selectedDate: _selectedDate,
            initialStartDate: DateTime.now().add(const Duration(days: 1)),
            daysCount: 14,
            wrapInCard: true,
            showMonthHeader: true,
            customHeaderTitle: "Choose New Date",
            onDateSelected: (day) => setState(() => _selectedDate = day),
          ),

          const SizedBox(height: 18),
          Text(
            "Select Time Slot",
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: textColor),
          ),
          const SizedBox(height: 10),

          // Time Slots Wrap
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _timeSlots.map((slot) {
              final isSelected = _selectedTime == slot;
              return ChoiceChip(
                label: Text(slot),
                selected: isSelected,
                onSelected: (selected) {
                  if (selected) setState(() => _selectedTime = slot);
                },
                selectedColor: AppTheme.primaryColor,
                backgroundColor: isDark ? const Color(0xFF262626) : const Color(0xFFF1F5F9),
                labelStyle: TextStyle(
                  color: isSelected ? Colors.white : textColor,
                  fontSize: 12,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(color: isSelected ? AppTheme.primaryColor : borderColor),
                ),
                showCheckmark: false,
              );
            }).toList(),
          ),

          const SizedBox(height: 24),

          // Update Button
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              onPressed: () {
                final weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                final months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                final formattedDate = "${weekdays[_selectedDate.weekday - 1]}, ${_selectedDate.day} ${months[_selectedDate.month - 1]} ${_selectedDate.year}";

                widget.onModified(formattedDate, _selectedTime);
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.secondaryColor,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: const Text(
                "Update Booking",
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ==========================================
// CANCEL BOOKING MODAL SHEET
// ==========================================
class _CancelBookingSheet extends StatefulWidget {
  final BookingItem booking;
  final Function(String reason) onCancelled;

  const _CancelBookingSheet({
    required this.booking,
    required this.onCancelled,
  });

  @override
  State<_CancelBookingSheet> createState() => _CancelBookingSheetState();
}

class _CancelBookingSheetState extends State<_CancelBookingSheet> {
  String _selectedReason = "Change of plans / Schedule conflict";

  final List<String> _reasons = [
    "Change of plans / Schedule conflict",
    "Feeling unwell / Medical reasons",
    "Booked the wrong date or time",
    "Booked wrong gym location",
    "Personal emergency",
    "Other",
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardColor = isDark ? const Color(0xFF1E1E1E) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final subtitleColor = isDark ? Colors.white70 : const Color(0xFF64748B);
    final borderColor = isDark ? Colors.white12 : const Color(0xFFE2E8F0);

    return Container(
      padding: EdgeInsets.fromLTRB(20, 16, 20, MediaQuery.of(context).padding.bottom + 20),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "Cancel Booking",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
              IconButton(
                icon: Icon(Icons.close_rounded, color: subtitleColor),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Booking ID & Preview Card
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF262626) : const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text("Booking ID", style: TextStyle(fontSize: 11, color: subtitleColor)),
                    Text(widget.booking.id, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.secondaryColor)),
                  ],
                ),
                const SizedBox(height: 6),
                Text(widget.booking.gymName, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: textColor)),
                Text("${widget.booking.sessionSubtitle} • ${widget.booking.date}", style: TextStyle(fontSize: 11, color: subtitleColor)),
                const SizedBox(height: 4),
                Text("₹${widget.booking.amountPaid.toInt()} Paid via ${widget.booking.paymentMode}", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: textColor)),
              ],
            ),
          ),

          const SizedBox(height: 18),
          Text(
            "Reason for Cancellation (Optional)",
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: textColor),
          ),
          const SizedBox(height: 8),

          // Dropdown Container
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF262626) : const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: borderColor),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: _selectedReason,
                isExpanded: true,
                dropdownColor: cardColor,
                style: TextStyle(fontSize: 13, color: textColor),
                icon: Icon(Icons.arrow_drop_down_rounded, color: subtitleColor),
                items: _reasons.map((r) {
                  return DropdownMenuItem<String>(
                    value: r,
                    child: Text(r),
                  );
                }).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedReason = val);
                },
              ),
            ),
          ),

          const SizedBox(height: 14),

          // Policy Note
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.amber.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.amber.withOpacity(0.3)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.info_outline_rounded, color: Colors.amber, size: 18),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    "Note: Cancelling within 2 hours of the session start time may not be eligible for a full refund as per gym policy.",
                    style: TextStyle(fontSize: 11, color: isDark ? Colors.amber.shade200 : Colors.amber.shade900, height: 1.3),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 22),

          // Confirm Cancel Button
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              onPressed: () {
                widget.onCancelled(_selectedReason);
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.redAccent,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: const Text(
                "Confirm Cancellation",
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
