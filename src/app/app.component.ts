import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../environments/firebase.config';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // Initialize Firebase
    if (firebaseConfig.projectId !== 'YOUR_PROJECT_ID') {
      initializeApp(firebaseConfig);
    }
  }
}

