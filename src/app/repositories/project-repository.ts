import { Injectable } from '@angular/core';
import { Project } from '../models/project.interface';
import { Observable, from } from 'rxjs';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { firebaseTables } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectRepository {
  private projectsCollection = collection(this.firestore, firebaseTables.projects);

  constructor(private firestore: Firestore) {}

  getProjects(): Observable<Project[]> {
    return collectionData(this.projectsCollection, { idField: 'id' }) as Observable<Project[]>;
  }

  addProject(name: string): Observable<string> {
    return from(addDoc(this.projectsCollection, { name, archived: false }).then(response => response.id));
  }

  deleteProject(id: string): Observable<void> {
    const docRef = doc(this.projectsCollection, firebaseTables.projects + '/' + id);
    return from(deleteDoc(docRef));
  }
}
