import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, catchError, map, startWith } from 'rxjs';
import { PatientService } from '../../core/services/patient.service';
import { Paciente } from '../../core/models/patient.model';
import { PatientProfileUiComponent } from '../../components/patient-profile-ui/patient-profile-ui.component';

// Interfaz para manejar el estado de la UI de forma reactiva
interface DashboardState {
  pacientes: Paciente[];
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [CommonModule, PatientProfileUiComponent], // Importamos el Presenter
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss']
})
export class DashboardContainerComponent implements OnInit {
  
  // 🔴 Manejamos la data como un flujo reactivo (Observable)
  state$!: Observable<DashboardState>;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.state$ = this.patientService.getPacientes().pipe(
      map(data => ({ pacientes: data, loading: false, error: null })),
      catchError(err => of({ 
        pacientes: [], 
        loading: false, 
        error: 'Ocurrió un error al cargar la base de datos de pacientes desde el BFF.' 
      })),
      startWith({ pacientes: [], loading: true, error: null }) // Estado inicial
    );
  }

  // Lógica si el Presenter emite un evento
  handleVerDetalle(rut: string) {
    console.log('El médico quiere ver el detalle del RUT:', rut);
    // Aquí podrías hacer this.router.navigate(...)
  }
}