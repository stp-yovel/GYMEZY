import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors, AppTheme } from '../theme/appTheme';
import { CustomFloatingNavBar } from '../widgets/CustomFloatingNavBar';
import { MyBookingsScreen } from './MyBookingsScreen';
import { MyMembershipsScreen } from './MyMembershipsScreen';
import { ProfileScreen } from './ProfileScreen';
import { useToast } from '../widgets/CustomScaffoldMessage';
import { useAuth } from '../context/AuthContext';
import { locationService } from '../services/locationService';
import { gymService } from '../services/gymService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES = [
  { name: 'All', icon: 'local-fire-department' },
  { name: 'Strength', icon: 'fitness-center' },
  { name: 'HIIT', icon: 'bolt' },
  { name: 'Yoga', icon: 'self-improvement' },
  { name: 'Boxing', icon: 'sports-mma' },
  { name: 'Zumba', icon: 'music-note' },
  { name: 'CrossFit', icon: 'timer' },
  { name: 'AC Gym', icon: 'ac-unit' },
  { name: 'Women Only', icon: 'female' },
];

const getGymCoverImage = (gym) => {
  if (!gym) return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop';
  if (gym.coverPhoto?.fileData) return gym.coverPhoto.fileData;
  if (typeof gym.coverPhoto === 'string' && gym.coverPhoto.length > 0) return gym.coverPhoto;
  if (gym.galleryPhotos && gym.galleryPhotos.length > 0 && gym.galleryPhotos[0]?.fileData) return gym.galleryPhotos[0].fileData;
  if (gym.images && gym.images.length > 0 && typeof gym.images[0] === 'string') return gym.images[0];
  if (gym.imageUrl) return gym.imageUrl;
  if (gym.image) return gym.image;
  if (gym.logo?.fileData) return gym.logo.fileData;
  return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop';
};

