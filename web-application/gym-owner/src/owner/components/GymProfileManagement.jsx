import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateGymProfile } from '../../redux/slices/gymSlice';
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
  Upload,
  Switch,
  Table,
  Badge,
  InputNumber,
  TimePicker,
  Tooltip,
  Checkbox,
  Image,
  DatePicker,
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
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  PictureOutlined,
  BarChartOutlined,
  ArrowRightOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  DownOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
  RiseOutlined,
  ShopOutlined,
  DollarCircleOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  IdcardOutlined,
  AppstoreOutlined,
  MobileOutlined,
  EyeOutlined,
  DeleteOutlined,
  WhatsAppOutlined,
  InstagramOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  BankOutlined,
  CreditCardOutlined,
  ToolOutlined,
  BellOutlined,
  LockOutlined,
  UnlockOutlined,
  FireOutlined,
  CheckOutlined,
  SwapOutlined,
  SaveOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import confetti from 'canvas-confetti';
import { useTheme } from '../../theme/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Initial Gym Profile Data
export const INITIAL_GYM_PROFILE = {
  name: 'FitZone Gym',
  logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop',
  status: 'Active',
  address: 'No. 15, 2nd Avenue, Anna Nagar, Chennai, Tamil Nadu - 600040',
  shortAddress: 'Anna Nagar, Chennai, Tamil Nadu - 600040',
  phone: '+91 98765 43210',
  email: 'fitzonegym@gmail.com',
  website: 'www.fitzonegym.com',
  about:
    'We provide world-class equipment, certified trainers, personalized workout plans, and a motivating environment to help you transform.',
  description:
    'FitZone Gym is committed to providing the best fitness experience with advanced equipment, expert guidance and flexible membership options for every fitness enthusiast.',
  joinedOn: '15 May 2024',
  memberSince: '1 Year 2 Months',
  gymType: 'Commercial Gym',
  gstNumber: '33ABCDE1234F1Z5',
  establishedOn: '01 Jan 2020',
  ownershipType: 'Sole Proprietorship',
  area: '3500 Sq.ft',
  totalEquipment: '45',
  trainerCount: '5',
  genderAllowed: 'Male & Female',
  coverPhoto:
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
  gallery: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=500&auto=format&fit=crop',
  ],
};

// Initial Facilities Data
const INITIAL_FACILITIES = [
  { id: '1', name: 'Cardio Studio & Treadmills', category: 'Cardio', status: 'Active', count: 14, icon: <FireOutlined /> },
  { id: '2', name: 'Heavy Free Weights (2.5kg - 50kg)', category: 'Strength', status: 'Active', count: 28, icon: <ToolOutlined /> },
  { id: '3', name: 'Olympic Squat & Deadlift Platforms', category: 'Strength', status: 'Active', count: 4, icon: <CrownOutlined /> },
  { id: '4', name: 'Functional Crossfit Rig & Turf', category: 'Functional', status: 'Active', count: 2, icon: <AppstoreOutlined /> },
  { id: '5', name: 'Steam Room & Sauna Suites', category: 'Wellness', status: 'Active', count: 2, icon: <SafetyCertificateOutlined /> },
  { id: '6', name: 'Luxury Locker Rooms & Keypad Locks', category: 'Amenities', status: 'Active', count: 120, icon: <LockOutlined /> },
  { id: '7', name: 'Private Shower & Changing Rooms', category: 'Amenities', status: 'Active', count: 8, icon: <CheckCircleFilled /> },
  { id: '8', name: 'Protein Shake & Juice Bar', category: 'Nutrition', status: 'Active', count: 1, icon: <ShopOutlined /> },
  { id: '9', name: 'High-Speed Wi-Fi 6 Network', category: 'Tech', status: 'Active', count: 1, icon: <GlobalOutlined /> },
  { id: '10', name: 'IoT Optical Turnstiles & NFC Entry', category: 'Tech', status: 'Active', count: 3, icon: <IdcardOutlined /> },
  { id: '11', name: 'Dedicated Valet & Bike Parking', category: 'Amenities', status: 'Active', count: 40, icon: <EnvironmentOutlined /> },
  { id: '12', name: 'Certified Personal Training Zone', category: 'Training', status: 'Active', count: 5, icon: <TeamOutlined /> },
];

// Initial Pricing Data
const INITIAL_PRICING = [
  {
    id: 'plan-1',
    name: 'Walk-In Day Pass',
    badge: 'Walk-In',
    price: 399,
    duration: '1 Day',
    description: 'Full floor workout access, locker room, and steam suite access.',
    features: ['All Gym Floor Access', 'Locker & Shower Access', 'Free Wi-Fi', 'Turnstile Optical Pass'],
    popular: false,
  },
  {
    id: 'plan-2',
    name: '1-Month Strength & Cardio',
    badge: 'Monthly',
    price: 2499,
    duration: '30 Days',
    description: 'Perfect for regular workout enthusiasts with general trainer support.',
    features: ['Unlimited Gym Access', 'General Trainer Guidance', 'Body Composition Analysis', 'Locker & Shower Access'],
    popular: false,
  },
  {
    id: 'plan-3',
    name: '3-Month Fitness Pro',
    badge: 'Quarterly',
    price: 6499,
    duration: '90 Days',
    description: 'Most popular membership plan with free steam and nutrition consultation.',
    features: ['Unlimited Gym Access', '1 Free Personal Training Session', 'Diet & Nutrition Consultation', 'Steam & Sauna Access', '2 Guest Passes'],
    popular: true,
  },
  {
    id: 'plan-4',
    name: '12-Month Annual VIP Elite',
    badge: 'Annual VIP',
    price: 18999,
    duration: '365 Days',
    description: 'All-inclusive VIP access, zero blackout dates, and priority trainer booking.',
    features: ['All-Access 365 Days', '4 Free PT Sessions', 'Complete Diet Plan', 'Free Steam & Sauna', '5 Free Walk-in Guest Passes', 'Gym Kit & Shaker'],
    popular: false,
  },
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
  'Closed',
];

