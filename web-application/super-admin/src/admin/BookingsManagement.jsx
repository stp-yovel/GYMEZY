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
  Modal,
  Pagination,
  Typography,
  Space,
  message,
  Dropdown,
  DatePicker,
} from 'antd';
import {
  SearchOutlined,
  DownloadOutlined,
  EyeOutlined,
  MoreOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  MobileOutlined,
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  CreditCardOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useTheme } from '../theme/ThemeContext';

const { Option } = Select;
const { RangePicker } = DatePicker;

// Sample Initial Bookings Data matching user mockups exactly
const INITIAL_BOOKINGS = [
  {
    key: '1',
    id: 1,
    bookingId: 'BK100121',
    customer: {
      name: 'Arun Kumar',
      phone: '+91 98765 43210',
      customerId: 'CUST100245',
      initials: 'AK',
      avatarColor: '#f3e8ff',
      avatarTextColor: '#7e22ce',
      avatarImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arun&backgroundColor=b6e3f4,c0aede,d1d4f9',
    },
    gymName: 'FitZone Gym',
    gymLocation: 'Anna Nagar, Chennai',
    type: 'App Booking',
    bookingDate: '18 May 2026',
    bookingTime: '07:30 AM',
    bookingDateTime: '18 May 2026 07:30 AM',
    visitDate: '18 May 2026 08:00 AM',
    daysBooked: '18 May 2026 - 25 May 2026 (8 Days)',
    status: 'Completed',
    amount: '350.00',
    paymentMode: 'UPI',
    transactionId: 'UPI418526780912',
    paymentDate: '18 May 2026, 07:28 AM (Paid via UPI)',
    refundStatus: 'Not Applicable',
    refundReason: '(Booking is Completed)',
  },
  {
    key: '2',
    id: 2,
    bookingId: 'BK100122',
    customer: {
      name: 'Priya Sharma',
      phone: '+91 91234 56789',
      customerId: 'CUST100246',
      initials: 'PS',
      avatarColor: '#fce7f3',
      avatarTextColor: '#db2777',
      avatarImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=ffd5dc,ffdfbf',
    },
    gymName: 'Powerhouse Gym',
    gymLocation: 'T. Nagar, Chennai',
    type: 'App Booking',
    bookingDate: '18 May 2026',
    bookingTime: '06:15 PM',
    bookingDateTime: '18 May 2026 06:15 PM',
    visitDate: '18 May 2026 07:00 PM',
    daysBooked: '18 May 2026 - 18 May 2026 (1 Day)',
    status: 'Completed',
    amount: '250.00',
    paymentMode: 'Card',
    transactionId: 'TXN8892147102',
    paymentDate: '18 May 2026, 06:10 PM (Paid via Card)',
    refundStatus: 'Not Applicable',
    refundReason: '(Booking is Completed)',
  },
  {
    key: '3',
    id: 3,
    bookingId: 'BK100123',
    customer: {
      name: 'Rahul Krishnan',
      phone: '+91 99887 66554',
      customerId: 'CUST100247',
      initials: 'RK',
      avatarColor: '#dcfce7',
      avatarTextColor: '#16a34a',
      avatarImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    },
    gymName: 'Muscle Factory',
    gymLocation: 'Adyar, Chennai',
    type: 'App Booking',
    bookingDate: '17 May 2026',
    bookingTime: '09:10 AM',
    bookingDateTime: '17 May 2026 09:10 AM',
    visitDate: '17 May 2026 09:30 AM',
    daysBooked: '17 May 2026 - 17 May 2026 (1 Day)',
    status: 'Cancelled',
    amount: '250.00',
    paymentMode: 'UPI',
    transactionId: 'UPI901238472910',
    paymentDate: '17 May 2026, 09:05 AM (Paid via UPI)',
    refundStatus: 'Refunded (₹ 250.00)',
    refundReason: '(Cancelled before slot start)',
  },
  {
    key: '4',
    id: 4,
    bookingId: 'BK100124',
    customer: {
      name: 'Sneha Nair',
      phone: '+91 90123 45678',
      customerId: 'CUST100248',
      initials: 'SN',
      avatarColor: '#ffedd5',
      avatarTextColor: '#ea580c',
      avatarImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
    },
    gymName: 'Iron Club',
    gymLocation: 'Velachery, Chennai',
    type: 'Walk-in',
    bookingDate: '16 May 2026',
    bookingTime: '07:00 PM',
    bookingDateTime: '16 May 2026 07:00 PM',
    visitDate: '16 May 2026 07:00 PM',
    daysBooked: '16 May 2026 - 16 May 2026 (1 Day)',
    status: 'No Show',
    amount: '300.00',
    paymentMode: 'Cash',
    transactionId: 'CASH-REC-1092',
    paymentDate: '16 May 2026, 07:00 PM (Cash Desk)',
    refundStatus: 'Not Applicable',
    refundReason: '(Customer did not attend)',
  },
  {
    key: '5',
    id: 5,
    bookingId: 'BK100125',
    customer: {
      name: 'Vijay Joseph',
      phone: '+91 93456 78901',
      customerId: 'CUST100249',
      initials: 'VJ',
      avatarColor: '#e0e7ff',
      avatarTextColor: '#4f46e5',
      avatarImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vijay',
    },
    gymName: 'Fitness First',
    gymLocation: 'Porur, Chennai',
    type: 'Walk-in',
    bookingDate: '16 May 2026',
    bookingTime: '06:30 AM',
    bookingDateTime: '16 May 2026 06:30 AM',
    visitDate: '16 May 2026 06:30 AM',
    daysBooked: '16 May 2026 - 16 May 2026 (1 Day)',
    status: 'Completed',
    amount: '300.00',
    paymentMode: 'UPI',
    transactionId: 'UPI109283746152',
    paymentDate: '16 May 2026, 06:28 AM (Paid via UPI)',
    refundStatus: 'Not Applicable',
    refundReason: '(Booking is Completed)',
  },
  {
    key: '6',
    id: 6,
    bookingId: 'BK100126',
    customer: {
      name: 'Ananya Singh',
      phone: '+91 98712 34567',
      customerId: 'CUST100250',
      initials: 'AS',
      avatarColor: '#ccfbf1',
      avatarTextColor: '#0d9488',
      avatarImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
    },
    gymName: 'Body Garage',
    gymLocation: 'OMR, Chennai',
    type: 'App Booking',
    bookingDate: '15 May 2026',
    bookingTime: '08:45 PM',
    bookingDateTime: '15 May 2026 08:45 PM',
    visitDate: '15 May 2026 09:00 PM',
    daysBooked: '15 May 2026 - 15 May 2026 (1 Day)',
    status: 'Completed',
    amount: '350.00',
    paymentMode: 'UPI',
    transactionId: 'UPI778899001122',
    paymentDate: '15 May 2026, 08:40 PM (Paid via UPI)',
    refundStatus: 'Not Applicable',
    refundReason: '(Booking is Completed)',
  },
  {
    key: '7',
    id: 7,
    bookingId: 'BK100127',
    customer: {
      name: 'Manoj Gupta',
      phone: '+91 98123 65432',
      customerId: 'CUST100251',
      initials: 'MG',
      avatarColor: '#fef3c7',
      avatarTextColor: '#d97706',
      avatarImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manoj',
    },
    gymName: 'Next Level Fitness',
    gymLocation: 'Tambaram, Chennai',
    type: 'Walk-in',
    bookingDate: '15 May 2026',
    bookingTime: '06:20 PM',
    bookingDateTime: '15 May 2026 06:20 PM',
    visitDate: '15 May 2026 06:20 PM',
    daysBooked: '15 May 2026 - 15 May 2026 (1 Day)',
    status: 'Cancelled',
    amount: '250.00',
    paymentMode: 'Cash',
    transactionId: 'CASH-REC-1088',
    paymentDate: '15 May 2026, 06:20 PM (Cash Desk)',
    refundStatus: 'Refunded (Cash Return)',
    refundReason: '(Booking Cancelled at Reception)',
  },
  {
    key: '8',
    id: 8,
    bookingId: 'BK100128',
    customer: {
      name: 'Harish Babu',
      phone: '+91 90987 61234',
      customerId: 'CUST100253',
      initials: 'HB',
      avatarColor: '#fce7f3',
      avatarTextColor: '#be185d',
      avatarImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Harish',
    },
    gymName: 'Fitness Pro',
    gymLocation: 'Nungambakkam, Chennai',
    type: 'App Booking',
    bookingDate: '14 May 2026',
    bookingTime: '10:05 AM',
    bookingDateTime: '14 May 2026 10:05 AM',
    visitDate: '14 May 2026 10:30 AM',
    daysBooked: '14 May 2026 - 14 May 2026 (1 Day)',
    status: 'Completed',
    amount: '350.00',
    paymentMode: 'Net Banking',
    transactionId: 'NETB-881290312',
    paymentDate: '14 May 2026, 10:00 AM (Paid via Net Banking)',
    refundStatus: 'Not Applicable',
    refundReason: '(Booking is Completed)',
  },
];

