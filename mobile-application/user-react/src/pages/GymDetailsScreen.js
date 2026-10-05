import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors, AppTheme } from '../theme/appTheme';
import { useToast } from '../widgets/CustomScaffoldMessage';
import {
  FacilitiesPopup,
  AmenitiesPopup,
  WorkoutsPopup,
  TrainersPopup,
  TrainerReviewsPopup,
  AllReviewsPopup,
  RulesPopup,
  SafetyPopup,
} from '../widgets/DetailsPopups';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DEFAULT_RULES = [
  'Carry a valid ID proof for entry.',
  'Wear proper athletic shoes & workout attire.',
  'Use a towel while using equipment.',
  'Re-rack weights after use.',
  'Maintain cleanliness and hygiene in the gym.',
  'Follow trainer and staff instructions at all times.',
];

const DEFAULT_SAFETY = [
  'Sanitized equipment regularly',
  'First aid kit available',
  'CCTV surveillance 24/7',
  'Trained staff for assistance',
  'Emergency exit & fire safety compliant',
  'Proper ventilation & air circulation',
];

const DEFAULT_REVIEWS = [
  {
    userName: 'Arun Kumar',
    userImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    rating: 5.0,
    bookingType: 'App Booking',
    date: '2 days ago',
    comment: 'Clean environment and very supportive trainers!',
  },
  {
    userName: 'Priya Sharma',
    userImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    rating: 4.8,
    bookingType: 'Member',
    date: '1 week ago',
    comment: 'Spacious gym with all modern machines. Loved the experience.',
  },
];

