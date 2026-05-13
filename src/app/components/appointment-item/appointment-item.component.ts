import { Component, input, output } from '@angular/core';
import { Appointment } from '../../core/models/appointment.model';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { TagComponent } from '../../shared/ui/tag/tag.component';

@Component({
  selector: 'app-appointment-item',
  standalone: true,
  imports: [ButtonComponent, TagComponent],
  templateUrl: './appointment-item.component.html',
  styleUrls: ['./appointment-item.component.scss']
})
export class AppointmentItemComponent {
  // Recibe la entidad completa
  appointment = input.required<Appointment>();

  // Emite el ID del paciente cuando el médico hace clic
  onCallBox = output<string>();

  callToBox(): void {
    this.onCallBox.emit(this.appointment().id);
  }
}