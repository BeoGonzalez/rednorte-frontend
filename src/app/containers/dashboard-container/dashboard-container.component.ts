import { Component, inject, signal, OnInit } from '@angular/core';
import { AppointmentItemComponent } from '../../components/appointment-item/appointment-item.component';
import { Appointment } from '../../core/models/appointment.model';
// import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [AppointmentItemComponent],
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss']
})
export class DashboardContainerComponent implements OnInit {
  // private dashboardService = inject(DashboardService);
  
  doctorName = signal<string>('Dr. Mendoza');
  upcomingAppointments = signal<Appointment[]>([]);

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    // Aquí iría la llamada real a tu BFF/Backend. Simulamos los datos del HTML:
    const mockData: Appointment[] = [
      { id: '1', label: 'Ahora', time: '10:00', patientName: 'Carlos Mendoza', appointmentType: 'Consulta General', status: 'En sala de espera' },
      { id: '2', label: 'Hoy', time: '11:30', patientName: 'Ana Gómez S.', appointmentType: 'Revisión Exámenes', status: 'No ha llegado' }
    ];
    this.upcomingAppointments.set(mockData);
  }

  handleCallToBox(appointmentId: string): void {
    console.log(`Llamando a Box al paciente con ID: ${appointmentId}`);
    // Aquí ejecutas la lógica de negocio real (Notificar a recepción, cambiar estado en BD, etc.)
  }
}