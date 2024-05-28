import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, inject } from '@angular/core';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { Project } from '../models/project.interface';
import { ProjectService } from '../services/project.service';
import { BehaviorSubject, Observable, first, map, startWith } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarStatus } from '../enums/sidebar-status';
import { ActivatedRoute, Router, RouterLinkActive, RouterModule } from '@angular/router';
import { pathNames } from '../../environments/global';
import { MessageService } from '../services/mesasge.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateProjectComponent, TranslateModule, RouterModule],
  templateUrl: './project-sidebar.component.html',
})
export class ProjectSidebarComponent implements OnInit {

  readonly SidebarStatus = SidebarStatus;
  readonly PathNames = pathNames;

  projectService = inject(ProjectService);
  router = inject(Router);

  sidebarStatus = SidebarStatus.Projects;
  projects$ = this.projectService.projects$;
  activeProject$ = this.projectService.activeProject$;
  filter = 'active';
  filteredProjects$ = this.projects$.pipe(
    startWith([]),
    map(projects => this.filterProjects(projects, this.filter))
  );

  @Output() showCreateProjectModal: boolean = false;

  ngOnInit() {
    this.projectService.activeProject$.subscribe(project => {
      this.sidebarStatus = project ? SidebarStatus.ProjectDetails : SidebarStatus.Projects;
    });
  }

  navigateToProject(project: Project) {
    this.router.navigate([pathNames.projects.projectOverview(project.id)]);
    this.projectService.setActiveProject(project);
  }

  isActiveProject(project: Project) {
    return this.projectService.isActiveProject(project);
  }

  isActiveRoute(route: string) {
    return this.router.url.includes(route);
  }

  onFilterChange(event: Event) {
    const filter = (event.target as HTMLSelectElement).value;
    this.filter = filter;
    this.filteredProjects$ = this.projects$.pipe(
      map(projects => this.filterProjects(projects, filter))
    );
  }

  filterProjects(projects: Project[], filter: string): Project[] {
    if (filter === 'active') {
      return projects.filter(project => !project.archived);
    } else if (filter === 'archived') {
      return projects.filter(project => project.archived);
    }
    return projects;
  }
}

