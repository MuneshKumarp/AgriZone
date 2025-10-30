import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const HariDashboard: React.FC = () => {
  const { logout } = useContext(AuthContext);
  
  const mockJobs = [
    {
      id: '1',
      title: 'Rice Planting - 5 Acres',
      location: 'Punjab, India',
      duration: '2 weeks',
      pay: '₹15,000',
      status: 'Available',
      date: '2024-01-15',
    },
    {
      id: '2',
      title: 'Wheat Harvesting',
      location: 'Haryana, India',
      duration: '1 week',
      pay: '₹12,000',
      status: 'Applied',
      date: '2024-01-20',
    },
    {
      id: '3',
      title: 'Vegetable Farming',
      location: 'Maharashtra, India',
      duration: '3 weeks',
      pay: '₹18,000',
      status: 'Available',
      date: '2024-01-25',
    },
  ];

  const mockStats = {
    totalJobs: 12,
    completedJobs: 8,
    earnings: '₹1,25,000',
    rating: 4.8,
  };

  const renderJobCard = (job: any) => (
    <TouchableOpacity key={job.id} style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <View style={[styles.statusBadge, job.status === 'Available' ? styles.availableBadge : styles.appliedBadge]}>
          <Text style={styles.statusText}>{job.status}</Text>
        </View>
      </View>
      <View style={styles.jobDetails}>
        <View style={styles.jobDetailItem}>
          <Text style={styles.jobDetailIcon}>📍</Text>
          <Text style={styles.jobDetailText}>{job.location}</Text>
        </View>
        <View style={styles.jobDetailItem}>
          <Text style={styles.jobDetailIcon}>⏱️</Text>
          <Text style={styles.jobDetailText}>{job.duration}</Text>
        </View>
        <View style={styles.jobDetailItem}>
          <Text style={styles.jobDetailIcon}>💰</Text>
          <Text style={styles.jobDetailText}>{job.pay}</Text>
        </View>
        <View style={styles.jobDetailItem}>
          <Text style={styles.jobDetailIcon}>📅</Text>
          <Text style={styles.jobDetailText}>{job.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#ecfdf5', '#f0fdf4']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Welcome back, Hari!</Text>
              <Text style={styles.subGreeting}>Ready for your next agricultural opportunity?</Text>
            </View>
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={() => {
                Alert.alert(
                  'Logout',
                  'Are you sure you want to logout?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Logout', style: 'destructive', onPress: logout }
                  ]
                );
              }}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mockStats.totalJobs}</Text>
            <Text style={styles.statLabel}>Total Jobs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mockStats.completedJobs}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mockStats.earnings}</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>⭐ {mockStats.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>🔍</Text>
              <Text style={styles.actionText}>Find Jobs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionText}>My Applications</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>💼</Text>
              <Text style={styles.actionText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📞</Text>
              <Text style={styles.actionText}>Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Available Jobs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Jobs</Text>
          {mockJobs.map(renderJobCard)}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <Text style={styles.activityIcon}>✅</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Job Completed</Text>
                <Text style={styles.activitySubtitle}>Rice Planting - Punjab</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityIcon}>💰</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Payment Received</Text>
                <Text style={styles.activitySubtitle}>₹15,000 from Landowner</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityIcon}>⭐</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Rating Received</Text>
                <Text style={styles.activitySubtitle}>5 stars for excellent work</Text>
                <Text style={styles.activityTime}>2 days ago</Text>
              </View>
            </View>
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
    color: '#16a34a',
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
  jobCard: {
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
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobTitle: {
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
  availableBadge: {
    backgroundColor: '#dcfce7',
  },
  appliedBadge: {
    backgroundColor: '#fef3c7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },
  jobDetails: {
    gap: 8,
  },
  jobDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobDetailIcon: {
    fontSize: 14,
    marginRight: 8,
    width: 20,
  },
  jobDetailText: {
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

export default HariDashboard;
