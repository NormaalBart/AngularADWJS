import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../services/auth.service'
import { Router, RouterLink } from '@angular/router'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { AuthComponent } from '../auth/auth.component'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup

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
      const { email, password } = this.loginForm.value
      this.authService.login({ email, password }).subscribe({
        next: () => {
          this.router.navigate(['/'])
        },
        error: (warning) => {
          alert('Login mislukt')
        }
      })
    }
  }
}
