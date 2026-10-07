import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Modal,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors, AppTheme } from '../theme/appTheme';
import { MonthlyGridCalendar } from '../widgets/CustomCalendar';
import { useBookingRepository } from '../data/BookingContext';
import { useToast } from '../widgets/CustomScaffoldMessage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getBenefitIcon = (text = '') => {
  const lower = String(text).toLowerCase();
  if (lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('internet')) return 'wifi';
  if (lower.includes('towel')) return 'dry-cleaning';
  if (lower.includes('access') || lower.includes('facilit') || lower.includes('all-access') || lower.includes('unrestricted')) return 'all-inclusive';
  if (lower.includes('group') || lower.includes('class') || lower.includes('trainer') || lower.includes('pt')) return 'group';
  if (lower.includes('locker') || lower.includes('shower')) return 'lock-outline';
  if (lower.includes('pass') || lower.includes('guest') || lower.includes('ticket')) return 'confirmation-number';
  if (lower.includes('nutri') || lower.includes('diet') || lower.includes('meal')) return 'restaurant-menu';
  if (lower.includes('steam') || lower.includes('sauna') || lower.includes('spa') || lower.includes('pool')) return 'hot-tub';
  return 'check-circle';
};

const buildGymPlans = (gym) => {
  const custom = Array.isArray(gym?.customPricingPlans) ? gym.customPricingPlans : [];
  const flat = gym?.pricingPlans || {};

  const monthlyTier = custom.find((p) => p?.tierId === 'monthly' || p?.badge?.toLowerCase().includes('month') || p?.duration?.includes('30'));
  const quarterlyTier = custom.find((p) => p?.tierId === 'quarterly' || p?.badge?.toLowerCase().includes('quarter') || p?.duration?.includes('90'));
  const halfYearlyTier = custom.find((p) => p?.tierId === 'half_yearly' || p?.badge?.toLowerCase().includes('half') || p?.duration?.includes('180'));
  const annualTier = custom.find((p) => p?.tierId === 'annual' || p?.badge?.toLowerCase().includes('annual') || p?.badge?.toLowerCase().includes('year') || p?.duration?.includes('365'));

  const monthlyPrice = Number(monthlyTier?.price ?? flat.monthly ?? 1299);
  const quarterlyPrice = Number(quarterlyTier?.price ?? flat.quarterly ?? 3299);
  const halfYearlyPrice = Number(halfYearlyTier?.price ?? flat.halfYearly ?? 5999);
  const annualPrice = Number(annualTier?.price ?? flat.annual ?? 11999);

  const calcSavings = (price, months) => {
    const diff = monthlyPrice * months - price;
    return diff > 0 ? `Save ₹${diff.toLocaleString('en-IN')}` : null;
  };

  return {
    Monthly: {
      name: monthlyTier?.name || 'Monthly Plan',
      price: monthlyPrice,
      duration: '30 Days',
      label: `₹${monthlyPrice.toLocaleString('en-IN')} / month`,
      sublabel: 'Valid for 30 days',
      savings: null,
      badge: monthlyTier?.popular ? 'Most Popular' : null,
      features: Array.isArray(monthlyTier?.features) && monthlyTier.features.length > 0 ? monthlyTier.features : [
        'Access to all gym facilities',
        'Free group workout classes',
        'Locker and shower facility',
        'Trainer guidance on floor',
      ],
    },
    Quarterly: {
      name: quarterlyTier?.name || 'Quarterly Plan',
      price: quarterlyPrice,
      duration: '90 Days',
      label: `₹${quarterlyPrice.toLocaleString('en-IN')} / 3 months`,
      sublabel: 'Valid for 90 days',
      savings: quarterlyTier?.savingsText || calcSavings(quarterlyPrice, 3),
      badge: quarterlyTier?.popular ? 'Most Popular' : null,
      features: Array.isArray(quarterlyTier?.features) && quarterlyTier.features.length > 0 ? quarterlyTier.features : [
        'Access to all gym facilities',
        'Free group workout classes',
        'Locker and shower facility',
        '1 Guest pass per month',
        '2 Complimentary PT Sessions',
      ],
    },
    'Half Yearly': {
      name: halfYearlyTier?.name || 'Half Yearly Plan',
      price: halfYearlyPrice,
      duration: '180 Days',
      label: `₹${halfYearlyPrice.toLocaleString('en-IN')} / 6 months`,
      sublabel: 'Valid for 180 days',
      savings: halfYearlyTier?.savingsText || calcSavings(halfYearlyPrice, 6),
      badge: halfYearlyTier?.popular ? 'Most Popular' : null,
      features: Array.isArray(halfYearlyTier?.features) && halfYearlyTier.features.length > 0 ? halfYearlyTier.features : [
        'Access to all gym facilities',
        'Free group workout classes',
        'Locker and shower facility',
        '1 Guest pass per month',
        'Personalized nutrition guidance',
        '4 Complimentary PT Sessions',
      ],
    },
    Annual: {
      name: annualTier?.name || 'Annual Plan',
      price: annualPrice,
      duration: '365 Days',
      label: `₹${annualPrice.toLocaleString('en-IN')} / year`,
      sublabel: 'Valid for 365 days',
      savings: annualTier?.savingsText || calcSavings(annualPrice, 12),
      badge: annualTier?.popular ? 'Most Popular' : 'Best Value',
      features: Array.isArray(annualTier?.features) && annualTier.features.length > 0 ? annualTier.features : [
        'Access to all gym facilities',
        'Free group workout classes',
        'Locker and shower facility',
        '2 Guest passes per month',
        'Personalized nutrition guidance',
      ],
    },
  };
};

