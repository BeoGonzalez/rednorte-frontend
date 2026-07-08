import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { PatientPortalComponent } from './patient-portal.component';
import { PatientService } from '../../core/services/patient.service';
import { WaitingListService } from '../../core/services/waiting-list.service';
import { AuthService } from '../../core/services/auth.service';

const mockPaciente = { id: 1, authId: 10, nombre: 'Juan' };
const mockNotis = [{ id: 1, mensaje: 'Aceptada' }];

describe('PatientPortalComponent (Jest)', () => {
  let component: PatientPortalComponent;
  const obtenerPorAuthId = jest.fn();
  const obtenerNotificaciones = jest.fn();
  const registrarSolicitud = jest.fn();
  const getAuthId = jest.fn();
  const logout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    getAuthId.mockReturnValue(10);
    obtenerPorAuthId.mockReturnValue(of(mockPaciente));
    obtenerNotificaciones.mockReturnValue(of(mockNotis));

    TestBed.configureTestingModule({
      imports: [PatientPortalComponent],
      providers: [
        { provide: PatientService, useValue: { obtenerPorAuthId, obtenerNotificaciones } },
        { provide: WaitingListService, useValue: { registrarSolicitud } },
        { provide: AuthService, useValue: { getAuthId, logout } },
      ],
    });
    component = TestBed.createComponent(PatientPortalComponent).componentInstance;
  });

  it('loadDataFromBff() carga perfil y notificaciones', () => {
    component.loadDataFromBff();
    expect(obtenerPorAuthId).toHaveBeenCalledWith(10);
    expect(component.patientData()).toEqual(mockPaciente);
    expect(component.isLoading()).toBe(false);
    expect(component.notificaciones().length).toBe(1);
  });

  it('loadDataFromBff() sin authId detiene el loading', () => {
    getAuthId.mockReturnValue(null);
    component.loadDataFromBff();
    expect(component.isLoading()).toBe(false);
  });

  it('loadDataFromBff() con error deja patientData en null', () => {
    obtenerPorAuthId.mockReturnValue(throwError(() => new Error('404')));
    component.loadDataFromBff();
    expect(component.isLoading()).toBe(false);
    expect(component.patientData()).toBeNull();
  });

  it('cargarNotificaciones() éxito puebla la señal', () => {
    obtenerNotificaciones.mockReturnValue(of(mockNotis));
    component.cargarNotificaciones(1);
    expect(component.notificaciones().length).toBe(1);
  });

  it('cargarNotificaciones() error no rompe', () => {
    obtenerNotificaciones.mockReturnValue(throwError(() => new Error('x')));
    expect(() => component.cargarNotificaciones(1)).not.toThrow();
  });

  it('handleScheduleAppointment() alterna el formulario y limpia mensajes', () => {
    component.handleScheduleAppointment();
    expect(component.showForm()).toBe(true);
    expect(component.submitSuccess()).toBe('');
    expect(component.submitError()).toBe('');
    component.handleScheduleAppointment();
    expect(component.showForm()).toBe(false);
  });

  it('onSubmitCita() éxito muestra mensaje y cierra el form', () => {
    registrarSolicitud.mockReturnValue(of({ id: 99, estado: 'BUSCANDO_CITA' }));
    component.showForm.set(true);
    component.onSubmitCita();
    expect(component.submitSuccess()).toContain('99');
    expect(component.showForm()).toBe(false);
    expect(component.isSubmitting()).toBe(false);
  });

  it('onSubmitCita() error muestra mensaje de error', () => {
    registrarSolicitud.mockReturnValue(throwError(() => new Error('500')));
    component.onSubmitCita();
    expect(component.submitError()).toContain('Error');
    expect(component.isSubmitting()).toBe(false);
  });

  it('onSubmitCita() con form inválido no llama al servicio', () => {
    component.citaForm.get('tipoSolicitud')?.setValue('');
    component.citaForm.get('gravedad')?.setValue('');
    component.onSubmitCita();
    expect(registrarSolicitud).not.toHaveBeenCalled();
  });

  it('logout() delega en AuthService', () => {
    component.logout();
    expect(logout).toHaveBeenCalled();
  });
});
