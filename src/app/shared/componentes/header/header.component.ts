import { Component, inject, Input, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() title!: string;
  @Input() backButton!: string;
  @Input() isModal!: boolean;
  @Input() showMenu!: boolean;

  userRole: string = '';  // Variable para almacenar el rol del usuario
  
  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);  // Inyecta el servicio de Firebase

  ngOnInit() {
    this.getUserRole();
  }

  // Método para obtener el rol del usuario desde Firebase o localStorage
  getUserRole() {
    // Si estás usando Firebase y tienes un servicio que te proporciona el usuario
    const user = this.utilsSvc.getFromLocalStorage('user'); // Obtener usuario desde localStorage

    if (user) {
      this.userRole = user.perfil;  // Asumimos que el rol está en la propiedad 'perfil'
    } else {
      this.firebaseSvc.user$.subscribe((user) => {
        if (user) {
          this.userRole = user.perfil; // Asumimos que el rol está en la propiedad 'perfil' del objeto de usuario de Firebase
        }
      });
    }
  }

  dismissModal() {
    return this.utilsSvc.dismissModal();
  }
}

