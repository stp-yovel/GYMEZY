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
  TeamOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MoreOutlined,
  EyeOutlined,
  PhoneOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
  SafetyCertificateOutlined,
  InfoCircleOutlined,
  DownOutlined,
  RiseOutlined,
  EditOutlined,
  DownloadOutlined,
  DeleteOutlined,
  CameraOutlined,
  SaveOutlined,
  CheckCircleFilled,
  BarcodeOutlined,
  MobileOutlined,
  CrownOutlined,
  IdcardOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import confetti from 'canvas-confetti';
import { useTheme } from '../../theme/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Exact Mockup Dataset Matching User Reference
export const INITIAL_MEMBERS = [
  {
    key: '1',
    memberId: 'MEM0001',
    name: 'Arun Kumar',
    phone: '+91 98765 43210',
    email: 'arun.kumar@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
    plan: 'Gold (3 Months)',
    startDate: '21 Apr 2025',
    expiryDate: '20 Jul 2025',
    daysLeft: '3 days left',
    status: 'Active',
    paymentType: 'Online',
    amount: '₹4,499',
  },
  {
    key: '2',
    memberId: 'MEM0002',
    name: 'Priya Sharma',
    phone: '+91 91234 56789',
    email: 'priya.sharma@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    plan: 'Platinum (6 Months)',
    startDate: '10 Feb 2025',
    expiryDate: '09 Aug 2025',
    daysLeft: '23 days left',
    status: 'Active',
    paymentType: 'GPay',
    amount: '₹7,999',
  },
  {
    key: '3',
    memberId: 'MEM0003',
    name: 'Vikram Singh',
    phone: '+91 99876 54321',
    email: 'vikram.singh@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    plan: 'Silver (1 Month)',
    startDate: '01 Jul 2025',
    expiryDate: '31 Jul 2025',
    daysLeft: '14 days left',
    status: 'Active',
    paymentType: 'Cash',
    amount: '₹1,599',
  },
  {
    key: '4',
    memberId: 'MEM0004',
    name: 'Neha Reddy',
    phone: '+91 90012 34567',
    email: 'neha.reddy@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    plan: 'Gold (3 Months)',
    startDate: '15 Apr 2025',
    expiryDate: '14 Jul 2025',
    daysLeft: 'Expired',
    status: 'Expired',
    paymentType: 'Online',
    amount: '₹4,499',
  },
  {
    key: '5',
    memberId: 'MEM0005',
    name: 'Karthik R',
    phone: '+91 98811 22334',
    email: 'karthik.r@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    plan: 'Platinum (6 Months)',
    startDate: '05 Jan 2025',
    expiryDate: '04 Jul 2025',
    daysLeft: 'Expired',
    status: 'Expired',
    paymentType: 'GPay',
    amount: '₹7,999',
  },
  {
    key: '6',
    memberId: 'MEM0006',
    name: 'Sneha Iyer',
    phone: '+91 93412 66778',
    email: 'sneha.iyer@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
    plan: 'Silver (1 Month)',
    startDate: '20 Jul 2025',
    expiryDate: '19 Aug 2025',
    daysLeft: '33 days left',
    status: 'Active',
    paymentType: 'Online',
    amount: '₹1,599',
  },
  {
    key: '7',
    memberId: 'MEM0007',
    name: 'Rahul Nair',
    phone: '+91 90909 11223',
    email: 'rahul.nair@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop',
    plan: 'Gold (3 Months)',
    startDate: '28 May 2025',
    expiryDate: '27 Aug 2025',
    daysLeft: '41 days left',
    status: 'Active',
    paymentType: 'COD',
    amount: '₹4,499',
  },
];

// Canvas Confetti Popper Trigger
export const triggerConfettiPopper = () => {
  try {
    const end = Date.now() + 1.2 * 1000;
    const colors = ['#722ed1', '#003882', '#00bf62', '#fa8c16', '#eb2f96', '#1677ff'];

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.65 },
        colors: colors,
        zIndex: 99999,
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.65 },
        colors: colors,
        zIndex: 99999,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Center burst
    confetti({
      particleCount: 70,
      spread: 90,
      origin: { y: 0.5 },
      colors: colors,
      zIndex: 99999,
    });
  } catch (err) {
    console.error('Confetti error:', err);
  }
};

/**
 * Reusable Membership Management Component
 */
