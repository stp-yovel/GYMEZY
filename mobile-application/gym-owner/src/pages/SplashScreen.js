import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { AppColors } from '../theme/appTheme';
import { useAuth } from '../context/AuthContext';

export const SplashScreen = ({ navigation }) => {
  const { isDark } = useTheme();
  const { isAuthenticated, gym, isRestoringToken } = useAuth();
  const authRef = useRef({ isAuthenticated, gym, isRestoringToken });
  authRef.current = { isAuthenticated, gym, isRestoringToken };

  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(20)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Logo entrance animation
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Tagline entrance animation
    const textTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(textSlide, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();
    }, 400);

    // 3. Auto-navigate based on authenticated JWT session
    const navTimer = setTimeout(() => {
      const { isAuthenticated: authed, gym: currentGym } = authRef.current;
      if (authed) {
        const approvalStatus = currentGym?.approvalStatus || 'Pending Approval';
        if (approvalStatus === 'Approved') {
          navigation.replace('Dashboard');
        } else {
          navigation.replace('ApplicationStatus');
        }
      } else {
        navigation.replace('Onboarding');
      }
    }, 2500);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(navTimer);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />

      {/* Full-screen Background Image */}
      <Image
        source={require('../../assets/pages/splash_screen/splashscreen_background.png')}
        style={[StyleSheet.absoluteFill, styles.bgImage]}
        resizeMode="cover"
      />

      {/* Vignette & Content Overlay */}
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: isDark
              ? 'rgba(0, 0, 0, 0.65)'
              : 'rgba(255, 255, 255, 0.88)',
          },
        ]}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require('../../assets/logo/gymezy.png')}
            style={[
              styles.logo,
              {
                tintColor: isDark ? '#FFFFFF' : AppColors.primaryColor,
              },
            ]}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.taglineContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textSlide }],
            },
          ]}
        >
          <Text
            style={[
              styles.partnerTag,
              {
                color: AppColors.secondaryColor,
              },
            ]}
          >
            PARTNER PORTAL
          </Text>
          <Text
            style={[
              styles.tagline,
              {
                color: isDark ? '#FFFFFF' : AppColors.primaryColor,
              },
            ]}
          >
            GYM MANAGEMENT & OPERATIONS
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 140,
    height: 140,
  },
  taglineContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  partnerTag: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 4,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 4,
  },
});
