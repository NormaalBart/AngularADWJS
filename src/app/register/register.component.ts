import { Component, OnInit, Output, inject } from '@angular/core';
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
import { pathNames } from '../../environments/global';
import { MessageType } from '../models/message.interface';
import { MessageService } from '../services/mesasge.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthComponent, LoadingbuttonComponent, TranslateModule, ErrorFieldComponent],
  templateUrl: './register.component.html',
})
export class RegisterComponent {

  formBuilder = inject(FormBuilder);
  messageService = inject(MessageService);
  authService = inject(AuthService);
  router = inject(Router);

  @Output() registerForm = this.formBuilder.group({
    displayName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      containsUppercase(),
      containsDigit(),
      Validators.required,
      Validators.minLength(8),
    ]]
  });

  register(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      if (this.registerForm.invalid) {
        return resolve();
      }

      const { email, password, displayName } = this.registerForm.value;
      this.authService
        .register({ email, password, displayName } as RegisterInterface).pipe(
          catchError((error) => {
            console.error('Register error', error);
            resolve();
            return [];
          })
        ).subscribe(() => {
          this.router.navigate([pathNames.projects.projects]);
          this.messageService.addMessage({ type: MessageType.Success, translateKey: 'auth.register' });
          resolve();
        });

    });
  }
}