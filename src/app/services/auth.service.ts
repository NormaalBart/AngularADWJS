import { Injectable, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, from } from 'rxjs'
import { Auth, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, user } from '@angular/fire/auth';
import { RegisterInterface } from '../models/register.interface';
import { LoginInterface } from '../models/login.interface';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth)
  
  constructor (private http: HttpClient) {}

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
      updateProfile(userCredential.user, { displayName: model.displayName });
    });
    return from(promise);
  }

  logout (): Observable<void> {
    return from(this.firebaseAuth.signOut());
  }

  isAuthenticated (): boolean {
    return this.firebaseAuth.currentUser !== null;
  };
}
