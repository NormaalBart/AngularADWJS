import { Injectable, OnInit, inject } from '@angular/core';
import { Project } from '../models/project.interface';
import { BehaviorSubject, Observable, catchError, from, of, switchMap } from 'rxjs';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { firebaseTables } from '../../environments/global';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  firestore = inject(Firestore);
  authService = inject(AuthService);

  private projectsCollection = collection(this.firestore, firebaseTables.projects);

  projects$ = this.authService.currentUser$.pipe(
    switchMap(user => {
      if (!user) {
        return of([] as Project[]);
      }

      const uid = user.uid;
      const accessibleProjectsQuery = query(this.projectsCollection, where('access', 'array-contains', uid));
      return collectionData(accessibleProjectsQuery, { idField: 'id' }) as Observable<Project[]>;
    })
  );

  private activeProjectSubject = new BehaviorSubject<Project | null | undefined>(undefined);
  activeProject$ = this.activeProjectSubject.asObservable();

  addProject(name: string): Observable<string> {
    let user = this.authService.getUser()!;
    return from(addDoc(this.projectsCollection, { name, archived: false, ownerId: user.uid, access: [user.uid] }).then(response => response.id));
  }

  deleteProject(id: string): Observable<void> {
    const docRef = doc(this.projectsCollection, id);
    return from(deleteDoc(docRef));
  }

  setArchiveProject(id: string, archived: boolean): Observable<void> {
    const docRef = doc(this.projectsCollection, id);
    return from(updateDoc(docRef, { archived }));
  }

  setActiveProject(project: Project | null): void {
    this.activeProjectSubject.next(project);
  }

  clearActiveProject(): void {
    this.activeProjectSubject.next(null);
  }

  isActiveProject(project: Project): boolean {
    return this.activeProjectSubject.value?.id === project.id;
  }
}
