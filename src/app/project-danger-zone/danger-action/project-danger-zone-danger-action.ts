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
export class DangerActionComponent implements OnInit {

  formBuilder = inject(FormBuilder);
  projectService = inject(ProjectService);

  @Input() title!: string;
  @Input() warning: string | null = null;
  @Input() buttonText!: string;
  @Input() submitForm!: () => Promise<void>;
  @Input() projectName: string = '';
  @Input() inputPlaceholder = 'dangerzone.enter_project_name'

  @Output() dangerForm!: FormGroup;

  showConfirmationInput: boolean = false;
  projectTitleInput: string = '';

  ngOnInit() {
    if (this.projectName === '') {
      throw new Error('Project name is required and must be set.');
    }

    this.dangerForm = this.formBuilder.group({
      projectName: ['', [Validators.required, compareString(this.projectName)]],
    });
  }

  submitFormAction() {
    if (this.dangerForm.invalid) {
      return;
    }

    this.submitForm();
  }
}