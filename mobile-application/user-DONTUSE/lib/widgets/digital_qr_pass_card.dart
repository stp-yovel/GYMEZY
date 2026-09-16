import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../theme/app_theme.dart';
import 'scaffoldmessage.dart';

/// Reusable Luxury Digital Entry QR Pass Card with Centered Gymezy Logo & 6-digit OTP
class DigitalQrPassCard extends StatefulWidget {
  final String passId;
  final String customerId;
  final String otp;
  final String gymName;
  final String subtitle;
  final String primaryDateLabel;
  final String primaryDateValue;
  final String secondaryDateLabel;
  final String secondaryDateValue;
  final String status;
  final IconData icon;
  final String? gymImageUrl;
  final Color? accentColor;

  const DigitalQrPassCard({
    super.key,
    required this.passId,
    required this.customerId,
    required this.otp,
    required this.gymName,
    required this.subtitle,
    required this.primaryDateLabel,
    required this.primaryDateValue,
    required this.secondaryDateLabel,
    required this.secondaryDateValue,
    this.status = 'ACTIVE',
    this.icon = Icons.workspace_premium_rounded,
    this.gymImageUrl,
    this.accentColor,
  });

  @override
  State<DigitalQrPassCard> createState() => _DigitalQrPassCardState();
}

class _DigitalQrPassCardState extends State<DigitalQrPassCard> {
  void _copyToClipboard(String text, String label) {
    Clipboard.setData(ClipboardData(text: text));
    CustomScaffoldMessage.show(context, message: "$label copied to clipboard", isSuccess: true);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = AppTheme.isDark(context);
    final cardColor = AppTheme.getCardColor(context);
    final textColor = AppTheme.getTextColor(context);
    final subtitleColor = AppTheme.getSubtitleColor(context);
    final borderColor = AppTheme.getBorderColor(context);
    final effectiveAccent = isDark ? AppTheme.darkAccentColor : (widget.accentColor ?? AppTheme.primaryNavy);

    final qrData = "gymezy://pass?id=${widget.passId}&cust=${widget.customerId}&otp=${widget.otp}";
    final otpDigits = widget.otp.split('');

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(26),
        border: Border.all(color: borderColor),
        boxShadow: [
          BoxShadow(
            color: isDark ? Colors.black45 : Colors.black.withValues(alpha: 0.06),
            blurRadius: 18,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        children: [
          // 1. Pass Header
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 16),
            child: Column(
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(11),
                      decoration: BoxDecoration(
                        color: effectiveAccent.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: effectiveAccent.withValues(alpha: 0.2),
                        ),
                      ),
                      child: Icon(
                        widget.icon,
                        size: 24,
                        color: effectiveAccent,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.gymName,
                            style: TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.w900,
                              color: textColor,
                              letterSpacing: -0.3,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            widget.subtitle,
                            style: TextStyle(
                              fontSize: 12.5,
                              fontWeight: FontWeight.bold,
                              color: effectiveAccent,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: widget.status.toUpperCase() == 'ACTIVE'
                            ? const Color(0xFFE6F7EF)
                            : (isDark ? const Color(0xFF262626) : const Color(0xFFF1F5F9)),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: widget.status.toUpperCase() == 'ACTIVE'
                              ? const Color(0xFFB7EAD0)
                              : borderColor,
                          width: 0.8,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.circle,
                            size: 6,
                            color: widget.status.toUpperCase() == 'ACTIVE'
                                ? const Color(0xFF047857)
                                : subtitleColor,
                          ),
                          const SizedBox(width: 5),
                          Text(
                            widget.status.toUpperCase(),
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              color: widget.status.toUpperCase() == 'ACTIVE'
                                  ? const Color(0xFF047857)
                                  : subtitleColor,
                              letterSpacing: 0.4,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // Date Strip
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF262626) : const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: borderColor),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              widget.primaryDateLabel,
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: subtitleColor,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              widget.primaryDateValue,
                              style: TextStyle(
                                fontSize: 12.5,
                                fontWeight: FontWeight.bold,
                                color: textColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        height: 24,
                        width: 1,
                        color: borderColor,
                        margin: const EdgeInsets.symmetric(horizontal: 10),
                      ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              widget.secondaryDateLabel,
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: subtitleColor,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              widget.secondaryDateValue,
                              style: TextStyle(
                                fontSize: 12.5,
                                fontWeight: FontWeight.bold,
                                color: textColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Perforated Tear Line with Left/Right Scalloped Cutouts
          Stack(
            alignment: Alignment.center,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 18.0),
                child: Row(
                  children: List.generate(
                    26,
                    (index) => Expanded(
                      child: Container(
                        height: 1.5,
                        color: index.isEven ? borderColor : Colors.transparent,
                      ),
                    ),
                  ),
                ),
              ),
              Positioned(
                left: -10,
                child: Container(
                  width: 20,
                  height: 20,
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF121212) : const Color(0xFFF8FAFC),
                    shape: BoxShape.circle,
                  ),
                ),
              ),
              Positioned(
                right: -10,
                child: Container(
                  width: 20,
                  height: 20,
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF121212) : const Color(0xFFF8FAFC),
                    shape: BoxShape.circle,
                  ),
                ),
              ),
            ],
          ),

          // 2. QR Code Canvas with Centered Gymezy Logo
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 16),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: const Color(0xFFE2E8F0), width: 1.5),
                  ),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      QrImageView(
                        data: qrData,
                        version: QrVersions.auto,
                        size: 200.0,
                        padding: const EdgeInsets.all(4),
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
                        width: 48,
                        height: 48,
                        padding: const EdgeInsets.all(7),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
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
                const SizedBox(height: 12),
                Text(
                  "Show this QR code or 6-digit OTP to gym reception",
                  style: TextStyle(
                    fontSize: 12,
                    color: subtitleColor,
                    fontWeight: FontWeight.w500,
                  ),
                  textAlign: TextAlign.center,
                ),

                const SizedBox(height: 18),

                // 3. 6-Digit Check-in OTP
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF262626) : const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: borderColor),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.pin_rounded, size: 16, color: effectiveAccent),
                              const SizedBox(width: 6),
                              Text(
                                "ENTRY OTP",
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w800,
                                  color: subtitleColor,
                                  letterSpacing: 0.5,
                                ),
                              ),
                            ],
                          ),
                          GestureDetector(
                            onTap: () => _copyToClipboard(widget.otp, "OTP"),
                            child: Row(
                              children: [
                                Icon(Icons.copy_rounded, size: 14, color: effectiveAccent),
                                const SizedBox(width: 4),
                                Text(
                                  "Copy",
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: effectiveAccent,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),

                      // 6 Digits Boxes
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: otpDigits.map((digit) {
                          return Container(
                            width: 40,
                            height: 46,
                            decoration: BoxDecoration(
                              color: isDark ? const Color(0xFF1E1E1E) : cardColor,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: isDark ? const Color(0xFF93C5FD).withValues(alpha: 0.3) : borderColor,
                                width: 1.2,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: isDark
                                      ? Colors.black45
                                      : Colors.black.withValues(alpha: 0.03),
                                  blurRadius: 4,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              digit,
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w900,
                                color: isDark ? Colors.white : effectiveAccent,
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 14),

                // 4. Pass Meta Info (Pass ID & Customer ID)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF262626) : const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: borderColor),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: () => _copyToClipboard(widget.passId, "Pass ID"),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "PASS ID",
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: subtitleColor,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Row(
                                children: [
                                  Text(
                                    widget.passId,
                                    style: TextStyle(
                                      fontSize: 12.5,
                                      fontWeight: FontWeight.w800,
                                      color: textColor,
                                    ),
                                  ),
                                  const SizedBox(width: 4),
                                  Icon(Icons.copy_rounded, size: 12, color: subtitleColor),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                      Container(
                        height: 22,
                        width: 1,
                        color: borderColor,
                        margin: const EdgeInsets.symmetric(horizontal: 10),
                      ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "CUSTOMER ID",
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: subtitleColor,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              widget.customerId,
                              style: TextStyle(
                                fontSize: 12.5,
                                fontWeight: FontWeight.w800,
                                color: textColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
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
