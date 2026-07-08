import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { LandingPageComponent } from './landing-page.component';

describe('LandingPageComponent (Jest)', () => {
  let component: LandingPageComponent;
  const navigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [LandingPageComponent],
      providers: [{ provide: Router, useValue: { navigate } }],
    });
    component = TestBed.createComponent(LandingPageComponent).componentInstance;
  });

  it('expone opciones de menú y estadísticas', () => {
    component.ngOnInit();
    expect(component.menuOptions().length).toBeGreaterThan(0);
    expect(component.dashboardStats().hospitalesConectados).toBe(18);
  });

  it('handleNavigation() navega a la ruta indicada', () => {
    component.handleNavigation('/pacientes');
    expect(navigate).toHaveBeenCalledWith(['/pacientes']);
  });

  it('handleLogin() navega a /login', () => {
    component.handleLogin();
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });

  it('handleRegister() navega a /registro', () => {
    component.handleRegister();
    expect(navigate).toHaveBeenCalledWith(['/registro']);
  });
});
