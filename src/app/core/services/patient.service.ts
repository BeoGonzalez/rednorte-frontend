import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PacienteRequest, PacienteResponse } from '../models/patient.models';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private http = inject(HttpClient);

  // 🟢 Rutas relativas para que sean interceptadas por el proxy.conf.json
  // Asegúrate de que tu Gateway esté mapeando "/api/bff/**" correctamente
  private apiPacientesUrl = '/api/pacientes';

  obtenerTodos(): Observable<PacienteResponse[]> {
    return this.http.get<PacienteResponse[]>(this.apiPacientesUrl);
  }

  obtenerPorId(id: number): Observable<PacienteResponse> {
    return this.http.get<PacienteResponse>(`${this.apiPacientesUrl}/${id}`);
  }

  obtenerPorAuthId(authId: number): Observable<PacienteResponse> {
    return this.http.get<PacienteResponse>(`${this.apiPacientesUrl}/auth/${authId}`);
  }

  obtenerNotificaciones(pacienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiPacientesUrl}/${pacienteId}/notificaciones`);
  }

  // Obtener por estado (Requiere ROLE_MEDICO)
  obtenerPorEstado(estado: string): Observable<PacienteResponse[]> {
    return this.http.get<PacienteResponse[]>(`${this.apiPacientesUrl}/estado/${estado}`);
  }

  // Crear paciente
  createPatient(patientData: PacienteRequest): Observable<PacienteResponse> {
    return this.http.post<PacienteResponse>(this.apiPacientesUrl, patientData);
  }

  // Actualizar todos los campos (Requiere ROLE_MEDICO)
  actualizarCompleto(id: number, patientData: PacienteRequest): Observable<PacienteResponse> {
    return this.http.put<PacienteResponse>(`${this.apiPacientesUrl}/${id}`, patientData);
  }

  // Actualizar parcialmente (Requiere ROLE_MEDICO)
  actualizarParcial(id: number, campos: Partial<PacienteRequest>): Observable<PacienteResponse> {
    return this.http.patch<PacienteResponse>(`${this.apiPacientesUrl}/${id}`, campos);
  }

  // Eliminar (Requiere ROLE_MEDICO)
  eliminarPaciente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiPacientesUrl}/${id}`);
  }
}