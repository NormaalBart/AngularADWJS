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

@Component({
  selector: 'app-project-danger-zone',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, LoadingbuttonComponent, ErrorFieldComponent, DangerActionComponent],
  templateUrl: './project-danger-zone.component.html',
})
export class ProjectDangerZoneComponent implements OnInit {

  projectService = inject(ProjectService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  messageService = inject(MessageService);

  activeProject: Project | null | undefined;

  ngOnInit() {
    this.projectService.activeProject$.subscribe(project => {
      this.activeProject = project;
    });
  }

  deleteProject(): Observable<void> {
    return from(new Promise<void>(async (resolve) => {
      this.projectService.deleteProject(this.activeProject!.id).subscribe(() => {
        resolve();
        this.messageService.addMessage({
          type: MessageType.Warning,
          translateKey: 'project.delete',
          params: {
            projectName: this.activeProject!.name
          }
        } as Message);

        this.router.navigate([pathNames.projects.projects])
      });
    }));
  }
}