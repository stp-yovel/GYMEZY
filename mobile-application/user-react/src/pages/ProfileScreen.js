import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Switch,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors } from '../theme/appTheme';
import { useToast } from '../widgets/CustomScaffoldMessage';

export const ProfileScreen = ({ navigation, onNavigateToBookings, onNavigateToMemberships }) => {
  const { isDark, toggleTheme, themeMode, setThemeMode, colors } = useTheme();
  const { showToast } = useToast();

  const [userName, setUserName] = useState('Sam Kumar');
  const [userEmail, setUserEmail] = useState('sam@gmail.com');
  const [userPhone, setUserPhone] = useState('+91 98765 43210');
  const [fitnessGoal, setFitnessGoal] = useState('Muscle Building & Fitness');

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempPhone, setTempPhone] = useState(userPhone);
  const [tempGoal, setTempGoal] = useState(fitnessGoal);

  // Modals for support & privacy
  const [supportModal, setSupportModal] = useState(false);
  const [privacyModal, setPrivacyModal] = useState(false);

  const handleSaveProfile = () => {
    setUserName(tempName);
    setUserPhone(tempPhone);
    setFitnessGoal(tempGoal);
    setEditProfileModal(false);
    showToast({
      message: 'Profile updated successfully!',
      isSuccess: true,
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your GYMEZY account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            showToast({ message: 'Logged out successfully' });
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Profile</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Card */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.avatarRow}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
              }}
              style={styles.avatar}
            />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.profileName, { color: colors.text }]}>{userName}</Text>
              <Text style={[styles.profileEmail, { color: colors.subtitle }]}>{userEmail}</Text>
              <View style={styles.memberIdBadge}>
                <Text style={styles.memberIdText}>MEMBER ID: GYM-88219</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                setTempName(userName);
                setTempPhone(userPhone);
                setTempGoal(fitnessGoal);
                setEditProfileModal(true);
              }}
              style={[styles.editProfileIconBtn, { borderColor: colors.border }]}
            >
              <MaterialIcons name="edit" size={18} color={AppColors.primaryNavy} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Fitness Stats Counters */}
        <View style={styles.statsRow}>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.statNum, { color: AppColors.primaryNavy }]}>14</Text>
            <Text style={[styles.statLabel, { color: colors.subtitle }]}>Workouts</Text>
          </View>

          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.statNum, { color: AppColors.secondaryColor }]}>2</Text>
            <Text style={[styles.statLabel, { color: colors.subtitle }]}>Active Passes</Text>
          </View>

          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.statNum, { color: AppColors.accentColor }]}>8.4k</Text>
            <Text style={[styles.statLabel, { color: colors.subtitle }]}>kCal Burned</Text>
          </View>
        </View>

        {/* Quick Navigation Shortcuts */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>Quick Access</Text>

          <TouchableOpacity
            onPress={onNavigateToBookings}
            style={[
              styles.menuItemCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="calendar-today" size={20} color={AppColors.primaryNavy} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>My Bookings</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={colors.subtitle} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onNavigateToMemberships}
            style={[
              styles.menuItemCard,
              { backgroundColor: colors.card, borderColor: colors.border, marginTop: 8 },
            ]}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="card-membership" size={20} color={AppColors.secondaryColor} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>My Memberships</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={colors.subtitle} />
          </TouchableOpacity>
        </View>

        {/* Settings & Preferences */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>Settings & Appearance</Text>

          {/* Dark Mode */}
          <View
            style={[
              styles.menuItemCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons
                name={isDark ? 'dark-mode' : 'light-mode'}
                size={20}
                color={isDark ? '#93C5FD' : '#F59E0B'}
              />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Dark Theme Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#CBD5E1', true: AppColors.secondaryColor }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Notifications */}
          <View
            style={[
              styles.menuItemCard,
              { backgroundColor: colors.card, borderColor: colors.border, marginTop: 8 },
            ]}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="notifications-active" size={20} color={AppColors.accentColor} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#CBD5E1', true: AppColors.secondaryColor }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Support & Privacy */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>Help & Legal</Text>

          <TouchableOpacity
            onPress={() => setSupportModal(true)}
            style={[
              styles.menuItemCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="support-agent" size={20} color={AppColors.primaryNavy} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Help & 24/7 Support</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={colors.subtitle} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPrivacyModal(true)}
            style={[
              styles.menuItemCard,
              { backgroundColor: colors.card, borderColor: colors.border, marginTop: 8 },
            ]}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="security" size={20} color={AppColors.accentColor} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Privacy Policy</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={colors.subtitle} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} activeOpacity={0.8}>
          <MaterialIcons name="logout" size={18} color="#EF4444" style={{ marginRight: 8 }} />
          <Text style={styles.logoutBtnText}>Log Out Account</Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: colors.subtitle }]}>
          GYMEZY User App v1.0.0 (Expo React Native)
        </Text>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editProfileModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Profile</Text>

            <Text style={[styles.modalInputLabel, { color: colors.text }]}>Full Name</Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  color: colors.text,
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
              value={tempName}
              onChangeText={setTempName}
            />

            <Text style={[styles.modalInputLabel, { color: colors.text, marginTop: 12 }]}>
              Phone Number
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  color: colors.text,
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
              value={tempPhone}
              onChangeText={setTempPhone}
              keyboardType="phone-pad"
            />

            <Text style={[styles.modalInputLabel, { color: colors.text, marginTop: 12 }]}>
              Fitness Goal
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  color: colors.text,
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
              value={tempGoal}
              onChangeText={setTempGoal}
            />

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                onPress={() => setEditProfileModal(false)}
                style={[styles.modalBackBtn, { borderColor: colors.border }]}
              >
                <Text style={{ color: colors.text, fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveProfile}
                style={[styles.modalConfirmBtn, { backgroundColor: AppColors.secondaryColor }]}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Support Modal */}
      <Modal visible={supportModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>Help & Support</Text>
            <Text style={[styles.modalBodyText, { color: colors.subtitle }]}>
              For any booking or pass inquiries, contact our 24/7 GYMEZY Support desk:
            </Text>
            <Text style={[styles.contactHighlight, { color: AppColors.primaryNavy }]}>
              Email: support@gymezy.com{'\n'}Phone: +91 1800-425-GYMEZY
            </Text>
            <TouchableOpacity
              onPress={() => setSupportModal(false)}
              style={[styles.fullModalBtn, { backgroundColor: AppColors.primaryNavy }]}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal visible={privacyModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>Privacy & Security</Text>
            <Text style={[styles.modalBodyText, { color: colors.subtitle }]}>
              Your workout schedules, check-in QR codes, and personal details are protected with 256-bit AES encryption. We do not sell or share personal health metrics with external third parties.
            </Text>
            <TouchableOpacity
              onPress={() => setPrivacyModal(false)}
              style={[styles.fullModalBtn, { backgroundColor: AppColors.primaryNavy }]}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>Got it</Text>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 95,
  },
  profileCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '800',
  },
  profileEmail: {
    fontSize: 12.5,
    marginTop: 2,
  },
  memberIdBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  memberIdText: {
    color: AppColors.primaryNavy,
    fontSize: 9.5,
    fontWeight: '800',
  },
  editProfileIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '31%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  sectionBlock: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
  },
  menuItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#EF4444',
    marginTop: 10,
  },
  logoutBtnText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '800',
  },
  versionText: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 10,
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
    marginBottom: 14,
  },
  modalInputLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 6,
  },
  modalInput: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  modalActionsRow: {
    flexDirection: 'row',
    marginTop: 20,
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
  modalBodyText: {
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: 12,
  },
  contactHighlight: {
    fontSize: 13.5,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 20,
  },
  fullModalBtn: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
