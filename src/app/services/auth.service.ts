import { Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from '@angular/fire/auth';
import { Firestore, collection, doc, setDoc, getDoc, DocumentSnapshot } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { User } from '../models/reading.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$ = authState(this.auth);

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {}

  register(email: string, password: string, displayName: string, role: 'admin' | 'meter-reader'): Observable<User> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(async (credential) => {
        await updateProfile(credential.user, { displayName });
        const userRef = doc(this.firestore, `users/${credential.user.uid}`);
        const userData: User = {
          uid: credential.user.uid,
          email: credential.user.email!,
          displayName,
          role,
          createdAt: new Date(),
          photoUrl: credential.user.photoURL || ''
        };

        await setDoc(userRef, userData);
        return userData;
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  async getUserRole(uid: string): Promise<'admin' | 'meter-reader' | null> {
    try {
      const userRef = doc(this.firestore, `users/${uid}`);
      const docSnap: DocumentSnapshot<any> = await getDoc(userRef);

      if (docSnap.exists()) {
        return docSnap.data().role as 'admin' | 'meter-reader';
      }
      return null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }

  async getUserData(uid: string): Promise<User | null> {
    try {
      const userRef = doc(this.firestore, `users/${uid}`);
      const docSnap: DocumentSnapshot<any> = await getDoc(userRef);

      if (docSnap.exists()) {
        return docSnap.data() as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}
