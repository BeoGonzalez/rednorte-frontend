import { TestBed } from '@angular/core/testing';

import { AppointmentItemComponent } from './appointment-item.component';
import { Appointment } from '../../core/models/appointment.model';

describe('AppointmentItemComponent (Jest)', () => {
  const appointment: Appointment = {
    id: '42',
    label: 'Ahora',
    time: '10:00',
    patientName: 'Juan Pérez',
    appointmentType: 'Consulta General',
    status: 'En sala de espera',
  };

  beforeEach(() => TestBed.configureTestingModule({ imports: [AppointmentItemComponent] }));

  it('callToBox() emite el id del appointment', () => {
    const fixture = TestBed.createComponent(AppointmentItemComponent);
    fixture.componentRef.setInput('appointment', appointment);
    const component = fixture.componentInstance;

    const emitted = jest.fn();
    component.onCallBox.subscribe(emitted);

    component.callToBox();

    expect(emitted).toHaveBeenCalledWith('42');
  });
});
