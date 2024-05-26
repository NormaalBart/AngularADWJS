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

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ReactiveFormsModule, CreateProjectComponent, ProjectSidebarComponent, MessageComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  router = inject(Router);
  authService = inject(AuthService);
  projectService = inject(ProjectService);
  activeRoute = inject(ActivatedRoute);

  private projects: Project[] | undefined = undefined;
  private projectId: string | null | undefined = undefined;

  isLoading = true;

  ngOnInit() {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
      this.checkActiveProject();
    });

    if (this.activeRoute.firstChild === null) {
      throw new Error('No child route found');
    }

    this.activeRoute.firstChild.params.subscribe(params => {
      this.projectId = params['projectId'];
      if (this.projectId == undefined) {
        this.projectId = null;
      }
      this.checkActiveProject();
    });
  }

  private checkActiveProject() {
    if (this.projects === undefined || this.projectId === undefined) {
      return;
    }

    let project = this.projects.find(project => project.id === this.projectId);
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
  }
}
