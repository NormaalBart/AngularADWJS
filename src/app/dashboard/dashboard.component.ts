import { Component, inject } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { CommonModule } from '@angular/common';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { Project } from '../models/project.interface';
import { DangerActionComponent } from '../project-danger-zone/danger-action/project-danger-zone-danger-action';
import { Observable, from } from 'rxjs';
import { MessageService } from '../services/mesasge.service';
import { Message, MessageType } from '../models/message.interface';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, CreateProjectComponent, DangerActionComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

  projectService = inject(ProjectService);
  messageService = inject(MessageService);

  activeProject$ = this.projectService.activeProject$;

  unarchiveProject(project: Project): Observable<void> {
    return from(new Promise<void>(async (resolve) => {
      this.projectService.setArchiveProject(project.id, false).subscribe(() => {
        resolve();
        this.messageService.addMessage({
          type: MessageType.Warning,
          translateKey: 'project.unarchived',
          params: {
            projectName: project.name
          }
        } as Message);
      });
    }));
  }
}
