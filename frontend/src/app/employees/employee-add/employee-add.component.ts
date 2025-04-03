import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { lettersOnlyValidator, positiveNumberValidator, notFutureDateValidator } from '../../extraComponents/validators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule
  ],
  styleUrls: ['./employee-add.component.css']
})
export class EmployeeAddComponent implements OnInit {
  employeeForm!: FormGroup;
  errorMessage: string = '';
  formSubmitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      first_name: ['', [Validators.required, lettersOnlyValidator]],
      last_name: ['', [Validators.required, lettersOnlyValidator]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      salary: ['', [Validators.required, positiveNumberValidator]],
      date_of_joining: ['', [Validators.required, notFutureDateValidator]],
      department: ['', Validators.required],
      designation: ['', Validators.required],
    });
  }

employeePhoto: string = '';

onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.employeePhoto = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}

onSubmit(): void {
  this.formSubmitted = true;

  if (this.employeeForm.valid) {
    const formValues = this.employeeForm.value;

    const employeeData = {
      ...formValues,
      employee_photo: this.employeePhoto || null
    };

    this.employeeService.addEmployee(employeeData).subscribe({
      next: () => {
        this.snackBar.open('Employee added successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom', 
          horizontalPosition: 'center', 
          panelClass: ['snackbar-success']
        });

        this.router.navigate(['/employees']);
      },
      error: () => {
        this.snackBar.open('Failed to add employee.', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom', 
          horizontalPosition: 'center', 
          panelClass: ['snackbar-error']
        });

        this.errorMessage = 'Failed to add employee.';
      }
    });
  }
}
  onCancel(): void {
    this.router.navigate(['/employees']);
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }
}
