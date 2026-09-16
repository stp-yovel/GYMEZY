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
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  DownloadOutlined,
  EyeOutlined,
  MoreOutlined,
  ReloadOutlined,
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import { useTheme } from '../theme/ThemeContext';

const { Option } = Select;
const { RangePicker } = DatePicker;

// Initial Customers Report Data matching mockup exactly
const INITIAL_REPORT_DATA = [
  {
    key: '1',
    id: 1,
    name: 'Arun Kumar',
    customerId: 'CUST100245',
    phone: '+91 98765 43210',
    initials: 'AK',
    avatarColor: '#f3e8ff',
    avatarTextColor: '#7e22ce',
    lastBookingDate: '18 May 2026  07:30 PM',
    status: 'Active',
    totalBookings: 24,
    completed: 20,
    cancelled: 2,
    noShow: 2,
    revenueGenerated: '5,280',
  },
  {
    key: '2',
    id: 2,
    name: 'Priya Sharma',
    customerId: 'CUST100246',
    phone: '+91 91234 56789',
    initials: 'PS',
    avatarColor: '#fce7f3',
    avatarTextColor: '#db2777',
    lastBookingDate: '17 May 2026  06:15 PM',
    status: 'Active',
    totalBookings: 18,
    completed: 16,
    cancelled: 1,
    noShow: 1,
    revenueGenerated: '4,120',
  },
  {
    key: '3',
    id: 3,
    name: 'Rahul Krishnan',
    customerId: 'CUST100247',
    phone: '+91 99887 66554',
    initials: 'RK',
    avatarColor: '#dcfce7',
    avatarTextColor: '#16a34a',
    lastBookingDate: '16 May 2026  08:45 PM',
    status: 'Active',
    totalBookings: 31,
    completed: 28,
    cancelled: 2,
    noShow: 1,
    revenueGenerated: '7,960',
  },
  {
    key: '4',
    id: 4,
    name: 'Sneha Nair',
    customerId: 'CUST100248',
    phone: '+91 90123 45678',
    initials: 'SN',
    avatarColor: '#ffedd5',
    avatarTextColor: '#ea580c',
    lastBookingDate: '12 May 2026  07:10 PM',
    status: 'Inactive',
    totalBookings: 15,
    completed: 13,
    cancelled: 1,
    noShow: 1,
    revenueGenerated: '3,420',
  },
  {
    key: '5',
    id: 5,
    name: 'Vijay Joseph',
    customerId: 'CUST100249',
    phone: '+91 93456 78901',
    initials: 'VJ',
    avatarColor: '#e0e7ff',
    avatarTextColor: '#4f46e5',
    lastBookingDate: '10 May 2026  09:20 PM',
    status: 'Active',
    totalBookings: 27,
    completed: 24,
    cancelled: 2,
    noShow: 1,
    revenueGenerated: '6,540',
  },
  {
    key: '6',
    id: 6,
    name: 'Deepa Krishnan',
    customerId: 'CUST100250',
    phone: '+91 99654 32109',
    initials: 'DK',
    avatarColor: '#e2e8f0',
    avatarTextColor: '#475569',
    lastBookingDate: '08 May 2026  06:40 PM',
    status: 'Inactive',
    totalBookings: 9,
    completed: 8,
    cancelled: 0,
    noShow: 1,
    revenueGenerated: '1,860',
  },
  {
    key: '7',
    id: 7,
    name: 'Manoj G',
    customerId: 'CUST100251',
    phone: '+91 98123 65432',
    initials: 'MG',
    avatarColor: '#fef3c7',
    avatarTextColor: '#d97706',
    lastBookingDate: '08 May 2026  07:55 PM',
    status: 'Active',
    totalBookings: 22,
    completed: 19,
    cancelled: 1,
    noShow: 2,
    revenueGenerated: '5,060',
  },
  {
    key: '8',
    id: 8,
    name: 'Rohit Singh',
    customerId: 'CUST100253',
    phone: '+91 98712 34567',
    initials: 'AS',
    avatarColor: '#ccfbf1',
    avatarTextColor: '#0d9488',
    lastBookingDate: '06 May 2026  09:10 PM',
    status: 'Active',
    totalBookings: 30,
    completed: 26,
    cancelled: 3,
    noShow: 1,
    revenueGenerated: '7,450',
  },
  {
    key: '9',
    id: 9,
    name: 'Nandini Roy',
    customerId: 'CUST100254',
    phone: '+91 94876 54321',
    initials: 'NP',
    avatarColor: '#dbeafe',
    avatarTextColor: '#1d4ed8',
    lastBookingDate: '05 May 2026  05:45 PM',
    status: 'Inactive',
    totalBookings: 6,
    completed: 5,
    cancelled: 0,
    noShow: 1,
    revenueGenerated: '1,130',
  },
  {
    key: '10',
    id: 10,
    name: 'Suresh Kumar',
    customerId: 'CUST100255',
    phone: '+91 90987 61234',
    initials: 'SK',
    avatarColor: '#e0e7ff',
    avatarTextColor: '#4338ca',
    lastBookingDate: '04 May 2026  07:25 PM',
    status: 'Active',
    totalBookings: 21,
    completed: 18,
    cancelled: 2,
    noShow: 1,
    revenueGenerated: '4,830',
  },
  {
    key: '11',
    id: 11,
    name: 'Harish B',
    customerId: 'CUST100256',
    phone: '+91 98765 12340',
    initials: 'HB',
    avatarColor: '#fce7f3',
    avatarTextColor: '#be185d',
    lastBookingDate: '03 May 2026  08:30 PM',
    status: 'Active',
    totalBookings: 14,
    completed: 12,
    cancelled: 1,
    noShow: 1,
    revenueGenerated: '2,780',
  },
  {
    key: '12',
    id: 12,
    name: 'Lavanya S',
    customerId: 'CUST100257',
    phone: '+91 93456 12345',
    initials: 'LS',
    avatarColor: '#f3e8ff',
    avatarTextColor: '#9333ea',
    lastBookingDate: '03 May 2026  06:20 PM',
    status: 'Active',
    totalBookings: 19,
    completed: 17,
    cancelled: 1,
    noShow: 1,
    revenueGenerated: '3,910',
  },
  {
    key: '13',
    id: 13,
    name: 'Karthik Prabhu',
    customerId: 'CUST100258',
    phone: '+91 99887 12345',
    initials: 'KP',
    avatarColor: '#dcfce7',
    avatarTextColor: '#15803d',
    lastBookingDate: '02 May 2026  07:00 PM',
    status: 'Active',
    totalBookings: 25,
    completed: 21,
    cancelled: 2,
    noShow: 2,
    revenueGenerated: '5,940',
  },
  {
    key: '14',
    id: 14,
    name: 'James Michael',
    customerId: 'CUST100259',
    phone: '+91 90123 98765',
    initials: 'JM',
    avatarColor: '#ffedd5',
    avatarTextColor: '#c2410c',
    lastBookingDate: '01 May 2026  06:50 PM',
    status: 'Inactive',
    totalBookings: 7,
    completed: 5,
    cancelled: 1,
    noShow: 1,
    revenueGenerated: '1,320',
  },
];

