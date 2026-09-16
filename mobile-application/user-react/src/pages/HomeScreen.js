import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors, AppTheme } from '../theme/appTheme';
import { MockData } from '../data/mockData';
import { CustomFloatingNavBar } from '../widgets/CustomFloatingNavBar';
import { MyBookingsScreen } from './MyBookingsScreen';
import { MyMembershipsScreen } from './MyMembershipsScreen';
import { ProfileScreen } from './ProfileScreen';

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

export const HomeScreen = ({ navigation }) => {
  const { isDark, colors } = useTheme();
  const [currentTab, setCurrentTab] = useState(0);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [bookmarkedGymNames, setBookmarkedGymNames] = useState(
    new Set(['FitZone Gym', 'PowerHouse Gym'])
  );

  const allGyms = MockData.gyms;

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

  // Filter logic matching Flutter
  const filteredGyms = allGyms.filter((gym) => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      const matchesName = gym.name.toLowerCase().includes(q);
      const matchesLocation = gym.location.toLowerCase().includes(q);
      const matchesTags = gym.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchesName && !matchesLocation && !matchesTags) return false;
    }

    if (selectedCategory !== 'All') {
      if (
        selectedCategory === 'AC Gym' &&
        !gym.facilities.some((f) => f.toLowerCase().includes('ac'))
      ) {
        return false;
      }
      if (
        selectedCategory === 'Women Only' &&
        !gym.name.includes('Zone') &&
        !gym.tags.includes('Women Only')
      ) {
        return false;
      }
      if (
        selectedCategory === 'Strength' &&
        !gym.tags.includes('Strength') &&
        !gym.tags.includes('Bodybuilding')
      ) {
        return false;
      }
      if (
        selectedCategory === 'HIIT' &&
        !gym.tags.includes('HIIT') &&
        !gym.tags.includes('Cardio')
      ) {
        return false;
      }
      if (selectedCategory === 'Yoga' && !gym.tags.includes('Yoga')) {
        return false;
      }
      if (
        selectedCategory === 'Boxing' &&
        !gym.tags.includes('Boxing') &&
        !gym.tags.includes('MMA')
      ) {
        return false;
      }
      if (
        selectedCategory === 'Zumba' &&
        !gym.tags.includes('Zumba') &&
        !gym.tags.includes('Dance')
      ) {
        return false;
      }
      if (selectedCategory === 'CrossFit' && !gym.tags.includes('CrossFit')) {
        return false;
      }
    }

    if (selectedType) {
      if (selectedType === 'Women Only' && !gym.name.includes('Zone')) return false;
      if (selectedType === 'Men Only' && gym.name.includes('Studio')) return false;
    }
    if (selectedFacility) {
      if (selectedFacility === 'AC' && gym.rating < 4.6) return false;
    }
    if (selectedWorkout) {
      if (!gym.tags.includes(selectedWorkout)) return false;
    }

    return true;
  });

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

  // 1. Explore Tab View
  const renderExploreTab = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.exploreScroll}
      >
        {/* Location & Notification Header */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <View style={styles.locationPill}>
              <MaterialIcons name="location-on" size={16} color={AppColors.primaryNavy} />
              <Text style={styles.locationCity}>Chennai</Text>
              <MaterialIcons name="keyboard-arrow-down" size={18} color="#64748B" />
            </View>
            <Text style={[styles.subAddress, { color: colors.subtitle }]}>
              Anna Nagar, 2nd Avenue
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.notificationBtn,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <MaterialIcons name="notifications-none" size={22} color={colors.text} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>

        {/* Search & Filter Bar */}
        <View style={styles.searchBarRow}>
          <View
            style={[
              styles.searchInputContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <MaterialIcons name="search" size={20} color={colors.subtitle} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search gyms, workouts, or locations"
              placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={18} color={colors.subtitle} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => setShowFilterModal(true)}
            style={[
              styles.filterBtn,
              {
                backgroundColor:
                  selectedType || selectedFacility || selectedWorkout
                    ? AppColors.primaryNavy
                    : colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <MaterialIcons
              name="tune"
              size={20}
              color={
                selectedType || selectedFacility || selectedWorkout
                  ? '#FFFFFF'
                  : colors.text
              }
            />
          </TouchableOpacity>
        </View>

        {/* Promotional Flash Offer Hero Banner */}
        <View style={styles.bannerContainer}>
          <LinearGradient
            colors={['#002B66', '#01327E', '#0047AB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bannerGradient}
          >
            <View style={styles.bannerLeft}>
              <View style={styles.flashBadge}>
                <MaterialIcons name="bolt" size={12} color="#FBBF24" />
                <Text style={styles.flashBadgeText}>FLASH OFFER</Text>
              </View>
              <Text style={styles.bannerHeading}>Get 50% OFF</Text>
              <Text style={styles.bannerSub}>On your first single-session gym pass</Text>
              <TouchableOpacity
                onPress={() => {
                  if (allGyms.length > 0) {
                    navigation.navigate('GymDetails', { gym: allGyms[0] });
                  }
                }}
                style={styles.bannerCta}
                activeOpacity={0.8}
              >
                <Text style={styles.bannerCtaText}>Book for ₹99</Text>
                <MaterialIcons name="arrow-forward" size={14} color="#01327E" />
              </TouchableOpacity>
            </View>

            <Image
              source={require('../../assets/logo/gymezy.png')}
              style={styles.bannerBgLogo}
              resizeMode="contain"
            />
          </LinearGradient>
        </View>

        {/* Curated Workout Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.name}
                onPress={() => setSelectedCategory(cat.name)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected
                      ? isDark
                        ? 'rgba(99, 102, 241, 0.25)'
                        : '#EEF2FF'
                      : isDark
                      ? '#262626'
                      : colors.card,
                    borderColor: isSelected
                      ? AppColors.accentColor
                      : colors.border,
                  },
                ]}
              >
                <MaterialIcons
                  name={cat.icon}
                  size={16}
                  color={
                    isSelected
                      ? isDark
                        ? '#93C5FD'
                        : AppColors.accentColor
                      : colors.subtitle
                  }
                />
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: isSelected
                        ? isDark
                          ? '#93C5FD'
                          : AppColors.accentColor
                        : colors.text,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Spotlight Carousel (when no search active) */}
        {searchQuery.length === 0 && selectedCategory === 'All' && (
          <View style={styles.spotlightSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Featured Spotlight
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.subtitle }]}>
                Top Rated Partner Gyms
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.spotlightScroll}
            >
              {allGyms.slice(0, 3).map((gym) => (
                <TouchableOpacity
                  key={gym.name}
                  onPress={() => navigation.navigate('GymDetails', { gym })}
                  activeOpacity={0.9}
                  style={[
                    styles.spotlightCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Image source={{ uri: gym.imageUrl }} style={styles.spotlightImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.85)']}
                    style={styles.spotlightGradient}
                  />

                  {/* Badge */}
                  {gym.badgeText && (
                    <View style={styles.spotlightBadge}>
                      <Text style={styles.spotlightBadgeText}>{gym.badgeText}</Text>
                    </View>
                  )}

                  {/* Rating Pill */}
                  <View style={styles.spotlightRatingPill}>
                    <MaterialIcons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.spotlightRatingText}>{gym.rating}</Text>
                  </View>

                  <View style={styles.spotlightContent}>
                    <Text style={styles.spotlightName}>{gym.name}</Text>
                    <Text style={styles.spotlightLoc}>{gym.location}</Text>
                    <View style={styles.spotlightBottomRow}>
                      <Text style={styles.spotlightPrice}>
                        ₹{gym.pricePerSession.toFixed(0)}{' '}
                        <Text style={styles.perSessionText}>/ session</Text>
                      </Text>
                      <View style={styles.spotlightBookBtn}>
                        <Text style={styles.spotlightBookText}>Book Now</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Nearby Gyms Header & Count */}
        <View style={styles.nearbyHeaderRow}>
          <View style={styles.nearbyTitleGroup}>
            <Text style={[styles.nearbyTitle, { color: colors.text }]}>
              {selectedCategory === 'All' ? 'Nearby Gyms' : `${selectedCategory} Gyms`}
            </Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{filteredGyms.length}</Text>
            </View>
          </View>

          {hasActiveFilters && (
            <TouchableOpacity onPress={clearAllFilters}>
              <Text style={styles.resetFiltersText}>Reset Filters</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Gym List Cards */}
        {filteredGyms.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={48} color={colors.subtitle} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Gyms Found
            </Text>
            <Text style={[styles.emptySub, { color: colors.subtitle }]}>
              Try adjusting your filters or search keywords
            </Text>
            <TouchableOpacity
              onPress={clearAllFilters}
              style={[styles.emptyResetBtn, { backgroundColor: AppColors.primaryNavy }]}
            >
              <Text style={styles.emptyResetText}>Reset All Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredGyms.map((gym) => {
            const isBookmarked = bookmarkedGymNames.has(gym.name);
            return (
              <TouchableOpacity
                key={gym.name}
                onPress={() => navigation.navigate('GymDetails', { gym })}
                activeOpacity={0.88}
                style={[
                  styles.gymCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                {/* Gym Photo */}
                <View style={styles.gymCardImageWrapper}>
                  <Image source={{ uri: gym.imageUrl }} style={styles.gymCardImage} />

                  {/* Bookmark Button */}
                  <TouchableOpacity
                    onPress={() => toggleBookmark(gym.name)}
                    style={styles.bookmarkIconBtn}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name={isBookmarked ? 'bookmark' : 'bookmark-border'}
                      size={20}
                      color={isBookmarked ? AppColors.secondaryColor : '#FFFFFF'}
                    />
                  </TouchableOpacity>

                  {/* Distance Pill */}
                  <View style={styles.distancePill}>
                    <MaterialIcons name="near-me" size={11} color="#FFFFFF" />
                    <Text style={styles.distanceText}>{gym.distance} km away</Text>
                  </View>
                </View>

                {/* Card Content */}
                <View style={styles.gymCardBody}>
                  <View style={styles.gymCardHeaderRow}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.gymCardTitle, { color: colors.text }]}
                        numberOfLines={1}
                      >
                        {gym.name}
                      </Text>
                      <Text
                        style={[styles.gymCardLocation, { color: colors.subtitle }]}
                        numberOfLines={1}
                      >
                        {gym.location}
                      </Text>
                    </View>

                    {/* Rating badge */}
                    <View
                      style={[
                        styles.ratingBadge,
                        {
                          backgroundColor: isDark
                            ? 'rgba(27, 94, 32, 0.3)'
                            : '#E8F5E9',
                        },
                      ]}
                    >
                      <MaterialIcons name="star" size={12} color="#16A34A" />
                      <Text style={styles.ratingBadgeText}>{gym.rating}</Text>
                      <Text style={styles.ratingCountText}>({gym.reviewsCount})</Text>
                    </View>
                  </View>

                  {/* Tags */}
                  <View style={styles.tagsRow}>
                    {gym.tags.slice(0, 3).map((tag, idx) => (
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

                  {/* Bottom Price & Booking Strip */}
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
                      style={[
                        styles.viewGymBtn,
                        { backgroundColor: AppColors.primaryNavy },
                      ]}
                    >
                      <Text style={styles.viewGymText}>View Details</Text>
                      <MaterialIcons name="arrow-forward" size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
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
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.filterModalHeader}>
              <Text style={[styles.filterModalTitle, { color: colors.text }]}>
                Filter Gyms
              </Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              {/* Gym Type Filter */}
              <Text style={[styles.filterGroupTitle, { color: colors.text }]}>
                Gym Type
              </Text>
              <View style={styles.filterChipsRow}>
                {['Unisex', 'Women Only', 'Men Only'].map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setSelectedType(selectedType === t ? null : t)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor:
                          selectedType === t ? AppColors.primaryNavy : colors.background,
                        borderColor:
                          selectedType === t ? AppColors.primaryNavy : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: selectedType === t ? '#FFFFFF' : colors.text,
                        fontWeight: selectedType === t ? '700' : '500',
                      }}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Facilities Filter */}
              <Text style={[styles.filterGroupTitle, { color: colors.text }]}>
                Key Facilities
              </Text>
              <View style={styles.filterChipsRow}>
                {['AC', 'Locker', 'Shower', 'Parking'].map((f) => (
                  <TouchableOpacity
                    key={f}
                    onPress={() =>
                      setSelectedFacility(selectedFacility === f ? null : f)
                    }
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor:
                          selectedFacility === f
                            ? AppColors.primaryNavy
                            : colors.background,
                        borderColor:
                          selectedFacility === f
                            ? AppColors.primaryNavy
                            : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: selectedFacility === f ? '#FFFFFF' : colors.text,
                        fontWeight: selectedFacility === f ? '700' : '500',
                      }}
                    >
                      {f}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Workouts Filter */}
              <Text style={[styles.filterGroupTitle, { color: colors.text }]}>
                Workouts Offered
              </Text>
              <View style={styles.filterChipsRow}>
                {['Strength', 'CrossFit', 'Yoga', 'HIIT', 'Zumba'].map((w) => (
                  <TouchableOpacity
                    key={w}
                    onPress={() =>
                      setSelectedWorkout(selectedWorkout === w ? null : w)
                    }
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor:
                          selectedWorkout === w
                            ? AppColors.primaryNavy
                            : colors.background,
                        borderColor:
                          selectedWorkout === w
                            ? AppColors.primaryNavy
                            : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: selectedWorkout === w ? '#FFFFFF' : colors.text,
                        fontWeight: selectedWorkout === w ? '700' : '500',
                      }}
                    >
                      {w}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.filterBottomActions}>
              <TouchableOpacity
                onPress={() => {
                  clearAllFilters();
                  setShowFilterModal(false);
                }}
                style={[styles.filterResetBtn, { borderColor: colors.border }]}
              >
                <Text style={{ color: colors.text, fontWeight: '700' }}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                style={[
                  styles.filterApplyBtn,
                  { backgroundColor: AppColors.secondaryColor },
                ]}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
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
    paddingBottom: 95,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationCity: {
    fontSize: 16,
    fontWeight: '800',
    color: AppColors.primaryNavy,
    marginHorizontal: 4,
  },
  subAddress: {
    fontSize: 12,
    marginTop: 2,
  },
  notificationBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  searchBarRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    marginLeft: 8,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  bannerGradient: {
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  bannerLeft: {
    flex: 1,
    zIndex: 2,
  },
  flashBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  flashBadgeText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  bannerHeading: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  bannerSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    marginTop: 3,
    marginBottom: 12,
  },
  bannerCta: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  bannerCtaText: {
    color: '#01327E',
    fontSize: 12.5,
    fontWeight: '800',
    marginRight: 4,
  },
  bannerBgLogo: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 140,
    height: 140,
    opacity: 0.15,
    tintColor: '#FFFFFF',
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12.5,
    marginLeft: 6,
  },
  spotlightSection: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  spotlightScroll: {
    paddingHorizontal: 16,
  },
  spotlightCard: {
    width: SCREEN_WIDTH * 0.72,
    height: 190,
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: 14,
    position: 'relative',
  },
  spotlightImage: {
    width: '100%',
    height: '100%',
  },
  spotlightGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  spotlightBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: AppColors.secondaryColor,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  spotlightBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  spotlightRatingPill: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  spotlightRatingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 3,
  },
  spotlightContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  spotlightName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  spotlightLoc: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11.5,
    marginTop: 2,
  },
  spotlightBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  spotlightPrice: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  perSessionText: {
    fontSize: 10,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
  },
  spotlightBookBtn: {
    backgroundColor: AppColors.secondaryColor,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  spotlightBookText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  nearbyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  nearbyTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nearbyTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  countBadge: {
    backgroundColor: 'rgba(0, 56, 130, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 8,
  },
  countBadgeText: {
    color: AppColors.primaryNavy,
    fontSize: 12,
    fontWeight: '800',
  },
  resetFiltersText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
  gymCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  gymCardImageWrapper: {
    height: 160,
    position: 'relative',
  },
  gymCardImage: {
    width: '100%',
    height: '100%',
  },
  bookmarkIconBtn: {
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
  distancePill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  distanceText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  gymCardBody: {
    padding: 16,
  },
  gymCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  gymCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  gymCardLocation: {
    fontSize: 12.5,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 8,
  },
  ratingBadgeText: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 3,
  },
  ratingCountText: {
    color: '#64748B',
    fontSize: 10,
    marginLeft: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  tagChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 0.8,
    marginRight: 6,
  },
  tagChipText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  gymCardBottomStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 0.8,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  pricePrefix: {
    fontSize: 10.5,
  },
  cardPriceText: {
    fontSize: 16,
    fontWeight: '800',
  },
  cardPerSession: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
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
    fontWeight: '700',
    marginRight: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  emptyResetBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  emptyResetText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  filterModalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '80%',
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterModalTitle: {
    fontSize: 19,
    fontWeight: '800',
  },
  filterGroupTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 10,
  },
  filterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  filterBottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  filterResetBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  filterApplyBtn: {
    flex: 2,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
