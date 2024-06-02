import { Injectable, OnInit, inject } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { Category } from '../models/category.interface';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { firebaseTables } from '../../environments/global';
import { ProjectService } from './project.service';
import { MutationService } from './mutations.service';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    private firestore = inject(Firestore);
    private projectService = inject(ProjectService);
    private mutationService = inject(MutationService);
    private categoriesCollection = collection(this.firestore, firebaseTables.categories);

    categories$ = this.projectService.activeProject$.pipe(
        switchMap(project => {
            if (!project) {
                return of([] as Category[]);
            }

            const accessibleProjectsQuery = query(this.categoriesCollection, where('projectId', '==', project.id));
            return collectionData(accessibleProjectsQuery, { idField: 'id' }) as Observable<Category[]>;
        })
    );

    addCategory(category: Category): Promise<void> {
        return addDoc(this.categoriesCollection, this.parseCategory(category)).then(() => { });
    }

    updateCategory(category: Category): Promise<void> {
        const mutationDoc = doc(this.categoriesCollection, category.id!);
        return updateDoc(mutationDoc, this.parseCategory(category));
    }

    deleteCategory(category: Category): Promise<void> {
        return this.mutationService.deleteCategoriesMutations(category.projectId, category.id!).then(() => {
            const mutationDoc = doc(this.categoriesCollection, category.id!);
            return deleteDoc(mutationDoc);
        });
    }

    private parseCategory(category: Category) {
        return {
            name: category.name,
            maxBudget: category.maxBudget,
            endDate: category.endDate,
            projectId: category.projectId,
        };
    }
}
