import React, { useState, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Table,
  Tag,
  Dropdown,
  Modal,
  Form,
  Drawer,
  Pagination,
  Typography,
  Tabs,
  Space,
  message,
  Popconfirm,
  Badge,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  FilterOutlined,
  PlusOutlined,
  DownloadOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CloseCircleOutlined,
  StopOutlined,
  ShopOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ExportOutlined,
  FileTextOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  PictureOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Sample Initial Pending Changes Gyms Data
const PENDING_APPROVAL_GYMS = [
  {
    id: 'pend-1',
    name: 'FitZone Gym',
    phone: '+91 98765 43210',
    location: 'Anna Nagar, Chennai',
    requestedBy: 'Ramesh Kumar',
    requestedOn: '21 May 2026, 10:30 AM',
    changesCount: 8,
    status: 'Pending',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=150&auto=format&fit=crop',
    approvalStatus: 'Pending Approval',
    subscriptionType: 'Hybrid',
    subscriptionStatus: 'Active',
    membersCount: 420,
    monthlyRevenue: '₹ 1,85,000',
    rating: 4.8,
  },
  {
    id: 'pend-2',
    name: 'StrongFit Fitness',
    phone: '+91 91234 56789',
    location: 'Koramangala, Bengaluru',
    requestedBy: 'Prakash Shetty',
    requestedOn: '20 May 2026, 06:15 PM',
    changesCount: 5,
    status: 'Pending',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=150&auto=format&fit=crop',
    approvalStatus: 'Pending Approval',
    subscriptionType: 'App Only',
    subscriptionStatus: 'Active',
    membersCount: 310,
    monthlyRevenue: '₹ 1,20,000',
    rating: 4.6,
  },
  {
    id: 'pend-3',
    name: 'PowerHouse Gym',
    phone: '+91 99876 54321',
    location: 'Thane West, Mumbai',
    requestedBy: 'Sandeep More',
    requestedOn: '20 May 2026, 02:20 PM',
    changesCount: 6,
    status: 'Pending',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=150&auto=format&fit=crop',
    approvalStatus: 'Pending Approval',
    subscriptionType: 'GMS',
    subscriptionStatus: 'Inactive',
    membersCount: 580,
    monthlyRevenue: '₹ 2,40,000',
    rating: 4.9,
  },
  {
    id: 'pend-4',
    name: 'Muscle Factory',
    phone: '+91 90012 34567',
    location: 'Salt Lake, Kolkata',
    requestedBy: 'Arindam Ghosh',
    requestedOn: '19 May 2026, 11:45 AM',
    changesCount: 3,
    status: 'Pending',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=150&auto=format&fit=crop',
    approvalStatus: 'Pending Approval',
    subscriptionType: 'App Only',
    subscriptionStatus: 'Active',
    membersCount: 260,
    monthlyRevenue: '₹ 95,000',
    rating: 4.5,
  },
  {
    id: 'pend-5',
    name: 'BodyCraft Gym',
    phone: '+91 95555 66777',
    location: 'Viman Nagar, Pune',
    requestedBy: 'Vikram Patil',
    requestedOn: '19 May 2026, 09:30 AM',
    changesCount: 7,
    status: 'Pending',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=150&auto=format&fit=crop',
    approvalStatus: 'Pending Approval',
    subscriptionType: 'GMS',
    subscriptionStatus: 'Inactive',
    membersCount: 390,
    monthlyRevenue: '₹ 1,50,000',
    rating: 4.7,
  },
];

// All Gyms Mock Fleet
const ALL_GYMS_DATA = [
  ...PENDING_APPROVAL_GYMS,
  {
    id: 'gym-4',
    name: 'Flex Fitness Studio',
    phone: '+91 93456 78901',
    location: 'Banjara Hills, Hyderabad',
    requestedBy: 'Pooja Reddy',
    requestedOn: '18 May 2026',
    changesCount: 0,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=150&auto=format&fit=crop',
    approvalStatus: 'Approved',
    subscriptionType: 'Hybrid',
    subscriptionStatus: 'Active',
    membersCount: 520,
    monthlyRevenue: '₹ 2,10,000',
    rating: 4.9,
  },
  {
    id: 'gym-7',
    name: 'Elite Fitness Club',
    phone: '+91 98811 22334',
    location: 'Cyber City, Gurgaon',
    requestedBy: 'Kavita Chawla',
    requestedOn: '15 May 2026',
    changesCount: 0,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=150&auto=format&fit=crop',
    approvalStatus: 'Approved',
    subscriptionType: 'Listing Only',
    subscriptionStatus: 'Active',
    membersCount: 340,
    monthlyRevenue: '₹ 1,35,000',
    rating: 4.7,
  },
  {
    id: 'gym-8',
    name: 'Peak Performance Hub',
    phone: '+91 97654 32109',
    location: 'Indiranagar, Bengaluru',
    requestedBy: 'Arun Venkatesh',
    requestedOn: '12 May 2026',
    changesCount: 0,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=150&auto=format&fit=crop',
    approvalStatus: 'On Hold',
    subscriptionType: 'Hybrid',
    subscriptionStatus: 'Active',
    membersCount: 480,
    monthlyRevenue: '₹ 1,95,000',
    rating: 4.8,
  },
  {
    id: 'gym-9',
    name: 'Spartan Strength Arena',
    phone: '+91 94455 66778',
    location: 'T. Nagar, Chennai',
    requestedBy: 'Karthik Subramanian',
    requestedOn: '10 May 2026',
    changesCount: 0,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=150&auto=format&fit=crop',
    approvalStatus: 'Approved',
    subscriptionType: 'Hybrid',
    subscriptionStatus: 'Active',
    membersCount: 610,
    monthlyRevenue: '₹ 2,75,000',
    rating: 4.9,
  },
  {
    id: 'gym-10',
    name: 'Olympus Crossfit Lounge',
    phone: '+91 98112 34455',
    location: 'Connaught Place, New Delhi',
    requestedBy: 'Varun Grover',
    requestedOn: '08 May 2026',
    changesCount: 0,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?q=80&w=150&auto=format&fit=crop',
    approvalStatus: 'Approved',
    subscriptionType: 'App Only',
    subscriptionStatus: 'Active',
    membersCount: 450,
    monthlyRevenue: '₹ 1,80,000',
    rating: 4.8,
  },
  {
    id: 'gym-11',
    name: 'Titan Barbell Club',
    phone: '+91 98223 99887',
    location: 'Kothrud, Pune',
    requestedBy: 'Anil Deshmukh',
    requestedOn: '05 May 2026',
    changesCount: 0,
    status: 'Inactive',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=150&auto=format&fit=crop',
    approvalStatus: 'Rejected',
    subscriptionType: 'Listing Only',
    subscriptionStatus: 'Inactive',
    membersCount: 120,
    monthlyRevenue: '₹ 45,000',
    rating: 4.2,
  },
  {
    id: 'gym-12',
    name: 'Iron Dynasty Fitness',
    phone: '+91 98334 11223',
    location: 'Andheri West, Mumbai',
    requestedBy: 'Rohan Mehta',
    requestedOn: '02 May 2026',
    changesCount: 0,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=150&auto=format&fit=crop',
    approvalStatus: 'Approved',
    subscriptionType: 'Hybrid',
    subscriptionStatus: 'Active',
    membersCount: 710,
    monthlyRevenue: '₹ 3,20,000',
    rating: 5.0,
  },
];

export const GymsManagement = () => {
  const { isDarkMode } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'all';

  // Navigation Views: 'list' | 'review' | 'timing_diff'
  const [currentView, setCurrentView] = useState('list');
  const [selectedGym, setSelectedGym] = useState(PENDING_APPROVAL_GYMS[0]);
  const [activeSubTab, setActiveSubTab] = useState('profile');

  // Filter States for List View
  const [searchName, setSearchName] = useState('');
  const [searchStatus, setSearchStatus] = useState('All');
  const [searchSubscriptionType, setSearchSubscriptionType] = useState('All');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchPhone, setSearchPhone] = useState('');

  // Modals
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsGym, setDetailsGym] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNote, setAdminNote] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Active dataset depending on active Tab
  const activeGymsList = useMemo(() => {
    if (currentTab === 'pending') return PENDING_APPROVAL_GYMS;
    if (currentTab === 'approved') return ALL_GYMS_DATA.filter((g) => g.approvalStatus === 'Approved');
    if (currentTab === 'rejected') return ALL_GYMS_DATA.filter((g) => g.approvalStatus === 'Rejected');
    if (currentTab === 'on_hold') return ALL_GYMS_DATA.filter((g) => g.approvalStatus === 'On Hold');
    return ALL_GYMS_DATA;
  }, [currentTab]);

  const filteredGyms = useMemo(() => {
    return activeGymsList.filter((gym) => {
      const matchName = gym.name.toLowerCase().includes(searchName.toLowerCase());
      const matchStatus = searchStatus === 'All' || gym.approvalStatus === searchStatus;
      const matchSubType = searchSubscriptionType === 'All' || gym.subscriptionType === searchSubscriptionType;
      const matchLocation = gym.location.toLowerCase().includes(searchLocation.toLowerCase());
      const matchPhone = gym.phone.toLowerCase().includes(searchPhone.toLowerCase());
      return matchName && matchStatus && matchSubType && matchLocation && matchPhone;
    });
  }, [activeGymsList, searchName, searchStatus, searchSubscriptionType, searchLocation, searchPhone]);

  const handleOpenReview = (gym) => {
    setSelectedGym(gym);
    setCurrentView('review');
  };

  const handleOpenDetails = (gym) => {
    setDetailsGym(gym);
    setIsDetailsModalOpen(true);
  };

  const handleTabChange = (key) => {
    setSearchParams({ tab: key });
    setCurrentPage(1);
  };

  const handleApproveAll = () => {
    setIsApproveModalOpen(false);
    message.success(`All 8 changes for "${selectedGym.name}" approved and published to customer app!`);
    setCurrentView('list');
  };

  const handleReject = () => {
    setIsRejectModalOpen(false);
    message.warning(`Changes for "${selectedGym.name}" rejected. Reason sent to owner.`);
    setCurrentView('list');
  };

  // =========================================================================
  // VIEW 3: DETAILED CHANGE COMPARISON (SCREEN 3)
  // =========================================================================
  if (currentView === 'timing_diff') {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Top Breadcrumb Link */}
        <div style={{ marginBottom: 16 }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => setCurrentView('review')}
            style={{ padding: 0, fontWeight: 600, color: 'var(--color-primary)' }}
          >
            Back to Gym Profile Changes
          </Button>
        </div>

        {/* Header */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                Gym Timings
              </h2>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#eaf8ef',
                  color: '#16a34a',
                  border: `1px solid ${isDarkMode ? 'rgba(34, 197, 94, 0.3)' : '#bbf7d0'}`,
                }}
              >
                Updated
              </span>
            </div>
            <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13 }}>
              Compare the old and new timings
            </Text>
          </div>

          <Button
            icon={<ExportOutlined />}
            onClick={() => message.info('Opening live customer preview...')}
            style={{ borderRadius: 'var(--radius-base)', fontWeight: 600, color: '#4338ca', borderColor: '#c7d2fe' }}
          >
            View in Customer App
          </Button>
        </div>

        {/* Side-by-Side Day-by-Day Timing Comparison */}
        <Row gutter={[24, 24]} align="middle" style={{ marginBottom: 24 }}>
          {/* Left: Old Timings (Red Tone) */}
          <Col xs={24} md={11}>
            <Card
              style={{
                backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.08)' : '#fff5f5',
                borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.25)' : '#fecaca',
                borderRadius: 'var(--radius-base)',
              }}
              styles={{ body: { padding: '24px' } }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, color: '#dc2626', fontWeight: 700, fontSize: 14 }}>
                <ClockCircleOutlined /> Old Timings
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { day: 'Monday', time: '05:30 AM - 11:00 PM' },
                  { day: 'Tuesday', time: '05:30 AM - 11:00 PM' },
                  { day: 'Wednesday', time: '05:30 AM - 11:00 PM' },
                  { day: 'Thursday', time: '05:30 AM - 11:00 PM' },
                  { day: 'Friday', time: '05:30 AM - 11:00 PM' },
                  { day: 'Saturday', time: '06:00 AM - 10:30 PM' },
                  { day: 'Sunday', time: '06:00 AM - 10:30 PM' },
                ].map((row, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ fontWeight: 600, color: isDarkMode ? '#e2e8f0' : '#1e293b' }}>{row.day}</span>
                    <span style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontFamily: 'monospace' }}>{row.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </Col>

          {/* Center Transition Arrow */}
          <Col xs={24} md={2} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6366f1',
                fontSize: 16,
              }}
            >
              <ArrowRightOutlined />
            </div>
          </Col>

          {/* Right: New Timings (Green Tone) */}
          <Col xs={24} md={11}>
            <Card
              style={{
                backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.08)' : '#f0fdf4',
                borderColor: isDarkMode ? 'rgba(34, 197, 94, 0.25)' : '#bbf7d0',
                borderRadius: 'var(--radius-base)',
              }}
              styles={{ body: { padding: '24px' } }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, color: '#16a34a', fontWeight: 700, fontSize: 14 }}>
                <CheckCircleOutlined /> New Timings
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { day: 'Monday', time: '05:00 AM - 11:30 PM', changed: true },
                  { day: 'Tuesday', time: '05:00 AM - 11:30 PM', changed: true },
                  { day: 'Wednesday', time: '05:00 AM - 11:30 PM', changed: true },
                  { day: 'Thursday', time: '05:00 AM - 11:30 PM', changed: true },
                  { day: 'Friday', time: '05:00 AM - 11:30 PM', changed: true },
                  { day: 'Saturday', time: '05:30 AM - 11:00 PM', changed: true },
                  { day: 'Sunday', time: '05:30 AM - 11:00 PM', changed: true },
                ].map((row, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                    <span style={{ fontWeight: 600, color: isDarkMode ? '#e2e8f0' : '#1e293b' }}>{row.day}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: isDarkMode ? '#ffffff' : '#0f172a', fontWeight: 700, fontFamily: 'monospace' }}>
                        {row.time}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a' }}>Changed</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Optional Notes Section */}
        <Card
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-color)',
            borderRadius: 'var(--radius-base)',
            marginBottom: 20,
          }}
          styles={{ body: { padding: '20px' } }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 8 }}>
            Notes (Optional)
          </div>
          <TextArea
            rows={3}
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Add notes about this change..."
            style={{
              borderRadius: 'var(--radius-base)',
              backgroundColor: isDarkMode ? '#111827' : '#ffffff',
              borderColor: isDarkMode ? '#374151' : '#d9d9d9',
              marginBottom: 16,
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setCurrentView('review')}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => {
                message.success('Timings modification note saved.');
                setCurrentView('review');
              }}
              style={{ backgroundColor: '#4338ca', borderColor: '#4338ca', fontWeight: 600 }}
            >
              Save Note
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: REVIEW CHANGES – GYM PROFILE (SCREEN 2)
  // =========================================================================
  if (currentView === 'review') {
    return (
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Top Back Link */}
        <div style={{ marginBottom: 14 }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => setCurrentView('list')}
            style={{ padding: 0, fontWeight: 600, color: 'var(--color-primary)' }}
          >
            Back to Pending Approvals
          </Button>
        </div>

        {/* Gym Header & Action Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                {selectedGym.name}
              </h1>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#fef4e8',
                  color: '#d97706',
                  border: `1px solid ${isDarkMode ? 'rgba(245, 158, 11, 0.3)' : '#fed7aa'}`,
                }}
              >
                Pending Approval
              </span>
            </div>
            <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', marginTop: 4 }}>
              Requested by <strong style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b' }}>{selectedGym.requestedBy}</strong> on {selectedGym.requestedOn}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Button
              danger
              onClick={() => setIsRejectModalOpen(true)}
              style={{ borderRadius: 'var(--radius-base)', fontWeight: 600, height: 40, padding: '0 18px' }}
            >
              Reject Changes
            </Button>
            <Button
              type="primary"
              onClick={() => setIsApproveModalOpen(true)}
              style={{
                borderRadius: 'var(--radius-base)',
                fontWeight: 700,
                backgroundColor: '#4338ca',
                borderColor: '#4338ca',
                height: 40,
                padding: '0 20px',
              }}
            >
              Approve All Changes
            </Button>
          </div>
        </div>

        {/* Tab Content Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
            8 changes requested in Gym Profile
          </div>
          <Button
            icon={<ExportOutlined />}
            onClick={() => message.info('Opening live customer preview...')}
            style={{ borderRadius: 'var(--radius-base)', fontWeight: 600, color: '#4338ca', borderColor: '#c7d2fe' }}
          >
            View in Customer App
          </Button>
        </div>

        {/* Diff Cards Grid */}
        <Row gutter={[20, 20]} style={{ marginBottom: 30 }}>
          {/* Card 1: Gym Photos */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700 }}>Gym Photos</span>
                  <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>Updated 2 images</span>
                </div>
              }
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                borderColor: 'var(--border-color)',
                borderRadius: 'var(--radius-base)',
                height: '100%',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 11, fontWeight: 700 }}>OLD</Text>
                  <img
                    src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=400&auto=format&fit=crop"
                    alt="Old Gym Photo"
                    style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, marginTop: 6 }}
                  />
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, color: '#16a34a' }}>NEW</Text>
                  <img
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop"
                    alt="New Gym Photo"
                    style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, marginTop: 6, border: '2px solid #22c55e' }}
                  />
                </div>
              </div>
            </Card>
          </Col>

          {/* Card 2: Gym Timings */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700 }}>Gym Timings</span>
                  <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>Updated</span>
                </div>
              }
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                borderColor: 'var(--border-color)',
                borderRadius: 'var(--radius-base)',
                height: '100%',
              }}
              extra={
                <Button type="link" onClick={() => setCurrentView('timing_diff')} style={{ padding: 0, fontWeight: 600 }}>
                  Detailed Diff →
                </Button>
              }
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ padding: '12px', borderRadius: 8, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>OLD</div>
                  <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>Mon - Sun</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', fontFamily: 'monospace' }}>
                    05:30 AM - 11:00 PM
                  </div>
                </div>

                <div style={{ padding: '12px', borderRadius: 8, backgroundColor: isDarkMode ? 'rgba(34,197,94,0.08)' : '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', marginBottom: 4 }}>NEW</div>
                  <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>Mon - Sun</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#16a34a', fontFamily: 'monospace' }}>
                    05:00 AM - 11:30 PM
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          {/* Card 3: Session Duration & Pricing */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700 }}>Session Duration & Pricing</span>
                  <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>Updated 3 plans</span>
                </div>
              }
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                borderColor: 'var(--border-color)',
                borderRadius: 'var(--radius-base)',
              }}
              styles={{ body: { padding: 0 } }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${isDarkMode ? '#222' : '#f1f5f9'}`, color: isDarkMode ? '#888' : '#64748b' }}>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 600 }}>Duration</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 600 }}>Old Price</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 600 }}>New Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${isDarkMode ? '#222' : '#f1f5f9'}` }}>
                    <td style={{ padding: '12px 20px', fontWeight: 600 }}>60 Minutes</td>
                    <td style={{ padding: '12px 20px', color: '#888888', textDecoration: 'line-through' }}>₹ 199</td>
                    <td style={{ padding: '12px 20px', fontWeight: 700, color: '#16a34a' }}>₹ 249</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${isDarkMode ? '#222' : '#f1f5f9'}` }}>
                    <td style={{ padding: '12px 20px', fontWeight: 600 }}>90 Minutes</td>
                    <td style={{ padding: '12px 20px', color: '#888888', textDecoration: 'line-through' }}>₹ 299</td>
                    <td style={{ padding: '12px 20px', fontWeight: 700, color: '#16a34a' }}>₹ 349</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px 20px', fontWeight: 600 }}>120 Minutes</td>
                    <td style={{ padding: '12px 20px', color: '#888888', textDecoration: 'line-through' }}>₹ 399</td>
                    <td style={{ padding: '12px 20px', fontWeight: 700, color: '#16a34a' }}>₹ 449</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </Col>

          {/* Card 4: Facilities & Amenities */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700 }}>Facilities & Amenities</span>
                  <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>Updated 2 items</span>
                </div>
              }
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                borderColor: 'var(--border-color)',
                borderRadius: 'var(--radius-base)',
              }}
              styles={{ body: { padding: '20px' } }}
            >
              <div style={{ marginBottom: 14 }}>
                <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, color: '#ef4444' }}>REMOVED</Text>
                <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                  <Tag color="error" style={{ borderRadius: 4, fontWeight: 600 }}>- Steam Room</Tag>
                  <Tag color="error" style={{ borderRadius: 4, fontWeight: 600 }}>- Juice Bar</Tag>
                </div>
              </div>

              <div>
                <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, color: '#16a34a' }}>ADDED</Text>
                <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                  <Tag color="success" style={{ borderRadius: 4, fontWeight: 600 }}>+ Sauna Suite</Tag>
                  <Tag color="success" style={{ borderRadius: 4, fontWeight: 600 }}>+ Meditation Room</Tag>
                </div>
              </div>
            </Card>
          </Col>

          {/* Card 5: Terms & Conditions */}
          <Col xs={24} sm={12}>
            <Card
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                borderColor: 'var(--border-color)',
                borderRadius: 'var(--radius-base)',
              }}
              styles={{ body: { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Terms & Conditions</div>
                <div style={{ fontSize: 12, color: '#16a34a' }}>Updated refund & cancellation policy</div>
              </div>
              <Button size="small" style={{ borderRadius: 'var(--radius-base)', fontWeight: 600, color: '#4338ca' }}>
                View Changes
              </Button>
            </Card>
          </Col>

          {/* Card 6: Safety Protocol */}
          <Col xs={24} sm={12}>
            <Card
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                borderColor: 'var(--border-color)',
                borderRadius: 'var(--radius-base)',
              }}
              styles={{ body: { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Safety Protocol</div>
                <div style={{ fontSize: 12, color: '#16a34a' }}>Added IoT Turnstile Emergency Lock Release</div>
              </div>
              <Button size="small" style={{ borderRadius: 'var(--radius-base)', fontWeight: 600, color: '#4338ca' }}>
                View Changes
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Screen 4: Confirmation Modal */}
        <Modal
          open={isApproveModalOpen}
          onCancel={() => setIsApproveModalOpen(false)}
          footer={null}
          centered
          width={440}
        >
          <div style={{ textAlign: 'center', padding: '24px 12px 12px 12px' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: '#eaf8ef',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <CheckCircleOutlined style={{ fontSize: 36, color: '#16a34a' }} />
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', margin: '0 0 8px 0' }}>
              Approve Changes?
            </h3>

            <p style={{ fontSize: 13, color: isDarkMode ? '#aaaaaa' : '#64748b', lineHeight: 1.5, marginBottom: 24 }}>
              All approved changes will be published and reflected in the customer app immediately. This action cannot be undone.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Button
                onClick={() => setIsApproveModalOpen(false)}
                style={{ height: 42, borderRadius: 'var(--radius-base)', fontWeight: 600 }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleApproveAll}
                style={{
                  height: 42,
                  borderRadius: 'var(--radius-base)',
                  backgroundColor: '#4338ca',
                  borderColor: '#4338ca',
                  fontWeight: 700,
                }}
              >
                Yes, Approve All
              </Button>
            </div>
          </div>
        </Modal>

        {/* Rejection Modal */}
        <Modal
          title="Reject Gym Changes"
          open={isRejectModalOpen}
          onCancel={() => setIsRejectModalOpen(false)}
          footer={null}
          centered
          width={480}
        >
          <div style={{ padding: '12px 0' }}>
            <p style={{ fontSize: 13, color: isDarkMode ? '#aaaaaa' : '#64748b', marginBottom: 12 }}>
              Please specify the reason for rejecting changes submitted by <strong>{selectedGym.requestedBy}</strong>:
            </p>
            <TextArea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Photo resolution too low, pricing does not adhere to platform standard..."
              style={{ marginBottom: 18 }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
              <Button danger type="primary" onClick={handleReject} style={{ fontWeight: 600 }}>
                Confirm Rejection
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: MAIN LIST VIEW (SCREEN 1 & ALL GYMS)
  // =========================================================================
  const isPendingView = currentTab === 'pending';

  const getHeaderBadge = () => {
    switch (currentTab) {
      case 'pending':
        return <Badge count={18} style={{ backgroundColor: '#d97706', fontWeight: 800 }} />;
      case 'approved':
        return <Badge count={1180} overflowCount={9999} style={{ backgroundColor: '#16a34a', fontWeight: 800 }} />;
      case 'on_hold':
        return <Badge count={35} style={{ backgroundColor: '#3b82f6', fontWeight: 800 }} />;
      case 'rejected':
        return <Badge count={15} style={{ backgroundColor: '#ef4444', fontWeight: 800 }} />;
      default:
        return <Badge count={1248} overflowCount={9999} style={{ backgroundColor: '#4338ca', fontWeight: 800 }} />;
    }
  };

  const getHeaderTitle = () => {
    switch (currentTab) {
      case 'pending':
        return 'Pending Approval';
      case 'approved':
        return 'Active & Approved Gyms';
      case 'on_hold':
        return 'On Hold Gyms';
      case 'rejected':
        return 'Rejected Gyms';
      default:
        return 'All Gyms Directory';
    }
  };

  const getHeaderSubtitle = () => {
    switch (currentTab) {
      case 'pending':
        return 'Gyms that have requested profile, timing, pricing, or amenity changes and are awaiting your verification.';
      case 'approved':
        return 'Verified and published gym partners operating live on the Gymezy platform.';
      case 'on_hold':
        return 'Gym partners currently placed on administrative hold pending document re-submission.';
      case 'rejected':
        return 'Gym listings that did not meet onboarding quality and compliance standards.';
      default:
        return 'View, search, filter, and manage all 1,248 partner gyms across the nationwide network.';
    }
  };

  return (
    <div style={{ maxWidth: 1320, margin: '0 auto' }}>
      {/* 1. Page Header & Action Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: isDarkMode ? '#ffffff' : '#0f172a',
                margin: 0,
                letterSpacing: '-0.3px',
              }}
            >
              {getHeaderTitle()}
            </h1>
            {getHeaderBadge()}
          </div>
          <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13 }}>
            {getHeaderSubtitle()}
          </Text>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => message.info('Opening Partner Onboarding Flow...')}
            style={{
              height: 40,
              padding: '0 18px',
              borderRadius: 'var(--radius-base)',
              backgroundColor: '#4338ca',
              borderColor: '#4338ca',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Add New Gym <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
          </Button>
        </div>
      </div>

      {/* 2. Multi-Field Filter Bar */}
      <Card
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-color)',
          borderRadius: 'var(--radius-base)',
          marginBottom: 20,
        }}
        styles={{ body: { padding: '18px 20px' } }}
      >
        <Row gutter={[14, 14]}>
          <Col xs={24} sm={12} lg={6}>
            <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#334155', marginBottom: 6 }}>
              Gym Name
            </div>
            <Input
              placeholder="Search by gym name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              style={{ height: 38, borderRadius: 'var(--radius-base)' }}
              allowClear
            />
          </Col>

          <Col xs={24} sm={12} lg={4}>
            <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#334155', marginBottom: 6 }}>
              Approval Status
            </div>
            <Select value={searchStatus} onChange={setSearchStatus} style={{ width: '100%', height: 38 }}>
              <Option value="All">All Status</Option>
              <Option value="Approved">Approved</Option>
              <Option value="Pending Approval">Pending Approval</Option>
              <Option value="Rejected">Rejected</Option>
              <Option value="On Hold">On Hold</Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} lg={5}>
            <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#334155', marginBottom: 6 }}>
              Subscription Tier
            </div>
            <Select value={searchSubscriptionType} onChange={setSearchSubscriptionType} style={{ width: '100%', height: 38 }}>
              <Option value="All">All Plans</Option>
              <Option value="Hybrid">Hybrid (₹ 4,999/mo)</Option>
              <Option value="App Only">App Only (₹ 2,999/mo)</Option>
              <Option value="GMS">GMS Only (₹ 1,999/mo)</Option>
              <Option value="Listing Only">Listing Only (₹ 999/mo)</Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} lg={5}>
            <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#334155', marginBottom: 6 }}>
              Location / City
            </div>
            <Input
              placeholder="Chennai, Mumbai, Pune..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              suffix={<EnvironmentOutlined style={{ color: '#94a3b8' }} />}
              style={{ height: 38, borderRadius: 'var(--radius-base)' }}
              allowClear
            />
          </Col>

          <Col xs={24} sm={12} lg={4}>
            <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#334155', marginBottom: 6 }}>
              Phone Number
            </div>
            <Input
              placeholder="+91..."
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              style={{ height: 38, borderRadius: 'var(--radius-base)' }}
              allowClear
            />
          </Col>
        </Row>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
          <div style={{ fontSize: 13, color: isDarkMode ? '#888' : '#64748b' }}>
            Found <strong style={{ color: isDarkMode ? '#fff' : '#0f172a' }}>{filteredGyms.length}</strong> matching gyms
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button
              size="small"
              onClick={() => {
                setSearchName('');
                setSearchStatus('All');
                setSearchSubscriptionType('All');
                setSearchLocation('');
                setSearchPhone('');
              }}
            >
              Reset Filters
            </Button>
            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => message.success('Exporting gyms list as CSV...')}
            >
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* 4. Gyms Table */}
      <Card
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-color)',
          borderRadius: 'var(--radius-base)',
          overflow: 'hidden',
          marginBottom: 20,
        }}
        styles={{ body: { padding: 0 } }}
      >
        {isPendingView ? (
          /* PENDING APPROVAL TABLE */
          <Table
            dataSource={filteredGyms}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1000 }}
            size="middle"
            columns={[
              {
                title: 'Gym Name',
                dataIndex: 'name',
                key: 'name',
                width: 210,
                render: (name, record) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                      src={record.image}
                      alt={name}
                      style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                        {name}
                      </div>
                      <div style={{ fontSize: 12, color: isDarkMode ? '#888' : '#64748b' }}>
                        {record.phone}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                title: 'Location',
                dataIndex: 'location',
                key: 'location',
                width: 200,
                render: (loc) => (
                  <span style={{ color: isDarkMode ? '#d1d5db' : '#334155' }}>{loc}</span>
                ),
              },
              {
                title: 'Requested By',
                dataIndex: 'requestedBy',
                key: 'requestedBy',
                width: 170,
                render: (req) => (
                  <span style={{ fontWeight: 600, color: isDarkMode ? '#e2e8f0' : '#1e293b' }}>{req}</span>
                ),
              },
              {
                title: 'Requested On',
                dataIndex: 'requestedOn',
                key: 'requestedOn',
                width: 180,
                render: (date) => (
                  <span style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13 }}>{date}</span>
                ),
              },
              {
                title: 'Changes',
                dataIndex: 'changesCount',
                key: 'changesCount',
                width: 130,
                render: (count) => (
                  <Tag color="orange" style={{ fontWeight: 700, borderRadius: 4 }}>
                    {count} Changes
                  </Tag>
                ),
              },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                width: 120,
                render: () => (
                  <Tag color="gold" style={{ fontWeight: 700, letterSpacing: '0.4px' }}>
                    Pending
                  </Tag>
                ),
              },
              {
                title: 'Action',
                key: 'action',
                width: 120,
                align: 'center',
                fixed: 'right',
                onCell: () => ({
                  style: {
                    backgroundColor: isDarkMode ? '#0d1117' : '#ffffff',
                  },
                }),
                render: (_, record) => (
                  <Button
                    size="small"
                    onClick={() => handleOpenReview(record)}
                    style={{
                      borderRadius: 6,
                      fontWeight: 700,
                      color: '#4338ca',
                      borderColor: '#c7d2fe',
                      backgroundColor: isDarkMode ? 'rgba(99,102,241,0.1)' : '#eef2ff',
                      fontSize: 12,
                    }}
                  >
                    Review →
                  </Button>
                ),
              },
            ]}
          />
        ) : (
          /* ALL / APPROVED / ON-HOLD / REJECTED GYMS TABLE */
          <Table
            dataSource={filteredGyms}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1200 }}
            size="middle"
            columns={[
              {
                title: 'Gym & Contact',
                dataIndex: 'name',
                key: 'name',
                width: 240,
                render: (name, record) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                      src={record.image}
                      alt={name}
                      style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                        {name}
                      </div>
                      <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>
                        {record.phone}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                title: 'Location',
                dataIndex: 'location',
                key: 'location',
                width: 190,
                render: (loc) => <span style={{ color: isDarkMode ? '#d1d5db' : '#334155' }}>{loc}</span>,
              },
              {
                title: 'Partner / Owner',
                dataIndex: 'requestedBy',
                key: 'requestedBy',
                width: 160,
                render: (owner) => <span style={{ fontWeight: 600 }}>{owner}</span>,
              },
              {
                title: 'Approval Status',
                dataIndex: 'approvalStatus',
                key: 'approvalStatus',
                width: 150,
                render: (status) => {
                  let color = 'default';
                  if (status === 'Approved') color = 'success';
                  else if (status === 'Pending Approval') color = 'warning';
                  else if (status === 'On Hold') color = 'processing';
                  else if (status === 'Rejected') color = 'error';
                  return <Tag color={color} style={{ fontWeight: 600 }}>{status}</Tag>;
                },
              },
              {
                title: 'Subscription Tier',
                dataIndex: 'subscriptionType',
                key: 'subscriptionType',
                width: 150,
                render: (type) => {
                  let color = 'blue';
                  if (type === 'Hybrid') color = 'purple';
                  else if (type === 'GMS') color = 'cyan';
                  else if (type === 'Listing Only') color = 'default';
                  return <Tag color={color} style={{ fontWeight: 600 }}>{type}</Tag>;
                },
              },
              {
                title: 'Monthly GMV',
                dataIndex: 'monthlyRevenue',
                key: 'monthlyRevenue',
                width: 140,
                render: (rev) => (
                  <span style={{ fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>
                    {rev || '₹ 1,50,000'}
                  </span>
                ),
              },
              {
                title: 'Plan Status',
                dataIndex: 'subscriptionStatus',
                key: 'subscriptionStatus',
                width: 130,
                render: (status) => (
                  <Tag color={status === 'Active' ? 'green' : 'red'} style={{ fontWeight: 600 }}>
                    {status}
                  </Tag>
                ),
              },
              {
                title: 'Action',
                key: 'actions',
                width: 140,
                fixed: 'right',
                align: 'center',
                onCell: () => ({
                  style: {
                    backgroundColor: isDarkMode ? '#0d1117' : '#ffffff',
                  },
                }),
                render: (_, record) => (
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                    <Button
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => handleOpenDetails(record)}
                      style={{ borderRadius: 6, fontWeight: 600 }}
                    >
                      View
                    </Button>
                    {record.approvalStatus === 'Pending Approval' && (
                      <Button
                        size="small"
                        type="primary"
                        onClick={() => handleOpenReview(record)}
                        style={{
                          borderRadius: 6,
                          fontWeight: 700,
                          backgroundColor: '#4338ca',
                          borderColor: '#4338ca',
                        }}
                      >
                        Review
                      </Button>
                    )}
                  </div>
                ),
              },
            ]}
          />
        )}
      </Card>

      {/* 5. Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b' }}>
          Showing 1 to {filteredGyms.length} of {isPendingView ? '18' : '1,248'} gyms
        </div>
        <Pagination
          current={currentPage}
          total={isPendingView ? 18 : 1248}
          pageSize={5}
          onChange={setCurrentPage}
          showSizeChanger={false}
        />
      </div>

      {/* 6. Comprehensive Gym Profile Details Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ShopOutlined style={{ color: '#4338ca', fontSize: 20 }} />
            <span>Gym Partner Profile Details</span>
          </div>
        }
        open={isDetailsModalOpen}
        onCancel={() => setIsDetailsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailsModalOpen(false)}>
            Close
          </Button>,
          detailsGym?.approvalStatus === 'Pending Approval' ? (
            <Button
              key="review"
              type="primary"
              onClick={() => {
                setIsDetailsModalOpen(false);
                handleOpenReview(detailsGym);
              }}
              style={{ backgroundColor: '#4338ca', borderColor: '#4338ca' }}
            >
              Review Pending Changes →
            </Button>
          ) : (
            <Button
              key="edit"
              type="primary"
              onClick={() => {
                message.info(`Editing configuration for ${detailsGym?.name}`);
                setIsDetailsModalOpen(false);
              }}
              style={{ backgroundColor: '#4338ca', borderColor: '#4338ca' }}
            >
              Edit Partner Settings
            </Button>
          ),
        ]}
        width={720}
        centered
      >
        {detailsGym && (
          <div style={{ padding: '12px 0' }}>
            {/* Top Gym Header Card */}
            <div
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                padding: 16,
                borderRadius: 10,
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                border: `1px solid ${isDarkMode ? '#222' : '#e2e8f0'}`,
                marginBottom: 20,
              }}
            >
              <img
                src={detailsGym.image}
                alt={detailsGym.name}
                style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{detailsGym.name}</h2>
                  <Tag color={detailsGym.approvalStatus === 'Approved' ? 'success' : detailsGym.approvalStatus === 'Pending Approval' ? 'warning' : 'blue'}>
                    {detailsGym.approvalStatus}
                  </Tag>
                </div>
                <div style={{ color: isDarkMode ? '#888' : '#64748b', fontSize: 13, marginBottom: 4 }}>
                  <EnvironmentOutlined style={{ marginRight: 6 }} />
                  {detailsGym.location}
                </div>
                <div style={{ color: isDarkMode ? '#888' : '#64748b', fontSize: 13 }}>
                  <PhoneOutlined style={{ marginRight: 6 }} />
                  {detailsGym.phone}
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
              <Col span={6}>
                <div style={{ padding: 12, borderRadius: 8, backgroundColor: isDarkMode ? '#141414' : '#f1f5f9', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>MEMBERS</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#3b82f6', marginTop: 2 }}>{detailsGym.membersCount || 450}</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ padding: 12, borderRadius: 8, backgroundColor: isDarkMode ? '#141414' : '#f1f5f9', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>MONTHLY GMV</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#16a34a', marginTop: 2 }}>{detailsGym.monthlyRevenue || '₹ 1.85L'}</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ padding: 12, borderRadius: 8, backgroundColor: isDarkMode ? '#141414' : '#f1f5f9', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>PLAN TIER</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#8b5cf6', marginTop: 3 }}>{detailsGym.subscriptionType}</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ padding: 12, borderRadius: 8, backgroundColor: isDarkMode ? '#141414' : '#f1f5f9', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>RATING</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b', marginTop: 2 }}>★ {detailsGym.rating || 4.8}</div>
                </div>
              </Col>
            </Row>

            {/* Key Information Sections */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: 14, borderRadius: 8, border: `1px solid ${isDarkMode ? '#222' : '#e2e8f0'}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: isDarkMode ? '#ccc' : '#334155', marginBottom: 8 }}>
                  Partner / Contact Person
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{detailsGym.requestedBy}</div>
                <div style={{ fontSize: 12, color: '#888' }}>Authorized Gym Franchise Owner</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Last verified on 15 May 2026</div>
              </div>

              <div style={{ padding: 14, borderRadius: 8, border: `1px solid ${isDarkMode ? '#222' : '#e2e8f0'}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: isDarkMode ? '#ccc' : '#334155', marginBottom: 8 }}>
                  Platform Status
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <Tag color="success">Listed on App</Tag>
                  <Tag color="blue">IoT Turnstile Active</Tag>
                </div>
                <div style={{ fontSize: 12, color: '#888' }}>Payouts enabled via Razorpay Route</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GymsManagement;
