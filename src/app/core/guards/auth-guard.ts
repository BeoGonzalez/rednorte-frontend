import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Revisamos si el token está guardado en el navegador
  const token = localStorage.getItem('access_token');

  if (token) {
    return true; // El usuario tiene token, lo dejamos pasar
  } else {
    // No hay token, lo mandamos al login
    router.navigate(['/login']);
    return false;
  }
};