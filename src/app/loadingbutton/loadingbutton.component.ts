import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loadingbutton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loadingbutton.component.html',
  styleUrls: ['./loadingbutton.component.css']
})
export class LoadingbuttonComponent implements OnInit {

  @Input() buttonText: string = 'Opslaan';
  @Input() loadingText: string = 'Laden';
  @Input() form!: FormGroup;
  @Input() submitForm!: () => Observable<void>;

  isLoading: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (!this.form) {
      throw new Error('Form is verplicht en moet worden ingesteld.');
    }
    if (!this.submitForm) {
      throw new Error('submitForm methode is verplicht en moet worden ingesteld.');
    }
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.setFormInputsDisabled(true);

    this.submitForm().subscribe(() => {
      console.log('submitForm done')
      this.isLoading = false;
      this.setFormInputsDisabled(false);
    });
  }

  private setFormInputsDisabled(disabled: boolean) {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (disabled) {
        control?.disable();
      } else {
        control?.enable();
      }
    });
  }
}
