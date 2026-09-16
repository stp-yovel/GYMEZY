import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors } from '../theme/appTheme';
import { useToast } from '../widgets/CustomScaffoldMessage';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const LoginScreen = ({ navigation }) => {
  const { isDark, colors } = useTheme();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [obscurePassword, setObscurePassword] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fillDemoCredentials = () => {
    setEmail('sam@gmail.com');
    setPassword('123456');
    setErrors({});
    showToast({
      message: 'Demo credentials loaded! Tap Log In to continue.',
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Please enter your password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (email.trim() === 'sam@gmail.com' && password === '123456') {
        navigation.replace('HomeTabs');
      } else {
        showToast({
          message: 'Invalid credentials! Tap "Auto-Fill Demo" above.',
          isError: true,
        });
      }
    }, 600);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. TOP HERO: Cinematic Visual with Vignette & GYMEZY Silhouette Logo */}
        <View style={styles.topHeroContainer}>
          <Image
            source={require('../../assets/pages/onboarding/onboarding_1.jpg')}
            style={styles.heroImage}
            resizeMode="cover"
          />

          <LinearGradient
            colors={
              isDark
                ? [
                    'rgba(0,0,0,0.55)',
                    'transparent',
                    'rgba(18,18,18,0.7)',
                    AppColors.darkBackground,
                  ]
                : [
                    'rgba(0,0,0,0.45)',
                    'transparent',
                    'rgba(0,0,0,0.15)',
                    'rgba(0,0,0,0.55)',
                  ]
            }
            stops={isDark ? [0, 0.4, 0.75, 1] : [0, 0.35, 0.7, 1]}
            style={styles.gradientOverlay}
          />

          {/* Centered Brand Logo */}
          <SafeAreaView style={styles.heroCenterContent}>
            <Image
              source={require('../../assets/logo/gymezy.png')}
              style={styles.heroLogo}
              resizeMode="contain"
            />
            <Text style={styles.heroSubtitle}>ELEVATE YOUR FITNESS</Text>
          </SafeAreaView>

          {/* Quick Demo Auto-Fill Pill */}
          <SafeAreaView style={styles.demoPillWrapper}>
            <TouchableOpacity
              onPress={fillDemoCredentials}
              style={styles.demoPill}
              activeOpacity={0.8}
            >
              <MaterialIcons name="bolt" size={14} color={AppColors.secondaryColor} />
              <Text style={styles.demoPillText}>Auto-Fill Demo</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* 2. FORM & ACTIONS SECTION */}
        <View style={styles.formContainer}>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Welcome Back
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.subtitle }]}>
            Log in to manage your bookings and passes
          </Text>

          {/* Email Field */}
          <Text style={[styles.fieldLabel, { color: colors.text }]}>
            Email Address
          </Text>
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: colors.card,
                borderColor: errors.email ? '#EF4444' : colors.border,
              },
            ]}
          >
            <MaterialIcons
              name="mail-outline"
              size={20}
              color={isDark ? 'rgba(255,255,255,0.6)' : AppColors.primaryColor}
              style={styles.inputPrefixIcon}
            />
            <TextInput
              style={[styles.inputField, { color: colors.text }]}
              placeholder="e.g. sam@gmail.com"
              placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* Password Field */}
          <Text style={[styles.fieldLabel, { color: colors.text, marginTop: 16 }]}>
            Password
          </Text>
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: colors.card,
                borderColor: errors.password ? '#EF4444' : colors.border,
              },
            ]}
          >
            <MaterialIcons
              name="lock-outline"
              size={20}
              color={isDark ? 'rgba(255,255,255,0.6)' : AppColors.primaryColor}
              style={styles.inputPrefixIcon}
            />
            <TextInput
              style={[styles.inputField, { color: colors.text }]}
              placeholder="Enter your password"
              placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              secureTextEntry={obscurePassword}
            />
            <TouchableOpacity
              onPress={() => setObscurePassword(!obscurePassword)}
              style={styles.inputSuffixBtn}
            >
              <MaterialIcons
                name={obscurePassword ? 'visibility-off' : 'visibility'}
                size={20}
                color={colors.subtitle}
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          {/* Remember Me & Forgot Password */}
          <View style={styles.rememberForgotRow}>
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              style={styles.rememberRow}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: rememberMe
                      ? AppColors.secondaryColor
                      : 'transparent',
                    borderColor: rememberMe
                      ? AppColors.secondaryColor
                      : colors.border,
                  },
                ]}
              >
                {rememberMe && (
                  <MaterialIcons name="check" size={14} color="#FFFFFF" />
                )}
              </View>
              <Text style={[styles.rememberText, { color: colors.subtitle }]}>
                Remember me
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                showToast({
                  message: 'Password reset link sent to registered email.',
                })
              }
            >
              <Text
                style={[
                  styles.forgotText,
                  { color: isDark ? AppColors.darkAccentColor : AppColors.primaryColor },
                ]}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Log In Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            style={[
              styles.loginBtn,
              { backgroundColor: AppColors.secondaryColor },
            ]}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.loginBtnContent}>
                <Text style={styles.loginBtnText}>Log In</Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                  style={{ marginLeft: 8 }}
                />
              </View>
            )}
          </TouchableOpacity>

          {/* Social Login Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.subtitle }]}>
              or continue with
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Explore as Guest Button */}
          <TouchableOpacity
            onPress={() => navigation.replace('HomeTabs')}
            style={[
              styles.guestBtn,
              { borderColor: colors.border },
            ]}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="explore"
              size={18}
              color={colors.text}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.guestBtnText, { color: colors.text }]}>
              Explore as Guest
            </Text>
          </TouchableOpacity>

          {/* Sign Up Footer */}
          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: colors.subtitle }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={fillDemoCredentials}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 36,
  },
  topHeroContainer: {
    height: SCREEN_HEIGHT * 0.35,
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  heroCenterContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLogo: {
    height: 48,
    width: 140,
    tintColor: '#FFFFFF',
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    marginTop: 8,
  },
  demoPillWrapper: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 36 : 10,
    right: 16,
  },
  demoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  demoPillText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
    marginLeft: 4,
  },
  formContainer: {
    paddingHorizontal: 22,
    paddingTop: 16,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 13.5,
    letterSpacing: 0.1,
    marginTop: 4,
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  inputPrefixIcon: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  inputSuffixBtn: {
    padding: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    marginTop: 4,
  },
  rememberForgotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rememberText: {
    fontSize: 12.5,
    marginLeft: 8,
  },
  forgotText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  loginBtn: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 0.8,
  },
  dividerText: {
    fontSize: 12,
    marginHorizontal: 14,
  },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 16,
    borderWidth: 1.2,
  },
  guestBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 26,
  },
  footerText: {
    fontSize: 13,
  },
  signUpLink: {
    fontSize: 13,
    color: AppColors.secondaryColor,
    fontWeight: '700',
  },
});
