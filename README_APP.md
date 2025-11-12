# Aplicación de Medidor de Agua - Quito

## Descripción

Aplicación móvil desarrollada en **Ionic** y **Angular** para registrar y validar lecturas de medidores de agua en el Distrito Metropolitano de Quito. La aplicación permite a los medidores capturar fotografías, ubicación GPS y valores de lectura, con un sistema de roles para administradores y medidores.

## Características Principales

### 1. **Autenticación y Autorización**
- Registro e inicio de sesión de usuarios
- Dos roles de usuario:
  - **Medidor**: Puede registrar nuevas lecturas y ver solo sus propios registros
  - **Administrador**: Puede ver todas las lecturas registradas en el sistema

### 2. **Captura de Datos**
- **Fotografía del medidor**: Evidencia visual del valor del medidor
- **Fotografía de la fachada**: Registro visual de la ubicación
- **Ubicación GPS**: Coordenadas automáticas desde el dispositivo
- **Valor del medidor**: Entrada manual del valor en m³
- **Observaciones adicionales**: Campo opcional para notas
- **Zona**: Identificación de la zona de lectura

### 3. **Integración con Google Maps**
- Enlace automático que abre la ubicación exacta en Google Maps
- Permite validación visual de la ubicación registrada

### 4. **Gestión de Datos**
- Almacenamiento de todas las lecturas en Firestore
- Historial completo de lecturas con información del usuario
- Eliminación de registros propios (solo para medidores)
- Vista detallada de cada lectura con fotos y ubicación

### 5. **Servicios Firebase Utilizados**
- **Firebase Authentication**: Gestión de usuarios
- **Firestore Database**: Almacenamiento de registros de lecturas
- **Realtime Database**: Disponible para futuras extensiones

## Estructura del Proyecto

```
src/
├── app/
│   ├── auth/
│   │   └── login/
│   │       ├── login.page.ts
│   │       ├── login.page.html
│   │       └── login.page.scss
│   ├── dashboard/
│   │   ├── dashboard.page.ts
│   │   ├── dashboard.page.html
│   │   └── dashboard.page.scss
│   ├── readings/
│   │   ├── new-reading/
│   │   │   ├── new-reading.page.ts
│   │   │   ├── new-reading.page.html
│   │   │   └── new-reading.page.scss
│   │   └── reading-detail/
│   │       ├── reading-detail.page.ts
│   │       ├── reading-detail.page.html
│   │       └── reading-detail.page.scss
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── reading.service.ts
│   │   ├── camera.service.ts
│   │   └── location.service.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── admin.guard.ts
│   ├── models/
│   │   └── reading.model.ts
│   ├── app.routes.ts
│   └── app.component.ts
├── environments/
│   └── firebase.config.ts
└── main.ts
```

## Configuración Inicial

### 1. **Instalar Dependencias**

```bash
npm install
```

Las siguientes dependencias ya están incluidas:
- `@angular/fire` - Integración de Firebase con Angular
- `firebase` - SDK de Firebase
- `@capacitor/camera` - Acceso a cámara
- `@capacitor/geolocation` - Acceso a GPS

### 2. **Configurar Firebase**

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar los siguientes servicios:
   - **Authentication**: Autenticación por correo/contraseña
   - **Firestore Database**: Crear una base de datos en modo de prueba (ajustar reglas de seguridad después)
   - **Realtime Database**: Crear una instancia (opcional para futuras extensiones)

3. Copiar la configuración de Firebase y actualizar `src/environments/firebase.config.ts`:

```typescript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### 3. **Configurar Reglas de Seguridad de Firestore**

Actualizar las reglas en Firebase Console:

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

## Instalación y Ejecución

### Desarrollo

```bash
npm start
```

La aplicación se abrirá en `http://localhost:4200`

### Construcción para producción

```bash
npm run build
```

### Compilación para dispositivo mobile

```bash
ionic build
ionic cap add android
ionic cap open android

# o para iOS
ionic cap add ios
ionic cap open ios
```

## Flujo de la Aplicación

### 1. **Login/Registro**
- Usuario ingresa correo y contraseña
- Para nuevo usuario: selecciona su rol (Medidor o Administrador)
- Se crea automáticamente el registro en Firestore

### 2. **Dashboard**
- **Medidor**: Ve solo sus lecturas y puede agregar nuevas
- **Administrador**: Ve todas las lecturas del sistema

