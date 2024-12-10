import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './componentes/header/header.component';
import { CustomComponent } from './componentes/custom/custom.component';
import { LogoComponent } from './componentes/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdateRequestComponent } from './componentes/add-update-request/add-update-request.component';
import { GraficoModalComponent } from './componentes/grafico-modal/grafico-modal.component';
import { SafeUrlPipe } from '../pipes/safe-url.pipe';




@NgModule({
  declarations: [
    HeaderComponent,
    CustomComponent,
    LogoComponent,
    AddUpdateRequestComponent,
    GraficoModalComponent,
    SafeUrlPipe,
  ],
  exports: [
    HeaderComponent,
    CustomComponent,
    LogoComponent,
    ReactiveFormsModule,
    AddUpdateRequestComponent,
    SafeUrlPipe,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class SharedModule { }
