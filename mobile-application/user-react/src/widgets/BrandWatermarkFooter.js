import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export const BrandWatermarkFooter = ({ style, center = false }) => {
  const { isDark } = useTheme();

  return (
    <View style={[styles.watermarkSection, center && styles.centered, style]}>
      <Text
        style={[
          styles.watermarkLogo,
          {
            color: isDark
              ? 'rgba(255, 255, 255, 0.16)'
              : 'rgba(1, 50, 126, 0.12)',
          },
        ]}
      >
        gymezy
      </Text>
      <Text
        style={[
          styles.watermarkTagline,
          {
            color: isDark
              ? 'rgba(255, 255, 255, 0.12)'
              : 'rgba(1, 50, 126, 0.10)',
          },
        ]}
      >
        for fitness. for you
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  watermarkSection: {
    marginTop: 24,
    marginBottom: 10,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  watermarkLogo: {
    fontSize: 46,
    fontWeight: '900',
    letterSpacing: 2,
  },
  watermarkTagline: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2.5,
  },
});

export default BrandWatermarkFooter;