// Initial Operating Hours Data (Day-by-Day Monday to Sunday)
const INITIAL_HOURS = [
  { day: 'Monday', isOpen: true, openTime: '05:30 AM', closeTime: '10:30 PM' },
  { day: 'Tuesday', isOpen: true, openTime: '05:30 AM', closeTime: '10:30 PM' },
  { day: 'Wednesday', isOpen: true, openTime: '05:30 AM', closeTime: '10:30 PM' },
  { day: 'Thursday', isOpen: true, openTime: '05:30 AM', closeTime: '10:30 PM' },
  { day: 'Friday', isOpen: true, openTime: '05:30 AM', closeTime: '10:30 PM' },
  { day: 'Saturday', isOpen: true, openTime: '06:00 AM', closeTime: '09:00 PM' },
  { day: 'Sunday', isOpen: true, openTime: '06:00 AM', closeTime: '01:00 PM' },
];

const INITIAL_HOLIDAYS = [
  {
    id: 'hol-1',
    date: '20 Oct 2026',
    title: 'Diwali Festival',
    type: 'Modified Hours',
    hours: '06:00 AM – 12:00 PM (Morning Only)',
    notes: 'Evening turnstiles locked for celebrations',
  },
  {
    id: 'hol-2',
    date: '15 Jan 2027',
    title: 'Pongal Harvest Festival',
    type: 'Closed',
    hours: 'Full Day Closed',
    notes: 'Annual public holiday closure',
  },
  {
    id: 'hol-3',
    date: '01 May 2027',
    title: 'Labour Day & Annual Tech Maintenance',
    type: 'Closed',
    hours: 'Full Day Closed',
    notes: 'Turnstile IoT calibration and server upgrades',
  },
];

