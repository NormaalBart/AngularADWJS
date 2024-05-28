import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorFieldComponent } from '../../error-field/error-field.component';
import { Observable, from } from 'rxjs';
import { LoadingbuttonComponent } from '../../loadingbutton/loadingbutton.component';
import { ProjectService } from '../../services/project.service';
import { compareString } from '../../validators/UtilValidator';

@Component({
  selector: 'app-project-danger-zone-danger-action',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, LoadingbuttonComponent, ErrorFieldComponent],
  templateUrl: './project-danger-zone-danger-action.html',
})
export class DangerActionComponent implements OnInit{

  formBuilder = inject(FormBuilder);
  projectService = inject(ProjectService);

  @Input() title!: string;
  @Input() warning: string | null = null;
  @Input() buttonText!: string;
  @Input() submitForm!: () => Observable<void>;

  @Output() dangerForm = this.formBuilder.group({
    projectName: ['', [Validators.required]],
  });

  showConfirmationInput: boolean = false;
  projectTitleInput: string = '';

  ngOnInit() {
    this.projectService.activeProject$.subscribe(project => {
      this.dangerForm.get('projectName')?.setValidators([Validators.required, compareString(project?.name ?? '')]);
    });
  }

  submitFormAction() {
    if (this.dangerForm.invalid) {
      return;
    }

    this.submitForm();
  }
}