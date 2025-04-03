import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private GRAPHQL_API = 'http://localhost:8081/graphql'; 

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const query = {
      query: `
        mutation {
          login(email: "${email}", password: "${password}") {
            token
            user {
              id
              username
              email
            }
          }
        }
      `,
    };

    return this.http.post<any>(this.GRAPHQL_API, query).pipe(
      map((res) => {
        localStorage.setItem('token', res.data.login.token);
        return res.data.login;
      })
    );
  }

  signup(username: string, email: string, password: string): Observable<any> {
    const query = {
      query: `
        mutation {
          signup(username: "${username}", email: "${email}", password: "${password}") {
            id
            username
            email
          }
        }
      `,
    };
  
    return this.http.post<any>(this.GRAPHQL_API, query).pipe(
      map((res) => {
        return res.data.signup;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
