import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { PatientPortalComponent } from './patient-portal.component';
import { PatientService } from '../../core/services/patient.service';
import { WaitingListService } from '../../core/services/waiting-list.service';
import { AuthService } from '../../core/services/auth.service';
import { PacienteResponse } from '../../core/models/patient.models';

const mockPaciente: PacienteResponse = {
  id: 1,
  authId: 10,
  rut: '12345678-9',
  email: 'juan@test.cl',
  nombre: 'Juan',
  apellido: 'Pérez',
  estado: 'ACTIVO',
  fechaRegistro: '2024-01-01T00:00:00',
};

const mockNotificaciones = [
  { id: 1, pacienteId: 1, mensaje: 'Su agenda ha sido aceptada', leida: false, fechaCreacion: null },
];

describe('PatientPortalComponent', () => {
  let component: PatientPortalComponent;

  const patientSpy = {
    obtenerPorAuthId: vi.fn(),
    obtenerNotificaciones: vi.fn(),
  };
  const waitingListSpy = {
    registrarSolicitud: vi.fn(),
  };
  const authSpy = {
    getAuthId: vi.fn(),
    logout: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    authSpy.getAuthId.mockReturnValue(10);
    patientSpy.obtenerPorAuthId.mockReturnValue(of(mockPaciente));
    patientSpy.obtenerNotificaciones.mockReturnValue(of(mockNotificaciones));

    await TestBed.configureTestingModule({
      imports: [PatientPortalComponent],
      providers: [
        { provide: PatientService, useValue: patientSpy },
        { provide: WaitingListService, useValue: waitingListSpy },
        { provide: AuthService, useValue: authSpy },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(PatientPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── ngOnInit / loadDataFromBff ───────────────────────────
  describe('loadDataFromBff()', () => {
    it('debería cargar datos y notificaciones cuando authId existe', () => {
      expect(patientSpy.obtenerPorAuthId).toHaveBeenCalledWith(10);
      expect(component.patientData()).toEqual(mockPaciente);
      expect(component.isLoading()).toBe(false);
      expect(component.notificaciones()).toHaveLength(1);
    });

    it('debería detener loading inmediatamente si no hay authId', () => {
      // Given
      authSpy.getAuthId.mockReturnValue(null);

      // When
      component.loadDataFromBff();

      // Then
      expect(component.isLoading()).toBe(false);
      expect(patientSpy.obtenerPorAuthId).toHaveBeenCalledOnce(); // solo del beforeEach
    });

    it('error HTTP — debería detener loading sin crashear', () => {
      // Given
      authSpy.getAuthId.mockReturnValue(10);
      patientSpy.obtenerPorAuthId.mockReturnValue(throwError(() => new Error('404')));

      // When
      component.loadDataFromBff();

      // Then
      expect(component.isLoading()).toBe(false);
      expect(component.patientData()).toBeNull();
    });
  });

  // ─── cargarNotificaciones ─────────────────────────────────
  describe('cargarNotificaciones()', () => {
    it('debería poblar la señal de notificaciones', () => {
      patientSpy.obtenerNotificaciones.mockReturnValue(of(mockNotificaciones));

      component.cargarNotificaciones(1);

      expect(component.notificaciones()).toHaveLength(1);
      expect(component.notificaciones()[0].mensaje).toBe('Su agenda ha sido aceptada');
    });

    it('error — no debería modificar notificaciones previas', () => {
      patientSpy.obtenerNotificaciones.mockReturnValue(throwError(() => new Error('error')));

      component.cargarNotificaciones(1);

      // El signal se mantiene con el valor anterior (del beforeEach)
      expect(component.notificaciones()).toHaveLength(1);
    });
  });

  // ─── handleScheduleAppointment ────────────────────────────
  describe('handleScheduleAppointment()', () => {
    it('debería alternar showForm y limpiar mensajes', () => {
      expect(component.showForm()).toBe(false);

      component.handleScheduleAppointment();
      expect(component.showForm()).toBe(true);

      component.handleScheduleAppointment();
      expect(component.showForm()).toBe(false);
    });

    it('debería limpiar submitSuccess y submitError', () => {
      component.handleScheduleAppointment();
      expect(component.submitSuccess()).toBe('');
      expect(component.submitError()).toBe('');
    });
  });

  // ─── onSubmitCita ─────────────────────────────────────────
  describe('onSubmitCita()', () => {
    it('éxito — debería mostrar mensaje y cerrar formulario', () => {
      // Given
      const mockResponse = { id: 99, estado: 'BUSCANDO_CITA', pacienteId: 1,
        tipoSolicitud: 'MEDICINA_GENERAL', gravedad: 'ALTA', fechaSolicitud: null,
        rutPaciente: '', nombrePaciente: '', doctorId: null };
      waitingListSpy.registrarSolicitud.mockReturnValue(of(mockResponse));
      component.showForm.set(true);

      // When
      component.onSubmitCita();

      // Then
      expect(component.submitSuccess()).toContain('99');
      expect(component.showForm()).toBe(false);
      expect(component.isSubmitting()).toBe(false);
    });

    it('error — debería mostrar error y apagar isSubmitting', () => {
      // Given
      waitingListSpy.registrarSolicitud.mockReturnValue(throwError(() => new Error('500')));

      // When
      component.onSubmitCita();

      // Then
      expect(component.submitError()).toContain('Error');
      expect(component.isSubmitting()).toBe(false);
    });

    it('formulario inválido — no debería llamar al servicio', () => {
      // Given — invalidar el form
      component.citaForm.get('tipoSolicitud')?.setValue('');
      component.citaForm.get('gravedad')?.setValue('');

      // When
      component.onSubmitCita();

      // Then
      expect(waitingListSpy.registrarSolicitud).not.toHaveBeenCalled();
    });
  });

  // ─── logout ───────────────────────────────────────────────
  describe('logout()', () => {
    it('debería delegar en authService.logout()', () => {
      component.logout();
      expect(authSpy.logout).toHaveBeenCalledOnce();
    });
  });
});
