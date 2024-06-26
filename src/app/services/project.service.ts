import { Injectable, OnInit, inject } from '@angular/core';
import { Project } from '../models/project.interface';
import { BehaviorSubject, Observable, catchError, from, of, switchMap } from 'rxjs';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, query, updateDoc, where } from '@angular/fire/firestore';
import { firebaseTables } from '../../environments/global';
import { AuthService } from './auth.service';
import { User } from '../models/user.class';

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

      const uid = user.id;
      const accessibleProjectsQuery = query(this.projectsCollection, where('access', 'array-contains', uid));
      return collectionData(accessibleProjectsQuery, { idField: 'id' }) as Observable<Project[]>;
    })
  );

  private activeProjectSubject = new BehaviorSubject<Project | null | undefined>(undefined);
  activeProject$ = this.activeProjectSubject.asObservable();

  addProject(userId: string, name: string): Observable<string> {
    return from(addDoc(this.projectsCollection, { name, archived: false, ownerId: userId, access: [userId] }).then(response => response.id));
  }

  deleteProject(id: string): Observable<void> {
    const docRef = doc(this.projectsCollection, id);
    return from(deleteDoc(docRef));
  }

  getProject(id: string): Promise<Project | null> {
    return getDoc(doc(this.projectsCollection, id)).then(doc => {
      if (doc.exists()) {
        return { id: doc.id, ...doc.data() } as Project;
      } else {
        return null;
      }
    });
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

  addUser(projectId: string, userId: string): Promise<void> {
    const docRef = doc(this.projectsCollection, projectId);
    return getDoc(docRef).then(doc => {
      if (doc.exists()) {
        const project = doc.data() as Project;
        if (docRef) {
          return updateDoc(docRef, { access: [...project.access, userId] });
        }
      }
      return new Promise<void>((resolve) => { resolve() });
    });
  }

  removeUser(projectId: string, userId: string) {
    const docRef = doc(this.projectsCollection, projectId);
    return getDoc(docRef).then(doc => {
      if (doc.exists()) {
        const project = doc.data() as Project;
        if (docRef) {
          return updateDoc(docRef, { access: project.access.filter(id => id !== userId) });
        }
      }
      return new Promise<void>((resolve) => { resolve() });
    });
  }
}
