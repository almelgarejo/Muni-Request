import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required])
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);


  ngOnInit() {
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();
  
      this.firebaseSvc.signIn(this.form.value as User).then(res => {
        this.getUserInfo(res.user.uid);
      }).catch(async error => {
        console.log('Error capturado:', error);
  
        let errorMessage = 'El correo y/o contraseña ingresados no son validos';
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'El correo ingresado no es válido.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'La cuenta está deshabilitada.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No existe una cuenta con este correo.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'La contraseña ingresada es incorrecta.';
            break;
        }

         // Verifica si `presentToast` se está llamando correctamente
      console.log('Mensaje a mostrar:', errorMessage);
      await this.utilsSvc.presentToast({
        message: errorMessage,
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  } else {
    console.log('Formulario inválido:', this.form.value);
    await this.utilsSvc.presentToast({
      message: 'Por favor, completa todos los campos correctamente.',
      duration: 2500,
      color: 'danger',
      position: 'middle',
      icon: 'alert-circle-outline'
    });
  }
}

  async getUserInfo(uid: string) {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;

      this.firebaseSvc.getDocument(path).then((user: User) => {

        this.utilsSvc.saveInLocalStorage('user', user);
        this.utilsSvc.RouterLink('/main/home');
        this.form.reset();
        window.location.reload();

        this.utilsSvc.presentToast({
          message: `Bienvenido a Muni Request ${user.name}`,
          duration: 1500,
          color: 'primary',
          position: 'middle',
          icon: 'person-circle-outline'
        })


      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() => {
        loading.dismiss();
      })
      
    }
    
  }
  
}