### 3. **Registrar Nueva Lectura** (solo Medidores)
1. Capturar foto del medidor
2. Capturar foto de la fachada
3. Obtener ubicación GPS
4. Ingresar valor del medidor
5. Agregar observaciones (opcional)
6. Especificar zona (opcional)
7. Guardar registro

### 4. **Ver Detalles**
- Acceso a todas las fotos en resolución completa
- Información de ubicación con enlace a Google Maps
- Datos del medidor y observaciones

## Modelos de Datos

### Usuario (Firestore: `users/{uid}`)
```typescript
interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'meter-reader';
  createdAt: Date;
  photoUrl?: string;
}
```

### Lectura (Firestore: `readings/{readingId}`)
```typescript
interface Reading {
  id?: string;
  userId: string;
  meterValue: number;
  observations: string;
  meterPhotoUrl: string;         // Base64
  facadePhotoUrl: string;        // Base64
  latitude: number;
  longitude: number;
  mapsLink: string;
  createdAt: Date;
  updatedAt?: Date;
  userName?: string;
  userEmail?: string;
  zone?: string;
}
```

## Permisos Requeridos

La aplicación requiere los siguientes permisos en `capacitor.config.ts`:

```typescript
const config: CapacitorConfig = {
  appId: 'com.example.medidorquito',
  appName: 'Medidor Quito',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    Geolocation: {
      permissions: ['geolocation']
    }
  }
};
```

## Servicios Implementados

### AuthService
- `register()`: Registrar nuevo usuario
- `login()`: Iniciar sesión
- `logout()`: Cerrar sesión
- `getCurrentUser()`: Obtener usuario actual
- `getUserData()`: Obtener datos del usuario desde Firestore
- `getUserRole()`: Obtener rol del usuario

### ReadingService
- `saveReading()`: Guardar nueva lectura
- `updateReading()`: Actualizar lectura existente
- `getMyReadings()`: Obtener lecturas del usuario actual
- `getAllReadings()`: Obtener todas las lecturas (admin)
- `getReadingById()`: Obtener una lectura específica
- `deleteReading()`: Eliminar lectura
- `uploadPhoto()`: Procesar foto (almacenada como base64)

### CameraService
- `takeMeterPhoto()`: Capturar foto del medidor
- `takeFacadePhoto()`: Capturar foto de la fachada
- `pickPhotoFromGallery()`: Seleccionar foto de galería

### LocationService
- `getCurrentLocation()`: Obtener ubicación GPS actual
- `generateMapsLink()`: Generar enlace de Google Maps
- `requestPermissions()`: Solicitar permisos de ubicación

## Guards de Autenticación

### AuthGuard
- Protege rutas autenticadas
- Redirige a login si el usuario no está autenticado

### AdminGuard
- Verifica que el usuario sea administrador
- Redirige al dashboard si no es admin

## Troubleshooting

### Problema: "Firebase not initialized"
**Solución**: Verificar que `firebase.config.ts` esté correctamente completado con las credenciales de tu proyecto Firebase.

### Problema: "Camera permission denied"
**Solución**: En dispositivo real, el usuario debe permitir acceso a cámara en configuración del dispositivo.

### Problema: "Geolocation permission denied"
**Solución**: En dispositivo real, el usuario debe permitir acceso a ubicación en configuración del dispositivo.

### Problema: Las fotos no se guardan
**Solución**: Las fotos se guardan como base64 en Firestore. Verificar que el documento no exceda el límite de 1MB de Firestore. Para imágenes grandes, considera optimizarlas antes de guardar.

## Seguridad

### Recomendaciones de Seguridad

1. **Reglas de Firestore**: Implementar reglas adecuadas para proteger los datos
2. **Variables de entorno**: Nunca commitear credenciales reales
3. **HTTPS**: La aplicación debe usar HTTPS en producción
4. **Validación**: Toda entrada de usuario debe validarse en cliente y servidor
5. **Rate Limiting**: Implementar rate limiting para prevenir abuso

## Extensiones Futuras

- Integración con Realtime Database para sincronización en tiempo real
- Reportes y estadísticas de lecturas
- Exportación de datos a CSV/PDF
- Notificaciones push
- Modo offline con sincronización
- Búsqueda avanzada de lecturas
- Gráficos de consumo

## Licencia

Este proyecto es privado y está desarrollado para el Distrito Metropolitano de Quito.

## Soporte

Para reportar bugs o solicitar características, contactar al equipo de desarrollo.
