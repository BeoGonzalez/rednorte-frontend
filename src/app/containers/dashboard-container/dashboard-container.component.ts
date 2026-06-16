import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Asegúrate de tener CommonModule para el HTML
import { AppointmentItemComponent } from '../../components/appointment-item/appointment-item.component';
import { Appointment } from '../../core/models/appointment.model';
import { PatientService } from '../../core/services/patient.service';
import { WaitingListService } from '../../core/services/waiting-list.service';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss']
})
export class DashboardContainerComponent implements OnInit {
  private waitingListService = inject(WaitingListService);
  private patientService = inject(PatientService);
  
  // 🟢 ESTADOS (Signals) - Sin duplicados
  doctorName = signal<string>('Dr. Mendoza');
  upcomingAppointments = signal<Appointment[]>([]);
  waitingPatients = signal<any[]>([]);
  selectedEspecialidad = signal<string>('MEDICINA_GENERAL');
  isLoadingList = signal<boolean>(false);

  ngOnInit(): void {
    this.loadAppointments();
    // 🟢 Llamada corregida con dos argumentos para coincidir con la definición de abajo
    this.loadWaitingList('BUSCANDO_CITA', 'MEDICINA_GENERAL');
  }

  loadAppointments(): void {
    const mockData: Appointment[] = [
      { id: '1', label: 'Ahora', time: '10:00', patientName: 'Carlos Mendoza', appointmentType: 'Consulta General', status: 'En sala de espera' },
      { id: '2', label: 'Hoy', time: '11:30', patientName: 'Ana Gómez S.', appointmentType: 'Revisión Exámenes', status: 'No ha llegado' }
    ];
    this.upcomingAppointments.set(mockData);
  }

  handleCallToBox(appointmentId: string): void {
    console.log(`Llamando a Box al paciente con ID: ${appointmentId}`);
  }

  handleSavePatient(newData: any) {
    this.patientService.createPatient(newData).subscribe({
      next: (res: any) => {
        alert('Paciente creado con éxito');
        this.loadPatients();
      },
      error: (err: any) => alert('Error: Solo los médicos pueden realizar esta acción.')
    });
  }

  loadPatients() {
    console.log('Recargando lista de pacientes...');
  }

  // 🟢 DEFINICIÓN CORREGIDA: Ahora acepta dos argumentos para evitar el error "Expected 1 arguments"
  loadWaitingList(estado: string, especialidad: string) {
    this.selectedEspecialidad.set(especialidad);
    this.isLoadingList.set(true);

    this.waitingListService.getWaitingList(estado, especialidad).subscribe({
      next: (data: any[]) => {
        this.waitingPatients.set(data);
        this.isLoadingList.set(false);
      },
      error: (err: any) => {
        console.error('Error al cargar la lista de espera', err);
        this.isLoadingList.set(false);
      }
    });
  }

  // 🟢 Función unificada para gestionar solicitudes (Aceptar/Rechazar)
  gestionarSolicitud(id: string, nuevoEstado: string) {
    this.waitingListService.updateSolicitud(Number(id), { estado: nuevoEstado }).subscribe({
      next: () => {
        alert(`Paciente ${nuevoEstado}`);
        this.loadWaitingList('BUSCANDO_CITA', this.selectedEspecialidad());
      },
      error: (err: any) => console.error('Error al actualizar:', err)
    });
  }
}