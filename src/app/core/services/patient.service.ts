import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private http = inject(HttpClient);

  // Rutas
  private bffUrl = 'http://localhost:8080/bff/dashboard/patients';
  private apiPacientesUrl = 'http://localhost:8080/api/pacientes';

  // 1. Método para el Portal de Pacientes (Leer)
  getPatientData(): Observable<any> {
    return this.http.get<any>(this.bffUrl);
  }

  // 2. Método para el Médico (Crear)
  createPatient(patientData: any): Observable<any> {
    return this.http.post(this.apiPacientesUrl, patientData);
  }
}