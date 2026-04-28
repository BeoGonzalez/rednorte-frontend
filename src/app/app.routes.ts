import { Routes } from '@angular/router';

// IMPORTAMOS EL SMART COMPONENT (EL CONTAINER), NO EL UI.
// Asegúrate de que la ruta sea la correcta hacia tu carpeta containers
import { LandingPageComponent } from './containers/landing-page/landing-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  // ... resto de tus rutas
];