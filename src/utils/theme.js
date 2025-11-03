import { Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const BASE_WIDTH = 376;
const BASE_HEIGHT = 812;

export const scaleWidth = (size) => (size / BASE_WIDTH) * screenWidth;
export const scaleHeight = (size) => (size / BASE_HEIGHT) * screenHeight;

export const colors = {
  primary: '#118252',
  primaryDark: '#017a47',
  primaryLight: '#E8F5EE',
  secondary: '#6941C6',
  secondaryLight: '#E8EDFF',
  background: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  white: '#FFFFFF',
  black: '#000000',
  googleRed: '#DB4437',
  facebookBlue: '#1877F2',
  appleBlack: '#000000',
  chatBubbleUser: '#F3F4F6',
  chatBubbleAI: '#F9FAFB',
};

// Values scaled with scaleWidth (as is common for spacing and radius)
export const spacing = {
  xs: scaleWidth(4),
  sm: scaleWidth(8),
  md: scaleWidth(16),
  lg: scaleWidth(24),
  xl: scaleWidth(32),
  xxl: scaleWidth(48),
};

export const borderRadius = {
  sm: scaleWidth(8),
  md: scaleWidth(12),
  lg: scaleWidth(16),
  xl: scaleWidth(24),
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: scaleHeight(48),
    fontWeight: 'bold',
    lineHeight: scaleHeight(55),
  },
  h2: {
    fontSize: scaleHeight(24),
    fontWeight: 'bold',
    lineHeight: scaleHeight(32),
  },
  h3: {
    fontSize: scaleHeight(20),
    fontWeight: '600',
    lineHeight: scaleHeight(28),
  },
  body: {
    fontSize: scaleHeight(16),
    fontWeight: '400',
    lineHeight: scaleHeight(24),
  },
  bodySmall: {
    fontSize: scaleHeight(14),
    fontWeight: '400',
    lineHeight: scaleHeight(20),
  },
  caption: {
    fontSize: scaleHeight(12),
    fontWeight: '400',
    lineHeight: scaleHeight(16),
  },
  button: {
    fontSize: scaleHeight(16),
    fontWeight: '600',
    lineHeight: scaleHeight(24),
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};
export const darkColors = {
  primary: '#118252',
  primaryDark: '#0A5A38',
  primaryLight: '#1E7A50',
  secondary: '#8B5CF6',
  secondaryLight: '#3F3F46',
  background: '#121212',
  text: '#FFFFFF',
  textSecondary: '#E5E7EB',
  textLight: '#A1A1AA',
  border: '#2D2D2D',
  error: '#F87171',
  success: '#34D399',
  white: '#FFFFFF',
  black: '#000000',
  googleRed: '#DB4437',
  facebookBlue: '#1877F2',
  appleBlack: '#FFFFFF',
  chatBubbleUser: '#1E3A34',
  chatBubbleAI: '#1A1A1A',
};
