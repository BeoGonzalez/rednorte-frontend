export interface Doctor {
  id: number;
  nombre: string;
  especialidad: string;
  authId?: number;
  disponibilidad?: boolean; // Para saber si puede recibir pacientes
}

export interface DoctorRequest {
  nombre: string;
  especialidad: string;
  authId?: number;
}