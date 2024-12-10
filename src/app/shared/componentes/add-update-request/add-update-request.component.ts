import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-request',
  templateUrl: './add-update-request.component.html',
  styleUrls: ['./add-update-request.component.scss'],
})
export class AddUpdateRequestComponent  implements OnInit {

  form = new FormGroup({
    id: new FormControl(''),
    Solicitud: new FormControl('',[Validators.required, Validators.minLength(4)]),
    desc: new FormControl('',[Validators.required, Validators.minLength(4)]),
    name: new FormControl('',[Validators.required, Validators.minLength(4)]),
    Localidad: new FormControl('',[Validators.required, Validators.minLength(4)]),
    Categoria: new FormControl('',[Validators.required, Validators.minLength(4)]),
    Adjuntar: new FormControl('',[Validators.required, Validators.minLength(4)]),
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  async submit() {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signUp(this.form.value as User).then(async res =>{

        await this.firebaseSvc.updateUser(this.form.value.name);

        let uid = res.user.uid;


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