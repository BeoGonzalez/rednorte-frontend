// Coincide con PacienteRequestDto.java
export interface PacienteRequest {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
}

// Coincide con PacienteResponseDto.java
export interface PacienteResponse {
  id: number;
  rut: string;
  email: string;
  nombre: string;
  apellido: string;
  estado: string; // En Java es el enum EstadoPaciente
  fechaRegistro: string | Date;
}