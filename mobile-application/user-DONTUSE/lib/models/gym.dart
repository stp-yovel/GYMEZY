class Trainer {
  final String name;
  final String imageUrl;
  final int experienceYears;
  final String specialty;
  final double rating;
  final int reviewsCount;

  const Trainer({
    required this.name,
    required this.imageUrl,
    required this.experienceYears,
    required this.specialty,
    required this.rating,
    required this.reviewsCount,
  });
}

class GymReview {
  final String userName;
  final String userImageUrl;
  final double rating;
  final String bookingType;
  final String date;
  final String comment;

  const GymReview({
    required this.userName,
    required this.userImageUrl,
    required this.rating,
    required this.bookingType,
    required this.date,
    required this.comment,
  });
}

class Gym {
  final String name;
  final String location;
  final double distance;
  final double rating;
  final int reviewsCount;
  final String imageUrl;
  final double pricePerSession;
  final List<String> tags;
  final String? badgeText;
  final bool isBookmarked;

  // Extra detailed fields
  final String fullAddress;
  final String openingHours;
  final String aboutText;
  final List<String> facilities;
  final List<String> amenities;
  final List<String> workouts;
  final List<Trainer> trainers;
  final List<GymReview> reviews;
  final List<String> rules;
  final List<String> safety;

  const Gym({
    required this.name,
    required this.location,
    required this.distance,
    required this.rating,
    required this.reviewsCount,
    required this.imageUrl,
    required this.pricePerSession,
    required this.tags,
    this.badgeText,
    this.isBookmarked = false,
    this.fullAddress = "No. 15, 2nd Avenue, Anna Nagar, Chennai, Tamil Nadu - 600040",
    this.openingHours = "Open Now • Closes at 10:00 PM",
    this.aboutText = "A premium fitness center with state-of-the-art equipment, certified trainers, and personalized programs to help you achieve your fitness goals.",
    this.facilities = const ["AC Gym", "Locker Facility", "Shower Available"],
    this.amenities = const ["Drinking Water", "Towel Service", "Parking Available"],
    this.workouts = const ["GYM", "Yoga", "Zumba"],
    this.trainers = const [],
    this.reviews = const [],
    this.rules = const [
      "Carry a valid ID proof for entry.",
      "Use a towel while using equipment.",
      "Re-rack weights after use.",
      "Maintain cleanliness in the gym.",
      "Respect other members and staff."
    ],
    this.safety = const [
      "Sanitized equipment regularly",
      "First aid kit available",
      "CCTV surveillance 24/7",
      "Trained staff for assistance",
      "Emergency exit & fire safety"
    ],
  });
}
