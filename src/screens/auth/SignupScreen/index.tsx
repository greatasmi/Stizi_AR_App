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

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

interface FormErrors {
  name: string;
  phoneNumber: string;
  email: string;
}

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    phoneNumber: '',
    email: '',
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: '',
      phoneNumber: '',
      email: '',
    };

    if (!name.trim()) newErrors.name = 'Name is required';

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (
      !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(
        phoneNumber
      )
    ) {
      newErrors.phoneNumber = 'Invalid phone number';
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

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
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Text style={styles.logo}>Stizi</Text>
              <Text style={styles.subtitle}>Start Your Adventure</Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.description}>
                Sign up to start collecting stamps
              </Text>

              <Input
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
                error={errors.name}
                autoFocus
              />

              <Input
                label="Phone Number"
                placeholder="+1 234 567 8900"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                error={errors.phoneNumber}
              />

              <Input
                label="Email (Optional)"
                placeholder="john@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              <Button
                title="Sign Up"
                onPress={handleSignup}
                loading={loading}
                fullWidth
                style={styles.button}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                  Log In
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

export default SignupScreen;
