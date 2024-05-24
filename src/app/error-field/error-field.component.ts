import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  standalone: true,
  selector: 'app-error-field',
  imports: [CommonModule, TranslateModule ],
  templateUrl: './error-field.component.html',
})
export class ErrorFieldComponent {

  @Input() inputField!: AbstractControl<any, any>;
  
}
