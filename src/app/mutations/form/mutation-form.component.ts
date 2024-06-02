import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MutationService } from '../../services/mutations.service';
import { Mutation } from '../../models/mutation.interface';
import { CommonModule } from '@angular/common';
import { ErrorFieldComponent } from '../../error-field/error-field.component';
import { currencyValidator } from '../../validators/UtilValidator';
import { Timestamp } from '@angular/fire/firestore';
import { LoadingbuttonComponent } from '../../loadingbutton/loadingbutton.component';
import { DangerActionComponent } from '../../project-danger-zone/danger-action/project-danger-zone-danger-action';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-mutation-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ErrorFieldComponent, LoadingbuttonComponent, DangerActionComponent, TranslateModule],
    templateUrl: './mutation-form.component.html',
})
export class MutationFormComponent implements OnChanges {
    private mutationService = inject(MutationService);
    private formBuilder = inject(FormBuilder);

    @Input() selectedMutation: Mutation | undefined;
    @Input() projectId!: string;
    @Output() showModalChange = new EventEmitter<Mutation | undefined>();

    mutationForm = this.formBuilder.group({
        title: ['', [Validators.required]],
        amount: ['', [Validators.required, currencyValidator]],
        date: ['', [Validators.required]],
        person: ['', [Validators.required]]
    });


    ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedMutation']) {
            if (this.selectedMutation) {
                this.mutationForm.patchValue({
                    title: this.selectedMutation.title,
                    amount: this.selectedMutation.amount.toString(),
                    date: this.selectedMutation.date.toDate().toISOString().split('T')[0],
                    person: this.selectedMutation.person
                });
            } else {
                this.mutationForm.reset({
                    title: '',
                    amount: '',
                    date: new Date().toISOString().split('T')[0],
                    person: ''
                });
            }
        }
    }

    submitForm(): Promise<void> {
        const formValue = this.mutationForm.value;
        const mutation: Mutation = {
            title: formValue.title!,
            person: formValue.person!,
            amount: parseFloat(formValue.amount!),
            date: Timestamp.fromDate(new Date(formValue.date!)),
            projectId: this.projectId
        };

        if (this.selectedMutation!.id) {
            return this.mutationService.updateMutation(this.selectedMutation!.id!, mutation).then(() => {
                this.showModalChange.emit(undefined);
                this.mutationForm.reset();
            });
        } else {
            return this.mutationService.addMutation(mutation).then(() => {
                this.showModalChange.emit(undefined);
                this.mutationForm.reset();
            });
        }
    }

    deleteMutation(): Promise<void> {
        return this.mutationService.deleteMutation(this.selectedMutation!.id!).then(() => {
            this.showModalChange.emit(undefined);
            this.mutationForm.reset();
        });
    }

    closeModal(event?: MouseEvent) {
        if (!event || event.target === event.currentTarget) {
            this.showModalChange.emit(undefined);
            this.mutationForm.reset();
        }
    }

    preventModalClose(event: MouseEvent) {
        event.stopPropagation();
    }
}
