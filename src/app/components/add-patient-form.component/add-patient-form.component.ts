import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container neon-border">
      <h3>Registrar Nuevo Paciente</h3>
      <form [formGroup]="patientForm" (ngSubmit)="send()">
        <input formControlName="rut" placeholder="RUT (12.345.678-9)">
        <input formControlName="nombre" placeholder="Nombre">
        <input formControlName="email" placeholder="Email institucional">
        <button type="submit" [disabled]="patientForm.invalid" class="btn-neon">
          Guardar Paciente
        </button>
      </form>
    </div>
  `,
  styleUrls: ['./add-patient-form.component.scss']
})
export class AddPatientFormComponent {
  private fb = inject(FormBuilder);
  @Output() onSave = new EventEmitter<any>();

  patientForm = this.fb.group({
    rut: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });

  send() {
    this.onSave.emit(this.patientForm.value);
    this.patientForm.reset();
  }
}