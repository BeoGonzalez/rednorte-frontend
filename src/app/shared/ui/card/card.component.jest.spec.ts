import { TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';

describe('CardComponent (Jest)', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [CardComponent] }));

  it('isGlass() es true por defecto', () => {
    const fixture = TestBed.createComponent(CardComponent);
    expect(fixture.componentInstance.isGlass()).toBe(true);
  });

  it('respeta isGlass = false', () => {
    const fixture = TestBed.createComponent(CardComponent);
    fixture.componentRef.setInput('isGlass', false);
    expect(fixture.componentInstance.isGlass()).toBe(false);
  });
});
