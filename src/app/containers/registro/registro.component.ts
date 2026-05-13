import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);

  // Estados reactivos para la interfaz de usuario
  isPasswordVisible = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  // Definición del formulario con validaciones según la rúbrica
  registroForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rol: ['ROLE_PACIENTE', Validators.required]
  });

  togglePasswordVisibility(): void {
    this.isPasswordVisible.update(v => !v);
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    // Preparación del objeto de datos para el microservicio de seguridad
    const payload = {
      username: this.registroForm.value.username,
      password: this.registroForm.value.password,
      rol: this.registroForm.value.rol
    };

    /**
     * Petición POST al API Gateway (Puerto 8080)
     * La ruta /api/auth/ coincide con la configuración de tu Gateway
     */
    this.http.post<any>('http://localhost:8080/bff/auth/register', payload).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.successMessage.set('¡Cuenta creada con éxito! Redirigiendo...');
        
        // Retraso de 2 segundos para mostrar el mensaje de éxito antes de navegar
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading.set(false);
        
        // Manejo detallado de errores para depuración
        if (err.status === 400) {
          this.errorMessage.set('El nombre de usuario ya está en uso.');
        } else if (err.status === 0) {
          // Error 0 suele indicar que el Gateway rechazó la conexión (CORS) o está apagado
          this.errorMessage.set('Error de conexión: El servidor no responde o hay un bloqueo de CORS.');
        } else {
          this.errorMessage.set(err.error?.mensaje || 'Ocurrió un error inesperado en el servidor.');
        }
        console.error('Error en el registro:', err);
      }
    });
  }
}