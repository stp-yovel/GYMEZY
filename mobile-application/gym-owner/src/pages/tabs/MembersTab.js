import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Linking,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeContext';
import { AppColors } from '../../theme/appTheme';
import { useToast } from '../../widgets/CustomScaffoldMessage';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';
import { getSafeImageUri, getGymLogoUri } from '../../utils/mediaUtils';
import { pickImageFromDevice, capturePhotoFromCamera } from '../../utils/filePickerUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MEMBER_FILTER_TABS = ['All', 'Active', 'Expiring Soon', 'Inactive', 'Cancellation Requested'];
const BOOKING_FILTER_TABS = ['All', 'Upcoming', 'Checked-in', 'Completed'];
const CANCEL_FILTER_TABS = ['All', 'Sent to Admin', 'In Review', 'Approved', 'Rejected'];

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const FITNESS_GOALS = [
  'General Fitness',
  'Weight Loss & Fat Burn',
  'Muscle Building & Hypertrophy',
  'CrossFit & High Intensity',
  'Strength & Powerlifting',
  'Endurance & Stamina',
  'Rehab & Mobility',
  'Athletic Performance',
];
const PAYMENT_METHODS = ['UPI', 'Cash', 'Credit / Debit Card', 'Net Banking'];
const GOV_ID_TYPES = ['Aadhar Card', 'PAN Card', 'Driving License', 'Passport', 'Voter ID'];

const DEFAULT_PLANS = [
  { id: 'silver', name: 'Silver (1 Month)', duration: '1 Month', price: 1599, days: 30 },
  { id: 'gold', name: 'Gold (3 Months)', duration: '3 Months', price: 4499, days: 90 },
  { id: 'platinum', name: 'Platinum (6 Months)', duration: '6 Months', price: 7999, days: 180 },
  { id: 'annual', name: 'Annual VIP (12 Months)', duration: '12 Months', price: 14999, days: 365 },
];

