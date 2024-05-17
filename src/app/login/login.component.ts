import { Component, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../services/auth.service'
import { Router, RouterLink } from '@angular/router'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { AuthComponent } from '../auth/auth.component'
import { Observable, delay, from } from 'rxjs'
import { LoadingbuttonComponent } from '../loadingbutton/loadingbutton.component'
import { LoginInterface } from '../models/login.interface'
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthComponent, LoadingbuttonComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  @Output() loginForm: FormGroup

  constructor (
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
        ]
      ]
    })
  }

  login(): Observable<void> {
    return from(new Promise<void>(async (resolve) => {
      if (this.loginForm.invalid) {
        return resolve();
      }

      const { email, password } = this.loginForm.value;
      this.authService.login({ email, password } as LoginInterface).pipe(
        catchError((error) => {
          resolve()
          return [];
        })
      ).subscribe(() => {
        this.router.navigate(['/']);
        resolve();
      });
    }));
  }
}
