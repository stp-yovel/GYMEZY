import React, { useState, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Tag,
  Button,
  Typography,
  Avatar,
  Tabs,
  Table,
  Badge,
  Descriptions,
  Space,
  Input,
  Select,
  Divider,
  message,
  Image,
  Rate,
  Statistic,
  Dropdown,
  Modal,
  Form,
  InputNumber,
} from 'antd';
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  ShopOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  PictureOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  ExportOutlined,
  FileTextOutlined,
  BankOutlined,
  StarFilled,
  PlusOutlined,
  SaveOutlined,
  UserOutlined,
  SearchOutlined,
  RiseOutlined,
  ToolOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useTheme } from '../../theme/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Helper function to extract gym logo
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

// Helper function to extract initials
const getGymInitials = (name) => {
  if (!name || typeof name !== 'string') return 'GY';
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'GY';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

// Default fallback bookings matching gym
const SAMPLE_BOOKINGS = [
  {
    key: '1',
    bookingId: 'BK100121',
    customerName: 'Arun Kumar',
    customerPhone: '+91 98765 43210',
    type: 'Single Session Pass',
    slotTime: '06:00 AM - 07:30 AM',
    bookingDate: '18 May 2026',
    amount: 199,
    status: 'Completed',
    paymentMode: 'UPI',
  },
  {
    key: '2',
    bookingId: 'BK100122',
    customerName: 'Priya Sharma',
    customerPhone: '+91 91234 56789',
    type: 'Monthly Membership',
    slotTime: '06:00 PM - 07:30 PM',
    bookingDate: '18 May 2026',
    amount: 1499,
    status: 'Active',
    paymentMode: 'Card',
  },
  {
    key: '3',
    bookingId: 'BK100123',
    customerName: 'Rahul Krishnan',
    customerPhone: '+91 99887 66554',
    type: 'Single Session Pass',
    slotTime: '07:30 AM - 09:00 AM',
    bookingDate: '17 May 2026',
    amount: 199,
    status: 'Completed',
    paymentMode: 'UPI',
  },
  {
    key: '4',
    bookingId: 'BK100124',
    customerName: 'Sneha Patel',
    customerPhone: '+91 97654 32109',
    type: 'Quarterly Pass (3M)',
    slotTime: 'All Day Access',
    bookingDate: '16 May 2026',
    amount: 3999,
    status: 'Active',
    paymentMode: 'Net Banking',
  },
  {
    key: '5',
    bookingId: 'BK100125',
    customerName: 'Vignesh M',
    customerPhone: '+91 98401 23456',
    type: 'Single Session Pass',
    slotTime: '05:00 PM - 06:30 PM',
    bookingDate: '15 May 2026',
    amount: 199,
    status: 'Cancelled',
    paymentMode: 'UPI (Refunded)',
  },
];

export const GymDetailsView = ({
  gym,
  allGyms = [],
  onBack,
  onSelectGym,
  onApprove,
  onReject,
  onStatusChange,
}) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [adminNote, setAdminNote] = useState(gym?.adminNote || '');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('All');

  // Filtered gym-specific bookings
  const gymBookings = useMemo(() => {
    return SAMPLE_BOOKINGS.filter((b) => {
      const matchSearch =
        b.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.bookingId.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.customerPhone.includes(bookingSearch);
      const matchStatus = bookingStatusFilter === 'All' || b.status === bookingStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [bookingSearch, bookingStatusFilter]);

  if (!gym) return null;

  const logoSrc = getGymLogoSrc(gym);
  const locationStr = gym.fullAddress || gym.address || gym.location || `${gym.area || ''}, ${gym.city || ''}`.trim() || 'Address not specified';

  return (
    <div style={{ maxWidth: 1360, margin: '0 auto', paddingBottom: 40 }}>
      {/* 1. TOP BREADCRUMB & GYM SWITCHER BAR */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          style={{
            padding: 0,
            fontWeight: 700,
            fontSize: 15,
            color: 'var(--color-primary)',
          }}
        >
          Back to Gyms Fleet
        </Button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
            Switch Gym:
          </span>
          <Select
            value={gym.id || gym._id}
            onChange={(selectedId) => {
              const target = allGyms.find((g) => (g.id || g._id) === selectedId);
              if (target && onSelectGym) onSelectGym(target);
            }}
            style={{ width: 240 }}
            showSearch
            optionFilterProp="children"
          >
            {allGyms.map((g) => (
              <Option key={g.id || g._id} value={g.id || g._id}>
                {g.name} ({g.partnerId || g.gymId || 'GYM'})
              </Option>
            ))}
          </Select>

          {gym.approvalStatus === 'Pending Approval' ? (
            <Space>
              <Button
                danger
                onClick={() => onReject && onReject(gym)}
                style={{ fontWeight: 600, borderRadius: 'var(--radius-base)' }}
              >
                Reject Changes
              </Button>
              <Button
                type="primary"
                onClick={() => onApprove && onApprove(gym)}
                style={{
                  fontWeight: 700,
                  backgroundColor: '#16a34a',
                  borderColor: '#16a34a',
                  borderRadius: 'var(--radius-base)',
                }}
              >
                Approve & Publish
              </Button>
            </Space>
          ) : (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'active',
                    label: 'Set Status: Active',
                    onClick: () => onStatusChange && onStatusChange(gym.id || gym._id, 'Active'),
                  },
                  {
                    key: 'inactive',
                    label: 'Set Status: Inactive',
                    onClick: () => onStatusChange && onStatusChange(gym.id || gym._id, 'Inactive'),
                  },
                  {
                    key: 'suspended',
                    label: 'Set Status: Suspended',
                    danger: true,
                    onClick: () => onStatusChange && onStatusChange(gym.id || gym._id, 'Suspended'),
                  },
                ],
              }}
            >
              <Button style={{ fontWeight: 600, borderRadius: 'var(--radius-base)' }}>
                Change Status: <strong style={{ marginLeft: 4 }}>{gym.status || 'Active'}</strong>
              </Button>
            </Dropdown>
          )}

          <Button
            icon={<ExportOutlined />}
            onClick={() => message.info(`Opening preview for ${gym.name}`)}
            style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}
          >
            Customer View
          </Button>
        </div>
      </div>

      {/* 2. MAIN GYM HERO HEADER CARD */}
      <Card
        style={{
          borderRadius: 16,
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-color)',
          marginBottom: 24,
          overflow: 'hidden',
        }}
        styles={{ body: { padding: 24 } }}
      >
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Gym Logo / Avatar */}
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={gym.name}
              style={{
                width: 100,
                height: 100,
                borderRadius: 16,
                objectFit: 'cover',
                border: `2px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
              }}
            />
          ) : (
            <Avatar
              shape="square"
              size={100}
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: 32,
                borderRadius: 16,
              }}
            >
              {getGymInitials(gym.name)}
            </Avatar>
          )}

          {/* Core Info Details */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
              <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                {gym.name}
              </h1>
              <Tag color="blue" style={{ fontWeight: 800, fontSize: 13, padding: '2px 10px', borderRadius: 6 }}>
                {gym.partnerId || gym.gymId || gym.code || 'GYM-ID'}
              </Tag>
              <Tag
                color={
                  gym.approvalStatus === 'Approved' || gym.status === 'Active'
                    ? 'success'
                    : gym.approvalStatus === 'Pending Approval'
                    ? 'warning'
                    : 'error'
                }
                style={{ fontWeight: 700, fontSize: 12, padding: '2px 8px', borderRadius: 6 }}
              >
                {gym.approvalStatus || gym.status || 'Active'}
              </Tag>
              <Tag color="purple" style={{ fontWeight: 700, fontSize: 12, padding: '2px 8px', borderRadius: 6 }}>
                {gym.subscriptionType || 'Listing Only Tier'}
              </Tag>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Rate disabled defaultValue={4.9} style={{ fontSize: 15 }} />
              <strong style={{ fontSize: 13, color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>4.9</strong>
              <span style={{ fontSize: 12, color: '#64748b' }}>(128 customer reviews)</span>
            </div>

            <div style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 13, marginBottom: 6 }}>
              <EnvironmentOutlined style={{ marginRight: 6, color: 'var(--color-primary)' }} />
              {locationStr}
            </div>

            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13, color: isDarkMode ? '#cbd5e1' : '#475569' }}>
              <span>
                <PhoneOutlined style={{ marginRight: 6, color: '#16a34a' }} />
                {gym.phone || '—'}
              </span>
              <span>
                <MailOutlined style={{ marginRight: 6, color: '#2563eb' }} />
                {gym.email || '—'}
              </span>
              <span>
                <UserOutlined style={{ marginRight: 6, color: '#9333ea' }} />
                Partner: <strong>{gym.ownerName || gym.fullName || 'Gym Partner'}</strong>
              </span>
            </div>
          </div>
        </div>

        <Divider style={{ margin: '20px 0 16px 0' }} />

        {/* High Impact Key Metrics Row */}
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} md={4}>
            <div style={{ padding: '12px 16px', borderRadius: 10, backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc', border: `1px solid ${isDarkMode ? '#1e293b' : '#e2e8f0'}` }}>
              <Text type="secondary" style={{ fontSize: 11, fontWeight: 700 }}>ACTIVE MEMBERS</Text>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#2563eb', marginTop: 4 }}>
                {gym.membersCount || 42}
              </div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <div style={{ padding: '12px 16px', borderRadius: 10, backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc', border: `1px solid ${isDarkMode ? '#1e293b' : '#e2e8f0'}` }}>
              <Text type="secondary" style={{ fontSize: 11, fontWeight: 700 }}>MONTHLY GMV</Text>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#16a34a', marginTop: 4 }}>
                ₹{(gym.monthlyRevenue || 45200).toLocaleString('en-IN')}
              </div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <div style={{ padding: '12px 16px', borderRadius: 10, backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc', border: `1px solid ${isDarkMode ? '#1e293b' : '#e2e8f0'}` }}>
              <Text type="secondary" style={{ fontSize: 11, fontWeight: 700 }}>TOTAL BOOKINGS</Text>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#9333ea', marginTop: 4 }}>
                {gym.totalBookings || 186}
              </div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <div style={{ padding: '12px 16px', borderRadius: 10, backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc', border: `1px solid ${isDarkMode ? '#1e293b' : '#e2e8f0'}` }}>
              <Text type="secondary" style={{ fontSize: 11, fontWeight: 700 }}>SINGLE SESSION</Text>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#f59e0b', marginTop: 4 }}>
                ₹{gym.singleSessionPrice || 199}
              </div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <div style={{ padding: '12px 16px', borderRadius: 10, backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc', border: `1px solid ${isDarkMode ? '#1e293b' : '#e2e8f0'}` }}>
              <Text type="secondary" style={{ fontSize: 11, fontWeight: 700 }}>COMMISSION RATE</Text>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#06b6d4', marginTop: 4 }}>
                {gym.platformCommission || 10}%
              </div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <div style={{ padding: '12px 16px', borderRadius: 10, backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc', border: `1px solid ${isDarkMode ? '#1e293b' : '#e2e8f0'}` }}>
              <Text type="secondary" style={{ fontSize: 11, fontWeight: 700 }}>SETTLEMENT</Text>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#10b981', marginTop: 4 }}>
                Daily (T+1)
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 3. INTERACTIVE SECTION TABS */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        size="large"
        style={{
          backgroundColor: 'transparent',
        }}
        items={[
          {
            key: 'overview',
            label: (
              <span>
                <ShopOutlined /> General Overview
              </span>
            ),
            children: (
              <Row gutter={[20, 20]}>
                {/* Left Column: Facility & Business Overview */}
                <Col xs={24} lg={14}>
                  <Card
                    title="Facility & Business Profile"
                    style={{
                      borderRadius: 14,
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-color)',
                      marginBottom: 20,
                    }}
                  >
                    <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
                      <Descriptions.Item label="Gym Name">{gym.name}</Descriptions.Item>
                      <Descriptions.Item label="Partner Code">{gym.partnerId || gym.gymId || 'GYM-001'}</Descriptions.Item>
                      <Descriptions.Item label="Gym Type">{gym.gymType || 'Unisex Fitness Center'}</Descriptions.Item>
                      <Descriptions.Item label="Allowed Gender">{gym.genderAllowed || 'Unisex (All)'}</Descriptions.Item>
                      <Descriptions.Item label="Owner Name">{gym.ownerName || gym.fullName || '—'}</Descriptions.Item>
                      <Descriptions.Item label="Contact Phone">{gym.phone || '—'}</Descriptions.Item>
                      <Descriptions.Item label="Official Email">{gym.email || '—'}</Descriptions.Item>
                      <Descriptions.Item label="Registered On">{gym.registeredOn || gym.createdAt ? new Date(gym.createdAt).toLocaleDateString() : 'Active Partner'}</Descriptions.Item>
                      <Descriptions.Item label="Full Street Address" span={2}>
                        {locationStr}
                      </Descriptions.Item>
                      <Descriptions.Item label="About Facility" span={2}>
                        {gym.about || gym.description || 'Premium fitness facility offering specialized workout sections, modern strength gear, cardio equipment, and certified personal coaching.'}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>

                  <Card
                    title="Supported Workouts & Amenities"
                    style={{
                      borderRadius: 14,
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div style={{ marginBottom: 16 }}>
                      <Text strong style={{ display: 'block', marginBottom: 8 }}>
                        Workout Disciplines:
                      </Text>
                      <Space wrap size={[8, 8]}>
                        {(gym.workouts && gym.workouts.length > 0
                          ? gym.workouts
                          : ['Gym & Weights', 'Cardio', 'HIIT', 'Crossfit', 'Yoga', 'Strength Training']
                        ).map((w, i) => (
                          <Tag key={i} color="blue" style={{ fontSize: 13, padding: '4px 10px', borderRadius: 6 }}>
                            {w}
                          </Tag>
                        ))}
                      </Space>
                    </div>

                    <div>
                      <Text strong style={{ display: 'block', marginBottom: 8 }}>
                        Available Amenities:
                      </Text>
                      <Space wrap size={[8, 8]}>
                        {(gym.amenities && gym.amenities.length > 0
                          ? gym.amenities
                          : ['Air Conditioned', 'Locker Facility', 'Shower Rooms', 'Free Wi-Fi', 'RO Drinking Water', 'CCTV 24/7', 'Parking Available']
                        ).map((a, i) => (
                          <Tag key={i} color="green" style={{ fontSize: 13, padding: '4px 10px', borderRadius: 6 }}>
                            <CheckCircleOutlined style={{ marginRight: 4 }} /> {a}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  </Card>
                </Col>

                {/* Right Column: Legal, Bank & Operating Schedule */}
                <Col xs={24} lg={10}>
                  <Card
                    title="Tax, Bank & Settlement"
                    style={{
                      borderRadius: 14,
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-color)',
                      marginBottom: 20,
                    }}
                  >
                    <Descriptions column={1} bordered size="small">
                      <Descriptions.Item label="GST Number">{gym.gstNumber || '33AAAAA0000A1Z5 (Registered)'}</Descriptions.Item>
                      <Descriptions.Item label="Bank Name">{gym.bankName || 'HDFC Bank Ltd'}</Descriptions.Item>
                      <Descriptions.Item label="Account Holder">{gym.accountHolderName || gym.name || 'Gym Enterprise'}</Descriptions.Item>
                      <Descriptions.Item label="Account Number">{gym.accountNumber ? `•••• •••• ${String(gym.accountNumber).slice(-4)}` : '•••• •••• 8842'}</Descriptions.Item>
                      <Descriptions.Item label="IFSC Code">{gym.ifscCode || 'HDFC0001234'}</Descriptions.Item>
                      <Descriptions.Item label="Payout Cycle">Daily Automated (T+1 Settlement)</Descriptions.Item>
                    </Descriptions>
                  </Card>

                  <Card
                    title="Operating Hours Summary"
                    style={{
                      borderRadius: 14,
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { day: 'Monday – Friday', hours: '05:30 AM – 10:30 PM', status: 'Open' },
                        { day: 'Saturday', hours: '06:00 AM – 10:00 PM', status: 'Open' },
                        { day: 'Sunday', hours: '06:00 AM – 09:00 PM', status: 'Open' },
                      ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                          <span style={{ fontWeight: 600 }}>{item.day}</span>
                          <span style={{ fontFamily: 'monospace', color: '#2563eb', fontWeight: 700 }}>{item.hours}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: 'bookings',
            label: (
              <span>
                <CalendarOutlined /> Gym Specific Bookings ({gymBookings.length})
              </span>
            ),
            children: (
              <Card
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <span>Customer Bookings for {gym.name}</span>
                    <Space wrap>
                      <Input
                        placeholder="Search Customer or Booking ID..."
                        prefix={<SearchOutlined />}
                        value={bookingSearch}
                        onChange={(e) => setBookingSearch(e.target.value)}
                        style={{ width: 250, borderRadius: 'var(--radius-base)' }}
                      />
                      <Select
                        value={bookingStatusFilter}
                        onChange={setBookingStatusFilter}
                        style={{ width: 140 }}
                      >
                        <Option value="All">All Status</Option>
                        <Option value="Active">Active</Option>
                        <Option value="Completed">Completed</Option>
                        <Option value="Cancelled">Cancelled</Option>
                      </Select>
                    </Space>
                  </div>
                }
                style={{
                  borderRadius: 14,
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <Table
                  dataSource={gymBookings}
                  pagination={{ pageSize: 8 }}
                  rowKey="bookingId"
                  columns={[
                    {
                      title: 'Booking ID',
                      dataIndex: 'bookingId',
                      key: 'bookingId',
                      render: (text) => <strong style={{ color: 'var(--color-primary)' }}>{text}</strong>,
                    },
                    {
                      title: 'Customer',
                      key: 'customer',
                      render: (_, record) => (
                        <div>
                          <div style={{ fontWeight: 700 }}>{record.customerName}</div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>{record.customerPhone}</div>
                        </div>
                      ),
                    },
                    {
                      title: 'Pass Type',
                      dataIndex: 'type',
                      key: 'type',
                      render: (text) => <Tag color="blue">{text}</Tag>,
                    },
                    {
                      title: 'Slot Time',
                      dataIndex: 'slotTime',
                      key: 'slotTime',
                      render: (text) => <span style={{ fontFamily: 'monospace' }}>{text}</span>,
                    },
                    {
                      title: 'Date',
                      dataIndex: 'bookingDate',
                      key: 'bookingDate',
                    },
                    {
                      title: 'Amount Paid',
                      dataIndex: 'amount',
                      key: 'amount',
                      render: (amount, record) => (
                        <div>
                          <strong style={{ color: '#16a34a' }}>₹{amount}</strong>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{record.paymentMode}</div>
                        </div>
                      ),
                    },
                    {
                      title: 'Status',
                      dataIndex: 'status',
                      key: 'status',
                      render: (status) => {
                        const color =
                          status === 'Completed' ? 'success' : status === 'Active' ? 'processing' : 'error';
                        return <Badge status={color} text={status} />;
                      },
                    },
                  ]}
                />
              </Card>
            ),
          },
          {
            key: 'pricing',
            label: (
              <span>
                <DollarOutlined /> Plans & Memberships
              </span>
            ),
            children: (
              <Row gutter={[20, 20]}>
                <Col xs={24} md={8}>
                  <Card
                    title="Single Day Session Pass"
                    style={{
                      borderRadius: 14,
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-color)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 36, fontWeight: 900, color: '#2563eb', margin: '16px 0' }}>
                      ₹{gym.singleSessionPrice || 199}
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#64748b' }}> / visit</span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: 13 }}>
                      Allows customer full 1-day access to gym facilities, lockers, and workout floor.
                    </p>
                    <Tag color="green">Instant Booking Active</Tag>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card
                    title="1-Month Unlimited Pass"
                    style={{
                      borderRadius: 14,
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-color)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 36, fontWeight: 900, color: '#16a34a', margin: '16px 0' }}>
                      ₹1,499
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#64748b' }}> / month</span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: 13 }}>
                      Unlimited monthly check-ins with access to cardio studio, strength floor, and trainer guidance.
                    </p>
                    <Tag color="blue">Best Value</Tag>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card
                    title="Quarterly Pass (3 Months)"
                    style={{
                      borderRadius: 14,
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-color)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 36, fontWeight: 900, color: '#9333ea', margin: '16px 0' }}>
                      ₹3,999
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#64748b' }}> / 3 months</span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: 13 }}>
                      Quarterly subscription including personal diet consultation and locker assignment.
                    </p>
                    <Tag color="purple">Popular Membership</Tag>
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: 'gallery',
            label: (
              <span>
                <PictureOutlined /> Media & Photos
              </span>
            ),
            children: (
              <Card
                title="Gym Photos & Media Assets"
                style={{
                  borderRadius: 14,
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <Row gutter={[20, 20]}>
                  <Col xs={24} md={8}>
                    <div style={{ marginBottom: 12 }}>
                      <Text strong style={{ display: 'block', marginBottom: 6 }}>
                        Primary Brand Logo:
                      </Text>
                      {logoSrc ? (
                        <Image
                          src={logoSrc}
                          alt="Gym Logo"
                          style={{ width: '100%', height: 200, objectFit: 'contain', borderRadius: 10, border: `1px solid ${isDarkMode ? '#333' : '#e2e8f0'}` }}
                        />
                      ) : (
                        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc', borderRadius: 10 }}>
                          No Logo Uploaded
                        </div>
                      )}
                    </div>
                  </Col>

                  <Col xs={24} md={16}>
                    <Text strong style={{ display: 'block', marginBottom: 6 }}>
                      Facility & Equipment Photos:
                    </Text>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
                      {[
                        'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=400&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop',
                      ].map((imgUrl, i) => (
                        <Image
                          key={i}
                          src={imgUrl}
                          alt={`Facility Photo ${i + 1}`}
                          style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 8 }}
                        />
                      ))}
                    </div>
                  </Col>
                </Row>
              </Card>
            ),
          },
          {
            key: 'audit',
            label: (
              <span>
                <FileTextOutlined /> Admin Notes & Audit
              </span>
            ),
            children: (
              <Card
                title="Super Admin Internal Audit & Notes"
                style={{
                  borderRadius: 14,
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    Internal Administrative Notes (Visible only to Super Admins):
                  </Text>
                  <TextArea
                    rows={4}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Enter compliance notes, verification remarks, or onboarding records..."
                    style={{ borderRadius: 'var(--radius-base)', marginBottom: 14 }}
                  />
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => message.success('Admin notes saved successfully!')}
                    style={{ backgroundColor: '#003882', borderColor: '#003882', fontWeight: 600 }}
                  >
                    Save Notes
                  </Button>
                </div>

                <Divider />

                <Descriptions column={2} bordered size="small">
                  <Descriptions.Item label="Partner Account Status">
                    <Badge status={gym.status === 'Active' ? 'success' : 'default'} text={gym.status || 'Active'} />
                  </Descriptions.Item>
                  <Descriptions.Item label="KYC Document Verification">Verified by Super Admin</Descriptions.Item>
                  <Descriptions.Item label="Platform Security Policy">Standard Enterprise SLA</Descriptions.Item>
                  <Descriptions.Item label="Last Audit Check">{new Date().toLocaleDateString()}</Descriptions.Item>
                </Descriptions>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};

export default GymDetailsView;
