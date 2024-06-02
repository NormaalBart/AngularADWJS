import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorFieldComponent } from '../error-field/error-field.component';
import { LoadingbuttonComponent } from '../loadingbutton/loadingbutton.component';
import { DangerActionComponent } from '../project-danger-zone/danger-action/project-danger-zone-danger-action';
import { compareString } from '../validators/UtilValidator';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, ErrorFieldComponent, LoadingbuttonComponent, DangerActionComponent],
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnInit {

  private formBuilder = inject(FormBuilder);

  @Input() title!: string;
  @Input() form!: FormGroup;
  @Input() showModal!: boolean;
  @Input() submitFunction!: () => Promise<void>;
  @Input() deleteFunction!: (() => Promise<void>) | undefined;
  @Input() deleteConfirm: string | undefined = undefined;
  @Input() deletePlaceholder: string | undefined = undefined;

  @Output() showModalChange = new EventEmitter<boolean>();

  deleteForm!: FormGroup | undefined;
  showDelete = false;

  ngOnInit(): void {
    if (this.title === undefined) {
      throw new Error('No title provided');
    }
    if (this.form === undefined) {
      throw new Error('No form provided');
    }

    if (this.showModal === undefined) {
      throw new Error('No showModal provided');
    }

    if (this.showModalChange === undefined) {
      throw new Error('No showModalChange provided');
    }

    if (this.submitFunction === undefined) {
      throw new Error('No submitFunction provided');
    }

    if (this.deleteConfirm && this.deleteFunction && this.deletePlaceholder) {
      this.deleteForm = this.formBuilder.group({
        name: ['', [Validators.required, compareString(this.deleteConfirm)]],
      });
    }
  }

  closeModal(event?: MouseEvent) {
    if (!event || event.target === event.currentTarget) {
      this.showModalChange.emit(false);
      this.showModal = false;
      this.form.reset();
    }
  }

  preventModalClose(event: MouseEvent) {
    event.stopPropagation();
  }
}
