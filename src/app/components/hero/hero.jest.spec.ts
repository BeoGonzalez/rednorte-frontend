import { TestBed } from '@angular/core/testing';

import { HeroComponent } from './hero.component';

describe('HeroComponent (Jest)', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [HeroComponent] }));

  it('usa el texto de botón por defecto', () => {
    jest.useFakeTimers();
    const fixture = TestBed.createComponent(HeroComponent);
    fixture.componentRef.setInput('titulo', 'Hola');
    fixture.componentRef.setInput('subtitulo', 'Mundo');
    fixture.detectChanges();

    expect(fixture.componentInstance.textoBoton()).toBe('Comenzar');

    fixture.destroy();
    jest.useRealTimers();
  });

  it('el efecto typewriter escribe el título y revela el subtítulo', () => {
    jest.useFakeTimers();
    const fixture = TestBed.createComponent(HeroComponent);
    fixture.componentRef.setInput('titulo', 'Red');
    fixture.componentRef.setInput('subtitulo', 'Norte');
    fixture.detectChanges(); // ejecuta ngOnInit una sola vez (evita doble intervalo)
    const component = fixture.componentInstance;

    jest.advanceTimersByTime(3 * 45 + 400); // largo del título + retardo del subtítulo

    expect(component.tituloAnimado()).toBe('Red');
    expect(component.mostrarSubtitulo()).toBe(true);

    fixture.destroy(); // dispara ngOnDestroy
    jest.useRealTimers();
  });
});
