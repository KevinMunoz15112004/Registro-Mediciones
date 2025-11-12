export interface Reading {
  id?: string;
  userId: string;
  meterValue: number;
  observations: string;
  meterPhotoUrl: string;
  facadePhotoUrl: string;
  latitude: number;
  longitude: number;
  mapsLink: string;
  createdAt: Date;
  updatedAt?: Date;
  userName?: string;
  userEmail?: string;
  zone?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'meter-reader';
  createdAt: Date;
  photoUrl?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
}
