import React, { useContext } from 'react';
import { NavigationContainer, DefaultTheme, Theme, useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import api from '../api/api';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ZonesScreen from '../screens/ZonesScreen';
import CropsScreen from '../screens/CropsScreen';
import FarmersScreen from '../screens/FarmersScreen';
import ExpensesScreen from '../screens/ExpensesScreen';

type AuthStackParamList = {
  Welcome: undefined;
  Login: { userType: 'hari' | 'landowner' };
  Signup: { userType: 'hari' | 'landowner' };
  ForgotPassword: { userType: 'hari' | 'landowner' };
  ResetPassword: { email: string; userType: 'hari' | 'landowner' };
};

type AppStackParamList = {
  Home: undefined;
  Profile: undefined;
  EditProfile: undefined;
  Zones: undefined;
  Crops: undefined;
  Farmers: undefined;
  Expenses: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

const theme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
    primary: '#16a34a',
    card: '#ffffff',
    text: '#111827',
    border: '#e5e7eb',
    notification: '#16a34a',
  },
};

const AppNavigator: React.FC = () => {
  const { isLoading, isAuthenticated, user } = useContext(AuthContext);

  const HeaderAvatar: React.FC<{ onPress: () => void }> = ({ onPress }) => {
    const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
    const baseHost = (api as any)?.defaults?.baseURL?.replace(/\/api$/, '') || '';
    const toAbsoluteUrl = (u: string) => {
      if (!u) return '';
      if (u.startsWith('http://') || u.startsWith('https://')) return u;
      return baseHost ? `${baseHost}${u}` : u;
    };

    useFocusEffect(
      React.useCallback(() => {
        let active = true;
        (async () => {
          try {
            const res = await api.get('/profile/me');
            if (!active) return;
            setAvatarUrl(toAbsoluteUrl(res.data.avatarUrl || ''));
          } catch {
            // ignore
          }
        })();
        return () => { active = false; };
      }, [])
    );

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={{ width: 32, height: 32, borderRadius: 16 }} />
        ) : (
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#16a34a',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>
              {(user?.firstName?.[0] || 'U').toUpperCase()}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer theme={theme}>
      {isAuthenticated ? (
        <AppStack.Navigator>
          <AppStack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              title: 'AgriZone',
              headerShadowVisible: false,
              headerRight: () => (
                <HeaderAvatar onPress={() => navigation.navigate('Profile')} />
              ),
            })}
          />
          <AppStack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'My Profile' }}
          />
          <AppStack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ title: 'Edit Profile' }}
          />
          <AppStack.Screen name="Zones" component={ZonesScreen} options={{ title: 'Zones' }} />
          <AppStack.Screen name="Crops" component={CropsScreen} options={{ title: 'Crops' }} />
          <AppStack.Screen name="Farmers" component={FarmersScreen} options={{ title: 'Farmers' }} />
          <AppStack.Screen name="Expenses" component={ExpensesScreen} options={{ title: 'Expenses' }} />
        </AppStack.Navigator>
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Signup" component={SignupScreen} />
          <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;


