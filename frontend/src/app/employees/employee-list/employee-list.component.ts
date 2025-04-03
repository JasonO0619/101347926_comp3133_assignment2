import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  errorMessage: string = '';
  searchDepartment: string = '';
  searchDesignation: string = '';
  isLoading: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  viewEmployee(id: string): void {
    this.router.navigate([`/employees/${id}`]);
  }

  editEmployee(id: string): void {
    this.router.navigate([`/employees/edit/${id}`]);
  }

  deleteEmployee(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => this.fetchEmployees(),
        error: () => alert('Failed to delete employee.')
      });
    }
  }

  addEmployee(): void {
    this.router.navigate(['/employees/add']);
  }

  onSearch(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.employees = [];
  
    this.employeeService.searchEmployees(this.searchDepartment, this.searchDesignation)
      .subscribe({
        next: (res) => {
          setTimeout(() => {
            this.isLoading = false;
            this.employees = res.filter((emp:any) => emp !== null && emp !== undefined);
  
            if (this.employees.length === 0) {
              this.errorMessage = 'No employees found for the selected search criteria.';
            }
          }, 1000);
        },
        error: (err) => {
          setTimeout(() => {
            this.isLoading = false;
            this.errorMessage = 'Error fetching employees.';
          }, 2500);
        }
      });
  }
  
  fetchEmployees(): void {
    this.isLoading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data.filter((emp: any) => emp !== null && emp !== undefined);
        this.errorMessage = '';
        this.isLoading = false;
      },
      error: () => {
        this.employees = [];
        this.errorMessage = 'Unable to load employees.';
        this.isLoading = false;
      }
    });
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
