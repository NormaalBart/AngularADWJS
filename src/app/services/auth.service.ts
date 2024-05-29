import { Injectable, OnInit, inject } from '@angular/core'
import { BehaviorSubject, Observable, from } from 'rxjs'
import { Auth, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, user } from '@angular/fire/auth';
import { RegisterInterface } from '../models/register.interface';
import { LoginInterface } from '../models/login.interface';
import { catchError, switchMap } from 'rxjs/operators';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, setDoc, where } from '@angular/fire/firestore';
import { firebaseTables } from '../../environments/global';
import { User } from '../models/user.class';
import { InviteService } from './invite.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  firebaseAuth = inject(Auth);
  firestore = inject(Firestore);
  inviteService = inject(InviteService);

  private currentFirebaseUser$ = user(this.firebaseAuth);
  private currentUserSignal = new BehaviorSubject<User | null | undefined>(undefined);
  currentUser$ = this.currentUserSignal.asObservable();

  private usersCollection = collection(this.firestore, firebaseTables.users);

  constructor() {
    this.currentFirebaseUser$.subscribe(async (user) => {
      if (user === null) {
        this.currentUserSignal.next(null);
        return;
      }

      getDoc(doc(this.usersCollection, user.uid)).then(userDoc => {
        if (userDoc.exists()) {
          const userData: User = new User(user.uid, userDoc.data()['displayName'], userDoc.data()['email']);
          this.currentUserSignal.next(userData);
          this.inviteService.getInvitesForUser(userData.id).subscribe(invites => {
            userData.setInvites(invites);
          });
        } else {
          this.currentUserSignal.next(null);
        }
      });
    });
  }

  login(model: LoginInterface): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.firebaseAuth, model.email, model.password)).pipe(
      catchError((error) => {
        console.error('Login error', error);
        throw error;
      })
    );
  }

  register(model: RegisterInterface): Observable<void> {
    const createUserPromise = createUserWithEmailAndPassword(this.firebaseAuth, model.email, model.password)
      .then((userCredential: UserCredential) => {
        return userCredential;
      });

    return from(createUserPromise).pipe(
      switchMap((userCredential: UserCredential) => {
        const userDocData: User = new User(
          userCredential.user.uid,
          model.displayName,
          model.email,
        );
        return from(setDoc(doc(this.usersCollection, userCredential.user.uid), userDocData));
      }));
  }

  logout(): Observable<void> {
    return from(this.firebaseAuth.signOut());
  }

  isAuthenticated(): boolean {
    return this.firebaseAuth.currentUser !== null;
  }

  setUser(user: User | null) {
    this.currentUserSignal.next(user);
  }
}
