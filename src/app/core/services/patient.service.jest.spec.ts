import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { PatientService } from './patient.service';

describe('PatientService (Jest)', () => {
  let service: PatientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PatientService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PatientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('obtenerTodos() → GET /api/pacientes', () => {
    service.obtenerTodos().subscribe();
    const req = httpMock.expectOne('/api/pacientes');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('obtenerPorId() → GET /api/pacientes/1', () => {
    service.obtenerPorId(1).subscribe();
    httpMock.expectOne('/api/pacientes/1').flush({});
  });

  it('obtenerPorAuthId() → GET /api/pacientes/auth/10', () => {
    service.obtenerPorAuthId(10).subscribe();
    httpMock.expectOne('/api/pacientes/auth/10').flush({});
  });

  it('obtenerNotificaciones() → GET /api/pacientes/1/notificaciones', () => {
    service.obtenerNotificaciones(1).subscribe();
    httpMock.expectOne('/api/pacientes/1/notificaciones').flush([]);
  });

  it('obtenerPorEstado() → GET /api/pacientes/estado/ACTIVO', () => {
    service.obtenerPorEstado('ACTIVO').subscribe();
    httpMock.expectOne('/api/pacientes/estado/ACTIVO').flush([]);
  });

  it('createPatient() → POST /api/pacientes', () => {
    service.createPatient({ nombre: 'Juan' } as any).subscribe();
    const req = httpMock.expectOne('/api/pacientes');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('actualizarCompleto() → PUT /api/pacientes/1', () => {
    service.actualizarCompleto(1, { nombre: 'X' } as any).subscribe();
    const req = httpMock.expectOne('/api/pacientes/1');
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('actualizarParcial() → PATCH /api/pacientes/1', () => {
    service.actualizarParcial(1, { nombre: 'X' }).subscribe();
    const req = httpMock.expectOne('/api/pacientes/1');
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('eliminarPaciente() → DELETE /api/pacientes/1', () => {
    service.eliminarPaciente(1).subscribe();
    const req = httpMock.expectOne('/api/pacientes/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
