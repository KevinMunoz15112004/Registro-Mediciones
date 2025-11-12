import { Injectable } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';

/**
 * Servicio de utilidades para componentes comunes
 */
@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  async showLoading(message: string = 'Cargando...'): Promise<HTMLIonLoadingElement> {
    const loader = await this.loadingController.create({
      message
    });
    await loader.present();
    return loader;
  }

  async dismissLoading(loader: HTMLIonLoadingElement) {
    await loader.dismiss();
  }

  async showToast(message: string, color: string = 'primary', duration: number = 3000) {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  async showAlert(header: string, message: string, buttons: any[] = []) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: buttons.length > 0 ? buttons : ['OK']
    });
    await alert.present();
  }

  async showConfirmAlert(header: string, message: string, onConfirm: () => void): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          role: 'destructive',
          handler: onConfirm
        }
      ]
    });
    await alert.present();
  }

  /**
   * Valida un correo electrónico
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida un número decimal
   */
  isValidNumber(value: any): boolean {
    const numberRegex = /^\d+(\.\d{1,2})?$/;
    return numberRegex.test(value);
  }

  /**
   * Formatea una fecha al formato español
   */
  formatDateES(date: any): string {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  /**
   * Formatea una fecha y hora al formato español
   */
  formatDateTimeES(date: any): string {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  /**
   * Convierte un número a formato moneda
   */
  formatCurrency(value: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency
    }).format(value);
  }

  /**
   * Calcula la distancia entre dos coordenadas GPS (Haversine)
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en km
  }
}
