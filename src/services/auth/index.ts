import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../types';

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  sendOTP: async (phoneNumber: string): Promise<{ success: boolean }> => {
    const { data } = await api.post('/auth/send-otp', { phoneNumber });
    return data;
  },

  verifyOTP: async (
    phoneNumber: string,
    otp: string
  ): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/verify-otp', { phoneNumber, otp });

    if (data.token) {
      await AsyncStorage.setItem('token', data.token);
    }

    return data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('token');
  },
};
