import { CommonModule } from '@angular/common';
import { Component, OnInit, Output } from '@angular/core';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { Project } from '../models/project.interface';
import { ProjectService } from '../services/project.service';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarStatus } from '../enums/sidebar-status';

@Component({
  selector: 'app-project-sidebar',
  standalone: true,
  imports: [CommonModule, CreateProjectComponent, TranslateModule],
  templateUrl: './project-sidebar.component.html',
})
export class ProjectSidebarComponent implements OnInit {

  SidebarStatus = SidebarStatus;

  @Output() showCreateProjectModal: boolean = false;
  sidebarStatus = SidebarStatus.Projects;
  projects$: Observable<Project[]> = this.projectService.getProjects();
  activeProject: Project | null = null;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.projectService.activeProject.subscribe(project => {
      this.activeProject = project;
    });
  }

  setActiveProject(project: Project) {
    this.projectService.setActiveProject(project);
    this.sidebarStatus = SidebarStatus.ProjectDetails;
  }
  

  isActiveProject(project: Project) {
    return this.projectService.isActiveProject(project);
  }
}
