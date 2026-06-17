import { Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { OnboardingService } from '../../core/services/onboarding.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private onboardingService = inject(OnboardingService);
  private router = inject(Router);
  private location = inject(Location);

  isPasswordVisible = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  togglePasswordVisibility() {
    this.isPasswordVisible.update(v => !v);
  }

  goBack() {
    this.location.back();
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        const authId = res.authId;
        const rol = res.rol;

        const profileCheck$ = rol === 'ROLE_MEDICO'
          ? this.onboardingService.getPerfilMedico(authId)
          : this.onboardingService.getPerfilPaciente(authId);

        profileCheck$.subscribe({
          next: () => {
            this.isLoading.set(false);
            this.router.navigate(rol === 'ROLE_MEDICO' ? ['/dashboard-medico'] : ['/portal-pacientes']);
          },
          error: (err) => {
            this.isLoading.set(false);
            if (err.status === 404) {
              this.router.navigate(['/onboarding']);
            } else {
              // Profile check failed but not 404 — go to portal anyway
              this.router.navigate(rol === 'ROLE_MEDICO' ? ['/dashboard-medico'] : ['/portal-pacientes']);
            }
          }
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error(err);
        alert('Credenciales incorrectas');
      }
    });
  }
}
