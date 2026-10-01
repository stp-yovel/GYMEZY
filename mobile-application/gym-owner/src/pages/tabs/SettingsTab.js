import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import { AppColors } from '../../theme/appTheme';
import { useToast } from '../../widgets/CustomScaffoldMessage';
import { useAuth } from '../../context/AuthContext';

const GYM_PHOTOS = [
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop',
];

const DOCUMENTS_LIST = [
  { id: '1', name: 'GST Certificate', date: 'Uploaded on 12 Jan 2026', status: 'Verified' },
  { id: '2', name: 'Trade License', date: 'Uploaded on 12 Jan 2026', status: 'Verified' },
  { id: '3', name: 'PAN Card', date: 'Uploaded on 12 Jan 2026', status: 'Verified' },
  { id: '4', name: 'Aadhaar Card', date: 'Uploaded on 12 Jan 2026', status: 'Verified' },
  { id: '5', name: 'Address Proof', date: 'Uploaded on 12 Jan 2026', status: 'Verified' },
  { id: '6', name: 'Fire & Safety Certificate', date: 'Uploaded on 10 Feb 2026', status: 'Pending' },
  { id: '7', name: 'Insurance Certificate', date: 'Uploaded on 15 Mar 2026', status: 'Verified' },
];

const INITIAL_TRAINERS = [
  {
    id: 'TR-101',
    name: 'Arun Kumar',
    specialization: 'Strength Trainer',
    experience: '5 Years',
    type: 'Full Time',
    certificateStatus: 'Certificate Verified',
    avatar: 'AK',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'TR-102',
    name: 'Priya Sharma',
    specialization: 'Yoga Trainer',
    experience: '3 Years',
    type: 'Part Time',
    certificateStatus: 'Certificate Verified',
    avatar: 'PS',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'TR-103',
    name: 'Vikram Singh',
    specialization: 'Crossfit Trainer',
    experience: '4 Years',
    type: 'Contract',
    certificateStatus: 'Certificate Verified',
    avatar: 'VS',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'TR-104',
    name: 'Neha Verma',
    specialization: 'Zumba Trainer',
    experience: '2 Years',
    type: 'Part Time',
    certificateStatus: 'Certificate Pending',
    avatar: 'NV',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'TR-105',
    name: 'Rohan Dev',
    specialization: 'Cardio Trainer',
    experience: '6 Years',
    type: 'Full Time',
    certificateStatus: 'Certificate Verified',
    avatar: 'RD',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
  },
];

const INITIAL_EMPLOYEES = [
  {
    id: 'EMP-101',
    name: 'Ramesh Kumar',
    designation: 'Owner',
    role: 'Owner',
    joinedDate: 'Joined on 12 Jan 2023',
    status: 'Active',
    avatar: 'RK',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'EMP-102',
    name: 'Karthik Raj',
    designation: 'Admin',
    role: 'Admin',
    joinedDate: 'Joined on 10 Mar 2023',
    status: 'Active',
    avatar: 'KR',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'EMP-103',
    name: 'Meena Iyer',
    designation: 'Receptionist',
    role: 'Employee',
    joinedDate: 'Joined on 18 Apr 2023',
    status: 'Active',
    avatar: 'MI',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'EMP-104',
    name: 'Siva Kumar',
    designation: 'Trainer Assistant',
    role: 'Employee',
    joinedDate: 'Joined on 22 Apr 2023',
    status: 'Active',
    avatar: 'SK',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'EMP-105',
    name: 'Vijay Kumar',
    designation: 'Housekeeping',
    role: 'Employee',
    joinedDate: 'Joined on 05 May 2023',
    status: 'Active',
    avatar: 'VK',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
  },
];

const SECTION_CATEGORIES = [
  { key: 'all', label: 'All Sections', icon: 'apps' },
  { key: 'gym', label: 'Gym Access', icon: 'fitness-center', color: '#003882' },
  { key: 'yoga', label: 'Yoga Classes', icon: 'self-improvement', color: '#7c3aed' },
  { key: 'zumba', label: 'Zumba Sessions', icon: 'local-fire-department', color: '#db2777' },
  { key: 'other', label: 'Other Classes', icon: 'sports-kabaddi', color: '#059669' },
];

const INITIAL_SECTIONS = [
  {
    id: 'SEC-001',
    category: 'gym',
    categoryLabel: 'Gym Access',
    title: 'Gym Access (General Floor & Strength)',
    pricePerSession: 150,
    morningSlots: ['06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM'],
    eveningSlots: ['05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'],
    maxCapacity: 40,
    trainerName: 'Rajesh Varma',
    activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    isActive: true,
    description: 'Full access to cardio deck, free weights, resistance machines, and functional turf area.',
  },
  {
    id: 'SEC-002',
    category: 'yoga',
    categoryLabel: 'Yoga Classes',
    title: 'Hatha & Vinyasa Flow Yoga',
    pricePerSession: 249,
    morningSlots: ['06:30 AM', '07:30 AM', '08:30 AM'],
    eveningSlots: ['05:30 PM', '06:30 PM'],
    maxCapacity: 20,
    trainerName: 'Priya Sharma',
    activeDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    isActive: true,
    description: 'Guided traditional asana flow, breathwork (pranayama), and core flexibility enhancement.',
  },
  {
    id: 'SEC-003',
    category: 'zumba',
    categoryLabel: 'Zumba Sessions',
    title: 'Zumba Fitness Dance Workout',
    pricePerSession: 249,
    morningSlots: ['07:00 AM', '08:30 AM'],
    eveningSlots: ['06:00 PM', '07:30 PM'],
    maxCapacity: 25,
    trainerName: 'Neha Verma',
    activeDays: ['Mon', 'Tue', 'Thu', 'Sat'],
    isActive: true,
    description: 'Upbeat Latin dance routines fused with calorie-scorching aerobic interval training.',
  },
  {
    id: 'SEC-004',
    category: 'other',
    categoryLabel: 'Other Classes',
    title: 'HIIT & Cross Training Class',
    pricePerSession: 299,
    morningSlots: ['06:00 AM', '07:30 AM'],
    eveningSlots: ['06:00 PM', '07:00 PM', '08:00 PM'],
    maxCapacity: 18,
    trainerName: 'Vikram Singh',
    activeDays: ['Mon', 'Wed', 'Fri'],
    isActive: true,
    description: 'Explosive high-intensity intervals combining battle ropes, plyometrics, kettlebells, and sprints.',
  },
  {
    id: 'SEC-005',
    category: 'other',
    categoryLabel: 'Other Classes',
    title: 'Pilates & Core Conditioning',
    pricePerSession: 299,
    morningSlots: ['07:00 AM', '09:00 AM'],
    eveningSlots: ['05:30 PM', '07:00 PM'],
    maxCapacity: 16,
    trainerName: 'Arun Kumar',
    activeDays: ['Tue', 'Thu', 'Sat'],
    isActive: true,
    description: 'Mat-based Pilates focusing on postural alignment, core strength, and muscular endurance.',
  },
];

