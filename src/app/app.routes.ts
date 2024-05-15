import { Routes } from '@angular/router'
import { DashboardComponent } from './dashboard/dashboard.component'
import { authGuard } from './guards/auth.guard'
import { LoginComponent } from './login/login.component'
import { RegisterComponent } from './register/register.component'
import { setLayout } from './services/page-layout.service'

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    resolve: { layout: setLayout() }
  },
  {
    path: 'login',
    component: LoginComponent,
    resolve: { layout: setLayout() }
  },
  {
    path: 'register',
    component: RegisterComponent,
    resolve: { layout: setLayout() }
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
    resolve: { layout: setLayout() }
  }
]
