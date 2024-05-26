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

@Component({
  selector: 'app-project-danger-zone',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, LoadingbuttonComponent, ErrorFieldComponent],
  templateUrl: './project-danger-zone.component.html',
})
export class ProjectDangerZoneComponent implements OnInit {

  projectService = inject(ProjectService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  messageService = inject(MessageService);

  activeProject: Project | null | undefined;
  showConfirmationInput: boolean = false;
  projectTitleInput: string = '';


  @Output() deleteForm = this.formBuilder.group({
    projectName: ['', [Validators.required]],
  });


  ngOnInit() {
    this.projectService.activeProject.subscribe(project => {
      this.activeProject = project;
      this.deleteForm.get('projectName')?.setValidators([Validators.required, compareString(project?.name ?? '')]);
    });

  }

  checkProjectTitle(): void {
    if (this.projectTitleInput === this.activeProject?.name) {
      this.deleteProject();
    } else {
      alert('De ingevoerde titel is incorrect.');
      this.projectTitleInput = ''; // Reset de invoer
    }
  }

  deleteProject(): Observable<void> {
    return from(new Promise<void>(async (resolve) => {
      if (this.deleteForm.invalid) {
        return resolve();
      }

      this.projectService.deleteProject(this.activeProject!.id).subscribe(() => {
        resolve();
        this.messageService.addMessage({
          type: MessageType.Warning,
          title: 'Project verwijderd',
          description: `{{this.activeProject?.name} verwijderd.}} is verwijderd`
        } as Message);

        this.router.navigate([pathNames.projects.projects])
      });
    }));
  }
}