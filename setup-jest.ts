// Inicializa el entorno de TestBed de Angular para Jest en modo zoneless
// (este proyecto no usa zone.js).
import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';

setupZonelessTestEnv();
