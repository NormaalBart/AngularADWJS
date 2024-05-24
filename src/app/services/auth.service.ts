import { Injectable, inject, signal } from '@angular/core'
import { BehaviorSubject, Observable, from } from 'rxjs'
import { Auth, User, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, user } from '@angular/fire/auth';
import { RegisterInterface } from '../models/register.interface';
import { LoginInterface } from '../models/login.interface';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$ = user(this.firebaseAuth);
  currentUserSignal = new BehaviorSubject<User | null | undefined>(undefined);

  constructor(private firebaseAuth: Auth) {}
  
  login(model: LoginInterface): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.firebaseAuth, model.email, model.password)).pipe(
      catchError((error) => {
        console.error('Login error', error);
        throw error;
      })
    );
  }

  register (model: RegisterInterface): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, model.email, model.password)
    .then((userCredential) => {
      //TODO? Register user in database
    });
    return from(promise)
  }

  logout (): Observable<void> {
    return from(this.firebaseAuth.signOut());
  }

  isAuthenticated (): boolean {
    return this.firebaseAuth.currentUser !== null;
  };
}
