// Esta interfaz se usa para ENVIAR datos al backend (POST)
// Coincide con tu clase Java: RegistroSolicitudDto
export interface RegistroSolicitud {
  pacienteId: number;
  tipoSolicitud: string;
  gravedad: string;
}

// Esta interfaz se usa para RECIBIR datos del backend (GET/Respuesta del POST)
// Coincide con tu clase Java: SolicitudResponseDto
export interface SolicitudResponse {
  id: number;
  pacienteId: number;
  tipoSolicitud: string;
  gravedad: string;
  estado: string;
  fechaSolicitud: string | Date; // Puede llegar como string ISO o convertirse a Date
}