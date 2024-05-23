import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from '../auth/auth.component';
import { LoadingbuttonComponent } from '../loadingbutton/loadingbutton.component';
import { Observable, catchError, from } from 'rxjs';
import { RegisterInterface } from '../models/register.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthComponent, LoadingbuttonComponent],
  templateUrl: './register.component.html',
})
export class RegisterComponent  {
  @Output() registerForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      displayName: ['', Validators.required, Validators.minLength(3)],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')
      ]]
    });
  }

  register() : Observable<void>{
    return from(new Promise<void>(async (resolve) => {
      if (this.registerForm.invalid) {
        return resolve();
      }

      const { email, password, displayName } = this.registerForm.value;
      this.authService
        .register({ email, password, displayName } as RegisterInterface).pipe(
          catchError((error) => {
            resolve();
            return [];
          })
        ).subscribe(() => {
          resolve();
          this.router.navigate(['/']);
        });

    }));
  }
}
