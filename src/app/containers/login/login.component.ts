import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../models/auth.models';
// Asegúrate de importar FormsModule o ReactiveFormsModule si usas formularios

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Variable enlazada a tu formulario HTML
  credentials: LoginRequest = {
    username: '',
    password: ''
  };

  onSubmit() {
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        console.log('Login exitoso. Token recibido:', res.token);
        // Redirigir al usuario tras el login exitoso
        this.router.navigate(['/dashboard']); 
      },
      error: (err) => {
        console.error('Error de autenticación', err);
        alert('Credenciales incorrectas');
      }
    });
  }
}