export const SettingsTab = ({ topInset, navigation }) => {
  const { isDark, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const { user, gym, logout } = useAuth();

  // Navigation state within Settings:
  // 'MAIN' | 'GYM_PROFILE' | 'BASIC_PROFILE' | 'SUBSCRIPTION' | 'DOCUMENTS' | 'ACCOUNT_DETAILS' | 'TRAINER_PROFILE' | 'ADD_TRAINER' | 'EMPLOYEES' | 'ADD_EMPLOYEE' | 'SECTIONS'
  const [activeSection, setActiveSection] = useState('MAIN');

  // Trainers state & filters
  const [trainers, setTrainers] = useState(INITIAL_TRAINERS);
  const [trainerTabType, setTrainerTabType] = useState('All');

  // Employees state & filters
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [employeeTabRole, setEmployeeTabRole] = useState('All');

  // Sections & Classes state & filters
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [sectionCategory, setSectionCategory] = useState('all');
  const [sectionSearchQuery, setSectionSearchQuery] = useState('');
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [secTitle, setSecTitle] = useState('');
  const [secCatKey, setSecCatKey] = useState('gym');
  const [secPrice, setSecPrice] = useState('');
  const [secCapacity, setSecCapacity] = useState('');
  const [secTrainerName, setSecTrainerName] = useState('');
  const [secDescription, setSecDescription] = useState('');

  // Add Trainer Form State
  const [newTrainerName, setNewTrainerName] = useState('');
  const [newTrainerSpec, setNewTrainerSpec] = useState('');
  const [newTrainerExp, setNewTrainerExp] = useState('');
  const [newTrainerType, setNewTrainerType] = useState('Full Time');
  const [trainerPhotoUri, setTrainerPhotoUri] = useState(null);
  const [trainerCertName, setTrainerCertName] = useState(null);

  // Add Employee Form State
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpDesignation, setNewEmpDesignation] = useState('');
  const [newEmpType, setNewEmpType] = useState('Full Time');
  const [newEmpRole, setNewEmpRole] = useState('Employee');
  const [empPhotoUri, setEmpPhotoUri] = useState(null);
  const [empCertName, setEmpCertName] = useState(null);

  // Picker & Action Sheet Modals
  const [showSpecPicker, setShowSpecPicker] = useState(false);
  const [showDesigPicker, setShowDesigPicker] = useState(false);
  const [selectedTrainerAction, setSelectedTrainerAction] = useState(null);
  const [selectedEmpAction, setSelectedEmpAction] = useState(null);

  // Operational toggles
  const [audioBeep, setAudioBeep] = useState(true);
  const [smsReminders, setSmsReminders] = useState(true);
  const [checkinAlerts, setCheckinAlerts] = useState(true);
  const [autoRenewal, setAutoRenewal] = useState(true);

  // Editable pricing / timings state
  const [timings, setTimings] = useState('Mon - Sun: 5:00 AM - 11:00 PM');
  const [showEditTimingsModal, setShowEditTimingsModal] = useState(false);
  const [tempTimings, setTempTimings] = useState(timings);

  // Document tab state
  const [docTab, setDocTab] = useState('All Documents');

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of the Partner Portal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            showToast({ message: 'Signed out of Partner Portal successfully' });
            if (navigation?.replace) {
              navigation.replace('Login');
            }
          },
        },
      ]
    );
  };

  const handleSaveTrainer = () => {
    if (!newTrainerName.trim()) {
      showToast({ message: 'Please enter trainer name', isError: true });
      return;
    }

    const initials = newTrainerName
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newObj = {
      id: `TR-${Math.floor(100 + Math.random() * 900)}`,
      name: newTrainerName.trim(),
      specialization: newTrainerSpec || 'Fitness Trainer',
      experience: `${newTrainerExp || '1'} Years`,
      type: newTrainerType,
      certificateStatus: 'Certificate Verified',
      avatar: initials || 'TR',
      image:
        trainerPhotoUri ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    };

    setTrainers([newObj, ...trainers]);
    setNewTrainerName('');
    setNewTrainerSpec('');
    setNewTrainerExp('');
    setTrainerPhotoUri(null);
    setTrainerCertName(null);
    setActiveSection('TRAINER_PROFILE');
    showToast({ message: `Trainer ${newObj.name} added successfully!`, isSuccess: true });
  };

  const handleSaveEmployee = () => {
    if (!newEmpName.trim()) {
      showToast({ message: 'Please enter employee name', isError: true });
      return;
    }

    const initials = newEmpName
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newObj = {
      id: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      name: newEmpName.trim(),
      designation: newEmpDesignation || 'Staff',
      role: newEmpRole,
      joinedDate: 'Joined on Today',
      status: 'Active',
      avatar: initials || 'EM',
      image:
        empPhotoUri ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    };

    setEmployees([newObj, ...employees]);
    setNewEmpName('');
    setNewEmpDesignation('');
    setEmpPhotoUri(null);
    setEmpCertName(null);
    setActiveSection('EMPLOYEES');
    showToast({ message: `Employee ${newObj.name} saved successfully!`, isSuccess: true });
  };

  const handleOpenAddSection = () => {
    setEditingSection(null);
    setSecTitle('');
    setSecCatKey('gym');
    setSecPrice('199');
    setSecCapacity('25');
    setSecTrainerName('Arun Kumar');
    setSecDescription('');
    setShowSectionModal(true);
  };

  const handleOpenEditSection = (item) => {
    setEditingSection(item);
    setSecTitle(item.title);
    setSecCatKey(item.category);
    setSecPrice(String(item.pricePerSession));
    setSecCapacity(String(item.maxCapacity));
    setSecTrainerName(item.trainerName || '');
    setSecDescription(item.description || '');
    setShowSectionModal(true);
  };

  const handleSaveSection = () => {
    if (!secTitle.trim()) {
      showToast({ message: 'Please enter a section/class title', isSuccess: false });
      return;
    }
    const catObj = SECTION_CATEGORIES.find((c) => c.key === secCatKey) || SECTION_CATEGORIES[1];
    if (editingSection) {
      setSections((prev) =>
        prev.map((s) =>
          s.id === editingSection.id
            ? {
                ...s,
                title: secTitle.trim(),
                category: secCatKey,
                categoryLabel: catObj.label,
                pricePerSession: Number(secPrice) || 150,
                maxCapacity: Number(secCapacity) || 20,
                trainerName: secTrainerName.trim() || 'Assigned Coach',
                description: secDescription.trim(),
              }
            : s
        )
      );
      showToast({ message: `Section "${secTitle}" updated!`, isSuccess: true });
    } else {
      const newSec = {
        id: `SEC-${Date.now().toString().slice(-4)}`,
        title: secTitle.trim(),
        category: secCatKey,
        categoryLabel: catObj.label,
        pricePerSession: Number(secPrice) || 150,
        morningSlots: ['06:00 AM', '08:00 AM'],
        eveningSlots: ['05:30 PM', '07:00 PM'],
        maxCapacity: Number(secCapacity) || 20,
        trainerName: secTrainerName.trim() || 'Assigned Coach',
        activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        isActive: true,
        description: secDescription.trim() || 'Floor workouts and guided sessions.',
      };
      setSections((prev) => [newSec, ...prev]);
      showToast({ message: `Section "${secTitle}" created!`, isSuccess: true });
    }
    setShowSectionModal(false);
  };

  const handleToggleSectionActive = (id) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = !s.isActive;
          showToast({
            message: `${s.title} ${updated ? 'activated' : 'paused'}`,
            isSuccess: updated,
          });
          return { ...s, isActive: updated };
        }
        return s;
      })
    );
  };

  const handleDeleteSection = (id, name) => {
    Alert.alert('Delete Section', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setSections((prev) => prev.filter((s) => s.id !== id));
          showToast({ message: `Section "${name}" removed`, isSuccess: true });
        },
      },
    ]);
  };

  /* -------------------------------------------------------------------------- */
  /* 1. MAIN HUB: "Manage Your Gym" Dashboard                                    */
  /* -------------------------------------------------------------------------- */
  const renderMainHub = () => (
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
      {/* 1. Gym Profile Header Card */}
      <View
        style={[
          styles.profileCard,
          {
            backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
            borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
          },
        ]}
      >
        <View style={styles.profileTopRow}>
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
            <View style={styles.profileNameRow}>
              <Text
                style={[
                  styles.profileGymName,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                {gym?.name || user?.fullName || 'Gym Facility'}
              </Text>
              <View style={styles.activeStatusPill}>
                <View style={styles.activeDot} />
                <Text style={styles.activeStatusText}>
                  {gym?.subscriptionStatus || gym?.approvalStatus || 'Active'}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.profileGymMeta,
                { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' },
              ]}
            >
              {gym?.city ? (gym?.area ? `${gym.area}, ${gym.city}` : gym.city) : gym?.fullAddress || 'Partner Location'}
            </Text>
        </View>
      </View>

      {/* Section Title: Manage Your Gym */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Manage Your Gym
        </Text>
        <Text style={[styles.sectionSub, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
          Update all your gym and account details
        </Text>
      </View>

      {/* Menu Navigation Tiles List */}
      <View
        style={[
          styles.menuCardContainer,
          {
            backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
            borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
          },
        ]}
      >
        {/* Tile 1: Gym Profile */}
        <TouchableOpacity
          style={styles.menuItemRow}
          onPress={() => setActiveSection('GYM_PROFILE')}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIconBox, { backgroundColor: 'rgba(99, 102, 241, 0.12)' }]}>
            <MaterialIcons name="fitness-center" size={22} color={AppColors.accentColor} />
          </View>
          <View style={styles.menuTextBox}>
            <Text style={[styles.menuTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Gym Profile
            </Text>
            <Text style={[styles.menuDesc, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              Timings, Pricing, Facilities & more
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
        </TouchableOpacity>

        <View style={[styles.menuDivider, { backgroundColor: isDark ? AppColors.darkBorder : '#F1F5F9' }]} />

        {/* Tile 2: Basic Profile */}
        <TouchableOpacity
          style={styles.menuItemRow}
          onPress={() => setActiveSection('BASIC_PROFILE')}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.12)' }]}>
            <MaterialIcons name="storefront" size={22} color="#3B82F6" />
          </View>
          <View style={styles.menuTextBox}>
            <Text style={[styles.menuTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Basic Profile
            </Text>
            <Text style={[styles.menuDesc, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              Gym info, Photos, Address & Location
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
        </TouchableOpacity>

        <View style={[styles.menuDivider, { backgroundColor: isDark ? AppColors.darkBorder : '#F1F5F9' }]} />

        {/* Tile 3: Sections & Classes (Ported from Web) */}
        <TouchableOpacity
          style={styles.menuItemRow}
          onPress={() => setActiveSection('SECTIONS')}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIconBox, { backgroundColor: 'rgba(0, 56, 130, 0.12)' }]}>
            <MaterialIcons name="layers" size={22} color={AppColors.primaryColor} />
          </View>
          <View style={styles.menuTextBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[styles.menuTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Sections & Classes
              </Text>
              <View style={[styles.secCountBadgeTile, { backgroundColor: `${AppColors.primaryColor}20` }]}>
                <Text style={[styles.secCountBadgeTileText, { color: AppColors.primaryColor }]}>
                  {sections.length}
                </Text>
              </View>
            </View>
            <Text style={[styles.menuDesc, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              Floor access, yoga, zumba & class schedules
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
        </TouchableOpacity>

        <View style={[styles.menuDivider, { backgroundColor: isDark ? AppColors.darkBorder : '#F1F5F9' }]} />

        {/* Tile 4: Trainer Profile */}
        <TouchableOpacity
          style={styles.menuItemRow}
          onPress={() => setActiveSection('TRAINER_PROFILE')}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIconBox, { backgroundColor: 'rgba(236, 72, 153, 0.12)' }]}>
            <MaterialIcons name="sports" size={22} color="#EC4899" />
          </View>
          <View style={styles.menuTextBox}>
            <Text style={[styles.menuTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Trainer Profile
            </Text>
            <Text style={[styles.menuDesc, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              Manage trainers and certificates
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
        </TouchableOpacity>

        <View style={[styles.menuDivider, { backgroundColor: isDark ? AppColors.darkBorder : '#F1F5F9' }]} />

        {/* Tile 5: Employees */}
        <TouchableOpacity
          style={styles.menuItemRow}
          onPress={() => setActiveSection('EMPLOYEES')}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIconBox, { backgroundColor: 'rgba(168, 85, 247, 0.12)' }]}>
            <MaterialIcons name="groups" size={22} color="#A855F7" />
          </View>
          <View style={styles.menuTextBox}>
            <Text style={[styles.menuTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Employees
            </Text>
            <Text style={[styles.menuDesc, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              Manage employees and roles
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
        </TouchableOpacity>

        <View style={[styles.menuDivider, { backgroundColor: isDark ? AppColors.darkBorder : '#F1F5F9' }]} />

        {/* Tile 6: Subscription */}
        <TouchableOpacity
          style={styles.menuItemRow}
          onPress={() => setActiveSection('SUBSCRIPTION')}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIconBox, { backgroundColor: 'rgba(0, 191, 98, 0.12)' }]}>
            <MaterialIcons name="card-membership" size={22} color={AppColors.secondaryColor} />
          </View>
          <View style={styles.menuTextBox}>
            <Text style={[styles.menuTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Subscription
            </Text>
            <Text style={[styles.menuDesc, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              View and manage partner subscription
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
        </TouchableOpacity>

        <View style={[styles.menuDivider, { backgroundColor: isDark ? AppColors.darkBorder : '#F1F5F9' }]} />

        {/* Tile 6: Documents */}
        <TouchableOpacity
          style={styles.menuItemRow}
          onPress={() => setActiveSection('DOCUMENTS')}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
            <MaterialIcons name="description" size={22} color={AppColors.warningAmber} />
          </View>
          <View style={styles.menuTextBox}>
            <Text style={[styles.menuTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Documents
            </Text>
            <Text style={[styles.menuDesc, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              Manage gym compliance & certificates
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
        </TouchableOpacity>

        <View style={[styles.menuDivider, { backgroundColor: isDark ? AppColors.darkBorder : '#F1F5F9' }]} />

        {/* Tile 7: Account Details */}
        <TouchableOpacity
          style={styles.menuItemRow}
          onPress={() => setActiveSection('ACCOUNT_DETAILS')}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIconBox, { backgroundColor: 'rgba(0, 56, 130, 0.12)' }]}>
            <MaterialIcons name="account-balance" size={22} color={AppColors.primaryColor} />
          </View>
          <View style={styles.menuTextBox}>
            <Text style={[styles.menuTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Account Details
            </Text>
            <Text style={[styles.menuDesc, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              Bank details and weekly payouts
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
        </TouchableOpacity>
      </View>

      {/* Appearance Section */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Appearance
        </Text>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
            borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
          },
        ]}
      >
        <View style={styles.settingRow}>
          <View style={[styles.menuIconBox, { backgroundColor: 'rgba(0, 56, 130, 0.08)' }]}>
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={20}
              color={isDark ? '#F59E0B' : AppColors.primaryColor}
            />
          </View>
          <View style={styles.settingTextBox}>
            <Text style={[styles.settingLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Dark Mode
            </Text>
            <Text style={[styles.settingSub, { color: isDark ? 'rgba(255,255,255,0.55)' : '#64748B' }]}>
              {isDark ? 'Dark theme is active' : 'Light theme is active'}
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#CBD5E1', true: AppColors.primaryColor }}
            thumbColor={isDark ? AppColors.secondaryColor : '#FFFFFF'}
          />
        </View>
      </View>

      {/* Preferences Section */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Scanner & Notifications
        </Text>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
            borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
          },
        ]}
      >
        <View style={styles.settingRow}>
          <View style={[styles.menuIconBox, { backgroundColor: 'rgba(99, 102, 241, 0.08)' }]}>
            <MaterialIcons name="volume-up" size={20} color={AppColors.accentColor} />
          </View>
          <View style={styles.settingTextBox}>
            <Text style={[styles.settingLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              QR Scan Sound
            </Text>
            <Text style={[styles.settingSub, { color: isDark ? 'rgba(255,255,255,0.55)' : '#64748B' }]}>
              Audio chime on valid member QR pass check-in
            </Text>
          </View>
          <Switch
            value={audioBeep}
            onValueChange={setAudioBeep}
            trackColor={{ false: '#CBD5E1', true: AppColors.primaryColor }}
            thumbColor={audioBeep ? AppColors.secondaryColor : '#FFFFFF'}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: isDark ? AppColors.darkBorder : '#F1F5F9' }]} />

        <View style={styles.settingRow}>
          <View style={[styles.menuIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.08)' }]}>
            <MaterialIcons name="sms" size={20} color={AppColors.warningAmber} />
          </View>
          <View style={styles.settingTextBox}>
            <Text style={[styles.settingLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Automated SMS Reminders
            </Text>
            <Text style={[styles.settingSub, { color: isDark ? 'rgba(255,255,255,0.55)' : '#64748B' }]}>
              Send SMS alerts 3 days before membership expiry
            </Text>
          </View>
          <Switch
            value={smsReminders}
            onValueChange={setSmsReminders}
            trackColor={{ false: '#CBD5E1', true: AppColors.primaryColor }}
            thumbColor={smsReminders ? AppColors.secondaryColor : '#FFFFFF'}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: isDark ? AppColors.darkBorder : '#F1F5F9' }]} />

        <View style={styles.settingRow}>
          <View style={[styles.menuIconBox, { backgroundColor: 'rgba(0, 191, 98, 0.08)' }]}>
            <Ionicons name="notifications" size={20} color={AppColors.secondaryColor} />
          </View>
          <View style={styles.settingTextBox}>
            <Text style={[styles.settingLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Check-in Push Alerts
            </Text>
            <Text style={[styles.settingSub, { color: isDark ? 'rgba(255,255,255,0.55)' : '#64748B' }]}>
              Receive instant alerts when VIP members arrive
            </Text>
          </View>
          <Switch
            value={checkinAlerts}
            onValueChange={setCheckinAlerts}
            trackColor={{ false: '#CBD5E1', true: AppColors.primaryColor }}
            thumbColor={checkinAlerts ? AppColors.secondaryColor : '#FFFFFF'}
          />
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        activeOpacity={0.85}
      >
        <MaterialIcons name="logout" size={20} color="#EF4444" />
        <Text style={styles.logoutBtnText}>Sign Out of Partner Portal</Text>
      </TouchableOpacity>

      {/* Version Text */}
      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: isDark ? 'rgba(255,255,255,0.3)' : '#94A3B8' }]}>
          GYMEZY Partner Portal v1.0.4 • Build 42
        </Text>
      </View>
    </ScrollView>
  );

  /* -------------------------------------------------------------------------- */
  /* 2. SUB-VIEW: "Gym Profile" (Timings, Session & Membership Pricing)         */
  /* -------------------------------------------------------------------------- */
  const renderGymProfileSubView = () => (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: topInset + 12, paddingBottom: 110 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.subHeaderRow}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
          onPress={() => setActiveSection('MAIN')}
        >
          <MaterialIcons name="arrow-back" size={22} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </TouchableOpacity>
        <Text style={[styles.subHeaderTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Gym Profile
        </Text>
        <View style={{ width: 42 }} />
      </View>

      {/* Gym Timings Card */}
      <View style={[styles.card, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}>
        <View style={styles.cardHeaderWithEdit}>
          <View style={styles.cardHeaderLeft}>
            <MaterialIcons name="schedule" size={20} color={AppColors.accentColor} />
            <Text style={[styles.cardHeaderTitleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Gym Timings
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editPillBtn}
            onPress={() => {
              setTempTimings(timings);
              setShowEditTimingsModal(true);
            }}
          >
            <Text style={styles.editPillText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.timingsDays, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
          Mon - Sun
        </Text>
        <Text style={[styles.timingsHours, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          {timings}
        </Text>
      </View>

      {/* Session Booking Price Card */}
      <View style={[styles.card, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}>
        <View style={styles.cardHeaderWithEdit}>
          <View style={styles.cardHeaderLeft}>
            <MaterialIcons name="timer" size={20} color={AppColors.primaryColor} />
            <View>
              <Text style={[styles.cardHeaderTitleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Session Booking Price
              </Text>
              <Text style={[styles.cardSubText, { color: isDark ? 'rgba(255,255,255,0.55)' : '#64748B' }]}>
                Session Duration & Price
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editPillBtn}
            onPress={() => showToast({ message: 'Pricing editor active', isSuccess: true })}
          >
            <Text style={styles.editPillText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.priceRowItem}>
          <Text style={[styles.priceDurationLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155' }]}>
            60 Minutes
          </Text>
          <Text style={[styles.priceAmountVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            ₹ 199
          </Text>
        </View>

        <View style={styles.priceRowItem}>
          <Text style={[styles.priceDurationLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155' }]}>
            90 Minutes
          </Text>
          <Text style={[styles.priceAmountVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            ₹ 279
          </Text>
        </View>

        <View style={[styles.priceRowItem, { borderBottomWidth: 0 }]}>
          <Text style={[styles.priceDurationLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155' }]}>
            120 Minutes
          </Text>
          <Text style={[styles.priceAmountVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            ₹ 349
          </Text>
        </View>
      </View>

      {/* Membership Pricing Card */}
      <View style={[styles.card, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}>
        <View style={styles.cardHeaderWithEdit}>
          <View style={styles.cardHeaderLeft}>
            <MaterialIcons name="card-membership" size={20} color={AppColors.secondaryColor} />
            <View>
              <Text style={[styles.cardHeaderTitleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Membership Pricing
              </Text>
              <Text style={[styles.cardSubText, { color: isDark ? 'rgba(255,255,255,0.55)' : '#64748B' }]}>
                Manage membership plans
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editPillBtn}
            onPress={() => showToast({ message: 'Plan rates updated' })}
          >
            <Text style={styles.editPillText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.priceRowItem}>
          <Text style={[styles.priceDurationLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155' }]}>
            Monthly
          </Text>
          <Text style={[styles.priceAmountVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            ₹ 2,499
          </Text>
        </View>

        <View style={styles.priceRowItem}>
          <Text style={[styles.priceDurationLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155' }]}>
            Quarterly (3 Months)
          </Text>
          <Text style={[styles.priceAmountVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            ₹ 6,599
          </Text>
        </View>

        <View style={styles.priceRowItem}>
          <Text style={[styles.priceDurationLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155' }]}>
            Half Yearly (6 Months)
          </Text>
          <Text style={[styles.priceAmountVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            ₹ 12,599
          </Text>
        </View>

        <View style={[styles.priceRowItem, { borderBottomWidth: 0 }]}>
          <Text style={[styles.priceDurationLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155' }]}>
            Annually (12 Months)
          </Text>
          <Text style={[styles.priceAmountVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            ₹ 22,599
          </Text>
        </View>
      </View>

      {/* Facilities & Amenities Row */}
      <TouchableOpacity
        style={[styles.actionCardRow, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
        onPress={() =>
          Alert.alert(
            'Facilities & Amenities',
            'Active Facilities:\n• Air Conditioned Gym\n• Shower & Changing Lockers\n• Free Wi-Fi\n• Valet Parking\n• Steam & Sauna Bath\n• Personal Coaching Zone'
          )
        }
      >
        <View style={styles.actionCardLeft}>
          <MaterialIcons name="pool" size={22} color={AppColors.accentColor} />
          <View>
            <Text style={[styles.actionCardTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Facilities & Amenities
            </Text>
            <Text style={[styles.actionCardDesc, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              Add or remove facilities
            </Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={22} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
      </TouchableOpacity>

      {/* Terms & Conditions Row */}
      <TouchableOpacity
        style={[styles.actionCardRow, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
        onPress={() =>
          Alert.alert(
            'Terms & Conditions',
            'Gym Rules & Safety Policy:\n1. Members must wear proper sports shoes\n2. Re-rack weights after use\n3. Cancellation permitted up to 2 hours before session'
          )
        }
      >
        <View style={styles.actionCardLeft}>
          <MaterialIcons name="gavel" size={22} color={AppColors.warningAmber} />
          <View>
            <Text style={[styles.actionCardTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Terms & Conditions
            </Text>
            <Text style={[styles.actionCardDesc, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              Update gym terms & conditions
            </Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={22} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
      </TouchableOpacity>
    </ScrollView>
  );

  /* -------------------------------------------------------------------------- */
  /* 3. SUB-VIEW: "Basic Profile" (Photos, Info, Address & Map)                 */
  /* -------------------------------------------------------------------------- */
  const renderBasicProfileSubView = () => (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: topInset + 12, paddingBottom: 110 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.subHeaderRow}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
          onPress={() => setActiveSection('MAIN')}
        >
          <MaterialIcons name="arrow-back" size={22} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </TouchableOpacity>
        <Text style={[styles.subHeaderTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Basic Profile
        </Text>
        <View style={{ width: 42 }} />
      </View>

      {/* Gym Photos Carousel */}
      <View style={[styles.card, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}>
        <Text style={[styles.cardHeaderTitleText, { color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: 12 }]}>
          Gym Photos
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photosScroll}>
          {GYM_PHOTOS.map((uri, idx) => (
            <Image key={idx} source={{ uri }} style={styles.photoThumb} resizeMode="cover" />
          ))}
          <TouchableOpacity
            style={[styles.addPhotoBtn, { borderColor: AppColors.accentColor }]}
            onPress={() => showToast({ message: 'Photo gallery selector opened' })}
          >
            <MaterialIcons name="add-photo-alternate" size={24} color={AppColors.accentColor} />
            <Text style={[styles.addPhotoText, { color: AppColors.accentColor }]}>+ Add Photo</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Basic Info Fields */}
      <View style={[styles.card, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}>
        <View style={styles.infoFieldItem}>
          <Text style={[styles.infoFieldLabel, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
            Gym Name
          </Text>
          <Text style={[styles.infoFieldValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            {gym?.name || 'Gym Facility'}
          </Text>
        </View>

        <View style={styles.infoFieldItem}>
          <Text style={[styles.infoFieldLabel, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
            Phone Number
          </Text>
          <View style={styles.iconValRow}>
            <Ionicons name="call-outline" size={16} color={AppColors.primaryColor} />
            <Text style={[styles.infoFieldValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              {gym?.phone || user?.phone || 'Not Specified'}
            </Text>
          </View>
        </View>

        <View style={styles.infoFieldItem}>
          <Text style={[styles.infoFieldLabel, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
            Email
          </Text>
          <View style={styles.iconValRow}>
            <MaterialIcons name="mail-outline" size={16} color={AppColors.primaryColor} />
            <Text style={[styles.infoFieldValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              {gym?.email || user?.email || 'Not Specified'}
            </Text>
          </View>
        </View>

        <View style={styles.infoFieldItem}>
          <Text style={[styles.infoFieldLabel, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
            Address
          </Text>
          <View style={styles.iconValRow}>
            <MaterialIcons name="location-on" size={18} color={AppColors.dangerRed} />
            <Text style={[styles.infoFieldValue, { color: isDark ? '#FFFFFF' : '#0F172A', flex: 1 }]}>
              {gym?.fullAddress || gym?.address || (gym?.city ? `${gym.area || gym.city}, ${gym.city}` : 'Partner Location')}
            </Text>
          </View>
        </View>
      </View>

      {/* Map Location Card */}
      <View style={[styles.card, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}>
        <Text style={[styles.cardHeaderTitleText, { color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: 10 }]}>
          Map Location
        </Text>
        <View style={styles.mapSnapshotBox}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop',
            }}
            style={styles.mapImage}
            resizeMode="cover"
          />
          <View style={styles.mapPinBadge}>
            <MaterialIcons name="location-pin" size={28} color="#EF4444" />
            <Text style={styles.mapPinText}>{gym?.city || 'Partner Location'}</Text>
          </View>
        </View>
      </View>

      {/* Website Row */}
      <View style={[styles.card, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}>
        <Text style={[styles.infoFieldLabel, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
          Website
        </Text>
        <View style={styles.iconValRow}>
          <Ionicons name="globe-outline" size={16} color={AppColors.accentColor} />
          <Text style={[styles.infoFieldValue, { color: isDark ? '#93C5FD' : AppColors.primaryColor }]}>
            {gym?.website || 'gymezy.com'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  /* -------------------------------------------------------------------------- */
  /* 4. SUB-VIEW: "Subscription" (Current Plan, Auto Renewal & Methods)         */
  /* -------------------------------------------------------------------------- */
  const renderSubscriptionSubView = () => (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: topInset + 12, paddingBottom: 110 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.subHeaderRow}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
          onPress={() => setActiveSection('MAIN')}
        >
          <MaterialIcons name="arrow-back" size={22} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </TouchableOpacity>
        <Text style={[styles.subHeaderTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Subscription
        </Text>
        <View style={{ width: 42 }} />
      </View>

      {/* Current Plan Purple Card */}
      <LinearGradient
        colors={['#4F46E5', '#3730A3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.currentPlanCard}
      >
        <View style={styles.planCardTop}>
          <View>
            <Text style={styles.planCardBadgeText}>Current Plan</Text>
            <Text style={styles.planCardTitle}>Hybrid Plan</Text>
          </View>
          <View style={styles.planValidityBox}>
            <View style={styles.planActivePill}>
              <Text style={styles.planActivePillText}>Active</Text>
            </View>
            <Text style={styles.planValidTillText}>Valid Till 20 Aug 2026</Text>
          </View>
        </View>

        <View style={styles.planCardBottomRow}>
          <Text style={styles.planCardPrice}>₹ 7,499 / Quarterly</Text>
          <TouchableOpacity
            style={styles.viewBenefitsBtn}
            onPress={() => Alert.alert('Hybrid Plan Benefits', '• Unlimited Member Check-ins\n• Multi-scanner Support\n• Automated Expiry Alerts\n• Zero Commission on Direct QR Sales')}
          >
            <Text style={styles.viewBenefitsText}>View Benefits</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Plan Details Table */}
      <View style={[styles.card, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}>
        <View style={styles.planTableRow}>
          <View style={styles.tableLabelRow}>
            <MaterialIcons name="badge" size={16} color={isDark ? 'rgba(255,255,255,0.6)' : '#64748B'} />
            <Text style={[styles.tableLabel, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              Plan Type
            </Text>
          </View>
          <Text style={[styles.tableVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Hybrid Plan
          </Text>
        </View>

        <View style={styles.planTableRow}>
          <View style={styles.tableLabelRow}>
            <MaterialIcons name="refresh" size={16} color={isDark ? 'rgba(255,255,255,0.6)' : '#64748B'} />
            <Text style={[styles.tableLabel, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              Billing Cycle
            </Text>
          </View>
          <Text style={[styles.tableVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Quarterly
          </Text>
        </View>

        <View style={styles.planTableRow}>
          <View style={styles.tableLabelRow}>
            <MaterialIcons name="event" size={16} color={isDark ? 'rgba(255,255,255,0.6)' : '#64748B'} />
            <Text style={[styles.tableLabel, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              Start Date
            </Text>
          </View>
          <Text style={[styles.tableVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            20 May 2026
          </Text>
        </View>

        <View style={styles.planTableRow}>
          <View style={styles.tableLabelRow}>
            <MaterialIcons name="update" size={16} color={isDark ? 'rgba(255,255,255,0.6)' : '#64748B'} />
            <Text style={[styles.tableLabel, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              Next Renewal
            </Text>
          </View>
          <Text style={[styles.tableVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            20 Aug 2026
          </Text>
        </View>

        <View style={[styles.planTableRow, { borderBottomWidth: 0 }]}>
          <View style={styles.tableLabelRow}>
            <MaterialIcons name="autorenew" size={16} color={isDark ? '#FFFFFF' : '#0F172A'} />
            <Text style={[styles.tableLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Auto Renewal
            </Text>
          </View>
          <Switch
            value={autoRenewal}
            onValueChange={setAutoRenewal}
            trackColor={{ false: '#CBD5E1', true: AppColors.primaryColor }}
            thumbColor={autoRenewal ? AppColors.secondaryColor : '#FFFFFF'}
          />
        </View>

        <Text style={[styles.renewalNote, { color: isDark ? 'rgba(255,255,255,0.5)' : '#64748B' }]}>
          Your subscription will renew automatically on 20 Aug 2026
        </Text>
      </View>

      {/* Plan Actions Row */}
      <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: 12 }]}>
        Actions
      </Text>

      <View style={styles.planActionsGrid}>
        <TouchableOpacity
          style={[styles.planActionItem, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
          onPress={() => showToast({ message: 'Select higher plan tier to upgrade', isSuccess: true })}
        >
          <MaterialIcons name="arrow-upward" size={24} color={AppColors.secondaryColor} />
          <Text style={[styles.planActionText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Upgrade Plan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.planActionItem, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
          onPress={() => showToast({ message: 'Downgrade options available at renewal' })}
        >
          <MaterialIcons name="arrow-downward" size={24} color={AppColors.warningAmber} />
          <Text style={[styles.planActionText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Downgrade Plan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.planActionItem, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
          onPress={() => Alert.alert('Cancel Plan', 'Are you sure you want to cancel plan auto-renewal?')}
        >
          <MaterialIcons name="close" size={24} color={AppColors.dangerRed} />
          <Text style={[styles.planActionText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Cancel Plan
          </Text>
        </TouchableOpacity>
      </View>

      {/* Payment Methods */}
      <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: 12, marginTop: 10 }]}>
        Payment Methods
      </Text>

      <View style={[styles.card, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}>
        <View style={styles.cardMethodRow}>
          <View style={styles.visaIconBox}>
            <Text style={styles.visaText}>VISA</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardNumberText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              **** **** **** 4242
            </Text>
            <Text style={[styles.cardExpText, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              Expires 12/27
            </Text>
          </View>
          <View style={styles.defaultPill}>
            <Text style={styles.defaultPillText}>Default</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addPaymentBtn}
          onPress={() => showToast({ message: 'Add payment method modal active' })}
        >
          <MaterialIcons name="add" size={18} color={AppColors.primaryColor} />
          <Text style={styles.addPaymentBtnText}>+ Add Payment Method</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  /* -------------------------------------------------------------------------- */
  /* 5. SUB-VIEW: "Documents" (Certificates & Verification)                      */
  /* -------------------------------------------------------------------------- */
  const renderDocumentsSubView = () => (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: topInset + 12, paddingBottom: 110 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.subHeaderRow}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
          onPress={() => setActiveSection('MAIN')}
        >
          <MaterialIcons name="arrow-back" size={22} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </TouchableOpacity>
        <Text style={[styles.subHeaderTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Gym Documents
        </Text>
        <View style={{ width: 42 }} />
      </View>

      {/* Sub-tabs: All Documents vs Expiring Soon */}
      <View style={[styles.docTabsContainer, { borderBottomColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}>
        {['All Documents', 'Expiring Soon'].map((tab) => {
          const isSelected = docTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[
                styles.docTabItem,
                isSelected && {
                  borderBottomColor: isDark ? AppColors.darkAccentColor : AppColors.primaryColor,
                  borderBottomWidth: 2.5,
                },
              ]}
              onPress={() => setDocTab(tab)}
            >
              <Text
                style={[
                  styles.docTabText,
                  {
                    color: isSelected
                      ? isDark
                        ? '#93C5FD'
                        : AppColors.primaryColor
                      : isDark
                      ? 'rgba(255,255,255,0.5)'
                      : '#64748B',
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

      {/* Documents List */}
      <View style={{ marginTop: 14 }}>
        {DOCUMENTS_LIST.map((doc) => {
          const isVerified = doc.status === 'Verified';
          return (
            <View
              key={doc.id}
              style={[
                styles.docCard,
                {
                  backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
                  borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                },
              ]}
            >
              <View style={[styles.docIconBox, { backgroundColor: 'rgba(99, 102, 241, 0.12)' }]}>
                <MaterialIcons name="description" size={22} color={AppColors.accentColor} />
              </View>

              <View style={styles.docInfoBox}>
                <Text style={[styles.docNameText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  {doc.name}
                </Text>
                <Text style={[styles.docDateText, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
                  {doc.date}
                </Text>
              </View>

              <View
                style={[
                  styles.docStatusBadge,
                  {
                    backgroundColor: isVerified ? 'rgba(0, 191, 98, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.docStatusBadgeText,
                    { color: isVerified ? AppColors.secondaryColor : AppColors.warningAmber },
                  ]}
                >
                  {doc.status}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.docDownloadBtn}
                onPress={() => showToast({ message: `Downloading ${doc.name}`, isSuccess: true })}
              >
                <MaterialIcons name="file-download" size={20} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Upload New Document Card */}
      <TouchableOpacity
        style={[styles.uploadNewDocBtn, { borderColor: AppColors.primaryColor }]}
        onPress={() => showToast({ message: 'Document picker initialized' })}
      >
        <MaterialIcons name="cloud-upload" size={22} color={AppColors.primaryColor} />
        <Text style={styles.uploadNewDocText}>+ Upload Other Document</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  /* -------------------------------------------------------------------------- */
  /* 6. SUB-VIEW: "Account Details" (Bank Details & Payouts)                     */
  /* -------------------------------------------------------------------------- */
  const renderAccountDetailsSubView = () => (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: topInset + 12, paddingBottom: 110 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.subHeaderRow}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
          onPress={() => setActiveSection('MAIN')}
        >
          <MaterialIcons name="arrow-back" size={22} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </TouchableOpacity>
        <Text style={[styles.subHeaderTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Account Details
        </Text>
        <View style={{ width: 42 }} />
      </View>

      {/* Bank Account Verification Card */}
      <View style={[styles.card, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}>
        <View style={styles.cardHeaderWithEdit}>
          <Text style={[styles.cardHeaderTitleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Bank Account
          </Text>
          <View style={styles.verifiedGreenPill}>
            <MaterialIcons name="check-circle" size={14} color={AppColors.secondaryColor} />
            <Text style={styles.verifiedGreenText}>Verified</Text>
          </View>
        </View>

        <View style={styles.bankFieldItem}>
          <Text style={[styles.bankFieldLabel, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
            Account Holder Name
          </Text>
          <Text style={[styles.bankFieldValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            {gym?.bankDetails?.accountHolder || gym?.name || user?.fullName || 'Gym Enterprise'}
          </Text>
        </View>

        <View style={styles.bankFieldItem}>
          <Text style={[styles.bankFieldLabel, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
            Bank Name
          </Text>
          <Text style={[styles.bankFieldValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            {gym?.bankDetails?.bankName || 'Verified Bank'}
          </Text>
        </View>

        <View style={styles.bankFieldItem}>
          <Text style={[styles.bankFieldLabel, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
            Account Number
          </Text>
          <Text style={[styles.bankFieldValue, { color: isDark ? '#FFFFFF' : '#0F172A', letterSpacing: 1 }]}>
            {gym?.bankDetails?.accountNumber ? `•••• •••• ${gym.bankDetails.accountNumber.slice(-4)}` : '•••• •••• ••••'}
          </Text>
        </View>

        <View style={styles.bankFieldItem}>
          <Text style={[styles.bankFieldLabel, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
            IFSC Code
          </Text>
          <Text style={[styles.bankFieldValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            {gym?.bankDetails?.ifscCode || '•••••••'}
          </Text>
        </View>

        <View style={styles.bankFieldItem}>
          <Text style={[styles.bankFieldLabel, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
            Branch
          </Text>
          <Text style={[styles.bankFieldValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            {gym?.city || 'Main Branch'}
          </Text>
        </View>

        <View style={styles.bankFieldItem}>
          <Text style={[styles.bankFieldLabel, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
            Account Type
          </Text>
          <Text style={[styles.bankFieldValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Current Account
          </Text>
        </View>

        <View style={[styles.bankFieldItem, { borderBottomWidth: 0 }]}>
          <Text style={[styles.bankFieldLabel, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
            UPI ID (Optional)
          </Text>
          <Text style={[styles.bankFieldValue, { color: isDark ? '#93C5FD' : AppColors.primaryColor }]}>
            {gym?.bankDetails?.upiId || 'Not Configured'}
          </Text>
        </View>

        <View style={styles.payoutsNoticeBox}>
          <MaterialIcons name="info-outline" size={16} color={AppColors.primaryColor} />
          <Text style={[styles.payoutsNoticeText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155' }]}>
            Payouts are transferred automatically to this verified account every Monday.
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  /* -------------------------------------------------------------------------- */
  /* 7. SUB-VIEW: "Trainer Profile" (Matching Top Left of Screenshot)           */
  /* -------------------------------------------------------------------------- */
  const renderTrainerProfileSubView = () => {
    const fullTimeCount = trainers.filter((t) => t.type === 'Full Time').length;
    const partTimeCount = trainers.filter((t) => t.type === 'Part Time').length;
    const contractCount = trainers.filter((t) => t.type === 'Contract').length;

    const filterTabs = [
      { key: 'All', label: `All (${trainers.length})` },
      { key: 'Full Time', label: `Full Time (${fullTimeCount})` },
      { key: 'Part Time', label: `Part Time (${partTimeCount})` },
      { key: 'Contract', label: `Contract (${contractCount})` },
    ];

    const filteredList = trainers.filter((t) => {
      if (trainerTabType === 'Full Time') return t.type === 'Full Time';
      if (trainerTabType === 'Part Time') return t.type === 'Part Time';
      if (trainerTabType === 'Contract') return t.type === 'Contract';
      return true;
    });

    return (
      <View style={[styles.container, { backgroundColor: isDark ? AppColors.darkBackground : AppColors.lightBackground }]}>
        {/* Header */}
        <View style={[styles.subHeaderRow, { paddingTop: topInset + 10, paddingHorizontal: 18 }]}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
            onPress={() => setActiveSection('MAIN')}
          >
            <MaterialIcons name="arrow-back" size={22} color={isDark ? '#FFFFFF' : '#0F172A'} />
          </TouchableOpacity>
          <Text style={[styles.subHeaderTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Trainer Profile
          </Text>
          <TouchableOpacity
            style={styles.addPillTopBtn}
            onPress={() => {
              setNewTrainerName('');
              setNewTrainerSpec('');
              setNewTrainerExp('');
              setTrainerPhotoUri(null);
              setTrainerCertName(null);
              setActiveSection('ADD_TRAINER');
            }}
            activeOpacity={0.85}
          >
            <MaterialIcons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.addPillTopBtnText}>Add Trainer</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={[styles.docTabsContainer, { borderBottomColor: isDark ? AppColors.darkBorder : '#E2E8F0', paddingHorizontal: 12 }]}>
          {filterTabs.map((tab) => {
            const isSelected = trainerTabType === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.docTabItem,
                  isSelected && {
                    borderBottomColor: AppColors.primaryColor,
                    borderBottomWidth: 2.5,
                  },
                ]}
                onPress={() => setTrainerTabType(tab.key)}
              >
                <Text
                  style={[
                    styles.docTabText,
                    {
                      color: isSelected
                        ? isDark
                          ? '#93C5FD'
                          : AppColors.primaryColor
                        : isDark
                        ? 'rgba(255,255,255,0.5)'
                        : '#64748B',
                      fontWeight: isSelected ? '800' : '600',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: 14, paddingBottom: 110 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {filteredList.map((trainer) => {
            const isFullTime = trainer.type === 'Full Time';
            const isPartTime = trainer.type === 'Part Time';
            const typeBadgeBg = isFullTime
              ? 'rgba(0, 191, 98, 0.12)'
              : isPartTime
              ? 'rgba(59, 130, 246, 0.12)'
              : 'rgba(245, 158, 11, 0.12)';
            const typeBadgeColor = isFullTime
              ? AppColors.secondaryColor
              : isPartTime
              ? '#3B82F6'
              : AppColors.warningAmber;

            const isCertVerified = trainer.certificateStatus === 'Certificate Verified';

            return (
              <View
                key={trainer.id}
                style={[
                  styles.trainerCardRow,
                  {
                    backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
                    borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                  },
                ]}
              >
                <View style={styles.trainerAvatarWrapper}>
                  <Image source={{ uri: trainer.image }} style={styles.trainerAvatarImg} resizeMode="cover" />
                  <View style={styles.verifiedDotCircle}>
                    <MaterialIcons name="check" size={10} color="#FFFFFF" />
                  </View>
                </View>

                <View style={styles.trainerCenterInfo}>
                  <Text style={[styles.trainerCardName, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    {trainer.name}
                  </Text>
                  <Text style={[styles.trainerSpecText, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
                    {trainer.specialization}
                  </Text>
                  <Text style={[styles.trainerExpText, { color: isDark ? 'rgba(255,255,255,0.5)' : '#94A3B8' }]}>
                    ⏱ Exp: {trainer.experience}
                  </Text>
                </View>

                <View style={styles.trainerRightActions}>
                  <View style={styles.topBadgeRow}>
                    <View style={[styles.typeBadgePill, { backgroundColor: typeBadgeBg }]}>
                      <Text style={[styles.typeBadgePillText, { color: typeBadgeColor }]}>
                        {trainer.type}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setSelectedTrainerAction(trainer)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <MaterialIcons name="more-vert" size={18} color={isDark ? '#94A3B8' : '#64748B'} />
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={[
                      styles.certStatusText,
                      { color: isCertVerified ? AppColors.secondaryColor : AppColors.warningAmber },
                    ]}
                  >
                    {trainer.certificateStatus}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  /* -------------------------------------------------------------------------- */
  /* 8. SUB-VIEW: "Add Trainer" (Matching Bottom Left of Screenshot)            */
  /* -------------------------------------------------------------------------- */
  const renderAddTrainerSubView = () => (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: topInset + 12, paddingBottom: 110 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.subHeaderRow}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
          onPress={() => setActiveSection('TRAINER_PROFILE')}
        >
          <MaterialIcons name="arrow-back" size={22} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </TouchableOpacity>
        <Text style={[styles.subHeaderTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Add Trainer
        </Text>
        <View style={{ width: 42 }} />
      </View>

      {/* 1. Upload Photo */}
      <Text style={[styles.formFieldLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }]}>
        Upload Photo
      </Text>
      <TouchableOpacity
        style={[styles.uploadDashedBox, { borderColor: isDark ? AppColors.darkBorder : '#CBD5E1' }]}
        onPress={() => {
          setTrainerPhotoUri('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop');
          showToast({ message: 'Trainer photo uploaded successfully', isSuccess: true });
        }}
        activeOpacity={0.7}
      >
        {trainerPhotoUri ? (
          <View style={styles.uploadedPhotoPreviewRow}>
            <Image source={{ uri: trainerPhotoUri }} style={styles.uploadedPhotoThumb} />
            <View>
              <Text style={[styles.uploadedPhotoTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Photo Attached
              </Text>
              <Text style={[styles.uploadedPhotoSub, { color: AppColors.secondaryColor }]}>
                ✓ Ready to save
              </Text>
            </View>
          </View>
        ) : (
          <>
            <MaterialIcons name="file-upload" size={26} color={AppColors.primaryColor} />
            <Text style={[styles.uploadBoxText, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              Tap to upload photo
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* 2. Full Name */}
      <Text style={[styles.formFieldLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }]}>
        Full Name
      </Text>
      <TextInput
        placeholder="Enter trainer name"
        placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'}
        value={newTrainerName}
        onChangeText={setNewTrainerName}
        style={[
          styles.formInput,
          {
            color: isDark ? '#FFFFFF' : '#0F172A',
            backgroundColor: isDark ? AppColors.darkSurface : '#FFFFFF',
            borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
          },
        ]}
      />

      {/* 3. Specialization (Interactive Dropdown Selector) */}
      <Text style={[styles.formFieldLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }]}>
        Specialization
      </Text>
      <TouchableOpacity
        style={[
          styles.dropdownSelectBox,
          {
            backgroundColor: isDark ? AppColors.darkSurface : '#FFFFFF',
            borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
          },
        ]}
        onPress={() => setShowSpecPicker(true)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.dropdownSelectText,
            {
              color: newTrainerSpec
                ? isDark
                  ? '#FFFFFF'
                  : '#0F172A'
                : isDark
                ? 'rgba(255,255,255,0.4)'
                : '#94A3B8',
            },
          ]}
        >
          {newTrainerSpec || 'Select specialization'}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
      </TouchableOpacity>

      {/* 4. Experience */}
      <Text style={[styles.formFieldLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }]}>
        Experience
      </Text>
      <TextInput
        placeholder="Enter experience in years"
        placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'}
        value={newTrainerExp}
        onChangeText={setNewTrainerExp}
        keyboardType="numeric"
        style={[
          styles.formInput,
          {
            color: isDark ? '#FFFFFF' : '#0F172A',
            backgroundColor: isDark ? AppColors.darkSurface : '#FFFFFF',
            borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
          },
        ]}
      />

      {/* 5. Employment Type (3 Radio buttons) */}
      <Text style={[styles.formFieldLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }]}>
        Employment Type
      </Text>
      <View style={styles.radioGroupRow}>
        {['Full Time', 'Part Time', 'Contract'].map((type) => {
          const isSelected = newTrainerType === type;
          return (
            <TouchableOpacity
              key={type}
              style={styles.radioItem}
              onPress={() => setNewTrainerType(type)}
              activeOpacity={0.7}
            >
              <View style={[styles.radioCircle, isSelected && { borderColor: AppColors.primaryColor }]}>
                {isSelected && <View style={styles.radioInnerFilled} />}
              </View>
              <Text style={[styles.radioLabelText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>{type}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 6. Upload Certificate */}
      <Text style={[styles.formFieldLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }]}>
        Upload Certificate
      </Text>
      <TouchableOpacity
        style={[styles.uploadDashedBox, { borderColor: isDark ? AppColors.darkBorder : '#CBD5E1' }]}
        onPress={() => {
          setTrainerCertName('fitness_trainer_certified.pdf (1.2 MB)');
          showToast({ message: 'Certificate attached (fitness_trainer_certified.pdf)', isSuccess: true });
        }}
        activeOpacity={0.7}
      >
        <MaterialIcons name="cloud-upload" size={26} color={AppColors.primaryColor} />
        <Text style={[styles.uploadBoxMainText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          {trainerCertName ? trainerCertName : 'Upload certificate'}
        </Text>
        <Text style={[styles.uploadBoxSubText, { color: isDark ? 'rgba(255,255,255,0.5)' : '#94A3B8' }]}>
          PDF, JPG or PNG (Max 5MB)
        </Text>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveFormMainBtn}
        onPress={handleSaveTrainer}
        activeOpacity={0.88}
      >
        <Text style={styles.saveFormMainBtnText}>Save Trainer</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  /* -------------------------------------------------------------------------- */
  /* 9. SUB-VIEW: "Employees" (Matching Top Right of Screenshot)                */
  /* -------------------------------------------------------------------------- */
  const renderEmployeesSubView = () => {
    const ownerCount = employees.filter((e) => e.role === 'Owner').length;
    const adminCount = employees.filter((e) => e.role === 'Admin').length;
    const empCount = employees.filter((e) => e.role === 'Employee').length;

    const filterTabs = [
      { key: 'All', label: `All (${employees.length})` },
      { key: 'Owner', label: `Owner (${ownerCount})` },
      { key: 'Admin', label: `Admin (${adminCount})` },
      { key: 'Employee', label: `Employee (${empCount})` },
    ];

    const filteredList = employees.filter((e) => {
      if (employeeTabRole === 'Owner') return e.role === 'Owner';
      if (employeeTabRole === 'Admin') return e.role === 'Admin';
      if (employeeTabRole === 'Employee') return e.role === 'Employee';
      return true;
    });

    return (
      <View style={[styles.container, { backgroundColor: isDark ? AppColors.darkBackground : AppColors.lightBackground }]}>
        {/* Header */}
        <View style={[styles.subHeaderRow, { paddingTop: topInset + 10, paddingHorizontal: 18 }]}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
            onPress={() => setActiveSection('MAIN')}
          >
            <MaterialIcons name="arrow-back" size={22} color={isDark ? '#FFFFFF' : '#0F172A'} />
          </TouchableOpacity>
          <Text style={[styles.subHeaderTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Employees
          </Text>
          <TouchableOpacity
            style={styles.addPillTopBtn}
            onPress={() => {
              setNewEmpName('');
              setNewEmpDesignation('');
              setEmpPhotoUri(null);
              setEmpCertName(null);
              setActiveSection('ADD_EMPLOYEE');
            }}
            activeOpacity={0.85}
          >
            <MaterialIcons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.addPillTopBtnText}>Add Employee</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={[styles.docTabsContainer, { borderBottomColor: isDark ? AppColors.darkBorder : '#E2E8F0', paddingHorizontal: 12 }]}>
          {filterTabs.map((tab) => {
            const isSelected = employeeTabRole === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.docTabItem,
                  isSelected && {
                    borderBottomColor: AppColors.primaryColor,
                    borderBottomWidth: 2.5,
                  },
                ]}
                onPress={() => setEmployeeTabRole(tab.key)}
              >
                <Text
                  style={[
                    styles.docTabText,
                    {
                      color: isSelected
                        ? isDark
                          ? '#93C5FD'
                          : AppColors.primaryColor
                        : isDark
                        ? 'rgba(255,255,255,0.5)'
                        : '#64748B',
                      fontWeight: isSelected ? '800' : '600',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: 14, paddingBottom: 110 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {filteredList.map((emp) => {
            const isOwner = emp.role === 'Owner';
            const isAdmin = emp.role === 'Admin';
            const roleBadgeBg = isOwner
              ? 'rgba(168, 85, 247, 0.15)'
              : isAdmin
              ? 'rgba(59, 130, 246, 0.15)'
              : 'rgba(99, 102, 241, 0.12)';
            const roleBadgeColor = isOwner
              ? '#A855F7'
              : isAdmin
              ? '#3B82F6'
              : AppColors.accentColor;

            return (
              <View
                key={emp.id}
                style={[
                  styles.trainerCardRow,
                  {
                    backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
                    borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                  },
                ]}
              >
                <View style={styles.trainerAvatarWrapper}>
                  <Image source={{ uri: emp.image }} style={styles.trainerAvatarImg} resizeMode="cover" />
                  <View style={styles.verifiedDotCircle}>
                    <MaterialIcons name="check" size={10} color="#FFFFFF" />
                  </View>
                </View>

                <View style={styles.trainerCenterInfo}>
                  <Text style={[styles.trainerCardName, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    {emp.name}
                  </Text>
                  <Text style={[styles.trainerSpecText, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
                    {emp.designation}
                  </Text>
                  <Text style={[styles.trainerExpText, { color: isDark ? 'rgba(255,255,255,0.5)' : '#94A3B8' }]}>
                    {emp.joinedDate}
                  </Text>
                </View>

                <View style={styles.trainerRightActions}>
                  <View style={styles.topBadgeRow}>
                    <View style={[styles.typeBadgePill, { backgroundColor: roleBadgeBg }]}>
                      <Text style={[styles.typeBadgePillText, { color: roleBadgeColor }]}>
                        {emp.role}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setSelectedEmpAction(emp)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <MaterialIcons name="more-vert" size={18} color={isDark ? '#94A3B8' : '#64748B'} />
                    </TouchableOpacity>
                  </View>

                  <Text style={[styles.certStatusText, { color: AppColors.secondaryColor }]}>
                    Active
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  /* -------------------------------------------------------------------------- */
  /* 10. SUB-VIEW: "Add Employee" (Matching Bottom Right of Screenshot)          */
  /* -------------------------------------------------------------------------- */
  const renderAddEmployeeSubView = () => (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: topInset + 12, paddingBottom: 110 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.subHeaderRow}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
          onPress={() => setActiveSection('EMPLOYEES')}
        >
          <MaterialIcons name="arrow-back" size={22} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </TouchableOpacity>
        <Text style={[styles.subHeaderTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Add Employee
        </Text>
        <View style={{ width: 42 }} />
      </View>

      {/* 1. Upload Photo */}
      <Text style={[styles.formFieldLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }]}>
        Upload Photo
      </Text>
      <TouchableOpacity
        style={[styles.uploadDashedBox, { borderColor: isDark ? AppColors.darkBorder : '#CBD5E1' }]}
        onPress={() => {
          setEmpPhotoUri('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop');
          showToast({ message: 'Employee photo uploaded successfully', isSuccess: true });
        }}
        activeOpacity={0.7}
      >
        {empPhotoUri ? (
          <View style={styles.uploadedPhotoPreviewRow}>
            <Image source={{ uri: empPhotoUri }} style={styles.uploadedPhotoThumb} />
            <View>
              <Text style={[styles.uploadedPhotoTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Photo Attached
              </Text>
              <Text style={[styles.uploadedPhotoSub, { color: AppColors.secondaryColor }]}>
                ✓ Ready to save
              </Text>
            </View>
          </View>
        ) : (
          <>
            <MaterialIcons name="file-upload" size={26} color={AppColors.primaryColor} />
            <Text style={[styles.uploadBoxText, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              Tap to upload photo
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* 2. Full Name */}
      <Text style={[styles.formFieldLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }]}>
        Full Name
      </Text>
      <TextInput
        placeholder="Enter employee name"
        placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'}
        value={newEmpName}
        onChangeText={setNewEmpName}
        style={[
          styles.formInput,
          {
            color: isDark ? '#FFFFFF' : '#0F172A',
            backgroundColor: isDark ? AppColors.darkSurface : '#FFFFFF',
            borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
          },
        ]}
      />

      {/* 3. Designation (Interactive Dropdown Selector) */}
      <Text style={[styles.formFieldLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }]}>
        Designation
      </Text>
      <TouchableOpacity
        style={[
          styles.dropdownSelectBox,
          {
            backgroundColor: isDark ? AppColors.darkSurface : '#FFFFFF',
            borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
          },
        ]}
        onPress={() => setShowDesigPicker(true)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.dropdownSelectText,
            {
              color: newEmpDesignation
                ? isDark
                  ? '#FFFFFF'
                  : '#0F172A'
                : isDark
                ? 'rgba(255,255,255,0.4)'
                : '#94A3B8',
            },
          ]}
        >
          {newEmpDesignation || 'Select designation'}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
      </TouchableOpacity>

      {/* 4. Employment Type (3 Radio buttons) */}
      <Text style={[styles.formFieldLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }]}>
        Employment Type
      </Text>
      <View style={styles.radioGroupRow}>
        {['Full Time', 'Part Time', 'Contract'].map((type) => {
          const isSelected = newEmpType === type;
          return (
            <TouchableOpacity
              key={type}
              style={styles.radioItem}
              onPress={() => setNewEmpType(type)}
              activeOpacity={0.7}
            >
              <View style={[styles.radioCircle, isSelected && { borderColor: AppColors.primaryColor }]}>
                {isSelected && <View style={styles.radioInnerFilled} />}
              </View>
              <Text style={[styles.radioLabelText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>{type}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 5. Assign Role (3 Radio buttons) */}
      <Text style={[styles.formFieldLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }]}>
        Assign Role
      </Text>
      <View style={styles.radioGroupRow}>
        {['Owner', 'Admin', 'Employee'].map((role) => {
          const isSelected = newEmpRole === role;
          return (
            <TouchableOpacity
              key={role}
              style={styles.radioItem}
              onPress={() => setNewEmpRole(role)}
              activeOpacity={0.7}
            >
              <View style={[styles.radioCircle, isSelected && { borderColor: AppColors.primaryColor }]}>
                {isSelected && <View style={styles.radioInnerFilled} />}
              </View>
              <Text style={[styles.radioLabelText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>{role}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 6. Upload Certificate */}
      <Text style={[styles.formFieldLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }]}>
        Upload Certificate
      </Text>
      <TouchableOpacity
        style={[styles.uploadDashedBox, { borderColor: isDark ? AppColors.darkBorder : '#CBD5E1' }]}
        onPress={() => {
          setEmpCertName('employee_id_proof_doc.pdf (980 KB)');
          showToast({ message: 'Certificate attached (employee_id_proof_doc.pdf)', isSuccess: true });
        }}
        activeOpacity={0.7}
      >
        <MaterialIcons name="cloud-upload" size={26} color={AppColors.primaryColor} />
        <Text style={[styles.uploadBoxMainText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          {empCertName ? empCertName : 'Upload certificate'}
        </Text>
        <Text style={[styles.uploadBoxSubText, { color: isDark ? 'rgba(255,255,255,0.5)' : '#94A3B8' }]}>
          PDF, JPG or PNG (Max 5MB)
        </Text>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveFormMainBtn}
        onPress={handleSaveEmployee}
        activeOpacity={0.88}
      >
        <Text style={styles.saveFormMainBtnText}>Save Employee</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  /* -------------------------------------------------------------------------- */
  /* 11. SECTIONS & CLASSES SUB-VIEW                                            */
  /* -------------------------------------------------------------------------- */
  const renderSectionsSubView = () => {
    const filteredSections = sections.filter((sec) => {
      const matchCat = sectionCategory === 'all' || sec.category === sectionCategory;
      const matchQuery =
        !sectionSearchQuery ||
        sec.title.toLowerCase().includes(sectionSearchQuery.toLowerCase()) ||
        (sec.trainerName && sec.trainerName.toLowerCase().includes(sectionSearchQuery.toLowerCase())) ||
        (sec.categoryLabel && sec.categoryLabel.toLowerCase().includes(sectionSearchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });

    return (
      <View style={[styles.subViewContainer, { paddingTop: topInset + 12 }]}>
        {/* Header */}
        <View style={styles.subViewTopBar}>
          <TouchableOpacity
            style={[
              styles.backIconBtn,
              {
                backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
                borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
              },
            ]}
            onPress={() => setActiveSection('MAIN')}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="arrow-back-ios"
              size={18}
              color={isDark ? '#FFFFFF' : '#0F172A'}
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
          <View style={styles.subViewTitleBox}>
            <Text style={[styles.subViewMainTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Sections & Classes
            </Text>
            <Text style={[styles.subViewSubTitle, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              Floor access, classes & capacity
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addSectionTopBtn, { backgroundColor: AppColors.primaryColor }]}
            onPress={handleOpenAddSection}
            activeOpacity={0.8}
          >
            <MaterialIcons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.addSectionTopBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Categories Horizontal Scroll */}
        <View style={styles.secFilterChipsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.secFilterScrollContent}
          >
            {SECTION_CATEGORIES.map((cat) => {
              const count =
                cat.key === 'all'
                  ? sections.length
                  : sections.filter((s) => s.category === cat.key).length;
              const isSelected = sectionCategory === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.secCatChip,
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
                  onPress={() => setSectionCategory(cat.key)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name={cat.icon}
                    size={16}
                    color={isSelected ? '#FFFFFF' : cat.color || (isDark ? '#94A3B8' : '#64748B')}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.secCatChipText,
                      {
                        color: isSelected
                          ? '#FFFFFF'
                          : isDark
                          ? '#FFFFFF'
                          : '#0F172A',
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {cat.label}
                  </Text>
                  <View
                    style={[
                      styles.secCatCountBadge,
                      {
                        backgroundColor: isSelected
                          ? 'rgba(255,255,255,0.25)'
                          : isDark
                          ? 'rgba(255,255,255,0.08)'
                          : '#F1F5F9',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.secCatCountBadgeText,
                        {
                          color: isSelected ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B',
                        },
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Search Bar */}
        <View style={styles.secSearchBoxWrapper}>
          <View
            style={[
              styles.secSearchContainer,
              {
                backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
                borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
              },
            ]}
          >
            <MaterialIcons
              name="search"
              size={20}
              color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'}
            />
            <TextInput
              style={[
                styles.secSearchInput,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
              placeholder="Search sections, classes, coaches..."
              placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'}
              value={sectionSearchQuery}
              onChangeText={setSectionSearchQuery}
            />
            {sectionSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSectionSearchQuery('')}>
                <MaterialIcons
                  name="close"
                  size={18}
                  color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Sections List */}
        <ScrollView
          contentContainerStyle={[styles.secListScrollContent, { paddingBottom: 120 }]}
          showsVerticalScrollIndicator={false}
        >
          {filteredSections.length === 0 ? (
            <View style={styles.secEmptyBox}>
              <MaterialIcons
                name="layers-clear"
                size={48}
                color={isDark ? 'rgba(255,255,255,0.2)' : '#CBD5E1'}
              />
              <Text style={[styles.secEmptyTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                No sections found
              </Text>
              <Text style={[styles.secEmptySub, { color: isDark ? 'rgba(255,255,255,0.5)' : '#94A3B8' }]}>
                Try adjusting your search or category filter
              </Text>
            </View>
          ) : (
            filteredSections.map((sec) => {
              const catObj = SECTION_CATEGORIES.find((c) => c.key === sec.category) || SECTION_CATEGORIES[1];
              const tagColor = catObj.color || AppColors.primaryColor;
              return (
                <View
                  key={sec.id}
                  style={[
                    styles.secCard,
                    {
                      backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
                      borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                    },
                  ]}
                >
                  {/* Top Bar: Category badge & Active toggle */}
                  <View style={styles.secCardTopRow}>
                    <View
                      style={[
                        styles.secCategoryBadge,
                        { backgroundColor: `${tagColor}15` },
                      ]}
                    >
                      <MaterialIcons name={catObj.icon} size={14} color={tagColor} />
                      <Text style={[styles.secCategoryBadgeText, { color: tagColor }]}>
                        {sec.categoryLabel || catObj.label}
                      </Text>
                    </View>
                    <View style={styles.secSwitchRow}>
                      <Text
                        style={[
                          styles.secStatusLabel,
                          { color: sec.isActive ? '#10B981' : isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8' },
                        ]}
                      >
                        {sec.isActive ? 'Active' : 'Paused'}
                      </Text>
                      <Switch
                        value={sec.isActive}
                        onValueChange={() => handleToggleSectionActive(sec.id)}
                        trackColor={{
                          false: isDark ? '#334155' : '#E2E8F0',
                          true: '#10B981',
                        }}
                        thumbColor="#FFFFFF"
                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                      />
                    </View>
                  </View>

                  {/* Title & Description */}
                  <Text style={[styles.secCardTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    {sec.title}
                  </Text>
                  {sec.description ? (
                    <Text
                      style={[
                        styles.secCardDesc,
                        { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' },
                      ]}
                      numberOfLines={2}
                    >
                      {sec.description}
                    </Text>
                  ) : null}

                  {/* Key Highlights Metrics */}
                  <View style={styles.secMetricsGrid}>
                    <View
                      style={[
                        styles.secMetricChip,
                        {
                          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                          borderColor: isDark ? AppColors.darkBorder : '#F1F5F9',
                        },
                      ]}
                    >
                      <MaterialIcons name="payments" size={15} color={AppColors.accentColor} />
                      <Text style={[styles.secMetricValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                        ₹{sec.pricePerSession}
                      </Text>
                      <Text style={[styles.secMetricUnit, { color: isDark ? 'rgba(255,255,255,0.5)' : '#94A3B8' }]}>
                        / session
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.secMetricChip,
                        {
                          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                          borderColor: isDark ? AppColors.darkBorder : '#F1F5F9',
                        },
                      ]}
                    >
                      <MaterialIcons name="groups" size={15} color="#3B82F6" />
                      <Text style={[styles.secMetricValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                        {sec.maxCapacity} Max
                      </Text>
                      <Text style={[styles.secMetricUnit, { color: isDark ? 'rgba(255,255,255,0.5)' : '#94A3B8' }]}>
                        Capacity
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.secMetricChip,
                        {
                          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                          borderColor: isDark ? AppColors.darkBorder : '#F1F5F9',
                        },
                      ]}
                    >
                      <MaterialIcons name="person" size={15} color="#EC4899" />
                      <Text
                        style={[styles.secMetricValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
                        numberOfLines={1}
                      >
                        {sec.trainerName || 'Coach'}
                      </Text>
                    </View>
                  </View>

                  {/* Slot Highlights */}
                  {(sec.morningSlots?.length > 0 || sec.eveningSlots?.length > 0) && (
                    <View style={styles.secSlotsBlock}>
                      {sec.morningSlots?.length > 0 && (
                        <View style={styles.secSlotRow}>
                          <MaterialIcons name="wb-sunny" size={13} color="#F59E0B" />
                          <Text style={[styles.secSlotLabel, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
                            Morning: {sec.morningSlots.join(', ')}
                          </Text>
                        </View>
                      )}
                      {sec.eveningSlots?.length > 0 && (
                        <View style={styles.secSlotRow}>
                          <MaterialIcons name="nights-stay" size={13} color="#8B5CF6" />
                          <Text style={[styles.secSlotLabel, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
                            Evening: {sec.eveningSlots.join(', ')}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Active Days */}
                  {sec.activeDays?.length > 0 && (
                    <View style={styles.secDaysRow}>
                      {sec.activeDays.map((d) => (
                        <View
                          key={d}
                          style={[
                            styles.secDayPill,
                            {
                              backgroundColor: isDark ? 'rgba(0, 56, 130, 0.2)' : '#EFF6FF',
                              borderColor: isDark ? 'rgba(0, 56, 130, 0.4)' : '#DBEAFE',
                            },
                          ]}
                        >
                          <Text style={[styles.secDayPillText, { color: AppColors.primaryColor }]}>
                            {d}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Card Bottom Action Buttons */}
                  <View style={[styles.secCardActions, { borderTopColor: isDark ? AppColors.darkBorder : '#F1F5F9' }]}>
                    <TouchableOpacity
                      style={[
                        styles.secActionBtn,
                        {
                          backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                        },
                      ]}
                      onPress={() => handleOpenEditSection(sec)}
                      activeOpacity={0.7}
                    >
                      <MaterialIcons name="edit" size={15} color={isDark ? '#FFFFFF' : '#0F172A'} />
                      <Text style={[styles.secActionBtnText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                        Edit Section
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.secActionBtn,
                        {
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        },
                      ]}
                      onPress={() => handleDeleteSection(sec.id, sec.title)}
                      activeOpacity={0.7}
                    >
                      <MaterialIcons name="delete-outline" size={15} color="#EF4444" />
                      <Text style={[styles.secActionBtnText, { color: '#EF4444' }]}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? AppColors.darkBackground : AppColors.lightBackground }]}>
      {activeSection === 'MAIN' && renderMainHub()}
      {activeSection === 'GYM_PROFILE' && renderGymProfileSubView()}
      {activeSection === 'BASIC_PROFILE' && renderBasicProfileSubView()}
      {activeSection === 'SUBSCRIPTION' && renderSubscriptionSubView()}
      {activeSection === 'DOCUMENTS' && renderDocumentsSubView()}
      {activeSection === 'ACCOUNT_DETAILS' && renderAccountDetailsSubView()}
      {activeSection === 'TRAINER_PROFILE' && renderTrainerProfileSubView()}
      {activeSection === 'ADD_TRAINER' && renderAddTrainerSubView()}
      {activeSection === 'EMPLOYEES' && renderEmployeesSubView()}
      {activeSection === 'ADD_EMPLOYEE' && renderAddEmployeeSubView()}
      {activeSection === 'SECTIONS' && renderSectionsSubView()}

      {/* Specialization Selection Modal */}
      <Modal
        visible={showSpecPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSpecPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.pickerModalCard, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF' }]}>
            <View style={styles.pickerModalHeader}>
              <Text style={[styles.pickerModalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Select Specialization
              </Text>
              <TouchableOpacity onPress={() => setShowSpecPicker(false)}>
                <MaterialIcons name="close" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
              {[
                'Strength Trainer',
                'Yoga Trainer',
                'Crossfit Trainer',
                'Zumba Trainer',
                'Cardio Trainer',
                'Personal Trainer',
                'HIIT Specialist',
                'Pilates Instructor',
                'Calisthenics Coach',
                'Martial Arts / Boxing',
              ].map((spec) => (
                <TouchableOpacity
                  key={spec}
                  style={[
                    styles.pickerOptionItem,
                    { borderBottomColor: isDark ? AppColors.darkBorder : '#F1F5F9' },
                    newTrainerSpec === spec && { backgroundColor: isDark ? 'rgba(0,56,130,0.3)' : '#EEF2FF' },
                  ]}
                  onPress={() => {
                    setNewTrainerSpec(spec);
                    setShowSpecPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      { color: newTrainerSpec === spec ? AppColors.primaryColor : isDark ? '#FFFFFF' : '#0F172A' },
                      newTrainerSpec === spec && { fontWeight: '700' },
                    ]}
                  >
                    {spec}
                  </Text>
                  {newTrainerSpec === spec && (
                    <MaterialIcons name="check" size={20} color={AppColors.primaryColor} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Designation Selection Modal */}
      <Modal
        visible={showDesigPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDesigPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.pickerModalCard, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF' }]}>
            <View style={styles.pickerModalHeader}>
              <Text style={[styles.pickerModalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Select Designation
              </Text>
              <TouchableOpacity onPress={() => setShowDesigPicker(false)}>
                <MaterialIcons name="close" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
              {[
                'Owner',
                'Admin',
                'General Manager',
                'Receptionist',
                'Trainer Assistant',
                'Housekeeping',
                'Front Desk Executive',
                'Accountant',
                'Floor Supervisor',
              ].map((desig) => (
                <TouchableOpacity
                  key={desig}
                  style={[
                    styles.pickerOptionItem,
                    { borderBottomColor: isDark ? AppColors.darkBorder : '#F1F5F9' },
                    newEmpDesignation === desig && { backgroundColor: isDark ? 'rgba(0,56,130,0.3)' : '#EEF2FF' },
                  ]}
                  onPress={() => {
                    setNewEmpDesignation(desig);
                    setShowDesigPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      { color: newEmpDesignation === desig ? AppColors.primaryColor : isDark ? '#FFFFFF' : '#0F172A' },
                      newEmpDesignation === desig && { fontWeight: '700' },
                    ]}
                  >
                    {desig}
                  </Text>
                  {newEmpDesignation === desig && (
                    <MaterialIcons name="check" size={20} color={AppColors.primaryColor} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Trainer Action Sheet Modal */}
      <Modal
        visible={!!selectedTrainerAction}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedTrainerAction(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.actionSheetCard, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF' }]}>
            <Text style={[styles.actionSheetNameTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              {selectedTrainerAction?.name}
            </Text>
            <Text style={[styles.actionSheetSubText, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              {selectedTrainerAction?.specialization} • {selectedTrainerAction?.type}
            </Text>

            <TouchableOpacity
              style={styles.actionSheetItemRow}
              onPress={() => {
                const tr = selectedTrainerAction;
                setSelectedTrainerAction(null);
                showToast({ message: `${tr?.name}'s certificate is verified & active` });
              }}
            >
              <MaterialIcons name="verified" size={20} color={AppColors.secondaryColor} />
              <Text style={[styles.actionSheetItemText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                View Certificate
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionSheetItemRow}
              onPress={() => {
                const tr = selectedTrainerAction;
                setSelectedTrainerAction(null);
                showToast({ message: `Edit flow for ${tr?.name}` });
              }}
            >
              <MaterialIcons name="edit" size={20} color="#3B82F6" />
              <Text style={[styles.actionSheetItemText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Edit Trainer Details
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionSheetItemRow}
              onPress={() => {
                const tr = selectedTrainerAction;
                setSelectedTrainerAction(null);
                setTrainers(trainers.filter((t) => t.id !== tr?.id));
                showToast({ message: `Removed ${tr?.name} from trainers` });
              }}
            >
              <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
              <Text style={[styles.actionSheetItemText, { color: '#EF4444' }]}>
                Remove Trainer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionSheetCloseBtn, { borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
              onPress={() => setSelectedTrainerAction(null)}
            >
              <Text style={[styles.actionSheetCloseText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Employee Action Sheet Modal */}
      <Modal
        visible={!!selectedEmpAction}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedEmpAction(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.actionSheetCard, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF' }]}>
            <Text style={[styles.actionSheetNameTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              {selectedEmpAction?.name}
            </Text>
            <Text style={[styles.actionSheetSubText, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              {selectedEmpAction?.designation} • {selectedEmpAction?.role}
            </Text>

            <TouchableOpacity
              style={styles.actionSheetItemRow}
              onPress={() => {
                const emp = selectedEmpAction;
                setSelectedEmpAction(null);
                showToast({ message: `Role permissions updated for ${emp?.name}` });
              }}
            >
              <MaterialIcons name="admin-panel-settings" size={20} color="#A855F7" />
              <Text style={[styles.actionSheetItemText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Manage Role Permissions
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionSheetItemRow}
              onPress={() => {
                const emp = selectedEmpAction;
                setSelectedEmpAction(null);
                setEmployees(employees.filter((e) => e.id !== emp?.id));
                showToast({ message: `Removed ${emp?.name} from employees` });
              }}
            >
              <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
              <Text style={[styles.actionSheetItemText, { color: '#EF4444' }]}>
                Remove Employee
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionSheetCloseBtn, { borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
              onPress={() => setSelectedEmpAction(null)}
            >
              <Text style={[styles.actionSheetCloseText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Timings Modal */}
      <Modal
        visible={showEditTimingsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditTimingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Edit Gym Timings
            </Text>
            <TextInput
              value={tempTimings}
              onChangeText={setTempTimings}
              placeholder="e.g. 5:00 AM - 11:00 PM"
              placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'}
              style={[
                styles.modalInput,
                {
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                  borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                },
              ]}
            />
            <TouchableOpacity
              style={styles.modalSaveBtn}
              onPress={() => {
                setTimings(tempTimings.trim() || timings);
                setShowEditTimingsModal(false);
                showToast({ message: 'Gym timings updated successfully', isSuccess: true });
              }}
            >
              <Text style={styles.modalSaveBtnText}>Save Timings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add / Edit Section Modal */}
      <Modal
        visible={showSectionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSectionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.pickerModalCard,
              {
                backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
                maxHeight: 520,
              },
            ]}
          >
            <View style={styles.pickerModalHeader}>
              <Text style={[styles.pickerModalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                {editingSection ? 'Edit Section / Class' : 'Add New Section / Class'}
              </Text>
              <TouchableOpacity onPress={() => setShowSectionModal(false)}>
                <MaterialIcons name="close" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
              {/* Section Title */}
              <Text style={[styles.secModalInputLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }]}>
                Section Title *
              </Text>
              <TextInput
                value={secTitle}
                onChangeText={setSecTitle}
                placeholder="e.g. Crossfit & Functional Zone"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'}
                style={[
                  styles.modalInput,
                  {
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                    borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                    marginBottom: 12,
                  },
                ]}
              />

              {/* Category Selector */}
              <Text style={[styles.secModalInputLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }]}>
                Category
              </Text>
              <View style={styles.secModalCatGrid}>
                {SECTION_CATEGORIES.filter((c) => c.key !== 'all').map((cat) => {
                  const isSel = secCatKey === cat.key;
                  return (
                    <TouchableOpacity
                      key={cat.key}
                      style={[
                        styles.secModalCatItem,
                        {
                          backgroundColor: isSel
                            ? AppColors.primaryColor
                            : isDark
                            ? AppColors.darkSurface
                            : '#F8FAFC',
                          borderColor: isSel
                            ? AppColors.primaryColor
                            : isDark
                            ? AppColors.darkBorder
                            : '#E2E8F0',
                        },
                      ]}
                      onPress={() => setSecCatKey(cat.key)}
                    >
                      <MaterialIcons
                        name={cat.icon}
                        size={14}
                        color={isSel ? '#FFFFFF' : cat.color || (isDark ? '#94A3B8' : '#64748B')}
                      />
                      <Text
                        style={[
                          styles.secModalCatText,
                          {
                            color: isSel ? '#FFFFFF' : isDark ? '#FFFFFF' : '#0F172A',
                            fontWeight: isSel ? '700' : '500',
                          },
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Price & Capacity Row */}
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.secModalInputLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }]}>
                    Price / Session (₹)
                  </Text>
                  <TextInput
                    value={secPrice}
                    onChangeText={setSecPrice}
                    keyboardType="numeric"
                    placeholder="199"
                    placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'}
                    style={[
                      styles.modalInput,
                      {
                        color: isDark ? '#FFFFFF' : '#0F172A',
                        backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                        borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                      },
                    ]}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.secModalInputLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }]}>
                    Max Capacity
                  </Text>
                  <TextInput
                    value={secCapacity}
                    onChangeText={setSecCapacity}
                    keyboardType="numeric"
                    placeholder="25"
                    placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'}
                    style={[
                      styles.modalInput,
                      {
                        color: isDark ? '#FFFFFF' : '#0F172A',
                        backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                        borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Trainer Coach */}
              <Text style={[styles.secModalInputLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569', marginTop: 12 }]}>
                Assigned Coach / Trainer
              </Text>
              <TextInput
                value={secTrainerName}
                onChangeText={setSecTrainerName}
                placeholder="e.g. Arun Kumar"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'}
                style={[
                  styles.modalInput,
                  {
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                    borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                    marginBottom: 12,
                  },
                ]}
              />

              {/* Description */}
              <Text style={[styles.secModalInputLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }]}>
                Description
              </Text>
              <TextInput
                value={secDescription}
                onChangeText={setSecDescription}
                placeholder="Class objectives, equipment provided & guidelines..."
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'}
                multiline
                style={[
                  styles.modalInput,
                  {
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                    borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                    height: 70,
                    textAlignVertical: 'top',
                    paddingTop: 10,
                  },
                ]}
              />

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.modalSaveBtn, { marginTop: 16, marginBottom: 10 }]}
                onPress={handleSaveSection}
                activeOpacity={0.88}
              >
                <Text style={styles.modalSaveBtnText}>
                  {editingSection ? 'Save Changes' : 'Create Section'}
                </Text>
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
    paddingHorizontal: 18,
  },
  profileCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  gymLogoWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    overflow: 'hidden',
  },
  gymLogo: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    flex: 1,
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileGymName: {
    fontSize: 18,
    fontWeight: '800',
  },
  activeStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 191, 98, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AppColors.secondaryColor,
  },
  activeStatusText: {
    color: AppColors.secondaryColor,
    fontSize: 11,
    fontWeight: '800',
  },
  profileGymMeta: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  sectionSub: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  menuCardContainer: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 14,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextBox: {
    flex: 1,
    gap: 2,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  menuDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  menuDivider: {
    height: 1,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  settingTextBox: {
    flex: 1,
    gap: 2,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  settingSub: {
    fontSize: 12,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 16,
    height: 52,
    gap: 8,
    marginTop: 8,
    marginBottom: 20,
  },
  logoutBtnText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '600',
  },

  /* Sub Header Row */
  subHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  addPillTopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primaryColor,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    gap: 4,
  },
  addPillTopBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  /* Gym Profile Sub-view styles */
  cardHeaderWithEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardHeaderTitleText: {
    fontSize: 15,
    fontWeight: '800',
  },
  cardSubText: {
    fontSize: 11,
    marginTop: 1,
  },
  editPillBtn: {
    backgroundColor: 'rgba(0, 56, 130, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  editPillText: {
    color: AppColors.primaryColor,
    fontSize: 12,
    fontWeight: '700',
  },
  timingsDays: {
    fontSize: 12,
    fontWeight: '500',
  },
  timingsHours: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  priceRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.12)',
  },
  priceDurationLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  priceAmountVal: {
    fontSize: 14,
    fontWeight: '800',
  },
  actionCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
  },
  actionCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionCardDesc: {
    fontSize: 12,
    marginTop: 1,
  },

  /* Basic Profile Styles */
  photosScroll: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  photoThumb: {
    width: 100,
    height: 80,
    borderRadius: 12,
  },
  addPhotoBtn: {
    width: 100,
    height: 80,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addPhotoText: {
    fontSize: 11,
    fontWeight: '700',
  },
  infoFieldItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.12)',
    gap: 4,
  },
  infoFieldLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  infoFieldValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  iconValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mapSnapshotBox: {
    height: 120,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapPinBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  mapPinText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
  },

  /* Subscription Styles */
  currentPlanCard: {
    padding: 18,
    borderRadius: 20,
    marginBottom: 16,
  },
  planCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planCardBadgeText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  planCardTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  planValidityBox: {
    alignItems: 'flex-end',
    gap: 4,
  },
  planActivePill: {
    backgroundColor: 'rgba(0, 191, 98, 0.25)',
    borderWidth: 1,
    borderColor: '#4ADE80',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  planActivePillText: {
    color: '#4ADE80',
    fontSize: 10,
    fontWeight: '800',
  },
  planValidTillText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
  },
  planCardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  planCardPrice: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  viewBenefitsBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  viewBenefitsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  planTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.12)',
  },
  tableLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tableLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  tableVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  renewalNote: {
    fontSize: 11,
    marginTop: 8,
  },
  planActionsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  planActionItem: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  planActionText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  visaIconBox: {
    width: 44,
    height: 30,
    backgroundColor: '#1E3A8A',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visaText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  cardNumberText: {
    fontSize: 13,
    fontWeight: '700',
  },
  cardExpText: {
    fontSize: 11,
  },
  defaultPill: {
    backgroundColor: 'rgba(0, 191, 98, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  defaultPillText: {
    color: AppColors.secondaryColor,
    fontSize: 10,
    fontWeight: '800',
  },
  addPaymentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AppColors.primaryColor,
    borderRadius: 12,
    paddingVertical: 10,
    gap: 6,
  },
  addPaymentBtnText: {
    color: AppColors.primaryColor,
    fontSize: 13,
    fontWeight: '700',
  },

  /* Documents Styles */
  docTabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  docTabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  docTabText: {
    fontSize: 13,
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  docIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docInfoBox: {
    flex: 1,
    gap: 2,
  },
  docNameText: {
    fontSize: 14,
    fontWeight: '700',
  },
  docDateText: {
    fontSize: 11,
  },
  docStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  docStatusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  docDownloadBtn: {
    padding: 6,
  },
  uploadNewDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
    marginTop: 8,
  },
  uploadNewDocText: {
    color: AppColors.primaryColor,
    fontSize: 14,
    fontWeight: '700',
  },

  /* Bank Account Styles */
  verifiedGreenPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 191, 98, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedGreenText: {
    color: AppColors.secondaryColor,
    fontSize: 11,
    fontWeight: '800',
  },
  bankFieldItem: {
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.12)',
    gap: 3,
  },
  bankFieldLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  bankFieldValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  payoutsNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 56, 130, 0.08)',
    padding: 12,
    borderRadius: 12,
    marginTop: 14,
  },
  payoutsNoticeText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },

  /* Trainer & Employee Card Rows */
  trainerCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  trainerAvatarWrapper: {
    position: 'relative',
    width: 48,
    height: 48,
  },
  trainerAvatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  verifiedDotCircle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: AppColors.secondaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  trainerCenterInfo: {
    flex: 1,
    gap: 2,
  },
  trainerCardName: {
    fontSize: 15,
    fontWeight: '800',
  },
  trainerSpecText: {
    fontSize: 12,
    fontWeight: '500',
  },
  trainerExpText: {
    fontSize: 11,
    marginTop: 1,
  },
  trainerRightActions: {
    alignItems: 'flex-end',
    gap: 6,
  },
  topBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeBadgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgePillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  certStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  /* Form Styles (Add Trainer / Add Employee) */
  formFieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  uploadDashedBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 4,
  },
  uploadBoxText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  uploadBoxMainText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  uploadBoxSubText: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  uploadedPhotoPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  uploadedPhotoThumb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: AppColors.primaryColor,
  },
  uploadedPhotoTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  uploadedPhotoSub: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  formInput: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  dropdownSelectBox: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownSelectText: {
    fontSize: 14,
    fontWeight: '500',
  },
  specChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  specChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  radioGroupRow: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 4,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInnerFilled: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AppColors.primaryColor,
  },
  radioLabelText: {
    fontSize: 13,
    fontWeight: '600',
  },
  saveFormMainBtn: {
    backgroundColor: AppColors.primaryColor,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 20,
    shadowColor: AppColors.primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveFormMainBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  modalInput: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  modalSaveBtn: {
    backgroundColor: AppColors.primaryColor,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Picker Modals */
  pickerModalCard: {
    borderRadius: 24,
    padding: 20,
    maxHeight: 440,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  pickerModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.15)',
    marginBottom: 6,
  },
  pickerModalTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  pickerOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderBottomWidth: 1,
  },
  pickerOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },

  /* Action Sheet Card */
  actionSheetCard: {
    borderRadius: 24,
    padding: 22,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  actionSheetNameTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  actionSheetSubText: {
    fontSize: 13,
    marginBottom: 10,
  },
  actionSheetItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.12)',
  },
  actionSheetItemText: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionSheetCloseBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 8,
  },
  actionSheetCloseText: {
    fontSize: 14,
    fontWeight: '700',
  },

  /* Sections & Classes Styles */
  secCountBadgeTile: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  secCountBadgeTileText: {
    fontSize: 11,
    fontWeight: '800',
  },
  addSectionTopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  addSectionTopBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  secFilterChipsWrapper: {
    marginBottom: 12,
  },
  secFilterScrollContent: {
    paddingHorizontal: 18,
    gap: 8,
  },
  secCatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  secCatChipText: {
    fontSize: 13,
  },
  secCatCountBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  secCatCountBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  secSearchBoxWrapper: {
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  secSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    gap: 8,
  },
  secSearchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  secListScrollContent: {
    paddingHorizontal: 18,
    gap: 14,
  },
  secEmptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  secEmptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  secEmptySub: {
    fontSize: 13,
  },
  secCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  secCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  secCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  secCategoryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  secSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  secStatusLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  secCardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  secCardDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  secMetricsGrid: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  secMetricChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  secMetricValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  secMetricUnit: {
    fontSize: 11,
    fontWeight: '500',
  },
  secSlotsBlock: {
    gap: 4,
    paddingTop: 4,
  },
  secSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  secSlotLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  secDaysRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    paddingTop: 4,
  },
  secDayPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  secDayPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  secCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    marginTop: 4,
  },
  secActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  secActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  secModalInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  secModalCatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  secModalCatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  secModalCatText: {
    fontSize: 12,
  },
});
