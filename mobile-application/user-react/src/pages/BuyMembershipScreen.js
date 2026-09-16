import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors } from '../theme/appTheme';
import { HorizontalDayStripCalendar } from '../widgets/CustomCalendar';
import { useToast } from '../widgets/CustomScaffoldMessage';

const MEMBERSHIP_PLANS = [
  {
    id: 'monthly',
    name: 'Monthly Membership',
    durationDays: '30 Days',
    price: 1499,
    savingsBadge: null,
    features: ['Unlimited Gym Access', 'Free Locker Access', 'Shower Facility'],
  },
  {
    id: 'quarterly',
    name: 'Quarterly Membership',
    durationDays: '90 Days',
    price: 3999,
    savingsBadge: 'POPULAR • SAVE 15%',
    features: ['Unlimited Gym Access', 'Free Locker Access', 'Shower Facility', '1 Guest Pass'],
  },
  {
    id: 'half_yearly',
    name: 'Half Yearly Membership',
    durationDays: '180 Days',
    price: 6999,
    savingsBadge: 'SAVE 25%',
    features: ['Unlimited Gym Access', 'Free Locker & Shower', '2 Guest Passes', 'Diet Chart'],
  },
  {
    id: 'annual',
    name: 'Annual Membership',
    durationDays: '365 Days',
    price: 11999,
    savingsBadge: 'BEST VALUE • SAVE 40%',
    features: [
      'Unlimited Gym Access',
      'Free Locker & Shower',
      '5 Guest Passes',
      'Free Body Composition Analysis',
      'Diet & Nutrition Consultation',
    ],
  },
];

