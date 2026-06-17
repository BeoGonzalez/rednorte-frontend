import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaitingListService } from '../../core/services/waiting-list.service';
import { PatientService } from '../../core/services/patient.service';
import { AuthService } from '../../core/services/auth.service';
import { SolicitudResponse } from '../../models/waiting-list.models';

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
  private authService = inject(AuthService);

  doctorName = signal<string>('Dr. Mendoza');
  waitingPatients = signal<SolicitudResponse[]>([]);
  selectedEspecialidad = signal<string>('MEDICINA_GENERAL');
  isLoadingList = signal<boolean>(false);
  actionError = signal<string>('');

  // Snackbar
  snackbarVisible = signal<boolean>(false);
  snackbarMessage = signal<string>('');
  snackbarType = signal<'success' | 'error'>('success');
  private snackbarTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.loadWaitingList('BUSCANDO_CITA', 'MEDICINA_GENERAL');
  }

  logout(): void {
    this.authService.logout();
  }

  private showSnackbar(message: string, type: 'success' | 'error' = 'success'): void {
    if (this.snackbarTimer) clearTimeout(this.snackbarTimer);
    this.snackbarMessage.set(message);
    this.snackbarType.set(type);
    this.snackbarVisible.set(true);
    this.snackbarTimer = setTimeout(() => this.snackbarVisible.set(false), 3000);
  }

  loadWaitingList(estado: string, especialidad: string): void {
    this.selectedEspecialidad.set(especialidad);
    this.isLoadingList.set(true);

    this.waitingListService.getWaitingList(estado, especialidad).subscribe({
      next: (data: SolicitudResponse[]) => {
        this.waitingPatients.set(data);
        this.isLoadingList.set(false);
      },
      error: (err) => {
        console.error('Error al cargar la lista de espera', err);
        this.isLoadingList.set(false);
      }
    });
  }

  gestionarSolicitud(id: number, nuevoEstado: string): void {
    this.actionError.set('');
    this.waitingListService.updateSolicitud(id, { estado: nuevoEstado }).subscribe({
      next: () => {
        const msg = nuevoEstado === 'ACEPTADA' ? 'Ha aceptado la cita' : 'Ha rechazado la cita';
        this.showSnackbar(msg, 'success');
        this.loadWaitingList('BUSCANDO_CITA', this.selectedEspecialidad());
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.showSnackbar(`No se pudo actualizar la solicitud #${id}.`, 'error');
      }
    });
  }
}
