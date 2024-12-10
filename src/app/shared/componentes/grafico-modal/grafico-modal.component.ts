import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-grafico-modal',
  templateUrl: './grafico-modal.component.html',
  styleUrls: ['./grafico-modal.component.scss'],
})
export class GraficoModalComponent {
  @Input() url!: string; // Recibe la URL del gráfico

  constructor(private modalCtrl: ModalController) {}

  cerrarModal() {
    this.modalCtrl.dismiss();
  }
}
