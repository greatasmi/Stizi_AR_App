import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MapScreen from '../../screens/map/MapScreen';
import ARCameraScreen from '../../screens/ar/ARCameraScreen';
import { COLORS, SIZES } from '../../utils/constants';
import { Stamp } from '../../types';


export type AppStackParamList = {
  MainTabs: undefined;
  ARCamera: { stamp: Stamp };
};

export type MainTabParamList = {
  Map: undefined;
  Collection: undefined;
  Profile: undefined;
};


const Stack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();


const CollectionScreen = () => (
  <View style={styles.center}>
    <Text style={styles.text}>My Collection</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.center}>
    <Text style={styles.text}>Profile</Text>
  </View>
);


type TabIconProps = {
  color: string;
  size: number;
};

const MapIcon = ({ color, size }: TabIconProps) => (
  <Text style={{ fontSize: size, color }}>🗺️</Text>
);

const CollectionIcon = ({ color, size }: TabIconProps) => (
  <Text style={{ fontSize: size, color }}>📦</Text>
);

const ProfileIcon = ({ color, size }: TabIconProps) => (
  <Text style={{ fontSize: size, color }}>👤</Text>
);


const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ tabBarIcon: MapIcon }}
      />

      <Tab.Screen
        name="Collection"
        component={CollectionScreen}
        options={{ tabBarIcon: CollectionIcon }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ProfileIcon }}
      />
    </Tab.Navigator>
  );
};


const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="ARCamera"
        component={ARCameraScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;


const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  text: {
    color: COLORS.white,
    fontSize: 20,
  },
  tabBar: {
    backgroundColor: COLORS.cardBackground,
    height: 60,
    paddingBottom: 8,
  },
  tabLabel: {
    fontSize: SIZES.font.sm,
    fontWeight: '600', // ✅ now valid
  },
});
