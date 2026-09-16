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
  Radio,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  MoreOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  WalletOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  CreditCardOutlined,
  ReloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useTheme } from '../theme/ThemeContext';

const { Option } = Select;

// Sample Initial Subscriptions Data matching user mockup exactly
const INITIAL_PARTNERS = [
  {
    key: '1',
    id: 1,
    gymName: 'FitZone Gym',
    gymId: 'GYM1001',
    gymLocation: 'Anna Nagar, Chennai',
    logoText: 'FZ',
    logoSub: 'FITZONE GYM',
    subscriptionType: 'Hybrid',
    subscriptionPeriod: 'Monthly',
    startDate: '18 May 2026',
    nextBillingDate: '18 Jun 2026',
    billingAmount: '₹ 2,999.00 / Month',
    paymentMethod: 'UPI',
    autoRenewal: 'Enabled',
    status: 'Active',
    usage: {
      appBookings: 156,
      walkIn: 312,
      totalRevenue: '45,260',
      profileViews: '2,845',
    },
  },
  {
    key: '2',
    id: 2,
    gymName: 'Powerhouse Gym',
    gymId: 'GYM1002',
    gymLocation: 'T. Nagar, Chennai',
    logoText: 'PH',
    logoSub: 'POWERHOUSE',
    subscriptionType: 'App Only',
    subscriptionPeriod: 'Quarterly',
    startDate: '05 May 2026',
    nextBillingDate: '05 Aug 2026',
    billingAmount: '₹ 4,999.00 / Quarter',
    paymentMethod: 'Card',
    autoRenewal: 'Enabled',
    status: 'Active',
    usage: {
      appBookings: 240,
      walkIn: 180,
      totalRevenue: '68,400',
      profileViews: '4,120',
    },
  },
  {
    key: '3',
    id: 3,
    gymName: 'Muscle Factory',
    gymId: 'GYM1003',
    gymLocation: 'Adyar, Chennai',
    logoText: 'MF',
    logoSub: 'MUSCLE FACTORY',
    subscriptionType: 'GMS',
    subscriptionPeriod: 'Annual',
    startDate: '10 Apr 2026',
    nextBillingDate: '10 Apr 2027',
    billingAmount: '₹ 14,999.00 / Year',
    paymentMethod: 'NetBanking',
    autoRenewal: 'Enabled',
    status: 'Active',
    usage: {
      appBookings: 88,
      walkIn: 450,
      totalRevenue: '92,150',
      profileViews: '1,980',
    },
  },
  {
    key: '4',
    id: 4,
    gymName: 'Iron Club',
    gymId: 'GYM1004',
    gymLocation: 'Velachery, Chennai',
    logoText: 'IC',
    logoSub: 'IRON CLUB',
    subscriptionType: 'Listing Only',
    subscriptionPeriod: 'Monthly',
    startDate: '20 May 2026',
    nextBillingDate: '20 Jun 2026',
    billingAmount: '₹ 999.00 / Month',
    paymentMethod: 'UPI',
    autoRenewal: 'Enabled',
    status: 'Active',
    usage: {
      appBookings: 45,
      walkIn: 90,
      totalRevenue: '18,200',
      profileViews: '3,450',
    },
  },
  {
    key: '5',
    id: 5,
    gymName: 'Fitness First',
    gymId: 'GYM1005',
    gymLocation: 'Porur, Chennai',
    logoText: 'FF',
    logoSub: 'FITNESS FIRST',
    subscriptionType: 'Hybrid',
    subscriptionPeriod: 'Half Year',
    startDate: '15 Feb 2026',
    nextBillingDate: '15 Aug 2026',
    billingAmount: '₹ 8,499.00 / 6 Mo',
    paymentMethod: 'UPI',
    autoRenewal: 'Enabled',
    status: 'Active',
    usage: {
      appBookings: 310,
      walkIn: 520,
      totalRevenue: '1,24,000',
      profileViews: '5,600',
    },
  },
  {
    key: '6',
    id: 6,
    gymName: 'Body Garage',
    gymId: 'GYM1006',
    gymLocation: 'OMR, Chennai',
    logoText: 'BG',
    logoSub: 'BODY GARAGE',
    subscriptionType: 'App Only',
    subscriptionPeriod: 'Quarterly',
    startDate: '22 Apr 2026',
    nextBillingDate: '22 Jul 2026',
    billingAmount: '₹ 4,999.00 / Quarter',
    paymentMethod: 'Card',
    autoRenewal: 'Enabled',
    status: 'Active',
    usage: {
      appBookings: 195,
      walkIn: 110,
      totalRevenue: '54,300',
      profileViews: '2,900',
    },
  },
  {
    key: '7',
    id: 7,
    gymName: 'Next Level Fitness',
    gymId: 'GYM1007',
    gymLocation: 'Tambaram, Chennai',
    logoText: 'NL',
    logoSub: 'NEXT LEVEL',
    subscriptionType: 'GMS',
    subscriptionPeriod: 'Annual',
    startDate: '01 Jan 2026',
    nextBillingDate: '01 Jan 2027',
    billingAmount: '₹ 14,999.00 / Year',
    paymentMethod: 'UPI',
    autoRenewal: 'Disabled',
    status: 'Expiring Soon',
    usage: {
      appBookings: 60,
      walkIn: 380,
      totalRevenue: '76,500',
      profileViews: '1,750',
    },
  },
  {
    key: '8',
    id: 8,
    gymName: 'Fitness Pro',
    gymId: 'GYM1008',
    gymLocation: 'Nungambakkam, Chennai',
    logoText: 'FP',
    logoSub: 'FITNESS PRO',
    subscriptionType: 'Hybrid',
    subscriptionPeriod: 'Monthly',
    startDate: '25 May 2026',
    nextBillingDate: '25 Jun 2026',
    billingAmount: '₹ 2,999.00 / Month',
    paymentMethod: 'Card',
    autoRenewal: 'Disabled',
    status: 'Expiring Soon',
    usage: {
      appBookings: 140,
      walkIn: 220,
      totalRevenue: '48,900',
      profileViews: '3,100',
    },
  },
  {
    key: '9',
    id: 9,
    gymName: 'Alpha Fitness',
    gymId: 'GYM1009',
    gymLocation: 'Chromepet, Chennai',
    logoText: 'AF',
    logoSub: 'ALPHA FITNESS',
    subscriptionType: 'Listing Only',
    subscriptionPeriod: 'Quarterly',
    startDate: '28 Mar 2026',
    nextBillingDate: '28 Jun 2026',
    billingAmount: '₹ 2,499.00 / Quarter',
    paymentMethod: 'UPI',
    autoRenewal: 'Disabled',
    status: 'Cancelled',
    usage: {
      appBookings: 20,
      walkIn: 45,
      totalRevenue: '9,800',
      profileViews: '980',
    },
  },
  {
    key: '10',
    id: 10,
    gymName: 'XTREME Gym',
    gymId: 'GYM1010',
    gymLocation: 'Pallikaranai, Chennai',
    logoText: 'XG',
    logoSub: 'XTREME GYM',
    subscriptionType: 'App Only',
    subscriptionPeriod: 'Half Year',
    startDate: '10 Dec 2025',
    nextBillingDate: '10 Jun 2026',
    billingAmount: '₹ 6,999.00 / 6 Mo',
    paymentMethod: 'UPI',
    autoRenewal: 'Disabled',
    status: 'Cancelled',
    usage: {
      appBookings: 80,
      walkIn: 95,
      totalRevenue: '22,400',
      profileViews: '1,450',
    },
  },
];

