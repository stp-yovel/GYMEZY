import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { AppTheme, AppColors } from './appTheme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system'); // 'light', 'dark', 'system'

  const isDark = themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const colors = {
    background: AppTheme.getBackgroundColor(isDark),
    card: AppTheme.getCardColor(isDark),
    surface: AppTheme.getSurfaceColor(isDark),
    text: AppTheme.getTextColor(isDark),
    subtitle: AppTheme.getSubtitleColor(isDark),
    border: AppTheme.getBorderColor(isDark),
    accent: AppTheme.getAccentColor(isDark),
    success: AppTheme.getSuccessColor(isDark),
    danger: AppTheme.getDangerColor(isDark),
    pillBg: AppTheme.getPillBgColor(isDark),
    pillText: AppTheme.getPillTextColor(isDark),
    activeChipBg: AppTheme.getActiveChipBg(isDark),
    activeChipText: AppTheme.getActiveChipText(isDark),
    inactiveChipBg: AppTheme.getInactiveChipBg(isDark),
    inactiveChipBorder: AppTheme.getInactiveChipBorder(isDark),
    ratingBg: AppTheme.getRatingBg(isDark),
    ratingText: AppTheme.getRatingText(isDark),
    primary: AppColors.primaryColor,
    secondary: AppColors.secondaryColor,
  };

  const cardShadow = AppTheme.getCardShadow(isDark);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        themeMode,
        setThemeMode,
        toggleTheme,
        colors,
        cardShadow,
        theme: AppTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
