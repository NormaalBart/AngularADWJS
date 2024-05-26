import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, inject } from '@angular/core';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { Project } from '../models/project.interface';
import { ProjectService } from '../services/project.service';
import { BehaviorSubject, Observable, first } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarStatus } from '../enums/sidebar-status';
import { ActivatedRoute, Router, RouterLinkActive, RouterModule } from '@angular/router';
import { pathNames } from '../../environments/global';

@Component({
  selector: 'app-project-sidebar',
  standalone: true,
  imports: [CommonModule, CreateProjectComponent, TranslateModule, RouterModule],
  templateUrl: './project-sidebar.component.html',
})
export class ProjectSidebarComponent implements OnInit {

  readonly SidebarStatus = SidebarStatus;
  readonly PathNames = pathNames;

  projectService = inject(ProjectService);
  router = inject(Router);

  sidebarStatus = SidebarStatus.Projects;
  currentProjects = new BehaviorSubject<Project[] | undefined>(undefined);
  activeProject: Project | null = null;

  @Output() showCreateProjectModal: boolean = false;

  ngOnInit() {
    this.projectService.getProjects().subscribe(projects => {
      this.currentProjects.next(projects);
    });
    this.projectService.activeProject.subscribe(project => {
      this.activeProject = project;
      this.sidebarStatus = project ? SidebarStatus.ProjectDetails : SidebarStatus.Projects;
    });
  }

  navigateToProject(project: Project) {
    this.sidebarStatus = SidebarStatus.ProjectDetails;
    this.router.navigate([pathNames.projects.projectOverview(project.id)]);
  }

  isActiveProject(project: Project) {
    return this.projectService.isActiveProject(project);
  }

  isActiveRoute(route: string) {
    return this.router.url.includes(route);
  }
}

