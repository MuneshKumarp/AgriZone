import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Animated, Easing, Platform } from 'react-native';
import { listZones, createZone, updateZone, deleteZone, type Zone } from '../services/zones';
import { AuthContext } from '../context/AuthContext';
import LinearGradient from 'react-native-linear-gradient';

const ZonesScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const isLandowner = user?.userType === 'landowner';

  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Zone | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [totalArea, setTotalArea] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Simple entrance animation
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(16)).current;

  const load = async () => {
    setLoading(true);
    try {
      const data = await listZones();
      setZones(data);
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

  const openCreate = () => {
    setEditing(null);
    setName('');
    setLocation('');
    setTotalArea('');
    setDescription('');
    setError(null);
    setModalVisible(true);
  };

  const openEdit = (z: Zone) => {
    setEditing(z);
    setName(z.name);
    setLocation(z.location || '');
    setTotalArea(z.totalArea?.toString() || '');
    setDescription(z.description || '');
    setError(null);
    setModalVisible(true);
  };

  const onSave = async () => {
    if (!name.trim()) {
      setError('Zone name is required');
      return;
    }
    setError(null);
    try {
      if (editing) {
        const updated = await updateZone(editing.id, {
          name: name.trim(),
          location: location.trim() || undefined,
          totalArea: totalArea ? Number(totalArea) : undefined,
          description: description.trim() || undefined,
        });
        setZones(zones.map(z => (z.id === updated.id ? updated : z)));
      } else {
        const created = await createZone({
          name: name.trim(),
          location: location.trim() || undefined,
          totalArea: totalArea ? Number(totalArea) : undefined,
          description: description.trim() || undefined,
        });
        setZones([created, ...zones]);
      }
      setModalVisible(false);
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteZone(id);
      setZones(zones.filter(z => z.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete zone');
    }
  };

  return (
    <LinearGradient colors={['#f0fdf4', '#ffffff']} style={styles.flex}>
      <Animated.View style={[styles.container, { opacity: fade, transform: [{ translateY: rise }] }]}>
        <View style={styles.headerBlock}>
          <View>
            <Text style={styles.screenEyebrow}>Landowner</Text>
            <Text style={styles.title}>Your Zones</Text>
            <Text style={styles.subtitle}>Organize and manage your farming areas</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.centerBox}><Text style={styles.muted}>Loading…</Text></View>
        ) : zones.length === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyBadge}><Text style={styles.emptyIcon}>🗺️</Text></View>
            <Text style={styles.emptyTitle}>No zones yet</Text>
            <Text style={styles.muted}>Create your first zone to get started</Text>
          </View>
        ) : (
          <FlatList
            data={zones}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={[styles.card, { shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 3 }]}>
                <LinearGradient colors={['#bbf7d0', '#dcfce7']} style={styles.cardAccent}>
                  <Text style={styles.cardAccentIcon}>{index % 2 ? '🌿' : '🌾'}</Text>
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <View style={{ flexDirection: 'row', marginTop: 6 }}>
                    {!!item.location && <Text style={styles.chip}>{item.location}</Text>}
                    {!!item.totalArea && <Text style={[styles.chip, { marginLeft: 8 }]}>Area {item.totalArea}</Text>}
                  </View>
                </View>
                {isLandowner && (
                  <View style={styles.actions}>
                    <TouchableOpacity onPress={() => openEdit(item)} style={[styles.actionBtn, styles.actionEdit]}><Text style={styles.actionEditText}>Edit</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => onDelete(item.id)} style={[styles.actionBtn, styles.actionDelete]}><Text style={styles.actionDeleteText}>Delete</Text></TouchableOpacity>
                  </View>
                )}
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            contentContainerStyle={{ paddingVertical: 12 }}
            showsVerticalScrollIndicator={false}
          />
        )}

        {isLandowner && (
          <TouchableOpacity onPress={openCreate} activeOpacity={0.9} style={styles.fabWrap}>
            <LinearGradient colors={['#16a34a', '#22c55e']} style={styles.fab}>
              <Text style={styles.fabText}>＋</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <Modal visible={modalVisible} animationType="fade" transparent>
          <View style={styles.sheetBackdrop}>
            <Animated.View style={[styles.sheetCard, { transform: [{ translateY: rise }] }] }>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>{editing ? 'Edit Zone' : 'Add Zone'}</Text>
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput placeholder="e.g., North Field" value={name} onChangeText={setName} style={styles.input} placeholderTextColor="#9ca3af" />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput placeholder="Optional" value={location} onChangeText={setLocation} style={styles.input} placeholderTextColor="#9ca3af" />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Total Area</Text>
                <TextInput placeholder="Optional (e.g., 12.5)" value={totalArea} onChangeText={setTotalArea} keyboardType="decimal-pad" style={styles.input} placeholderTextColor="#9ca3af" />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput placeholder="Optional" value={description} onChangeText={setDescription} style={[styles.input, { height: 80 }]} multiline placeholderTextColor="#9ca3af" />
              </View>
              {error && <Text style={styles.err}>{error}</Text>}
              <View style={styles.sheetActions}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.sheetBtn, styles.sheetCancel]}>
                  <Text style={styles.sheetCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onSave} style={[styles.sheetBtn, styles.sheetSave]}>
                  <Text style={styles.sheetSaveText}>Save</Text>
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
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  screenEyebrow: { color: '#16a34a', fontWeight: '700', marginBottom: 4 },
  title: { fontWeight: '800', fontSize: 26, color: '#111827' },
  subtitle: { color: '#6b7280', marginTop: 6 },
  headerBlock: { marginBottom: 10 },
  centerBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 24 },
  muted: { color: '#6b7280' },
  emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 24 },
  emptyBadge: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#ecfdf5', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  emptyIcon: { fontSize: 28 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
  card: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 16, padding: 12, backgroundColor: '#fff' },
  cardAccent: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardAccentIcon: { fontSize: 20 },
  cardTitle: { fontWeight: '800', fontSize: 16, color: '#111827' },
  cardSub: { color: '#6b7280', marginTop: 4 },
  chip: { backgroundColor: '#f3f4f6', color: '#111827', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, overflow: 'hidden', fontSize: 12 },
  actions: { flexDirection: 'row' },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginLeft: 8 },
  actionEdit: { backgroundColor: '#ecfeff' },
  actionEditText: { color: '#0891b2', fontWeight: '700' },
  actionDelete: { backgroundColor: '#fee2e2' },
  actionDeleteText: { color: '#b91c1c', fontWeight: '700' },
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
  sheetSave: { backgroundColor: '#16a34a' },
  sheetSaveText: { color: '#fff', fontWeight: '700' },
});

export default ZonesScreen;



