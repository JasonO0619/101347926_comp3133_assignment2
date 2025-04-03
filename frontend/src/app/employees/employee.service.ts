import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private GRAPHQL_API = 'http://localhost:8081/graphql'; 

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getAllEmployees(): Observable<any> {
    const query = {
      query: `
        query {
          getAllEmployees {
            id
            first_name
            last_name
            email
            gender
            designation
            salary
            date_of_joining
            department
            employee_photo
            createdAt
            updatedAt
          }
        }
      `,
    };

    return this.http
      .post<any>(this.GRAPHQL_API, query, this.getAuthHeaders())
      .pipe(map((res) => res.data.getAllEmployees));
  }

  getEmployeeById(id: string): Observable<any> {
    const query = {
      query: `
        query {
          getEmployeeById(eid: "${id}") {
            id
            first_name
            last_name
            email
            gender
            designation
            salary
            date_of_joining
            department
            employee_photo
            createdAt
            updatedAt
          }
        }
      `,
    };

    return this.http
      .post<any>(this.GRAPHQL_API, query, this.getAuthHeaders())
      .pipe(map((res) => res.data.getEmployeeById));
  }

  addEmployee(employee: any): Observable<any> {
    const mutation = {
      query: `
        mutation AddEmployee($input: AddEmployeeInput!) {
          addEmployee(input: $input) {
            id
            first_name
          }
        }
      `,
      variables: {
        input: {
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          gender: employee.gender,
          designation: employee.designation,
          salary: parseFloat(employee.salary),
          date_of_joining: employee.date_of_joining,
          department: employee.department,
          employee_photo: employee.employee_photo || ""
        }
      }
    };
  
    return this.http.post<any>(this.GRAPHQL_API, mutation, this.getAuthHeaders());
  }

  updateEmployee(id: string, employee: any): Observable<any> {
    const mutation = {
      query: `
        mutation UpdateEmployee($eid: ID!, $input: UpdateEmployeeInput!) {
          updateEmployeeById(eid: $eid, input: $input) {
            id
          }
        }
      `,
      variables: {
        eid: id,
        input: {
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          gender: employee.gender,
          designation: employee.designation,
          salary: parseFloat(employee.salary),
          date_of_joining: employee.date_of_joining,
          department: employee.department,
          employee_photo: employee.employee_photo || ""
        }
      }
    };
  
    return this.http.post<any>(this.GRAPHQL_API, mutation, this.getAuthHeaders());
  }

  deleteEmployee(id: string): Observable<any> {
    const mutation = {
      query: `
        mutation {
          deleteEmployeeById(eid: "${id}")
        }
      `,
    };

    return this.http.post<any>(this.GRAPHQL_API, mutation, this.getAuthHeaders());
  }

  searchEmployees(department: string, designation: string): Observable<any> {
    const query = {
      query: `
        query {
          getEmployeeByDesignationOrDepartment(
            department: "${department}"
            designation: "${designation}"
          ) {
            id
            first_name
            last_name
            email
            gender
            designation
            salary
            date_of_joining
            department
            employee_photo
          }
        }
      `
    };
  
    return this.http.post<any>(this.GRAPHQL_API, query, this.getAuthHeaders())
      .pipe(map(res => res.data.getEmployeeByDesignationOrDepartment));
  }
}
