import React, { useState, useRef, useEffect } from 'react';
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
  Avatar,
  message,
  Segmented,
  Tooltip,
  Divider,
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  QrcodeOutlined,
  ScanOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  ClockCircleOutlined,
  ThunderboltOutlined,
  UserOutlined,
  SafetyCertificateFilled,
  LockOutlined,
  UnlockOutlined,
  VideoCameraOutlined,
  LoadingOutlined,
  StopOutlined,
  BarcodeOutlined,
  ArrowRightOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import confetti from 'canvas-confetti';
import { useTheme } from '../theme/ThemeContext';
import { recordCheckIn, recordCheckOut } from '../redux/slices/gymSlice';

const { Title, Text } = Typography;

// Initial sample check-in logs
const INITIAL_LOGS = [
  {
    key: 'log-1',
    passId: 'MBR-2024-089',
    memberName: 'Rahul Verma',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
    plan: 'Annual VIP Pass',
    time: '11:58 AM',
    otp: '942185',
    status: 'GRANTED',
    method: 'QR Code',
    planExpiry: '14 Dec 2026',
  },
  {
    key: 'log-2',
    passId: 'MBR-2024-042',
    memberName: 'Sneha Patel',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    plan: 'Monthly Strength & Cardio',
    time: '11:54 AM',
    otp: '618304',
    status: 'GRANTED',
    method: 'OTP Passcode',
    planExpiry: '28 Oct 2026',
  },
  {
    key: 'log-3',
    passId: 'WLK-2024-105',
    memberName: 'Pooja Sundaram',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop',
    plan: 'Daily Walk-In Day Pass',
    time: '11:42 AM',
    otp: '502917',
    status: 'GRANTED',
    method: 'OTP Passcode',
    planExpiry: 'Today (Midnight)',
  },
  {
    key: 'log-4',
    passId: 'MBR-2022-310',
    memberName: 'Vikram Malhotra',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    plan: 'Annual VIP Pass',
    time: '11:35 AM',
    otp: '119284',
    status: 'DENIED',
    method: 'QR Code',
    denialReason: 'Membership Expired',
    planExpiry: '13 Sep 2026 (Expired)',
  },
];

