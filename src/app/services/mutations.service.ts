import { Injectable, inject } from '@angular/core'
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { Mutation } from '../models/mutation.interface';
import { firebaseTables } from '../../environments/global';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root'
})
export class MutationService {

  private firestore = inject(Firestore);
  private projectService = inject(ProjectService);

  private mutationsCollection = collection(this.firestore, firebaseTables.mutations);

  mutations$ = this.projectService.activeProject$.pipe(
    switchMap(project => {
      if (!project) {
        return of([] as Mutation[]);
      }

      const accessibleProjectsQuery = query(this.mutationsCollection, where('projectId', '==', project.id));
      return collectionData(accessibleProjectsQuery, { idField: 'id' }) as Observable<Mutation[]>;
    })
  );

  getMutations(): Observable<Mutation[]> {
    return collectionData(this.mutationsCollection, { idField: 'id' }) as Observable<Mutation[]>;
  }

  addMutation(mutation: Mutation): Promise<void> {
    return addDoc(this.mutationsCollection, mutation).then(() => { });
  }

  updateMutation(id: string, mutation: Mutation): Promise<void> {
    console.log(mutation);
    const mutationDoc = doc(this.mutationsCollection, id);
    return updateDoc(mutationDoc, {
      title: mutation.title,
      amount: mutation.amount,
      date: mutation.date,
      person: mutation.person,
      projectId: mutation.projectId
    });
  }

  deleteMutation(id: string): Promise<void> {
    const mutationDoc = doc(this.mutationsCollection, id);
    return deleteDoc(mutationDoc);
  }
}