import { TestBed } from '@angular/core/testing';

import { AddPatientFormComponent } from './add-patient-form.component';

describe('AddPatientFormComponent (Jest)', () => {
  let component: AddPatientFormComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AddPatientFormComponent] });
    component = TestBed.createComponent(AddPatientFormComponent).componentInstance;
  });

  it('el formulario arranca inválido', () => {
    expect(component.patientForm.invalid).toBe(true);
  });

  it('send() emite los valores y resetea el formulario', () => {
    component.patientForm.setValue({ rut: '12.345.678-9', nombre: 'Juan', email: 'juan@test.cl' });

    const spy = jest.fn();
    component.onSave.subscribe(spy);
    component.send();

    expect(spy).toHaveBeenCalledWith({ rut: '12.345.678-9', nombre: 'Juan', email: 'juan@test.cl' });
    expect(component.patientForm.value.nombre).toBeNull();
  });
});
