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
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors, AppTheme } from '../theme/appTheme';
import { DigitalQrPassCard } from '../widgets/DigitalQrPassCard';
import { useBookingRepository } from '../data/BookingContext';
import { useToast } from '../widgets/CustomScaffoldMessage';

const CANCEL_REASONS = [
  'Relocating / Moving away',
  'Medical reasons / Injury',
  'Financial constraints',
  'Dissatisfied with facilities',
  'Other',
];

export const MembershipDetailsScreen = ({ route, navigation }) => {
  const { membership: initialMbr } = route.params;
  const { isDark, colors } = useTheme();
  const { memberships, cancelMembership } = useBookingRepository();
  const { showToast } = useToast();

  const membership =
    memberships.find((m) => m.id === initialMbr.id) || initialMbr;

  const [showCancelSheet, setShowCancelSheet] = useState(false);
  const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);

  const primaryNavy = isDark ? '#93C5FD' : AppColors.primaryColor;

  const copyToClipboard = async (text, label) => {
    await Clipboard.setStringAsync(text);
    showToast({
      message: `${label} copied to clipboard`,
      isSuccess: true,
    });
  };

  const openUpgradeFlow = () => {
    const gymObj = membership.gym || {
      name: membership.gymName,
      location: membership.gymLocation,
      imageUrl: membership.gymImageUrl,
    };
    navigation.navigate('BuyMembership', { gym: gymObj });
  };

  const handleConfirmCancel = () => {
    cancelMembership(membership.id, selectedReason);
    setShowCancelSheet(false);
    showToast({
      message: 'Cancellation request submitted successfully',
      isSuccess: true,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* App Bar */}
      <SafeAreaView style={{ backgroundColor: colors.background }}>
        <View style={styles.appBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back-ios" size={18} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.appBarTitle, { color: colors.text }]}>Membership Details</Text>

          <TouchableOpacity style={styles.moreBtn} activeOpacity={0.7}>
            <MaterialIcons name="more-vert" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Gym Profile Card with Logo & Name */}
        <View
          style={[
            styles.gymProfileCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.gymImageBox,
              {
                backgroundColor: isDark ? '#262626' : 'rgba(0, 56, 130, 0.08)',
                borderColor: colors.border,
              },
            ]}
          >
            {membership.gymImageUrl ? (
              <Image
                source={{ uri: membership.gymImageUrl }}
                style={styles.gymImage}
                resizeMode="cover"
              />
            ) : (
              <MaterialIcons name="fitness-center" size={28} color={AppColors.primaryColor} />
            )}
          </View>

          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[styles.gymNameText, { color: colors.text }]}>
              {membership.gymName}
            </Text>
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.planBadge,
                  {
                    backgroundColor: isDark ? 'rgba(30, 58, 138, 0.6)' : AppColors.primaryColor,
                    borderColor: isDark ? 'rgba(59, 130, 246, 0.4)' : undefined,
                    borderWidth: isDark ? 1 : 0,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.planBadgeText,
                    { color: isDark ? '#93C5FD' : '#FFFFFF' },
                  ]}
                >
                  {membership.planName}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      membership.status === 'Active'
                        ? '#E6F7EF'
                        : isDark
                        ? '#262626'
                        : '#F1F5F9',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    {
                      color:
                        membership.status === 'Active' ? '#16A34A' : colors.subtitle,
                    },
                  ]}
                >
                  {membership.status}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 2. Membership Details Key-Value List Card */}
        <View
          style={[
            styles.detailsCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Membership ID */}
          <View style={styles.detailRow}>
            <View style={styles.labelRow}>
              <MaterialIcons
                name="person-outline"
                size={18}
                color={colors.subtitle}
                style={{ marginRight: 10 }}
              />
              <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Membership ID</Text>
            </View>
            <TouchableOpacity
              onPress={() => copyToClipboard(membership.id, 'Membership ID')}
              style={styles.copyIdRow}
              activeOpacity={0.7}
            >
              <Text style={[styles.idValueText, { color: primaryNavy }]}>{membership.id}</Text>
              <MaterialIcons
                name="content-copy"
                size={14}
                color={primaryNavy}
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Start Date */}
          <View style={styles.detailRow}>
            <View style={styles.labelRow}>
              <MaterialIcons
                name="calendar-today"
                size={17}
                color={colors.subtitle}
                style={{ marginRight: 10 }}
              />
              <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Start Date</Text>
            </View>
            <Text style={[styles.detailValue, { color: colors.text }]}>{membership.startDate}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* End Date */}
          <View style={styles.detailRow}>
            <View style={styles.labelRow}>
              <MaterialIcons
                name="event-available"
                size={18}
                color={colors.subtitle}
                style={{ marginRight: 10 }}
              />
              <Text style={[styles.detailLabel, { color: colors.subtitle }]}>End Date</Text>
            </View>
            <Text style={[styles.detailValue, { color: colors.text }]}>{membership.endDate}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Days Remaining */}
          <View style={styles.detailRow}>
            <View style={styles.labelRow}>
              <MaterialIcons
                name="access-time"
                size={18}
                color={colors.subtitle}
                style={{ marginRight: 10 }}
              />
              <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Days Remaining</Text>
            </View>
            <Text style={[styles.detailValue, { color: '#16A34A', fontWeight: '900' }]}>
              {membership.durationDays}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Personal Trainer */}
          <View style={styles.detailRow}>
            <View style={styles.labelRow}>
              <MaterialIcons
                name="sports"
                size={18}
                color={colors.subtitle}
                style={{ marginRight: 10 }}
              />
              <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Personal Trainer</Text>
            </View>
            <Text
              style={[
                styles.detailValue,
                {
                  color: membership.hasPersonalTrainer ? colors.text : '#EF4444',
                },
              ]}
            >
              {membership.hasPersonalTrainer
                ? membership.trainerName || 'Assigned'
                : 'Not Selected'}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Amount Paid */}
          <View style={styles.detailRow}>
            <View style={styles.labelRow}>
              <MaterialIcons
                name="payments"
                size={18}
                color={colors.subtitle}
                style={{ marginRight: 10 }}
              />
              <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Amount Paid</Text>
            </View>
            <Text style={[styles.detailValue, { color: colors.text, fontWeight: '800' }]}>
              ₹{Math.round(membership.amountPaid)}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Payment Method */}
          <View style={styles.detailRow}>
            <View style={styles.labelRow}>
              <MaterialIcons
                name="account-balance-wallet"
                size={18}
                color={colors.subtitle}
                style={{ marginRight: 10 }}
              />
              <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Payment Method</Text>
            </View>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {membership.paymentMode}
            </Text>
          </View>
        </View>

        {/* 3. Info Notice Banner */}
        <View
          style={[
            styles.infoBanner,
            {
              backgroundColor: 'rgba(0, 56, 130, 0.07)',
              borderColor: 'rgba(0, 56, 130, 0.2)',
            },
          ]}
        >
          <MaterialIcons name="info-outline" size={20} color={AppColors.primaryColor} />
          <Text
            style={[
              styles.infoBannerText,
              { color: isDark ? '#E2E8F0' : AppColors.primaryColor },
            ]}
          >
            Enjoy unlimited access to all gym facilities during your membership period.
          </Text>
        </View>

        {/* 4. Digital Entry Pass QR & OTP */}
        <View style={{ marginTop: 20 }}>
          <DigitalQrPassCard
            passId={membership.id}
            customerId={membership.customerId}
            otp={membership.otp}
            gymName={membership.gymName}
            subtitle={membership.planName}
            primaryDateLabel="VALID FROM"
            primaryDateValue={membership.startDate}
            secondaryDateLabel="EXPIRES ON"
            secondaryDateValue={membership.endDate}
            status={membership.status}
            iconName="workspace-premium"
            accentColor={primaryNavy}
          />
        </View>

        {/* 5. Actions: Upgrade Membership & Cancel Membership */}
        {membership.status === 'Active' && (
          <View style={{ marginTop: 24 }}>
            {/* Upgrade Membership */}
            <TouchableOpacity
              onPress={openUpgradeFlow}
              style={[
                styles.actionOutlineBtn,
                { borderColor: primaryNavy },
              ]}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="arrow-circle-up"
                size={20}
                color={primaryNavy}
                style={{ marginRight: 8 }}
              />
              <Text style={[styles.actionOutlineText, { color: primaryNavy }]}>
                Upgrade Membership
              </Text>
            </TouchableOpacity>

            {/* Request Cancel Membership */}
            <TouchableOpacity
              onPress={() => setShowCancelSheet(true)}
              style={[
                styles.actionOutlineBtn,
                {
                  borderColor: 'rgba(248, 113, 113, 0.6)',
                  marginTop: 12,
                },
              ]}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="cancel"
                size={20}
                color="#F87171"
                style={{ marginRight: 8 }}
              />
              <Text style={[styles.actionOutlineText, { color: '#F87171' }]}>
                Request to Cancel Membership
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* ========================================== */}
      {/* CANCEL MEMBERSHIP BOTTOM SHEET             */}
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
              <Text style={[styles.sheetTitle, { color: colors.text }]}>Cancel Membership</Text>
              <TouchableOpacity onPress={() => setShowCancelSheet(false)}>
                <MaterialIcons name="close" size={24} color={colors.subtitle} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.sheetDescription, { color: colors.subtitle }]}>
              Please select a reason for cancellation. Note that cancellation requests are subject to gym refund policies.
            </Text>

            {/* Reason Radio List */}
            <View style={styles.reasonsList}>
              {CANCEL_REASONS.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <TouchableOpacity
                    key={reason}
                    onPress={() => setSelectedReason(reason)}
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
                      {reason}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Action Buttons: Keep vs Confirm Cancel */}
            <View style={styles.cancelSheetActionsRow}>
              <TouchableOpacity
                onPress={() => setShowCancelSheet(false)}
                style={[
                  styles.cancelModalBtn,
                  {
                    borderColor: colors.border,
                    borderWidth: 1,
                  },
                ]}
                activeOpacity={0.8}
              >
                <Text style={[styles.cancelModalBtnText, { color: colors.text }]}>
                  Keep Membership
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmCancel}
                style={[
                  styles.cancelModalBtn,
                  {
                    backgroundColor: '#EF4444',
                    marginLeft: 12,
                  },
                ]}
                activeOpacity={0.85}
              >
                <Text style={[styles.cancelModalBtnText, { color: '#FFFFFF' }]}>
                  Confirm Cancel
                </Text>
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
  moreBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  gymProfileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 24,
    borderWidth: 1.2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  gymImageBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gymImage: {
    width: '100%',
    height: '100%',
  },
  gymNameText: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  planBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  planBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  detailsCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1.2,
    marginTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13.5,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  copyIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idValueText: {
    fontSize: 14,
    fontWeight: '900',
  },
  divider: {
    height: 0.8,
    marginVertical: 1,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 16,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    marginLeft: 10,
  },
  actionOutlineBtn: {
    width: '100%',
    height: 50,
    borderRadius: 16,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionOutlineText: {
    fontSize: 15,
    fontWeight: '800',
  },

  /* Sheets */
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  sheetDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  reasonsList: {
    marginBottom: 20,
  },
  reasonRadioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  reasonRadioText: {
    fontSize: 14,
    marginLeft: 10,
  },
  cancelSheetActionsRow: {
    flexDirection: 'row',
  },
  cancelModalBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelModalBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
