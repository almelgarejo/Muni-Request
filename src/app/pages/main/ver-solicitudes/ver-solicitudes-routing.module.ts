import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerSolicitudesPage } from './ver-solicitudes.page';

const routes: Routes = [
  {
    path: '',
    component: VerSolicitudesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerSolicitudesPageRoutingModule {}
