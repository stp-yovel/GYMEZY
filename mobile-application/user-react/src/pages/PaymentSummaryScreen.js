import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors } from '../theme/appTheme';
import { useBookingRepository } from '../data/BookingContext';
import { BookingItem } from '../models/BookingItem';
import { MembershipItem } from '../models/MembershipItem';
import { useToast } from '../widgets/CustomScaffoldMessage';

const PAYMENT_MODES = [
  { id: 'UPI', name: 'UPI / QR', desc: 'Google Pay, PhonePe, Paytm', icon: 'account-balance-wallet' },
  { id: 'Card', name: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay', icon: 'credit-card' },
  { id: 'Net Banking', name: 'Net Banking', desc: 'All Indian Banks', icon: 'account-balance' },
  { id: 'Pay at Gym', name: 'Pay at Gym Reception', desc: 'Cash or Card at Counter', icon: 'store' },
];

export const PaymentSummaryScreen = ({ route, navigation }) => {
  const { isDark, colors } = useTheme();
  const { addBooking, addMembership } = useBookingRepository();
  const { showToast } = useToast();

  const params = route.params;
  const isBooking = params.type === 'booking';

  const [selectedPaymentMode, setSelectedPaymentMode] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
  const generatePassId = () => (isBooking ? `FSB${Math.floor(100000 + Math.random() * 900000)}` : `MBR${Math.floor(100000 + Math.random() * 900000)}`);

  const handlePayNow = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const generatedOtp = generateOtp();
      const generatedId = generatePassId();

      if (isBooking) {
        const newBooking = new BookingItem({
          id: generatedId,
          customerId: 'CUST789012',
          gymName: params.gym.name,
          gymLocation: params.gym.location,
          gymImageUrl: params.gym.imageUrl,
          type: `${params.workoutType} Session`,
          sessionSubtitle: `${params.workoutType} • ${params.daysBooked}`,
          date: params.selectedDate,
          time: params.selectedTime,
          daysBooked: params.daysBooked,
          amountPaid: params.amount,
          paymentMode: selectedPaymentMode,
          otp: generatedOtp,
          status: 'Upcoming',
          iconName: 'fitness-center',
          accentColor: AppColors.primaryNavy,
        });

        addBooking(newBooking);
        showToast({
          message: 'Booking Confirmed! Entry pass generated.',
          isSuccess: true,
        });

        navigation.replace('BookingDetails', { booking: newBooking });
      } else {
        const newMembership = new MembershipItem({
          id: generatedId,
          customerId: 'CUST789012',
          gymName: params.gym.name,
          gymLocation: params.gym.location,
          gymImageUrl: params.gym.imageUrl,
          planName: params.plan.name,
          durationDays: params.durationDays,
          amountPaid: params.amount,
          startDate: params.startDate,
          endDate: params.endDate,
          paymentMode: selectedPaymentMode,
          otp: generatedOtp,
          status: 'Active',
          hasPersonalTrainer: params.withTrainer,
          trainerName: params.trainer?.name,
          trainerSpecialty: params.trainer?.specialty,
        });

        addMembership(newMembership);
        showToast({
          message: 'Membership Activated! Digital pass ready.',
          isSuccess: true,
        });

        navigation.replace('MembershipDetails', { membership: newMembership });
      }
    }, 1200);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <SafeAreaView style={{ backgroundColor: colors.card }}>
        <View style={[styles.appBar, { borderColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.appBarTitle, { color: colors.text }]}>Payment Summary</Text>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Order Summary Card */}
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.summaryCardHeading, { color: colors.text }]}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.subtitle }]}>Gym</Text>
            <Text style={[styles.summaryVal, { color: colors.text }]}>{params.gym.name}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.subtitle }]}>Item</Text>
            <Text style={[styles.summaryVal, { color: colors.text }]}>
              {isBooking ? `${params.workoutType} (${params.daysBooked})` : params.plan.name}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.subtitle }]}>Schedule / Validity</Text>
            <Text style={[styles.summaryVal, { color: colors.text }]}>
              {isBooking ? `${params.selectedDate} • ${params.selectedTime}` : `${params.startDate} to ${params.endDate}`}
            </Text>
          </View>

          {params.withTrainer && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.subtitle }]}>Personal Trainer</Text>
              <Text style={[styles.summaryVal, { color: AppColors.accentColor }]}>
                {params.trainer ? params.trainer.name : 'Included'}
              </Text>
            </View>
          )}
        </View>

        {/* Payment Methods */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Payment Mode</Text>

          {PAYMENT_MODES.map((pm) => {
            const isSelected = selectedPaymentMode === pm.id;
            return (
              <TouchableOpacity
                key={pm.id}
                onPress={() => setSelectedPaymentMode(pm.id)}
                activeOpacity={0.85}
                style={[
                  styles.paymentModeCard,
                  {
                    backgroundColor: isSelected
                      ? isDark
                        ? 'rgba(0,56,130,0.15)'
                        : 'rgba(0,56,130,0.05)'
                      : colors.card,
                    borderColor: isSelected ? AppColors.primaryNavy : colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.pmIconBadge,
                    {
                      backgroundColor: isSelected
                        ? 'rgba(0,56,130,0.1)'
                        : isDark
                        ? '#262626'
                        : '#F1F5F9',
                    },
                  ]}
                >
                  <MaterialIcons
                    name={pm.icon}
                    size={22}
                    color={isSelected ? AppColors.primaryNavy : colors.subtitle}
                  />
                </View>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.pmName, { color: colors.text }]}>{pm.name}</Text>
                  <Text style={[styles.pmDesc, { color: colors.subtitle }]}>{pm.desc}</Text>
                </View>

                <View
                  style={[
                    styles.pmRadio,
                    {
                      borderColor: isSelected ? AppColors.primaryNavy : colors.border,
                      backgroundColor: isSelected ? AppColors.primaryNavy : 'transparent',
                    },
                  ]}
                >
                  {isSelected && <MaterialIcons name="check" size={14} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Amount Breakdown */}
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.summaryCardHeading, { color: colors.text }]}>Payment Details</Text>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.subtitle }]}>Subtotal</Text>
            <Text style={[styles.summaryVal, { color: colors.text }]}>
              ₹{params.subtotal ? params.subtotal.toFixed(2) : params.amount.toFixed(2)}
            </Text>
          </View>

          {params.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: AppColors.secondaryColor }]}>
                Discount
              </Text>
              <Text style={[styles.summaryVal, { color: AppColors.secondaryColor }]}>
                -₹{params.discount.toFixed(2)}
              </Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.subtitle }]}>Taxes & GST (18%)</Text>
            <Text style={[styles.summaryVal, { color: colors.text }]}>
              ₹{params.tax ? params.tax.toFixed(2) : (params.amount * 0.18).toFixed(2)}
            </Text>
          </View>

          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />

          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total Amount</Text>
            <Text style={[styles.totalVal, { color: AppColors.secondaryColor }]}>
              ₹{params.amount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Security badge */}
        <View style={styles.securityBadgeRow}>
          <MaterialIcons name="lock" size={14} color="#16A34A" />
          <Text style={styles.securityBadgeText}>256-bit Encrypted & Secure Checkout</Text>
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
          <Text style={[styles.bottomPricePrefix, { color: colors.subtitle }]}>Grand Total</Text>
          <Text style={[styles.bottomPriceVal, { color: colors.text }]}>
            ₹{params.amount.toFixed(0)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handlePayNow}
          style={[styles.payNowBtn, { backgroundColor: AppColors.secondaryColor }]}
          activeOpacity={0.85}
        >
          <Text style={styles.payNowText}>Pay Securely</Text>
          <MaterialIcons name="lock" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>

      {/* Processing Modal */}
      <Modal visible={isProcessing} transparent animationType="fade">
        <View style={styles.processingOverlay}>
          <View
            style={[
              styles.processingCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <ActivityIndicator size="large" color={AppColors.primaryNavy} />
            <Text style={[styles.processingTitle, { color: colors.text }]}>
              Processing Payment...
            </Text>
            <Text style={[styles.processingSub, { color: colors.subtitle }]}>
              Please do not press back or close the app
            </Text>
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
    marginLeft: 12,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  summaryCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  summaryCardHeading: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '700',
    maxWidth: '60%',
    textAlign: 'right',
  },
  sectionBlock: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  paymentModeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  pmIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pmName: {
    fontSize: 14,
    fontWeight: '700',
  },
  pmDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  pmRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerLine: {
    height: 1,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900',
  },
  securityBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  securityBadgeText: {
    color: '#16A34A',
    fontSize: 11.5,
    fontWeight: '700',
    marginLeft: 6,
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
  payNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 16,
  },
  payNowText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  processingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  processingCard: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
  },
  processingTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: 16,
  },
  processingSub: {
    fontSize: 12.5,
    textAlign: 'center',
    marginTop: 6,
  },
});
