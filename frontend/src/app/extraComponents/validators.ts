import { AbstractControl, ValidationErrors } from '@angular/forms';

export function lettersOnlyValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  const regex = /^[A-Za-z\s]+$/;
  return value && !regex.test(value) ? { lettersOnly: true } : null;
}

export function positiveNumberValidator(control: AbstractControl): ValidationErrors | null {
  const value = parseFloat(control.value);
  return isNaN(value) || value < 1000 ? { positiveNumber: true } : null;
}

export function notFutureDateValidator(control: AbstractControl): ValidationErrors | null {
    const inputDate = new Date(control.value);
    const today = new Date();
  
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
  
    return inputDate > today ? { futureDate: true } : null;
  }