import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorFieldComponent } from '../../error-field/error-field.component';
import { Observable, from } from 'rxjs';
import { LoadingbuttonComponent } from '../../loadingbutton/loadingbutton.component';
import { ProjectService } from '../../services/project.service';
import { compareString } from '../../validators/UtilValidator';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-project-danger-zone-collaborators',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, LoadingbuttonComponent, ErrorFieldComponent],
  templateUrl: './collaborators.html',
})
export class CollaboratorsComponent implements OnInit{

  formBuilder = inject(FormBuilder);
  projectService = inject(ProjectService);
  authService = inject(AuthService);
  userService = inject(UserService);

  currentProject$ = this.projectService.activeProject$;

  users$ = this.userService.users$;

  @Output() dangerForm = this.formBuilder.group({
    projectName: ['', [Validators.required]],
  });

  ngOnInit() {
    this.projectService.activeProject$.subscribe(project => {
      this.dangerForm.get('projectName')?.setValidators([Validators.required, compareString(project?.name ?? '')]);
    });
  }

}