export const SubscriptionsManagement = () => {
  const { isDarkMode } = useTheme();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selected Partner for details modal
  const [selectedPartner, setSelectedPartner] = useState(INITIAL_PARTNERS[0]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Modals State
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isDowngradeModalOpen, setIsDowngradeModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedPlanOption, setSelectedPlanOption] = useState('Hybrid');

  // Filtered Partners
  const filteredPartners = useMemo(() => {
    return INITIAL_PARTNERS.filter((item) => {
      // Type Filter
      if (typeFilter !== 'all' && item.subscriptionType.toLowerCase() !== typeFilter.toLowerCase()) {
        return false;
      }

      // Period Filter
      if (periodFilter !== 'all' && item.subscriptionPeriod.toLowerCase() !== periodFilter.toLowerCase()) {
        return false;
      }

      // Status Filter
      if (statusFilter !== 'all' && item.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.gymName.toLowerCase().includes(q) || item.gymLocation.toLowerCase().includes(q);
        const matchId = item.gymId.toLowerCase().includes(q);
        if (!matchName && !matchId) return false;
      }

      return true;
    });
  }, [searchQuery, typeFilter, periodFilter, statusFilter]);

  // Handle View
  const handleView = (record) => {
    setSelectedPartner(record);
    setIsDetailsModalOpen(true);
  };

  // Handle Action Dropdown
  const getActionMenu = (record) => ({
    items: [
      {
        key: 'view',
        icon: <EyeOutlined />,
        label: 'View Subscription',
        onClick: () => handleView(record),
      },
      {
        key: 'upgrade',
        icon: <ArrowUpOutlined style={{ color: '#22c55e' }} />,
        label: 'Upgrade Plan',
        onClick: () => {
          setSelectedPartner(record);
          setIsUpgradeModalOpen(true);
        },
      },
      {
        key: 'cancel',
        icon: <CloseCircleOutlined style={{ color: '#ef4444' }} />,
        label: <span style={{ color: '#ef4444' }}>Cancel Subscription</span>,
        onClick: () => {
          setSelectedPartner(record);
          setIsCancelModalOpen(true);
        },
      },
    ],
  });

  // Helper for Subscription Type Tag
  const renderTypeTag = (type) => {
    let bg = isDarkMode ? 'rgba(99, 102, 241, 0.15)' : '#ede9fe';
    let color = '#6366f1';
    if (type === 'App Only') {
      bg = isDarkMode ? 'rgba(59, 130, 246, 0.15)' : '#edf4fe';
      color = '#3b82f6';
    } else if (type === 'GMS') {
      bg = isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#fef4e8';
      color = '#d97706';
    } else if (type === 'Listing Only') {
      bg = isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#eaf8ef';
      color = '#00bf62';
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
        {type}
      </span>
    );
  };

  // Helper for Status Tag
  const renderStatusTag = (status) => {
    let bg = isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#eaf8ef';
    let color = '#00bf62';
    if (status === 'Expiring Soon') {
      bg = isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#fef4e8';
      color = '#d97706';
    } else if (status === 'Cancelled') {
      bg = isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fdeeed';
      color = '#e11d48';
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
  };

  // Table Columns
  const columns = [
    {
      title: 'Partner / Gym Name',
      key: 'gymName',
      width: 240,
      render: (_, record) => (
        <div
          onClick={() => handleView(record)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 6,
              backgroundColor: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {record.logoText}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', fontSize: 13 }}>
              {record.gymName}
            </div>
            <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
              <EnvironmentOutlined style={{ fontSize: 10, color: '#6366f1' }} />
              <span>{record.gymLocation}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Gym ID',
      dataIndex: 'gymId',
      key: 'gymId',
      width: 120,
      render: (text, record) => (
        <span
          onClick={() => handleView(record)}
          style={{ fontWeight: 700, color: '#4f46e5', letterSpacing: '0.2px', cursor: 'pointer' }}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Subscription Type',
      dataIndex: 'subscriptionType',
      key: 'subscriptionType',
      width: 170,
      render: (type) => renderTypeTag(type),
    },
    {
      title: 'Subscription Period',
      dataIndex: 'subscriptionPeriod',
      key: 'subscriptionPeriod',
      width: 160,
      render: (text) => (
        <span style={{ color: isDarkMode ? '#cbd5e1' : '#334155', fontSize: 13 }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 140,
      render: (text) => (
        <span style={{ fontSize: 13, color: isDarkMode ? '#cbd5e1' : '#334155' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Next Billing Date',
      dataIndex: 'nextBillingDate',
      key: 'nextBillingDate',
      width: 150,
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
      width: 140,
      render: (status) => renderStatusTag(status),
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
            onClick={() => handleView(record)}
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
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* 1. TOP 5 METRIC CARDS (IN ONE LINE) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Total Partners */}
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
                Total Partners
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                742
              </div>
              <div style={{ fontSize: 11, color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                All time
              </div>
            </div>
          </div>
        </Card>

        {/* Active Subscriptions */}
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
              <TeamOutlined style={{ fontSize: 20, color: '#00bf62' }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Active Subscriptions
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                612
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#00bf62' }}>
                82.48%
              </div>
            </div>
          </div>
        </Card>

        {/* Expiring Soon */}
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
                backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#fef4e8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ClockCircleOutlined style={{ fontSize: 20, color: '#f59e0b' }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Expiring Soon
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                58
              </div>
              <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>7.82%</span>
                <span style={{ fontSize: 9, padding: '1px 4px', borderRadius: 4, backgroundColor: isDarkMode ? 'rgba(245,158,11,0.2)' : '#fef3c7' }}>7 days</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Cancelled */}
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
              <CloseCircleOutlined style={{ fontSize: 20, color: '#ef4444' }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Cancelled
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                72
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444' }}>
                9.70%
              </div>
            </div>
          </div>
        </Card>

        {/* Total Subscription Revenue */}
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
              <WalletOutlined style={{ fontSize: 20, color: '#6366f1' }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Total Revenue
              </div>
              <div style={{ fontSize: 17, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0', whiteSpace: 'nowrap' }}>
                ₹ 28,75,430
              </div>
              <div style={{ fontSize: 11, color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                All time
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 2. FULL-WIDTH PARTNERS TABLE & FILTERS */}
      <Card
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-color)',
          borderRadius: 'var(--radius-base)',
          marginBottom: 16,
        }}
        styles={{ body: { padding: '14px 18px' } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Input
            placeholder="Search by partner name, gym ID..."
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, minWidth: 220, borderRadius: 'var(--radius-base)' }}
            allowClear
          />

          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: 180 }}
          >
            <Option value="all">All Subscription Types</Option>
            <Option value="hybrid">Hybrid</Option>
            <Option value="app only">App Only</Option>
            <Option value="gms">GMS</Option>
            <Option value="listing only">Listing Only</Option>
          </Select>

          <Select
            value={periodFilter}
            onChange={setPeriodFilter}
            style={{ width: 140 }}
          >
            <Option value="all">All Periods</Option>
            <Option value="monthly">Monthly</Option>
            <Option value="quarterly">Quarterly</Option>
            <Option value="half year">Half Year</Option>
            <Option value="annual">Annual</Option>
          </Select>

          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 140 }}
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="expiring soon">Expiring Soon</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-color)',
          borderRadius: 'var(--radius-base)',
          marginBottom: 16,
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Table
          columns={columns}
          dataSource={filteredPartners}
          pagination={false}
          rowKey="key"
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b' }}>
          Showing 1 to {filteredPartners.length} of 742 partners
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Pagination current={currentPage} total={742} pageSize={pageSize} onChange={setCurrentPage} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: isDarkMode ? '#888888' : '#64748b' }}>
            <span>Rows per page:</span>
            <Select value={pageSize} onChange={setPageSize} style={{ width: 75 }} size="small">
              <Option value={10}>10</Option>
              <Option value={25}>25</Option>
              <Option value={50}>50</Option>
            </Select>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          3. PARTNER / SUBSCRIPTION DETAILS POPUP MODAL
         ------------------------------------------------------------- */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 17, fontWeight: 800 }}>
            <WalletOutlined style={{ color: '#4f46e5' }} />
            <span>Partner / Subscription Details</span>
          </div>
        }
        open={isDetailsModalOpen}
        onCancel={() => setIsDetailsModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsDetailsModalOpen(false)} style={{ backgroundColor: '#4f46e5', minWidth: 90 }}>
            Close
          </Button>,
        ]}
        width={720}
        centered
      >
        {selectedPartner && (
          <div style={{ paddingTop: 10 }}>
            {/* Gym Banner Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 18px',
                backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
                borderRadius: 12,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 8,
                  backgroundColor: '#0a0a0a',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 900 }}>{selectedPartner.logoText}</span>
                <span style={{ fontSize: 7, fontWeight: 700, color: '#94a3b8', marginTop: 2 }}>{selectedPartner.logoSub.split(' ')[0]}</span>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 800, fontSize: 16, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    {selectedPartner.gymName}
                  </span>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 700,
                      backgroundColor: selectedPartner.status === 'Active'
                        ? isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#eaf8ef'
                        : isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fdeeed',
                      color: selectedPartner.status === 'Active' ? '#00bf62' : '#e11d48',
                    }}
                  >
                    ● {selectedPartner.status}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '3px 0' }}>
                  <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>Gym ID</span>
                  <span style={{ fontWeight: 700, color: '#4f46e5', fontSize: 13 }}>{selectedPartner.gymId}</span>
                </div>

                <div style={{ fontSize: 12, color: isDarkMode ? '#cbd5e1' : '#334155', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <EnvironmentOutlined style={{ color: '#6366f1', fontSize: 11 }} />
                  <span>{selectedPartner.gymLocation}</span>
                </div>
              </div>
            </div>

            {/* Section 1: Subscription Information */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 10 }}>
                Subscription Information
              </div>

              <div
                style={{
                  padding: '14px 16px',
                  border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`,
                  borderRadius: 10,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CalendarOutlined style={{ color: '#6366f1' }} /> Subscription Type
                  </span>
                  {renderTypeTag(selectedPartner.subscriptionType)}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ClockCircleOutlined style={{ color: '#6366f1' }} /> Subscription Period
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    {selectedPartner.subscriptionPeriod}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CalendarOutlined style={{ color: '#6366f1' }} /> Start Date
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    {selectedPartner.startDate}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CalendarOutlined style={{ color: '#6366f1' }} /> Next Billing Date
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    {selectedPartner.nextBillingDate}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <DollarOutlined style={{ color: '#6366f1' }} /> Billing Amount
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    {selectedPartner.billingAmount}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CreditCardOutlined style={{ color: '#6366f1' }} /> Payment Method
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#e2e8f0' : '#1e293b' }}>
                    {selectedPartner.paymentMethod}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gridColumn: 'span 2' }}>
                  <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ReloadOutlined style={{ color: '#6366f1' }} /> Auto Renewal
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: selectedPartner.autoRenewal === 'Enabled' ? '#00bf62' : '#ef4444' }}>
                    {selectedPartner.autoRenewal}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Usage Summary (This Period) */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 10 }}>
                Usage Summary (This Period)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                <div
                  style={{
                    padding: '12px 10px',
                    borderRadius: 8,
                    border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', fontWeight: 600 }}>App Bookings</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', marginTop: 4 }}>
                    {selectedPartner.usage.appBookings}
                  </div>
                </div>

                <div
                  style={{
                    padding: '12px 10px',
                    borderRadius: 8,
                    border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', fontWeight: 600 }}>Walk-in (GMS)</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', marginTop: 4 }}>
                    {selectedPartner.usage.walkIn}
                  </div>
                </div>

                <div
                  style={{
                    padding: '12px 10px',
                    borderRadius: 8,
                    border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', fontWeight: 600 }}>Total Revenue</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', marginTop: 4 }}>
                    ₹ {selectedPartner.usage.totalRevenue}
                  </div>
                </div>

                <div
                  style={{
                    padding: '12px 10px',
                    borderRadius: 8,
                    border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', fontWeight: 600 }}>Profile Views</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', marginTop: 4 }}>
                    {selectedPartner.usage.profileViews}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Manage Subscription */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 10 }}>
                Manage Subscription
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
                <Button
                  type="primary"
                  icon={<ArrowUpOutlined />}
                  onClick={() => setIsUpgradeModalOpen(true)}
                  style={{
                    borderRadius: 'var(--radius-base)',
                    fontWeight: 700,
                    backgroundColor: '#16a34a',
                    borderColor: '#16a34a',
                  }}
                >
                  Upgrade Plan
                </Button>

                <Button
                  icon={<ArrowDownOutlined />}
                  onClick={() => setIsDowngradeModalOpen(true)}
                  style={{
                    borderRadius: 'var(--radius-base)',
                    fontWeight: 700,
                    color: '#4f46e5',
                    borderColor: isDarkMode ? '#3730a3' : '#c7d2fe',
                  }}
                >
                  Downgrade Plan
                </Button>

                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => setIsCancelModalOpen(true)}
                  style={{
                    borderRadius: 'var(--radius-base)',
                    fontWeight: 700,
                  }}
                >
                  Cancel Subscription
                </Button>
              </div>

              {/* Cancellation Alert Notice */}
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
                  border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.2)' : '#bfdbfe'}`,
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                }}
              >
                <InfoCircleOutlined style={{ color: '#3b82f6', fontSize: 14, marginTop: 2, flexShrink: 0 }} />
                <div style={{ fontSize: 11, color: isDarkMode ? '#93c5fd' : '#1e40af', lineHeight: 1.4 }}>
                  Cancelling the subscription will stop automatic renewals. Your services will remain active until {selectedPartner.nextBillingDate}.
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* -------------------------------------------------------------
          MODALS: UPGRADE / DOWNGRADE / CANCEL
         ------------------------------------------------------------- */}
      {/* UPGRADE PLAN MODAL */}
      <Modal
        title={<span style={{ fontWeight: 800 }}>Upgrade Subscription Plan</span>}
        open={isUpgradeModalOpen}
        onCancel={() => setIsUpgradeModalOpen(false)}
        onOk={() => {
          message.success(`Upgraded ${selectedPartner?.gymName} to ${selectedPlanOption} Plan successfully!`);
          setIsUpgradeModalOpen(false);
        }}
        okText="Confirm Upgrade"
        okButtonProps={{ style: { backgroundColor: '#16a34a' } }}
        centered
      >
        <div style={{ paddingTop: 12 }}>
          <p style={{ color: isDarkMode ? '#cbd5e1' : '#334155' }}>
            Select the new tier to upgrade <strong>{selectedPartner?.gymName}</strong> ({selectedPartner?.gymId}):
          </p>

          <Radio.Group
            value={selectedPlanOption}
            onChange={(e) => setSelectedPlanOption(e.target.value)}
            style={{ width: '100%', marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            <Radio value="Hybrid" style={{ padding: '10px 14px', border: `1px solid ${isDarkMode ? '#262626' : '#e2e8f0'}`, borderRadius: 8 }}>
              <strong>Hybrid Tier (₹ 2,999/mo)</strong> — Full GMS Software + GYMEZY App Listings
            </Radio>
            <Radio value="Enterprise" style={{ padding: '10px 14px', border: `1px solid ${isDarkMode ? '#262626' : '#e2e8f0'}`, borderRadius: 8 }}>
              <strong>Enterprise Pro (₹ 5,999/mo)</strong> — Multi-Branch + Priority Customer Placement
            </Radio>
          </Radio.Group>
        </div>
      </Modal>

      {/* DOWNGRADE PLAN MODAL */}
      <Modal
        title={<span style={{ fontWeight: 800 }}>Downgrade Subscription Plan</span>}
        open={isDowngradeModalOpen}
        onCancel={() => setIsDowngradeModalOpen(false)}
        onOk={() => {
          message.warning(`Downgraded ${selectedPartner?.gymName} plan.`);
          setIsDowngradeModalOpen(false);
        }}
        okText="Confirm Downgrade"
        centered
      >
        <div style={{ paddingTop: 12 }}>
          <p style={{ color: isDarkMode ? '#cbd5e1' : '#334155' }}>
            Choose lower tier for <strong>{selectedPartner?.gymName}</strong>:
          </p>
          <Radio.Group
            value={selectedPlanOption}
            onChange={(e) => setSelectedPlanOption(e.target.value)}
            style={{ width: '100%', marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            <Radio value="App Only" style={{ padding: '10px 14px', border: `1px solid ${isDarkMode ? '#262626' : '#e2e8f0'}`, borderRadius: 8 }}>
              <strong>App Only (₹ 1,499/mo)</strong> — Receive app bookings only
            </Radio>
            <Radio value="Listing Only" style={{ padding: '10px 14px', border: `1px solid ${isDarkMode ? '#262626' : '#e2e8f0'}`, borderRadius: 8 }}>
              <strong>Listing Only (₹ 999/mo)</strong> — Directory discoverability only
            </Radio>
          </Radio.Group>
        </div>
      </Modal>

      {/* CANCEL SUBSCRIPTION MODAL */}
      <Modal
        title={<span style={{ fontWeight: 800, color: '#ef4444' }}>Cancel Subscription</span>}
        open={isCancelModalOpen}
        onCancel={() => setIsCancelModalOpen(false)}
        onOk={() => {
          message.error(`Subscription for ${selectedPartner?.gymName} cancelled.`);
          setIsCancelModalOpen(false);
        }}
        okText="Yes, Cancel Subscription"
        okButtonProps={{ danger: true }}
        centered
      >
        <p style={{ paddingTop: 12, color: isDarkMode ? '#cbd5e1' : '#334155' }}>
          Are you sure you want to cancel the subscription for <strong>{selectedPartner?.gymName}</strong>? Automatic renewal will be disabled immediately.
        </p>
      </Modal>
    </div>
  );
};

export default SubscriptionsManagement;
