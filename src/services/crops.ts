import api from '../api/api';

export type Crop = {
  id: string;
  name: string;
  type?: string;
  season?: string;
};

export async function listCrops(): Promise<Crop[]> {
  const res = await api.get('/crops');
  return res.data.map((c: any) => ({
    id: c._id || c.id,
    name: c.name,
    type: c.type || undefined,
    season: c.season || undefined,
  }));
}

export async function createCrop(input: Omit<Crop, 'id'>): Promise<Crop> {
  const res = await api.post('/crops', input);
  const c = res.data;
  return { id: c._id || c.id, name: c.name, type: c.type, season: c.season };
}

export async function updateCrop(id: string, input: Partial<Omit<Crop, 'id'>>): Promise<Crop> {
  const res = await api.put(`/crops/${id}`, input);
  const c = res.data;
  return { id: c._id || c.id, name: c.name, type: c.type, season: c.season };
}

export async function deleteCrop(id: string): Promise<void> {
  await api.delete(`/crops/${id}`);
}


