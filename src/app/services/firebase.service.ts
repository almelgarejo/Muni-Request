import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { UtilsService } from './utils.service';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private afAuth: AngularFireAuth) {}

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilSvc = inject(UtilsService);

  // ----- Autentificación ----- //

  getAuth() {
    return this.auth;
  }

  // Iniciar sesión
  signIn(user: User) {
    return this.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  // Registrar un nuevo usuario
  signUp(user: User) {
    return this.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

   // Obtener el nombre del usuario actual desde Firestore
  getUserName(): Promise<string | null> {
    return this.getCurrentUser().then(user => {
      if (user) {
        return this.getUserProfile(user.uid).toPromise().then(profile => profile?.name || null);
      }
      return null;
    });
  }
  // Actualizar información del usuario
  updateUser(displayName: string) {
    return this.auth.currentUser.then((user) => {
      if (user) {
        return user.updateProfile({ displayName });
      }
      return Promise.reject('No hay usuario autenticado');
    });
  }

  // Crear un nuevo usuario en Firestore
  async createUser(user: User) {
    const path = `users/${user.uid}`;
    const userData = { ...user };
    delete userData.password;

    return this.setDocument(path, userData).then(() => {
      console.log('Usuario creado en la base de datos');
    });
  }

  // Obtener el usuario actual
  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user) {
          resolve({
            uid: user.uid,
            email: user.email,
            name: user.displayName || '',
            perfil: 'visitante'
          } as User);
        } else {
          resolve(null);
        }
      }, reject);
    });
  }

  

  // Obtener la lista de usuarios
  getUsers(): Observable<User[]> {
    return this.firestore.collection<User>('users').snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as User;
          const uid = a.payload.doc.id;
          return { uid, ...data };
        })
      )
    );
  }

  // Eliminar usuario por UID
  deleteUserById(uid: string): Promise<void> {
    return this.firestore.collection('users').doc(uid).delete();
  }

  // Actualizar datos de un usuario por UID
  async updateUserID(uid: string, data: Partial<User>): Promise<void> {
    try {
      await this.firestore.collection('users').doc(uid).update(data);
      this.utilSvc.presentToast({ message: 'Usuario actualizado correctamente', duration: 2000 });
    } catch (error) {
      this.utilSvc.presentToast({ message: 'Error al actualizar usuario', duration: 2000, color: 'danger' });
      console.error("Error updating user:", error);
    }
  }

  // Enviar correo de recuperación de contraseña
  sendRecoveryEmail(email: string) {
    return this.auth.sendPasswordResetEmail(email);
  }

  // Eliminar cuenta del usuario
  deleteAccount(): Promise<void> {
    return this.auth.currentUser.then((user) => {
      if (user) {
        return user.delete();
      }
      return Promise.reject('No hay usuario autenticado');
    });
  }

  // Cerrar sesión
  signOut() {
    this.auth.signOut();
    localStorage.removeItem('user');
    this.utilSvc.RouterLink('/auth');
  }

  // ----- Base de Datos (Firestore) ----- //

  // Obtener perfil del usuario desde Firestore
  getUserProfile(uid: string): Observable<User | null> {
    return this.firestore.collection('users').doc(uid).valueChanges() as Observable<User | null>;
  }

  // Obtener el estado del usuario (autenticado o no)
  user$: Observable<User | null> = this.auth.authState.pipe(
    switchMap(user => (user ? this.getUserProfile(user.uid) : of(null)))
  );

  // Agregar una nueva solicitud
  // Agregar una nueva solicitud
  agregarSolicitud(solicitud: any): Promise<any> {
    return this.getCurrentUser().then(user => {
      if (user) {
        const solicitudConUid = { ...solicitud, uid: user.uid, estado: 'Pendiente' }; // Agrega el UID
        return this.firestore.collection('solicitudes').add(solicitudConUid);
      } else {
        return Promise.reject('Usuario no autenticado');
      }
    });
  }

  // Obtener solicitudes
  obtenerSolicitudes(): Observable<any[]> {
    return this.firestore
      .collection('solicitudes')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          console.log('Snapshot recibido:', actions); // Para ver el raw snapshot de Firestore
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            if (data && typeof data === 'object') {
              return { id, ...data };
            } else {
              return { id, data };
            }
          });
        })
      );
  }


  // Actualizar estado de una solicitud
  actualizarSolicitud(id: string, data: any): Promise<void> {
    return this.firestore.collection('solicitudes').doc(id).update(data);
  }

  // Eliminar una solicitud
  eliminarSolicitud(id: string): Promise<void> {
    return this.firestore.collection('solicitudes').doc(id).delete();
  }

  // Setear un documento en Firestore
  setDocument(path: string, data: any) {
    return this.firestore.doc(path).set(data);
  }

  // Obtener un documento específico desde Firestore
  async getDocument(path: string) {
    return (await this.firestore.doc(path).get().toPromise()).data();
  }
}
