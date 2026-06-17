import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';

import { DoctorDirectoryComponent } from './doctor-directory.component';
import { DoctorService } from '../../core/services/doctor.service';

describe('DoctorDirectoryComponent', () => {
  let component: DoctorDirectoryComponent;
  let fixture: ComponentFixture<DoctorDirectoryComponent>;

  const doctorSpy = { getDoctores: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();
    doctorSpy.getDoctores.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [DoctorDirectoryComponent],
      providers: [{ provide: DoctorService, useValue: doctorSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorDirectoryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('cargarDoctores()', () => {
    it('éxito — debería poblar doctores y apagar cargando', () => {
      const mockDocs = [{ id: 1, nombre: 'Dr. García', especialidad: 'Cardiología' }] as any[];
      doctorSpy.getDoctores.mockReturnValue(of(mockDocs));

      component.cargarDoctores();

      expect(component.doctores).toHaveLength(1);
      expect(component.cargando).toBe(false);
    });

    it('error — debería apagar cargando sin crashear', () => {
      doctorSpy.getDoctores.mockReturnValue(throwError(() => new Error('500')));

      component.cargarDoctores();

      expect(component.cargando).toBe(false);
    });
  });

  describe('filtrar()', () => {
    beforeEach(() => {
      component.doctores = [
        { id: 1, nombre: 'Dr. García', especialidad: 'Cardiología' } as any,
        { id: 2, nombre: 'Dr. Pérez', especialidad: 'Neurología' } as any,
      ];
    });

    it('con especialidad — debería filtrar por coincidencia', () => {
      component.filtroEspecialidad = 'cardio';
      component.filtrar();
      expect(component.doctoresFiltrados).toHaveLength(1);
    });

    it('sin especialidad — debería mostrar todos los doctores', () => {
      component.filtroEspecialidad = '';
      component.filtrar();
      expect(component.doctoresFiltrados).toHaveLength(2);
    });
  });
});
