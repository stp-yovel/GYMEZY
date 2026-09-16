import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { AppColors } from '../theme/appTheme';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const timerRef = useRef(null);

  const showToast = useCallback(({ message, isError = false, isSuccess = false, duration = 2600, actionLabel, onAction }) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setToast({ message, isError, isSuccess, actionLabel, onAction });

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 65,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    timerRef.current = setTimeout(() => {
      hideToast();
    }, duration);
  }, []);

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 20,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToast(null);
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.toastContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <View style={[styles.toastPill, toast.isError && styles.errorPill]}>
            <Image
              source={require('../../assets/logo/gymezy.png')}
              style={styles.logoIcon}
              resizeMode="contain"
            />
            <Text style={styles.toastText} numberOfLines={2}>
              {toast.message}
            </Text>
            {toast.actionLabel && toast.onAction && (
              <TouchableOpacity
                onPress={() => {
                  toast.onAction();
                  hideToast();
                }}
                style={styles.actionBtn}
              >
                <Text style={styles.actionText}>{toast.actionLabel}</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 95,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 99999,
  },
  toastPill: {
    backgroundColor: AppColors.primaryColor,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '95%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  errorPill: {
    backgroundColor: '#991B1B',
  },
  logoIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
    marginRight: 10,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'Outfit-SemiBold',
    flexShrink: 1,
  },
  actionBtn: {
    marginLeft: 10,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  actionText: {
    color: AppColors.secondaryColor,
    fontSize: 12,
    fontWeight: '700',
  },
});
