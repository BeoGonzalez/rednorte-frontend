import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientProfileUiComponent } from '../../components/patient-profile-ui/patient-profile-ui.component';
import { PatientService } from '../../core/services/patient.service';
import { WaitingListService } from '../../core/services/waiting-list.service';
import { RegistroSolicitud } from '../../models/waiting-list.models';
import { PacienteResponse } from '../../core/models/patient.models';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-patient-portal',
  standalone: true,
  imports: [CommonModule, DatePipe, PatientProfileUiComponent, ReactiveFormsModule],
  templateUrl: './patient-portal.component.html',
  styleUrls: ['./patient-portal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientPortalComponent implements OnInit {
  private patientService = inject(PatientService);
  private waitingListService = inject(WaitingListService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  patientData = signal<PacienteResponse | null>(null);
  notificaciones = signal<any[]>([]);
  isLoading = signal<boolean>(true);
  showForm = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  submitSuccess = signal<string>('');
  submitError = signal<string>('');

  citaForm: FormGroup = this.fb.group({
    tipoSolicitud: ['MEDICINA_GENERAL', Validators.required],
    gravedad: ['MEDIA', Validators.required]
  });

  ngOnInit(): void {
    this.loadDataFromBff();
  }

  loadDataFromBff() {
    const authId = this.authService.getAuthId();

    if (!authId) {
      this.isLoading.set(false);
      return;
    }

    this.patientService.obtenerPorAuthId(authId).subscribe({
      next: (data) => {
        this.patientData.set(data);
        this.isLoading.set(false);
        this.cargarNotificaciones(data.id);
      },
      error: (err: any) => {
        console.error('Error al cargar el perfil del paciente:', err);
        this.patientData.set(null);
        this.isLoading.set(false);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  cargarNotificaciones(pacienteId: number): void {
    this.patientService.obtenerNotificaciones(pacienteId).subscribe({
      next: (data) => this.notificaciones.set(data),
      error: (err) => console.error('Error al cargar notificaciones:', err)
    });
  }

  handleScheduleAppointment(): void {
    this.showForm.update(v => !v);
    this.submitSuccess.set('');
    this.submitError.set('');
  }

  onSubmitCita(): void {
    if (this.citaForm.invalid) return;

    const idPaciente = this.patientData()?.id ?? 1;
    const nuevaSolicitud: RegistroSolicitud = {
      pacienteId: idPaciente,
      tipoSolicitud: this.citaForm.value.tipoSolicitud,
      gravedad: this.citaForm.value.gravedad
    };

    this.isSubmitting.set(true);
    this.submitError.set('');

    this.waitingListService.registrarSolicitud(nuevaSolicitud).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        this.submitSuccess.set(`Solicitud enviada — ID: ${response.id} | Estado: ${response.estado}`);
        this.showForm.set(false);
        this.citaForm.reset({ tipoSolicitud: 'MEDICINA_GENERAL', gravedad: 'MEDIA' });
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.submitError.set('Error al registrar la solicitud. Intenta nuevamente.');
        console.error(err);
      }
    });
  }
}
