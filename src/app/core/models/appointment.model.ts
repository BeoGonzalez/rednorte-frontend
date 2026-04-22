export interface Appointment {
  id: string;
  label: string; // ej: "Ahora", "Hoy"
  time: string;  // ej: "10:00", "11:30"
  patientName: string;
  appointmentType: string; // ej: "Consulta General", "Revisión Exámenes"
  status: string; // ej: "En sala de espera", "No ha llegado"
}