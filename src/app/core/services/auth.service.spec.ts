import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const mockRouter = { navigate: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // ─── login ──────────────────────────────────────────────────
  describe('login()', () => {
    it('debería hacer POST a /api/auth/login y guardar token en localStorage', () => {
      // Given
      const credentials = { username: 'juan', password: '1234' };
      const mockResponse = { token: 'jwt-abc', authId: 5, rol: 'ROLE_PACIENTE' };

      // When
      service.login(credentials).subscribe(res => {
        // Then (dentro del tap)
        expect(res.token).toBe('jwt-abc');
      });

      const req = httpMock.expectOne('/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockResponse);

      expect(localStorage.getItem('access_token')).toBe('jwt-abc');
      expect(localStorage.getItem('auth_id')).toBe('5');
      expect(localStorage.getItem('user_rol')).toBe('ROLE_PACIENTE');
    });

    it('debería propagar el error HTTP al caller', () => {
      // Given
      const credentials = { username: 'bad', password: 'bad' };
      let error: any;

      // When
      service.login(credentials).subscribe({ error: e => (error = e) });

      const req = httpMock.expectOne('/api/auth/login');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      // Then
      expect(error).toBeTruthy();
      expect(localStorage.getItem('access_token')).toBeNull();
    });
  });

  // ─── logout ─────────────────────────────────────────────────
  describe('logout()', () => {
    it('debería limpiar localStorage y navegar a /login', () => {
      // Given — simular sesión activa
      localStorage.setItem('access_token', 'tok');
      localStorage.setItem('auth_id', '1');
      localStorage.setItem('user_rol', 'ROLE_PACIENTE');

      // When
      service.logout();

      // Then
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('auth_id')).toBeNull();
      expect(localStorage.getItem('user_rol')).toBeNull();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  // ─── getToken ───────────────────────────────────────────────
  describe('getToken()', () => {
    it('debería retornar el token cuando existe', () => {
      localStorage.setItem('access_token', 'my-token');
      expect(service.getToken()).toBe('my-token');
    });

    it('debería retornar null cuando no hay token', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  // ─── getAuthId ──────────────────────────────────────────────
  describe('getAuthId()', () => {
    it('debería retornar el id como número', () => {
      localStorage.setItem('auth_id', '42');
      expect(service.getAuthId()).toBe(42);
    });

    it('debería retornar null cuando no existe', () => {
      expect(service.getAuthId()).toBeNull();
    });
  });

  // ─── getRol ─────────────────────────────────────────────────
  describe('getRol()', () => {
    it('debería retornar el rol almacenado', () => {
      localStorage.setItem('user_rol', 'ROLE_MEDICO');
      expect(service.getRol()).toBe('ROLE_MEDICO');
    });

    it('debería retornar null cuando no hay rol', () => {
      expect(service.getRol()).toBeNull();
    });
  });

  // ─── isAuthenticated ────────────────────────────────────────
  describe('isAuthenticated()', () => {
    it('debería retornar true con token presente', () => {
      localStorage.setItem('access_token', 'tok');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('debería retornar false sin token', () => {
      expect(service.isAuthenticated()).toBe(false);
    });
  });
});
