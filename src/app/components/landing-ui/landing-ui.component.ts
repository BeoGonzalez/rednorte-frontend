import { Component, input, output, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CardComponent } from '../../shared/ui/card/card.component';

@Component({
  selector: 'app-landing-ui',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent],
  templateUrl: './landing-ui.component.html',
  styleUrls: ['./landing-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingUiComponent {
  // Inputs usando Signals
  navItems = input<any[]>([]);
  stats = input<any>(null);

  // Outputs modernos para eventos
  navClick = output<string>();
  loginClick = output<void>();
  registerClick = output<void>();

  features = signal([
    { icon: 'memory', title: 'Motor Algorítmico', desc: 'Asignación inteligente de horas médicas basada en prioridad clínica y tiempos de espera.' },
    { icon: 'api', title: 'Microservicios Core', desc: 'Arquitectura escalable en la nube que garantiza 99.9% de uptime para la red.' },
    { icon: 'security', title: 'Seguridad Nominal', desc: 'Encriptación de extremo a extremo para proteger los datos sensibles de los pacientes.' }
  ]);

  steps = signal([
    { num: '01', title: 'Ingreso al Sistema', desc: 'El hospital o CESFAM registra al paciente en la Lista de Espera central.' },
    { num: '02', title: 'Análisis Triage', desc: 'El algoritmo clasifica la urgencia y busca disponibilidad en la red.' },
    { num: '03', title: 'Asignación Exitosa', desc: 'Notificación automática de la cita médica agendada al paciente.' }
  ]);
}