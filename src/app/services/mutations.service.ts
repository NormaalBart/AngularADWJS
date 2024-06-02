import { Injectable, inject } from '@angular/core'
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDocs, query, updateDoc, where, writeBatch } from '@angular/fire/firestore';
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

  addMutation(mutation: Mutation): Promise<void> {
    return addDoc(this.mutationsCollection, this.parseMutation(mutation)).then(() => { });
  }

  updateMutation(mutation: Mutation): Promise<void> {
    const mutationDoc = doc(this.mutationsCollection, mutation.id!);
    return updateDoc(mutationDoc, this.parseMutation(mutation));
  }

  private parseMutation(mutation: Mutation) {
    return {
      title: mutation.title,
      amount: mutation.amount,
      date: mutation.date,
      person: mutation.person,
      projectId: mutation.projectId,
      categoryId: mutation.categoryId,
    };
  }

  deleteMutation(id: string): Promise<void> {
    const mutationDoc = doc(this.mutationsCollection, id);
    return deleteDoc(mutationDoc);
  }

  deleteCategoriesMutations(projectId: string, category: string): Promise<void> {
    const mutationsQuery = query(
      this.mutationsCollection,
      where('projectId', '==', projectId),
      where('categoryId', '==', category)
    );

    return getDocs(mutationsQuery).then(querySnapshot => {
      const batch = writeBatch(this.firestore);
      querySnapshot.forEach(doc => {
        batch.update(doc.ref, { categoryId: null });
      });

      return batch.commit();
    });
  }
}