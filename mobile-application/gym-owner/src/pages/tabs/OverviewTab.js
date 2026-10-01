import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeContext';
import { AppColors } from '../../theme/appTheme';
import { useAuth } from '../../context/AuthContext';

const RECENT_CHECKINS = [
  {
    id: '1',
    name: 'Rahul Sharma',
    plan: 'Annual VIP Pass',
    time: '2 mins ago',
    type: 'Cardio & Strength',
    status: 'Active',
    avatar: 'RS',
  },
  {
    id: '2',
    name: 'Priya Sundaram',
    plan: 'Quarterly Pro',
    time: '14 mins ago',
    type: 'Yoga / HIIT',
    status: 'Active',
    avatar: 'PS',
  },
  {
    id: '3',
    name: 'Arun Venkatesh',
    plan: 'Monthly Standard',
    time: '28 mins ago',
    type: 'Strength Zone',
    status: 'Expiring in 3d',
    avatar: 'AV',
  },
  {
    id: '4',
    name: 'Deepika Raman',
    plan: 'Personal Training VIP',
    time: '45 mins ago',
    type: 'Trainer 1-on-1',
    status: 'Active',
    avatar: 'DR',
  },
  {
    id: '5',
    name: 'Karthik Raja',
    plan: 'Annual VIP Pass',
    time: '1 hour ago',
    type: 'CrossFit & Cardio',
    status: 'Active',
    avatar: 'KR',
  },
];

