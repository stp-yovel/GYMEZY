import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Row,
  Col,
  Input,
  Select,
  Typography,
  Avatar,
  Dropdown,
  Modal,
  Form,
  DatePicker,
  TimePicker,
  Space,
  Radio,
  Pagination,
  message,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  CalendarOutlined,
  MobileOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  MoreOutlined,
  EyeOutlined,
  CheckOutlined,
  DownloadOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  DownOutlined,
  PhoneOutlined,
  CreditCardOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useTheme } from '../../theme/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Initial mockup dataset matching reference
export const INITIAL_BOOKINGS = [
  {
    key: '1',
    bookingId: 'BKG250721001',
    customerId: 'CID1001',
    customerName: 'Arun Kumar',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
    type: 'App Booking',
    date: '21 Jul 2025',
    time: '07:00 AM',
    amount: '₹150',
    status: 'Checked-in',
    payment: 'Paid Online',
  },
  {
    key: '2',
    bookingId: 'BKG250721002',
    customerId: 'CID1002',
    customerName: 'Priya Sharma',
    phone: '+91 91234 56789',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    type: 'Walk-in',
    date: '21 Jul 2025',
    time: '08:30 AM',
    amount: '₹150',
    status: 'Upcoming',
    payment: 'Cash',
  },
  {
    key: '3',
    bookingId: 'BKG250721003',
    customerId: 'CID1003',
    customerName: 'Vikram Singh',
    phone: '+91 99876 54321',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    type: 'App Booking',
    date: '21 Jul 2025',
    time: '09:00 AM',
    amount: '₹150',
    status: 'Completed',
    payment: 'UPI',
  },
  {
    key: '4',
    bookingId: 'BKG250721004',
    customerId: 'CID1004',
    customerName: 'Neha Reddy',
    phone: '+91 90012 34567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    type: 'Walk-in',
    date: '21 Jul 2025',
    time: '10:15 AM',
    amount: '₹150',
    status: 'Completed',
    payment: 'UPI',
  },
  {
    key: '5',
    bookingId: 'BKG250721005',
    customerId: 'CID1005',
    customerName: 'Karthik R',
    phone: '+91 98811 22334',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    type: 'App Booking',
    date: '21 Jul 2025',
    time: '11:30 AM',
    amount: '₹150',
    status: 'Cancelled',
    payment: 'Paid Online',
  },
  {
    key: '6',
    bookingId: 'BKG250721006',
    customerId: 'CID1006',
    customerName: 'Sneha Iyer',
    phone: '+91 93412 66778',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
    type: 'Walk-in',
    date: '21 Jul 2025',
    time: '12:00 PM',
    amount: '₹150',
    status: 'No Show',
    payment: 'Refunded',
  },
  {
    key: '7',
    bookingId: 'BKG250721007',
    customerId: 'CID1007',
    customerName: 'Rahul Nair',
    phone: '+91 90909 11223',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop',
    type: 'App Booking',
    date: '21 Jul 2025',
    time: '06:00 PM',
    amount: '₹150',
    status: 'Upcoming',
    payment: '—',
  },
];

/**
 * Reusable Bookings Management Component
 */
