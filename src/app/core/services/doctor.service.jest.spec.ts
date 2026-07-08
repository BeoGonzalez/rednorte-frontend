import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { DoctorService } from './doctor.service';

describe('DoctorService (Jest)', () => {
  let service: DoctorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DoctorService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DoctorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getDoctores() → GET /api/doctores', () => {
    service.getDoctores().subscribe();
    const req = httpMock.expectOne('/api/doctores');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getDoctoresByEspecialidad() → GET /api/doctores/especialidad/CARDIOLOGIA', () => {
    service.getDoctoresByEspecialidad('CARDIOLOGIA').subscribe();
    httpMock.expectOne('/api/doctores/especialidad/CARDIOLOGIA').flush([]);
  });

  it('crearDoctor() → POST /api/doctores', () => {
    service.crearDoctor({ nombre: 'Dr. X' } as any).subscribe();
    const req = httpMock.expectOne('/api/doctores');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
