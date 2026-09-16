import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Table,
  Tag,
  Space,
  Typography,
  Badge,
  Modal,
  Avatar,
  message,
  Tabs,
  Alert,
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  QrcodeOutlined,
  ScanOutlined,
  LockOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  ClockCircleOutlined,
  ThunderboltOutlined,
  SafetyCertificateFilled,
  UserOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useTheme } from '../theme/ThemeContext';
import { recordCheckIn, recordCheckOut } from '../redux/slices/gymSlice';

const { Title, Text, Paragraph } = Typography;

export const QrCheckIn = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const { liveOccupancy, capacity, checkIns } = useSelector((state) => state.gym);

  const [otpInput, setOtpInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [lastValidation, setLastValidation] = useState(null);

  const handleVerifyOtp = (codeToVerify) => {
    const code = codeToVerify || otpInput;
    if (!code || code.length < 6) {
      message.warning('Please enter a valid 6-digit passcode');
      return;
    }

    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      let memberName = 'Sam Kumar';
      let passType = 'Annual VIP Membership Pass';
      let passId = 'MBR123456';
      let custId = 'CUST789012';

      if (code === '891423') {
        memberName = 'Priya Sharma';
        passType = 'Quarterly Membership Pass';
        passId = 'YSB654321';
        custId = 'CUST334190';
      } else if (code === '314958') {
        memberName = 'Ananya Reddy';
        passType = 'Zumba Batch Access Pass';
        passId = 'ZMB789012';
        custId = 'CUST901234';
      } else if (code === '721094') {
        memberName = 'Arun Kumar';
        passType = 'Gym Access • 7 Days Pass';
        passId = 'FSB998811';
        custId = 'CUST559012';
      }

      const newRecord = {
        key: Date.now().toString(),
        passId: passId,
        customerId: custId,
        memberName: memberName,
        type: passType,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: 'Today',
        otp: code,
        status: 'VERIFIED',
        method: 'Smart Scanner',
      };

      dispatch(recordCheckIn(newRecord));
      setLastValidation({
        success: true,
        record: newRecord,
      });
      message.success(`Gate 1 Unlocked! Verified ${memberName} (${passType}).`);
      setOtpInput('');
    }, 600);
  };

  const handleSimulateQrScan = (memberId, memberName, passType, passId) => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const newRecord = {
        key: Date.now().toString(),
        passId: passId,
        customerId: memberId,
        memberName: memberName,
        type: passType,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: 'Today',
        otp: generatedOtp,
        status: 'VERIFIED',
        method: 'QR Camera Sensor',
      };
      dispatch(recordCheckIn(newRecord));
      setLastValidation({
        success: true,
        record: newRecord,
      });
      message.success(`Turnstile QR Verified! Welcome ${memberName}.`);
    }, 700);
  };

  const columns = [
    {
      title: 'Pass ID & Member',
      key: 'member',
      render: (_, record) => (
        <Space size={12}>
          <Avatar style={{ backgroundColor: '#1677ff', fontWeight: 700 }}>
            {record.memberName.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
              {record.memberName}
            </div>
            <div style={{ fontSize: 12, color: '#1677ff', fontWeight: 600 }}>{record.passId}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Workout / Pass Plan',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Text style={{ color: isDarkMode ? '#cccccc' : '#334155' }}>{type}</Text>,
    },
    {
      title: 'Pass OTP',
      dataIndex: 'otp',
      key: 'otp',
      render: (otp) => (
        <Tag color="blue" style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13 }}>
          {otp}
        </Tag>
      ),
    },
    {
      title: 'Scan Timestamp',
      dataIndex: 'time',
      key: 'time',
      render: (time) => (
        <span style={{ fontSize: 13, color: isDarkMode ? '#cccccc' : '#475569' }}>
          <ClockCircleOutlined style={{ color: '#1677ff', marginRight: 6 }} />
          {time}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color="success" style={{ fontWeight: 700, borderRadius: 6 }}>
          <CheckCircleFilled /> {status}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <Title level={2} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a', fontWeight: 650 }}>
          QR Turnstile & Fast Check-In
        </Title>
        <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 14 }}>
          Live turnstile controller for incoming workout members and visitors
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column: Interactive QR Camera Scanner & Fast OTP Entry */}
        <Col xs={24} lg={10}>
          <Card
            style={{
              backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff',
              borderColor: isDarkMode ? '#222222' : '#e2e8f0',
              borderRadius: 'var(--radius-base)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              marginBottom: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ScanOutlined style={{ color: '#1677ff', fontSize: 20 }} />
                <span style={{ fontWeight: 700, fontSize: 16, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  Turnstile Scanner Gate #01
                </span>
              </div>
              <Badge status="processing" text={<span style={{ color: '#00bf62', fontWeight: 700 }}>ONLINE</span>} />
            </div>

            {/* Simulated Live Camera Viewfinder */}
            <div
              style={{
                height: 240,
                borderRadius: 'var(--radius-base)',
                backgroundColor: isDarkMode ? '#050505' : '#1e293b',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #1677ff',
                overflow: 'hidden',
                marginBottom: 20,
              }}
            >
              {/* Scan target box */}
              <div
                style={{
                  width: 140,
                  height: 140,
                  border: '2px solid #00bf62',
                  borderRadius: 'var(--radius-base)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  backgroundColor: 'rgba(0, 191, 98, 0.08)',
                }}
              >
                <QrcodeOutlined style={{ fontSize: 64, color: scanning ? '#00bf62' : '#ffffff', opacity: 0.8 }} />
              </div>

              {/* Status text inside camera viewfinder */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  color: '#94a3b8',
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <ThunderboltOutlined style={{ color: '#1677ff' }} />
                <span>{scanning ? 'Verifying dynamic QR pass...' : 'Align user app QR code within frame'}</span>
              </div>
            </div>

            {/* Quick Demo QR Scan Buttons */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#888888' : '#64748b', marginBottom: 8 }}>
                TEST SIMULATE MEMBER APP SCAN:
              </div>
              <Space wrap size={8}>
                <Button
                  size="small"
                  onClick={() => handleSimulateQrScan('CUST789012', 'Sam Kumar', 'Annual VIP Pass', 'MBR123456')}
                  style={{ fontSize: 12, borderRadius: 8 }}
                >
                  Scan Sam (VIP)
                </Button>
                <Button
                  size="small"
                  onClick={() => handleSimulateQrScan('CUST334190', 'Priya Sharma', 'Yoga Batch Pass', 'YSB654321')}
                  style={{ fontSize: 12, borderRadius: 8 }}
                >
                  Scan Priya (Yoga)
                </Button>
                <Button
                  size="small"
                  onClick={() => handleSimulateQrScan('CUST901234', 'Ananya Reddy', 'Zumba Pass', 'ZMB789012')}
                  style={{ fontSize: 12, borderRadius: 8 }}
                >
                  Scan Ananya (Zumba)
                </Button>
              </Space>
            </div>

            {/* Manual 6-Digit OTP Form */}
            <div style={{ borderTop: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`, paddingTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 8 }}>
                Or Enter Pass 6-Digit OTP:
              </div>
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  size="large"
                  prefix={<LockOutlined style={{ color: '#1677ff' }} />}
                  placeholder="e.g. 642189"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  style={{
                    letterSpacing: '4px',
                    fontSize: 18,
                    fontWeight: 700,
                    backgroundColor: isDarkMode ? '#141414' : '#ffffff',
                    borderColor: isDarkMode ? '#333333' : '#d9d9d9',
                    color: isDarkMode ? '#ffffff' : '#0f172a',
                  }}
                />
                <Button
                  type="primary"
                  size="large"
                  loading={scanning}
                  onClick={() => handleVerifyOtp()}
                  style={{
                    backgroundColor: '#003882',
                    borderColor: '#003882',
                    fontWeight: 700,
                    padding: '0 24px',
                  }}
                >
                  Verify
                </Button>
              </Space.Compact>
            </div>
          </Card>

          {/* Validation Result Box */}
          {lastValidation && (
            <Card
              style={{
                backgroundColor: isDarkMode ? 'rgba(0, 191, 98, 0.08)' : '#f6ffed',
                borderColor: '#52c41a',
                borderRadius: 'var(--radius-base)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircleFilled style={{ color: '#00bf62', fontSize: 28 }} />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    Access Granted • Turnstile 1 Open
                  </div>
                  <div style={{ fontSize: 13, color: isDarkMode ? '#cccccc' : '#475569', marginTop: 2 }}>
                    {lastValidation.record.memberName} • {lastValidation.record.type}
                  </div>
                  <div style={{ fontSize: 11, color: '#00bf62', fontWeight: 600, marginTop: 4 }}>
                    Pass ID: {lastValidation.record.passId} • Checked in at {lastValidation.record.time}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </Col>

        {/* Right Column: Live Pass Check-In History & Gate Overrides */}
        <Col xs={24} lg={14}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  <SafetyCertificateFilled style={{ color: '#00bf62' }} />
                  <span>Today's Verified Pass Ledger ({checkIns.length} check-ins)</span>
                </div>
                <Space size={8}>
                  <Button
                    size="small"
                    danger
                    onClick={() => {
                      dispatch(recordCheckOut());
                      message.info('Member check-out logged from Turnstile Exit.');
                    }}
                  >
                    Log Gate Exit
                  </Button>
                </Space>
              </div>
            }
            style={{
              backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff',
              borderColor: isDarkMode ? '#222222' : '#e2e8f0',
              borderRadius: 'var(--radius-base)',
            }}
          >
            <Table
              columns={columns}
              dataSource={checkIns}
              pagination={{ pageSize: 6 }}
              size="middle"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default QrCheckIn;
