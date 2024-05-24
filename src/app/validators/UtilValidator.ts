import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function containsUppercase(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const hasUppercase = /[A-Z]/.test(control.value);
        return hasUppercase ? null : { noUppercase: true };
    };
}

export function containsDigit(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const hasDigit = /\d/.test(control.value);
        return hasDigit ? null : { noDigit: true };
    };
}