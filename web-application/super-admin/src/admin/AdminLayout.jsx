import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from '../theme/ThemeContext';
import AppSidebar from '../general/components/AppSidebar';
import AppBar from '../general/components/AppBar';

const { Content } = Layout;

export const AdminLayout = () => {
  const { isDarkMode } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
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