export const BookingsManagement = ({
  initialData = INITIAL_BOOKINGS,
  onAddBooking,
  onStatusChange,
}) => {
  const { isDarkMode } = useTheme();
  const [form] = Form.useForm();

  const [bookings, setBookings] = useState(initialData);
  const [nameSearch, setNameSearch] = useState('');
  const [bookingIdSearch, setBookingIdSearch] = useState('');
  const [customerIdSearch, setCustomerIdSearch] = useState('');
  const [bookingType, setBookingType] = useState('ALL');
  const [bookingStatus, setBookingStatus] = useState('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState('21 Jul 2025 - 21 Jul 2025');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [tempDateRange, setTempDateRange] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // Filter Logic
  const filteredBookings = bookings.filter((item) => {
    const matchName = !nameSearch || item.customerName.toLowerCase().includes(nameSearch.toLowerCase());
    const matchBookingId = !bookingIdSearch || item.bookingId.toLowerCase().includes(bookingIdSearch.toLowerCase());
    const matchCustomerId = !customerIdSearch || item.customerId.toLowerCase().includes(customerIdSearch.toLowerCase());
    const matchType = bookingType === 'ALL' || item.type === bookingType;
    const matchStatus = bookingStatus === 'ALL' || item.status === bookingStatus;
    return matchName && matchBookingId && matchCustomerId && matchType && matchStatus;
  });

  const clearFilters = () => {
    setNameSearch('');
    setBookingIdSearch('');
    setCustomerIdSearch('');
    setBookingType('ALL');
    setBookingStatus('ALL');
    setSelectedDateRange('21 Jul 2025 - 21 Jul 2025');
    message.info('Filters cleared');
  };

  const handleCheckIn = (record) => {
    const updated = bookings.map((b) =>
      b.key === record.key ? { ...b, status: 'Checked-in' } : b
    );
    setBookings(updated);
    message.success(`Checked-in ${record.customerName} successfully!`);
    if (onStatusChange) onStatusChange(record.key, 'Checked-in');
  };

  const handleView = (record) => {
    setSelectedBooking(record);
    setIsViewModalOpen(true);
  };

  const handleAddWalkIn = (values) => {
    const newBooking = {
      key: Date.now().toString(),
      bookingId: `BKG250721${Math.floor(100 + Math.random() * 900)}`,
      customerId: `CID${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: values.customerName,
      phone: values.phone,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      type: 'Walk-in',
      date: values.date ? values.date.format('DD MMM YYYY') : '21 Jul 2025',
      time: values.time ? values.time.format('hh:mm A') : '07:00 AM',
      amount: `₹${values.amount || 150}`,
      status: values.status || 'Checked-in',
      payment: values.payment || 'Cash',
    };

    const updated = [newBooking, ...bookings];
    setBookings(updated);
    setIsAddModalOpen(false);
    form.resetFields();
    message.success(`Walk-in booking created for ${values.customerName}!`);
    if (onAddBooking) onAddBooking(newBooking);
  };

  // Date Range Quick Menu
  const dateRangeMenu = {
    items: [
      { key: 'today', label: 'Today (21 Jul 2025)', onClick: () => setSelectedDateRange('21 Jul 2025 - 21 Jul 2025') },
      { key: 'yesterday', label: 'Yesterday (20 Jul 2025)', onClick: () => setSelectedDateRange('20 Jul 2025 - 20 Jul 2025') },
      { key: 'this_week', label: 'This Week (15 Jul 2025 - 21 Jul 2025)', onClick: () => setSelectedDateRange('15 Jul 2025 - 21 Jul 2025') },
      { key: 'this_month', label: 'This Month (01 Jul 2025 - 31 Jul 2025)', onClick: () => setSelectedDateRange('01 Jul 2025 - 31 Jul 2025') },
      { type: 'divider' },
      {
        key: 'custom',
        label: 'Custom Date Range...',
        icon: <CalendarOutlined style={{ color: 'var(--color-primary)' }} />,
        onClick: () => setIsDateRangeModalOpen(true),
      },
    ],
  };

  const getActionMenuItems = (record) => [
    {
      key: 'view',
      label: 'View Booking Details',
      icon: <EyeOutlined />,
      onClick: () => handleView(record),
    },
    {
      key: 'checkin',
      label: 'Mark as Checked-in',
      icon: <CheckOutlined style={{ color: '#00bf62' }} />,
      onClick: () => handleCheckIn(record),
    },
    {
      key: 'receipt',
      label: 'Download Invoice',
      icon: <DownloadOutlined />,
      onClick: () => message.success(`Receipt for ${record.bookingId} downloaded.`),
    },
    { type: 'divider' },
    {
      key: 'cancel',
      label: 'Cancel Booking',
      icon: <DeleteOutlined style={{ color: '#ef4444' }} />,
      onClick: () => {
        setBookings(bookings.map((b) => (b.key === record.key ? { ...b, status: 'Cancelled' } : b)));
        message.warning(`Booking ${record.bookingId} cancelled.`);
      },
    },
  ];

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'bookingId',
      key: 'bookingId',
      render: (text) => (
        <span style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', fontSize: 13 }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Customer ID',
      dataIndex: 'customerId',
      key: 'customerId',
      render: (text) => (
        <span style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13, fontWeight: 500 }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar src={record.avatar} size={38} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 650, color: isDarkMode ? '#ffffff' : '#0f172a', fontSize: 13 }}>
              {record.customerName}
            </div>
            <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', marginTop: 1 }}>
              {record.phone}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Booking Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const isApp = type === 'App Booking';
        return (
          <Tag
            style={{
              backgroundColor: isApp ? (isDarkMode ? 'rgba(114, 46, 209, 0.2)' : '#f3effe') : (isDarkMode ? 'rgba(0, 191, 98, 0.2)' : '#eaf8ef'),
              color: isApp ? (isDarkMode ? '#b37feb' : '#722ed1') : '#00bf62',
              border: 'none',
              borderRadius: 'var(--radius-base)',
              fontWeight: 600,
              fontSize: 11,
              padding: '2px 10px',
            }}
          >
            {type}
          </Tag>
        );
      },
    },
    {
      title: 'Date & Time',
      key: 'dateTime',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: 13, color: isDarkMode ? '#ffffff' : '#0f172a', fontWeight: 500 }}>
            {record.date}
          </div>
          <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', marginTop: 1 }}>
            {record.time}
          </div>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <span style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', fontSize: 13 }}>
          {amount}
        </span>
      ),
    },
    {
      title: 'Booking Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 'Checked-in') {
          return (
            <Tag
              icon={<CheckOutlined style={{ fontSize: 11 }} />}
              style={{
                backgroundColor: isDarkMode ? 'rgba(0, 191, 98, 0.15)' : '#eaf8ef',
                color: '#00bf62',
                border: 'none',
                borderRadius: 'var(--radius-base)',
                fontWeight: 600,
                fontSize: 11,
                padding: '2px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Checked-in
            </Tag>
          );
        }
        if (status === 'Upcoming') {
          return (
            <Tag
              icon={<ClockCircleOutlined style={{ fontSize: 11 }} />}
              style={{
                backgroundColor: isDarkMode ? 'rgba(250, 140, 22, 0.15)' : '#fef4e8',
                color: '#fa8c16',
                border: 'none',
                borderRadius: 'var(--radius-base)',
                fontWeight: 600,
                fontSize: 11,
                padding: '2px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Upcoming
            </Tag>
          );
        }
        if (status === 'Completed') {
          return (
            <Tag
              icon={<CheckCircleOutlined style={{ fontSize: 11 }} />}
              style={{
                backgroundColor: isDarkMode ? 'rgba(22, 119, 255, 0.15)' : '#edf4fe',
                color: '#1677ff',
                border: 'none',
                borderRadius: 'var(--radius-base)',
                fontWeight: 600,
                fontSize: 11,
                padding: '2px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Completed
            </Tag>
          );
        }
        if (status === 'Cancelled') {
          return (
            <Tag
              icon={<CloseCircleOutlined style={{ fontSize: 11 }} />}
              style={{
                backgroundColor: isDarkMode ? 'rgba(225, 29, 72, 0.15)' : '#fdeeed',
                color: '#e11d48',
                border: 'none',
                borderRadius: 'var(--radius-base)',
                fontWeight: 600,
                fontSize: 11,
                padding: '2px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Cancelled
            </Tag>
          );
        }
        return (
          <Tag
            icon={<UserOutlined style={{ fontSize: 11 }} />}
            style={{
              backgroundColor: isDarkMode ? 'rgba(114, 46, 209, 0.15)' : '#f3effe',
              color: '#722ed1',
              border: 'none',
              borderRadius: 'var(--radius-base)',
              fontWeight: 600,
              fontSize: 11,
              padding: '2px 10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            No Show
          </Tag>
        );
      },
    },
    {
      title: 'Payment',
      dataIndex: 'payment',
      key: 'payment',
      render: (payment) => {
        if (payment === 'Paid Online') {
          return (
            <Tag
              style={{
                backgroundColor: isDarkMode ? 'rgba(0, 191, 98, 0.15)' : '#eaf8ef',
                color: '#00bf62',
                border: 'none',
                borderRadius: 'var(--radius-base)',
                fontWeight: 600,
                fontSize: 11,
                padding: '2px 10px',
              }}
            >
              Paid Online
            </Tag>
          );
        }
        if (payment === 'Cash') {
          return (
            <Tag
              style={{
                backgroundColor: isDarkMode ? 'rgba(22, 119, 255, 0.15)' : '#edf4fe',
                color: '#1677ff',
                border: 'none',
                borderRadius: 'var(--radius-base)',
                fontWeight: 600,
                fontSize: 11,
                padding: '2px 10px',
              }}
            >
              Cash
            </Tag>
          );
        }
        if (payment === 'UPI') {
          return (
            <Tag
              style={{
                backgroundColor: isDarkMode ? 'rgba(114, 46, 209, 0.15)' : '#f3effe',
                color: '#722ed1',
                border: 'none',
                borderRadius: 'var(--radius-base)',
                fontWeight: 600,
                fontSize: 11,
                padding: '2px 10px',
              }}
            >
              UPI
            </Tag>
          );
        }
        if (payment === 'Refunded') {
          return (
            <Tag
              style={{
                backgroundColor: isDarkMode ? '#1e1e1e' : '#f1f5f9',
                color: isDarkMode ? '#888888' : '#64748b',
                border: 'none',
                borderRadius: 'var(--radius-base)',
                fontWeight: 600,
                fontSize: 11,
                padding: '2px 10px',
              }}
            >
              Refunded
            </Tag>
          );
        }
        return <span style={{ color: isDarkMode ? '#666666' : '#94a3b8' }}>—</span>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 140,
      render: (_, record) => {
        const isUpcoming = record.status === 'Upcoming';
        return (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, width: 124 }}>
            <Button
              size="small"
              onClick={() => (isUpcoming ? handleCheckIn(record) : handleView(record))}
              style={{
                borderRadius: 'var(--radius-base)',
                fontSize: 12,
                fontWeight: 600,
                borderColor: isDarkMode ? '#333333' : '#d0d7de',
                color: isDarkMode ? '#ffffff' : '#0f172a',
                width: 82,
                textAlign: 'center',
                height: 30,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isUpcoming ? 'Check-in' : 'View'}
            </Button>
            <Dropdown menu={{ items: getActionMenuItems(record) }} trigger={['click']}>
              <Button
                type="text"
                size="small"
                style={{ width: 28, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                icon={<MoreOutlined style={{ fontSize: 16, color: isDarkMode ? '#888888' : '#64748b' }} />}
              />
            </Dropdown>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a', fontWeight: 700 }}>
            Bookings
          </Title>
          <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 14 }}>
            Manage all walk-in and app bookings from one place.
          </Text>
        </div>

        {/* Add Walk-in Button */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddModalOpen(true)}
          style={{
            backgroundColor: 'var(--color-primary)',
            borderColor: 'var(--color-primary)',
            borderRadius: 'var(--radius-base)',
            fontWeight: 600,
            height: 42,
            padding: '0 20px',
            boxShadow: isDarkMode ? 'none' : '0 2px 6px rgba(0, 56, 130, 0.2)',
          }}
        >
          Add Walk-in
        </Button>
      </div>

      {/* FILTER & SEARCH CARD */}
      <Card
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-color)',
          borderRadius: 'var(--radius-base)',
          marginBottom: 24,
          boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
        }}
        styles={{ body: { padding: '20px 24px' } }}
      >
        {/* Row 1: Search Inputs */}
        <Row gutter={[16, 16]} align="bottom" style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} lg={7}>
            <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#475569', marginBottom: 6 }}>
              Search Customer Name
            </div>
            <Input
              prefix={<SearchOutlined style={{ color: isDarkMode ? '#888888' : '#94a3b8' }} />}
              placeholder="Enter customer name"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              allowClear
              style={{ height: 42, borderRadius: 'var(--radius-base)' }}
            />
          </Col>

          <Col xs={24} sm={12} lg={7}>
            <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#475569', marginBottom: 6 }}>
              Booking ID
            </div>
            <Input
              prefix={<SearchOutlined style={{ color: isDarkMode ? '#888888' : '#94a3b8' }} />}
              placeholder="Enter booking ID"
              value={bookingIdSearch}
              onChange={(e) => setBookingIdSearch(e.target.value)}
              allowClear
              style={{ height: 42, borderRadius: 'var(--radius-base)' }}
            />
          </Col>

          <Col xs={24} sm={12} lg={7}>
            <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#475569', marginBottom: 6 }}>
              Customer ID
            </div>
            <Input
              prefix={<SearchOutlined style={{ color: isDarkMode ? '#888888' : '#94a3b8' }} />}
              placeholder="Enter customer ID"
              value={customerIdSearch}
              onChange={(e) => setCustomerIdSearch(e.target.value)}
              allowClear
              style={{ height: 42, borderRadius: 'var(--radius-base)' }}
            />
          </Col>

          <Col xs={24} sm={12} lg={3}>
            <Button
              block
              onClick={() => message.info(`Showing ${filteredBookings.length} results.`)}
              style={{
                height: 42,
                borderRadius: 'var(--radius-base)',
                fontWeight: 600,
                color: 'var(--color-primary)',
                borderColor: 'var(--color-primary)',
              }}
            >
              Search
            </Button>
          </Col>
        </Row>

        {/* Row 2: Filter Selectors & Action Buttons */}
        <Row gutter={[16, 16]} align="bottom">
          {/* Date Range Filter */}
          <Col xs={24} sm={12} lg={7}>
            <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#475569', marginBottom: 6 }}>
              Date Range
            </div>
            <Dropdown menu={dateRangeMenu} trigger={['click']}>
              <div
                style={{
                  height: 42,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 14px',
                  backgroundColor: isDarkMode ? '#141414' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#262626' : '#d9d9d9'}`,
                  borderRadius: 'var(--radius-base)',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                  color: isDarkMode ? '#ffffff' : '#0f172a',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CalendarOutlined style={{ color: isDarkMode ? '#888888' : '#64748b' }} />
                  <span>{selectedDateRange}</span>
                </div>
                <DownOutlined style={{ fontSize: 10, color: isDarkMode ? '#888888' : '#64748b' }} />
              </div>
            </Dropdown>
          </Col>

          {/* Booking Type */}
          <Col xs={24} sm={12} lg={7}>
            <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#475569', marginBottom: 6 }}>
              Booking Type
            </div>
            <Select
              value={bookingType}
              onChange={setBookingType}
              style={{ width: '100%', height: 42 }}
            >
              <Option value="ALL">All Bookings</Option>
              <Option value="App Booking">App Booking</Option>
              <Option value="Walk-in">Walk-in</Option>
            </Select>
          </Col>

          {/* Booking Status */}
          <Col xs={24} sm={12} lg={4}>
            <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#475569', marginBottom: 6 }}>
              Booking Status
            </div>
            <Select
              value={bookingStatus}
              onChange={setBookingStatus}
              style={{ width: '100%', height: 42 }}
            >
              <Option value="ALL">All Status</Option>
              <Option value="Checked-in">Checked-in</Option>
              <Option value="Upcoming">Upcoming</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Cancelled">Cancelled</Option>
              <Option value="No Show">No Show</Option>
            </Select>
          </Col>

          {/* Filter & Clear Actions */}
          <Col xs={24} sm={12} lg={6}>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button
                icon={<FilterOutlined />}
                onClick={() => message.info(`Applied filters: ${filteredBookings.length} matches.`)}
                style={{
                  flex: 1,
                  height: 42,
                  borderRadius: 'var(--radius-base)',
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                  borderColor: isDarkMode ? '#333333' : '#d0d7de',
                }}
              >
                Filter
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={clearFilters}
                style={{
                  flex: 1,
                  height: 42,
                  borderRadius: 'var(--radius-base)',
                  fontWeight: 600,
                  color: isDarkMode ? '#aaaaaa' : '#64748b',
                  borderColor: isDarkMode ? '#333333' : '#d0d7de',
                }}
              >
                Clear Filters
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* BOOKINGS TABLE CARD */}
      <Card
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-color)',
          borderRadius: 'var(--radius-base)',
          boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
        }}
        styles={{ body: { padding: '16px 20px' } }}
      >
        <Table
          pagination={false}
          size="middle"
          scroll={{ x: 'max-content' }}
          dataSource={filteredBookings}
          columns={columns}
        />

        {/* Custom Table Footer with Pagination */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            marginTop: 20,
            paddingTop: 16,
            borderTop: `1px solid ${isDarkMode ? '#1e1e1e' : '#f1f5f9'}`,
          }}
        >
          <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b' }}>
            Showing 1 to {filteredBookings.length} of {bookings.length * 35} bookings
          </div>
          <Pagination
            current={currentPage}
            onChange={setCurrentPage}
            total={248}
            pageSize={pageSize}
            showSizeChanger={false}
          />
        </div>
      </Card>

      {/* ADD WALK-IN BOOKING MODAL */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-base)',
                backgroundColor: 'var(--color-primary-bg)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
              }}
            >
              <PlusOutlined />
            </div>
            <span>Create Walk-in Booking</span>
          </div>
        }
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleAddWalkIn} style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Customer Full Name"
                name="customerName"
                rules={[{ required: true, message: 'Please enter customer name' }]}
              >
                <Input placeholder="e.g. Arun Kumar" style={{ height: 42, borderRadius: 'var(--radius-base)' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input placeholder="+91 98765 43210" style={{ height: 42, borderRadius: 'var(--radius-base)' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Booking Date" name="date">
                <DatePicker style={{ width: '100%', height: 42, borderRadius: 'var(--radius-base)' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Slot Time" name="time">
                <TimePicker use12Hours format="h:mm a" style={{ width: '100%', height: 42, borderRadius: 'var(--radius-base)' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Pass Fee (Amount in ₹)" name="amount" initialValue={150}>
                <Input prefix="₹" style={{ height: 42, borderRadius: 'var(--radius-base)' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Payment Method" name="payment" initialValue="Cash">
                <Select style={{ height: 42 }}>
                  <Option value="Cash">Cash at Turnstile</Option>
                  <Option value="UPI">UPI / QR (GPay / PhonePe)</Option>
                  <Option value="Paid Online">Credit / Debit Card</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Initial Status" name="status" initialValue="Checked-in">
            <Radio.Group>
              <Radio value="Checked-in">Check-in Now (Grant Gate Access)</Radio>
              <Radio value="Upcoming">Upcoming Slot</Radio>
            </Radio.Group>
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
            <Button
              onClick={() => {
                setIsAddModalOpen(false);
                form.resetFields();
              }}
              style={{ borderRadius: 'var(--radius-base)', height: 40 }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
              style={{
                backgroundColor: 'var(--color-primary)',
                borderColor: 'var(--color-primary)',
                borderRadius: 'var(--radius-base)',
                fontWeight: 600,
                height: 40,
              }}
            >
              Confirm & Create Booking
            </Button>
          </div>
        </Form>
      </Modal>

      {/* VIEW BOOKING DETAILS MODAL */}
      <Modal
        title={
          <div style={{ fontSize: 18, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
            Booking Details
          </div>
        }
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        width={500}
        centered
        destroyOnClose
        styles={{ body: { padding: '8px 4px 12px 4px' } }}
      >
        {selectedBooking && (
          <div>
            {/* Customer Profile Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, marginTop: 8 }}>
              <Avatar
                src={selectedBooking.avatar}
                size={68}
                style={{
                  border: `2px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`,
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {selectedBooking.customerName}
                </div>
                <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <PhoneOutlined /> {selectedBooking.phone}
                </div>
                <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CalendarOutlined /> Customer ID: <span style={{ color: 'var(--color-primary)', fontWeight: 650 }}>{selectedBooking.customerId}</span>
                </div>
              </div>
            </div>

            {/* Key-Value Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
              {/* Row 1: Booking Type */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#334155', fontSize: 14, fontWeight: 500 }}>
                  <MobileOutlined style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 16 }} />
                  <span>Booking Type</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Tag
                    style={{
                      backgroundColor: selectedBooking.type === 'App Booking' ? (isDarkMode ? 'rgba(114, 46, 209, 0.2)' : '#f3effe') : (isDarkMode ? 'rgba(0, 191, 98, 0.2)' : '#eaf8ef'),
                      color: selectedBooking.type === 'App Booking' ? (isDarkMode ? '#b37feb' : '#722ed1') : '#00bf62',
                      border: 'none',
                      borderRadius: 'var(--radius-base)',
                      fontWeight: 600,
                      fontSize: 12,
                      padding: '2px 10px',
                      margin: 0,
                    }}
                  >
                    {selectedBooking.type}
                  </Tag>
                  <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', marginTop: 3 }}>
                    (Member Booking)
                  </div>
                </div>
              </div>

              {/* Row 2: Booking ID */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#334155', fontSize: 14, fontWeight: 500 }}>
                  <CalendarOutlined style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 16 }} />
                  <span>Booking ID</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {selectedBooking.bookingId}
                </div>
              </div>

              {/* Row 3: Payment Type */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#334155', fontSize: 14, fontWeight: 500 }}>
                  <CreditCardOutlined style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 16 }} />
                  <span>Payment Type</span>
                </div>
                <div>
                  <Tag
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(0, 191, 98, 0.15)' : '#eaf8ef',
                      color: '#00bf62',
                      border: 'none',
                      borderRadius: 'var(--radius-base)',
                      fontWeight: 600,
                      fontSize: 12,
                      padding: '2px 10px',
                      margin: 0,
                    }}
                  >
                    {selectedBooking.payment && selectedBooking.payment.includes('Online') ? 'Online' : selectedBooking.payment || 'Online'}
                  </Tag>
                </div>
              </div>

              {/* Row 4: Booking Date */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#334155', fontSize: 14, fontWeight: 500 }}>
                  <CalendarOutlined style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 16 }} />
                  <span>Booking Date</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {selectedBooking.date}, {selectedBooking.time}
                </div>
              </div>

              {/* Row 5: Booking Expiry Date */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#334155', fontSize: 14, fontWeight: 500 }}>
                  <CalendarOutlined style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 16 }} />
                  <span>Booking Expiry Date</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {selectedBooking.date}, 09:00 AM
                </div>
              </div>
            </div>

            {/* Expiry Warning Notice Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 'var(--radius-base)',
                backgroundColor: isDarkMode ? 'rgba(114, 46, 209, 0.15)' : '#f3effe',
                marginBottom: 24,
              }}
            >
              <InfoCircleOutlined style={{ color: '#722ed1', fontSize: 18, flexShrink: 0 }} />
              <div style={{ fontSize: 12.5, color: isDarkMode ? '#d3adf7' : '#531dab', lineHeight: 1.4 }}>
                Customer will not be able to check-in after the expiry date and time.
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: 14 }}>
              <Button
                onClick={() => setIsViewModalOpen(false)}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 'var(--radius-base)',
                  fontWeight: 600,
                  fontSize: 14,
                  borderColor: isDarkMode ? '#333333' : '#d0d7de',
                  color: isDarkMode ? '#ffffff' : '#0f172a',
                  backgroundColor: isDarkMode ? '#141414' : '#ffffff',
                }}
              >
                Close
              </Button>
              {selectedBooking.status === 'Checked-in' ? (
                <div
                  style={{
                    flex: 1.3,
                    height: 44,
                    borderRadius: 'var(--radius-base)',
                    fontWeight: 600,
                    fontSize: 14,
                    backgroundColor: isDarkMode ? 'rgba(0, 191, 98, 0.15)' : '#eaf8ef',
                    color: '#00bf62',
                    border: `1px solid ${isDarkMode ? 'rgba(0, 191, 98, 0.3)' : '#b7eb8f'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    userSelect: 'none',
                  }}
                >
                  <CheckCircleOutlined style={{ color: '#00bf62', fontSize: 16 }} />
                  <span>Checked-in</span>
                </div>
              ) : (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined style={{ color: '#ffffff' }} />}
                  onClick={() => {
                    handleCheckIn(selectedBooking);
                    setIsViewModalOpen(false);
                  }}
                  style={{
                    flex: 1.3,
                    height: 44,
                    borderRadius: 'var(--radius-base)',
                    fontWeight: 600,
                    fontSize: 14,
                    backgroundColor: 'var(--color-primary)',
                    borderColor: 'var(--color-primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  Mark Check-in
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* CUSTOM DATE RANGE MODAL */}
      <Modal
        title="Select Custom Date Range"
        open={isDateRangeModalOpen}
        onCancel={() => {
          setIsDateRangeModalOpen(false);
          setTempDateRange(null);
        }}
        onOk={() => {
          if (tempDateRange && tempDateRange.length === 2 && tempDateRange[0] && tempDateRange[1]) {
            const start = tempDateRange[0].format('DD MMM YYYY');
            const end = tempDateRange[1].format('DD MMM YYYY');
            setSelectedDateRange(`${start} - ${end}`);
            setIsDateRangeModalOpen(false);
            message.success(`Date filter set: ${start} - ${end}`);
          } else {
            message.warning('Please pick both start and end dates');
          }
        }}
        okText="Apply Filter"
        cancelText="Cancel"
        destroyOnClose
      >
        <div style={{ padding: '16px 0' }}>
          <Paragraph style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13, marginBottom: 16 }}>
            Pick start date and end date to filter customer bookings ledger:
          </Paragraph>
          <DatePicker.RangePicker
            style={{ width: '100%', height: 42 }}
            onChange={(dates) => setTempDateRange(dates)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default BookingsManagement;
