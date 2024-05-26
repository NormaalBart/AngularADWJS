import { Routes } from '@angular/router'
import { AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { DashboardComponent } from './dashboard/dashboard.component'
import { LoginComponent } from './login/login.component'
import { RegisterComponent } from './register/register.component'
import { pathNames } from '../environments/global';
import { ProjectDangerZoneComponent } from './project-danger-zone/project-danger-zone.component';

export const routes: Routes = [
  {
    path: pathNames.auth.login,
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: () => redirectLoggedInTo([pathNames.projects.projects]) },
  },
  {
    path: pathNames.auth.register,
    component: RegisterComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: () => redirectLoggedInTo([pathNames.projects.projects]) },
  },
  {
    path: pathNames.projects.projects,
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: () => redirectUnauthorizedTo([pathNames.auth.login]) },
  },
  {
    path: pathNames.projects.projectOverview(':projectId'),
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: () => redirectUnauthorizedTo([pathNames.auth.login]) },
  },
  {
    path: pathNames.projects.projectDangerZone(':projectId'),
    component: ProjectDangerZoneComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: () => redirectUnauthorizedTo([pathNames.auth.login]) },
  },
  {
    path: '**',
    redirectTo: pathNames.projects.projects,
  }
]
