// Coincide con RegistroSolicitudDto.java
export interface RegistroSolicitud {
  pacienteId: number;
  tipoSolicitud: string;
  gravedad: string;
}

// Coincide con SolicitudResponseDto.java
export interface SolicitudResponse {
  id: number;
  pacienteId: number;
  rutPaciente: string;
  nombrePaciente: string;
  tipoSolicitud: string;
  gravedad: string;
  estado: string;
  fechaSolicitud: string | Date;
  doctorId: number | null;
}
