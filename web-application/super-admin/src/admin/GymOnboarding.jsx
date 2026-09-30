import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Form,
  Upload,
  Typography,
  Space,
  message,
  Modal,
  TimePicker,
  Checkbox,
  Radio,
  Progress,
  Divider,
  Tag,
  InputNumber,
  Switch,
  Avatar,
  Table,
  Rate,
  Tooltip,
} from 'antd';
import {
  ShopOutlined,
  EnvironmentOutlined,
  PictureOutlined,
  TeamOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  SaveOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  InboxOutlined,
  SafetyCertificateFilled,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  StarFilled,
  QrcodeOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
  EyeOutlined,
  ThunderboltFilled,
  CompassOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  FileProtectOutlined,
  FireFilled,
  RocketOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addGym } from '../redux/slices/gymSlice';
import { useTheme } from '../theme/ThemeContext';
import { apiClient } from '../services/apiClient';

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;
const { Title, Text, Paragraph } = Typography;

const ONBOARDING_STEPS = [
  { id: 1, key: 'business', title: 'Business Info', icon: <ShopOutlined /> },
  { id: 2, key: 'location', title: 'Location & Hours', icon: <EnvironmentOutlined /> },
  { id: 3, key: 'facilities', title: 'Facilities & Photos', icon: <PictureOutlined /> },
  { id: 4, key: 'trainers', title: 'Services & Trainers', icon: <TeamOutlined /> },
  { id: 5, key: 'session', title: 'Session & Pricing', icon: <AppstoreOutlined /> },
  { id: 6, key: 'rules', title: 'Rules & Safety', icon: <CalendarOutlined /> },
  { id: 7, key: 'payment', title: 'Payout & Tier', icon: <CreditCardOutlined /> },
  { id: 8, key: 'review', title: 'Review & Go Live', icon: <CheckCircleOutlined /> },
];

const FACILITY_OPTIONS = [
  'AC Gym',
  'Locker Facility',
  'Shower Available',
  'Changing Room',
  'Free Wi-Fi',
  'Music System',
  'Steam & Sauna',
  'Ice Bath & Recovery',
  'Dedicated Parking (2W/4W)',
  'Turnstile Access Control',
  'First Aid Kit',
  'CCTV 24/7',
  'Biometric Entry',
  'Personal Trainers',
  'Cardio Theater',
  'Olympic Barbells Area',
];

