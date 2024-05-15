import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, from } from 'rxjs'
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { RegisterInterface } from '../models/register.interface';
import { LoginInterface } from '../models/login.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  firebaseAuth = inject(Auth);

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
    return !!this.firebaseAuth.currentUser;
  };
}
