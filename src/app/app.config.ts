import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// 🔴 Importamos withInterceptors
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 
// 🔴 Importamos la función que acabamos de crear
import { authInterceptor } from './core/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // 🔴 Le pasamos nuestro interceptor al cliente HTTP
    provideHttpClient(withInterceptors([authInterceptor])) 
  ]
};