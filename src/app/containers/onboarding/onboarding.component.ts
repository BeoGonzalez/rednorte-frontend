import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { OnboardingService } from '../../core/services/onboarding.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private onboardingService = inject(OnboardingService);
  private router = inject(Router);

  rol = signal<string>(this.authService.getRol() ?? 'ROLE_PACIENTE');
  isMedico = computed(() => this.rol() === 'ROLE_MEDICO');

  isSubmitting = signal(false);
  submitError = signal<string | null>(null);

  pacienteForm: FormGroup = this.fb.group({
    rut:      ['', [Validators.required, Validators.pattern(/^[0-9]{7,8}-[0-9Kk]$/)]],
    nombre:   ['', Validators.required],
    apellido: ['', Validators.required],
    email:    ['', [Validators.required, Validators.email]]
  });

  medicoForm: FormGroup = this.fb.group({
    nombre:          ['', Validators.required],
    apellidos:       ['', Validators.required],
    specialty:       ['', Validators.required],
    registroMedico:  ['', Validators.required]
  });

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    const form = this.isMedico() ? this.medicoForm : this.pacienteForm;
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    const authId = this.authService.getAuthId()!;
    this.isSubmitting.set(true);
    this.submitError.set(null);

    const request$ = this.isMedico()
      ? this.onboardingService.crearPerfilMedico({ authId, ...this.medicoForm.value })
      : this.onboardingService.crearPerfilPaciente({ authId, ...this.pacienteForm.value });

    request$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(this.isMedico() ? ['/dashboard-medico'] : ['/portal-pacientes']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.submitError.set(err?.error?.error ?? 'Error al guardar el perfil. Intente nuevamente.');
      }
    });
  }
}
