import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { WaitingListService } from './waiting-list.service';

describe('WaitingListService (Jest)', () => {
  let service: WaitingListService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WaitingListService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(WaitingListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('registrarSolicitud() → POST /api/listas-espera/registro', () => {
    service.registrarSolicitud({ pacienteId: 1, tipoSolicitud: 'MEDICINA_GENERAL', gravedad: 'ALTA' }).subscribe();
    const req = httpMock.expectOne('/api/listas-espera/registro');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('getListaPriorizada() → GET /api/listas-espera', () => {
    service.getListaPriorizada().subscribe();
    httpMock.expectOne('/api/listas-espera').flush([]);
  });

  it('getSolicitudById() → GET /api/listas-espera/5', () => {
    service.getSolicitudById(5).subscribe();
    httpMock.expectOne('/api/listas-espera/5').flush({});
  });

  it('getWaitingList() → GET /api/listas-espera/filtrar con params estado y tipoCita', () => {
    service.getWaitingList('BUSCANDO_CITA', 'MEDICINA_GENERAL').subscribe();
    const req = httpMock.expectOne(
      r => r.url === '/api/listas-espera/filtrar'
    );
    expect(req.request.params.get('estado')).toBe('BUSCANDO_CITA');
    expect(req.request.params.get('tipoCita')).toBe('MEDICINA_GENERAL');
    req.flush([]);
  });

  it('updateSolicitud() → PATCH /api/listas-espera/3', () => {
    service.updateSolicitud(3, { estado: 'ACEPTADA' }).subscribe();
    const req = httpMock.expectOne('/api/listas-espera/3');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ estado: 'ACEPTADA' });
    req.flush({});
  });
});
