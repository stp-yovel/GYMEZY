import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Select,
  Button,
  DatePicker,
  Space,
  Tag,
  Progress,
  Badge,
  Avatar,
  Tooltip,
} from 'antd';
import {
  CalendarOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
  HourglassOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  StopOutlined,
  CrownOutlined,
  RiseOutlined,
  TeamOutlined,
  MobileOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FireOutlined,
  ThunderboltOutlined,
  ShopOutlined,
  AuditOutlined,
  CreditCardOutlined,
  StarFilled,
  SyncOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import gym3dBuilding from '../assets/images/gym_3d_building.jpg';
import booking3dPhone from '../assets/images/booking_3d_phone.jpg';

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Donut Chart SVG Component with center Crown icon
const SubscriptionDonutChart = ({ isDarkMode }) => {
  const r = 70;
  const c = 2 * Math.PI * r;

  const hybridPct = 0.522;
  const appOnlyPct = 0.294;
  const gmsPct = 0.114;
  const listingPct = 0.069;

  const hybridDash = c * hybridPct;
  const appOnlyDash = c * appOnlyPct;
  const gmsDash = c * gmsPct;
  const listingDash = c * listingPct;

  const hybridOffset = 0;
  const appOnlyOffset = -hybridDash;
  const gmsOffset = -(hybridDash + appOnlyDash);
  const listingOffset = -(hybridDash + appOnlyDash + gmsDash);

  return (
    <div style={{ position: 'relative', width: 170, height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="170" height="170" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="100" cy="100" r={r} fill="transparent" stroke={isDarkMode ? '#1f2937' : '#f1f5f9'} strokeWidth="26" />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="transparent"
          stroke="#22c55e"
          strokeWidth="26"
          strokeDasharray={`${hybridDash} ${c}`}
          strokeDashoffset={hybridOffset}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="transparent"
          stroke="#3b82f6"
          strokeWidth="26"
          strokeDasharray={`${appOnlyDash} ${c}`}
          strokeDashoffset={appOnlyOffset}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="transparent"
          stroke="#6366f1"
          strokeWidth="26"
          strokeDasharray={`${gmsDash} ${c}`}
          strokeDashoffset={gmsOffset}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="transparent"
          stroke="#f97316"
          strokeWidth="26"
          strokeDasharray={`${listingDash} ${c}`}
          strokeDashoffset={listingOffset}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
      </svg>

      <div
        style={{
          position: 'absolute',
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: isDarkMode ? '#111827' : '#ffffff',
          boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.5)' : '0 2px 10px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CrownOutlined style={{ fontSize: 30, color: '#6366f1' }} />
      </div>
    </div>
  );
};

// Revenue Monthly Bar Chart SVG Component
const RevenueBarChart = ({ isDarkMode }) => {
  const months = [
    { name: 'Jan', subscription: 18.2, commission: 8.4, total: 26.6 },
    { name: 'Feb', subscription: 21.0, commission: 9.8, total: 30.8 },
    { name: 'Mar', subscription: 24.5, commission: 12.1, total: 36.6 },
    { name: 'Apr', subscription: 26.8, commission: 13.5, total: 40.3 },
    { name: 'May', subscription: 28.7, commission: 16.2, total: 44.9 },
    { name: 'Jun (Est)', subscription: 32.4, commission: 18.1, total: 50.5 },
  ];

  const maxVal = 55;

  return (
    <div style={{ width: '100%', paddingTop: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 160, gap: 12, paddingBottom: 10 }}>
        {months.map((m, idx) => {
          const subHeight = (m.subscription / maxVal) * 130;
          const commHeight = (m.commission / maxVal) * 130;
          return (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: isDarkMode ? '#cbd5e1' : '#334155' }}>
                ₹{m.total}L
              </span>
              <div
                style={{
                  width: '100%',
                  maxWidth: 36,
                  height: 130,
                  display: 'flex',
                  flexDirection: 'column-reverse',
                  backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9',
                  borderRadius: 6,
                  overflow: 'hidden',
                }}
              >
                {/* Subscription bar segment */}
                <Tooltip title={`Subscription: ₹${m.subscription}L`}>
                  <div
                    style={{
                      height: `${subHeight}px`,
                      backgroundColor: '#6366f1',
                      width: '100%',
                      transition: 'height 0.3s ease',
                    }}
                  />
                </Tooltip>
                {/* Commission bar segment */}
                <Tooltip title={`Booking Commission: ₹${m.commission}L`}>
                  <div
                    style={{
                      height: `${commHeight}px`,
                      backgroundColor: '#22c55e',
                      width: '100%',
                      transition: 'height 0.3s ease',
                    }}
                  />
                </Tooltip>
              </div>
              <span style={{ fontSize: 11, color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 600 }}>
                {m.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, paddingTop: 12, borderTop: `1px solid ${isDarkMode ? '#222' : '#f1f5f9'}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#6366f1' }} />
          <span style={{ fontSize: 12, color: isDarkMode ? '#94a3b8' : '#64748b' }}>Partner Subscriptions</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#22c55e' }} />
          <span style={{ fontSize: 12, color: isDarkMode ? '#94a3b8' : '#64748b' }}>Booking Commissions</span>
        </div>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('month');
  const [customRange, setCustomRange] = useState(null);

  // Top Gyms Leaderboard Sample Data
  const topGyms = [
    { rank: 1, name: 'Powerhouse Gym', location: 'T. Nagar, Chennai', bookings: '1,420', revenue: '₹ 2.85L', rating: '4.9', growth: '+18.4%', badge: '🥇' },
    { rank: 2, name: 'FitZone Gym', location: 'Anna Nagar, Chennai', bookings: '1,180', revenue: '₹ 2.36L', rating: '4.8', growth: '+14.2%', badge: '🥈' },
    { rank: 3, name: 'Muscle Factory', location: 'Adyar, Chennai', bookings: '960', revenue: '₹ 1.92L', rating: '4.8', growth: '+11.6%', badge: '🥉' },
    { rank: 4, name: 'Iron Club', location: 'Velachery, Chennai', bookings: '840', revenue: '₹ 1.68L', rating: '4.7', growth: '+9.3%', badge: '4' },
  ];

  // Pending Approvals Queue Sample Data
  const pendingApprovals = [
    { id: 'GYM1045', name: 'FitZone Express', owner: 'Vikram Seth', location: 'OMR, Chennai', plan: 'Hybrid Plan', time: '20 mins ago', status: 'Pending Review' },
    { id: 'GYM1046', name: 'Olympia Fitness', owner: 'Kavita Reddy', location: 'Porur, Chennai', plan: 'App Only', time: '1 hour ago', status: 'Pending Review' },
    { id: 'GYM1047', name: 'Iron Dynasty', owner: 'Rajesh Nair', location: 'Tambaram, Chennai', plan: 'GMS Software', time: '3 hours ago', status: 'Pending Review' },
  ];

  // Real-time Activity Stream Sample Data
  const recentActivities = [
    { id: 1, title: 'New Customer Booking', desc: 'Arun Kumar booked FitZone Gym (Anna Nagar)', amount: '+ ₹ 350.00', time: '2 mins ago', type: 'booking' },
    { id: 2, title: 'Plan Upgrade', desc: 'Powerhouse Gym upgraded to Hybrid Quarterly Tier', amount: '+ ₹ 4,999.00', time: '14 mins ago', type: 'upgrade' },
    { id: 3, title: 'New Gym Onboarded', desc: 'Slam Fitness Velachery completed onboarding wizard', amount: 'Step 8/8 Completed', time: '38 mins ago', type: 'onboard' },
    { id: 4, title: 'Refund Processed', desc: 'Refund for BK100123 initiated to customer wallet', amount: '- ₹ 250.00', time: '1 hour ago', type: 'refund' },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', paddingBottom: 36 }}>
      {/* Top Header & Time Filter Bar */}
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
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: isDarkMode ? '#ffffff' : '#0f172a',
              margin: 0,
              letterSpacing: '-0.3px',
            }}
          >
            Super Admin Executive Command Center
          </h1>
          <div style={{ fontSize: 12, color: isDarkMode ? '#94a3b8' : '#64748b', marginTop: 2 }}>
            Real-time platform overview, financial performance & operations health
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {filterType === 'custom' && (
            <RangePicker
              onChange={(dates) => setCustomRange(dates)}
              format="DD MMM YYYY"
              style={{ borderRadius: 'var(--radius-base)' }}
              placeholder={['Start Date', 'End Date']}
            />
          )}

          <Select
            value={filterType}
            onChange={(val) => setFilterType(val)}
            style={{ width: 150 }}
            size="middle"
            suffixIcon={<CalendarOutlined style={{ color: '#6366f1' }} />}
          >
            <Option value="today">Today</Option>
            <Option value="week">This Week</Option>
            <Option value="month">This Month</Option>
            <Option value="custom">Custom Range</Option>
          </Select>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/onboarding')}
            style={{
              backgroundColor: '#4f46e5',
              borderColor: '#4f46e5',
              fontWeight: 700,
              borderRadius: 'var(--radius-base)',
            }}
          >
            Onboard New Gym
          </Button>
        </div>
      </div>

      {/* 1. EXECUTIVE KPI STRIP (4 KEY PLATFORM METRICS IN ONE LINE) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Metric 1: Total Platform GMV */}
        <Card
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-color)',
            borderRadius: 'var(--radius-base)',
          }}
          styles={{ body: { padding: '18px 20px' } }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              Total Platform GMV
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#22c55e',
                backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#eaf8ef',
                padding: '2px 8px',
                borderRadius: 6,
              }}
            >
              <ArrowUpOutlined style={{ fontSize: 10 }} /> +14.2%
            </span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2 }}>
            ₹ 47,50,860.00
          </div>
          <div style={{ fontSize: 11, color: isDarkMode ? '#64748b' : '#94a3b8', marginTop: 4 }}>
            Subscriptions + Booking gross volume
          </div>
        </Card>

        {/* Metric 2: Active Gym Partners */}
        <Card
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-color)',
            borderRadius: 'var(--radius-base)',
          }}
          styles={{ body: { padding: '18px 20px' } }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              Partner Gyms
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#6366f1',
                backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.15)' : '#f3effe',
                padding: '2px 8px',
                borderRadius: 6,
              }}
            >
              80.8% Active
            </span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2 }}>
            198 <span style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>/ 245 total</span>
          </div>
          <div style={{ fontSize: 11, color: isDarkMode ? '#64748b' : '#94a3b8', marginTop: 4 }}>
            16 added this month
          </div>
        </Card>

        {/* Metric 3: Total App Bookings */}
        <Card
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-color)',
            borderRadius: 'var(--radius-base)',
          }}
          styles={{ body: { padding: '18px 20px' } }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              Completed Workouts
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#22c55e',
                backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#eaf8ef',
                padding: '2px 8px',
                borderRadius: 6,
              }}
            >
              <ArrowUpOutlined style={{ fontSize: 10 }} /> +18.6%
            </span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2 }}>
            32,845
          </div>
          <div style={{ fontSize: 11, color: isDarkMode ? '#64748b' : '#94a3b8', marginTop: 4 }}>
            94.05% completion rate
          </div>
        </Card>

        {/* Metric 4: Pending Approvals Queue */}
        <Card
          style={{
            backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.08)' : '#fffbeb',
            borderColor: isDarkMode ? 'rgba(245, 158, 11, 0.3)' : '#fde68a',
            borderRadius: 'var(--radius-base)',
            cursor: 'pointer',
          }}
          styles={{ body: { padding: '18px 20px' } }}
          onClick={() => navigate('/admin/gyms')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#d97706' }}>
              Action Required
            </span>
            <Badge status="processing" color="#f59e0b" text={<span style={{ fontSize: 11, color: '#d97706', fontWeight: 700 }}>Review Now →</span>} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#b45309', lineHeight: 1.2 }}>
            18 Pending
          </div>
          <div style={{ fontSize: 11, color: '#d97706', marginTop: 4 }}>
            New gyms awaiting verification
          </div>
        </Card>
      </div>

      {/* 2. CORE 3D OVERVIEW & BOOKING PLATFORM CARDS */}
      <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
        {/* Left Card: Overview (Total Gyms) */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            styles={{ body: { padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' } }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  Gym Network Overview
                </span>
                <Button
                  type="link"
                  onClick={() => navigate('/admin/gyms')}
                  style={{ color: '#4f46e5', fontWeight: 700, fontSize: 12, padding: 0 }}
                >
                  Manage All Gyms <RightOutlined style={{ fontSize: 10 }} />
                </Button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '10px 0 20px 0' }}>
                <img
                  src={gym3dBuilding}
                  alt="3D Gym Building"
                  style={{
                    width: 125,
                    height: 125,
                    objectFit: 'cover',
                    borderRadius: 16,
                  }}
                />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                    Total Registered Gyms
                  </div>
                  <div style={{ fontSize: 44, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.1, margin: '4px 0' }}>
                    245
                  </div>
                  <div style={{ fontSize: 12, color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                    Across 18 cities & metropolitan hubs
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
                paddingTop: 16,
                borderTop: `1px solid ${isDarkMode ? '#1e293b' : '#f1f5f9'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.15)' : '#f3effe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <SafetyCertificateOutlined style={{ fontSize: 18, color: '#6366f1' }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                    Active
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    198
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fdeeed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <HourglassOutlined style={{ fontSize: 18, color: '#ef4444' }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                    Inactive
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    47
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#fef4e8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <PlusOutlined style={{ fontSize: 18, color: '#f59e0b' }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                    New (30d)
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    16
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Card: Booking Overview */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            styles={{ body: { padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' } }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  Booking Throughput & Fulfillment
                </span>
                <Button
                  type="link"
                  onClick={() => navigate('/admin/bookings')}
                  style={{ color: '#4f46e5', fontWeight: 700, fontSize: 12, padding: 0 }}
                >
                  View Bookings Ledger <RightOutlined style={{ fontSize: 10 }} />
                </Button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0 20px 0' }}>
                <div>
                  <div style={{ fontSize: 44, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.1, marginBottom: 6 }}>
                    32,845
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                    Total App Bookings Generated
                  </div>
                </div>
                <img
                  src={booking3dPhone}
                  alt="3D Booking Phone"
                  style={{
                    width: 125,
                    height: 125,
                    objectFit: 'cover',
                    borderRadius: 16,
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 10,
                paddingTop: 16,
                borderTop: `1px solid ${isDarkMode ? '#1e293b' : '#f1f5f9'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircleOutlined style={{ fontSize: 20, color: '#22c55e' }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                    Confirmed
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    18,642
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#22c55e' }}>
                    56.70%
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircleOutlined style={{ fontSize: 20, color: '#3b82f6' }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                    Completed
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    12,285
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#3b82f6' }}>
                    37.35%
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CloseCircleOutlined style={{ fontSize: 20, color: '#ef4444' }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                    Cancelled
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    1,256
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#ef4444' }}>
                    3.82%
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <StopOutlined style={{ fontSize: 20, color: '#f59e0b' }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                    No Show
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    662
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b' }}>
                    2.01%
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 3. REVENUE TREND & SUBSCRIPTION TIER INTELLIGENCE */}
      <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
        {/* Monthly Revenue Breakdown Chart */}
        <Col xs={24} lg={13}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
              height: '100%',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div>
                <span style={{ fontSize: 16, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  Platform Revenue Growth
                </span>
                <div style={{ fontSize: 12, color: isDarkMode ? '#94a3b8' : '#64748b', marginTop: 2 }}>
                  Monthly recurring subscriptions vs app booking fees (Last 6 Months)
                </div>
              </div>
              <Tag color="success" style={{ fontWeight: 700, borderRadius: 6 }}>
                +28.4% YoY Growth
              </Tag>
            </div>

            <RevenueBarChart isDarkMode={isDarkMode} />
          </Card>
        </Col>

        {/* Subscription Tier Distribution */}
        <Col xs={24} lg={11}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
              height: '100%',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#4f46e5' }}>
                Subscription Tier Share
              </span>
              <Button
                type="link"
                onClick={() => navigate('/admin/subscriptions')}
                style={{ color: '#4f46e5', fontWeight: 700, fontSize: 12, padding: 0 }}
              >
                View Partners <RightOutlined style={{ fontSize: 10 }} />
              </Button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: '0 0 170px', display: 'flex', justifyContent: 'center' }}>
                <SubscriptionDonutChart isDarkMode={isDarkMode} />
              </div>

              <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Hybrid Plan */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#e2e8f0' : '#1e293b' }}>
                      Hybrid Plan
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <strong style={{ fontSize: 14, color: isDarkMode ? '#fff' : '#0f172a' }}>128</strong>
                    <span style={{ fontSize: 12, color: isDarkMode ? '#94a3b8' : '#64748b' }}>52.2%</span>
                  </div>
                </div>

                {/* App Only Plan */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3b82f6' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#e2e8f0' : '#1e293b' }}>
                      App Only
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <strong style={{ fontSize: 14, color: isDarkMode ? '#fff' : '#0f172a' }}>72</strong>
                    <span style={{ fontSize: 12, color: isDarkMode ? '#94a3b8' : '#64748b' }}>29.4%</span>
                  </div>
                </div>

                {/* GMS Plan */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#6366f1' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#e2e8f0' : '#1e293b' }}>
                      GMS Software
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <strong style={{ fontSize: 14, color: isDarkMode ? '#fff' : '#0f172a' }}>28</strong>
                    <span style={{ fontSize: 12, color: isDarkMode ? '#94a3b8' : '#64748b' }}>11.4%</span>
                  </div>
                </div>

                {/* Listing Only */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f97316' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#e2e8f0' : '#1e293b' }}>
                      Listing Only
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <strong style={{ fontSize: 14, color: isDarkMode ? '#fff' : '#0f172a' }}>17</strong>
                    <span style={{ fontSize: 12, color: isDarkMode ? '#94a3b8' : '#64748b' }}>6.9%</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 4. OPERATIONAL COMMAND: GYM APPROVALS QUEUE & TOP GYMS LEADERBOARD */}
      <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
        {/* Left Column: Actionable Gym Approvals Queue */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
              height: '100%',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AuditOutlined style={{ fontSize: 18, color: '#f59e0b' }} />
                <span style={{ fontSize: 16, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  Pending Verification Queue
                </span>
              </div>
              <Button
                size="small"
                onClick={() => navigate('/admin/gyms')}
                style={{ borderRadius: 6, fontWeight: 700, color: '#4f46e5', borderColor: '#c7d2fe' }}
              >
                View All (18)
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pendingApprovals.map((gym, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 8,
                    backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
                    border: `1px solid ${isDarkMode ? '#222' : '#e2e8f0'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 8,
                        backgroundColor: '#0a0a0a',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: 13,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {gym.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: isDarkMode ? '#fff' : '#0f172a', fontSize: 13 }}>
                        {gym.name}
                      </div>
                      <div style={{ fontSize: 11, color: isDarkMode ? '#888' : '#64748b' }}>
                        {gym.owner} • {gym.location}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div>
                      <Tag color="warning" style={{ fontSize: 11, fontWeight: 700, borderRadius: 4, margin: 0 }}>
                        {gym.plan}
                      </Tag>
                      <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{gym.time}</div>
                    </div>
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => navigate('/admin/gyms')}
                      style={{ backgroundColor: '#4f46e5', borderColor: '#4f46e5', borderRadius: 6, fontWeight: 700, fontSize: 11 }}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Right Column: Top Performing Gyms Leaderboard */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
              height: '100%',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FireOutlined style={{ fontSize: 18, color: '#ea580c' }} />
                <span style={{ fontSize: 16, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  Top Performing Gym Partners
                </span>
              </div>
              <Tag color="purple" style={{ fontWeight: 700, borderRadius: 6 }}>
                Monthly Leaderboard
              </Tag>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topGyms.map((gym, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 8,
                    backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
                    border: `1px solid ${isDarkMode ? '#222' : '#e2e8f0'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, width: 24, textAlign: 'center' }}>
                      {gym.badge}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, color: isDarkMode ? '#fff' : '#0f172a', fontSize: 13 }}>
                        {gym.name}
                      </div>
                      <div style={{ fontSize: 11, color: isDarkMode ? '#888' : '#64748b' }}>
                        {gym.location}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 18, textAlign: 'right' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: isDarkMode ? '#fff' : '#0f172a' }}>
                        {gym.revenue}
                      </div>
                      <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>
                        {gym.growth}
                      </div>
                    </div>
                    <div style={{ minWidth: 50 }}>
                      <Tag color="gold" style={{ borderRadius: 4, fontWeight: 700, fontSize: 11 }}>
                        ⭐ {gym.rating}
                      </Tag>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 5. LIVE ACTIVITY FEED & SYSTEM HEALTH STATUS */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {/* Real-time Activity Stream */}
        <Col xs={24} lg={15}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
              height: '100%',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FieldTimeOutlined style={{ fontSize: 18, color: '#3b82f6' }} />
                <span style={{ fontSize: 16, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  Live Platform Activity Stream
                </span>
              </div>
              <Badge status="processing" text={<span style={{ fontSize: 12, color: '#22c55e', fontWeight: 700 }}>Live Feed</span>} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 8,
                    border: `1px solid ${isDarkMode ? '#222' : '#f1f5f9'}`,
                    backgroundColor: isDarkMode ? '#141414' : '#fafafa',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: act.type === 'booking' ? 'rgba(34, 197, 94, 0.15)' : act.type === 'upgrade' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: act.type === 'booking' ? '#22c55e' : act.type === 'upgrade' ? '#6366f1' : '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {act.type === 'booking' ? <CheckCircleOutlined /> : act.type === 'upgrade' ? <RiseOutlined /> : <ShopOutlined />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: isDarkMode ? '#fff' : '#0f172a' }}>
                        {act.title}
                      </div>
                      <div style={{ fontSize: 12, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                        {act.desc}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: act.amount.startsWith('+') ? '#22c55e' : act.amount.startsWith('-') ? '#ef4444' : '#6366f1' }}>
                      {act.amount}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                      {act.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* System Health & Infrastructure KPI */}
        <Col xs={24} lg={9}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
              height: '100%',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ThunderboltOutlined style={{ fontSize: 18, color: '#6366f1' }} />
                <span style={{ fontSize: 16, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  System Health & Uptime
                </span>
              </div>
              <Tag color="success" style={{ fontWeight: 700, borderRadius: 4 }}>
                100% Operational
              </Tag>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 600 }}>API Gateway Uptime</span>
                  <strong style={{ color: '#22c55e' }}>99.98%</strong>
                </div>
                <Progress percent={99.98} showInfo={false} strokeColor="#22c55e" size="small" />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 600 }}>Payment Success Rate (Razorpay / UPI)</span>
                  <strong style={{ color: '#6366f1' }}>98.60%</strong>
                </div>
                <Progress percent={98.6} showInfo={false} strokeColor="#6366f1" size="small" />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 600 }}>Push Notification Delivery</span>
                  <strong style={{ color: '#3b82f6' }}>99.20%</strong>
                </div>
                <Progress percent={99.2} showInfo={false} strokeColor="#3b82f6" size="small" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
                <div style={{ padding: '10px 12px', borderRadius: 8, backgroundColor: isDarkMode ? '#141414' : '#f8fafc', border: `1px solid ${isDarkMode ? '#222' : '#e2e8f0'}` }}>
                  <div style={{ fontSize: 11, color: '#888' }}>Avg. API Latency</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#22c55e', marginTop: 2 }}>42 ms</div>
                </div>
                <div style={{ padding: '10px 12px', borderRadius: 8, backgroundColor: isDarkMode ? '#141414' : '#f8fafc', border: `1px solid ${isDarkMode ? '#222' : '#e2e8f0'}` }}>
                  <div style={{ fontSize: 11, color: '#888' }}>Database Load</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#3b82f6', marginTop: 2 }}>24% Normal</div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 6. BOTTOM ROW: 3 Platform Metric Cards */}
      <Card
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-color)',
          borderRadius: 'var(--radius-base)',
          marginBottom: 24,
        }}
        styles={{ body: { padding: '20px 28px' } }}
      >
        <Row gutter={[24, 24]} align="middle">
          {/* Total Registered Users */}
          <Col xs={24} md={8}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
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
                  Total Registered Users
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                  18,450
                </div>
                <div style={{ fontSize: 11, color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                  Active platform-wide accounts
                </div>
              </div>
            </div>
          </Col>

          {/* Top App Opens */}
          <Col xs={24} md={8} style={{ borderLeft: isDarkMode ? '1px solid #1e293b' : '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, paddingLeft: 12 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.15)' : '#f3effe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <MobileOutlined style={{ fontSize: 24, color: '#6366f1' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  Total App Opens
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                  1,24,680
                </div>
                <div style={{ fontSize: 11, color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                  High customer engagement
                </div>
              </div>
            </div>
          </Col>

          {/* Total Bookings */}
          <Col xs={24} md={8} style={{ borderLeft: isDarkMode ? '1px solid #1e293b' : '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, paddingLeft: 12 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.15)' : '#f3effe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CalendarOutlined style={{ fontSize: 24, color: '#6366f1' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  Total Completed Sessions
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
                  32,845
                </div>
                <div style={{ fontSize: 11, color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                  Across all partner venues
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Footer Copyright */}
      <div style={{ textAlign: 'center', paddingBottom: 24, color: isDarkMode ? '#64748b' : '#94a3b8', fontSize: 13 }}>
        © 2026 GYMEZY Technologies Pvt. Ltd. All rights reserved.
      </div>
    </div>
  );
};

export default Dashboard;
