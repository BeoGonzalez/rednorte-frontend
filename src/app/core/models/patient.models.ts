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
  authId: number | null;
  rut: string;
  email: string;
  nombre: string;
  apellido: string;
  estado: string;
  fechaRegistro: string | Date;
}