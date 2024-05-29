import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project } from '../models/project.interface';
import { ProjectService } from '../services/project.service';
import { compareString } from '../validators/UtilValidator';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../layout/loading/loading.component';
import { LoadingbuttonComponent } from '../loadingbutton/loadingbutton.component';
import { ErrorFieldComponent } from '../error-field/error-field.component';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import { pathNames } from '../../environments/global';
import { MessageService } from '../services/mesasge.service';
import { Message, MessageType } from '../models/message.interface';
import { DangerActionComponent } from './danger-action/project-danger-zone-danger-action';
import { CollaboratorsComponent } from './collaborators/collaborators';

@Component({
  selector: 'app-project-danger-zone',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, LoadingbuttonComponent, ErrorFieldComponent, DangerActionComponent, CollaboratorsComponent],
  templateUrl: './project-danger-zone.component.html',
})
export class ProjectDangerZoneComponent {

  projectService = inject(ProjectService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  messageService = inject(MessageService);

  activeProject$ = this.projectService.activeProject$;

  deleteProject(project: Project): Observable<void> {
    return from(new Promise<void>(async (resolve) => {
      this.projectService.deleteProject(project.id).subscribe(() => {
        resolve();
        this.messageService.addMessage({
          type: MessageType.Warning,
          translateKey: 'project.delete',
          params: {
            projectName: project.name
          }
        } as Message);

        this.router.navigate([pathNames.projects.projects])
      });
    }));
  }

  archiveProject(project: Project): Observable<void> {
    return from(new Promise<void>(async (resolve) => {
      this.projectService.setArchiveProject(project.id, true).subscribe(() => {
        resolve();
        this.messageService.addMessage({
          type: MessageType.Warning,
          translateKey: 'project.archive',
          params: {
            projectName: project.name
          }
        } as Message);

        this.router.navigate([pathNames.projects.projects])
      });
    }));
  }
}