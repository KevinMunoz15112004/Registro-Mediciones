import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton, IonInput, IonText, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonHeader, IonToolbar, IonTitle, IonSpinner, IonSegment, IonSegmentButton, IonLabel, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
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
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonButtons,
    IonBackButton
  ],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  form!: FormGroup;
  isLoading = false;
  selectedRole: 'meter-reader' | 'admin' = 'meter-reader';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      displayName: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  onRoleChange(event: any) {
    const value = event.detail.value;
    if (value === 'meter-reader' || value === 'admin') {
      this.selectedRole = value;
    }
  }

  async register() {
    if (this.form.invalid) {
      this.showToast('Por favor, completa todos los campos correctamente', 'warning');
      return;
    }

    const { password, confirmPassword } = this.form.value;
    if (password !== confirmPassword) {
      this.showToast('Las contraseñas no coinciden', 'warning');
      return;
    }

    this.isLoading = true;
    const loader = await this.loadingController.create({
      message: 'Registrando usuario...'
    });
    await loader.present();

    try {
      const { email, password, displayName } = this.form.value;
      await this.authService.register(email, password, displayName, this.selectedRole).toPromise();
      this.showToast('¡Registro exitoso! Ya puedes iniciar sesión', 'success');
      this.router.navigate(['/login']);
    } catch (error: any) {
      let message = 'Error al registrar usuario';
      if (error.code === 'auth/email-already-in-use') {
        message = 'El correo ya está registrado';
      } else if (error.code === 'auth/weak-password') {
        message = 'La contraseña es muy débil';
      } else if (error.code === 'auth/invalid-email') {
        message = 'El correo es inválido';
      }
      this.showToast(message, 'danger');
    } finally {
      this.isLoading = false;
      await loader.dismiss();
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
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

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  get displayName() {
    return this.form.get('displayName');
  }
}
