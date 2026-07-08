import { TestBed } from '@angular/core/testing';

import { TagComponent } from './tag.component';

describe('TagComponent (Jest)', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [TagComponent] }));

  it('variant() es "primary" por defecto', () => {
    const fixture = TestBed.createComponent(TagComponent);
    expect(fixture.componentInstance.variant()).toBe('primary');
  });

  it('respeta variant = "neutral"', () => {
    const fixture = TestBed.createComponent(TagComponent);
    fixture.componentRef.setInput('variant', 'neutral');
    expect(fixture.componentInstance.variant()).toBe('neutral');
  });
});
