import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';
import { OnboardingService } from '../../core/services/onboarding.service';

describe('LoginComponent (Jest)', () => {
  let component: LoginComponent;

  const login = jest.fn();
  const getPerfilMedico = jest.fn();
  const getPerfilPaciente = jest.fn();
  const navigate = jest.fn();
  const back = jest.fn();

  const setValidForm = (rol = 'ROLE_PACIENTE') => {
    component.loginForm.setValue({ username: 'juanito', password: '123456' });
    login.mockReturnValue(of({ authId: 5, rol }));
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: { login } },
        { provide: OnboardingService, useValue: { getPerfilMedico, getPerfilPaciente } },
        { provide: Router, useValue: { navigate } },
        { provide: Location, useValue: { back } },
      ],
    });
    component = TestBed.createComponent(LoginComponent).componentInstance;
  });

  it('togglePasswordVisibility() alterna la señal', () => {
    expect(component.isPasswordVisible()).toBe(false);
    component.togglePasswordVisibility();
    expect(component.isPasswordVisible()).toBe(true);
  });

  it('goBack() delega en Location.back()', () => {
    component.goBack();
    expect(back).toHaveBeenCalled();
  });

  it('onSubmit() con formulario inválido no llama al servicio', () => {
    component.onSubmit();
    expect(login).not.toHaveBeenCalled();
  });

  it('paciente con perfil OK → navega a /portal-pacientes', () => {
    setValidForm('ROLE_PACIENTE');
    getPerfilPaciente.mockReturnValue(of({}));

    component.onSubmit();

    expect(getPerfilPaciente).toHaveBeenCalledWith(5);
    expect(navigate).toHaveBeenCalledWith(['/portal-pacientes']);
    expect(component.isLoading()).toBe(false);
  });

  it('médico con perfil OK → navega a /dashboard-medico', () => {
    setValidForm('ROLE_MEDICO');
    getPerfilMedico.mockReturnValue(of({}));

    component.onSubmit();

    expect(getPerfilMedico).toHaveBeenCalledWith(5);
    expect(navigate).toHaveBeenCalledWith(['/dashboard-medico']);
  });

  it('perfil 404 → navega a /onboarding', () => {
    setValidForm('ROLE_PACIENTE');
    getPerfilPaciente.mockReturnValue(throwError(() => ({ status: 404 })));

    component.onSubmit();

    expect(navigate).toHaveBeenCalledWith(['/onboarding']);
  });

  it('perfil con error distinto de 404 → navega al portal igual', () => {
    setValidForm('ROLE_PACIENTE');
    getPerfilPaciente.mockReturnValue(throwError(() => ({ status: 500 })));

    component.onSubmit();

    expect(navigate).toHaveBeenCalledWith(['/portal-pacientes']);
  });

  it('login fallido → muestra alert y apaga loading', () => {
    component.loginForm.setValue({ username: 'juanito', password: '123456' });
    login.mockReturnValue(throwError(() => ({ status: 401 })));

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Credenciales incorrectas');
    expect(component.isLoading()).toBe(false);
  });
});
