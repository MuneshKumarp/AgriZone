import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const baseHost = (api as any)?.defaults?.baseURL?.replace(/\/api$/, '') || '';
  const toAbsoluteUrl = (u: string) => {
    if (!u) return '';
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    return baseHost ? `${baseHost}${u}` : u;
  };
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    fatherName: '',
    phoneNumber: '',
    dateOfBirth: '',
    cnic: '',
    email: '',
    avatarUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

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
          avatarUrl: toAbsoluteUrl(res.data.avatarUrl || ''),
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
      delete payload.email; // email not editable here
      await api.put('/profile/me', payload);
      Alert.alert('Success', 'Profile updated');
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const uploadAsset = async (asset: any) => {
    if (!asset?.uri) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || 'avatar.jpg',
      } as any);
      const res = await api.post('/profile/me/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm((s) => ({ ...s, avatarUrl: toAbsoluteUrl(res.data.avatarUrl) }));
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const onPickImage = async () => {
    Alert.alert('Change avatar', 'Choose a source', [
      { text: 'Camera', onPress: async () => {
        const result = await launchCamera({ mediaType: 'photo', quality: 0.8, cameraType: 'front' });
        if (!result.didCancel && result.assets?.[0]) uploadAsset(result.assets[0]);
      } },
      { text: 'Gallery', onPress: async () => {
        const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 0.8 });
        if (!result.didCancel && result.assets?.[0]) uploadAsset(result.assets[0]);
      } },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <LinearGradient colors={['#ecfdf5', '#ffffff']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>My Profile</Text>

          <View style={styles.headerRow}>
            <View style={styles.avatarWrap}>
              {form.avatarUrl ? (
                <Image source={{ uri: form.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 18 }}>
                    {(form.firstName?.[0] || 'U').toUpperCase()}
                  </Text>
                </View>
              )}
              <TouchableOpacity style={styles.camBadge} onPress={onPickImage}>
                <Text style={{ color: '#fff', fontSize: 12 }}>{uploading ? '…' : '✎'}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>
                {form.firstName} {form.lastName}
              </Text>
              <Text style={{ color: '#6b7280', marginTop: 2 }}>{form.email}</Text>
              <TouchableOpacity onPress={() => (navigation as any).navigate('EditProfile')} disabled={false} style={[styles.smallBtn, { marginTop: 10 }]}>
                <LinearGradient colors={['#16a34a', '#22c55e']} style={styles.smallBtnBg}>
                  <Text style={styles.smallBtnText}>Edit Profile</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Themed menu groups like the reference */}
          <View style={styles.menuSection}>
            <View style={styles.itemRow}><Text style={styles.itemText}>Favourites</Text><Text style={styles.chev}>›</Text></View>
            <View style={styles.itemRow}><Text style={styles.itemText}>Downloads</Text><Text style={styles.chev}>›</Text></View>
          </View>

          <View style={styles.divider} />

          <View style={styles.menuSection}>
            <View style={styles.itemRow}><Text style={styles.itemText}>Language</Text><Text style={styles.chev}>›</Text></View>
            <View style={styles.itemRow}><Text style={styles.itemText}>Location</Text><Text style={styles.chev}>›</Text></View>
            <View style={styles.itemRow}><Text style={styles.itemText}>Display</Text><Text style={styles.chev}>›</Text></View>
            <View style={styles.itemRow}><Text style={styles.itemText}>Feed preference</Text><Text style={styles.chev}>›</Text></View>
            <View style={styles.itemRow}><Text style={styles.itemText}>Subscription</Text><Text style={styles.chev}>›</Text></View>
          </View>

          <View style={styles.divider} />

          <View style={styles.menuSection}>
            <View style={styles.itemRow}><Text style={styles.itemText}>Clear Cache</Text><Text style={styles.chev}>›</Text></View>
            <View style={styles.itemRow}><Text style={styles.itemText}>Clear history</Text><Text style={styles.chev}>›</Text></View>
            <TouchableOpacity style={styles.itemRow} onPress={logout}>
              <Text style={[styles.itemText, { color: '#ef4444' }]}>Log Out</Text>
              <Text style={styles.chev}>›</Text>
            </TouchableOpacity>
          </View>

          {/* CRUD fields moved to EditProfile screen */}
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
  title: { fontSize: 16, fontWeight: '700', color: '#111827', alignSelf: 'center', marginBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatarWrap: { marginRight: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  avatarPlaceholder: { backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center' },
  camBadge: { position: 'absolute', bottom: -2, right: -2, backgroundColor: '#16a34a', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 16 },
  itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  itemText: { color: '#111827' },
  chev: { color: '#9ca3af', fontSize: 18 },
  smallBtn: { borderRadius: 10, overflow: 'hidden', alignSelf: 'flex-start' },
  smallBtnBg: { paddingHorizontal: 12, height: 36, alignItems: 'center', justifyContent: 'center' },
  smallBtnText: { color: '#fff', fontWeight: '700' },
  menuSection: { },
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
  disabled: { opacity: 0.7 },
  button: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  buttonBg: { height: 52, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
});

export default ProfileScreen;


