import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Switch,
  message,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  UserOutlined,
  LockOutlined,
  SunOutlined,
  MoonOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useTheme } from '../theme/ThemeContext';
import { loginSuccess } from '../redux/slices/authSlice';
import gymezyLogo from '../assets/logo/gymezy.png';
import fitnessBg from '../assets/images/onboarding_1.jpg';

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDarkMode, toggleTheme } = useTheme();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleLogin = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch(
        loginSuccess({
          name: 'Vikram Sethi',
          email: values.email || 'owner@fitzone.com',
          role: 'GYM_OWNER',
          gymId: 'GYM-FZ-01',
          gymName: 'FitZone Gym',
          branch: 'Anna Nagar, Chennai',
        })
      );
      message.success('Welcome back, Vikram! Gym Owner Portal loaded.');
      navigate('/owner/dashboard');
    }, 500);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: isDarkMode ? '#000000' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#0f172a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating Day/Night Theme Switch */}
      <div
        onClick={toggleTheme}
        role="button"
        tabIndex={0}
        style={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 100,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          height: 36,
          padding: '0 14px',
          borderRadius: 18,
          backgroundColor: isDarkMode ? 'rgba(20, 20, 20, 0.85)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${isDarkMode ? '#333333' : '#e2e8f0'}`,
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <Switch
          size="small"
          checked={isDarkMode}
          checkedChildren={<MoonOutlined style={{ color: '#ffd700', fontSize: 10 }} />}
          unCheckedChildren={<SunOutlined style={{ color: '#fa8c16', fontSize: 10 }} />}
          style={{
            margin: 0,
            backgroundColor: isDarkMode ? '#1677ff' : '#cbd5e1',
            pointerEvents: 'none',
          }}
        />
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: isDarkMode ? '#e2e8f0' : '#334155',
            lineHeight: 1,
            display: 'inline-block',
          }}
        >
          {isDarkMode ? 'Night' : 'Day'}
        </span>
      </div>

      {/* LEFT HALF: HERO IMAGE WITH THEME COLOR OVERLAY & CENTERED LOGO */}
      <div
        className="hide-mobile"
        style={{
          flex: 1.1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px',
          backgroundImage: `url(${fitnessBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Color Solid Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 56, 130, 0.90)',
            backdropFilter: 'blur(2px)',
            zIndex: 1,
          }}
        />

        {/* Centered Content: White Filter Logo, Brand Name & Description */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <img
            src={gymezyLogo}
            alt="GYMEZY Logo"
            style={{
              width: 110,
              height: 110,
              objectFit: 'contain',
              filter: 'brightness(0) invert(1)', // Pure white filter matching mobile app
              marginBottom: 20,
              userSelect: 'none',
            }}
          />

          <h1
            style={{
              fontSize: 34,
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              margin: '0 0 8px 0',
              lineHeight: 1.2,
            }}
          >
            GYMEZY
          </h1>

          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.75)',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            SMART GYM OPERATING SYSTEM
          </p>
        </div>
      </div>

      {/* RIGHT HALF: MINIMAL PROFESSIONAL LOGIN FORM */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 32px',
          backgroundColor: isDarkMode ? '#000000' : '#ffffff',
          transition: 'background-color 0.3s ease',
        }}
      >
        <div style={{ width: '100%', maxWidth: 380 }}>
          {/* Mobile Only Brand Emblem */}
          <div
            className="show-mobile"
            style={{ textAlign: 'center', marginBottom: 32 }}
          >
            <img
              src={gymezyLogo}
              alt="GYMEZY Logo"
              style={{
                width: 64,
                height: 64,
                objectFit: 'contain',
                filter: isDarkMode ? 'brightness(0) invert(1)' : 'none',
                marginBottom: 8,
              }}
            />
            <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '2px' }}>
              GYMEZY
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: isDarkMode ? '#ffffff' : '#0f172a',
                margin: 0,
                letterSpacing: '-0.5px',
              }}
            >
              Sign In
            </h2>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleLogin}
            initialValues={{
              email: 'owner@fitzone.com',
              password: 'FitZoneSecure@2025',
              remember: true,
            }}
            size="large"
          >
            <Form.Item
              label={<span style={{ color: isDarkMode ? '#cccccc' : '#334155', fontWeight: 600, fontSize: 13 }}>Email</span>}
              name="email"
              rules={[{ required: true, message: 'Please enter your email' }]}
              style={{ marginBottom: 20 }}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#1677ff' }} />}
                placeholder="owner@fitzone.com"
                style={{
                  height: 46,
                  borderRadius: 'var(--radius-base)',
                  backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff',
                  borderColor: isDarkMode ? '#222222' : '#d9d9d9',
                  color: isDarkMode ? '#ffffff' : '#0f172a',
                }}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: isDarkMode ? '#cccccc' : '#334155', fontWeight: 600, fontSize: 13 }}>Password</span>}
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
              style={{ marginBottom: 20 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#1677ff' }} />}
                placeholder="••••••••"
                style={{
                  height: 46,
                  borderRadius: 'var(--radius-base)',
                  backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff',
                  borderColor: isDarkMode ? '#222222' : '#d9d9d9',
                  color: isDarkMode ? '#ffffff' : '#0f172a',
                }}
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13 }}>
                  Remember me
                </Checkbox>
              </Form.Item>
              <a
                onClick={() => message.info('Reset instructions sent to registered phone.')}
                style={{ color: '#1677ff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
              >
                Forgot password?
              </a>
            </div>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                icon={<ArrowRightOutlined />}
                style={{
                  height: 48,
                  fontSize: 15,
                  fontWeight: 700,
                  borderRadius: 'var(--radius-base)',
                  backgroundColor: '#003882',
                  borderColor: '#003882',
                }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
