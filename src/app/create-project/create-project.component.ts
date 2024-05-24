import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../services/project.service';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorFieldComponent } from '../error-field/error-field.component';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, ErrorFieldComponent],
  templateUrl: './create-project.component.html',})
export class CreateProjectComponent {

  @Input() showModal!: boolean;
  @Output() showModalChange = new EventEmitter<boolean>();
  createProjectForm: FormGroup

  constructor(formBuilder: FormBuilder, private projectService: ProjectService) {
    this.createProjectForm = formBuilder.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  closeModal(event?: MouseEvent) {
    if (!event || event.target === event.currentTarget) {
      this.showModalChange.emit(false);
      this.showModal = false;
    }
  }
  
  preventModalClose(event: MouseEvent) {
    event.stopPropagation();
  }
  
  addProject(): void {
    if(this.createProjectForm.invalid) {
      return;
    }
    const {projectName } = this.createProjectForm.value;
    this.projectService.addProject(projectName);
    this.closeModal(undefined);
  }

}