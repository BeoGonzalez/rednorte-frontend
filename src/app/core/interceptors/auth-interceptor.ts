import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('jwt_token');

  // 🔴 REGLA DE ORO: Si la ruta tiene '/auth/', déjala pasar sin token
  if (req.url.includes('/auth/')) {
    return next(req);
  }

  // Para el resto de rutas (como el dashboard), sí pegamos el token
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};