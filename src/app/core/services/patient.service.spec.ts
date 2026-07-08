import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { PatientService } from './patient.service';
import { PacienteResponse } from '../models/patient.models';

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

describe('PatientService', () => {
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

  // ─── obtenerPorAuthId ────────────────────────────────────
  describe('obtenerPorAuthId()', () => {
    it('debería hacer GET /api/pacientes/auth/{id} y retornar el paciente', () => {
      // When
      service.obtenerPorAuthId(10).subscribe(p => {
        expect(p.rut).toBe('12345678-9');
        expect(p.nombre).toBe('Juan');
      });

      // Then
      const req = httpMock.expectOne('/api/pacientes/auth/10');
      expect(req.request.method).toBe('GET');
      req.flush(mockPaciente);
    });

    it('debería propagar error 404', () => {
      let error: any;
      service.obtenerPorAuthId(999).subscribe({ error: e => (error = e) });

      const req = httpMock.expectOne('/api/pacientes/auth/999');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });

      expect(error.status).toBe(404);
    });
  });

  // ─── obtenerNotificaciones ───────────────────────────────
  describe('obtenerNotificaciones()', () => {
    it('debería hacer GET /api/pacientes/{id}/notificaciones', () => {
      const notifs = [{ id: 1, pacienteId: 1, mensaje: 'Aceptada', leida: false, fechaCreacion: null }];

      service.obtenerNotificaciones(1).subscribe(data => {
        expect(data.length).toBe(1);
        expect(data[0].mensaje).toBe('Aceptada');
      });

      const req = httpMock.expectOne('/api/pacientes/1/notificaciones');
      expect(req.request.method).toBe('GET');
      req.flush(notifs);
    });

    it('debería propagar error 500', () => {
      let error: any;
      service.obtenerNotificaciones(1).subscribe({ error: e => (error = e) });

      const req = httpMock.expectOne('/api/pacientes/1/notificaciones');
      req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });

      expect(error.status).toBe(500);
    });
  });

  // ─── obtenerTodos ─────────────────────────────────────────
  describe('obtenerTodos()', () => {
    it('debería hacer GET /api/pacientes', () => {
      service.obtenerTodos().subscribe(list => expect(list.length).toBe(1));

      const req = httpMock.expectOne('/api/pacientes');
      expect(req.request.method).toBe('GET');
      req.flush([mockPaciente]);
    });
  });

  // ─── obtenerPorId ─────────────────────────────────────────
  describe('obtenerPorId()', () => {
    it('debería hacer GET /api/pacientes/{id}', () => {
      service.obtenerPorId(1).subscribe(p => expect(p.id).toBe(1));

      const req = httpMock.expectOne('/api/pacientes/1');
      req.flush(mockPaciente);
    });
  });

  // ─── createPatient ────────────────────────────────────────
  describe('createPatient()', () => {
    it('debería hacer POST /api/pacientes', () => {
      const payload = { authId: null, rut: '12.345.678-9', nombre: 'Juan', apellido: 'P', email: 'j@t.cl' };

      service.createPatient(payload as any).subscribe(p => expect(p.id).toBe(1));

      const req = httpMock.expectOne('/api/pacientes');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(mockPaciente);
    });
  });

  // ─── actualizarParcial ────────────────────────────────────
  describe('actualizarParcial()', () => {
    it('debería hacer PATCH /api/pacientes/{id}', () => {
      service.actualizarParcial(1, { nombre: 'Carlos' }).subscribe(p => expect(p.id).toBe(1));

      const req = httpMock.expectOne('/api/pacientes/1');
      expect(req.request.method).toBe('PATCH');
      req.flush(mockPaciente);
    });
  });
});
