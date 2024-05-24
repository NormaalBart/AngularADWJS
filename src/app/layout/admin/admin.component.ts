import { Component, Inject, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateProjectComponent } from '../../create-project/create-project.component';
import { Project } from '../../models/project.interface';
import { ProjectSidebarComponent } from '../../project-sidebar/project-sidebar.component';

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ReactiveFormsModule, CreateProjectComponent, ProjectSidebarComponent ],
  templateUrl: './admin.component.html',
})
export class AdminComponent {


  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  logout() {
    this.authService.logout().subscribe(() => {
        this.router.navigate(['/login']);
    });
  }
}