export const HomeScreen = ({ navigation }) => {
  const { isDark, colors } = useTheme();
  const { showToast } = useToast();
  const { user, isAuthenticated, isRestoringSession } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);

  // Auto-redirect to Login if session expires or user is logged out
  useEffect(() => {
    if (!isRestoringSession && !isAuthenticated) {
      navigation.replace('Login');
    }
  }, [isAuthenticated, isRestoringSession, navigation]);

  // Location State
  const [userLocation, setUserLocation] = useState({
    latitude: 13.085,
    longitude: 80.2101,
    name: 'Anna Nagar, Chennai',
    city: 'Chennai',
    isGps: false,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Gyms State (Queried directly from backend MongoDB database)
  const [gyms, setGyms] = useState([]);
  const [isLoadingGyms, setIsLoadingGyms] = useState(true);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [bookmarkedGymNames, setBookmarkedGymNames] = useState(new Set());

  // 2. Check location permission on launch
  useEffect(() => {
    locationService.getPermissionStatus().then((status) => {
      if (status === 'undetermined') {
        const timer = setTimeout(() => {
          setShowLocationModal(true);
        }, 1200);
        return () => clearTimeout(timer);
      } else if (status === 'granted') {
        handleDetectLocation(false);
      }
    });
  }, []);

  // 3. Fetch Nearest Gyms Directly from Backend API on location/filter/search changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingGyms(true);

    const delay = searchQuery.trim().length > 0 ? 350 : 0;
    const timer = setTimeout(() => {
      gymService
        .fetchGyms({
          lat: userLocation.latitude,
          lng: userLocation.longitude,
          category: selectedCategory,
          search: searchQuery,
          type: selectedType,
          facility: selectedFacility,
          workout: selectedWorkout,
        })
        .then((res) => {
          if (isMounted) {
            setGyms(res.gyms || []);
            setIsLoadingGyms(false);
          }
        })
        .catch((_err) => {
          if (isMounted) {
            setIsLoadingGyms(false);
          }
        });
    }, delay);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [
    userLocation.latitude,
    userLocation.longitude,
    selectedCategory,
    searchQuery,
    selectedType,
    selectedFacility,
    selectedWorkout,
  ]);

  const handleDetectLocation = async (showFeedback = true) => {
    setIsLocating(true);
    try {
      const res = await locationService.getCurrentLocation();
      if (res.success && res.location) {
        setUserLocation(res.location);
        setShowLocationModal(false);
        if (showFeedback) {
          showToast({
            message: `Located at ${res.location.name}! Fetching nearest gyms from server.`,
            isSuccess: true,
          });
        }
      } else {
        if (showFeedback) {
          showToast({
            message: res.message || 'Location permission denied. You can select an area manually.',
            isError: true,
          });
        }
      }
    } finally {
      setIsLocating(false);
    }
  };



  // Top Rated Gyms (Rating >= 4.7) from backend response
  const topRatedGyms = useMemo(() => {
    return gyms.filter((g) => (g.rating || 0) >= 4.7);
  }, [gyms]);

  // Filtered Gyms are the backend-computed and processed gyms
  const filteredGyms = gyms;

  const toggleBookmark = (gymName) => {
    setBookmarkedGymNames((prev) => {
      const next = new Set(prev);
      if (next.has(gymName)) {
        next.delete(gymName);
      } else {
        next.add(gymName);
      }
      return next;
    });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedType(null);
    setSelectedFacility(null);
    setSelectedWorkout(null);
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== 'All' ||
    selectedType !== null ||
    selectedFacility !== null ||
    selectedWorkout !== null;


  // 1. Explore Tab View matching Flutter 1:1
  const renderExploreTab = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.exploreScroll}
      >
        {/* 1. Header Bar: Dynamic Greeting + Location */}
        <View style={styles.headerBar}>
          <View>
            <View style={styles.greetingRow}>
              <Text style={[styles.greetingText, { color: colors.text }]}>
                Hello {user?.fullName ? user.fullName.split(' ')[0] : 'Fitness Pro'}
              </Text>
              <Text style={styles.waveEmoji}> 👋</Text>
            </View>
            <TouchableOpacity
              style={styles.locationPillRow}
              activeOpacity={0.7}
              onPress={() => setShowLocationModal(true)}
            >
              <MaterialIcons
                name="location-on"
                size={14}
                color={AppColors.secondaryColor}
              />
              <Text style={[styles.locationCityText, { color: colors.subtitle }]}>
                {userLocation.name}
              </Text>
              {isLocating ? (
                <ActivityIndicator
                  size="small"
                  color={AppColors.primaryColor}
                  style={{ marginLeft: 6 }}
                />
              ) : (
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={16}
                  color={colors.subtitle}
                  style={{ marginLeft: 2 }}
                />
              )}
            </TouchableOpacity>
          </View>

          {/* Notification Button with Red Dot */}
          <TouchableOpacity
            style={[
              styles.notificationBtn,
              {
                backgroundColor: isDark ? '#1E1E1E' : '#F8FAFC',
                borderColor: colors.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <MaterialIcons name="notifications-none" size={24} color={colors.text} />
            <View style={styles.notifRedDot} />
          </TouchableOpacity>
        </View>

        {/* 2. Search & Filter Bar */}
        <View style={styles.searchBarRow}>
          <View
            style={[
              styles.searchInputContainer,
              {
                backgroundColor: isDark ? '#1E1E1E' : '#F8FAFC',
                borderColor: colors.border,
              },
            ]}
          >
            <MaterialIcons
              name="search"
              size={22}
              color={isDark ? 'rgba(255,255,255,0.7)' : AppColors.primaryColor}
              style={{ marginLeft: 12, marginRight: 8 }}
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search gyms, workouts, locations..."
              placeholderTextColor={isDark ? 'rgba(255,255,255,0.45)' : '#94A3B8'}
              style={[styles.searchInput, { color: colors.text }]}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 8 }}>
                <MaterialIcons name="close" size={18} color={colors.subtitle} />
              </TouchableOpacity>
            )}
          </View>

          {/* Solid Gradient Filter Button */}
          <TouchableOpacity
            onPress={() => setShowFilterModal(true)}
            style={styles.filterBtnWrapper}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[AppColors.primaryColor, '#1E40AF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.filterBtn}
            >
              <MaterialIcons name="tune" size={22} color="#FFFFFF" />
              {(selectedType || selectedFacility || selectedWorkout) && (
                <View style={styles.activeFilterDot} />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* 3. High-Impact Promotional Flash Banner */}
        <View style={styles.promoBannerWrapper}>
          <View style={styles.promoBannerContainer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
              }}
              style={styles.promoBannerImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.85)']}
              style={styles.promoGradient}
            />

            <View style={styles.promoContentOverlay}>
              {/* Top Row: Flash Badge & Countdown */}
              <View style={styles.promoTopRow}>
                <View style={styles.flashBadge}>
                  <MaterialIcons name="bolt" size={14} color="#FFFFFF" />
                  <Text style={styles.flashBadgeText}>30% OFF PASS</Text>
                </View>

                <View style={styles.countdownBadge}>
                  <MaterialIcons name="timer" size={12} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.countdownText}>05d : 12h left</Text>
                </View>
              </View>

              {/* Bottom Row: Title, Subtitle, Claim Button */}
              <View style={styles.promoBottomRow}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.promoGymTitle}>
                    {gyms[0]?.name || 'GYMEZY Partner Gym'}
                  </Text>
                  <Text style={styles.promoGymSubtitle}>
                    {gyms[0]?.location || 'Exclusive Membership Deal'}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate('GymDetails', { gym: gyms[0] || {} })}
                  style={styles.claimOfferBtn}
                  activeOpacity={0.85}
                >
                  <Text style={styles.claimOfferText}>Claim Offer</Text>
                  <MaterialIcons
                    name="arrow-forward"
                    size={14}
                    color={AppColors.primaryColor}
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>


        {/* 4. Curated Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPillsScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.name}
                onPress={() => setSelectedCategory(cat.name)}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isSelected
                      ? AppColors.primaryColor
                      : isDark
                      ? '#1E1E1E'
                      : '#F1F5F9',
                    borderColor: isSelected
                      ? 'transparent'
                      : isDark
                      ? 'rgba(255,255,255,0.1)'
                      : '#E2E8F0',
                  },
                ]}
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name={cat.icon}
                  size={16}
                  color={
                    isSelected
                      ? '#FFFFFF'
                      : isDark
                      ? 'rgba(255,255,255,0.7)'
                      : AppColors.primaryColor
                  }
                />
                <Text
                  style={[
                    styles.categoryPillText,
                    {
                      color: isSelected
                        ? '#FFFFFF'
                        : isDark
                        ? 'rgba(255,255,255,0.7)'
                        : colors.text,
                      fontWeight: isSelected ? '700' : '600',
                    },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 5. Spotlight Section: "⭐ Top Rated Near You" Horizontal Carousel */}
        {searchQuery.length === 0 && selectedCategory === 'All' && (
          <View style={styles.spotlightSection}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleWithIcon}>
                <MaterialIcons name="star" size={22} color="#F59E0B" />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Top Rated Near You
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedCategory('All')}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.spotlightScroll}
            >
              {topRatedGyms.map((gym) => {
                const isBookmarked = bookmarkedGymNames.has(gym.name);
                return (
                  <TouchableOpacity
                    key={gym.name}
                    onPress={() => navigation.navigate('GymDetails', { gym })}
                    activeOpacity={0.88}
                    style={[
                      styles.spotlightCard,
                      {
                        backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                      },
                    ]}
                  >
                    {/* Image Stack */}
                    <View style={styles.spotlightImageWrapper}>
                      <Image
                        source={{ uri: getGymCoverImage(gym) }}
                        style={styles.spotlightImage}
                        resizeMode="cover"
                      />
                      {/* Rating Badge */}
                      <View style={styles.spotlightRatingBadge}>
                        <MaterialIcons name="star" size={14} color="#F59E0B" />
                        <Text style={styles.spotlightRatingText}>{gym.rating}</Text>
                      </View>

                      {/* Bookmark Button */}
                      <TouchableOpacity
                        onPress={() => toggleBookmark(gym.name)}
                        style={styles.spotlightBookmarkBtn}
                        activeOpacity={0.8}
                      >
                        <MaterialIcons
                          name={isBookmarked ? 'bookmark' : 'bookmark-border'}
                          size={16}
                          color={isBookmarked ? AppColors.secondaryColor : '#FFFFFF'}
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Details */}
                    <View style={styles.spotlightDetailsPadding}>
                      <Text
                        style={[styles.spotlightGymName, { color: colors.text }]}
                        numberOfLines={1}
                      >
                        {gym.name}
                      </Text>

                      <View style={styles.spotlightLocationRow}>
                        <MaterialIcons
                          name="location-on"
                          size={13}
                          color={colors.subtitle}
                        />
                        <Text
                          style={[styles.spotlightLocationText, { color: colors.subtitle }]}
                          numberOfLines={1}
                        >
                          {gym.location} • {gym.distance} km
                        </Text>
                      </View>

                      <View style={styles.spotlightBottomRow}>
                        <Text style={styles.spotlightPriceText}>
                          <Text style={[styles.spotlightPriceVal, { color: colors.text }]}>
                            ₹{gym.pricePerSession.toFixed(0)}
                          </Text>
                          <Text style={[styles.spotlightPriceSub, { color: colors.subtitle }]}>
                            {' '}
                            /session
                          </Text>
                        </Text>

                        <View style={styles.spotlightBookSlotPill}>
                          <Text style={styles.spotlightBookSlotText}>Book Slot</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* 6. Nearby Gyms Header */}
        <View style={styles.nearbyHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.nearbySectionTitle, { color: colors.text }]}>
              {selectedCategory === 'All' ? 'Nearby Gyms' : `${selectedCategory} Gyms`}
            </Text>
            <View style={styles.gymsCountBadge}>
              <Text style={styles.gymsCountText}>{filteredGyms.length}</Text>
            </View>
          </View>

          {hasActiveFilters && (
            <TouchableOpacity onPress={clearAllFilters}>
              <Text style={styles.resetFiltersText}>Reset Filters</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 7. Gym List Cards */}
        {isLoadingGyms ? (
          <View style={styles.gymsLoadingContainer}>
            <ActivityIndicator size="large" color={AppColors.primaryColor} />
            <Text style={[styles.gymsLoadingText, { color: colors.subtitle }]}>
              Finding nearest gyms in {userLocation.name}...
            </Text>
          </View>
        ) : filteredGyms.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={48} color={colors.subtitle} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No gyms found</Text>
            <Text style={[styles.emptySub, { color: colors.subtitle }]}>
              Try adjusting your search or filters to see more results
            </Text>
          </View>
        ) : (
          filteredGyms.map((gym, index) => {
            const isBookmarked = bookmarkedGymNames.has(gym.name);


            return (
              <View key={gym.id || gym.name} style={{ marginHorizontal: 16, marginBottom: 16 }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('GymDetails', { gym })}
                  activeOpacity={0.9}
                  style={[
                    styles.gymCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  {/* Gym Hero Image with Badges */}
                  <View style={styles.gymCardImageContainer}>
                    <Image
                      source={{ uri: getGymCoverImage(gym) }}
                      style={styles.gymCardImage}
                      resizeMode="cover"
                    />

                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.6)']}
                      style={styles.gymCardGradient}
                    />

                    {/* Popular / Best Badge */}
                    {gym.badgeText && (
                      <View style={styles.cardPopularBadge}>
                        <MaterialIcons name="local-fire-department" size={13} color="#FFFFFF" />
                        <Text style={styles.cardPopularBadgeText}>{gym.badgeText}</Text>
                      </View>
                    )}

                    {/* Bookmark Button */}
                    <TouchableOpacity
                      onPress={() => toggleBookmark(gym.name)}
                      style={styles.cardBookmarkBtn}
                      activeOpacity={0.8}
                    >
                      <MaterialIcons
                        name={isBookmarked ? 'bookmark' : 'bookmark-border'}
                        size={18}
                        color={isBookmarked ? AppColors.secondaryColor : '#FFFFFF'}
                      />
                    </TouchableOpacity>

                    {/* Image Bottom Info Overlay */}
                    <View style={styles.cardImageBottomInfo}>
                      <View style={styles.cardRatingPill}>
                        <MaterialIcons name="star" size={13} color="#F59E0B" />
                        <Text style={styles.cardRatingText}>{gym.rating}</Text>
                        <Text style={styles.cardReviewsCountText}>({gym.reviewsCount})</Text>
                      </View>

                      <View style={styles.cardDistancePill}>
                        <MaterialIcons name="near-me" size={12} color="#FFFFFF" />
                        <Text style={styles.cardDistanceText}>{gym.distance} km</Text>
                      </View>
                    </View>
                  </View>

                  {/* Gym Card Details Content */}
                  <View style={styles.gymCardDetailsContent}>
                    <View style={styles.gymTitleRow}>
                      <Text
                        style={[styles.cardGymNameTitle, { color: colors.text }]}
                        numberOfLines={1}
                      >
                        {gym.name}
                      </Text>
                      <Text style={[styles.cardPerSessionPrice, { color: colors.text }]}>
                        ₹{gym.pricePerSession.toFixed(0)}
                        <Text style={[styles.cardPerSessionSub, { color: colors.subtitle }]}>
                          /session
                        </Text>
                      </Text>
                    </View>

                    <Text
                      style={[styles.cardGymAddressText, { color: colors.subtitle }]}
                      numberOfLines={1}
                    >
                      {gym.location}
                    </Text>

                    {/* Tags Row */}
                    <View style={styles.tagsContainer}>
                      {(gym.tags || ['Strength', 'Cardio']).slice(0, 3).map((tag, idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.tagChip,
                            {
                              backgroundColor: isDark ? '#262626' : '#F1F5F9',
                              borderColor: colors.border,
                            },
                          ]}
                        >
                          <Text style={[styles.tagChipText, { color: colors.subtitle }]}>
                            {tag}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Bottom Action Strip */}
                    <View style={styles.gymCardBottomStrip}>
                      <View>
                        <Text style={[styles.pricePrefix, { color: colors.subtitle }]}>
                          Pass starts from
                        </Text>
                        <Text style={[styles.cardPriceText, { color: colors.text }]}>
                          ₹{gym.pricePerSession.toFixed(0)}{' '}
                          <Text style={styles.cardPerSession}>/ day</Text>
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => navigation.navigate('GymDetails', { gym })}
                        style={[styles.viewGymBtn, { backgroundColor: AppColors.primaryColor }]}
                      >
                        <Text style={styles.viewGymText}>Book Now</Text>
                        <MaterialIcons name="arrow-forward" size={14} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        )}

        {/* 8. 'GYMEZY for you' and Watermark Branding Section at the bottom of the feed */}
        {!isLoadingGyms && (
          <View style={styles.gymezyForYouSection}>
            <View style={styles.forYouHeader}>
              <Text style={[styles.forYouTitle, { color: colors.text }]}>
                GYMEZY for you
              </Text>
              <View style={styles.exclusiveBadge}>
                <Text style={styles.exclusiveBadgeText}>Exclusive</Text>
              </View>
            </View>

            {/* 2-Column Cards Grid */}
            <View style={styles.forYouGrid}>
              <TouchableOpacity
                onPress={() => navigation.navigate('BuyMembership', { gym: gyms[0] || {} })}
                style={[
                  styles.forYouCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.forYouIconBox,
                    { backgroundColor: 'rgba(0, 56, 130, 0.1)' },
                  ]}
                >
                  <MaterialIcons
                    name="card-membership"
                    size={24}
                    color={AppColors.primaryColor}
                  />
                </View>
                <Text style={[styles.forYouCardTitle, { color: colors.text }]}>
                  All-Access Pass
                </Text>
                <Text style={[styles.forYouCardSub, { color: colors.subtitle }]}>
                  Work out at any partner gym across Chennai
                </Text>
                <View style={styles.forYouLinkRow}>
                  <Text
                    style={[
                      styles.forYouLinkText,
                      { color: isDark ? '#93C5FD' : AppColors.primaryColor },
                    ]}
                  >
                    Get pass
                  </Text>
                  <MaterialIcons
                    name="arrow-outward"
                    size={14}
                    color={isDark ? '#93C5FD' : AppColors.primaryColor}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('BookingSession', { gym: gyms[0] || {} })}
                style={[
                  styles.forYouCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.forYouIconBox,
                    { backgroundColor: 'rgba(0, 191, 98, 0.12)' },
                  ]}
                >
                  <MaterialIcons
                    name="fitness-center"
                    size={24}
                    color={AppColors.secondaryColor}
                  />
                </View>
                <Text style={[styles.forYouCardTitle, { color: colors.text }]}>
                  Certified Trainers
                </Text>
                <Text style={[styles.forYouCardSub, { color: colors.subtitle }]}>
                  Book 1-on-1 personal coaches at special rates
                </Text>
                <View style={styles.forYouLinkRow}>
                  <Text
                    style={[
                      styles.forYouLinkText,
                      { color: AppColors.secondaryColor },
                    ]}
                  >
                    Book trainer
                  </Text>
                  <MaterialIcons
                    name="arrow-outward"
                    size={14}
                    color={AppColors.secondaryColor}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* Watermark Branding */}
            <View style={styles.watermarkSection}>
              <Text
                style={[
                  styles.watermarkLogo,
                  {
                    color: isDark
                      ? 'rgba(255, 255, 255, 0.16)'
                      : 'rgba(1, 50, 126, 0.12)',
                  },
                ]}
              >
                gymezy
              </Text>
              <Text
                style={[
                  styles.watermarkTagline,
                  {
                    color: isDark
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(1, 50, 126, 0.10)',
                  },
                ]}
              >
                for fitness. for you
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
        {currentTab === 0 && renderExploreTab()}
        {currentTab === 1 && <MyBookingsScreen navigation={navigation} />}
        {currentTab === 2 && <MyMembershipsScreen navigation={navigation} />}
        {currentTab === 3 && (
          <ProfileScreen
            navigation={navigation}
            onNavigateToBookings={() => setCurrentTab(1)}
            onNavigateToMemberships={() => setCurrentTab(2)}
          />
        )}
      </SafeAreaView>

      {/* Floating Bottom Navigation Bar */}
      <CustomFloatingNavBar
        currentIndex={currentTab}
        onTap={(index) => setCurrentTab(index)}
      />

      {/* Filter Bottom Sheet Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.filterModalOverlay}>
          <View
            style={[
              styles.filterModalContent,
              { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' },
            ]}
          >
            <View style={styles.filterModalHeader}>
              <Text style={[styles.filterModalTitle, { color: colors.text }]}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <MaterialIcons name="close" size={24} color={colors.subtitle} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Gym Type */}
              <Text style={[styles.filterGroupTitle, { color: colors.text }]}>Gym Type</Text>
              <View style={styles.filterChipsRow}>
                {['All Gyms', 'Unisex', 'Women Only', 'Men Only'].map((type) => {
                  const isSel = (selectedType === null && type === 'All Gyms') || selectedType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setSelectedType(type === 'All Gyms' ? null : type)}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: isSel
                            ? AppColors.primaryColor
                            : isDark
                            ? '#262626'
                            : '#F1F5F9',
                          borderColor: isSel ? AppColors.primaryColor : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          { color: isSel ? '#FFFFFF' : colors.text },
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Facility */}
              <Text style={[styles.filterGroupTitle, { color: colors.text, marginTop: 16 }]}>
                Facilities
              </Text>
              <View style={styles.filterChipsRow}>
                {['All Facilities', 'AC', 'Locker', 'Shower', 'Parking'].map((fac) => {
                  const isSel = (selectedFacility === null && fac === 'All Facilities') || selectedFacility === fac;
                  return (
                    <TouchableOpacity
                      key={fac}
                      onPress={() => setSelectedFacility(fac === 'All Facilities' ? null : fac)}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: isSel
                            ? AppColors.primaryColor
                            : isDark
                            ? '#262626'
                            : '#F1F5F9',
                          borderColor: isSel ? AppColors.primaryColor : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          { color: isSel ? '#FFFFFF' : colors.text },
                        ]}
                      >
                        {fac}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.filterActionsRow}>
              <TouchableOpacity
                onPress={clearAllFilters}
                style={[styles.filterResetBtn, { borderColor: colors.border }]}
              >
                <Text style={[styles.filterResetText, { color: colors.text }]}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                style={styles.filterApplyBtn}
              >
                <Text style={styles.filterApplyText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ==================== LOCATION PERMISSION & CITY MODAL ==================== */}
      <Modal
        visible={showLocationModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.filterModalOverlay}>
          <View
            style={[
              styles.locationModalContent,
              { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' },
            ]}
          >
            {/* Top Icon Badge */}
            <View style={styles.locationModalIconWrapper}>
              <LinearGradient
                colors={['#722ED1', AppColors.primaryColor]}
                style={styles.locationModalIconBadge}
              >
                <MaterialIcons name="near-me" size={26} color="#FFFFFF" />
              </LinearGradient>
            </View>

            <Text style={[styles.locationModalHeading, { color: colors.text }]}>
              Find Nearest Gyms
            </Text>
            <Text style={[styles.locationModalSubText, { color: colors.subtitle }]}>
              Enable GPS location to discover fitness studios, daily workout passes, and personal trainers nearest to you with travel distance.
            </Text>

            {/* GPS Enable Button */}
            <TouchableOpacity
              style={[
                styles.gpsEnableActionBtn,
                { backgroundColor: AppColors.primaryColor },
              ]}
              onPress={() => handleDetectLocation(true)}
              disabled={isLocating}
              activeOpacity={0.85}
            >
              {isLocating ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={styles.gpsBtnRow}>
                  <MaterialIcons name="my-location" size={18} color="#FFFFFF" />
                  <Text style={styles.gpsEnableBtnText}>Allow Location (GPS)</Text>
                </View>
              )}
            </TouchableOpacity>




            {/* Dismiss Button */}
            <TouchableOpacity
              style={styles.locationDismissAction}
              onPress={() => setShowLocationModal(false)}
            >
              <Text style={[styles.locationDismissText, { color: colors.subtitle }]}>
                Maybe Later
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  exploreScroll: {
    paddingBottom: 120,
  },

  /* Header Bar */
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: -0.3,
  },
  waveEmoji: {
    fontSize: 20,
  },
  locationPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationCityText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  notifRedDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },

  /* Search & Filter Bar */
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  searchInputContainer: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    height: '100%',
  },
  filterBtnWrapper: {
    marginLeft: 10,
    borderRadius: 16,
  },
  filterBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeFilterDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.secondaryColor,
  },

  /* High-Impact Promotional Flash Banner */
  promoBannerWrapper: {
    paddingHorizontal: 16,
    marginTop: 18,
  },
  promoBannerContainer: {
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  promoBannerImage: {
    width: '100%',
    height: '100%',
  },
  promoGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  promoContentOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 18,
    justifyContent: 'space-between',
  },
  promoTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flashBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.secondaryColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  flashBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 3,
  },
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.24)',
  },
  countdownText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  promoBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  promoGymTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  promoGymSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  claimOfferBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  claimOfferText: {
    color: AppColors.primaryColor,
    fontSize: 12,
    fontWeight: 'bold',
  },

  /* Category Pills */
  categoryPillsScroll: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 4,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
  },
  categoryPillText: {
    fontSize: 13,
    marginLeft: 6,
  },

  /* Spotlight Section */
  spotlightSection: {
    marginTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: AppColors.secondaryColor,
  },
  spotlightScroll: {
    paddingHorizontal: 16,
  },
  spotlightCard: {
    width: 250,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 14,
    overflow: 'hidden',
  },
  spotlightImageWrapper: {
    height: 120,
    width: '100%',
    position: 'relative',
  },
  spotlightImage: {
    width: '100%',
    height: '100%',
  },
  spotlightRatingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  spotlightRatingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  spotlightBookmarkBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spotlightDetailsPadding: {
    padding: 12,
  },
  spotlightGymName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  spotlightLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  spotlightLocationText: {
    fontSize: 11,
    marginLeft: 2,
  },
  spotlightBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  spotlightPriceText: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  spotlightPriceVal: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  spotlightPriceSub: {
    fontSize: 10,
  },
  spotlightBookSlotPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 56, 130, 0.08)',
  },
  spotlightBookSlotText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: AppColors.primaryColor,
  },

  /* Nearby Gyms Header */
  nearbyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 14,
  },
  nearbySectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  gymsCountBadge: {
    backgroundColor: 'rgba(0, 56, 130, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 8,
  },
  gymsCountText: {
    color: AppColors.primaryColor,
    fontSize: 12,
    fontWeight: 'bold',
  },
  resetFiltersText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: 'bold',
  },

  /* Gym Card */
  gymCard: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  gymCardImageContainer: {
    height: 160,
    width: '100%',
    position: 'relative',
  },
  gymCardImage: {
    width: '100%',
    height: '100%',
  },
  gymCardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
  },
  cardPopularBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.secondaryColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  cardPopularBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  cardBookmarkBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImageBottomInfo: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardRatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  cardRatingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  cardReviewsCountText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    marginLeft: 2,
  },
  cardDistancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  cardDistanceText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  gymCardDetailsContent: {
    padding: 16,
  },
  gymTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardGymNameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  cardPerSessionPrice: {
    fontSize: 15,
    fontWeight: '800',
  },
  cardPerSessionSub: {
    fontSize: 11,
    fontWeight: 'normal',
  },
  cardGymAddressText: {
    fontSize: 12.5,
    marginTop: 3,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tagChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagChipText: {
    fontSize: 11,
  },
  gymCardBottomStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 0.8,
    borderTopColor: '#E2E8F0',
  },
  pricePrefix: {
    fontSize: 10,
  },
  cardPriceText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  cardPerSession: {
    fontSize: 11,
    fontWeight: 'normal',
  },
  viewGymBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  viewGymText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },

  /* 'GYMEZY for you' Section */
  gymezyForYouSection: {
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  forYouHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  forYouTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    letterSpacing: -0.3,
  },
  exclusiveBadge: {
    backgroundColor: 'rgba(0, 191, 98, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  exclusiveBadgeText: {
    color: AppColors.secondaryColor,
    fontSize: 10,
    fontWeight: 'bold',
  },
  forYouGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  forYouCard: {
    flex: 1,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  forYouIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  forYouCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  forYouCardSub: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4,
  },
  forYouLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  forYouLinkText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },
  watermarkSection: {
    marginTop: 24,
    marginBottom: 10,
  },
  watermarkLogo: {
    fontSize: 46,
    fontWeight: '900',
    letterSpacing: 2,
  },
  watermarkTagline: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2.5,
  },

  /* Empty State */
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    marginTop: 4,
  },

  /* Filter Modal */
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  filterModalContent: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '80%',
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterGroupTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterActionsRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  filterResetBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterResetText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterApplyBtn: {
    flex: 2,
    height: 48,
    borderRadius: 14,
    backgroundColor: AppColors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterApplyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  /* Location Modal Styles */
  locationModalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  locationModalIconWrapper: {
    alignItems: 'center',
    marginBottom: 12,
  },
  locationModalIconBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#722ED1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  locationModalHeading: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  locationModalSubText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  gpsEnableActionBtn: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AppColors.primaryColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  gpsBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gpsEnableBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },

  locationDismissAction: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 10,
  },
  locationDismissText: {
    fontSize: 13.5,
    fontWeight: '600',
  },

  gymsLoadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gymsLoadingText: {
    marginTop: 12,
    fontSize: 13.5,
    fontWeight: '600',
  },
});

