import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtenemos el token almacenado tras el login
  const token = localStorage.getItem('access_token');

  // Si existe el token y la petición va hacia nuestra API, lo inyectamos
  if (token && req.url.startsWith('/api')) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // Si no hay token, la petición pasa directamente
  return next(req);
};