export const QrCheckIn = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const { liveOccupancy: reduxOccupancy, capacity: reduxCapacity } = useSelector((state) => state.gym || {});

  const [occupancy, setOccupancy] = useState(reduxOccupancy || 42);
  const totalCapacity = reduxCapacity || 120;
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [activeOption, setActiveOption] = useState('qr'); // 'qr' | 'otp'
  const [otpInput, setOtpInput] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Live Camera WebRTC State
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [cameraState, setCameraState] = useState('idle'); // 'idle' | 'requesting' | 'active' | 'denied'

  const [lastVerified, setLastVerified] = useState({
    status: 'GRANTED',
    memberName: 'Rahul Verma',
    passId: 'MBR-2024-089',
    plan: 'Annual VIP Pass',
    time: '11:58 AM',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
    method: 'QR Code',
    planExpiry: '14 Dec 2026',
  });

  const fireSuccessConfetti = () => {
    try {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.7 },
        colors: ['#52c41a', '#1677ff', '#faad14'],
      });
    } catch (e) {
      // safe fallback
    }
  };

  // Start Camera
  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      message.error('Camera API not supported in this browser environment.');
      setCameraState('denied');
      return;
    }

    setCameraState('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraState('active');
    } catch (err) {
      setCameraState('denied');
      message.warning('Camera permission was not granted.');
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraState('idle');
  };

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (cameraState === 'active' && videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
    }
  }, [cameraState]);

  // Member verification
  const handleVerify = (customData = null) => {
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);

      if (customData?.isDenied) {
        const deniedItem = {
          key: `log-${Date.now()}`,
          passId: customData.passId || 'MBR-DENIED',
          memberName: customData.memberName || 'Vikram Malhotra',
          avatar: customData.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
          plan: customData.plan || 'Annual Pass (Expired)',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          otp: customData.otp || '119284',
          status: 'DENIED',
          denialReason: customData.reason || 'Membership Expired',
          method: customData.method || (activeOption === 'otp' ? 'OTP Passcode' : 'QR Code'),
          planExpiry: 'Expired',
        };

        setLogs((prev) => [deniedItem, ...prev]);
        setLastVerified(deniedItem);
        message.error(`Access Denied: ${deniedItem.memberName}'s membership is expired.`);
        return;
      }

      const verifiedItem = {
        key: `log-${Date.now()}`,
        passId: customData?.passId || (otpInput ? `OTP-${otpInput}` : `MBR-${Math.floor(1000 + Math.random() * 9000)}`),
        memberName: customData?.memberName || (otpInput === '618304' ? 'Sneha Patel' : otpInput === '502917' ? 'Pooja Sundaram' : 'Ananya Reddy'),
        avatar: customData?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
        plan: customData?.plan || (otpInput === '502917' ? 'Daily Walk-In Pass' : 'VIP Platinum All-Access'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        otp: customData?.otp || otpInput || Math.floor(100000 + Math.random() * 900000).toString(),
        status: 'GRANTED',
        method: customData?.method || (activeOption === 'otp' ? 'OTP Passcode' : 'QR Code'),
        planExpiry: '30 Dec 2026',
      };

      setLogs((prev) => [verifiedItem, ...prev]);
      setLastVerified(verifiedItem);
      setOccupancy((prev) => Math.min(totalCapacity, prev + 1));
      dispatch(recordCheckIn(verifiedItem));
      message.success(`Access Granted: ${verifiedItem.memberName}`);
      fireSuccessConfetti();
      setOtpInput('');
      setManualInput('');
    }, 300);
  };

  const handleManualExit = (record) => {
    const exitItem = {
      key: `log-${Date.now()}`,
      passId: record?.passId || 'MBR-EXIT',
      memberName: record?.memberName || 'Member',
      avatar: record?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      plan: record?.plan || 'Regular Pass',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      otp: '---',
      status: 'CHECKED_OUT',
      method: 'Turnstile Exit',
      planExpiry: 'Active',
    };

    setLogs((prev) => [exitItem, ...prev]);
    setOccupancy((prev) => Math.max(0, prev - 1));
    dispatch(recordCheckOut());
    message.info(`Exit recorded for ${record.memberName}`);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 32 }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a', fontWeight: 700 }}>
            QR Turnstile & Fast Check-In
          </Title>
          <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13.5 }}>
            Verify member access through optical QR Scanner or OTP passcode.
          </Text>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
              border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`,
              borderRadius: 'var(--radius-base)',
              fontSize: 12.5,
              fontWeight: 600,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#52c41a' }} />
            <span style={{ color: isDarkMode ? '#ffffff' : '#0f172a' }}>Gate 01 Online</span>
          </div>

          <div
            style={{
              padding: '6px 14px',
              backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
              border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`,
              borderRadius: 'var(--radius-base)',
              fontSize: 12.5,
              fontWeight: 600,
              color: isDarkMode ? '#cccccc' : '#475569',
            }}
          >
            Floor Occupancy: <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{occupancy}</span> / {totalCapacity}
          </div>
        </div>
      </div>

      {/* Main Verification Row */}
      <Row gutter={[20, 20]}>
        {/* Left Column: Verification Terminal */}
        <Col xs={24} lg={13}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
              height: '100%',
            }}
            styles={{ body: { padding: '22px' } }}
          >
            {/* 2-Option Segmented Control */}
            <Segmented
              block
              size="large"
              value={activeOption}
              onChange={(val) => {
                setActiveOption(val);
                if (val === 'otp') {
                  stopCamera();
                }
              }}
              options={[
                {
                  label: (
                    <div style={{ padding: '4px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 600 }}>
                      <ScanOutlined style={{ fontSize: 16 }} />
                      <span>Scan QR Code</span>
                    </div>
                  ),
                  value: 'qr',
                },
                {
                  label: (
                    <div style={{ padding: '4px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 600 }}>
                      <ThunderboltOutlined style={{ fontSize: 16 }} />
                      <span>Enter OTP Passcode</span>
                    </div>
                  ),
                  value: 'otp',
                },
              ]}
              style={{ marginBottom: 20 }}
            />

            {/* OPTION 1: SCAN QR CODE */}
            {activeOption === 'qr' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Viewport Box */}
                <div
                  style={{
                    position: 'relative',
                    height: 250,
                    borderRadius: 'var(--radius-base)',
                    backgroundColor: isDarkMode ? '#0d1117' : '#0f172a',
                    border: `1px solid ${isDarkMode ? '#21262d' : '#334155'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {/* Active Camera Video */}
                  {cameraState === 'active' && (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  )}

                  {/* Corner Guide Reticles for Professional Viewfinder */}
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      width: 150,
                      height: 150,
                      pointerEvents: 'none',
                    }}
                  >
                    {/* Top-Left Corner */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 24,
                        height: 24,
                        borderTop: '3px solid #52c41a',
                        borderLeft: '3px solid #52c41a',
                        borderTopLeftRadius: 4,
                      }}
                    />
                    {/* Top-Right Corner */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 24,
                        height: 24,
                        borderTop: '3px solid #52c41a',
                        borderRight: '3px solid #52c41a',
                        borderTopRightRadius: 4,
                      }}
                    />
                    {/* Bottom-Left Corner */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: 24,
                        height: 24,
                        borderBottom: '3px solid #52c41a',
                        borderLeft: '3px solid #52c41a',
                        borderBottomLeftRadius: 4,
                      }}
                    />
                    {/* Bottom-Right Corner */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 24,
                        height: 24,
                        borderBottom: '3px solid #52c41a',
                        borderRight: '3px solid #52c41a',
                        borderBottomRightRadius: 4,
                      }}
                    />

                    {/* Subtle Center Scan Line */}
                    {cameraState === 'active' && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 2,
                          backgroundColor: '#52c41a',
                          boxShadow: '0 0 8px #52c41a',
                          animation: 'scanLaser 2.2s infinite ease-in-out',
                        }}
                      />
                    )}

                    {cameraState !== 'active' && (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <QrcodeOutlined style={{ fontSize: 56, color: 'rgba(255, 255, 255, 0.25)' }} />
                      </div>
                    )}
                  </div>

                  {/* Camera Status Label */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 12,
                      left: 12,
                      right: 12,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      zIndex: 3,
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '3px 8px',
                        borderRadius: 4,
                        backgroundColor: 'rgba(0, 0, 0, 0.65)',
                        backdropFilter: 'blur(4px)',
                        fontSize: 11,
                        color: '#ffffff',
                        fontWeight: 600,
                      }}
                    >
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: cameraState === 'active' ? '#52c41a' : '#888888',
                        }}
                      />
                      <span>{cameraState === 'active' ? 'Camera Live' : 'Camera Ready'}</span>
                    </div>

                    {cameraState === 'active' && (
                      <Button
                        size="small"
                        icon={<StopOutlined />}
                        onClick={stopCamera}
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.65)',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: 11,
                          height: 24,
                          borderRadius: 4,
                        }}
                      >
                        Stop
                      </Button>
                    )}
                  </div>
                </div>

                {/* Primary Action Button */}
                {cameraState !== 'active' && (
                  <Button
                    type="primary"
                    icon={<VideoCameraOutlined />}
                    loading={cameraState === 'requesting'}
                    onClick={startCamera}
                    style={{
                      height: 40,
                      borderRadius: 'var(--radius-base)',
                      fontWeight: 600,
                      backgroundColor: 'var(--color-primary)',
                    }}
                  >
                    Start Camera Scanner
                  </Button>
                )}

                {/* Manual Barcode / Member ID Input */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <Input
                    prefix={<BarcodeOutlined style={{ color: isDarkMode ? '#888888' : '#94a3b8' }} />}
                    placeholder="Enter Member ID or scan barcode (e.g. MBR-2024-089)"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    onPressEnter={() => {
                      if (manualInput.trim()) {
                        handleVerify({ passId: manualInput.trim(), memberName: 'Rahul Verma' });
                      }
                    }}
                    style={{ borderRadius: 'var(--radius-base)' }}
                  />
                  <Button
                    type="default"
                    loading={isVerifying}
                    onClick={() => {
                      handleVerify({
                        passId: manualInput.trim() || 'MBR-2024-089',
                        memberName: 'Rahul Verma',
                      });
                    }}
                    style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}
                  >
                    Verify
                  </Button>
                </div>
              </div>
            )}

            {/* OPTION 2: ENTER OTP */}
            {activeOption === 'otp' && (
              <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
                <Text style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', fontWeight: 600 }}>
                  Enter 6-Digit Member OTP Passcode
                </Text>

                <Input
                  maxLength={6}
                  placeholder="000000"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  onPressEnter={() => {
                    if (otpInput.length >= 4) {
                      handleVerify({ otp: otpInput });
                    }
                  }}
                  style={{
                    height: 52,
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: 8,
                    textAlign: 'center',
                    borderRadius: 'var(--radius-base)',
                    fontFamily: 'monospace',
                    maxWidth: 280,
                    width: '100%',
                  }}
                />

                <Button
                  type="primary"
                  loading={isVerifying}
                  disabled={!otpInput}
                  onClick={() => handleVerify({ otp: otpInput })}
                  style={{
                    width: '100%',
                    maxWidth: 280,
                    height: 42,
                    borderRadius: 'var(--radius-base)',
                    fontWeight: 600,
                    backgroundColor: 'var(--color-primary)',
                  }}
                >
                  Verify & Unlock Gate
                </Button>
              </div>
            )}
          </Card>
        </Col>

        {/* Right Column: Member Verification Status */}
        <Col xs={24} lg={11}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700 }}>
                <SafetyCertificateFilled style={{ color: lastVerified.status === 'GRANTED' ? '#52c41a' : '#ff4d4f' }} />
                <span>Verification Result</span>
              </div>
            }
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
              height: '100%',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            {lastVerified ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Member Profile */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '16px 18px',
                    backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
                    borderRadius: 'var(--radius-base)',
                    border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`,
                  }}
                >
                  <Avatar size={54} src={lastVerified.avatar} icon={<UserOutlined />} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: 16, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                        {lastVerified.memberName}
                      </span>
                      <Tag
                        color={lastVerified.status === 'GRANTED' ? 'success' : 'error'}
                        style={{ fontWeight: 700, borderRadius: 4, margin: 0 }}
                      >
                        {lastVerified.status === 'GRANTED' ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
                      </Tag>
                    </div>
                    <div style={{ fontSize: 12.5, color: isDarkMode ? '#888888' : '#64748b', marginTop: 3 }}>
                      {lastVerified.plan}
                    </div>
                    <div style={{ fontSize: 11.5, color: isDarkMode ? '#aaaaaa' : '#94a3b8', marginTop: 4 }}>
                      Pass ID: <span style={{ fontFamily: 'monospace' }}>{lastVerified.passId}</span> • {lastVerified.time} • Via {lastVerified.method}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '36px 0', color: isDarkMode ? '#888888' : '#94a3b8', fontSize: 13 }}>
                Waiting for member verification...
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Today's Check-In Activity Table */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700 }}>
            <ClockCircleOutlined style={{ color: 'var(--color-primary)' }} />
            <span>Today's Check-In Log</span>
          </div>
        }
        style={{
          marginTop: 20,
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-color)',
          borderRadius: 'var(--radius-base)',
        }}
        styles={{ body: { padding: '12px 18px' } }}
      >
        <Table
          dataSource={logs}
          rowKey="key"
          pagination={{ pageSize: 5 }}
          size="middle"
          columns={[
            {
              title: 'Time',
              dataIndex: 'time',
              key: 'time',
              width: 90,
              render: (time) => <span style={{ fontWeight: 600, fontSize: 12 }}>{time}</span>,
            },
            {
              title: 'Member',
              key: 'member',
              render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar size={28} src={record.avatar} icon={<UserOutlined />} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                      {record.memberName}
                    </div>
                    <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>
                      {record.passId}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              title: 'Membership Plan',
              dataIndex: 'plan',
              key: 'plan',
              render: (plan) => (
                <Text style={{ fontSize: 12, color: isDarkMode ? '#cccccc' : '#475569' }}>
                  {plan}
                </Text>
              ),
            },
            {
              title: 'Method',
              dataIndex: 'method',
              key: 'method',
              render: (method) => (
                <Tag color={method === 'QR Code' ? 'blue' : 'purple'} style={{ borderRadius: 4, fontWeight: 600, fontSize: 11 }}>
                  {method}
                </Tag>
              ),
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status) => (
                <Tag
                  color={status === 'GRANTED' ? 'success' : status === 'DENIED' ? 'error' : 'default'}
                  style={{ borderRadius: 4, fontWeight: 700, fontSize: 11 }}
                >
                  {status}
                </Tag>
              ),
            },
            {
              title: 'Action',
              key: 'action',
              align: 'right',
              render: (_, record) =>
                record.status === 'GRANTED' ? (
                  <Button
                    size="small"
                    onClick={() => handleManualExit(record)}
                    style={{ borderRadius: 'var(--radius-base)', fontSize: 11 }}
                  >
                    Check Out
                  </Button>
                ) : null,
            },
          ]}
        />
      </Card>

      {/* Global CSS for Scanner Laser */}
      <style>{`
        @keyframes scanLaser {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 95%; opacity: 1; }
          100% { top: 0%; opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default QrCheckIn;
