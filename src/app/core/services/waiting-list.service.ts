import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroSolicitud, SolicitudResponse } from '../../models/waiting-list.models';

@Injectable({
  providedIn: 'root'
})
export class WaitingListService {
  private http = inject(HttpClient);
  private baseUrl = '/api/listas-espera';

  // POST /api/listas-espera/registro  — Bearer inyectado por authInterceptor
  registrarSolicitud(solicitud: RegistroSolicitud): Observable<SolicitudResponse> {
    return this.http.post<SolicitudResponse>(`${this.baseUrl}/registro`, solicitud);
  }

  // GET /api/listas-espera  — lista priorizada completa
  getListaPriorizada(): Observable<SolicitudResponse[]> {
    return this.http.get<SolicitudResponse[]>(this.baseUrl);
  }

  // GET /api/listas-espera/{id}
  getSolicitudById(id: number): Observable<SolicitudResponse> {
    return this.http.get<SolicitudResponse>(`${this.baseUrl}/${id}`);
  }

  // GET /api/listas-espera/filtrar?estado=X&tipoCita=X  — para el dashboard médico
  getWaitingList(estado: string, especialidad: string): Observable<SolicitudResponse[]> {
    const params = new HttpParams()
      .set('estado', estado)
      .set('tipoCita', especialidad);
    return this.http.get<SolicitudResponse[]>(`${this.baseUrl}/filtrar`, { params });
  }

  // PATCH /api/listas-espera/{id}  — body: { estado: 'ACEPTADA' | 'RECHAZADA' }
  updateSolicitud(id: number, data: { estado: string }): Observable<SolicitudResponse> {
    return this.http.patch<SolicitudResponse>(`${this.baseUrl}/${id}`, data);
  }
}
