import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app';

describe('AppComponent (Jest)', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }),
  );

  it('se crea y expone el título', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
    expect(app.title).toBe('rednorte-frontend');
  });
});
