import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

import { authInterceptor } from './auth-interceptor';

describe('authInterceptor (Jest)', () => {
  const run = (req: HttpRequest<unknown>, next: HttpHandlerFn) =>
    TestBed.runInInjectionContext(() =>
      (authInterceptor as HttpInterceptorFn)(req, next),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('no agrega header en rutas públicas (login/register)', () => {
    localStorage.setItem('access_token', 'tok');
    const req = new HttpRequest('POST', '/api/auth/login', {});
    const next = jest.fn().mockReturnValue('OK' as any);

    run(req, next as any);

    const passed = next.mock.calls[0][0] as HttpRequest<unknown>;
    expect(passed.headers.has('Authorization')).toBe(false);
  });

  it('agrega Bearer cuando hay token y la url empieza con /api', () => {
    localStorage.setItem('access_token', 'tok');
    const req = new HttpRequest('GET', '/api/pacientes');
    const next = jest.fn().mockReturnValue('OK' as any);

    run(req, next as any);

    const passed = next.mock.calls[0][0] as HttpRequest<unknown>;
    expect(passed.headers.get('Authorization')).toBe('Bearer tok');
  });

  it('no agrega header cuando no hay token', () => {
    const req = new HttpRequest('GET', '/api/pacientes');
    const next = jest.fn().mockReturnValue('OK' as any);

    run(req, next as any);

    const passed = next.mock.calls[0][0] as HttpRequest<unknown>;
    expect(passed.headers.has('Authorization')).toBe(false);
  });
});
