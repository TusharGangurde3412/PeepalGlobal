import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Peepal Export';
  isLoggedIn = false;
  isAdmin = false;

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
    this.router.navigateByUrl('/');
  }

  private refreshAuthState(): void {
    this.isLoggedIn = this.apiService.isLoggedIn();
    const user = this.apiService.getUser();
    this.isAdmin = Boolean(user?.role === 'admin');
  }
}
