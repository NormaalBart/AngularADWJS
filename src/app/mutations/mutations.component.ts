import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MutationService } from '../services/mutations.service';
import { ProjectService } from '../services/project.service';
import { MutationFormComponent } from './form/mutation-form.component';
import { Mutation } from '../models/mutation.interface';
import { Timestamp } from '@angular/fire/firestore';
import { TranslateModule } from '@ngx-translate/core';
import { CategoriesComponent } from '../categories/categories.component';
import { combineLatest, map } from 'rxjs';
import { CategoryService } from '../services/categories.service';

@Component({
  selector: 'app-mutations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MutationFormComponent, TranslateModule, CategoriesComponent],
  templateUrl: './mutations.component.html',
})
export class MutationsComponent {
  private mutationService = inject(MutationService);
  private categoryService = inject(CategoryService);
  private projectService = inject(ProjectService);

  private mutations$ = this.mutationService.mutations$;
  private categories$ = this.categoryService.categories$;
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

  openMutationForm(mutation: Mutation | undefined, projectId: string) {
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
}
