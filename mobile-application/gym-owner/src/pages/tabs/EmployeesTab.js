import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeContext';
import { AppColors } from '../../theme/appTheme';
import { useToast } from '../../widgets/CustomScaffoldMessage';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';
import { getSafeImageUri } from '../../utils/mediaUtils';
import { pickImageFromDevice, capturePhotoFromCamera } from '../../utils/filePickerUtils';

const FILTER_TABS = ['All', 'Trainers', 'Floor Staff', 'Pending Approval'];

const ROLE_OPTIONS = [
  'Certified Fitness Trainer',
  'Personal Coach',
  'Cardio & HIIT Coach',
  'Strength & Conditioning Coach',
  'Front Desk Executive',
  'Floor Manager',
  'Nutritionist / Diet Consultant',
  'Housekeeping & Maintenance',
];

const ACCESS_LEVELS = [
  { value: 'Employee', label: 'Staff / Employee', desc: 'Member check-in & Attendance' },
  { value: 'Trainer', label: 'Trainer / Coach', desc: 'Assigned Members & Sessions' },
  { value: 'Manager', label: 'Floor Manager', desc: 'Staff & Facility Operations' },
];

const AVAILABLE_SERVICES = [
  'Weight Loss Program',
  'Muscle Gain',
  'Strength Training',
  'Fat Loss',
  'HIIT Workouts',
  'Diet & Nutrition',
  'Body Transformation',
];

const getServiceIconName = (service) => {
  const s = (service || '').toLowerCase().trim();
  if (s.includes('weight loss')) return 'local-mall';
  if (s.includes('muscle')) return 'fitness-center';
  if (s.includes('strength')) return 'ad-units';
  if (s.includes('fat')) return 'local-fire-department';
  if (s.includes('hiit') || s.includes('cardio') || s.includes('run')) return 'directions-run';
  if (s.includes('diet') || s.includes('nutrition') || s.includes('meal')) return 'restaurant';
  if (s.includes('transformation') || s.includes('body')) return 'accessibility-new';
  if (s.includes('yoga')) return 'self-improvement';
  if (s.includes('crossfit')) return 'flash-on';
  return 'fitness-center';
};

