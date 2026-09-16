import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors } from '../theme/appTheme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    id: '1',
    tag: 'ALL-ACCESS NETWORK',
    tagIcon: 'verified',
    titlePrefix: 'Fitness Freedom,\n',
    titleHighlight: 'Simplified.',
    subtitle:
      'Discover premier gyms, state-of-the-art facilities, and certified personal coaches across your city. Train on your terms every day.',
    image: require('../../assets/pages/onboarding/onboarding_1.jpg'),
    floatingBadge: '50+ Verified Partner Gyms',
  },
  {
    id: '2',
    tag: 'INSTANT PASSES',
    tagIcon: 'bolt',
    titlePrefix: 'Book Any Workout,\n',
    titleHighlight: 'Instantly.',
    subtitle:
      'Reserve single-session gym passes, yoga studios, HIIT, and Zumba classes in seconds with transparent pricing and zero lock-in contracts.',
    image: require('../../assets/pages/onboarding/onboarding_2.jpg'),
    floatingBadge: 'Instant QR Entry • 0 Wait Time',
  },
  {
    id: '3',
    tag: 'UNLIMITED ACCESS',
    tagIcon: 'workspace-premium',
    titlePrefix: 'One Pass for,\n',
    titleHighlight: 'All Gyms.',
    subtitle:
      'Manage your multi-gym passes, track booking schedules, and unlock exclusive member perks from one unified, seamless dashboard.',
    image: require('../../assets/pages/onboarding/onboarding_3.jpg'),
    floatingBadge: '1 Membership • Infinite Workouts',
  },
];

