import React, { useState, useEffect } from 'react';
import { Layout, Spin } from 'antd';
import { Outlet, Navigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../hooks';
import AppSidebar from '../general/components/AppSidebar';
import AppBar from '../general/components/AppBar';

const { Content } = Layout;

export const AdminLayout = () => {
  const { isDarkMode } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated, loading, initialized, checkSession } = useAuth();

  useEffect(() => {
    if (!initialized) {
      checkSession();
    }
  }, [initialized, checkSession]);

  // Loading state during initial session verification
  if (!initialized && loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDarkMode ? '#000000' : '#f8fafc',
          color: isDarkMode ? '#ffffff' : '#0f172a',
        }}
      >
        <Spin size="large" />
        <div style={{ marginTop: 16, fontSize: 14, fontWeight: 600, color: '#64748b' }}>
          Verifying Super Admin Authorization...
        </div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (initialized && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: isDarkMode ? '#000000' : '#f8fafc' }}>
      {/* SUPER ADMIN SIDEBAR */}
      <AppSidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        brandRedirect="/admin/dashboard"
      />

      {/* MAIN CONTENT WRAPPER */}
      <Layout style={{ backgroundColor: isDarkMode ? '#000000' : '#f8fafc' }}>
        {/* SUPER ADMIN TOP BAR */}
        <AppBar />

        {/* OUTLET CONTENT */}
        <Content
          style={{
            padding: '28px 32px',
            minHeight: 'calc(100vh - 72px)',
            backgroundColor: isDarkMode ? '#000000' : '#f8fafc',
            transition: 'all 0.3s ease',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
