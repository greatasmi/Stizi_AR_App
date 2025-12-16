import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from '../screens/map/MapScreen';
import ARCameraScreen from '../screens/ar/ARCameraScreen';
import { COLORS, SIZES } from '../utils/constants';
import { Stamp } from '../types';

export type AppStackParamList = {
  Main: undefined;
  ARCamera: { stamp: Stamp };
};

export type MainTabParamList = {
  Map: undefined;
  Collection: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Placeholder screens for tabs
const CollectionScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
      <Text style={{ color: COLORS.white, fontSize: 20 }}>My Collection</Text>
    </View>
  );
};

const ProfileScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
      <Text style={{ color: COLORS.white, fontSize: 20 }}>Profile</Text>
    </View>
  );
};

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.cardBackground,
          borderTopColor: COLORS.darkGray,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarLabelStyle: {
          fontSize: SIZES.font.sm,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🗺️</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Collection"
        component={CollectionScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📦</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen
        name="ARCamera"
        component={ARCameraScreen}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;