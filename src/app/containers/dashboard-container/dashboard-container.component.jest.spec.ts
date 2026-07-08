import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { DashboardContainerComponent } from './dashboard-container.component';
import { WaitingListService } from '../../core/services/waiting-list.service';
import { PatientService } from '../../core/services/patient.service';
import { AuthService } from '../../core/services/auth.service';

describe('DashboardContainerComponent (Jest)', () => {
  let component: DashboardContainerComponent;
  const getWaitingList = jest.fn();
  const updateSolicitud = jest.fn();
  const logout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    getWaitingList.mockReturnValue(of([{ id: 1 }]));

    TestBed.configureTestingModule({
      imports: [DashboardContainerComponent],
      providers: [
        { provide: WaitingListService, useValue: { getWaitingList, updateSolicitud } },
        { provide: PatientService, useValue: {} },
        { provide: AuthService, useValue: { logout } },
      ],
    });
    component = TestBed.createComponent(DashboardContainerComponent).componentInstance;
  });

  it('ngOnInit() carga la lista por defecto', () => {
    component.ngOnInit();
    expect(getWaitingList).toHaveBeenCalledWith('BUSCANDO_CITA', 'MEDICINA_GENERAL');
    expect(component.waitingPatients().length).toBe(1);
    expect(component.isLoadingList()).toBe(false);
  });

  it('loadWaitingList() actualiza especialidad y lista al éxito', () => {
    component.loadWaitingList('BUSCANDO_CITA', 'CARDIOLOGIA');
    expect(component.selectedEspecialidad()).toBe('CARDIOLOGIA');
    expect(component.isLoadingList()).toBe(false);
  });

  it('loadWaitingList() apaga el loading al fallar', () => {
    getWaitingList.mockReturnValue(throwError(() => new Error('timeout')));
    component.loadWaitingList('BUSCANDO_CITA', 'PEDIATRIA');
    expect(component.isLoadingList()).toBe(false);
  });

  it('gestionarSolicitud() ACEPTADA muestra snackbar de éxito', () => {
    updateSolicitud.mockReturnValue(of({}));
    getWaitingList.mockReturnValue(of([]));
    component.gestionarSolicitud(1, 'ACEPTADA');
    expect(updateSolicitud).toHaveBeenCalledWith(1, { estado: 'ACEPTADA' });
    expect(component.snackbarType()).toBe('success');
    expect(component.snackbarMessage()).toBe('Ha aceptado la cita');
  });

  it('gestionarSolicitud() RECHAZADA muestra mensaje de rechazo', () => {
    updateSolicitud.mockReturnValue(of({}));
    getWaitingList.mockReturnValue(of([]));
    component.gestionarSolicitud(2, 'RECHAZADA');
    expect(component.snackbarMessage()).toBe('Ha rechazado la cita');
  });

  it('gestionarSolicitud() con error muestra snackbar de error', () => {
    updateSolicitud.mockReturnValue(throwError(() => new Error('500')));
    component.gestionarSolicitud(3, 'ACEPTADA');
    expect(component.snackbarType()).toBe('error');
    expect(component.snackbarMessage()).toContain('#3');
  });

  it('el snackbar se oculta tras 3s y limpia el timer anterior', () => {
    jest.useFakeTimers();
    updateSolicitud.mockReturnValue(of({}));
    getWaitingList.mockReturnValue(of([]));

    component.gestionarSolicitud(1, 'ACEPTADA'); // primer timer
    component.gestionarSolicitud(1, 'ACEPTADA'); // limpia el timer previo (branch clearTimeout)
    expect(component.snackbarVisible()).toBe(true);

    jest.advanceTimersByTime(3000);
    expect(component.snackbarVisible()).toBe(false);
    jest.useRealTimers();
  });

  it('logout() delega en AuthService', () => {
    component.logout();
    expect(logout).toHaveBeenCalled();
  });
});
