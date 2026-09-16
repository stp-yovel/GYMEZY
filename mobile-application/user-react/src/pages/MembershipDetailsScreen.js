import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors } from '../theme/appTheme';
import { DigitalQrPassCard } from '../widgets/DigitalQrPassCard';
import { useBookingRepository } from '../data/BookingContext';

export const MembershipDetailsScreen = ({ route, navigation }) => {
  const { membership: initialMbr } = route.params;
  const { isDark, colors } = useTheme();
  const { memberships } = useBookingRepository();

  const membership =
    memberships.find((m) => m.id === initialMbr.id) || initialMbr;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `GYMEZY Membership Pass\nGym: ${membership.gymName}\nPlan: ${membership.planName}\nPass ID: ${membership.id}\nOTP: ${membership.otp}\nValid: ${membership.startDate} to ${membership.endDate}`,
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <SafeAreaView style={{ backgroundColor: colors.card }}>
        <View style={[styles.appBar, { borderColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.appBarTitle, { color: colors.text }]}>Membership QR Pass</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
            <MaterialIcons name="share" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Full Digital Entry QR Pass Card */}
        <DigitalQrPassCard
          passId={membership.id}
          customerId={membership.customerId}
          otp={membership.otp}
          gymName={membership.gymName}
          subtitle={membership.planName}
          primaryDateLabel="START DATE"
          primaryDateValue={membership.startDate}
          secondaryDateLabel="END DATE"
          secondaryDateValue={membership.endDate}
          status={membership.status}
          iconName="workspace-premium"
          accentColor={AppColors.primaryNavy}
        />

        {/* Plan Details Card */}
        <View
          style={[
            styles.detailsCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.detailsHeading, { color: colors.text }]}>Plan Details</Text>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Status</Text>
            <Text style={[styles.detailValue, { color: membership.status === 'Active' ? '#047857' : colors.text }]}>
              {membership.status}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Plan Duration</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {membership.durationDays}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Amount Paid</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              ₹{membership.amountPaid.toFixed(2)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.subtitle }]}>Payment Mode</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {membership.paymentMode}
            </Text>
          </View>

          {membership.hasPersonalTrainer && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: AppColors.accentColor }]}>
                Personal Trainer
              </Text>
              <Text style={[styles.detailValue, { color: AppColors.accentColor }]}>
                {membership.trainerName || 'Assigned Coach'}
              </Text>
            </View>
          )}
        </View>

        {/* Reception Instructions */}
        <View
          style={[
            styles.detailsCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.detailsHeading, { color: colors.text }]}>Check-in Instructions</Text>
          <Text style={[styles.instructionText, { color: colors.subtitle }]}>
            Scan this QR code at the turnstile scanner or provide the 6-digit Entry OTP to the reception desk for instant contactless check-in.
          </Text>
        </View>
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
});
