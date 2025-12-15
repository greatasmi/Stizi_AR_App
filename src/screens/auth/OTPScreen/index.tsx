import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
// FIX: Import from the correct subpackages
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppDispatch } from '../../../store/store';
import { verifyOTP, sendOTP } from '../../../store/slices/authSlice';
import Button from '../../../components/Button';
import { COLORS, SIZES } from '../../../utils/constants';
import LinearGradient from 'react-native-linear-gradient';

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  OTP: { phoneNumber: string };
};

type OTPScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'OTP'>;
type OTPScreenRouteProp = RouteProp<AuthStackParamList, 'OTP'>;

interface Props {
  navigation: OTPScreenNavigationProp;
  route: OTPScreenRouteProp;
}

const OTP_LENGTH = 6;

const OTPScreen: React.FC<Props> = ({ navigation, route }) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      // Handle paste
      const pastedCode = text.slice(0, OTP_LENGTH).split('');
      const newOtp = [...otp];
      pastedCode.forEach((char, i) => {
        if (index + i < OTP_LENGTH) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      
      const nextIndex = Math.min(index + pastedCode.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== OTP_LENGTH) {
      Alert.alert('Error', 'Please enter complete OTP');
      return;
    }

    setLoading(true);

    try {
      await dispatch(verifyOTP({ phoneNumber, otp: otpCode })).unwrap();
      // Navigation is handled by root navigator
    } catch (err: any) {
      Alert.alert('Error', err || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);

    try {
      await dispatch(sendOTP(phoneNumber)).unwrap();
      Alert.alert('Success', 'OTP sent successfully');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      Alert.alert('Error', err || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.primary]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Verify Code</Text>
            <Text style={styles.description}>
              Enter the 6-digit code sent to {'\n'}
              <Text style={styles.phoneNumber}>{phoneNumber}</Text>
            </Text>
          </View>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  digit && styles.otpInputFilled,
                ]}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          <Button
            title="Verify"
            onPress={handleVerifyOTP}
            loading={loading}
            fullWidth
            style={styles.button}
          />

          <View style={styles.resendContainer}>
            {countdown > 0 ? (
              <Text style={styles.resendText}>
                Resend code in {countdown}s
              </Text>
            ) : (
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={resending}
              >
                <Text style={styles.resendLink}>
                  {resending ? 'Sending...' : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SIZES.lg,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: SIZES.lg,
    left: SIZES.lg,
    zIndex: 1,
  },
  backButtonText: {
    color: COLORS.accent,
    fontSize: SIZES.font.lg,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xxl,
  },
  title: {
    fontSize: SIZES.font.xxxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SIZES.md,
  },
  description: {
    fontSize: SIZES.font.md,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  phoneNumber: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.xl,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderRadius: SIZES.radius.md,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 2,
    borderColor: COLORS.darkGray,
    color: COLORS.white,
    fontSize: SIZES.font.xxl,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  otpInputFilled: {
    borderColor: COLORS.accent,
  },
  button: {
    marginBottom: SIZES.lg,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    color: COLORS.gray,
    fontSize: SIZES.font.md,
  },
  resendLink: {
    color: COLORS.accent,
    fontSize: SIZES.font.md,
    fontWeight: '600',
  },
});

export default OTPScreen;