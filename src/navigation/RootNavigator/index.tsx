import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState, AppDispatch } from '../store/store';
import { getMe } from '../store/slices/authSlice';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import Loading from '../components/Loading';

const RootNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (token) {
        await dispatch(getMe()).unwrap();
      }
    } catch (error) {
      console.log('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading message="Loading..." />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;