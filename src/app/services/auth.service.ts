import { Injectable, inject } from '@angular/core'
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

  currentFirebaseUser$ = user(this.firebaseAuth);
  private currentUserSignal = new BehaviorSubject<User | null | undefined>(undefined);
  currentUser$ = this.currentUserSignal.asObservable();

  login(model: LoginInterface): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.firebaseAuth, model.email, model.password)).pipe(
      catchError((error) => {
        console.error('Login error', error);
        throw error;
      })
    );
  }

  register(model: RegisterInterface): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, model.email, model.password)
      .then((userCredential) => updateProfile(userCredential.user, { displayName: model.displayName }))
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
