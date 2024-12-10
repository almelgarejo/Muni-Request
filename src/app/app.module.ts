import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Firebase Imports
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // Importación de Firestore
import { AngularFireStorageModule } from '@angular/fire/compat/storage'; // Importación para manejar archivos
import { environment } from '../environments/environment';




@NgModule({
  declarations: [ AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ mode: 'md' }),
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), // Inicializar Firebase
    AngularFirestoreModule, // Modulo para Firestore
    AngularFireStorageModule // Modulo para almacenamiento de archivos en Firebase
  ],
  
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
  bootstrap: [AppComponent],
})
export class AppModule {}
