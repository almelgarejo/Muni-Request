import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { FirebaseService } from '../../../services/firebase.service';
import { Router } from '@angular/router'; 
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth'; 
import { LoadingController } from '@ionic/angular';  // Importar LoadingController
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface UserData {
  name: string;
}

@Component({
  selector: 'app-registrar-solicitud',
  templateUrl: './registrar-solicitud.page.html',
  styleUrls: ['./registrar-solicitud.page.scss'],
})
export class RegistrarSolicitudPage implements OnInit {
  descripcion: string = '';
  nombre: string = '';  // El nombre se asignará aquí
  rut: string = '';
  rutInvalido: boolean = false;  // Variable para controlar si el RUT es válido
  departamento: string | null = null;
  localidad: string | null = null;
  archivoAdjunto: File | null = null;

  // Lista de departamentos para la selección
  departamentos: string[] = [
    'Informatica', 'DIDECO', 'SECPLA', 'DOM', 'DIMAO', 'Transito', 
    'Inspeccion', 'Seguridad', 'Salud', 'Educacion', 'Deportes', 
    'Cultura', 'Finanzas', 'Secretaria Municipal', 'Direccion Juridica', 
    'Comunicaciones'
  ];

  constructor(
    private firebaseService: FirebaseService,
    private navCtrl: NavController,
    private router: Router,
    private storage: AngularFireStorage,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.obtenerNombreUsuario();  // Llamar a la función para obtener el nombre del usuario
  }

  obtenerNombreUsuario() {
    this.afAuth.currentUser.then(user => {
      if (user) {
        // Si el displayName está vacío, lo obtenemos de Firestore
        this.nombre = user.displayName || '';  // Asigna el nombre si existe
        if (!this.nombre) {
          this.firestore.collection('users').doc(user.uid).get().subscribe(doc => {
            const userData = doc.data() as UserData;  // Usamos el tipo UserData aquí
            if (userData && userData.name) {  // Cambié 'nombre' por 'name'
              this.nombre = userData.name;  // Asigna el nombre desde Firestore
            } else {
              this.nombre = 'Nombre no disponible';  // Fallback si no existe el nombre
            }
          });
        }
      }
    }).catch(error => {
      console.log('Error obteniendo usuario:', error);
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.archivoAdjunto = file;
  }

  // Función para formatear el RUT con puntos y guión
  formatearRut(rut: string): string {
    const rutLimpio = rut.replace(/[^0-9kK]/g, '');
    const dv = rutLimpio.slice(-1).toUpperCase();
    const cuerpo = rutLimpio.slice(0, -1);
    const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${cuerpoFormateado}-${dv}`;
  }

  async mostrarCargando() {
    const loading = await this.loadingController.create({
      message: 'Registrando solicitud...',
      spinner: 'crescent'
    });
    await loading.present();
    return loading;
  }

  async ocultarCargando(loading: any) {
    await loading.dismiss();
  }

  enviarSolicitud(form: NgForm) {
    if (form.valid) {
      if (!this.validarRut(this.rut)) {
        this.rutInvalido = true;  // Activar el estado de RUT inválido
        alert('El RUT ingresado no es válido. Por favor, ingrese un RUT válido.');
        return;  // Detener el envío de la solicitud si el RUT no es válido
      }

      // Validación de la descripción
    if (this.descripcion.length < 20) {
      alert('La descripción del problema debe tener al menos 20 caracteres.');
      return;  // Detener el envío si la descripción es demasiado corta
    }
  
      const rutFormateado = this.formatearRut(this.rut);
  
      this.mostrarCargando().then(loading => {
        if (this.archivoAdjunto) {
          const filePath = `solicitudes/${Date.now()}_${this.archivoAdjunto.name}`;
          const fileRef = this.storage.ref(filePath);
          const uploadTask = this.storage.upload(filePath, this.archivoAdjunto);
  
          uploadTask.snapshotChanges().pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe(url => {
                this.guardarSolicitud(rutFormateado, url);
                this.ocultarCargando(loading);
              });
            })
          ).subscribe();
        } else {
          this.guardarSolicitud(rutFormateado, null);
          this.ocultarCargando(loading);
        }
      });
    } else {
      alert('Por favor, complete todos los campos requeridos.');
    }
  }
  

  private guardarSolicitud(rutFormateado: string, archivoUrl: string | null) {
    const nuevaSolicitud = {
      descripcion: this.descripcion,
      nombre: this.nombre,  // Se usa el nombre obtenido automáticamente
      rut: rutFormateado,
      localidad: this.localidad,
      departamento: this.departamento,  // Guardar departamento seleccionado
      fecha: new Date(),
      archivoUrl
    };

    this.firebaseService.agregarSolicitud(nuevaSolicitud)
      .then(() => {
        alert('Solicitud registrada con éxito');
        this.router.navigate(['/main/home']);
      })
      .catch(error => {
        alert('Error al registrar la solicitud: ' + error);
      });
  }

  volverAtras() {
    this.navCtrl.back();
  }

 // Función para validar el RUT (formato y dígito verificador)
 validarRut(rut: string): boolean {
  const rutLimpio = rut.replace(/[^0-9kK]/g, '');  // Elimina todo lo que no sea número o "k" (aceptando tanto minúscula como mayúscula)
  
  if (rutLimpio.length < 2) return false; // El RUT debe tener al menos 2 caracteres (número y dv)

  const cuerpo = rutLimpio.slice(0, -1);  // Cuerpo del RUT (sin el dígito verificador)
  const dv = rutLimpio.slice(-1).toUpperCase();  // Dígito verificador (convertido a mayúscula)
  
  let suma = 0;
  let multiplo = 2;

  // Recorre los dígitos del RUT y realiza los cálculos para verificar el dígito verificador
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i)) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const dvCalculado = 11 - (suma % 11);
  const dvEsperado = dvCalculado === 11 ? '0' : (dvCalculado === 10 ? 'K' : dvCalculado.toString());

  return dv === dvEsperado;  // Compara el dígito verificador calculado con el proporcionado
}


  // Función para formatear y verificar el RUT
  formatRut(event: any) {
    let value = event.target.value.replace(/\D/g, '');  // Elimina caracteres no numéricos

    // Aplicar formato de RUT con puntos y guión
    if (value.length > 1) {
      value = value.replace(/^(\d{1,2})(\d{3})(\d{3})(\d{1})$/, '$1.$2.$3-$4');
    }

    // Verificar si el RUT es válido
    if (this.validarRut(value)) {
      this.rut = value;  // Solo se asigna si el RUT es válido
      this.rutInvalido = false;  // RUT es válido, así que restablecemos el estado
    } else {
      this.rutInvalido = true;  // RUT no es válido
      this.rut = value;  // Asignamos el valor (incluso si es inválido)
    }
  }


}
