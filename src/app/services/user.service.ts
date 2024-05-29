import { Injectable, OnInit, Query, inject } from '@angular/core'
import { BehaviorSubject, Observable, from, of } from 'rxjs'
import { Auth, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, user } from '@angular/fire/auth';
import { RegisterInterface } from '../models/register.interface';
import { LoginInterface } from '../models/login.interface';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Firestore, addDoc, collection, collectionData, doc, getDoc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { firebaseTables } from '../../environments/global';
import { AuthService } from './auth.service';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  private usersCollection = collection(this.firestore, firebaseTables.users);

  getUsersByIds(ids: string[]): Observable<User[]> {
    if (this.authService.isAuthenticated() === false) {
      return of([]);
    }
    return collectionData(this.usersCollection, { idField: 'id' }).pipe(
      map((users: any[]) =>
        users
          .filter(user => ids.includes(user.id))
          .map(user => ({
            id: user.id,
            email: user.email,
            displayName: user.displayName
          }) as User)
      )
    );
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const emailQuery = query(this.usersCollection, where('email', '==', email));
    const userSnapshot = await getDocs(emailQuery);
    if (!userSnapshot.empty) {
      const user = userSnapshot.docs[0].data() as User;
      return { id: user.id, email: user.email, displayName: user.displayName } as User;
    } else {
      return null;
    }
  }
}
