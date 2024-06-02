import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MutationService } from '../services/mutations.service';
import { ProjectService } from '../services/project.service';
import { MutationFormComponent } from './form/mutation-form.component';
import { Mutation } from '../models/mutation.interface';
import { Timestamp } from '@angular/fire/firestore';
import { TranslateModule } from '@ngx-translate/core';
import { CategoriesComponent } from '../categories/categories.component';
import { combineLatest, map } from 'rxjs';
import { CategoryService } from '../services/categories.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { emptyCategoryFilter } from '../../environments/global';
import { Category } from '../models/category.interface';

@Component({
  selector: 'app-mutations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MutationFormComponent, TranslateModule, CategoriesComponent, DragDropModule],
  templateUrl: './mutations.component.html',
})
export class MutationsComponent {

  private mutationService = inject(MutationService);
  private categoryService = inject(CategoryService);
  private projectService = inject(ProjectService);

  private mutations$ = this.mutationService.mutations$;
  categories$ = this.categoryService.categories$;
  currentProject$ = this.projectService.activeProject$;

  enrichedMutations$ = combineLatest([this.mutations$, this.categories$]).pipe(
    map(([mutations, categories]) => {
      const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));
      return mutations.map(mutation => ({
        ...mutation,
        categoryName: categoryMap.get(mutation.categoryId || '') || null
      }));
    })
  );

  selectedMutation: Mutation | undefined = undefined;
  selectedCategories: Set<string> = new Set();
  isDragging = false;

  openMutationForm(mutation: Mutation | undefined, projectId: string) {
    if (this.isDragging) {
      return;
    }
    if (mutation) {
      this.selectedMutation = mutation;
    } else {
      this.selectedMutation = {
        title: '',
        amount: 0,
        date: Timestamp.fromDate(new Date()),
        person: '',
        projectId,
      } as Mutation;
    }
  }

  handleDragEnd() {
    setTimeout(() => {
      this.isDragging = false;
    }, 20);
  }

  filterMutations(mutations: Mutation[]): Mutation[] {
    if (this.selectedCategories.size === 0) {
      return mutations;
    }
    return mutations.filter(mutation => {
      if (this.selectedCategories.has(emptyCategoryFilter)) {
        return mutation.categoryId === null;
      }
      return this.selectedCategories.has(mutation.categoryId || '');
    });
  }

  getTotalAmount(mutations: Mutation[]): number {
    return mutations.reduce((sum, mutation) => sum + mutation.amount, 0);
  }

  getCategoryData(mutations: Mutation[], categories: Category[]) {
    const now = new Date();
    return categories
      .filter(category => this.selectedCategories.size === 0 || this.selectedCategories.has(category.id!))
      .map(category => {
        const filteredMutations = mutations.filter(mutation => mutation.categoryId === category.id);
        const totalSpent = filteredMutations.reduce((sum, mutation) => sum + mutation.amount, 0);
        const endDate = category.endDate?.toDate();
        return {
          ...category,
          totalSpent,
          isOverBudget: totalSpent > category.maxBudget,
          isAlmostOverBudget: totalSpent > category.maxBudget * 0.9,
          isPastEndDate: endDate ? now > endDate : false,
          isNearEndDate: endDate ? (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 7 : false
        };
      });
  }

  isEmptyCategory(): boolean {
    return this.selectedCategories.has(emptyCategoryFilter);
  }
}
