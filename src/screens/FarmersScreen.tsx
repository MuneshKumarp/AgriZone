import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Animated, Easing, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { listAssignments, createAssignment, deleteAssignment, type Assignment } from '../services/assignments';
import { listHaris, type Hari } from '../services/haris';
import { listZones, type Zone } from '../services/zones';
import { listCrops, type Crop } from '../services/crops';

const FarmersScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const isLandowner = user?.userType === 'landowner';

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [haris, setHaris] = useState<Hari[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [hariId, setHariId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [cropId, setCropId] = useState('');

  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(16)).current;

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [a] = await Promise.all([
        listAssignments(),
      ]);
      setAssignments(a);
    } catch (e: any) {
      setError(e.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 450, easing: Easing.out(Easing.quad), useNativeDriver: true })
    ]).start();
  }, [fade, rise]);

  const openAssign = async () => {
    setError(null);
    setHariId(''); setZoneId(''); setCropId('');
    try {
      const [h, z, c] = await Promise.all([
        listHaris(),
        listZones(),
        listCrops(),
      ]);
      setHaris(h);
      setZones(z);
      setCrops(c);
      setModalVisible(true);
    } catch (e: any) {
      setError(e.message || 'Failed to load data for assignment');
    }
  };

  const onAssign = async () => {
    if (!hariId || !zoneId || !cropId) {
      setError('Please select Hari, Zone, and Crop');
      return;
    }
    setError(null);
    try {
      const created = await createAssignment({ hariId, zoneId, cropId, status: 'active' });
      setAssignments([created, ...assignments]);
      setModalVisible(false);
    } catch (e: any) {
      setError(e.message || 'Failed to create assignment');
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteAssignment(id);
      setAssignments(assignments.filter(a => a.id !== id));
    } catch (e: any) {
      setError(e.message || 'Failed to remove assignment');
    }
  };

  const renderItem = ({ item }: { item: Assignment }) => (
    <View style={[styles.card, { shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 3 }]}>
      <LinearGradient colors={['#dbeafe', '#e0e7ff']} style={styles.cardAccent}>
        <Text style={styles.cardAccentIcon}>👨🏽‍🌾</Text>
      </LinearGradient>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.hari ? `${item.hari.firstName} ${item.hari.lastName}` : 'Hari'}</Text>
        <View style={{ flexDirection: 'row', marginTop: 6, flexWrap: 'wrap' }}>
          {item.zone?.name ? <Text style={styles.chip}>Zone: {item.zone.name}</Text> : null}
          {item.crop?.name ? <Text style={[styles.chip, { marginLeft: 8 }]}>Crop: {item.crop.name}</Text> : null}
          <Text style={[styles.badge, { marginLeft: 8 }]}>{item.status}</Text>
        </View>
      </View>
      {isLandowner && (
        <TouchableOpacity onPress={() => onDelete(item.id)} style={[styles.actionBtn, { backgroundColor: '#fee2e2' }]}>
          <Text style={{ color: '#b91c1c', fontWeight: '700' }}>Remove</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <LinearGradient colors={['#eef2ff', '#ffffff']} style={styles.flex}>
      <Animated.View style={[styles.container, { opacity: fade, transform: [{ translateY: rise }] }]}>
        <View style={styles.headerBlock}>
          <Text style={styles.screenEyebrow}>Landowner</Text>
          <Text style={styles.title}>My Farmers (Haris)</Text>
          <Text style={styles.subtitle}>Assignments by Zone and Crop</Text>
        </View>

        {error && (
          <View style={styles.errBox}><Text style={styles.errText}>{error}</Text></View>
        )}

        {loading ? (
          <View style={styles.centerBox}><Text style={styles.muted}>Loading…</Text></View>
        ) : assignments.length === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyBadge}><Text style={styles.emptyIcon}>👨🏽‍🌾</Text></View>
            <Text style={styles.emptyTitle}>No assignments yet</Text>
            <Text style={styles.muted}>Assign a Hari to a Zone and Crop</Text>
          </View>
        ) : (
          <FlatList
            data={assignments}
            keyExtractor={(i) => i.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            contentContainerStyle={{ paddingVertical: 12 }}
            showsVerticalScrollIndicator={false}
          />
        )}

        {isLandowner && (
          <TouchableOpacity onPress={openAssign} activeOpacity={0.9} style={styles.fabWrap}>
            <LinearGradient colors={['#4f46e5', '#6366f1']} style={styles.fab}>
              <Text style={styles.fabText}>＋</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <Modal visible={modalVisible} animationType="fade" transparent>
          <View style={styles.sheetBackdrop}>
            <Animated.View style={[styles.sheetCard, { transform: [{ translateY: rise }] }] }>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Assign Hari</Text>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Hari</Text>
                <TextInput placeholder="Type Hari ID or pick from UI" value={hariId} onChangeText={setHariId} style={styles.input} placeholderTextColor="#9ca3af" />
                {/* For now, simple input. Later replace with picker using `haris`. */}
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Zone</Text>
                <TextInput placeholder="Type Zone ID" value={zoneId} onChangeText={setZoneId} style={styles.input} placeholderTextColor="#9ca3af" />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Crop</Text>
                <TextInput placeholder="Type Crop ID" value={cropId} onChangeText={setCropId} style={styles.input} placeholderTextColor="#9ca3af" />
              </View>
              {error && <Text style={styles.err}>{error}</Text>}
              <View style={styles.sheetActions}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.sheetBtn, styles.sheetCancel]}>
                  <Text style={styles.sheetCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onAssign} style={[styles.sheetBtn, styles.sheetSave]}>
                  <Text style={styles.sheetSaveText}>Assign</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: 16, paddingBottom: 24 },
  headerBlock: { marginBottom: 10 },
  screenEyebrow: { color: '#4f46e5', fontWeight: '700', marginBottom: 4 },
  title: { fontWeight: '800', fontSize: 26, color: '#111827' },
  subtitle: { color: '#6b7280', marginTop: 6 },
  errBox: { backgroundColor: '#fee2e2', borderColor: '#fecaca', borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10 },
  errText: { color: '#b91c1c' },
  emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 24 },
  emptyBadge: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  emptyIcon: { fontSize: 28 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
  muted: { color: '#6b7280' },
  card: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 16, padding: 12, backgroundColor: '#fff' },
  cardAccent: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardAccentIcon: { fontSize: 20 },
  cardTitle: { fontWeight: '800', fontSize: 16, color: '#111827' },
  chip: { backgroundColor: '#f3f4f6', color: '#111827', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, overflow: 'hidden', fontSize: 12 },
  badge: { backgroundColor: '#ecfeff', color: '#0891b2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, overflow: 'hidden', fontSize: 12 },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginLeft: 8 },
  fabWrap: { position: 'absolute', right: 16, bottom: Platform.OS === 'ios' ? 32 : 24 },
  fab: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 5 },
  fabText: { color: '#fff', fontSize: 28, marginTop: -2 },
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' },
  sheetCard: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, paddingBottom: 24 },
  sheetHeader: { alignItems: 'center', marginBottom: 6 },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  inputRow: { marginTop: 10 },
  inputLabel: { fontSize: 12, color: '#6b7280', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#fff' },
  err: { color: '#dc2626', marginTop: 8 },
  sheetActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 14 },
  sheetBtn: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  sheetCancel: { backgroundColor: '#f3f4f6', marginRight: 8 },
  sheetCancelText: { color: '#111827', fontWeight: '700' },
  sheetSave: { backgroundColor: '#4f46e5' },
  sheetSaveText: { color: '#fff', fontWeight: '700' },
});

export default FarmersScreen;



