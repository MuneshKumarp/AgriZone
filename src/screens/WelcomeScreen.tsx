import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const fade = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { 
        toValue: 1, 
        duration: 1000, 
        useNativeDriver: true 
      }),
      Animated.timing(slideUp, { 
        toValue: 0, 
        duration: 800, 
        useNativeDriver: true 
      }),
    ]).start();
  }, [fade, slideUp]);

  const handleUserTypeSelection = (userType: 'hari' | 'landowner') => {
    navigation.navigate('Login', { userType });
  };

  return (
    <LinearGradient colors={['#ecfdf5', '#f0fdf4', '#ffffff']} style={styles.container}>
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.welcomeSection,
            {
              opacity: fade,
              transform: [{ translateY: slideUp }]
            }
          ]}
        >
          <Text style={styles.welcomeTitle}>Welcome to AgriZone</Text>
          <Text style={styles.welcomeSubtitle}>
            Your agricultural companion for modern farming
          </Text>
          <Text style={styles.description}>
            Choose your role to get started with personalized agricultural solutions
          </Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.buttonContainer,
            {
              opacity: fade,
              transform: [{ translateY: slideUp }]
            }
          ]}
        >
          <TouchableOpacity 
            style={[styles.userTypeButton, styles.hariButton]}
            onPress={() => handleUserTypeSelection('hari')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonIcon}>🌾</Text>
            <Text style={styles.buttonTitle}>Hari</Text>
            <Text style={styles.buttonSubtitle}>Agricultural Worker</Text>
            <Text style={styles.buttonDescription}>
              Find work opportunities and manage your agricultural tasks
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.userTypeButton, styles.landownerButton]}
            onPress={() => handleUserTypeSelection('landowner')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonIcon}>🏡</Text>
            <Text style={styles.buttonTitle}>Landowner</Text>
            <Text style={styles.buttonSubtitle}>Property Owner</Text>
            <Text style={styles.buttonDescription}>
              Manage your land and hire agricultural workers
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#16a34a',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  userTypeButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  hariButton: {
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
  },
  landownerButton: {
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  buttonIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  buttonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  buttonDescription: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default WelcomeScreen;
