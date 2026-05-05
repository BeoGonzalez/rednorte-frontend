import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Estado UI
  isPasswordVisible = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  // Formulario Reactivo Blindado
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  togglePasswordVisibility(): void {
    this.isPasswordVisible.update(v => !v);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    // Simulamos un retraso de red (Fake Backend)
    setTimeout(() => {
      console.log('Credenciales válidas (Simuladas):', this.loginForm.value);
      this.isLoading.set(false);
      // Aquí a futuro harás: this.authService.login(...) y luego rediriges al Dashboard
      // this.router.navigate(['/dashboard']);
    }, 1500);
  }
}