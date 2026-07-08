import { TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';

describe('ButtonComponent (Jest)', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [ButtonComponent] }));

  it('usa variant "primary" por defecto', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    expect(fixture.componentInstance.variant()).toBe('primary');
    expect(fixture.componentInstance.iconClass()).toBe('material-icons');
  });

  it('respeta los inputs y emite onClick', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.componentRef.setInput('variant', 'ghost');
    fixture.componentRef.setInput('icon', 'home');
    const component = fixture.componentInstance;

    const spy = jest.fn();
    component.onClick.subscribe(spy);
    const evt = new MouseEvent('click');
    component.onClick.emit(evt);

    expect(component.variant()).toBe('ghost');
    expect(component.icon()).toBe('home');
    expect(spy).toHaveBeenCalledWith(evt);
  });
});
