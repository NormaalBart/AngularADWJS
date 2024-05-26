import { Component, OnInit, inject } from '@angular/core';
import { Project } from '../models/project.interface';
import { ProjectService } from '../services/project.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, CreateProjectComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  projectService = inject(ProjectService);
  activeRoute = inject(ActivatedRoute);

  activeProject: Project | null = null;

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      const projectId = params['projectId'];
      if (projectId) {
        this.projectService.getProjects().pipe(first()).subscribe(projects => {
          const project = projects.find(p => p.id === projectId);
          if (project) {
            this.projectService.setActiveProject(project);
          }
        });
      }
    });

    this.projectService.activeProject.subscribe(project => {
      this.activeProject = project;
    });
  }
}
