import React, { useContext, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import type { UserType } from '../types';

const SignupScreen: React.FC = () => {
  const { signup } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const userType = (route.params as { userType?: UserType })?.userType || 'hari';
  
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [cnic, setCnic] = useState('');
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

  const onSubmit = async () => {
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      await signup({ 
        firstName,
        middleName: middleName || undefined,
        lastName,
        fatherName,
        phoneNumber,
        email,
        password,
        dateOfBirth,
        cnic,
        userType 
      });
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} style={styles.flex}>
        <ScrollView style={styles.flex} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator>
          <Animated.View style={[styles.card, { opacity: fade, transform: [{ translateY: translate }] }]}> 
            <Text style={styles.title}>
              Create {userType === 'hari' ? 'Hari' : 'Landowner'} Account
            </Text>
            <Text style={styles.subtitle}>
              Join AgriZone as a {userType === 'hari' ? 'agricultural worker' : 'property owner'}.
            </Text>

            <View style={styles.field}><Text style={styles.label}>First Name</Text><TextInput placeholder="First Name" placeholderTextColor="#9ca3af" value={firstName} onChangeText={setFirstName} style={styles.input} /></View>
            <View style={styles.field}><Text style={styles.label}>Middle Name (optional)</Text><TextInput placeholder="Middle Name" placeholderTextColor="#9ca3af" value={middleName} onChangeText={setMiddleName} style={styles.input} /></View>
            <View style={styles.field}><Text style={styles.label}>Last Name</Text><TextInput placeholder="Last Name" placeholderTextColor="#9ca3af" value={lastName} onChangeText={setLastName} style={styles.input} /></View>
            <View style={styles.field}><Text style={styles.label}>Father Name</Text><TextInput placeholder="Father Name" placeholderTextColor="#9ca3af" value={fatherName} onChangeText={setFatherName} style={styles.input} /></View>
            <View style={styles.field}><Text style={styles.label}>Phone Number</Text><TextInput placeholder="03XXXXXXXXX" placeholderTextColor="#9ca3af" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} style={styles.input} /></View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="you@agrizone.com"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
              />
            </View>

            <View style={styles.field}><Text style={styles.label}>Date of Birth</Text><TextInput placeholder="YYYY-MM-DD" placeholderTextColor="#9ca3af" value={dateOfBirth} onChangeText={setDateOfBirth} style={styles.input} /></View>
            <View style={styles.field}><Text style={styles.label}>CNIC</Text><TextInput placeholder="XXXXX-XXXXXXX-X" placeholderTextColor="#9ca3af" value={cnic} onChangeText={setCnic} style={styles.input} /></View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity activeOpacity={0.9} onPress={onSubmit} style={styles.button} disabled={submitting}>
              <LinearGradient colors={['#16a34a', '#22c55e']} style={styles.buttonBg}>
                <Text style={styles.buttonText}>{submitting ? 'Please wait…' : 'Sign Up'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => (navigation as any).goBack()} style={styles.linkWrap}>
              <Text style={styles.linkText}>Back to Login</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 24, paddingBottom: 48 },
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
  subtitle: { marginTop: 6, color: '#6b7280', marginBottom: 24 },
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
    borderColor: '#fecaca'
  },
  errorText: { color: '#dc2626', fontSize: 14, textAlign: 'center' },
  linkWrap: { marginTop: 16, alignItems: 'center' },
  linkText: { color: '#16a34a', fontWeight: '600' },
});

export default SignupScreen;