const TRAINERS = [
  {
    name: 'Rohit Sharma',
    exp: '8 Yrs Exp',
    specialty: 'Strength Training • Weight Loss',
    rating: 4.8,
    reviews: 124,
    price: 999.0,
    image:
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=300&auto=format&fit=crop',
  },
  {
    name: 'Sneha Iyer',
    exp: '6 Yrs Exp',
    specialty: 'Weight Loss • HIIT',
    rating: 4.6,
    reviews: 98,
    price: 899.0,
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
  },
  {
    name: 'Anjali Mehta',
    exp: '5 Yrs Exp',
    specialty: 'HIIT & Strength',
    rating: 4.7,
    reviews: 76,
    price: 899.0,
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  },
  {
    name: 'No Personal Trainer',
    exp: '',
    specialty: 'I will train on my own',
    rating: 0.0,
    reviews: 0,
    price: 0.0,
    image: null,
  },
];

const TRAINER_SLOTS = [
  '6:00 AM - 7:00 AM',
  '7:00 AM - 8:00 AM',
  '5:00 PM - 6:00 PM',
  '6:00 PM - 7:00 PM',
  '7:00 PM - 8:00 PM',
];

const GOALS = ['Weight Loss', 'Weight Gain', 'HIIT', 'Strength Training'];

