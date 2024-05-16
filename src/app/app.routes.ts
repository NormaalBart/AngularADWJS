import { Routes } from '@angular/router'
import { AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { DashboardComponent } from './dashboard/dashboard.component'
import { LoginComponent } from './login/login.component'
import { RegisterComponent } from './register/register.component'
import { setLayout } from './services/page-layout.service'

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: () => redirectUnauthorizedTo(['login']) },
    resolve: { layout: setLayout() }
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: () => redirectLoggedInTo(['dashboard']) },
    resolve: { layout: setLayout() }
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: () => redirectLoggedInTo(['dashboard']) },
    resolve: { layout: setLayout() }
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  }
]
