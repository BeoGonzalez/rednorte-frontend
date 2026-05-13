import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Importación para el backend real

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
  private http = inject(HttpClient); // Inyectamos HTTP

  // Estado UI
  isPasswordVisible = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>(''); // Para mostrar errores reales

  // Formulario Reactivo Blindado (Ahora con username)
  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4)]], // Quitamos Validators.email
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  togglePasswordVisibility(): void {
    this.isPasswordVisible.update(v => !v);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }


onSubmit(): void {
  this.http.post<any>('http://localhost:8080/bff/auth/login', this.loginForm.value).subscribe({
  next: (res) => {
    localStorage.setItem('jwt_token', res.token);
    const payload = JSON.parse(atob(res.token.split('.')[1]));
    
    // 🔴 Redirección inteligente por ROL
    if (payload.rol === 'ROLE_MEDICO') {
      this.router.navigate(['/dashboard-medico']);
    } else {
      this.router.navigate(['/portal-pacientes']);
    }
  },
  error: () => this.errorMessage.set('Credenciales inválidas')
})
}
}