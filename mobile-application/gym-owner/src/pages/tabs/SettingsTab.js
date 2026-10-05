import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  ActivityIndicator,
  RefreshControl,
  Linking,
  Dimensions,
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

const ALL_FACILITIES = [
  'Air Conditioned',
  'Locker Facility',
  'Shower Available',
  'Changing Rooms',
  'Free Wi-Fi',
  'Sound & Music System',
  'Steam & Sauna',
  'Ice Bath Recovery',
  'Dedicated Parking',
  'Turnstile Gate Access',
  'First Aid Kit',
  '24/7 CCTV Security',
  'Biometric Entry',
  'Personal Trainers Available',
  'Cardio Theater',
  'Olympic Barbells Area',
];

const ALL_WORKOUTS = [
  'Strength & Weights',
  'Cardio & Endurance',
  'CrossFit Studio',
  'HIIT Functional Training',
  'Powerlifting',
  'Bodybuilding',
  'Yoga & Flexibility',
  'Zumba / Dance Fitness',
  'Boxing / MMA / Kickboxing',
  'Calisthenics Floor',
  'Pilates & Core',
  'Aerobics',
];

const ALL_AMENITIES = [
  'RO Drinking Water',
  'Towel Service',
  'Protein Shake Bar',
  'Juice & Smoothie Bar',
  'Personal Locker Rental',
  'InBody BMI Scanner',
  'Nutritionist Desk',
  'Lounge / Rest Area',
  'Free Sanitizer Stations',
  'Locker Key Padlocks',
];


const EMPLOYMENT_DOC_TYPES = [
  'Offer Letter',
  'Experience Certificate',
  'Relieving Letter',
  'Salary Slip / Payslip',
  'Appointment Letter',
  'Other Employment Doc',
];

const PERSONAL_DOC_TYPES = [
  'Aadhar Card',
  'PAN Card',
  'Driving License',
  'Passport',
  'Voter ID',
];

const TRAINER_CERT_TYPES = [
  'CPT (Certified Personal Trainer)',
  'CSCS (Strength & Conditioning)',
  'CrossFit Level 1 / Level 2',
  'Yoga Alliance Certification',
  'Nutrition & Dietetics Certificate',
  'First Aid & CPR Certification',
  'Bodybuilding Coach Certificate',
  'HIIT / Functional Training Specialist',
  'Other Certification',
];

const ROLE_OPTIONS_DETAILED = [
  { value: 'Trainer', label: 'Trainer', desc: 'Fitness & Personal Training Coach' },
  { value: 'Front Desk Manager', label: 'Front Desk Manager', desc: 'Reception & Member Onboarding' },
  { value: 'Customer Support', label: 'Customer Support', desc: 'Member Service & Enquiries' },
  { value: 'Housekeeping', label: 'Housekeeping', desc: 'Gym Floor Hygiene & Facility Care' },
  { value: 'Nutritionist', label: 'Nutritionist', desc: 'Diet & Meal Planning Specialist' },
  { value: 'Floor Manager', label: 'Floor Manager', desc: 'Gym Floor Operations & Safety' },
  { value: 'Cleaner', label: 'Cleaner', desc: 'Equipment & Washroom Sanitization' },
  { value: 'Maintenance', label: 'Maintenance', desc: 'Gym Machines & Electrical Service' },
  { value: 'Security', label: 'Security', desc: 'Turnstile & Entrance Security' },
  { value: 'Admin', label: 'Admin / Manager', desc: 'Branch General Operations' },
];

const ACCESS_LEVEL_OPTIONS_DETAILED = [
  { value: 'Admin', label: 'Admin Access', desc: 'Full permissions: Profile, Staff, Plans & Reports' },
  { value: 'Employee', label: 'Staff / Employee', desc: 'Operational: Member check-in, Attendance & Passes' },
  { value: 'Trainer', label: 'Trainer Access', desc: 'Personal: View assigned members & workout logs' },
  { value: 'None', label: 'View Only (No Edit)', desc: 'Restricted view-only mode without edit rights' },
];

const EXP_OPTIONS_DETAILED = [
  { value: 'Fresher (< 1 Year)', label: 'Fresher (< 1 Year)', desc: 'New to fitness coaching / Beginner' },
  { value: '1-2 Years', label: '1 - 2 Years', desc: 'Junior Trainer / Staff' },
  { value: '2-3 Years', label: '2 - 3 Years', desc: 'Mid-Level Professional' },
  { value: '3-5 Years', label: '3 - 5 Years', desc: 'Experienced Fitness Coach' },
  { value: '5-8 Years', label: '5 - 8 Years', desc: 'Senior Specialist Coach' },
  { value: '8+ Years', label: '8+ Years (Master)', desc: 'Master Head Coach & Lead Instructor' },
];

const SHIFT_OPTIONS_DETAILED = [
  { value: '06:00 AM - 02:00 PM', label: 'Morning Shift', desc: '06:00 AM - 02:00 PM (8 Hours)' },
  { value: '02:00 PM - 10:00 PM', label: 'Evening Shift', desc: '02:00 PM - 10:00 PM (8 Hours)' },
  { value: '10:00 AM - 06:00 PM', label: 'General Day Shift', desc: '10:00 AM - 06:00 PM (8 Hours)' },
  { value: '06:00 AM - 10:00 PM', label: 'Split Shift / Full Day', desc: 'Morning 6-11 AM & Evening 5-10 PM' },
  { value: '05:30 AM - 01:30 PM', label: 'Early Bird Shift', desc: '05:30 AM - 01:30 PM (8 Hours)' },
];

const EMP_TYPE_OPTIONS_DETAILED = [
  { value: 'Full-Time', label: 'Full-Time Permanent', desc: 'Regular full day employment' },
  { value: 'Part-Time', label: 'Part-Time Coach', desc: 'Hourly / Batch specific coaching' },
  { value: 'Temporary', label: 'Contract / Temporary', desc: 'Fixed-term or freelance contractor' },
];

const REL_OPTIONS_DETAILED = [
  { value: 'Spouse', label: 'Spouse', desc: 'Husband / Wife' },
  { value: 'Parent', label: 'Parent', desc: 'Father / Mother' },
  { value: 'Sibling', label: 'Sibling', desc: 'Brother / Sister' },
  { value: 'Friend', label: 'Friend / Partner', desc: 'Close Associate' },
  { value: 'Relative', label: 'Relative / Guardian', desc: 'Family Member / Legal Guardian' },
];

const ROLE_OPTIONS = ROLE_OPTIONS_DETAILED.map((r) => r.value);
const ACCESS_LEVEL_OPTIONS = ACCESS_LEVEL_OPTIONS_DETAILED.map((a) => a.value);
const EMP_TYPE_OPTIONS = EMP_TYPE_OPTIONS_DETAILED.map((e) => e.value);
const EXP_OPTIONS = EXP_OPTIONS_DETAILED.map((e) => e.value);
const BUSINESS_TYPE_OPTIONS = ['Sole Proprietorship', 'Partnership', 'Private Limited', 'LLP'];

const getNormalizedPricingPlans = (data) => {
  if (!data) return [];
  if (Array.isArray(data.customPricingPlans) && data.customPricingPlans.length > 0) {
    return data.customPricingPlans;
  }
  if (Array.isArray(data.pricingPlans) && data.pricingPlans.length > 0) {
    return data.pricingPlans;
  }
  if (data.pricingPlans && typeof data.pricingPlans === 'object') {
    const p = data.pricingPlans;
    const plansList = [];
    if (p.singleSession !== undefined) {
      plansList.push({
        id: 'plan-single',
        name: 'Walk-In Day Pass',
        badge: 'Walk-In',
        price: Number(p.singleSession) || 199,
        duration: '1 Day',
      });
    }
    if (p.weeklyPass !== undefined) {
      plansList.push({
        id: 'plan-weekly',
        name: 'Weekly Workout Pass',
        badge: 'Weekly',
        price: Number(p.weeklyPass) || 799,
        duration: '7 Days',
      });
    }
    if (p.monthly !== undefined) {
      plansList.push({
        id: 'plan-monthly',
        name: '1-Month Membership',
        badge: 'Monthly',
        price: Number(p.monthly) || 1999,
        duration: '30 Days',
      });
    }
    if (p.quarterly !== undefined) {
      plansList.push({
        id: 'plan-quarterly',
        name: '3-Month Membership',
        badge: 'Quarterly',
        price: Number(p.quarterly) || 4999,
        duration: '90 Days',
      });
    }
    if (p.halfYearly !== undefined) {
      plansList.push({
        id: 'plan-halfYearly',
        name: '6-Month Membership',
        badge: 'Half-Yearly',
        price: Number(p.halfYearly) || 8999,
        duration: '180 Days',
      });
    }
    if (p.annual !== undefined) {
      plansList.push({
        id: 'plan-annual',
        name: '1-Year Annual Pass',
        badge: 'Annual',
        price: Number(p.annual) || 14999,
        duration: '365 Days',
      });
    }
    return plansList;
  }
  return [];
};

