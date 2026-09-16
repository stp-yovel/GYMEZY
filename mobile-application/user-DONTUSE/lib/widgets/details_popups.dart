import 'package:flutter/material.dart';
import '../models/gym.dart';
import '../theme/app_theme.dart';

// Helper method to wrap modal layout with standard rounded top container, scroll physics, and persistent buttons
Widget _buildBasePopup({
  required BuildContext context,
  required String title,
  required Widget content,
}) {
  final backgroundColor = AppTheme.getBackgroundColor(context);
  final textColor = AppTheme.getTextColor(context);

  return Container(
    height: MediaQuery.of(context).size.height * 0.85,
    decoration: BoxDecoration(
      color: backgroundColor,
      borderRadius: const BorderRadius.vertical(top: Radius.circular(25)),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Header
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 16, 16, 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: textColor),
              ),
              IconButton(
                icon: Icon(Icons.close, color: textColor),
                onPressed: () => Navigator.pop(context),
              )
            ],
          ),
        ),

        // Scrollable content
        Expanded(
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: content,
          ),
        ),

        // Persistent Close Button
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 30),
          child: Container(
            height: 48,
            decoration: BoxDecoration(
              border: Border.all(color: AppTheme.accentColor),
              borderRadius: BorderRadius.circular(15),
            ),
            child: TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text(
                "Close",
                style: TextStyle(color: AppTheme.accentColor, fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ),
          ),
        ),
      ],
    ),
  );
}

// 1. All Facilities Popup
class FacilitiesPopup extends StatelessWidget {
  final List<String> facilities;
  const FacilitiesPopup({super.key, required this.facilities});

  static final Map<String, String> _desc = {
    "AC Gym": "Fully air-conditioned workout area",
    "Locker Facility": "Secure lockers for your belongings",
    "Shower Available": "Clean showers available",
    "Changing Room": "Spacious and clean changing rooms",
    "Free Wi-Fi": "High-speed internet for members",
    "Music System": "Premium sound system",
  };

  static final Map<String, IconData> _icons = {
    "AC Gym": Icons.ac_unit,
    "Locker Facility": Icons.lock_outline,
    "Shower Available": Icons.shower_outlined,
    "Changing Room": Icons.checkroom,
    "Free Wi-Fi": Icons.wifi,
    "Music System": Icons.music_note,
  };

