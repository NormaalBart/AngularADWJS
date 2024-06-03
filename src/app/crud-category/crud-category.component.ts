import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorFieldComponent } from '../error-field/error-field.component';
import { MessageService } from '../services/mesasge.service';
import { AuthService } from '../services/auth.service';
import { ModalComponent } from '../modal/modal.component';
import { CategoryService } from '../services/categories.service';
import { Category } from '../models/category.interface';
import { Timestamp } from '@angular/fire/firestore';
import { currencyValidator } from '../validators/UtilValidator';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crud-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, ErrorFieldComponent, ModalComponent],
  templateUrl: './crud-category.component.html',
})
export class CrudCategoryComponent implements OnChanges {

  formBuilder = inject(FormBuilder);
  messageservice = inject(MessageService);
  categoryService = inject(CategoryService);
  authService = inject(AuthService);
  router = inject(Router);

  @Input() selectedCategory: Category | undefined;
  @Input() projectId!: string;
  @Output() showModalChange = new EventEmitter<Category | undefined>();

  categoryForm = this.formBuilder.group({
    categoryName: ['', [Validators.required, Validators.minLength(3)]],
    maxBudget: ['', [Validators.required, currencyValidator]],
    endDate: [''],
  });


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCategory']) {
      if (this.selectedCategory) {
        this.categoryForm.patchValue({
          categoryName: this.selectedCategory.name,
          maxBudget: this.selectedCategory.maxBudget.toString(),
          endDate: this.selectedCategory.endDate?.toDate().toISOString().split('T')[0],
        });
      } else {
        this.categoryForm.reset({
          categoryName: '',
          maxBudget: '',
          endDate: ''
        });
      }
    }
  }

  closeModal(event?: MouseEvent) {
    if (!event || event.target === event.currentTarget) {
      this.showModalChange.emit(undefined);
      this.categoryForm.reset({
        categoryName: '',
        maxBudget: '',
        endDate: ''
      });
    }
  }

  preventModalClose(event: MouseEvent) {
    event.stopPropagation();
  }

  submitForm(): Promise<void> {
    if (this.categoryForm.invalid) {
      return Promise.resolve();
    }
    const formValue = this.categoryForm.value;
    const category: Category = {
      id: this.selectedCategory!.id,
      name: formValue.categoryName!,
      projectId: this.projectId,
      maxBudget: parseFloat(formValue.maxBudget ? formValue.maxBudget : '0'),
      endDate: formValue.endDate ? Timestamp.fromDate(new Date(formValue.endDate!)) : null,
    };

    if (this.selectedCategory!.id) {
      return this.categoryService.updateCategory(category).then(() => {
        this.closeModal();
      });
    } else {
      return this.categoryService.addCategory(category).then(() => {
        this.closeModal()
      });
    }
  }

  deleteCategory(): Promise<void> {
    return this.categoryService.deleteCategory(this.selectedCategory!).then(() => {
      this.closeModal();
    });
  }
}
