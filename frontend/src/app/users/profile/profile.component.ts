import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../authentication/authentication.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      this.errorMessage = 'No user is currently logged in.';
    }
  }
  
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  goBack(): void {
    this.router.navigate(['/employees']);
  }
}
