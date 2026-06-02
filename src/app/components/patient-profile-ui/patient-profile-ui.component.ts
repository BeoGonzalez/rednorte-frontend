import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Paciente } from '../../core/models/patient.model';

@Component({
  selector: 'app-patient-profile-ui',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-profile-ui.component.html',
  styleUrls: ['./patient-profile-ui.component.scss']
})
export class PatientProfileUiComponent {
  // 🔴 Solo recibe datos, no llama a servicios
  @Input() pacientes: Paciente[] | null = [];
  @Input() isLoading: boolean = false;
  @Input() errorMessage: string | null = null;

  // 🔴 Emite eventos si el usuario hace clic en algo (ej. Ver detalle)
  @Output() verDetalle = new EventEmitter<string>();

  onVerDetalle(rut: string) {
    this.verDetalle.emit(rut);
  }
}