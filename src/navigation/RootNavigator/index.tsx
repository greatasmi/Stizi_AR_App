import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootState, AppDispatch } from '../../store/store';
import { getMe } from '../../store/slices/authSlice';

import AuthStack from '../../navigation/AuthStack';
import AppStack from '../../navigation/AppStack';
import Loader from '../../components/Loader';

const RootNavigator = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const bootstrap = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        await dispatch(getMe()).unwrap();
      }
    } catch {
      console.log('Auth restore failed');
    } finally {
      setLoading(false);
    }
  };

  bootstrap();
}, [dispatch]);


  if (loading) {
    return <Loader message="Loading....." />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;
