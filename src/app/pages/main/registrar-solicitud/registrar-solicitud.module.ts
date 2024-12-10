import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RegistrarSolicitudPageRoutingModule } from './registrar-solicitud-routing.module';
import { RegistrarSolicitudPage } from './registrar-solicitud.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarSolicitudPageRoutingModule
  ],
  declarations: [RegistrarSolicitudPage] // Asegúrate de que esté declarado aquí
})
export class RegistrarSolicitudPageModule {}
