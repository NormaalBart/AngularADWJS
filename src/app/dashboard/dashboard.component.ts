import { Component, inject } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { CommonModule } from '@angular/common';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { Project } from '../models/project.interface';
import { DangerActionComponent } from '../project-danger-zone/danger-action/project-danger-zone-danger-action';
import { Observable, from } from 'rxjs';
import { MessageService } from '../services/mesasge.service';
import { MessageInterface, MessageType } from '../models/message.interface';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, CreateProjectComponent, DangerActionComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

  projectService = inject(ProjectService);
  activeProject$ = this.projectService.activeProject$;

}