export const ReportsManagement = () => {
  const { isDarkMode } = useTheme();

  // Filters State
  const [reportType, setReportType] = useState('Customer Report');
  const [customerType, setCustomerType] = useState('All');
  const [bookingType, setBookingType] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Detail Modal State
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtered Data
  const filteredData = useMemo(() => {
    return INITIAL_REPORT_DATA.filter((item) => {
      if (statusFilter !== 'all' && item.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [statusFilter]);

  // Handle Reset
  const handleReset = () => {
    setReportType('Customer Report');
    setCustomerType('All');
    setBookingType('All');
    setStatusFilter('all');
    message.info('Filters have been reset.');
  };

  // Handle Export
  const handleExport = () => {
    message.success('Exporting report as Excel spreadsheet...');
  };

  // Action Menu Dropdown
  const getActionMenu = (record) => ({
    items: [
      {
        key: 'view',
        icon: <EyeOutlined />,
        label: 'View Full Customer History',
        onClick: () => {
          setSelectedCustomer(record);
          setIsModalOpen(true);
        },
      },
      {
        key: 'download',
        icon: <DownloadOutlined />,
        label: 'Download Customer Statement',
        onClick: () => message.success(`Downloading statement for ${record.name}...`),
      },
    ],
  });

  // Table Columns
  const columns = [
    {
      title: 'Customer Name',
      key: 'name',
      width: 190,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: record.avatarColor,
              color: record.avatarTextColor,
              fontWeight: 800,
              fontSize: 12,
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
      render: (id) => (
        <span style={{ fontWeight: 700, color: '#4f46e5', letterSpacing: '0.2px' }}>
          {id}
        </span>
      ),
    },
    {
      title: (
        <span>
          Last Booking Date <span style={{ color: '#4f46e5' }}>⇅</span>
        </span>
      ),
      dataIndex: 'lastBookingDate',
      key: 'lastBookingDate',
      width: 180,
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
        const isActive = status === 'Active';
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '2px 10px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              backgroundColor: isActive
                ? isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#eaf8ef'
                : isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fdeeed',
              color: isActive ? '#00bf62' : '#e11d48',
            }}
          >
            <span>●</span>
            <span>{status}</span>
          </span>
        );
      },
    },
    {
      title: 'Total Bookings',
      dataIndex: 'totalBookings',
      key: 'totalBookings',
      width: 130,
      align: 'center',
      render: (val) => (
        <span style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
          {val}
        </span>
      ),
    },
    {
      title: 'Completed',
      dataIndex: 'completed',
      key: 'completed',
      width: 110,
      align: 'center',
      render: (val) => (
        <span style={{ fontWeight: 700, color: '#00bf62' }}>
          {val}
        </span>
      ),
    },
    {
      title: 'Cancelled',
      dataIndex: 'cancelled',
      key: 'cancelled',
      width: 110,
      align: 'center',
      render: (val) => (
        <span style={{ fontWeight: 700, color: '#ef4444' }}>
          {val}
        </span>
      ),
    },
    {
      title: 'No Show',
      dataIndex: 'noShow',
      key: 'noShow',
      width: 110,
      align: 'center',
      render: (val) => (
        <span style={{ fontWeight: 700, color: '#f59e0b' }}>
          {val}
        </span>
      ),
    },
    {
      title: 'Revenue Generated',
      dataIndex: 'revenueGenerated',
      key: 'revenueGenerated',
      width: 160,
      render: (val) => (
        <span style={{ fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
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
            onClick={() => {
              setSelectedCustomer(record);
              setIsModalOpen(true);
            }}
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
    <div style={{ maxWidth: 1400, margin: '0 auto', paddingBottom: 30 }}>
      {/* 1. TOP FILTERS BAR */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', flex: 1 }}>
            {/* Report Type */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: isDarkMode ? '#888888' : '#64748b', marginBottom: 4 }}>
                Report Type
              </div>
              <Select value={reportType} onChange={setReportType} style={{ width: 170 }}>
                <Option value="Customer Report">Customer Report</Option>
                <Option value="Gym Performance Report">Gym Performance Report</Option>
                <Option value="Revenue Report">Revenue Report</Option>
                <Option value="Booking Summary Report">Booking Summary Report</Option>
              </Select>
            </div>

            {/* Date Range */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: isDarkMode ? '#888888' : '#64748b', marginBottom: 4 }}>
                Date Range
              </div>
              <RangePicker
                format="DD MMM YYYY"
                placeholder={['21 May 2026', '20 Jun 2026']}
                style={{ borderRadius: 'var(--radius-base)', width: 230 }}
              />
            </div>

            {/* Customer Type */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: isDarkMode ? '#888888' : '#64748b', marginBottom: 4 }}>
                Customer Type
              </div>
              <Select value={customerType} onChange={setCustomerType} style={{ width: 130 }}>
                <Option value="All">All</Option>
                <Option value="New">New</Option>
                <Option value="Returning">Returning</Option>
                <Option value="VIP">VIP</Option>
              </Select>
            </div>

            {/* Booking Type */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: isDarkMode ? '#888888' : '#64748b', marginBottom: 4 }}>
                Booking Type
              </div>
              <Select value={bookingType} onChange={setBookingType} style={{ width: 130 }}>
                <Option value="All">All</Option>
                <Option value="App Booking">App Booking</Option>
                <Option value="Walk-in">Walk-in</Option>
              </Select>
            </div>

            {/* Status */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: isDarkMode ? '#888888' : '#64748b', marginBottom: 4 }}>
                Status
              </div>
              <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 130 }}>
                <Option value="all">All Status</Option>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </div>

            {/* Reset Button */}
            <div style={{ marginTop: 20 }}>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
                style={{
                  borderRadius: 'var(--radius-base)',
                  fontWeight: 600,
                  borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                }}
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Export to Excel on Right */}
          <div style={{ marginTop: 20 }}>
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              onClick={handleExport}
              style={{
                borderRadius: 'var(--radius-base)',
                fontWeight: 700,
                backgroundColor: '#4f46e5',
                borderColor: '#4f46e5',
              }}
            >
              Export to Excel
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. TOP 5 KPI METRIC CARDS (IN ONE LINE) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Total Customers */}
        <Card
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-color)',
            borderRadius: 'var(--radius-base)',
          }}
          styles={{ body: { padding: '16px 14px' } }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.15)' : '#f3effe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <TeamOutlined style={{ fontSize: 20, color: '#6366f1' }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Total Customers
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                12,486
              </div>
            </div>
          </div>
        </Card>

        {/* Active Customers */}
        <Card
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-color)',
            borderRadius: 'var(--radius-base)',
          }}
          styles={{ body: { padding: '16px 14px' } }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#eaf8ef',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <UserOutlined style={{ fontSize: 20, color: '#00bf62' }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Active Customers
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                8,756
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#00bf62' }}>
                70.15%
              </div>
            </div>
          </div>
        </Card>

        {/* Inactive Customers */}
        <Card
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-color)',
            borderRadius: 'var(--radius-base)',
          }}
          styles={{ body: { padding: '16px 14px' } }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fdeeed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <TeamOutlined style={{ fontSize: 20, color: '#ef4444' }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Inactive Customers
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                3,730
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444' }}>
                29.85%
              </div>
            </div>
          </div>
        </Card>

        {/* Total Bookings */}
        <Card
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-color)',
            borderRadius: 'var(--radius-base)',
          }}
          styles={{ body: { padding: '16px 14px' } }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : '#edf4fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CalendarOutlined style={{ fontSize: 20, color: '#3b82f6' }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Total Bookings
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                32,845
              </div>
            </div>
          </div>
        </Card>

        {/* Revenue Generated */}
        <Card
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-color)',
            borderRadius: 'var(--radius-base)',
          }}
          styles={{ body: { padding: '16px 14px' } }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.15)' : '#f3effe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 900, color: '#6366f1' }}>₹</span>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Revenue Generated
              </div>
              <div style={{ fontSize: 17, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0', whiteSpace: 'nowrap' }}>
                ₹ 18,75,430
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. REPORT DATA TABLE */}
      <Card
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-color)',
          borderRadius: 'var(--radius-base)',
          marginBottom: 16,
        }}
        styles={{ body: { padding: 0 } }}
      >
        {/* Table Top Header */}
        <div style={{ padding: '20px 24px 16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Customer Report</span>
              <InfoCircleOutlined style={{ fontSize: 14, color: isDarkMode ? '#888888' : '#64748b' }} />
            </div>
            <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2 }}>
              List of customers with their booking summary and revenue details.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>
              Showing 1 to {filteredData.length} of 12,486 entries
            </span>
            <Pagination current={currentPage} total={12486} pageSize={pageSize} onChange={setCurrentPage} size="small" />
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={false}
          rowKey="key"
          scroll={{ x: 1350 }}
        />
      </Card>

      {/* 4. BOTTOM PAGINATION BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 4px', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: isDarkMode ? '#888888' : '#64748b' }}>
          <span>Rows per page:</span>
          <Select value={pageSize} onChange={setPageSize} style={{ width: 80 }} size="small">
            <Option value={10}>10</Option>
            <Option value={25}>25</Option>
            <Option value={50}>50</Option>
          </Select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b' }}>
            Showing 1 to {filteredData.length} of 12,486 entries
          </span>
          <Pagination current={currentPage} total={12486} pageSize={pageSize} onChange={setCurrentPage} />
        </div>
      </div>

      {/* CUSTOMER REPORT DETAILS MODAL */}
      <Modal
        title={<span style={{ fontWeight: 800 }}>Customer Performance Ledger</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsModalOpen(false)} style={{ backgroundColor: '#4f46e5' }}>
            Close
          </Button>,
        ]}
        centered
      >
        {selectedCustomer && (
          <div style={{ paddingTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: selectedCustomer.avatarColor,
                  color: selectedCustomer.avatarTextColor,
                  fontWeight: 800,
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selectedCustomer.initials}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {selectedCustomer.name}
                </div>
                <div style={{ fontSize: 12, color: '#4f46e5', fontWeight: 700 }}>
                  {selectedCustomer.customerId}
                </div>
              </div>
            </div>

            <div style={{ padding: '14px', backgroundColor: isDarkMode ? '#141414' : '#f8fafc', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: isDarkMode ? '#888888' : '#64748b' }}>Total Bookings:</span>
                <strong>{selectedCustomer.totalBookings}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: isDarkMode ? '#888888' : '#64748b' }}>Completed Bookings:</span>
                <strong style={{ color: '#00bf62' }}>{selectedCustomer.completed}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: isDarkMode ? '#888888' : '#64748b' }}>Cancelled Bookings:</span>
                <strong style={{ color: '#ef4444' }}>{selectedCustomer.cancelled}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: isDarkMode ? '#888888' : '#64748b' }}>No Show Bookings:</span>
                <strong style={{ color: '#f59e0b' }}>{selectedCustomer.noShow}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`, paddingTop: 8 }}>
                <span style={{ color: isDarkMode ? '#888888' : '#64748b' }}>Total Revenue Generated:</span>
                <strong style={{ color: isDarkMode ? '#ffffff' : '#0f172a', fontSize: 15 }}>₹ {selectedCustomer.revenueGenerated}</strong>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReportsManagement;
