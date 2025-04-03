import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { lettersOnlyValidator, positiveNumberValidator, notFutureDateValidator } from '../../extraComponents/validators';
import {ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule
  ],
  styleUrls: ['./employee-edit.component.css']
})
export class EmployeeEditComponent implements OnInit {
  employeeForm!: FormGroup;
  employeeId!: string;
  errorMessage = '';
  employeePhoto: string = ''; 
  formSubmitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id')!;
      this.employeeForm = this.fb.group({
        first_name: ['', [Validators.required, lettersOnlyValidator]],
        last_name: ['', [Validators.required, lettersOnlyValidator]],
        email: ['', [Validators.required, Validators.email]],
        gender: ['', Validators.required],
        salary: ['', [Validators.required, positiveNumberValidator]],
        date_of_joining: ['', [Validators.required, notFutureDateValidator]],
        department: ['', Validators.required],
        designation: ['', Validators.required]
      });
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (emp) => {
        this.employeeForm.patchValue(emp);
      },
      error: () => this.errorMessage = 'Failed to load employee.'
    });

    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (emp) => {
        this.employeePhoto = emp.employee_photo || '';
        this.employeeForm.patchValue(emp);
      },
      error: () => this.errorMessage = 'Failed to load employee.'
    });
  }

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
      const updatedData = {
        ...this.employeeForm.value,
        employee_photo: this.employeePhoto
      };
  
      this.employeeService.updateEmployee(this.employeeId, updatedData).subscribe({
        next: () => {
          this.snackBar.open('Employee updated successfully!', 'Close', {
            duration: 3000,
            verticalPosition: 'bottom', 
            horizontalPosition: 'center', 
            panelClass: ['snackbar-success']
          });
          
          this.router.navigate(['/employees']);
        },
        error: () => this.errorMessage = 'Failed to update employee.'
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
