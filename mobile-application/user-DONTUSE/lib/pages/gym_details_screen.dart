import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../models/gym.dart';
import '../theme/app_theme.dart';
import '../widgets/details_popups.dart';
import 'booking_session_screen.dart';
import 'buy_membership_screen.dart';
import '../widgets/scaffoldmessage.dart';

class GymDetailsScreen extends StatefulWidget {
  final Gym gym;

  const GymDetailsScreen({super.key, required this.gym});

  @override
  State<GymDetailsScreen> createState() => _GymDetailsScreenState();
}

class _GymDetailsScreenState extends State<GymDetailsScreen> {
  late bool _isBookmarked;

  @override
  void initState() {
    super.initState();
    _isBookmarked = widget.gym.isBookmarked;
  }

  // Helper navigation methods for circular back flows
  void _showAllTrainers(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => TrainersPopup(
        trainers: widget.gym.trainers,
        onTrainerTap: (trainer) {
          Navigator.pop(context); // Close All Trainers
          _showTrainerReviews(context, trainer); // Open specific reviews
        },
      ),
    );
  }

  void _showTrainerReviews(BuildContext context, Trainer trainer) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => TrainerReviewsPopup(
        trainer: trainer,
        reviews: widget.gym.reviews,
        onBack: () {
          Navigator.pop(context); // Close reviews sheet
          _showAllTrainers(context); // Reopen All Trainers sheet
        },
      ),
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
    final accentIconColor = isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor;

    return Scaffold(
      backgroundColor: backgroundColor,
      body: Stack(
        children: [
          // Parallax Scrollable Detailed Content
          CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              // 1. Collapsible Hero App Bar
              SliverAppBar(
                expandedHeight: 280,
                pinned: true,
                stretch: true,
                backgroundColor: isDark ? const Color(0xFF121212) : Colors.white,
                elevation: 0,
                leading: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Container(
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E1E1E).withOpacity(0.85) : Colors.white.withOpacity(0.92),
                      shape: BoxShape.circle,
                      border: Border.all(color: isDark ? Colors.white12 : Colors.black12, width: 1),
                    ),
                    child: IconButton(
                      icon: Icon(Icons.arrow_back_rounded, color: isDark ? Colors.white : AppTheme.getTextColor(context), size: 20),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  ),
                ),
                actions: [
                  Container(
                    margin: const EdgeInsets.symmetric(vertical: 8),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E1E1E).withOpacity(0.85) : Colors.white.withOpacity(0.92),
                      shape: BoxShape.circle,
                      border: Border.all(color: isDark ? Colors.white12 : Colors.black12, width: 1),
                    ),
                    child: IconButton(
                      icon: Icon(Icons.share_outlined, color: isDark ? Colors.white : AppTheme.getTextColor(context), size: 18),
                      onPressed: () {
                        CustomScaffoldMessage.show(
                          context,
                          message: "Link copied to clipboard!",
                          isSuccess: true,
                        );
                      },
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    margin: const EdgeInsets.symmetric(vertical: 8),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E1E1E).withOpacity(0.85) : Colors.white.withOpacity(0.92),
                      shape: BoxShape.circle,
                      border: Border.all(color: isDark ? Colors.white12 : Colors.black12, width: 1),
                    ),
                    child: IconButton(
                      icon: Icon(
                        _isBookmarked ? Icons.bookmark_rounded : Icons.bookmark_border_rounded,
                        color: _isBookmarked ? AppTheme.secondaryColor : (isDark ? Colors.white : AppTheme.getTextColor(context)),
                        size: 20,
                      ),
                      onPressed: () {
                        setState(() {
                          _isBookmarked = !_isBookmarked;
                        });
                      },
                    ),
                  ),
                  const SizedBox(width: 16),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  stretchModes: const [StretchMode.zoomBackground, StretchMode.blurBackground],
                  background: Stack(
                    fit: StackFit.expand,
                    children: [
                      Image.network(
                        widget.gym.imageUrl,
                        fit: BoxFit.cover,
                      ),
                      // Gradient scrim
                      Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.black.withOpacity(0.4),
                              Colors.transparent,
                              Colors.black.withOpacity(0.7),
                            ],
                            stops: const [0.0, 0.5, 1.0],
                          ),
                        ),
                      ),
                      // Gallery count pill
                      Positioned(
                        bottom: 16,
                        right: 16,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.65),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: Colors.white24, width: 0.8),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.photo_library_outlined, color: Colors.white, size: 13),
                              SizedBox(width: 5),
                              Text(
                                "1 / 15 Photos",
                                style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // 2. Main Body Content
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16.0, 16.0, 16.0, 120.0), // Padding for persistent bottom bar
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Gym Title & Verification
                      _buildHeaderSection(context, textColor)
                          .animate()
                          .fadeIn(duration: 350.ms)
                          .slideY(begin: 0.05),

                      const SizedBox(height: 14),

                      // Key Quick Metric Badges Row
                      _buildKeyMetricBadges(context, isDark, textColor, subtitleColor, borderColor, accentIconColor)
                          .animate()
                          .fadeIn(delay: 50.ms, duration: 350.ms),

                      const SizedBox(height: 20),

                      // Location & Hours Card
                      _buildLocationAndHoursCard(context, cardColor, textColor, subtitleColor, borderColor, accentIconColor, isDark)
                          .animate()
                          .fadeIn(delay: 100.ms, duration: 350.ms),

                      const SizedBox(height: 24),

                      // Workouts Offered
                      _buildFeatureGrid(
                        context: context,
                        title: "Workouts Offered",
                        cardColor: cardColor,
                        textColor: textColor,
                        borderColor: borderColor,
                        accentIconColor: accentIconColor,
                        isDark: isDark,
                        items: widget.gym.workouts.take(3).toList(),
                        iconMap: {
                          "GYM": Icons.fitness_center_rounded,
                          "Yoga": Icons.self_improvement_rounded,
                          "Zumba": Icons.music_note_rounded,
                        },
                        onViewAll: () {
                          showModalBottomSheet(
                            context: context,
                            isScrollControlled: true,
                            backgroundColor: Colors.transparent,
                            builder: (context) => WorkoutsPopup(workouts: widget.gym.workouts),
                          );
                        },
                      ).animate().fadeIn(delay: 150.ms, duration: 350.ms),

                      const SizedBox(height: 24),

                      // Facilities Section
                      _buildFeatureGrid(
                        context: context,
                        title: "Facilities",
                        cardColor: cardColor,
                        textColor: textColor,
                        borderColor: borderColor,
                        accentIconColor: accentIconColor,
                        isDark: isDark,
                        items: widget.gym.facilities.take(3).toList(),
                        iconMap: {
                          "AC Gym": Icons.ac_unit_rounded,
                          "Locker Facility": Icons.lock_outline_rounded,
                          "Shower Available": Icons.shower_rounded,
                        },
                        onViewAll: () {
                          showModalBottomSheet(
                            context: context,
                            isScrollControlled: true,
                            backgroundColor: Colors.transparent,
                            builder: (context) => FacilitiesPopup(facilities: widget.gym.facilities),
                          );
                        },
                      ).animate().fadeIn(delay: 200.ms, duration: 350.ms),

                      const SizedBox(height: 24),

                      // Amenities Section
                      _buildFeatureGrid(
                        context: context,
                        title: "Amenities",
                        cardColor: cardColor,
                        textColor: textColor,
                        borderColor: borderColor,
                        accentIconColor: accentIconColor,
                        isDark: isDark,
                        items: widget.gym.amenities.take(3).toList(),
                        iconMap: {
                          "Drinking Water": Icons.local_drink_rounded,
                          "Towel Service": Icons.layers_rounded,
                          "Parking Available": Icons.local_parking_rounded,
                        },
                        onViewAll: () {
                          showModalBottomSheet(
                            context: context,
                            isScrollControlled: true,
                            backgroundColor: Colors.transparent,
                            builder: (context) => AmenitiesPopup(amenities: widget.gym.amenities),
                          );
                        },
                      ).animate().fadeIn(delay: 250.ms, duration: 350.ms),

                      const SizedBox(height: 24),

                      // About Section
                      _buildAboutSection(context, textColor, subtitleColor)
                          .animate()
                          .fadeIn(delay: 300.ms, duration: 350.ms),

                      const SizedBox(height: 24),

                      // Trainers Spotlight
                      if (widget.gym.trainers.isNotEmpty) ...[
                        _buildTrainersSection(context, cardColor, textColor, subtitleColor, borderColor)
                            .animate()
                            .fadeIn(delay: 350.ms, duration: 350.ms),
                        const SizedBox(height: 24),
                      ],

                      // Rating & Reviews Section
                      _buildReviewsSection(context, cardColor, textColor, subtitleColor, borderColor, isDark)
                          .animate()
                          .fadeIn(delay: 400.ms, duration: 350.ms),

                      const SizedBox(height: 24),

                      // Rules & Safety Guidelines
                      _buildGuidelinesSection(context, cardColor, textColor, subtitleColor, borderColor, accentIconColor)
                          .animate()
                          .fadeIn(delay: 450.ms, duration: 350.ms),
                    ],
                  ),
                ),
              ),
            ],
          ),

          // Persistent High-Converting Bottom Action Bar
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: _buildBottomActionBar(context, cardColor, isDark, borderColor),
          ),
        ],
      ),
    );
  }

  // 1. Gym Header Title & Status
  Widget _buildHeaderSection(BuildContext context, Color textColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                widget.gym.name,
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                  letterSpacing: -0.4,
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF00BF62).withOpacity(0.12),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.circle, color: AppTheme.secondaryColor, size: 7),
                  SizedBox(width: 5),
                  Text(
                    "Open Now",
                    style: TextStyle(
                      color: AppTheme.secondaryColor,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        Row(
          children: [
            Icon(Icons.location_on_outlined, color: AppTheme.getSubtitleColor(context), size: 15),
            const SizedBox(width: 3),
            Text(
              widget.gym.location,
              style: TextStyle(
                fontSize: 13,
                color: AppTheme.getSubtitleColor(context),
              ),
            ),
            const SizedBox(width: 8),
            Text("•", style: TextStyle(color: AppTheme.getSubtitleColor(context))),
            const SizedBox(width: 8),
            const Icon(Icons.verified_rounded, color: AppTheme.secondaryColor, size: 15),
            const SizedBox(width: 3),
            const Text(
              "Verified Gym",
              style: TextStyle(
                color: AppTheme.secondaryColor,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ],
    );
  }

  // 2. Key Metric Badges Row
  Widget _buildKeyMetricBadges(
      BuildContext context, bool isDark, Color textColor, Color subtitleColor, Color borderColor, Color accentIconColor) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      physics: const BouncingScrollPhysics(),
      child: Row(
        children: [
          // Price Badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E1E1E) : const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: borderColor),
            ),
            child: Row(
              children: [
                const Icon(Icons.bolt_rounded, color: AppTheme.secondaryColor, size: 16),
                const SizedBox(width: 4),
                RichText(
                  text: TextSpan(
                    children: [
                      TextSpan(
                        text: "₹${widget.gym.pricePerSession.toInt()}",
                        style: TextStyle(
                          color: textColor,
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      TextSpan(
                        text: " /session",
                        style: TextStyle(
                          color: subtitleColor,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),

          // Rating Badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E1E1E) : const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: borderColor),
            ),
            child: Row(
              children: [
                const Icon(Icons.star_rounded, color: Colors.amber, size: 16),
                const SizedBox(width: 4),
                Text(
                  "${widget.gym.rating} (${widget.gym.reviewsCount})",
                  style: TextStyle(color: textColor, fontSize: 12, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),

          // Distance Badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E1E1E) : const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: borderColor),
            ),
            child: Row(
              children: [
                Icon(Icons.near_me_rounded, color: accentIconColor, size: 14),
                const SizedBox(width: 4),
                Text(
                  "${widget.gym.distance} km",
                  style: TextStyle(color: textColor, fontSize: 12, fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),

          // Instant Pass Badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
            decoration: BoxDecoration(
              color: const Color(0xFF00BF62).withOpacity(0.12),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Row(
              children: [
                Icon(Icons.flash_on_rounded, color: AppTheme.secondaryColor, size: 14),
                SizedBox(width: 4),
                Text(
                  "Instant Pass",
                  style: TextStyle(color: AppTheme.secondaryColor, fontSize: 12, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // 3. Location & Timings Card
  Widget _buildLocationAndHoursCard(
      BuildContext context, Color cardColor, Color textColor, Color subtitleColor, Color borderColor, Color accentIconColor, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        children: [
          // Address Row
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E3A8A).withOpacity(0.35) : AppTheme.primaryColor.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(Icons.location_on_rounded, color: accentIconColor, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Address",
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: subtitleColor),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      widget.gym.fullAddress,
                      style: TextStyle(fontSize: 13, color: textColor, height: 1.3),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 6),
              OutlinedButton(
                onPressed: () {
                  CustomScaffoldMessage.show(
                    context,
                    message: "Opening Maps Directions...",
                    isSuccess: true,
                  );
                },
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: accentIconColor),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  minimumSize: Size.zero,
                ),
                child: Text("Directions", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: accentIconColor)),
              ),
            ],
          ),

          Padding(
            padding: const EdgeInsets.symmetric(vertical: 12.0),
            child: Divider(height: 1, color: borderColor),
          ),

          // Opening Hours Row
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppTheme.secondaryColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.access_time_filled_rounded, color: AppTheme.secondaryColor, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Operating Hours",
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: subtitleColor),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      widget.gym.openingHours,
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: textColor),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // 4. Feature Grid (Facilities, Amenities, Workouts)
  Widget _buildFeatureGrid({
    required BuildContext context,
    required String title,
    required Color cardColor,
    required Color textColor,
    required Color borderColor,
    required Color accentIconColor,
    required bool isDark,
    required List<String> items,
    required Map<String, IconData> iconMap,
    required VoidCallback onViewAll,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: textColor),
            ),
            GestureDetector(
              onTap: onViewAll,
              child: const Text(
                "View All",
                style: TextStyle(color: AppTheme.secondaryColor, fontSize: 13, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: items.map((item) {
            final icon = iconMap[item] ?? Icons.fitness_center_rounded;
            return Expanded(
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 4),
                padding: const EdgeInsets.symmetric(vertical: 16),
                decoration: BoxDecoration(
                  color: cardColor,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: borderColor),
                ),
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1E3A8A).withOpacity(0.35) : AppTheme.primaryColor.withOpacity(0.08),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(icon, color: accentIconColor, size: 22),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      item,
                      style: TextStyle(color: textColor, fontSize: 12, fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  // 5. About Section
  Widget _buildAboutSection(BuildContext context, Color textColor, Color subtitleColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "About ${widget.gym.name}",
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: textColor),
        ),
        const SizedBox(height: 8),
        Text(
          widget.gym.aboutText,
          style: TextStyle(color: subtitleColor, fontSize: 13, height: 1.5),
        ),
      ],
    );
  }

  // 6. Trainers Section
  Widget _buildTrainersSection(
      BuildContext context, Color cardColor, Color textColor, Color subtitleColor, Color borderColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              "Certified Trainers",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: textColor),
            ),
            GestureDetector(
              onTap: () => _showAllTrainers(context),
              child: const Text(
                "View All",
                style: TextStyle(color: AppTheme.secondaryColor, fontSize: 13, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: widget.gym.trainers.take(2).map((trainer) {
            return Expanded(
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 4),
                decoration: BoxDecoration(
                  color: cardColor,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: borderColor),
                ),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    borderRadius: BorderRadius.circular(18),
                    onTap: () => _showTrainerReviews(context, trainer),
                    child: Padding(
                      padding: const EdgeInsets.all(12.0),
                      child: Row(
                        children: [
                          ClipOval(
                            child: Image.network(
                              trainer.imageUrl,
                              width: 44,
                              height: 44,
                              fit: BoxFit.cover,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  trainer.name,
                                  style: TextStyle(color: textColor, fontSize: 12, fontWeight: FontWeight.bold),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  "${trainer.experienceYears} Yrs Exp.",
                                  style: TextStyle(color: subtitleColor, fontSize: 10),
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    const Icon(Icons.star_rounded, color: Colors.amber, size: 12),
                                    const SizedBox(width: 2),
                                    Text(
                                      "${trainer.rating}",
                                      style: TextStyle(color: textColor, fontSize: 10, fontWeight: FontWeight.bold),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  // 7. Reviews Section
  Widget _buildReviewsSection(
      BuildContext context, Color cardColor, Color textColor, Color subtitleColor, Color borderColor, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              "Reviews & Ratings",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: textColor),
            ),
            GestureDetector(
              onTap: () {
                showModalBottomSheet(
                  context: context,
                  isScrollControlled: true,
                  backgroundColor: Colors.transparent,
                  builder: (context) => AllReviewsPopup(
                    rating: widget.gym.rating,
                    reviewsCount: widget.gym.reviewsCount,
                    reviews: widget.gym.reviews,
                  ),
                );
              },
              child: const Text(
                "View All",
                style: TextStyle(color: AppTheme.secondaryColor, fontSize: 13, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),

        // Rating Overview Card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: cardColor,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: borderColor),
          ),
          child: Row(
            children: [
              Column(
                children: [
                  Text(
                    widget.gym.rating.toString(),
                    style: TextStyle(fontSize: 38, fontWeight: FontWeight.bold, color: textColor, height: 1.0),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: List.generate(
                      5,
                      (i) => Icon(
                        i < widget.gym.rating.floor() ? Icons.star_rounded : Icons.star_border_rounded,
                        color: Colors.amber,
                        size: 16,
                      ),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    "${widget.gym.reviewsCount} reviews",
                    style: TextStyle(color: subtitleColor, fontSize: 11),
                  )
                ],
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(
                  children: [
                    _buildHistogramRow(context, 5, 0.70, "70%", borderColor, isDark),
                    _buildHistogramRow(context, 4, 0.20, "20%", borderColor, isDark),
                    _buildHistogramRow(context, 3, 0.06, "6%", borderColor, isDark),
                    _buildHistogramRow(context, 2, 0.02, "2%", borderColor, isDark),
                    _buildHistogramRow(context, 1, 0.02, "2%", borderColor, isDark),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),
        ...widget.gym.reviews.take(2).map((rev) {
          return Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: cardColor,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        ClipOval(
                          child: Image.network(
                            rev.userImageUrl,
                            width: 34,
                            height: 34,
                            fit: BoxFit.cover,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              rev.userName,
                              style: TextStyle(color: textColor, fontSize: 13, fontWeight: FontWeight.bold),
                            ),
                            Row(
                              children: List.generate(
                                5,
                                (i) => Icon(
                                  i < rev.rating.floor() ? Icons.star_rounded : Icons.star_border_rounded,
                                  color: Colors.amber,
                                  size: 11,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    Text(
                      rev.date,
                      style: TextStyle(color: subtitleColor, fontSize: 11),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  rev.comment,
                  style: TextStyle(color: textColor, fontSize: 12, height: 1.4),
                ),
              ],
            ),
          );
        }).toList(),
      ],
    );
  }

  Widget _buildHistogramRow(
      BuildContext context, int stars, double ratio, String percent, Color borderColor, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2.0),
      child: Row(
        children: [
          Text(
            stars.toString(),
            style: TextStyle(color: AppTheme.getTextColor(context), fontSize: 10, fontWeight: FontWeight.bold),
          ),
          const SizedBox(width: 4),
          const Icon(Icons.star_rounded, color: Colors.amber, size: 10),
          const SizedBox(width: 8),
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(3),
              child: LinearProgressIndicator(
                value: ratio,
                backgroundColor: borderColor,
                valueColor: AlwaysStoppedAnimation<Color>(isDark ? AppTheme.secondaryColor : AppTheme.primaryColor),
                minHeight: 5,
              ),
            ),
          ),
          const SizedBox(width: 8),
          SizedBox(
            width: 25,
            child: Text(
              percent,
              style: TextStyle(color: AppTheme.getSubtitleColor(context), fontSize: 10),
              textAlign: TextAlign.right,
            ),
          )
        ],
      ),
    );
  }

  // 8. Rules & Safety Section
  Widget _buildGuidelinesSection(
      BuildContext context, Color cardColor, Color textColor, Color subtitleColor, Color borderColor, Color accentIconColor) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Rules Card
        Expanded(
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: cardColor,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Gym Rules",
                  style: TextStyle(color: textColor, fontSize: 13, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                ...widget.gym.rules.take(3).map(
                  (rule) => Padding(
                    padding: const EdgeInsets.only(bottom: 6.0),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(Icons.check_circle_rounded, color: accentIconColor, size: 13),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            rule,
                            style: TextStyle(color: subtitleColor, fontSize: 10, height: 1.3),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                GestureDetector(
                  onTap: () {
                    showModalBottomSheet(
                      context: context,
                      isScrollControlled: true,
                      backgroundColor: Colors.transparent,
                      builder: (context) => RulesPopup(rules: widget.gym.rules),
                    );
                  },
                  child: Text("View All Rules →", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: accentIconColor)),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 10),

        // Safety Card
        Expanded(
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: cardColor,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Safety Measures",
                  style: TextStyle(color: textColor, fontSize: 13, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                ...widget.gym.safety.take(3).map(
                  (saf) => Padding(
                    padding: const EdgeInsets.only(bottom: 6.0),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(Icons.verified_user_rounded, color: AppTheme.secondaryColor, size: 13),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            saf,
                            style: TextStyle(color: subtitleColor, fontSize: 10, height: 1.3),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                GestureDetector(
                  onTap: () {
                    showModalBottomSheet(
                      context: context,
                      isScrollControlled: true,
                      backgroundColor: Colors.transparent,
                      builder: (context) => SafetyPopup(safety: widget.gym.safety),
                    );
                  },
                  child: const Text("View All Safety →", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.secondaryColor)),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // 9. Persistent Bottom Booking Bar with Gradient Blur (Bottom to Top)
  Widget _buildBottomActionBar(
      BuildContext context, Color cardColor, bool isDark, Color borderColor) {
    final buttonTextColor = isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor;
    final buttonBorderColor = isDark ? const Color(0xFF93C5FD).withOpacity(0.8) : AppTheme.primaryColor;
    final bgColor = isDark ? const Color(0xFF121212) : Colors.white;

    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
        child: Container(
          padding: EdgeInsets.fromLTRB(16, 12, 16, MediaQuery.of(context).padding.bottom + 12),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                bgColor.withOpacity(0.0), // Fully transparent at top
                bgColor.withOpacity(isDark ? 0.70 : 0.80),
                bgColor.withOpacity(isDark ? 0.92 : 0.95), // Tinted at bottom
              ],
              stops: const [0.0, 0.35, 1.0],
            ),
          ),
          child: Row(
            children: [
              // Phone inquiry button with frosted background
              Container(
                height: 48,
                width: 48,
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E1E1E).withOpacity(0.85) : Colors.white.withOpacity(0.85),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: isDark ? Colors.white12 : const Color(0xFFE2E8F0)),
                ),
                child: IconButton(
                  icon: Icon(Icons.phone_outlined, color: isDark ? Colors.white : AppTheme.primaryColor, size: 20),
                  onPressed: () {
                    CustomScaffoldMessage.show(
                      context,
                      message: "Calling gym front desk...",
                    );
                  },
                ),
              ),
              const SizedBox(width: 8),

              // 1. "Book Session" Outlined Button (Brand Navy Blue)
              Expanded(
                child: Container(
                  height: 48,
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF1E1E1E).withOpacity(0.5) : Colors.white.withOpacity(0.8),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: buttonBorderColor, width: 1.5),
                  ),
                  child: TextButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => BookingSessionScreen(gym: widget.gym),
                        ),
                      );
                    },
                    icon: Icon(Icons.calendar_today_outlined, color: buttonTextColor, size: 16),
                    label: Text(
                      "Book Session",
                      style: TextStyle(
                        color: buttonTextColor,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    style: TextButton.styleFrom(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),

              // 2. "Buy Membership" Filled Button (Brand Emerald Green)
              Expanded(
                child: Container(
                  height: 48,
                  decoration: BoxDecoration(
                    color: AppTheme.secondaryColor,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => BuyMembershipScreen(gym: widget.gym),
                        ),
                      );
                    },
                    icon: const Icon(Icons.workspace_premium_outlined, color: Colors.white, size: 18),
                    label: const Text(
                      "Buy Membership",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shadowColor: Colors.transparent,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
