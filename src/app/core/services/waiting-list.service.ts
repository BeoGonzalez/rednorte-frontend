import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroSolicitud, SolicitudResponse } from '../../models/waiting-list.models';

@Injectable({
  providedIn: 'root'
})
export class WaitingListService {
  private http = inject(HttpClient);
  
  // 🟢 IMPORTANTE: Usamos la ruta exacta que definimos en el Gateway y Controller
  private baseUrl = '/api/listas-espera';

  /**
   * Endpoint para que el Paciente se anote en la lista.
   * Requiere ROLE_PACIENTE.
   */
  registrarSolicitud(solicitud: RegistroSolicitud): Observable<SolicitudResponse> {
    return this.http.post<SolicitudResponse>(this.baseUrl, solicitud);
  }

  /**
   * Endpoint para que el Médico vea la lista priorizada.
   * Requiere ROLE_MEDICO.
   */
  getListaPriorizada(): Observable<SolicitudResponse[]> {
    return this.http.get<SolicitudResponse[]>(this.baseUrl);
  }

  /**
   * Endpoint para ver el detalle de una solicitud específica.
   * Requiere ROLE_PACIENTE o ROLE_MEDICO.
   */
  getSolicitudById(id: number): Observable<SolicitudResponse> {
    return this.http.get<SolicitudResponse>(`${this.baseUrl}/${id}`);
  }
}