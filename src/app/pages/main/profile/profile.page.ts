import { Component, inject, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  constructor(private alertController: AlertController, private firebaseService: FirebaseService) {}

  ngOnInit() {
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  signOut(){
    this.firebaseSvc.signOut();
  }
  

  // Función para mostrar el alert de confirmación
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Está seguro de eliminar su perfil?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Operación cancelada');
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.deleteAccount();  // Llama a la función para eliminar la cuenta
          }
        }
      ]
    });

    await alert.present();
  }

  // Función para eliminar la cuenta
  deleteAccount() {
    this.firebaseService.deleteAccount()
      .then(() => {
        console.log('Cuenta eliminada con éxito');
        // Aquí podrías redirigir al usuario o mostrar un mensaje
      })
      .catch((error) => {
        console.error('Error al intentar eliminar la cuenta:', error);
      });
  }
  
}
  
  




