export interface Paciente {
  id?: number;
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  estado: string; // ACTIVO, INACTIVO, etc.
}