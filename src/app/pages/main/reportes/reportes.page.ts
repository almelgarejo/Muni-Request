// reportes.page.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { GraficoModalComponent } from 'src/app/shared/componentes/grafico-modal/grafico-modal.component';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage implements OnInit {
  @ViewChild('reportContainer', { static: true }) reportContainer!: ElementRef;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {
    
  }

  ngOnInit() {
    
  }
  async abrirModal(url: string) {
    const modal = await this.modalCtrl.create({
      component: GraficoModalComponent,
      componentProps: { url },
    });
    await modal.present();
  }
  
  descargarExcel() {
    const sheetId = '14oSRoHP2rY6ekiF1DU4W7xdzpWy7gE4Xm5j51KjTZZM'; // Reemplaza con tu ID de Google Sheets
    const downloadUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;
  
    // Redirige al enlace de descarga
    window.open(downloadUrl, '_blank');
  }
  

  volverAtras() {
    this.navCtrl.back();
  }
}
