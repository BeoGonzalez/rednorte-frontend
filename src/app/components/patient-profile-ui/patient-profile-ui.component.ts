import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-profile-ui',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-profile-ui.component.html',
  styleUrls: ['./patient-profile-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientProfileUiComponent {
  @Input({ required: true }) patient: any;
  @Output() onSchedule = new EventEmitter<void>();
}