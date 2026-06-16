import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
// 🟢 Ya no necesitas importar DoctorDirectoryComponent aquí arriba

export const routes: Routes = [
  { path: '', loadComponent: () => import('./containers/landing-page/landing-page.component').then(m => m.LandingPageComponent) },
  { path: 'login', loadComponent: () => import('./containers/login/login.component').then(m => m.LoginComponent) },
  { path: 'registro', loadComponent: () => import('./containers/registro/registro.component').then(m => m.RegistroComponent) },
  { 
    path: 'portal-pacientes', 
    loadComponent: () => import('./containers/patient-portal/patient-portal.component').then(m => m.PatientPortalComponent), 
    canActivate: [authGuard] 
  },
  { 
    path: 'dashboard-medico', 
    loadComponent: () => import('./containers/dashboard-container/dashboard-container.component').then(m => m.DashboardContainerComponent), 
    canActivate: [authGuard] 
  },
  { 
    path: 'directorio-medico', 
    // 🟢 1. Carga perezosa (Lazy Loading)
    loadComponent: () => import('./containers/doctor-directory/doctor-directory.component').then(m => m.DoctorDirectoryComponent),
    // 🟢 2. Protección con JWT
    canActivate: [authGuard] 
  },
  { path: '**', redirectTo: '' }
];