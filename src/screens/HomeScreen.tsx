import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import HariDashboard from './HariDashboard';
import LandownerDashboard from './LandownerDashboard';

const HomeScreen: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  // Route to appropriate dashboard based on user type
  if (user?.userType === 'hari') {
    return <HariDashboard />;
  } else if (user?.userType === 'landowner') {
    return <LandownerDashboard />;
  }

  // Fallback for users without userType (legacy users)
  return (
    <LinearGradient colors={['#ecfdf5', '#ffffff']} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome{user?.firstName ? `, ${user.firstName}` : ''} 👋</Text>
        <Text style={styles.subtitle}>You're logged in to AgriZone.</Text>

        <TouchableOpacity style={styles.button} onPress={() => (navigation as any).navigate('Profile')} activeOpacity={0.9}>
          <LinearGradient colors={['#16a34a', '#22c55e']} style={styles.buttonBg}>
            <Text style={styles.buttonText}>My Profile</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 24 },
  button: { borderRadius: 14, overflow: 'hidden', alignSelf: 'stretch' },
  buttonBg: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
});

export default HomeScreen;


