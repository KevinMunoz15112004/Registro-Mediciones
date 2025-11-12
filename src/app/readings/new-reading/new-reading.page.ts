import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton, IonInput, IonText, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonHeader, IonToolbar, IonTitle, IonSpinner, IonImg, IonIcon, ToastController, LoadingController } from '@ionic/angular/standalone';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CameraService } from '../../services/camera.service';
import { LocationService } from '../../services/location.service';
import { ReadingService } from '../../services/reading.service';
import { addIcons } from 'ionicons';
import { camera, location } from 'ionicons/icons';
import { Reading } from '../../models/reading.model';

addIcons({ camera, location });

@Component({
  selector: 'app-new-reading',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonButton,
    IonInput,
    IonText,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonSpinner,
    IonImg,
    IonIcon
  ],
  templateUrl: './new-reading.page.html',
  styleUrls: ['./new-reading.page.scss'],
})
export class NewReadingPage implements OnInit {
  form!: FormGroup;
  isLoading = false;
  meterPhotoBase64: string | null = null;
  facadePhotoBase64: string | null = null;
  currentLocation: { latitude: number; longitude: number } | null = null;
  mapsLink: string | null = null;
  window = window;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private cameraService: CameraService,
    private locationService: LocationService,
    private readingService: ReadingService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    this.form = this.formBuilder.group({
      meterValue: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      observations: [''],
      zone: ['']
    });
  }

  ngOnInit() {
    this.requestLocationPermission();
  }

  async requestLocationPermission() {
    try {
      await this.locationService.requestPermissions();
    } catch (error) {
      this.showToast('Permiso de ubicación denegado', 'warning');
    }
  }

  async takeMeterPhoto() {
    try {
      this.isLoading = true;
      const loader = await this.loadingController.create({
        message: 'Capturando foto del medidor...'
      });
      await loader.present();

      this.meterPhotoBase64 = await this.cameraService.takeMeterPhoto().toPromise() || null;
      this.showToast('Foto del medidor capturada', 'success');
      await loader.dismiss();
    } catch (error) {
      this.showToast('Error al capturar foto del medidor', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async takeFacadePhoto() {
    try {
      this.isLoading = true;
      const loader = await this.loadingController.create({
        message: 'Capturando foto de la fachada...'
      });
      await loader.present();

      this.facadePhotoBase64 = await this.cameraService.takeFacadePhoto().toPromise() || null;
      this.showToast('Foto de la fachada capturada', 'success');
      await loader.dismiss();
    } catch (error) {
      this.showToast('Error al capturar foto de la fachada', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async getCurrentLocation() {
    try {
      this.isLoading = true;
      const loader = await this.loadingController.create({
        message: 'Obteniendo ubicación...'
      });
      await loader.present();

      const location = await this.locationService.getCurrentLocation().toPromise();
      if (location) {
        this.currentLocation = location;
        this.mapsLink = this.locationService.generateMapsLink(location.latitude, location.longitude);
        this.showToast('Ubicación obtenida exitosamente', 'success');
      }
      await loader.dismiss();
    } catch (error) {
      this.showToast('Error al obtener la ubicación', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async submitReading() {
    if (this.form.invalid || !this.meterPhotoBase64 || !this.facadePhotoBase64 || !this.currentLocation) {
      this.showToast('Por favor, completa todos los campos y captura las fotos', 'warning');
      return;
    }

    this.isLoading = true;
    const loader = await this.loadingController.create({
      message: 'Guardando lectura...'
    });
    await loader.present();

    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const userData = await this.authService.getUserData(user.uid);
      if (!userData) {
        throw new Error('Datos del usuario no encontrados');
      }

      const reading: Reading = {
        userId: user.uid,
        meterValue: parseFloat(this.form.get('meterValue')?.value),
        observations: this.form.get('observations')?.value || '',
        meterPhotoUrl: this.meterPhotoBase64,
        facadePhotoUrl: this.facadePhotoBase64,
        latitude: this.currentLocation.latitude,
        longitude: this.currentLocation.longitude,
        mapsLink: this.mapsLink!,
        createdAt: new Date(),
        userName: userData.displayName,
        userEmail: userData.email,
        zone: this.form.get('zone')?.value || ''
      };

      const readingId = await this.readingService.saveReading(reading);
      this.showToast('Lectura guardada exitosamente', 'success');
      this.form.reset();
      this.meterPhotoBase64 = null;
      this.facadePhotoBase64 = null;
      this.currentLocation = null;
      this.mapsLink = null;
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Error al guardar lectura:', error);
      this.showToast('Error al guardar la lectura', 'danger');
    } finally {
      this.isLoading = false;
      await loader.dismiss();
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  get meterValue() {
    return this.form.get('meterValue');
  }

  get observations() {
    return this.form.get('observations');
  }
}
