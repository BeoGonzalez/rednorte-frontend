import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorDirectory } from './doctor-directory';

describe('DoctorDirectory', () => {
  let component: DoctorDirectory;
  let fixture: ComponentFixture<DoctorDirectory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorDirectory],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorDirectory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
