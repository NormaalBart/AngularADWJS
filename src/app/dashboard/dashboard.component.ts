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

  activeProject: Project | null | undefined;

  ngOnInit() {
    this.projectService.activeProject.subscribe(project => {
      this.activeProject = project;
    });
  }
}
