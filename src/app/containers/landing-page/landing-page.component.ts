import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LandingUiComponent } from '../../components/landing-ui/landing-ui.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [LandingUiComponent],
  template: `
    <app-landing-ui
      [navItems]="menuOptions()"
      [stats]="dashboardStats()"
      (navClick)="handleNavigation($event)"
      (loginClick)="handleLogin()"
      (registerClick)="handleRegister()"> 
    </app-landing-ui>
  `
})
export class LandingPageComponent implements OnInit {
  private router = inject(Router);

  // Rutas a tus microservicios
  menuOptions = signal([
    { icon: 'home', label: 'Inicio', link: '/' },
    { icon: 'personal_injury', label: 'Pacientes', link: '/pacientes' },
    { icon: 'format_list_numbered', label: 'Lista de Espera', link: '/lista-espera' }
  ]);

  // Datos simulados (luego vendrán de tu API Gateway)
  dashboardStats = signal({
    pacientesEnEspera: 15420,
    horasReasignadas: 4850,
    hospitalesConectados: 18
  });

  ngOnInit(): void {
    // Lógica inicial si la necesitas
  }

  handleNavigation(route: string): void {
    this.router.navigate([route]);
  }

  handleLogin(): void {
    this.router.navigate(['/login']);
  }

  handleRegister(): void {
    this.router.navigate(['/registro']);
  }
}