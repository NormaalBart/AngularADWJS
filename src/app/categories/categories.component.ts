import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../models/category.interface';
import { CategoryService } from '../services/categories.service';
import { TranslateModule } from '@ngx-translate/core';
import { CrudCategoryComponent } from '../crud-category/crud-category.component';
import { ProjectService } from '../services/project.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CrudCategoryComponent],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent {

  private projectService = inject(ProjectService);
  private categoryService = inject(CategoryService);

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
}
