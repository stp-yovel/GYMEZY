import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors, AppTheme } from '../theme/appTheme';
import { MonthlyGridCalendar } from '../widgets/CustomCalendar';
import apiService from '../services/apiService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MORNING_SLOTS = ['6:00 AM', '7:00 AM', '8:00 AM'];
const EVENING_SLOTS = ['6:00 PM', '7:00 PM', '8:00 PM'];
const ALL_WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const formatToDDMMYYYY = (val) => {
  if (!val) return '';
  const dt = new Date(val);
  if (Number.isNaN(dt.getTime())) return String(val);
  const day = String(dt.getDate()).padStart(2, '0');
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const year = dt.getFullYear();
  return `${day}-${month}-${year}`;
};

const getCategoryBadgeStyle = (category, isDark) => {
  const cat = (category || '').toLowerCase();
  switch (cat) {
    case 'yoga':
      return {
        bg: isDark ? 'rgba(167,139,250,0.2)' : 'rgba(124,58,237,0.12)',
        text: isDark ? '#C4B5FD' : '#7C3AED',
        icon: 'self-improvement',
      };
    case 'zumba':
      return {
        bg: isDark ? 'rgba(244,114,182,0.2)' : 'rgba(219,39,119,0.12)',
        text: isDark ? '#F472B6' : '#DB2777',
        icon: 'music-note',
      };
    case 'crossfit':
      return {
        bg: isDark ? 'rgba(239,68,68,0.2)' : 'rgba(220,38,38,0.12)',
        text: isDark ? '#FCA5A5' : '#DC2626',
        icon: 'fitness-center',
      };
    case 'hiit':
      return {
        bg: isDark ? 'rgba(245,158,11,0.2)' : 'rgba(217,119,6,0.12)',
        text: isDark ? '#FCD34D' : '#D97706',
        icon: 'bolt',
      };
    case 'pilates':
      return {
        bg: isDark ? 'rgba(16,185,129,0.2)' : 'rgba(5,150,105,0.12)',
        text: isDark ? '#6EE7B7' : '#059669',
        icon: 'spa',
      };
    case 'boxing':
      return {
        bg: isDark ? 'rgba(244,63,94,0.2)' : 'rgba(225,29,72,0.12)',
        text: isDark ? '#FDA4AF' : '#E11D48',
        icon: 'sports-mma',
      };
    default:
      return {
        bg: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(79,70,229,0.12)',
        text: isDark ? '#A5B4FC' : '#4F46E5',
        icon: 'groups',
      };
  }
};

const OTHER_CLASSES = [
  {
    name: 'HIIT',
    title: 'HIIT (High Intensity)',
    desc: 'Intense interval cardio & calorie burn',
    price: 249.0,
    defaultType: 'Standard HIIT',
    icon: 'bolt',
  },
  {
    name: 'CrossFit',
    title: 'CrossFit Training',
    desc: 'Functional strength & conditioning',
    price: 299.0,
    defaultType: 'WOD Session',
    icon: 'fitness-center',
  },
  {
    name: 'Pilates',
    title: 'Pilates Core',
    desc: 'Core strength, posture & flexibility',
    price: 249.0,
    defaultType: 'Mat Pilates',
    icon: 'self-improvement',
  },
  {
    name: 'Dance Fitness',
    title: 'Dance Fitness',
    desc: 'Fun energetic dance workout',
    price: 249.0,
    defaultType: 'BollyHop Workout',
    icon: 'music-note',
  },
  {
    name: 'Kickboxing',
    title: 'Kickboxing Cardio',
    desc: 'Strength, agility & martial arts cardio',
    price: 299.0,
    defaultType: 'Bag & Pad Work',
    icon: 'sports-mma',
  },
];