  @override
  Widget build(BuildContext context) {
    final cardColor = AppTheme.getCardColor(context);
    final textColor = AppTheme.getTextColor(context);
    final subtitleColor = AppTheme.getSubtitleColor(context);

    return _buildBasePopup(
      context: context,
      title: "All Facilities",
      content: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
          childAspectRatio: 1,
        ),
        itemCount: facilities.length,
        itemBuilder: (context, index) {
          final item = facilities[index];
          final descText = _desc[item] ?? "Available feature";
          final icon = _icons[item] ?? Icons.help_outline;

          return Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: cardColor,
              borderRadius: BorderRadius.circular(15),
              border: Border.all(color: AppTheme.getInactiveChipBorder(context)),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(icon, color: AppTheme.accentColor, size: 28),
                const SizedBox(height: 8),
                Text(
                  item,
                  style: TextStyle(color: textColor, fontSize: 13, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 4),
                Text(
                  descText,
                  style: TextStyle(color: subtitleColor, fontSize: 10),
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

// 2. All Amenities Popup
class AmenitiesPopup extends StatelessWidget {
  final List<String> amenities;
  const AmenitiesPopup({super.key, required this.amenities});

  static final Map<String, String> _desc = {
    "Drinking Water": "RO purified drinking water",
    "Towel Service": "Clean towels provided",
    "Parking Available": "Safe vehicle parking",
    "Air Conditioned": "Comfortable AC environment",
    "Protein Bar": "Healthy protein snacks & drinks",
    "Juice Bar": "Fresh juices and shakes",
    "First Aid Kit": "First aid kit available",
    "Weighing Machine": "Body weight monitoring",
  };

  static final Map<String, IconData> _icons = {
    "Drinking Water": Icons.water_drop_outlined,
    "Towel Service": Icons.dry_cleaning_outlined,
    "Parking Available": Icons.local_parking,
    "Air Conditioned": Icons.ac_unit,
    "Protein Bar": Icons.restaurant_menu_outlined,
    "Juice Bar": Icons.local_cafe_outlined,
    "First Aid Kit": Icons.medical_services_outlined,
    "Weighing Machine": Icons.monitor_weight_outlined,
  };

  @override
  Widget build(BuildContext context) {
    final cardColor = AppTheme.getCardColor(context);
    final textColor = AppTheme.getTextColor(context);
    final subtitleColor = AppTheme.getSubtitleColor(context);

    return _buildBasePopup(
      context: context,
      title: "All Amenities",
      content: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
          childAspectRatio: 1,
        ),
        itemCount: amenities.length,
        itemBuilder: (context, index) {
          final item = amenities[index];
          final descText = _desc[item] ?? "Available feature";
          final icon = _icons[item] ?? Icons.help_outline;

          return Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: cardColor,
              borderRadius: BorderRadius.circular(15),
              border: Border.all(color: AppTheme.getInactiveChipBorder(context)),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(icon, color: AppTheme.accentColor, size: 28),
                const SizedBox(height: 8),
                Text(
                  item,
                  style: TextStyle(color: textColor, fontSize: 13, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 4),
                Text(
                  descText,
                  style: TextStyle(color: subtitleColor, fontSize: 10),
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

// 3. All Workouts Offered Popup
class WorkoutsPopup extends StatelessWidget {
  final List<String> workouts;
  const WorkoutsPopup({super.key, required this.workouts});

  static final Map<String, String> _desc = {
    "GYM": "Strength & conditioning workouts",
    "Yoga": "Improve flexibility, strength & balance",
    "Zumba": "Fun dance workout for all",
    "HIIT": "High intensity interval training",
    "CrossFit": "Functional training for all fitness levels",
    "Dance": "Various dance workout styles",
    "Pilates": "Core strength & posture",
    "Boxing": "Cardio & strength boxing training",
    "Functional Training": "Full body functional exercises",
    "Core Training": "Focus on core strength",
  };

  static final Map<String, IconData> _icons = {
    "GYM": Icons.fitness_center,
    "Yoga": Icons.self_improvement,
    "Zumba": Icons.sports_gymnastics,
    "HIIT": Icons.directions_run,
    "CrossFit": Icons.fitness_center,
    "Dance": Icons.music_note,
    "Pilates": Icons.accessibility,
    "Boxing": Icons.sports_mma,
    "Functional Training": Icons.sports_kabaddi,
    "Core Training": Icons.center_focus_strong,
  };

  @override
  Widget build(BuildContext context) {
    final cardColor = AppTheme.getCardColor(context);
    final textColor = AppTheme.getTextColor(context);
    final subtitleColor = AppTheme.getSubtitleColor(context);

    return _buildBasePopup(
      context: context,
      title: "All Workouts Offered",
      content: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
          childAspectRatio: 1,
        ),
        itemCount: workouts.length,
        itemBuilder: (context, index) {
          final item = workouts[index];
          final descText = _desc[item] ?? "Training course";
          final icon = _icons[item] ?? Icons.help_outline;

          return Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: cardColor,
              borderRadius: BorderRadius.circular(15),
              border: Border.all(color: AppTheme.getInactiveChipBorder(context)),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(icon, color: AppTheme.accentColor, size: 28),
                const SizedBox(height: 8),
                Text(
                  item,
                  style: TextStyle(color: textColor, fontSize: 13, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 4),
                Text(
                  descText,
                  style: TextStyle(color: subtitleColor, fontSize: 10),
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

// 4. All Trainers Popup
class TrainersPopup extends StatelessWidget {
  final List<Trainer> trainers;
  final Function(Trainer) onTrainerTap;

  const TrainersPopup({super.key, required this.trainers, required this.onTrainerTap});

  @override
  Widget build(BuildContext context) {
    final cardColor = AppTheme.getCardColor(context);
    final textColor = AppTheme.getTextColor(context);
    final subtitleColor = AppTheme.getSubtitleColor(context);

    return _buildBasePopup(
      context: context,
      title: "All Trainers",
      content: ListView.builder(
        itemCount: trainers.length,
        itemBuilder: (context, index) {
          final trainer = trainers[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            decoration: BoxDecoration(
              color: cardColor,
              borderRadius: BorderRadius.circular(15),
              border: Border.all(color: AppTheme.getInactiveChipBorder(context)),
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                borderRadius: BorderRadius.circular(15),
                onTap: () => onTrainerTap(trainer),
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Row(
                    children: [
                      ClipOval(
                        child: Image.network(
                          trainer.imageUrl,
                          width: 55,
                          height: 55,
                          fit: BoxFit.cover,
                        ),
                      ),
                      const SizedBox(width: 15),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              trainer.name,
                              style: TextStyle(color: textColor, fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                Text(
                                  "${trainer.experienceYears} Yrs Exp.",
                                  style: TextStyle(color: subtitleColor, fontSize: 12),
                                ),
                                const SizedBox(width: 8),
                                Text("•", style: TextStyle(color: subtitleColor)),
                                const SizedBox(width: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: AppTheme.lightAccentColor,
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    trainer.specialty,
                                    style: const TextStyle(color: AppTheme.accentColor, fontSize: 9, fontWeight: FontWeight.bold),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Row(
                              children: [
                                const Icon(Icons.star, color: Colors.amber, size: 14),
                                const SizedBox(width: 2),
                                Text(
                                  "${trainer.rating} (${trainer.reviewsCount})",
                                  style: TextStyle(color: textColor, fontSize: 12, fontWeight: FontWeight.bold),
                                ),
                              ],
                            )
                          ],
                        ),
                      ),
                      Icon(Icons.chevron_right, color: AppTheme.accentColor, size: 24),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

// 5. Trainer Reviews Popup ( रोहित शर्मा reviews, etc.)
class TrainerReviewsPopup extends StatelessWidget {
  final Trainer trainer;
  final List<GymReview> reviews;
  final VoidCallback onBack;

  const TrainerReviewsPopup({
    super.key,
    required this.trainer,
    required this.reviews,
    required this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    final backgroundColor = AppTheme.getBackgroundColor(context);
    final cardColor = AppTheme.getCardColor(context);
    final textColor = AppTheme.getTextColor(context);
    final subtitleColor = AppTheme.getSubtitleColor(context);

    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(25)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header with Back Button
          Padding(
            padding: const EdgeInsets.fromLTRB(8, 16, 16, 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    IconButton(
                      icon: Icon(Icons.arrow_back, color: textColor),
                      onPressed: onBack,
                    ),
                    Text(
                      "All Trainer Reviews",
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: textColor),
                    ),
                  ],
                ),
                IconButton(
                  icon: Icon(Icons.close, color: textColor),
                  onPressed: () => Navigator.pop(context),
                )
              ],
            ),
          ),

          // Content Scroll
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Trainer Header Card
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: cardColor,
                        borderRadius: BorderRadius.circular(15),
                        border: Border.all(color: AppTheme.getInactiveChipBorder(context)),
                      ),
                      child: Row(
                        children: [
                          ClipOval(
                            child: Image.network(
                              trainer.imageUrl,
                              width: 60,
                              height: 60,
                              fit: BoxFit.cover,
                            ),
                          ),
                          const SizedBox(width: 15),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  trainer.name,
                                  style: TextStyle(color: textColor, fontSize: 18, fontWeight: FontWeight.bold),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  "${trainer.specialty} Specialist",
                                  style: TextStyle(color: subtitleColor, fontSize: 12),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  "${trainer.experienceYears} Years Experience",
                                  style: TextStyle(color: subtitleColor, fontSize: 12),
                                ),
                                const SizedBox(height: 6),
                                Row(
                                  children: [
                                    const Icon(Icons.star, color: Colors.amber, size: 14),
                                    const SizedBox(width: 2),
                                    Text(
                                      "${trainer.rating} (${trainer.reviewsCount} Reviews)",
                                      style: TextStyle(color: textColor, fontSize: 12, fontWeight: FontWeight.bold),
                                    ),
                                  ],
                                )
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // List of Reviews
                    ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: reviews.length,
                      itemBuilder: (context, index) {
                        final rev = reviews[index];
                        return Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: cardColor,
                            borderRadius: BorderRadius.circular(15),
                            border: Border.all(color: AppTheme.getInactiveChipBorder(context)),
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
                                          width: 32,
                                          height: 32,
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            rev.userName,
                                            style: TextStyle(color: textColor, fontSize: 12, fontWeight: FontWeight.bold),
                                          ),
                                          const SizedBox(height: 2),
                                          Row(
                                            children: List.generate(
                                              5,
                                              (i) => Icon(
                                                i < rev.rating.floor() ? Icons.star : Icons.star_border,
                                                color: Colors.amber,
                                                size: 10,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: AppTheme.lightAccentColor,
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(
                                          rev.bookingType,
                                          style: const TextStyle(color: AppTheme.accentColor, fontSize: 8, fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Text(
                                        rev.date,
                                        style: TextStyle(color: subtitleColor, fontSize: 10),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              const SizedBox(height: 10),
                              Text(
                                "Rohit sir is an excellent trainer. He pushes you to do better every day and keeps the workouts challenging and effective.",
                                style: TextStyle(color: textColor, fontSize: 12, height: 1.4),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Persistent Close Button
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 30),
            child: Container(
              height: 48,
              decoration: BoxDecoration(
                border: Border.all(color: AppTheme.accentColor),
                borderRadius: BorderRadius.circular(15),
              ),
              child: TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text(
                  "Close",
                  style: TextStyle(color: AppTheme.accentColor, fontWeight: FontWeight.bold, fontSize: 16),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// 6. All Reviews Popup
class AllReviewsPopup extends StatelessWidget {
  final double rating;
  final int reviewsCount;
  final List<GymReview> reviews;

  const AllReviewsPopup({
    super.key,
    required this.rating,
    required this.reviewsCount,
    required this.reviews,
  });

  @override
  Widget build(BuildContext context) {
    final cardColor = AppTheme.getCardColor(context);
    final textColor = AppTheme.getTextColor(context);
    final subtitleColor = AppTheme.getSubtitleColor(context);

    return _buildBasePopup(
      context: context,
      title: "All Reviews",
      content: SingleChildScrollView(
        child: Column(
          children: [
            // Score Summary Dashboard
            Row(
              children: [
                Column(
                  children: [
                    Text(
                      rating.toString(),
                      style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold, color: textColor),
                    ),
                    Row(
                      children: List.generate(
                        5,
                        (i) => Icon(
                          i < rating.floor() ? Icons.star : Icons.star_border,
                          color: Colors.amber,
                          size: 16,
                        ),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      "(${reviewsCount} Reviews)",
                      style: TextStyle(color: subtitleColor, fontSize: 10),
                    )
                  ],
                ),
                const SizedBox(width: 20),
                // Review Histograms
                Expanded(
                  child: Column(
                    children: [
                      _buildHistogramRow(context, 5, 0.70, "70%"),
                      _buildHistogramRow(context, 4, 0.20, "20%"),
                      _buildHistogramRow(context, 3, 0.06, "6%"),
                      _buildHistogramRow(context, 2, 0.02, "2%"),
                      _buildHistogramRow(context, 1, 0.02, "2%"),
                    ],
                  ),
                )
              ],
            ),
            const SizedBox(height: 20),

            // List of Review Cards
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: reviews.length,
              itemBuilder: (context, index) {
                final rev = reviews[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: cardColor,
                    borderRadius: BorderRadius.circular(15),
                    border: Border.all(color: AppTheme.getInactiveChipBorder(context)),
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
                                  width: 32,
                                  height: 32,
                                  fit: BoxFit.cover,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    rev.userName,
                                    style: TextStyle(color: textColor, fontSize: 12, fontWeight: FontWeight.bold),
                                  ),
                                  const SizedBox(height: 2),
                                  Row(
                                    children: List.generate(
                                      5,
                                      (i) => Icon(
                                        i < rev.rating.floor() ? Icons.star : Icons.star_border,
                                        color: Colors.amber,
                                        size: 10,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppTheme.lightAccentColor,
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  rev.bookingType,
                                  style: const TextStyle(color: AppTheme.accentColor, fontSize: 8, fontWeight: FontWeight.bold),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                  rev.date,
                                  style: TextStyle(color: subtitleColor, fontSize: 10),
                                ),
                            ],
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
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHistogramRow(BuildContext context, int stars, double ratio, String percent) {
    return Row(
      children: [
        Text(
          stars.toString(),
          style: TextStyle(color: AppTheme.getTextColor(context), fontSize: 10, fontWeight: FontWeight.bold),
        ),
        const SizedBox(width: 4),
        const Icon(Icons.star, color: Colors.amber, size: 10),
        const SizedBox(width: 8),
        Expanded(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(3),
            child: LinearProgressIndicator(
              value: ratio,
              backgroundColor: AppTheme.getInactiveChipBorder(context),
              valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.accentColor),
              minHeight: 6,
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
    );
  }
}

// 7. Rules & Regulations Popup
class RulesPopup extends StatelessWidget {
  final List<String> rules;
  const RulesPopup({super.key, required this.rules});

  @override
  Widget build(BuildContext context) {
    final textColor = AppTheme.getTextColor(context);
    final subtitleColor = AppTheme.getSubtitleColor(context);

    return _buildBasePopup(
      context: context,
      title: "Rules & Regulations",
      content: ListView.builder(
        itemCount: rules.length,
        itemBuilder: (context, index) {
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 8.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.check_circle_outline, color: AppTheme.accentColor, size: 20),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    rules[index],
                    style: TextStyle(color: textColor, fontSize: 14, height: 1.4),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

// 8. Safety Measures Popup
class SafetyPopup extends StatelessWidget {
  final List<String> safety;
  const SafetyPopup({super.key, required this.safety});

  @override
  Widget build(BuildContext context) {
    final textColor = AppTheme.getTextColor(context);
    final subtitleColor = AppTheme.getSubtitleColor(context);

    return _buildBasePopup(
      context: context,
      title: "Safety Measures",
      content: ListView.builder(
        itemCount: safety.length,
        itemBuilder: (context, index) {
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 8.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.verified_user_outlined, color: AppTheme.secondaryColor, size: 20),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    safety[index],
                    style: TextStyle(color: textColor, fontSize: 14, height: 1.4),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
