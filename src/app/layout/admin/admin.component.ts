import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateProjectComponent } from '../../create-project/create-project.component';
import { ProjectSidebarComponent } from '../../project-sidebar/project-sidebar.component';
import { pathNames } from '../../../environments/global';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.interface';
import { first } from 'rxjs';
import { MessageComponent } from '../../message/message.component';
import { MessageType } from '../../models/message.interface';
import { MessageService } from '../../services/mesasge.service';

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ReactiveFormsModule, CreateProjectComponent, ProjectSidebarComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  router = inject(Router);
  authService = inject(AuthService);
  projectService = inject(ProjectService);
  messageService = inject(MessageService);
  activeRoute = inject(ActivatedRoute);

  projects$ = this.projectService.projects$;

  isLoading = true;

  ngOnInit() {
    let projects: Project[] | undefined = undefined;
    let projectId: string | null | undefined = undefined;

    this.projects$.subscribe(newProjects => {
      projects = newProjects;
      this.checkActiveProject(projects, projectId);
    });

    if (this.activeRoute.firstChild === null) {
      throw new Error('No child route found');
    }

    this.activeRoute.firstChild.params.subscribe(params => {
      projectId = params['projectId'];
      if (projectId == undefined) {
        projectId = null;
      }
      this.checkActiveProject(projects, projectId);
    });
  }

  private checkActiveProject(projects: Project[] | undefined, projectId: string | null | undefined) {
    if (projects === undefined || projectId === undefined) {
      return;
    }

    let project = projects.find(project => project.id === projectId);
    if (project) {
      this.projectService.setActiveProject(project);
    } else {
      this.projectService.setActiveProject(null);
    }

    this.isLoading = false;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate([pathNames.auth.login]);
    });
    this.messageService.addMessage({
      type: MessageType.Information,
      translateKey: 'auth.logout'
    });
  }
}
