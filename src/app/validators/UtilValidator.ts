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

// Validator Function
export function compareString(expected: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const isSame = control.value === expected;
        return isSame ? null : { compareString: { expected: expected, given: control.value } };
    };
}

export function currencyValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && !/^-?\d+(\.\d{1,2})?$/.test(value)) {
        return { invalidCurrency: true };
    }
    return null;
}