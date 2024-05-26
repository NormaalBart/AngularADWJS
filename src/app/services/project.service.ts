import { Injectable } from '@angular/core';
import { Project } from '../models/project.interface';
import { BehaviorSubject, Observable, catchError, from, of } from 'rxjs';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, query, where } from '@angular/fire/firestore';
import { firebaseTables } from '../../environments/global';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  public activeProject = new BehaviorSubject<Project | null>(null);
  private projectsCollection = collection(this.firestore, firebaseTables.projects);

  constructor(private firestore: Firestore, private authService: AuthService) { }

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
    const docRef = doc(this.projectsCollection, firebaseTables.projects + '/' + id);
    return from(deleteDoc(docRef));
  }

  setActiveProject(project: Project): void {
    this.activeProject.next(project);
  }

  clearActiveProject(): void {
    this.activeProject.next(null);
  }

  isActiveProject(project: Project): boolean {
    return this.activeProject.value === project;
  }
}