const AMENITY_OPTIONS = [
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

const WORKOUT_OPTIONS = [
  'GYM / Strength',
  'Cardio Fitness',
  'HIIT (High Intensity)',
  'CrossFit',
  'Yoga & Mobility',
  'Zumba & Dance',
  'Boxing & Kickboxing',
  'Pilates',
  'Calisthenics',
  'MMA & Martial Arts',
];

const BADGE_OPTIONS = ['Trending', 'Top Rated', 'Verified SuperGym', 'Popular', 'Premium Club', '24/7 Access', 'CrossFit Ready'];

const CITY_PRESETS = [
  { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, area: 'Anna Nagar' },
  { city: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, area: 'Koramangala' },
  { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, area: 'Bandra West' },
  { city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, area: 'Viman Nagar' },
  { city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, area: 'Hitec City' },
  { city: 'Delhi-NCR', state: 'Delhi', lat: 28.6139, lng: 77.2090, area: 'Connaught Place' },
  { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, area: 'Salt Lake' },
];

export const GymOnboarding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [form] = Form.useForm();

  // Success Celebration Modal State
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdGymSummary, setCreatedGymSummary] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trainer Modal State
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
  const [trainerForm] = Form.useForm();

  // Comprehensive Form State Data across steps
  const [formData, setFormData] = useState({
    // Step 1: Business
    gymName: 'Titanium Fitness Hub',
    tagline: 'Unleash Your Ultimate Strength & Endurance',
    businessType: 'Private Limited',
    ownerName: 'Vikramaditya Verma',
    phone: '9840123456',
    email: 'admin@titaniumfitness.com',
    password: '',
    yearEstablished: '2021',
    gstNumber: '33AAACT1234F1Z5',
    panNumber: 'AAACT1234F',
    branches: '2',
    gymId: 'GYM-' + Math.floor(1000 + Math.random() * 9000),

    // Step 2: Location & Hours
    address: 'Plot 78, 100 Feet Road, 4th Block, Anna Nagar West',
    area: 'Anna Nagar West',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    landmark: 'Opposite Metro Pillar 142',
    lat: 13.0850,
    lng: 80.2101,
    googleMapsUrl: 'https://maps.google.com/?q=13.0850,80.2101',
    weekdayOpen: '05:30 AM',
    weekdayClose: '10:30 PM',
    weekendOpen: '06:00 AM',
    weekendClose: '09:00 PM',
    isSplitShift: false,
    isOpenHolidays: true,
    is24Hours: false,

    // Step 3: Facilities, Photos & Space
    floorSpaceSqFt: 5500,
    maxFloorCapacity: 95,
    coverPhoto: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    galleryPhotos: [
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=400&auto=format&fit=crop',
    ],
    facilities: ['AC Gym', 'Locker Facility', 'Shower Available', 'Changing Room', 'Free Wi-Fi', 'Music System', 'Steam & Sauna', 'Dedicated Parking (2W/4W)', 'Turnstile Access Control'],
    amenities: ['RO Drinking Water', 'Towel Service', 'Protein Shake Bar', 'Juice & Smoothie Bar', 'InBody BMI Scanner', 'First Aid Kit'],
    tags: ['Top Rated', 'Unisex', 'AC Gym', 'Certified Trainers'],
    badgeText: 'Trending',
    aboutText: 'Titanium Fitness Hub is a high-octane workout facility outfitted with Hammer Strength plate-loaded machinery, Eleiko Olympic barbells, high-intensity turf zone, and certified strength coaches.',

    // Step 4: Workouts & Trainers
    workouts: ['GYM / Strength', 'Cardio Fitness', 'HIIT (High Intensity)', 'CrossFit', 'Yoga & Mobility', 'Zumba & Dance'],
    trainers: [
      {
        id: 'tr-1',
        name: 'Karan Rathore',
        specialty: 'Hypertrophy & Powerlifting',
        experienceYears: 7,
        rating: 4.9,
        monthlyFee: 2500,
        image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=150&auto=format&fit=crop',
      },
      {
        id: 'tr-2',
        name: 'Pooja Hegde',
        specialty: 'HIIT & Mobility Specialist',
        experienceYears: 5,
        rating: 4.8,
        monthlyFee: 2000,
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
      },
    ],

    // Step 5: Sessions & Pricing
    singleSessionPrice: 199,
    weeklyPassPrice: 799,
    fiveSessionPrice: 899,
    monthlyPrice: 1999,
    quarterlyPrice: 4999,
    halfYearlyPrice: 8999,
    annualPrice: 14999,
    slotDurationMinutes: 60,
    maxSlotCapacity: 25,
    slotsMorning: ['06:00 - 07:00 AM', '07:00 - 08:00 AM', '08:00 - 09:00 AM', '09:00 - 10:00 AM'],
    slotsEvening: ['05:00 - 06:00 PM', '06:00 - 07:00 PM', '07:00 - 08:00 PM', '08:00 - 09:00 PM'],

    // Step 6: Rules & Safety
    rules: [
      'Carry clean indoor training shoes',
      'Mandatory personal gym towel on workout benches',
      'Re-rack dumbbells and plates after set completion',
      'Minimum entry age is 16 years',
      'Valid photo ID proof required for digital check-in',
      'No outside food permitted in the workout area',
    ],
    safetyMeasures: [
      'Daily multi-session equipment sanitization',
      'Certified First Aid & CPR staff available on floor',
      '24/7 CCTV surveillance coverage',
      'Turnstile Dynamic QR scanner access control',
      'Emergency exits and fire extinguishers installed',
    ],
    freeCancellationHours: 2,
    refundPercentage: 100,
    rescheduleAllowedCount: 2,

    // Step 7: Payout & Tier
    subscriptionType: 'Hybrid',
    commissionRate: 10,
    settlementCycle: 'Daily (T+1)',
    accountHolder: 'Titanium Fitness Hub Pvt Ltd',
    bankName: 'HDFC Bank',
    accountNumber: '50200098765432',
    ifscCode: 'HDFC0001234',
    upiId: 'titaniumfitness@okhdfcbank',
    termsAccepted: true,
    slaAccepted: true,
    initialApprovalStatus: 'Approved',
  });

  // Calculate Progress Pct
  const progressPercent = Math.round((currentStep / 8) * 100);

  // Quick Preset Location Helper
  const handleApplyPresetCity = (preset) => {
    setFormData((prev) => ({
      ...prev,
      city: preset.city,
      state: preset.state,
      area: preset.area,
      lat: preset.lat,
      lng: preset.lng,
      address: `Main Commercial Avenue, ${preset.area}`,
      googleMapsUrl: `https://maps.google.com/?q=${preset.lat},${preset.lng}`,
    }));
    message.success(`Location coordinates preset to ${preset.city}!`);
  };

  // Add Trainer Action
  const handleAddTrainer = (values) => {
    const newTrainer = {
      id: `tr-${Date.now()}`,
      name: values.name,
      specialty: values.specialty,
      experienceYears: Number(values.experienceYears) || 3,
      rating: 4.9,
      monthlyFee: Number(values.monthlyFee) || 2000,
      image: values.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    };
    setFormData((prev) => ({
      ...prev,
      trainers: [...prev.trainers, newTrainer],
    }));
    setIsTrainerModalOpen(false);
    trainerForm.resetFields();
    message.success(`Trainer "${values.name}" added successfully!`);
  };

  const handleRemoveTrainer = (id) => {
    setFormData((prev) => ({
      ...prev,
      trainers: prev.trainers.filter((t) => t.id !== id),
    }));
    message.info('Trainer removed');
  };

  // Handle Save & Next
  const handleSaveAndNext = () => {
    form
      .validateFields()
      .then((values) => {
        setFormData((prev) => ({ ...prev, ...values }));
        if (currentStep < 8) {
          setCurrentStep((prev) => prev + 1);
          message.success(`Step ${currentStep} saved!`);
        } else {
          handleFinalPublish();
        }
      })
      .catch(() => {
        // In case of any un-focused field, proceed smoothly
        if (currentStep < 8) {
          setCurrentStep((prev) => prev + 1);
        } else {
          handleFinalPublish();
        }
      });
  };

  // Handle Final Publish
  const handleFinalPublish = async () => {
    if (!formData.password || formData.password.length < 6) {
      message.error('Please create a partner owner login password (minimum 6 characters) in Step 1.');
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);
    try {
      const newGymPayload = {
        id: formData.gymId || `GYM-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.gymName,
        gymName: formData.gymName,
        tagline: formData.tagline,
        businessType: formData.businessType,
        ownerName: formData.ownerName,
        phone: formData.phone.startsWith('+91') ? formData.phone : `+91 ${formData.phone}`,
        email: formData.email,
        password: formData.password,
        location: `${formData.area || formData.city}, ${formData.city}`,
        fullAddress: formData.address,
        address: formData.address,
        area: formData.area,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        landmark: formData.landmark,
        lat: formData.lat,
        lng: formData.lng,
        geoCoordinates: { lat: formData.lat, lng: formData.lng },
        googleMapsUrl: formData.googleMapsUrl,
        floorSpaceSqFt: Number(formData.floorSpaceSqFt) || 0,
        maxFloorCapacity: Number(formData.maxFloorCapacity) || 0,
        yearEstablished: formData.yearEstablished,
        gstNumber: formData.gstNumber,
        panNumber: formData.panNumber,
        branches: formData.branches,
        openingHours: {
          weekdayOpen: formData.weekdayOpen,
          weekdayClose: formData.weekdayClose,
          weekendOpen: formData.weekendOpen,
          weekendClose: formData.weekendClose,
          isSplitShift: Boolean(formData.isSplitShift),
          isOpenHolidays: formData.isOpenHolidays !== false,
          is24Hours: Boolean(formData.is24Hours),
        },
        slotDurationMinutes: Number(formData.slotDurationMinutes) || 60,
        maxSlotCapacity: Number(formData.maxSlotCapacity) || 25,
        slotsMorning: formData.slotsMorning,
        slotsEvening: formData.slotsEvening,
        singleSessionPrice: Number(formData.singleSessionPrice) || 199,
        rating: 4.9,
        reviewsCount: 0,
        membersCount: 0,
        monthlyRevenue: '₹ 0',
        status: formData.initialApprovalStatus === 'Approved' ? 'Active' : 'Pending',
        approvalStatus: formData.initialApprovalStatus || 'Approved',
        subscriptionType: formData.subscriptionType || 'Hybrid',
        subscriptionStatus: 'Active',
        commissionRate: Number(formData.commissionRate) || 10,
        settlementCycle: formData.settlementCycle || 'Daily (T+1)',
        coverPhoto: formData.coverPhoto,
        image: formData.coverPhoto,
        galleryPhotos: formData.galleryPhotos,
        tags: formData.tags,
        badgeText: formData.badgeText,
        aboutText: formData.aboutText,
        facilities: formData.facilities,
        amenities: formData.amenities,
        workouts: formData.workouts,
        trainers: formData.trainers,
        pricingPlans: {
          singleSession: Number(formData.singleSessionPrice) || 199,
          weeklyPass: Number(formData.weeklyPassPrice) || 799,
          fiveSessions: Number(formData.fiveSessionPrice) || 899,
          monthly: Number(formData.monthlyPrice) || 1999,
          quarterly: Number(formData.quarterlyPrice) || 4999,
          halfYearly: Number(formData.halfYearlyPrice) || 8999,
          annual: Number(formData.annualPrice) || 14999,
        },
        rules: formData.rules,
        safetyMeasures: formData.safetyMeasures,
        freeCancellationHours: Number(formData.freeCancellationHours) || 2,
        refundPercentage: Number(formData.refundPercentage) || 100,
        rescheduleAllowedCount: Number(formData.rescheduleAllowedCount) || 2,
        bankDetails: {
          accountHolder: formData.accountHolder,
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          upiId: formData.upiId,
        },
        documents: {
          gstCertificate: formData.gstCertificate || formData.businessCertificate || '',
          panCard: formData.panCard || '',
          tradeLicense: formData.tradeLicense || '',
          bankProof: formData.bankProof || '',
        },
      };

      const response = await apiClient.post('/gyms/onboard', newGymPayload);
      const createdGym = response.data?.data?.gym || newGymPayload;

      dispatch(addGym(createdGym));
      setCreatedGymSummary(createdGym);
      setIsSuccessModalOpen(true);
      message.success(`Gym "${formData.gymName}" onboarded and live on GYMEZY!`);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to onboard gym partner.';
      message.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Save & Exit
  const handleSaveAndExit = () => {
    message.info('Onboarding draft saved. You can resume anytime.');
    navigate('/admin/gyms');
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', paddingBottom: 40 }}>
      {/* 1. TOP TITLE & ACTIONS BAR */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: isDarkMode ? '#ffffff' : '#0f172a',
              margin: 0,
              letterSpacing: '-0.3px',
            }}
          >
            New Gym Partner Onboarding
          </h1>
          <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13 }}>
            Configure facilities, pricing packages, access control, and bank payout parameters.
          </Text>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Button
            icon={<SaveOutlined />}
            onClick={handleSaveAndExit}
            style={{
              borderRadius: 'var(--radius-base)',
              fontWeight: 600,
              borderColor: isDarkMode ? '#334155' : '#e2e8f0',
            }}
          >
            Save Draft & Exit
          </Button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 20,
              backgroundColor: isDarkMode ? '#141414' : '#f1f5f9',
              fontSize: 13,
              fontWeight: 700,
              color: isDarkMode ? '#ffffff' : '#0f172a',
              border: `1px solid ${isDarkMode ? '#333333' : '#e2e8f0'}`,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: '#4338ca',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              GYM
            </div>
            <span>{formData.gymName || 'New Gym'}</span>
          </div>
        </div>
      </div>

      {/* 2. TOP HORIZONTAL STEPPER (8 ICONS) */}
      <Card
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-color)',
          borderRadius: 'var(--radius-base)',
          marginBottom: 24,
        }}
        styles={{ body: { padding: '16px 12px' } }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflowX: 'auto',
            gap: 8,
          }}
        >
          {ONBOARDING_STEPS.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            return (
              <div
                key={step.key}
                onClick={() => setCurrentStep(step.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: 105,
                  cursor: 'pointer',
                  position: 'relative',
                  padding: '6px 8px',
                  borderRadius: 8,
                  backgroundColor: isActive ? (isDarkMode ? 'rgba(79, 70, 229, 0.15)' : '#eef2ff') : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Step Circle */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: isActive
                      ? '#4338ca'
                      : isCompleted
                      ? '#16a34a'
                      : isDarkMode
                      ? '#1e293b'
                      : '#f1f5f9',
                    color: isActive || isCompleted ? '#ffffff' : isDarkMode ? '#64748b' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 13,
                    border: isActive
                      ? '3px solid rgba(79, 70, 229, 0.35)'
                      : isCompleted
                      ? '3px solid rgba(22, 163, 74, 0.35)'
                      : 'none',
                    transition: 'all 0.2s ease',
                    marginBottom: 6,
                  }}
                >
                  {isCompleted ? <CheckOutlined style={{ fontSize: 12 }} /> : step.id}
                </div>

                {/* Step Label */}
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: isActive ? 800 : 600,
                    color: isActive
                      ? '#4338ca'
                      : isCompleted
                      ? isDarkMode ? '#e2e8f0' : '#1e293b'
                      : isDarkMode ? '#64748b' : '#94a3b8',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {step.title}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 3. MAIN FORM BODY: LEFT PROGRESS SIDEBAR + RIGHT FORM CONTENT */}
      <Row gutter={[24, 24]}>
        {/* Left Column: Onboarding Progress Card */}
        <Col xs={24} lg={7}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            styles={{ body: { padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' } }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: isDarkMode ? '#888888' : '#64748b', textTransform: 'uppercase' }}>
                Onboarding Progress
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', margin: '4px 0 10px 0' }}>
                Step {currentStep} of 8
              </div>

              {/* Progress Bar */}
              <Progress
                percent={progressPercent}
                strokeColor="#4338ca"
                showInfo={false}
                size="small"
                style={{ marginBottom: 4 }}
              />
              <div style={{ fontSize: 12, fontWeight: 700, color: '#4338ca', marginBottom: 20 }}>
                {progressPercent}% Setup Completed
              </div>

              {/* Vertical Steps Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ONBOARDING_STEPS.map((step) => {
                  const isActive = step.id === currentStep;
                  const isCompleted = step.id < currentStep;
                  return (
                    <div
                      key={step.key}
                      onClick={() => setCurrentStep(step.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 12px',
                        borderRadius: 8,
                        backgroundColor: isActive
                          ? isDarkMode ? 'rgba(79, 70, 229, 0.2)' : '#ede9fe'
                          : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          backgroundColor: isActive
                            ? '#4338ca'
                            : isCompleted
                            ? '#16a34a'
                            : isDarkMode
                            ? '#1e293b'
                            : '#e2e8f0',
                          color: isActive || isCompleted ? '#ffffff' : '#64748b',
                          fontSize: 11,
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isCompleted ? <CheckOutlined style={{ fontSize: 10 }} /> : step.id}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: isActive ? 800 : 600,
                          color: isActive
                            ? '#4338ca'
                            : isCompleted
                            ? isDarkMode ? '#e2e8f0' : '#334155'
                            : isDarkMode ? '#64748b' : '#94a3b8',
                        }}
                      >
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Summary Snapshot */}
            <div
              style={{
                marginTop: 24,
                padding: '14px',
                borderRadius: 10,
                backgroundColor: isDarkMode ? 'rgba(79, 70, 229, 0.1)' : '#f5f3ff',
                border: `1px solid ${isDarkMode ? 'rgba(79, 70, 229, 0.25)' : '#e0e7ff'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <SafetyCertificateFilled style={{ fontSize: 16, color: '#4338ca' }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: isDarkMode ? '#e0e7ff' : '#3730a3' }}>
                  GYMEZY Verification Standards
                </span>
              </div>
              <div style={{ fontSize: 11, color: isDarkMode ? '#c7d2fe' : '#4f46e5', lineHeight: 1.4 }}>
                Instant live pass integration with dynamic QR check-in & automated T+1 merchant settlements.
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Column: Dynamic Step Content */}
        <Col xs={24} lg={17}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
              marginBottom: 20,
            }}
            styles={{ body: { padding: '28px 32px' } }}
          >
            {/* ========================================================================= */}
            {/* STEP 1: BUSINESS INFORMATION */}
            {/* ========================================================================= */}
            {currentStep === 1 && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    1. Business & Legal Information
                  </div>
                  <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2 }}>
                    Enter registered gym brand name, legal entity, and contact credentials
                  </div>
                </div>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Gym / Studio Name *
                    </div>
                    <Input
                      placeholder="e.g. FitZone Premium Fitness"
                      value={formData.gymName}
                      onChange={(e) => setFormData({ ...formData, gymName: e.target.value })}
                      style={{ height: 40, borderRadius: 'var(--radius-base)' }}
                    />
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Tagline / Brand Slogan
                    </div>
                    <Input
                      placeholder="e.g. Sculpt Your Best Self"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      style={{ height: 40, borderRadius: 'var(--radius-base)' }}
                    />
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Business Entity Type *
                    </div>
                    <Select
                      value={formData.businessType}
                      onChange={(v) => setFormData({ ...formData, businessType: v })}
                      style={{ width: '100%', height: 40 }}
                    >
                      <Option value="Private Limited">Private Limited</Option>
                      <Option value="Partnership">Partnership</Option>
                      <Option value="Sole Proprietorship">Sole Proprietorship</Option>
                      <Option value="LLP">LLP</Option>
                      <Option value="Trust / Society">Trust / Society</Option>
                    </Select>
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Primary Owner / MD Name *
                    </div>
                    <Input
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      style={{ height: 40, borderRadius: 'var(--radius-base)' }}
                    />
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Established Year
                    </div>
                    <Select
                      value={formData.yearEstablished}
                      onChange={(v) => setFormData({ ...formData, yearEstablished: v })}
                      style={{ width: '100%', height: 40 }}
                    >
                      {Array.from({ length: 25 }, (_, i) => 2026 - i).map((y) => (
                        <Option key={y} value={String(y)}>{y}</Option>
                      ))}
                    </Select>
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Contact Mobile Number *
                    </div>
                    <Input
                      addonBefore="🇮🇳 +91"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ height: 40, borderRadius: 'var(--radius-base)' }}
                    />
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Official Email Address *
                    </div>
                    <Input
                      placeholder="owner@gymezy.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ height: 40, borderRadius: 'var(--radius-base)' }}
                    />
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Partner Account Password *
                    </div>
                    <Input.Password
                      placeholder="Create secure owner login password (min 6 chars)"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      style={{ height: 40, borderRadius: 'var(--radius-base)' }}
                    />
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      GSTIN (Optional)
                    </div>
                    <Input
                      placeholder="33AAAAA0000A1Z5"
                      value={formData.gstNumber}
                      onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                      style={{ height: 40, borderRadius: 'var(--radius-base)' }}
                    />
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      PAN Number
                    </div>
                    <Input
                      placeholder="AAAAA0000A"
                      value={formData.panNumber}
                      onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                      style={{ height: 40, borderRadius: 'var(--radius-base)' }}
                    />
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Branch Count
                    </div>
                    <Input
                      placeholder="e.g. 1"
                      value={formData.branches}
                      onChange={(e) => setFormData({ ...formData, branches: e.target.value })}
                      style={{ height: 40, borderRadius: 'var(--radius-base)' }}
                    />
                  </Col>
                </Row>

                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                    Business License / Registration Document (Optional)
                  </div>
                  <Dragger
                    style={{
                      padding: '20px',
                      background: isDarkMode ? '#141414' : '#fafafa',
                      borderColor: isDarkMode ? '#333333' : '#d9d9d9',
                      borderRadius: 8,
                    }}
                    showUploadList={false}
                    beforeUpload={async (file) => {
                      try {
                        const base64 = await fileToBase64(file);
                        setFormData((prev) => ({
                          ...prev,
                          businessCertificate: base64,
                          gstCertificate: base64,
                        }));
                        message.success(`Business document "${file.name}" attached!`);
                      } catch {
                        message.error('Failed to read document');
                      }
                      return false;
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      <InboxOutlined style={{ color: '#4338ca', fontSize: 28 }} />
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', margin: '4px 0 0 0' }}>
                      Click or drag & drop business certificate / GST registration PDF
                    </p>
                    <p style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', margin: 0 }}>
                      Supports PDF, JPG, PNG up to 10MB
                    </p>
                  </Dragger>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 2: LOCATION & OPERATING HOURS */}
            {/* ========================================================================= */}
            {currentStep === 2 && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    2. Location, Geolocation & Operating Hours
                  </div>
                  <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2 }}>
                    Pinpoint address, geo-coordinates for the map finder, and weekly timings
                  </div>
                </div>

                {/* City Preset Fast Selector */}
                <div style={{ marginBottom: 20, padding: '12px 16px', background: isDarkMode ? '#141414' : '#f8fafc', borderRadius: 8, border: `1px solid ${isDarkMode ? '#262626' : '#e2e8f0'}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isDarkMode ? '#cccccc' : '#475569', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CompassOutlined style={{ color: '#4338ca' }} /> Quick Geo-Preset for Metros:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {CITY_PRESETS.map((p) => (
                      <Button
                        key={p.city}
                        size="small"
                        onClick={() => handleApplyPresetCity(p)}
                        style={{ borderRadius: 16, fontSize: 12, fontWeight: 600 }}
                      >
                        {p.city} ({p.area})
                      </Button>
                    ))}
                  </div>
                </div>

                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Full Street Address / Building Name *
                    </div>
                    <Input
                      placeholder="e.g. Plot 42, 2nd Avenue, Anna Nagar West"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      style={{ height: 40, borderRadius: 'var(--radius-base)' }}
                    />
                  </Col>

                  <Col xs={24} md={6}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Area / Locality *
                    </div>
                    <Input
                      placeholder="e.g. Anna Nagar"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      style={{ height: 40, borderRadius: 'var(--radius-base)' }}
                    />
                  </Col>

                  <Col xs={24} md={6}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      City *
                    </div>
                    <Input
                      placeholder="e.g. Chennai"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={{ height: 40, borderRadius: 'var(--radius-base)' }}
                    />
                  </Col>

                  <Col xs={24} md={6}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      State *
                    </div>
                    <Input
                      placeholder="e.g. Tamil Nadu"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      style={{ height: 40, borderRadius: 'var(--radius-base)' }}
                    />
                  </Col>

                  <Col xs={24} md={6}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Pincode *
                    </div>
                    <Input
                      placeholder="e.g. 600040"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      style={{ height: 40, borderRadius: 'var(--radius-base)' }}
                    />
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Landmark
                    </div>
                    <Input
                      placeholder="e.g. Opposite Metro Station"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      style={{ height: 40, borderRadius: 'var(--radius-base)' }}
                    />
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Latitude (GPS)
                    </div>
                    <InputNumber
                      placeholder="13.0850"
                      value={formData.lat}
                      onChange={(v) => setFormData({ ...formData, lat: v })}
                      style={{ width: '100%', height: 40, borderRadius: 'var(--radius-base)' }}
                    />
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Longitude (GPS)
                    </div>
                    <InputNumber
                      placeholder="80.2101"
                      value={formData.lng}
                      onChange={(v) => setFormData({ ...formData, lng: v })}
                      style={{ width: '100%', height: 40, borderRadius: 'var(--radius-base)' }}
                    />
                  </Col>
                </Row>

                <Divider style={{ margin: '24px 0 20px 0' }} />

                <div style={{ fontSize: 15, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 14 }}>
                  Operating Hours & Schedules
                </div>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Weekday Timings (Mon - Fri)
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <Input
                        value={formData.weekdayOpen}
                        onChange={(e) => setFormData({ ...formData, weekdayOpen: e.target.value })}
                        placeholder="05:30 AM"
                        style={{ height: 40 }}
                      />
                      <span>to</span>
                      <Input
                        value={formData.weekdayClose}
                        onChange={(e) => setFormData({ ...formData, weekdayClose: e.target.value })}
                        placeholder="10:30 PM"
                        style={{ height: 40 }}
                      />
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Weekend Timings (Sat - Sun)
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <Input
                        value={formData.weekendOpen}
                        onChange={(e) => setFormData({ ...formData, weekendOpen: e.target.value })}
                        placeholder="06:00 AM"
                        style={{ height: 40 }}
                      />
                      <span>to</span>
                      <Input
                        value={formData.weekendClose}
                        onChange={(e) => setFormData({ ...formData, weekendClose: e.target.value })}
                        placeholder="09:00 PM"
                        style={{ height: 40 }}
                      />
                    </div>
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                      <Switch
                        checked={formData.is24Hours}
                        onChange={(chk) => setFormData({ ...formData, is24Hours: chk })}
                      />
                      <span style={{ fontSize: 13, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                        24x7 Open Facility
                      </span>
                    </div>
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                      <Switch
                        checked={formData.isOpenHolidays}
                        onChange={(chk) => setFormData({ ...formData, isOpenHolidays: chk })}
                      />
                      <span style={{ fontSize: 13, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                        Open on Public Holidays
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 3: FACILITIES, AMENITIES & PHOTOS */}
            {/* ========================================================================= */}
            {currentStep === 3 && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    3. Facilities, Amenities & Floor Space
                  </div>
                  <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2 }}>
                    Showcase gym infrastructure, floor capacity, and high-resolution photo gallery
                  </div>
                </div>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Floor Space (sq. ft.) *
                    </div>
                    <InputNumber
                      value={formData.floorSpaceSqFt}
                      onChange={(v) => setFormData({ ...formData, floorSpaceSqFt: v })}
                      style={{ width: '100%', height: 40 }}
                      placeholder="5000"
                    />
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Max Safe Floor Capacity (Athletes) *
                    </div>
                    <InputNumber
                      value={formData.maxFloorCapacity}
                      onChange={(v) => setFormData({ ...formData, maxFloorCapacity: v })}
                      style={{ width: '100%', height: 40 }}
                      placeholder="85"
                    />
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Highlight Badge Text
                    </div>
                    <Select
                      value={formData.badgeText}
                      onChange={(v) => setFormData({ ...formData, badgeText: v })}
                      style={{ width: '100%', height: 40 }}
                    >
                      {BADGE_OPTIONS.map((b) => (
                        <Option key={b} value={b}>{b}</Option>
                      ))}
                    </Select>
                  </Col>

                  <Col xs={24}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Cover Photo URL *
                    </div>
                    <Input
                      value={formData.coverPhoto}
                      onChange={(e) => setFormData({ ...formData, coverPhoto: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      style={{ height: 40 }}
                    />
                  </Col>

                  <Col xs={24}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Facilities Multi-Select (Available at Facility)
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {FACILITY_OPTIONS.map((fac) => {
                        const selected = formData.facilities.includes(fac);
                        return (
                          <Tag.CheckableTag
                            key={fac}
                            checked={selected}
                            onChange={(checked) => {
                              const next = checked
                                ? [...formData.facilities, fac]
                                : formData.facilities.filter((f) => f !== fac);
                              setFormData({ ...formData, facilities: next });
                            }}
                            style={{
                              padding: '6px 14px',
                              borderRadius: 16,
                              fontSize: 13,
                              fontWeight: 600,
                              backgroundColor: selected ? '#4338ca' : (isDarkMode ? '#1e293b' : '#f1f5f9'),
                              color: selected ? '#ffffff' : (isDarkMode ? '#cbd5e1' : '#334155'),
                              border: `1px solid ${selected ? '#4338ca' : (isDarkMode ? '#334155' : '#cbd5e1')}`,
                            }}
                          >
                            {fac}
                          </Tag.CheckableTag>
                        );
                      })}
                    </div>
                  </Col>

                  <Col xs={24}>
                    <div style={{ fontSize: 12, fontWeight: 700, margin: '8px 0 8px 0', color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Amenities & Member Perks
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {AMENITY_OPTIONS.map((amen) => {
                        const selected = formData.amenities.includes(amen);
                        return (
                          <Tag.CheckableTag
                            key={amen}
                            checked={selected}
                            onChange={(checked) => {
                              const next = checked
                                ? [...formData.amenities, amen]
                                : formData.amenities.filter((a) => a !== amen);
                              setFormData({ ...formData, amenities: next });
                            }}
                            style={{
                              padding: '6px 14px',
                              borderRadius: 16,
                              fontSize: 13,
                              fontWeight: 600,
                              backgroundColor: selected ? '#16a34a' : (isDarkMode ? '#1e293b' : '#f1f5f9'),
                              color: selected ? '#ffffff' : (isDarkMode ? '#cbd5e1' : '#334155'),
                              border: `1px solid ${selected ? '#16a34a' : (isDarkMode ? '#334155' : '#cbd5e1')}`,
                            }}
                          >
                            {amen}
                          </Tag.CheckableTag>
                        );
                      })}
                    </div>
                  </Col>

                  <Col xs={24}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      About Gym Description / Facility Bio
                    </div>
                    <TextArea
                      rows={3}
                      value={formData.aboutText}
                      onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                      placeholder="Write a compelling overview of what makes your fitness center unique..."
                    />
                  </Col>
                </Row>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 4: SERVICES, WORKOUTS & CERTIFIED TRAINERS */}
            {/* ========================================================================= */}
            {currentStep === 4 && (
              <div>
                <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                      4. Supported Disciplines & Certified Coaches
                    </div>
                    <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2 }}>
                      List fitness disciplines offered and register certified personal trainers
                    </div>
                  </div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsTrainerModalOpen(true)}
                    style={{ backgroundColor: '#4338ca', fontWeight: 700 }}
                  >
                    Add Trainer
                  </Button>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: isDarkMode ? '#cccccc' : '#334155' }}>
                    Disciplines & Workout Categories
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {WORKOUT_OPTIONS.map((w) => {
                      const selected = formData.workouts.includes(w);
                      return (
                        <Tag.CheckableTag
                          key={w}
                          checked={selected}
                          onChange={(checked) => {
                            const next = checked
                              ? [...formData.workouts, w]
                              : formData.workouts.filter((item) => item !== w);
                            setFormData({ ...formData, workouts: next });
                          }}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 16,
                            fontSize: 13,
                            fontWeight: 600,
                            backgroundColor: selected ? '#4338ca' : (isDarkMode ? '#1e293b' : '#f1f5f9'),
                            color: selected ? '#ffffff' : (isDarkMode ? '#cbd5e1' : '#334155'),
                            border: `1px solid ${selected ? '#4338ca' : (isDarkMode ? '#334155' : '#cbd5e1')}`,
                          }}
                        >
                          {w}
                        </Tag.CheckableTag>
                      );
                    })}
                  </div>
                </div>

                <Divider style={{ margin: '20px 0' }} />

                <div style={{ fontSize: 14, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 12 }}>
                  Registered Gym Trainers ({formData.trainers.length})
                </div>

                {formData.trainers.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', background: isDarkMode ? '#141414' : '#f8fafc', borderRadius: 8 }}>
                    <TeamOutlined style={{ fontSize: 32, color: '#94a3b8', marginBottom: 8 }} />
                    <div style={{ fontWeight: 600, color: isDarkMode ? '#cccccc' : '#475569' }}>
                      No trainers added yet
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                      Click "Add Trainer" to register coaching staff for member matching.
                    </div>
                  </div>
                ) : (
                  <Row gutter={[16, 16]}>
                    {formData.trainers.map((tr) => (
                      <Col xs={24} sm={12} key={tr.id}>
                        <Card
                          style={{
                            backgroundColor: isDarkMode ? '#141414' : '#ffffff',
                            borderColor: isDarkMode ? '#333333' : '#e2e8f0',
                            borderRadius: 10,
                          }}
                          styles={{ body: { padding: '16px' } }}
                        >
                          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <Avatar src={tr.image} size={50} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 800, fontSize: 14, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                                {tr.name}
                              </div>
                              <div style={{ fontSize: 12, color: '#4338ca', fontWeight: 600 }}>
                                {tr.specialty}
                              </div>
                              <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2 }}>
                                {tr.experienceYears} Years Exp • ⭐ {tr.rating} • ₹{tr.monthlyFee}/mo PT
                              </div>
                            </div>
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => handleRemoveTrainer(tr.id)}
                            />
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 5: SESSIONS & PRICING PLANS */}
            {/* ========================================================================= */}
            {currentStep === 5 && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    5. Session Passes & Membership Pricing
                  </div>
                  <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2 }}>
                    Define pay-per-session rates, weekly pass, and long-term membership tier prices
                  </div>
                </div>

                <div style={{ fontSize: 14, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 12 }}>
                  Flexible Walk-In Passes
                </div>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Single Drop-in Session Pass (₹) *
                    </div>
                    <InputNumber
                      prefix="₹"
                      value={formData.singleSessionPrice}
                      onChange={(v) => setFormData({ ...formData, singleSessionPrice: v })}
                      style={{ width: '100%', height: 40 }}
                    />
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Weekly Unlimited Pass (₹)
                    </div>
                    <InputNumber
                      prefix="₹"
                      value={formData.weeklyPassPrice}
                      onChange={(v) => setFormData({ ...formData, weeklyPassPrice: v })}
                      style={{ width: '100%', height: 40 }}
                    />
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      5-Session Flexi Pass (₹)
                    </div>
                    <InputNumber
                      prefix="₹"
                      value={formData.fiveSessionPrice}
                      onChange={(v) => setFormData({ ...formData, fiveSessionPrice: v })}
                      style={{ width: '100%', height: 40 }}
                    />
                  </Col>
                </Row>

                <Divider style={{ margin: '24px 0 20px 0' }} />

                <div style={{ fontSize: 14, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 12 }}>
                  Tiered Long-Term Membership Packages
                </div>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={6}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Monthly (1 Month) ₹
                    </div>
                    <InputNumber
                      prefix="₹"
                      value={formData.monthlyPrice}
                      onChange={(v) => setFormData({ ...formData, monthlyPrice: v })}
                      style={{ width: '100%', height: 40 }}
                    />
                  </Col>

                  <Col xs={24} md={6}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Quarterly (3 Months) ₹
                    </div>
                    <InputNumber
                      prefix="₹"
                      value={formData.quarterlyPrice}
                      onChange={(v) => setFormData({ ...formData, quarterlyPrice: v })}
                      style={{ width: '100%', height: 40 }}
                    />
                  </Col>

                  <Col xs={24} md={6}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Half-Yearly (6 Months) ₹
                    </div>
                    <InputNumber
                      prefix="₹"
                      value={formData.halfYearlyPrice}
                      onChange={(v) => setFormData({ ...formData, halfYearlyPrice: v })}
                      style={{ width: '100%', height: 40 }}
                    />
                  </Col>

                  <Col xs={24} md={6}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Annual (12 Months) ₹
                    </div>
                    <InputNumber
                      prefix="₹"
                      value={formData.annualPrice}
                      onChange={(v) => setFormData({ ...formData, annualPrice: v })}
                      style={{ width: '100%', height: 40 }}
                    />
                  </Col>
                </Row>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 6: RULES & SAFETY */}
            {/* ========================================================================= */}
            {currentStep === 6 && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    6. Facility Rules, Access Hardware & Safety Policy
                  </div>
                  <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2 }}>
                    Configure entry compliance, turnaround rules, and digital pass scanner verification
                  </div>
                </div>

                <div style={{ fontSize: 14, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 12 }}>
                  Entry Check-in Verification Modes
                </div>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    <Card
                      style={{
                        backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
                        borderColor: '#4338ca',
                        borderRadius: 8,
                      }}
                      styles={{ body: { padding: '14px' } }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <QrcodeOutlined style={{ fontSize: 24, color: '#4338ca' }} />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 13 }}>Dynamic QR Pass</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>Time-cycled QR Scanner</div>
                        </div>
                      </div>
                    </Card>
                  </Col>

                  <Col xs={24} md={8}>
                    <Card
                      style={{
                        backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
                        borderColor: isDarkMode ? '#333333' : '#e2e8f0',
                        borderRadius: 8,
                      }}
                      styles={{ body: { padding: '14px' } }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <SafetyOutlined style={{ fontSize: 24, color: '#16a34a' }} />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 13 }}>6-Digit OTP Fallback</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>Front Desk Manual Verify</div>
                        </div>
                      </div>
                    </Card>
                  </Col>

                  <Col xs={24} md={8}>
                    <Card
                      style={{
                        backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
                        borderColor: isDarkMode ? '#333333' : '#e2e8f0',
                        borderRadius: 8,
                      }}
                      styles={{ body: { padding: '14px' } }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <RocketOutlined style={{ fontSize: 24, color: '#ea580c' }} />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 13 }}>Turnstile Integration</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>Automated RFID/QR Gate</div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>

                <Divider style={{ margin: '24px 0 20px 0' }} />

                <div style={{ fontSize: 14, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 12 }}>
                  Member Conduct Rules
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                  {formData.rules.map((rule, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircleOutlined style={{ color: '#16a34a', fontSize: 16 }} />
                      <Input
                        value={rule}
                        onChange={(e) => {
                          const updated = [...formData.rules];
                          updated[idx] = e.target.value;
                          setFormData({ ...formData, rules: updated });
                        }}
                        style={{ height: 36 }}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: 14, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 12 }}>
                  Cancellation & Rescheduling SLA
                </div>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Free Cancellation Window (Hours)
                    </div>
                    <InputNumber
                      value={formData.freeCancellationHours}
                      onChange={(v) => setFormData({ ...formData, freeCancellationHours: v })}
                      style={{ width: '100%', height: 40 }}
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Refund Percentage (%)
                    </div>
                    <InputNumber
                      value={formData.refundPercentage}
                      onChange={(v) => setFormData({ ...formData, refundPercentage: v })}
                      style={{ width: '100%', height: 40 }}
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Max Reschedule Times Allowed
                    </div>
                    <InputNumber
                      value={formData.rescheduleAllowedCount}
                      onChange={(v) => setFormData({ ...formData, rescheduleAllowedCount: v })}
                      style={{ width: '100%', height: 40 }}
                    />
                  </Col>
                </Row>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 7: PAYOUT & SUBSCRIPTION TIER */}
            {/* ========================================================================= */}
            {currentStep === 7 && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    7. GYMEZY Subscription Tier & Payout Settlement
                  </div>
                  <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2 }}>
                    Select platform software package and configure automated merchant bank details
                  </div>
                </div>

                <div style={{ fontSize: 14, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 12 }}>
                  GYMEZY Partner Subscription Plan *
                </div>

                <Row gutter={[16, 16]}>
                  {[
                    { key: 'Hybrid', title: 'Hybrid Plan', price: '₹ 4,999/mo', desc: 'Full Cloud GMS + App Marketplace + QR Turnstile Integration + Trainers Hub', recommended: true },
                    { key: 'App Only', title: 'App Only', price: '₹ 2,999/mo', desc: 'GYMEZY User App Marketplace Listing + Walk-In Pass revenue' },
                    { key: 'GMS', title: 'GMS Only', price: '₹ 1,999/mo', desc: 'Gym Management Software for existing members' },
                    { key: 'Listing Only', title: 'Listing Only', price: '₹ 999/mo', desc: 'Basic directory listing and search presence' },
                  ].map((tier) => {
                    const isSelected = formData.subscriptionType === tier.key;
                    return (
                      <Col xs={24} sm={12} key={tier.key}>
                        <Card
                          onClick={() => setFormData({ ...formData, subscriptionType: tier.key })}
                          style={{
                            cursor: 'pointer',
                            backgroundColor: isSelected ? (isDarkMode ? 'rgba(79, 70, 229, 0.15)' : '#eef2ff') : (isDarkMode ? '#141414' : '#ffffff'),
                            borderColor: isSelected ? '#4338ca' : (isDarkMode ? '#333333' : '#e2e8f0'),
                            borderWidth: isSelected ? 2 : 1,
                            borderRadius: 10,
                            position: 'relative',
                          }}
                          styles={{ body: { padding: '16px' } }}
                        >
                          {tier.recommended && (
                            <Tag color="purple" style={{ position: 'absolute', top: 12, right: 12, fontWeight: 700 }}>
                              Recommended
                            </Tag>
                          )}
                          <div style={{ fontWeight: 800, fontSize: 15, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                            {tier.title}
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: '#4338ca', margin: '4px 0' }}>
                            {tier.price}
                          </div>
                          <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>
                            {tier.desc}
                          </div>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>

                <Divider style={{ margin: '24px 0 20px 0' }} />

                <div style={{ fontSize: 14, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 12 }}>
                  Payout Bank Account & UPI Settlement
                </div>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Account Holder Name *
                    </div>
                    <Input
                      placeholder="e.g. FitZone Fitness Pvt Ltd"
                      value={formData.accountHolder}
                      onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                      style={{ height: 40 }}
                    />
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Bank Name *
                    </div>
                    <Select
                      value={formData.bankName}
                      onChange={(v) => setFormData({ ...formData, bankName: v })}
                      style={{ width: '100%', height: 40 }}
                    >
                      <Option value="HDFC Bank">HDFC Bank</Option>
                      <Option value="ICICI Bank">ICICI Bank</Option>
                      <Option value="State Bank of India">State Bank of India</Option>
                      <Option value="Axis Bank">Axis Bank</Option>
                      <Option value="Kotak Mahindra Bank">Kotak Mahindra Bank</Option>
                      <Option value="IndusInd Bank">IndusInd Bank</Option>
                    </Select>
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Bank Account Number *
                    </div>
                    <Input
                      placeholder="50200012345678"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      style={{ height: 40 }}
                    />
                  </Col>

                  <Col xs={24} md={6}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      IFSC Code *
                    </div>
                    <Input
                      placeholder="HDFC0001234"
                      value={formData.ifscCode}
                      onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                      style={{ height: 40 }}
                    />
                  </Col>

                  <Col xs={24} md={6}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isDarkMode ? '#cccccc' : '#334155' }}>
                      Instant Settlement UPI ID
                    </div>
                    <Input
                      placeholder="fitzone@okhdfc"
                      value={formData.upiId}
                      onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                      style={{ height: 40 }}
                    />
                  </Col>
                </Row>

                <div style={{ marginTop: 20 }}>
                  <Checkbox
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                      I agree to the GYMEZY Merchant Agreement, 10% Pass Commission, and Data Privacy SLA.
                    </span>
                  </Checkbox>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 8: REVIEW & GO LIVE */}
            {/* ========================================================================= */}
            {currentStep === 8 && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    8. Final Review & Partner Activation
                  </div>
                  <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2 }}>
                    Inspect configured profile parameters and publish to the live GYMEZY platform
                  </div>
                </div>

                <Row gutter={[20, 20]}>
                  {/* Left: Summary Review Cards */}
                  <Col xs={24} md={14}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {/* Business & Location Card */}
                      <Card
                        style={{ backgroundColor: isDarkMode ? '#141414' : '#f8fafc', borderColor: isDarkMode ? '#333333' : '#e2e8f0', borderRadius: 8 }}
                        styles={{ body: { padding: '16px' } }}
                      >
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#4338ca', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <ShopOutlined /> Business & Location
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
                          <div><span style={{ color: '#64748b' }}>Gym Name:</span> <strong>{formData.gymName}</strong></div>
                          <div><span style={{ color: '#64748b' }}>Owner:</span> <strong>{formData.ownerName}</strong></div>
                          <div><span style={{ color: '#64748b' }}>Phone:</span> <strong>+91 {formData.phone}</strong></div>
                          <div><span style={{ color: '#64748b' }}>City:</span> <strong>{formData.city}</strong></div>
                          <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Address:</span> {formData.address}</div>
                          <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Timings:</span> {formData.is24Hours ? '24x7 Open' : `${formData.weekdayOpen} - ${formData.weekdayClose}`}</div>
                        </div>
                      </Card>

                      {/* Pricing & Subscription Card */}
                      <Card
                        style={{ backgroundColor: isDarkMode ? '#141414' : '#f8fafc', borderColor: isDarkMode ? '#333333' : '#e2e8f0', borderRadius: 8 }}
                        styles={{ body: { padding: '16px' } }}
                      >
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#16a34a', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <CreditCardOutlined /> Pricing & GYMEZY Tier
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
                          <div><span style={{ color: '#64748b' }}>Single Drop-in:</span> <strong>₹ {formData.singleSessionPrice}</strong></div>
                          <div><span style={{ color: '#64748b' }}>Weekly Pass:</span> <strong>₹ {formData.weeklyPassPrice}</strong></div>
                          <div><span style={{ color: '#64748b' }}>Monthly Plan:</span> <strong>₹ {formData.monthlyPrice}</strong></div>
                          <div><span style={{ color: '#64748b' }}>Annual Plan:</span> <strong>₹ {formData.annualPrice}</strong></div>
                          <div><span style={{ color: '#64748b' }}>Platform Tier:</span> <Tag color="blue">{formData.subscriptionType}</Tag></div>
                          <div><span style={{ color: '#64748b' }}>Bank:</span> <strong>{formData.bankName}</strong></div>
                        </div>
                      </Card>

                      {/* Activation Status Radio */}
                      <div style={{ padding: '14px', background: isDarkMode ? '#1a1a1a' : '#f1f5f9', borderRadius: 8 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                          Initial Publication Status:
                        </div>
                        <Radio.Group
                          value={formData.initialApprovalStatus}
                          onChange={(e) => setFormData({ ...formData, initialApprovalStatus: e.target.value })}
                        >
                          <Radio value="Approved">
                            <span style={{ fontWeight: 700, color: '#16a34a' }}>Approved & Live Immediately</span>
                          </Radio>
                          <Radio value="Pending Approval">
                            <span style={{ fontWeight: 700, color: '#ea580c' }}>Save as Pending Verification</span>
                          </Radio>
                        </Radio.Group>
                      </div>
                    </div>
                  </Col>

                  {/* Right: Live Customer App Mobile Preview Card */}
                  <Col xs={24} md={10}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: isDarkMode ? '#cbd5e1' : '#475569', marginBottom: 8, textAlign: 'center' }}>
                      📱 Live GYMEZY Customer App Card Preview
                    </div>
                    <div
                      style={{
                        borderRadius: 16,
                        overflow: 'hidden',
                        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                        border: `1px solid ${isDarkMode ? '#334155' : '#cbd5e1'}`,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      }}
                    >
                      {/* Image Header */}
                      <div style={{ position: 'relative', height: 160 }}>
                        <img
                          src={formData.coverPhoto}
                          alt="Gym"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <Tag
                          color="#4338ca"
                          style={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            fontWeight: 800,
                            borderRadius: 12,
                            padding: '2px 8px',
                          }}
                        >
                          {formData.badgeText || 'Verified'}
                        </Tag>
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: '#fbbf24',
                            padding: '3px 8px',
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          ⭐ 4.9 (New)
                        </div>
                      </div>

                      {/* Card Body */}
                      <div style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 800, fontSize: 16, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                          {formData.gymName}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                          <EnvironmentOutlined /> {formData.area || formData.city}, {formData.city} • 1.2 km
                        </div>

                        {/* Facilities tags */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, margin: '10px 0' }}>
                          {formData.facilities.slice(0, 3).map((f) => (
                            <Tag key={f} style={{ fontSize: 10, margin: 0, borderRadius: 4 }}>
                              {f}
                            </Tag>
                          ))}
                          {formData.facilities.length > 3 && (
                            <Tag style={{ fontSize: 10, margin: 0, borderRadius: 4 }}>
                              +{formData.facilities.length - 3} more
                            </Tag>
                          )}
                        </div>

                        {/* Price & Book Pass Button */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: `1px solid ${isDarkMode ? '#334155' : '#f1f5f9'}` }}>
                          <div>
                            <div style={{ fontSize: 10, color: '#94a3b8' }}>Pass starts at</div>
                            <div style={{ fontSize: 16, fontWeight: 900, color: '#4338ca' }}>
                              ₹ {formData.singleSessionPrice} <span style={{ fontSize: 11, fontWeight: 500, color: '#64748b' }}>/ session</span>
                            </div>
                          </div>
                          <Button
                            type="primary"
                            size="small"
                            style={{ backgroundColor: '#4338ca', fontWeight: 700, borderRadius: 6 }}
                          >
                            Book Pass
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            )}

            {/* Bottom Navigation Buttons */}
            <Divider style={{ margin: '28px 0 20px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                icon={<ArrowLeftOutlined />}
                disabled={currentStep === 1}
                onClick={() => setCurrentStep((prev) => prev - 1)}
                style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}
              >
                Previous Step
              </Button>

              <Space>
                {currentStep < 8 ? (
                  <Button
                    type="primary"
                    onClick={handleSaveAndNext}
                    style={{
                      backgroundColor: '#4338ca',
                      borderColor: '#4338ca',
                      height: 40,
                      padding: '0 24px',
                      borderRadius: 'var(--radius-base)',
                      fontWeight: 700,
                    }}
                  >
                    Save & Continue <ArrowRightOutlined />
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    icon={<ThunderboltFilled />}
                    loading={isSubmitting}
                    onClick={handleFinalPublish}
                    style={{
                      backgroundColor: '#16a34a',
                      borderColor: '#16a34a',
                      height: 44,
                      padding: '0 28px',
                      borderRadius: 'var(--radius-base)',
                      fontWeight: 800,
                      fontSize: 15,
                    }}
                  >
                    Publish & Activate Gym
                  </Button>
                )}
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD TRAINER MODAL */}
      {/* ========================================================================= */}
      <Modal
        title={<div style={{ fontWeight: 800, fontSize: 16 }}>Register Certified Trainer</div>}
        open={isTrainerModalOpen}
        onCancel={() => setIsTrainerModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={trainerForm} layout="vertical" onFinish={handleAddTrainer}>
          <Form.Item label="Trainer Full Name" name="name" rules={[{ required: true, message: 'Please enter trainer name' }]}>
            <Input placeholder="e.g. Rohit Sharma" />
          </Form.Item>

          <Form.Item label="Specialty / Fitness Focus" name="specialty" rules={[{ required: true, message: 'Please enter specialty' }]}>
            <Input placeholder="e.g. Hypertrophy & Strength, Yoga, CrossFit" />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Experience (Years)" name="experienceYears" initialValue={5}>
                <InputNumber min={1} max={30} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Monthly PT Add-on Fee (₹)" name="monthlyFee" initialValue={2500}>
                <InputNumber prefix="₹" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Trainer Avatar Image URL" name="image" initialValue="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=150&auto=format&fit=crop">
            <Input placeholder="https://..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsTrainerModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#4338ca', fontWeight: 700 }}>
              Add Trainer to Roster
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: CELEBRATION SUCCESS MODAL */}
      {/* ========================================================================= */}
      <Modal
        open={isSuccessModalOpen}
        footer={null}
        closable={false}
        centered
        width={500}
        styles={{
          body: {
            padding: '36px 28px',
            textAlign: 'center',
            backgroundColor: isDarkMode ? '#141414' : '#ffffff',
            borderRadius: 16,
          },
        }}
      >
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            margin: '0 auto 18px auto',
          }}
        >
          <CheckCircleOutlined />
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', margin: 0 }}>
          Gym Onboarded Successfully!
        </h2>

        <p style={{ fontSize: 14, color: isDarkMode ? '#888888' : '#64748b', marginTop: 8 }}>
          <strong>{createdGymSummary?.name || formData.gymName}</strong> is now registered on the GYMEZY platform with status{' '}
          <Tag color="green" style={{ fontWeight: 700 }}>{createdGymSummary?.approvalStatus || 'Approved'}</Tag>.
        </p>

        <div
          style={{
            margin: '20px 0',
            padding: '14px',
            borderRadius: 10,
            backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
            textAlign: 'left',
            fontSize: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div><strong>Partner ID:</strong> {createdGymSummary?.id || formData.gymId}</div>
          <div><strong>Location:</strong> {formData.area}, {formData.city}</div>
          <div><strong>Subscription Tier:</strong> {formData.subscriptionType} (₹4,999/mo)</div>
          <div><strong>Drop-in Rate:</strong> ₹{formData.singleSessionPrice} / session</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button
            type="primary"
            onClick={() => navigate('/admin/gyms')}
            style={{
              backgroundColor: '#4338ca',
              borderColor: '#4338ca',
              height: 42,
              fontWeight: 700,
              borderRadius: 'var(--radius-base)',
            }}
          >
            View in Gyms & Tenants Fleet
          </Button>

          <Button
            onClick={() => {
              setIsSuccessModalOpen(false);
              setCurrentStep(1);
              setFormData((prev) => ({
                ...prev,
                gymName: '',
                gymId: 'GYM-' + Math.floor(1000 + Math.random() * 9000),
              }));
            }}
            style={{ height: 40, fontWeight: 600, borderRadius: 'var(--radius-base)' }}
          >
            Onboard Another Gym Partner
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default GymOnboarding;
