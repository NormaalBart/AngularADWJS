import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MutationService } from '../services/mutations.service';
import { ProjectService } from '../services/project.service';
import { MutationFormComponent } from './form/mutation-form.component';
import { Mutation } from '../models/mutation.interface';
import { Timestamp } from '@angular/fire/firestore';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-mutations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MutationFormComponent, TranslateModule],
  templateUrl: './mutations.component.html',
})
export class MutationsComponent {
  private mutationService = inject(MutationService);
  private projectService = inject(ProjectService);

  currentProject$ = this.projectService.activeProject$;
  mutations$ = this.mutationService.mutations$;

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
