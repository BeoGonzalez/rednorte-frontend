// Para enviar la solicitud (Coincide con RegistroSolicitudDto.java)
export interface RegistroSolicitud {
  pacienteId: number;
  tipoSolicitud: string;
  gravedad: string;
}

// Para recibir la respuesta (Coincide con SolicitudResponseDto.java)
export interface SolicitudResponse {
  id: number;
  pacienteId: number;
  tipoSolicitud: string;
  gravedad: string;
  estado: string;
  fechaSolicitud: string | Date;
}