import { Injectable, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, from } from 'rxjs'
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, user } from '@angular/fire/auth';
import { RegisterInterface } from '../models/register.interface';
import { LoginInterface } from '../models/login.interface';
import { UserInterface } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth)
  
  constructor (private http: HttpClient) {}

  login (model: LoginInterface): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, model.email, model.password).then(() => {});
    return from(promise);
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
    console.log(this.firebaseAuth.currentUser);
    return this.firebaseAuth.currentUser !== null;
  };
}
