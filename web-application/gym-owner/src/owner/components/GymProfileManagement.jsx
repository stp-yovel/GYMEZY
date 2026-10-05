import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateGymProfile, setGymProfile } from '../../redux/slices/gymSlice';
import {
  Card,
  Row,
  Col,
  Tag,
  Button,
  Typography,
  Avatar,
  Dropdown,
  Modal,
  Form,
  Input,
  Select,
  Progress,
  Divider,
  message,
  Tabs,
  Space,
  Switch,
  Table,
  Badge,
  InputNumber,
  Tooltip,
  Checkbox,
  Image,
  DatePicker,
  Spin,
  Empty,
  Popconfirm,
  Alert,
} from 'antd';
import {
  EditOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  CalendarOutlined,
  CrownOutlined,
  CameraOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  FileTextOutlined,
  PictureOutlined,
  BarChartOutlined,
  ArrowRightOutlined,
  InfoCircleOutlined,
  DownOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
  ShopOutlined,
  DollarCircleOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  IdcardOutlined,
  AppstoreOutlined,
  EyeOutlined,
  DeleteOutlined,
  WhatsAppOutlined,
  InstagramOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  BankOutlined,
  CreditCardOutlined,
  ToolOutlined,
  LockOutlined,
  FireOutlined,
  SaveOutlined,
  CopyOutlined,
  StarFilled,
  ReloadOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  AuditOutlined,
} from '@ant-design/icons';
import confetti from 'canvas-confetti';
import { useTheme } from '../../theme/ThemeContext';
import { apiClient } from '../../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const FACILITY_OPTIONS = [
  'AC Gym', 'Locker Facility', 'Shower Available', 'Changing Room',
  'Free Wi-Fi', 'Music System', 'Steam & Sauna', 'Ice Bath & Recovery',
  'Dedicated Parking (2W/4W)', 'Turnstile Access Control', 'First Aid Kit',
  'CCTV 24/7', 'Biometric Entry', 'Personal Trainers', 'Cardio Theater', 'Olympic Barbells Area',
];

const AMENITY_OPTIONS = [
  'RO Drinking Water', 'Towel Service', 'Protein Shake Bar', 'Juice & Smoothie Bar',
  'Personal Locker Rental', 'InBody BMI Scanner', 'Nutritionist Desk',
  'Lounge / Rest Area', 'Free Sanitizer Stations', 'Locker Key Padlocks',
];

const WORKOUT_OPTIONS = [
  'GYM / Strength', 'Cardio Fitness', 'HIIT (High Intensity)', 'CrossFit',
  'Yoga & Mobility', 'Zumba & Dance', 'Boxing & Kickboxing', 'Pilates',
  'Calisthenics', 'MMA & Martial Arts', 'Powerlifting', 'Bodybuilding', 'Aerobics',
];

const DEFAULT_RULES = [
  'Carry clean indoor training shoes',
  'Mandatory personal gym towel on workout benches',
  'Re-rack dumbbells and plates after set completion',
  'No outside food or beverages allowed on gym floor',
];

const DEFAULT_SAFETY = [
  'Daily multi-session equipment sanitization',
  'Certified First Aid & CPR staff available on floor',
  '24/7 CCTV surveillance coverage',
  'Emergency exits clearly marked and accessible',
];

// Time Slot Choices for Dropdown Selectors
const TIME_SLOTS = [
  '05:00 AM',
  '05:30 AM',
  '06:00 AM',
  '06:30 AM',
  '07:00 AM',
  '07:30 AM',
  '08:00 AM',
  '08:30 AM',
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM',
  '08:00 PM',
  '08:30 PM',
  '09:00 PM',
  '09:30 PM',
  '10:00 PM',
  '10:30 PM',
  '11:00 PM',
  '11:30 PM',
  '12:00 AM',
];

const DEFAULT_DAYS = [
  { day: 'Monday', isOpen: true, openTime: '05:30 AM', closeTime: '10:30 PM' },
  { day: 'Tuesday', isOpen: true, openTime: '05:30 AM', closeTime: '10:30 PM' },
  { day: 'Wednesday', isOpen: true, openTime: '05:30 AM', closeTime: '10:30 PM' },
  { day: 'Thursday', isOpen: true, openTime: '05:30 AM', closeTime: '10:30 PM' },
  { day: 'Friday', isOpen: true, openTime: '05:30 AM', closeTime: '10:30 PM' },
  { day: 'Saturday', isOpen: true, openTime: '06:00 AM', closeTime: '09:00 PM' },
  { day: 'Sunday', isOpen: true, openTime: '06:00 AM', closeTime: '01:00 PM' },
];

const getCategoryIcon = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('cardio')) return <FireOutlined />;
  if (cat.includes('strength')) return <ToolOutlined />;
  if (cat.includes('crossfit') || cat.includes('functional')) return <AppstoreOutlined />;
  if (cat.includes('wellness') || cat.includes('spa') || cat.includes('sauna')) return <SafetyCertificateOutlined />;
  if (cat.includes('tech') || cat.includes('turnstile')) return <IdcardOutlined />;
  if (cat.includes('nutrition') || cat.includes('bar')) return <ShopOutlined />;
  if (cat.includes('trainer') || cat.includes('training')) return <TeamOutlined />;
  if (cat.includes('lock') || cat.includes('amenit')) return <LockOutlined />;
  return <ToolOutlined />;
};

