import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { RegistroComponent } from './registro.component';
import { AuthService } from '../../core/services/auth.service';

describe('RegistroComponent (Jest)', () => {
  let component: RegistroComponent;
  let navigate: jest.SpyInstance;
  const register = jest.fn();

  const setValid = () =>
    component.registroForm.setValue({ username: 'juanito', password: '123456', rol: 'ROLE_PACIENTE' });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});

    TestBed.configureTestingModule({
      imports: [RegistroComponent],
      providers: [
        { provide: AuthService, useValue: { register } },
        provideRouter([]),
      ],
    });
    component = TestBed.createComponent(RegistroComponent).componentInstance;
    navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  });

  it('togglePasswordVisibility() alterna la señal', () => {
    component.togglePasswordVisibility();
    expect(component.isPasswordVisible()).toBe(true);
  });

  it('onSubmit() con form inválido no llama al servicio', () => {
    component.onSubmit();
    expect(register).not.toHaveBeenCalled();
  });

  it('onSubmit() éxito muestra mensaje y navega a /login tras 2s', () => {
    jest.useFakeTimers();
    setValid();
    register.mockReturnValue(of({ id: 1 }));

    component.onSubmit();

    expect(component.successMessage()).toContain('éxito');
    expect(component.isLoading()).toBe(false);
    jest.advanceTimersByTime(2000);
    expect(navigate).toHaveBeenCalledWith(['/login']);
    jest.useRealTimers();
  });

  it('error 400 → usuario en uso', () => {
    setValid();
    register.mockReturnValue(throwError(() => ({ status: 400 })));
    component.onSubmit();
    expect(component.errorMessage()).toContain('en uso');
  });

  it('error status 0 → problema de conexión/CORS', () => {
    setValid();
    register.mockReturnValue(throwError(() => ({ status: 0 })));
    component.onSubmit();
    expect(component.errorMessage()).toContain('conexión');
  });

  it('otro error usa el mensaje del backend', () => {
    setValid();
    register.mockReturnValue(throwError(() => ({ status: 500, error: { mensaje: 'Boom' } })));
    component.onSubmit();
    expect(component.errorMessage()).toBe('Boom');
  });

  it('otro error sin mensaje usa el texto por defecto', () => {
    setValid();
    register.mockReturnValue(throwError(() => ({ status: 500 })));
    component.onSubmit();
    expect(component.errorMessage()).toContain('inesperado');
  });
});
