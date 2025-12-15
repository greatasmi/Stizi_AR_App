export interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  email?: string;
  stamps: Stamp[];
}

export interface Stamp {
  _id: string;
  name: string;
  description: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  qrCode: string;
  imageUrl?: string;
  createdBy: string;
  collectedBy: string[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface StampState {
  stamps: Stamp[];
  myStamps: Stamp[];
  loading: boolean;
  error: string | null;
}
