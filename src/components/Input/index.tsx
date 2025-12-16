import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  StyleProp,
} from 'react-native';
import { COLORS, SIZES } from '../../utils/constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
        placeholderTextColor={COLORS.gray}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: SIZES.md,
  },
  label: {
    color: COLORS.white,
    fontSize: SIZES.font.md,
    marginBottom: SIZES.sm,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.darkGray,
    borderRadius: SIZES.radius.md,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    color: COLORS.white,
    fontSize: SIZES.font.md,
    minHeight: 50,
  },
  inputFocused: {
    borderColor: COLORS.accent,
    borderWidth: 2,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  error: {
    color: COLORS.error,
    fontSize: SIZES.font.sm,
    marginTop: SIZES.xs,
  },
});

export default Input;
