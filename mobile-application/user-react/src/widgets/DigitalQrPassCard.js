import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors, AppTheme } from '../theme/appTheme';
import { useToast } from './CustomScaffoldMessage';

export const DigitalQrPassCard = ({
  passId,
  customerId,
  otp,
  gymName,
  subtitle,
  primaryDateLabel,
  primaryDateValue,
  secondaryDateLabel,
  secondaryDateValue,
  status = 'ACTIVE',
  iconName = 'workspace-premium',
  gymImageUrl,
  accentColor,
}) => {
  const { isDark, colors } = useTheme();
  const { showToast } = useToast();

  const effectiveAccent = isDark
    ? AppColors.darkAccentColor
    : accentColor || AppColors.primaryNavy;

  const qrData = `gymezy://pass?id=${passId}&cust=${customerId}&otp=${otp}`;
  const otpDigits = (otp || '123456').split('');

  const copyToClipboard = async (text, label) => {
    await Clipboard.setStringAsync(text);
    showToast({
      message: `${label} copied to clipboard`,
      isSuccess: true,
    });
  };

  const isActiveStatus = status?.toUpperCase() === 'ACTIVE';

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      {/* 1. Pass Header */}
      <View style={styles.headerSection}>
        <View style={styles.titleRow}>
          <View
            style={[
              styles.iconBadge,
              {
                backgroundColor: isDark ? 'rgba(147, 197, 253, 0.12)' : 'rgba(0, 56, 130, 0.12)',
                borderColor: isDark ? 'rgba(147, 197, 253, 0.2)' : 'rgba(0, 56, 130, 0.2)',
              },
            ]}
          >
            <MaterialIcons name={iconName} size={24} color={effectiveAccent} />
          </View>

          <View style={styles.titleTextContainer}>
            <Text style={[styles.gymNameText, { color: colors.text }]} numberOfLines={1}>
              {gymName}
            </Text>
            <Text style={[styles.subtitleText, { color: effectiveAccent }]}>
              {subtitle}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isActiveStatus
                  ? '#E6F7EF'
                  : isDark
                  ? '#262626'
                  : '#F1F5F9',
                borderColor: isActiveStatus ? '#B7EAD0' : colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isActiveStatus ? '#047857' : colors.subtitle,
                },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                {
                  color: isActiveStatus ? '#047857' : colors.subtitle,
                },
              ]}
            >
              {status?.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Date Strip */}
        <View
          style={[
            styles.dateStrip,
            {
              backgroundColor: isDark ? '#262626' : '#F8FAFC',
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.dateCol}>
            <Text style={[styles.dateLabel, { color: colors.subtitle }]}>
              {primaryDateLabel}
            </Text>
            <Text style={[styles.dateValue, { color: colors.text }]} numberOfLines={1}>
              {primaryDateValue}
            </Text>
          </View>

          <View style={[styles.dateDivider, { backgroundColor: colors.border }]} />

          <View style={styles.dateCol}>
            <Text style={[styles.dateLabel, { color: colors.subtitle }]}>
              {secondaryDateLabel}
            </Text>
            <Text style={[styles.dateValue, { color: colors.text }]} numberOfLines={1}>
              {secondaryDateValue}
            </Text>
          </View>
        </View>
      </View>

      {/* Perforated Tear Line with Scalloped Cutouts */}
      <View style={styles.tearLineContainer}>
        <View
          style={[
            styles.scallopCutoutLeft,
            { backgroundColor: isDark ? AppColors.darkBackground : AppColors.lightBackground },
          ]}
        />
        <View style={styles.dashedLineWrapper}>
          {Array.from({ length: 24 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dashSegment,
                {
                  backgroundColor: i % 2 === 0 ? colors.border : 'transparent',
                },
              ]}
            />
          ))}
        </View>
        <View
          style={[
            styles.scallopCutoutRight,
            { backgroundColor: isDark ? AppColors.darkBackground : AppColors.lightBackground },
          ]}
        />
      </View>

      {/* 2. QR Code Canvas with Centered GYMEZY Logo */}
      <View style={styles.bodySection}>
        <View style={styles.qrCanvasWrapper}>
          <View style={styles.qrCanvas}>
            <QRCode
              value={qrData}
              size={180}
              color="#0F172A"
              backgroundColor="#FFFFFF"
            />
            {/* Center Logo Overlay */}
            <View style={styles.qrCenterLogoContainer}>
              <Image
                source={require('../../assets/logo/gymezy.png')}
                style={styles.qrCenterLogo}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        <Text style={[styles.qrHelpText, { color: colors.subtitle }]}>
          Show this QR code or 6-digit OTP to gym reception
        </Text>

        {/* 3. 6-Digit Check-in OTP */}
        <View
          style={[
            styles.otpContainer,
            {
              backgroundColor: isDark ? '#262626' : '#F1F5F9',
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.otpHeader}>
            <View style={styles.otpHeaderLeft}>
              <MaterialIcons name="pin" size={16} color={effectiveAccent} />
              <Text style={[styles.otpHeaderLabel, { color: colors.subtitle }]}>
                ENTRY OTP
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => copyToClipboard(otp, 'OTP')}
              style={styles.copyBtn}
            >
              <MaterialIcons name="content-copy" size={14} color={effectiveAccent} />
              <Text style={[styles.copyBtnText, { color: effectiveAccent }]}>Copy</Text>
            </TouchableOpacity>
          </View>

          {/* 6 Digit Boxes */}
          <View style={styles.digitRow}>
            {otpDigits.map((digit, idx) => (
              <View
                key={idx}
                style={[
                  styles.digitBox,
                  {
                    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(147, 197, 253, 0.3)' : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.digitText,
                    { color: isDark ? '#FFFFFF' : effectiveAccent },
                  ]}
                >
                  {digit}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 4. Pass Meta Info (Pass ID & Customer ID) */}
        <View
          style={[
            styles.metaInfoRow,
            {
              backgroundColor: isDark ? '#262626' : '#F8FAFC',
              borderColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => copyToClipboard(passId, 'Pass ID')}
            style={styles.metaCol}
            activeOpacity={0.7}
          >
            <Text style={[styles.metaLabel, { color: colors.subtitle }]}>PASS ID</Text>
            <View style={styles.metaValueRow}>
              <Text style={[styles.metaValue, { color: colors.text }]}>{passId}</Text>
              <MaterialIcons
                name="content-copy"
                size={12}
                color={colors.subtitle}
                style={{ marginLeft: 4 }}
              />
            </View>
          </TouchableOpacity>

          <View style={[styles.metaDivider, { backgroundColor: colors.border }]} />

          <View style={styles.metaCol}>
            <Text style={[styles.metaLabel, { color: colors.subtitle }]}>CUSTOMER ID</Text>
            <Text style={[styles.metaValue, { color: colors.text }]}>{customerId}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    borderRadius: 26,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  headerSection: {
    padding: 20,
    paddingBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  gymNameText: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  dateStrip: {
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateCol: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  dateValue: {
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 2,
  },
  dateDivider: {
    width: 1,
    height: 24,
    marginHorizontal: 10,
  },
  tearLineContainer: {
    height: 24,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  scallopCutoutLeft: {
    position: 'absolute',
    left: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    zIndex: 10,
  },
  scallopCutoutRight: {
    position: 'absolute',
    right: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    zIndex: 10,
  },
  dashedLineWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dashSegment: {
    flex: 1,
    height: 1.5,
    marginHorizontal: 2,
  },
  bodySection: {
    padding: 20,
    paddingTop: 14,
    alignItems: 'center',
  },
  qrCanvasWrapper: {
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCanvas: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCenterLogoContainer: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: AppColors.primaryNavy,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  qrCenterLogo: {
    width: 26,
    height: 26,
    tintColor: AppColors.primaryNavy,
  },
  qrHelpText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  otpContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 14,
  },
  otpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  otpHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  otpHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginLeft: 6,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  digitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  digitBox: {
    width: 42,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  digitText: {
    fontSize: 20,
    fontWeight: '900',
  },
  metaInfoRow: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  metaValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metaValue: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  metaDivider: {
    width: 1,
    height: 22,
    marginHorizontal: 10,
  },
});
