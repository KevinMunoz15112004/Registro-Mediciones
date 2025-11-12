import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton, IonInput, IonText, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonHeader, IonToolbar, IonTitle, IonSpinner } from '@ionic/angular/standalone';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
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
    IonSpinner
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form!: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
  }

  async login() {
    if (this.form.invalid) {
      this.showToast('Por favor, completa todos los campos correctamente', 'warning');
      return;
    }

    this.isLoading = true;
    const loader = await this.loadingController.create({
      message: 'Iniciando sesión...'
    });
    await loader.present();

    try {
      const { email, password } = this.form.value;
      await this.authService.login(email, password).toPromise();
      this.showToast('¡Sesión iniciada exitosamente!', 'success');
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      let message = 'Error al iniciar sesión';
      if (error.code === 'auth/user-not-found') {
        message = 'El usuario no existe';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Contraseña incorrecta';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Correo inválido';
      } else if (error.code === 'auth/invalid-credential') {
        message = 'Correo o contraseña inválidos';
      }
      this.showToast(message, 'danger');
    } finally {
      this.isLoading = false;
      await loader.dismiss();
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
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

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}
