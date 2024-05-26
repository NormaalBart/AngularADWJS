import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../services/project.service';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorFieldComponent } from '../error-field/error-field.component';
import { MessageService } from '../services/mesasge.service';
import { MessageType } from '../models/message.interface';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, ErrorFieldComponent],
  templateUrl: './create-project.component.html',
})
export class CreateProjectComponent {

  formBuilder = inject(FormBuilder);
  messageservice = inject(MessageService);
  projectService = inject(ProjectService);

  createProjectForm = this.formBuilder.group({
    projectName: ['', [Validators.required, Validators.minLength(3)]]
  });

  @Input() showModal!: boolean;
  @Output() showModalChange = new EventEmitter<boolean>();

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
    if (this.createProjectForm.invalid) {
      return;
    }
    const { projectName } = this.createProjectForm.value;
    this.projectService.addProject(projectName!).subscribe(() => {
      this.messageservice.addMessage({ type: MessageType.Success, title: 'Project aangemaakt', description: `$projectName is aangemaakt` });
      this.closeModal(undefined);
    });
  }
}
