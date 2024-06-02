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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { emptyCategoryFilter } from '../../environments/global';
import { Category } from '../models/category.interface';

@Component({
  selector: 'app-mutations',
  standalone: true,
  imports: [CommonModule, FormsModule, MutationFormComponent, TranslateModule, CategoriesComponent, DragDropModule],
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
  searchQuery: string = '';
  sortField: string = 'date';
  sortOrder: string = 'desc';
  selectedMonth: string = '';

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

  onSortChange(event: any) {
    const value = event.target.value;
    const [field, order] = value.split('-');
    this.sortField = field;
    this.sortOrder = order;
  }

  getUniqueMonths(mutations: Mutation[]): string[] {
    const months = mutations.map(mutation =>
      new Date(mutation.date.toDate()).toLocaleString('default', { month: 'long', year: 'numeric' })
    );
    return [...new Set(months)];
  }

  onMonthChange(event: any) {
    this.selectedMonth = event.target.value;
  }

  filterMutations(mutations: Mutation[], withoutMonth: boolean = false): Mutation[] {
    let filteredMutations = mutations;

    if (this.selectedCategories.size !== 0) {
      filteredMutations = filteredMutations.filter(mutation => {
        if (this.selectedCategories.has(emptyCategoryFilter)) {
          return mutation.categoryId === null;
        }
        return this.selectedCategories.has(mutation.categoryId || '');
      });
    }

    if (this.searchQuery) {
      filteredMutations = filteredMutations.filter(mutation =>
        mutation.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.selectedMonth && !withoutMonth) {
      filteredMutations = filteredMutations.filter(mutation => {
        const mutationMonth = new Date(mutation.date.toDate()).toLocaleString('default', { month: 'long', year: 'numeric' });
        return mutationMonth === this.selectedMonth;
      });
    }

    return filteredMutations.sort((a, b) => {
      let comparison = 0;

      if (this.sortField === 'date') {
        comparison = a.date.toDate().getTime() - b.date.toDate().getTime();
      } else if (this.sortField === 'price') {
        comparison = a.amount - b.amount;
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
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
