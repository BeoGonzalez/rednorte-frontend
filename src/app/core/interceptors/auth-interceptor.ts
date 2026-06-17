import { HttpInterceptorFn } from '@angular/common/http';

const PUBLIC_PATHS = ['/auth/register', '/auth/login'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isPublic = PUBLIC_PATHS.some(path => req.url.includes(path));

  if (isPublic) {
    return next(req);
  }

  const token = localStorage.getItem('access_token');

  if (token && req.url.startsWith('/api')) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
