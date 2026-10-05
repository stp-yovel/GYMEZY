import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeContext';
import { AppColors } from '../../theme/appTheme';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';
import { getGymLogoUri } from '../../utils/mediaUtils';

export const OverviewTab = ({ topInset, navigation, onNavigateToMembers }) => {
  const { isDark } = useTheme();
  const { user, gym, refreshGymProfile } = useAuth();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [employees, setEmployees] = useState([]);

  // Fetch live employees and refresh gym profile
  const fetchOverviewData = useCallback(async () => {
    try {
      if (refreshGymProfile) {
        await refreshGymProfile();
      }
      const employeeData = await apiService.getEmployees();
      if (Array.isArray(employeeData)) {
        setEmployees(employeeData);
      }
    } catch (err) {
      console.warn('Overview data fetch error:', err.message);
    }
  }, [refreshGymProfile]);

  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchOverviewData();
    setIsRefreshing(false);
  };

  // Gym Initials for Avatar Fallback
  const gymInitials = useMemo(() => {
    const name = gym?.name || user?.fullName || 'Gym';
    return name
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'GY';
  }, [gym?.name, user?.fullName]);

  // Safe Gym Logo URI
  const logoUri = useMemo(() => getGymLogoUri(gym), [gym]);

  // Dynamic Occupancy & Floor Metrics
  const floorCapacity = Number(gym?.floorCapacity || gym?.capacity || 100);
  const liveOccupancy = Number(gym?.liveOccupancy !== undefined ? gym.liveOccupancy : 0);
  const occupancyPercent = Math.min(100, Math.round((liveOccupancy / floorCapacity) * 100));

  // Dynamic Live Key Metrics
  const activeMembersCount = Number(
    gym?.activeMembersCount !== undefined
      ? gym.activeMembersCount
      : Array.isArray(gym?.members)
      ? gym.members.length
      : 0
  );
  const todayCheckinsCount = Number(gym?.todayCheckinsCount !== undefined ? gym.todayCheckinsCount : 0);
  const monthlyRevenue = Number(gym?.monthlyRevenue !== undefined ? gym.monthlyRevenue : gym?.totalRevenue || 0);
  const formattedRevenue =
    monthlyRevenue >= 100000
      ? `₹${(monthlyRevenue / 100000).toFixed(2)}L`
      : `₹${monthlyRevenue.toLocaleString('en-IN')}`;
  const expiringSoonCount = Number(gym?.expiringMembersCount !== undefined ? gym.expiringMembersCount : 0);

  // Dynamic Staff Attendance Counts
  const totalStaff = employees.length;
  const presentStaff = employees.filter(
    (e) => e.status === 'Active' || e.attendance === 'Present' || e.attendance === 'Checked In'
  ).length;
  const absentStaff = Math.max(0, totalStaff - presentStaff);

  // Live Member Check-ins
  const liveCheckins = Array.isArray(gym?.recentCheckins) ? gym.recentCheckins : [];

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
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={[AppColors.primaryColor]}
          tintColor={AppColors.primaryColor}
        />
      }
    >
      {/* 1. Top Header: Gym Logo, Gym Name, Location & Notifications */}
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
            {logoUri ? (
              <Image
                source={{ uri: logoUri }}
                style={styles.gymLogo}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.gymInitialBadge, { backgroundColor: AppColors.primaryColor }]}>
                <Text style={styles.gymInitialText}>{gymInitials}</Text>
              </View>
            )}
          </View>
          <View style={styles.gymInfoBox}>
            <View style={styles.gymNameRow}>
              <Text
                style={[
                  styles.gymName,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
                numberOfLines={1}
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
              numberOfLines={1}
            >
              {gym?.city
                ? gym?.area
                  ? `${gym.area}, ${gym.city}`
                  : gym.city
                : gym?.fullAddress || 'Partner Location'}
            </Text>
          </View>
        </View>

        {/* Notifications Icon Button */}
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
              `${gym?.name || 'Gym'} Notifications`,
              `• Super Admin Status: ${gym?.approvalStatus || 'Approved'}\n• Staff Registered: ${totalStaff} staff members\n• Active Platform Plans: ${(gym?.pricingPlans ? Object.keys(gym.pricingPlans).length : 0)} configured`
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
            {liveOccupancy} <Text style={styles.capacityTotal}>/ {floorCapacity} slots</Text>
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
                width: `${occupancyPercent}%`,
                backgroundColor:
                  occupancyPercent > 80 ? AppColors.dangerRed : AppColors.secondaryColor,
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
            {occupancyPercent === 0
              ? `Floor available • Safe capacity limit is ${floorCapacity} concurrent members`
              : `Current floor load is ${occupancyPercent}% of safe capacity limit (${floorCapacity} members)`}
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
            {activeMembersCount}
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
            {todayCheckinsCount}
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
            {formattedRevenue}
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
            {expiringSoonCount}
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
              {totalStaff > 0
                ? `${presentStaff} / ${totalStaff} Present Today • ${absentStaff} Absent`
                : '0 Staff Configured • Tap to Manage Staff'}
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
        {liveCheckins.length > 0 ? (
          liveCheckins.map((item, index) => (
            <View
              key={item.id || index}
              style={[
                styles.checkinRow,
                index < liveCheckins.length - 1 && [
                  styles.checkinBorder,
                  { borderColor: isDark ? AppColors.darkBorder : '#F1F5F9' },
                ],
              ]}
            >
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {item.avatar ||
                    (item.name
                      ? item.name
                          .split(' ')
                          .map((p) => p[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase()
                      : 'MB')}
                </Text>
              </View>

              <View style={styles.checkinInfo}>
                <Text
                  style={[
                    styles.checkinName,
                    { color: isDark ? '#FFFFFF' : '#0F172A' },
                  ]}
                >
                  {item.name || 'Member'}
                </Text>
                <Text
                  style={[
                    styles.checkinMeta,
                    { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' },
                  ]}
                >
                  {item.plan || 'Standard Pass'} • {item.type || 'Workout'}
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
                  {item.status || 'Active'}
                </Text>
                <Text
                  style={[
                    styles.checkinTime,
                    { color: isDark ? 'rgba(255,255,255,0.45)' : '#94A3B8' },
                  ]}
                >
                  {item.time || 'Just now'}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCheckinsBox}>
            <MaterialIcons
              name="qr-code-scanner"
              size={32}
              color={isDark ? 'rgba(255,255,255,0.3)' : '#94A3B8'}
            />
            <Text style={[styles.emptyCheckinsTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              No Check-ins Recorded Today
            </Text>
            <Text style={[styles.emptyCheckinsSub, { color: isDark ? 'rgba(255,255,255,0.5)' : '#64748B' }]}>
              Members checking in via QR scan or check-in verification will appear here in real-time.
            </Text>
            <TouchableOpacity
              style={styles.emptyScanBtn}
              onPress={() => navigation?.navigate('CheckIn', { initialMode: 'QR' })}
              activeOpacity={0.88}
            >
              <MaterialIcons name="qr-code" size={18} color="#FFFFFF" />
              <Text style={styles.emptyScanBtnText}>Scan Member Entry</Text>
            </TouchableOpacity>
          </View>
        )}
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
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gymLogo: {
    width: '100%',
    height: '100%',
  },
  gymInitialBadge: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gymInitialText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  gymInfoBox: {
    flex: 1,
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
    marginLeft: 8,
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
    paddingVertical: 8,
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
  emptyCheckinsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
    gap: 8,
  },
  emptyCheckinsTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  emptyCheckinsSub: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 10,
  },
  emptyScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: AppColors.primaryColor,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 4,
  },
  emptyScanBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
