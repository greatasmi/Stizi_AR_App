import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';

import { sendOTP } from '../../../store/slices/authSlice';
import { useAppDispatch } from '../../../store/store/hooks';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { COLORS, SIZES } from '../../../utils/constants';

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  OTP: { phoneNumber: string };
};

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhoneNumber = (phone: string): boolean => {
    const regex =
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return regex.test(phone);
  };

  const handleSendOTP = async () => {
    setError('');

    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      await dispatch(sendOTP(phoneNumber)).unwrap();
      navigation.navigate('OTP', { phoneNumber });
    } catch (err) {
      Alert.alert('Error', String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[COLORS.background, COLORS.primary]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.logo}>Stizi</Text>
              <Text style={styles.subtitle}>Discover & Collect Stamps</Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.description}>
                Enter your phone number to receive a verification code
              </Text>

              <Input
                label="Phone Number"
                placeholder="+1 234 567 8900"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                error={error}
                autoFocus
              />

              <Button
                title="Send OTP"
                onPress={handleSendOTP}
                loading={loading}
                fullWidth
                style={styles.button}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
                  Sign Up
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SIZES.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xxl,
  },
  logo: {
    fontSize: SIZES.font.xxxl * 2,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: SIZES.font.lg,
    color: COLORS.accent,
  },
  form: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SIZES.radius.xl,
    padding: SIZES.lg,
  },
  title: {
    fontSize: SIZES.font.xxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SIZES.sm,
  },
  description: {
    fontSize: SIZES.font.md,
    color: COLORS.gray,
    marginBottom: SIZES.lg,
  },
  button: {
    marginTop: SIZES.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.lg,
  },
  footerText: {
    color: COLORS.gray,
    fontSize: SIZES.font.md,
  },
  link: {
    color: COLORS.accent,
    fontSize: SIZES.font.md,
    fontWeight: '600',
  },
});

export default LoginScreen;
