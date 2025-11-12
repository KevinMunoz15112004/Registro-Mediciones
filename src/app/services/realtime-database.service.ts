import { Injectable } from '@angular/core';
import { Database, ref, set, get, update, remove } from '@angular/fire/database';
import { Observable, from } from 'rxjs';

/**
 * Servicio para integración con Realtime Database de Firebase
 * Se proporciona para futuras extensiones de la aplicación
 */
@Injectable({
  providedIn: 'root'
})
export class RealtimeDatabaseService {

  constructor(private db: Database) { }

  // Guardar datos
  async setData(path: string, data: any): Promise<void> {
    const dbRef = ref(this.db, path);
    return set(dbRef, data);
  }

  // Obtener datos
  async getData(path: string): Promise<any> {
    const dbRef = ref(this.db, path);
    const snapshot = await get(dbRef);
    return snapshot.val();
  }

  // Actualizar datos
  async updateData(path: string, data: any): Promise<void> {
    const dbRef = ref(this.db, path);
    return update(dbRef, data);
  }

  // Eliminar datos
  async deleteData(path: string): Promise<void> {
    const dbRef = ref(this.db, path);
    return remove(dbRef);
  }
}
