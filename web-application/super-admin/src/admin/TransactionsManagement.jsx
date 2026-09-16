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
  Tooltip,
  Alert,
} from 'antd';
import {
  SearchOutlined,
  DownloadOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  WalletOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  CloseOutlined,
  CreditCardOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useTheme } from '../theme/ThemeContext';

const { Option } = Select;

// Sample Initial Transactions Data matching user mockup exactly
const INITIAL_TRANSACTIONS = [
  {
    key: '1',
    id: 1,
    transactionId: 'TXN100123456',
    customerName: 'Arun Kumar',
    customerId: 'CUST100245',
    customerPhone: '+91 98765 43210',
    customerInitials: 'AK',
    avatarColor: '#f3e8ff',
    avatarTextColor: '#7e22ce',
    bookingId: 'BK100121',
    gymName: 'FitZone Gym',
    gymLocation: 'Anna Nagar, Chennai',
    bookingDate: '18 May 2026',
    bookingTime: '07:30 AM',
    daysBooked: '18 May 2026 - 25 May 2026 (8 Days)',
    dateTime: '18 May 2026 07:28 AM',
    transactionDate: '18 May 2026, 07:28 AM',
    amount: '350.00',
    paymentMode: 'UPI',
    gatewayTxnId: 'UPI418526780912',
    status: 'Completed',
  },
  {
    key: '2',
    id: 2,
    transactionId: 'TXN100123457',
    customerName: 'Priya Sharma',
    customerId: 'CUST100246',
    customerPhone: '+91 91234 56789',
    customerInitials: 'PS',
    avatarColor: '#fce7f3',
    avatarTextColor: '#db2777',
    bookingId: 'BK100122',
    gymName: 'Powerhouse Gym',
    gymLocation: 'T. Nagar, Chennai',
    bookingDate: '18 May 2026',
    bookingTime: '06:15 PM',
    daysBooked: '18 May 2026 - 18 May 2026 (1 Day)',
    dateTime: '18 May 2026 06:15 PM',
    transactionDate: '18 May 2026, 06:15 PM',
    amount: '250.00',
    paymentMode: 'Online (Card)',
    gatewayTxnId: 'CARD_992147102',
    status: 'Completed',
  },
  {
    key: '3',
    id: 3,
    transactionId: 'TXN100123458',
    customerName: 'Rahul Krishnan',
    customerId: 'CUST100247',
    customerPhone: '+91 99887 66554',
    customerInitials: 'RK',
    avatarColor: '#dcfce7',
    avatarTextColor: '#16a34a',
    bookingId: 'BK100123',
    gymName: 'Muscle Factory',
    gymLocation: 'Adyar, Chennai',
    bookingDate: '17 May 2026',
    bookingTime: '09:10 AM',
    daysBooked: '17 May 2026 - 17 May 2026 (1 Day)',
    dateTime: '17 May 2026 09:10 AM',
    transactionDate: '17 May 2026, 09:10 AM',
    amount: '250.00',
    paymentMode: 'UPI',
    gatewayTxnId: 'UPI901238472910',
    status: 'Cancelled',
  },
  {
    key: '4',
    id: 4,
    transactionId: 'TXN100123459',
    customerName: 'Sneha Nair',
    customerId: 'CUST100248',
    customerPhone: '+91 90123 45678',
    customerInitials: 'SN',
    avatarColor: '#ffedd5',
    avatarTextColor: '#ea580c',
    bookingId: 'BK100124',
    gymName: 'Iron Club',
    gymLocation: 'Velachery, Chennai',
    bookingDate: '16 May 2026',
    bookingTime: '07:00 PM',
    daysBooked: '16 May 2026 - 16 May 2026 (1 Day)',
    dateTime: '16 May 2026 07:00 PM',
    transactionDate: '16 May 2026, 07:00 PM',
    amount: '300.00',
    paymentMode: 'Pay at Gym',
    gatewayTxnId: 'CASH_REC_1092',
    status: 'Completed',
  },
  {
    key: '5',
    id: 5,
    transactionId: 'TXN100123460',
    customerName: 'Vijay Joseph',
    customerId: 'CUST100249',
    customerPhone: '+91 93456 78901',
    customerInitials: 'VJ',
    avatarColor: '#e0e7ff',
    avatarTextColor: '#4f46e5',
    bookingId: 'BK100125',
    gymName: 'Fitness First',
    gymLocation: 'Porur, Chennai',
    bookingDate: '16 May 2026',
    bookingTime: '06:30 AM',
    daysBooked: '16 May 2026 - 16 May 2026 (1 Day)',
    dateTime: '16 May 2026 06:30 AM',
    transactionDate: '16 May 2026, 06:30 AM',
    amount: '300.00',
    paymentMode: 'UPI',
    gatewayTxnId: 'UPI109283746152',
    status: 'Completed',
  },
  {
    key: '6',
    id: 6,
    transactionId: 'TXN100123461',
    customerName: 'Ananya Singh',
    customerId: 'CUST100250',
    customerPhone: '+91 98712 34567',
    customerInitials: 'AS',
    avatarColor: '#ccfbf1',
    avatarTextColor: '#0d9488',
    bookingId: 'BK100126',
    gymName: 'Body Garage',
    gymLocation: 'OMR, Chennai',
    bookingDate: '15 May 2026',
    bookingTime: '08:45 PM',
    daysBooked: '15 May 2026 - 15 May 2026 (1 Day)',
    dateTime: '15 May 2026 08:45 PM',
    transactionDate: '15 May 2026, 08:45 PM',
    amount: '350.00',
    paymentMode: 'Online (NetBanking)',
    gatewayTxnId: 'NETB_7788990011',
    status: 'Completed',
  },
  {
    key: '7',
    id: 7,
    transactionId: 'TXN100123462',
    customerName: 'Manoj Gupta',
    customerId: 'CUST100251',
    customerPhone: '+91 98123 65432',
    customerInitials: 'MG',
    avatarColor: '#fef3c7',
    avatarTextColor: '#d97706',
    bookingId: 'BK100127',
    gymName: 'Next Level Fitness',
    gymLocation: 'Tambaram, Chennai',
    bookingDate: '15 May 2026',
    bookingTime: '06:20 PM',
    daysBooked: '15 May 2026 - 15 May 2026 (1 Day)',
    dateTime: '15 May 2026 06:20 PM',
    transactionDate: '15 May 2026, 06:20 PM',
    amount: '250.00',
    paymentMode: 'UPI',
    gatewayTxnId: 'UPI998877665544',
    status: 'Cancelled',
  },
  {
    key: '8',
    id: 8,
    transactionId: 'TXN100123463',
    customerName: 'Harish Babu',
    customerId: 'CUST100253',
    customerPhone: '+91 90987 61234',
    customerInitials: 'HB',
    avatarColor: '#fce7f3',
    avatarTextColor: '#be185d',
    bookingId: 'BK100128',
    gymName: 'Fitness Pro',
    gymLocation: 'Nungambakkam, Chennai',
    bookingDate: '14 May 2026',
    bookingTime: '10:05 AM',
    daysBooked: '14 May 2026 - 14 May 2026 (1 Day)',
    dateTime: '14 May 2026 10:05 AM',
    transactionDate: '14 May 2026, 10:05 AM',
    amount: '350.00',
    paymentMode: 'Online (Card)',
    gatewayTxnId: 'CARD_881290312',
    status: 'Completed',
  },
  {
    key: '9',
    id: 9,
    transactionId: 'TXN100123464',
    customerName: 'Nithya Thakur',
    customerId: 'CUST100254',
    customerPhone: '+91 94876 54321',
    customerInitials: 'NT',
    avatarColor: '#dbeafe',
    avatarTextColor: '#1d4ed8',
    bookingId: 'BK100129',
    gymName: 'Gold Gym',
    gymLocation: 'Alwarpet, Chennai',
    bookingDate: '14 May 2026',
    bookingTime: '09:15 AM',
    daysBooked: '14 May 2026 - 21 May 2026 (7 Days)',
    dateTime: '14 May 2026 09:15 AM',
    transactionDate: '14 May 2026, 09:15 AM',
    amount: '500.00',
    paymentMode: 'UPI',
    gatewayTxnId: 'UPI556677889900',
    status: 'Pending',
  },
  {
    key: '10',
    id: 10,
    transactionId: 'TXN100123465',
    customerName: 'Deepak Raj',
    customerId: 'CUST100255',
    customerPhone: '+91 97890 12345',
    customerInitials: 'DR',
    avatarColor: '#f1f5f9',
    avatarTextColor: '#334155',
    bookingId: 'BK100130',
    gymName: 'Talwalkars Gym',
    gymLocation: 'Kilpauk, Chennai',
    bookingDate: '13 May 2026',
    bookingTime: '05:40 PM',
    daysBooked: '13 May 2026 - 13 May 2026 (1 Day)',
    dateTime: '13 May 2026 05:40 PM',
    transactionDate: '13 May 2026, 05:40 PM',
    amount: '250.00',
    paymentMode: 'Pay at Gym',
    gatewayTxnId: 'CASH_REC_1098',
    status: 'Completed',
  },
];

