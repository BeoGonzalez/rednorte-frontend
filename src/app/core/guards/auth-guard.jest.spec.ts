import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { authGuard } from './auth-guard';

describe('authGuard (Jest)', () => {
  const navigate = jest.fn();

  const run: CanActivateFn = (...args) =>
    TestBed.runInInjectionContext(() => authGuard(...args));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: { navigate } }],
    });
    localStorage.clear();
    navigate.mockClear();
  });

  afterEach(() => localStorage.clear());

  it('permite el acceso cuando hay token', () => {
    localStorage.setItem('access_token', 'tok');
    expect(run({} as any, {} as any)).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('redirige a /login y bloquea cuando no hay token', () => {
    expect(run({} as any, {} as any)).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
