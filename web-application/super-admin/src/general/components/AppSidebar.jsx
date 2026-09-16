import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;
import {
  DashboardOutlined,
  ShopOutlined,
  TeamOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BarChartOutlined,
  CalendarOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import { useTheme } from '../../theme/ThemeContext';
import gymezyLogo from '../../assets/logo/gymezy.png';

// Helper to render neatly proportioned sidebar count badges
const renderMenuBadge = (count, isHighlight = false) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 20,
      height: 20,
      padding: '0 6px',
      borderRadius: 10,
      fontSize: 11,
      fontWeight: 700,
      lineHeight: 1,
      backgroundColor: isHighlight ? '#6366f1' : 'rgba(255, 255, 255, 0.14)',
      color: '#ffffff',
      flexShrink: 0,
    }}
  >
    {count}
  </span>
);

export const SUPER_ADMIN_NAV_ITEMS = [
  {
    key: '/admin/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: 'gyms-sub',
    icon: <ShopOutlined />,
    label: (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingRight: 6 }}>
        <span>Gyms</span>
        {renderMenuBadge(18, true)}
      </div>
    ),
    children: [
      {
        key: '/admin/gyms?tab=all',
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span>All Gyms</span>
            {renderMenuBadge(1248, false)}
          </div>
        ),
      },
      {
        key: '/admin/gyms?tab=pending',
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span>Pending Approval</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 18,
                height: 18,
                padding: '0 5px',
                borderRadius: 9,
                fontSize: 10,
                fontWeight: 800,
                backgroundColor: '#d97706',
                color: '#ffffff',
              }}
            >
              18
            </span>
          </div>
        ),
      },
      {
        key: '/admin/gyms?tab=approved',
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span>Approved / Active</span>
            {renderMenuBadge(1180, false)}
          </div>
        ),
      },
      {
        key: '/admin/gyms?tab=on_hold',
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span>On Hold</span>
            {renderMenuBadge(35, false)}
          </div>
        ),
      },
      {
        key: '/admin/gyms?tab=rejected',
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span>Rejected</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 18,
                height: 18,
                padding: '0 5px',
                borderRadius: 9,
                fontSize: 10,
                fontWeight: 800,
                backgroundColor: '#ef4444',
                color: '#ffffff',
              }}
            >
              15
            </span>
          </div>
        ),
      },
    ],
  },
  {
    key: '/admin/customers',
    icon: <TeamOutlined />,
    label: 'Customers',
  },
  {
    key: '/admin/subscriptions',
    icon: <DollarOutlined />,
    label: 'Subscriptions',
  },
  {
    key: '/admin/bookings',
    icon: <CalendarOutlined />,
    label: 'Bookings',
  },
  {
    key: '/admin/payments',
    icon: <CreditCardOutlined />,
    label: 'Payments',
  },
  {
    key: '/admin/reports',
    icon: <BarChartOutlined />,
    label: 'Reports',
  },
];

export const AppSidebar = ({
  collapsed = false,
  onCollapse,
  menuItems = SUPER_ADMIN_NAV_ITEMS,
  brandRedirect = '/admin/dashboard',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  // Compute active key matching exact route and query parameter tab
  const getActiveKey = () => {
    if (location.pathname === '/admin/gyms') {
      const search = location.search || '?tab=all';
      return `/admin/gyms${search}`;
    }
    return location.pathname;
  };

  const activeKey = getActiveKey();

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      trigger={null}
      width={250}
      collapsedWidth={80}
      style={{
        backgroundColor: isDarkMode ? '#0d0d0d' : '#0e131f',
        borderRight: `1px solid ${isDarkMode ? '#222222' : '#1e293b'}`,
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 60,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Brand Header */}
        <div
          onClick={() => navigate(brandRedirect)}
          style={{
            height: 72,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <img
            src={gymezyLogo}
            alt="GYMEZY"
            style={{
              height: 38,
              width: 38,
              objectFit: 'contain',
              flexShrink: 0,
            }}
          />
          {!collapsed && (
            <div style={{ lineHeight: 1.2, overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  letterSpacing: '1.5px',
                  color: '#ffffff',
                }}
              >
                GYMEZY
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.8px',
                  color: '#818cf8',
                  textTransform: 'uppercase',
                }}
              >
                ADMIN PANEL
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <div style={{ flex: 1, padding: '16px 8px', overflowY: 'auto' }}>
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[activeKey]}
            defaultOpenKeys={['gyms-sub']}
            onClick={({ key }) => navigate(key)}
            items={menuItems}
            style={{
              backgroundColor: 'transparent',
              borderRight: 'none',
            }}
          />
        </div>

        {/* Collapse Toggle Footer */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
          }}
        >
          {!collapsed && (
            <span style={{ fontSize: 11, color: '#64748b' }}>
              v1.0.0 Enterprise
            </span>
          )}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => onCollapse(!collapsed)}
            style={{ color: '#94a3b8' }}
          />
        </div>
      </div>
    </Sider>
  );
};

export default AppSidebar;
