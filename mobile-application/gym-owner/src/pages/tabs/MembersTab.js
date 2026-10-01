import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Linking,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeContext';
import { AppColors } from '../../theme/appTheme';
import { useToast } from '../../widgets/CustomScaffoldMessage';
import { useAuth } from '../../context/AuthContext';

const INITIAL_MEMBERS = [];
const INITIAL_BOOKINGS = [];
const MEMBER_FILTER_TABS = ['All', 'Active', 'Expiring Soon', 'Inactive'];
const BOOKING_FILTER_TABS = ['All', 'Upcoming', 'Checked-in', 'Completed'];

export const MembersTab = ({ topInset }) => {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const { gym } = useAuth();

  // Mode: 'MEMBERS' or 'BOOKINGS'
  const [activeMode, setActiveMode] = useState('MEMBERS');

  // Members state
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Bookings state (From web BookingsManagement)
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [bookingFilter, setBookingFilter] = useState('All');

  // New Member Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPlan, setNewPlan] = useState('Annual VIP Pass');

  const filteredMembers = members.filter((m) => {
    const matchesFilter = activeFilter === 'All' || m.status === activeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      m.name.toLowerCase().includes(q) ||
      m.phone.includes(q) ||
      m.id.toLowerCase().includes(q) ||
      m.plan.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = bookingFilter === 'All' || b.status === bookingFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      b.customerName.toLowerCase().includes(q) ||
      b.bookingId.toLowerCase().includes(q) ||
      b.phone.includes(q);
    return matchesFilter && matchesSearch;
  });

  const handleAddMember = () => {
    if (!newName.trim() || !newPhone.trim()) {
      showToast({
        message: 'Please enter member name and phone number',
        isError: true,
      });
      return;
    }

    const initials = newName
      .trim()
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newMemberObj = {
      id: `M-${Math.floor(100 + Math.random() * 900)}`,
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim() || 'member@gymezy.com',
      plan: newPlan,
      expiry: '29 Sep 2027',
      status: 'Active',
      avatar: initials || 'GM',
      checkins: 0,
      streak: '1 Day',
      emergencyContact: '+91 98400 00000',
      joinDate: 'Today',
    };

    setMembers([newMemberObj, ...members]);
    setShowAddModal(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    showToast({
      message: `Member ${newMemberObj.name} registered successfully!`,
      isSuccess: true,
    });
  };

  const handleCheckInBooking = (bookingKey) => {
    setBookings(
      bookings.map((b) =>
        b.key === bookingKey ? { ...b, status: 'Checked-in' } : b
      )
    );
    showToast({ message: 'Day pass booking marked as Checked-in!', isSuccess: true });
  };

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Call', `Dialing ${phone}`);
    });
  };

  const handleWhatsApp = (phone, name) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const gymName = gym?.name || 'our gym';
    const url = `whatsapp://send?phone=${cleanPhone}&text=Hi ${name}, greeting from ${gymName}!`;
    Linking.openURL(url).catch(() => {
      Alert.alert('WhatsApp', `Opening chat with ${name} (${phone})`);
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? AppColors.darkBackground : AppColors.lightBackground }]}>
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
        {/* Top Segment Mode Switcher (Ported from Web) */}
        <View
          style={[
            styles.modeSegmentContainer,
            {
              backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
              borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.modeSegmentBtn,
              activeMode === 'MEMBERS' && { backgroundColor: AppColors.primaryColor },
            ]}
            onPress={() => setActiveMode('MEMBERS')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="people"
              size={16}
              color={activeMode === 'MEMBERS' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
            />
            <Text
              style={[
                styles.modeSegmentText,
                { color: activeMode === 'MEMBERS' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B' },
              ]}
            >
              Members Roster ({members.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeSegmentBtn,
              activeMode === 'BOOKINGS' && { backgroundColor: AppColors.primaryColor },
            ]}
            onPress={() => setActiveMode('BOOKINGS')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="confirmation-number"
              size={16}
              color={activeMode === 'BOOKINGS' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
            />
            <Text
              style={[
                styles.modeSegmentText,
                { color: activeMode === 'BOOKINGS' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B' },
              ]}
            >
              Bookings & Passes ({bookings.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Header Bar */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.pageTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              {activeMode === 'MEMBERS' ? 'Members Roster' : 'Day Pass Bookings'}
            </Text>
            <Text style={[styles.pageSubtitle, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              {activeMode === 'MEMBERS'
                ? `${members.length} registered members`
                : `${bookings.length} active sessions today`}
            </Text>
          </View>

          {activeMode === 'MEMBERS' && (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.85}
            >
              <MaterialIcons name="person-add" size={18} color="#FFFFFF" />
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
              borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
            },
          ]}
        >
          <MaterialIcons
            name="search"
            size={20}
            color={isDark ? 'rgba(255,255,255,0.6)' : '#64748B'}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder={
              activeMode === 'MEMBERS'
                ? 'Search by name, phone, or ID...'
                : 'Search booking ID or customer name...'
            }
            placeholderTextColor={isDark ? 'rgba(255,255,255,0.45)' : '#94A3B8'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <MaterialIcons name="close" size={16} color={isDark ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {(activeMode === 'MEMBERS' ? MEMBER_FILTER_TABS : BOOKING_FILTER_TABS).map((tab) => {
            const isSelected =
              activeMode === 'MEMBERS' ? activeFilter === tab : bookingFilter === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() =>
                  activeMode === 'MEMBERS' ? setActiveFilter(tab) : setBookingFilter(tab)
                }
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected
                      ? AppColors.primaryColor
                      : isDark
                      ? AppColors.darkCard
                      : '#FFFFFF',
                    borderColor: isSelected
                      ? AppColors.primaryColor
                      : isDark
                      ? AppColors.darkBorder
                      : '#E2E8F0',
                  },
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: isSelected
                        ? '#FFFFFF'
                          ? '#FFFFFF'
                          : '#FFFFFF'
                        : isDark
                        ? 'rgba(255,255,255,0.7)'
                        : '#475569',
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 1. MEMBERS LIST VIEW */}
        {activeMode === 'MEMBERS' && (
          <>
            {filteredMembers.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons
                  name="people-outline"
                  size={48}
                  color={isDark ? 'rgba(255,255,255,0.2)' : '#CBD5E1'}
                />
                <Text
                  style={[
                    styles.emptyTitle,
                    { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' },
                  ]}
                >
                  No members found
                </Text>
              </View>
            ) : (
              filteredMembers.map((member) => {
                const isExpiring = member.status === 'Expiring Soon';
                const isInactive = member.status === 'Inactive';

                const badgeBg = isInactive
                  ? 'rgba(239, 68, 68, 0.12)'
                  : isExpiring
                  ? 'rgba(245, 158, 11, 0.12)'
                  : 'rgba(0, 191, 98, 0.12)';

                const badgeColor = isInactive
                  ? AppColors.dangerRed
                  : isExpiring
                  ? AppColors.warningAmber
                  : AppColors.secondaryColor;

                return (
                  <TouchableOpacity
                    key={member.id}
                    style={[
                      styles.memberCard,
                      {
                        backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
                        borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                      },
                    ]}
                    onPress={() => setSelectedMember(member)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.cardTopRow}>
                      <View style={styles.memberMain}>
                        <View style={styles.avatarCircle}>
                          <Text style={styles.avatarText}>{member.avatar}</Text>
                        </View>
                        <View>
                          <View style={styles.nameRow}>
                            <Text
                              style={[
                                styles.memberName,
                                { color: isDark ? '#FFFFFF' : '#0F172A' },
                              ]}
                            >
                              {member.name}
                            </Text>
                            <Text style={styles.memberIdText}>{member.id}</Text>
                          </View>
                          <Text
                            style={[
                              styles.memberPlan,
                              { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' },
                            ]}
                          >
                            {member.plan}
                          </Text>
                        </View>
                      </View>

                      <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
                        <Text style={[styles.statusBadgeText, { color: badgeColor }]}>
                          {member.status}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.cardDivider,
                        { backgroundColor: isDark ? AppColors.darkBorder : '#F1F5F9' },
                      ]}
                    />

                    <View style={styles.cardBottomRow}>
                      <View>
                        <Text
                          style={[
                            styles.metaLabel,
                            { color: isDark ? 'rgba(255,255,255,0.45)' : '#94A3B8' },
                          ]}
                        >
                          VALIDITY
                        </Text>
                        <Text
                          style={[
                            styles.metaValue,
                            { color: isDark ? '#FFFFFF' : '#0F172A' },
                          ]}
                        >
                          {member.expiry}
                        </Text>
                      </View>

                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={[
                            styles.iconActionBtn,
                            {
                              backgroundColor: isDark
                                ? 'rgba(255,255,255,0.06)'
                                : '#F1F5F9',
                            },
                          ]}
                          onPress={() => handleCall(member.phone)}
                          activeOpacity={0.8}
                        >
                          <Ionicons
                            name="call"
                            size={16}
                            color={AppColors.primaryColor}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.iconActionBtn,
                            {
                              backgroundColor: isDark
                                ? 'rgba(255,255,255,0.06)'
                                : '#F1F5F9',
                            },
                          ]}
                          onPress={() => handleWhatsApp(member.phone, member.name)}
                          activeOpacity={0.8}
                        >
                          <Ionicons
                            name="logo-whatsapp"
                            size={16}
                            color={AppColors.secondaryColor}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </>
        )}

        {/* 2. LIVE BOOKINGS VIEW (Ported from Web BookingsManagement) */}
        {activeMode === 'BOOKINGS' && (
          <>
            {filteredBookings.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons
                  name="confirmation-number"
                  size={48}
                  color={isDark ? 'rgba(255,255,255,0.2)' : '#CBD5E1'}
                />
                <Text
                  style={[
                    styles.emptyTitle,
                    { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' },
                  ]}
                >
                  No bookings found
                </Text>
              </View>
            ) : (
              filteredBookings.map((b) => {
                const isCheckedIn = b.status === 'Checked-in';
                const isUpcoming = b.status === 'Upcoming';

                const statusBg = isCheckedIn
                  ? 'rgba(0, 191, 98, 0.12)'
                  : isUpcoming
                  ? 'rgba(59, 130, 246, 0.12)'
                  : 'rgba(148, 163, 184, 0.12)';
                const statusColor = isCheckedIn
                  ? AppColors.secondaryColor
                  : isUpcoming
                  ? '#3B82F6'
                  : '#64748B';

                return (
                  <View
                    key={b.key}
                    style={[
                      styles.bookingCard,
                      {
                        backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
                        borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                      },
                    ]}
                  >
                    <View style={styles.bookingTopRow}>
                      <Image source={{ uri: b.avatar }} style={styles.bookingAvatar} />
                      <View style={{ flex: 1 }}>
                        <View style={styles.nameRow}>
                          <Text style={[styles.bookingCustomerName, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                            {b.customerName}
                          </Text>
                          <Text style={styles.bookingTypeTag}>{b.type}</Text>
                        </View>
                        <Text style={[styles.bookingMetaSub, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
                          ID: {b.bookingId} • ⏱ {b.time}
                        </Text>
                      </View>

                      <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                        <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                          {b.status}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.cardDivider, { backgroundColor: isDark ? AppColors.darkBorder : '#F1F5F9' }]} />

                    <View style={styles.bookingBottomRow}>
                      <View>
                        <Text style={[styles.metaLabel, { color: isDark ? 'rgba(255,255,255,0.45)' : '#94A3B8' }]}>
                          AMOUNT & PAYMENT
                        </Text>
                        <Text style={[styles.metaValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                          {b.amount} ({b.payment})
                        </Text>
                      </View>

                      {isUpcoming ? (
                        <TouchableOpacity
                          style={styles.verifyCheckinBtn}
                          onPress={() => handleCheckInBooking(b.key)}
                          activeOpacity={0.8}
                        >
                          <MaterialIcons name="qr-code-scanner" size={16} color="#FFFFFF" />
                          <Text style={styles.verifyCheckinBtnText}>Check In</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.verifiedPassBadge}>
                          <MaterialIcons name="check-circle" size={14} color={AppColors.secondaryColor} />
                          <Text style={styles.verifiedPassText}>Access Granted</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}
      </ScrollView>

      {/* Member Details Action Sheet Modal */}
      <Modal
        visible={!!selectedMember}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedMember(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF' },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                Member Profile
              </Text>
              <TouchableOpacity onPress={() => setSelectedMember(null)}>
                <MaterialIcons
                  name="close"
                  size={24}
                  color={isDark ? '#FFFFFF' : '#0F172A'}
                />
              </TouchableOpacity>
            </View>

            {selectedMember && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.sheetTopProfileRow}>
                  <View style={styles.sheetAvatarBox}>
                    <Text style={styles.sheetAvatarText}>{selectedMember.avatar}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.sheetMemberName, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                      {selectedMember.name}
                    </Text>
                    <Text style={[styles.sheetPlanText, { color: AppColors.primaryColor }]}>
                      {selectedMember.plan}
                    </Text>
                    <Text style={[styles.sheetIdText, { color: isDark ? 'rgba(255,255,255,0.5)' : '#94A3B8' }]}>
                      ID: {selectedMember.id} • Joined {selectedMember.joinDate}
                    </Text>
                  </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.sheetStatsGrid}>
                  <View style={[styles.sheetStatBox, { backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC' }]}>
                    <Text style={[styles.sheetStatNum, { color: AppColors.primaryColor }]}>
                      {selectedMember.checkins}
                    </Text>
                    <Text style={[styles.sheetStatLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                      Total Check-ins
                    </Text>
                  </View>

                  <View style={[styles.sheetStatBox, { backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC' }]}>
                    <Text style={[styles.sheetStatNum, { color: AppColors.secondaryColor }]}>
                      {selectedMember.streak}
                    </Text>
                    <Text style={[styles.sheetStatLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                      Active Streak 🔥
                    </Text>
                  </View>
                </View>

                {/* Info Rows */}
                <View style={styles.sheetInfoRow}>
                  <MaterialIcons name="phone" size={18} color={AppColors.primaryColor} />
                  <Text style={[styles.sheetInfoText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    {selectedMember.phone}
                  </Text>
                </View>

                <View style={styles.sheetInfoRow}>
                  <MaterialIcons name="email" size={18} color={AppColors.primaryColor} />
                  <Text style={[styles.sheetInfoText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    {selectedMember.email}
                  </Text>
                </View>

                <View style={styles.sheetInfoRow}>
                  <MaterialIcons name="health-and-safety" size={18} color="#EF4444" />
                  <Text style={[styles.sheetInfoText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    Emergency: {selectedMember.emergencyContact}
                  </Text>
                </View>

                {/* Direct Actions */}
                <View style={styles.sheetActionButtonsRow}>
                  <TouchableOpacity
                    style={[styles.sheetActionBtn, { backgroundColor: AppColors.primaryColor }]}
                    onPress={() => {
                      setSelectedMember(null);
                      showToast({ message: `Renewal link sent to ${selectedMember.name}` });
                    }}
                  >
                    <MaterialIcons name="autorenew" size={18} color="#FFFFFF" />
                    <Text style={styles.sheetActionBtnText}>Renew Plan</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.sheetActionBtn, { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: '#EF4444' }]}
                    onPress={() => {
                      setSelectedMember(null);
                      showToast({ message: `Membership frozen for 15 days` });
                    }}
                  >
                    <MaterialIcons name="pause" size={18} color="#EF4444" />
                    <Text style={[styles.sheetActionBtnText, { color: '#EF4444' }]}>Freeze Plan</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF' },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                Register New Member
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <MaterialIcons
                  name="close"
                  size={24}
                  color={isDark ? '#FFFFFF' : '#0F172A'}
                />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={[
                  styles.fieldLabel,
                  { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' },
                ]}
              >
                Full Name *
              </Text>
              <TextInput
                placeholder="e.g. Vikram Sharma"
                placeholderTextColor={
                  isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'
                }
                value={newName}
                onChangeText={setNewName}
                style={[
                  styles.modalInput,
                  {
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                    backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                  },
                ]}
              />

              <Text
                style={[
                  styles.fieldLabel,
                  { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' },
                ]}
              >
                Phone Number *
              </Text>
              <TextInput
                placeholder="e.g. +91 98400 12345"
                placeholderTextColor={
                  isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'
                }
                value={newPhone}
                onChangeText={setNewPhone}
                keyboardType="phone-pad"
                style={[
                  styles.modalInput,
                  {
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                    backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                  },
                ]}
              />

              <Text
                style={[
                  styles.fieldLabel,
                  { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' },
                ]}
              >
                Email Address
              </Text>
              <TextInput
                placeholder="e.g. vikram@example.com"
                placeholderTextColor={
                  isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'
                }
                value={newEmail}
                onChangeText={setNewEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[
                  styles.modalInput,
                  {
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                    backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                  },
                ]}
              />

              <Text
                style={[
                  styles.fieldLabel,
                  { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' },
                ]}
              >
                Select Membership Plan
              </Text>
              {[
                'Annual VIP Pass',
                'Quarterly Pro',
                'Monthly Standard',
                'Personal Training VIP',
              ].map((plan) => {
                const isSelected = newPlan === plan;
                return (
                  <TouchableOpacity
                    key={plan}
                    onPress={() => setNewPlan(plan)}
                    style={[
                      styles.planOption,
                      {
                        backgroundColor: isSelected
                          ? isDark
                            ? 'rgba(0, 56, 130, 0.25)'
                            : '#EEF2FF'
                          : isDark
                          ? AppColors.darkSurface
                          : '#F8FAFC',
                        borderColor: isSelected
                          ? AppColors.primaryColor
                          : isDark
                          ? AppColors.darkBorder
                          : '#E2E8F0',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.planOptionText,
                        {
                          color: isSelected
                            ? AppColors.primaryColor
                            : isDark
                            ? '#FFFFFF'
                            : '#0F172A',
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {plan}
                    </Text>
                    {isSelected && (
                      <MaterialIcons
                        name="check-circle"
                        size={18}
                        color={AppColors.primaryColor}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleAddMember}
                activeOpacity={0.85}
              >
                <Text style={styles.modalSubmitText}>Register Member</Text>
              </TouchableOpacity>
            </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 16,
  },
  modeSegmentContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
    gap: 6,
  },
  modeSegmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 12,
    gap: 6,
  },
  modeSegmentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primaryColor,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 14,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  memberCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0, 56, 130, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: AppColors.primaryColor,
    fontSize: 14,
    fontWeight: '800',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '700',
  },
  memberIdText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  memberPlan: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardDivider: {
    height: 1,
    marginVertical: 12,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Bookings Cards */
  bookingCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  bookingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bookingAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  bookingCustomerName: {
    fontSize: 15,
    fontWeight: '700',
  },
  bookingTypeTag: {
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    color: '#6366F1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bookingMetaSub: {
    fontSize: 12,
    marginTop: 2,
  },
  bookingBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verifyCheckinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primaryColor,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  verifyCheckinBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  verifiedPassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedPassText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.secondaryColor,
  },

  /* Member Sheet */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sheetTopProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  sheetAvatarBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: AppColors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  sheetMemberName: {
    fontSize: 17,
    fontWeight: '800',
  },
  sheetPlanText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
  },
  sheetIdText: {
    fontSize: 11,
    marginTop: 2,
  },
  sheetStatsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  sheetStatBox: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  sheetStatNum: {
    fontSize: 18,
    fontWeight: '800',
  },
  sheetStatLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  sheetInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  sheetInfoText: {
    fontSize: 13,
    fontWeight: '500',
  },
  sheetActionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
    marginBottom: 10,
  },
  sheetActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  sheetActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  /* Add Form */
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  modalInput: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  planOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  planOptionText: {
    fontSize: 14,
  },
  modalSubmitBtn: {
    backgroundColor: AppColors.primaryColor,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
