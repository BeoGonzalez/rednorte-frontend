import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WaitingListService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/bff/listas-espera'; 

  getWaitingList(estado: string, tipoCita: string): Observable<any[]> {
    const params = new HttpParams().set('estado', estado).set('tipoCita', tipoCita);
    return this.http.get<any[]>(`${this.apiUrl}/filtrar`, { params });
  }

  // 🔴 Métodos para que el Médico gestione la lista
  updateSolicitud(id: string, payload: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, payload);
  }

  eliminarSolicitud(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 🔴 Método para que el Paciente pida cita
  registrarSolicitud(solicitud: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, solicitud);
  }
}