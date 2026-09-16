export class Trainer {
  constructor({
    name,
    imageUrl,
    experienceYears,
    specialty,
    rating,
    reviewsCount,
  }) {
    this.name = name;
    this.imageUrl = imageUrl;
    this.experienceYears = experienceYears;
    this.specialty = specialty;
    this.rating = rating;
    this.reviewsCount = reviewsCount;
  }
}

export class GymReview {
  constructor({
    userName,
    userImageUrl,
    rating,
    bookingType,
    date,
    comment,
  }) {
    this.userName = userName;
    this.userImageUrl = userImageUrl;
    this.rating = rating;
    this.bookingType = bookingType;
    this.date = date;
    this.comment = comment;
  }
}

export class Gym {
  constructor({
    name,
    location,
    distance,
    rating,
    reviewsCount,
    imageUrl,
    pricePerSession,
    tags = [],
    badgeText = null,
    isBookmarked = false,
    fullAddress = 'No. 15, 2nd Avenue, Anna Nagar, Chennai, Tamil Nadu - 600040',
    openingHours = 'Open Now • Closes at 10:00 PM',
    aboutText = 'A premium fitness center with state-of-the-art equipment, certified trainers, and personalized programs to help you achieve your fitness goals.',
    facilities = ['AC Gym', 'Locker Facility', 'Shower Available'],
    amenities = ['Drinking Water', 'Towel Service', 'Parking Available'],
    workouts = ['GYM', 'Yoga', 'Zumba'],
    trainers = [],
    reviews = [],
    rules = [
      'Carry a valid ID proof for entry.',
      'Use a towel while using equipment.',
      'Re-rack weights after use.',
      'Maintain cleanliness in the gym.',
      'Respect other members and staff.',
    ],
    safety = [
      'Sanitized equipment regularly',
      'First aid kit available',
      'CCTV surveillance 24/7',
      'Trained staff for assistance',
      'Emergency exit & fire safety',
    ],
  }) {
    this.name = name;
    this.location = location;
    this.distance = distance;
    this.rating = rating;
    this.reviewsCount = reviewsCount;
    this.imageUrl = imageUrl;
    this.pricePerSession = pricePerSession;
    this.tags = tags;
    this.badgeText = badgeText;
    this.isBookmarked = isBookmarked;
    this.fullAddress = fullAddress;
    this.openingHours = openingHours;
    this.aboutText = aboutText;
    this.facilities = facilities;
    this.amenities = amenities;
    this.workouts = workouts;
    this.trainers = trainers;
    this.reviews = reviews;
    this.rules = rules;
    this.safety = safety;
  }
}
