import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';

const SplashScreen: React.FC = () => {
  const spin = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.loader, { transform: [{ rotate }] }]} />
      <Text style={styles.text}>AgriZone</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#16a34a',
    shadowColor: '#16a34a',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    marginBottom: 12,
  },
  text: {
    fontSize: 20,
    fontWeight: '700',
    color: '#16a34a',
    letterSpacing: 1,
  },
});

export default SplashScreen;


