export type UserType = 'hari' | 'landowner';

export type AuthUser = {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fatherName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string; // ISO string
  cnic: string;
  userType: UserType;
};

export type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
};

export type LoginPayload = {
  email: string;
  password: string;
  userType: UserType;
};

export type SignupPayload = {
  firstName: string;
  middleName?: string;
  lastName: string;
  fatherName: string;
  phoneNumber: string;
  email: string;
  password: string;
  dateOfBirth: string; // ISO string
  cnic: string;
  userType: UserType;
};


