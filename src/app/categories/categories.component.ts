import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../models/category.interface';
import { CategoryService } from '../services/categories.service';
import { TranslateModule } from '@ngx-translate/core';
import { CrudCategoryComponent } from '../crud-category/crud-category.component';
import { ProjectService } from '../services/project.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, CdkDragEnter } from '@angular/cdk/drag-drop';
import { MutationService } from '../services/mutations.service';
import { Mutation } from '../models/mutation.interface';
import { emptyCategoryFilter } from '../../environments/global';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CrudCategoryComponent, DragDropModule],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent {

  emptyCategoryFilter = emptyCategoryFilter;

  private projectService = inject(ProjectService);
  private categoryService = inject(CategoryService);
  private mutationService = inject(MutationService);

  @Input() projectId!: string;
  @Input() filterCategories!: Set<string>;

  activeProject$ = this.projectService.activeProject$;
  categories$ = this.categoryService.categories$;
  selectedCategory: Category | undefined = undefined;

  openSelectedCategory(category: Category | undefined) {
    if (category) {
      this.selectedCategory = category;
    } else {
      this.selectedCategory = {
        name: '',
        projectId: this.projectId,
        maxBudget: 0,
      } as Category;
    }
  }

  isSelected(category: string) {
    if (this.filterCategories.size === 0) {
      return true;
    } else if (this.filterCategories.has(emptyCategoryFilter)) {
      return category === emptyCategoryFilter;
    }
    return this.filterCategories.has(category);
  }

  onDrop(event: CdkDragDrop<Category>) {
    const mutation: Mutation = event.item.data;
    const category: Category = event.container.data;

    mutation.categoryId = category.id!;
    this.mutationService.updateMutation(mutation);
  }

  onDropEmptyCategory(event: CdkDragDrop<Mutation>) {
    const mutation: Mutation = event.item.data;

    mutation.categoryId = null;
    this.mutationService.updateMutation(mutation);
  }

  toggleCategorySelection(category: Category) {
    this.filterCategories.delete(emptyCategoryFilter);
    if (this.filterCategories.has(category.id!)) {
      this.filterCategories.delete(category.id!);
    } else {
      this.filterCategories.add(category.id!);
    }
  }

  showEmptyMutations() {
    if (this.filterCategories.has(emptyCategoryFilter)) {
      this.filterCategories.clear();
    } else {
      this.filterCategories.clear();
      this.filterCategories.add(emptyCategoryFilter);
    }
  }
}
