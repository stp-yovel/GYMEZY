import React, { useState, useMemo } from 'react';
import {
  Row,
  Col,
  Card,
  Select,
  Button,
  DatePicker,
  Tag,
  Progress,
  Badge,
  Tooltip,
  Empty,
  Spin,
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
  TeamOutlined,
  MobileOutlined,
  ThunderboltOutlined,
  AuditOutlined,
  FireOutlined,
  SyncOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import { useDashboard } from '../hooks/useDashboard';
import gym3dBuilding from '../assets/images/gym_3d_building.jpg';
import booking3dPhone from '../assets/images/booking_3d_phone.jpg';

const { Option } = Select;
const { RangePicker } = DatePicker;

// Currency formatter utility
const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

// Clean Donut Chart Component
const SubscriptionDonutChart = ({ isDarkMode, data = {} }) => {
  const r = 70;
  const c = 2 * Math.PI * r;

  const total = (data.hybrid || 0) + (data.appOnly || 0) + (data.gms || 0) + (data.listing || 0);

  const hybridPct = total > 0 ? (data.hybrid || 0) / total : 0;
  const appOnlyPct = total > 0 ? (data.appOnly || 0) / total : 0;
  const gmsPct = total > 0 ? (data.gms || 0) / total : 0;
  const listingPct = total > 0 ? (data.listing || 0) / total : 0;

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
        {total > 0 && (
          <>
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
          </>
        )}
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
        <CrownOutlined style={{ fontSize: 30, color: total > 0 ? '#6366f1' : '#94a3b8' }} />
      </div>
    </div>
  );
};

