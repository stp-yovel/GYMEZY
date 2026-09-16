import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Row,
  Col,
  Statistic,
  Input,
  Select,
  Typography,
  Badge,
  Space,
  Modal,
  message,
} from 'antd';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useTheme } from '../theme/ThemeContext';

const { Title, Text } = Typography;
const { Option } = Select;

const mockBookings = [
  {
    key: '1',
    bookingId: 'BK-99120',
    memberName: 'Sam Kumar',
    sessionType: 'GYM - Free Workout Slot',
    slotTime: '06:00 AM - 07:30 AM',
    date: 'Today',
    status: 'COMPLETED',
    passId: 'MBR123456',
    trainer: 'Rohit Sharma',
  },
  {
    key: '2',
    bookingId: 'BK-99121',
    memberName: 'Priya Sharma',
    sessionType: 'Morning Yoga Batch',
    slotTime: '08:00 AM - 09:00 AM',
    date: 'Today',
    status: 'CONFIRMED',
    passId: 'YSB654321',
    trainer: 'Sneha Iyer',
  },
  {
    key: '3',
    bookingId: 'BK-99122',
    memberName: 'Ananya Reddy',
    sessionType: 'Evening Zumba Fitness',
    slotTime: '06:30 PM - 07:30 PM',
    date: 'Today',
    status: 'CONFIRMED',
    passId: 'ZMB789012',
    trainer: 'Neha Kapoor',
  },
  {
    key: '4',
    bookingId: 'BK-99123',
    memberName: 'Arun Kumar',
    sessionType: 'CrossFit & HIIT Conditioning',
    slotTime: '07:30 PM - 08:30 PM',
    date: 'Today',
    status: 'CONFIRMED',
    passId: 'FSB998811',
    trainer: 'Arun Mehta',
  },
  {
    key: '5',
    bookingId: 'BK-99124',
    memberName: 'Karthik Raja',
    sessionType: 'Strength & Personal Training',
    slotTime: '05:00 PM - 06:00 PM',
    date: 'Tomorrow',
    status: 'CONFIRMED',
    passId: 'MBR554433',
    trainer: 'Vikram Singh',
  },
];

export const Bookings = () => {
  const { isDarkMode } = useTheme();
  const [bookingsList, setBookingsList] = useState(mockBookings);
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = bookingsList.filter((b) => {
    const matchesType = filterType === 'ALL' || b.sessionType.includes(filterType);
    const matchesSearch =
      b.memberName.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingId.toLowerCase().includes(search.toLowerCase()) ||
      b.passId.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const columns = [
    {
      title: 'Booking ID & Member',
      key: 'booking',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
            {record.memberName}
          </div>
          <div style={{ fontSize: 12, color: '#1677ff', fontWeight: 600 }}>{record.bookingId}</div>
        </div>
      ),
    },
    {
      title: 'Class / Workout Session',
      dataIndex: 'sessionType',
      key: 'sessionType',
      render: (text) => (
        <span style={{ fontWeight: 600, color: isDarkMode ? '#dddddd' : '#334155' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Slot Schedule',
      key: 'time',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: 13, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
            <ClockCircleOutlined style={{ color: '#1677ff', marginRight: 6 }} />
            {record.slotTime}
          </div>
          <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>{record.date}</div>
        </div>
      ),
    },
    {
      title: 'Trainer',
      dataIndex: 'trainer',
      key: 'trainer',
      render: (t) => <Text style={{ color: isDarkMode ? '#cccccc' : '#475569' }}>{t}</Text>,
    },
    {
      title: 'Pass Code',
      dataIndex: 'passId',
      key: 'passId',
      render: (p) => <Tag color="blue">{p}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'COMPLETED' ? 'default' : 'success'} style={{ fontWeight: 700, borderRadius: 6 }}>
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a', fontWeight: 650 }}>
          Workout Sessions & Bookings
        </Title>
        <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 14 }}>
          Manage batch schedule allocations, trainer workout classes, and reserved turnstile passes.
        </Text>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff', borderColor: isDarkMode ? '#222222' : '#e2e8f0', borderRadius: 'var(--radius-base)' }}>
            <Statistic title="Today's Total Slots" value={54} valueStyle={{ color: '#1677ff', fontWeight: 800 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff', borderColor: isDarkMode ? '#222222' : '#e2e8f0', borderRadius: 'var(--radius-base)' }}>
            <Statistic title="Confirmed Attendees" value={48} valueStyle={{ color: '#00bf62', fontWeight: 800 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff', borderColor: isDarkMode ? '#222222' : '#e2e8f0', borderRadius: 'var(--radius-base)' }}>
            <Statistic title="Yoga & Zumba Batches" value={12} valueStyle={{ color: '#fa8c16', fontWeight: 800 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff', borderColor: isDarkMode ? '#222222' : '#e2e8f0', borderRadius: 'var(--radius-base)' }}>
            <Statistic title="Turnstile Check-In Rate" value="96.2%" valueStyle={{ color: '#722ed1', fontWeight: 800 }} />
          </Card>
        </Col>
      </Row>

      {/* Filter Toolbar */}
      <Card
        style={{
          backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff',
          borderColor: isDarkMode ? '#222222' : '#e2e8f0',
          borderRadius: 'var(--radius-base)',
          marginBottom: 20,
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Input
              prefix={<SearchOutlined style={{ color: '#1677ff' }} />}
              placeholder="Search by member, booking ID, or pass code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={12}>
            <Select value={filterType} onChange={setFilterType} style={{ width: '100%' }}>
              <Option value="ALL">All Workout Classes</Option>
              <Option value="GYM">Gym Workout</Option>
              <Option value="Yoga">Yoga Batch</Option>
              <Option value="Zumba">Zumba Session</Option>
              <Option value="CrossFit">CrossFit & HIIT</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Bookings Table */}
      <Card
        style={{
          backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff',
          borderColor: isDarkMode ? '#222222' : '#e2e8f0',
          borderRadius: 'var(--radius-base)',
        }}
      >
        <Table columns={columns} dataSource={filtered} pagination={{ pageSize: 8 }} />
      </Card>
    </div>
  );
};

export default Bookings;
