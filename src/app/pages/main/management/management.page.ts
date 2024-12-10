import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-management',
  templateUrl: './management.page.html',
  styleUrls: ['./management.page.scss'],
})
export class ManagementPage implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  generatedPassword: string = '';
  showPassword: boolean = false;


  // Formulario de creación/edición de usuarios
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    perfil: new FormControl('Solicitante', [Validators.required]),
  });

  constructor(
    private firebaseService: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  firebaseSvc = inject(FirebaseService);

  ngOnInit() {
    this.getUsersList();
  }
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  

  // Generar una contraseña aleatoria
  generateRandomPassword(): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    const passwordLength = 12;
    let randomPassword = '';
    for (let i = 0; i < passwordLength; i++) {
      randomPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.generatedPassword = randomPassword; // Asignar a la variable
    this.form.controls['password'].setValue(randomPassword); // Actualizar el formulario
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      try {
        const userCredential = await this.firebaseSvc.signUp(
          this.form.value as User
        );

        const uid = userCredential.user?.uid;

        const userData = {
          ...this.form.value,
          uid,
        };

        await this.firebaseSvc.setDocument(`users/${uid}`, userData);

        // Mostrar mensaje de éxito
        this.utilsSvc.presentToast({
          message: 'Usuario creado exitosamente',
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      } catch (error) {
        console.error(error);
        this.utilsSvc.presentToast({
          message: error.message || 'Error al crear el usuario',
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      } finally {
        loading.dismiss();
        this.form.reset();
      }
    }
  }

  // Guardar información del usuario
  async setUserInfo(uid: string) {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      const path = `users/${uid}`;
      const userData = { ...this.form.value };
      delete userData.password; // No almacenar contraseñas en la base de datos

      await this.firebaseSvc.setDocument(path, userData);

      this.utilsSvc.saveInLocalStorage('user', userData);
      this.utilsSvc.RouterLink('/main/home');
    } catch (error) {
      console.log(error);
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    } finally {
      loading.dismiss();
    }
  }

  // Obtener la lista de usuarios
  getUsersList() {
    this.firebaseService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  // Seleccionar un usuario de la lista
  selectUser(user: User) {
    this.selectedUser = { ...user }; // Clona el objeto usuario seleccionado
  }

  // Guardar los cambios en el usuario seleccionado
  saveChanges() {
    if (this.selectedUser) {
      this.firebaseService
        .updateUserID(this.selectedUser.uid, {
          name: this.selectedUser.name,
          email: this.selectedUser.email,
        })
        .then(() => {
          this.utilsSvc.presentToast({
            message: 'Usuario actualizado exitosamente',
            duration: 2000,
          });
        })
        .catch((error) => {
          console.error('Error al actualizar usuario:', error);
          this.utilsSvc.presentToast({
            message: 'Error al actualizar usuario',
            duration: 2000,
            color: 'danger',
          });
        });
    }
  }

  // Confirmar antes de eliminar el usuario
  confirmDeleteUser(user: User) {
    if (confirm(`¿Estás seguro de que deseas eliminar a ${user.name}?`)) {
      this.deleteUser(user);
    }
  }

  // Eliminar usuario seleccionado
  deleteUser(user: User) {
    this.firebaseService
      .deleteUserById(user.uid)
      .then(() => {
        this.utilsSvc.presentToast({
          message: 'Usuario eliminado exitosamente',
          duration: 2000,
        });
        this.getUsersList(); // Actualiza la lista de usuarios después de eliminar
      })
      .catch((error) => {
        console.error('Error al eliminar usuario:', error);
        this.utilsSvc.presentToast({
          message: 'Error al eliminar usuario',
          duration: 2000,
          color: 'danger',
        });
      });
  }
}
