import { Component, input, output, signal, OnInit, OnDestroy, effect } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit, OnDestroy {
  // Entradas estrictas (Clean Code)
  titulo = input.required<string>();
  subtitulo = input.required<string>();
  textoBoton = input<string>('Comenzar');

  // Salidas
  onAccion = output<void>();

  // Estado interno para el efecto visual
  tituloAnimado = signal<string>('');
  mostrarSubtitulo = signal<boolean>(false);
  
  private intervaloTypewriter: ReturnType<typeof setInterval> | undefined;

  ngOnInit(): void {
    this.iniciarEfectoEscritura();
  }

  private iniciarEfectoEscritura(): void {
    const textoCompleto = this.titulo();
    let indice = 0;

    this.intervaloTypewriter = setInterval(() => {
      if (indice < textoCompleto.length) {
        this.tituloAnimado.update(actual => actual + textoCompleto.charAt(indice));
        indice++;
      } else {
        clearInterval(this.intervaloTypewriter);
        // Cuando termina el título, revelamos el subtítulo y los botones suavemente
        setTimeout(() => this.mostrarSubtitulo.set(true), 300);
      }
    }, 45); // Velocidad de escritura
  }

  ngOnDestroy(): void {
    if (this.intervaloTypewriter) {
      clearInterval(this.intervaloTypewriter);
    }
  }
}