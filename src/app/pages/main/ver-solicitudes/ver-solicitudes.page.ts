import { Component, OnInit} from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { AuthService } from '../../../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-ver-solicitudes',
  templateUrl: './ver-solicitudes.page.html',
  styleUrls: ['./ver-solicitudes.page.scss'],
})
export class VerSolicitudesPage implements OnInit {
  solicitudes: any[] = [];
  solicitudesFiltradas: any[] = [];
  filtroLocalidad: string = '';
  criterioOrden: string = 'creacionAsc';
  localidades: string[] = [];
  filtroEstado: string = '';
  solicitudSeleccionada: any = null;
  isModalOpen: boolean = false;
  uidUsuario: string | null = null;
  prioridad: 'importante' | 'medio' | 'bajo';
  mostrarFiltros: boolean = false;

  fechaInicio: string = '';  // Fecha de inicio seleccionada
  fechaFin: string = '';     // Fecha de fin seleccionada
  mostrarFechaFiltro: boolean = false;
  
  

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router, 
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    // Obtener el UID del usuario autenticado desde localStorage
    this.uidUsuario = this.authService.getUsuarioUID();

    // Obtener solicitudes desde Firebase
    this.firebaseService.obtenerSolicitudes().subscribe((data) => {
      // Filtrar solicitudes por UID si el usuario es un solicitante
      if (this.uidUsuario) {
        this.solicitudes = data.filter(solicitud => solicitud.uid === this.uidUsuario);
      } else {
        this.solicitudes = data; // Administradores o técnicos ven todo
      }
      this.localidades = [...new Set(this.solicitudes.map(s => s.localidad))];
      this.filtrarSolicitudes();
    });
  }

   

  filtrarSolicitudes() {
    // Aplicar filtros de localidad y estado
    this.solicitudesFiltradas = this.solicitudes.filter((solicitud) => {
      const localidadMatch = !this.filtroLocalidad || solicitud.localidad === this.filtroLocalidad;
      const estadoMatch = !this.filtroEstado || solicitud.estado === this.filtroEstado;

      // Filtrar también por fechas si están definidas
      const fechaInicio = this.fechaInicio ? new Date(this.fechaInicio) : null;
      const fechaFin = this.fechaFin ? new Date(this.fechaFin) : null;
      const fechaSolicitud = solicitud.fecha.toDate(); // Convertir a objeto Date

      const fechaMatch = (!fechaInicio || fechaSolicitud >= fechaInicio) &&
                         (!fechaFin || fechaSolicitud <= fechaFin);

      return localidadMatch && estadoMatch && fechaMatch;
    });

    
  
    // Ordenar por fecha
    if (this.criterioOrden === 'creacionDesc') {
      this.solicitudesFiltradas.sort((a, b) => b.fecha.toDate() - a.fecha.toDate());
    } else if (this.criterioOrden === 'creacionAsc') {
      this.solicitudesFiltradas.sort((a, b) => a.fecha.toDate() - b.fecha.toDate());
    }
  
    // Asegurar nombre predeterminado si falta
    this.solicitudesFiltradas = this.solicitudesFiltradas.map((solicitud) => ({
      ...solicitud,
      nombre: solicitud.nombre || 'Usuario no especificado',
    }));
  }
  

  // Método para mostrar los detalles de la solicitud seleccionada
  mostrarDetalles(solicitud) {
    this.solicitudSeleccionada = solicitud;
    this.isModalOpen = true;
  }

  // Método para filtrar solicitudes por fecha
  filtrarPorFecha() {
    // Llamar a la función para actualizar las solicitudes filtradas
    this.filtrarSolicitudes();
  }


  // Método para cerrar el modal de detalles
  cerrarDetalles() {
    this.isModalOpen = false;
    this.solicitudSeleccionada = null;
  }

  // Método para alternar la visibilidad de los detalles de la solicitud
  toggleDetalles(solicitud) {
    solicitud.mostrarDetalles = !solicitud.mostrarDetalles;
  }

  // Método para cambiar estado y prioridad