export const GymProfileManagement = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const gymProfileFromRedux = useSelector((state) => state.gym?.gymProfile || state.auth?.user?.gym);

  const targetGymId = useMemo(() => {
    return (
      gymProfileFromRedux?._id ||
      gymProfileFromRedux?.id ||
      gymProfileFromRedux?.mongoId ||
      user?.gym?._id ||
      user?.gym?.id ||
      user?.gymId ||
      ''
    );
  }, [gymProfileFromRedux, user]);

  const [activeTab, setActiveTab] = useState('basic');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSavingBasic, setIsSavingBasic] = useState(false);
  const [isSavingPricing, setIsSavingPricing] = useState(false);
  const [isSavingHours, setIsSavingHours] = useState(false);
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  const [isSavingFacility, setIsSavingFacility] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // Core Gym Profile State
  const [gymData, setGymData] = useState(null);

  // Tab Specific Working States
  const [facilities, setFacilities] = useState([]);
  const [gymWorkouts, setGymWorkouts] = useState([]);
  const [gymAmenities, setGymAmenities] = useState([]);
  const [gymRules, setGymRules] = useState(DEFAULT_RULES);
  const [safetyMeasures, setSafetyMeasures] = useState(DEFAULT_SAFETY);
  const [isSavingWorkoutsRules, setIsSavingWorkoutsRules] = useState(false);
  const [newRuleInput, setNewRuleInput] = useState('');
  const [newSafetyInput, setNewSafetyInput] = useState('');
  const [pricingPlans, setPricingPlans] = useState([]);
  const [operatingHours, setOperatingHours] = useState(DEFAULT_DAYS);
  const [holidayExceptions, setHolidayExceptions] = useState([]);
  const [is24HoursOpen, setIs24HoursOpen] = useState(false);
  const [isOpenHolidays, setIsOpenHolidays] = useState(true);
  const [isSplitShift, setIsSplitShift] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountType: 'Current Account',
    branch: '',
    upiId: '',
    payoutSchedule: 'Daily T+1 Automated Direct Bank Deposit',
    gstInvoiceEnabled: true,
  });
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    instagramHandle: '',
    facebook: '',
    youtube: '',
    whatsapp: '',
    website: '',
    googleBusinessUrl: '',
    googleRating: '4.9',
    googleReviewCount: '0',
  });
  const [systemSettings, setSystemSettings] = useState({
    turnstileTimeout: 5,
    renewalGracePeriod: 3,
    autoCheckoutHours: 2.5,
    smsCheckInAlerts: true,
    whatsappAlerts: true,
    audioChimeEnabled: true,
    spotWalkInsAllowed: true,
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [auditHistory, setAuditHistory] = useState([]);

  // Modal States
  const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPendingRequestsOpen, setIsPendingRequestsOpen] = useState(false);
  const [isAuditHistoryOpen, setIsAuditHistoryOpen] = useState(false);
  const [isApprovalInfoOpen, setIsApprovalInfoOpen] = useState(false);
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);
  const [selectedPlanForEdit, setSelectedPlanForEdit] = useState(null);
  const [isAddFacilityModalOpen, setIsAddFacilityModalOpen] = useState(false);
  const [isEditBankModalOpen, setIsEditBankModalOpen] = useState(false);
  const [isEditSocialModalOpen, setIsEditSocialModalOpen] = useState(false);
  const [isAddHolidayModalOpen, setIsAddHolidayModalOpen] = useState(false);

  // Forms
  const [editForm] = Form.useForm();
  const [planForm] = Form.useForm();
  const [editPlanForm] = Form.useForm();
  const [facilityForm] = Form.useForm();
  const [bankForm] = Form.useForm();
  const [socialForm] = Form.useForm();
  const [holidayForm] = Form.useForm();

  // Helper to extract clean image url from backend format
  const extractImageUrl = (img) => {
    if (!img) return '';
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.fileData) return img.fileData;
    return '';
  };

  // Synchronize gym document into local states
  const applyGymData = useCallback((data) => {
    if (!data) return;
    setGymData(data);

    // Synchronize to Redux store
    dispatch(
      setGymProfile({
        id: data.id || data.partnerId || data._id,
        partnerId: data.partnerId || 'GYM1',
        name: data.name || '',
        logo: extractImageUrl(data.logo) || extractImageUrl(data.coverPhoto),
        coverPhoto: extractImageUrl(data.coverPhoto) || extractImageUrl(data.logo),
        branch: data.area ? `${data.area}, ${data.city || ''}` : data.city || data.fullAddress || '',
        city: data.city || '',
        fullAddress: data.fullAddress || data.address || '',
        ownerName: data.ownerName || '',
        email: data.email || '',
        phone: data.phone || '',
        floorCapacity: data.maxFloorCapacity || 50,
        rating: data.rating || 4.9,
        totalReviews: data.reviewsCount || 0,
        monthlyRevenue: data.monthlyRevenue || 0,
        membersCount: data.membersCount || 0,
        facilities: data.facilities || [],
        amenities: data.amenities || [],
        workouts: data.workouts || [],
      })
    );

    // Facilities
    if (Array.isArray(data.customFacilities) && data.customFacilities.length > 0) {
      setFacilities(
        data.customFacilities.map((f, i) => ({
          id: f.id || `fac-${i}`,
          name: f.name || 'Facility',
          category: f.category || 'General',
          status: f.status || 'Active',
          count: f.count || 1,
          icon: getCategoryIcon(f.category),
        }))
      );
    } else if (Array.isArray(data.facilities) && data.facilities.length > 0) {
      setFacilities(
        data.facilities.map((facName, i) => ({
          id: `fac-${i}`,
          name: facName,
          category: 'General',
          status: 'Active',
          count: 1,
          icon: getCategoryIcon(facName),
        }))
      );
    } else {
      setFacilities([]);
    }

    // Workouts, Amenities, Rules & Safety
    setGymWorkouts(Array.isArray(data.workouts) ? data.workouts : []);
    setGymAmenities(Array.isArray(data.amenities) ? data.amenities : []);
    setGymRules(Array.isArray(data.rules) && data.rules.length > 0 ? data.rules : DEFAULT_RULES);
    setSafetyMeasures(Array.isArray(data.safetyMeasures) && data.safetyMeasures.length > 0 ? data.safetyMeasures : DEFAULT_SAFETY);

    // Pricing Plans
    if (Array.isArray(data.customPricingPlans) && data.customPricingPlans.length > 0) {
      setPricingPlans(data.customPricingPlans);
    } else if (data.pricingPlans && typeof data.pricingPlans === 'object') {
      const plansList = [];
      const p = data.pricingPlans;
      if (p.singleSession !== undefined) {
        plansList.push({
          id: 'plan-single',
          name: 'Walk-In Day Pass',
          badge: 'Walk-In',
          price: Number(p.singleSession) || 199,
          duration: '1 Day',
          description: 'Single day full access workout pass.',
          features: ['Gym Floor Access', 'Locker & Shower Access', 'Free Wi-Fi'],
          popular: false,
        });
      }
      if (p.weeklyPass !== undefined) {
        plansList.push({
          id: 'plan-weekly',
          name: 'Weekly Workout Pass',
          badge: 'Weekly',
          price: Number(p.weeklyPass) || 799,
          duration: '7 Days',
          description: 'One week unlimited gym access.',
          features: ['All Gym Floor Access', 'Locker Room Access', 'General Trainer Guidance'],
          popular: false,
        });
      }
      if (p.monthly !== undefined) {
        plansList.push({
          id: 'plan-monthly',
          name: '1-Month Membership',
          badge: 'Monthly',
          price: Number(p.monthly) || 1999,
          duration: '30 Days',
          description: 'Standard monthly fitness membership.',
          features: ['Unlimited Gym Access', 'General Trainer Support', 'Locker & Shower Access'],
          popular: false,
        });
      }
      if (p.quarterly !== undefined) {
        plansList.push({
          id: 'plan-quarterly',
          name: '3-Month Fitness Pro',
          badge: 'Quarterly',
          price: Number(p.quarterly) || 4999,
          duration: '90 Days',
          description: 'Quarterly workout pass with steam room access.',
          features: ['Unlimited Gym Access', '1 Free PT Session', 'Steam & Sauna Access', 'Diet Consultation'],
          popular: true,
        });
      }
      if (p.annual !== undefined) {
        plansList.push({
          id: 'plan-annual',
          name: '12-Month Annual VIP',
          badge: 'Annual VIP',
          price: Number(p.annual) || 14999,
          duration: '365 Days',
          description: 'All-inclusive annual membership pass.',
          features: ['All-Access 365 Days', '4 Free PT Sessions', 'Complete Diet Plan', 'Free Steam & Sauna'],
          popular: false,
        });
      }
      setPricingPlans(plansList);
    } else {
      setPricingPlans([]);
    }

    // Operating Hours
    if (data.openingHours?.schedule && Array.isArray(data.openingHours.schedule) && data.openingHours.schedule.length > 0) {
      setOperatingHours(data.openingHours.schedule);
    } else {
      const openW = data.openingHours?.weekdayOpen || '05:30 AM';
      const closeW = data.openingHours?.weekdayClose || '10:30 PM';
      const openWe = data.openingHours?.weekendOpen || '06:00 AM';
      const closeWe = data.openingHours?.weekendClose || '09:00 PM';
      setOperatingHours([
        { day: 'Monday', isOpen: true, openTime: openW, closeTime: closeW },
        { day: 'Tuesday', isOpen: true, openTime: openW, closeTime: closeW },
        { day: 'Wednesday', isOpen: true, openTime: openW, closeTime: closeW },
        { day: 'Thursday', isOpen: true, openTime: openW, closeTime: closeW },
        { day: 'Friday', isOpen: true, openTime: openW, closeTime: closeW },
        { day: 'Saturday', isOpen: true, openTime: openWe, closeTime: closeWe },
        { day: 'Sunday', isOpen: true, openTime: openWe, closeTime: closeWe },
      ]);
    }

    if (data.openingHours?.holidays && Array.isArray(data.openingHours.holidays)) {
      setHolidayExceptions(data.openingHours.holidays);
    } else {
      setHolidayExceptions([]);
    }

    setIs24HoursOpen(Boolean(data.openingHours?.is24Hours));
    setIsOpenHolidays(data.openingHours?.isOpenHolidays !== undefined ? Boolean(data.openingHours.isOpenHolidays) : true);
    setIsSplitShift(Boolean(data.openingHours?.isSplitShift));

    // Bank Details
    if (data.bankDetails) {
      setBankDetails({
        accountHolder: data.bankDetails.accountHolder || data.ownerName || '',
        bankName: data.bankDetails.bankName || '',
        accountNumber: data.bankDetails.accountNumber || '',
        ifscCode: data.bankDetails.ifscCode || '',
        accountType: data.bankDetails.accountType || 'Current Account',
        branch: data.bankDetails.branch || data.city || '',
        upiId: data.bankDetails.upiId || '',
        payoutSchedule: data.bankDetails.payoutSchedule || 'Daily T+1 Automated Direct Bank Deposit',
        gstInvoiceEnabled: data.bankDetails.gstInvoiceEnabled !== undefined ? Boolean(data.bankDetails.gstInvoiceEnabled) : true,
      });
    }

    // Social Links
    if (data.socialLinks) {
      setSocialLinks({
        instagram: data.socialLinks.instagram || '',
        instagramHandle: data.socialLinks.instagramHandle || '',
        facebook: data.socialLinks.facebook || '',
        youtube: data.socialLinks.youtube || '',
        whatsapp: data.socialLinks.whatsapp || data.phone || '',
        website: data.socialLinks.website || '',
        googleBusinessUrl: data.socialLinks.googleBusinessUrl || data.googleMapsUrl || '',
        googleRating: String(data.socialLinks.googleRating || data.rating || '4.9'),
        googleReviewCount: String(data.socialLinks.googleReviewCount || data.reviewsCount || '0'),
      });
    } else {
      setSocialLinks((prev) => ({
        ...prev,
        whatsapp: data.phone || '',
        googleRating: String(data.rating || '4.9'),
        googleReviewCount: String(data.reviewsCount || '0'),
        googleBusinessUrl: data.googleMapsUrl || '',
      }));
    }

    // System Settings
    if (data.systemSettings) {
      setSystemSettings({
        turnstileTimeout: data.systemSettings.turnstileTimeout || 5,
        renewalGracePeriod: data.systemSettings.renewalGracePeriod !== undefined ? data.systemSettings.renewalGracePeriod : 3,
        autoCheckoutHours: data.systemSettings.autoCheckoutHours || 2.5,
        smsCheckInAlerts: data.systemSettings.smsCheckInAlerts !== undefined ? data.systemSettings.smsCheckInAlerts : true,
        whatsappAlerts: data.systemSettings.whatsappAlerts !== undefined ? data.systemSettings.whatsappAlerts : true,
        audioChimeEnabled: data.systemSettings.audioChimeEnabled !== undefined ? data.systemSettings.audioChimeEnabled : true,
        spotWalkInsAllowed: data.systemSettings.spotWalkInsAllowed !== undefined ? data.systemSettings.spotWalkInsAllowed : true,
      });
    }

    // Audit History and Pending Requests
    if (Array.isArray(data.auditHistory)) {
      setAuditHistory(data.auditHistory);
      const pendingLogs = data.auditHistory.filter(
        (log) => log.approvalStatus === 'Pending Approval' || log.approvalStatus === 'Pending Admin Review'
      );
      setPendingRequests(pendingLogs);
    } else if (data.pendingChanges) {
      setPendingRequests([
        {
          id: 'REQ-LIVE',
          field: 'Profile Modifications',
          requestedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          approvalStatus: 'Pending Admin Review',
        },
      ]);
    } else {
      setPendingRequests([]);
      setAuditHistory([]);
    }
  }, [dispatch]);

  // Fetch Gym Profile from Backend API
  const fetchGymProfile = useCallback(async () => {
    if (!targetGymId) return;
    setIsLoadingProfile(true);
    try {
      const res = await apiClient.get(`/gyms/${targetGymId}`);
      const payload = res.data?.data || res.data;
      if (payload) {
        applyGymData(payload);
      }
    } catch (err) {
      console.error('Failed to fetch gym profile from backend:', err);
      // If error, check if we have Redux cache to fall back
      if (gymProfileFromRedux) {
        applyGymData(gymProfileFromRedux);
      }
    } finally {
      setIsLoadingProfile(false);
    }
  }, [targetGymId, applyGymData, gymProfileFromRedux]);

  useEffect(() => {
    fetchGymProfile();
  }, [fetchGymProfile]);

  // Dynamic Profile Completion Calculation
  const profileCompletionStats = useMemo(() => {
    const checks = [
      { key: 'basic', label: 'Basic Information', done: Boolean(gymData?.name && gymData?.phone && gymData?.email), tab: 'basic' },
      { key: 'address', label: 'Address & Location', done: Boolean(gymData?.address || gymData?.fullAddress || gymData?.city), tab: 'basic' },
      { key: 'facilities', label: 'Facilities & Equipment', done: facilities.length > 0, tab: 'facilities' },
      { key: 'pricing', label: 'Pricing & Passes', done: pricingPlans.length > 0, tab: 'pricing' },
      { key: 'images', label: 'Images & Photos', done: Boolean(extractImageUrl(gymData?.logo) || extractImageUrl(gymData?.coverPhoto) || (gymData?.galleryPhotos && gymData.galleryPhotos.length > 0)), tab: 'images' },
      { key: 'hours', label: 'Operating Hours', done: operatingHours.length > 0, tab: 'hours' },
      { key: 'bank', label: 'Bank Details', done: Boolean(bankDetails.accountNumber && bankDetails.ifscCode), tab: 'bank' },
      { key: 'social', label: 'Social Links', done: Boolean(socialLinks.instagramHandle || socialLinks.website || socialLinks.whatsapp), tab: 'social' },
    ];
    const completedCount = checks.filter((c) => c.done).length;
    const percentage = Math.round((completedCount / checks.length) * 100);
    return { checks, percentage };
  }, [gymData, facilities, pricingPlans, operatingHours, bankDetails, socialLinks]);

  // Save Gym Updates to Backend API
  const saveGymToBackend = async (updatePayload, successMsg = 'Changes submitted successfully! Pending Super Admin approval.') => {
    if (!targetGymId) {
      message.error('Gym ID not detected. Please login again.');
      return null;
    }
    try {
      const res = await apiClient.put(`/gyms/${targetGymId}`, updatePayload);
      const updatedGym = res.data?.data || res.data;
      if (updatedGym) {
        applyGymData(updatedGym);
      }
      message.success(res.data?.message || successMsg);
      return updatedGym;
    } catch (err) {
      console.error('Failed to update gym profile:', err);
      message.error(err.message || 'Failed to update gym profile.');
      return null;
    }
  };

  // Submit Basic Info Edits Form
  const handleEditSubmit = async (values) => {
    setIsSavingBasic(true);
    try {
      const payload = {
        name: values.name,
        ownerName: values.ownerName,
        phone: values.phone,
        email: values.email,
        businessType: values.businessType,
        yearEstablished: values.yearEstablished,
        gstNumber: values.gstNumber,
        panNumber: values.panNumber,
        address: values.address,
        area: values.area,
        city: values.city,
        state: values.state,
        pincode: values.pincode,
        landmark: values.landmark,
        floorSpaceSqFt: Number(values.floorSpaceSqFt) || 0,
        maxFloorCapacity: Number(values.maxFloorCapacity) || 0,
        genderAllowed: values.genderAllowed,
        aboutText: values.aboutText,
      };
      const res = await saveGymToBackend(payload, 'Gym profile information updated successfully!');
      if (res) {
        setIsEditModalOpen(false);
      }
    } finally {
      setIsSavingBasic(false);
    }
  };

  // Cover Banner Photo Upload
  const handleCoverPhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (re) => {
          const newCover = re.target?.result;
          setIsUploadingMedia(true);
          try {
            await saveGymToBackend({ coverPhoto: newCover }, 'Cover banner photo updated successfully!');
          } finally {
            setIsUploadingMedia(false);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Brand Logo Upload
  const handleLogoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (re) => {
          const newLogo = re.target?.result;
          setIsUploadingMedia(true);
          try {
            await saveGymToBackend({ logo: newLogo }, 'Brand logo updated successfully!');
          } finally {
            setIsUploadingMedia(false);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Gallery Photos Upload
  const handleGalleryUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      setIsUploadingMedia(true);
      try {
        const base64List = await Promise.all(
          files.map(
            (file) =>
              new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (re) => resolve(re.target?.result);
                reader.readAsDataURL(file);
              })
          )
        );

        const currentGallery = (gymData?.galleryPhotos || []).map((img) => extractImageUrl(img)).filter(Boolean);
        const combined = [...currentGallery, ...base64List];

        await saveGymToBackend({ galleryPhotos: combined }, `${files.length} photo(s) uploaded to gallery successfully!`);
      } finally {
        setIsUploadingMedia(false);
      }
    };
    input.click();
  };

  // Gallery Photo Delete
  const handleDeleteGalleryPhoto = async (indexToDelete) => {
    const currentGallery = (gymData?.galleryPhotos || []).map((img) => extractImageUrl(img)).filter(Boolean);
    const updated = currentGallery.filter((_, idx) => idx !== indexToDelete);
    await saveGymToBackend({ galleryPhotos: updated }, 'Photo removed from gallery.');
  };

  // Save Operating Hours Schedule
  const handleSaveOperatingHours = async () => {
    setIsSavingHours(true);
    try {
      const payload = {
        weekdayOpen: operatingHours[0]?.openTime || '05:30 AM',
        weekdayClose: operatingHours[0]?.closeTime || '10:30 PM',
        weekendOpen: operatingHours[5]?.openTime || '06:00 AM',
        weekendClose: operatingHours[5]?.closeTime || '09:00 PM',
        displayText: `${operatingHours[0]?.openTime || '05:30 AM'} - ${operatingHours[0]?.closeTime || '10:30 PM'}`,
        schedule: operatingHours,
        holidays: holidayExceptions,
        is24Hours: is24HoursOpen,
        isOpenHolidays: isOpenHolidays,
        isSplitShift: isSplitShift,
      };
      await saveGymToBackend({ openingHours: payload, ...payload }, 'Operating hours and weekly schedule saved!');
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.85 } });
      } catch {
        // Confetti silent fail
      }
    } finally {
      setIsSavingHours(false);
    }
  };

  // Add Special Holiday / Blackout Exception
  const handleAddHoliday = async (vals) => {
    const formattedDate = vals.date
      ? typeof vals.date === 'string'
        ? vals.date
        : vals.date.format('DD MMM YYYY')
      : 'Upcoming Date';

    const newEx = {
      id: `hol-${Date.now()}`,
      date: formattedDate,
      title: vals.title,
      type: vals.type || 'Closed',
      hours: vals.type === 'Closed' ? 'Full Day Closed' : vals.hours || '06:00 AM - 12:00 PM',
      notes: vals.notes || 'Special holiday schedule rule',
    };

    const updatedHolidays = [newEx, ...holidayExceptions];
    setHolidayExceptions(updatedHolidays);
    setIsAddHolidayModalOpen(false);
    holidayForm.resetFields();

    await saveGymToBackend(
      {
        openingHours: {
          ...(gymData?.openingHours || {}),
          holidays: updatedHolidays,
        },
        holidays: updatedHolidays,
      },
      `Special holiday rule "${vals.title}" added!`
    );
  };

  // Delete Holiday Exception
  const handleDeleteHoliday = async (holidayId) => {
    const updated = holidayExceptions.filter((h) => h.id !== holidayId);
    setHolidayExceptions(updated);
    await saveGymToBackend(
      {
        openingHours: {
          ...(gymData?.openingHours || {}),
          holidays: updated,
        },
        holidays: updated,
      },
      'Holiday exception rule removed.'
    );
  };

  // Add Facility Spec
  const handleAddFacility = async (vals) => {
    setIsSavingFacility(true);
    try {
      const newFac = {
        id: `fac-${Date.now()}`,
        name: vals.name,
        category: vals.category || 'General',
        status: 'Active',
        count: vals.count || 1,
        icon: getCategoryIcon(vals.category),
      };
      const updatedList = [...facilities, newFac];
      setFacilities(updatedList);

      const customFacPayload = updatedList.map((f) => ({
        id: f.id,
        name: f.name,
        category: f.category,
        status: f.status,
        count: f.count,
      }));

      await saveGymToBackend(
        {
          customFacilities: customFacPayload,
          facilities: updatedList.map((f) => f.name),
        },
        `Facility "${newFac.name}" added successfully!`
      );
      setIsAddFacilityModalOpen(false);
      facilityForm.resetFields();
    } finally {
      setIsSavingFacility(false);
    }
  };

  // Delete Facility
  const handleDeleteFacility = async (facilityId) => {
    const updatedList = facilities.filter((f) => f.id !== facilityId);
    setFacilities(updatedList);
    const customFacPayload = updatedList.map((f) => ({
      id: f.id,
      name: f.name,
      category: f.category,
      status: f.status,
      count: f.count,
    }));
    await saveGymToBackend(
      {
        customFacilities: customFacPayload,
        facilities: updatedList.map((f) => f.name),
      },
      'Facility removed.'
    );
  };

  // Add Pricing Tier
  const handleAddPlan = async (vals) => {
    setIsSavingPricing(true);
    try {
      const newFeatures = vals.features
        ? vals.features
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean)
        : ['All Gym Floor Access', 'Locker Room Access', 'Free Wi-Fi'];

      const newPlan = {
        id: `plan-${Date.now()}`,
        name: vals.name,
        badge: vals.badge || 'Monthly',
        price: Number(vals.price) || 0,
        duration: vals.duration || '30 Days',
        description: vals.description || 'Standard membership workout plan.',
        features: newFeatures,
        popular: vals.popular || false,
      };

      const updatedPlans = [...pricingPlans, newPlan];
      setPricingPlans(updatedPlans);

      await saveGymToBackend(
        {
          customPricingPlans: updatedPlans,
        },
        `Membership plan "${newPlan.name}" created successfully!`
      );
      setIsAddPlanModalOpen(false);
      planForm.resetFields();
    } finally {
      setIsSavingPricing(false);
    }
  };

  // Edit Pricing Tier
  const handleEditPlan = async (vals) => {
    setIsSavingPricing(true);
    try {
      const updatedFeatures = vals.features
        ? vals.features
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean)
        : selectedPlanForEdit?.features || [];

      const updatedPlans = pricingPlans.map((p) =>
        p.id === selectedPlanForEdit?.id
          ? {
            ...p,
            name: vals.name,
            badge: vals.badge,
            price: Number(vals.price),
            duration: vals.duration,
            description: vals.description,
            features: updatedFeatures,
            popular: vals.popular,
          }
          : p
      );
      setPricingPlans(updatedPlans);

      await saveGymToBackend(
        {
          customPricingPlans: updatedPlans,
        },
        `Plan "${vals.name}" updated successfully!`
      );
      setIsEditPlanModalOpen(false);
    } finally {
      setIsSavingPricing(false);
    }
  };

  // Delete Pricing Tier
  const handleDeletePlan = async (planId) => {
    const updatedPlans = pricingPlans.filter((p) => p.id !== planId);
    setPricingPlans(updatedPlans);
    await saveGymToBackend(
      {
        customPricingPlans: updatedPlans,
      },
      'Membership plan removed.'
    );
  };

  // Save Workouts, Amenities, Rules & Safety
  const handleSaveWorkoutsRules = async () => {
    setIsSavingWorkoutsRules(true);
    try {
      await saveGymToBackend(
        {
          workouts: gymWorkouts,
          amenities: gymAmenities,
          rules: gymRules,
          safetyMeasures: safetyMeasures,
        },
        'Workouts, amenities, rules & safety measures saved!'
      );
    } finally {
      setIsSavingWorkoutsRules(false);
    }
  };

  const handleAddRule = () => {
    if (!newRuleInput.trim()) return;
    setGymRules((prev) => [...prev, newRuleInput.trim()]);
    setNewRuleInput('');
  };

  const handleDeleteRule = (idx) => {
    setGymRules((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddSafety = () => {
    if (!newSafetyInput.trim()) return;
    setSafetyMeasures((prev) => [...prev, newSafetyInput.trim()]);
    setNewSafetyInput('');
  };

  const handleDeleteSafety = (idx) => {
    setSafetyMeasures((prev) => prev.filter((_, i) => i !== idx));
  };

  // Save Bank Settlement Details
  const handleSaveBank = async (vals) => {
    setIsSavingBank(true);
    try {
      const newBank = { ...bankDetails, ...vals };
      setBankDetails(newBank);
      await saveGymToBackend({ bankDetails: newBank }, 'Bank settlement details updated successfully!');
      setIsEditBankModalOpen(false);
    } finally {
      setIsSavingBank(false);
    }
  };

  // Save Social Media Links
  const handleSaveSocial = async (vals) => {
    setIsSavingSocial(true);
    try {
      const newSocial = { ...socialLinks, ...vals };
      setSocialLinks(newSocial);
      await saveGymToBackend({ socialLinks: newSocial }, 'Social media handles and online links updated!');
      setIsEditSocialModalOpen(false);
    } finally {
      setIsSavingSocial(false);
    }
  };

  // Save System Settings
  const handleSaveSettings = async (updatedSettings) => {
    setSystemSettings(updatedSettings);
    await saveGymToBackend({ systemSettings: updatedSettings }, 'Turnstile and system preferences saved!');
  };

  const gymName = gymData?.name || gymProfileFromRedux?.name || 'My Gym';
  const gymStatus = gymData?.approvalStatus || gymData?.status || 'Active';
  const gymLogoUrl = extractImageUrl(gymData?.logo) || extractImageUrl(gymData?.coverPhoto) || '';
  const gymCoverUrl = extractImageUrl(gymData?.coverPhoto) || extractImageUrl(gymData?.logo) || '';
  const galleryPhotosList = (gymData?.galleryPhotos || []).map((img) => extractImageUrl(img)).filter(Boolean);

  const editMenu = {
    items: [
      {
        key: 'pending_changes',
        label: (
          <div
            onClick={() => {
              setIsEditDropdownOpen(false);
              setIsPendingRequestsOpen(true);
            }}
            style={{
              padding: '10px 12px',
              minWidth: 260,
              borderRadius: 'var(--radius-base)',
              backgroundColor: isDarkMode ? 'rgba(250, 140, 22, 0.12)' : '#fef4e8',
              border: `1px solid ${isDarkMode ? 'rgba(250, 140, 22, 0.3)' : 'rgba(250, 140, 22, 0.25)'}`,
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fa8c16', fontWeight: 700, fontSize: 13 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ClockCircleOutlined /> Pending Changes
              </div>
              <Tag color="warning" style={{ margin: 0, fontSize: 10, borderRadius: 4, padding: '0 5px', lineHeight: '16px', fontWeight: 700 }}>
                {pendingRequests.length} Pending
              </Tag>
            </div>
            <div style={{ fontSize: 11.5, color: isDarkMode ? '#dddddd' : '#64748b', marginTop: 4, lineHeight: 1.35 }}>
              You have {pendingRequests.length} pending change request(s) under review.
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--color-primary)',
                fontWeight: 700,
                marginTop: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              View Requests <ArrowRightOutlined style={{ fontSize: 10 }} />
            </div>
          </div>
        ),
      },
      {
        type: 'divider',
      },
      {
        key: 'audit_history',
        label: (
          <div
            onClick={() => {
              setIsEditDropdownOpen(false);
              setIsAuditHistoryOpen(true);
            }}
            style={{
              padding: '8px 12px',
              minWidth: 260,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
              <AuditOutlined style={{ color: 'var(--color-primary)' }} /> Audit History Log
            </div>
            <Tag style={{ margin: 0, fontSize: 11 }}>{auditHistory.length}</Tag>
          </div>
        ),
      },
      {
        type: 'divider',
      },
      {
        key: 'request_edit',
        label: (
          <div style={{ padding: '6px 4px', minWidth: 260 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
              Edit Gym Profile Information
            </div>
            <div style={{ fontSize: 11.5, color: isDarkMode ? '#888888' : '#64748b', marginTop: 3, lineHeight: 1.35 }}>
              Update legal credentials, address, facilities, or contact numbers.
            </div>
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditDropdownOpen(false);
                editForm.setFieldsValue({
                  name: gymData?.name || '',
                  ownerName: gymData?.ownerName || '',
                  phone: gymData?.phone || '',
                  email: gymData?.email || '',
                  businessType: gymData?.businessType || 'Private Limited',
                  yearEstablished: gymData?.yearEstablished || '',
                  gstNumber: gymData?.gstNumber || '',
                  panNumber: gymData?.panNumber || '',
                  address: gymData?.address || gymData?.fullAddress || '',
                  area: gymData?.area || '',
                  city: gymData?.city || '',
                  state: gymData?.state || 'Tamil Nadu',
                  pincode: gymData?.pincode || '',
                  landmark: gymData?.landmark || '',
                  floorSpaceSqFt: gymData?.floorSpaceSqFt || '',
                  maxFloorCapacity: gymData?.maxFloorCapacity || '',
                  genderAllowed: gymData?.genderAllowed || 'Unisex',
                  aboutText: gymData?.aboutText || '',
                });
                setIsEditModalOpen(true);
              }}
              style={{
                marginTop: 10,
                width: '100%',
                borderRadius: 'var(--radius-base)',
                fontWeight: 600,
                fontSize: 12,
                backgroundColor: 'var(--color-primary)',
                height: 32,
              }}
            >
              Edit Profile
            </Button>
          </div>
        ),
      },
    ],
  };

  const TABS_LIST = [
    { key: 'basic', label: 'Basic Information' },
    { key: 'facilities', label: 'Facilities' },
    { key: 'workouts', label: 'Workouts & Rules' },
    { key: 'pricing', label: 'Pricing' },
    { key: 'images', label: 'Images' },
    { key: 'hours', label: 'Operating Hours' },
    { key: 'bank', label: 'Bank Details' },
    { key: 'social', label: 'Social Links' },
    { key: 'settings', label: 'Settings' },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', paddingBottom: 40 }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Title level={2} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a', fontWeight: 700 }}>
              Gym Profile
            </Title>
            {gymData?.partnerId && (
              <Tag color="blue" style={{ fontSize: 12, fontWeight: 700, borderRadius: 'var(--radius-base)', padding: '2px 8px' }}>
                ID: {gymData.partnerId}
              </Tag>
            )}
            <Tag
              color={
                gymStatus === 'Approved' || gymStatus === 'Active'
                  ? 'success'
                  : gymStatus === 'Pending Approval' || gymStatus === 'Pending'
                    ? 'warning'
                    : 'default'
              }
              style={{ fontWeight: 700, borderRadius: 'var(--radius-base)', padding: '2px 8px' }}
            >
              {gymStatus}
            </Tag>
          </div>
          <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 14 }}>
            Manage your verified gym credentials, floor facilities, pricing plans, schedule, and online presence.
          </Text>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Button
            icon={<ReloadOutlined spin={isLoadingProfile} />}
            onClick={fetchGymProfile}
            disabled={isLoadingProfile}
            style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}
          >
            Refresh
          </Button>

          {/* Edit Profile Split / Dropdown Action */}
          <Dropdown
            menu={editMenu}
            open={isEditDropdownOpen}
            onOpenChange={setIsEditDropdownOpen}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="primary"
              icon={<EditOutlined />}
              style={{
                backgroundColor: 'var(--color-primary)',
                borderColor: 'var(--color-primary)',
                borderRadius: 'var(--radius-base)',
                fontWeight: 600,
                height: 40,
                padding: '0 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>Edit Profile</span>
              <DownOutlined style={{ fontSize: 10 }} />
            </Button>
          </Dropdown>
        </div>
      </div>

      {/* Pending Changes Alert Banner */}
      {Boolean(
        (gymData?.pendingChanges && Object.keys(gymData.pendingChanges).length > 0) ||
        pendingRequests.length > 0
      ) && (
          <Alert
            type="warning"
            showIcon
            message="Profile Modifications Pending Super Admin Approval"
            description={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <span>
                  Your recent changes ({gymData?.pendingChanges ? Object.keys(gymData.pendingChanges).length : pendingRequests.length} field(s) updated) have been submitted to the Super Administrator. Once approved, the changes will reflect live on your public profile.
                </span>
                <Button
                  size="small"
                  type="primary"
                  ghost
                  onClick={() => setIsPendingRequestsOpen(true)}
                  style={{ fontWeight: 600 }}
                >
                  View Pending Requests
                </Button>
              </div>
            }
            style={{ marginBottom: 20, borderRadius: 'var(--radius-base)' }}
          />
        )}

      {/* Navigation Tabs Bar */}
      <div
        style={{
          marginBottom: 24,
          borderBottom: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`,
          display: 'flex',
          gap: 24,
          overflowX: 'auto',
          paddingBottom: 2,
        }}
      >
        {TABS_LIST.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <div
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '8px 4px 12px 4px',
                fontSize: 13.5,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-primary)' : isDarkMode ? '#888888' : '#64748b',
                borderBottom: isActive ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </div>
          );
        })}
      </div>

      {isLoadingProfile && !gymData ? (
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, color: isDarkMode ? '#aaaaaa' : '#64748b', fontSize: 14 }}>
            Loading Gym Profile from Server...
          </div>
        </div>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* TAB 1: BASIC INFORMATION (HERO + PROFILE COMPLETION + ABOUT + STATS) */}
          {/* ========================================================================= */}
          {activeTab === 'basic' && (
            <div>
              {/* TOP ROW: HERO GYM OVERVIEW CARD + PROFILE COMPLETION */}
              <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
                {/* Hero Gym Overview Card */}
                <Col xs={24} lg={16}>
                  <Card
                    style={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-color)',
                      borderRadius: 'var(--radius-base)',
                      boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
                      height: '100%',
                    }}
                    styles={{ body: { padding: '20px' } }}
                  >
                    <Row gutter={[20, 16]} align="top">
                      {/* Gym Cover Photo with Change Photo Overlay */}
                      <Col xs={24} sm={9}>
                        <div
                          style={{
                            position: 'relative',
                            borderRadius: 'var(--radius-base)',
                            overflow: 'hidden',
                            height: 180,
                            width: '100%',
                            backgroundColor: isDarkMode ? '#1e1e1e' : '#f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {gymCoverUrl ? (
                            <img
                              src={gymCoverUrl}
                              alt={gymName}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ textAlign: 'center', color: isDarkMode ? '#666666' : '#94a3b8' }}>
                              <PictureOutlined style={{ fontSize: 32, marginBottom: 6 }} />
                              <div style={{ fontSize: 12 }}>No Cover Photo</div>
                            </div>
                          )}
                          <div
                            onClick={handleCoverPhotoUpload}
                            style={{
                              position: 'absolute',
                              bottom: 10,
                              left: 10,
                              right: 10,
                              padding: '6px 12px',
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              backdropFilter: 'blur(4px)',
                              borderRadius: 'var(--radius-base)',
                              color: '#ffffff',
                              fontSize: 11.5,
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 6,
                              cursor: 'pointer',
                            }}
                          >
                            <CameraOutlined /> {isUploadingMedia ? 'Uploading...' : 'Change Cover Photo'}
                          </div>
                        </div>
                      </Col>

                      {/* Gym Main Details */}
                      <Col xs={24} sm={15}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                          <div
                            style={{
                              position: 'relative',
                              width: 54,
                              height: 54,
                              borderRadius: 'var(--radius-base)',
                              overflow: 'hidden',
                              border: `2px solid ${isDarkMode ? '#333333' : '#dbeafe'}`,
                              backgroundColor: isDarkMode ? '#1e1e1e' : '#edf4fe',
                              flexShrink: 0,
                              cursor: 'pointer',
                            }}
                            onClick={handleLogoUpload}
                            title="Click to Upload Brand Logo"
                          >
                            {gymLogoUrl ? (
                              <img
                                src={gymLogoUrl}
                                alt="Gym Logo"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'var(--color-primary)',
                                  fontWeight: 800,
                                  fontSize: 18,
                                }}
                              >
                                {gymName.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ffffff',
                                fontSize: 14,
                                opacity: 0.8,
                              }}
                            >
                              <CameraOutlined />
                            </div>
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 20, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                                {gymName}
                              </span>
                              <Tag color="success" style={{ fontWeight: 700, borderRadius: 'var(--radius-base)', padding: '2px 8px' }}>
                                {gymStatus}
                              </Tag>
                            </div>
                            <div
                              onClick={handleLogoUpload}
                              style={{
                                fontSize: 11.5,
                                color: 'var(--color-primary)',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                marginTop: 2,
                              }}
                            >
                              <CameraOutlined /> Upload Brand Logo
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: isDarkMode ? '#aaaaaa' : '#64748b', fontSize: 12.5, marginBottom: 6 }}>
                          <EnvironmentOutlined style={{ color: 'var(--color-primary)' }} />
                          <span>{gymData?.area ? `${gymData.area}, ${gymData.city || ''}` : gymData?.address || gymData?.city || 'Address not configured'}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: isDarkMode ? '#aaaaaa' : '#64748b', fontSize: 12.5, marginBottom: 6 }}>
                          <PhoneOutlined style={{ color: 'var(--color-primary)' }} />
                          <span>{gymData?.phone || 'Phone not provided'}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: isDarkMode ? '#aaaaaa' : '#64748b', fontSize: 12.5, marginBottom: 12 }}>
                          <MailOutlined style={{ color: 'var(--color-primary)' }} />
                          <span>{gymData?.email || 'Email not provided'}</span>
                        </div>

                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <Tag color="purple" style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}>
                            {gymData?.businessType || 'Private Limited'}
                          </Tag>
                          <Tag color="blue" style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}>
                            {gymData?.genderAllowed || 'Unisex'}
                          </Tag>
                          {gymData?.yearEstablished && (
                            <Tag color="cyan" style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}>
                              Est. {gymData.yearEstablished}
                            </Tag>
                          )}
                          {gymData?.gstNumber && (
                            <Tag color="orange" style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}>
                              GST: {gymData.gstNumber}
                            </Tag>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>

                {/* Profile Completion Card */}
                <Col xs={24} lg={8}>
                  <Card
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                          Profile Completion
                        </span>
                        <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-primary)' }}>
                          {profileCompletionStats.percentage}%
                        </span>
                      </div>
                    }
                    style={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-color)',
                      borderRadius: 'var(--radius-base)',
                      height: '100%',
                    }}
                    styles={{ body: { padding: '16px 20px' } }}
                  >
                    <Progress
                      percent={profileCompletionStats.percentage}
                      showInfo={false}
                      strokeColor="var(--color-primary)"
                      trailColor={isDarkMode ? '#222222' : '#f1f5f9'}
                      style={{ marginBottom: 14 }}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {profileCompletionStats.checks.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {item.done ? (
                              <CheckCircleFilled style={{ color: '#00bf62', fontSize: 14 }} />
                            ) : (
                              <span
                                style={{
                                  width: 14,
                                  height: 14,
                                  borderRadius: '50%',
                                  border: `2px solid ${isDarkMode ? '#555555' : '#cbd5e1'}`,
                                }}
                              />
                            )}
                            <span style={{ color: isDarkMode ? '#cccccc' : '#334155', fontWeight: item.done ? 500 : 400 }}>
                              {item.label}
                            </span>
                          </div>
                          <span
                            onClick={() => setActiveTab(item.tab)}
                            style={{ fontSize: 11.5, color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Edit
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* MIDDLE ROW: ABOUT GYM, GALLERY, AND GYM STATISTICS */}
              <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
                {/* Left Column: About Gym, Gallery, Address, Description */}
                <Col xs={24} lg={16}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* 1. About Gym & Gallery in a Row */}
                    <Row gutter={[16, 16]}>
                      {/* About Gym */}
                      <Col xs={24} md={12}>
                        <Card
                          title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                              <FileTextOutlined style={{ color: 'var(--color-primary)' }} /> About Gym
                            </div>
                          }
                          style={{
                            backgroundColor: 'var(--bg-surface-elevated)',
                            borderColor: 'var(--border-color)',
                            borderRadius: 'var(--radius-base)',
                            height: '100%',
                          }}
                          styles={{ body: { padding: '16px' } }}
                        >
                          <Paragraph style={{ fontSize: 12.5, color: isDarkMode ? '#aaaaaa' : '#64748b', lineHeight: 1.5, marginBottom: 14, minHeight: 60 }}>
                            {gymData?.aboutText || gymData?.description || 'No about summary added yet. Click Edit Profile to describe your facility and fitness mission.'}
                          </Paragraph>
                          <div style={{ borderTop: `1px solid ${isDarkMode ? '#222222' : '#f1f5f9'}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                            <span style={{ color: isDarkMode ? '#888888' : '#94a3b8' }}>
                              Owner: {gymData?.ownerName || 'Verified Partner'}
                            </span>
                            <span style={{ color: isDarkMode ? '#888888' : '#94a3b8' }}>
                              Status: {gymStatus}
                            </span>
                          </div>
                        </Card>
                      </Col>

                      {/* Gallery Manager Preview */}
                      <Col xs={24} md={12}>
                        <Card
                          title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                              <PictureOutlined style={{ color: 'var(--color-primary)' }} /> Gallery ({galleryPhotosList.length})
                            </div>
                          }
                          extra={
                            <span
                              onClick={() => setActiveTab('images')}
                              style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}
                            >
                              Manage All
                            </span>
                          }
                          style={{
                            backgroundColor: 'var(--bg-surface-elevated)',
                            borderColor: 'var(--border-color)',
                            borderRadius: 'var(--radius-base)',
                            height: '100%',
                          }}
                          styles={{ body: { padding: '16px' } }}
                        >
                          {galleryPhotosList.length > 0 ? (
                            <Row gutter={[8, 8]}>
                              {galleryPhotosList.slice(0, 6).map((img, idx) => (
                                <Col span={8} key={idx}>
                                  <img
                                    src={img}
                                    alt={`gallery-thumb-${idx}`}
                                    style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 'var(--radius-base)', cursor: 'pointer' }}
                                    onClick={() => setActiveTab('images')}
                                  />
                                </Col>
                              ))}
                            </Row>
                          ) : (
                            <div style={{ textAlign: 'center', padding: '18px 0', color: isDarkMode ? '#666666' : '#94a3b8' }}>
                              <PictureOutlined style={{ fontSize: 24, marginBottom: 4 }} />
                              <div style={{ fontSize: 12 }}>No photos uploaded yet</div>
                              <Button
                                size="small"
                                type="link"
                                onClick={handleGalleryUpload}
                                style={{ fontSize: 12, padding: 0, marginTop: 4 }}
                              >
                                Upload Photos
                              </Button>
                            </div>
                          )}
                        </Card>
                      </Col>
                    </Row>

                    {/* 2. Gym Address & Location */}
                    <Card
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                          <EnvironmentOutlined style={{ color: 'var(--color-primary)' }} /> Gym Address & Location
                        </div>
                      }
                      style={{
                        backgroundColor: 'var(--bg-surface-elevated)',
                        borderColor: 'var(--border-color)',
                        borderRadius: 'var(--radius-base)',
                      }}
                      styles={{ body: { padding: '16px' } }}
                    >
                      <Text style={{ fontSize: 13, color: isDarkMode ? '#cccccc' : '#334155' }}>
                        {gymData?.fullAddress || gymData?.address || `${gymData?.area || ''} ${gymData?.city || ''}`}
                      </Text>
                      <div
                        style={{
                          marginTop: 12,
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-base)',
                          backgroundColor: isDarkMode ? '#1e1e1e' : '#f8fafc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: 10,
                          fontSize: 12,
                          border: `1px solid ${isDarkMode ? '#333333' : '#e2e8f0'}`,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: isDarkMode ? '#aaaaaa' : '#64748b' }}>
                          <EnvironmentOutlined style={{ color: 'var(--color-primary)', fontSize: 15 }} />
                          <span>
                            {gymData?.city || 'City not set'} • {gymData?.state || 'Tamil Nadu'} • Pincode: {gymData?.pincode || '—'}
                          </span>
                        </div>
                        {gymData?.googleMapsUrl && (
                          <a
                            href={gymData.googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <GlobalOutlined /> Open on Maps
                          </a>
                        )}
                      </div>
                    </Card>

                    {/* 3. Detailed Business Specification Grid */}
                    <Card
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                          <ShopOutlined style={{ color: 'var(--color-primary)' }} /> Business Information
                        </div>
                      }
                      style={{
                        backgroundColor: 'var(--bg-surface-elevated)',
                        borderColor: 'var(--border-color)',
                        borderRadius: 'var(--radius-base)',
                      }}
                      styles={{ body: { padding: '16px 20px' } }}
                    >
                      <Row gutter={[20, 16]}>
                        {[
                          { label: 'GYM TYPE', val: gymData?.businessType || 'Private Limited' },
                          { label: 'GST NUMBER', val: gymData?.gstNumber || 'Not Specified' },
                          { label: 'PAN NUMBER', val: gymData?.panNumber || 'Not Specified' },
                          { label: 'ESTABLISHED ON', val: gymData?.yearEstablished ? `Est. ${gymData.yearEstablished}` : 'Not Specified' },
                          { label: 'FLOOR AREA', val: gymData?.floorSpaceSqFt ? `${gymData.floorSpaceSqFt} Sq.Ft` : 'Not Specified' },
                          { label: 'MAX FLOOR CAPACITY', val: gymData?.maxFloorCapacity ? `${gymData.maxFloorCapacity} Persons` : '50 Persons' },
                          { label: 'GENDER ALLOWED', val: gymData?.genderAllowed || 'Unisex' },
                          { label: 'ACTIVE FACILITIES', val: `${facilities.length} Categories` },
                        ].map((item, idx) => (
                          <Col xs={12} sm={6} key={idx}>
                            <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', fontWeight: 600 }}>{item.label}</div>
                            <div style={{ fontSize: 13.5, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', marginTop: 2 }}>
                              {item.val}
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  </div>
                </Col>

                {/* Right Column: Gym Statistics */}
                <Col xs={24} lg={8}>
                  <Card
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                        <BarChartOutlined style={{ color: 'var(--color-primary)' }} /> Facility Statistics
                      </div>
                    }
                    style={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-color)',
                      borderRadius: 'var(--radius-base)',
                      boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
                    }}
                    styles={{ body: { padding: '16px' } }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {/* Stat 1: Total Registered Members */}
                      <div style={{ padding: '12px', borderRadius: 'var(--radius-base)', backgroundColor: isDarkMode ? '#141414' : '#f8fafc', border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: isDarkMode ? 'rgba(0, 56, 130, 0.3)' : '#e6f4ff', color: '#003882', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                            <TeamOutlined />
                          </div>
                          <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>Members</div>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                          {gymData?.membersCount || 0}
                        </div>
                        <div style={{ fontSize: 10.5, color: '#00bf62', fontWeight: 600, marginTop: 2 }}>Registered</div>
                      </div>

                      {/* Stat 2: Max Capacity */}
                      <div style={{ padding: '12px', borderRadius: 'var(--radius-base)', backgroundColor: isDarkMode ? '#141414' : '#f8fafc', border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: isDarkMode ? 'rgba(114, 46, 209, 0.2)' : '#f3effe', color: '#722ed1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                            <UserOutlined />
                          </div>
                          <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>Floor Capacity</div>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                          {gymData?.maxFloorCapacity || 50}
                        </div>
                        <div style={{ fontSize: 10.5, color: 'var(--color-primary)', fontWeight: 600, marginTop: 2 }}>Max Limit</div>
                      </div>

                      {/* Stat 3: Floor Space */}
                      <div style={{ padding: '12px', borderRadius: 'var(--radius-base)', backgroundColor: isDarkMode ? '#141414' : '#f8fafc', border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: isDarkMode ? 'rgba(0, 191, 98, 0.2)' : '#eaf8ef', color: '#00bf62', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                            <ShopOutlined />
                          </div>
                          <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>Floor Area</div>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                          {gymData?.floorSpaceSqFt ? `${gymData.floorSpaceSqFt}` : '—'}
                        </div>
                        <div style={{ fontSize: 10.5, color: '#00bf62', fontWeight: 600, marginTop: 2 }}>Sq. Ft</div>
                      </div>

                      {/* Stat 4: Rating */}
                      <div style={{ padding: '12px', borderRadius: 'var(--radius-base)', backgroundColor: isDarkMode ? '#141414' : '#f8fafc', border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: isDarkMode ? 'rgba(250, 140, 22, 0.2)' : '#fef4e8', color: '#fa8c16', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                            <StarFilled />
                          </div>
                          <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>Rating</div>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                          {gymData?.rating || '4.9'}
                        </div>
                        <div style={{ fontSize: 10.5, color: '#fa8c16', fontWeight: 600, marginTop: 2 }}>
                          {gymData?.reviewsCount || 0} Reviews
                        </div>
                      </div>

                      {/* Stat 5: Pricing Tiers */}
                      <div style={{ padding: '12px', borderRadius: 'var(--radius-base)', backgroundColor: isDarkMode ? '#141414' : '#f8fafc', border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: isDarkMode ? 'rgba(22, 119, 255, 0.2)' : '#edf4fe', color: '#1677ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                            <DollarOutlined />
                          </div>
                          <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>Active Plans</div>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                          {pricingPlans.length}
                        </div>
                        <div style={{ fontSize: 10.5, color: '#1677ff', fontWeight: 600, marginTop: 2 }}>Published</div>
                      </div>

                      {/* Stat 6: Revenue */}
                      <div style={{ padding: '12px', borderRadius: 'var(--radius-base)', backgroundColor: isDarkMode ? '#141414' : '#f8fafc', border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: isDarkMode ? 'rgba(0, 191, 98, 0.2)' : '#eaf8ef', color: '#00bf62', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                            <DollarCircleOutlined />
                          </div>
                          <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>Monthly Revenue</div>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                          ₹{Number(gymData?.monthlyRevenue || 0).toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: 10.5, color: '#00bf62', fontWeight: 600, marginTop: 2 }}>Live Status</div>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: FACILITIES & AMENITIES */}
          {/* ========================================================================= */}
          {activeTab === 'facilities' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <Title level={4} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    Facilities, Equipment & Amenities ({facilities.length})
                  </Title>
                  <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13 }}>
                    Showcase gym capabilities, workout equipment count, and studio amenities.
                  </Text>
                </div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsAddFacilityModalOpen(true)}
                  style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}
                >
                  Add Facility
                </Button>
              </div>

              {facilities.length > 0 ? (
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  {facilities.map((fac) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={fac.id}>
                      <Card
                        style={{
                          backgroundColor: 'var(--bg-surface-elevated)',
                          borderColor: 'var(--border-color)',
                          borderRadius: 'var(--radius-base)',
                          height: '100%',
                          position: 'relative',
                        }}
                        styles={{ body: { padding: '16px' } }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: 'var(--radius-base)',
                              backgroundColor: 'var(--color-primary-bg)',
                              color: 'var(--color-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 18,
                            }}
                          >
                            {fac.icon || <ToolOutlined />}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Tag color="success" style={{ fontWeight: 700, borderRadius: 4, margin: 0 }}>
                              {fac.status || 'Active'}
                            </Tag>
                            <Popconfirm
                              title="Delete Facility"
                              description={`Are you sure you want to remove ${fac.name}?`}
                              onConfirm={() => handleDeleteFacility(fac.id)}
                              okText="Delete"
                              cancelText="Cancel"
                            >
                              <Button
                                type="text"
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                style={{ padding: '0 4px' }}
                              />
                            </Popconfirm>
                          </div>
                        </div>

                        <div style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', marginTop: 12 }}>
                          {fac.name}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>
                          <span>Category: <strong>{fac.category || 'General'}</strong></span>
                          <span>Units: <strong>{fac.count || 1}</strong></span>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Empty
                  description={
                    <span style={{ color: isDarkMode ? '#888888' : '#64748b' }}>
                      No facilities added yet. Click "Add Facility" to showcase equipment and amenities.
                    </span>
                  }
                  style={{ margin: '40px 0' }}
                />
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: WORKOUTS, AMENITIES, RULES & SAFETY */}
          {/* ========================================================================= */}
          {activeTab === 'workouts' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <Title level={4} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    Workouts, Amenities, Rules & Safety
                  </Title>
                  <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13 }}>
                    Configure fitness disciplines, member amenities, gym rules and safety protocols.
                  </Text>
                </div>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={isSavingWorkoutsRules}
                  onClick={handleSaveWorkoutsRules}
                  style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}
                >
                  Save All Changes
                </Button>
              </div>

              {/* Workouts Offered */}
              <Card
                style={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-base)', marginBottom: 16 }}
                styles={{ body: { padding: '20px' } }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FireOutlined style={{ color: '#EC4899' }} /> Workout Disciplines Offered
                </div>
                <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', marginBottom: 14 }}>Select all fitness categories available at your facility</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {WORKOUT_OPTIONS.map((w) => {
                    const selected = gymWorkouts.includes(w);
                    return (
                      <Tag.CheckableTag
                        key={w}
                        checked={selected}
                        onChange={(chk) => {
                          setGymWorkouts(chk ? [...gymWorkouts, w] : gymWorkouts.filter((x) => x !== w));
                        }}
                        style={{
                          padding: '6px 14px', borderRadius: 16, fontSize: 13, fontWeight: 600,
                          backgroundColor: selected ? '#EC4899' : (isDarkMode ? '#1e293b' : '#fdf2f8'),
                          color: selected ? '#ffffff' : (isDarkMode ? '#cbd5e1' : '#831843'),
                          border: `1px solid ${selected ? '#EC4899' : (isDarkMode ? '#334155' : '#f9a8d4')}`,
                        }}
                      >
                        {w}
                      </Tag.CheckableTag>
                    );
                  })}
                </div>
                {gymWorkouts.length > 0 && (
                  <div style={{ marginTop: 10, fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>
                    {gymWorkouts.length} discipline(s) selected
                  </div>
                )}
              </Card>

              {/* Amenities */}
              <Card
                style={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-base)', marginBottom: 16 }}
                styles={{ body: { padding: '20px' } }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <StarFilled style={{ color: '#F59E0B' }} /> Amenities & Member Perks
                </div>
                <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', marginBottom: 14 }}>Select available member services and convenience amenities</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {AMENITY_OPTIONS.map((a) => {
                    const selected = gymAmenities.includes(a);
                    return (
                      <Tag.CheckableTag
                        key={a}
                        checked={selected}
                        onChange={(chk) => {
                          setGymAmenities(chk ? [...gymAmenities, a] : gymAmenities.filter((x) => x !== a));
                        }}
                        style={{
                          padding: '6px 14px', borderRadius: 16, fontSize: 13, fontWeight: 600,
                          backgroundColor: selected ? '#F59E0B' : (isDarkMode ? '#1e293b' : '#fffbeb'),
                          color: selected ? '#ffffff' : (isDarkMode ? '#cbd5e1' : '#92400e'),
                          border: `1px solid ${selected ? '#F59E0B' : (isDarkMode ? '#334155' : '#fcd34d')}`,
                        }}
                      >
                        {a}
                      </Tag.CheckableTag>
                    );
                  })}
                </div>
              </Card>

              <Row gutter={[16, 16]}>
                {/* Gym Rules */}
                <Col xs={24} md={12}>
                  <Card
                    style={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-base)', height: '100%' }}
                    styles={{ body: { padding: '20px' } }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FileTextOutlined style={{ color: '#6366F1' }} /> Gym Rules & Member Guidelines
                    </div>
                    <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', marginBottom: 14 }}>Set facility rules shown to members</div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                      {gymRules.map((rule, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc', border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}` }}>
                          <CheckOutlined style={{ color: '#6366F1', fontSize: 12, flexShrink: 0 }} />
                          <span style={{ flex: 1, fontSize: 13, color: isDarkMode ? '#e2e8f0' : '#334155' }}>{rule}</span>
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteRule(idx)}
                            style={{ padding: '0 4px', flexShrink: 0 }}
                          />
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <Input
                        placeholder="Add new gym rule..."
                        value={newRuleInput}
                        onChange={(e) => setNewRuleInput(e.target.value)}
                        onPressEnter={handleAddRule}
                        style={{ borderRadius: 'var(--radius-base)' }}
                      />
                      <Button type="primary" ghost icon={<PlusOutlined />} onClick={handleAddRule} style={{ flexShrink: 0 }}>Add</Button>
                    </div>
                  </Card>
                </Col>

                {/* Safety Measures */}
                <Col xs={24} md={12}>
                  <Card
                    style={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-base)', height: '100%' }}
                    styles={{ body: { padding: '20px' } }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <SafetyCertificateOutlined style={{ color: '#10B981' }} /> Safety Measures & Protocols
                    </div>
                    <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', marginBottom: 14 }}>List safety standards visible in gym details</div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                      {safetyMeasures.map((measure, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, backgroundColor: isDarkMode ? '#1e293b' : '#f0fdf4', border: `1px solid ${isDarkMode ? '#334155' : '#bbf7d0'}` }}>
                          <CheckCircleFilled style={{ color: '#10B981', fontSize: 12, flexShrink: 0 }} />
                          <span style={{ flex: 1, fontSize: 13, color: isDarkMode ? '#e2e8f0' : '#166534' }}>{measure}</span>
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteSafety(idx)}
                            style={{ padding: '0 4px', flexShrink: 0 }}
                          />
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <Input
                        placeholder="Add safety measure..."
                        value={newSafetyInput}
                        onChange={(e) => setNewSafetyInput(e.target.value)}
                        onPressEnter={handleAddSafety}
                        style={{ borderRadius: 'var(--radius-base)' }}
                      />
                      <Button type="primary" ghost icon={<PlusOutlined />} onClick={handleAddSafety} style={{ flexShrink: 0 }}>Add</Button>
                    </div>
                  </Card>
                </Col>
              </Row>

              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<SaveOutlined />}
                  loading={isSavingWorkoutsRules}
                  onClick={handleSaveWorkoutsRules}
                  style={{ borderRadius: 'var(--radius-base)', fontWeight: 700, minWidth: 180 }}
                >
                  Save Workouts & Rules
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: PRICING & MEMBERSHIP PLANS */}
          {/* ========================================================================= */}
          {activeTab === 'pricing' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <Title level={4} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    Membership Pricing & Workout Passes ({pricingPlans.length})
                  </Title>
                  <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13 }}>
                    Configure membership tiers, daily walk-in passes, and workout packages.
                  </Text>
                </div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsAddPlanModalOpen(true)}
                  style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}
                >
                  Add Pricing Tier
                </Button>
              </div>

              {pricingPlans.length > 0 ? (
                <Row gutter={[20, 20]}>
                  {pricingPlans.map((plan) => (
                    <Col xs={24} sm={12} lg={6} key={plan.id}>
                      <Card
                        style={{
                          backgroundColor: 'var(--bg-surface-elevated)',
                          borderColor: plan.popular ? 'var(--color-primary)' : 'var(--border-color)',
                          borderWidth: plan.popular ? 2 : 1,
                          borderRadius: 'var(--radius-base)',
                          position: 'relative',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                        styles={{ body: { padding: '22px 18px', display: 'flex', flexDirection: 'column', height: '100%' } }}
                      >
                        {plan.popular && (
                          <Tag
                            color="blue"
                            style={{
                              position: 'absolute',
                              top: -10,
                              right: 16,
                              fontWeight: 700,
                              fontSize: 10.5,
                              borderRadius: 4,
                            }}
                          >
                            MOST POPULAR
                          </Tag>
                        )}

                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                          {plan.badge || 'Plan'}
                        </div>
                        <div style={{ fontSize: 17, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', marginTop: 4 }}>
                          {plan.name}
                        </div>

                        <div style={{ margin: '14px 0 10px 0' }}>
                          <span style={{ fontSize: 28, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                            ₹{Number(plan.price).toLocaleString('en-IN')}
                          </span>
                          <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}> / {plan.duration}</span>
                        </div>

                        <Text style={{ fontSize: 12, color: isDarkMode ? '#aaaaaa' : '#64748b', lineHeight: 1.4, marginBottom: 16 }}>
                          {plan.description || 'Full gym access membership.'}
                        </Text>

                        <Divider style={{ margin: '10px 0' }} />

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                          {(plan.features || []).map((feat, fIdx) => (
                            <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: isDarkMode ? '#dddddd' : '#334155' }}>
                              <CheckCircleFilled style={{ color: '#00bf62', fontSize: 13 }} />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>

                        <Button
                          block
                          onClick={() => {
                            setSelectedPlanForEdit(plan);
                            editPlanForm.setFieldsValue({
                              name: plan.name,
                              badge: plan.badge,
                              price: plan.price,
                              duration: plan.duration,
                              description: plan.description,
                              features: Array.isArray(plan.features) ? plan.features.join('\n') : '',
                              popular: plan.popular || false,
                            });
                            setIsEditPlanModalOpen(true);
                          }}
                          style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}
                        >
                          Edit Plan Details
                        </Button>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Empty
                  description={
                    <span style={{ color: isDarkMode ? '#888888' : '#64748b' }}>
                      No pricing plans added yet. Click "Add Pricing Tier" to create membership passes.
                    </span>
                  }
                  style={{ margin: '40px 0' }}
                />
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: IMAGES & MEDIA GALLERY */}
          {/* ========================================================================= */}
          {activeTab === 'images' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <Title level={4} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    Gym Gallery & Media ({galleryPhotosList.length} Photos)
                  </Title>
                  <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13 }}>
                    Upload high-definition photos of your workout floor, turnstiles, cardio deck, and amenities.
                  </Text>
                </div>
                <Button
                  type="primary"
                  icon={<CameraOutlined />}
                  onClick={handleGalleryUpload}
                  loading={isUploadingMedia}
                  style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}
                >
                  Upload Photos
                </Button>
              </div>

              {galleryPhotosList.length > 0 ? (
                <Image.PreviewGroup>
                  <Row gutter={[16, 16]}>
                    {galleryPhotosList.map((img, idx) => (
                      <Col xs={24} sm={12} md={8} lg={6} key={idx}>
                        <Card
                          hoverable
                          style={{
                            backgroundColor: 'var(--bg-surface-elevated)',
                            borderColor: 'var(--border-color)',
                            borderRadius: 'var(--radius-base)',
                            overflow: 'hidden',
                          }}
                          styles={{ body: { padding: 0 } }}
                        >
                          <div style={{ height: 190, position: 'relative', overflow: 'hidden' }}>
                            <Image
                              src={img}
                              alt={`gym-gallery-${idx}`}
                              style={{ width: '100%', height: 190, objectFit: 'cover' }}
                              wrapperStyle={{ width: '100%', height: 190 }}
                              preview={{
                                mask: (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
                                    <EyeOutlined /> Preview Photo
                                  </div>
                                ),
                              }}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                display: 'flex',
                                gap: 6,
                                zIndex: 10,
                              }}
                            >
                              <Popconfirm
                                title="Delete Photo"
                                description="Are you sure you want to remove this photo?"
                                onConfirm={() => handleDeleteGalleryPhoto(idx)}
                                okText="Delete"
                                cancelText="Cancel"
                              >
                                <Button
                                  size="small"
                                  danger
                                  icon={<DeleteOutlined />}
                                  style={{
                                    backgroundColor: 'rgba(255, 77, 79, 0.95)',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: 'var(--radius-base)',
                                  }}
                                />
                              </Popconfirm>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Image.PreviewGroup>
              ) : (
                <Empty
                  description={
                    <span style={{ color: isDarkMode ? '#888888' : '#64748b' }}>
                      No gallery photos uploaded yet. Click "Upload Photos" to add facility pictures.
                    </span>
                  }
                  style={{ margin: '40px 0' }}
                />
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: OPERATING HOURS & SCHEDULE */}
          {/* ========================================================================= */}
          {activeTab === 'hours' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Top Control & Action Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
                <div>
                  <Title level={4} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    Gym Operating Hours & Schedule
                  </Title>
                  <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13 }}>
                    Configure opening and closing timings for each day of the week.
                  </Text>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Button
                    icon={<CopyOutlined />}
                    onClick={() => {
                      const mon = operatingHours[0];
                      if (!mon) return;
                      setOperatingHours((prev) =>
                        prev.map((item, i) => {
                          if (i >= 1) {
                            return {
                              ...item,
                              isOpen: mon.isOpen,
                              openTime: mon.openTime,
                              closeTime: mon.closeTime,
                            };
                          }
                          return item;
                        })
                      );
                      message.success('Monday schedule copied to all days (Tue - Sun)!');
                    }}
                    style={{ borderRadius: 'var(--radius-base)' }}
                  >
                    Copy Mon to All Days
                  </Button>

                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={isSavingHours}
                    onClick={handleSaveOperatingHours}
                    style={{ borderRadius: 'var(--radius-base)' }}
                  >
                    Save Schedule
                  </Button>
                </div>
              </div>

              {/* Day-by-Day Operating Hours Card */}
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ClockCircleOutlined style={{ color: 'var(--color-primary)' }} />
                    <span style={{ fontWeight: 700, fontSize: 15 }}>Day-by-Day Working Hours</span>
                  </div>
                }
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-color)',
                  borderRadius: 'var(--radius-base)',
                }}
                styles={{ body: { padding: '20px' } }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {operatingHours.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 16,
                        padding: '14px 20px',
                        borderRadius: 'var(--radius-base)',
                        backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
                        border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`,
                      }}
                    >
                      {/* Day and Status */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 160 }}>
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: item.isOpen ? '#10b981' : '#ef4444',
                          }}
                        />
                        <span style={{ fontWeight: 700, fontSize: 15, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                          {item.day}
                        </span>
                        <span
                          style={{
                            color: item.isOpen ? '#10b981' : '#ef4444',
                            fontWeight: 700,
                            fontSize: 12,
                            letterSpacing: '0.5px',
                          }}
                        >
                          {item.isOpen ? 'OPEN' : 'CLOSED'}
                        </span>
                      </div>

                      {/* Timing Pickers */}
                      {item.isOpen ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                          <Text style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b' }}>From</Text>
                          <Select
                            value={item.openTime || '05:30 AM'}
                            onChange={(val) => {
                              setOperatingHours((prev) =>
                                prev.map((d, i) => (i === idx ? { ...d, openTime: val } : d))
                              );
                            }}
                            style={{ width: 130 }}
                            size="middle"
                          >
                            {TIME_SLOTS.map((t) => (
                              <Option key={t} value={t}>{t}</Option>
                            ))}
                          </Select>
                          <Text style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b' }}>to</Text>
                          <Select
                            value={item.closeTime || '10:30 PM'}
                            onChange={(val) => {
                              setOperatingHours((prev) =>
                                prev.map((d, i) => (i === idx ? { ...d, closeTime: val } : d))
                              );
                            }}
                            style={{ width: 130 }}
                            size="middle"
                          >
                            {TIME_SLOTS.map((t) => (
                              <Option key={t} value={t}>{t}</Option>
                            ))}
                          </Select>
                        </div>
                      ) : (
                        <Text style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#94a3b8', fontStyle: 'italic' }}>
                          Gym Closed on {item.day}
                        </Text>
                      )}

                      {/* Toggle Switch */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Text style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>
                          {item.isOpen ? 'Open' : 'Closed'}
                        </Text>
                        <Switch
                          checked={item.isOpen}
                          onChange={(checked) => {
                            setOperatingHours((prev) =>
                              prev.map((d, i) => (i === idx ? { ...d, isOpen: checked } : d))
                            );
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Special Holidays & Planned Closures Card */}
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    <CalendarOutlined style={{ color: 'var(--color-primary)' }} /> Special Holidays & Planned Closures ({holidayExceptions.length})
                  </div>
                }
                extra={
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => setIsAddHolidayModalOpen(true)}
                    style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}
                  >
                    Add Exception
                  </Button>
                }
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-color)',
                  borderRadius: 'var(--radius-base)',
                }}
                styles={{ body: { padding: '20px' } }}
              >
                <Paragraph style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13, marginBottom: 16 }}>
                  Turnstiles will automatically enforce blackout dates or modified shift hours. Members will receive notifications 24 hours prior.
                </Paragraph>

                {holidayExceptions.length > 0 ? (
                  <Table
                    dataSource={holidayExceptions}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: 800 }}
                    size="middle"
                    columns={[
                      {
                        title: 'Date',
                        dataIndex: 'date',
                        key: 'date',
                        width: 140,
                        render: (date) => (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: isDarkMode ? '#e2e8f0' : '#334155' }}>
                            <CalendarOutlined style={{ color: 'var(--color-primary)' }} />
                            <span>{date}</span>
                          </div>
                        ),
                      },
                      {
                        title: 'Occasion / Event',
                        dataIndex: 'title',
                        key: 'title',
                        render: (title) => (
                          <span style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                            {title}
                          </span>
                        ),
                      },
                      {
                        title: 'Schedule Type',
                        dataIndex: 'type',
                        key: 'type',
                        width: 150,
                        render: (type) => {
                          const isClosed = (type || '').toLowerCase().includes('closed');
                          const isModified = (type || '').toLowerCase().includes('modified');
                          const color = isClosed ? '#ef4444' : isModified ? '#d97706' : '#10b981';
                          return (
                            <span style={{ color, fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}>
                              {type}
                            </span>
                          );
                        },
                      },
                      {
                        title: 'Effective Timings',
                        dataIndex: 'hours',
                        key: 'hours',
                        render: (hours) => (
                          <span style={{ color: isDarkMode ? '#d1d5db' : '#334155', fontSize: 13 }}>
                            {hours || 'Full Day Closed'}
                          </span>
                        ),
                      },
                      {
                        title: 'Notes',
                        dataIndex: 'notes',
                        key: 'notes',
                        render: (notes) => (
                          <span style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13 }}>
                            {notes || '—'}
                          </span>
                        ),
                      },
                      {
                        title: 'Actions',
                        key: 'actions',
                        width: 80,
                        align: 'center',
                        render: (_, record) => (
                          <Popconfirm
                            title="Remove Exception"
                            description={`Remove holiday rule for ${record.title}?`}
                            onConfirm={() => handleDeleteHoliday(record.id)}
                            okText="Delete"
                            cancelText="Cancel"
                          >
                            <Button type="text" danger icon={<DeleteOutlined />} />
                          </Popconfirm>
                        ),
                      },
                    ]}
                  />
                ) : (
                  <Empty description="No holiday exception rules added yet." style={{ margin: '20px 0' }} />
                )}
              </Card>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: BANK DETAILS & PAYOUT SETTLEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'bank' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <Title level={4} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    Bank Details & Direct Settlements
                  </Title>
                  <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13 }}>
                    Configure primary receiving bank account, branch details, and instant UPI settlement ID.
                  </Text>
                </div>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => {
                    bankForm.setFieldsValue(bankDetails);
                    setIsEditBankModalOpen(true);
                  }}
                  style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}
                >
                  Update Bank Details
                </Button>
              </div>

              <Row gutter={[20, 20]}>
                {/* Primary Bank Card */}
                <Col xs={24} md={14}>
                  <Card
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                        <BankOutlined style={{ color: 'var(--color-primary)' }} /> Primary Settlement Account
                      </div>
                    }
                    style={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-color)',
                      borderRadius: 'var(--radius-base)',
                      height: '100%',
                    }}
                    styles={{ body: { padding: '20px' } }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <Text type="secondary" style={{ fontSize: 11 }}>ACCOUNT HOLDER</Text>
                        <div style={{ fontWeight: 700, fontSize: 14, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                          {bankDetails.accountHolder || gymData?.ownerName || 'Not Provided'}
                        </div>
                      </div>
                      <div>
                        <Text type="secondary" style={{ fontSize: 11 }}>BANK NAME</Text>
                        <div style={{ fontWeight: 700, fontSize: 14, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                          {bankDetails.bankName || 'Not Provided'}
                        </div>
                      </div>
                      <div>
                        <Text type="secondary" style={{ fontSize: 11 }}>ACCOUNT NUMBER</Text>
                        <div style={{ fontWeight: 700, fontSize: 14, fontFamily: 'monospace' }}>
                          {bankDetails.accountNumber ? `•••• •••• ${bankDetails.accountNumber.slice(-4)}` : 'Not Provided'}
                        </div>
                      </div>
                      <div>
                        <Text type="secondary" style={{ fontSize: 11 }}>IFSC CODE</Text>
                        <div style={{ fontWeight: 700, fontSize: 14, fontFamily: 'monospace' }}>
                          {bankDetails.ifscCode || 'Not Provided'}
                        </div>
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <Text type="secondary" style={{ fontSize: 11 }}>BRANCH ADDRESS</Text>
                        <div style={{ fontWeight: 600, fontSize: 13, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                          {bankDetails.branch || gymData?.city || 'Not Provided'}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>

                {/* Instant UPI Settlement */}
                <Col xs={24} md={10}>
                  <Card
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                        <CreditCardOutlined style={{ color: 'var(--color-primary)' }} /> Instant UPI Settlement
                      </div>
                    }
                    style={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-color)',
                      borderRadius: 'var(--radius-base)',
                      height: '100%',
                    }}
                    styles={{ body: { padding: '20px' } }}
                  >
                    <div style={{ marginBottom: 20 }}>
                      <Text type="secondary" style={{ fontSize: 11 }}>INSTANT UPI SETTLEMENT ID</Text>
                      <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'monospace', marginTop: 4 }}>
                        {bankDetails.upiId || 'Not Configured'}
                      </div>
                    </div>

                    <div>
                      <Tag color="success" style={{ borderRadius: 4, fontWeight: 700, padding: '4px 8px' }}>
                        <CheckCircleFilled /> GST Compliant & Verified
                      </Tag>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: SOCIAL LINKS & ONLINE PRESENCE */}
          {/* ========================================================================= */}
          {activeTab === 'social' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <Title level={4} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    Social Media & Digital Brand Presence
                  </Title>
                  <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13 }}>
                    Connect social media pages, Google Maps ratings, and WhatsApp booking channel.
                  </Text>
                </div>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => {
                    socialForm.setFieldsValue(socialLinks);
                    setIsEditSocialModalOpen(true);
                  }}
                  style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}
                >
                  Edit Social Handles
                </Button>
              </div>

              <Row gutter={[16, 16]}>
                {/* Instagram */}
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    style={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-color)',
                      borderRadius: 'var(--radius-base)',
                    }}
                    styles={{ body: { padding: '20px' } }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#e1306c', fontSize: 24 }}>
                      <InstagramOutlined />
                      <span style={{ fontSize: 15, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>Instagram</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', marginTop: 8 }}>
                      {socialLinks.instagramHandle || 'Not Connected'}
                    </div>
                    <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', marginTop: 4 }}>
                      Brand Account
                    </div>
                  </Card>
                </Col>

                {/* Google Maps Profile */}
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    style={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-color)',
                      borderRadius: 'var(--radius-base)',
                    }}
                    styles={{ body: { padding: '20px' } }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#4285f4', fontSize: 24 }}>
                      <GlobalOutlined />
                      <span style={{ fontSize: 15, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>Google Maps</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#fa8c16', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <StarFilled style={{ color: '#fa8c16' }} /> {socialLinks.googleRating || gymData?.rating || '4.9'} / 5.0
                    </div>
                    <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', marginTop: 4 }}>
                      {socialLinks.googleReviewCount || gymData?.reviewsCount || 0} Verified Reviews
                    </div>
                  </Card>
                </Col>

                {/* WhatsApp Business */}
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    style={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-color)',
                      borderRadius: 'var(--radius-base)',
                    }}
                    styles={{ body: { padding: '20px' } }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#25d366', fontSize: 24 }}>
                      <WhatsAppOutlined />
                      <span style={{ fontSize: 15, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>WhatsApp</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#ffffff' : '#0f172a', marginTop: 8 }}>
                      {socialLinks.whatsapp || gymData?.phone || 'Not Connected'}
                    </div>
                    <div style={{ fontSize: 11, color: '#00bf62', marginTop: 4, fontWeight: 600 }}>
                      Active Contact
                    </div>
                  </Card>
                </Col>

                {/* Website */}
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    style={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-color)',
                      borderRadius: 'var(--radius-base)',
                    }}
                    styles={{ body: { padding: '20px' } }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#1677ff', fontSize: 24 }}>
                      <GlobalOutlined />
                      <span style={{ fontSize: 15, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>Website</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#ffffff' : '#0f172a', marginTop: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {socialLinks.website || 'Not Configured'}
                    </div>
                    <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', marginTop: 4 }}>
                      Official Portal
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: GYM SYSTEM SETTINGS & PREFERENCES */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && (
            <div>
              <div style={{ marginBottom: 18 }}>
                <Title level={4} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  Gym System & Turnstile Configurations
                </Title>
                <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13 }}>
                  Configure optical turnstile delay, member renewal grace periods, and SMS/WhatsApp notifications.
                </Text>
              </div>

              <Card
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-color)',
                  borderRadius: 'var(--radius-base)',
                }}
                styles={{ body: { padding: '24px' } }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Setting 1: Turnstile Timeout */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                        Turnstile Auto-Lock Duration
                      </div>
                      <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>
                        Number of seconds the optical turnstile gate barrier stays open after valid QR scan
                      </div>
                    </div>
                    <Select
                      value={systemSettings.turnstileTimeout}
                      onChange={(v) => {
                        const updated = { ...systemSettings, turnstileTimeout: v };
                        handleSaveSettings(updated);
                      }}
                      style={{ width: 140 }}
                    >
                      <Option value={3}>3 Seconds</Option>
                      <Option value={5}>5 Seconds</Option>
                      <Option value={8}>8 Seconds</Option>
                    </Select>
                  </div>

                  <Divider style={{ margin: 0 }} />

                  {/* Setting 2: Renewal Grace Period */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                        Membership Renewal Grace Period
                      </div>
                      <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>
                        Allow members to check in for N days post-expiry before turnstile denies entry
                      </div>
                    </div>
                    <Select
                      value={systemSettings.renewalGracePeriod}
                      onChange={(v) => {
                        const updated = { ...systemSettings, renewalGracePeriod: v };
                        handleSaveSettings(updated);
                      }}
                      style={{ width: 140 }}
                    >
                      <Option value={0}>0 Days (Strict)</Option>
                      <Option value={3}>3 Days</Option>
                      <Option value={7}>7 Days</Option>
                    </Select>
                  </div>

                  <Divider style={{ margin: 0 }} />

                  {/* Setting 3: SMS Alerts */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                        SMS Check-In Alerts
                      </div>
                      <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>
                        Send instant SMS confirmation when a member checks in via QR / NFC
                      </div>
                    </div>
                    <Switch
                      checked={systemSettings.smsCheckInAlerts}
                      onChange={(chk) => {
                        const updated = { ...systemSettings, smsCheckInAlerts: chk };
                        handleSaveSettings(updated);
                      }}
                    />
                  </div>

                  <Divider style={{ margin: 0 }} />

                  {/* Setting 4: WhatsApp Alerts */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                        WhatsApp Renewal Notifications
                      </div>
                      <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>
                        Send automated renewal reminders to expiring members 3 days in advance
                      </div>
                    </div>
                    <Switch
                      checked={systemSettings.whatsappAlerts}
                      onChange={(chk) => {
                        const updated = { ...systemSettings, whatsappAlerts: chk };
                        handleSaveSettings(updated);
                      }}
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. EDIT PROFILE MODAL */}
      <Modal
        title="Edit Gym Profile Information"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={720}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-base)',
                  border: `1.5px dashed ${isDarkMode ? '#333333' : '#cbd5e1'}`,
                  backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                }}
                onClick={handleLogoUpload}
              >
                <Avatar
                  shape="square"
                  size={46}
                  src={gymLogoUrl}
                  icon={<ShopOutlined />}
                  style={{ borderRadius: 'var(--radius-base)', flexShrink: 0 }}
                />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    Brand Logo
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--color-primary)', fontWeight: 600, marginTop: 2 }}>
                    Click to Upload Logo
                  </div>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-base)',
                  border: `1.5px dashed ${isDarkMode ? '#333333' : '#cbd5e1'}`,
                  backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                }}
                onClick={handleCoverPhotoUpload}
              >
                <Avatar
                  shape="square"
                  size={46}
                  src={gymCoverUrl}
                  icon={<PictureOutlined />}
                  style={{ borderRadius: 'var(--radius-base)', flexShrink: 0 }}
                />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    Cover Banner
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--color-primary)', fontWeight: 600, marginTop: 2 }}>
                    Click to Upload Cover
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Gym Name" rules={[{ required: true, message: 'Please enter gym name' }]}>
                <Input placeholder="e.g. FitZone Elite Fitness" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ownerName" label="Owner / Partner Name" rules={[{ required: true, message: 'Please enter owner name' }]}>
                <Input placeholder="e.g. Rajesh Kumar" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: 'Please enter phone' }]}>
                <Input placeholder="e.g. 9876543210" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Contact Email" rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}>
                <Input placeholder="e.g. contact@fitzone.in" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="businessType" label="Business Type">
                <Select>
                  <Option value="Sole Proprietorship">Sole Proprietorship</Option>
                  <Option value="Partnership">Partnership</Option>
                  <Option value="Private Limited">Private Limited</Option>
                  <Option value="LLP">LLP</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="genderAllowed" label="Gender Allowed">
                <Select>
                  <Option value="Unisex">Unisex</Option>
                  <Option value="Men Only">Men Only</Option>
                  <Option value="Women Only">Women Only</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="gstNumber" label="GST Number">
                <Input placeholder="e.g. 33AAAAA0000A1Z5" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="panNumber" label="PAN Number">
                <Input placeholder="e.g. ABCDE1234F" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="yearEstablished" label="Year Established">
                <Input placeholder="e.g. 2021" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="floorSpaceSqFt" label="Floor Space (Sq. Ft)">
                <InputNumber style={{ width: '100%' }} min={0} placeholder="e.g. 3500" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="maxFloorCapacity" label="Max Floor Capacity">
                <InputNumber style={{ width: '100%' }} min={1} placeholder="e.g. 60" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="area" label="Area / Locality">
                <Input placeholder="e.g. Anna Nagar West" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="city" label="City" rules={[{ required: true, message: 'Please enter city' }]}>
                <Input placeholder="e.g. Chennai" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="state" label="State">
                <Input placeholder="e.g. Tamil Nadu" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="pincode" label="Pincode">
                <Input placeholder="e.g. 600040" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="address" label="Full Street Address" rules={[{ required: true, message: 'Please enter street address' }]}>
                <Input placeholder="e.g. Plot No. 12, 4th Main Road, Anna Nagar West" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="aboutText" label="About Gym Summary">
                <TextArea rows={3} placeholder="Describe gym training style, equipment brands, certified trainers..." />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isSavingBasic}>
              Save Profile Changes
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 2. PENDING REQUESTS MODAL */}
      <Modal
        title="Pending Admin Approval Requests"
        open={isPendingRequestsOpen}
        onCancel={() => setIsPendingRequestsOpen(false)}
        width={600}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsPendingRequestsOpen(false)}>
            Close
          </Button>,
        ]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '10px 0' }}>
          {pendingRequests.length > 0 ? (
            pendingRequests.map((req, idx) => (
              <div
                key={req.id || idx}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-base)',
                  border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`,
                  backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    {req.field || req.changeType || 'Profile Update'}
                  </div>
                  <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2 }}>
                    Requested by {req.changedBy || 'Partner'} • {req.requestedOn || (req.changedAt ? new Date(req.changedAt).toLocaleDateString('en-GB') : 'Recent')}
                  </div>
                  {req.adminRemarks && (
                    <div style={{ fontSize: 11.5, color: '#fa8c16', marginTop: 4 }}>
                      Admin Notes: {req.adminRemarks}
                    </div>
                  )}
                </div>
                <Tag color="warning" style={{ fontWeight: 600, whiteSpace: 'nowrap', margin: 0 }}>
                  {req.approvalStatus || 'Pending Admin Review'}
                </Tag>
              </div>
            ))
          ) : (
            <Empty description="No pending approval requests. All changes are in sync." style={{ margin: '20px 0' }} />
          )}
        </div>
      </Modal>

      {/* 2.1 AUDIT HISTORY MODAL */}
      <Modal
        title="Gym Profile Audit Log History"
        open={isAuditHistoryOpen}
        onCancel={() => setIsAuditHistoryOpen(false)}
        width={750}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsAuditHistoryOpen(false)}>
            Close
          </Button>,
        ]}
      >
        {auditHistory.length > 0 ? (
          <Table
            dataSource={auditHistory}
            rowKey={(r, i) => r._id || r.id || i}
            pagination={{ pageSize: 5 }}
            size="small"
            columns={[
              {
                title: 'Action / Field',
                key: 'field',
                render: (_, r) => (
                  <div>
                    <div style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                      {r.field || r.changeType || 'Update'}
                    </div>
                    <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>
                      By: {r.changedBy || 'Partner'} ({r.changedByRole || 'Owner'})
                    </div>
                  </div>
                ),
              },
              {
                title: 'Timestamp',
                dataIndex: 'changedAt',
                key: 'changedAt',
                width: 140,
                render: (val) => (val ? new Date(val).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'),
              },
              {
                title: 'Status',
                dataIndex: 'approvalStatus',
                key: 'approvalStatus',
                width: 130,
                render: (status) => (
                  <Tag
                    color={
                      status === 'Approved'
                        ? 'success'
                        : status === 'Pending Approval' || status === 'Pending Admin Review'
                          ? 'warning'
                          : 'error'
                    }
                    style={{ fontWeight: 600 }}
                  >
                    {status || 'Approved'}
                  </Tag>
                ),
              },
            ]}
          />
        ) : (
          <Empty description="No audit records logged yet." style={{ margin: '20px 0' }} />
        )}
      </Modal>

      {/* 3. ADD PRICING PLAN MODAL */}
      <Modal
        title="Create Membership / Workout Plan"
        open={isAddPlanModalOpen}
        onCancel={() => setIsAddPlanModalOpen(false)}
        footer={null}
        width={560}
      >
        <Form
          form={planForm}
          layout="vertical"
          initialValues={{ badge: 'Monthly', popular: false }}
          onFinish={handleAddPlan}
        >
          <Row gutter={16}>
            <Col span={14}>
              <Form.Item name="name" label="Plan Name" rules={[{ required: true, message: 'Please enter plan name' }]}>
                <Input placeholder="e.g. 6-Month Semi-Annual Fitness" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="badge" label="Category / Badge" rules={[{ required: true, message: 'Select category' }]}>
                <Select>
                  <Option value="Walk-In">Walk-In</Option>
                  <Option value="Weekly">Weekly</Option>
                  <Option value="Monthly">Monthly</Option>
                  <Option value="Quarterly">Quarterly</Option>
                  <Option value="Semi-Annual">Semi-Annual</Option>
                  <Option value="Annual VIP">Annual VIP</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="price" label="Price (₹)" rules={[{ required: true, message: 'Please enter price' }]}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="e.g. 10999" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="duration" label="Duration" rules={[{ required: true, message: 'Please enter duration' }]}>
                <Input placeholder="e.g. 180 Days" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Short Description">
            <TextArea rows={2} placeholder="Brief summary of what's included..." />
          </Form.Item>
          <Form.Item name="features" label="Included Features (one per line)">
            <TextArea rows={4} placeholder="All Gym Floor Access&#10;Locker & Shower Access&#10;Steam & Sauna Access" />
          </Form.Item>
          <Form.Item name="popular" valuePropName="checked">
            <Checkbox>Mark as "Most Popular" Plan</Checkbox>
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsAddPlanModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isSavingPricing}>
              Save Plan
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 3.1 EDIT PRICING PLAN MODAL */}
      <Modal
        title={`Edit Membership Plan - ${selectedPlanForEdit?.name || ''}`}
        open={isEditPlanModalOpen}
        onCancel={() => setIsEditPlanModalOpen(false)}
        footer={null}
        width={560}
      >
        <Form form={editPlanForm} layout="vertical" onFinish={handleEditPlan}>
          <Row gutter={16}>
            <Col span={14}>
              <Form.Item name="name" label="Plan Name" rules={[{ required: true, message: 'Please enter plan name' }]}>
                <Input placeholder="e.g. 3-Month Fitness Pro" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="badge" label="Category / Badge" rules={[{ required: true }]}>
                <Select>
                  <Option value="Walk-In">Walk-In</Option>
                  <Option value="Weekly">Weekly</Option>
                  <Option value="Monthly">Monthly</Option>
                  <Option value="Quarterly">Quarterly</Option>
                  <Option value="Semi-Annual">Semi-Annual</Option>
                  <Option value="Annual VIP">Annual VIP</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="price" label="Price (₹)" rules={[{ required: true, message: 'Please enter price' }]}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="e.g. 6499" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="duration" label="Duration" rules={[{ required: true, message: 'Please enter duration' }]}>
                <Input placeholder="e.g. 90 Days" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Short Description">
            <TextArea rows={2} placeholder="Brief summary of what's included..." />
          </Form.Item>
          <Form.Item name="features" label="Included Features (one per line)">
            <TextArea rows={4} placeholder="All Gym Floor Access&#10;Locker & Shower Access&#10;Steam & Sauna Access" />
          </Form.Item>
          <Form.Item name="popular" valuePropName="checked">
            <Checkbox>Mark as "Most Popular" Plan</Checkbox>
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => {
                if (selectedPlanForEdit) {
                  handleDeletePlan(selectedPlanForEdit.id);
                  setIsEditPlanModalOpen(false);
                }
              }}
            >
              Delete Plan
            </Button>
            <Space size={10}>
              <Button onClick={() => setIsEditPlanModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={isSavingPricing}>
                Save Changes
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* 4. ADD FACILITY MODAL */}
      <Modal
        title="Add Facility or Equipment Spec"
        open={isAddFacilityModalOpen}
        onCancel={() => setIsAddFacilityModalOpen(false)}
        footer={null}
      >
        <Form form={facilityForm} layout="vertical" onFinish={handleAddFacility}>
          <Form.Item name="name" label="Facility / Equipment Name" rules={[{ required: true, message: 'Please enter facility name' }]}>
            <Input placeholder="e.g. Olympic Squat Platforms & Bumper Plates" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="category" label="Category" initialValue="Strength">
                <Select>
                  <Option value="Cardio">Cardio Studio</Option>
                  <Option value="Strength">Strength & Weights</Option>
                  <Option value="Functional">Functional & Crossfit</Option>
                  <Option value="Wellness">Wellness & Steam</Option>
                  <Option value="Amenities">Amenities & Lockers</Option>
                  <Option value="Nutrition">Juice & Nutrition Bar</Option>
                  <Option value="Tech">Tech & Turnstiles</Option>
                  <Option value="Training">Personal Training</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="count" label="Total Units / Count" initialValue={1}>
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsAddFacilityModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isSavingFacility}>
              Add Facility
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 5. EDIT BANK DETAILS MODAL */}
      <Modal
        title="Edit Bank Account Details"
        open={isEditBankModalOpen}
        onCancel={() => setIsEditBankModalOpen(false)}
        footer={null}
        width={560}
      >
        <Form form={bankForm} layout="vertical" onFinish={handleSaveBank}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="accountHolder" label="Account Holder Name" rules={[{ required: true, message: 'Enter account holder name' }]}>
                <Input placeholder="e.g. FitZone Enterprises" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="bankName" label="Bank Name" rules={[{ required: true, message: 'Enter bank name' }]}>
                <Input placeholder="e.g. HDFC Bank" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="accountNumber" label="Account Number" rules={[{ required: true, message: 'Enter account number' }]}>
                <Input placeholder="e.g. 50100123456789" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ifscCode" label="IFSC Code" rules={[{ required: true, message: 'Please enter IFSC Code' }]}>
                <Input placeholder="e.g. HDFC0001234" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="accountType" label="Account Type" initialValue="Current Account">
                <Select>
                  <Option value="Current Account">Current Account</Option>
                  <Option value="Savings Account">Savings Account</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="branch" label="Branch Address" rules={[{ required: true, message: 'Please enter branch' }]}>
                <Input placeholder="e.g. Anna Nagar Branch, Chennai" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="upiId" label="Instant UPI Settlement ID" rules={[{ required: true, message: 'Please enter UPI ID' }]}>
                <Input placeholder="e.g. fitzone.gym@hdfcbank" />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsEditBankModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isSavingBank}>
              Save Bank Details
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 6. EDIT SOCIAL LINKS MODAL */}
      <Modal
        title="Edit Social Media & Online Profiles"
        open={isEditSocialModalOpen}
        onCancel={() => setIsEditSocialModalOpen(false)}
        footer={null}
        width={560}
      >
        <Form form={socialForm} layout="vertical" onFinish={handleSaveSocial}>
          <Form.Item name="instagramHandle" label="Instagram Handle">
            <Input prefix={<InstagramOutlined />} placeholder="e.g. @fitzone_chennai" />
          </Form.Item>
          <Form.Item name="whatsapp" label="WhatsApp Business Number">
            <Input prefix={<WhatsAppOutlined />} placeholder="e.g. +91 98765 43210" />
          </Form.Item>
          <Form.Item name="website" label="Website URL">
            <Input prefix={<GlobalOutlined />} placeholder="e.g. https://www.fitzonegym.com" />
          </Form.Item>
          <Form.Item name="googleBusinessUrl" label="Google Business / Maps URL">
            <Input prefix={<GlobalOutlined />} placeholder="e.g. https://maps.google.com/..." />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsEditSocialModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isSavingSocial}>
              Save Social Links
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 7. ADD HOLIDAY / EXCEPTION MODAL */}
      <Modal
        title="Add Special Holiday or Blackout Schedule"
        open={isAddHolidayModalOpen}
        onCancel={() => setIsAddHolidayModalOpen(false)}
        footer={null}
        width={540}
      >
        <Form form={holidayForm} layout="vertical" initialValues={{ type: 'Closed' }} onFinish={handleAddHoliday}>
          <Form.Item
            name="title"
            label="Occasion / Holiday Title"
            rules={[{ required: true, message: 'Please enter event or holiday name' }]}
          >
            <Input placeholder="e.g. New Year's Day, Independence Day, Annual Maintenance" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Please select date' }]}>
                <DatePicker style={{ width: '100%' }} format="DD MMM YYYY" placeholder="Select date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="Schedule Type" rules={[{ required: true }]}>
                <Select>
                  <Option value="Closed">Full Day Closed</Option>
                  <Option value="Modified Hours">Modified Hours</Option>
                  <Option value="Extended Hours">Extended Hours</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) =>
              getFieldValue('type') !== 'Closed' ? (
                <Form.Item
                  name="hours"
                  label="Modified Operating Hours"
                  rules={[{ required: true, message: 'Specify modified shift hours' }]}
                >
                  <Input placeholder="e.g. 06:00 AM - 01:00 PM (Morning Only)" />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item name="notes" label="Turnstile & Member Notice Note">
            <TextArea
              rows={2}
              placeholder="e.g. Optical turnstiles will lock at 1:00 PM for floor sanitation."
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsAddHolidayModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save Exception Rule
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default GymProfileManagement;
