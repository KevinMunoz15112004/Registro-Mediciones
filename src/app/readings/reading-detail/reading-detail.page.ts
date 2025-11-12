import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonHeader, IonToolbar, IonTitle, IonBackButton, IonText, IonImg, IonIcon, IonButtons } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { Reading } from '../../models/reading.model';
import { addIcons } from 'ionicons';
import { open } from 'ionicons/icons';

addIcons({ open });

@Component({
  selector: 'app-reading-detail',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonBackButton,
    IonText,
    IonImg,
    IonIcon,
    IonButtons
  ],
  templateUrl: './reading-detail.page.html',
  styleUrls: ['./reading-detail.page.scss'],
})
export class ReadingDetailPage implements OnInit {
  reading: Reading | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.reading = navigation.extras.state['reading'];
    }
  }

  ngOnInit() {
    if (!this.reading) {
      this.router.navigate(['/dashboard']);
    }
  }

  openMapsLink() {
    if (this.reading?.mapsLink) {
      window.open(this.reading.mapsLink, '_blank');
    }
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
