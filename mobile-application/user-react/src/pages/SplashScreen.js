import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { AppColors } from '../theme/appTheme';

export const SplashScreen = ({ navigation }) => {
  const { isDark } = useTheme();

  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(20)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo entrance animation
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Tagline entrance animation
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textSlide, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, 600);

    // Auto-navigate to Onboarding after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />
      <ImageBackground
        source={require('../../assets/pages/splash_screen/splashscreen_background.png')}
        style={styles.bgImage}
        resizeMode="cover"
      >
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
                styles.tagline,
                {
                  color: isDark ? '#FFFFFF' : AppColors.primaryColor,
                },
              ]}
            >
              PREMIUM FITNESS
            </Text>
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
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
    marginTop: 35,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 8,
  },
});
