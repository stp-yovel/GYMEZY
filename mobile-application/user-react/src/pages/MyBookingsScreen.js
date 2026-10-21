import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors, AppTheme } from '../theme/appTheme';
import { useBookingRepository } from '../data/BookingContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TABS = ['Upcoming', 'Completed', 'Cancelled'];

export const MyBookingsScreen = ({ navigation, initialShowHub = false }) => {
  const { isDark, colors } = useTheme();
  const { bookings, memberships } = useBookingRepository();

  const [showHub, setShowHub] = useState(initialShowHub);
  const [selectedTab, setSelectedTab] = useState('Upcoming');

  const upcomingCount = bookings.filter((b) => b.status === 'Upcoming').length;
  const completedCount = bookings.filter((b) => b.status === 'Completed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'Cancelled').length;

  const filteredBookings = bookings.filter((b) => b.status === selectedTab);

  const bookNewSession = (_category = 'Gym') => {
    navigation.navigate('HomeTabs');
  };

  const buyMembership = () => {
    navigation.navigate('HomeTabs');
  };

  const openBookingDetails = (booking) => {
    navigation.navigate('BookingDetails', { booking });
  };

  const getCategoryIcon = (type, iconName) => {
    const t = (type || '').toLowerCase();
    if (t.includes('yoga')) {
      return {
        name: 'self-improvement',
        color: '#8B5CF6',
        bg: isDark ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.12)',
      };
    }
    if (t.includes('zumba') || t.includes('dance')) {
      return {
        name: 'music-note',
        color: '#EC4899',
        bg: isDark ? 'rgba(236, 72, 153, 0.25)' : 'rgba(236, 72, 153, 0.12)',
      };
    }
    return {
      name: 'fitness-center',
      color: isDark ? '#93C5FD' : AppColors.primaryColor,
      bg: isDark ? 'rgba(0, 56, 130, 0.35)' : 'rgba(0, 56, 130, 0.12)',
    };
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header matching Flutter */}
      <View style={styles.appBar}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.appBarTitle, { color: colors.text }]}>
            {showHub ? 'Booking Hub' : 'My Bookings'}
          </Text>
          {!showHub && (
            <Text style={styles.activePassesSub}>
              {upcomingCount} active {upcomingCount === 1 ? 'pass' : 'passes'}
            </Text>
          )}
        </View>

        {/* Top Right Action: "+ Book" Gradient Pill */}
        <TouchableOpacity
          onPress={() => bookNewSession('Gym')}
          style={styles.bookCtaPillWrapper}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[AppColors.primaryColor, '#0D47A1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bookCtaPill}
          >
            <MaterialIcons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.bookCtaText}>Book</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Hub View / List View Toggle Button */}
        <TouchableOpacity
          onPress={() => setShowHub(!showHub)}
          style={styles.hubToggleBtn}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name={showHub ? 'view-agenda' : 'grid-view'}
            size={22}
            color={isDark ? '#E2E8F0' : '#01327E'}
          />
        </TouchableOpacity>
      </View>

      {showHub ? (
        /* ========================================== */
        /* PANEL 1: CHOOSE WHAT YOU WANT TO DO (HUB)  */
        /* ========================================== */
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.hubScrollContent}
        >
          <Text style={[styles.hubSectionHeading, { color: colors.text }]}>
            Choose What You Want to Do
          </Text>

          {/* 1. Buy Membership Hub Card */}
          <TouchableOpacity
            onPress={buyMembership}
            style={[
              styles.hubCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            activeOpacity={0.88}
          >
            <View style={[styles.hubIconCircle, { backgroundColor: 'rgba(139, 92, 246, 0.12)' }]}>
              <MaterialIcons name="workspace-premium" size={28} color="#8B5CF6" />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={[styles.hubCardTitle, { color: colors.text }]}>Buy Membership</Text>
              <Text style={[styles.hubCardSub, { color: colors.subtitle }]}>
                Unlimited all-access gym passes & trainer plans
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={colors.subtitle} />
          </TouchableOpacity>

          {/* 2. Session Bookings Hub Card */}
          <TouchableOpacity
            onPress={() => bookNewSession('Gym')}
            style={[
              styles.hubCard,
              { backgroundColor: colors.card, borderColor: colors.border, marginTop: 14 },
            ]}
            activeOpacity={0.88}
          >
            <View
              style={[
                styles.hubIconCircle,
                { backgroundColor: 'rgba(0, 56, 130, 0.12)' },
              ]}
            >
              <MaterialIcons name="fitness-center" size={28} color={AppColors.primaryColor} />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={[styles.hubCardTitle, { color: colors.text }]}>Book Workout Session</Text>
              <Text style={[styles.hubCardSub, { color: colors.subtitle }]}>
                Single day passes, Yoga, Zumba & HIIT classes
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={colors.subtitle} />
          </TouchableOpacity>

          {/* 3. Quick Workout Categories Grid */}
          <Text style={[styles.hubSubheading, { color: colors.text }]}>
            Quick Session Categories
          </Text>
          <View style={styles.categoryGrid}>
            {[
              { label: 'Gym Access', icon: 'fitness-center', color: '#003882' },
              { label: 'Yoga Class', icon: 'self-improvement', color: '#8B5CF6' },
              { label: 'Zumba Class', icon: 'music-note', color: '#EC4899' },
              { label: 'HIIT / Cardio', icon: 'bolt', color: '#EF4444' },
            ].map((cat) => (
              <TouchableOpacity
                key={cat.label}
                onPress={() => bookNewSession(cat.label.split(' ')[0])}
                style={[
                  styles.categoryCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                activeOpacity={0.8}
              >
                <View style={[styles.catIconBox, { backgroundColor: `${cat.color}18` }]}>
                  <MaterialIcons name={cat.icon} size={22} color={cat.color} />
                </View>
                <Text style={[styles.catCardTitle, { color: colors.text }]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        /* ========================================== */
        /* PANEL 2: MY SESSION BOOKINGS (TICKETS LIST)*/
        /* ========================================== */
        <View style={{ flex: 1 }}>
          {/* Modern Floating Pill Tab Selector */}
          <View style={styles.tabsOuterWrapper}>
            <View
              style={[
                styles.tabsContainer,
                {
                  backgroundColor: isDark ? '#1E1E1E' : '#EEF2F6',
                  borderColor: colors.border,
                },
              ]}
            >
              {TABS.map((tab) => {
                const isSelected = selectedTab === tab;
                const count =
                  tab === 'Upcoming'
                    ? upcomingCount
                    : tab === 'Completed'
                    ? completedCount
                    : cancelledCount;

                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setSelectedTab(tab)}
                    style={[
                      styles.tabPill,
                      {
                        backgroundColor: isSelected
                          ? isDark
                            ? '#2D3748'
                            : '#FFFFFF'
                          : 'transparent',
                        shadowOpacity: isSelected ? (isDark ? 0.3 : 0.06) : 0,
                      },
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.tabPillText,
                        {
                          color: isSelected
                            ? isDark
                              ? '#FFFFFF'
                              : AppColors.primaryColor
                            : colors.subtitle,
                          fontWeight: isSelected ? '800' : '600',
                        },
                      ]}
                    >
                      {tab} ({count})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* List of Digital Booking Tickets */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.passesScrollContent}
          >
            {filteredBookings.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <MaterialIcons name="event-busy" size={54} color={colors.subtitle} />
                <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                  No {selectedTab} Bookings
                </Text>
                <Text style={[styles.emptyStateSub, { color: colors.subtitle }]}>
                  When you book workout sessions, your digital passes will appear here.
                </Text>
              </View>
            ) : (
              filteredBookings.map((booking) => {
                const isUpcoming = booking.status === 'Upcoming';
                const catMeta = getCategoryIcon(booking.type, booking.iconName);

                return (
                  <TouchableOpacity
                    key={booking.id}
                    onPress={() => openBookingDetails(booking)}
                    activeOpacity={0.88}
                    style={[
                      styles.ticketCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    {/* Top Header Row */}
                    <View style={styles.ticketHeaderRow}>
                      <View style={[styles.categoryIconCapsule, { backgroundColor: catMeta.bg }]}>
                        <MaterialIcons name={catMeta.name} size={22} color={catMeta.color} />
                      </View>

                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[styles.ticketGymName, { color: colors.text }]} numberOfLines={1}>
                          {booking.gymName}
                        </Text>
                        <Text style={[styles.ticketSubtitle, { color: colors.subtitle }]}>
                          {booking.sessionSubtitle}
                        </Text>
                      </View>

                      {/* Pass ID Tag Badge on Top Right */}
                      <View
                        style={[
                          styles.passIdTag,
                          {
                            backgroundColor: isDark ? '#2A2A2A' : '#F1F5F9',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.passIdText,
                            { color: isDark ? '#93C5FD' : AppColors.primaryColor },
                          ]}
                        >
                          {booking.id}
                        </Text>
                      </View>
                    </View>

                    {/* Perforated / Stylized Dotted Divider */}
                    <View style={styles.dottedDividerRow}>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.dotSegment,
                            {
                              backgroundColor:
                                i % 2 === 0
                                  ? isDark
                                    ? 'rgba(255, 255, 255, 0.15)'
                                    : '#E2E8F0'
                                  : 'transparent',
                            },
                          ]}
                        />
                      ))}
                    </View>

                    {/* Date & Time Grid Row */}
                    <View style={styles.dateTimeRow}>
                      <View style={styles.dateCol}>
                        <MaterialIcons
                          name="calendar-today"
                          size={14}
                          color={isUpcoming ? AppColors.secondaryColor : colors.subtitle}
                        />
                        <Text
                          style={[styles.dateText, { color: colors.text }]}
                          numberOfLines={1}
                        >
                          {booking.date}
                        </Text>
                      </View>

                      <View style={styles.timeCol}>
                        <MaterialIcons name="access-time" size={14} color={colors.subtitle} />
                        <Text style={[styles.timeText, { color: colors.subtitle }]}>
                          {booking.time}
                        </Text>
                      </View>
                    </View>

                    {/* Footer Row: Price + "View Pass & OTP" Pill Button */}
                    <View style={styles.ticketFooterRow}>
                      <View style={styles.priceRow}>
                        <Text style={styles.priceAmount}>
                          ₹{Math.round(booking.amountPaid)}
                        </Text>
                        <Text style={[styles.pricePaidLabel, { color: colors.subtitle }]}>
                          Paid
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.viewPassPill,
                          {
                            backgroundColor: isDark
                              ? '#262626'
                              : 'rgba(0, 56, 130, 0.08)',
                            borderColor: isDark
                              ? 'rgba(255, 255, 255, 0.12)'
                              : 'rgba(0, 56, 130, 0.2)',
                          },
                        ]}
                      >
                        <MaterialIcons
                          name={isUpcoming ? 'qr-code-scanner' : 'receipt-long'}
                          size={14}
                          color={isDark ? '#93C5FD' : AppColors.primaryColor}
                        />
                        <Text
                          style={[
                            styles.viewPassPillText,
                            { color: isDark ? '#93C5FD' : AppColors.primaryColor },
                          ]}
                        >
                          {isUpcoming ? 'View Pass & OTP' : 'View Receipt'}
                        </Text>
                        <MaterialIcons
                          name="chevron-right"
                          size={16}
                          color={isDark ? '#93C5FD' : AppColors.primaryColor}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}

            {/* Creative Inline "Explore More" Banner Card */}
            <LinearGradient
              colors={
                isDark
                  ? ['#1E293B', '#0F172A']
                  : ['#F1F5F9', '#E2E8F0']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.exploreBanner}
            >
              <View style={styles.exploreBannerTopRow}>
                <View style={styles.boltCircle}>
                  <MaterialIcons name="bolt" size={20} color={AppColors.secondaryColor} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[styles.exploreBannerTitle, { color: colors.text }]}>
                    Book Your Next Workout
                  </Text>
                  <Text style={[styles.exploreBannerSub, { color: colors.subtitle }]}>
                    Single passes • Zero lock-in contracts
                  </Text>
                </View>
              </View>

              {/* Quick Action Chips Row */}
              <View style={styles.quickChipsRow}>
                {['Gym', 'Yoga', 'Zumba'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => bookNewSession(cat)}
                    style={[
                      styles.quickChipBtn,
                      {
                        backgroundColor: isDark ? '#262626' : '#FFFFFF',
                        borderColor: colors.border,
                      },
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.quickChipText, { color: colors.text }]}>
                      {cat} →
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </LinearGradient>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  appBarTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  activePassesSub: {
    color: AppColors.secondaryColor,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  bookCtaPillWrapper: {
    marginRight: 8,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: AppColors.primaryColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  bookCtaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  bookCtaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },
  hubToggleBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Tabs */
  tabsOuterWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  tabPillText: {
    fontSize: 12.5,
  },

  /* Passes List */
  passesScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 120,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: 12,
  },
  emptyStateSub: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },

  /* Ticket Card */
  ticketCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 14,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  ticketHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIconCapsule: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketGymName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ticketSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  passIdTag: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  passIdText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  /* Dotted Line Divider */
  dottedDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dotSegment: {
    flex: 1,
    height: 1.2,
  },

  /* Date & Time */
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  dateText: {
    fontSize: 12.5,
    fontWeight: '600',
    marginLeft: 6,
  },
  timeCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    marginLeft: 6,
  },

  /* Footer */
  ticketFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: AppColors.secondaryColor,
  },
  pricePaidLabel: {
    fontSize: 11,
    marginLeft: 6,
  },
  viewPassPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  viewPassPillText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },

  /* Explore Banner */
  exploreBanner: {
    borderRadius: 24,
    padding: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  exploreBannerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boltCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 191, 98, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreBannerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  exploreBannerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  quickChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  quickChipBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '700',
  },

  /* Hub Styles */
  hubScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 120,
  },
  hubSectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  hubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
  },
  hubIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  hubCardSub: {
    fontSize: 12,
    marginTop: 4,
  },
  hubSubheading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 22,
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    width: (SCREEN_WIDTH - 42) / 2,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
  },
  catIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  catCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
