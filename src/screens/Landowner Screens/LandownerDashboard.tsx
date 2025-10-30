import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const LandownerDashboard: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();
  // Initial totals (to be loaded from backend later)
  const totals = { zones: 0, crops: 0, farmers: 0, expensesThisMonth: 0 };

  return (
    <LinearGradient colors={['#f0fdf4', '#ecfdf5']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Welcome back, Landowner!</Text>
              <Text style={styles.subGreeting}>Monitor zones, crops, farmers and expenses</Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}><Text style={styles.statNumber}>{totals.zones}</Text><Text style={styles.statLabel}>Zones</Text></View>
          <View style={styles.statCard}><Text style={styles.statNumber}>{totals.crops}</Text><Text style={styles.statLabel}>Crops</Text></View>
          <View style={styles.statCard}><Text style={styles.statNumber}>{totals.farmers}</Text><Text style={styles.statLabel}>Farmers</Text></View>
          <View style={styles.statCard}><Text style={styles.statNumber}>₹{totals.expensesThisMonth}</Text><Text style={styles.statLabel}>Expenses (This Month)</Text></View>
        </View>

        {/* Quick Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Insights</Text>
          <View style={styles.activityCard}>
            <Text style={{ color: '#6b7280' }}>No insights yet. Connect your data to see analytics here.</Text>
          </View>
        </View>

        {/* Management Navigation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manage</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => (navigation as any).navigate('Zones')}>
              <Text style={styles.actionIcon}>🗺️</Text>
              <Text style={styles.actionText}>Zones</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => (navigation as any).navigate('Farmers')}>
              <Text style={styles.actionIcon}>👥</Text>
              <Text style={styles.actionText}>Farmers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => (navigation as any).navigate('Crops')}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>Crops</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => (navigation as any).navigate('Expenses')}>
              <Text style={styles.actionIcon}>💰</Text>
              <Text style={styles.actionText}>Expenses</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#6b7280',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: (width - 56) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: (width - 56) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  propertyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeBadge: {
    backgroundColor: '#dcfce7',
  },
  planningBadge: {
    backgroundColor: '#fef3c7',
  },
  availableBadge: {
    backgroundColor: '#dbeafe',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  propertyDetails: {
    gap: 8,
  },
  propertyDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyDetailIcon: {
    fontSize: 14,
    marginRight: 8,
    width: 20,
  },
  propertyDetailText: {
    fontSize: 14,
    color: '#6b7280',
  },
  workerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  workerDetails: {
    gap: 8,
  },
  workerDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workerDetailIcon: {
    fontSize: 14,
    marginRight: 8,
    width: 20,
  },
  workerDetailText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default LandownerDashboard;
