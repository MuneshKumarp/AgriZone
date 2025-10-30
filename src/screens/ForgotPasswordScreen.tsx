import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../api/api';
import type { UserType } from '../types';

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userType = (route.params as { userType?: UserType })?.userType || 'hari';

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(12)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(translate, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [fade, translate]);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await api.post('/password/forgot', { email });
      setSuccess(true);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
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

  const handleResetPassword = () => {
    if (success && email) {
      navigation.navigate('ResetPassword', { email, userType });
    }
  };

  return (
    <LinearGradient colors={['#ecfdf5', '#ffffff']} style={styles.flex}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View style={styles.container}>
          <Animated.View style={[styles.card, { opacity: fade, transform: [{ translateY: translate }] }]}>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you an OTP to reset your password.
            </Text>

            {success ? (
              <>
                <View style={styles.successContainer}>
                  <Text style={styles.successText}>✓ OTP sent successfully!</Text>
                  <Text style={styles.successSubtext}>Check your email inbox for the 6-digit code.</Text>
                </View>

                <TouchableOpacity onPress={handleResetPassword} style={styles.button}>
                  <LinearGradient colors={['#16a34a', '#22c55e']} style={styles.buttonBg}>
                    <Text style={styles.buttonText}>Enter OTP</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSuccess(false)} style={styles.linkWrap}>
                  <Text style={styles.linkText}>Send another OTP</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.field}>
                  <Text style={styles.label}>Email address</Text>
                  <TextInput
                    placeholder="you@example.com"
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
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

                <TouchableOpacity onPress={handleSendOTP} disabled={submitting} style={styles.button}>
                  <LinearGradient colors={['#16a34a', '#22c55e']} style={styles.buttonBg}>
                    <Text style={styles.buttonText}>{submitting ? 'Sending...' : 'Send OTP'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkWrap}>
              <Text style={styles.linkText}>Back to Login</Text>
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
  successContainer: {
    backgroundColor: '#dcfce7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  successText: { color: '#16a34a', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  successSubtext: { color: '#15803d', fontSize: 14, textAlign: 'center', marginTop: 4 },
  linkWrap: { marginTop: 16, alignItems: 'center' },
  linkText: { color: '#16a34a', fontWeight: '600' },
});

export default ForgotPasswordScreen;