export const BookingSessionScreen = ({ route, navigation }) => {
  const { gym, initialCategory } = route.params;
  const { isDark, colors } = useTheme();

  const gymId = gym?._id || gym?.id;

  // Navigation views: 'categories', 'gym_booking', 'weekly_plan', 'custom_dates', 'class_booking', 'other_classes', 'group_classes'
  const [currentView, setCurrentView] = useState(
    initialCategory
      ? initialCategory === 'Gym'
        ? 'gym_booking'
        : initialCategory === 'Group Classes'
        ? 'group_classes'
        : 'class_booking'
      : 'categories'
  );
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || null);

  // Group Classes State (Owner-created sections/batches)
  const [sections, setSections] = useState([]);
  const [isLoadingSections, setIsLoadingSections] = useState(false);
  const [sectionsError, setSectionsError] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedGroupCategory, setSelectedGroupCategory] = useState('all');

  // Gym Booking State
  const [gymBookingType, setGymBookingType] = useState('Per Session'); // 'Per Session', 'Weekly Plan', 'Custom Dates'
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [customSelectedDates, setCustomSelectedDates] = useState([
    new Date(),
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  ]);

  // Class Booking State (Yoga, Zumba, HIIT, etc.)
  const [selectedClassName, setSelectedClassName] = useState('Yoga Classes');
  const [selectedClassType, setSelectedClassType] = useState('Hatha Yoga');
  const [selectedClassPrice, setSelectedClassPrice] = useState(249.0);
  const [selectedClassDate, setSelectedClassDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('7:00 AM');

  const primaryNavy = isDark ? '#93C5FD' : '#003882';
  const cardColor = isDark ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const subtitleColor = isDark ? 'rgba(255, 255, 255, 0.7)' : '#64748B';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0';

  const loadSections = async () => {
    if (!gymId) return;
    try {
      setIsLoadingSections(true);
      setSectionsError(null);
      const data = await apiService.getGymSections(gymId);
      const list = Array.isArray(data) ? data : [];
      setSections(list);
      if (list.length > 0 && !selectedSection) {
        setSelectedSection(list[0]);
      }
    } catch (err) {
      console.warn('Failed to load gym sections:', err?.message);
      setSectionsError(err?.message || 'Failed to load group classes');
    } finally {
      setIsLoadingSections(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, [gymId]);

  const selectCategory = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'Gym') {
      setCurrentView('gym_booking');
    } else if (cat === 'Group Classes') {
      setCurrentView('group_classes');
      if (sections.length === 0) {
        loadSections();
      }
    } else if (cat === 'Yoga') {
      setSelectedClassName('Yoga Classes');
      setSelectedClassType('Hatha Yoga');
      setSelectedClassPrice(249.0);
      setCurrentView('class_booking');
    } else if (cat === 'Zumba') {
      setSelectedClassName('Zumba Classes');
      setSelectedClassType('Zumba Fitness');
      setSelectedClassPrice(249.0);
      setCurrentView('class_booking');
    } else if (cat === 'Other Classes') {
      setCurrentView('other_classes');
    }
  };

  const selectOtherClass = (name, price, defaultType) => {
    setSelectedClassName(name);
    setSelectedClassType(defaultType);
    setSelectedClassPrice(price);
    setCurrentView('class_booking');
  };

  const formatDate = (dt) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayName = days[(dt.getDay() + 6) % 7];
    return `${dayName}, ${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()}`;
  };

  const monthName = (m) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[m];
  };

  const goToCheckout = (sectionOverride = null) => {
    let title = '';
    let datesSummary = '';
    let timeSlot = null;
    let sessions = 1;
    let subtotal = 0;

    const activeSection = sectionOverride || selectedSection;

    if (currentView === 'group_classes' && activeSection) {
      title = `Group Class: ${activeSection.title}`;
      const startStr = formatToDDMMYYYY(activeSection.startDate);
      const endStr = formatToDDMMYYYY(activeSection.endDate);
      datesSummary = `${startStr} to ${endStr} (${activeSection.durationDays || 20} Days Batch)`;
      timeSlot = `${activeSection.startTime} - ${activeSection.endTime}`;
      sessions = activeSection.durationDays || 20;
      subtotal = Number(activeSection.cost) || 0;
    } else if (currentView === 'gym_booking' && gymBookingType === 'Per Session') {
      title = 'Gym Access (Single Session)';
      datesSummary = 'Valid for today / next 24 hrs';
      sessions = 1;
      subtotal = gym.pricePerSession;
    } else if (currentView === 'weekly_plan' || (currentView === 'gym_booking' && gymBookingType === 'Weekly Plan')) {
      title = 'Weekly Unlimited Gym Pass';
      const end = new Date(selectedStartDate.getTime() + 6 * 24 * 60 * 60 * 1000);
      datesSummary = `${formatDate(selectedStartDate)} to ${formatDate(end)} (7 Days)`;
      sessions = 7;
      subtotal = 999.0;
    } else if (currentView === 'custom_dates' || (currentView === 'gym_booking' && gymBookingType === 'Custom Dates')) {
      title = 'Gym Access (Custom Dates)';
      sessions = customSelectedDates.length;
      const sortedDates = [...customSelectedDates].sort((a, b) => a.getTime() - b.getTime());
      datesSummary = sortedDates.map((d) => `${d.getDate()} ${monthName(d.getMonth())}`).join(', ');
      subtotal = gym.pricePerSession * sessions;
    } else if (currentView === 'class_booking') {
      title = `${selectedClassName} (${selectedClassType})`;
      datesSummary = formatDate(selectedClassDate);
      timeSlot = selectedTimeSlot;
      sessions = 1;
      subtotal = selectedClassPrice;
    }

    navigation.navigate('PaymentSummary', {
      type: 'booking',
      gym,
      bookingTitle: title,
      datesSummary,
      timeSlot,
      sessionsCount: sessions,
      subtotal,
      discount: 0.0,
      amount: subtotal,
      sectionId: activeSection?._id || null,
    });
  };

  const getAppBarTitle = () => {
    switch (currentView) {
      case 'gym_booking':
        return 'Book Gym Session';
      case 'group_classes':
        return 'Group Classes & Batches';
      case 'weekly_plan':
        return 'Weekly Plan';
      case 'custom_dates':
        return 'Custom Dates';
      case 'class_booking':
        return `Book ${selectedClassName}`;
      case 'other_classes':
        return 'Other Classes';
      default:
        return 'Book Session';
    }
  };

  const handleBackPress = () => {
    if (currentView === 'weekly_plan' || currentView === 'custom_dates') {
      setCurrentView('gym_booking');
    } else if (currentView !== 'categories') {
      setCurrentView('categories');
    } else {
      navigation.goBack();
    }
  };

  const filteredSections =
    selectedGroupCategory === 'all'
      ? sections
      : sections.filter(
          (s) => (s.category || '').toLowerCase() === selectedGroupCategory.toLowerCase()
        );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* App Bar */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background }}>
        <View style={styles.appBar}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backBtn} activeOpacity={0.7}>
            <MaterialIcons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.appBarTitle, { color: textColor }]}>{getAppBarTitle()}</Text>
        </View>
      </SafeAreaView>

      {/* VIEW 1: CATEGORIES */}
      {currentView === 'categories' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={[styles.chooseTitle, { color: textColor }]}>
            Choose What You Want to Book
          </Text>

          {/* 1. Gym Access */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => selectCategory('Gym')}
            style={[styles.categoryCard, { backgroundColor: cardColor, borderColor: borderColor }]}
          >
            <View style={[styles.categoryIconBox, { backgroundColor: isDark ? 'rgba(96,165,250,0.2)' : 'rgba(0,56,130,0.1)' }]}>
              <MaterialIcons name="fitness-center" size={26} color={isDark ? '#60A5FA' : '#003882'} />
            </View>
            <View style={styles.categoryContent}>
              <Text style={[styles.categoryTitle, { color: textColor }]}>Gym Access</Text>
              <Text style={[styles.categoryDesc, { color: subtitleColor }]}>
                Book gym access by session, weekly or custom dates
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={subtitleColor} />
          </TouchableOpacity>

          {/* 2. Group Classes (Owner Created Sections/Batches) */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => selectCategory('Group Classes')}
            style={[styles.categoryCard, { backgroundColor: cardColor, borderColor: borderColor }]}
          >
            <View style={[styles.categoryIconBox, { backgroundColor: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(79,70,229,0.12)' }]}>
              <MaterialIcons name="groups" size={26} color={isDark ? '#818CF8' : '#4F46E5'} />
            </View>
            <View style={styles.categoryContent}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.categoryTitle, { color: textColor }]}>Group Classes</Text>
                {sections.length > 0 && (
                  <View style={[styles.batchCountBadge, { backgroundColor: isDark ? 'rgba(99,102,241,0.25)' : 'rgba(79,70,229,0.12)' }]}>
                    <Text style={[styles.batchCountBadgeText, { color: isDark ? '#A5B4FC' : '#4F46E5' }]}>
                      {sections.length} {sections.length === 1 ? 'Batch' : 'Batches'}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.categoryDesc, { color: subtitleColor }]}>
                Book trainer-led batches & scheduled workout sections
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={subtitleColor} />
          </TouchableOpacity>

          {/* 3. Yoga Classes */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => selectCategory('Yoga')}
            style={[styles.categoryCard, { backgroundColor: cardColor, borderColor: borderColor }]}
          >
            <View style={[styles.categoryIconBox, { backgroundColor: isDark ? 'rgba(167,139,250,0.2)' : 'rgba(124,58,237,0.12)' }]}>
              <MaterialIcons name="self-improvement" size={26} color={isDark ? '#A78BFA' : '#7C3AED'} />
            </View>
            <View style={styles.categoryContent}>
              <Text style={[styles.categoryTitle, { color: textColor }]}>Yoga Classes</Text>
              <Text style={[styles.categoryDesc, { color: subtitleColor }]}>
                Book yoga classes with certified expert trainers
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={subtitleColor} />
          </TouchableOpacity>

          {/* 3. Zumba Sessions */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => selectCategory('Zumba')}
            style={[styles.categoryCard, { backgroundColor: cardColor, borderColor: borderColor }]}
          >
            <View style={[styles.categoryIconBox, { backgroundColor: isDark ? 'rgba(244,114,182,0.2)' : 'rgba(219,39,119,0.12)' }]}>
              <MaterialIcons name="music-note" size={26} color={isDark ? '#F472B6' : '#DB2777'} />
            </View>
            <View style={styles.categoryContent}>
              <Text style={[styles.categoryTitle, { color: textColor }]}>Zumba Sessions</Text>
              <Text style={[styles.categoryDesc, { color: subtitleColor }]}>
                Book fun, high-energy dance workout sessions
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={subtitleColor} />
          </TouchableOpacity>

          {/* 4. Other Classes */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => selectCategory('Other Classes')}
            style={[styles.categoryCard, { backgroundColor: cardColor, borderColor: borderColor }]}
          >
            <View style={[styles.categoryIconBox, { backgroundColor: isDark ? 'rgba(52,211,153,0.2)' : 'rgba(0,191,98,0.12)' }]}>
              <MaterialIcons name="grid-view" size={26} color={isDark ? '#34D399' : '#00BF62'} />
            </View>
            <View style={styles.categoryContent}>
              <Text style={[styles.categoryTitle, { color: textColor }]}>Other Fitness Classes</Text>
              <Text style={[styles.categoryDesc, { color: subtitleColor }]}>
                Explore HIIT, CrossFit, Pilates, Kickboxing & more
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={subtitleColor} />
          </TouchableOpacity>

          {/* Info notice */}
          <View style={styles.infoNoticeRow}>
            <MaterialIcons name="info-outline" size={14} color={subtitleColor} style={{ marginRight: 6 }} />
            <Text style={[styles.infoNoticeText, { color: subtitleColor }]}>
              All sessions are subject to gym slot availability
            </Text>
          </View>
        </ScrollView>
      )}

      {/* VIEW 2: GYM BOOKING (Per Session / Weekly / Custom) */}
      {currentView === 'gym_booking' && (
        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Gym Access Hero Banner */}
            <ImageBackground
              source={{ uri: gym.imageUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop' }}
              style={styles.heroBanner}
              imageStyle={{ borderRadius: 20 }}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.82)', 'rgba(0,0,0,0.35)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.heroBannerGradient}
              >
                <Text style={styles.heroBannerTitle}>Gym Access</Text>
                <Text style={styles.heroBannerSubtitle}>
                  Train at your convenience • {gym.name}
                </Text>
              </LinearGradient>
            </ImageBackground>

            <Text style={[styles.chooseTypeHeading, { color: textColor }]}>
              Choose Booking Type
            </Text>

            {/* Option 1: Per Session */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setGymBookingType('Per Session')}
              style={[
                styles.typeOptionCard,
                {
                  backgroundColor: gymBookingType === 'Per Session'
                    ? (isDark ? '#262626' : '#F1F5F9')
                    : cardColor,
                  borderColor: gymBookingType === 'Per Session' ? (isDark ? '#60A5FA' : '#003882') : borderColor,
                  borderWidth: gymBookingType === 'Per Session' ? 1.5 : 1,
                },
              ]}
            >
              <View style={[styles.typeIconBox, { backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(0,56,130,0.1)' }]}>
                <MaterialIcons name="calendar-today" size={22} color={isDark ? '#93C5FD' : '#003882'} />
              </View>
              <View style={styles.typeContent}>
                <Text style={[styles.typeTitle, { color: textColor }]}>Per Session</Text>
                <Text style={[styles.typeSubtitle, { color: subtitleColor }]}>Book for a single visit</Text>
                <Text style={styles.typePrice}>₹{Math.round(gym.pricePerSession)} / Session</Text>
              </View>
              <MaterialIcons
                name={gymBookingType === 'Per Session' ? 'radio-button-checked' : 'radio-button-unchecked'}
                size={20}
                color={gymBookingType === 'Per Session' ? (isDark ? '#60A5FA' : '#003882') : subtitleColor}
              />
            </TouchableOpacity>

            {/* Option 2: Weekly Plan */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setGymBookingType('Weekly Plan');
                setCurrentView('weekly_plan');
              }}
              style={[
                styles.typeOptionCard,
                {
                  backgroundColor: gymBookingType === 'Weekly Plan'
                    ? (isDark ? '#262626' : '#F1F5F9')
                    : cardColor,
                  borderColor: gymBookingType === 'Weekly Plan' ? (isDark ? '#60A5FA' : '#003882') : borderColor,
                  borderWidth: gymBookingType === 'Weekly Plan' ? 1.5 : 1,
                },
              ]}
            >
              <View style={[styles.typeIconBox, { backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(0,56,130,0.1)' }]}>
                <MaterialIcons name="date-range" size={22} color={isDark ? '#93C5FD' : '#003882'} />
              </View>
              <View style={styles.typeContent}>
                <Text style={[styles.typeTitle, { color: textColor }]}>Weekly Plan</Text>
                <Text style={[styles.typeSubtitle, { color: subtitleColor }]}>Unlimited access for 7 days</Text>
                <Text style={styles.typePrice}>₹999 / Week</Text>
              </View>
              <MaterialIcons
                name={gymBookingType === 'Weekly Plan' ? 'radio-button-checked' : 'radio-button-unchecked'}
                size={20}
                color={gymBookingType === 'Weekly Plan' ? (isDark ? '#60A5FA' : '#003882') : subtitleColor}
              />
            </TouchableOpacity>

            {/* Option 3: Custom Dates */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setGymBookingType('Custom Dates');
                setCurrentView('custom_dates');
              }}
              style={[
                styles.typeOptionCard,
                {
                  backgroundColor: gymBookingType === 'Custom Dates'
                    ? (isDark ? '#262626' : '#F1F5F9')
                    : cardColor,
                  borderColor: gymBookingType === 'Custom Dates' ? (isDark ? '#60A5FA' : '#003882') : borderColor,
                  borderWidth: gymBookingType === 'Custom Dates' ? 1.5 : 1,
                },
              ]}
            >
              <View style={[styles.typeIconBox, { backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(0,56,130,0.1)' }]}>
                <MaterialIcons name="event-note" size={22} color={isDark ? '#93C5FD' : '#003882'} />
              </View>
              <View style={styles.typeContent}>
                <Text style={[styles.typeTitle, { color: textColor }]}>Custom Dates</Text>
                <Text style={[styles.typeSubtitle, { color: subtitleColor }]}>Select multiple dates that suit you</Text>
                <Text style={styles.typePrice}>Custom Pricing</Text>
              </View>
              <MaterialIcons
                name={gymBookingType === 'Custom Dates' ? 'radio-button-checked' : 'radio-button-unchecked'}
                size={20}
                color={gymBookingType === 'Custom Dates' ? (isDark ? '#60A5FA' : '#003882') : subtitleColor}
              />
            </TouchableOpacity>
          </ScrollView>

          {/* Bottom Bar */}
          <View
            style={[
              styles.bottomBar,
              {
                backgroundColor: isDark
                  ? 'rgba(18, 18, 18, 0.88)'
                  : 'rgba(255, 255, 255, 0.88)',
                borderTopColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(226, 232, 240, 0.8)',
              },
            ]}
          >
            <View>
              <Text style={[styles.bottomPriceLabel, { color: subtitleColor }]}>Price</Text>
              <Text style={[styles.bottomPriceValue, { color: textColor }]}>
                {gymBookingType === 'Per Session'
                  ? `₹${Math.round(gym.pricePerSession)}`
                  : gymBookingType === 'Weekly Plan'
                  ? '₹999'
                  : 'Custom'}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                if (gymBookingType === 'Per Session') {
                  goToCheckout();
                } else if (gymBookingType === 'Weekly Plan') {
                  setCurrentView('weekly_plan');
                } else {
                  setCurrentView('custom_dates');
                }
              }}
              style={styles.continueBtn}
            >
              <Text style={styles.continueBtnText}>
                {gymBookingType === 'Per Session' ? 'Continue to Payment' : 'Configure Plan'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* VIEW 3: WEEKLY PLAN */}
      {currentView === 'weekly_plan' && (
        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Plan Banner */}
            <View style={[styles.planBanner, { backgroundColor: cardColor, borderColor: borderColor }]}>
              <View style={[styles.planIconBox, { backgroundColor: 'rgba(0,191,98,0.12)' }]}>
                <MaterialIcons name="date-range" size={24} color="#00BF62" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.planBannerTitle, { color: textColor }]}>
                  Weekly Unlimited Pass
                </Text>
                <Text style={[styles.planBannerSub, { color: subtitleColor }]}>
                  7 days full gym access
                </Text>
              </View>
              <Text style={styles.planPriceText}>₹999</Text>
            </View>

            <Text style={[styles.planIncludesTitle, { color: textColor }]}>Plan Includes</Text>
            {[
              'Unlimited access for 7 consecutive days',
              'All gym equipment & workout areas',
              'Locker & shower facility access',
              'Trainer floor support during gym hours',
            ].map((inc, i) => (
              <View key={i} style={styles.inclusionRow}>
                <MaterialIcons name="check-circle" size={16} color="#00BF62" style={{ marginRight: 8 }} />
                <Text style={[styles.inclusionText, { color: textColor }]}>{inc}</Text>
              </View>
            ))}

            <View style={{ marginTop: 20 }}>
              <MonthlyGridCalendar
                selectedDate={selectedStartDate}
                minDate={new Date()}
                maxMonthsAhead={3}
                wrapInCard={true}
                showMonthHeader={true}
                onDateSelected={setSelectedStartDate}
              />
            </View>

            {/* Validity notice banner */}
            <View style={styles.validityNoticeBanner}>
              <MaterialIcons name="info-outline" size={16} color="#00BF62" style={{ marginRight: 8 }} />
              <Text style={styles.validityNoticeText}>
                Valid from {formatDate(selectedStartDate)} to{' '}
                {formatDate(new Date(selectedStartDate.getTime() + 6 * 24 * 60 * 60 * 1000))}
              </Text>
            </View>
          </ScrollView>

          {/* Bottom Bar */}
          <View
            style={[
              styles.bottomBar,
              {
                backgroundColor: isDark
                  ? 'rgba(18, 18, 18, 0.88)'
                  : 'rgba(255, 255, 255, 0.88)',
                borderTopColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(226, 232, 240, 0.8)',
              },
            ]}
          >
            <View>
              <Text style={[styles.bottomPriceLabel, { color: subtitleColor }]}>Price</Text>
              <Text style={[styles.bottomPriceValue, { color: textColor }]}>₹999</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={goToCheckout}
              style={styles.continueBtn}
            >
              <Text style={styles.continueBtnText}>Continue to Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* VIEW 4: CUSTOM DATES */}
      {currentView === 'custom_dates' && (
        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Top Header Card */}
            <View style={[styles.planBanner, { backgroundColor: cardColor, borderColor: borderColor }]}>
              <View style={[styles.planIconBox, { backgroundColor: 'rgba(0,56,130,0.1)' }]}>
                <MaterialIcons name="event-available" size={24} color={isDark ? '#93C5FD' : '#003882'} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.planBannerTitle, { color: textColor }]}>
                  Custom Dates Booking
                </Text>
                <Text style={[styles.planBannerSub, { color: subtitleColor }]}>
                  Pick any dates that fit your routine
                </Text>
              </View>
            </View>

            <View style={styles.customDatesHeaderRow}>
              <Text style={[styles.planIncludesTitle, { color: textColor }]}>
                Select Dates ({customSelectedDates.length})
              </Text>
              {customSelectedDates.length > 0 && (
                <TouchableOpacity onPress={() => setCustomSelectedDates([])}>
                  <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Monthly grid calendar */}
            <MonthlyGridCalendar
              multiSelectedDates={customSelectedDates}
              maxMonthsAhead={3}
              onDateToggled={(date) => {
                const isSel = customSelectedDates.some(
                  (d) => d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()
                );
                if (isSel) {
                  setCustomSelectedDates(
                    customSelectedDates.filter(
                      (d) => !(d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear())
                    )
                  );
                } else {
                  setCustomSelectedDates([...customSelectedDates, date]);
                }
              }}
            />

            {/* Selected Count Pill */}
            <View style={styles.selectedCountPill}>
              <Text style={styles.selectedCountText}>
                {customSelectedDates.length} Dates Selected
              </Text>
              <Text style={[styles.selectedCalcText, { color: textColor }]}>
                ₹{Math.round(gym.pricePerSession)} × {customSelectedDates.length} Sessions
              </Text>
            </View>
          </ScrollView>

          {/* Bottom Bar */}
          <View
            style={[
              styles.bottomBar,
              {
                backgroundColor: isDark
                  ? 'rgba(18, 18, 18, 0.88)'
                  : 'rgba(255, 255, 255, 0.88)',
                borderTopColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(226, 232, 240, 0.8)',
              },
            ]}
          >
            <View>
              <Text style={[styles.bottomPriceLabel, { color: subtitleColor }]}>Price</Text>
              <Text style={[styles.bottomPriceValue, { color: textColor }]}>
                ₹{Math.round(gym.pricePerSession * customSelectedDates.length)}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={customSelectedDates.length === 0}
              onPress={goToCheckout}
              style={[styles.continueBtn, { opacity: customSelectedDates.length === 0 ? 0.5 : 1 }]}
            >
              <Text style={styles.continueBtnText}>Continue to Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* VIEW 5: CLASS BOOKING (Yoga / Zumba / Other) */}
      {currentView === 'class_booking' && (
        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Class Hero Banner */}
            <ImageBackground
              source={{
                uri: selectedClassName.toLowerCase().includes('yoga')
                  ? 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop'
                  : selectedClassName.toLowerCase().includes('zumba')
                  ? 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop'
                  : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
              }}
              style={styles.heroBanner}
              imageStyle={{ borderRadius: 20 }}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.82)', 'rgba(0,0,0,0.35)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.heroBannerGradient}
              >
                <Text style={styles.heroBannerTitle}>{selectedClassName}</Text>
                <Text style={styles.heroBannerSubtitle}>
                  {selectedClassName.toLowerCase().includes('yoga')
                    ? 'Mind. Body. Balance.'
                    : selectedClassName.toLowerCase().includes('zumba')
                    ? 'Dance. Sweat. Repeat.'
                    : 'Train Hard. Stay Consistent.'}
                </Text>
              </LinearGradient>
            </ImageBackground>

            <Text style={[styles.chooseTypeHeading, { color: textColor }]}>Select Class Type</Text>

            {(selectedClassName.includes('Yoga')
              ? [
                  { type: 'Hatha Yoga', price: 249.0 },
                  { type: 'Power Yoga', price: 249.0 },
                  { type: 'Yoga for Beginners', price: 249.0 },
                ]
              : selectedClassName.includes('Zumba')
              ? [
                  { type: 'Zumba Fitness', price: 249.0 },
                  { type: 'Zumba Toning', price: 249.0 },
                ]
              : [
                  { type: 'Standard Session', price: selectedClassPrice },
                  { type: 'Advanced Masterclass', price: selectedClassPrice + 50 },
                ]
            ).map((ct, idx) => {
              const isSel = selectedClassType === ct.type;
              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.85}
                  onPress={() => {
                    setSelectedClassType(ct.type);
                    setSelectedClassPrice(ct.price);
                  }}
                  style={[
                    styles.classTypeCard,
                    {
                      backgroundColor: isSel ? (isDark ? '#262626' : '#F1F5F9') : cardColor,
                      borderColor: isSel ? '#003882' : borderColor,
                      borderWidth: isSel ? 1.5 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.classTypeName, { color: textColor }]}>{ct.type}</Text>
                  <View style={styles.classTypeRight}>
                    <Text style={styles.classTypePrice}>₹{Math.round(ct.price)} / Session</Text>
                    <MaterialIcons
                      name={isSel ? 'radio-button-checked' : 'radio-button-unchecked'}
                      size={18}
                      color={isSel ? '#003882' : subtitleColor}
                      style={{ marginLeft: 8 }}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}

            <View style={{ marginTop: 18 }}>
              <MonthlyGridCalendar
                selectedDate={selectedClassDate}
                minDate={new Date()}
                maxMonthsAhead={3}
                wrapInCard={true}
                showMonthHeader={true}
                onDateSelected={setSelectedClassDate}
              />
            </View>

            <Text style={[styles.chooseTypeHeading, { color: textColor, marginTop: 20 }]}>
              Select Time Slot
            </Text>

            {/* Morning */}
            <Text style={[styles.slotCategoryLabel, { color: subtitleColor }]}>Morning</Text>
            <View style={styles.slotsRow}>
              {MORNING_SLOTS.map((slot) => {
                const isSel = selectedTimeSlot === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    activeOpacity={0.8}
                    onPress={() => setSelectedTimeSlot(slot)}
                    style={[
                      styles.slotPill,
                      {
                        backgroundColor: isSel ? '#003882' : isDark ? '#262626' : '#F1F5F9',
                        borderColor: isSel ? 'transparent' : borderColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.slotPillText,
                        { color: isSel ? '#FFFFFF' : textColor, fontWeight: isSel ? 'bold' : '500' },
                      ]}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Evening */}
            <Text style={[styles.slotCategoryLabel, { color: subtitleColor, marginTop: 12 }]}>Evening</Text>
            <View style={styles.slotsRow}>
              {EVENING_SLOTS.map((slot) => {
                const isSel = selectedTimeSlot === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    activeOpacity={0.8}
                    onPress={() => setSelectedTimeSlot(slot)}
                    style={[
                      styles.slotPill,
                      {
                        backgroundColor: isSel ? '#003882' : isDark ? '#262626' : '#F1F5F9',
                        borderColor: isSel ? 'transparent' : borderColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.slotPillText,
                        { color: isSel ? '#FFFFFF' : textColor, fontWeight: isSel ? 'bold' : '500' },
                      ]}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Bottom Bar */}
          <View
            style={[
              styles.bottomBar,
              {
                backgroundColor: isDark
                  ? 'rgba(18, 18, 18, 0.88)'
                  : 'rgba(255, 255, 255, 0.88)',
                borderTopColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(226, 232, 240, 0.8)',
              },
            ]}
          >
            <View>
              <Text style={[styles.bottomPriceLabel, { color: subtitleColor }]}>Price</Text>
              <Text style={[styles.bottomPriceValue, { color: textColor }]}>
                ₹{Math.round(selectedClassPrice)}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={goToCheckout}
              style={styles.continueBtn}
            >
              <Text style={styles.continueBtnText}>Continue to Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* VIEW: GROUP CLASSES / OWNER CREATED SECTIONS */}
      {currentView === 'group_classes' && (
        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Hero Banner */}
            <ImageBackground
              source={{
                uri: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800&auto=format&fit=crop',
              }}
              style={styles.heroBanner}
              imageStyle={{ borderRadius: 20 }}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['rgba(15,23,42,0.88)', 'rgba(30,27,75,0.72)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.heroBannerGradient}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.groupHeroBadge}>
                    <MaterialIcons name="groups" size={16} color="#FFFFFF" />
                  </View>
                  <Text style={styles.heroBannerTitle}>Group Classes & Batches</Text>
                </View>
                <Text style={styles.heroBannerSubtitle}>
                  Structured training cohorts scheduled & led by gym trainers
                </Text>
              </LinearGradient>
            </ImageBackground>

            {/* Category Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.groupFilterScroll}
            >
              {[
                { key: 'all', label: 'All Batches' },
                { key: 'yoga', label: 'Yoga' },
                { key: 'zumba', label: 'Zumba' },
                { key: 'crossfit', label: 'CrossFit' },
                { key: 'hiit', label: 'HIIT' },
                { key: 'pilates', label: 'Pilates' },
                { key: 'boxing', label: 'Boxing' },
                { key: 'other', label: 'Other' },
              ].map((tab) => {
                const isActive = selectedGroupCategory === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    activeOpacity={0.8}
                    onPress={() => setSelectedGroupCategory(tab.key)}
                    style={[
                      styles.groupFilterChip,
                      {
                        backgroundColor: isActive
                          ? '#003882'
                          : isDark
                          ? 'rgba(255,255,255,0.06)'
                          : '#F1F5F9',
                        borderColor: isActive ? '#003882' : borderColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.groupFilterChipText,
                        {
                          color: isActive ? '#FFFFFF' : textColor,
                          fontWeight: isActive ? 'bold' : '500',
                        },
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Loading Indicator */}
            {isLoadingSections && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#003882" />
                <Text style={[styles.loadingText, { color: subtitleColor }]}>
                  Loading available batches from {gym.name || 'gym'}...
                </Text>
              </View>
            )}

            {/* Error Banner */}
            {!isLoadingSections && sectionsError && (
              <View style={styles.errorNoticeBox}>
                <MaterialIcons name="error-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
                <Text style={styles.errorNoticeText}>{sectionsError}</Text>
                <TouchableOpacity onPress={loadSections} style={styles.retryPill}>
                  <Text style={styles.retryPillText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Empty State */}
            {!isLoadingSections && !sectionsError && filteredSections.length === 0 && (
              <View style={[styles.emptyBatchCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
                <View style={[styles.emptyIconBox, { backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(79,70,229,0.08)' }]}>
                  <MaterialIcons name="event-busy" size={36} color={isDark ? '#A5B4FC' : '#4F46E5'} />
                </View>
                <Text style={[styles.emptyBatchTitle, { color: textColor }]}>
                  No Batches Available
                </Text>
                <Text style={[styles.emptyBatchDesc, { color: subtitleColor }]}>
                  {selectedGroupCategory === 'all'
                    ? 'The gym owner has not scheduled any active batches yet.'
                    : `No active batches found for category "${selectedGroupCategory}". Try selecting another category.`}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={loadSections}
                  style={styles.refreshBatchesBtn}
                >
                  <MaterialIcons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.refreshBatchesBtnText}>Refresh Batches</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Batch Cards */}
            {!isLoadingSections &&
              filteredSections.map((sec) => {
                const isSelected = selectedSection?._id === sec._id;
                const catStyle = getCategoryBadgeStyle(sec.category, isDark);
                const trainerName = sec.trainerId?.name || 'Assigned Coach';
                const trainerAvatar = sec.trainerId?.avatar;
                const trainerSpec = sec.trainerId?.specialization;
                const enrolled = sec.enrolledCount || 0;
                const capacity = sec.maxCapacity || 25;
                const remaining = Math.max(0, capacity - enrolled);

                return (
                  <TouchableOpacity
                    key={sec._id}
                    activeOpacity={0.9}
                    onPress={() => setSelectedSection(sec)}
                    style={[
                      styles.sectionCard,
                      {
                        backgroundColor: cardColor,
                        borderColor: isSelected ? '#003882' : borderColor,
                        borderWidth: isSelected ? 2 : 1,
                      },
                    ]}
                  >
                    {/* Top: Category Pill & Capacity */}
                    <View style={styles.sectionCardHeader}>
                      <View style={[styles.sectionCatBadge, { backgroundColor: catStyle.bg }]}>
                        <MaterialIcons name={catStyle.icon} size={14} color={catStyle.text} style={{ marginRight: 4 }} />
                        <Text style={[styles.sectionCatBadgeText, { color: catStyle.text }]}>
                          {(sec.category || 'workout').toUpperCase()}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.sectionCapacityPill,
                          {
                            backgroundColor:
                              remaining <= 3
                                ? 'rgba(239,68,68,0.1)'
                                : 'rgba(0,191,98,0.1)',
                          },
                        ]}
                      >
                        <MaterialIcons
                          name="person"
                          size={12}
                          color={remaining <= 3 ? '#EF4444' : '#00BF62'}
                          style={{ marginRight: 3 }}
                        />
                        <Text
                          style={[
                            styles.sectionCapacityText,
                            { color: remaining <= 3 ? '#EF4444' : '#00BF62' },
                          ]}
                        >
                          {remaining <= 3 ? `Only ${remaining} left` : `${enrolled}/${capacity} Enrolled`}
                        </Text>
                      </View>
                    </View>

                    {/* Section Title */}
                    <Text style={[styles.sectionTitleText, { color: textColor }]}>
                      {sec.title}
                    </Text>

                    {/* Trainer Row */}
                    <View style={styles.sectionTrainerRow}>
                      {trainerAvatar ? (
                        <Image source={{ uri: trainerAvatar }} style={styles.trainerAvatarImg} />
                      ) : (
                        <View style={[styles.trainerAvatarFallback, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]}>
                          <Text style={[styles.trainerInitials, { color: textColor }]}>
                            {trainerName.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                      )}
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={[styles.trainerLabel, { color: subtitleColor }]}>Trainer</Text>
                        <Text style={[styles.trainerName, { color: textColor }]}>{trainerName}</Text>
                      </View>
                      {trainerSpec ? (
                        <View style={[styles.trainerSpecBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC' }]}>
                          <Text style={[styles.trainerSpecText, { color: subtitleColor }]}>
                            {trainerSpec}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    {/* Schedule Block */}
                    <View style={[styles.sectionScheduleBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC', borderColor: borderColor }]}>
                      {/* Dates */}
                      <View style={styles.scheduleRow}>
                        <MaterialIcons name="date-range" size={16} color={isDark ? '#93C5FD' : '#003882'} style={{ marginRight: 8 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.scheduleLabel, { color: subtitleColor }]}>Batch Dates</Text>
                          <Text style={[styles.scheduleValue, { color: textColor }]}>
                            {formatToDDMMYYYY(sec.startDate)} to {formatToDDMMYYYY(sec.endDate)}
                          </Text>
                        </View>
                        <View style={[styles.durationBadge, { backgroundColor: isDark ? 'rgba(96,165,250,0.18)' : 'rgba(0,56,130,0.08)' }]}>
                          <Text style={[styles.durationBadgeText, { color: isDark ? '#93C5FD' : '#003882' }]}>
                            {sec.durationDays || 20} Days
                          </Text>
                        </View>
                      </View>

                      {/* Timings */}
                      <View style={[styles.scheduleRow, { marginTop: 8 }]}>
                        <MaterialIcons name="schedule" size={16} color={isDark ? '#93C5FD' : '#003882'} style={{ marginRight: 8 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.scheduleLabel, { color: subtitleColor }]}>Daily Timing</Text>
                          <Text style={[styles.scheduleValue, { color: textColor }]}>
                            {sec.startTime} - {sec.endTime}
                          </Text>
                        </View>
                      </View>

                      {/* Active Days */}
                      <View style={[styles.scheduleRow, { marginTop: 8, alignItems: 'flex-start' }]}>
                        <MaterialIcons name="repeat" size={16} color={isDark ? '#93C5FD' : '#003882'} style={{ marginRight: 8, marginTop: 2 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.scheduleLabel, { color: subtitleColor, marginBottom: 4 }]}>Weekly Schedule</Text>
                          <View style={styles.daysPillRow}>
                            {ALL_WEEK_DAYS.map((d) => {
                              const isDayActive = Array.isArray(sec.activeDays) && sec.activeDays.includes(d);
                              return (
                                <View
                                  key={d}
                                  style={[
                                    styles.smallDayPill,
                                    {
                                      backgroundColor: isDayActive
                                        ? (isDark ? 'rgba(96,165,250,0.25)' : 'rgba(0,56,130,0.12)')
                                        : (isDark ? 'rgba(255,255,255,0.04)' : '#E2E8F0'),
                                      borderColor: isDayActive ? (isDark ? '#60A5FA' : '#003882') : 'transparent',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.smallDayPillText,
                                      {
                                        color: isDayActive
                                          ? (isDark ? '#93C5FD' : '#003882')
                                          : subtitleColor,
                                        fontWeight: isDayActive ? 'bold' : 'normal',
                                      },
                                    ]}
                                  >
                                    {d}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Description if present */}
                    {sec.description ? (
                      <Text style={[styles.sectionDescText, { color: subtitleColor }]} numberOfLines={2}>
                        {sec.description}
                      </Text>
                    ) : null}

                    {/* Footer Row: Fee & Select Radio */}
                    <View style={styles.sectionCardFooter}>
                      <View>
                        <Text style={[styles.sectionFeeLabel, { color: subtitleColor }]}>Full Batch Fee</Text>
                        <Text style={[styles.sectionFeeValue, { color: textColor }]}>
                          ₹{Math.round(Number(sec.cost) || 0)}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.selectBatchBtn,
                          {
                            backgroundColor: isSelected
                              ? '#003882'
                              : isDark
                              ? 'rgba(255,255,255,0.08)'
                              : '#F1F5F9',
                            borderColor: isSelected ? '#003882' : borderColor,
                          },
                        ]}
                      >
                        <MaterialIcons
                          name={isSelected ? 'check-circle' : 'radio-button-unchecked'}
                          size={16}
                          color={isSelected ? '#FFFFFF' : subtitleColor}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[
                            styles.selectBatchBtnText,
                            { color: isSelected ? '#FFFFFF' : textColor },
                          ]}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>

          {/* Bottom Bar for Group Classes */}
          {selectedSection && (
            <View
              style={[
                styles.bottomBar,
                {
                  backgroundColor: isDark
                    ? 'rgba(18, 18, 18, 0.88)'
                    : 'rgba(255, 255, 255, 0.88)',
                  borderTopColor: isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(226, 232, 240, 0.8)',
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.bottomPriceLabel, { color: subtitleColor }]} numberOfLines={1}>
                  {selectedSection.title}
                </Text>
                <Text style={[styles.bottomPriceValue, { color: textColor }]}>
                  ₹{Math.round(Number(selectedSection.cost) || 0)}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => goToCheckout(selectedSection)}
                style={styles.continueBtn}
              >
                <Text style={styles.continueBtnText}>Continue to Payment</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* VIEW 6: OTHER CLASSES DIRECTORY */}
      {currentView === 'other_classes' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={[styles.chooseTitle, { color: textColor }]}>Explore Special Classes</Text>
          <Text style={[styles.subTitleSmall, { color: subtitleColor }]}>
            Find the perfect specialized workout class for you
          </Text>

          <View style={{ marginTop: 16 }}>
            {OTHER_CLASSES.map((c) => (
              <TouchableOpacity
                key={c.name}
                activeOpacity={0.85}
                onPress={() => selectOtherClass(c.name, c.price, c.defaultType)}
                style={[styles.otherClassCard, { backgroundColor: cardColor, borderColor: borderColor }]}
              >
                <View style={[styles.otherClassIconBox, { backgroundColor: 'rgba(0,56,130,0.08)' }]}>
                  <MaterialIcons name={c.icon} size={22} color={isDark ? '#93C5FD' : '#003882'} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.categoryTitle, { color: textColor }]}>{c.title}</Text>
                  <Text style={[styles.categoryDesc, { color: subtitleColor }]}>{c.desc}</Text>
                </View>
                <Text style={styles.otherClassPrice}>₹{Math.round(c.price)}</Text>
                <MaterialIcons name="chevron-right" size={20} color={subtitleColor} style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
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
    paddingVertical: 12,
  },
  backBtn: {
    padding: 4,
    marginRight: 12,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  chooseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: -0.3,
  },
  subTitleSmall: {
    fontSize: 12,
    marginTop: 4,
  },

  /* Categories */
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 14,
  },
  categoryIconBox: {
    padding: 12,
    borderRadius: 16,
  },
  categoryContent: {
    flex: 1,
    marginLeft: 14,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryDesc: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  infoNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  infoNoticeText: {
    fontSize: 11,
  },

  /* Hero Banner */
  heroBanner: {
    height: 115,
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#0F172A',
    overflow: 'hidden',
    marginBottom: 10,
  },
  heroBannerGradient: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 20,
  },
  heroBannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  heroBannerSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginTop: 4,
  },
  chooseTypeHeading: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },

  /* Type Option Cards */
  typeOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
  },
  typeIconBox: {
    padding: 10,
    borderRadius: 12,
  },
  typeContent: {
    flex: 1,
    marginLeft: 12,
  },
  typeTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  typeSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  typePrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00BF62',
    marginTop: 4,
  },

  /* Weekly Plan */
  planBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  planIconBox: {
    padding: 10,
    borderRadius: 14,
  },
  planBannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  planBannerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  planPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00BF62',
  },
  planIncludesTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inclusionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inclusionText: {
    fontSize: 13,
  },
  validityNoticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,191,98,0.08)',
    padding: 12,
    borderRadius: 14,
    marginTop: 16,
  },
  validityNoticeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00BF62',
    flex: 1,
  },

  /* Custom Dates */
  customDatesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  selectedCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,191,98,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 16,
  },
  selectedCountText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#00BF62',
  },
  selectedCalcText: {
    fontSize: 12,
  },

  /* Class Booking */
  classTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  classTypeName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  classTypeRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classTypePrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00BF62',
  },
  slotCategoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  slotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  slotPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  slotPillText: {
    fontSize: 12,
  },

  /* Other Classes */
  otherClassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
  },
  otherClassIconBox: {
    padding: 10,
    borderRadius: 12,
  },
  otherClassPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00BF62',
  },

  /* Bottom Bar */
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },
  bottomPriceLabel: {
    fontSize: 11,
  },
  bottomPriceValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  continueBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#003882',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  /* Group Classes View */
  batchCountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  batchCountBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  groupHeroBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  groupFilterScroll: {
    paddingVertical: 12,
    gap: 8,
  },
  groupFilterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  groupFilterChipText: {
    fontSize: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 13,
    marginTop: 12,
  },
  errorNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.1)',
    padding: 12,
    borderRadius: 14,
    marginVertical: 12,
  },
  errorNoticeText: {
    flex: 1,
    fontSize: 12,
    color: '#EF4444',
  },
  retryPill: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  retryPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyBatchCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    borderRadius: 20,
    borderWidth: 1,
    marginVertical: 16,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyBatchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emptyBatchDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  refreshBatchesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#003882',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  refreshBatchesBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  sectionCard: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,
  },
  sectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionCatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionCatBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  sectionCapacityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  sectionCapacityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  sectionTitleText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 22,
  },
  sectionTrainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trainerAvatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  trainerAvatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trainerInitials: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  trainerLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trainerName: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  trainerSpecBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trainerSpecText: {
    fontSize: 11,
  },
  sectionScheduleBox: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scheduleValue: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  durationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  durationBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  daysPillRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  smallDayPill: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  smallDayPillText: {
    fontSize: 10,
  },
  sectionDescText: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  sectionCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  sectionFeeLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionFeeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00BF62',
  },
  selectBatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  selectBatchBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
