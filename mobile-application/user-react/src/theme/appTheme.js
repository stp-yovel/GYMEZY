export const AppColors = {
  // Brand & Palette Constants
  primaryColor: '#003882',
  primaryNavy: '#003882',
  secondaryColor: '#00BF62',
  accentColor: '#6366F1',
  lightAccentColor: '#EEF2FF',
  darkAccentColor: '#93C5FD',

  // Functional Status Colors
  successGreen: '#16A34A',
  successBg: '#E6F7EF',
  successBorder: '#B7EAD0',

  dangerRed: '#EF4444',
  dangerLightRed: '#F87171',
  dangerBg: '#FEE2E2',

  warningAmber: '#F59E0B',
  warningBg: '#FEF3C7',

  infoBlue: '#3B82F6',
  infoBg: '#EFF6FF',

  // Neutral Dark Backgrounds
  darkBackground: '#121212',
  darkCard: '#1E1E1E',
  darkSurface: '#262626',
  darkBorder: 'rgba(255, 255, 255, 0.12)',

  // Neutral Light Backgrounds
  lightBackground: '#F8FAFC',
  lightCard: '#FFFFFF',
  lightSurface: '#F1F5F9',
  lightBorder: '#E2E8F0',
};

export const AppTheme = {
  ...AppColors,

  // Dynamic Theme Helpers
  getBackgroundColor: (isDark) => (isDark ? AppColors.darkBackground : AppColors.lightBackground),
  getCardColor: (isDark) => (isDark ? AppColors.darkCard : AppColors.lightCard),
  getSurfaceColor: (isDark) => (isDark ? AppColors.darkSurface : AppColors.lightSurface),
  getTextColor: (isDark) => (isDark ? '#FFFFFF' : '#0F172A'),
  getSubtitleColor: (isDark) => (isDark ? 'rgba(255, 255, 255, 0.7)' : '#64748B'),
  getBorderColor: (isDark) => (isDark ? AppColors.darkBorder : AppColors.lightBorder),
  getAccentColor: (isDark) => (isDark ? AppColors.darkAccentColor : AppColors.primaryNavy),
  getSuccessColor: (isDark) => (isDark ? '#4ADE80' : AppColors.successGreen),
  getDangerColor: (isDark) => (isDark ? AppColors.dangerLightRed : AppColors.dangerRed),

  getPillBgColor: (isDark) => (isDark ? 'rgba(30, 58, 138, 0.6)' : 'rgba(0, 56, 130, 0.1)'),
  getPillTextColor: (isDark) => (isDark ? AppColors.darkAccentColor : AppColors.primaryNavy),

  getDotColor: (isDark, isActive) => {
    if (isDark) {
      return isActive ? AppColors.secondaryColor : 'rgba(255, 255, 255, 0.24)';
    }
    return isActive ? AppColors.primaryColor : 'rgba(0, 56, 130, 0.3)';
  },

  getActiveChipBg: (isDark) => (isDark ? 'rgba(99, 102, 241, 0.25)' : AppColors.lightAccentColor),
  getActiveChipText: (isDark) => (isDark ? '#FFFFFF' : AppColors.accentColor),
  getInactiveChipBg: (isDark) => (isDark ? AppColors.darkSurface : 'transparent'),
  getInactiveChipBorder: (isDark) => (isDark ? 'transparent' : AppColors.lightBorder),

  getRatingBg: (isDark) => (isDark ? 'rgba(27, 94, 32, 0.3)' : '#E8F5E9'),
  getRatingText: (isDark) => (isDark ? '#81C784' : '#2E7D32'),

  // Shadows & Radii
  cardRadius: 22,
  pillRadius: 12,
  buttonRadius: 16,
  sheetRadius: 28,

  getCardShadow: (isDark) => ({
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.38 : 0.04,
    shadowRadius: 12,
    elevation: isDark ? 4 : 2,
  }),
};
