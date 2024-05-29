import { Injectable, OnInit, inject } from '@angular/core'
import { BehaviorSubject, Observable, from } from 'rxjs'
import { Auth, User, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, user } from '@angular/fire/auth';
import { RegisterInterface } from '../models/register.interface';
import { LoginInterface } from '../models/login.interface';
import { catchError } from 'rxjs/operators';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { firebaseTables } from '../../environments/global';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  firebaseAuth = inject(Auth);
  firestore = inject(Firestore);

  private currentFirebaseUser$ = user(this.firebaseAuth);
  private currentUserSignal = new BehaviorSubject<User | null | undefined>(undefined);
  currentUser$ = this.currentUserSignal.asObservable();

  private usersCollection = collection(this.firestore, firebaseTables.users);

  constructor() {
    this.currentFirebaseUser$.subscribe(user => {
      this.currentUserSignal.next(user);
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

  register(model: RegisterInterface): Observable<string> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, model.email, model.password)
      .then((userCredential) => {
        return addDoc(this.usersCollection, { id: userCredential.user.uid, displayName: model.displayName, email: model.email, invites: [] }).then(() => userCredential.user.uid);
      })
    return from(promise);
  }

  logout(): Observable<void> {
    return from(this.firebaseAuth.signOut());
  }

  isAuthenticated(): boolean {
    return this.firebaseAuth.currentUser !== null;
  };

  getUser(): User | null {
    return this.firebaseAuth.currentUser;
  }

  setUser(user: User | null) {
    this.currentUserSignal.next(user);
  }
}
