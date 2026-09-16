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
  Form,
  Pagination,
  Typography,
  Space,
  message,
  Avatar,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  DownloadOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  TeamOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useTheme } from '../theme/ThemeContext';

const { Option } = Select;

// Sample Initial Customers Data matching user mockup exactly
const INITIAL_CUSTOMERS = [
  {
    id: '1',
    name: 'Arun Kumar',
    customerId: 'CUST100245',
    phone: '+91 98765 43210',
    email: 'arun.kumar@email.com',
    totalBookings: 24,
    totalRevenue: '5,280.00',
    status: 'Active',
    avatarColor: '#f3e8ff',
    avatarTextColor: '#7e22ce',
    initials: 'AK',
    avatarImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arun&backgroundColor=b6e3f4,c0aede,d1d4f9',
    metrics: {
      totalBookings: 24,
      completed: 16,
      completedPct: '66.67%',
      cancelled: 5,
      cancelledPct: '20.83%',
      noShow: 3,
      noShowPct: '12.50%',
      totalRevenue: '5,280.00',
    },
    recentBookings: [
      {
        key: '1',
        bookingId: 'BK100121',
        gymName: 'FitZone Gym',
        bookingDateTime: '18 May 2026, 07:30 AM',
        type: 'App Booking',
        status: 'Completed',
        amount: '350.00',
      },
      {
        key: '2',
        bookingId: 'BK100098',
        gymName: 'Powerhouse Gym',
        bookingDateTime: '16 May 2026, 06:00 PM',
        type: 'App Booking',
        status: 'Completed',
        amount: '250.00',
      },
      {
        key: '3',
        bookingId: 'BK100076',
        gymName: 'Muscle Factory',
        bookingDateTime: '14 May 2026, 08:00 AM',
        type: 'App Booking',
        status: 'Cancelled',
        amount: '250.00',
      },
      {
        key: '4',
        bookingId: 'BK100055',
        gymName: 'Iron Club',
        bookingDateTime: '12 May 2026, 07:00 PM',
        type: 'Walk-in',
        status: 'No Show',
        amount: '300.00',
      },
      {
        key: '5',
        bookingId: 'BK100031',
        gymName: 'Fitness First',
        bookingDateTime: '10 May 2026, 06:30 AM',
        type: 'Walk-in',
        status: 'Completed',
        amount: '300.00',
      },
    ],
  },
  {
    id: '2',
    name: 'Priya Sharma',
    customerId: 'CUST100246',
    phone: '+91 91234 56789',
    email: 'priya.sharma@email.com',
    totalBookings: 18,
    totalRevenue: '3,860.00',
    status: 'Active',
    avatarColor: '#fce7f3',
    avatarTextColor: '#db2777',
    initials: 'PS',
    avatarImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=ffd5dc,ffdfbf',
    metrics: {
      totalBookings: 18,
      completed: 14,
      completedPct: '77.78%',
      cancelled: 3,
      cancelledPct: '16.67%',
      noShow: 1,
      noShowPct: '5.55%',
      totalRevenue: '3,860.00',
    },
    recentBookings: [
      {
        key: '1',
        bookingId: 'BK100201',
        gymName: 'Gold Gym',
        bookingDateTime: '19 May 2026, 08:00 AM',
        type: 'App Booking',
        status: 'Completed',
        amount: '400.00',
      },
      {
        key: '2',
        bookingId: 'BK100189',
        gymName: 'Ozone Fitness',
        bookingDateTime: '15 May 2026, 05:30 PM',
        type: 'App Booking',
        status: 'Completed',
        amount: '350.00',
      },
    ],
  },
  {
    id: '3',
    name: 'Rahul Krishnan',
    customerId: 'CUST100247',
    phone: '+91 99887 66554',
    email: 'rahul.k@email.com',
    totalBookings: 31,
    totalRevenue: '6,930.00',
    status: 'Active',
    avatarColor: '#dcfce7',
    avatarTextColor: '#16a34a',
    initials: 'RK',
    avatarImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    metrics: {
      totalBookings: 31,
      completed: 27,
      completedPct: '87.10%',
      cancelled: 2,
      cancelledPct: '6.45%',
      noShow: 2,
      noShowPct: '6.45%',
      totalRevenue: '6,930.00',
    },
    recentBookings: [
      {
        key: '1',
        bookingId: 'BK100310',
        gymName: 'Slam Fitness',
        bookingDateTime: '20 May 2026, 06:00 AM',
        type: 'App Booking',
        status: 'Completed',
        amount: '450.00',
      },
    ],
  },
  {
    id: '4',
    name: 'Sneha Nair',
    customerId: 'CUST100248',
    phone: '+91 90123 45678',
    email: 'sneha.nair@email.com',
    totalBookings: 15,
    totalRevenue: '2,950.00',
    status: 'Active',
    avatarColor: '#ffedd5',
    avatarTextColor: '#ea580c',
    initials: 'SN',
    avatarImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
    metrics: {
      totalBookings: 15,
      completed: 12,
      completedPct: '80.00%',
      cancelled: 2,
      cancelledPct: '13.33%',
      noShow: 1,
      noShowPct: '6.67%',
      totalRevenue: '2,950.00',
    },
    recentBookings: [],
  },
  {
    id: '5',
    name: 'Vijay Joseph',
    customerId: 'CUST100249',
    phone: '+91 93456 78901',
    email: 'vijay.joseph@email.com',
    totalBookings: 27,
    totalRevenue: '4,875.00',
    status: 'Active',
    avatarColor: '#e0e7ff',
    avatarTextColor: '#4f46e5',
    initials: 'VJ',
    avatarImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vijay',
    metrics: {
      totalBookings: 27,
      completed: 22,
      completedPct: '81.48%',
      cancelled: 3,
      cancelledPct: '11.11%',
      noShow: 2,
      noShowPct: '7.41%',
      totalRevenue: '4,875.00',
    },
    recentBookings: [],
  },
  {
    id: '6',
    name: 'Ananya Singh',
    customerId: 'CUST100250',
    phone: '+91 98712 34567',
    email: 'ananya.singh@email.com',
    totalBookings: 20,
    totalRevenue: '3,420.00',
    status: 'Inactive',
    avatarColor: '#ccfbf1',
    avatarTextColor: '#0d9488',
    initials: 'AS',
    avatarImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
    metrics: {
      totalBookings: 20,
      completed: 13,
      completedPct: '65.00%',
      cancelled: 4,
      cancelledPct: '20.00%',
      noShow: 3,
      noShowPct: '15.00%',
      totalRevenue: '3,420.00',
    },
    recentBookings: [],
  },
  {
    id: '7',
    name: 'Manoj Gupta',
    customerId: 'CUST100251',
    phone: '+91 98123 65432',
    email: 'manoj.gupta@email.com',
    totalBookings: 12,
    totalRevenue: '2,120.00',
    status: 'Inactive',
    avatarColor: '#fef3c7',
    avatarTextColor: '#d97706',
    initials: 'MG',
    avatarImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manoj',
    metrics: {
      totalBookings: 12,
      completed: 8,
      completedPct: '66.67%',
      cancelled: 3,
      cancelledPct: '25.00%',
      noShow: 1,
      noShowPct: '8.33%',
      totalRevenue: '2,120.00',
    },
    recentBookings: [],
  },
  {
    id: '8',
    name: 'Deepa Krishnan',
    customerId: 'CUST100252',
    phone: '+91 99654 32109',
    email: 'deepa.k@email.com',
    totalBookings: 9,
    totalRevenue: '1,540.00',
    status: 'Inactive',
    avatarColor: '#e2e8f0',
    avatarTextColor: '#475569',
    initials: 'DK',
    avatarImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deepa',
    metrics: {
      totalBookings: 9,
      completed: 6,
      completedPct: '66.67%',
      cancelled: 2,
      cancelledPct: '22.22%',
      noShow: 1,
      noShowPct: '11.11%',
      totalRevenue: '1,540.00',
    },
    recentBookings: [],
  },
  {
    id: '9',
    name: 'Harish Babu',
    customerId: 'CUST100253',
    phone: '+91 90987 61234',
    email: 'harish.babu@email.com',
    totalBookings: 17,
    totalRevenue: '3,110.00',
    status: 'Active',
    avatarColor: '#fce7f3',
    avatarTextColor: '#be185d',
    initials: 'HB',
    avatarImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Harish',
    metrics: {
      totalBookings: 17,
      completed: 13,
      completedPct: '76.47%',
      cancelled: 2,
      cancelledPct: '11.76%',
      noShow: 2,
      noShowPct: '11.76%',
      totalRevenue: '3,110.00',
    },
    recentBookings: [],
  },
  {
    id: '10',
    name: 'Nithya Thakur',
    customerId: 'CUST100254',
    phone: '+91 94876 54321',
    email: 'nithya.thakur@email.com',
    totalBookings: 22,
    totalRevenue: '4,230.00',
    status: 'Active',
    avatarColor: '#dbeafe',
    avatarTextColor: '#1d4ed8',
    initials: 'NT',
    avatarImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nithya',
    metrics: {
      totalBookings: 22,
      completed: 17,
      completedPct: '77.27%',
      cancelled: 3,
      cancelledPct: '13.64%',
      noShow: 2,
      noShowPct: '9.09%',
      totalRevenue: '4,230.00',
    },
    recentBookings: [],
  },
];

