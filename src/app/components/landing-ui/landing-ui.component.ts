import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- ESTO ARREGLA EL *ngIf, *ngFor y | number

export interface RedNorteStats { pacientesEnEspera: number; horasReasignadas: number; hospitalesConectados: number; }
export interface NavItem { icon: string; label: string; link: string; }

@Component({
  selector: 'app-landing-ui',
  standalone: true,
  imports: [CommonModule], // <-- TIENE QUE ESTAR AQUÍ
  templateUrl: './landing-ui.component.html',
  styleUrls: ['./landing-ui.component.scss'], // Ojo: asegúrate de que el nombre coincida con tu archivo scss
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingUiComponent {
  @Input() stats: RedNorteStats | null = null;
  @Input() navItems: NavItem[] = [];
  
  @Output() loginClick = new EventEmitter<void>();
  @Output() navClick = new EventEmitter<string>();

  onLogin(): void { this.loginClick.emit(); }
  onNavClick(link: string): void { this.navClick.emit(link); }
}