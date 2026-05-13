import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientProfileUiComponent } from '../../components/patient-profile-ui/patient-profile-ui.component';
import { PatientService } from '../../core/services/patient.service'; // Importamos el servicio

@Component({
  selector: 'app-patient-portal',
  standalone: true,
  imports: [CommonModule, PatientProfileUiComponent],
  templateUrl: './patient-portal.component.html',
  styleUrls: ['./patient-portal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientPortalComponent implements OnInit {
  private patientService = inject(PatientService);
  
  // Iniciamos el signal como null o con un objeto vacío
  patientData = signal<any>(null);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadDataFromBff();
  }

 loadDataFromBff(): void {
    this.patientService.getPatientData().subscribe({
      // 🔴 Agrega ": any" aquí
      next: (data: any) => {
        this.patientData.set(data);
        this.isLoading.set(false);
      },
      // 🔴 Agrega ": any" aquí
      error: (err: any) => {
        console.error('Error al conectar con el BFF:', err);
        this.isLoading.set(false);
      }
    });
  }

  handleScheduleAppointment() {
    console.log('Lógica de agendamiento...');
  }
}