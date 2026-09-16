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
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors } from '../theme/appTheme';
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

export const GymDetailsScreen = ({ route, navigation }) => {
  const { gym } = route.params;
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 1. TOP HERO IMAGE & ACTIONS */}
        <View style={styles.heroImageContainer}>
          <Image source={{ uri: gym.imageUrl }} style={styles.heroImage} resizeMode="cover" />

          {/* Top Bar Actions */}
          <SafeAreaView style={styles.topBarSafe}>
            <View style={styles.topBar}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.circleActionBtn}
                activeOpacity={0.8}
              >
                <MaterialIcons name="arrow-back" size={22} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.topBarRight}>
                <TouchableOpacity
                  onPress={toggleBookmark}
                  style={styles.circleActionBtn}
                  activeOpacity={0.8}
                >
                  <MaterialIcons
                    name={isBookmarked ? 'bookmark' : 'bookmark-border'}
                    size={22}
                    color={isBookmarked ? AppColors.secondaryColor : '#FFFFFF'}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleShare}
                  style={[styles.circleActionBtn, { marginLeft: 10 }]}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="share" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>

        {/* 2. GYM HEADER & LOCATION */}
        <View style={styles.contentPadding}>
          <View style={styles.headerInfoRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.gymTitle, { color: colors.text }]}>{gym.name}</Text>
              <Text style={[styles.gymAddress, { color: colors.subtitle }]}>
                {gym.fullAddress}
              </Text>
            </View>
          </View>

          {/* Status & Hours */}
          <View
            style={[
              styles.hoursCard,
              {
                backgroundColor: isDark ? '#262626' : '#F1F5F9',
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.hoursDot} />
            <Text style={[styles.hoursText, { color: colors.text }]}>{gym.openingHours}</Text>
          </View>

          {/* 3. KEY METRICS ROW */}
          <View style={styles.metricsRow}>
            <View
              style={[
                styles.metricCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <MaterialIcons name="star" size={22} color="#F59E0B" />
              <Text style={[styles.metricVal, { color: colors.text }]}>{gym.rating}</Text>
              <Text style={[styles.metricSub, { color: colors.subtitle }]}>
                {gym.reviewsCount} Reviews
              </Text>
            </View>

            <View
              style={[
                styles.metricCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <MaterialIcons name="near-me" size={22} color={AppColors.accentColor} />
              <Text style={[styles.metricVal, { color: colors.text }]}>{gym.distance} km</Text>
              <Text style={[styles.metricSub, { color: colors.subtitle }]}>From Location</Text>
            </View>

            <View
              style={[
                styles.metricCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <MaterialIcons name="payments" size={22} color={AppColors.secondaryColor} />
              <Text style={[styles.metricVal, { color: colors.text }]}>
                ₹{gym.pricePerSession.toFixed(0)}
              </Text>
              <Text style={[styles.metricSub, { color: colors.subtitle }]}>Per Session</Text>
            </View>
          </View>

          {/* 4. ABOUT SECTION */}
          <View style={styles.sectionBlock}>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>About</Text>
            <Text style={[styles.aboutParagraph, { color: colors.subtitle }]}>
              {gym.aboutText}
            </Text>
          </View>

          {/* 5. FACILITIES SECTION */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderLine}>
              <Text style={[styles.sectionHeading, { color: colors.text }]}>Facilities</Text>
              <TouchableOpacity onPress={() => setShowFacilities(true)}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chipsRow}>
              {gym.facilities.slice(0, 4).map((f, i) => (
                <View
                  key={i}
                  style={[
                    styles.featureChip,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <MaterialIcons name="check" size={14} color={AppColors.accentColor} />
                  <Text style={[styles.chipLabel, { color: colors.text }]}>{f}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 6. AMENITIES SECTION */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderLine}>
              <Text style={[styles.sectionHeading, { color: colors.text }]}>Amenities</Text>
              <TouchableOpacity onPress={() => setShowAmenities(true)}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chipsRow}>
              {gym.amenities.slice(0, 4).map((a, i) => (
                <View
                  key={i}
                  style={[
                    styles.featureChip,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <MaterialIcons name="done-all" size={14} color={AppColors.secondaryColor} />
                  <Text style={[styles.chipLabel, { color: colors.text }]}>{a}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 7. WORKOUTS SECTION */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderLine}>
              <Text style={[styles.sectionHeading, { color: colors.text }]}>Workouts Offered</Text>
              <TouchableOpacity onPress={() => setShowWorkouts(true)}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chipsRow}>
              {gym.workouts.slice(0, 5).map((w, i) => (
                <View
                  key={i}
                  style={[
                    styles.featureChip,
                    {
                      backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : '#EEF2FF',
                      borderColor: isDark ? AppColors.accentColor : '#C7D2FE',
                    },
                  ]}
                >
                  <MaterialIcons name="fitness-center" size={14} color={AppColors.accentColor} />
                  <Text style={[styles.chipLabel, { color: AppColors.accentColor }]}>{w}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 8. CERTIFIED TRAINERS SECTION */}
          {gym.trainers.length > 0 && (
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderLine}>
                <Text style={[styles.sectionHeading, { color: colors.text }]}>Certified Trainers</Text>
                <TouchableOpacity onPress={() => setShowTrainers(true)}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {gym.trainers.map((tr, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => {
                      setSelectedTrainer(tr);
                      setShowTrainerReviews(true);
                    }}
                    style={[
                      styles.trainerMiniCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Image source={{ uri: tr.imageUrl }} style={styles.trainerMiniAvatar} />
                    <Text style={[styles.trainerMiniName, { color: colors.text }]} numberOfLines={1}>
                      {tr.name}
                    </Text>
                    <Text style={[styles.trainerMiniSpec, { color: colors.subtitle }]} numberOfLines={1}>
                      {tr.specialty}
                    </Text>
                    <View style={styles.trainerMiniRating}>
                      <MaterialIcons name="star" size={12} color="#F59E0B" />
                      <Text style={[styles.trainerMiniRatingVal, { color: colors.text }]}>
                        {tr.rating}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* 9. RULES & SAFETY ACCORDIONS */}
          <View style={styles.sectionBlock}>
            <TouchableOpacity
              onPress={() => setShowRules(true)}
              style={[
                styles.accordionCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.accordionLeft}>
                <MaterialIcons name="rule" size={20} color={AppColors.accentColor} />
                <Text style={[styles.accordionTitle, { color: colors.text }]}>
                  Rules & Regulations
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={colors.subtitle} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowSafety(true)}
              style={[
                styles.accordionCard,
                { backgroundColor: colors.card, borderColor: colors.border, marginTop: 10 },
              ]}
            >
              <View style={styles.accordionLeft}>
                <MaterialIcons name="verified-user" size={20} color={AppColors.secondaryColor} />
                <Text style={[styles.accordionTitle, { color: colors.text }]}>Safety Measures</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={colors.subtitle} />
            </TouchableOpacity>
          </View>

          {/* 10. REVIEWS SUMMARY */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderLine}>
              <Text style={[styles.sectionHeading, { color: colors.text }]}>Member Reviews</Text>
              <TouchableOpacity onPress={() => setShowAllReviews(true)}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {gym.reviews.slice(0, 2).map((rev, idx) => (
              <View
                key={idx}
                style={[
                  styles.reviewCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={styles.revCardHeader}>
                  <Image source={{ uri: rev.userImageUrl }} style={styles.revCardAvatar} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={[styles.revCardName, { color: colors.text }]}>{rev.userName}</Text>
                    <View style={styles.starsRow}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <MaterialIcons
                          key={i}
                          name={i < Math.floor(rev.rating) ? 'star' : 'star-border'}
                          size={12}
                          color="#F59E0B"
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={[styles.revCardDate, { color: colors.subtitle }]}>{rev.date}</Text>
                </View>
                <Text style={[styles.revCardComment, { color: colors.text }]}>{rev.comment}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 11. BOTTOM STICKY ACTION BAR */}
      <View
        style={[
          styles.bottomActionBar,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('BookingSession', { gym })}
          style={[
            styles.bookSessionBtn,
            {
              borderColor: AppColors.primaryNavy,
              backgroundColor: isDark ? 'rgba(0, 56, 130, 0.2)' : 'rgba(0, 56, 130, 0.08)',
            },
          ]}
          activeOpacity={0.8}
        >
          <Text style={[styles.bookSessionText, { color: isDark ? AppColors.darkAccentColor : AppColors.primaryNavy }]}>
            Book Session
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('BuyMembership', { gym })}
          style={[styles.buyMembershipBtn, { backgroundColor: AppColors.secondaryColor }]}
          activeOpacity={0.85}
        >
          <Text style={styles.buyMembershipText}>Buy Membership</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <FacilitiesPopup
        visible={showFacilities}
        onClose={() => setShowFacilities(false)}
        facilities={gym.facilities}
      />
      <AmenitiesPopup
        visible={showAmenities}
        onClose={() => setShowAmenities(false)}
        amenities={gym.amenities}
      />
      <WorkoutsPopup
        visible={showWorkouts}
        onClose={() => setShowWorkouts(false)}
        workouts={gym.workouts}
      />
      <TrainersPopup
        visible={showTrainers}
        onClose={() => setShowTrainers(false)}
        trainers={gym.trainers}
        onTrainerTap={(tr) => {
          setSelectedTrainer(tr);
          setShowTrainers(false);
          setShowTrainerReviews(true);
        }}
      />
      <TrainerReviewsPopup
        visible={showTrainerReviews}
        onClose={() => setShowTrainerReviews(false)}
        trainer={selectedTrainer}
        reviews={gym.reviews}
        onBack={() => {
          setShowTrainerReviews(false);
          setShowTrainers(true);
        }}
      />
      <AllReviewsPopup
        visible={showAllReviews}
        onClose={() => setShowAllReviews(false)}
        rating={gym.rating}
        reviewsCount={gym.reviewsCount}
        reviews={gym.reviews}
      />
      <RulesPopup visible={showRules} onClose={() => setShowRules(false)} rules={gym.rules} />
      <SafetyPopup visible={showSafety} onClose={() => setShowSafety(false)} safety={gym.safety} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  heroImageContainer: {
    height: 270,
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 10,
  },
  topBarRight: {
    flexDirection: 'row',
  },
  circleActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentPadding: {
    padding: 20,
  },
  headerInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  gymTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  gymAddress: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  hoursCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 14,
  },
  hoursDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
    marginRight: 8,
  },
  hoursText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  metricCard: {
    width: '31%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 6,
  },
  metricSub: {
    fontSize: 10,
    marginTop: 2,
  },
  sectionBlock: {
    marginTop: 24,
  },
  sectionHeaderLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.primaryNavy,
  },
  aboutParagraph: {
    fontSize: 13.5,
    lineHeight: 20,
    marginTop: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  horizontalScroll: {
    paddingRight: 10,
  },
  trainerMiniCard: {
    width: 120,
    borderRadius: 16,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  trainerMiniAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  trainerMiniName: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
  trainerMiniSpec: {
    fontSize: 10.5,
    marginTop: 2,
    textAlign: 'center',
  },
  trainerMiniRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trainerMiniRatingVal: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 3,
  },
  accordionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  accordionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 10,
  },
  reviewCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  revCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  revCardAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  revCardName: {
    fontSize: 13,
    fontWeight: '700',
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  revCardDate: {
    fontSize: 10.5,
  },
  revCardComment: {
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 8,
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    flexDirection: 'row',
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 10,
  },
  bookSessionBtn: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  bookSessionText: {
    fontSize: 14,
    fontWeight: '800',
  },
  buyMembershipBtn: {
    flex: 1.2,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyMembershipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
