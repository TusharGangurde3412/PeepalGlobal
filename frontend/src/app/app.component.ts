import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ApiService } from './services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Peepal Export';
  isLoggedIn = false;
  isAdmin = false;
  isSeller = false;
  showAdminLoginModal = false;
  loginTarget: 'admin' | 'seller' = 'admin';
  adminLoginSubmitting = false;
  adminLoginError = '';
  adminLoginForm = {
    email: '',
    password: ''
  };

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.refreshAuthState();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.refreshAuthState());
  }

  logout(): void {
    this.apiService.clearToken();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.isSeller = false;
    this.router.navigateByUrl('/');
  }

  openAdminLoginModal(target: 'admin' | 'seller' = 'admin'): void {
    this.adminLoginError = '';
    this.loginTarget = target;
    this.showAdminLoginModal = true;
  }

  closeAdminLoginModal(): void {
    this.showAdminLoginModal = false;
    this.adminLoginSubmitting = false;
    this.adminLoginError = '';
    this.adminLoginForm.password = '';
  }

  goToAdmin(): void {
    if (this.isAdmin) {
      this.router.navigateByUrl('/admin');
      return;
    }
    this.openAdminLoginModal('admin');
  }

  goToSeller(): void {
    if (this.isSeller || this.isAdmin) {
      this.router.navigateByUrl('/seller');
      return;
    }
    this.openAdminLoginModal('seller');
  }

  submitAdminLogin(): void {
    this.adminLoginError = '';
    this.adminLoginSubmitting = true;

    this.apiService.login(this.adminLoginForm).subscribe({
      next: (res: { token: string; user: any }) => {
        this.apiService.setToken(res.token);
        this.apiService.setUser(res.user);
        this.refreshAuthState();

        const hasAccess = this.loginTarget === 'admin'
          ? this.isAdmin
          : (this.isSeller || this.isAdmin);

        if (!hasAccess) {
          this.adminLoginSubmitting = false;
          this.adminLoginError = this.loginTarget === 'admin'
            ? 'This account does not have admin access.'
            : 'This account does not have seller access.';
          return;
        }

        this.closeAdminLoginModal();
        this.router.navigateByUrl(this.loginTarget === 'admin' ? '/admin' : '/seller');
      },
      error: (err: { error?: { error?: string } }) => {
        this.adminLoginSubmitting = false;
        this.adminLoginError = err?.error?.error || 'Login failed. Please check your credentials.';
      }
    });
  }

  private refreshAuthState(): void {
    this.isLoggedIn = this.apiService.isLoggedIn();
    const user = this.apiService.getUser();
    this.isAdmin = Boolean(user?.role === 'admin');
    this.isSeller = Boolean(user?.role === 'seller');

    // If token exists but local user is missing/stale, refresh from backend.
    if (this.isLoggedIn && !user?.role) {
      this.apiService.getCurrentUser().subscribe({
        next: (res: { user?: { role?: string } }) => {
          if (res?.user) {
            this.apiService.setUser(res.user);
            this.isAdmin = res.user.role === 'admin';
            this.isSeller = res.user.role === 'seller';
          }
        },
        error: () => {
          this.isAdmin = false;
          this.isSeller = false;
        }
      });
    }
  }
}
