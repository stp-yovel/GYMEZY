import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../theme/app_theme.dart';
import 'login_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<Map<String, dynamic>> onboardingData = [
    {
      "tag": "ALL-ACCESS NETWORK",
      "tagIcon": Icons.verified_rounded,
      "titlePrefix": "Fitness Freedom,\n",
      "titleHighlight": "Simplified.",
      "subtitle":
          "Discover premier gyms, state-of-the-art facilities, and certified personal coaches across your city. Train on your terms every day.",
      "image": "assets/pages/onboarding/onboarding_1.jpg",
      "floatingBadge": "50+ Verified Partner Gyms",
    },
    {
      "tag": "INSTANT PASSES",
      "tagIcon": Icons.bolt_rounded,
      "titlePrefix": "Book Any Workout,\n",
      "titleHighlight": "Instantly.",
      "subtitle":
          "Reserve single-session gym passes, yoga studios, HIIT, and Zumba classes in seconds with transparent pricing and zero lock-in contracts.",
      "image": "assets/pages/onboarding/onboarding_2.jpg",
      "floatingBadge": "Instant QR Entry • 0 Wait Time",
    },
    {
      "tag": "UNLIMITED ACCESS",
      "tagIcon": Icons.workspace_premium_rounded,
      "titlePrefix": "One Pass for,\n",
      "titleHighlight": "All Gyms.",
      "subtitle":
          "Manage your multi-gym passes, track booking schedules, and unlock exclusive member perks from one unified, seamless dashboard.",
      "image": "assets/pages/onboarding/onboarding_3.jpg",
      "floatingBadge": "1 Membership • Infinite Workouts",
    },
  ];

  void _onNext() {
    if (_currentPage == onboardingData.length - 1) {
      Navigator.pushReplacement(
        context,
        PageRouteBuilder(
          pageBuilder: (context, animation, secondaryAnimation) => const LoginScreen(),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            return FadeTransition(opacity: animation, child: child);
          },
          transitionDuration: const Duration(milliseconds: 600),
        ),
      );
    } else {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOutCubic,
      );
    }
  }

  void _onSkip() {
    _pageController.animateToPage(
      onboardingData.length - 1,
      duration: const Duration(milliseconds: 500),
      curve: Curves.easeInOutCubic,
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    // Luxury color palette
    final backgroundColor = isDark ? const Color(0xFF121212) : const Color(0xFFF8FAFC);
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A); // Deep Obsidian in Light Mode
    final highlightColor = isDark ? AppTheme.secondaryColor : const Color(0xFF059669); // Crisp Emerald
    final subtitleColor = isDark ? Colors.white70 : const Color(0xFF475569); // Slate-600
    final screenHeight = MediaQuery.of(context).size.height;

    return Scaffold(
      backgroundColor: backgroundColor,
      body: Column(
        children: [
          // 1. TOP HALF: Hero Image with Cinematic Vignette & Rounded Base (52% height)
          SizedBox(
            height: screenHeight * 0.52,
            child: Stack(
              fit: StackFit.expand,
              children: [
                // Background Image with AnimatedSwitcher cross-fade
                ClipRRect(
                  borderRadius: isDark
                      ? BorderRadius.zero
                      : const BorderRadius.vertical(bottom: Radius.circular(32)),
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 450),
                    transitionBuilder: (child, animation) {
                      return FadeTransition(opacity: animation, child: child);
                    },
                    child: Image.asset(
                      onboardingData[_currentPage]["image"] as String,
                      key: ValueKey<String>(onboardingData[_currentPage]["image"] as String),
                      fit: BoxFit.cover,
                      width: double.infinity,
                      height: double.infinity,
                    ),
                  ),
                ),

                // Cinematic Ambient Gradient (Preserves image sharpness while protecting overlays)
                ClipRRect(
                  borderRadius: isDark
                      ? BorderRadius.zero
                      : const BorderRadius.vertical(bottom: Radius.circular(32)),
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: isDark
                            ? [
                                Colors.black.withOpacity(0.50),
                                Colors.transparent,
                                backgroundColor.withOpacity(0.5),
                                backgroundColor,
                              ]
                            : [
                                Colors.black.withOpacity(0.40),
                                Colors.transparent,
                                Colors.black.withOpacity(0.15),
                                Colors.black.withOpacity(0.45),
                              ],
                        stops: isDark
                            ? const [0.0, 0.40, 0.75, 1.0]
                            : const [0.0, 0.35, 0.70, 1.0],
                      ),
                    ),
                  ),
                ),

                // Top Bar: Logo & Frosted Skip Button
                SafeArea(
                  child: Align(
                    alignment: Alignment.topCenter,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          // GYMEZY Silhouette Logo
                          Image.asset(
                            'assets/logo/gymezy.png',
                            height: 28,
                            color: Colors.white,
                          ),

                          // Frosted Skip Pill
                          if (_currentPage != onboardingData.length - 1)
                            ClipRRect(
                              borderRadius: BorderRadius.circular(20),
                              child: BackdropFilter(
                                filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                                child: GestureDetector(
                                  onTap: _onSkip,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                    decoration: BoxDecoration(
                                      color: Colors.black.withOpacity(0.30),
                                      borderRadius: BorderRadius.circular(20),
                                      border: Border.all(color: Colors.white30, width: 0.8),
                                    ),
                                    child: const Text(
                                      "Skip",
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                ),

                // Floating Frosted Feature Pill Badge
                Positioned(
                  bottom: 16,
                  left: 20,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(20),
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: (isDark ? const Color(0xFF1E1E1E) : Colors.white).withOpacity(0.92),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: isDark ? Colors.white12 : const Color(0xFFE2E8F0),
                            width: 1,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(isDark ? 0.3 : 0.08),
                              blurRadius: 16,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              onboardingData[_currentPage]["tagIcon"] as IconData,
                              color: highlightColor,
                              size: 16,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              onboardingData[_currentPage]["floatingBadge"] as String,
                              style: TextStyle(
                                color: isDark ? Colors.white : const Color(0xFF0F172A),
                                fontSize: 12.5,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 0.1,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ).animate(key: ValueKey<int>(_currentPage))
                      .fadeIn(duration: 350.ms)
                      .slideY(begin: 0.2, end: 0, curve: Curves.easeOutBack),
                ),
              ],
            ),
          ),

          // 2. BOTTOM HALF: Story Progress, PageView, and Actions (48% height)
          Expanded(
            child: Padding(
              padding: EdgeInsets.fromLTRB(
                24,
                16,
                24,
                MediaQuery.of(context).padding.bottom + 16,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Story-Style Segmented Progress Bar
                  Row(
                    children: [
                      Expanded(
                        child: Row(
                          children: List.generate(onboardingData.length, (index) {
                            final isActive = _currentPage == index;
                            return Expanded(
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 300),
                                height: 4.5,
                                margin: const EdgeInsets.only(right: 6),
                                decoration: BoxDecoration(
                                  color: isActive
                                      ? AppTheme.secondaryColor
                                      : (isDark ? Colors.white12 : const Color(0xFFE2E8F0)),
                                  borderRadius: BorderRadius.circular(3),
                                ),
                              ),
                            );
                          }),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Text(
                        "0${_currentPage + 1} / 0${onboardingData.length}",
                        style: TextStyle(
                          color: isDark ? Colors.white60 : const Color(0xFF64748B),
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.0,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Swipeable Content Area
                  Expanded(
                    child: PageView.builder(
                      controller: _pageController,
                      onPageChanged: (val) => setState(() => _currentPage = val),
                      itemCount: onboardingData.length,
                      physics: const BouncingScrollPhysics(),
                      itemBuilder: (context, index) {
                        final data = onboardingData[index];
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            // Tagline pill
                            Container(
                              child: Text(
                                data["tag"] as String,
                                style: TextStyle(
                                  color: isDark
                                      ? AppTheme.secondaryColor
                                      : const Color(0xFF047857),
                                  fontSize: 11,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 0.8,
                                ),
                              ),
                            ),

                            const SizedBox(height: 12),

                            // Dual-tone Headline
                            RichText(
                              text: TextSpan(
                                children: [
                                  TextSpan(
                                    text: data["titlePrefix"] as String,
                                    style: TextStyle(
                                      color: textColor,
                                      fontSize: 42,
                                      fontWeight: FontWeight.w900,
                                      letterSpacing: -0.5,
                                      height: 1.12,
                                    ),
                                  ),
                                  TextSpan(
                                    text: data["titleHighlight"] as String,
                                    style: TextStyle(
                                      color: highlightColor,
                                      fontSize: 32,
                                      fontWeight: FontWeight.w900,
                                      letterSpacing: -0.5,
                                      height: 1.12,
                                    ),
                                  ),
                                ],
                              ),
                            ),

                            const SizedBox(height: 10),

                            // Subtitle description
                            Text(
                              data["subtitle"] as String,
                              maxLines: 3,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                color: subtitleColor,
                                fontSize: 13.5,
                                height: 1.45,
                                letterSpacing: 0.1,
                              ),
                            ),
                          ],
                        );
                      },
                    ),
                  ),

                  const SizedBox(height: 12),

                  // Bottom Action Buttons
                  if (_currentPage == onboardingData.length - 1) ...[
                    // Full-width CTA on Final Slide
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: _onNext,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.secondaryColor,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              "Get Started with GYMEZY",
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 0.2,
                              ),
                            ),
                            SizedBox(width: 8),
                            Icon(Icons.arrow_forward_rounded, size: 18),
                          ],
                        ),
                      ),
                    ).animate().fadeIn(duration: 300.ms).slideY(begin: 0.1),
                  ] else ...[
                    // Next Action Row
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Swipe to explore",
                          style: TextStyle(
                            color: isDark ? Colors.white60 : const Color(0xFF94A3B8),
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        GestureDetector(
                          onTap: _onNext,
                          child: Container(
                            height: 48,
                            padding: const EdgeInsets.symmetric(horizontal: 22),
                            decoration: BoxDecoration(
                              color: AppTheme.primaryColor,
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: [
                                BoxShadow(
                                  color: AppTheme.primaryColor.withOpacity(0.25),
                                  blurRadius: 12,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: const Row(
                              children: [
                                Text(
                                  "Next",
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                SizedBox(width: 6),
                                Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 16),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
