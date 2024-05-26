import { CommonModule } from '@angular/common';
import { Component, OnInit, Output } from '@angular/core';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { Project } from '../models/project.interface';
import { ProjectService } from '../services/project.service';
import { Observable, first } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarStatus } from '../enums/sidebar-status';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { pathNames } from '../../environments/global';

@Component({
  selector: 'app-project-sidebar',
  standalone: true,
  imports: [CommonModule, CreateProjectComponent, TranslateModule, RouterModule],
  templateUrl: './project-sidebar.component.html',
})
export class ProjectSidebarComponent implements OnInit {

  SidebarStatus = SidebarStatus;

  @Output() showCreateProjectModal: boolean = false;
  sidebarStatus = SidebarStatus.Projects;
  projects$: Observable<Project[]> = this.projectService.getProjects();
  activeProject: Project | null = null;

  constructor(private projectService: ProjectService, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
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
}
