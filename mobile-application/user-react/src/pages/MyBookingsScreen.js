import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors } from '../theme/appTheme';
import { useBookingRepository } from '../data/BookingContext';
import { useToast } from '../widgets/CustomScaffoldMessage';

const TABS = ['Upcoming', 'Completed', 'Cancelled'];

const CANCEL_REASONS = [
  'Change of workout plans',
  'Health or medical issue',
  'Booked incorrect date / time slot',
  'Traveling or busy schedule',
  'Other reasons',
];

export const MyBookingsScreen = ({ navigation }) => {
  const { isDark, colors } = useTheme();
  const { bookings, cancelBooking, updateBooking } = useBookingRepository();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('Upcoming');

  // Cancel Modal state
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);

  // Reschedule Modal state
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [selectedBookingForReschedule, setSelectedBookingForReschedule] = useState(null);
  const [newTimeSlot, setNewTimeSlot] = useState('07:00 AM - 08:00 AM');

  const filteredBookings = bookings.filter((b) => b.status === activeTab);

  const handleConfirmCancel = () => {
    if (!selectedBookingForCancel) return;
    cancelBooking(selectedBookingForCancel.id, selectedReason);
    setCancelModalVisible(false);
    showToast({
      message: 'Booking cancelled successfully. Refund initiated.',
    });
  };

  const handleConfirmReschedule = () => {
    if (!selectedBookingForReschedule) return;
    updateBooking({
      ...selectedBookingForReschedule,
      time: newTimeSlot,
    });
    setRescheduleModalVisible(false);
    showToast({
      message: 'Booking rescheduled successfully!',
      isSuccess: true,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Bookings</Text>
        <Text style={[styles.subtitle, { color: colors.subtitle }]}>
          Manage single session & class passes
        </Text>
      </View>

      {/* Segmented Filter Tabs */}
      <View style={styles.tabsWrapper}>
        <View
          style={[
            styles.tabsContainer,
            {
              backgroundColor: isDark ? '#1E1E1E' : '#F1F5F9',
              borderColor: colors.border,
            },
          ]}
        >
          {TABS.map((tab) => {
            const isSelected = activeTab === tab;
            const count = bookings.filter((b) => b.status === tab).length;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.tabItem,
                  {
                    backgroundColor: isSelected
                      ? isDark
                        ? '#262626'
                        : '#FFFFFF'
                      : 'transparent',
                    shadowOpacity: isSelected ? 0.06 : 0,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: isSelected
                        ? isDark
                          ? '#FFFFFF'
                          : AppColors.primaryNavy
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

      {/* Bookings List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="event-busy" size={50} color={colors.subtitle} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No {activeTab} Bookings
            </Text>
            <Text style={[styles.emptySub, { color: colors.subtitle }]}>
              When you book workout sessions, your digital passes will appear here.
            </Text>
          </View>
        ) : (
          filteredBookings.map((booking) => {
            const isUpcoming = booking.status === 'Upcoming';
            return (
              <TouchableOpacity
                key={booking.id}
                onPress={() => navigation.navigate('BookingDetails', { booking })}
                activeOpacity={0.88}
                style={[
                  styles.bookingCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                {/* Header Row */}
                <View style={styles.cardHeaderRow}>
                  <Image
                    source={{ uri: booking.gymImageUrl }}
                    style={styles.gymThumb}
                    resizeMode="cover"
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={styles.cardHeaderTop}>
                      <Text style={[styles.cardGymName, { color: colors.text }]} numberOfLines={1}>
                        {booking.gymName}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor:
                              booking.status === 'Upcoming'
                                ? '#E6F7EF'
                                : booking.status === 'Completed'
                                ? isDark
                                  ? '#262626'
                                  : '#F1F5F9'
                                : '#FEE2E2',
                            borderColor:
                              booking.status === 'Upcoming'
                                ? '#B7EAD0'
                                : booking.status === 'Completed'
                                ? colors.border
                                : '#FCA5A5',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            {
                              color:
                                booking.status === 'Upcoming'
                                  ? '#047857'
                                  : booking.status === 'Completed'
                                  ? colors.subtitle
                                  : '#EF4444',
                            },
                          ]}
                        >
                          {booking.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <Text style={[styles.cardTypeSub, { color: AppColors.primaryNavy }]}>
                      {booking.sessionSubtitle}
                    </Text>
                  </View>
                </View>

                {/* Date & Time Strip */}
                <View
                  style={[
                    styles.cardDateStrip,
                    {
                      backgroundColor: isDark ? '#262626' : '#F8FAFC',
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.dateCol}>
                    <Text style={[styles.dateColLabel, { color: colors.subtitle }]}>DATE</Text>
                    <Text style={[styles.dateColVal, { color: colors.text }]}>
                      {booking.date}
                    </Text>
                  </View>
                  <View style={[styles.stripDivider, { backgroundColor: colors.border }]} />
                  <View style={styles.dateCol}>
                    <Text style={[styles.dateColLabel, { color: colors.subtitle }]}>TIME</Text>
                    <Text style={[styles.dateColVal, { color: colors.text }]}>
                      {booking.time}
                    </Text>
                  </View>
                </View>

                {/* OTP & Action Strip */}
                <View style={styles.cardBottomActions}>
                  <View style={styles.otpPill}>
                    <Text style={[styles.otpPrefix, { color: colors.subtitle }]}>OTP: </Text>
                    <Text style={[styles.otpCode, { color: AppColors.primaryNavy }]}>
                      {booking.otp}
                    </Text>
                  </View>

                  <View style={styles.cardButtonsRow}>
                    {isUpcoming && (
                      <>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedBookingForReschedule(booking);
                            setRescheduleModalVisible(true);
                          }}
                          style={[styles.rescheduleBtn, { borderColor: colors.border }]}
                        >
                          <Text style={[styles.rescheduleBtnText, { color: colors.text }]}>
                            Reschedule
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            setSelectedBookingForCancel(booking);
                            setCancelModalVisible(true);
                          }}
                          style={styles.cancelLinkBtn}
                        >
                          <Text style={styles.cancelLinkText}>Cancel</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    <TouchableOpacity
                      onPress={() => navigation.navigate('BookingDetails', { booking })}
                      style={[
                        styles.viewPassBtn,
                        { backgroundColor: AppColors.primaryNavy },
                      ]}
                    >
                      <MaterialIcons name="qr-code" size={16} color="#FFFFFF" />
                      <Text style={styles.viewPassText}>Digital Pass</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Cancel Booking Modal */}
      <Modal visible={cancelModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>Cancel Booking</Text>
            <Text style={[styles.modalSub, { color: colors.subtitle }]}>
              Please select a cancellation reason for your refund processing:
            </Text>

            {CANCEL_REASONS.map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => setSelectedReason(r)}
                style={styles.reasonOption}
              >
                <View
                  style={[
                    styles.radioCircle,
                    {
                      borderColor: selectedReason === r ? AppColors.primaryNavy : colors.border,
                      backgroundColor: selectedReason === r ? AppColors.primaryNavy : 'transparent',
                    },
                  ]}
                >
                  {selectedReason === r && (
                    <MaterialIcons name="check" size={12} color="#FFFFFF" />
                  )}
                </View>
                <Text style={[styles.reasonText, { color: colors.text }]}>{r}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                onPress={() => setCancelModalVisible(false)}
                style={[styles.modalBackBtn, { borderColor: colors.border }]}
              >
                <Text style={{ color: colors.text, fontWeight: '700' }}>Keep Booking</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmCancel}
                style={[styles.modalConfirmBtn, { backgroundColor: '#EF4444' }]}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>Confirm Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reschedule Booking Modal */}
      <Modal visible={rescheduleModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>Reschedule Session</Text>
            <Text style={[styles.modalSub, { color: colors.subtitle }]}>
              Choose a new available time slot:
            </Text>

            {['06:00 AM - 07:00 AM', '07:00 AM - 08:00 AM', '05:00 PM - 06:00 PM', '06:00 PM - 07:00 PM'].map((slot) => (
              <TouchableOpacity
                key={slot}
                onPress={() => setNewTimeSlot(slot)}
                style={styles.reasonOption}
              >
                <View
                  style={[
                    styles.radioCircle,
                    {
                      borderColor: newTimeSlot === slot ? AppColors.primaryNavy : colors.border,
                      backgroundColor: newTimeSlot === slot ? AppColors.primaryNavy : 'transparent',
                    },
                  ]}
                >
                  {newTimeSlot === slot && (
                    <MaterialIcons name="check" size={12} color="#FFFFFF" />
                  )}
                </View>
                <Text style={[styles.reasonText, { color: colors.text }]}>{slot}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                onPress={() => setRescheduleModalVisible(false)}
                style={[styles.modalBackBtn, { borderColor: colors.border }]}
              >
                <Text style={{ color: colors.text, fontWeight: '700' }}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmReschedule}
                style={[styles.modalConfirmBtn, { backgroundColor: AppColors.secondaryColor }]}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>Confirm Reschedule</Text>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12.5,
    marginTop: 2,
  },
  tabsWrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 3,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 11,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  tabText: {
    fontSize: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 95,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  bookingCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gymThumb: {
    width: 48,
    height: 48,
    borderRadius: 14,
  },
  cardHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardGymName: {
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 0.8,
  },
  statusText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  cardTypeSub: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },
  cardDateStrip: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  dateCol: {
    flex: 1,
  },
  dateColLabel: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  dateColVal: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 1,
  },
  stripDivider: {
    width: 1,
    height: 20,
    marginHorizontal: 8,
  },
  cardBottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 0.8,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  otpPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  otpPrefix: {
    fontSize: 11,
    fontWeight: '700',
  },
  otpCode: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  cardButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rescheduleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 8,
  },
  rescheduleBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cancelLinkBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 8,
  },
  cancelLinkText: {
    color: '#EF4444',
    fontSize: 11.5,
    fontWeight: '700',
  },
  viewPassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  viewPassText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalSub: {
    fontSize: 12.5,
    marginTop: 4,
    marginBottom: 16,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  reasonText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  modalActionsRow: {
    flexDirection: 'row',
    marginTop: 18,
  },
  modalBackBtn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  modalConfirmBtn: {
    flex: 1.3,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