export const MembersManagement = ({
  initialData = INITIAL_MEMBERS,
  onAddMember,
  onExtendMembership,
}) => {
  const { isDarkMode } = useTheme();
  const [form] = Form.useForm();
  const [extendForm] = Form.useForm();

  const [membersList, setMembersList] = useState(initialData);
  const [namePhoneSearch, setNamePhoneSearch] = useState('');
  const [memberIdSearch, setMemberIdSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState('21 Jul 2025 - 21 Jul 2025');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [addedMemberData, setAddedMemberData] = useState(null);
  const [tempDateRange, setTempDateRange] = useState(null);

  // Add Member Form Interactive States
  const [addMemberPhoto, setAddMemberPhoto] = useState(null);
  const [selectedPlanType, setSelectedPlanType] = useState('Platinum (6 Months)');
  const [selectedPaymentType, setSelectedPaymentType] = useState('Online');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // Filter Logic
  const filteredMembers = membersList.filter((item) => {
    const matchNamePhone =
      !namePhoneSearch ||
      item.name.toLowerCase().includes(namePhoneSearch.toLowerCase()) ||
      item.phone.includes(namePhoneSearch);

    const matchMemberId =
      !memberIdSearch ||
      item.memberId.toLowerCase().includes(memberIdSearch.toLowerCase());

    const matchPlan = planFilter === 'ALL' || item.plan.includes(planFilter);
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;

    return matchNamePhone && matchMemberId && matchPlan && matchStatus;
  });

  const clearFilters = () => {
    setNamePhoneSearch('');
    setMemberIdSearch('');
    setPlanFilter('ALL');
    setStatusFilter('ALL');
    setSelectedDateRange('21 Jul 2025 - 21 Jul 2025');
    message.info('Filters cleared');
  };

  const handleView = (record) => {
    setSelectedMember(record);
    setIsViewModalOpen(true);
  };

  const handleOpenExtend = (record) => {
    setSelectedMember(record);
    extendForm.setFieldsValue({
      plan: record.plan,
      duration: '3 Months',
      amount: record.amount.replace('₹', ''),
      paymentType: 'Online',
    });
    setIsExtendModalOpen(true);
  };

  const handleAddMemberSubmit = (values) => {
    const plan = selectedPlanType || values.plan || 'Platinum (6 Months)';
    const amountMap = {
      'Silver (1 Month)': '₹1,599',
      'Gold (3 Months)': '₹4,499',
      'Platinum (6 Months)': '₹7,999',
      'Annual (12 Months)': '₹14,999',
    };
    const daysMap = {
      'Silver (1 Month)': '30 days left',
      'Gold (3 Months)': '90 days left',
      'Platinum (6 Months)': '180 days left',
      'Annual (12 Months)': '365 days left',
    };
    const expiryMap = {
      'Silver (1 Month)': '21 Aug 2025',
      'Gold (3 Months)': '21 Oct 2025',
      'Platinum (6 Months)': '21 Jan 2026',
      'Annual (12 Months)': '21 Jul 2026',
    };

    const newMember = {
      key: Date.now().toString(),
      memberId: `MEM000${membersList.length + 1}`,
      name: values.name,
      phone: `${values.countryCode || '+91'} ${values.phone}`,
      email: `${values.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      avatar:
        addMemberPhoto ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      plan: plan,
      startDate: '21 Jul 2025',
      expiryDate: expiryMap[plan] || '21 Oct 2025',
      daysLeft: daysMap[plan] || '90 days left',
      status: 'Active',
      paymentType: selectedPaymentType || 'Online',
      amount: amountMap[plan] || '₹4,499',
    };

    const updated = [newMember, ...membersList];
    setMembersList(updated);
    setIsAddModalOpen(false);
    form.resetFields();
    setAddMemberPhoto(null);

    // Save for Success Modal & Launch Canvas Confetti Popper
    setAddedMemberData(newMember);
    setIsSuccessModalOpen(true);
    triggerConfettiPopper();

    if (onAddMember) onAddMember(newMember);
  };

  const handleExtendSubmit = (values) => {
    if (!selectedMember) return;
    const updated = membersList.map((m) => {
      if (m.key === selectedMember.key) {
        return {
          ...m,
          expiryDate: '20 Oct 2025',
          daysLeft: '90 days left',
          status: 'Active',
        };
      }
      return m;
    });
    setMembersList(updated);
    setIsExtendModalOpen(false);
    setIsViewModalOpen(false);
    message.success(`Membership for ${selectedMember.name} extended successfully!`);
    if (onExtendMembership) onExtendMembership(selectedMember.key, values);
  };

  // Date Range Dropdown Menu
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
      label: 'View Member Details',
      icon: <EyeOutlined />,
      onClick: () => handleView(record),
    },
    {
      key: 'extend',
      label: 'Extend Membership',
      icon: <CalendarOutlined style={{ color: 'var(--color-primary)' }} />,
      onClick: () => handleOpenExtend(record),
    },
    {
      key: 'receipt',
      label: 'Download Invoice',
      icon: <DownloadOutlined />,
      onClick: () => message.success(`Invoice for ${record.memberId} downloaded.`),
    },
    { type: 'divider' },
    {
      key: 'delete',
      label: 'Cancel Membership',
      icon: <DeleteOutlined style={{ color: '#ef4444' }} />,
      onClick: () => {
        setMembersList(membersList.map((m) => (m.key === record.key ? { ...m, status: 'Expired', daysLeft: 'Expired' } : m)));
        message.warning(`Membership for ${record.name} marked as expired.`);
      },
    },
  ];

  const columns = [
    {
      title: 'Member ID',
      dataIndex: 'memberId',
      key: 'memberId',
      render: (text) => (
        <span style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', fontSize: 13 }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Member Name',
      key: 'memberName',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar src={record.avatar} size={38} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 650, color: isDarkMode ? '#ffffff' : '#0f172a', fontSize: 13 }}>
              {record.name}
            </div>
            <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', marginTop: 1 }}>
              {record.phone}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => (
        <span style={{ color: isDarkMode ? '#cccccc' : '#334155', fontSize: 13, fontWeight: 500 }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Membership Plan',
      dataIndex: 'plan',
      key: 'plan',
      render: (plan) => (
        <Tag
          style={{
            backgroundColor: isDarkMode ? 'rgba(114, 46, 209, 0.2)' : '#f3effe',
            color: isDarkMode ? '#b37feb' : '#722ed1',
            border: 'none',
            borderRadius: 'var(--radius-base)',
            fontWeight: 600,
            fontSize: 11,
            padding: '2px 10px',
          }}
        >
          {plan}
        </Tag>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => (
        <span style={{ fontSize: 13, color: isDarkMode ? '#ffffff' : '#0f172a', fontWeight: 500 }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Expiry Date',
      key: 'expiryDate',
      render: (_, record) => {
        const isExpired = record.status === 'Expired' || record.daysLeft === 'Expired';
        return (
          <div>
            <div style={{ fontSize: 13, color: isDarkMode ? '#ffffff' : '#0f172a', fontWeight: 500 }}>
              {record.expiryDate}
            </div>
            <div
              style={{
                fontSize: 11,
                color: isExpired ? '#e11d48' : '#fa8c16',
                fontWeight: 600,
                marginTop: 1,
              }}
            >
              ({record.daysLeft})
            </div>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const isActive = status === 'Active';
        return (
          <Tag
            style={{
              backgroundColor: isActive
                ? isDarkMode
                  ? 'rgba(0, 191, 98, 0.15)'
                  : '#eaf8ef'
                : isDarkMode
                ? 'rgba(225, 29, 72, 0.15)'
                : '#fdeeed',
              color: isActive ? '#00bf62' : '#e11d48',
              border: 'none',
              borderRadius: 'var(--radius-base)',
              fontWeight: 600,
              fontSize: 11,
              padding: '2px 10px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Payment Type',
      dataIndex: 'paymentType',
      key: 'paymentType',
      render: (text) => (
        <span style={{ fontSize: 13, color: isDarkMode ? '#cccccc' : '#334155', fontWeight: 500 }}>
          {text}
        </span>
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
      title: 'Action',
      key: 'action',
      width: 140,
      render: (_, record) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, width: 124 }}>
          <Button
            size="small"
            onClick={() => handleView(record)}
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
            View
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
      ),
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
            Membership Management
          </Title>
          <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 14 }}>
            Manage all gym member subscriptions and details.
          </Text>
        </div>

        {/* Add New Member Button */}
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
          Add New Member
        </Button>
      </div>

      {/* 4 SUMMARY STAT CARDS */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Card 1: Total Members */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
              boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: isDarkMode ? 'rgba(114, 46, 209, 0.2)' : '#f3effe',
                  color: isDarkMode ? '#b37feb' : '#722ed1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                <TeamOutlined />
              </div>
              <div>
                <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', fontWeight: 500 }}>
                  Total Members
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, marginTop: 2 }}>
                  248
                </div>
                <div style={{ fontSize: 12, color: '#00bf62', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <RiseOutlined /> 12% vs last month
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 2: Active Members */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
              boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: isDarkMode ? 'rgba(0, 191, 98, 0.2)' : '#eaf8ef',
                  color: '#00bf62',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                <CheckCircleOutlined />
              </div>
              <div>
                <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', fontWeight: 500 }}>
                  Active Members
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, marginTop: 2 }}>
                  186
                </div>
                <div style={{ fontSize: 12, color: '#00bf62', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <RiseOutlined /> 8% vs last month
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 3: Expiring This Month */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
              boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: isDarkMode ? 'rgba(250, 140, 22, 0.2)' : '#fef4e8',
                  color: '#fa8c16',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                <ClockCircleOutlined />
              </div>
              <div>
                <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', fontWeight: 500 }}>
                  Expiring This Month
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, marginTop: 2 }}>
                  18
                </div>
                <div style={{ fontSize: 12, color: '#00bf62', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <RiseOutlined /> 5% vs last month
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 4: Expired Members */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
              boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: isDarkMode ? 'rgba(225, 29, 72, 0.2)' : '#fdeeed',
                  color: '#e11d48',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                <TeamOutlined />
              </div>
              <div>
                <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', fontWeight: 500 }}>
                  Expired Members
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, marginTop: 2 }}>
                  24
                </div>
                <div style={{ fontSize: 12, color: '#00bf62', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <RiseOutlined /> 3% vs last month
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

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
        {/* Row 1: All 5 Filter Selectors & Inputs */}
        <Row gutter={[16, 16]} align="bottom">
          {/* Search by Name / Phone */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#475569', marginBottom: 6 }}>
              Search by Name / Phone
            </div>
            <Input
              prefix={<SearchOutlined style={{ color: isDarkMode ? '#888888' : '#94a3b8' }} />}
              placeholder="Enter name or phone number"
              value={namePhoneSearch}
              onChange={(e) => setNamePhoneSearch(e.target.value)}
              allowClear
              style={{ height: 42, borderRadius: 'var(--radius-base)' }}
            />
          </Col>

          {/* Member ID */}
          <Col xs={24} sm={12} md={8} lg={4}>
            <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#475569', marginBottom: 6 }}>
              Member ID
            </div>
            <Input
              prefix={<SearchOutlined style={{ color: isDarkMode ? '#888888' : '#94a3b8' }} />}
              placeholder="Enter member ID"
              value={memberIdSearch}
              onChange={(e) => setMemberIdSearch(e.target.value)}
              allowClear
              style={{ height: 42, borderRadius: 'var(--radius-base)' }}
            />
          </Col>

          {/* Membership Plan */}
          <Col xs={24} sm={12} md={8} lg={5}>
            <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#475569', marginBottom: 6 }}>
              Membership Plan
            </div>
            <Select
              value={planFilter}
              onChange={setPlanFilter}
              style={{ width: '100%', height: 42 }}
            >
              <Option value="ALL">All Plans</Option>
              <Option value="Gold">Gold (3 Months)</Option>
              <Option value="Platinum">Platinum (6 Months)</Option>
              <Option value="Silver">Silver (1 Month)</Option>
            </Select>
          </Col>

          {/* Status */}
          <Col xs={24} sm={12} md={8} lg={4}>
            <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#475569', marginBottom: 6 }}>
              Status
            </div>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%', height: 42 }}
            >
              <Option value="ALL">All Status</Option>
              <Option value="Active">Active</Option>
              <Option value="Expired">Expired</Option>
            </Select>
          </Col>

          {/* Date Range */}
          <Col xs={24} sm={12} md={8} lg={5}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <CalendarOutlined style={{ color: isDarkMode ? '#888888' : '#64748b', flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedDateRange}</span>
                </div>
                <DownOutlined style={{ fontSize: 10, color: isDarkMode ? '#888888' : '#64748b', flexShrink: 0 }} />
              </div>
            </Dropdown>
          </Col>
        </Row>

        {/* Row 2: Right-Aligned Filter and Clear Filters Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 18 }}>
          <Button
            icon={<FilterOutlined />}
            onClick={() => message.info(`Applied filters: ${filteredMembers.length} matches.`)}
            style={{
              height: 40,
              padding: '0 22px',
              borderRadius: 'var(--radius-base)',
              fontWeight: 600,
              color: 'var(--color-primary)',
              borderColor: isDarkMode ? '#333333' : '#d0d7de',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Filter
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={clearFilters}
            style={{
              height: 40,
              padding: '0 22px',
              borderRadius: 'var(--radius-base)',
              fontWeight: 600,
              color: isDarkMode ? '#aaaaaa' : '#64748b',
              borderColor: isDarkMode ? '#333333' : '#d0d7de',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* MEMBERS TABLE CARD */}
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
          dataSource={filteredMembers}
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
            Showing 1 to {filteredMembers.length} of 248 members
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

      {/* VIEW MEMBER DETAILS MODAL */}
      <Modal
        title={
          <div style={{ fontSize: 18, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
            Member Details
          </div>
        }
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        width={480}
        centered
        destroyOnClose
        styles={{ body: { padding: '8px 4px 12px 4px' } }}
      >
        {selectedMember && (
          <div>
            {/* Customer Profile Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, marginTop: 6 }}>
              <Avatar
                src={selectedMember.avatar}
                size={68}
                style={{
                  border: `2px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`,
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {selectedMember.name}
                </div>
                <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <PhoneOutlined /> {selectedMember.phone}
                </div>
                <div style={{ marginTop: 6 }}>
                  <Tag
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(114, 46, 209, 0.2)' : '#f3effe',
                      color: isDarkMode ? '#b37feb' : '#722ed1',
                      border: 'none',
                      borderRadius: 'var(--radius-base)',
                      fontWeight: 650,
                      fontSize: 12,
                      padding: '2px 10px',
                    }}
                  >
                    Member ID: {selectedMember.memberId}
                  </Tag>
                </div>
              </div>
            </div>

            {/* Key-Value Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
              {/* Row 1: Start Date */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#334155', fontSize: 14, fontWeight: 500 }}>
                  <CalendarOutlined style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 16 }} />
                  <span>Start Date</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {selectedMember.startDate}
                </div>
              </div>

              {/* Row 2: End Date */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#334155', fontSize: 14, fontWeight: 500 }}>
                  <CalendarOutlined style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 16 }} />
                  <span>End Date</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    {selectedMember.expiryDate}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: selectedMember.status === 'Expired' || selectedMember.daysLeft === 'Expired' ? '#e11d48' : '#fa8c16',
                      fontWeight: 600,
                      marginTop: 2,
                    }}
                  >
                    ({selectedMember.daysLeft})
                  </div>
                </div>
              </div>

              {/* Row 3: Payment Made */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#334155', fontSize: 14, fontWeight: 500 }}>
                  <DollarCircleOutlined style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 16 }} />
                  <span>Payment Made</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {selectedMember.amount}
                </div>
              </div>

              {/* Row 4: Payment Type */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#334155', fontSize: 14, fontWeight: 500 }}>
                  <CreditCardOutlined style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 16 }} />
                  <span>Payment Type</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {selectedMember.paymentType}
                </div>
              </div>

              {/* Row 5: Membership Plan */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#334155', fontSize: 14, fontWeight: 500 }}>
                  <SafetyCertificateOutlined style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 16 }} />
                  <span>Membership Plan</span>
                </div>
                <div>
                  <Tag
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(114, 46, 209, 0.2)' : '#f3effe',
                      color: isDarkMode ? '#b37feb' : '#722ed1',
                      border: 'none',
                      borderRadius: 'var(--radius-base)',
                      fontWeight: 600,
                      fontSize: 12,
                      padding: '2px 10px',
                      margin: 0,
                    }}
                  >
                    {selectedMember.plan}
                  </Tag>
                </div>
              </div>

              {/* Row 6: Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#334155', fontSize: 14, fontWeight: 500 }}>
                  <CheckCircleOutlined style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 16 }} />
                  <span>Status</span>
                </div>
                <div>
                  <Tag
                    style={{
                      backgroundColor:
                        selectedMember.status === 'Active'
                          ? isDarkMode
                            ? 'rgba(0, 191, 98, 0.15)'
                            : '#eaf8ef'
                          : isDarkMode
                          ? 'rgba(225, 29, 72, 0.15)'
                          : '#fdeeed',
                      color: selectedMember.status === 'Active' ? '#00bf62' : '#e11d48',
                      border: 'none',
                      borderRadius: 'var(--radius-base)',
                      fontWeight: 600,
                      fontSize: 12,
                      padding: '2px 10px',
                      margin: 0,
                    }}
                  >
                    {selectedMember.status}
                  </Tag>
                </div>
              </div>
            </div>

            {/* Expiry Notice Banner */}
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
                This membership will expire on {selectedMember.expiryDate}.
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
              <Button
                type="primary"
                icon={<CalendarOutlined style={{ color: '#ffffff' }} />}
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenExtend(selectedMember);
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
                Extend Membership
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* EXTEND MEMBERSHIP MODAL */}
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
              <CalendarOutlined />
            </div>
            <span>Extend Membership Subscription</span>
          </div>
        }
        open={isExtendModalOpen}
        onCancel={() => {
          setIsExtendModalOpen(false);
          extendForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        {selectedMember && (
          <Form form={extendForm} layout="vertical" onFinish={handleExtendSubmit} style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 16, padding: '12px 16px', backgroundColor: isDarkMode ? '#141414' : '#f8fafc', borderRadius: 'var(--radius-base)' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: isDarkMode ? '#ffffff' : '#0f172a' }}>{selectedMember.name}</div>
              <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2 }}>{selectedMember.memberId} • Current Plan: {selectedMember.plan}</div>
            </div>

            <Form.Item label="Select Extension Plan" name="plan" rules={[{ required: true }]}>
              <Select style={{ height: 42 }}>
                <Option value="Silver (1 Month)">Silver (1 Month) - ₹1,599</Option>
                <Option value="Gold (3 Months)">Gold (3 Months) - ₹4,499</Option>
                <Option value="Platinum (6 Months)">Platinum (6 Months) - ₹7,999</Option>
                <Option value="Annual (12 Months)">Annual (12 Months) - ₹14,999</Option>
              </Select>
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="Payment Method" name="paymentType" rules={[{ required: true }]}>
                  <Select style={{ height: 42 }}>
                    <Option value="Online">Online Payment</Option>
                    <Option value="GPay">GPay / UPI</Option>
                    <Option value="Cash">Cash at Frontdesk</Option>
                    <Option value="COD">Card on Delivery</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Renewal Amount (₹)" name="amount" rules={[{ required: true }]}>
                  <Input prefix="₹" style={{ height: 42, borderRadius: 'var(--radius-base)' }} />
                </Form.Item>
              </Col>
            </Row>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <Button onClick={() => setIsExtendModalOpen(false)} style={{ borderRadius: 'var(--radius-base)', height: 40 }}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<CalendarOutlined />}
                style={{
                  backgroundColor: 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  borderRadius: 'var(--radius-base)',
                  fontWeight: 600,
                  height: 40,
                }}
              >
                Confirm Extension
              </Button>
            </div>
          </Form>
        )}
      </Modal>

      {/* ADD NEW MEMBER MODAL (PIXEL-PERFECT FROM USER REFERENCE) */}
      <Modal
        title={
          <div style={{ fontSize: 18, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
            Add New Member
          </div>
        }
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
          form.resetFields();
          setAddMemberPhoto(null);
          setSelectedPlanType('Platinum (6 Months)');
          setSelectedPaymentType('Online');
        }}
        footer={null}
        width={500}
        centered
        destroyOnClose
        styles={{ body: { padding: '8px 4px 12px 4px' } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddMemberSubmit}
          initialValues={{
            countryCode: '+91',
            plan: 'Platinum (6 Months)',
            paymentType: 'Online',
          }}
          style={{ marginTop: 12 }}
        >
          {/* Top Section: Member Photo + Name & Phone */}
          <Row gutter={16} align="top" style={{ marginBottom: 16 }}>
            {/* Left: Member Photo Upload Card */}
            <Col xs={24} sm={9}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#334155', marginBottom: 6 }}>
                Member Photo
              </div>
              <div
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (re) => setAddMemberPhoto(re.target?.result);
                      reader.readAsDataURL(file);
                      message.success('Photo uploaded');
                    }
                  };
                  input.click();
                }}
                style={{
                  height: 122,
                  borderRadius: 'var(--radius-base)',
                  border: `2px dashed ${addMemberPhoto ? '#722ed1' : isDarkMode ? '#333333' : '#d0d7de'}`,
                  backgroundColor: isDarkMode ? '#141414' : '#fafafa',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 8,
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {addMemberPhoto ? (
                  <img
                    src={addMemberPhoto}
                    alt="Member Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }}
                  />
                ) : (
                  <>
                    <CameraOutlined style={{ fontSize: 28, color: '#722ed1', marginBottom: 6 }} />
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#722ed1' }}>
                      Upload Photo
                    </div>
                    <div style={{ fontSize: 10, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2 }}>
                      JPG, PNG (Max 2MB)
                    </div>
                  </>
                )}
              </div>
            </Col>

            {/* Right: Customer Name & Phone Number */}
            <Col xs={24} sm={15}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12.5 }}>Customer Name <span style={{ color: '#ef4444' }}>*</span></span>}
                name="name"
                rules={[{ required: true, message: 'Please enter customer name' }]}
                style={{ marginBottom: 12 }}
              >
                <Input
                  placeholder="Enter customer name"
                  style={{ height: 42, borderRadius: 'var(--radius-base)' }}
                />
              </Form.Item>

              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#334155', marginBottom: 6 }}>
                  Phone Number <span style={{ color: '#ef4444' }}>*</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Form.Item name="countryCode" initialValue="+91" noStyle>
                    <Select style={{ width: 85, height: 42 }} dropdownMatchSelectWidth={false}>
                      <Option value="+91">+91</Option>
                      <Option value="+1">+1</Option>
                      <Option value="+44">+44</Option>
                      <Option value="+971">+971</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    rules={[{ required: true, message: 'Please enter phone number' }]}
                    noStyle
                  >
                    <Input
                      placeholder="Enter phone number"
                      style={{ flex: 1, height: 42, borderRadius: 'var(--radius-base)' }}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
          </Row>

          {/* Membership Type Section */}
          <div style={{ marginBottom: 16 }}>
            <Form.Item
              label={<span style={{ fontWeight: 600, fontSize: 12.5 }}>Membership Type <span style={{ color: '#ef4444' }}>*</span></span>}
              name="plan"
              initialValue="Platinum (6 Months)"
              rules={[{ required: true }]}
              style={{ marginBottom: 8 }}
            >
              <Select
                value={selectedPlanType}
                onChange={(val) => setSelectedPlanType(val)}
                style={{ width: '100%', height: 42 }}
              >
                <Option value="Silver (1 Month)">Silver (1 Month)</Option>
                <Option value="Gold (3 Months)">Gold (3 Months)</Option>
                <Option value="Platinum (6 Months)">Platinum (6 Months)</Option>
                <Option value="Annual (12 Months)">Annual (12 Months)</Option>
              </Select>
            </Form.Item>

            {/* Plan Perks Pill Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-base)',
                backgroundColor: isDarkMode ? 'rgba(114, 46, 209, 0.12)' : '#f3effe',
                color: isDarkMode ? '#d3adf7' : '#531dab',
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <InfoCircleOutlined style={{ color: '#722ed1', fontSize: 14 }} />
                <span>
                  {selectedPlanType === 'Platinum (6 Months)' && 'Unlimited gym access   |   All gym facilities   |   1 Free guest pass'}
                  {selectedPlanType === 'Gold (3 Months)' && 'Unlimited gym access   |   Locker facility   |   Diet consultation'}
                  {selectedPlanType === 'Silver (1 Month)' && 'Standard gym floor access   |   Peak hours access'}
                  {selectedPlanType === 'Annual (12 Months)' && 'VIP all-access pass   |   Personal trainer sessions   |   Free sauna'}
                </span>
              </div>
              <DownOutlined style={{ fontSize: 10, color: '#722ed1', marginLeft: 8 }} />
            </div>
          </div>

          {/* Amount to Pay Box */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#334155', marginBottom: 6 }}>
              Amount to Pay
            </div>
            <div
              style={{
                height: 52,
                padding: '0 16px',
                borderRadius: 'var(--radius-base)',
                backgroundColor: isDarkMode ? '#141414' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#262626' : '#e2e8f0'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#003882' }}>
                {selectedPlanType === 'Platinum (6 Months)' && '₹7,999'}
                {selectedPlanType === 'Gold (3 Months)' && '₹4,499'}
                {selectedPlanType === 'Silver (1 Month)' && '₹1,599'}
                {selectedPlanType === 'Annual (12 Months)' && '₹14,999'}
              </span>
              <Tag
                style={{
                  backgroundColor: isDarkMode ? 'rgba(0, 191, 98, 0.15)' : '#eaf8ef',
                  color: '#00bf62',
                  border: 'none',
                  borderRadius: 'var(--radius-base)',
                  fontWeight: 600,
                  fontSize: 11,
                  padding: '2px 10px',
                  margin: 0,
                }}
              >
                Amount auto-filled
              </Tag>
            </div>
          </div>

          {/* Payment Type Grid Cards */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#334155', marginBottom: 8 }}>
              Payment Type <span style={{ color: '#ef4444' }}>*</span>
            </div>
            <Row gutter={[10, 10]}>
              {[
                { key: 'Online', label: 'Online', icon: <CreditCardOutlined /> },
                { key: 'GPay', label: 'GPay', icon: <MobileOutlined /> },
                { key: 'Cash', label: 'Cash', icon: <DollarCircleOutlined /> },
                { key: 'COD', label: 'COD', icon: <BarcodeOutlined /> },
              ].map((p) => {
                const isSelected = selectedPaymentType === p.key;
                return (
                  <Col xs={12} sm={6} key={p.key}>
                    <div
                      onClick={() => setSelectedPaymentType(p.key)}
                      style={{
                        height: 44,
                        padding: '0 10px',
                        borderRadius: 'var(--radius-base)',
                        border: `1.5px solid ${isSelected ? 'var(--color-primary)' : isDarkMode ? '#262626' : '#e2e8f0'}`,
                        backgroundColor: isSelected
                          ? isDarkMode
                            ? 'rgba(0, 56, 130, 0.25)'
                            : '#edf4fe'
                          : isDarkMode
                          ? '#141414'
                          : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ fontSize: 14, color: isSelected ? 'var(--color-primary)' : isDarkMode ? '#888888' : '#64748b' }}>
                        {p.icon}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: isSelected ? (isDarkMode ? '#ffffff' : '#003882') : isDarkMode ? '#cccccc' : '#334155',
                        }}
                      >
                        {p.label}
                      </span>
                      {isSelected && (
                        <CheckCircleFilled style={{ color: 'var(--color-primary)', fontSize: 13 }} />
                      )}
                    </div>
                  </Col>
                );
              })}
            </Row>

            {/* Helper Notice Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                borderRadius: 'var(--radius-base)',
                backgroundColor: isDarkMode ? 'rgba(114, 46, 209, 0.12)' : '#f3effe',
                color: isDarkMode ? '#d3adf7' : '#531dab',
                fontSize: 12,
                fontWeight: 500,
                marginTop: 12,
              }}
            >
              <InfoCircleOutlined style={{ color: '#722ed1', fontSize: 14 }} />
              <span>You can change the payment type if required.</span>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <Button
              onClick={() => {
                setIsAddModalOpen(false);
                form.resetFields();
                setAddMemberPhoto(null);
              }}
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
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined style={{ fontSize: 15 }} />}
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
              Add Member
            </Button>
          </div>
        </Form>
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
            Pick start date and end date to filter member subscriptions:
          </Paragraph>
          <DatePicker.RangePicker
            style={{ width: '100%', height: 42 }}
            onChange={(dates) => setTempDateRange(dates)}
          />
        </div>
      </Modal>

      {/* MEMBER ADDED SUCCESSFULLY MODAL (WITH CANVAS CONFETTI POPPER) */}
      <Modal
        open={isSuccessModalOpen}
        onCancel={() => setIsSuccessModalOpen(false)}
        footer={null}
        width={460}
        centered
        destroyOnClose
        styles={{ body: { padding: '24px 20px 16px 20px' } }}
      >
        {addedMemberData && (
          <div>
            {/* Header: Success Icon Badge & Confetti Graphic Background */}
            <div style={{ textAlign: 'center', marginBottom: 20, position: 'relative' }}>
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: '50%',
                  backgroundColor: isDarkMode ? 'rgba(0, 191, 98, 0.15)' : '#eaf8ef',
                  border: `2px solid ${isDarkMode ? 'rgba(0, 191, 98, 0.3)' : '#b7eb8f'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  fontSize: 30,
                  color: '#00bf62',
                  boxShadow: '0 4px 16px rgba(0, 191, 98, 0.25)',
                }}
              >
                <CheckOutlined style={{ strokeWidth: 2.5 }} />
              </div>

              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: isDarkMode ? '#ffffff' : '#0f172a',
                  fontFamily: 'var(--font-display)',
                }}
              >
                Member Added Successfully!
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: isDarkMode ? '#888888' : '#64748b',
                  marginTop: 4,
                }}
              >
                The membership has been created and payment recorded.
              </div>
            </div>

            {/* Key-Value Details Rows */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                padding: '16px 0',
                borderTop: `1px solid ${isDarkMode ? '#1e1e1e' : '#f1f5f9'}`,
                borderBottom: `1px solid ${isDarkMode ? '#1e1e1e' : '#f1f5f9'}`,
                marginBottom: 16,
              }}
            >
              {/* Row 1: Member Name */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#475569', fontSize: 13.5, fontWeight: 500 }}>
                  <UserOutlined style={{ color: isDarkMode ? '#888888' : '#64748b' }} />
                  <span>Member Name</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#722ed1' }}>
                  {addedMemberData.name}
                </div>
              </div>

              {/* Row 2: Phone Number */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#475569', fontSize: 13.5, fontWeight: 500 }}>
                  <PhoneOutlined style={{ color: isDarkMode ? '#888888' : '#64748b' }} />
                  <span>Phone Number</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {addedMemberData.phone}
                </div>
              </div>

              {/* Row 3: Member ID */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#475569', fontSize: 13.5, fontWeight: 500 }}>
                  <IdcardOutlined style={{ color: isDarkMode ? '#888888' : '#64748b' }} />
                  <span>Member ID</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#722ed1' }}>
                  {addedMemberData.memberId}
                </div>
              </div>

              {/* Row 4: Start Date */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#475569', fontSize: 13.5, fontWeight: 500 }}>
                  <CalendarOutlined style={{ color: isDarkMode ? '#888888' : '#64748b' }} />
                  <span>Start Date</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {addedMemberData.startDate}
                </div>
              </div>

              {/* Row 5: End Date */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#475569', fontSize: 13.5, fontWeight: 500 }}>
                  <CalendarOutlined style={{ color: isDarkMode ? '#888888' : '#64748b' }} />
                  <span>End Date</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {addedMemberData.expiryDate}
                </div>
              </div>

              {/* Row 6: Membership Type */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#475569', fontSize: 13.5, fontWeight: 500 }}>
                  <CrownOutlined style={{ color: isDarkMode ? '#888888' : '#64748b' }} />
                  <span>Membership Type</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#722ed1' }}>
                  {addedMemberData.plan}
                </div>
              </div>

              {/* Row 7: Amount Paid */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#475569', fontSize: 13.5, fontWeight: 500 }}>
                  <DollarCircleOutlined style={{ color: isDarkMode ? '#888888' : '#64748b' }} />
                  <span>Amount Paid</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {addedMemberData.amount}
                </div>
              </div>

              {/* Row 8: Payment Type */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#475569', fontSize: 13.5, fontWeight: 500 }}>
                  <CreditCardOutlined style={{ color: isDarkMode ? '#888888' : '#64748b' }} />
                  <span>Payment Type</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {addedMemberData.paymentType}
                </div>
              </div>
            </div>

            {/* Notice Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 14px',
                borderRadius: 'var(--radius-base)',
                backgroundColor: isDarkMode ? 'rgba(114, 46, 209, 0.12)' : '#f3effe',
                marginBottom: 20,
              }}
            >
              <InfoCircleOutlined style={{ color: '#722ed1', fontSize: 16, flexShrink: 0 }} />
              <div style={{ fontSize: 12.5, color: isDarkMode ? '#d3adf7' : '#531dab', lineHeight: 1.4 }}>
                An invoice has been generated for this membership.
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => message.success(`Invoice for ${addedMemberData.memberId} downloaded!`)}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 'var(--radius-base)',
                  fontWeight: 600,
                  fontSize: 14,
                  borderColor: isDarkMode ? '#333333' : '#d0d7de',
                  color: isDarkMode ? '#ffffff' : '#0f172a',
                  backgroundColor: isDarkMode ? '#141414' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                Download Invoice
              </Button>
              <Button
                type="primary"
                onClick={() => setIsSuccessModalOpen(false)}
                style={{
                  flex: 1.2,
                  height: 44,
                  borderRadius: 'var(--radius-base)',
                  fontWeight: 600,
                  fontSize: 14,
                  backgroundColor: 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  color: '#ffffff',
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MembersManagement;
