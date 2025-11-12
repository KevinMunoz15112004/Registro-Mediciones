import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc, QueryConstraint, collectionData } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Reading } from '../models/reading.model';

@Injectable({
  providedIn: 'root'
})
export class ReadingService {

  constructor(
    private firestore: Firestore
  ) { }

  async uploadPhoto(photoBase64: string, readingId: string, photoType: 'meter' | 'facade'): Promise<string> {
    try {
      return photoBase64;
    } catch (error) {
      console.error('Error processing photo:', error);
      throw error;
    }
  }

  async saveReading(reading: Reading): Promise<string> {
    try {
      const readingsRef = collection(this.firestore, 'readings');
      const docRef = await addDoc(readingsRef, {
        ...reading,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving reading:', error);
      throw error;
    }
  }

  async updateReading(readingId: string, data: Partial<Reading>): Promise<void> {
    try {
      const readingRef = doc(this.firestore, 'readings', readingId);
      await updateDoc(readingRef, {
        ...data,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating reading:', error);
      throw error;
    }
  }

  getMyReadings(userId: string): Observable<Reading[]> {
    const readingsRef = collection(this.firestore, 'readings');
    const q = query(readingsRef, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Reading[]>;
  }

  getAllReadings(): Observable<Reading[]> {
    const readingsRef = collection(this.firestore, 'readings');
    return collectionData(readingsRef, { idField: 'id' }) as Observable<Reading[]>;
  }

  async getReadingById(readingId: string): Promise<Reading | null> {
    try {
      const readingRef = doc(this.firestore, 'readings', readingId);
      const docSnap = await getDoc(readingRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Reading;
      }
      return null;
    } catch (error) {
      console.error('Error getting reading:', error);
      return null;
    }
  }

  async deleteReading(readingId: string): Promise<void> {
    try {
      const readingRef = doc(this.firestore, 'readings', readingId);
      await deleteDoc(readingRef);
    } catch (error) {
      console.error('Error deleting reading:', error);
      throw error;
    }
  }
}
