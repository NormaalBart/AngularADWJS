import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../services/project.service';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorFieldComponent } from '../error-field/error-field.component';
import { MessageService } from '../services/mesasge.service';
import { MessageType } from '../models/message.interface';
import { Router } from '@angular/router';
import { pathNames } from '../../environments/global';
import { AuthService } from '../services/auth.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, ErrorFieldComponent, ModalComponent],
  templateUrl: './create-project.component.html',
})
export class CreateProjectComponent {

  formBuilder = inject(FormBuilder);
  messageservice = inject(MessageService);
  projectService = inject(ProjectService);
  authService = inject(AuthService);
  router = inject(Router);

  currentUser$ = this.authService.currentUser$;

  createProjectForm = this.formBuilder.group({
    projectName: ['', [Validators.required, Validators.minLength(3)]]
  });

  @Input() showModal!: boolean;
  @Output() showModalChange = new EventEmitter<boolean>();

  closeModal(event?: MouseEvent) {
    if (!event || event.target === event.currentTarget) {
      this.showModalChange.emit(false);
      this.showModal = false;
      this.createProjectForm.reset();
    }
  }

  preventModalClose(event: MouseEvent) {
    event.stopPropagation();
  }

  addProject(userId: string): Promise<void> {
    if (this.createProjectForm.invalid) {
      return Promise.resolve();
    }
    const projectName = this.createProjectForm.value.projectName!;
    this.projectService.addProject(userId, projectName).subscribe(projectId => {
      this.messageservice.addMessage({ type: MessageType.Success, translateKey: 'project.created', params: { projectName } });
      this.closeModal(undefined);
      this.createProjectForm.reset();
      this.router.navigate([pathNames.projects.projectOverview(projectId)]);
    });
    return Promise.resolve();
  }
}
