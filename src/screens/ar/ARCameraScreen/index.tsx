// ============================================
// mobile/src/screens/ar/ARCameraScreen.tsx
// ============================================
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { collectStamp } from '../../store/slices/stampSlice';
import { COLORS, SIZES } from '../../utils/constants';
import { Stamp } from '../../types';

// Note: For production, install and use @reactvision/react-viro for actual AR
// This is a simplified version showing the concept

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

const ARCameraScreen: React.FC<Props> = ({ navigation, route }) => {
  const { stamp } = route.params;
  const [collecting, setCollecting] = useState(false);
  const [collected, setCollected] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleCollectStamp = async () => {
    setCollecting(true);

    try {
      await dispatch(collectStamp(stamp.qrCode)).unwrap();
      setCollected(true);
      
      Alert.alert(
        'Success! 🎉',
        `You've collected the stamp: ${stamp.name}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to collect stamp');
    } finally {
      setCollecting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* AR View Placeholder */}
      <View style={styles.arView}>
        {/* This would be replaced with actual AR view using React Viro */}
        <View style={styles.arPlaceholder}>
          <View style={styles.scanGuide}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
            
            {/* QR Code representation */}
            <View style={styles.qrCodeContainer}>
              <View style={styles.qrCode}>
                <Text style={styles.qrText}>QR</Text>
                <Text style={styles.qrSubtext}>{stamp.name}</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.arText}>
            Point your camera at the AR marker
          </Text>
        </View>
      </View>

      {/* Overlay UI */}
      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
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
                  <Text style={styles.collectButtonSubtext}>Tap to collect stamp</Text>
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
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  arView: {
    flex: 1,
  },
  arPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanGuide: {
    width: 300,
    height: 300,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: COLORS.accent,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: COLORS.accent,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: COLORS.accent,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: COLORS.accent,
  },
  qrCodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCode: {
    width: 200,
    height: 200,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius.md,
    padding: SIZES.md,
  },
  qrText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  qrSubtext: {
    fontSize: SIZES.font.sm,
    color: COLORS.gray,
    marginTop: SIZES.sm,
    textAlign: 'center',
  },
  arText: {
    position: 'absolute',
    bottom: 40,
    color: COLORS.accent,
    fontSize: SIZES.font.md,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: COLORS.white,
    fontSize: 24,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: SIZES.font.lg,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  stampInfo: {
    position: 'absolute',
    top: 100,
    left: SIZES.md,
    right: SIZES.md,
    backgroundColor: 'rgba(26, 11, 61, 0.9)',
    borderRadius: SIZES.radius.lg,
    padding: SIZES.md,
    backdropFilter: 'blur(10px)',
  },
  stampName: {
    color: COLORS.white,
    fontSize: SIZES.font.xl,
    fontWeight: 'bold',
    marginBottom: SIZES.xs,
  },
  stampDescription: {
    color: COLORS.gray,
    fontSize: SIZES.font.md,
  },
  footer: {
    position: 'absolute',
    bottom: SIZES.lg,
    left: SIZES.md,
    right: SIZES.md,
  },
  collectButton: {
    backgroundColor: COLORS.accent,
    borderRadius: SIZES.radius.lg,
    padding: SIZES.lg,
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  collectButtonDisabled: {
    opacity: 0.6,
  },
  collectButtonText: {
    color: COLORS.dark,
    fontSize: SIZES.font.xl,
    fontWeight: 'bold',
  },
  collectButtonSubtext: {
    color: COLORS.dark,
    fontSize: SIZES.font.sm,
    marginTop: SIZES.xs,
    opacity: 0.7,
  },
  successCard: {
    backgroundColor: COLORS.success,
    borderRadius: SIZES.radius.lg,
    padding: SIZES.lg,
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 48,
    marginBottom: SIZES.sm,
  },
  successText: {
    color: COLORS.white,
    fontSize: SIZES.font.xl,
    fontWeight: 'bold',
  },
});

export default ARCameraScreen;

// ============================================
// For Production AR Implementation:
// Install: npm install @reactvision/react-viro
// ============================================

/*
PRODUCTION AR CODE EXAMPLE:

import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroNode,
  ViroImage,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
  ViroQuad,
} from '@reactvision/react-viro';

const ARScene = ({ stamp, onCollect }) => {
  const [objectPosition, setObjectPosition] = useState([0, 0, -1]);

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={200} />
      
      <ViroNode
        position={objectPosition}
        dragType="FixedToWorld"
        onDrag={() => {}}
      >
        <ViroQuad
          width={0.3}
          height={0.3}
          position={[0, 0, 0]}
          materials={["qrCodeMaterial"]}
        />
      </ViroNode>
    </ViroARScene>
  );
};

const ARCameraScreen = ({ route, navigation }) => {
  const { stamp } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <ViroARSceneNavigator
        initialScene={{
          scene: () => <ARScene stamp={stamp} onCollect={handleCollect} />,
        }}
        viroAppProps={{ stamp }}
      />
      
      <SafeAreaView style={styles.overlay}>
        {/* UI Overlay */
//       </SafeAreaView>
//     </View>
//   );
// };
// */