export const SettingsTab = ({ topInset, navigation }) => {
  const { isDark, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const { user, gym, logout, updateGym, refreshGymProfile } = useAuth();

  const targetGymId = gym?._id || gym?.id || user?.gymId;

  // Active subview navigation:
  // 'MAIN' | 'GYM_PROFILE' | 'BASIC_PROFILE' | 'BANK_DETAILS' | 'TRAINER_PROFILE' | 'ADD_TRAINER' | 'EMPLOYEES' | 'ADD_EMPLOYEE'
  const [activeSection, setActiveSection] = useState('MAIN');

  // Backend Gym Data State
  const [gymData, setGymData] = useState(gym || null);
  const normalizedPricingPlans = useMemo(() => getNormalizedPricingPlans(gymData), [gymData]);
  const [isLoadingGym, setIsLoadingGym] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [auditHistory, setAuditHistory] = useState([]);

  // Backend Employees & Trainers State
  const [employeesList, setEmployeesList] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [trainerTabType, setTrainerTabType] = useState('All');
  const [staffTabRole, setStaffTabRole] = useState('All');

  // Operational Toggles
  const [audioBeep, setAudioBeep] = useState(true);
  const [smsReminders, setSmsReminders] = useState(true);

  // Modals
  const [showPendingRequestsModal, setShowPendingRequestsModal] = useState(false);
  const [showAuditHistoryModal, setShowAuditHistoryModal] = useState(false);
  const [showEditTimingsModal, setShowEditTimingsModal] = useState(false);
  const [showEditBankModal, setShowEditBankModal] = useState(false);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [showFacilitiesModal, setShowFacilitiesModal] = useState(false);
  const [showWorkoutsModal, setShowWorkoutsModal] = useState(false);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [selectedEmpDetail, setSelectedEmpDetail] = useState(null);
  const [detailModalTab, setDetailModalTab] = useState('details'); // 'details' | 'documents'

  // Basic Profile Form Fields
  const [basicName, setBasicName] = useState('');
  const [basicTagline, setBasicTagline] = useState('');
  const [basicOwnerName, setBasicOwnerName] = useState('');
  const [basicPhone, setBasicPhone] = useState('');
  const [basicEmail, setBasicEmail] = useState('');
  const [basicBusinessType, setBasicBusinessType] = useState('Private Limited');
  const [basicYearEstablished, setBasicYearEstablished] = useState('');
  const [basicAddress, setBasicAddress] = useState('');
  const [basicArea, setBasicArea] = useState('');
  const [basicCity, setBasicCity] = useState('');
  const [basicState, setBasicState] = useState('Tamil Nadu');
  const [basicPincode, setBasicPincode] = useState('');
  const [basicGst, setBasicGst] = useState('');
  const [basicPan, setBasicPan] = useState('');
  const [basicFloorSpace, setBasicFloorSpace] = useState('');
  const [basicCapacity, setBasicCapacity] = useState('');
  const [basicMapsUrl, setBasicMapsUrl] = useState('');
  const [basicAbout, setBasicAbout] = useState('');
  const [isSavingBasic, setIsSavingBasic] = useState(false);

  // Timings Form Fields
  const [weekdayOpen, setWeekdayOpen] = useState('05:30 AM');
  const [weekdayClose, setWeekdayClose] = useState('10:30 PM');
  const [weekendOpen, setWeekendOpen] = useState('06:00 AM');
  const [weekendClose, setWeekendClose] = useState('09:00 PM');
  const [is24Hours, setIs24Hours] = useState(false);

  // Bank Form Fields
  const [accountHolder, setAccountHolder] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');

  // Add Pricing Plan Fields
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [planDuration, setPlanDuration] = useState('30 Days');
  const [planBadge, setPlanBadge] = useState('Monthly');
  const [planFeatures, setPlanFeatures] = useState('');

  // Selected Facilities, Workouts, Amenities, Rules & Safety
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [gymRules, setGymRules] = useState([
    'Carry clean indoor training shoes',
    'Mandatory personal gym towel on workout benches',
    'Re-rack dumbbells and plates after set completion',
    'No outside food or beverages allowed on gym floor',
  ]);
  const [safetyMeasures, setSafetyMeasures] = useState([
    'Daily multi-session equipment sanitization',
    'Certified First Aid & CPR staff available on floor',
    '24/7 CCTV surveillance coverage',
    'Emergency exits clearly marked and accessible',
  ]);
  const [newRuleText, setNewRuleText] = useState('');
  const [newSafetyText, setNewSafetyText] = useState('');

  // =========================================================================
  // MULTI-STEP ADD TRAINER / ADD EMPLOYEE STATE (MATCHING WEB LOGIC)
  // =========================================================================
  const [addEmpStep, setAddEmpStep] = useState(1); // 1: Basic & Past Exp, 2: Family & ID/Certs, 3: Schedule & Pay
  const [addEmpPhoto, setAddEmpPhoto] = useState(null);
  const [addEmpName, setAddEmpName] = useState('');
  const [addEmpCountryCode, setAddEmpCountryCode] = useState('+91');
  const [addEmpPhone, setAddEmpPhone] = useState('');
  const [addEmpEmail, setAddEmpEmail] = useState('');
  const [addEmpRole, setAddEmpRole] = useState('Trainer');
  const [addEmpAccessLevel, setAddEmpAccessLevel] = useState('Admin');
  const [addEmpType, setAddEmpType] = useState('Full-Time');
  const [addEmpPrevCompany, setAddEmpPrevCompany] = useState('');
  const [addEmpPrevDesignation, setAddEmpPrevDesignation] = useState('');
  const [addEmpPrevExp, setAddEmpPrevExp] = useState('1-2 Years');
  const [addEmpDocsList, setAddEmpDocsList] = useState([]); // Past employment documents

  // Step 2
  const [addEmpEmergencyName, setAddEmpEmergencyName] = useState('');
  const [addEmpEmergencyRel, setAddEmpEmergencyRel] = useState('Spouse');
  const [addEmpEmergencyPhone, setAddEmpEmergencyPhone] = useState('');
  const [addPersonalDocsList, setAddPersonalDocsList] = useState([]); // Government ID verification
  const [addTrainerCertsList, setAddTrainerCertsList] = useState([]); // Trainer certifications

  // Step 3
  const [addEmpShift, setAddEmpShift] = useState('06:00 AM - 02:00 PM');
  const [addEmpWorkDays, setAddEmpWorkDays] = useState('Mon - Sat');
  const [addEmpSalary, setAddEmpSalary] = useState('');
  const [addEmpSpecialty, setAddEmpSpecialty] = useState('');
  const [addEmpNotes, setAddEmpNotes] = useState('');
  const [isSubmittingEmp, setIsSubmittingEmp] = useState(false);

  // Attach Document Modal State
  const [showAttachDocModal, setShowAttachDocModal] = useState(false);
  const [attachCategory, setAttachCategory] = useState('employment'); // 'employment' | 'personal' | 'trainer'
  const [attachDocType, setAttachDocType] = useState('Offer Letter');
  const [attachDocNum, setAttachDocNum] = useState('');
  const [attachDocFile, setAttachDocFile] = useState(null); // { fileName, fileData, uri }

  // Generic Dropdown Option Picker Modal State
  const [showOptionPickerModal, setShowOptionPickerModal] = useState(false);
  const [pickerModalTitle, setPickerModalTitle] = useState('Select Option');
  const [pickerOptions, setPickerOptions] = useState([]);
  const [pickerSelectedValue, setPickerSelectedValue] = useState('');
  const [pickerOnSelect, setPickerOnSelect] = useState(null);

  const openOptionPicker = (title, options, selectedValue, onSelect) => {
    setPickerModalTitle(title);
    setPickerOptions(options);
    setPickerSelectedValue(selectedValue);
    setPickerOnSelect(() => onSelect);
    setShowOptionPickerModal(true);
  };

  // -------------------------------------------------------------------------
  // FETCH GYM & EMPLOYEES
  // -------------------------------------------------------------------------
  const fetchGymProfileData = useCallback(async () => {
    if (!targetGymId) return;
    setIsLoadingGym(true);
    try {
      const data = await apiService.getGym(targetGymId);
      if (data) {
        setGymData(data);
        if (Array.isArray(data.auditHistory)) {
          setAuditHistory(data.auditHistory);
          const pending = data.auditHistory.filter(
            (l) => l.approvalStatus === 'Pending Approval' || l.approvalStatus === 'Pending Admin Review'
          );
          setPendingRequests(pending);
        } else if (data.pendingChanges) {
          setPendingRequests([{ id: 'REQ-1', field: 'Profile Edits', approvalStatus: 'Pending Approval' }]);
        }

        // Pre-fill form values
        setBasicName(data.name || '');
        setBasicTagline(data.tagline || '');
        setBasicOwnerName(data.ownerName || '');
        setBasicPhone(data.phone || '');
        setBasicEmail(data.email || '');
        setBasicBusinessType(data.businessType || 'Private Limited');
        setBasicYearEstablished(String(data.yearEstablished || ''));
        setBasicAddress(data.address || data.fullAddress || '');
        setBasicArea(data.area || '');
        setBasicCity(data.city || '');
        setBasicState(data.state || 'Tamil Nadu');
        setBasicPincode(data.pincode || '');
        setBasicGst(data.gstNumber || '');
        setBasicPan(data.panNumber || '');
        setBasicFloorSpace(String(data.floorSpaceSqFt || ''));
        setBasicCapacity(String(data.maxFloorCapacity || ''));
        setBasicMapsUrl(data.googleMapsUrl || '');
        setBasicAbout(data.aboutText || '');

        setSelectedFacilities(Array.isArray(data.facilities) ? data.facilities : []);
        setSelectedWorkouts(Array.isArray(data.workouts) ? data.workouts : []);
        setSelectedAmenities(Array.isArray(data.amenities) ? data.amenities : []);
        if (Array.isArray(data.rules) && data.rules.length > 0) setGymRules(data.rules);
        if (Array.isArray(data.safetyMeasures) && data.safetyMeasures.length > 0) setSafetyMeasures(data.safetyMeasures);

        if (data.openingHours) {
          setWeekdayOpen(data.openingHours.weekdayOpen || '05:30 AM');
          setWeekdayClose(data.openingHours.weekdayClose || '10:30 PM');
          setWeekendOpen(data.openingHours.weekendOpen || '06:00 AM');
          setWeekendClose(data.openingHours.weekendClose || '09:00 PM');
          setIs24Hours(Boolean(data.openingHours.is24Hours));
        }

        if (data.bankDetails) {
          setAccountHolder(data.bankDetails.accountHolderName || data.bankDetails.accountHolder || '');
          setBankName(data.bankDetails.bankName || '');
          setAccountNumber(data.bankDetails.accountNumber || '');
          setIfscCode(data.bankDetails.ifscCode || '');
          setUpiId(data.bankDetails.upiId || '');
        }
      }
    } catch (err) {
      console.warn('Gym profile fetch error:', err.message);
    } finally {
      setIsLoadingGym(false);
    }
  }, [targetGymId]);

  const fetchEmployeesData = useCallback(async () => {
    if (!targetGymId) return;
    setIsLoadingEmployees(true);
    try {
      const data = await apiService.getEmployees({ gymId: targetGymId, limit: 'all' });
      const list = data?.employees || (Array.isArray(data) ? data : []);
      setEmployeesList(list);
    } catch (err) {
      console.warn('Employees fetch notice:', err.message);
    } finally {
      setIsLoadingEmployees(false);
    }
  }, [targetGymId]);

  useEffect(() => {
    fetchGymProfileData();
    fetchEmployeesData();
  }, [fetchGymProfileData, fetchEmployeesData]);

  // Derived Trainer & Staff lists
  const trainers = useMemo(() => {
    return employeesList.filter(
      (e) =>
        e.role?.toLowerCase().includes('trainer') ||
        e.accessType?.toLowerCase().includes('trainer') ||
        e.specialty
    );
  }, [employeesList]);

  const staffEmployees = useMemo(() => {
    return employeesList.filter(
      (e) =>
        !e.role?.toLowerCase().includes('trainer') &&
        !e.accessType?.toLowerCase().includes('trainer') &&
        !e.specialty
    );
  }, [employeesList]);

  const hasPendingGymChanges = Boolean(
    (gymData?.pendingChanges && Object.keys(gymData.pendingChanges).length > 0) ||
      pendingRequests.length > 0 ||
      gymData?.approvalStatus === 'Pending Approval'
  );

  // -------------------------------------------------------------------------
  // MEDIA UPLOADS: BRAND LOGO, COVER PHOTO & GALLERY
  // -------------------------------------------------------------------------
  const handleSaveGymUpdate = async (payload, successMsg = 'Changes submitted for Super Admin review.') => {
    if (!targetGymId) {
      showToast({ message: 'Gym ID not found. Please log in again.', isError: true });
      return;
    }
    try {
      const res = await apiService.updateGym(targetGymId, payload);
      showToast({ message: res.message || successMsg, isSuccess: true });
      await fetchGymProfileData();
      if (refreshGymProfile) refreshGymProfile();
    } catch (err) {
      showToast({ message: err.message || 'Failed to update gym profile.', isError: true });
    }
  };

  const handlePickGymLogo = async () => {
    Alert.alert(
      'Update Gym Logo',
      'Choose image source for brand logo:',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const picked = await capturePhotoFromCamera({ maxWidth: 1000, maxHeight: 1000 });
            if (picked?.fileData) {
              uploadLogoData(picked);
            }
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            const picked = await pickImageFromDevice({ maxWidth: 1000, maxHeight: 1000 });
            if (picked?.fileData) {
              uploadLogoData(picked);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const uploadLogoData = async (picked) => {
    setIsUploadingMedia(true);
    try {
      const logoPayload = {
        fileName: picked.fileName || 'gym_logo.jpg',
        fileData: picked.fileData,
      };
      await handleSaveGymUpdate({ logo: logoPayload }, 'Brand logo updated successfully!');
      updateGym({ logo: logoPayload });
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handlePickGymCover = async () => {
    const picked = await pickImageFromDevice({ maxWidth: 1600, maxHeight: 900 });
    if (picked?.fileData) {
      setIsUploadingMedia(true);
      try {
        const coverPayload = {
          fileName: picked.fileName || 'gym_cover.jpg',
          fileData: picked.fileData,
        };
        await handleSaveGymUpdate({ coverPhoto: coverPayload }, 'Cover photo updated successfully!');
        updateGym({ coverPhoto: coverPayload });
      } finally {
        setIsUploadingMedia(false);
      }
    }
  };

  const handleAddGalleryPhoto = async () => {
    const picked = await pickImageFromDevice({ maxWidth: 1200, maxHeight: 800 });
    if (picked?.fileData) {
      setIsUploadingMedia(true);
      try {
        const currentGallery = Array.isArray(gymData?.galleryPhotos) ? gymData.galleryPhotos : [];
        const newPhotoObj = {
          fileName: picked.fileName || 'gallery_photo.jpg',
          fileData: picked.fileData,
        };
        const updated = [...currentGallery, newPhotoObj];
        await handleSaveGymUpdate({ galleryPhotos: updated }, 'Photo added to gym gallery!');
        updateGym({ galleryPhotos: updated });
      } finally {
        setIsUploadingMedia(false);
      }
    }
  };

  const handleDeleteGalleryPhoto = async (indexToDelete) => {
    Alert.alert('Remove Photo', 'Are you sure you want to remove this photo from your gallery?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          const currentGallery = Array.isArray(gymData?.galleryPhotos) ? gymData.galleryPhotos : [];
          const updated = currentGallery.filter((_, idx) => idx !== indexToDelete);
          await handleSaveGymUpdate({ galleryPhotos: updated }, 'Photo removed from gallery.');
          updateGym({ galleryPhotos: updated });
        },
      },
    ]);
  };

  // -------------------------------------------------------------------------
  // BASIC PROFILE & LEGAL HANDLERS
  // -------------------------------------------------------------------------
  const handleSaveBasicProfile = async () => {
    if (!basicName.trim()) {
      showToast({ message: 'Gym name is required', isError: true });
      return;
    }
    setIsSavingBasic(true);
    try {
      const payload = {
        name: basicName.trim(),
        tagline: basicTagline.trim(),
        ownerName: basicOwnerName.trim(),
        phone: basicPhone.trim(),
        email: basicEmail.trim(),
        businessType: basicBusinessType,
        yearEstablished: Number(basicYearEstablished) || undefined,
        address: basicAddress.trim(),
        area: basicArea.trim(),
        city: basicCity.trim(),
        state: basicState.trim(),
        pincode: basicPincode.trim(),
        gstNumber: basicGst.trim(),
        panNumber: basicPan.trim(),
        floorSpaceSqFt: Number(basicFloorSpace) || 0,
        maxFloorCapacity: Number(basicCapacity) || 0,
        googleMapsUrl: basicMapsUrl.trim(),
        aboutText: basicAbout.trim(),
      };
      await handleSaveGymUpdate(payload, 'Gym profile details submitted for Super Admin review.');
      setActiveSection('MAIN');
    } finally {
      setIsSavingBasic(false);
    }
  };

  const handleSaveOperatingHours = async () => {
    const payload = {
      openingHours: {
        weekdayOpen,
        weekdayClose,
        weekendOpen,
        weekendClose,
        displayText: `${weekdayOpen} - ${weekdayClose}`,
        is24Hours,
      },
    };
    await handleSaveGymUpdate(payload, 'Operating hours submitted for Super Admin review.');
    setShowEditTimingsModal(false);
  };

  const handleSaveBankDetails = async () => {
    if (!accountNumber.trim() || !ifscCode.trim()) {
      showToast({ message: 'Account number and IFSC code are required', isError: true });
      return;
    }
    const payload = {
      bankDetails: {
        accountHolderName: accountHolder.trim(),
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim(),
        upiId: upiId.trim(),
      },
    };
    await handleSaveGymUpdate(payload, 'Bank details submitted for Super Admin review.');
    setShowEditBankModal(false);
  };

  const handleSaveFacilities = async () => {
    await handleSaveGymUpdate({ facilities: selectedFacilities }, 'Gym facilities updated successfully.');
    setShowFacilitiesModal(false);
  };

  const handleSaveWorkouts = async () => {
    await handleSaveGymUpdate({ workouts: selectedWorkouts }, 'Workout disciplines updated successfully.');
    setShowWorkoutsModal(false);
  };

  const handleSaveAmenities = async () => {
    await handleSaveGymUpdate({ amenities: selectedAmenities }, 'Gym amenities updated successfully.');
    setShowAmenitiesModal(false);
  };

  const handleSaveRules = async () => {
    await handleSaveGymUpdate({ rules: gymRules }, 'Gym rules updated successfully.');
    setShowRulesModal(false);
  };

  const handleSaveSafety = async () => {
    await handleSaveGymUpdate({ safetyMeasures }, 'Safety measures updated successfully.');
    setShowSafetyModal(false);
  };

  const handleAddPricingPlan = async () => {
    if (!planName.trim() || !planPrice.trim()) {
      showToast({ message: 'Plan name and price are required', isError: true });
      return;
    }
    const newPlanObj = {
      id: `plan-${Date.now()}`,
      name: planName.trim(),
      price: Number(planPrice) || 0,
      duration: planDuration,
      badge: planBadge,
      description: planFeatures,
      features: planFeatures ? planFeatures.split('\n').filter(Boolean) : [],
    };
    const currentPlans = normalizedPricingPlans;
    const updatedPlans = [...currentPlans, newPlanObj];
    await handleSaveGymUpdate({ customPricingPlans: updatedPlans }, `Plan "${planName}" submitted for approval.`);
    setShowAddPlanModal(false);
    setPlanName('');
    setPlanPrice('');
    setPlanFeatures('');
  };

  // -------------------------------------------------------------------------
  // ADD TRAINER / EMPLOYEE (MULTI-STEP WIZARD)
  // -------------------------------------------------------------------------
  const openAddTrainerFlow = () => {
    setAddEmpStep(1);
    setAddEmpPhoto(null);
    setAddEmpName('');
    setAddEmpPhone('');
    setAddEmpEmail('');
    setAddEmpRole('Trainer');
    setAddEmpAccessLevel('Admin');
    setAddEmpType('Full-Time');
    setAddEmpPrevCompany('');
    setAddEmpPrevDesignation('');
    setAddEmpPrevExp('1-2 Years');
    setAddEmpDocsList([]);
    setAddEmpEmergencyName('');
    setAddEmpEmergencyRel('Spouse');
    setAddEmpEmergencyPhone('');
    setAddPersonalDocsList([]);
    setAddTrainerCertsList([]);
    setAddEmpShift('06:00 AM - 02:00 PM');
    setAddEmpSalary('');
    setAddEmpSpecialty('');
    setAddEmpNotes('');
    setActiveSection('ADD_TRAINER');
  };

  const openAddStaffFlow = () => {
    setAddEmpStep(1);
    setAddEmpPhoto(null);
    setAddEmpName('');
    setAddEmpPhone('');
    setAddEmpEmail('');
    setAddEmpRole('Front Desk Manager');
    setAddEmpAccessLevel('Employee');
    setAddEmpType('Full-Time');
    setAddEmpPrevCompany('');
    setAddEmpPrevDesignation('');
    setAddEmpPrevExp('1-2 Years');
    setAddEmpDocsList([]);
    setAddEmpEmergencyName('');
    setAddEmpEmergencyRel('Spouse');
    setAddEmpEmergencyPhone('');
    setAddPersonalDocsList([]);
    setAddTrainerCertsList([]);
    setAddEmpShift('09:00 AM - 06:00 PM');
    setAddEmpSalary('');
    setAddEmpSpecialty('');
    setAddEmpNotes('');
    setActiveSection('ADD_EMPLOYEE');
  };

  const handlePickEmpPhoto = async () => {
    Alert.alert('Employee Photo', 'Select photo source:', [
      {
        text: 'Take Photo',
        onPress: async () => {
          const res = await capturePhotoFromCamera({ maxWidth: 800, maxHeight: 800 });
          if (res?.fileData) setAddEmpPhoto(res.fileData);
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: async () => {
          const res = await pickImageFromDevice({ maxWidth: 800, maxHeight: 800 });
          if (res?.fileData) setAddEmpPhoto(res.fileData);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // Open Document Attachment Modal
  const openAttachDocModal = (category = 'employment') => {
    setAttachCategory(category);
    if (category === 'employment') {
      setAttachDocType(EMPLOYMENT_DOC_TYPES[0]);
    } else if (category === 'personal') {
      setAttachDocType(PERSONAL_DOC_TYPES[0]);
    } else if (category === 'trainer') {
      setAttachDocType(TRAINER_CERT_TYPES[0]);
    }
    setAttachDocNum('');
    setAttachDocFile(null);
    setShowAttachDocModal(true);
  };

  const handleSelectDocFile = async () => {
    const picked = await pickImageFromDevice({ maxWidth: 1600, maxHeight: 1600 });
    if (picked) {
      setAttachDocFile(picked);
    }
  };

  const handleSaveAttachedDoc = () => {
    if (!attachDocType) {
      showToast({ message: 'Please select document type', isError: true });
      return;
    }
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const docItem = {
      key: `doc-${Date.now()}`,
      docType: attachDocType,
      certType: attachDocType,
      docNum: attachDocNum.trim() || '—',
      certNum: attachDocNum.trim() || '—',
      fileName: attachDocFile?.fileName || `${attachDocType.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`,
      fileData: attachDocFile?.fileData || '',
      addedOn: today,
    };

    if (attachCategory === 'employment') {
      setAddEmpDocsList((prev) => [...prev, docItem]);
    } else if (attachCategory === 'personal') {
      setAddPersonalDocsList((prev) => [...prev, docItem]);
    } else if (attachCategory === 'trainer') {
      setAddTrainerCertsList((prev) => [...prev, docItem]);
    }

    setShowAttachDocModal(false);
    showToast({ message: `${attachDocType} attached successfully!`, isSuccess: true });
  };

  // Step 1 -> Step 2 validation
  const handleNextStep2 = () => {
    if (!addEmpName.trim()) {
      showToast({ message: 'Please enter employee name', isError: true });
      return;
    }
    if (!addEmpPhone.trim()) {
      showToast({ message: 'Please enter phone number', isError: true });
      return;
    }
    if (!addEmpEmail.trim()) {
      showToast({ message: 'Please enter email address', isError: true });
      return;
    }
    setAddEmpStep(2);
  };

  // Step 2 -> Step 3 validation
  const handleNextStep3 = () => {
    if (!addEmpEmergencyName.trim() || !addEmpEmergencyPhone.trim()) {
      showToast({ message: 'Emergency contact name & phone are required', isError: true });
      return;
    }
    setAddEmpStep(3);
  };

  // Complete submission
  const handleCompleteAddEmployee = async (isTrainer = false) => {
    setIsSubmittingEmp(true);
    try {
      const fullPhone = `${addEmpCountryCode} ${addEmpPhone.trim()}`.trim();
      const payload = {
        gymId: targetGymId,
        gymPartnerId: gymData?.partnerId || (typeof targetGymId === 'string' && !targetGymId.match(/^[0-9a-fA-F]{24}$/) ? targetGymId : 'GYM-001'),
        gymName: gymData?.name || 'Main Facility',
        name: addEmpName.trim(),
        role: isTrainer ? 'Trainer' : addEmpRole,
        phone: fullPhone,
        email: addEmpEmail.trim(),
        avatar: addEmpPhoto || '',
        accessType: addEmpAccessLevel,
        type: addEmpType,
        specialty: isTrainer ? addEmpSpecialty.trim() || 'Fitness Trainer' : addEmpRole,
        experienceYears: addEmpPrevExp.includes('5+') ? 5 : addEmpPrevExp.includes('3-5') ? 3 : 1,
        previousCompany: addEmpPrevCompany.trim(),
        previousDesignation: addEmpPrevDesignation.trim(),
        previousExp: addEmpPrevExp,
        emergencyContact: {
          name: addEmpEmergencyName.trim(),
          relationship: addEmpEmergencyRel.trim(),
          phone: addEmpEmergencyPhone.trim(),
        },
        schedule: {
          shiftHours: addEmpShift,
          workingTimeStart: addEmpShift.split('-')[0]?.trim() || '06:00 AM',
          workingTimeEnd: addEmpShift.split('-')[1]?.trim() || '02:00 PM',
          workingDays: addEmpWorkDays.includes('Everyday')
            ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        },
        compensation: {
          payAmount: Number(addEmpSalary) || 0,
          payType: 'Monthly',
          payFreq: 'Monthly',
        },
        documents: [...addEmpDocsList, ...addPersonalDocsList],
        trainerCerts: addTrainerCertsList,
        notes: addEmpNotes.trim(),
      };

      const res = await apiService.createEmployee(payload);
      showToast({
        message: res.message || `${payload.name} submitted successfully! Pending Super Admin approval.`,
        isSuccess: true,
      });

      await fetchEmployeesData();
      setActiveSection(isTrainer ? 'TRAINER_PROFILE' : 'EMPLOYEES');
    } catch (err) {
      showToast({ message: err.message || 'Failed to submit employee.', isError: true });
    } finally {
      setIsSubmittingEmp(false);
    }
  };

  const handleToggleEmpStatus = async (emp) => {
    const newStatus = emp.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await apiService.updateEmployee(emp._id || emp.id, { status: newStatus });
      showToast({ message: `Status updated to ${newStatus}. Pending approval.`, isSuccess: true });
      await fetchEmployeesData();
      if (selectedEmpDetail) {
        setSelectedEmpDetail({ ...selectedEmpDetail, status: newStatus });
      }
    } catch (err) {
      showToast({ message: err.message || 'Failed to update status', isError: true });
    }
  };

  const handleDeleteEmployee = async (emp) => {
    Alert.alert(
      'Deactivate Employee',
      `Are you sure you want to deactivate ${emp.name}? This will submit a request for Super Admin approval.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteEmployee(emp._id || emp.id);
              showToast({ message: 'Deactivation request submitted for Super Admin review.', isSuccess: true });
              await fetchEmployeesData();
              setSelectedEmpDetail(null);
            } catch (err) {
              showToast({ message: err.message || 'Failed to delete', isError: true });
            }
          },
        },
      ]
    );
  };

  // -------------------------------------------------------------------------
  // 1. MAIN HUB VIEW
  // -------------------------------------------------------------------------
  const renderMainHub = () => (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: topInset + 12, paddingBottom: 110 },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoadingGym}
          onRefresh={() => {
            fetchGymProfileData();
            fetchEmployeesData();
          }}
          tintColor={AppColors.primaryColor}
        />
      }
    >
      {/* Gym Profile Hero Card with Logo & Quick Change */}
      <View
        style={[
          styles.profileHeroCard,
          {
            backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
            borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
          },
        ]}
      >
        <View style={styles.profileTopRow}>
          <TouchableOpacity
            style={[
              styles.gymLogoWrapper,
              {
                backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
                borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
              },
            ]}
            onPress={handlePickGymLogo}
            activeOpacity={0.8}
          >
            {getGymLogoUri(gymData) ? (
              <Image
                source={{ uri: getGymLogoUri(gymData) }}
                style={styles.gymLogo}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.gymInitialBadge, { backgroundColor: AppColors.primaryColor }]}>
                <Text style={styles.gymInitialText}>
                  {(gymData?.name || user?.fullName || 'Gym')
                    .split(' ')
                    .filter(Boolean)
                    .map((w) => w[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase() || 'GY'}
                </Text>
              </View>
            )}
            <View style={styles.cameraIconBadge}>
              <MaterialIcons name="photo-camera" size={12} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.profileNameRow}>
            <Text
              style={[
                styles.profileGymName,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
              numberOfLines={1}
            >
              {gymData?.name || user?.fullName || 'Gym Facility'}
            </Text>

            <View style={styles.idStatusRow}>
              <View
                style={[
                  styles.partnerIdTag,
                  { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
                ]}
              >
                <Text
                  style={[
                    styles.partnerIdText,
                    { color: isDark ? '#93C5FD' : AppColors.primaryColor },
                  ]}
                >
                  ID: {gymData?.partnerId || gymData?.id || 'GYM'}
                </Text>
              </View>

              <View
                style={[
                  styles.statusTagPill,
                  {
                    backgroundColor:
                      gymData?.approvalStatus === 'Approved'
                        ? 'rgba(22, 163, 74, 0.12)'
                        : 'rgba(245, 158, 11, 0.15)',
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        gymData?.approvalStatus === 'Approved' ? '#16a34a' : '#d97706',
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.statusTagText,
                    {
                      color:
                        gymData?.approvalStatus === 'Approved' ? '#16a34a' : '#d97706',
                    },
                  ]}
                >
                  {gymData?.approvalStatus || 'Approved'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Text
          style={[
            styles.profileGymAddress,
            { color: isDark ? 'rgba(255,255,255,0.65)' : '#64748B' },
          ]}
          numberOfLines={1}
        >
          {gymData?.area
            ? `${gymData.area}, ${gymData.city}`
            : gymData?.address || 'Mangadu, Kundrathur'}
        </Text>
      </View>

      {/* SECTION 1: MANAGE YOUR GYM */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionHeading, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Manage Your Gym
        </Text>
        <Text style={[styles.sectionSubtitle, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
          Update profile, schedules, media, trainers and staff
        </Text>

        <View
          style={[
            styles.menuListCard,
            {
              backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
              borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
            },
          ]}
        >
          {/* Gym Profile */}
          <TouchableOpacity
            style={styles.menuItemRow}
            onPress={() => setActiveSection('GYM_PROFILE')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
              <MaterialIcons name="fitness-center" size={20} color="#6366F1" />
            </View>
            <View style={styles.menuTextBox}>
              <Text style={[styles.menuTitleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Gym Profile
              </Text>
              <Text style={[styles.menuSubText, { color: isDark ? 'rgba(255,255,255,0.55)' : '#64748B' }]}>
                Media, Timings, Pricing, Facilities & Equipment
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
          </TouchableOpacity>

          <View style={[styles.menuDivider, { backgroundColor: isDark ? AppColors.darkBorder : '#F1F5F9' }]} />

          {/* Basic Profile */}
          <TouchableOpacity
            style={styles.menuItemRow}
            onPress={() => setActiveSection('BASIC_PROFILE')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <MaterialIcons name="storefront" size={20} color="#3B82F6" />
            </View>
            <View style={styles.menuTextBox}>
              <Text style={[styles.menuTitleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Basic Profile & Legal
              </Text>
              <Text style={[styles.menuSubText, { color: isDark ? 'rgba(255,255,255,0.55)' : '#64748B' }]}>
                Address, Owner details, GST, PAN & About Bio
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
          </TouchableOpacity>

          <View style={[styles.menuDivider, { backgroundColor: isDark ? AppColors.darkBorder : '#F1F5F9' }]} />

          {/* Trainers */}
          <TouchableOpacity
            style={styles.menuItemRow}
            onPress={() => setActiveSection('TRAINER_PROFILE')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(236, 72, 153, 0.1)' }]}>
              <MaterialIcons name="sports" size={20} color="#EC4899" />
            </View>
            <View style={styles.menuTextBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[styles.menuTitleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  Trainer Profile & Certifications
                </Text>
                <View style={styles.badgePill}>
                  <Text style={styles.badgePillText}>{trainers.length}</Text>
                </View>
              </View>
              <Text style={[styles.menuSubText, { color: isDark ? 'rgba(255,255,255,0.55)' : '#64748B' }]}>
                Manage trainers, certificates, shifts & specialties
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
          </TouchableOpacity>

          <View style={[styles.menuDivider, { backgroundColor: isDark ? AppColors.darkBorder : '#F1F5F9' }]} />

          {/* Employees & Staff */}
          <TouchableOpacity
            style={styles.menuItemRow}
            onPress={() => setActiveSection('EMPLOYEES')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
              <MaterialIcons name="people" size={20} color="#A855F7" />
            </View>
            <View style={styles.menuTextBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[styles.menuTitleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  Employees & Staff
                </Text>
                <View style={styles.badgePill}>
                  <Text style={styles.badgePillText}>{staffEmployees.length}</Text>
                </View>
              </View>
              <Text style={[styles.menuSubText, { color: isDark ? 'rgba(255,255,255,0.55)' : '#64748B' }]}>
                Receptionists, floor managers & staff verification
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
          </TouchableOpacity>

          <View style={[styles.menuDivider, { backgroundColor: isDark ? AppColors.darkBorder : '#F1F5F9' }]} />

          {/* Bank & Settlements */}
          <TouchableOpacity
            style={styles.menuItemRow}
            onPress={() => setShowEditBankModal(true)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <MaterialIcons name="account-balance" size={20} color="#10B981" />
            </View>
            <View style={styles.menuTextBox}>
              <Text style={[styles.menuTitleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Bank & Instant Settlements
              </Text>
              <Text style={[styles.menuSubText, { color: isDark ? 'rgba(255,255,255,0.55)' : '#64748B' }]}>
                Payout bank account & direct UPI settlement ID
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
          </TouchableOpacity>

          <View style={[styles.menuDivider, { backgroundColor: isDark ? AppColors.darkBorder : '#F1F5F9' }]} />

          {/* Audit Log History */}
          <TouchableOpacity
            style={styles.menuItemRow}
            onPress={() => setShowAuditHistoryModal(true)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(14, 165, 233, 0.1)' }]}>
              <MaterialIcons name="history" size={20} color="#0EA5E9" />
            </View>
            <View style={styles.menuTextBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[styles.menuTitleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  Audit Log History
                </Text>
                <View style={styles.badgePill}>
                  <Text style={styles.badgePillText}>{auditHistory.length}</Text>
                </View>
              </View>
              <Text style={[styles.menuSubText, { color: isDark ? 'rgba(255,255,255,0.55)' : '#64748B' }]}>
                Inspect complete audit trail of submitted changes
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* SECTION 2: APPEARANCE & PREFERENCES */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionHeading, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Appearance
        </Text>
        <View
          style={[
            styles.menuListCard,
            {
              backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
              borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
            },
          ]}
        >
          <View style={styles.menuItemRow}>
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <MaterialIcons name={isDark ? 'dark-mode' : 'light-mode'} size={20} color="#F59E0B" />
            </View>
            <View style={styles.menuTextBox}>
              <Text style={[styles.menuTitleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Dark Mode
              </Text>
              <Text style={[styles.menuSubText, { color: isDark ? 'rgba(255,255,255,0.55)' : '#64748B' }]}>
                {isDark ? 'Dark theme active' : 'Light theme active'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#CBD5E1', true: AppColors.primaryColor }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>

      {/* LOGOUT */}
      <TouchableOpacity
        style={[
          styles.logoutBtn,
          {
            backgroundColor: isDark ? '#450a0a' : '#FEF2F2',
            borderColor: isDark ? '#991b1b' : '#FECACA',
          },
        ]}
        onPress={() => {
          Alert.alert('Sign Out', 'Are you sure you want to sign out from your gym portal?', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Sign Out',
              style: 'destructive',
              onPress: async () => {
                await logout();
                navigation.replace('Login');
              },
            },
          ]);
        }}
      >
        <MaterialIcons name="logout" size={20} color="#DC2626" />
        <Text style={styles.logoutBtnText}>Sign Out from Partner Portal</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // -------------------------------------------------------------------------
  // 2. GYM PROFILE SUB-VIEW (MEDIA, TIMINGS, PRICING, FACILITIES)
  // -------------------------------------------------------------------------
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
          style={[
            styles.backBtn,
            { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' },
          ]}
          onPress={() => setActiveSection('MAIN')}
        >
          <MaterialIcons name="arrow-back" size={22} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </TouchableOpacity>
        <Text style={[styles.subHeaderTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Gym Profile & Media
        </Text>
        <View style={{ width: 42 }} />
      </View>

      {/* 1. Brand Assets & Media Uploads Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' },
        ]}
      >
        <View style={styles.cardHeaderWithEdit}>
          <View style={styles.cardHeaderLeft}>
            <MaterialIcons name="photo-library" size={20} color={AppColors.primaryColor} />
            <Text style={[styles.cardHeaderTitleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Brand Media & Photos
            </Text>
          </View>
        </View>

        {/* Logo Section */}
        <View style={styles.mediaRow}>
          <View style={styles.mediaPreviewCol}>
            <Text style={[styles.mediaLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Brand Logo</Text>
            <View style={styles.logoThumbnailBox}>
              {getGymLogoUri(gymData) ? (
                <Image source={{ uri: getGymLogoUri(gymData) }} style={styles.logoThumbnail} resizeMode="cover" />
              ) : (
                <View style={[styles.logoThumbnailFallback, { backgroundColor: AppColors.primaryColor }]}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>GY</Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={[styles.mediaActionBtn, { borderColor: AppColors.primaryColor }]}
            onPress={handlePickGymLogo}
            disabled={isUploadingMedia}
          >
            <MaterialIcons name="upload" size={16} color={AppColors.primaryColor} />
            <Text style={[styles.mediaActionBtnText, { color: AppColors.primaryColor }]}>Change Logo</Text>
          </TouchableOpacity>
        </View>

        {/* Cover Photo Section */}
        <View style={[styles.mediaRow, { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: isDark ? AppColors.darkBorder : '#F1F5F9' }]}>
          <View style={styles.mediaPreviewCol}>
            <Text style={[styles.mediaLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Cover Photo</Text>
            <View style={styles.coverThumbnailBox}>
              {getSafeImageUri(gymData?.coverPhoto) ? (
                <Image source={{ uri: getSafeImageUri(gymData.coverPhoto) }} style={styles.coverThumbnail} resizeMode="cover" />
              ) : (
                <View style={[styles.coverThumbnailFallback, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]}>
                  <MaterialIcons name="image" size={20} color="#94A3B8" />
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={[styles.mediaActionBtn, { borderColor: AppColors.primaryColor }]}
            onPress={handlePickGymCover}
            disabled={isUploadingMedia}
          >
            <MaterialIcons name="upload" size={16} color={AppColors.primaryColor} />
            <Text style={[styles.mediaActionBtnText, { color: AppColors.primaryColor }]}>Change Cover</Text>
          </TouchableOpacity>
        </View>

        {/* Gallery Section */}
        <View style={[styles.mediaRowCol, { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: isDark ? AppColors.darkBorder : '#F1F5F9' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={[styles.mediaLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Gym Floor Gallery ({Array.isArray(gymData?.galleryPhotos) ? gymData.galleryPhotos.length : 0})
            </Text>
            <TouchableOpacity
              style={[styles.mediaActionBtnSmall, { backgroundColor: AppColors.primaryColor }]}
              onPress={handleAddGalleryPhoto}
              disabled={isUploadingMedia}
            >
              <MaterialIcons name="add-photo-alternate" size={15} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>+ Add Photo</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {(Array.isArray(gymData?.galleryPhotos) ? gymData.galleryPhotos : []).map((photo, index) => {
              const photoUri = getSafeImageUri(photo);
              if (!photoUri) return null;
              return (
                <View key={index} style={styles.galleryThumbWrapper}>
                  <Image source={{ uri: photoUri }} style={styles.galleryThumb} resizeMode="cover" />
                  <TouchableOpacity
                    style={styles.deletePhotoBtn}
                    onPress={() => handleDeleteGalleryPhoto(index)}
                  >
                    <MaterialIcons name="close" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              );
            })}
            {(!gymData?.galleryPhotos || gymData.galleryPhotos.length === 0) && (
              <Text style={{ fontSize: 12, color: '#94A3B8', paddingVertical: 10 }}>
                No gallery photos added yet. Tap "+ Add Photo" to showcase your gym floor.
              </Text>
            )}
          </ScrollView>
        </View>
      </View>

      {/* 2. Gym Timings Card */}
      <View style={[styles.card, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}>
        <View style={styles.cardHeaderWithEdit}>
          <View style={styles.cardHeaderLeft}>
            <MaterialIcons name="schedule" size={20} color={AppColors.accentColor} />
            <Text style={[styles.cardHeaderTitleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Gym Timings & Shifts
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editPillBtn}
            onPress={() => setShowEditTimingsModal(true)}
          >
            <Text style={styles.editPillText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 6 }}>
          <Text style={[styles.timingsDays, { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155' }]}>
            Weekday: {gymData?.openingHours?.weekdayOpen || weekdayOpen} - {gymData?.openingHours?.weekdayClose || weekdayClose}
          </Text>
          <Text style={[styles.timingsDays, { color: isDark ? 'rgba(255,255,255,0.7)' : '#334155', marginTop: 4 }]}>
            Weekend: {gymData?.openingHours?.weekendOpen || weekendOpen} - {gymData?.openingHours?.weekendClose || weekendClose}
          </Text>
        </View>
      </View>

      {/* 3. Pricing Plans Card */}
      <View style={[styles.card, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}>
        <View style={styles.cardHeaderWithEdit}>
          <View style={styles.cardHeaderLeft}>
            <MaterialIcons name="card-membership" size={20} color={AppColors.secondaryColor} />
            <View>
              <Text style={[styles.cardHeaderTitleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Membership Plans
              </Text>
              <Text style={[styles.cardSubText, { color: isDark ? 'rgba(255,255,255,0.55)' : '#64748B' }]}>
                {normalizedPricingPlans.length} active platform plan(s)
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editPillBtn}
            onPress={() => setShowAddPlanModal(true)}
          >
            <Text style={styles.editPillText}>+ Add Plan</Text>
          </TouchableOpacity>
        </View>

        {normalizedPricingPlans.map((plan, i) => (
          <View
            key={plan.id || i}
            style={[
              styles.priceRowItem,
              i === normalizedPricingPlans.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <View>
              <Text style={[styles.priceDurationLabel, { color: isDark ? '#FFFFFF' : '#0F172A', fontWeight: '700' }]}>
                {plan.name || plan.badge}
              </Text>
              <Text style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,0.5)' : '#64748B' }}>
                {plan.duration || '30 Days'}
              </Text>
            </View>
            <Text style={[styles.priceAmountVal, { color: '#16a34a' }]}>
              ₹ {Number(plan.price || 0).toLocaleString('en-IN')}
            </Text>
          </View>
        ))}
      </View>

      {/* 4. Facilities & Equipment */}
      <View style={[styles.card, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}>
        <View style={styles.cardHeaderWithEdit}>
          <View style={styles.cardHeaderLeft}>
            <MaterialIcons name="verified" size={20} color="#8B5CF6" />
            <Text style={[styles.cardHeaderTitleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Facilities & Amenities ({selectedFacilities.length})
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editPillBtn}
            onPress={() => setShowFacilitiesModal(true)}
          >
            <Text style={styles.editPillText}>Manage</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.chipRow}>
          {selectedFacilities.map((f, i) => (
            <View key={i} style={[styles.amenityChip, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
              <MaterialIcons name="check-circle" size={14} color="#10B981" />
              <Text style={[styles.amenityChipText, { color: isDark ? '#E2E8F0' : '#334155' }]}>{f}</Text>
            </View>
          ))}
          {selectedFacilities.length === 0 && (
            <Text style={{ fontSize: 12, color: '#94A3B8' }}>No facilities configured. Tap Manage to add.</Text>
          )}
        </View>
      </View>

      {/* 5. Workouts & Disciplines */}
      <View style={[styles.card, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}>
        <View style={styles.cardHeaderWithEdit}>
          <View style={styles.cardHeaderLeft}>
            <MaterialIcons name="fitness-center" size={20} color="#EC4899" />
            <Text style={[styles.cardHeaderTitleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Workouts Offered ({selectedWorkouts.length})
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editPillBtn}
            onPress={() => setShowWorkoutsModal(true)}
          >
            <Text style={styles.editPillText}>Manage</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.chipRow}>
          {selectedWorkouts.map((w, i) => (
            <View key={i} style={[styles.amenityChip, { backgroundColor: isDark ? '#1E293B' : '#FDF2F8' }]}>
              <MaterialIcons name="local-fire-department" size={14} color="#EC4899" />
              <Text style={[styles.amenityChipText, { color: isDark ? '#E2E8F0' : '#831843' }]}>{w}</Text>
            </View>
          ))}
          {selectedWorkouts.length === 0 && (
            <Text style={{ fontSize: 12, color: '#94A3B8' }}>No workouts configured. Tap Manage to add.</Text>
          )}
        </View>
      </View>

      {/* 6. Amenities */}
      <View style={[styles.card, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}>
        <View style={styles.cardHeaderWithEdit}>
          <View style={styles.cardHeaderLeft}>
            <MaterialIcons name="star" size={20} color="#F59E0B" />
            <Text style={[styles.cardHeaderTitleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Amenities ({selectedAmenities.length})
            </Text>
          </View>
          <TouchableOpacity style={styles.editPillBtn} onPress={() => setShowAmenitiesModal(true)}>
            <Text style={styles.editPillText}>Manage</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.chipRow}>
          {selectedAmenities.map((a, i) => (
            <View key={i} style={[styles.amenityChip, { backgroundColor: isDark ? '#1E293B' : '#FFFBEB' }]}>
              <MaterialIcons name="star" size={14} color="#F59E0B" />
              <Text style={[styles.amenityChipText, { color: isDark ? '#E2E8F0' : '#92400E' }]}>{a}</Text>
            </View>
          ))}
          {selectedAmenities.length === 0 && (
            <Text style={{ fontSize: 12, color: '#94A3B8' }}>No amenities configured. Tap Manage to add.</Text>
          )}
        </View>
      </View>

      {/* 7. Gym Rules */}
      <View style={[styles.card, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}>
        <View style={styles.cardHeaderWithEdit}>
          <View style={styles.cardHeaderLeft}>
            <MaterialIcons name="rule" size={20} color="#6366F1" />
            <Text style={[styles.cardHeaderTitleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Gym Rules ({gymRules.length})
            </Text>
          </View>
          <TouchableOpacity style={styles.editPillBtn} onPress={() => setShowRulesModal(true)}>
            <Text style={styles.editPillText}>Manage</Text>
          </TouchableOpacity>
        </View>
        <View style={{ gap: 6 }}>
          {gymRules.slice(0, 3).map((r, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialIcons name="check" size={14} color="#6366F1" />
              <Text style={{ fontSize: 12, color: isDark ? '#CBD5E1' : '#475569', flex: 1 }}>{r}</Text>
            </View>
          ))}
          {gymRules.length > 3 && (
            <Text style={{ fontSize: 11, color: '#94A3B8' }}>+{gymRules.length - 3} more rules. Tap Manage to view.</Text>
          )}
        </View>
      </View>

      {/* 8. Safety Measures */}
      <View style={[styles.card, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}>
        <View style={styles.cardHeaderWithEdit}>
          <View style={styles.cardHeaderLeft}>
            <MaterialIcons name="security" size={20} color="#10B981" />
            <Text style={[styles.cardHeaderTitleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Safety Measures ({safetyMeasures.length})
            </Text>
          </View>
          <TouchableOpacity style={styles.editPillBtn} onPress={() => setShowSafetyModal(true)}>
            <Text style={styles.editPillText}>Manage</Text>
          </TouchableOpacity>
        </View>
        <View style={{ gap: 6 }}>
          {safetyMeasures.slice(0, 3).map((s, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialIcons name="check-circle" size={14} color="#10B981" />
              <Text style={{ fontSize: 12, color: isDark ? '#CBD5E1' : '#166534', flex: 1 }}>{s}</Text>
            </View>
          ))}
          {safetyMeasures.length > 3 && (
            <Text style={{ fontSize: 11, color: '#94A3B8' }}>+{safetyMeasures.length - 3} more. Tap Manage to view all.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );

  // -------------------------------------------------------------------------
  // 3. BASIC PROFILE SUB-VIEW (FULL INPUTS MATCHING WEB)
  // -------------------------------------------------------------------------
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
          style={[
            styles.backBtn,
            { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' },
          ]}
          onPress={() => setActiveSection('MAIN')}
        >
          <MaterialIcons name="arrow-back" size={22} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </TouchableOpacity>
        <Text style={[styles.subHeaderTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Basic Profile & Legal
        </Text>
        <View style={{ width: 42 }} />
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' },
        ]}
      >
        <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Gym Brand Name *</Text>
        <TextInput
          value={basicName}
          onChangeText={setBasicName}
          placeholder="e.g. Super Max Gym"
          placeholderTextColor="#94A3B8"
          style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
        />

        <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A', marginTop: 12 }]}>Tagline / Slogan</Text>
        <TextInput
          value={basicTagline}
          onChangeText={setBasicTagline}
          placeholder="e.g. Transform Your Life"
          placeholderTextColor="#94A3B8"
          style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
        />

        <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A', marginTop: 12 }]}>Owner / Contact Person *</Text>
        <TextInput
          value={basicOwnerName}
          onChangeText={setBasicOwnerName}
          placeholder="Owner Full Name"
          placeholderTextColor="#94A3B8"
          style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
        />

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Phone Number *</Text>
            <TextInput
              value={basicPhone}
              onChangeText={setBasicPhone}
              placeholder="+91 98765 43210"
              keyboardType="phone-pad"
              placeholderTextColor="#94A3B8"
              style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Email Address *</Text>
            <TextInput
              value={basicEmail}
              onChangeText={setBasicEmail}
              placeholder="gym@domain.com"
              keyboardType="email-address"
              placeholderTextColor="#94A3B8"
              style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>GST Number</Text>
            <TextInput
              value={basicGst}
              onChangeText={setBasicGst}
              placeholder="33AAAAA0000A1Z5"
              placeholderTextColor="#94A3B8"
              style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>PAN Number</Text>
            <TextInput
              value={basicPan}
              onChangeText={setBasicPan}
              placeholder="ABCDE1234F"
              placeholderTextColor="#94A3B8"
              style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
            />
          </View>
        </View>

        <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A', marginTop: 12 }]}>Street Address *</Text>
        <TextInput
          value={basicAddress}
          onChangeText={setBasicAddress}
          placeholder="No. 12, Main Road, Landmark"
          placeholderTextColor="#94A3B8"
          style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
        />

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Area / Locality</Text>
            <TextInput
              value={basicArea}
              onChangeText={setBasicArea}
              placeholder="e.g. Mangadu"
              placeholderTextColor="#94A3B8"
              style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>City *</Text>
            <TextInput
              value={basicCity}
              onChangeText={setBasicCity}
              placeholder="e.g. Chennai"
              placeholderTextColor="#94A3B8"
              style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>State</Text>
            <TextInput
              value={basicState}
              onChangeText={setBasicState}
              placeholder="Tamil Nadu"
              placeholderTextColor="#94A3B8"
              style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Pincode</Text>
            <TextInput
              value={basicPincode}
              onChangeText={setBasicPincode}
              placeholder="600122"
              keyboardType="number-pad"
              placeholderTextColor="#94A3B8"
              style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Floor Space (Sq. Ft.)</Text>
            <TextInput
              value={basicFloorSpace}
              onChangeText={setBasicFloorSpace}
              placeholder="e.g. 3500"
              keyboardType="number-pad"
              placeholderTextColor="#94A3B8"
              style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Max Floor Capacity</Text>
            <TextInput
              value={basicCapacity}
              onChangeText={setBasicCapacity}
              placeholder="e.g. 100"
              keyboardType="number-pad"
              placeholderTextColor="#94A3B8"
              style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
            />
          </View>
        </View>

        <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A', marginTop: 12 }]}>Google Maps Link</Text>
        <TextInput
          value={basicMapsUrl}
          onChangeText={setBasicMapsUrl}
          placeholder="https://maps.google.com/..."
          placeholderTextColor="#94A3B8"
          style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
        />

        <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A', marginTop: 12 }]}>About Gym & Description</Text>
        <TextInput
          value={basicAbout}
          onChangeText={setBasicAbout}
          placeholder="State of the art gym equipment, professional certified trainers..."
          multiline
          numberOfLines={3}
          placeholderTextColor="#94A3B8"
          style={[styles.formInput, { height: 80, textAlignVertical: 'top', color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
        />

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: AppColors.primaryColor, marginTop: 18 }]}
          onPress={handleSaveBasicProfile}
          disabled={isSavingBasic}
        >
          {isSavingBasic ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.submitBtnText}>Submit Changes for Super Admin Approval</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // -------------------------------------------------------------------------
  // 4. TRAINER PROFILE SUB-VIEW (LIST & FILTER)
  // -------------------------------------------------------------------------
  const renderTrainerProfileSubView = () => {
    const filterTabs = [
      { key: 'All', label: `All (${trainers.length})` },
      { key: 'Full-Time', label: `Full-Time` },
      { key: 'Part-Time', label: `Part-Time` },
    ];

    const filteredTrainers = trainers.filter((t) => {
      if (trainerTabType === 'All') return true;
      return t.type === trainerTabType;
    });

    return (
      <View style={[styles.container, { backgroundColor: isDark ? AppColors.darkBackground : AppColors.lightBackground }]}>
        <View style={[styles.subHeaderRow, { paddingTop: topInset + 10, paddingHorizontal: 18 }]}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
            onPress={() => setActiveSection('MAIN')}
          >
            <MaterialIcons name="arrow-back" size={22} color={isDark ? '#FFFFFF' : '#0F172A'} />
          </TouchableOpacity>
          <Text style={[styles.subHeaderTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Trainers & Coaches
          </Text>
          <TouchableOpacity
            style={styles.addPillTopBtn}
            onPress={openAddTrainerFlow}
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
                  isSelected && { borderBottomColor: AppColors.primaryColor, borderBottomWidth: 2.5 },
                ]}
                onPress={() => setTrainerTabType(tab.key)}
              >
                <Text
                  style={[
                    styles.docTabText,
                    {
                      color: isSelected ? (isDark ? '#93C5FD' : AppColors.primaryColor) : isDark ? 'rgba(255,255,255,0.5)' : '#64748B',
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
          contentContainerStyle={[styles.scrollContent, { paddingTop: 14, paddingBottom: 110 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingEmployees}
              onRefresh={fetchEmployeesData}
              tintColor={AppColors.primaryColor}
            />
          }
        >
          {filteredTrainers.map((trainer) => {
            const isApproved = trainer.approvalStatus === 'Approved';
            const isPending = trainer.approvalStatus === 'Pending Approval';
            const avatarUri = getSafeImageUri(trainer.avatar);

            return (
              <TouchableOpacity
                key={trainer._id || trainer.id}
                style={[
                  styles.trainerCardRow,
                  {
                    backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
                    borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                  },
                ]}
                onPress={() => {
                  setSelectedEmpDetail(trainer);
                  setDetailModalTab('details');
                }}
                activeOpacity={0.8}
              >
                <View style={styles.trainerAvatarWrapper}>
                  {avatarUri ? (
                    <Image source={{ uri: avatarUri }} style={styles.trainerCardAvatar} />
                  ) : (
                    <View style={[styles.avatarFallback, { backgroundColor: AppColors.primaryColor }]}>
                      <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>
                        {trainer.name ? trainer.name.slice(0, 2).toUpperCase() : 'TR'}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.trainerCenterInfo}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={[styles.trainerCardName, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                      {trainer.name}
                    </Text>
                    <View style={styles.empIdTag}>
                      <Text style={styles.empIdTagText}>{trainer.employeeId || 'TR'}</Text>
                    </View>
                  </View>
                  <Text style={[styles.trainerSpecText, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
                    {trainer.specialty || trainer.role} • {trainer.type || 'Full-Time'}
                  </Text>
                  <Text style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8', marginTop: 2 }}>
                    {trainer.phone || 'No phone'}
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <View
                    style={[
                      styles.approvalStatusPill,
                      {
                        backgroundColor: isApproved
                          ? 'rgba(22, 163, 74, 0.12)'
                          : isPending
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'rgba(239, 68, 68, 0.12)',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.approvalStatusText,
                        {
                          color: isApproved
                            ? '#16a34a'
                            : isPending
                            ? '#d97706'
                            : '#ef4444',
                        },
                      ]}
                    >
                      {trainer.approvalStatus || 'Approved'}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
                </View>
              </TouchableOpacity>
            );
          })}

          {filteredTrainers.length === 0 && (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <MaterialIcons name="sports" size={40} color="#94A3B8" />
              <Text style={{ marginTop: 10, color: '#94A3B8', fontSize: 14 }}>
                No trainers registered yet. Tap "Add Trainer" to onboard.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  // -------------------------------------------------------------------------
  // 5. EMPLOYEES & STAFF SUB-VIEW
  // -------------------------------------------------------------------------
  const renderEmployeesSubView = () => {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? AppColors.darkBackground : AppColors.lightBackground }]}>
        <View style={[styles.subHeaderRow, { paddingTop: topInset + 10, paddingHorizontal: 18 }]}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
            onPress={() => setActiveSection('MAIN')}
          >
            <MaterialIcons name="arrow-back" size={22} color={isDark ? '#FFFFFF' : '#0F172A'} />
          </TouchableOpacity>
          <Text style={[styles.subHeaderTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Staff & Employees
          </Text>
          <TouchableOpacity
            style={styles.addPillTopBtn}
            onPress={openAddStaffFlow}
          >
            <MaterialIcons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.addPillTopBtnText}>Add Staff</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: 14, paddingBottom: 110 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingEmployees}
              onRefresh={fetchEmployeesData}
              tintColor={AppColors.primaryColor}
            />
          }
        >
          {staffEmployees.map((emp) => {
            const isApproved = emp.approvalStatus === 'Approved';
            const isPending = emp.approvalStatus === 'Pending Approval';
            const avatarUri = getSafeImageUri(emp.avatar);

            return (
              <TouchableOpacity
                key={emp._id || emp.id}
                style={[
                  styles.trainerCardRow,
                  {
                    backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF',
                    borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                  },
                ]}
                onPress={() => {
                  setSelectedEmpDetail(emp);
                  setDetailModalTab('details');
                }}
                activeOpacity={0.8}
              >
                <View style={styles.trainerAvatarWrapper}>
                  {avatarUri ? (
                    <Image source={{ uri: avatarUri }} style={styles.trainerCardAvatar} />
                  ) : (
                    <View style={[styles.avatarFallback, { backgroundColor: '#A855F7' }]}>
                      <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>
                        {emp.name ? emp.name.slice(0, 2).toUpperCase() : 'ST'}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.trainerCenterInfo}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={[styles.trainerCardName, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                      {emp.name}
                    </Text>
                    <View style={styles.empIdTag}>
                      <Text style={styles.empIdTagText}>{emp.employeeId || 'ST'}</Text>
                    </View>
                  </View>
                  <Text style={[styles.trainerSpecText, { color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B' }]}>
                    {emp.role} • {emp.accessType || 'Employee'}
                  </Text>
                  <Text style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8', marginTop: 2 }}>
                    {emp.phone || 'No phone'}
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <View
                    style={[
                      styles.approvalStatusPill,
                      {
                        backgroundColor: isApproved
                          ? 'rgba(22, 163, 74, 0.12)'
                          : isPending
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'rgba(239, 68, 68, 0.12)',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.approvalStatusText,
                        {
                          color: isApproved
                            ? '#16a34a'
                            : isPending
                            ? '#d97706'
                            : '#ef4444',
                        },
                      ]}
                    >
                      {emp.approvalStatus || 'Approved'}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
                </View>
              </TouchableOpacity>
            );
          })}

          {staffEmployees.length === 0 && (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <MaterialIcons name="people" size={40} color="#94A3B8" />
              <Text style={{ marginTop: 10, color: '#94A3B8', fontSize: 14 }}>
                No general staff registered yet. Tap "Add Staff" to onboard.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  // -------------------------------------------------------------------------
  // 6. MULTI-STEP ADD TRAINER / STAFF FORM (MATCHING WEB LOGIC)
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // 6. MULTI-STEP ADD TRAINER / STAFF FORM (MATCHING WEB LOGIC)
  // -------------------------------------------------------------------------
  const renderAddTrainerOrEmpSubView = (isTrainer = false) => (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: topInset + 12, paddingBottom: 110 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.subHeaderRow}>
        <TouchableOpacity
          style={[
            styles.backBtn,
            { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' },
          ]}
          onPress={() => setActiveSection(isTrainer ? 'TRAINER_PROFILE' : 'EMPLOYEES')}
        >
          <MaterialIcons name="arrow-back" size={22} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </TouchableOpacity>
        <Text style={[styles.subHeaderTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          {isTrainer ? 'Add Trainer' : 'Add Staff Member'}
        </Text>
        <View style={{ width: 42 }} />
      </View>

      {/* Step Wizard Progress Header */}
      <View style={styles.wizardProgressRow}>
        <View style={[styles.stepPill, addEmpStep >= 1 && styles.stepPillActive]}>
          <Text style={[styles.stepPillText, addEmpStep >= 1 && styles.stepPillTextActive]}>1. Personal Info</Text>
        </View>
        <View style={styles.stepConnector} />
        <View style={[styles.stepPill, addEmpStep >= 2 && styles.stepPillActive]}>
          <Text style={[styles.stepPillText, addEmpStep >= 2 && styles.stepPillTextActive]}>2. Docs & Certs</Text>
        </View>
        <View style={styles.stepConnector} />
        <View style={[styles.stepPill, addEmpStep >= 3 && styles.stepPillActive]}>
          <Text style={[styles.stepPillText, addEmpStep >= 3 && styles.stepPillTextActive]}>3. Schedule & Pay</Text>
        </View>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0', marginTop: 14 },
        ]}
      >
        {/* ==================== STEP 1: PERSONAL & BASIC INFO ==================== */}
        {addEmpStep === 1 && (
          <View>
            <Text style={[styles.stepHeaderTitle, { color: '#722ED1' }]}>
              Personal Details & Previous Employment
            </Text>

            {/* Photo Avatar Picker */}
            <View style={{ alignItems: 'center', marginVertical: 14 }}>
              <TouchableOpacity
                style={[styles.empPhotoPickerBox, { borderColor: addEmpPhoto ? '#722ED1' : isDark ? AppColors.darkBorder : '#CBD5E1' }]}
                onPress={handlePickEmpPhoto}
              >
                {addEmpPhoto ? (
                  <Image source={{ uri: addEmpPhoto }} style={styles.empPhotoPreview} />
                ) : (
                  <View style={{ alignItems: 'center' }}>
                    <MaterialIcons name="photo-camera" size={28} color="#722ED1" />
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#722ED1', marginTop: 4 }}>Upload Photo</Text>
                  </View>
                )}
              </TouchableOpacity>
              <Text style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,0.5)' : '#64748B', marginTop: 6 }}>
                Tap to upload employee headshot photo
              </Text>
            </View>

            <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Full Name *</Text>
            <TextInput
              value={addEmpName}
              onChangeText={setAddEmpName}
              placeholder="e.g. Arun Kumar"
              placeholderTextColor="#94A3B8"
              style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0', backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC' }]}
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <View style={{ width: 85 }}>
                <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Code</Text>
                <TextInput
                  value={addEmpCountryCode}
                  onChangeText={setAddEmpCountryCode}
                  placeholder="+91"
                  placeholderTextColor="#94A3B8"
                  style={[styles.formInput, { textAlign: 'center', color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0', backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC' }]}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Phone Number *</Text>
                <TextInput
                  value={addEmpPhone}
                  onChangeText={setAddEmpPhone}
                  placeholder="9876543210"
                  keyboardType="phone-pad"
                  placeholderTextColor="#94A3B8"
                  style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0', backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC' }]}
                />
              </View>
            </View>

            <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A', marginTop: 12 }]}>Email Address *</Text>
            <TextInput
              value={addEmpEmail}
              onChangeText={setAddEmpEmail}
              placeholder="staff@gymezy.com"
              keyboardType="email-address"
              placeholderTextColor="#94A3B8"
              style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0', backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC' }]}
            />

            {/* Role & Access Level Side-by-Side Dropdowns */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Role *</Text>
                <TouchableOpacity
                  style={[
                    styles.dropdownField,
                    {
                      backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                      borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                    },
                  ]}
                  onPress={() =>
                    openOptionPicker(
                      'Select Role',
                      isTrainer ? [{ value: 'Trainer', label: 'Trainer', desc: 'Fitness & Personal Coach' }] : ROLE_OPTIONS_DETAILED,
                      addEmpRole,
                      (val) => setAddEmpRole(val)
                    )
                  }
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.dropdownValueText,
                      { color: isDark ? '#FFFFFF' : '#0F172A' },
                    ]}
                    numberOfLines={1}
                  >
                    {addEmpRole || 'Select Role'}
                  </Text>
                  <MaterialIcons name="keyboard-arrow-down" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Access Level</Text>
                <TouchableOpacity
                  style={[
                    styles.dropdownField,
                    {
                      backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                      borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                    },
                  ]}
                  onPress={() =>
                    openOptionPicker(
                      'Select Access Level',
                      ACCESS_LEVEL_OPTIONS_DETAILED,
                      addEmpAccessLevel,
                      (val) => setAddEmpAccessLevel(val)
                    )
                  }
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.dropdownValueText,
                      { color: isDark ? '#FFFFFF' : '#0F172A' },
                    ]}
                    numberOfLines={1}
                  >
                    {addEmpAccessLevel || 'Select Level'}
                  </Text>
                  <MaterialIcons name="keyboard-arrow-down" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Previous Employment Section */}
            <View style={[styles.subSectionBox, { borderColor: isDark ? AppColors.darkBorder : '#F1F5F9', marginTop: 16 }]}>
              <Text style={[styles.subSectionTitle, { color: '#722ED1' }]}>Previous Employment Details</Text>
              
              <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A', marginTop: 8 }]}>Previous Gym / Company</Text>
              <TextInput
                value={addEmpPrevCompany}
                onChangeText={setAddEmpPrevCompany}
                placeholder="e.g. Gold's Gym"
                placeholderTextColor="#94A3B8"
                style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0', backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC' }]}
              />

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Designation</Text>
                  <TextInput
                    value={addEmpPrevDesignation}
                    onChangeText={setAddEmpPrevDesignation}
                    placeholder="e.g. Senior Trainer"
                    placeholderTextColor="#94A3B8"
                    style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0', backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC' }]}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Experience</Text>
                  <TouchableOpacity
                    style={[
                      styles.dropdownField,
                      {
                        backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                        borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                      },
                    ]}
                    onPress={() =>
                      openOptionPicker(
                        'Select Experience',
                        EXP_OPTIONS_DETAILED,
                        addEmpPrevExp,
                        (val) => setAddEmpPrevExp(val)
                      )
                    }
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.dropdownValueText,
                        { color: isDark ? '#FFFFFF' : '#0F172A' },
                      ]}
                      numberOfLines={1}
                    >
                      {addEmpPrevExp || 'Select Exp'}
                    </Text>
                    <MaterialIcons name="keyboard-arrow-down" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Employment Documents Table */}
              <View style={{ marginTop: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    Employment Documents ({addEmpDocsList.length})
                  </Text>
                  <TouchableOpacity
                    style={styles.attachBtn}
                    onPress={() => openAttachDocModal('employment')}
                  >
                    <MaterialIcons name="attach-file" size={14} color="#722ED1" />
                    <Text style={styles.attachBtnText}>Attach Document</Text>
                  </TouchableOpacity>
                </View>

                {addEmpDocsList.map((doc, idx) => (
                  <View key={doc.key || idx} style={[styles.docListItem, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC' }]}>
                    <MaterialIcons name="description" size={18} color="#722ED1" />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.docListTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>{doc.docType}</Text>
                      <Text style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,0.5)' : '#64748B' }}>
                        {doc.fileName} • {doc.addedOn}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => setAddEmpDocsList(addEmpDocsList.filter((_, i) => i !== idx))}>
                      <MaterialIcons name="delete" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
                {addEmpDocsList.length === 0 && (
                  <Text style={{ fontSize: 11, color: '#94A3B8' }}>No employment documents attached yet.</Text>
                )}
              </View>
            </View>

            {/* Next Button */}
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: AppColors.primaryColor, marginTop: 20 }]}
              onPress={handleNextStep2}
            >
              <Text style={styles.submitBtnText}>Next: Documents & Certifications</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ==================== STEP 2: FAMILY & VERIFICATION DOCS ==================== */}
        {addEmpStep === 2 && (
          <View>
            <Text style={[styles.stepHeaderTitle, { color: '#722ED1' }]}>
              Family & Government ID Verification
            </Text>

            <View style={[styles.subSectionBox, { borderColor: isDark ? AppColors.darkBorder : '#F1F5F9', marginTop: 10 }]}>
              <Text style={[styles.subSectionTitle, { color: '#722ED1' }]}>Emergency Contact Details</Text>
              
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Contact Name *</Text>
                  <TextInput
                    value={addEmpEmergencyName}
                    onChangeText={setAddEmpEmergencyName}
                    placeholder="e.g. Priya Kumar"
                    placeholderTextColor="#94A3B8"
                    style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0', backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC' }]}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Relationship *</Text>
                  <TouchableOpacity
                    style={[
                      styles.dropdownField,
                      {
                        backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                        borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                      },
                    ]}
                    onPress={() =>
                      openOptionPicker(
                        'Select Relationship',
                        REL_OPTIONS_DETAILED,
                        addEmpEmergencyRel,
                        (val) => setAddEmpEmergencyRel(val)
                      )
                    }
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.dropdownValueText,
                        { color: isDark ? '#FFFFFF' : '#0F172A' },
                      ]}
                      numberOfLines={1}
                    >
                      {addEmpEmergencyRel || 'Select'}
                    </Text>
                    <MaterialIcons name="keyboard-arrow-down" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A', marginTop: 10 }]}>Emergency Phone Number *</Text>
              <TextInput
                value={addEmpEmergencyPhone}
                onChangeText={setAddEmpEmergencyPhone}
                placeholder="+91 98400 00000"
                keyboardType="phone-pad"
                placeholderTextColor="#94A3B8"
                style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0', backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC' }]}
              />
            </View>

            {/* Government ID Documents */}
            <View style={[styles.subSectionBox, { borderColor: isDark ? AppColors.darkBorder : '#F1F5F9', marginTop: 14 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={[styles.subSectionTitle, { color: '#722ED1' }]}>
                  Government ID Proofs ({addPersonalDocsList.length})
                </Text>
                <TouchableOpacity
                  style={styles.attachBtn}
                  onPress={() => openAttachDocModal('personal')}
                >
                  <MaterialIcons name="add" size={14} color="#722ED1" />
                  <Text style={styles.attachBtnText}>Attach ID Proof</Text>
                </TouchableOpacity>
              </View>

              {addPersonalDocsList.map((doc, idx) => (
                <View key={doc.key || idx} style={[styles.docListItem, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC' }]}>
                  <MaterialIcons name="badge" size={18} color="#10B981" />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.docListTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>{doc.docType}</Text>
                    <Text style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,0.5)' : '#64748B' }}>
                      No: {doc.docNum} • {doc.fileName}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setAddPersonalDocsList(addPersonalDocsList.filter((_, i) => i !== idx))}>
                    <MaterialIcons name="delete" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
              {addPersonalDocsList.length === 0 && (
                <Text style={{ fontSize: 11, color: '#94A3B8' }}>No government ID proofs attached yet.</Text>
              )}
            </View>

            {/* Trainer Certifications (If Trainer) */}
            {isTrainer && (
              <View style={[styles.subSectionBox, { borderColor: isDark ? AppColors.darkBorder : '#F1F5F9', marginTop: 14 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={[styles.subSectionTitle, { color: '#722ED1' }]}>
                    Trainer Certifications & Proofs ({addTrainerCertsList.length})
                  </Text>
                  <TouchableOpacity
                    style={styles.attachBtn}
                    onPress={() => openAttachDocModal('trainer')}
                  >
                    <MaterialIcons name="card-membership" size={14} color="#722ED1" />
                    <Text style={styles.attachBtnText}>Attach Certificate</Text>
                  </TouchableOpacity>
                </View>

                {addTrainerCertsList.map((cert, idx) => (
                  <View key={cert.key || idx} style={[styles.docListItem, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC' }]}>
                    <MaterialIcons name="verified" size={18} color="#F59E0B" />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.docListTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>{cert.certType}</Text>
                      <Text style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,0.5)' : '#64748B' }}>
                        ID: {cert.certNum} • {cert.fileName}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => setAddTrainerCertsList(addTrainerCertsList.filter((_, i) => i !== idx))}>
                      <MaterialIcons name="delete" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
                {addTrainerCertsList.length === 0 && (
                  <Text style={{ fontSize: 11, color: '#94A3B8' }}>No trainer certifications attached yet.</Text>
                )}
              </View>
            )}

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
              <TouchableOpacity
                style={[styles.backStepBtn, { borderColor: isDark ? AppColors.darkBorder : '#CBD5E1' }]}
                onPress={() => setAddEmpStep(1)}
              >
                <Text style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontWeight: '700' }}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, { flex: 1, backgroundColor: AppColors.primaryColor }]}
                onPress={handleNextStep3}
              >
                <Text style={styles.submitBtnText}>Next: Schedule & Pay</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ==================== STEP 3: SCHEDULE, SPECIALTY & PAY ==================== */}
        {addEmpStep === 3 && (
          <View>
            <Text style={[styles.stepHeaderTitle, { color: '#722ED1' }]}>
              Shift Schedule & Compensation
            </Text>

            <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A', marginTop: 10 }]}>
              {isTrainer ? 'Trainer Specialty / Focus Area' : 'Designation / Area'}
            </Text>
            <TextInput
              value={addEmpSpecialty}
              onChangeText={setAddEmpSpecialty}
              placeholder={isTrainer ? 'e.g. Strength & Conditioning Coach' : 'e.g. Front Desk Specialist'}
              placeholderTextColor="#94A3B8"
              style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0', backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC' }]}
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Monthly Pay (₹)</Text>
                <TextInput
                  value={addEmpSalary}
                  onChangeText={setAddEmpSalary}
                  placeholder="e.g. 25000"
                  keyboardType="number-pad"
                  placeholderTextColor="#94A3B8"
                  style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0', backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC' }]}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Shift Schedule</Text>
                <TouchableOpacity
                  style={[
                    styles.dropdownField,
                    {
                      backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                      borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                    },
                  ]}
                  onPress={() =>
                    openOptionPicker(
                      'Select Shift Schedule',
                      SHIFT_OPTIONS_DETAILED,
                      addEmpShift,
                      (val) => setAddEmpShift(val)
                    )
                  }
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.dropdownValueText,
                      { color: isDark ? '#FFFFFF' : '#0F172A' },
                    ]}
                    numberOfLines={1}
                  >
                    {addEmpShift || 'Select Shift'}
                  </Text>
                  <MaterialIcons name="keyboard-arrow-down" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Work Days</Text>
                <TextInput
                  value={addEmpWorkDays}
                  onChangeText={setAddEmpWorkDays}
                  placeholder="Mon - Sat"
                  placeholderTextColor="#94A3B8"
                  style={[styles.formInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0', backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC' }]}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Employment Type</Text>
                <TouchableOpacity
                  style={[
                    styles.dropdownField,
                    {
                      backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC',
                      borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                    },
                  ]}
                  onPress={() =>
                    openOptionPicker(
                      'Select Employment Type',
                      EMP_TYPE_OPTIONS_DETAILED,
                      addEmpType,
                      (val) => setAddEmpType(val)
                    )
                  }
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.dropdownValueText,
                      { color: isDark ? '#FFFFFF' : '#0F172A' },
                    ]}
                    numberOfLines={1}
                  >
                    {addEmpType || 'Full-Time'}
                  </Text>
                  <MaterialIcons name="keyboard-arrow-down" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A', marginTop: 12 }]}>Bio & Trainer Description</Text>
            <TextInput
              value={addEmpNotes}
              onChangeText={setAddEmpNotes}
              placeholder="Specialist in powerlifting, body transformation and nutrition planning..."
              multiline
              numberOfLines={3}
              placeholderTextColor="#94A3B8"
              style={[styles.formInput, { height: 75, textAlignVertical: 'top', color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0', backgroundColor: isDark ? AppColors.darkSurface : '#F8FAFC' }]}
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
              <TouchableOpacity
                style={[styles.backStepBtn, { borderColor: isDark ? AppColors.darkBorder : '#CBD5E1' }]}
                onPress={() => setAddEmpStep(2)}
              >
                <Text style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontWeight: '700' }}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, { flex: 1, backgroundColor: AppColors.primaryColor }]}
                onPress={() => handleCompleteAddEmployee(isTrainer)}
                disabled={isSubmittingEmp}
              >
                {isSubmittingEmp ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>Submit for Super Admin Approval</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? AppColors.darkBackground : AppColors.lightBackground }]}>
      {activeSection === 'MAIN' && renderMainHub()}
      {activeSection === 'GYM_PROFILE' && renderGymProfileSubView()}
      {activeSection === 'BASIC_PROFILE' && renderBasicProfileSubView()}
      {activeSection === 'TRAINER_PROFILE' && renderTrainerProfileSubView()}
      {activeSection === 'ADD_TRAINER' && renderAddTrainerOrEmpSubView(true)}
      {activeSection === 'EMPLOYEES' && renderEmployeesSubView()}
      {activeSection === 'ADD_EMPLOYEE' && renderAddTrainerOrEmpSubView(false)}

      {/* ==================== MODAL: ATTACH DOCUMENT / CERTIFICATE ==================== */}
      <Modal
        visible={showAttachDocModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAttachDocModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.pickerModalCard, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', maxHeight: 560 }]}>
            <View style={styles.pickerModalHeader}>
              <Text style={[styles.pickerModalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                {attachCategory === 'employment'
                  ? 'Attach Employment Document'
                  : attachCategory === 'personal'
                  ? 'Attach Government ID Proof'
                  : 'Attach Trainer Certificate'}
              </Text>
              <TouchableOpacity onPress={() => setShowAttachDocModal(false)}>
                <MaterialIcons name="close" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
              <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Document Type *</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 6 }}>
                {(attachCategory === 'employment'
                  ? EMPLOYMENT_DOC_TYPES
                  : attachCategory === 'personal'
                  ? PERSONAL_DOC_TYPES
                  : TRAINER_CERT_TYPES
                ).map((dt) => (
                  <TouchableOpacity
                    key={dt}
                    style={[
                      styles.selectionChip,
                      attachDocType === dt && { backgroundColor: AppColors.primaryColor, borderColor: AppColors.primaryColor },
                      { borderColor: isDark ? AppColors.darkBorder : '#CBD5E1' },
                    ]}
                    onPress={() => setAttachDocType(dt)}
                  >
                    <Text style={[styles.selectionChipText, attachDocType === dt && { color: '#FFF' }, { color: isDark ? '#E2E8F0' : '#334155' }]}>
                      {dt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A', marginTop: 10 }]}>Document / Certificate Number</Text>
              <TextInput
                value={attachDocNum}
                onChangeText={setAttachDocNum}
                placeholder="e.g. AADHAR-1234 or CERT-98210"
                placeholderTextColor="#94A3B8"
                style={[styles.modalInput, { color: isDark ? '#FFFFFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
              />

              <Text style={[styles.inputLabel, { color: isDark ? '#FFFFFF' : '#0F172A', marginTop: 12 }]}>Upload Document File / Photo</Text>
              <TouchableOpacity
                style={[
                  styles.fileUploadBox,
                  {
                    borderColor: attachDocFile ? '#10B981' : isDark ? AppColors.darkBorder : '#CBD5E1',
                    backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                  },
                ]}
                onPress={handleSelectDocFile}
              >
                {attachDocFile ? (
                  <View style={{ alignItems: 'center' }}>
                    <MaterialIcons name="check-circle" size={24} color="#10B981" />
                    <Text style={{ fontSize: 12, fontWeight: '700', color: isDark ? '#FFF' : '#0F172A', marginTop: 4 }}>
                      {attachDocFile.fileName}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#10B981', marginTop: 2 }}>Tap to change file</Text>
                  </View>
                ) : (
                  <View style={{ alignItems: 'center' }}>
                    <MaterialIcons name="cloud-upload" size={26} color="#722ED1" />
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#722ED1', marginTop: 4 }}>Select File / Photo</Text>
                    <Text style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>JPG, PNG or PDF (Max 5MB)</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: AppColors.primaryColor, marginTop: 16 }]}
                onPress={handleSaveAttachedDoc}
              >
                <Text style={styles.submitBtnText}>Add Document</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ==================== MODAL: EMPLOYEE / TRAINER DETAILS ==================== */}
      <Modal
        visible={!!selectedEmpDetail}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedEmpDetail(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.pickerModalCard, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', maxHeight: 620 }]}>
            <View style={styles.pickerModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={[styles.pickerModalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  {selectedEmpDetail?.name}
                </Text>
                <View style={styles.empIdTag}>
                  <Text style={styles.empIdTagText}>{selectedEmpDetail?.employeeId || 'EMP'}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setSelectedEmpDetail(null)}>
                <MaterialIcons name="close" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={[styles.docTabsContainer, { borderBottomColor: isDark ? AppColors.darkBorder : '#E2E8F0', paddingHorizontal: 0, marginVertical: 8 }]}>
              <TouchableOpacity
                style={[styles.docTabItem, detailModalTab === 'details' && { borderBottomColor: AppColors.primaryColor, borderBottomWidth: 2.5 }]}
                onPress={() => setDetailModalTab('details')}
              >
                <Text style={[styles.docTabText, { color: detailModalTab === 'details' ? AppColors.primaryColor : isDark ? '#888' : '#64748B', fontWeight: '700' }]}>
                  Overview
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.docTabItem, detailModalTab === 'documents' && { borderBottomColor: AppColors.primaryColor, borderBottomWidth: 2.5 }]}
                onPress={() => setDetailModalTab('documents')}
              >
                <Text style={[styles.docTabText, { color: detailModalTab === 'documents' ? AppColors.primaryColor : isDark ? '#888' : '#64748B', fontWeight: '700' }]}>
                  Docs & Certs ({((selectedEmpDetail?.documents || []).length) + ((selectedEmpDetail?.trainerCerts || []).length)})
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {detailModalTab === 'details' && (
                <View style={{ gap: 10, paddingVertical: 6 }}>
                  <View style={styles.infoRowBetween}>
                    <Text style={{ fontSize: 12, color: isDark ? '#888' : '#64748B' }}>Role</Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: isDark ? '#FFF' : '#0F172A' }}>
                      {selectedEmpDetail?.specialty || selectedEmpDetail?.role}
                    </Text>
                  </View>

                  <View style={styles.infoRowBetween}>
                    <Text style={{ fontSize: 12, color: isDark ? '#888' : '#64748B' }}>Approval Status</Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: selectedEmpDetail?.approvalStatus === 'Approved' ? '#16A34A' : '#D97706' }}>
                      {selectedEmpDetail?.approvalStatus || 'Approved'}
                    </Text>
                  </View>

                  <View style={styles.infoRowBetween}>
                    <Text style={{ fontSize: 12, color: isDark ? '#888' : '#64748B' }}>Phone</Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: isDark ? '#FFF' : '#0F172A' }}>
                      {selectedEmpDetail?.phone || '—'}
                    </Text>
                  </View>

                  <View style={styles.infoRowBetween}>
                    <Text style={{ fontSize: 12, color: isDark ? '#888' : '#64748B' }}>Email</Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: isDark ? '#FFF' : '#0F172A' }}>
                      {selectedEmpDetail?.email || '—'}
                    </Text>
                  </View>

                  <View style={styles.infoRowBetween}>
                    <Text style={{ fontSize: 12, color: isDark ? '#888' : '#64748B' }}>Shift Hours</Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: isDark ? '#FFF' : '#0F172A' }}>
                      {selectedEmpDetail?.schedule?.shiftHours || `${selectedEmpDetail?.schedule?.workingTimeStart || '06:00 AM'} - ${selectedEmpDetail?.schedule?.workingTimeEnd || '02:00 PM'}`}
                    </Text>
                  </View>

                  <View style={styles.infoRowBetween}>
                    <Text style={{ fontSize: 12, color: isDark ? '#888' : '#64748B' }}>Monthly Pay</Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#16A34A' }}>
                      ₹{Number(selectedEmpDetail?.compensation?.payAmount || 0).toLocaleString('en-IN')}
                    </Text>
                  </View>

                  <View style={styles.infoRowBetween}>
                    <Text style={{ fontSize: 12, color: isDark ? '#888' : '#64748B' }}>Emergency Contact</Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: isDark ? '#FFF' : '#0F172A' }}>
                      {selectedEmpDetail?.emergencyContact?.name ? `${selectedEmpDetail.emergencyContact.name} (${selectedEmpDetail.emergencyContact.phone})` : '—'}
                    </Text>
                  </View>

                  {/* Contact Actions */}
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                    <TouchableOpacity
                      style={[styles.actionBtnRow, { backgroundColor: '#10B981' }]}
                      onPress={() => {
                        if (selectedEmpDetail?.phone) {
                          Linking.openURL(`tel:${selectedEmpDetail.phone}`);
                        }
                      }}
                    >
                      <MaterialIcons name="phone" size={16} color="#FFFFFF" />
                      <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 13 }}>Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtnRow, { backgroundColor: '#25D366' }]}
                      onPress={() => {
                        if (selectedEmpDetail?.phone) {
                          const clean = selectedEmpDetail.phone.replace(/[^0-9]/g, '');
                          Linking.openURL(`whatsapp://send?phone=${clean}`);
                        }
                      }}
                    >
                      <Ionicons name="logo-whatsapp" size={16} color="#FFFFFF" />
                      <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 13 }}>WhatsApp</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Deactivate Button */}
                  <TouchableOpacity
                    style={[styles.deactivateBtn, { borderColor: '#EF4444', marginTop: 10 }]}
                    onPress={() => handleDeleteEmployee(selectedEmpDetail)}
                  >
                    <MaterialIcons name="block" size={16} color="#EF4444" />
                    <Text style={{ color: '#EF4444', fontWeight: '700', fontSize: 13 }}>Deactivate Employee</Text>
                  </TouchableOpacity>
                </View>
              )}

              {detailModalTab === 'documents' && (
                <View style={{ gap: 10, paddingVertical: 6 }}>
                  {/* Government Verification ID Proofs */}
                  <Text style={[styles.subSectionTitle, { color: '#722ED1' }]}>Government ID Proofs</Text>
                  {(selectedEmpDetail?.documents || []).map((doc, idx) => (
                    <View key={idx} style={[styles.docListItem, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC' }]}>
                      <MaterialIcons name="verified-user" size={20} color="#10B981" />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.docListTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>{doc.docType}</Text>
                        <Text style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,0.5)' : '#64748B' }}>
                          Number: {doc.docNum} • {doc.fileName}
                        </Text>
                      </View>
                    </View>
                  ))}
                  {(!selectedEmpDetail?.documents || selectedEmpDetail.documents.length === 0) && (
                    <Text style={{ fontSize: 11, color: '#94A3B8' }}>No government ID documents attached.</Text>
                  )}

                  {/* Trainer Certifications */}
                  <Text style={[styles.subSectionTitle, { color: '#722ED1', marginTop: 10 }]}>Trainer Certifications</Text>
                  {(selectedEmpDetail?.trainerCerts || []).map((cert, idx) => (
                    <View key={idx} style={[styles.docListItem, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC' }]}>
                      <MaterialIcons name="card-membership" size={20} color="#F59E0B" />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.docListTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>{cert.certType}</Text>
                        <Text style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,0.5)' : '#64748B' }}>
                          Cert ID: {cert.certNum} • {cert.fileName}
                        </Text>
                      </View>
                    </View>
                  ))}
                  {(!selectedEmpDetail?.trainerCerts || selectedEmpDetail.trainerCerts.length === 0) && (
                    <Text style={{ fontSize: 11, color: '#94A3B8' }}>No trainer certifications attached.</Text>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ==================== MODAL: TIMINGS ==================== */}
      <Modal
        visible={showEditTimingsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditTimingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.pickerModalCard, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', maxHeight: 420 }]}>
            <View style={styles.pickerModalHeader}>
              <Text style={[styles.pickerModalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Edit Gym Operating Hours
              </Text>
              <TouchableOpacity onPress={() => setShowEditTimingsModal(false)}>
                <MaterialIcons name="close" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
              <Text style={[styles.inputLabel, { color: isDark ? '#FFF' : '#0F172A' }]}>Weekday Open Time</Text>
              <TextInput
                value={weekdayOpen}
                onChangeText={setWeekdayOpen}
                style={[styles.modalInput, { color: isDark ? '#FFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
              />

              <Text style={[styles.inputLabel, { color: isDark ? '#FFF' : '#0F172A', marginTop: 8 }]}>Weekday Close Time</Text>
              <TextInput
                value={weekdayClose}
                onChangeText={setWeekdayClose}
                style={[styles.modalInput, { color: isDark ? '#FFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
              />

              <Text style={[styles.inputLabel, { color: isDark ? '#FFF' : '#0F172A', marginTop: 8 }]}>Weekend Open Time</Text>
              <TextInput
                value={weekendOpen}
                onChangeText={setWeekendOpen}
                style={[styles.modalInput, { color: isDark ? '#FFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
              />

              <Text style={[styles.inputLabel, { color: isDark ? '#FFF' : '#0F172A', marginTop: 8 }]}>Weekend Close Time</Text>
              <TextInput
                value={weekendClose}
                onChangeText={setWeekendClose}
                style={[styles.modalInput, { color: isDark ? '#FFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
              />

              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: AppColors.primaryColor, marginTop: 14 }]}
                onPress={handleSaveOperatingHours}
              >
                <Text style={styles.submitBtnText}>Submit Timings for Approval</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ==================== MODAL: BANK & SETTLEMENTS ==================== */}
      <Modal
        visible={showEditBankModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditBankModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.pickerModalCard, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', maxHeight: 520 }]}>
            <View style={styles.pickerModalHeader}>
              <Text style={[styles.pickerModalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Bank & Instant Settlements
              </Text>
              <TouchableOpacity onPress={() => setShowEditBankModal(false)}>
                <MaterialIcons name="close" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
              <Text style={[styles.inputLabel, { color: isDark ? '#FFF' : '#0F172A' }]}>Account Holder Name *</Text>
              <TextInput
                value={accountHolder}
                onChangeText={setAccountHolder}
                placeholder="Name as in Bank Account"
                placeholderTextColor="#94A3B8"
                style={[styles.modalInput, { color: isDark ? '#FFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
              />

              <Text style={[styles.inputLabel, { color: isDark ? '#FFF' : '#0F172A', marginTop: 8 }]}>Bank Name</Text>
              <TextInput
                value={bankName}
                onChangeText={setBankName}
                placeholder="e.g. HDFC Bank / ICICI Bank"
                placeholderTextColor="#94A3B8"
                style={[styles.modalInput, { color: isDark ? '#FFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
              />

              <Text style={[styles.inputLabel, { color: isDark ? '#FFF' : '#0F172A', marginTop: 8 }]}>Account Number *</Text>
              <TextInput
                value={accountNumber}
                onChangeText={setAccountNumber}
                placeholder="Bank Account Number"
                keyboardType="number-pad"
                placeholderTextColor="#94A3B8"
                style={[styles.modalInput, { color: isDark ? '#FFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
              />

              <Text style={[styles.inputLabel, { color: isDark ? '#FFF' : '#0F172A', marginTop: 8 }]}>IFSC Code *</Text>
              <TextInput
                value={ifscCode}
                onChangeText={setIfscCode}
                placeholder="HDFC0001234"
                autoCapitalize="characters"
                placeholderTextColor="#94A3B8"
                style={[styles.modalInput, { color: isDark ? '#FFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
              />

              <Text style={[styles.inputLabel, { color: isDark ? '#FFF' : '#0F172A', marginTop: 8 }]}>Instant Settlement UPI ID</Text>
              <TextInput
                value={upiId}
                onChangeText={setUpiId}
                placeholder="gym@okhdfcbank"
                placeholderTextColor="#94A3B8"
                style={[styles.modalInput, { color: isDark ? '#FFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
              />

              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: AppColors.primaryColor, marginTop: 14 }]}
                onPress={handleSaveBankDetails}
              >
                <Text style={styles.submitBtnText}>Submit Bank Details for Approval</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ==================== MODAL: ADD PRICING PLAN ==================== */}
      <Modal
        visible={showAddPlanModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddPlanModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.pickerModalCard, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', maxHeight: 480 }]}>
            <View style={styles.pickerModalHeader}>
              <Text style={[styles.pickerModalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Add Membership Plan
              </Text>
              <TouchableOpacity onPress={() => setShowAddPlanModal(false)}>
                <MaterialIcons name="close" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
              <Text style={[styles.inputLabel, { color: isDark ? '#FFF' : '#0F172A' }]}>Plan Name *</Text>
              <TextInput
                value={planName}
                onChangeText={setPlanName}
                placeholder="e.g. 1-Month Fitness Pass"
                placeholderTextColor="#94A3B8"
                style={[styles.modalInput, { color: isDark ? '#FFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
              />

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#FFF' : '#0F172A' }]}>Price (₹) *</Text>
                  <TextInput
                    value={planPrice}
                    onChangeText={setPlanPrice}
                    placeholder="1999"
                    keyboardType="number-pad"
                    placeholderTextColor="#94A3B8"
                    style={[styles.modalInput, { color: isDark ? '#FFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#FFF' : '#0F172A' }]}>Duration</Text>
                  <TextInput
                    value={planDuration}
                    onChangeText={setPlanDuration}
                    placeholder="30 Days"
                    placeholderTextColor="#94A3B8"
                    style={[styles.modalInput, { color: isDark ? '#FFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
                  />
                </View>
              </View>

              <Text style={[styles.inputLabel, { color: isDark ? '#FFF' : '#0F172A', marginTop: 8 }]}>Features (One per line)</Text>
              <TextInput
                value={planFeatures}
                onChangeText={setPlanFeatures}
                placeholder="Full Gym Floor Access&#10;Locker & Shower Included&#10;Free Trainer Guidance"
                multiline
                numberOfLines={3}
                placeholderTextColor="#94A3B8"
                style={[styles.modalInput, { height: 70, textAlignVertical: 'top', color: isDark ? '#FFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
              />

              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: AppColors.primaryColor, marginTop: 14 }]}
                onPress={handleAddPricingPlan}
              >
                <Text style={styles.submitBtnText}>Save Plan for Approval</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ==================== MODAL: FACILITIES CHECKLIST ==================== */}
      <Modal
        visible={showFacilitiesModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFacilitiesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.pickerModalCard, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', maxHeight: 560 }]}>
            <View style={styles.pickerModalHeader}>
              <Text style={[styles.pickerModalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Manage Gym Facilities
              </Text>
              <TouchableOpacity onPress={() => setShowFacilitiesModal(false)}>
                <MaterialIcons name="close" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
              {ALL_FACILITIES.map((fac) => {
                const isSelected = selectedFacilities.includes(fac);
                return (
                  <TouchableOpacity
                    key={fac}
                    style={[
                      styles.checklistRow,
                      {
                        backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.1)' : isDark ? '#1E293B' : '#F8FAFC',
                        borderColor: isSelected ? '#10B981' : isDark ? AppColors.darkBorder : '#E2E8F0',
                      },
                    ]}
                    onPress={() => {
                      if (isSelected) {
                        setSelectedFacilities(selectedFacilities.filter((f) => f !== fac));
                      } else {
                        setSelectedFacilities([...selectedFacilities, fac]);
                      }
                    }}
                  >
                    <MaterialIcons
                      name={isSelected ? 'check-box' : 'check-box-outline-blank'}
                      size={22}
                      color={isSelected ? '#10B981' : '#94A3B8'}
                    />
                    <Text style={[styles.checklistText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>{fac}</Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: AppColors.primaryColor, marginTop: 14 }]}
                onPress={handleSaveFacilities}
              >
                <Text style={styles.submitBtnText}>Save Facilities</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ==================== MODAL: WORKOUTS CHECKLIST ==================== */}
      <Modal
        visible={showWorkoutsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWorkoutsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.pickerModalCard, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', maxHeight: 560 }]}>
            <View style={styles.pickerModalHeader}>
              <Text style={[styles.pickerModalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Manage Workouts Offered
              </Text>
              <TouchableOpacity onPress={() => setShowWorkoutsModal(false)}>
                <MaterialIcons name="close" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
              {ALL_WORKOUTS.map((wk) => {
                const isSelected = selectedWorkouts.includes(wk);
                return (
                  <TouchableOpacity
                    key={wk}
                    style={[
                      styles.checklistRow,
                      {
                        backgroundColor: isSelected ? 'rgba(236, 72, 153, 0.1)' : isDark ? '#1E293B' : '#F8FAFC',
                        borderColor: isSelected ? '#EC4899' : isDark ? AppColors.darkBorder : '#E2E8F0',
                      },
                    ]}
                    onPress={() => {
                      if (isSelected) {
                        setSelectedWorkouts(selectedWorkouts.filter((w) => w !== wk));
                      } else {
                        setSelectedWorkouts([...selectedWorkouts, wk]);
                      }
                    }}
                  >
                    <MaterialIcons
                      name={isSelected ? 'check-box' : 'check-box-outline-blank'}
                      size={22}
                      color={isSelected ? '#EC4899' : '#94A3B8'}
                    />
                    <Text style={[styles.checklistText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>{wk}</Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: AppColors.primaryColor, marginTop: 14 }]}
                onPress={handleSaveWorkouts}
              >
                <Text style={styles.submitBtnText}>Save Workout Disciplines</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ==================== MODAL: AMENITIES CHECKLIST ==================== */}
      <Modal
        visible={showAmenitiesModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAmenitiesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.pickerModalCard, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', maxHeight: 520 }]}>
            <View style={styles.pickerModalHeader}>
              <Text style={[styles.pickerModalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Manage Gym Amenities</Text>
              <TouchableOpacity onPress={() => setShowAmenitiesModal(false)}>
                <MaterialIcons name="close" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
              {ALL_AMENITIES.map((amen) => {
                const isSelected = selectedAmenities.includes(amen);
                return (
                  <TouchableOpacity
                    key={amen}
                    style={[styles.checklistRow, {
                      backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.1)' : isDark ? '#1E293B' : '#F8FAFC',
                      borderColor: isSelected ? '#F59E0B' : isDark ? AppColors.darkBorder : '#E2E8F0',
                    }]}
                    onPress={() => {
                      if (isSelected) {
                        setSelectedAmenities(selectedAmenities.filter((a) => a !== amen));
                      } else {
                        setSelectedAmenities([...selectedAmenities, amen]);
                      }
                    }}
                  >
                    <MaterialIcons name={isSelected ? 'check-box' : 'check-box-outline-blank'} size={22} color={isSelected ? '#F59E0B' : '#94A3B8'} />
                    <Text style={[styles.checklistText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>{amen}</Text>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: AppColors.primaryColor, marginTop: 14 }]}
                onPress={handleSaveAmenities}
              >
                <Text style={styles.submitBtnText}>Save Amenities</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ==================== MODAL: GYM RULES ==================== */}
      <Modal
        visible={showRulesModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRulesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.pickerModalCard, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', maxHeight: 580 }]}>
            <View style={styles.pickerModalHeader}>
              <Text style={[styles.pickerModalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Gym Rules & Guidelines</Text>
              <TouchableOpacity onPress={() => setShowRulesModal(false)}>
                <MaterialIcons name="close" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
              {gymRules.map((rule, idx) => (
                <View key={idx} style={[styles.checklistRow, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0', justifyContent: 'space-between' }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                    <MaterialIcons name="check" size={18} color="#6366F1" />
                    <Text style={[styles.checklistText, { color: isDark ? '#FFFFFF' : '#0F172A', flex: 1 }]}>{rule}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setGymRules(gymRules.filter((_, i) => i !== idx))}>
                    <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                <TextInput
                  style={[styles.modalInput, { flex: 1, height: 40, color: isDark ? '#FFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
                  placeholder="Add new rule..."
                  placeholderTextColor="#94A3B8"
                  value={newRuleText}
                  onChangeText={setNewRuleText}
                />
                <TouchableOpacity
                  style={[styles.submitBtn, { paddingHorizontal: 14, paddingVertical: 0, height: 40, justifyContent: 'center', backgroundColor: '#6366F1' }]}
                  onPress={() => {
                    if (newRuleText.trim()) {
                      setGymRules([...gymRules, newRuleText.trim()]);
                      setNewRuleText('');
                    }
                  }}
                >
                  <Text style={styles.submitBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: AppColors.primaryColor, marginTop: 12 }]}
                onPress={handleSaveRules}
              >
                <Text style={styles.submitBtnText}>Save Rules</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ==================== MODAL: SAFETY MEASURES ==================== */}
      <Modal
        visible={showSafetyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSafetyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.pickerModalCard, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', maxHeight: 580 }]}>
            <View style={styles.pickerModalHeader}>
              <Text style={[styles.pickerModalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Safety Measures & Protocols</Text>
              <TouchableOpacity onPress={() => setShowSafetyModal(false)}>
                <MaterialIcons name="close" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
              {safetyMeasures.map((measure, idx) => (
                <View key={idx} style={[styles.checklistRow, { backgroundColor: isDark ? '#1E293B' : '#F0FDF4', borderColor: isDark ? AppColors.darkBorder : '#BBF7D0', justifyContent: 'space-between' }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                    <MaterialIcons name="check-circle" size={18} color="#10B981" />
                    <Text style={[styles.checklistText, { color: isDark ? '#FFFFFF' : '#166534', flex: 1 }]}>{measure}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSafetyMeasures(safetyMeasures.filter((_, i) => i !== idx))}>
                    <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                <TextInput
                  style={[styles.modalInput, { flex: 1, height: 40, color: isDark ? '#FFF' : '#0F172A', borderColor: isDark ? AppColors.darkBorder : '#E2E8F0' }]}
                  placeholder="Add safety measure..."
                  placeholderTextColor="#94A3B8"
                  value={newSafetyText}
                  onChangeText={setNewSafetyText}
                />
                <TouchableOpacity
                  style={[styles.submitBtn, { paddingHorizontal: 14, paddingVertical: 0, height: 40, justifyContent: 'center', backgroundColor: '#10B981' }]}
                  onPress={() => {
                    if (newSafetyText.trim()) {
                      setSafetyMeasures([...safetyMeasures, newSafetyText.trim()]);
                      setNewSafetyText('');
                    }
                  }}
                >
                  <Text style={styles.submitBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: AppColors.primaryColor, marginTop: 12 }]}
                onPress={handleSaveSafety}
              >
                <Text style={styles.submitBtnText}>Save Safety Measures</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ==================== MODAL: AUDIT LOG HISTORY ==================== */}
      <Modal
        visible={showAuditHistoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAuditHistoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.pickerModalCard, { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', maxHeight: 560 }]}>
            <View style={styles.pickerModalHeader}>
              <Text style={[styles.pickerModalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Audit Log History ({auditHistory.length})
              </Text>
              <TouchableOpacity onPress={() => setShowAuditHistoryModal(false)}>
                <MaterialIcons name="close" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
              {auditHistory.map((item, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.docListItem,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                      borderColor: isDark ? AppColors.darkBorder : '#E2E8F0',
                      borderWidth: 1,
                    },
                  ]}
                >
                  <MaterialIcons name="history" size={20} color="#0EA5E9" />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.docListTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                      {item.field || item.changeType || 'Profile Update'}
                    </Text>
                    <Text style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,0.5)' : '#64748B' }}>
                      Status: {item.approvalStatus || 'Pending Approval'} • {item.changedAt ? new Date(item.changedAt).toLocaleDateString() : 'Recent'}
                    </Text>
                  </View>
                </View>
              ))}
              {auditHistory.length === 0 && (
                <Text style={{ fontSize: 12, color: '#94A3B8', textAlign: 'center', paddingVertical: 20 }}>
                  No audit log records found.
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ==================== MODAL: GENERIC OPTION PICKER ==================== */}
      <Modal
        visible={showOptionPickerModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOptionPickerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.pickerModalCard,
              { backgroundColor: isDark ? AppColors.darkCard : '#FFFFFF', maxHeight: 520 },
            ]}
          >
            <View style={styles.pickerModalHeader}>
              <Text style={[styles.pickerModalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                {pickerModalTitle}
              </Text>
              <TouchableOpacity onPress={() => setShowOptionPickerModal(false)}>
                <MaterialIcons name="close" size={22} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 12 }}>
              {pickerOptions.map((opt, idx) => {
                const optVal = typeof opt === 'string' ? opt : opt.value;
                const optLbl = typeof opt === 'string' ? opt : opt.label;
                const optDesc = typeof opt === 'object' ? opt.desc : null;
                const isSelected = pickerSelectedValue === optVal;

                return (
                  <TouchableOpacity
                    key={optVal || idx}
                    style={[
                      styles.pickerOptionItem,
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
                      if (pickerOnSelect) pickerOnSelect(optVal);
                      setShowOptionPickerModal(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.pickerOptionLabel,
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
                        {optLbl}
                      </Text>
                      {optDesc ? (
                        <Text
                          style={[
                            styles.pickerOptionDesc,
                            { color: isDark ? 'rgba(255,255,255,0.5)' : '#64748B' },
                          ]}
                        >
                          {optDesc}
                        </Text>
                      ) : null}
                    </View>

                    <MaterialIcons
                      name={isSelected ? 'radio-button-checked' : 'radio-button-unchecked'}
                      size={20}
                      color={isSelected ? AppColors.primaryColor : isDark ? '#64748B' : '#CBD5E1'}
                    />
                  </TouchableOpacity>
                );
              })}
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
  profileHeroCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gymLogoWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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
    fontSize: 20,
    fontWeight: '800',
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileNameRow: {
    flex: 1,
  },
  profileGymName: {
    fontSize: 17,
    fontWeight: '800',
  },
  idStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  partnerIdTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  partnerIdText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  profileGymAddress: {
    fontSize: 12,
    marginTop: 8,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    marginBottom: 10,
  },
  menuListCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextBox: {
    flex: 1,
  },
  menuTitleText: {
    fontSize: 14,
    fontWeight: '700',
  },
  menuSubText: {
    fontSize: 11,
    marginTop: 2,
  },
  menuDivider: {
    height: 1,
    marginLeft: 64,
  },
  badgePill: {
    backgroundColor: '#722ED1',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  badgePillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginVertical: 10,
  },
  logoutBtnText: {
    color: '#DC2626',
    fontWeight: '800',
    fontSize: 14,
  },
  subHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  addPillTopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: AppColors.primaryColor,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addPillTopBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
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
    flex: 1,
  },
  cardHeaderTitleText: {
    fontSize: 15,
    fontWeight: '800',
  },
  cardSubText: {
    fontSize: 11,
    marginTop: 2,
  },
  editPillBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  editPillText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '700',
  },
  mediaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mediaRowCol: {
    flexDirection: 'column',
  },
  mediaPreviewCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mediaLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  logoThumbnailBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  logoThumbnail: {
    width: '100%',
    height: '100%',
  },
  logoThumbnailFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverThumbnailBox: {
    width: 70,
    height: 38,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  coverThumbnail: {
    width: '100%',
    height: '100%',
  },
  coverThumbnailFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  mediaActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  mediaActionBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  galleryThumbWrapper: {
    width: 80,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  galleryThumb: {
    width: '100%',
    height: '100%',
  },
  deletePhotoBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timingsDays: {
    fontSize: 13,
    fontWeight: '600',
  },
  priceRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  priceDurationLabel: {
    fontSize: 13,
  },
  priceAmountVal: {
    fontSize: 14,
    fontWeight: '800',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  amenityChipText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 13.5,
  },
  submitBtn: {
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  docTabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  docTabItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  docTabText: {
    fontSize: 13,
  },
  trainerCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    gap: 10,
  },
  trainerAvatarWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  trainerCardAvatar: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trainerCenterInfo: {
    flex: 1,
  },
  trainerCardName: {
    fontSize: 14,
    fontWeight: '800',
  },
  empIdTag: {
    backgroundColor: '#722ED1',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  empIdTagText: {
    color: '#FFF',
    fontSize: 9.5,
    fontWeight: '800',
  },
  trainerSpecText: {
    fontSize: 11.5,
    marginTop: 2,
  },
  approvalStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  approvalStatusText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  wizardProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 4,
  },
  stepPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },
  stepPillActive: {
    backgroundColor: '#722ED1',
  },
  stepPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  stepPillTextActive: {
    color: '#FFFFFF',
  },
  stepConnector: {
    width: 12,
    height: 2,
    backgroundColor: '#CBD5E1',
  },
  stepHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  empPhotoPickerBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  empPhotoPreview: {
    width: '100%',
    height: '100%',
  },
  selectionChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectionChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  selectionChipSmall: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  selectionChipTextSmall: {
    fontSize: 11,
    fontWeight: '700',
  },
  subSectionBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  subSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 6,
  },
  attachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(114, 46, 209, 0.1)',
  },
  attachBtnText: {
    color: '#722ED1',
    fontSize: 11.5,
    fontWeight: '700',
  },
  docListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  docListTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  backStepBtn: {
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  pickerModalCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
  },
  pickerModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  pickerModalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
  },
  fileUploadBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  infoRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  actionBtnRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  deactivateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 6,
  },
  checklistText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dropdownField: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownValueText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  pickerOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  pickerOptionLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  pickerOptionDesc: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default SettingsTab;
