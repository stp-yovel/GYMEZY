import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../theme/app_theme.dart';
import 'onboarding_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();

    // Navigate to OnboardingScreen after 3 seconds to allow animations to play
    Timer(const Duration(milliseconds: 3000), () {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          PageRouteBuilder(
            pageBuilder: (context, animation, secondaryAnimation) => const OnboardingScreen(),
            transitionsBuilder: (context, animation, secondaryAnimation, child) {
              return FadeTransition(
                opacity: animation,
                child: child,
              );
            },
            transitionDuration: const Duration(milliseconds: 800),
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          image: DecorationImage(
            image: const AssetImage('assets/pages/splash_screen/splashscreen_background.png'),
            fit: BoxFit.cover,
            colorFilter: ColorFilter.mode(
              isDark
                  ? Colors.black.withOpacity(0.65) // Dark cinematic tint
                  : Colors.white.withOpacity(0.88), // Clean white tint in Light mode
              isDark ? BlendMode.darken : BlendMode.lighten,
            ),
          ),
        ),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // 1. Sleek Monochromatic Logo Silhouette
              Image.asset(
                'assets/logo/gymezy.png',
                color: isDark
                    ? Colors.white // White logo in Dark Mode
                    : AppTheme.primaryColor, // Navy Blue logo in Light Mode
                width: 140,
                height: 140,
                fit: BoxFit.contain,
              )
              .animate()
              .fadeIn(duration: 800.ms, curve: Curves.easeOut)
              .scale(begin: const Offset(0.7, 0.7), duration: 1000.ms, curve: Curves.easeOutBack) // Subtle pop bounce
              .shimmer(
                delay: 1000.ms,
                duration: 1500.ms,
                color: isDark ? Colors.white30 : AppTheme.secondaryColor.withOpacity(0.4),
              ), // Shimmer reflection

              const SizedBox(height: 35),

              // 2. Elegant sliding tagline
              Text(
                "PREMIUM FITNESS",
                style: TextStyle(
                  color: isDark ? Colors.white : AppTheme.primaryColor,
                  letterSpacing: 8,
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              )
              .animate()
              .fadeIn(delay: 600.ms, duration: 800.ms)
              .slideY(begin: 0.5, curve: Curves.easeOut),
            ],
          ),
        ),
      ),
    );
  }
}
