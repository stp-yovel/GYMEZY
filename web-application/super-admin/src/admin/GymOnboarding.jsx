import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Form,
  Upload,
  Typography,
  Space,
  message,
  Modal,
  TimePicker,
  Checkbox,
  Radio,
  Progress,
  Divider,
} from 'antd';
import {
  ShopOutlined,
  EnvironmentOutlined,
  PictureOutlined,
  TeamOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  SaveOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  InboxOutlined,
  SafetyCertificateFilled,
  BulbOutlined,
  SendOutlined,
  CloseOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';

const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const ONBOARDING_STEPS = [
  { id: 1, key: 'business', title: 'Business Info', icon: <ShopOutlined /> },
  { id: 2, key: 'location', title: 'Location & Hours', icon: <EnvironmentOutlined /> },
  { id: 3, key: 'facilities', title: 'Facilities & Photos', icon: <PictureOutlined /> },
  { id: 4, key: 'trainers', title: 'Services & Trainers', icon: <TeamOutlined /> },
  { id: 5, key: 'session', title: 'Session Setup', icon: <AppstoreOutlined /> },
  { id: 6, key: 'rules', title: 'Booking Rules', icon: <CalendarOutlined /> },
  { id: 7, key: 'payment', title: 'Payment & Agreements', icon: <CreditCardOutlined /> },
  { id: 8, key: 'review', title: 'Review & Go Live', icon: <CheckCircleOutlined /> },
];

export const GymOnboarding = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [form] = Form.useForm();

  // Success Celebration Modal State
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Form State Data across steps
  const [formData, setFormData] = useState({
    gymName: 'FitZone Gym',
    businessType: 'Private Limited',
    ownerName: 'Ramesh Kumar',
    phone: '+91 98765 43210',
    email: 'ramesh.kumar@email.com',
    yearEstablished: '2019',
    gstNumber: '33AAAAA0000A1Z5',
    panNumber: 'AAAAA0000A',
    branches: '3',
    address: 'Plot 42, 2nd Avenue, Anna Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    subscriptionType: 'Hybrid',
    gymId: 'GYM1001',
  });

  // Calculate Progress Pct
  const progressPercent = Math.round((currentStep / 8) * 100);

  // Handle Save & Next
  const handleSaveAndNext = () => {
    form.validateFields().then((values) => {
      setFormData((prev) => ({ ...prev, ...values }));
      if (currentStep < 8) {
        setCurrentStep((prev) => prev + 1);
        message.success(`Step ${currentStep} saved!`);
      } else {
        // Final Submit: Trigger 1:1 Success Modal
        setIsSuccessModalOpen(true);
      }
    }).catch(() => {
      // Allow proceeding in demo mode
      if (currentStep < 8) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setIsSuccessModalOpen(true);
      }
    });
  };

  // Handle Save & Exit
  const handleSaveAndExit = () => {
    message.info('Onboarding draft saved. You can resume anytime.');
    navigate('/admin/gyms');
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', paddingBottom: 40 }}>
      {/* 1. TOP TITLE & ACTIONS BAR */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: isDarkMode ? '#ffffff' : '#0f172a',
            margin: 0,
            letterSpacing: '-0.3px',
          }}
        >
          Gym Onboarding
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Button
            icon={<SaveOutlined />}
            onClick={handleSaveAndExit}
            style={{
              borderRadius: 'var(--radius-base)',
              fontWeight: 600,
              borderColor: isDarkMode ? '#334155' : '#e2e8f0',
            }}
          >
            Save & Exit
          </Button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 20,
              backgroundColor: isDarkMode ? '#141414' : '#f1f5f9',
              fontSize: 13,
              fontWeight: 700,
              color: isDarkMode ? '#ffffff' : '#0f172a',
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              FZ
            </div>
            <span>FitZone Gym ⌄</span>
          </div>
        </div>
      </div>

      {/* 2. TOP HORIZONTAL STEPPER (8 ICONS) */}
      <Card
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-color)',
          borderRadius: 'var(--radius-base)',
          marginBottom: 24,
        }}
        styles={{ body: { padding: '20px 16px' } }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflowX: 'auto',
          }}
        >
          {ONBOARDING_STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            return (
              <div
                key={step.key}
                onClick={() => setCurrentStep(step.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: 100,
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                {/* Step Circle */}
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    backgroundColor: isActive
                      ? '#4f46e5'
                      : isCompleted
                      ? '#22c55e'
                      : isDarkMode
                      ? '#1e293b'
                      : '#f1f5f9',
                    color: isActive || isCompleted ? '#ffffff' : isDarkMode ? '#64748b' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 14,
                    border: isActive
                      ? '3px solid rgba(99, 102, 241, 0.3)'
                      : isCompleted
                      ? '3px solid rgba(34, 197, 94, 0.3)'
                      : 'none',
                    transition: 'all 0.2s ease',
                    marginBottom: 8,
                  }}
                >
                  {isCompleted ? <CheckOutlined style={{ fontSize: 13 }} /> : step.id}
                </div>

                {/* Step Icon + Label */}
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: isActive ? 800 : 600,
                    color: isActive
                      ? '#4f46e5'
                      : isCompleted
                      ? isDarkMode ? '#e2e8f0' : '#1e293b'
                      : isDarkMode ? '#64748b' : '#94a3b8',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {step.title}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 3. MAIN FORM BODY: LEFT PROGRESS SIDEBAR + RIGHT FORM FIELDS */}
      <Row gutter={[24, 24]}>
        {/* Left Column: Onboarding Progress Card */}
        <Col xs={24} lg={7}>
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
              <div style={{ fontSize: 11, fontWeight: 700, color: isDarkMode ? '#888888' : '#64748b', textTransform: 'uppercase' }}>
                Onboarding Progress
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a', margin: '4px 0 10px 0' }}>
                Step {currentStep} of 8
              </div>

              {/* Progress Bar */}
              <Progress
                percent={progressPercent}
                strokeColor="#4f46e5"
                showInfo={false}
                size="small"
                style={{ marginBottom: 4 }}
              />
              <div style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5', marginBottom: 24 }}>
                {progressPercent}% Completed
              </div>

              {/* Vertical Steps Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {ONBOARDING_STEPS.map((step) => {
                  const isActive = step.id === currentStep;
                  const isCompleted = step.id < currentStep;
                  return (
                    <div
                      key={step.key}
                      onClick={() => setCurrentStep(step.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '8px 12px',
                        borderRadius: 8,
                        backgroundColor: isActive
                          ? isDarkMode ? 'rgba(99, 102, 241, 0.15)' : '#ede9fe'
                          : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          backgroundColor: isActive
                            ? '#4f46e5'
                            : isCompleted
                            ? '#22c55e'
                            : isDarkMode
                            ? '#1e293b'
                            : '#e2e8f0',
                          color: isActive || isCompleted ? '#ffffff' : '#64748b',
                          fontSize: 11,
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isCompleted ? <CheckOutlined style={{ fontSize: 10 }} /> : step.id}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: isActive ? 800 : 600,
                          color: isActive
                            ? '#4f46e5'
                            : isCompleted
                            ? isDarkMode ? '#e2e8f0' : '#334155'
                            : isDarkMode ? '#64748b' : '#94a3b8',
                        }}
                      >
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Security Trust Box */}
            <div
              style={{
                marginTop: 28,
                padding: '14px',
                borderRadius: 10,
                backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : '#f5f3ff',
                border: `1px solid ${isDarkMode ? 'rgba(99, 102, 241, 0.25)' : '#e0e7ff'}`,
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
              }}
            >
              <SafetyCertificateFilled style={{ fontSize: 18, color: '#4f46e5', marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: isDarkMode ? '#e0e7ff' : '#4338ca' }}>
                  Your information is safe with us.
                </div>
                <div style={{ fontSize: 11, color: isDarkMode ? '#a5b4fc' : '#6366f1', marginTop: 2 }}>
                  We use bank-level security to protect your data.
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Column: Form Step Content */}
        <Col xs={24} lg={17}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
              marginBottom: 20,
            }}
            styles={{ body: { padding: '28px 32px' } }}
          >
            {/* STEP 1: BUSINESS INFORMATION (1:1 with Screenshot 1) */}
            {currentStep === 1 && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    Business Information
                  </div>
                  <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2 }}>
                    Tell us about your gym and business
                  </div>
                </div>

                <Form form={form} layout="vertical" initialValues={formData}>
                  {/* Row 1: Gym Name, Business Type, Owner Name */}
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Form.Item label="Gym Name *" name="gymName" rules={[{ required: true, message: 'Enter gym name' }]}>
                        <Input placeholder="Enter gym name" style={{ borderRadius: 'var(--radius-base)' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Business Type *" name="businessType" rules={[{ required: true, message: 'Select business type' }]}>
                        <Select placeholder="Select business type" style={{ borderRadius: 'var(--radius-base)' }}>
                          <Option value="Private Limited">Private Limited</Option>
                          <Option value="Partnership">Partnership</Option>
                          <Option value="Sole Proprietorship">Sole Proprietorship</Option>
                          <Option value="LLP">LLP</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Owner Name *" name="ownerName" rules={[{ required: true, message: 'Enter owner name' }]}>
                        <Input placeholder="Enter owner name" style={{ borderRadius: 'var(--radius-base)' }} />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Row 2: Mobile Number, Email Address, Year Established */}
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Form.Item label="Mobile Number *" name="phone" rules={[{ required: true, message: 'Enter mobile number' }]}>
                        <Input
                          addonBefore="🇮🇳 +91"
                          placeholder="Enter mobile number"
                          style={{ borderRadius: 'var(--radius-base)' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Email Address *" name="email" rules={[{ required: true, type: 'email', message: 'Enter valid email' }]}>
                        <Input placeholder="Enter email address" style={{ borderRadius: 'var(--radius-base)' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Year Established *" name="yearEstablished" rules={[{ required: true, message: 'Select year' }]}>
                        <Select placeholder="Select year">
                          {Array.from({ length: 30 }, (_, i) => 2026 - i).map((y) => (
                            <Option key={y} value={String(y)}>{y}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Row 3: GST Number, PAN Number, Number of Branches */}
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Form.Item label="GST Number (Optional)" name="gstNumber">
                        <Input placeholder="Enter GST number" style={{ borderRadius: 'var(--radius-base)' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="PAN Number (Optional)" name="panNumber">
                        <Input placeholder="Enter PAN number" style={{ borderRadius: 'var(--radius-base)' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Number of Branches" name="branches">
                        <Input placeholder="Enter number of branches" style={{ borderRadius: 'var(--radius-base)' }} />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Upload Box: Business Registration Certificate */}
                  <Form.Item label="Business Registration Certificate (Optional)">
                    <Dragger
                      style={{
                        padding: '24px',
                        background: isDarkMode ? '#141414' : '#fafafa',
                        borderColor: isDarkMode ? '#333333' : '#d9d9d9',
                        borderRadius: 8,
                      }}
                    >
                      <p className="ant-upload-drag-icon" style={{ marginBottom: 8 }}>
                        <InboxOutlined style={{ color: '#4f46e5', fontSize: 32 }} />
                      </p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', margin: 0 }}>
                        Drag & drop file here or click to upload
                      </p>
                      <p style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', margin: 0 }}>
                        PDF, JPG, PNG (Max. 5MB)
                      </p>
                    </Dragger>
                  </Form.Item>
                </Form>
              </div>
            )}

            {/* STEP 2: LOCATION & OPERATING HOURS */}
            {currentStep === 2 && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    Location & Operating Hours
                  </div>
                  <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2 }}>
                    Specify gym address, geolocation, and weekly operating timings
                  </div>
                </div>

                <Row gutter={16}>
                  <Col xs={24}>
                    <Form.Item label="Street Address *">
                      <Input defaultValue="Plot 42, 2nd Avenue, Anna Nagar" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label="City *">
                      <Input defaultValue="Chennai" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label="State *">
                      <Input defaultValue="Tamil Nadu" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label="Pincode *">
                      <Input defaultValue="600040" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )}

            {/* STEPS 3 to 7 */}
            {currentStep > 2 && currentStep < 8 && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    {ONBOARDING_STEPS[currentStep - 1].title}
                  </div>
                  <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2 }}>
                    Configure {ONBOARDING_STEPS[currentStep - 1].title.toLowerCase()} configurations for GYMEZY.
                  </div>
                </div>

                <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: isDarkMode ? '#141414' : '#f8fafc', borderRadius: 8 }}>
                  <CheckCircleOutlined style={{ fontSize: 36, color: '#4f46e5', marginBottom: 12 }} />
                  <div style={{ fontWeight: 700, fontSize: 15, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    {ONBOARDING_STEPS[currentStep - 1].title} Details Configured
                  </div>
                  <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', marginTop: 4 }}>
                    All parameters for Step {currentStep} are pre-loaded and validated.
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: REVIEW & GO LIVE */}
            {currentStep === 8 && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    Review & Go Live
                  </div>
                  <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2 }}>
                    Confirm the details below and activate the gym partner profile.
                  </div>
                </div>

                <div style={{ padding: '20px', backgroundColor: isDarkMode ? '#141414' : '#f8fafc', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: isDarkMode ? '#888888' : '#64748b' }}>Gym Name</span>
                    <strong style={{ color: isDarkMode ? '#ffffff' : '#0f172a' }}>FitZone Gym</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: isDarkMode ? '#888888' : '#64748b' }}>Location</span>
                    <strong style={{ color: isDarkMode ? '#ffffff' : '#0f172a' }}>Anna Nagar, Chennai, Tamil Nadu - 600040</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: isDarkMode ? '#888888' : '#64748b' }}>Assigned Gym ID</span>
                    <strong style={{ color: '#4f46e5' }}>GYM1001</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: isDarkMode ? '#888888' : '#64748b' }}>Plan Tier</span>
                    <Tag color="purple">Hybrid</Tag>
                  </div>
                </div>
              </div>
            )}

            {/* Form Footer Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, borderTop: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`, paddingTop: 20 }}>
              <Button
                icon={<SaveOutlined />}
                onClick={handleSaveAndExit}
                style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}
              >
                Save & Exit
              </Button>

              <div style={{ display: 'flex', gap: 12 }}>
                {currentStep > 1 && (
                  <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => setCurrentStep((p) => p - 1)}
                    style={{ borderRadius: 'var(--radius-base)', fontWeight: 600 }}
                  >
                    Previous
                  </Button>
                )}

                <Button
                  type="primary"
                  onClick={handleSaveAndNext}
                  style={{
                    borderRadius: 'var(--radius-base)',
                    fontWeight: 700,
                    backgroundColor: '#4f46e5',
                    borderColor: '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span>{currentStep === 8 ? 'Complete Onboarding 🚀' : 'Save & Next'}</span>
                  {currentStep < 8 && <ArrowRightOutlined />}
                </Button>
              </div>
            </div>
          </Card>

          {/* Bottom Helpful Tip Banner */}
          <div
            style={{
              padding: '12px 18px',
              borderRadius: 8,
              backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : '#f5f3ff',
              border: `1px solid ${isDarkMode ? 'rgba(99, 102, 241, 0.2)' : '#ede9fe'}`,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <BulbOutlined style={{ color: '#6366f1', fontSize: 16 }} />
            <span style={{ fontSize: 12, color: isDarkMode ? '#c7d2fe' : '#4f46e5', fontWeight: 600 }}>
              Tip: You can save and exit anytime. Your progress will be saved automatically.
            </span>
          </div>
        </Col>
      </Row>

      {/* -------------------------------------------------------------
          4. SUCCESS CELEBRATION MODAL (1:1 with Screenshot 2)
         ------------------------------------------------------------- */}
      <Modal
        open={isSuccessModalOpen}
        onCancel={() => setIsSuccessModalOpen(false)}
        footer={null}
        width={560}
        centered
      >
        <div style={{ textAlign: 'center', paddingTop: 10 }}>
          {/* Confetti & Large Green Checkmark */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              boxShadow: '0 8px 24px rgba(34, 197, 94, 0.2)',
            }}
          >
            <CheckOutlined style={{ fontSize: 36, color: '#16a34a', fontWeight: 900 }} />
          </div>

          <div style={{ fontSize: 22, fontWeight: 900, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
            Gym Onboarded Successfully!
          </div>
          <div style={{ fontSize: 13, color: isDarkMode ? '#94a3b8' : '#64748b', marginTop: 4, marginBottom: 20 }}>
            Your gym has been onboarded on Gymezy.
          </div>

          {/* Details Box */}
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
              border: `1px solid ${isDarkMode ? '#262626' : '#e2e8f0'}`,
              borderRadius: 10,
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShopOutlined /> Gym Name
              </span>
              <strong style={{ fontSize: 14, color: isDarkMode ? '#ffffff' : '#0f172a' }}>FitZone Gym</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 8 }}>
                <EnvironmentOutlined /> Location
              </span>
              <strong style={{ fontSize: 13, color: isDarkMode ? '#ffffff' : '#0f172a', textAlign: 'right' }}>
                Anna Nagar, Chennai, Tamil Nadu - 600040
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShopOutlined /> Gym ID
              </span>
              <strong style={{ fontSize: 13, color: '#4f46e5' }}>GYM1001</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CreditCardOutlined /> Subscription Type
              </span>
              <span
                style={{
                  padding: '2px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : '#ede9fe',
                  color: '#4f46e5',
                }}
              >
                Hybrid
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CalendarOutlined /> Onboarded Date
              </span>
              <strong style={{ fontSize: 13, color: isDarkMode ? '#ffffff' : '#0f172a' }}>21 May 2026, 10:30 AM</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CalendarOutlined /> Subscription End Date
              </span>
              <strong style={{ fontSize: 13, color: isDarkMode ? '#ffffff' : '#0f172a' }}>21 May 2027, 10:30 AM</strong>
            </div>

            {/* Notice */}
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : '#f5f3ff',
                fontSize: 11,
                color: isDarkMode ? '#c7d2fe' : '#4f46e5',
                display: 'flex',
                gap: 6,
                marginTop: 4,
              }}
            >
              <InfoCircleOutlined style={{ fontSize: 13, marginTop: 2, flexShrink: 0 }} />
              <span>Subscription end date is applicable for APP, GMS & Hybrid plans only. For Listing Only plan, there is no expiry.</span>
            </div>
          </div>

          {/* Send Details to Gym Owner Section */}
          <div
            style={{
              padding: '16px 20px',
              border: `1px solid ${isDarkMode ? '#262626' : '#e2e8f0'}`,
              borderRadius: 10,
              textAlign: 'left',
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
              Send These Details to Gym Owner
            </div>
            <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', margin: '4px 0 12px 0' }}>
              We will send an email & SMS with gym details and a link to download the Gymezy Owner App.
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 13, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                <span>✉ ramesh.kumar@email.com</span>
                <span>+91 98765 43210</span>
              </div>
              <Button size="small" style={{ borderRadius: 6, fontWeight: 600 }}>
                Edit Contact
              </Button>
            </div>
          </div>

          {/* Send Details Primary Button */}
          <Button
            type="primary"
            icon={<SendOutlined />}
            size="large"
            block
            onClick={() => {
              message.success('Onboarding credentials sent to Gym Owner successfully!');
              setIsSuccessModalOpen(false);
              navigate('/admin/gyms');
            }}
            style={{
              borderRadius: 'var(--radius-base)',
              fontWeight: 800,
              backgroundColor: '#4f46e5',
              borderColor: '#4f46e5',
              height: 46,
              marginBottom: 10,
            }}
          >
            Send Details to Gym Owner
          </Button>

          <Button
            type="text"
            block
            onClick={() => {
              setIsSuccessModalOpen(false);
              navigate('/admin/gyms');
            }}
            style={{ color: isDarkMode ? '#888888' : '#64748b', fontWeight: 600 }}
          >
            Skip for Now
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default GymOnboarding;
