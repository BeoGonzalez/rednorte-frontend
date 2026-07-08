import { TestBed } from '@angular/core/testing';

import { PatientProfileUiComponent } from './patient-profile-ui.component';

describe('PatientProfileUiComponent (Jest)', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [PatientProfileUiComponent] }));

  it('se crea y emite onSchedule', () => {
    const fixture = TestBed.createComponent(PatientProfileUiComponent);
    const component = fixture.componentInstance;
    component.patient = { nombre: 'Juan' };

    const spy = jest.fn();
    component.onSchedule.subscribe(spy);
    component.onSchedule.emit();

    expect(component).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });
});
