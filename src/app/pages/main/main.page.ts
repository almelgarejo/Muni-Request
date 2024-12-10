import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  allPages = [
    { title: 'Inicio', url: '/main/home', icon: 'home-outline', roles: ['admin', 'Técnico', 'Solicitante'] },
    { title: 'Perfil', url: '/main/profile', icon: 'person-outline', roles: ['admin', 'Técnico', 'Solicitante'] },
    { title: 'Gestión de Usuarios', url: '/main/management', icon: 'people-outline', roles: ['admin'] },
    { title: 'Gestión de Solicitudes', url: '/main/ver-solicitudes', icon: 'settings-outline', roles: ['admin', 'Técnico'] },
    { title: 'Reportes', url: '/main/reportes', icon: 'bar-chart-outline', roles: ['admin'] },
  ];

  pages = []; // Páginas visibles según el rol del usuario

  router = inject(Router);
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  currentPath: string = '';

  ngOnInit() {
    // Obtener el usuario y su rol
    const user = this.user();
    if (user) {
      // Guarda el rol en el servicio compartido
      this.utilsSvc.saveInLocalStorage('userRole', user.perfil);
    }
  
    // Filtrar las páginas según el rol
    const userRole = user?.perfil;
    this.pages = this.allPages.filter(page => page.roles.includes(userRole));
  
    // Detectar cambios en la ruta actual
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url;
    });
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  // Cerrar Sesión
  signOut() {
    this.firebaseSvc.signOut();
  }
}
