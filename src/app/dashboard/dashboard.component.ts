import { Component, OnInit, Output } from '@angular/core';
import { Project } from '../models/project.interface';
import { ProjectService } from '../services/project.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, CreateProjectComponent ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  activeProject: Project | null = null;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.projectService.activeProject.subscribe(project => {
      this.activeProject = project;
    });
  }

}
