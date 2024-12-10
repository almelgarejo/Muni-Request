import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private authFirebase: AngularFireAuth) {}

  // Retorna el estado de autenticación del usuario como un Observable
  stateUser(): Observable<any> {
    return this.authFirebase.authState;
  }

  // Método para iniciar sesión y guardar el UID en localStorage
  async login(email: string, password: string): Promise<void> {
    try {
      const result = await this.authFirebase.signInWithEmailAndPassword(email, password);
      if (result.user) {
        // Guarda el UID en localStorage cuando el usuario inicia sesión
        localStorage.setItem('uid', result.user.uid);
      }
    } catch (error) {
      console.error('Error de inicio de sesión: ', error);
    }
  }

  // Cerrar sesión y limpiar el localStorage
  async logout(): Promise<void> {
    try {
      // Elimina el UID del localStorage al cerrar sesión
      localStorage.removeItem('uid');
      await this.authFirebase.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión: ', error);
    }
  }

  // Obtener el UID del usuario desde el localStorage
  getUsuarioUID(): string | null {
    return localStorage.getItem('uid');
  }

  // Verificar si el usuario está autenticado
  isUserAuthenticated(): boolean {
    const uid = this.getUsuarioUID();
    return !!uid; // Retorna true si hay un UID en el localStorage
  }
}
