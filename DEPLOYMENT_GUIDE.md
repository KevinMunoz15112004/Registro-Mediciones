# Guía de Despliegue - Aplicación Medidor de Agua Quito

## Requisitos Previos

- Node.js v18+ instalado
- npm o yarn instalado
- Android Studio (para Android) o Xcode (para iOS)
- Cuenta de Firebase activa
- Cuenta de Capacitor (opcional, para notificaciones)

## Paso 1: Preparar el Proyecto

### 1.1 Clonar o descargar el proyecto

```bash
cd AppDeber
npm install
```

### 1.2 Configurar Firebase

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Crear un nuevo proyecto llamado "Medidor Quito"
3. Registrar la aplicación web y obtener las credenciales
4. Copiar las credenciales en `src/environments/firebase.config.ts`:

```typescript
export const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "medidor-quito.firebaseapp.com",
  projectId: "medidor-quito",
  storageBucket: "medidor-quito.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123...",
  measurementId: "G-ABC123..."
};
```

### 1.3 Configurar Firestore

1. En Firebase Console, ir a **Firestore Database**
2. Crear una base de datos en modo prueba (región: sudamérica - Colombia/São Paulo)
3. Crear una colección llamada `users` (auto-create)
4. Crear una colección llamada `readings` (auto-create)

### 1.4 Configurar Firebase Authentication

1. En Firebase Console, ir a **Authentication**
2. Habilitar **Correo electrónico/Contraseña**
3. Opcional: Habilitar otros métodos (Google, Facebook, etc.)

### 1.5 Actualizar Reglas de Firestore

