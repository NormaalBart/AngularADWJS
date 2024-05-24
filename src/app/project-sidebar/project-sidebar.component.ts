import { CommonModule } from '@angular/common';
import { Component, OnInit, Output } from '@angular/core';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { Project } from '../models/project.interface';
import { ProjectService } from '../services/project.service';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-project-sidebar',
  standalone: true,
  imports: [CommonModule, CreateProjectComponent, TranslateModule],
  templateUrl: './project-sidebar.component.html',
})
export class ProjectSidebarComponent  {

  @Output() showCreateProjectModal: boolean = true;

  projects$: Observable<Project[]> = this.projectService.getProjects();

  constructor(private projectService: ProjectService) {
  }

  setActiveProject(project: Project) {
    this.projectService.setActiveProject(project);
  }
  

  isActiveProject(project: Project) {
    return this.projectService.isActiveProject(project);
  }
}
