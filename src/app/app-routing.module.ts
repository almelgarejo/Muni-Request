import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthPageModule),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then(m => m.MainPageModule),
    canActivate: [AuthGuard],
    data: { role: ['admin', 'Técnico', 'Solicitante'] } // Este rol debe coincidir con el que tienes en Firebase
  },
  {
    path: 'home',  // Ruta para Home
    loadChildren: () => import('./pages/main/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard],
    data: { role: ['admin', 'Técnico', 'Solicitante'] }  // Todos los roles tienen acceso
  },
  {
    path: 'registrar-solicitud',
    loadChildren: () => import('./pages/main/registrar-solicitud/registrar-solicitud.module').then(m => m.RegistrarSolicitudPageModule),
    canActivate: [AuthGuard],
    data: { role: 'admin' } // Solo usuarios con rol "user"
  },
  {
    path: 'ver-solicitudes',  // Ruta para Ver Solicitudes
    loadChildren: () => import('./pages/main/ver-solicitudes/ver-solicitudes.module').then(m => m.VerSolicitudesPageModule),
    canActivate: [AuthGuard],
    data: { role: ['admin', 'Técnico'] }  // Todos los roles tienen acceso
  },
  {
    path: 'reportes',
    loadChildren: () => import('./pages/main/reportes/reportes.module').then(m => m.ReportesPageModule),
    canActivate: [AuthGuard],
    data: { role: 'admin' } // Solo usuarios con rol "admin"
  },
  {
    path: '**',
    loadChildren: () => import('./pages/e404/e404.module').then(m => m.E404PageModule)
  },
  
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
