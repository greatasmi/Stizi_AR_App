import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { COLORS, SIZES } from '../../utils/constants';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoadingProps> = ({ message, fullScreen = true }) => {
  return (
    <View style={fullScreen ? styles.fullScreen : styles.inline}>
      <ActivityIndicator
        size={fullScreen ? 'large' : 'small'}
        color={COLORS.accent}
      />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inline: {
    padding: SIZES.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: COLORS.white,
    fontSize: SIZES.font.md,
    marginTop: SIZES.md,
  },
});

export default Loader;