export const GymProfileManagement = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(INITIAL_GYM_PROFILE);
  const [activeTab, setActiveTab] = useState('basic');

  // Multi-tab datasets
  const [facilities, setFacilities] = useState(INITIAL_FACILITIES);
  const [pricingPlans, setPricingPlans] = useState(INITIAL_PRICING);
  const [operatingHours, setOperatingHours] = useState(INITIAL_HOURS);
  const [holidayExceptions, setHolidayExceptions] = useState(INITIAL_HOLIDAYS);
  const [is24HoursOpen, setIs24HoursOpen] = useState(false);
  const [isAddHolidayModalOpen, setIsAddHolidayModalOpen] = useState(false);
  const [holidayForm] = Form.useForm();
  const [bankDetails, setBankDetails] = useState({
    accountHolder: 'FitZone Fitness LLP',
    bankName: 'HDFC Bank Ltd.',
    accountNumber: '50200084729184',
    ifscCode: 'HDFC0001234',
    accountType: 'Current Account',
    branch: 'Anna Nagar Main Branch, Chennai',
    upiId: 'fitzone.gym@hdfcbank',
    payoutSchedule: 'Daily T+1 Automated Direct Bank Deposit',
    gstInvoiceEnabled: true,
  });
  const [socialLinks, setSocialLinks] = useState({
    instagram: 'https://instagram.com/fitzone_chennai',
    instagramHandle: '@fitzone_chennai',
    facebook: 'https://facebook.com/fitzonegymchennai',
    youtube: 'https://youtube.com/@fitzonefitness',
    whatsapp: '+91 98765 43210',
    googleRating: '4.8',
    googleReviewCount: '324',
    googleBusinessUrl: 'https://maps.google.com/?q=FitZone+Gym+Anna+Nagar',
    website: 'https://www.fitzonegym.com',
  });
  const [systemSettings, setSystemSettings] = useState({
    turnstileTimeout: 5,
    renewalGracePeriod: 3,
    autoCheckoutHours: 2.5,
    smsCheckInAlerts: true,
    whatsappAlerts: true,
    audioChimeEnabled: true,
    multiBranchSync: false,
    spotWalkInsAllowed: true,
  });

  // Modal States
  const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isManageGalleryOpen, setIsManageGalleryOpen] = useState(false);
  const [isPendingRequestsOpen, setIsPendingRequestsOpen] = useState(false);
  const [isApprovalInfoOpen, setIsApprovalInfoOpen] = useState(false);
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);
  const [selectedPlanForEdit, setSelectedPlanForEdit] = useState(null);
  const [isAddFacilityModalOpen, setIsAddFacilityModalOpen] = useState(false);
  const [isEditBankModalOpen, setIsEditBankModalOpen] = useState(false);
  const [isEditSocialModalOpen, setIsEditSocialModalOpen] = useState(false);

  // Forms
  const [editForm] = Form.useForm();
  const [planForm] = Form.useForm();
  const [editPlanForm] = Form.useForm();
  const [facilityForm] = Form.useForm();
  const [bankForm] = Form.useForm();
  const [socialForm] = Form.useForm();

  // Pending Requests State
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'REQ-1049',
      field: 'Operating Hours & Holiday Schedule',
      requestedOn: '14 Jul 2025',
      status: 'Pending Admin Review',
    },
    {
      id: 'REQ-1048',
      field: 'Floor Area Extension (3500 to 4200 Sq.ft)',
      requestedOn: '12 Jul 2025',
      status: 'Pending Admin Review',
    },
  ]);

  const handleEditSubmit = (values) => {
    setProfile((prev) => ({
      ...prev,
      ...values,
    }));
    dispatch(
      updateGymProfile({
        name: values.name,
        branch: values.shortAddress || values.address || profile.shortAddress,
        email: values.email,
        phone: values.phone,
      })
    );
    setIsEditModalOpen(false);
    message.success('Profile changes submitted for admin approval!');
    setPendingRequests([
      {
        id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
        field: 'General Gym Information Update',
        requestedOn: '21 Jul 2025',
        status: 'Pending Admin Review',
      },
      ...pendingRequests,
    ]);
  };

  const handleCoverPhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          const newCover = re.target?.result;
          setProfile((prev) => ({ ...prev, coverPhoto: newCover }));
          dispatch(updateGymProfile({ coverPhoto: newCover }));
          message.success('Cover banner photo updated!');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleLogoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          const newLogo = re.target?.result;
          setProfile((prev) => ({ ...prev, logo: newLogo }));
          dispatch(updateGymProfile({ logo: newLogo }));
          message.success('Gym brand logo updated successfully!');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

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
        key: 'request_edit',
        label: (
          <div style={{ padding: '6px 4px', minWidth: 260 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
              Request to Edit Profile
            </div>
            <div style={{ fontSize: 11.5, color: isDarkMode ? '#888888' : '#64748b', marginTop: 3, lineHeight: 1.35 }}>
              Submit your changes for admin approval. Once approved, your profile will be updated.
            </div>
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditDropdownOpen(false);
                editForm.setFieldsValue(profile);
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
              Request Edit
            </Button>
          </div>
        ),
      },
    ],
  };

  const TABS_LIST = [
    { key: 'basic', label: 'Basic Information' },
    { key: 'facilities', label: 'Facilities & Amenities' },
    { key: 'pricing', label: 'Pricing' },
    { key: 'images', label: 'Images' },
    { key: 'hours', label: 'Operating Hours' },
    { key: 'bank', label: 'Bank Details' },
    { key: 'social', label: 'Social Links' },
    { key: 'settings', label: 'Settings' },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
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
          <Title level={2} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a', fontWeight: 700 }}>
            Gym Profile
          </Title>
          <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 14 }}>
            Manage your gym credentials, facilities, pricing plans, schedule, and online presence.
          </Text>
        </div>

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
              height: 42,
              padding: '0 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: isDarkMode ? 'none' : '0 2px 6px rgba(0, 56, 130, 0.2)',
            }}
          >
            <span>Edit Profile</span>
            <DownOutlined style={{ fontSize: 10 }} />
          </Button>
        </Dropdown>
      </div>

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
                        backgroundColor: '#1e1e1e',
                      }}
                    >
                      <img
                        src={profile.coverPhoto}
                        alt={profile.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
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
                        <CameraOutlined /> Change Photo
                      </div>
                    </div>
                  </Col>

                  {/* Gym Main Details */}
                  <Col xs={24} sm={15}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                      <div
                        style={{
                          position: 'relative',
                          width: 52,
                          height: 52,
                          borderRadius: 'var(--radius-base)',
                          overflow: 'hidden',
                          border: `2px solid ${isDarkMode ? '#333333' : '#dbeafe'}`,
                          backgroundColor: isDarkMode ? '#1e1e1e' : '#edf4fe',
                          flexShrink: 0,
                          cursor: 'pointer',
                        }}
                        onClick={handleLogoUpload}
                        title="Click to Upload/Change Gym Logo"
                      >
                        <img
                          src={profile.logo || profile.coverPhoto}
                          alt="Gym Logo"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 22, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                            {profile.name}
                          </span>
                          <Tag color="success" style={{ fontWeight: 700, borderRadius: 'var(--radius-base)', padding: '2px 8px' }}>
                            {profile.status}
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
                            marginTop: 1,
                          }}
                        >
                          <CameraOutlined /> Upload Brand Logo
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: isDarkMode ? '#aaaaaa' : '#64748b', fontSize: 12.5, marginBottom: 6 }}>
                      <EnvironmentOutlined style={{ color: 'var(--color-primary)' }} />
                      <span>{profile.shortAddress}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: isDarkMode ? '#aaaaaa' : '#64748b', fontSize: 12.5, marginBottom: 6 }}>
                      <PhoneOutlined style={{ color: 'var(--color-primary)' }} />
                      <span>{profile.phone}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: isDarkMode ? '#aaaaaa' : '#64748b', fontSize: 12.5, marginBottom: 12 }}>
                      <MailOutlined style={{ color: 'var(--color-primary)' }} />
                      <span>{profile.email}</span>
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Tag color="purple" style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}>{profile.gymType}</Tag>
                      <Tag color="blue" style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}>{profile.genderAllowed}</Tag>
                      <Tag color="cyan" style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}>Est. {profile.establishedOn}</Tag>
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
                    <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-primary)' }}>85%</span>
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
                  percent={85}
                  showInfo={false}
                  strokeColor="var(--color-primary)"
                  trailColor={isDarkMode ? '#222222' : '#f1f5f9'}
                  style={{ marginBottom: 14 }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {[
                    { title: 'Basic Information', checked: true, editable: false },
                    { title: 'Facilities & Amenities', checked: true, editable: false },
                    { title: 'Pricing', checked: true, editable: false },
                    { title: 'Images', checked: true, editable: true, tab: 'images' },
                    { title: 'Operating Hours', checked: true, editable: true, tab: 'hours' },
                    { title: 'Bank Details', checked: true, editable: true, tab: 'bank' },
                    { title: 'Social Links', checked: false, editable: true, tab: 'social' },
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {item.checked ? (
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
                        <span style={{ color: isDarkMode ? '#cccccc' : '#334155', fontWeight: item.checked ? 500 : 400 }}>
                          {item.title}
                        </span>
                      </div>
                      {item.editable && (
                        <span
                          onClick={() => setActiveTab(item.tab)}
                          style={{ fontSize: 11.5, color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Edit
                        </span>
                      )}
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
                      <Paragraph style={{ fontSize: 12, color: isDarkMode ? '#aaaaaa' : '#64748b', lineHeight: 1.4, marginBottom: 14 }}>
                        {profile.about}
                      </Paragraph>
                      <div style={{ borderTop: `1px solid ${isDarkMode ? '#222222' : '#f1f5f9'}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                        <span style={{ color: isDarkMode ? '#888888' : '#94a3b8' }}>Joined On: {profile.joinedOn}</span>
                        <span style={{ color: isDarkMode ? '#888888' : '#94a3b8' }}>Member: {profile.memberSince}</span>
                      </div>
                    </Card>
                  </Col>

                  {/* Gallery Manager Preview */}
                  <Col xs={24} md={12}>
                    <Card
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                          <PictureOutlined style={{ color: 'var(--color-primary)' }} /> Gallery ({profile.gallery.length})
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
                      <Row gutter={[8, 8]}>
                        {profile.gallery.slice(0, 6).map((img, idx) => (
                          <Col span={8} key={idx}>
                            <img
                              src={img}
                              alt="gallery"
                              style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 'var(--radius-base)', cursor: 'pointer' }}
                              onClick={() => setActiveTab('images')}
                            />
                          </Col>
                        ))}
                      </Row>
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
                  <Text style={{ fontSize: 12.5, color: isDarkMode ? '#cccccc' : '#334155' }}>
                    {profile.address}
                  </Text>
                  <div
                    style={{
                      marginTop: 12,
                      height: 120,
                      borderRadius: 'var(--radius-base)',
                      backgroundColor: isDarkMode ? '#1e1e1e' : '#e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isDarkMode ? '#888888' : '#64748b',
                      fontSize: 12,
                      border: `1px solid ${isDarkMode ? '#333333' : '#cbd5e1'}`,
                    }}
                  >
                    <EnvironmentOutlined style={{ marginRight: 6, color: 'var(--color-primary)', fontSize: 16 }} />
                    Anna Nagar, Chennai • Lat: 13.0850° N, Long: 80.2101° E
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
                      { label: 'GYM TYPE', val: profile.gymType },
                      { label: 'GST NUMBER', val: profile.gstNumber },
                      { label: 'ESTABLISHED ON', val: profile.establishedOn },
                      { label: 'OWNERSHIP TYPE', val: profile.ownershipType },
                      { label: 'FLOOR AREA', val: profile.area },
                      { label: 'TOTAL EQUIPMENT', val: `${profile.totalEquipment} Units` },
                      { label: 'CERTIFIED TRAINERS', val: `${profile.trainerCount} Trainers` },
                      { label: 'GENDER ALLOWED', val: profile.genderAllowed },
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
                    <BarChartOutlined style={{ color: 'var(--color-primary)' }} /> Gym Statistics
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
                  {/* Stat 1: Total Visitors */}
                  <div style={{ padding: '12px', borderRadius: 'var(--radius-base)', backgroundColor: isDarkMode ? '#141414' : '#f8fafc', border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: isDarkMode ? 'rgba(0, 56, 130, 0.3)' : '#e6f4ff', color: '#003882', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                        <TeamOutlined />
                      </div>
                      <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>Total Visitors</div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>1,248</div>
                    <div style={{ fontSize: 10.5, color: '#00bf62', fontWeight: 600, marginTop: 2 }}>This Month ↑ 18%</div>
                  </div>

                  {/* Stat 2: Total Members */}
                  <div style={{ padding: '12px', borderRadius: 'var(--radius-base)', backgroundColor: isDarkMode ? '#141414' : '#f8fafc', border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: isDarkMode ? 'rgba(114, 46, 209, 0.2)' : '#f3effe', color: '#722ed1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                        <UserOutlined />
                      </div>
                      <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>Total Members</div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>356</div>
                    <div style={{ fontSize: 10.5, color: '#00bf62', fontWeight: 600, marginTop: 2 }}>This Month ↑ 12%</div>
                  </div>

                  {/* Stat 3: Walk-in Count */}
                  <div style={{ padding: '12px', borderRadius: 'var(--radius-base)', backgroundColor: isDarkMode ? '#141414' : '#f8fafc', border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: isDarkMode ? 'rgba(0, 191, 98, 0.2)' : '#eaf8ef', color: '#00bf62', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                        <UserOutlined />
                      </div>
                      <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>Walk-in Count</div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>87</div>
                    <div style={{ fontSize: 10.5, color: '#00bf62', fontWeight: 600, marginTop: 2 }}>This Month ↑ 8%</div>
                  </div>

                  {/* Stat 4: App Bookings */}
                  <div style={{ padding: '12px', borderRadius: 'var(--radius-base)', backgroundColor: isDarkMode ? '#141414' : '#f8fafc', border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: isDarkMode ? 'rgba(250, 140, 22, 0.2)' : '#fef4e8', color: '#fa8c16', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                        <CalendarOutlined />
                      </div>
                      <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>App Bookings</div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>162</div>
                    <div style={{ fontSize: 10.5, color: '#00bf62', fontWeight: 600, marginTop: 2 }}>This Month ↑ 22%</div>
                  </div>

                  {/* Stat 5: Active Members */}
                  <div style={{ padding: '12px', borderRadius: 'var(--radius-base)', backgroundColor: isDarkMode ? '#141414' : '#f8fafc', border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: isDarkMode ? 'rgba(22, 119, 255, 0.2)' : '#edf4fe', color: '#1677ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                        <UserOutlined />
                      </div>
                      <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>Active Members</div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>312</div>
                    <div style={{ fontSize: 10.5, color: '#00bf62', fontWeight: 600, marginTop: 2 }}>This Month ↑ 15%</div>
                  </div>

                  {/* Stat 6: Total Revenue */}
                  <div style={{ padding: '12px', borderRadius: 'var(--radius-base)', backgroundColor: isDarkMode ? '#141414' : '#f8fafc', border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: isDarkMode ? 'rgba(0, 191, 98, 0.2)' : '#eaf8ef', color: '#00bf62', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                        <DollarCircleOutlined />
                      </div>
                      <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>Total Revenue</div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>₹1,24,560</div>
                    <div style={{ fontSize: 10.5, color: '#00bf62', fontWeight: 600, marginTop: 2 }}>This Month ↑ 20%</div>
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
                Facilities, Equipment & Amenities
              </Title>
              <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13 }}>
                Showcase gym capabilities, available workout equipment, and premium amenities.
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsAddFacilityModalOpen(true)}
              style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}
            >
              Add New Facility
            </Button>
          </div>

          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            {facilities.map((fac) => (
              <Col xs={24} sm={12} md={8} lg={6} key={fac.id}>
                <Card
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderColor: 'var(--border-color)',
                    borderRadius: 'var(--radius-base)',
                    height: '100%',
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
                      {fac.icon}
                    </div>
                    <Tag color="success" style={{ fontWeight: 700, borderRadius: 4, margin: 0 }}>
                      {fac.status}
                    </Tag>
                  </div>

                  <div style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', marginTop: 12 }}>
                    {fac.name}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>
                    <span>Category: <strong>{fac.category}</strong></span>
                    <span>Units: <strong>{fac.count}</strong></span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
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
                Membership Pricing & Workout Passes
              </Title>
              <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13 }}>
                Configure membership tiers, daily walk-in passes, and addon packages.
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
                    {plan.badge}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', marginTop: 4 }}>
                    {plan.name}
                  </div>

                  <div style={{ margin: '14px 0 10px 0' }}>
                    <span style={{ fontSize: 28, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                      ₹{plan.price.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}> / {plan.duration}</span>
                  </div>

                  <Text style={{ fontSize: 12, color: isDarkMode ? '#aaaaaa' : '#64748b', lineHeight: 1.4, marginBottom: 16 }}>
                    {plan.description}
                  </Text>

                  <Divider style={{ margin: '10px 0' }} />

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    {plan.features.map((feat, fIdx) => (
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
                        features: plan.features.join('\n'),
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
                Gym Gallery & Cover Photos
              </Title>
              <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13 }}>
                Upload high-definition photos of your workout floor, turnstiles, cardio deck, and amenities.
              </Text>
            </div>
            <Button
              type="primary"
              icon={<CameraOutlined />}
              onClick={handleCoverPhotoUpload}
              style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}
            >
              Upload New Photos
            </Button>
          </div>

          <Image.PreviewGroup>
            <Row gutter={[16, 16]}>
              {profile.gallery.map((img, idx) => (
                <Col xs={24} sm={12} md={8} key={idx}>
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
                    <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                      <Image
                        src={img}
                        alt={`gym-gallery-${idx}`}
                        style={{ width: '100%', height: 200, objectFit: 'cover' }}
                        wrapperStyle={{ width: '100%', height: 200 }}
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
                          top: 10,
                          right: 10,
                          display: 'flex',
                          gap: 6,
                          zIndex: 10,
                        }}
                      >
                        <Button
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setProfile((prev) => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== idx) }));
                            message.success('Photo removed from gallery.');
                          }}
                          style={{
                            backgroundColor: 'rgba(255, 77, 79, 0.9)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: 'var(--radius-base)',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                          }}
                        />
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Image.PreviewGroup>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: OPERATING HOURS & SCHEDULE */}
      {/* ========================================================      {/* ========================================================================= */}
      {/* TAB 5: OPERATING HOURS & SCHEDULE */}
      {/* ========================================================================= */}
      {activeTab === 'hours' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Top Control & Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <Title level={4} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                Gym Operating Hours
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
                  message.success('Monday schedule copied to all days (Tue – Sun)!');
                }}
                style={{ borderRadius: 'var(--radius-base)' }}
              >
                Copy Mon to All Days
              </Button>

              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={() => {
                  confetti({ particleCount: 35, spread: 60, origin: { y: 0.85 } });
                  message.success('Operating hours saved and synchronized successfully!');
                }}
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

                  {/* Timing: From When to When */}
                  {item.isOpen ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <Text style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b' }}>From</Text>
                      <Select
                        value={item.openTime}
                        onChange={(val) => {
                          setOperatingHours((prev) =>
                            prev.map((d, i) => (i === idx ? { ...d, openTime: val } : d))
                          );
                        }}
                        style={{ width: 130 }}
                        size="middle"
                      >
                        {TIME_SLOTS.filter((t) => t !== 'Closed').map((t) => (
                          <Option key={t} value={t}>{t}</Option>
                        ))}
                      </Select>
                      <Text style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b' }}>to</Text>
                      <Select
                        value={item.closeTime}
                        onChange={(val) => {
                          setOperatingHours((prev) =>
                            prev.map((d, i) => (i === idx ? { ...d, closeTime: val } : d))
                          );
                        }}
                        style={{ width: 130 }}
                        size="middle"
                      >
                        {TIME_SLOTS.filter((t) => t !== 'Closed').map((t) => (
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
                <CalendarOutlined style={{ color: 'var(--color-primary)' }} /> Special Holidays & Planned Closures
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
              marginTop: 20,
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <Paragraph style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13, marginBottom: 16 }}>
              Turnstiles will automatically enforce these blackout dates or modified shift hours. Members will receive in-app push notifications 24 hours prior.
            </Paragraph>

            <Table
              dataSource={holidayExceptions}
              rowKey="id"
              pagination={false}
              scroll={{ x: 1100 }}
              tableLayout="fixed"
              size="middle"
              columns={[
                {
                  title: 'Date',
                  dataIndex: 'date',
                  key: 'date',
                  width: 150,
                  render: (date) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: isDarkMode ? '#e2e8f0' : '#334155', whiteSpace: 'nowrap' }}>
                      <CalendarOutlined style={{ color: 'var(--color-primary)' }} />
                      <span>{date}</span>
                    </div>
                  ),
                },
                {
                  title: 'Occasion / Event',
                  dataIndex: 'title',
                  key: 'title',
                  width: 250,
                  ellipsis: true,
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
                  width: 160,
                  render: (type) => {
                    const isClosed = type?.toLowerCase().includes('closed');
                    const isModified = type?.toLowerCase().includes('modified');
                    const color = isClosed ? '#ef4444' : isModified ? '#d97706' : '#10b981';
                    return (
                      <span
                        style={{
                          color,
                          fontWeight: 700,
                          fontSize: 12,
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {type}
                      </span>
                    );
                  },
                },
                {
                  title: 'Effective Timings',
                  dataIndex: 'hours',
                  key: 'hours',
                  width: 240,
                  ellipsis: true,
                  render: (hours) => (
                    <span style={{ color: isDarkMode ? '#d1d5db' : '#334155', fontSize: 13 }}>
                      {hours}
                    </span>
                  ),
                },
                {
                  title: 'Turnstile & Staff Notes',
                  dataIndex: 'notes',
                  key: 'notes',
                  width: 280,
                  ellipsis: true,
                  render: (notes) => (
                    <Tooltip title={notes}>
                      <span style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13 }}>
                        {notes}
                      </span>
                    </Tooltip>
                  ),
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  width: 80,
                  align: 'center',
                  fixed: 'right',
                  onCell: () => ({
                    style: {
                      backgroundColor: isDarkMode ? '#0d1117' : '#ffffff',
                    },
                  }),
                  render: (_, record) => (
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        setHolidayExceptions((prev) => prev.filter((h) => h.id !== record.id));
                        message.success(`Removed "${record.title}" exception rule`);
                      }}
                    />
                  ),
                },
              ]}
            />
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
                    <div style={{ fontWeight: 700, fontSize: 14, color: isDarkMode ? '#ffffff' : '#0f172a' }}>{bankDetails.accountHolder}</div>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 11 }}>BANK NAME</Text>
                    <div style={{ fontWeight: 700, fontSize: 14, color: isDarkMode ? '#ffffff' : '#0f172a' }}>{bankDetails.bankName}</div>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 11 }}>ACCOUNT NUMBER</Text>
                    <div style={{ fontWeight: 700, fontSize: 14, fontFamily: 'monospace' }}>•••• •••• {bankDetails.accountNumber.slice(-4)}</div>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 11 }}>IFSC CODE</Text>
                    <div style={{ fontWeight: 700, fontSize: 14, fontFamily: 'monospace' }}>{bankDetails.ifscCode}</div>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>BRANCH ADDRESS</Text>
                    <div style={{ fontWeight: 600, fontSize: 13, color: isDarkMode ? '#ffffff' : '#0f172a' }}>{bankDetails.branch}</div>
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
                    {bankDetails.upiId}
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
                Connect social media pages, Google Business ratings, and WhatsApp booking channel.
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
                  {socialLinks.instagramHandle}
                </div>
                <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', marginTop: 4 }}>
                  12.4K Fitness Followers
                </div>
              </Card>
            </Col>

            {/* Google Business Profile */}
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
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fa8c16', marginTop: 8 }}>
                  ★ {socialLinks.googleRating} / 5.0
                </div>
                <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', marginTop: 4 }}>
                  {socialLinks.googleReviewCount} Verified Reviews
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
                  {socialLinks.whatsapp}
                </div>
                <div style={{ fontSize: 11, color: '#00bf62', marginTop: 4, fontWeight: 600 }}>
                  Active Hotline
                </div>
              </Card>
            </Col>

            {/* YouTube */}
            <Col xs={24} sm={12} lg={6}>
              <Card
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-color)',
                  borderRadius: 'var(--radius-base)',
                }}
                styles={{ body: { padding: '20px' } }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#ff0000', fontSize: 24 }}>
                  <YoutubeOutlined />
                  <span style={{ fontSize: 15, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>YouTube</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#ffffff' : '#0f172a', marginTop: 8 }}>
                  FitZone Workout Channel
                </div>
                <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', marginTop: 4 }}>
                  Workout Guides & Nutrition Tips
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
              Configure optical turnstile delays and member renewal grace periods.
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
                    Number of seconds the physical gate barrier stays open after valid QR scan
                  </div>
                </div>
                <Select
                  value={systemSettings.turnstileTimeout}
                  onChange={(v) => {
                    setSystemSettings({ ...systemSettings, turnstileTimeout: v });
                    message.success(`Turnstile auto-lock set to ${v} seconds.`);
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
                    setSystemSettings({ ...systemSettings, renewalGracePeriod: v });
                    message.success(`Grace period set to ${v} days.`);
                  }}
                  style={{ width: 140 }}
                >
                  <Option value={0}>0 Days (Strict)</Option>
                  <Option value={3}>3 Days</Option>
                  <Option value={7}>7 Days</Option>
                </Select>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. EDIT PROFILE MODAL */}
      <Modal
        title="Request Gym Profile Edits"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={650}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
          {/* Logo & Cover Photo Upload Cards */}
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
                  transition: 'border-color 0.2s',
                }}
                onClick={handleLogoUpload}
              >
                <Avatar
                  shape="square"
                  size={46}
                  src={profile.logo}
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
                  transition: 'border-color 0.2s',
                }}
                onClick={handleCoverPhotoUpload}
              >
                <Avatar
                  shape="square"
                  size={46}
                  src={profile.coverPhoto}
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
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Contact Email" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="area" label="Floor Area">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="address" label="Full Street Address">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="about" label="About Gym Summary">
                <TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Submit for Admin Review
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 2. PENDING REQUESTS MODAL */}
      <Modal
        title="Pending Admin Approval Requests"
        open={isPendingRequestsOpen}
        onCancel={() => setIsPendingRequestsOpen(false)}
        width={580}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsPendingRequestsOpen(false)}>
            Close
          </Button>,
        ]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '10px 0' }}>
          {pendingRequests.map((req) => (
            <div
              key={req.id}
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
                <div style={{ fontWeight: 700, fontSize: 13, color: isDarkMode ? '#ffffff' : '#0f172a' }}>{req.field}</div>
                <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2 }}>
                  Request ID: {req.id} • Requested on {req.requestedOn}
                </div>
              </div>
              <Tag color="warning" style={{ fontWeight: 600, whiteSpace: 'nowrap', margin: 0 }}>
                {req.status}
              </Tag>
            </div>
          ))}
        </div>
      </Modal>

      {/* 3. ADD PRICING PLAN MODAL */}
      <Modal
        title="Create New Membership / Workout Plan"
        open={isAddPlanModalOpen}
        onCancel={() => setIsAddPlanModalOpen(false)}
        footer={null}
        width={560}
      >
        <Form
          form={planForm}
          layout="vertical"
          initialValues={{ badge: 'Monthly', popular: false }}
          onFinish={(vals) => {
            const newFeatures = vals.features
              ? vals.features.split('\n').map((f) => f.trim()).filter(Boolean)
              : ['All Gym Floor Access', 'Locker Room Access', 'Free Wi-Fi'];

            const newPlan = {
              id: `plan-${Date.now()}`,
              name: vals.name,
              badge: vals.badge || 'Monthly',
              price: Number(vals.price),
              duration: vals.duration,
              description: vals.description || 'Standard membership workout plan.',
              features: newFeatures,
              popular: vals.popular || false,
            };
            setPricingPlans([...pricingPlans, newPlan]);
            setIsAddPlanModalOpen(false);
            planForm.resetFields();
            message.success(`Plan "${newPlan.name}" created successfully!`);
          }}
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
            <Button type="primary" htmlType="submit">
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
        <Form
          form={editPlanForm}
          layout="vertical"
          onFinish={(vals) => {
            const updatedFeatures = vals.features
              ? vals.features.split('\n').map((f) => f.trim()).filter(Boolean)
              : selectedPlanForEdit?.features || [];

            setPricingPlans((prev) =>
              prev.map((p) =>
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
              )
            );
            setIsEditPlanModalOpen(false);
            message.success(`Plan "${vals.name}" updated successfully!`);
          }}
        >
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
                  setPricingPlans((prev) => prev.filter((p) => p.id !== selectedPlanForEdit.id));
                  setIsEditPlanModalOpen(false);
                  message.success('Plan deleted successfully.');
                }
              }}
            >
              Delete Plan
            </Button>
            <Space size={10}>
              <Button onClick={() => setIsEditPlanModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
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
        <Form
          form={facilityForm}
          layout="vertical"
          onFinish={(vals) => {
            const newFac = {
              id: `fac-${Date.now()}`,
              name: vals.name,
              category: vals.category || 'General',
              status: 'Active',
              count: vals.count || 1,
              icon: <ToolOutlined />,
            };
            setFacilities([...facilities, newFac]);
            setIsAddFacilityModalOpen(false);
            facilityForm.resetFields();
            message.success(`Facility ${newFac.name} added!`);
          }}
        >
          <Form.Item name="name" label="Facility / Equipment Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Battle Ropes & Plyo Boxes" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="category" label="Category">
                <Select defaultValue="Strength">
                  <Option value="Cardio">Cardio</Option>
                  <Option value="Strength">Strength</Option>
                  <Option value="Functional">Functional</Option>
                  <Option value="Wellness">Wellness</Option>
                  <Option value="Amenities">Amenities</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="count" label="Total Units / Count">
                <InputNumber style={{ width: '100%' }} defaultValue={1} />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsAddFacilityModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
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
        <Form
          form={bankForm}
          layout="vertical"
          onFinish={(vals) => {
            setBankDetails({ ...bankDetails, ...vals });
            setIsEditBankModalOpen(false);
            message.success('Bank settlement details updated!');
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="accountHolder" label="Account Holder Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="bankName" label="Bank Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="accountNumber" label="Account Number" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ifscCode" label="IFSC Code" rules={[{ required: true, message: 'Please enter IFSC Code' }]}>
                <Input placeholder="e.g. HDFC0001234" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="branch" label="Branch Address" rules={[{ required: true, message: 'Please enter branch address' }]}>
                <Input placeholder="e.g. No. 15, 2nd Avenue, Anna Nagar Main Branch, Chennai" />
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
            <Button type="primary" htmlType="submit">
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
        <Form
          form={socialForm}
          layout="vertical"
          onFinish={(vals) => {
            setSocialLinks({ ...socialLinks, ...vals });
            setIsEditSocialModalOpen(false);
            message.success('Social handles updated!');
          }}
        >
          <Form.Item name="instagramHandle" label="Instagram Handle">
            <Input prefix={<InstagramOutlined />} placeholder="@fitzone_chennai" />
          </Form.Item>
          <Form.Item name="whatsapp" label="WhatsApp Business Number">
            <Input prefix={<WhatsAppOutlined />} placeholder="+91 98765 43210" />
          </Form.Item>
          <Form.Item name="website" label="Website URL">
            <Input prefix={<GlobalOutlined />} placeholder="https://www.fitzonegym.com" />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsEditSocialModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save Social Links
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 6.5 ADD HOLIDAY / EXCEPTION MODAL */}
      <Modal
        title="Add Special Holiday or Blackout Schedule"
        open={isAddHolidayModalOpen}
        onCancel={() => setIsAddHolidayModalOpen(false)}
        footer={null}
        width={540}
      >
        <Form
          form={holidayForm}
          layout="vertical"
          initialValues={{ type: 'Closed' }}
          onFinish={(vals) => {
            const formattedDate = vals.date
              ? typeof vals.date === 'string'
                ? vals.date
                : vals.date.format('DD MMM YYYY')
              : 'Upcoming Date';

            const newEx = {
              id: `hol-${Date.now()}`,
              date: formattedDate,
              title: vals.title,
              type: vals.type,
              hours: vals.type === 'Closed' ? 'Full Day Closed' : vals.hours || '06:00 AM – 12:00 PM',
              notes: vals.notes || 'Special holiday schedule rule',
            };

            setHolidayExceptions((prev) => [newEx, ...prev]);
            setIsAddHolidayModalOpen(false);
            holidayForm.resetFields();
            message.success(`Special holiday rule for "${vals.title}" added successfully!`);
          }}
        >
          <Form.Item
            name="title"
            label="Occasion / Holiday Title"
            rules={[{ required: true, message: 'Please enter event or holiday name' }]}
          >
            <Input placeholder="e.g. New Year's Day, Independence Day, Floor Renovation" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: 'Please select or enter the date' }]}
              >
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
                  <Input placeholder="e.g. 06:00 AM – 01:00 PM (Morning Only)" />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item name="notes" label="Turnstile & Member Notice Note">
            <TextArea
              rows={2}
              placeholder="e.g. Turnstiles will lock at 1:00 PM. Cleaners on site from 2:00 PM."
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

      {/* 7. HOW APPROVAL WORKS MODAL */}
      <Modal
        title="How Profile Updates & Approvals Work"
        open={isApprovalInfoOpen}
        onCancel={() => setIsApprovalInfoOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsApprovalInfoOpen(false)}>
            Got it
          </Button>,
        ]}
      >
        <div style={{ fontSize: 13, color: isDarkMode ? '#cccccc' : '#334155', lineHeight: 1.6, padding: '10px 0' }}>
          <p><strong>1. Request Submission:</strong> When you modify your business credentials, GST, location, or facility details, a change request is created.</p>
          <p><strong>2. Super Admin Verification:</strong> GYMEZY operations team reviews the update to ensure brand consistency and legal compliance.</p>
          <p><strong>3. Instant Sync:</strong> Once verified, your changes go live immediately across member mobile apps and turnstile entry points.</p>
        </div>
      </Modal>
    </div>
  );
};

export default GymProfileManagement;
