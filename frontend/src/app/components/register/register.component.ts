import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' // default to buyer
  };

  submitting = false;
  error = '';
  success = '';

  constructor(private apiService: ApiService, private router: Router) {}

  submit(): void {
    this.error = '';
    this.success = '';

    // Validation
    if (!this.form.firstName.trim()) {
      this.error = 'First name is required';
      return;
    }

    if (!this.form.lastName.trim()) {
      this.error = 'Last name is required';
      return;
    }

    if (!this.form.email.trim()) {
      this.error = 'Email is required';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.form.email)) {
      this.error = 'Please enter a valid email address';
      return;
    }

    if (!this.form.password) {
      this.error = 'Password is required';
      return;
    }

    if (this.form.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    if (this.form.password !== this.form.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.submitting = true;

    const registerData = {
      firstName: this.form.firstName,
      lastName: this.form.lastName,
      email: this.form.email,
      password: this.form.password,
      role: this.form.role
    };

    this.apiService.register(registerData).subscribe({
      next: (res: { token: string; user: any }) => {
        this.apiService.setToken(res.token);
        this.apiService.setUser(res.user);
        this.submitting = false;
        this.success = 'Registration successful! Redirecting...';

        setTimeout(() => {
          if (res.user?.role === 'seller') {
            this.router.navigateByUrl('/seller');
          } else {
            this.router.navigateByUrl('/');
          }
        }, 1500);
      },
      error: (err: { error?: { error?: string } }) => {
        this.submitting = false;
        this.error = err?.error?.error || 'Registration failed. Please try again.';
      }
    });
  }

  getRoleLabel(): string {
    return this.form.role === 'seller' ? 'Seller' : 'Buyer';
  }
}
