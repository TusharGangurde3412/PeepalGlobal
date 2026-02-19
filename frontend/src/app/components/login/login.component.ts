import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form = {
    email: '',
    password: ''
  };

  submitting = false;
  error = '';

  constructor(private apiService: ApiService, private router: Router) {}

  submit(): void {
    this.error = '';
    this.submitting = true;

    this.apiService.login(this.form).subscribe({
      next: (res: { token: string; user: any }) => {
        this.apiService.setToken(res.token);
        this.apiService.setUser(res.user);
        this.submitting = false;

        if (res.user?.role === 'admin') {
          this.router.navigateByUrl('/admin');
          return;
        }

        this.router.navigateByUrl('/');
      },
      error: (err: { error?: { error?: string } }) => {
        this.submitting = false;
        this.error = err?.error?.error || 'Login failed. Please check your credentials.';
      }
    });
  }
}
