import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../api/api';

const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email, userType } = route.params as { email: string; userType: 'hari' | 'landowner' };

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fade = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(12)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(translate, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [fade, translate]);

  const handleReset = async () => {
    setError(null);

    // Validation
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);

    try {
      // Reset password (will verify OTP internally)
      await api.post('/password/reset', {
        email,
        otp,
        newPassword,
      });

      // Success - navigate to login
      navigation.navigate('Login', { userType });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to reset password. Please try again.';
      setError(errorMessage);
      Animated.sequence([
        Animated.timing(translate, { toValue: -6, duration: 70, useNativeDriver: true }),
        Animated.timing(translate, { toValue: 6, duration: 70, useNativeDriver: true }),
        Animated.timing(translate, { toValue: 0, duration: 70, useNativeDriver: true }),
      ]).start();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={['#ecfdf5', '#ffffff']} style={styles.flex}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View style={styles.container}>
          <Animated.View style={[styles.card, { opacity: fade, transform: [{ translateY: translate }] }]}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter the OTP sent to {email} and create a new password.
            </Text>

            <View style={styles.field}>
              <Text style={styles.label}>OTP Code</Text>
              <TextInput
                placeholder="Enter 6-digit code"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={(text) => {
                  setOtp(text);
                  setError(null);
                }}
                style={styles.input}
                editable={!submitting}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                placeholder="Enter new password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  setError(null);
                }}
                style={styles.input}
                editable={!submitting}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                placeholder="Confirm new password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setError(null);
                }}
                style={styles.input}
                editable={!submitting}
              />
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity onPress={handleReset} disabled={submitting} style={styles.button}>
              <LinearGradient colors={['#16a34a', '#22c55e']} style={styles.buttonBg}>
                <Text style={styles.buttonText}>{submitting ? 'Resetting...' : 'Reset Password'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkWrap}>
              <Text style={styles.linkText}>Back</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#111827' },
  subtitle: { marginTop: 6, color: '#6b7280', marginBottom: 24, lineHeight: 20 },
  field: { marginBottom: 14 },
  label: { fontSize: 12, color: '#6b7280', marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  button: { borderRadius: 14, overflow: 'hidden', marginTop: 10 },
  buttonBg: { height: 52, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: { color: '#dc2626', fontSize: 14, textAlign: 'center' },
  linkWrap: { marginTop: 16, alignItems: 'center' },
  linkText: { color: '#16a34a', fontWeight: '600' },
});

export default ResetPasswordScreen;