export const EmployeesTab = ({ topInset, navigation }) => {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const { gym } = useAuth();

  // State
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add Employee Form State
  const [addName, setAddName] = useState('');
  const [addRole, setAddRole] = useState(ROLE_OPTIONS[0]);
  const [addPhone, setAddPhone] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addGender, setAddGender] = useState('Male');
  const [addAccessType, setAddAccessType] = useState('Employee');
  const [addType, setAddType] = useState('Full Time');
  const [addSalary, setAddSalary] = useState('');
  const [addShiftStart, setAddShiftStart] = useState('06:00 AM');
  const [addShiftEnd, setAddShiftEnd] = useState('02:00 PM');
  const [addSpecialty, setAddSpecialty] = useState('');
  const [addEmergencyName, setAddEmergencyName] = useState('');
  const [addEmergencyPhone, setAddEmergencyPhone] = useState('');
  const [addEmergencyRelation, setAddEmergencyRelation] = useState('Parent');
  const [addAvatar, setAddAvatar] = useState(null);

  // Fetch Employees
  const fetchEmployees = useCallback(async () => {
    try {
      const targetGymId = gym?._id || gym?.partnerId;
      const res = await apiService.getEmployees({
        gymId: targetGymId,
        limit: 'all',
      });
      const list = res?.employees || (Array.isArray(res) ? res : []);
      setEmployees(list);
    } catch (err) {
      console.warn('Employees fetch warning:', err.message);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [gym?._id, gym?.partnerId]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEmployees();
  };

  // Metrics
  const trainersCount = useMemo(() => {
    return employees.filter((e) => {
      const roleStr = (e.role || '').toLowerCase();
      return roleStr.includes('trainer') || roleStr.includes('coach');
    }).length;
  }, [employees]);

  const staffCount = useMemo(() => {
    return employees.filter((e) => {
      const roleStr = (e.role || '').toLowerCase();
      return !roleStr.includes('trainer') && !roleStr.includes('coach');
    }).length;
  }, [employees]);

  const pendingCount = useMemo(() => {
    return employees.filter((e) => e.approvalStatus === 'Pending Approval').length;
  }, [employees]);

  // Filtered List
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Tab filter
      const roleStr = (emp.role || '').toLowerCase();
      const isTrainer = roleStr.includes('trainer') || roleStr.includes('coach');

      if (activeTab === 'Trainers' && !isTrainer) return false;
      if (activeTab === 'Floor Staff' && isTrainer) return false;
      if (activeTab === 'Pending Approval' && emp.approvalStatus !== 'Pending Approval') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = (emp.name || '').toLowerCase().includes(q);
        const roleMatch = (emp.role || '').toLowerCase().includes(q);
        const idMatch = (emp.employeeId || '').toLowerCase().includes(q);
        const phoneMatch = (emp.phone || '').toLowerCase().includes(q);
        if (!nameMatch && !roleMatch && !idMatch && !phoneMatch) return false;
      }

      return true;
    });
  }, [employees, activeTab, searchQuery]);

  // Trainer Profile & Showcase State
  const [addAboutMe, setAddAboutMe] = useState(
    'Certified fitness trainer with 8+ years of experience helping clients achieve their fitness goals through personalized training and nutrition guidance.'
  );
  const [addExperience, setAddExperience] = useState('8+ Years');
  const [addServicesOffered, setAddServicesOffered] = useState([
    'Weight Loss Program',
    'Muscle Gain',
    'Strength Training',
    'Fat Loss',
    'HIIT Workouts',
    'Diet & Nutrition',
    'Body Transformation',
  ]);
  const [addCertifications, setAddCertifications] = useState(
    'ACE Certified Personal Trainer\nCertified Strength & Conditioning Specialist (CSCS)\nNutrition & Weight Management Certification'
  );
  const [addLanguages, setAddLanguages] = useState('English, Hindi');

  // Photo picker
  const handlePickPhoto = () => {
    Alert.alert('Employee Profile Photo', 'Choose photo source:', [
      {
        text: 'Take Photo',
        onPress: async () => {
          try {
            const result = await capturePhotoFromCamera();
            if (result?.fileData || result?.uri) {
              setAddAvatar(result.fileData || result.uri);
            }
          } catch (err) {
            showToast({ message: err.message || 'Camera capture failed', isError: true });
          }
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: async () => {
          try {
            const result = await pickImageFromDevice();
            if (result?.fileData || result?.uri) {
              setAddAvatar(result.fileData || result.uri);
            }
          } catch (err) {
            showToast({ message: err.message || 'Photo selection failed', isError: true });
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // Reset add form
  const resetAddForm = () => {
    setAddName('');
    setAddRole(ROLE_OPTIONS[0]);
    setAddPhone('');
    setAddEmail('');
    setAddGender('Male');
    setAddAccessType('Employee');
    setAddType('Full Time');
    setAddSalary('');
    setAddShiftStart('06:00 AM');
    setAddShiftEnd('02:00 PM');
    setAddSpecialty('');
    setAddEmergencyName('');
    setAddEmergencyPhone('');
    setAddEmergencyRelation('Parent');
    setAddAvatar(null);
    setAddAboutMe(
      'Certified fitness trainer with 8+ years of experience helping clients achieve their fitness goals through personalized training and nutrition guidance.'
    );
    setAddExperience('8+ Years');
    setAddServicesOffered([
      'Weight Loss Program',
      'Muscle Gain',
      'Strength Training',
      'Fat Loss',
      'HIIT Workouts',
      'Diet & Nutrition',
      'Body Transformation',
    ]);
    setAddCertifications(
      'ACE Certified Personal Trainer\nCertified Strength & Conditioning Specialist (CSCS)\nNutrition & Weight Management Certification'
    );
    setAddLanguages('English, Hindi');
  };

  // Submit Add Employee
  const handleAddSubmit = async () => {
    if (!addName.trim()) {
      showToast({ message: 'Employee name is required', isError: true });
      return;
    }
    if (!addPhone.trim()) {
      showToast({ message: 'Phone number is required', isError: true });
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanPhone = addPhone.trim().startsWith('+91')
        ? addPhone.trim()
        : `+91 ${addPhone.trim()}`;

      const payload = {
        name: addName.trim(),
        role: addRole,
        phone: cleanPhone,
        email: addEmail.trim() || undefined,
        gender: addGender,
        accessType: addAccessType,
        type: addType,
        avatar: addAvatar || undefined,
        specialty: addSpecialty.trim() || addRole,
        compensation: addSalary ? { payAmount: Number(addSalary), payCycle: 'Monthly' } : undefined,
        schedule: {
          shiftTiming: `${addShiftStart} - ${addShiftEnd}`,
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        },
        emergencyContact: addEmergencyName.trim()
          ? {
              name: addEmergencyName.trim(),
              relation: addEmergencyRelation,
              phone: addEmergencyPhone.trim() || cleanPhone,
            }
          : undefined,
        aboutMe: addAboutMe.trim() || undefined,
        description: addAboutMe.trim() || undefined,
        experience: addExperience.trim() || undefined,
        servicesOffered: addServicesOffered,
        certifications: addCertifications
          .split('\n')
          .map((c) => c.trim().replace(/^[•\-*]\s*/, ''))
          .filter(Boolean),
        languages: addLanguages
          .split(',')
          .map((l) => l.trim())
          .filter(Boolean),
        gymId: gym?._id || gym?.partnerId,
        gymPartnerId: gym?.partnerId || gym?._id,
      };

      const res = await apiService.createEmployee(payload);
      showToast({
        message: res.message || `${addName} submitted! Pending Super Admin approval.`,
        isSuccess: true,
      });
      setShowAddModal(false);
      resetAddForm();
      await fetchEmployees();
    } catch (err) {
      showToast({ message: err.message || 'Failed to add employee', isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status toggle
  const handleToggleStatus = async (emp) => {
    const newStatus = emp.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await apiService.updateEmployee(emp._id || emp.id, { status: newStatus });
      showToast({
        message: `${emp.name} marked as ${newStatus}`,
        isSuccess: true,
      });
      await fetchEmployees();
    } catch (err) {
      showToast({ message: err.message || 'Failed to update status', isError: true });
    }
  };

  // Deactivate
  const handleDeactivate = (emp) => {
    Alert.alert(
      'Deactivate Employee',
      `Are you sure you want to request deactivation for ${emp.name}? This will be submitted to Super Admin.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await apiService.deleteEmployee(emp._id || emp.id);
              showToast({
                message: res.message || 'Deactivation requested',
                isSuccess: true,
              });
              if (showDetailModal) setShowDetailModal(false);
              await fetchEmployees();
            } catch (err) {
              showToast({ message: err.message || 'Failed to deactivate', isError: true });
            }
          },
        },
      ]
    );
  };

  // Contact actions
  const handleCall = (phone) => {
    if (!phone) return;
    const clean = phone.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${clean}`).catch(() => {
      showToast({ message: `Cannot dial ${phone}`, isError: true });
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? AppColors.darkBackground : AppColors.lightBackground }]}>
      {/* 1. Header */}
      <View style={[styles.headerRow, { paddingTop: topInset + 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Staff & Employees
          </Text>
          <Text style={[styles.headerSubtitle, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
            {employees.length} team members configured
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addEmployeeBtn}
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.85}
        >
          <MaterialIcons name="person-add" size={17} color="#FFFFFF" />
          <Text style={styles.addEmployeeBtnText}>Add Employee</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={AppColors.primaryColor}
          />
        }
      >
        {/* 2. Key Metrics Row */}
        <View style={styles.metricsRow}>
          <View
            style={[
              styles.metricCard,
              {
                backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
                borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
              },
            ]}
          >
            <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(0, 102, 204, 0.12)' }]}>
              <MaterialIcons name="badge" size={18} color={AppColors.primaryColor} />
            </View>
            <Text style={[styles.metricNumber, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              {employees.length}
            </Text>
            <Text style={[styles.metricLabel, { color: isDark ? 'rgba(255,255,255,0.5)' : '#64748B' }]}>
              Total Staff
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
            <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
              <MaterialIcons name="fitness-center" size={18} color={AppColors.successGreen} />
            </View>
            <Text style={[styles.metricNumber, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              {trainersCount}
            </Text>
            <Text style={[styles.metricLabel, { color: isDark ? 'rgba(255,255,255,0.5)' : '#64748B' }]}>
              Trainers
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
            <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(168, 85, 247, 0.12)' }]}>
              <MaterialIcons name="support-agent" size={18} color="#A855F7" />
            </View>
            <Text style={[styles.metricNumber, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              {staffCount}
            </Text>
            <Text style={[styles.metricLabel, { color: isDark ? 'rgba(255,255,255,0.5)' : '#64748B' }]}>
              Floor Staff
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
            <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
              <MaterialIcons name="hourglass-empty" size={18} color={AppColors.warningAmber} />
            </View>
            <Text style={[styles.metricNumber, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              {pendingCount}
            </Text>
            <Text style={[styles.metricLabel, { color: isDark ? 'rgba(255,255,255,0.5)' : '#64748B' }]}>
              Pending
            </Text>
          </View>
        </View>

        {/* 3. Quick Attendance Action Card */}
        <TouchableOpacity
          style={[
            styles.attendanceBanner,
            {
              backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
              borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
            },
          ]}
          onPress={() => navigation?.navigate('Attendance')}
          activeOpacity={0.85}
        >
          <View style={styles.attendanceIconCircle}>
            <MaterialIcons name="how-to-reg" size={22} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.attendanceBannerTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Staff & Trainer Attendance Hub
            </Text>
            <Text style={[styles.attendanceBannerSub, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              Record check-ins, verify shift hours & review today's roster
            </Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={16} color={AppColors.primaryColor} />
        </TouchableOpacity>

        {/* 4. Search Bar */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
              borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
            },
          ]}
        >
          <MaterialIcons name="search" size={20} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
            placeholder="Search by name, role, ID, or phone..."
            placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : '#94A3B8'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={18} color={isDark ? '#FFFFFF' : '#64748B'} />
            </TouchableOpacity>
          )}
        </View>

        {/* 5. Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {FILTER_TABS.map((tab) => {
            const isSel = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.filterTabChip,
                  isSel && { backgroundColor: AppColors.primaryColor, borderColor: AppColors.primaryColor },
                  {
                    backgroundColor: isSel
                      ? AppColors.primaryColor
                      : isDark
                      ? AppColors.darkCard
                      : '#FFFFFF',
                    borderColor: isSel
                      ? AppColors.primaryColor
                      : isDark
                      ? AppColors.darkBorder
                      : '#E2E8F0',
                  },
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.filterTabChipText,
                    { color: isSel ? '#FFFFFF' : isDark ? '#FFFFFF' : '#64748B' },
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 6. Employee Cards List */}
        {isLoading ? (
          <View style={{ paddingVertical: 48, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={AppColors.primaryColor} />
            <Text style={{ marginTop: 12, color: isDark ? '#94A3B8' : '#64748B' }}>
              Loading staff roster...
            </Text>
          </View>
        ) : filteredEmployees.length === 0 ? (
          <View
            style={[
              styles.emptyStateCard,
              {
                backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
                borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
              },
            ]}
          >
            <MaterialIcons
              name="badge"
              size={48}
              color={isDark ? 'rgba(255,255,255,0.2)' : '#CBD5E1'}
            />
            <Text style={[styles.emptyTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              No Employees Found
            </Text>
            <Text style={[styles.emptySub, { color: isDark ? 'rgba(255,255,255,0.5)' : '#64748B' }]}>
              {searchQuery
                ? 'Try adjusting your search query or filter criteria.'
                : 'Get started by adding your first trainer or gym staff member.'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                style={styles.emptyAddBtn}
                onPress={() => setShowAddModal(true)}
              >
                <MaterialIcons name="add" size={18} color="#FFFFFF" />
                <Text style={styles.emptyAddBtnText}>Add First Employee</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredEmployees.map((emp) => {
            const avatarUri = getSafeImageUri(emp.avatar);
            const isApproved = emp.approvalStatus === 'Approved';
            const isPending = emp.approvalStatus === 'Pending Approval';
            const isActive = emp.status === 'Active';

            const initials = emp.name
              ? emp.name
                  .split(' ')
                  .filter(Boolean)
                  .map((w) => w[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()
              : 'EM';

            return (
              <TouchableOpacity
                key={emp._id || emp.id || emp.employeeId}
                style={[
                  styles.employeeCard,
                  {
                    backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
                    borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                  },
                ]}
                activeOpacity={0.88}
                onPress={() => {
                  setSelectedEmployee(emp);
                  setShowDetailModal(true);
                }}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.avatarWrap}>
                    {avatarUri ? (
                      <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
                    ) : (
                      <View style={[styles.avatarFallback, { backgroundColor: AppColors.primaryColor }]}>
                        <Text style={styles.avatarFallbackText}>{initials}</Text>
                      </View>
                    )}
                  </View>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={[styles.empName, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                        {emp.name}
                      </Text>
                      <View style={styles.empIdTag}>
                        <Text style={styles.empIdTagText}>{emp.employeeId || 'EMP'}</Text>
                      </View>
                    </View>

                    <Text style={[styles.empRole, { color: isDark ? 'rgba(255,255,255,0.7)' : '#64748B' }]}>
                      {emp.role}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <View
                        style={[
                          styles.typePill,
                          {
                            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                          },
                        ]}
                      >
                        <Text style={[styles.typePillText, { color: isDark ? '#94A3B8' : '#475569' }]}>
                          {emp.type || 'Full Time'} • {emp.accessType || 'Employee'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Status Pill */}
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: isApproved
                          ? 'rgba(16, 185, 129, 0.12)'
                          : isPending
                          ? 'rgba(245, 158, 11, 0.14)'
                          : 'rgba(239, 68, 68, 0.12)',
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor: isApproved
                            ? AppColors.successGreen
                            : isPending
                            ? AppColors.warningAmber
                            : AppColors.dangerRed,
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusPillText,
                        {
                          color: isApproved
                            ? AppColors.successGreen
                            : isPending
                            ? AppColors.warningAmber
                            : AppColors.dangerRed,
                        },
                      ]}
                    >
                      {emp.approvalStatus || 'Approved'}
                    </Text>
                  </View>
                </View>

                {/* Info row */}
                <View
                  style={[
                    styles.cardMetaRow,
                    {
                      borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.metaItem}
                    onPress={() => handleCall(emp.phone)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="phone" size={14} color={AppColors.primaryColor} />
                    <Text style={[styles.metaText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }]}>
                      {emp.phone || 'No phone'}
                    </Text>
                  </TouchableOpacity>

                  {emp.compensation?.payAmount ? (
                    <View style={styles.metaItem}>
                      <MaterialIcons name="payments" size={14} color={AppColors.successGreen} />
                      <Text style={[styles.metaText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }]}>
                        ₹{Number(emp.compensation.payAmount).toLocaleString('en-IN')}/mo
                      </Text>
                    </View>
                  ) : null}

                  {emp.schedule?.shiftTiming ? (
                    <View style={styles.metaItem}>
                      <MaterialIcons name="schedule" size={14} color="#6366F1" />
                      <Text style={[styles.metaText, { color: isDark ? 'rgba(255,255,255,0.7)' : '#475569' }]}>
                        {emp.schedule.shiftTiming}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* Quick Card Action Buttons */}
                <View
                  style={[
                    styles.cardActionsRow,
                    {
                      borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.actionBtn,
                      {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                      },
                    ]}
                    onPress={() => {
                      setSelectedEmployee(emp);
                      setShowDetailModal(true);
                    }}
                  >
                    <MaterialIcons name="visibility" size={15} color={AppColors.primaryColor} />
                    <Text style={[styles.actionBtnText, { color: AppColors.primaryColor }]}>
                      View Profile
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.actionBtn,
                      {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                      },
                    ]}
                    onPress={() => handleToggleStatus(emp)}
                  >
                    <MaterialIcons
                      name={isActive ? 'pause-circle-outline' : 'play-circle-outline'}
                      size={15}
                      color={isActive ? AppColors.warningAmber : AppColors.successGreen}
                    />
                    <Text
                      style={[
                        styles.actionBtnText,
                        { color: isActive ? AppColors.warningAmber : AppColors.successGreen },
                      ]}
                    >
                      {isActive ? 'Mark Inactive' : 'Mark Active'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.actionBtn,
                      {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                      },
                    ]}
                    onPress={() => handleDeactivate(emp)}
                  >
                    <MaterialIcons name="delete-outline" size={15} color={AppColors.dangerRed} />
                    <Text style={[styles.actionBtnText, { color: AppColors.dangerRed }]}>
                      Deactivate
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 7. Detailed Employee Profile Modal */}
      <Modal
        visible={showDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalSheet,
              { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF' },
            ]}
          >
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  Employee Profile
                </Text>
                <Text style={[styles.modalSub, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
                  {selectedEmployee?.employeeId} • {selectedEmployee?.role}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                <MaterialIcons name="close" size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            {selectedEmployee && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Top Row */}
                <View style={styles.modalProfileRow}>
                  {getSafeImageUri(selectedEmployee.avatar) ? (
                    <Image
                      source={{ uri: getSafeImageUri(selectedEmployee.avatar) }}
                      style={styles.modalAvatar}
                    />
                  ) : (
                    <View style={[styles.modalAvatarFallback, { backgroundColor: AppColors.primaryColor }]}>
                      <Text style={styles.modalAvatarText}>
                        {selectedEmployee.name?.substring(0, 2).toUpperCase() || 'EM'}
                      </Text>
                    </View>
                  )}
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={[styles.modalEmpName, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                      {selectedEmployee.name}
                    </Text>
                    <Text style={[styles.modalEmpRole, { color: AppColors.primaryColor }]}>
                      {selectedEmployee.role}
                    </Text>
                    <Text style={[styles.modalEmpAccess, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                      {selectedEmployee.type || 'Full Time'} • Access: {selectedEmployee.accessType || 'Employee'}
                    </Text>
                  </View>
                </View>

                {/* Super Admin Approval Banner */}
                <View
                  style={[
                    styles.approvalBanner,
                    {
                      backgroundColor:
                        selectedEmployee.approvalStatus === 'Approved'
                          ? 'rgba(16, 185, 129, 0.12)'
                          : selectedEmployee.approvalStatus === 'Pending Approval'
                          ? 'rgba(245, 158, 11, 0.14)'
                          : 'rgba(239, 68, 68, 0.12)',
                    },
                  ]}
                >
                  <MaterialIcons
                    name={
                      selectedEmployee.approvalStatus === 'Approved'
                        ? 'verified'
                        : selectedEmployee.approvalStatus === 'Pending Approval'
                        ? 'pending'
                        : 'cancel'
                    }
                    size={20}
                    color={
                      selectedEmployee.approvalStatus === 'Approved'
                        ? AppColors.successGreen
                        : selectedEmployee.approvalStatus === 'Pending Approval'
                        ? AppColors.warningAmber
                        : AppColors.dangerRed
                    }
                  />
                  <Text
                    style={[
                      styles.approvalBannerText,
                      {
                        color:
                          selectedEmployee.approvalStatus === 'Approved'
                            ? AppColors.successGreen
                            : selectedEmployee.approvalStatus === 'Pending Approval'
                            ? AppColors.warningAmber
                            : AppColors.dangerRed,
                      },
                    ]}
                  >
                    Super Admin Status: {selectedEmployee.approvalStatus || 'Approved'}
                  </Text>
                </View>

                {/* Details Section */}
                <View style={styles.sectionBlock}>
                  <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    Contact & Personal Information
                  </Text>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailKey, { color: isDark ? '#94A3B8' : '#64748B' }]}>Phone</Text>
                    <TouchableOpacity onPress={() => handleCall(selectedEmployee.phone)}>
                      <Text style={[styles.detailVal, { color: AppColors.primaryColor }]}>
                        {selectedEmployee.phone || 'N/A'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailKey, { color: isDark ? '#94A3B8' : '#64748B' }]}>Email</Text>
                    <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                      {selectedEmployee.email || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailKey, { color: isDark ? '#94A3B8' : '#64748B' }]}>Gender</Text>
                    <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                      {selectedEmployee.gender || 'Not specified'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailKey, { color: isDark ? '#94A3B8' : '#64748B' }]}>Status</Text>
                    <Text style={[styles.detailVal, { color: selectedEmployee.status === 'Active' ? AppColors.successGreen : AppColors.warningAmber }]}>
                      {selectedEmployee.status || 'Active'}
                    </Text>
                  </View>
                </View>

                {/* Compensation & Shift */}
                <View style={styles.sectionBlock}>
                  <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    Shift & Compensation
                  </Text>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailKey, { color: isDark ? '#94A3B8' : '#64748B' }]}>Monthly Pay</Text>
                    <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                      {selectedEmployee.compensation?.payAmount
                        ? `₹${Number(selectedEmployee.compensation.payAmount).toLocaleString('en-IN')}`
                        : 'Not recorded'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailKey, { color: isDark ? '#94A3B8' : '#64748B' }]}>Shift Hours</Text>
                    <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                      {selectedEmployee.schedule?.shiftTiming || 'General Floor Shift'}
                    </Text>
                  </View>
                </View>

                {/* Emergency Contact */}
                {selectedEmployee.emergencyContact && (
                  <View style={styles.sectionBlock}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                      Emergency Contact
                    </Text>
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailKey, { color: isDark ? '#94A3B8' : '#64748B' }]}>Name</Text>
                      <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                        {selectedEmployee.emergencyContact.name || 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailKey, { color: isDark ? '#94A3B8' : '#64748B' }]}>Relation</Text>
                      <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                        {selectedEmployee.emergencyContact.relation || 'Parent'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailKey, { color: isDark ? '#94A3B8' : '#64748B' }]}>Phone</Text>
                      <TouchableOpacity onPress={() => handleCall(selectedEmployee.emergencyContact.phone)}>
                        <Text style={[styles.detailVal, { color: AppColors.primaryColor }]}>
                          {selectedEmployee.emergencyContact.phone || 'N/A'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Trainer Profile & Showcase (Shown in User App) */}
                <View style={styles.sectionBlock}>
                  <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    Trainer Profile & Showcase (User App)
                  </Text>
                  <Text style={[styles.detailKey, { color: isDark ? '#94A3B8' : '#64748B', marginBottom: 4 }]}>
                    About Me
                  </Text>
                  <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: 12, lineHeight: 20 }]}>
                    {selectedEmployee.aboutMe || selectedEmployee.description || 'Certified fitness trainer with 8+ years of experience helping clients achieve their fitness goals through personalized training and nutrition guidance.'}
                  </Text>

                  <Text style={[styles.detailKey, { color: isDark ? '#94A3B8' : '#64748B', marginBottom: 6 }]}>
                    Services Offered
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                    {(Array.isArray(selectedEmployee.servicesOffered) && selectedEmployee.servicesOffered.length > 0
                      ? selectedEmployee.servicesOffered
                      : AVAILABLE_SERVICES
                    ).map((s, idx) => (
                      <View
                        key={idx}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 8,
                        }}
                      >
                        <MaterialIcons
                          name={getServiceIconName(s)}
                          size={13}
                          color={AppColors.primaryColor}
                          style={{ marginRight: 4 }}
                        />
                        <Text style={{ fontSize: 11, color: isDark ? '#FFFFFF' : '#0F172A', fontWeight: '600' }}>
                          {s}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailKey, { color: isDark ? '#94A3B8' : '#64748B' }]}>Experience</Text>
                    <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                      {selectedEmployee.experience || '8+ Years'}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailKey, { color: isDark ? '#94A3B8' : '#64748B' }]}>Languages</Text>
                    <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                      {Array.isArray(selectedEmployee.languages)
                        ? selectedEmployee.languages.join(', ')
                        : selectedEmployee.languages || 'English, Hindi'}
                    </Text>
                  </View>

                  <Text style={[styles.detailKey, { color: isDark ? '#94A3B8' : '#64748B', marginTop: 8, marginBottom: 4 }]}>
                    Certifications
                  </Text>
                  {(Array.isArray(selectedEmployee.certifications) && selectedEmployee.certifications.length > 0
                    ? selectedEmployee.certifications
                    : [
                        'ACE Certified Personal Trainer',
                        'Certified Strength & Conditioning Specialist (CSCS)',
                        'Nutrition & Weight Management Certification',
                      ]
                  ).map((c, idx) => (
                    <Text
                      key={idx}
                      style={{
                        fontSize: 12,
                        color: isDark ? '#94A3B8' : '#64748B',
                        marginBottom: 3,
                        lineHeight: 18,
                      }}
                    >
                      • {c}
                    </Text>
                  ))}
                </View>

                {/* Action Buttons in Modal */}
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 24 }}>
                  <TouchableOpacity
                    style={[styles.modalActionBtn, { backgroundColor: AppColors.primaryColor, flex: 1 }]}
                    onPress={() => {
                      setShowDetailModal(false);
                      navigation?.navigate('Attendance');
                    }}
                  >
                    <MaterialIcons name="how-to-reg" size={18} color="#FFFFFF" />
                    <Text style={styles.modalActionBtnText}>Attendance</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalActionBtn, { backgroundColor: 'rgba(239, 68, 68, 0.12)', flex: 1 }]}
                    onPress={() => handleDeactivate(selectedEmployee)}
                  >
                    <MaterialIcons name="delete" size={18} color={AppColors.dangerRed} />
                    <Text style={[styles.modalActionBtnText, { color: AppColors.dangerRed }]}>
                      Deactivate
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* 8. Add Employee Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalSheet,
              { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', maxHeight: '92%' },
            ]}
          >
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  Add New Team Member
                </Text>
                <Text style={[styles.modalSub, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
                  Add trainer, coach, or operational gym employee
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <MaterialIcons name="close" size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Photo Upload */}
              <View style={styles.addPhotoRow}>
                <TouchableOpacity onPress={handlePickPhoto} activeOpacity={0.8}>
                  {addAvatar ? (
                    <Image source={{ uri: addAvatar }} style={styles.addPhotoPreview} />
                  ) : (
                    <View
                      style={[
                        styles.addPhotoPlaceholder,
                        { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9' },
                      ]}
                    >
                      <MaterialIcons name="add-a-photo" size={26} color={AppColors.primaryColor} />
                    </View>
                  )}
                </TouchableOpacity>
                <View style={{ marginLeft: 14, flex: 1 }}>
                  <Text style={[styles.photoHelpTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    Employee Photo
                  </Text>
                  <Text style={[styles.photoHelpSub, { color: isDark ? 'rgba(255,255,255,0.5)' : '#64748B' }]}>
                    {addAvatar ? 'Photo attached. Tap to change.' : 'Tap icon to take photo or pick from gallery'}
                  </Text>
                  <TouchableOpacity onPress={handlePickPhoto} style={{ marginTop: 6 }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: AppColors.primaryColor }}>
                      {addAvatar ? 'Change Photo' : 'Upload Photo'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Full Name */}
              <Text style={[styles.formLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Full Name *
              </Text>
              <TextInput
                style={[
                  styles.formInput,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                    borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                  },
                ]}
                placeholder="e.g. Ramesh Kumar"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : '#94A3B8'}
                value={addName}
                onChangeText={setAddName}
              />

              {/* Role Picker */}
              <Text style={[styles.formLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Designation / Role *
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                {ROLE_OPTIONS.map((r) => {
                  const isSel = addRole === r;
                  return (
                    <TouchableOpacity
                      key={r}
                      style={[
                        styles.chipBtn,
                        isSel && { backgroundColor: AppColors.primaryColor, borderColor: AppColors.primaryColor },
                        {
                          backgroundColor: isSel
                            ? AppColors.primaryColor
                            : isDark
                            ? 'rgba(255,255,255,0.05)'
                            : '#F8FAFC',
                          borderColor: isSel
                            ? AppColors.primaryColor
                            : isDark
                            ? AppColors.darkBorder
                            : '#E2E8F0',
                        },
                      ]}
                      onPress={() => setAddRole(r)}
                    >
                      <Text
                        style={[
                          styles.chipBtnText,
                          { color: isSel ? '#FFFFFF' : isDark ? '#FFFFFF' : '#0F172A' },
                        ]}
                      >
                        {r}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Access Level */}
              <Text style={[styles.formLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Access Level
              </Text>
              <View style={styles.accessLevelRow}>
                {ACCESS_LEVELS.map((al) => {
                  const isSel = addAccessType === al.value;
                  return (
                    <TouchableOpacity
                      key={al.value}
                      style={[
                        styles.accessLevelCard,
                        isSel && {
                          borderColor: AppColors.primaryColor,
                          backgroundColor: isDark ? 'rgba(0,102,204,0.12)' : '#EFF6FF',
                        },
                        {
                          borderColor: isSel
                            ? AppColors.primaryColor
                            : isDark
                            ? AppColors.darkBorder
                            : '#E2E8F0',
                          backgroundColor: isSel
                            ? isDark
                              ? 'rgba(0,102,204,0.12)'
                              : '#EFF6FF'
                            : isDark
                            ? 'rgba(255,255,255,0.04)'
                            : '#F8FAFC',
                        },
                      ]}
                      onPress={() => setAddAccessType(al.value)}
                    >
                      <Text
                        style={[
                          styles.accessLevelTitle,
                          { color: isSel ? AppColors.primaryColor : isDark ? '#FFFFFF' : '#0F172A' },
                        ]}
                      >
                        {al.label}
                      </Text>
                      <Text style={[styles.accessLevelDesc, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                        {al.desc}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Phone & Email */}
              <Text style={[styles.formLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Phone Number *
              </Text>
              <TextInput
                style={[
                  styles.formInput,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                    borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                  },
                ]}
                placeholder="+91 98400 12345"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : '#94A3B8'}
                keyboardType="phone-pad"
                value={addPhone}
                onChangeText={setAddPhone}
              />

              <Text style={[styles.formLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Email Address
              </Text>
              <TextInput
                style={[
                  styles.formInput,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                    borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                  },
                ]}
                placeholder="staff@gymezy.com"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : '#94A3B8'}
                keyboardType="email-address"
                autoCapitalize="none"
                value={addEmail}
                onChangeText={setAddEmail}
              />

              {/* Employment Type & Gender */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.formLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    Type
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    {['Full Time', 'Part Time'].map((t) => (
                      <TouchableOpacity
                        key={t}
                        style={[
                          styles.smallChip,
                          addType === t && { backgroundColor: AppColors.primaryColor, borderColor: AppColors.primaryColor },
                          {
                            backgroundColor: addType === t ? AppColors.primaryColor : isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                            borderColor: addType === t ? AppColors.primaryColor : isDark ? AppColors.darkBorder : '#E2E8F0',
                          },
                        ]}
                        onPress={() => setAddType(t)}
                      >
                        <Text style={{ fontSize: 11, fontWeight: '700', color: addType === t ? '#FFFFFF' : isDark ? '#FFFFFF' : '#0F172A' }}>
                          {t}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.formLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    Gender
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    {['Male', 'Female'].map((g) => (
                      <TouchableOpacity
                        key={g}
                        style={[
                          styles.smallChip,
                          addGender === g && { backgroundColor: AppColors.primaryColor, borderColor: AppColors.primaryColor },
                          {
                            backgroundColor: addGender === g ? AppColors.primaryColor : isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                            borderColor: addGender === g ? AppColors.primaryColor : isDark ? AppColors.darkBorder : '#E2E8F0',
                          },
                        ]}
                        onPress={() => setAddGender(g)}
                      >
                        <Text style={{ fontSize: 11, fontWeight: '700', color: addGender === g ? '#FFFFFF' : isDark ? '#FFFFFF' : '#0F172A' }}>
                          {g}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Monthly Salary */}
              <Text style={[styles.formLabel, { color: isDark ? '#FFFFFF' : '#0F172A', marginTop: 12 }]}>
                Monthly Compensation (₹)
              </Text>
              <TextInput
                style={[
                  styles.formInput,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                    borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                  },
                ]}
                placeholder="25000"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : '#94A3B8'}
                keyboardType="numeric"
                value={addSalary}
                onChangeText={setAddSalary}
              />

              {/* Shift Hours */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.formLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    Shift Start
                  </Text>
                  <TextInput
                    style={[
                      styles.formInput,
                      {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                        borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                        color: isDark ? '#FFFFFF' : '#0F172A',
                      },
                    ]}
                    value={addShiftStart}
                    onChangeText={setAddShiftStart}
                    placeholder="06:00 AM"
                    placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : '#94A3B8'}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.formLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    Shift End
                  </Text>
                  <TextInput
                    style={[
                      styles.formInput,
                      {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                        borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                        color: isDark ? '#FFFFFF' : '#0F172A',
                      },
                    ]}
                    value={addShiftEnd}
                    onChangeText={setAddShiftEnd}
                    placeholder="02:00 PM"
                    placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : '#94A3B8'}
                  />
                </View>
              </View>

              {/* Emergency Contact */}
              <Text style={[styles.formLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Emergency Contact (Optional)
              </Text>
              <TextInput
                style={[
                  styles.formInput,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                    borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                  },
                ]}
                placeholder="Guardian / Emergency Name"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : '#94A3B8'}
                value={addEmergencyName}
                onChangeText={setAddEmergencyName}
              />
              <TextInput
                style={[
                  styles.formInput,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                    borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                  },
                ]}
                placeholder="Emergency Contact Phone"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : '#94A3B8'}
                keyboardType="phone-pad"
                value={addEmergencyPhone}
                onChangeText={setAddEmergencyPhone}
              />

              {/* Trainer Profile & Showcase (Shown in User App) */}
              <View
                style={[
                  styles.trainerShowcaseBox,
                  {
                    backgroundColor: isDark ? 'rgba(0,102,204,0.06)' : '#F0F7FF',
                    borderColor: isDark ? 'rgba(0,102,204,0.25)' : '#BAE6FD',
                  },
                ]}
              >
                <View style={styles.showcaseHeaderRow}>
                  <MaterialIcons name="stars" size={18} color={AppColors.primaryColor} />
                  <Text style={[styles.showcaseHeaderTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    Trainer Profile & Showcase (Shown in User App)
                  </Text>
                </View>
                <Text style={[styles.showcaseHeaderSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  This info appears directly in the user mobile app when members view your trainer.
                </Text>

                {/* About Me / Trainer Description */}
                <Text style={[styles.formLabel, { color: isDark ? '#FFFFFF' : '#0F172A', marginTop: 12 }]}>
                  About Me / Trainer Description
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    styles.textAreaInput,
                    {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                      borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                    },
                  ]}
                  multiline
                  numberOfLines={3}
                  value={addAboutMe}
                  onChangeText={setAddAboutMe}
                  placeholder="e.g. Certified fitness trainer with 8+ years of experience helping clients achieve their fitness goals through personalized training and nutrition guidance."
                  placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : '#94A3B8'}
                />

                {/* Services Offered Chips */}
                <Text style={[styles.formLabel, { color: isDark ? '#FFFFFF' : '#0F172A', marginTop: 12 }]}>
                  Services Offered
                </Text>
                <View style={styles.servicesChipContainer}>
                  {AVAILABLE_SERVICES.map((srv) => {
                    const isSelected = addServicesOffered.includes(srv);
                    return (
                      <TouchableOpacity
                        key={srv}
                        style={[
                          styles.serviceChipBtn,
                          isSelected && {
                            backgroundColor: AppColors.primaryColor,
                            borderColor: AppColors.primaryColor,
                          },
                          {
                            backgroundColor: isSelected
                              ? AppColors.primaryColor
                              : isDark
                              ? 'rgba(255,255,255,0.06)'
                              : '#FFFFFF',
                            borderColor: isSelected
                              ? AppColors.primaryColor
                              : isDark
                              ? AppColors.darkBorder
                              : '#E2E8F0',
                          },
                        ]}
                        onPress={() => {
                          if (isSelected) {
                            setAddServicesOffered(addServicesOffered.filter((s) => s !== srv));
                          } else {
                            setAddServicesOffered([...addServicesOffered, srv]);
                          }
                        }}
                      >
                        <MaterialIcons
                          name={getServiceIconName(srv)}
                          size={15}
                          color={isSelected ? '#FFFFFF' : isDark ? '#CBD5E1' : '#475569'}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[
                            styles.serviceChipText,
                            { color: isSelected ? '#FFFFFF' : isDark ? '#FFFFFF' : '#0F172A' },
                          ]}
                        >
                          {srv}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Experience & Languages */}
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.formLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                      Experience
                    </Text>
                    <TextInput
                      style={[
                        styles.formInput,
                        {
                          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                          borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                          color: isDark ? '#FFFFFF' : '#0F172A',
                        },
                      ]}
                      value={addExperience}
                      onChangeText={setAddExperience}
                      placeholder="e.g. 8+ Years"
                      placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : '#94A3B8'}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.formLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                      Languages
                    </Text>
                    <TextInput
                      style={[
                        styles.formInput,
                        {
                          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                          borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                          color: isDark ? '#FFFFFF' : '#0F172A',
                        },
                      ]}
                      value={addLanguages}
                      onChangeText={setAddLanguages}
                      placeholder="e.g. English, Hindi"
                      placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : '#94A3B8'}
                    />
                  </View>
                </View>

                {/* Certifications */}
                <Text style={[styles.formLabel, { color: isDark ? '#FFFFFF' : '#0F172A', marginTop: 12 }]}>
                  Certifications (one per line)
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    styles.textAreaInput,
                    {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                      borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                    },
                  ]}
                  multiline
                  numberOfLines={3}
                  value={addCertifications}
                  onChangeText={setAddCertifications}
                  placeholder="ACE Certified Personal Trainer&#10;Certified Strength & Conditioning Specialist (CSCS)&#10;Nutrition & Weight Management Certification"
                  placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : '#94A3B8'}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  { backgroundColor: AppColors.primaryColor, opacity: isSubmitting ? 0.7 : 1 },
                ]}
                onPress={handleAddSubmit}
                disabled={isSubmitting}
                activeOpacity={0.85}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <MaterialIcons name="person-add" size={20} color="#FFFFFF" />
                    <Text style={styles.submitBtnText}>Submit Employee to Super Admin</Text>
                  </>
                )}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'Outfit-Bold',
  },
  headerSubtitle: {
    fontSize: 12.5,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'Outfit-Medium',
  },
  addEmployeeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primaryColor,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    gap: 6,
    shadowColor: AppColors.primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  addEmployeeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  metricCard: {
    flex: 1,
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  metricIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  metricNumber: {
    fontSize: 16,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  attendanceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
    gap: 12,
  },
  attendanceIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppColors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attendanceBannerTitle: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  attendanceBannerSub: {
    fontSize: 11.5,
    marginTop: 2,
    lineHeight: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  tabsScroll: {
    marginBottom: 14,
  },
  filterTabChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterTabChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyStateCard: {
    padding: 36,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12.5,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    maxWidth: 260,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primaryColor,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 18,
    gap: 6,
  },
  emptyAddBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  employeeCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  avatarImg: {
    width: 48,
    height: 48,
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  empName: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  empIdTag: {
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  empIdTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: AppColors.primaryColor,
  },
  empRole: {
    fontSize: 12.5,
    fontWeight: '600',
    marginTop: 2,
  },
  typePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typePillText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusPillText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  actionBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)',
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
  },
  modalSub: {
    fontSize: 12,
    marginTop: 2,
  },
  modalProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  modalAvatarFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAvatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
  },
  modalEmpName: {
    fontSize: 17,
    fontWeight: '800',
  },
  modalEmpRole: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  modalEmpAccess: {
    fontSize: 12,
    marginTop: 2,
  },
  approvalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  approvalBannerText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  sectionBlock: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailKey: {
    fontSize: 12.5,
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  modalActionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addPhotoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addPhotoPreview: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  addPhotoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AppColors.primaryColor,
    borderStyle: 'dashed',
  },
  photoHelpTitle: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  photoHelpSub: {
    fontSize: 11.5,
    marginTop: 2,
  },
  formLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    marginBottom: 12,
  },
  chipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 6,
  },
  chipBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  accessLevelRow: {
    gap: 8,
    marginBottom: 14,
  },
  accessLevelCard: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  accessLevelTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  accessLevelDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  smallChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 14,
    marginBottom: 30,
    gap: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13.5,
  },
  trainerShowcaseBox: {
    marginTop: 18,
    marginBottom: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  showcaseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  showcaseHeaderTitle: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  showcaseHeaderSub: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 6,
  },
  textAreaInput: {
    minHeight: 70,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  servicesChipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  serviceChipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  serviceChipText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
});
