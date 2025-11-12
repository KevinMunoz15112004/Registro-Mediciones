import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Observable, from } from 'rxjs';
import { LocationData } from '../models/reading.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  getCurrentLocation(): Observable<LocationData> {
    return from(
      Geolocation.getCurrentPosition().then((coordinates) => ({
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude
      }))
    );
  }

  generateMapsLink(latitude: number, longitude: number): string {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }

  async requestPermissions(): Promise<void> {
    try {
      const permission = await Geolocation.requestPermissions();
      if (permission.location !== 'granted') {
        throw new Error('Geolocation permission denied');
      }
    } catch (error) {
      console.error('Error requesting geolocation permission:', error);
      throw error;
    }
  }
}