export const OnboardingScreen = ({ navigation }) => {
  const { isDark, colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const highlightColor = isDark ? AppColors.secondaryColor : '#059669';

  const handleNext = () => {
    if (currentIndex === ONBOARDING_DATA.length - 1) {
      navigation.replace('Login');
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    flatListRef.current?.scrollToIndex({
      index: ONBOARDING_DATA.length - 1,
      animated: true,
    });
    setCurrentIndex(ONBOARDING_DATA.length - 1);
  };

  const currentItem = ONBOARDING_DATA[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 1. TOP HALF: Hero Image with Cinematic Vignette & Rounded Base (52% height) */}
      <View style={styles.topHeroContainer}>
        <Image
          source={currentItem.image}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Ambient Gradient Overlay */}
        <LinearGradient
          colors={
            isDark
              ? [
                  'rgba(0,0,0,0.55)',
                  'transparent',
                  'rgba(18,18,18,0.5)',
                  AppColors.darkBackground,
                ]
              : [
                  'rgba(0,0,0,0.45)',
                  'transparent',
                  'rgba(0,0,0,0.15)',
                  'rgba(0,0,0,0.45)',
                ]
          }
          stops={isDark ? [0, 0.4, 0.75, 1] : [0, 0.35, 0.7, 1]}
          style={styles.gradientOverlay}
        />

        {/* Top Header Bar */}
        <SafeAreaView style={styles.safeHeaderArea}>
          <View style={styles.topBar}>
            <Image
              source={require('../../assets/logo/gymezy.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />

            {currentIndex !== ONBOARDING_DATA.length - 1 && (
              <TouchableOpacity
                onPress={handleSkip}
                style={styles.skipPill}
                activeOpacity={0.8}
              >
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>

        {/* Floating Feature Pill Badge */}
        <View style={styles.floatingBadgeWrapper}>
          <View
            style={[
              styles.floatingBadge,
              {
                backgroundColor: isDark
                  ? 'rgba(30, 30, 30, 0.94)'
                  : 'rgba(255, 255, 255, 0.94)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0',
              },
            ]}
          >
            <MaterialIcons
              name={currentItem.tagIcon}
              size={16}
              color={highlightColor}
            />
            <Text
              style={[
                styles.floatingBadgeText,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
            >
              {currentItem.floatingBadge}
            </Text>
          </View>
        </View>
      </View>

      {/* 2. BOTTOM HALF: Story Progress, PageView, and Actions (48% height) */}
      <View style={styles.bottomContentContainer}>
        {/* Story-Style Segmented Progress Bar */}
        <View style={styles.progressRow}>
          <View style={styles.segmentsWrapper}>
            {ONBOARDING_DATA.map((_, idx) => {
              const isActive = currentIndex === idx;
              return (
                <View
                  key={idx}
                  style={[
                    styles.progressBarSegment,
                    {
                      backgroundColor: isActive
                        ? AppColors.secondaryColor
                        : isDark
                        ? 'rgba(255,255,255,0.12)'
                        : '#E2E8F0',
                    },
                  ]}
                />
              );
            })}
          </View>
          <Text
            style={[
              styles.counterText,
              { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' },
            ]}
          >
            {`0${currentIndex + 1} / 0${ONBOARDING_DATA.length}`}
          </Text>
        </View>

        {/* Swipeable Slide View */}
        <FlatList
          ref={flatListRef}
          data={ONBOARDING_DATA}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentIndex(index);
          }}
          renderItem={({ item }) => (
            <View style={styles.slideItem}>
              <Text
                style={[
                  styles.tagText,
                  { color: isDark ? AppColors.secondaryColor : '#047857' },
                ]}
              >
                {item.tag}
              </Text>

              <Text style={styles.headlineText}>
                <Text style={{ color: colors.text }}>{item.titlePrefix}</Text>
                <Text style={{ color: highlightColor }}>{item.titleHighlight}</Text>
              </Text>

              <Text
                style={[styles.subtitleText, { color: colors.subtitle }]}
                numberOfLines={3}
              >
                {item.subtitle}
              </Text>
            </View>
          )}
        />

        {/* Bottom CTA Action Area */}
        <SafeAreaView style={styles.actionSafeArea}>
          {currentIndex === ONBOARDING_DATA.length - 1 ? (
            <TouchableOpacity
              onPress={handleNext}
              style={[
                styles.fullCtaBtn,
                { backgroundColor: AppColors.secondaryColor },
              ]}
              activeOpacity={0.85}
            >
              <Text style={styles.fullCtaText}>Get Started with GYMEZY</Text>
              <MaterialIcons
                name="arrow-forward"
                size={18}
                color="#FFFFFF"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.nextRow}>
              <Text
                style={[
                  styles.swipeHint,
                  { color: isDark ? 'rgba(255,255,255,0.6)' : '#94A3B8' },
                ]}
              >
                Swipe to explore
              </Text>

              <TouchableOpacity
                onPress={handleNext}
                style={[
                  styles.nextPillBtn,
                  { backgroundColor: AppColors.primaryColor },
                ]}
                activeOpacity={0.85}
              >
                <Text style={styles.nextPillText}>Next</Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={16}
                  color="#FFFFFF"
                  style={{ marginLeft: 6 }}
                />
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeroContainer: {
    height: SCREEN_HEIGHT * 0.52,
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeHeaderArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 36 : 10,
  },
  headerLogo: {
    height: 28,
    width: 100,
    tintColor: '#FFFFFF',
  },
  skipPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  floatingBadgeWrapper: {
    position: 'absolute',
    bottom: 16,
    left: 20,
  },
  floatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  floatingBadgeText: {
    fontSize: 12.5,
    fontWeight: '700',
    marginLeft: 8,
  },
  bottomContentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  segmentsWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  progressBarSegment: {
    flex: 1,
    height: 4.5,
    borderRadius: 3,
    marginRight: 6,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: 10,
  },
  slideItem: {
    width: SCREEN_WIDTH - 48,
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  headlineText: {
    fontSize: 36,
    fontWeight: '900',
    lineHeight: 42,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 13.5,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  actionSafeArea: {
    paddingTop: 8,
  },
  fullCtaBtn: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  fullCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  nextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 52,
  },
  swipeHint: {
    fontSize: 13,
    fontWeight: '500',
  },
  nextPillBtn: {
    height: 48,
    paddingHorizontal: 22,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: AppColors.primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  nextPillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