export const OverviewTab = ({ topInset, navigation, onNavigateToMembers }) => {
  const { isDark } = useTheme();
  const { user, gym } = useAuth();
  const [capacity] = useState(gym?.floorCapacity || 50);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: topInset + 12,
          paddingBottom: 110,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Clean Top Header: Gym Name, Partner ID & Notification Badge (NO theme or logout here) */}
      <View style={styles.topHeader}>
        <View style={styles.gymProfile}>
          <View
            style={[
              styles.gymLogoWrapper,
              {
                backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
                borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
              },
            ]}
          >
            <Image
              source={require('../../../assets/logo/gymezy.png')}
              style={styles.gymLogo}
              resizeMode="contain"
            />
          </View>
          <View>
            <View style={styles.gymNameRow}>
              <Text
                style={[
                  styles.gymName,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                {gym?.name || user?.fullName || 'Gym Facility'}
              </Text>
              <View style={styles.verifiedBadge}>
                <MaterialIcons name="verified" size={15} color={AppColors.secondaryColor} />
              </View>
            </View>
            <Text
              style={[
                styles.gymLocation,
                { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' },
              ]}
            >
              {gym?.city ? (gym?.area ? `${gym.area}, ${gym.city}` : gym.city) : gym?.fullAddress || 'Partner Location'}
            </Text>
          </View>
        </View>

        {/* Notifications Icon Button with live badge */}
        <TouchableOpacity
          style={[
            styles.notifBtn,
            {
              backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
              borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
            },
          ]}
          onPress={() =>
            Alert.alert(
              'Partner Notifications',
              '• 3 new members registered today\n• Monthly settlement ₹1.85L processed\n• 12 memberships expiring this week'
            )
          }
          activeOpacity={0.8}
        >
          <Ionicons
            name="notifications-outline"
            size={20}
            color={isDark ? '#FFFFFF' : '#0F172A'}
          />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      {/* 2. Live Capacity Meter Card */}
      <View
        style={[
          styles.capacityCard,
          {
            backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
            borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
          },
        ]}
      >
        <View style={styles.capacityHeader}>
          <View style={styles.liveIndicator}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveText}>LIVE OCCUPANCY</Text>
          </View>
          <Text
            style={[
              styles.capacityValue,
              { color: isDark ? '#FFFFFF' : '#0F172A' },
            ]}
          >
            {capacity} <Text style={styles.capacityTotal}>/ 100 slots</Text>
          </Text>
        </View>
        <View
          style={[
            styles.capacityTrack,
            { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0' },
          ]}
        >
          <View
            style={[
              styles.capacityFill,
              {
                width: `${capacity}%`,
                backgroundColor: capacity > 80 ? AppColors.dangerRed : AppColors.secondaryColor,
              },
            ]}
          />
        </View>
        <View style={styles.capacityFooter}>
          <Text
            style={[
              styles.capacityHint,
              { color: isDark ? 'rgba(255,255,255,0.55)' : '#64748B' },
            ]}
          >
            Moderate floor load • Safe capacity limit is 100 concurrent members
          </Text>
        </View>
      </View>

      {/* 3. Key Business Metrics Grid */}
      <View style={styles.metricsGrid}>
        <TouchableOpacity
          style={[
            styles.metricCard,
            {
              backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
              borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
            },
          ]}
          onPress={onNavigateToMembers}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.metricIconBox,
              { backgroundColor: 'rgba(0, 191, 98, 0.12)' },
            ]}
          >
            <MaterialIcons name="people" size={20} color={AppColors.secondaryColor} />
          </View>
          <Text
            style={[
              styles.metricNum,
              { color: isDark ? '#FFFFFF' : '#0F172A' },
            ]}
          >
            248
          </Text>
          <Text
            style={[
              styles.metricLabel,
              { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' },
            ]}
          >
            Active Members
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.metricCard,
            {
              backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
              borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
            },
          ]}
          onPress={() => navigation?.navigate('CheckIn', { initialMode: 'HUB' })}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.metricIconBox,
              { backgroundColor: 'rgba(0, 56, 130, 0.12)' },
            ]}
          >
            <MaterialIcons name="qr-code-scanner" size={20} color={AppColors.primaryColor} />
          </View>
          <Text
            style={[
              styles.metricNum,
              { color: isDark ? '#FFFFFF' : '#0F172A' },
            ]}
          >
            64
          </Text>
          <Text
            style={[
              styles.metricLabel,
              { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' },
            ]}
          >
            Today's Check-ins
          </Text>
        </TouchableOpacity>

        <View
          style={[
            styles.metricCard,
            {
              backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
              borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
            },
          ]}
        >
          <View
            style={[
              styles.metricIconBox,
              { backgroundColor: 'rgba(99, 102, 241, 0.12)' },
            ]}
          >
            <MaterialIcons name="account-balance-wallet" size={20} color={AppColors.accentColor} />
          </View>
          <Text
            style={[
              styles.metricNum,
              { color: isDark ? '#FFFFFF' : '#0F172A' },
            ]}
          >
            ₹1.85L
          </Text>
          <Text
            style={[
              styles.metricLabel,
              { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' },
            ]}
          >
            This Month
          </Text>
        </View>

        <View
          style={[
            styles.metricCard,
            {
              backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
              borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
            },
          ]}
        >
          <View
            style={[
              styles.metricIconBox,
              { backgroundColor: 'rgba(245, 158, 11, 0.12)' },
            ]}
          >
            <MaterialIcons name="notification-important" size={20} color={AppColors.warningAmber} />
          </View>
          <Text
            style={[
              styles.metricNum,
              { color: isDark ? '#FFFFFF' : '#0F172A' },
            ]}
          >
            12
          </Text>
          <Text
            style={[
              styles.metricLabel,
              { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' },
            ]}
          >
            Expiring Soon
          </Text>
        </View>
      </View>

      {/* 4. Quick Actions */}
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          style={styles.primaryActionBtn}
          onPress={() => navigation?.navigate('CheckIn', { initialMode: 'QR' })}
          activeOpacity={0.88}
        >
          <MaterialIcons name="qr-code-scanner" size={22} color="#FFFFFF" />
          <Text style={styles.primaryActionText}>Scan QR Entry</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.secondaryActionBtn,
            {
              backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
              borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
            },
          ]}
          onPress={onNavigateToMembers}
          activeOpacity={0.8}
        >
          <MaterialIcons name="person-add" size={20} color={AppColors.primaryColor} />
          <Text
            style={[
              styles.secondaryActionText,
              { color: isDark ? '#FFFFFF' : '#0F172A' },
            ]}
          >
            Add Member
          </Text>
        </TouchableOpacity>
      </View>

      {/* Staff Attendance Quick Access Card */}
      <TouchableOpacity
        style={[
          styles.staffAttendanceQuickCard,
          {
            backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
            borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
          },
        ]}
        onPress={() => navigation?.navigate('Attendance')}
        activeOpacity={0.85}
      >
        <View style={styles.staffQuickLeft}>
          <View style={[styles.staffIconBadge, { backgroundColor: 'rgba(99, 102, 241, 0.12)' }]}>
            <MaterialIcons name="badge" size={20} color={AppColors.accentColor} />
          </View>
          <View>
            <Text style={[styles.staffQuickTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Staff & Trainer Attendance
            </Text>
            <Text style={[styles.staffQuickSub, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              18 / 28 Present Today • 7 Absent
            </Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={22} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
      </TouchableOpacity>

      {/* 5. Live Member Check-Ins Activity Feed */}
      <View style={styles.sectionHeaderRow}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? '#FFFFFF' : '#0F172A' },
          ]}
        >
          Live Member Check-Ins
        </Text>
        <TouchableOpacity onPress={onNavigateToMembers}>
          <Text style={styles.viewAllText}>View All Members</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.checkinCard,
          {
            backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
            borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
          },
        ]}
      >
        {RECENT_CHECKINS.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.checkinRow,
              index < RECENT_CHECKINS.length - 1 && [
                styles.checkinBorder,
                { borderColor: isDark ? AppColors.darkBorder : '#F1F5F9' },
              ],
            ]}
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{item.avatar}</Text>
            </View>

            <View style={styles.checkinInfo}>
              <Text
                style={[
                  styles.checkinName,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                {item.name}
              </Text>
              <Text
                style={[
                  styles.checkinMeta,
                  { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' },
                ]}
              >
                {item.plan} • {item.type}
              </Text>
            </View>

            <View style={styles.checkinStatusBox}>
              <Text
                style={[
                  styles.checkinStatusBadge,
                  {
                    color:
                      item.status === 'Active'
                        ? AppColors.secondaryColor
                        : AppColors.warningAmber,
                    backgroundColor:
                      item.status === 'Active'
                        ? 'rgba(0, 191, 98, 0.12)'
                        : 'rgba(245, 158, 11, 0.12)',
                  },
                ]}
              >
                {item.status}
              </Text>
              <Text
                style={[
                  styles.checkinTime,
                  { color: isDark ? 'rgba(255,255,255,0.45)' : '#94A3B8' },
                ]}
              >
                {item.time}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 18,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gymProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  gymLogoWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    overflow: 'hidden',
  },
  gymLogo: {
    width: '100%',
    height: '100%',
  },
  gymNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gymName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  verifiedBadge: {
    marginTop: 1,
  },
  gymLocation: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.dangerRed,
  },
  capacityCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  capacityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.secondaryColor,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '800',
    color: AppColors.secondaryColor,
    letterSpacing: 1,
  },
  capacityValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  capacityTotal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  capacityTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  capacityFill: {
    height: '100%',
    borderRadius: 4,
  },
  capacityFooter: {
    marginTop: 2,
  },
  capacityHint: {
    fontSize: 11,
    fontWeight: '500',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  metricIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  metricNum: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  primaryActionBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primaryColor,
    height: 52,
    borderRadius: 16,
    gap: 8,
    shadowColor: AppColors.primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  viewAllText: {
    color: AppColors.primaryColor,
    fontSize: 13,
    fontWeight: '700',
  },
  checkinCard: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  checkinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  checkinBorder: {
    borderBottomWidth: 1,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 56, 130, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: AppColors.primaryColor,
    fontSize: 13,
    fontWeight: '800',
  },
  checkinInfo: {
    flex: 1,
  },
  checkinName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  checkinMeta: {
    fontSize: 12,
    fontWeight: '500',
  },
  checkinStatusBox: {
    alignItems: 'flex-end',
    gap: 4,
  },
  checkinStatusBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  checkinTime: {
    fontSize: 11,
    fontWeight: '500',
  },
  staffAttendanceQuickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  staffQuickLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  staffIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffQuickTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  staffQuickSub: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});
