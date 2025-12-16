import { Dimensions } from 'react-native';

export const COLORS = {
  primary: '#6B00E3',
  secondary: '#8B5CF6',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  dark: '#1F2937',
  white: '#FFFFFF',
  lightGray: '#F3F4F6',
  gray: '#6B7280',
  darkGray: '#374151',
  background: '#0F0525',
  cardBackground: '#1A0B3D',
  accent: '#7EFF89',
};

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  
  font: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const API_URL = 'http://localhost:5000/api';