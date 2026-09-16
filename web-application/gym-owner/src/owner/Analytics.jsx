import React from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Typography,
  Tag,
  Space,
  Table,
} from 'antd';
import {
  DollarCircleOutlined,
  RiseOutlined,
  FireOutlined,
  UsergroupAddOutlined,
  LineChartOutlined,
  ThunderboltFilled,
} from '@ant-design/icons';
import { useTheme } from '../theme/ThemeContext';

const { Title, Text, Paragraph } = Typography;

export const Analytics = () => {
  const { isDarkMode } = useTheme();

  const hourlyFootfall = [
    { time: '05:30 - 07:00 AM', load: 85, tag: 'High Peak' },
    { time: '07:00 - 09:00 AM', load: 95, tag: 'Max Peak' },
    { time: '09:00 - 12:00 PM', load: 40, tag: 'Moderate' },
    { time: '12:00 - 04:00 PM', load: 20, tag: 'Low' },
    { time: '04:00 - 06:00 PM', load: 60, tag: 'Moderate' },
    { time: '06:00 - 09:00 PM', load: 98, tag: 'Max Peak' },
    { time: '09:00 - 10:30 PM', load: 45, tag: 'Moderate' },
  ];

  const planRevenueBreakdown = [
    { name: 'Annual VIP Membership', amount: '₹2,16,000', share: 45, color: '#1677ff' },
    { name: 'Quarterly Membership', amount: '₹1,44,000', share: 30, color: '#00bf62' },
    { name: 'Monthly Membership', amount: '₹96,000', share: 20, color: '#fa8c16' },
    { name: 'Single Day / App Passes', amount: '₹26,450', share: 5, color: '#722ed1' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <Title level={2} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a', fontWeight: 650 }}>
          Occupancy Density & Financial Analytics
        </Title>
        <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 14 }}>
          Data-driven operational metrics, member retention stats, and hourly occupancy trends.
        </Text>
      </div>

      {/* Top Metrics Row */}
      <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff', borderColor: isDarkMode ? '#222222' : '#e2e8f0', borderRadius: 'var(--radius-base)' }}>
            <Statistic
              title={<span style={{ color: isDarkMode ? '#888888' : '#64748b' }}>Total Gross Revenue</span>}
              value="₹4,82,450"
              valueStyle={{ color: '#00bf62', fontWeight: 800, fontSize: 28 }}
              prefix={<DollarCircleOutlined />}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#00bf62', display: 'flex', alignItems: 'center', gap: 4 }}>
              <RiseOutlined /> +14.8% vs last month
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff', borderColor: isDarkMode ? '#222222' : '#e2e8f0', borderRadius: 'var(--radius-base)' }}>
            <Statistic
              title={<span style={{ color: isDarkMode ? '#888888' : '#64748b' }}>Monthly Footfall Check-Ins</span>}
              value="4,920"
              valueStyle={{ color: '#1677ff', fontWeight: 800, fontSize: 28 }}
              prefix={<LineChartOutlined />}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#1677ff', display: 'flex', alignItems: 'center', gap: 4 }}>
              <RiseOutlined /> +8.2% attendance growth
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff', borderColor: isDarkMode ? '#222222' : '#e2e8f0', borderRadius: 'var(--radius-base)' }}>
            <Statistic
              title={<span style={{ color: isDarkMode ? '#888888' : '#64748b' }}>Average Member LTV</span>}
              value="₹8,450"
              valueStyle={{ color: '#fa8c16', fontWeight: 800, fontSize: 28 }}
              prefix={<UsergroupAddOutlined />}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>
              High subscription retention
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff', borderColor: isDarkMode ? '#222222' : '#e2e8f0', borderRadius: 'var(--radius-base)' }}>
            <Statistic
              title={<span style={{ color: isDarkMode ? '#888888' : '#64748b' }}>Turnstile Pass Success Rate</span>}
              value="99.8%"
              valueStyle={{ color: '#722ed1', fontWeight: 800, fontSize: 28 }}
              prefix={<ThunderboltFilled />}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#00bf62' }}>
              Zero false rejections
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts / Breakdown Section */}
      <Row gutter={[24, 24]}>
        {/* Hourly Footfall Heatmap */}
        <Col xs={24} lg={12}>
          <Card
            title={<span style={{ color: isDarkMode ? '#ffffff' : '#0f172a' }}>Daily Peak Hours & Floor Density</span>}
            style={{
              backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff',
              borderColor: isDarkMode ? '#222222' : '#e2e8f0',
              borderRadius: 'var(--radius-base)',
              height: '100%',
            }}
          >
            <Paragraph style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13, marginBottom: 20 }}>
              Average floor density across operating time windows throughout the current week.
            </Paragraph>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {hourlyFootfall.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                    <span style={{ fontWeight: 600, color: isDarkMode ? '#dddddd' : '#334155' }}>
                      {item.time}
                    </span>
                    <Space size={8}>
                      <span style={{ fontWeight: 700, color: item.load > 80 ? '#ff4d4f' : '#1677ff' }}>
                        {item.load}% Density
                      </span>
                      <Tag color={item.load > 80 ? 'error' : item.load > 50 ? 'blue' : 'default'} style={{ margin: 0 }}>
                        {item.tag}
                      </Tag>
                    </Space>
                  </div>
                  <Progress
                    percent={item.load}
                    showInfo={false}
                    strokeColor={item.load > 80 ? '#ff4d4f' : item.load > 50 ? '#1677ff' : '#00bf62'}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Revenue Distribution by Membership Type */}
        <Col xs={24} lg={12}>
          <Card
            title={<span style={{ color: isDarkMode ? '#ffffff' : '#0f172a' }}>Revenue Share by Membership Tier</span>}
            style={{
              backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff',
              borderColor: isDarkMode ? '#222222' : '#e2e8f0',
              borderRadius: 'var(--radius-base)',
              height: '100%',
            }}
          >
            <Paragraph style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13, marginBottom: 24 }}>
              Monthly income distribution across all active plan categories.
            </Paragraph>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {planRevenueBreakdown.map((plan, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-base)',
                    backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
                    border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', fontSize: 14 }}>
                      {plan.name}
                    </div>
                    <div style={{ fontWeight: 800, color: plan.color, fontSize: 15 }}>
                      {plan.amount} ({plan.share}%)
                    </div>
                  </div>
                  <Progress percent={plan.share} strokeColor={plan.color} showInfo={false} />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
