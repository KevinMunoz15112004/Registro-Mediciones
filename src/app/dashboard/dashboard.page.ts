import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonHeader, IonToolbar, IonTitle, IonSpinner, IonIcon, IonFab, IonFabButton, IonText, ToastController, LoadingController, AlertController } from '@ionic/angular/standalone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ReadingService } from '../services/reading.service';
import { addIcons } from 'ionicons';
import { add, logOut, trash, eye } from 'ionicons/icons';
import { Reading, User } from '../models/reading.model';
import { Subscription } from 'rxjs';

addIcons({ add, logOut, trash, eye });

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonSpinner,
    IonIcon,
    IonFab,
    IonFabButton,
    IonText
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  readings: Reading[] = [];
  isLoading = false;
  currentUser: User | null = null;
  isAdmin = false;
  private readingsSubscription: Subscription | null = null;
  private userSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private readingService: ReadingService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.userSubscription = this.authService.currentUser$.subscribe(async (user) => {
      if (user) {
        this.currentUser = await this.authService.getUserData(user.uid);
        this.isAdmin = this.currentUser?.role === 'admin';
        this.subscribeToReadings(user.uid);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy() {
    if (this.readingsSubscription) {
      this.readingsSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private subscribeToReadings(userId: string) {
    // Desuscribirse de la suscripción anterior si existe
    if (this.readingsSubscription) {
      this.readingsSubscription.unsubscribe();
    }

    // Suscribirse a los cambios en tiempo real
    this.readingsSubscription = (this.isAdmin 
      ? this.readingService.getAllReadings() 
      : this.readingService.getMyReadings(userId)
    ).subscribe({
      next: (readings) => {
        this.readings = readings.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar lecturas en tiempo real:', error);
        this.showToast('Error al cargar las lecturas', 'danger');
        this.isLoading = false;
      }
    });
  }

  async loadUserData() {
    try {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.currentUser = await this.authService.getUserData(user.uid);
        this.isAdmin = this.currentUser?.role === 'admin';
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  async deleteReading(readingId: string | undefined) {
    if (!readingId) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta lectura?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              const loader = await this.loadingController.create({
                message: 'Eliminando lectura...'
              });
              await loader.present();

              await this.readingService.deleteReading(readingId);
              this.showToast('Lectura eliminada exitosamente', 'success');
              await loader.dismiss();
              // La suscripción en tiempo real actualizará automáticamente
            } catch (error) {
              console.error('Error deleting reading:', error);
              this.showToast('Error al eliminar la lectura', 'danger');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async viewReading(reading: Reading) {
    this.router.navigate(['/reading-detail', reading.id], {
      state: { reading }
    });
  }

  async logout() {
    try {
      const loader = await this.loadingController.create({
        message: 'Cerrando sesión...'
      });
      await loader.present();

      await this.authService.logout().toPromise();
      this.showToast('Sesión cerrada', 'success');
      await loader.dismiss();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
      this.showToast('Error al cerrar sesión', 'danger');
    }
  }

  goToNewReading() {
    this.router.navigate(['/new-reading']);
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

  formatDate(date: any): string {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }
}
