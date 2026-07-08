import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { OnboardingComponent } from './onboarding.component';
import { AuthService } from '../../core/services/auth.service';
import { OnboardingService } from '../../core/services/onboarding.service';

describe('OnboardingComponent (Jest)', () => {
  let component: OnboardingComponent;
  const getRol = jest.fn();
  const isAuthenticated = jest.fn();
  const getAuthId = jest.fn();
  const crearPerfilPaciente = jest.fn();
  const crearPerfilMedico = jest.fn();
  const navigate = jest.fn();

  const build = () => {
    TestBed.configureTestingModule({
      imports: [OnboardingComponent],
      providers: [
        { provide: AuthService, useValue: { getRol, isAuthenticated, getAuthId } },
        { provide: OnboardingService, useValue: { crearPerfilPaciente, crearPerfilMedico } },
        { provide: Router, useValue: { navigate } },
      ],
    });
    component = TestBed.createComponent(OnboardingComponent).componentInstance;
  };

  const fillPaciente = () =>
    component.pacienteForm.setValue({ rut: '12345678-9', nombre: 'Juan', apellido: 'Pérez', email: 'j@t.cl' });
  const fillMedico = () =>
    component.medicoForm.setValue({ nombre: 'Ana', apellidos: 'Soto', specialty: 'CARDIO', registroMedico: 'R1' });

  beforeEach(() => {
    jest.clearAllMocks();
    getRol.mockReturnValue('ROLE_PACIENTE');
    isAuthenticated.mockReturnValue(true);
    getAuthId.mockReturnValue(10);
  });

  it('ngOnInit() redirige a /login si no está autenticado', () => {
    isAuthenticated.mockReturnValue(false);
    build();
    component.ngOnInit();
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });

  it('ngOnInit() no redirige si está autenticado', () => {
    build();
    component.ngOnInit();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('isMedico() refleja el rol', () => {
    getRol.mockReturnValue('ROLE_MEDICO');
    build();
    expect(component.isMedico()).toBe(true);
  });

  it('onSubmit() paciente válido crea perfil y navega al portal', () => {
    build();
    fillPaciente();
    crearPerfilPaciente.mockReturnValue(of({}));
    component.onSubmit();
    expect(crearPerfilPaciente).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/portal-pacientes']);
    expect(component.isSubmitting()).toBe(false);
  });

  it('onSubmit() médico válido crea perfil y navega al dashboard', () => {
    getRol.mockReturnValue('ROLE_MEDICO');
    build();
    fillMedico();
    crearPerfilMedico.mockReturnValue(of({}));
    component.onSubmit();
    expect(crearPerfilMedico).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/dashboard-medico']);
  });

  it('onSubmit() con form inválido no llama al servicio', () => {
    build();
    component.onSubmit();
    expect(crearPerfilPaciente).not.toHaveBeenCalled();
  });

  it('onSubmit() con error usa el mensaje del backend', () => {
    build();
    fillPaciente();
    crearPerfilPaciente.mockReturnValue(throwError(() => ({ error: { error: 'RUT inválido' } })));
    component.onSubmit();
    expect(component.submitError()).toBe('RUT inválido');
    expect(component.isSubmitting()).toBe(false);
  });

  it('onSubmit() con error sin detalle usa el texto por defecto', () => {
    build();
    fillPaciente();
    crearPerfilPaciente.mockReturnValue(throwError(() => ({})));
    component.onSubmit();
    expect(component.submitError()).toContain('Error al guardar');
  });
});
