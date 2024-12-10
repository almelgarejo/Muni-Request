import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import Swiper from 'swiper';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import { AddUpdateRequestComponent } from 'src/app/shared/componentes/add-update-request/add-update-request.component';
import { AngularFireAuth } from '@angular/fire/compat/auth'; 
import { AuthService } from 'src/app/services/auth.service'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  router = inject(Router);
  authService = inject(AuthService);

  solicitudesPendientes: any[] = [];
  solicitudesEnCurso: any[] = [];
  solicitudesFinalizadas: any[] = [];
  userRole: string = '';
  uid: string = '';

  constructor(
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    // Verifica si el UID se está obteniendo correctamente
    this.obtenerUid();
    console.log('UID del Usuario:', this.uid); // Verifica que el UID se obtiene correctamente
    this.obtenerSolicitudes();
    this.userRole = this.utilsSvc.getFromLocalStorage('userRole') || '';
  }

  obtenerUid() {
    this.afAuth.currentUser.then(user => {
      if (user) {
        this.uid = user.uid; // Guardar el UID del usuario
        this.obtenerSolicitudes();
      }
    });
  }

  ngAfterViewInit() {
    new Swiper('.swiper-container', {
      slidesPerView: 1,
      pagination: { clickable: true },
      navigation: true,
      loop: true,
    });
  }

  obtenerSolicitudes() {
    this.firebaseSvc.obtenerSolicitudes().subscribe((data) => {
      console.log('Solicitudes obtenidas:', data); // Verifica que las solicitudes se obtienen correctamente

      // Si el usuario es 'admin' o 'tecnico', mostramos todas las solicitudes
      if (this.userRole === 'admin' || this.userRole === 'tecnico') {
        this.solicitudesPendientes = data.filter(
          (solicitud) => solicitud.estado === 'Pendiente'
        );
        this.solicitudesEnCurso = data.filter(
          (solicitud) => solicitud.estado === 'En curso'
        );
        this.solicitudesFinalizadas = data.filter(
          (solicitud) => solicitud.estado === 'Finalizada'
        );
      } else {
        // Si el usuario no es 'admin' ni 'tecnico', filtramos solo sus solicitudes
        this.solicitudesPendientes = data.filter(
          (solicitud) => solicitud.estado === 'Pendiente' && solicitud.uid === this.uid
        );
        this.solicitudesEnCurso = data.filter(
          (solicitud) => solicitud.estado === 'En curso' && solicitud.uid === this.uid
        );
        this.solicitudesFinalizadas = data.filter(
          (solicitud) => solicitud.estado === 'Finalizada' && solicitud.uid === this.uid
        );
      }
    });
  }


  signOut() {
    this.firebaseSvc.signOut();
  }

  addUpdateRequest() {
    this.utilsSvc.presentModal({
      component: AddUpdateRequestComponent,
      cssClass: 'add-update-modal',
    });
  }

  navigateToRegistrarSolicitud() {
    this.router.navigate(['/main/registrar-solicitud']);
  }

      // Función de refresco
      doRefresh(event: any) {
        console.log('Refrescando datos...');
        // Aquí puedes realizar acciones como recargar datos desde Firebase
        setTimeout(() => {
          console.log('Datos refrescados');
          event.target.complete(); // Detiene el refresco
        }, 2000); // Simulación de tiempo de refresco
      }
}
