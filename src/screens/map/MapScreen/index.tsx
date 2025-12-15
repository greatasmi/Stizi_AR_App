import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootState, AppDispatch } from '../../../store/store';
import { getNearbyStamps } from '../../../store/slices/stampSlice';
import Button from '../../../components/Button';
import MapMarker from '../../../components/MapMarker';
import { COLORS, SIZES } from '../../../utils/constants';
import { Stamp } from '../../../types';

type AppStackParamList = {
  Map: undefined;
  ARCamera: { stamp: Stamp };
};

type MapScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Map'>;

interface Props {
  navigation: MapScreenNavigationProp;
}

interface Location {
  latitude: number;
  longitude: number;
}

const MapScreen: React.FC<Props> = ({ navigation }) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [selectedStamp, setSelectedStamp] = useState<Stamp | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const { stamps } = useSelector((state: RootState) => state.stamp);
  const { user } = useSelector((state: RootState) => state.auth);

  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Stizi needs access to your location to show nearby stamps',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert('Permission Denied', 'Location permission is required to use this feature');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      getCurrentLocation();
    }
  }, []);

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  const fetchNearbyStamps = useCallback(async () => {
    if (!currentLocation) return;

    try {
      await dispatch(
        getNearbyStamps({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          radius: 10000, // 10km
        })
      ).unwrap();
    } catch (error) {
      console.error('Failed to fetch stamps:', error);
    }
  }, [currentLocation, dispatch]);

  useEffect(() => {
    if (currentLocation) {
      fetchNearbyStamps();
    }
  }, [currentLocation, fetchNearbyStamps]);


  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        setLoading(false);
      },
      (error) => {
        console.error(error);
        Alert.alert('Error', 'Failed to get current location');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const handleStampPress = (stamp: Stamp) => {
    setSelectedStamp(stamp);
    
    if (!currentLocation) return;

    // Create simple route (straight line for now)
    const route = [
      currentLocation,
      {
        latitude: stamp.location.coordinates[1],
        longitude: stamp.location.coordinates[0],
      },
    ];
    setRouteCoordinates(route);

    // Fit map to show route
    mapRef.current?.fitToCoordinates(route, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    });
  };

  const handleNavigateToStamp = () => {
    if (!selectedStamp || !currentLocation) return;

    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      selectedStamp.location.coordinates[1],
      selectedStamp.location.coordinates[0]
    );

    // If within 50 meters, open AR camera
    if (distance < 50) {
      navigation.navigate('ARCamera', { stamp: selectedStamp });
    } else {
      Alert.alert(
        'Too Far',
        `You need to be within 50m of the stamp to collect it. You are ${Math.round(distance)}m away.`
      );
    }
  };

  const isStampCollected = (stamp: Stamp): boolean => {
    return stamp.collectedBy.includes(user?.id || '');
  };

  if (loading || !currentLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        showsMyLocationButton
        customMapStyle={mapStyle}
      >
        {/* Route polyline */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={COLORS.accent}
            strokeWidth={3}
          />
        )}

        {/* Stamp markers */}
        {stamps.map((stamp) => (
          <Marker
            key={stamp._id}
            coordinate={{
              latitude: stamp.location.coordinates[1],
              longitude: stamp.location.coordinates[0],
            }}
            onPress={() => handleStampPress(stamp)}
          >
            <MapMarker collected={isStampCollected(stamp)} />
          </Marker>
        ))}
      </MapView>

      {/* Stamp info card */}
      {selectedStamp && (
        <View style={styles.stampCard}>
          <View style={styles.stampInfo}>
            <Text style={styles.stampName}>{selectedStamp.name}</Text>
            <Text style={styles.stampDescription} numberOfLines={2}>
              {selectedStamp.description}
            </Text>
            
            {currentLocation && (
              <Text style={styles.stampDistance}>
                {Math.round(
                  calculateDistance(
                    currentLocation.latitude,
                    currentLocation.longitude,
                    selectedStamp.location.coordinates[1],
                    selectedStamp.location.coordinates[0]
                  )
                )}m away
              </Text>
            )}
          </View>

          <View style={styles.stampActions}>
            {isStampCollected(selectedStamp) ? (
              <View style={styles.collectedBadge}>
                <Text style={styles.collectedText}>✓ Collected</Text>
              </View>
            ) : (
              <Button
                title="Collect Stamp"
                onPress={handleNavigateToStamp}
                variant="primary"
              />
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setSelectedStamp(null);
                setRouteCoordinates([]);
              }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Floating action button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          if (mapRef.current && currentLocation) {
            mapRef.current.animateToRegion({
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }
        }}
      >
        <Text style={styles.fabIcon}>📍</Text>
      </TouchableOpacity>
    </View>
  );
};

const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#212121' }],
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#212121' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{ color: '#2c2c2c' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#000000' }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.white,
    fontSize: SIZES.font.lg,
  },
  map: {
    flex: 1,
  },
  stampCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: COLORS.cardBackground,
    borderRadius: SIZES.radius.lg,
    padding: SIZES.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stampInfo: {
    marginBottom: SIZES.md,
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
    marginBottom: SIZES.xs,
  },
  stampDistance: {
    color: COLORS.accent,
    fontSize: SIZES.font.sm,
    fontWeight: '600',
  },
  stampActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  collectedBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radius.md,
    flex: 1,
    alignItems: 'center',
  },
  collectedText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.darkGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SIZES.sm,
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font.xl,
  },
  fab: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabIcon: {
    fontSize: 24,
  },
});

export default MapScreen;