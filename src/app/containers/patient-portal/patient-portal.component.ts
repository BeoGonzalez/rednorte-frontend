import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientProfileUiComponent } from '../../components/patient-profile-ui/patient-profile-ui.component';
import { PatientService } from '../../core/services/patient.service'; 
import { WaitingListService } from '../../core/services/waiting-list.service';
import { RegistroSolicitud } from '../../models/waiting-list.models';

// 🟢 1. Importamos la interfaz del paciente que creamos
import { PacienteResponse } from '../../core/models/patient.models'; 

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
  private waitingListService = inject(WaitingListService);
  
  // 🟢 2. Tipamos el signal (puede ser PacienteResponse o null mientras carga)
  patientData = signal<PacienteResponse | null>(null);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadDataFromBff();
  }

  loadDataFromBff(): void {
    this.patientService.getPatientData().subscribe({
      // 🟢 3. Reemplazamos 'any' por 'PacienteResponse'
      next: (data: PacienteResponse) => {
        this.patientData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al conectar con el BFF:', err);
        this.isLoading.set(false);
      }
    });
  }

  handleScheduleAppointment() {
    const currentData = this.patientData();
    // Como ya está tipado, TypeScript sabe que currentData tiene una propiedad 'id'
    const idPaciente = currentData && currentData.id ? currentData.id : 1; 

    const nuevaSolicitud: RegistroSolicitud = {
      pacienteId: idPaciente,
      tipoSolicitud: 'MEDICINA_GENERAL', 
      gravedad: 'MEDIA'
    };

    console.log('Enviando solicitud a la lista de espera...', nuevaSolicitud);

    this.waitingListService.registrarSolicitud(nuevaSolicitud).subscribe({
      next: (response) => {
        alert(`¡Éxito! Has sido ingresado a la lista de espera.\nID Solicitud: ${response.id}\nEstado: ${response.estado}`);
      },
      error: (err) => {
        console.error('Error al registrar en lista de espera:', err);
        alert('Ocurrió un error al intentar registrarte en la lista de espera. Inténtalo nuevamente.');
      }
    });
  }
}