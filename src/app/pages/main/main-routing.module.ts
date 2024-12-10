import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'management',
        loadChildren: () => import('./management/management.module').then(m => m.ManagementPageModule)
      },
      {
        path: 'registrar-solicitud', // Ruta para registrar solicitud
        loadChildren: () => import('./registrar-solicitud/registrar-solicitud.module').then(m => m.RegistrarSolicitudPageModule)
      },
      {
        path: 'ver-solicitudes', // Ruta para ver solicitud
        loadChildren: () => import('./ver-solicitudes/ver-solicitudes.module').then(m => m.VerSolicitudesPageModule)
      },
      {
        path: 'reportes',
        loadChildren: () => import('./reportes/reportes.module').then( m => m.ReportesPageModule)
      },
    ]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainPageRoutingModule {} // Asegúrate de que el nombre de la clase coincida
