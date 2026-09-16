import React from 'react';
import { Layout, Avatar, Dropdown, Switch, Badge, Breadcrumb } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  SunOutlined,
  MoonOutlined,
  LogoutOutlined,
  SettingOutlined,
  DownOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useTheme } from '../../theme/ThemeContext';
import { logout } from '../../redux/slices/authSlice';

const { Header } = Layout;

const ROUTE_NAMES = {
  '/admin/dashboard': 'Dashboard',
  '/admin/gyms': 'Gyms & Tenants',
  '/admin/onboarding': 'Gym Onboarding Wizard',
  '/admin/customers': 'Customers & Users',
  '/admin/bookings': 'Bookings Management',
  '/admin/payments': 'Transactions & Payments',
  '/admin/transactions': 'Transactions & Payments',
  '/admin/subscriptions': 'Billing & Plans',
  '/admin/reports': 'Reports & Analytics',
  '/admin/users': 'Platform Users',
  '/admin/audit': 'Security & Audit Logs',
  '/admin/settings': 'Global Settings',
};

export const AppBar = ({
  user: userProp,
  onLogout,
  extra,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isDarkMode, toggleTheme } = useTheme();
  const authUser = useSelector((state) => state.auth?.user);

  const currentUser = userProp || authUser || {
    name: 'Chief Administrator',
    email: 'admin@gymezy.com',
    role: 'SUPER_ADMIN',
  };

  const currentTitle = ROUTE_NAMES[location.pathname] || 'Dashboard';

  const handleLogoutAction = () => {
    if (onLogout) {
      onLogout();
    } else {
      dispatch(logout());
      navigate('/login');
    }
  };

  const profileMenu = {
    items: [
      {
        key: 'profile-info',
        label: (
          <div style={{ padding: '6px 0' }}>
            <div style={{ fontWeight: 600 }}>{currentUser?.name || 'Chief Administrator'}</div>
            <div style={{ fontSize: 12, color: '#888888' }}>{currentUser?.email || 'admin@gymezy.com'}</div>
          </div>
        ),
      },
      { type: 'divider' },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: 'Platform Settings',
        onClick: () => navigate('/admin/settings'),
      },
      { type: 'divider' },
      {
        key: 'logout',
        icon: <LogoutOutlined style={{ color: '#ef4444' }} />,
        label: <span style={{ color: '#ef4444' }}>Sign Out</span>,
        onClick: handleLogoutAction,
      },
    ],
  };

  return (
    <Header
      style={{
        padding: '0 28px',
        height: 72,
        lineHeight: 'normal',
        backgroundColor: isDarkMode ? '#0a0a0a' : '#ffffff',
        borderBottom: `1px solid ${isDarkMode ? '#1e1e1e' : '#e2e8f0'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 99,
      }}
    >
      {/* Left: Dynamic Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Breadcrumb
          items={[
            {
              title: (
                <span
                  style={{
                    color: isDarkMode ? '#888888' : '#64748b',
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                  onClick={() => navigate('/admin/dashboard')}
                >
                  <HomeOutlined style={{ fontSize: 13 }} />
                  <span>Home</span>
                </span>
              ),
            },
            {
              title: (
                <span
                  style={{
                    color: isDarkMode ? '#ffffff' : '#0f172a',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {currentTitle}
                </span>
              ),
            },
          ]}
        />
      </div>

      {/* Right: Actions, Theme Switch & Profile Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {extra}

        {/* Day / Night Theme Switch */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Switch
            size="small"
            checked={isDarkMode}
            onChange={toggleTheme}
            checkedChildren={<MoonOutlined style={{ color: '#ffd700', fontSize: 10 }} />}
            unCheckedChildren={<SunOutlined style={{ color: '#fa8c16', fontSize: 10 }} />}
            style={{
              margin: 0,
              backgroundColor: isDarkMode ? '#1677ff' : '#cbd5e1',
            }}
          />
        </div>

        {/* Profile Dropdown */}
        <Dropdown menu={profileMenu} placement="bottomRight" arrow>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <Badge dot status="success" offset={[-2, 32]}>
              <Avatar
                style={{
                  backgroundColor: '#003882',
                  color: '#ffffff',
                  fontWeight: 700,
                  border: '2px solid rgba(0, 56, 130, 0.15)',
                }}
                size={36}
              >
                SA
              </Avatar>
            </Badge>
            <div
              className="hide-mobile"
              style={{
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: isDarkMode ? '#ffffff' : '#0f172a',
                  lineHeight: 1.2,
                }}
              >
                {currentUser?.name || 'Chief Administrator'}
              </div>
              <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', lineHeight: 1.2 }}>
                Master Admin
              </div>
            </div>
            <DownOutlined style={{ fontSize: 10, color: isDarkMode ? '#888888' : '#64748b', marginLeft: 2 }} />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppBar;
