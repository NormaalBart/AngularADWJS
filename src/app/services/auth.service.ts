import { Injectable, OnInit, inject } from '@angular/core'
import { BehaviorSubject, Observable, from } from 'rxjs'
import { Auth, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, user } from '@angular/fire/auth';
import { RegisterInterface } from '../models/register.interface';
import { LoginInterface } from '../models/login.interface';
import { catchError, switchMap } from 'rxjs/operators';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, setDoc, where } from '@angular/fire/firestore';
import { firebaseTables } from '../../environments/global';
import { UserInterface } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  firebaseAuth = inject(Auth);
  firestore = inject(Firestore);

  private currentFirebaseUser$ = user(this.firebaseAuth);
  private currentUserSignal = new BehaviorSubject<UserInterface | null | undefined>(undefined);
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
          const userData = userDoc.data() as UserInterface;
          this.currentUserSignal.next(userData);
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
        const userDocData: UserInterface = {
          id: userCredential.user.uid,
          displayName: model.displayName,
          email: model.email,
          invites: []
        };
        return from(setDoc(doc(this.usersCollection, userCredential.user.uid), userDocData));
      }));
  }

  logout(): Observable<void> {
    return from(this.firebaseAuth.signOut());
  }

  isAuthenticated(): boolean {
    return this.firebaseAuth.currentUser !== null;
  }

  setUser(user: UserInterface | null) {
    this.currentUserSignal.next(user);
  }
}
