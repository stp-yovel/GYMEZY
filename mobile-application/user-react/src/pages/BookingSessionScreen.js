import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors } from '../theme/appTheme';
import {
  HorizontalDayStripCalendar,
  MonthlyGridCalendar,
} from '../widgets/CustomCalendar';

const TIME_SLOTS_MORNING = [
  '06:00 AM - 07:00 AM',
  '07:00 AM - 08:00 AM',
  '08:00 AM - 09:00 AM',
  '09:00 AM - 10:00 AM',
];

const TIME_SLOTS_EVENING = [
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM',
  '06:00 PM - 07:00 PM',
  '07:00 PM - 08:00 PM',
  '08:00 PM - 09:00 PM',
];

export const BookingSessionScreen = ({ route, navigation }) => {
  const { gym } = route.params;
  const { isDark, colors } = useTheme();

  const workouts = gym.workouts && gym.workouts.length > 0 ? gym.workouts : ['GYM', 'Yoga', 'Zumba'];
  const [selectedWorkout, setSelectedWorkout] = useState(workouts[0]);
  const [sessionCount, setSessionCount] = useState(1); // 1 = Single, 5 = Batch

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarViewMode, setCalendarViewMode] = useState('strip'); // 'strip' or 'grid'

  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS_MORNING[0]);
  const [withTrainer, setWithTrainer] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(
    gym.trainers && gym.trainers.length > 0 ? gym.trainers[0] : null
  );

  // Price calculations matching Flutter
  const baseSessionPrice = gym.pricePerSession;
  const trainerPerSessionFee = 300;
  const rawSubtotal = baseSessionPrice * sessionCount;
  const trainerTotal = withTrainer ? trainerPerSessionFee * sessionCount : 0;
  const subtotal = rawSubtotal + trainerTotal;
  const taxGst = subtotal * 0.18;
  const grandTotal = subtotal + taxGst;

  const handleProceed = () => {
    navigation.navigate('PaymentSummary', {
      type: 'booking',
      gym,
      workoutType: selectedWorkout,
      sessionCount,
      daysBooked: sessionCount === 1 ? '1 Day (Single Session)' : `${sessionCount} Days Batch`,
      selectedDate: selectedDate.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      selectedTime: selectedTimeSlot,
      withTrainer,
      trainer: withTrainer ? selectedTrainer : null,
      amount: grandTotal,
      subtotal,
      tax: taxGst,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <SafeAreaView style={{ backgroundColor: colors.card }}>
        <View style={[styles.appBar, { borderColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.appBarTitle, { color: colors.text }]}>Book Workout Session</Text>
            <Text style={[styles.appBarSub, { color: colors.subtitle }]} numberOfLines={1}>
              {gym.name}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 1. SELECT WORKOUT TYPE */}
        <View style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Select Workout</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.workoutsRow}>
            {workouts.map((w) => {
              const isSelected = selectedWorkout === w;
              return (
                <TouchableOpacity
                  key={w}
                  onPress={() => setSelectedWorkout(w)}
                  style={[
                    styles.workoutPill,
                    {
                      backgroundColor: isSelected
                        ? AppColors.primaryNavy
                        : isDark
                        ? '#262626'
                        : '#F1F5F9',
                      borderColor: isSelected ? AppColors.primaryNavy : colors.border,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="fitness-center"
                    size={16}
                    color={isSelected ? '#FFFFFF' : colors.subtitle}
                  />
                  <Text
                    style={[
                      styles.workoutPillText,
                      { color: isSelected ? '#FFFFFF' : colors.text },
                    ]}
                  >
                    {w}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 2. SESSION MODE (Single vs Multi) */}
        <View style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Session Plan</Text>
          <View style={styles.planSelectorRow}>
            <TouchableOpacity
              onPress={() => setSessionCount(1)}
              style={[
                styles.planOptionCard,
                {
                  backgroundColor: sessionCount === 1 ? 'rgba(0, 56, 130, 0.1)' : colors.card,
                  borderColor: sessionCount === 1 ? AppColors.primaryNavy : colors.border,
                },
              ]}
            >
              <MaterialIcons
                name="looks-one"
                size={22}
                color={sessionCount === 1 ? AppColors.primaryNavy : colors.subtitle}
              />
              <Text style={[styles.planOptionTitle, { color: colors.text }]}>Single Pass</Text>
              <Text style={[styles.planOptionPrice, { color: AppColors.primaryNavy }]}>
                ₹{baseSessionPrice} / 1 Day
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSessionCount(5)}
              style={[
                styles.planOptionCard,
                {
                  backgroundColor: sessionCount === 5 ? 'rgba(0, 56, 130, 0.1)' : colors.card,
                  borderColor: sessionCount === 5 ? AppColors.primaryNavy : colors.border,
                },
              ]}
            >
              <MaterialIcons
                name="view-carousel"
                size={22}
                color={sessionCount === 5 ? AppColors.primaryNavy : colors.subtitle}
              />
              <Text style={[styles.planOptionTitle, { color: colors.text }]}>5 Days Batch</Text>
              <Text style={[styles.planOptionPrice, { color: AppColors.primaryNavy }]}>
                ₹{baseSessionPrice * 5} / 5 Days
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. SELECT DATE */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderBetween}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>3. Select Date</Text>
            <TouchableOpacity
              onPress={() =>
                setCalendarViewMode(calendarViewMode === 'strip' ? 'grid' : 'strip')
              }
              style={styles.toggleCalendarBtn}
            >
              <MaterialIcons
                name={calendarViewMode === 'strip' ? 'calendar-month' : 'view-week'}
                size={18}
                color={AppColors.primaryNavy}
              />
              <Text style={styles.toggleCalendarText}>
                {calendarViewMode === 'strip' ? 'Month View' : 'Strip View'}
              </Text>
            </TouchableOpacity>
          </View>

          {calendarViewMode === 'strip' ? (
            <HorizontalDayStripCalendar
              selectedDate={selectedDate}
              onDateSelected={setSelectedDate}
              wrapInCard={false}
            />
          ) : (
            <MonthlyGridCalendar
              selectedDate={selectedDate}
              onDateSelected={setSelectedDate}
              wrapInCard={false}
            />
          )}
        </View>

        {/* 4. SELECT TIME SLOT */}
        <View style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Select Time Slot</Text>

          {/* Morning Slots */}
          <Text style={[styles.slotSubheading, { color: colors.subtitle }]}>Morning Hours</Text>
          <View style={styles.slotsGrid}>
            {TIME_SLOTS_MORNING.map((slot) => {
              const isSelected = selectedTimeSlot === slot;
              return (
                <TouchableOpacity
                  key={slot}
                  onPress={() => setSelectedTimeSlot(slot)}
                  style={[
                    styles.slotPill,
                    {
                      backgroundColor: isSelected
                        ? AppColors.primaryNavy
                        : isDark
                        ? '#262626'
                        : '#F1F5F9',
                      borderColor: isSelected ? AppColors.primaryNavy : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.slotText,
                      { color: isSelected ? '#FFFFFF' : colors.text },
                    ]}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Evening Slots */}
          <Text style={[styles.slotSubheading, { color: colors.subtitle, marginTop: 12 }]}>
            Evening Hours
          </Text>
          <View style={styles.slotsGrid}>
            {TIME_SLOTS_EVENING.map((slot) => {
              const isSelected = selectedTimeSlot === slot;
              return (
                <TouchableOpacity
                  key={slot}
                  onPress={() => setSelectedTimeSlot(slot)}
                  style={[
                    styles.slotPill,
                    {
                      backgroundColor: isSelected
                        ? AppColors.primaryNavy
                        : isDark
                        ? '#262626'
                        : '#F1F5F9',
                      borderColor: isSelected ? AppColors.primaryNavy : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.slotText,
                      { color: isSelected ? '#FFFFFF' : colors.text },
                    ]}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 5. ADD PERSONAL TRAINER (OPTIONAL) */}
        {gym.trainers && gym.trainers.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.trainerToggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 2 }]}>
                  Add Personal Trainer (+₹300)
                </Text>
                <Text style={[styles.trainerToggleSub, { color: colors.subtitle }]}>
                  1-on-1 personalized form guidance
                </Text>
              </View>
              <Switch
                value={withTrainer}
                onValueChange={setWithTrainer}
                trackColor={{ false: '#CBD5E1', true: AppColors.secondaryColor }}
                thumbColor="#FFFFFF"
              />
            </View>

            {withTrainer && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.trainersPickerScroll}
              >
                {gym.trainers.map((tr) => {
                  const isTrSelected = selectedTrainer?.name === tr.name;
                  return (
                    <TouchableOpacity
                      key={tr.name}
                      onPress={() => setSelectedTrainer(tr)}
                      style={[
                        styles.trainerPickerCard,
                        {
                          backgroundColor: isTrSelected ? 'rgba(0,56,130,0.1)' : colors.card,
                          borderColor: isTrSelected ? AppColors.primaryNavy : colors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.trainerPickerName, { color: colors.text }]}>
                        {tr.name}
                      </Text>
                      <Text style={[styles.trainerPickerSpec, { color: colors.subtitle }]}>
                        {tr.specialty}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        )}

        {/* 6. PRICE SUMMARY BREAKDOWN */}
        <View
          style={[
            styles.pricingCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.pricingCardTitle, { color: colors.text }]}>
            Fare Summary
          </Text>

          <View style={styles.priceLine}>
            <Text style={[styles.priceLineLabel, { color: colors.subtitle }]}>
              Session Base Fare ({sessionCount} {sessionCount === 1 ? 'Day' : 'Days'})
            </Text>
            <Text style={[styles.priceLineVal, { color: colors.text }]}>
              ₹{rawSubtotal.toFixed(2)}
            </Text>
          </View>

          {withTrainer && (
            <View style={styles.priceLine}>
              <Text style={[styles.priceLineLabel, { color: colors.subtitle }]}>
                Personal Trainer Guide
              </Text>
              <Text style={[styles.priceLineVal, { color: colors.text }]}>
                ₹{trainerTotal.toFixed(2)}
              </Text>
            </View>
          )}

          <View style={styles.priceLine}>
            <Text style={[styles.priceLineLabel, { color: colors.subtitle }]}>
              GST & Taxes (18%)
            </Text>
            <Text style={[styles.priceLineVal, { color: colors.text }]}>
              ₹{taxGst.toFixed(2)}
            </Text>
          </View>

          <View style={[styles.priceDivider, { backgroundColor: colors.border }]} />

          <View style={styles.totalLine}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total Amount</Text>
            <Text style={[styles.totalVal, { color: AppColors.secondaryColor }]}>
              ₹{grandTotal.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.bottomPriceGroup}>
          <Text style={[styles.bottomPricePrefix, { color: colors.subtitle }]}>To Pay</Text>
          <Text style={[styles.bottomPriceVal, { color: colors.text }]}>
            ₹{grandTotal.toFixed(0)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleProceed}
          style={[styles.proceedBtn, { backgroundColor: AppColors.secondaryColor }]}
          activeOpacity={0.85}
        >
          <Text style={styles.proceedBtnText}>Proceed to Pay</Text>
          <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 4,
  },
  appBarTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  appBarSub: {
    fontSize: 12,
    marginTop: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  sectionCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  sectionHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleCalendarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleCalendarText: {
    color: AppColors.primaryNavy,
    fontSize: 12.5,
    fontWeight: '700',
    marginLeft: 4,
  },
  workoutsRow: {
    flexDirection: 'row',
  },
  workoutPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginRight: 10,
  },
  workoutPillText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  planSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planOptionCard: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    alignItems: 'center',
  },
  planOptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
  },
  planOptionPrice: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
  slotSubheading: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  slotPill: {
    width: '48%',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 8,
  },
  slotText: {
    fontSize: 12,
    fontWeight: '600',
  },
  trainerToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trainerToggleSub: {
    fontSize: 12,
  },
  trainersPickerScroll: {
    marginTop: 12,
    flexDirection: 'row',
  },
  trainerPickerCard: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 10,
  },
  trainerPickerName: {
    fontSize: 13,
    fontWeight: '700',
  },
  trainerPickerSpec: {
    fontSize: 11,
    marginTop: 2,
  },
  pricingCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginTop: 6,
  },
  pricingCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  priceLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLineLabel: {
    fontSize: 13,
  },
  priceLineVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  priceDivider: {
    height: 1,
    marginVertical: 10,
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    borderTopWidth: 1,
  },
  bottomPriceGroup: {
    flex: 1,
  },
  bottomPricePrefix: {
    fontSize: 11,
  },
  bottomPriceVal: {
    fontSize: 20,
    fontWeight: '900',
  },
  proceedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 16,
  },
  proceedBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginRight: 6,
  },
});
