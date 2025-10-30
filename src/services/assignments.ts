import api from '../api/api';

export type Assignment = {
  id: string;
  hariId: string;
  zoneId: string;
  cropId: string;
  status: 'active' | 'completed' | 'pending';
  assignedDate?: string;
  // populated (optional)
  hari?: { firstName: string; lastName: string; email: string; phoneNumber: string };
  zone?: { name: string };
  crop?: { name: string; type?: string; season?: string };
};

const map = (doc: any): Assignment => ({
  id: doc._id || doc.id,
  hariId: doc.hariId?._id || doc.hariId,
  zoneId: doc.zoneId?._id || doc.zoneId,
  cropId: doc.cropId?._id || doc.cropId,
  status: doc.status,
  assignedDate: doc.assignedDate,
  hari: doc.hariId && doc.hariId.firstName ? {
    firstName: doc.hariId.firstName,
    lastName: doc.hariId.lastName,
    email: doc.hariId.email,
    phoneNumber: doc.hariId.phoneNumber,
  } : undefined,
  zone: doc.zoneId && doc.zoneId.name ? { name: doc.zoneId.name } : undefined,
  crop: doc.cropId && doc.cropId.name ? { name: doc.cropId.name, type: doc.cropId.type, season: doc.cropId.season } : undefined,
});

export async function listAssignments(): Promise<Assignment[]> {
  const res = await api.get('/assignments');
  return res.data.map(map);
}

export async function createAssignment(input: { hariId: string; zoneId: string; cropId: string; status?: Assignment['status'] }): Promise<Assignment> {
  const res = await api.post('/assignments', input);
  return map(res.data);
}

export async function updateAssignment(id: string, input: Partial<Pick<Assignment, 'zoneId' | 'cropId' | 'status'>>): Promise<Assignment> {
  const res = await api.put(`/assignments/${id}`, input);
  return map(res.data);
}

export async function deleteAssignment(id: string): Promise<void> {
  await api.delete(`/assignments/${id}`);
}


