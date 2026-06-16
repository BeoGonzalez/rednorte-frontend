import { Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  // 🟢 IMPORTANTE: ReactiveFormsModule soluciona el error de [formGroup]
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private location = inject(Location);

  // 🟢 Conectamos las variables que tu HTML pide
  isPasswordVisible = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  // 🟢 Creamos el formulario reactivo
  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Funciones de la Interfaz (UI)
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
    
    // Enviamos los datos del formulario al backend
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        // Ajusta la ruta a donde quieras llevar al usuario al loguearse
        this.router.navigate(['/portal-pacientes']); 
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error(err);
        alert('Credenciales incorrectas');
      }
    });
  }
}