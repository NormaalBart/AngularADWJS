import { Component, OnInit, Output, inject } from '@angular/core'
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
import { TranslateModule } from '@ngx-translate/core'
import { ErrorFieldComponent } from '../error-field/error-field.component'
import { pathNames } from '../../environments/global'
import { MessageService } from '../services/mesasge.service'
import { MessageType } from '../models/message.interface'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthComponent, LoadingbuttonComponent, TranslateModule, ErrorFieldComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  messageService = inject(MessageService);
  router = inject(Router);

  @Output() loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
      ]
    ]
  });

  login(): Observable<void> {
    return from(new Promise<void>(async (resolve) => {
      if (this.loginForm.invalid) {
        return resolve();
      }

      const { email, password } = this.loginForm.value;
      this.authService.login({ email, password } as LoginInterface).pipe(
        catchError((error) => {
          resolve();
          return [];
        })
      ).subscribe(() => {
        resolve();
        this.router.navigate([pathNames.projects.projects]);
        this.messageService.addMessage({ type: MessageType.Success, translateKey: 'auth.login' });
      });
    }));
  }
}
