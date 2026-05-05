import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./containers/landing-page/landing-page.component').then(m => m.LandingPageComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./containers/login/login.component').then(m => m.LoginComponent)
  },
  // Comentamos la ruta de registro hasta que creemos los archivos físicos
  /*
  {
    path: 'registro',
    loadComponent: () => import('./containers/registro/registro.component').then(m => m.RegistroComponent)
  },
  */
  { 
    path: '**', 
    redirectTo: '' 
  }
];