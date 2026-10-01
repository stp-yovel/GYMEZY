import React, { useState, useMemo, useEffect } from 'react';
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
  InputNumber,
  Avatar,
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
  ThunderboltOutlined,
  FileAddOutlined,
  UploadOutlined,
  RocketOutlined,
  StarFilled,
} from '@ant-design/icons';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  addGym,
  approveGym,
  rejectGym,
  deleteGym,
  setGymStatus,
  fetchGyms,
} from '../redux/slices/gymSlice';
import { useTheme } from '../theme/ThemeContext';
import { apiClient } from '../services/apiClient';
import GymDetailsView from './components/GymDetailsView';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const getGymLocation = (gym) => {
  if (!gym) return '—';
  if (typeof gym.location === 'string' && gym.location) return gym.location;
  const parts = [gym.area, gym.city, gym.state].filter(Boolean);
  if (parts.length > 0) return parts.join(', ');
  if (typeof gym.fullAddress === 'string' && gym.fullAddress) return gym.fullAddress;
  if (typeof gym.address === 'string' && gym.address) return gym.address;
  if (typeof gym.city === 'string' && gym.city) return gym.city;
  return '—';
};

const getGymInitials = (name) => {
  if (!name || typeof name !== 'string') return 'GY';
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'GY';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

const getGymLogoSrc = (gym) => {
  if (!gym) return '';
  if (typeof gym.logo === 'string' && gym.logo) return gym.logo;
  if (gym.logo && typeof gym.logo.fileData === 'string' && gym.logo.fileData) return gym.logo.fileData;
  if (typeof gym.logoUrl === 'string' && gym.logoUrl) return gym.logoUrl;
  if (gym.coverPhoto && typeof gym.coverPhoto.fileData === 'string' && gym.coverPhoto.fileData) return gym.coverPhoto.fileData;
  if (typeof gym.coverPhoto === 'string' && gym.coverPhoto) return gym.coverPhoto;
  if (typeof gym.image === 'string' && gym.image) return gym.image;
  return '';
};

const getGymImage = (gym) => {
  if (!gym) return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop';
  if (typeof gym.logo === 'string' && gym.logo) return gym.logo;
  if (gym.logo && typeof gym.logo.fileData === 'string' && gym.logo.fileData) return gym.logo.fileData;
  if (typeof gym.image === 'string' && gym.image) return gym.image;
  if (typeof gym.coverPhoto === 'string' && gym.coverPhoto) return gym.coverPhoto;
  if (gym.coverPhoto && typeof gym.coverPhoto.fileData === 'string' && gym.coverPhoto.fileData) return gym.coverPhoto.fileData;
  return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop';
};

export const GymsManagement = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'all';

  // Redux Fleet Data directly from store (zero mock fallbacks)
  const reduxGyms = useSelector((state) => state.gyms?.gyms) || [];

  useEffect(() => {
    dispatch(fetchGyms());
  }, [dispatch]);

  // Navigation Views: 'list' | 'review' | 'timing_diff'
  const [currentView, setCurrentView] = useState('list');
  const [selectedGym, setSelectedGym] = useState(reduxGyms[0] || null);
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
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  const [quickAddForm] = Form.useForm();
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNote, setAdminNote] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Active dataset depending on active Tab from Redux
  const activeGymsList = useMemo(() => {
    if (currentTab === 'pending') return reduxGyms.filter((g) => g.approvalStatus === 'Pending Approval' || g.status === 'Pending');
    if (currentTab === 'approved') return reduxGyms.filter((g) => g.approvalStatus === 'Approved');
    if (currentTab === 'rejected') return reduxGyms.filter((g) => g.approvalStatus === 'Rejected');
    if (currentTab === 'on_hold') return reduxGyms.filter((g) => g.approvalStatus === 'On Hold');
    return reduxGyms;
  }, [currentTab, reduxGyms]);

  const filteredGyms = useMemo(() => {
    return activeGymsList.filter((gym) => {
      const matchName = String(gym.name || '').toLowerCase().includes(searchName.toLowerCase());
      const matchStatus = searchStatus === 'All' || gym.approvalStatus === searchStatus || gym.status === searchStatus;
      const matchSubType = searchSubscriptionType === 'All' || gym.subscriptionType === searchSubscriptionType;
      const locStr = getGymLocation(gym);
      const matchLocation = locStr.toLowerCase().includes(searchLocation.toLowerCase());
      const matchPhone = String(gym.phone || '').toLowerCase().includes(searchPhone.toLowerCase());
      return matchName && matchStatus && matchSubType && matchLocation && matchPhone;
    });
  }, [activeGymsList, searchName, searchStatus, searchSubscriptionType, searchLocation, searchPhone]);

  // Reset currentView to 'list' whenever sidebar tab changes
  useEffect(() => {
    setCurrentView('list');
    setCurrentPage(1);
  }, [currentTab]);

  const handleOpenReview = (gym) => {
    setSelectedGym(gym);
    setCurrentView('review');
  };

  const handleOpenDetails = (gym) => {
    setSelectedGym(gym);
    setCurrentView('details');
  };

  const handleTabChange = (key) => {
    setSearchParams({ tab: key });
    setCurrentView('list');
    setCurrentPage(1);
  };

  const handleApproveAll = () => {
    if (selectedGym) {
      dispatch(approveGym(selectedGym.id));
      message.success(`Gym "${selectedGym.name}" approved and published to customer app!`);
    }
    setIsApproveModalOpen(false);
    setCurrentView('list');
  };

  const handleReject = () => {
    if (selectedGym) {
      dispatch(rejectGym({ id: selectedGym.id, reason: rejectionReason }));
      message.warning(`Changes for "${selectedGym.name}" rejected. Reason sent to owner.`);
    }
    setIsRejectModalOpen(false);
    setCurrentView('list');
  };

  const handleDeleteGym = async (gymId, gymName) => {
    try {
      if (gymId && (gymId.length === 24 || !gymId.startsWith('GYM-'))) {
        await apiClient.delete(`/gyms/${gymId}`);
      }
      dispatch(deleteGym(gymId));
      message.success(`Gym "${gymName}" deleted successfully.`);
    } catch {
      dispatch(deleteGym(gymId));
      message.success(`Gym "${gymName}" removed.`);
    }
  };

  const handleQuickAddSubmit = (values) => {
    const newGym = {
      id: `GYM-${Math.floor(1000 + Math.random() * 9000)}`,
      name: values.name,
      ownerName: values.ownerName,
      phone: values.phone.startsWith('+91') ? values.phone : `+91 ${values.phone}`,
      email: values.email,
      location: `${values.area || values.city}, ${values.city}`,
      fullAddress: `${values.area}, ${values.city}`,
      city: values.city,
      singleSessionPrice: Number(values.singleSessionPrice) || 199,
      subscriptionType: values.subscriptionType || 'Hybrid',
      subscriptionStatus: 'Active',
      status: 'Active',
      approvalStatus: 'Approved',
      image: values.image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop',
      facilities: ['AC Gym', 'Locker Facility', 'Shower Available', 'Free Wi-Fi'],
      amenities: ['RO Drinking Water', 'Towel Service', 'First Aid Kit', 'CCTV 24/7'],
      workouts: ['GYM', 'Cardio', 'HIIT', 'Yoga'],
      trainers: [],
      rules: ['Clean indoor shoes mandatory', 'Towel mandatory on benches'],
      safety: ['CCTV surveillance', 'Daily equipment sanitization'],
    };

    dispatch(addGym(newGym));
    message.success(`New gym "${newGym.name}" onboarded and live on GYMEZY!`);
    setIsQuickAddModalOpen(false);
    quickAddForm.resetFields();
  };

  // =========================================================================
  // VIEW 4: COMPREHENSIVE FULL-PAGE GYM DETAILS & BOOKINGS VIEW
  // =========================================================================
  if (currentView === 'details' && selectedGym) {
    return (
      <GymDetailsView
        gym={selectedGym}
        allGyms={reduxGyms}
        onBack={() => setCurrentView('list')}
        onSelectGym={(g) => setSelectedGym(g)}
        onApprove={handleApproveAll}
        onReject={() => setIsRejectModalOpen(true)}
        onStatusChange={(id, status) => dispatch(setGymStatus({ id, status }))}
      />
    );
  }

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
        {/* Top Back Link & Switcher */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => setCurrentView('list')}
            style={{ padding: 0, fontWeight: 600, color: 'var(--color-primary)', fontSize: 14 }}
          >
            ← Back to Gyms Fleet
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: isDarkMode ? '#cbd5e1' : '#475569' }}>
              Switch Pending Gym:
            </span>
            <Select
              value={selectedGym?.id}
              onChange={(gymId) => {
                const target = reduxGyms.find((g) => g.id === gymId);
                if (target) setSelectedGym(target);
              }}
              style={{ width: 220 }}
            >
              {reduxGyms
                .filter((g) => g.approvalStatus === 'Pending Approval' || g.status === 'Pending')
                .map((g) => (
                  <Option key={g.id} value={g.id}>
                    {g.name}
                  </Option>
                ))}
            </Select>
          </div>
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
              <Tag color="blue" style={{ fontWeight: 700, fontSize: 13, padding: '2px 8px' }}>
                {selectedGym.partnerId || selectedGym.gymId || selectedGym.id}
              </Tag>
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
                {selectedGym.approvalStatus || 'Pending Approval'}
              </span>
            </div>
            <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', marginTop: 4 }}>
              Requested by <strong style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b' }}>{selectedGym.requestedBy || selectedGym.ownerName || 'Gym Partner'}</strong> on {selectedGym.requestedOn || 'Recent'}
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
      case 'pending': {
        const count = reduxGyms.filter((g) => g.approvalStatus === 'Pending Approval' || g.status === 'Pending' || g.approvalStatus === 'Pending').length;
        return count > 0 ? <Badge count={count} style={{ backgroundColor: '#d97706', fontWeight: 800 }} /> : null;
      }
      case 'approved': {
        const count = reduxGyms.filter((g) => g.approvalStatus === 'Approved' || g.status === 'Active').length;
        return count > 0 ? <Badge count={count} overflowCount={9999} style={{ backgroundColor: '#16a34a', fontWeight: 800 }} /> : null;
      }
      case 'on_hold': {
        const count = reduxGyms.filter((g) => g.approvalStatus === 'On Hold' || g.status === 'On Hold' || g.status === 'Inactive').length;
        return count > 0 ? <Badge count={count} style={{ backgroundColor: '#3b82f6', fontWeight: 800 }} /> : null;
      }
      case 'rejected': {
        const count = reduxGyms.filter((g) => g.approvalStatus === 'Rejected' || g.status === 'Rejected').length;
        return count > 0 ? <Badge count={count} style={{ backgroundColor: '#ef4444', fontWeight: 800 }} /> : null;
      }
      default: {
        const count = reduxGyms.length;
        return count > 0 ? <Badge count={count} overflowCount={9999} style={{ backgroundColor: '#4338ca', fontWeight: 800 }} /> : null;
      }
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
        return 'Gyms that have requested profile, timing, pricing, or amenity changes and are awaiting verification.';
      case 'approved':
        return 'Verified and published gym partners operating live on the Gymezy platform.';
      case 'on_hold':
        return 'Gym partners currently placed on administrative hold pending document re-submission.';
      case 'rejected':
        return 'Gym listings that did not meet onboarding quality and compliance standards.';
      default:
        return `View, search, filter, and manage all ${reduxGyms.length} partner gyms across the nationwide network.`;
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
          <Dropdown
            menu={{
              items: [
                {
                  key: 'full-wizard',
                  icon: <RocketOutlined style={{ color: '#4338ca' }} />,
                  label: (
                    <div style={{ padding: '4px 0' }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: isDarkMode ? '#fff' : '#0f172a' }}>
                        Full Onboarding Wizard (8 Steps)
                      </div>
                      <div style={{ fontSize: 11, color: '#888' }}>
                        Configure facilities, trainers, pricing, rules & bank setup
                      </div>
                    </div>
                  ),
                  onClick: () => navigate('/admin/onboarding'),
                },
                {
                  type: 'divider',
                },
                {
                  key: 'quick-add',
                  icon: <ThunderboltOutlined style={{ color: '#16a34a' }} />,
                  label: (
                    <div style={{ padding: '4px 0' }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: isDarkMode ? '#fff' : '#0f172a' }}>
                        Quick Onboard Partner (1 Min)
                      </div>
                      <div style={{ fontSize: 11, color: '#888' }}>
                        Instant registration modal popup
                      </div>
                    </div>
                  ),
                  onClick: () => setIsQuickAddModalOpen(true),
                },
                {
                  key: 'bulk-import',
                  icon: <UploadOutlined style={{ color: '#ea580c' }} />,
                  label: (
                    <div style={{ padding: '4px 0' }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: isDarkMode ? '#fff' : '#0f172a' }}>
                        Bulk Import Gyms (CSV)
                      </div>
                      <div style={{ fontSize: 11, color: '#888' }}>
                        Upload multi-branch gym spreadsheet
                      </div>
                    </div>
                  ),
                  onClick: () => message.info('Batch CSV Import template ready for upload.'),
                },
              ],
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{
                height: 40,
                padding: '0 18px',
                borderRadius: 'var(--radius-base)',
                backgroundColor: '#4338ca',
                borderColor: '#4338ca',
                fontWeight: 700,
                fontSize: 14,
                boxShadow: '0 4px 14px rgba(67, 56, 202, 0.35)',
              }}
            >
              Add New Gym <DownOutlined style={{ fontSize: 10, marginLeft: 6 }} />
            </Button>
          </Dropdown>
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
            rowKey={(record) => record.id || record._id || String(Math.random())}
            pagination={false}
            scroll={{ x: 1350 }}
            size="middle"
            columns={[
              {
                title: 'Partner ID',
                dataIndex: 'partnerId',
                key: 'partnerId',
                width: 110,
                render: (_, record) => {
                  const partnerIdDisplay = record.partnerId || record.gymId || record.id;
                  return (
                    <span
                      onClick={() => handleOpenDetails(record)}
                      style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: isDarkMode ? '#818cf8' : '#4338ca',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        letterSpacing: '0.3px',
                      }}
                    >
                      {partnerIdDisplay}
                    </span>
                  );
                },
              },
              {
                title: 'Gym Logo',
                key: 'logo',
                width: 90,
                align: 'center',
                render: (_, record) => {
                  const logoSrc = getGymLogoSrc(record);
                  const initials = getGymInitials(record.name);
                  return (
                    <div
                      onClick={() => handleOpenDetails(record)}
                      style={{ display: 'inline-flex', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {logoSrc ? (
                        <img
                          src={logoSrc}
                          alt={record.name || 'Logo'}
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 8,
                            objectFit: 'cover',
                            border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                          }}
                        />
                      ) : (
                        <Avatar
                          shape="square"
                          size={38}
                          style={{
                            backgroundColor: '#4338ca',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: 13,
                            borderRadius: 8,
                          }}
                        >
                          {initials}
                        </Avatar>
                      )}
                    </div>
                  );
                },
              },
              {
                title: 'Gym Name',
                dataIndex: 'name',
                key: 'name',
                width: 200,
                render: (name) => (
                  <span
                    style={{
                      fontWeight: 700,
                      color: isDarkMode ? '#f8fafc' : '#0f172a',
                      fontSize: 13.5,
                      lineHeight: '1.4',
                    }}
                  >
                    {name}
                  </span>
                ),
              },
              {
                title: 'Phone Number',
                dataIndex: 'phone',
                key: 'phone',
                width: 140,
                render: (phone) => (
                  <span style={{ fontSize: 13, color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
                    {phone || '—'}
                  </span>
                ),
              },
              {
                title: 'Location',
                dataIndex: 'location',
                key: 'location',
                width: 190,
                render: (_, record) => (
                  <span
                    style={{
                      color: isDarkMode ? '#d1d5db' : '#334155',
                      fontSize: 13,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: '18px',
                    }}
                    title={getGymLocation(record)}
                  >
                    {getGymLocation(record)}
                  </span>
                ),
              },
              {
                title: 'Requested By',
                dataIndex: 'requestedBy',
                key: 'requestedBy',
                width: 160,
                render: (req, record) => (
                  <span
                    onClick={() => handleOpenDetails(record)}
                    style={{
                      fontWeight: 600,
                      color: isDarkMode ? '#e2e8f0' : '#1e293b',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontSize: 13,
                    }}
                  >
                    {req || record.ownerName || 'Gym Partner'}
                  </span>
                ),
              },
              {
                title: 'Requested On',
                dataIndex: 'requestedOn',
                key: 'requestedOn',
                width: 150,
                render: (date) => (
                  <span style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13 }}>{date || 'Recent'}</span>
                ),
              },
              {
                title: 'Changes',
                dataIndex: 'changesCount',
                key: 'changesCount',
                width: 120,
                render: (count) => (
                  <Tag color="orange" style={{ fontWeight: 700, borderRadius: 4 }}>
                    {count || 1} Changes
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
                width: 110,
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
            rowKey={(record) => record.id || record._id || String(Math.random())}
            pagination={false}
            scroll={{ x: 1450 }}
            size="middle"
            columns={[
              {
                title: 'Partner ID',
                dataIndex: 'partnerId',
                key: 'partnerId',
                width: 110,
                render: (_, record) => {
                  const partnerIdDisplay = record.partnerId || record.gymId || record.id;
                  return (
                    <span
                      onClick={() => handleOpenDetails(record)}
                      style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: isDarkMode ? '#818cf8' : '#4338ca',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        letterSpacing: '0.3px',
                      }}
                    >
                      {partnerIdDisplay}
                    </span>
                  );
                },
              },
              {
                title: 'Gym Logo',
                key: 'logo',
                width: 90,
                align: 'center',
                render: (_, record) => {
                  const logoSrc = getGymLogoSrc(record);
                  const initials = getGymInitials(record.name);
                  return (
                    <div
                      onClick={() => handleOpenDetails(record)}
                      style={{ display: 'inline-flex', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {logoSrc ? (
                        <img
                          src={logoSrc}
                          alt={record.name || 'Logo'}
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 8,
                            objectFit: 'cover',
                            border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                          }}
                        />
                      ) : (
                        <Avatar
                          shape="square"
                          size={38}
                          style={{
                            backgroundColor: '#4338ca',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: 13,
                            borderRadius: 8,
                          }}
                        >
                          {initials}
                        </Avatar>
                      )}
                    </div>
                  );
                },
              },
              {
                title: 'Gym Name',
                dataIndex: 'name',
                key: 'name',
                width: 200,
                render: (name) => (
                  <span
                    style={{
                      fontWeight: 700,
                      color: isDarkMode ? '#f8fafc' : '#0f172a',
                      fontSize: 13.5,
                      lineHeight: '1.4',
                    }}
                  >
                    {name}
                  </span>
                ),
              },
              {
                title: 'Phone Number',
                dataIndex: 'phone',
                key: 'phone',
                width: 140,
                render: (phone) => (
                  <span style={{ fontSize: 13, color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
                    {phone || '—'}
                  </span>
                ),
              },
              {
                title: 'Location',
                dataIndex: 'location',
                key: 'location',
                width: 190,
                render: (_, record) => (
                  <span
                    style={{
                      color: isDarkMode ? '#d1d5db' : '#334155',
                      fontSize: 13,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: '18px',
                    }}
                    title={getGymLocation(record)}
                  >
                    {getGymLocation(record)}
                  </span>
                ),
              },
              {
                title: 'Partner / Owner',
                dataIndex: 'requestedBy',
                key: 'requestedBy',
                width: 150,
                render: (owner, record) => (
                  <span
                    onClick={() => handleOpenDetails(record)}
                    style={{
                      fontWeight: 600,
                      color: isDarkMode ? '#e2e8f0' : '#1e293b',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontSize: 13,
                    }}
                  >
                    {owner || record.ownerName || 'Gym Partner'}
                  </span>
                ),
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
                  return <Tag color={color} style={{ fontWeight: 600 }}>{status || 'Approved'}</Tag>;
                },
              },
              {
                title: 'Subscription Tier',
                dataIndex: 'subscriptionType',
                key: 'subscriptionType',
                width: 140,
                render: (type) => {
                  let color = 'blue';
                  if (type === 'Hybrid') color = 'purple';
                  else if (type === 'GMS') color = 'cyan';
                  else if (type === 'Listing Only') color = 'default';
                  return <Tag color={color} style={{ fontWeight: 600 }}>{type || 'Hybrid'}</Tag>;
                },
              },
              {
                title: 'Monthly GMV',
                dataIndex: 'monthlyRevenue',
                key: 'monthlyRevenue',
                width: 130,
                render: (rev) => {
                  const formatted =
                    typeof rev === 'number'
                      ? `₹ ${rev.toLocaleString('en-IN')}`
                      : rev || '₹ 0';
                  return (
                    <span style={{ fontWeight: 700, color: '#16a34a', fontFamily: 'monospace', fontSize: 13 }}>
                      {formatted}
                    </span>
                  );
                },
              },
              {
                title: 'Plan Status',
                dataIndex: 'subscriptionStatus',
                key: 'subscriptionStatus',
                width: 120,
                render: (status) => (
                  <Tag color={status === 'Active' || !status ? 'green' : 'red'} style={{ fontWeight: 600 }}>
                    {status || 'Active'}
                  </Tag>
                ),
              },
              {
                title: 'Action',
                key: 'actions',
                width: 120,
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
          Showing {filteredGyms.length > 0 ? (currentPage - 1) * 10 + 1 : 0} to {Math.min(currentPage * 10, filteredGyms.length)} of {filteredGyms.length} gyms
        </div>
        <Pagination
          current={currentPage}
          total={filteredGyms.length}
          pageSize={10}
          onChange={setCurrentPage}
          showSizeChanger={false}
        />
      </div>



      {/* 7. Fast-Track Quick Add Gym Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ThunderboltOutlined style={{ color: '#16a34a', fontSize: 20 }} />
            <span style={{ fontWeight: 800 }}>Quick Onboard Gym Partner</span>
          </div>
        }
        open={isQuickAddModalOpen}
        onCancel={() => setIsQuickAddModalOpen(false)}
        footer={null}
        width={680}
        destroyOnClose
      >
        <div style={{ marginBottom: 16, fontSize: 13, color: isDarkMode ? '#888' : '#64748b' }}>
          Fast-track register a new gym partner into GYMEZY. You can expand full amenities and trainer rosters later in the 8-step wizard.
        </div>

        <Form form={quickAddForm} layout="vertical" onFinish={handleQuickAddSubmit}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Gym / Studio Name" name="name" rules={[{ required: true, message: 'Please enter gym name' }]}>
                <Input placeholder="e.g. Spartan Strength Club" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Owner Full Name" name="ownerName" rules={[{ required: true, message: 'Please enter owner name' }]}>
                <Input placeholder="e.g. Vikramaditya Verma" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Owner Mobile Number" name="phone" rules={[{ required: true, message: 'Please enter phone' }]}>
                <Input addonBefore="+91" placeholder="9876543210" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Official Email" name="email" rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
                <Input placeholder="contact@spartanfit.com" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Locality / Area" name="area" rules={[{ required: true, message: 'Area is required' }]}>
                <Input placeholder="e.g. Koramangala" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="City" name="city" initialValue="Chennai" rules={[{ required: true, message: 'City is required' }]}>
                <Select>
                  <Option value="Chennai">Chennai</Option>
                  <Option value="Bengaluru">Bengaluru</Option>
                  <Option value="Mumbai">Mumbai</Option>
                  <Option value="Pune">Pune</Option>
                  <Option value="Hyderabad">Hyderabad</Option>
                  <Option value="Delhi-NCR">Delhi-NCR</Option>
                  <Option value="Kolkata">Kolkata</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Single Session Drop-in Rate (₹)" name="singleSessionPrice" initialValue={199}>
                <InputNumber prefix="₹" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Subscription Tier" name="subscriptionType" initialValue="Hybrid">
                <Select>
                  <Option value="Hybrid">Hybrid (₹ 4,999/mo) — Full Suite</Option>
                  <Option value="App Only">App Only (₹ 2,999/mo)</Option>
                  <Option value="GMS">GMS Only (₹ 1,999/mo)</Option>
                  <Option value="Listing Only">Listing Only (₹ 999/mo)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 16, borderTop: `1px solid ${isDarkMode ? '#222' : '#f1f5f9'}` }}>
            <Button
              icon={<RocketOutlined />}
              onClick={() => {
                setIsQuickAddModalOpen(false);
                navigate('/admin/onboarding');
              }}
            >
              Open Full 8-Step Wizard
            </Button>

            <Space>
              <Button onClick={() => setIsQuickAddModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: '#4338ca', fontWeight: 700 }}>
                Quick Publish Gym
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default GymsManagement;