// Revenue Monthly Bar Chart Component
const RevenueBarChart = ({ isDarkMode, data = [] }) => {
  const months = data.length > 0 ? data : [
    { name: 'Jan', subscription: 0, commission: 0, total: 0 },
    { name: 'Feb', subscription: 0, commission: 0, total: 0 },
    { name: 'Mar', subscription: 0, commission: 0, total: 0 },
    { name: 'Apr', subscription: 0, commission: 0, total: 0 },
    { name: 'May', subscription: 0, commission: 0, total: 0 },
    { name: 'Jun', subscription: 0, commission: 0, total: 0 },
  ];

  const maxVal = Math.max(50, ...months.map((m) => m.total || 0));

  return (
    <div style={{ width: '100%', paddingTop: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 160, gap: 12, paddingBottom: 10 }}>
        {months.map((m, idx) => {
          const subHeight = maxVal > 0 ? (m.subscription / maxVal) * 130 : 0;
          const commHeight = maxVal > 0 ? (m.commission / maxVal) * 130 : 0;
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

  const filterParams = useMemo(() => {
    return {
      filterType,
      startDate: customRange?.[0] ? customRange[0].toISOString() : undefined,
      endDate: customRange?.[1] ? customRange[1].toISOString() : undefined,
    };
  }, [filterType, customRange]);

  const { stats, loading, refreshDashboard } = useDashboard(filterParams);

  const totalGyms = stats.totalGyms || 0;
  const activeGyms = stats.activeGyms || 0;
  const activeGymsPct = stats.activeGymsPct || 0;
  const completedWorkouts = stats.completedWorkouts || 0;
  const completionRate = stats.completionRate || 0;
  const pendingApprovalsCount = stats.pendingApprovalsCount || 0;

  const totalBookings = stats.bookings?.total || 0;
  const confirmedPct = totalBookings > 0 ? (((stats.bookings?.confirmed || 0) / totalBookings) * 100).toFixed(1) : 0;
  const completedPct = totalBookings > 0 ? (((stats.bookings?.completed || 0) / totalBookings) * 100).toFixed(1) : 0;
  const cancelledPct = totalBookings > 0 ? (((stats.bookings?.cancelled || 0) / totalBookings) * 100).toFixed(1) : 0;
  const noShowPct = totalBookings > 0 ? (((stats.bookings?.noShow || 0) / totalBookings) * 100).toFixed(1) : 0;

  const totalSubs = (stats.subscriptionShare?.hybrid || 0) +
    (stats.subscriptionShare?.appOnly || 0) +
    (stats.subscriptionShare?.gms || 0) +
    (stats.subscriptionShare?.listing || 0);

  const hybridPct = totalSubs > 0 ? (((stats.subscriptionShare?.hybrid || 0) / totalSubs) * 100).toFixed(1) : '0.0';
  const appOnlyPct = totalSubs > 0 ? (((stats.subscriptionShare?.appOnly || 0) / totalSubs) * 100).toFixed(1) : '0.0';
  const gmsPct = totalSubs > 0 ? (((stats.subscriptionShare?.gms || 0) / totalSubs) * 100).toFixed(1) : '0.0';
  const listingPct = totalSubs > 0 ? (((stats.subscriptionShare?.listing || 0) / totalSubs) * 100).toFixed(1) : '0.0';

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
            icon={<SyncOutlined spin={loading} />}
            onClick={refreshDashboard}
            style={{ borderRadius: 'var(--radius-base)' }}
          >
            Refresh
          </Button>

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

      <Spin spinning={loading} tip="Fetching live platform data...">
        {/* 1. EXECUTIVE KPI STRIP (4 KEY PLATFORM METRICS) */}
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
                  color: '#94a3b8',
                  backgroundColor: isDarkMode ? 'rgba(148, 163, 184, 0.15)' : '#f1f5f9',
                  padding: '2px 8px',
                  borderRadius: 6,
                }}
              >
                0.0%
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2 }}>
              {formatCurrency(stats.totalGmv || 0)}
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
                {activeGymsPct}% Active
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2 }}>
              {activeGyms} <span style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>/ {totalGyms} total</span>
            </div>
            <div style={{ fontSize: 11, color: isDarkMode ? '#64748b' : '#94a3b8', marginTop: 4 }}>
              {stats.registeredGyms?.new30d || 0} added this month
            </div>
          </Card>

          {/* Metric 3: Total Completed Workouts */}
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
                  color: '#94a3b8',
                  backgroundColor: isDarkMode ? 'rgba(148, 163, 184, 0.15)' : '#f1f5f9',
                  padding: '2px 8px',
                  borderRadius: 6,
                }}
              >
                0.0%
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2 }}>
              {completedWorkouts.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: 11, color: isDarkMode ? '#64748b' : '#94a3b8', marginTop: 4 }}>
              {completionRate}% completion rate
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
              <Badge status="default" text={<span style={{ fontSize: 11, color: '#d97706', fontWeight: 700 }}>Review Now →</span>} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#b45309', lineHeight: 1.2 }}>
              {pendingApprovalsCount} Pending
            </div>
            <div style={{ fontSize: 11, color: '#d97706', marginTop: 4 }}>
              New gyms awaiting verification
            </div>
          </Card>
        </div>

        {/* 2. CORE 3D OVERVIEW & BOOKING PLATFORM CARDS */}
        <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
          {/* Left Card: Gym Network Overview */}
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
                      {stats.registeredGyms?.total || 0}
                    </div>
                    <div style={{ fontSize: 12, color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                      Across active metropolitan fitness hubs
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
                      {stats.registeredGyms?.active || 0}
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
                      {stats.registeredGyms?.inactive || 0}
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
                      {stats.registeredGyms?.new30d || 0}
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
                      {totalBookings.toLocaleString('en-IN')}
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
                      {stats.bookings?.confirmed || 0}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#22c55e' }}>
                      {confirmedPct}%
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
                      {stats.bookings?.completed || 0}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#3b82f6' }}>
                      {completedPct}%
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
                      {stats.bookings?.cancelled || 0}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#ef4444' }}>
                      {cancelledPct}%
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
                      {stats.bookings?.noShow || 0}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b' }}>
                      {noShowPct}%
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
                    Monthly recurring subscriptions vs app booking fees
                  </div>
                </div>
                <Tag color="default" style={{ fontWeight: 700, borderRadius: 6 }}>
                  0.0% Growth
                </Tag>
              </div>

              <RevenueBarChart isDarkMode={isDarkMode} data={stats.revenueMonthly || []} />
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
                  <SubscriptionDonutChart isDarkMode={isDarkMode} data={stats.subscriptionShare} />
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
                      <strong style={{ fontSize: 14, color: isDarkMode ? '#fff' : '#0f172a' }}>
                        {stats.subscriptionShare?.hybrid || 0}
                      </strong>
                      <span style={{ fontSize: 12, color: isDarkMode ? '#94a3b8' : '#64748b' }}>{hybridPct}%</span>
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
                      <strong style={{ fontSize: 14, color: isDarkMode ? '#fff' : '#0f172a' }}>
                        {stats.subscriptionShare?.appOnly || 0}
                      </strong>
                      <span style={{ fontSize: 12, color: isDarkMode ? '#94a3b8' : '#64748b' }}>{appOnlyPct}%</span>
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
                      <strong style={{ fontSize: 14, color: isDarkMode ? '#fff' : '#0f172a' }}>
                        {stats.subscriptionShare?.gms || 0}
                      </strong>
                      <span style={{ fontSize: 12, color: isDarkMode ? '#94a3b8' : '#64748b' }}>{gmsPct}%</span>
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
                      <strong style={{ fontSize: 14, color: isDarkMode ? '#fff' : '#0f172a' }}>
                        {stats.subscriptionShare?.listing || 0}
                      </strong>
                      <span style={{ fontSize: 12, color: isDarkMode ? '#94a3b8' : '#64748b' }}>{listingPct}%</span>
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
                  View All ({stats.pendingApprovals?.length || 0})
                </Button>
              </div>

              {stats.pendingApprovals && stats.pendingApprovals.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {stats.pendingApprovals.map((gym, idx) => (
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
                      <div>
                        <div style={{ fontWeight: 700, color: isDarkMode ? '#fff' : '#0f172a', fontSize: 13 }}>
                          {gym.name}
                        </div>
                        <div style={{ fontSize: 11, color: isDarkMode ? '#888' : '#64748b' }}>
                          {gym.city} • {gym.phone}
                        </div>
                      </div>
                      <Tag color="orange">{gym.subscriptionType || 'Pending'}</Tag>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span style={{ color: isDarkMode ? '#888' : '#64748b', fontSize: 13 }}>
                      No pending gym onboarding applications to review
                    </span>
                  }
                />
              )}
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

              {stats.topGyms && stats.topGyms.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {stats.topGyms.map((gym, idx) => (
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontWeight: 800, color: '#6366f1', width: 18 }}>#{idx + 1}</span>
                        <div>
                          <div style={{ fontWeight: 700, color: isDarkMode ? '#fff' : '#0f172a', fontSize: 13 }}>
                            {gym.name}
                          </div>
                          <div style={{ fontSize: 11, color: isDarkMode ? '#888' : '#64748b' }}>
                            {gym.city} • {gym.membersCount || 0} members
                          </div>
                        </div>
                      </div>
                      <Tag color="green">★ {gym.rating || 0}</Tag>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span style={{ color: isDarkMode ? '#888' : '#64748b', fontSize: 13 }}>
                      No gym partner performance records available yet
                    </span>
                  }
                />
              )}
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

              {stats.recentActivities && stats.recentActivities.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {stats.recentActivities.map((act, idx) => (
                    <div key={idx}>{act.title}</div>
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span style={{ color: isDarkMode ? '#888' : '#64748b', fontSize: 13 }}>
                      No recent platform bookings or transactions recorded yet
                    </span>
                  }
                />
              )}
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
                    <strong style={{ color: '#22c55e' }}>{stats.systemHealth?.apiUptime || 100}%</strong>
                  </div>
                  <Progress percent={stats.systemHealth?.apiUptime || 100} showInfo={false} strokeColor="#22c55e" size="small" />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 600 }}>Payment Gateway Health</span>
                    <strong style={{ color: '#6366f1' }}>{stats.systemHealth?.paymentGateway || 100}%</strong>
                  </div>
                  <Progress percent={stats.systemHealth?.paymentGateway || 100} showInfo={false} strokeColor="#6366f1" size="small" />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 600 }}>Push Notification Engine</span>
                    <strong style={{ color: '#3b82f6' }}>{stats.systemHealth?.notificationEngine || 100}%</strong>
                  </div>
                  <Progress percent={stats.systemHealth?.notificationEngine || 100} showInfo={false} strokeColor="#3b82f6" size="small" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
                  <div style={{ padding: '10px 12px', borderRadius: 8, backgroundColor: isDarkMode ? '#141414' : '#f8fafc', border: `1px solid ${isDarkMode ? '#222' : '#e2e8f0'}` }}>
                    <div style={{ fontSize: 11, color: '#888' }}>Backend Cluster</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#22c55e', marginTop: 2 }}>
                      {stats.systemHealth?.backendStatus || 'Online'}
                    </div>
                  </div>
                  <div style={{ padding: '10px 12px', borderRadius: 8, backgroundColor: isDarkMode ? '#141414' : '#f8fafc', border: `1px solid ${isDarkMode ? '#222' : '#e2e8f0'}` }}>
                    <div style={{ fontSize: 11, color: '#888' }}>Database Cluster</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#3b82f6', marginTop: 2 }}>
                      {stats.systemHealth?.databaseStatus || 'Connected'}
                    </div>
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
                    {stats.registeredUsers || 0}
                  </div>
                  <div style={{ fontSize: 11, color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                    Active platform-wide accounts
                  </div>
                </div>
              </div>
            </Col>

            {/* Total App Opens */}
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
                    {stats.totalAppOpens || 0}
                  </div>
                  <div style={{ fontSize: 11, color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                    Customer engagement metrics
                  </div>
                </div>
              </div>
            </Col>

            {/* Total Completed Sessions */}
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
                    {stats.completedSessions || 0}
                  </div>
                  <div style={{ fontSize: 11, color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                    Across all partner venues
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </Spin>

      {/* Footer Copyright */}
      <div style={{ textAlign: 'center', paddingBottom: 24, color: isDarkMode ? '#64748b' : '#94a3b8', fontSize: 13 }}>
        © {new Date().getFullYear()} GYMEZY Technologies Pvt. Ltd. All rights reserved.
      </div>
    </div>
  );
};

export default Dashboard;
