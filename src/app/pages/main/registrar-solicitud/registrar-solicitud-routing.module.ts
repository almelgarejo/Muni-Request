import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrarSolicitudPage } from './registrar-solicitud.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarSolicitudPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarSolicitudPageRoutingModule {}
