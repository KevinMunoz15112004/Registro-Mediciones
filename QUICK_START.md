# Guía Rápida de Inicio

## Configuración Inicial (5 minutos)

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Firebase
1. Crear proyecto en https://console.firebase.google.com
2. Copiar credenciales en `src/environments/firebase.config.ts`

Ejemplo:
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

### 3. Crear colecciones en Firestore
- `users` - Se crea automáticamente al registrar primer usuario
- `readings` - Se crea automáticamente al guardar primera lectura

### 4. Ejecutar en desarrollo
```bash
npm start
```

Acceder a: http://localhost:4200

## Crear Cuenta de Prueba

1. Abrir http://localhost:4200
2. Hacer clic en "Crear una"
3. Rellenar:
   - Email: `medidor1@example.com`
   - Contraseña: `123456`
   - Nombre: `Juan Pérez`
   - Rol: `Medidor`
4. Hacer clic en "Registrarse"
5. Iniciar sesión con las mismas credenciales

## Probar Funcionalidad Principal

### Registrar una lectura:
1. En Dashboard, hacer clic en el botón "+" (esquina inferior derecha)
2. Hacer clic en "Capturar Foto del Medidor"
3. Permitir acceso a cámara y tomar una foto
4. Hacer clic en "Capturar Foto de la Fachada"
5. Permitir acceso a cámara y tomar una foto
6. Hacer clic en "Obtener Ubicación"
7. Permitir acceso a ubicación
8. Rellenar valor del medidor: `125.50`
9. Agregar observaciones (opcional)
10. Hacer clic en "Guardar Lectura"

### Ver detalles:
1. En la lista de lecturas, hacer clic en "Ver Detalles"
2. Hacer clic en "Ver en Google Maps" para abrir ubicación

## Crear Cuenta Admin

1. Abrir incógnito/nueva ventana
2. Registrarse con:
   - Email: `admin@example.com`
   - Contraseña: `123456`
   - Nombre: `Administrador`
   - Rol: `Administrador`

Como admin, verás TODAS las lecturas del sistema.

## Estructura de Carpetas Importante

```
src/
├── app/
│   ├── auth/login/          → Página de login/registro
│   ├── dashboard/           → Vista principal de lecturas
│   ├── readings/
│   │   ├── new-reading/    → Registrar nueva lectura
│   │   └── reading-detail/ → Ver detalles
│   ├── services/            → Servicios (Auth, Reading, Camera, Location)
│   ├── guards/              → Protección de rutas
│   └── models/              → Interfaces de datos
├── environments/
│   └── firebase.config.ts  → Configuración de Firebase
└── main.ts                  → Inicio de aplicación
```

## Servicios Implementados

### AuthService
- Registro e inicio de sesión
- Gestión de usuarios

### ReadingService
- Guardar/obtener lecturas
- Eliminar lecturas

### CameraService
- Capturar fotos

### LocationService
- Obtener ubicación GPS
- Generar enlace Google Maps

## Archivos de Documentación

- **README_APP.md** - Documentación completa
- **DEPLOYMENT_GUIDE.md** - Guía para desplegar en Android/iOS
- **TEST_PLAN.md** - Casos de prueba
- **QUICK_START.md** - Este archivo

## Troubleshooting Común

### "Firebase not initialized"
→ Verificar `firebase.config.ts` con credenciales correctas

### "Camera permission denied"
→ En navegador: permitir cámara en configuración
→ En dispositivo: permitir permisos en configuración del SO

### "Geolocation permission denied"
→ En navegador: permitir ubicación en configuración
→ En dispositivo: permitir permisos en configuración del SO

### "Las fotos no aparecen"
→ Verificar que estén guardadas como base64 en Firestore
→ Revisar tamaño del documento (máximo 1MB)

## Próximos Pasos

1. Llenar datos reales en `firebase.config.ts`
2. Configurar reglas de seguridad en Firestore
3. Crear cuentas de prueba para medidores y admin
4. Probar en dispositivo real (Android/iOS)
5. Ver `DEPLOYMENT_GUIDE.md` para publicar

## Contacto y Soporte

Para preguntas o reportar bugs, contactar al equipo de desarrollo.

## Recursos Útiles

- [Documentación Ionic](https://ionicframework.com/docs)
- [Documentación Angular](https://angular.io/docs)
- [Documentación Firebase](https://firebase.google.com/docs)
- [Documentación Capacitor](https://capacitorjs.com/docs)
