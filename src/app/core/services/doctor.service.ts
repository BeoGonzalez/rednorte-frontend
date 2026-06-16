import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor, DoctorRequest } from '../models/doctor.models';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private http = inject(HttpClient);
  private baseUrl = '/api/doctores';

  // Obtener todos los doctores
  getDoctores(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.baseUrl);
  }

  // Obtener doctores por especialidad (ej. para asignar triaje)
  getDoctoresByEspecialidad(especialidad: string): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.baseUrl}/especialidad/${especialidad}`);
  }

  // Registrar un nuevo doctor
  crearDoctor(doctor: DoctorRequest): Observable<Doctor> {
    return this.http.post<Doctor>(this.baseUrl, doctor);
  }
}