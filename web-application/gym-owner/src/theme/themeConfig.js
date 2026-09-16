import { theme } from 'antd';

export const lightTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#003882',
    colorSuccess: '#00bf62',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f8fafc',
    colorTextBase: '#0f172a',
    colorBorder: '#e2e8f0',
    colorBorderSecondary: '#f1f5f9',
    borderRadius: 8,
    fontFamily: "'Plus Jakarta Sans', 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      fontWeight: 600,
    },
    Card: {
      borderRadiusLG: 8,
    },
    Table: {
      borderRadiusLG: 8,
    },
    Input: {
      controlHeight: 42,
      borderRadius: 8,
    },
    Select: {
      controlHeight: 42,
      borderRadius: 8,
    },
    Modal: {
      borderRadiusLG: 8,
    },
    Tag: {
      borderRadiusSM: 6,
    },
  },
};

export const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#1677ff',
    colorSuccess: '#00bf62',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#38bdf8',
    colorBgBase: '#000000', // Pure full black background as requested
    colorBgContainer: '#0d0d0d', // Deep black card surface
    colorBgElevated: '#141414',
    colorBgLayout: '#000000', // Full black layout background
    colorTextBase: '#f8fafc',
    colorTextSecondary: '#94a3b8',
    colorBorder: '#222222',
    colorBorderSecondary: '#181818',
    borderRadius: 8,
    fontFamily: "'Plus Jakarta Sans', 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      fontWeight: 600,
    },
    Card: {
      borderRadiusLG: 8,
    },
    Table: {
      borderRadiusLG: 8,
    },
    Input: {
      controlHeight: 42,
      borderRadius: 8,
    },
    Select: {
      controlHeight: 42,
      borderRadius: 8,
    },
    Modal: {
      borderRadiusLG: 8,
    },
    Tag: {
      borderRadiusSM: 6,
    },
  },
};

