import { TestBed } from '@angular/core/testing';

import { LandingUiComponent } from './landing-ui.component';

describe('LandingUiComponent (Jest)', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [LandingUiComponent] }));

  it('expone features y steps, y emite sus eventos', () => {
    const fixture = TestBed.createComponent(LandingUiComponent);
    const component = fixture.componentInstance;

    expect(component.features().length).toBe(3);
    expect(component.steps().length).toBe(3);

    const nav = jest.fn();
    const login = jest.fn();
    const register = jest.fn();
    component.navClick.subscribe(nav);
    component.loginClick.subscribe(login);
    component.registerClick.subscribe(register);

    component.navClick.emit('/pacientes');
    component.loginClick.emit();
    component.registerClick.emit();

    expect(nav).toHaveBeenCalledWith('/pacientes');
    expect(login).toHaveBeenCalled();
    expect(register).toHaveBeenCalled();
  });
});
