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

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CrudCategoryComponent, DragDropModule],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent {

  private projectService = inject(ProjectService);
  private categoryService = inject(CategoryService);
  private mutationService = inject(MutationService);

  @Input() projectId!: string;

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

  onDrop(event: CdkDragDrop<Category>) {
    const mutation: Mutation = event.item.data;
    const category: Category = event.container.data;

    mutation.categoryId = category.id!;
    this.mutationService.updateMutation(mutation);

    console.log(mutation, category);
  }
}