export const MembersTab = ({ topInset, navigation }) => {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const { gym, refreshGymProfile } = useAuth();

  // Mode: 'MEMBERS' | 'BOOKINGS' | 'CANCELLATIONS'
  const [activeMode, setActiveMode] = useState('MEMBERS');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [memberFilter, setMemberFilter] = useState('All');
  const [bookingFilter, setBookingFilter] = useState('All');
  const [cancelFilter, setCancelFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live Data States
  const [members, setMembers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [cancellations, setCancellations] = useState([]);
  const [trainersList, setTrainersList] = useState([]);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberDetailsTab, setMemberDetailsTab] = useState('plan'); // 'plan' | 'trainer' | 'emergency' | 'attendance'
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [selectedCancelRequest, setSelectedCancelRequest] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastAddedMember, setLastAddedMember] = useState(null);

  // New Member Form State
  const [addPhoto, setAddPhoto] = useState(null);
  const [addFullName, setAddFullName] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addGender, setAddGender] = useState('Male');
  const [addDOB, setAddDOB] = useState('');
  const [addBloodGroup, setAddBloodGroup] = useState('O+');
  const [addEmergencyName, setAddEmergencyName] = useState('');
  const [addEmergencyRelation, setAddEmergencyRelation] = useState('Parent');
  const [addEmergencyPhone, setAddEmergencyPhone] = useState('');
  const [addPlan, setAddPlan] = useState(DEFAULT_PLANS[1]); // Gold 3 Months
  const [addAssignedTrainer, setAddAssignedTrainer] = useState('');
  const [addPaymentMethod, setAddPaymentMethod] = useState('UPI');
  const [addAmountPaid, setAddAmountPaid] = useState('4499');
  const [addFitnessGoal, setAddFitnessGoal] = useState('General Fitness');
  const [addMedicalNotes, setAddMedicalNotes] = useState('');
  const [addGovDocType, setAddGovDocType] = useState('Aadhar Card');
  const [addGovDocNum, setAddGovDocNum] = useState('');
  const [addGovDocFile, setAddGovDocFile] = useState(null);

  // Extend Membership Form State
  const [extendPlan, setExtendPlan] = useState(DEFAULT_PLANS[1]);
  const [extendAmount, setExtendAmount] = useState('4499');
  const [extendPaymentMethod, setExtendPaymentMethod] = useState('UPI');
  const [extendFromOption, setExtendFromOption] = useState('EXPIRY'); // 'EXPIRY' | 'TODAY'

  // Fetch Live Data
  const fetchAllData = useCallback(async () => {
    try {
      if (refreshGymProfile) {
        await refreshGymProfile();
      }
      const employees = await apiService.getEmployees();
      if (Array.isArray(employees)) {
        const trainers = employees.filter(
          (e) => (e.role || '').toLowerCase().includes('trainer') || (e.role || '').toLowerCase().includes('coach')
        );
        setTrainersList(trainers.length > 0 ? trainers : employees);
      }
    } catch (err) {
      console.warn('Error fetching trainers/gym data:', err.message);
    }
  }, [refreshGymProfile]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchAllData();
    setIsRefreshing(false);
  };

  // Combine Gym Pricing Plans with Defaults
  const availablePlans = useMemo(() => {
    if (Array.isArray(gym?.pricingPlans) && gym.pricingPlans.length > 0) {
      return gym.pricingPlans.map((p, idx) => ({
        id: p._id || p.id || `custom-${idx}`,
        name: p.name || `Plan ${idx + 1}`,
        duration: p.duration || '1 Month',
        price: Number(p.offerPrice || p.price || p.basePrice || 1500),
        days: p.duration?.includes('12') || p.duration?.includes('Annual') ? 365 : p.duration?.includes('6') ? 180 : p.duration?.includes('3') ? 90 : 30,
        popular: p.isPopular,
      }));
    }
    return DEFAULT_PLANS;
  }, [gym?.pricingPlans]);

  // Handle Photo Picker
  const handlePickMemberPhoto = () => {
    Alert.alert('Member Profile Photo', 'Choose photo source:', [
      {
        text: 'Take Photo',
        onPress: async () => {
          try {
            const dataUri = await capturePhotoFromCamera();
            if (dataUri) setAddPhoto(dataUri);
          } catch (err) {
            showToast({ message: err.message || 'Camera capture failed', isError: true });
          }
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: async () => {
          try {
            const dataUri = await pickImageFromDevice();
            if (dataUri) setAddPhoto(dataUri);
          } catch (err) {
            showToast({ message: err.message || 'Photo selection failed', isError: true });
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // Handle Gov Doc File Picker
  const handlePickGovDocFile = () => {
    Alert.alert('Upload ID Proof Document', 'Select document file source:', [
      {
        text: 'Scan with Camera',
        onPress: async () => {
          try {
            const dataUri = await capturePhotoFromCamera();
            if (dataUri) {
              setAddGovDocFile({
                fileName: `${addGovDocType.toLowerCase().replace(/\s+/g, '_')}_scan.jpg`,
                fileData: dataUri,
              });
              showToast({ message: `${addGovDocType} document scanned!`, isSuccess: true });
            }
          } catch (err) {
            showToast({ message: err.message || 'Scan failed', isError: true });
          }
        },
      },
      {
        text: 'Upload File / Image',
        onPress: async () => {
          try {
            const dataUri = await pickImageFromDevice();
            if (dataUri) {
              setAddGovDocFile({
                fileName: `${addGovDocType.toLowerCase().replace(/\s+/g, '_')}_file.jpg`,
                fileData: dataUri,
              });
              showToast({ message: `${addGovDocType} document uploaded!`, isSuccess: true });
            }
          } catch (err) {
            showToast({ message: err.message || 'File upload failed', isError: true });
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // Auto update amount when plan changes in Add Modal
  const handleSelectPlan = (plan) => {
    setAddPlan(plan);
    setAddAmountPaid(String(plan.price));
  };

  // Submit Add Member
  const handleAddMemberSubmit = () => {
    if (!addFullName.trim()) {
      showToast({ message: 'Member full name is required', isError: true });
      return;
    }
    if (!addPhone.trim()) {
      showToast({ message: 'Member phone number is required', isError: true });
      return;
    }

    const cleanPhone = addPhone.trim().startsWith('+91') ? addPhone.trim() : `+91 ${addPhone.trim()}`;
    const initials = addFullName
      .trim()
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(startDate.getDate() + (addPlan.days || 90));

    const formatDate = (d) =>
      d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newMemberObj = {
      id: `MEM${String(members.length + 1).padStart(4, '0')}`,
      key: `mem-${Date.now()}`,
      name: addFullName.trim(),
      phone: cleanPhone,
      email: addEmail.trim() || `${addFullName.trim().toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      gender: addGender,
      dob: addDOB.trim() || '15 May 1998',
      bloodGroup: addBloodGroup,
      avatar: addPhoto || null,
      avatarInitials: initials || 'GM',
      plan: addPlan.name,
      planDuration: addPlan.duration,
      startDate: formatDate(startDate),
      expiryDate: formatDate(expiryDate),
      daysLeft: `${addPlan.days} days left`,
      status: 'Active',
      amount: `₹${Number(addAmountPaid || addPlan.price).toLocaleString('en-IN')}`,
      paymentMethod: addPaymentMethod,
      assignedTrainer: addAssignedTrainer || 'Floor Head Trainer',
      fitnessGoal: addFitnessGoal,
      medicalNotes: addMedicalNotes.trim() || 'No active medical restrictions recorded.',
      emergencyContact: {
        name: addEmergencyName.trim() || 'Guardian Contact',
        relation: addEmergencyRelation,
        phone: addEmergencyPhone.trim() || '+91 98400 00000',
      },
      documents: addGovDocFile
        ? [
            {
              docType: addGovDocType,
              docNum: addGovDocNum.trim() || 'ID-VERIFIED',
              fileName: addGovDocFile.fileName,
              fileData: addGovDocFile.fileData,
            },
          ]
        : [],
      checkins: 0,
      streak: '1 Day',
      joinDate: formatDate(startDate),
      checkinHistory: [
        {
          date: formatDate(startDate),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          area: 'General Strength & Cardio Floor',
        },
      ],
    };

    setMembers([newMemberObj, ...members]);
    setLastAddedMember(newMemberObj);
    setShowAddModal(false);
    setShowSuccessModal(true);

    // Reset Form
    setAddPhoto(null);
    setAddFullName('');
    setAddPhone('');
    setAddEmail('');
    setAddGender('Male');
    setAddDOB('');
    setAddEmergencyName('');
    setAddEmergencyPhone('');
    setAddMedicalNotes('');
    setAddGovDocNum('');
    setAddGovDocFile(null);

    showToast({ message: `Member ${newMemberObj.name} registered successfully!`, isSuccess: true });
  };

  // Submit Extend Membership
  const handleExtendSubmit = () => {
    if (!selectedMember) return;

    const currentExpiry = new Date();
    const daysToAdd = extendPlan.days || 90;
    const newExpiry = new Date(currentExpiry.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

    const formatDate = (d) =>
      d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const updated = members.map((m) => {
      if (m.id === selectedMember.id || m.key === selectedMember.key) {
        return {
          ...m,
          plan: extendPlan.name,
          expiryDate: formatDate(newExpiry),
          daysLeft: `${daysToAdd} days left`,
          status: 'Active',
          amount: `₹${Number(extendAmount || extendPlan.price).toLocaleString('en-IN')}`,
          paymentMethod: extendPaymentMethod,
        };
      }
      return m;
    });

    setMembers(updated);
    if (selectedMember) {
      setSelectedMember({
        ...selectedMember,
        plan: extendPlan.name,
        expiryDate: formatDate(newExpiry),
        daysLeft: `${daysToAdd} days left`,
        status: 'Active',
      });
    }

    setShowExtendModal(false);
    showToast({
      message: `Membership extended for ${selectedMember.name} until ${formatDate(newExpiry)}!`,
      isSuccess: true,
    });
  };

  // Request Membership Cancellation (Dispatches to Super Admin)
  const handleRequestCancellation = (member) => {
    if (!member) return;

    Alert.alert(
      'Request Membership Cancellation',
      `Are you sure you want to request cancellation for ${member.name} (${member.id})?\n\nA formal cancellation request will be dispatched to Super Admin for verification and refund processing.`,
      [
        { text: 'Keep Membership', style: 'cancel' },
        {
          text: 'Send Cancel Request',
          style: 'destructive',
          onPress: () => {
            // Update member status
            setMembers((prev) =>
              prev.map((m) =>
                m.id === member.id
                  ? { ...m, status: 'Cancellation Requested', daysLeft: 'Cancel Pending' }
                  : m
              )
            );

            if (selectedMember && selectedMember.id === member.id) {
              setSelectedMember((prev) => ({
                ...prev,
                status: 'Cancellation Requested',
                daysLeft: 'Cancel Pending',
              }));
            }

            // Create Cancellation Request item
            const newReq = {
              key: `can-${Date.now()}`,
              requestId: `CAN-2025-${String(cancellations.length + 1).padStart(3, '0')}`,
              memberId: member.id,
              memberName: member.name,
              phone: member.phone,
              avatar: member.avatar,
              avatarInitials: member.avatarInitials,
              plan: member.plan,
              amount: member.amount,
              refundableAmount: '₹1,500',
              requestDate:
                new Date().toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }) +
                ', ' +
                new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              reason: 'Member requested early cancellation via Gym Owner Console',
              notes: 'Verified by Gym Owner and dispatched to Super Admin for processing.',
              status: 'Sent to Admin',
              adminStatus: 'In Review by Super Admin',
            };

            setCancellations((prev) => [newReq, ...prev]);
            showToast({
              message: `Cancellation request for ${member.name} sent to Super Admin!`,
              isSuccess: true,
            });
          },
        },
      ]
    );
  };

  // Accept & Forward Cancellation to Admin
  const handleForwardCancelToAdmin = (req) => {
    Alert.alert(
      'Forward to Super Admin',
      `Accept cancellation for ${req.memberName} (${req.requestId}) and forward to Super Admin?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept & Send',
          onPress: () => {
            setCancellations((prev) =>
              prev.map((r) =>
                r.key === req.key
                  ? { ...r, status: 'Sent to Admin', adminStatus: 'In Review by Super Admin' }
                  : r
              )
            );
            setSelectedCancelRequest(null);
            showToast({ message: 'Cancellation request forwarded to Super Admin!', isSuccess: true });
          },
        },
      ]
    );
  };

  // Reject Cancellation Request
  const handleRejectCancelRequest = (req) => {
    Alert.alert(
      'Reject Cancellation',
      `Reject cancellation request for ${req.memberName}? Membership will remain active.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject Request',
          style: 'destructive',
          onPress: () => {
            setCancellations((prev) =>
              prev.map((r) =>
                r.key === req.key
                  ? { ...r, status: 'Rejected', adminStatus: 'Rejected by Gym' }
                  : r
              )
            );
            setMembers((prev) =>
              prev.map((m) => (m.id === req.memberId ? { ...m, status: 'Active' } : m))
            );
            setSelectedCancelRequest(null);
            showToast({ message: `Cancellation request rejected for ${req.memberName}.` });
          },
        },
      ]
    );
  };

  // Check In Day Pass Booking
  const handleCheckInBooking = (bookingKey) => {
    setBookings((prev) =>
      prev.map((b) => (b.key === bookingKey ? { ...b, status: 'Checked-in' } : b))
    );
    showToast({ message: 'Day pass booking verified and Checked-in!', isSuccess: true });
  };

  // 1-Tap Call and WhatsApp
  const handleCall = (phone) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`).catch(() => {
      Alert.alert('Dialer', `Calling ${phone}`);
    });
  };

  const handleWhatsApp = (phone, name) => {
    if (!phone) return;
    const clean = phone.replace(/[^0-9]/g, '');
    const gymName = gym?.name || 'our gym';
    const text = `Hi ${name}, greeting from ${gymName}! How is your workout session going?`;
    Linking.openURL(`whatsapp://send?phone=${clean}&text=${encodeURIComponent(text)}`).catch(() => {
      Alert.alert('WhatsApp', `Opening WhatsApp for ${name} (${phone})`);
    });
  };

  // Filtered Arrays
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesFilter =
        memberFilter === 'All'
          ? true
          : memberFilter === 'Cancellation Requested'
          ? m.status === 'Cancellation Requested'
          : m.status === memberFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        m.name.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.plan.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [members, memberFilter, searchQuery]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesFilter = bookingFilter === 'All' || b.status === bookingFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        b.customerName.toLowerCase().includes(q) ||
        b.bookingId.toLowerCase().includes(q) ||
        b.phone.includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [bookings, bookingFilter, searchQuery]);

  const filteredCancellations = useMemo(() => {
    return cancellations.filter((c) => {
      const matchesFilter =
        cancelFilter === 'All'
          ? true
          : cancelFilter === 'Sent to Admin'
          ? c.status === 'Sent to Admin'
          : cancelFilter === 'In Review'
          ? (c.adminStatus || '').includes('Review')
          : c.status === cancelFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        c.memberName.toLowerCase().includes(q) ||
        c.memberId.toLowerCase().includes(q) ||
        c.requestId.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [cancellations, cancelFilter, searchQuery]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? AppColors.darkBackground : AppColors.lightBackground },
      ]}
    >
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
        {/* 1. TOP SEGMENT SWITCHER (Members / Bookings / Cancellations) */}
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
              size={15}
              color={activeMode === 'MEMBERS' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
            />
            <Text
              style={[
                styles.modeSegmentText,
                { color: activeMode === 'MEMBERS' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B' },
              ]}
            >
              Members ({members.length})
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
              size={15}
              color={activeMode === 'BOOKINGS' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
            />
            <Text
              style={[
                styles.modeSegmentText,
                { color: activeMode === 'BOOKINGS' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B' },
              ]}
            >
              Bookings ({bookings.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeSegmentBtn,
              activeMode === 'CANCELLATIONS' && { backgroundColor: AppColors.primaryColor },
            ]}
            onPress={() => setActiveMode('CANCELLATIONS')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="cancel"
              size={15}
              color={activeMode === 'CANCELLATIONS' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
            />
            <Text
              style={[
                styles.modeSegmentText,
                {
                  color:
                    activeMode === 'CANCELLATIONS' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B',
                },
              ]}
            >
              Cancel ({cancellations.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* 2. HEADER BAR & QUICK ADD BUTTON */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.pageTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              {activeMode === 'MEMBERS'
                ? 'Members Management'
                : activeMode === 'BOOKINGS'
                ? 'Day Pass Bookings'
                : 'Cancellation Requests'}
            </Text>
            <Text
              style={[
                styles.pageSubtitle,
                { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' },
              ]}
            >
              {activeMode === 'MEMBERS'
                ? `${members.length} registered members in gym roster`
                : activeMode === 'BOOKINGS'
                ? `${bookings.length} passes and session bookings`
                : `${cancellations.length} total cancellation requests`}
            </Text>
          </View>

          {activeMode === 'MEMBERS' && (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.85}
            >
              <MaterialIcons name="person-add" size={17} color="#FFFFFF" />
              <Text style={styles.addBtnText}>Add Member</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 3. SEARCH BAR */}
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
                ? 'Search by name, phone, or Member ID...'
                : activeMode === 'BOOKINGS'
                ? 'Search customer name or booking ID...'
                : 'Search member or Request ID...'
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

        {/* 4. FILTER CHIPS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {(activeMode === 'MEMBERS'
            ? MEMBER_FILTER_TABS
            : activeMode === 'BOOKINGS'
            ? BOOKING_FILTER_TABS
            : CANCEL_FILTER_TABS
          ).map((tab) => {
            const isSelected =
              activeMode === 'MEMBERS'
                ? memberFilter === tab
                : activeMode === 'BOOKINGS'
                ? bookingFilter === tab
                : cancelFilter === tab;

            return (
              <TouchableOpacity
                key={tab}
                onPress={() => {
                  if (activeMode === 'MEMBERS') setMemberFilter(tab);
                  else if (activeMode === 'BOOKINGS') setBookingFilter(tab);
                  else setCancelFilter(tab);
                }}
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

        {/* 5. ACTIVE VIEW CONTENT */}

        {/* --- 5A. MEMBERS ROSTER VIEW --- */}
        {activeMode === 'MEMBERS' && (
          <>
            {filteredMembers.length === 0 ? (
              <View
                style={[
                  styles.emptyState,
                  { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF' },
                ]}
              >
                <MaterialIcons
                  name="people-outline"
                  size={48}
                  color={isDark ? 'rgba(255,255,255,0.2)' : '#CBD5E1'}
                />
                <Text
                  style={[
                    styles.emptyTitle,
                    { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155' },
                  ]}
                >
                  No Members Found
                </Text>
                <Text
                  style={[
                    styles.emptySub,
                    { color: isDark ? 'rgba(255,255,255,0.45)' : '#94A3B8' },
                  ]}
                >
                  {searchQuery
                    ? 'No members match your search criteria'
                    : 'Tap "Add Member" above to register your first gym member.'}
                </Text>
              </View>
            ) : (
              filteredMembers.map((member) => {
                const isExpiring = member.status === 'Expiring Soon';
                const isInactive = member.status === 'Inactive';
                const isCancelPending = member.status === 'Cancellation Requested';

                const badgeBg = isCancelPending
                  ? 'rgba(239, 68, 68, 0.12)'
                  : isInactive
                  ? 'rgba(148, 163, 184, 0.15)'
                  : isExpiring
                  ? 'rgba(245, 158, 11, 0.12)'
                  : 'rgba(0, 191, 98, 0.12)';

                const badgeColor = isCancelPending
                  ? AppColors.dangerRed
                  : isInactive
                  ? '#64748B'
                  : isExpiring
                  ? AppColors.warningAmber
                  : AppColors.secondaryColor;

                const avatarUri = getSafeImageUri(member.avatar);

                return (
                  <TouchableOpacity
                    key={member.id || member.key}
                    style={[
                      styles.memberCard,
                      {
                        backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
                        borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                      },
                    ]}
                    onPress={() => {
                      setSelectedMember(member);
                      setMemberDetailsTab('plan');
                    }}
                    activeOpacity={0.85}
                  >
                    <View style={styles.cardTopRow}>
                      <View style={styles.memberMain}>
                        {avatarUri ? (
                          <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
                        ) : (
                          <View style={styles.avatarCircle}>
                            <Text style={styles.avatarText}>
                              {member.avatarInitials ||
                                (member.name || 'M').substring(0, 2).toUpperCase()}
                            </Text>
                          </View>
                        )}
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <View style={styles.nameRow}>
                            <Text
                              style={[
                                styles.memberName,
                                { color: isDark ? '#FFFFFF' : '#0F172A' },
                              ]}
                              numberOfLines={1}
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
                            numberOfLines={1}
                          >
                            {member.plan} • {member.amount || '₹4,499'}
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
                          EXPIRES ON
                        </Text>
                        <Text
                          style={[
                            styles.metaValue,
                            { color: isDark ? '#FFFFFF' : '#0F172A' },
                          ]}
                        >
                          {member.expiryDate || member.expiry || '29 Sep 2027'} (
                          {member.daysLeft || 'Active'})
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
                          <Ionicons name="call" size={16} color={AppColors.primaryColor} />
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

        {/* --- 5B. DAY PASS BOOKINGS VIEW --- */}
        {activeMode === 'BOOKINGS' && (
          <>
            {filteredBookings.length === 0 ? (
              <View
                style={[
                  styles.emptyState,
                  { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF' },
                ]}
              >
                <MaterialIcons
                  name="confirmation-number"
                  size={48}
                  color={isDark ? 'rgba(255,255,255,0.2)' : '#CBD5E1'}
                />
                <Text
                  style={[
                    styles.emptyTitle,
                    { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155' },
                  ]}
                >
                  No Day Pass Bookings
                </Text>
                <Text
                  style={[
                    styles.emptySub,
                    { color: isDark ? 'rgba(255,255,255,0.45)' : '#94A3B8' },
                  ]}
                >
                  Active day passes and slot check-in bookings will appear here in real-time.
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
                      <View
                        style={[
                          styles.bookingAvatar,
                          {
                            backgroundColor: AppColors.primaryColor,
                            alignItems: 'center',
                            justifyContent: 'center',
                          },
                        ]}
                      >
                        <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }}>
                          {(b.customerName || 'U').substring(0, 2).toUpperCase()}
                        </Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <View style={styles.nameRow}>
                          <Text
                            style={[
                              styles.bookingCustomerName,
                              { color: isDark ? '#FFFFFF' : '#0F172A' },
                            ]}
                          >
                            {b.customerName}
                          </Text>
                          <Text style={styles.bookingTypeTag}>{b.type}</Text>
                        </View>
                        <Text
                          style={[
                            styles.bookingMetaSub,
                            { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' },
                          ]}
                        >
                          ID: {b.bookingId} • {b.time}
                        </Text>
                      </View>

                      <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                        <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                          {b.status}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.cardDivider,
                        { backgroundColor: isDark ? AppColors.darkBorder : '#F1F5F9' },
                      ]}
                    />

                    <View style={styles.bookingBottomRow}>
                      <View>
                        <Text
                          style={[
                            styles.metaLabel,
                            { color: isDark ? 'rgba(255,255,255,0.45)' : '#94A3B8' },
                          ]}
                        >
                          AMOUNT & PAYMENT
                        </Text>
                        <Text
                          style={[
                            styles.metaValue,
                            { color: isDark ? '#FFFFFF' : '#0F172A' },
                          ]}
                        >
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
                          <Text style={styles.verifyCheckinBtnText}>Check In Pass</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.verifiedPassBadge}>
                          <MaterialIcons
                            name="check-circle"
                            size={14}
                            color={AppColors.secondaryColor}
                          />
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

        {/* --- 5C. CANCELLATION REQUESTS VIEW --- */}
        {activeMode === 'CANCELLATIONS' && (
          <>
            {filteredCancellations.length === 0 ? (
              <View
                style={[
                  styles.emptyState,
                  { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF' },
                ]}
              >
                <MaterialIcons
                  name="cancel"
                  size={48}
                  color={isDark ? 'rgba(255,255,255,0.2)' : '#CBD5E1'}
                />
                <Text
                  style={[
                    styles.emptyTitle,
                    { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155' },
                  ]}
                >
                  No Cancellation Requests
                </Text>
                <Text
                  style={[
                    styles.emptySub,
                    { color: isDark ? 'rgba(255,255,255,0.45)' : '#94A3B8' },
                  ]}
                >
                  Member cancellation requests dispatched for Super Admin refund review will appear here.
                </Text>
              </View>
            ) : (
              filteredCancellations.map((req) => {
                const isSentToAdmin = req.status === 'Sent to Admin';
                const isRejected = req.status === 'Rejected';

                const statusBg = isRejected
                  ? 'rgba(239, 68, 68, 0.12)'
                  : isSentToAdmin
                  ? 'rgba(59, 130, 246, 0.12)'
                  : 'rgba(0, 191, 98, 0.12)';

                const statusColor = isRejected
                  ? AppColors.dangerRed
                  : isSentToAdmin
                  ? '#3B82F6'
                  : AppColors.secondaryColor;

                return (
                  <TouchableOpacity
                    key={req.key || req.requestId}
                    style={[
                      styles.memberCard,
                      {
                        backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
                        borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                      },
                    ]}
                    onPress={() => setSelectedCancelRequest(req)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.cardTopRow}>
                      <View style={styles.memberMain}>
                        <View
                          style={[
                            styles.avatarCircle,
                            { backgroundColor: 'rgba(239, 68, 68, 0.15)' },
                          ]}
                        >
                          <Text style={[styles.avatarText, { color: AppColors.dangerRed }]}>
                            {req.avatarInitials ||
                              (req.memberName || 'C').substring(0, 2).toUpperCase()}
                          </Text>
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <View style={styles.nameRow}>
                            <Text
                              style={[
                                styles.memberName,
                                { color: isDark ? '#FFFFFF' : '#0F172A' },
                              ]}
                            >
                              {req.memberName}
                            </Text>
                            <Text style={styles.memberIdText}>{req.requestId}</Text>
                          </View>
                          <Text
                            style={[
                              styles.memberPlan,
                              { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' },
                            ]}
                          >
                            {req.plan} • Refund: {req.refundableAmount || '₹1,500'}
                          </Text>
                        </View>
                      </View>

                      <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                        <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                          {req.status}
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
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.metaLabel,
                            { color: isDark ? 'rgba(255,255,255,0.45)' : '#94A3B8' },
                          ]}
                        >
                          ADMIN STATUS
                        </Text>
                        <Text
                          style={[
                            styles.metaValue,
                            { color: isDark ? '#FFFFFF' : '#0F172A' },
                          ]}
                          numberOfLines={1}
                        >
                          {req.adminStatus || 'In Review by Super Admin'}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.smallActionBtn,
                          { backgroundColor: AppColors.primaryColor },
                        ]}
                        onPress={() => setSelectedCancelRequest(req)}
                      >
                        <Text style={styles.smallActionBtnText}>View Details</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </>
        )}
      </ScrollView>

      {/* ========================================================================= */}
      {/* 6. MEMBER DETAILS MODAL / PROFILE INSPECTION SHEET                       */}
      {/* ========================================================================= */}
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
              { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', maxHeight: '88%' },
            ]}
          >
            {selectedMember && (
              <>
                {/* Modal Top Navigation */}
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    Member Profile Details
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedMember(null)}>
                    <MaterialIcons
                      name="close"
                      size={24}
                      color={isDark ? '#FFFFFF' : '#0F172A'}
                    />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Member Hero Row */}
                  <View style={styles.sheetTopProfileRow}>
                    {getSafeImageUri(selectedMember.avatar) ? (
                      <Image
                        source={{ uri: getSafeImageUri(selectedMember.avatar) }}
                        style={styles.sheetAvatarImg}
                      />
                    ) : (
                      <View style={styles.sheetAvatarBox}>
                        <Text style={styles.sheetAvatarText}>
                          {selectedMember.avatarInitials ||
                            (selectedMember.name || 'M').substring(0, 2).toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View style={{ flex: 1, marginLeft: 14 }}>
                      <Text
                        style={[
                          styles.sheetMemberName,
                          { color: isDark ? '#FFFFFF' : '#0F172A' },
                        ]}
                      >
                        {selectedMember.name}
                      </Text>
                      <Text style={[styles.sheetPlanText, { color: AppColors.primaryColor }]}>
                        {selectedMember.plan}
                      </Text>
                      <Text
                        style={[
                          styles.sheetIdText,
                          { color: isDark ? 'rgba(255,255,255,0.5)' : '#94A3B8' },
                        ]}
                      >
                        ID: {selectedMember.id} • Joined {selectedMember.joinDate || '21 Jul 2025'}
                      </Text>
                    </View>
                  </View>

                  {/* 1-Tap Quick Action Buttons */}
                  <View style={styles.sheetQuickContactRow}>
                    <TouchableOpacity
                      style={[styles.sheetContactBtn, { backgroundColor: '#3B82F6' }]}
                      onPress={() => handleCall(selectedMember.phone)}
                    >
                      <Ionicons name="call" size={16} color="#FFFFFF" />
                      <Text style={styles.sheetContactBtnText}>Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.sheetContactBtn, { backgroundColor: AppColors.secondaryColor }]}
                      onPress={() => handleWhatsApp(selectedMember.phone, selectedMember.name)}
                    >
                      <Ionicons name="logo-whatsapp" size={16} color="#FFFFFF" />
                      <Text style={styles.sheetContactBtnText}>WhatsApp</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Segment Tabs in Details Sheet */}
                  <View
                    style={[
                      styles.sheetSegmentContainer,
                      {
                        backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                        borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                      },
                    ]}
                  >
                    {[
                      { id: 'plan', label: 'Plan & Validity' },
                      { id: 'trainer', label: 'Trainer & Goals' },
                      { id: 'emergency', label: 'Emergency' },
                      { id: 'attendance', label: 'Check-ins' },
                    ].map((tab) => (
                      <TouchableOpacity
                        key={tab.id}
                        style={[
                          styles.sheetSegmentTab,
                          memberDetailsTab === tab.id && {
                            backgroundColor: AppColors.primaryColor,
                          },
                        ]}
                        onPress={() => setMemberDetailsTab(tab.id)}
                      >
                        <Text
                          style={[
                            styles.sheetSegmentTabText,
                            {
                              color:
                                memberDetailsTab === tab.id
                                  ? '#FFFFFF'
                                  : isDark
                                  ? '#94A3B8'
                                  : '#64748B',
                              fontWeight: memberDetailsTab === tab.id ? '700' : '500',
                            },
                          ]}
                        >
                          {tab.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Tab 1: Plan & Validity */}
                  {memberDetailsTab === 'plan' && (
                    <View style={styles.sheetSectionBox}>
                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                          Membership Plan
                        </Text>
                        <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                          {selectedMember.plan}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                          Start Date
                        </Text>
                        <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                          {selectedMember.startDate || '21 Jul 2025'}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                          Expiry Date
                        </Text>
                        <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                          {selectedMember.expiryDate || selectedMember.expiry || '29 Sep 2027'}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                          Days Remaining
                        </Text>
                        <Text
                          style={[
                            styles.detailVal,
                            {
                              color:
                                selectedMember.status === 'Active'
                                  ? AppColors.secondaryColor
                                  : AppColors.warningAmber,
                              fontWeight: '700',
                            },
                          ]}
                        >
                          {selectedMember.daysLeft || '90 days left'}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                          Paid Amount
                        </Text>
                        <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                          {selectedMember.amount || '₹4,499'} (
                          {selectedMember.paymentMethod || 'Online / UPI'})
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Tab 2: Trainer & Goals */}
                  {memberDetailsTab === 'trainer' && (
                    <View style={styles.sheetSectionBox}>
                      <View
                        style={[
                          styles.trainerCardBox,
                          {
                            backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                            borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                          },
                        ]}
                      >
                        <MaterialIcons
                          name="fitness-center"
                          size={24}
                          color={AppColors.primaryColor}
                        />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text
                            style={[
                              styles.trainerCardTitle,
                              { color: isDark ? '#FFFFFF' : '#0F172A' },
                            ]}
                          >
                            {selectedMember.assignedTrainer || 'Floor Head Trainer'}
                          </Text>
                          <Text
                            style={[
                              styles.trainerCardSub,
                              { color: isDark ? '#94A3B8' : '#64748B' },
                            ]}
                          >
                            Assigned Personal Coach
                          </Text>
                        </View>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                          Fitness Goal
                        </Text>
                        <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                          {selectedMember.fitnessGoal || 'General Fitness'}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                          Blood Group
                        </Text>
                        <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                          {selectedMember.bloodGroup || 'O+'}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                          Medical Notes
                        </Text>
                        <Text
                          style={[
                            styles.detailVal,
                            { color: isDark ? '#FFFFFF' : '#0F172A', flex: 1, textAlign: 'right' },
                          ]}
                        >
                          {selectedMember.medicalNotes || 'None'}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Tab 3: Emergency & Contact */}
                  {memberDetailsTab === 'emergency' && (
                    <View style={styles.sheetSectionBox}>
                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                          Member Phone
                        </Text>
                        <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                          {selectedMember.phone}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                          Member Email
                        </Text>
                        <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                          {selectedMember.email}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                          Emergency Contact Name
                        </Text>
                        <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                          {selectedMember.emergencyContact?.name || 'Guardian'} (
                          {selectedMember.emergencyContact?.relation || 'Parent'})
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                          Emergency Phone
                        </Text>
                        <Text
                          style={[
                            styles.detailVal,
                            { color: AppColors.dangerRed, fontWeight: '700' },
                          ]}
                        >
                          {selectedMember.emergencyContact?.phone ||
                            selectedMember.emergencyContact ||
                            '+91 98400 00000'}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Tab 4: Check-in History */}
                  {memberDetailsTab === 'attendance' && (
                    <View style={styles.sheetSectionBox}>
                      <View style={styles.sheetStatsGrid}>
                        <View
                          style={[
                            styles.sheetStatBox,
                            { backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC' },
                          ]}
                        >
                          <Text style={[styles.sheetStatNum, { color: AppColors.primaryColor }]}>
                            {selectedMember.checkins || 0}
                          </Text>
                          <Text
                            style={[
                              styles.sheetStatLabel,
                              { color: isDark ? '#94A3B8' : '#64748B' },
                            ]}
                          >
                            Total Check-ins
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.sheetStatBox,
                            { backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC' },
                          ]}
                        >
                          <Text
                            style={[styles.sheetStatNum, { color: AppColors.secondaryColor }]}
                          >
                            {selectedMember.streak || '1 Day'}
                          </Text>
                          <Text
                            style={[
                              styles.sheetStatLabel,
                              { color: isDark ? '#94A3B8' : '#64748B' },
                            ]}
                          >
                            Active Streak
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={[
                          styles.subHeaderLabel,
                          { color: isDark ? '#FFFFFF' : '#0F172A', marginTop: 14 },
                        ]}
                      >
                        Recent Attendance Activity
                      </Text>

                      {Array.isArray(selectedMember.checkinHistory) &&
                      selectedMember.checkinHistory.length > 0 ? (
                        selectedMember.checkinHistory.map((item, idx) => (
                          <View
                            key={idx}
                            style={[
                              styles.checkinLogItem,
                              {
                                backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                                borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                              },
                            ]}
                          >
                            <MaterialIcons
                              name="check-circle"
                              size={18}
                              color={AppColors.secondaryColor}
                            />
                            <View style={{ flex: 1, marginLeft: 10 }}>
                              <Text
                                style={[
                                  styles.checkinLogArea,
                                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                                ]}
                              >
                                {item.area || 'Workout Floor'}
                              </Text>
                              <Text
                                style={[
                                  styles.checkinLogTime,
                                  { color: isDark ? '#94A3B8' : '#64748B' },
                                ]}
                              >
                                {item.date} at {item.time}
                              </Text>
                            </View>
                          </View>
                        ))
                      ) : (
                        <Text
                          style={[
                            styles.emptySub,
                            { color: isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8' },
                          ]}
                        >
                          No past check-in sessions recorded yet.
                        </Text>
                      )}
                    </View>
                  )}

                  {/* Primary Action Buttons */}
                  <View style={styles.sheetBottomActionRow}>
                    <TouchableOpacity
                      style={[styles.sheetMainBtn, { backgroundColor: AppColors.primaryColor }]}
                      onPress={() => {
                        setExtendPlan(availablePlans[1] || availablePlans[0]);
                        setExtendAmount(String(availablePlans[1]?.price || 4499));
                        setShowExtendModal(true);
                      }}
                    >
                      <MaterialIcons name="autorenew" size={18} color="#FFFFFF" />
                      <Text style={styles.sheetMainBtnText}>Extend / Renew Plan</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.sheetSecondaryBtn,
                        {
                          borderColor: AppColors.dangerRed,
                          backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        },
                      ]}
                      onPress={() => handleRequestCancellation(selectedMember)}
                    >
                      <MaterialIcons name="cancel" size={18} color={AppColors.dangerRed} />
                      <Text style={[styles.sheetSecondaryBtnText, { color: AppColors.dangerRed }]}>
                        Cancel Membership
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* 7. EXTEND MEMBERSHIP MODAL                                               */}
      {/* ========================================================================= */}
      <Modal
        visible={showExtendModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExtendModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', maxHeight: '80%' },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Extend Membership
              </Text>
              <TouchableOpacity onPress={() => setShowExtendModal(false)}>
                <MaterialIcons name="close" size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={[
                  styles.fieldLabel,
                  { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155' },
                ]}
              >
                Select Extension Plan
              </Text>
              <View style={styles.planSelectorGrid}>
                {availablePlans.map((p) => {
                  const isSelected = extendPlan.id === p.id;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={[
                        styles.planSelectCard,
                        {
                          backgroundColor: isSelected
                            ? isDark
                              ? '#1E293B'
                              : '#EFF6FF'
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
                      onPress={() => {
                        setExtendPlan(p);
                        setExtendAmount(String(p.price));
                      }}
                    >
                      <Text
                        style={[
                          styles.planSelectName,
                          {
                            color: isSelected
                              ? AppColors.primaryColor
                              : isDark
                              ? '#FFFFFF'
                              : '#0F172A',
                          },
                        ]}
                      >
                        {p.name}
                      </Text>
                      <Text
                        style={[
                          styles.planSelectPrice,
                          { color: isDark ? '#FFFFFF' : '#0F172A' },
                        ]}
                      >
                        ₹{Number(p.price).toLocaleString('en-IN')}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text
                style={[
                  styles.fieldLabel,
                  { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155', marginTop: 14 },
                ]}
              >
                Renewal Amount (₹)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                    borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                  },
                ]}
                value={extendAmount}
                onChangeText={setExtendAmount}
                keyboardType="numeric"
              />

              <Text
                style={[
                  styles.fieldLabel,
                  { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155', marginTop: 14 },
                ]}
              >
                Payment Method
              </Text>
              <View style={styles.chipsRow}>
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = extendPaymentMethod === method;
                  return (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.chipBtn,
                        {
                          backgroundColor: isSelected
                            ? AppColors.primaryColor
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
                      onPress={() => setExtendPaymentMethod(method)}
                    >
                      <Text
                        style={[
                          styles.chipBtnText,
                          {
                            color: isSelected
                              ? '#FFFFFF'
                              : isDark
                              ? '#94A3B8'
                              : '#64748B',
                          },
                        ]}
                      >
                        {method}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: AppColors.primaryColor, marginTop: 22 }]}
                onPress={handleExtendSubmit}
              >
                <MaterialIcons name="done" size={20} color="#FFFFFF" />
                <Text style={styles.submitBtnText}>Confirm Renewal & Extend</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* 8. CANCELLATION REQUEST DETAILS MODAL                                    */}
      {/* ========================================================================= */}
      <Modal
        visible={!!selectedCancelRequest}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedCancelRequest(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', maxHeight: '80%' },
            ]}
          >
            {selectedCancelRequest && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    Cancellation Request Details
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedCancelRequest(null)}>
                    <MaterialIcons
                      name="close"
                      size={24}
                      color={isDark ? '#FFFFFF' : '#0F172A'}
                    />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                      Request ID
                    </Text>
                    <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A', fontWeight: '700' }]}>
                      {selectedCancelRequest.requestId}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                      Member Name
                    </Text>
                    <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                      {selectedCancelRequest.memberName} ({selectedCancelRequest.memberId})
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                      Plan & Paid Amount
                    </Text>
                    <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                      {selectedCancelRequest.plan} • {selectedCancelRequest.amount}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                      Refundable Amount
                    </Text>
                    <Text style={[styles.detailVal, { color: AppColors.secondaryColor, fontWeight: '700' }]}>
                      {selectedCancelRequest.refundableAmount || '₹1,500'}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                      Cancellation Reason
                    </Text>
                    <Text style={[styles.detailVal, { color: isDark ? '#FFFFFF' : '#0F172A', flex: 1, textAlign: 'right' }]}>
                      {selectedCancelRequest.reason}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                      Super Admin Status
                    </Text>
                    <Text style={[styles.detailVal, { color: AppColors.primaryColor, fontWeight: '700' }]}>
                      {selectedCancelRequest.adminStatus}
                    </Text>
                  </View>

                  <View style={styles.sheetBottomActionRow}>
                    <TouchableOpacity
                      style={[styles.sheetMainBtn, { backgroundColor: AppColors.primaryColor }]}
                      onPress={() => handleForwardCancelToAdmin(selectedCancelRequest)}
                    >
                      <MaterialIcons name="send" size={18} color="#FFFFFF" />
                      <Text style={styles.sheetMainBtnText}>Accept & Send to Admin</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.sheetSecondaryBtn,
                        { borderColor: AppColors.dangerRed, backgroundColor: 'rgba(239, 68, 68, 0.08)' },
                      ]}
                      onPress={() => handleRejectCancelRequest(selectedCancelRequest)}
                    >
                      <MaterialIcons name="close" size={18} color={AppColors.dangerRed} />
                      <Text style={[styles.sheetSecondaryBtnText, { color: AppColors.dangerRed }]}>
                        Reject Request
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* 9. ADD MEMBER MODAL (COMPREHENSIVE FULL-INPUT FORM MATCHING WEB)          */}
      {/* ========================================================================= */}
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
              { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', maxHeight: '92%' },
            ]}
          >
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  Register New Member
                </Text>
                <Text style={[styles.modalSubTitle, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
                  Enter full membership, trainer, emergency, and KYC details
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <MaterialIcons name="close" size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Photo Upload Section */}
              <View style={styles.addPhotoRow}>
                <TouchableOpacity onPress={handlePickMemberPhoto} activeOpacity={0.8}>
                  {addPhoto ? (
                    <Image source={{ uri: addPhoto }} style={styles.addPhotoPreview} />
                  ) : (
                    <View
                      style={[
                        styles.addPhotoPlaceholder,
                        { backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC' },
                      ]}
                    >
                      <MaterialIcons name="add-a-photo" size={26} color={AppColors.primaryColor} />
                    </View>
                  )}
                </TouchableOpacity>
                <View style={{ marginLeft: 14, flex: 1 }}>
                  <Text style={[styles.photoHelpTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    Member Profile Photo
                  </Text>
                  <Text style={[styles.photoHelpSub, { color: isDark ? 'rgba(255,255,255,0.5)' : '#94A3B8' }]}>
                    Take camera photo or upload from device gallery
                  </Text>
                  <TouchableOpacity onPress={handlePickMemberPhoto} style={styles.photoUploadBtn}>
                    <Text style={styles.photoUploadBtnText}>
                      {addPhoto ? 'Change Photo' : 'Upload Photo'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 1. Full Name */}
              <Text style={[styles.fieldLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155' }]}>
                Full Name *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                    borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                  },
                ]}
                placeholder="e.g. Rahul Sharma"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.35)' : '#94A3B8'}
                value={addFullName}
                onChangeText={setAddFullName}
              />

              {/* 2. Phone & Email */}
              <View style={styles.formRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[styles.fieldLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155' }]}>
                    Phone Number *
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                        borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                        color: isDark ? '#FFFFFF' : '#0F172A',
                      },
                    ]}
                    placeholder="+91 98765 43210"
                    placeholderTextColor={isDark ? 'rgba(255,255,255,0.35)' : '#94A3B8'}
                    value={addPhone}
                    onChangeText={setAddPhone}
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={[styles.fieldLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155' }]}>
                    Email Address
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                        borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                        color: isDark ? '#FFFFFF' : '#0F172A',
                      },
                    ]}
                    placeholder="rahul@example.com"
                    placeholderTextColor={isDark ? 'rgba(255,255,255,0.35)' : '#94A3B8'}
                    value={addEmail}
                    onChangeText={setAddEmail}
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* 3. Gender & Blood Group */}
              <View style={styles.formRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[styles.fieldLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155' }]}>
                    Gender
                  </Text>
                  <View style={styles.chipsRow}>
                    {GENDER_OPTIONS.map((g) => (
                      <TouchableOpacity
                        key={g}
                        style={[
                          styles.chipBtn,
                          {
                            backgroundColor:
                              addGender === g
                                ? AppColors.primaryColor
                                : isDark
                                ? AppColors.darkSurface
                                : '#F8FAFC',
                            borderColor:
                              addGender === g
                                ? AppColors.primaryColor
                                : isDark
                                ? AppColors.darkBorder
                                : '#E2E8F0',
                          },
                        ]}
                        onPress={() => setAddGender(g)}
                      >
                        <Text
                          style={[
                            styles.chipBtnText,
                            {
                              color:
                                addGender === g
                                  ? '#FFFFFF'
                                  : isDark
                                  ? '#94A3B8'
                                  : '#64748B',
                            },
                          ]}
                        >
                          {g}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={[styles.fieldLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155' }]}>
                    Blood Group
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {BLOOD_GROUPS.map((bg) => (
                      <TouchableOpacity
                        key={bg}
                        style={[
                          styles.chipBtn,
                          {
                            marginRight: 6,
                            backgroundColor:
                              addBloodGroup === bg
                                ? AppColors.secondaryColor
                                : isDark
                                ? AppColors.darkSurface
                                : '#F8FAFC',
                            borderColor:
                              addBloodGroup === bg
                                ? AppColors.secondaryColor
                                : isDark
                                ? AppColors.darkBorder
                                : '#E2E8F0',
                          },
                        ]}
                        onPress={() => setAddBloodGroup(bg)}
                      >
                        <Text
                          style={[
                            styles.chipBtnText,
                            {
                              color:
                                addBloodGroup === bg
                                  ? '#FFFFFF'
                                  : isDark
                                  ? '#94A3B8'
                                  : '#64748B',
                            },
                          ]}
                        >
                          {bg}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              {/* 4. Plan Selection */}
              <Text
                style={[
                  styles.fieldLabel,
                  { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155', marginTop: 14 },
                ]}
              >
                Membership Plan *
              </Text>
              <View style={styles.planSelectorGrid}>
                {availablePlans.map((p) => {
                  const isSelected = addPlan.id === p.id;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={[
                        styles.planSelectCard,
                        {
                          backgroundColor: isSelected
                            ? isDark
                              ? '#1E293B'
                              : '#EFF6FF'
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
                      onPress={() => handleSelectPlan(p)}
                    >
                      <Text
                        style={[
                          styles.planSelectName,
                          {
                            color: isSelected
                              ? AppColors.primaryColor
                              : isDark
                              ? '#FFFFFF'
                              : '#0F172A',
                          },
                        ]}
                      >
                        {p.name}
                      </Text>
                      <Text
                        style={[
                          styles.planSelectPrice,
                          { color: isDark ? '#FFFFFF' : '#0F172A' },
                        ]}
                      >
                        ₹{Number(p.price).toLocaleString('en-IN')}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* 5. Assigned Trainer Dropdown */}
              <Text
                style={[
                  styles.fieldLabel,
                  { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155', marginTop: 14 },
                ]}
              >
                Assigned Personal Trainer
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {trainersList.map((t, idx) => {
                  const trainerName = t.fullName || t.name || `Trainer ${idx + 1}`;
                  const isSelected = addAssignedTrainer === trainerName;
                  return (
                    <TouchableOpacity
                      key={t._id || t.id || idx}
                      style={[
                        styles.chipBtn,
                        {
                          marginRight: 8,
                          backgroundColor: isSelected
                            ? AppColors.primaryColor
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
                      onPress={() => setAddAssignedTrainer(trainerName)}
                    >
                      <Text
                        style={[
                          styles.chipBtnText,
                          {
                            color: isSelected
                              ? '#FFFFFF'
                              : isDark
                              ? '#94A3B8'
                              : '#64748B',
                          },
                        ]}
                      >
                        {trainerName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* 6. Payment Method & Amount Paid */}
              <View style={styles.formRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[styles.fieldLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155' }]}>
                    Payment Method
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {PAYMENT_METHODS.map((method) => (
                      <TouchableOpacity
                        key={method}
                        style={[
                          styles.chipBtn,
                          {
                            marginRight: 6,
                            backgroundColor:
                              addPaymentMethod === method
                                ? AppColors.primaryColor
                                : isDark
                                ? AppColors.darkSurface
                                : '#F8FAFC',
                            borderColor:
                              addPaymentMethod === method
                                ? AppColors.primaryColor
                                : isDark
                                ? AppColors.darkBorder
                                : '#E2E8F0',
                          },
                        ]}
                        onPress={() => setAddPaymentMethod(method)}
                      >
                        <Text
                          style={[
                            styles.chipBtnText,
                            {
                              color:
                                addPaymentMethod === method
                                  ? '#FFFFFF'
                                  : isDark
                                  ? '#94A3B8'
                                  : '#64748B',
                            },
                          ]}
                        >
                          {method}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={[styles.fieldLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155' }]}>
                    Amount Paid (₹)
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                        borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                        color: isDark ? '#FFFFFF' : '#0F172A',
                      },
                    ]}
                    value={addAmountPaid}
                    onChangeText={setAddAmountPaid}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* 7. Emergency Contact Details */}
              <Text
                style={[
                  styles.fieldLabel,
                  { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155', marginTop: 14 },
                ]}
              >
                Emergency Contact Name & Relation
              </Text>
              <View style={styles.formRow}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      flex: 2,
                      marginRight: 8,
                      backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                      borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                    },
                  ]}
                  placeholder="Guardian / Contact Name"
                  placeholderTextColor={isDark ? 'rgba(255,255,255,0.35)' : '#94A3B8'}
                  value={addEmergencyName}
                  onChangeText={setAddEmergencyName}
                />
                <TextInput
                  style={[
                    styles.input,
                    {
                      flex: 1,
                      marginLeft: 8,
                      backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                      borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                    },
                  ]}
                  placeholder="Relation"
                  placeholderTextColor={isDark ? 'rgba(255,255,255,0.35)' : '#94A3B8'}
                  value={addEmergencyRelation}
                  onChangeText={setAddEmergencyRelation}
                />
              </View>

              <Text
                style={[
                  styles.fieldLabel,
                  { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155', marginTop: 10 },
                ]}
              >
                Emergency Phone Number
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                    borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                  },
                ]}
                placeholder="+91 98400 00000"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.35)' : '#94A3B8'}
                value={addEmergencyPhone}
                onChangeText={setAddEmergencyPhone}
                keyboardType="phone-pad"
              />

              {/* 8. Fitness Goals & Medical Notes */}
              <Text
                style={[
                  styles.fieldLabel,
                  { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155', marginTop: 14 },
                ]}
              >
                Fitness Goal
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {FITNESS_GOALS.map((goal) => {
                  const isSelected = addFitnessGoal === goal;
                  return (
                    <TouchableOpacity
                      key={goal}
                      style={[
                        styles.chipBtn,
                        {
                          marginRight: 6,
                          backgroundColor: isSelected
                            ? AppColors.primaryColor
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
                      onPress={() => setAddFitnessGoal(goal)}
                    >
                      <Text
                        style={[
                          styles.chipBtnText,
                          {
                            color: isSelected
                              ? '#FFFFFF'
                              : isDark
                              ? '#94A3B8'
                              : '#64748B',
                          },
                        ]}
                      >
                        {goal}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text
                style={[
                  styles.fieldLabel,
                  { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155', marginTop: 12 },
                ]}
              >
                Health Restrictions & Medical Notes
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                    borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                  },
                ]}
                placeholder="e.g. Knee injury history, Asthma, High BP (or None)"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.35)' : '#94A3B8'}
                value={addMedicalNotes}
                onChangeText={setAddMedicalNotes}
                multiline
                numberOfLines={2}
              />

              {/* 9. Government ID Proof Attachment */}
              <Text
                style={[
                  styles.fieldLabel,
                  { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155', marginTop: 14 },
                ]}
              >
                Government ID Proof (Optional KYC)
              </Text>
              <View style={styles.formRow}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      flex: 1,
                      marginRight: 8,
                      backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                      borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                    },
                  ]}
                  placeholder="ID Document Number"
                  placeholderTextColor={isDark ? 'rgba(255,255,255,0.35)' : '#94A3B8'}
                  value={addGovDocNum}
                  onChangeText={setAddGovDocNum}
                />
                <TouchableOpacity
                  style={[
                    styles.fileUploadChip,
                    {
                      backgroundColor: addGovDocFile
                        ? 'rgba(0, 191, 98, 0.15)'
                        : isDark
                        ? AppColors.darkSurface
                        : '#F8FAFC',
                      borderColor: addGovDocFile
                        ? AppColors.secondaryColor
                        : isDark
                        ? AppColors.darkBorder
                        : '#E2E8F0',
                    },
                  ]}
                  onPress={handlePickGovDocFile}
                >
                  <MaterialIcons
                    name={addGovDocFile ? 'check-circle' : 'attach-file'}
                    size={18}
                    color={addGovDocFile ? AppColors.secondaryColor : AppColors.primaryColor}
                  />
                  <Text
                    style={[
                      styles.fileUploadChipText,
                      {
                        color: addGovDocFile
                          ? AppColors.secondaryColor
                          : isDark
                          ? '#FFFFFF'
                          : '#0F172A',
                      },
                    ]}
                  >
                    {addGovDocFile ? 'Uploaded' : 'Attach Proof'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: AppColors.primaryColor, marginTop: 24, marginBottom: 20 }]}
                onPress={handleAddMemberSubmit}
                activeOpacity={0.85}
              >
                <MaterialIcons name="person-add" size={20} color="#FFFFFF" />
                <Text style={styles.submitBtnText}>Complete Member Registration</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* 10. SUCCESS CONFIRMATION MODAL                                          */}
      {/* ========================================================================= */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.successCard,
              { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF' },
            ]}
          >
            <View style={styles.successIconCircle}>
              <MaterialIcons name="check" size={32} color="#FFFFFF" />
            </View>

            <Text style={[styles.successTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Member Registered!
            </Text>
            <Text style={[styles.successSub, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
              {lastAddedMember?.name} has been enrolled into {lastAddedMember?.plan} with Member ID{' '}
              <Text style={{ fontWeight: '700', color: AppColors.primaryColor }}>
                {lastAddedMember?.id}
              </Text>
              .
            </Text>

            <TouchableOpacity
              style={[styles.successBtn, { backgroundColor: AppColors.primaryColor }]}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.successBtnText}>View In Roster</Text>
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
  scrollContent: {
    paddingHorizontal: 16,
  },
  modeSegmentContainer: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  modeSegmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
  },
  modeSegmentText: {
    fontSize: 12.5,
    fontWeight: '700',
    marginLeft: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 12.5,
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primaryColor,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
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
    paddingBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 12,
  },
  memberCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppColors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 14.5,
    fontWeight: '700',
    marginRight: 6,
    flexShrink: 1,
  },
  memberIdText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.primaryColor,
    backgroundColor: 'rgba(0, 56, 130, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  memberPlan: {
    fontSize: 12,
    marginTop: 3,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardDivider: {
    height: 1,
    marginVertical: 10,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  bookingCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  bookingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  bookingCustomerName: {
    fontSize: 14.5,
    fontWeight: '700',
    marginRight: 6,
  },
  bookingTypeTag: {
    fontSize: 10.5,
    fontWeight: '700',
    color: AppColors.secondaryColor,
    backgroundColor: 'rgba(0, 191, 98, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bookingMetaSub: {
    fontSize: 11.5,
    marginTop: 3,
  },
  bookingBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verifyCheckinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primaryColor,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  verifyCheckinBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 4,
  },
  verifiedPassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedPassText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: AppColors.secondaryColor,
    marginLeft: 4,
  },
  smallActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  smallActionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11.5,
  },
  emptyState: {
    borderRadius: 14,
    padding: 32,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12.5,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalSubTitle: {
    fontSize: 12,
    marginTop: 2,
  },
  sheetTopProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sheetAvatarImg: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  sheetAvatarBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AppColors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetAvatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  sheetMemberName: {
    fontSize: 17,
    fontWeight: '800',
  },
  sheetPlanText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  sheetIdText: {
    fontSize: 11.5,
    marginTop: 2,
  },
  sheetQuickContactRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  sheetContactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  sheetContactBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 6,
  },
  sheetSegmentContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    padding: 3,
    marginBottom: 14,
  },
  sheetSegmentTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 8,
  },
  sheetSegmentTabText: {
    fontSize: 11,
  },
  sheetSectionBox: {
    paddingVertical: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
  },
  detailLabel: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '600',
  },
  trainerCardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  trainerCardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  trainerCardSub: {
    fontSize: 11.5,
    marginTop: 1,
  },
  sheetStatsGrid: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  sheetStatBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  sheetStatNum: {
    fontSize: 20,
    fontWeight: '800',
  },
  sheetStatLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  subHeaderLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  checkinLogItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 6,
  },
  checkinLogArea: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  checkinLogTime: {
    fontSize: 11,
    marginTop: 1,
  },
  sheetBottomActionRow: {
    marginTop: 18,
    marginBottom: 12,
  },
  sheetMainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  sheetMainBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 6,
  },
  sheetSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
  },
  sheetSecondaryBtnText: {
    fontWeight: '700',
    fontSize: 13.5,
    marginLeft: 6,
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
  photoUploadBtn: {
    marginTop: 6,
  },
  photoUploadBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.primaryColor,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13.5,
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13.5,
    marginBottom: 10,
    minHeight: 56,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  chipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 6,
    marginBottom: 6,
  },
  chipBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  planSelectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  planSelectCard: {
    width: '48%',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  planSelectName: {
    fontSize: 12,
    fontWeight: '700',
  },
  planSelectPrice: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
  },
  fileUploadChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginLeft: 8,
    marginBottom: 10,
  },
  fileUploadChipText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    marginLeft: 6,
  },
  successCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: AppColors.secondaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
  },
  successSub: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 19,
  },
  successBtn: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  successBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
