import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // ==========================================
  // BRAND & THEME PALETTE CONSTANTS
  // ==========================================
  static const Color primaryColor = Color(0xFF003882);
  static const Color primaryNavy = Color(0xFF003882);
  static const Color secondaryColor = Color(0xFF00BF62);
  static const Color accentColor = Color(0xFF6366F1);
  static const Color lightAccentColor = Color(0xFFEEF2FF);
  static const Color darkAccentColor = Color(0xFF93C5FD);
  
  // Functional Status Colors
  static const Color successGreen = Color(0xFF16A34A);
  static const Color successBg = Color(0xFFE6F7EF);
  static const Color successBorder = Color(0xFFB7EAD0);
  
  static const Color dangerRed = Color(0xFFEF4444);
  static const Color dangerLightRed = Color(0xFFF87171);
  static const Color dangerBg = Color(0xFFFEE2E2);
  
  static const Color warningAmber = Color(0xFFF59E0B);
  static const Color warningBg = Color(0xFFFEF3C7);
  
  static const Color infoBlue = Color(0xFF3B82F6);
  static const Color infoBg = Color(0xFFEFF6FF);

  // Neutral Dark Backgrounds
  static const Color darkBackground = Color(0xFF121212);
  static const Color darkCard = Color(0xFF1E1E1E);
  static const Color darkSurface = Color(0xFF262626);
  static const Color darkBorder = Colors.white12;
  
  // Neutral Light Backgrounds
  static const Color lightBackground = Color(0xFFF8FAFC);
  static const Color lightCard = Colors.white;
  static const Color lightSurface = Color(0xFFF1F5F9);
  static const Color lightBorder = Color(0xFFE2E8F0);

  // ==========================================
  // DYNAMIC THEME HELPERS
  // ==========================================
  static bool isDark(BuildContext context) =>
      Theme.of(context).brightness == Brightness.dark;

  static Color getBackgroundColor(BuildContext context) =>
      isDark(context) ? darkBackground : lightBackground;

  static Color getCardColor(BuildContext context) =>
      isDark(context) ? darkCard : lightCard;

  static Color getSurfaceColor(BuildContext context) =>
      isDark(context) ? darkSurface : lightSurface;

  static Color getTextColor(BuildContext context) =>
      isDark(context) ? Colors.white : const Color(0xFF0F172A);

  static Color getSubtitleColor(BuildContext context) =>
      isDark(context) ? Colors.white70 : const Color(0xFF64748B);

  static Color getBorderColor(BuildContext context) =>
      isDark(context) ? darkBorder : lightBorder;

  static Color getAccentColor(BuildContext context) =>
      isDark(context) ? darkAccentColor : primaryNavy;

  static Color getSuccessColor(BuildContext context) =>
      isDark(context) ? const Color(0xFF4ADE80) : successGreen;

  static Color getDangerColor(BuildContext context) =>
      isDark(context) ? dangerLightRed : dangerRed;

  static Color getPillBgColor(BuildContext context) => isDark(context)
      ? const Color(0xFF1E3A8A).withValues(alpha: 0.6)
      : primaryNavy.withValues(alpha: 0.1);

  static Color getPillTextColor(BuildContext context) =>
      isDark(context) ? darkAccentColor : primaryNavy;

  static Color getDotColor(BuildContext context, bool isActive) {
    if (isDark(context)) {
      return isActive ? secondaryColor : Colors.white24;
    } else {
      return isActive ? primaryColor : primaryColor.withValues(alpha: 0.3);
    }
  }

  // Chips & Rating Colors
  static Color getActiveChipBg(BuildContext context) {
    return isDark(context)
        ? accentColor.withValues(alpha: 0.25)
        : lightAccentColor;
  }

  static Color getActiveChipText(BuildContext context) {
    return isDark(context) ? Colors.white : accentColor;
  }

  static Color getInactiveChipBg(BuildContext context) {
    return isDark(context) ? darkSurface : Colors.transparent;
  }

  static Color getInactiveChipBorder(BuildContext context) {
    return isDark(context) ? Colors.transparent : lightBorder;
  }

  static Color getRatingBg(BuildContext context) {
    return isDark(context)
        ? const Color(0xFF1B5E20).withValues(alpha: 0.3)
        : const Color(0xFFE8F5E9);
  }

  static Color getRatingText(BuildContext context) {
    return isDark(context)
        ? const Color(0xFF81C784)
        : const Color(0xFF2E7D32);
  }

  // ==========================================
  // SHADOWS & RADII
  // ==========================================
  static final BorderRadius cardRadius = BorderRadius.circular(22);
  static final BorderRadius pillRadius = BorderRadius.circular(12);
  static final BorderRadius buttonRadius = BorderRadius.circular(16);
  static final BorderRadius sheetRadius = const BorderRadius.vertical(top: Radius.circular(28));

  static List<BoxShadow> getCardShadow(BuildContext context) {
    return [
      BoxShadow(
        color: isDark(context)
            ? Colors.black38
            : Colors.black.withValues(alpha: 0.04),
        blurRadius: 12,
        offset: const Offset(0, 4),
      ),
    ];
  }

  // ==========================================
  // TEXT STYLES
  // ==========================================
  static TextStyle getTitleStyle(BuildContext context) {
    return GoogleFonts.outfit(
      fontSize: 24,
      fontWeight: FontWeight.w900,
      color: getTextColor(context),
      letterSpacing: -0.5,
    );
  }

  static TextStyle getHeadingStyle(BuildContext context) {
    return GoogleFonts.outfit(
      fontSize: 18,
      fontWeight: FontWeight.bold,
      color: getTextColor(context),
      letterSpacing: -0.3,
    );
  }

  static TextStyle getSubtitleStyle(BuildContext context) {
    return GoogleFonts.outfit(
      fontSize: 14,
      color: getSubtitleColor(context),
      height: 1.4,
    );
  }

  static TextStyle getBodyStyle(BuildContext context) {
    return GoogleFonts.outfit(
      fontSize: 13.5,
      color: getTextColor(context),
    );
  }

  static TextStyle getCaptionStyle(BuildContext context) {
    return GoogleFonts.outfit(
      fontSize: 11.5,
      color: getSubtitleColor(context),
    );
  }

  static TextStyle get buttonTextStyle => GoogleFonts.outfit(
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  );

  static TextStyle getSkipButtonStyle(BuildContext context) {
    return GoogleFonts.outfit(
      color: getTextColor(context).withValues(alpha: 0.8),
      fontSize: 15,
      fontWeight: FontWeight.bold,
    );
  }
}
