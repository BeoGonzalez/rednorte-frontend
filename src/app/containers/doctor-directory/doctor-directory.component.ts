import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../core/services/doctor.service';
import { Doctor } from '../../core/models/doctor.models';

@Component({
  selector: 'app-doctor-directory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-directory.component.html',
  styleUrls: ['./doctor-directory.component.scss']
})
export class DoctorDirectoryComponent implements OnInit {
  private doctorService = inject(DoctorService);

  doctores: Doctor[] = [];
  doctoresFiltrados: Doctor[] = [];
  filtroEspecialidad: string = '';
  cargando: boolean = true;

  ngOnInit(): void {
    this.cargarDoctores();
  }

  cargarDoctores() {
    this.cargando = true;
    this.doctorService.getDoctores().subscribe({
      next: (data) => {
        this.doctores = data;
        this.doctoresFiltrados = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar doctores:', err);
        this.cargando = false;
      }
    });
  }

  filtrar() {
    if (!this.filtroEspecialidad) {
      this.doctoresFiltrados = this.doctores;
    } else {
      this.doctoresFiltrados = this.doctores.filter(doc => 
        doc.especialidad.toLowerCase().includes(this.filtroEspecialidad.toLowerCase())
      );
    }
  }
}