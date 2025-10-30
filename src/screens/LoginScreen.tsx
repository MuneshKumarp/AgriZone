import React from 'react';
import { useRoute } from '@react-navigation/native';
import HariLoginScreen from './HariLoginScreen';
import LandownerLoginScreen from './LandownerLoginScreen';
import type { UserType } from '../types';

const LoginScreen: React.FC = () => {
  const route = useRoute();
  const userType = (route.params as { userType?: UserType })?.userType || 'hari';

  if (userType === 'landowner') {
    return <LandownerLoginScreen />;
  }

  return <HariLoginScreen />;
};

export default LoginScreen;