export const TransactionsManagement = () => {
  const { isDarkMode } = useTheme();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentModeFilter, setPaymentModeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Selected Transaction for details modal
  const [selectedTransaction, setSelectedTransaction] = useState(INITIAL_TRANSACTIONS[0]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Refund Modal State
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('Customer Request');

  // Cancel Booking Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Filtered List
  const filteredTransactions = useMemo(() => {
    return INITIAL_TRANSACTIONS.filter((item) => {
      // Payment Mode Filter
      if (paymentModeFilter !== 'all' && item.paymentMode.toLowerCase() !== paymentModeFilter.toLowerCase()) {
        return false;
      }

      // Status Filter
      if (statusFilter !== 'all' && item.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.customerName.toLowerCase().includes(q);
        const matchTxn = item.transactionId.toLowerCase().includes(q) || item.gatewayTxnId.toLowerCase().includes(q);
        const matchBooking = item.bookingId.toLowerCase().includes(q);
        if (!matchName && !matchTxn && !matchBooking) return false;
      }

      return true;
    });
  }, [searchQuery, paymentModeFilter, statusFilter]);

  // Handle View
  const handleView = (record) => {
    setSelectedTransaction(record);
    setIsDetailsModalOpen(true);
  };

  // Handle Initiate Refund
  const handleInitiateRefund = () => {
    message.success(`Refund of ₹${selectedTransaction.amount} initiated for ${selectedTransaction.transactionId} successfully!`);
    setIsRefundModalOpen(false);
  };

  // Handle Cancel Booking
  const handleCancelBooking = () => {
    message.warning(`Booking ${selectedTransaction.bookingId} has been cancelled.`);
    setIsCancelModalOpen(false);
  };

  // Columns for Transaction Table
  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      width: 170,
      render: (text, record) => (
        <span
          onClick={() => handleView(record)}
          style={{
            fontWeight: 700,
            color: '#4f46e5',
            cursor: 'pointer',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 160,
      render: (name, record) => (
        <span
          onClick={() => handleView(record)}
          style={{ fontWeight: 600, color: isDarkMode ? '#ffffff' : '#0f172a', cursor: 'pointer' }}
        >
          {name}
        </span>
      ),
    },
    {
      title: 'Booking ID',
      dataIndex: 'bookingId',
      key: 'bookingId',
      width: 130,
      render: (id, record) => (
        <span
          onClick={() => handleView(record)}
          style={{ fontWeight: 700, color: '#4f46e5', cursor: 'pointer' }}
        >
          {id}
        </span>
      ),
    },
    {
      title: 'Date & Time',
      dataIndex: 'dateTime',
      key: 'dateTime',
      width: 180,
      render: (text) => (
        <span style={{ fontSize: 13, color: isDarkMode ? '#cbd5e1' : '#334155' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 130,
      render: (val) => (
        <span style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
          ₹ {val}
        </span>
      ),
    },
    {
      title: 'Payment Mode',
      dataIndex: 'paymentMode',
      key: 'paymentMode',
      width: 160,
      render: (mode) => (
        <span style={{ fontSize: 13, color: isDarkMode ? '#e2e8f0' : '#1e293b' }}>
          {mode}
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
        if (status === 'Cancelled' || status === 'Failed') {
          bg = isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fdeeed';
          color = '#e11d48';
        } else if (status === 'Pending') {
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
      title: 'Action',
      key: 'action',
      width: 90,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
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
        {/* Total Transactions */}
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
                Total Transactions
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                12,845
              </div>
              <div style={{ fontSize: 11, color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                All time
              </div>
            </div>
          </div>
        </Card>

        {/* Successful */}
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
              <CheckCircleOutlined style={{ fontSize: 20, color: '#00bf62' }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Successful
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                10,256
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#00bf62' }}>
                79.80%
              </div>
            </div>
          </div>
        </Card>

        {/* Pending */}
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
                Pending
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                356
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>
                2.77%
              </div>
            </div>
          </div>
        </Card>

        {/* Failed */}
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
                Failed
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                987
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444' }}>
                7.68%
              </div>
            </div>
          </div>
        </Card>

        {/* Total Amount */}
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
                Total Amount
              </div>
              <div style={{ fontSize: 17, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0', whiteSpace: 'nowrap' }}>
                ₹ 18,75,430
              </div>
              <div style={{ fontSize: 11, color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                All time
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 2. FULL-WIDTH TRANSACTIONS TABLE & FILTERS */}
      {/* Filter Bar */}
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
            placeholder="Search by customer name, transaction ID, booking ID..."
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, minWidth: 220, borderRadius: 'var(--radius-base)' }}
            allowClear
          />

          <Select
            value={paymentModeFilter}
            onChange={setPaymentModeFilter}
            style={{ width: 180 }}
          >
            <Option value="all">All Payment Modes</Option>
            <Option value="upi">UPI</Option>
            <Option value="online (card)">Online (Card)</Option>
            <Option value="online (netbanking)">Online (NetBanking)</Option>
            <Option value="pay at gym">Pay at Gym</Option>
          </Select>

          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 140 }}
          >
            <Option value="all">All Status</Option>
            <Option value="completed">Completed</Option>
            <Option value="cancelled">Cancelled</Option>
            <Option value="pending">Pending</Option>
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
          dataSource={filteredTransactions}
          pagination={false}
          rowKey="key"
          scroll={{ x: 1150 }}
        />
      </Card>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b' }}>
          Showing 1 to {filteredTransactions.length} of 12,845 transactions
        </div>
        <Pagination current={currentPage} total={12845} pageSize={10} onChange={setCurrentPage} />
      </div>

      {/* -------------------------------------------------------------
          3. TRANSACTION DETAILS POPUP MODAL
         ------------------------------------------------------------- */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 17, fontWeight: 800 }}>
            <WalletOutlined style={{ color: '#4f46e5' }} />
            <span>Transaction Details</span>
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
        {selectedTransaction && (
          <div style={{ paddingTop: 10 }}>
            {/* Status & ID Badge Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span
                style={{
                  padding: '3px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  backgroundColor: selectedTransaction.status === 'Completed'
                    ? isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#eaf8ef'
                    : isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fdeeed',
                  color: selectedTransaction.status === 'Completed' ? '#00bf62' : '#e11d48',
                }}
              >
                ● {selectedTransaction.status}
              </span>
              <span style={{ fontSize: 13, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                Transaction ID:{' '}
                <strong style={{ color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {selectedTransaction.transactionId}
                </strong>
              </span>
            </div>

            {/* Customer & Gym Info Card */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
                borderRadius: 12,
                marginBottom: 16,
                gap: 12,
              }}
            >
              {/* Customer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: selectedTransaction.avatarColor,
                    color: selectedTransaction.avatarTextColor,
                    fontWeight: 800,
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {selectedTransaction.customerInitials}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    {selectedTransaction.customerName}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '2px 0' }}>
                    <span style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>Customer ID:</span>
                    <span
                      style={{
                        padding: '1px 6px',
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 700,
                        backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : '#ede9fe',
                        color: '#4f46e5',
                      }}
                    >
                      {selectedTransaction.customerId}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: isDarkMode ? '#cbd5e1' : '#334155', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <PhoneOutlined style={{ color: '#6366f1', fontSize: 10 }} />
                    <span>{selectedTransaction.customerPhone}</span>
                  </div>
                </div>
              </div>

              {/* Gym & Booking ID */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>
                  Booking ID:{' '}
                  <span style={{ color: '#4f46e5', fontWeight: 700 }}>
                    {selectedTransaction.bookingId}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, color: isDarkMode ? '#ffffff' : '#0f172a', marginTop: 3 }}>
                  {selectedTransaction.gymName}
                </div>
                <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3, marginTop: 2 }}>
                  <EnvironmentOutlined style={{ color: '#6366f1', fontSize: 10 }} />
                  <span>{selectedTransaction.gymLocation}</span>
                </div>
              </div>
            </div>

            {/* Schedule Info */}
            <div
              style={{
                padding: '14px 16px',
                border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`,
                borderRadius: 10,
                marginBottom: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CalendarOutlined style={{ color: '#6366f1' }} /> Booking Date
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {selectedTransaction.bookingDate}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ClockCircleOutlined style={{ color: '#6366f1' }} /> Booking Time
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {selectedTransaction.bookingTime}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CalendarOutlined style={{ color: '#6366f1' }} /> Days Booked (From - To)
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {selectedTransaction.daysBooked}
                </span>
              </div>
            </div>

            {/* Payment Ledger Breakdown */}
            <div
              style={{
                padding: '14px 16px',
                backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
                borderRadius: 10,
                marginBottom: 18,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>Total Amount</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  ₹ {selectedTransaction.amount}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>Payment Mode</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#e2e8f0' : '#1e293b' }}>
                  {selectedTransaction.paymentMode}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>Transaction ID (Gateway)</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: isDarkMode ? '#e2e8f0' : '#1e293b' }}>
                  {selectedTransaction.gatewayTxnId}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>Transaction Date</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cbd5e1' : '#334155' }}>
                  {selectedTransaction.transactionDate}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTop: `1px solid ${isDarkMode ? '#262626' : '#e2e8f0'}` }}>
                <span style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>Status</span>
                <span
                  style={{
                    padding: '2px 10px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    backgroundColor: selectedTransaction.status === 'Completed'
                      ? isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#eaf8ef'
                      : isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fdeeed',
                    color: selectedTransaction.status === 'Completed' ? '#00bf62' : '#e11d48',
                  }}
                >
                  {selectedTransaction.status}
                </span>
              </div>
            </div>

            {/* Need Help? Action Buttons */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 4 }}>
                Need Help?
              </div>
              <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', marginBottom: 12 }}>
                You can cancel this booking and initiate a refund if required.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => setIsCancelModalOpen(true)}
                  style={{ borderRadius: 'var(--radius-base)', fontWeight: 700, fontSize: 12 }}
                >
                  Cancel Booking
                </Button>

                <Button
                  type="primary"
                  icon={<DollarOutlined />}
                  onClick={() => setIsRefundModalOpen(true)}
                  style={{
                    borderRadius: 'var(--radius-base)',
                    fontWeight: 700,
                    fontSize: 12,
                    backgroundColor: '#4f46e5',
                    borderColor: '#4f46e5',
                  }}
                >
                  Initiate Refund
                </Button>
              </div>
            </div>

            {/* Information Alert Box */}
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
                Refund will be processed to the original payment method used by the customer. UPI refunds may take 3–5 working days to reflect.
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* INITIATE REFUND MODAL */}
      <Modal
        title={<span style={{ fontWeight: 800 }}>Initiate Refund</span>}
        open={isRefundModalOpen}
        onCancel={() => setIsRefundModalOpen(false)}
        onOk={handleInitiateRefund}
        okText="Confirm & Process Refund"
        okButtonProps={{ style: { backgroundColor: '#4f46e5' } }}
        centered
      >
        <div style={{ paddingTop: 12 }}>
          <p style={{ color: isDarkMode ? '#cbd5e1' : '#334155' }}>
            Are you sure you want to refund <strong>₹ {selectedTransaction?.amount}</strong> for transaction <strong>{selectedTransaction?.transactionId}</strong>?
          </p>
          <div style={{ marginTop: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Reason for Refund
            </label>
            <Select value={refundReason} onChange={setRefundReason} style={{ width: '100%' }}>
              <Option value="Customer Request">Customer Request</Option>
              <Option value="Gym Closed / Slot Cancelled">Gym Closed / Slot Cancelled</Option>
              <Option value="Duplicate Payment">Duplicate Payment</Option>
              <Option value="Other">Other</Option>
            </Select>
          </div>
        </div>
      </Modal>

      {/* CANCEL BOOKING MODAL */}
      <Modal
        title={<span style={{ fontWeight: 800, color: '#ef4444' }}>Cancel Booking</span>}
        open={isCancelModalOpen}
        onCancel={() => setIsCancelModalOpen(false)}
        onOk={handleCancelBooking}
        okText="Yes, Cancel Booking"
        okButtonProps={{ danger: true }}
        centered
      >
        <p style={{ paddingTop: 12, color: isDarkMode ? '#cbd5e1' : '#334155' }}>
          Are you sure you want to cancel booking <strong>{selectedTransaction?.bookingId}</strong> for customer <strong>{selectedTransaction?.customerName}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default TransactionsManagement;
