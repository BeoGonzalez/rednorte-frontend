import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { DoctorDirectoryComponent } from './doctor-directory.component';
import { DoctorService } from '../../core/services/doctor.service';

describe('DoctorDirectoryComponent (Jest)', () => {
  let component: DoctorDirectoryComponent;
  const getDoctores = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    getDoctores.mockReturnValue(of([]));

    TestBed.configureTestingModule({
      imports: [DoctorDirectoryComponent],
      providers: [{ provide: DoctorService, useValue: { getDoctores } }],
    });
    component = TestBed.createComponent(DoctorDirectoryComponent).componentInstance;
  });

  it('ngOnInit() dispara la carga de doctores', () => {
    component.ngOnInit();
    expect(getDoctores).toHaveBeenCalled();
    expect(component.cargando).toBe(false);
  });

  it('cargarDoctores() éxito puebla las listas', () => {
    const docs = [{ id: 1, nombre: 'Dr. García', especialidad: 'Cardiología' }];
    getDoctores.mockReturnValue(of(docs));
    component.cargarDoctores();
    expect(component.doctores.length).toBe(1);
    expect(component.doctoresFiltrados.length).toBe(1);
    expect(component.cargando).toBe(false);
  });

  it('cargarDoctores() error apaga cargando', () => {
    getDoctores.mockReturnValue(throwError(() => new Error('500')));
    component.cargarDoctores();
    expect(component.cargando).toBe(false);
  });

  describe('filtrar()', () => {
    beforeEach(() => {
      component.doctores = [
        { id: 1, nombre: 'Dr. García', especialidad: 'Cardiología' } as any,
        { id: 2, nombre: 'Dr. Pérez', especialidad: 'Neurología' } as any,
      ];
    });

    it('filtra por especialidad', () => {
      component.filtroEspecialidad = 'cardio';
      component.filtrar();
      expect(component.doctoresFiltrados.length).toBe(1);
    });

    it('sin filtro muestra todos', () => {
      component.filtroEspecialidad = '';
      component.filtrar();
      expect(component.doctoresFiltrados.length).toBe(2);
    });
  });
});
