import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { ApiService } from '../services/api.service';

export const sellerGuard: CanActivateFn = () => {
  const apiService = inject(ApiService);
  const router = inject(Router);

  if (!apiService.getToken()) {
    router.navigateByUrl('/');
    return false;
  }

  return apiService.getCurrentUser().pipe(
    map((res: any) => {
      const role = res?.user?.role;
      const allowed = role === 'seller' || role === 'admin';
      if (!allowed) {
        router.navigateByUrl('/');
      }
      return allowed;
    }),
    catchError(() => {
      router.navigateByUrl('/');
      return of(false);
    })
  );
};
