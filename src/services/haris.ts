import api from '../api/api';

export type Hari = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export async function listHaris(): Promise<Hari[]> {
  const res = await api.get('/haris');
  return res.data.map((u: any) => ({
    id: u._id || u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    phoneNumber: u.phoneNumber,
  }));
}


