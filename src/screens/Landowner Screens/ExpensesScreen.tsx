import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ExpensesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses</Text>
      <Text style={styles.subtitle}>Coming soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontWeight: '700', fontSize: 18 },
  subtitle: { color: '#6b7280', marginTop: 6 },
});

export default ExpensesScreen;


