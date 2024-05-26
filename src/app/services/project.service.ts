import { Injectable, OnInit, inject } from '@angular/core';
import { Project } from '../models/project.interface';
import { BehaviorSubject, Observable, catchError, from, of } from 'rxjs';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, query, where } from '@angular/fire/firestore';
import { firebaseTables } from '../../environments/global';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  firestore = inject(Firestore);
  authService = inject(AuthService);

  activeProject = new BehaviorSubject<Project | null | undefined>(undefined);
  private projectsCollection = collection(this.firestore, firebaseTables.projects);

  getProjects(): Observable<Project[]> {
    const uid = this.authService.getUser()!.uid;
    const accessibleProjectsQuery = query(this.projectsCollection, where('access', 'array-contains', uid));
    return collectionData(accessibleProjectsQuery, { idField: 'id' }) as Observable<Project[]>;
  }

  addProject(name: string): Observable<string> {
    let user = this.authService.getUser()!;
    return from(addDoc(this.projectsCollection, { name, archived: false, ownerId: user.uid, access: [user.uid] }).then(response => response.id));
  }

  deleteProject(id: string): Observable<void> {
    const docRef = doc(this.projectsCollection, id);
    return from(deleteDoc(docRef));
  }

  setActiveProject(project: Project | null): void {
    this.activeProject.next(project);
  }

  clearActiveProject(): void {
    this.activeProject.next(null);
  }

  isActiveProject(project: Project): boolean {
    return this.activeProject.value?.id === project.id;
  }
}