export const BuyMembershipScreen = ({ route, navigation }) => {
  const { gym, initialWithTrainer = false } = route.params;
  const { isDark, colors } = useTheme();
  const { addMembership } = useBookingRepository();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [withTrainer, setWithTrainer] = useState(initialWithTrainer);

  // Selected Plan
  const [selectedPlan, setSelectedPlan] = useState('Annual');

  const plans = useMemo(() => buildGymPlans(gym), [gym]);
  const planPrice = plans[selectedPlan]?.price || 11999.0;

  // Active trainers from gym (with fallback)
  const trainersList = useMemo(() => {
    const rawTrainers = Array.isArray(gym?.trainers) && gym.trainers.length > 0 ? gym.trainers : TRAINERS;
    const formatted = rawTrainers.map((t) => ({
      id: t.id || t._id || t.employeeId || t.name,
      name: t.name,
      exp: t.experienceYears ? `${t.experienceYears} Yrs Exp` : (t.exp || 'Certified'),
      specialty: t.specialty || 'Personal Trainer',
      rating: Number(t.rating) || 4.8,
      reviews: Number(t.reviewsCount || t.reviews) || 24,
      image: t.imageUrl || t.avatar || t.image || null,
      trainerPricing: t.trainerPricing || {},
      monthlyFee: Number(t.monthlyFee || t.price) || 999,
      aboutText: t.aboutText || t.notes || '',
    }));
    if (!formatted.some((t) => t.name === 'No Personal Trainer')) {
      formatted.push({
        id: 'no-trainer',
        name: 'No Personal Trainer',
        exp: '',
        specialty: 'I will train on my own',
        rating: 0,
        reviews: 0,
        image: null,
        trainerPricing: { monthly: 0, quarterly: 0, halfYearly: 0, annual: 0, singleSession: 0 },
        monthlyFee: 0,
        aboutText: '',
      });
    }
    return formatted;
  }, [gym?.trainers]);

  // Compute trainer rate mapped to the chosen membership tier
  const getTrainerFeeForPlan = useCallback((trainer, planKey) => {
    if (!trainer || trainer.name === 'No Personal Trainer') return 0;
    const pricing = trainer.trainerPricing || {};
    const baseMonthly = Number(pricing.monthly) > 0 ? Number(pricing.monthly) : (Number(trainer.monthlyFee) || 999);

    if (planKey === 'Monthly') {
      return Number(pricing.monthly) > 0 ? Number(pricing.monthly) : baseMonthly;
    }
    if (planKey === 'Quarterly') {
      return Number(pricing.quarterly) > 0 ? Number(pricing.quarterly) : baseMonthly * 3;
    }
    if (planKey === 'Half Yearly') {
      return Number(pricing.halfYearly) > 0 ? Number(pricing.halfYearly) : baseMonthly * 6;
    }
    if (planKey === 'Annual') {
      return Number(pricing.annual) > 0 ? Number(pricing.annual) : baseMonthly * 12;
    }
    return baseMonthly;
  }, []);

  // Trainer Selection
  const [trainerGoal, setTrainerGoal] = useState('Weight Loss');
  const [selectedTrainer, setSelectedTrainer] = useState(trainersList[0]?.name || 'Rohit Sharma');
  const [selectedSlot, setSelectedSlot] = useState('5:00 PM - 6:00 PM');
  const trainerSchedule = 'Mon, Wed, Fri • 5:00 PM - 6:00 PM';

  const activeSelectedTrainerObj = useMemo(() => {
    return trainersList.find((t) => t.name === selectedTrainer) || trainersList[0];
  }, [trainersList, selectedTrainer]);

  const actualTrainerFee = useMemo(() => {
    if (!withTrainer || selectedTrainer === 'No Personal Trainer') return 0.0;
    return getTrainerFeeForPlan(activeSelectedTrainerObj, selectedPlan);
  }, [withTrainer, selectedTrainer, activeSelectedTrainerObj, selectedPlan, getTrainerFeeForPlan]);

  const totalAmount = planPrice + actualTrainerFee;

  const getDurationDays = () => {
    return selectedPlan === 'Monthly'
      ? 30
      : selectedPlan === 'Quarterly'
      ? 90
      : selectedPlan === 'Half Yearly'
      ? 180
      : 365;
  };

  const endDate = new Date(startDate.getTime() + getDurationDays() * 24 * 60 * 60 * 1000);

  const formatDate = (dt) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()}`;
  };

  const primaryNavy = isDark ? '#93C5FD' : '#003882';
  const primaryAccent = isDark ? '#60A5FA' : '#003882';
  const cardColor = isDark ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const subtitleColor = isDark ? 'rgba(255, 255, 255, 0.7)' : '#64748B';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0';

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      processMembershipPayment();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const processMembershipPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const membershipId = `MBR${Date.now().toString().substring(7)}`;
      const newMembership = {
        id: membershipId,
        customerId: 'CUST789012',
        gymName: gym.name,
        gymLocation: gym.location,
        gymImageUrl: gym.imageUrl,
        planName: `${selectedPlan} Membership`,
        durationDays: plans[selectedPlan]?.duration,
        amountPaid: totalAmount,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        paymentMode: selectedPaymentMethod,
        otp: Math.floor(100000 + Math.random() * 900000).toString(),
        status: 'Active',
        hasPersonalTrainer: withTrainer && selectedTrainer !== 'No Personal Trainer',
        trainerName: withTrainer && selectedTrainer !== 'No Personal Trainer' ? selectedTrainer : null,
        trainerSchedule: withTrainer && selectedTrainer !== 'No Personal Trainer' ? trainerSchedule : null,
        trainerFee: actualTrainerFee,
      };

      addMembership(newMembership);
      setIsProcessing(false);
      setConfirmedMembership(newMembership);
    }, 900);
  };

  const getStepTitle = () => {
    if (!withTrainer) {
      switch (currentStep) {
        case 1:
          return 'Buy Membership';
        case 2:
          return 'Review & Confirm';
        case 3:
          return 'Select Start Date';
        case 4:
          return 'Payment';
        default:
          return 'Buy Membership';
      }
    } else {
      switch (currentStep) {
        case 1:
          return 'Buy Membership';
        case 2:
          return 'Select Personal Trainer';
        case 3:
          return 'Trainer Availability';
        case 4:
          return 'Select Start Date';
        case 5:
          return 'Review & Confirm';
        case 6:
          return 'Payment';
        default:
          return 'Buy Membership';
      }
    }
  };

  /* CONFIRMATION VIEW */
  if (confirmedMembership) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8FAFC' }]}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
          <View style={styles.centerAppBar}>
            <Text style={[styles.appBarTitle, { color: textColor }]}>Membership Confirmed</Text>
          </View>
        </SafeAreaView>

        <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }}>
          {/* Success circle */}
          <View style={styles.successCircle}>
            <MaterialIcons name="check" size={46} color="#FFFFFF" />
          </View>

          <Text style={[styles.confirmTitle, { color: textColor }]}>
            Your Membership is Confirmed!
          </Text>
          <Text style={[styles.confirmSubtitle, { color: subtitleColor }]}>
            Thank you for choosing {gym.name}
          </Text>

          {/* Receipt Card */}
          <View style={[styles.receiptCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
            <View style={styles.receiptRow}>
              <Text style={[styles.receiptLabel, { color: subtitleColor }]}>Membership ID</Text>
              <Text style={[styles.receiptValue, { color: textColor }]}>{confirmedMembership.id}</Text>
            </View>
            <View style={[styles.receiptDivider, { backgroundColor: borderColor }]} />

            <View style={styles.receiptRow}>
              <Text style={[styles.receiptLabel, { color: subtitleColor }]}>Membership Plan</Text>
              <Text style={[styles.receiptValue, { color: textColor }]}>{confirmedMembership.planName}</Text>
            </View>
            <View style={[styles.receiptDivider, { backgroundColor: borderColor }]} />

            <View style={styles.receiptRow}>
              <Text style={[styles.receiptLabel, { color: subtitleColor }]}>Start Date</Text>
              <Text style={[styles.receiptValue, { color: textColor }]}>{confirmedMembership.startDate}</Text>
            </View>
            <View style={[styles.receiptDivider, { backgroundColor: borderColor }]} />

            <View style={styles.receiptRow}>
              <Text style={[styles.receiptLabel, { color: subtitleColor }]}>End Date</Text>
              <Text style={[styles.receiptValue, { color: textColor }]}>{confirmedMembership.endDate}</Text>
            </View>
            <View style={[styles.receiptDivider, { backgroundColor: borderColor }]} />

            <View style={styles.receiptRow}>
              <Text style={[styles.receiptLabel, { color: subtitleColor }]}>Total Amount Paid</Text>
              <Text style={[styles.receiptValue, { color: '#00BF62', fontWeight: 'bold' }]}>
                ₹{Math.round(confirmedMembership.amountPaid)}
              </Text>
            </View>
            <View style={[styles.receiptDivider, { backgroundColor: borderColor }]} />

            <View style={styles.receiptRow}>
              <Text style={[styles.receiptLabel, { color: subtitleColor }]}>Payment Method</Text>
              <Text style={[styles.receiptValue, { color: textColor }]}>{confirmedMembership.paymentMode}</Text>
            </View>
          </View>

          {/* View Pass CTA */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.replace('MembershipDetails', { membership: confirmedMembership })}
            style={styles.viewPassBtn}
          >
            <Text style={styles.viewPassBtnText}>View Membership Pass</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('HomeTab')}
            style={{ marginTop: 14 }}
          >
            <Text style={[styles.backHomeText, { color: subtitleColor }]}>Back to Home</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* App Bar */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background }}>
        <View style={styles.appBar}>
          <TouchableOpacity onPress={prevStep} style={styles.backBtn} activeOpacity={0.7}>
            <MaterialIcons name="arrow-back-ios" size={18} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.appBarTitle, { color: textColor }]}>{getStepTitle()}</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Segmented Step Progress Bar */}
        <View style={styles.stepperTrack}>
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.stepSegment,
                {
                  backgroundColor:
                    idx + 1 <= currentStep ? primaryAccent : isDark ? 'rgba(255,255,255,0.12)' : '#E2E8F0',
                },
              ]}
            />
          ))}
        </View>
      </SafeAreaView>

      {/* Main Scroll Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ============================================================ */}
        {/* STEP 1: CHOOSE YOUR PLAN */}
        {/* ============================================================ */}
        {currentStep === 1 && (
          <View>
            <Text style={[styles.stepHeading, { color: textColor }]}>Choose Your Plan</Text>
            <Text style={[styles.stepSubHeading, { color: subtitleColor }]}>
              Pick a plan that fits your fitness goals
            </Text>

            <View style={{ marginTop: 18 }}>
              {Object.entries(plans).map(([planKey, planData]) => {
                const isSel = selectedPlan === planKey;
                return (
                  <TouchableOpacity
                    key={planKey}
                    activeOpacity={0.85}
                    onPress={() => setSelectedPlan(planKey)}
                    style={[
                      styles.planOptionCard,
                      {
                        backgroundColor: isSel
                          ? isDark
                            ? '#1E293B'
                            : '#F0F4FF'
                          : cardColor,
                        borderColor: isSel ? primaryAccent : borderColor,
                        borderWidth: isSel ? 1.8 : 1,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.planIconBox,
                        {
                          backgroundColor: isSel
                            ? isDark
                              ? 'rgba(59,130,246,0.25)'
                              : 'rgba(0,56,130,0.15)'
                            : isDark
                            ? '#262626'
                            : '#F1F5F9',
                        },
                      ]}
                    >
                      <MaterialIcons
                        name="calendar-month"
                        size={22}
                        color={isSel ? (isDark ? '#93C5FD' : '#003882') : subtitleColor}
                      />
                    </View>

                    <View style={{ flex: 1, marginLeft: 14 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.planTitleText, { color: textColor }]}>{planKey}</Text>
                        {planData.badge && (
                          <View style={styles.bestValueBadge}>
                            <Text style={styles.bestValueBadgeText}>{planData.badge}</Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.planLabelText,
                          { color: isSel ? (isDark ? '#93C5FD' : '#003882') : textColor },
                        ]}
                      >
                        {planData.label}
                      </Text>
                      <Text style={[styles.planSublabelText, { color: subtitleColor }]}>
                        {planData.sublabel}
                      </Text>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <MaterialIcons
                        name={isSel ? 'check-circle' : 'radio-button-unchecked'}
                        size={22}
                        color={isSel ? primaryAccent : subtitleColor}
                      />
                      {planData.savings && (
                        <Text style={styles.savingsText}>{planData.savings}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Add Trainer Toggle Switch */}
            <View style={[styles.trainerSwitchCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={[styles.trainerSwitchTitle, { color: textColor }]}>
                  Add Personal Trainer (Optional)
                </Text>
                <Text style={[styles.trainerSwitchSub, { color: subtitleColor }]}>
                  Get expert guidance and achieve your goals faster
                </Text>
              </View>
              <Switch
                value={withTrainer}
                onValueChange={setWithTrainer}
                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                thumbColor={withTrainer ? '#003882' : '#F4F3F4'}
              />
            </View>

            {/* Plan Benefits */}
            <Text style={[styles.benefitsHeading, { color: textColor }]}>
              Plan Benefits ({selectedPlan})
            </Text>
            {(plans[selectedPlan]?.features || []).map((featureText, i) => (
              <View key={i} style={styles.benefitRow}>
                <MaterialIcons
                  name={getBenefitIcon(featureText)}
                  size={16}
                  color="#00BF62"
                  style={{ marginRight: 10 }}
                />
                <Text style={[styles.benefitText, { color: textColor }]}>{featureText}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ============================================================ */}
        {/* STEP 2 (WITH TRAINER): SELECT TRAINER */}
        {/* ============================================================ */}
        {withTrainer && currentStep === 2 && (
          <View>
            <Text style={[styles.stepHeading, { color: textColor }]}>Select Personal Trainer</Text>
            <Text style={[styles.stepSubHeading, { color: subtitleColor }]}>
              Choose trainer based on your fitness goal
            </Text>

            {/* Goal Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 14 }}>
              {GOALS.map((g) => {
                const isSel = trainerGoal === g;
                return (
                  <TouchableOpacity
                    key={g}
                    activeOpacity={0.8}
                    onPress={() => setTrainerGoal(g)}
                    style={[
                      styles.goalChip,
                      {
                        backgroundColor: isSel
                          ? isDark
                            ? '#2563EB'
                            : '#003882'
                          : isDark
                          ? '#262626'
                          : '#F1F5F9',
                        borderColor: isSel ? primaryAccent : borderColor,
                      },
                    ]}
                  >
                    <Text style={[styles.goalChipText, { color: isSel ? '#FFFFFF' : textColor }]}>{g}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={[styles.sectionSubtitle, { color: textColor }]}>Top Trainers</Text>

            {trainersList.map((t, idx) => {
              const isSel = selectedTrainer === t.name;
              const isNone = t.name === 'No Personal Trainer';
              const tFee = getTrainerFeeForPlan(t, selectedPlan);
              return (
                <TouchableOpacity
                  key={t.id || idx}
                  activeOpacity={0.85}
                  onPress={() => {
                    setSelectedTrainer(t.name);
                  }}
                  style={[
                    styles.trainerSelectCard,
                    {
                      backgroundColor: isSel ? (isDark ? '#1E293B' : '#F0F4FF') : cardColor,
                      borderColor: isSel ? primaryAccent : borderColor,
                      borderWidth: isSel ? 1.8 : 1,
                    },
                  ]}
                >
                  {t.image ? (
                    <Image source={{ uri: t.image }} style={styles.trainerAvatarImg} />
                  ) : (
                    <View style={[styles.trainerAvatarPlaceholder, { backgroundColor: isDark ? '#262626' : '#F1F5F9' }]}>
                      <MaterialIcons name="person-off" size={24} color="#00BF62" />
                    </View>
                  )}

                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={[styles.trainerCardName, { color: textColor }]}>{t.name}</Text>
                      {!isNone && (
                        <TouchableOpacity onPress={() => setSelectedModalTrainer(t)}>
                          <Text style={[styles.aboutTrainerLink, { color: isDark ? '#93C5FD' : '#003882' }]}>
                            Rates & Bio
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text style={[styles.trainerSpecialtyText, { color: subtitleColor }]}>
                      {isNone ? t.specialty : `${t.exp} • ${t.specialty}`}
                    </Text>
                    {!isNone && (
                      <View style={styles.trainerStatsRow}>
                        <MaterialIcons name="star" size={14} color="#F59E0B" />
                        <Text style={[styles.trainerRatingScore, { color: textColor }]}>
                          {t.rating} ({t.reviews})
                        </Text>
                        <Text style={styles.trainerPriceText}>₹{Math.round(tFee)} / {selectedPlan}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ============================================================ */}
        {/* STEP 3 (WITH TRAINER): TRAINER AVAILABILITY */}
        {/* ============================================================ */}
        {withTrainer && currentStep === 3 && (
          <View>
            <Text style={[styles.stepHeading, { color: textColor }]}>Trainer Availability</Text>

            {/* Trainer Mini Card */}
            <View style={[styles.miniTrainerCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=300&auto=format&fit=crop',
                }}
                style={styles.miniTrainerAvatar}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.miniTrainerName, { color: textColor }]}>
                  {selectedTrainer || 'Rohit Sharma'}
                </Text>
                <Text style={[styles.miniTrainerGoal, { color: subtitleColor }]}>
                  Specializes in {trainerGoal}
                </Text>
              </View>
            </View>

            <Text style={[styles.sectionSubtitle, { color: textColor, marginTop: 20 }]}>
              Weekly Schedule
            </Text>
            <View style={styles.daysScheduleRow}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => {
                const isAvail = d === 'Mon' || d === 'Wed' || d === 'Fri' || d === 'Sat';
                return (
                  <View key={d} style={styles.dayDotCol}>
                    <Text style={[styles.dayDotText, { color: subtitleColor }]}>{d}</Text>
                    <View
                      style={[
                        styles.dayDotCircle,
                        { backgroundColor: isAvail ? '#00BF62' : isDark ? '#444' : '#CBD5E1' },
                      ]}
                    />
                  </View>
                );
              })}
            </View>

            <Text style={[styles.sectionSubtitle, { color: textColor, marginTop: 22 }]}>
              Select Time Slot
            </Text>
            <View style={styles.slotsWrap}>
              {TRAINER_SLOTS.map((s) => {
                const isSel = selectedSlot === s;
                return (
                  <TouchableOpacity
                    key={s}
                    activeOpacity={0.8}
                    onPress={() => setSelectedSlot(s)}
                    style={[
                      styles.slotChip,
                      {
                        backgroundColor: isSel
                          ? isDark
                            ? '#2563EB'
                            : '#003882'
                          : isDark
                          ? '#262626'
                          : '#F1F5F9',
                        borderColor: isSel ? primaryAccent : borderColor,
                      },
                    ]}
                  >
                    <Text style={[styles.slotChipText, { color: isSel ? '#FFFFFF' : textColor, fontWeight: isSel ? 'bold' : '500' }]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.disclaimerText, { color: subtitleColor }]}>
              Trainer sessions are available on selected days and time slots.
            </Text>
          </View>
        )}

        {/* ============================================================ */}
        {/* STEP START DATE (Step 3 without trainer, Step 4 with trainer) */}
        {/* ============================================================ */}
        {((!withTrainer && currentStep === 3) || (withTrainer && currentStep === 4)) && (
          <View>
            <Text style={[styles.stepHeading, { color: textColor }]}>Select Start Date</Text>
            <Text style={[styles.stepSubHeading, { color: subtitleColor }]}>
              Choose when you want your membership to begin
            </Text>

            <View style={{ marginTop: 18 }}>
              <MonthlyGridCalendar
                selectedDate={startDate}
                minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                maxMonthsAhead={3}
                onDateSelected={(d) => setStartDate(d)}
              />
            </View>

            {/* Start & End Summary Banner */}
            <View style={styles.startEndBanner}>
              <Text style={styles.startEndBannerTitle}>
                Membership will start on {formatDate(startDate)}
              </Text>
              <Text style={[styles.startEndBannerSub, { color: subtitleColor }]}>
                (Membership will end on {formatDate(endDate)})
              </Text>
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* REVIEW & CONFIRM STEP (Step 2 without trainer, Step 5 with trainer) */}
        {/* ============================================================ */}
        {((!withTrainer && currentStep === 2) || (withTrainer && currentStep === 5)) && (
          <View>
            {!withTrainer ? (
              <View>
                <Text style={[styles.labelSmall, { color: subtitleColor }]}>Membership Plan</Text>
                <Text style={[styles.planBigTitle, { color: textColor }]}>{selectedPlan} Plan</Text>
                <Text style={styles.planBigPrice}>₹{Math.round(planPrice)}</Text>
                <Text style={[styles.planBigDuration, { color: subtitleColor }]}>
                  Valid for {plans[selectedPlan]?.duration}
                </Text>

                <Text style={[styles.sectionSubtitle, { color: textColor, marginTop: 24 }]}>
                  Membership Summary
                </Text>
                <View style={[styles.receiptCard, { backgroundColor: cardColor, borderColor: borderColor, marginTop: 10 }]}>
                  <View style={styles.receiptRow}>
                    <Text style={[styles.receiptLabel, { color: subtitleColor }]}>Plan</Text>
                    <Text style={[styles.receiptValue, { color: textColor }]}>{selectedPlan} Plan</Text>
                  </View>
                  <View style={[styles.receiptDivider, { backgroundColor: borderColor }]} />
                  <View style={styles.receiptRow}>
                    <Text style={[styles.receiptLabel, { color: subtitleColor }]}>Duration</Text>
                    <Text style={[styles.receiptValue, { color: textColor }]}>{plans[selectedPlan]?.duration}</Text>
                  </View>
                  <View style={[styles.receiptDivider, { backgroundColor: borderColor }]} />
                  <View style={styles.receiptRow}>
                    <Text style={[styles.receiptLabel, { color: subtitleColor }]}>Start Date</Text>
                    <Text style={[styles.receiptValue, { color: textColor }]}>{formatDate(startDate)}</Text>
                  </View>
                  <View style={[styles.receiptDivider, { backgroundColor: borderColor }]} />
                  <View style={styles.receiptRow}>
                    <Text style={[styles.receiptLabel, { color: subtitleColor }]}>Total Amount</Text>
                    <Text style={[styles.receiptValue, { color: '#00BF62', fontWeight: 'bold' }]}>
                      ₹{Math.round(totalAmount)}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View>
                <Text style={[styles.stepSubHeading, { color: subtitleColor }]}>
                  Review your membership details
                </Text>

                {/* Plan Card */}
                <View style={[styles.reviewMiniCard, { backgroundColor: cardColor, borderColor: borderColor, marginTop: 14 }]}>
                  <View>
                    <Text style={[styles.receiptValue, { color: textColor }]}>{selectedPlan} Membership</Text>
                    <Text style={[styles.receiptLabel, { color: subtitleColor, marginTop: 2 }]}>
                      {plans[selectedPlan]?.duration}
                    </Text>
                  </View>
                  <Text style={[styles.receiptValue, { color: textColor }]}>₹{Math.round(planPrice)}</Text>
                </View>

                {/* Personal Trainer Card */}
                {selectedTrainer !== 'No Personal Trainer' && (
                  <View style={[styles.reviewMiniCard, { backgroundColor: cardColor, borderColor: borderColor, marginTop: 14 }]}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={[styles.receiptLabel, { color: subtitleColor }]}>Personal Trainer</Text>
                        <Text style={[styles.receiptValue, { color: textColor }]}>₹{Math.round(trainerFee)}</Text>
                      </View>
                      <Text style={[styles.receiptValue, { color: textColor, marginTop: 8 }]}>
                        {selectedTrainer || 'Rohit Sharma'}
                      </Text>
                      <Text style={[styles.receiptLabel, { color: subtitleColor, marginTop: 2 }]}>
                        Schedule: {trainerSchedule}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Summary Card */}
                <View style={[styles.receiptCard, { backgroundColor: cardColor, borderColor: borderColor, marginTop: 20 }]}>
                  <View style={styles.receiptRow}>
                    <Text style={[styles.receiptLabel, { color: subtitleColor }]}>Start Date</Text>
                    <Text style={[styles.receiptValue, { color: textColor }]}>{formatDate(startDate)}</Text>
                  </View>
                  <View style={[styles.receiptDivider, { backgroundColor: borderColor }]} />
                  <View style={styles.receiptRow}>
                    <Text style={[styles.receiptLabel, { color: subtitleColor }]}>Total Amount</Text>
                    <Text style={[styles.receiptValue, { color: '#00BF62', fontWeight: 'bold' }]}>
                      ₹{Math.round(totalAmount)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {/* ============================================================ */}
        {/* PAYMENT STEP (Step 4 without trainer, Step 6 with trainer) */}
        {/* ============================================================ */}
        {((!withTrainer && currentStep === 4) || (withTrainer && currentStep === 6)) && (
          <View>
            <Text style={[styles.stepHeading, { color: textColor }]}>Select Payment Method</Text>

            <View style={{ marginTop: 12 }}>
              {[
                { id: 'UPI', title: 'UPI', subtitle: 'Pay using any UPI app', icon: 'account-balance-wallet' },
                { id: 'Card', title: 'Card', subtitle: 'Debit / Credit Card', icon: 'credit-card' },
                { id: 'NetBanking', title: 'Net Banking', subtitle: 'All major banks', icon: 'account-balance' },
                { id: 'Wallet', title: 'Wallet', subtitle: 'Pay using wallet', icon: 'wallet' },
              ].map((m) => {
                const isSel = selectedPaymentMethod === m.id;
                return (
                  <TouchableOpacity
                    key={m.id}
                    activeOpacity={0.85}
                    onPress={() => setSelectedPaymentMethod(m.id)}
                    style={[
                      styles.paymentMethodCard,
                      {
                        backgroundColor: isSel ? (isDark ? '#1E293B' : '#F0F4FF') : cardColor,
                        borderColor: isSel ? primaryAccent : borderColor,
                        borderWidth: isSel ? 1.5 : 1,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={m.icon}
                      size={22}
                      color={isSel ? (isDark ? '#93C5FD' : '#003882') : subtitleColor}
                    />
                    <View style={{ flex: 1, marginLeft: 14 }}>
                      <Text style={[styles.paymentMethodTitle, { color: textColor }]}>{m.title}</Text>
                      <Text style={[styles.paymentMethodSub, { color: subtitleColor }]}>{m.subtitle}</Text>
                    </View>
                    <MaterialIcons
                      name={isSel ? 'radio-button-checked' : 'radio-button-unchecked'}
                      size={20}
                      color={isSel ? primaryAccent : subtitleColor}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.sectionSubtitle, { color: textColor, marginTop: 20 }]}>
              Price Details
            </Text>
            <View style={[styles.receiptCard, { backgroundColor: cardColor, borderColor: borderColor, marginTop: 10 }]}>
              <View style={styles.receiptRow}>
                <Text style={[styles.receiptLabel, { color: subtitleColor }]}>Membership ({selectedPlan})</Text>
                <Text style={[styles.receiptValue, { color: textColor }]}>₹{Math.round(planPrice)}</Text>
              </View>
              {actualTrainerFee > 0 && (
                <>
                  <View style={[styles.receiptDivider, { backgroundColor: borderColor }]} />
                  <View style={styles.receiptRow}>
                    <Text style={[styles.receiptLabel, { color: subtitleColor }]}>
                      Personal Trainer ({selectedTrainer} • {selectedPlan})
                    </Text>
                    <Text style={[styles.receiptValue, { color: textColor }]}>₹{Math.round(actualTrainerFee)}</Text>
                  </View>
                </>
              )}
              <View style={[styles.receiptDivider, { backgroundColor: borderColor }]} />
              <View style={styles.receiptRow}>
                <Text style={[styles.receiptLabel, { color: subtitleColor }]}>Total Amount</Text>
                <Text style={[styles.receiptValue, { color: '#00BF62', fontWeight: 'bold' }]}>
                  ₹{Math.round(totalAmount)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Persistent Bottom Bar */}
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
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isProcessing}
          onPress={nextStep}
          style={styles.payBtn}
        >
          <Text style={styles.payBtnText}>
            {currentStep === totalSteps ? `Pay ₹${Math.round(totalAmount)}` : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Trainer Profile Modal */}
      {selectedModalTrainer && (
        <Modal
          visible={!!selectedModalTrainer}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedModalTrainer(null)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalBackdropTouch}
              activeOpacity={1}
              onPress={() => setSelectedModalTrainer(null)}
            />
            <View style={[styles.trainerModalContainer, { backgroundColor: cardColor }]}>
              <View style={styles.trainerModalHeader}>
                <Text style={[styles.trainerModalTitle, { color: textColor }]}>
                  About {selectedModalTrainer.name}
                </Text>
                <TouchableOpacity onPress={() => setSelectedModalTrainer(null)}>
                  <MaterialIcons name="close" size={22} color={subtitleColor} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 460 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <Image source={{ uri: selectedModalTrainer.image }} style={styles.modalTrainerImg} />
                  <View style={{ marginLeft: 16, flex: 1 }}>
                    <Text style={[styles.modalTrainerName, { color: textColor }]}>
                      {selectedModalTrainer.name}
                    </Text>
                    <Text style={[styles.modalTrainerExp, { color: subtitleColor }]}>
                      {selectedModalTrainer.exp} Experience
                    </Text>
                    <Text style={[styles.modalTrainerSpec, { color: subtitleColor }]}>
                      {selectedModalTrainer.specialty}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.sectionSubtitle, { color: textColor }]}>About Me</Text>
                <Text style={[styles.modalAboutText, { color: subtitleColor }]}>
                  {selectedModalTrainer.aboutText ||
                    'Certified fitness trainer helping clients achieve their fitness goals through personalized training and nutrition guidance.'}
                </Text>

                <Text style={[styles.sectionSubtitle, { color: textColor, marginTop: 16 }]}>
                  Tiered Membership Add-on Rates
                </Text>
                <View style={{ marginTop: 8, padding: 12, borderRadius: 8, backgroundColor: isDark ? '#1E293B' : '#F8FAFC' }}>
                  <Text style={{ fontSize: 13, color: textColor, marginBottom: 6 }}>
                    • Monthly Plan: ₹{Math.round(getTrainerFeeForPlan(selectedModalTrainer, 'Monthly'))}
                  </Text>
                  <Text style={{ fontSize: 13, color: textColor, marginBottom: 6 }}>
                    • Quarterly Plan: ₹{Math.round(getTrainerFeeForPlan(selectedModalTrainer, 'Quarterly'))}
                  </Text>
                  <Text style={{ fontSize: 13, color: textColor, marginBottom: 6 }}>
                    • Half Yearly Plan: ₹{Math.round(getTrainerFeeForPlan(selectedModalTrainer, 'Half Yearly'))}
                  </Text>
                  <Text style={{ fontSize: 13, color: textColor, marginBottom: 6 }}>
                    • Annual Plan: ₹{Math.round(getTrainerFeeForPlan(selectedModalTrainer, 'Annual'))}
                  </Text>
                  {selectedModalTrainer.trainerPricing?.singleSession > 0 && (
                    <Text style={{ fontSize: 13, color: textColor }}>
                      • Single Session: ₹{Math.round(selectedModalTrainer.trainerPricing.singleSession)}
                    </Text>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  centerAppBar: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backBtn: {
    padding: 6,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepperTrack: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 6,
    paddingBottom: 8,
  },
  stepSegment: {
    flex: 1,
    height: 3.5,
    borderRadius: 2,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  stepHeading: {
    fontSize: 17,
    fontWeight: '900',
  },
  stepSubHeading: {
    fontSize: 13,
    marginTop: 4,
  },

  /* Plan options */
  planOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  planIconBox: {
    padding: 10,
    borderRadius: 14,
  },
  planTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  bestValueBadge: {
    backgroundColor: '#003882',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  bestValueBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planLabelText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },
  planSublabelText: {
    fontSize: 11.5,
  },
  savingsText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#00BF62',
    marginTop: 4,
  },

  /* Trainer switch */
  trainerSwitchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginVertical: 14,
  },
  trainerSwitchTitle: {
    fontSize: 13.5,
    fontWeight: 'bold',
  },
  trainerSwitchSub: {
    fontSize: 11.5,
    marginTop: 2,
  },
  benefitsHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4.5,
  },
  benefitText: {
    fontSize: 12.5,
    fontWeight: '500',
  },

  /* Step 2 Trainers */
  goalChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  goalChipText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  trainerSelectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
  },
  trainerAvatarImg: {
    width: 50,
    height: 50,
    borderRadius: 14,
  },
  trainerAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trainerCardName: {
    fontSize: 14.5,
    fontWeight: 'bold',
  },
  aboutTrainerLink: {
    fontSize: 11.5,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  trainerSpecialtyText: {
    fontSize: 11.5,
    marginTop: 2,
  },
  trainerStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trainerRatingScore: {
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  trainerPriceText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#00BF62',
    marginLeft: 'auto',
  },

  /* Step 3 Trainer Availability */
  miniTrainerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 14,
  },
  miniTrainerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  miniTrainerName: {
    fontSize: 14.5,
    fontWeight: 'bold',
  },
  miniTrainerGoal: {
    fontSize: 12,
    marginTop: 2,
  },
  daysScheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  dayDotCol: {
    alignItems: 'center',
  },
  dayDotText: {
    fontSize: 11.5,
  },
  dayDotCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  slotsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  slotChipText: {
    fontSize: 12,
  },
  disclaimerText: {
    fontSize: 11.5,
    marginTop: 16,
  },

  /* Start & End Date */
  startEndBanner: {
    backgroundColor: 'rgba(0,191,98,0.1)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,191,98,0.3)',
    marginTop: 20,
  },
  startEndBannerTitle: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: '#00BF62',
  },
  startEndBannerSub: {
    fontSize: 12,
    marginTop: 3,
  },

  /* Review Step */
  labelSmall: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  planBigTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  planBigPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00BF62',
    marginTop: 2,
  },
  planBigDuration: {
    fontSize: 12,
    marginTop: 2,
  },
  reviewMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },

  /* Payment Step */
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  paymentMethodTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  paymentMethodSub: {
    fontSize: 11.5,
    marginTop: 2,
  },

  /* Receipt Table */
  receiptCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    width: '100%',
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  receiptLabel: {
    fontSize: 13,
  },
  receiptValue: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  receiptDivider: {
    height: 0.8,
  },

  /* Confirmation */
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00BF62',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  confirmSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  viewPassBtn: {
    backgroundColor: '#003882',
    width: '100%',
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  viewPassBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  backHomeText: {
    fontSize: 13.5,
    fontWeight: 'bold',
  },

  /* Bottom Bar */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },
  payBtn: {
    height: 52,
    backgroundColor: '#003882',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdropTouch: {
    flex: 1,
  },
  trainerModalContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  trainerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trainerModalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  modalTrainerImg: {
    width: 70,
    height: 70,
    borderRadius: 16,
  },
  modalTrainerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalTrainerExp: {
    fontSize: 12,
    marginTop: 4,
  },
  modalTrainerSpec: {
    fontSize: 12,
    marginTop: 2,
  },
  modalAboutText: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
});
