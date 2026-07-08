import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

/**
 * Suite ejecutada con Jest (jest-preset-angular, zoneless).
 * Convención: *.jest.spec.ts → Jest; *.spec.ts → Karma + Jasmine.
 */
describe('AuthService (Jest)', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const navigate = jest.fn();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: { navigate } },
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
    navigate.mockClear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('login()', () => {
    it('guarda token, authId y rol cuando la respuesta trae token', () => {
      service.login({ username: 'juan', password: '123456' }).subscribe();
      const req = httpMock.expectOne('/api/auth/login');
      expect(req.request.method).toBe('POST');
      req.flush({ token: 'jwt', authId: 5, rol: 'ROLE_PACIENTE' });

      expect(localStorage.getItem('access_token')).toBe('jwt');
      expect(localStorage.getItem('auth_id')).toBe('5');
      expect(localStorage.getItem('user_rol')).toBe('ROLE_PACIENTE');
    });

    it('no guarda nada si la respuesta no trae token', () => {
      service.login({ username: 'x', password: 'y' }).subscribe();
      const req = httpMock.expectOne('/api/auth/login');
      req.flush({ token: '', authId: 1, rol: 'ROLE_PACIENTE' });

      expect(localStorage.getItem('access_token')).toBeNull();
    });

    it('propaga el error HTTP', () => {
      const onError = jest.fn();
      service.login({ username: 'bad', password: 'bad' }).subscribe({ error: onError });
      httpMock.expectOne('/api/auth/login').flush('nope', { status: 401, statusText: 'Unauthorized' });
      expect(onError).toHaveBeenCalled();
    });
  });

  describe('register()', () => {
    it('hace POST a /api/auth/register', () => {
      service.register({ username: 'a', password: 'bbbbbb', rol: 'ROLE_PACIENTE' } as any).subscribe();
      const req = httpMock.expectOne('/api/auth/register');
      expect(req.request.method).toBe('POST');
      req.flush({ id: 1 });
    });
  });

  describe('logout()', () => {
    it('limpia el storage y navega a /login', () => {
      localStorage.setItem('access_token', 't');
      localStorage.setItem('auth_id', '1');
      localStorage.setItem('user_rol', 'ROLE_PACIENTE');

      service.logout();

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('auth_id')).toBeNull();
      expect(localStorage.getItem('user_rol')).toBeNull();
      expect(navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('getters', () => {
    it('getToken() devuelve el token o null', () => {
      expect(service.getToken()).toBeNull();
      localStorage.setItem('access_token', 'tk');
      expect(service.getToken()).toBe('tk');
    });

    it('getAuthId() parsea a número o null', () => {
      expect(service.getAuthId()).toBeNull();
      localStorage.setItem('auth_id', '42');
      expect(service.getAuthId()).toBe(42);
    });

    it('getRol() devuelve el rol o null', () => {
      expect(service.getRol()).toBeNull();
      localStorage.setItem('user_rol', 'ROLE_MEDICO');
      expect(service.getRol()).toBe('ROLE_MEDICO');
    });

    it('isAuthenticated() refleja la presencia del token', () => {
      expect(service.isAuthenticated()).toBe(false);
      localStorage.setItem('access_token', 'x');
      expect(service.isAuthenticated()).toBe(true);
    });
  });
});
