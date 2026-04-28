import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

// Importamos el UI que acabamos de crear arriba
import { LandingUiComponent, RedNorteStats, NavItem } from '../../components/landing-ui/landing-ui.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, LandingUiComponent],
  templateUrl: './landing-page.component.html'
})
export class LandingPageComponent implements OnInit {
  
  stats$!: Observable<RedNorteStats>;
  
  navItems: NavItem[] = [
    { icon: 'home', label: 'Inicio', link: '/' },
    { icon: 'search', label: 'Consultar', link: '/portal' },
    { icon: 'admin_panel_settings', label: 'Admin', link: '/auth' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.stats$ = of({
      pacientesEnEspera: 12450,
      horasReasignadas: 3204,
      hospitalesConectados: 12
    });
  }

  handleLogin(): void {
    console.log('Navegando a login...');
  }

  handleNavNavigation(link: string): void {
    console.log('Navegando a:', link);
  }
}