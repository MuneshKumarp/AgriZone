import api from '../api/api';

export type Zone = {
  id: string;
  name: string;
  location?: string;
  totalArea?: number;
  description?: string;
  createdAt: string;
};

// Helper to map MongoDB document to frontend Zone type
function mapZoneFromBackend(doc: any): Zone {
  return {
    id: doc._id || doc.id,
    name: doc.name,
    location: doc.location || undefined,
    totalArea: doc.totalArea || undefined,
    description: doc.description || undefined,
    createdAt: doc.createdAt || new Date().toISOString(),
  };
}

export async function listZones(): Promise<Zone[]> {
  try {
    const response = await api.get('/zones');
    return response.data.map(mapZoneFromBackend);
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch zones';
    throw new Error(message);
  }
}

export async function createZone(input: Omit<Zone, 'id' | 'createdAt'>): Promise<Zone> {
  try {
    const payload: any = {
      name: input.name,
    };
    if (input.location) payload.location = input.location;
    if (input.totalArea !== undefined) payload.totalArea = input.totalArea;
    if (input.description) payload.description = input.description;

    const response = await api.post('/zones', payload);
    return mapZoneFromBackend(response.data);
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to create zone';
    throw new Error(message);
  }
}

export async function updateZone(id: string, input: Partial<Omit<Zone, 'id' | 'createdAt'>>): Promise<Zone> {
  try {
    const payload: any = {};
    if (input.name !== undefined) payload.name = input.name;
    if (input.location !== undefined) payload.location = input.location;
    if (input.totalArea !== undefined) payload.totalArea = input.totalArea;
    if (input.description !== undefined) payload.description = input.description;

    const response = await api.put(`/zones/${id}`, payload);
    return mapZoneFromBackend(response.data);
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to update zone';
    throw new Error(message);
  }
}

export async function deleteZone(id: string): Promise<void> {
  try {
    await api.delete(`/zones/${id}`);
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to delete zone';
    throw new Error(message);
  }
}
