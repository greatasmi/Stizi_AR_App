import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';

interface MapMarkerProps {
  collected?: boolean;
}

const MapMarker: React.FC<MapMarkerProps> = ({ collected = false }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.marker, collected && styles.collectedMarker]}>
        <Text style={styles.icon}>📍</Text>
      </View>
      <View style={styles.shadow} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    elevation: 5,
  },
  collectedMarker: {
    backgroundColor: COLORS.gray,
    opacity: 0.6,
  },
  icon: {
    fontSize: 20,
  },
  shadow: {
    width: 20,
    height: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginTop: 4,
  },
});

export default MapMarker;