En Firebase Console, en **Firestore Database** → **Reglas**, reemplazar con:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Colección de usuarios
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow create: if request.auth.uid == resource.data.uid;
      allow update, delete: if request.auth.uid == userId;
    }
    
    // Colección de lecturas
    match /readings/{readingId} {
      allow read: if 
        request.auth.uid == resource.data.userId || 
        (request.auth != null && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth.uid == request.resource.data.userId;
      allow update: if request.auth.uid == resource.data.userId;
      allow delete: if 
        request.auth.uid == resource.data.userId ||
        (request.auth != null && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

## Paso 2: Desarrollo Local

### 2.1 Ejecutar la aplicación en navegador

```bash
npm start
```

Acceder a `http://localhost:4200`

### 2.2 Testing en dispositivo con Ionic DevApp

```bash
npm install -g @ionic/cli
ionic serve
```

## Paso 3: Despliegue en Android

### 3.1 Instalar Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "MedidorQuito" "com.quito.medidor"
```

### 3.2 Agregar plataforma Android

```bash
npx cap add android
```

### 3.3 Buildear la aplicación web

```bash
npm run build
```

### 3.4 Copiar archivos al proyecto Android

```bash
npx cap copy android
```

### 3.5 Abrir en Android Studio

```bash
npx cap open android
```

### 3.6 Configurar en Android Studio

1. Actualizar `minSdkVersion` a 21 en `build.gradle`
2. Sincronizar proyecto
3. Conectar dispositivo Android o iniciar emulador
4. Hacer clic en "Run" → "Run 'app'"

### 3.7 Permisos en AndroidManifest.xml (automático con Capacitor)

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
```

## Paso 4: Despliegue en iOS (macOS requerido)

### 4.1 Instalar Capacitor

```bash
npm install @capacitor/core @capacitor/cli
```

### 4.2 Agregar plataforma iOS

```bash
npx cap add ios
```

### 4.3 Buildear y copiar

```bash
npm run build
npx cap copy ios
```

### 4.4 Abrir en Xcode

```bash
npx cap open ios
```

### 4.5 Configurar en Xcode

1. Seleccionar proyecto "App"
2. En "Signing & Capabilities" agregar tu Apple Development Team
3. Conectar iPhone o usar simulador
4. Hacer clic en "Run"

### 4.6 Configurar Info.plist (automático)

Los permisos se configuran automáticamente en `Info.plist`:
- Camera
- Location
- Internet

## Paso 5: Construir APK/IPA para Distribución

### Para Android (APK)

```bash
cd android
./gradlew assembleRelease
```

El APK se creará en: `android/app/build/outputs/apk/release/app-release.apk`

### Para iOS (IPA)

En Xcode:
1. Product → Build For → Running
2. Product → Archive
3. Organizer → Distribute App

## Paso 6: Publicar en App Store

### Google Play Store

1. Crear cuenta developer en [Google Play Console](https://play.google.com/apps/publish)
2. Crear nueva aplicación
3. Completar información:
   - Nombre: "Medidor de Agua Quito"
   - Descripción
   - Screenshots
   - Categoría: Utilidades
   - Contenido inapropiado: Ninguno
4. Subir APK firmado (release build)
5. Configurar precios y distribución
6. Enviar para revisión

### Apple App Store

1. Crear cuenta developer en [Apple Developer](https://developer.apple.com)
2. Crear nuevo certificado y provisioning profile
3. En App Store Connect crear nueva app
4. Completar información similar a Play Store
5. Subir IPA firmado (build)
6. Enviar para revisión

## Paso 7: Configuración de Producción

### 7.1 Crear archivo environment.prod.ts

```typescript
export const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "medidor-quito.firebaseapp.com",
  projectId: "medidor-quito",
  storageBucket: "medidor-quito.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123...",
};
```

### 7.2 Actualizar capacitor.config.ts para producción

```typescript
const config: CapacitorConfig = {
  appId: 'com.quito.medidor',
  appName: 'Medidor Quito',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      permissions: ['camera']
    },
    Geolocation: {
      permissions: ['geolocation']
    }
  }
};
```

## Paso 8: Monitoreo y Mantenimiento

### Monitoreo en Firebase

1. Firebase Console → Performance
2. Firebase Console → Crashlytics (opcional)
3. Firebase Console → Analytics (opcional)

### Actualizar Firestore cuando sea necesario

```bash
npm update @angular/fire firebase
npx cap update
```

### Reproducir errores con Firebase

Los errores se pueden rastrear en:
- Browser Console (desarrollo)
- Firebase Console → Firestore → Auditoría
- Device Logcat (Android)
- Xcode Console (iOS)

## Troubleshooting de Despliegue

### Problema: "Plugin not found"
**Solución**: Ejecutar `npx cap sync`

### Problema: "Build failed Android"
**Solución**: 
- Limpiar: `cd android && ./gradlew clean && cd ..`
- Actualizar gradle en Android Studio

### Problema: "CORS error"
**Solución**: Firebase Auth y Firestore no tienen CORS en dispositivos móviles.

### Problema: "Photos no se guardan"
**Solución**: Aumentar límite de Firestore (1MB por documento). Considerar comprimir imágenes.

## Verificar Lista de Despliegue

- [ ] Firebase configurado correctamente
- [ ] Reglas de Firestore actualizadas
- [ ] Permisos configurados (camera, location)
- [ ] AndroidManifest.xml actualizado (Android)
- [ ] Info.plist actualizado (iOS)
- [ ] APK/IPA generado correctamente
- [ ] Testear en dispositivo real
- [ ] Privacidad/Términos listos
- [ ] Screenshots y descripción preparados
- [ ] Contacto de soporte configurado

## Rollback (en caso de error)

Si hay problemas después de desplegar:

### Android
1. Google Play Console → Versión → Pausar publicación
2. Esperar propagación (puede tomar horas)

### iOS
1. App Store Connect → Versión → Remover de venta
2. Esperar propagación

## Soporte Post-Despliegue

Mantener actualizado:
- Firebase SDKs
- Angular
- Ionic
- Capacitor
- Dependencias de seguridad

Revisar regularmente:
- Firebase Console for usage and limits
- Error reporting
- Performance metrics
