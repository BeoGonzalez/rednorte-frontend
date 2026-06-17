export interface RegistroSolicitud {
  pacienteId: number;
  tipoSolicitud: string;
  gravedad: string;
}

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
