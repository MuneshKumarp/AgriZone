import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { listCrops, createCrop, updateCrop, deleteCrop, type Crop } from '../services/crops';

const CropsScreen: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Crop | null>(null);
  const [name, setName] = useState('');
  const [typeField, setTypeField] = useState('');
  const [season, setSeason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCrops();
      setCrops(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load crops');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await listCrops();
      setCrops(data);
    } catch (e: any) {
      setError(e.message || 'Failed to refresh crops');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setName('');
    setTypeField('');
    setSeason('');
    setModalVisible(true);
  };

  const openEdit = (c: Crop) => {
    setEditing(c);
    setName(c.name);
    setTypeField(c.type || '');
    setSeason(c.season || '');
    setModalVisible(true);
  };

  const onSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Name is required');
      return;
    }
    setSubmitting(true);
    try {
      if (editing) {
        const updated = await updateCrop(editing.id, { name: name.trim(), type: typeField.trim() || undefined, season: season.trim() || undefined });
        setCrops((s) => s.map(x => x.id === updated.id ? updated : x));
      } else {
        const created = await createCrop({ name: name.trim(), type: typeField.trim() || undefined, season: season.trim() || undefined } as any);
        setCrops((s) => [created, ...s]);
      }
      setModalVisible(false);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save crop');
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = (c: Crop) => {
    Alert.alert('Delete crop', `Delete "${c.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await deleteCrop(c.id);
          setCrops((s) => s.filter(x => x.id !== c.id));
        } catch (e: any) {
          Alert.alert('Error', e.message || 'Failed to delete crop');
        }
      } }
    ]);
  };

  const renderItem = ({ item }: { item: Crop }) => (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{(item.name || '?')[0].toUpperCase()}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle}>{item.name}</Text>
          <Text style={styles.rowSub}>{item.type || '—'} · {item.season || '—'}</Text>
        </View>
      </View>
      <View style={styles.rowActions}>
        <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionSmall}><Text style={styles.actionSmallText}>Edit</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item)} style={[styles.actionSmall, { marginLeft: 8, borderColor: '#fee2e2' }]}><Text style={[styles.actionSmallText, { color: '#b91c1c' }]}>Delete</Text></TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={["#f8fafc", "#ffffff"]} style={styles.flex}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Crops</Text>
            <Text style={styles.subtitle}>Manage crop types for your farm</Text>
          </View>
          <TouchableOpacity onPress={openCreate} style={styles.addBtn} accessibilityLabel="Add crop"><Text style={styles.addBtnText}>＋ Add</Text></TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.center}><ActivityIndicator size="large" color="#4f46e5" /></View>
        ) : error ? (
          <View style={styles.center}><Text style={{ color: '#b91c1c' }}>{error}</Text></View>
        ) : crops.length === 0 ? (
          <View style={styles.centerEmpty}>
            <Text style={styles.emptyTitle}>No crops yet</Text>
            <Text style={styles.muted}>Create your first crop to start assigning it to zones and haris.</Text>
            <TouchableOpacity onPress={openCreate} style={styles.createPrimary}><Text style={{ color: '#fff', fontWeight: '700' }}>Create crop</Text></TouchableOpacity>
          </View>
        ) : (
          <FlatList data={crops} keyExtractor={(i) => i.id} renderItem={renderItem} ItemSeparatorComponent={() => <View style={{ height: 12 }} />} contentContainerStyle={{ paddingVertical: 12 }} refreshing={refreshing} onRefresh={onRefresh} />
        )}

        <Modal visible={modalVisible} animationType="slide" transparent>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <View style={styles.sheetBackdrop}>
              <View style={styles.sheetCard}>
                <Text style={styles.sheetTitle}>{editing ? 'Edit Crop' : 'New Crop'}</Text>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput value={name} onChangeText={setName} placeholder="Name" style={styles.input} />
                <Text style={styles.inputLabel}>Type</Text>
                <TextInput value={typeField} onChangeText={setTypeField} placeholder="Type (optional)" style={styles.input} />
                <Text style={styles.inputLabel}>Season</Text>
                <TextInput value={season} onChangeText={setSeason} placeholder="Season (optional)" style={styles.input} />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.sheetBtn, styles.sheetCancel]}><Text style={styles.sheetCancelText}>Cancel</Text></TouchableOpacity>
                  <TouchableOpacity onPress={onSave} style={[styles.sheetBtn, styles.sheetSave, { marginLeft: 8 }]} disabled={submitting}><Text style={styles.sheetSaveText}>{submitting ? 'Saving...' : 'Save'}</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827' },
  addBtn: { backgroundColor: '#4f46e5', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  addBtnText: { color: '#fff', fontWeight: '700' },
  center: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  muted: { color: '#6b7280' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#eef2ff' },
  rowTitle: { fontWeight: '700', fontSize: 16, color: '#111827' },
  rowSub: { color: '#6b7280', marginTop: 2 },
  rowBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#f3f4f6', borderRadius: 8 },
  rowBtnText: { color: '#111827', fontWeight: '700' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#4f46e5', fontWeight: '800' },
  rowActions: { flexDirection: 'row', alignItems: 'center' },
  actionSmall: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#e6eefc', backgroundColor: '#f8fafc' },
  actionSmallText: { color: '#111827', fontWeight: '700' },
  subtitle: { color: '#6b7280', fontSize: 12 },
  centerEmpty: { alignItems: 'center', justifyContent: 'center', flex: 1, paddingTop: 30 },
  emptyTitle: { fontSize: 18, fontWeight: '800', marginBottom: 6 },
  createPrimary: { marginTop: 12, backgroundColor: '#16a34a', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  inputLabel: { fontSize: 12, color: '#374151', marginBottom: 6, fontWeight: '700' },
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' },
  sheetCard: { backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  sheetTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', marginBottom: 8 },
  sheetBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  sheetCancel: { backgroundColor: '#f3f4f6' },
  sheetCancelText: { color: '#111827', fontWeight: '700' },
  sheetSave: { backgroundColor: '#4f46e5', marginLeft: 8 },
  sheetSaveText: { color: '#fff', fontWeight: '700' },
});

export default CropsScreen;