export const BuyMembershipScreen = ({ route, navigation }) => {
  const { gym } = route.params;
  const { isDark, colors } = useTheme();
  const { showToast } = useToast();

  const [selectedPlan, setSelectedPlan] = useState(MEMBERSHIP_PLANS[1]); // Default Quarterly
  const [startDate, setStartDate] = useState(new Date());

  const [withTrainer, setWithTrainer] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(
    gym.trainers && gym.trainers.length > 0 ? gym.trainers[0] : null
  );

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const trainerMonthlyFee = 1500;
  const trainerFee = withTrainer ? trainerMonthlyFee : 0;
  const rawSubtotal = selectedPlan.price + trainerFee;
  const taxableAmount = Math.max(0, rawSubtotal - discountAmount);
  const taxGst = taxableAmount * 0.18;
  const grandTotal = taxableAmount + taxGst;

  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (code === 'GYMEZY500') {
      setDiscountAmount(500);
      setAppliedPromo('GYMEZY500');
      showToast({
        message: 'Promo code GYMEZY500 applied! ₹500 discount added.',
        isSuccess: true,
      });
    } else if (code === 'FIRSTGYM') {
      const discount = Math.round(selectedPlan.price * 0.1);
      setDiscountAmount(discount);
      setAppliedPromo('FIRSTGYM');
      showToast({
        message: `Promo code FIRSTGYM applied! ₹${discount} discount added.`,
        isSuccess: true,
      });
    } else {
      showToast({
        message: 'Invalid promo code. Try "GYMEZY500"',
        isError: true,
      });
    }
  };

  const handleProceed = () => {
    // Calculate End Date
    const daysToAdd = parseInt(selectedPlan.durationDays.replace(/\D/g, ''), 10) || 30;
    const end = new Date(startDate);
    end.setDate(startDate.getDate() + daysToAdd);

    navigation.navigate('PaymentSummary', {
      type: 'membership',
      gym,
      plan: selectedPlan,
      startDate: startDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      endDate: end.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      durationDays: selectedPlan.durationDays,
      withTrainer,
      trainer: withTrainer ? selectedTrainer : null,
      amount: grandTotal,
      subtotal: rawSubtotal,
      discount: discountAmount,
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
            <Text style={[styles.appBarTitle, { color: colors.text }]}>Buy Gym Membership</Text>
            <Text style={[styles.appBarSub, { color: colors.subtitle }]} numberOfLines={1}>
              {gym.name}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 1. SELECT MEMBERSHIP PLAN */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Choose Membership Plan</Text>

          {MEMBERSHIP_PLANS.map((plan) => {
            const isSelected = selectedPlan.id === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                onPress={() => {
                  setSelectedPlan(plan);
                  // Recalculate discount if FIRSTGYM active
                  if (appliedPromo === 'FIRSTGYM') {
                    setDiscountAmount(Math.round(plan.price * 0.1));
                  }
                }}
                activeOpacity={0.88}
                style={[
                  styles.planCard,
                  {
                    backgroundColor: isSelected
                      ? isDark
                        ? 'rgba(0, 56, 130, 0.15)'
                        : 'rgba(0, 56, 130, 0.05)'
                      : colors.card,
                    borderColor: isSelected ? AppColors.primaryNavy : colors.border,
                  },
                ]}
              >
                {/* Savings Badge */}
                {plan.savingsBadge && (
                  <View style={styles.planSavingsBadge}>
                    <Text style={styles.planSavingsText}>{plan.savingsBadge}</Text>
                  </View>
                )}

                <View style={styles.planCardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.planCardName, { color: colors.text }]}>{plan.name}</Text>
                    <Text style={[styles.planCardDuration, { color: colors.subtitle }]}>
                      Valid for {plan.durationDays}
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.planCardPrice, { color: AppColors.primaryNavy }]}>
                      ₹{plan.price}
                    </Text>
                    <View
                      style={[
                        styles.planRadio,
                        {
                          borderColor: isSelected ? AppColors.primaryNavy : colors.border,
                          backgroundColor: isSelected ? AppColors.primaryNavy : 'transparent',
                        },
                      ]}
                    >
                      {isSelected && <MaterialIcons name="check" size={14} color="#FFFFFF" />}
                    </View>
                  </View>
                </View>

                {/* Features bullet points */}
                <View style={styles.featuresList}>
                  {plan.features.map((feat, idx) => (
                    <View key={idx} style={styles.featRow}>
                      <MaterialIcons name="check" size={14} color={AppColors.secondaryColor} />
                      <Text style={[styles.featText, { color: colors.subtitle }]}>{feat}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 2. SELECT MEMBERSHIP START DATE */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Membership Start Date</Text>
          <HorizontalDayStripCalendar
            selectedDate={startDate}
            onDateSelected={setStartDate}
            customHeaderTitle="Choose Activation Date"
            wrapInCard={true}
          />
        </View>

        {/* 3. ADD PERSONAL TRAINER GUIDE */}
        {gym.trainers && gym.trainers.length > 0 && (
          <View style={styles.sectionBlock}>
            <View
              style={[
                styles.trainerCardWrapper,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.trainerToggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 2 }]}>
                    Add Personal Trainer (+₹1,500)
                  </Text>
                  <Text style={[styles.trainerToggleSub, { color: colors.subtitle }]}>
                    Dedicated coach for nutrition & workout guidance
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
                  style={styles.trainerPickerScroll}
                >
                  {gym.trainers.map((tr) => {
                    const isTrSelected = selectedTrainer?.name === tr.name;
                    return (
                      <TouchableOpacity
                        key={tr.name}
                        onPress={() => setSelectedTrainer(tr)}
                        style={[
                          styles.trainerPickerItem,
                          {
                            backgroundColor: isTrSelected ? 'rgba(0,56,130,0.1)' : colors.background,
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
          </View>
        )}

        {/* 4. PROMO CODE INPUT */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Promo & Coupons</Text>
          <View
            style={[
              styles.promoInputRow,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <MaterialIcons
              name="local-offer"
              size={20}
              color={AppColors.accentColor}
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={[styles.promoInputField, { color: colors.text }]}
              placeholder="Enter Promo Code (e.g. GYMEZY500)"
              placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'}
              value={promoCodeInput}
              onChangeText={setPromoCodeInput}
              autoCapitalize="characters"
            />
            <TouchableOpacity onPress={handleApplyPromo} style={styles.applyBtn}>
              <Text style={styles.applyBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. PRICE SUMMARY */}
        <View
          style={[
            styles.pricingCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.pricingCardTitle, { color: colors.text }]}>Price Breakdown</Text>

          <View style={styles.priceLine}>
            <Text style={[styles.priceLineLabel, { color: colors.subtitle }]}>
              {selectedPlan.name}
            </Text>
            <Text style={[styles.priceLineVal, { color: colors.text }]}>
              ₹{selectedPlan.price.toFixed(2)}
            </Text>
          </View>

          {withTrainer && (
            <View style={styles.priceLine}>
              <Text style={[styles.priceLineLabel, { color: colors.subtitle }]}>
                Personal Trainer Guide
              </Text>
              <Text style={[styles.priceLineVal, { color: colors.text }]}>
                ₹{trainerFee.toFixed(2)}
              </Text>
            </View>
          )}

          {discountAmount > 0 && (
            <View style={styles.priceLine}>
              <Text style={[styles.priceLineLabel, { color: AppColors.secondaryColor }]}>
                Promo Discount ({appliedPromo})
              </Text>
              <Text style={[styles.priceLineVal, { color: AppColors.secondaryColor }]}>
                -₹{discountAmount.toFixed(2)}
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
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total Payable</Text>
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
          <Text style={[styles.bottomPricePrefix, { color: colors.subtitle }]}>Total Amount</Text>
          <Text style={[styles.bottomPriceVal, { color: colors.text }]}>
            ₹{grandTotal.toFixed(0)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleProceed}
          style={[styles.proceedBtn, { backgroundColor: AppColors.secondaryColor }]}
          activeOpacity={0.85}
        >
          <Text style={styles.proceedBtnText}>Proceed to Payment</Text>
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
  sectionBlock: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  planCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  planSavingsBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: AppColors.secondaryColor,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  planSavingsText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
  },
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  planCardName: {
    fontSize: 15,
    fontWeight: '800',
  },
  planCardDuration: {
    fontSize: 12,
    marginTop: 2,
  },
  planCardPrice: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  planRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuresList: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
    paddingTop: 8,
  },
  featRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  featText: {
    fontSize: 12,
    marginLeft: 6,
  },
  trainerCardWrapper: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  trainerToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trainerToggleSub: {
    fontSize: 12,
  },
  trainerPickerScroll: {
    marginTop: 12,
    flexDirection: 'row',
  },
  trainerPickerItem: {
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
  promoInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 50,
  },
  promoInputField: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
  },
  applyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  applyBtnText: {
    color: AppColors.primaryNavy,
    fontSize: 13,
    fontWeight: '800',
  },
  pricingCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
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