export const GymDetailsScreen = ({ route, navigation }) => {
  const gym = route?.params?.gym || {};
  const { isDark, colors } = useTheme();
  const { showToast } = useToast();

  const [isBookmarked, setIsBookmarked] = useState(gym.isBookmarked || false);

  // Popups state
  const [showFacilities, setShowFacilities] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);
  const [showWorkouts, setShowWorkouts] = useState(false);
  const [showTrainers, setShowTrainers] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showTrainerReviews, setShowTrainerReviews] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showSafety, setShowSafety] = useState(false);

  // Safe normalized arrays and fields
  const workouts = Array.isArray(gym.workouts) && gym.workouts.length > 0
    ? gym.workouts
    : ['GYM', 'Strength', 'Cardio', 'HIIT', 'CrossFit'];

  const facilities = Array.isArray(gym.facilities) && gym.facilities.length > 0
    ? gym.facilities
    : ['AC Gym', 'Locker Facility', 'Shower Available', 'Changing Room', 'Free Wi-Fi'];

  const amenities = Array.isArray(gym.amenities) && gym.amenities.length > 0
    ? gym.amenities
    : ['Drinking Water', 'Towel Service', 'Parking Available', 'First Aid Kit'];

  const trainers = Array.isArray(gym.trainers) ? gym.trainers : [];

  const reviews = Array.isArray(gym.reviews) && gym.reviews.length > 0
    ? gym.reviews
    : DEFAULT_REVIEWS;

  const rules = Array.isArray(gym.rules) && gym.rules.length > 0
    ? gym.rules
    : DEFAULT_RULES;

  const safety = Array.isArray(gym.safety) && gym.safety.length > 0
    ? gym.safety
    : Array.isArray(gym.safetyMeasures) && gym.safetyMeasures.length > 0
    ? gym.safetyMeasures
    : DEFAULT_SAFETY;

  const openingHoursText =
    typeof gym.openingHours === 'object' && gym.openingHours?.displayText
      ? gym.openingHours.displayText
      : typeof gym.openingHours === 'string' && gym.openingHours
      ? gym.openingHours
      : '05:30 AM - 10:30 PM';

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showToast({
      message: !isBookmarked ? 'Added to bookmarked gyms' : 'Removed from bookmarks',
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${gym.name} on GYMEZY! Book passes and memberships with instant QR entry.`,
      });
    } catch (e) {
      // ignore
    }
  };

  const primaryNavy = isDark ? '#93C5FD' : '#003882';
  const cardColor = isDark ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const subtitleColor = isDark ? 'rgba(255, 255, 255, 0.7)' : '#64748B';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0';
  const accentIconColor = isDark ? '#93C5FD' : '#003882';

  // Workouts icon map
  const workoutIconMap = {
    GYM: 'fitness-center',
    Yoga: 'self-improvement',
    Zumba: 'music-note',
    CrossFit: 'offline-bolt',
    Pilates: 'accessibility-new',
    Boxing: 'sports-mma',
  };

  // Facilities icon map
  const facilityIconMap = {
    'AC Gym': 'ac-unit',
    'Locker Facility': 'lock-outline',
    'Shower Available': 'shower',
    'Changing Room': 'door-sliding',
    'Steam Bath': 'hot-tub',
  };

  // Amenities icon map
  const amenityIconMap = {
    'Drinking Water': 'local-drink',
    'Towel Service': 'layers',
    'Parking Available': 'local-parking',
    'Free Wi-Fi': 'wifi',
    'Protein Bar': 'local-cafe',
  };

  const coverImageUrl =
    gym.coverPhoto?.fileData ||
    (typeof gym.coverPhoto === 'string' && gym.coverPhoto.length > 0 ? gym.coverPhoto : null) ||
    (gym.galleryPhotos && gym.galleryPhotos[0]?.fileData) ||
    (Array.isArray(gym.images) && gym.images[0]) ||
    gym.imageUrl ||
    gym.image ||
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. TOP HERO IMAGE & ACTIONS */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: coverImageUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Gradient Scrim */}
          <LinearGradient
            colors={['rgba(0,0,0,0.45)', 'transparent', 'rgba(0,0,0,0.7)']}
            locations={[0.0, 0.5, 1.0]}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Top Bar Floating Buttons */}
          <SafeAreaView edges={['top']} style={styles.topBarSafe}>
            <View style={styles.topBarRow}>
              {/* Back Button */}
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
                style={[
                  styles.circleBtn,
                  {
                    backgroundColor: isDark
                      ? 'rgba(30, 30, 30, 0.85)'
                      : 'rgba(255, 255, 255, 0.92)',
                    borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                  },
                ]}
              >
                <MaterialIcons
                  name="arrow-back"
                  size={20}
                  color={isDark ? '#FFFFFF' : '#0F172A'}
                />
              </TouchableOpacity>

              {/* Right Action Buttons */}
              <View style={styles.topRightActions}>
                {/* Share Button */}
                <TouchableOpacity
                  onPress={handleShare}
                  activeOpacity={0.8}
                  style={[
                    styles.circleBtn,
                    {
                      backgroundColor: isDark
                        ? 'rgba(30, 30, 30, 0.85)'
                        : 'rgba(255, 255, 255, 0.92)',
                      borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                      marginRight: 8,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="share"
                    size={18}
                    color={isDark ? '#FFFFFF' : '#0F172A'}
                  />
                </TouchableOpacity>

                {/* Bookmark Button */}
                <TouchableOpacity
                  onPress={toggleBookmark}
                  activeOpacity={0.8}
                  style={[
                    styles.circleBtn,
                    {
                      backgroundColor: isDark
                        ? 'rgba(30, 30, 30, 0.85)'
                        : 'rgba(255, 255, 255, 0.92)',
                      borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                    },
                  ]}
                >
                  <MaterialIcons
                    name={isBookmarked ? 'bookmark' : 'bookmark-border'}
                    size={20}
                    color={isBookmarked ? '#00BF62' : isDark ? '#FFFFFF' : '#0F172A'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>

          {/* Photo Count Pill */}
          <View style={styles.photosPill}>
            <MaterialIcons name="photo-library" size={13} color="#FFFFFF" style={{ marginRight: 5 }} />
            <Text style={styles.photosPillText}>1 / 15 Photos</Text>
          </View>
        </View>

        {/* 2. GYM HEADER & LOCATION */}
        <View style={styles.bodyContent}>
          {/* Gym Title & Verification */}
          <View style={styles.titleRow}>
            <Text style={[styles.gymTitle, { color: textColor }]}>{gym.name}</Text>
            <View style={styles.openNowBadge}>
              <View style={styles.openNowDot} />
              <Text style={styles.openNowText}>Open Now</Text>
            </View>
          </View>

          {/* Subtitle Location & Verified Gym */}
          <View style={styles.subtitleRow}>
            <MaterialIcons name="location-on" size={15} color={subtitleColor} />
            <Text style={[styles.locationText, { color: subtitleColor }]}>
              {gym.location}
            </Text>
            <Text style={[styles.bulletText, { color: subtitleColor }]}>•</Text>
            <MaterialIcons name="verified" size={15} color="#00BF62" />
            <Text style={styles.verifiedText}>Verified Gym</Text>
          </View>

          {/* 3. HORIZONTAL SCROLLING QUICK METRICS BADGES */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.metricsBadgeRow}
          >
            {/* Price Badge */}
            <View style={[styles.metricBadge, { backgroundColor: cardColor, borderColor: borderColor }]}>
              <MaterialIcons name="bolt" size={16} color="#00BF62" style={{ marginRight: 4 }} />
              <Text style={[styles.metricBadgeBold, { color: textColor }]}>
                ₹{Math.round(gym.pricePerSession)}
              </Text>
              <Text style={[styles.metricBadgeSub, { color: subtitleColor }]}> /session</Text>
            </View>

            {/* Rating Badge */}
            <View style={[styles.metricBadge, { backgroundColor: cardColor, borderColor: borderColor }]}>
              <MaterialIcons name="star" size={16} color="#F59E0B" style={{ marginRight: 4 }} />
              <Text style={[styles.metricBadgeBold, { color: textColor }]}>
                {gym.rating} ({gym.reviewsCount})
              </Text>
            </View>

            {/* Distance Badge */}
            <View style={[styles.metricBadge, { backgroundColor: cardColor, borderColor: borderColor }]}>
              <MaterialIcons name="near-me" size={14} color={accentIconColor} style={{ marginRight: 4 }} />
              <Text style={[styles.metricBadgeBold, { color: textColor }]}>
                {gym.distance} km
              </Text>
            </View>

            {/* Instant Pass Badge */}
            <View style={[styles.metricBadge, { backgroundColor: 'rgba(0, 191, 98, 0.12)', borderColor: 'transparent' }]}>
              <MaterialIcons name="flash-on" size={14} color="#00BF62" style={{ marginRight: 4 }} />
              <Text style={[styles.metricBadgeBold, { color: '#00BF62' }]}>
                Instant Pass
              </Text>
            </View>
          </ScrollView>

          {/* 4. LOCATION & OPERATING HOURS CARD */}
          <View
            style={[
              styles.locationCard,
              { backgroundColor: cardColor, borderColor: borderColor },
            ]}
          >
            {/* Address Row */}
            <View style={styles.locationCardRow}>
              <View
                style={[
                  styles.locationIconBox,
                  {
                    backgroundColor: isDark
                      ? 'rgba(30, 58, 138, 0.35)'
                      : 'rgba(0, 56, 130, 0.08)',
                  },
                ]}
              >
                <MaterialIcons name="location-on" size={20} color={accentIconColor} />
              </View>
              <View style={styles.locationDetailsCol}>
                <Text style={[styles.locationLabel, { color: subtitleColor }]}>Address</Text>
                <Text style={[styles.locationAddressText, { color: textColor }]}>
                  {gym.fullAddress}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => showToast({ message: 'Opening Maps Directions...', isSuccess: true })}
                style={[styles.directionsBtn, { borderColor: accentIconColor }]}
              >
                <Text style={[styles.directionsBtnText, { color: accentIconColor }]}>Directions</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.cardDivider, { backgroundColor: borderColor }]} />

            {/* Operating Hours Row */}
            <View style={styles.locationCardRow}>
              <View
                style={[
                  styles.locationIconBox,
                  { backgroundColor: 'rgba(0, 191, 98, 0.12)' },
                ]}
              >
                <MaterialIcons name="access-time-filled" size={20} color="#00BF62" />
              </View>
              <View style={styles.locationDetailsCol}>
                <Text style={[styles.locationLabel, { color: subtitleColor }]}>Operating Hours</Text>
                <Text style={[styles.locationAddressText, { color: textColor, fontWeight: '600' }]}>
                  {openingHoursText}
                </Text>
              </View>
            </View>
          </View>

          {/* 5. WORKOUTS OFFERED */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Workouts Offered</Text>
              <TouchableOpacity onPress={() => setShowWorkouts(true)} activeOpacity={0.7}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.squircleCardsRow}>
              {workouts.slice(0, 3).map((w, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.squircleCard,
                    { backgroundColor: cardColor, borderColor: borderColor },
                  ]}
                >
                  <View
                    style={[
                      styles.squircleIconCircle,
                      {
                        backgroundColor: isDark
                          ? 'rgba(30, 58, 138, 0.35)'
                          : 'rgba(0, 56, 130, 0.08)',
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={workoutIconMap[w] || 'fitness-center'}
                      size={22}
                      color={accentIconColor}
                    />
                  </View>
                  <Text
                    style={[styles.squircleCardText, { color: textColor }]}
                    numberOfLines={1}
                  >
                    {w}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* 6. FACILITIES SECTION */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Facilities</Text>
              <TouchableOpacity onPress={() => setShowFacilities(true)} activeOpacity={0.7}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.squircleCardsRow}>
              {facilities.slice(0, 3).map((f, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.squircleCard,
                    { backgroundColor: cardColor, borderColor: borderColor },
                  ]}
                >
                  <View
                    style={[
                      styles.squircleIconCircle,
                      {
                        backgroundColor: isDark
                          ? 'rgba(30, 58, 138, 0.35)'
                          : 'rgba(0, 56, 130, 0.08)',
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={facilityIconMap[f] || 'ac-unit'}
                      size={22}
                      color={accentIconColor}
                    />
                  </View>
                  <Text
                    style={[styles.squircleCardText, { color: textColor }]}
                    numberOfLines={1}
                  >
                    {f}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* 7. AMENITIES SECTION */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Amenities</Text>
              <TouchableOpacity onPress={() => setShowAmenities(true)} activeOpacity={0.7}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.squircleCardsRow}>
              {amenities.slice(0, 3).map((a, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.squircleCard,
                    { backgroundColor: cardColor, borderColor: borderColor },
                  ]}
                >
                  <View
                    style={[
                      styles.squircleIconCircle,
                      {
                        backgroundColor: isDark
                          ? 'rgba(30, 58, 138, 0.35)'
                          : 'rgba(0, 56, 130, 0.08)',
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={amenityIconMap[a] || 'local-drink'}
                      size={22}
                      color={accentIconColor}
                    />
                  </View>
                  <Text
                    style={[styles.squircleCardText, { color: textColor }]}
                    numberOfLines={1}
                  >
                    {a}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* 8. ABOUT SECTION */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: textColor, marginBottom: 8 }]}>
              About {gym.name}
            </Text>
            <Text style={[styles.aboutParagraph, { color: subtitleColor }]}>
              {gym.aboutText}
            </Text>
          </View>

          {/* 9. CERTIFIED TRAINERS SECTION */}
          {trainers.length > 0 && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>Certified Trainers</Text>
                <TouchableOpacity onPress={() => setShowTrainers(true)} activeOpacity={0.7}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.trainersRow}>
                {trainers.slice(0, 2).map((tr, idx) => (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedTrainer(tr);
                      setShowTrainerReviews(true);
                    }}
                    style={[
                      styles.trainerCard,
                      { backgroundColor: cardColor, borderColor: borderColor },
                    ]}
                  >
                    <Image
                      source={{ uri: tr.imageUrl }}
                      style={styles.trainerAvatar}
                      resizeMode="cover"
                    />
                    <View style={styles.trainerInfo}>
                      <Text
                        style={[styles.trainerName, { color: textColor }]}
                        numberOfLines={1}
                      >
                        {tr.name}
                      </Text>
                      <Text style={[styles.trainerExp, { color: subtitleColor }]}>
                        {tr.experienceYears} Yrs Exp.
                      </Text>
                      <View style={styles.trainerRatingRow}>
                        <MaterialIcons name="star" size={12} color="#F59E0B" />
                        <Text style={[styles.trainerRatingText, { color: textColor }]}>
                          {tr.rating}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* 10. REVIEWS & RATINGS */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Reviews & Ratings</Text>
              <TouchableOpacity onPress={() => setShowAllReviews(true)} activeOpacity={0.7}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {/* Rating Overview Card */}
            <View
              style={[
                styles.reviewsOverviewCard,
                { backgroundColor: cardColor, borderColor: borderColor },
              ]}
            >
              <View style={styles.reviewsOverviewLeft}>
                <Text style={[styles.bigRatingText, { color: textColor }]}>
                  {gym.rating}
                </Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <MaterialIcons
                      key={s}
                      name={s <= Math.floor(gym.rating) ? 'star' : 'star-border'}
                      size={16}
                      color="#F59E0B"
                    />
                  ))}
                </View>
                <Text style={[styles.reviewsCountText, { color: subtitleColor }]}>
                  {gym.reviewsCount} reviews
                </Text>
              </View>

              <View style={styles.histogramCol}>
                {[
                  { stars: 5, pct: 0.7, label: '70%' },
                  { stars: 4, pct: 0.2, label: '20%' },
                  { stars: 3, pct: 0.06, label: '6%' },
                  { stars: 2, pct: 0.02, label: '2%' },
                  { stars: 1, pct: 0.02, label: '2%' },
                ].map((row) => (
                  <View key={row.stars} style={styles.histogramRow}>
                    <Text style={[styles.histStarNum, { color: textColor }]}>{row.stars}</Text>
                    <MaterialIcons name="star" size={10} color="#F59E0B" style={{ marginHorizontal: 2 }} />
                    <View style={[styles.histBarTrack, { backgroundColor: isDark ? '#333333' : '#E2E8F0' }]}>
                      <View
                        style={[
                          styles.histBarFill,
                          {
                            width: `${row.pct * 100}%`,
                            backgroundColor: isDark ? '#00BF62' : '#003882',
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.histPercent, { color: subtitleColor }]}>{row.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Individual Reviews */}
            {reviews.slice(0, 2).map((rev, idx) => (
              <View
                key={idx}
                style={[
                  styles.reviewCard,
                  { backgroundColor: cardColor, borderColor: borderColor },
                ]}
              >
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: rev.userImageUrl }} style={styles.reviewAvatar} />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={[styles.reviewAuthor, { color: textColor }]}>{rev.userName}</Text>
                    <View style={styles.reviewStarsRow}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <MaterialIcons
                          key={s}
                          name={s <= Math.floor(rev.rating || 5) ? 'star' : 'star-border'}
                          size={11}
                          color="#F59E0B"
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={[styles.reviewDate, { color: subtitleColor }]}>{rev.date}</Text>
                </View>
                <Text style={[styles.reviewComment, { color: textColor }]}>{rev.comment}</Text>
              </View>
            ))}
          </View>

          {/* 11. RULES & SAFETY GUIDELINES */}
          <View style={styles.guidelinesRow}>
            {/* Rules */}
            <View style={[styles.guidelineCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
              <Text style={[styles.guidelineTitle, { color: textColor }]}>Gym Rules</Text>
              {rules.slice(0, 3).map((r, i) => (
                <View key={i} style={styles.guidelineItem}>
                  <MaterialIcons name="check-circle" size={13} color={accentIconColor} style={{ marginRight: 4, marginTop: 1 }} />
                  <Text style={[styles.guidelineText, { color: subtitleColor }]} numberOfLines={2}>
                    {r}
                  </Text>
                </View>
              ))}
              <TouchableOpacity onPress={() => setShowRules(true)} activeOpacity={0.7}>
                <Text style={[styles.viewRulesText, { color: accentIconColor }]}>View All Rules →</Text>
              </TouchableOpacity>
            </View>

            {/* Safety */}
            <View style={[styles.guidelineCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
              <Text style={[styles.guidelineTitle, { color: textColor }]}>Safety Measures</Text>
              {safety.slice(0, 3).map((s, i) => (
                <View key={i} style={styles.guidelineItem}>
                  <MaterialIcons name="verified-user" size={13} color="#00BF62" style={{ marginRight: 4, marginTop: 1 }} />
                  <Text style={[styles.guidelineText, { color: subtitleColor }]} numberOfLines={2}>
                    {s}
                  </Text>
                </View>
              ))}
              <TouchableOpacity onPress={() => setShowSafety(true)} activeOpacity={0.7}>
                <Text style={[styles.viewRulesText, { color: '#00BF62' }]}>View All Safety →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ============================================================ */}
      {/* 12. PERSISTENT BOTTOM ACTION BAR */}
      {/* ============================================================ */}
      <View
        style={[
          styles.bottomBarContainer,
          {
            backgroundColor: isDark
              ? 'rgba(18, 18, 18, 0.88)'
              : 'rgba(255, 255, 255, 0.88)',
            borderTopColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)',
          },
        ]}
      >
        {/* Phone Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => showToast({ message: 'Calling gym front desk...' })}
          style={[
            styles.callBtn,
            {
              backgroundColor: isDark ? 'rgba(30,30,30,0.85)' : '#FFFFFF',
              borderColor: borderColor,
            },
          ]}
        >
          <MaterialIcons name="phone" size={20} color={isDark ? '#FFFFFF' : '#003882'} />
        </TouchableOpacity>

        {/* Book Session Button (Outlined Navy Blue) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('BookingSession', { gym })}
          style={[
            styles.bookSessionBtn,
            {
              borderColor: isDark ? '#93C5FD' : '#003882',
              backgroundColor: isDark ? 'rgba(30,30,30,0.5)' : '#FFFFFF',
            },
          ]}
        >
          <MaterialIcons
            name="calendar-today"
            size={16}
            color={isDark ? '#93C5FD' : '#003882'}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.bookSessionBtnText,
              { color: isDark ? '#93C5FD' : '#003882' },
            ]}
          >
            Book Session
          </Text>
        </TouchableOpacity>

        {/* Buy Membership Button (Solid Green) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('BuyMembership', { gym })}
          style={styles.buyMembershipBtn}
        >
          <MaterialIcons name="workspace-premium" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.buyMembershipBtnText}>Buy Membership</Text>
        </TouchableOpacity>
      </View>

      {/* ============================================================ */}
      {/* POPUPS & MODALS */}
      {/* ============================================================ */}
      <FacilitiesPopup
        visible={showFacilities}
        onClose={() => setShowFacilities(false)}
        facilities={facilities}
      />
      <AmenitiesPopup
        visible={showAmenities}
        onClose={() => setShowAmenities(false)}
        amenities={amenities}
      />
      <WorkoutsPopup
        visible={showWorkouts}
        onClose={() => setShowWorkouts(false)}
        workouts={workouts}
      />
      <TrainersPopup
        visible={showTrainers}
        onClose={() => setShowTrainers(false)}
        trainers={trainers}
        onTrainerTap={(trainer) => {
          setShowTrainers(false);
          setSelectedTrainer(trainer);
          setShowTrainerReviews(true);
        }}
      />
      <TrainerReviewsPopup
        visible={showTrainerReviews}
        onClose={() => setShowTrainerReviews(false)}
        trainer={selectedTrainer}
        reviews={reviews}
        onBack={() => {
          setShowTrainerReviews(false);
          setShowTrainers(true);
        }}
      />
      <AllReviewsPopup
        visible={showAllReviews}
        onClose={() => setShowAllReviews(false)}
        rating={gym.rating || 4.8}
        reviewsCount={gym.reviewsCount || reviews.length}
        reviews={reviews}
      />
      <RulesPopup
        visible={showRules}
        onClose={() => setShowRules(false)}
        rules={rules}
      />
      <SafetyPopup
        visible={showSafety}
        onClose={() => setShowSafety(false)}
        safety={safety}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  /* Hero Image */
  heroContainer: {
    width: '100%',
    height: 280,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  topBarSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photosPill: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.24)',
  },
  photosPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },

  /* Body Content */
  bodyContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gymTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: -0.4,
    flex: 1,
  },
  openNowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 191, 98, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 8,
  },
  openNowDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#00BF62',
    marginRight: 5,
  },
  openNowText: {
    color: '#00BF62',
    fontSize: 11,
    fontWeight: 'bold',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  locationText: {
    fontSize: 13,
    marginLeft: 3,
  },
  bulletText: {
    marginHorizontal: 8,
  },
  verifiedText: {
    color: '#00BF62',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 3,
  },

  /* Key Metrics Horizontal Badges */
  metricsBadgeRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    gap: 8,
  },
  metricBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
  },
  metricBadgeBold: {
    fontSize: 12.5,
    fontWeight: 'bold',
  },
  metricBadgeSub: {
    fontSize: 11,
  },

  /* Location Card */
  locationCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginTop: 6,
  },
  locationCardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationIconBox: {
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  locationDetailsCol: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  locationAddressText: {
    fontSize: 13,
    lineHeight: 18,
  },
  directionsBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 6,
  },
  directionsBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardDivider: {
    height: 1,
    marginVertical: 12,
  },

  /* Feature Sections */
  sectionContainer: {
    marginTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    color: '#00BF62',
    fontSize: 13,
    fontWeight: 'bold',
  },
  squircleCardsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  squircleCard: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squircleIconCircle: {
    padding: 10,
    borderRadius: 25,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squircleCardText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  aboutParagraph: {
    fontSize: 13,
    lineHeight: 20,
  },

  /* Trainers */
  trainersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  trainerCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
  },
  trainerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 8,
  },
  trainerInfo: {
    flex: 1,
  },
  trainerName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  trainerExp: {
    fontSize: 10,
    marginTop: 2,
  },
  trainerRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trainerRatingText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },

  /* Reviews Overview */
  reviewsOverviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
  },
  reviewsOverviewLeft: {
    alignItems: 'center',
    paddingRight: 20,
  },
  bigRatingText: {
    fontSize: 38,
    fontWeight: 'bold',
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  reviewsCountText: {
    fontSize: 11,
    marginTop: 4,
  },
  histogramCol: {
    flex: 1,
  },
  histogramRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  histStarNum: {
    fontSize: 10,
    fontWeight: 'bold',
    width: 8,
  },
  histBarTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  histBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  histPercent: {
    fontSize: 10,
    width: 25,
    textAlign: 'right',
  },
  reviewCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  reviewAuthor: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  reviewStarsRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  reviewDate: {
    fontSize: 11,
  },
  reviewComment: {
    fontSize: 12,
    lineHeight: 18,
  },

  /* Guidelines */
  guidelinesRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 10,
  },
  guidelineCard: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  guidelineTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  guidelineText: {
    fontSize: 10,
    lineHeight: 14,
    flex: 1,
  },
  viewRulesText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
  },

  /* Persistent Bottom Action Bar */
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  callBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  bookSessionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    paddingHorizontal: 4,
  },
  bookSessionBtnText: {
    fontSize: 12.5,
    fontWeight: 'bold',
  },
  buyMembershipBtn: {
    flex: 1.2,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#00BF62',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  buyMembershipBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: 'bold',
  },
});