export const CustomersManagement = () => {
  const { isDarkMode } = useTheme();

  // Navigation View State: 'list' | 'detail'
  const [currentView, setCurrentView] = useState('list');
  const [selectedCustomer, setSelectedCustomer] = useState(INITIAL_CUSTOMERS[0]);

  // Filters & State
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchQuery, statusFilter]);

  // Handle View Customer Detail
  const handleViewCustomer = (record) => {
    setSelectedCustomer(record);
    setCurrentView('detail');
  };

  // Handle Add Customer Submit
  const handleAddCustomerSubmit = (values) => {
    const newCust = {
      id: String(customers.length + 1),
      name: values.name,
      customerId: `CUST100${255 + customers.length}`,
      phone: values.phone,
      email: values.email,
      totalBookings: 0,
      totalRevenue: '0.00',
      status: values.status || 'Active',
      avatarColor: '#f3e8ff',
      avatarTextColor: '#7e22ce',
      initials: values.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      avatarImg: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(values.name)}`,
      metrics: {
        totalBookings: 0,
        completed: 0,
        completedPct: '0.00%',
        cancelled: 0,
        cancelledPct: '0.00%',
        noShow: 0,
        noShowPct: '0.00%',
        totalRevenue: '0.00',
      },
      recentBookings: [],
    };
    setCustomers([newCust, ...customers]);
    setIsAddModalOpen(false);
    form.resetFields();
    message.success(`Customer "${values.name}" created successfully!`);
  };

  // Handle Edit Customer Submit
  const handleEditCustomerSubmit = (values) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.customerId === selectedCustomer.customerId
          ? { ...c, name: values.name, phone: values.phone, email: values.email, status: values.status }
          : c
      )
    );
    setSelectedCustomer((prev) => ({
      ...prev,
      name: values.name,
      phone: values.phone,
      email: values.email,
      status: values.status,
    }));
    setIsEditModalOpen(false);
    message.success('Customer details updated successfully!');
  };

  // Table Columns for Customer List
  const customerColumns = [
    {
      title: 'Customer Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: record.avatarColor || '#f3e8ff',
              color: record.avatarTextColor || '#7e22ce',
              fontWeight: 800,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {record.initials}
          </div>
          <span style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
            {record.name}
          </span>
        </div>
      ),
    },
    {
      title: 'Customer ID',
      dataIndex: 'customerId',
      key: 'customerId',
      width: 130,
      render: (text) => (
        <span style={{ fontWeight: 700, color: '#4f46e5', letterSpacing: '0.2px' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (text) => (
        <span style={{ color: isDarkMode ? '#cbd5e1' : '#334155' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Email ID',
      dataIndex: 'email',
      key: 'email',
      width: 210,
      render: (text) => (
        <span style={{ color: isDarkMode ? '#cbd5e1' : '#334155' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Total Bookings',
      dataIndex: 'totalBookings',
      key: 'totalBookings',
      width: 130,
      align: 'center',
      render: (val) => (
        <span style={{ fontWeight: 600, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
          {val}
        </span>
      ),
    },
    {
      title: 'Total Revenue',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      width: 140,
      render: (val) => (
        <span style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
          ₹ {val}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const isActive = status === 'Active';
        return (
          <span
            style={{
              display: 'inline-block',
              padding: '3px 12px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              backgroundColor: isActive
                ? isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#eaf8ef'
                : isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fdeeed',
              color: isActive ? '#00bf62' : '#e11d48',
            }}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 90,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          size="small"
          onClick={() => handleViewCustomer(record)}
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
      ),
    },
  ];

  // Recent Bookings Columns for Customer Detail View
  const recentBookingsColumns = [
    {
      title: 'Booking ID',
      dataIndex: 'bookingId',
      key: 'bookingId',
      width: 140,
      render: (text) => (
        <span style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Gym Name',
      dataIndex: 'gymName',
      key: 'gymName',
      width: 180,
      render: (text) => (
        <span style={{ fontWeight: 600, color: isDarkMode ? '#e2e8f0' : '#1e293b' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Booking Date & Time',
      dataIndex: 'bookingDateTime',
      key: 'bookingDateTime',
      width: 190,
      render: (text) => (
        <span style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 140,
      render: (type) => {
        const isApp = type === 'App Booking';
        return (
          <span
            style={{
              display: 'inline-block',
              padding: '3px 10px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              backgroundColor: isApp
                ? isDarkMode ? 'rgba(59, 130, 246, 0.15)' : '#edf4fe'
                : isDarkMode ? 'rgba(249, 115, 22, 0.15)' : '#fef4e8',
              color: isApp ? '#3b82f6' : '#ea580c',
            }}
          >
            {type}
          </span>
        );
      },
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
  ];

  // -------------------------------------------------------------
  // RENDER SCREEN 2: CUSTOMER DETAIL VIEW
  // -------------------------------------------------------------
  if (currentView === 'detail' && selectedCustomer) {
    return (
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Back Button Navigation */}
        <div style={{ marginBottom: 20 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => setCurrentView('list')}
            style={{
              borderRadius: 'var(--radius-base)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Back to Customers List
          </Button>
        </div>

        {/* 1. TOP CUSTOMER PROFILE CARD */}
        <Card
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-color)',
            borderRadius: 'var(--radius-base)',
            marginBottom: 20,
          }}
          styles={{ body: { padding: '24px 28px' } }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            {/* Left: Avatar + Details */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  backgroundColor: '#e0e7ff',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
                  flexShrink: 0,
                }}
              >
                <img
                  src={selectedCustomer.avatarImg}
                  alt={selectedCustomer.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div>
                <div style={{ fontSize: 24, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 6 }}>
                  {selectedCustomer.name}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                    Customer ID
                  </span>
                  <span
                    style={{
                      padding: '2px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : '#ede9fe',
                      color: '#4f46e5',
                    }}
                  >
                    {selectedCustomer.customerId}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: isDarkMode ? '#cbd5e1' : '#334155', fontSize: 13 }}>
                    <PhoneOutlined style={{ color: '#6366f1' }} />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: isDarkMode ? '#cbd5e1' : '#334155', fontSize: 13 }}>
                    <MailOutlined style={{ color: '#6366f1' }} />
                    <span>{selectedCustomer.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Status Pill & Edit Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  borderRadius: 20,
                  backgroundColor: selectedCustomer.status === 'Active'
                    ? isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#eaf8ef'
                    : isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fdeeed',
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: selectedCustomer.status === 'Active' ? '#00bf62' : '#e11d48',
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: selectedCustomer.status === 'Active' ? '#00bf62' : '#e11d48',
                  }}
                >
                  {selectedCustomer.status}
                </span>
              </div>

              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  editForm.setFieldsValue({
                    name: selectedCustomer.name,
                    phone: selectedCustomer.phone,
                    email: selectedCustomer.email,
                    status: selectedCustomer.status,
                  });
                  setIsEditModalOpen(true);
                }}
                style={{
                  borderRadius: 'var(--radius-base)',
                  fontWeight: 600,
                  color: '#4f46e5',
                  borderColor: isDarkMode ? '#3730a3' : '#c7d2fe',
                }}
              >
                Edit
              </Button>
            </div>
          </div>
        </Card>

        {/* 2. MIDDLE 5-SEGMENT METRIC BAR */}
        <Card
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-color)',
            borderRadius: 'var(--radius-base)',
            marginBottom: 20,
          }}
          styles={{ body: { padding: '20px 24px' } }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 16,
              alignItems: 'center',
            }}
          >
            {/* Metric 1: Total Bookings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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
                <CalendarOutlined style={{ fontSize: 22, color: '#3b82f6' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  Total Bookings
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {selectedCustomer.metrics?.totalBookings || selectedCustomer.totalBookings}
                </div>
              </div>
            </div>

            {/* Metric 2: Completed */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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
                <CheckCircleOutlined style={{ fontSize: 22, color: '#00bf62' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  Completed
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {selectedCustomer.metrics?.completed || 16}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#00bf62' }}>
                  {selectedCustomer.metrics?.completedPct || '66.67%'}
                </div>
              </div>
            </div>

            {/* Metric 3: Cancelled */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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
                <CloseCircleOutlined style={{ fontSize: 22, color: '#ef4444' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  Cancelled
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {selectedCustomer.metrics?.cancelled || 5}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444' }}>
                  {selectedCustomer.metrics?.cancelledPct || '20.83%'}
                </div>
              </div>
            </div>

            {/* Metric 4: No Show */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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
                <MinusCircleOutlined style={{ fontSize: 22, color: '#f59e0b' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  No Show
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {selectedCustomer.metrics?.noShow || 3}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>
                  {selectedCustomer.metrics?.noShowPct || '12.50%'}
                </div>
              </div>
            </div>

            {/* Metric 5: Total Revenue */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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
                <span style={{ fontSize: 22, fontWeight: 900, color: '#6366f1' }}>₹</span>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  Total Revenue
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  ₹ {selectedCustomer.metrics?.totalRevenue || selectedCustomer.totalRevenue}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 3. RECENT BOOKINGS TABLE */}
        <Card
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-color)',
            borderRadius: 'var(--radius-base)',
            marginBottom: 30,
          }}
          styles={{ body: { padding: '24px' } }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
              Recent Bookings
            </div>
            <Button
              type="link"
              style={{ fontWeight: 700, color: '#4f46e5', padding: 0 }}
              onClick={() => message.info('Redirecting to full bookings ledger...')}
            >
              View All Bookings <RightOutlined style={{ fontSize: 10 }} />
            </Button>
          </div>

          <Table
            columns={recentBookingsColumns}
            dataSource={selectedCustomer.recentBookings && selectedCustomer.recentBookings.length > 0 ? selectedCustomer.recentBookings : INITIAL_CUSTOMERS[0].recentBookings}
            pagination={false}
            rowKey="key"
            scroll={{ x: 900 }}
          />
        </Card>

        {/* EDIT CUSTOMER MODAL */}
        <Modal
          title={<span style={{ fontWeight: 800 }}>Edit Customer Details</span>}
          open={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          footer={null}
          centered
        >
          <Form form={editForm} layout="vertical" onFinish={handleEditCustomerSubmit} style={{ marginTop: 16 }}>
            <Form.Item label="Customer Full Name" name="name" rules={[{ required: true, message: 'Enter name' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: 'Enter phone' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Email ID" name="email" rules={[{ required: true, type: 'email', message: 'Enter valid email' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Status" name="status" rules={[{ required: true }]}>
              <Select>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER SCREEN 1: CUSTOMERS LIST VIEW
  // -------------------------------------------------------------
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      {/* 1. TOP 4 METRIC CARDS */}
      <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
        {/* Total Customers */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.15)' : '#f3effe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <TeamOutlined style={{ fontSize: 24, color: '#6366f1' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  Total Customers
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                  1,248
                </div>
                <div style={{ fontSize: 12, color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                  All time
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Active Customers */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#eaf8ef',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CheckCircleOutlined style={{ fontSize: 24, color: '#00bf62' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  Active Customers
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                  986
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#00bf62' }}>
                  79.01%
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* New This Month */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#fef4e8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ClockCircleOutlined style={{ fontSize: 24, color: '#f59e0b' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  New This Month
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                  132
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>
                  10.58%
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Total Bookings */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : '#edf4fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CalendarOutlined style={{ fontSize: 24, color: '#3b82f6' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  Total Bookings
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                  32,845
                </div>
                <div style={{ fontSize: 12, color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                  All time
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
          {/* Left: Search + Status Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 280, maxWidth: 640 }}>
            <Input
              placeholder="Search by name, phone, email or customer ID..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: 'var(--radius-base)' }}
              allowClear
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 140 }}
            >
              <Option value="all">All Status</Option>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </div>

          {/* Right: Export & Add New Customer Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => message.success('Exporting customer data as CSV...')}
              style={{
                borderRadius: 'var(--radius-base)',
                fontWeight: 600,
                borderColor: isDarkMode ? '#334155' : '#e2e8f0',
              }}
            >
              Export
            </Button>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsAddModalOpen(true)}
              style={{
                borderRadius: 'var(--radius-base)',
                fontWeight: 700,
                backgroundColor: '#4f46e5',
                borderColor: '#4f46e5',
              }}
            >
              Add New Customer
            </Button>
          </div>
        </div>
      </Card>

      {/* 3. CUSTOMER DATA TABLE */}
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
          columns={customerColumns}
          dataSource={filteredCustomers}
          rowKey="id"
          pagination={false}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 4. PAGINATION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 24 }}>
        <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b' }}>
          Showing 1 to {filteredCustomers.length} of 1,248 customers
        </div>
        <Pagination current={currentPage} total={1248} pageSize={10} onChange={setCurrentPage} />
      </div>

      {/* ADD NEW CUSTOMER MODAL */}
      <Modal
        title={<span style={{ fontWeight: 800 }}>Add New Customer</span>}
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleAddCustomerSubmit} style={{ marginTop: 16 }}>
          <Form.Item label="Customer Full Name" name="name" rules={[{ required: true, message: 'Please enter customer name' }]}>
            <Input placeholder="e.g. Rahul Sharma" />
          </Form.Item>
          <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: 'Please enter phone number' }]}>
            <Input placeholder="+91 98765 43210" />
          </Form.Item>
          <Form.Item label="Email ID" name="email" rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}>
            <Input placeholder="rahul@email.com" />
          </Form.Item>
          <Form.Item label="Status" name="status" initialValue="Active">
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#4f46e5' }}>
              Create Customer
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomersManagement;
