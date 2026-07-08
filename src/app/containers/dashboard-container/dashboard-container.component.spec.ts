import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { DashboardContainerComponent } from './dashboard-container.component';
import { WaitingListService } from '../../core/services/waiting-list.service';
import { PatientService } from '../../core/services/patient.service';
import { AuthService } from '../../core/services/auth.service';
import { SolicitudResponse } from '../../models/waiting-list.models';

const mockSolicitudes: SolicitudResponse[] = [
  {
    id: 1,
    pacienteId: 10,
    rutPaciente: '12345678-9',
    nombrePaciente: 'Juan Pérez',
    tipoSolicitud: 'MEDICINA_GENERAL',
    gravedad: 'ALTA',
    estado: 'BUSCANDO_CITA',
    fechaSolicitud: '2024-01-01T10:00:00',
    doctorId: null,
  },
];

describe('DashboardContainerComponent', () => {
  let component: DashboardContainerComponent;

  let waitingListSpy: {
    getWaitingList: jasmine.Spy;
    updateSolicitud: jasmine.Spy;
  };
  let authSpy: { logout: jasmine.Spy };

  beforeEach(async () => {
    // Silencia los console.error esperados de las pruebas de ruta negativa.
    spyOn(console, 'error');
    waitingListSpy = {
      getWaitingList: jasmine.createSpy('getWaitingList').and.returnValue(of(mockSolicitudes)),
      updateSolicitud: jasmine.createSpy('updateSolicitud'),
    };
    authSpy = { logout: jasmine.createSpy('logout') };

    await TestBed.configureTestingModule({
      imports: [DashboardContainerComponent],
      providers: [
        { provide: WaitingListService, useValue: waitingListSpy },
        { provide: PatientService, useValue: {} },
        { provide: AuthService, useValue: authSpy },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(DashboardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── ngOnInit ─────────────────────────────────────────────
  describe('ngOnInit()', () => {
    it('debería cargar la lista con estado BUSCANDO_CITA y especialidad por defecto', () => {
      expect(waitingListSpy.getWaitingList).toHaveBeenCalledWith('BUSCANDO_CITA', 'MEDICINA_GENERAL');
      expect(component.waitingPatients().length).toBe(1);
      expect(component.isLoadingList()).toBe(false);
    });
  });

  // ─── loadWaitingList ──────────────────────────────────────
  describe('loadWaitingList()', () => {
    it('debería actualizar waitingPatients y apagar el loading al éxito', () => {
      // Given
      waitingListSpy.getWaitingList.and.returnValue(of(mockSolicitudes));

      // When
      component.loadWaitingList('BUSCANDO_CITA', 'CARDIOLOGIA');

      // Then
      expect(component.selectedEspecialidad()).toBe('CARDIOLOGIA');
      expect(component.waitingPatients().length).toBe(1);
      expect(component.isLoadingList()).toBe(false);
    });

    it('debería apagar el loading aunque el HTTP falle', () => {
      // Given
      waitingListSpy.getWaitingList.and.returnValue(throwError(() => new Error('timeout')));

      // When
      component.loadWaitingList('BUSCANDO_CITA', 'PEDIATRIA');

      // Then
      expect(component.isLoadingList()).toBe(false);
    });
  });

  // ─── gestionarSolicitud ───────────────────────────────────
  describe('gestionarSolicitud()', () => {
    it('ACEPTADA — debería mostrar snackbar de éxito y recargar lista', () => {
      // Given
      waitingListSpy.updateSolicitud.and.returnValue(of({}));
      waitingListSpy.getWaitingList.and.returnValue(of([]));

      // When
      component.gestionarSolicitud(1, 'ACEPTADA');

      // Then
      expect(waitingListSpy.updateSolicitud).toHaveBeenCalledWith(1, { estado: 'ACEPTADA' });
      expect(component.snackbarVisible()).toBe(true);
      expect(component.snackbarMessage()).toBe('Ha aceptado la cita');
      expect(component.snackbarType()).toBe('success');
    });

    it('RECHAZADA — debería mostrar mensaje de rechazo', () => {
      // Given
      waitingListSpy.updateSolicitud.and.returnValue(of({}));
      waitingListSpy.getWaitingList.and.returnValue(of([]));

      // When
      component.gestionarSolicitud(2, 'RECHAZADA');

      // Then
      expect(component.snackbarMessage()).toBe('Ha rechazado la cita');
    });

    it('Error HTTP — debería mostrar snackbar de error', () => {
      // Given
      waitingListSpy.updateSolicitud.and.returnValue(throwError(() => new Error('500')));

      // When
      component.gestionarSolicitud(3, 'ACEPTADA');

      // Then
      expect(component.snackbarVisible()).toBe(true);
      expect(component.snackbarType()).toBe('error');
      expect(component.snackbarMessage()).toContain('#3');
    });
  });

  // ─── logout ───────────────────────────────────────────────
  describe('logout()', () => {
    it('debería delegar en authService.logout()', () => {
      component.logout();
      expect(authSpy.logout).toHaveBeenCalledTimes(1);
    });
  });
});
