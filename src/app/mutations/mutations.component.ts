import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MutationService } from '../services/mutations.service';
import { Mutation } from '../models/mutation.interface';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-mutations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mutations.component.html',
})
export class MutationsComponent {

  private mutationService = inject(MutationService);
  private projectService = inject(ProjectService);
  private formBuilder = inject(FormBuilder);

  currentProject$ = this.projectService.activeProject$;
  mutations$ = this.mutationService.mutations$;

  mutationForm = this.formBuilder.group({
    amount: ['', [Validators.required, Validators.min(0)]],
    date: ['', [Validators.required]],
    person: ['', [Validators.required]]
  });
  editMode = false;
  currentMutationId: string | undefined = undefined;

  submitForm(projectId: string) {
    if (this.mutationForm.valid) {
      const formValue = this.mutationForm.value;
      const mutation: Mutation = {
        amount: parseFloat(formValue.amount!),
        date: new Date(formValue.date!),
        person: formValue.person!,
        projectId
      };

      if (this.editMode && this.currentMutationId) {
        this.mutationService.updateMutation(this.currentMutationId, mutation).then(() => this.resetForm());
      } else {
        this.mutationService.addMutation(mutation).then(() => this.resetForm());
      }
    }
  }

  editMutation(mutation: Mutation) {
    this.editMode = true;
    this.currentMutationId = mutation.id;
    console.log(mutation);
    this.mutationForm.patchValue({
      amount: mutation.amount.toString(), // Convert amount to string
      date: mutation.date.toISOString().split('T')[0], // Convert date to string (YYYY-MM-DD)
      person: mutation.person
    });
  }

  deleteMutation(id: string) {
    this.mutationService.deleteMutation(id).then(() => this.resetForm());
  }

  resetForm() {
    this.mutationForm.reset();
    this.editMode = false;
    this.currentMutationId = undefined;
  }
}