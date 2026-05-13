import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card-base" [ngClass]="{'glass-panel': isGlass()}">
      <ng-content></ng-content>
      @if (isGlass()) {
        <div class="glow-effect"></div>
      }
    </div>
  `,
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  isGlass = input<boolean>(true);
}
