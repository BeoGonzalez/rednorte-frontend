import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // <-- Esto habilita el uso de <router-outlet>
  templateUrl: './app.html', // <-- Asegúrate de que apunte a app.html
  styleUrl: './app.scss'     // O app.css, según el que uses
})
export class AppComponent {
  title = 'rednorte-frontend';
}