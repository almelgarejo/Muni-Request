import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VerSolicitudesPageRoutingModule } from './ver-solicitudes-routing.module';
import { VerSolicitudesPage } from './ver-solicitudes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerSolicitudesPageRoutingModule
  ],
  declarations: [VerSolicitudesPage]
})
export class VerSolicitudesPageModule {}
