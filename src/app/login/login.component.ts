import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../services/auth.service'
import { Router, RouterLink } from '@angular/router'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { AuthComponent } from '../auth/auth.component'
import { LoadingComponent } from '../loading/loading.component'
import { delay } from 'rxjs'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthComponent, LoadingComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  loading = false

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

  ngOnInit (): void {}

  login () {
    if (this.loginForm.valid) {
      this.loading = true;
      delay(2000);
      const { email, password } = this.loginForm.value
      this.authService.login({ email, password }).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/'])
        },
        error: (warning) => {
          this.loading = false;
          alert('Login mislukt')
        }
      })
    }
  }
}
