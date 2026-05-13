import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="btn-base" 
      [ngClass]="'btn-' + variant()" 
      (click)="onClick.emit($event)">
      @if (icon()) {
        <span [class]="iconClass()">{{ icon() }}</span>
      }
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  variant = input<'primary' | 'ghost' | 'login' | 'outline'>('primary');
  icon = input<string | null>(null);
  iconClass = input<string>('material-icons');
  onClick = output<MouseEvent>();
}
