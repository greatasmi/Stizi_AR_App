import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { collectStamp } from '../../../store/slices/stampSlice';
import { COLORS, SIZES } from '../../../utils/constants';
import { Stamp } from '../../../types';

// Import Viro AR components
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroNode,
  ViroQuad,
  ViroAmbientLight,
} from '@reactvision/react-viro';

type AppStackParamList = {
  Map: undefined;
  ARCamera: { stamp: Stamp };
};

type ARCameraScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'ARCamera'>;
type ARCameraScreenRouteProp = RouteProp<AppStackParamList, 'ARCamera'>;

interface Props {
  navigation: ARCameraScreenNavigationProp;
  route: ARCameraScreenRouteProp;
}

interface ARSceneProps {
  stamp: Stamp;
  onCollect: () => void;
}

// AR Scene Component
const ARScene: React.FC<ARSceneProps> = ({ stamp, onCollect }) => {
  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={200} />
      <ViroNode
        position={[0, 0, -1]}
        dragType="FixedToWorld"
        onDrag={() => {}}
      >
        <ViroQuad
          width={0.3}
          height={0.3}
          materials={['qrCodeMaterial']}
          onClick={onCollect} // Collect stamp when user taps AR object
        />
      </ViroNode>
    </ViroARScene>
  );
};

const ARCameraScreen: React.FC<Props> = ({ navigation, route }) => {
  const { stamp } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const [collecting, setCollecting] = useState(false);
  const [collected, setCollected] = useState(false);

  const handleCollectStamp = async () => {
    if (collected) return;

    setCollecting(true);
    try {
      await dispatch(collectStamp(stamp.qrCode)).unwrap();
      setCollected(true);
      Alert.alert('Success! 🎉', `You've collected the stamp: ${stamp.name}`, [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to collect stamp';
      Alert.alert('Error', message);
    } finally {
      setCollecting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* AR Scene */}
      <ViroARSceneNavigator
        style={{ flex: 1 }}
        initialScene={{ scene: () => <ARScene stamp={stamp} onCollect={handleCollectStamp} /> }}
        viroAppProps={{ stamp }}
      />

      {/* Overlay UI */}
      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Collect Stamp</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.stampInfo}>
          <Text style={styles.stampName}>{stamp.name}</Text>
          <Text style={styles.stampDescription}>{stamp.description}</Text>
        </View>

        <View style={styles.footer}>
          {!collected && (
            <TouchableOpacity
              style={[styles.collectButton, collecting && styles.collectButtonDisabled]}
              onPress={handleCollectStamp}
              disabled={collecting}
            >
              {collecting ? (
                <ActivityIndicator color={COLORS.dark} />
              ) : (
                <>
                  <Text style={styles.collectButtonText}>Scan QR Code</Text>
                  <Text style={styles.collectButtonSubtext}>Tap the AR object to collect</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {collected && (
            <View style={styles.successCard}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.successText}>Stamp Collected!</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SIZES.md, paddingVertical: SIZES.sm },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  backIcon: { color: COLORS.white, fontSize: 24 },
  headerTitle: { color: COLORS.white, fontSize: SIZES.font.lg, fontWeight: '600' },
  placeholder: { width: 40 },
  stampInfo: { position: 'absolute', top: 100, left: SIZES.md, right: SIZES.md, backgroundColor: 'rgba(26,11,61,0.9)', borderRadius: SIZES.radius.lg, padding: SIZES.md },
  stampName: { color: COLORS.white, fontSize: SIZES.font.xl, fontWeight: 'bold', marginBottom: SIZES.xs },
  stampDescription: { color: COLORS.gray, fontSize: SIZES.font.md },
  footer: { position: 'absolute', bottom: SIZES.lg, left: SIZES.md, right: SIZES.md },
  collectButton: { backgroundColor: COLORS.accent, borderRadius: SIZES.radius.lg, padding: SIZES.lg, alignItems: 'center', shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  collectButtonDisabled: { opacity: 0.6 },
  collectButtonText: { color: COLORS.dark, fontSize: SIZES.font.xl, fontWeight: 'bold' },
  collectButtonSubtext: { color: COLORS.dark, fontSize: SIZES.font.sm, marginTop: SIZES.xs, opacity: 0.7 },
  successCard: { backgroundColor: COLORS.success, borderRadius: SIZES.radius.lg, padding: SIZES.lg, alignItems: 'center' },
  successIcon: { fontSize: 48, marginBottom: SIZES.sm },
  successText: { color: COLORS.white, fontSize: SIZES.font.xl, fontWeight: 'bold' },
});

export default ARCameraScreen;
