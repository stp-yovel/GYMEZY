import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors } from '../theme/appTheme';
import { DigitalQrPassCard } from '../widgets/DigitalQrPassCard';
import { useBookingRepository } from '../data/BookingContext';
import { useToast } from '../widgets/CustomScaffoldMessage';

export const BookingDetailsScreen = ({ route, navigation }) => {
  const { booking: initialBooking } = route.params;
  const { isDark, colors } = useTheme();
  const { bookings, cancelBooking } = useBookingRepository();
  const { showToast } = useToast();

  // Find live item from repository to reflect real-time updates
  const booking = bookings.find((b) => b.id === initialBooking.id) || initialBooking;
  const isUpcoming = booking.status === 'Upcoming';

  const handleSharePass = async () => {
    try {
      await Share.share({
        message: `GYMEZY Entry Pass\nGym: ${booking.gymName}\nPass ID: ${booking.id}\nOTP: ${booking.otp}\nDate: ${booking.date}`,
      });
    } catch (e) {
      // ignore
    }
  };

  const handleCancelPass = () => {
    cancelBooking(booking.id, 'Cancelled from pass details');
    showToast({
      message: 'Booking pass cancelled successfully.',
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
          <Text style={[styles.appBarTitle, { color: colors.text }]}>Digital Entry Pass</Text>
          <TouchableOpacity onPress={handleSharePass} style={styles.shareBtn}>
            <MaterialIcons name="share" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Full Digital Entry QR Pass Card */}
        <DigitalQrPassCard
          passId={booking.id}
          customerId={booking.customerId}
          otp={booking.otp}
          gymName={booking.gymName}
          subtitle={booking.sessionSubtitle}
          primaryDateLabel="DATE"
          primaryDateValue={booking.date}
          secondaryDateLabel="TIME"
          secondaryDateValue={booking.time}
          status={booking.status}
          iconName="fitness-center"
          accentColor={AppColors.primaryNavy}
        />

        {/* Booking Details Card */}
        <View
          style={[
            styles.detailsCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.detailsHeading, { color: colors.text }]}>Booking Details</Text>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Status</Text>
            <Text style={[styles.detailValue, { color: booking.status === 'Upcoming' ? '#047857' : colors.text }]}>
              {booking.status}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Amount Paid</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              ₹{booking.amountPaid.toFixed(2)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Payment Mode</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {booking.paymentMode}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Session Type</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{booking.type}</Text>
          </View>

          {booking.cancellationReason && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: '#EF4444' }]}>Cancellation Reason</Text>
              <Text style={[styles.detailValue, { color: '#EF4444' }]}>
                {booking.cancellationReason}
              </Text>
            </View>
          )}
        </View>

        {/* Location / Instructions */}
        <View
          style={[
            styles.detailsCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.detailsHeading, { color: colors.text }]}>Gym Reception Details</Text>
          <Text style={[styles.instructionText, { color: colors.subtitle }]}>
            Present this QR pass code or the 6-digit Entry OTP to the reception desk upon arrival. Lockers and showers are available for check-in members.
          </Text>
        </View>

        {/* Cancel Action if Upcoming */}
        {isUpcoming && (
          <TouchableOpacity
            onPress={handleCancelPass}
            style={styles.cancelPassBtn}
            activeOpacity={0.8}
          >
            <MaterialIcons name="cancel" size={18} color="#EF4444" style={{ marginRight: 6 }} />
            <Text style={styles.cancelPassText}>Cancel This Booking</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  shareBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  detailsCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginTop: 16,
  },
  detailsHeading: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  instructionText: {
    fontSize: 13,
    lineHeight: 19,
  },
  cancelPassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 20,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#EF4444',
  },
  cancelPassText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '800',
  },
});
