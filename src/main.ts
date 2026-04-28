import { bootstrapApplication } from '@angular/platform-browser';
// 1. Cambiamos App por AppComponent
import { AppComponent } from './app/app'; 
// 2. Importamos las rutas (si es que tu main.ts las maneja directamente aquí o usa un app.config)
import { appConfig } from './app/app.config'; 

// 3. Inicializamos usando AppComponent
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));