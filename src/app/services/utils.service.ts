import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl =  inject(ToastController);
  modalCtrl = inject(ModalController);
  router =  inject(Router);

  // cargando //
  
  loading(){
    return this.loadingCtrl.create({ spinner: 'crescent'})
  }

  // toast //
  
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  // Enrutar las paginas disponibles //
  
  RouterLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  // Guardar elementos en local storage //
  
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value))
  }

  // Obtener un elemento de local storage//
  
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key))
  }

  // Modal //
  
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if(data) return data;
  }

  dismissModal(data?: any){
    return this.modalCtrl.dismiss(data);
  }



}
