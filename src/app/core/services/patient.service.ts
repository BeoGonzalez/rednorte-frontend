// src/app/core/services/patient.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  // 🔴 La regla de oro: Apuntar al API Gateway (8080) usando la ruta del BFF
  private apiUrl = 'http://localhost:8080/bff/dashboard/patients';

  constructor(private http: HttpClient) {}

  getPacientes(): Observable<Paciente[]> {
    // El token viaja oculto gracias al interceptor
    return this.http.get<Paciente[]>(this.apiUrl);
  }
}