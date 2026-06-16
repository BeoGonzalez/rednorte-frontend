// Petición para Login
export interface LoginRequest {
  username: string;
  password: string;
}

// Respuesta del Login (AuthController devuelve Map.of("token", jwtToken))
export interface LoginResponse {
  token: string;
}

// Petición para Registro
export interface RegisterRequest {
  username: string;
  password: string;
  rol?: string; // Opcional, el backend asigna 'ROLE_PACIENTE' por defecto
}

// Respuesta del Registro
export interface RegisterResponse {
  mensaje: string;
  authId: number;
}