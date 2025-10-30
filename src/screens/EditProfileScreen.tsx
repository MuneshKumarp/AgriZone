import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import api from '../api/api';

const EditProfileScreen: React.FC = () => {
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    fatherName: '',
    phoneNumber: '',
    dateOfBirth: '',
    cnic: '',
    email: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get('/profile/me');
        if (!mounted) return;
        setForm({
          firstName: res.data.firstName || '',
          middleName: res.data.middleName || '',
          lastName: res.data.lastName || '',
          fatherName: res.data.fatherName || '',
          phoneNumber: res.data.phoneNumber || '',
          dateOfBirth: (res.data.dateOfBirth || '').slice(0, 10),
          cnic: res.data.cnic || '',
          email: res.data.email || '',
        });
      } catch (e: any) {
        Alert.alert('Error', e.response?.data?.message || 'Failed to load profile');
      }
    })();
    return () => { mounted = false; };
  }, []);

  const onChange = (key: keyof typeof form, value: string) => setForm((s) => ({ ...s, [key]: value }));

  const onSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const payload = { ...form } as any;
      delete payload.email;
      await api.put('/profile/me', payload);
      Alert.alert('Success', 'Profile updated');
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <LinearGradient colors={['#ecfdf5', '#ffffff']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Your Information</Text>

          <View style={styles.row}><Text style={styles.label}>First Name</Text><TextInput style={styles.input} value={form.firstName} onChangeText={(v) => onChange('firstName', v)} /></View>
          <View style={styles.row}><Text style={styles.label}>Middle Name</Text><TextInput style={styles.input} value={form.middleName} onChangeText={(v) => onChange('middleName', v)} /></View>
          <View style={styles.row}><Text style={styles.label}>Last Name</Text><TextInput style={styles.input} value={form.lastName} onChangeText={(v) => onChange('lastName', v)} /></View>
          <View style={styles.row}><Text style={styles.label}>Father Name</Text><TextInput style={styles.input} value={form.fatherName} onChangeText={(v) => onChange('fatherName', v)} /></View>
          <View style={styles.row}><Text style={styles.label}>Phone Number</Text><TextInput keyboardType="phone-pad" style={styles.input} value={form.phoneNumber} onChangeText={(v) => onChange('phoneNumber', v)} /></View>
          <View style={styles.row}><Text style={styles.label}>Date of Birth</Text><TextInput placeholder="YYYY-MM-DD" style={styles.input} value={form.dateOfBirth} onChangeText={(v) => onChange('dateOfBirth', v)} /></View>
          <View style={styles.row}><Text style={styles.label}>CNIC</Text><TextInput style={styles.input} value={form.cnic} onChangeText={(v) => onChange('cnic', v)} /></View>

          <TouchableOpacity disabled={saving} onPress={onSave} style={styles.button} activeOpacity={0.9}>
            <LinearGradient colors={['#16a34a', '#22c55e']} style={styles.buttonBg}>
              <Text style={styles.buttonText}>{saving ? 'Saving…' : 'Save'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24 },
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
  title: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 16 },
  row: { marginBottom: 12 },
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
  button: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  buttonBg: { height: 52, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
});

export default EditProfileScreen;