export const BookingsManagement = () => {
  const { isDarkMode } = useTheme();

  // Filters State
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'app' | 'walkin'
  const [searchQuery, setSearchQuery] = useState('');
  const [gymFilter, setGymFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Filtered Bookings List
  const filteredBookings = useMemo(() => {
    return INITIAL_BOOKINGS.filter((item) => {
      // Sub-tab filter
      if (activeTab === 'app' && item.type !== 'App Booking') return false;
      if (activeTab === 'walkin' && item.type !== 'Walk-in') return false;

      // Dropdown type filter
      if (typeFilter !== 'all' && item.type.toLowerCase() !== typeFilter.toLowerCase()) return false;

      // Gym Filter
      if (gymFilter !== 'all' && item.gymName !== gymFilter) return false;

      // Status Filter
      if (statusFilter !== 'all' && item.status.toLowerCase() !== statusFilter.toLowerCase()) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCust = item.customer.name.toLowerCase().includes(q) || item.customer.phone.includes(q);
        const matchBooking = item.bookingId.toLowerCase().includes(q);
        const matchGym = item.gymName.toLowerCase().includes(q) || item.gymLocation.toLowerCase().includes(q);
        if (!matchCust && !matchBooking && !matchGym) return false;
      }

      return true;
    });
  }, [activeTab, searchQuery, gymFilter, typeFilter, statusFilter]);

  // Open Details Modal
  const handleOpenDetails = (record) => {
    setSelectedBooking(record);
    setIsDetailsModalOpen(true);
  };

  // Action Menu Dropdown for table rows
  const getActionMenu = (record) => ({
    items: [
      {
        key: 'view',
        icon: <EyeOutlined />,
        label: 'View Booking Details',
        onClick: () => handleOpenDetails(record),
      },
      {
        key: 'receipt',
        icon: <DownloadOutlined />,
        label: 'Download Invoice',
        onClick: () => message.success(`Downloading invoice for ${record.bookingId}...`),
      },
    ],
  });

  // Table Columns
  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'bookingId',
      key: 'bookingId',
      width: 130,
      render: (text) => (
        <span style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      width: 180,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: record.customer.avatarColor,
              color: record.customer.avatarTextColor,
              fontWeight: 800,
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {record.customer.initials}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', fontSize: 13 }}>
              {record.customer.name}
            </div>
            <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>
              {record.customer.phone}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Gym Name',
      key: 'gymName',
      width: 190,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', fontSize: 13 }}>
            {record.gymName}
          </div>
          <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
            <EnvironmentOutlined style={{ fontSize: 11, color: '#6366f1' }} />
            <span>{record.gymLocation}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type) => {
        const isApp = type === 'App Booking';
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              backgroundColor: isApp
                ? isDarkMode ? 'rgba(59, 130, 246, 0.15)' : '#edf4fe'
                : isDarkMode ? 'rgba(249, 115, 22, 0.15)' : '#fef4e8',
              color: isApp ? '#3b82f6' : '#ea580c',
            }}
          >
            <span>{type}</span>
            {isApp ? <PhoneOutlined style={{ fontSize: 11 }} /> : <UserOutlined style={{ fontSize: 11 }} />}
          </span>
        );
      },
    },
    {
      title: 'Booking Date & Time',
      dataIndex: 'bookingDateTime',
      key: 'bookingDateTime',
      width: 180,
      render: (text) => (
        <span style={{ fontSize: 13, color: isDarkMode ? '#cbd5e1' : '#334155' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Visit Date',
      dataIndex: 'visitDate',
      key: 'visitDate',
      width: 140,
      render: (text) => (
        <span style={{ fontSize: 13, color: isDarkMode ? '#cbd5e1' : '#334155' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status) => {
        let bg = isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#eaf8ef';
        let color = '#00bf62';
        if (status === 'Cancelled') {
          bg = isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fdeeed';
          color = '#e11d48';
        } else if (status === 'No Show') {
          bg = isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#fef4e8';
          color = '#d97706';
        }
        return (
          <span
            style={{
              display: 'inline-block',
              padding: '3px 12px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              backgroundColor: bg,
              color: color,
            }}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (val) => (
        <span style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
          ₹ {val}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 110,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleOpenDetails(record)}
            style={{
              borderRadius: 'var(--radius-base)',
              fontWeight: 600,
              fontSize: 12,
              color: '#4f46e5',
              borderColor: isDarkMode ? '#3730a3' : '#c7d2fe',
              backgroundColor: isDarkMode ? 'rgba(79, 70, 229, 0.1)' : '#f5f3ff',
            }}
          >
            View
          </Button>

          <Dropdown menu={getActionMenu(record)} trigger={['click']} placement="bottomRight">
            <Button
              type="text"
              size="small"
              icon={<MoreOutlined style={{ fontSize: 16, color: isDarkMode ? '#888888' : '#64748b' }} />}
            />
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      {/* 1. TOP 6 METRIC CARDS */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* Total Bookings */}
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
            }}
            styles={{ body: { padding: '16px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.15)' : '#f3effe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CalendarOutlined style={{ fontSize: 20, color: '#6366f1' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  Total Bookings
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                  32,845
                </div>
                <div style={{ fontSize: 11, color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                  All time
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* App Bookings */}
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
            }}
            styles={{ body: { padding: '16px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : '#edf4fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <MobileOutlined style={{ fontSize: 20, color: '#3b82f6' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  App Bookings
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                  18,642
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6' }}>
                  56.70%
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Walk-in Bookings */}
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
            }}
            styles={{ body: { padding: '16px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: isDarkMode ? 'rgba(249, 115, 22, 0.15)' : '#fef4e8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <UserOutlined style={{ fontSize: 20, color: '#ea580c' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  Walk-in Bookings
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                  14,203
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#ea580c' }}>
                  43.30%
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Completed */}
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
            }}
            styles={{ body: { padding: '16px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#eaf8ef',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CheckCircleOutlined style={{ fontSize: 20, color: '#00bf62' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  Completed
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                  25,927
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#00bf62' }}>
                  78.88%
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Cancelled */}
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
            }}
            styles={{ body: { padding: '16px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fdeeed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CloseCircleOutlined style={{ fontSize: 20, color: '#ef4444' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  Cancelled
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                  2,658
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444' }}>
                  8.09%
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* No Show */}
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
            }}
            styles={{ body: { padding: '16px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#fef4e8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <MinusCircleOutlined style={{ fontSize: 20, color: '#f59e0b' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  No Show
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                  2,260
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>
                  6.88%
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 2. ACTIONS & FILTERS BAR */}
      <Card
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-color)',
          borderRadius: 'var(--radius-base)',
          marginBottom: 20,
        }}
        styles={{ body: { padding: '16px 20px' } }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          {/* Filters on Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flex: 1 }}>
            <Input
              placeholder="Search by customer, booking ID, gym..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 260, borderRadius: 'var(--radius-base)' }}
              allowClear
            />

            <Select value={gymFilter} onChange={setGymFilter} style={{ width: 140 }}>
              <Option value="all">All Gyms</Option>
              <Option value="FitZone Gym">FitZone Gym</Option>
              <Option value="Powerhouse Gym">Powerhouse Gym</Option>
              <Option value="Muscle Factory">Muscle Factory</Option>
              <Option value="Iron Club">Iron Club</Option>
              <Option value="Fitness First">Fitness First</Option>
              <Option value="Body Garage">Body Garage</Option>
              <Option value="Next Level Fitness">Next Level Fitness</Option>
              <Option value="Fitness Pro">Fitness Pro</Option>
            </Select>

            <Select value={typeFilter} onChange={setTypeFilter} style={{ width: 130 }}>
              <Option value="all">All Types</Option>
              <Option value="App Booking">App Booking</Option>
              <Option value="Walk-in">Walk-in</Option>
            </Select>

            <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 130 }}>
              <Option value="all">All Status</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
              <Option value="no show">No Show</Option>
            </Select>

            <RangePicker
              format="DD MMM YYYY"
              placeholder={['21 May 2026', '20 Jun 2026']}
              style={{ borderRadius: 'var(--radius-base)', width: 240 }}
            />
          </div>

          {/* Export on Right */}
          <Button
            icon={<DownloadOutlined />}
            onClick={() => message.success('Exporting bookings ledger as CSV...')}
            style={{
              borderRadius: 'var(--radius-base)',
              fontWeight: 600,
              borderColor: isDarkMode ? '#334155' : '#e2e8f0',
            }}
          >
            Export
          </Button>
        </div>
      </Card>

      {/* 3. SUB-TABS (All Bookings / App Bookings / Walk-in Bookings) */}
      <div style={{ display: 'flex', gap: 24, borderBottom: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`, marginBottom: 16, paddingLeft: 4 }}>
        {[
          { key: 'all', label: 'All Bookings' },
          { key: 'app', label: 'App Bookings' },
          { key: 'walkin', label: 'Walk-in Bookings' },
        ].map((tab) => (
          <div
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              paddingBottom: 10,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 700,
              color: activeTab === tab.key ? '#4f46e5' : isDarkMode ? '#888888' : '#64748b',
              borderBottom: activeTab === tab.key ? '2px solid #4f46e5' : '2px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* 4. BOOKINGS TABLE */}
      <Card
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-color)',
          borderRadius: 'var(--radius-base)',
          marginBottom: 20,
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Table
          columns={columns}
          dataSource={filteredBookings}
          pagination={false}
          rowKey="key"
          scroll={{ x: 1250 }}
        />
      </Card>

      {/* 5. PAGINATION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b' }}>
          Showing 1 to {filteredBookings.length} of 32,845 bookings
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Pagination current={currentPage} total={32845} pageSize={pageSize} onChange={setCurrentPage} />
          <Select value={pageSize} onChange={setPageSize} style={{ width: 110 }}>
            <Option value={10}>10 / page</Option>
            <Option value={25}>25 / page</Option>
            <Option value={50}>50 / page</Option>
          </Select>
        </div>
      </div>

      {/* -------------------------------------------------------------
          BOOKING DETAILS POPUP MODAL (1:1 with Screenshot 2)
         ------------------------------------------------------------- */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 17, fontWeight: 800 }}>
            <CalendarOutlined style={{ color: '#4f46e5' }} />
            <span>Booking Details</span>
          </div>
        }
        open={isDetailsModalOpen}
        onCancel={() => setIsDetailsModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsDetailsModalOpen(false)} style={{ backgroundColor: '#4f46e5', minWidth: 90 }}>
            Close
          </Button>,
        ]}
        width={680}
        centered
      >
        {selectedBooking && (
          <div style={{ paddingTop: 12 }}>
            {/* Top Grid: Customer Info & Booking/Gym Info */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 20,
                padding: '16px 20px',
                backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
                borderRadius: 12,
                marginBottom: 16,
              }}
            >
              {/* Customer Box */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: '50%',
                    backgroundColor: '#e0e7ff',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={selectedBooking.customer.avatarImg}
                    alt={selectedBooking.customer.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#888888' : '#64748b' }}>
                    Customer Name
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', margin: '2px 0 4px 0' }}>
                    {selectedBooking.customer.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>Customer ID</span>
                    <span
                      style={{
                        padding: '1px 6px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : '#ede9fe',
                        color: '#4f46e5',
                      }}
                    >
                      {selectedBooking.customer.customerId}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: isDarkMode ? '#cbd5e1' : '#334155', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <PhoneOutlined style={{ color: '#6366f1', fontSize: 11 }} />
                    <span>{selectedBooking.customer.phone}</span>
                  </div>
                </div>
              </div>

              {/* Gym Box */}
              <div style={{ borderLeft: isDarkMode ? '1px solid #262626' : '1px solid #e2e8f0', paddingLeft: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#888888' : '#64748b' }}>
                  Booking ID
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#4f46e5', margin: '2px 0 8px 0' }}>
                  {selectedBooking.bookingId}
                </div>

                <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#888888' : '#64748b' }}>
                  Gym Name
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', marginTop: 2 }}>
                  {selectedBooking.gymName}
                </div>
                <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <EnvironmentOutlined style={{ color: '#6366f1', fontSize: 11 }} />
                  <span>{selectedBooking.gymLocation}</span>
                </div>
              </div>
            </div>

            {/* Middle Section: Booking Schedule */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
                padding: '14px 20px',
                border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`,
                borderRadius: 10,
                marginBottom: 16,
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CalendarOutlined style={{ color: '#6366f1' }} />
                  <span>Booking Date</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', marginTop: 4 }}>
                  {selectedBooking.bookingDate}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ClockCircleOutlined style={{ color: '#6366f1' }} />
                  <span>Booking Time</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', marginTop: 4 }}>
                  {selectedBooking.bookingTime}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CalendarOutlined style={{ color: '#6366f1' }} />
                  <span>Days Booked (From - To)</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', marginTop: 4 }}>
                  {selectedBooking.daysBooked}
                </div>
              </div>
            </div>

            {/* Bottom Grid: Payment, Amount, Refund & Status Details */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 16,
                padding: '16px 20px',
                backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
                borderRadius: 12,
              }}
            >
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>Total Amount</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    ₹ {selectedBooking.amount}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>Payment Mode</span>
                  <span
                    style={{
                      padding: '2px 10px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 700,
                      backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#eaf8ef',
                      color: '#00bf62',
                    }}
                  >
                    {selectedBooking.paymentMode}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>Transaction ID</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: isDarkMode ? '#e2e8f0' : '#1e293b' }}>
                    {selectedBooking.transactionId}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>Status</span>
                  <span
                    style={{
                      padding: '2px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      backgroundColor: selectedBooking.status === 'Completed'
                        ? isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#eaf8ef'
                        : isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fdeeed',
                      color: selectedBooking.status === 'Completed' ? '#00bf62' : '#e11d48',
                    }}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderLeft: isDarkMode ? '1px solid #262626' : '1px solid #e2e8f0', paddingLeft: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#888888' : '#64748b' }}>Payment Date</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#ffffff' : '#0f172a', marginTop: 2 }}>
                    {selectedBooking.paymentDate}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#888888' : '#64748b' }}>Refund Status</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#eaf8ef',
                        color: '#00bf62',
                      }}
                    >
                      {selectedBooking.refundStatus}
                    </span>
                    <span style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>
                      {selectedBooking.refundReason}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingsManagement;
