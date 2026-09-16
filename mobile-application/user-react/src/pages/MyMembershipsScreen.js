import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors } from '../theme/appTheme';
import { useBookingRepository } from '../data/BookingContext';

export const MyMembershipsScreen = ({ navigation }) => {
  const { isDark, colors } = useTheme();
  const { memberships } = useBookingRepository();

  const [activeTab, setActiveTab] = useState('Active'); // 'Active' or 'Expired'

  const filteredMemberships = memberships.filter((m) =>
    activeTab === 'Active' ? m.status === 'Active' : m.status !== 'Active'
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Memberships</Text>
        <Text style={[styles.subtitle, { color: colors.subtitle }]}>
          Manage your long-term multi-gym passes
        </Text>
      </View>

      {/* Tabs */}
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
          {['Active', 'Expired / Past'].map((tab) => {
            const isSelected =
              (tab === 'Active' && activeTab === 'Active') ||
              (tab !== 'Active' && activeTab !== 'Active');
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab === 'Active' ? 'Active' : 'Expired')}
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
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredMemberships.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="card-membership" size={50} color={colors.subtitle} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No {activeTab} Memberships
            </Text>
            <Text style={[styles.emptySub, { color: colors.subtitle }]}>
              Your gym memberships will show up here with active validity passes.
            </Text>
          </View>
        ) : (
          filteredMemberships.map((mbr) => {
            const isActive = mbr.status === 'Active';
            return (
              <TouchableOpacity
                key={mbr.id}
                onPress={() => navigation.navigate('MembershipDetails', { membership: mbr })}
                activeOpacity={0.88}
                style={[
                  styles.membershipCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                {/* Header Row */}
                <View style={styles.cardHeaderRow}>
                  <Image source={{ uri: mbr.gymImageUrl }} style={styles.gymThumb} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={styles.cardHeaderTop}>
                      <Text style={[styles.cardGymName, { color: colors.text }]} numberOfLines={1}>
                        {mbr.gymName}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: isActive ? '#E6F7EF' : isDark ? '#262626' : '#F1F5F9',
                            borderColor: isActive ? '#B7EAD0' : colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: isActive ? '#047857' : colors.subtitle },
                          ]}
                        >
                          {mbr.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <Text style={[styles.planNameText, { color: AppColors.primaryNavy }]}>
                      {mbr.planName}
                    </Text>
                  </View>
                </View>

                {/* Validity Strip */}
                <View
                  style={[
                    styles.validityStrip,
                    {
                      backgroundColor: isDark ? '#262626' : '#F8FAFC',
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.valCol}>
                    <Text style={[styles.valLabel, { color: colors.subtitle }]}>START DATE</Text>
                    <Text style={[styles.valText, { color: colors.text }]}>{mbr.startDate}</Text>
                  </View>

                  <View style={[styles.valDivider, { backgroundColor: colors.border }]} />

                  <View style={styles.valCol}>
                    <Text style={[styles.valLabel, { color: colors.subtitle }]}>EXPIRY DATE</Text>
                    <Text style={[styles.valText, { color: colors.text }]}>{mbr.endDate}</Text>
                  </View>
                </View>

                {/* Duration Days Left Bar */}
                {isActive && (
                  <View style={styles.durationBarWrapper}>
                    <View style={styles.durationHeader}>
                      <Text style={[styles.durationLabel, { color: colors.subtitle }]}>
                        Validity Remaining:
                      </Text>
                      <Text style={[styles.durationVal, { color: AppColors.secondaryColor }]}>
                        {mbr.durationDays}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.progressTrack,
                        { backgroundColor: isDark ? '#262626' : '#E2E8F0' },
                      ]}
                    >
                      <View
                        style={[
                          styles.progressFill,
                          { backgroundColor: AppColors.secondaryColor, width: '75%' },
                        ]}
                      />
                    </View>
                  </View>
                )}

                {/* Bottom Row */}
                <View style={styles.cardBottomRow}>
                  <View>
                    <Text style={[styles.paidLabel, { color: colors.subtitle }]}>Amount Paid</Text>
                    <Text style={[styles.paidVal, { color: colors.text }]}>
                      ₹{mbr.amountPaid.toFixed(0)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('MembershipDetails', { membership: mbr })
                    }
                    style={[
                      styles.viewPassBtn,
                      { backgroundColor: AppColors.primaryNavy },
                    ]}
                  >
                    <MaterialIcons name="qr-code" size={16} color="#FFFFFF" />
                    <Text style={styles.viewPassText}>Membership Pass</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
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
  membershipCard: {
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
  planNameText: {
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 3,
  },
  validityStrip: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  valCol: {
    flex: 1,
  },
  valLabel: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  valText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 1,
  },
  valDivider: {
    width: 1,
    height: 20,
    marginHorizontal: 8,
  },
  durationBarWrapper: {
    marginTop: 12,
  },
  durationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  durationLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  durationVal: {
    fontSize: 11,
    fontWeight: '800',
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 0.8,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  paidLabel: {
    fontSize: 10.5,
  },
  paidVal: {
    fontSize: 15,
    fontWeight: '800',
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
});
