import { Injectable, inject } from '@angular/core';
// 🟢 MIRA AQUÍ: HttpParams está importado correctamente en la parte superior
import { HttpClient, HttpParams } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { RegistroSolicitud, SolicitudResponse } from '../models/waiting-list.models';

@Injectable({
  providedIn: 'root'
})
export class WaitingListService {
  private http = inject(HttpClient);
  private baseUrl = '/api/listas-espera';

  registrarSolicitud(solicitud: RegistroSolicitud): Observable<SolicitudResponse> {
    return this.http.post<SolicitudResponse>(this.baseUrl, solicitud);
  }

  getListaPriorizada(): Observable<SolicitudResponse[]> {
    return this.http.get<SolicitudResponse[]>(this.baseUrl);
  }

  getSolicitudById(id: number): Observable<SolicitudResponse> {
    return this.http.get<SolicitudResponse>(`${this.baseUrl}/${id}`);
  }

  getWaitingList(estado?: string, especialidad?: string): Observable<SolicitudResponse[]> {
    let params = new HttpParams();
    if (estado) params = params.set('estado', estado);
    if (especialidad) params = params.set('especialidad', especialidad);
    
    return this.http.get<SolicitudResponse[]>(this.baseUrl, { params });
  }

  updateSolicitud(id: number, data: { estado: string }): Observable<SolicitudResponse> {
    return this.http.put<SolicitudResponse>(`${this.baseUrl}/${id}/estado`, null, {
      params: { nuevoEstado: data.estado }
    });
  }
}