cambiarEstadoYPrioridad(solicitud: any) {
  const nuevoEstado = solicitud.estado; // Obtener el estado seleccionado
  const nuevaPrioridad = solicitud.prioridad; // Obtener la prioridad seleccionada
  const cambios: any = { 
    estado: nuevoEstado,
    prioridad: nuevaPrioridad // Agregar prioridad al objeto de cambios
  };

  // Agregar la fecha de cambio según el nuevo estado
  if (nuevoEstado === 'En curso') {
    cambios.fechaEnCurso = new Date(); // Guardar la fecha de cambio a "En curso"
  } else if (nuevoEstado === 'Finalizada') {
    cambios.fechaFinalizada = new Date(); // Guardar la fecha de cambio a "Finalizada"
  }

  this.firebaseService
    .actualizarSolicitud(solicitud.id, cambios)
    .then(() => {
      console.log(`Estado actualizado a: ${nuevoEstado}`);
      console.log(`Prioridad actualizada a: ${nuevaPrioridad}`);
      
      if (cambios.fechaEnCurso) {
        console.log(`Fecha de cambio a 'En curso': ${cambios.fechaEnCurso}`);
      }
      if (cambios.fechaFinalizada) {
        console.log(`Fecha de cambio a 'Finalizada': ${cambios.fechaFinalizada}`);
      }
    })
    .catch((error) => console.error('Error al actualizar el estado y la prioridad:', error));
}
  

  eliminarYRedirigir(solicitud: any) {
    if (!solicitud) return; // Verifica si hay una solicitud seleccionada
  
    // Mostrar alerta de confirmación
    this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar la solicitud de ${solicitud.nombre}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          },
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.firebaseService
              .eliminarSolicitud(solicitud.id)
              .then(() => {
                console.log(`Solicitud ${solicitud.id} eliminada`);
                localStorage.setItem('mensaje','Solicitud eliminada con éxito')
                // Cerrar el modal
                this.modalController.dismiss();
                this.mostrarMensajeExito('Solicitud eliminada con éxito');
                // Redirigir a la página de ver solicitudes
                this.router.navigate(['/main/ver-solicitudes']);
                
              })
              .catch((error) => console.error('Error al eliminar la solicitud:', error));
          },
        },
      ],
    }).then((alert) => alert.present()); // Presentar el cartel
  }
  // Método para mostrar mensaje de éxito
async mostrarMensajeExito(mensaje: string) {
  const toast = await this.toastController.create({
    message: mensaje,
    duration: 2000, // Duración del mensaje (en milisegundos)
    position: 'middle', // Ubicación del mensaje en la pantalla
    color: 'success', // Color del mensaje (puede ser 'success', 'danger', 'warning', etc.)
  });
  toast.present(); // Mostrar el mensaje
}

  
  // Método para limpiar filtros
  limpiarFiltros() {
    this.filtroLocalidad = '';
    this.criterioOrden = '';
    this.fechaInicio = '';  // Limpiar el filtro de fecha de inicio
    this.fechaFin = '';
    this.filtroEstado = '';
    this.solicitudesFiltradas = [...this.solicitudes];
  }

  // Función para volver atrás
  irAHome() {
    this.router.navigate(['/main/home']);
  }

  getPriorityClass(prioridad: string): string {
  switch (prioridad) {
    case 'importante':
      return 'prioridad-importante';
    case 'medio':
      return 'prioridad-medio';
    case 'bajo':
      return 'prioridad-bajo';
    default:
      return '';
  }
}

toggleFiltros() {
  this.mostrarFiltros = !this.mostrarFiltros;
  this.mostrarFechaFiltro = !this.mostrarFechaFiltro;
}


  cambiarPrioridad(solicitud: any) {
    console.log(
      `La prioridad de la solicitud ${solicitud.nombre} cambió a ${solicitud.prioridad}`
    );
  }
}
