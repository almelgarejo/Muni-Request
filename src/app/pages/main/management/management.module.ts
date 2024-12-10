import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagementPageRoutingModule } from './management-routing.module';

import { ManagementPage } from './management.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagementPageRoutingModule,
    SharedModule
  ],
  declarations: [ManagementPage]
})
export class ManagementPageModule {}
