import { Injectable, OnInit, Query, inject } from '@angular/core'
import { BehaviorSubject, Observable, from, of } from 'rxjs'
import { Auth, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, user } from '@angular/fire/auth';
import { RegisterInterface } from '../models/register.interface';
import { LoginInterface } from '../models/login.interface';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Firestore, addDoc, collection, collectionData, doc, getDoc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { firebaseTables } from '../../environments/global';
import { UserInterface } from '../models/user.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  private usersCollection = collection(this.firestore, firebaseTables.users);


  users$ = this.authService.currentUser$.pipe(
    switchMap(user => {
      if (!user) {
        return of([] as UserInterface[]);
      }

      const accessibleProjectsQuery = query(this.usersCollection);
      return collectionData(accessibleProjectsQuery, { idField: 'id' }) as Observable<UserInterface[]>;
    }));

}
