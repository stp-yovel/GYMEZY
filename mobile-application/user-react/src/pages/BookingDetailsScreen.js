import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors, AppTheme } from '../theme/appTheme';
import { MonthlyGridCalendar } from '../widgets/CustomCalendar';
import { DigitalQrPassCard } from '../widgets/DigitalQrPassCard';
import { useBookingRepository } from '../data/BookingContext';
import { useToast } from '../widgets/CustomScaffoldMessage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TIME_SLOTS = [
  '6:00 AM - 7:00 AM',
  '7:00 AM - 8:00 AM',
  '8:00 AM - 9:00 AM',
  '9:00 AM - 10:00 AM',
  '5:00 PM - 6:00 PM',
  '6:00 PM - 7:00 PM',
  '7:00 PM - 8:00 PM',
  '8:00 PM - 9:00 PM',
];

const CANCEL_REASONS = [
  'Change of plans / Schedule conflict',
  'Feeling unwell / Medical reasons',
  'Booked the wrong date or time',
  'Booked wrong gym location',
  'Personal emergency',
  'Other',
];

export const BookingDetailsScreen = ({ route, navigation }) => {
  const { booking: initialBooking } = route.params;
  const { isDark, colors } = useTheme();
  const { bookings, updateBooking, cancelBooking } = useBookingRepository();
  const { showToast } = useToast();

  const booking = bookings.find((b) => b.id === initialBooking.id) || initialBooking;
  const isPassVisible =
    booking.status === 'Active' ||
    booking.status === 'Upcoming' ||
    booking.status === 'Confirmed';
  const isActionable = isPassVisible;

  // Modals state
  const [showFullscreenQr, setShowFullscreenQr] = useState(false);
  const [showModifySheet, setShowModifySheet] = useState(false);
  const [showCancelSheet, setShowCancelSheet] = useState(false);

  // Modify Booking Sheet State
  const [modifyDate, setModifyDate] = useState(new Date(Date.now() + 86400000));
  const [modifyTime, setModifyTime] = useState(booking.time);

  // Cancel Booking Sheet State
  const [cancelReason, setCancelReason] = useState(CANCEL_REASONS[0]);

  const copyToClipboard = async (text, label) => {
    await Clipboard.setStringAsync(text);
    showToast({
      message: `${label} copied to clipboard`,
      isSuccess: true,
    });
  };

  const handleUpdateBooking = () => {
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayName = weekdays[modifyDate.getDay() === 0 ? 6 : modifyDate.getDay() - 1];
    const monthName = months[modifyDate.getMonth()];
    const formattedDate = `${dayName}, ${modifyDate.getDate()} ${monthName} ${modifyDate.getFullYear()}`;

    const updated = {
      ...booking,
      date: formattedDate,
      time: modifyTime,
    };
    updateBooking(updated);
    setShowModifySheet(false);
    showToast({
      message: `Booking rescheduled to ${formattedDate} at ${modifyTime}`,
      isSuccess: true,
    });
  };

  const handleConfirmCancel = () => {
    cancelBooking(booking.id, cancelReason);
    setShowCancelSheet(false);
    showToast({
      message: `Booking cancelled. Refund of ₹${Math.round(booking.amountPaid)} initiated to UPI.`,
      isSuccess: true,
    });
  };

  const getStatusColors = (status) => {
    if (status === 'Active') {
      return { text: '#00BF62', bg: 'rgba(0, 191, 98, 0.12)' };
    } else if (status === 'Confirmed' || status === 'Upcoming') {
      return { text: '#D97706', bg: 'rgba(217, 119, 6, 0.12)' };
    } else if (status === 'Completed') {
      return { text: '#60A5FA', bg: 'rgba(96, 165, 250, 0.12)' };
    } else {
      return { text: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)' };
    }
  };

  const statusColors = getStatusColors(booking.status);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top App Bar */}
      <SafeAreaView style={{ backgroundColor: colors.background }}>
        <View style={styles.appBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back-ios" size={18} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.appBarTitle, { color: colors.text }]}>Digital Entry Pass</Text>

          <TouchableOpacity
            onPress={() => setShowFullscreenQr(true)}
            style={styles.fullscreenBtn}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="fullscreen"
              size={26}
              color={isDark ? '#93C5FD' : AppColors.primaryColor}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Digital Entry Pass Card */}
        {isPassVisible && (
          <View style={{ marginBottom: 18 }}>
            <DigitalQrPassCard
              passId={booking.id}
              customerId={booking.customerId}
              otp={booking.otp}
              gymName={booking.gymName}
              subtitle={booking.sessionSubtitle}
              primaryDateLabel="BATCH DATES"
              primaryDateValue={booking.date}
              secondaryDateLabel="TIME SLOT"
              secondaryDateValue={booking.time}
              status={booking.status}
              iconName="fitness-center"
              accentColor={isDark ? '#93C5FD' : AppColors.primaryColor}
              qrValue={booking.qrCodeData || booking.rawBackendBooking?.qrCodeData}
              passType="BOOKING"
            />
          </View>
        )}

        {/* Cancelled Banner */}
        {booking.status === 'Cancelled' && (
          <View
            style={[
              styles.cancelledBanner,
              {
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
              },
            ]}
          >
            <MaterialIcons name="cancel" size={28} color="#EF4444" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cancelledBannerTitle}>This Booking Has Been Cancelled</Text>
              <Text style={[styles.cancelledBannerSub, { color: colors.subtitle }]}>
                Reason: {booking.cancellationReason || 'User Requested'}
              </Text>
            </View>
          </View>
        )}

        {/* 2. Detailed Receipt Information Table */}
        <Text style={[styles.summaryHeader, { color: colors.text }]}>Booking Summary</Text>

        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Booking ID */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Booking ID</Text>
            <TouchableOpacity
              onPress={() => copyToClipboard(booking.id, 'Booking ID')}
              style={styles.copyValueRow}
              activeOpacity={0.7}
            >
              <Text style={[styles.detailValue, { color: colors.text }]}>{booking.id}</Text>
              <MaterialIcons
                name="content-copy"
                size={14}
                color={AppColors.secondaryColor}
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Customer ID */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Customer ID</Text>
            <TouchableOpacity
              onPress={() => copyToClipboard(booking.customerId, 'Customer ID')}
              style={styles.copyValueRow}
              activeOpacity={0.7}
            >
              <Text style={[styles.detailValue, { color: colors.text }]}>{booking.customerId}</Text>
              <MaterialIcons
                name="content-copy"
                size={14}
                color={AppColors.secondaryColor}
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Gym / Class */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Gym / Class</Text>
            <Text style={[styles.detailValue, { color: colors.text, fontWeight: '700' }]}>
              {booking.gymName}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Session Type */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Session Type</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {booking.sessionSubtitle || booking.type}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Date */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Date</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{booking.date}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Time */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Time</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{booking.time}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Days Booked */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Days Booked</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{booking.daysBooked}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Amount Paid */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Amount Paid</Text>
            <Text
              style={[
                styles.detailValue,
                {
                  color: AppColors.secondaryColor,
                  fontWeight: '800',
                  fontSize: 15,
                },
              ]}
            >
              ₹{Math.round(booking.amountPaid)}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Payment Mode */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Payment Mode</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {booking.paymentMode}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Booking Status */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Booking Status</Text>
            <View
              style={[
                styles.statusPill,
                { backgroundColor: statusColors.bg },
              ]}
            >
              <Text style={[styles.statusPillText, { color: statusColors.text }]}>
                {booking.status === 'Upcoming' ? 'Confirmed' : booking.status}
              </Text>
            </View>
          </View>
        </View>

        {/* 3. Action Buttons (Modify & Cancel) */}
        {isActionable && (
          <View style={styles.actionsRow}>
            {/* Modify Booking Button */}
            <TouchableOpacity
              onPress={() => setShowModifySheet(true)}
              style={[
                styles.actionBtn,
                {
                  borderColor: isDark ? '#93C5FD' : AppColors.primaryColor,
                },
              ]}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="edit-calendar"
                size={16}
                color={isDark ? '#93C5FD' : AppColors.primaryColor}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.actionBtnText,
                  { color: isDark ? '#93C5FD' : AppColors.primaryColor },
                ]}
              >
                Modify Booking
              </Text>
            </TouchableOpacity>

            {/* Cancel Booking Button */}
            <TouchableOpacity
              onPress={() => setShowCancelSheet(true)}
              style={[
                styles.actionBtn,
                {
                  borderColor: 'rgba(239, 68, 68, 0.6)',
                  marginLeft: 12,
                },
              ]}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="delete-outline"
                size={16}
                color="#EF4444"
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Cancel Booking</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* ========================================== */}
      {/* FULLSCREEN QR PASS MODAL                   */}
      {/* ========================================== */}
      <Modal
        visible={showFullscreenQr}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFullscreenQr(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.fullscreenQrCard}>
            {/* Header */}
            <View style={styles.fullscreenHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fullscreenGymName}>{booking.gymName}</Text>
                <Text style={styles.fullscreenPassId}>Pass ID: {booking.id}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowFullscreenQr(false)}
                style={styles.fullscreenCloseBtn}
              >
                <MaterialIcons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Dot-matrix style large QR Canvas */}
            <View style={styles.largeQrWrapper}>
              <QRCode
                value={
                  booking.qrCodeData ||
                  booking.rawBackendBooking?.qrCodeData ||
                  JSON.stringify({
                    type: 'BOOKING',
                    id: booking.id,
                    bookingId: booking.id,
                    customerId: booking.customerId,
                    entryOtp: booking.otp,
                  })
                }
                size={230}
                color="#0F172A"
                backgroundColor="#FFFFFF"
              />
              {/* Centered GymEzy Logo Overlay */}
              <View style={styles.qrLogoOverlay}>
                <Image
                  source={require('../../assets/logo/gymezy.png')}
                  style={styles.qrLogoImage}
                  resizeMode="contain"
                />
              </View>
            </View>

            <Text style={styles.fullscreenHint}>Present this screen to the gym scanner</Text>
          </View>
        </View>
      </Modal>

      {/* ========================================== */}
      {/* MODIFY BOOKING MODAL SHEET                 */}
      {/* ========================================== */}
      <Modal
        visible={showModifySheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModifySheet(false)}
      >
        <View style={styles.sheetBackdrop}>
          <View
            style={[
              styles.sheetContainer,
              { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' },
            ]}
          >
            {/* Sheet Header */}
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.text }]}>Modify Booking</Text>
              <TouchableOpacity onPress={() => setShowModifySheet(false)}>
                <MaterialIcons name="close" size={24} color={colors.subtitle} />
              </TouchableOpacity>
            </View>

            {/* Current Booking Info Card */}
            <View
              style={[
                styles.currentBookingCard,
                {
                  backgroundColor: isDark ? '#262626' : '#F8FAFC',
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.bookingIconBox}>
                <MaterialIcons name="fitness-center" size={20} color={AppColors.secondaryColor} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.bookingGymTitle, { color: colors.text }]}>
                  {booking.gymName}
                </Text>
                <Text style={[styles.bookingSubtitle, { color: colors.subtitle }]}>
                  {booking.sessionSubtitle}
                </Text>
                <Text style={styles.bookingDateTime}>
                  {booking.date} • {booking.time}
                </Text>
              </View>
            </View>

            {/* Month Grid Calendar Selector */}
            <View style={{ marginTop: 14 }}>
              <MonthlyGridCalendar
                selectedDate={modifyDate}
                minDate={new Date(Date.now() + 86400000)}
                maxMonthsAhead={3}
                wrapInCard={true}
                showMonthHeader={true}
                onDateSelected={(date) => setModifyDate(date)}
              />
            </View>

            {/* Time Slot Picker */}
            <Text style={[styles.slotSectionTitle, { color: colors.text }]}>
              Select Time Slot
            </Text>
            <View style={styles.timeSlotsWrap}>
              {TIME_SLOTS.map((slot) => {
                const isSelected = modifyTime === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    onPress={() => setModifyTime(slot)}
                    style={[
                      styles.slotChip,
                      {
                        backgroundColor: isSelected
                          ? AppColors.primaryColor
                          : isDark
                          ? '#262626'
                          : '#F1F5F9',
                        borderColor: isSelected ? AppColors.primaryColor : colors.border,
                      },
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.slotChipText,
                        {
                          color: isSelected ? '#FFFFFF' : colors.text,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Update Booking CTA */}
            <TouchableOpacity
              onPress={handleUpdateBooking}
              style={[
                styles.sheetPrimaryBtn,
                { backgroundColor: AppColors.secondaryColor },
              ]}
              activeOpacity={0.85}
            >
              <Text style={styles.sheetPrimaryBtnText}>Update Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================== */}
      {/* CANCEL BOOKING MODAL SHEET                 */}
      {/* ========================================== */}
      <Modal
        visible={showCancelSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCancelSheet(false)}
      >
        <View style={styles.sheetBackdrop}>
          <View
            style={[
              styles.sheetContainer,
              { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' },
            ]}
          >
            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.text }]}>Cancel Booking</Text>
              <TouchableOpacity onPress={() => setShowCancelSheet(false)}>
                <MaterialIcons name="close" size={24} color={colors.subtitle} />
              </TouchableOpacity>
            </View>

            {/* Booking Preview Box */}
            <View
              style={[
                styles.currentBookingCard,
                {
                  backgroundColor: isDark ? '#262626' : '#F8FAFC',
                  borderColor: colors.border,
                  flexDirection: 'column',
                  alignItems: 'stretch',
                },
              ]}
            >
              <View style={styles.previewTopRow}>
                <Text style={[styles.previewLabel, { color: colors.subtitle }]}>Booking ID</Text>
                <Text style={styles.previewId}>{booking.id}</Text>
              </View>
              <Text style={[styles.previewGymName, { color: colors.text }]}>
                {booking.gymName}
              </Text>
              <Text style={[styles.previewSub, { color: colors.subtitle }]}>
                {booking.sessionSubtitle} • {booking.date}
              </Text>
              <Text style={[styles.previewAmount, { color: colors.text }]}>
                ₹{Math.round(booking.amountPaid)} Paid via {booking.paymentMode}
              </Text>
            </View>

            {/* Reason Selector */}
            <Text style={[styles.reasonTitle, { color: colors.text }]}>
              Reason for Cancellation (Optional)
            </Text>
            <View style={styles.reasonsList}>
              {CANCEL_REASONS.map((r) => {
                const isSelected = cancelReason === r;
                return (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setCancelReason(r)}
                    style={styles.reasonRadioRow}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name={isSelected ? 'radio-button-checked' : 'radio-button-unchecked'}
                      size={20}
                      color={isSelected ? '#EF4444' : colors.subtitle}
                    />
                    <Text
                      style={[
                        styles.reasonRadioText,
                        {
                          color: colors.text,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {r}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Policy Box */}
            <View style={styles.policyNoticeBox}>
              <MaterialIcons name="info-outline" size={18} color="#D97706" />
              <Text style={styles.policyNoticeText}>
                Note: Cancelling within 2 hours of the session start time may not be eligible for a full refund as per gym policy.
              </Text>
            </View>

            {/* Confirm Cancel Button */}
            <TouchableOpacity
              onPress={handleConfirmCancel}
              style={[styles.sheetPrimaryBtn, { backgroundColor: '#EF4444' }]}
              activeOpacity={0.85}
            >
              <Text style={styles.sheetPrimaryBtnText}>Confirm Cancellation</Text>
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
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  fullscreenBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
  },
  cancelledBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 18,
  },
  cancelledBannerTitle: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '800',
  },
  cancelledBannerSub: {
    fontSize: 12,
    marginTop: 4,
  },
  summaryHeader: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  summaryCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  copyValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 0.8,
    marginVertical: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 24,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.2,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },

  /* Fullscreen QR Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fullscreenQrCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
  },
  fullscreenHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 18,
  },
  fullscreenGymName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  fullscreenPassId: {
    fontSize: 12,
    fontWeight: '800',
    color: AppColors.secondaryColor,
    marginTop: 2,
  },
  fullscreenCloseBtn: {
    padding: 4,
  },
  largeQrWrapper: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  qrLogoOverlay: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#01327E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  qrLogoImage: {
    width: '100%',
    height: '100%',
    tintColor: '#01327E',
  },
  fullscreenHint: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginTop: 18,
  },

  /* Sheets */
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '90%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  currentBookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  bookingIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 56, 130, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingGymTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  bookingSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  bookingDateTime: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.secondaryColor,
    marginTop: 2,
  },
  slotSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 16,
    marginBottom: 10,
  },
  timeSlotsWrap: {
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
  sheetPrimaryBtn: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  sheetPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  /* Cancel Sheet Specifics */
  previewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  previewLabel: {
    fontSize: 11,
  },
  previewId: {
    fontSize: 11,
    fontWeight: '800',
    color: AppColors.secondaryColor,
  },
  previewGymName: {
    fontSize: 13,
    fontWeight: '800',
  },
  previewSub: {
    fontSize: 11,
    marginTop: 2,
  },
  previewAmount: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
  reasonTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 16,
    marginBottom: 8,
  },
  reasonsList: {
    marginVertical: 4,
  },
  reasonRadioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
  },
  reasonRadioText: {
    fontSize: 13,
    marginLeft: 10,
  },
  policyNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  policyNoticeText: {
    flex: 1,
    fontSize: 11,
    color: '#B45309',
    lineHeight: 15,
    marginLeft: 8,
  },
});
