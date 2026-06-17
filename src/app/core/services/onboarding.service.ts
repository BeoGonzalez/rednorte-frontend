import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OnboardingPacientePayload {
  authId: number;
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
}

export interface OnboardingMedicoPayload {
  authId: number;
  nombre: string;
  apellidos: string;
  specialty: string;
  registroMedico: string;
}

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private http = inject(HttpClient);
  private baseUrl = '/api/bff/onboarding';

  getPerfilPaciente(authId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/perfil-paciente/${authId}`);
  }

  getPerfilMedico(authId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/perfil-medico/${authId}`);
  }

  crearPerfilPaciente(payload: OnboardingPacientePayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/paciente`, payload);
  }

  crearPerfilMedico(payload: OnboardingMedicoPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/medico`, payload);
  }
}
