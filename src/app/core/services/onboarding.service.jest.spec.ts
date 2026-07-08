import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { OnboardingService } from './onboarding.service';

describe('OnboardingService (Jest)', () => {
  let service: OnboardingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OnboardingService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(OnboardingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getPerfilPaciente() → GET /api/bff/onboarding/perfil-paciente/10', () => {
    service.getPerfilPaciente(10).subscribe();
    httpMock.expectOne('/api/bff/onboarding/perfil-paciente/10').flush({});
  });

  it('getPerfilMedico() → GET /api/bff/onboarding/perfil-medico/10', () => {
    service.getPerfilMedico(10).subscribe();
    httpMock.expectOne('/api/bff/onboarding/perfil-medico/10').flush({});
  });

  it('crearPerfilPaciente() → POST /api/bff/onboarding/paciente', () => {
    service.crearPerfilPaciente({ authId: 1, rut: '1-9', nombre: 'J', apellido: 'P', email: 'j@t.cl' }).subscribe();
    const req = httpMock.expectOne('/api/bff/onboarding/paciente');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('crearPerfilMedico() → POST /api/bff/onboarding/medico', () => {
    service
      .crearPerfilMedico({ authId: 1, nombre: 'J', apellidos: 'P', specialty: 'CARDIO', registroMedico: 'R1' })
      .subscribe();
    const req = httpMock.expectOne('/api/bff/onboarding/medico');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
