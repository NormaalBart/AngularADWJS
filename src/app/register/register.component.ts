import { Component, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from '../auth/auth.component';
import { LoadingbuttonComponent } from '../loadingbutton/loadingbutton.component';
import { Observable, catchError, from } from 'rxjs';
import { RegisterInterface } from '../models/register.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ErrorFieldComponent } from '../error-field/error-field.component';
import { containsDigit, containsUppercase } from '../validators/UtilValidator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthComponent, LoadingbuttonComponent, TranslateModule, ErrorFieldComponent],
  templateUrl: './register.component.html',
})
export class RegisterComponent  {
  @Output() registerForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {
    this.registerForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        containsUppercase(),
        containsDigit(),
        Validators.required,
        Validators.minLength(8),
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