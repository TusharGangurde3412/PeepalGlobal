import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { ApiService } from '../services/api.service';

export const adminGuard: CanActivateFn = () => {
  const apiService = inject(ApiService);
  const router = inject(Router);

  if (!apiService.getToken()) {
    router.navigateByUrl('/');
    return false;
  }

  return apiService.getCurrentUser().pipe(
    map((res: any) => {
      const isAdmin = res?.user?.role === 'admin';
      if (!isAdmin) {
        router.navigateByUrl('/');
      }
      return isAdmin;
    }),
    catchError(() => {
      router.navigateByUrl('/');
      return of(false);
    })
  );
};
